# Tamil product name corrections — verification

Date: 23 October 2026

Source: father_wor_db/database.json
Untouched backup: father_wor_db/database.json.bak

Original SHA-256: efc74d33f1aba5b8cd8db5b18e7564d125d735c970489e3e40f621c35b30116a
Corrected SHA-256: 11d65ef586d0f10025c53c1a2502dc136f4daa6e467c3ca49c71feaf469d9978

## Verification results

- Products: 1,799; identical count, order, and codes.
- Changed: exactly 216 products, only products[].tamilName.
- All other product fields, including every price, stock value and slab: deeply identical.
- All 2,570 invoices, including embedded item names and amounts: deeply identical.
- All settings and other database fields: deeply identical.
- Original backup: byte-for-byte identical to the audited source.
- Original JSON formatting and text outside the 216 replaced string tokens: preserved.
- Remaining occurrences of the 10 audited artifact types: zero.
- Correction rules are idempotent.
- M.82 and M82 remain separate: M.82 = T.T.கட்டி 15gm; M82 = பார்லி (entire M82 record unchanged).
- Only this copied database was corrected. AppData databases, application source, seed data, app.exe and installers were not modified.
- If the store has continued billing since this snapshot, apply these approved name changes to a fresh database rather than replacing newer store data with this snapshot.

## Complete Before → After list

