/**
 * ISO 4217 Currency Codes
 * Three-letter codes representing currencies according to the ISO 4217 standard.
 *
 * @see {@link https://www.iso.org/iso-4217-currency-codes.html | ISO 4217}
 */
export type IsoCurrency =
  /** United Arab Emirates Dirham */
  | "AED"
  /** Afghan Afghani */
  | "AFN"
  /** Albanian Lek */
  | "ALL"
  /** Armenian Dram */
  | "AMD"
  /** Netherlands Antillean Guilder */
  | "ANG"
  /** Angolan Kwanza */
  | "AOA"
  /** Argentine Peso */
  | "ARS"
  /** Australian Dollar */
  | "AUD"
  /** Aruban Florin */
  | "AWG"
  /** Azerbaijani Manat */
  | "AZN"
  /** Bosnia and Herzegovina Convertible Mark */
  | "BAM"
  /** Barbados Dollar */
  | "BBD"
  /** Bangladeshi Taka */
  | "BDT"
  /** Bulgarian Lev */
  | "BGN"
  /** Bahraini Dinar */
  | "BHD"
  /** Burundian Franc */
  | "BIF"
  /** Bermudian Dollar */
  | "BMD"
  /** Brunei Dollar */
  | "BND"
  /** Boliviano */
  | "BOB"
  /** Brazilian Real */
  | "BRL"
  /** Bahamian Dollar */
  | "BSD"
  /** Bhutanese Ngultrum */
  | "BTN"
  /** Botswana Pula */
  | "BWP"
  /** Belarusian Ruble */
  | "BYN"
  /** Belize Dollar */
  | "BZD"
  /** Canadian Dollar */
  | "CAD"
  /** Congolese Franc */
  | "CDF"
  /** Swiss Franc */
  | "CHF"
  /** Chilean Peso */
  | "CLP"
  /** Chinese Yuan */
  | "CNY"
  /** Colombian Peso */
  | "COP"
  /** Costa Rican Colon */
  | "CRC"
  /** Cuban Peso */
  | "CUP"
  /** Cape Verde Escudo */
  | "CVE"
  /** Czech Koruna */
  | "CZK"
  /** Djiboutian Franc */
  | "DJF"
  /** Danish Krone */
  | "DKK"
  /** Dominican Peso */
  | "DOP"
  /** Algerian Dinar */
  | "DZD"
  /** Egyptian Pound */
  | "EGP"
  /** Eritrean Nakfa */
  | "ERN"
  /** Ethiopian Birr */
  | "ETB"
  /** Euro */
  | "EUR"
  /** Fiji Dollar */
  | "FJD"
  /** Falkland Islands Pound */
  | "FKP"
  /** Pound Sterling */
  | "GBP"
  /** Georgian Lari */
  | "GEL"
  /** Ghanaian Cedi */
  | "GHS"
  /** Gibraltar Pound */
  | "GIP"
  /** Gambian Dalasi */
  | "GMD"
  /** Guinean Franc */
  | "GNF"
  /** Guatemalan Quetzal */
  | "GTQ"
  /** Guyanese Dollar */
  | "GYD"
  /** Hong Kong Dollar */
  | "HKD"
  /** Honduran Lempira */
  | "HNL"
  /** Croatian Kuna */
  | "HRK"
  /** Haitian Gourde */
  | "HTG"
  /** Hungarian Forint */
  | "HUF"
  /** Indonesian Rupiah */
  | "IDR"
  /** Israeli New Shekel */
  | "ILS"
  /** Indian Rupee */
  | "INR"
  /** Iraqi Dinar */
  | "IQD"
  /** Iranian Rial */
  | "IRR"
  /** Icelandic Króna */
  | "ISK"
  /** Jamaican Dollar */
  | "JMD"
  /** Jordanian Dinar */
  | "JOD"
  /** Japanese Yen */
  | "JPY"
  /** Kenyan Shilling */
  | "KES"
  /** Kyrgyzstani Som */
  | "KGS"
  /** Cambodian Riel */
  | "KHR"
  /** Comoro Franc */
  | "KMF"
  /** North Korean Won */
  | "KPW"
  /** South Korean Won */
  | "KRW"
  /** Kuwaiti Dinar */
  | "KWD"
  /** Cayman Islands Dollar */
  | "KYD"
  /** Kazakhstani Tenge */
  | "KZT"
  /** Lao Kip */
  | "LAK"
  /** Lebanese Pound */
  | "LBP"
  /** Sri Lankan Rupee */
  | "LKR"
  /** Liberian Dollar */
  | "LRD"
  /** Lesotho Loti */
  | "LSL"
  /** Libyan Dinar */
  | "LYD"
  /** Moroccan Dirham */
  | "MAD"
  /** Moldovan Leu */
  | "MDL"
  /** Malagasy Ariary */
  | "MGA"
  /** Macedonian Denar */
  | "MKD"
  /** Myanmar Kyat */
  | "MMK"
  /** Mongolian Tugrik */
  | "MNT"
  /** Macanese Pataca */
  | "MOP"
  /** Mauritanian Ouguiya */
  | "MRU"
  /** Mauritian Rupee */
  | "MUR"
  /** Maldivian Rufiyaa */
  | "MVR"
  /** Malawian Kwacha */
  | "MWK"
  /** Mexican Peso */
  | "MXN"
  /** Malaysian Ringgit */
  | "MYR"
  /** Mozambican Metical */
  | "MZN"
  /** Namibian Dollar */
  | "NAD"
  /** Nigerian Naira */
  | "NGN"
  /** Nicaraguan Córdoba */
  | "NIO"
  /** Norwegian Krone */
  | "NOK"
  /** Nepalese Rupee */
  | "NPR"
  /** New Zealand Dollar */
  | "NZD"
  /** Omani Rial */
  | "OMR"
  /** Panamanian Balboa */
  | "PAB"
  /** Peruvian Sol */
  | "PEN"
  /** Papua New Guinean Kina */
  | "PGK"
  /** Philippine Peso */
  | "PHP"
  /** Pakistani Rupee */
  | "PKR"
  /** Polish Złoty */
  | "PLN"
  /** Paraguayan Guaraní */
  | "PYG"
  /** Qatari Riyal */
  | "QAR"
  /** Romanian Leu */
  | "RON"
  /** Serbian Dinar */
  | "RSD"
  /** Russian Ruble */
  | "RUB"
  /** Rwandan Franc */
  | "RWF"
  /** Saudi Riyal */
  | "SAR"
  /** Solomon Islands Dollar */
  | "SBD"
  /** Seychelles Rupee */
  | "SCR"
  /** Sudanese Pound */
  | "SDG"
  /** Swedish Krona */
  | "SEK"
  /** Singapore Dollar */
  | "SGD"
  /** Saint Helena Pound */
  | "SHP"
  /** Sierra Leonean Leone */
  | "SLL"
  /** Somali Shilling */
  | "SOS"
  /** Surinamese Dollar */
  | "SRD"
  /** South Sudanese Pound */
  | "SSP"
  /** São Tomé and Príncipe Dobra */
  | "STN"
  /** Salvadoran Colón */
  | "SVC"
  /** Syrian Pound */
  | "SYP"
  /** Swazi Lilangeni */
  | "SZL"
  /** Thai Baht */
  | "THB"
  /** Tajikistani Somoni */
  | "TJS"
  /** Turkmenistan Manat */
  | "TMT"
  /** Tunisian Dinar */
  | "TND"
  /** Tongan Paʻanga */
  | "TOP"
  /** Turkish Lira */
  | "TRY"
  /** Trinidad and Tobago Dollar */
  | "TTD"
  /** New Taiwan Dollar */
  | "TWD"
  /** Tanzanian Shilling */
  | "TZS"
  /** Ukrainian Hryvnia */
  | "UAH"
  /** Ugandan Shilling */
  | "UGX"
  /** United States Dollar */
  | "USD"
  /** Uruguayan Peso */
  | "UYU"
  /** Uzbekistan Som */
  | "UZS"
  /** Venezuelan Bolívar Soberano */
  | "VES"
  /** Vietnamese Đồng */
  | "VND"
  /** Vanuatu Vatu */
  | "VUV"
  /** Samoan Tala */
  | "WST"
  /** CFA Franc BEAC */
  | "XAF"
  /** East Caribbean Dollar */
  | "XCD"
  /** CFA Franc BCEAO */
  | "XOF"
  /** CFP Franc */
  | "XPF"
  /** Yemeni Rial */
  | "YER"
  /** South African Rand */
  | "ZAR"
  /** Zambian Kwacha */
  | "ZMW"
  /** Zimbabwean Dollar */
  | "ZWL";
