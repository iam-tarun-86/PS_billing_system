# Tamil spelling review — proposals only

Date: 23 October 2026

Database: father_wor_db/database.json
SHA-256: 11d65ef586d0f10025c53c1a2502dc136f4daa6e467c3ca49c71feaf469d9978
Catalogue reviewed: 1799 products; 2570 invoices.
Proposed name changes: 153. Products with manual-review notes: 76 (categories can overlap).
Previously audited unmapped character types remaining: 0 products.

The database and original correction backup were NOT modified. These are review proposals, not an approved migration. Each proposed name must be checked for store terminology and brand preference. An unflagged row is not a guarantee of perfect spelling.

## Why a second pass is needed

The first repair decoded visible leftover symbols. Valid Unicode Tamil can still contain the wrong consonant or older spelling. In import_old_data.py, BYTE_CONSONANTS maps byte 134 to ஸ, whereas the legacy TSCII HA slot is ஹ; other Grantha slots also differ. This is consistent with repeated ஸமாம்/HAMAM, ஸார்லிக்ஸ்/HORLICKS, ஸார்பிக்/HARPIC and consonant-cluster errors. The source could also contain original typing errors. Do not run a blanket ஸ → ஹ or க்ஷ → ஷ replacement. Do not rerun the old import against current data.

## Proposed corrections

| Code | English name | Current Tamil name | Proposed Tamil name | Review / reason |
|---|---|---|---|---|
| M07 | MOONG | <code>ப.பயிர்</code> | <code>ப.பயறு</code> | Owner review: Spelling; preserve abbreviated product type |
| M10 | THADAPAYIRU | <code>த. பயிர்</code> | <code>த. பயறு</code> | Owner review: Spelling; preserve abbreviated product type |
| M32 | AVAL | <code>அவுல்</code> | <code>அவல்</code> | Likely correction: Tamil spelling |
| R03 | ROAW  RICE | <code>பச்சஅரிசி</code> | <code>பச்சரிசி</code> | Likely correction: Tamil spelling |
| R10 | RICE NO.3 | <code>சாப்பட்டு அரிசிNO.3</code> | <code>சாப்பாட்டு அரிசிNO.3</code> | Likely correction: Missing vowel |
| M87 | G.MOONG(NADU) | <code>ப.பயிர்(நாடு)</code> | <code>ப.பயறு(நாடு)</code> | Owner review: Spelling; preserve abbreviated product type |
| R23 | MAHARAJA 25KG | <code>மஸாராஜா 25கி</code> | <code>மஹாராஜா 25கி</code> | Likely correction: Wrong HA letter |
| W36 | VANISH(JAR) | <code>வேனிக்ஷஜார்</code> | <code>வேனிஷ்ஜார்</code> | Likely correction: Wrong consonant cluster |
| B01 | HAMAM 100G | <code>ஸமாம் 100gm</code> | <code>ஹமாம் 100gm</code> | Likely correction: Wrong brand letter |
| B02 | HAMAM 150GM | <code>ஸமாம் 150gm</code> | <code>ஹமாம் 150gm</code> | Likely correction: Wrong brand letter |
| B12 | HAMAM MINI | <code>ஸமாம் (மினி)</code> | <code>ஹமாம் (மினி)</code> | Likely correction: Wrong brand letter |
| K17 | KOLAKADDI MAVU | <code>கொலக்கட்டைமாவு</code> | <code>கொழுக்கட்டைமாவு</code> | Likely correction: Tamil spelling |
| B39 | HIMALAYA 75GM | <code>ஸிமாலயா 75g</code> | <code>ஹிமாலயா 75g</code> | Likely correction: Wrong HA letter |
| B45 | AYUSH SOAP 75G | <code>ஆயுஸ்சோப் 75g</code> | <code>ஆயுஷ்சோப் 75g</code> | Likely correction: Wrong SHA letter |
| T39 | TAJMAHAL 100G | <code>தாஜ்மஸால் 100g</code> | <code>தாஜ்மஹால் 100g</code> | Likely correction: Wrong HA letter |
| T40 | TAJMAHAL 250G | <code>தாஜ்மஸால் 250g</code> | <code>தாஜ்மஹால் 250g</code> | Likely correction: Wrong HA letter |
| T47 | ASSAM 100G | <code>அஸ்ஷாம் 100g</code> | <code>அசாம் 100g</code> | Owner review: ASSAM transliteration |
| T48 | ASSAM 250G | <code>அஸ்ஷாம் 250g</code> | <code>அசாம் 250g</code> | Owner review: ASSAM transliteration |
| 316 | AYUSH PASTE | <code>ஆயூஸ்பேஸ்ட்</code> | <code>ஆயுஷ்பேஸ்ட்</code> | Likely correction: Wrong SHA letter |
| 322 | COLGATE HERBAL 100G | <code>கோல்கேட்ஸெர்பல் 100g</code> | <code>கோல்கேட்ஹெர்பல் 100g</code> | Likely correction: Wrong HA letter |
| 323 | COLGATE HERBAL 200G | <code>கோல்கேட்ஸெர்பல் 200g</code> | <code>கோல்கேட்ஹெர்பல் 200g</code> | Likely correction: Wrong HA letter |
| 331 | COL.BURES | <code>கோல்.பிரஸ்</code> | <code>கோல்.பிரஷ்</code> | Likely correction: Preferred transliteration |
| 332 | COLGATE BURES | <code>கோல்கேட் பிரஸ்</code> | <code>கோல்கேட் பிரஷ்</code> | Likely correction: Preferred transliteration |
| 364 | HIMALAYA 100G | <code>ஸிமாலயாபேஸ்ட் 100g</code> | <code>ஹிமாலயாபேஸ்ட் 100g</code> | Likely correction: Wrong HA letter |
| 340 | DOBUR HERBALPASTE 50G | <code>டாபர்ஸெர்பல்பேஸ்ட் 50g</code> | <code>டாபர்ஹெர்பல்பேஸ்ட் 50g</code> | Likely correction: Wrong HA letter |
| 354 | BRUSH | <code>பிரக்ஷ</code> | <code>பிரஷ்</code> | Likely correction: Wrong consonant cluster |
| 421 | POWERSAMPRANI | <code>பொடிசாம்ரானி</code> | <code>பொடிசாம்பிராணி</code> | Likely correction: Missing consonant |
| 468 | HOMELITE | <code>ஸோம்லைட்</code> | <code>ஹோம்லைட்</code> | Likely correction: Wrong HA letter |
| 502 | GHEE UTHYAKR. 100G | <code>உதயகிருக்ஷணா100g</code> | <code>உதயகிருஷ்ணா100g</code> | Likely correction: Wrong consonant cluster |
| 503 | UDHAYAKRIS. 200G | <code>உதயகிருக்ஷணா200g</code> | <code>உதயகிருஷ்ணா200g</code> | Likely correction: Wrong consonant cluster |
| 504 | UTHAYAKRIS.500G | <code>உதயகிருக்ஷணா500g</code> | <code>உதயகிருஷ்ணா500g</code> | Likely correction: Wrong consonant cluster |
| 601 | HORLICKS.500(R) | <code>ஸார்லிக்ஸ் 500(R)</code> | <code>ஹார்லிக்ஸ் 500(R)</code> | Likely correction: Wrong HA letter |
| 602 | HORLICKS.500(BOT) | <code>ஸார்லிக்ஸ் 500g(BOT)</code> | <code>ஹார்லிக்ஸ் 500g(BOT)</code> | Likely correction: Wrong HA letter |
| 603 | HORLICKS1KG(R) | <code>ஸார்லிக்ஸ் 1KG (R)</code> | <code>ஹார்லிக்ஸ் 1KG (R)</code> | Likely correction: Wrong HA letter |
| 604 | HOR.CHO.500(R) | <code>ஸார்.சாக்.500(R)</code> | <code>ஹார்.சாக்.500(R)</code> | Likely correction: Wrong HA letter; retain abbreviation |
| 605 | HOR.200GM(PAKET) | <code>ஸார்.200gm(பாக்கட்)</code> | <code>ஹார்.200gm(பாக்கட்)</code> | Likely correction: Wrong HA letter; retain abbreviation |
| 606 | HORLICKS1KG(BOT) | <code>ஸார்1 KG(BOT)</code> | <code>ஹார்1 KG(BOT)</code> | Likely correction: Wrong HA letter; retain abbreviation |
| 607 | HOR.(100GM)PKT | <code>ஸார்.(100gm)பாக்கட்</code> | <code>ஹார்.(100gm)பாக்கட்</code> | Likely correction: Wrong HA letter; retain abbreviation |
| 608 | HOR.JUNIOR.500(R) | <code>ஸார்.JUNIOR.500 (R)</code> | <code>ஹார்.JUNIOR.500 (R)</code> | Likely correction: Wrong HA letter; retain abbreviation |
| 609 | HOR.JUNIOR.500(BOT) | <code>ஸார்.JUNIOR.500(BOT)</code> | <code>ஹார்.JUNIOR.500(BOT)</code> | Likely correction: Wrong HA letter; retain abbreviation |
| 644 | MANNA HEALTHMIX 500 | <code>மன்னாஸெல்த்மிக்ஸ் 500g</code> | <code>மன்னாஹெல்த்மிக்ஸ் 500g</code> | Likely correction: Wrong HA letter |
| 645 | MANNA HEALTHMIX200G | <code>மன்னாஸெல்த்மிக்ஸ் 200g</code> | <code>மன்னாஹெல்த்மிக்ஸ் 200g</code> | Likely correction: Wrong HA letter |
| 647 | MCS HEALTHMIX 500G | <code>MCS ஸெல்த்மிக்ஸ் 500g</code> | <code>MCS ஹெல்த்மிக்ஸ் 500g</code> | Likely correction: Wrong HA letter |
| 744 | JJ.HAIR OIL 50ML | <code>பேபிஸேர்ஆயில் 50ml</code> | <code>பேபிஹேர் ஆயில் 50ml</code> | Likely correction: Wrong HA letter |
| 745 | JJ.BABY HAIR OIL 100ML | <code>JJ.பேபிஸேர்ஆயில் 100ml</code> | <code>JJ.பேபிஹேர் ஆயில் 100ml</code> | Likely correction: Wrong HA letter |
| 746 | JJ.BABYLOTION 50ML | <code>JJ.பேபிலோசன் 50ml</code> | <code>JJ.பேபிலோஷன் 50ml</code> | Likely correction: Preferred transliteration |
| 747 | JJ.BABYLOTION 100ML | <code>JJ.பேபிலோசன் 100ml</code> | <code>JJ.பேபிலோஷன் 100ml</code> | Likely correction: Preferred transliteration |
| 748 | JJ.BABY SHAMPOO 50ML | <code>JJ.பேபி சாம்பு 50ml</code> | <code>JJ.பேபி ஷாம்பு 50ml</code> | Likely correction: Preferred transliteration |
| 749 | JJ.BABY SHAMPOO 100ML | <code>JJ.பேபி சாம்பு 100ml</code> | <code>JJ.பேபி ஷாம்பு 100ml</code> | Likely correction: Preferred transliteration |
| 750 | JJ.BABY SHAMPOO 200ML | <code>JJ.பேபி சாம்பு 200ml</code> | <code>JJ.பேபி ஷாம்பு 200ml</code> | Likely correction: Preferred transliteration |
| 754 | BABY BRUSH | <code>பேபிபிரக்ஷ</code> | <code>பேபிபிரஷ்</code> | Likely correction: Wrong consonant cluster |
| 759 | HAGGIES | <code>ஸக்கீஸ்</code> | <code>ஹக்கீஸ்</code> | Likely correction: Wrong HA letter |
| H36 | BLACK HENNA | <code>பிலக்ஸெனா</code> | <code>பிளாக் ஹென்னா</code> | Likely correction: Wrong consonant cluster |
| 923 | HARPIC-(S) | <code>ஸார்பிக்-(S)</code> | <code>ஹார்பிக்-(S)</code> | Likely correction: Wrong HA letter |
| 924 | HAPIC-(B) | <code>ஸார்பிக்-(B)</code> | <code>ஹார்பிக்-(B)</code> | Likely correction: Wrong HA letter |
| 958 | HARPIC(F)MATIC | <code>ஸார்பிக்(F-MATIC)</code> | <code>ஹார்பிக்(F-MATIC)</code> | Likely correction: Wrong HA letter |
| A12 | PICKLES JAR | <code>ஊருகாய் ஜார்</code> | <code>ஊறுகாய் ஜார்</code> | Likely correction: Tamil spelling |
| S16 | GARNIOR SHM100ML | <code>கார்னியர் சாம்பு 100ml</code> | <code>கார்னியர் ஷாம்பு 100ml</code> | Likely correction: Preferred transliteration |
| S22 | DOVE 100ML | <code>டவ்சாம்பு 100ml</code> | <code>டவ்ஷாம்பு 100ml</code> | Likely correction: Preferred transliteration |
| S23 | DOVE 200ML | <code>டவ்சாம்பு 200ml</code> | <code>டவ்ஷாம்பு 200ml</code> | Likely correction: Preferred transliteration |
| S25 | HIMALAYA SHAMPOO 120ML | <code>ஸிமா.ஷாம்பு  120ml</code> | <code>ஹிமா.ஷாம்பு  120ml</code> | Likely correction: Wrong HA letter; retain abbreviation |
| S33 | SHIKAI POWDER | <code>பாரதியார்சீவக்காய்தூள்</code> | <code>பாரதியார்சீயக்காய்தூள்</code> | Likely correction: Tamil spelling |
| W72 | HENKO MAHA BAR | <code>ஸென்.மஸா.பார்</code> | <code>ஹென்கோ மஹா பார்</code> | Likely correction: Wrong HA letter |
| 826 | WISPERMAXI XL | <code>விஸ்பர்மேக்ஷி (XL)</code> | <code>விஸ்பர்மேக்ஸி (XL)</code> | Likely correction: Wrong consonant cluster |
| 827 | WHISPER MAXI(REG) | <code>விஸ்பர் மேக்ஷி(Reg)</code> | <code>விஸ்பர் மேக்ஸி(Reg)</code> | Likely correction: Wrong consonant cluster |
| V21 | NIVYA BRUSH | <code>நிவியா.சே.பிரஸ்</code> | <code>நிவியா.சே.பிரஷ்</code> | Likely correction: Preferred transliteration |
| C04 | EXO SAFAI | <code>எக்ஷோ சபாய்</code> | <code>எக்ஸோ சபாய்</code> | Likely correction: Wrong consonant cluster |
| C06 | EXO STEEL | <code>எக்ஷோ ஸ்டீல்</code> | <code>எக்ஸோ ஸ்டீல்</code> | Likely correction: Wrong consonant cluster |
| C10 | EXO BAR (S) | <code>எக்ஷோ பார் (s)</code> | <code>எக்ஸோ பார் (s)</code> | Likely correction: Wrong consonant cluster |
| C11 | EXO   ROUND BAR | <code>எக்ஷோ ரவுன் பார்</code> | <code>எக்ஸோ ரவுன் பார்</code> | Likely correction: Wrong consonant cluster |
| F06 | AYUSH CREEME25GM | <code>ஆயூஸ்கிரிம்25gm</code> | <code>ஆயுஷ்கிரிம்25gm</code> | Likely correction: Wrong SHA letter |
| F14 | PONDS LOTION 100ML | <code>பான்ஸ் லோசன் 100ml</code> | <code>பான்ஸ் லோஷன் 100ml</code> | Likely correction: Preferred transliteration |
| F16 | VASELINE LOTION 100ML | <code>வாஸ்லின் லோசன் 100ml</code> | <code>வாஸ்லின் லோஷன் 100ml</code> | Likely correction: Preferred transliteration |
| F17 | VASELINE LOTION 40ML | <code>வாஸ்லின் லோசன் 40ml</code> | <code>வாஸ்லின் லோஷன் 40ml</code> | Likely correction: Preferred transliteration |
| F27 | AYUSH F/W | <code>ஆயூஸ் F/W</code> | <code>ஆயுஷ் F/W</code> | Likely correction: Wrong SHA letter |
| U10 | K.BIRIYANI MIX | <code>K.பிரியானி மிக்ஸ்</code> | <code>K.பிரியாணி மிக்ஸ்</code> | Likely correction: Tamil spelling |
| Q19 | HIDE&amp;SEEK | <code>ஸைட்&amp;சீக்</code> | <code>ஹைட்&amp;சீக்</code> | Likely correction: Wrong HA letter |
| Q31 | VARU.PATTANI | <code>வறு.பட்டானி</code> | <code>வறு.பட்டாணி</code> | Likely correction: Tamil spelling |
| Y05 | KADALIURUNDAI | <code>கடலஉருண்டை</code> | <code>கடலை உருண்டை</code> | Likely correction: Missing vowel |
| Y06 | BLACK ALLU | <code>எள்ளூஉருண்ட</code> | <code>எள்ளு உருண்டை</code> | Likely correction: Tamil spelling |
| Z07 | BERIYANI BOX | <code>பிரியானி பாக்ஸ்</code> | <code>பிரியாணி பாக்ஸ்</code> | Likely correction: Tamil spelling |
| Z13 | BATH BRUSH | <code>பாத் பிரஸ்</code> | <code>பாத் பிரஷ்</code> | Likely correction: Preferred transliteration |
| Z14 | WASH BRUSH | <code>வாக்ஷ பிரஸ்</code> | <code>வாஷ் பிரஷ்</code> | Likely correction: Wrong consonant cluster; Preferred transliteration |
| W75 | HENKOMATIC 1KG | <code>ஸென்கோ மேட்டிக் 1kg</code> | <code>ஹென்கோ மேட்டிக் 1kg</code> | Likely correction: Wrong HA letter |
| 649 | HOR(BOT)200G | <code>ஸார்(BOT) 200g</code> | <code>ஹார்(BOT) 200g</code> | Likely correction: Wrong HA letter; retain abbreviation |
| 650 | HORLICKS 1KG(JAR) | <code>ஸார்லிக்ஸ் 1kg (JAR)</code> | <code>ஹார்லிக்ஸ் 1kg (JAR)</code> | Likely correction: Wrong HA letter |
| F31 | FAIR&amp;HANDSOME 30ML | <code>ஃபேர்&amp;ஸேன்சம் 30ml</code> | <code>ஃபேர்&amp;ஹேன்சம் 30ml</code> | Likely correction: Wrong HA letter |
| 651 | MOTHER.HOR(R)500G | <code>மதர் ஸார்லிக்ஸ்(R) 500g</code> | <code>மதர் ஹார்லிக்ஸ்(R) 500g</code> | Likely correction: Wrong HA letter |
| 654 | JU.HOR(CHOC)500G | <code>JU.ஸார்(choc)500g</code> | <code>JU.ஹார்(choc)500g</code> | Likely correction: Wrong HA letter; retain abbreviation |
| 655 | HOR(LITE)(BOT)500G | <code>ஸார்.லைட் (BOT) 500g</code> | <code>ஹார்.லைட் (BOT) 500g</code> | Likely correction: Wrong HA letter; retain abbreviation |
| G112 | HORLICKS 1KG(BOT) | <code>ஸார்லிக்ஸ் 1kg (BOT)</code> | <code>ஹார்லிக்ஸ் 1kg (BOT)</code> | Likely correction: Wrong HA letter |
| G113 | HORLICKS 1KG(R) | <code>ஸார்லிக்ஸ் 1kg(R)</code> | <code>ஹார்லிக்ஸ் 1kg(R)</code> | Likely correction: Wrong HA letter |
| G114 | HORLICKS 500G(BOT) | <code>ஸார்லிக்ஸ் 500g(BOT)</code> | <code>ஹார்லிக்ஸ் 500g(BOT)</code> | Likely correction: Wrong HA letter |
| G115 | HORLICKS 500G(R) | <code>ஸார்லிக்ஸ் 500g(R)</code> | <code>ஹார்லிக்ஸ் 500g(R)</code> | Likely correction: Wrong HA letter |
| G116 | JU.HOR.500G(BOT) | <code>JU.ஸார்.500g(BOT)</code> | <code>JU.ஹார்.500g(BOT)</code> | Likely correction: Wrong HA letter; retain abbreviation |
| G117 | JU.HOR.500G(R) | <code>JU.ஸார்.500g(R)</code> | <code>JU.ஹார்.500g(R)</code> | Likely correction: Wrong HA letter; retain abbreviation |
| G126 | MOT.HOR.500GM(R) | <code>மதர்.ஸார்.500gm(R)</code> | <code>மதர்.ஹார்.500gm(R)</code> | Likely correction: Wrong HA letter; retain abbreviation |
| G309 | TAJ MAHAL | <code>தாஜ்மஸால்</code> | <code>தாஜ்மஹால்</code> | Likely correction: Wrong HA letter |
| G325 | KRISHNA RICE | <code>கிருக்ஷணா அரிசி</code> | <code>கிருஷ்ணா அரிசி</code> | Likely correction: Wrong consonant cluster |
| G329 | MAHARAJA | <code>மஸாராஜா</code> | <code>மஹாராஜா</code> | Likely correction: Wrong HA letter |
| G214 | KRISHNA | <code>கிருக்ஷணா</code> | <code>கிருஷ்ணா</code> | Likely correction: Wrong consonant cluster |
| G218 | MAHAARAJA | <code>மஸாராஜா</code> | <code>மஹாராஜா</code> | Likely correction: Wrong HA letter |
| G222 | TAJMAHAL | <code>தாஜ்மஸால்</code> | <code>தாஜ்மஹால்</code> | Likely correction: Wrong HA letter |
| G227 | JAIHIND | <code>ஜெய்ஸிந்த்</code> | <code>ஜெய்ஹிந்த்</code> | Likely correction: Wrong HA letter |
| 658 | JU.HOR.200G | <code>JU.ஸார்.200g</code> | <code>JU.ஹார்.200g</code> | Likely correction: Wrong HA letter; retain abbreviation |
| 659 | RAMANA HELTH MIX | <code>ரமணா ஸெல்த் மிக்ஸ்</code> | <code>ரமணா ஹெல்த் மிக்ஸ்</code> | Likely correction: Wrong HA letter |
| G152 | HARPIC(B) | <code>ஸார்பிக்(B)</code> | <code>ஹார்பிக்(B)</code> | Likely correction: Wrong HA letter |
| G153 | HARPIC(S) | <code>ஸார்பிக்(S)</code> | <code>ஹார்பிக்(S)</code> | Likely correction: Wrong HA letter |
| G154 | HOR.CHO(R)500G | <code>ஸார்.சாக் (R) 500g</code> | <code>ஹார்.சாக் (R) 500g</code> | Likely correction: Wrong HA letter; retain abbreviation |
| G155 | HOR.VEN(R)500G | <code>ஸார்.வெண்(R)500g</code> | <code>ஹார்.வெண்(R)500g</code> | Likely correction: Wrong HA letter; retain abbreviation |
| G171 | TAJMAHAL TEA500 | <code>தாஜ்மஸால் டீ 500</code> | <code>தாஜ்மஹால் டீ 500</code> | Likely correction: Wrong HA letter |
| G346 | KRISNA DELUX | <code>கிருக்ஷணா டீலக்ஸ்</code> | <code>கிருஷ்ணா டீலக்ஸ்</code> | Likely correction: Wrong consonant cluster |
| G244 | KRISHNADELUX PONNI | <code>கிருஸ்னாடீலக்ஸ்பொன்னி</code> | <code>கிருஷ்ணா டீலக்ஸ் பொன்னி</code> | Likely correction: Wrong consonant cluster; Wrong consonant cluster; add word separation |
| G193 | TAJMAHAL250G | <code>தாஜ்மஸால் 250g</code> | <code>தாஜ்மஹால் 250g</code> | Likely correction: Wrong HA letter |
| 365 | HIMALYA50GM | <code>ஸிமாலயா50gm</code> | <code>ஹிமாலயா50gm</code> | Likely correction: Wrong HA letter |
| A06 | SAKTHI PICKLE(G),(GR) | <code>சக்திஊறுகய்(Ge),(Gr)</code> | <code>சக்திஊறுகாய்(Ge),(Gr)</code> | Likely correction: Missing vowel |
| 156 | KASMIR CHIILY100G | <code>காக்ஷமீர்சில்லி100g</code> | <code>காஷ்மீர்சில்லி100g</code> | Likely correction: Wrong consonant cluster |
| 841 | VEETHAIRRMV | <code>வீட்ஸேர்Rmv</code> | <code>வீட்ஹேர்Rmv</code> | Likely correction: Wrong HA letter |
| O002 | T.V.S.GROW.OIL | <code>டி.வி.க்ஷ. க.எண்.1லிட்</code> | <code>டி.வி.எஸ். க.எண்.1லிட்</code> | Likely correction: Wrong consonant cluster |
| F00 | PONDS W/B | <code>பான்க்ஷ w/b</code> | <code>பாண்ட்ஸ் w/b</code> | Likely correction: Wrong consonant cluster |
| H.01 | INDULEKHA | <code>இண்டுலெக்ஸ</code> | <code>இந்துலேகா</code> | Owner review: Brand transliteration; confirm on pack |
| R00. | HOR.VA.RICE | <code>குதுர வாலி அரிசி</code> | <code>குதிரைவாலி அரிசி</code> | Likely correction: Tamil spelling |
| 601. | HORLICKS 6RSPKT | <code>ஸார்லிக்ஸ் 5ரூபாக்</code> | <code>ஹார்லிக்ஸ் 5ரூபாக்</code> | Owner review: Wrong HA letter — Tamil price label 5ரூ versus English 6RS. Confirm label; no price field changes. |
| 601.. | HORLICKS 200KG BOT | <code>ஸார்லிக்ஸ்200kg bot</code> | <code>ஹார்லிக்ஸ்200kg bot</code> | Owner review: Wrong HA letter — Both labels say 200kg for Horlicks; likely wrong unit. Confirm pack; do not assume 200g. |
| Z37 | LETEENBRUSH | <code>லெட்டீன்பிரஸ்</code> | <code>லெட்டீன்பிரஷ்</code> | Likely correction: Preferred transliteration |
| A05. | SAKTHIMANGOPICKLE | <code>சக்திமாங்காஊறூகாய்</code> | <code>சக்திமாங்காஊறுகாய்</code> | Likely correction: Tamil spelling |
| 924. | HARPIC(BOT)500ML | <code>ஸார்பிக்(பாத்)500மில்</code> | <code>ஹார்பிக்(பாத்)500மில்</code> | Likely correction: Wrong HA letter |
| 924.. | HARPICK(BOT)200ML | <code>ஸார்பிக்(பாத்)200மிலி</code> | <code>ஹார்பிக்(பாத்)200மிலி</code> | Likely correction: Wrong HA letter |
| M32. | REDAVUL | <code>சிகப்புஅவுல்</code> | <code>சிகப்புஅவல்</code> | Likely correction: Tamil spelling |
| Z45 | GLOWLES | <code>கைஉரை</code> | <code>கையுறை</code> | Likely correction: Tamil spelling |
| M32.. | HARD AVAL | <code>கெட்டிஅவுல்</code> | <code>கெட்டிஅவல்</code> | Likely correction: Tamil spelling |
| M21. | GROWNET | <code>பச்சநிலகடலை</code> | <code>பச்சை நிலக்கடலை</code> | Likely correction: Missing letters |
| B39. | HIMALYA BABY | <code>ஸிமாலயாபேபி</code> | <code>ஹிமாலயாபேபி</code> | Likely correction: Wrong HA letter |
| 425. | CUPSAMBRANI (BIG) | <code>கப் சாம்ரானி(big)</code> | <code>கப் சாம்பிராணி(big)</code> | Likely correction: Missing consonant |
| M85. | LEMANYELOW | <code>லெமன்மஞ்சல்</code> | <code>லெமன் மஞ்சள்</code> | Likely correction: Tamil spelling |
| M41.. | KASHMIRCHILLI | <code>காஸ்மீர்மிளகாய்</code> | <code>காஷ்மீர்மிளகாய்</code> | Likely correction: Wrong consonant cluster |
| A09. | RUCHIPICKLE(GINGER) | <code>ருசிஊருகாய்(இஞ்சி)</code> | <code>ருசிஊறுகாய்(இஞ்சி)</code> | Likely correction: Tamil spelling |
| Y18. | GROWNUTCACK[SMALL] | <code>கடலைமில்ட்டாய்[small]</code> | <code>கடலைமிட்டாய்[small]</code> | Likely correction: Extra consonants |
| 115 | PEPEERPOWER50GM | <code>மிளகுதூள்50GM</code> | <code>மிளகுத்தூள்50GM</code> | Likely correction: Tamil spelling |
| M15. | WHITE PEAS | <code>வெ.பட்டானி</code> | <code>வெ.பட்டாணி</code> | Likely correction: Tamil spelling |
| 425.. | CUPSAMBRANI(SMALL) | <code>கப்சாம்ரானி(small)</code> | <code>கப்சாம்பிராணி(small)</code> | Likely correction: Missing consonant |
| B02. | HAMAM MINI | <code>கமாம் மினி</code> | <code>ஹமாம் மினி</code> | Likely correction: Wrong brand letter |
| S43. | MEERA SHAMP(2RS) | <code>மீராசாம்பு(2ரூ)</code> | <code>மீராஷாம்பு(2ரூ)</code> | Likely correction: Preferred transliteration |
| S44. | DOVESHAM.2RS | <code>டவ்சாம்பு 2ரூ</code> | <code>டவ்ஷாம்பு 2ரூ</code> | Likely correction: Preferred transliteration |
| R02.. | P T RICE | <code>P Tபச்சஅரிசி</code> | <code>P Tபச்சரிசி</code> | Likely correction: Tamil spelling |
| Z57 | PANEER | <code>பண்ணீர்</code> | <code>பன்னீர்</code> | Likely correction: Tamil spelling |
| 418. | MATCHBOX 10RS | <code>தீப்பட்டீ 10ரூ</code> | <code>தீப்பெட்டி 10ரூ</code> | Likely correction: Tamil spelling; MATCHBOX spelling; retain printed price label |
| 418.. | HOMEMATCHBOX | <code>ஸோம்லைட்தீப்பட்டி</code> | <code>ஹோம்லைட் தீப்பெட்டி</code> | Likely correction: Wrong HA letter; Tamil spelling; HOMEMATCHBOX spelling |
| 114. | PEEPERPOWER250GM | <code>மிளகுதூள் 250GM</code> | <code>மிளகுத்தூள் 250GM</code> | Likely correction: Tamil spelling |
| Z68 | SILVER 5*7 | <code>சில்வெர் 5*7</code> | <code>சில்வர் 5*7</code> | Likely correction: Tamil spelling; retain size label |
| B12. | CHATRICA SET | <code>சந்ரிகாசெட்</code> | <code>சந்திரிகாசெட்</code> | Owner review: Missing consonant — English CHATRICA probably Chandrika; confirm brand on pack. |
| 121. | BRIYANIMASAL100GM | <code>பிரியானிமசால்100GM</code> | <code>பிரியாணிமசால்100GM</code> | Likely correction: Tamil spelling |
| Z69 | SILVER 4 6 | <code>சில்வ்ர் 4 6</code> | <code>சில்வர் 4 6</code> | Likely correction: Tamil spelling; retain size label |

## Owner confirmation and label mismatches

These do not authorize any price, stock, pack-size or code changes.

