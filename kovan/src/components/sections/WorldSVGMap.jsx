import React, { useState, useEffect } from 'react';

// Gönüllü seviyeleri - Tüm ülkeler için veri
const COUNTRY_DATA = {
  // Yüksek Seviye (>1M gönüllü) - HIGH
  'US': { name: 'ABD', volunteers: 15200000, level: 'high' },
  'CN': { name: 'Çin', volunteers: 8400000, level: 'high' },
  'IN': { name: 'Hindistan', volunteers: 6800000, level: 'high' },
  'BR': { name: 'Brezilya', volunteers: 5700000, level: 'high' },
  'RU': { name: 'Rusya', volunteers: 4200000, level: 'high' },
  'PK': { name: 'Pakistan', volunteers: 2800000, level: 'high' },
  
  // Orta-Yüksek Seviye (500K-1M) - MEDIUM-HIGH
  'JP': { name: 'Japonya', volunteers: 2600000, level: 'medium-high' },
  'CA': { name: 'Kanada', volunteers: 2400000, level: 'medium-high' },
  'GB': { name: 'İngiltere', volunteers: 2100000, level: 'medium-high' },
  'AU': { name: 'Avustralya', volunteers: 1900000, level: 'medium-high' },
  'DE': { name: 'Almanya', volunteers: 1800000, level: 'medium-high' },
  'FR': { name: 'Fransa', volunteers: 1600000, level: 'medium-high' },
  'MX': { name: 'Meksika', volunteers: 1300000, level: 'medium-high' },
  'ES': { name: 'İspanya', volunteers: 950000, level: 'medium-high' },
  'IT': { name: 'İtalya', volunteers: 880000, level: 'medium-high' },
  'KR': { name: 'G. Kore', volunteers: 820000, level: 'medium-high' },
  'CO': { name: 'Kolombiya', volunteers: 750000, level: 'medium-high' },
  'IR': { name: 'İran', volunteers: 690000, level: 'medium-high' },
  'PE': { name: 'Peru', volunteers: 580000, level: 'medium-high' },
  
  // Orta Seviye (100K-500K) - MEDIUM
  'ID': { name: 'Endonezya', volunteers: 680000, level: 'medium' },
  'TR': { name: 'Türkiye', volunteers: 156789, level: 'medium' }, // Statistics sayfasındaki veri
  'PH': { name: 'Filipinler', volunteers: 490000, level: 'medium' },
  'AR': { name: 'Arjantin', volunteers: 450000, level: 'medium' },
  'NG': { name: 'Nijerya', volunteers: 420000, level: 'medium' },
  'VN': { name: 'Vietnam', volunteers: 410000, level: 'medium' },
  'ZA': { name: 'G. Afrika', volunteers: 380000, level: 'medium' },
  'TH': { name: 'Tayland', volunteers: 340000, level: 'medium' },
  'EG': { name: 'Mısır', volunteers: 310000, level: 'medium' },
  'PL': { name: 'Polonya', volunteers: 280000, level: 'medium' },
  'MY': { name: 'Malezya', volunteers: 260000, level: 'medium' },
  'CL': { name: 'Şili', volunteers: 240000, level: 'medium' },
  'NL': { name: 'Hollanda', volunteers: 220000, level: 'medium' },
  'SA': { name: 'S. Arabistan', volunteers: 195000, level: 'medium' },
  'BD': { name: 'Bangladeş', volunteers: 185000, level: 'medium' },
  'ET': { name: 'Etiyopya', volunteers: 165000, level: 'medium' },
  'UA': { name: 'Ukrayna', volunteers: 155000, level: 'medium' },
  'KE': { name: 'Kenya', volunteers: 145000, level: 'medium' },
  'DZ': { name: 'Cezayir', volunteers: 135000, level: 'medium' },
  'MA': { name: 'Fas', volunteers: 125000, level: 'medium' },
  'VE': { name: 'Venezuela', volunteers: 115000, level: 'medium' },
  'RO': { name: 'Romanya', volunteers: 105000, level: 'medium' },
  
  // Düşük-Orta Seviye (<100K) - LOW-MEDIUM
  'GH': { name: 'Gana', volunteers: 95000, level: 'low-medium' },
  'UZ': { name: 'Özbekistan', volunteers: 88000, level: 'low-medium' },
  'IQ': { name: 'Irak', volunteers: 82000, level: 'low-medium' },
  'AF': { name: 'Afganistan', volunteers: 76000, level: 'low-medium' },
  'TZ': { name: 'Tanzanya', volunteers: 71000, level: 'low-medium' },
  'UG': { name: 'Uganda', volunteers: 68000, level: 'low-medium' },
  'SE': { name: 'İsveç', volunteers: 65000, level: 'low-medium' },
  'BE': { name: 'Belçika', volunteers: 62000, level: 'low-medium' },
  'CZ': { name: 'Çekya', volunteers: 58000, level: 'low-medium' },
  'PT': { name: 'Portekiz', volunteers: 55000, level: 'low-medium' },
  'GR': { name: 'Yunanistan', volunteers: 52000, level: 'low-medium' },
  'HU': { name: 'Macaristan', volunteers: 48000, level: 'low-medium' },
  'AT': { name: 'Avusturya', volunteers: 45000, level: 'low-medium' },
  'CH': { name: 'İsviçre', volunteers: 43000, level: 'low-medium' },
  'IL': { name: 'İsrail', volunteers: 41000, level: 'low-medium' },
  'BG': { name: 'Bulgaristan', volunteers: 38000, level: 'low-medium' },
  'RS': { name: 'Sırbistan', volunteers: 35000, level: 'low-medium' },
  'NZ': { name: 'Yeni Zelanda', volunteers: 33000, level: 'low-medium' },
  'NO': { name: 'Norveç', volunteers: 31000, level: 'low-medium' },
  'DK': { name: 'Danimarka', volunteers: 29000, level: 'low-medium' },
  'FI': { name: 'Finlandiya', volunteers: 27000, level: 'low-medium' },
  'SK': { name: 'Slovakya', volunteers: 25000, level: 'low-medium' },
  'HR': { name: 'Hırvatistan', volunteers: 23000, level: 'low-medium' },
  'AE': { name: 'BAE', volunteers: 21000, level: 'low-medium' },
  'SG': { name: 'Singapur', volunteers: 19000, level: 'low-medium' },
  'LB': { name: 'Lübnan', volunteers: 17000, level: 'low-medium' },
  'JO': { name: 'Ürdün', volunteers: 15000, level: 'low-medium' },
  'SY': { name: 'Suriye', volunteers: 13000, level: 'low-medium' },
  'KZ': { name: 'Kazakistan', volunteers: 11000, level: 'low-medium' },
  'LY': { name: 'Libya', volunteers: 9500, level: 'low-medium' },
  'SD': { name: 'Sudan', volunteers: 8700, level: 'low-medium' },
  'TN': { name: 'Tunus', volunteers: 8200, level: 'low-medium' },
  'YE': { name: 'Yemen', volunteers: 7800, level: 'low-medium' },
  'LK': { name: 'Sri Lanka', volunteers: 7400, level: 'low-medium' },
  'MM': { name: 'Myanmar', volunteers: 6900, level: 'low-medium' },
  'NP': { name: 'Nepal', volunteers: 6500, level: 'low-medium' },
  'CM': { name: 'Kamerun', volunteers: 6100, level: 'low-medium' },
  'CI': { name: 'Fildişi S.', volunteers: 5800, level: 'low-medium' },
  'MG': { name: 'Madagaskar', volunteers: 5400, level: 'low-medium' },
  'ZM': { name: 'Zambiya', volunteers: 5100, level: 'low-medium' },
  'SN': { name: 'Senegal', volunteers: 4800, level: 'low-medium' },
  'ZW': { name: 'Zimbabve', volunteers: 4500, level: 'low-medium' },
  'RW': { name: 'Ruanda', volunteers: 4200, level: 'low-medium' },
  'BJ': { name: 'Benin', volunteers: 3900, level: 'low-medium' },
  'BF': { name: 'Burkina Faso', volunteers: 3600, level: 'low-medium' },
  'ML': { name: 'Mali', volunteers: 3300, level: 'low-medium' },
  'MW': { name: 'Malavi', volunteers: 3000, level: 'low-medium' },
  'KH': { name: 'Kamboçya', volunteers: 2800, level: 'low-medium' },
  'LA': { name: 'Laos', volunteers: 2500, level: 'low-medium' },
  'MN': { name: 'Moğolistan', volunteers: 2200, level: 'low-medium' },
  'BT': { name: 'Butan', volunteers: 1900, level: 'low-medium' },
  'BI': { name: 'Burundi', volunteers: 1600, level: 'low-medium' },
  'GF': { name: 'Fransız Guyanası', volunteers: 1200, level: 'low-medium' },
  'AW': { name: 'Aruba', volunteers: 800, level: 'low-medium' },
  'AI': { name: 'Anguilla', volunteers: 300, level: 'low-medium' },
  'AS': { name: 'Amerikan Samoası', volunteers: 900, level: 'low-medium' },
  'AG': { name: 'Antigua ve Barbuda', volunteers: 1100, level: 'low-medium' },
  'BH': { name: 'Bahreyn', volunteers: 4200, level: 'low-medium' },
  'BS': { name: 'Bahamalar', volunteers: 3800, level: 'low-medium' },
  'BL': { name: 'Saint-Barthélemy', volunteers: 200, level: 'low-medium' },
  'BM': { name: 'Bermuda', volunteers: 1500, level: 'low-medium' },
  'BB': { name: 'Barbados', volunteers: 2100, level: 'low-medium' },
  'KM': { name: 'Komorlar', volunteers: 1700, level: 'low-medium' },
  'CV': { name: 'Yeşil Burun Adaları', volunteers: 2400, level: 'low-medium' },
  'CW': { name: 'Curaçao', volunteers: 1300, level: 'low-medium' },
  'KY': { name: 'Cayman Adaları', volunteers: 1100, level: 'low-medium' },
  'CY': { name: 'Kıbrıs', volunteers: 8500, level: 'low-medium' },
  'DM': { name: 'Dominika', volunteers: 900, level: 'low-medium' },
  'FK': { name: 'Falkland Adaları', volunteers: 500, level: 'low-medium' },
  'FO': { name: 'Faroe Adaları', volunteers: 800, level: 'low-medium' },
  'FM': { name: 'Mikronezya', volunteers: 1400, level: 'low-medium' },
  'GD': { name: 'Grenada', volunteers: 1200, level: 'low-medium' },
  'GU': { name: 'Guam', volunteers: 1800, level: 'low-medium' },
  'KN': { name: 'Saint Kitts ve Nevis', volunteers: 950, level: 'low-medium' },
  'LC': { name: 'Saint Lucia', volunteers: 1700, level: 'low-medium' },
  'MF': { name: 'Saint-Martin', volunteers: 650, level: 'low-medium' },
  'MV': { name: 'Maldivler', volunteers: 3100, level: 'low-medium' },
  'MH': { name: 'Marshall Adaları', volunteers: 850, level: 'low-medium' },
  'MT': { name: 'Malta', volunteers: 7200, level: 'low-medium' },
  'MP': { name: 'Kuzey Mariana Adaları', volunteers: 950, level: 'low-medium' },
  'MS': { name: 'Montserrat', volunteers: 400, level: 'low-medium' },
  'MU': { name: 'Mauritius', volunteers: 8900, level: 'low-medium' },
  'NC': { name: 'Yeni Kaledonya', volunteers: 2700, level: 'low-medium' },
  'NR': { name: 'Nauru', volunteers: 600, level: 'low-medium' },
  'PW': { name: 'Palau', volunteers: 900, level: 'low-medium' },
  'PR': { name: 'Porto Riko', volunteers: 24000, level: 'low-medium' },
  'PF': { name: 'Fransız Polinezyası', volunteers: 2900, level: 'low-medium' },
  'SB': { name: 'Solomon Adaları', volunteers: 3400, level: 'low-medium' },
  'ST': { name: 'São Tomé ve Príncipe', volunteers: 1100, level: 'low-medium' },
  'SX': { name: 'Sint Maarten', volunteers: 750, level: 'low-medium' },
  'SC': { name: 'Seyşeller', volunteers: 2200, level: 'low-medium' },
  'TC': { name: 'Turks ve Caicos Adaları', volunteers: 850, level: 'low-medium' },
  'TO': { name: 'Tonga', volunteers: 1800, level: 'low-medium' },
  'TT': { name: 'Trinidad ve Tobago', volunteers: 9500, level: 'low-medium' },
  'TV': { name: 'Tuvalu', volunteers: 650, level: 'low-medium' },
  'VC': { name: 'Saint Vincent ve Grenadinler', volunteers: 1400, level: 'low-medium' },
  'VG': { name: 'İngiliz Virgin Adaları', volunteers: 700, level: 'low-medium' },
  'VI': { name: 'ABD Virgin Adaları', volunteers: 1200, level: 'low-medium' },
  'VU': { name: 'Vanuatu', volunteers: 2100, level: 'low-medium' },
  'WS': { name: 'Samoa', volunteers: 1900, level: 'low-medium' },
  'YT': { name: 'Mayotte', volunteers: 1500, level: 'low-medium' },
  'RE': { name: 'Reunion', volunteers: 3200, level: 'low-medium' },
  'GP': { name: 'Guadeloupe', volunteers: 2800, level: 'low-medium' },
  'FJ': { name: 'Fiji', volunteers: 4100, level: 'low-medium' },
  'IC': { name: 'Kanarya Adaları', volunteers: 3500, level: 'low-medium' },
  'MQ': { name: 'Martinique', volunteers: 2600, level: 'low-medium' },
  'AO': { name: 'Angola', volunteers: 65000, level: 'low-medium' },
  'AZ': { name: 'Azerbaycan', volunteers: 42000, level: 'low-medium' },
  'BY': { name: 'Belarus', volunteers: 38000, level: 'low-medium' },
  'BO': { name: 'Bolivya', volunteers: 42000, level: 'low-medium' },
  'BA': { name: 'Bosna-Hersek', volunteers: 15000, level: 'low-medium' },
  'BW': { name: 'Botsvana', volunteers: 8200, level: 'low-medium' },
  'BN': { name: 'Brunei', volunteers: 3100, level: 'low-medium' },
  'CD': { name: 'Kongo Demokratik C.', volunteers: 48000, level: 'low-medium' },
  'CG': { name: 'Kongo Cumhuriyeti', volunteers: 19000, level: 'low-medium' },
  'CR': { name: 'Kosta Rika', volunteers: 18000, level: 'low-medium' },
  'CU': { name: 'Küba', volunteers: 35000, level: 'low-medium' },
  'DO': { name: 'Dominik Cumhuriyeti', volunteers: 26000, level: 'low-medium' },
  'EC': { name: 'Ekvador', volunteers: 48000, level: 'low-medium' },
  'SV': { name: 'El Salvador', volunteers: 22000, level: 'low-medium' },
  'GQ': { name: 'Ekvator Ginesi', volunteers: 4200, level: 'low-medium' },
  'ER': { name: 'Eritre', volunteers: 11000, level: 'low-medium' },
  'EE': { name: 'Estonya', volunteers: 6800, level: 'low-medium' },
  'GA': { name: 'Gabon', volunteers: 7500, level: 'low-medium' },
  'GM': { name: 'Gambiya', volunteers: 4800, level: 'low-medium' },
  'GE': { name: 'Gürcistan', volunteers: 16000, level: 'low-medium' },
  'GN': { name: 'Gine', volunteers: 21000, level: 'low-medium' },
  'GW': { name: 'Gine-Bissau', volunteers: 3900, level: 'low-medium' },
  'GY': { name: 'Guyana', volunteers: 5400, level: 'low-medium' },
  'HT': { name: 'Haiti', volunteers: 24000, level: 'low-medium' },
  'HN': { name: 'Honduras', volunteers: 19000, level: 'low-medium' },
  'IS': { name: 'İzlanda', volunteers: 4100, level: 'low-medium' },
  'IE': { name: 'İrlanda', volunteers: 24000, level: 'low-medium' },
  'JM': { name: 'Jamaika', volunteers: 11000, level: 'low-medium' },
  'KW': { name: 'Kuveyt', volunteers: 12000, level: 'low-medium' },
  'KG': { name: 'Kırgızistan', volunteers: 8700, level: 'low-medium' },
  'LV': { name: 'Letonya', volunteers: 9200, level: 'low-medium' },
  'LR': { name: 'Liberya', volunteers: 12000, level: 'low-medium' },
  'LT': { name: 'Litvanya', volunteers: 13000, level: 'low-medium' },
  'LU': { name: 'Lüksemburg', volunteers: 3800, level: 'low-medium' },
  'MK': { name: 'Kuzey Makedonya', volunteers: 9500, level: 'low-medium' },
  'MR': { name: 'Moritanya', volunteers: 7800, level: 'low-medium' },
  'MZ': { name: 'Mozambik', volunteers: 16000, level: 'low-medium' },
  'NA': { name: 'Namibya', volunteers: 8900, level: 'low-medium' },
  'NE': { name: 'Nijer', volunteers: 11000, level: 'low-medium' },
  'NI': { name: 'Nikaragua', volunteers: 14000, level: 'low-medium' },
  'KP': { name: 'Kuzey Kore', volunteers: 12000, level: 'low-medium' },
  'OM': { name: 'Umman', volunteers: 14000, level: 'low-medium' },
  'PA': { name: 'Panama', volunteers: 15000, level: 'low-medium' },
  'PG': { name: 'Papua Yeni Gine', volunteers: 19000, level: 'low-medium' },
  'PY': { name: 'Paraguay', volunteers: 18000, level: 'low-medium' },
  'QA': { name: 'Katar', volunteers: 8500, level: 'low-medium' },
  'MD': { name: 'Moldova', volunteers: 11000, level: 'low-medium' },
  'SI': { name: 'Slovenya', volunteers: 10000, level: 'low-medium' },
  'SO': { name: 'Somali', volunteers: 9200, level: 'low-medium' },
  'SS': { name: 'Güney Sudan', volunteers: 7100, level: 'low-medium' },
  'SR': { name: 'Surinam', volunteers: 4200, level: 'low-medium' },
  'SZ': { name: 'Esvatini', volunteers: 3800, level: 'low-medium' },
  'TJ': { name: 'Tacikistan', volunteers: 7400, level: 'low-medium' },
  'TL': { name: 'Doğu Timor', volunteers: 5100, level: 'low-medium' },
  'TG': { name: 'Togo', volunteers: 6800, level: 'low-medium' },
  'TM': { name: 'Türkmenistan', volunteers: 8200, level: 'low-medium' },
  'UY': { name: 'Uruguay', volunteers: 16000, level: 'low-medium' },
  'AM': { name: 'Ermenistan', volunteers: 9800, level: 'low-medium' },
  'AL': { name: 'Arnavutluk', volunteers: 11000, level: 'low-medium' },
  'AD': { name: 'Andorra', volunteers: 800, level: 'low-medium' },
  'LI': { name: 'Liechtenstein', volunteers: 450, level: 'low-medium' },
  'MC': { name: 'Monako', volunteers: 550, level: 'low-medium' },
  'SM': { name: 'San Marino', volunteers: 420, level: 'low-medium' },
  'VA': { name: 'Vatikan', volunteers: 150, level: 'low-medium' },
  'ME': { name: 'Karadağ', volunteers: 4200, level: 'low-medium' },
  'XK': { name: 'Kosova', volunteers: 6800, level: 'low-medium' },
  'PS': { name: 'Filistin', volunteers: 12000, level: 'low-medium' },
  'EH': { name: 'Batı Sahra', volunteers: 2100, level: 'low-medium' },
  'DJ': { name: 'Cibuti', volunteers: 2900, level: 'low-medium' },
  'SL': { name: 'Sierra Leone', volunteers: 8700, level: 'low-medium' },
  'LS': { name: 'Lesotho', volunteers: 4200, level: 'low-medium' },
  'BZ': { name: 'Belize', volunteers: 3500, level: 'low-medium' },
  'GT': { name: 'Guatemala', volunteers: 28000, level: 'low-medium' },
  
  // Class bazlı ülkeler (SVG'de class attribute ile)
  'Argentina': { name: 'Arjantin', volunteers: 450000, level: 'medium' },
  'Australia': { name: 'Avustralya', volunteers: 1900000, level: 'medium-high' },
  'Canada': { name: 'Kanada', volunteers: 2400000, level: 'medium-high' },
  'Angola': { name: 'Angola', volunteers: 65000, level: 'low-medium' },
  'China': { name: 'Çin', volunteers: 8400000, level: 'high' },
  'Azerbaijan': { name: 'Azerbaycan', volunteers: 42000, level: 'low-medium' },
  'Denmark': { name: 'Danimarka', volunteers: 29000, level: 'low-medium' },
  'United Kingdom': { name: 'İngiltere', volunteers: 2100000, level: 'medium-high' },
  'United States': { name: 'ABD', volunteers: 15200000, level: 'high' },
  'Russian Federation': { name: 'Rusya', volunteers: 4200000, level: 'high' },
  'France': { name: 'Fransa', volunteers: 1600000, level: 'medium-high' },
  'American Samoa': { name: 'Amerikan Samoası', volunteers: 900, level: 'low-medium' },
  'Antigua and Barbuda': { name: 'Antigua ve Barbuda', volunteers: 1100, level: 'low-medium' },
  'Comoros': { name: 'Komorlar', volunteers: 1700, level: 'low-medium' },
  'Cape Verde': { name: 'Yeşil Burun Adaları', volunteers: 2400, level: 'low-medium' },
  'Cayman Islands': { name: 'Cayman Adaları', volunteers: 1100, level: 'low-medium' },
  'Cyprus': { name: 'Kıbrıs', volunteers: 8500, level: 'low-medium' },
  'Falkland Islands': { name: 'Falkland Adaları', volunteers: 500, level: 'low-medium' },
  'Faeroe Islands': { name: 'Faroe Adaları', volunteers: 800, level: 'low-medium' },
  'Federated States of Micronesia': { name: 'Mikronezya', volunteers: 1400, level: 'low-medium' },
  'Saint Kitts and Nevis': { name: 'Saint Kitts ve Nevis', volunteers: 950, level: 'low-medium' },
  'Malta': { name: 'Malta', volunteers: 7200, level: 'low-medium' },
  'Northern Mariana Islands': { name: 'Kuzey Mariana Adaları', volunteers: 950, level: 'low-medium' },
  'Mauritius': { name: 'Mauritius', volunteers: 8900, level: 'low-medium' },
  'New Caledonia': { name: 'Yeni Kaledonya', volunteers: 2700, level: 'low-medium' },
  'French Polynesia': { name: 'Fransız Polinezyası', volunteers: 2900, level: 'low-medium' },
  'Solomon Islands': { name: 'Solomon Adaları', volunteers: 3400, level: 'low-medium' },
  'São Tomé and Principe': { name: 'São Tomé ve Príncipe', volunteers: 1100, level: 'low-medium' },
  'Seychelles': { name: 'Seyşeller', volunteers: 2200, level: 'low-medium' },
  'Turks and Caicos Islands': { name: 'Turks ve Caicos Adaları', volunteers: 850, level: 'low-medium' },
  'Tonga': { name: 'Tonga', volunteers: 1800, level: 'low-medium' },
  'Trinidad and Tobago': { name: 'Trinidad ve Tobago', volunteers: 9500, level: 'low-medium' },
  'United States Virgin Islands': { name: 'ABD Virgin Adaları', volunteers: 1200, level: 'low-medium' },
  'Vanuatu': { name: 'Vanuatu', volunteers: 2100, level: 'low-medium' },
  'Samoa': { name: 'Samoa', volunteers: 1900, level: 'low-medium' },
  'Guadeloupe': { name: 'Guadeloupe', volunteers: 2800, level: 'low-medium' },
  'Fiji': { name: 'Fiji', volunteers: 4100, level: 'low-medium' },
  'Canary Islands (Spain)': { name: 'Kanarya Adaları', volunteers: 3500, level: 'low-medium' },
  'Bahamas': { name: 'Bahamalar', volunteers: 3800, level: 'low-medium' },
  'Puerto Rico': { name: 'Porto Riko', volunteers: 24000, level: 'low-medium' },
  'Turkey': { name: 'Türkiye', volunteers: 156789, level: 'medium' },
};