| # | Code | English name | Before | After |
|---:|---|---|---|---|
| 1 | M23 | RAJMABEAN`S | <code>ராˆமா பீன்ஸ்</code> | <code>ராஜ்மா பீன்ஸ்</code> |
| 2 | M63 | TIPPLI | <code>திப்பில்¢</code> | <code>திப்பிலி</code> |
| 3 | M74 | GINGER C0FFEE 1PKT | <code>சுக்கு காப்¢ 1pkt</code> | <code>சுக்கு காபி 1pkt</code> |
| 4 | M78 | LG.KATTI 50G | <code>LG.கட்Ê 50g</code> | <code>LG.கட்டி 50g</code> |
| 5 | M80 | LG.KATTI 100G | <code>LG.கட்Ê 100g</code> | <code>LG.கட்டி 100g</code> |
| 6 | R08 | RICE NO.1 | <code>சாப்பாட்டு அர்¢சிNO.1</code> | <code>சாப்பாட்டு அரிசிNO.1</code> |
| 7 | O36 | THENNAMARA.OIL | <code>தென்னமரகுÊஆய்¢ல்</code> | <code>தென்னமரகுடிஆயில்</code> |
| 8 | O40 | MUDDIKULAKARIOIL | <code>முட்Êகுளங்கரைஆயில்</code> | <code>முட்டிகுளங்கரைஆயில்</code> |
| 9 | O17 | SUNFLOWER TIN | <code>சன்பிளவர் Êன்</code> | <code>சன்பிளவர் டின்</code> |
| 10 | W15 | XLMATICK FRONT 1LIT | <code>XLமேÊக்FRONT 1LIT</code> | <code>XLமேடிக்FRONT 1LIT</code> |
| 11 | W20 | SURFXL MATIC(FRON)1KG | <code>சர்ப்XLமேட்Êக்(FRON)1KG</code> | <code>சர்ப்XLமேட்டிக்(FRON)1KG</code> |
| 12 | W21 | SURFXLMATIC(FRON)500GM | <code>சர்ப்XLமேட்Êக்(FRON)500GM</code> | <code>சர்ப்XLமேட்டிக்(FRON)500GM</code> |
| 13 | W31 | SURFXLMATIC 1KG(TOP) | <code>சர்ப் XLமேட்Êக் 1kg(Top)</code> | <code>சர்ப் XLமேட்டிக் 1kg(Top)</code> |
| 14 | W32 | SURF XL MATIC 500GM(TOP) | <code>சர்ப்XLமேட்Êக் 500gm(Top)</code> | <code>சர்ப்XLமேட்டிக் 500gm(Top)</code> |
| 15 | B08 | MEDIMIX 75GM\ | <code>மெÊமிக்ஸ் 75gm</code> | <code>மெடிமிக்ஸ் 75gm</code> |
| 16 | B09 | MEDIMIX 125GM | <code>மெÊமிக்ஸ் 125gm</code> | <code>மெடிமிக்ஸ் 125gm</code> |
| 17 | K13 | BAJJI MAAVU 200G | <code>பˆஜிமாவு 200gm</code> | <code>பஜ்ஜிமாவு 200gm</code> |
| 18 | K14 | BAJJI MAAVU 500GM | <code>பˆஜிமாவு 500gm</code> | <code>பஜ்ஜிமாவு 500gm</code> |
| 19 | B15 | MEDIMIX SANDEL | <code>மெÊமிக்ஸ் சேண்டல்</code> | <code>மெடிமிக்ஸ் சேண்டல்</code> |
| 20 | B26 | PEARS 75G(BROWN) | <code>பியர்ஸ்75g(பிரெªன்)</code> | <code>பியர்ஸ்75g(பிரவுன்)</code> |
| 21 | B29 | PEARS125G(BROWN) | <code>பியர்ஸ்125g(பிரெªன்)</code> | <code>பியர்ஸ்125g(பிரவுன்)</code> |
| 22 | B36 | MEDI.SANDAL75G | <code>மெÊமிக்ஸ்சான்டல்75g</code> | <code>மெடிமிக்ஸ்சான்டல்75g</code> |
| 23 | B37 | MEDI.SANDAL125G | <code>மெÊமிக்ஸ்சான்டல்125g</code> | <code>மெடிமிக்ஸ்சான்டல்125g</code> |
| 24 | 107 | RASA POWDER 50G | <code>ரசப்பொÊ 50g</code> | <code>ரசப்பொடி 50g</code> |
| 25 | 108 | RASAM POWDER 100G | <code>ரசப்பொÊ 100g</code> | <code>ரசப்பொடி 100g</code> |
| 26 | 113 | IDLY POWDER 50G | <code>இட்லிப்பொÊ 50g</code> | <code>இட்லிப்பொடி 50g</code> |
| 27 | 138 | PULIYOTHARAI MIX 50G | <code>புளியோதரைபொÊ 50g</code> | <code>புளியோதரைபொடி 50g</code> |
| 28 | 139 | PULIYOTHARAI MIX 100G | <code>புளியோதரைபொÊ 100g</code> | <code>புளியோதரைபொடி 100g</code> |
| 29 | 140 | CUMMIN POWDER 50G | <code>சீரகப்பொÊ 50g</code> | <code>சீரகப்பொடி 50g</code> |
| 30 | 141 | CUMMIN POWDER 100G | <code>சீரகப்பொÊ 100g</code> | <code>சீரகப்பொடி 100g</code> |
| 31 | 143 | GARLIC POWDER 100G | <code>பூண்டுப்பொÊ 100g</code> | <code>பூண்டுப்பொடி 100g</code> |
| 32 | 144 | DHAL POWDER 100G | <code>பருப்புப்பொÊ 100g</code> | <code>பருப்புப்பொடி 100g</code> |
| 33 | 145 | WHITEPEPPER | <code>வெ.மிளகுபொÊ</code> | <code>வெ.மிளகுபொடி</code> |
| 34 | T14 | GREENTEA100GM | <code>கிரீண்Ë100gm</code> | <code>கிரீண்டீ100gm</code> |
| 35 | T11 | KANNAVARITEA250GM | <code>கண்ணவரைË250gm</code> | <code>கண்ணவரைடீ250gm</code> |
| 36 | T39 | TAJMAHAL 100G | <code>தாˆமஸால் 100g</code> | <code>தாஜ்மஸால் 100g</code> |
| 37 | T40 | TAJMAHAL 250G | <code>தாˆமஸால் 250g</code> | <code>தாஜ்மஸால் 250g</code> |
| 38 | T42 | NOBLE HOUSE 250G | <code>நோபல்ஸவுஸ்Ë 250g</code> | <code>நோபல்ஸவுஸ்டீ 250g</code> |
| 39 | T49 | TETLAY TEA 250G | <code>டெட்லேË 250g</code> | <code>டெட்லேடீ 250g</code> |
| 40 | 208 | NOODLES | <code>நூÊல்ஸ்  சாதா</code> | <code>நூடில்ஸ்  சாதா</code> |
| 41 | 213 | YIPPEE  100GM | <code>இப்ப்¢ நூடுல்ஸ் 100GM</code> | <code>இப்பி நூடுல்ஸ் 100GM</code> |
| 42 | 223 | IDIYAPPAM | <code>இÊயாப்பம்</code> | <code>இடியாப்பம்</code> |
| 43 | 321 | J.M.TOURTHPOWER | <code>J.M.பல்பொÊ</code> | <code>J.M.பல்பொடி</code> |
| 44 | 349 | PYORIYA POWDER 60G | <code>பயோரியா பல்பொÊ 60g</code> | <code>பயோரியா பல்பொடி 60g</code> |
| 45 | 357 | GOBAL POWDER | <code>கோபால்பல்பொÊ</code> | <code>கோபால்பல்பொடி</code> |
| 46 | 403 | PANAVELLAM | <code>ப.கருப்பட்Ê</code> | <code>ப.கருப்பட்டி</code> |
| 47 | 404 | THENNAI VELLAM | <code>தெ.கருப்பட்Ê</code> | <code>தெ.கருப்பட்டி</code> |
| 48 | 410 | CHALAKUDI NUTS | <code>சாலகுÊபாக்கு</code> | <code>சாலகுடிபாக்கு</code> |
| 49 | 418 | MATCH BOX | <code>பூனைதீப்பெட்Ê</code> | <code>பூனைதீப்பெட்டி</code> |
| 50 | 421 | POWERSAMPRANI | <code>பொÊசாம்ரானி</code> | <code>பொடிசாம்ரானி</code> |
| 51 | 426 | KATTISAMBARANI | <code>கட்Êசாம்பிராணி</code> | <code>கட்டிசாம்பிராணி</code> |
| 52 | 429 | PANNERBOTTIE | <code>பன்னீர்பாட்Êல்(SMALL)</code> | <code>பன்னீர்பாட்டில்(SMALL)</code> |
| 53 | 430 | TEA TUMBLER PCS | <code>Ë.டம்ளர் pcs</code> | <code>டீ.டம்ளர் pcs</code> |
| 54 | 439 | POREI | <code>பொர்¢</code> | <code>பொரி</code> |
| 55 | 451 | TEA CUP ATTAI | <code>Ëடம்ளர் அட்டை</code> | <code>டீடம்ளர் அட்டை</code> |
| 56 | 515 | AMULSPRAY(TIN)500G | <code>அமுல்ஸ்ப்ரே(Êன்)500g</code> | <code>அமுல்ஸ்ப்ரே(டின்)500g</code> |
| 57 | 517 | SAATTUKUDI | <code>சாத்துகுÊ</code> | <code>சாத்துகுடி</code> |
| 58 | 519 | DELITE 250G | <code>Êலைட் 250g</code> | <code>டிலைட் 250g</code> |
| 59 | 524 | PUREGHEE | <code>தௌ¢வுநெய்</code> | <code>தெளிவுநெய்</code> |
| 60 | 620 | PEDIA SURE 500GM | <code>பீÊயாசூர் 500gm</code> | <code>பீடியாசூர் 500gm</code> |
| 61 | 632 | DELITE 200G | <code>Êலைட் 200g</code> | <code>டிலைட் 200g</code> |
| 62 | 634 | PROTIN X200G | <code>புரோட்Ëன் X200g</code> | <code>புரோட்டீன் X200g</code> |
| 63 | 648 | PROTINE X 400G | <code>புரோËன் X 400g</code> | <code>புரோடீன் X 400g</code> |
| 64 | 703 | CERELAC400G VEG | <code>செரிலாக்400gவெˆ</code> | <code>செரிலாக்400gவெஜ்</code> |
| 65 | 709 | CERELAC400GMIXVEG | <code>செரிலாக்400gமிக்ஸ்வெˆ</code> | <code>செரிலாக்400gமிக்ஸ்வெஜ்</code> |
| 66 | 722 | PEDIASURE 900 VEN | <code>பிÊயாசூர்900வெண்</code> | <code>பிடியாசூர்900வெண்</code> |
| 67 | 723 | PEDIASURE 900 CHOC | <code>பிÊயாசூர்900சாக்</code> | <code>பிடியாசூர்900சாக்</code> |
| 68 | 726 | FEREX 400 VEG | <code>ஃபேரெக்ஸ்400gவெˆ</code> | <code>ஃபேரெக்ஸ்400gவெஜ்</code> |
| 69 | 733 | TEDIBAR SOP | <code>டெÊபார்சோப்</code> | <code>டெடிபார்சோப்</code> |
| 70 | 742 | TADIBAR SOAP | <code>டெÊபார்சோப்</code> | <code>டெடிபார்சோப்</code> |
| 71 | 760 | FEEDING BOTTLE | <code>ஃபீÊங் பாட்Êல்</code> | <code>ஃபீடிங் பாட்டில்</code> |
| 72 | H03 | DOBUR VATIKA 150ML | <code>டாபர் வாட்Êகா 150ml</code> | <code>டாபர் வாட்டிகா 150ml</code> |
| 73 | H04 | DABUR VATIKA 300ML | <code>டாபர் வாட்Êகா 300ml</code> | <code>டாபர் வாட்டிகா 300ml</code> |
| 74 | H32 | MEDICAR OIL 50ML | <code>மெÊக்கர் ஆயில் 50ml</code> | <code>மெடிக்கர் ஆயில் 50ml</code> |
| 75 | H39 | INDICA | <code>இன்Êகா டை</code> | <code>இன்டிகா டை</code> |
| 76 | 907 | MARTIN MAT | <code>மார்Ëன் மேட்</code> | <code>மார்டீன் மேட்</code> |
| 77 | 914 | MARTIN LIQUED | <code>மார்Ëன்.லிக்</code> | <code>மார்டீன்.லிக்</code> |
| 78 | 915 | G.K.LIQ.MACHINE | <code>G.K.லிக்.மி„¢ன்</code> | <code>G.K.லிக்.மிஷின்</code> |
| 79 | 916 | A/O.LIQ.MACHINE | <code>A/Oலிக்.மி„¢ன்</code> | <code>A/Oலிக்.மிஷின்</code> |
| 80 | 918 | G.K MAT MACHINE | <code>G.Kமேட்.மி„¢ன்</code> | <code>G.Kமேட்.மிஷின்</code> |
| 81 | 935 | EASY BANG(B) | <code>®ஷி பேங்க்(B)</code> | <code>ஈஷி பேங்க்(B)</code> |
| 82 | 937 | DRANEX | <code>Êரானக்ஸ்</code> | <code>டிரானக்ஸ்</code> |
| 83 | 942 | ANT POWDER | <code>எறும்பு பொÊ</code> | <code>எறும்பு பொடி</code> |
| 84 | 945 | COLOUR 25GM | <code>கலர் பொÊ 25gm</code> | <code>கலர் பொடி 25gm</code> |
| 85 | 951 | MARTIN SPRAY | <code>மார்Ëன் ஸ்ப்ரே</code> | <code>மார்டீன் ஸ்ப்ரே</code> |
| 86 | A10 | AACHI PICKLEJAR 1+1 | <code>ஆச்ச்¢ஊறுகாய்Jar 1+1</code> | <code>ஆச்சிஊறுகாய்Jar 1+1</code> |
| 87 | A17 | CON CIPS | <code>கான்ச்¢ப்ஸ்</code> | <code>கான்சிப்ஸ்</code> |
| 88 | S12 | PANTENE 100ML | <code>பேன்Ëன் 100ml</code> | <code>பேன்டீன் 100ml</code> |
| 89 | S13 | PANTENE 200ML | <code>பேன்Ëன் 200ml</code> | <code>பேன்டீன் 200ml</code> |
| 90 | S17 | TRESEMME100ML | <code>Êரஸ்சமி 100ml</code> | <code>டிரஸ்சமி 100ml</code> |
| 91 | S18 | VATIKA 100ML | <code>வாட்Êகா „¡ம்பு 100ml</code> | <code>வாட்டிகா ஷாம்பு 100ml</code> |
| 92 | S19 | VATIKA SHAMPOO 200ML | <code>வாட்Êகா „¡ம்பு 200ml</code> | <code>வாட்டிகா ஷாம்பு 200ml</code> |
| 93 | S20 | NYLE SHAMPOO 100ML | <code>நைல் „¡ம்பு 100ml</code> | <code>நைல் ஷாம்பு 100ml</code> |
| 94 | S21 | NYLE SHAMPOO 200ML | <code>நைல் „¡ம்பு 200ml</code> | <code>நைல் ஷாம்பு 200ml</code> |
| 95 | S25 | HIMALAYA SHAMPOO 120ML | <code>ஸிமா.„¡ம்பு  120ml</code> | <code>ஸிமா.ஷாம்பு  120ml</code> |
| 96 | S26 | MEDIKAR 50ML | <code>மெÊக்கர் „¡ம்பு 50ml</code> | <code>மெடிக்கர் ஷாம்பு 50ml</code> |
| 97 | S27 | MEERA SHAMPOO 100ML | <code>மீரா „¡ம்பு 100ml</code> | <code>மீரா ஷாம்பு 100ml</code> |
| 98 | S33 | SHIKAI POWDER | <code>பாரத்¢யார்சீவக்காய்தூள்</code> | <code>பாரதியார்சீவக்காய்தூள்</code> |
| 99 | S35 | THEVALAPODI 100G | <code>தெவளப்பொÊ 100g</code> | <code>தெவளப்பொடி 100g</code> |
| 100 | S41 | PANTINE (SAC) | <code>பேன்Ëன் (Sac)</code> | <code>பேன்டீன் (Sac)</code> |
| 101 | S43 | MEERA SHAM(3RS) | <code>மீரா „¡ம்பு (3ரூசரம்)</code> | <code>மீரா ஷாம்பு (3ரூசரம்)</code> |
| 102 | S44 | DOVE SHM (SAC) | <code>டவ்„¡ம்பு (Sac)(2</code> | <code>டவ்ஷாம்பு (Sac)(2</code> |
| 103 | S45 | DOVE SHM(SAC) (3) | <code>டவ்„¡ம்பு (3) (Sac)</code> | <code>டவ்ஷாம்பு (3) (Sac)</code> |
| 104 | 809 | AMIR.BOT | <code>அமிர்.பாட்Êல்</code> | <code>அமிர்.பாட்டில்</code> |
| 105 | 825 | GODREJAIR PAKT | <code>கோத்ரேˆ ஏர்பாக்.</code> | <code>கோத்ரேஜ் ஏர்பாக்.</code> |
| 106 | V01 | GODREJ CREAM(S) | <code>கோத்ரெˆ கிரீம் (S)</code> | <code>கோத்ரெஜ் கிரீம் (S)</code> |
| 107 | V14 | 7'OCL0CK(PLATINAM) | <code>7'oக்ளாக்(பிளாட்Êனம்)</code> | <code>7'oக்ளாக்(பிளாட்டினம்)</code> |
| 108 | V22 | OID.S.LOTION 50ML | <code>ஓ.ஸ்பைஸ் லோ„ன்50ml</code> | <code>ஓ.ஸ்பைஸ் லோஷன்50ml</code> |
| 109 | V23 | OIL.S.LOTION 100ML | <code>ஓ.ஸ்பைஸ் லோ„ன் 100ml</code> | <code>ஓ.ஸ்பைஸ் லோஷன் 100ml</code> |
| 110 | V24 | DENIM LOTION 100ML | <code>டெனிம் லோ„ன் 100ml</code> | <code>டெனிம் லோஷன் 100ml</code> |
| 111 | V25 | AXE LOTION | <code>ஆக்ஸ் லோ„ன் 50ml</code> | <code>ஆக்ஸ் லோஷன் 50ml</code> |
| 112 | V26 | AXE LOTION 100ML | <code>ஆக்ஸ் லோ„ன் 100ml</code> | <code>ஆக்ஸ் லோஷன் 100ml</code> |
| 113 | V27 | PRIMIUM LOTION 50ML | <code>பிரீமியம் லோ„ன் 50ml</code> | <code>பிரீமியம் லோஷன் 50ml</code> |
| 114 | V28 | NIVYA LOTION 50ML | <code>நிவியா லோ„ன் 50ml</code> | <code>நிவியா லோஷன் 50ml</code> |
| 115 | V29 | YARDLY LOTION50ML | <code>யார்ட்லி லோ„ன் 50ml</code> | <code>யார்ட்லி லோஷன் 50ml</code> |
| 116 | C06 | EXO STEEL | <code>எக்ஷோ ஸ்Ëல்</code> | <code>எக்ஷோ ஸ்டீல்</code> |
| 117 | P14 | CUTICURA 400G | <code>குயூட்Êகூரா 400g</code> | <code>குயூட்டிகூரா 400g</code> |
| 118 | P29 | EMAMI ODISI | <code>இமாமி ஒÊசி</code> | <code>இமாமி ஒடிசி</code> |
| 119 | P37 | EVA SPRAY | <code>®வா ஸ்ப்ரே</code> | <code>ஈவா ஸ்ப்ரே</code> |
| 120 | U14 | YEAST | <code>®ஸ்ட்</code> | <code>ஈஸ்ட்</code> |
| 121 | X04 | DURO CELL | <code>Êயூரோ செல்</code> | <code>டியூரோ செல்</code> |
| 122 | Q27 | RING MURUKKU | <code>ர்¢ங்முருக்கு</code> | <code>ரிங்முருக்கு</code> |
| 123 | Q33 | SONPAPADI | <code>சோன் பப்Ê</code> | <code>சோன் பப்டி</code> |
| 124 | Y12 | ORANGE CANDY | <code>ஆரஞ் கேன்Ê</code> | <code>ஆரஞ் கேன்டி</code> |
| 125 | Z03 | KOLAPODI COLUR | <code>கோலபொÊ (கலர்)</code> | <code>கோலபொடி (கலர்)</code> |
| 126 | Z04 | INK BOTTLE | <code>இங்க் பாட்Êல்</code> | <code>இங்க் பாட்டில்</code> |
| 127 | Z05 | KOLAPODI WHITE | <code>கோலப்பொÊ (வெள்)</code> | <code>கோலப்பொடி (வெள்)</code> |
| 128 | Z07 | BERIYANI BOX | <code>பிர்¢யானி பாக்ஸ்</code> | <code>பிரியானி பாக்ஸ்</code> |
| 129 | Z15 | D S PODI | <code>D S பொÊ</code> | <code>D S பொடி</code> |
| 130 | S47 | H &amp; S4RSSAC | <code>ஸெட்.§„¡ல்டர்4ரூ</code> | <code>ஸெட்.ஷோல்டர்4ரூ</code> |
| 131 | W75 | HENKOMATIC 1KG | <code>ஸென்கோ மேட்Êக் 1kg</code> | <code>ஸென்கோ மேட்டிக் 1kg</code> |
| 132 | S48 | TRESEMME(SCE) | <code>Êரஸ்சமி(sec)</code> | <code>டிரஸ்சமி(sec)</code> |
| 133 | O60 | CORDYA OIL | <code>கார்Ê ஆயில்</code> | <code>கார்டி ஆயில்</code> |
| 134 | G309 | TAJ MAHAL | <code>தாˆமஸால்</code> | <code>தாஜ்மஸால்</code> |
| 135 | G312 | SSRI SAKKARAM | <code>‚சக்கரம்</code> | <code>ஸ்ரீசக்கரம்</code> |
| 136 | G303 | SS.KALAMPUR(MEDIUM) | <code>SS.களம்பூர்(மீÊயம்)</code> | <code>SS.களம்பூர்(மீடியம்)</code> |
| 137 | G202 | SS.KANKAYAM(MEDIUM) | <code>SS.காங்கயம்(மீÊயம்)</code> | <code>SS.காங்கயம்(மீடியம்)</code> |
| 138 | G204 | SS.KALAMMPUR(MEDIUM) | <code>SS.களம்பூர்(மீÊயம்)</code> | <code>SS.களம்பூர்(மீடியம்)</code> |
| 139 | G222 | TAJMAHAL | <code>தாˆமஸால்</code> | <code>தாஜ்மஸால்</code> |
| 140 | G208 | SRI SAKKARAM | <code>‚சக்கரம்</code> | <code>ஸ்ரீசக்கரம்</code> |
| 141 | G304 | SS.KANGAYAM(MEDIUM) | <code>SS.காங்கயம்(மீÊயம்)</code> | <code>SS.காங்கயம்(மீடியம்)</code> |
| 142 | 763 | PEDIYA SURE(COM) | <code>பிÊயாசூர்(கம்ளீட்)</code> | <code>பிடியாசூர்(கம்ளீட்)</code> |
| 143 | W76 | UJALASTIPESHINE100ML | <code>உஜாலா ஸ்Êப்&amp;சைன்100ml</code> | <code>உஜாலா ஸ்டிப்&amp;சைன்100ml</code> |
| 144 | T54 | AVTCOFFE50GM | <code>ஏ வி Êகாப்பி50gm</code> | <code>ஏ வி டிகாப்பி50gm</code> |
| 145 | 359 | COL.SENSITIVE100G | <code>கோல்.சென்சிÊவ்100g</code> | <code>கோல்.சென்சிடிவ்100g</code> |
| 146 | 764 | NES.VEG | <code>நெஸ்டம்வெˆ</code> | <code>நெஸ்டம்வெஜ்</code> |
| 147 | G148 | ASAI NOODLES | <code>ஆசை நூÊல்ஸ்</code> | <code>ஆசை நூடில்ஸ்</code> |
| 148 | G158 | GANAPPATHY TIN | <code>கணபதி Êன்</code> | <code>கணபதி டின்</code> |
| 149 | G171 | TAJMAHAL TEA500 | <code>தாˆமஸால் Ë 500</code> | <code>தாஜ்மஸால் டீ 500</code> |
| 150 | G346 | KRISNA DELUX | <code>கிருக்ஷணா Ëலக்ஸ்</code> | <code>கிருக்ஷணா டீலக்ஸ்</code> |
| 151 | G240 | SRIVELAN | <code>‚வேலன்</code> | <code>ஸ்ரீவேலன்</code> |
| 152 | G352 | SRIVASAKI | <code>‚வாசகி</code> | <code>ஸ்ரீவாசகி</code> |
| 153 | G244 | KRISHNADELUX PONNI | <code>கிருஸ்னாËலக்ஸ்பொன்னி</code> | <code>கிருஸ்னாடீலக்ஸ்பொன்னி</code> |
| 154 | G193 | TAJMAHAL250G | <code>தாˆமஸால் 250g</code> | <code>தாஜ்மஸால் 250g</code> |
| 155 | 936 | EASY BANK(S) | <code>®ஷிபேங்க்(S)</code> | <code>ஈஷிபேங்க்(S)</code> |
| 156 | S51 | FIAMASHAMPOO100ML | <code>`பியாமா„¡ம்பு100ml</code> | <code>பியாமா ஷாம்பு 100ml</code> |
| 157 | W78 | RINMATICE1KG | <code>ரின்மேட்Êக்1kg</code> | <code>ரின்மேட்டிக்1kg</code> |
| 158 | S53 | DOVESHM100ML | <code>டவ்„¡ம்பு100ml</code> | <code>டவ்ஷாம்பு100ml</code> |
| 159 | S54 | 3ROSESTEA 10RS | <code>3ரோஸ்Ë 10ரூ</code> | <code>3ரோஸ்டீ 10ரூ</code> |
| 160 | Z26 | NO 10 BEEDI | <code>நெ 10 பீÊ</code> | <code>நெ 10 பீடி</code> |
| 161 | O002 | T.V.S.GROW.OIL | <code>Ê.வி.க்ஷ. க.எண்.1லிட்</code> | <code>டி.வி.க்ஷ. க.எண்.1லிட்</code> |
| 162 | M.78 | T.T. KADDI    50GM | <code>T.T. கட்Ê   50gm</code> | <code>T.T. கட்டி   50gm</code> |
| 163 | M.80 | T.T.  KATTI   100GM | <code>T.T. கட்Ê 100GM</code> | <code>T.T. கட்டி 100GM</code> |
| 164 | M.82 | T.T.KADDI 15GM | <code>T.T.கட்Ê 15gm</code> | <code>T.T.கட்டி 15gm</code> |
| 165 | G355 | GILLET  PLATINUM | <code>ஜில்லட்  ப்¢ளாÊனம்</code> | <code>ஜில்லட்  பிளாடினம்</code> |
| 166 | G356 | GILLET  7'OCLOCK | <code>ˆ¢ல்லட் 7'0 கிளாக்</code> | <code>ஜில்லட் 7'0 கிளாக்</code> |
| 167 | G361 | GILLET   READY  SHAVE | <code>ஜில்லட் ரெÊ  சேவ்</code> | <code>ஜில்லட் ரெடி  சேவ்</code> |
| 168 | G362 | GILLET 7''OCLOCK READY SHAVE | <code>ஜில்லட் 7''0கிளாக் ரெÊ சேவ்</code> | <code>ஜில்லட் 7''0கிளாக் ரெடி சேவ்</code> |
| 169 | G370 | S.MAX READY SHAVE | <code>சூ.மேக்ஸ் ரெÊ சேவ்</code> | <code>சூ.மேக்ஸ் ரெடி சேவ்</code> |
| 170 | G378 | GODREJ SHAVING CREAM | <code>கோட்ரேˆ சேவிங் கிரீம்</code> | <code>கோட்ரேஜ் சேவிங் கிரீம்</code> |
| 171 | G380 | OLD SPICE SHAVING CREAM | <code>ஓல்டு ஸ்பேஸ் சேவ்¢ங் கிரீம்</code> | <code>ஓல்டு ஸ்பேஸ் சேவிங் கிரீம்</code> |
| 172 | Z36 | TISUE PAPPER | <code>Êஸ் பேப்பர்</code> | <code>டிஸ் பேப்பர்</code> |
| 173 | O08 | POORNA OIL 1LIT | <code>பூர்ணாஆய்¢ல் 1லி</code> | <code>பூர்ணாஆயில் 1லி</code> |
| 174 | T22 | A.V.T.10RSPKT | <code>ஏ.வி.Ê.10ரூபாக்</code> | <code>ஏ.வி.டி.10ரூபாக்</code> |
| 175 | S47. | PANTEEN4RS | <code>பேண்Ëன்4ரூsec</code> | <code>பேண்டீன்4ரூsec</code> |
| 176 | Z37 | LETEENBRUSH | <code>லெட்Ëன்பிரஸ்</code> | <code>லெட்டீன்பிரஸ்</code> |
| 177 | A05. | SAKTHIMANGOPICKLE | <code>சக்த்¢மாங்காஊறூகாய்</code> | <code>சக்திமாங்காஊறூகாய்</code> |
| 178 | Z40 | COOLDRINGS | <code>கூல்Êரிங்ஸ்</code> | <code>கூல்டிரிங்ஸ்</code> |
| 179 | 404. | SUKKUKARUPPATI | <code>சுக்குகருப்பட்Ê</code> | <code>சுக்குகருப்பட்டி</code> |
| 180 | M32.. | HARD AVAL | <code>கெட்Êஅவுல்</code> | <code>கெட்டிஅவுல்</code> |
| 181 | Q04. | VARKKEI | <code>ஊட்Ê வர்க்கி</code> | <code>ஊட்டி வர்க்கி</code> |
| 182 | S37. | ALLCLEAR(SEC) | <code>ஆல்கிள்¢யர்(sec)</code> | <code>ஆல்கிளியர்(sec)</code> |
| 183 | H39. | INDICA EASY | <code>இண்Êகா ®சி</code> | <code>இண்டிகா ஈசி</code> |
| 184 | T05. | AVT GOLDCUP100GM | <code>ஏவிÊகோல்டுகப்100gm</code> | <code>ஏவிடிகோல்டுகப்100gm</code> |
| 185 | T05.. | AVTGOLDCUP250GM | <code>ஏவிÊ கோல்டுகப்250gm</code> | <code>ஏவிடி கோல்டுகப்250gm</code> |
| 186 | 104. | SAMBAR POWDER200GM | <code>சாம்பார் பொÊ200gm</code> | <code>சாம்பார் பொடி200gm</code> |
| 187 | 104.. | SAMBAR POWDER500GM | <code>சாம்பார் பொÊ500gm</code> | <code>சாம்பார் பொடி500gm</code> |
| 188 | 108. | RASAMPOWDER200GM | <code>ரசப்பொÊ200gm</code> | <code>ரசப்பொடி200gm</code> |
| 189 | T11. | LIVINGSTA 50GM | <code>ல்¢விங்ஸ்ட50gm</code> | <code>லிவிங்ஸ்ட50gm</code> |
| 190 | B19.. | VIVEL SET 3+1 | <code>வ்¢வல் செட் 3+1</code> | <code>விவல் செட் 3+1</code> |
| 191 | R13.. | SS RICE10KG OLD | <code>S S அரிச்¢10kg (old)</code> | <code>S S அரிசி10kg (old)</code> |
| 192 | U06.. | AACH PA. | <code>ஆச்ச்¢பாயாசம்</code> | <code>ஆச்சிபாயாசம்</code> |
| 193 | M02.. | ROCKSALT(POWDER) | <code>இந்துப்பு(பொÊ)</code> | <code>இந்துப்பு(பொடி)</code> |
| 194 | O13. | GOLDWINNER500ML | <code>கோல்டுவ்¢ன்னர்500ml</code> | <code>கோல்டுவின்னர்500ml</code> |
| 195 | W15. | XLMATIC FRONT500ML | <code>XLமேட்Êக்FRONT500ML</code> | <code>XLமேட்டிக்FRONT500ML</code> |
| 196 | W15.. | XLMATICTOPLOAD1LIT | <code>XLமேட்Êக் டாப்1LIT</code> | <code>XLமேட்டிக் டாப்1LIT</code> |
| 197 | W15... | XLMATICTOPLOAD500ML | <code>XLமேட்Êக்டாப்லோடு500ML</code> | <code>XLமேட்டிக்டாப்லோடு500ML</code> |
| 198 | J04.. | CHILLISAUCE [BIG] | <code>சில்ல்¢சாஸ்[BIG]</code> | <code>சில்லிசாஸ்[BIG]</code> |
| 199 | 419. | KADDI KARPPU.50GM | <code>கட்Êகற்பூரம்50gm</code> | <code>கட்டிகற்பூரம்50gm</code> |
| 200 | M15. | WHITE PEAS | <code>வெ.பட்டான்¢</code> | <code>வெ.பட்டானி</code> |
| 201 | 112. | IDLIPODI | <code>இட்லிபொÊ100gm</code> | <code>இட்லிபொடி100gm</code> |
| 202 | B02. | HAMAM MINI | <code>கமாம் மின்¢</code> | <code>கமாம் மினி</code> |
| 203 | T14. | GREENTEA TIP | <code>கிரீண்Ë Êப்</code> | <code>கிரீண்டீ டிப்</code> |
| 204 | S41. | PANTEEN 2RS | <code>பேண்Ëன்2ரூ</code> | <code>பேண்டீன்2ரூ</code> |
| 205 | S45. | KARTHIKAPOWDER2RS | <code>கார்த்த்¢காபவுடர் 2ரூ</code> | <code>கார்த்திகாபவுடர் 2ரூ</code> |
| 206 | Z55 | RAVAIDLIMIX | <code>ரவாஇட்ல்¢மிக்ஸ்500GM</code> | <code>ரவாஇட்லிமிக்ஸ்500GM</code> |
| 207 | 429. | PANNERBOTTEL BIG | <code>பன்னீர்பாட்Êல்(BIG)</code> | <code>பன்னீர்பாட்டில்(BIG)</code> |
| 208 | 434. | TIRI BIG | <code>த்¢ரி (BIG)</code> | <code>திரி (BIG)</code> |
| 209 | 418. | MATCHBOX 10RS | <code>தீப்பட்Ë 10ரூ</code> | <code>தீப்பட்டீ 10ரூ</code> |
| 210 | 418.. | HOMEMATCHBOX | <code>ஸோம்லைட்தீப்பட்Ê</code> | <code>ஸோம்லைட்தீப்பட்டி</code> |
| 211 | Q13. | SMALLBISKET | <code>குட்Êபிஸ்கட்</code> | <code>குட்டிபிஸ்கட்</code> |
| 212 | Z23. | PICK UP S | <code>கேர்¢கவர்(small)</code> | <code>கேரிகவர்(small)</code> |
| 213 | B12. | CHATRICA SET | <code>சந்ர்¢காசெட்</code> | <code>சந்ரிகாசெட்</code> |
| 214 | B09. | MEDIMIX SET | <code>மெÊமிக்ஸ் செட்</code> | <code>மெடிமிக்ஸ் செட்</code> |
| 215 | 115.. | PEPEER POWDER10RS | <code>ம்¢ளகுத்தூள்10ரூ</code> | <code>மிளகுத்தூள்10ரூ</code> |
| 216 | Z73 | CHAPPATHI | <code>சப்பாத்த்¢</code> | <code>சப்பாத்தி</code> |
