/*********************************

keshif library

Copyright (c) 2014-2016, University of Maryland
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the University of Maryland nor the names of its contributors
  may not be used to endorse or promote products derived from this software
  without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

************************************ */

// load google visualization library only if google scripts were included
if(typeof google !== 'undefined'){
  google.load('visualization', '1', {'packages': []});
}

var kshf = {
  browsers: [],
  dt: {},
  dt_id: {},

  maxVisibleItems_Default: 100,
  scrollWidth: 19,
  attribPanelWidth: 220,

  map: {
    // http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png
    // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    // http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
    // http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png
    // http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png
    // http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg
    // http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg
    // http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png
    // http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png
    // http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png
    tileTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    wrapLongitude: 170,
    config: {
      maxBoundsViscosity: 1, 
      boxZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      /*continuousWorld: true, crs: L.CRS.EPSG3857 */
    },
    tileConfig: { 
      attribution: '© <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'+
        ' contributors &amp; <a href="http://cartodb.com/attributions" target="_blank">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      //noWrap: true
    }
  },

  lang: {
    en: {
      ModifyBrowser: "Modify browser",
      OpenDataSource: "Open data source",
      ShowInfoCredits: "Show info &amp; credits",
      ShowFullscreen: "Fullscreen",
      RemoveFilter: "Remove filter",
      RemoveAllFilters: "Remove all filters",
      SaveSelection: "Save Selection",
      MinimizeSummary: "Minimize",
      OpenSummary: "Open",
      MaximizeSummary: "Maximize",
      RemoveSummary: "Remove",
      ReverseOrder: "Reverse order",
      Reorder: "Reorder",
      ShowMoreInfo: "Show record info",
      Percentiles: "Percentiles",
      LockToCompare: "Lock selection",
      Unlock: "Unlock",
      Search: "Search",
      CreatingBrowser: "Creating Keshif Browser",
      Rows: "Rows",
      More: "More",
      LoadingData: "Loading data sources",
      ShowAll: "Show All",
      ScrollToTop: "Top",
      Absolute: "Absolute",
      Percent: "Percent",
      PartOf: "Part-Of",
      Width: "Length",
      DragToFilter: "Drag",
      And: "And",
      Or: "Or",
      Not: "Not",
      EditTitle: "Rename",
      ResizeBrowser: "Resize browser",
      RemoveRecords: "Remove record panel",
      EditFormula: "Edit formula",
      NoData: "(no data)",
      ZoomToFit: "Zoom to fit",
      Close: "Close",
      Help: "Help"
    },
    tr: {
      ModifyBrowser: "Tarayıcıyı düzenle",
      OpenDataSource: "Veri kaynağını aç",
      ShowInfoCredits: "Bilgi",
      ShowFullscreen: "Tam ekran",
      RemoveFilter: "Filtreyi kaldır",
      RemoveAllFilters: "Tüm filtreleri kaldır",
      MinimizeSummary: "Ufalt",
      OpenSummary: "Aç",
      MaximizeSummary: "Büyüt",
      RemoveSummary: "Kaldır",
      ReverseOrder: "Ters sırala",
      Reorder: "Yeniden sırala",
      ShowMoreInfo: "Daha fazla bilgi",
      Percentiles: "Yüzde",
      LockToCompare: "Kilitle ve karşılaştır",
      Unlock: "Kilidi kaldır",
      Search: "Ara",
      LoadingData: "Veriler yükleniyor...",
      CreatingBrowser: "Keşif arayüzü oluşturuluyor...",
      Rows: "Satır",
      More: "Daha",
      ShowAll: "Hepsi",
      ScrollToTop: "Yukarı",
      Absolute: "Net",
      Percent: "Yüzde",
      PartOf: "Görece",
      Width: "Genişlik",
      DragToFilter: "Sürükle",
      And: "Ve",
      Or: "Veya",
      Not: "Değil",
      EditTitle: "Değiştir",
      ResizeBrowser: "Boyutlandır",
      RemoveRecords: "Kayıtları kaldır",
      EditFormula: "Formülü değiştir",
      NoData: "(verisiz)",
      ZoomToFit: "Oto-yakınlaş",
      Close: "Kapat",
      Help: "Yardim"
    },
    fr: {
      ModifyBrowser: "Modifier le navigateur",
      OpenDataSource: "Ouvrir la source de données",
      ShowInfoCredits: "Afficher les credits",
      RemoveFilter: "Supprimer le filtre",
      RemoveAllFilters: "Supprimer tous les filtres",
      MinimizeSummary: "Réduire le sommaire",
      OpenSummary: "Ouvrir le sommaire",
      MaximizeSummary: "Agrandir le sommaire",
      RemoveSummary: "??",
      ReverseOrder: "Inverser l'ordre",
      Reorder: "Réorganiser",
      ShowMoreInfo: "Plus d'informations",
      Percentiles: "Percentiles",
      LockToCompare: "Bloquer pour comparer",
      Unlock: "Débloquer",
      Search: "Rechercher",
      CreatingBrowser: "Création du navigateur",
      Rows: "Lignes",
      More: "Plus",
      LoadingData: "Chargement des données",
      ShowAll: "Supprimer les filtres",
      ScrollToTop: "Début",
      Absolute: "Absolue",
      Percent: "Pourcentage",
      PartOf: "Part-Of",
      Width: "Largeur",
      DragToFilter: "??",
      And: "??",
      Or: "??",
      Not: "??",
      EditFormula: "Edit Formula",
      NoData: "(no data)",
      ZoomToFit: "Zoom to fit"
    },
    // translation by github@nelsonmau
    it: {
      ModifyBrowser: "Modifica il browser",
      OpenDataSource: "Fonte Open Data",
      ShowInfoCredits: "Mostra info e crediti",
      ShowFullscreen: "Schermo intero",
      RemoveFilter: "Rimuovi il filtro",
      RemoveAllFilters: "Rimuovi tutti i filtri",
      MinimizeSummary: "Chiudi il sommario",
      OpenSummary: "Apri il sommario",
      MaximizeSummary: "Massimizza il sommario",
      RemoveSummary: "Rimuovi il sommario",
      ReverseOrder: "Ordine inverso",
      Reorder: "Riordina",
      ShowMoreInfo: "Mostra più informazioni",
      Percentiles: "Percentuali",
      LockToCompare: "Blocca per confrontare",
      Unlock: "Sblocca",
      Search: "Cerca",
      CreatingBrowser: "Browser in preparazione - Keshif",
      Rows: "Righe",
      More: "Di più",
      LoadingData: "Carimento delle fonti dati",
      ShowAll: "Mostra tutto",
      ScrollToTop: "Torna su",
      Absolute: "Assoluto",
      Percent: "Percentuale",
      Relative: "Relativo",
      Width: "Larghezza",
      DragToFilter: "Trascina",
      And: "E",
      Or: "O",
      Not: "No",
      EditTitle: "Modifica",
      ResizeBrowser: "Ridimensiona il browser",
      RemoveRecords: "Rimuovi la visualizzazione dei record"
    },
    cur: null // Will be set to en if not defined before a browser is loaded
  },

  Util: {
    sortFunc_List_String: function(a, b){
      return a.localeCompare(b);
    },
    sortFunc_List_Date: function(a, b){
      if(a===null) return -1;
      if(b===null) return 1;
      return b.getTime() - a.getTime(); // recent first
    },
    sortFunc_List_Number: function(a, b){
      return b - a;
    },
    /** Given a list of columns which hold multiple IDs, breaks them into an array */
    cellToArray: function(dt, columns, splitExpr){
      if(splitExpr===undefined) splitExpr = /\b\s+/;
      var j;
      dt.forEach(function(p){
        p = p.data;
        columns.forEach(function(column){
          var list = p[column];
          if(list===null) return;
          if(typeof list==="number") {
            p[column] = ""+list;
            return;
          }
          var list2 = list.split(splitExpr);
          list = [];
          // remove empty "" records
          for(j=0; j<list2.length; j++){
            list2[j] = list2[j].trim();
            if(list2[j]!=="") list.push(list2[j]);
          }
          p[column] = list;
        });
      });
    },
    baseMeasureFormat: d3.format(".2s"),
    /** You should only display at most 3 digits + k/m/etc */
    formatForItemCount: function(n){
      if(n<1000) return n;
      return kshf.Util.baseMeasureFormat(n);
    },
    clearArray: function(arr){
      while(arr.length > 0) arr.pop();
    },
    ignoreScrollEvents: false,
    scrollToPos_do: function(scrollDom, targetPos){
      scrollDom = scrollDom[0][0];
      kshf.Util.ignoreScrollEvents = true;
      // scroll to top
      var startTime = null;
      var scrollInit = scrollDom.scrollTop;
      var easeFunc = d3.ease('cubic-in-out');
      var scrollTime = 500;
      var animateToTop = function(timestamp){
        var progress;
        if(startTime===null) startTime = timestamp;
        // complete animation in 500 ms
        progress = (timestamp - startTime)/scrollTime;
        var m=easeFunc(progress);
        scrollDom.scrollTop = (1-m)*scrollInit+m*targetPos;
        if(scrollDom.scrollTop!==targetPos){
          window.requestAnimationFrame(animateToTop);
        } else {
          kshf.Util.ignoreScrollEvents = false;
        }
      };
      window.requestAnimationFrame(animateToTop);
    },
    toProperCase: function(str){
      return str.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase()});
    },
    setTransform: function(dom,transform){
      dom.style.webkitTransform = transform;
      dom.style.MozTransform = transform;
      dom.style.msTransform = transform;
      dom.style.OTransform = transform;
      dom.style.transform = transform;
    },
    // http://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
    ordinal_suffix_of: function(i) {
      var j = i % 10, k = i % 100;
      if (j == 1 && k != 11) return i + "st";
      if (j == 2 && k != 12) return i + "nd";
      if (j == 3 && k != 13) return i + "rd";
      return i + "th";
    },
  },

  /** -- */
  fontLoaded: false,
  loadFont: function(){
    if(this.fontLoaded===true) return;
    WebFontConfig = {
      google: { families: [ 'Roboto:400,500,300,100,700:latin', 'Montserrat:400,700:latin' ] }
    };
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
    this.fontLoaded = true;
  },

  handleResize: function(){
    this.browsers.forEach(function(browser){ browser.updateLayout(); });
  },

  activeTipsy: undefined,
  colorScale : {
    converge: [
      d3.rgb('#ffffd9'),
      d3.rgb('#edf8b1'),
      d3.rgb('#c7e9b4'),
      d3.rgb('#7fcdbb'),
      d3.rgb('#41b6c4'),
      d3.rgb('#1d91c0'),
      d3.rgb('#225ea8'),
      d3.rgb('#253494'),
      d3.rgb('#081d58')],
    diverge: [
      d3.rgb('#8c510a'),
      d3.rgb('#bf812d'),
      d3.rgb('#dfc27d'),
      d3.rgb('#f6e8c3'),
      d3.rgb('#f5f5f5'),
      d3.rgb('#c7eae5'),
      d3.rgb('#80cdc1'),
      d3.rgb('#35978f'),
      d3.rgb('#01665e')]
  },

  /* -- */
  intersects: function(d3bound, leafletbound){
    // d3bound: [​[left, bottom], [right, top]​]
    // leafletBound._southWest.lat
    // leafletBound._southWest.long
    // leafletBound._northEast.lat
    // leafletBound._northEast.long
    if(d3bound[0][0]>leafletbound._northEast.lng) return false;
    if(d3bound[0][1]>leafletbound._northEast.lat) return false;
    if(d3bound[1][0]<leafletbound._southWest.lng) return false;
    if(d3bound[1][1]<leafletbound._southWest.lat) return false;
    return true;
  },

  /** -- */
  gistPublic: true,
  gistLogin: false,
  getGistLogin: function(){
    if(this.githubToken===undefined) return;
    $.ajax( 'https://api.github.com/user',
      { method: "GET",
        async: true,
        dataType: "json",
        headers: {Authorization: "token "+kshf.githubToken},
        success: function(response){ 
          kshf.gistLogin = response.login;
        }
      }
    );
  },

  kshfLogo: '<svg class="kshfLogo" viewBox="0 0 200 200">'+
    '<rect    class="kshfLogo_C1 kshfLogo_B" x="37.2" y="49.1" width="128.5" height="39.7" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 222.0549 46.0355)" />'+
    '<polygon class="kshfLogo_C1 kshfLogo_B" points="42.5,100.6 71,72 163,164.4 134.5,193" />'+
    '<polygon class="kshfLogo_C1 " points="132.2,13 53.5,91.3 79.3,117 158,38.7" />'+
    '<rect    class="kshfLogo_C2 kshfLogo_B" x="55.1" y="6.4" width="38.3" height="188.8" />'+
    '</svg>'
};

// tipsy, facebook style tooltips for jquery
// Modified / simplified version for internal Keshif use
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

function Tipsy(element, options) {
  this.jq_element = $(element);
  this.options = $.extend(
    { }, 
    { className: null, gravity: 'n', },
    options
  );
};
Tipsy.prototype = {
  show: function() {
    var maybeCall = function(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    };

    if(kshf.activeTipsy) kshf.activeTipsy.hide();

    kshf.activeTipsy = this;

    var title = this.getTitle();
    if(!title) return;
    var jq_tip = this.tip();

    jq_tip.find('.tipsy-inner')['html'](title);
    jq_tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
    jq_tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);

    if (this.options.className) {
      jq_tip.addClass(maybeCall(this.options.className, this.jq_element[0]));
    }

    var pos = $.extend({}, this.jq_element.offset(), {
        width: this.jq_element[0].offsetWidth,
        height: this.jq_element[0].offsetHeight
    });

    var actualWidth = jq_tip[0].offsetWidth,
        actualHeight = jq_tip[0].offsetHeight,
        gravity = maybeCall(this.options.gravity, this.jq_element[0]);

    this.tipWidth = actualWidth;
    this.tipHeight = actualHeight;

    var tp;
    switch (gravity.charAt(0)) {
        case 'n':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2};
            break;
        case 's':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
            break;
        case 'e':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth};
            break;
        case 'w':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width};
            break;
    }

    if (gravity.length == 2) {
      if (gravity.charAt(1) == 'w') {
        tp.left = pos.left + pos.width / 2 - 15;
      } else {
        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
      }
    }

    jq_tip.css(tp).addClass('tipsy-' + gravity);
    jq_tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);

    jq_tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: 1},200);
  },
  hide: function(){
    kshf.activeTipsy = undefined;
    this.tip().stop().fadeOut(200,function() { $(this).remove(); });
  },
  getTitle: function() {
    var title, jq_e = this.jq_element, o = this.options;
    var title, o = this.options;
    if (typeof o.title == 'string') {
      title = o.title;
    } else if (typeof o.title == 'function') {
      title = o.title.call(jq_e[0]);
    }
    title = ('' + title).replace(/(^\s*|\s*$)/, "");
    return title;
  },
  tip: function() {
    if(this.jq_tip) return this.jq_tip;
    this.jq_tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
    this.jq_tip.data('tipsy-pointee', this.jq_element[0]);
    return this.jq_tip;
  }
};


/**
 * @constructor
 */
kshf.Record = function(d, idIndex){
  this.data = d;
  this.idIndex = idIndex; // TODO: Items don't need to have ID index, only one per table is enough??

  // By default, each item is aggregated as 1
  // You can modify this with a non-negative value
  // Note that the aggregation currently works by summation only.
  this.measure_Self = 1;

  // Wanted item / not filtered out
  this.isWanted = true;

  this.recordRank = 0;

  // The data that's used for mapping this item, used as a cache.
  // This is accessed by filterID
  // Through this, you can also reach DOM of aggregates
      // DOM elements that this item is mapped to
      // - If this is a paper, it can be paper type. If this is author, it can be author affiliation.
  this._valueCache = []; // caching the values this item was mapped to

  this._aggrCache = [];

  this.DOM = { record: undefined };

  // If true, filter/wanted state is dirty and needs to be updated.
  this._filterCacheIsDirty = true;
  // Cacheing filter state per each summary
  this._filterCache = [];

  this.selectCompared_str = "";
  this.selectCompared = {A: false, B: false, C: false};
};
kshf.Record.prototype = {
  /** Returns unique ID of the item. */
  id: function(){
    return this.data[this.idIndex];
  },
  /** -- */
  setFilterCache: function(index,v){
    if(this._filterCache[index]===v) return;
    this._filterCache[index] = v;
    this._filterCacheIsDirty = true;
  },
  /** Updates isWanted state, and notifies all related filter attributes of the change */
  updateWanted: function(){
    if(!this._filterCacheIsDirty) return false;
    var me = this;

    var oldWanted = this.isWanted;
    this.isWanted = this._filterCache.every(function(f){ return f; });

    if(this.measure_Self && this.isWanted !== oldWanted){ // There is some change that affects computation
      var valToAdd = (this.isWanted && !oldWanted) ? this.measure_Self /*add*/ : -this.measure_Self /*remove*/;
      var cntToAdd = valToAdd>0?1:-1;
      this._aggrCache.forEach(function(aggr){ 
        aggr._measure.Active += valToAdd;
        if(valToAdd) aggr.recCnt.Active+=cntToAdd;
      });
    }

    this._filterCacheIsDirty = false;
    return this.isWanted !== oldWanted;
  },
  /** -- */
  setRecordDetails: function(value){
    this.showDetails = value;
    if(this.DOM.record) this.DOM.record.setAttribute('details', this.showDetails);
  },
  /** Called on mouse-over on a primary item type */
  highlightRecord: function(){
    if(this.DOM.record) this.DOM.record.setAttribute("selection","onRecord");
    // summaries that this item appears in
    this._aggrCache.forEach(function(aggr){
      if(aggr.DOM.aggrGlyph) aggr.DOM.aggrGlyph.setAttribute("selection","onRecord");
      if(aggr.DOM.matrixRow) aggr.DOM.matrixRow.setAttribute("selection","onRecord");
      if(aggr.summary && aggr.summary.setRecordValue) aggr.summary.setRecordValue(this);
    },this);
  },
  /** -- */
  unhighlightRecord: function(){
    if(this.DOM.record) this.DOM.record.removeAttribute("selection");
    // summaries that this item appears in
    this._aggrCache.forEach(function(aggr){
      aggr.unselectAggregate();
      if(aggr.summary && aggr.summary.hideRecordValue ) aggr.summary.hideRecordValue();
    },this);
  },
  /** -- */
  addForHighlight: function(){
    if(!this.isWanted || this.highlighted) return;
    if(this.DOM.record) {
      var x = this.DOM.record;
      x.setAttribute("selection","highlighted");
      // SVG geo area - move it to the bottom of parent so that border can be displayed nicely.
      // TODO: improve the conditional check!
      if(x.nodeName==="path") d3.select(x.parentNode.appendChild(x));
    }
    this._aggrCache.forEach(function(aggr){ 
      if(this.measure_Self===null ||this.measure_Self===0) return;
      aggr._measure.Highlight += this.measure_Self;
      aggr.recCnt.Highlight++;
    }, this);
    this.highlighted = true;
  },
  /** -- */
  remForHighlight: function(distribute){
    if(!this.isWanted || !this.highlighted) return;
    if(this.DOM.record) this.DOM.record.removeAttribute("selection");
    if(distribute) this._aggrCache.forEach(function(aggr){ 
      if(this.measure_Self===null || this.measure_Self===0) return;
      aggr._measure.Highlight -= this.measure_Self; 
      aggr.recCnt.Highlight--;
    }, this);
    this.highlighted = false;
  },
  /** -- */
  setCompared: function(cT){
    this.selectCompared_str+=cT+" ";
    this.selectCompared[cT] = true;
    this.domCompared();
  },
  /** -- */
  unsetCompared: function(cT){
    this.selectCompared_str = this.selectCompared_str.replace(cT+" ","");
    this.selectCompared[cT] = false;
    this.domCompared();
  },
  domCompared: function(){
    if(!this.DOM.record) return;
    if(this.selectCompared_str==="") {
      this.DOM.record.removeAttribute("rec_compared");
    } else {
      this.DOM.record.setAttribute("rec_compared",this.selectCompared_str);
    }
  }
};

/**
 * @constructor
 */
kshf.Aggregate = function(){};
kshf.Aggregate.prototype = {
  /** -- */
  init: function(d,idIndex){
    // Records which are mapped to this aggregate
    this.records = [];
    // What this aggregate represents
    this.data = d;
    // Aggregates can also be defined by an index
    this.idIndex = idIndex;
    // Selection state
    //  1: selected for inclusion (AND)
    //  2: selected for inclusion (OR)
    // -1: selected for removal (NOT query)
    //  0: not selected
    this.selected = 0;
    
    this.DOM = {
      aggrGlyph: undefined
    };

    this.resetAggregateMeasures();
  },
  /** Returns unique ID of the aggregate. */
  id: function(){
    return this.data[this.idIndex];
  },
  /** -- */
  resetAggregateMeasures: function(){
    this._measure = {
      Total     : 0,
      Active    : 0,
      Highlight : 0,
      Compare_A : 0,
      Compare_B : 0,
      Compare_C : 0
    };
    this.recCnt = {
      Total     : 0,
      Active    : 0,
      Highlight : 0,
      Compare_A : 0,
      Compare_B : 0,
      Compare_C : 0
    };
    this.records.forEach(function(record){
      if(record.measure_Self===null) return;
      this._measure.Total += record.measure_Self;
      this.recCnt.Total++;
      if(record.isWanted) {
        this._measure.Active += record.measure_Self;
        this.recCnt.Active++;
      }
    },this);
  },
  /** -- */
  addRecord: function(record){
    this.records.push(record);
    record._aggrCache.push(this);
    if(record.measure_Self===null) return;
    this._measure.Total += record.measure_Self;
    this.recCnt.Total++;
    if(record.isWanted) {
      this._measure.Active += record.measure_Self;
      this.recCnt.Active++;
    }
  },
  /** -- */
  removeRecord: function(record){
    this.records.splice(this.records.indexOf(record),1);
    record._aggrCache.splice(record._aggrCache.indexOf(this),1);
    if(record.measure_Self===null) return;
    this._measure.Total -= record.measure_Self;
    this.recCnt.Total--;
    if(record.isWanted) {
      this._measure.Active -= record.measure_Self;
      this.recCnt.Active--;
    }
  },
  /** -- */
  measure: function(v){
    if(kshf.browser.measureFunc==="Avg"){
      var r=this.recCnt[v];
      return (r===0) ? 0 : this._measure[v]/r ; // avoid division by zero.
    }
    return this._measure[v];
  },
  /** -- */
  ratioHighlightToTotal: function(){
    return this._measure.Highlight / this._measure.Total;
  },
  /** -- */
  ratioHighlightToActive: function(){
    return this._measure.Highlight / this._measure.Active;
  },
  /** -- */
  ratioCompareToActive: function(cT){
    return this._measure["Compare_"+cT] / this._measure.Active;
  },

  /** -- */
  unselectAggregate: function(){
    if(this.DOM.aggrGlyph) {
      this.DOM.aggrGlyph.removeAttribute("selection");
      this.DOM.aggrGlyph.removeAttribute("showlock");
    }
    if(this.DOM.matrixRow) this.DOM.matrixRow.removeAttribute("selection");
  },

  /** -- */
  selectCompare: function(cT){
    if(this.DOM.aggrGlyph) this.DOM.aggrGlyph.setAttribute("compare","true");
    this.compared = cT;
    this.records.forEach(function(record){ record.setCompared(cT); });
  },
  /** -- */
  clearCompare: function(cT){
    if(this.DOM.aggrGlyph) this.DOM.aggrGlyph.removeAttribute("compare");
    this.compared = false;
    this.records.forEach(function(record){ record.unsetCompared(cT); });
  }, 
  /** -- */
  selectHighlight: function(){
    this.records.forEach(function(record){ record.addForHighlight(); });
  },
  /** -- */
  clearHighlight: function(){
    this.records.forEach(function(record){ record.remForHighlight(false); });
  }, 

  // CATEGORICAL AGGREGATES ONLY
  f_selected: function(){ return this.selected!== 0; },
  f_included: function(){ return this.selected >  0; },
  is_NONE   : function(){ return this.selected=== 0; },
  is_NOT    : function(){ return this.selected===-1; },
  is_AND    : function(){ return this.selected=== 1; },
  is_OR     : function(){ return this.selected=== 2; },

  set_NONE: function(){
    if(this.inList!==undefined) {
      this.inList.splice(this.inList.indexOf(this),1);
    }
    this.inList = undefined;
    this.selected = 0; this._refreshFacetDOMSelected();
  },
  set_NOT: function(l){
    if(this.is_NOT()) return;
    this._insertToList(l);
    this.selected =-1; this._refreshFacetDOMSelected();
  },
  set_AND: function(l){
    if(this.is_AND()) return;
    this._insertToList(l);
    this.selected = 1; this._refreshFacetDOMSelected();
  },
  set_OR: function(l){
    if(this.is_OR()) return;
    this._insertToList(l);
    this.selected = 2; this._refreshFacetDOMSelected();
  },

  /** Internal */
  _insertToList: function(l){
    if(this.inList!==undefined) {
      this.inList.splice(this.inList.indexOf(this),1);
    }
    this.inList = l;
    l.push(this);
  },
  /** Internal */
  _refreshFacetDOMSelected: function(){
    if(this.DOM.aggrGlyph) this.DOM.aggrGlyph.setAttribute("selected",this.selected);
  },
};

kshf.Aggregate_EmptyRecords = function(){};
kshf.Aggregate_EmptyRecords.prototype = new kshf.Aggregate();
var Aggregate_EmptyRecords_functions = {
  /** -- */
  init: function(){
    kshf.Aggregate.prototype.init.call(this,{id: null},'id');
    this.isVisible = true;
  }
}
for(var index in Aggregate_EmptyRecords_functions){
  kshf.Aggregate_EmptyRecords.prototype[index] = Aggregate_EmptyRecords_functions[index];
}

/**
 * @constructor
 */
kshf.BreadCrumb = function(browser, selectType){
  this.browser = browser;
  this.DOM = null;
  this.selectType = selectType;
};
kshf.BreadCrumb.prototype = {
  isCompare: function(){
    return this.selectType.substr(0,7)==="Compare";
  },
  showCrumb: function(summary){
    if(this.DOM===null) {
      this._insertDOM_crumb(summary);
    }
    this.DOM.select(".crumbHeader").html(summary.summaryName);
    var details;
    if(this.selectType==="Filter"){
      details = summary.summaryFilter.filterView_Detail.call(summary.summaryFilter);
    } else {
      var selectedAggr = this.browser.selectedAggr[this.selectType];
      if(selectedAggr instanceof kshf.Aggregate_EmptyRecords){
        details = kshf.lang.cur.NoData;
      } else if(summary.printAggrSelection){
        details = summary.printAggrSelection(selectedAggr);
      } else {
        return;
      }
    }
    details = "" + details; // convert to string, in case the return value is a number...
    if(details) this.DOM.select(".crumbDetails").html(details.replace(/<br>/g," "));
  },
  removeCrumb: function(){
    if(this.DOM === null) return;
    var me=this;
    this.DOM.attr("ready",false);
    setTimeout(function(){ 
      if(me.DOM===null) return;
      me.DOM[0][0].parentNode.removeChild(me.DOM[0][0]);
      me.DOM = null;
    }, 350);
  },
  _insertDOM_crumb: function(summary){
    var me=this;
    this.DOM = this.browser.DOM.breadcrumbs.append("span")
      .attr("class","crumb crumbMode_"+this.selectType)
      .each(function(){
        if(me.selectType!=="Highlight"){
          var l=this.parentNode.childNodes.length;
          if(l>1) this.parentNode.insertBefore(this, this.parentNode.childNodes[l-2] );
        }
        this.tipsy = new Tipsy(this, {
          gravity: 'n',
          title: function(){ 
            switch(me.selectType){
              case "Filter":    return kshf.lang.cur.RemoveFilter;
              case "Highlight": return "Remove Highlight";
              default:          return kshf.lang.cur.Unlock; // Compare
            }
          }
        });
      })
      .on("mouseenter",function(){
        this.tipsy.show();
        if(me.isCompare()) me.browser.refreshMeasureLabels(me.selectType);
      })
      .on("mouseleave",function(){
        this.tipsy.hide();
        if(me.isCompare()) me.browser.refreshMeasureLabels();
      })
      .on("click",function(){
        this.tipsy.hide();
        if(me.selectType==="Filter") {
          summary.summaryFilter.clearFilter();
        } else if(me.selectType==="Highlight") {
          me.browser.clearSelect_Highlight(true);
        } else {
          me.browser.clearSelect_Compare(me.selectType.substr(8), true);
          me.browser.refreshMeasureLabels();
        }
      });

    this.DOM.append("span").attr("class","clearCrumbButton fa");
    var y = this.DOM.append("span").attr("class","crumbText");
    y.append("span").attr("class","crumbHeader");
    y.append("span").attr("class","crumbDetails");
    // animate appear
    window.getComputedStyle(this.DOM[0][0]).opacity; // force redraw
    this.DOM.attr("ready",true);

    // Push the save button to the end of list
    var dom = this.browser.DOM.saveSelection[0][0];
    dom.parentNode.appendChild(dom);
  },
};

/**
 * @constructor
 */
kshf.Filter = function(filterOptions){
  this.isFiltered = false;

  this.browser = filterOptions.browser;
  this.summary = filterOptions.summary;

  this.onClear = filterOptions.onClear;
  this.onFilter = filterOptions.onFilter;
  this.filterView_Detail = filterOptions.filterView_Detail; // must be a function

  this.filterID = this.browser.filterCount++;

  this.browser.records.forEach(function(record){ record.setFilterCache(this.filterID,true); },this);
  this.how = "All";
  this.filterCrumb = new kshf.BreadCrumb(this.browser,"Filter");
};
kshf.Filter.prototype = {
  addFilter: function(){
    this.isFiltered = true;

    if(this.onFilter) this.onFilter.call(this);

    var stateChanged = false;

    var how=0;
    if(this.how==="LessResults") how = -1;
    if(this.how==="MoreResults") how = 1;

    this.browser.records.forEach(function(record){
      if(how<0 && !record.isWanted) return;
      if(how>0 &&  record.isWanted) return;
      stateChanged = record.updateWanted() || stateChanged;
    },this);

    this.filterCrumb.showCrumb(this.summary);

    this.browser.update_Records_Wanted_Count();
    this.browser.refresh_filterClearAll();
    this.browser.clearSelect_Highlight(true);
    if(stateChanged) this.browser.updateAfterFilter();
  },
  /** -- */
  clearFilter: function(forceUpdate){
    if(!this.isFiltered) return; // TODO: Does this break anything?
    this.isFiltered = false;

    if(this.onClear) this.onClear.call(this);

    // clear filter cache - no other logic is necessary
    this.browser.records.forEach(function(record){ 
      record.setFilterCache(this.filterID,true);
    },this);

    if(forceUpdate!==false){
      this.browser.records.forEach(function(record){
        if(!record.isWanted) record.updateWanted();
      });
    }

    this.filterCrumb.removeCrumb();

    if(forceUpdate!==false){
      this.browser.update_Records_Wanted_Count();
      this.browser.refresh_filterClearAll();
      this.browser.updateAfterFilter();
    }
  },
};

/** -- */
kshf.RecordDisplay = function(kshf_, config){
    var me = this;
    this.browser = kshf_;
    this.DOM = {};

    this.config = config;

    this.config.sortColWidth = this.config.sortColWidth || 50; // default is 50 px

    this.autoExpandMore = true;
    if(config.autoExpandMore===false) this.autoExpandMore = false;

    this.maxVisibleItems_Default = config.maxVisibleItems_Default || kshf.maxVisibleItems_Default;
    this.maxVisibleItems = this.maxVisibleItems_Default; // This is the dynamic property

    this.showRank = config.showRank || false;
    this.mapMouseControl = "pan";

    this.displayType   = config.displayType   || 'list'; // 'grid', 'list', 'map', 'nodelink'
    if(config.geo) this.displayType = 'map';
    if(config.linkBy) {
      this.displayType = 'nodelink';
      if(!Array.isArray(config.linkBy)) config.linkBy = [config.linkBy];
    } else {
      config.linkBy = [];
    }

    this.detailsToggle = config.detailsToggle || 'zoom'; // 'one', 'zoom', 'off' (any other string counts as off)

    this.textSearchSummary = null;
    this.recordViewSummary = null;

    /***********
     * SORTING OPTIONS
     *************************************************************************/
    config.sortingOpts = config.sortBy; // depracated option (sortingOpts)

    this.sortingOpts = config.sortingOpts || [ {title:this.browser.records[0].idIndex} ]; // Sort by id by default
    if(!Array.isArray(this.sortingOpts)) this.sortingOpts = [this.sortingOpts];

    this.prepSortingOpts();
    var firstSortOpt = this.sortingOpts[0];
    // Add all interval summaries as sorting options
    this.browser.summaries.forEach(function(summary){
      if(summary.panel===undefined) return; // Needs to be within view
      if(summary.type!=="interval") return; // Needs to be interval (numeric)
      this.addSortingOption(summary);
    },this);
    this.prepSortingOpts();
    this.alphabetizeSortingOptions();

    this.setSortingOpt_Active(firstSortOpt || this.sortingOpts[0]);

    this.DOM.root = this.browser.DOM.root.select(".recordDisplay")
      .attr('detailsToggle',this.detailsToggle)
      .attr('showRank',this.showRank)
      .attr('mapMouseControl',this.mapMouseControl)
      .attr('hasRecordView',false);

    var zone = this.DOM.root.append("div").attr("class","dropZone dropZone_recordView")
        .on("mouseenter",function(){ this.setAttribute("readyToDrop",true);  })
        .on("mouseleave",function(){ this.setAttribute("readyToDrop",false); })
        .on("mouseup",function(event){
          var movedSummary = me.browser.movedSummary;
          if(movedSummary===null || movedSummary===undefined) return;

          movedSummary.refreshNuggetDisplay();
          me.setRecordViewSummary(movedSummary);

          if(me.textSearchSummary===null) me.setTextSearchSummary(movedSummary);

          me.browser.updateLayout();
        });
    zone.append("div").attr("class","dropIcon fa fa-list-ul");
    
    this.DOM.recordDisplayHeader = this.DOM.root.append("div").attr("class","recordDisplayHeader");
    this.initDOM_RecordViewHeader();

    this.DOM.recordDisplayWrapper = this.DOM.root.append("div").attr("class","recordDisplayWrapper");

    this.viewAs(this.displayType);

    if(config.recordView!==undefined){
      if(typeof(config.recordView)==="string"){
        // it may be a function definition if so, evaluate
        if(config.recordView.substr(0,8)==="function"){
          // Evaluate string to a function!!
          eval("\"use strict\"; config.recordView = "+config.recordView);
        }
      }

      this.setRecordViewSummary(
        (typeof config.recordView === 'string') ?
          this.browser.summaries_by_name[config.recordView] :
          // function
          this.browser.createSummary('Records',config.recordView,'categorical')
      );
    }

    if(config.textSearch){
      // Find the summary. If it is not there, create it
      if(typeof(config.textSearch)==="string"){
        this.setTextSearchSummary( this.browser.summaries_by_name[config.textSearch] );
      } else {
        var name = config.textSearch.name;
        var value = config.textSearch.value;
        if(name!==undefined){
          var summary = this.browser.summaries_by_name[config.textSearch];
          if(!summary){
            if(typeof(value)==="function"){
              summary = browser.createSummary(name,value,'categorical');
            } else if(typeof(value)==="string"){
              summary = browser.changeSummaryName(value,name);
            };
          }
        }
        this.setTextSearchSummary(summary);
      }
    }
};

kshf.RecordDisplay.prototype = {
    /** -- */
    setHeight: function(v){
      if(this.recordViewSummary===null) return;
      var me=this;
      this.curHeight = v;
      this.DOM.recordDisplayWrapper.style("height",v+"px");
      if(this.displayType==='map'){
        setTimeout(function(){ 
          me.leafletRecordMap.invalidateSize();
        }, 1000);
      }
    },
    /** -- */
    refreshWidth: function(widthMiddlePanel){
      this.curWidth = widthMiddlePanel;
      if(this.displayType==='map'){
        this.leafletRecordMap.invalidateSize();
      }
    },
    /** -- */
    getRecordEncoding: function(){
      return (this.displayType==='map' || this.displayType==='nodelink') ? "color" : "sort";
    },
    /** -- */
    map_refreshColorScaleBins: function(){
      var me = this;
      this.DOM.recordColorScaleBins
        .style("background-color", function(d){
          if(me.sortingOpt_Active.invertColorScale) d = 8-d;
          return kshf.colorScale[me.browser.mapColorTheme][d];
        });
    },
    /** --  */
    map_projectRecords: function(){
      var me = this;
      this.DOM.kshfRecords.attr("d", function(record){ return me.recordGeoPath(record._geoFeat_); });
    },
    /** -- */
    map_zoomToActive: function(){
      // Insert the bounds for each record path into the bs
      var bs = [];
      this.browser.records.forEach(function(record){
        if(!record.isWanted) return;
        if(record._geoBound_ === undefined) return;
        var b = record._geoBound_;
        if(isNaN(b[0][0])) return;
        // Change wrapping (US World wrap issue)
        if(b[0][0]>kshf.map.wrapLongitude) b[0][0]-=360;
        if(b[1][0]>kshf.map.wrapLongitude) b[1][0]-=360;
        bs.push(L.latLng(b[0][1], b[0][0]));
        bs.push(L.latLng(b[1][1], b[1][0]));
      });

      var bounds = new L.latLngBounds(bs);
      if(!this.browser.finalized){ // First time: just fit bounds
        this.leafletRecordMap.fitBounds( bounds );
        return;
      }
      this.leafletRecordMap.flyToBounds(
        bounds,
        { padding: [0,0], 
          pan: {animate: true, duration: 1.2}, 
          zoom: {animate: true} 
        }
        );
    },
    /** -- */
    initRecordGeoFeat: function(){
      var _geo_ = this.config.geo;
      if(typeof _geo_ === "string"){
        var x=_geo_;
        _geo_ = function(){ return this[x]; }
      }
      // Compute _geoBound_ of each record
      this.browser.records.forEach(function(record){
        var feature = _geo_.call(record.data);
        if(feature) record._geoFeat_ = feature;
      });
    },
    /** -- */
    initRecordGeoBound: function(){
      // Compute _geoBound_ of each record
      this.browser.records.forEach(function(record){
        var feature = record._geoFeat_;
        if(feature) record._geoBound_ = d3.geo.bounds(feature);
      });
    },
    /** -- */
    initDOM_MapView: function(){
      var me = this;
      if(this.DOM.recordMap_Base) {
        this.DOM.recordGroup = this.DOM.recordMap_SVG.select(".recordGroup");
        this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord");
        return; // Do not initialize twice
      }

      this.setSpatialFilter();

      function updateRectangle(bounds){
        var north_west = me.leafletRecordMap.latLngToLayerPoint(bounds.getNorthWest());
        var south_east = me.leafletRecordMap.latLngToLayerPoint(bounds.getSouthEast());
        this.style.left = (north_west.x)+"px";
        this.style.top = (north_west.y)+"px";
        this.style.height = Math.abs(south_east.y-north_west.y)+"px";
        this.style.width  = Math.abs(south_east.x-north_west.x)+"px";
      };

      this.DOM.recordMap_Base = this.DOM.recordDisplayWrapper.append("div").attr("class","recordMap_Base");
      var zoomInit;

      this.leafletRecordMap = L.map(this.DOM.recordMap_Base[0][0], kshf.map.config )
        .addLayer( new L.TileLayer( kshf.map.tileTemplate, kshf.map.tileConfig) )
        .on("viewreset",function(){ 
          me.map_projectRecords();
        })
        .on("movestart",function(){
          me.browser.DOM.root.attr("pointerEvents",false);
          zoomInit = this.getZoom();
          me.DOM.recordMap_SVG.style("opacity",0.3);
          me.DOM.recordMap_Base.selectAll(".spatialQueryBox").style("display","none");
        })
        .on("move",function(){
          // console.log("MapZoom: "+me.leafletRecordMap.getZoom());
        })
        .on("moveend",function(){
          me.browser.DOM.root.attr("pointerEvents",true);
          me.DOM.recordMap_SVG.style("opacity",null);
          me.DOM.recordMap_Base.selectAll(".spatialQueryBox").style("display",null);
          me.refreshViz_Compare_All();
          me.DOM.recordMap_Base.select(".spatialQueryBox_Filter")
            .each(function(d){
              var bounds = me.spatialFilter.bounds;
              if(bounds) updateRectangle.call(this,bounds);
            });
          me.DOM.recordMap_Base.select(".spatialQueryBox_Highlight")
            .each(function(d){
              var bounds = me.browser.flexAggr_Highlight.bounds;
              if(bounds) updateRectangle.call(this,bounds);
            });
          me.DOM.recordMap_Base.selectAll("[class*='spatialQueryBox_Comp']")
            .each(function(d){
              var bounds = me.browser['flexAggr_'+d].bounds;
              if(bounds) updateRectangle.call(this,bounds);
            });
          if(this.getZoom()!==zoomInit) me.map_projectRecords();
        });

      this.recordGeoPath = d3.geo.path().projection( 
        d3.geo.transform({
          // Use Leaflet to implement a D3 geometric transformation.
          point: function(x, y) {
            if(x>kshf.map.wrapLongitude) x-=360;
            var point = me.leafletRecordMap.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
          }
        }) 
      );

      this.initRecordGeoFeat();
      this.initRecordGeoBound();

      this.DOM.recordMap_Base.select(".leaflet-overlay-pane").selectAll(".spatialQueryBox")
        .data(["Filter","Highlight","Compare_A","Compare_B","Compare_C"])
        .enter()
          .append("div").attr("class", function(d){ return "spatialQueryBox spatialQueryBox_"+d; })
            .append("div").attr("class","clearSelection fa fa-times-circle")
              .each(function(d){ 
                this.tipsy = new Tipsy(this, {gravity: 'se', 
                  title: (d==="Filter") ? kshf.lang.cur.RemoveFilter : kshf.lang.cur.Unlock
                });
              })
              .on("mouseenter", function(){ this.tipsy.show(); })
              .on("mouseleave", function(){ this.tipsy.hide(); })
              .on("click", function(d){
                if(d==="Filter"){
                  me.spatialFilter.clearFilter();
                } else if(d!=="Highlight"){
                  me.browser.clearSelect_Compare(d.substr(8), true);
                }
                this.tipsy.hide();
              });

      this.drawSelect = false;
      this.DOM.recordMap_Base.select(".leaflet-tile-pane")
        .on("mousedown",function(){
          if(me.mapMouseControl!=="draw") return;
          if(me.drawSelect==="Highlight") return;
          var mousePos = d3.mouse(this);  
          var curLatLong = me.leafletRecordMap.layerPointToLatLng(L.point(mousePos[0], mousePos[1]));
          me.DOM.recordMap_Base.attr("drawSelect","Filter");
          me.drawingStartPoint = curLatLong;
          me.drawSelect = "Filter";
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("mouseup",function(){ 
          if(me.mapMouseControl!=="draw") return;
          d3.event.stopPropagation();
          d3.event.preventDefault();
          me.DOM.recordMap_Base.attr("drawSelect",null);
          if(me.drawSelect==="Filter"){
            me.spatialFilter.addFilter();
          } else if(me.drawSelect==="Highlight"){
            var bounds = me.browser.flexAggr_Highlight.bounds;
            var cT = me.browser.setSelect_Compare(false,true);
            me.browser['flexAggr_Compare_'+cT].bounds = bounds;
            me.DOM.recordMap_Base.select(".spatialQueryBox_Compare_"+cT)
              .attr("active",true)
              .each(function(d){ updateRectangle.call(this,bounds); });
          }
          me.drawSelect = false;
        })
        .on("mousemove",function(){
          if(me.mapMouseControl!=="draw") return;
          if(me.drawSelect!=="Filter" && !d3.event.shiftKey){
            me.drawSelect = false;
            me.DOM.recordMap_Base.attr("drawSelect",null);
            me.browser.clearSelect_Highlight();
          }
          var mousePos = d3.mouse(this);
          var curLatLong = me.leafletRecordMap.layerPointToLatLng(L.point(mousePos[0], mousePos[1]));
          if(d3.event.shiftKey && !me.drawSelect){
            me.DOM.recordMap_Base.attr("drawSelect","Highlight");
            me.drawingStartPoint = curLatLong;              
            me.drawSelect = "Highlight";
          }
          if(!me.drawSelect) return;

          var bounds = L.latLngBounds([me.drawingStartPoint,curLatLong]);
          if(me.drawSelect==="Highlight"){
            me.browser.flexAggr_Highlight.bounds = bounds;
            //me.spatialQuery.highlight.setBounds(bounds);
            // Refresh bounds
            me.DOM.recordMap_Base.select(".spatialQueryBox_Highlight")
              .each(function(d){ updateRectangle.call(this,bounds); });

            var records = [];
            me.browser.records.forEach(function(record){ 
              if(!record.isWanted) return;
              if(record._geoBound_ === undefined) return;
              // already have "bounds" variable
              if(kshf.intersects(record._geoBound_, bounds)){
                records.push(record);
              } else {
                record.remForHighlight(true);
              }
            });
            me.browser.flexAggr_Highlight.summary = me.recordViewSummary; // record display
            me.browser.flexAggr_Highlight.records = records;
            me.browser.setSelect_Highlight();
          } else {
            me.spatialFilter.bounds = bounds;
            me.DOM.recordMap_Base.select(".spatialQueryBox_Filter")
              .each(function(d){ updateRectangle.call(this,bounds); });
            //me.spatialQuery.filter.setBounds(bounds);
          }
          d3.event.stopPropagation();
          d3.event.preventDefault();
        });

      this.DOM.recordMap_SVG = d3.select(this.leafletRecordMap.getPanes().overlayPane)
        .append("svg").attr("xmlns","http://www.w3.org/2000/svg").attr("class","recordMap_SVG");

      // The fill pattern definition in SVG, used to denote geo-objects with no data.
      // http://stackoverflow.com/questions/17776641/fill-rect-with-pattern
      this.DOM.recordMap_SVG.append('defs')
        .append('pattern')
          .attr('id', 'diagonalHatch')
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('width', 4)
          .attr('height', 4)
          .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .attr('stroke', 'gray')
            .attr('stroke-width', 1);

      this.DOM.recordGroup = this.DOM.recordMap_SVG.append("g").attr("class", "leaflet-zoom-hide recordGroup");

      // Add custom controls
      var DOM_control = d3.select(this.leafletRecordMap.getContainer()).select(".leaflet-control");

      DOM_control.append("a")
        .attr("class","leaflet-control-view-map")
        .attr("title","Show/Hide Map")
        .attr("href","#")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'w', title: "Show/Hide Map"}); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .html("<span class='viewMap fa fa-map-o'></span>")
        .on("dblclick",function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
        })
        .on("click",function(){
          var x = d3.select(me.leafletRecordMap.getPanes().tilePane);
          x.attr("showhide", x.attr("showhide")==="hide"?"show":"hide");
          d3.select(this.childNodes[0]).attr("class","fa fa-map"+((x.attr("showhide")==="hide")?"":"-o"));
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });

      DOM_control.append("a").attr("class","mapMouseControl fa")
        .each(function(){ 
          this.tipsy = new Tipsy(this, {gravity: 'w', title: function(){
            return "Drag mouse to "+(me.mapMouseControl==="pan"?"draw":"pan");
          } }); 
        })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .on("click",function(){ 
          me.mapMouseControl = me.mapMouseControl==="pan"?"draw":"pan";
          me.DOM.root.attr("mapMouseControl",me.mapMouseControl);
        });

      DOM_control.append("a")
        .attr("class","leaflet-control-viewFit").attr("title",kshf.lang.cur.ZoomToFit)
        .attr("href","#")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'w', title: kshf.lang.cur.ZoomToFit}); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .html("<span class='viewFit fa fa-arrows-alt'></span>")
        .on("dblclick",function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
        })
        .on("click",function(){
          me.map_zoomToActive();
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });
    },
    /** -- */
    refreshViz_Compare_All: function(){
      if(this.displayType==='map') {
        var me=this;
        this.DOM.recordMap_Base.selectAll("[class*='spatialQueryBox_Comp']")
          .attr("active", function(d){ return me.browser.vizActive[d] ? true : null; });
      }
    },
    /** -- */
    initDOM_NodeLinkView: function(){
      var me = this;

      if(this.DOM.recordNodeLink_SVG) {
        this.DOM.recordGroup = this.DOM.recordNodeLink_SVG.select(".recordGroup");
        this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord");
        return; // Do not initialize twice
      }

      this.initDOM_NodeLinkView_Settings();

      this.nodeZoomBehavior = d3.behavior.zoom()
        .scaleExtent([0.5, 8])
        .on("zoom", function(){
          gggg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
          me.refreshNodeVis();
        });

      this.DOM.recordNodeLink_SVG = this.DOM.recordDisplayWrapper
        .append("svg").attr("xmlns","http://www.w3.org/2000/svg").attr("class","recordNodeLink_SVG")
        .call(this.nodeZoomBehavior);

      var gggg = this.DOM.recordNodeLink_SVG.append("g");

      this.DOM.linkGroup = gggg.append("g").attr("class","linkGroup");

      this.DOM.recordGroup = gggg.append("g").attr("class","recordGroup recordGroup_Node");

      this.DOM.NodeLinkControl = this.DOM.recordDisplayWrapper.append("span").attr("class","NodeLinkControl");

      var animationControl = this.DOM.NodeLinkControl.append("span").attr("class","animationControl");

      animationControl.append("span").attr("class","NodeLinkAnim_Play fa fa-play")
        .on("click",function(){ 
          me.nodelink_Force.start(); 
          me.DOM.root.attr("hideLinks",true);
        });
      animationControl.append("span").attr("class","NodeLinkAnim_Pause fa fa-pause")
        .on("click",function(){ 
          me.nodelink_Force.stop();
          me.DOM.root.attr("hideLinks",null);
        });
      this.DOM.NodeLinkAnim_Refresh = this.DOM.NodeLinkControl.append("span")
        .attr("class","NodeLinkAnim_Refresh fa fa-refresh")
        .on("click",function(){ 
          me.refreshNodeLinks();
          this.style.display = null;
        });
    },
    /** -- */
    initDOM_ListView: function(){
      var me = this;

      if(this.DOM.recordGroup_List) return;

      this.DOM.recordGroup_List = this.DOM.recordDisplayWrapper.append("div").attr("class","recordGroup_List");

      this.DOM.recordGroup = this.DOM.recordGroup_List.append("div").attr("class","recordGroup")
        .on("scroll",function(d){
          if(this.scrollHeight-this.scrollTop-this.offsetHeight<10){
            if(me.autoExpandMore===false){
              me.DOM.showMore.attr("showMoreVisible",true);
            } else {
              me.showMoreRecordsOnList(); // automatically add more records
            }
          } else {
            me.DOM.showMore.attr("showMoreVisible",false);
          }
          me.DOM.scrollToTop.style("visibility", this.scrollTop>0?"visible":"hidden");
          me.DOM.adjustSortColumnWidth.style("top",(this.scrollTop-2)+"px")
        });

      this.DOM.adjustSortColumnWidth = this.DOM.recordGroup.append("div")
        .attr("class","adjustSortColumnWidth dragWidthHandle")
        .on("mousedown", function (d, i) {
          if(d3.event.which !== 1) return; // only respond to left-click
          me.browser.DOM.root.style('cursor','ew-resize');
          var _this = this;
          var mouseDown_x = d3.mouse(document.body)[0];
          var mouseDown_width = me.sortColWidth;

          me.browser.DOM.pointerBlock.attr("active","");

          me.browser.DOM.root.on("mousemove", function() {
            _this.setAttribute("dragging","");
            me.setSortColumnWidth(mouseDown_width+(d3.mouse(document.body)[0]-mouseDown_x));
          }).on("mouseup", function(){
            me.browser.DOM.root.style('cursor','default');
            me.browser.DOM.pointerBlock.attr("active",null);
            me.browser.DOM.root.on("mousemove", null).on("mouseup", null);
            _this.removeAttribute("dragging");
          });
          d3.event.preventDefault();
        });

      this.DOM.showMore = this.DOM.root.append("div").attr("class","showMore")
        .attr("showMoreVisible",false)
        .on("mouseenter",function(){ d3.select(this).selectAll(".loading_dots").attr("anim",true); })
        .on("mouseleave",function(){ d3.select(this).selectAll(".loading_dots").attr("anim",null); })
        .on("click",function(){ me.showMoreRecordsOnList(); });
      this.DOM.showMore.append("span").attr("class","MoreText").html("Show More");
      this.DOM.showMore.append("span").attr("class","Count CountAbove");
      this.DOM.showMore.append("span").attr("class","Count CountBelow");
      this.DOM.showMore.append("span").attr("class","loading_dots loading_dots_1");
      this.DOM.showMore.append("span").attr("class","loading_dots loading_dots_2");
      this.DOM.showMore.append("span").attr("class","loading_dots loading_dots_3");
    },
    /** -- */
    initDOM_RecordViewHeader: function(){
      var me=this;

      this.DOM.recordColorScaleBins =  this.DOM.recordDisplayHeader.append("div").attr("class","recordColorScale")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'w', title: "Change color scale"}); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout" ,function(){ this.tipsy.hide(); })
        .on("click"    ,function(){
          me.browser.mapColorTheme = (me.browser.mapColorTheme==="converge") ? "diverge" : "converge";
          me.refreshRecordColors();
          me.map_refreshColorScaleBins();
          me.sortingOpt_Active.map_refreshColorScale();
        })
        .selectAll(".recordColorScaleBin").data([0,1,2,3,4,5,6,7,8])
          .enter().append("div").attr("class","recordColorScaleBin");
      
      this.map_refreshColorScaleBins();

      this.DOM.itemRank_control = this.DOM.recordDisplayHeader.append("div").attr("class","itemRank_control fa")
        .each(function(){
          this.tipsy = new Tipsy(this, {gravity: 'n', 
            title: function(){ return (me.showRank?"Hide":"Show")+" ranking"; }});
        })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.setShowRank(!me.showRank); });

      this.initDOM_SortSelect();
      this.initDOM_GlobalTextSearch();

      this.DOM.buttonRecordViewRemove = this.DOM.recordDisplayHeader.append("div")
        .attr("class","buttonRecordViewRemove fa fa-times")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'ne', title: kshf.lang.cur.RemoveRecords }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.removeRecordViewSummary(); });

      var x= this.DOM.recordDisplayHeader.append("span");
      x.append("span").text("View: ").attr("class","recordView_HeaderSet");
      x.selectAll("span.fa").data([
        {v:'Map', i:"globe"},
        {v:'List', i:"list-ul"},
        {v:'NodeLink', i:"share-alt"} ]
      ).enter()
        .append("span").attr("class", function(d){ return "recordView_Set"+d.v+" fa fa-"+d.i; })
        .each(function(d){ 
          this.tipsy = new Tipsy(this, {gravity: 'ne', title: function(){ return "View as "+d.v; } }); 
        })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(d){ this.tipsy.hide(); me.viewAs(d.v); });

      this.DOM.scrollToTop = this.DOM.recordDisplayHeader.append("div").attr("class","scrollToTop fa fa-arrow-up")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'e', title: kshf.lang.cur.ScrollToTop }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); kshf.Util.scrollToPos_do(me.DOM.recordGroup,0); });
    },
    /** -- */
    setSpatialFilter: function(){
      var me=this;

      this.spatialFilter = this.browser.createFilter({
        summary: this.recordViewSummary,
        onClear: function(){
          me.DOM.root.select(".spatialQueryBox_Filter").attr("active",null);
        },
        filterView_Detail: function(){
          return "<i class='fa fa-square-o'></i>";
        },
        onFilter: function(){
          me.DOM.root.select(".spatialQueryBox_Filter").attr("active",true);
          me.browser.records.forEach(function(record){
            if(record._geoBound_ === undefined) {
              record.setFilterCache(this.filterID, false);
              return;
            }
            record.setFilterCache(this.filterID, kshf.intersects(record._geoBound_, this.bounds));
          },this);
        }
      });
    },
    /** -- */
    setTextFilter: function(){
      var me=this;

      this.textFilter = this.browser.createFilter({
        summary: me.textSearchSummary,
        title: function(){ return me.textSearchSummary.summaryName; }, 
        onClear: function(){
          me.DOM.recordTextSearch.select(".clearSearchText").style('display','none');
          me.DOM.recordTextSearch.selectAll(".textSearchMode").style("display","none"); 
          me.DOM.recordTextSearch.select("input")[0][0].value = "";
        },
        filterView_Detail: function(){
          return "*"+this.filterStr+"*";
        },
        onFilter: function(){
          me.DOM.recordTextSearch.select(".clearSearchText").style('display','inline-block');
          me.DOM.recordTextSearch.selectAll(".textSearchMode").style("display",
            this.filterQuery.length>1?"inline-block":"none"); 

          // go over all the records in the list, search each keyword separately
          // If some search matches, return true (any function)
          var summaryFunc = me.textSearchSummary.summaryFunc;
          me.browser.records.forEach(function(record){
            var f;
            if(me.textFilter.multiMode==='or') 
              f = ! this.filterQuery.every(function(v_i){
                var v = summaryFunc.call(record.data,record);
                if(v===null || v===undefined) return true;
                return (""+v).toLowerCase().indexOf(v_i)===-1;
              });
            if(me.textFilter.multiMode==='and')
              f = this.filterQuery.every(function(v_i){
                var v = summaryFunc.call(record.data,record);
                return (""+v).toLowerCase().indexOf(v_i)!==-1;
              });
            record.setFilterCache(this.filterID,f);
          },this);
        },
      });
      this.textFilter.multiMode = 'and';
    },
    /** -- */
    initDOM_GlobalTextSearch: function(){
      var me=this;

      this.DOM.recordTextSearch = this.DOM.recordDisplayHeader.append("span").attr("class","recordTextSearch");

      var x= this.DOM.recordTextSearch.append("div").attr("class","dropZone_textSearch")
        .on("mouseenter",function(){ this.style.backgroundColor = "rgb(255, 188, 163)"; })
        .on("mouseleave",function(){ this.style.backgroundColor = ""; })
        .on("mouseup"   ,function(){ me.setTextSearchSummary(me.movedSummary); });
      x.append("div").attr("class","dropZone_textSearch_text").text("Text search");

      this.DOM.recordTextSearch.append("i").attr("class","fa fa-search searchIcon");
      this.DOM.recordTextSearch.append("input").attr("type","text").attr("class","mainTextSearch_input")
        .each(function(){ 
          this.tipsy = new Tipsy(this, {gravity: 'n', 
            title: '<b><u>Enter</u></b> to filter <i class="fa fa-filter"></i>.<br><br>'+
            '<b><u>Shift+Enter</u></b> to lock <i class="fa fa-lock"></i>.' }); 
        })
        .on("blur",function(){
          this.tipsy.hide();
        })
        .on("keyup",function(){
          var x = this;
          me.textFilter.filterStr = x.value.toLowerCase();

          // convert string to query pieces
          me.textFilter.filterQuery = [];
          if(me.textFilter.filterStr!=="") {
            // split the input by " character
            me.textFilter.filterStr.split('"').forEach(function(block,i){
              if(i%2===0) {
                block.split(/\s+/).forEach(function(q){ me.textFilter.filterQuery.push(q)});
              } else {
                me.textFilter.filterQuery.push(block);
              }
            });
            // Remove the empty strings
            me.textFilter.filterQuery = me.textFilter.filterQuery.filter(function(v){ return v!==""});
          }
          
          // Enter pressed
          if (event.keyCode == '13'){
            this.tipsy.hide();
            if(d3.event.shiftKey) {
              // Compare
              if(me.textFilter.filterStr!=="") {
                me.browser.setSelect_Compare();
              } else {
                me.textFilter.clearFilter();
              }
            } else {
              // Filter
              if(me.textFilter.filterStr!=="") {
                me.textFilter.addFilter();
              } else {
                me.textFilter.clearFilter();
              }
            }
            return;
          }

          if(this.timer) clearTimeout(this.timer);
          this.timer = setTimeout( function(){
            if(me.textFilter.filterQuery.length==0){
              x.tipsy.hide();
              me.browser.clearSelect_Highlight();
              return;
            }
            x.tipsy.show();
            // Highlight selection
            var summaryFunc = me.textSearchSummary.summaryFunc;
            var records = [];
            me.browser.records.forEach(function(record){
              var f;
              if(me.textFilter.multiMode==='or') 
                f = ! me.textFilter.filterQuery.every(function(v_i){
                  var v = summaryFunc.call(record.data,record);
                  if(v===null || v===undefined) return true;
                  return (""+v).toLowerCase().indexOf(v_i)===-1;
                });
              if(me.textFilter.multiMode==='and')
                f = me.textFilter.filterQuery.every(function(v_i){
                  var v = summaryFunc.call(record.data,record);
                  return (""+v).toLowerCase().indexOf(v_i)!==-1;
                });
              if(f) records.push(record);
            });
            me.browser.clearSelect_Highlight();
            me.browser.flexAggr_Highlight.records = records;
            me.browser.flexAggr_Highlight.summary = me.recordViewSummary;
            me.browser.setSelect_Highlight();
            x.timer = null;
          }, 200);
        });
      this.DOM.recordTextSearch.append("span").attr("class","fa fa-times-circle clearSearchText")
        .attr("mode","and")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'ne', title: kshf.lang.cur.RemoveFilter }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.textFilter.clearFilter(); });
      
      this.DOM.recordTextSearch.selectAll(".textSearchMode").data(["and","or"]).enter()
        .append("span")
          .attr("class","textSearchMode")
          .attr("mode",function(d){return d;})
          .each(function(d){ 
            this.tipsy = new Tipsy(this, {
              gravity: 'ne', 
              title: (d==="and") ? "All words<br> must appear." : "At least one word<br> must appear." });
          })
          .on("mouseenter", function(){ this.tipsy.show(); })
          .on("mouseleave", function(){ this.tipsy.hide(); })
          .on("click",    function(d) { this.tipsy.hide();
            me.DOM.recordTextSearch.attr("mode",d);
            me.textFilter.multiMode = d;
            me.textFilter.addFilter();
          });
    },
    /** -- */
    initDOM_NodeLinkView_Settings: function(){
      var me=this;

      this.DOM.NodeLinkAttrib = this.DOM.recordDisplayHeader.append("span").attr("class","NodeLinkAttrib");

      this.DOM.NodeLinkAttrib.append("span").attr("class","fa fa-share-alt NodeLinkAttribIcon")
        .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'e',  title: "Show/Hide Links" }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide();
          me.DOM.root.attr("hideLinks", me.DOM.root.attr("hideLinks")?null:true ); });

      var s = this.DOM.NodeLinkAttrib.append("select")
        .on("change",function(){
          var s = this.selectedOptions[0].__data__;
          // TODO: change the network calculation
        });;

      s.selectAll("option").data(this.config.linkBy).enter().append("option").text(function(d){ return d; });
    },
    /** -- */
    setRecordViewSummary: function(summary){
      if(summary===undefined || summary===null) {
        this.removeRecordViewSummary();
        return;
      }
      if(this.recordViewSummary===summary) return;
      if(this.recordViewSummary) this.removeRecordViewSummary();

      this.DOM.root.attr('hasRecordView',true);
      this.recordViewSummary = summary;
      this.recordViewSummary.isRecordView = true;
      this.recordViewSummary.refreshNuggetDisplay();
      
      if(this.spatialFilter){
        this.spatialFilter.summary = this.recordViewSummary;
        this.recordViewSummary.summaryFilter = this.spatialFilter;
      }

      // TODO: Delete existing record DOM's and regenerate them
      this.DOM.recordGroup.selectAll(".kshfRecord").data([]).exit().remove();

      if(this.displayType==='list' || this.displayType==="grid"){
        this.sortRecords();
        this.refreshRecordDOM();
        this.setSortColumnWidth(this.config.sortColWidth);
      } else if(this.displayType==='map'){
        this.refreshRecordDOM();
      } else if(this.displayType==='nodelink'){
        this.setNodeLink();
        this.refreshRecordDOM();
      }

      this.browser.DOM.root.attr("recordDisplayMapping",this.getRecordEncoding()); // "sort" or "color"
    },
    /** -- */
    removeRecordViewSummary: function(){
      if(this.recordViewSummary===null) return;
      this.DOM.root.attr("hasRecordView",false);
      this.recordViewSummary.isRecordView = false;
      this.recordViewSummary.refreshNuggetDisplay();
      this.recordViewSummary = null;
      this.browser.DOM.root.attr("recordDisplayMapping",null);
    },
    /** -- */
    setTextSearchSummary: function(summary){
      if(summary===undefined || summary===null) return;
      this.textSearchSummary = summary;
      this.textSearchSummary.isTextSearch = true;
      this.DOM.recordTextSearch
        .attr("isActive",true)
        .select("input").attr("placeholder", kshf.lang.cur.Search+": "+summary.summaryName);
      this.setTextFilter();
      this.textSearchSummary.summaryFilter = this.textFilter;
    },
    /** -- */
    addSortingOption: function(summary){
      // If parameter summary is already a sorting option, nothing else to do
      if(this.sortingOpts.some(function(o){ return o===summary; })) return;

      this.sortingOpts.push(summary);

      summary.sortLabel   = summary.summaryFunc;
      summary.sortInverse = false;
      summary.sortFunc    = this.getSortFunc(summary.summaryFunc);

      this.prepSortingOpts();
      this.refreshSortingOptions();
    },
    /** -- */
    initDOM_SortSelect: function(){
      var me=this;

      this.DOM.header_listSortColumn = this.DOM.recordDisplayHeader.append("div").attr("class","header_listSortColumn");

      this.DOM.listSortOptionSelect = this.DOM.header_listSortColumn.append("select")
        .attr("class","listSortOptionSelect")
        .on("change", function(){ me.setSortingOpt_Active(this.selectedIndex); });

      this.refreshSortingOptions();

      this.DOM.recordSortButton = this.DOM.recordDisplayHeader.append("span")
        .attr("class","recordSortButton sortButton fa")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'w', title: kshf.lang.cur.ReverseOrder }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",function(){
          this.tipsy.hide();
          // NOTE: Only on list/grid views
          me.sortingOpt_Active.inverse = me.sortingOpt_Active.inverse?false:true;
          this.setAttribute("inverse",me.sortingOpt_Active.inverse);
          // TODO: Do not show no-value items on top, reversing needs to be a little smarter.
          me.browser.records.reverse();

          me.updateRecordRanks();
          me.refreshRecordDOM();
          me.refreshRecordRanks(me.DOM.recordRanks);

          me.DOM.kshfRecords = me.DOM.recordGroup.selectAll(".kshfRecord")
            .data(me.browser.records, function(record){ return record.id(); })
            .order();
          kshf.Util.scrollToPos_do(me.DOM.recordGroup,0);
        });
    },
    /** -- */
    refreshRecordRanks: function(d3_selection){
      if(!this.showRank) return; // Do not refresh if not shown...
      d3_selection.text(function(record){ return (record.recordRank<0)?"":record.recordRank+1; });
    },
    /** -- */
    setSortColumnWidth: function(v){
      if(this.displayType!=='list') return;
      this.sortColWidth = Math.max(Math.min(v,110),30); // between 30 and 110 pixels
      this.DOM.recordSortCol.style("width",this.sortColWidth+"px");
      this.refreshAdjustSortColumnWidth();
    },
    /** -- */
    getSortingLabel: function(d){
      var s = this.sortingOpt_Active.sortLabel.call(d.data,d);
      if(s===null || s===undefined) return "";
      if(typeof s!=="string") s = this.sortColFormat(s);
      return this.sortingOpt_Active.printWithUnitName(s);
    },
    /** -- */
    refreshRecordSortLabels: function(d3_selection){
      if(this.displayType!=='list') return; // Only list-view allows sorting
      if(d3_selection===undefined) d3_selection = this.DOM.recordSortCol;

      var me=this;
      d3_selection.html(function(d){ return me.getSortingLabel(d); });
    },
    /** -- */
    refreshSortingOptions: function(){
      if(this.DOM.listSortOptionSelect===undefined) return;
      this.DOM.listSortOptionSelect.selectAll("option").remove();
      var me=this;
      var x = this.DOM.listSortOptionSelect.selectAll("option").data(this.sortingOpts);
      x.enter().append("option").html(function(summary){ return summary.summaryName; })
      x.exit().each(function(summary){ summary.sortingSummary = false; });
      this.sortingOpts.forEach(function(summary, i){
        if(summary===me.sortingOpt_Active) {
          var DOM = me.DOM.listSortOptionSelect[0][0];
          DOM.selectedIndex = i;
        }
      });
    },
    /** -- */
    prepSortingOpts: function(){
      this.sortingOpts.forEach(function(sortOpt,i){
        if(sortOpt.summaryName) return; // It already points to a summary
        if(typeof(sortOpt)==="string"){
          sortOpt = { title: sortOpt };
        }
        // Old API
        if(sortOpt.title) sortOpt.name = sortOpt.title;

        var summary = this.browser.summaries_by_name[sortOpt.name];
        if(summary===undefined){
          if(typeof(sortOpt.value)==="string"){
            summary = this.browser.changeSummaryName(sortOpt.value,sortOpt.name);
          } else{
            summary = this.browser.createSummary(sortOpt.name,sortOpt.value, "interval");
            if(sortOpt.unitName){ summary.setUnitName(sortOpt.unitName); }
          }
        }

        summary.sortingSummary  = true;
        summary.sortLabel   = sortOpt.label || summary.summaryFunc;
        summary.sortInverse = sortOpt.inverse  || false;
        summary.sortFunc    = sortOpt.sortFunc || this.getSortFunc(summary.summaryFunc);

        this.sortingOpts[i] = summary;
      },this);
    },
    /** -- */
    alphabetizeSortingOptions: function(){
      this.sortingOpts.sort(function(s1,s2){ 
        return s1.summaryName.localeCompare(s2.summaryName, { sensitivity: 'base' });
      });
    },
    /** -- */
    setSortingOpt_Active: function(index){
      if(this.sortingOpt_Active){
        var curHeight = this.sortingOpt_Active.getHeight();
        this.sortingOpt_Active.clearAsRecordSorting();
        this.sortingOpt_Active.setHeight(curHeight);
      }
      
      if(typeof index === "number"){
        if(index<0 || index>=this.sortingOpts.length) return;
        this.sortingOpt_Active = this.sortingOpts[index];
      } else if(index instanceof kshf.Summary_Base){
        this.sortingOpt_Active = index;
      }

      if(this.config.onSort) this.config.onSort.call(this);

      {
        var curHeight = this.sortingOpt_Active.getHeight();
        this.sortingOpt_Active.setAsRecordSorting();
        this.sortingOpt_Active.setHeight(curHeight);
      }

      // Sort column format function
      this.sortColFormat = function(a){ return a.toLocaleString(); };
      if(this.sortingOpt_Active.isTimeStamp()){
        this.sortColFormat = this.sortingOpt_Active.timeTyped.print;
      }

      // If the record view summary is not set, no need to proceed with sorting or visual
      if(this.recordViewSummary===null) return;

      if(this.DOM.root===undefined) return;
      if(this.displayType==='map' || this.displayType==='nodelink'){
        this.refreshRecordColors();
      } else {
        this.sortRecords();
        if(this.DOM.recordGroup===undefined) return;

        this.refreshRecordDOM();
        this.refreshRecordRanks(this.DOM.recordRanks);
        kshf.Util.scrollToPos_do(this.DOM.recordGroup,0);

        this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord")
          .data(this.browser.records, function(record){ return record.id(); })
          .order();

        this.refreshRecordSortLabels();
      }
    },
    /** -- */
    refreshAdjustSortColumnWidth: function(){
      if(this.displayType!=='list') return;
      this.DOM.adjustSortColumnWidth.style("left", (this.sortColWidth-2)+(this.showRank?15:0)+"px")
    },
    /** -- */
    setShowRank: function(v){
      this.showRank = v;
      this.DOM.root.attr('showRank',this.showRank);
      this.refreshRecordRanks(this.DOM.recordRanks);
      this.refreshAdjustSortColumnWidth();
    },
    /** -- */
    refreshNodeLinks: function(){
      this.generateNodeLinks();
      this.nodelink_nodes = this.browser.records.filter(function(record){ return record.isWanted; });

      this.nodelink_Force
        .nodes(this.nodelink_nodes)
        .links(this.nodelink_links)
        .start();

      if(this.nodelink_links.length>1000) this.DOM.root.attr("hideLinks",true);
    },
    /** -- */
    generateNodeLinks: function(){
      this.nodelink_links = [];

      var recordsIndexed = kshf.dt_id[browser.primaryTableName];
      var linkAttribName = this.config.linkBy[0];

      this.browser.records.forEach(function(recordFrom){
        if(!recordFrom.isWanted) return;
        var links = recordFrom.data[linkAttribName];
        if(links) {
          links.forEach(function(recordTo_id){
            var recordTo = recordsIndexed[recordTo_id];
            if(recordTo) {
              if(!recordTo.isWanted) return;
              this.nodelink_links.push({source:recordFrom, target: recordTo});
            }
          },this);
        }
      },this);
    },
    /** -- */
    initializeNetwork: function(){
      this.nodelink_Force.size([this.curWidth, this.curHeight]).start();
      if(this.nodelink_links.length>1000) this.DOM.root.attr("hideLinks",true);

      this.DOM.root.attr("NodeLinkState","started");
    },
    refreshNodeVis: function(){
      if(this.DOM.recordLinks===undefined) return;

      // position & direction of the line
      this.DOM.recordLinks.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      // position of the record
      var scale = "scale("+(1/this.nodeZoomBehavior.scale())+")";
      this.DOM.kshfRecords.attr("transform", function(d){
        return "translate("+d.x+","+d.y+") "+scale;
      });
    },
    /** -- */
    setNodeLink: function(){
      var me=this;

      this.browser.records.forEach(function(record){
        record.DOM.links_To = [];
        record.DOM.links_From = [];
        record.links_To = [];
        record.links_From = [];
      });

      this.nodelink_links = [];

      var recordsIndexed = kshf.dt_id[browser.primaryTableName];
      var linkAttribName = this.config.linkBy[0];

      this.browser.records.forEach(function(recordFrom){
        var links = recordFrom.data[linkAttribName];
        if(links) {
          links.forEach(function(recordTo_id){
            var recordTo = recordsIndexed[recordTo_id];
            if(recordTo) {
              recordFrom.links_To.push(recordTo);
              recordTo.links_From.push(recordFrom);
            }
          },this);
        }
      },this);

      this.generateNodeLinks();

      this.DOM.recordLinks = this.DOM.linkGroup.selectAll(".recordLink").data(this.nodelink_links)
        .enter().append("line").attr("class", "recordLink")
        .each(function(link){
          var recordFrom = link.source;
          var recordTo = link.target;
          recordFrom.DOM.links_To.push(this);
          recordTo.DOM.links_From.push(this);
        });

      this.nodelink_Force = d3.layout.force()
        .charge(-60)
        .gravity(0.8)
        .alpha(0.4)
        .nodes(this.browser.records)
        .links(this.nodelink_links)
        .on("start",function(){ 
          me.DOM.root.attr("NodeLinkState","started");
          me.DOM.root.attr("hideLinks",true);
        })
        .on("end",  function(){ 
          me.DOM.root.attr("NodeLinkState","stopped");
          me.DOM.root.attr("hideLinks",null);
        })
        .on("tick", function(){ me.refreshNodeVis(); });
    },
    /** -- */
    refreshRecordColors: function(){
      if(!this.recordViewSummary) return;
      var me=this;
      var s_f  = this.sortingOpt_Active.summaryFunc;
      var s_log;

      if(this.sortingOpt_Active.scaleType==='log'){
        this.recordColorScale = d3.scale.log();
        s_log = true;
      } else {
        this.recordColorScale = d3.scale.linear();
        s_log = false;
      }
      var min_v = this.sortingOpt_Active.intervalRange.total.min;
      var max_v = this.sortingOpt_Active.intervalRange.total.max;
      if(this.sortingOpt_Active.intervalRange.active){
        min_v = this.sortingOpt_Active.intervalRange.active.min;
        max_v = this.sortingOpt_Active.intervalRange.active.max;
      }
      if(min_v===undefined) min_v = d3.min(this.browser.records, function(d){ return s_f.call(d.data); });
      if(max_v===undefined) max_v = d3.max(this.browser.records, function(d){ return s_f.call(d.data); });
      this.recordColorScale
        .range([0, 9])
        .domain( [min_v, max_v] );

      this.colorQuantize = d3.scale.quantize()
        .domain([0,9])
        .range(kshf.colorScale[me.browser.mapColorTheme]);

      var undefinedFill = (this.displayType==='map') ? "url(#diagonalHatch)" : "white";

      var fillFunc = function(d){ 
        var v = s_f.call(d.data);
        if(s_log && v<=0) v=undefined;
        if(v===undefined) return undefinedFill;
        var vv = me.recordColorScale(v);
        if(me.sortingOpt_Active.invertColorScale) vv = 9 - vv;
        return me.colorQuantize(vv); 
      };

      if(this.displayType==='map') {
        this.DOM.kshfRecords.each(function(d){ 
          var v = s_f.call(d.data);
          if(s_log && v<=0) v=undefined;
          if(v===undefined) {
            this.style.fill = undefinedFill;
            this.style.stroke = "gray";
            return;
          }
          var vv = me.recordColorScale(v);
          if(me.sortingOpt_Active.invertColorScale) vv = 9 - vv;
          this.style.fill = me.colorQuantize(vv); 
          this.style.stroke = me.colorQuantize(vv>=5?0:9);
        });
      }
      if(this.displayType==='nodelink') {
        this.DOM.kshfRecords.selectAll("circle").style("fill", function(d){ 
          var v = s_f.call(d.data);
          if(s_log && v<=0) v=undefined;
          if(v===undefined) return undefinedFill;
          var vv = me.recordColorScale(v);
          if(me.sortingOpt_Active.invertColorScale) vv = 9 - vv;
          return me.colorQuantize(vv); 
        });
      }
    },
    /** -- */
    highlightLinked: function(recordFrom){
      recordFrom.DOM.links_To.forEach(function(dom){
        dom.style.stroke = "green";
        dom.style.strokeOpacity = 1;
        dom.style.display = "block";
      });
      var links = recordFrom.data[this.config.linkBy[0]];
      if(!links) return;
      var recordsIndexed = kshf.dt_id[browser.primaryTableName];
      links.forEach(function(recordTo_id){
        var recordTo = recordsIndexed[recordTo_id];
        if(recordTo) {
          if(recordTo.DOM.record){
            d3.select(recordTo.DOM.record.parentNode.appendChild(recordTo.DOM.record));
            recordTo.DOM.record.setAttribute("selection","related");
          }
        }
      },this);
    },
    /** -- */
    unhighlightLinked: function(recordFrom){
      recordFrom.DOM.links_To.forEach(function(dom){
        dom.style.stroke = null;
        dom.style.strokeOpacity = null;
        dom.style.display = null;
      });
      var links = recordFrom.data[this.config.linkBy[0]];
      if(!links) return;
      var recordsIndexed = kshf.dt_id[browser.primaryTableName];
      links.forEach(function(recordTo_id){
        var recordTo = recordsIndexed[recordTo_id];
        if(recordTo) {
          if(recordTo.DOM.record){
            recordTo.DOM.record.removeAttribute("selection");
          }
        }
      },this);
    },
    /** -- */
    refreshRecordDOM: function(){
      var me=this, x;
      var records = (this.displayType==='map')?
        this.browser.records :
        this.browser.records.filter(function(record){
          return record.isWanted && (record.recordRank<me.maxVisibleItems);
        });

      var newRecords = this.DOM.recordGroup.selectAll(".kshfRecord")
        .data(records, function(record){ return record.id(); }).enter();

      var nodeType = ({
        'map'     : 'path',
        'nodelink': 'g',
        'list'    : 'div',
        'grid'    : 'div'
      })[this.displayType];

      // Shared structure per record view
      newRecords = newRecords
        .append( nodeType )
        .attr('class','kshfRecord')
        .attr('details',false)
        .attr("id",function(record){ return "kshfRecord_"+record.id(); }) // can be used to apply custom CSS
        .attr("rec_compared",function(record){ return record.selectCompared_str?record.selectCompared_str:null;})
        .each(function(record){ 
          record.DOM.record = this;
          if(me.displayType==='map'){
            this.tipsy = new Tipsy(this, {
              gravity: 'e',
              title: function(){ 
                var v = me.sortingOpt_Active.summaryFunc.call(record.data,record);
                return ""+
                  "<span class='mapItemName'>"+me.recordViewSummary.summaryFunc.call(record.data,record)+"</span>"+
                  "<span class='mapTooltipLabel'>"+me.sortingOpt_Active.summaryName+"</span>: "+
                  "<span class='mapTooltipValue'>"+me.sortingOpt_Active.printWithUnitName(v)+"</span>";
              }
            });
          }
        })
        .on("mouseenter",function(record){
          var DOM = this;
          if(this.tipsy) {
            this.tipsy.show();
            this.tipsy.jq_tip[0].style.left = (d3.event.pageX-this.tipsy.tipWidth-10)+"px";
            this.tipsy.jq_tip[0].style.top = (d3.event.pageY-this.tipsy.tipHeight/2)+"px";
          }

          // mouse is moving fast, should wait a while...
          this.highlightTimeout = window.setTimeout(
            function(){ 
              if(me.displayType==='nodelink') me.highlightLinked(record);
              record.highlightRecord();
              if(me.displayType==='map' || me.displayType==='nodelink'){
                d3.select(DOM.parentNode.appendChild(DOM));
              }
            }, 
            (me.browser.mouseSpeed<0.2) ? 0 : me.browser.mouseSpeed*300);

          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("mouseleave",function(record){
          if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
          if(this.tipsy) this.tipsy.hide();
          if(me.displayType==='nodelink') me.unhighlightLinked(record);
          record.unhighlightRecord();
        })
        .on("mousedown", function(){
          this._mousemove = false;
        })
        .on("mousemove", function(){
          this._mousemove = true;
          if(this.tipsy){
            this.tipsy.jq_tip[0].style.left = (d3.event.pageX-this.tipsy.tipWidth-10)+"px";
            this.tipsy.jq_tip[0].style.top = (d3.event.pageY-this.tipsy.tipHeight/2)+"px";
          }
        })
        .on("click",function(d){
          if(this._mousemove) return; // Do not show the detail view if the mouse was used to drag the map
          if(me.displayType==='map' || me.displayType==='nodelink'){
            me.browser.updateRecordDetailPanel(d);
          }
        });
      
      if(this.displayType==='list' || this.displayType==="grid"){
        // RANK
        x = newRecords.append("span").attr("class","recordRank")
          .each(function(d){
            this.tipsy = new Tipsy(this, {
              gravity: 'e',
              title: function(){ return kshf.Util.ordinal_suffix_of((d.recordRank+1)); }
            });
          })
          .on("mouseenter",function(){ this.tipsy.show(); })
          .on("mouseout"  ,function(){ this.tipsy.hide(); });
        this.refreshRecordRanks(x);
        // SORTING VALUE LABELS
        if(this.displayType==='list'){
          x = newRecords.append("div").attr("class","recordSortCol").style("width",this.sortColWidth+"px");
          this.refreshRecordSortLabels(x);
        }
        // TOGGLE DETAIL
        newRecords.append("div").attr("class","recordToggleDetail fa")
          .each(function(d){
            this.tipsy = new Tipsy(this, {
              gravity:'s',
              title: function(){
                if(me.detailsToggle==="one" && this.displayType==='list')
                  return d.showDetails===true?"Show less":"Show more";
                return kshf.lang.cur.ShowMoreInfo;
              }
            });
          })
          .on("mouseenter", function(){ this.tipsy.show(); })
          .on("mouseleave", function(){ this.tipsy.hide(); })
          .on("click", function(record){
            this.tipsy.hide();
            if(me.detailsToggle==="one" && me.displayType==='list'){
              record.setRecordDetails(!record.showDetails);
            }
            if(me.detailsToggle==="zoom"){
              me.browser.updateRecordDetailPanel(record);
            }
          });

        // Insert the custom content!
        // Note: the value was already evaluated and stored in the record object
        var recordViewID = this.recordViewSummary.summaryID;
        newRecords.append("div").attr("class","content")
          .html(function(record){ 
            return me.recordViewSummary.summaryFunc.call(record.data, record);
          });

        // Fixes ordering problem when new records are made visible on the list
        // TODO: Try to avoid this.
        this.DOM.recordGroup.selectAll(".kshfRecord")
          .data(records, function(record){ return record.id(); })
          .order();
      }

      if(this.displayType==='nodelink'){
        newRecords.append("circle").attr("r",4);
        newRecords.append("text").attr("class","kshfRecord_label")
          .attr("dy",4).attr("dx",6)
          .html(function(record){ 
            return me.recordViewSummary.summaryFunc.call(record.data, record);
          });
      }

      // Call the onDOM function for all the records that have been inserted to the page
      if(this.config.onDOM) {
        newRecords.each(function(record){ me.config.onDOM.call(record.data,record); });
      }

      this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord");

      if(this.displayType==='map') {
        this.map_zoomToActive();
        this.map_projectRecords();
        this.refreshRecordColors();
      } else if(this.displayType==='nodelink'){
        this.refreshRecordColors();
      } else {
        this.DOM.recordSortCol = this.DOM.recordGroup.selectAll(".recordSortCol");
        this.DOM.recordRanks    = this.DOM.recordGroup.selectAll(".recordRank");
        this.DOM.recordToggleDetail = this.DOM.recordGroup.selectAll(".recordToggleDetail");
      }

      this.updateRecordVisibility();
    },
    /** -- */
    showMoreRecordsOnList: function(){
      if(this.displayType==='map') return;
      this.DOM.showMore.attr("showMoreVisible",false);
      this.maxVisibleItems += Math.min(this.maxVisibleItems,250);
      this.refreshRecordDOM();
    },
    /** Sort all records given the active sort option
     *  Records are only sorted on init & when active sorting option changes.
     *  They are not resorted on filtering. ** Filtering does not affect record sorting.
     */
    sortRecords: function(){
      var sortValueFunc = this.sortingOpt_Active.summaryFunc;
      var sortFunc = this.sortingOpt_Active.sortFunc;
      var inverse = this.sortingOpt_Active.sortInverse;

      this.browser.records.sort(
        function(record_A,record_B){
          // Put filtered/remove data to later position
          // !! Don't do above!! Then, when you filter set, you'd need to re-order
          // Now, you don't need to re-order after filtering, which is a nice property to have.
          var v_a = sortValueFunc.call(record_A.data,record_A);
          var v_b = sortValueFunc.call(record_B.data,record_B);

          if(isNaN(v_a)) v_a = undefined;
          if(isNaN(v_b)) v_b = undefined;
          if(v_a===null) v_a = undefined;
          if(v_b===null) v_b = undefined;

          if(v_a===undefined && v_b!==undefined) return  1;
          if(v_b===undefined && v_a!==undefined) return -1;
          if(v_b===undefined && v_a===undefined) return 0;

          var dif=sortFunc(v_a,v_b);
          if(dif===0) dif=record_B.id()-record_A.id();
          if(inverse) return -dif;
          return dif; // use unique IDs to add sorting order as the last option
        }
      );

      this.updateRecordRanks();
    },
    /** Returns the sort value type for given sort Value function */
    getSortFunc: function(sortValueFunc){
      // 0: string, 1: date, 2: others
      var sortValueFunction, same;

      // find appropriate sortvalue type
      for(var k=0, same=0; true ; k++){
        if(same===3 || k===this.browser.records.length) break;
        var item = this.browser.records[k];
        var f = sortValueFunc.call(item.data,item);
        var sortValueType_temp2;
        switch(typeof f){
          case 'string': sortValueType_temp2 = kshf.Util.sortFunc_List_String; break;
          case 'number': sortValueType_temp2 = kshf.Util.sortFunc_List_Number; break;
          case 'object':
            if(f instanceof Date)
              sortValueType_temp2 = kshf.Util.sortFunc_List_Date;
            else
              sortValueType_temp2 = kshf.Util.sortFunc_List_Number;
            break;
          default: sortValueType_temp2 = kshf.Util.sortFunc_List_Number; break;
        }

        if(sortValueType_temp2===sortValueFunction){
          same++;
        } else {
          sortValueFunction = sortValueType_temp2;
          same=0;
        }
      }
      return sortValueFunction;
    },
    /** Updates visibility of individual records */
    updateRecordVisibility: function(){
      if(this.DOM.kshfRecords===undefined) return;

      var me = this;
      var visibleItemCount=0;

      if(me.displayType==='map'){
        this.DOM.kshfRecords.each(function(record){
          this.style.opacity = record.isWanted?0.9:0.2;
          this.style.pointerEvents = record.isWanted?"":"none";
          this.style.display = "block"; // Have this bc switching views can invalidate display
        });
      } else if(me.displayType==='nodelink'){
        this.browser.records.forEach(function(record){
          if(record.DOM.record) record.DOM.record.style.display = record.isWanted?"block":"none";
        });
        this.DOM.recordLinks.each(function(link){
          this.style.display = (!link.source.isWanted || !link.target.isWanted) ? "none" : null;
        });
      } else {
        this.DOM.kshfRecords.each(function(record){
          var isVisible = (record.recordRank>=0) && (record.recordRank<me.maxVisibleItems);
          if(isVisible) visibleItemCount++;
          this.style.display = isVisible?null:'none';
        });

        this.DOM.showMore.select(".CountAbove").html("&#x25B2;"+visibleItemCount+" shown");
        this.DOM.showMore.select(".CountBelow").html((this.browser.recordsWantedCount-visibleItemCount)+" below&#x25BC;");
      };
    },
    /** -- */
    updateAfterFilter: function(){
      if(this.recordViewSummary===null) return;
      if(this.displayType==='map') {
        this.updateRecordVisibility();
        //this.map_zoomToActive();
      } else if(this.displayType==='nodelink') {
        this.updateRecordVisibility();
        this.DOM.NodeLinkAnim_Refresh.style('display','inline-block');
        // this.refreshNodeLinks();
      } else {
        var me=this;
        var startTime = null;
        var scrollDom = this.DOM.recordGroup[0][0];
        var scrollInit = scrollDom.scrollTop;
        var easeFunc = d3.ease('cubic-in-out');
        var animateToTop = function(timestamp){
          var progress;
          if(startTime===null) startTime = timestamp;
          // complete animation in 500 ms
          progress = (timestamp - startTime)/1000;
          scrollDom.scrollTop = (1-easeFunc(progress))*scrollInit;
          if(scrollDom.scrollTop!==0){
            window.requestAnimationFrame(animateToTop);
            return;
          }
          me.updateRecordRanks();
          me.refreshRecordDOM();
          me.refreshRecordRanks(me.DOM.recordRanks);
        };
        window.requestAnimationFrame(animateToTop);
      }
    },
    /** -- */
    updateRecordRanks: function(){
      var wantedCount = 0;
      var unwantedCount = 1;
      this.browser.records.forEach(function(record){
        if(record.isWanted){
          record.recordRank = wantedCount;
          wantedCount++;
        } else {
          record.recordRank = -unwantedCount;
          unwantedCount++;
        }
      });
      this.maxVisibleItems = this.maxVisibleItems_Default;
    },
    /** -- */
    viewAs: function(d){
      d = d.toLowerCase();
      this.displayType = d;
      this.DOM.root.attr("displayType",this.displayType);

      if(this.displayType==='map'){
        this.initDOM_MapView();
        this.DOM.recordDisplayHeader.select(".recordView_HeaderSet").style("display","inline-block");
        this.DOM.root.select(".recordView_SetList").style("display","inline-block");
        if(this.nodelink_Force) this.nodelink_Force.stop();
      } else if(this.displayType==='nodelink'){
        this.initDOM_NodeLinkView();
        this.DOM.recordDisplayHeader.select(".recordView_HeaderSet").style("display","inline-block");
        this.DOM.root.select(".recordView_SetList").style("display","inline-block");
      } else {
        this.initDOM_ListView();
        this.DOM.root.select(".recordView_SetList").style("display",null);
        if(this.nodelink_Force) this.nodelink_Force.stop();
      }
      this.DOM.root.select(".recordView_SetMap").style("display",
        (this.config.geo && this.displayType!=='map') ? "inline-block" : null );
      this.DOM.root.select(".recordView_SetNodeLink").style("display",
        (this.config.linkBy.length>0 && this.displayType!=='nodelink') ? "inline-block" : null );

      if(this.recordViewSummary) {
        
        if(this.displayType==='list' || this.displayType==="grid"){
          this.sortRecords();
          this.refreshRecordDOM();
          this.setSortColumnWidth(this.config.sortColWidth || 50); // default: 50px;
        } else if(this.displayType==='map'){
          this.refreshRecordColors();
        } else if(this.displayType==='nodelink'){
          this.refreshRecordColors();
        }
        this.updateRecordVisibility();

        this.browser.DOM.root.attr("recordDisplayMapping",this.getRecordEncoding()); // "sort" or "color"
      }
    },
    /** -- */
    exportConfig: function(){
      var c={};
      c.displayType = this.displayType;
      if(this.textSearchSummary){
        c.textSearch = this.textSearchSummary.summaryName;
      }
      if(typeof(this.recordViewSummary.summaryColumn)==="string"){
        c.recordView = this.recordViewSummary.summaryColumn;
      } else {
        c.recordView = this.recordViewSummary.summaryFunc.toString();
      }
      c.sortBy = [];
      browser.recordDisplay.sortingOpts.forEach(function(summary){
        c.sortBy.push(summary.summaryName);
      });
      if(c.sortBy.length===1) c.sortBy = c.sortBy[0];
      c.sortColWidth = this.sortColWidth;
      c.detailsToggle = this.detailsToggle;
      return c;
    }
};


kshf.Panel = function(options){
  this.browser = options.browser;
  this.name = options.name;
  this.width_catLabel = options.width_catLabel;
  this.width_catBars = 0; // placeholder
  this.width_catMeasureLabel = 1; // placeholder
  this.summaries = [];

  this.DOM = {};
  this.DOM.root = options.parentDOM.append("div")
      .attr("hasSummaries",false)
      .attr("class", "panel panel_"+options.name+
          ((options.name==="left"||options.name==="right")?" panel_side":""));
  this.initDOM_AdjustWidth();
  this.initDOM_DropZone();
};

kshf.Panel.prototype = {
  /** -- */
  getWidth_Total: function(){
    if(this.name==="bottom") {
      var w = this.browser.getWidth_Total();
      if(this.browser.authoringMode) w-=kshf.attribPanelWidth;
      return w;
    }
    return this.width_catLabel + this.width_catMeasureLabel + this.width_catBars + kshf.scrollWidth;
  },
  /** -- */
  addSummary: function(summary,index){
    var curIndex=-1;
    this.summaries.forEach(function(s,i){ if(s===summary) curIndex=i; });
    if(curIndex===-1){ // summary is new to this panel
      if(index===this.summaries.length)
        this.summaries.push(summary);
      else
        this.summaries.splice(index,0,summary);
      this.DOM.root.attr("hasSummaries",true);
      this.updateWidth_MeasureLabel();
      this.refreshAdjustWidth();
    } else { // summary was in the panel. Change position
      this.summaries.splice(curIndex,1);
      this.summaries.splice(index,0,summary);
    }
    this.summaries.forEach(function(s,i){ s.panelOrder = i; });
    this.addDOM_DropZone(summary.DOM.root[0][0]);
    this.refreshAdjustWidth();
  },
  /** -- */
  removeSummary: function(summary){
    var indexFrom = -1;
    this.summaries.forEach(function(s,i){ if(s===summary) indexFrom = i; });
    if(indexFrom===-1) return; // given summary is not within this panel

    var toRemove=this.DOM.root.selectAll(".dropZone_between_wrapper")[0][indexFrom];
    toRemove.parentNode.removeChild(toRemove);

    this.summaries.splice(indexFrom,1);
    this.summaries.forEach(function(s,i){ s.panelOrder = i; });
    this.refreshDropZoneIndex();

    if(this.summaries.length===0) {
      this.DOM.root.attr("hasSummaries",false);
    } else {
      this.updateWidth_MeasureLabel();
    }
    summary.panel = undefined;
    this.refreshAdjustWidth();
  },
  /** -- */
  addDOM_DropZone: function(beforeDOM){
    var me=this;
    var zone;
    if(beforeDOM){
      zone = this.DOM.root.insert("div",function(){return beforeDOM;});
    } else {
      zone = this.DOM.root.append("div");
    }
    zone.attr("class","dropZone_between_wrapper")
      .on("mouseenter",function(){
        this.setAttribute("hovered",true);
        this.children[0].setAttribute("readyToDrop",true);
      })
      .on("mouseleave",function(){
        this.setAttribute("hovered",false);
        this.children[0].setAttribute("readyToDrop",false);
      })
      .on("mouseup",function(){
        var movedSummary = me.browser.movedSummary;
        if(movedSummary.panel){ // if the summary was in the panels already
          movedSummary.DOM.root[0][0].nextSibling.style.display = "";
          movedSummary.DOM.root[0][0].previousSibling.style.display = "";
        }

        movedSummary.addToPanel(me,this.__data__);

        me.browser.updateLayout();
      })
      ;

    var zone2 = zone.append("div").attr("class","dropZone dropZone_summary dropZone_between");
    zone2.append("div").attr("class","dropIcon fa fa-angle-double-down");
    zone2.append("div").attr("class","dropText").text("Drop summary");

    this.refreshDropZoneIndex();
  },
  /** -- */
  initDOM_DropZone: function(dom){
    var me=this;
    this.DOM.dropZone_Panel = this.DOM.root.append("div").attr("class","dropZone dropZone_summary dropZone_panel")
      .attr("readyToDrop",false)
      .on("mouseenter",function(event){
        this.setAttribute("readyToDrop",true);
        this.style.width = me.getWidth_Total()+"px";
      })
      .on("mouseleave",function(event){
        this.setAttribute("readyToDrop",false);
        this.style.width = null;
      })
      .on("mouseup",function(event){
        // If this panel has summaries within, dropping makes no difference.
        if(me.summaries.length!==0) return;
        var movedSummary = me.browser.movedSummary;
        if(movedSummary===undefined) return;
        if(movedSummary.panel){ // if the summary was in the panels already
            movedSummary.DOM.root[0][0].nextSibling.style.display = "";
            movedSummary.DOM.root[0][0].previousSibling.style.display = "";
        }
        movedSummary.addToPanel(me);
        me.browser.updateLayout();
      });
    this.DOM.dropZone_Panel.append("span").attr("class","dropIcon fa fa-angle-double-down");
    this.DOM.dropZone_Panel.append("div").attr("class","dropText").text("Drop summary");

    this.addDOM_DropZone();
  },
  /** -- */
  initDOM_AdjustWidth: function(){
    if(this.name==='middle' || this.name==='bottom') return; // cannot have adjust handles for now
    var me=this;
    var root = this.browser.DOM.root;
    this.DOM.panelAdjustWidth = this.DOM.root.append("span")
      .attr("class","panelAdjustWidth")
      .on("mousedown", function (d, i) {
        if(d3.event.which !== 1) return; // only respond to left-click
        var adjustDOM = this;
        adjustDOM.setAttribute("dragging","");
        root.style('cursor','ew-resize');
        me.browser.DOM.pointerBlock.attr("active","");
        me.browser.setNoAnim(true);
        var mouseDown_x = d3.mouse(document.body)[0];
        var mouseDown_width = me.width_catBars;
        d3.select("body").on("mousemove", function() {
          var mouseMove_x = d3.mouse(document.body)[0];
          var mouseDif = mouseMove_x-mouseDown_x;
          if(me.name==='right') mouseDif *= -1;
          var oldhideBarAxis = me.hideBarAxis;
          me.setWidthCatBars(mouseDown_width+mouseDif);
          if(me.hideBarAxis!==oldhideBarAxis){
            me.browser.updateLayout_Height();
          }
          // TODO: Adjust other panel widths
        }).on("mouseup", function(){
          adjustDOM.removeAttribute("dragging");
          root.style('cursor','default');
          me.browser.DOM.pointerBlock.attr("active",null);
          me.browser.setNoAnim(false);
          // unregister mouse-move callbacks
          d3.select("body").on("mousemove", null).on("mouseup", null);
        });
        d3.event.preventDefault();
      })
      .on("click",function(){
          d3.event.stopPropagation();
          d3.event.preventDefault();
      });
  },
  /** -- */
  refreshDropZoneIndex: function(){
    var me = this;
    this.DOM.root.selectAll(".dropZone_between_wrapper")
      .attr("panel_index",function(d,i){ 
        this.__data__ = i; 
        if(i===0) return "first";
        if(i===me.summaries.length) return "last";
        return "middle";
      });
  },
  /** -- */
  refreshAdjustWidth: function(){
    if(this.name==='middle' || this.name==='bottom') return; // cannot have adjust handles for now
    this.DOM.panelAdjustWidth.style("opacity",(this.summaries.length>0)?1:0);
  },
  /** -- */
  setTotalWidth: function(_w_){
    this.width_catBars = _w_ - this.width_catLabel - this.width_catMeasureLabel - kshf.scrollWidth;
  },
  /** -- */
  collapseAllSummaries: function(exceptThisOne){
    this.summaries.forEach(function(summary){ if(summary!==exceptThisOne) summary.setCollapsed(true); });
  },
  /** -- */
  setWidthCatLabel: function(_w_){
    console.log(_w_);
    _w_ = Math.max(90,_w_); // use at least 90 pixels for the category label.
    if(_w_===this.width_catLabel) return;
    var widthDif = this.width_catLabel-_w_;
    this.width_catLabel = _w_;
    this.summaries.forEach(function(summary){
      if(summary.refreshLabelWidth) summary.refreshLabelWidth();
    });
    this.setWidthCatBars(this.width_catBars+widthDif);
  },
  /** -- */
  setWidthCatBars: function(_w_){
    _w_ = Math.max(_w_,0);
    this.width_catBars = _w_;
    this.hideBarAxis = _w_<=20;

    this.DOM.root
      .attr("hidebars", _w_<=5)
      .attr("hideBarAxis", this.hideBarAxis);
    this.updateSummariesWidth();
    if(this.name!=="middle") this.browser.updateMiddlePanelWidth();
  },
  /** --- */
  updateSummariesWidth: function(){
    this.summaries.forEach(function(summary){ summary.refreshWidth(); });
  },
  /** --- */
  updateWidth_MeasureLabel: function(){
    var maxTotalCount = d3.max(this.summaries, function(summary){
      if(summary.type!=="categorical") return 0; // only align categorical summaries
      if(summary.getMaxAggr_Total===undefined) return 0;
      return summary.getMaxAggr_Total();
    });

    if(maxTotalCount===0){
      this.width_catMeasureLabel = 0;
      return;
    }

    var _w_total_ = this.getWidth_Total();

    var width_old = this.width_catMeasureLabel;

    this.width_catMeasureLabel = 10;
    // compute number of digits
    var digits = 1;
    while(maxTotalCount>9){ digits++; maxTotalCount = Math.floor(maxTotalCount/10); }
    if(digits>3){
      digits = 2;
      this.width_catMeasureLabel+=4; // "." character is used to split. It takes some space
    }
    this.width_catMeasureLabel += digits*6;

    // TODO: Account for the unitName displayed
    if(this.browser.measureFunc!=="Count" && this.browser.measureSummary){
      if(this.browser.measureSummary.unitName){
        // TODO: Use the rendered width, instead of 7
        var unitNameWidth = 2 + this.browser.measureSummary.unitName.length*7;
        this.width_catMeasureLabel += unitNameWidth;
      }
    }

    if(width_old!==this.width_catMeasureLabel){
      this.summaries.forEach(function(summary){
        if(summary.refreshLabelWidth) summary.refreshLabelWidth();
      });
      this.setWidthCatBars( _w_total_ - this.width_catLabel - this.width_catMeasureLabel - kshf.scrollWidth );
    }
  },
};

/**
 * @constructor
 */
kshf.Browser = function(options){
  this.options = options;

  if(kshf.lang.cur===null) kshf.lang.cur = kshf.lang.en; // English is Default language

  // BASIC OPTIONS
  this.summaryCount = 0;
  this.filterCount = 0;
  this.summaries = [];
  this.summaries_by_name = {};
  this.panels = {};

  this.filters = [];

  this.authoringMode = false;

  this.ratioModeActive = false;
  this.percentModeActive = false;
  this.isFullscreen = false;

  this.showDropZones = false;

  this.mapColorTheme = "converge";
  this.measureFunc = "Count";

  this.mouseSpeed = 0; // includes touch-screens...

  this.noAnim = false;

  this.domID = options.domID;

  this.vizActive = {
    Highlight: false,
    Compare_A: false,
    Compare_B: false,
    Compare_C: false
  };

  this.selectedAggr = {
    Highlight: null,
    Compare_A: null,
    Compare_B: null,
    Compare_C: null,
  }

  this.crumb_Highlight = new kshf.BreadCrumb(this,"Highlight");
  this.crumb_Compare_A = new kshf.BreadCrumb(this,"Compare_A");
  this.crumb_Compare_B = new kshf.BreadCrumb(this,"Compare_B");
  this.crumb_Compare_C = new kshf.BreadCrumb(this,"Compare_C");

  this.highlightSelectedSummary = null;
  this.highlightCrumbTimeout_Hide = undefined;


  this.allRecordsAggr = new kshf.Aggregate();
  this.allRecordsAggr.init();

  this.flexAggr_Highlight = new kshf.Aggregate();
  this.flexAggr_Compare_A = new kshf.Aggregate();
  this.flexAggr_Compare_B = new kshf.Aggregate();
  this.flexAggr_Compare_C = new kshf.Aggregate();
  this.flexAggr_Highlight.init();
  this.flexAggr_Compare_A.init();
  this.flexAggr_Compare_B.init();
  this.flexAggr_Compare_C.init();

  this.allAggregates = [];
  this.allAggregates.push(this.allRecordsAggr);

  // Callbacks
  this.onReady = options.onReady || options.readyCb;
  if(typeof this.onReady === "string" && this.onReady.substr(0,8)==="function"){
    eval("\"use strict\"; this.onReady = "+this.onReady);
  }

  this.onLoad  = options.onLoad  || options.loadedCb;
  if(typeof this.onLoad === "string" && this.onLoad.substr(0,8)==="function"){
    eval("\"use strict\"; this.onLoad = "+this.onLoad);
  }

  this.preview_not = false;

  this.recordName = options.itemName || options.recordName || "";
  if(options.itemDisplay) options.recordDisplay = options.itemDisplay;

  if(typeof this.options.enableAuthoring === "undefined") this.options.enableAuthoring = false;

  var me=this;
  this.DOM = {};
  this.DOM.root = d3.select(this.domID)
    .classed("kshf",true)
    .attr("noanim",true)
    .attr("measureFunc",this.measureFunc)
    .attr("pointerEvents",true)
    .style("position","relative")
    .on("mousemove",function(d,e){
      // Compute mouse moving speed, to adjust repsonsiveness
      if(me.lastMouseMoveEvent===undefined){
        me.lastMouseMoveEvent = d3.event;
        return;
      }
      var timeDif = d3.event.timeStamp - me.lastMouseMoveEvent.timeStamp;
      if(timeDif===0) return;

      var xDif = Math.abs(d3.event.x - me.lastMouseMoveEvent.x);
      var yDif = Math.abs(d3.event.y - me.lastMouseMoveEvent.y);
      // controls highlight selection delay
      me.mouseSpeed = Math.min( Math.sqrt(xDif*xDif + yDif*yDif) / timeDif , 2);

      me.lastMouseMoveEvent = d3.event;
    });

  // remove any DOM elements under this domID, kshf takes complete control over what's inside
  var rootDomNode = this.DOM.root[0][0];
  while (rootDomNode.hasChildNodes()) rootDomNode.removeChild(rootDomNode.lastChild);

  this.DOM.pointerBlock  = this.DOM.root.append("div").attr("class","pointerBlock");
  this.DOM.attribDragBox = this.DOM.root.append("div").attr("class","attribDragBox");

  this.insertDOM_Infobox();
  this.insertDOM_WarningBox();

  this.DOM.panel_Wrapper = this.DOM.root.append("div").attr("class","panel_Wrapper");

  this.insertDOM_PanelBasic();

  this.DOM.panelsTop = this.DOM.panel_Wrapper.append("div").attr("class","panels_Above");

  this.panels.left = new kshf.Panel({
    width_catLabel : options.leftPanelLabelWidth  || options.categoryTextWidth || 115,
    browser: this,
    name: 'left',
    parentDOM: this.DOM.panelsTop
  });

  this.DOM.middleColumn = this.DOM.panelsTop.append("div").attr("class","middleColumn");
  this.DOM.middleColumn.append("div").attr("class", "recordDisplay")

  this.panels.middle = new kshf.Panel({
    width_catLabel : options.middlePanelLabelWidth  || options.categoryTextWidth || 115,
    browser: this,
    name: 'middle',
    parentDOM: this.DOM.middleColumn
  });
  this.panels.right = new kshf.Panel({
    width_catLabel : options.rightPanelLabelWidth  || options.categoryTextWidth || 115,
    browser: this,
    name: 'right',
    parentDOM: this.DOM.panelsTop
  });
  this.panels.bottom = new kshf.Panel({
    width_catLabel : options.categoryTextWidth || 115,
    browser: this,
    name: 'bottom',
    parentDOM: this.DOM.panel_Wrapper
  });

  this.insertDOM_AttributePanel();

  this.DOM.root.selectAll(".panel").on("mouseleave",function(){
    setTimeout( function(){ me.updateLayout_Height(); }, 1500); // update layout after 1.5 seconds
  });

  kshf.loadFont();

  kshf.browsers.push(this);
  kshf.browser = this;

  if(options.source){
    window.setTimeout(function() { me.loadSource(options.source); }, 10);
  } else {
    this.panel_overlay.attr("show","source");
  }
};

kshf.Browser.prototype = {
    /** -- */
    setNoAnim: function(v){
      if(v===this.noAnim) return;
      if(this.finalized===undefined) return;
      this.noAnim=v;
      this.DOM.root.attr("noanim",this.noAnim);
    },
    /** -- */
    destroySummary: function(summary){
      summary.removeFromPanel();

      var indexFrom = -1;
      this.summaries.forEach(function(s,i){
        if(s===summary) indexFrom = i;
      });
      if(indexFrom===-1) return; // given summary is not within this panel
      this.summaries.splice(indexFrom,1);

      // if the summary is within the record display sorting list, remove!
      if(this.recordDisplay){
        var sortIndex = this.recordDisplay.sortingOpts.indexOf(summary);
        if(sortIndex!==-1){
          this.recordDisplay.sortingOpts.splice(sortIndex,1);
          this.recordDisplay.refreshSortingOptions();
        }
      }

      delete this.summaries_by_name[summary.summaryName];
      if(summary.summaryColumn) delete this.summaries_by_name[summary.summaryColumn];
    },
    /** -- */
    getAttribTypeFromFunc: function(attribFunc){
      var type = null;
      this.records.some(function(item,i){
        var item=attribFunc.call(item.data,item);
        if(item===null) return false;
        if(item===undefined) return false;
        if(typeof(item)==="number" || item instanceof Date) {
          type="interval";
          return true;
        }
        // TODO": Think about boolean summaries
        if(typeof(item)==="string" || typeof(item)==="boolean") {
          type = "categorical";
          return true;
        }
        if(Array.isArray(item)){
          type = "categorical";
          return true;
        }
        return false;
      },this);
      return type;
    },
    /** -- */
    createSummary: function(name,func,type){
      if(this.summaries_by_name[name]!==undefined){
        console.log("createSummary: The summary name["+name+"] is already used. Returning existing summary.");
        return this.summaries_by_name[name];
      }
      if(typeof(func)==="string"){
        var x=func;
        func = function(){ return this[x]; }
      }

      var attribFunc = func || function(){ return this[name]; }
      if(type===undefined){
        type = this.getAttribTypeFromFunc(attribFunc);
      }
      if(type===null){
        console.log("Summary data type could not be detected for summary name:"+name);
        return;
      }

      var summary;
      if(type==='categorical'){
        summary = new kshf.Summary_Categorical();
      } else if(type==='interval'){
        summary = new kshf.Summary_Interval();
      }

      summary.initialize(this,name,func);

      this.summaries.push(summary);
      this.summaries_by_name[name] = summary;

      return summary;
    },
    /** -- */
    changeSummaryName: function(curName,newName){
      if(curName===newName) return;
      var summary = this.summaries_by_name[curName];
      if(summary===undefined){
        console.log("changeSummaryName: The given summary name is not there.");
        return;
      }
      if(this.summaries_by_name[newName]!==undefined){
        if(newName!==this.summaries_by_name[newName].summaryColumn){
          console.log("changeSummaryName: The new summary name is already used. It must be unique. Try again");
          return;
        }
      }
      // remove the indexing using oldName IFF the old name was not original column name
      if(curName!==summary.summaryColumn){
        delete this.summaries_by_name[curName];
      }
      this.summaries_by_name[newName] = summary;
      summary.setSummaryName(newName);
      return summary;
    },
    /** -- */
    updateWidth_Total: function(){
      this.divWidth = parseInt(this.DOM.root.style("width"));
    },
    /** -- */
    getWidth_Total: function(){
      return this.divWidth;
    },
    /** This also considers if the available attrib panel is shown */
    getWidth_Browser: function(){
      return this.divWidth - (this.authoringMode ? kshf.attribPanelWidth : 0);
    },
    /** -- */
    getActiveCompareSelCount: function(){
      return this.vizActive.Compare_A + this.vizActive.Compare_B + this.vizActive.Compare_C;
    },
    /** -- */
    createFilter: function(filterOptions){
      filterOptions.browser = this;
      // see if it has been created before TODO
      var newFilter = new kshf.Filter(filterOptions);
      this.filters.push(newFilter);
      return newFilter;
    },
    /* -- */
    insertDOM_WarningBox: function(){
      this.panel_warningBox = this.DOM.root.append("div").attr("class", "warningBox_wrapper").attr("shown",false)
      var x = this.panel_warningBox.append("span").attr("class","warningBox");
      this.DOM.warningText = x.append("span").attr("class","warningText");
      x.append("span").attr("class","dismiss").html("<i class='fa fa-times-circle' style='font-size: 1.3em;'></i>")
      .on("click",function(){ this.parentNode.parentNode.setAttribute("shown",false); });
    },
    /** -- */
    showWarning: function(v){
      this.panel_warningBox.attr("shown",true);
      this.DOM.warningText.html(v);
    },
    /** -- */
    hideWarning: function(){
      this.panel_warningBox.attr("shown",false);
    },
    /** -- */
    getMeasurableSummaries: function(){
      return this.summaries.filter(function(summary){ 
        return (summary.type==='interval') 
          && summary.scaleType!=='time' 
          // && summary.panel!==undefined
          && summary.intervalRange.total
          //&& summary.intervalRange.total.min>=0
          && summary.summaryName !== this.records[0].idIndex
          ;
      },this);
    },
    /** -- */
    insertDOM_measureSelect: function(){
      var me=this;
      if(this.DOM.measureSelectBox) return;
      this.DOM.measureSelectBox = this.DOM.measureSelectBox_Wrapper.append("div").attr("class","measureSelectBox")
        .style({ left: "0px", top: "0px" });
      this.DOM.measureSelectBox.append("div").attr("class","measureSelectBox_Close fa fa-times-circle")
        .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'e', title: kshf.lang.cur.Close }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.closeMeasureSelectBox(); });
      this.DOM.measureSelectBox.append("div").attr("class","measureSelectBox_Header").text("Choose measure")
        .on("mousedown", function (d, i) {
          me.DOM.root.attr("pointerEvents",false);

          var initPos = d3.mouse(d3.select("body")[0][0]);
          var DOM = me.DOM.measureSelectBox[0][0];
          var initX = parseInt(DOM.style.left);
          var initY = parseInt(DOM.style.top);
          var boxWidth  = DOM.getBoundingClientRect().width;
          var boxHeight = DOM.getBoundingClientRect().height;
          var maxWidth  = me.DOM.root[0][0].getBoundingClientRect().width  - boxWidth;
          var maxHeight = me.DOM.root[0][0].getBoundingClientRect().height - boxHeight;
          me.DOM.root.attr("drag_cursor","grabbing");

          d3.select("body").on("mousemove", function() {
            var newPos = d3.mouse(d3.select("body")[0][0]);
            DOM.style.left = Math.min(maxWidth , Math.max(0, initX-initPos[0]+newPos[0] ))+"px";
            DOM.style.top  = Math.min(maxHeight, Math.max(0, initY-initPos[1]+newPos[1] ))+"px";
          }).on("mouseup", function(){
            me.DOM.root.attr("pointerEvents",true).attr("drag_cursor",null);
            d3.select("body").on("mousemove", null).on("mouseup", null);
          });
         d3.event.preventDefault();
        });

      var m = this.DOM.measureSelectBox.append("div").attr("class","measureSelectBox_Content");
      m.append("span").attr("class","measureSelectBox_Content_FuncType")
        .selectAll(".measureFunctionType").data([
          {v:"Count", l:"Count (#)"},
          {v:"Sum", l:"Sum (Total)"},
          {v:"Avg", l:"Average"},
        ]).enter()
        .append("div").attr("class", function(d){ return "measureFunctionType measureFunction_"+d.v})
        .html(function(d){ return d.l; })
        .on("click",function(d){
          if(d.v==="Count"){
            me.DOM.measureSelectBox.select(".sdsso23oadsa").attr("disabled","true");
            me.setMeasureFunction(); // no summary, will revert to count
            return;
          }
          this.setAttribute("selected","");
          me.DOM.measureSelectBox.select(".sdsso23oadsa").attr("disabled",null);
          me.setMeasureFunction( me.DOM.sdsso23oadsa[0][0].selectedOptions[0].__data__ , d.v);
        });

      this.DOM.sdsso23oadsa = m.append("div").attr("class","measureSelectBox_Content_Summaries")
        .append("select").attr("class","sdsso23oadsa")
        .attr("disabled",this.measureFunc==="Count"?"true":null)
        .on("change",function(){
          var s = this.selectedOptions[0].__data__;
          me.setMeasureFunction(s,me.measureFunc);
        });

      this.DOM.sdsso23oadsa
        .selectAll(".measureSummary").data(this.getMeasurableSummaries()).enter()
        .append("option")
          .attr("class",function(summary){ return "measureSummary measureSummary_"+summary.summaryID;; })
          .attr("value",function(summary){ return summary.summaryID; })
          .attr("selected", function(summary){ return summary===me.measureSummary?"true":null })
          .html(function(summary){ return summary.summaryName; })

      m.append("span").attr("class","measureSelectBox_Content_RecordName").html(" of "+this.recordName);
    },
    /** -- */
    closeMeasureSelectBox: function(){
      this.DOM.measureSelectBox_Wrapper.attr("showMeasureBox",false); // Close box
      this.DOM.measureSelectBox = undefined;
      var d = this.DOM.measureSelectBox_Wrapper[0][0];
      while (d.hasChildNodes()) d.removeChild(d.lastChild);
    },
    /** -- */
    refreshMeasureSelectAction: function(){
      this.DOM.recordInfo.attr('changeMeasureBox', (this.getMeasurableSummaries().length!==0)? 'true' : null);
    },
    /** -- */
    insertDOM_PanelBasic: function(){
      var me=this;

      this.DOM.panel_Basic = this.DOM.panel_Wrapper.append("div").attr("class","panel_Basic");

      this.DOM.measureSelectBox_Wrapper = this.DOM.panel_Basic.append("span").attr("class","measureSelectBox_Wrapper")
        .attr("showMeasureBox",false);
      
      this.DOM.recordInfo = this.DOM.panel_Basic.append("span")
        .attr("class","recordInfo")
        .attr("edittitle",false)
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'n', title: "Change measure" }); })
        .on("mouseenter",function(){
          if(me.authoringMode || me.getMeasurableSummaries().length===0) return;
          this.tipsy.show(); 
        })
        .on("mouseleave",function(){ this.tipsy.hide(); })
        .on("click",function(){
          if(me.authoringMode || me.getMeasurableSummaries().length===0) return;
          this.tipsy.hide();
          if(me.DOM.measureSelectBox) {
            me.closeMeasureSelectBox();
            return;
          }
          me.insertDOM_measureSelect();
          me.DOM.measureSelectBox_Wrapper.attr("showMeasureBox",true);
        });

      this.DOM.activeRecordMeasure = this.DOM.recordInfo.append("span").attr("class","activeRecordMeasure");

      this.DOM.measureFuncType = this.DOM.recordInfo.append("span").attr("class","measureFuncType");

      this.DOM.recordName = this.DOM.recordInfo.append("span").attr("class","recordName editableText")
        .each(function(){
          this.tipsy = new Tipsy(this, {
            gravity: 'w', title: function(){
              var curState=this.parentNode.getAttribute("edittitle");
              return (curState===null || curState==="false") ? kshf.lang.cur.EditTitle : "OK";
            }
          })
        })
        .attr("contenteditable",false)
        .on("mousedown", function(){ d3.event.stopPropagation(); })
        .on("mouseenter",function(){ 
          this.tipsy.show(); 
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("mouseleave",function(){ this.tipsy.hide(); })
        .on("mousedown", function(){
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("blur",function(){
          this.parentNode.setAttribute("edittitle",false);
          this.setAttribute("contenteditable", false);
          me.recordName = this.textContent;
        })
        .on("keydown",function(){
          if(event.keyCode===13){ // ENTER
            this.parentNode.setAttribute("edittitle",false);
            this.setAttribute("contenteditable", false);
            me.recordName = this.textContent;
          }
        })
        .on("click",function(){
          this.tipsy.hide();
          var curState=this.parentNode.getAttribute("edittitle");
          if(curState===null || curState==="false"){
            this.parentNode.setAttribute("edittitle",true);
            var parentDOM = d3.select(this.parentNode);
            var v=parentDOM.select(".recordName")[0][0];
            v.setAttribute("contenteditable",true);
            v.focus();
          } else {
            this.parentNode.setAttribute("edittitle",false);
            var parentDOM = d3.select(this.parentNode);
            var v=parentDOM.select(".recordName")[0][0];
            v.setAttribute("contenteditable",false);
            me.recordName = this.textContent;
          }
        });

      this.DOM.breadcrumbs = this.DOM.panel_Basic.append("span").attr("class","breadcrumbs");

      this.DOM.saveSelection = this.DOM.breadcrumbs.append("span").attr("class", "saveSelection fa fa-floppy-o")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'n', title: kshf.lang.cur.SaveSelection }); })
        .on("mouseenter",function(){ this.tipsy.show(); })
        .on("mouseleave",function(){ this.tipsy.hide(); })
        .on("click",     function(){ this.tipsy.hide(); me.saveFilterSelection(); });

      this.initDOM_ClearAllFilters();

      var rightBoxes = this.DOM.panel_Basic.append("span").attr("class","rightBoxes");
      // Attribute panel
      if (typeof saveAs !== 'undefined') { // FileSaver.js is included
        rightBoxes.append("i").attr("class","saveBrowserConfig fa fa-download")
          .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: "Download Browser Configuration" }); })
          .on("mouseenter", function(){ this.tipsy.show(); })
          .on("mouseleave", function(){ this.tipsy.hide(); })
          .on("click",function(){ 
            var c = JSON.stringify(me.exportConfig(),null,'  ');
            var blob = new Blob([c]);//, {type: "text/plain;charset=utf-8"});
            saveAs(blob, "kshf_config.json");
          });
      }
      rightBoxes.append("i").attr("class","configUser fa")
        .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'n', 
          title: function(){ 
            return kshf.gistLogin?
              ("Welcome, <i class='fa fa-github'></i> <b>"+kshf.gistLogin+"</b>.<br><br>"+
                  "Click to logout.<br><br>"+"Shift-click to set gist "+(kshf.gistPublic?"secret":"public")+"."):
              "Sign-in using github";
            }
        });
        })
        .attr("auth", false)
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .on("click",function(){ 
          if(this.getAttribute("auth")==="true"){
            if(d3.event.shiftKey) {
              kshf.gistPublic = !kshf.gistPublic; // invert public setting
              this.setAttribute("public",kshf.gistPublic);
              alert("Future uploads will be "+(kshf.gistPublic?"public":"secret")+".")
              return;
            }
            // de-authorize
            kshf.githubToken = undefined;
            kshf.gistLogin = undefined;
            this.setAttribute("auth",false)
          } else {
            kshf.githubToken = window.prompt("Your Github token (only needs access to gist)", "");
            if(this.githubToken!==""){
              kshf.getGistLogin();
              this.setAttribute("auth",true);
            }
          }
        });
      rightBoxes.append("i").attr("class","saveBrowserConfig fa fa-cloud-upload")
        .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: "Upload Browser Config to Cloud" }); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .on("click",function(){
          if(!confirm("The browser will be saved "+
              ((kshf.gistLogin)?
                "to your github as "+(kshf.gistPublic?"public":"secret")+" gist.":
                "anonymously and public.")
            )){
            return;
          }
          var e = me.exportConfig();
          var c = JSON.stringify(e,null,'  ');

          // Add authentication data if authentication token is set
          var headers = {};
          if(kshf.gistLogin) headers.Authorization = "token "+kshf.githubToken;

          // Set description (from page title if it exists)
          var description = "Keshif Browser Configuration";
          // In demo pages, demo_PageTitle gives more context - use it as description
          if(d3.select("#demo_PageTitle")[0][0]){
            description = d3.select("#demo_PageTitle").html();
          }

          var githubLoad = {
            description: description,
            public: kshf.gistPublic,
            files: { "kshf_config.json": { content: c }, }
          };
          // Add style file, if custom style exists
          var badiStyle = d3.select("#kshfStyle");
          if(badiStyle[0].length > 0 && badiStyle[0][0]!==null){
            githubLoad.files["kshf_style.css"] = { content: badiStyle.text()};
          }

          function gist_createNew(){
            $.ajax( 'https://api.github.com/gists',
              { method: "POST",
                dataType: 'json',
                data: JSON.stringify(githubLoad),
                headers: headers,
                success: function(response){
                  // Keep Gist Info (you may edit/fork it next)
                  kshf.gistInfo = response;
                  var gistURL = response.html_url;
                  var gistID = gistURL.replace(/.*github.*\//g,'');
                  var keshifGist = "keshif.me/gist?"+gistID;
                  me.showWarning(
                    "The browser is saved to "+
                    "<a href='"+gistURL+"' target='_blank'>"+gistURL.replace("https://","")+"</a>.<br> "+
                    "To load it again, visit <a href='http://"+keshifGist+"' target='_blank'>"+keshifGist+"</a>"
                    )
                },
              },
              'json'
            );
          };

          // UNAUTHORIZED / ANONYMOUS
          if(kshf.gistLogin===undefined){
            // You cannot fork or edit a gist as anonymous user.
            gist_createNew();
            return;
          }

          // AUTHORIZED, NEW GIST
          if(kshf.gistInfo===undefined){
            gist_createNew(); // New gist
            return;
          }

          // AUTHOIZED, EXISTING GIST, FROM ANOTHER USER
          if(kshf.gistInfo.owner===undefined || kshf.gistInfo.owner.login !== kshf.gistLogin){
            // Fork it
            $.ajax( 'https://api.github.com/gists/'+kshf.gistInfo.id+"/forks", 
              { method: "POST",
                dataType: 'json',
                data: JSON.stringify(githubLoad),
                async: false,
                headers: headers,
                success: function(response){
                  kshf.gistInfo = response; // ok, now my gist
                },
              },
              'json'
            );
          }

          // AUTHORIZED, EXISTING GIST, MY GIST
          if(kshf.gistInfo.owner.login === kshf.gistLogin){
            // edit
            $.ajax( 'https://api.github.com/gists/'+kshf.gistInfo.id, 
              { method: "PATCH",
                dataType: 'json',
                data: JSON.stringify(githubLoad),
                headers: headers,
                success: function(response){
                  var gistURL = response.html_url;
                  var gistID = gistURL.replace(/.*github.*\//g,'');
                  var keshifGist = "keshif.me/gist?"+gistID;
                  me.showWarning(
                    "The browser is edited in "+
                    "<a href='"+gistURL+"' target='_blank'>"+gistURL.replace("https://","")+"</a>.<br> "+
                    "To load it again, visit <a href='http://"+keshifGist+"' target='_blank'>"+keshifGist+"</a>"
                    )
                },
              },
              'json'
            );
          }
        });

      // Authoring
      this.DOM.authorButton = rightBoxes.append("span").attr("class","authorButton fa fa-cog")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'n', title: kshf.lang.cur.ModifyBrowser }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.enableAuthoring(); });
      // Datasource
      this.DOM.datasource = rightBoxes.append("a").attr("class","fa fa-table datasource")
        .attr("target","_blank")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'n', title: kshf.lang.cur.OpenDataSource }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); });
      // Help
      this.DOM.showHelpIn = rightBoxes.append("span").attr("class","showHelpIn fa fa-question-circle")
        .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'n', title: kshf.lang.cur.Help }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide();
          if(typeof helpin !== 'undefined') helpin.initDOM(); else alert("We are working on offering you the best help soon.");
        });

      // Fullscreen
      rightBoxes.append("span").attr("class","fa fa-arrows-alt fullscreen")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.ShowFullscreen }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.showFullscreen();});
      // Info & Credits
      var x = rightBoxes.append("span").attr("class","logoHost")//.attr("class","fa fa-info-circle")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.ShowInfoCredits }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.panel_overlay.attr("show","infobox"); })
        .html(kshf.kshfLogo);

      // Total glyph - row
      var adsdasda = this.DOM.panel_Basic.append("div").attr("class","totalGlyph aggrGlyph");
      this.DOM.totalGlyph = adsdasda.selectAll("[class*='measure_']")
        .data(["Total","Active","Highlight","Compare_A","Compare_B","Compare_C"])
        .enter()
        .append("span").attr("class", function(d){ return "measure_"+d;})
    },
    /** -- */
    refreshTotalViz: function(){
      var me=this;
      var totalScale = d3.scale.linear()
        .domain([0, this.allRecordsAggr.measure(this.ratioModeActive ? 'Active' : 'Total') ])
        .range([0, this.getWidth_Browser()])
        .clamp(true);

      var totalC = this.getActiveCompareSelCount();
      totalC++; // 1 more for highlight

      var VizHeight = 8;
      var curC = 0;
      var stp = VizHeight / totalC;

      this.DOM.totalGlyph.each(function(d){
        if(d==="Total" || d==="Highlight" || d==="Active"){
          kshf.Util.setTransform(this, "scale("+totalScale(me.allRecordsAggr.measure(d))+","+VizHeight+")");
        } else {
          kshf.Util.setTransform(this, 
            "translateY("+(stp*curC)+"px) "+
            "scale("+totalScale(me.allRecordsAggr.measure(d))+","+stp+")");
          curC++;
        }
      });
    },
    /** --- */
    initDOM_ClearAllFilters: function(){
      var me=this;

      this.DOM.filterClearAll = this.DOM.panel_Basic.append("span").attr("class","filterClearAll")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'n', title: kshf.lang.cur.RemoveAllFilters }); })
        .on("mouseenter",function(){ this.tipsy.show(); })
        .on("mouseleave",function(){ this.tipsy.hide(); })
        .on("click",     function(){ this.tipsy.hide(); me.clearFilters_All(); });
      this.DOM.filterClearAll.append("span").attr("class","title").html(
        "<i class='fa fa-filter' style='vertical-align: top'></i> "+kshf.lang.cur.ShowAll);
    },
    /* -- */
    insertDOM_Infobox: function(){
        var me=this;
        var creditString="";
        creditString += "<div class='infobox-header'><a target='_blank' href='http://www.keshif.me' class='libName'>";
        creditString += kshf.kshfLogo;

        creditString += " Keshif</a> - Data Made Explorable</div>";

        creditString += "<div class='boxinbox' style='padding: 0px 15px'>";
        creditString += " <a href='http://hcil.umd.edu/' target='_blank'>"+
          "<img src='http://www.keshif.me/AggreSet/img/logo_hcil.gif' style='height:50px; float: left'></a>";
        creditString += " <a href='http://www.umd.edu' target='_blank'>"+
          "<img src='http://www.keshif.me/AggreSet/img/logo_umd.png' style='height:50px; float: right'></a>";
        creditString += "Designed &amp; developed by: ";
        creditString += " <a class='myName' href='http://www.adilyalcin.me' target='_blank'>M. Adil Yalçın</a><br>";
        creditString += "Advised by: <br>";
        creditString += " <a class='advName' href='https://sites.umiacs.umd.edu/elm/' target='_blank'>Niklas Elmqvist</a> &amp; ";
        creditString += " <a class='advName' href='http://www.cs.umd.edu/~bederson/' target='_blank'>Ben Bederson</a> <br>";
        creditString += "</div>";

        creditString += "<div class='boxinbox'>";
            creditString += "<div style='float:right;'>"
            creditString += "<iframe src='http://ghbtns.com/github-btn.html?user=adilyalcin&repo=Keshif&type=watch&count=true' "+
              "allowtransparency='true' frameborder='0' scrolling='0' width='90px' height='20px'></iframe><br/>";
            creditString += "</div>";
            creditString += "<div style='float:left; padding-left: 10px'>"
            creditString += "<iframe src='http://ghbtns.com/github-btn.html?user=adilyalcin&repo=Keshif&type=fork&count=true' "+
              "allowtransparency='true' frameborder='0' scrolling='0' width='90px' height='20px'></iframe>";
            creditString += "</div>";
        creditString += " <span style='font-size: 0.7em'> 3rd party libraries:";
        creditString += " <a style='color:black;' href='http://d3js.org/' target='_blank'>D3</a>, ";
        creditString += " <a style='color:black;' href='http://jquery.com' target='_blank'>JQuery</a>, ";
        creditString += " <a style='color:black;' href='https://developers.google.com/chart/' target='_blank'>GoogleDocs</a></span>";
        creditString += "</div>";

        creditString += "<div class='project_fund'><b>Keşif</b> (Turkish): Discovery &amp; exploration</div>";

        this.panel_overlay = this.DOM.root.append("div").attr("class", "panel panel_overlay");

        // BACKGROUND 
        this.DOM.kshfBackground = this.panel_overlay.append("div").attr("class","kshfBackground")
          .on("click",function(){
            var activePanel = this.parentNode.getAttribute("show");
            if(activePanel==="recordDetails" || activePanel==="infobox" || activePanel==="help-browse")
              me.panel_overlay.attr("show","none");
          });

        // LOADING BOX
        this.DOM.loadingBox = this.panel_overlay.append("div").attr("class","overlay_content overlay_loading");
        var ssdsd = this.DOM.loadingBox.append("span").attr("class","spinner")
          .selectAll(".spinner_x").data([1,2,3,4,5]).enter()
            .append("span").attr("class",function(d){ return "spinner_x spinner_"+d; });
        var hmmm=this.DOM.loadingBox.append("div").attr("class","status_text");
        hmmm.append("span").attr("class","status_text_sub info").text(kshf.lang.cur.LoadingData);
        this.DOM.status_text_sub_dynamic = hmmm.append("span").attr("class","status_text_sub dynamic");

        // CREDITS 
        var overlay_infobox = this.panel_overlay.append("div").attr("class","overlay_content overlay_infobox");
        overlay_infobox.append("div").attr("class","overlay_Close fa fa-times fa-times-circle")
          .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.Close }); })
          .on("mouseenter",function(){ this.tipsy.show(); })
          .on("mouseleave",function(){ this.tipsy.hide(); })
          .on("click",function(){ this.tipsy.hide(); me.panel_overlay.attr("show","none"); });
        overlay_infobox.append("div").html(creditString);

        this.insertSourceBox();

        // ITEM DETAILS 
        this.DOM.overlay_recordDetails = this.panel_overlay.append("span").attr("class","overlay_content overlay_recordDetails");
        this.DOM.overlay_recordDetails.append("div").attr("class","overlay_Close fa fa-times-circle")
          .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.Close }); })
          .on("mouseenter",function(){ this.tipsy.show(); })
          .on("mouseleave",function(){ this.tipsy.hide(); })
          .on("click",function(){ me.panel_overlay.attr("show","none"); });
        this.DOM.overlay_recordDetails_content = this.DOM.overlay_recordDetails.append("span").attr("class","content");

        // HELP
        this.panel_overlay.append("span").attr("class","overlay_content overlay_help");
        // ANSWER
        this.panel_overlay.append("span").attr("class","overlay_answer");
    },
    /** -- */
    insertSourceBox: function(){
        var me = this;
        var x,y,z;
        var source_type = "GoogleSheet";
        var sourceURL = null, sourceSheet = "", localFile = undefined;

        var readyToLoad=function(){
          if(localFile) return true;
          return sourceURL!==null && sourceSheet!=="";
        };

        this.DOM.overlay_source = this.panel_overlay.append("div").attr("class","overlay_content overlay_source")
            .attr("selected_source_type",source_type);

        this.DOM.overlay_source.append("div").attr("class","sourceHeader").text("Import your data")
          .append("span").attr("class","fa fa-info-circle")
            .each(function(summary){
              this.tipsy = new Tipsy(this, {
                gravity: 's', title: function(){ 
                  return "<b>Confidentiality</b>: This website does not track the data you import.<br> You can "+
                    "use the source code to host your data and the browser locally.";
                }
              });
            })
            .on("mouseenter",function(){ this.tipsy.show(); })
            .on("mouseleave",function(){ this.tipsy.hide(); });;

        var source_wrapper = this.DOM.overlay_source.append("div").attr("class","source_wrapper");

        x = source_wrapper.append("div").attr("class","sourceOptions");

        x.append("span").attr("class","sourceOption").html(
          "<img src='https://lh3.ggpht.com/e3oZddUHSC6EcnxC80rl_6HbY94sM63dn6KrEXJ-C4GIUN-t1XM0uYA_WUwyhbIHmVMH=w300-rw' "+
          " style='height: 12px;'> Google Sheet").attr("source_type","GoogleSheet");
        x.append("span").attr("class","sourceOption").html(
          "<img src='https://developers.google.com/drive/images/drive_icon.png' style='height:12px; position: "+
            "relative; top: 2px'> Google Drive Folder")
          .attr("source_type","GoogleDrive");
        x.append("span").attr("class","sourceOption").html(
          "<i class='fa fa-dropbox'></i> Dropbox Folder").attr("source_type","Dropbox");
        x.append("span").attr("class","sourceOption")
          .html("<i class='fa fa-file'></i> Local File").attr("source_type","LocalFile");

        x.selectAll(".sourceOption").on("click",function(){
          source_type=this.getAttribute("source_type");
          me.DOM.overlay_source.attr("selected_source_type",source_type);
          var placeholder;
          switch(source_type){
            case "GoogleSheet": placeholder = 'https://docs.google.com/spreadsheets/d/**************'; break;
            case "GoogleDrive": placeholder = 'https://******.googledrive.com/host/**************/'; break;
            case "Dropbox":     placeholder = "https://dl.dropboxusercontent.com/u/**************/";
          }
          gdocLink.attr("placeholder",placeholder);
        });

        x = source_wrapper.append("div");
        var gdocLink = x.append("input")
          .attr("type","text")
          .attr("class","gdocLink")
          .attr("placeholder",'https://docs.google.com/spreadsheets/d/**************')
          .on("keyup",function(){
            gdocLink_ready.style("opacity",this.value===""?"0":"1");
            var input = this.value;
            if(source_type==="GoogleSheet"){
              var firstIndex = input.indexOf("docs.google.com/spreadsheets/d/");
              if(firstIndex!==-1){
                  var input = input.substr(firstIndex+31); // focus after the base url
                  if(input.indexOf("/")!==-1){
                      input = input.substr(0,input.indexOf("/"));
                  }
              }
              if(input.length===44){
                  sourceURL = input;
                  gdocLink_ready.attr("ready",true);
              } else {
                  sourceURL = null;
                  gdocLink_ready.attr("ready",false);
              }
            }
            if(source_type==="GoogleDrive"){
              var firstIndex = input.indexOf(".googledrive.com/host/");
              if(firstIndex!==-1){
                  // Make sure last character is "/"
                  if(input[input.length-1]!=="/") input+="/";
                  sourceURL = input;
                  gdocLink_ready.attr("ready",true);
              } else {
                  sourceURL = null;
                  gdocLink_ready.attr("ready",false);
              }
            }
            if(source_type==="Dropbox"){
              var firstIndex = input.indexOf("dl.dropboxusercontent.com/");
              if(firstIndex!==-1){
                  // Make sure last character is "/"
                  if(input[input.length-1]!=="/") input+="/";
                  sourceURL = input;
                  gdocLink_ready.attr("ready",true);
              } else {
                  sourceURL = null;
                  gdocLink_ready.attr("ready",false);
              }
            }
            actionButton.attr("disabled",!readyToLoad());
          });

        var fileLink = x.append("input")
          .attr("type","file")
          .attr("class","fileLink")
          .on("change",function(){
            gdocLink_ready.style("opacity",0);
            var files = d3.event.target.files; // FileList object
            if(files.length>1){
              alert("Please select only one file.");
              return;
            }
            if(files.length===0){
              alert("Please select a file.");
              return;
            }
            localFile = files[0];
            switch(localFile.type){
              case "application/json": // json
                localFile.fileType = "json";
                localFile.name = localFile.name.replace(".json","");
                break;
              case "text/csv": // csv
                localFile.fileType = "csv";
                localFile.name = localFile.name.replace(".csv","");
                break;
              case "text/tab-separated-values":  // tsv
                localFile.fileType = "tsv";
                localFile.name = localFile.name.replace(".tsv","");
                break;
              default:
                localFile = undefined;
                actionButton.attr("disabled",true);
                alert("The selected file type is not supported (csv, tsv, json)");
                return;
            }
            localFile.name = localFile.name.replace("_"," ");
            gdocLink_ready.style("opacity",1);
            gdocLink_ready.attr("ready",true);
            actionButton.attr("disabled",false);
          });

        x.append("span").attr("class","fa fa-info-circle")
          .each(function(summary){
            this.tipsy = new Tipsy(this, {
              gravity: 's', title: function(){
                switch(source_type){
                  case "GoogleSheet": return "The link to your Google Sheet";
                  case "GoogleDrive": return "The link to *hosted* Google Drive folder";
                  case "Dropbox":     return "The link to your *Public* Dropbox folder";
                  case "LocalFile":   return "Select your CSV/TSV/JSON file<br> or drag-and-drop here.";
                }
                return "(Unknown source type)";
              }
            });
          })
          .on("mouseenter",function(){ this.tipsy.show(); })
          .on("mouseleave",function(){ this.tipsy.hide(); });

        var gdocLink_ready = x.append("span").attr("class","gdocLink_ready fa").attr("ready",false);

        var sheetInfo = this.DOM.overlay_source.append("div").attr("class","sheetInfo");

        x = sheetInfo.append("div").attr("class","sheet_wrapper")
            x.append("div").attr("class","subheading tableHeader");

        x = sheetInfo.append("div").attr("class","sheet_wrapper sheetName_wrapper")
            x.append("span").attr("class","subheading").text("Name");
            x.append("span").attr("class","fa fa-info-circle")
                .each(function(summary){
                    this.tipsy = new Tipsy(this, {
                        gravity: 's', title: function(){
                            var v;
                            if(source_type==="GoogleSheet")
                                v="The name of the data sheet in your Google Sheet.";
                            if(source_type==="GoogleDrive")
                                v="The file name in the folder.";
                            if(source_type==="Dropbox")
                                v="The file name in the folder.";
                            v+="<br>A noun that describes a data row."
                            return v;
                        }
                    });
                })
                .on("mouseenter",function(){ this.tipsy.show(); })
                .on("mouseleave",function(){ this.tipsy.hide(); });

        this.DOM.tableName = x.append("input").attr("type","text").attr("class","tableName")
          .on("keyup",function(){
            sourceSheet = this.value;
            actionButton.attr("disabled",!readyToLoad());
          });

            z=x.append("span").attr("class","fileType_wrapper");
            z.append("span").text(".");
            var DOMfileType = z.append("select").attr("class","fileType");
                DOMfileType.append("option").attr("value","csv").text("csv");
                DOMfileType.append("option").attr("value","tsv").text("tsv");
                DOMfileType.append("option").attr("value","json").text("json");

        var actionButton = this.DOM.overlay_source.append("div").attr("class","actionButton")
          .text("Explore it with Keshif")
          .attr("disabled",true)
          .on("click",function(){
            if(!readyToLoad()){
              alert("Please input your data source link and sheet name.");
              return;
            }
            me.options.enableAuthoring = true; // Enable authoring on data load
            var sheetID = "id";
            switch(source_type){
              case "GoogleSheet":
                me.loadSource({
                  gdocId: sourceURL,
                  tables: {name:sourceSheet, id:sheetID}
                });
                break;
              case "GoogleDrive":
                me.loadSource({
                  dirPath: sourceURL,
                  fileType: DOMfileType[0][0].value,
                  tables: {name:sourceSheet, id:sheetID}
                });
                break;
              case "Dropbox":
                me.loadSource({
                  dirPath: sourceURL,
                  fileType: DOMfileType[0][0].value,
                  tables: {name:sourceSheet, id:sheetID}
                });
                break;
              case "LocalFile":
                localFile.id = sheetID;
                me.loadSource({
                  dirPath: "", // TODO: temporary
                  tables: localFile
                });
                break;
            }
          });

          this.DOM.overlay_source.append("div").attr("class","dataImportNotes").html(
            "<i class='fa fa-file-text'></i> <a href='https://github.com/adilyalcin/Keshif/wiki/Docs:-Loading-Data' target='_blank'>"+
              "Documentation for data sources and the programming interface</a><br>"+
            "<i class='fa fa-file-text'></i> <a href='https://github.com/adilyalcin/Keshif/wiki/Guidelines-for-Data-Preparation' target='_blank'>"+
              "Guidelines for Data Preparation</a>"
            );    
    },
    /** -- */
    insertDOM_AttributePanel: function(){
      var me=this;

      this.DOM.attributePanel = this.DOM.root.append("div").attr("class","attributePanel");
      
      var xx= this.DOM.attributePanel.append("div").attr("class","attributePanelHeader");
      xx.append("span").text("Available Summaries");
      xx.append("span").attr("class","hidePanel fa fa-times")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: "w", title: "Close panel" }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.enableAuthoring(); });

      var attributePanelControl = this.DOM.attributePanel.append("div").attr("class","attributePanelControl");

      attributePanelControl.append("span").attr("class","attribFilterIcon fa fa-filter");

      // *******************************************************
      // TEXT SEARCH
      // *******************************************************

      this.DOM.attribTextSearch = attributePanelControl.append("span").attr("class","textSearchBox attribTextSearch");
      this.DOM.attribTextSearchControl = this.DOM.attribTextSearch.append("span")
        .attr("class","textSearchControl fa")
        .on("click",function() { 
          me.DOM.attribTextSearchControl.attr("showClear",false)[0][0].value="";
          me.summaries.forEach(function(summary){
            if(summary.DOM.nugget===undefined) return;
            summary.DOM.nugget.attr("filtered",false);
          });
        });
      this.DOM.attribTextSearch.append("input")
        .attr("class","textSearchInput")
        .attr("type","text")
        .attr("placeholder",kshf.lang.cur.Search)
        .on("input",function(){
          if(this.timer) clearTimeout(this.timer);
          var x = this;
          var queryString = x.value.toLowerCase();
          me.DOM.attribTextSearchControl.attr("showClear", (queryString!=="") )
          this.timer = setTimeout( function(){
            me.summaries.forEach(function(summary){
              if(summary.DOM.nugget===undefined) return;
              summary.DOM.nugget.attr("filtered",(summary.summaryName.toLowerCase().indexOf(queryString)===-1));
            });
          }, 750);
        });

      attributePanelControl.append("span").attr("class","addAllSummaries")
        .append("span").attr("class","fa fa-magic") // fa-caret-square-o-right
          .each(function(){ this.tipsy = new Tipsy(this, { gravity: "e", title: "Add all to browser" }); })
          .on("mouseenter", function(){ this.tipsy.show(); })
          .on("mouseleave", function(){ this.tipsy.hide(); })
          .on("click",      function(){ this.tipsy.hide(); me.autoCreateBrowser(); });

      this.DOM.attributeList = this.DOM.attributePanel.append("div").attr("class","attributeList");

      this.DOM.dropZone_AttribList = this.DOM.attributeList.append("div").attr("class","dropZone dropZone_AttribList")
        .attr("readyToDrop",false)
        .on("mouseenter",function(event){
          this.setAttribute("readyToDrop",true);
        })
        .on("mouseleave",function(event){
          this.setAttribute("readyToDrop",false);
        })
        .on("mouseup",function(event){
          var movedSummary = me.movedSummary;
          movedSummary.removeFromPanel();
          movedSummary.clearDOM();
          movedSummary.browser.updateLayout();
          me.movedSummary = null;
        });
      this.DOM.dropZone_AttribList.append("span").attr("class","dropIcon fa fa-angle-double-down");
      this.DOM.dropZone_AttribList.append("div").attr("class","dropText").text("Remove summary");

      this.DOM.attributeList.append("div").attr("class","newAttribute").html("<i class='fa fa-plus-square'></i>")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'n', title: 'Add new attribute' }); })
        .on("mouseenter",function(){ this.tipsy.show(); })
        .on("mouseleave",function(){ this.tipsy.hide(); })
        .on("click",function(){
          var name = prompt("The attribute name");
          if(name===null) return; // cancel
          var func = prompt("The attribute function");
          if(func===null) return; // cancel
          var safeFunc = undefined;
          try {
            eval("\"use strict\"; safeFunc = function(d){"+func+"}");
          } catch (e){
            console.log("Eval error:\n Message:"+e.message+"\n line:column\n"+e.lineNumber+":"+e.columnNumber);
          }
          if(typeof safeFunc !== "function"){
            alert("You did not specify a function with correct format. Cannot specify new attribute.");
            return;
          }
          me.createSummary(name,safeFunc);
        });
    },
    /** -- */
    updateRecordDetailPanel: function(record){
      var str="";
      if(this.recordDisplay.config && this.recordDisplay.config.onDetail){
        str = this.recordDisplay.config.onDetail.call(record);
      } else {
        for(var column in record.data){
          var v=record.data[column];
          if(v===undefined || v===null) continue;
          str+="<b>"+column+":</b> "+ v.toString()+"<br>";
        }
      }
      this.DOM.overlay_recordDetails_content.html(str);
      this.panel_overlay.attr("show","recordDetails");
    },
    /** -- */
    enableAuthoring: function(v){
      if(v===undefined) v = !this.authoringMode; // if undefined, invert
      this.authoringMode = v;
      this.DOM.root.attr("authoringMode",this.authoringMode?"true":null);

      this.updateLayout();

      var lastIndex = 0, me=this;
      var initAttib = function(){
        var start = Date.now();
        me.summaries[lastIndex++].initializeAggregates();
        var end = Date.now();
        if(lastIndex!==me.summaries.length){
          setTimeout(initAttib,end-start);
        } else {
          me.reorderNuggetList();
        }
      };
      setTimeout(initAttib,150);
    },
    /** -- */
    showFullscreen: function(){
      this.isFullscreen = this.isFullscreen?false:true;
      var elem = this.DOM.root[0][0];
      if(this.isFullscreen){
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    },
    /** -- */
    loadSource: function(v){
      this.source = v;
      this.panel_overlay.attr("show","loading");
      // Compability with older versions.. Used to specify "sheets" instead of "tables"
      if(this.source.sheets){
          this.source.tables = this.source.sheets;
      }
      if(this.source.tables){
        if(!Array.isArray(this.source.tables)) this.source.tables = [this.source.tables];

        this.source.tables.forEach(function(tableDescr, i){
            if(typeof tableDescr === "string") this.source.tables[i] = {name: tableDescr};
        }, this);

        // Reset loadedTableCount
        this.source.loadedTableCount=0;

        this.DOM.status_text_sub_dynamic
          .text("("+this.source.loadedTableCount+"/"+this.source.tables.length+")");

        this.primaryTableName = this.source.tables[0].name;
        if(this.source.gdocId){
          this.source.url = this.source.url || ("https://docs.google.com/spreadsheets/d/"+this.source.gdocId);
        }
        this.source.tables.forEach(function(tableDescr){
          if(tableDescr.id===undefined) tableDescr.id = "id";
          // if this table name has been loaded, skip this one
          if(kshf.dt[tableDescr.name]!==undefined){
            this.incrementLoadedTableCount();
            return;
          }
          if(this.source.gdocId){
            this.loadTable_Google(tableDescr);
          } else {
            switch(this.source.fileType || tableDescr.fileType){
              case "json": this.loadTable_JSON(tableDescr); break;
              case "csv" :
              case "tsv" : this.loadTable_CSV(tableDescr); break;
            }
          }
        },this);
      } else {
        if(this.source.callback) this.source.callback(this);
      }
    },
    loadTable_Google: function(sheet){
      var me=this;
      var headers = sheet.headers ? sheet.headers : 1;
      var qString='https://docs.google.com/spreadsheet/tq?key='+this.source.gdocId+'&headers='+headers;
      if(sheet.sheetID){
        qString+='&gid='+sheet.sheetID;
      } else {
        qString+='&sheet='+sheet.name;
      }
      if(sheet.range){
        qString+="&range="+sheet.range;
      }

      var googleQuery = new google.visualization.Query(qString);
      if(sheet.query) googleQuery.setQuery(sheet.query);

      googleQuery.send( function(response){
        if(kshf.dt[sheet.name]){
          me.incrementLoadedTableCount();
          return;
        }
        if(response.isError()) {
          me.panel_overlay.select("div.status_text .info").text("Cannot load data");
          me.panel_overlay.select("span.spinner").selectAll("span").remove();
          me.panel_overlay.select("span.spinner").append('i').attr("class","fa fa-warning");
          me.panel_overlay.select("div.status_text .dynamic").text("("+response.getMessage()+")");
          return;
        }

        var j,r,i,arr=[],idIndex=-1,itemId=0;
        var dataTable = response.getDataTable();
        var numCols = dataTable.getNumberOfColumns();

        // find the index with sheet.id (idIndex)
        for(i=0; true ; i++){
          if(i===numCols || dataTable.getColumnLabel(i).trim()===sheet.id) {
            idIndex = i;
            break;
          }
        }

        var tmpTable=[];

        // create the column name tables
        for(j=0; j<dataTable.getNumberOfColumns(); j++){
          tmpTable.push(dataTable.getColumnLabel(j).trim());
        }

        // create the item array
        arr.length = dataTable.getNumberOfRows(); // pre-allocate for speed
        for(r=0; r<dataTable.getNumberOfRows() ; r++){
          var c={};
          for(i=0; i<numCols ; i++) {
            c[tmpTable[i]] = dataTable.getValue(r,i);
          }
          // push unique id as the last column if necessary
          if(c[sheet.id]===undefined) c[sheet.id] = itemId++;
          arr[r] = new kshf.Record(c,sheet.id);
        }

        me.finishDataLoad(sheet,arr);
      });
    },
    /** -- */
    loadTable_CSV: function(tableDescr){
      var me=this;

      if(kshf.dt[tableDescr.name]){
        me.incrementLoadedTableCount();
        return;
      }

      var config = {};
      config.dynamicTyping = true;
      config.header = true; // header setting can be turned off
      if(tableDescr.header===false) config.header = false;
      if(tableDescr.preview!==undefined) config.preview = tableDescr.preview;
      if(tableDescr.fastMode!==undefined) config.fastMode = tableDescr.fastMode;
      if(tableDescr.dynamicTyping!==undefined) config.dynamicTyping = tableDescr.dynamicTyping;

      var _i=0, arr = [], idColumn = tableDescr.id;
      config.chunk = function(_rows){
        _rows.data.forEach(function(row){
          if(row[idColumn]===undefined) row[idColumn] = _i++;
          arr.push(new kshf.Record(row,idColumn));
        });
      };
      config.complete = function(){
        me.finishDataLoad(tableDescr, arr);
      };

      if(tableDescr instanceof File){
        // Load using FileReader
        var reader = new FileReader();
        reader.onload = function(e) { Papa.parse(e.target.result,config); };
        reader.readAsText(tableDescr);
      } else {
        if(tableDescr.stream){
          // TODO: if there is a callback function, do it synchronously
          config.download = true;
          Papa.parse(
            this.source.dirPath+tableDescr.name+"."+this.source.fileType,
            config);
        } else {
          $.ajax({
            url: this.source.dirPath+tableDescr.name+"."+this.source.fileType,
            type: "GET",
            async: (this.source.callback===undefined)?true:false,
            contentType: "text/csv",
            success: function(data){
              Papa.parse(data,config);
            }
          });
        }
      }
    },
    /** Note: Requires json root to be an array, and each object will be passed to keshif item. */
    loadTable_JSON: function(tableDescr){
      var me = this;
      function processJSONText(data){
        // File may describe keshif config. Load from config file here!
        if(data.domID){
          me.options = data;
          me.loadSource(data.source);
          return;
        };
        // if data is already loaded, nothing else to do...
        if(kshf.dt[tableDescr.name]!==undefined){
          me.incrementLoadedTableCount();
          return;
        }
        var arr = [];
        var idColumn = tableDescr.id;

        data.forEach(function(dataItem,i){
          if(dataItem[idColumn]===undefined) dataItem[idColumn] = i;
          arr.push(new kshf.Record(dataItem, idColumn));
        });

        me.finishDataLoad(tableDescr, arr);
      };

      if(tableDescr instanceof File){
        // Load using FileReader
        var reader = new FileReader();
        reader.onload = function(e) { processJSONText( JSON.parse(e.target.result)); };
        reader.readAsText(tableDescr);
      } else {
        $.ajax({
          url: this.source.dirPath+tableDescr.name+".json?dl=0",
          type: "GET",
          async: (this.source.callback===undefined)?true:false,
          dataType: "json",
          success: processJSONText
        });
      }
    },
    /** -- */
    finishDataLoad: function(table,arr) {
      kshf.dt[table.name] = arr;
      var id_table = {};
      arr.forEach(function(record){id_table[record.id()] = record;});
      kshf.dt_id[table.name] = id_table;
      this.incrementLoadedTableCount();
    },
    /** -- */
    incrementLoadedTableCount: function(){
      var me=this;
      this.source.loadedTableCount++;
      this.panel_overlay.select("div.status_text .dynamic")
          .text("("+this.source.loadedTableCount+"/"+this.source.tables.length+")");

      if(this.source.loadedTableCount===this.source.tables.length) {
        if(this.source.callback){
          this.source.callback(this);
        } else {
          this.loadCharts();
        }
      }
    },
    /** -- */
    loadCharts: function(){
      if(this.primaryTableName===undefined){
        alert("Cannot load keshif. Please define primaryTableName.");
        return;
      }
      this.records = kshf.dt[this.primaryTableName];
      this.records.forEach(function(r){ this.allRecordsAggr.addRecord(r); },this);
      
      if(this.recordName==="") this.recordName = this.primaryTableName;

      var me=this;
      this.panel_overlay.select("div.status_text .info").text(kshf.lang.cur.CreatingBrowser);
      this.panel_overlay.select("div.status_text .dynamic").text("");
      window.setTimeout(function(){ me._loadCharts(); }, 50);
    },
    /** -- */
    _loadCharts: function(){
        var me=this;

        if(typeof Helpin !== 'undefined'){
          helpin = new Helpin(this);
        }

        if(this.onLoad) this.onLoad.call(this);

        // Create a summary for each existing column in the data
        for(var column in this.records[0].data){
          if(typeof(column)==="string") this.createSummary(column);
        }

        // Should do this here, because bottom panel width calls for browser width, and this reads the browser width...
        this.updateWidth_Total();

        if(this.options.summaries) this.options.facets = this.options.summaries;
        this.options.facets = this.options.facets || [];

        this.options.facets.forEach(function(facetDescr){
          // String -> resolve to name
          if(typeof facetDescr==="string"){
            facetDescr = {name: facetDescr};
          }

          // **************************************************
          // API compability - process old keys
          if(facetDescr.title){
            facetDescr.name = facetDescr.title;
          }
          if(facetDescr.sortingOpts){
            facetDescr.catSortBy = facetDescr.sortingOpts
          }
          if(facetDescr.layout){
            facetDescr.panel = facetDescr.layout;
          }
          if(facetDescr.intervalScale){
            facetDescr.scaleType = facetDescr.intervalScale;
          }

          if(typeof(facetDescr.value)==="string"){
            // it may be a function definition if so, evaluate
            if(facetDescr.value.substr(0,8)==="function"){
              eval("\"use strict\"; facetDescr.value = "+facetDescr.value);
            }
          }

          if( facetDescr.catLabel || facetDescr.catTooltip || facetDescr.catSplit ||
              facetDescr.catTableName || facetDescr.catSortBy || facetDescr.catMap){
            facetDescr.type="categorical";
          } else if(facetDescr.scaleType || facetDescr.showPercentile || facetDescr.unitName || facetDescr.timeFormat ){
            facetDescr.type="interval";
          }

          var summary = this.summaries_by_name[facetDescr.name];
          if(summary===undefined){
            if(typeof(facetDescr.value)==="string"){
              var summary = this.summaries_by_name[facetDescr.value];
              if(summary===undefined){
                summary = this.createSummary(facetDescr.value);
              }
              summary = this.changeSummaryName(facetDescr.value,facetDescr.name);
            } else if(typeof(facetDescr.value)==="function"){
              summary = this.createSummary(facetDescr.name,facetDescr.value,facetDescr.type);
            } else {
              return;
            }
          } else {
            if(facetDescr.value){
              summary.destroy();
              summary = this.createSummary(facetDescr.name,facetDescr.value,facetDescr.type);
            }
          }

          if(facetDescr.type){
            facetDescr.type = facetDescr.type.toLowerCase();
            if(facetDescr.type!==summary.type){
              summary.destroy();
              if(facetDescr.value===undefined){
                facetDescr.value = facetDescr.name;
              }
              if(typeof(facetDescr.value)==="string"){
                summary = this.createSummary(facetDescr.value,null,facetDescr.type);
                if(facetDescr.value!==facetDescr.name)
                  this.changeSummaryName(facetDescr.value,facetDescr.name);
              } else if(typeof(facetDescr.value)==="function"){
                summary = this.createSummary(facetDescr.name,facetDescr.value,facetDescr.type);
              }
            }
          }
          // If summary object is not found/created, nothing else to do
          if(summary===undefined) return;

          if(facetDescr.catSplit){
            summary.setCatSplit(facetDescr.catSplit);
          }
          if(facetDescr.timeFormat){
            summary.setTimeFormat(facetDescr.timeFormat);
          }

          summary.initializeAggregates();

          // Common settings
          if(facetDescr.collapsed){
            summary.setCollapsed(true);
          }
          if(facetDescr.description) {
            summary.setDescription(facetDescr.description);
          }

          // THESE AFFECT HOW CATEGORICAL VALUES ARE MAPPED
          if(summary.type==='categorical'){
            if(facetDescr.catTableName){
              summary.setCatTable(facetDescr.catTableName);
            }
            if(facetDescr.catLabel){
              // if this is a function definition, evaluate it
              if(typeof facetDescr.catLabel === "string" && facetDescr.catLabel.substr(0,8)==="function"){
                eval("\"use strict\"; facetDescr.catLabel = "+facetDescr.catLabel);
              }
              summary.setCatLabel(facetDescr.catLabel);
            }
            if(facetDescr.catTooltip){
              summary.setCatTooltip(facetDescr.catTooltip);
            }
            if(facetDescr.catMap){
              summary.setCatGeo(facetDescr.catMap);
            }
            if(facetDescr.minAggrValue) {
              summary.setMinAggrValue(facetDescr.minAggrValue);
            }
            if(facetDescr.catSortBy!==undefined){
              summary.setSortingOptions(facetDescr.catSortBy);
            }

            if(facetDescr.panel!=="none"){
              facetDescr.panel = facetDescr.panel || 'left';
              summary.addToPanel(this.panels[facetDescr.panel]);
            }

            if(facetDescr.viewAs){
              summary.viewAs(facetDescr.viewAs);
            }
          }

          if(summary.type==='interval'){
            if(typeof facetDescr.unitName === "string") summary.setUnitName(facetDescr.unitName);
            if(facetDescr.showPercentile) {
              summary.showPercentileChart(facetDescr.showPercentile);
            }
            summary.optimumTickWidth = facetDescr.optimumTickWidth || summary.optimumTickWidth;

            // add to panel before you set scale type and other options: TODO: Fix
            if(facetDescr.panel!=="none"){
              facetDescr.panel = facetDescr.panel || 'left';
              summary.addToPanel(this.panels[facetDescr.panel]);
            }

            if(facetDescr.scaleType) {
              summary.setScaleType(facetDescr.scaleType,true);
            }
          }
        },this);

        this.panels.left.updateWidth_MeasureLabel();
        this.panels.right.updateWidth_MeasureLabel();
        this.panels.middle.updateWidth_MeasureLabel();

        this.recordDisplay = new kshf.RecordDisplay(this,this.options.recordDisplay||{});

        if(this.options.measure){
          this.setMeasureFunction(this.summaries_by_name[this.options.measure],"Sum");
        }

        this.DOM.recordName.html(this.recordName);

        if(this.source.url){
          this.DOM.datasource.style("display","inline-block").attr("href",this.source.url);
        }

        this.checkBrowserZoomLevel();

        this.loaded = true;

        var x = function(){
          var totalWidth = this.divWidth;
          var colCount = 0;
          if(this.panels.left.summaries.length>0){
            totalWidth-=this.panels.left.width_catLabel+kshf.scrollWidth+this.panels.left.width_catMeasureLabel;
            colCount++;
          }
          if(this.panels.right.summaries.length>0){
            totalWidth-=this.panels.right.width_catLabel+kshf.scrollWidth+this.panels.right.width_catMeasureLabel;
            colCount++;
          }
          if(this.panels.middle.summaries.length>0){
            totalWidth-=this.panels.middle.width_catLabel+kshf.scrollWidth+this.panels.middle.width_catMeasureLabel;
            colCount++;
          }
          return Math.floor((totalWidth)/8);
        };
        var defaultBarChartWidth = x.call(this);

        this.panels.left.setWidthCatBars(this.options.barChartWidth || defaultBarChartWidth);
        this.panels.right.setWidthCatBars(this.options.barChartWidth || defaultBarChartWidth);
        this.panels.middle.setWidthCatBars(this.options.barChartWidth || defaultBarChartWidth);
        this.panels.bottom.updateSummariesWidth(this.options.barChartWidth || defaultBarChartWidth);

        this.updateMiddlePanelWidth();

        this.refresh_filterClearAll();

        this.records.forEach(function(record){ record.updateWanted(); });
        this.update_Records_Wanted_Count();

        this.updateAfterFilter();

        this.updateLayout_Height();

        // hide overlay
        this.panel_overlay.attr("show","none");

        this.reorderNuggetList();

        if(this.recordDisplay.displayType==='nodelink'){
          this.recordDisplay.initializeNetwork();
        }

        if(this.onReady) this.onReady();

        this.finalized = true;

        setTimeout(function(){ 
          if(me.options.enableAuthoring) me.enableAuthoring(true);
          if(me.recordDisplay.displayType==='map'){
            setTimeout(function(){ 
              me.recordDisplay.map_zoomToActive();
            }, 1000);
          }
          me.setNoAnim(false);
        },1000);
    },
    /** -- */
    unregisterBodyCallbacks: function(){
      // TODO: Revert to previous handlers...
      d3.select("body").style('cursor','auto')
        .on("mousemove",null)
        .on("mouseup",null)
        .on("keydown",null);
    },
    /** -- */
    prepareDropZones: function(summary,source){
      this.movedSummary = summary;
      this.showDropZones = true;
      this.DOM.root
        .attr("showdropzone",true)
        .attr("dropattrtype",summary.getDataType())
        .attr("dropSource",source);
      this.DOM.attribDragBox.style("display","block").html(summary.summaryName);
    },
    /** -- */
    clearDropZones: function(){
      this.showDropZones = false;
      this.unregisterBodyCallbacks();
      this.DOM.root.attr("showdropzone",null);
      this.DOM.attribDragBox.style("display","none");
      this.movedSummary = undefined;
    },
    /** -- */
    reorderNuggetList: function(){
      this.summaries = this.summaries.sort(function(a,b){
        var a_cat = a instanceof kshf.Summary_Categorical;
        var b_cat = b instanceof kshf.Summary_Categorical;
        if(a_cat && !b_cat) return -1;
        if(!a_cat && b_cat) return 1;
        if(a_cat && b_cat && a._cats && b._cats){ 
          return a._cats.length - b._cats.length;
        }
        return a.summaryName.localeCompare(b.summaryName, { sensitivity: 'base' });
      });

      this.DOM.attributeList.selectAll(".nugget")
        .data(this.summaries, function(summary){return summary.summaryID;}).order();
    },
    /** -- */
    autoCreateBrowser: function(){
      this.summaries.forEach(function(summary,i){
        if(summary.uniqueCategories()) return;
        if(summary.type==="categorical" && summary._cats.length>1000) return;
        if(summary.panel) return;
        this.autoAddSummary(summary);
        this.updateLayout_Height();
      },this);
      this.updateLayout();
    },
    /** -- */
    autoAddSummary: function(summary){
      if(summary.uniqueCategories()){
        this.recordDisplay.setRecordViewSummary(summary);
        if(this.recordDisplay.textSearchSummary===null) 
          this.recordDisplay.setTextSearchSummary(summary);
        return;
      }
      var target_panel;
      if(summary.isTimeStamp()) {
        target_panel = 'bottom';
      } else if(summary.type==='categorical') {
        target_panel = 'left';
        if(this.panels.left.summaries.length>Math.floor(this.panels.left.height/150)) target_panel = 'middle';
      } else if(summary.type==='interval') {
        target_panel = 'right';
        if(this.panels.right.summaries.length>Math.floor(this.panels.right.height/150)) target_panel = 'middle';
      }
      summary.addToPanel(this.panels[target_panel]);
    },
    /** -- */
    saveFilterSelection: function(){
      var sumName="<i class='fa fa-floppy-o'></i> Saved Selections";
      var summary = this.summaries_by_name[sumName];
      if(summary===undefined){
        summary = this.createSummary(sumName,null,"categorical");
        summary.setCatLabel("name");
        summary.setCatTooltip("name");
        summary.addToPanel(this.panels.middle);
      }

      var longName = "";
      this.filters.forEach(function(filter){
        if(!filter.isFiltered) return;
        longName+="<b>"+filter.summary.summaryName+"</b>: "
          + filter.summary.summaryFilter.filterView_Detail.call(filter.summary.summaryFilter)+" ";
      });

      var aggr = new kshf.Aggregate();
      var catId = summary._cats.length;
      aggr.init({ id: catId, name: longName},"id");
      aggr.summary = summary;
      this.allAggregates.push(aggr);

      var multiValued_New = false;
      this.records.forEach(function(record){ 
        if(!record.isWanted) return;

        var record_valueCache = record._valueCache[summary.summaryID];

        if(record_valueCache===null){
          record_valueCache = [];
          record._valueCache[summary.summaryID] = record_valueCache;
          summary.missingValueAggr.removeRecord(record);
        } else {
          // the record is listed under multiple aggregates (saved selections)
          multiValued_New = true;
        }

        record_valueCache.push(catId);
        aggr.addRecord(record);
      });

      if(!summary.isMultiValued && multiValued_New){
        // now summary has multiple values
        summary.DOM.root.attr("isMultiValued",true);
        summary.isMultiValued = true;
      }
      if(summary.setSummary){
        // TODO: Adjust set summary based on the new aggregate (category)

      }

      summary.catTable_id[aggr.id()] = aggr;
      summary._cats.push(aggr);

      if(summary._cats.length===1){
        summary.init_DOM_Cat();
      }

      summary.updateCats();
      summary.insertCategories();

      if(summary.catSortBy.length===0) summary.setSortingOptions();
      summary.catSortBy_Active.no_resort = false;

      summary.updateCatSorting(0,true,true);
      summary.refreshLabelWidth();
      summary.refreshViz_Nugget();

      this.updateLayout_Height();
    },
    /** -- */
    clearFilters_All: function(force){
      var me=this;
      if(this.skipSortingFacet){
        // you can now sort the last filtered summary, attention is no longer there.
        this.skipSortingFacet.dirtySort = false;
        this.skipSortingFacet.DOM.catSortButton.attr("resort",false);
      }
      // clear all registered filters
      this.filters.forEach(function(filter){ filter.clearFilter(false); })
      if(force!==false){
        this.records.forEach(function(record){ 
          if(!record.isWanted) record.updateWanted(); // Only update records which were not wanted before.
        });
        this.update_Records_Wanted_Count();
        this.refresh_filterClearAll();
        this.updateAfterFilter(); // more results
      }
      setTimeout( function(){ me.updateLayout_Height(); }, 1000); // update layout after 1.75 seconds
    },
    /** -- */
    refresh_ActiveRecordCount: function(){
      if(this.allRecordsAggr.recCnt.Active===0){
        this.DOM.activeRecordMeasure.html("No"); return;
      }
      var numStr = this.allRecordsAggr.measure('Active').toLocaleString();
      if(this.measureSummary) numStr = this.measureSummary.printWithUnitName(numStr);
      this.DOM.activeRecordMeasure.html(numStr);
    },
    /** -- */
    update_Records_Wanted_Count: function(){
      this.recordsWantedCount = 0;
      this.records.forEach(function(record){ if(record.isWanted) this.recordsWantedCount++; },this);
      this.refreshTotalViz();
      this.refresh_ActiveRecordCount();
    },
    /** -- */
    updateAfterFilter: function(){
      kshf.browser = this;
      this.clearSelect_Compare('A',true);
      this.clearSelect_Compare('B',true);
      this.clearSelect_Compare('C',true);
      this.summaries.forEach(function(summary){ summary.updateAfterFilter(); });
      this.recordDisplay.updateAfterFilter();
    },
    /** -- */
    isFiltered: function(){
      return this.filters.filter(function(filter){ return filter.isFiltered; }).length > 0;
    },
    /** -- */
    refresh_filterClearAll: function(){
      this.DOM.filterClearAll.attr("active", this.isFiltered());
      this.DOM.saveSelection.attr("active", this.isFiltered());
    },
    /** Ratio mode is when glyphs scale to their max */
    setScaleMode: function(how){
      this.ratioModeActive = how;
      this.DOM.root.attr("relativeMode",how?how:null);
      this.setPercentLabelMode(how);
      this.summaries.forEach(function(summary){ summary.refreshViz_All(); });
      this.refreshMeasureLabels();
      this.refreshTotalViz();
    },
    /** -- */
    showScaleModeControls: function(how){
      this.DOM.root.attr("showScaleModeControls",how?how:null);
    },
    /** -- */
    refreshMeasureLabels: function(t){
      this.measureLabelType = t;
      this.DOM.root.attr("measureLabelType",this.measureLabelType ? this.measureLabelType : null)
      this.summaries.forEach(function(summary){ summary.refreshMeasureLabel(); });
    },
    /** -- */
    setPercentLabelMode: function(how){
      this.percentModeActive = how;
      this.DOM.root.attr("percentLabelMode",how?"true":null);
      this.summaries.forEach(function(summary){
        if(!summary.inBrowser()) return;
        summary.refreshMeasureLabel();
        if(summary.viewType==='map'){
          summary.refreshMapColorScaleBounds();
        }
        summary.refreshViz_Axis();
      });
    },
    /** -- */
    clearSelect_Compare: function(cT){
      var ccT = "Compare_"+cT;
      this.DOM.root.attr("select"+ccT,null);
      this.vizActive[ccT] = false;
      if(this.selectedAggr[ccT]){
        this.selectedAggr[ccT].clearCompare(cT);
        this.selectedAggr[ccT] = null;
      }
      this.allAggregates.forEach(function(aggr){ 
        aggr._measure[ccT] = 0;
        aggr.recCnt[ccT] = 0;
      });
      this.summaries.forEach(function(summary){ summary.refreshViz_Compare_All(); });

      this["crumb_"+ccT].removeCrumb();

      this.recordDisplay.refreshViz_Compare_All();
    },
    /** -- */
    setSelect_Compare: function(noReclick, _copy){
      var selAggregate = this.selectedAggr.Highlight;

      if(selAggregate.compared){
        var x=selAggregate.compared;
        this.clearSelect_Compare(selAggregate.compared, true);
        if(noReclick){
          this["crumb_Compare_"+x].removeCrumb(); 
          return;
        }
      }

      var cT = "A";
      if(this.vizActive.Compare_A) cT = this.vizActive.Compare_B ? "C" : "B";

      var compId = "Compare_"+cT;

      if(_copy){
        // Copy selected summary and records from highlight selection
        this['flexAggr_'+compId].records = this.selectedAggr.Highlight.records;
        this['flexAggr_'+compId].summary = this.selectedAggr.Highlight.summary;
        selAggregate = this['flexAggr_'+compId];
      }

      this.vizActive[compId] = true;
      this.DOM.root.attr("select"+compId,true);
      this.selectedAggr[compId] = selAggregate;
      this.selectedAggr[compId].selectCompare(cT);

      // Copy aggregate measures from highlight selection to compare selection
      if(!this.preview_not){
        this.allAggregates.forEach(function(aggr){
          aggr._measure[compId] = aggr._measure.Highlight;
          aggr.recCnt[compId] = aggr.recCnt.Highlight;
        },this);
      } else {
        this.allAggregates.forEach(function(aggr){
          aggr._measure[compId] = aggr._measure.Active - aggr._measure.Highlight;
          aggr.recCnt[compId] = aggr.recCnt.Active - aggr.recCnt.Highlight;
        },this);
      }

      // Done
      this.summaries.forEach(function(summary){ 
        if(this.measureFunc==="Avg" && summary.updateChartScale_Measure){
          // refreshes all visualizations automatically
          summary.updateChartScale_Measure();
        } else {
          summary.refreshViz_Compare_All();
        }
      },this);

      this.refreshTotalViz();

      this["crumb_"+compId].showCrumb(selAggregate.summary);

      return cT;
    },
    /** -- */
    clearSelect_Highlight: function(now){
      var me = this;
      this.vizActive.Highlight = false;
      this.DOM.root.attr("selectHighlight",null);
      this.highlightSelectedSummary = null;
      if(this.selectedAggr.Highlight){
        this.selectedAggr.Highlight.clearHighlight();
        this.selectedAggr.Highlight = undefined;
      }

      this.allAggregates.forEach(function(aggr){
        aggr._measure.Highlight = 0;
        aggr.recCnt.Highlight = 0;
      });
      this.summaries.forEach(function(summary){ summary.refreshViz_Highlight(); });
      this.refreshTotalViz();

      // if the crumb is shown, start the hide timeout
      if(this.highlightCrumbTimeout_Hide) clearTimeout(this.highlightCrumbTimeout_Hide);
      this.highlightCrumbTimeout_Hide = setTimeout(function(){ 
        me.crumb_Highlight.removeCrumb();
        this.highlightCrumbTimeout_Hide = undefined;
      },now?0:1000);
    },
    /** -- */
    setSelect_Highlight: function(selAggregate){
      var me=this;
      if(selAggregate===undefined){
        selAggregate = this.flexAggr_Highlight; // flexible aggregate
      }
      this.vizActive.Highlight = true;
      this.DOM.root.attr("selectHighlight",true);
      this.highlightSelectedSummary = selAggregate.summary;
      this.selectedAggr.Highlight = selAggregate;
      this.selectedAggr.Highlight.selectHighlight();

      this.summaries.forEach(function(summary){ summary.refreshViz_Highlight(); });
      this.refreshTotalViz();

      clearTimeout(this.highlightCrumbTimeout_Hide);
      this.highlightCrumbTimeout_Hide = undefined;

      this.crumb_Highlight.showCrumb(selAggregate.summary);
    },
    /** -- */
    getMeasureFuncTypeText: function(){
      return this.measureSummary ? 
        (((this.measureFunc==="Sum")?"Total ":"Average ")+this.measureSummary.summaryName+" of ") : "";
    },
    /** funType: "Sum" or "Avg" */
    setMeasureFunction: function(summary, funcType){
      if(summary===undefined || summary.type!=='interval' || summary.scaleType==='time'){
        // Clearing measure summary (defaulting to count)
        if(this.measureSummary===undefined) return; // No update
        this.measureSummary = undefined;
        this.records.forEach(function(record){ record.measure_Self = 1; });
        this.measureFunc = "Count";
      } else {
        if(this.measureSummary===summary && this.measureFunc===funcType) return; // No update
        this.measureSummary = summary;
        this.measureFunc = funcType;
        summary.initializeAggregates();
        this.records.forEach(function(record){ record.measure_Self = summary.getRecordValue(record); });
      }

      this.DOM.measureFuncType.html(this.getMeasureFuncTypeText());

      this.DOM.root.attr("measureFunc",this.measureFunc);

      if(this.measureFunc==="Avg"){
        // Remove ratio and percent modes
        if(this.ratioModeActive){ this.setScaleMode(false); }
        if(this.percentModeActive){ this.setPercentLabelMode(false); }
      }

      this.allAggregates.forEach(function(aggr){ aggr.resetAggregateMeasures(); });
      this.summaries.forEach(function(summary){ summary.updateAfterFilter(); });
      this.update_Records_Wanted_Count();

      // measure labels need to be updated in all cases, numbers might change, unit names may be added...
      this.panels.left.updateWidth_MeasureLabel();
      this.panels.right.updateWidth_MeasureLabel();
      this.panels.middle.updateWidth_MeasureLabel();
      this.panels.bottom.updateWidth_MeasureLabel();
    },
    /** -- */
    checkBrowserZoomLevel: function(){
      // Using devicePixelRatio works in Chrome and Firefox, but not in Safari
      // I have not tested IE yet.
      if(window.devicePixelRatio!==undefined){
        if(window.devicePixelRatio!==1 && window.devicePixelRatio!==2){
          var me=this;
          setTimeout(function(){
            me.showWarning("Please reset your browser zoom level for the best experience.")
          },1000);
        } else {
          this.hideWarning();
        }
      } else {
        this.hideWarning();
      }
    },
    /** -- */
    updateLayout: function(){
      if(this.loaded!==true) return;
      this.updateWidth_Total();
      this.updateLayout_Height();
      this.updateMiddlePanelWidth();
      this.refreshTotalViz();
    },
    /** -- */
    updateLayout_Height: function(){
        var me=this;
        var divHeight_Total = parseInt(this.DOM.root.style("height"));

        var panel_Basic_height = Math.max(parseInt(this.DOM.panel_Basic.style("height")),24)+6;

        divHeight_Total-=panel_Basic_height;

        // initialize all summaries as not yet processed.
        this.summaries.forEach(function(summary){ if(summary.inBrowser()) summary.heightProcessed = false; });

        var bottomPanelHeight=0;
        // process bottom summary
        if(this.panels.bottom.summaries.length>0){
          var targetHeight=divHeight_Total/3;
          // they all share the same target height
          this.panels.bottom.summaries.forEach(function(summary){
            targetHeight = Math.min(summary.getHeight_RangeMax(),targetHeight);
            summary.setHeight(targetHeight);
            summary.heightProcessed = true;
            bottomPanelHeight += summary.getHeight();
          });
        }

        var doLayout = function(sectionHeight,summaries){
          sectionHeight-=1;// just use 1-pixel gap
          var finalPass = false;
          var lastRound = false;

          var processedFacets=0;
          summaries.forEach(function(summary){ if(summary.heightProcessed) processedFacets++; });

          while(true){
            var remainingFacetCount = summaries.length-processedFacets;
            if(remainingFacetCount===0) break;
            var processedFacets_pre = processedFacets;
            function finishSummary(summary){
              sectionHeight-=summary.getHeight();
              summary.heightProcessed = true;
              processedFacets++;
              remainingFacetCount--;
            };
            summaries.forEach(function(summary){
              if(summary.heightProcessed) return;
              // Empty or collapsed summaries: Fixed height, nothing to change;
              if(summary.isEmpty() || summary.collapsed) {
                finishSummary(summary);
                return;
              }
              // in last round, if summary can expand, expand it further
              if(lastRound===true && summary.heightProcessed && summary.getHeight_RangeMax()>summary.getHeight()){
                sectionHeight+=summary.getHeight();
                summary.setHeight(sectionHeight);
                sectionHeight-=summary.getHeight();
                return;
              }
              if(remainingFacetCount===0) return;

              // Fairly distribute remaining size across all remaining summaries.
              var targetHeight = Math.floor(sectionHeight/remainingFacetCount);

              // auto-collapse summary if you do not have enough space
              if(finalPass && targetHeight<summary.getHeight_RangeMin()){
                summary.setCollapsed(true);
                finishSummary(summary);
                return;
              }
              if(summary.getHeight_RangeMax()<=targetHeight){
                summary.setHeight(summary.getHeight_RangeMax());
                finishSummary(summary);
              } else if(finalPass){
                summary.setHeight(targetHeight);
                finishSummary(summary);
              }
            },this);
            finalPass = processedFacets_pre===processedFacets;
            if(lastRound===true) break;
            if(remainingFacetCount===0) lastRound = true;
          }
          return sectionHeight;
        };

        var topPanelsHeight = divHeight_Total;
        this.panels.bottom.DOM.root.style("height",bottomPanelHeight+"px");

        topPanelsHeight-=bottomPanelHeight;
        this.DOM.panelsTop.style("height",topPanelsHeight+"px");

        // Left Panel
        if(this.panels.left.summaries.length>0){
            this.panels.left.height = topPanelsHeight;
            doLayout.call(this,topPanelsHeight,this.panels.left.summaries);
        }
        // Right Panel
        if(this.panels.right.summaries.length>0){
            this.panels.right.height = topPanelsHeight;
            doLayout.call(this,topPanelsHeight,this.panels.right.summaries);
        }
        // Middle Panel
        var midPanelHeight = 0;
        if(this.panels.middle.summaries.length>0){
            var panelHeight = topPanelsHeight;
            if(this.recordDisplay.recordViewSummary){
                panelHeight -= 200; // give 200px fo the list display
            } else {
                panelHeight -= this.recordDisplay.DOM.root[0][0].offsetHeight;
            }
            midPanelHeight = panelHeight - doLayout.call(this,panelHeight, this.panels.middle.summaries);
        }
        this.panels.middle.DOM.root.style("height",midPanelHeight+"px");

        // The part where summary DOM is updated
        this.summaries.forEach(function(summary){ if(summary.inBrowser()) summary.refreshHeight(); });

        if(this.recordDisplay){
          // get height of header
          var listDisplayHeight = divHeight_Total
            - this.recordDisplay.DOM.recordDisplayHeader[0][0].offsetHeight 
            - midPanelHeight 
            - bottomPanelHeight;
          if(this.showDropZones && this.panels.middle.summaries.length===0) listDisplayHeight*=0.5;
          this.recordDisplay.setHeight(listDisplayHeight);
        }
    },
    /** -- */
    updateMiddlePanelWidth: function(){
      // for some reason, on page load, this variable may be null. urgh.
      var widthMiddlePanel = this.getWidth_Browser();
      var marginLeft = 0;
      var marginRight = 0;
      if(this.panels.left.summaries.length>0){
        marginLeft=2;
        widthMiddlePanel-=this.panels.left.getWidth_Total()+2;
      }
      if(this.panels.right.summaries.length>0){
        marginRight=2;
        widthMiddlePanel-=this.panels.right.getWidth_Total()+2;
      }
      this.panels.left.DOM.root.style("margin-right",marginLeft+"px")
      this.panels.right.DOM.root.style("margin-left",marginRight+"px")
      this.panels.middle.setTotalWidth(widthMiddlePanel);
      this.panels.middle.updateSummariesWidth();
      this.panels.bottom.setTotalWidth(this.divWidth);
      this.panels.bottom.updateSummariesWidth();

      this.DOM.middleColumn.style("width",widthMiddlePanel+"px");

      if(this.recordDisplay) this.recordDisplay.refreshWidth(widthMiddlePanel);
    },
    /** -- */
    getTickLabel: function(_val){
      if((this.measureFunc==="Count") || (this.measureFunc==="Sum" && !this.measureSummary.hasFloat)){
        _val = Math.round(_val);
      }
      if(this.ratioModeActive || this.percentModeActive){
        return _val.toFixed(0)+"<span class='unitName'>%</span>";
      } else if(this.measureSummary){
        // Print with the measure summary unit
        return this.measureSummary.printWithUnitName(kshf.Util.formatForItemCount(_val));
      } else {
        return kshf.Util.formatForItemCount(_val);
      }
    },
    /** -- */
    getMeasureLabel: function(aggr,summary){
      var _val;
      if(!(aggr instanceof kshf.Aggregate)){
        _val = aggr;
      } else {
        //if(!aggr.isVisible) return "";
        if(this.measureLabelType){
          _val = aggr.measure(this.measureLabelType);
        } else {
          if(summary && summary === this.highlightSelectedSummary && !summary.isMultiValued){
            _val = aggr.measure('Active');
          } else {
            _val = this.vizActive.Highlight?
              (this.preview_not? aggr._measure.Active - aggr._measure.Highlight : aggr.measure('Highlight') ) :
              aggr.measure('Active');
          }
        }
        if(this.percentModeActive){
          // Cannot be Avg-function
          if(aggr._measure.Active===0) return "";
          if(this.ratioModeActive){
            if(this.measureLabelType===undefined && !this.vizActive.Highlight) return "";
            _val = 100*_val/aggr._measure.Active;
          } else {
            _val = 100*_val/this.allRecordsAggr._measure.Active;
          }
        }
      }

      if(this.measureFunc!=="Count"){ // Avg or Sum
        _val = Math.round(_val);
      }

      if(this.percentModeActive){
        if(aggr.DOM && aggr.DOM.aggrGlyph.nodeName==="g"){
          return _val.toFixed(0)+"%";
        } else {
          return _val.toFixed(0)+"<span class='unitName'>%</span>";
        }
      } else if(this.measureSummary){
        // Print with the measure summary unit
        return this.measureSummary.printWithUnitName(kshf.Util.formatForItemCount(
          _val),(aggr.DOM && aggr.DOM.aggrGlyph.nodeName==="g") );
      } else {
        return kshf.Util.formatForItemCount(_val);
      }
    },
    /** -- */
    exportConfig: function(){
      var config = {};
      config.domID = this.domID;
      config.recordName = this.recordName;
      config.source = this.source;
      delete config.source.loadedTableCount;
      config.summaries = [];
      config.leftPanelLabelWidth = this.panels.left.width_catLabel;
      config.rightPanelLabelWidth = this.panels.right.width_catLabel;
      config.middlePanelLabelWidth = this.panels.middle.width_catLabel;

      if(typeof this.onLoad === "function"){
        config.onLoad = this.onLoad.toString();
      }

      if(typeof this.onReady === "function"){
        config.onReady = this.onReady.toString();
      }

      ['left', 'right', 'middle', 'bottom'].forEach(function(p){
        // Need to export summaries in-order of the panel appearance
        // TODO: Export summaries not within browser...
        this.panels[p].summaries.forEach(function(summary){
          config.summaries.push(summary.exportConfig());
        });
      },this);
      if(this.recordDisplay.recordViewSummary){
        config.recordDisplay = this.recordDisplay.exportConfig();
      }
      return config;
    }
};



// ***********************************************************************************************************
// ***********************************************************************************************************

kshf.Summary_Base = function(){}
kshf.Summary_Base.prototype = {
  initialize: function(browser,name,attribFunc){
    this.summaryID = browser.summaryCount++;
    this.browser = browser;

    this.summaryName   = name;
    this.summaryColumn = attribFunc?null:name;
    this.summaryFunc   = attribFunc || function(){ return this[name]; };

    this.missingValueAggr = new kshf.Aggregate_EmptyRecords();
    this.missingValueAggr.init();
    this.missingValueAggr.summary = this;
    this.browser.allAggregates.push(this.missingValueAggr);

    this.DOM = { inited: false};

    if(kshf.Summary_Set && this instanceof kshf.Summary_Set) return;

    this.chartScale_Measure = d3.scale.linear().clamp(true);

    this.records = this.browser.records;
    if(this.records===undefined||this.records===null||this.records.length===0){
      alert("Error: Browser.records is not defined...");
      return;
    }

    this.isRecordView = false;
    this.collapsed = false;
    this.aggr_initialized = false;

    this.createSummaryFilter();

    this.insertNugget();
  },
  /** -- */
  setSummaryName: function(name){
    this.summaryName = name;
    // Refresh all the UI components which reflect summary name
    if(this.DOM.summaryName_text){
      this.DOM.summaryName_text.html(this.summaryName);
    }
    if(this.summaryFilter.filterCrumb.DOM !== null){
      this.summaryFilter.filterCrumb.DOM.select(".crumbHeader").html(this.summary.summaryName);
    }
    if(this.browser.recordDisplay){
      if(this.sortingSummary) this.browser.recordDisplay.refreshSortingOptions();
    }
    if(this.isTextSearch){
      this.browser.recordDisplay.DOM.recordTextSearch.select("input")
        .attr("placeholder",kshf.lang.cur.Search+": "+this.summaryName);
    }
    if(this.DOM.nugget){
      this.DOM.nugget.select(".summaryName").html(this.summaryName);
      this.DOM.nugget.attr("state",function(summary){
        if(summary.summaryColumn===null) return "custom"; // calculated
        if(summary.summaryName===summary.summaryColumn) return "exact";
        return "edited";
      });
    }
  },
  /** -- */
  getDataType: function(){
    if(this.type==='categorical') {
      var str="categorical";
      if(!this.aggr_initialized) return str+=" uninitialized";
      if(this.uniqueCategories()) str+=" unique";
      str+=this.isMultiValued?" multivalue":" singlevalue";
      return str;
    }
    if(this.type==='interval') {
      if(!this.aggr_initialized) return str+=" uninitialized";
      if(this.isTimeStamp()) return "interval time";
      return "interval numeric";
      //
      if(this.hasFloat) return "floating";
      return "integer";
    }
    return "?";
  },
  /** -- */
  inBrowser: function(){
    return this.panel!==undefined;
  },
  /** -- */
  isTimeStamp: function(){
    return false; // False by default
  },
  /** -- */
  clearDOM: function(){
    var dom = this.DOM.root[0][0];
    dom.parentNode.removeChild(dom);
  },
  /** -- */
  getWidth: function(){
    return this.panel.getWidth_Total();
  },
  /** -- */
  getHeight: function(){
    return this.getHeight_Header() + ( (this.collapsed || this.isEmpty()) ? 0 : this.getHeight_Content() );
  },
  /** -- */
  getHeight_Header: function(){
    if(!this.DOM.inited) return 0;
    if(this._height_header==undefined) {
      this._height_header = this.DOM.headerGroup[0][0].offsetHeight;
    }
    return this._height_header;
  },
  /** -- */
  uniqueCategories: function(){
    if(this.browser && this.browser.records[0].idIndex===this.summaryName) return true;
    return false;
  },
  /** -- */
  isFiltered: function(){
    return this.summaryFilter.isFiltered;
  },
  /** -- */
  isEmpty: function(){
    alert("Nope. Sth is wrong."); // should not be executed
    return true;
  },
  /** -- */
  getFuncString: function(){
    var str=this.summaryFunc.toString();
    // replace the beginning, and the end
    return str.replace(/function\s*\(\w*\)\s*{\s*/,"").replace(/}$/,"");
  },
  /** -- */
  addToPanel: function(panel, index){
    if(index===undefined) index = panel.summaries.length; // add to end
    if(this.panel===undefined){
      this.panel = panel;
    } else if(this.panel && this.panel!==panel){
      this.panel.removeSummary(this);
      this.panel = panel;
    } else{ // this.panel === panel
      var curIndex;
      // this.panel is the same as panel...
      this.panel.summaries.forEach(function(s,i){ if(s===this) curIndex = i; },this);
      // inserting the summary to the same index as current one
      if(curIndex===index) return;
      var toRemove=this.panel.DOM.root.selectAll(".dropZone_between_wrapper")[0][curIndex];
      toRemove.parentNode.removeChild(toRemove);
    }
    var beforeDOM = this.panel.DOM.root.selectAll(".dropZone_between_wrapper")[0][index];
    if(this.DOM.root){
      this.DOM.root.style("display","");
      panel.DOM.root[0][0].insertBefore(this.DOM.root[0][0],beforeDOM);
    } else {
      this.initDOM(beforeDOM);
    }
    panel.addSummary(this,index);
    this.panel.refreshDropZoneIndex();
    this.refreshNuggetDisplay();

    if(this.type=="categorical"){
      this.refreshLabelWidth();
    }
    if(this.type==='interval'){
      if(this.browser.recordDisplay)
        this.browser.recordDisplay.addSortingOption(this);
    }
    this.refreshWidth();
    this.browser.refreshMeasureSelectAction();
  },
  /** -- */
  removeFromPanel: function(){
    if(this.panel===undefined) return;
    this.panel.removeSummary(this);
    this.refreshNuggetDisplay();
  },
  /** -- */
  destroy: function(){
    this.browser.destroySummary(this);
    if(this.DOM.root){
      this.DOM.root[0][0].parentNode.removeChild(this.DOM.root[0][0]);
    }
    if(this.DOM.nugget){
      this.DOM.nugget[0][0].parentNode.removeChild(this.DOM.nugget[0][0]);
    }
  },
  /** -- */
  insertNugget: function(){
    var me=this;
    if(this.DOM.nugget) return;
    this.attribMoved = false;

    this.DOM.nugget = this.browser.DOM.attributeList
      .append("div").attr("class","nugget")
      .each(function(){ this.__data__ = me; })
      .attr("title", (this.summaryColumn!==undefined) ? this.summaryColumn : undefined )
      .attr("state",function(){
        if(me.summaryColumn===null) return "custom"; // calculated
        if(me.summaryName===me.summaryColumn) return "exact";
        return "edited";
      })
      .attr("datatype", this.getDataType() )
      .attr("aggr_initialized", this.aggr_initialized )
      .on("dblclick",function(){
        me.browser.autoAddSummary(me);
        me.browser.updateLayout();
      })
      .on("mousedown",function(){
        if(d3.event.which !== 1) return; // only respond to left-click

        var _this = this;
        me.attribMoved = false;
        d3.select("body")
          .on("keydown", function(){
            if(event.keyCode===27){ // Escape key
              _this.removeAttribute("moved");
              me.browser.clearDropZones();
            }
          })
          .on("mousemove", function(){
            if(!me.attribMoved){
              _this.setAttribute("moved","");
              me.browser.prepareDropZones(me,"attributePanel");
              me.attribMoved = true;
            }
            var mousePos = d3.mouse(me.browser.DOM.root[0][0]);
            kshf.Util.setTransform(me.browser.DOM.attribDragBox[0][0],
                "translate("+(mousePos[0]-20)+"px,"+(mousePos[1]+5)+"px)");
            d3.event.stopPropagation();
            d3.event.preventDefault();
          })
          .on("mouseup", function(){
            if(!me.attribMoved) return;
            _this.removeAttribute("moved");
            me.browser.DOM.root.attr("drag_cursor",null);
            me.browser.clearDropZones();
            d3.event.preventDefault();
          });
        d3.event.preventDefault();
      })
      .on("mouseup",function(){
        if(me.attribMoved===false) me.browser.unregisterBodyCallbacks();
      });

    this.DOM.nuggetViz = this.DOM.nugget.append("span").attr("class","nuggetViz")
      .each(function(){
        this.tipsy = new Tipsy(this, {
          gravity: 'e', title: function(){ return  (!me.aggr_initialized) ? "Initialize" : me.getDataType(); }
        });
      })
      .on("mousedown",function(){
        if(!me.aggr_initialized){
          d3.event.stopPropagation();
          d3.event.preventDefault();
        }
      })
      .on("click",function(){
        if(!me.aggr_initialized) me.initializeAggregates();
      });

    this.DOM.nuggetViz.append("span").attr("class","nuggetInfo fa");
    this.DOM.nuggetViz.append("span").attr("class","nuggetChart");
    
    this.DOM.nugget.append("span").attr("class","summaryName editableText")
      .attr("contenteditable",false)
      .html(this.summaryName)
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'w', title: kshf.lang.cur.EditTitle }); })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); })
      .on("mousedown",function(){
        this.tipsy.hide();

        var parentDOM = d3.select(this.parentNode);
        var summaryName = parentDOM.select(".summaryName");
        var summaryName_DOM = parentDOM.select(".summaryName")[0][0];

        var curState=this.parentNode.getAttribute("edittitle");
        if(curState===null || curState==="false"){
          this.parentNode.setAttribute("edittitle",true);
          summaryName_DOM.setAttribute("contenteditable",true);
          summaryName_DOM.focus();
        } else {
          /*
          this.parentNode.setAttribute("edittitle",false);
          summaryName_DOM.setAttribute("contenteditable",false);
          me.browser.changeSummaryName(me.summaryName,summaryName_DOM.textContent);
          */
        }
        // stop dragging event start
        d3.event.stopPropagation();
        d3.event.preventDefault();
      })
      .on("blur",function(){
        this.parentNode.setAttribute("edittitle",false);
        this.setAttribute("contenteditable",false);
        me.browser.changeSummaryName(me.summaryName,this.textContent);
        d3.event.preventDefault();
        d3.event.stopPropagation();
      })
      .on("keydown",function(){
        if(d3.event.keyCode===13){ // ENTER
          this.parentNode.setAttribute("edittitle",false);
          this.setAttribute("contenteditable",false);
          me.browser.changeSummaryName(me.summaryName,this.textContent);
          d3.event.preventDefault();
          d3.event.stopPropagation();
        }
      });

    this.DOM.nugget.append("div").attr("class","fa fa-code editCodeButton")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'w', title: kshf.lang.cur.EditFormula }); })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); })
      .on("mousedown",function(){
        d3.event.stopPropagation();
        d3.event.preventDefault();
      })
      .on("click",function(){
        var safeFunc, func = window.prompt("Specify the function:", me.getFuncString());
        if(func!==null){
          var safeFunc;
          eval("\"use strict\"; safeFunc = function(d){"+func+"}");
          me.browser.createSummary(me.summaryName,safeFunc);
        }
        // stop dragging event start
        d3.event.stopPropagation();
        d3.event.preventDefault();
      });

    this.DOM.nugget.append("div").attr("class","splitCatAttribute_Button fa fa-scissors")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'w', title: "Split" });  })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); })
      .on("click",function(){
        d3.event.stopPropagation();
        d3.event.preventDefault();
        var catSplit = window.prompt('Split by text: (Ex: Splitting "A;B;C" by ";" will create 3 separate values: A,B,C', "");
        if(catSplit!==null){
          me.setCatSplit(catSplit);
        }
        // stop dragging event start
        d3.event.stopPropagation();
        d3.event.preventDefault();
      });

    this.DOM.nugget.append("div").attr("class","addFromAttribute_Button fa fa-plus-square")
      .each(function(){ 
        this.tipsy = new Tipsy(this, { 
          gravity: 'w',
          title: function(){
            if(me.isMultiValued) return "Extract \"# of"+me.summaryName+"\"";
            if(me.isTimeStamp() ) {
              if(me.timeTyped.month && me.summary_sub_month===undefined){
                return "Extract Month of "+me.summaryName;
              }
              if(me.timeTyped.day && me.summary_sub_day===undefined){
                return "Extract WeekDay of "+me.summaryName;
              }
              if(me.timeTyped.hour && me.summary_sub_hour===undefined){
                return "Extract Hour of "+me.summaryName;
              }
            }
            return "?";
          }
        }); 
      })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); })
      .on("click",function(){
        d3.event.stopPropagation();
        d3.event.preventDefault();
        if(me.isMultiValued && !me.hasDegreeSummary){
          me.createSetPairSummary();
          this.style.display = "none";
          return;
        }
        if(me.isTimeStamp()){
          if(me.timeTyped.month && me.summary_sub_month===undefined){
            me.createMonthSummary();
          } else if(me.timeTyped.day && me.summary_sub_day===undefined){
            me.createDaySummary();
          } else if(me.timeTyped.hour && me.summary_sub_hour===undefined){
            me.createHourSummary();
          }
        }
      });

    this.refreshNuggetDisplay();
    if(this.aggr_initialized) this.refreshViz_Nugget();
  },
  /** -- */
  createSetPairSummary: function(){
    var setpair_summary = this.browser.createSummary(
      "# of "+this.summaryName,
      function(d){
        var arr=d._valueCache[this.summaryID];
        return (arr===null) ? null : arr.length;
      },
      'interval'
    );
    setpair_summary.initializeAggregates();
    this.hasDegreeSummary = true;
    this.style.display = "none";
  },
  /** -- */
  refreshNuggetDisplay: function(){
    if(this.DOM.nugget===undefined) return;
    var me=this;
    var nuggetHidden = (this.panel||this.isRecordView);
    if(nuggetHidden){
      this.DOM.nugget.attr('anim','disappear');
      setTimeout(function(){ 
        me.DOM.nugget.attr('hidden','true');
      },700);
    } else {
      this.DOM.nugget.attr("hidden",false);
      setTimeout(function(){
        me.DOM.nugget.attr('anim','appear');
      },300);
    }
  },
  /** -- */
  insertRoot: function(beforeDOM){
    var me=this;
    this.DOM.root = this.panel.DOM.root.insert("div", function(){ return beforeDOM; });
    this.DOM.root
      .attr("class","kshfSummary")
      .attr("summary_id",this.summaryID)
      .attr("collapsed",this.collapsed)
      .attr("filtered",false)
      .attr("showConfig",false)
      .each(function(){
        this.__data__ = me;
      });
  },
  /** -- */
  insertHeader: function(){
    var me = this;

    this.DOM.headerGroup = this.DOM.root.append("div").attr("class","headerGroup")
      .on("mousedown", function(){
        if(d3.event.which !== 1) return; // only respond to left-click
        if(!me.browser.authoringMode) {
          d3.event.preventDefault();
          return;
        }
        var _this = this;
        var _this_nextSibling = _this.parentNode.nextSibling;
        var _this_previousSibling = _this.parentNode.previousSibling;
        var moved = false;
        d3.select("body")
          .style('cursor','move')
          .on("keydown", function(){
            if(event.keyCode===27){ // ESP key
              _this.style.opacity = null;
              me.browser.clearDropZones();
            }
          })
          .on("mousemove", function(){
            if(!moved){
              _this_nextSibling.style.display = "none";
              _this_previousSibling.style.display = "none";
              _this.parentNode.style.opacity = 0.5;
              me.browser.prepareDropZones(me,"browser");
              moved = true;
            }
            var mousePos = d3.mouse(me.browser.DOM.root[0][0]);
            kshf.Util.setTransform(me.browser.DOM.attribDragBox[0][0],
              "translate("+(mousePos[0]-20)+"px,"+(mousePos[1]+5)+"px)");
            d3.event.stopPropagation();
            d3.event.preventDefault();
          })
          .on("mouseup", function(){
            // Mouse up on the body
            me.browser.clearDropZones();
            if(me.panel!==undefined || true) {
              _this.parentNode.style.opacity = null;
              _this_nextSibling.style.display = "";
              _this_previousSibling.style.display = "";
            }
            d3.event.preventDefault();
          });
        d3.event.preventDefault();
      });

    var header_display_control = this.DOM.headerGroup.append("span").attr("class","header_display_control");

    this.DOM.buttonSummaryCollapse = header_display_control.append("span")
      .attr("class","buttonSummaryCollapse fa fa-collapse")
      .each(function(){
        this.tipsy = new Tipsy(this, {
          gravity: function(){ return me.panelOrder!==0?'sw':'nw'; },
          title: function(){ return me.collapsed?kshf.lang.cur.OpenSummary:kshf.lang.cur.MinimizeSummary; }
        })
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide();
        if(me instanceof kshf.Summary_Set){
          me.setListSummary.setShowSetMatrix(false);
        } else {
          me.setCollapsedAndLayout(!me.collapsed);
        }
      });

    this.DOM.buttonSummaryExpand = header_display_control.append("span")
      .attr("class","buttonSummaryExpand fa fa-arrows-alt")
      .each(function(){
        this.tipsy = new Tipsy(this, {
          gravity: function(){ return me.panelOrder!==0?'sw':'nw'; }, title: kshf.lang.cur.MaximizeSummary
        });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide();
        me.panel.collapseAllSummaries(me);
        me.browser.updateLayout_Height();
      });

    this.DOM.buttonSummaryRemove = header_display_control.append("span")
      .attr("class","buttonSummaryRemove fa fa-remove")
      .each(function(){
        this.tipsy = new Tipsy(this, {
          gravity: function(){ return me.panelOrder!==0?'sw':'nw'; }, title: kshf.lang.cur.RemoveSummary
        });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide();
        me.removeFromPanel();
        me.clearDOM();
        me.browser.updateLayout();
      });

    this.DOM.summaryName = this.DOM.headerGroup.append("span")
      .attr("class","summaryName")
      .attr("edittitle",false)
      .on("click",function(){ if(me.collapsed) me.setCollapsedAndLayout(false); });

    this.DOM.clearFilterButton = this.DOM.summaryName.append("div")
      .attr("class","clearFilterButton fa")
      .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'e', title: kshf.lang.cur.RemoveFilter }); })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide(); me.summaryFilter.clearFilter(); });

    this.DOM.summaryName_text = this.DOM.summaryName.append("span").attr("class","summaryName_text editableText")
      .attr("contenteditable",false)
      .each(function(summary){ this.tipsy = new Tipsy(this, { gravity: 'w', title: kshf.lang.cur.EditTitle }); })
      .on("mouseenter",function(){
        if(!me.browser.authoringMode) return;
        this.tipsy.show();
      })
      .on("mouseleave",function(){ this.tipsy.hide(); })
      .on("mousedown", function(){
        // stop dragging event start
        d3.event.stopPropagation();
        d3.event.preventDefault();
      })
      .on("click", function(){
        if(!me.browser.authoringMode) return;
        var curState=this.parentNode.getAttribute("edittitle");
        if(curState===null || curState==="false"){
          this.parentNode.setAttribute("edittitle",true);
          var parentDOM = d3.select(this.parentNode);
          var v=parentDOM.select(".summaryName_text")[0][0];
          v.setAttribute("contenteditable",true);
          v.focus();
        } else {
          this.parentNode.setAttribute("edittitle",false);
          var parentDOM = d3.select(this.parentNode);
          var v=parentDOM.select(".summaryName_text")[0][0];
          v.setAttribute("contenteditable",false);
          me.browser.changeSummaryName(me.summaryName,v.textContent);
        }
      })
      .on("blur",function(){
        this.parentNode.setAttribute("edittitle",false);
        this.setAttribute("contenteditable", false);
        me.browser.changeSummaryName(me.summaryName,this.textContent);
      })
      .on("keydown",function(){
        if(event.keyCode===13){ // ENTER
          this.parentNode.setAttribute("edittitle",false);
          this.setAttribute("contenteditable", false);
          me.browser.changeSummaryName(me.summaryName,this.textContent);
        }
      })
      .html(this.summaryName);

    this.DOM.summaryIcons = this.DOM.headerGroup.append("span").attr("class","summaryIcons");

    this.DOM.summaryConfigControl = this.DOM.summaryIcons.append("span")
      .attr("class","summaryConfigControl fa fa-gear")
      .each(function(){  this.tipsy = new Tipsy(this, { gravity:'ne', title: "Configure" }); })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide();
        var open = me.DOM.root.attr("showConfig")==="false";
        if(open){
          if(me.browser.summaryWithOpenConfig){
            // Close the open summary
            me.browser.summaryWithOpenConfig.DOM.root.attr("showConfig",false);
          }
          me.browser.summaryWithOpenConfig = me;
        } else {
          me.browser.summaryWithOpenConfig = undefined;
        }
        me.DOM.root.attr("showConfig",open);
      });

    this.DOM.setMatrixButton = this.DOM.summaryIcons.append("span").attr("class", "setMatrixButton fa fa-tags")
      .each(function(d){
        this.tipsy = new Tipsy(this, { gravity: 'ne', title: "Show/Hide pair-wise relations" });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide(); me.setShowSetMatrix(!me.show_set_matrix); });

    this.DOM.useForRecordDisplay = this.DOM.summaryIcons.append("span")
      .attr("class", "useForRecordDisplay fa")
      .each(function(d){
        this.tipsy = new Tipsy(this, {
          gravity: 'ne', title: function(){
            return "Use to "+me.browser.recordDisplay.getRecordEncoding()+" "+me.browser.recordName;
          }
        });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide();
        if(me.browser.recordDisplay.recordViewSummary===null) return;
        me.browser.recordDisplay.setSortingOpt_Active(me);
        me.browser.recordDisplay.refreshSortingOptions();
      });

    this.DOM.summaryViewAs = this.DOM.summaryIcons.append("span")
      .attr("class","summaryViewAs fa")
      .attr("viewAs",'map')
      .each(function(d){ 
        this.tipsy = new Tipsy(this, { gravity: 'ne', 
          title: function(){ return "View as "+(me.viewType==='list'?'Map':'List'); }
        });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide();
        this.setAttribute("viewAs",me.viewType);
        me.viewAs( (me.viewType==='list') ? 'map' : 'list' );
      });

    this.DOM.summaryDescription = this.DOM.summaryIcons.append("span")
      .attr("class","summaryDescription fa fa-info")
      .each(function(){  this.tipsy = new Tipsy(this, { gravity:'ne', title:function(){return me.description;} }); })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); });
    this.setDescription(this.description);

    this.DOM.summaryConfig = this.DOM.root.append("div").attr("class","summaryConfig");
    this.DOM.wrapper       = this.DOM.root.append("div").attr("class","wrapper");

    this.insertDOM_EmptyAggr();
  },
  /** -- */
  setDescription: function(description){
    this.description = description;
    if(this.DOM.summaryDescription===undefined) return;
    this.DOM.summaryDescription.style("display",this.description===undefined?null:"inline-block");
  },
  /** -- Shared - Summary Base -- */
  insertChartAxis_Measure: function(dom, pos1, pos2){
    var me=this;
    this.DOM.chartAxis_Measure = dom.append("div").attr("class","chartAxis_Measure");
    this.DOM.measurePercentControl = this.DOM.chartAxis_Measure.append("span").attr("class","measurePercentControl")
      .each(function(){
        this.tipsy = new Tipsy(this, {
          gravity: pos1, title: function(){
            return "<span class='fa fa-eye'></span> "+kshf.lang.cur[(me.browser.percentModeActive?'Absolute':'Percent')];
          },
        })
      })
      .on("click",      function(){ this.tipsy.hide(); me.browser.setPercentLabelMode(!me.browser.percentModeActive); })
      .on("mouseenter", function(){ this.tipsy.show(); me.browser.DOM.root.attr("measurePercentControl",true); })
      .on("mouseleave", function(){ this.tipsy.hide(); me.browser.DOM.root.attr("measurePercentControl",null); });

    // Two controls, one for each side of the scale
    this.DOM.scaleModeControl = this.DOM.chartAxis_Measure.selectAll(".scaleModeControl").data(["1","2"])
      .enter().append("span")
        .attr("class",function(d){ return "scaleModeControl measureAxis_"+d; })
        .each(function(d){
          var pos = pos2;
          if(pos2==='nw' && d==="2") pos = 'ne';
          this.tipsy = new Tipsy(this, {
            gravity: pos, title: function(){
              return kshf.lang.cur[me.browser.ratioModeActive?'Absolute':'PartOf']+" "+kshf.lang.cur.Width+
                " <span class='fa fa-arrows-h'></span>";
            },
          });
        })
        .on("click",      function(){ this.tipsy.hide(); me.browser.setScaleMode(!me.browser.ratioModeActive); })
        .on("mouseenter", function(){ this.tipsy.show(); me.browser.showScaleModeControls(true);  })
        .on("mouseleave", function(){ this.tipsy.hide(); me.browser.showScaleModeControls(false); });

    this.DOM.chartAxis_Measure_TickGroup = this.DOM.chartAxis_Measure.append("div").attr("class","tickGroup");

    this.DOM.highlightedMeasureValue = this.DOM.chartAxis_Measure.append("div").attr("class","highlightedMeasureValue longRefLine");

    this.DOM.highlightedMeasureValue.append("div").attr('class','fa fa-mouse-pointer highlightedAggrValuePointer');
  },
  /** -- */
  setCollapsedAndLayout: function(hide){
    this.setCollapsed(hide);
    this.browser.updateLayout_Height();
  },
  /** -- */
  setCollapsed: function(v){
    this.collapsed = v;
    if(this.DOM.root){
      this.DOM.root
        .attr("collapsed",this.collapsed)
        .attr("showConfig",false);
      if(!this.collapsed) {
        this.refreshViz_All();
        this.refreshMeasureLabel();
      }
    }
    if(this.setSummary){
      this.setShowSetMatrix(false);
    }
  },
  /** -- */
  refreshViz_All: function(){
    if(this.isEmpty() || this.collapsed || !this.inBrowser()) return;
    this.refreshViz_Total();
    this.refreshViz_Active();
    this.refreshViz_Highlight();
    this.refreshViz_Compare_All();
    this.refreshViz_Axis();
  },
  /** -- */
  insertDOM_EmptyAggr: function(){
    var me = this;
    this.DOM.missingValueAggr = this.DOM.wrapper.append("span").attr("class","missingValueAggr aggrGlyph fa fa-ban")
      .each(function(){
        me.missingValueAggr.DOM.aggrGlyph = this;
        this.tipsy = new Tipsy(this, {gravity: 'w', title: function(){ 
          var x = me.browser.getMeasureLabel(me.missingValueAggr, me);
          // TODO: Number should depend on filtering state, and also reflect percentage-mode
          return "<b>"+x+"</b> "+me.browser.getMeasureFuncTypeText()+me.browser.recordName+" "+kshf.lang.cur.NoData; 
        }});
      })
      .on("mouseover",function(){
        this.tipsy.show();
        // TODO: Disable mouse-over action if aggregate has no active item
        me.browser.setSelect_Highlight(me.missingValueAggr);
      })
      .on("mouseout" ,function(){ 
        this.tipsy.hide();
        me.browser.clearSelect_Highlight();
      })
      .on("click", function(){
        if(d3.event.shiftKey){
          me.browser.setSelect_Compare(true);
          return;
        }
        me.summaryFilter.clearFilter();
        if(me.missingValueAggr.filtered){
          me.missingValueAggr.filtered = false;
          this.removeAttribute("filtered");
        } else {
          me.missingValueAggr.filtered = true;
          this.setAttribute("filtered",true);
          me.summaryFilter.how = "All";
          me.summaryFilter.addFilter();
        }
      });
  },
  /** -- */
  refreshViz_EmptyRecords: function(){
    if(!this.DOM.missingValueAggr) return;
    var me=this;
    var interp = d3.interpolateHsl(d3.rgb(211,211,211), d3.rgb(255,69,0));

    this.DOM.missingValueAggr
      .style("display",this.missingValueAggr.recCnt.Active>0?"block":"none")
      .style("color", function(){
        if(me.missingValueAggr.recCnt.Active===0) return;
        return interp(me.missingValueAggr.ratioHighlightToActive());
      });
  },
  refreshViz_Compare_All: function(){
    var totalC = this.browser.getActiveCompareSelCount();
    if(totalC===0) return;
    totalC++; // 1 more for highlight
    if(this.browser.measureFunc==="Avg") totalC++;
    var activeNum = totalC-2;
    if(this.browser.vizActive.Compare_A) {
      this.refreshViz_Compare("A", activeNum, totalC);
      activeNum--;
    }
    if(this.browser.vizActive.Compare_B) {
      this.refreshViz_Compare("B", activeNum, totalC);
      activeNum--;
    }
    if(this.browser.vizActive.Compare_C) {
      this.refreshViz_Compare("C", activeNum, totalC);
      activeNum--;
    }
  },
  /** -- */
  exportConfig: function(){
    var config = {
      name: this.summaryName,
      panel: this.panel.name,
    };
    // config.value
    if(this.summaryColumn!==this.summaryName){
      config.value = this.summaryColumn;
      if(config.value===null){
        // custom function
        config.value = this.summaryFunc.toString(); // if it is function, converts it to string representation
      }
    }
    if(this.collapsed) config.collapsed = true;
    if(this.description) config.description = this.description;
    if(this.catLabel_attr){ // Indexed string
      if(this.catLabel_attr!=="id") config.catLabel = this.catLabel_attr;
    } else if(this.catLabel_table){ // Lookup table
      config.catLabel = this.catLabel_table;
    } else if(this.catLabel_Func){
      config.catLabel = this.catLabel_Func.toString(); // Function to string
    }
    if(this.minAggrValue>1) config.minAggrValue = this.minAggrValue;
    if(this.unitName) config.unitName = this.unitName;
    if(this.scaleType_forced) config.intervalScale = this.scaleType_forced;
    if(this.percentileChartVisible) config.showPercentile = this.percentileChartVisible;
    // catSortBy
    if(this.catSortBy){
      var _sortBy = this.catSortBy[0];
      if(_sortBy.sortKey){ 
        config.catSortBy = _sortBy.sortKey; // string or lookup table
      } else if(_sortBy.value) {
        config.catSortBy = _sortBy.value.toString();
      }
      // TODO: support 'inverse' option
    };
    if(this.catTableName_custom){
      config.catTableName = this.catTableName;
    }
    if(this.catSplit){
      config.catSplit = this.catSplit;
    }
    if(this.viewType){
      if(this.viewType==='map') config.viewAs = this.viewType;
    }
    return config;
  },
  /** -- */
  refreshMeasureLabel: function(){
    if(this.isEmpty() || this.collapsed || !this.inBrowser() || this.DOM.measureLabel===undefined) return;
    var me=this;
    this.DOM.measureLabel.html(function(aggr){ return me.browser.getMeasureLabel(aggr,me); });
  },
};

kshf.Summary_Categorical = function(){};
kshf.Summary_Categorical.prototype = new kshf.Summary_Base();
var Summary_Categorical_functions = {
  /** -- */
  initialize: function(browser,name,attribFunc){
    kshf.Summary_Base.prototype.initialize.call(this,browser,name,attribFunc);
    this.type='categorical';

    this.heightRow_category = 18;
    this.show_set_matrix = false;
    this.scrollTop_cache = 0;
    this.firstCatIndexInView = 0;
    this.configRowCount = 0;
    this.minAggrValue = 1;
    this.catSortBy = [];
    this.viewType = 'list';

    this.setCatLabel("id");

    if(this.records.length<=1000) this.initializeAggregates();
  },
  /** -- */
  initializeAggregates: function(){
    if(this.aggr_initialized) return;
    if(this.catTableName===undefined){
      // Create new table
      this.catTableName = this.summaryName+"_h_"+this.summaryID;
    }
    this.mapToAggregates();
    if(this.catSortBy.length===0) this.setSortingOptions();

    this.aggr_initialized = true;
    this.refreshViz_Nugget();
  },
  /** -- */
  refreshViz_Nugget: function(){
    if(this.DOM.nugget===undefined) return;
    var nuggetChart = this.DOM.nugget.select(".nuggetChart");

    this.DOM.nugget
      .attr("aggr_initialized",this.aggr_initialized)
      .attr("datatype",this.getDataType());

    if(!this.aggr_initialized) return;

    if(this.uniqueCategories()){
      this.DOM.nugget.select(".nuggetInfo").html("<span class='fa fa-tag'></span><br>Unique");
      nuggetChart.style("display",'none');
      return;
    }

    nuggetChart.selectAll(".nuggetBar").data([]).exit().remove();

    var totalWidth= 25;
    var maxAggregate_Total = this.getMaxAggr_Total();
    nuggetChart.selectAll(".nuggetBar").data(this._cats).enter()
      .append("span").attr("class","nuggetBar")
        .style("width",function(cat){ return totalWidth*(cat.records.length/maxAggregate_Total)+"px"; });

    this.DOM.nugget.select(".nuggetInfo").html(
      "<span class='fa fa-tag"+(this.isMultiValued?"s":"")+"'></span><br>"+
      this._cats.length+"<br>rows<br>");
  },

  /***********************************
   * SIZE (HEIGH/WIDTH) QUERY FUNCTIONS
   *************************************/
  /** -- */
  getHeight_RangeMax: function(){
    if(this.viewType==='map') {
      return this.getWidth()*1.5;
    }
    if(this.isEmpty()) return this.getHeight_Header();
    // minimum 2 categories
    return this.getHeight_WithoutCats() + this._cats.length*this.heightRow_category;
  },
  /** -- */
  getHeight_RangeMin: function(){
    if(this.isEmpty()) return this.getHeight_Header();
    return this.getHeight_WithoutCats() + Math.min(this.catCount_Visible,2)*this.heightRow_category;
  },
  getHeight_WithoutCats: function(){
    return this.getHeight_Header() + this.getHeight_Config() + this.getHeight_Bottom();
  },
  /** -- */
  getHeight_Config: function(){
    return (this.showTextSearch?18:0)+(this.catSortBy.length>1?18:0);
  },
  /** -- */
  getHeight_Bottom: function(){
    if(!this.areAllCatsInDisplay() || !this.panel.hideBarAxis || this._cats.length>4) return 18;
    return 0;
  },
  /** -- */
  getHeight_Content: function(){
    return this.categoriesHeight + this.getHeight_Config() + this.getHeight_Bottom();
  },
  /** -- */
  getHeight_VisibleAttrib: function(){
    return this.catCount_Visible*this.heightRow_category;
  },
  /** -- */
  getWidth_Label: function(){
    return this.panel.width_catLabel;
  },
  /** --  Label text + the measure text */
  getWidth_TotalText: function(){
    return this.panel.width_catLabel + this.panel.width_catMeasureLabel;
  },
  /** -- */
  getWidth_CatChart: function(){
    // This will make the bar width extend over to the scroll area.
    // Doesn't look better, the amount of space saved makes chart harder to read and breaks the regularly spaced flow.
    // if(!this.scrollBarShown())return this.panel.width_catBars+kshf.scrollWidth-5;
    return this.panel.width_catBars;
  },

  /** -- */
  areAllCatsInDisplay: function(){
    return this.catCount_Visible===this.catCount_InDisplay;
  },
  /** -- */
  isEmpty: function(){
    if(this._cats && this._cats.length===0) return true;
    return this.summaryFunc===undefined;
  },
  /** -- */
  uniqueCategories: function(){
    if(this._cats===undefined) return true;
    if(this._cats.length===0) return true;
    return 1 === d3.max(this._cats, function(aggr){ return aggr.records.length; });
  },
  /** -- */
  scrollBarShown: function(){
    return this.categoriesHeight<this._cats.length*this.heightRow_category;
  },
  /** returns the maximum active aggregate value per row in chart data */
  getMaxAggr_Active: function(){
    return d3.max(this._cats, function(aggr){ return aggr.measure('Active'); });
  },
  /** returns the maximum total aggregate value stored per row in chart data */
  getMaxAggr_Total: function(){
    if(this._cats===undefined) return 0;
    if(this.isEmpty()) return 0;
    return d3.max(this._cats, function(aggr){ return aggr.measure('Total'); });
  },

  /***********************************
   * SORTING FUNCTIONS
   *************************************/

  /** -- */
  insertSortingOption: function(opt){
    this.catSortBy.push( this.prepareSortingOption(opt) );
  },
  /** -- */
  prepareSortingOption: function(opt){
    if(Array.isArray(opt)){
      var _lookup = {};
      opt.forEach(function(s,i){
        _lookup[s] = i;
      });
      return {
        inverse   : false,
        no_resort : true,
        sortKey   : opt,
        name      : 'Custom Order',
        value     : function(){
          var v=_lookup[this.id];
          if(v!==undefined) return v;
          return 99999; // unknown is 99999th item
        }
      };
    }
    opt.inverse = opt.inverse || false; // Default is false
    if(opt.value){
      if(typeof(opt.value)==="string"){
        var x = opt.value;
        opt.name = opt.name || x;
        opt.sortKey = x;
        opt.value = function(){ return this[x]; }
      } else if(typeof(opt.value)==="function"){
        if(opt.name===undefined) opt.name = "custom"
      }
      opt.no_resort = true;
    } else {
      opt.name = opt.name || "# of Active";
    }
    if(opt.no_resort===undefined) opt.no_resort = (this._cats.length<=4);
    return opt;
  },
  /** -- */
  setSortingOptions: function(opts){
    this.catSortBy = opts || {};

    if(!Array.isArray(this.catSortBy)) {
      this.catSortBy = [this.catSortBy];
    } else {
      // if it is an array, it might still be defining a sorting order for the categories
      if(this.catSortBy.every(function(v){ return (typeof v==="string"); })){
        this.catSortBy = [this.catSortBy];
      }
    }

    this.catSortBy.forEach(function(opt,i){
      if(typeof opt==="string" || typeof opt==="function") this.catSortBy[i] = {value: opt};
      this.catSortBy[i] = this.prepareSortingOption(this.catSortBy[i]);
    },this);

    this.catSortBy_Active = this.catSortBy[0];

    this.updateCatSorting(0,true,true);
    this.refreshCatSortOptions();
    this.refreshSortButton();
  },
  /** -- */
  refreshSortButton: function(){
    if(this.DOM.catSortButton===undefined) return;
    this.DOM.catSortButton
      .style("display",(this.catSortBy_Active.no_resort?"none":"inline-block"))
      .attr("inverse",this.catSortBy_Active.inverse);
  },
  /** -- */
  refreshCatSortOptions: function(){
    if(this.DOM.optionSelect===undefined) return;

    this.refreshConfigRowCount();

    this.DOM.optionSelect.style("display", (this.catSortBy.length>1)?"block":"none" );
    this.DOM.optionSelect.selectAll(".sort_label").data([]).exit().remove(); // remove all existing options

    this.DOM.optionSelect.selectAll(".sort_label").data(this.catSortBy)
      .enter().append("option").attr("class", "sort_label").text(function(d){ return d.name; });
  },
  /** -- */
  sortCategories: function(){
    var me = this;
    var inverse = this.catSortBy_Active.inverse;
    if(this.catSortBy_Active.prep) this.catSortBy_Active.prep.call(this);

    // idCompareFunc can be based on integer or string comparison
    var idCompareFunc = function(a,b){return b.id()-a.id();};
    if(typeof(this._cats[0].id())==="string")
        idCompareFunc = function(a,b){return b.id().localeCompare(a.id());};

    var theSortFunc;
    var sortV = this.catSortBy_Active.value;
    // sortV can only be function. Just having the check for sanity
    if(sortV && typeof sortV==="function"){
      // valueCompareFunc can be based on integer or string comparison
      var valueCompareFunc = function(a,b){return a-b;};
      if(typeof(sortV.call(this._cats[0].data, this._cats[0]))==="string")
        valueCompareFunc = function(a,b){return a.localeCompare(b);};

      // Of the given function takes 2 parameters, assume it defines a nice sorting order.
      if(sortV.length===2){
        theSortFunc = sortV;
      } else {
        // The value is a custom value that returns an integer
        theSortFunc = function(a,b){
          var x = valueCompareFunc(sortV.call(a.data,a),sortV.call(b.data,b));
          if(x===0) x=idCompareFunc(a,b);
          if(inverse) x=-x;
          return x;
        };
      }
    } else {
      theSortFunc = function(a,b){
        // selected on top of the list
        if(!a.f_selected() &&  b.f_selected()) return  1;
        if( a.f_selected() && !b.f_selected()) return -1;
        // Rest
        var x = b.measure('Active') - a.measure('Active');
        if(x===0) x = b.measure('Total') - a.measure('Total');
        if(x===0) x = idCompareFunc(a,b); // stable sorting. ID's would be string most probably.
        if(inverse) x=-x;
        return x;
      };
    }
    this._cats.sort(theSortFunc);

    var lastRank = 0;
    this._cats.forEach(function(cat,i){
      cat.orderIndex_old = cat.orderIndex;
      if(cat.measure('Active')!==0 || cat.isVisible) cat.orderIndex = lastRank++;
    });
  },

  /** -- */
  setCatLabel: function( accessor ){
    // Clear all assignments
    this.catLabel_attr = null;
    this.catLabel_table = null;
    this.catLabel_Func = null;
    if(typeof(accessor)==="function"){
      this.catLabel_Func = accessor;
    } else if(typeof(accessor)==="string"){
      this.catLabel_attr = accessor;
      this.catLabel_Func = function(){ return this[accessor]; };
    } else if(typeof(accessor)==="object"){ 
      // specifies key->value
      this.catLabel_table = accessor;
      this.catLabel_Func = function(){
        var x = accessor[this.id];
        return x?x:this.id;
      }
    } else {
      alert("Bad parameter");
      return;
    }
    var me=this;
    if(this.DOM.theLabel)
      this.DOM.theLabel.html(function(cat){ return me.catLabel_Func.call(cat.data); });
  },
  /** -- */
  setCatTooltip: function( catTooltip ){
    if(typeof(catTooltip)==="function"){
      this.catTooltip = catTooltip;
    } else if(typeof(catTooltip)==="string"){
      var x = catTooltip;
      this.catTooltip = function(){ return this[x]; };
    } else {
      this.setCatTooltip = undefined;
      this.DOM.aggrGlyphs.attr("title",undefined);
      return;
    }
    if(this.DOM.aggrGlyphs)
      this.DOM.aggrGlyphs.attr("title",function(cat){ return me.catTooltip.call(cat.data); });
  },
  /** -- */
  setCatGeo: function( accessor){
    if(typeof(accessor)==="function"){
      this.catMap = accessor;
    } else if(typeof(accessor)==="string" || typeof(accessor)=="number"){
      var x = accessor;
      this.catMap = function(){ return this[x]; };
    } else {
      this.catMap = undefined;
      return;
    }
    if(this.DOM.root)
      this.DOM.root.attr("hasMap",true);
  },
  /** -- */
  setCatTable: function(tableName){
    this.catTableName = tableName;
    this.catTableName_custom = true;
    if(this.aggr_initialized){
      this.mapToAggregates();
      this.updateCats();
    }
  },
  /** -- */
  setCatSplit: function(catSplit){
    this.catSplit = catSplit;
    if(this.aggr_initialized){
      // Remove existing aggregations
      var aggrs=this.browser.allAggregates;
      this._cats.forEach(function(aggr){ aggrs.splice(aggrs.indexOf(aggr),1); },this);
      if(this.DOM.aggrGroup)
        this.DOM.aggrGroup.selectAll(".aggrGlyph").data([]).exit().remove();

      this.mapToAggregates();
      this.updateCats();
      this.insertCategories();
      this.updateCatSorting(0,true,true);
      this.refreshViz_Nugget();
    }
  },

  /** -- */
  createSummaryFilter: function(){
    var me=this;
    this.summaryFilter = this.browser.createFilter(
      {
        summary: this,
        title: function(){ return me.summaryName },
        onClear: function(){
          me.clearCatTextSearch();
          me.unselectAllCategories();
          me._update_Selected();
        },
        onFilter: function(){
          // at least one category is selected in some modality (and/ or/ not)
          me._update_Selected();

          me.records.forEach(function(record){
            var recordVal_s = record._valueCache[me.summaryID];
            if(me.missingValueAggr.filtered===true){
              record.setFilterCache(this.filterID, recordVal_s===null);
              return;
            }
            if(recordVal_s===null){
              // survives if AND and OR is not selected
              record.setFilterCache(this.filterID, this.selected_AND.length===0 && this.selected_OR.length===0 );
              return;
            }

            // Check NOT selections - If any mapped record is NOT, return false
            // Note: no other filtering depends on NOT state.
            // This is for ,multi-level filtering using not query
/*            if(this.selected_NOT.length>0){
                if(!recordVal_s.every(function(record){
                    return !record.is_NOT() && record.isWanted;
                })){
                    record.setFilterCache(this.filterID,false); return;
                }
            }*/

            function getAggr(v){ return me.catTable_id[v]; };

            // If any of the record values are selected with NOT, the record will be removed
            if(this.selected_NOT.length>0){
              if(!recordVal_s.every(function(v){ return !getAggr(v).is_NOT(); })){
                record.setFilterCache(this.filterID,false); return;
              }
            }
            // All AND selections must be among the record values
            if(this.selected_AND.length>0){
              var t=0; // Compute the number of record values selected with AND.
              recordVal_s.forEach(function(v){ if(getAggr(v).is_AND()) t++; })
              if(t!==this.selected_AND.length){
                record.setFilterCache(this.filterID,false); return;
              }
            }
            // One of the OR selections must be among the record values
            // Check OR selections - If any mapped record is OR, return true
            if(this.selected_OR.length>0){
              record.setFilterCache(this.filterID, recordVal_s.some(function(v){return (getAggr(v).is_OR());}) );
              return;
            }
            // only NOT selection
            record.setFilterCache(this.filterID,true);
          }, this);
        },
        filterView_Detail: function(){
          if(me.missingValueAggr.filtered===true) return kshf.lang.cur.NoData;
          // 'this' is the Filter
          // go over all records and prepare the list
          var selectedItemsText="";

          var catTooltip = me.catTooltip;

          var totalSelectionCount = this.selectedCount_Total();

          var query_and = " <span class='AndOrNot AndOrNot_And'>"+kshf.lang.cur.And+"</span> ";
          var query_or = " <span class='AndOrNot AndOrNot_Or'>"+kshf.lang.cur.Or+"</span> ";
          var query_not = " <span class='AndOrNot AndOrNot_Not'>"+kshf.lang.cur.Not+"</span> ";

          if(totalSelectionCount>4){
            selectedItemsText = "<b>"+totalSelectionCount+"</b> selected";
            // Note: Using selected because selections can include not, or,and etc (a variety of things)
          } else {
            var selectedItemsCount=0;

            // OR selections
            if(this.selected_OR.length>0){
              var useBracket_or = this.selected_AND.length>0 || this.selected_NOT.length>0;
              if(useBracket_or) selectedItemsText+="[";
              // X or Y or ....
              this.selected_OR.forEach(function(category,i){
                selectedItemsText+=((i!==0 || selectedItemsCount>0)?query_or:"")+"<span class='attribName'>"
                    +me.catLabel_Func.call(category.data)+"</span>";
                selectedItemsCount++;
              });
              if(useBracket_or) selectedItemsText+="]";
            }
            // AND selections
            this.selected_AND.forEach(function(category,i){
              selectedItemsText+=((selectedItemsText!=="")?query_and:"")
                  +"<span class='attribName'>"+me.catLabel_Func.call(category.data)+"</span>";
              selectedItemsCount++;
            });
            // NOT selections
            this.selected_NOT.forEach(function(category,i){
              selectedItemsText+=query_not+"<span class='attribName'>"+me.catLabel_Func.call(category.data)+"</span>";
              selectedItemsCount++;
            });
          }
          return selectedItemsText;
        }
    });

    this.summaryFilter.selected_AND = [];
    this.summaryFilter.selected_OR = [];
    this.summaryFilter.selected_NOT = [];
    this.summaryFilter.selectedCount_Total = function(){
      return this.selected_AND.length + this.selected_OR.length + this.selected_NOT.length;
    };
    this.summaryFilter.selected_Any = function(){
      return this.selected_AND.length>0 || this.selected_OR.length>0 || this.selected_NOT.length>0;
    };
    this.summaryFilter.selected_All_clear = function(){
      kshf.Util.clearArray(this.selected_AND);
      kshf.Util.clearArray(this.selected_OR);
      kshf.Util.clearArray(this.selected_NOT);
    };
  },

  /** --
   * Note: accesses summaryFilter, summaryFunc
   */
  mapToAggregates: function(){
    var aggrTable_id = {};
    var aggrTable = [];
    var mmmm=false;

    // Converting from kshf.Record to kshf.Aggregate
    if(kshf.dt[this.catTableName] && kshf.dt[this.catTableName][0] instanceof kshf.Record ){
      kshf.dt[this.catTableName].forEach(function(record){
        var aggr = new kshf.Aggregate();
        aggr.init(record.data,record.idIndex);
        aggr.summary = this;
        aggrTable_id[aggr.id()] = aggr;
        aggrTable.push(aggr);
        this.browser.allAggregates.push(aggr);
      },this);
    } else {
      mmmm = true;
    }

    this.catTable_id = aggrTable_id;
    this._cats = aggrTable;

    var maxDegree = 0;
    var hasString = false;

    this.records.forEach(function(record){
      var mapping = this.summaryFunc.call(record.data,record);

      // Split
      if(this.catSplit && typeof mapping === "string"){
        mapping = mapping.split(this.catSplit);
      }

      // make mapping an array if it is not
      if(!(mapping instanceof Array)) mapping = [mapping];

      // Filter invalid / duplicate values
      var found = {};
      mapping = mapping.filter(function(e){
        if(e===undefined || e==="" || e===null || found[e]!==undefined) return false;
        return (found[e] = true);
      });

      // Record is not mapped to any value (missing value)
      if(mapping.length===0) {
        record._valueCache[this.summaryID] = null;
        if(record._aggrCache[this.summaryID]!==this.missingValueAggr)
          this.missingValueAggr.addRecord(record);
        return; 
      }

      record._valueCache[this.summaryID] = [];

      maxDegree = Math.max(maxDegree, mapping.length);

      mapping.forEach(function(v){
        if(typeof(v)==="string") hasString=true;

        var aggr = aggrTable_id[v];
        if(aggr==undefined) {
          aggr = new kshf.Aggregate();
          aggr.summary = this;
          aggr.init({id:v},'id');
          aggrTable_id[v] = aggr;
          this._cats.push(aggr);
          this.browser.allAggregates.push(aggr);
        }
        record._valueCache[this.summaryID].push(v);
        aggr.addRecord(record);
      },this);

    }, this);

    if(mmmm && hasString){
      this._cats.forEach(function(aggr){ aggr.data.id = ""+aggr.data.id; });
    }

    this.isMultiValued = maxDegree>1;

    this.updateCats();

    this.unselectAllCategories();

    this.refreshViz_EmptyRecords();
  },

  // Modified internal dataMap function - Skip rows with 0 active item count
  setMinAggrValue: function(v){
    this.minAggrValue = Math.max(1,v);
    this._cats = this._cats.filter(function(cat){ return cat.records.length>=this.minAggrValue; },this);
    this.updateCats();
  },
  /** -- */
  updateCats: function(){
    // Few categories. Disable resorting after filtering
    if(this._cats.length<=4) {
      this.catSortBy.forEach(function(sortOpt){ sortOpt.no_resort=true; });
    }
    this.showTextSearch = this._cats.length>=20;
    this.updateCatCount_Active();
  },
  /** -- */
  updateCatCount_Active: function(){
    this.catCount_Visible = 0;
    this.catCount_NowVisible = 0;
    this.catCount_NowInvisible = 0;
    this._cats.forEach(function(cat){
      v = this.isCatActive(cat);
      cat.isActiveBefore = cat.isActive;
      cat.isActive = v;
      if(!cat.isActive && cat.isActiveBefore) this.catCount_NowInvisible++;
      if(cat.isActive && !cat.isActiveBefore) this.catCount_NowVisible++;
      if(cat.isActive) this.catCount_Visible++;
    },this);
  },
  /** -- */
  refreshConfigRowCount: function(){
    this.configRowCount = 0;
    if(this.showTextSearch) this.configRowCount++; 
    if(this.catSortBy.length>1) this.configRowCount++;
    
    if(this.configRowCount>0) this.DOM.summaryControls.style("display","block");
  },

  /** -- */
  initDOM: function(beforeDOM){
    this.initializeAggregates();
    var me=this;

    if(this.DOM.inited===true) return;

    this.insertRoot(beforeDOM);

    this.DOM.root.attr({
      filtered_or: 0,
      filtered_and: 0,
      filtered_not: 0,
      filtered_total: 0,
      isMultiValued: this.isMultiValued,
      summary_type: 'categorical',
      hasMap: this.catMap!==undefined,
      viewType: this.viewType });

    this.insertHeader();

    if(!this.isEmpty()) this.init_DOM_Cat();

    this.setCollapsed(this.collapsed);

    this.DOM.summaryConfig_CatHeight = this.DOM.summaryConfig.append("div")
      .attr("class","summaryConfig_CatHeight summaryConfig_Option");
    this.DOM.summaryConfig_CatHeight.append("span").html("<i class='fa fa-arrows-v'></i> Row Height: ");
    x = this.DOM.summaryConfig_CatHeight.append("span").attr("class","optionGroup");
    x.selectAll(".configOption").data(
      [ 
        {l:"<i class='fa fa-minus'></i>", v: "minus"},
        {l:"Short",v:18}, 
        {l:"Long", v:35},
        {l:"<i class='fa fa-plus'></i>", v: "plus"},
      ])
      .enter()
      .append("span").attr("class",function(d){ return "configOption pos_"+d.v;})
      .attr("active",function(d){ return d.v===me.heightRow_category; })
      .html(function(d){ return d.l; })
      .on("click", function(d){ 
        if(d.v==="minus"){
          me.setHeight_Category(me.heightRow_category-1);
        } else if(d.v==="plus"){
          me.setHeight_Category(me.heightRow_category+1);
        } else {
          me.setHeight_Category(d.v);
        }
      })

    this.DOM.inited = true;
  },
    /** -- */
    init_DOM_Cat: function(){
      var me=this;
      this.DOM.summaryCategorical = this.DOM.wrapper.append("div").attr("class","summaryCategorical");

      this.DOM.summaryControls = this.DOM.summaryCategorical.append("div").attr("class","summaryControls");
      this.initDOM_CatTextSearch();
      this.initDOM_CatSortButton();
      this.initDOM_CatSortOpts();

      if(this.showTextSearch) this.DOM.catTextSearch.style("display","block");

      this.refreshConfigRowCount();

      this.DOM.scrollToTop = this.DOM.summaryCategorical.append("div").attr("class","scrollToTop fa fa-arrow-up")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'e', title: kshf.lang.cur.ScrollToTop }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); kshf.Util.scrollToPos_do(me.DOM.aggrGroup,0); });

      this.DOM.aggrGroup = this.DOM.summaryCategorical.append("div").attr("class","aggrGroup")
        .on("mousedown",function(){
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("scroll",function(){
          if(kshf.Util.ignoreScrollEvents===true) return;
          me.scrollTop_cache = me.DOM.aggrGroup[0][0].scrollTop;

          me.DOM.scrollToTop.style("visibility", me.scrollTop_cache>0?"visible":"hidden");

          me.DOM.chartCatLabelResize.style("top",me.scrollTop_cache+"px");
          me.firstCatIndexInView = Math.floor(me.scrollTop_cache/me.heightRow_category);
          me.refreshScrollDisplayMore(me.firstCatIndexInView+me.catCount_InDisplay);
          me.updateCatIsVisible();
          me.cullAttribs();
          me.refreshMeasureLabel();
        });
      this.DOM.aggrGroup_list = this.DOM.aggrGroup;

      this.DOM.catMap_Base = this.DOM.summaryCategorical.append("div").attr("class","catMap_Base");

      // with this, I make sure that the (scrollable) div height is correctly set to visible number of categories
      this.DOM.chartBackground = this.DOM.aggrGroup.append("span").attr("class","chartBackground");

      this.DOM.chartCatLabelResize = this.DOM.chartBackground.append("span").attr("class","chartCatLabelResize dragWidthHandle")
        .on("mousedown", function (d, i) {
          var resizeDOM = this;
          me.panel.DOM.root.attr("catLabelDragging",true);

          me.browser.DOM.pointerBlock.attr("active","");
          me.browser.DOM.root.style('cursor','col-resize');
          me.browser.setNoAnim(true);
          var mouseDown_x = d3.mouse(d3.select("body")[0][0])[0];
          var initWidth = me.panel.width_catLabel;

          d3.select("body").on("mousemove", function() {
            var mouseDown_x_diff = d3.mouse(d3.select("body")[0][0])[0]-mouseDown_x;
            me.panel.setWidthCatLabel(initWidth+mouseDown_x_diff);
          }).on("mouseup", function(){
            me.panel.DOM.root.attr("catLabelDragging",false);
            me.browser.DOM.pointerBlock.attr("active",null);
            me.browser.DOM.root.style('cursor','default');
            me.browser.setNoAnim(false);
            d3.select("body").on("mousemove", null).on("mouseup", null);
          });
         d3.event.preventDefault();
       });

      this.DOM.belowCatChart = this.DOM.summaryCategorical.append("div").attr("class","belowCatChart");

      this.insertChartAxis_Measure(this.DOM.belowCatChart,'e','e');

      this.DOM.scroll_display_more = this.DOM.belowCatChart.append("div")
        .attr("class","hasLabelWidth scroll_display_more")
        .on("click",function(){
          kshf.Util.scrollToPos_do(
            me.DOM.aggrGroup, me.DOM.aggrGroup[0][0].scrollTop+me.heightRow_category);
        });

      this.insertCategories();
      this.refreshLabelWidth();
      this.updateCatSorting(0,true,true);
    },
    /** -- */
    initDOM_CatSortButton: function(){
      var me=this;
      // Context dependent
      this.DOM.catSortButton = this.DOM.summaryControls.append("span").attr("class","catSortButton sortButton fa")
        .on("click",function(d){
          if(me.dirtySort){
            me.dirtySort = false;
            me.DOM.catSortButton.attr("resort",true);
          } else{
            me.catSortBy_Active.inverse = me.catSortBy_Active.inverse?false:true;
            me.refreshSortButton();
          }
          me.updateCatSorting(0,true);
        })
        .each(function(){
          this.tipsy = new Tipsy(this, {
            gravity: 'w', title: function(){ return kshf.lang.cur[me.dirtySort?'Reorder':'ReverseOrder']; }
          });
        })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); });
      this.refreshSortButton();
    },
    /** -- */
    initDOM_CatSortOpts: function(){
      var me=this;
      var x = this.DOM.summaryControls.append("span").attr("class","sortOptionSelectGroup hasLabelWidth");

      this.DOM.optionSelect = x.append("select").attr("class","optionSelect")
        .on("change", function(){
          me.catSortBy_Active = me.catSortBy[this.selectedIndex];
          me.refreshSortButton();
          me.updateCatSorting(0,true);
        })

      this.refreshCatSortOptions();
    },
    /** -- */
    initDOM_CatTextSearch: function(){
        var me=this;
        this.DOM.catTextSearch = this.DOM.summaryControls.append("div").attr("class","textSearchBox catTextSearch hasLabelWidth");
        this.DOM.catTextSearchControl = this.DOM.catTextSearch.append("span")
          .attr("class","textSearchControl fa")
          .each(function(){
            this.tipsy = new Tipsy(this, {
              gravity: 'nw', title: "Clear text search"
            });
          })
          .on("mouseenter", function(){ this.tipsy.show(); })
          .on("mouseleave", function(){ this.tipsy.hide(); })
          .on("click",      function(){ this.tipsy.hide();
            me.DOM.catTextSearchControl.attr("showClear",false);
            me.summaryFilter.clearFilter();
          });
        this.DOM.catTextSearchInput = this.DOM.catTextSearch.append("input")
          .attr("class","textSearchInput")
          .attr("type","text")
          .attr("placeholder",kshf.lang.cur.Search)
          .on("input",function(){
            if(this.timer) clearTimeout(this.timer);
            var x = this;
            this.timer = setTimeout( function(){
              me.unselectAllCategories();
              var query = [];

              // split the query by " character
              var processed = x.value.toLowerCase().split('"');
              processed.forEach(function(block,i){
                if(i%2===0) {
                  block.split(/\s+/).forEach(function(q){ query.push(q)});
                } else {
                  query.push(block);
                }
              });

              // Remove the empty strings
              query = query.filter(function(v){ return v!==""});

              if(query.length>0){
                me.DOM.catTextSearchControl.attr("showClear",true);
                var labelFunc = me.catLabel_Func;
                var tooltipFunc = me.catTooltip;
                me._cats.forEach(function(_category){
                  var catLabel = labelFunc.call(_category.data).toString().toLowerCase();
                  var f = query.every(function(query_str){
                      if(catLabel.indexOf(query_str)!==-1){ return true; }
                      if(tooltipFunc) {
                          var tooltipText = tooltipFunc.call(_category.data);
                          return (tooltipText && tooltipText.toLowerCase().indexOf(query_str)!==-1);
                      }
                      return false;
                  });
                  if(f){
                    _category.set_OR(me.summaryFilter.selected_OR);
                  } else {
                    _category.set_NONE(me.summaryFilter.selected_OR);
                  }
                });

                // All categories are process, and the filtering state is set. Now, process the summary as a whole
                if(me.summaryFilter.selectedCount_Total()===0){
                  me.skipTextSearchClear = true;
                  me.summaryFilter.clearFilter();
                  me.skipTextSearchClear = false;
                } else {
                  me.summaryFilter.how = "All";
                  me.missingValueAggr.filtered = false;
                  me.summaryFilter.addFilter();
                }
              } else {
                me.summaryFilter.clearFilter();
              }
            }, 750);
          });
    },

    /** -- */
    _update_Selected: function(){
      if(this.DOM.root) {
        this.DOM.root
          .attr("filtered",this.isFiltered())
          .attr("filtered_or",this.summaryFilter.selected_OR.length)
          .attr("filtered_and",this.summaryFilter.selected_AND.length)
          .attr("filtered_not",this.summaryFilter.selected_NOT.length)
          .attr("filtered_total",this.summaryFilter.selectedCount_Total());
      }
      var show_box = (this.summaryFilter.selected_OR.length+this.summaryFilter.selected_AND.length)>1;
      this.summaryFilter.selected_OR.forEach(function(category){
        category.DOM.aggrGlyph.setAttribute("show-box",show_box);
      },this);
      this.summaryFilter.selected_AND.forEach(function(category){
        category.DOM.aggrGlyph.setAttribute("show-box",show_box);
      },this);
      this.summaryFilter.selected_NOT.forEach(function(category){
        category.DOM.aggrGlyph.setAttribute("show-box","true");
      },this);
    },
    /** -- */
    unselectAllCategories: function(){
      this._cats.forEach(function(aggr){
        if(aggr.f_selected() && aggr.DOM.aggrGlyph) aggr.DOM.aggrGlyph.removeAttribute("selection");
        aggr.set_NONE();
      });
      this.summaryFilter.selected_All_clear();
      if(this.DOM.inited) this.DOM.missingValueAggr.attr("filtered",null);
    },
    /** -- */
    clearCatTextSearch: function(){
      if(!this.showTextSearch) return;
      if(this.skipTextSearchClear) return;
      this.DOM.catTextSearchControl.attr("showClear",false);
      this.DOM.catTextSearchInput[0][0].value = '';
    },
    /** -- */
    updateChartScale_Measure: function(){
      if(!this.aggr_initialized || this.isEmpty()) return; // nothing to do
      var maxMeasureValue = this.getMaxAggr_Active();
      if(this.browser.measureFunc==="Avg"){
        ["Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(distr){
          if(!this.browser.vizActive[distr]) return;
          maxMeasureValue = Math.max(maxMeasureValue, d3.max(this._cats, function(aggr){return aggr.measure(distr);} ) );
        },this);
      }

      this.chartScale_Measure
        .rangeRound([0, this.getWidth_CatChart()])
        .nice(this.chartAxis_Measure_TickSkip())
        .domain([ 0,(maxMeasureValue===0)?1:maxMeasureValue ]);

      this.refreshViz_All();
    },
    /** -- */
    setHeight: function(newHeight){
      var me = this;
      if(this.isEmpty()) return;
      // take into consideration the other components in the summary
      var attribHeight_old = this.categoriesHeight;
      newHeight -= this.getHeight_Header()+this.getHeight_Config()+this.getHeight_Bottom();
      if(this.viewType==='map'){
        this.categoriesHeight = newHeight;
        if(this.categoriesHeight!==attribHeight_old)
          setTimeout(function(){ me.map_zoomToActive();}, 1000);
        return;
      }

      this.categoriesHeight = Math.min( newHeight, this.heightRow_category*this.catCount_Visible);
      if(this.onCatHeight && attribHeight_old!==this.categoriesHeight) this.onCatHeight(this);
    },

    /** -- */
    setHeight_Category: function(h){
      this.heightRow_category = Math.min(50, Math.max(10,h));
      if(this.viewType==='list') {
        this.refreshHeight_Category();
      } else {
        this.heightRow_category_dirty = true;
      }
    },
    /** -- */
    refreshHeight_Category: function(){
      var me=this;
      this.heightRow_category_dirty = false;
      this.browser.setNoAnim(true);

      this.browser.updateLayout();

      this.DOM.aggrGlyphs
        .each(function(aggr){
          kshf.Util.setTransform(this, "translate("+aggr.posX+"px,"+(me.heightRow_category*aggr.orderIndex)+"px)");
        })
        .style("height",this.heightRow_category+"px");

      this.DOM.aggrGlyphs.selectAll(".categoryLabel").style("padding-top",(this.heightRow_category/2-8)+"px");

      this.DOM.chartBackground.style("height",this.getHeight_VisibleAttrib()+"px");

      this.DOM.summaryConfig_CatHeight.selectAll(".configOption").attr("active",false);
      this.DOM.summaryConfig_CatHeight.selectAll(".pos_"+this.heightRow_category).attr("active",true);

      if(this.onCatHeight) this.onCatHeight(this);

      setTimeout(function(){ me.browser.setNoAnim(false); },100);
    },
    /** -- */
    updateAfterFilter: function(){
      if(this.isEmpty() || this.collapsed || !this.inBrowser()) return;
      var me=this;
      
      if(this.viewType==='map'){
        this.updateCatCount_Active();
        //this.map_refreshBounds_Active();
        //setTimeout(function(){ me.map_zoomToActive(); }, 1000);
        this.refreshMeasureLabel();
        this.refreshViz_Active();
        return;
      }
      
      this.updateChartScale_Measure();
      this.refreshMeasureLabel();

      this.refreshViz_EmptyRecords();

      if(this.show_set_matrix) {
        this.dirtySort = true;
        this.DOM.catSortButton.attr('resort',true);
      }
      if(!this.dirtySort) {
        this.updateCatSorting();
      } else {
        this.refreshViz_All();
        this.refreshMeasureLabel();
      }
    },
    /** -- */
    refreshWidth: function(){
      if(this.DOM.summaryCategorical===undefined) return;
      this.updateChartScale_Measure();
      this.DOM.summaryCategorical.style("width",this.getWidth()+"px");
      this.DOM.summaryName.style("max-width",(this.getWidth()- 40)+"px");
      this.DOM.chartAxis_Measure.selectAll(".scaleModeControl").style("width",(this.getWidth_CatChart()+5)+"px");
      this.refreshViz_Axis();
    },
    /** -- */
    refreshViz_Total: function(){
      if(this.isEmpty() || this.collapsed) return;
      if(this.viewType==='map') return; // Maps do not display total distribution.
      if(this.browser.ratioModeActive){
        // Do not need to update total. Total value is invisible. Percent view is based on active count.
        this.DOM.measureTotalTip.style("opacity",0);
      } else {
        var me = this;
        var width_Text = this.getWidth_TotalText();
        this.DOM.measure_Total.each(function(_cat){
          kshf.Util.setTransform(this, "translateX("+width_Text+"px) scaleX("+me.chartScale_Measure(_cat.measure('Total'))+")");
        });
        this.DOM.measureTotalTip
          .each(function(_cat){
            kshf.Util.setTransform(this, "translateX("+(me.chartScale_Measure.range()[1]+width_Text)+"px)");
          })
          .style("opacity",function(_cat){
            return (_cat.measure('Total')>me.chartScale_Measure.domain()[1])?1:0;
          });
      }
    },
    /** -- */
    setShowSetMatrix: function(v){
      this.show_set_matrix = v;
      this.DOM.root.attr("show_set_matrix",this.show_set_matrix);

      if(this.setSummary===undefined){
        this.setSummary = new kshf.Summary_Set();
        this.setSummary.initialize(this.browser,this);
        this.browser.summaries.push(this.setSummary);
      }
    },
    /** -- */
    refreshMapColorScaleBounds: function(boundMin, boundMax){
      if(boundMin===undefined && boundMax===undefined){
        var maxAggr_Active = this.getMaxAggr_Active();
        if(this.browser.ratioModeActive || this.browser.percentModeActive){
          boundMin = 0;
          boundMax = 100*maxAggr_Active/this.browser.allRecordsAggr.measure('Active');
        } else {
          boundMin = d3.min(this._cats, function(_cat){ return _cat.measure('Active'); }), 
          boundMax = maxAggr_Active;
        }
      }
      
      this.mapColorScale = d3.scale.linear().range([0, 9]).domain([boundMin, boundMax]);

      this.DOM.catMapColorScale.select(".boundMin").html( this.browser.getTickLabel(boundMin) );
      this.DOM.catMapColorScale.select(".boundMax").html( this.browser.getTickLabel(boundMax) );
    },
    /** -- */
    refreshViz_Active: function(){
      if(this.isEmpty() || this.collapsed) return;
      var me=this;
      var ratioMode = this.browser.ratioModeActive;

      if(this.viewType==='map') {

        this.refreshMapColorScaleBounds();

        var allRecordsAggr_measure_Active = me.browser.allRecordsAggr.measure('Active');

        this.DOM.measure_Active
          .attr("fill", function(_cat){ 
            var v = _cat.measure('Active');
            if(v<=0 || v===undefined ) return "url(#diagonalHatch)";
            if(me.browser.percentModeActive){
              v = 100*v/allRecordsAggr_measure_Active;
            }
            var vv = me.mapColorScale(v);
            if(ratioMode) vv=0;
            //if(me.sortingOpt_Active.invertColorScale) vv = 9 - vv;
            return me.mapColorQuantize(vv); 
          })
          .attr("stroke", function(_cat){ 
            var v = _cat.measure('Active');
            if(me.browser.percentModeActive){
              v = 100*v/allRecordsAggr_measure_Active;
            }
            var vv = 9-me.mapColorScale(v);
            if(ratioMode) vv=8;
            //if(me.sortingOpt_Active.invertColorScale) vv = 9 - vv;
            return me.mapColorQuantize(vv); 
          });
        return;
      }
      
      var maxWidth = this.chartScale_Measure.range()[1];
      var width_Text = this.getWidth_TotalText();

      this.DOM.measure_Active.each(function(_cat){
        kshf.Util.setTransform(this,"translateX("+width_Text+"px) scaleX("+(ratioMode?
          ((_cat.measure_Active===0)?0:maxWidth):
          me.chartScale_Measure(_cat.measure('Active'))
        )+")");
      });
      this.DOM.attribClickArea.style("width",function(_cat){
          return width_Text+(ratioMode?
            ((_cat.recCnt.Active===0)?0:maxWidth):
            Math.min((me.chartScale_Measure(_cat.measure('Active'))+10),maxWidth)
          )+"px";
        });
      this.DOM.lockButton
        .attr("inside",function(_cat){
          if(ratioMode) return "";
          if(maxWidth-me.chartScale_Measure(_cat.measure('Active'))<10) return "";
          return null; // nope, not inside
        });
    },
    /** -- */
    refreshViz_Highlight: function(){
      if(this.isEmpty() || this.collapsed || !this.DOM.inited || !this.inBrowser()) return;
      var me=this;

      this.refreshViz_EmptyRecords();
      this.refreshMeasureLabel();

      var ratioMode = this.browser.ratioModeActive;
      var isThisIt = this===this.browser.highlightSelectedSummary;
      var maxWidth = this.chartScale_Measure.range()[1];
      var width_Text = this.getWidth_TotalText();

      if(this.browser.vizActive.Highlight){
        if(this.browser.ratioModeActive) {
          if(this.viewType==='map'){
            //this.DOM.highlightedMeasureValue.style("left",(100*(this.mapColorScale(aggr.measure.Highlight)/9))+"%");
          } else {
            this.DOM.highlightedMeasureValue.style({
              opacity: 1,
              left: (this.browser.allRecordsAggr.ratioHighlightToTotal()*maxWidth)+"px" });
          }
        }
      } else {
        this.DOM.highlightedMeasureValue.style("opacity",0);
      }

      if(this.viewType=='map'){
        if(!this.browser.vizActive.Highlight){
          this.refreshViz_Active();
          return;
        }
        if(!isThisIt || this.isMultiValued) {
          var boundMin = ratioMode ? 
            d3.min(this._cats, function(aggr){ 
              if(aggr.recCnt.Active===0 || aggr.recCnt.Highlight===0) return null;
              return 100*aggr.ratioHighlightToActive(); }) :
            1; //d3.min(this._cats, function(_cat){ return _cat.measure.Active; }), 
          var boundMax = ratioMode ? 
            d3.max(this._cats, function(_cat){ 
              return (_cat._measure.Active===0) ? null : 100*_cat.ratioHighlightToActive();
            }) : 
            d3.max(this._cats, function(_cat){ return _cat.measure('Highlight'); });

          this.refreshMapColorScaleBounds(boundMin, boundMax);
        }

        var allRecordsAggr_measure_Active = me.browser.allRecordsAggr.measure('Active');

        this.DOM.measure_Active
          .attr("fill", function(_cat){ 
            //if(_cat === me.browser.selectedAggr.Highlight) return "";
            var _v;
            if(me.isMultiValued || !isThisIt){
              v = _cat.measure('Highlight');
              if(ratioMode) v = 100*v/_cat.measure('Active');
            } else {
              v = _cat.measure('Active');
              if(me.browser.percentModeActive){
                v = 100*v/allRecordsAggr_measure_Active;
              }
            }
            if(v<=0 || v===undefined ) return "url(#diagonalHatch)";
            return me.mapColorQuantize(me.mapColorScale(v)); 
          })
      } else { // this.viewType==='list'
        var totalC = this.browser.getActiveCompareSelCount();
        if(this.browser.measureFunc==="Avg") totalC++;
        var barHeight = (this.heightRow_category-8)/(totalC+1);
        this.DOM.measure_Highlight.each(function(aggr){
          var p = aggr.measure('Highlight');
          if(me.browser.preview_not) p = aggr._measure.Active - aggr._measure.Highlight;
          kshf.Util.setTransform(this,
            "translateX("+width_Text+"px) "+
            "scale("+(ratioMode ? ((p/aggr._measure.Active)*maxWidth ) : me.chartScale_Measure(p))+","+barHeight+")");
        });
      }
    },
    /** -- */
    refreshViz_Compare: function(cT, curGroup, totalGroups){
      if(this.isEmpty() || this.collapsed || !this.inBrowser()) return;
      var me=this, ratioMode=this.browser.ratioModeActive, maxWidth = this.chartScale_Measure.range()[1];
      var width_Text = this.getWidth_TotalText();
      var _translateX = "translateX("+width_Text+"px) ";
      var barHeight = (this.heightRow_category-8)/totalGroups;
      var _translateY = "translateY("+(barHeight*(curGroup+1))+"px)";
      var compId = "Compare_"+cT;
      this.DOM["measure_Compare_"+cT].each(function(aggr){
        var sx = (me.browser.vizActive[compId])?
          ( ratioMode ? (aggr.ratioCompareToActive(cT)*maxWidth) : me.chartScale_Measure(aggr.measure(compId)) ) : 0;
        kshf.Util.setTransform(this,_translateX+_translateY+"scale("+sx+","+barHeight+")");
      });
    },
    /** -- */
    refreshViz_Axis: function(){
      if(this.isEmpty() || this.collapsed) return;
      
      var me=this;
      var tickValues, posFunc, transformFunc;
      var chartWidth = this.getWidth_CatChart();
      var axis_Scale = this.chartScale_Measure;

      function setCustomAxis(maxValue){
        axis_Scale = d3.scale.linear()
          .rangeRound([0, chartWidth])
          .nice(me.chartAxis_Measure_TickSkip())
          .clamp(true)
          .domain([0,maxValue]);
      };

      if(this.browser.ratioModeActive) {
        setCustomAxis( 100 );
      } else if(this.browser.percentModeActive) {
        setCustomAxis( Math.round(100*me.getMaxAggr_Active()/me.browser.allRecordsAggr.measure('Active')) );
      }

      // GET TICK VALUES ***********************************************************
      tickValues = axis_Scale.ticks(this.chartAxis_Measure_TickSkip());
      if(this.browser.measureFunc==="Count" || true){ 
        // remove 0-tick // TODO: The minimum value can be below zero, and you may wish to label 0-line
        tickValues = tickValues.filter(function(d){ return d!==0; });
      }
      // Remove non-integer values is appropriate
      if((this.browser.measureFunc==="Count") || (this.browser.measureFunc==="Sum" && !this.browser.measureSummary.hasFloat)){
        tickValues = tickValues.filter(function(d){ return d%1===0; });
      }

      var tickDoms = this.DOM.chartAxis_Measure_TickGroup.selectAll("span.tick")
        .data(tickValues,function(i){return i;});
      // Remove old ones
      tickDoms.exit().remove();
      // Add new ones
      var tickData_new=tickDoms.enter().append("span").attr("class","tick");

      tickData_new.append("span").attr("class","line longRefLine")
        .style("top","-"+(this.categoriesHeight+3)+"px")
        .style("height",(this.categoriesHeight-1)+"px");
      tickData_new.append("span").attr("class","text measureAxis_1");
      if(this.configRowCount>0){
        tickData_new.append("span").attr("class","text measureAxis_2").style("top",(-this.categoriesHeight-21)+"px");
        this.DOM.chartAxis_Measure.selectAll(".scaleModeControl.measureAxis_2").style("top",(this.categoriesHeight-14)+"px");
      }

      // Place the doms at the zero-point, so their position can be animated.
      tickData_new.each(function(){ kshf.Util.setTransform(this,"translatex(0px)"); });

      // set text of each label
      this.DOM.chartAxis_Measure_TickGroup.selectAll(".text")
        .html(function(d){ return me.browser.getTickLabel(d); });

      setTimeout(function(){
        var transformFunc = function(d){
          kshf.Util.setTransform(this,"translateX("+(axis_Scale(d)-0.5)+"px)");
        }

        var x=this.browser.noAnim;
        if(x===false) this.browser.setNoAnim(true);
        me.DOM.chartAxis_Measure.selectAll(".tick").style("opacity",1).each(transformFunc);
        if(x===false) this.browser.setNoAnim(false);

        me.DOM.wrapper.attr("showMeasureAxis_2", this.configRowCount>0?"true":null);
      });
    },
    /** -- */
    refreshLabelWidth: function(){
      if(this.isEmpty()) return;
      if(this.DOM.summaryCategorical===undefined) return;
      
      var width_Label = this.getWidth_Label();
      var width_totalText = this.getWidth_TotalText();

      this.DOM.chartCatLabelResize.style("left",(width_Label+1)+"px");
      this.DOM.summaryCategorical.selectAll(".hasLabelWidth").style("width",width_Label+"px");
      this.DOM.measureLabel.style({
        left:  width_Label+"px",
        width: this.panel.width_catMeasureLabel+"px"
      });
      this.DOM.chartAxis_Measure.each(function(){
        kshf.Util.setTransform(this,"translateX("+width_totalText+"px)");
      });
      this.DOM.catSortButton.style({
        left: width_Label+"px",
        width: this.panel.width_catMeasureLabel+"px"
      });
    },
    /** -- */
    refreshScrollDisplayMore: function(bottomItem){
      if(this._cats.length<=4) {
        this.DOM.scroll_display_more.style("display","none");
        return;
      }
      var moreTxt = ""+this.catCount_Visible+" "+kshf.lang.cur.Rows;
      var below = this.catCount_Visible-bottomItem;
      if(below>0) moreTxt+=" <span class='fa fa-angle-down'></span>"+below+" "+kshf.lang.cur.More;
      this.DOM.scroll_display_more.html(moreTxt);
    },
    /** -- */
    refreshHeight: function(){
      if(this.isEmpty()) return;

      // update catCount_InDisplay
      var c = Math.floor(this.categoriesHeight / this.heightRow_category);
      var c = Math.floor(this.categoriesHeight / this.heightRow_category);
      if(c<0) c=1;
      if(c>this.catCount_Visible) c=this.catCount_Visible;
      if(this.catCount_Visible<=2){
        c = this.catCount_Visible;
      } else {
        c = Math.max(c,2);
      }
      this.catCount_InDisplay = c+1;
      this.catCount_InDisplay = Math.min(this.catCount_InDisplay,this.catCount_Visible);

      this.refreshScrollDisplayMore(this.firstCatIndexInView+this.catCount_InDisplay);

      this.updateCatIsVisible();
      this.cullAttribs();

      this.DOM.headerGroup.attr("allCatsInDisplay", this.areAllCatsInDisplay());

      this.updateChartScale_Measure();

      var h=this.categoriesHeight;
      this.DOM.wrapper.style("height",(this.collapsed?"0":this.getHeight_Content())+"px");
      this.DOM.aggrGroup.style("height",h+"px");
      this.DOM.chartCatLabelResize.style("height",h+"px");
      this.DOM.root.style("max-height",(this.getHeight()+1)+"px");

      this.DOM.chartAxis_Measure.selectAll(".longRefLine").style("top",(-h+1)+"px").style("height",(h-2)+"px");
      this.DOM.chartAxis_Measure.selectAll(".measureAxis_2.text").style("top",(-h-21)+"px");
      this.DOM.chartAxis_Measure.selectAll(".measureAxis_2.scaleModeControl").style("top",(-h-14)+"px");

      if(this.viewType==='map'){
        this.DOM.catMap_Base.style("height",h+"px");
        if(this.DOM.catMap_SVG) this.DOM.catMap_SVG.style("height",h+"px");
        if(this.leafletAttrMap) this.leafletAttrMap.invalidateSize();
      }
    },
    /** -- */
    isCatActive: function(category){
      if(category.f_selected()) return true;
      if(category.recCnt.Active!==0) return true;
      // summary is not filtered yet, don't show categories with no records
      if(!this.isFiltered()) return category.recCnt.Active!==0;
      if(this.viewType==='map') return category.recCnt.Active!==0;
      // Hide if multiple options are selected and selection is and
//        if(this.summaryFilter.selecttype==="SelectAnd") return false;
      // TODO: Figuring out non-selected, zero-active-item attribs under "SelectOr" is tricky!
      return true;
    },
    /** -- */
    isCatSelectable: function(category){
      if(category.f_selected()) return true;
      if(category.recCnt.Active!==0) return true;
      // Show if multiple attributes are selected and the summary does not include multi value records
      if(this.isFiltered() && !this.isMultiValued) return true;
      // Hide
      return false;
    },
    /**
     When clicked on an attribute ...
     what: AND / OR / NOT / NONE
     how: MoreResults / LessResults
     */
    filterCategory: function(ctgry, what, how){
        if(this.browser.skipSortingFacet){
            // you can now sort the last filtered summary, attention is no longer there.
            this.browser.skipSortingFacet.dirtySort = false;
            this.browser.skipSortingFacet.DOM.catSortButton.attr("resort",false);
        }
        this.browser.skipSortingFacet=this;
        this.browser.skipSortingFacet.dirtySort = true;
        this.browser.skipSortingFacet.DOM.catSortButton.attr("resort",true);

        var i=0;

        var preTest = (this.summaryFilter.selected_OR.length>0 && (this.summaryFilter.selected_AND.length>0 ||
                this.summaryFilter.selected_NOT.length>0));

        // if selection is in same mode, "undo" to NONE.
        if(what==="NOT" && ctgry.is_NOT()) what = "NONE";
        if(what==="AND" && ctgry.is_AND()) what = "NONE";
        if(what==="OR"  && ctgry.is_OR() ) what = "NONE";

        if(what==="NONE"){
            if(ctgry.is_AND() || ctgry.is_NOT()){
                this.summaryFilter.how = "MoreResults";
            }
            if(ctgry.is_OR()){
                this.summaryFilter.how = this.summaryFilter.selected_OR.length===0?"MoreResults":"LessResults";
            }
            ctgry.set_NONE();
            if(this.summaryFilter.selected_OR.length===1 && this.summaryFilter.selected_AND.length===0){
                this.summaryFilter.selected_OR.forEach(function(a){
                    a.set_NONE();
                    a.set_AND(this.summaryFilter.selected_AND);
                },this);
            }
            if(!this.summaryFilter.selected_Any()){
                this.dirtySort = false;
                this.DOM.catSortButton.attr("resort",false);
            }
        }
        if(what==="NOT"){
            if(ctgry.is_NONE()){
                if(ctgry.recCnt.Active===this.browser.allRecordsAggr.recCnt.Active){
                    alert("Removing this category will create an empty result list, so it is not allowed.");
                    return;
                }
                this.summaryFilter.how = "LessResults";
            } else {
                this.summaryFilter.how = "All";
            }
            ctgry.set_NOT(this.summaryFilter.selected_NOT);
        }
        if(what==="AND"){
            ctgry.set_AND(this.summaryFilter.selected_AND);
            this.summaryFilter.how = "LessResults";
        }
        if(what==="OR"){
            if(!this.isMultiValued && this.summaryFilter.selected_NOT.length>0){
                var temp = [];
                this.summaryFilter.selected_NOT.forEach(function(a){ temp.push(a); });
                temp.forEach(function(a){ a.set_NONE(); });
            }
            if(this.summaryFilter.selected_OR.length===0 && this.summaryFilter.selected_AND.length===1){
                this.summaryFilter.selected_AND.forEach(function(a){
                    a.set_NONE();
                    a.set_OR(this.summaryFilter.selected_OR);
                },this);
            }
            ctgry.set_OR(this.summaryFilter.selected_OR);
            this.summaryFilter.how = "MoreResults";
        }
        if(how) this.summaryFilter.how = how;

        if(preTest){
            this.summaryFilter.how = "All";
        }
        if(this.summaryFilter.selected_OR.length>0 && (this.summaryFilter.selected_AND.length>0 ||
                this.summaryFilter.selected_NOT.length>0)){
            this.summaryFilter.how = "All";
        }
        if(this.missingValueAggr.filtered===true){
            this.summaryFilter.how = "All";
        }

        if(this.summaryFilter.selectedCount_Total()===0){
            this.summaryFilter.clearFilter();
            return;
        }
        this.clearCatTextSearch();
        this.missingValueAggr.filtered = false;
        this.summaryFilter.addFilter();
    },


    /** -- */
    onCatClick: function(ctgry){
      if(!this.isCatSelectable(ctgry)) return;

      if(d3.event && d3.event.shiftKey){
        this.browser.setSelect_Compare(true);
        return;
      }

      if(this.dblClickTimer){ // double click
        if(!this.isMultiValued) return;
        this.unselectAllCategories();
        this.filterCategory("AND","All");
        return;
      }

      if(ctgry.is_NOT()){
        this.filterCategory(ctgry,"NOT");
      } else if(ctgry.is_AND()){
        this.filterCategory(ctgry,"AND");
      } else if(ctgry.is_OR()){
        this.filterCategory(ctgry,"OR");
      } else {
        // remove the single selection if it is defined with OR
        if(!this.isMultiValued && this.summaryFilter.selected_Any()){
          if(this.summaryFilter.selected_OR.indexOf(ctgry)<0){
            var temp = [];
            this.summaryFilter.selected_OR.forEach(function(a){ temp.push(a); });
            temp.forEach(function(a){ a.set_NONE(); });
          }
          if(this.summaryFilter.selected_AND.indexOf(ctgry)<0){
            var temp = [];
            this.summaryFilter.selected_AND.forEach(function(a){ temp.push(a); });
            temp.forEach(function(a){ a.set_NONE(); });
          }
          if(this.summaryFilter.selected_NOT.indexOf(ctgry)<0){
            var temp = [];
            this.summaryFilter.selected_NOT.forEach(function(a){ temp.push(a); });
            temp.forEach(function(a){ a.set_NONE(); });
          }
          this.filterCategory(ctgry,"AND","All");
        } else {
          this.filterCategory(ctgry,"AND");
        }
      }

      if(this.isMultiValued){
        var x = this;
        this.dblClickTimer = setTimeout(function() { x.dblClickTimer = null; }, 500);
      }
    },
    /** -- */
    onCatEnter: function(aggr){
      if(!this.isCatSelectable(aggr)) return;

      if(aggr.DOM.matrixRow) aggr.DOM.matrixRow.setAttribute("selection","selected");

      aggr.DOM.aggrGlyph.setAttribute("selecttype","and");
      aggr.DOM.aggrGlyph.setAttribute("selection","selected");

      // Comes after setting select type of the category - visual feedback on selection...
      if(!this.isMultiValued && this.summaryFilter.selected_AND.length!==0) return;

      // Show the highlight (preview)
      if(aggr.is_NOT()) return;
      if(this.isMultiValued || this.summaryFilter.selected_AND.length===0){
        aggr.DOM.aggrGlyph.setAttribute("showlock",true);
        this.browser.setSelect_Highlight(aggr);
        if(!this.browser.ratioModeActive) {
          if(this.viewType==='map'){
            this.DOM.highlightedMeasureValue.style("left",(100*(this.mapColorScale(aggr.measure('Highlight'))/9))+"%");
          } else {
            this.DOM.highlightedMeasureValue.style("left",this.chartScale_Measure(aggr.measure('Active'))+"px");
          }
          this.DOM.highlightedMeasureValue.style("opacity",1);
        }
      }
    },
    /** -- */
    onCatLeave: function(ctgry){
      ctgry.unselectAggregate();
      if(!this.isCatSelectable(ctgry)) return;
      this.browser.clearSelect_Highlight();
      if(this.viewType==='map') this.DOM.highlightedMeasureValue.style("opacity",0);
    },
    /** -- */
    onCatEnter_OR: function(ctgry){
      this.browser.clearSelect_Highlight();
      ctgry.DOM.aggrGlyph.setAttribute("selecttype","or");
      ctgry.DOM.aggrGlyph.setAttribute("selection","selected");
      if(this.summaryFilter.selected_OR.length>0){
        this.browser.clearSelect_Highlight();
        if(this.viewType==='map') this.DOM.highlightedMeasureValue.style("opacity",0);
      }
      d3.event.stopPropagation();
    },
    /** -- */
    onCatLeave_OR: function(ctgry){
      ctgry.DOM.aggrGlyph.setAttribute("selecttype","and");
    },
    /** -- */
    onCatClick_OR: function(ctgry){
      this.filterCategory(ctgry,"OR");
      d3.event.stopPropagation();
      d3.event.preventDefault();
    },
    /** -- */
    onCatEnter_NOT: function(ctgry){
      ctgry.DOM.aggrGlyph.setAttribute("selecttype","not");
      ctgry.DOM.aggrGlyph.setAttribute("selection","selected");
      this.browser.preview_not = true;
      this.browser.setSelect_Highlight(ctgry);
      d3.event.stopPropagation();
    },
    /** -- */
    onCatLeave_NOT: function(ctgry){
      ctgry.DOM.aggrGlyph.setAttribute("selecttype","and");
      this.browser.preview_not = false;
      this.browser.clearSelect_Highlight();
      if(this.viewType==='map') this.DOM.highlightedMeasureValue.style("opacity",0);
    },
    /** -- */
    onCatClick_NOT: function(ctgry){
      var me=this;
      this.browser.preview_not = true;
      this.filterCategory(ctgry,"NOT");
      setTimeout(function(){ me.browser.preview_not = false; }, 1000);
      d3.event.stopPropagation();
      d3.event.preventDefault();
    },

    /** - */
    insertCategories: function(){
      var me = this;
      if(typeof this.DOM.aggrGroup === "undefined") return;

      var aggrGlyphSelection = this.DOM.aggrGroup.selectAll(".aggrGlyph")
        .data(this._cats, function(aggr){ return aggr.id(); });

      var DOM_cats_new = aggrGlyphSelection.enter()
        .append(this.viewType=='list' ? 'span' : 'g')
        .attr("class","aggrGlyph "+(this.viewType=='list'?'cat':'map')+"Glyph")
        .attr("selected",0)
        .on("mousedown", function(){
          this._mousemove = false;
        })
        .on("mousemove", function(){
          this._mousemove = true;
          if(this.tipsy){
            this.tipsy.jq_tip[0].style.left = (d3.event.pageX-this.tipsy.tipWidth-10)+"px";
            this.tipsy.jq_tip[0].style.top = (d3.event.pageY-this.tipsy.tipHeight/2)+"px";
          }
        })
        .attr("title",me.catTooltip?function(_cat){ return me.catTooltip.call(_cat.data); }:null);

      this.updateCatIsVisible();

      if(this.viewType==='list'){
        DOM_cats_new
          .style("height",this.heightRow_category+"px")
          .each(function(_cat){ kshf.Util.setTransform(this,"translateY(0px)"); })

        var clickArea = DOM_cats_new.append("span").attr("class", "clickArea")
          .on("mouseenter",function(_cat){
            if(me.browser.mouseSpeed<0.2) { 
              me.onCatEnter(_cat);
            } else {
              this.highlightTimeout = window.setTimeout( function(){ me.onCatEnter(_cat) }, me.browser.mouseSpeed*500);
            }
          })
          .on("mouseleave",function(_cat){ 
            if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
            me.onCatLeave(_cat);
          })
          .on("click", function(aggr){ me.onCatClick(aggr); });

        clickArea.append("span").attr("class","lockButton fa")
          .on("mouseenter",function(aggr){ 
            this.tipsy = new Tipsy(this, {
              gravity: me.panel.name==='right'?'se':'w',
              title: function(){ return kshf.lang.cur[ me.browser.selectedAggr["Compare_A"]!==aggr ? 'LockToCompare' : 'Unlock']; }
            });
            this.tipsy.show(); 
          })
          .on("mouseleave",function(){ this.tipsy.hide(); })
          .on("click",function(_cat){
            this.tipsy.hide();
            me.browser.setSelect_Compare(true);
            d3.event.preventDefault();
            d3.event.stopPropagation();
          });

        var domAttrLabel = DOM_cats_new.append("span").attr("class", "categoryLabel hasLabelWidth")
          .style("padding-top",(this.heightRow_category/2-8)+"px");

        var filterButtons = domAttrLabel.append("span").attr("class", "filterButtons");
        filterButtons.append("span").attr("class","filterButton notButton")
          .text(kshf.lang.cur.Not)
          .on("mouseover", function(_cat){ me.onCatEnter_NOT(_cat); })
          .on("mouseout",  function(_cat){ me.onCatLeave_NOT(_cat); })
          .on("click",     function(_cat){ me.onCatClick_NOT(_cat); });
        filterButtons.append("span").attr("class","filterButton orButton")
          .text(kshf.lang.cur.Or)
          .on("mouseover",function(_cat){ me.onCatEnter_OR(_cat); })
          .on("mouseout", function(_cat){ me.onCatLeave_OR(_cat); })
          .on("click",    function(_cat){ me.onCatClick_OR(_cat); });

        domAttrLabel.append("span").attr("class","theLabel").html(function(aggr){ return me.catLabel_Func.call(aggr.data); });
        DOM_cats_new.append("span").attr("class","measureLabel");

        ["Total","Active","Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(m){
          DOM_cats_new.append("span").attr("class", "measure_"+m)
            .on("mouseover" ,function(){ 
              me.browser.refreshMeasureLabels(this.classList[0].substr(8)); 
              d3.event.preventDefault();
              d3.event.stopPropagation();
            })
            .on("mouseleave",function(){
              me.browser.refreshMeasureLabels();
              d3.event.preventDefault();
              d3.event.stopPropagation();
            });
        });
        DOM_cats_new.append("span").attr("class", "total_tip");

      } else {
        DOM_cats_new
          .each(function(_cat){
            this.tipsy = new Tipsy(this, {
              gravity: 'e',
              title: function(){ 
                return "<span class='mapItemName'>"+me.catLabel_Func.call(_cat.data)+"</span>"+
                  me.browser.getMeasureLabel(_cat)+" "+me.browser.recordName;
              }
            });
          })
          .on("mouseenter",function(_cat){
            if(this.tipsy) {
              this.tipsy.show();
              this.tipsy.jq_tip[0].style.left = (d3.event.pageX-this.tipsy.tipWidth-10)+"px";
              this.tipsy.jq_tip[0].style.top = (d3.event.pageY-this.tipsy.tipHeight/2)+"px";
            }
            if(me.browser.mouseSpeed<0.2) { 
              me.onCatEnter(_cat);
            } else {
              this.highlightTimeout = window.setTimeout( function(){ me.onCatEnter(_cat) }, me.browser.mouseSpeed*500);
            }
          })
          .on("mouseleave",function(_cat){ 
            if(this.tipsy) this.tipsy.hide();
            if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
            me.onCatLeave(_cat);
          });

        DOM_cats_new.append("path").attr("class","measure_Active").on("click", function(aggr){ me.onCatClick(aggr); });
        DOM_cats_new.append("text").attr("class","measureLabel"); // label on top of (after) all the rest
      }
      this.refreshDOMcats();
    },
    /** -- */
    refreshDOMcats: function(){
      this.DOM.aggrGlyphs = this.DOM.aggrGroup.selectAll(".aggrGlyph").each(function(aggr){ aggr.DOM.aggrGlyph = this; });

      this.DOM.measureLabel    = this.DOM.aggrGlyphs.selectAll(".measureLabel");
      this.DOM.measureTotalTip = this.DOM.aggrGlyphs.selectAll(".total_tip");
      ["Total","Active","Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(m){
        this.DOM["measure_"+m] = this.DOM.aggrGlyphs.selectAll(".measure_"+m);
      },this);

      if(this.viewType==='list'){
        this.DOM.theLabel        = this.DOM.aggrGlyphs.selectAll(".theLabel");
        this.DOM.attribClickArea = this.DOM.aggrGlyphs.selectAll(".clickArea");
        this.DOM.lockButton      = this.DOM.aggrGlyphs.selectAll(".lockButton");
      }
    },
    /** -- */
    updateCatIsVisible: function(){
      if(this.viewType==='map'){
        this._cats.forEach(function(_cat){ 
          _cat.isVisible = true;
        });
      } else if(this.viewType==='list'){
        this._cats.forEach(function(_cat){
          _cat.isVisibleBefore = _cat.isVisible;
          if(!_cat.isActive){
            _cat.isVisible = false;
          } else if(_cat.orderIndex<this.firstCatIndexInView) {
            _cat.isVisible = false;
          } else if(_cat.orderIndex>this.firstCatIndexInView+this.catCount_InDisplay) {
            _cat.isVisible = false;
          } else {
            _cat.isVisible = true;
          }
        },this);
      }
    },
    /** -- */
    cullAttribs: function(){
      if(this.viewType==='map') return; // no culling on maps, for now.  
      this.DOM.aggrGlyphs.style({
        visibility: function(_cat){ return _cat.isVisible?"visible":"hidden"; },
        display   : function(_cat){ return _cat.isVisible?"block"  :"none"  ; }} );
      if(this.onCatCull) this.onCatCull.call(this);
    },
    /** -- */
    updateCatSorting: function(sortDelay,force,noAnim){
      if(this.viewType==='map') return;
      if(this._cats===undefined) return;
      if(this._cats.length===0) return;
      if(this.uniqueCategories() && this.panel===undefined) return; // Nothing to sort...
      if(this.catSortBy_Active.no_resort===true && force!==true) return;

      var me = this;

      this.updateCatCount_Active();
      this.sortCategories();

      if(this.panel===undefined) return; 
      // The rest deals with updating UI
      if(this.DOM.aggrGlyphs===undefined) return;

      this.updateCatIsVisible();

      var xRemoveOffset = -100; // disappear direction, depends on the panel location
      if(this.onCatSort) this.onCatSort.call(this);

      // Categories outside the view are invisible, expand the background box and makes the scroll bar visible if necessary.
      this.DOM.chartBackground.style("height",this.getHeight_VisibleAttrib()+"px");

      // scroll to top when re-sorted
      if(this.scrollTop_cache!==0) kshf.Util.scrollToPos_do(me.DOM.aggrGroup,0);

      this.refreshScrollDisplayMore(this.firstCatIndexInView+this.catCount_InDisplay);

      if(noAnim){
        this.DOM.aggrGlyphs.each(function(ctgry){
          this.style.opacity = 1;
          this.style.visibility = "visible";
          this.style.display = "block";

          var x = 0;
          var y = me.heightRow_category*ctgry.orderIndex;
          ctgry.posX = x;
          ctgry.posY = y;
          kshf.Util.setTransform(this,"translate("+x+"px,"+y+"px)");
        });

        this.cullAttribs();

        return;
      }

      if(sortDelay===undefined) sortDelay = 1000;
      var perCatDelay = 30;

      // Disappear animation
      me.DOM.aggrGlyphs
        .filter(function(ctgry){ return ctgry.isActiveBefore && !ctgry.isActive; })
        .transition()
          .duration(1)
          .delay(sortDelay)
          .each("end",function(ctgry){
            this.style.opacity = 0;
            ctgry.posX = xRemoveOffset;
            ctgry.posY = ctgry.posY;
            kshf.Util.setTransform(this,"translate("+ctgry.posX+"px,"+ctgry.posY+"px)");
          });

      // Appear animation (initial position)
      me.DOM.aggrGlyphs
        .filter(function(ctgry){ return !ctgry.isActiveBefore && ctgry.isActive; })
        .transition()
          .duration(1)
          .delay(sortDelay)
          .each("end",function(ctgry){
            this.style.opacity = 0;
            ctgry.posX = xRemoveOffset;
            ctgry.posY = ctgry.posY;
            kshf.Util.setTransform(this,"translate("+ctgry.posX+"px,"+ctgry.posY+"px)");
          });

      // Sort animation
      me.DOM.aggrGlyphs
        .filter(function(ctgry){ return ctgry.isActive; })
        .transition()
          .duration(1)
          .delay(function(ctgry){
            if(ctgry.isVisibleBefore && !ctgry.isVisible) return sortDelay;
            var x = ctgry.isActiveBefore ? 0:(me.catCount_InDisplay-5)*perCatDelay; // appear animation is further delayed
            return 100 + sortDelay + x + Math.min(ctgry.orderIndex,me.catCount_InDisplay+2) * perCatDelay; 
          })
          .each("end",function(ctgry){
            if(ctgry.isVisible || ctgry.isVisibleBefore){
              this.style.visibility = "visible";
              this.style.display = "block";
            } else {
              this.style.visibility = "hidden";
              this.style.display = "none";
            }
            this.style.opacity = 1;
            ctgry.posX = 0;
            ctgry.posY = me.heightRow_category*ctgry.orderIndex;
            kshf.Util.setTransform(this,"translate("+ctgry.posX+"px,"+ctgry.posY+"px)");
          });
    },
    /** -- */
    chartAxis_Measure_TickSkip: function(){
      var width = this.chartScale_Measure.range()[1];
      var ticksSkip = width/25;
      if(this.getMaxAggr_Active()>100000){
        ticksSkip = width/30;
      }
      if(this.browser.ratioModeActive){
        ticksSkip /= 1.1
      } else if(this.browser.percentModeActive){
        ticksSkip /= 1.1;
      }
      return ticksSkip;
    },

    /** --  */
    map_projectCategories: function(){
      var me = this;
      this.DOM.measure_Active.attr("d", function(_cat){
        _cat._d_ = me.catMap.call(_cat.data,_cat);
        if(_cat._d_===undefined) return;
        return me.geoPath(_cat._d_);
      });
      this.DOM.measure_Highlight.attr("d", function(_cat){
        return me.geoPath(_cat._d_);
      });
      this.DOM.measureLabel
        .attr("transform", function(_cat){
          var centroid = me.geoPath.centroid(_cat._d_);
          return "translate("+centroid[0]+","+centroid[1]+")";
        })
        .style("display",function(aggr){ 
          var bounds = me.geoPath.bounds(aggr._d_);
          var width = Math.abs(bounds[0][0]-bounds[1][0]);
          return (width<me.panel.width_catMeasureLabel)?"none":"block";
        })
        ;
    },
    /** -- */
    map_refreshBounds_Active: function(){
      // Insert the bounds for each record path into the bs
      var bs = [];
      var me = this;
      this._cats.forEach(function(_cat){
        if(!_cat.isActive) return;
        var feature = me.catMap.call(_cat.data,_cat);
        if(typeof feature === 'undefined') return;
        var b = d3.geo.bounds(feature);
        if(isNaN(b[0][0])) return;
        // Change wrapping
        if(b[0][0]>kshf.map.wrapLongitude) b[0][0]-=360;
        if(b[1][0]>kshf.map.wrapLongitude) b[1][0]-=360;
        bs.push(L.latLng(b[0][1], b[0][0]));
        bs.push(L.latLng(b[1][1], b[1][0]));
      });

      this.mapBounds_Active = new L.latLngBounds(bs);
    },
    /** --  */
    map_zoomToActive: function(){
      if(this.asdsds===undefined){ // First time: just fit bounds
        this.asdsds = true;
        this.leafletAttrMap.fitBounds(this.mapBounds_Active);
        return;
      }

      this.leafletAttrMap.flyToBounds(
        this.mapBounds_Active,
        { padding: [0,0], 
          pan: {animate: true, duration: 1.2}, 
          zoom: {animate: true} 
        }
        );
    },
    /** -- */
    map_refreshColorScale: function(){
      var me=this;
      this.DOM.mapColorBlocks
        .style("background-color", function(d){
          if(me.invertColorScale) d = 8-d;
          return kshf.colorScale[me.browser.mapColorTheme][d];
        });
    },
    /** -- */
    viewAs: function(_type){
      var me = this;
      this.viewType = _type;
      this.DOM.root.attr("viewType",this.viewType);
      if(this.viewType==='list'){
        this.DOM.aggrGroup = this.DOM.aggrGroup_list;
        if(this.heightRow_category_dirty) this.refreshHeight_Category();
        this.refreshDOMcats();
        this.updateCatSorting(0,true,true);
        return;
      }
      // 'map'
      // The map view is already initialized
      if(this.leafletAttrMap) {
        this.DOM.aggrGroup = this.DOM.summaryCategorical.select(".catMap_SVG > .aggrGroup");
        this.refreshDOMcats();

        this.map_refreshBounds_Active();
        this.map_zoomToActive();
        this.map_projectCategories();
        this.refreshViz_Active();
        return; 
      }

      var zoomInit;
      // See http://leaflet-extras.github.io/leaflet-providers/preview/ for alternative layers
      this.leafletAttrMap = L.map(this.DOM.catMap_Base[0][0], kshf.map.config )
        .addLayer( new L.TileLayer( kshf.map.tileTemplate, kshf.map.tileConfig ) )
        .on("viewreset",function(){ 
          me.map_projectCategories()
        })
        .on("movestart",function(){
          zoomInit = this.getZoom();
          me.DOM.catMap_SVG.style("opacity",0.3);
        })
        .on("move",function(){
          // console.log("MapZoom: "+me.leafletAttrMap.getZoom());
          // me.map_projectCategories()
        })
        .on("moveend",function(){
          me.DOM.catMap_SVG.style("opacity",null);
          if(zoomInit !== this.getZoom()) me.map_projectCategories();
        })
        ;

      //var width = 500, height = 500;
      //var projection = d3.geo.albersUsa().scale(900).translate([width / 2, height / 2]);
      this.geoPath = d3.geo.path().projection( 
        d3.geo.transform({
          // Use Leaflet to implement a D3 geometric transformation.
          point: function(x, y) {
            if(x>kshf.map.wrapLongitude) x-=360;
            var point = me.leafletAttrMap.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
          }
        }) 
      );

      this.mapColorQuantize = d3.scale.quantize()
        .domain([0,9])
        .range(kshf.colorScale.converge);

      this.DOM.catMap_SVG = d3.select(this.leafletAttrMap.getPanes().overlayPane)
        .append("svg").attr("xmlns","http://www.w3.org/2000/svg")
        .attr("class","catMap_SVG");

      // The fill pattern definition in SVG, used to denote geo-objects with no data.
      // http://stackoverflow.com/questions/17776641/fill-rect-with-pattern
      this.DOM.catMap_SVG.append('defs')
        .append('pattern')
          .attr('id', 'diagonalHatch')
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('width', 4)
          .attr('height', 4)
          .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .attr('stroke', 'gray')
            .attr('stroke-width', 1);

      // Add custom controls
      var DOM_control = d3.select(this.leafletAttrMap.getContainer()).select(".leaflet-control");

      DOM_control.append("a")
        .attr("class","leaflet-control-viewFit").attr("title",kshf.lang.cur.ZoomToFit)
        .attr("href","#")
        .html("<span class='viewFit fa fa-arrows-alt'></span>")
        .on("dblclick",function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
        })
        .on("click",function(){
          me.map_refreshBounds_Active();
          me.map_zoomToActive();
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });

      this.DOM.aggrGroup = this.DOM.catMap_SVG.append("g").attr("class", "leaflet-zoom-hide aggrGroup");

      // Now this will insert map svg component
      this.insertCategories();
  
      this.DOM.catMapColorScale = this.DOM.belowCatChart.append("div").attr("class","catMapColorScale");

      this.DOM.catMapColorScale.append("span").attr("class","scaleBound boundMin");
      this.DOM.catMapColorScale.append("span").attr("class","scaleBound boundMax");
      this.DOM.catMapColorScale.append("span").attr("class","scaleModeControl fa fa-arrows-h")
        .each(function(){
          this.tipsy = new Tipsy(this, { gravity: 'e', title: function(){
            return kshf.lang.cur[me.browser.ratioModeActive?'Absolute':'PartOf']+" "+kshf.lang.cur.Width; }
          });
        })
        .on("mouseenter", function(){ this.tipsy.show(); me.browser.showScaleModeControls(true); })
        .on("mouseleave", function(){ this.tipsy.hide(); me.browser.showScaleModeControls(false); })
        .on("click",      function(){ this.tipsy.hide(); me.browser.setScaleMode(!me.browser.ratioModeActive); });
      this.DOM.scaleModeControl = this.DOM.root.selectAll("scaleModeControl");

      this.DOM.measurePercentControl = this.DOM.catMapColorScale.append("span").attr("class","measurePercentControl")
        .each(function(){
          this.tipsy = new Tipsy(this, { gravity: 'w', title: function(){
            return "<span class='fa fa-eye'></span> "+kshf.lang.cur[(me.browser.percentModeActive?'Absolute':'Percent')]; },
          });
        })
        .on("mouseenter", function(){ this.tipsy.show(); me.browser.DOM.root.attr("measurePercentControl",true); })
        .on("mouseleave", function(){ this.tipsy.hide(); me.browser.DOM.root.attr("measurePercentControl",null); })
        .on("click",      function(){ this.tipsy.hide(); me.browser.setPercentLabelMode(!me.browser.percentModeActive); });

      this.DOM.highlightedMeasureValue = this.DOM.catMapColorScale.append("span").attr("class","highlightedMeasureValue");
      this.DOM.highlightedMeasureValue.append("div").attr('class','fa fa-mouse-pointer highlightedAggrValuePointer');

      this.DOM.mapColorBlocks = this.DOM.catMapColorScale.selectAll(".mapColorBlock")
        .data([0,1,2,3,4,5,6,7,8]).enter()
        .append("div").attr("class","mapColorBlock")
        .each(function(d){
          this.tipsy = new Tipsy(this, {
            gravity: 's', title: function(){
              var _minValue = Math.round(me.mapColorScale.invert(d));
              var _maxValue = Math.round(me.mapColorScale.invert(d+1));
              return Math.round(_minValue)+" to "+Math.round(_maxValue);
            }
          });
        })
        .on("mouseenter",function(){ this.tipsy.show(); })
        .on("mouseleave",function(){ this.tipsy.hide(); });

      // Set height
      var h = this.categoriesHeight;
      this.DOM.catMap_Base.style("height",h+"px");
      if(this.DOM.catMap_SVG) this.DOM.catMap_SVG.style("height",h+"px");
      if(this.leafletAttrMap) this.leafletAttrMap.invalidateSize();
      this.DOM.aggrGroup.style("height",h+"px");
      
      this.map_refreshColorScale();
      this.map_refreshBounds_Active();
      this.map_zoomToActive();
      this.map_projectCategories();
      this.refreshMeasureLabel();
      this.refreshViz_Active();
    },
    /** -- */
    printAggrSelection: function(aggr){
      return this.catLabel_Func.call(aggr.data);
    }
};
for(var index in Summary_Categorical_functions){
  kshf.Summary_Categorical.prototype[index] = Summary_Categorical_functions[index];
}



/**
 * Keshif Interval Summary
 * @constructor
 */
kshf.Summary_Interval = function(){};
kshf.Summary_Interval.prototype = new kshf.Summary_Base();
var Summary_Interval_functions = {
    initialize: function(browser,name,attribFunc){
      kshf.Summary_Base.prototype.initialize.call(this,browser,name,attribFunc);
      this.type='interval';

      // Call the parent's constructor
      var me = this;

      // pixel width settings...
      this.height_hist        = 1;   // Initial width (will be updated later...)
      this.height_hist_min    = 10;  // Minimum possible histogram height
      this.height_hist_max    = 100; // Maximim possible histogram height
      this.height_slider      = 12;  // Slider height
      this.height_labels      = 13;  // Height for labels
      this.height_hist_topGap = 12;  // Height for histogram gap on top.
      this.height_recEncoding = 20;  // Record encoding chart height
      this.height_percentile  = 32;  // Percentile chart height
      this.width_barGap       = 2;   // The width between neighboring histgoram bars
      this.width_measureAxisLabel = 30; // ..
      this.optimumTickWidth   = 45;

      this.hasFloat = false;
      this.timeTyped = { 
        base: false,
        maxDateRes: function(){
          //if(this.hour ) return "hour";
          if(this.day  ) return "day";
          if(this.month) return "month";
          if(this.year ) return "year";
        },
        minDateRes: function(){
          if(this.year ) return "year";
          if(this.month) return "month";
          if(this.day  ) return "day";
          //if(this.hour ) return "hour";
        }
      };

      this.unitName = undefined; // the text appended to the numeric value (TODO: should not apply to time)
      this.percentileChartVisible = false;
      this.zoomed = false;
      this.usedForSorting = false;
      this.invertColorScale = false;

      this.highlightRangeLimits_Active = false;

      this.histBins = [];
      this.intervalTicks = [];
      this.intervalRange = {
        getActiveMax: function(){ 
          if(!me.stepTicks) return this.active.max;
          if(me.scaleType==='time') {
            return new Date(this.active.max.getTime()+1000); // TODO
          } else {
            return this.active.max+1;
          }
        },
        getTotalMax: function(){ 
          if(!me.stepTicks) return this.total.max;
          if(me.scaleType==='time') {
            return new Date(this.total.max.getTime()+1000); // TODO
          } else {
            return this.total.max+1;
          }
        }
      };

      if(this.records.length<=1000) this.initializeAggregates();

      // only used if type is numeric (not timestamp)
      this.quantile_val = {};
      this.quantile_pos = {};

      this.timeAxis_XFunc = function(aggr){ 
        //return me.valueScale(aggr.minV) + me.getWidth_Bin()/2;
        return (me.valueScale(aggr.minV) + me.valueScale(aggr.maxV))/2;
      };
    },
    /** -- */
    isEmpty: function(){
      return this._isEmpty;
    },
    /** -- */
    getHeight_Extra: function(){
      return 7+
        this.height_hist_topGap+
        this.height_labels+
        this.height_slider+
        this.getHeight_Percentile()+
        this.getHeight_RecordEncoding();
    },
    /** -- */
    getHeight_Extra_max: function(){
      return 7+
        this.height_hist_topGap+
        this.height_labels+
        this.height_slider+
        this.height_recEncoding
        this.height_percentile;
    },
    /** -- */
    getHeight_RecordEncoding: function(){
      if(this.usedForSorting && this.browser.recordDisplay) {
        if(this.browser.recordDisplay.displayType==='map' || this.browser.recordDisplay.displayType==='nodelink')
          return this.height_recEncoding; 
      }
      return 0;
    },
    /** -- */
    getHeight_Content: function(){
      return this.height_hist + this.getHeight_Extra();
    },
    /** -- */
    getHeight_Percentile: function(){
      return this.percentileChartVisible ? this.height_percentile : 0;
    },
    /** -- */
    getHeight_RangeMax: function(){
      return this.height_hist_max + this.getHeight_Header() + this.getHeight_Extra_max();
    },
    /** -- */
    getHeight_RangeMin: function(){
      return this.height_hist_min + this.getHeight_Header() + this.getHeight_Extra_max();
    },
    /** -- */
    getWidth_Chart: function(){
      if(!this.inBrowser()) return 30;
      return this.getWidth() - this.width_measureAxisLabel -
        ( this.getWidth()>400 ? this.width_measureAxisLabel : 11 );
    },
    /** -- */
    getWidth_OptimumTick: function(){
      if(!this.inBrowser()) return 10;
      return this.optimumTickWidth;
    },
    /** -- */
    getWidth_Bin: function(){
      return this.aggrWidth-this.width_barGap*2;
    },
    /** -- */
    isFiltered_min: function(){
      if(this.summaryFilter.active.min>this.intervalRange.total.min) return true;
      if(this.scaleType==='log') return this.isFiltered_max();
      return false;
    },
    /** -- */
    isFiltered_max: function(){
      return this.summaryFilter.active.max<this.intervalRange.getTotalMax();
    },
    /** -- */
    getMaxAggr_Total: function(){
      return d3.max(this.histBins,function(aggr){ return aggr.measure('Total'); });
    },
    /** -- */
    getMaxAggr_Active: function(){
      return d3.max(this.histBins,function(aggr){ return aggr.measure('Active'); });
    },
    /** -- */
    isTimeStamp: function(){
      return this.timeTyped.base;
    },
    /** -- */
    createMonthSummary: function(){
      if(!this.isTimeStamp()) return;
      if(this.summary_sub_month) return this.summary_sub_month;
      var summaryID = this.summaryID;
      this.summary_sub_month = this.browser.createSummary(
        "Month of "+this.summaryName,
        function(d){
          var arr=d._valueCache[summaryID];
          return (arr===null) ? null : arr.getUTCMonth();
        },
        'categorical'
      );
      this.summary_sub_month.setSortingOptions("id");
      this.summary_sub_month.setCatLabel(_demo.Month);
      this.summary_sub_month.initializeAggregates();
      return this.summary_sub_month;
    },
    /** -- */
    createDaySummary: function(){
      if(!this.isTimeStamp()) return;
      if(this.summary_sub_day) return this.summary_sub_day;
      var summaryID = this.summaryID;
      this.summary_sub_day = this.browser.createSummary(
        "WeekDay of "+this.summaryName,
        function(d){
          var arr=d._valueCache[summaryID];
          return (arr===null) ? null : arr.getUTCDay();
        },
        'categorical'
      );
      this.summary_sub_day.setSortingOptions("id");
      this.summary_sub_day.setCatLabel(_demo.DayOfWeek);
      this.summary_sub_day.initializeAggregates();
      return this.summary_sub_day;
    },
    /** -- */
    createHourSummary: function(){
      if(!this.isTimeStamp()) return;
      if(this.summary_sub_hour) return this.summary_sub_hour;
      var summaryID = this.summaryID;
      this.summary_sub_hour = this.browser.createSummary(
        "Hour of "+this.summaryName,
        function(d){
          var arr=d._valueCache[summaryID];
          return (arr===null) ? null : arr.getUTCHours();
        },
        'interval'
      );
      this.summary_sub_hour.initializeAggregates();
      this.summary_sub_hour.setUnitName(":00");
      return this.summary_sub_hour;
    },
    /** -- */
    initializeAggregates: function(){
      if(this.aggr_initialized) return;
      var me = this;
      this.getRecordValue = function(record){ return record._valueCache[me.summaryID]; };

      this.records.forEach(function(record){
        var v=this.summaryFunc.call(record.data,record);
        if(v===undefined) v=null;
        if(isNaN(v)) v=null;
        if(v!==null){
          if(v instanceof Date){
            this.timeTyped.base = true;
          } else {
            if(typeof v!=='number'){
              v = null;
            } else{
              this.hasFloat = this.hasFloat || v%1!==0;
            }
          }
        }
        record._valueCache[this.summaryID] = v;
        if(v===null) this.missingValueAggr.addRecord(record);
      },this);

      if(this.timeTyped.base===true){
        // Check time resolutions
        this.timeTyped.month = false;
        this.timeTyped.hour = false;
        this.timeTyped.day = false;
        this.timeTyped.year = false;
        var tempYear = null;
        this.records.forEach(function(record){
          v = record._valueCache[this.summaryID];
          if(v) {
            if(v.getUTCMonth()!==0) this.timeTyped.month = true;
            if(v.getUTCHours()!==0) this.timeTyped.hour  = true;
            if(v.getUTCDate() !==1) this.timeTyped.day   = true;
            if(!this.timeTyped.year){
              if(tempYear===null) {
                tempYear = v.getUTCFullYear();
              } else {
                if(tempYear !== v.getUTCFullYear()) this.timeTyped.year = true;
              }
            }
          }
        },this);

        // the print function for timestamp -- only considering year/month/day now
        var f="";
        if(this.timeTyped.year) f = "'%y";
        if(this.timeTyped.month) f = "%b "+f;
        if(this.timeTyped.day) f = "%e " + f;
        if(this.timeTyped.year && !this.timeTyped.month) f = "%Y"; // Full year
        this.timeTyped.print = d3.time.format.utc(f);
      }

      // remove records that map to null / undefined
      this.filteredRecords = this.records.filter(function(record){
        var v = me.getRecordValue(record);
        return (v!==undefined && v!==null);
      });

      // Sort the items by their attribute value
      var sortValue = this.isTimeStamp()?
        function(a){ return me.getRecordValue(a).getTime(); }:
        function(a){ return me.getRecordValue(a); };
      this.filteredRecords.sort(function(a,b){ return sortValue(a)-sortValue(b); });

      this.updateIntervalRange_Total();

      this.detectScaleType();
      this.resetFilterRangeToTotal();

      this.aggr_initialized = true;
      this.refreshViz_Nugget();
      this.refreshViz_EmptyRecords();
    },
    /** -- */
    setStepTicks: function(v){
      this.stepTicks = v;
      if(this.stepTicks && !this.zoomed){
        this.resetFilterRangeToTotal();
      }
    },
    /** -- */
    setTimeFormat: function(fmt){
      var timeFormatFunc = null;
      if(fmt==="%Y"){
        timeFormatFunc = function(v){ if(v && v!=="") return new Date(1*v,0); };
      } else if(fmt===undefined || fmt===null) {
        return;
        timeFormatFunc = null;
      } else {
        timeFormatFunc = d3.time.format(fmt).parse;
      }
      var f=this.summaryFunc;
      this.summaryFunc = function(record){
        var v = f.call(this,record);
        if(v===undefined || v===null || v==="") return;
        return timeFormatFunc(v);
      }

      this.aggr_initialized = false;
    },
    /** -- */
    detectScaleType: function(){
      if(this.isEmpty()) return;
      var me = this;
      this.stepTicks = false;

      if(this.isTimeStamp()) {
        this.setScaleType('time',true);
        return;
      }

      // decide scale type based on the filtered records
      // NOT TIME!
      var inViewRecords = function(record){
        var v = record._valueCache[me.summaryID];
        if(v>=me.intervalRange.active.min && v<me.intervalRange.getActiveMax()) return v; // value is within filtered range
      };
      var deviation   = d3.deviation(this.filteredRecords, inViewRecords);
      var activeRange = this.intervalRange.getActiveMax()-this.intervalRange.active.min;

      var _width_ = this.getWidth_Chart();
      var stepRange = (this.intervalRange.getActiveMax()-this.intervalRange.active.min)+1;

      // Apply step range before you check for log - it has higher precedence
      if(!this.hasFloat && (( _width_ / this.getWidth_OptimumTick()) >= stepRange) ){
        this.setStepTicks(true);
        this.setScaleType('linear',false); // converted to step on display
        return;
      }

      // LOG SCALE
      if(deviation/activeRange<0.12 && this.intervalRange.org.min>0){
        this.setScaleType('log',false);
        return;
      }

      // The scale can be linear or step after this stage
      if(!this.hasFloat && (( _width_ / this.getWidth_OptimumTick()) >= stepRange) ){
        this.setStepTicks(true);
      }
      this.setScaleType('linear',false);
    },
    /** -- */
    createSummaryFilter: function(){
      var me=this;
      this.summaryFilter = this.browser.createFilter({
        summary: this,
        title: function(){ return me.summaryName; },
        onClear: function(){
          if(this.filteredBin){
            this.filteredBin = undefined;
          }
          me.DOM.root.attr("filtered",false);
          if(me.zoomed){
            me.setZoomed(false);
          }
          me.resetFilterRangeToTotal();
          me.refreshIntervalSlider();
          if(me.DOM.missingValueAggr) me.DOM.missingValueAggr.attr("filtered",null);
        },
        onFilter: function(){
          me.DOM.root.attr("filtered",true);
          var valueID = me.summaryID;
          if(me.missingValueAggr.filtered){
            me.records.forEach(function(record){
              record.setFilterCache(this.filterID, record._valueCache[valueID]===null);
            },this);
            return;
          }

          var i_min = this.active.min;
          var i_max = this.active.max;

          me.stepRange = false;

          if(me.stepTicks){
            if(me.scaleType==='time'){
              // TODO
            } else {
              if(i_min+1===i_max) me.stepRange = true;
            }
          }

          var isFilteredCb;
          if(me.isFiltered_min() && me.isFiltered_max()){
            isFilteredCb = function(v){ return v>=i_min && v<i_max; };
          } else if(me.isFiltered_min()){
            isFilteredCb = function(v){ return v>=i_min; };
          } else {// me.isFiltered_max()
            isFilteredCb = function(v){ return v<i_max; };
          }

          // TODO: Optimize: Check if the interval scale is extending/shrinking or completely updated...
          me.records.forEach(function(record){
            var v = record._valueCache[valueID];
            record.setFilterCache(this.filterID, (v!==null)?isFilteredCb(v):false);
          },this);

          var sign = "plus";
          if(me.stepTicks) {
            if(me.scaleType==="time"){
              if(me.timeTyped.maxDateRes()===me.timeTyped.activeRes.type){
                sign = me.zoomed ? "minus" : "";
              } else {
                sign = "plus";
              }
            } else {
              sign = me.zoomed ? "minus" : "";
            }
          }

          me.DOM.zoomControl.attr("sign", sign);

          me.refreshIntervalSlider();
        },
        filterView_Detail: function(){
          return (me.missingValueAggr.filtered) ? kshf.lang.cur.NoData : me.printAggrSelection();
        },
      });
    },
    /** -- */
    printAggrSelection: function(aggr){
      var minValue, maxValue;
      if(aggr){
        minValue = aggr.minV;
        maxValue = aggr.maxV;
      } else {
        minValue = this.summaryFilter.active.min;
        maxValue = this.summaryFilter.active.max;
      }
      if(this.isTimeStamp()){
        return "<b>"+this.printWithUnitName(minValue)+"</b> to "+
               "<b>"+this.printWithUnitName(maxValue)+"</b>";
      }
      if(this.stepTicks){
        if(this.stepRange || aggr) {
          return "<b>"+this.printWithUnitName(minValue)+"</b>";
        }
      }
      if(this.hasFloat){
        minValue = minValue.toFixed(2);
        maxValue = maxValue.toFixed(2);
      }
      var minIsLarger  = minValue > this.intervalRange.total.min;
      var maxIsSmaller = maxValue < this.intervalRange.getTotalMax();

      var printMax = maxValue;
      if(this.stepTicks) printMax--;

      if(minIsLarger && maxIsSmaller){
        return "<b>"+this.printWithUnitName(minValue)+"</b> to <b>"+this.printWithUnitName(printMax)+"</b>";
      } else if(minIsLarger){
        return "<b>at least "+this.printWithUnitName(minValue)+"</b>";
      } else {
        return "<b>at most "+this.printWithUnitName(printMax)+"</b>";
      }
    },
    /** -- */
    refreshViz_Nugget: function(){
      if(this.DOM.nugget===undefined) return;

      var nuggetChart = this.DOM.nugget.select(".nuggetChart");

      this.DOM.nugget
        .attr("aggr_initialized",this.aggr_initialized)
        .attr("datatype",this.getDataType());

      if(!this.aggr_initialized) return;

      if(this.uniqueCategories()){
        this.DOM.nugget.select(".nuggetInfo").html("<span class='fa fa-tag'></span><br>Unique");
        nuggetChart.style("display",'none');
        return;
      }

      var maxAggregate_Total = this.getMaxAggr_Total();

      if(this.intervalRange.org.min===this.intervalRange.org.max){
        this.DOM.nugget.select(".nuggetInfo").html("only<br>"+this.intervalRange.org.min);
        nuggetChart.style("display",'none');
        return;
      }

      var totalHeight = 17;
      nuggetChart.selectAll(".nuggetBar").data(this.histBins).enter()
        .append("span").attr("class","nuggetBar")
        .style("height",function(aggr){
          return totalHeight*(aggr.records.length/maxAggregate_Total)+"px";
        });

      this.DOM.nugget.select(".nuggetInfo").html(
        "<span class='num_left'>"+this.intervalTickPrint(this.intervalRange.org.min)+"</span>"+
        "<span class='num_right'>"+this.intervalTickPrint(this.intervalRange.org.max)+"</span>");
    },
    /** -- */
    resetActiveRangeToTotal: function(){
      this.intervalRange.active = {
        min: this.intervalRange.total.min,
        max: this.intervalRange.total.max
      };
    },
    /** -- */
    resetFilterRangeToTotal: function(){
      this.summaryFilter.active = {
        min: this.intervalRange.total.min,
        max: this.intervalRange.getTotalMax()
      };
    },
    /** -- */
    updateIntervalRange_Total: function(){
      this.intervalRange.org = {
        min: d3.min(this.filteredRecords,this.getRecordValue),
        max: d3.max(this.filteredRecords,this.getRecordValue)
      }

      this._isEmpty = this.intervalRange.org.min===undefined;
      //if(this._isEmpty) this.setCollapsed(true);

      // Always integer
      if(this.isTimeStamp()){
        this.intervalRange.total = {
          min: this.intervalRange.org.min,
          max: this.intervalRange.org.max
        };
      } else {
        this.intervalRange.total = {
          min: Math.floor(this.intervalRange.org.min),
          max: Math.ceil(this.intervalRange.org.max)
        };

        if(this.scaleType==='log' && this.intervalRange.total.min===0){
          this.intervalRange.total.min = this.intervalRange.org.min;
        }
      }

      if(this.stepTicks){
        if(this.scaleType==="time"){
          // TODO
        } else {
          this.intervalRange.total.max++;
        }
      }
      this.resetActiveRangeToTotal();
    },
    /** --- */
    checkFilterRange: function(){
      if(this.scaleType==='time'){
        this.summaryFilter.active.min = this.getClosestTick(this.summaryFilter.active.min);
        this.summaryFilter.active.max = this.getClosestTick(this.summaryFilter.active.max);
        return;
      }

      if(this.stepTicks || !this.hasFloat){
        this.summaryFilter.active.min=Math.floor(this.summaryFilter.active.min);
        this.summaryFilter.active.max=Math.ceil(this.summaryFilter.active.max);
      }

      // Make sure the range is within the visible limits:
      this.summaryFilter.active.min = Math.max(this.summaryFilter.active.min, this.intervalRange.active.min);
      this.summaryFilter.active.max = Math.min(this.summaryFilter.active.max, this.intervalRange.getActiveMax());
    },
    /** -- */
    setScaleType: function(t,force){
      var me=this;

      this.viewType = t==='time'?'line':'bar';
      if(this.DOM.inited) {
        this.DOM.root.attr("viewType",this.viewType);
      }

      if(force===false && this.scaleType_forced) return;

      this.scaleType = t;
      if(force) this.scaleType_forced = this.scaleType;
      
      if(this.DOM.inited){
        this.DOM.summaryConfig.selectAll(".summaryConfig_ScaleType .configOption").attr("active",false);
        this.DOM.summaryConfig.selectAll(".summaryConfig_ScaleType .pos_"+this.scaleType).attr("active",true);
        this.DOM.summaryInterval.attr("scaleType",this.scaleType);
      }

      if(this.filteredRecords === undefined) return;

      // remove records with value:0 (because log(0) is invalid)
      if(this.scaleType==='log'){
        if(this.intervalRange.total.min<=0){
          var x=this.filteredRecords.length;
          this.filteredRecords = this.filteredRecords.filter(function(record){ 
            var v=this.getRecordValue(record)!==0;
            if(v===false) {
              record._valueCache[this.summaryID] = null;
              // TODO: Remove from existing aggregate for this summary
              this.missingValueAggr.addRecord(record);
            }
            return v;
          },this);
          this.updateIntervalRange_Total();
          this.resetFilterRangeToTotal();
        }
      }
      this.updateScaleAndBins(true);
      if(this.usedForSorting) this.browser.recordDisplay.refreshRecordColors();
    },
    /** -- */
    refreshPercentileChart: function(){
      this.DOM.percentileGroup
        .style("opacity",this.percentileChartVisible?1:0)
        .attr("percentileChartVisible",this.percentileChartVisible);
      if(this.percentileChartVisible){
        this.DOM.percentileGroup.style("height",(this.height_percentile-2)+"px");
      }
      this.DOM.summaryConfig.selectAll(".summaryConfig_Percentile .configOption").attr("active",false);
      this.DOM.summaryConfig.selectAll(".summaryConfig_Percentile .pos_"+this.percentileChartVisible).attr("active",true);
    },
    /** -- */
    showPercentileChart: function(v){
      if(v===true) v = "Extended";
      this.percentileChartVisible = v;
      if(this.DOM.inited) {
        var curHeight = this.getHeight();
        this.refreshPercentileChart();
        if(this.percentileChartVisible) this.updatePercentiles("Active");
        this.setHeight(curHeight);
        this.browser.updateLayout_Height();
      }
    },
    /** -- */
    initDOM: function(beforeDOM){
      this.initializeAggregates();
      if(this.isEmpty()) return;
      if(this.DOM.inited===true) return;
      var me = this;

      this.insertRoot(beforeDOM);
      this.DOM.root
        .attr("summary_type","interval")
        .attr("usedForSorting",this.usedForSorting)
        .attr("viewType",this.viewType);

      this.insertHeader();

      this.initDOM_IntervalConfig();

      this.DOM.summaryInterval = this.DOM.wrapper.append("div").attr("class","summaryInterval")
        .attr("scaleType",this.scaleType)
        .attr("zoomed",this.zoomed)
        .on("mousedown",function(){
          d3.event.stopPropagation();
          d3.event.preventDefault();
        });

      this.DOM.histogram = this.DOM.summaryInterval.append("div").attr("class","histogram");
      this.DOM.histogram_bins = this.DOM.histogram.append("div").attr("class","aggrGroup")
        .on("mousemove", function(){
          if(d3.event.shiftKey){
            var pointerPosition = me.valueScale.invert(d3.mouse(this)[0]);
            if(this.initPos===undefined){
              this.initPos = pointerPosition;
            }
            var maxPos = d3.max([this.initPos, pointerPosition]);
            var minPos = d3.min([this.initPos, pointerPosition]);
            if(me.scaleType!=="time" && !me.hasFloat){
              maxPos = Math.round(maxPos);
              minPos = Math.round(minPos);
            }
            me.highlightRangeLimits_Active = true;
            // Set preview selection
            var records = [];
            me.filteredRecords.forEach(function(record){ 
              var v = me.getRecordValue(record);
              if(v>=minPos && v<=maxPos) records.push(record);
              else record.remForHighlight(true);
            });
            me.browser.flexAggr_Highlight.summary = me;
            me.browser.flexAggr_Highlight.records = records;
            me.browser.flexAggr_Highlight.minV = minPos;
            me.browser.flexAggr_Highlight.maxV = maxPos;
            me.browser.setSelect_Highlight();
            d3.event.preventDefault();
            d3.event.stopPropagation();
          } else {
            if(me.highlightRangeLimits_Active){
              this.initPos = undefined;
              me.browser.clearSelect_Highlight();
              d3.event.preventDefault();
              d3.event.stopPropagation();
            }
          }
        })
        .on("click", function(){
          if(d3.event.shiftKey && me.highlightRangeLimits_Active){
            // Lock for comparison
            me.browser.flexAggr_Compare_A.minV = me.browser.flexAggr_Highlight.minV;
            me.browser.flexAggr_Compare_A.maxV = me.browser.flexAggr_Highlight.maxV;
            me.browser.setSelect_Compare(false);
            this.initPos = undefined;
            d3.event.preventDefault();
            d3.event.stopPropagation();
          }
        });
      
      this.DOM.highlightRangeLimits = this.DOM.histogram_bins.selectAll(".highlightRangeLimits")
        .data([0,1]).enter()
        .append("div").attr("class","highlightRangeLimits");

      if(this.scaleType==='time'){
        this.DOM.timeSVG = this.DOM.histogram.append("svg").attr("class","timeSVG")
          .attr("xmlns","http://www.w3.org/2000/svg")
          .style("margin-left",(this.width_barGap)+"px");

        var x = this.DOM.timeSVG.append('defs')
          .selectAll("marker")
          .data([ 
            'kshfLineChartTip_Active', 
            'kshfLineChartTip_Highlight', 
            'kshfLineChartTip_Compare_A', 
            'kshfLineChartTip_Compare_B', 
            'kshfLineChartTip_Compare_C',
          ]).enter()
          .append('marker')
          .attr('id', function(d){ return d; })
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('viewBox', "0 0 20 20")
          .attr('refX', 10)
          .attr('refY', 10)
          .attr('markerUnits', 'strokeWidth')
          .attr('markerWidth', 9)
          .attr('markerHeight', 9)
          .attr('orient', "auto")
          .append('circle')
            .attr("r",5)
            .attr("cx",10)
            .attr("cy",10);
      }

      this.insertChartAxis_Measure(this.DOM.histogram, 'w', 'nw');

      this.initDOM_Slider();
      this.initDOM_RecordMapColor();
      this.initDOM_Percentile();

      this.detectScaleType();

      this.setCollapsed(this.collapsed);
      this.setUnitName(this.unitName);

      this.DOM.inited = true;
    },
    /** -- */
    setZoomed: function(v){
      this.zoomed = v;
      this.DOM.summaryInterval.attr("zoomed",this.zoomed);
      if(this.zoomed){
        this.intervalRange.active.min = this.summaryFilter.active.min;
        this.intervalRange.active.max = this.summaryFilter.active.max;
        this.DOM.zoomControl.attr("sign","minus");
      } else {
        this.resetActiveRangeToTotal();
        this.DOM.zoomControl.attr("sign","plus");
      }
      this.detectScaleType();
      this.updateScaleAndBins();
    },
    /** -- */
    setUnitName: function(v){
      this.unitName = v;
      if(this.unitName && this.DOM.unitNameInput) this.DOM.unitNameInput[0][0].value = this.unitName;
      this.refreshValueTickLabels();
      if(this.usedForSorting && this.browser.recordDisplay.recordViewSummary){
        this.browser.recordDisplay.refreshRecordSortLabels();
      }
    },
    /** -- */
    printWithUnitName: function(v,noDiv){
      if(v instanceof Date) return this.timeTyped.print(v);
      v = v.toLocaleString();
      if(this.unitName){
        var s = noDiv ? this.unitName : ("<span class='unitName'>"+this.unitName+"</span>");
        return (this.unitName==='$' || this.unitName==='€') ? (s+v) : (v+s); // currency comes before
      }
      return v;
    },
    /** -- */
    setAsRecordSorting: function(){
      this.usedForSorting = true;
      if(this.DOM.root) this.DOM.root.attr("usedForSorting","true");
    },
    /** -- */
    clearAsRecordSorting: function(){
      this.usedForSorting = false;
      if(this.DOM.root) this.DOM.root.attr("usedForSorting","false");
    },
    /** -- */
    initDOM_IntervalConfig: function(){
      var me=this, x;

      var summaryConfig_UnitName = this.DOM.summaryConfig.append("div")
        .attr("class","summaryConfig_UnitName summaryConfig_Option");
      summaryConfig_UnitName.append("span").text("Value Unit: ");
      this.DOM.unitNameInput = summaryConfig_UnitName.append("input").attr("type","text")
        .attr("class","unitNameInput")
        .attr("placeholder",kshf.unitName)
        .attr("maxlength",5)
        .on("input",function(){
          if(this.timer) clearTimeout(this.timer);
          var x = this;
          var queryString = x.value.toLowerCase();
          this.timer = setTimeout( function(){
            me.setUnitName(queryString);
          }, 750);
        });;

      // Show the linear/log scale transformation only if...
      if(this.scaleType!=='time' && !this.stepTicks && this.intervalRange.org.min>0){
        this.DOM.summaryConfig_ScaleType = this.DOM.summaryConfig.append("div")
          .attr("class","summaryConfig_ScaleType summaryConfig_Option");
        this.DOM.summaryConfig_ScaleType.append("span").html("<i class='fa fa-arrows-h'></i> Scale: ");
        x = this.DOM.summaryConfig_ScaleType.append("span").attr("class","optionGroup");
        x.selectAll(".configOption").data(
          [
            {l:"Linear <span style='font-size:0.8em; color: gray'>(1,2,3,4,5)</span>",v:"Linear"},
            {l:"Log <span style='font-size:0.8em; color: gray'>(1,2,4,8,16)</span>", v:"Log"}
            ])
          .enter()
          .append("span").attr("class",function(d){ return "configOption pos_"+d.v.toLowerCase();})
          .attr("active",function(d){ return d.v.toLowerCase()===me.scaleType; })
          .html(function(d){ return d.l; })
          .on("click", function(d){ me.setScaleType(d.v.toLowerCase(),true); })
      }

      var summaryConfig_Percentile = this.DOM.summaryConfig.append("div")
        .attr("class","summaryConfig_Percentile summaryConfig_Option");
      summaryConfig_Percentile.append("span").text("Percentile Charts: ")
      x = summaryConfig_Percentile.append("span").attr("class","optionGroup");
      x.selectAll(".configOption").data(
        [ {l:"<i class='bl_Active'></i><i class='bl_Highlight'></i>"+
            "<i class='bl_Compare_A'></i><i class='bl_Compare_B'></i><i class='bl_Compare_C'></i> Show",v:"Extended"},
          {l:"<i class='fa fa-eye-slash'></i> Hide",v:false}
        ]).enter()
        .append("span")
        .attr("class",function(d){ return "configOption pos_"+d.v;})
        .attr("active",function(d){ return d.v===me.percentileChartVisible; })
        .html(function(d){ return d.l; })
        .on("click", function(d){ me.showPercentileChart(d.v); });
    },
    /** -- */
    initDOM_Percentile: function(){
      if(this.DOM.summaryInterval===undefined) return;

      var me=this;
      this.DOM.percentileGroup = this.DOM.summaryInterval.append("div").attr("class","percentileGroup");
      this.DOM.percentileGroup.append("span").attr("class","percentileTitle").html(kshf.lang.cur.Percentiles);

      this.DOM.quantile = {};

      function addPercentileDOM(distr){
        var parent = me.DOM.percentileGroup.append("div").attr("class","percentileChart_"+distr);

        [[10,90],[20,80],[30,70],[40,60]].forEach(function(qb){
          this.DOM.quantile[distr+qb[0]+"_"+qb[1]] = parent.append("span")
            .attr("class","quantile q_range q_"+qb[0]+"_"+qb[1]+" aggrGlyph")
            .each(function(){
              this.tipsy = new Tipsy(this, {
                gravity: 's',
                title: function(){
                  return "<span style='font-weight:300; "+
                      "text-decoration: underline'><b>"+qb[0]+"</b>% - <b>"+qb[1]+"</b>% Percentile:<br></span>"+
                    "<span style='font-weight:500'>"+me.intervalTickPrint(me.quantile_val[distr+qb[0]])+"</span> - "+
                    "<span style='font-weight:500'>"+me.intervalTickPrint(me.quantile_val[distr+qb[1]])+"</span>";
                }
              })
            })
            .on("mouseover",function(){ 
              this.tipsy.show();
              var records = [];
              me.filteredRecords.forEach(function(record){ 
                var v = me.getRecordValue(record);
                if(v>=me.quantile_val[distr+qb[0]] && v<=me.quantile_val[distr+qb[1]]) records.push(record);
              });
              me.browser.flexAggr_Highlight.summary = me;
              me.browser.flexAggr_Highlight.records = records;
              me.browser.flexAggr_Highlight.minV = me.quantile_val[distr+qb[0]];
              me.browser.flexAggr_Highlight.maxV = me.quantile_val[distr+qb[1]];
              me.highlightRangeLimits_Active = true;
              me.browser.setSelect_Highlight();
            })
            .on("mouseout" ,function(){
              this.tipsy.hide();
              me.browser.clearSelect_Highlight();
            })
            .on("click", function(){
              if(d3.event.shiftKey){
                me.browser.flexAggr_Compare_A.minV = me.quantile_val[distr+qb[0]];
                me.browser.flexAggr_Compare_A.maxV = me.quantile_val[distr+qb[1]];
                me.browser.setSelect_Compare(me.browser.flexAggr_Compare_A, false);
                return;
              }
              me.summaryFilter.active = {
                min: me.quantile_val[distr+qb[0]],
                max: me.quantile_val[distr+qb[1]]
              };
              me.summaryFilter.filteredBin = undefined;
              me.summaryFilter.addFilter();
            })
            ;
        },this);

        [10,20,30,40,50,60,70,80,90].forEach(function(q){
          this.DOM.quantile[distr+q] = parent.append("span")
            .attr("class","quantile q_pos q_"+q)
            .each(function(){
              this.tipsy = new Tipsy(this, {
                gravity: 's', title: function(){ return "<u>Median:</u><br> "+ me.quantile_val[distr+q]; }
              });
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout" ,function(){ this.tipsy.hide(); });
        },this);
      };

      addPercentileDOM.call(this, "Active");
      addPercentileDOM.call(this, "Highlight");
      addPercentileDOM.call(this, "Compare_C");
      addPercentileDOM.call(this, "Compare_B");
      addPercentileDOM.call(this, "Compare_A");

      this.refreshPercentileChart();
    },
    /** --
        Uses
        - this.scaleType
        - this.intervalRange
        Updates
        - this.intervalTickPrint
        - this.valueScale.nice()
        Return
        - the tick values in an array
      */
    getValueTicks: function(optimalTickCount){
        var me=this;
        var ticks;

        // HANDLE TIME CAREFULLY
        if(this.scaleType==='time') {
            // 1. Find the appropriate aggregation interval (day, month, etc)
            var timeRange_ms = this.intervalRange.getActiveMax()-this.intervalRange.active.min; // in milliseconds
            var timeInterval;
            optimalTickCount *= 1.3;

            // Listing time resolutions, from high-res to low-res
            var timeMult = {
              'second': 1000,
              'minute': 1000*60,
              'hour'  : 1000*60*60,
              'day'   : 1000*60*60*24,
              'month' : 1000*60*60*24*30,
              'year'  : 1000*60*60*24*365,
            };

            var timeRes = [
              {
                type: 'second',
                step: 1,
                format: '%S'
              },{
                type: 'second',
                step: 5,
                format: '%S'
              },{
                type: 'second',
                step: 15,
                format: '%S'
              },{
                type: 'minute',
                step: 1,
                format: '%M'
              },{
                type: 'minute',
                step: 5,
                format: '%M'
              },{
                type: 'minute',
                step: 15,
                format: '%M'
              },{
                type: 'hour',
                step: 1,
                format: '%H'
              },{
                type: 'hour',
                step: 6,
                format: '%H'
              },{
                type: 'day',
                step: 1,
                format: '%e'
              },{
                type: 'day',
                step: 4,
                format: function(v){
                  var suffix = kshf.Util.ordinal_suffix_of(v.getUTCDate());
                  var first=d3.time.format.utc("%-b")(v);
                  return suffix+"<br>"+first;
                },
                twoLine: true
              },{
                type: 'month',
                step: 1,
                format: function(v){
                  var nextTick = timeInterval.offset(v, 1);
                  var first=d3.time.format.utc("%-b")(v);
                  var s=first;
                  if(first==="Jan") s+="<br><span class='secondLayer'>"+(d3.time.format("%Y")(nextTick))+"</span>";
                  return s;
                },
                twoLine: true
              },{
                type: 'month',
                step: 3,
                format: function(v){
                  var nextTick = timeInterval.offset(v, 3);
                  var first=d3.time.format.utc("%-b")(v);
                  var s=first;
                  if(first==="Jan") s+="<br><span class='secondLayer'>"+(d3.time.format("%Y")(nextTick))+"</span>";
                  return s;
                },
                twoLine: true
              },{
                type: 'month',
                step: 6,
                format: function(v){
                  var nextTick = timeInterval.offset(v, 6);
                  var first=d3.time.format.utc("%-b")(v);
                  var s=first;
                  if(first==="Jan") s+="<br>"+(d3.time.format("%Y")(nextTick));
                  return s;
                },
                twoLine: true
              },{
                type: 'year',
                step: 1,
                format: "%Y"
              },{
                type: 'year',
                step: 2,
                format: "%Y"
              },{
                type: 'year',
                step: 3,
                format: "%Y"
              },{
                type: 'year',
                step: 5,
                format: "%Y"
              },{
                type: 'year',
                step: 10,
                format: "%Y"
              },{
                type: 'year',
                step: 25,
                format: "%Y"
              },{
                type: 'year',
                step: 50,
                format: "%Y"
              },{
                type: 'year',
                step: 100,
                format: "%Y"
              },{
                type: 'year',
                step: 500,
                format: "%Y"
              }
            ];

            timeRes.every(function(tRes,i){
              var stopIteration = i===timeRes.length-1 || 
                timeRange_ms/(timeMult[tRes.type]*tRes.step) < optimalTickCount;
              if(stopIteration){
                if(tRes.type==="day" && this.timeTyped.maxDateRes()==="month")  stopIteration = false;
                if(tRes.type==="day" && this.timeTyped.maxDateRes()==="year")   stopIteration = false;
                if(tRes.type==="month" && this.timeTyped.maxDateRes()==="year") stopIteration = false;
                if(tRes.type==="hour" && this.timeTyped.maxDateRes()==="day")   stopIteration = false;
              }
              if(stopIteration){
                timeInterval = d3.time[tRes.type].utc;
                this.timeTyped.activeRes = tRes;
                if(typeof tRes.format === "string"){
                  this.intervalTickPrint = d3.time.format.utc(tRes.format);
                } else {
                  this.intervalTickPrint = tRes.format;
                }
                this.height_labels = (tRes.twoLine) ? 28 : 13;
              }

              return !stopIteration;
            }, this);

            this.setStepTicks(this.timeTyped.activeRes.step===1);

            this.valueScale.nice(timeInterval, this.timeTyped.activeRes.step);
            ticks = this.valueScale.ticks(timeInterval, this.timeTyped.activeRes.step);

        } else if(this.stepTicks){
          ticks = [];
          for(var i=this.intervalRange.active.min ; i<=this.intervalRange.getActiveMax(); i++){ // DONT CHANGE!
            ticks.push(i);
          }
          this.intervalTickPrint = d3.format("d");
        } else if(this.scaleType==='log'){
          if(this.valueScale.domain()[0] === 0)
            this.valueScale.domain([this.intervalRange.org.min, this.valueScale.domain()[1]]);
          this.valueScale.nice();
          // Generate ticks
          ticks = this.valueScale.ticks(); // ticks cannot be customized directly
          while(ticks.length > optimalTickCount*1.6){
            ticks = ticks.filter(function(d,i){return i%2===0;});
          }
          if(!this.hasFloat)
            ticks = ticks.filter(function(d){return d%1===0;});
          this.intervalTickPrint = d3.format(".1s");
        } else {
          this.valueScale.nice(optimalTickCount);
          this.valueScale.nice(optimalTickCount);
          ticks = this.valueScale.ticks(optimalTickCount);
          this.valueScale.nice(optimalTickCount);
          ticks = this.valueScale.ticks(optimalTickCount);

          if(!this.hasFloat) ticks = ticks.filter(function(tick){return tick===0||tick%1===0;});

          // Does TICKS have a floating number
          var ticksFloat = ticks.some(function(tick){ return tick%1!==0; });

          var d3Formating = d3.format(ticksFloat?".2f":".2s");
          this.intervalTickPrint = function(d){
            if(!me.hasFloat && d<10) return d;
            if(!me.hasFloat && Math.abs(ticks[1]-ticks[0])<1000) return d;
            return d3Formating(d);
          }
        }

        // Make sure the non-extreme ticks are between intervalRange.active.min and intervalRange.active.max
        for(var tickNo=1; tickNo<ticks.length-1; ){
          var tick = ticks[tickNo];
          if(tick<this.intervalRange.active.min){
            ticks.splice(tickNo-1,1); // remove the tick
          } else if(tick > this.intervalRange.getActiveMax()){
            ticks.splice(tickNo+1,1); // remove the tick
          } else {
            tickNo++
          }
        }

        if(!this.stepTicks)
          this.valueScale.domain([ticks[0], ticks[ticks.length-1]]);

        return ticks;
    },
    /**
      Uses
      - optimumTickWidth
      - this.intervalRang
      Updates:
      - scaleType (step vs linear)
      - valueScale
      - intervalTickPrint
      */
    updateScaleAndBins: function(force){
      var me=this;
      if(this.isEmpty()) return;

      switch(this.scaleType){
        case 'linear': this.valueScale = d3.scale.linear();      break;
        case 'log':    this.valueScale = d3.scale.log().base(2); break;
        case 'time':   this.valueScale = d3.time.scale.utc();    break;
      }

      var _width_ = this.getWidth_Chart();

      var minn = this.intervalRange.active.min;
      var maxx = this.intervalRange.getActiveMax();

      this.valueScale
        .domain([minn, maxx])
        .range([0, _width_]);

      var old_height_labels = this.height_labels;
      var curHeight = this.getHeight();

      var ticks = this.getValueTicks( _width_/this.getWidth_OptimumTick() );

      if(ticks.length===0) return;

      // Maybe the ticks still follow step-function ([3,4,5] - [12,13,14,15,16,17] - [2010,2011,2012,2013,2014] etc. )
      if(!this.stepTicks && !this.hasFloat && this.scaleType==='linear' && ticks.length>2){
        if( (ticks[1]===ticks[0]+1) && (ticks[ticks.length-1]===ticks[ticks.length-2]+1)) {
          this.setStepTicks(true);
          ticks = this.getValueTicks( _width_/this.getWidth_OptimumTick() );
        }
      }

      // width for one aggregate - fixed width
      this.aggrWidth = this.valueScale(ticks[1])-this.valueScale(ticks[0]);

      if( force || 
          this.intervalTicks.length !== ticks.length ||
          this.intervalTicks[0] !== ticks[0] ||
          this.intervalTicks[this.intervalTicks.length-1] !== ticks[ticks.length-1]
        )
      {
        this.intervalTicks = ticks;

        // Remove existing aggregates from browser
        if(this.histBins){
          var aggrs=this.browser.allAggregates;
          this.histBins.forEach(function(aggr){ aggrs.splice(aggrs.indexOf(aggr),1); },this);
        }

        this.histBins = [];
        // Create histBins as kshf.Aggregate
        this.intervalTicks.forEach(function(tick,i){
          var d = new kshf.Aggregate();
          d.summary = this;
          d.init();
          d.minV = tick;
          d.maxV = this.intervalTicks[i+1];
          d.summary = this;
          this.histBins.push(d);
          me.browser.allAggregates.push(d);
        }, this);
          
        this.histBins.pop(); // remove last bin

        // distribute records across bins
        this.filteredRecords.forEach(function(record){
          var v = this.getRecordValue(record);
          // DO NOT CHANGE BELOW
          if(v===null || v===undefined || v<this.intervalRange.active.min || v>this.intervalRange.getActiveMax()) return;
          var binI = null;
          this.intervalTicks.every(function(tick,i){ 
            if(v>=tick) {
              binI = i;
              return true; // keep going
            }
            return false; // stop iteration
          });
          var bin = this.histBins[ Math.min(binI, this.histBins.length-1) ];

          // If the record already had a bin for this summary, remove that bin
          var existingBinIndex = null;
          record._aggrCache.some(function(aggr,i){
            if(aggr.summary && aggr.summary === this) {
              existingBinIndex = i;
              return true;
            }
            return false;
          },this);
          if(existingBinIndex!==null){ record._aggrCache.splice(existingBinIndex,1); }
          // ******************************************************************

          bin.addRecord(record);
        },this);

        if(this.stepTicks) this.intervalTicks.pop();

        this.updateBarScale2Active();

        if(this.DOM.root) this.insertVizDOM();

        this.updatePercentiles("Active");
      }

      if(this.DOM.root){
        if(this.DOM.aggrGlyphs===undefined) this.insertVizDOM();

        if(old_height_labels !== this.height_labels){
          this.setHeight(curHeight);
        }

        this.refreshBins_Translate();
        this.refreshViz_Scale();

        this.refreshValueTickPos();

        this.refreshIntervalSlider();
      }
    },
    /** -- */
    getClosestTick: function(v){
      var t = this.intervalTicks[0];
      // Can be improved computationally, but does the job, only a few ticks!
      this.intervalTicks.forEach(function(tick){
        var difNew = Math.abs(tick.getTime()-v.getTime());
        var difOld = Math.abs(   t.getTime()-v.getTime());
        if(difNew < difOld) t = tick;
      });
      return t;
    },
    /** -- */
    insertVizDOM: function(){
      if(this.scaleType==='time' && this.DOM.root) {
        // delete existing DOM:
        // TODO: Find  a way to avoid this?
        this.DOM.timeSVG.selectAll('[class^="measure_"]').remove();

        this.DOM.measure_Total_Area = this.DOM.timeSVG
          .append("path").attr("class","measure_Total_Area").datum(this.histBins);
        this.DOM.measure_Active_Area = this.DOM.timeSVG
          .append("path").attr("class","measure_Active_Area").datum(this.histBins);
        this.DOM.lineTrend_ActiveLine = this.DOM.timeSVG.selectAll(".measure_Active_Line")
          .data(this.histBins, function(d,i){ return i; })
          .enter().append("line").attr("class","measure_Active_Line").attr("marker-end","url(#kshfLineChartTip_Active)");

        this.DOM.measure_Highlight_Area = this.DOM.timeSVG
          .append("path").attr("class","measure_Highlight_Area").datum(this.histBins);
        this.DOM.measure_Highlight_Line = this.DOM.timeSVG.selectAll(".measure_Highlight_Line")
          .data(this.histBins, function(d,i){ return i; })
          .enter().append("line").attr("class","measure_Highlight_Line").attr("marker-end","url(#kshfLineChartTip_Highlight)");

        this.DOM.measure_Compare_Area_A = this.DOM.timeSVG
          .append("path").attr("class","measure_Compare_Area_A measure_Compare_A").datum(this.histBins);
        this.DOM.measure_Compare_Line_A = this.DOM.timeSVG.selectAll(".measure_Compare_Line_A")
          .data(this.histBins, function(d,i){ return i; })
          .enter().append("line").attr("class","measure_Compare_Line_A measure_Compare_A").attr("marker-end","url(#kshfLineChartTip_Compare_A)");
        this.DOM.measure_Compare_Area_B = this.DOM.timeSVG
          .append("path").attr("class","measure_Compare_Area_B measure_Compare_B").datum(this.histBins);
        this.DOM.measure_Compare_Line_B = this.DOM.timeSVG.selectAll(".measure_Compare_Line_B")
          .data(this.histBins, function(d,i){ return i; })
          .enter().append("line").attr("class","measure_Compare_Line_B measure_Compare_B").attr("marker-end","url(#kshfLineChartTip_Compare_B)");
        this.DOM.measure_Compare_Area_C = this.DOM.timeSVG
          .append("path").attr("class","measure_Compare_Area_C measure_Compare_C").datum(this.histBins);
        this.DOM.measure_Compare_Line_C = this.DOM.timeSVG.selectAll(".measure_Compare_Line_C")
          .data(this.histBins, function(d,i){ return i; })
          .enter().append("line").attr("class","measure_Compare_Line_C measure_Compare_C").attr("marker-end","url(#kshfLineChartTip_Compare_C)");
      }

      this.insertBins();
      this.refreshViz_Axis();
      this.refreshMeasureLabel();
      this.updateValueTicks();
    },
    /** --- */
    refreshValueTickPos: function(){
      var me=this;
      this.DOM.labelGroup.style("left", (this.stepTicks ? (this.aggrWidth/2) : 0)+"px");
      this.DOM.labelGroup.selectAll(".tick").style("left",function(d){ return me.valueScale(d.v)+"px"; });
    },
    /** -- */
    updateValueTicks: function(){
      var me=this;
      this.DOM.labelGroup.selectAll(".tick").data([]).exit().remove(); // remove all existing ticks

      // Insert middle-ticks to show that this is log-scale
      var ticks = [];
      if(this.scaleType==="log"){
        ticks = [{v: this.intervalTicks[0], l:true}];
        for(var i=1 ; i < this.intervalTicks.length ; i++){
          var _min = me.valueScale(this.intervalTicks[i-1]);
          var _max = me.valueScale(this.intervalTicks[i]);
          [1,1,1].forEach(function(){
            var x = (_min+_max)/2;
            ticks.push( {v: me.valueScale.invert(x), l:false } );
            _min = x;
          });
          ticks.push({v: this.intervalTicks[i], l: true});
        }
      } else { 
        this.intervalTicks.forEach(function(p){
          ticks.push({v: p, l: true});
        });
      }
      
      var ddd = this.DOM.labelGroup.selectAll(".tick").data(ticks);
      var ddd_enter = ddd.enter().append("span").attr("class","tick")
        .attr("minor",function(d){ return d.l?null:true; });
      ddd_enter.append("span").attr("class","line");
      ddd_enter
        .filter(function(d){ return d.l; })
        .append("span").attr("class","text")
        .each(function(d){
          this.bin = null;
          me.histBins.every(function(bin){
            if(bin.minV===d.v) {
              this.bin = bin;
              return false;
            }
            return true;
          },this);
        })
        .on("mouseover",function(d){
          if(this.bin) me.onBinMouseOver(this.bin);
        })
        .on("mouseleave",function(d){
          if(this.bin===null) return;
          this.bin.unselectAggregate();
          me.browser.clearSelect_Highlight();
        })
        .on("click",function(d){
          if(this.bin) me.onAggrClick(this.bin);
        });
      this.refreshValueTickLabels();
    },
    /** -- */
    refreshValueTickLabels: function(){
      var me=this;
      if(this.DOM.labelGroup===undefined) return;
      this.DOM.labelGroup.selectAll(".tick .text").html(function(d){ 
        return me.printWithUnitName( me.intervalTickPrint(d.v) ); 
      });
    },
    /** -- */
    onBinMouseOver: function(aggr){
      aggr.DOM.aggrGlyph.setAttribute("showlock",true);
      aggr.DOM.aggrGlyph.setAttribute("selection","selected");
      if(!this.browser.ratioModeActive){
        this.DOM.highlightedMeasureValue
          .style("top",(this.height_hist - this.chartScale_Measure(aggr.measure('Active')))+"px")
          .style("opacity",1);
      }
      this.browser.setSelect_Highlight(aggr);
    },
    /** -- */
    onAggrClick: function(aggr){
      if(this.highlightRangeLimits_Active) return;
      if(d3.event.shiftKey){
        this.browser.setSelect_Compare(true);
        return;
      }
      if(this.summaryFilter.filteredBin===this){
        this.summaryFilter.clearFilter();
        return;
      }

      this.stepRange = this.stepTicks;

      // store histogram state
      this.summaryFilter.active = {
        min: aggr.minV,
        max: aggr.maxV
      };
      this.summaryFilter.filteredBin = null;
      this.summaryFilter.addFilter();
    },
    /** -- */
    insertBins: function(){
      var me=this;

      // just remove all aggrGlyphs that existed before.
      this.DOM.histogram_bins.selectAll(".aggrGlyph").data([]).exit().remove();

      var activeBins = this.DOM.histogram_bins.selectAll(".aggrGlyph").data(this.histBins, function(d,i){return i;});

      var newBins=activeBins.enter().append("span").attr("class","aggrGlyph rangeGlyph")
        .each(function(aggr){
          aggr.isVisible = true;
          aggr.DOM.aggrGlyph = this;
        })
        .on("mouseenter",function(aggr){
          if(me.highlightRangeLimits_Active) return;
          // mouse is moving slow, just do it.
          if(me.browser.mouseSpeed<0.2) {
            me.onBinMouseOver(aggr);
            return;
          }
          // mouse is moving fast, should wait a while...
          this.highlightTimeout = window.setTimeout(
            function(){ me.onBinMouseOver(aggr) }, 
            me.browser.mouseSpeed*300);
        })
        .on("mouseleave",function(aggr){
          if(me.highlightRangeLimits_Active) return;
          if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
          aggr.unselectAggregate();
          me.browser.clearSelect_Highlight();
        })
        .on("click",function(aggr){ me.onAggrClick(aggr); });

      ["Total","Active","Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(m){
        var X = newBins.append("span").attr("class","measure_"+m);
        if(m!=="Total" && m!=="Active" && m!=="Highlight"){
          X.on("mouseenter" ,function(){ me.browser.refreshMeasureLabels(this.classList[0].substr(8)); });
          X.on("mouseleave", function(){ me.browser.refreshMeasureLabels("Active"); });
        }
      });

      newBins.append("span").attr("class","total_tip");
      newBins.append("span").attr("class","lockButton fa")
        .each(function(aggr){
          this.tipsy = new Tipsy(this, {
            gravity: 's',
            title: function(){ return kshf.lang.cur[ me.browser.selectedAggr["Compare_A"]!==aggr ? 'LockToCompare' : 'Unlock']; }
          });
        })
        .on("click",function(aggr){
          this.tipsy.hide();
          me.browser.setSelect_Compare(true);
          d3.event.stopPropagation();
        })
        .on("mouseenter",function(aggr){
          this.tipsy.hide();
          this.tipsy.show();
          d3.event.stopPropagation();
        })
        .on("mouseleave",function(aggr){
          this.tipsy_title = undefined;
          this.tipsy.hide();
          d3.event.stopPropagation();
        });

      newBins.append("span").attr("class","measureLabel").each(function(bar){
        kshf.Util.setTransform(this,"translateY("+me.height_hist+"px)");
      });

      this.DOM.aggrGlyphs      = this.DOM.histogram_bins.selectAll(".aggrGlyph");
      this.DOM.measureLabel    = this.DOM.aggrGlyphs.selectAll(".measureLabel");
      this.DOM.measureTotalTip = this.DOM.aggrGlyphs.selectAll(".total_tip");
      this.DOM.lockButton      = this.DOM.aggrGlyphs.selectAll(".lockButton");
      ["Total","Active","Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(m){
        this.DOM["measure_"+m] = this.DOM.aggrGlyphs.selectAll(".measure_"+m);
      },this);
    },
    /** -- */
    map_refreshColorScale: function(){
      var me=this;
      this.DOM.mapColorBlocks
        .style("background-color", function(d){
          if(me.invertColorScale) d = 8-d;
          return kshf.colorScale[me.browser.mapColorTheme][d];
        });
    },
    /** -- */
    initDOM_RecordMapColor: function(){
      var me=this;

      this.DOM.mapColorBar = this.DOM.summaryInterval.append("div").attr("class","mapColorBar");

      this.DOM.mapColorBar.append("span").attr("class","invertColorScale fa fa-adjust")
        .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'sw', title: "Invert Color Scale" }); })
        .on("mouseenter",function(){ this.tipsy.show(); })
        .on("mouseleave",function(){ this.tipsy.hide(); })
        .on("click", function(){
          me.invertColorScale = !me.invertColorScale;
          me.browser.recordDisplay.refreshRecordColors();
          me.browser.recordDisplay.map_refreshColorScaleBins();
          me.map_refreshColorScale();
        });

      this.DOM.mapColorBlocks = this.DOM.mapColorBar.selectAll("mapColorBlock")
        .data([0,1,2,3,4,5,6,7,8]).enter()
        .append("div").attr("class","mapColorBlock")
        .each(function(d){
          var r = me.valueScale.range()[1]/9;
          this._minValue = me.valueScale.invert(d*r);
          this._maxValue = me.valueScale.invert((d+1)*r);

          if(!me.hasFloat){
            this._minValue = Math.floor(this._minValue);
            this._maxValue = Math.ceil(this._maxValue);
          }

          this.tipsy = new Tipsy(this, {
            gravity: 's', title: function(){
              return "<b>"+me.intervalTickPrint(this._minValue)+"</b> to "+
                "<b>"+me.intervalTickPrint(this._maxValue);+"</b>"; }
          });
        })
        .on("mouseenter",function(d,i){ 
          this.tipsy.show();
          this.style.borderColor = (i<4)?"black":"white";

          var r = me.valueScale.range()[1]/9;
          var records = [];
          me.filteredRecords.forEach(function(record){ 
            var v = me.getRecordValue(record);
            if(v>=this._minValue && v<=this._maxValue) records.push(record);
          },this);
          me.browser.flexAggr_Highlight.summary = me;
          me.browser.flexAggr_Highlight.records = records;
          me.browser.flexAggr_Highlight.minV = this._minValue;
          me.browser.flexAggr_Highlight.maxV = this._maxValue;
          me.highlightRangeLimits_Active = true;
          me.browser.setSelect_Highlight();
        })
        .on("mouseleave",function(){ 
          this.tipsy.hide();
          me.browser.clearSelect_Highlight();
        })
        .on("click",function(){
          me.summaryFilter.active = {
            min: this._minValue,
            max: this._maxValue
          };
          me.summaryFilter.filteredBin = undefined;
          me.summaryFilter.addFilter();
        });
      this.map_refreshColorScale();
    },
    /** -- */
    initDOM_Slider: function(){
      var me=this;

      this.DOM.intervalSlider = this.DOM.summaryInterval.append("div").attr("class","intervalSlider");

      this.DOM.zoomControl = this.DOM.intervalSlider.append("span").attr("class","zoomControl fa")
        .attr("sign","plus")
        .each(function(d){
          this.tipsy = new Tipsy(this, {
            gravity: 'w', title: function(){ return (this.getAttribute("sign")==="plus")?"Zoom into range":"Zoom out"; }
          });
        })
        .on("mouseenter",function(){ this.tipsy.show(); })
        .on("mouseleave",function(){ this.tipsy.hide(); })
        .on("click",     function(){ this.tipsy.hide(); me.setZoomed(this.getAttribute("sign")==="plus"); });

      var controlLine = this.DOM.intervalSlider.append("div").attr("class","controlLine")
        .on("mousedown", function(){
          if(d3.event.which !== 1) return; // only respond to left-click
          me.browser.DOM.root.attr("adjustWidth",true).attr("pointerEvents",false);
          var e=this.parentNode;
          var initPos = me.valueScale.invert(d3.mouse(e)[0]);
          d3.select("body").on("mousemove", function(){
            var targetPos = me.valueScale.invert(d3.mouse(e)[0]);
            // This sets the filter range based on the first click & current mouse position
            me.summaryFilter.active.min = d3.min([initPos,targetPos]);
            me.summaryFilter.active.max = d3.max([initPos,targetPos]);

            me.checkFilterRange();
            me.refreshIntervalSlider();
            // wait half second to update
            if(this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(function(){
              if(me.isFiltered_min() || me.isFiltered_max()){
                me.summaryFilter.filteredBin = undefined;
                me.summaryFilter.addFilter();
              } else {
                me.summaryFilter.clearFilter();
              }
            },250);
          }).on("mouseup", function(){
            me.browser.DOM.root.attr("adjustWidth",null).attr("pointerEvents",true);;
            d3.select("body").on("mousemove",null).on("mouseup",null);
          });
          d3.event.preventDefault();
        });

      controlLine.append("span").attr("class","base total");

      this.DOM.activeBaseRange = controlLine.append("span").attr("class","base active")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: "s", title: kshf.lang.cur.DragToFilter }); })
        // TODO: The problem is, the x-position (left-right) of the tooltip is not correctly calculated
        // because the size of the bar is set by scaling, not through width....
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("mousedown",  function(){ this.tipsy.hide();
          if(d3.event.which !== 1) return; // only respond to left-click
          if(me.scaleType==='time') return; // time is not supported for now.

          me.browser.DOM.root.attr("adjustWidth",true).attr("pointerEvents",false);

          var e=this.parentNode;
          var initMin = me.summaryFilter.active.min;
          var initMax = me.summaryFilter.active.max;
          var initRange= initMax - initMin;
          var initPos = d3.mouse(e)[0];

          d3.select("body").on("mousemove", function() {
            if(me.scaleType==='log'){
              var targetDif = d3.mouse(e)[0]-initPos;
              me.summaryFilter.active.min = me.valueScale.invert(me.valueScale(initMin)+targetDif);
              me.summaryFilter.active.max = me.valueScale.invert(me.valueScale(initMax)+targetDif);

            } else if(me.scaleType==='time'){
              // TODO
              return;

            } else {
              var targetPos = me.valueScale.invert(d3.mouse(e)[0]);
              var targetDif = Math.round(targetPos-me.valueScale.invert(initPos));

              me.summaryFilter.active.min = initMin+targetDif;
              me.summaryFilter.active.max = initMax+targetDif;

              // Limit the active filter to expand beyond the current min/max of the view.
              if(me.summaryFilter.active.min<me.intervalRange.active.min){
                me.summaryFilter.active.min=me.intervalRange.active.min;
                me.summaryFilter.active.max=me.intervalRange.active.min+initRange;
              }
              if(me.summaryFilter.active.max>me.intervalRange.getActiveMax()){
                me.summaryFilter.active.max=me.intervalRange.getActiveMax();
                me.summaryFilter.active.min=me.intervalRange.getActiveMax()-initRange;
              }
            }

            me.checkFilterRange();
            me.refreshIntervalSlider();

            // wait half second to update
            if(this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(function(){
              if(me.isFiltered_min() || me.isFiltered_max()){
                me.summaryFilter.filteredBin = undefined;
                me.summaryFilter.addFilter();
              } else{
                me.summaryFilter.clearFilter();
              }
            },200);
          }).on("mouseup", function(){
            me.browser.DOM.root.attr("adjustWidth",null).attr("pointerEvents",true);;
            d3.select("body").on("mousemove",null).on("mouseup",null);
          });
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });

      this.DOM.rangeHandle = controlLine.selectAll(".rangeHandle").data(['min','max']).enter()
        .append("span").attr("class",function(d){ return "rangeHandle "+d; })
        .each(function(d,i){
          this.tipsy = new Tipsy(this, { gravity: i==0?"w":"e", title: kshf.lang.cur.DragToFilter });
        })
        .on("mouseenter", function(){ if(!this.dragging){ this.tipsy.show(); this.setAttribute("dragging",true);} })
        .on("mouseleave", function(){ if(!this.dragging){ 
          this.tipsy.hide(); this.removeAttribute("dragging");
        } })
        .on("mousedown", function(d,i){
          this.tipsy.hide();
          if(d3.event.which !== 1) return; // only respond to left-click

          me.browser.DOM.root.attr("adjustWidth",true).attr("pointerEvents",false);
          this.setAttribute("dragging",true);

          var mee = this;
          mee.dragging = true;
          var e=this.parentNode;
          d3.select("body").on("mousemove", function() {
            var targetPos = me.valueScale.invert(d3.mouse(e)[0]);
            me.summaryFilter.active[d] = targetPos;
            // Swap is min > max
            if(me.summaryFilter.active.min>me.summaryFilter.active.max){
              var t=me.summaryFilter.active.min;
              me.summaryFilter.active.min = me.summaryFilter.active.max;
              me.summaryFilter.active.max = t;
                if(d==='min') d='max'; else d='min';
            }
            me.checkFilterRange();
            me.refreshIntervalSlider();
            // wait half second to update
            if(this.timer) clearTimeout(this.timer);
            this.timer = setTimeout( function(){
              if(me.isFiltered_min() || me.isFiltered_max()){
                me.summaryFilter.filteredBin = undefined;
                me.summaryFilter.addFilter();
              } else {
                me.summaryFilter.clearFilter();
              }
            },200);
          }).on("mouseup", function(){
            mee.dragging = false;
            mee.removeAttribute("dragging");
            me.browser.DOM.root.attr("adjustWidth",null).attr("pointerEvents",true);;
            d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
          });
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });

      this.DOM.recordValue = controlLine.append("div").attr("class","recordValue");
      this.DOM.recordValue.append("span").attr("class","recordValueScaleMark");
      this.DOM.recordValueText = this.DOM.recordValue
        .append("span").attr("class","recordValueText")
        .append("span").attr("class","recordValueText-v");

      this.DOM.labelGroup = this.DOM.intervalSlider.append("div").attr("class","labelGroup");
    },
    /** -- */
    updateBarScale2Active: function(){
      this.chartScale_Measure
        .domain([0, this.getMaxAggr_Active() || 1])
        .range ([0, this.height_hist]);
    },
    /** -- */
    refreshBins_Translate: function(){
      var me=this;
      var offset = (this.stepTicks)? this.width_barGap : 0;
      if(this.scaleType==="time"){
        this.DOM.aggrGlyphs
          .style("width",function(aggr){ return (me.valueScale(aggr.maxV)-me.valueScale(aggr.minV))+"px"; })
          .each(function(aggr){ kshf.Util.setTransform(this,"translateX("+(me.valueScale(aggr.minV)+ 1)+"px)"); });;
      } else {
        this.DOM.aggrGlyphs
          .style("width",this.getWidth_Bin()+"px")
          .each(function(aggr){ kshf.Util.setTransform(this,"translateX("+(me.valueScale(aggr.minV)+offset)+"px)"); });
      }
    },
    /** -- */
    refreshViz_Scale: function(){
      this.refreshViz_Total();
      this.refreshViz_Active();
    },
    /** -- */
    refreshViz_Total: function(){
      if(this.isEmpty() || this.collapsed) return;
      var me=this;
      var width=this.getWidth_Bin();

      var heightTotal = function(aggr){
        if(aggr._measure.Total===0) return 0;
        if(me.browser.ratioModeActive) return me.height_hist;
        return me.chartScale_Measure(aggr.measure('Total'));
      };

      if(this.scaleType==='time'){
        this.DOM.measure_Total_Area
          .transition().duration(this.browser.noAnim?0:700)
          .attr("d", 
            d3.svg.area().interpolate("cardinal")
              .x(this.timeAxis_XFunc)
              .y0(me.height_hist)
              .y1(function(aggr){ 
                return (aggr._measure.Total===0) ? (me.height_hist+3) : (me.height_hist-heightTotal(aggr));
              }));
          ;
      } else {
        this.DOM.measure_Total.each(function(aggr){
          kshf.Util.setTransform(this, "translateY("+me.height_hist+"px) scale("+width+","+heightTotal(aggr)+")");
        });
        if(!this.browser.ratioModeActive){
          this.DOM.measureTotalTip
            .style("opacity",function(aggr){ return (aggr.measure('Total')>me.chartScale_Measure.domain()[1])?1:0; })
            .style("width",width+"px");
        } else {
          this.DOM.measureTotalTip.style("opacity",0);
        }
      }
    },
    /** -- */
    refreshViz_Active: function(){
      if(this.isEmpty() || this.collapsed) return;
      var me=this;
      var width = this.getWidth_Bin();

      var heightActive = function(aggr){
        if(aggr._measure.Active===0) return 0;
        if(me.browser.ratioModeActive) return me.height_hist;
        return me.chartScale_Measure(aggr.measure('Active'));
      };

      // Position the lock button
      this.DOM.lockButton
        .each(function(aggr){
          kshf.Util.setTransform(this,"translateY("+(me.height_hist-heightActive(aggr)-10)+"px)");
        })
        .attr("inside",function(aggr){
          if(me.browser.ratioModeActive) return "";
          if(me.height_hist-heightActive(aggr)<6) return "";
        });

      // Time (line chart) update
      if(this.scaleType==='time'){
        var durationTime = this.browser.noAnim ? 0 : 700;
        this.DOM.measure_Active_Area
          .transition().duration(durationTime)
          .attr("d", 
            d3.svg.area().interpolate("cardinal")
              .x (this.timeAxis_XFunc)
              .y0(me.height_hist+2)
              .y1(function(aggr){
                  return (aggr._measure.Active===0) ? me.height_hist+3 : (me.height_hist-heightActive(aggr)+1);
              })
            );

        this.DOM.lineTrend_ActiveLine.transition().duration(durationTime)
          .attr("x1",this.timeAxis_XFunc)
          .attr("x2",this.timeAxis_XFunc)
          .attr("y1",function(aggr){ return me.height_hist+3; })
          .attr("y2",function(aggr){
            return (aggr._measure.Active===0) ? (me.height_hist+3) : (me.height_hist - heightActive(aggr)+1);
          });
      }

      if(!this.isFiltered() || this.scaleType==='time' || this.stepTicks){
        // No partial rendering
        this.DOM.measure_Active.each(function(aggr){
          kshf.Util.setTransform(this, "translateY("+me.height_hist+"px) scale("+width+","+heightActive(aggr)+")");
        });
      } else {
        // Partial rendering
        // is filtered & not step scale
        var filter_min = this.summaryFilter.active.min;
        var filter_max = this.summaryFilter.active.max;
        var minPos = this.valueScale(filter_min);
        var maxPos = this.valueScale(filter_max);
        this.DOM.measure_Active.each(function(aggr){
          var translateX = "";
          var width_self=width;
          var aggr_min = aggr.minV;
          var aggr_max = aggr.maxV;
          if(aggr._measure.Active>0){
            // it is within the filtered range
            if(aggr_min<filter_min){
              var lostWidth = minPos-me.valueScale(aggr_min);
              translateX = "translateX("+lostWidth+"px) ";
              width_self -= lostWidth;
            }
            if(aggr_max>filter_max){
              width_self -= me.valueScale(aggr_max)-maxPos-me.width_barGap*2;
            }
          }
          kshf.Util.setTransform(this,
            "translateY("+me.height_hist+"px) "+translateX+"scale("+width_self+","+heightActive(aggr)+")");
        });
      }
    },
    /** -- */
    refreshViz_Compare: function(cT, curGroup, totalGroups){
      if(this.isEmpty() || this.collapsed || !this.inBrowser()) return;

      var me=this;
      var width = this.getWidth_Bin();
      var binWidth = width / totalGroups;
      var ratioModeActive = this.browser.ratioModeActive;

      var compId = "Compare_"+cT;

      if(this.percentileChartVisible==="Extended"){
        if(this.browser.vizActive[compId]){
          this.DOM.percentileGroup.select(".compared_percentileChart").style("display","block");
          if(this.browser.vizActive[compId]) this.updatePercentiles("Compare_"+cT);
        } else {
          this.DOM.percentileGroup.select(".compared_percentileChart").style("display","none");
        }
      }
      var heightCompare = function(aggr){
        if(aggr._measure[compId]===0) return 0;
        return ratioModeActive ? aggr.ratioCompareToActive(cT)*me.height_hist : me.chartScale_Measure(aggr.measure(compId));
      };

      // Time (line chart) update
      if(this.scaleType==='time'){
        var yFunc = function(aggr){
          return (aggr._measure[compId]===0) ? (me.height_hist+3) : (me.height_hist-heightCompare(aggr));
        };

        var dTime = 200;
        this.DOM["measure_Compare_Area_"+cT]
          .transition().duration(dTime)
          .attr("d", d3.svg.area().interpolate("cardinal").x(this.timeAxis_XFunc).y(yFunc));

        this.DOM["measure_Compare_Line_"+cT].transition().duration(dTime)
          .attr("y1",me.height_hist+3 )
          .attr("y2",yFunc)
          .attr("x1",this.timeAxis_XFunc)
          .attr("x2",this.timeAxis_XFunc);
        return;
      }

      var _translateY = "translateY("+me.height_hist+"px) ";
      var _translateX = "translateX("+((curGroup+1)*binWidth)+"px) ";

      if(!this.isFiltered() || this.scaleType==='time' || this.stepTicks){
        // No partial rendering
        this.DOM["measure_Compare_"+cT].each(function(aggr){
          kshf.Util.setTransform(this, _translateY+_translateX+"scale("+binWidth+","+heightCompare(aggr)+")");
        });
      } else {
        // partial rendering
        var filter_min = this.summaryFilter.active.min;
        var filter_max = this.summaryFilter.active.max;
        var minPos = this.valueScale(filter_min);
        var maxPos = this.valueScale(filter_max);
        this.DOM["measure_Compare_"+cT].each(function(aggr){
          var translateX = "";
          var width_self=(curGroup*binWidth);
          var aggr_min = aggr.minV;
          var aggr_max = aggr.maxV;
          if(aggr._measure.Active>0){
            // it is within the filtered range
            if(aggr_min<filter_min){
              var lostWidth = minPos-me.valueScale(aggr_min);
              translateX = "translateX("+lostWidth+"px) ";
              width_self -= lostWidth;
            }
            if(aggr_max>filter_max){
              width_self -= me.valueScale(aggr_max)-maxPos-me.width_barGap*2;
            }
          }
          kshf.Util.setTransform(this, _translateY+translateX+"scale("+(width_self/2)+","+heightCompare(aggr)+")");
        });
      }
    },
    /** -- */
    refreshViz_Highlight: function(){
      if(this.isEmpty() || this.collapsed || !this.DOM.inited || !this.inBrowser()) return;
      var me=this;
      var width = this.getWidth_Bin();

      this.refreshViz_EmptyRecords();
      this.refreshMeasureLabel();

      var totalC = this.browser.getActiveCompareSelCount();
      if(this.browser.measureFunc==="Avg") totalC++;

      if(this.browser.vizActive.Highlight){
        this.updatePercentiles("Highlight");
        this.DOM.highlightedMeasureValue
          .style("top",( this.height_hist * (1-this.browser.allRecordsAggr.ratioHighlightToTotal() ))+"px")
          .style("opacity",(this.browser.ratioModeActive?1:0));
      } else {
        // Highlight not active
        this.DOM.percentileGroup.select(".percentileChart_Highlight").style("opacity",0);
        this.DOM.highlightedMeasureValue.style("opacity",0);
        this.refreshMeasureLabel();
        this.highlightRangeLimits_Active = false;
      }

      this.DOM.highlightRangeLimits
        .style("opacity",(this.highlightRangeLimits_Active&&this.browser.vizActive.Highlight)?1:0)
        .style("left", function(d){ return me.valueScale(me.browser.flexAggr_Highlight[(d===0)?'minV':'maxV'])+"px"; });

      var getAggrHeight_Preview = function(aggr){
        var p=aggr.measure('Highlight');
        if(me.browser.preview_not) p = aggr.measure('Active')-p;
        if(me.browser.ratioModeActive){
          if(aggr._measure.Active===0) return 0;
          return (p / aggr.measure('Active'))*me.height_hist;
        } else {
          return me.chartScale_Measure(p);
        }
      };

      if(this.scaleType==='time'){
        var yFunc = function(aggr){
          return (aggr._measure.Highlight===0) ? (me.height_hist+3) : (me.height_hist-getAggrHeight_Preview(aggr));
        };
        var dTime=200;
        this.DOM.measure_Highlight_Area
          .transition().duration(dTime)
          .attr("d", 
            d3.svg.area().interpolate("cardinal")
              .x(this.timeAxis_XFunc)
              .y0(me.height_hist+2)
              .y1(yFunc));
        this.DOM.measure_Highlight_Line.transition().duration(dTime)
          .attr("y1",me.height_hist+3)
          .attr("y2",yFunc)
          .attr("x1",this.timeAxis_XFunc)
          .attr("x2",this.timeAxis_XFunc);
      } else {
        if(!this.browser.vizActive.Highlight){
          var xx = (width / (totalC+1));
          var transform = "translateY("+this.height_hist+"px) scale("+xx+",0)";
          this.DOM.measure_Highlight.each(function(){ kshf.Util.setTransform(this,transform); });
          return;
        }

        var _translateY = "translateY("+me.height_hist+"px) ";

        var range_min = this.valueScale.domain()[0];
        var range_max = this.valueScale.domain()[1];
        var rangeFill = false;
        if(this.isFiltered()){
          range_min = Math.max(range_min, this.summaryFilter.active.min);
          range_max = Math.max(range_min, this.summaryFilter.active.max);
          rangeFill = true;
        }
        if(this.highlightRangeLimits_Active){
          range_min = Math.max(range_min, this.browser.flexAggr_Highlight.minV);
          range_max = Math.max(range_min, this.browser.flexAggr_Highlight.maxV);
          rangeFill = true;
        }
        var minPos = this.valueScale(range_min);
        var maxPos = this.valueScale(range_max);

        this.DOM.measure_Highlight.each(function(aggr){
          var _translateX = "";
          var barWidth = width;
          if(aggr._measure.Active>0 && rangeFill){
            var aggr_min = aggr.minV;
            var aggr_max = aggr.maxV;
            // it is within the filtered range
            if(aggr_min<range_min){
              var lostWidth = minPos-me.valueScale(aggr_min);
              _translateX = "translateX("+lostWidth+"px) ";
              barWidth -= lostWidth;
            }
            if(aggr_max>range_max){
              barWidth -= me.valueScale(aggr_max)-maxPos-me.width_barGap*2;
            }
          }
          if(!rangeFill){
            barWidth = barWidth / (totalC+1);
            //_translateX = "translateX("+barWidth*totalC+"px) ";
          }
          var _scale = "scale("+barWidth+","+getAggrHeight_Preview(aggr)+")";
          kshf.Util.setTransform(this,_translateY+_translateX+_scale);
        });

      }
    },
    /** -- */
    refreshViz_Axis: function(){
      if(this.isEmpty() || this.collapsed) return;
      
      var me = this;
      var tickValues, maxValue;
      var chartAxis_Measure_TickSkip = me.height_hist/17;
      var axis_Scale = this.chartScale_Measure;

      if(this.browser.ratioModeActive || this.browser.percentModeActive) {
        maxValue = (this.browser.ratioModeActive) ? 100
          : Math.round(100*me.getMaxAggr_Active()/me.browser.allRecordsAggr.measure('Active'));
        axis_Scale = d3.scale.linear()
          .rangeRound([0, this.height_hist])
          .domain([0,maxValue])
          .clamp(true);
      }

      // GET TICK VALUES ***********************************************************
      tickValues = axis_Scale.ticks(chartAxis_Measure_TickSkip);
      if(this.browser.measureFunc==="Count" || true){ 
        // remove 0-tick // TODO: The minimum value can be below zero, and you may wish to label 0-line
        tickValues = tickValues.filter(function(d){ return d!==0; });
      }
      // Remove non-integer values is appropriate
      if((this.browser.measureFunc==="Count") || (this.browser.measureFunc==="Sum" && !this.browser.measureSummary.hasFloat)){
        tickValues = tickValues.filter(function(d){ return d%1===0; });
      }

      var tickDoms = this.DOM.chartAxis_Measure_TickGroup.selectAll("span.tick")
        .data(tickValues,function(i){return i;});
      // remove old ones
      tickDoms.exit().remove();
      // add new ones
      var tickData_new=tickDoms.enter().append("span").attr("class","tick");

      tickData_new.append("span").attr("class","line");
      tickData_new.append("span").attr("class","text measureAxis_1");
      tickData_new.append("span").attr("class","text measureAxis_2");

      // Place the doms at the bottom of the histogram, so their position is animated.
      tickData_new.each(function(){ kshf.Util.setTransform(this,"translateY("+me.height_hist+"px)"); });

      this.DOM.chartAxis_Measure_TickGroup.selectAll(".text")
        .html(function(d){ return me.browser.getTickLabel(d); });

      setTimeout(function(){
        var transformFunc;
        if(me.browser.ratioModeActive){
          transformFunc=function(d){
            kshf.Util.setTransform(this,"translateY("+ (me.height_hist-d*me.height_hist/100)+"px)");
          };
        } else {
          if(me.browser.percentModeActive){
            transformFunc=function(d){
              kshf.Util.setTransform(this,"translateY("+(me.height_hist-(d/maxValue)*me.height_hist)+"px)");
            };
          } else {
            transformFunc=function(d){
              kshf.Util.setTransform(this,"translateY("+(me.height_hist-me.chartScale_Measure(d))+"px)");
            };
          }
        }
        var x = me.browser.noAnim;
        if(x===false) me.browser.setNoAnim(true);
        me.DOM.chartAxis_Measure.selectAll(".tick").style("opacity",1).each(transformFunc);
        if(x===false) me.browser.setNoAnim(false);
      });
    },
    /** -- */
    refreshIntervalSlider: function(){
      var minn = this.summaryFilter.active.min;
      var minPos = this.valueScale(minn);
      var maxx = this.summaryFilter.active.max;
      var maxPos = this.valueScale(maxx);
      
      if(maxx>this.intervalRange.active.max){
        maxPos = this.valueScale.range()[1];
      }
      if(minn===this.intervalRange.active.min){
        minPos = this.valueScale.range()[0];
      }

      this.DOM.intervalSlider.select(".base.active")
        .attr("filtered",this.isFiltered())
        .each(function(d){
          this.style.left = minPos+"px";
          this.style.width = (maxPos-minPos)+"px";
          //kshf.Util.setTransform(this,"translateX("+minPos+"px) scaleX("+(maxPos-minPos)+")");
          // Rendering update slowdown if the above translation is used. Weird...
        });
      this.DOM.intervalSlider.selectAll(".rangeHandle")
        .each(function(d){ kshf.Util.setTransform(this,"translateX("+((d==="min")?minPos:maxPos)+"px)"); });
    },
    /** -- */
    refreshHeight: function(){
      this.DOM.histogram.style("height",(this.height_hist+this.height_hist_topGap)+"px")
      this.DOM.wrapper.style("height",(this.collapsed?"0":this.getHeight_Content())+"px");
      this.DOM.root.style("max-height",(this.getHeight()+1)+"px");

      var labelTranslate ="translateY("+this.height_hist+"px)";
      if(this.DOM.measureLabel)
        this.DOM.measureLabel.each(function(bar){ kshf.Util.setTransform(this,labelTranslate); });
      if(this.DOM.timeSVG)
        this.DOM.timeSVG.style("height",(this.height_hist+2)+"px");
    },
    /** -- */
    refreshWidth: function(){
      this.detectScaleType();
      this.updateScaleAndBins();
      if(this.DOM.inited===false) return;
      var chartWidth = this.getWidth_Chart();
      var wideChart = this.getWidth()>400;
      
      this.DOM.wrapper.attr("showMeasureAxis_2",wideChart?"true":null);

      this.DOM.summaryInterval.style({
        'width'        : this.getWidth()+"px",
        'padding-left' : this.width_measureAxisLabel+"px",
        'padding-right': ( wideChart ? this.width_measureAxisLabel : 11)+"px" });
      
      this.DOM.summaryName.style("max-width",(this.getWidth()-40)+"px");
      if(this.DOM.timeSVG) this.DOM.timeSVG.style("width",(chartWidth+2)+"px")
    },
    /** -- */
    setHeight: function(targetHeight){
      if(this.histBins===undefined) return;
      var c = targetHeight - this.getHeight_Header() - this.getHeight_Extra();
      if(this.height_hist===c) return;
      this.height_hist = c;
      this.updateBarScale2Active();

      if(!this.DOM.inited) return;
      this.refreshBins_Translate();

      this.refreshViz_Scale();
      this.refreshViz_Highlight();
      this.refreshViz_Compare_All();
      this.refreshViz_Axis();
      this.refreshHeight();

      this.DOM.labelGroup.style("height",this.height_labels+"px");
      this.DOM.rangeHandle.style({
        height: ( this.height_hist+23)+"px",
        top:    (-this.height_hist-13)+"px" });
      this.DOM.highlightRangeLimits.style("height",this.height_hist+"px");
    },
    /** -- */
    updateAfterFilter: function(){
      if(this.isEmpty() || this.collapsed || !this.inBrowser()) return;
      this.updateChartScale_Measure();
      this.refreshMeasureLabel();
      this.refreshViz_EmptyRecords();
      this.updatePercentiles("Active");
    },
    /** -- */
    updateChartScale_Measure: function(){
      if(!this.aggr_initialized || this.isEmpty()) return; // nothing to do
      var me=this;
      this.updateBarScale2Active();
      this.refreshBins_Translate();
      this.refreshViz_Scale();
      this.refreshViz_Highlight();
      this.refreshViz_Compare_All();
      this.refreshViz_Axis();
    },
    /** -- */
    setRecordValue: function(record){
      if(!this.inBrowser() || !this.DOM.inited || this.valueScale===undefined) return;
      var v = this.getRecordValue(record);
      if( v===null || (this.scaleType==='log' && v<=0) ) return;

      var me=this;
      var offset = (this.stepTicks && !this.isTimeStamp()) ? this.aggrWidth/2 : 0;
      this.DOM.recordValue
        .each(function(){ kshf.Util.setTransform(this,"translateX("+(me.valueScale(v)+offset)+"px)"); })
        .style("display","block");
      this.DOM.recordValueText.html( this.printWithUnitName(v) );
    },
    /** -- */
    hideRecordValue: function(){
      if(!this.DOM.inited) return;
      this.DOM.recordValue.style("display",null);
    },
    /** -- */
    updatePercentiles: function(distr){
      if(this.percentileChartVisible===false) return;

      var me=this;
      // get active values into an array
      // the items are already sorted by their numeric value, it's just a linear pass.
      var collectFunc, values = [];
      if(distr==="Active"){
        collectFunc = function(record){ if(record.isWanted) values.push(me.getRecordValue(record)); };
      } else if(distr==="Highlight"){
        collectFunc = function(record){ if(record.highlighted) values.push(me.getRecordValue(record)); };
      } else { // Compare_A / Compare_B / Compare_C
        var cT = distr.substr(8);
        collectFunc = function(record){ if(record.selectCompared[cT]) values.push(me.getRecordValue(record)); };
        // Below doesn't work: The values will not be in sorted order!!
/*      this.browser.selectedAggr[distr].records.forEach(function(record){
          val v = me.getRecordValue(record);
          if(v!==null) values.push(v);
        }); */
      }
      this.filteredRecords.forEach(collectFunc);

      [10,20,30,40,50,60,70,80,90].forEach(function(q){
        var x =d3.quantile(values,q/100);
        this.quantile_val[distr+q] = x;
        this.quantile_pos[distr+q] = this.valueScale(x);
      },this);

      this.DOM.percentileGroup.select(".percentileChart_"+distr).style("opacity",1);

      [10,20,30,40,50,60,70,80,90].forEach(function(q){
        kshf.Util.setTransform(this.DOM.quantile[distr+q][0][0],"translateX("+this.quantile_pos[distr+q]+"px)");
      },this);

      [[10,90],[20,80],[30,70],[40,60]].forEach(function(qb){
        kshf.Util.setTransform(this.DOM.quantile[distr+qb[0]+"_"+qb[1]][0][0],
          "translateX("+(this.quantile_pos[distr+qb[0]])+"px) "+
          "scaleX("+(this.quantile_pos[distr+qb[1]]-this.quantile_pos[distr+qb[0]])+") ");
      },this);
    },
};
for(var index in Summary_Interval_functions){
  kshf.Summary_Interval.prototype[index] = Summary_Interval_functions[index];
}


kshf.Summary_Set = function(){};
kshf.Summary_Set.prototype = new kshf.Summary_Base();
var Summary_Clique_functions = {
  initialize: function(browser,setListSummary,side){
    kshf.Summary_Base.prototype.initialize.call(this,browser,"Relations in "+setListSummary.summaryName);
    var me = this;
    this.setListSummary = setListSummary;

    this.panel = this.setListSummary.panel; // so that inBrowser() would work correctly. Hmmm...

    this.popupSide = side ? side : ( (this.setListSummary.panel.name==="left") ? "right" : "left" );

    this.pausePanning=false;
    this.gridPan_x=0;

    // Update sorting options of setListSummary (adding relatednesness metric...)
    this.setListSummary.catSortBy[0].name = this.browser.recordName+" #";
    this.setListSummary.insertSortingOption({
      name: "Relatedness",
      value: function(category){ return -category.MST.index; },
      prep: function(){ me.updatePerceptualOrder(); }
    });
    this.setListSummary.refreshCatSortOptions();

    this.setListSummary.onCatSort = function(){
      me.refreshWindowSize();
      me.refreshRow();
      me.DOM.setPairGroup.attr("animate_position",false);
      me.refreshSetPair_Position();
      setTimeout(function(){ me.DOM.setPairGroup.attr("animate_position",true); },1000);
    };
    this.setListSummary.onCatCull = function(){
      if(me.pausePanning) return;
      me.checkPan();
      me.refreshSVGViewBox();
    };
    this.setListSummary.onCatHeight = function(){
      me.updateWidthFromHeight();
      me.updateSetPairScale();
      
      me.DOM.chartRoot.attr("show_gridlines",(me.getRowHeight()>15));
      
      me.DOM.setPairGroup.attr("animate_position",false);
      me.refreshRow();
      me.refreshSetPair_Background();
      me.refreshSetPair_Position();
      me.refreshViz_All();
      me.refreshWindowSize();
      me.refreshSetPair_Strength();
      setTimeout(function(){
        me.DOM.setPairGroup.attr("animate_position",true);
      },1000);
    };

    this._setPairs = [];
    this._setPairs_ID = {};
    this._sets = this.setListSummary._cats; // sorted already
    this._sets.forEach(function(set){ set.setPairs = []; });

    this.createSetPairs();

    // Inserts the DOM root under the setListSummary so that the matrix view is attached...
    this.DOM.root = this.setListSummary.DOM.root.insert("div",":first-child")
      .attr("class","kshfSummary setPairSummary")
      .attr("filtered",false)
      .attr("popupSide",this.popupSide);

    // Use keshif's standard header
    this.insertHeader();
    this.DOM.headerGroup.style("height",(this.setListSummary.getHeight_Header())+"px");

    this.DOM.chartRoot = this.DOM.wrapper.append("span")
      .attr("class","Summary_Set")
      .attr("noanim",false)
      .attr("show_gridlines",true);

    this.DOM.chartRoot.append("span").attr("class","setMatrixWidthAdjust")
      .attr("title","Drag to adjust width")
      .on("mousedown", function (d, i) {
        if(d3.event.which !== 1) return; // only respond to left-click
        browser.DOM.root.attr('adjustWidth',true).attr("pointerEvents",false);
        me.DOM.root.attr('noanim',true);
        me.DOM.setPairGroup.attr("animate_position",false);
        var mouseInit_x = d3.mouse(d3.select("body")[0][0])[0];
        console.log("mouseInit_x: "+mouseInit_x);
        var initWidth = me.getWidth();
        var myHeight = me.getHeight();
        d3.select("body").on("mousemove", function() {
          var mouseDif = d3.mouse(d3.select("body")[0][0])[0]-mouseInit_x;
          me.noanim = true;
          me.summaryWidth = (me.popupSide==="left") ? initWidth-mouseDif : initWidth+mouseDif;
          me.checkWidth();
          me.refreshWindowSize();
          me.refreshRow_LineWidths();
          me.refreshSetPair_Position();
        }).on("mouseup", function(){
          browser.DOM.root.attr('adjustWidth',null).attr("pointerEvents",true);
          me.DOM.setPairGroup.attr("animate_position",true);
          me.DOM.root.attr('noanim',false);
          me.noanim = false;
          // unregister mouse-move callbacks
          d3.select("body").on("mousemove", null).on("mouseup", null);
        });
        d3.event.preventDefault();
      })
      .on("click",function(){
          d3.event.stopPropagation();
          d3.event.preventDefault();
      });

    this.insertControls();

    this.DOM.setMatrixSVG = this.DOM.chartRoot.append("svg").attr("xmlns","http://www.w3.org/2000/svg").attr("class","setMatrix");

    /** BELOW THE MATRIX **/
    this.DOM.belowMatrix = this.DOM.chartRoot.append("div").attr("class","belowMatrix");

    this.DOM.pairCount = this.DOM.belowMatrix.append("span").attr("class","pairCount matrixInfo");
    this.DOM.pairCount_Text = this.DOM.pairCount.append("span").attr("class","pairCount_Text")
      .html("<i class='fa fa-circle' style='color: #b1bdc5;'></i> "+
        this._setPairs.length+" Pairs ("+Math.round(100*this._setPairs.length/this.getSetPairCount_Total())+"%)");

    this.DOM.subsetCount = this.DOM.belowMatrix.append("span").attr("class","subsetCount matrixInfo");
    this.DOM.subsetCount.append("span").attr("class","circleeee borrderr");
    this.DOM.subsetCount_Text = this.DOM.subsetCount.append("span").attr("class","subsetCount_Text");

    // invisible background - Used for panning
    this.DOM.setMatrixBackground = this.DOM.setMatrixSVG.append("rect")
      .attr("x",0).attr("y",0)
      .style("fill-opacity","0")
      .on("mousedown",function(){
        var background_dom = this.parentNode.parentNode.parentNode.parentNode;

        background_dom.style.cursor = "all-scroll";
        me.browser.DOM.pointerBlock.attr("active","");
        me.browser.DOM.root.attr("pointerEvents",false);

        var mouseInitPos = d3.mouse(background_dom);
        var gridPan_x_init = me.gridPan_x;

        // scroll the setlist summary too...
        var scrollDom = me.setListSummary.DOM.aggrGroup[0][0];
        var initScrollPos = scrollDom.scrollTop;
        var w=me.getWidth();
        var h=me.getHeight();
        var initT = me.setListSummary.scrollTop_cache;
        var initR = Math.min(-initT-me.gridPan_x,0);

        me.pausePanning = true;

        d3.select("body").on("mousemove", function() {
          var mouseMovePos = d3.mouse(background_dom);
          var difX = mouseMovePos[0]-mouseInitPos[0];
          var difY = mouseMovePos[1]-mouseInitPos[1];

          if(me.popupSide==="right") {
            difX *= -1;
          }

          me.gridPan_x = Math.min(0,gridPan_x_init+difX+difY);
          me.checkPan();

          var maxHeight = me.setListSummary.heightRow_category*me.setListSummary._cats.length - h;

          var t = initT-difY;
              t = Math.min(maxHeight,Math.max(0,t));
          var r = initR-difX;
              r = Math.min(0,Math.max(r,-t));

          if(me.popupSide==="right") r = -r;

          me.DOM.setMatrixSVG.attr("viewBox",r+" "+t+" "+w+" "+h);

          scrollDom.scrollTop = Math.max(0,initScrollPos-difY);

          d3.event.preventDefault();
          d3.event.stopPropagation();
        }).on("mouseup", function(){
          me.pausePanning = false;
          background_dom.style.cursor = "default";
          me.browser.DOM.root.attr("pointerEvents",true);
          d3.select("body").on("mousemove", null).on("mouseup", null);
          me.browser.DOM.pointerBlock.attr("active",null);
          me.refreshLabel_Vert_Show();
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });
        d3.event.preventDefault();
        d3.event.stopPropagation();
      })
      ;

    this.DOM.setMatrixSVG.append("g").attr("class","rows");
    this.DOM.setPairGroup = this.DOM.setMatrixSVG.append("g").attr("class","aggrGroup setPairGroup").attr("animate_position",true);

    this.insertRows();
    this.insertSetPairs();

    this.updateWidthFromHeight();
    this.updateSetPairScale();

    this.refreshRow();

    this.refreshSetPair_Background();
    this.refreshSetPair_Position();
    this.refreshSetPair_Containment();

    this.refreshViz_Axis();
    this.refreshViz_Active();

    this.refreshWindowSize();
  },
  /** -- */
  refreshHeight: function(){
    // TODO: Added just because the browser calls this automatically
  },
  /** -- */
  isEmpty: function(){
    return false; // TODO Temp?
  },
  /** -- */
  getHeight: function(){
    return this.setListSummary.categoriesHeight;
  },
  /** -- */
  getWidth: function(){
    return this.summaryWidth;
  },
  /** -- */
  getRowHeight: function(){
    return this.setListSummary.heightRow_category;
  },
  /** -- */
  getSetPairCount_Total: function(){
    return this._sets.length*(this._sets.length-1)/2;
  },
  /** -- */
  getSetPairCount_Empty: function(){
    return this.getSetPairCount_Total()-this._setPairs.length;
  },
  /** -- */
  updateWidthFromHeight: function(){
    this.summaryWidth = this.getHeight()+25;
    this.checkWidth();
  },
  /** -- */
  updateSetPairScale: function(){
    this.setPairDiameter = this.setListSummary.heightRow_category;
    this.setPairRadius = this.setPairDiameter/2;
  },
  /** -- */
  updateMaxAggr_Active: function(){
    this._maxSetPairAggr_Active = d3.max(this._setPairs, function(aggr){ return aggr.measure('Active'); });
  },
  /** -- */
  checkWidth: function(){
    var minv=210;
    var maxv=Math.max(minv,this.getHeight())+160;
    this.summaryWidth = Math.min(maxv,Math.max(minv,this.summaryWidth));
  },
  /** -- */
  checkPan: function(){
    var maxV = 0;
    var minV = -this.setListSummary.scrollTop_cache;
    this.gridPan_x = Math.round(Math.min(maxV,Math.max(minV,this.gridPan_x)));
  },
  /** -- */
  insertControls: function(){
    var me=this;
    this.DOM.summaryControls = this.DOM.chartRoot.append("div").attr("class","summaryControls")
      .style("height",(this.setListSummary.getHeight_Config())+"px"); // TODO: remove

    this.DOM.strengthControl = this.DOM.summaryControls.append("span").attr("class","strengthControl")
      .each(function(d,i){
        this.tipsy = new Tipsy(this, { gravity: "n", title: "Color <i class='fa fa-circle'></i> by pair-wise strength" });
      })
      .on("mouseover",function(){ if(this.dragging!==true) this.tipsy.show(); })
      .on("mouseout" ,function(){ this.tipsy.hide(); })
      .on("click",function(){ me.browser.setScaleMode(me.browser.ratioModeActive!==true); });

    // ******************* STRENGTH CONFIG
    this.DOM.strengthControl.append("span").attr("class","strengthLabel").text("Weak");
    this.DOM.strengthControl.append("span").attr("class","strengthText").text("Strength");
    this.DOM.strengthControl.append("span").attr("class","strengthLabel").text("Strong");

    this.DOM.scaleLegend_SVG = this.DOM.summaryControls.append("svg").attr("xmlns","http://www.w3.org/2000/svg")
      .attr("class","sizeLegend");

    this.DOM.legendHeader = this.DOM.scaleLegend_SVG.append("text").attr("class","legendHeader").text("#");
    this.DOM.legend_Group = this.DOM.scaleLegend_SVG.append("g");
  },
  /** -- */
  insertRows: function(){
    var me=this;

    var newRows = this.DOM.setMatrixSVG.select("g.rows").selectAll("g.row")
      .data(this._sets, function(d,i){ return d.id(); })
    .enter().append("g").attr("class","row")
      .each(function(d){ d.DOM.matrixRow = this; })
      .on("mouseenter",function(d){ me.setListSummary.onCatEnter(d); })
      .on("mouseleave",function(d){ me.setListSummary.onCatLeave(d); });

    // tmp is used to parse html text. TODO: delete the temporary DOM
    var tmp = document.createElement("div");
    newRows.append("line").attr("class","line line_vert")
      .attr("x1",0).attr("y1",0).attr("y1",0).attr("y2",0);
    newRows.append("text").attr("class","label label_horz")
      .text(function(d){
        tmp.innerHTML = me.setListSummary.catLabel_Func.call(d.data);
        return tmp.textContent || tmp.innerText || "";
      });
    newRows.append("line").attr("class","line line_horz")
      .attr("x1",0).attr("y1",0).attr("y2",0);
    newRows.append("text").attr("class","label label_vert")
      .text(function(d){
        tmp.innerHTML = me.setListSummary.catLabel_Func.call(d.data);
        return tmp.textContent || tmp.innerText || "";
      })
      .attr("y",-4);

    this.DOM.setRows         = this.DOM.setMatrixSVG.selectAll("g.rows > g.row");
    this.DOM.line_vert       = this.DOM.setMatrixSVG.selectAll("g.rows > g.row > line.line_vert");
    this.DOM.line_horz       = this.DOM.setMatrixSVG.selectAll("g.rows > g.row > line.line_horz");
    this.DOM.line_horz_label = this.DOM.setMatrixSVG.selectAll("g.rows > g.row > text.label_horz");
    this.DOM.line_vert_label = this.DOM.setMatrixSVG.selectAll("g.rows > g.row > text.label_vert");
  },
  /** -- */
  onSetPairEnter: function(aggr){
    aggr.set_1.DOM.matrixRow.setAttribute("selection","selected");
    aggr.set_2.DOM.matrixRow.setAttribute("selection","selected");
    aggr.set_1.DOM.aggrGlyph.setAttribute("selectType","and");
    aggr.set_2.DOM.aggrGlyph.setAttribute("selectType","and");
    aggr.set_1.DOM.aggrGlyph.setAttribute("selection","selected");
    aggr.set_2.DOM.aggrGlyph.setAttribute("selection","selected");
    this.browser.setSelect_Highlight(aggr);
  },
  /** -- */
  onSetPairLeave: function(aggr){
    aggr.set_1.DOM.matrixRow.removeAttribute("selection");
    aggr.set_2.DOM.matrixRow.removeAttribute("selection");
    aggr.set_1.DOM.aggrGlyph.removeAttribute("selection");
    aggr.set_2.DOM.aggrGlyph.removeAttribute("selection");
    this.browser.clearSelect_Highlight();
  },
  /** -- */
  insertSetPairs: function(){
    var me=this;
    var newCliques = this.DOM.setMatrixSVG.select("g.setPairGroup").selectAll("g.setPairGlyph")
      .data(this._setPairs,function(d,i){ return i; })
    .enter().append("g").attr("class","aggrGlyph setPairGlyph")
      .each(function(d){ d.DOM.aggrGlyph = this; })
      .on("mouseenter",function(aggr){
        if(me.browser.mouseSpeed<0.2) {
          me.onSetPairEnter(aggr);
          return;
        }
        this.highlightTimeout = window.setTimeout( function(){ me.onSetPairEnter(aggr) }, me.browser.mouseSpeed*500);
      })
      .on("mouseleave",function(aggr){
        if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
        me.onSetPairLeave(aggr);
      })
      .on("click",function(aggr){
        if(d3.event.shiftKey){
          me.browser.setSelect_Compare(false);
          return;
        }
        me.setListSummary.filterCategory(aggr.set_1,"AND");
        me.setListSummary.filterCategory(aggr.set_2,"AND");
      });

    newCliques.append("rect").attr("class","setPairBackground").attr("rx",3).attr("ry",3);
    newCliques.append("circle").attr("class","measure_Active").attr("cx",0).attr("cy",0).attr("r",0);
    newCliques.append("path").attr("class","measure_Highlight").each(function(aggr){ 
      aggr.currentPreviewAngle=-Math.PI/2; });
    newCliques.append("path").attr("class","measure_Compare_A");
    newCliques.append("path").attr("class","measure_Compare_B");
    newCliques.append("path").attr("class","measure_Compare_C");

    this.DOM.aggrGlyphs        = this.DOM.setPairGroup.selectAll("g.setPairGlyph");
    this.DOM.setPairBackground = this.DOM.aggrGlyphs.selectAll(".setPairBackground");
    this.DOM.measure_Active    = this.DOM.aggrGlyphs.selectAll(".measure_Active");
    this.DOM.measure_Highlight = this.DOM.aggrGlyphs.selectAll(".measure_Highlight");
    this.DOM.measure_Compare_A = this.DOM.aggrGlyphs.selectAll(".measure_Compare_A");
    this.DOM.measure_Compare_B = this.DOM.aggrGlyphs.selectAll(".measure_Compare_B");
    this.DOM.measure_Compare_C = this.DOM.aggrGlyphs.selectAll(".measure_Compare_C");
  },
  /** -- */
  printAggrSelection: function(aggr){
    return this.setListSummary.printAggrSelection(aggr.set_1)+ " and "+
      this.setListSummary.printAggrSelection(aggr.set_2);
  },
  /** -- */
  refreshLabel_Vert_Show: function(){
    var me=this;
    var setListSummary=this.setListSummary;
    var totalWidth=this.getWidth();
    var totalHeight = this.getHeight();
    var w=this.getWidth();
    var h=this.getHeight();
    var t=this.setListSummary.scrollTop_cache;
    var r=(t)*-1;
    this.DOM.line_vert_label // points up/right
      .attr("show",function(d){ return !d.isVisible; })
      .attr("transform",function(d){
        var i=d.orderIndex;
        var x=totalWidth-((i+0.5)*me.setPairDiameter)-2;
        if(me.popupSide==="right") x = totalWidth-x-4;
        var y=((me.setListSummary.catCount_Visible-i-1)*me.setPairDiameter);
        y-=setListSummary.getHeight_VisibleAttrib()-setListSummary.scrollTop_cache-totalHeight;
        return "translate("+x+" "+y+") rotate(-90)";//" rotate(45) ";
      });
  },
  /** --*/
  updatePerceptualOrder: function(){
    var me=this;
    
    // Edges are set-pairs with at least one element inside (based on the filtering state)
    var edges = this._setPairs.filter(function(setPair){ return setPair._measure.Active>0; });
    // Nodes are the set-categories
    var nodes = this.setListSummary._cats;

    // Initialize per-node (per-set) data structures

    nodes.forEach(function(node){
      node.MST = {
        tree: new Object(), // Some unqiue identifier, to check if two nodes are in the same tree.
        childNodes: [],
        parentNode: null
      };
    });

    // Compute the perceptual similarity metric (mst_distance)
    edges.forEach(function(edge){
      var set_1 = edge.set_1;
      var set_2 = edge.set_2;
      edge.mst_distance = 0;
      // For every intersection of set_1
      set_1.setPairs.forEach(function(setPair_1){
        if(setPair_1===edge) return;
        var set_other = (setPair_1.set_1===set_1)?setPair_1.set_2:setPair_1.set_1;
        // find the set-pair of set_2 and set_other;
        var setPair_2 = undefined;
        if(set_2.id()>set_other.id()){
          if(me._setPairs_ID[set_other.id()])
            setPair_2 = me._setPairs_ID[set_other.id()][set_2.id()];
        } else {
          if(me._setPairs_ID[set_2.id()])
            setPair_2 = me._setPairs_ID[set_2.id()][set_other.id()];
        }
        if(setPair_2===undefined){ // the other intersection size is zero, there is no link
          edge.mst_distance+=setPair_1._measure.Active;
          return;
        }
        edge.mst_distance += Math.abs(setPair_1._measure.Active-setPair_2._measure.Active);
      });
      // For every intersection of set_2
      set_2.setPairs.forEach(function(setPair_1){
        if(setPair_1===edge) return;
        var set_other = (setPair_1.set_1===set_2)?setPair_1.set_2:setPair_1.set_1;
        // find the set-pair of set_1 and set_other;
        var setPair_2 = undefined;
        if(set_1.id()>set_other.id()){
          if(me._setPairs_ID[set_other.id()])
            setPair_2 = me._setPairs_ID[set_other.id()][set_1.id()];
        } else {
          if(me._setPairs_ID[set_1.id()])
            setPair_2 = me._setPairs_ID[set_1.id()][set_other.id()];
        }
        if(setPair_2===undefined){ // the other intersection size is zero, there is no link
          edge.mst_distance+=setPair_1._measure.Active;
          return;
        }
        // If ther is setPair_2, it was already processed in the main loop above
      });
    });

    // Order the edges (setPairs) by their distance (lower score is better)
    edges.sort(function(e1, e2){ return e1.mst_distance-e2.mst_distance; });

    // Run Kruskal's algorithm...
    edges.forEach(function(setPair){
      var node_1 = setPair.set_1;
      var node_2 = setPair.set_2;
      // set_1 and set_2 are in the same tree
      if(node_1.MST.tree===node_2.MST.tree) return;
      // set_1 and set_2 are not in the same tree, connect set_2 under set_1
      var set_above, set_below;
      if(node_1.setPairs.length<node_2.setPairs.length){
        set_above = node_1;
        set_below = node_2;
      } else {
        set_above = node_2;
        set_below = node_1;
      }
      set_below.MST.tree = set_above.MST.tree;
      set_below.MST.parentNode = set_above;
      set_above.MST.childNodes.push(set_below);
    });

    // Identify the root-nodes of resulting MSTs
    var treeRootNodes = nodes.filter(function(node){ return node.MST.parentNode===null; });

    // We can have multiple trees (there can be sub-groups disconnected from each other) 

    // Update tree size recursively by starting at the root nodes
    var updateTreeSize = function(node){
      node.MST.treeSize=1;
      node.MST.childNodes.forEach(function(childNode){ node.MST.treeSize+=updateTreeSize(childNode); });
      return node.MST.treeSize;
    };
    treeRootNodes.forEach(function(rootNode){ updateTreeSize(rootNode); });

    // Sort the root nodes by largest tree first
    treeRootNodes.sort(function(node1, node2){ return node1.MST.treeSize - node2.MST.treeSize; });
    
    // For each MST, traverse the nodes and add the MST (perceptual) node index incrementally
    var mst_index = 0;
    var updateNodeIndex = function(node){
      node.MST.childNodes.forEach(function(chileNode){ chileNode.MST.index = mst_index++; });
      node.MST.childNodes.forEach(function(chileNode){ updateNodeIndex(chileNode); });
    };
    treeRootNodes.forEach(function(node){
      node.MST.index = mst_index++;
      updateNodeIndex(node);
    });
  },
  /** -- */
  refreshViz_Axis: function(){
    var me=this;

    this.refreshSetPair_Strength();

    if(this.browser.ratioModeActive){
      this.DOM.scaleLegend_SVG.style("display","none");
      return;
    }
    this.DOM.scaleLegend_SVG.style("display","block");

    this.DOM.scaleLegend_SVG
      .attr("width",this.setPairDiameter+50)
      .attr("height",this.setPairDiameter+10)
      .attr("viewBox","0 0 "+(this.setPairDiameter+35)+" "+(this.setPairDiameter+10));

    this.DOM.legend_Group.attr("transform", "translate("+(this.setPairRadius)+","+(this.setPairRadius+18)+")");
    this.DOM.legendHeader.attr("transform", "translate("+(2*this.setPairRadius+3)+",6)");

    var maxVal = this._maxSetPairAggr_Active;
    
    tickValues = [maxVal];
    if(this.setPairRadius>8) tickValues.push(Math.round(maxVal/4));

    this.DOM.legend_Group.selectAll("g.legendMark").remove();

    var tickDoms = this.DOM.legend_Group.selectAll("g.legendMark").data(tickValues,function(i){return i;});

    this.DOM.legendCircleMarks = tickDoms.enter().append("g").attr("class","legendMark");

    this.DOM.legendCircleMarks.append("circle").attr("class","legendCircle")
      .attr("cx",0).attr("cy",0)
      .attr("r",function(d,i){
        return me.setPairRadius*Math.sqrt(d/maxVal);
      });
    this.DOM.legendCircleMarks.append("line").attr("class","legendLine")
      .each(function(d,i){
        var rx=me.setPairRadius+3;
        var ry=me.setPairRadius*Math.sqrt(d/maxVal);
        var x2,y1;
        switch(i%4){
          case 0:
            x2 = rx;
            y1 = -ry;
            break;
          case 1:
            x2 = rx; // -rx;
            y1 = ry; // -ry;
            break;
          case 2:
            x2 = rx;
            y1 = ry;
            break;
          case 3:
            x2 = -rx;
            y1 = ry;
            break;
        }
        this.setAttribute("x1",0);
        this.setAttribute("x2",x2);
        this.setAttribute("y1",y1);
        this.setAttribute("y2",y1);
      });
    this.DOM.legendText = this.DOM.legendCircleMarks
      .append("text").attr("class","legendLabel");

    this.DOM.legendText.each(function(d,i){
      var rx=me.setPairRadius+3;
      var ry=me.setPairRadius*Math.sqrt(d/maxVal);
      var x2,y1;
      switch(i%4){
        case 0:
          x2 = rx;
          y1 = -ry;
          break;
        case 1:
          x2 = rx; // -rx;
          y1 = ry; // -ry;
          break;
        case 2:
          x2 = rx;
          y1 = ry;
          break;
        case 3:
          x2 = -rx;
          y1 = ry;
          break;
      }
      this.setAttribute("transform","translate("+x2+","+y1+")");
      this.style.textAnchor = (i%2===0||true)?"start":"end";
    });

    this.DOM.legendText.text(function(d){ return d3.format("s")(d); });
  },
  /** -- */
  refreshWindowSize: function(){
    var w=this.getWidth();
    var h=this.getHeight();
    this.DOM.wrapper.style("height",( this.setListSummary.getHeight()-this.setListSummary.getHeight_Header())+"px");
    this.DOM.setMatrixBackground
      .attr("x",-w*24)
      .attr("y",-h*24)
      .attr("width",w*50)
      .attr("height",h*50);
    this.DOM.root
      .style(this.popupSide,(-w)+"px")
      .style(this.popupSide==="left"?"right":"left","initial");
    if(!this.pausePanning) this.refreshSVGViewBox();
  },
  /** -- */
  setPopupSide: function(p){
    if(p===this.popupSide) return;
    this.popupSide = p;
    this.DOM.root.attr("popupSide",this.popupSide);
    this.refreshWindowSize();
    this.refreshRow_LineWidths();
    this.refreshSetPair_Position();
  },
  /** -- */
  refreshSVGViewBox: function(){
    var w=this.getWidth();
    var h=this.getHeight();
    var t=this.setListSummary.scrollTop_cache;
    var r;
    if(this.popupSide==="left"){
      r=Math.min(-t-this.gridPan_x,0); // r cannot be positive
    }
    if(this.popupSide==="right"){
      r=Math.max(t+this.gridPan_x,0);
    }
    this.DOM.setMatrixSVG.attr("width",w).attr("height",h).attr("viewBox",r+" "+t+" "+w+" "+h);
    this.refreshLabel_Vert_Show();
  },
  /** -- */
  refreshSetPair_Background: function(){
    this.DOM.setPairBackground
      .attr("x",-this.setPairRadius)
      .attr("y",-this.setPairRadius)
      .attr("width",this.setPairDiameter)
      .attr("height",this.setPairDiameter);
  },
  /** 
    - Call when measure.Active is updated 
    - Does not work with Average aggregate
    */
  updateSetPairSimilarity: function(){
    this._setPairs.forEach(function(setPair){
      var size_A = setPair.set_1._measure.Active;
      var size_B = setPair.set_2._measure.Active;
      var size_and = setPair._measure.Active;
      setPair.Similarity = (size_and===0 || (size_A===0&&size_B===0)) ? 0 : size_and/Math.min(size_A,size_B);
    });
    this._maxSimilarity = d3.max(this._setPairs, function(d){ return d.Similarity; });
  },
  /** For each element in the given list, checks the set membership and adds setPairs */
  createSetPairs: function(){
    var me=this;

    var insertToClique = function(set_1,set_2,record){
      // avoid self reference and adding the same data item twice (insert only A-B, not B-A or A-A/B-B)
      if(set_2.id()<=set_1.id()) return;

      if(me._setPairs_ID[set_1.id()]===undefined) me._setPairs_ID[set_1.id()] = {};

      var targetClique = me._setPairs_ID[set_1.id()][set_2.id()];
      if(targetClique===undefined){
        targetClique = new kshf.Aggregate();
        targetClique.summary = me.setListSummary;
        targetClique.init([me._setPairs.length],0);
        me.browser.allAggregates.push(targetClique);
        targetClique.set_1 = set_1;
        targetClique.set_2 = set_2;
        set_1.setPairs.push(targetClique);
        set_2.setPairs.push(targetClique);

        me._setPairs.push(targetClique);
        me._setPairs_ID[set_1.id()][set_2.id()] = targetClique;
      }
      targetClique.addRecord(record);
    };

    // AND
    var filterID = this.setListSummary.summaryID;
    function getAggr(v){ return me.setListSummary.catTable_id[v]; };
    this.setListSummary.records.forEach(function(record){
      var values = record._valueCache[filterID];
      if(values===null) return; // maps to no value
      values.forEach(function(v_1){
        set_1 = getAggr(v_1);
        // make sure set_1 has an attrib on c display
        if(set_1.setPairs===undefined) return;
        values.forEach(function(v_2){
          set_2 = getAggr(v_2);
          if(set_2.setPairs===undefined) return;
          insertToClique(set_1,set_2,record);
        });
      });
    });

    this.updateMaxAggr_Active();
    this.updateSetPairSimilarity();
  },
  /** -- */
  refreshRow_LineWidths: function(){
    var me=this;
    var setPairDiameter=this.setPairDiameter;
    var totalWidth=this.getWidth();
    var totalHeight = this.getHeight();
    // vertical
    this.DOM.line_vert.each(function(d){
      var i=d.orderIndex;
      var height=((me.setListSummary.catCount_Visible-i-1)*setPairDiameter);
      var right=((i+0.5)*setPairDiameter);
      var m=totalWidth-right;
      if(me.popupSide==="right") m = right;
      this.setAttribute("x1",m);
      this.setAttribute("x2",m);
      this.setAttribute("y2",height);
    });
    // horizontal
    this.DOM.line_horz
      .attr("x2",(this.popupSide==="left")?totalWidth : 0)
      .attr("x1",function(d){
        var m = ((d.orderIndex+0.5)*setPairDiameter);
        return (me.popupSide==="left") ? (totalWidth-m) : m;
      });
    this.DOM.line_horz_label.attr("transform",function(d){
      var m=((d.orderIndex+0.5)*setPairDiameter)+2;
      if(me.popupSide==="left") m = totalWidth-m;
      return "translate("+m+" 0)";
    });
  },
  /** -- */
  refreshRow_Position: function(){
    var rowHeight = this.setPairDiameter;
    this.DOM.setRows.attr("transform",function(set){ return "translate(0,"+((set.orderIndex+0.5)*rowHeight)+")"; });
  },
  /** -- */
  refreshRow: function(){
    this.refreshRow_Position();
    this.refreshRow_LineWidths();
  },
  /** -- */
  refreshSetPair_Position: function(){
    var me=this;
    var w=this.getWidth();
    this.DOM.aggrGlyphs.each(function(setPair){
      var i1 = setPair.set_1.orderIndex;
      var i2 = setPair.set_2.orderIndex;
      var left = (Math.min(i1,i2)+0.5)*me.setPairDiameter;
      if(me.popupSide==="left") left = w-left;
      var top  = (Math.max(i1,i2)+0.5)*me.setPairDiameter;
      kshf.Util.setTransform(this,"translate("+left+"px,"+top+"px)");
    });
  },
  /** -- */
  getCliqueSizeRatio: function(setPair){
    return Math.sqrt(setPair.measure('Active')/this._maxSetPairAggr_Active);
  },
  /** Given a setPair, return the angle for preview
   Does not work with "Avg" measure
   **/
  getAngleToActive_rad: function(setPair,m){
    if(setPair._measure.Active===0) return 0;
    var ratio = setPair._measure[m] / setPair._measure.Active;
    if(this.browser.preview_not) ratio = 1-ratio;
    if(ratio===1) ratio=0.999;
    return ((360*ratio-90) * Math.PI) / 180;
  },
  /** -- */
  // http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
  // http://stackoverflow.com/questions/15591614/svg-radial-wipe-animation-using-css3-js
  // http://jsfiddle.net/Matt_Coughlin/j3Bhz/5/
  getPiePath: function(endAngleRad,sub,ratio){
    var r = ratio*this.setPairRadius-sub;
    var endX = Math.cos(endAngleRad) * r;
    var endY = Math.sin(endAngleRad) * r;
    var largeArcFlag = (endAngleRad>Math.PI/2)?1:0;
    return "M 0,"+(-r)+" A "+r+","+r+" "+largeArcFlag+" "+largeArcFlag+" 1 "+endX+","+endY+" L0,0";
  },
  /** setPairGlyph do not have a total component */
  refreshViz_Total: function(){
  },
  /** -- */
  refreshViz_Active: function(){
    var me=this;
    this.DOM.aggrGlyphs.attr("activesize",function(aggr){ return aggr.measure('Active'); });
    this.DOM.measure_Active.transition().duration(this.noanim?0:700)
      .attr("r",this.browser.ratioModeActive ?
        function(setPair){ return (setPair.subset!=='') ? me.setPairRadius-1 : me.setPairRadius; } :
        function(setPair){ return me.getCliqueSizeRatio(setPair)*me.setPairRadius; }
      );
  },
  /** -- */
  refreshViz_Highlight: function(){
    var me=this;
    this.DOM.measure_Highlight
      .transition().duration(500).attrTween("d",function(aggr) {
        var angleInterp = d3.interpolate(aggr.currentPreviewAngle, me.getAngleToActive_rad(aggr,"Highlight"));
        var ratio=(me.browser.ratioModeActive)?1:me.getCliqueSizeRatio(aggr);
        return function(t) {
          var newAngle=angleInterp(t);
          aggr.currentPreviewAngle = newAngle;
          return me.getPiePath(newAngle,(aggr.subset!=='' && me.browser.ratioModeActive)?2:0,ratio);
        };
      });
  },
  /** -- */
  refreshViz_Compare: function(cT, curGroup, totalGroups){
    var me=this;
    var strokeWidth = 1;
    if(this.browser.ratioModeActive){
      strokeWidth = Math.ceil(this.getRowHeight()/18);
    }
    this.DOM["measure_Compare_"+cT].attr("d",function(setPair){
      var ratio=(me.browser.ratioModeActive)?1:me.getCliqueSizeRatio(setPair);
      this.style.display = setPair.measure("Compare_"+cT)===0 ? "none" : "block";
      this.style.strokeWidth = strokeWidth;
      return me.getPiePath( me.getAngleToActive_rad(setPair,"Compare_"+cT), curGroup*strokeWidth, ratio );
    });
  },
  /** Does not work with Avg pair */
  refreshSetPair_Containment: function(){
    var me=this;
    var numOfSubsets = 0;
    this.DOM.measure_Active
      .each(function(setPair){
        var setPair_itemCount = setPair._measure.Active;
        var set_1_itemCount   = setPair.set_1._measure.Active;
        var set_2_itemCount   = setPair.set_2._measure.Active;
        if(setPair_itemCount===set_1_itemCount || setPair_itemCount===set_2_itemCount){
          numOfSubsets++;
          setPair.subset = (set_1_itemCount===set_2_itemCount)?'equal':'proper';
        } else {
          setPair.subset = '';
        }
      })
      .attr("subset",function(setPair){ return (setPair.subset!=='')?true:null; });

    this.DOM.subsetCount.style("display",(numOfSubsets===0)?"none":null);
    this.DOM.subsetCount_Text.text(numOfSubsets);

    this.refreshSetPair_Strength();
  },
  /** -- */
  refreshSetPair_Strength: function(){
    var me=this;
    
    var strengthColor = d3.interpolateHsl(d3.rgb(230, 230, 247),d3.rgb(159, 159, 223));
    this.DOM.measure_Active.style("fill",function(setPair){
      if(!me.browser.ratioModeActive) return null;
      return strengthColor(setPair.Similarity/me._maxSimilarity);
    });

    if(this.browser.ratioModeActive){
      this.DOM.measure_Active.each(function(setPair){
        // border
        if(setPair.subset==='') return;
        if(setPair.subset==='equal'){
          this.style.strokeDasharray = "";
          this.style.strokeDashoffset = "";
          return;
        }
        var halfCircle = (me.setPairRadius-1)*Math.PI;
        this.style.strokeDasharray = halfCircle+"px";
        // rotate halfway 
        var i1 = setPair.set_1.orderIndex;
        var i2 = setPair.set_2.orderIndex;
        var c1 = setPair.set_1._measure.Active;
        var c2 = setPair.set_2._measure.Active;
        if((i1<i2 && c1<c2) || (i1>i2 && c1>c2)) halfCircle = halfCircle/2;
        this.style.strokeDashoffset = halfCircle+"px";
      });
    }
  },
  /** -- */
  updateAfterFilter: function () {
    if(this.isEmpty() || this.collapsed || !this.inBrowser()) return;
    this.updateMaxAggr_Active();
    this.refreshViz_All();
    this.refreshViz_EmptyRecords();

    this.DOM.setRows.style("opacity",function(setRow){ return (setRow._measure.Active>0)?1:0.3; });
    this.updateSetPairSimilarity();
    this.refreshSetPair_Containment();
  },
};
for(var index in Summary_Clique_functions){
  kshf.Summary_Set.prototype[index] = Summary_Clique_functions[index];
}
