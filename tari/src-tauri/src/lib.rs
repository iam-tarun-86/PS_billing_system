use tauri::{AppHandle, Manager};
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use serde_json::Value;

/// Serialises database writes. Tauri runs commands on a thread pool, so two quick saves
/// could otherwise interleave inside db_write and leave a half-written file behind.
#[derive(Default)]
struct DbLock(Mutex<()>);

const DAILY_BACKUPS_TO_KEEP: usize = 7;

fn app_dir(app: &AppHandle) -> PathBuf {
  let path = app.path().app_data_dir().unwrap_or_else(|_| PathBuf::from("."));
  let _ = fs::create_dir_all(&path);
  path
}

fn get_db_path(app: &AppHandle) -> PathBuf {
  app_dir(app).join("database.json")
}

fn get_log_path(app: &AppHandle) -> PathBuf {
  app_dir(app).join("app.log")
}

fn get_backup_dir(app: &AppHandle) -> PathBuf {
  let path = app_dir(app).join("backups");
  let _ = fs::create_dir_all(&path);
  path
}

// Production logger write function with 1MB rotation limits
fn write_log_file(log_path: &PathBuf, level: &str, message: &str) {
  try_write_log(log_path, level, message);
}

fn try_write_log(log_path: &PathBuf, level: &str, message: &str) {
  if log_path.exists() {
    if let Ok(metadata) = fs::metadata(log_path) {
      if metadata.len() > 1024 * 1024 { // 1 MB rotation cap
        let old_log = log_path.with_extension("log.old");
        if old_log.exists() {
          let _ = fs::remove_file(&old_log);
        }
        let _ = fs::rename(log_path, &old_log);
      }
    }
  }

  let timestamp = chrono::Local::now().to_rfc3339();
  let log_line = format!("[{}] [{}] {}\n", timestamp, level.to_uppercase(), message);
  if let Ok(mut file) = fs::OpenOptions::new().create(true).append(true).open(log_path) {
    let _ = file.write_all(log_line.as_bytes());
  }
}

/// Writes contents to path so that either the whole new file or the whole old file
/// survives a power cut. The flush before the rename is the part that matters: without it
/// the rename can commit while the data is still in the OS cache, leaving a truncated
/// file that parses as nothing.
fn write_file_atomic(path: &Path, contents: &str) -> Result<(), String> {
  let stamp = chrono::Local::now().timestamp_nanos_opt().unwrap_or(0);
  let temp_path = path.with_extension(format!("tmp.{}.{}", std::process::id(), stamp));

  {
    let mut file = fs::File::create(&temp_path).map_err(|e| e.to_string())?;
    file.write_all(contents.as_bytes()).map_err(|e| e.to_string())?;
    file.sync_all().map_err(|e| e.to_string())?;
  }

  if let Err(e) = fs::rename(&temp_path, path) {
    let _ = fs::remove_file(&temp_path);
    return Err(e.to_string());
  }

  Ok(())
}

/// Keeps dated copies of the database beside it: the last 7 days, plus the first write of
/// each month kept indefinitely. Called only after a write has succeeded, so the source is
/// always known-good.
fn refresh_backups(app: &AppHandle, db_path: &Path, log_path: &PathBuf) {
  let dir = get_backup_dir(app);
  let now = chrono::Local::now();

  let daily = dir.join(format!("database-{}.json", now.format("%Y-%m-%d")));
  if let Err(e) = fs::copy(db_path, &daily) {
    write_log_file(log_path, "error", &format!("Daily backup failed: {}", e));
    return;
  }

  let monthly = dir.join(format!("database-monthly-{}.json", now.format("%Y-%m")));
  if !monthly.exists() {
    if let Err(e) = fs::copy(db_path, &monthly) {
      write_log_file(log_path, "error", &format!("Monthly backup failed: {}", e));
    }
  }

  prune_daily_backups(&dir, log_path);
}

