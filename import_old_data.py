# -*- coding: utf-8 -*-
import struct
import sqlite3
import os
import shutil
import json

# Legacy Bamini Tamil font mapping tables for byte-level decoding
BYTE_VOWELS = {
    171: 'அ', 172: 'ஆ', 254: 'இ', 255: 'ஈ',
    175: 'உ', 176: 'ஊ', 177: 'எ', 178: 'ஏ',
    179: 'ஐ', 180: 'ஒ', 181: 'ஓ', 182: 'ஔ',
    183: 'ஃ'
}

BYTE_CONSONANTS = {
    184: 'க', 185: 'ங', 186: 'ச', 187: 'ஞ',
    188: 'ட', 189: 'ண', 190: 'த', 191: 'ந',
    192: 'ப', 193: 'ம', 194: 'ய', 195: 'ர',
    196: 'ல', 197: 'வ', 198: 'ழ', 199: 'ள',
    200: 'ற', 201: 'ன',
    131: 'ஜ', 133: 'ஷ', 134: 'ஸ', 135: 'ஹ',
    137: 'க்ஷ'
}

BYTE_PULLI = {
    236: 'க்', 237: 'ங்', 238: 'ச்', 239: 'ஞ்',
    240: 'ட்', 241: 'ண்', 242: 'த்', 243: 'ந்',
    244: 'ப்', 245: 'ம்', 246: 'ய்', 247: 'ர்',
    248: 'ல்', 249: 'வ்', 250: 'ழ்', 251: 'ள்',
    252: 'ற்', 253: 'ன்',
    138: 'ஸ்'
}

BYTE_U = {
    204: 'கு', 205: 'சு', 206: 'டு', 207: 'ணு',
    208: 'து', 209: 'நு', 210: 'பு', 211: 'மு',
    212: 'யு', 213: 'ரு', 214: 'லு', 215: 'வு',
    216: 'ழு', 217: 'ளு', 218: 'று', 219: 'னு'
}

BYTE_OO = {
    220: 'கூ', 221: 'சூ', 222: 'டூ', 223: 'ணூ',
    224: 'தூ', 225: 'நூ', 226: 'பூ', 227: 'மூ',
    228: 'யூ', 229: 'ரூ', 230: 'லூ', 231: 'வூ',
    232: 'ழூ', 233: 'ளூ', 234: 'றூ', 235: 'னூ'
}

def byte_bamini_to_unicode(byte_data):
    out = []
    i = 0
    n = len(byte_data)
    
    while i < n:
        b = byte_data[i]
        
        # Prefixes: ெ (166 / 0xa6), ே (167 / 0xa7), ை (168 / 0xa8)
        if b in (166, 167, 168):
            if i + 1 < n:
                b2 = byte_data[i + 1]
                if b2 in BYTE_CONSONANTS:
                    tamil_cons = BYTE_CONSONANTS[b2]
                    # check for third byte ா (161 / 0xa1) or ள (199 / 0xc7)
                    if i + 2 < n and byte_data[i + 2] == 161:
                        if b == 166:
                            out.append(tamil_cons + 'ொ')
                        elif b == 167:
                            out.append(tamil_cons + 'ோ')
                        i += 3
                        continue
                    elif i + 2 < n and byte_data[i + 2] == 199:
                        if b == 166:
                            out.append(tamil_cons + 'ௌ')
                        i += 3
                        continue
                    else:
                        if b == 166:
                            out.append(tamil_cons + 'ெ')
                        elif b == 167:
                            out.append(tamil_cons + 'ே')
                        elif b == 168:
                            out.append(tamil_cons + 'ை')
                        i += 2
                        continue
            out.append(chr(b))
            i += 1
            
        elif b in BYTE_VOWELS:
            out.append(BYTE_VOWELS[b])
            i += 1
            
        elif b in BYTE_PULLI:
            out.append(BYTE_PULLI[b])
            i += 1
            
        elif b in BYTE_U:
            out.append(BYTE_U[b])
            i += 1
            
        elif b in BYTE_OO:
            out.append(BYTE_OO[b])
            i += 1
            
        elif b in BYTE_CONSONANTS:
            tamil_cons = BYTE_CONSONANTS[b]
            if i + 1 < n:
                b2 = byte_data[i + 1]
                if b2 == 161: # ா
                    out.append(tamil_cons + 'ா')
                    i += 2
                    continue
                elif b2 == 162: # ி
                    out.append(tamil_cons + 'ி')
                    i += 2
                    continue
                elif b2 == 163: # ீ
                    out.append(tamil_cons + 'ீ')
                    i += 2
                    continue
            out.append(tamil_cons)
            i += 1
            
        else:
            # Keep standard printable ASCII
            if 32 <= b <= 126:
                out.append(chr(b))
            else:
                out.append(bytes([b]).decode('cp1252', errors='replace'))
            i += 1
            
    return "".join(out)

