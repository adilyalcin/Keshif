// turn on social share by default
var socialShare = true;
// turn on rubbon by default
var githubButton = false;

function resizeBrowser(minWidth, minHeight){
    if(minWidth) $('#demo_Browser').width($(window).width()-minWidth);
    if(minHeight) $('#demo_Browser').height($(window).height()-minHeight);
};

var getIcon = function(v){
    var iconName="";
    switch(v.toLowerCase()){
        case "male": 
        case "m": 
            iconName = "male"; break;
        case "female": 
        case "f": 
            iconName = "female"; break;
        case "organization": 
            iconName = "university"; break;
        case "medicine": 
            iconName = "stethoscope"; break;
        case "economics": 
            iconName = "money"; break;
        case "literature": 
            iconName = "book"; break;
        case "physics": 
            iconName = "bolt"; break;
        case "chemistry": 
            iconName = "flask"; break;
        case "peace": 
            iconName = "flag-o"; break;
    }
    return "<span class='fa fa-"+iconName+"'></span>";
};

var US_States = { 
  index_code: {},
  index_id: {},
  index_name: {},
  data: [
    {code: 'AL', id:1 , name: 'Alabama' },
    {code: 'AK', id:2 , name: 'Alaska' },
    {code: 'AZ', id:4 , name: 'Arizona' },
    {code: 'AR', id:5 , name: 'Arkansas' },
    {code: 'CA', id:6 , name: 'California' },
    {code: 'CO', id:8 , name: 'Colorado' },
    {code: 'CT', id:9 , name: 'Connecticut' },
    {code: 'DE', id:10 , name: 'Delaware' },
    {code: 'DC', id:11 , name: 'District of Columbia' },
    {code: 'FL', id:12 , name: 'Florida' },
    {code: 'GA', id:13 , name: 'Georgia' },
    {code: 'HI', id:15 , name: 'Hawaii' },
    {code: 'ID', id:16 , name: 'Idaho' },
    {code: 'IL', id:17 , name: 'Illinois' },
    {code: 'IN', id:18 , name: 'Indiana' },
    {code: 'IA', id:19 , name: 'Iowa' },
    {code: 'KS', id:20 , name: 'Kansas' },
    {code: 'KY', id:21 , name: 'Kentucky' },
    {code: 'LA', id:22 , name: 'Louisiana' },
    {code: 'ME', id:23 , name: 'Maine' },
    {code: 'MD', id:24 , name: 'Maryland' },
    {code: 'MA', id:25 , name: 'Massachusetts' },
    {code: 'MI', id:26 , name: 'Michigan' },
    {code: 'MN', id:27 , name: 'Minnesota' },
    {code: 'MS', id:28 , name: 'Mississippi' },
    {code: 'MO', id:29 , name: 'Missouri' },
    {code: 'MT', id:30 , name: 'Montana' },
    {code: 'NE', id:31 , name: 'Nebraska' },
    {code: 'NV', id:32 , name: 'Nevada' },
    {code: 'NH', id:33 , name: 'New Hampshire' },
    {code: 'NJ', id:34 , name: 'New Jersey' },
    {code: 'NM', id:35 , name: 'New Mexico' },
    {code: 'NY', id:36 , name: 'New York' },
    {code: 'NC', id:37 , name: 'North Carolina' },
    {code: 'ND', id:38 , name: 'North Dakota' },
    {code: 'OH', id:39 , name: 'Ohio' },
    {code: 'OK', id:40 , name: 'Oklahoma' },
    {code: 'OR', id:41 , name: 'Oregon' },
    {code: 'PA', id:42 , name: 'Pennsylvania' },
    {code: 'RI', id:44 , name: 'Rhode Island' },
    {code: 'SC', id:45 , name: 'South Carolina' },
    {code: 'SD', id:46 , name: 'South Dakota' },
    {code: 'TN', id:47 , name: 'Tennessee' },
    {code: 'TX', id:48 , name: 'Texas' },
    {code: 'UT', id:49 , name: 'Utah' },
    {code: 'VT', id:50 , name: 'Vermont' },
    {code: 'VA', id:51 , name: 'Virginia' },
    {code: 'WA', id:53 , name: 'Washington' },
    {code: 'WV', id:54 , name: 'West Virginia' },
    {code: 'WI', id:55 , name: 'Wisconsin' },
    {code: 'WY', id:56 , name: 'Wyoming' },
    {code: 'AS', id:60 , name: 'American Samoa' },
    {code: 'GU', id:66 , name: 'GUAM' },
    {code: 'MP', id:69 , name: 'Northern Mariana Islands' },
    {code: 'PR', id:72 , name: 'Puerto Rico' },
    {code: 'VI', id:78 , name: 'Virgin Islands' },
    {            id:14 , name: 'Guam' },
    {            id:79 , name: 'Wake Island' },
    {            id:81 , name: 'Baker Island' },
    {            id:84 , name: 'Howland Island' },
    {            id:86 , name: 'Jarvis Island' },
    {            id:89 , name: 'Kingman Reef' },
    {            id:95 , name: 'Palmyra Atoll' },
  ],
  loadGeo: function(){
    $.ajax({
      // Load state geometries
      url: 'data/us-counties-states-FIPS.json',
      async: false,
      success: function(topojsonData){
        topojson.feature(topojsonData, topojsonData.objects.states)
          .features.forEach(function(feature){
            var state = US_States.index_id[feature.id];
            if(state) state.geo = feature;
          });
      }
    });
  }
};

