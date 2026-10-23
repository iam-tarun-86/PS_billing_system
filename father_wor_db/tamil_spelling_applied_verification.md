# Approved Tamil spelling corrections — applied verification

Date: 23 October 2026

Input SHA-256: 11d65ef586d0f10025c53c1a2502dc136f4daa6e467c3ca49c71feaf469d9978
Output SHA-256: da7bd4c147784dc9d1fdd263c8e23f383c4bd95521f653dfe0e409e678331cc0
Backup: father_wor_db/database.before_spelling_corrections.json.bak

- Applied exactly the 153 approved proposals; no additional spelling or pack-size edits.
- All 1,799 product records retain identical order, codes, prices, stock, slabs and every field except the approved tamilName changes.
- All 2,570 invoice objects, settings and all other database fields are deeply identical.
- Backup is byte-for-byte identical to the input. Original database.json.bak is retained.
- Original JSON formatting outside the replaced name tokens is preserved.
- M.82 and M82 remain distinct and their records are unchanged in this second pass.
- Owner-review-only entries were not changed, unless their name also had a separately approved proposal.
- AppData databases and the bundled seed database were not changed.
- If the store has newer sales or price edits, apply a name-only patch to a fresh copy rather than overwrite with this older snapshot.

| # | Code | English name | Before | After |
|---:|---|---|---|---|
| 1 | M07 | MOONG | <code>ப.பயிர்</code> | <code>ப.பயறு</code> |
| 2 | M10 | THADAPAYIRU | <code>த. பயிர்</code> | <code>த. பயறு</code> |
| 3 | M32 | AVAL | <code>அவுல்</code> | <code>அவல்</code> |
| 4 | R03 | ROAW  RICE | <code>பச்சஅரிசி</code> | <code>பச்சரிசி</code> |
| 5 | R10 | RICE NO.3 | <code>சாப்பட்டு அரிசிNO.3</code> | <code>சாப்பாட்டு அரிசிNO.3</code> |
| 6 | M87 | G.MOONG(NADU) | <code>ப.பயிர்(நாடு)</code> | <code>ப.பயறு(நாடு)</code> |
| 7 | R23 | MAHARAJA 25KG | <code>மஸாராஜா 25கி</code> | <code>மஹாராஜா 25கி</code> |
| 8 | W36 | VANISH(JAR) | <code>வேனிக்ஷஜார்</code> | <code>வேனிஷ்ஜார்</code> |
| 9 | B01 | HAMAM 100G | <code>ஸமாம் 100gm</code> | <code>ஹமாம் 100gm</code> |
| 10 | B02 | HAMAM 150GM | <code>ஸமாம் 150gm</code> | <code>ஹமாம் 150gm</code> |
| 11 | B12 | HAMAM MINI | <code>ஸமாம் (மினி)</code> | <code>ஹமாம் (மினி)</code> |
| 12 | K17 | KOLAKADDI MAVU | <code>கொலக்கட்டைமாவு</code> | <code>கொழுக்கட்டைமாவு</code> |
| 13 | B39 | HIMALAYA 75GM | <code>ஸிமாலயா 75g</code> | <code>ஹிமாலயா 75g</code> |
| 14 | B45 | AYUSH SOAP 75G | <code>ஆயுஸ்சோப் 75g</code> | <code>ஆயுஷ்சோப் 75g</code> |
| 15 | T39 | TAJMAHAL 100G | <code>தாஜ்மஸால் 100g</code> | <code>தாஜ்மஹால் 100g</code> |
| 16 | T40 | TAJMAHAL 250G | <code>தாஜ்மஸால் 250g</code> | <code>தாஜ்மஹால் 250g</code> |
| 17 | T47 | ASSAM 100G | <code>அஸ்ஷாம் 100g</code> | <code>அசாம் 100g</code> |
| 18 | T48 | ASSAM 250G | <code>அஸ்ஷாம் 250g</code> | <code>அசாம் 250g</code> |
| 19 | 316 | AYUSH PASTE | <code>ஆயூஸ்பேஸ்ட்</code> | <code>ஆயுஷ்பேஸ்ட்</code> |
| 20 | 322 | COLGATE HERBAL 100G | <code>கோல்கேட்ஸெர்பல் 100g</code> | <code>கோல்கேட்ஹெர்பல் 100g</code> |
| 21 | 323 | COLGATE HERBAL 200G | <code>கோல்கேட்ஸெர்பல் 200g</code> | <code>கோல்கேட்ஹெர்பல் 200g</code> |
| 22 | 331 | COL.BURES | <code>கோல்.பிரஸ்</code> | <code>கோல்.பிரஷ்</code> |
| 23 | 332 | COLGATE BURES | <code>கோல்கேட் பிரஸ்</code> | <code>கோல்கேட் பிரஷ்</code> |
| 24 | 364 | HIMALAYA 100G | <code>ஸிமாலயாபேஸ்ட் 100g</code> | <code>ஹிமாலயாபேஸ்ட் 100g</code> |
| 25 | 340 | DOBUR HERBALPASTE 50G | <code>டாபர்ஸெர்பல்பேஸ்ட் 50g</code> | <code>டாபர்ஹெர்பல்பேஸ்ட் 50g</code> |
| 26 | 354 | BRUSH | <code>பிரக்ஷ</code> | <code>பிரஷ்</code> |
| 27 | 421 | POWERSAMPRANI | <code>பொடிசாம்ரானி</code> | <code>பொடிசாம்பிராணி</code> |
| 28 | 468 | HOMELITE | <code>ஸோம்லைட்</code> | <code>ஹோம்லைட்</code> |
| 29 | 502 | GHEE UTHYAKR. 100G | <code>உதயகிருக்ஷணா100g</code> | <code>உதயகிருஷ்ணா100g</code> |
| 30 | 503 | UDHAYAKRIS. 200G | <code>உதயகிருக்ஷணா200g</code> | <code>உதயகிருஷ்ணா200g</code> |
| 31 | 504 | UTHAYAKRIS.500G | <code>உதயகிருக்ஷணா500g</code> | <code>உதயகிருஷ்ணா500g</code> |
| 32 | 601 | HORLICKS.500(R) | <code>ஸார்லிக்ஸ் 500(R)</code> | <code>ஹார்லிக்ஸ் 500(R)</code> |
| 33 | 602 | HORLICKS.500(BOT) | <code>ஸார்லிக்ஸ் 500g(BOT)</code> | <code>ஹார்லிக்ஸ் 500g(BOT)</code> |
| 34 | 603 | HORLICKS1KG(R) | <code>ஸார்லிக்ஸ் 1KG (R)</code> | <code>ஹார்லிக்ஸ் 1KG (R)</code> |
| 35 | 604 | HOR.CHO.500(R) | <code>ஸார்.சாக்.500(R)</code> | <code>ஹார்.சாக்.500(R)</code> |
| 36 | 605 | HOR.200GM(PAKET) | <code>ஸார்.200gm(பாக்கட்)</code> | <code>ஹார்.200gm(பாக்கட்)</code> |
| 37 | 606 | HORLICKS1KG(BOT) | <code>ஸார்1 KG(BOT)</code> | <code>ஹார்1 KG(BOT)</code> |
| 38 | 607 | HOR.(100GM)PKT | <code>ஸார்.(100gm)பாக்கட்</code> | <code>ஹார்.(100gm)பாக்கட்</code> |
| 39 | 608 | HOR.JUNIOR.500(R) | <code>ஸார்.JUNIOR.500 (R)</code> | <code>ஹார்.JUNIOR.500 (R)</code> |
| 40 | 609 | HOR.JUNIOR.500(BOT) | <code>ஸார்.JUNIOR.500(BOT)</code> | <code>ஹார்.JUNIOR.500(BOT)</code> |
| 41 | 644 | MANNA HEALTHMIX 500 | <code>மன்னாஸெல்த்மிக்ஸ் 500g</code> | <code>மன்னாஹெல்த்மிக்ஸ் 500g</code> |
| 42 | 645 | MANNA HEALTHMIX200G | <code>மன்னாஸெல்த்மிக்ஸ் 200g</code> | <code>மன்னாஹெல்த்மிக்ஸ் 200g</code> |
| 43 | 647 | MCS HEALTHMIX 500G | <code>MCS ஸெல்த்மிக்ஸ் 500g</code> | <code>MCS ஹெல்த்மிக்ஸ் 500g</code> |
| 44 | 744 | JJ.HAIR OIL 50ML | <code>பேபிஸேர்ஆயில் 50ml</code> | <code>பேபிஹேர் ஆயில் 50ml</code> |
| 45 | 745 | JJ.BABY HAIR OIL 100ML | <code>JJ.பேபிஸேர்ஆயில் 100ml</code> | <code>JJ.பேபிஹேர் ஆயில் 100ml</code> |
| 46 | 746 | JJ.BABYLOTION 50ML | <code>JJ.பேபிலோசன் 50ml</code> | <code>JJ.பேபிலோஷன் 50ml</code> |
| 47 | 747 | JJ.BABYLOTION 100ML | <code>JJ.பேபிலோசன் 100ml</code> | <code>JJ.பேபிலோஷன் 100ml</code> |
| 48 | 748 | JJ.BABY SHAMPOO 50ML | <code>JJ.பேபி சாம்பு 50ml</code> | <code>JJ.பேபி ஷாம்பு 50ml</code> |
| 49 | 749 | JJ.BABY SHAMPOO 100ML | <code>JJ.பேபி சாம்பு 100ml</code> | <code>JJ.பேபி ஷாம்பு 100ml</code> |
| 50 | 750 | JJ.BABY SHAMPOO 200ML | <code>JJ.பேபி சாம்பு 200ml</code> | <code>JJ.பேபி ஷாம்பு 200ml</code> |
| 51 | 754 | BABY BRUSH | <code>பேபிபிரக்ஷ</code> | <code>பேபிபிரஷ்</code> |
| 52 | 759 | HAGGIES | <code>ஸக்கீஸ்</code> | <code>ஹக்கீஸ்</code> |
| 53 | H36 | BLACK HENNA | <code>பிலக்ஸெனா</code> | <code>பிளாக் ஹென்னா</code> |
| 54 | 923 | HARPIC-(S) | <code>ஸார்பிக்-(S)</code> | <code>ஹார்பிக்-(S)</code> |
| 55 | 924 | HAPIC-(B) | <code>ஸார்பிக்-(B)</code> | <code>ஹார்பிக்-(B)</code> |
| 56 | 958 | HARPIC(F)MATIC | <code>ஸார்பிக்(F-MATIC)</code> | <code>ஹார்பிக்(F-MATIC)</code> |
| 57 | A12 | PICKLES JAR | <code>ஊருகாய் ஜார்</code> | <code>ஊறுகாய் ஜார்</code> |
| 58 | S16 | GARNIOR SHM100ML | <code>கார்னியர் சாம்பு 100ml</code> | <code>கார்னியர் ஷாம்பு 100ml</code> |
| 59 | S22 | DOVE 100ML | <code>டவ்சாம்பு 100ml</code> | <code>டவ்ஷாம்பு 100ml</code> |
| 60 | S23 | DOVE 200ML | <code>டவ்சாம்பு 200ml</code> | <code>டவ்ஷாம்பு 200ml</code> |
| 61 | S25 | HIMALAYA SHAMPOO 120ML | <code>ஸிமா.ஷாம்பு  120ml</code> | <code>ஹிமா.ஷாம்பு  120ml</code> |
| 62 | S33 | SHIKAI POWDER | <code>பாரதியார்சீவக்காய்தூள்</code> | <code>பாரதியார்சீயக்காய்தூள்</code> |
| 63 | W72 | HENKO MAHA BAR | <code>ஸென்.மஸா.பார்</code> | <code>ஹென்கோ மஹா பார்</code> |
| 64 | 826 | WISPERMAXI XL | <code>விஸ்பர்மேக்ஷி (XL)</code> | <code>விஸ்பர்மேக்ஸி (XL)</code> |
| 65 | 827 | WHISPER MAXI(REG) | <code>விஸ்பர் மேக்ஷி(Reg)</code> | <code>விஸ்பர் மேக்ஸி(Reg)</code> |
| 66 | V21 | NIVYA BRUSH | <code>நிவியா.சே.பிரஸ்</code> | <code>நிவியா.சே.பிரஷ்</code> |
| 67 | C04 | EXO SAFAI | <code>எக்ஷோ சபாய்</code> | <code>எக்ஸோ சபாய்</code> |
| 68 | C06 | EXO STEEL | <code>எக்ஷோ ஸ்டீல்</code> | <code>எக்ஸோ ஸ்டீல்</code> |
| 69 | C10 | EXO BAR (S) | <code>எக்ஷோ பார் (s)</code> | <code>எக்ஸோ பார் (s)</code> |
| 70 | C11 | EXO   ROUND BAR | <code>எக்ஷோ ரவுன் பார்</code> | <code>எக்ஸோ ரவுன் பார்</code> |
| 71 | F06 | AYUSH CREEME25GM | <code>ஆயூஸ்கிரிம்25gm</code> | <code>ஆயுஷ்கிரிம்25gm</code> |
| 72 | F14 | PONDS LOTION 100ML | <code>பான்ஸ் லோசன் 100ml</code> | <code>பான்ஸ் லோஷன் 100ml</code> |
| 73 | F16 | VASELINE LOTION 100ML | <code>வாஸ்லின் லோசன் 100ml</code> | <code>வாஸ்லின் லோஷன் 100ml</code> |
| 74 | F17 | VASELINE LOTION 40ML | <code>வாஸ்லின் லோசன் 40ml</code> | <code>வாஸ்லின் லோஷன் 40ml</code> |
| 75 | F27 | AYUSH F/W | <code>ஆயூஸ் F/W</code> | <code>ஆயுஷ் F/W</code> |
| 76 | U10 | K.BIRIYANI MIX | <code>K.பிரியானி மிக்ஸ்</code> | <code>K.பிரியாணி மிக்ஸ்</code> |
| 77 | Q19 | HIDE&amp;SEEK | <code>ஸைட்&amp;சீக்</code> | <code>ஹைட்&amp;சீக்</code> |
| 78 | Q31 | VARU.PATTANI | <code>வறு.பட்டானி</code> | <code>வறு.பட்டாணி</code> |
| 79 | Y05 | KADALIURUNDAI | <code>கடலஉருண்டை</code> | <code>கடலை உருண்டை</code> |
| 80 | Y06 | BLACK ALLU | <code>எள்ளூஉருண்ட</code> | <code>எள்ளு உருண்டை</code> |
| 81 | Z07 | BERIYANI BOX | <code>பிரியானி பாக்ஸ்</code> | <code>பிரியாணி பாக்ஸ்</code> |
| 82 | Z13 | BATH BRUSH | <code>பாத் பிரஸ்</code> | <code>பாத் பிரஷ்</code> |
| 83 | Z14 | WASH BRUSH | <code>வாக்ஷ பிரஸ்</code> | <code>வாஷ் பிரஷ்</code> |
| 84 | W75 | HENKOMATIC 1KG | <code>ஸென்கோ மேட்டிக் 1kg</code> | <code>ஹென்கோ மேட்டிக் 1kg</code> |
| 85 | 649 | HOR(BOT)200G | <code>ஸார்(BOT) 200g</code> | <code>ஹார்(BOT) 200g</code> |
| 86 | 650 | HORLICKS 1KG(JAR) | <code>ஸார்லிக்ஸ் 1kg (JAR)</code> | <code>ஹார்லிக்ஸ் 1kg (JAR)</code> |
| 87 | F31 | FAIR&amp;HANDSOME 30ML | <code>ஃபேர்&amp;ஸேன்சம் 30ml</code> | <code>ஃபேர்&amp;ஹேன்சம் 30ml</code> |
| 88 | 651 | MOTHER.HOR(R)500G | <code>மதர் ஸார்லிக்ஸ்(R) 500g</code> | <code>மதர் ஹார்லிக்ஸ்(R) 500g</code> |
| 89 | 654 | JU.HOR(CHOC)500G | <code>JU.ஸார்(choc)500g</code> | <code>JU.ஹார்(choc)500g</code> |
| 90 | 655 | HOR(LITE)(BOT)500G | <code>ஸார்.லைட் (BOT) 500g</code> | <code>ஹார்.லைட் (BOT) 500g</code> |
| 91 | G112 | HORLICKS 1KG(BOT) | <code>ஸார்லிக்ஸ் 1kg (BOT)</code> | <code>ஹார்லிக்ஸ் 1kg (BOT)</code> |
| 92 | G113 | HORLICKS 1KG(R) | <code>ஸார்லிக்ஸ் 1kg(R)</code> | <code>ஹார்லிக்ஸ் 1kg(R)</code> |
| 93 | G114 | HORLICKS 500G(BOT) | <code>ஸார்லிக்ஸ் 500g(BOT)</code> | <code>ஹார்லிக்ஸ் 500g(BOT)</code> |
| 94 | G115 | HORLICKS 500G(R) | <code>ஸார்லிக்ஸ் 500g(R)</code> | <code>ஹார்லிக்ஸ் 500g(R)</code> |
| 95 | G116 | JU.HOR.500G(BOT) | <code>JU.ஸார்.500g(BOT)</code> | <code>JU.ஹார்.500g(BOT)</code> |
| 96 | G117 | JU.HOR.500G(R) | <code>JU.ஸார்.500g(R)</code> | <code>JU.ஹார்.500g(R)</code> |
| 97 | G126 | MOT.HOR.500GM(R) | <code>மதர்.ஸார்.500gm(R)</code> | <code>மதர்.ஹார்.500gm(R)</code> |
| 98 | G309 | TAJ MAHAL | <code>தாஜ்மஸால்</code> | <code>தாஜ்மஹால்</code> |
| 99 | G325 | KRISHNA RICE | <code>கிருக்ஷணா அரிசி</code> | <code>கிருஷ்ணா அரிசி</code> |
| 100 | G329 | MAHARAJA | <code>மஸாராஜா</code> | <code>மஹாராஜா</code> |
| 101 | G214 | KRISHNA | <code>கிருக்ஷணா</code> | <code>கிருஷ்ணா</code> |
| 102 | G218 | MAHAARAJA | <code>மஸாராஜா</code> | <code>மஹாராஜா</code> |
| 103 | G222 | TAJMAHAL | <code>தாஜ்மஸால்</code> | <code>தாஜ்மஹால்</code> |
| 104 | G227 | JAIHIND | <code>ஜெய்ஸிந்த்</code> | <code>ஜெய்ஹிந்த்</code> |
| 105 | 658 | JU.HOR.200G | <code>JU.ஸார்.200g</code> | <code>JU.ஹார்.200g</code> |
| 106 | 659 | RAMANA HELTH MIX | <code>ரமணா ஸெல்த் மிக்ஸ்</code> | <code>ரமணா ஹெல்த் மிக்ஸ்</code> |
| 107 | G152 | HARPIC(B) | <code>ஸார்பிக்(B)</code> | <code>ஹார்பிக்(B)</code> |
| 108 | G153 | HARPIC(S) | <code>ஸார்பிக்(S)</code> | <code>ஹார்பிக்(S)</code> |
| 109 | G154 | HOR.CHO(R)500G | <code>ஸார்.சாக் (R) 500g</code> | <code>ஹார்.சாக் (R) 500g</code> |
| 110 | G155 | HOR.VEN(R)500G | <code>ஸார்.வெண்(R)500g</code> | <code>ஹார்.வெண்(R)500g</code> |
| 111 | G171 | TAJMAHAL TEA500 | <code>தாஜ்மஸால் டீ 500</code> | <code>தாஜ்மஹால் டீ 500</code> |
| 112 | G346 | KRISNA DELUX | <code>கிருக்ஷணா டீலக்ஸ்</code> | <code>கிருஷ்ணா டீலக்ஸ்</code> |
| 113 | G244 | KRISHNADELUX PONNI | <code>கிருஸ்னாடீலக்ஸ்பொன்னி</code> | <code>கிருஷ்ணா டீலக்ஸ் பொன்னி</code> |
| 114 | G193 | TAJMAHAL250G | <code>தாஜ்மஸால் 250g</code> | <code>தாஜ்மஹால் 250g</code> |
| 115 | 365 | HIMALYA50GM | <code>ஸிமாலயா50gm</code> | <code>ஹிமாலயா50gm</code> |
| 116 | A06 | SAKTHI PICKLE(G),(GR) | <code>சக்திஊறுகய்(Ge),(Gr)</code> | <code>சக்திஊறுகாய்(Ge),(Gr)</code> |
| 117 | 156 | KASMIR CHIILY100G | <code>காக்ஷமீர்சில்லி100g</code> | <code>காஷ்மீர்சில்லி100g</code> |
| 118 | 841 | VEETHAIRRMV | <code>வீட்ஸேர்Rmv</code> | <code>வீட்ஹேர்Rmv</code> |
| 119 | O002 | T.V.S.GROW.OIL | <code>டி.வி.க்ஷ. க.எண்.1லிட்</code> | <code>டி.வி.எஸ். க.எண்.1லிட்</code> |
| 120 | F00 | PONDS W/B | <code>பான்க்ஷ w/b</code> | <code>பாண்ட்ஸ் w/b</code> |
| 121 | H.01 | INDULEKHA | <code>இண்டுலெக்ஸ</code> | <code>இந்துலேகா</code> |
| 122 | R00. | HOR.VA.RICE | <code>குதுர வாலி அரிசி</code> | <code>குதிரைவாலி அரிசி</code> |
| 123 | 601. | HORLICKS 6RSPKT | <code>ஸார்லிக்ஸ் 5ரூபாக்</code> | <code>ஹார்லிக்ஸ் 5ரூபாக்</code> |
| 124 | 601.. | HORLICKS 200KG BOT | <code>ஸார்லிக்ஸ்200kg bot</code> | <code>ஹார்லிக்ஸ்200kg bot</code> |
| 125 | Z37 | LETEENBRUSH | <code>லெட்டீன்பிரஸ்</code> | <code>லெட்டீன்பிரஷ்</code> |
| 126 | A05. | SAKTHIMANGOPICKLE | <code>சக்திமாங்காஊறூகாய்</code> | <code>சக்திமாங்காஊறுகாய்</code> |
| 127 | 924. | HARPIC(BOT)500ML | <code>ஸார்பிக்(பாத்)500மில்</code> | <code>ஹார்பிக்(பாத்)500மில்</code> |
| 128 | 924.. | HARPICK(BOT)200ML | <code>ஸார்பிக்(பாத்)200மிலி</code> | <code>ஹார்பிக்(பாத்)200மிலி</code> |
| 129 | M32. | REDAVUL | <code>சிகப்புஅவுல்</code> | <code>சிகப்புஅவல்</code> |
| 130 | Z45 | GLOWLES | <code>கைஉரை</code> | <code>கையுறை</code> |
| 131 | M32.. | HARD AVAL | <code>கெட்டிஅவுல்</code> | <code>கெட்டிஅவல்</code> |
| 132 | M21. | GROWNET | <code>பச்சநிலகடலை</code> | <code>பச்சை நிலக்கடலை</code> |
| 133 | B39. | HIMALYA BABY | <code>ஸிமாலயாபேபி</code> | <code>ஹிமாலயாபேபி</code> |
| 134 | 425. | CUPSAMBRANI (BIG) | <code>கப் சாம்ரானி(big)</code> | <code>கப் சாம்பிராணி(big)</code> |
| 135 | M85. | LEMANYELOW | <code>லெமன்மஞ்சல்</code> | <code>லெமன் மஞ்சள்</code> |
| 136 | M41.. | KASHMIRCHILLI | <code>காஸ்மீர்மிளகாய்</code> | <code>காஷ்மீர்மிளகாய்</code> |
| 137 | A09. | RUCHIPICKLE(GINGER) | <code>ருசிஊருகாய்(இஞ்சி)</code> | <code>ருசிஊறுகாய்(இஞ்சி)</code> |
| 138 | Y18. | GROWNUTCACK[SMALL] | <code>கடலைமில்ட்டாய்[small]</code> | <code>கடலைமிட்டாய்[small]</code> |
| 139 | 115 | PEPEERPOWER50GM | <code>மிளகுதூள்50GM</code> | <code>மிளகுத்தூள்50GM</code> |
| 140 | M15. | WHITE PEAS | <code>வெ.பட்டானி</code> | <code>வெ.பட்டாணி</code> |
| 141 | 425.. | CUPSAMBRANI(SMALL) | <code>கப்சாம்ரானி(small)</code> | <code>கப்சாம்பிராணி(small)</code> |
| 142 | B02. | HAMAM MINI | <code>கமாம் மினி</code> | <code>ஹமாம் மினி</code> |
| 143 | S43. | MEERA SHAMP(2RS) | <code>மீராசாம்பு(2ரூ)</code> | <code>மீராஷாம்பு(2ரூ)</code> |
| 144 | S44. | DOVESHAM.2RS | <code>டவ்சாம்பு 2ரூ</code> | <code>டவ்ஷாம்பு 2ரூ</code> |
| 145 | R02.. | P T RICE | <code>P Tபச்சஅரிசி</code> | <code>P Tபச்சரிசி</code> |
| 146 | Z57 | PANEER | <code>பண்ணீர்</code> | <code>பன்னீர்</code> |
| 147 | 418. | MATCHBOX 10RS | <code>தீப்பட்டீ 10ரூ</code> | <code>தீப்பெட்டி 10ரூ</code> |
| 148 | 418.. | HOMEMATCHBOX | <code>ஸோம்லைட்தீப்பட்டி</code> | <code>ஹோம்லைட் தீப்பெட்டி</code> |
| 149 | 114. | PEEPERPOWER250GM | <code>மிளகுதூள் 250GM</code> | <code>மிளகுத்தூள் 250GM</code> |
| 150 | Z68 | SILVER 5*7 | <code>சில்வெர் 5*7</code> | <code>சில்வர் 5*7</code> |
| 151 | B12. | CHATRICA SET | <code>சந்ரிகாசெட்</code> | <code>சந்திரிகாசெட்</code> |
| 152 | 121. | BRIYANIMASAL100GM | <code>பிரியானிமசால்100GM</code> | <code>பிரியாணிமசால்100GM</code> |
| 153 | Z69 | SILVER 4 6 | <code>சில்வ்ர் 4 6</code> | <code>சில்வர் 4 6</code> |