def read_dbf_table(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return []

    with open(filepath, 'rb') as f:
        header_data = f.read(32)
        if len(header_data) < 32:
            return []
        
        file_type, yy, mm, dd, num_records, header_len, record_len = struct.unpack(
            '<BBBBLHH', header_data[:12]
        )
        
        fields = []
        num_fields = (header_len - 33) // 32
        for _ in range(num_fields):
            field_data = f.read(32)
            if len(field_data) < 32 or field_data[0] == 0x0D:
                break
            field_name = field_data[:11].split(b'\x00')[0].decode('ascii', errors='ignore').strip()
            fields.append({
                'name': field_name,
                'len': field_data[16]
            })
            
        f.seek(header_len)
        records = []
        for _ in range(num_records):
            record_data = f.read(record_len)
            if len(record_data) < record_len:
                break
            
            # Check delete flag: '*' represents deleted
            is_deleted = record_data[0] == 0x2A
            
            record = {'_deleted': is_deleted}
            offset = 1
            for fld in fields:
                val_bytes = record_data[offset : offset + fld['len']]
                offset += fld['len']
                record[fld['name']] = val_bytes
            records.append(record)
            
        return records

def clean_group_name(group_name):
    group_name = group_name.strip()
    if group_name.startswith("05%") or group_name.startswith("18%") or group_name.startswith("12%") or group_name.startswith("28%") or group_name.startswith("0%"):
        parts = group_name.split()
        if len(parts) > 1:
            return parts[1]
    return group_name

def normalize_unit(unit_str):
    unit_str = unit_str.upper().strip()
    if unit_str in ('KG', 'KGS', 'KIL'):
        return 'kg'
    elif unit_str in ('LTR', 'LIT', 'LITRE'):
        return 'litre'
    elif unit_str in ('PAC', 'PACK', 'PKT', 'PKTS'):
        return 'packet'
    elif unit_str in ('BOX', 'BOXES'):
        return 'box'
    else:
        return 'piece'

def main():
    data_dir = r"C:\Users\tarun\Downloads\COLLEGE\projects\ps\Old_sms\SMS\data"
    
    print("Step 1: Reading unit mapping table (UN012026.dbf)...")
    un_records = read_dbf_table(os.path.join(data_dir, "UN012026.dbf"))
    units_map = {}
    for r in un_records:
        if r['_deleted']:
            continue
        code_bytes = r.get('UNITCODE', b'')
        name_bytes = r.get('UNIT', b'')
        code = code_bytes.decode('cp1252', errors='replace').strip() if code_bytes else ""
        name = name_bytes.decode('cp1252', errors='replace').strip() if name_bytes else ""
        if code:
            units_map[code] = normalize_unit(name)
    print(f"Loaded {len(units_map)} unit code mappings.")

    print("\nStep 2: Reading group mapping table (IG012026.DBF)...")
    ig_records = read_dbf_table(os.path.join(data_dir, "IG012026.DBF"))
    groups_map = {}
    for r in ig_records:
        if r['_deleted']:
            continue
        code_bytes = r.get('IGROUPCODE', b'')
        font_bytes = r.get('FONT', b'').strip(b' \x00')
        eng_bytes = r.get('IGROUP', b'')
        
        code = code_bytes.decode('cp1252', errors='replace').strip() if code_bytes else ""
        tamil_name = byte_bamini_to_unicode(font_bytes) if font_bytes else ""
        english_name = eng_bytes.decode('cp1252', errors='replace').strip() if eng_bytes else ""
        
        group_display = tamil_name if tamil_name else clean_group_name(english_name)
        if code:
            groups_map[code] = group_display
    print(f"Loaded {len(groups_map)} group mappings.")

    print("\nStep 3: Loading item master table (IM012026.DBF)...")
    im_records = read_dbf_table(os.path.join(data_dir, "IM012026.DBF"))
    print(f"Total raw items read: {len(im_records)}")

    # Connect to SQLite database
    sqlite_path = os.path.expandvars(r"%APPDATA%\ps\billing.db")
    print(f"\nStep 4: Preparing target SQLite Database at {sqlite_path}...")
    
    if os.path.exists(sqlite_path):
        backup_path = sqlite_path + ".bak"
        shutil.copy2(sqlite_path, backup_path)
        print(f"Backup created at {backup_path}")
    else:
        print("Target SQLite file not found, creating a new database...")
        os.makedirs(os.path.dirname(sqlite_path), exist_ok=True)

    conn = sqlite3.connect(sqlite_path)
    cursor = conn.cursor()

    # Clear existing products
    cursor.execute("DELETE FROM products")
    print("Cleared existing products from target SQLite table.")

    inserted_count = 0
    for r in im_records:
        if r['_deleted']:
            continue
        
        code_bytes = r.get('CODE', b'')
        name_bytes = r.get('ITEM', b'')
        
        code = code_bytes.decode('cp1252', errors='replace').strip() if code_bytes else ""
        name = name_bytes.decode('cp1252', errors='replace').strip() if name_bytes else ""
        
        if not code or not name:
            continue
        
        font_bytes = r.get('FONT', b'').strip(b' \x00')
        tamil_name = byte_bamini_to_unicode(font_bytes) if font_bytes else ""
        
        # Prices
        srate_bytes = r.get('SRATE', b'').decode('cp1252', errors='replace').strip()
        mrp_bytes = r.get('MRP', b'').decode('cp1252', errors='replace').strip()
        crate_bytes = r.get('CRATE', b'').decode('cp1252', errors='replace').strip()
        cs_bytes = r.get('CS', b'').decode('cp1252', errors='replace').strip() if r.get('CS') else ""
        os_bytes = r.get('OS', b'').decode('cp1252', errors='replace').strip() if r.get('OS') else ""
        
        selling_price = float(srate_bytes) if srate_bytes else 0.0
        mrp = float(mrp_bytes) if mrp_bytes else 0.0
        cost_price = float(crate_bytes) if crate_bytes else 0.0
        current_stock = float(cs_bytes) if cs_bytes else 0.0
        opening_stock = float(os_bytes) if os_bytes else 0.0
        
        if mrp == 0.0:
            mrp = selling_price
        if selling_price == 0.0:
            selling_price = mrp
            
        group_code = r.get('IGROUPCODE', b'').decode('cp1252', errors='replace').strip()
        group_name = groups_map.get(group_code, "Groceries")
        
        unit_code = r.get('UNITCODE', b'').decode('cp1252', errors='replace').strip()
        unit = units_map.get(unit_code, "piece")
        
        price_type = "Quantity" if unit in ('kg', 'litre') else "Fixed"
        
        disabled_val = r.get('DISABLE', b'').decode('cp1252', errors='replace').strip()
        disable_item = 1 if disabled_val in ('Y', 'T') else 0

        slabs = json.dumps([])

        cursor.execute("""
            INSERT OR REPLACE INTO products 
            (code, name, tamilName, product_group, unit, priceType, sellingPrice, mrp, costPrice, openingStock, currentStock, disableItem, slabs)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            code, name, tamil_name, group_name, unit, price_type,
            selling_price, mrp, cost_price, opening_stock, current_stock,
            disable_item, slabs
        ))
        inserted_count += 1

    conn.commit()
    conn.close()
    print(f"\nMigration completed successfully! Imported {inserted_count} products into SQLite database.")

if __name__ == '__main__':
    main()