US_States.data.forEach(function(s){
  if(s.id) US_States.index_id[s.id] = s;
  if(s.code) US_States.index_code[s.code] = s;
  if(s.name) US_States.index_name[s.name] = s;
});

var getStateName = function(v){
  var state = US_States.index_code[v];
  if(state) return state.name;
  return "Unknown: "+v;
};

var _demo = {
  Month: {
    0:  "January",
    1:  "February",
    2:  "March",
    3:  "April",
    4:  "May",
    5:  "June",
    6:  "July",
    7:  "August",
    8:  "September",
    9:  "October",
    10: "November",
    11: "December",
  },
  DayOfWeek: {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  },
  // Can be used for sorting
  DayOfWeek_id: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  Month_id: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
};

// Based on ISO_3166 codes
// ISO 3166-1 numeric
// ISO 3166-1 alpha-2
kshf.Countries = {
  index_alpha: {},
  index_num: {},
  index_name: {},
  data: [
    { alpha: 'AD', num: 020, name: "Andorra" },
    { alpha: 'AE', num: 784, name: "United Arab Emirates" },
    { alpha: 'AF', num: 004, name: "Afghanistan" },
    { alpha: 'AG', num: 028, name: "Antigua and Barbuda" },
    { alpha: 'AI', num: 660, name: "Anguilla" },
    { alpha: 'AL', num: 008, name: "Albania" },
    { alpha: 'AM', num: 051, name: "Armenia" },
    { alpha: 'AO', num: 024, name: "Angola" },
    { alpha: 'AQ', num: 010, name: "Antarctica" },
    { alpha: 'AR', num: 032, name: "Argentina" },
    { alpha: 'AS', num: 016, name: "American Samoa" },
    { alpha: 'AT', num: 040, name: "Austria" },
    { alpha: 'AU', num: 036, name: "Australia" },
    { alpha: 'AW', num: 533, name: "Aruba" },
    { alpha: 'AX', num: 248, name: "Åland Islands" },
    { alpha: 'AZ', num: 031, name: "Azerbaijan" },
    { alpha: 'BA', num: 070, name: "Bosnia and Herzegovina" },
    { alpha: 'BB', num: 052, name: "Barbados" },
    { alpha: 'BD', num: 050, name: "Bangladesh" },
    { alpha: 'BE', num: 056, name: "Belgium" },
    { alpha: 'BF', num: 854, name: "Burkina Faso" },
    { alpha: 'BG', num: 100, name: "Bulgaria" },
    { alpha: 'BH', num: 048, name: "Bahrain" },
    { alpha: 'BI', num: 108, name: "Burundi" },
    { alpha: 'BJ', num: 204, name: "Benin" },
    { alpha: 'BL', num: 652, name: "Saint Barthélemy" },
    { alpha: 'BM', num: 060, name: "Bermuda" },
    { alpha: 'BN', num: 096, name: "Brunei Darussalam" },
    { alpha: 'BO', num: 068, name: "Bolivia, Plurinational State of" },
    { alpha: 'BQ', num: 535, name: "Bonaire, Sint Eustatius and Saba" },
    { alpha: 'BR', num: 076, name: "Brazil" },
    { alpha: 'BS', num: 044, name: "Bahamas" },
    { alpha: 'BT', num: 064, name: "Bhutan" },
    { alpha: 'BV', num: 074, name: "Bouvet Island" },
    { alpha: 'BW', num: 072, name: "Botswana" },
    { alpha: 'BY', num: 112, name: "Belarus" },
    { alpha: 'BZ', num: 084, name: "Belize" },
    { alpha: 'CA', num: 124, name: "Canada" },
    { alpha: 'CC', num: 166, name: "Cocos (Keeling) Islands" },
    { alpha: 'CD', num: 180, name: "Congo, the Democratic Republic of the" },
    { alpha: 'CF', num: 140, name: "Central African Republic" },
    { alpha: 'CG', num: 178, name: "Congo" },
    { alpha: 'CH', num: 756, name: "Switzerland" },
    { alpha: 'CI', num: 384, name: "Côte d'Ivoire" },
    { alpha: 'CK', num: 184, name: "Cook Islands" },
    { alpha: 'CL', num: 152, name: "Chile" },
    { alpha: 'CM', num: 120, name: "Cameroon" },
    { alpha: 'CN', num: 156, name: "China" },
    { alpha: 'CO', num: 170, name: "Colombia" },
    { alpha: 'CR', num: 188, name: "Costa Rica" },
    { alpha: 'CU', num: 192, name: "Cuba" },
    { alpha: 'CV', num: 132, name: "Cabo Verde" },
    { alpha: 'CW', num: 531, name: "Curaçao" },
    { alpha: 'CX', num: 162, name: "Christmas Island" },
    { alpha: 'CY', num: 196, name: "Cyprus" },
    { alpha: 'CZ', num: 203, name: "Czech Republic" },
    { alpha: 'DE', num: 276, name: "Germany" },
    { alpha: 'DJ', num: 262, name: "Djibouti" },
    { alpha: 'DK', num: 208, name: "Denmark" },
    { alpha: 'DM', num: 212, name: "Dominica" },
    { alpha: 'DO', num: 214, name: "Dominican Republic" },
    { alpha: 'DZ', num: 012, name: "Algeria" },
    { alpha: 'EC', num: 218, name: "Ecuador" },
    { alpha: 'EE', num: 233, name: "Estonia" },
    { alpha: 'EG', num: 818, name: "Egypt" },
    { alpha: 'EH', num: 732, name: "Western Sahara" },
    { alpha: 'ER', num: 232, name: "Eritrea" },
    { alpha: 'ES', num: 724, name: "Spain" },
    { alpha: 'ET', num: 231, name: "Ethiopia" },
    { alpha: 'FI', num: 246, name: "Finland" },
    { alpha: 'FJ', num: 242, name: "Fiji" },
    { alpha: 'FK', num: 238, name: "Falkland Islands (Malvinas)" },
    { alpha: 'FM', num: 583, name: "Micronesia, Federated States of" },
    { alpha: 'FO', num: 234, name: "Faroe Islands" },
    { alpha: 'FR', num: 250, name: "France" },
    { alpha: 'GA', num: 266, name: "Gabon" },
    { alpha: 'GB', num: 826, name: "United Kingdom of Great Britain and Northern Ireland" },
    { alpha: 'GD', num: 308, name: "Grenada" },
    { alpha: 'GE', num: 268, name: "Georgia" },
    { alpha: 'GF', num: 254, name: "French Guiana" },
    { alpha: 'GG', num: 831, name: "Guernsey" },
    { alpha: 'GH', num: 288, name: "Ghana" },
    { alpha: 'GI', num: 292, name: "Gibraltar" },
    { alpha: 'GL', num: 304, name: "Greenland" },
    { alpha: 'GM', num: 270, name: "Gambia" },
    { alpha: 'GN', num: 324, name: "Guinea" },
    { alpha: 'GP', num: 312, name: "Guadeloupe" },
    { alpha: 'GQ', num: 226, name: "Equatorial Guinea" },
    { alpha: 'GR', num: 300, name: "Greece" },
    { alpha: 'GS', num: 239, name: "South Georgia and the South Sandwich Islands" },
    { alpha: 'GT', num: 320, name: "Guatemala" },
    { alpha: 'GU', num: 316, name: "Guam" },
    { alpha: 'GW', num: 624, name: "Guinea-Bissau" },
    { alpha: 'GY', num: 328, name: "Guyana" },
    { alpha: 'HK', num: 344, name: "Hong Kong" },
    { alpha: 'HM', num: 334, name: "Heard Island and McDonald Islands" },
    { alpha: 'HN', num: 340, name: "Honduras" },
    { alpha: 'HR', num: 191, name: "Croatia" },
    { alpha: 'HT', num: 332, name: "Haiti" },
    { alpha: 'HU', num: 348, name: "Hungary" },
    { alpha: 'ID', num: 360, name: "Indonesia" },
    { alpha: 'IE', num: 372, name: "Ireland" },
    { alpha: 'IL', num: 376, name: "Israel" },
    { alpha: 'IM', num: 833, name: "Isle of Man" },
    { alpha: 'IN', num: 356, name: "India" },
    { alpha: 'IO', num: 086, name: "British Indian Ocean Territory" },
    { alpha: 'IQ', num: 368, name: "Iraq" },
    { alpha: 'IR', num: 364, name: "Iran, Islamic Republic of" },
    { alpha: 'IS', num: 352, name: "Iceland" },
    { alpha: 'IT', num: 380, name: "Italy" },
    { alpha: 'JE', num: 832, name: "Jersey" },
    { alpha: 'JM', num: 388, name: "Jamaica" },
    { alpha: 'JO', num: 400, name: "Jordan" },
    { alpha: 'JP', num: 392, name: "Japan" },
    { alpha: 'KE', num: 404, name: "Kenya" },
    { alpha: 'KG', num: 417, name: "Kyrgyzstan" },
    { alpha: 'KH', num: 116, name: "Cambodia" },
    { alpha: 'KI', num: 296, name: "Kiribati" },
    { alpha: 'KM', num: 174, name: "Comoros" },
    { alpha: 'KN', num: 659, name: "Saint Kitts and Nevis" },
    { alpha: 'KP', num: 408, name: "Korea, Democratic People's Republic of" },
    { alpha: 'KR', num: 410, name: "Korea, Republic of" },
    { alpha: 'KW', num: 414, name: "Kuwait" },
    { alpha: 'KY', num: 136, name: "Cayman Islands" },
    { alpha: 'KZ', num: 398, name: "Kazakhstan" },
    { alpha: 'LA', num: 428, name: "Lao People's Democratic Republic" },
    { alpha: 'LB', num: 422, name: "Lebanon" },
    { alpha: 'LC', num: 662, name: "Saint Lucia" },
    { alpha: 'LI', num: 438, name: "Liechtenstein" },
    { alpha: 'LK', num: 144, name: "Sri Lanka" },
    { alpha: 'LR', num: 430, name: "Liberia" },
    { alpha: 'LS', num: 426, name: "Lesotho" },
    { alpha: 'LT', num: 440, name: "Lithuania" },
    { alpha: 'LU', num: 442, name: "Luxembourg" },
    { alpha: 'LV', num: 428, name: "Latvia" },
    { alpha: 'LY', num: 434, name: "Libya" },
    { alpha: 'MA', num: 504, name: "Morocco" },
    { alpha: 'MC', num: 492, name: "Monaco" },
    { alpha: 'MD', num: 498, name: "Moldova, Republic of" },
    { alpha: 'ME', num: 499, name: "Montenegro" },
    { alpha: 'MF', num: 663, name: "Saint Martin (French part)" },
    { alpha: 'MG', num: 450, name: "Madagascar" },
    { alpha: 'MH', num: 584, name: "Marshall Islands" },
    { alpha: 'MK', num: 807, name: "Macedonia, the former Yugoslav Republic of" },
    { alpha: 'ML', num: 466, name: "Mali" },
    { alpha: 'MM', num: 104, name: "Myanmar" },
    { alpha: 'MN', num: 496, name: "Mongolia" },
    { alpha: 'MO', num: 446, name: "Macao" },
    { alpha: 'MP', num: 580, name: "Northern Mariana Islands" },
    { alpha: 'MQ', num: 474, name: "Martinique" },
    { alpha: 'MR', num: 478, name: "Mauritania" },
    { alpha: 'MS', num: 500, name: "Montserrat" },
    { alpha: 'MT', num: 470, name: "Malta" },
    { alpha: 'MU', num: 480, name: "Mauritius" },
    { alpha: 'MV', num: 462, name: "Maldives" },
    { alpha: 'MW', num: 454, name: "Malawi" },
    { alpha: 'MX', num: 484, name: "Mexico" },
    { alpha: 'MY', num: 458, name: "Malaysia" },
    { alpha: 'MZ', num: 508, name: "Mozambique" },
    { alpha: 'NA', num: 516, name: "Namibia" },
    { alpha: 'NC', num: 540, name: "New Caledonia" },
    { alpha: 'NE', num: 562, name: "Niger" },
    { alpha: 'NF', num: 574, name: "Norfolk Island" },
    { alpha: 'NG', num: 566, name: "Nigeria" },
    { alpha: 'NI', num: 558, name: "Nicaragua" },
    { alpha: 'NL', num: 528, name: "Netherlands" },
    { alpha: 'NO', num: 578, name: "Norway" },
    { alpha: 'NP', num: 524, name: "Nepal" },
    { alpha: 'NR', num: 520, name: "Nauru" },
    { alpha: 'NU', num: 570, name: "Niue" },
    { alpha: 'NZ', num: 554, name: "New Zealand" },
    { alpha: 'OM', num: 512, name: "Oman" },
    { alpha: 'PA', num: 591, name: "Panama" },
    { alpha: 'PE', num: 604, name: "Peru" },
    { alpha: 'PF', num: 258, name: "French Polynesia" },
    { alpha: 'PG', num: 598, name: "Papua New Guinea" },
    { alpha: 'PH', num: 608, name: "Philippines" },
    { alpha: 'PK', num: 586, name: "Pakistan" },
    { alpha: 'PL', num: 616, name: "Poland" },
    { alpha: 'PM', num: 666, name: "Saint Pierre and Miquelon" },
    { alpha: 'PN', num: 612, name: "Pitcairn" },
    { alpha: 'PR', num: 630, name: "Puerto Rico" },
    { alpha: 'PS', num: 275, name: "Palestine, State of" },
    { alpha: 'PT', num: 620, name: "Portugal" },
    { alpha: 'PW', num: 585, name: "Palau" },
    { alpha: 'PY', num: 600, name: "Paraguay" },
    { alpha: 'QA', num: 634, name: "Qatar" },
    { alpha: 'RE', num: 638, name: "Réunion" },
    { alpha: 'RO', num: 642, name: "Romania" },
    { alpha: 'RS', num: 688, name: "Serbia" },
    { alpha: 'RU', num: 643, name: "Russian Federation" },
    { alpha: 'RW', num: 646, name: "Rwanda" },
    { alpha: 'SA', num: 682, name: "Saudi Arabia" },
    { alpha: 'SB', num: 090, name: "Solomon Islands" },
    { alpha: 'SC', num: 690, name: "Seychelles" },
    { alpha: 'SD', num: 729, name: "Sudan" },
    { alpha: 'SE', num: 752, name: "Sweden" },
    { alpha: 'SG', num: 702, name: "Singapore" },
    { alpha: 'SH', num: 654, name: "Saint Helena, Ascension and Tristan da Cunha" },
    { alpha: 'SI', num: 705, name: "Slovenia" },
    { alpha: 'SJ', num: 744, name: "Svalbard and Jan Mayen" },
    { alpha: 'SK', num: 703, name: "Slovakia" },
    { alpha: 'SL', num: 694, name: "Sierra Leone" },
    { alpha: 'SM', num: 674, name: "San Marino" },
    { alpha: 'SN', num: 686, name: "Senegal" },
    { alpha: 'SO', num: 706, name: "Somalia" },
    { alpha: 'SR', num: 740, name: "Suriname" },
    { alpha: 'SS', num: 728, name: "South Sudan" },
    { alpha: 'ST', num: 678, name: "Sao Tome and Principe" },
    { alpha: 'SV', num: 222, name: "El Salvador" },
    { alpha: 'SX', num: 534, name: "Sint Maarten (Dutch part)" },
    { alpha: 'SY', num: 760, name: "Syrian Arab Republic" },
    { alpha: 'SZ', num: 748, name: "Swaziland" },
    { alpha: 'TC', num: 796, name: "Turks and Caicos Islands" },
    { alpha: 'TD', num: 144, name: "Chad" },
    { alpha: 'TF', num: 260, name: "French Southern Territories" },
    { alpha: 'TG', num: 768, name: "Togo" },
    { alpha: 'TH', num: 764, name: "Thailand" },
    { alpha: 'TJ', num: 762, name: "Tajikistan" },
    { alpha: 'TK', num: 772, name: "Tokelau" },
    { alpha: 'TL', num: 626, name: "Timor-Leste" },
    { alpha: 'TM', num: 795, name: "Turkmenistan" },
    { alpha: 'TN', num: 788, name: "Tunisia" },
    { alpha: 'TO', num: 776, name: "Tonga" },
    { alpha: 'TR', num: 792, name: "Turkey" },
    { alpha: 'TT', num: 780, name: "Trinidad and Tobago" },
    { alpha: 'TV', num: 798, name: "Tuvalu" },
    { alpha: 'TW', num: 158, name: "Taiwan, Province of China" },
    { alpha: 'TZ', num: 834, name: "Tanzania, United Republic of" },
    { alpha: 'UA', num: 804, name: "Ukraine" },
    { alpha: 'UG', num: 800, name: "Uganda" },
    { alpha: 'UM', num: 581, name: "United States Minor Outlying Islands" },
    { alpha: 'US', num: 840, name: "United States of America" },
    { alpha: 'UY', num: 858, name: "Uruguay" },
    { alpha: 'UZ', num: 860, name: "Uzbekistan" },
    { alpha: 'VA', num: 336, name: "Holy See" },
    { alpha: 'VC', num: 679, name: "Saint Vincent and the Grenadines" },
    { alpha: 'VE', num: 862, name: "Venezuela, Bolivarian Republic of" },
    { alpha: 'VG', num: 092, name: "Virgin Islands, British" },
    { alpha: 'VI', num: 850, name: "Virgin Islands, U.S." },
    { alpha: 'VN', num: 704, name: "Viet Nam" },
    { alpha: 'VU', num: 548, name: "Vanuatu" },
    { alpha: 'WF', num: 876, name: "Wallis and Futuna" },
    { alpha: 'WS', num: 882, name: "Samoa" },
    { alpha: 'YE', num: 887, name: "Yemen" },
    { alpha: 'YT', num: 175, name: "Mayotte" },
    { alpha: 'ZA', num: 710, name: "South Africa" },
    { alpha: 'ZM', num: 894, name: "Zambia" },
    { alpha: 'ZW', num: 716, name: "Zimbabwe" },
  ],
  loadGeo: function(){
    $.ajax({
      // Load state geometries
      url: 'data/world-countries.json',
      async: false,
      success: function(topojsonData){
        topojson.feature(topojsonData, topojsonData.objects.countries)
          .features.forEach(function(feature){
            var country = kshf.Countries.index_num[feature.id];
            if(country) country.geo = feature;
          });
      }
    });
  }
};

