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
        if(document.location.hostname==="localhost") return true;
        if(document.location.hostname==="adilyalcin.github.io") return true;
        if(document.location.hostname==="www.cs.umd.edu") return true;
        if(document.location.hostname==="cs.umd.edu") return true;
        return false;
    },
    All : function(){
        var tmp = this.Check;
        this.Check =  this.WindowSize() && this.Desktop() && this.NoTouch() && this.host()===true && (this.sessionID_Cookie!==null);
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

function noop(){};

function sendLog(actID, dt, ts){
    // log only if all is fine
    if(logIf.Check!==true) return;
    // if timestamp is not defined, take current timestamp, and subtract from page load time.
    if(ts===undefined){
        ts = Date.now()-logIf.loadTs;
    }
    // To be included in all messages...
    var _dt = {
        'actID' : actID,
        'sesID' : logIf.sessionID_Cookie,
        'sesID2': logIf.sessionID_Now,
        'ts'    : ts,
        'demoID': demoID
    };
    if(dt){ 
        // custom data to be sent
        for (var key in dt) { _dt[key]=dt[key]; }
    }
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: true,
        jsonp: false,
        url: postURL,
        data: _dt
    });
};

// Set postURL
var postURL = "http://localhost:9090/";
if (document.location.hostname !== "localhost") 
	postURL = "http://keshiftracker.appspot.com";


