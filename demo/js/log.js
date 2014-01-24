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
        var w=$(window).width();
        var h=$(window).height();
        return (w>950) && (h>500) /* && (w>h)*/;
    },
    Desktop : function(){ // skip: Android, Blackberry, iPhone, iPad, iPod, Opera Mini, IEMobile
        return isMobile.any()===null;
    },
    NoTouch : function(){ // skip browsers supporting touch events.
        return !Modernizr.touch; 
    },
    NotIE : function() { // IE has issues with SVG rendering...
        return (navigator.appName !== 'Microsoft Internet Explorer');
    },
    InlineSVG : function(){ // Specificly, we must make sure that browser upports inline SVG elements
        return Modernizr.inlineSVG;
    },
    setSessionID : function(){
        document.getElementsByTagName("body")[0].onmousemove = null;
        this.sessionID = readCookie('sessionId');
        if(this.sessionID === '') {
            var ran  = window.event.clientX*Math.random();
            var ran2 = window.event.clientY*Math.random();
            this.sessionID = Math.floor((ran+ran2)*10000000000000);
            writeCookie('sessionId', this.sessionID, 365);
        }
        this.sessionID2 = Math.floor(Math.random()*10000000000000);
        this.All();
    },
    host : function(){
        if(document.location.hostname==="localhost") return true;
        if(document.location.hostname==="adilyalcin.github.io") return true;
        if(document.location.hostname==="www.cs.umd.edu") return true;
        if(document.location.hostname==="cs.umd.edu") return true;
        return false;
    },
    All : function(){
        var tmp = this.Check;
        this.Check =  this.WindowSize() && this.Desktop() && this.NoTouch() && this.NotIE() && this.host()===true && (this.sessionID!==null);
        if(this.Check===true && tmp === false) {
            sendLog(CATID.Configuration,ACTID_CONFIG.WindowSize,
                { height:$(window).height(),width:$(window).width(),agent:navigator.userAgent });
        }
        return this.Check;
    },
    sessionID: null,
    sessionID2: null,
    Check : true
}


function writeCookie(name,value,days) {
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

function readCookie(name) {
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

var loadTs = null;

function sendLog(catID, actID, dt){
    // log only if all is fine
    if(logIf.Check!==true) return;
    var ts;
    if(loadTs===null){
        loadTs = Date.now();
        ts = loadTs;
    } else {
        ts = Date.now()-loadTs;
    }
    var _dt = {
        'catID' : catID,
        'actID' : actID,
        'sesID' : logIf.sessionID,
        'sesID2': logIf.sessionID2,
        'ts'    : ts,
        'demoID': demoID
    };
    if(dt){ for (var key in dt) { _dt[key]=dt[key]; } }
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        jsonpCallback: "", // no callback / not interested in returned data
        url: postURL,
        data: _dt
    });
};

// Set postURL
var postURL = "http://localhost:9090/";
if (document.location.hostname !== "localhost") 
	postURL = "http://keshiftracker.appspot.com";