fn prune_daily_backups(dir: &Path, log_path: &PathBuf) {
  let mut daily: Vec<PathBuf> = match fs::read_dir(dir) {
    Ok(entries) => entries
      .filter_map(|e| e.ok().map(|e| e.path()))
      .filter(|p| {
        p.file_name()
          .and_then(|n| n.to_str())
          .map(|n| n.starts_with("database-") && !n.starts_with("database-monthly-"))
          .unwrap_or(false)
      })
      .collect(),
    Err(_) => return,
  };

  if daily.len() <= DAILY_BACKUPS_TO_KEEP {
    return;
  }

  // Filenames carry an ISO date, so sorting by name sorts by age.
  daily.sort();
  let cutoff = daily.len() - DAILY_BACKUPS_TO_KEEP;
  for path in daily.iter().take(cutoff) {
    if let Err(e) = fs::remove_file(path) {
      write_log_file(log_path, "error", &format!("Could not prune {:?}: {}", path, e));
    }
  }
}

/// Newest backup that still parses, for when the live file does not.
fn newest_valid_backup(app: &AppHandle) -> Option<(PathBuf, Value)> {
  let dir = get_backup_dir(app);
  let mut candidates: Vec<PathBuf> = fs::read_dir(&dir)
    .ok()?
    .filter_map(|e| e.ok().map(|e| e.path()))
    .filter(|p| p.extension().and_then(|e| e.to_str()) == Some("json"))
    .collect();

  // Newest first.
  candidates.sort();
  candidates.reverse();

  for path in candidates {
    if let Ok(content) = fs::read_to_string(&path) {
      if let Ok(parsed) = serde_json::from_str::<Value>(&content) {
        return Some((path, parsed));
      }
    }
  }
  None
}

// 1. Read Database Command
#[tauri::command]
fn db_read(app: AppHandle) -> Result<Value, String> {
  let db_path = get_db_path(&app);
  let log_path = get_log_path(&app);

  write_log_file(&log_path, "info", "Tauri command db_read requested");

  if !db_path.exists() {
    // Seed database from bundled seed_database.json inside compile target
    write_log_file(&log_path, "info", "Database file not found. Seeding default data...");
    let seed_data = include_str!("../seed_database.json");
    let parsed: Value = serde_json::from_str(seed_data).map_err(|e| e.to_string())?;
    write_file_atomic(&db_path, seed_data)?;
    write_log_file(&log_path, "info", "Default database seeded successfully");
    return Ok(parsed);
  }

  let content = fs::read_to_string(&db_path).map_err(|e| e.to_string())?;

  match serde_json::from_str::<Value>(&content) {
    Ok(parsed) => {
      write_log_file(&log_path, "info", "Database file loaded successfully");
      Ok(parsed)
    }
    // The live file is unreadable. Never fall through to seeding here: that would hand the
    // shop an empty product list and overwrite the real data on the next save.
    Err(parse_err) => {
      write_log_file(
        &log_path,
        "error",
        &format!("Database file is corrupt ({}). Attempting backup recovery.", parse_err),
      );

      match newest_valid_backup(&app) {
        Some((path, parsed)) => {
          let corrupt_copy = db_path.with_extension(format!(
            "corrupt.{}.json",
            chrono::Local::now().format("%Y-%m-%d_%H%M%S")
          ));
          let _ = fs::rename(&db_path, &corrupt_copy);
          write_log_file(
            &log_path,
            "error",
            &format!(
              "Recovered from backup {:?}. Corrupt file kept at {:?}.",
              path, corrupt_copy
            ),
          );
          Ok(parsed)
        }
        None => {
          write_log_file(
            &log_path,
            "error",
            "No usable backup found. Refusing to seed over live data.",
          );
          Err(format!(
            "Database file is corrupt and no usable backup was found: {}",
            parse_err
          ))
        }
      }
    }
  }
}

// 2. Write Database Command
#[tauri::command]
fn db_write(app: AppHandle, state: tauri::State<DbLock>, data: Value) -> Result<bool, String> {
  // Held for the whole write so concurrent saves queue rather than interleave.
  let _guard = state.0.lock().map_err(|e| e.to_string())?;

  let db_path = get_db_path(&app);
  let log_path = get_log_path(&app);

  write_log_file(&log_path, "info", "Tauri command db_write requested");

  // Compact, not pretty: the file is rewritten in full on every single bill.
  let content = serde_json::to_string(&data).map_err(|e| e.to_string())?;

  write_file_atomic(&db_path, &content)?;

  write_log_file(
    &log_path,
    "info",
    &format!("Database file saved successfully ({} bytes)", content.len()),
  );

  refresh_backups(&app, &db_path, &log_path);

  Ok(true)
}