kshf.Countries.data.forEach(function(s){
  kshf.Countries.index_alpha[s.alpha] = s;
  kshf.Countries.index_num  [s.num  ] = s;
  kshf.Countries.index_name [s.name ] = s;
});


function getCountryName(v){
  var country = kshf.Countries.index_alpha[v];
  if(country) return country.name;
  return "Unknown: "+v;
}

function writeCookie(name,value,days){
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
    }else{
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
};

function readCookie(name){
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
};

var printPeopleIcons = function(){
    var str="";
    for(var i=0; i<this.id; i++) str+="<i class='fa fa-male'></i>";
    return str;
};

function noop(){};

// Logging
var isMobile = {
    Android    : function() { return navigator.userAgent.match(/Android/i); },
    BlackBerry : function() { return navigator.userAgent.match(/BlackBerry/i); },
    iOS        : function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    Opera      : function() { return navigator.userAgent.match(/Opera Mini/i); },
    Windows    : function() { return navigator.userAgent.match(/IEMobile/i); },
    any        : function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
var logIf = {
    WindowSize : function(){ // minimum 950 x 500 (timeline is shown with 4 categories)
        // Using HTML document size (Device screen.width & screen.height is not important)
        var w=this.dom.width();
        var h=this.dom.height();
        return (w>950) && (h>500) /* && (w>h)*/;
    },
    Desktop : function(){ // skip: Android, Blackberry, iPhone, iPad, iPod, Opera Mini, IEMobile
        return isMobile.any()===null;
    },
    NoTouch : function(){ // skip browsers supporting touch events.
        return !Modernizr.touch; 
    },
    setSessionID : function(t){
        if(this.Check!==undefined) return;
        if(t!==undefined){
            this.dom = $(t);
        }
        document.getElementsByTagName("body")[0].onmousemove = null;
        this.sessionID_Cookie = readCookie('sessionId');
        if(this.sessionID_Cookie === '') {
            var ran  = window.event.clientX*Math.random();
            var ran2 = window.event.clientY*Math.random();
            this.sessionID_Cookie = Math.floor((ran+ran2)*10000000000000);
            writeCookie('sessionId', this.sessionID_Cookie, 365);
        } else {
            this.sessionID_Cookie = parseInt(this.sessionID_Cookie);
        }
        this.sessionID_Now = Math.floor(Math.random()*10000000000000);
        this.All();
    },
    host : function(){
        switch(document.location.hostname){
            case "localhost": return true;
            case "adilyalcin.github.io": return true;
            case "www.cs.umd.edu": return true;
            case "cs.umd.edu": return true;
            case "www.keshif.me": return true;
            case "keshif.me": return true;
        }
        return false;
    },
    All : function(){
        var tmp = this.Check;
        this.Check = 
            (typeof demoID === 'number') && 
            this.WindowSize() && 
            this.Desktop() && 
            this.NoTouch() && 
            this.host()===true && 
            (this.sessionID_Cookie!==null)
            ;
        if(this.Check===true && tmp === undefined) {
            this.loadTs = Date.now();
            sendLog(kshf.LOG.CONFIG,
                { height:this.dom.height(),width:this.dom.width(),agent:navigator.userAgent}, this.loadTs);
        }
        return this.Check;
    },
    dom: $(window),
    sessionID_Cookie: null,
    sessionID_Now: null,
    Check : undefined,
    loadTs: null,
};

var sendLog = function(actID, dt, ts){
    if(logIf.Check!==true) return;
    if(ts===undefined){ ts = Date.now()-logIf.loadTs; }
    var _dt = {
        'demoID': demoID,
        'actID' : actID,
        'ses_Cki' : logIf.sessionID_Cookie,
        'ses_Now': logIf.sessionID_Now,
        'ts'    : ts,
    };
    // custom data to be sent
    if(dt){ for (var key in dt) { _dt[key]=dt[key]; } }
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: true,
        jsonp: false,
        url: (document.location.hostname!=="localhost")?"http://keshiftracker.appspot.com":"http://localhost:9090/",
        data: _dt
    });
};;

