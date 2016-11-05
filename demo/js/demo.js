// turn on social share by default
var socialShare = true;

var demoHeader = true;

var browser;

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
  loadGeo: function(browser){
    browser.asyncDataWaitedCnt++;
    // Load US county geometries
    d3.request('data/us-counties-states-FIPS.json')
      .get(function(error, data){
        var topojsonData = JSON.parse(data.response);
        topojson.feature(topojsonData, topojsonData.objects.states)
          .features.forEach(function(feature){
            var state = US_States.index_id[feature.id];
            if(state) state.geo = feature;
          });
        browser.asyncDataLoaded();
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
  index_alpha3: {},
  index_num: {},
  index_name: {},
  data: [
    { alpha: 'AD', alpha3: 'AND', num:  20, name: "Andorra" },
    { alpha: 'AE', alpha3: 'ARE', num: 784, name: "United Arab Emirates" },
    { alpha: 'AF', alpha3: 'AFG', num:   4, name: "Afghanistan" },
    { alpha: 'AG', alpha3: 'ATG', num:  28, name: "Antigua and Barbuda" },
    { alpha: 'AI', alpha3: 'AIA', num: 660, name: "Anguilla" },
    { alpha: 'AL', alpha3: 'ALB', num:   8, name: "Albania" },
    { alpha: 'AM', alpha3: 'ARM', num:  51, name: "Armenia" },
    { alpha: 'AO', alpha3: 'AGO', num:  24, name: "Angola" },
    { alpha: 'AQ', alpha3: 'ATA', num:  10, name: "Antarctica" },
    { alpha: 'AR', alpha3: 'ARG', num:  32, name: "Argentina" },
    { alpha: 'AS', alpha3: 'ASM', num:  16, name: "American Samoa" },
    { alpha: 'AT', alpha3: 'AUT', num:  40, name: "Austria" },
    { alpha: 'AU', alpha3: 'AUS', num:  36, name: "Australia" },
    { alpha: 'AW', alpha3: 'ABW', num: 533, name: "Aruba" },
    { alpha: 'AX', alpha3: 'ALA', num: 248, name: "Åland Islands" },
    { alpha: 'AZ', alpha3: 'AZE', num:  31, name: "Azerbaijan" },
    { alpha: 'BA', alpha3: 'BIH', num:  70, name: "Bosnia and Herzegovina" },
    { alpha: 'BB', alpha3: 'BRB', num:  52, name: "Barbados" },
    { alpha: 'BD', alpha3: 'BGD', num:  50, name: "Bangladesh" },
    { alpha: 'BE', alpha3: 'BEL', num:  56, name: "Belgium" },
    { alpha: 'BF', alpha3: 'BFA', num: 854, name: "Burkina Faso" },
    { alpha: 'BG', alpha3: 'BGR', num: 100, name: "Bulgaria" },
    { alpha: 'BH', alpha3: 'BHR', num:  48, name: "Bahrain" },
    { alpha: 'BI', alpha3: 'BDI', num: 108, name: "Burundi" },
    { alpha: 'BJ', alpha3: 'BEN', num: 204, name: "Benin" },
    { alpha: 'BL', alpha3: 'BLM', num: 652, name: "Saint Barthélemy" },
    { alpha: 'BM', alpha3: 'BMU', num:  60, name: "Bermuda" },
    { alpha: 'BN', alpha3: 'BRN', num:  96, name: "Brunei Darussalam" },
    { alpha: 'BO', alpha3: 'BOL', num:  68, name: "Bolivia, Plurinational State of" },
    { alpha: 'BQ', alpha3: 'BES', num: 535, name: "Bonaire, Sint Eustatius and Saba" },
    { alpha: 'BR', alpha3: 'BRA', num:  76, name: "Brazil" },
    { alpha: 'BS', alpha3: 'BHS', num:  44, name: "Bahamas" },
    { alpha: 'BT', alpha3: 'BTN', num:  64, name: "Bhutan" },
    { alpha: 'BV', alpha3: 'BVT', num:  74, name: "Bouvet Island" },
    { alpha: 'BW', alpha3: 'BWA', num:  72, name: "Botswana" },
    { alpha: 'BY', alpha3: 'BLR', num: 112, name: "Belarus" },
    { alpha: 'BZ', alpha3: 'BLZ', num:  84, name: "Belize" },
    { alpha: 'CA', alpha3: 'CAN', num: 124, name: "Canada" },
    { alpha: 'CC', alpha3: 'CCK', num: 166, name: "Cocos (Keeling) Islands" },
    { alpha: 'CD', alpha3: 'COD', num: 180, name: "Congo, the Democratic Republic of the" },
    { alpha: 'CF', alpha3: 'CAF', num: 140, name: "Central African Republic" },
    { alpha: 'CG', alpha3: 'COG', num: 178, name: "Congo" },
    { alpha: 'CH', alpha3: 'CHE', num: 756, name: "Switzerland" },
    { alpha: 'CI', alpha3: 'CIV', num: 384, name: "Côte d'Ivoire" },
    { alpha: 'CK', alpha3: 'COK', num: 184, name: "Cook Islands" },
    { alpha: 'CL', alpha3: 'CHL', num: 152, name: "Chile" },
    { alpha: 'CM', alpha3: 'CMR', num: 120, name: "Cameroon" },
    { alpha: 'CN', alpha3: 'CHN', num: 156, name: "China" },
    { alpha: 'CO', alpha3: 'COL', num: 170, name: "Colombia" },
    { alpha: 'CR', alpha3: 'CRI', num: 188, name: "Costa Rica" },
    { alpha: 'CU', alpha3: 'CUB', num: 192, name: "Cuba" },
    { alpha: 'CV', alpha3: 'CPV', num: 132, name: "Cabo Verde" },
    { alpha: 'CW', alpha3: 'CUW', num: 531, name: "Curaçao" },
    { alpha: 'CX', alpha3: 'CXR', num: 162, name: "Christmas Island" },
    { alpha: 'CY', alpha3: 'CYP', num: 196, name: "Cyprus" },
    { alpha: 'CZ', alpha3: 'CZE', num: 203, name: "Czech Republic" },
    { alpha: 'DE', alpha3: 'DEU', num: 276, name: "Germany" },
    { alpha: 'DJ', alpha3: 'DJI', num: 262, name: "Djibouti" },
    { alpha: 'DK', alpha3: 'DNK', num: 208, name: "Denmark" },
    { alpha: 'DM', alpha3: 'DMA', num: 212, name: "Dominica" },
    { alpha: 'DO', alpha3: 'DOM', num: 214, name: "Dominican Republic" },
    { alpha: 'DZ', alpha3: 'DZA', num:  12, name: "Algeria" },
    { alpha: 'EC', alpha3: 'ECU', num: 218, name: "Ecuador" },
    { alpha: 'EE', alpha3: 'EST', num: 233, name: "Estonia" },
    { alpha: 'EG', alpha3: 'EGY', num: 818, name: "Egypt" },
    { alpha: 'EH', alpha3: 'ESH', num: 732, name: "Western Sahara" },
    { alpha: 'ER', alpha3: 'ERI', num: 232, name: "Eritrea" },
    { alpha: 'ES', alpha3: 'ESP', num: 724, name: "Spain" },
    { alpha: 'ET', alpha3: 'ETH', num: 231, name: "Ethiopia" },
    { alpha: 'FI', alpha3: 'FIN', num: 246, name: "Finland" },
    { alpha: 'FJ', alpha3: 'FJI', num: 242, name: "Fiji" },
    { alpha: 'FK', alpha3: 'FLK', num: 238, name: "Falkland Islands (Malvinas)" },
    { alpha: 'FM', alpha3: 'FSM', num: 583, name: "Micronesia, Federated States of" },
    { alpha: 'FO', alpha3: 'FRO', num: 234, name: "Faroe Islands" },
    { alpha: 'FR', alpha3: 'FRA', num: 250, name: "France" },
    { alpha: 'GA', alpha3: 'GAB', num: 266, name: "Gabon" },
    { alpha: 'GB', alpha3: 'GBR', num: 826, name: "United Kingdom of Great Britain and Northern Ireland" },
    { alpha: 'GD', alpha3: 'GRD', num: 308, name: "Grenada" },
    { alpha: 'GE', alpha3: 'GEO', num: 268, name: "Georgia" },
    { alpha: 'GF', alpha3: 'GUF', num: 254, name: "French Guiana" },
    { alpha: 'GG', alpha3: 'GGY', num: 831, name: "Guernsey" },
    { alpha: 'GH', alpha3: 'GHA', num: 288, name: "Ghana" },
    { alpha: 'GI', alpha3: 'GIB', num: 292, name: "Gibraltar" },
    { alpha: 'GL', alpha3: 'GRL', num: 304, name: "Greenland" },
    { alpha: 'GM', alpha3: 'GMB', num: 270, name: "Gambia" },
    { alpha: 'GN', alpha3: 'GIN', num: 324, name: "Guinea" },
    { alpha: 'GP', alpha3: 'GLP', num: 312, name: "Guadeloupe" },
    { alpha: 'GQ', alpha3: 'GNQ', num: 226, name: "Equatorial Guinea" },
    { alpha: 'GR', alpha3: 'GRC', num: 300, name: "Greece" },
    { alpha: 'GS', alpha3: 'SGS', num: 239, name: "South Georgia and the South Sandwich Islands" },
    { alpha: 'GT', alpha3: 'GTM', num: 320, name: "Guatemala" },
    { alpha: 'GU', alpha3: 'GUM', num: 316, name: "Guam" },
    { alpha: 'GW', alpha3: 'GNB', num: 624, name: "Guinea-Bissau" },
    { alpha: 'GY', alpha3: 'GUY', num: 328, name: "Guyana" },
    { alpha: 'HK', alpha3: 'HKG', num: 344, name: "Hong Kong" },
    { alpha: 'HM', alpha3: 'HMD', num: 334, name: "Heard Island and McDonald Islands" },
    { alpha: 'HN', alpha3: 'HND', num: 340, name: "Honduras" },
    { alpha: 'HR', alpha3: 'HRV', num: 191, name: "Croatia" },
    { alpha: 'HT', alpha3: 'HTI', num: 332, name: "Haiti" },
    { alpha: 'HU', alpha3: 'HUN', num: 348, name: "Hungary" },
    { alpha: 'ID', alpha3: 'IDN', num: 360, name: "Indonesia" },
    { alpha: 'IE', alpha3: 'IRL', num: 372, name: "Ireland" },
    { alpha: 'IL', alpha3: 'ISR', num: 376, name: "Israel" },
    { alpha: 'IM', alpha3: 'IMN', num: 833, name: "Isle of Man" },
    { alpha: 'IN', alpha3: 'IND', num: 356, name: "India" },
    { alpha: 'IO', alpha3: 'IOT', num:  86, name: "British Indian Ocean Territory" },
    { alpha: 'IQ', alpha3: 'IRQ', num: 368, name: "Iraq" },
    { alpha: 'IR', alpha3: 'IRN', num: 364, name: "Iran, Islamic Republic of" },
    { alpha: 'IS', alpha3: 'ISL', num: 352, name: "Iceland" },
    { alpha: 'IT', alpha3: 'ITA', num: 380, name: "Italy" },
    { alpha: 'JE', alpha3: 'JEY', num: 832, name: "Jersey" },
    { alpha: 'JM', alpha3: 'JAM', num: 388, name: "Jamaica" },
    { alpha: 'JO', alpha3: 'JOR', num: 400, name: "Jordan" },
    { alpha: 'JP', alpha3: 'JPN', num: 392, name: "Japan" },
    { alpha: 'KE', alpha3: 'KEN', num: 404, name: "Kenya" },
    { alpha: 'KG', alpha3: 'KGZ', num: 417, name: "Kyrgyzstan" },
    { alpha: 'KH', alpha3: 'KHM', num: 116, name: "Cambodia" },
    { alpha: 'KI', alpha3: 'KIR', num: 296, name: "Kiribati" },
    { alpha: 'KM', alpha3: 'COM', num: 174, name: "Comoros" },
    { alpha: 'KN', alpha3: 'KNA', num: 659, name: "Saint Kitts and Nevis" },
    { alpha: 'KP', alpha3: 'PRK', num: 408, name: "Korea, Democratic People's Republic of" },
    { alpha: 'KR', alpha3: 'KOR', num: 410, name: "Korea, Republic of" },
    { alpha: 'KW', alpha3: 'KWT', num: 414, name: "Kuwait" },
    { alpha: 'KY', alpha3: 'CYM', num: 136, name: "Cayman Islands" },
    { alpha: 'KZ', alpha3: 'KAZ', num: 398, name: "Kazakhstan" },
    { alpha: 'LA', alpha3: 'LAO', num: 428, name: "Lao People's Democratic Republic" },
    { alpha: 'LB', alpha3: 'LBN', num: 422, name: "Lebanon" },
    { alpha: 'LC', alpha3: 'LCA', num: 662, name: "Saint Lucia" },
    { alpha: 'LI', alpha3: 'LIE', num: 438, name: "Liechtenstein" },
    { alpha: 'LK', alpha3: 'LKA', num: 144, name: "Sri Lanka" },
    { alpha: 'LR', alpha3: 'LBR', num: 430, name: "Liberia" },
    { alpha: 'LS', alpha3: 'LSO', num: 426, name: "Lesotho" },
    { alpha: 'LT', alpha3: 'LTU', num: 440, name: "Lithuania" },
    { alpha: 'LU', alpha3: 'LUX', num: 442, name: "Luxembourg" },
    { alpha: 'LV', alpha3: 'LVA', num: 428, name: "Latvia" },
    { alpha: 'LY', alpha3: 'LBY', num: 434, name: "Libya" },
    { alpha: 'MA', alpha3: 'MAR', num: 504, name: "Morocco" },
    { alpha: 'MC', alpha3: 'MCO', num: 492, name: "Monaco" },
    { alpha: 'MD', alpha3: 'MDA', num: 498, name: "Moldova, Republic of" },
    { alpha: 'ME', alpha3: 'MNE', num: 499, name: "Montenegro" },
    { alpha: 'MF', alpha3: 'MAF', num: 663, name: "Saint Martin (French part)" },
    { alpha: 'MG', alpha3: 'MDG', num: 450, name: "Madagascar" },
    { alpha: 'MH', alpha3: 'MHL', num: 584, name: "Marshall Islands" },
    { alpha: 'MK', alpha3: 'MKD', num: 807, name: "Macedonia, the former Yugoslav Republic of" },
    { alpha: 'ML', alpha3: 'MLI', num: 466, name: "Mali" },
    { alpha: 'MM', alpha3: 'MMR', num: 104, name: "Myanmar" },
    { alpha: 'MN', alpha3: 'MNG', num: 496, name: "Mongolia" },
    { alpha: 'MO', alpha3: 'MAC', num: 446, name: "Macao" },
    { alpha: 'MP', alpha3: 'MNP', num: 580, name: "Northern Mariana Islands" },
    { alpha: 'MQ', alpha3: 'MTQ', num: 474, name: "Martinique" },
    { alpha: 'MR', alpha3: 'MRT', num: 478, name: "Mauritania" },
    { alpha: 'MS', alpha3: 'MSR', num: 500, name: "Montserrat" },
    { alpha: 'MT', alpha3: 'MLT', num: 470, name: "Malta" },
    { alpha: 'MU', alpha3: 'MUS', num: 480, name: "Mauritius" },
    { alpha: 'MV', alpha3: 'MDV', num: 462, name: "Maldives" },
    { alpha: 'MW', alpha3: 'MWI', num: 454, name: "Malawi" },
    { alpha: 'MX', alpha3: 'MEX', num: 484, name: "Mexico" },
    { alpha: 'MY', alpha3: 'MYS', num: 458, name: "Malaysia" },
    { alpha: 'MZ', alpha3: 'MOZ', num: 508, name: "Mozambique" },
    { alpha: 'NA', alpha3: 'NAM', num: 516, name: "Namibia" },
    { alpha: 'NC', alpha3: 'NCL', num: 540, name: "New Caledonia" },
    { alpha: 'NE', alpha3: 'NER', num: 562, name: "Niger" },
    { alpha: 'NF', alpha3: 'NFK', num: 574, name: "Norfolk Island" },
    { alpha: 'NG', alpha3: 'NGA', num: 566, name: "Nigeria" },
    { alpha: 'NI', alpha3: 'NIC', num: 558, name: "Nicaragua" },
    { alpha: 'NL', alpha3: 'NLD', num: 528, name: "Netherlands" },
    { alpha: 'NO', alpha3: 'NOR', num: 578, name: "Norway" },
    { alpha: 'NP', alpha3: 'NPL', num: 524, name: "Nepal" },
    { alpha: 'NR', alpha3: 'NRU', num: 520, name: "Nauru" },
    { alpha: 'NU', alpha3: 'NIU', num: 570, name: "Niue" },
    { alpha: 'NZ', alpha3: 'NZL', num: 554, name: "New Zealand" },
    { alpha: 'OM', alpha3: 'OMN', num: 512, name: "Oman" },
    { alpha: 'PA', alpha3: 'PAN', num: 591, name: "Panama" },
    { alpha: 'PE', alpha3: 'PER', num: 604, name: "Peru" },
    { alpha: 'PF', alpha3: 'PYF', num: 258, name: "French Polynesia" },
    { alpha: 'PG', alpha3: 'PNG', num: 598, name: "Papua New Guinea" },
    { alpha: 'PH', alpha3: 'PHL', num: 608, name: "Philippines" },
    { alpha: 'PK', alpha3: 'PAK', num: 586, name: "Pakistan" },
    { alpha: 'PL', alpha3: 'POL', num: 616, name: "Poland" },
    { alpha: 'PM', alpha3: 'SPM', num: 666, name: "Saint Pierre and Miquelon" },
    { alpha: 'PN', alpha3: 'PCN', num: 612, name: "Pitcairn" },
    { alpha: 'PR', alpha3: 'PRI', num: 630, name: "Puerto Rico" },
    { alpha: 'PS', alpha3: 'PSE', num: 275, name: "Palestine, State of" },
    { alpha: 'PT', alpha3: 'PRT', num: 620, name: "Portugal" },
    { alpha: 'PW', alpha3: 'PLW', num: 585, name: "Palau" },
    { alpha: 'PY', alpha3: 'PRY', num: 600, name: "Paraguay" },
    { alpha: 'QA', alpha3: 'QAT', num: 634, name: "Qatar" },
    { alpha: 'RE', alpha3: 'REU', num: 638, name: "Réunion" },
    { alpha: 'RO', alpha3: 'ROU', num: 642, name: "Romania" },
    { alpha: 'RS', alpha3: 'SRB', num: 688, name: "Serbia" },
    { alpha: 'RU', alpha3: 'RUS', num: 643, name: "Russian Federation" },
    { alpha: 'RW', alpha3: 'RWA', num: 646, name: "Rwanda" },
    { alpha: 'SA', alpha3: 'SAU', num: 682, name: "Saudi Arabia" },
    { alpha: 'SB', alpha3: 'SLB', num:  90, name: "Solomon Islands" },
    { alpha: 'SC', alpha3: 'SYC', num: 690, name: "Seychelles" },
    { alpha: 'SD', alpha3: 'SDN', num: 729, name: "Sudan" },
    { alpha: 'SE', alpha3: 'SWE', num: 752, name: "Sweden" },
    { alpha: 'SG', alpha3: 'SGP', num: 702, name: "Singapore" },
    { alpha: 'SH', alpha3: 'SHN', num: 654, name: "Saint Helena, Ascension and Tristan da Cunha" },
    { alpha: 'SI', alpha3: 'SVN', num: 705, name: "Slovenia" },
    { alpha: 'SJ', alpha3: 'SJM', num: 744, name: "Svalbard and Jan Mayen" },
    { alpha: 'SK', alpha3: 'SVK', num: 703, name: "Slovakia" },
    { alpha: 'SL', alpha3: 'SLE', num: 694, name: "Sierra Leone" },
    { alpha: 'SM', alpha3: 'SMR', num: 674, name: "San Marino" },
    { alpha: 'SN', alpha3: 'SEN', num: 686, name: "Senegal" },
    { alpha: 'SO', alpha3: 'SOM', num: 706, name: "Somalia" },
    { alpha: 'SR', alpha3: 'SUR', num: 740, name: "Suriname" },
    { alpha: 'SS', alpha3: 'SSD', num: 728, name: "South Sudan" },
    { alpha: 'ST', alpha3: 'STP', num: 678, name: "Sao Tome and Principe" },
    { alpha: 'SV', alpha3: 'SLV', num: 222, name: "El Salvador" },
    { alpha: 'SX', alpha3: 'SXM', num: 534, name: "Sint Maarten (Dutch part)" },
    { alpha: 'SY', alpha3: 'SYR', num: 760, name: "Syrian Arab Republic" },
    { alpha: 'SZ', alpha3: 'SWZ', num: 748, name: "Swaziland" },
    { alpha: 'TC', alpha3: 'TCA', num: 796, name: "Turks and Caicos Islands" },
    { alpha: 'TD', alpha3: 'TCD', num: 148, name: "Chad" },
    { alpha: 'TF', alpha3: 'ATF', num: 260, name: "French Southern Territories" },
    { alpha: 'TG', alpha3: 'TGO', num: 768, name: "Togo" },
    { alpha: 'TH', alpha3: 'THA', num: 764, name: "Thailand" },
    { alpha: 'TJ', alpha3: 'TJK', num: 762, name: "Tajikistan" },
    { alpha: 'TK', alpha3: 'TKL', num: 772, name: "Tokelau" },
    { alpha: 'TL', alpha3: 'TLS', num: 626, name: "Timor-Leste" },
    { alpha: 'TM', alpha3: 'TKM', num: 795, name: "Turkmenistan" },
    { alpha: 'TN', alpha3: 'TUN', num: 788, name: "Tunisia" },
    { alpha: 'TO', alpha3: 'TON', num: 776, name: "Tonga" },
    { alpha: 'TR', alpha3: 'TUR', num: 792, name: "Turkey" },
    { alpha: 'TT', alpha3: 'TTO', num: 780, name: "Trinidad and Tobago" },
    { alpha: 'TV', alpha3: 'TUV', num: 798, name: "Tuvalu" },
    { alpha: 'TW', alpha3: 'TWN', num: 158, name: "Taiwan, Province of China" },
    { alpha: 'TZ', alpha3: 'TZA', num: 834, name: "Tanzania, United Republic of" },
    { alpha: 'UA', alpha3: 'UKR', num: 804, name: "Ukraine" },
    { alpha: 'UG', alpha3: 'UGA', num: 800, name: "Uganda" },
    { alpha: 'UM', alpha3: 'UMI', num: 581, name: "United States Minor Outlying Islands" },
    { alpha: 'US', alpha3: 'USA', num: 840, name: "United States of America" },
    { alpha: 'UY', alpha3: 'URY', num: 858, name: "Uruguay" },
    { alpha: 'UZ', alpha3: 'UZB', num: 860, name: "Uzbekistan" },
    { alpha: 'VA', alpha3: 'VAT', num: 336, name: "Holy See (Vatikan)" },
    { alpha: 'VC', alpha3: 'VCT', num: 679, name: "Saint Vincent and the Grenadines" },
    { alpha: 'VE', alpha3: 'VEN', num: 862, name: "Venezuela, Bolivarian Republic of" },
    { alpha: 'VG', alpha3: 'VGB', num:  92, name: "Virgin Islands, British" },
    { alpha: 'VI', alpha3: 'VIR', num: 850, name: "Virgin Islands, U.S." },
    { alpha: 'VN', alpha3: 'VNM', num: 704, name: "Viet Nam" },
    { alpha: 'VU', alpha3: 'VUT', num: 548, name: "Vanuatu" },
    { alpha: 'WF', alpha3: 'WLF', num: 876, name: "Wallis and Futuna" },
    { alpha: 'WS', alpha3: 'WSM', num: 882, name: "Samoa" },
    { alpha: 'YE', alpha3: 'YEM', num: 887, name: "Yemen" },
    { alpha: 'YT', alpha3: 'MYT', num: 175, name: "Mayotte" },
    { alpha: 'ZA', alpha3: 'ZAF', num: 710, name: "South Africa" },
    { alpha: 'ZM', alpha3: 'ZMB', num: 894, name: "Zambia" },
    { alpha: 'ZW', alpha3: 'ZWE', num: 716, name: "Zimbabwe" },
  ],
  loadGeo: function(browser){
    browser.asyncDataWaitedCnt++;
    // Load world country geometries
    // add ./demo directory if needed
    var x = document.location.pathname.split("/")
    var pre = x[x.length-2]==="gist"?"../demo/":"";
    d3.request(pre+'data/world-countries.json')
      .get(function(error, data){
        var topojsonData = JSON.parse(data.response);
        topojson.feature(topojsonData, topojsonData.objects.countries)
          .features.forEach(function(feature){
            var country = kshf.Countries.index_num[feature.id];
            if(country) country.geo = feature;
          });
        browser.asyncDataLoaded();
      });
  }
};

kshf.Countries.data.forEach(function(s){
  kshf.Countries.index_alpha[s.alpha] = s;
  kshf.Countries.index_alpha3[s.alpha3] = s;
  kshf.Countries.index_num  [s.num  ] = s;
  kshf.Countries.index_name [s.name ] = s;
});

var googleClientID = "624759284872-vtmo5mmn4305c946tiq161dtjte4b46b.apps.googleusercontent.com";

function getCountryName(v){
  var country = kshf.Countries.index_alpha[v];
  if(country) return country.name;
  return "Unknown: "+v;
}

function printPeopleIcons(){
  var str="";
  for(var i=0; i<this.id; i++) str+="<i class='fa fa-male'></i>";
  return str;
};

document.addEventListener('DOMContentLoaded',function(){
  
  window.onresize = function(){ kshf.handleResize(); };
  if(document.location.hostname!=="localhost"){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-54042831-2', 'auto');
    ga('send', 'pageview');
  }

  if(demoHeader!==false){
    var _demoHeader = d3.select("body").append("div").attr("class","demoHeader");

    var keshif_logo = _demoHeader.append("a").attr("class","keshif_logo").attr("href","http://www.keshif.me").attr("target","_blank");
    keshif_logo.append("span").attr("class","kshfLogo").html(kshf.kshfLogo).styles({width: "30px", height: "30px", float: "left"});
    keshif_logo.append("span").attr("class","keshif_logo_content")
      .html(
        "<div class='subContent_2'>Created with</div>"+
        "<div class='subTitle'>Keshif</div>"+
        "<div class='subContent'>Data Made Explorable</div>");
      
      if(socialShare===true){
        _demoHeader.append("div").attr("class","addthis_sharing_toolbox");
      }

      var githubDemoRoot = "https://github.com/adilyalcin/Keshif/blob/master/demo/";
      var pageName = window.location.pathname.split("/");
      pageName = pageName[pageName.length-1];
      if(pageName.indexOf("html")===-1) pageName+=".html";

      var openSource = _demoHeader.append("div").attr("class","openSource");
      openSource.append("iframe")
        .attrs({
          src: "http://ghbtns.com/github-btn.html?user=adilyalcin&repo=Keshif&type=star&count=false&size=small",
          scrolling: 0,
          frameborder: 0,
          width: "52px",
          height: "20px"
        })
        .styles({
          position: "relative", top: "3px"
        })
      openSource.append("a").attr("class","openSourceLabel")
        .attr("target","_blank").attr("href",githubDemoRoot+pageName).attr("title","Get Code")
          .append("span").attr("class","fa fa-code");


      if(socialShare===true){
        d3.select("body").append("script").attr("type","text/javascript").attr("async","async")
          .attr("src","//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-534742f736ae906e");
      }
  }

  // Add favicon to all demos
  d3.select("head").append("link").attr("rel","icon").attr("type","image/png")
    .attr("href","http://keshif.me/demo/img/favicon.png");
});

