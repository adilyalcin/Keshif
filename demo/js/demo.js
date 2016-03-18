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
function getCountryName(v){
    switch(v){
        case 'AD': return "Andorra";
        case 'AE': return "United Arab Emirates";
        case 'AF': return "Afghanistan";
        case 'AG': return "Antigua and Barbuda";
        case 'AI': return "Anguilla";
        case 'AL': return "Albania";
        case 'AM': return "Armenia";
        case 'AO': return "Angola";
        case 'AQ': return "Antarctica";
        case 'AR': return "Argentina";
        case 'AS': return "American Samoa";
        case 'AT': return "Austria";
        case 'AU': return "Australia";
        case 'AW': return "Aruba";
        case 'AX': return "Åland Islands";
        case 'AZ': return "Azerbaijan";
        case 'BA': return "Bosnia and Herzegovina";
        case 'BB': return "Barbados";
        case 'BD': return "Bangladesh";
        case 'BE': return "Belgium";
        case 'BF': return "Burkina Faso";
        case 'BG': return "Bulgaria";
        case 'BH': return "Bahrain";
        case 'BI': return "Burundi";
        case 'BJ': return "Benin";
        case 'BL': return "Saint Barthélemy";
        case 'BM': return "Bermuda";
        case 'BN': return "Brunei Darussalam";
        case 'BO': return "Bolivia, Plurinational State of";
        case 'BQ': return "Bonaire, Sint Eustatius and Saba";
        case 'BR': return "Brazil";
        case 'BS': return "Bahamas";
        case 'BT': return "Bhutan";
        case 'BV': return "Bouvet Island";
        case 'BW': return "Botswana";
        case 'BY': return "Belarus";
        case 'BZ': return "Belize";
        case 'CA': return "Canada";
        case 'CC': return "Cocos (Keeling) Islands";
        case 'CD': return "Congo, the Democratic Republic of the";
        case 'CF': return "Central African Republic";
        case 'CG': return "Congo";
        case 'CH': return "Switzerland";
        case 'CI': return "Côte d'Ivoire";
        case 'CK': return "Cook Islands";
        case 'CL': return "Chile";
        case 'CM': return "Cameroon";
        case 'CN': return "China";
        case 'CO': return "Colombia";
        case 'CR': return "Costa Rica";
        case 'CU': return "Cuba";
        case 'CV': return "Cabo Verde";
        case 'CW': return "Curaçao";
        case 'CX': return "Christmas Island";
        case 'CY': return "Cyprus";
        case 'CZ': return "Czech Republic";
        case 'DE': return "Germany";
        case 'DJ': return "Djibouti";
        case 'DK': return "Denmark";
        case 'DM': return "Dominica";
        case 'DO': return "Dominican Republic";
        case 'DZ': return "Algeria";
        case 'EC': return "Ecuador";
        case 'EE': return "Estonia";
        case 'EG': return "Egypt";
        case 'EH': return "Western Sahara";
        case 'ER': return "Eritrea";
        case 'ES': return "Spain";
        case 'ET': return "Ethiopia";
        case 'FI': return "Finland";
        case 'FJ': return "Fiji";
        case 'FK': return "Falkland Islands (Malvinas)";
        case 'FM': return "Micronesia, Federated States of";
        case 'FO': return "Faroe Islands";
        case 'FR': return "France";
        case 'GA': return "Gabon";
        case 'GB': return "United Kingdom of Great Britain and Northern Ireland";
        case 'GD': return "Grenada";
        case 'GE': return "Georgia";
        case 'GF': return "French Guiana";
        case 'GG': return "Guernsey";
        case 'GH': return "Ghana";
        case 'GI': return "Gibraltar";
        case 'GL': return "Greenland";
        case 'GM': return "Gambia";
        case 'GN': return "Guinea";
        case 'GP': return "Guadeloupe";
        case 'GQ': return "Equatorial Guinea";
        case 'GR': return "Greece";
        case 'GS': return "South Georgia and the South Sandwich Islands";
        case 'GT': return "Guatemala";
        case 'GU': return "Guam";
        case 'GW': return "Guinea-Bissau";
        case 'GY': return "Guyana";
        case 'HK': return "Hong Kong";
        case 'HM': return "Heard Island and McDonald Islands";
        case 'HN': return "Honduras";
        case 'HR': return "Croatia";
        case 'HT': return "Haiti";
        case 'HU': return "Hungary";
        case 'ID': return "Indonesia";
        case 'IE': return "Ireland";
        case 'IL': return "Israel";
        case 'IM': return "Isle of Man";
        case 'IN': return "India";
        case 'IO': return "British Indian Ocean Territory";
        case 'IQ': return "Iraq";
        case 'IR': return "Iran, Islamic Republic of";
        case 'IS': return "Iceland";
        case 'IT': return "Italy";
        case 'JE': return "Jersey";
        case 'JM': return "Jamaica";
        case 'JO': return "Jordan";
        case 'JP': return "Japan";
        case 'KE': return "Kenya";
        case 'KG': return "Kyrgyzstan";
        case 'KH': return "Cambodia";
        case 'KI': return "Kiribati";
        case 'KM': return "Comoros";
        case 'KN': return "Saint Kitts and Nevis";
        case 'KP': return "Korea, Democratic People's Republic of";
        case 'KR': return "Korea, Republic of";
        case 'KW': return "Kuwait";
        case 'KY': return "Cayman Islands";
        case 'KZ': return "Kazakhstan";
        case 'LA': return "Lao People's Democratic Republic";
        case 'LB': return "Lebanon";
        case 'LC': return "Saint Lucia";
        case 'LI': return "Liechtenstein";
        case 'LK': return "Sri Lanka";
        case 'LR': return "Liberia";
        case 'LS': return "Lesotho";
        case 'LT': return "Lithuania";
        case 'LU': return "Luxembourg";
        case 'LV': return "Latvia";
        case 'LY': return "Libya";
        case 'MA': return "Morocco";
        case 'MC': return "Monaco";
        case 'MD': return "Moldova, Republic of";
        case 'ME': return "Montenegro";
        case 'MF': return "Saint Martin (French part)";
        case 'MG': return "Madagascar";
        case 'MH': return "Marshall Islands";
        case 'MK': return "Macedonia, the former Yugoslav Republic of";
        case 'ML': return "Mali";
        case 'MM': return "Myanmar";
        case 'MN': return "Mongolia";
        case 'MO': return "Macao";
        case 'MP': return "Northern Mariana Islands";
        case 'MQ': return "Martinique";
        case 'MR': return "Mauritania";
        case 'MS': return "Montserrat";
        case 'MT': return "Malta";
        case 'MU': return "Mauritius";
        case 'MV': return "Maldives";
        case 'MW': return "Malawi";
        case 'MX': return "Mexico";
        case 'MY': return "Malaysia";
        case 'MZ': return "Mozambique";
        case 'NA': return "Namibia";
        case 'NC': return "New Caledonia";
        case 'NE': return "Niger";
        case 'NF': return "Norfolk Island";
        case 'NG': return "Nigeria";
        case 'NI': return "Nicaragua";
        case 'NL': return "Netherlands";
        case 'NO': return "Norway";
        case 'NP': return "Nepal";
        case 'NR': return "Nauru";
        case 'NU': return "Niue";
        case 'NZ': return "New Zealand";
        case 'OM': return "Oman";
        case 'PA': return "Panama";
        case 'PE': return "Peru";
        case 'PF': return "French Polynesia";
        case 'PG': return "Papua New Guinea";
        case 'PH': return "Philippines";
        case 'PK': return "Pakistan";
        case 'PL': return "Poland";
        case 'PM': return "Saint Pierre and Miquelon";
        case 'PN': return "Pitcairn";
        case 'PR': return "Puerto Rico";
        case 'PS': return "Palestine, State of";
        case 'PT': return "Portugal";
        case 'PW': return "Palau";
        case 'PY': return "Paraguay";
        case 'QA': return "Qatar";
        case 'RE': return "Réunion";
        case 'RO': return "Romania";
        case 'RS': return "Serbia";
        case 'RU': return "Russian Federation";
        case 'RW': return "Rwanda";
        case 'SA': return "Saudi Arabia";
        case 'SB': return "Solomon Islands";
        case 'SC': return "Seychelles";
        case 'SD': return "Sudan";
        case 'SE': return "Sweden";
        case 'SG': return "Singapore";
        case 'SH': return "Saint Helena, Ascension and Tristan da Cunha";
        case 'SI': return "Slovenia";
        case 'SJ': return "Svalbard and Jan Mayen";
        case 'SK': return "Slovakia";
        case 'SL': return "Sierra Leone";
        case 'SM': return "San Marino";
        case 'SN': return "Senegal";
        case 'SO': return "Somalia";
        case 'SR': return "Suriname";
        case 'SS': return "South Sudan";
        case 'ST': return "Sao Tome and Principe";
        case 'SV': return "El Salvador";
        case 'SX': return "Sint Maarten (Dutch part)";
        case 'SY': return "Syrian Arab Republic";
        case 'SZ': return "Swaziland";
        case 'TC': return "Turks and Caicos Islands";
        case 'TD': return "Chad";
        case 'TF': return "French Southern Territories";
        case 'TG': return "Togo";
        case 'TH': return "Thailand";
        case 'TJ': return "Tajikistan";
        case 'TK': return "Tokelau";
        case 'TL': return "Timor-Leste";
        case 'TM': return "Turkmenistan";
        case 'TN': return "Tunisia";
        case 'TO': return "Tonga";
        case 'TR': return "Turkey";
        case 'TT': return "Trinidad and Tobago";
        case 'TV': return "Tuvalu";
        case 'TW': return "Taiwan, Province of China";
        case 'TZ': return "Tanzania, United Republic of";
        case 'UA': return "Ukraine";
        case 'UG': return "Uganda";
        case 'UM': return "United States Minor Outlying Islands";
        case 'US': return "United States of America";
        case 'UY': return "Uruguay";
        case 'UZ': return "Uzbekistan";
        case 'VA': return "Holy See";
        case 'VC': return "Saint Vincent and the Grenadines";
        case 'VE': return "Venezuela, Bolivarian Republic of";
        case 'VG': return "Virgin Islands, British";
        case 'VI': return "Virgin Islands, U.S.";
        case 'VN': return "Viet Nam";
        case 'VU': return "Vanuatu";
        case 'WF': return "Wallis and Futuna";
        case 'WS': return "Samoa";
        case 'YE': return "Yemen";
        case 'YT': return "Mayotte";
        case 'ZA': return "South Africa";
        case 'ZM': return "Zambia";
        case 'ZW': return "Zimbabwe";
        default  : return "Unkown: "+v;
    }
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