$(document).ready(function(){
  window.onresize = function(){ kshf.handleResize(); };

    if(document.location.hostname!=="localhost"){
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-54042831-2', 'auto');
        ga('send', 'pageview');
    }
    var githubDemoRoot = "https://github.com/adilyalcin/Keshif/blob/master/demo/";
    var pageName = window.location.pathname.split("/");
    pageName = pageName[pageName.length-1];
    if(pageName.indexOf("html")===-1) pageName+=".html";

    if(socialShare===true){
      var body = d3.select("body");
      var demoHeader = body.append("div").attr("class","demoHeader");
      
      var keshif_logo = demoHeader.append("a").attr("class","keshif_logo").attr("href","http://www.keshif.me").attr("target","_blank");
      keshif_logo.append("img").attr("class","keshif_logo_img").attr("src","./img/logo.png");
      keshif_logo.append("span").attr("class","keshif_logo_content").html("<strong>Keshif</strong></br>Data Made Explorable");

      demoHeader.append("div").attr("class","addthis_sharing_toolbox");

      var openSource = demoHeader.append("div").attr("class","openSource")
        ;
      //openSource.append("span").attr("class","fa fa-github");
      openSource.append("iframe")
        .attr("src","http://ghbtns.com/github-btn.html?user=adilyalcin&repo=Keshif&type=star&count=false&size=small")
        .attr("frameborder",0)
        .attr("scrolling",0)
        .attr("width","52px")
        .attr("height","20px")
        .style("position","relative")
        .style("top","3px");
      var y = openSource.append("a").attr("class","openSourceLabel")
        .attr("target","_blank").attr("href",githubDemoRoot+pageName).attr("title","Get Code");
        //y.append("span").attr("class","sdsdsds").html("Get<br>Code");
          y.append("span").attr("class","fa fa-code");

      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-534742f736ae906e";
      s.async = "async";
      $("body").append(s);

      WebFontConfig = {
          google: { families: [ 'Montserrat:400,500,300,100,700:latin', ] }
      };
      var wf = document.createElement('script');
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
          '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    }

    d3.select("head").append("link")
        .attr("rel","icon")
        .attr("href","./img/favicon.png")
        .attr("type","image/png");


    if($("body").fancybox && false){

        var com_dom = d3.select("body").append("span").attr("class","comment_popup").attr("href",
            "https://docs.google.com/forms/d/1OohNaCzV42jHFtqTxVaci3CISGiR6znYTvEozFm2z7k/viewform?embedded=true");

        var com_dom_stack = com_dom.append("span").attr("class","fa-stack");
            com_dom_stack.append("i").attr("class","fa fa-stack-1x fa-comment");
            com_dom_stack.append("i").attr("class","fa fa-stack-1x fa-comment-o");
        com_dom.append("br");
        com_dom.append("span").attr("class","texttt").html("Share<br>your<br>feedback");

        $(".comment_popup").fancybox({
            type: 'iframe',
            width: 600,
            height: 300,
            closeBtn: true,
            iframe: { 
                preload: true
            }
        });
    }

    if(githubButton===true){
        var s = document.createElement("script");
        s.src = "https://buttons.github.io/buttons.js";
        s.id  = "github-bjs";
        s.async = "async";
        $("body").append(s);
    }
});