// 3. Log Message Command (Renderer fallback logger)
#[tauri::command]
fn log_message(app: AppHandle, level: String, message: String) -> Result<bool, String> {
  let log_path = get_log_path(&app);
  write_log_file(&log_path, &level, &format!("[Renderer] {}", message));
  Ok(true)
}

// 4. Silent Print Spooler Command
#[tauri::command]
fn print_silent(app: AppHandle) -> Result<bool, String> {
  let log_path = get_log_path(&app);
  write_log_file(&log_path, "info", "Tauri command print_silent requested");

  if let Some(window) = app.get_webview_window("main") {
    // Triggers webview's default print method (system prints to default spooler)
    let _ = window.print();
    write_log_file(&log_path, "info", "Webview print execution spooled");
    Ok(true)
  } else {
    write_log_file(&log_path, "error", "Print failed: WebviewWindow 'main' not found");
    Err("WebviewWindow 'main' not found".to_string())
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .manage(DbLock::default())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      db_read,
      db_write,
      log_message,
      print_silent
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
  use super::*;

  fn scratch(name: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("ps_billing_test_{}_{}", name, std::process::id()));
    let _ = fs::remove_dir_all(&dir);
    fs::create_dir_all(&dir).unwrap();
    dir
  }

  #[test]
  fn atomic_write_replaces_the_file_and_leaves_no_temp_behind() {
    let dir = scratch("atomic");
    let target = dir.join("database.json");

    write_file_atomic(&target, "{\"v\":1}").unwrap();
    assert_eq!(fs::read_to_string(&target).unwrap(), "{\"v\":1}");

    write_file_atomic(&target, "{\"v\":2}").unwrap();
    assert_eq!(fs::read_to_string(&target).unwrap(), "{\"v\":2}");

    // A failed or half-finished write must not leave scratch files in the data folder.
    let leftovers: Vec<_> = fs::read_dir(&dir)
      .unwrap()
      .filter_map(|e| e.ok())
      .filter(|e| e.file_name().to_string_lossy().contains("tmp"))
      .collect();
    assert!(leftovers.is_empty(), "temp files left behind: {:?}", leftovers);

    let _ = fs::remove_dir_all(&dir);
  }

  #[test]
  fn pruning_keeps_the_newest_week_and_never_touches_the_monthlies() {
    let dir = scratch("prune");
    let log = dir.join("app.log");

    // Twelve days of daily backups, plus two monthly ones that must survive.
    for day in 1..=12 {
      fs::write(dir.join(format!("database-2026-08-{:02}.json", day)), "{}").unwrap();
    }
    fs::write(dir.join("database-monthly-2026-07.json"), "{}").unwrap();
    fs::write(dir.join("database-monthly-2026-08.json"), "{}").unwrap();

    prune_daily_backups(&dir, &log);

    let mut remaining: Vec<String> = fs::read_dir(&dir)
      .unwrap()
      .filter_map(|e| e.ok())
      .map(|e| e.file_name().to_string_lossy().to_string())
      .filter(|n| n.ends_with(".json"))
      .collect();
    remaining.sort();

    let dailies: Vec<&String> = remaining.iter().filter(|n| !n.contains("monthly")).collect();
    assert_eq!(dailies.len(), DAILY_BACKUPS_TO_KEEP, "kept {:?}", dailies);
    // The seven kept must be the seven most recent, 06 through 12.
    assert_eq!(*dailies[0], "database-2026-08-06.json".to_string());
    assert_eq!(*dailies[6], "database-2026-08-12.json".to_string());

    assert!(remaining.iter().any(|n| n == "database-monthly-2026-07.json"));
    assert!(remaining.iter().any(|n| n == "database-monthly-2026-08.json"));

    let _ = fs::remove_dir_all(&dir);
  }

  #[test]
  fn pruning_does_nothing_when_under_the_limit() {
    let dir = scratch("under");
    let log = dir.join("app.log");
    for day in 1..=3 {
      fs::write(dir.join(format!("database-2026-08-{:02}.json", day)), "{}").unwrap();
    }

    prune_daily_backups(&dir, &log);

    let count = fs::read_dir(&dir).unwrap().filter_map(|e| e.ok()).count();
    assert_eq!(count, 3);

    let _ = fs::remove_dir_all(&dir);
  }
}