const getColorByLevel = (level) => {
  const colors = {
    'high': '#10b981',           // Yeşil (En Yüksek)
    'medium-high': '#84cc16',    // Açık Yeşil
    'medium': '#fbbf24',         // Sarı (Orta)
    'low-medium': '#ef4444',     // Kırmızı (En Düşük)
    'default': '#e5e7eb'         // Gri
  };
  return colors[level] || colors.default;
};

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

export default function WorldSVGMap() {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    // SVG dosyasını yükle
    fetch('/media/world.svg')
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (svgElement) {
          // SVG boyutlarını responsive yap
          svgElement.removeAttribute('width');
          svgElement.removeAttribute('height');
          svgElement.setAttribute('width', '100%');
          svgElement.setAttribute('height', '100%');
          
          // Tüm path elementlerini bul ve renklendir
          const paths = svgElement.querySelectorAll('path');
          paths.forEach(path => {
            const countryId = path.getAttribute('id');
            const countryClass = path.getAttribute('class');
            
            let countryCode = null;
            let countryInfo = null;
            
            // Önce ID'ye bak (2 harfli kod)
            if (countryId && COUNTRY_DATA[countryId.toUpperCase()]) {
              countryCode = countryId.toUpperCase();
              countryInfo = COUNTRY_DATA[countryCode];
            } 
            // Sonra class'a bak
            else if (countryClass) {
              const className = countryClass.trim();
              if (COUNTRY_DATA[className]) {
                countryCode = className;
                countryInfo = COUNTRY_DATA[className];
              }
            }
            
            // Renk ata
            if (countryInfo) {
              const color = getColorByLevel(countryInfo.level);
              path.setAttribute('fill', color);
              path.setAttribute('data-country', countryCode);
            } else {
              path.setAttribute('fill', '#e5e7eb');
            }
            
            // Hover efekti için class ekle
            path.classList.add('country-path');
          });
          
          setSvgContent(svgElement.outerHTML);
        }
      })
      .catch(error => console.error('SVG yüklenemedi:', error));
  }, []);

  const handleMouseEnter = (e) => {
    const countryCode = e.target.getAttribute('data-country');
    if (countryCode && COUNTRY_DATA[countryCode]) {
      setHoveredCountry(countryCode);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 overflow-hidden">
      <style>{`
        .country-path {
          stroke: #ffffff;
          stroke-width: 0.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .country-path:hover {
          filter: brightness(1.2);
          stroke-width: 1.5;
        }
        .world-map-container {
          width: 100%;
          height: auto;
          max-height: 500px;
        }
        .world-map-container svg {
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
      
      {svgContent ? (
        <div 
          className="world-map-container"
          dangerouslySetInnerHTML={{ __html: svgContent }}
          onMouseOver={handleMouseEnter}
          onMouseOut={handleMouseLeave}
        />
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredCountry && COUNTRY_DATA[hoveredCountry] && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-10 pointer-events-none">
          <div className="font-bold text-lg">{COUNTRY_DATA[hoveredCountry].name}</div>
          <div className="text-gray-300">
            {formatNumber(COUNTRY_DATA[hoveredCountry].volunteers)} gönüllü
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 text-sm">
        <div className="font-bold mb-3 text-gray-800">Gönüllü Seviyeleri</div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-gray-700">Yüksek (&gt;1M)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#84cc16' }}></div>
            <span className="text-gray-700">Orta-Yüksek (500K-1M)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
            <span className="text-gray-700">Orta (100K-500K)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-gray-700">Düşük (&lt;100K)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gray-200"></div>
            <span className="text-gray-700">Veri Yok</span>
          </div>
        </div>
      </div>
    </div>
  );
}