| Code | English name | Current Tamil name | Question |
|---|---|---|---|
| M03 | SUGAR | <code>அஸ்கா</code> | அஸ்கா is local sugar terminology; do not globally replace ஸ. |
| M39 | DHANIYA | <code>நாடு மல்லி</code> | நாடு மல்லி may be local shorthand; confirm whether நாட்டுமல்லி intended. |
| M42. | SUNDAVATAL | <code>சுண்டவத்தல்</code> | சுண்டவத்தல் is abbreviated; consider சுண்டைக்காய் வத்தல் only if owner wants expansion. |
| M56 | ANNASI POO | <code>அன்னாச்சிபூ</code> | அன்னாச்சிபூ versus star anise; confirm preferred அன்னாசிப்பூ/அன்னாசிப் பூ spelling. |
| M57 | ANNASI POO 50G | <code>அன்னாச்சிபூ50g</code> | அன்னாச்சிபூ versus star anise; confirm preferred அன்னாசிப்பூ/அன்னாசிப் பூ spelling. |
| R15 | K S 5KG | <code>K S 5KG</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| O18 | MR GOLD GRO. | <code>MR GOLD.GRO</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| O26 | CASTOR OIL 150ML | <code>வி.எண்ணெய் 50ML</code> | Tamil says 50ML; English says 150ML. Confirm actual pack size. |
| O46 | V.V.D 100PKT | <code>V.V.D 100pkt</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| O47 | V.V.D 100BOT | <code>V.V.D 100bot</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| O48 | V.V.D 200BOT | <code>V.V.D 200bot</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| O49 | V.V.D 500BOT | <code>V.V.D 500bot</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| O50 | V.V.D 500PKT | <code>V.V.D 500pkt</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| O53 | V.V.D 50ML BOT | <code>V.V.D.50ml bot</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| W13 | FAB LIQED1LIR | <code>FAB LIQED 1LITER</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| W14 | E  C  WASH | <code>E  C  WASH</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| B19 | VIVEL 100G BLUE | <code>விவல் 100g Aloevera</code> | Tamil says Aloevera; English says BLUE. Confirm variant. |
| B53 | M/S 3IN1 | <code>M/S 3in1</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| T11 | KANNAVARITEA250GM | <code>கண்ணவரைடீ250gm</code> | கண்ணவரை versus KANNAVARITEA; confirm tea brand. |
| T20 | A.V.T 100G | <code>A.V.T.100g</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| T21 | A.V.T 250G | <code>A.V.T250g</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| T23 | A.V.T500G | <code>A.V.T 500g</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| T24 | A.V.T 1KG | <code>A.V.T1KG</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| 220 | BAMBINO SEMIA 450GM | <code>பாமினோசேமியா 500g</code> | Tamil says 500g; English says 450GM. Confirm actual pack size. |
| 222 | ADAPRADHAMAM | <code>அடப்பிரதம்</code> | அடப்பிரதம் may mean அடைப்பிரதமன்; confirm exact product name. |
| 301 | COLGATE 50G | <code>கோல்கேட் 38g</code> | Tamil says 38g; English says 50G. Confirm actual pack size. |
| 308 | PEPSODENT 175G | <code>பெப்சோடென்ட் 200g</code> | Tamil says 200g; English says 175G. Confirm actual pack size. |
| 935 | EASY BANG(B) | <code>ஈஷி பேங்க்(B)</code> | EASY BANG/BANK brand ambiguous; current ஈஷி may be wrong. Confirm pack. |
| A13 | SUNDA VATHAL | <code>சுண்டவத்தல்</code> | சுண்டவத்தல் is abbreviated; consider சுண்டைக்காய் வத்தல் only if owner wants expansion. |
| S01 | SUNSILK 800ML | <code>சன்சில்க் 80ml</code> | Tamil says 80ml; English says 800ML. Confirm actual pack size. |
| S14 | H &amp; S 100ML | <code>H &amp; S 100ml</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| S15 | H &amp; S 200ML | <code>H &amp; S 200ml</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| S44 | DOVE SHM (SAC) | <code>டவ்ஷாம்பு (Sac)(2</code> | Name ends in (Sac)(2 with missing closing parenthesis; confirm full label. |
| 802 | DETTOL 100ML | <code>டெட்டால் 125ml</code> | Tamil says 125ml; English says 100ML. Confirm actual pack size. |
| 803 | DETTOL 200ML | <code>டெட்டால் 250ml</code> | Tamil says 250ml; English says 200ML. Confirm actual pack size. |
| P11 | T.S.R.140G | <code>T.S.R.140g</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| P12 | T.S.R.300G | <code>T.S.R.300g</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| F02 | F &amp; L 25G | <code>F &amp; L 25g</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| F03 | F &amp; L50G | <code>F &amp; L 50g</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| F04 | F&amp;L 80G | <code>F &amp; L 80g</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| F07 | F&amp;L(MEN) 25G | <code>F &amp; L (men) 25G</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Q08 | 50-50(B) | <code>50-50(B)</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Q09 | 50-50(S) | <code>50-50(S)</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Q29 | LAYS | <code>Lays</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Z21 | OLD BALANCE | <code>பேலன்ஸ்</code> | Old balance accounting entry; not an ordinary product. Keep owner terminology. |
| O59 | VVD 1LT(PKT) | <code>VVD 1lt (PKT)</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| G320 | S.S.K | <code>S.S.K</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| G340 | R.R.G | <code>R.R.G</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| G186 | SASTHA 500LT | <code>சாஸ்தா ந.எண் 500</code> | English says 500LT; Tamil says 500 without unit. Confirm label. |
| G189 | MADHURAM 500LT | <code>மதுரம் 500lt</code> | Both labels say 500lt for oil; confirm unit. |
| G350 | B.R.M | <code>B.R.M</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| G242 | BRM | <code>B.R.M</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| G352 | SRIVASAKI | <code>ஸ்ரீவாசகி</code> | SRIVASAKI versus ஸ்ரீவாசகி; possible ஸ்ரீவாசுகி. Confirm rice brand. |
| 936 | EASY BANK(S) | <code>ஈஷிபேங்க்(S)</code> | EASY BANG/BANK brand ambiguous; current ஈஷி may be wrong. Confirm pack. |
| 500 | GRP 500ML | <code>GRP 500ML</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Z24 | M.R.S | <code>M.R.S</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Z27 | GOLDFILTER | <code>GOLDFILTER</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Z28 | GOLD KING | <code>GOLD KING</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Z29 | SCISS FILTER | <code>SCISS FILTER</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| 614. | BOOST 6RSPKT | <code>பூஸ்ட் 5ரூபாக்</code> | Tamil price label 5ரூ versus English 6RS. Confirm label; no price field changes. |
| 601. | HORLICKS 6RSPKT | <code>ஸார்லிக்ஸ் 5ரூபாக்</code> | Tamil price label 5ரூ versus English 6RS. Confirm label; no price field changes. |
| 601.. | HORLICKS 200KG BOT | <code>ஸார்லிக்ஸ்200kg bot</code> | Both labels say 200kg for Horlicks; likely wrong unit. Confirm pack; do not assume 200g. |
| M49.. | surul patti | <code>surul PATTAI</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| W19. | RIN MATIC 1KG | <code>rin matic 1kg</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| M47. | KARUJEERAGAM | <code>karujeeragam</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| T11. | LIVINGSTA 50GM | <code>லிவிங்ஸ்ட50gm</code> | LIVINGSTA versus லிவிங்ஸ்ட; confirm brand spelling. |
| K04. | AASHIRVAAD500GM | <code>aashirvaad 500gm</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Z56 | PANIYANWAST | <code>பணியன்வேஸ்ட்</code> | PANIYANWAST: confirm பனியன்/பனியன் வேஸ்ட் product meaning. |
| Z58 | SPOON | <code>spoon</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| T24. | A V T HOT500GM | <code>A V T HOT500GM</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Z60 | FREE GIFT | <code>FREE GIFT</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| B12. | CHATRICA SET | <code>சந்ரிகாசெட்</code> | English CHATRICA probably Chandrika; confirm brand on pack. |
| Y21 | B...... | <code>B.......</code> | Placeholder B.......; owner must supply real item name.; English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Y22 | Y... | <code>Y...</code> | Placeholder Y...; owner must supply real item name.; English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Y23 | Y.. | <code>Y..</code> | Placeholder Y..; owner must supply real item name.; English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |
| Z74 | SAAYAM | <code>sayam</code> | English/ASCII-only Tamil name. May be intentional brand abbreviation; owner to confirm whether Tamil transcription is wanted. |

## Full catalogue reference — all 1,799 products

Unflagged means no specific correction proposed in this review; intentional abbreviations and English brand names have been retained.

| # | Code | English name | Current Tamil name | Review status |
|---:|---|---|---|---|
| 1 | M01 | STONE SALT | <code>கல் உப்பு சாதா</code> | No specific correction proposed |
| 2 | M02 | SALT | <code>சால்ட்</code> | No specific correction proposed |
| 3 | M03 | SUGAR | <code>அஸ்கா</code> | Owner confirmation |
| 4 | M04 | DOOR DALL | <code>து.பருப்பு (spl)</code> | No specific correction proposed |
| 5 | M05 | BLACK GRAM | <code>க. உளுந்து</code> | No specific correction proposed |
| 6 | M06 | WHITE GRAM | <code>வெ. உளுந்து</code> | No specific correction proposed |
| 7 | M07 | MOONG | <code>ப.பயிர்</code> | Proposed correction |
| 8 | M08 | MOONG DHAL | <code>பா.பருப்பு</code> | No specific correction proposed |
| 9 | M09 | W.UDAL DHAL | <code>வெ.உ.பருப்பு</code> | No specific correction proposed |
| 10 | M10 | THADAPAYIRU | <code>த. பயிர்</code> | Proposed correction |
| 11 | M11 | BENGAL GRAM(B) | <code>க.சுண்டல்</code> | No specific correction proposed |
| 12 | M12 | BENGAL GRAM(W) | <code>வெ.சுண்டல்</code> | No specific correction proposed |
| 13 | M13 | BENGAL GRAM DHAL | <code>க.பருப்பு</code> | No specific correction proposed |
| 14 | M14 | VADA DHAL | <code>வ.பருப்பு</code> | No specific correction proposed |
| 15 | M15 | GREEN PEAS | <code>ப.பட்டாணி</code> | No specific correction proposed |
| 16 | M16 | HORSE GRAM | <code>கொள்ளு</code> | No specific correction proposed |
| 17 | M18 | FRY GRAM | <code>பொ.கடலை</code> | No specific correction proposed |
| 18 | M19 | FRY GRAM (FULL) | <code>மு.பொ.கடலை</code> | No specific correction proposed |
| 19 | M20 | DIMAND KALKANDU | <code>டைமன்கல்கண்டு</code> | No specific correction proposed |
| 20 | M21 | FRY GROUNUT | <code>வறு.நி.கடலை</code> | No specific correction proposed |
| 21 | M22 | WHITE BEAN | <code>வெள்ளமொச்சை</code> | No specific correction proposed |
| 22 | M23 | RAJMABEAN`S | <code>ராஜ்மா பீன்ஸ்</code> | No specific correction proposed |
| 23 | M24 | RED BEANS | <code>வரி பீன்ஸ்</code> | No specific correction proposed |
| 24 | M25 | BEAN DHAL | <code>அவரை பருப்பு</code> | No specific correction proposed |
| 25 | M26 | FRIEDGREAM | <code>பொ.கடலை (சாதா)</code> | No specific correction proposed |
| 26 | M27 | M DHAL | <code>மைசூர் பருப்பு</code> | No specific correction proposed |
| 27 | M28 | SOYA PEANS | <code>சோயா பீன்ஸ்</code> | No specific correction proposed |
| 28 | M29 | IDLI SOYA | <code>இட்லி சோயா</code> | No specific correction proposed |
| 29 | M30 | SOOYA | <code>சோயாபீன்ஸ்</code> | No specific correction proposed |
| 30 | M31 | SOOYA(MNI) | <code>சோயாபீன்ஸ்(மினி)</code> | No specific correction proposed |
| 31 | M32 | AVAL | <code>அவுல்</code> | Proposed correction |
| 32 | M33 | SOOJI (ROST) | <code>வெ.ரவை (Rost)</code> | No specific correction proposed |
| 33 | M34 | MAKKARAVA | <code>மக்காரவை</code> | No specific correction proposed |
| 34 | M35 | FOOD RAVA | <code>சாப்பாடுரவை</code> | No specific correction proposed |
| 35 | M36 | MAYILE MARK | <code>மயில்மார்க்ரவை</code> | No specific correction proposed |
| 36 | M37 | PAJAPWHEET | <code>பஞ்சாப்கோதுமை</code> | No specific correction proposed |
| 37 | M38 | OOSI WHEAT | <code>ஊசி கோதுமை</code> | No specific correction proposed |
| 38 | M39 | DHANIYA | <code>நாடு மல்லி</code> | Owner confirmation |
| 39 | M40 | GARLIC | <code>பூண்டு</code> | No specific correction proposed |
| 40 | M41 | CHILLY | <code>வரமிளகாய் (நீட்டம்)</code> | No specific correction proposed |
| 41 | M42. | SUNDAVATAL | <code>சுண்டவத்தல்</code> | Owner confirmation |
| 42 | M43 | TARMARIND | <code>புளி</code> | No specific correction proposed |
| 43 | M44 | MUSTARD | <code>கடுகு</code> | No specific correction proposed |
| 44 | R01 | SAMAI RICE | <code>சாமை அரிசி</code> | No specific correction proposed |
| 45 | R02 | VARAKU  RICE | <code>வரகு அரிசி</code> | No specific correction proposed |
| 46 | R03 | ROAW  RICE | <code>பச்சஅரிசி</code> | Proposed correction |
| 47 | M45 | MENTHI | <code>வெந்தயம்</code> | No specific correction proposed |
| 48 | M46 | PEPPER | <code>மிளகு</code> | No specific correction proposed |
| 49 | M47 | JEERA | <code>சீரகம்</code> | No specific correction proposed |
| 50 | M48 | SOUNF | <code>சோம்பு</code> | No specific correction proposed |
| 51 | M49 | PATTAI | <code>பட்டை</code> | No specific correction proposed |
| 52 | M50 | LAVANGAM | <code>கிராம்பு</code> | No specific correction proposed |
| 53 | M51 | KASAKASA | <code>கசகசா</code> | No specific correction proposed |
| 54 | M52 | RAGI | <code>ராகி</code> | No specific correction proposed |
| 55 | M53 | KAMBU | <code>கம்பு</code> | No specific correction proposed |
| 56 | M54 | CHOLAM | <code>சோளம்</code> | No specific correction proposed |
| 57 | M55 | THINI | <code>தினை</code> | No specific correction proposed |
| 58 | M56 | ANNASI POO | <code>அன்னாச்சிபூ</code> | Owner confirmation |
| 59 | M57 | ANNASI POO 50G | <code>அன்னாச்சிபூ50g</code> | Owner confirmation |
| 60 | M58 | KALPASI | <code>கல்பாசி</code> | No specific correction proposed |
| 61 | M59 | KALPASI 50G | <code>கல்பாசி 50g</code> | No specific correction proposed |
| 62 | M60 | KAST. MATTI | <code>கஸ்தூரிமேத்தி</code> | No specific correction proposed |
| 63 | M61 | MARATHI MOKKU | <code>மராத்திமொக்கு</code> | No specific correction proposed |
| 64 | M62 | JATHIPATHRI | <code>ஜாதிபத்ரி</code> | No specific correction proposed |
| 65 | M63 | TIPPLI | <code>திப்பிலி</code> | No specific correction proposed |
| 66 | M64 | JATHIKKAI | <code>ஜாதிக்காய்</code> | No specific correction proposed |
| 67 | M65 | ROJA MOKKU | <code>ரோஜாமொக்கு</code> | No specific correction proposed |
| 68 | M66 | SAPJASEEDS | <code>சப்ஜாவிதை</code> | No specific correction proposed |
| 69 | M67 | BRIYANI LEAF | <code>பிரியாணிஇலை</code> | No specific correction proposed |
| 70 | M68 | TILL BLACK | <code>கருப்பு எள்ளு</code> | No specific correction proposed |
| 71 | M69 | TILL WHITE | <code>வெ.எள்ளு</code> | No specific correction proposed |
| 72 | M70 | SAGO | <code>ஜவ்வரிசி</code> | No specific correction proposed |
| 73 | M71 | AGINA MOTTO | <code>அஜினாமொட்டு</code> | No specific correction proposed |
| 74 | M72 | COOKING SODA | <code>சமையல்சோடா</code> | No specific correction proposed |
| 75 | M73 | MAVU SAGO | <code>மாவுஜவ்வரிசி</code> | No specific correction proposed |
| 76 | M74 | GINGER C0FFEE 1PKT | <code>சுக்கு காபி 1pkt</code> | No specific correction proposed |
| 77 | M75 | BIRIYANI ITEM | <code>பிரியாணிஅயிட்டம்</code> | No specific correction proposed |
| 78 | M76 | M.SOLAM | <code>ம.சோளம்</code> | No specific correction proposed |
| 79 | M77 | LG.POWDER 50G | <code>LG.தூள் 50G</code> | No specific correction proposed |
| 80 | M78 | LG.KATTI 50G | <code>LG.கட்டி 50g</code> | No specific correction proposed |
| 81 | M79 | LG.POWDER 100G | <code>LG.தூள் 100g</code> | No specific correction proposed |
| 82 | M80 | LG.KATTI 100G | <code>LG.கட்டி 100g</code> | No specific correction proposed |
| 83 | M81 | KOTTA MUTHU | <code>கொட்டமுத்து</code> | No specific correction proposed |
| 84 | M82 | BARLI | <code>பார்லி</code> | No specific correction proposed |
| 85 | M83 | OMUM | <code>ஓமம்</code> | No specific correction proposed |
| 86 | M84 | DRY GINGER | <code>சுக்கு</code> | No specific correction proposed |
| 87 | R04 | BALCK KAVULIRICE | <code>கருப்புகவுனிஅரிசி</code> | No specific correction proposed |
| 88 | R05 | IDLY RICE | <code>இட்லிஅரிசி</code> | No specific correction proposed |
| 89 | R06 | KURUNI | <code>குருனை அரிசி</code> | No specific correction proposed |
| 90 | R07 | JEERASAMBABRIYANI | <code>சீரகசம்பாபிரியாணி</code> | No specific correction proposed |
| 91 | R08 | RICE NO.1 | <code>சாப்பாட்டு அரிசிNO.1</code> | No specific correction proposed |
| 92 | R09 | RICE NO.2 | <code>சாப்பாட்டுஅரிசி NO.2</code> | No specific correction proposed |
| 93 | R10 | RICE NO.3 | <code>சாப்பட்டு அரிசிNO.3</code> | Proposed correction |
| 94 | R11 | RICE 5R 20 | <code>சாப்பாட்டு அரிசி 5R20</code> | No specific correction proposed |
| 95 | R12 | RICE NO.5 | <code>சாப்பாட்டு அரிசி NO.5</code> | No specific correction proposed |
| 96 | R13 | SIVAJI 10KG | <code>சிவாஜி 10kg</code> | No specific correction proposed |
| 97 | R14 | AASAI 10KG | <code>ஆசை 10kg</code> | No specific correction proposed |
| 98 | M85 | ORNGERED | <code>ஆரஞ்ரெட்</code> | No specific correction proposed |
| 99 | M86 | PATTAI,LAVANGAM | <code>பட்டை,கிராம்பு</code> | No specific correction proposed |
| 100 | M87 | G.MOONG(NADU) | <code>ப.பயிர்(நாடு)</code> | Proposed correction |
| 101 | R15 | K S 5KG | <code>K S 5KG</code> | Owner confirmation |
| 102 | R16 | SHIVAGI 26KG OLD | <code>சிவாஜி 26kg(old)</code> | No specific correction proposed |
| 103 | R17 | MALAER26KG | <code>மலர் 26KG</code> | No specific correction proposed |
| 104 | R18 | SS KANGAYAM 26KG OLD | <code>SS.காங்கயம் 26kg(old)</code> | No specific correction proposed |
| 105 | R19 | VENUS 25KG | <code>வீனஸ் 25கி</code> | No specific correction proposed |
| 106 | R21 | PITAMILL 10KG | <code>பைந்தமிழ் 10KG</code> | No specific correction proposed |
| 107 | R22 | 14W CFL BULB | <code>14வாட்CFL பல்பு</code> | No specific correction proposed |
| 108 | R23 | MAHARAJA 25KG | <code>மஸாராஜா 25கி</code> | Proposed correction |
| 109 | R24 | HALFBOIL25KG | <code>ஸாஃபாயில்25kg</code> | No specific correction proposed |
| 110 | R25 | SS KAGAYAM NEW 25KG | <code>SS.காங்கயம் (New) 25கி</code> | No specific correction proposed |
| 111 | R26 | SAKTHIMAN 25KG | <code>சக்திமான் 25kg</code> | No specific correction proposed |
| 112 | O01 | GR.OIL | <code>க.எண்ணெய்</code> | No specific correction proposed |
| 113 | O02 | CO.OIL | <code>தே.எண்ணெய் (லூஸ்)</code> | No specific correction proposed |
| 114 | O03 | GINGLY OIL | <code>நல்லெண்ணெய்(லூஸ்)</code> | No specific correction proposed |
| 115 | O04 | O.K OIL | <code>O.K ஆயில்(லூஸ்)</code> | No specific correction proposed |
| 116 | O05 | FORTUNEOIL 1LI | <code>ஃபார்ச்யுன் 1li</code> | No specific correction proposed |
| 117 | O06 | MUYALCASTROIL 500ML | <code>முயல்வி.எண்ணை 500ml</code> | No specific correction proposed |
| 118 | O07 | DURKA NALANNAI | <code>துர்கா ந.எண்ணெய் (SPL)</code> | No specific correction proposed |
| 119 | O09 | IDAYAM 1LT | <code>இதயம் 1ltr</code> | No specific correction proposed |
| 120 | O10 | IDAYAM 500ML | <code>இதயம் 500ml</code> | No specific correction proposed |
| 121 | O11 | IDAYAM 200ML | <code>இதயம் 200ml</code> | No specific correction proposed |
| 122 | O12 | IDAYAM 100ML | <code>இதயம் 100ml</code> | No specific correction proposed |
| 123 | O13 | GOLD WINNER 1LT | <code>கோல்டுவின்னர் 1lt</code> | No specific correction proposed |
| 124 | O14 | THULACI SPL GINGL CKKU | <code>தூளசிநல்லண்னை(செக்கு)</code> | No specific correction proposed |
| 125 | O15 | GOLDWINNER 5LTCAN | <code>கோல்டுவின்னர் 5ltcan</code> | No specific correction proposed |
| 126 | O16 | PALM OIL | <code>பாமாயில்</code> | No specific correction proposed |
| 127 | O18 | MR GOLD GRO. | <code>MR GOLD.GRO</code> | Owner confirmation |
| 128 | O19 | MR.GOLD SFOIL5L | <code>Mr.கோல்டு5L+தாவா</code> | No specific correction proposed |
| 129 | O20 | GANAPATHY 1LT | <code>கணபதி 1lt</code> | No specific correction proposed |
| 130 | O23 | CHKU GRO. | <code>செக்குகட.எண்ணை</code> | No specific correction proposed |
| 131 | O24 | R L CHEKKU GI OIL | <code>R L செக்கு ந.எண்</code> | No specific correction proposed |
| 132 | O25 | SUFFOLA | <code>சபோஃலா</code> | No specific correction proposed |
| 133 | O26 | CASTOR OIL 150ML | <code>வி.எண்ணெய் 50ML</code> | Owner confirmation |
| 134 | O28 | CASTOR OIL 100ML | <code>வி.எண்ணெய் 100ML</code> | No specific correction proposed |
| 135 | O29 | CASTOR OIL 200ML | <code>வி.எண்ணெய் 200ML</code> | No specific correction proposed |
| 136 | O30. | CASTOR OIL 500ML | <code>வி.எண்ணெய் 500ML</code> | No specific correction proposed |
| 137 | O31 | BUTTER | <code>வெண்ணெய்</code> | No specific correction proposed |
| 138 | O32 | DALDA 100ML | <code>டால்டா 100ML</code> | No specific correction proposed |
| 139 | O33 | DALDA 200ML | <code>டால்டா 200ML</code> | No specific correction proposed |
| 140 | O34 | DALDA 500G | <code>டால்டா 500g</code> | No specific correction proposed |
| 141 | O35 | DALDA 1KG | <code>டால்டா 1kg</code> | No specific correction proposed |
| 142 | O36 | THENNAMARA.OIL | <code>தென்னமரகுடிஆயில்</code> | No specific correction proposed |
| 143 | O37 | PARASUT | <code>பாரசூட் 50மிபாட்டல்</code> | No specific correction proposed |
| 144 | O38 | NEEM OIL 50ML | <code>வேப்பெண்ணை 50ml</code> | No specific correction proposed |
| 145 | O41 | ILUPPAI OIL | <code>இலுப்பெண்ணை</code> | No specific correction proposed |
| 146 | O42 | PARACHUTE 100PKT | <code>பாராசூட் 100pkt</code> | No specific correction proposed |
| 147 | O43 | PARACHUTE 100BOT | <code>பாராசூட் 100bot</code> | No specific correction proposed |
| 148 | O44 | PARACHUTE 175MLBOT | <code>பாராசூட் 175MLbot</code> | No specific correction proposed |
| 149 | O45 | PARACHUTE 500BOT | <code>பாராசூட் 500bot</code> | No specific correction proposed |
| 150 | O46 | V.V.D 100PKT | <code>V.V.D 100pkt</code> | Owner confirmation |
| 151 | O47 | V.V.D 100BOT | <code>V.V.D 100bot</code> | Owner confirmation |
| 152 | O48 | V.V.D 200BOT | <code>V.V.D 200bot</code> | Owner confirmation |
| 153 | O49 | V.V.D 500BOT | <code>V.V.D 500bot</code> | Owner confirmation |
| 154 | O50 | V.V.D 500PKT | <code>V.V.D 500pkt</code> | Owner confirmation |
| 155 | O51 | DEEPAM OIL 1LIT | <code>தீபம்ஆயில்1பாட்டல்</code> | No specific correction proposed |
| 156 | O52 | DEEPAM OIL 500ML | <code>தீபஆயில்500மிபாட்டல்</code> | No specific correction proposed |
| 157 | O53 | V.V.D 50ML BOT | <code>V.V.D.50ml bot</code> | Owner confirmation |
| 158 | O39 | NEEM OIL 100ML | <code>வேப்பெண்ணை 100ml</code> | No specific correction proposed |
| 159 | O40 | MUDDIKULAKARIOIL | <code>முட்டிகுளங்கரைஆயில்</code> | No specific correction proposed |
| 160 | O17 | SUNFLOWER TIN | <code>சன்பிளவர் டின்</code> | No specific correction proposed |
| 161 | O54 | CUSTARD OIL | <code>கடுகு எண்ணை</code> | No specific correction proposed |
| 162 | O55 | FORTUNE OIL 1LT | <code>ஃபார்சூன் ஆயில் 1lt</code> | No specific correction proposed |
| 163 | O56 | RICE OIL | <code>ரைஸ் ஆயில்</code> | No specific correction proposed |
| 164 | W01 | RINSAKTHI(B) | <code>ரின்சக்தி(B)</code> | No specific correction proposed |
| 165 | W02 | RINSURF XL(B) | <code>ரின்SURFXL(B)</code> | No specific correction proposed |
| 166 | W03 | RINSUPREAM(S) | <code>ரின்சுப்ரீம்(S)</code> | No specific correction proposed |
| 167 | W04 | RIN SHATHI (S) | <code>ரின் சக்தி (S)</code> | No specific correction proposed |
| 168 | W05 | RIN SHATHI  (RS.5) | <code>ரின் சக்தி (ரூ.5)</code> | No specific correction proposed |
| 169 | W36 | VANISH(JAR) | <code>வேனிக்ஷஜார்</code> | Proposed correction |
| 170 | W07 | RIN POWDER (RS.10) | <code>ரின் பவுடர் (ரூ.10)</code> | No specific correction proposed |
| 171 | W08 | ARASAN(S) | <code>அரசன் (S)</code> | No specific correction proposed |
| 172 | W09 | ARASAN(B) | <code>அரசன் (B)</code> | No specific correction proposed |
| 173 | W10 | TIDE SOAP POWER | <code>டைடுசோப்பவுடர்10ரூ</code> | No specific correction proposed |
| 174 | W11 | POWERSOAP(S) | <code>பவர்சோப்(s)</code> | No specific correction proposed |
| 175 | W12 | POWER SOAP(B) | <code>பவர்சோப்(B)</code> | No specific correction proposed |
| 176 | W13 | FAB LIQED1LIR | <code>FAB LIQED 1LITER</code> | Owner confirmation |
| 177 | W14 | E  C  WASH | <code>E  C  WASH</code> | Owner confirmation |
| 178 | W15 | XLMATICK FRONT 1LIT | <code>XLமேடிக்FRONT 1LIT</code> | No specific correction proposed |
| 179 | W16 | KADAR BAR | <code>கதர் பார்</code> | No specific correction proposed |
| 180 | W17 | SUNLIGHT SOAP | <code>சன்லைட் சோப்</code> | No specific correction proposed |
| 181 | W18 | RIN POWDER 1KG | <code>ரின் பவுடர் 1kg</code> | No specific correction proposed |
| 182 | W19 | RINPOWDER 500GM | <code>ரின் பவுடர் 500gm</code> | No specific correction proposed |
| 183 | W20 | SURFXL MATIC(FRON)1KG | <code>சர்ப்XLமேட்டிக்(FRON)1KG</code> | No specific correction proposed |
| 184 | W21 | SURFXLMATIC(FRON)500GM | <code>சர்ப்XLமேட்டிக்(FRON)500GM</code> | No specific correction proposed |
| 185 | W22 | BLUE WHEEL 500GM | <code>ப்ளூவீல்பவுடர் 500gm</code> | No specific correction proposed |
| 186 | W23 | G.WHEEL 1KG | <code>பச்சைவீல்பவுடர் 1kg</code> | No specific correction proposed |
| 187 | W24 | G.WHEEL 500GM | <code>பச்சைவீல்பவுடர் 500gm</code> | No specific correction proposed |
| 188 | W25 | SURF BLUE 1KG | <code>சர்ப் புளூ 1kg</code> | No specific correction proposed |
| 189 | W26 | SURF BLUE 500GM | <code>சர்ப் ப்ளூ 500gm</code> | No specific correction proposed |
| 190 | W27 | SURF BLUE 200GM | <code>சர்ப் ப்ளூ 200gm</code> | No specific correction proposed |
| 191 | W28 | SURF XL 1KG | <code>சர்ப் XL QW 1kg</code> | No specific correction proposed |
| 192 | W29 | SURFXL 500GM | <code>சர்ப் XL QW500gm</code> | No specific correction proposed |
| 193 | W30 | SURF XL QW 200GM | <code>சர்ப் XL QW 200gm</code> | No specific correction proposed |
| 194 | W31 | SURFXLMATIC 1KG(TOP) | <code>சர்ப் XLமேட்டிக் 1kg(Top)</code> | No specific correction proposed |
| 195 | W32 | SURF XL MATIC 500GM(TOP) | <code>சர்ப்XLமேட்டிக் 500gm(Top)</code> | No specific correction proposed |
| 196 | W33 | GREEN ARIAL 1KG | <code>பச்சை ஏரியல் 1kg +500gm</code> | No specific correction proposed |
| 197 | W34 | GREEN ARIYAL 500GM | <code>பச்சை ஏரியல் 500gm</code> | No specific correction proposed |
| 198 | W35 | GREEN ARIYAL 700GM | <code>பச்சை ஏரியல் 700gm</code> | No specific correction proposed |
| 199 | W38 | ARIEL LIQ.TOP900GM | <code>ஏரியல் TOP900gm</code> | No specific correction proposed |
| 200 | W39 | ARIEL FRONT1LIT | <code>ஏரியல் FRONT1LIT.</code> | No specific correction proposed |
| 201 | W40 | TIDE 1KG | <code>டைடு 1kg</code> | No specific correction proposed |
| 202 | W41 | TIDE 500GM | <code>டைடு 500gm</code> | No specific correction proposed |
| 203 | W42 | TIDE 200GM | <code>டைடு 200gm</code> | No specific correction proposed |
| 204 | W43 | POWER 1KG | <code>பவர் 1kg</code> | No specific correction proposed |
| 205 | W44 | POWER 500KG | <code>பவர் 500gm</code> | No specific correction proposed |
| 206 | W45 | MR.WHITE 1KG | <code>Mr.ஒயிட் 1kg</code> | No specific correction proposed |
| 207 | W46 | WASHING SODA | <code>துணிசோடா</code> | No specific correction proposed |
| 208 | W47 | REVIVE 200GM | <code>ரிவைவ் 200gm</code> | No specific correction proposed |
| 209 | W48 | REVIVE 50GM | <code>ரிவைவ் 50gm</code> | No specific correction proposed |
| 210 | W49 | RANI PAL | <code>ராணிப்பால்</code> | No specific correction proposed |
| 211 | W50 | UJALA (S) | <code>உஜாலா (s)</code> | No specific correction proposed |
| 212 | W51 | UJALA (B) | <code>உஜாலா (b)</code> | No specific correction proposed |
| 213 | W52 | REVIVE 200 | <code>ரீகல் 200 ml</code> | No specific correction proposed |
| 214 | W53 | REGAL 95ML | <code>ரீகல் 95ml</code> | No specific correction proposed |
| 215 | W54 | SUPERTONE(S) | <code>சூப்பர்டோன் (s)</code> | No specific correction proposed |
| 216 | W55 | RINAALA200ML | <code>ரின்ஆலா200ml</code> | No specific correction proposed |
| 217 | W56 | ALA 500ML | <code>ஆலா 500ml</code> | No specific correction proposed |
| 218 | W57 | TIDE SOAP 200G | <code>டைடு சோப் 200g</code> | No specific correction proposed |
| 219 | W58 | TIDE SOAP 125G | <code>டைடு சோப் 125g</code> | No specific correction proposed |
| 220 | W59 | TIDE SOAP 75G | <code>டைடு சோப் 75g</code> | No specific correction proposed |
| 221 | W60 | SURF BLUE 750G | <code>சர்ப் ப்ளூ 750g</code> | No specific correction proposed |
| 222 | W61 | SOFTOUCH | <code>சாப்ட்டச்</code> | No specific correction proposed |
| 223 | W62 | COMFO(SEC) | <code>கம்போ(sec)</code> | No specific correction proposed |
| 224 | W63 | COMFORT400ML | <code>கம்ஃபோர்ட்400ml</code> | No specific correction proposed |
| 225 | W64 | COMFO(BLUE)800ML | <code>கம்ஃபோ(புளூ)800ml</code> | No specific correction proposed |
| 226 | W65 | COMFORT(SAC) | <code>கம்ஃபர்ட்(Sac)</code> | No specific correction proposed |
| 227 | W66 | COMFO(BLUE)200ML | <code>கம்ஃபாட்(புளூ)200ml</code> | No specific correction proposed |
| 228 | W67 | STARCH POWDER | <code>கஞ்சிபவுடர்</code> | No specific correction proposed |
| 229 | W68 | ARIAL(SAC) | <code>ஏரியல்(sac)</code> | No specific correction proposed |
| 230 | W69 | SURF XL(SAC) | <code>சர்ப் XL(sac)</code> | No specific correction proposed |
| 231 | W70 | TIDE(SAC) | <code>டைடு(sac)</code> | No specific correction proposed |
| 232 | W71 | RIN(SAC) | <code>ரின்(sac)</code> | No specific correction proposed |
| 233 | B01 | HAMAM 100G | <code>ஸமாம் 100gm</code> | Proposed correction |
| 234 | B02 | HAMAM 150GM | <code>ஸமாம் 150gm</code> | Proposed correction |
| 235 | B03 | REXONA 100GM | <code>ரெக்சோனா 100gm</code> | No specific correction proposed |
| 236 | B04 | REXONA 150GM | <code>ரெக்சோனா 150gm</code> | No specific correction proposed |
| 237 | B05 | LUX 100GM | <code>லக்ஸ் 100gm</code> | No specific correction proposed |
| 238 | B06 | LUX 150GM | <code>லக்ஸ் 150gm</code> | No specific correction proposed |
| 239 | B07 | LUX (INTER)75GM | <code>லக்ஸ்(inter)75gm</code> | No specific correction proposed |
| 240 | B08 | MEDIMIX 75GM\ | <code>மெடிமிக்ஸ் 75gm</code> | No specific correction proposed |
| 241 | B09 | MEDIMIX 125GM | <code>மெடிமிக்ஸ் 125gm</code> | No specific correction proposed |
| 242 | B10 | M.S 75GM | <code>மைசூர்சேன்டல் 75gm</code> | No specific correction proposed |
| 243 | B11 | M.S 150GM | <code>மைசூர்சேன்டல் 150gm</code> | No specific correction proposed |
| 244 | B12 | HAMAM MINI | <code>ஸமாம் (மினி)</code> | Proposed correction |
| 245 | B13 | CHANDRIKA 75GM | <code>சந்திரிகா  75gm</code> | No specific correction proposed |
| 246 | B14 | OIL CINTHOL 100GM | <code>ஓல்டு சிந்தால் 100gm</code> | No specific correction proposed |
| 247 | K01 | WHEET FIOUR | <code>பூரிமாவு mayil</code> | No specific correction proposed |
| 248 | K02 | ATTAMAVU | <code>ஆட்டாமாவு</code> | No specific correction proposed |
| 249 | K03 | AASERVATH 2KG | <code>ஆசீர்வாத் 2KG</code> | No specific correction proposed |
| 250 | K04 | ASHIRWATH ATTA | <code>ஆசிர்.கோ.மாவு</code> | No specific correction proposed |
| 251 | K27 | KAMBU COOL 1KG | <code>கம்புகூழ்மாவு1kg</code> | No specific correction proposed |
| 252 | K06 | MAIDA | <code>மைதா</code> | No specific correction proposed |
| 253 | K07 | VMBMITHA | <code>VMB மைதா</code> | No specific correction proposed |
| 254 | K08 | GRAM.FLOUR | <code>கடலை மாவு</code> | No specific correction proposed |
| 255 | K09 | RICE FLOUR | <code>அரிசி மாவு</code> | No specific correction proposed |
| 256 | K10 | RAGI FLOUR | <code>ராகி மாவு</code> | No specific correction proposed |
| 257 | K11 | BADREE MAVU | <code>பட்ரி மாவு</code> | No specific correction proposed |
| 258 | K12 | MOONG FLOUR | <code>ப.பயிர் மாவு</code> | No specific correction proposed |
| 259 | K13 | BAJJI MAAVU 200G | <code>பஜ்ஜிமாவு 200gm</code> | No specific correction proposed |
| 260 | K14 | BAJJI MAAVU 500GM | <code>பஜ்ஜிமாவு 500gm</code> | No specific correction proposed |
| 261 | K15 | PILLSBURY 2KG | <code>பில்ஸ்பரி 2kg</code> | No specific correction proposed |
| 262 | K16 | SATHUMAVU 500GM | <code>சத்துமாவு 500gm</code> | No specific correction proposed |
| 263 | K17 | KOLAKADDI MAVU | <code>கொலக்கட்டைமாவு</code> | Proposed correction |
| 264 | K18 | ATHIRASAMAVU | <code>அதிரசமாவு</code> | No specific correction proposed |
| 265 | K19 | CORNFLOUR 1KG | <code>கான்ஃப்ளார் 1kg</code> | No specific correction proposed |
| 266 | K20 | PUTTU MAAVU | <code>புட்டுமாவு</code> | No specific correction proposed |
| 267 | K21 | MURUKKU MAAVU | <code>முறுக்குமாவு</code> | No specific correction proposed |
| 268 | K22 | URAND DALL | <code>உளுந்து மாவு</code> | No specific correction proposed |
| 269 | K23 | KILANGU MAAVU | <code>கிழங்கு மாவு</code> | No specific correction proposed |
| 270 | K24 | KAMBU DOSAI MAVU | <code>கம்பு தோசைமாவு</code> | No specific correction proposed |
| 271 | K25 | SOLA DOSAI MAVU | <code>சோளதோசைமாவு</code> | No specific correction proposed |
| 272 | K26 | RAGI DOSAI 500G | <code>ராகிதோசை</code> | No specific correction proposed |
| 273 | D01 | CASHEW FULL | <code>முழுமுந்திரி</code> | No specific correction proposed |
| 274 | D02 | CASHEW  10RS | <code>முந்திரி 10RS</code> | No specific correction proposed |
| 275 | D03 | CASHEW 50G | <code>முந்திரி 50g</code> | No specific correction proposed |
| 276 | D04 | CASHEW 100G | <code>முந்திரி 100g</code> | No specific correction proposed |
| 277 | D05 | CASHEW | <code>முந்திரி</code> | No specific correction proposed |
| 278 | D06 | GRAPES 10RS | <code>திராட்சை 10RS</code> | No specific correction proposed |
| 279 | D07 | GRAPES 50G | <code>திராட்சை 50g</code> | No specific correction proposed |
| 280 | D08 | GRAPES 100G | <code>திராட்சை 100g</code> | No specific correction proposed |
| 281 | D09 | GRAPES | <code>திராட்சை</code> | No specific correction proposed |
| 282 | D10 | BADAM 50G | <code>பாதாம் 50g</code> | No specific correction proposed |
| 283 | D11 | BADAM 100G | <code>பாதாம் 100g</code> | No specific correction proposed |
| 284 | D12 | BADAM | <code>பாதாம்</code> | No specific correction proposed |
| 285 | D13 | PISTA 50G | <code>பிஸ்தா 50g</code> | No specific correction proposed |
| 286 | D14 | PISTA 100G | <code>பிஸ்தா 100g</code> | No specific correction proposed |
| 287 | D15 | PISTA 1KG | <code>பிஸ்தா 1kg</code> | No specific correction proposed |
| 288 | D16 | WALLNUT | <code>வால்நட்</code> | No specific correction proposed |
| 289 | D17 | SARAPARUPPU 100G | <code>சாரப்பருப்பு 100g</code> | No specific correction proposed |
| 290 | D18 | ATTIPALAM | <code>அத்திபழம்</code> | No specific correction proposed |
| 291 | D19 | VELLARI VIDAI | <code>வெள்ளரிவிதை</code> | No specific correction proposed |
| 292 | D20 | CARDAMAM | <code>ஏலம்</code> | No specific correction proposed |
| 293 | D21 | CARDAMAM 10RS | <code>ஏலம் 10RS</code> | No specific correction proposed |
| 294 | D22 | CARDAMAM 10G | <code>ஏலம் 10g</code> | No specific correction proposed |
| 295 | D23 | CARDAMUM 50G | <code>ஏலம் 50g</code> | No specific correction proposed |
| 296 | D24 | CARDAMUM 100GM | <code>ஏலம் 100gm</code> | No specific correction proposed |
| 297 | D25 | DATES 250G | <code>பே.பழம் 250g</code> | No specific correction proposed |
| 298 | D26 | SEEDLESS 500G | <code>சீட்லெஸ் 500g</code> | No specific correction proposed |
| 299 | D27 | LION 200G | <code>லயன் 200g</code> | No specific correction proposed |
| 300 | D28 | LION 500G | <code>லயன் 500g</code> | No specific correction proposed |
| 301 | D29 | LION JAR 250GM | <code>லயன்ஜார் 250g</code> | No specific correction proposed |
| 302 | D30 | LION JAR 500G | <code>லயன்ஜார் 500g</code> | No specific correction proposed |
| 303 | D31 | BLACK DATES 500G | <code>கரு.பே.பழம் 500g</code> | No specific correction proposed |
| 304 | D32 | BLACK DATES 250G | <code>கரு.பே.பழம் 250g</code> | No specific correction proposed |
| 305 | D33 | LION.BLACK 250GJAR | <code>லயன் (கருப்பு) 250g ஜார்</code> | No specific correction proposed |
| 306 | D34 | LION BLACK 500JAR | <code>லயன் (கருப்பு)500ஜார்</code> | No specific correction proposed |
| 307 | D35 | LION ALMOND 200G | <code>லயன்பாதாம் 200g</code> | No specific correction proposed |
| 308 | D36 | DABUR HONEY 50ML | <code>டாபர்தேன் 50ml</code> | No specific correction proposed |
| 309 | D37 | D.HONEY 100ML | <code>டாபர்தேன் 100ml</code> | No specific correction proposed |
| 310 | D38 | D.HONEY 250ML | <code>டாபர்தேன் 250ml</code> | No specific correction proposed |
| 311 | D39 | D.HONEY 500ML | <code>டாபர்தேன் 500ml</code> | No specific correction proposed |
| 312 | D40 | D.HONEY 15RS | <code>லயன்தேன்15RS</code> | No specific correction proposed |
| 313 | D41 | L.HONEY 50ML | <code>லயன்தேன் 50ml</code> | No specific correction proposed |
| 314 | D42 | L.HONEY 100ML | <code>லயன்தேன் 100ml</code> | No specific correction proposed |
| 315 | D43 | L.HONEY 250ML | <code>லயன்தேன் 250ml</code> | No specific correction proposed |
| 316 | D44 | LION 1+1 | <code>லயன்  1+1</code> | No specific correction proposed |
| 317 | D45 | L.HONEY 1KG | <code>லயன் தேன்1kg</code> | No specific correction proposed |
| 318 | D46 | LION SYRUP200ML | <code>லயன்சிரப் 200ml</code> | No specific correction proposed |
| 319 | D47 | LIONSYRUP 500ML | <code>லயன்சிரப் 500ml</code> | No specific correction proposed |
| 320 | D48 | BITS CASHEW | <code>பிட்ஸ்முந்திரி</code> | No specific correction proposed |
| 321 | D49 | CERRI FRUIT | <code>செர்ரிபழம்</code> | No specific correction proposed |
| 322 | D50 | D.M.E | <code>தி.மு.ஏ</code> | No specific correction proposed |
| 323 | B15 | MEDIMIX SANDEL | <code>மெடிமிக்ஸ் சேண்டல்</code> | No specific correction proposed |
| 324 | B16 | LIFEBUOY NEEM | <code>லைபாய் பச்சை</code> | No specific correction proposed |
| 325 | B17 | LIFEBUOY MINI | <code>லைபாய் (மினி)</code> | No specific correction proposed |
| 326 | B18 | LIFEBOY 125G | <code>லைபாய் 125g</code> | No specific correction proposed |
| 327 | B19 | VIVEL 100G BLUE | <code>விவல் 100g Aloevera</code> | Owner confirmation |
| 328 | B20 | NO.1SOAP SET | <code>NO.1சோப் செட்</code> | No specific correction proposed |
| 329 | B21 | DETTOL H\W PAUMP | <code>டெட்டால் H\W pampu</code> | No specific correction proposed |
| 330 | B22 | LIFEBOY H\W PKT | <code>லைபாய் H\Wபாக்.</code> | No specific correction proposed |
| 331 | B23 | LIFEBOY H\W PUMP | <code>லைபாய் H\W பம்</code> | No specific correction proposed |
| 332 | B24 | DETTOL H\W PAKT | <code>டெட்டால் H\W PKT</code> | No specific correction proposed |
| 333 | B25 | PEARS 75G(GREEN) | <code>பியர்ஸ்75g(பச்சை)</code> | No specific correction proposed |
| 334 | B26 | PEARS 75G(BROWN) | <code>பியர்ஸ்75g(பிரவுன்)</code> | No specific correction proposed |
| 335 | B27 | PEARS75G(BLUE) | <code>பியர்ஸ்75g (ப்ளூ)</code> | No specific correction proposed |
| 336 | B28 | DOVE50GM | <code>டவ்சோப்50gm</code> | No specific correction proposed |
| 337 | B29 | PEARS125G(BROWN) | <code>பியர்ஸ்125g(பிரவுன்)</code> | No specific correction proposed |
| 338 | B30 | DOVE 100G | <code>டவ் 100g</code> | No specific correction proposed |
| 339 | B31 | DOVE 75G | <code>டவ் 75g</code> | No specific correction proposed |
| 340 | B32 | LIRIL 75G | <code>லிரில்  75g</code> | No specific correction proposed |
| 341 | B33 | LIRIL 125G | <code>லிரில் 125g</code> | No specific correction proposed |
| 342 | B34 | DETTOL SOAP 75G | <code>டெட்டால் சோப் 75g</code> | No specific correction proposed |
| 343 | B35 | DETTOL SOAP 125G | <code>டெட்டால் சோப் 125g</code> | No specific correction proposed |
| 344 | B36 | MEDI.SANDAL75G | <code>மெடிமிக்ஸ்சான்டல்75g</code> | No specific correction proposed |
| 345 | B37 | MEDI.SANDAL125G | <code>மெடிமிக்ஸ்சான்டல்125g</code> | No specific correction proposed |
| 346 | B38 | MARGO 75G | <code>மார்கோ 75g</code> | No specific correction proposed |
| 347 | B39 | HIMALAYA 75GM | <code>ஸிமாலயா 75g</code> | Proposed correction |
| 348 | B40 | WIPRO SHIKAKAI 100G | <code>விப்ரோ சோப் 100g</code> | No specific correction proposed |
| 349 | B41 | SANTOOR 100G | <code>சந்தூர் 100g</code> | No specific correction proposed |
| 350 | B42 | SANTOOR 150G | <code>சந்தூர் 150g</code> | No specific correction proposed |
| 351 | B43 | DOY SOAP 75G | <code>டாய் சோப் 75g</code> | No specific correction proposed |
| 352 | B44 | JEEVA SOAP 75G | <code>ஜீவா சோப் 75g</code> | No specific correction proposed |
| 353 | B45 | AYUSH SOAP 75G | <code>ஆயுஸ்சோப் 75g</code> | Proposed correction |
| 354 | B46 | SAVLAN 75G | <code>சேவ்லான் 75g</code> | No specific correction proposed |
| 355 | B48 | THULASI SOAP 75G | <code>துளசிசோப் 75g</code> | No specific correction proposed |
| 356 | B49 | FA SOAP 75G | <code>ஃபா சோப் 75g</code> | No specific correction proposed |
| 357 | B50 | PARK AVENYU 150G | <code>பார்க் அவென்யூ 150g</code> | No specific correction proposed |
| 358 | B51 | FAIR GLOW SOAP 75G | <code>பேர்க்ளோ சோப் 75g</code> | No specific correction proposed |
| 359 | B47 | SAVLON 150G | <code>சேவ்லான் 150g</code> | No specific correction proposed |
| 360 | B52 | NIVEA SOAP 75G | <code>நிவ்யா சோப் 75g</code> | No specific correction proposed |
| 361 | B53 | M/S 3IN1 | <code>M/S 3in1</code> | Owner confirmation |
| 362 | B54 | NA.POWER SANDEL | <code>பவர்சேண்டல்</code> | No specific correction proposed |
| 363 | B55 | POWERLIME | <code>பவர்லைம்</code> | No specific correction proposed |
| 364 | B56 | POWERLAVENDER | <code>பவர்லவண்டர்</code> | No specific correction proposed |
| 365 | 102 | TURMERIC POWDER 100G | <code>மஞ்.தூள் 100g</code> | No specific correction proposed |
| 366 | 103 | SAMBAR POWDER 50G | <code>சாம்பார்தூள் 50g</code> | No specific correction proposed |
| 367 | 104 | SAMBAR POWDER 100G | <code>சாம்பார்தூள் 100g</code> | No specific correction proposed |
| 368 | 105 | CHILLY POWDER 50G | <code>மிளகாய்தூள் 50g</code> | No specific correction proposed |
| 369 | 106 | CHILLY POWDER 100G | <code>மிளகாய்தூள் 100g</code> | No specific correction proposed |
| 370 | 107 | RASA POWDER 50G | <code>ரசப்பொடி 50g</code> | No specific correction proposed |
| 371 | 108 | RASAM POWDER 100G | <code>ரசப்பொடி 100g</code> | No specific correction proposed |
| 372 | 109 | CORIANDER POWDER 50G | <code>மல்லித்தூள் 50g</code> | No specific correction proposed |
| 373 | 110 | CORIANDER POWDER 100G | <code>மல்லித்தூள் 100g</code> | No specific correction proposed |
| 374 | 111 | CURRY MASALA 50G | <code>கறிமசால் 50g</code> | No specific correction proposed |
| 375 | 112 | GUNDUUS500GM | <code>குண்டூஸ்மசால்500gm</code> | No specific correction proposed |
| 376 | 113 | IDLY POWDER 50G | <code>இட்லிப்பொடி 50g</code> | No specific correction proposed |
| 377 | 114 | GUNDUS MASAL200GM | <code>குண்டூஸ் மசால்200gm</code> | No specific correction proposed |
| 378 | 115. | AACHIKULAMBU100GM | <code>ஆச்சிகுழம்பு100gm</code> | No specific correction proposed |
| 379 | 116 | AACHIKULAMBU50GM | <code>ஆச்சிகுழம்பு தூள் 50gm</code> | No specific correction proposed |
| 380 | 117 | CHIKKAN MASALA 50G | <code>சிக்கன் மசால் 50g</code> | No specific correction proposed |
| 381 | 118 | CHIKKAN MASALA 100G | <code>சிக்கன் மசால் 100g</code> | No specific correction proposed |
| 382 | 119 | MUTTON MSASALA 50G | <code>மட்டன் மசாலா 50g</code> | No specific correction proposed |
| 383 | 120 | MUTTON MASALA 100G | <code>மட்டன் மசாலா 100g</code> | No specific correction proposed |
| 384 | 121 | BRIYANI MASALA 50G | <code>பிரியாணி மசாலா 50g</code> | No specific correction proposed |
| 385 | 122 | CHILLY GOPI 50GM JB | <code>சில்லிகோபி50gm JB</code> | No specific correction proposed |
| 386 | 123 | CHI.CHICKEN 50G | <code>சி.சிக்கன் 50g</code> | No specific correction proposed |
| 387 | 124 | CHI.CHIKKAN 100G | <code>சி.சிக்கன் 100g</code> | No specific correction proposed |
| 388 | 125 | GARAM MASALA 50G | <code>கரம் மசாலா 50g</code> | No specific correction proposed |
| 389 | 126 | GARAM MASALA 100G | <code>கரம் மசாலா 100g</code> | No specific correction proposed |
| 390 | 127 | FISH FRY 50G | <code>மீன்வருவல் 50g</code> | No specific correction proposed |
| 391 | 128 | FISH KULAMPU50GM | <code>மீன்குழம்பு50gm</code> | No specific correction proposed |
| 392 | 129 | EGG KURUMA 50G | <code>முட்டைகுருமா 50g</code> | No specific correction proposed |
| 393 | 130 | BIRIYANI PASTE | <code>பிரியாணி பேஸ்ட்</code> | No specific correction proposed |
| 394 | 131 | VATHAKULAMBU 50G | <code>வத்தல்புளிக்குழம்பு 50g</code> | No specific correction proposed |
| 395 | 132 | FRIDERICEMASALA PKT | <code>பிரைடுரைஸ்மசால்</code> | No specific correction proposed |
| 396 | 133 | LEMON SATHAMIX 50G | <code>லெமன் சாத மிக்ஸ் 50g</code> | No specific correction proposed |
| 397 | 134 | LEMON SATHA MIX 100G | <code>லெமன் சாத மிக்ஸ் 100g</code> | No specific correction proposed |
| 398 | 135 | SUKKUMALLICOFFEE50G | <code>சுக்குமல்லிகாபி 50g</code> | No specific correction proposed |
| 399 | 136 | SUKKUMALLICOFFEE 100G | <code>சுக்குமல்லிகாபி 100g</code> | No specific correction proposed |
| 400 | 137 | CHANNAMASALA 100G | <code>சன்னாமசாலா 100g</code> | No specific correction proposed |
| 401 | 138 | PULIYOTHARAI MIX 50G | <code>புளியோதரைபொடி 50g</code> | No specific correction proposed |
| 402 | 139 | PULIYOTHARAI MIX 100G | <code>புளியோதரைபொடி 100g</code> | No specific correction proposed |
| 403 | 140 | CUMMIN POWDER 50G | <code>சீரகப்பொடி 50g</code> | No specific correction proposed |
| 404 | 141 | CUMMIN POWDER 100G | <code>சீரகப்பொடி 100g</code> | No specific correction proposed |
| 405 | 142 | TOMATORICEPOWER50GM | <code>தக்காளிசாதபவுடர்50gm</code> | No specific correction proposed |
| 406 | 143 | GARLIC POWDER 100G | <code>பூண்டுப்பொடி 100g</code> | No specific correction proposed |
| 407 | 144 | DHAL POWDER 100G | <code>பருப்புப்பொடி 100g</code> | No specific correction proposed |
| 408 | 145 | WHITEPEPPER | <code>வெ.மிளகுபொடி</code> | No specific correction proposed |
| 409 | 470 | KASTHR.TURM.POW.100G | <code>கஸ்தூரி.மஞ்.தூள் 100g</code> | No specific correction proposed |
| 410 | 147 | TURMERIC POWDER 1KG | <code>மஞ்.தூள்</code> | No specific correction proposed |
| 411 | 148 | CHILLY POWDER 1KG | <code>மிளகாய்தூள்</code> | No specific correction proposed |
| 412 | 149 | CORIANDER POWDER 1KG | <code>மல்லித்தூள்</code> | No specific correction proposed |
| 413 | 150 | SAMBAR POWDER | <code>சாம்பார் தூள்</code> | No specific correction proposed |
| 414 | 151 | CHILLY POWDER | <code>மிளகாய்தூள்</code> | No specific correction proposed |
| 415 | 152 | CORIANDER | <code>மல்லித்தூள்</code> | No specific correction proposed |
| 416 | 153 | SAMBAR | <code>சாம்பார் தூள்</code> | No specific correction proposed |
| 417 | T01 | 3ROSES 50G | <code>3ரோஷஸ் 50g</code> | No specific correction proposed |
| 418 | T02 | 3ROSES 100G | <code>3ரோஷஸ் 100g</code> | No specific correction proposed |
| 419 | T03 | 3ROSES 250G | <code>3ரோஷஸ் 250g</code> | No specific correction proposed |
| 420 | T04 | 3ROSES 500G | <code>3ரோஷஸ் 500g</code> | No specific correction proposed |
| 421 | T05 | 3ROSES(HOT)500GM | <code>3ரோஷஸ்(HOT)500GM</code> | No specific correction proposed |
| 422 | T06 | RED LABLE 250G | <code>ரெட்லேபிள் 250g</code> | No specific correction proposed |
| 423 | T07 | GREENLABLE 100G | <code>கிரீன்லேபிள் 100g</code> | No specific correction proposed |
| 424 | T08 | GREENLABLE 200G | <code>கிரீன்லேபிள் 200g</code> | No specific correction proposed |
| 425 | T09 | GREENLABLE 500G | <code>கிரீன்லேபிள் 500g</code> | No specific correction proposed |
| 426 | T10 | CHAKRAGOLD 100G | <code>சக்கராகோல்டு 100g</code> | No specific correction proposed |
| 427 | T12 | CHAKKARA GOLD 250G | <code>சக்கராகோல்டு 250g</code> | No specific correction proposed |
| 428 | T14 | GREENTEA100GM | <code>கிரீண்டீ100gm</code> | No specific correction proposed |
| 429 | T11 | KANNAVARITEA250GM | <code>கண்ணவரைடீ250gm</code> | Owner confirmation |
| 430 | T13 | NARASU^SINSTEND 50GM | <code>நரசூஸ் இண்ஸ்டன் 50gm</code> | No specific correction proposed |
| 431 | T15 | SUNRISE 15G | <code>சன்ரைஸ்  15g</code> | No specific correction proposed |
| 432 | T16 | SUNRISE 50G | <code>சன்ரைஸ்  50g</code> | No specific correction proposed |
| 433 | T17 | SUNRISE 200G | <code>சன்ரைஸ்  200g</code> | No specific correction proposed |
| 434 | T18 | SUNRISE (RS.5) | <code>சன்ரைஸ்(ரூ.5)</code> | No specific correction proposed |
| 435 | T19 | SUNRICE (RS.2) | <code>சன்ரைஸ் (ரூ.2) sac</code> | No specific correction proposed |
| 436 | T20 | A.V.T 100G | <code>A.V.T.100g</code> | Owner confirmation |
| 437 | T21 | A.V.T 250G | <code>A.V.T250g</code> | Owner confirmation |
| 438 | T23 | A.V.T500G | <code>A.V.T 500g</code> | Owner confirmation |
| 439 | T24 | A.V.T 1KG | <code>A.V.T1KG</code> | Owner confirmation |
| 440 | T25 | BRU 50GM JAR | <code>ப்ரூ 50gm ஜார்</code> | No specific correction proposed |
| 441 | T26 | BRU RS.3 SAC | <code>ப்ரூ (3ரூ)sac</code> | No specific correction proposed |
| 442 | T27 | BRU 3RS | <code>ப்ரூ (ரூ3)</code> | No specific correction proposed |
| 443 | T28 | BRU (RS.2)SAC | <code>ப்ரூ (ரூ.2) sac</code> | No specific correction proposed |
| 444 | T29 | BRU 15G | <code>ப்ரூ 15g</code> | No specific correction proposed |
| 445 | T30 | BRU 50G | <code>ப்ரூ 50g</code> | No specific correction proposed |
| 446 | T31 | BRU 100G | <code>ப்ரூ 100g</code> | No specific correction proposed |
| 447 | T32 | BRU 200G | <code>ப்ரூ 200g</code> | No specific correction proposed |
| 448 | T33 | BRU (RS.5) | <code>ப்ரூ (ரூ.5)</code> | No specific correction proposed |
| 449 | T34 | NARASUS 50G | <code>நரசூஸ் 50g</code> | No specific correction proposed |
| 450 | T35 | NARASUS 100G | <code>நரசூஸ் 100g</code> | No specific correction proposed |
| 451 | T36 | NARASUS UDAYAM 100G | <code>நரசூஸ்உதயம் 100g</code> | No specific correction proposed |
| 452 | T37 | KANNAN COFFEE 50G | <code>கண்ணன்காபி 50g</code> | No specific correction proposed |
| 453 | T38 | KANNAN COFFEE 100G | <code>கண்ணன்காபி 100g</code> | No specific correction proposed |
| 454 | T39 | TAJMAHAL 100G | <code>தாஜ்மஸால் 100g</code> | Proposed correction |
| 455 | T40 | TAJMAHAL 250G | <code>தாஜ்மஸால் 250g</code> | Proposed correction |
| 456 | T41 | KANNAN DEAVAN 250GM | <code>கண்ணன் தேவன்250gm</code> | No specific correction proposed |
| 457 | T42 | NOBLE HOUSE 250G | <code>நோபல்ஸவுஸ்டீ 250g</code> | No specific correction proposed |
| 458 | T43 | COFFEEDAY 500G | <code>காஃபிடே 500g</code> | No specific correction proposed |
| 459 | T44 | NESCAFE CLASSIC 50G | <code>நெஸ்காஃபி  50g</code> | No specific correction proposed |
| 460 | T45 | COFFEE DAY 100G | <code>காஃபிடே 100g</code> | No specific correction proposed |
| 461 | T46 | COFFEEDAY 200G | <code>காஃபிடே 200g</code> | No specific correction proposed |
| 462 | T47 | ASSAM 100G | <code>அஸ்ஷாம் 100g</code> | Proposed correction |
| 463 | T48 | ASSAM 250G | <code>அஸ்ஷாம் 250g</code> | Proposed correction |
| 464 | T49 | TETLAY TEA 250G | <code>டெட்லேடீ 250g</code> | No specific correction proposed |
| 465 | 201 | SEMIYA 200G | <code>சேமியா 200g</code> | No specific correction proposed |
| 466 | 202 | NOODLES 1KG | <code>நூடுல்ஸ் 1KG</code> | No specific correction proposed |
| 467 | 203 | KAMBU SEMIYA 200G | <code>கம்பு சேமியா 200g</code> | No specific correction proposed |
| 468 | 204 | RAGI SEMIYA 200G | <code>ராகி சேமியா 200g</code> | No specific correction proposed |
| 469 | 205 | WHEAT SEMIYA 200G | <code>கோதுமை சேமியா 200g</code> | No specific correction proposed |
| 470 | 206 | TOMATTO SEMIYA 200G | <code>தக்காளி சேமியா 200g</code> | No specific correction proposed |
| 471 | 207 | NOODELSMASAL | <code>நூடுல்ஸ்மசால்</code> | No specific correction proposed |
| 472 | 208 | NOODLES | <code>நூடில்ஸ்  சாதா</code> | No specific correction proposed |
| 473 | 209 | MAGGI 420G | <code>மேகி 420g</code> | No specific correction proposed |
| 474 | 210 | MAGGI 70G | <code>மேகி 70g</code> | No specific correction proposed |
| 475 | 211 | MAGGI 140G | <code>மேகி 140g</code> | No specific correction proposed |
| 476 | 212 | MAGGI 280G | <code>மேகி 280g</code> | No specific correction proposed |
| 477 | 213 | YIPPEE  100GM | <code>இப்பி நூடுல்ஸ் 100GM</code> | No specific correction proposed |
| 478 | 214 | MAGGI   6  PACK | <code>மேகி 600GM</code> | No specific correction proposed |
| 479 | 215 | TOPRAMEN MASALA | <code>டாப்ராமன்மசாலா</code> | No specific correction proposed |
| 480 | 216 | PASTA | <code>பாஸ்த்தா</code> | No specific correction proposed |
| 481 | 217 | YIPPEE  400GM | <code>இப்பி நூடுல்ஸ் 400gm</code> | No specific correction proposed |
| 482 | 218 | MACARONI 100G | <code>மக்குரினி 100g</code> | No specific correction proposed |
| 483 | 219 | BAMBINO SEMIYA 1KG | <code>பாமினோசேமியா 1kg</code> | No specific correction proposed |
| 484 | 220 | BAMBINO SEMIA 450GM | <code>பாமினோசேமியா 500g</code> | Owner confirmation |
| 485 | 221 | BAMBINOSEMIYA 200G | <code>பாமினோசேமியா 200g</code> | No specific correction proposed |
| 486 | 222 | ADAPRADHAMAM | <code>அடப்பிரதம்</code> | Owner confirmation |
| 487 | 223 | IDIYAPPAM | <code>இடியாப்பம்</code> | No specific correction proposed |
| 488 | 224 | PILLSBURYSEMIYA 1KG | <code>பில்ஸ்.சேமியா 1kg</code> | No specific correction proposed |
| 489 | 225 | PILLSBURYSEMIYA 500G | <code>பில்ஸ்.சேமியா 500g</code> | No specific correction proposed |
| 490 | 226 | PILLSBURYSEMIYA200G | <code>பில்ஸ்.சேமியா 200g</code> | No specific correction proposed |
| 491 | 227 | MTR.SEMIYA 1KG | <code>MTR சேமியா 1kg</code> | No specific correction proposed |
| 492 | 229 | MTR.SEMIYA 200G | <code>MTR சேமியா 200g</code> | No specific correction proposed |
| 493 | 230 | SAVARATSEMIYA 1KG | <code>சேவ்ரெட்சேமியா 1kg</code> | No specific correction proposed |
| 494 | 231 | SAVARETSEMIYA 500G | <code>சேவ்ரெட்சேமியா 500g</code> | No specific correction proposed |
| 495 | 232 | SAVARETSEMIYA 200G | <code>சேவ்ரெட்சேமியா 200g</code> | No specific correction proposed |
| 496 | 228 | MTR SEMIYA 500G | <code>MTRசேமியா500g</code> | No specific correction proposed |
| 497 | 301 | COLGATE 50G | <code>கோல்கேட் 38g</code> | Owner confirmation |
| 498 | 302 | COLGATE 100G | <code>கோல்கேட் 100g</code> | No specific correction proposed |
| 499 | 303 | COLGATE VETH.SKTI100GM | <code>கோல்.வேதசத்தி100gm</code> | No specific correction proposed |
| 500 | 304 | COLGATE 200G | <code>கோல்கேட் 200g</code> | No specific correction proposed |
| 501 | 305 | COLGATE 300G | <code>கோல்கேட் 300g</code> | No specific correction proposed |
| 502 | 306 | PEPSODENT 50G | <code>பெப்சோடென்ட் 50g</code> | No specific correction proposed |
| 503 | 307 | PEPSODENT 80G | <code>பெப்சோடென்ட் 80g</code> | No specific correction proposed |
| 504 | 308 | PEPSODENT 175G | <code>பெப்சோடென்ட் 200g</code> | Owner confirmation |
| 505 | 309 | PEPSODENT G 80G | <code>பெப்சோடென்ட் G 80g</code> | No specific correction proposed |
| 506 | 310 | PEP.G 140GM | <code>பெப்.G 140GM</code> | No specific correction proposed |
| 507 | 311 | PEPSODENT 2IN1 100G | <code>பெப்சோடென்ட் 2in1 100g</code> | No specific correction proposed |
| 508 | 312 | PEPSODENT 2IN1 150G | <code>பெப்சோடென்ட் 2in1 150g</code> | No specific correction proposed |
| 509 | 313 | CLOSEUP 40G | <code>குளோசப்  40g</code> | No specific correction proposed |
| 510 | 314 | CLOSEUP 80G | <code>குளோசப்  80g</code> | No specific correction proposed |
| 511 | 315 | CLOSEUP 150G | <code>குளோசப்  150g</code> | No specific correction proposed |
| 512 | 316 | AYUSH PASTE | <code>ஆயூஸ்பேஸ்ட்</code> | Proposed correction |
| 513 | 317 | COLCATEVEATH.50GM | <code>கோல்.வேதசத்தி50gm</code> | No specific correction proposed |
| 514 | 318 | COL.VEATH.SATHI.200GM | <code>கோல்கேட்வேதசத்தி200gm</code> | No specific correction proposed |
| 515 | 319 | COLGATE GEL 80G | <code>கோல்கேட் ஜெல் 80g</code> | No specific correction proposed |
| 516 | 320 | COLGATEGEL 150G | <code>கோல்கேட்ஜெல்  150g</code> | No specific correction proposed |
| 517 | 321 | J.M.TOURTHPOWER | <code>J.M.பல்பொடி</code> | No specific correction proposed |
| 518 | 322 | COLGATE HERBAL 100G | <code>கோல்கேட்ஸெர்பல் 100g</code> | Proposed correction |
| 519 | 323 | COLGATE HERBAL 200G | <code>கோல்கேட்ஸெர்பல் 200g</code> | Proposed correction |
| 520 | 324 | COLGATE TOTAL 75G | <code>கோல்கேட்டோட்டல் 75g</code> | No specific correction proposed |
| 521 | 325 | COLGATETOTAL 150G | <code>கோல்கேட்டோட்டல் 150g</code> | No specific correction proposed |
| 522 | 326 | SENSODYNE 40GM | <code>சென்சோடைன் 40gm</code> | No specific correction proposed |
| 523 | 327 | CIBACA 200G | <code>சிபாகா 200g</code> | No specific correction proposed |
| 524 | 328 | MESWAKE 100G | <code>மிஸ்வாக் 100g</code> | No specific correction proposed |
| 525 | 329 | K.P.NAMBOODIRI 100GM | <code>கே.பி.நம்பூதிரிஸ் 100gm</code> | No specific correction proposed |
| 526 | 330 | K.P.NAMBOODIRI 50GM | <code>கே.பி.நம்பூதிரி 50gm</code> | No specific correction proposed |
| 527 | 331 | COL.BURES | <code>கோல்.பிரஸ்</code> | Proposed correction |
| 528 | 332 | COLGATE BURES | <code>கோல்கேட் பிரஸ்</code> | Proposed correction |
| 529 | 333 | PROMISE 200G | <code>ப்ராமிஸ் 200g</code> | No specific correction proposed |
| 530 | 334 | EMOFORM 100G | <code>எமோஃபார்ம் 100g</code> | No specific correction proposed |
| 531 | 335 | COLGATE WHITE 75G | <code>கோல்கேட் ஒயிட்னிங் 75g</code> | No specific correction proposed |
| 532 | 336 | COLGATE WHITE 150G | <code>கோல்கேட் ஒயிட்னிங் 150g</code> | No specific correction proposed |
| 533 | 337 | PEPSODENTWHITE 100G | <code>பெப்ஷொ.ஒயிட்னிங் 100g</code> | No specific correction proposed |
| 534 | 338 | PEPSODENTWHITE 200G | <code>பெப்ஷொ.ஒயிட்னிங் 200g</code> | No specific correction proposed |
| 535 | 364 | HIMALAYA 100G | <code>ஸிமாலயாபேஸ்ட் 100g</code> | Proposed correction |
| 536 | 340 | DOBUR HERBALPASTE 50G | <code>டாபர்ஸெர்பல்பேஸ்ட் 50g</code> | Proposed correction |
| 537 | 341 | VICCOPASTE 50G | <code>விக்கோபேஸ்ட் 50g</code> | No specific correction proposed |
| 538 | 342 | VICCOPASTE 100G | <code>விக்கோபேஸ்ட் 100g</code> | No specific correction proposed |
| 539 | 343 | VICCOPOWDER25GM | <code>விக்கோபவுடர்25gm</code> | No specific correction proposed |
| 540 | 344 | VICCOPOWDER 50G | <code>விக்கோபவுடர் 50g</code> | No specific correction proposed |
| 541 | 345 | VICCOPOWDER 100G | <code>விக்கோபவுடர் 100g</code> | No specific correction proposed |
| 542 | 346 | COLGATEPOWDER 50G | <code>கோல்கெட்பவுடர் 50g</code> | No specific correction proposed |
| 543 | 347 | COLGATE POWDER 100G | <code>கோல்கெட்பவுடர் 100g</code> | No specific correction proposed |
| 544 | 348 | COLGATE POWDER 200G | <code>கோல்கெட்பவுடர் 200g</code> | No specific correction proposed |
| 545 | 349 | PYORIYA POWDER 60G | <code>பயோரியா பல்பொடி 60g</code> | No specific correction proposed |
| 546 | 350 | K.P.NAMB.POWDER 80GM | <code>கே.பி.நம்பூ.பவுடர் 80gm</code> | No specific correction proposed |
| 547 | 351 | K.P.NAMB.POWDER 40GM | <code>கே.பி.நம்பூதிரி பவுட்ர்40gm</code> | No specific correction proposed |
| 548 | 352 | NEEM PASTE 100G | <code>நீம்பேஸ்ட் 100g</code> | No specific correction proposed |
| 549 | 353 | NEEM PASTE 250G | <code>நீம்பேஸ்ட் 250g</code> | No specific correction proposed |
| 550 | 354 | BRUSH | <code>பிரக்ஷ</code> | Proposed correction |
| 551 | 355 | TOUGH CLEANER | <code>டங்கிளீனர்</code> | No specific correction proposed |
| 552 | 356 | PASTEOFFER | <code>பேஸ்ட் OFFER</code> | No specific correction proposed |
| 553 | 357 | GOBAL POWDER | <code>கோபால்பல்பொடி</code> | No specific correction proposed |
| 554 | 401 | VELLAM ROUND | <code>உ.வெல்லம்</code> | No specific correction proposed |
| 555 | 402 | ACHU VELLAM | <code>அச்சுவெல்லம்</code> | No specific correction proposed |
| 556 | 403 | PANAVELLAM | <code>ப.கருப்பட்டி</code> | No specific correction proposed |
| 557 | 404 | THENNAI VELLAM | <code>தெ.கருப்பட்டி</code> | No specific correction proposed |
| 558 | 405 | SUGARCANCANDY | <code>க.சக்கரை</code> | No specific correction proposed |
| 559 | 406 | KALKANDU | <code>கற்கண்டு(B)</code> | No specific correction proposed |
| 560 | 407 | P.KALKANDU | <code>ப.கற்கண்டு</code> | No specific correction proposed |
| 561 | 408 | DIAMOND | <code>டைமண்ட்</code> | No specific correction proposed |
| 562 | 409 | VETTU.NUTS | <code>வெட்டுபாக்கு</code> | No specific correction proposed |
| 563 | 410 | CHALAKUDI NUTS | <code>சாலகுடிபாக்கு</code> | No specific correction proposed |
| 564 | 411 | ROJA SUPARI(SMALL) | <code>ரோஜாபாக்கு(small)</code> | No specific correction proposed |
| 565 | 412 | KUNKUMAM | <code>குங்குமம்</code> | No specific correction proposed |
| 566 | 413 | SUGANDA KUNKUMAM | <code>சுகந்தாகுங்குமம்</code> | No specific correction proposed |
| 567 | 414 | SANDAL POWDER | <code>சந்தனபவுடர்</code> | No specific correction proposed |
| 568 | 415 | SANDAL TABLETS | <code>சந்தனவில்லை</code> | No specific correction proposed |
| 569 | 416 | VIBOOTHI PKT | <code>விபூதி</code> | No specific correction proposed |
| 570 | 417 | AGARPATHI | <code>ஊதுபத்தி(ரூ.18)</code> | No specific correction proposed |
| 571 | 418 | MATCH BOX | <code>பூனைதீப்பெட்டி</code> | No specific correction proposed |
| 572 | 419 | AGAR PATHI | <code>ஊதுபத்தி ரூ.10</code> | No specific correction proposed |
| 573 | 420 | PA.KARPURAM | <code>பச்ச கற்பூரம்</code> | No specific correction proposed |
| 574 | 421 | POWERSAMPRANI | <code>பொடிசாம்ரானி</code> | Proposed correction |
| 575 | 422 | NO2KARPURAM | <code>NO2.கற்பூரம்</code> | No specific correction proposed |
| 576 | 423 | NO3.KARPURAM | <code>NO3.கற்பூரம்</code> | No specific correction proposed |
| 577 | 424 | NO10.KARPURAM | <code>NO10.கற்பூரம்</code> | No specific correction proposed |
| 578 | 425 | MAGAGURU SAMBARANI | <code>மகாகுருசாம்பிராணி</code> | No specific correction proposed |
| 579 | 426 | KATTISAMBARANI | <code>கட்டிசாம்பிராணி</code> | No specific correction proposed |
| 580 | 427 | THONNAI | <code>தொன்னை</code> | No specific correction proposed |
| 581 | 428 | CANDLE | <code>மெழுகுவர்த்தி</code> | No specific correction proposed |
| 582 | 429 | PANNERBOTTIE | <code>பன்னீர்பாட்டில்(SMALL)</code> | No specific correction proposed |
| 583 | 430 | TEA TUMBLER PCS | <code>டீ.டம்ளர் pcs</code> | No specific correction proposed |
| 584 | 431 | WATER TUMBLER PCS | <code>தண்ணீர்டம்ளர் pcs</code> | No specific correction proposed |
| 585 | 432 | PAYASATUMBLER 100PCS | <code>பாயாசடம்ளர் 100pcs</code> | No specific correction proposed |
| 586 | 433 | THEARD BUNDLE | <code>நூல்கண்டு</code> | No specific correction proposed |
| 587 | 434 | THERI | <code>திரி</code> | No specific correction proposed |
| 588 | 435 | JAVVATHU | <code>ஜவ்வாது</code> | No specific correction proposed |
| 589 | 436 | 3IN1CYCKLE(B) | <code>3in1 சைக்கில்(பெ)</code> | No specific correction proposed |
| 590 | 437 | 3IN1CYCKLE(S) | <code>3in1சைக்கில்(சி)</code> | No specific correction proposed |
| 591 | 438 | NANDHI-B | <code>நந்தி[]</code> | No specific correction proposed |
| 592 | 439 | POREI | <code>பொரி</code> | No specific correction proposed |
| 593 | 440 | GULISTHAN-B | <code>குலிஸ்தான்-B</code> | No specific correction proposed |
| 594 | 441 | GULISTAN S | <code>குலிஸ்தான்-S</code> | No specific correction proposed |
| 595 | 442 | MANGALDEEP(B) | <code>மங்கல்தீப்(பெ)</code> | No specific correction proposed |
| 596 | 443 | LIEYA | <code>லீயா</code> | No specific correction proposed |
| 597 | 444 | PINAPPLE(B) | <code>பைனாப்பிள்பத்தி</code> | No specific correction proposed |
| 598 | 445 | FORESTPATTI | <code>FORESTபத்தி</code> | No specific correction proposed |
| 599 | 446 | Z BLACK | <code>Z பிலாக்</code> | No specific correction proposed |
| 600 | 447 | MY FAVOURITE | <code>மைஃபேவரெட்</code> | No specific correction proposed |
| 601 | 448 | LYRICS | <code>லிரிக்ஸ்</code> | No specific correction proposed |
| 602 | 449 | NINDHI MIST | <code>நந்திமிஸ்ட்</code> | No specific correction proposed |
| 603 | 450 | WATER TUM ATTAI | <code>தண்ணீர்டம்ளர் அட்டை</code> | No specific correction proposed |
| 604 | 451 | TEA CUP ATTAI | <code>டீடம்ளர் அட்டை</code> | No specific correction proposed |
| 605 | 452 | LIA | <code>லியாபத்தி</code> | No specific correction proposed |
| 606 | 453 | VIRALI MANJAL | <code>விரலிமஞ்சள்</code> | No specific correction proposed |
| 607 | 454 | GUNDUMANJAL | <code>குண்டுமஞ்சள்</code> | No specific correction proposed |
| 608 | 455 | KASTHURI MANJAL | <code>கஸ்தூரிமஞ்சள்(டப்பா)</code> | No specific correction proposed |
| 609 | 456 | KOPURAM PUSU MANJAL | <code>கோ.மஞ்.தூள்</code> | No specific correction proposed |
| 610 | 457 | FOODCOLOUR | <code>கலர்</code> | No specific correction proposed |
| 611 | 458 | NAVATHANIYAM | <code>நவதானியம்</code> | No specific correction proposed |
| 612 | 459 | KASTHUURIMAJIEL | <code>கஸ்தூரிமஞ்சள்(பாக்கட்)</code> | No specific correction proposed |
| 613 | 460 | RASIKALAL 50G | <code>ரசிகலால் 50g</code> | No specific correction proposed |
| 614 | 461 | SUNNAMPU | <code>சுண்ணாம்பு</code> | No specific correction proposed |
| 615 | 462 | P.KARPURAM | <code>ப.கற்பூரம்</code> | No specific correction proposed |
| 616 | 463 | KURINJIPOO | <code>குறிஞ்சிப்பூ</code> | No specific correction proposed |
| 617 | 464 | NELLU | <code>நெல்</code> | No specific correction proposed |
| 618 | 465 | K.THENGA 1KG | <code>கொ.தேங்காய் 1kg</code> | No specific correction proposed |
| 619 | 466 | THIRUMANJAN 50GMS | <code>திரு.மஞ்சள் 50g</code> | No specific correction proposed |
| 620 | 467 | THUL NUTS | <code>தூள்பாக்கு</code> | No specific correction proposed |
| 621 | 468 | HOMELITE | <code>ஸோம்லைட்</code> | Proposed correction |
| 622 | 501 | GHEE 50G | <code>நெய்  50g</code> | No specific correction proposed |
| 623 | 502 | GHEE UTHYAKR. 100G | <code>உதயகிருக்ஷணா100g</code> | Proposed correction |
| 624 | 503 | UDHAYAKRIS. 200G | <code>உதயகிருக்ஷணா200g</code> | Proposed correction |
| 625 | 504 | UTHAYAKRIS.500G | <code>உதயகிருக்ஷணா500g</code> | Proposed correction |
| 626 | 505 | GHEE 1KG | <code>நெய்  1kg</code> | No specific correction proposed |
| 627 | 506 | AYYAPPA 1L | <code>ஜய்யப்பா 1லி</code> | No specific correction proposed |
| 628 | 507 | AYYAPPA GHEE 100G | <code>ஐயப்பா நெய் 100g</code> | No specific correction proposed |
| 629 | 508 | AYYAPPA GHEE 200GM | <code>ஐயப்பா நெய் 200</code> | No specific correction proposed |
| 630 | 509 | EGG BOX | <code>முட்டை அட்டை</code> | No specific correction proposed |
| 631 | 510 | EGG | <code>முட்டை</code> | No specific correction proposed |
| 632 | 511 | AMULYA 200G | <code>அமுல்யா 200g</code> | No specific correction proposed |
| 633 | 512 | AMULYA 500G | <code>அமுல்யா 500g</code> | No specific correction proposed |
| 634 | 513 | AMULSPRAY 200G | <code>அமுல்ஸ்ப்ரே 200g</code> | No specific correction proposed |
| 635 | 514 | AMULSPRAY 500G | <code>அமுல்ஸ்ப்ரே 500g</code> | No specific correction proposed |
| 636 | 515 | AMULSPRAY(TIN)500G | <code>அமுல்ஸ்ப்ரே(டின்)500g</code> | No specific correction proposed |
| 637 | 517 | SAATTUKUDI | <code>சாத்துகுடி</code> | No specific correction proposed |
| 638 | 518 | MILKMAID 400G | <code>மில்க்மைடு 400g</code> | No specific correction proposed |
| 639 | 519 | DELITE 250G | <code>டிலைட் 250g</code> | No specific correction proposed |
| 640 | 520 | S.E.GOVA | <code>ச.இ.கோவா</code> | No specific correction proposed |
| 641 | 656 | NUTRAMUL 500G | <code>நியூட்ரமுல் 500g</code> | No specific correction proposed |
| 642 | 521 | MILKPANNEER | <code>மில்க்பன்னீர்</code> | No specific correction proposed |
| 643 | 522 | MILKCREAM | <code>மில்க்கிரீம்</code> | No specific correction proposed |
| 644 | 523 | RUSK POWDER | <code>ரஸ்க்பவுடர்</code> | No specific correction proposed |
| 645 | 524 | PUREGHEE | <code>தெளிவுநெய்</code> | No specific correction proposed |
| 646 | 601 | HORLICKS.500(R) | <code>ஸார்லிக்ஸ் 500(R)</code> | Proposed correction |
| 647 | 602 | HORLICKS.500(BOT) | <code>ஸார்லிக்ஸ் 500g(BOT)</code> | Proposed correction |
| 648 | 603 | HORLICKS1KG(R) | <code>ஸார்லிக்ஸ் 1KG (R)</code> | Proposed correction |
| 649 | 604 | HOR.CHO.500(R) | <code>ஸார்.சாக்.500(R)</code> | Proposed correction |
| 650 | 605 | HOR.200GM(PAKET) | <code>ஸார்.200gm(பாக்கட்)</code> | Proposed correction |
| 651 | 606 | HORLICKS1KG(BOT) | <code>ஸார்1 KG(BOT)</code> | Proposed correction |
| 652 | 607 | HOR.(100GM)PKT | <code>ஸார்.(100gm)பாக்கட்</code> | Proposed correction |
| 653 | 608 | HOR.JUNIOR.500(R) | <code>ஸார்.JUNIOR.500 (R)</code> | Proposed correction |
| 654 | 609 | HOR.JUNIOR.500(BOT) | <code>ஸார்.JUNIOR.500(BOT)</code> | Proposed correction |
| 655 | 610 | BOOST 500G(R) | <code>பூஸ்ட் 500g(R)</code> | No specific correction proposed |
| 656 | 611 | BOOST 500G(BOT) | <code>பூஸ்ட் 500g(BOT)</code> | No specific correction proposed |
| 657 | 612 | BOOST 200G(R) | <code>பூஸ்ட் 200g(R)</code> | No specific correction proposed |
| 658 | 613 | BOOST 200G(BOT) | <code>பூஸ்ட் 200g(BOT)</code> | No specific correction proposed |
| 659 | 614 | BOOST(75GM) | <code>பூஸ்ட்(75gm)</code> | No specific correction proposed |
| 660 | 615 | COMPLAN CHO 500G(R) | <code>காம்ப்ளான் cho 500g(R)</code> | No specific correction proposed |
| 661 | 616 | COMPLAN 500G(BOT) | <code>காம்ப்ளான் 500g(BOT)</code> | No specific correction proposed |
| 662 | 617 | COMPLAN CHO 200G(R) | <code>காம்ப்ளான் cho 200g(R)</code> | No specific correction proposed |
| 663 | 618 | COMPLAN 200G(BOT) | <code>காம்ப்ளான் 200g(BOT)</code> | No specific correction proposed |
| 664 | 619 | COMPLAN PLAIN500(R) | <code>காம்ப்ளான் சாதா 500(R)</code> | No specific correction proposed |
| 665 | 620 | PEDIA SURE 500GM | <code>பீடியாசூர் 500gm</code> | No specific correction proposed |
| 666 | 621 | COMPLAN MANGO 500(R) | <code>காம்ளான்மேங்கோ500(R)</code> | No specific correction proposed |
| 667 | 622 | COMPLAN CARAMEL 500(R) | <code>காம்ப்ளான் கேராமெல் 500(R)</code> | No specific correction proposed |
| 668 | 623 | BOURVITA 500(R) | <code>போன்விட்டா 500(R)</code> | No specific correction proposed |
| 669 | 624 | BOURNVITA 500(BOT) | <code>போன்விட்டா 500(BOT)</code> | No specific correction proposed |
| 670 | 625 | BOURNVITA 200(R) | <code>போன்விட்டா 200(R)</code> | No specific correction proposed |
| 671 | 626 | BOURNVITA 200(BOT) | <code>போன்விட்டா 200(BOT)</code> | No specific correction proposed |
| 672 | 627 | MILO 500G(R) | <code>மைலோ 500g(R)</code> | No specific correction proposed |
| 673 | 628 | MALTOVA 500G(R) | <code>மால்டோவா 500g(R)</code> | No specific correction proposed |
| 674 | 629 | VIVA 500G(R) | <code>வீவா 500g (R)</code> | No specific correction proposed |
| 675 | 630 | AMUL SAKTHI 500G(R) | <code>அமுல்சக்தி 500g(R)</code> | No specific correction proposed |
| 676 | 631 | AMUL SAKTHI 200G(R) | <code>அமுல்சக்தி 200g(R)</code> | No specific correction proposed |
| 677 | 632 | DELITE 200G | <code>டிலைட் 200g</code> | No specific correction proposed |
| 678 | 633 | OATS BAKERS | <code>ஓட்ஸ்</code> | No specific correction proposed |
| 679 | 634 | PROTIN X200G | <code>புரோட்டீன் X200g</code> | No specific correction proposed |
| 680 | 635 | GLUCOSE100G | <code>குளுகோஸ் 100g</code> | No specific correction proposed |
| 681 | 636 | GLUCOSE 200GJAR | <code>குளுகோஸ் 200g ஜார்</code> | No specific correction proposed |
| 682 | 637 | GLUCOSE 500GJAR | <code>குளுகோஸ்500gஜார்</code> | No specific correction proposed |
| 683 | 638 | GLUCON D 100G ORANGE | <code>குளுகோன்D100g ஆரஞ்</code> | No specific correction proposed |
| 684 | 639 | GLUCOSE 500G ORANGE | <code>குளுகோஸ்500gஆரஞ்</code> | No specific correction proposed |
| 685 | 640 | RAGIMALT 1KG | <code>ராகிமால்ட் 1kg</code> | No specific correction proposed |
| 686 | 641 | RAGIMALT 500G | <code>ராகிமால்ட் 500g</code> | No specific correction proposed |
| 687 | 642 | RAGIMALT200G | <code>ராகிமால்ட் 200g</code> | No specific correction proposed |
| 688 | 643 | MANNA THANIYAM 1KG | <code>மன்னாதானியம் 1kg</code> | No specific correction proposed |
| 689 | 644 | MANNA HEALTHMIX 500 | <code>மன்னாஸெல்த்மிக்ஸ் 500g</code> | Proposed correction |
| 690 | 645 | MANNA HEALTHMIX200G | <code>மன்னாஸெல்த்மிக்ஸ் 200g</code> | Proposed correction |
| 691 | 646 | MCS THANIYAM 1KG | <code>MCS தானியம் 1kg</code> | No specific correction proposed |
| 692 | 647 | MCS HEALTHMIX 500G | <code>MCS ஸெல்த்மிக்ஸ் 500g</code> | Proposed correction |
| 693 | 648 | PROTINE X 400G | <code>புரோடீன் X 400g</code> | No specific correction proposed |
| 694 | 701 | CERELAC 400G WHEAT | <code>செரிலாக் 400g வீட்</code> | No specific correction proposed |
| 695 | 702 | CERELAC 400G RICE | <code>செரிலாக்400gரைஸ்</code> | No specific correction proposed |
| 696 | 703 | CERELAC400G VEG | <code>செரிலாக்400gவெஜ்</code> | No specific correction proposed |
| 697 | 704 | CERELAC 400G APPLE | <code>செரிலாக்400gஆப்பிள்</code> | No specific correction proposed |
| 698 | 705 | CERELAC 400G ORANGE | <code>செரிலாக்400gஆரஞ்</code> | No specific correction proposed |
| 699 | 706 | CERELAC 400G HONEY | <code>செரிலாக்400gதேன்</code> | No specific correction proposed |
| 700 | 707 | CERELAC 400G DAL | <code>செரிலாக்400gதால்</code> | No specific correction proposed |
| 701 | 710 | NESTUM 400G RICE | <code>நெஸ்டம்400gரைஸ்</code> | No specific correction proposed |
| 702 | 711 | NESTUM 400G RAGI | <code>நெஸ்டம்400gராகி</code> | No specific correction proposed |
| 703 | 712 | NESTUM 400G FRUIT | <code>நெஸ்டம்400gஃப்ரூட்</code> | No specific correction proposed |
| 704 | 708 | CERELAC400G(MIXFRUITS) | <code>செரிலாக்400g(மிக்ஸ்ஃப்ரூட்)</code> | No specific correction proposed |
| 705 | 709 | CERELAC400GMIXVEG | <code>செரிலாக்400gமிக்ஸ்வெஜ்</code> | No specific correction proposed |
| 706 | 713 | NES.GROWINGUPMILK400G | <code>நெஸ்.growupமில்க்400g</code> | No specific correction proposed |
| 707 | 714 | NO1.LACTOGEN 500BOX | <code>NO1.லாக்டோஜன்500BOX</code> | No specific correction proposed |
| 708 | 715 | NO2.LACTOGEN 500 BOX | <code>NO2.லாக்டோஜன்500BOX</code> | No specific correction proposed |
| 709 | 716 | NO3.LACTOGEN500BOX | <code>NO3.லாக்டோஜன்500B0X</code> | No specific correction proposed |
| 710 | 717 | NO1.LACTOGEN500TIN | <code>NO1.லாக்டோஜன் 500TIN</code> | No specific correction proposed |
| 711 | 718 | NO2.LACTOGEN500TIN | <code>NO2.லாக்டோஜன் 500TIN</code> | No specific correction proposed |
| 712 | 719 | NO2.LACTOGEN 1KG BOX | <code>NO2.லாக்டோஜன் 1KG BOX</code> | No specific correction proposed |
| 713 | 722 | PEDIASURE 900 VEN | <code>பிடியாசூர்900வெண்</code> | No specific correction proposed |
| 714 | 723 | PEDIASURE 900 CHOC | <code>பிடியாசூர்900சாக்</code> | No specific correction proposed |
| 715 | 724 | FAREX400WHEAT | <code>ஃபேரெக்ஸ்400வீட்</code> | No specific correction proposed |
| 716 | 725 | FAREX 400 APPLE | <code>ஃபேரெக்ஸ்400g ஆப்பிள்</code> | No specific correction proposed |
| 717 | 726 | FEREX 400 VEG | <code>ஃபேரெக்ஸ்400gவெஜ்</code> | No specific correction proposed |
| 718 | 727 | FEREX 400 EGG | <code>ஃபேரெக்ஸ்400gமுட்டை</code> | No specific correction proposed |
| 719 | 728 | FEREX 400 RICE | <code>ஃபேரெக்ஸ்400gரைஸ்</code> | No specific correction proposed |
| 720 | 729 | KELLG.CHOCOS | <code>கெலாக்ஸ்சாக்கோஸ்</code> | No specific correction proposed |
| 721 | 730 | KELLG.CORNFLACKS | <code>கெலாக்ஸ்கான்Flacks</code> | No specific correction proposed |
| 722 | 731 | JJ.BABYSOAP 75G | <code>JJ.பேபிசோப் 75g</code> | No specific correction proposed |
| 723 | 732 | JJ.BABYSOAP 150G | <code>JJ.பேபிசோப் 150g</code> | No specific correction proposed |
| 724 | 733 | TEDIBAR SOP | <code>டெடிபார்சோப்</code> | No specific correction proposed |
| 725 | 734 | JJ.BABY POWDER 50G | <code>JJ.பேபிபவுடர் 50g</code> | No specific correction proposed |
| 726 | 735 | JJ.BABY POWDER 100G | <code>JJ.பேபிபவுடர் 100g</code> | No specific correction proposed |
| 727 | 736 | JJ.BABY POWDER 200G | <code>JJ.பேபிபவுடர் 200g</code> | No specific correction proposed |
| 728 | 737 | JJ.BABY POWDER 400G | <code>JJ.பேபிபவுடர் 400g</code> | No specific correction proposed |
| 729 | 740 | JJ.BABY OIL 50ML | <code>JJ.பேபிஆயில் 50ml</code> | No specific correction proposed |
| 730 | 741 | JJ.BABY OIL 100ML | <code>JJ.பேபிஆயில் 100ml</code> | No specific correction proposed |
| 731 | 742 | TADIBAR SOAP | <code>டெடிபார்சோப்</code> | No specific correction proposed |
| 732 | 738 | JJ.BABY POWDER 700G | <code>JJ.பேபிபவுடர் 700g</code> | No specific correction proposed |
| 733 | 743 | JJ.BABYOIL 50ML(PKT) | <code>JJ.பேபிஆயில் 50ml(PKT)</code> | No specific correction proposed |
| 734 | 744 | JJ.HAIR OIL 50ML | <code>பேபிஸேர்ஆயில் 50ml</code> | Proposed correction |
| 735 | 745 | JJ.BABY HAIR OIL 100ML | <code>JJ.பேபிஸேர்ஆயில் 100ml</code> | Proposed correction |
| 736 | 746 | JJ.BABYLOTION 50ML | <code>JJ.பேபிலோசன் 50ml</code> | Proposed correction |
| 737 | 747 | JJ.BABYLOTION 100ML | <code>JJ.பேபிலோசன் 100ml</code> | Proposed correction |
| 738 | 748 | JJ.BABY SHAMPOO 50ML | <code>JJ.பேபி சாம்பு 50ml</code> | Proposed correction |
| 739 | 749 | JJ.BABY SHAMPOO 100ML | <code>JJ.பேபி சாம்பு 100ml</code> | Proposed correction |
| 740 | 750 | JJ.BABY SHAMPOO 200ML | <code>JJ.பேபி சாம்பு 200ml</code> | Proposed correction |
| 741 | 751 | JJ.BABY CREAM 30G | <code>JJ.பேபி க்ரீம் 30g</code> | No specific correction proposed |
| 742 | 752 | JJ.BABY CREAM 60G | <code>JJ.பேபி க்ரீம் 60g</code> | No specific correction proposed |
| 743 | 753 | JJ.BABY MILK SOAP75G | <code>JJ.மில்க்சோப் 75g</code> | No specific correction proposed |
| 744 | 754 | BABY BRUSH | <code>பேபிபிரக்ஷ</code> | Proposed correction |
| 745 | 755 | NIPPLE | <code>நிப்பிள்</code> | No specific correction proposed |
| 746 | 756 | GRAPE WATER | <code>கிரேப் வாட்டர்</code> | No specific correction proposed |
| 747 | 757 | JJ.BUTS | <code>JJ.பட்ஸ்</code> | No specific correction proposed |
| 748 | 758 | PAMPERS | <code>பேம்பர்ஸ்</code> | No specific correction proposed |
| 749 | 759 | HAGGIES | <code>ஸக்கீஸ்</code> | Proposed correction |
| 750 | 760 | FEEDING BOTTLE | <code>ஃபீடிங் பாட்டில்</code> | No specific correction proposed |
| 751 | H01 | PARACHUTE 100ML JASM | <code>பாராசூட்(JAS)100ml</code> | No specific correction proposed |
| 752 | H26 | PARACHUTE 200ML(JAS) | <code>பாராசூட்(JAS) 200(BOT)</code> | No specific correction proposed |
| 753 | H03 | DOBUR VATIKA 150ML | <code>டாபர் வாட்டிகா 150ml</code> | No specific correction proposed |
| 754 | H04 | DABUR VATIKA 300ML | <code>டாபர் வாட்டிகா 300ml</code> | No specific correction proposed |
| 755 | H05 | DABUR AMLA 100ML | <code>டாபர் அம்லா 100ml</code> | No specific correction proposed |
| 756 | H06 | DABUR AMLA 200ML | <code>டாபர் அம்லா 200ml</code> | No specific correction proposed |
| 757 | H07 | DADUR SPL.OIL 100ML | <code>டாபர் SPL.OIL 100ml</code> | No specific correction proposed |
| 758 | H08 | DABUR SPL.OIL 200ML | <code>டாபர் SPL.OIL 200ml</code> | No specific correction proposed |
| 759 | H09 | ASWINI 100ML | <code>அஸ்வினி  100ml</code> | No specific correction proposed |
| 760 | H10 | ASWINI 200ML | <code>அஸ்வினி  200ml</code> | No specific correction proposed |
| 761 | H11 | KESAVARTHINI 25ML | <code>கேசவர்தினி 25ml</code> | No specific correction proposed |
| 762 | H12 | KEO KARPIN 100ML | <code>கியோகார்பின் 100ml</code> | No specific correction proposed |
| 763 | H13 | KEO KARPIN 200ML | <code>கியோகார்பின் 200ml</code> | No specific correction proposed |
| 764 | H14 | NAVARATHINA 100ML | <code>நவரத்னா 100ml</code> | No specific correction proposed |
| 765 | H15 | PARACHUTE CREAM(S) | <code>பாராசூட்கிரீம்(S)</code> | No specific correction proposed |
| 766 | H16 | PARACHUTE CREAM(B) | <code>பாராசூட்கிரீம்(B)</code> | No specific correction proposed |
| 767 | H17 | NIHAR OIL 100ML | <code>நிகார் ஆயில் 100ml</code> | No specific correction proposed |
| 768 | H18 | NIHAR 400ML | <code>நிகார் ஆயில் 400ml</code> | No specific correction proposed |
| 769 | H19 | TAMPCOL 100ML | <code>டாம்ப்கால் 100ml</code> | No specific correction proposed |
| 770 | H20 | TOMPCOL 200ML | <code>டாம்ப்கால் 200ml</code> | No specific correction proposed |
| 771 | H21 | ALLCLEAR OIL 75ML | <code>ஆல்கிளீயர் 75ml</code> | No specific correction proposed |
| 772 | H22 | ALLCLEAR OIL 200ML | <code>ஆல்கிளீயர் OIL 200ml</code> | No specific correction proposed |
| 773 | H23 | MEERA HAIR OIL 100ML | <code>மீரா HAIR OIL 100ml</code> | No specific correction proposed |
| 774 | H24 | MEERA HAIR OIL 150ML | <code>மீரா HAIR OIL 150ml</code> | No specific correction proposed |
| 775 | H27 | OLIVE OIL 125ML | <code>ஆலிவ் ஆயில் 125ml</code> | No specific correction proposed |
| 776 | H28 | HIMALAYA OIL 100ML | <code>இமாலயா OIL100ml</code> | No specific correction proposed |
| 777 | H29 | HIMALAYA.DAND.120ML | <code>இமாலயா டான்ட் 120ml</code> | No specific correction proposed |
| 778 | H30 | UNICARE | <code>யுனிகேர்</code> | No specific correction proposed |
| 779 | H31 | VASMAL 33 | <code>வாஸ்மோல் 33</code> | No specific correction proposed |
| 780 | H32 | MEDICAR OIL 50ML | <code>மெடிக்கர் ஆயில் 50ml</code> | No specific correction proposed |
| 781 | H33 | BLACK GOLD | <code>பிலக்கோல்டு</code> | No specific correction proposed |
| 782 | H34 | GODREJ DYE 1P | <code>கோத்.டை 1P</code> | No specific correction proposed |
| 783 | H35 | GODREJ DYE 1BOX | <code>கோத்.டை 1BOX</code> | No specific correction proposed |
| 784 | H36 | BLACK HENNA | <code>பிலக்ஸெனா</code> | Proposed correction |
| 785 | H37 | BLACK ROSE 1P | <code>ப்ளாக் ரோஸ் 1P</code> | No specific correction proposed |
| 786 | H38 | BLACK ROSE 1BOX | <code>ப்ளாக் ரோஸ் 1BOX</code> | No specific correction proposed |
| 787 | H39 | INDICA | <code>இன்டிகா டை</code> | No specific correction proposed |
| 788 | H40 | GODREJ RICH CREEAM | <code>கோத்.ரிச்கிரீம்</code> | No specific correction proposed |
| 789 | H41 | LIVAN 100ML | <code>லிவான் 100ml</code> | No specific correction proposed |
| 790 | H42 | BRYL CREAM(S) | <code>பிரில் க்ரீம் (S)</code> | No specific correction proposed |
| 791 | H43 | BRYL CREAM(B) | <code>பிரில் க்ரீம் (B)</code> | No specific correction proposed |
| 792 | H44 | BRYL JEL (S) | <code>பிரில் ஜெல் (S)</code> | No specific correction proposed |
| 793 | H45 | BRYL JEL (B) | <code>பிரில் ஜெல் (B)</code> | No specific correction proposed |
| 794 | 901 | G.K COIL | <code>G.Kகாயில்</code> | No specific correction proposed |
| 795 | 902 | GOODNIGHT FASTCARD | <code>குட்நைட் fast card</code> | No specific correction proposed |
| 796 | 903 | G.K MAT GEL | <code>G.K மேட்ஜெல்</code> | No specific correction proposed |
| 797 | 904 | G.K MAT | <code>G.Kமேட்</code> | No specific correction proposed |
| 798 | 905 | HIT CHACK | <code>HIT சாக்</code> | No specific correction proposed |
| 799 | 906 | A/O MAT | <code>A/Oமேட்</code> | No specific correction proposed |
| 800 | 907 | MARTIN MAT | <code>மார்டீன் மேட்</code> | No specific correction proposed |
| 801 | 908 | BANISH MAT | <code>பேனிஸ் மேட்</code> | No specific correction proposed |
| 802 | 909 | G.K.LIQ.45N | <code>குட்நைட்லிக்யுடு</code> | No specific correction proposed |
| 803 | 910 | G.K.LIQ.60N | <code>G.Kலிக்.60நைட்</code> | No specific correction proposed |
| 804 | 911 | A/O LIQ.45N | <code>ஆல்அவுட்லிக்</code> | No specific correction proposed |
| 805 | 912 | A/O.LIQ.60N | <code>A/Oலிக்.60நைட்</code> | No specific correction proposed |
| 806 | 913 | HITSPRAYRED)200ML | <code>HITSPRAYகரப்பான்)200ml</code> | No specific correction proposed |
| 807 | 914 | MARTIN LIQUED | <code>மார்டீன்.லிக்</code> | No specific correction proposed |
| 808 | 915 | G.K.LIQ.MACHINE | <code>G.K.லிக்.மிஷின்</code> | No specific correction proposed |
| 809 | 916 | A/O.LIQ.MACHINE | <code>A/Oலிக்.மிஷின்</code> | No specific correction proposed |
| 810 | 917 | COLOUR PNAIEL | <code>கலர்பினாயில்</code> | No specific correction proposed |
| 811 | 918 | G.K MAT MACHINE | <code>G.Kமேட்.மிஷின்</code> | No specific correction proposed |
| 812 | 919 | SOAP OIL | <code>சோப்ஆயில்</code> | No specific correction proposed |
| 813 | 920 | WHITE PHENOIL | <code>வெ.ஃபினாயில்</code> | No specific correction proposed |
| 814 | 921 | DOMEX BLUE TOILET | <code>டோமெக்ஸ் டாய்லட்</code> | No specific correction proposed |
| 815 | 922 | DOMEX BOTHROOM | <code>டோமெக்ஸ்பாத்ரூம்</code> | No specific correction proposed |
| 816 | 923 | HARPIC-(S) | <code>ஸார்பிக்-(S)</code> | Proposed correction |
| 817 | 924 | HAPIC-(B) | <code>ஸார்பிக்-(B)</code> | Proposed correction |
| 818 | 925 | LIZOL 200ML | <code>லைசால் 200ml</code> | No specific correction proposed |
| 819 | 926 | LIZOL 500ML | <code>லைசால் 500ml</code> | No specific correction proposed |
| 820 | 927 | LI.BUOY H / W | <code>லைபாய் H / W</code> | No specific correction proposed |
| 821 | 928 | DETTOL H/W | <code>டெட்டால் H/W</code> | No specific correction proposed |
| 822 | 929 | CIF CREAM 250ML | <code>சிப் கிரீம் 250ml</code> | No specific correction proposed |
| 823 | 930 | NIMYEL | <code>நிம்ய்ல்</code> | No specific correction proposed |
| 824 | 931 | COLIN | <code>கோலின்</code> | No specific correction proposed |
| 825 | 932 | KIWI KLEEN | <code>கிவி க்ளீன்</code> | No specific correction proposed |
| 826 | 933 | ACID | <code>ஆசிட்</code> | No specific correction proposed |
| 827 | 934 | ROBIN BLEECH | <code>ராபின் ப்ளீச்</code> | No specific correction proposed |
| 828 | 935 | EASY BANG(B) | <code>ஈஷி பேங்க்(B)</code> | Owner confirmation |
| 829 | 958 | HARPIC(F)MATIC | <code>ஸார்பிக்(F-MATIC)</code> | Proposed correction |
| 830 | 937 | DRANEX | <code>டிரானக்ஸ்</code> | No specific correction proposed |
| 831 | 938 | ODONIL(S) | <code>ஓடோனில் (S)</code> | No specific correction proposed |
| 832 | 939 | ODONIL(M) | <code>ஓடோனில்(M)</code> | No specific correction proposed |
| 833 | 940 | AIRPACKET | <code>ஏர் பாக்கட்</code> | No specific correction proposed |
| 834 | 941 | NAPTHALIN | <code>பூச்சுருண்டை</code> | No specific correction proposed |
| 835 | 942 | ANT POWDER | <code>எறும்பு பொடி</code> | No specific correction proposed |
| 836 | 943 | BLEECHING POWDER | <code>ப்ளீச்சிங் பவுடர்</code> | No specific correction proposed |
| 837 | 944 | RAT KILLAR | <code>எலி கேக்</code> | No specific correction proposed |
| 838 | 945 | COLOUR 25GM | <code>கலர் பொடி 25gm</code> | No specific correction proposed |
| 839 | 946 | HIT RED(S) | <code>இட் ரெட்(S)</code> | No specific correction proposed |
| 840 | 947 | HIT RED(B) | <code>இட் ரெட்(B)</code> | No specific correction proposed |
| 841 | 948 | HIT BLACK(S) | <code>இட் ப்ளாக்(S)</code> | No specific correction proposed |
| 842 | 949 | HIT BLACK(B) | <code>இட் ப்ளாக்(B)</code> | No specific correction proposed |
| 843 | 950 | BAYGON SPRAY | <code>பேகான் ஸ்ப்ரே</code> | No specific correction proposed |
| 844 | 951 | MARTIN SPRAY | <code>மார்டீன் ஸ்ப்ரே</code> | No specific correction proposed |
| 845 | 952 | HIT CHOK | <code>இட் லைன் சாக்</code> | No specific correction proposed |
| 846 | 953 | BELONA BATHI | <code>பெலோனா பத்தி</code> | No specific correction proposed |
| 847 | 954 | ODOMAS(S) | <code>ஓடோமாஸ்(S)</code> | No specific correction proposed |
| 848 | A01 | APPALAM 100GM | <code>அப்பளம் 100gm</code> | No specific correction proposed |
| 849 | A02 | APPALAM 150GM | <code>அப்பளம் 150gm</code> | No specific correction proposed |
| 850 | A04 | PICKLE (LOOSE) | <code>ஊறுகாய் (லூஸ்)</code> | No specific correction proposed |
| 851 | A07 | PICKLES(PKT) | <code>ஊறுகாய் (PKT)</code> | No specific correction proposed |
| 852 | A08 | RUCHI PICKLE(MANGO) | <code>ருசி ஊறுகாய்(மாங்கா)</code> | No specific correction proposed |
| 853 | A09 | RUCHI PICKLE(GARLIC) | <code>ருசிஊறுகாய்(பூண்டு)</code> | No specific correction proposed |
| 854 | A10 | AACHI PICKLEJAR 1+1 | <code>ஆச்சிஊறுகாய்Jar 1+1</code> | No specific correction proposed |
| 855 | A11 | VADAGAM | <code>வடாகம்</code> | No specific correction proposed |
| 856 | A05 | SAKTHI PICKLE(LEMON) | <code>சக்திஊறுகாய்(Lemon)</code> | No specific correction proposed |
| 857 | A12 | PICKLES JAR | <code>ஊருகாய் ஜார்</code> | Proposed correction |
| 858 | A13 | SUNDA VATHAL | <code>சுண்டவத்தல்</code> | Owner confirmation |
| 859 | A14 | PANIPOORI 1KG | <code>பானிபூரி 1kg</code> | No specific correction proposed |
| 860 | A15 | KOTHEVARAI | <code>கொத்தவரை</code> | No specific correction proposed |
| 861 | A16 | CURD CHILLY | <code>மோர்மிளகாய்</code> | No specific correction proposed |
| 862 | A17 | CON CIPS | <code>கான்சிப்ஸ்</code> | No specific correction proposed |
| 863 | A18 | CAR.ZIN.PASTE | <code>இஞ்சி.பூ.பேஸ்ட்</code> | No specific correction proposed |
| 864 | S01 | SUNSILK 800ML | <code>சன்சில்க் 80ml</code> | Owner confirmation |
| 865 | S02 | SUNSILK 180ML | <code>சன்சில்க் 180ml</code> | No specific correction proposed |
| 866 | S03 | SUNSILK 340ML | <code>சன்சில்க் 340ml</code> | No specific correction proposed |
| 867 | S04 | CLINIC + 40ML | <code>கிளினிக் + 40ml</code> | No specific correction proposed |
| 868 | S05 | CLINIC + 100ML | <code>கிளினிக் + 100ml</code> | No specific correction proposed |
| 869 | S06 | CLINIC + 200ML | <code>கிளினிக் + 200ml</code> | No specific correction proposed |
| 870 | S07 | CLINIC + 400ML | <code>கிளினிக் + 400ml</code> | No specific correction proposed |
| 871 | S08 | CLINIC A/C 40ML | <code>கிளினிக் A/C 40ml</code> | No specific correction proposed |
| 872 | S09 | CLINIC A/C 100ML | <code>கிளினிக் A/C 100ml</code> | No specific correction proposed |
| 873 | S10 | CLINIC A/C 200ML | <code>கிளினிக் A/C 200ml</code> | No specific correction proposed |
| 874 | S11 | CHICK 120ML | <code>சிக் 120ml</code> | No specific correction proposed |
| 875 | S12 | PANTENE 100ML | <code>பேன்டீன் 100ml</code> | No specific correction proposed |
| 876 | S13 | PANTENE 200ML | <code>பேன்டீன் 200ml</code> | No specific correction proposed |
| 877 | S14 | H &amp; S 100ML | <code>H &amp; S 100ml</code> | Owner confirmation |
| 878 | S15 | H &amp; S 200ML | <code>H &amp; S 200ml</code> | Owner confirmation |
| 879 | S16 | GARNIOR SHM100ML | <code>கார்னியர் சாம்பு 100ml</code> | Proposed correction |
| 880 | S17 | TRESEMME100ML | <code>டிரஸ்சமி 100ml</code> | No specific correction proposed |
| 881 | S18 | VATIKA 100ML | <code>வாட்டிகா ஷாம்பு 100ml</code> | No specific correction proposed |
| 882 | S19 | VATIKA SHAMPOO 200ML | <code>வாட்டிகா ஷாம்பு 200ml</code> | No specific correction proposed |
| 883 | S20 | NYLE SHAMPOO 100ML | <code>நைல் ஷாம்பு 100ml</code> | No specific correction proposed |
| 884 | S21 | NYLE SHAMPOO 200ML | <code>நைல் ஷாம்பு 200ml</code> | No specific correction proposed |
| 885 | S22 | DOVE 100ML | <code>டவ்சாம்பு 100ml</code> | Proposed correction |
| 886 | S23 | DOVE 200ML | <code>டவ்சாம்பு 200ml</code> | Proposed correction |
| 887 | S24 | REJOICE 400ML | <code>ரிஜாய்ஸ் 400ml</code> | No specific correction proposed |
| 888 | S25 | HIMALAYA SHAMPOO 120ML | <code>ஸிமா.ஷாம்பு  120ml</code> | Proposed correction |
| 889 | S26 | MEDIKAR 50ML | <code>மெடிக்கர் ஷாம்பு 50ml</code> | No specific correction proposed |
| 890 | S27 | MEERA SHAMPOO 100ML | <code>மீரா ஷாம்பு 100ml</code> | No specific correction proposed |
| 891 | S28 | MEERA 50G(SAC) | <code>மீரா 50g(Sac)</code> | No specific correction proposed |
| 892 | S29 | MEERA 100G(SAC) | <code>மீரா 100g(Sac)</code> | No specific correction proposed |
| 893 | S30 | MEERA 100G(JAR) | <code>மீரா 100g(JAR)</code> | No specific correction proposed |
| 894 | S31 | MEERA GOLD 100G(JAR) | <code>மீரா கோல்டு 100g(JAR)</code> | No specific correction proposed |
| 895 | S32 | SHIKKAKAI | <code>சீயக்காய்</code> | No specific correction proposed |
| 896 | S33 | SHIKAI POWDER | <code>பாரதியார்சீவக்காய்தூள்</code> | Proposed correction |
| 897 | S34 | ARAPPU | <code>அரப்பு</code> | No specific correction proposed |
| 898 | S35 | THEVALAPODI 100G | <code>தெவளப்பொடி 100g</code> | No specific correction proposed |
| 899 | S36 | CLINIC+(SAC) | <code>கிளினிக்+ (sac)</code> | No specific correction proposed |
| 900 | S37 | CLINIC A/C(SAC) | <code>கிளினிக் A/C(sac)</code> | No specific correction proposed |
| 901 | S38 | SUNSILK (SAC) | <code>சன்சில்க் (sac)</code> | No specific correction proposed |
| 902 | S39 | CHICK (SAC) | <code>சிக் (sac)</code> | No specific correction proposed |
| 903 | S40 | H &amp; S(SAC)2RS | <code>H &amp; S2ரூ (Sac)</code> | No specific correction proposed |
| 904 | S41 | PANTINE (SAC) | <code>பேன்டீன் (Sac)</code> | No specific correction proposed |
| 905 | S42 | MEERA POW (SAC) | <code>மீரா பவு (சரம்)</code> | No specific correction proposed |
| 906 | S43 | MEERA SHAM(3RS) | <code>மீரா ஷாம்பு (3ரூசரம்)</code> | No specific correction proposed |
| 907 | S44 | DOVE SHM (SAC) | <code>டவ்ஷாம்பு (Sac)(2</code> | Owner confirmation |
| 908 | S45 | DOVE SHM(SAC) (3) | <code>டவ்ஷாம்பு (3) (Sac)</code> | No specific correction proposed |
| 909 | S46 | KARTHIKAPOWDER(SAC) | <code>கார்திகாபவுடர் (சரம்)</code> | No specific correction proposed |
| 910 | 801 | DETTOL 50ML | <code>டெட்டால் 50ml</code> | No specific correction proposed |
| 911 | 802 | DETTOL 100ML | <code>டெட்டால் 125ml</code> | Owner confirmation |
| 912 | 803 | DETTOL 200ML | <code>டெட்டால் 250ml</code> | Owner confirmation |
| 913 | 804 | DETTOL 500ML | <code>டெட்டால் 500ml</code> | No specific correction proposed |
| 914 | 805 | VICKS 10G | <code>விக்ஸ் 10g</code> | No specific correction proposed |
| 915 | 806 | VICKS 25G | <code>விக்ஸ் 25g</code> | No specific correction proposed |
| 916 | 807 | VICKS 50G | <code>விக்ஸ் 50g</code> | No specific correction proposed |
| 917 | 808 | AMIR TAPPI | <code>அமிர்.டப்பி</code> | No specific correction proposed |
| 918 | 809 | AMIR.BOT | <code>அமிர்.பாட்டில்</code> | No specific correction proposed |
| 919 | 810 | AMIR.STRONG | <code>அமிர்.ஸ்ட்ராங்</code> | No specific correction proposed |
| 920 | 811 | ZANDU BALM | <code>ஜண்டுபாம்</code> | No specific correction proposed |
| 921 | 812 | IODEX 10G | <code>அயோடெக்ஸ் 10g</code> | No specific correction proposed |
| 922 | 813 | IODEX 20G | <code>அயோடெக்ஸ் 20g</code> | No specific correction proposed |
| 923 | 814 | VASELINE 25G | <code>வாசலின் 25g</code> | No specific correction proposed |
| 924 | W72 | HENKO MAHA BAR | <code>ஸென்.மஸா.பார்</code> | Proposed correction |
| 925 | 815 | VASELINE 50G | <code>வாசலின் 50g</code> | No specific correction proposed |
| 926 | 816 | MOOV 15G | <code>மூவ் 15g</code> | No specific correction proposed |
| 927 | 817 | MOOV 25G | <code>மூவ் 25g</code> | No specific correction proposed |
| 928 | 818 | SAVLON.LIQ.50ML | <code>சேவ்லான்.லிக்.50ml</code> | No specific correction proposed |
| 929 | 819 | SAVLON.LIQ.100ML | <code>சேவ்லான்.லிக்.100ml</code> | No specific correction proposed |
| 930 | 820 | KRACK CREAM 25G | <code>கிராக்கிரீம் 25g</code> | No specific correction proposed |
| 931 | 821 | TIGER BALM 8G | <code>டைகர் பாம் 8g</code> | No specific correction proposed |
| 932 | 822 | MENTHO + | <code>மென்தோ +</code> | No specific correction proposed |
| 933 | 823 | ANNI FFRENCH | <code>ஆனிஃப்ரென்ஞ்</code> | No specific correction proposed |
| 934 | 824 | FRANCH OIL | <code>ஃப்ரான்ச் ஆயில்</code> | No specific correction proposed |
| 935 | 825 | GODREJAIR PAKT | <code>கோத்ரேஜ் ஏர்பாக்.</code> | No specific correction proposed |
| 936 | 826 | WISPERMAXI XL | <code>விஸ்பர்மேக்ஷி (XL)</code> | Proposed correction |
| 937 | 827 | WHISPER MAXI(REG) | <code>விஸ்பர் மேக்ஷி(Reg)</code> | Proposed correction |
| 938 | 828 | WHISPER ULTRA | <code>விஸ்பர் அல்ட்ரா</code> | No specific correction proposed |
| 939 | 829 | WHISPER CHOICE REG. | <code>விஸ்பர் சாய்ஸ் (Reg)</code> | No specific correction proposed |
| 940 | 830 | WHISPER CHOI.WINGS | <code>விஸ்பர் சாய்ஸ் (விங்ஸ்)</code> | No specific correction proposed |
| 941 | 831 | WHISPER CHOICEALTRA | <code>விஸ்பர்சாய்ஸ்அல்ட்ரா</code> | No specific correction proposed |
| 942 | 832 | STAYFREE REG | <code>ஸ்டேஃப்ரீ Reg</code> | No specific correction proposed |
| 943 | 833 | STAYFREE XL | <code>ஸ்டேஃப்ரீ XL</code> | No specific correction proposed |
| 944 | 834 | STAYFREE ALL NIT. | <code>ஸ்டேஃப்ரீ(All nit.)</code> | No specific correction proposed |
| 945 | 835 | STAYFREE DRYWINGS | <code>ஸ்டேஃப்ரீ ட்ரைவிங்ஸ்</code> | No specific correction proposed |
| 946 | 836 | PAMPERS 5S,2S(S) | <code>பேம்பர்ஸ் 5S,2S(S)</code> | No specific correction proposed |
| 947 | 837 | PAMPERS 2S,5S(M) | <code>பேம்பர்ஸ் 2S,5S(M)</code> | No specific correction proposed |
| 948 | 838 | PAMPERS 2S,5S(L) | <code>பேம்பர்ஸ் 2S,5S(L)</code> | No specific correction proposed |
| 949 | 839 | KOTEX ACTIVE | <code>கோட்டெக்ஸ் ACT</code> | No specific correction proposed |
| 950 | V01 | GODREJ CREAM(S) | <code>கோத்ரெஜ் கிரீம் (S)</code> | No specific correction proposed |
| 951 | V02 | V-CARE DAY | <code>வீ-கேர் டை</code> | No specific correction proposed |
| 952 | V03 | V I P DAY | <code>வீ ஜ பி டை</code> | No specific correction proposed |
| 953 | V04 | PALMOLIVE CREAM(B) | <code>பாமோலிவ் கிரீம்(B)</code> | No specific correction proposed |
| 954 | V05 | OLD SPICECREAM (S) | <code>ஓ.ஸ்பைஸ்.கிரீம் (S)</code> | No specific correction proposed |
| 955 | V06 | OLD SPICECREAM(B) | <code>ஓ.ஸ்பைஸ்.கிரீம்(B)</code> | No specific correction proposed |
| 956 | V07 | DENIM.S.CREAM | <code>டெனிம்.சே.கிரீம்</code> | No specific correction proposed |
| 957 | V08 | NIVYA.S.CREAM | <code>நிவ்யா.சே.கிரீம்</code> | No specific correction proposed |
| 958 | V11 | SUPERMAX | <code>சூப்பர்மேக்ஸ்</code> | No specific correction proposed |
| 959 | V12 | WILLKINESON | <code>வில்கின்சன்</code> | No specific correction proposed |
| 960 | V13 | 7'O CLOCK | <code>7'Oக்ளாக்(பச்சை)</code> | No specific correction proposed |
| 961 | V14 | 7'OCL0CK(PLATINAM) | <code>7'oக்ளாக்(பிளாட்டினம்)</code> | No specific correction proposed |
| 962 | V09 | G.SAVING SOAP | <code>G.சேவிங் சோப்(R)</code> | No specific correction proposed |
| 963 | V10 | G.SAVING SOAP(JAR) | <code>G.சேவிங் சோப்(Jar)</code> | No specific correction proposed |
| 964 | V15 | GILL.GUARD RAZ | <code>ஜில்.காடுரேசர்</code> | No specific correction proposed |
| 965 | V16 | SWISH | <code>சுவிஸ்</code> | No specific correction proposed |
| 966 | V17 | ROOMSPRY | <code>ரூம் ஸ்பிரே</code> | No specific correction proposed |
| 967 | V18 | LASER | <code>லேசர்</code> | No specific correction proposed |
| 968 | V19 | TWIN BLADE | <code>ட்வின்பிளேடு</code> | No specific correction proposed |
| 969 | V20 | RESAR | <code>ரேசர்</code> | No specific correction proposed |
| 970 | V21 | NIVYA BRUSH | <code>நிவியா.சே.பிரஸ்</code> | Proposed correction |
| 971 | V22 | OID.S.LOTION 50ML | <code>ஓ.ஸ்பைஸ் லோஷன்50ml</code> | No specific correction proposed |
| 972 | V23 | OIL.S.LOTION 100ML | <code>ஓ.ஸ்பைஸ் லோஷன் 100ml</code> | No specific correction proposed |
| 973 | V24 | DENIM LOTION 100ML | <code>டெனிம் லோஷன் 100ml</code> | No specific correction proposed |
| 974 | V25 | AXE LOTION | <code>ஆக்ஸ் லோஷன் 50ml</code> | No specific correction proposed |
| 975 | V26 | AXE LOTION 100ML | <code>ஆக்ஸ் லோஷன் 100ml</code> | No specific correction proposed |
| 976 | V27 | PRIMIUM LOTION 50ML | <code>பிரீமியம் லோஷன் 50ml</code> | No specific correction proposed |
| 977 | V28 | NIVYA LOTION 50ML | <code>நிவியா லோஷன் 50ml</code> | No specific correction proposed |
| 978 | V29 | YARDLY LOTION50ML | <code>யார்ட்லி லோஷன் 50ml</code> | No specific correction proposed |
| 979 | V30 | GILLETTE FOAM | <code>ஜில்லட் FOAM</code> | No specific correction proposed |
| 980 | C01 | SABEENA POWDER | <code>சபீனா பவுடர்</code> | No specific correction proposed |
| 981 | C02 | A-ONE POWDER | <code>ஏ-ஒன்.பவுடர்</code> | No specific correction proposed |
| 982 | C03 | A ONE POWER500GM | <code>ஏ ஓன் பவுடர்500gm</code> | No specific correction proposed |
| 983 | C04 | EXO SAFAI | <code>எக்ஷோ சபாய்</code> | Proposed correction |
| 984 | C05 | SCOTCH BRITE | <code>ஸ்காச் ப்ரைட்</code> | No specific correction proposed |
| 985 | C06 | EXO STEEL | <code>எக்ஷோ ஸ்டீல்</code> | Proposed correction |
| 986 | C07 | VIM BAR(B) | <code>விம் பார் (B)</code> | No specific correction proposed |
| 987 | C08 | VIM BAR(S) | <code>விம் பார் (S)</code> | No specific correction proposed |
| 988 | C09 | VIM BAR RS.5 | <code>விம் பார் ரூ.5</code> | No specific correction proposed |
| 989 | C10 | EXO BAR (S) | <code>எக்ஷோ பார் (s)</code> | Proposed correction |
| 990 | C11 | EXO   ROUND BAR | <code>எக்ஷோ ரவுன் பார்</code> | Proposed correction |
| 991 | C13 | PRILL LIG 225ML | <code>பிரில் லிக்யூடு 225ml</code> | No specific correction proposed |
| 992 | C14 | PITHAMBARI | <code>பீதாம்பரி</code> | No specific correction proposed |
| 993 | C12 | SABEENA BAR | <code>சபீனா பார்</code> | No specific correction proposed |
| 994 | P01 | PONDS ROSE 50G | <code>பான்ஸ் ரோஸ் 50g</code> | No specific correction proposed |
| 995 | P02 | PONDS ROSE 100G | <code>பான்ஸ் ரோஸ் 100g</code> | No specific correction proposed |
| 996 | P03 | PONDS ROSE 400G | <code>பான்ஸ் ரோஸ் 400g</code> | No specific correction proposed |
| 997 | P04 | PONDS MAGIC 50G | <code>பான்ஸ் மேஜிக் 50g</code> | No specific correction proposed |
| 998 | P05 | PONDS MAGIC 100G | <code>பான்ஸ் மேஜிக் 100g</code> | No specific correction proposed |
| 999 | P06 | PONDS MAGIC 400G | <code>பான்ஸ் மேஜிக் 400g</code> | No specific correction proposed |
| 1000 | P07 | PONDS SANDLE 50G | <code>பான்ஸ் சாண்டல் 50g</code> | No specific correction proposed |
| 1001 | P08 | PONDS SANDLE 100G | <code>பான்ஸ் சாண்டல் 100g</code> | No specific correction proposed |
| 1002 | P09 | PONDS SANDLE 400G | <code>பான்ஸ் சாண்டல் 400g</code> | No specific correction proposed |
| 1003 | P10 | GOKULSANDOL70GM | <code>கோகுல்சண்டல்70gm</code> | No specific correction proposed |
| 1004 | P11 | T.S.R.140G | <code>T.S.R.140g</code> | Owner confirmation |
| 1005 | P12 | T.S.R.300G | <code>T.S.R.300g</code> | Owner confirmation |
| 1006 | P13 | PONDS 10RS | <code>பான்ஸ் 10ரூ</code> | No specific correction proposed |
| 1007 | P14 | CUTICURA 400G | <code>குயூட்டிகூரா 400g</code> | No specific correction proposed |
| 1008 | P15 | SPINCE POWDER 100G | <code>ஸ்பின்ஸ் பவுடர் 100g</code> | No specific correction proposed |
| 1009 | P17 | NYCIL 150G | <code>நைசில் பவுடர் 150g</code> | No specific correction proposed |
| 1010 | P19 | DENIM TALC 100G | <code>டெனிம் பவுடர் 100g</code> | No specific correction proposed |
| 1011 | P20 | DENIM TALC 300G | <code>டெனிம் பவுடர் 300g</code> | No specific correction proposed |
| 1012 | P18 | SHOWER TO SHOWER | <code>சவர் to சவர்</code> | No specific correction proposed |
| 1013 | P21 | Z TALC 100G | <code>z பவுடர் 100g</code> | No specific correction proposed |
| 1014 | P22 | CINTHOL POWDER 100G | <code>சிந்தால் பவுடர் 100g</code> | No specific correction proposed |
| 1015 | P23 | CHINTHOL POWDER 400G | <code>சிந்தால் பவுடர் 400g</code> | No specific correction proposed |
| 1016 | P24 | YARDLY GOLD | <code>யார்ட்லி கோல்டு</code> | No specific correction proposed |
| 1017 | P25 | M/S POWDER 100G | <code>M/S பவுடர் 100g</code> | No specific correction proposed |
| 1018 | P26 | SANDOOR POWDER100G | <code>சந்தூர் பவுடர் 100g</code> | No specific correction proposed |
| 1019 | P27 | TARA POWDER | <code>தாரா பவுடர்</code> | No specific correction proposed |
| 1020 | P16 | SPINZ POWDER 100G | <code>ஸ்பின்ஸ் பவுடர் 100g</code> | No specific correction proposed |
| 1021 | P28 | DERMI COOL | <code>டெர்மீ கூல்</code> | No specific correction proposed |
| 1022 | P29 | EMAMI ODISI | <code>இமாமி ஒடிசி</code> | No specific correction proposed |
| 1023 | P30 | NIVYA POWDER | <code>நிவியா பவுடர்</code> | No specific correction proposed |
| 1024 | P31 | AXE SPRAY | <code>ஆக்ஸ் ஸ்ப்ரே</code> | No specific correction proposed |
| 1025 | P32 | FOGGE SPRAY | <code>FOGGE ஸ்ப்ரே</code> | No specific correction proposed |
| 1026 | P33 | PONDS SPRAY | <code>பான்ஸ் ஸ்ப்ரே</code> | No specific correction proposed |
| 1027 | P34 | SPINZ SPRAY | <code>ஸ்பின்ஸ் ஸ்ப்ரே</code> | No specific correction proposed |
| 1028 | P35 | DENIM SPRAY | <code>டெனிம் ஸ்ப்ரே</code> | No specific correction proposed |
| 1029 | P36 | FA SPRAY | <code>ஃபா ஸ்ப்ரே</code> | No specific correction proposed |
| 1030 | P37 | EVA SPRAY | <code>ஈவா ஸ்ப்ரே</code> | No specific correction proposed |
| 1031 | P38 | YARDLY SPRAY | <code>யார்ட்லி ஸ்ப்ரே</code> | No specific correction proposed |
| 1032 | P39 | PARK AVENUE SPY | <code>பார்க் அவென்யூ spy</code> | No specific correction proposed |
| 1033 | P40 | NIVYA SPRAY | <code>நிவியா ஸ்ப்ரே</code> | No specific correction proposed |
| 1034 | P41 | PONDS ORANGE 100G | <code>பான்ஸ் ஆரஞ் 100g</code> | No specific correction proposed |
| 1035 | P42 | PONDS ORANGE 400G | <code>பான்ஸ் ஆரஞ் 400g</code> | No specific correction proposed |
| 1036 | F01 | FAIR&amp;LOVELY(SAC) | <code>ஃபேர்&amp;லவ்லி(Sac)</code> | No specific correction proposed |
| 1037 | F02 | F &amp; L 25G | <code>F &amp; L 25g</code> | Owner confirmation |
| 1038 | F03 | F &amp; L50G | <code>F &amp; L 50g</code> | Owner confirmation |
| 1039 | F04 | F&amp;L 80G | <code>F &amp; L 80g</code> | Owner confirmation |
| 1040 | F05 | F&amp;L(AYR)25G | <code>F &amp; L (ஆயுர்)25g</code> | No specific correction proposed |
| 1041 | F06 | AYUSH CREEME25GM | <code>ஆயூஸ்கிரிம்25gm</code> | Proposed correction |
| 1042 | F07 | F&amp;L(MEN) 25G | <code>F &amp; L (men) 25G</code> | Owner confirmation |
| 1043 | F08 | FAIR EVER(SAC) | <code>ஃபேரெவர் (Sac)</code> | No specific correction proposed |
| 1044 | F09 | FAIR EVER 25G | <code>ஃபேரெவர் 25g</code> | No specific correction proposed |
| 1045 | F10 | FAIR EVER 50G | <code>ஃபேரெவர் 50g</code> | No specific correction proposed |
| 1046 | F11 | VICCO CREAM 15G | <code>விக்கோ கிரீம் 15g</code> | No specific correction proposed |
| 1047 | F12 | VICCO CREAM 30G | <code>விக்கோ கிரீம் 30g</code> | No specific correction proposed |
| 1048 | F13 | VICCO CREAM 60G | <code>விக்கோ கிரீம் 60g</code> | No specific correction proposed |
| 1049 | F14 | PONDS LOTION 100ML | <code>பான்ஸ் லோசன் 100ml</code> | Proposed correction |
| 1050 | F15 | PONDS COLD CRM | <code>பான்ஸ்.கோ.கிரீம் 30g</code> | No specific correction proposed |
| 1051 | F16 | VASELINE LOTION 100ML | <code>வாஸ்லின் லோசன் 100ml</code> | Proposed correction |
| 1052 | F17 | VASELINE LOTION 40ML | <code>வாஸ்லின் லோசன் 40ml</code> | Proposed correction |
| 1053 | F18 | ROSE WATER | <code>ரோஸ்வாட்டர்</code> | No specific correction proposed |
| 1054 | F19 | GARNIOR CREAM | <code>கார்னியர் கிரீம்</code> | No specific correction proposed |
| 1055 | F20 | NO MARKS | <code>நோமார்க்ஸ்</code> | No specific correction proposed |
| 1056 | F21 | EMAMI F/HANSAM | <code>இமாமி F/HANSAM</code> | No specific correction proposed |
| 1057 | F22 | HIMA.FAIRNESS | <code>இமா.Fairness</code> | No specific correction proposed |
| 1058 | F23 | LAKME CREAM | <code>லேக்மி கிரீம்</code> | No specific correction proposed |
| 1059 | F24 | HIMA.F/W | <code>இமாலயா F/W</code> | No specific correction proposed |
| 1060 | F25 | FAR/LOLY  F/W50GM | <code>பேரன்லவ்லி F/W50gm</code> | No specific correction proposed |
| 1061 | F26 | FAIR/LOLY F/W 20GM | <code>பேரன்லவ்லி F/W 20gm</code> | No specific correction proposed |
| 1062 | F27 | AYUSH F/W | <code>ஆயூஸ் F/W</code> | Proposed correction |
| 1063 | F28 | EVER YOUTH CRM | <code>எவர்யூத் கிரீம்</code> | No specific correction proposed |
| 1064 | F29 | PONDS F/W | <code>பான்ஸ் F/w</code> | No specific correction proposed |
| 1065 | F30 | PEARS F/W | <code>பியர்ஸ் F/w</code> | No specific correction proposed |
| 1066 | U01 | MTR.J.MIX 200G/200G | <code>MTR.ஜாமூன் 200g/200g</code> | No specific correction proposed |
| 1067 | U02 | ORKEY.J.MIX 200G | <code>Orkey.ஜாமூன் 200g</code> | No specific correction proposed |
| 1068 | U03 | AASEERVATH JAMUN 200GM | <code>ஆசீர்வாத் ஜாமூன்200gm</code> | No specific correction proposed |
| 1069 | U04 | ANAPOORNA 200GM/200G | <code>அன்னபூர். ஜாமூன்200gm+200gm</code> | No specific correction proposed |
| 1070 | U05 | MTR.BADAM 200G | <code>MTR.பாதாம் 200g</code> | No specific correction proposed |
| 1071 | U06 | A.PAYASA MIX | <code>அ.பாயாசமிக்ஸ் offer1 +1</code> | No specific correction proposed |
| 1072 | U07 | AACHI BADAM MIX | <code>ஆச்சி பாதாம் 200gm(offer)</code> | No specific correction proposed |
| 1073 | U08 | MTR.RAVA IDLY | <code>MTR.ரவா இட்லி</code> | No specific correction proposed |
| 1074 | U09 | MTR.RAVA DOSAI | <code>MTR.ரவா தோசை</code> | No specific correction proposed |
| 1075 | U10 | K.BIRIYANI MIX | <code>K.பிரியானி மிக்ஸ்</code> | Proposed correction |
| 1076 | U11 | ICE CREAM PDR | <code>ஐஸ்கிரீம் பவு</code> | No specific correction proposed |
| 1077 | U12 | BAKING POWDER | <code>பேக்கிங் பவுடர்</code> | No specific correction proposed |
| 1078 | U13 | LEMON SALT | <code>லெமன் சால்ட்</code> | No specific correction proposed |
| 1079 | U14 | YEAST | <code>ஈஸ்ட்</code> | No specific correction proposed |
| 1080 | U15 | CUSTARD POWDER | <code>கஸ்டர்டு பவு</code> | No specific correction proposed |
| 1081 | U16 | SOUP POWDER | <code>சூப் பவுடர்</code> | No specific correction proposed |
| 1082 | U17 | ROSE ESS | <code>ரோஸ் எசன்ஸ்</code> | No specific correction proposed |
| 1083 | U18 | PINE APPLE ESS | <code>பைனாப்பிள் ess</code> | No specific correction proposed |
| 1084 | U19 | VENNILA ESS | <code>வென்னிலா ess</code> | No specific correction proposed |
| 1085 | U20 | ROSE MILK ESS | <code>ரோஸ்.மில்க்.ess</code> | No specific correction proposed |
| 1086 | X01 | CELL (S) | <code>செல் (S)</code> | No specific correction proposed |
| 1087 | X02 | CELL (M) | <code>செல் (M)</code> | No specific correction proposed |
| 1088 | X03 | CELL (B) | <code>செல் (B)</code> | No specific correction proposed |
| 1089 | X04 | DURO CELL | <code>டியூரோ செல்</code> | No specific correction proposed |
| 1090 | X05 | 0-W BULP | <code>0-W பல்ப்</code> | No specific correction proposed |
| 1091 | X06 | 40-W BALP | <code>40-W பல்ப்</code> | No specific correction proposed |
| 1092 | X07 | 60-W BALP | <code>60-W பல்ப்</code> | No specific correction proposed |
| 1093 | X08 | 100-W BALP | <code>100-W பல்ப்</code> | No specific correction proposed |
| 1094 | X09 | TORCHE | <code>டார்ச்</code> | No specific correction proposed |
| 1095 | J01 | K.JAM 100G | <code>K.ஜாம் 100g</code> | No specific correction proposed |
| 1096 | J02 | K.JAM 200G | <code>K.ஜாம் 200g</code> | No specific correction proposed |
| 1097 | J03 | K.JAM 500G | <code>K.ஜாம் 500g</code> | No specific correction proposed |
| 1098 | J04 | SOYA SAUCE 200GM | <code>சோயா சாஸ்200GM</code> | No specific correction proposed |
| 1099 | J05 | TOM.SAUCE [BIG] | <code>டொமட்டோசாஸ் [BIG]</code> | No specific correction proposed |
| 1100 | J06 | SOYA SAUCE[BIG] | <code>சோயாசாஸ்[BIG]</code> | No specific correction proposed |
| 1101 | J07 | MAAYANES | <code>மயோனஸ்</code> | No specific correction proposed |
| 1102 | J08 | GREEN.CHI.SAU | <code>கிரீன்.சில்லி.சாஸ்</code> | No specific correction proposed |
| 1103 | N01 | RASNA ORAN | <code>ரஸ்னா ஆரஞ்</code> | No specific correction proposed |
| 1104 | N02 | RASNA MANGO | <code>ரஸ்னா மேங்</code> | No specific correction proposed |
| 1105 | N03 | RASNA N.BANI | <code>ரஸ்னா நிபூபானி</code> | No specific correction proposed |
| 1106 | N04 | RASNA P.APP | <code>ரஸ்.பை.ஆப்பிள்</code> | No specific correction proposed |
| 1107 | N05 | K.FRU.KICK | <code>K.ஃப்ரூட் கிக்</code> | No specific correction proposed |
| 1108 | N06 | T.S.R.NANARI | <code>T.S.R.நன்னாரி</code> | No specific correction proposed |
| 1109 | Q01 | MARIE GOLD(S) | <code>மேரி கோல்டு(S)</code> | No specific correction proposed |
| 1110 | Q03 | VITA MARIE | <code>விட்டா மேரி</code> | No specific correction proposed |
| 1111 | Q04 | MILK BIKIS(B) | <code>மில்க் பிகீஸ் (B)</code> | No specific correction proposed |
| 1112 | Q05 | MILK BIKIS(S) | <code>மில்க் பிகீஸ்(S)</code> | No specific correction proposed |
| 1113 | Q06 | DARK FANTASY | <code>டார்க் பேண்டஷி</code> | No specific correction proposed |
| 1114 | Q07 | TIGER(S) | <code>டைகர்(S)</code> | No specific correction proposed |
| 1115 | Q08 | 50-50(B) | <code>50-50(B)</code> | Owner confirmation |
| 1116 | Q09 | 50-50(S) | <code>50-50(S)</code> | Owner confirmation |
| 1117 | Q10 | 50-50 MUS.CHA | <code>50-50 மஸ்.சஸ்கா</code> | No specific correction proposed |
| 1118 | Q11 | GOODDAY CASU.(B) | <code>குட்டே(முந்)(B)</code> | No specific correction proposed |
| 1119 | Q12 | GOODDAY(S)PKT | <code>குட்டே(S)pkt</code> | No specific correction proposed |
| 1120 | Q13 | SNACKS- | <code>ஸ்நாக்ஸ்</code> | No specific correction proposed |
| 1121 | Q14 | CREAM BIS | <code>கிரீம் பிஸ்கட்</code> | No specific correction proposed |
| 1122 | Q15 | OORIYO | <code>ஓரியோ</code> | No specific correction proposed |
| 1123 | Q16 | KRACK JACK | <code>கிராக் ஜேக்</code> | No specific correction proposed |
| 1124 | Q17 | HAPPYHAPPY | <code>கேப்பிகேப்பி</code> | No specific correction proposed |
| 1125 | Q18 | PARLE-G | <code>பார்லிஜி</code> | No specific correction proposed |
| 1126 | Q19 | HIDE&amp;SEEK | <code>ஸைட்&amp;சீக்</code> | Proposed correction |
| 1127 | Q20 | SUN FEAST [PKT] | <code>சன்பீஸ்ட்[pkt]</code> | No specific correction proposed |
| 1128 | Q21 | RASK | <code>ரஸ்க்</code> | No specific correction proposed |
| 1129 | Q22 | WOUNDER CAKE | <code>வன்டர்கேக்</code> | No specific correction proposed |
| 1130 | Q23 | JELLY | <code>ஜெல்லி</code> | No specific correction proposed |
| 1131 | Q24 | BREAD | <code>ப்ரெட்</code> | No specific correction proposed |
| 1132 | Q25 | PAPCORN | <code>பாப்கார்ன்</code> | No specific correction proposed |
| 1133 | Q26 | KARASAVU | <code>காரசேவு</code> | No specific correction proposed |
| 1134 | Q27 | RING MURUKKU | <code>ரிங்முருக்கு</code> | No specific correction proposed |
| 1135 | Q28 | MIXTURE 1KG | <code>மிக்சர்</code> | No specific correction proposed |
| 1136 | Q29 | LAYS | <code>Lays</code> | Owner confirmation |
| 1137 | Q30 | CHEETOS | <code>சீட்டோஸ்</code> | No specific correction proposed |
| 1138 | Q31 | VARU.PATTANI | <code>வறு.பட்டானி</code> | Proposed correction |
| 1139 | Q32 | SUDESI KADALAI | <code>சுதேசி.கடலை</code> | No specific correction proposed |
| 1140 | Q33 | SONPAPADI | <code>சோன் பப்டி</code> | No specific correction proposed |
| 1141 | Q34 | 10RS SNACKS | <code>10Rs ஸ்நாக்ஸ்</code> | No specific correction proposed |
| 1142 | Y01 | 5STAR | <code>5ஸ்டார்</code> | No specific correction proposed |
| 1143 | Y02 | DERI MILK | <code>டெரிமில்க்</code> | No specific correction proposed |
| 1144 | Y03 | KITKAT | <code>கிட்கேட்</code> | No specific correction proposed |
| 1145 | Y04 | JEMS | <code>ஜெம்ஸ்</code> | No specific correction proposed |
| 1146 | Y05 | KADALIURUNDAI | <code>கடலஉருண்டை</code> | Proposed correction |
| 1147 | Y06 | BLACK ALLU | <code>எள்ளூஉருண்ட</code> | Proposed correction |
| 1148 | Y07 | LACTO KING | <code>லேக்டோ கிங்</code> | No specific correction proposed |
| 1149 | Y08 | ECLAIRS 50PICS | <code>எக்லர்ஸ் 50PICS</code> | No specific correction proposed |
| 1150 | Y09 | NUTRINE ECLARS | <code>நியூ.எக்லர்ஸ்</code> | No specific correction proposed |
| 1151 | Y10 | CARAMILK | <code>கேராமில்க்</code> | No specific correction proposed |
| 1152 | Y11 | COFFEE BITE | <code>காபிஃபைட்</code> | No specific correction proposed |
| 1153 | Y12 | ORANGE CANDY | <code>ஆரஞ் கேன்டி</code> | No specific correction proposed |
| 1154 | Y13 | MILKY BAR | <code>மில்கி பார்</code> | No specific correction proposed |
| 1155 | Y14 | CAD.ECLAIRS | <code>கே.எக்லர்ஸ்</code> | No specific correction proposed |
| 1156 | Y15 | ALPENLIBE | <code>ஆல்பென்</code> | No specific correction proposed |
| 1157 | Y16 | MANGO BITE | <code>மேக்கோபைட்</code> | No specific correction proposed |
| 1158 | Z01 | SEEMAR | <code>சீமார்</code> | No specific correction proposed |
| 1159 | Z02 | CHAPPATI | <code>சப்பாத்தி</code> | No specific correction proposed |
| 1160 | Z03 | KOLAPODI COLUR | <code>கோலபொடி (கலர்)</code> | No specific correction proposed |
| 1161 | Z04 | INK BOTTLE | <code>இங்க் பாட்டில்</code> | No specific correction proposed |
| 1162 | Z05 | KOLAPODI WHITE | <code>கோலப்பொடி (வெள்)</code> | No specific correction proposed |
| 1163 | Z06 | FEVI QUICK | <code>பெவி குயிக்</code> | No specific correction proposed |
| 1164 | Z07 | BERIYANI BOX | <code>பிரியானி பாக்ஸ்</code> | Proposed correction |
| 1165 | Z08 | PLAYING CADRS | <code>சீட்டு கட்டு</code> | No specific correction proposed |
| 1166 | Z09 | PENCIL | <code>பென்சில்</code> | No specific correction proposed |
| 1167 | Z10 | PAPER ROLL | <code>பேப்பர் ரோல்</code> | No specific correction proposed |
| 1168 | Z11 | NEWS PAPER | <code>நியூஸ் பேப்பர்</code> | No specific correction proposed |
| 1169 | Z12 | WATER | <code>தண்ணீர்பாட்டல்</code> | No specific correction proposed |
| 1170 | Z13 | BATH BRUSH | <code>பாத் பிரஸ்</code> | Proposed correction |
| 1171 | Z14 | WASH BRUSH | <code>வாக்ஷ பிரஸ்</code> | Proposed correction |
| 1172 | Z15 | D S PODI | <code>D S பொடி</code> | No specific correction proposed |
| 1173 | Z16 | MALP | <code>மாப்</code> | No specific correction proposed |
| 1174 | Z17 | OTTDASTICK | <code>ஒட்டடகுச்சி</code> | No specific correction proposed |
| 1175 | Z19 | BAG | <code>துணி பை</code> | No specific correction proposed |
| 1176 | Z20 | STAPLAR PIN | <code>ஸ்டேப்லர் பின்</code> | No specific correction proposed |
| 1177 | Z21 | OLD BALANCE | <code>பேலன்ஸ்</code> | Owner confirmation |
| 1178 | R27 | RICE 25KG | <code>அரிசி 25kg</code> | No specific correction proposed |
| 1179 | R28 | RICE 75KG | <code>அரிசி 75kg</code> | No specific correction proposed |
| 1180 | B57 | NA.POWER PAPAYA | <code>நேச்.பவர்பப்பாளி</code> | No specific correction proposed |
| 1181 | O30 | CASTAR OIL 500ML | <code>வி.எண்ணை 500ml</code> | No specific correction proposed |
| 1182 | W73 | TIDE 2KG | <code>டைடு 2kg</code> | No specific correction proposed |
| 1183 | W74 | TIDE 4KG | <code>டைடு 4kg</code> | No specific correction proposed |
| 1184 | 761 | NIDO GRO.UP.MILK | <code>நீடோ.gro.up.milk</code> | No specific correction proposed |
| 1185 | S47 | H &amp; S4RSSAC | <code>ஸெட்.ஷோல்டர்4ரூ</code> | No specific correction proposed |
| 1186 | 469 | KUNKUMA POO | <code>குங்குமப்பூ</code> | No specific correction proposed |
| 1187 | Z22 | PAPER PLAT | <code>பேப்பர் பிளேட்</code> | No specific correction proposed |
| 1188 | B58 | POWERROSE | <code>பவர்ரோஸ்</code> | No specific correction proposed |
| 1189 | B59 | LIFE.CLEAR 75G | <code>லைபாய் கிளியர் 75g</code> | No specific correction proposed |
| 1190 | W75 | HENKOMATIC 1KG | <code>ஸென்கோ மேட்டிக் 1kg</code> | Proposed correction |
| 1191 | 154 | KULAMPU.M.PO | <code>குழம்பு.மிள.தூள்</code> | No specific correction proposed |
| 1192 | 358 | D.REDPOWDER 300G | <code>ரெட்டுத்பவுடர் 300g</code> | No specific correction proposed |
| 1193 | 649 | HOR(BOT)200G | <code>ஸார்(BOT) 200g</code> | Proposed correction |
| 1194 | B60 | LIFE.CLEAR 150G | <code>லைபாய் கிளியர் 150g</code> | No specific correction proposed |
| 1195 | S48 | TRESEMME(SCE) | <code>டிரஸ்சமி(sec)</code> | No specific correction proposed |
| 1196 | O59 | VVD 1LT(PKT) | <code>VVD 1lt (PKT)</code> | Owner confirmation |
| 1197 | S49 | SUNSILK BLACK200ML | <code>சன்சில்க் BLACK200ml</code> | No specific correction proposed |
| 1198 | S50 | SUNSILK 400ML | <code>சன்சில்க் 400ml</code> | No specific correction proposed |
| 1199 | P43 | Z POWDER 200G | <code>z பவுடர் 200g</code> | No specific correction proposed |
| 1200 | 650 | HORLICKS 1KG(JAR) | <code>ஸார்லிக்ஸ் 1kg (JAR)</code> | Proposed correction |
| 1201 | J09 | TOMTOSAUSE90GM(R) | <code>டொமடோசாஸ்90g(R)</code> | No specific correction proposed |
| 1202 | B61 | LIFEBOY HAND WASH PAC | <code>லைபாய் HAND WASH pac</code> | No specific correction proposed |
| 1203 | 840 | DETTOL HANDWASH | <code>டெட்டால் HANDWASH</code> | No specific correction proposed |
| 1204 | F31 | FAIR&amp;HANDSOME 30ML | <code>ஃபேர்&amp;ஸேன்சம் 30ml</code> | Proposed correction |
| 1205 | 651 | MOTHER.HOR(R)500G | <code>மதர் ஸார்லிக்ஸ்(R) 500g</code> | Proposed correction |
| 1206 | U21 | MTR.UPPMA | <code>MTR.உப்புமா</code> | No specific correction proposed |
| 1207 | 652 | MILKGOVA | <code>மில்க்கோவா</code> | No specific correction proposed |
| 1208 | T50 | A.V.T.COFFEE 100G | <code>A.V.T.காபித்தூள் 100g</code> | No specific correction proposed |
| 1209 | T51 | A.V.T.COFFEE 200G | <code>A.V.T.காபித்தூள் 200g</code> | No specific correction proposed |
| 1210 | 653 | BOOST 1KG (R) | <code>பூஸ்ட் 1kg (R)</code> | No specific correction proposed |
| 1211 | M88 | WHITE BEANS | <code>வெ.பீன்ஸ்</code> | No specific correction proposed |
| 1212 | O60 | CORDYA OIL | <code>கார்டி ஆயில்</code> | No specific correction proposed |
| 1213 | 654 | JU.HOR(CHOC)500G | <code>JU.ஸார்(choc)500g</code> | Proposed correction |
| 1214 | R29 | VILVAM 10KG | <code>வில்வம் 10kg</code> | No specific correction proposed |
| 1215 | 655 | HOR(LITE)(BOT)500G | <code>ஸார்.லைட் (BOT) 500g</code> | Proposed correction |
| 1216 | R30 | KOGINUR PASMATHI | <code>கோகினூர் பாஸ்மதி</code> | No specific correction proposed |
| 1217 | K28 | ASIRVADH 5KG | <code>ஆசிர்வாத் 5kg</code> | No specific correction proposed |
| 1218 | K29 | ASIRVATH 10KG | <code>ஆசிர்வாத் 10kg</code> | No specific correction proposed |
| 1219 | G101 | 3 ROSES 500G | <code>3 ரோஷஸ் 500g</code> | No specific correction proposed |
| 1220 | G102 | 3 ROSES 250G | <code>3 ரோஷஸ் 250g</code> | No specific correction proposed |
| 1221 | G103 | 3 ROSES 100G | <code>3 ரோஷஸ் 100g</code> | No specific correction proposed |
| 1222 | G104 | GREEN LABLE 500G | <code>கிரீன்லேபிள் 500g</code> | No specific correction proposed |
| 1223 | G105 | GREEN LABLE 200G | <code>கிரீன்லேபிள் 200g</code> | No specific correction proposed |
| 1224 | G106 | GREEN LABLE 100G | <code>கிரீன்லேபிள் 100g</code> | No specific correction proposed |
| 1225 | G107 | BRU 200GM | <code>ப்ரூ 200gm</code> | No specific correction proposed |
| 1226 | G108 | BRU 100GM JAR | <code>ப்ரூ 100gm ஜார்</code> | No specific correction proposed |
| 1227 | G109 | BRU 50GM | <code>ப்ரூ 50gm</code> | No specific correction proposed |
| 1228 | G110 | SUNRISE 200GM | <code>சன்ரைஸ் 200gm</code> | No specific correction proposed |
| 1229 | G111 | SUNRISE 50GM | <code>சன்ரைஸ் 50gm</code> | No specific correction proposed |
| 1230 | G112 | HORLICKS 1KG(BOT) | <code>ஸார்லிக்ஸ் 1kg (BOT)</code> | Proposed correction |
| 1231 | G113 | HORLICKS 1KG(R) | <code>ஸார்லிக்ஸ் 1kg(R)</code> | Proposed correction |
| 1232 | G114 | HORLICKS 500G(BOT) | <code>ஸார்லிக்ஸ் 500g(BOT)</code> | Proposed correction |
| 1233 | G115 | HORLICKS 500G(R) | <code>ஸார்லிக்ஸ் 500g(R)</code> | Proposed correction |
| 1234 | G116 | JU.HOR.500G(BOT) | <code>JU.ஸார்.500g(BOT)</code> | Proposed correction |
| 1235 | G117 | JU.HOR.500G(R) | <code>JU.ஸார்.500g(R)</code> | Proposed correction |
| 1236 | G118 | MALTOVA 500GM(R) | <code>மால்டோவா 500gm(R)</code> | No specific correction proposed |
| 1237 | G119 | BOOST 500GM(BOT) | <code>பூஸ்ட் 500gm(BOT)</code> | No specific correction proposed |
| 1238 | G120 | BOOST 500GM(R) | <code>பூஸ்ட் 500gm(R)</code> | No specific correction proposed |
| 1239 | G121 | BOOST 200GM(BOT) | <code>பூஸ்ட் 200gm(BOT)</code> | No specific correction proposed |
| 1240 | G122 | BOOST 200GM(R) | <code>பூஸ்ட் 200gm(R)</code> | No specific correction proposed |
| 1241 | G123 | BOOST STRIP | <code>பூஸ்ட் சரம்</code> | No specific correction proposed |
| 1242 | G124 | BOURVITA 500GM(R) | <code>போன்விட்டா 500gm(R)</code> | No specific correction proposed |
| 1243 | G125 | COMPLAN 500GM(R) | <code>காம்ப்ளான் 500gm(R)</code> | No specific correction proposed |
| 1244 | G126 | MOT.HOR.500GM(R) | <code>மதர்.ஸார்.500gm(R)</code> | Proposed correction |
| 1245 | G127 | VIVA 500GM(R) | <code>வீவா 500gm(R)</code> | No specific correction proposed |
| 1246 | G128 | DOMEX BLUE | <code>டோமெக்ஸ் ப்ளூ</code> | No specific correction proposed |
| 1247 | G129 | DALDA .1KG | <code>டால்டா .1kg</code> | No specific correction proposed |
| 1248 | G130 | DALDA 500ML | <code>டால்டா 500ml</code> | No specific correction proposed |
| 1249 | G131 | DALDA.200ML | <code>டால்டா.200ml</code> | No specific correction proposed |
| 1250 | G132 | DALDA .100ML | <code>டால்டா .100ml</code> | No specific correction proposed |
| 1251 | G133 | MTR.SEMIYA.1KG | <code>MTR.சேமியா.1kg</code> | No specific correction proposed |
| 1252 | G134 | MTR.SEMIYA.500G | <code>MTR.சேமியா.500g</code> | No specific correction proposed |
| 1253 | G135 | MTR.SEMIYA.200GM | <code>MTR.சேமியா.200gm</code> | No specific correction proposed |
| 1254 | G136 | SANKU SEMIYA 500G | <code>சங்கு சேமியா 500g</code> | No specific correction proposed |
| 1255 | G137 | SANKU SEMIYA 200G | <code>சங்கு சேமியா 200g</code> | No specific correction proposed |
| 1256 | G138 | ANNA.WH.FLOUR 1KG | <code>அன்ன.கோ.மாவு 1kg</code> | No specific correction proposed |
| 1257 | G139 | ASIRVATH .10KG | <code>ஆசிர்வாத் .10kg</code> | No specific correction proposed |
| 1258 | G140 | ASIRVATH .5KG | <code>ஆசிர்வாத் .5kg</code> | No specific correction proposed |
| 1259 | G141 | ASIRVATH .1KG | <code>ஆசிர்வாத் .1kg</code> | No specific correction proposed |
| 1260 | G142 | PILSBURY 10KG | <code>பில்ஸ்பரி 10kg</code> | No specific correction proposed |
| 1261 | G143 | PILSBURY 5KG | <code>பில்ஸ்பரி 5kg</code> | No specific correction proposed |
| 1262 | G144 | PILSBURY 1KG | <code>பில்ஸ்பரி 1kg</code> | No specific correction proposed |
| 1263 | Q35 | 15RS.MARIE GOLD | <code>15Rs.மேரிகோல்டு</code> | No specific correction proposed |
| 1264 | B62 | PEARS JUNIOR | <code>பியர்ஸ் (Junior)</code> | No specific correction proposed |
| 1265 | 762 | CEREMEAL | <code>செரீமீல்</code> | No specific correction proposed |
| 1266 | A19 | OMA WATER | <code>ஓமத்திரவம்</code> | No specific correction proposed |
| 1267 | G338 | SAKTHIMAN(I.20) | <code>சக்திமான்(I.20)</code> | No specific correction proposed |
| 1268 | G305 | ANNA MALAI | <code>அண்ணாமலை</code> | No specific correction proposed |
| 1269 | G306 | 12.50 RICE | <code>12.50 அரிசி</code> | No specific correction proposed |
| 1270 | G307 | KARUDA BLUE | <code>கருடா புளூ</code> | No specific correction proposed |
| 1271 | G308 | THANGA KALASAM | <code>தங்க கலசம்</code> | No specific correction proposed |
| 1272 | G309 | TAJ MAHAL | <code>தாஜ்மஸால்</code> | Proposed correction |
| 1273 | G310 | RAM BRAND | <code>ராம் பிராண்டு</code> | No specific correction proposed |
| 1274 | G311 | PANNEER ROJA | <code>பன்னீர் ரோஜா</code> | No specific correction proposed |
| 1275 | G312 | SSRI SAKKARAM | <code>ஸ்ரீசக்கரம்</code> | No specific correction proposed |
| 1276 | G313 | VENPURA | <code>வெண்புறா</code> | No specific correction proposed |
| 1277 | G314 | SUN BRAND | <code>சன் பிராண்டு</code> | No specific correction proposed |
| 1278 | G315 | THULASI | <code>துளசி</code> | No specific correction proposed |
| 1279 | G316 | 14RS.IDLY RICE | <code>14Rs.இட்லி அரிசி</code> | No specific correction proposed |
| 1280 | G317 | KAVERI | <code>காவேரி</code> | No specific correction proposed |
| 1281 | G318 | ANNA LAKSHMI | <code>அன்ன லட்சுமி</code> | No specific correction proposed |
| 1282 | G319 | 10 LAT | <code>10 லாட்</code> | No specific correction proposed |
| 1283 | G320 | S.S.K | <code>S.S.K</code> | Owner confirmation |
| 1284 | G321 | 11RS.KURUNAI | <code>11ரூ குருனை</code> | No specific correction proposed |
| 1285 | G322 | 14RS KURUNAI | <code>14ரூ குருனை</code> | No specific correction proposed |
| 1286 | G301 | SS.KANKAYAM (OLD) | <code>SS.காங்கயம் (பழையது)</code> | No specific correction proposed |
| 1287 | G302 | SS.KALAMPUR(OLD) | <code>SS.களம்பூர்(பழையது)</code> | No specific correction proposed |
| 1288 | G303 | SS.KALAMPUR(MEDIUM) | <code>SS.களம்பூர்(மீடியம்)</code> | No specific correction proposed |
| 1289 | G323 | AM.IDLY(M) | <code>AM.இட்லி</code> | No specific correction proposed |
| 1290 | G324 | UDAYAM | <code>உதயம்</code> | No specific correction proposed |
| 1291 | G325 | KRISHNA RICE | <code>கிருக்ஷணா அரிசி</code> | Proposed correction |
| 1292 | G326 | AMK.IDLY | <code>AMK.இட்லி</code> | No specific correction proposed |
| 1293 | G327 | MANMARK | <code>மான் மார்க்</code> | No specific correction proposed |
| 1294 | G328 | CHAKRAVARTHI | <code>சக்கரவர்த்தி</code> | No specific correction proposed |
| 1295 | G329 | MAHARAJA | <code>மஸாராஜா</code> | Proposed correction |
| 1296 | G330 | SAKTHIMAN(PONNI) | <code>சக்திமான்(பொன்னி)</code> | No specific correction proposed |
| 1297 | G332 | B.T.RAW RICE(OLD)50KG | <code>B.T.ப.அரிசி(பழையது)50kg</code> | No specific correction proposed |
| 1298 | G333 | B.T.RAW RICE(NEW)50KG | <code>B.T.ப.அரிசி(புதியது)50kg</code> | No specific correction proposed |
| 1299 | G331 | SS.KALAMPUR KURUNAI | <code>SS.களம்பூர்குருணை</code> | No specific correction proposed |
| 1300 | G334 | 14RS.RAAW RICE 50KG | <code>14Rs.பச்சரிசி 50kg</code> | No specific correction proposed |
| 1301 | G335 | 34RS BRI.RICE 50KG | <code>34Rs பிரி.அரிசி 50kg</code> | No specific correction proposed |
| 1302 | G336 | THIRATSI B.RICE 50KG | <code>திராட்சைபி.அரிசி50kg</code> | No specific correction proposed |
| 1303 | G337 | HALF BOIL 50KG | <code>ஸாஃபாயில் 50kg</code> | No specific correction proposed |
| 1304 | G201 | SS.KANGAYAM(OLD) | <code>SS.காங்கயம்(பழையது)</code> | No specific correction proposed |
| 1305 | G202 | SS.KANKAYAM(MEDIUM) | <code>SS.காங்கயம்(மீடியம்)</code> | No specific correction proposed |
| 1306 | G203 | SS.KALAMMPUR(OLD) | <code>SS.களம்பூர்(பழையது)</code> | No specific correction proposed |
| 1307 | G204 | SS.KALAMMPUR(MEDIUM) | <code>SS.களம்பூர்(மீடியம்)</code> | No specific correction proposed |
| 1308 | G211 | CHAKKARAVARTHI | <code>சக்கரவர்த்தி</code> | No specific correction proposed |
| 1309 | G212 | VENPURAA | <code>வெண்புறா</code> | No specific correction proposed |
| 1310 | G213 | VILLVAM | <code>வில்வம்</code> | No specific correction proposed |
| 1311 | G214 | KRISHNA | <code>கிருக்ஷணா</code> | Proposed correction |
| 1312 | G215 | TIGER IDILY | <code>டைகர் இட்லி</code> | No specific correction proposed |
| 1313 | G216 | AMK IDLY | <code>AMK.இட்லி</code> | No specific correction proposed |
| 1314 | G217 | PENGUIN | <code>பென்குயின்</code> | No specific correction proposed |
| 1315 | G218 | MAHAARAJA | <code>மஸாராஜா</code> | Proposed correction |
| 1316 | G219 | MALAR | <code>மலர்</code> | No specific correction proposed |
| 1317 | G220 | BEST ROSE | <code>பெஸ்ட் ரோஸ்</code> | No specific correction proposed |
| 1318 | G221 | KANNAN KATHIR | <code>கண்ணன் கதிர்</code> | No specific correction proposed |
| 1319 | G222 | TAJMAHAL | <code>தாஜ்மஸால்</code> | Proposed correction |
| 1320 | G223 | SAKTIMAN | <code>சக்திமான்</code> | No specific correction proposed |
| 1321 | G224 | IDLY 10KG | <code>இட்லி 10kg</code> | No specific correction proposed |
| 1322 | G225 | B.T.RICE(OLD)25KG | <code>B.T.ப.அரிசி(பழையது)25kg</code> | No specific correction proposed |
| 1323 | G205 | KATHIR  ROYAL 25KG | <code>கதீர் ராயல்</code> | No specific correction proposed |
| 1324 | G206 | TANGAGRRDAM 25KG | <code>தங்க கிரீடம் 25kg</code> | No specific correction proposed |
| 1325 | G207 | 9 STAR PONNI | <code>9 ஸ்டார் பொன்னி</code> | No specific correction proposed |
| 1326 | G208 | SRI SAKKARAM | <code>ஸ்ரீசக்கரம்</code> | No specific correction proposed |
| 1327 | G209 | THALAPATHI | <code>தளபதி</code> | No specific correction proposed |
| 1328 | G210 | 10KG VILVAM | <code>10Kg வில்வம்</code> | No specific correction proposed |
| 1329 | G304 | SS.KANGAYAM(MEDIUM) | <code>SS.காங்கயம்(மீடியம்)</code> | No specific correction proposed |
| 1330 | G339 | KAMADENU | <code>காமதேனு</code> | No specific correction proposed |
| 1331 | G340 | R.R.G | <code>R.R.G</code> | Owner confirmation |
| 1332 | G341 | DURAIYUR BRIYANI | <code>துறையூர் பிரியாணி</code> | No specific correction proposed |
| 1333 | G226 | PANNEER ROSE | <code>பன்னீர் ரோஜா</code> | No specific correction proposed |
| 1334 | G227 | JAIHIND | <code>ஜெய்ஸிந்த்</code> | Proposed correction |
| 1335 | 956 | TEX(S) | <code>டெக்ஸ்(S)</code> | No specific correction proposed |
| 1336 | 957 | TEX(B) | <code>டெக்ஸ்(B)</code> | No specific correction proposed |
| 1337 | M89 | DOOR DAL(JAYAM) | <code>து.பருப்பு(ஜெயம்)</code> | No specific correction proposed |
| 1338 | B63 | MANJAL SOAP | <code>மஞ்சள் சோப்</code> | No specific correction proposed |
| 1339 | R31 | IDLY RICE(MUTAI) | <code>இட்லி அரிசி(மூடை)</code> | No specific correction proposed |
| 1340 | 763 | PEDIYA SURE(COM) | <code>பிடியாசூர்(கம்ளீட்)</code> | No specific correction proposed |
| 1341 | W76 | UJALASTIPESHINE100ML | <code>உஜாலா ஸ்டிப்&amp;சைன்100ml</code> | No specific correction proposed |
| 1342 | T52 | 3ROSES(NAT)100G | <code>3ரோஸ்(நேச்ரல்)100g</code> | No specific correction proposed |
| 1343 | T53 | 3ROSES(NAT)250G | <code>3ரோஸ்(நேச்ரல்)250g</code> | No specific correction proposed |
| 1344 | 516 | EVERYDAY 500G | <code>எவரிடே 500g</code> | No specific correction proposed |
| 1345 | 657 | BOUNVITA 1KG | <code>போன்விட்டா 1kg</code> | No specific correction proposed |
| 1346 | T54 | AVTCOFFE50GM | <code>ஏ வி டிகாப்பி50gm</code> | No specific correction proposed |
| 1347 | T55 | ALIVE 200G | <code>அலைவ் கா.தூள்200g</code> | No specific correction proposed |
| 1348 | T56 | ALIVE 500G | <code>அலைவ் கா.தூள்500g</code> | No specific correction proposed |
| 1349 | 359 | COL.SENSITIVE100G | <code>கோல்.சென்சிடிவ்100g</code> | No specific correction proposed |
| 1350 | 658 | JU.HOR.200G | <code>JU.ஸார்.200g</code> | Proposed correction |
| 1351 | 339 | P.P.(WHIT)50G | <code>பெப்சோ ஒயிட்னிங்50g</code> | No specific correction proposed |
| 1352 | T57 | K.DEVAN 500G | <code>கண்ணன்தேவன் 500g</code> | No specific correction proposed |
| 1353 | 764 | NES.VEG | <code>நெஸ்டம்வெஜ்</code> | No specific correction proposed |
| 1354 | G228 | GARUDA GREEN | <code>கருடா பச்சை</code> | No specific correction proposed |
| 1355 | G229 | GARUDA BLUE | <code>கருடா புளூ</code> | No specific correction proposed |
| 1356 | G230 | AM.IDLY | <code>AM இட்லி</code> | No specific correction proposed |
| 1357 | 659 | RAMANA HELTH MIX | <code>ரமணா ஸெல்த் மிக்ஸ்</code> | Proposed correction |
| 1358 | 660 | RAMANA THANIYAM | <code>ரமணா தானியம்</code> | No specific correction proposed |
| 1359 | 765 | FAREX (MIX-FRU) | <code>பேரெக்ஸ்(மிக்ஸ்ஃப்ரூட்)</code> | No specific correction proposed |
| 1360 | G342 | KARUDA GREEN | <code>கருடா பச்சை</code> | No specific correction proposed |
| 1361 | G343 | 20 LAT | <code>20 லாட்</code> | No specific correction proposed |
| 1362 | G145 | SEVARAT SEMIYA 1KG | <code>சேவரட் சேமியா 1kg</code> | No specific correction proposed |
| 1363 | G146 | SEVARAT SEMIYA 500G | <code>சேவரட் சேமியா 500g</code> | No specific correction proposed |
| 1364 | G147 | SEVARAT SEMIYA 200G | <code>சேவரட் சேமியா 200g</code> | No specific correction proposed |
| 1365 | G148 | ASAI NOODLES | <code>ஆசை நூடில்ஸ்</code> | No specific correction proposed |
| 1366 | G149 | 3ROSES NAT 250G | <code>3ரோஷஸ்நேச்சுரல் 250g</code> | No specific correction proposed |
| 1367 | G150 | 3ROSES NAT 100G | <code>3ரோஷஸ்நேச்சுரல்100g</code> | No specific correction proposed |
| 1368 | G151 | WHITE PHYNOIL | <code>வெ.பினாயில்</code> | No specific correction proposed |
| 1369 | G152 | HARPIC(B) | <code>ஸார்பிக்(B)</code> | Proposed correction |
| 1370 | G153 | HARPIC(S) | <code>ஸார்பிக்(S)</code> | Proposed correction |
| 1371 | G154 | HOR.CHO(R)500G | <code>ஸார்.சாக் (R) 500g</code> | Proposed correction |
| 1372 | G155 | HOR.VEN(R)500G | <code>ஸார்.வெண்(R)500g</code> | Proposed correction |
| 1373 | G231 | PONMAYIL | <code>பொன்மயில்</code> | No specific correction proposed |
| 1374 | G232 | SS.KALAMPUR KURNAI.25KG | <code>SS.களம்பூர்குருனை 25kg</code> | No specific correction proposed |
| 1375 | G233 | VIRAKIRIDAM | <code>வைரகிரீடம்</code> | No specific correction proposed |
| 1376 | G344 | PONNMAYIL | <code>பொன்மயில்</code> | No specific correction proposed |
| 1377 | G234 | 34BRIYANI RICE 25KG | <code>34பிரியாணிஅரிசி25kg</code> | No specific correction proposed |
| 1378 | G156 | ARRASAN(B) | <code>அரசன் (B)</code> | No specific correction proposed |
| 1379 | G157 | ARRASAN(S) | <code>அரசன் (S)</code> | No specific correction proposed |
| 1380 | G158 | GANAPPATHY TIN | <code>கணபதி டின்</code> | No specific correction proposed |
| 1381 | G159 | GANAPATHY PKT | <code>கணபதி பாக்கெட்</code> | No specific correction proposed |
| 1382 | G160 | IDDAYAM 1LT | <code>இதயம் 1lt</code> | No specific correction proposed |
| 1383 | G161 | IDDAYAM 500 | <code>இதயம் 500</code> | No specific correction proposed |
| 1384 | G162 | IDDAYAM 200 | <code>இதயம் 200</code> | No specific correction proposed |
| 1385 | G163 | ZIM.GIN.OIL 1LT | <code>சிம்.நல்லெண்ணை 1lt</code> | No specific correction proposed |
| 1386 | G164 | ZIM.GIN.OIL 500 | <code>சிம்.நல்லெண்ணை500</code> | No specific correction proposed |
| 1387 | G165 | A.R.C CO.OIL 1LT | <code>A.R.C.தே.எண் 1lt</code> | No specific correction proposed |
| 1388 | G166 | A.R.C.CO.OIL500 | <code>A.R.C.தே.எண்500</code> | No specific correction proposed |
| 1389 | G167 | A.V.M.CO.OIL 1LT | <code>A.V.M.தே.எண் 1lt</code> | No specific correction proposed |
| 1390 | G168 | A.V.M.CO.OIL500 | <code>A.V.M.தே.எண்500</code> | No specific correction proposed |
| 1391 | G169 | GEMINI OIL | <code>ஜெமினி ஆயில்</code> | No specific correction proposed |
| 1392 | G170 | SUNDROP | <code>சன்ட்ராப்</code> | No specific correction proposed |
| 1393 | G171 | TAJMAHAL TEA500 | <code>தாஜ்மஸால் டீ 500</code> | Proposed correction |
| 1394 | G172 | BAMBINO 200G | <code>பாமினோ சேமியா 200</code> | No specific correction proposed |
| 1395 | G173 | BAMBINO 1KG | <code>பாமினோ சேமியா 1kg</code> | No specific correction proposed |
| 1396 | G174 | POPULAR(S) | <code>பாப்புலர்(S)</code> | No specific correction proposed |
| 1397 | G175 | POPULAR(B) | <code>பாப்புலர்(B)</code> | No specific correction proposed |
| 1398 | G235 | SPIDERMEN | <code>ஸ்பைடர்மேன்</code> | No specific correction proposed |
| 1399 | G176 | MTR.JAMOON | <code>MTR.ஜாமூன்</code> | No specific correction proposed |
| 1400 | G177 | POORNA OIL | <code>பூர்ணா ஆயில்</code> | No specific correction proposed |
| 1401 | G178 | COMPLAN 200 | <code>காம்ளான் 200</code> | No specific correction proposed |
| 1402 | Y17 | CHOCLATE | <code>மிட்டாய்</code> | No specific correction proposed |
| 1403 | Z23 | PICK UP | <code>கேரிபேக்(BIG)</code> | No specific correction proposed |
| 1404 | G179 | ORKEY JAMOO | <code>Orkey ஜாமூன்</code> | No specific correction proposed |
| 1405 | G180 | MANTHRA G.OIL | <code>க.எண்ணை(pkt)</code> | No specific correction proposed |
| 1406 | G181 | TOM.SEMIYA | <code>தக்காளி சேமியா</code> | No specific correction proposed |
| 1407 | G182 | KAM.SEMIYA | <code>கம்பு சேமியா</code> | No specific correction proposed |
| 1408 | G183 | WHEET SEMIYA | <code>கோதுமை சேமியா</code> | No specific correction proposed |
| 1409 | G184 | RAGI SEMIYA | <code>ராகி சேமியா</code> | No specific correction proposed |
| 1410 | G185 | SASTHA 1LT | <code>சாஸ்தா ந.எண் 1lt</code> | No specific correction proposed |
| 1411 | G186 | SASTHA 500LT | <code>சாஸ்தா ந.எண் 500</code> | Owner confirmation |
| 1412 | G187 | GEMINI 5LT CAN | <code>ஜெமினி5ltகேன்</code> | No specific correction proposed |
| 1413 | G236 | PONMALAR | <code>பொன்மலர்</code> | No specific correction proposed |
| 1414 | G237 | THANGA GUTHIRAI | <code>தங்க குதிரை</code> | No specific correction proposed |
| 1415 | G188 | MADHURAM 1LT | <code>மதுரம் 1lt</code> | No specific correction proposed |
| 1416 | G189 | MADHURAM 500LT | <code>மதுரம் 500lt</code> | Owner confirmation |
| 1417 | G190 | BLACK PHYNOIL | <code>கருப்பு பினாயில்</code> | No specific correction proposed |
| 1418 | G345 | KARPAGA VINAYAGAR | <code>கற்பக வினாயகர்</code> | No specific correction proposed |
| 1419 | G238 | KARPAGA VINAYAGA | <code>கற்பக வினாயகர்</code> | No specific correction proposed |
| 1420 | G191 | BAMBINO 500G | <code>பாமினோ 500g</code> | No specific correction proposed |
| 1421 | G239 | GOLD COIN | <code>கோல்டுகாயின்</code> | No specific correction proposed |
| 1422 | G346 | KRISNA DELUX | <code>கிருக்ஷணா டீலக்ஸ்</code> | Proposed correction |
| 1423 | G347 | GOLDCOIN | <code>கோல்டுகாயின்</code> | No specific correction proposed |
| 1424 | G348 | THAMARAI | <code>தாமரை</code> | No specific correction proposed |
| 1425 | G349 | KANAN KATHIR | <code>கண்ணன்கதிர்</code> | No specific correction proposed |
| 1426 | G350 | B.R.M | <code>B.R.M</code> | Owner confirmation |
| 1427 | G240 | SRIVELAN | <code>ஸ்ரீவேலன்</code> | No specific correction proposed |
| 1428 | G241 | YANAI MARK | <code>யானைமார்க்</code> | No specific correction proposed |
| 1429 | G242 | BRM | <code>B.R.M</code> | Owner confirmation |
| 1430 | G192 | FORTUNE OIL | <code>ஃபார்சூன் ஆயில்</code> | No specific correction proposed |
| 1431 | G351 | PUMPUGAR KUR | <code>பூம்புகார்குருணை</code> | No specific correction proposed |
| 1432 | G352 | SRIVASAKI | <code>ஸ்ரீவாசகி</code> | Owner confirmation |
| 1433 | G243 | PUMPUGAR GURURNAI | <code>பூம்புகார்குருணை</code> | No specific correction proposed |
| 1434 | G244 | KRISHNADELUX PONNI | <code>கிருஸ்னாடீலக்ஸ்பொன்னி</code> | Proposed correction |
| 1435 | G353 | KAR.VINA.IR20 | <code>கற்பகவினாயகர்IR20</code> | No specific correction proposed |
| 1436 | G245 | AM.SPCIAL | <code>AM.ஸ்பெசல்</code> | No specific correction proposed |
| 1437 | G246 | RAM | <code>ராம்</code> | No specific correction proposed |
| 1438 | G354 | AM.SPL | <code>AM.ஸ்பெசல்</code> | No specific correction proposed |
| 1439 | G193 | TAJMAHAL250G | <code>தாஜ்மஸால் 250g</code> | Proposed correction |
| 1440 | H46 | GARNIER DYE | <code>கார்னியர் டை</code> | No specific correction proposed |
| 1441 | 361 | COLGATE SALT 50G | <code>கோல்கேட் சால்ட் 50g</code> | No specific correction proposed |
| 1442 | 362 | COLGATE SALT 100G | <code>கோல்கேட் சால்ட் 100g</code> | No specific correction proposed |
| 1443 | 363 | COLGATE SALT 200G | <code>கோல்கேட் சால்ட் 200g</code> | No specific correction proposed |
| 1444 | 233 | MAGGI RICE 100G | <code>மேகி ரைஸ் 100g</code> | No specific correction proposed |
| 1445 | 234 | MAGGI RICE 400G | <code>மேகி ரைஸ் 400g</code> | No specific correction proposed |
| 1446 | C15 | VIM LIG 250ML | <code>விம் லிக்யூடு 250ml</code> | No specific correction proposed |
| 1447 | C16 | VIM LIG(R) | <code>விம் லிக்யூடு(R)</code> | No specific correction proposed |
| 1448 | 365 | HIMALYA50GM | <code>ஸிமாலயா50gm</code> | Proposed correction |
| 1449 | A03 | APPALAM 200GM | <code>அப்பளம் 200gm</code> | No specific correction proposed |
| 1450 | H25 | PARA.JAS.100(BOT) | <code>பாராசூட்(JAS)100(BOT)</code> | No specific correction proposed |
| 1451 | 366 | COLGATEMAX150G | <code>கோல்கேட்மேக்ஸ்150g</code> | No specific correction proposed |
| 1452 | 367 | DABARREDPASTE50G | <code>டாபர்ரெட்பேஸ்ட்50g</code> | No specific correction proposed |
| 1453 | 368 | DABARREDPASTE100G | <code>டாபர்ரெட்பேஸ்ட்100g</code> | No specific correction proposed |
| 1454 | A06 | SAKTHI PICKLE(G),(GR) | <code>சக்திஊறுகய்(Ge),(Gr)</code> | Proposed correction |
| 1455 | 936 | EASY BANK(S) | <code>ஈஷிபேங்க்(S)</code> | Owner confirmation |
| 1456 | W37 | VANISH(SAC) | <code>வேனிஸ்(Sac)</code> | No specific correction proposed |
| 1457 | 959 | ROOM SPRAY | <code>ரூம்ஸ்ப்ரே</code> | No specific correction proposed |
| 1458 | 155 | MTR PULIYOTHARAI | <code>MTR புளியோதரை</code> | No specific correction proposed |
| 1459 | 156 | KASMIR CHIILY100G | <code>காக்ஷமீர்சில்லி100g</code> | Proposed correction |
| 1460 | 369 | DABAR RED 200GM | <code>டாபர்ரெட்200gm</code> | No specific correction proposed |
| 1461 | 370 | MESWAK 100GM | <code>மிஸ்வாக் 100gm</code> | No specific correction proposed |
| 1462 | 371 | BABULE PASTE 1+1 | <code>பபுல்பேஸ்ட்1+1 offer</code> | No specific correction proposed |
| 1463 | B64 | FIAMA100G | <code>பியாமா100g</code> | No specific correction proposed |
| 1464 | B65 | LUXBLACK75G | <code>லக்ஸ்(கருப்பு)75g</code> | No specific correction proposed |
| 1465 | B66 | DOVEGREEN100G | <code>டவ்(க்ரீன்)100g</code> | No specific correction proposed |
| 1466 | S51 | FIAMASHAMPOO100ML | <code>பியாமா ஷாம்பு 100ml</code> | No specific correction proposed |
| 1467 | W77 | UJALALIQUEDWASHING800ML | <code>உஜாலாலிக்யூடுவாசிங்800ml</code> | No specific correction proposed |
| 1468 | 841 | VEETHAIRRMV | <code>வீட்ஸேர்Rmv</code> | Proposed correction |
| 1469 | C17 | VIMLIQED 500ML | <code>விம்லிக்யூடு 500ml</code> | No specific correction proposed |
| 1470 | C18 | VIMLIQED 750ML | <code>விம்லிக்யூடு 750ml</code> | No specific correction proposed |
| 1471 | C19 | VIMLIQED(R)150ML | <code>விம்லிக்யூடு(R)150ml</code> | No specific correction proposed |
| 1472 | W78 | RINMATICE1KG | <code>ரின்மேட்டிக்1kg</code> | No specific correction proposed |
| 1473 | 661 | COMPLANBADAM400G | <code>காம்ப்ளான்பாதாம்400g</code> | No specific correction proposed |
| 1474 | 662 | COMPLANBADAM200G | <code>காம்ப்ளான்பாதாம்200g</code> | No specific correction proposed |
| 1475 | S53 | DOVESHM100ML | <code>டவ்ஷாம்பு100ml</code> | No specific correction proposed |
| 1476 | S54 | 3ROSESTEA 10RS | <code>3ரோஸ்டீ 10ரூ</code> | No specific correction proposed |
| 1477 | U22 | MTRBADAMDRINK200G | <code>MTRபாதாம்ட்ரிங்200g</code> | No specific correction proposed |
| 1478 | TP | THUVARAM PARUPPU | <code>துவரம் பருப்பு</code> | No specific correction proposed |
| 1479 | 500 | GRP 500ML | <code>GRP 500ML</code> | Owner confirmation |
| 1480 | 767 | JJ BABY SOAP 100G | <code>JJ பேபி சோப் 100கி</code> | No specific correction proposed |
| 1481 | Z24 | M.R.S | <code>M.R.S</code> | Owner confirmation |
| 1482 | Z26 | NO 10 BEEDI | <code>நெ 10 பீடி</code> | No specific correction proposed |
| 1483 | Z27 | GOLDFILTER | <code>GOLDFILTER</code> | Owner confirmation |
| 1484 | Z28 | GOLD KING | <code>GOLD KING</code> | Owner confirmation |
| 1485 | Z29 | SCISS FILTER | <code>SCISS FILTER</code> | Owner confirmation |
| 1486 | Z30 | NAPTHELEEN | <code>பூச்சு உருண்</code> | No specific correction proposed |
| 1487 | Z31 | COM | <code>சீப்பு</code> | No specific correction proposed |
| 1488 | M42 | VINIGER | <code>வினிகர்</code> | No specific correction proposed |
| 1489 | Z32 | ROPE | <code>கயிறு</code> | No specific correction proposed |
| 1490 | Z33 | CAT | <code>பூனை</code> | No specific correction proposed |
| 1491 | 101 | TURMERIC POWDER 50G | <code>மஞ்.தூள் 50gm</code> | No specific correction proposed |
| 1492 | Z34 | KUDAL | <code>குடல்</code> | No specific correction proposed |
| 1493 | O001 | GEM GOLD 1 LIT | <code>ஜெம் கோல்டு 1Lit</code> | No specific correction proposed |
| 1494 | O002 | T.V.S.GROW.OIL | <code>டி.வி.க்ஷ. க.எண்.1லிட்</code> | Proposed correction |
| 1495 | M.77 | T.T 50G POWDER | <code>T.T.தூள் 50gm</code> | No specific correction proposed |
| 1496 | M.78 | T.T. KADDI    50GM | <code>T.T. கட்டி   50gm</code> | No specific correction proposed |
| 1497 | M.79 | T.T. POWDER    100GM | <code>T.T. தூள்   100gm</code> | No specific correction proposed |
| 1498 | M.80 | T.T.  KATTI   100GM | <code>T.T. கட்டி 100GM</code> | No specific correction proposed |
| 1499 | M.81 | T.T. POWDER 20GM | <code>T.T தூள் 20GM</code> | No specific correction proposed |
| 1500 | M.82 | T.T.KADDI 15GM | <code>T.T.கட்டி 15gm</code> | No specific correction proposed |
| 1501 | M00 | TATA SALT | <code>டாட்டா சால்ட்</code> | No specific correction proposed |
| 1502 | G355 | GILLET  PLATINUM | <code>ஜில்லட்  பிளாடினம்</code> | No specific correction proposed |
| 1503 | G356 | GILLET  7'OCLOCK | <code>ஜில்லட் 7'0 கிளாக்</code> | No specific correction proposed |
| 1504 | G357 | GILLET  VECT. REZR. | <code>ஜில்லட் விக்ட்டர்  ரேசர்</code> | No specific correction proposed |
| 1505 | G358 | GILLET  VECT.  2''S | <code>ஜில்லட்  விக்டர்  2''s</code> | No specific correction proposed |
| 1506 | G359 | GILLET  VECT.  4''S | <code>ஜில்லட்  விக்டர்  4''s</code> | No specific correction proposed |
| 1507 | G360 | GILLET  VECT.  6' S | <code>ஜில்லட்  விக்டர்  6''s</code> | No specific correction proposed |
| 1508 | G361 | GILLET   READY  SHAVE | <code>ஜில்லட் ரெடி  சேவ்</code> | No specific correction proposed |
| 1509 | G362 | GILLET 7''OCLOCK READY SHAVE | <code>ஜில்லட் 7''0கிளாக் ரெடி சேவ்</code> | No specific correction proposed |
| 1510 | G363 | GILLET  =MACH3 RAZR. | <code>ஜில்லட்  மேக்3 ரேசர்</code> | No specific correction proposed |
| 1511 | G364 | GILLET TE  =MACH3 BLEADE | <code>ஜில்லட்  மேக்3  பிளேடு</code> | No specific correction proposed |
| 1512 | G365 | GALLANT II  RAZR. | <code>கேலண்ட்  11 ரேசர்</code> | No specific correction proposed |
| 1513 | G366 | GALLANT  II  BLEADE | <code>கேலண்டு II  பிளேடு</code> | No specific correction proposed |
| 1514 | G367 | SHAVING  RAZR... | <code>சேவிங்  ரேசர்..</code> | No specific correction proposed |
| 1515 | G368 | WILKINSON  BLEADE | <code>வில்கின்சன்  பிளேடு</code> | No specific correction proposed |
| 1516 | G369 | S.MAX  BLEADE | <code>சூப்பர்மேக்ஸ் பிளேடு</code> | No specific correction proposed |
| 1517 | G370 | S.MAX READY SHAVE | <code>சூ.மேக்ஸ் ரெடி சேவ்</code> | No specific correction proposed |
| 1518 | G371 | S.MAX  2'' REZR. | <code>சூ.மேக்ஸ்  2'' ரேசர்</code> | No specific correction proposed |
| 1519 | G372 | S.MAX  2'' BLEADE | <code>சூ.மேக்ஸ் 2'' பிளேடு</code> | No specific correction proposed |
| 1520 | G373 | S.MAX  3'' REZR. | <code>சூ.மேக்ஸ்  3'' ரேசர்</code> | No specific correction proposed |
| 1521 | G374 | S.MAX  3'' BLEADE | <code>சூ.மேக்ஸ்  3'' பிளேடு</code> | No specific correction proposed |
| 1522 | G375 | GILLET  SHAVE  GEL | <code>ஜில்லட் சேவ் ஜெல்</code> | No specific correction proposed |
| 1523 | G376 | GILLETGARDBLEDE | <code>ஜில்லட்காடுபிளேடு</code> | No specific correction proposed |
| 1524 | G377 | PALMOLIVE SHA. CREAM | <code>பால்மாலிவ் சேவிங் கிரீம்</code> | No specific correction proposed |
| 1525 | G378 | GODREJ SHAVING CREAM | <code>கோட்ரேஜ் சேவிங் கிரீம்</code> | No specific correction proposed |
| 1526 | G379 | AXE SHAVING CREAM | <code>ஆக்ஸ் சேவிங் கிரீம்</code> | No specific correction proposed |
| 1527 | G380 | OLD SPICE SHAVING CREAM | <code>ஓல்டு ஸ்பேஸ் சேவிங் கிரீம்</code> | No specific correction proposed |
| 1528 | G381 | SALOON  SHAVING CREAM | <code>சலூன் சேவிங் கிரீம்</code> | No specific correction proposed |
| 1529 | Z35 | KOTTA VATTTAL | <code>கொத்தவரை</code> | No specific correction proposed |
| 1530 | M.83 | SALT (SPL) | <code>கல்உப்பு(SPL)</code> | No specific correction proposed |
| 1531 | Z36 | TISUE PAPPER | <code>டிஸ் பேப்பர்</code> | No specific correction proposed |
| 1532 | O08 | POORNA OIL 1LIT | <code>பூர்ணாஆயில் 1லி</code> | No specific correction proposed |
| 1533 | O003 | A.R.C COCANET OIL500ML | <code>ஏ.ஆர்.சி.தே.எண்500ml</code> | No specific correction proposed |
| 1534 | N07 | TANG POWDER 125GM | <code>டங்க் பவுடர் 125gm</code> | No specific correction proposed |
| 1535 | N08 | TANG POWDER 500GM | <code>டங்க் பவுடர் 500gm</code> | No specific correction proposed |
| 1536 | N09 | KISSAN SQUASH700ML | <code>கிசான் ஜீஸ் 700ML</code> | No specific correction proposed |
| 1537 | A20 | DRY FISH | <code>கருவாடு</code> | No specific correction proposed |
| 1538 | W00 | SUNTHERI | <code>சுந்தரி சோப்</code> | No specific correction proposed |
| 1539 | F00 | PONDS W/B | <code>பான்க்ஷ w/b</code> | Proposed correction |
| 1540 | H.01 | INDULEKHA | <code>இண்டுலெக்ஸ</code> | Proposed correction |
| 1541 | U00 | AACHI JAMUN200 *200 | <code>ஆச்சி ஜாமுன்200g/200g</code> | No specific correction proposed |
| 1542 | R00 | T.RICE | <code>தினை அரிசி</code> | No specific correction proposed |
| 1543 | R00. | HOR.VA.RICE | <code>குதுர வாலி அரிசி</code> | Proposed correction |
| 1544 | 614. | BOOST 6RSPKT | <code>பூஸ்ட் 5ரூபாக்</code> | Owner confirmation |
| 1545 | 601. | HORLICKS 6RSPKT | <code>ஸார்லிக்ஸ் 5ரூபாக்</code> | Proposed correction |
| 1546 | 601.. | HORLICKS 200KG BOT | <code>ஸார்லிக்ஸ்200kg bot</code> | Proposed correction |
| 1547 | T22 | A.V.T.10RSPKT | <code>ஏ.வி.டி.10ரூபாக்</code> | No specific correction proposed |
| 1548 | S47. | PANTEEN4RS | <code>பேண்டீன்4ரூsec</code> | No specific correction proposed |
| 1549 | S47.. | CLEAR3RS | <code>ஆல்கிளியர்3ருsec</code> | No specific correction proposed |
| 1550 | Z37 | LETEENBRUSH | <code>லெட்டீன்பிரஸ்</code> | Proposed correction |
| 1551 | Y18 | GROWNUTCACKE (BIG) | <code>கடலைமிட்டாய்(BIG)</code> | No specific correction proposed |
| 1552 | T33A | NARASU`S2RS | <code>நரசுஸ்2ரூ(INS)</code> | No specific correction proposed |
| 1553 | 326.1 | SENSODYE 80GM | <code>சென்சோடைன் 80gm</code> | No specific correction proposed |
| 1554 | A001 | APPALAM10RS | <code>அப்பளம்10ரூ</code> | No specific correction proposed |
| 1555 | 944. | RATGUM | <code>எலிபசைஅட்டை</code> | No specific correction proposed |
| 1556 | Y19 | MASALKADLI | <code>மசால்கடலை</code> | No specific correction proposed |
| 1557 | Y20 | KINDERJOJ | <code>கிண்டர்ஜாய்</code> | No specific correction proposed |
| 1558 | A05. | SAKTHIMANGOPICKLE | <code>சக்திமாங்காஊறூகாய்</code> | Proposed correction |
| 1559 | Z38 | OMAWATHER | <code>ஓமவாட்டர்</code> | No specific correction proposed |
| 1560 | Z.09. | RUPPER | <code>ரப்பர்</code> | No specific correction proposed |
| 1561 | Z22. | PAKKUMADDI | <code>பாக்குமட்டபிளேட்</code> | No specific correction proposed |
| 1562 | Z39 | STRAWPKT | <code>ஸ்ட்ராபாக்கட்</code> | No specific correction proposed |
| 1563 | Z40 | COOLDRINGS | <code>கூல்டிரிங்ஸ்</code> | No specific correction proposed |
| 1564 | Z41 | CLIEP | <code>கிளிப்</code> | No specific correction proposed |
| 1565 | B31. | DOVE 25GM | <code>டவ்சோப்25gm</code> | No specific correction proposed |
| 1566 | Z42 | DEEPAM | <code>விளக்கு</code> | No specific correction proposed |
| 1567 | Z43 | RATEGUM | <code>எலிபசை</code> | No specific correction proposed |
| 1568 | 506. | AYYAPPA 500ML | <code>ஜய்யப்பா500மிலி</code> | No specific correction proposed |
| 1569 | 924. | HARPIC(BOT)500ML | <code>ஸார்பிக்(பாத்)500மில்</code> | Proposed correction |
| 1570 | 924.. | HARPICK(BOT)200ML | <code>ஸார்பிக்(பாத்)200மிலி</code> | Proposed correction |
| 1571 | M32. | REDAVUL | <code>சிகப்புஅவுல்</code> | Proposed correction |
| 1572 | M22. | BROWNBEEN | <code>பிரவுன்மொச்சை</code> | No specific correction proposed |
| 1573 | M54. | MAKKACHOLAM | <code>மக்காசோளம்</code> | No specific correction proposed |
| 1574 | 404. | SUKKUKARUPPATI | <code>சுக்குகருப்பட்டி</code> | No specific correction proposed |
| 1575 | R03. | RED RICE | <code>மட்டைஅரிசி</code> | No specific correction proposed |
| 1576 | R14. | SANGU 26KG | <code>சங்கு 26kg</code> | No specific correction proposed |
| 1577 | R12. | INDIAGAT | <code>இந்தியாகேட்(GRRRN)</code> | No specific correction proposed |
| 1578 | R02. | KAMBUKURUNI | <code>கம்புகுருனை</code> | No specific correction proposed |
| 1579 | O12. | MANTRA GRO.OIL | <code>மந்ராகடலை.எண்</code> | No specific correction proposed |
| 1580 | R13. | S S BRAND 5KG | <code>S S அரிசி 5KG</code> | No specific correction proposed |
| 1581 | B26. | PERES(SMAL) | <code>பியர்ஸ்(சின்)50gm</code> | No specific correction proposed |
| 1582 | Z44 | THAD.KANG.KUUDAI | <code>தட்.கஞ்ஞிகூடை</code> | No specific correction proposed |
| 1583 | Z45 | GLOWLES | <code>கைஉரை</code> | Proposed correction |
| 1584 | M32.. | HARD AVAL | <code>கெட்டிஅவுல்</code> | Proposed correction |
| 1585 | B14. | CENTHOL COOL | <code>சிந்தால் கூல்</code> | No specific correction proposed |
| 1586 | B14.. | CENTHOL CONF. | <code>சிந்தால்கான்பி.</code> | No specific correction proposed |
| 1587 | B14... | CENTHOL LIME | <code>சிந்தால் லெமன்</code> | No specific correction proposed |
| 1588 | Z46 | DUST COVER(MED) | <code>குப்பகவர்(MED)</code> | No specific correction proposed |
| 1589 | M49. | PATTAI | <code>பட்டை 10ரூ</code> | No specific correction proposed |
| 1590 | M50. | LAVAGAM 10RS | <code>கிராம்பு 10ரூ</code> | No specific correction proposed |
| 1591 | M49.. | surul patti | <code>surul PATTAI</code> | Owner confirmation |
| 1592 | Q01. | MARIGOLD M | <code>மேரிகோல்டு(M)</code> | No specific correction proposed |
| 1593 | Q02. | NUTRICHOIES | <code>நியுட்ரிசாய்ஸ்</code> | No specific correction proposed |
| 1594 | Q04. | VARKKEI | <code>ஊட்டி வர்க்கி</code> | No specific correction proposed |
| 1595 | Q11. | GOODAY[BUT] (S) | <code>குட்டே(பட்) S</code> | No specific correction proposed |
| 1596 | S36. | CLINIKPLUS | <code>கிளினிக்பிளஸ்</code> | No specific correction proposed |
| 1597 | S37. | ALLCLEAR(SEC) | <code>ஆல்கிளியர்(sec)</code> | No specific correction proposed |
| 1598 | S38. | SUNSILK | <code>சன்சில்க்(sec)</code> | No specific correction proposed |
| 1599 | S39. | CHICK(SAC) | <code>சிக்(sac)</code> | No specific correction proposed |
| 1600 | S42. | MEERA ONINIE | <code>மீராசி.வெங்காயம்</code> | No specific correction proposed |
| 1601 | M48. | SONUF 10RS | <code>சோம்பு 10ரூ</code> | No specific correction proposed |
| 1602 | R12.. | SIVAJI 5KG | <code>சிவாஜி 5kg</code> | No specific correction proposed |
| 1603 | M21. | GROWNET | <code>பச்சநிலகடலை</code> | Proposed correction |
| 1604 | M72. | BAKING SODA | <code>பேக்கிங்சோடா</code> | No specific correction proposed |
| 1605 | M72.. | BAKING POWDER | <code>பேக்கிங்பவுடர்</code> | No specific correction proposed |
| 1606 | H39. | INDICA EASY | <code>இண்டிகா ஈசி</code> | No specific correction proposed |
| 1607 | B39. | HIMALYA BABY | <code>ஸிமாலயாபேபி</code> | Proposed correction |
| 1608 | 425. | CUPSAMBRANI (BIG) | <code>கப் சாம்ரானி(big)</code> | Proposed correction |
| 1609 | R03.. | RED RICE 1 | <code>சிகப்புஅரிசி</code> | No specific correction proposed |
| 1610 | M85. | LEMANYELOW | <code>லெமன்மஞ்சல்</code> | Proposed correction |
| 1611 | Z47 | ANJALPOWDER | <code>அஞ்சால்</code> | No specific correction proposed |
| 1612 | T05. | AVT GOLDCUP100GM | <code>ஏவிடிகோல்டுகப்100gm</code> | No specific correction proposed |
| 1613 | T05.. | AVTGOLDCUP250GM | <code>ஏவிடி கோல்டுகப்250gm</code> | No specific correction proposed |
| 1614 | 137. | CHATMASALA100GM | <code>சாட்மசாலா100gm</code> | No specific correction proposed |
| 1615 | Z01. | MO.SEEMAR | <code>மொசைக் சீமர்</code> | No specific correction proposed |
| 1616 | Z01.. | STICK SEEMAR | <code>குச்சி சீமர்</code> | No specific correction proposed |
| 1617 | Z48 | DUSTCOVER | <code>குப்பகவர் ஜம்போ</code> | No specific correction proposed |
| 1618 | Z49 | MALABARTAVEL | <code>மலபார்துண்டு</code> | No specific correction proposed |
| 1619 | Z25 | TOOTH PIK | <code>பல்குச்சி</code> | No specific correction proposed |
| 1620 | W19. | RIN MATIC 1KG | <code>rin matic 1kg</code> | Owner confirmation |
| 1621 | M47. | KARUJEERAGAM | <code>karujeeragam</code> | Owner confirmation |
| 1622 | W19.. | RIN LIQD 500ML | <code>ரின் லிக்யுடு 500ml</code> | No specific correction proposed |
| 1623 | W19... | RIN LIQD 1LIT | <code>ரின்லிக்யுடு 1Lit</code> | No specific correction proposed |
| 1624 | 104. | SAMBAR POWDER200GM | <code>சாம்பார் பொடி200gm</code> | No specific correction proposed |
| 1625 | 104.. | SAMBAR POWDER500GM | <code>சாம்பார் பொடி500gm</code> | No specific correction proposed |
| 1626 | 106. | CHILLYPOWDER200GM | <code>மிளகாய்தூள்200GM</code> | No specific correction proposed |
| 1627 | 110. | CORIANDERPOWDER200GM | <code>மல்லித்தூள்200GM</code> | No specific correction proposed |
| 1628 | 116. | AACHI KULAMBU200GM | <code>ஆச்சிகுழம்பு200gm</code> | No specific correction proposed |
| 1629 | 102. | TURMERICPOWDER200GM | <code>மஞ்.தூள்200GM</code> | No specific correction proposed |
| 1630 | 108. | RASAMPOWDER200GM | <code>ரசப்பொடி200gm</code> | No specific correction proposed |
| 1631 | 405. | JAGGRAYPOWER PAK | <code>கரும்புசக்கரை பாக்கட்</code> | No specific correction proposed |
| 1632 | 417. | AGARPATI(RS20) | <code>ஊதுபத்தி(20ரூ)</code> | No specific correction proposed |
| 1633 | O07. | DEEPAM 500GM | <code>தீபம் 500ml</code> | No specific correction proposed |
| 1634 | 913. | HITSPRAYRED)125ML | <code>HITSPRAYகரப்பான்)125ml</code> | No specific correction proposed |
| 1635 | 913.. | HITSPRAYBLAK200ML | <code>Hitspray கொசு)200ml</code> | No specific correction proposed |
| 1636 | 913... | HITSPRAYBLAK125ML | <code>HitSprayகொசு)125ml</code> | No specific correction proposed |
| 1637 | O07.. | DEEPAM 1LIT. | <code>தீபம் 1LIT</code> | No specific correction proposed |
| 1638 | T11. | LIVINGSTA 50GM | <code>லிவிங்ஸ்ட50gm</code> | Owner confirmation |
| 1639 | M41. | CHILLI ROUND | <code>உருண்டமிளகாய்</code> | No specific correction proposed |
| 1640 | M41.. | KASHMIRCHILLI | <code>காஸ்மீர்மிளகாய்</code> | Proposed correction |
| 1641 | B06. | LUX MINI | <code>லக்ஸ் மினி</code> | No specific correction proposed |
| 1642 | B14.... | CINTHAL MINI | <code>சிந்தால் மினி</code> | No specific correction proposed |
| 1643 | B14..... | CINTHAL SET | <code>சிந்தால் செட்</code> | No specific correction proposed |
| 1644 | B19. | VIVEL ROSE | <code>விவல் ரோஸ்</code> | No specific correction proposed |
| 1645 | B19.. | VIVEL SET 3+1 | <code>விவல் செட் 3+1</code> | No specific correction proposed |
| 1646 | R13.. | SS RICE10KG OLD | <code>S S அரிசி10kg (old)</code> | No specific correction proposed |
| 1647 | U06. | KANAKA PA. | <code>கனகாபாயாசம்</code> | No specific correction proposed |
| 1648 | U06.. | AACH PA. | <code>ஆச்சிபாயாசம்</code> | No specific correction proposed |
| 1649 | O001. | OIL 100ML | <code>ஆயில் 100ML</code> | No specific correction proposed |
| 1650 | Q25. | ACT POPCORN | <code>ஆப்ட்பாப்கான்</code> | No specific correction proposed |
| 1651 | R14.. | SANGU 10KG | <code>சங்கு 10kg</code> | No specific correction proposed |
| 1652 | D05. | BLACK | <code>கரு.திராச்சை 250gm</code> | No specific correction proposed |
| 1653 | K04. | AASHIRVAAD500GM | <code>aashirvaad 500gm</code> | Owner confirmation |
| 1654 | 300 | COLGATE RS.10 | <code>கோல்கேட்RS10</code> | No specific correction proposed |
| 1655 | M02. | ROCKSALTCRISTEL | <code>இந்துப்பு (கல்)</code> | No specific correction proposed |
| 1656 | M02.. | ROCKSALT(POWDER) | <code>இந்துப்பு(பொடி)</code> | No specific correction proposed |
| 1657 | Z50 | BALLOON | <code>பலூன்</code> | No specific correction proposed |
| 1658 | 500. | GHEERS10 | <code>நெய்10rs</code> | No specific correction proposed |
| 1659 | O13. | GOLDWINNER500ML | <code>கோல்டுவின்னர்500ml</code> | No specific correction proposed |
| 1660 | O002. | A R C CHKKU500ML | <code>செக்குதேங்காஎண்500ML</code> | No specific correction proposed |
| 1661 | O003. | A R C COCA.200ML | <code>A R Cதே.எண்னன200ml</code> | No specific correction proposed |
| 1662 | O003.. | ARC COCA.100ML | <code>ARCதே.எண்னை100ml</code> | No specific correction proposed |
| 1663 | O06. | MUYALCAST.OIL200ML | <code>முயல்வி.எண்னை200ml</code> | No specific correction proposed |
| 1664 | 512. | AMULYA10RS | <code>அமுல்யா10RS</code> | No specific correction proposed |
| 1665 | W15. | XLMATIC FRONT500ML | <code>XLமேட்டிக்FRONT500ML</code> | No specific correction proposed |
| 1666 | W15.. | XLMATICTOPLOAD1LIT | <code>XLமேட்டிக் டாப்1LIT</code> | No specific correction proposed |
| 1667 | W15... | XLMATICTOPLOAD500ML | <code>XLமேட்டிக்டாப்லோடு500ML</code> | No specific correction proposed |
| 1668 | W07. | XLPOWER10RS | <code>XLபவுடர்10ரூ</code> | No specific correction proposed |
| 1669 | W07.. | ARIEL 10RS | <code>ஏரியல் 10ரூ</code> | No specific correction proposed |
| 1670 | Z51 | JUUS | <code>ஜீஸ்</code> | No specific correction proposed |
| 1671 | A08. | RUCHIPICKLE(LEMEN) | <code>ருசிஊறுகாய்(லெமன்)</code> | No specific correction proposed |
| 1672 | A09. | RUCHIPICKLE(GINGER) | <code>ருசிஊருகாய்(இஞ்சி)</code> | Proposed correction |
| 1673 | Y18. | GROWNUTCACK[SMALL] | <code>கடலைமில்ட்டாய்[small]</code> | Proposed correction |
| 1674 | Y01. | CHCOLATES | <code>சாக்லைட்</code> | No specific correction proposed |
| 1675 | W38. | ARIEL TOP500ML | <code>ஏரியல் TOP500ML</code> | No specific correction proposed |
| 1676 | W39. | ARIEL FRONT500ML | <code>ஏரியல் FRONT500ML</code> | No specific correction proposed |
| 1677 | Z.08. | BADS | <code>பட்ஸ் ( pkt)</code> | No specific correction proposed |
| 1678 | J04. | CHILLI SACUES200GM | <code>சில்லிசாஸ்200GM</code> | No specific correction proposed |
| 1679 | J03. | TOMA.SAUCE200GM | <code>டொமட்டொசாஸ்200GM</code> | No specific correction proposed |
| 1680 | J04.. | CHILLISAUCE [BIG] | <code>சில்லிசாஸ்[BIG]</code> | No specific correction proposed |
| 1681 | Z52 | NOTEBOOK SMAII | <code>நோட்புக்[shot]</code> | No specific correction proposed |
| 1682 | Z53 | NOTEBOOK[LONG] | <code>நோட்புக்[LONG]</code> | No specific correction proposed |
| 1683 | Z09. | PEN | <code>பேனா</code> | No specific correction proposed |
| 1684 | Z54 | GASS LIGHTER | <code>கேஸ்லைட்டர்</code> | No specific correction proposed |
| 1685 | O07* | DEEPAM100ML | <code>தீபம் 100ml</code> | No specific correction proposed |
| 1686 | O07** | DEEPAM 200ML | <code>தீபம் 200ml</code> | No specific correction proposed |
| 1687 | 901. | UMBR. MOSQU.STICK | <code>குடைகொசு. பத்தி</code> | No specific correction proposed |
| 1688 | 419. | KADDI KARPPU.50GM | <code>கட்டிகற்பூரம்50gm</code> | No specific correction proposed |
| 1689 | 424. | KARPPURAM BOX | <code>கற்பூரம் டப்பா(s)</code> | No specific correction proposed |
| 1690 | 115 | PEPEERPOWER50GM | <code>மிளகுதூள்50GM</code> | Proposed correction |
| 1691 | M15. | WHITE PEAS | <code>வெ.பட்டானி</code> | Proposed correction |
| 1692 | B20. | SANITIZER | <code>சேண்டேசர்</code> | No specific correction proposed |
| 1693 | 420. | KARPUURAM 10RS | <code>கற்பூரம் 10ரூ</code> | No specific correction proposed |
| 1694 | 420.. | KARPUURAM 1RS | <code>கற்பூரம் 1ரூ</code> | No specific correction proposed |
| 1695 | R04. | MAPPLAYSAMPA | <code>மாப்பிள்ளைசம்பா</code> | No specific correction proposed |
| 1696 | 425.. | CUPSAMBRANI(SMALL) | <code>கப்சாம்ரானி(small)</code> | Proposed correction |
| 1697 | 411. | ROJA SUPARI(BIG) | <code>ரோஜாபாக்கு(big)</code> | No specific correction proposed |
| 1698 | 411.. | NIZAMSUPARI(BIG) | <code>நிஜாம்பாக்கு(big)</code> | No specific correction proposed |
| 1699 | 411... | NIZAM 1ROLE | <code>நிஜாம்பாக்கு 1சரம்</code> | No specific correction proposed |
| 1700 | 412. | VEPUTHI(BIG) | <code>விபூதி(big)</code> | No specific correction proposed |
| 1701 | 112. | IDLIPODI | <code>இட்லிபொடி100gm</code> | No specific correction proposed |
| 1702 | W64. | COMFO(PINK)800ML | <code>கம்ஃபோ(ரோஸ்)800ML</code> | No specific correction proposed |
| 1703 | Z46. | DUST COVER(LOR) | <code>குப்பகவர்(LAR)</code> | No specific correction proposed |
| 1704 | Z46.. | DUST COVER(X LOR) | <code>குப்பகவர்(XLOR)</code> | No specific correction proposed |
| 1705 | M84. | TIPLEE | <code>திப்பிலி</code> | No specific correction proposed |
| 1706 | M84.. | VASAMPU | <code>வசம்பு</code> | No specific correction proposed |
| 1707 | W66. | COMF(PINK)200ML | <code>கம்ஃபோ(ரோஸ்)200ML</code> | No specific correction proposed |
| 1708 | W66.. | COMF(GREEN)200ML | <code>கம்போ(பச்சை)200ml</code> | No specific correction proposed |
| 1709 | W64.. | COMF(GREEN)800ML | <code>கம்போ(ப்ச்சை)800ml</code> | No specific correction proposed |
| 1710 | B02. | HAMAM MINI | <code>கமாம் மினி</code> | Proposed correction |
| 1711 | B13. | CINTHAL150GM | <code>சிந்தால்150gm</code> | No specific correction proposed |
| 1712 | 424.. | SUGANTHI | <code>சுகந்தி</code> | No specific correction proposed |
| 1713 | 106.. | CHILLIPOWER500GM | <code>மிளகாய்தூள்500GM</code> | No specific correction proposed |
| 1714 | 103. | SAMBARPOWER200+50GM | <code>சாம்பார்தூள் 200+50GM</code> | No specific correction proposed |
| 1715 | Q26. | BUTTER MURUKKU | <code>பட்டர்முருக்கு</code> | No specific correction proposed |
| 1716 | 931. | COLIN500ML | <code>கோலின்500ml</code> | No specific correction proposed |
| 1717 | S43. | MEERA SHAMP(2RS) | <code>மீராசாம்பு(2ரூ)</code> | Proposed correction |
| 1718 | 110.. | CORINDERPOWDER500GM | <code>மல்லித்தூள்500GM</code> | No specific correction proposed |
| 1719 | 106... | CHILLYPOWDER200+50GM | <code>மிளகாய்தூள்200+50GM</code> | No specific correction proposed |
| 1720 | 108.. | CORINDERPOWDER200+50GM | <code>மல்லித்தூள்200+50GM</code> | No specific correction proposed |
| 1721 | 116.. | AACHIKULAMBU500GM | <code>ஆச்சிகுழம்பு500gm</code> | No specific correction proposed |
| 1722 | O52. | DEEPAMOIL 250ML | <code>தீபம்ஆயில் 250ml</code> | No specific correction proposed |
| 1723 | O18. | MR GOLD GRO.500ML | <code>Mr.கோல்டுக.எண்.500ML</code> | No specific correction proposed |
| 1724 | T14. | GREENTEA TIP | <code>கிரீண்டீ டிப்</code> | No specific correction proposed |
| 1725 | M83. | SAPZJASEED | <code>சப்ஜாவிதை</code> | No specific correction proposed |
| 1726 | M82. | KADUKAAY | <code>கடுக்காய்</code> | No specific correction proposed |
| 1727 | M81. | MASIKKAI | <code>மாசிக்காய்</code> | No specific correction proposed |
| 1728 | K01. | MAIYL ATTA5KG | <code>மயில் ஆட்டா5kg</code> | No specific correction proposed |
| 1729 | C06. | VIM BAR(BOX) | <code>விம்பார்(பாக்ஸ்)</code> | No specific correction proposed |
| 1730 | S40. | H&amp;S 2RS | <code>H &amp; S 2ரூ</code> | No specific correction proposed |
| 1731 | S41. | PANTEEN 2RS | <code>பேண்டீன்2ரூ</code> | No specific correction proposed |
| 1732 | S42.. | MEERAPOWDER 4RS | <code>மீராபவுடர் 4ரூ</code> | No specific correction proposed |
| 1733 | S43* | MEERA3RS | <code>மீரா 3ரூ</code> | No specific correction proposed |
| 1734 | S43.. | MEERA 2RS | <code>மீரா 2ரூ</code> | No specific correction proposed |
| 1735 | S44. | DOVESHAM.2RS | <code>டவ்சாம்பு 2ரூ</code> | Proposed correction |
| 1736 | S46. | KARTHIKASHA.(SEC) | <code>கார்த்திகாசாம்பு சரம்</code> | No specific correction proposed |
| 1737 | S46.. | KARTHIKASHA.1RS | <code>கார்த்திகாசாம்பு 1ரூ</code> | No specific correction proposed |
| 1738 | S45. | KARTHIKAPOWDER2RS | <code>கார்த்திகாபவுடர் 2ரூ</code> | No specific correction proposed |
| 1739 | P01. | PONDS 10RS | <code>பான்ஸ் 10RS</code> | No specific correction proposed |
| 1740 | R02.. | P T RICE | <code>P Tபச்சஅரிசி</code> | Proposed correction |
| 1741 | A001. | SHATHI APPLAM | <code>சத்தி அப்பளம்</code> | No specific correction proposed |
| 1742 | P09. | GOKULSANTOL30GM | <code>கோகுல்சண்டல்30gm</code> | No specific correction proposed |
| 1743 | Z55 | RAVAIDLIMIX | <code>ரவாஇட்லிமிக்ஸ்500GM</code> | No specific correction proposed |
| 1744 | Z56 | PANIYANWAST | <code>பணியன்வேஸ்ட்</code> | Owner confirmation |
| 1745 | Z57 | PANEER | <code>பண்ணீர்</code> | Proposed correction |
| 1746 | D04. | CASHEWPOWER | <code>தூள்முந்திரி</code> | No specific correction proposed |
| 1747 | Z12. | WHATER20LIT. | <code>தண்ணீர்20LITER</code> | No specific correction proposed |
| 1748 | W09. | ARASANLIQED | <code>அரச்ன்லிக்யுடு</code> | No specific correction proposed |
| 1749 | Z58 | SPOON | <code>spoon</code> | Owner confirmation |
| 1750 | 424... | KARPPURAM BOX | <code>கற்பூரம்டப்பா(BIG)</code> | No specific correction proposed |
| 1751 | 429. | PANNERBOTTEL BIG | <code>பன்னீர்பாட்டில்(BIG)</code> | No specific correction proposed |
| 1752 | 434. | TIRI BIG | <code>திரி (BIG)</code> | No specific correction proposed |
| 1753 | Z.07. | CURD | <code>தயிர்</code> | No specific correction proposed |
| 1754 | O44. | PARASHOOT250ML | <code>பாரசூட்250ml</code> | No specific correction proposed |
| 1755 | Z.06. | MILK | <code>பால்பாக்கட்</code> | No specific correction proposed |
| 1756 | O001.. | OIL 200ML | <code>ஆயில் 200ML</code> | No specific correction proposed |
| 1757 | T24. | A V T HOT500GM | <code>A V T HOT500GM</code> | Owner confirmation |
| 1758 | R11. | INDIAGATE ROSE | <code>இந்தியாகேட்(ROSE)</code> | No specific correction proposed |
| 1759 | 418. | MATCHBOX 10RS | <code>தீப்பட்டீ 10ரூ</code> | Proposed correction |
| 1760 | 418.. | HOMEMATCHBOX | <code>ஸோம்லைட்தீப்பட்டி</code> | Proposed correction |
| 1761 | Z59 | FREE GIFT | <code>தீபாவளி(GIFT)</code> | No specific correction proposed |
| 1762 | 114. | PEEPERPOWER250GM | <code>மிளகுதூள் 250GM</code> | Proposed correction |
| 1763 | Q13. | SMALLBISKET | <code>குட்டிபிஸ்கட்</code> | No specific correction proposed |
| 1764 | O002.. | CHEECKCOCANET1LI | <code>செக்குதேங்காஎண்1LI</code> | No specific correction proposed |
| 1765 | O00.. | A R C COCANET1LI | <code>A R C தேங்காஎண் 1LI</code> | No specific correction proposed |
| 1766 | Z60 | FREE GIFT | <code>FREE GIFT</code> | Owner confirmation |
| 1767 | B04. | REXONAROOLAN | <code>ரெக்சோனாரோலன்</code> | No specific correction proposed |
| 1768 | Z61 | 12 *12SHEET | <code>12*12 சீட்</code> | No specific correction proposed |
| 1769 | Z62 | 14*14 SHEET | <code>14*14 சீட்</code> | No specific correction proposed |
| 1770 | Z63 | SILVER COVER 8*10 | <code>சில்வர்கவர்8*10</code> | No specific correction proposed |
| 1771 | Z23. | PICK UP S | <code>கேரிகவர்(small)</code> | No specific correction proposed |
| 1772 | Z64 | SAMBAER (S) | <code>சாம்பார்கவர் (s)</code> | No specific correction proposed |
| 1773 | Z65 | PLETECOVER | <code>பிளேட்கவர்</code> | No specific correction proposed |
| 1774 | 118. | CHICKEN 500GM | <code>சிக்கன்மசால்500gm</code> | No specific correction proposed |
| 1775 | Z66 | SILVER7*9 | <code>சில்வர் 7*9</code> | No specific correction proposed |
| 1776 | Z67 | SILVER 6*8 | <code>சில்வர் 6*8</code> | No specific correction proposed |
| 1777 | Z68 | SILVER 5*7 | <code>சில்வெர் 5*7</code> | Proposed correction |
| 1778 | Z64. | SAMBERCOVER(B) | <code>சாம்பார்கவர் (B)</code> | No specific correction proposed |
| 1779 | J10 | TOMATOSACSE PKT | <code>டொமட்டோசாஸ் paket</code> | No specific correction proposed |
| 1780 | D12. | BATHAM PISEN | <code>பாதாம்பிசின்</code> | No specific correction proposed |
| 1781 | B12. | CHATRICA SET | <code>சந்ரிகாசெட்</code> | Proposed correction |
| 1782 | 121. | BRIYANIMASAL100GM | <code>பிரியானிமசால்100GM</code> | Proposed correction |
| 1783 | 114.. | PERIPERI POWER | <code>பெரிபெரிபவுடர்</code> | No specific correction proposed |
| 1784 | B38. | MARGO SET | <code>மார்கோ செட்</code> | No specific correction proposed |
| 1785 | B09. | MEDIMIX SET | <code>மெடிமிக்ஸ் செட்</code> | No specific correction proposed |
| 1786 | Z69 | SILVER 4 6 | <code>சில்வ்ர் 4 6</code> | Proposed correction |
| 1787 | T19. | SUNRICE 2RS | <code>சன்ரைஸ் 2RS</code> | No specific correction proposed |
| 1788 | T28. | BRU 2RS | <code>புரூ 2RS</code> | No specific correction proposed |
| 1789 | Z70 | ATTAR | <code>அத்தர்</code> | No specific correction proposed |
| 1790 | 115.. | PEPEER POWDER10RS | <code>மிளகுத்தூள்10ரூ</code> | No specific correction proposed |
| 1791 | Q01.. | MARYGOLD BIG | <code>மேரிகோல்டு BIG</code> | No specific correction proposed |
| 1792 | Q13.. | BISKET | <code>பிஸ்கட்</code> | No specific correction proposed |
| 1793 | Z71 | IDLIMAVU | <code>இட்லிமாவு</code> | No specific correction proposed |
| 1794 | Z72 | SEAVI | <code>சேவை</code> | No specific correction proposed |
| 1795 | Z73 | CHAPPATHI | <code>சப்பாத்தி</code> | No specific correction proposed |
| 1796 | Y21 | B...... | <code>B.......</code> | Owner confirmation |
| 1797 | Y22 | Y... | <code>Y...</code> | Owner confirmation |
| 1798 | Y23 | Y.. | <code>Y..</code> | Owner confirmation |
| 1799 | Z74 | SAAYAM | <code>sayam</code> | Owner confirmation |

## Safe next step

Approve product-specific corrections before applying a second name-only patch. The store database may now contain newer invoices and price edits: use a fresh store copy before deployment, or apply an old-name-guarded patch on the latest database. Keep codes including punctuation distinct; M.82 and M82 remain separate. Preserve all non-name fields and all invoice objects with equality checks. Do not overwrite current store data with this snapshot.
