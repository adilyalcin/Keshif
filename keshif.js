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
  google.charts.load('current', {packages: ['corechart']});
  //google.load('visualization', '1', {'packages': []});
}

// Temporary: Until I build my own d3 bundle, this is not included in the main bundle
// https://github.com/d3/d3-selection-multi Version 1.0.0. Copyright 2016 Mike Bostock.
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(require("d3-selection"),require("d3-transition")):"function"==typeof define&&define.amd?define(["d3-selection","d3-transition"],n):n(t.d3,t.d3)}(this,function(t,n){"use strict";function r(n,r){return n.each(function(){var n=r.apply(this,arguments),e=t.select(this);for(var i in n)e.attr(i,n[i])})}function e(t,n){for(var r in n)t.attr(r,n[r]);return t}function i(t){return("function"==typeof t?r:e)(this,t)}function o(n,r,e){return n.each(function(){var n=r.apply(this,arguments),i=t.select(this);for(var o in n)i.style(o,n[o],e)})}function f(t,n,r){for(var e in n)t.style(e,n[e],r);return t}function u(t,n){return("function"==typeof t?o:f)(this,t,null==n?"":n)}function s(n,r){return n.each(function(){var n=r.apply(this,arguments),e=t.select(this);for(var i in n)e.property(i,n[i])})}function c(t,n){for(var r in n)t.property(r,n[r]);return t}function a(t){return("function"==typeof t?s:c)(this,t)}function p(n,r){return n.each(function(){var e=r.apply(this,arguments),i=t.select(this).transition(n);for(var o in e)i.attr(o,e[o])})}function l(t,n){for(var r in n)t.attr(r,n[r]);return t}function y(t){return("function"==typeof t?p:l)(this,t)}function h(n,r,e){return n.each(function(){var i=r.apply(this,arguments),o=t.select(this).transition(n);for(var f in i)o.style(f,i[f],e)})}function v(t,n,r){for(var e in n)t.style(e,n[e],r);return t}function d(t,n){return("function"==typeof t?h:v)(this,t,null==n?"":n)}t.selection.prototype.attrs=i,t.selection.prototype.styles=u,t.selection.prototype.properties=a,n.transition.prototype.attrs=y,n.transition.prototype.styles=d});

var kshf = {
  browsers: [],
  dt: {},
  dt_id: {},

  maxVisibleItems_Default: 100,
  scrollWidth: 19,
  attribPanelWidth: 220,
  catHeight: 18,

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
      zoomControl: false,
      worldcopyjump: true
      /*continuousWorld: true, crs: L.CRS.EPSG3857 */
    },
    tileConfig: { 
      attribution: '© <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'+
        ' &amp; <a href="http://cartodb.com/attributions" target="_blank">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      //noWrap: true
    },
    flyConfig:{ 
      padding: [0,0], 
      pan: {animate: true, duration: 1.2}, 
      zoom: {animate: true} 
    },
  },

  lang: {
    en: {
      ModifyBrowser: "Modify browser",
      OpenDataSource: "Open data source",
      ShowInfoCredits: "Powered by Keshif<br>Show info",
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
      ChangeMeasureFunc: "Change metric",
      Search: "Search",
      CreatingBrowser: "Creating Keshif Browser",
      Rows: "Rows",
      More: "More",
      LoadingData: "Loading data sources",
      ShowAll: "Show All",
      ScrollToTop: "Top",
      Percent: "Percent",
      Absolute: "Absolute",
      AbsoluteSize: "Absolute Size",
      PartOfSize: "Relative Size",
      Width: "Size",
      DragToFilter: "Drag",
      And: "And",
      Or: "Or",
      Not: "Not",
      EditTitle: "Rename",
      ResizeBrowser: "Resize browser",
      RemoveRecords: "Remove record panel",
      EditFormula: "Edit formula",
      NoData: "(No data)",
      ValidData: "(Valid data)",
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
      PartOfSize: "Görece",
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
      VelidData: "(veri var)",
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
      PartOfSize: "Part-Of",
      Width: "Largeur",
      DragToFilter: "??",
      And: "??",
      Or: "??",
      Not: "??",
      EditFormula: "Edit Formula",
      NoData: "(No data)",
      ValidData: "(Valid data)",
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
      NoData: "(No data)",
      ValidData: "(Valid data)",
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
      scrollDom = scrollDom.node();
      kshf.Util.ignoreScrollEvents = true;
      // scroll to top
      var startTime = null;
      var scrollInit = scrollDom.scrollTop;
      var easeFunc = d3.easeCubicOut;
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
      google: { 
        families: [ 
          'Roboto:400,500,300,100,700:latin', 
          'Montserrat:400,700:latin', 
          'Roboto+Slab:700'
        ]
      }
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
    d3.request('https://api.github.com/user')
      .header("Authorization","token "+kshf.githubToken)
      .get(function(error, data){ kshf.gistLogin = JSON.parse(data.response).login; });
  },

  kshfLogo: '<svg class="kshfLogo" viewBox="0 0 200 200">'+
    '<rect    class="kshfLogo_C1 kshfLogo_B" x="37.2" y="49.1" width="128.5" height="39.7" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 222.0549 46.0355)" />'+
    '<polygon class="kshfLogo_C1 kshfLogo_B" points="42.5,100.6 71,72 163,164.4 134.5,193" />'+
    '<polygon class="kshfLogo_C1 " points="132.2,13 53.5,91.3 79.3,117 158,38.7" />'+
    '<rect    class="kshfLogo_C2 kshfLogo_B" x="55.1" y="6.4" width="38.3" height="188.8" />'+
    '</svg>'
};

// tipsy : Modified & simplified version for internal Keshif use
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

function Tipsy(element, options) {
  this.jq_element = element;
  this.options = options;
  if(this.options.className === undefined) this.options.className = null;
  if(this.options.gravity   === undefined) this.options.gravity   = 'n';
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
    this.tip();

    this.jq_tipsy_inner.html(title);
    this.jq_tip.attr("class","tipsy"); // reset classname in case of dynamic gravity
    this.jq_tip.styles({top: 0, left: 0, visibility: 'hidden', display: 'block'});
    kshf.browser.DOM.root.node().appendChild(this.jq_tip.node());

    if(this.options.className) {
      this.jq_tip.attr("class", "tipsy "+maybeCall(this.options.className, this.jq_element));
    }

    var pos = this.jq_element.getBoundingClientRect();

    var actualWidth  = this.jq_tip.node().offsetWidth,
        actualHeight = this.jq_tip.node().offsetHeight,
        gravity = maybeCall(this.options.gravity, this.jq_element);

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

    var browserPos = kshf.browser.DOM.root.node().getBoundingClientRect();
    tp.left = tp.left - browserPos.left;
    tp.top = tp.top - browserPos.top;

    this.jq_tip
      .style('left',tp.left+"px")
      .style('top', tp.top +"px")
      .attr("class", this.jq_tip.attr("class")+' tipsy-' + gravity);
    this.jq_tipsy_arrow.attr("class", 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0));

    this.jq_tip.styles({opacity: 0, visibility: 'visible'}).transition().duration(200).style('opacity',1);
  },
  hide: function(){
    kshf.activeTipsy = undefined;
    if(this.jq_tip) this.jq_tip.transition().duration(200).style('opacity',0).remove();
  },
  getTitle: function() {
    var title, o = this.options;
    if (typeof o.title == 'string') {
      title = o.title;
    } else if (typeof o.title == 'function') {
      title = o.title.call(this.jq_element);
    }
    return ('' + title).replace(/(^\s*|\s*$)/, "");
  },
  tip: function() {
    if(this.jq_tip) return this.jq_tip;
    this.jq_tip = d3.select(document.createElement("div")).attr("class","tipsy");
    this.jq_tipsy_arrow = this.jq_tip.append("div").attr("class","tipsy-arrow");
    this.jq_tipsy_inner = this.jq_tip.append("div").attr("class","tipsy-inner");
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

  // Rank order of the record
  this.recordRank = 0;

  // The data that's used for mapping this item, used as a cache.
  // This is accessed by filterID
  // Through this, you can also reach DOM of aggregates
      // DOM elements that this item is mapped to
      // - If this is a paper, it can be paper type. If this is author, it can be author affiliation.
  this._valueCache = []; // caching the values this item was mapped to

  // Aggregates which this record falls under
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
  /** Updates isWanted state, and notifies all related aggregates of the change */
  updateWanted: function(){
    if(!this._filterCacheIsDirty) return false;
    var me = this;

    var oldWanted = this.isWanted;
    this.isWanted = this._filterCache.every(function(f){ return f; });
    this._filterCacheIsDirty = false;

    if(this.measure_Self && this.isWanted !== oldWanted){ // There is some change that affects computation
      var valToAdd = (this.isWanted && !oldWanted) ? this.measure_Self /*add*/ : -this.measure_Self /*remove*/;
      var cntToAdd = this.isWanted ? 1 : -1; // more record : less record
      this._aggrCache.forEach(function(aggr){ 
        aggr._measure.Active += valToAdd;
        aggr.recCnt.Active   += cntToAdd;
      });
    }

    return this.isWanted !== oldWanted;
  },
  /** -- */
  setRecordDetails: function(value){
    this.showDetails = value;
    if(this.DOM.record) d3.select(this.DOM.record).classed('showDetails', this.showDetails);
  },
  /** Called on mouse-over on a primary item type */
  highlightRecord: function(){
    if(this.DOM.record) this.DOM.record.setAttribute("selection","onRecord");
    // summaries that this item appears in
    this._aggrCache.forEach(function(aggr){
      if(aggr.DOM.aggrGlyph) aggr.DOM.aggrGlyph.setAttribute("catselect","onRecord");
      if(aggr.DOM.matrixRow) aggr.DOM.matrixRow.setAttribute("catselect","onRecord");
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
  },
  initLinks: function(){
    this.DOM.links_To = [];
    this.DOM.links_From = [];
    this.links_To = [];
    this.links_From = [];
  }
};

/**
 * @constructor
 */
kshf.Aggregate = function(summary){
  // Which summary does this aggregate appear in?
  this.summary = summary;
  // Records which are mapped to this aggregate
  this.records = [];
  // To signal that this aggregate should not be shown, set this to false;
  this.usedAggr = true;
  // DOM
  this.DOM = { aggrGlyph: undefined };
  // Reset
  this.resetAggregateMeasures();
};
kshf.Aggregate.prototype = {
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
      d3.select(this.DOM.aggrGlyph).attr("catselect",null).classed("showlock",false);
    }
    if(this.DOM.matrixRow) {
      this.DOM.matrixRow.removeAttribute("selection");
      this.DOM.matrixRow.removeAttribute("catselect");
    }
  },

  /** -- */
  selectCompare: function(cT){
    d3.select(this.DOM.aggrGlyph).classed("locked",true);
    this.compared = cT;
    this.records.forEach(function(record){ record.setCompared(cT); });
  },
  /** -- */
  clearCompare: function(cT){
    d3.select(this.DOM.aggrGlyph).classed("locked",false).attr("compare",null);
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
};

/**
 * @constructor
 */
kshf.Aggregate_Category = function(summary, d, idIndex){
  kshf.Aggregate.call(this, summary);

  // What this aggregate represents
  this.data = d;

  // Categories can be indexed
  this.idIndex = idIndex;

  // Selection state
  //  1: selected for inclusion (AND)
  //  2: selected for inclusion (OR)
  // -1: selected for removal (NOT query)
  //  0: not selected
  this.selected = 0;
};
kshf.Aggregate_Category.prototype = Object.create(kshf.Aggregate.prototype);
kshf.Aggregate_Category.constructor = kshf.Aggregate_Category;
var Aggregate_Category_functions = {
  /** Returns unique ID of the aggregate. */
  id: function(){
    return this.data[this.idIndex];
  },

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
    this.selected = 0; this._refreshCatDOMSelected();
  },
  set_NOT: function(l){
    if(this.is_NOT()) return;
    this._insertToList(l);
    this.selected =-1; this._refreshCatDOMSelected();
  },
  set_AND: function(l){
    if(this.is_AND()) return;
    this._insertToList(l);
    this.selected = 1; this._refreshCatDOMSelected();
  },
  set_OR: function(l){
    if(this.is_OR()) return;
    this._insertToList(l);
    this.selected = 2; this._refreshCatDOMSelected();
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
  _refreshCatDOMSelected: function(){
    if(this.DOM.aggrGlyph) {
      if(this.selected===0) {
        this.DOM.aggrGlyph.removeAttribute("cFiltered"); return;
      }
      var v = "?";
      switch(this.selected){
        case 1: v="AND"; break;
        case 2: v="OR";  break;
        case -1:v="NOT"; break;
      }
      this.DOM.aggrGlyph.setAttribute("cFiltered",v);
    }
  },
}
for(var index in Aggregate_Category_functions){
  kshf.Aggregate_Category.prototype[index] = Aggregate_Category_functions[index];
}

/**
 * @constructor
 */
kshf.Aggregate_Interval = function(summary, minV, maxV){
  kshf.Aggregate.call(this, summary);
  this.minV = minV;
  this.maxV = maxV;
};
kshf.Aggregate_Interval.prototype = Object.create(kshf.Aggregate.prototype);
kshf.Aggregate_Interval.constructor = kshf.Aggregate_Interval;

/**
 * @constructor
 */
kshf.Aggregate_Set = function(summary, set_1, set_2){
  kshf.Aggregate.call(this, summary);
  this.set_1 = set_1;
  this.set_2 = set_2;
};
kshf.Aggregate_Set.prototype = Object.create(kshf.Aggregate.prototype);
kshf.Aggregate_Set.constructor = kshf.Aggregate_Set;

/**
 * @constructor
 */
kshf.Aggregate_EmptyRecords = function(summary){
  kshf.Aggregate_Category.call(this, summary, {id:null}, 'id');
  this.isVisible = true;
  this.emptyRecordsAggregate = true;
};
kshf.Aggregate_EmptyRecords.prototype = Object.create(kshf.Aggregate_Category.prototype);

/**
 * @constructor
 */
kshf.BreadCrumb = function(browser, selectType, _filter){
  this.browser = browser;
  this.DOM = null;
  this.selectType = selectType;
  this.filter = _filter;
};
kshf.BreadCrumb.prototype = {
  isCompareSelection: function(){
    return this.selectType.substr(0,7)==="Compare";
  },
  /** -- */
  showCrumb: function(summary){
    var _pre = this.browser.getHeight_PanelBasic();
    var _pre_ = parseInt(this.browser.DOM.panelsTop.style('margin-top'));
    if(this.DOM===null) {
      this._insertDOM_crumb();
    }
    var details;
    if(this.selectType==="Filter"){
      this.DOM.select(".crumbHeader").html(this.filter.getTitle());
      details = this.filter.filterView_Detail();
    } else {
      this.DOM.select(".crumbHeader").html(summary.summaryName);
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
    if(details) this.DOM.select(".crumbDetails").html(details.replace(/<br>/gi," "));

    if(this.selectType==="Highlight"){
      var _post = this.browser.getHeight_PanelBasic();
      this.browser.DOM.panelsTop.style('margin-top',(_pre_+_pre-_post)+"px");
    } else {
      this.browser.DOM.panelsTop.style('margin-top',"0px");
    }
  },
  /** -- */
  removeCrumb: function(noAnim){
    if(this.DOM === null) return;
    var me=this;
    if(noAnim){
      this.DOM.remove();
    } else {
      var _pre = this.browser.getHeight_PanelBasic();
      var _pre_ = parseInt(me.browser.DOM.panelsTop.style('margin-top'));
      this.DOM.style("opacity",0)
        .transition().delay(300).remove()
        .on("end",function(){ 
          var _post = me.browser.getHeight_PanelBasic();
          var v = _pre_+_pre-_post;
          if(me.selectType!=="Highlight") v=0;
          me.browser.DOM.panelsTop.style('margin-top',v+"px");
        });
    }
    this.DOM = null;
  },
  /** -- */
  _insertDOM_crumb: function(){
    var me=this;

    this.DOM = this.browser.DOM.breadcrumbs.append("span")
      .attr("class","breadCrumb crumbMode_"+this.selectType)
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
              default:          return kshf.lang.cur.Unlock; // Compare_A, Compare_B, Compare_C
            }
          }
        });
      })
      .on("mouseenter",function(){
        this.tipsy.show();
        if(me.isCompareSelection()) me.browser.refreshMeasureLabels(me.selectType);
      })
      .on("mouseleave",function(){
        this.tipsy.hide();
        if(me.isCompareSelection()) me.browser.refreshMeasureLabels("Active");
      })
      .on("click",function(){
        this.tipsy.hide();
        if(me.selectType==="Filter") {
          me.filter.clearFilter();
        } else if(me.selectType==="Highlight") {
          me.browser.clearSelect_Highlight(true);
        } else {
          me.browser.clearSelect_Compare(me.selectType.substr(8));
          me.browser.refreshMeasureLabels("Active");
        }
      });

    this.DOM.append("span").attr("class","breadCrumbIcon fa");
    var y = this.DOM.append("span").attr("class","crumbText");
    y.append("span").attr("class","crumbHeader");
    y.append("span").attr("class","crumbDetails");

    this.DOM.style("opacity",0).style("display","inline-block").transition().style("opacity",1);

    // Push the save button to the end of list
    var dom = this.browser.DOM.saveSelection.node();
    dom.parentNode.appendChild(dom);
  },
};

/**
 * @constructor
 */
kshf.Filter = function(_browser){
  this.browser = _browser;

  this.filterID = this.browser.filterCount++;

  this.isFiltered = false;
  this.how = "All";

  this.browser.records.forEach(function(record){ record.setFilterCache(this.filterID,true); },this);

  this.filterCrumb = new kshf.BreadCrumb(this.browser,"Filter", this);
};
kshf.Filter.prototype = {
  addFilter: function(){
    this.isFiltered = true;

    this.browser.clearSelect_Highlight(true);

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

    this.filterCrumb.showCrumb();

    this.browser.update_Records_Wanted_Count();
    this.browser.refresh_filterClearAll();
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
  /** -- */
  getRichText: function(){
    return "<b>"+this.getTitle()+"</b>: "+this.filterView_Detail()+" ";
  }
};

/**
 * @constructor
 */
kshf.Filter_Categorical = function(_browser,_summary){
  kshf.Filter.call(this,_browser);
  this.summary = _summary;
  this.selected_AND = [];
  this.selected_OR = [];
  this.selected_NOT = [];
};
kshf.Filter_Categorical.prototype = Object.create(kshf.Filter.prototype);
kshf.Filter_Categorical.constructor = kshf.Filter_Categorical;
var Filter_Categorical_functions = {
  getTitle: function(){
    return this.summary.summaryName;
  },
  selectedCount_Total: function(){
    return this.selected_AND.length + this.selected_OR.length + this.selected_NOT.length;
  },
  selected_Any: function(){
    return this.selected_AND.length>0 || this.selected_OR.length>0 || this.selected_NOT.length>0;
  },
  selected_All_clear: function(){
    kshf.Util.clearArray(this.selected_AND);
    kshf.Util.clearArray(this.selected_OR);
    kshf.Util.clearArray(this.selected_NOT);
  },
  onClear: function(){
    var me=this.summary;
    me.missingValueAggr.filtered = false;
    me.clearCatTextSearch();
    me.unselectAllCategories();
    me._update_Selected();
  },
  onFilter: function(){
    var me=this.summary;
    // at least one category is selected in some modality (and/ or/ not)
    me._update_Selected();

    var nullOut = me.missingValueAggr.filtered==="out";
    var nullIn = me.missingValueAggr.filtered==="in";

    me.records.forEach(function(record){
      var recordVal_s = record._valueCache[me.summaryID];
      if(nullIn){
        record.setFilterCache(this.filterID, recordVal_s===null);
        return;
      }
      if(recordVal_s===null){
        if(nullOut){
          record.setFilterCache(this.filterID, false);
          return;
        }
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
      if(this.selected_OR.length>0){
        record.setFilterCache(this.filterID, recordVal_s.some(function(v){return (getAggr(v).is_OR());}) );
        return;
      }
      // only NOT selection
      record.setFilterCache(this.filterID,true);
    }, this);
  },
  filterView_Detail: function(){
    var me=this.summary;
    if(me.missingValueAggr.filtered==="in") return kshf.lang.cur.NoData;
    // 'this' is the Filter
    // go over all records and prepare the list
    var selectedItemsText="";

    if(me.missingValueAggr.filtered==="out") selectedItemsText = kshf.lang.cur.ValidData;

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
};
for(var index in Filter_Categorical_functions){
  kshf.Filter_Categorical.prototype[index] = Filter_Categorical_functions[index];
}

/**
 * @constructor
 */
kshf.Filter_Interval = function(_browser,_summary){
  kshf.Filter.call(this,_browser);
  this.summary = _summary;
};
kshf.Filter_Interval.prototype = Object.create(kshf.Filter.prototype);
kshf.Filter_Interval.constructor = kshf.Filter_Interval;
var Filter_Interval_functions = {
  getTitle: function(){
    return this.summary.summaryName;
  },
  onClear: function(){
    var me=this.summary;
    me.missingValueAggr.filtered = false;
    if(this.filteredBin){
      this.filteredBin = undefined;
    }
    if(me.DOM.root) me.DOM.root.attr("filtered",null);
    if(me.zoomed) me.setZoomed(false);
    me.resetFilterRangeToTotal();
    me.refreshIntervalSlider();
    if(me.DOM.missingValueAggr) me.DOM.missingValueAggr.classed("filtered",false);
    if(me.encodesRecordsBy==='scatter' || me.encodesRecordsBy==='sort'){
      me.browser.recordDisplay.refreshQueryBox_Filter();
    }
  },
  onFilter: function(){
    var me=this.summary;
    if(me.DOM.root) me.DOM.root.attr("filtered",true);
    var valueID = me.summaryID;
    if(me.missingValueAggr.filtered==="in"){
      me.records.forEach(function(record){
        record.setFilterCache(this.filterID, record._valueCache[valueID]===null);
      },this);
      return;
    }
    if(me.missingValueAggr.filtered==="out"){
      me.records.forEach(function(record){
        record.setFilterCache(this.filterID, record._valueCache[valueID]!==null);
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

    if(me.DOM.zoomControl) me.DOM.zoomControl.attr("sign", sign);

    me.refreshIntervalSlider();

    if(me.encodesRecordsBy==='scatter' || me.encodesRecordsBy==='sort'){
      me.browser.recordDisplay.refreshQueryBox_Filter();
    }
  },
  filterView_Detail: function(){
    var me=this.summary;
    if(me.missingValueAggr.filtered==="in") return kshf.lang.cur.NoData;
    if(me.missingValueAggr.filtered==="out") return kshf.lang.cur.ValidData;
    return me.printAggrSelection();
  },
};
for(var index in Filter_Interval_functions){
  kshf.Filter_Interval.prototype[index] = Filter_Interval_functions[index];
}

/**
 * @constructor
 */
kshf.Filter_Text = function(_browser, _recordDisplay){
  kshf.Filter.call(this,_browser);
  this.multiMode = 'and';
  this.recordDisplay = _recordDisplay;
  this.queryString = null; // This is the text query string, populated by user input
};
kshf.Filter_Text.prototype = Object.create(kshf.Filter.prototype);
kshf.Filter_Text.constructor = kshf.Filter_Text;
var Filter_Text_functions = {
  getTitle: function(){
    return this.recordDisplay.textSearchSummary.summaryName;
  },
  onClear: function(){
    this.recordDisplay.DOM.recordTextSearch.select(".clearSearchText").style('display','none');
    this.recordDisplay.DOM.recordTextSearch.selectAll(".textSearchMode").style("display","none"); 
    this.recordDisplay.DOM.recordTextSearch.select("input").node().value = "";
  },
  filterView_Detail: function(){
    return "*"+this.queryString+"*";
  },
  setQueryString: function(v){
    this.queryString = v.toLowerCase();
    // convert string to query pieces
    this.filterQuery = [];
    if(this.queryString!=="") {
      // split the input by " character
      this.queryString.split('"').forEach(function(block,i){
        if(i%2===0) {
          block.split(/\s+/).forEach(function(q){ this.filterQuery.push(q)},this);
        } else {
          this.filterQuery.push(block);
        }
      },this);
      // Remove the empty strings
      this.filterQuery = this.filterQuery.filter(function(v){ return v!==""});
    }
  },
  onFilter: function(){
    this.recordDisplay.DOM.recordTextSearch
      .select(".clearSearchText").style('display','inline-block');
    this.recordDisplay.DOM.recordTextSearch
      .selectAll(".textSearchMode").style("display",this.filterQuery.length>1?"inline-block":"none"); 

    // go over all the records in the list, search each keyword separately
    // If some search matches, return true (any function)
    var summaryID = this.recordDisplay.textSearchSummary.summaryID;
    this.browser.records.forEach(function(record){
      var v = record._valueCache[summaryID];
      var f = false;
      if(v) {
        v = (""+v).toLowerCase();
        if(this.multiMode==='or') {
          f = !this.filterQuery.every(function(v_i){ return v.indexOf(v_i)===-1; });
        } else if(this.multiMode==='and') {
          f =  this.filterQuery.every(function(v_i){ return v.indexOf(v_i)!==-1; });
        }
      }
      record.setFilterCache(this.filterID,f);
    },this);
  }
};
for(var index in Filter_Text_functions){
  kshf.Filter_Text.prototype[index] = Filter_Text_functions[index];
}

/**
 * @constructor
 */
kshf.Filter_Spatial = function(_browser, _recordDisplay){
  kshf.Filter.call(this,_browser);
  this.recordDisplay = _recordDisplay;
};
kshf.Filter_Spatial.prototype = Object.create(kshf.Filter.prototype);
kshf.Filter_Spatial.constructor = kshf.Filter_Spatial;
var Filter_Spatial_functions = {
  getTitle: function(){
    return "Spatial";
  },
  onClear: function(){
    this.recordDisplay.DOM.root.select(".spatialQueryBox_Filter").attr("active",null);
  },
  filterView_Detail: function(){
    return "<i class='fa fa-square-o'></i> (Area)";
  },
  onFilter: function(){
    this.recordDisplay.DOM.root.select(".spatialQueryBox_Filter").attr("active",true);
    this.browser.records.forEach(function(record){
      if(record._geoBound_ === undefined) {
        record.setFilterCache(this.filterID, false);
        return;
      }
      record.setFilterCache(this.filterID, kshf.intersects(record._geoBound_, this.bounds));
    },this);
  }
};
for(var index in Filter_Spatial_functions){
  kshf.Filter_Spatial.prototype[index] = Filter_Spatial_functions[index];
}


/** -- */
kshf.RecordDisplay = function(browser, config){
  var me = this;
  this.browser = browser;
  this.DOM = {};

  this.config = config;

  this.sortColWidth = this.config.sortColWidth || 50; // default is 50 px

  // this is the default behavior. No demo un-set's this. Keeping for future reference.
  this.autoExpandMore = true;
  this.collapsed = false;

  this.maxVisibleItems_Default = config.maxVisibleItems_Default || kshf.maxVisibleItems_Default;
  this.maxVisibleItems = this.maxVisibleItems_Default; // This is the dynamic property

  this.showRank = config.showRank || false;
  this.visMouseMode = "pan";

  this.viewRecAs = 'list'; // Default. Options: 'grid', 'list', 'map', 'nodelink'

  this.linkBy = config.linkBy || [];
  if(!Array.isArray(this.linkBy)) this.linkBy = [this.linkBy];

  // implicitly set record view
  if(config.geo) this.viewRecAs = 'map';
  if(config.linkBy) this.viewRecAs = 'nodelink';
  // explicit setting by API
  if(config.displayType) this.viewRecAs = config.displayType;

  this.detailsToggle = config.detailsToggle || 'zoom'; // 'one', 'zoom', 'off' (any other string counts as off)

  this.textSearchSummary = null;
  this.recordViewSummary = null;

  this.sortAttrib    = null;
  this.scatterAttrib = null;
  this.colorAttrib   = null;

  if(config.scatterBy) this.setScatterAttrib(browser.summaries_by_name[config.scatterBy]);

  /***********
   * SORTING OPTIONS
   *************************************************************************/
  this.sortingOpts = config.sortBy || [ {name: this.browser.records[0].idIndex} ]; // Sort by id by default
  if(!Array.isArray(this.sortingOpts)) this.sortingOpts = [this.sortingOpts];

  this.prepSortingOpts();
  var firstSortOpt = this.sortingOpts[0];
  // Add all interval summaries as sorting options
  this.browser.summaries.forEach(function(summary){
    if(! (summary instanceof kshf.Summary_Interval) ) return;
    if(summary.panel===undefined) return; // Needs to be within view
    this.addSortingOption(summary);
  },this);
  this.prepSortingOpts();
  this.alphabetizeSortingOptions();

  if(this.sortingOpts.length>0){
    this.setSortAttrib(firstSortOpt || this.sortingOpts[0]);
  }

  this.DOM.root = this.browser.DOM.root.select(".recordDisplay")
    .attrs({
      detailsToggle : this.detailsToggle,
      showRank      : this.showRank,
      visMouseMode  : this.visMouseMode,
    });

  this.DOM.root.append("div").attr("class","dropZone dropZone_recordView")
    .on("mouseenter",function(){ this.setAttribute("readyToDrop",true);  })
    .on("mouseleave",function(){ this.setAttribute("readyToDrop",false); })
    .on("mouseup",function(event){
      var movedSummary = me.browser.movedSummary;
      if(movedSummary===null || movedSummary===undefined) return;

      movedSummary.refreshThumbDisplay();
      me.setRecordViewSummary(movedSummary);

      if(me.textSearchSummary===null) me.setTextSearchSummary(movedSummary);

      me.browser.updateLayout();
    })
    .append("div").attr("class","dropIcon fa fa-list-ul");
  
  this.initDOM_RecordDisplayHeader();

  this.DOM.recordDisplayWrapper = this.DOM.root.append("div").attr("class","recordDisplayWrapper");

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
        this.browser.summaries_by_name[config.recordView]
        :
        this.browser.createSummary('_Records',config.recordView,'categorical')
    );
  }

  if(config.recordView_Brief!==undefined){
    if(typeof(config.recordView_Brief)==="string"){
      if(config.recordView_Brief.substr(0,8)==="function"){
        eval("\"use strict\"; config.recordView_Brief = "+config.recordView_Brief);
      }
    }
    this.setRecordViewBriefSummary(
      (typeof config.recordView_Brief === 'string') ?
        this.browser.summaries_by_name[config.recordView_Brief]
        :
        this.browser.createSummary('_Records_Brief',config.recordView_Brief,'categorical')
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
      if(this.viewRecAs==='map'){
        setTimeout(function(){ me.leafletRecordMap.invalidateSize(); }, 1000);
      }
      if(this.viewRecAs==='scatter'){
        this.refreshScatterVis(true);
      }
    },
    /** -- */
    setWidth: function(v){
      if(this.recordViewSummary===null) return;
      var me=this;
      this.curWidth = v;
      if(this.viewRecAs==='map'){
        setTimeout(function(){ me.leafletRecordMap.invalidateSize(); }, 1000);
      }
      if(this.viewRecAs==='scatter'){
        this.refreshScatterVis(true);
      }
    },
    /** Encode by color or by sorting */
    getRecordEncoding: function(){
      if(this.viewRecAs==='map' || this.viewRecAs==='nodelink') return "color";
      if(this.viewRecAs==='scatter') return "scatter";
      return "sort";
    },
    /** -- */
    recMap_refreshColorScaleBins: function(){
      var invertColorScale = false;
      if(this.sortAttrib) invertColorScale = this.sortAttrib.invertColorScale;
      var mapColorTheme = kshf.colorScale[this.browser.mapColorTheme];
      this.DOM.recordColorScaleBins
        .style("background-color", function(d){
          return mapColorTheme[ invertColorScale ? (8-d) : d];
        });
    },
    /** --  */
    recMap_projectRecords: function(){
      var me = this;
      this.DOM.kshfRecords.attr("d", function(record){ return me.recordGeoPath(record._geoFeat_); });
    },
    /** -- */
    recMap_zoomToActive: function(){
      // Insert the bounds for each record path
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
      } else {
        this.leafletRecordMap.flyToBounds( bounds, kshf.map.flyConfig );
      }
    },
    /** -- */
    initDOM_RecordDisplayHeader: function(){
      var me=this;

      this.DOM.recordDisplayHeader = this.DOM.root.append("div").attr("class","recordDisplayHeader");

      this.DOM.recordColorScaleBins =  this.DOM.recordDisplayHeader.append("div").attr("class","recordColorScale")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'w', title: "Change color scale"}); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout" ,function(){ this.tipsy.hide(); })
        .on("click"    ,function(){
          me.browser.mapColorTheme = (me.browser.mapColorTheme==="converge") ? "diverge" : "converge";
          me.refreshRecordColors();
          me.recMap_refreshColorScaleBins();
          me.sortAttrib.map_refreshColorScale();
        })
        .selectAll(".recordColorScaleBin").data([0,1,2,3,4,5,6,7,8])
          .enter().append("div").attr("class","recordColorScaleBin");
      
      this.recMap_refreshColorScaleBins();

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

      // Change record display view
      var x= this.DOM.recordDisplayHeader.append("span").attr("class","recordDisplay_ViewGroup");
      x.append("span").text("View ").attr("class","recordView_HeaderSet");
      x = x.append("span").attr("class","pofffffff");
      x.selectAll("span.fa").data([
        {v:'List', i:"list-ul"},
        {v:'Map', i:"globe"},
        {v:'NodeLink', i:"share-alt"}]
      ).enter()
        .append("span").attr("class", function(d){ return "recordDisplay_ViewAs"+d.v; })
        .each(function(d){ this.tipsy = new Tipsy(this, {gravity: 'n', title: function(){ return d.v; } }); })
        .on("mouseenter", function( ){ this.tipsy.show(); })
        .on("mouseleave", function( ){ this.tipsy.hide(); })
        .on("click",      function(d){ this.tipsy.hide(); me.viewAs(d.v); })
        .append("span").attr("class", function(d){ return " fa fa-"+d.i; });
      x.append("span").attr("class","recordDisplay_ViewAsScatter")
        .each(function(d){ this.tipsy = new Tipsy(this, {gravity: 'n', title: "Scatter"});  })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.viewAs('scatter'); })
        .html('<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">'+
          '<path d="M 0 0 L 0 23 L 0 24 L 1 24 L 24 24 L 24 22 L 2 22 L 2 0 L 0 0 z"></path>'+
            '<circle cx="10" cy="10" r="3"/><circle cx="18" cy="15" r="3"/><circle cx="19" cy="7" r="3"/>'+
            '<circle cx="8" cy="17" r="3"/>'+
          '</svg>')


      this.DOM.recordDisplayName = this.DOM.recordDisplayHeader.append("div")
        .attr("class","recordDisplayName")
        .html(this.browser.recordName);

      // Collapse record display button
      this.DOM.recordDisplayHeader.append("div")
        .attr("class","buttonRecordViewCollapse fa fa-compress")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'e', title: "Collapse" }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.collapseRecordViewSummary(true); });
      // Expand record display button
      this.DOM.recordDisplayHeader.append("div")
        .attr("class","buttonRecordViewExpand fa fa-expand")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'e', title: "Open" }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.collapseRecordViewSummary(false); });
      // Remove record display button
      this.DOM.buttonRecordViewRemove = this.DOM.recordDisplayHeader.append("div")
        .attr("class","buttonRecordViewRemove fa fa-times-circle-o")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'ne', title: kshf.lang.cur.RemoveRecords }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.removeRecordViewSummary(); });

      this.DOM.scrollToTop = this.DOM.recordDisplayHeader.append("div").attr("class","scrollToTop fa fa-arrow-up")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'e', title: kshf.lang.cur.ScrollToTop }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); kshf.Util.scrollToPos_do(me.DOM.recordGroup,0); });
    },
    /** -- */
    initDOM_SortSelect: function(){
      var me=this;

      this.DOM.recordSortOptions = this.DOM.recordDisplayHeader.append("div").attr("class","recordSortOptions");

      this.DOM.recordSortSelectbox = this.DOM.recordSortOptions.append("select")
        .attr("class","recordSortSelectbox")
        .on("change", function(){ me.setSortAttrib(this.selectedOptions[0].__data__); });

      this.refreshSortingOptions();

      this.DOM.recordDisplayHeader.append("span")
        .attr("class","recordReverseSortButton sortButton fa")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'w', title: kshf.lang.cur.ReverseOrder }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",function(){
          this.tipsy.hide();
          me.sortAttrib.inverse = me.sortAttrib.inverse?false:true;
          this.setAttribute("inverse",me.sortAttrib.inverse);
          // TODO: Do not show no-value items on top, reversing needs to be a little smarter.
          me.browser.records.reverse();

          me.updateRecordRanks();
          me.refreshRecordDOM();
          me.refreshRecordRanks(me.DOM.recordRanks);

          me.refreshRecordDOMOrder();
        });
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

      var processKeyEvent = function(dom){
        me.textFilter.setQueryString(dom.value);
        
        if(event.key=== 'Enter'){ // Enter pressed
          dom.tipsy.hide();
          if(d3.event.shiftKey) {
            // Compare selection
            if(me.textFilter.queryString!=="") {
              me.browser.setSelect_Compare();
            } else {
              me.textFilter.clearFilter();
            }
          } else {
            // Filter selection
            if(me.textFilter.queryString!=="") {
              me.textFilter.addFilter();
            } else {
              me.textFilter.clearFilter();
            }
          }
          return;
        }

        // Highlight selection
        if(dom.timer) clearTimeout(dom.timer);
        dom.timer = setTimeout( function(){
          if(me.textFilter.filterQuery.length==0){
            dom.tipsy.hide();
            me.browser.clearSelect_Highlight();
            return;
          }
          dom.tipsy.show();
          // Highlight selection
          var summaryID = me.textSearchSummary.summaryID;
          var records = [];
          me.browser.records.forEach(function(record){
            var v = record._valueCache[summaryID];
            var f = false;
            if(v){
              v = (""+v).toLowerCase();
              if(me.textFilter.multiMode==='or'){
                f = !me.textFilter.filterQuery.every(function(v_i){ return v.indexOf(v_i)===-1; });
              } else if(me.textFilter.multiMode==='and'){
                f =  me.textFilter.filterQuery.every(function(v_i){ return v.indexOf(v_i)!==-1; });
              }
              if(f) records.push(record);
            }
          });
          me.browser.clearSelect_Highlight();
          me.browser.flexAggr_Highlight.records = records;
          me.browser.flexAggr_Highlight.summary = me.textSearchSummary;
          me.browser.flexAggr_Highlight.data = {id: "*"+me.textFilter.queryString+"*"};
          me.browser.setSelect_Highlight();
          dom.timer = null;
        }, 250);
      };

      this.DOM.recordTextSearch.append("i").attr("class","fa fa-search searchIcon");
      this.DOM.recordTextSearch.append("input").attr("type","text").attr("class","textSearchInput")
        .each(function(){ 
          this.tipsy = new Tipsy(this, {gravity: 'n', 
            title: '<b><u>Enter</u></b> to filter <i class="fa fa-filter"></i><br><br>'+
            '<b><u>Shift+Enter</u></b> to lock <i class="fa fa-lock"></i>' }); 
        })
        .on("blur",function(){ this.tipsy.hide(); })
        .on("keydown",function() { d3.event.stopPropagation(); })
        .on("keypress",function(){ d3.event.stopPropagation(); })
        .on("keyup",function(){
          processKeyEvent(this);
          d3.event.stopPropagation();
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
    setDrawSelect: function(v){
      this.drawSelect = v;
      this.DOM.recordDisplayWrapper.attr("drawSelect",this.drawSelect);
    },
    /** -- */
    initDOM_MapView: function(){
      var me = this;
      if(this.DOM.recordBase_Map) {
        this.DOM.recordGroup = this.DOM.recordMap_SVG.select(".recordGroup");
        this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord");
        return; // Do not initialize twice
      }

      this.DOM.recordBase_Map = this.DOM.recordDisplayWrapper.append("div").attr("class","recordBase_Map");

      // init _geo_ property
      var _geo_ = this.config.geo;
      if(typeof _geo_ === "string"){
        if(_geo_.substr(0,8)==="function"){
          eval("\"use strict\"; _geo_ = "+_geo_);
        } else {
          var x=_geo_;
          _geo_ = function(){ return this[x]; }
        }
      }
      // Compute _geoFeat_ of each record
      this.browser.records.forEach(function(record){
        var feature = _geo_.call(record.data);
        if(feature) record._geoFeat_ = feature;
      });
      // Compute _geoBound_ of each record
      this.browser.records.forEach(function(record){
        if(record._geoFeat_) record._geoBound_ = d3.geoBounds(record._geoFeat_);
      });

      this.spatialFilter = this.browser.createFilter('spatial',this);

      function updateRectangle(bounds){
        var north_west = me.leafletRecordMap.latLngToLayerPoint(bounds.getNorthWest());
        var south_east = me.leafletRecordMap.latLngToLayerPoint(bounds.getSouthEast());
        this.style.left = (north_west.x)+"px";
        this.style.top = (north_west.y)+"px";
        this.style.height = Math.abs(south_east.y-north_west.y)+"px";
        this.style.width  = Math.abs(south_east.x-north_west.x)+"px";
      };

      this.leafletRecordMap = L.map(this.DOM.recordBase_Map.node(), kshf.map.config )
        .addLayer( new L.TileLayer( kshf.map.tileTemplate, kshf.map.tileConfig) )
        .setView(L.latLng(0,0),0)
        .on("viewreset",function(){ 
          me.recMap_projectRecords();
        })
        .on("movestart",function(){
          me.DOM.recordDisplayWrapper.attr("dragging",true);
          me.browser.DOM.root.attr("pointerEvents",false);
          this._zoomInit_ = this.getZoom();
        })
        .on("moveend",function(){
          me.DOM.recordDisplayWrapper.attr("dragging",null);
          me.browser.DOM.root.attr("pointerEvents",true);
          me.refreshViz_Compare_All();
          me.refreshQueryBox_Filter();
          me.DOM.recordDisplayWrapper.select(".spatialQueryBox_Highlight")
            .each(function(d){
              var bounds = me.browser.flexAggr_Highlight.bounds;
              if(bounds) updateRectangle.call(this,bounds);
            });
          me.DOM.recordDisplayWrapper.selectAll("[class*='spatialQueryBox_Comp']")
            .each(function(d){
              var bounds = me.browser['flexAggr_'+d].bounds;
              if(bounds) updateRectangle.call(this,bounds);
            });
          if(this.getZoom()!==this._zoomInit_) me.recMap_projectRecords();
        });

      this.recordGeoPath = d3.geoPath().projection( 
        d3.geoTransform({
          // Use Leaflet to implement a D3 geometric transformation.
          point: function(x, y) {
            if(x>kshf.map.wrapLongitude) x-=360;
            var point = me.leafletRecordMap.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
          }
        }) 
      );

      this.insertQueryBoxes(this.DOM.recordBase_Map.select(".leaflet-overlay-pane"),
        function(t){
          if(d3.event.which !== 1) return; // only respond to left-click
          me.setDrawSelect("Drag");
          me.DOM.recordDisplayWrapper.attr("dragging",true);
          var bounds;
          d3.select("body").on("mousemove", function(e){
            var curPos = d3.mouse(me.DOM.recordBase_Map.select(".leaflet-tile-pane").node());
            //var curLatLong = me.leafletRecordMap.layerPointToLatLng(L.point(curPos[0], curPos[1]));
            var north_west = me.leafletRecordMap.latLngToLayerPoint(me.spatialFilter.bounds.getNorthWest());
            var south_east = me.leafletRecordMap.latLngToLayerPoint(me.spatialFilter.bounds.getSouthEast());
            if(t==='l'){
              north_west.x = curPos[0];
            }
            if(t==='r'){
              south_east.x = curPos[0];
            }
            if(t==='t'){
              north_west.y = curPos[1];
            }
            if(t==='b'){
              south_east.y = curPos[1];
            }
            bounds = L.latLngBounds([
              me.leafletRecordMap.layerPointToLatLng(L.point(north_west.x, north_west.y)),
              me.leafletRecordMap.layerPointToLatLng(L.point(south_east.x, south_east.y))
            ]);
            me.refreshQueryBox_Filter(bounds);
          }).on("mouseup", function(){
            me.spatialFilter.bounds = bounds;
            me.spatialFilter.addFilter();
            me.setDrawSelect(null);
            me.DOM.recordDisplayWrapper.attr("dragging",null);
            d3.select("body").on("mousemove",null).on("mouseup",null);
          });
          d3.event.preventDefault();
          d3.event.stopPropagation();
        },
        function(t){
          if(d3.event.which !== 1) return; // only respond to left-click
          me.setDrawSelect("Drag");
          me.DOM.recordDisplayWrapper.attr("dragging",true);
          var initPos = d3.mouse(me.DOM.recordBase_Map.select(".leaflet-tile-pane").node());
          var north_west = me.leafletRecordMap.latLngToLayerPoint(me.spatialFilter.bounds.getNorthWest());
          var south_east = me.leafletRecordMap.latLngToLayerPoint(me.spatialFilter.bounds.getSouthEast());
          d3.select("body").on("mousemove", function(e){
            var curPos = d3.mouse(me.DOM.recordBase_Map.select(".leaflet-tile-pane").node());
            var difPos = [ initPos[0]-curPos[0], initPos[1]-curPos[1] ];
            // TODO: Move the bounds, do not draw a new one
            var bounds = L.latLngBounds([
              me.leafletRecordMap.layerPointToLatLng(
                L.point(north_west.x-difPos[0], north_west.y-difPos[1])),
              me.leafletRecordMap.layerPointToLatLng(
                L.point(south_east.x-difPos[0], south_east.y-difPos[1]))
            ]);
            me.spatialFilter.bounds = bounds;
            me.refreshQueryBox_Filter(bounds);
          }).on("mouseup", function(){
            me.spatialFilter.addFilter();
            me.setDrawSelect(null);
            me.DOM.recordDisplayWrapper.attr("dragging",null);
            d3.select("body").on("mousemove",null).on("mouseup",null);
          });
          d3.event.preventDefault();
          d3.event.stopPropagation();
        },
        function(d){
          if(d==="Filter"){
            me.spatialFilter.clearFilter();
          } else if(d!=="Highlight"){
            me.browser.clearSelect_Compare(d.substr(8));
          }
          this.tipsy.hide();
        }
      );

      this.drawSelect = null;
      this.DOM.recordBase_Map.select(".leaflet-tile-pane")
        .on("mousedown",function(){
          if(me.visMouseMode!=="draw") return;
          if(me.drawSelect==="Highlight") return;
          me.DOM.recordDisplayWrapper.attr("dragging",true);
          me.setDrawSelect("Filter");
          me.drawingStartPoint = me.leafletRecordMap
            .layerPointToLatLng(L.point(d3.mouse(this)[0], d3.mouse(this)[1]));
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("mouseup",function(){
          if(me.drawSelect==="Drag") return;
          if(me.visMouseMode!=="draw") return;
          me.DOM.recordDisplayWrapper.attr("dragging",null);
          if(me.drawSelect==="Filter"){
            me.spatialFilter.addFilter();
          } else if(me.drawSelect==="Highlight"){
            var bounds = me.browser.flexAggr_Highlight.bounds;
            var cT = me.browser.setSelect_Compare(false,true);
            me.browser['flexAggr_Compare_'+cT].bounds = bounds;
            me.DOM.recordDisplayWrapper.select(".spatialQueryBox_Compare_"+cT)
              .attr("active",true)
              .each(function(){ updateRectangle.call(this,bounds); });
          }
          me.setDrawSelect(null);
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("mousemove",function(){
          if(me.visMouseMode!=="draw") return;
          if(me.drawSelect==="Drag") return;
          if(me.drawSelect!=="Filter" && !d3.event.shiftKey){
            me.DOM.recordDisplayWrapper.attr("dragging",null);
            me.setDrawSelect(null);
            me.browser.clearSelect_Highlight();
            return;
          }
          me.DOM.recordDisplayWrapper.attr("dragging",true);
          var mousePos = d3.mouse(this);
          var curLatLong = me.leafletRecordMap.layerPointToLatLng(L.point(mousePos[0], mousePos[1]));
          if(d3.event.shiftKey && !me.drawSelect){
            me.setDrawSelect("Highlight");
            me.drawingStartPoint = curLatLong;
          }
          if(!me.drawSelect) return;

          var bounds = L.latLngBounds([me.drawingStartPoint,curLatLong]);
          if(me.drawSelect==="Highlight"){
            me.DOM.recordDisplayWrapper.select(".spatialQueryBox_Highlight")
              .each(function(d){ updateRectangle.call(this,bounds); });

            if(this.tempTimer) clearTimeout(this.tempTimer);
            this.tempTimer = setTimeout(function(){
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
              me.browser.flexAggr_Highlight.bounds = bounds;
              me.browser.setSelect_Highlight();
            }, 150);
          } else {
            me.spatialFilter.bounds = bounds;
            me.refreshQueryBox_Filter(bounds);
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
          .attrs({
            id: 'diagonalHatch',
            patternUnits: 'userSpaceOnUse',
            width: 4,
            height: 4,
          })
          .append('path').attrs({
            d: 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2',
            stroke: 'gray',
            'stroke-width': 1
          });

      this.DOM.recordGroup = this.DOM.recordMap_SVG.append("g").attr("class", "leaflet-zoom-hide recordGroup");

      this.initDOM_CustomControls();
    },
    /** -- */
    initDOM_CustomControls: function(){
      var me = this;
      if(this.DOM.visViewControl) return;

      var X = this.DOM.recordDisplayWrapper.append("span").attr("class","visViewControl");
      this.DOM.visViewControl = X;

      // **************************************************
      // SCATTER OPTIONS
      var s = X.append("span").attr("class","ScatterControl-ScatterAttrib visViewControlButton");
      s.append("span").text("→ Vs: ");
      s.append("select").on("change",function(){ me.setScatterAttrib(this.selectedOptions[0].__data__); });;
      this.refreshScatterOptions();

      // ***************************************************
      // LINK OPTIONS
      var s = X.append("span").attr("class","LinkControl-LinkAttrib visViewControlButton").append("select")
        .on("change",function(){
          // TODO
        });;
      s.selectAll("option").data(this.linkBy).enter().append("option").text(function(d){ return d; });

      // **************************************************
      // FORCE LAYOUT OPTIONS
      X.append("span").attr("class","NodeLinkControl-LinkIcon visViewControlButton fa fa-share-alt")
        .each(function(){ 
          this.tipsy = new Tipsy(this, { gravity: 's',  
            title: function(){
              return (me.DOM.root.classed("hideLinks")?"Show":"Hide")+" All Links";
            }});
        })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide();
          me.DOM.root.classed("hideLinks", me.DOM.root.classed("hideLinks")?null:true );
        });
      X.append("span")
        .attr("class","NodeLinkControl-AnimPlay visViewControlButton fa fa-play")
        .on("click",function(){ 
          me.nodelink_Force.alpha(0.5);
          me.nodelink_restart();
        });
      X.append("span")
        .attr("class","NodeLinkControl-AnimPause visViewControlButton fa fa-pause")
        .on("click",function(){ 
          me.nodelink_Force.stop();
          me.DOM.root.attr("NodeLinkState","stopped");
          me.DOM.root.classed("hideLinks",null);
        });

      // **************************************************
      // MAP OPTIONS
      X.append("span")
        .attr("class","MapControl-ShowHideMap visViewControlButton fa fa-map-o")
        .attr("title","Show/Hide Map")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 's', title: "Show/Hide Map"}); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .on("dblclick",function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
        })
        .on("click",function(){
          var x = d3.select(me.leafletRecordMap.getPanes().tilePane);
          x.attr("showhide", x.attr("showhide")==="hide"?"show":"hide");
          d3.select(this).attr("class","MapControl-ShowHideMap visViewControlButton fa fa-map"+((x.attr("showhide")==="hide")?"":"-o"));
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });

      // **************************************************
      // SHARED OPTIONS
      X.selectAll(".MouseMode").data(['draw','pan']).enter().append("span")
        .attr("class",function(t){ 
          return "visViewControlButton MouseMode-"+t+" fa "+"fa-"+(t==='draw'?'square-o':'hand-rock-o');
        })
        .each(function(t){ 
          this.tipsy = new Tipsy(this, {gravity: 's', title: function(){ return "Click &amp; drag mouse to "+t;}} );
        })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .on("click",function(t){ 
          me.visMouseMode = me.visMouseMode=t;
          me.DOM.root.attr("visMouseMode",me.visMouseMode);
          if(me.DOM.recordGroupHolder){
            if(t==='draw'){
              me.DOM.recordGroupHolder
                .on("wheel.zoom", null)
                .on("mousedown.zoom", null)
                .on("dblclick.zoom", null)
                .on("touchstart.zoom", null)
                .on("touchmove.zoom", null)
                .on("touchend.zoom touchcancel.zoom", null)
            } else {
              me.DOM.recordGroupHolder.call(me.scatterZoom);
            }
          } else {
          }
        });

      X.append("span")
        .attr("class","visViewControlButton fa fa-plus")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 's', title: "Zoom in"} ); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .on("click",function(){ 
          if(me.viewRecAs==='map'){
            me.leafletRecordMap.zoomIn();
          } else if(me.viewRecAs==='scatter'){
            me.scatterPositionAnim = true;
            me.scatterZoom.scaleBy(me.DOM.recordGroupHolder, 2);
            me.scatterPositionAnim = false;
          } else if(me.viewRecAs==='nodelink'){
            me.nodeZoomBehavior.scaleBy(me.DOM.recordBase_NodeLink, 2);
            me._refreshNodeLinkSVG_Transform();
          }
        });
      X.append("span")
        .attr("class","visViewControlButton fa fa-minus")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 's', title: "Zoom out"} ); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .on("click",function(){ 
          if(me.viewRecAs==='map'){
            me.leafletRecordMap.zoomOut();
          } else if(me.viewRecAs==='scatter'){
            me.scatterPositionAnim = true;
            me.scatterZoom.scaleBy(me.DOM.recordGroupHolder, 1/2);
            me.scatterPositionAnim = false;
          } else if(me.viewRecAs==='nodelink'){
            me.nodeZoomBehavior.scaleBy(me.DOM.recordBase_NodeLink, 1/2);
            me._refreshNodeLinkSVG_Transform();
          }
        });
      X.append("span")
        .attr("class","visViewControlButton fa fa-arrows-alt")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 's', title: kshf.lang.cur.ZoomToFit}); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .on("dblclick",function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
        })
        .on("click",function(){ 
          if(me.viewRecAs==='map'){
            me.recMap_zoomToActive();
          } else if(me.viewRecAs==='nodelink'){
            me.nodelink_zoomToActive();
          } else if(me.viewRecAs==='scatter'){
            me.resetScatterZoom();
          }
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });
    },
    /** -- */
    resetScatterZoom: function(){
      this.scatterPositionAnim = true;
      var i = d3.zoomIdentity.translate(20,15);
      this.scatterZoom.transform(this.DOM.recordGroupHolder, i);
      this.scatterPositionAnim = false;
    },
    /** -- */
    refreshQueryBox_Filter: function(bounds){
      if(this.viewRecAs!=='scatter' && this.viewRecAs!=='map') return;
      var _left, _right, _top, _bottom;

      if(this.viewRecAs==='map' && bounds===undefined && this.spatialFilter.isFiltered){
        var north_west = this.leafletRecordMap.latLngToLayerPoint(this.spatialFilter.bounds.getNorthWest());
        var south_east = this.leafletRecordMap.latLngToLayerPoint(this.spatialFilter.bounds.getSouthEast());
        _left = north_west.x;
        _right = south_east.x
        _top = north_west.y;
        _bottom = south_east.y;
      }

      if( (typeof L !== 'undefined') && bounds instanceof L.LatLngBounds){
        var north_west = this.leafletRecordMap.latLngToLayerPoint(bounds.getNorthWest());
        var south_east = this.leafletRecordMap.latLngToLayerPoint(bounds.getSouthEast());
        _left = north_west.x;
        _right = south_east.x
        _top = north_west.y;
        _bottom = south_east.y;
      } else if(this.viewRecAs==='scatter'){
        if(bounds===undefined){
          // use summary filter ranges
          _left   = this.scatterAttrib.summaryFilter.active.min;
          _right  = this.scatterAttrib.summaryFilter.active.max;
          _top    = this.sortAttrib.summaryFilter.active.max;
          _bottom = this.sortAttrib.summaryFilter.active.min;

          if(!this.scatterAttrib.isFiltered()){
            _left  = this.scatterAttrib.intervalRange.total.min;
            if(_left===0) _left=-1000;
            _left = (_left>0) ? -_left*100 : _left*100;
            _right = this.scatterAttrib.intervalRange.total.max;
            if(_right===0) _right=1000;
            _right = (_right>0) ? _right*100 : -_right*100;
          } else {
            if(this.scatterAttrib.stepTicks){
              _left-=0.5;
              _right-=0.5;
            }
          }
          if(!this.sortAttrib.isFiltered()){
            _top    = this.sortAttrib.intervalRange.total.max;
            if(_top===0) _top=1000;
            _top = (_top>0) ? _top*100 : -_top*100;
            _bottom = this.sortAttrib.intervalRange.total.min;
            if(_bottom===0) _bottom=-1000;
            _bottom = (_bottom>0) ? -_bottom*100 : _bottom*100;
          } else {
            if(this.sortAttrib.stepTicks){
              _top-=0.5;
              _bottom-=0.5;
            }
          }
        } else {
          // use provided bounds
          if(bounds.left>bounds.right){
            var temp = bounds.left;
            bounds.left = bounds.right;
            bounds.right = temp;
          }
          if(bounds.top<bounds.bottom){
            var temp = bounds.top;
            bounds.top = bounds.bottom;
            bounds.bottom = temp;
          }
          _left   = bounds.left;
          _right  = bounds.right;
          _top    = bounds.top;
          _bottom = bounds.bottom;
        }

        // convert from domain to screen coordinates
        var _left   = this.scatterScaleX(_left);
        if(isNaN(_left)) _left = -1000; // log scale fix
        var _right  = this.scatterScaleX(_right);
        var _top    = this.scatterScaleY(_top);
        var _bottom = this.scatterScaleY(_bottom);
        if(isNaN(_bottom)) _bottom = 1000; // log scale fix

        // give more room
        _left   -= 3;
        _right  += 3;
        _top    -= 3;
        _bottom += 3;
      }

      this.DOM.recordDisplayWrapper.select(".spatialQueryBox_Filter")
        .attr("active", (
            bounds || 
            (this.scatterAttrib && this.scatterAttrib.isFiltered()) || 
            (this.sortAttrib && this.sortAttrib.isFiltered()) ||
            (this.spatialFilter && this.spatialFilter.isFiltered)
          ) ? true: null )
        .style("left",  _left+"px")
        .style("top",   _top +"px")
        .style("width", Math.abs(_right-_left)+"px")
        .style("height",Math.abs(_bottom-_top)+"px");
    },
    /** -- */
    initDOM_ScatterView: function(){
      var me = this;

      if(this.DOM.recordBase_Scatter) {
        this.DOM.recordGroup = this.DOM.recordBase_Scatter.select(".recordGroup");
        this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord");
        this.DOM.linkGroup   = this.DOM.recordGroup_Scatter.select(".linkGroup");
        return; // Do not initialize twice
      }

      this.scatterTransform = {x:0, y:0, z:1 };
      this.scatterPositionAnim = false;
      this.scatterZoom = d3.zoom()
        .scaleExtent([0.5, 8]) // 1 can cover the whole dataset.
        .on("start",function(){
          me.DOM.recordDisplayWrapper.attr("dragging",true);
        })
        .on("end",function(){
          me.DOM.recordDisplayWrapper.attr("dragging",null);
        })
        .on("zoom", function(){
          var old_z = me.scatterTransform.z;
          me.scatterTransform.x = d3.event.transform.x;
          me.scatterTransform.y = d3.event.transform.y;
          me.scatterTransform.z = d3.event.transform.k;
          me.DOM.recordGroup_Scatter
            .style("transform", 
              "translate(" + d3.event.transform.x + "px," + d3.event.transform.y+ "px) "+
              "scale(" + d3.event.transform.k + ","+ d3.event.transform.k+") "
              );
          if(me.scatterTransform.z!==old_z){
            me.refreshScatterVis();
          } else {
            me.refreshScatterTicks();
          }
        });

      this.DOM.recordBase_Scatter = this.DOM.recordDisplayWrapper.append("div").attr("class","recordBase_Scatter");
      this.DOM.scatterAxisGroup   = this.DOM.recordBase_Scatter  .append("div").attr("class","scatterAxisGroup");

      var scatterAxisTemplate = "<div class='tickGroup'></div><div class='onRecordLine'><div class='tickLine'></div><div class='tickText'></div></div>";
      this.DOM.scatterAxis_X = this.DOM.scatterAxisGroup.append("div")
        .attr("class","scatterAxis scatterAxis_X")
        .html(scatterAxisTemplate);
      this.DOM.scatterAxis_Y = this.DOM.scatterAxisGroup.append("div")
        .attr("class","scatterAxis scatterAxis_Y")
        .html(scatterAxisTemplate);

      function updateRectangle(bounds){
        var _left   = me.scatterScaleX(bounds.left);
        var _right  = me.scatterScaleX(bounds.right);
        var _top    = me.scatterScaleY(bounds.top);
        var _bottom = me.scatterScaleY(bounds.bottom);
        d3.select(this)
          .style("left",  _left+"px")
          .style("top",   _top +"px")
          .style("width", Math.abs(_right-_left)+"px")
          .style("height",Math.abs(_bottom-_top)+"px");
      };

      this.drawSelect = null;
      this.DOM.recordGroupHolder = this.DOM.recordBase_Scatter.append("div").attr("class","recordGroupHolder")
        .on("mousedown",function(){
          if(me.visMouseMode!=="draw") return;
          if(me.drawSelect==="Highlight") return;
          me.DOM.recordDisplayWrapper.attr("dragging",true);
          me.setDrawSelect("Filter");
          var mousePos = d3.mouse(this);
          me.drawingStartPoint = [
            me.scatterAxisScale_X.invert(mousePos[0]), me.scatterAxisScale_Y.invert(mousePos[1])
          ];
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("mouseup",function(){ 
          if(me.visMouseMode!=="draw") return;
          if(me.drawSelect==="Drag") return;
          if(me.drawSelect===null) return;
          me.DOM.recordDisplayWrapper.attr("dragging",null);
          if(me.drawSelect==="Filter"){
            var mousePos = d3.mouse(this);
            var curMousePos = [
              me.scatterAxisScale_X.invert(mousePos[0]), me.scatterAxisScale_Y.invert(mousePos[1])
            ];
            if(curMousePos[1]!==me.drawingStartPoint[1] && me.drawingStartPoint[0] !== curMousePos[0]){
              me.sortAttrib   .setRangeFilter(me.drawingStartPoint[1], curMousePos[1]);
              me.scatterAttrib.setRangeFilter(me.drawingStartPoint[0], curMousePos[0]);
            }
          } else if(me.drawSelect==="Highlight"){
            // Set compare selection
            var cT = me.browser.setSelect_Compare(false,true);
            var bounds = me.browser.flexAggr_Highlight.bounds;
            me.browser['flexAggr_Compare_'+cT].bounds = bounds;
            me.DOM.recordDisplayWrapper.select(".spatialQueryBox_Compare_"+cT)
              .attr("active",true)
              .each(function(){ 
                // TODO: FIX!
                updateRectangle.call(this,bounds);
              });
          }
          me.setDrawSelect(null);
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("mousemove",function(){
          if(me.visMouseMode!=="draw") return;
          var mousePos = d3.mouse(this);
          var curMousePos = [
            me.scatterAxisScale_X.invert(mousePos[0]), me.scatterAxisScale_Y.invert(mousePos[1])
          ];
          if(me.drawSelect===null){
            if(d3.event.shiftKey){
              me.setDrawSelect("Highlight");
              me.drawingStartPoint = curMousePos;
            } else {
              return;
            }
          } else if(me.drawSelect==="Highlight"){
            if(!d3.event.shiftKey){
              me.setDrawSelect(null);
              me.browser.clearSelect_Highlight();
            } else {
              // Highlight the area
              var bounds = {
                left: curMousePos[0],
                right: me.drawingStartPoint[0],
                top: curMousePos[1],
                bottom: me.drawingStartPoint[1],
              };
              if(bounds.left>bounds.right){
                var temp = bounds.left;
                bounds.left = bounds.right;
                bounds.right = temp;
              }
              if(bounds.top<bounds.bottom){
                var temp = bounds.top;
                bounds.top = bounds.bottom;
                bounds.bottom = temp;
              }
              me.DOM.recordDisplayWrapper.select(".spatialQueryBox_Highlight")
                .each(function(){ updateRectangle.call(this,bounds); });

              if(this.tempTimer) clearTimeout(this.tempTimer);
              this.tempTimer = setTimeout(function(){
                var records = [];
                var yID = me.sortAttrib   .summaryID;
                var xID = me.scatterAttrib.summaryID;
                me.browser.records.forEach(function(record){ 
                  if(!record.isWanted) return;
                  var _x = record._valueCache[xID];
                  var _y = record._valueCache[yID];
                  if(_x>=bounds.left && _x<bounds.right && _y>=bounds.bottom && _y<bounds.top){
                    records.push(record);
                  } else {
                    record.remForHighlight(true);
                  }
                });
                me.browser.flexAggr_Highlight.records = records;
                me.browser.flexAggr_Highlight.summary = me.textSearchSummary;
                me.browser.flexAggr_Highlight.bounds = bounds;
                me.browser.flexAggr_Highlight.data = {id: "<i class='fa fa-square-o'></i> (Area)"};
                me.browser.setSelect_Highlight();
              }, 150);
            }
          } else if(me.drawSelect==="Filter"){
            var bounds = {
              left: curMousePos[0],
              right: me.drawingStartPoint[0],
              top: curMousePos[1],
              bottom: me.drawingStartPoint[1],
            };
            me.refreshQueryBox_Filter(bounds);
          }
          d3.event.stopPropagation();
          d3.event.preventDefault();
        });

      this.DOM.recordGroupHolder.call(this.scatterZoom);

      this.DOM.recordGroup_Scatter = this.DOM.recordGroupHolder.append("div").attr("class","recordGroup_Scatter");

      var _svg = this.DOM.recordGroup_Scatter.append("svg").attr("xmlns","http://www.w3.org/2000/svg")
        .attr("class","asdasdasdsadas");

      if(this.linkBy.length>0){
        this.DOM.linkGroup = _svg.append("g").attr("class","linkGroup");
        this.prepareRecordLinks();
        this.insertDOM_RecordLinks();
      }

      this.DOM.recordGroup = _svg.append("g").attr("class","recordGroup");

      this.insertQueryBoxes(this.DOM.recordGroup_Scatter,
        function(t){
          if(d3.event.which !== 1) return; // only respond to left-click
          me.DOM.recordDisplayWrapper.attr("dragging",true);
          var mousePos = d3.mouse(me.DOM.recordGroupHolder.node())
          var newPos = [
            me.scatterAxisScale_X.invert(mousePos[0]), 
            me.scatterAxisScale_Y.invert(mousePos[1])
          ];
          var bounds = {
            left:   me.scatterAttrib.summaryFilter.active.min,
            right:  me.scatterAttrib.summaryFilter.active.max,
            top:    me.sortAttrib.summaryFilter.active.max,
            bottom: me.sortAttrib.summaryFilter.active.min
          };
          d3.select("body").on("mousemove", function(e){
            var mousePos = d3.mouse(me.DOM.recordGroupHolder.node())
            var targetPos = [
              me.scatterAxisScale_X.invert(mousePos[0]), 
              me.scatterAxisScale_Y.invert(mousePos[1])
            ];
            if(t==='l'){
              me.scatterAttrib.setRangeFilter(targetPos[0], me.scatterAttrib.summaryFilter.active.max, true);
              bounds.left = targetPos[0];
            }
            if(t==='r'){
              me.scatterAttrib.setRangeFilter(me.scatterAttrib.summaryFilter.active.min, targetPos[0], true);
              bounds.right = targetPos[0];
            }
            if(t==='t'){
              me.sortAttrib.setRangeFilter(me.sortAttrib.summaryFilter.active.min, targetPos[1], true);
              bounds.top = targetPos[1];
            }
            if(t==='b'){
              me.sortAttrib.setRangeFilter(targetPos[1], me.sortAttrib.summaryFilter.active.max, true);
              bounds.bottom = targetPos[1];
            }
            me.refreshQueryBox_Filter(bounds);
          }).on("mouseup", function(){
            // update range filter
            me.DOM.recordDisplayWrapper.attr("dragging",null);
            d3.select("body").on("mousemove",null).on("mouseup",null);
          });
          d3.event.preventDefault();
          d3.event.stopPropagation();
        },
        function(t){
          if(d3.event.which !== 1) return; // only respond to left-click
          me.DOM.recordDisplayWrapper.attr("dragging",true);
          var mousePos = d3.mouse(me.DOM.recordGroupHolder.node())
          var initPos = [
            me.scatterAttrib.valueScale( me.scatterAxisScale_X.invert(mousePos[0]) ), 
            me.sortAttrib   .valueScale( me.scatterAxisScale_Y.invert(mousePos[1]) )
          ];
          var initMin_X = me.scatterAttrib.summaryFilter.active.min;
          var initMax_X = me.scatterAttrib.summaryFilter.active.max;
          var initMin_Y = me.sortAttrib   .summaryFilter.active.min;
          var initMax_Y = me.sortAttrib   .summaryFilter.active.max;
          d3.select("body").on("mousemove", function(e){
            var mousePos = d3.mouse(me.DOM.recordGroupHolder.node())
            var curPos = [
              me.scatterAttrib.valueScale( me.scatterAxisScale_X.invert(mousePos[0]) ), 
              me.sortAttrib   .valueScale( me.scatterAxisScale_Y.invert(mousePos[1]) )
            ];
            me.scatterAttrib.dragRange(initPos[0],curPos[0], initMin_X, initMax_X);
            me.sortAttrib   .dragRange(initPos[1],curPos[1], initMin_Y, initMax_Y);
            var bounds = {
              left:   me.scatterAttrib.summaryFilter.active.min,
              right:  me.scatterAttrib.summaryFilter.active.max,
              top:    me.sortAttrib   .summaryFilter.active.max,
              bottom: me.sortAttrib   .summaryFilter.active.min
            };
            me.refreshQueryBox_Filter(bounds);
          }).on("mouseup", function(){
            me.DOM.recordDisplayWrapper.attr("dragging",null);
            d3.select("body").on("mousemove",null).on("mouseup",null);
          });
          d3.event.preventDefault();
          d3.event.stopPropagation();
        },
        function(d){
          if(d==="Filter"){
            me.scatterAttrib.summaryFilter.clearFilter();
            me.sortAttrib   .summaryFilter.clearFilter();
          } else if(d!=="Highlight"){ // Compare_X
            me.browser.clearSelect_Compare(d.substr(8));
          }
          this.tipsy.hide();
        }
      );

      this.initDOM_CustomControls();
    },
    /** -- */
    insertQueryBoxes: function(parent, setSizeCb, dragCb, clearCb){
      var me=this;
      var queryBoxes = parent.selectAll(".spatialQueryBox")
        .data(["Filter","Highlight","Compare_A","Compare_B","Compare_C"])
        .enter()
          .append("div").attr("class", function(d){ return "spatialQueryBox spatialQueryBox_"+d; });

      queryBoxes.selectAll(".setSize").data(['l','r','t','b'])
        .enter().append("div").attr("class",function(k){ return "setSize-"+k;})
          .on("mousedown", setSizeCb);

      queryBoxes.append("div").attr("class","dragSelection fa fa-arrows")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'se', title: "Drag" }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("mousedown", dragCb);

      queryBoxes.append("div").attr("class","clearFilterButton fa")
        .each(function(d){ 
          this.tipsy = new Tipsy(this, {gravity: 'nw', 
            title: (d==="Filter") ? kshf.lang.cur.RemoveFilter : kshf.lang.cur.Unlock
          });
        })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("mouseup",function(){
          if(me.drawSelect) return;
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("mousedown",function(){
          if(me.drawSelect) return;
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("click", clearCb);
    },
    /** -- */
    initDOM_NodeLinkView: function(){
      var me = this;

      if(this.DOM.recordBase_NodeLink) {
        this.DOM.recordGroup = this.DOM.recordBase_NodeLink.select(".recordGroup");
        this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord");
        this.DOM.linkGroup   = this.DOM.recordBase_NodeLink.select(".linkGroup");
        return; // Do not initialize twice
      }

      this.nodeZoomBehavior = d3.zoom()
        .scaleExtent([0.1, 80])
        .on("start",function(){
          me.DOM.recordDisplayWrapper.attr("dragging",true);
        })
        .on("end",function(){
          me.DOM.recordDisplayWrapper.attr("dragging",null);
        })
        .on("zoom", function(){
          gggg.attr("transform", 
            "translate(" + d3.event.transform.x + "," + d3.event.transform.y+ ") "+
            "scale(" + d3.event.transform.k + ")");
          me.refreshNodeLinkVis();
        });

      this.DOM.recordBase_NodeLink = this.DOM.recordDisplayWrapper
        .append("svg").attr("xmlns","http://www.w3.org/2000/svg").attr("class","recordBase_NodeLink")
        
        .call(this.nodeZoomBehavior);

      var gggg = this.DOM.recordBase_NodeLink.append("g");
      this.DOM.linkGroup   = gggg.append("g").attr("class","linkGroup");
      this.DOM.recordGroup = gggg.append("g").attr("class","recordGroup");

      var x = this.DOM.recordDisplayWrapper.node();
      this.DOM.recordBase_NodeLink.call(
        this.nodeZoomBehavior.transform,
        d3.zoomIdentity.translate( x.offsetWidth/2, x.offsetHeight/2).scale(1)
      );

      this.initDOM_CustomControls();
    },
    /** -- */
    initDOM_ListView: function(){
      var me = this;

      if(this.DOM.recordGroup_List) return;

      this.DOM.recordGroup_List = this.DOM.recordDisplayWrapper.append("div").attr("class","recordGroup_List");

      this.DOM.recordGroup = this.DOM.recordGroup_List.append("div").attr("class","recordGroup")
        .on("scroll",function(d){
          if(this.scrollHeight-this.scrollTop-this.offsetHeight<10){
            if(me.autoExpandMore){
              me.showMoreRecordsOnList();
            } else {
              me.DOM.showMore.attr("showMoreVisible",true);
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
    setRecordViewSummary: function(summary){
      if(summary===undefined || summary===null) {
        this.removeRecordViewSummary();
        return;
      }
      if(this.recordViewSummary===summary) return;
      if(this.recordViewSummary) this.removeRecordViewSummary();

      this.DOM.root.attr('hasRecordView',true);
      this.recordViewSummary = summary;
      this.recordViewSummary.initializeAggregates();
      this.recordViewSummary.isRecordView = true;
      this.recordViewSummary.refreshThumbDisplay();

      this.setRecordViewBriefSummary(summary);
      
      if(this.spatialFilter){
        this.spatialFilter.summary = this.recordViewSummary;
        this.recordViewSummary.summaryFilter = this.spatialFilter;
      }

      // TODO: Delete existing record DOM's and regenerate them
      if(this.DOM.recordGroup)
        this.DOM.recordGroup.selectAll(".kshfRecord").data([]).exit().remove();

      this.viewAs(this.viewRecAs);
    },
    /** -- */
    setRecordViewBriefSummary: function(summary){
      this.recordViewSummaryBrief = summary;
      this.recordViewSummaryBrief.initializeAggregates();
    },
    /** -- */
    removeRecordViewSummary: function(){
      if(this.recordViewSummary===null) return;
      this.DOM.root.attr("hasRecordView",null);
      this.recordViewSummary.isRecordView = false;
      this.recordViewSummary.refreshThumbDisplay();
      this.recordViewSummary = null;
      this.browser.DOM.root.attr("recordEncoding",null);
    },
    /** -- */
    setTextSearchSummary: function(summary){
      if(summary===undefined || summary===null) return;
      this.textSearchSummary = summary;
      this.textSearchSummary.initializeAggregates();
      this.textSearchSummary.isTextSearch = true;
      this.DOM.recordTextSearch
        .attr("isActive",true)
        .select("input").attr("placeholder", kshf.lang.cur.Search+": "+summary.summaryName);
      this.textFilter = this.browser.createFilter('text',this);
      this.textSearchSummary.summaryFilter = this.textFilter;
    },
    /** -- */
    collapseRecordViewSummary: function(collapsed){
      this.collapsed = collapsed;
      this.DOM.root.attr("collapsed",collapsed?true:null);
      this.browser.updateLayout_Height();
    },
    /** -- */
    refreshRecordRanks: function(d3_selection){
      if(!this.showRank) return; // Do not refresh if not shown...
      d3_selection.text(function(record){ return (record.recordRank<0)?"":record.recordRank+1; });
    },
    /** -- */
    refreshRecordDOMOrder: function(){
      this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord")
        .data(this.browser.records, function(record){ return record.id(); })
        .order();
      kshf.Util.scrollToPos_do(this.DOM.recordGroup,0);
    },
    /** -- */
    refreshViz_Compare_All: function(){
      var me=this;
      this.DOM.root.selectAll("[class*='spatialQueryBox_Comp']")
        .attr("active", function(d){ return me.browser.vizActive[d] ? true : null; });
    },
    /** -- */
    setSortColumnWidth: function(v){
      if(this.viewRecAs!=='list') return;
      this.sortColWidth = Math.max(Math.min(v,110),30); // between 30 and 110 pixels
      this.DOM.recordSortValue.style("width",this.sortColWidth+"px");
      this.refreshAdjustSortColumnWidth();
    },
    /** -- */
    getSortingLabel: function(record){
      var s = this.sortAttrib.sortLabel.call(record.data,record);
      if(s===null || s===undefined || s==="") return "";
      if(typeof s!=="string") s = this.sortColFormat(s);
      return this.sortAttrib.printWithUnitName(s);
    },
    /** -- */
    refreshRecordSortLabels: function(d3_selection){
      if(this.viewRecAs!=='list') return; // Only list-view allows sorting
      if(d3_selection===undefined) d3_selection = this.DOM.recordSortValue;

      var me=this;
      d3_selection.html(function(record){
        var v= me.getSortingLabel(record); 
        return (v==="") ? "-" : v;
      });
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
    refreshScatterOptions: function(){
      if(this.DOM.root===undefined) return;
      if(this.viewRecAs!=="scatter") return;
      this.DOM.root.selectAll(".ScatterControl-ScatterAttrib > select > option").remove();
      this.DOM.root.selectAll(".ScatterControl-ScatterAttrib > select").selectAll("option")
        .data(this.getScatterAttributes()).enter()
          .append("option")
            .text(function(summary){ return summary.summaryName; })
            .attr("selected",function(summary){ return summary.encodesRecordsBy==='scatter'?true:null; });
    },
    /** -- */
    refreshSortingOptions: function(){
      if(this.DOM.recordSortSelectbox===undefined) return;
      this.DOM.recordSortSelectbox.selectAll("option").remove();
      var me=this;
      var scatterID = -1;
      if(this.scatterAttrib) scatterID = this.scatterAttrib.summaryID;
      this.DOM.recordSortSelectbox.selectAll("option").data(
        this.sortingOpts.filter(function(summary){ return summary.summaryID !== scatterID; })
      ).enter()
        .append("option")
          .html(function(summary){ return summary.summaryName; })
          .attr("selected",function(summary){ return summary.encodesRecordsBy==='sort'?true:null; });
      this.refreshScatterOptions();
    },
    /** -- */
    prepSortingOpts: function(){
      this.sortingOpts.forEach(function(sortOpt,i){
        if(sortOpt.summaryName) return; // It already points to a summary
        if(typeof(sortOpt)==="string"){
          sortOpt = { name: sortOpt };
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

      // Only interval summaries can be used as sorting options
      this.sortingOpts = this.sortingOpts.filter(function(s){ return s instanceof kshf.Summary_Interval; });
    },
    /** -- */
    alphabetizeSortingOptions: function(){
      this.sortingOpts.sort(function(s1,s2){ 
        return s1.summaryName.localeCompare(s2.summaryName, { sensitivity: 'base' });
      });
    },
    /** -- */
    setScatterAttrib: function(attrib){
      if(this.scatterAttrib) {
        this.scatterAttrib.clearEncodesRecordsBy();
      }
      this.scatterAttrib = attrib;
      this.scatterAttrib.setEncodesRecordsBy("scatter");

      if(this.recordViewSummary===null) return;
      if(this.DOM.root===undefined) return;

      this.refreshScatterVis(true);
      this.refreshSortingOptions();
    },
    /** -- */
    setSortAttrib: function(index){
      if(this.sortAttrib){
        var curHeight = this.sortAttrib.getHeight();
        this.sortAttrib.clearEncodesRecordsBy();
        this.sortAttrib.setHeight(curHeight);
      }
      
      if(typeof index === "number"){
        if(index<0 || index>=this.sortingOpts.length) return;
        this.sortAttrib = this.sortingOpts[index];
      } else if(index instanceof kshf.Summary_Base){
        this.sortAttrib = index;
      }

      if(this.config.onSort) this.config.onSort.call(this);

      {
        var curHeight = this.sortAttrib.getHeight();
        this.sortAttrib.setEncodesRecordsBy("sort");
        this.sortAttrib.setHeight(curHeight);
      }

      // Sort column format function
      this.sortColFormat = function(a){ return a.toLocaleString(); };
      if(this.sortAttrib.isTimeStamp()){
        this.sortColFormat = this.sortAttrib.timeTyped.print;
      }

      if(this.recordViewSummary===null) return;
      if(this.DOM.root===undefined) return;

      switch(this.viewRecAs){
        case 'map':
        case 'nodelink':
          this.refreshRecordColors();
          break;
        case 'scatter':
          this.refreshSortingOptions();
          this.refreshScatterVis(true);
          break;
        case 'list':
        case 'grid':
          this.sortRecords();
          if(this.DOM.recordGroup) {
            this.refreshRecordDOM();
            this.refreshRecordDOMOrder();
            this.refreshRecordRanks(this.DOM.recordRanks);
            this.refreshRecordSortLabels();
          }
          break;
      }
    },
    /** -- */
    refreshAdjustSortColumnWidth: function(){
      if(this.viewRecAs!=='list') return;
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
    nodelink_restart: function(){
      this.nodelink_Force.restart();
      this.DOM.root.attr("NodeLinkState","started");
      if(this.recordLinks.length>1000) this.DOM.root.classed("hideLinks",true);
    },
    /** -- */
    refreshVis_Nodes: function(){
      var t = d3.zoomTransform(this.DOM.recordBase_NodeLink.node());
      var scale = "scale("+(1/t.k)+")";
      this.DOM.kshfRecords.attr("transform", function(d){ return "translate("+d.x+","+d.y+") "+scale; });
    },
    /** -- */
    refreshScatterVis: function(animate){
      if(this.DOM.recordBase_Scatter===undefined) return;
      var me = this;
      var scale = "scale("+(1/this.scatterTransform.z)+")";

      var sX = this.scatterAttrib;
      var sY = this.sortAttrib;

      var accX = sX.summaryID;
      var accY = sY.summaryID;

      this.scatterScaleX = sX.scaleType==='log' ? d3.scaleLog().base(2) : d3.scaleLinear();
      this.scatterScaleX.domain([sX.intervalRange.active.min, sX.intervalRange.active.max])
        .range([0, (this.curWidth-80)])
        .clamp(false);

      this.scatterScaleY = sY.scaleType==='log' ? d3.scaleLog().base(2) : d3.scaleLinear();
      this.scatterScaleY.domain([sY.intervalRange.active.min, sY.intervalRange.active.max])
        .range([(this.curHeight-80),0])
        .clamp(false);

      var x = this.DOM.kshfRecords;
      if(animate) x = x.transition().duration(700).ease(d3.easeCubic);
      x.attr("transform",function(record){
        record.x = me.scatterScaleX(record._valueCache[accX]);
        record.y = me.scatterScaleY(record._valueCache[accY]);
        return "translate("+record.x+","+record.y+") "+scale;
      });
      this.refreshScatterTicks();

      if(this.DOM.recordLinks){
        // position & direction of the links
        this.DOM.recordLinks
          .attr("x1", function(link) { return link.source.x; })
          .attr("y1", function(link) { return link.source.y; })
          .attr("x2", function(link) { return link.target.x; })
          .attr("y2", function(link) { return link.target.y; });
        }
    },
    /** -- */
    refreshScatterTicks: function(){
      var me=this;

      // Compute bounds in SVG coordinates after transform is applied.
      var minX_real = (-this.scatterTransform.x)/this.scatterTransform.z;
      var maxX_real = minX_real + (this.curWidth-35)/this.scatterTransform.z;
      var minY_real = (-this.scatterTransform.y)/this.scatterTransform.z;
      var maxY_real = minY_real + (this.curHeight-50)/this.scatterTransform.z;

      var minX_v = this.scatterScaleX.invert(minX_real);
      var maxX_v = this.scatterScaleX.invert(maxX_real);
      var minY_v = this.scatterScaleY.invert(minY_real);
      var maxY_v = this.scatterScaleY.invert(maxY_real);

      var tGroup;
      var hm=true;

      if(this.scatterAxisScale_X){
        this.scatterAxisScale_X_old = this.scatterAxisScale_X.copy();
        this.scatterAxisScale_Y_old = this.scatterAxisScale_Y.copy();
        hm=false;
      }

      this.scatterAxisScale_X = this.scatterScaleX.copy()
        .domain([minX_v, maxX_v])
        .range([0, this.curWidth-35]);
      this.scatterAxisScale_Y = this.scatterScaleY.copy()
        .domain([minY_v, maxY_v])
        .range([0,this.curHeight-50]);

      if(hm){
        this.scatterAxisScale_X_old = this.scatterAxisScale_X.copy();
        this.scatterAxisScale_Y_old = this.scatterAxisScale_Y.copy();
      }
      
      var ticks ={}
      ticks.X = this.scatterAxisScale_X.ticks(Math.floor((this.curWidth-40)/30) );
      if(!this.scatterAttrib.hasFloat){
        ticks.X = ticks.X.filter(function(t){ return t%1===0; });
      }

      ticks.Y = this.scatterAxisScale_Y.ticks(Math.floor((this.curHeight-50)/30) );
      if(!this.sortAttrib.hasFloat){
        ticks.Y = ticks.Y.filter(function(t){ return t%1===0; });
      }

      // TODO: add translateZ to reduce redraw (but causes flickering on chrome)
      var addTicks = function(axis, _translate){
        var tGroup = me.DOM["scatterAxis_"+axis].select(".tickGroup");
        var axisScale = me["scatterAxisScale_"+axis];
        var axisScale_old = me["scatterAxisScale_"+axis+"_old"];

        var hm = tGroup.selectAll(".hmTicks").data(ticks[axis], function(t){ return t; });
        hm.style("transform", function(tick){ return _translate + axisScale(tick) + "px) translateZ(0)"; });
        hm.exit()
          .style("transform", function(tick){ return _translate + axisScale(tick) + "px) translateZ(0)"; })
          .style("opacity",0).transition().duration(0).delay(500).remove();
        var tk = hm.enter().append("div").attr("class","hmTicks")
          .attr("zero",function(tick){ return tick===0?true:null})
          .style("transform", function(tick){ return _translate + axisScale_old(tick) + "px) translateZ(0)"; });
        tk.transition().duration(0).delay(10)
          .style("transform", function(tick){ return _translate + axisScale(tick) + "px) translateZ(0)"; })
          .style("opacity",1);
        tk.append("div").attr("class","tickText");
        tk.append("div").attr("class","tickLine");
      };

      addTicks("X","translateX(");
      addTicks("Y","translateY(");

      this.DOM.scatterAxis_X.selectAll(".tickText")
        .html(function(tick){ return me.scatterAttrib.printWithUnitName(me.browser.getTickLabel(tick)); });
      this.DOM.scatterAxis_Y.selectAll(".tickText")
        .html(function(tick){ return me.sortAttrib   .printWithUnitName(me.browser.getTickLabel(tick)); });

      this.refreshQueryBox_Filter();
    },
    /** -- */
    refreshNodeLinkVis: function(){
      if(this.DOM.recordLinks===undefined) return;

      // position & direction of the links
      this.DOM.recordLinks
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      this.refreshVis_Nodes();
    },
    /** -- */
    nodelink_zoomToActive: function(){
      var _translate, _scale;

      var bounds_x = [null,null];
      var bounds_y = [null,null];

      var grav_x = 0;
      var grav_y = 0;

      // compute rectangular bounding box of the nodes
      var recs = this.browser.records.filter(function(record){ return record.isWanted; });
      recs.forEach(function(d){
        var _min_x = d.x-0.2;
        var _max_x = d.x+0.2;
        var _min_y = d.y-0.2;
        var _max_y = d.y+0.2;

        grav_x += d.x;
        grav_y += d.y;

        if(bounds_x[0]===null){
          bounds_x = [_min_x, _max_x];
          bounds_y = [_min_y, _max_y];
        } else {
          if(_min_x<bounds_x[0]) bounds_x[0] = _min_x;
          if(_min_y<bounds_y[0]) bounds_y[0] = _min_y;
          if(_max_x>bounds_x[1]) bounds_x[1] = _max_x;
          if(_max_x>bounds_x[1]) bounds_x[1] = _max_x;
        }
      });

      var _translate = [ grav_x/recs.length , grav_y/recs.length ];

      var x = this.DOM.recordDisplayWrapper.node();

      var _scale = x.offsetHeight / ((bounds_y[1]-bounds_y[0])*3);

      this.DOM.recordBase_NodeLink.transition().duration(750).call(
        this.nodeZoomBehavior.transform,
        d3.zoomIdentity
          .translate( x.offsetWidth/2, x.offsetHeight/2)
          .scale(_scale)
      );

      this.refreshNodeLinkVis();
    },
    /** -- */
    _refreshNodeLinkSVG_Transform: function(){
      var t = d3.zoomTransform(this.DOM.recordBase_NodeLink.node());
      var _scale = t.k;
      var _translate = [t.x, t.y];
      this.DOM.recordBase_NodeLink.select(".gggg")
        .attr("transform", "translate(" + _translate[0] + "," + _translate[1] + ") scale(" + _scale + ")");

      this.refreshVis_Nodes();
    },
    /** -- */
    prepareRecordLinks: function(){
      this.browser.records.forEach(function(record){ record.initLinks(); });

      var recordsIndexed = kshf.dt_id[browser.primaryTableName];
      var linkAttribName = this.linkBy[0];

      this.recordLinks = [];

      this.browser.records.forEach(function(recordFrom){
        var links = recordFrom.data[linkAttribName];
        if(links) {
          links.forEach(function(recordTo_id){
            var recordTo = recordsIndexed[recordTo_id];
            if(recordTo) {
              recordFrom.links_To.push(recordTo);
              recordTo.links_From.push(recordFrom);
              this.recordLinks.push({source:recordFrom, target: recordTo});
            }
          },this);
        }
      },this);
    },
    /** -- */
    insertDOM_RecordLinks: function(){
      this.DOM.linkGroup.selectAll(".recordLink").remove();
      this.DOM.recordLinks = this.DOM.linkGroup.selectAll(".recordLink").data(this.recordLinks)
        .enter().append("line").attr("class", "recordLink")
        .each(function(link){
          var recordFrom = link.source;
          var recordTo = link.target;
          recordFrom.DOM.links_To.push(this);
          recordTo.DOM.links_From.push(this);
        });
    },
    /** -- */
    setNodeLink: function(){
      var me=this;

      this.prepareRecordLinks();
      this.insertDOM_RecordLinks();

      this.nodelink_Force = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-5))
        .force("link", d3.forceLink(this.recordLinks).strength(0.05).iterations(3) )
        .alphaMin(0.1)
        .velocityDecay(0.3)
        //.force("center", d3.forceCenter())
        // Old params
        //.charge(-60)
        //.gravity(0.8)
        //.alpha(0.4)
        .on("end",  function(){ 
          me.DOM.root.attr("NodeLinkState","stopped");
          me.DOM.root.classed("hideLinks",null);
        })
        .on("tick", function(){ 
          me.refreshNodeLinkVis();
        });

      this.nodelink_Force.nodes(this.browser.records);
    },
    /** -- */ 
    changeOfScale: function(){
      if(this.viewRecAs!=='map' && this.viewRecAs!=='nodelink'){
        this.refreshRecordColors();
      }
      if(this.viewRecAs==='scatter'){
        this.refreshScatterVis(true);
      }
    },
    /** -- */
    refreshRecordColors: function(){
      if(!this.recordViewSummary) return;
      if(this.viewRecAs!=='map' && this.viewRecAs!=='nodelink') return;
      if(!this.sortAttrib) return;

      var me=this;
      var s_f  = this.sortAttrib.summaryFunc;
      var s_log;

      if(this.sortAttrib.scaleType==='log'){
        this.recordColorScale = d3.scaleLog();
        s_log = true;
      } else {
        this.recordColorScale = d3.scaleLinear();
        s_log = false;
      }
      var min_v = this.sortAttrib.intervalRange.total.min;
      var max_v = this.sortAttrib.intervalRange.total.max;
      if(this.sortAttrib.intervalRange.active){
        min_v = this.sortAttrib.intervalRange.active.min;
        max_v = this.sortAttrib.intervalRange.active.max;
      }
      if(min_v===undefined) min_v = d3.min(this.browser.records, function(d){ return s_f.call(d.data); });
      if(max_v===undefined) max_v = d3.max(this.browser.records, function(d){ return s_f.call(d.data); });
      this.recordColorScale
        .range([0, 9])
        .domain( [min_v, max_v] );

      this.colorQuantize = d3.scaleQuantize()
        .domain([0,9])
        .range(kshf.colorScale[me.browser.mapColorTheme]);

      var undefinedFill = (this.viewRecAs==='map') ? "url(#diagonalHatch)" : "white";

      var fillFunc = function(d){ 
        var v = s_f.call(d.data);
        if(s_log && v<=0) v=undefined;
        if(v===undefined) return undefinedFill;
        var vv = me.recordColorScale(v);
        if(me.sortAttrib.invertColorScale) vv = 9 - vv;
        return me.colorQuantize(vv); 
      };

      if(this.viewRecAs==='map') {
        this.DOM.kshfRecords.each(function(d){ 
          var v = s_f.call(d.data);
          if(s_log && v<=0) v=undefined;
          if(v===undefined) {
            this.style.fill = undefinedFill;
            this.style.stroke = "gray";
            return;
          }
          var vv = me.recordColorScale(v);
          if(me.sortAttrib.invertColorScale) vv = 9 - vv;
          this.style.fill = me.colorQuantize(vv); 
          this.style.stroke = me.colorQuantize(vv>=5?0:9);
        });
      }
      if(this.viewRecAs==='nodelink') {
        this.DOM.kshfRecords.style("fill", function(d){ 
          var v = s_f.call(d.data);
          if(s_log && v<=0) v=undefined;
          if(v===undefined) return undefinedFill;
          var vv = me.recordColorScale(v);
          if(me.sortAttrib.invertColorScale) vv = 9 - vv;
          return me.colorQuantize(vv); 
        });
      }
    },
    /** -- */
    highlightLinked: function(recordFrom){
      if(recordFrom.DOM.links_To===undefined) return;
      recordFrom.DOM.links_To.forEach(function(dom){
        dom.style.display = "block";
      });
      var links = recordFrom.data[this.linkBy[0]];
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
      if(recordFrom.DOM.links_To===undefined) return;
      recordFrom.DOM.links_To.forEach(function(dom){
        dom.style.display = null;
      });
      var links = recordFrom.data[this.linkBy[0]];
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
    onRecordMouseOver: function(record){
      record.highlightRecord();
      this.highlightLinked(record);
      if(this.viewRecAs==='scatter'){
        this.DOM.root.selectAll(".onRecordLine").style('opacity',1);
        var accX = this.scatterAttrib.summaryID;
        var accY = this.sortAttrib.summaryID;

        var recX = this.scatterAxisScale_X(record._valueCache[accX]);
        var recY = this.scatterAxisScale_Y(record._valueCache[accY]);
        this.DOM.scatterAxis_X.select(".onRecordLine").style("transform","translate(  "+recX+"px,0px)");
        this.DOM.scatterAxis_Y.select(".onRecordLine").style("transform","translate(0px,"+recY+"px)");

        this.DOM.scatterAxis_X.select(".onRecordLine > .tickText")
          .html(this.scatterAttrib.printWithUnitName(record._valueCache[accX] ));
        this.DOM.scatterAxis_Y.select(".onRecordLine > .tickText")
          .html(this.sortAttrib   .printWithUnitName(record._valueCache[accY] ));
      }
      if(this.viewRecAs==='map' || this.viewRecAs==='nodelink' || this.viewRecAs==='scatter'){
        // reorder dom so it appears on top.
        record.DOM.record.parentNode.appendChild(record.DOM.record);
      }
    },
    /** -- */
    onRecordMouseLeave: function(record){
      record.unhighlightRecord();
      this.unhighlightLinked(record);
      if(this.viewRecAs==='scatter'){
        this.DOM.root.selectAll(".onRecordLine").style('opacity',null);
      }
    },
    /** -- */
    refreshRecordDOM: function(){
      var me=this, x;
      var records = (
        this.viewRecAs==='map' || 
        this.viewRecAs==='nodelink' ||
        this.viewRecAs==='scatter'
      )?
        // all records
        this.browser.records
        : 
        // only top-sorted records
        this.browser.records.filter(function(record){
          return record.isWanted && (record.recordRank<me.maxVisibleItems);
        });

      var newRecords = this.DOM.recordGroup.selectAll(".kshfRecord")
        .data(records, function(record){ return record.id(); }).enter();

      var nodeType = ({
        map      : 'path',
        nodelink : 'circle',
        scatter  : 'circle',
        list     : 'div',
        grid     : 'div'
      })[this.viewRecAs];

      var briefSummaryID = this.recordViewSummaryBrief.summaryID;
      var mainSummaryID = this.recordViewSummary.summaryID;

      // Shared structure per record view
      newRecords = newRecords
        .append( nodeType )
        .attr('class','kshfRecord')
        .attr("id",function(record){ return "kshfRecord_"+record.id(); }) // can be used to apply custom CSS
        .attr("rec_compared",function(record){ return record.selectCompared_str?record.selectCompared_str:null;})
        .each(function(record){
          record.DOM.record = this;
          if(me.viewRecAs==='map' || me.viewRecAs==='scatter' || me.viewRecAs==='nodelink'){
            this.tipsy = new Tipsy(this, {
              gravity: 'e',
              className: 'recordTip',
              title: (me.viewRecAs==='scatter' || me.viewRecAs==='nodelink') ?
                // scatter, nodelink
                function(){ return record._valueCache[mainSummaryID]; } :
                // map
                function(){ 
                  var v = me.sortAttrib.summaryFunc.call(record.data,record);
                  return ""+
                    "<span class='mapItemName'>"+record._valueCache[mainSummaryID]+"</span>"+
                    "<span class='mapTooltipLabel'>"+me.sortAttrib.summaryName+"</span>: "+
                    "<span class='mapTooltipValue'>"+me.sortAttrib.printWithUnitName(v)+"</span>";
                }
            });
          }
        })
        .on("mouseenter",function(record){
          var DOM = this;
          var event = d3.event;
          if(this.highlightTimeout) clearTimeout(this.highlightTimeout);
          this.highlightTimeout = setTimeout(function(){ 
            if(DOM.tipsy) {
              DOM.tipsy.show();
              if(me.viewRecAs==='map'){
                var browserPos = me.browser.DOM.root.node().getBoundingClientRect();
                DOM.tipsy.jq_tip.node().style.left = 
                  (event.pageX - browserPos.left - DOM.tipsy.tipWidth-10)+"px";
                DOM.tipsy.jq_tip.node().style.top = 
                  (event.pageY - browserPos.top -DOM.tipsy.tipHeight/2)+"px";
                }
            }
            me.onRecordMouseOver(record);
          }, (me.browser.mouseSpeed<0.2) ? 0 : me.browser.mouseSpeed*300);
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("mouseleave",function(record){
          if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
          if(this.tipsy) this.tipsy.hide();
          me.onRecordMouseLeave(record);
        })
        .on("mousedown", function(){
          this._mousemove = false;
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("mousemove", function(){
          this._mousemove = true;
          if(me.viewRecAs==='map' && this.tipsy && this.tipsy.jq_tip){
            var browserPos = me.browser.DOM.root.node().getBoundingClientRect();
            this.tipsy.jq_tip.node().style.left =
              (d3.event.pageX - browserPos.left - this.tipsy.tipWidth-10)+"px";
            this.tipsy.jq_tip.node().style.top =
              (d3.event.pageY - browserPos.top -this.tipsy.tipHeight/2)+"px";
          }
        })
        .on("click",function(_record){
          if(this.tipsy) this.tipsy.hide();
          if(this._mousemove) return; // Do not show the detail view if the mouse was used to drag the map
          if(me.viewRecAs==='map' || me.viewRecAs==='nodelink' || me.viewRecAs==='scatter'){
            me.browser.updateRecordDetailPanel(_record);
          }
        });
      
      if(this.viewRecAs==='list' || this.viewRecAs==="grid"){
        newRecords.attr('details',false);
        // RANK
        x = newRecords.append("span").attr("class","recordRank")
          .each(function(_record){
            this.tipsy = new Tipsy(this, {
              gravity: 'e',
              title: function(){ return kshf.Util.ordinal_suffix_of((_record.recordRank+1)); }
            });
          })
          .on("mouseenter",function(){ this.tipsy.show(); })
          .on("mouseout"  ,function(){ this.tipsy.hide(); });
        this.refreshRecordRanks(x);
        // SORTING VALUE LABELS
        if(this.viewRecAs==='list'){
          x = newRecords.append("div").attr("class","recordSortValue").style("width",this.sortColWidth+"px");
          this.refreshRecordSortLabels(x);
        }
        // TOGGLE DETAIL
        newRecords.append("div").attr("class","recordToggleDetail fa")
          .each(function(d){
            this.tipsy = new Tipsy(this, {
              gravity:'s',
              title: function(){
                if(me.detailsToggle==="one" && this.viewRecAs==='list')
                  return d.showDetails===true?"Show less":"Show more";
                return kshf.lang.cur.ShowMoreInfo;
              }
            });
          })
          .on("mouseenter", function(){ this.tipsy.show(); })
          .on("mouseleave", function(){ this.tipsy.hide(); })
          .on("click", function(record){
            this.tipsy.hide();
            if(me.detailsToggle==="one" && me.viewRecAs==='list'){
              record.setRecordDetails(!record.showDetails);
            }
            if(me.detailsToggle==="zoom"){
              me.browser.updateRecordDetailPanel(record);
            }
          });

        // Insert the content
        newRecords.append("div").attr("class","content")
          .html(function(record){ return record._valueCache[mainSummaryID]; });

        // Fixes ordering problem when new records are made visible on the list
        // TODO: Try to avoid this.
        this.DOM.recordGroup.selectAll(".kshfRecord").order();
      }

      if(this.viewRecAs==='nodelink' || this.viewRecAs==='scatter'){
        newRecords.attr("r",4);
      }

      // Call the onDOM function for all the records that have been inserted to the page
      if(this.config.onDOM) {
        newRecords.each(function(record){ me.config.onDOM.call(record.data,record); });
      }

      this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord");

      if(this.viewRecAs==='map') {
        this.recMap_zoomToActive();
        this.recMap_projectRecords();
        this.refreshRecordColors();
      } else if(this.viewRecAs==='nodelink'){
        this.refreshRecordColors();
      } else if(this.viewRecAs==='scatter'){
        // Nothing...
      } else {
        this.DOM.recordSortValue    = this.DOM.recordGroup.selectAll(".recordSortValue");
        this.DOM.recordRanks        = this.DOM.recordGroup.selectAll(".recordRank");
        this.DOM.recordToggleDetail = this.DOM.recordGroup.selectAll(".recordToggleDetail");
      }

      this.updateRecordVisibility();
    },
    /** -- */
    showMoreRecordsOnList: function(){
      if(this.viewRecAs==='map' || this.viewRecAs==='nodelink' || this.viewRecAs==='scatter') return;
      this.DOM.showMore.attr("showMoreVisible",false);
      this.maxVisibleItems += Math.min(this.maxVisibleItems,250);
      this.refreshRecordDOM();
    },
    /** Sort all records given the active sort option
     *  Records are only sorted on init & when active sorting option changes.
     *  They are not resorted on filtering. ** Filtering does not affect record sorting.
     */
    sortRecords: function(){
      var sortValueFunc = this.sortAttrib.summaryFunc;
      var sortFunc = this.sortAttrib.sortFunc;
      var inverse = this.sortAttrib.sortInverse;

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
    /** -- */
    updateRecordVisibility: function(){
      var me = this;
      if(this.DOM.kshfRecords===undefined) return;

      if(this.viewRecAs==='map' || this.viewRecAs==='nodelink' || this.viewRecAs==='scatter'){
        this.DOM.kshfRecords.each(function(record){
          this.style.opacity = record.isWanted?0.9:0.2;
          this.style.pointerEvents = record.isWanted?"":"none";
          this.style.display = "block"; // Have this bc switching views can invalidate display
        });
      } else { // list or grid
        var visibleItemCount=0;
        this.DOM.kshfRecords.each(function(record){
          var recordIsVisible = (record.recordRank>=0) && (record.recordRank<me.maxVisibleItems);
          if(recordIsVisible) visibleItemCount++;
          this.style.display = recordIsVisible?null:'none';
        });
        this.DOM.showMore.select(".CountAbove").html("&#x25B2;"+visibleItemCount+" shown");
        this.DOM.showMore.select(".CountBelow").html((this.browser.recordsWantedCount-visibleItemCount)+" below&#x25BC;");
      };
      if(this.viewRecAs==='nodelink'){
        this.DOM.recordLinks.each(function(link){
          this.style.display = (!link.source.isWanted || !link.target.isWanted) ? "none" : null;
        });
      } 
    },
    /** -- */
    updateAfterFilter: function(){
      if(this.recordViewSummary===null) return;
      if(this.viewRecAs==='map') {
        this.updateRecordVisibility();
        //this.recMap_zoomToActive();
      } else if(this.viewRecAs==='nodelink') {
        this.updateRecordVisibility();
      } else if(this.viewRecAs==='scatter') {
        this.updateRecordVisibility();
      } else {
        var me=this;
        var startTime = null;
        var scrollDom = this.DOM.recordGroup.node();
        var scrollInit = scrollDom.scrollTop;
        var easeFunc = d3.easeCubic;
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
    getScatterAttributes: function(){
      var me=this;
      return this.sortingOpts.filter(function(s){ 
        return s.scaleType!=='time' && s.summaryID!==me.sortAttrib.summaryID;
      });
    },
    /** -- */
    viewAs: function(_type){
      this.viewRecAs = _type.toLowerCase();
      this.DOM.root.attr("displayType", this.viewRecAs);

      if(this.recordViewSummary===null) return;

      var viewAsOptions = { List: true }; // list-view is always available
      if(this.config.geo)    viewAsOptions.Map = true;
      if(this.linkBy.length) viewAsOptions.NodeLink = true;
      viewAsOptions.Scatter = this.getScatterAttributes();

      this.DOM.root.select(".recordDisplay_ViewAsList")    
        .style("display", "inline-block");
      this.DOM.root.select(".recordDisplay_ViewAsMap")     
        .style("display", (viewAsOptions.Map) ? "inline-block" : null );
      this.DOM.root.select(".recordDisplay_ViewAsNodeLink")
        .style("display", (viewAsOptions.NodeLink) ? "inline-block" : null );
      this.DOM.root.select(".recordDisplay_ViewAsScatter") 
        .style("display", (viewAsOptions.Scatter.length>0) ? "inline-block" : null );

      this.browser.DOM.root.attr("recordEncoding",this.getRecordEncoding()); // "sort" / "color"

      this.DOM.recordDisplayHeader.select(".recordDisplay_ViewGroup")
        .style("display",
          (viewAsOptions.Map || viewAsOptions.NodeLink || viewAsOptions.Scatter.length>0 ) 
            ? "inline-block" 
            : null
        );

      switch(this.viewRecAs){
        case 'list':
        case 'grid':
          this.initDOM_ListView();
          this.sortRecords();
          this.refreshRecordDOM();
          this.setSortColumnWidth(this.sortColWidth || 50); // default: 50px;
          this.DOM.kshfRecords = this.DOM.recordGroup_List.selectAll(".kshfRecord");
          break;
        case 'map':
          this.initDOM_MapView();
          this.refreshRecordDOM();
          this.refreshRecordColors();
          break;
        case 'nodelink':
          this.initDOM_NodeLinkView();
          this.setNodeLink();
          this.refreshRecordDOM();
          this.refreshRecordColors();
          this.nodelink_restart();
          break;
        case 'scatter':
          if(this.scatterAttrib===null){
            this.setScatterAttrib(viewAsOptions.Scatter[0]);
          }
          this.initDOM_ScatterView();
          this.refreshRecordDOM();
          this.refreshScatterVis();
          this.resetScatterZoom();
          this.refreshQueryBox_Filter();
          break;
      }

      if(this.nodelink_Force && this.viewRecAs!=='nodelink') {
        this.nodelink_Force.stop();
        this.DOM.root.attr("NodeLinkState","stopped");
        this.DOM.root.classed("hideLinks",null);
      }

      // set style after initializing dom...
      this.DOM.root.select(".LinkControl-LinkAttrib").style("display", this.linkBy.length ? "inline-block" : "none");

      this.updateRecordVisibility();

      this.DOM.kshfRecords.each(function(record){ record.DOM.record = this; });
    },
    /** -- */
    exportConfig: function(){
      var c={};
      if(this.textSearchSummary){
        c.textSearch = this.textSearchSummary.summaryName;
      }
      if(typeof(this.recordViewSummary.summaryColumn)==="string"){
        c.recordView = this.recordViewSummary.summaryColumn;
      } else {
        c.recordView = this.recordViewSummary.summaryFunc.toString(); // converts function to string
      }

      c.displayType = this.viewRecAs;
      if(this.sortAttrib)    c.sortBy    = this.sortAttrib   .summaryName;
      if(this.scatterAttrib) c.scatterBy = this.scatterAttrib.summaryName;
      if(this.colorAttrib)   c.colorBy   = this.colorAttrib  .summaryName;
      c.sortColWidth = this.sortColWidth;
      c.detailsToggle = this.detailsToggle;
      return c;
    }
};

/** 
 * @constructor
 */
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
      if(summary instanceof kshf.Summary_Categorical)
        this.updateWidth_MeasureLabel();
    } else { // summary was in the panel. Change position
      this.summaries.splice(curIndex,1);
      this.summaries.splice(index,0,summary);
    }
    this.summaries.forEach(function(s,i){ s.panelOrder = i; });
    this.addDOM_DropZone(summary.DOM.root.node());
    this.refreshAdjustWidth();
  },
  /** -- */
  removeSummary: function(summary){
    var indexFrom = -1;
    this.summaries.forEach(function(s,i){ if(s===summary) indexFrom = i; });
    if(indexFrom===-1) return; // given summary is not within this panel

    var toRemove = this.DOM.root.selectAll(".dropZone_between_wrapper").nodes()[indexFrom];
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
          movedSummary.DOM.root.node().nextSibling.style.display = "";
          movedSummary.DOM.root.node().previousSibling.style.display = "";
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
            movedSummary.DOM.root.node().nextSibling.style.display = "";
            movedSummary.DOM.root.node().previousSibling.style.display = "";
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
          me.browser.updateMiddlePanelWidth();
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
      if(summary instanceof kshf.Summary_Categorical) 
        summary.refreshLabelWidth();
    });
    this.setWidthCatBars(this.width_catBars+widthDif);
  },
  /** -- */
  setWidthCatBars: function(_w_,up){
    _w_ = Math.max(_w_,0);
    this.width_catBars = _w_;
    this.hideBarAxis = _w_<=20;

    this.DOM.root
      .attr("hideBars", _w_<=5 ? true : null)
      .attr("hideBarAxis", this.hideBarAxis ? true : null);
    this.updateSummariesWidth(up);
  },
  /** --- */
  updateSummariesWidth: function(up){
    this.summaries.forEach(function(summary){ 
      if(up && !(summary instanceof kshf.Summary_Categorical)) return;
      summary.refreshWidth();
    });
  },
  /** --- */
  updateWidth_MeasureLabel: function(){
    var maxTotalCount = d3.max(this.summaries, function(summary){
      if(summary.type!=="categorical") return 0; // only align categorical summaries
      if(summary.getMaxAggr===undefined) return 0;
      return summary.getMaxAggr('Total');
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
        if(summary instanceof kshf.Summary_Categorical) summary.refreshLabelWidth();
      });
      var v = _w_total_ - this.width_catLabel - this.width_catMeasureLabel - kshf.scrollWidth;
      this.setWidthCatBars(v, true); // should not update interval summary width
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
  this.asyncDataLoadedCnt = 0;
  this.asyncDataWaitedCnt = 0;

  this.mapColorTheme = "converge";
  this.measureFunc = "Count";

  this.mouseSpeed = 0; // includes touch-screens...

  this.noAnim = false;

  this.measureLabelType = "Active";

  this.domID = options.domID;

  this.thumbvizSortFunction = function(summary_A,summary_B){
    var a_cat = summary_A instanceof kshf.Summary_Categorical;
    var b_cat = summary_B instanceof kshf.Summary_Categorical;
    if(a_cat && !b_cat) return -1;
    if(!a_cat && b_cat) return 1;
    if(a_cat && b_cat && summary_A._aggrs && summary_B._aggrs){ 
      return summary_A._aggrs.length - summary_B._aggrs.length;
    }
    return summary_A.summaryName.localeCompare(summary_B.summaryName, { sensitivity: 'base' });
  };

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

  this.highlightSelectedSummary = null;
  this.highlightCrumbTimeout_Hide = undefined;

  this.crumb_Highlight = new kshf.BreadCrumb(this,"Highlight");
  this.crumb_Compare_A = new kshf.BreadCrumb(this,"Compare_A");
  this.crumb_Compare_B = new kshf.BreadCrumb(this,"Compare_B");
  this.crumb_Compare_C = new kshf.BreadCrumb(this,"Compare_C");

  this.allRecordsAggr     = new kshf.Aggregate();
  this.flexAggr_Highlight = new kshf.Aggregate();
  this.flexAggr_Compare_A = new kshf.Aggregate();
  this.flexAggr_Compare_B = new kshf.Aggregate();
  this.flexAggr_Compare_C = new kshf.Aggregate();

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
  var rootDomNode = this.DOM.root.node();
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
    setTimeout( function(){ 
      if(me.needToRefreshLayout){
        me.updateLayout_Height();
        me.needToRefreshLayout = false;
      }
    }, 1500); // update layout after 1.5 seconds
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
      //if(v===this.noAnim) return;
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
    setRecordName: function(v){
      this.recordName = v;
      this.DOM.recordName.html(this.recordName);
      if(this.recordDisplay && this.recordDisplay.recordViewSummary){
        this.recordDisplay.DOM.recordDisplayName.html('<i class="fa fa-angle-down"></i> '+this.recordName);
      }
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
    createFilter: function(_type, _parent){
      var newFilter;
      switch(_type){
        case 'categorical': 
          newFilter = new kshf.Filter_Categorical(this, _parent); break;
        case 'interval': 
          newFilter = new kshf.Filter_Interval(this, _parent); break;
        case 'text': 
          newFilter = new kshf.Filter_Text(this, _parent); break;
        case 'spatial': 
          newFilter = new kshf.Filter_Spatial(this, _parent); break;
      }
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
        .styles({ left: "0px", top: "0px" });
      this.DOM.measureSelectBox.append("div").attr("class","measureSelectBox_Close fa fa-times-circle")
        .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'e', title: kshf.lang.cur.Close }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.closeMeasureSelectBox(); });
      this.DOM.measureSelectBox.append("div").attr("class","measureSelectBox_Header")
        .text(kshf.lang.cur.ChangeMeasureFunc)
        .on("mousedown", function (d, i) {
          me.DOM.root.attr("pointerEvents",false);

          var initPos = d3.mouse(d3.select("body").node());
          var DOM = me.DOM.measureSelectBox.node();
          var initX = parseInt(DOM.style.left);
          var initY = parseInt(DOM.style.top);
          var boxWidth  = DOM.getBoundingClientRect().width;
          var boxHeight = DOM.getBoundingClientRect().height;
          var maxWidth  = me.DOM.root.node().getBoundingClientRect().width  - boxWidth;
          var maxHeight = me.DOM.root.node().getBoundingClientRect().height - boxHeight;
          me.DOM.root.attr("drag_cursor","grabbing");

          d3.select("body").on("mousemove", function() {
            var newPos = d3.mouse(d3.select("body").node());
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
          {v:"Count", l:"Number"},
          {v:"Sum", l:"Sum"},
          {v:"Avg", l:"Average"},
        ]).enter()
        .append("div").attr("class", function(d){ return "measureFunctionType measureFunction_"+d.v})
        .html(function(d){ return d.l; })
        .on("click",function(d){
          if(d.v==="Count"){
            me.DOM.measureSelectBox.select(".sdsso23oadsa").attr("disabled","true");
            me.setMeasureMetric(); // no summary, will revert to count
            return;
          }
          this.setAttribute("selected","");
          me.DOM.measureSelectBox.select(".sdsso23oadsa").attr("disabled",null);
          me.setMeasureMetric(d.v, me.DOM.sdsso23oadsa.node().selectedOptions[0].__data__);
        });

      this.DOM.sdsso23oadsa = m.append("div").attr("class","measureSelectBox_Content_Summaries")
        .append("select").attr("class","sdsso23oadsa")
        .attr("disabled",this.measureFunc==="Count"?"true":null)
        .on("change",function(){
          me.setMeasureMetric(me.measureFunc, this.selectedOptions[0].__data__);
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
      this.DOM.measureSelectBox_Wrapper.attr("showMeasureBox",null); // Close box
      this.DOM.measureSelectBox = undefined;
      var d = this.DOM.measureSelectBox_Wrapper.node();
      while (d.hasChildNodes()) d.removeChild(d.lastChild);
    },
    /** -- */
    refreshMeasureSelectAction: function(){
      this.DOM.measureFuncSelect.attr('changeMeasureBox', (this.getMeasurableSummaries().length!==0)? 'true' : null);
    },
    /** -- */
    insertDOM_PanelBasic: function(){
      var me=this;

      this.DOM.panel_Basic = this.DOM.panel_Wrapper.append("div").attr("class","panel_Basic");

      this.DOM.measureSelectBox_Wrapper = this.DOM.panel_Basic.append("span").attr("class","measureSelectBox_Wrapper");

      this.DOM.measureFuncSelect = this.DOM.panel_Basic.append("span")
        .attr("class","measureFuncSelect fa fa-cubes")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'nw', title: kshf.lang.cur.ChangeMeasureFunc }); })
        .on("mouseenter",function(){
          if(me.authoringMode || me.getMeasurableSummaries().length===0) return;
          this.tipsy.show(); 
        })
        .on("mouseleave",function(){ this.tipsy.hide(); })
        .on("click",function(){
          this.tipsy.hide();
          if(me.DOM.measureSelectBox) {
            me.closeMeasureSelectBox();
            return;
          }
          me.insertDOM_measureSelect();
          me.DOM.measureSelectBox_Wrapper.attr("showMeasureBox",true);
        });
      
      this.DOM.recordInfo = this.DOM.panel_Basic.append("span")
        .attr("class","recordInfo")
        .attr("edittitle",false);

      this.DOM.activeRecordMeasure = this.DOM.recordInfo.append("span").attr("class","activeRecordMeasure");
      this.DOM.measureFuncType     = this.DOM.recordInfo.append("span").attr("class","measureFuncType");

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
          me.setRecordName(this.textContent);
        })
        .on("keyup"   ,function(){ d3.event.stopPropagation(); })
        .on("keypress",function(){ d3.event.stopPropagation(); })
        .on("keydown",function(){
          if(event.keyCode===13){ // ENTER
            this.parentNode.setAttribute("edittitle",false);
            this.setAttribute("contenteditable", false);
            me.setRecordName(this.textContent);
          }
          d3.event.stopPropagation();
        })
        .on("click",function(){
          this.tipsy.hide();
          var curState=this.parentNode.getAttribute("edittitle");
          if(curState===null || curState==="false"){
            this.parentNode.setAttribute("edittitle",true);
            var parentDOM = d3.select(this.parentNode);
            var v=parentDOM.select(".recordName").node();
            v.setAttribute("contenteditable",true);
            v.focus();
          } else {
            this.parentNode.setAttribute("edittitle",false);
            var parentDOM = d3.select(this.parentNode);
            var v=parentDOM.select(".recordName").node();
            v.setAttribute("contenteditable",false);
            me.setRecordName(this.textContent);
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
          if(d3.select("#demo_PageTitle").node()){
            description = d3.select("#demo_PageTitle").html();
          }

          var githubLoad = {
            description: description,
            public: kshf.gistPublic,
            files: { "kshf_config.json": { content: c }, }
          };
          // Add style file, if custom style exists
          var badiStyle = d3.select("#kshfStyle");
          if(badiStyle.node()!==null){
            githubLoad.files["kshf_style.css"] = { content: badiStyle.text()};
          }

          function gist_createNew(){
            var xhr = d3.request('https://api.github.com/gists');
            if(kshf.gistLogin) xhr.header("Authorization","token "+kshf.githubToken);
            xhr.post( JSON.stringify(githubLoad), // data
                function(error, data){ 
                  var response = JSON.parse(data.response);
                  // Keep Gist Info (you may edit/fork it next)
                  kshf.gistInfo = response;
                  var gistURL = response.html_url;
                  var gistID = gistURL.replace(/.*github.*\//g,'');
                  var keshifGist = "keshif.me/gist?"+gistID;
                  me.showWarning(
                    "The browser is saved to "+
                    "<a href='"+gistURL+"' target='_blank'>"+gistURL.replace("https://","")+"</a>.<br> "+
                    "To load it again, visit <a href='http://"+keshifGist+"' target='_blank'>"+keshifGist+"</a>"
                    );
                });
          };
          function gist_sendEdit(){
            var xhr = d3.request('https://api.github.com/gists/'+kshf.gistInfo.id);
            if(kshf.gistLogin) xhr.header("Authorization","token "+kshf.githubToken);
            xhr.send('PATCH',JSON.stringify(githubLoad),
              function(error, data){ 
                var response = JSON.parse(data.response);
                var gistURL = response.html_url;
                var gistID = gistURL.replace(/.*github.*\//g,'');
                var keshifGist = "keshif.me/gist?"+gistID;
                me.showWarning(
                  "The browser is edited in "+
                  "<a href='"+gistURL+"' target='_blank'>"+gistURL.replace("https://","")+"</a>.<br> "+
                  "To load it again, visit <a href='http://"+keshifGist+"' target='_blank'>"+keshifGist+"</a>"
                  );
              });
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
            var xhr = d3.request('https://api.github.com/gists'+kshf.gistInfo.id+"/forks");
            if(kshf.gistLogin) xhr.header("Authorization","token "+kshf.githubToken);
            xhr.post( JSON.stringify(githubLoad), // data
                function(error, data){ 
                  kshf.gistInfo = JSON.parse(data.response); // ok, now my gist
                  gist_sendEdit();
                });
          } else{
            // AUTHORIZED, EXISTING GIST, MY GIST
            if(kshf.gistInfo.owner.login === kshf.gistLogin){
              gist_sendEdit();
            }
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
      // Notification
      this.DOM.notifyButton = rightBoxes.append("span").attr("class","notifyButton fa fa-bell")
        .each(function(){ 
          this.tipsy = new Tipsy(this, { gravity: 'n', title: ""}); 
        })
        .on("mouseenter", function(){ 
          this.tipsy.options.title = ""+
            "<u>See Tip</u><br>"+
            me.helpin.getTopicTitle(me.helpin.notifyAction.topic)+"<br>"+
            "<div style='font-size: 0.9em; padding-top: 6px;'>Shift+Click to dismiss</div>";
          this.tipsy.show();
        })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide();
          if(me.helpin) {
            if(d3.event.shiftKey){
              me.helpin.clearNotification();
            } else {
              me.helpin.showNotification();
            }
          }
        });
      // Help
      this.DOM.showHelpIn = rightBoxes.append("span").attr("class","showHelpIn fa fa-question-circle")
        .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'n', title: kshf.lang.cur.Help }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide();
          if(me.helpin){
            if(exp_basis){
              me.helpin.showTopicListing();
            } else if(exp_helpin || exp_train){
              me.helpin.showOverlayOnly();
            } else {
              me.helpin.showPointNLearn();
            }
          }else{
            alert("We are working on offering you the best help soon.");
          }
        });

      // Fullscreen
      this.DOM.viewFullscreen = rightBoxes.append("span").attr("class","fa fa-arrows-alt viewFullscreen")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.ShowFullscreen }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); me.showFullscreen();});
      // Info & Credits
      var x = rightBoxes.append("span").attr("class","logoHost")//.attr("class","fa fa-info-circle")
        .html(kshf.kshfLogo)
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.ShowInfoCredits }); })
        .on("mouseenter", function(){ this.tipsy.show(); })
        .on("mouseleave", function(){ this.tipsy.hide(); })
        .on("click",      function(){ this.tipsy.hide(); 
          me.showCredits();
          me.panel_overlay.attr("show","infobox");
        });

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
      var totalScale = d3.scaleLinear()
        .domain([0, this.allRecordsAggr.measure(this.ratioModeActive ? 'Active' : 'Total') ])
        .range([0, this.getWidth_Browser()])
        .clamp(true);

      var totalC = this.getActiveCompareSelCount();
      totalC++; // 1 more for highlight

      var VizHeight = 8;
      var curC = 0;
      var stp = VizHeight / totalC;

      this.DOM.totalGlyph.style("transform",function(d){
        if(d==="Total" || d==="Highlight" || d==="Active"){
          return "scale("+totalScale(me.allRecordsAggr.measure(d))+","+VizHeight+")";
        } else {
          curC++;
          return "translateY("+(stp*curC)+"px) scale("+totalScale(me.allRecordsAggr.measure(d))+","+stp+")";
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
    },
    /* -- */
    insertDOM_Infobox: function(){
        var me=this;

        this.panel_overlay = this.DOM.root.append("div").attr("class", "panel_overlay");

        // BACKGROUND 
        this.DOM.kshfBackground = this.panel_overlay.append("div").attr("class","kshfBackground")
          .on("click",function(){
            var activePanel = this.parentNode.getAttribute("show");
            if(activePanel==="recordDetails" || activePanel==="infobox" || activePanel==="help-browse"){
              me.panel_overlay.attr("show","none");
            }
          });

        // LOADING BOX
        this.DOM.loadingBox = this.panel_overlay.append("div").attr("class","overlay_content overlay_loading");
        var ssdsd = this.DOM.loadingBox.append("span").attr("class","spinner")
          .selectAll(".spinner_x").data([1,2,3,4,5]).enter()
            .append("span").attr("class",function(d){ return "spinner_x spinner_"+d; });
        var hmmm=this.DOM.loadingBox.append("div").attr("class","status_text");
        hmmm.append("span").attr("class","status_text_sub info").html(
          kshf.lang.cur.LoadingData);
        this.DOM.status_text_sub_dynamic = hmmm.append("span").attr("class","status_text_sub dynamic");
        hmmm.append("button")
          .attr("id","kshf-Sheets-Auth-Button")
          .styles({visibility: "hidden", display: 'block', margin: '0 auto'})
          .text("Authorize");

        // CREDITS 
        this.DOM.overlay_infobox = this.panel_overlay.append("div").attr("class","overlay_content overlay_infobox");
        this.DOM.overlay_infobox.append("div").attr("class","overlay_Close fa fa-times fa-times-circle")
          .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.Close }); })
          .on("mouseenter",function(){ this.tipsy.show(); })
          .on("mouseleave",function(){ this.tipsy.hide(); })
          .on("click",function(){ this.tipsy.hide(); me.panel_overlay.attr("show","none"); });

        this.insertSourceBox();

        // RECORD DETAILS 
        this.DOM.overlay_recordDetails = this.panel_overlay.append("span").attr("class","overlay_content overlay_recordDetails");
        this.DOM.overlay_recordDetails.append("div").attr("class","overlay_Close fa fa-times-circle")
          .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.Close }); })
          .on("mouseenter",function(){ this.tipsy.show(); })
          .on("mouseleave",function(){ this.tipsy.hide(); })
          .on("click",function(){ me.panel_overlay.attr("show","none"); });
        this.DOM.overlay_recordDetails_content = this.DOM.overlay_recordDetails.append("span").attr("class","content");

        // HELP
        this.panel_overlay.append("span").attr("class","overlay_content overlay_help");
    },
    /** -- */
    showCredits: function(){
      if(this.creditsInserted) return;
      this.DOM.overlay_infobox.append("div").html(
        "<div class='infobox-header'>"+
          kshf.kshfLogo +
          "<a href='https://www.facebook.com/keshifme' target='_blank' class='fa fa-facebook socialMedia' style='color: #4c66a4;'></a>"+
          "<a href='https://www.twitter.com/keshifme' target='_blank' class='fa fa-twitter socialMedia' style='color: #00aced;'></a>"+
          "<a href='https://www.github.com/adilyalcin/keshif' target='_blank' class='fa fa-github socialMedia' style='color: black;'></a>"+

          "<a target='_blank' href='http://www.keshif.me' class='libName'>" +
            " Keshif</a><br><span style='font-weight:300; font-size: 0.9em;'>Data Made Explorable</span>"+
          "</div>" +

        "<div class='boxinbox' style='padding: 0px 15px'>" +
        "Contact: <b> info <i class='fa fa-at'></i> keshif.me </b> <br>" +
        " <div style='font-weight: 300; font-size: 0.9em;'>( Press, custom development and deployments, new features, training )</div>" +
        "</div>" +

        "<div class='boxinbox' style='margin: 10px 25px'>" +
        "<a href='https://groups.google.com/forum/#!forum/keshif' target='_blank'>Users Group Maillist</a>" +
        "</div>" +

        "<div style='font-weight: 300; font-size: 0.8em; margin: 5px;'><b>License:</b> "+
          "<a href='https://github.com/adilyalcin/Keshif/blob/master/LICENSE' target='_blank'>"+
            "BSD 3 clause (c) Uni. of Maryland</a></div>" + 

      "<div class='boxinbox' style='font-size: 0.8em; font-weight: 200'>" +
        " 3rd party libraries used: " +
        " <a style='color:black;' href='http://d3js.org/' target='_blank'>D3</a>, " +
        " <a style='color:black;' href='http://leafletjs.com/' target='_blank'>Leaflet</a>, " +
        " <a style='color:black;' href='http://github.com/dbushell/Pikaday' target='_blank'>Pikaday</a> " +
        //" <a style='color:black;' href='https://developers.google.com/chart/' target='_blank'>Google JS APIs</a>"+
      "</div>"
      );
      this.creditsInserted = true;
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
          .on("keydown",function(){ d3.event.stopPropagation(); })
          .on("keypress",function(){ d3.event.stopPropagation(); })
          .on("keyup",function(){
            d3.event.stopPropagation();
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
                  gdocLink_ready.attr("ready",null);
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
                  gdocLink_ready.attr("ready",null);
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
                  gdocLink_ready.attr("ready",null);
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
            var extension = localFile.name.split(".").pop();
            switch(extension){
              case "json": // json
              //case "application/json": // json
                localFile.fileType = "json";
                localFile.name = localFile.name.replace(".json","");
                break;

              case "csv":
//              case "text/csv": // csv
//              case "text/comma-separated-values":
//              case "application/csv":
//              case "application/excel":
//              case "application/vnd.ms-excel":
//              case "application/vnd.msexcel":
                localFile.fileType = "csv";
                localFile.name = localFile.name.replace(".csv","");
                break;

              case "tsv":
//              case "text/tab-separated-values":  // tsv
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
          .on("keydown",function(){ d3.event.stopPropagation(); })
          .on("keypress",function(){ d3.event.stopPropagation(); })
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
                  tables: {
                    name:sourceSheet, 
                    id:sheetID
                  }
                });
                break;
              case "GoogleDrive":
                me.loadSource({
                  dirPath: sourceURL,
                  fileType: DOMfileType.node().value,
                  tables: {name:sourceSheet, id:sheetID}
                });
                break;
              case "Dropbox":
                me.loadSource({
                  dirPath: sourceURL,
                  fileType: DOMfileType.node().value,
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
          me.DOM.attribTextSearchControl.attr("showClear",false).node().value="";
          me.summaries.forEach(function(summary){
            if(summary.DOM.nugget===undefined) return;
            summary.DOM.nugget.attr("filtered",false);
          });
        });
      this.DOM.attribTextSearch.append("input")
        .attr("class","summaryTextSearchInput")
        .attr("type","text")
        .attr("placeholder",kshf.lang.cur.Search)
        .on("keydown",function() { d3.event.stopPropagation(); })
        .on("keypress",function(){ d3.event.stopPropagation(); })
        .on("keyup",function()   { d3.event.stopPropagation(); })
        .on("input",function(){
          if(this.timer) clearTimeout(this.timer);
          var x = this;
          var qStr = x.value.toLowerCase();
          me.DOM.attribTextSearchControl.attr("showClear", (qStr!=="") )
          this.timer = setTimeout( function(){
            me.summaries.forEach(function(summary){
              if(summary.DOM.nugget===undefined) return;
              summary.DOM.nugget.attr("filtered",(summary.summaryName.toLowerCase().indexOf(qStr)===-1));
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

      this.DOM.attributePanel.append("div").attr("class","newAttribute").html("<i class='fa fa-plus-square'></i>")
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

    },
    /** -- */
    updateRecordDetailPanel: function(record){
      var str="";
      if(this.recordDisplay.config && this.recordDisplay.config.onDetail){
        str = this.recordDisplay.config.onDetail.call(record.data, record);
      } else {
        for(var column in record.data){
          var v=record.data[column];
          if(v===undefined || v===null) continue;
          var defaultStr = "<b>"+column+":</b> "+ v.toString()+"<br>";
          var s = this.summaries_by_name[column];
          if(s){
            if(s instanceof kshf.Summary_Categorical){
              if(s.catLabel_table){
                str += "<b>"+column+":</b> "+ s.catLabel_table[v] + "<br>";
              } else {
                str += defaultStr;
              }
            } else if(s instanceof kshf.Summary_Interval){
              str += "<b>"+column+":</b> "+ s.printWithUnitName(v)+"<br>";
            }
          } else {
            str += defaultStr;
          }
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
      var elem = this.DOM.root.node();
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

      if(typeof this.source.callback === "string"){
        eval("\"use strict\"; this.source.callback = "+this.source.callback);
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
        if(this.source.callback) this.source.callback.call(this,this);
      }
    },
    /** -- */
    loadTable_Google: function(sheet){
      var me=this;
      var headers = sheet.headers ? sheet.headers : 1;
      var qString='https://docs.google.com/spreadsheets/d/'+this.source.gdocId+'/gviz/tq?headers='+headers;
      if(sheet.sheetID){
        qString+='&gid='+sheet.sheetID;
      } else {
        qString+='&sheet='+sheet.name;
      }
      if(sheet.range){
        qString+="&range="+sheet.range;
      }

      var sheetName = sheet.name;

      var googleQuery;

      var getWithAuth = function(){
        gapi.load("client", function(){
          gapi.auth.authorize(
            { client_id: googleClientID, 
              scope: 'https://spreadsheets.google.com/feeds', 
              immediate: true
            },
            function(authResult) {
              var authorizeButton = document.getElementById('kshf-Sheets-Auth-Button');
              if (authResult && !authResult.error) {
                if(authorizeButton) authorizeButton.style.visibility = 'hidden';
                doQuery();
              } else if(authorizeButton){
                alert("Please click the Authorize button");
                authorizeButton.style.visibility = '';
                authorizeButton.onclick = function(event) {
                  gapi.auth.authorize(
                    { client_id: googleClientID, 
                      scope: 'https://spreadsheets.google.com/feeds',
                      immediate: false },
                    function(authResult){
                      if (authResult && !authResult.error) doQuery();
                    });
                  return false;
                };
              }
            }
          );
        });
      }

      kshfHandleGoogleSheetResponse = function(response){
        if(response.status==="error"){
          if(response.errors[0].reason==="access_denied"){
            // need to run it in authenticated mode
            getWithAuth();
          }
        } else {
          if(kshf.dt[sheetName]){
            me.incrementLoadedTableCount();
            return;
          }
          if(response.isError()) {
            me.panel_overlay.select("div.status_text .info").text("Cannot load data");
            me.panel_overlay.select("span.spinner").selectAll("span").remove();
            me.panel_overlay.select("span.spinner").append('i').attr("class","fa fa-warning");
            google.visualization.errors.addErrorFromQueryResponse(
              me.panel_overlay.select("div.status_text .dynamic").node(),
              response
              );
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
        }
      };

      function doQuery(){
        var queryString = qString;
        if(sheet.auth){
          queryString += '&access_token=' + encodeURIComponent(gapi.auth.getToken().access_token);
        }
        queryString += '&tqx=responseHandler:kshfHandleGoogleSheetResponse';

        googleQuery = new google.visualization.Query(queryString);
        if(sheet.query) googleQuery.setQuery(sheet.query);
        googleQuery.send(kshfHandleGoogleSheetResponse);
      };


      kshfCheckSheetPrivacy = function(response){
        if(response.status==="error"){
          if(response.errors[0].reason==="access_denied"){
            sheet.auth = true;
            // need to run it in authenticated mode
            getWithAuth();
          }
        } else {
          doQuery();
        }
      };

      if(sheet.auth){
        getWithAuth();
      } else if(this.source.tables.length>1){
        doQuery();
      } else {
        // Do a simple access to see if the response would be an access error.
        var queryString = qString;
        queryString += '&tqx=responseHandler:kshfCheckSheetPrivacy&range=A1:A1';
        var scriptDOM = document.createElement("script");
        scriptDOM.type = "text/javascript";
        scriptDOM.src = queryString;
        document.head.appendChild(scriptDOM);
      }
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
          if(me.source.callback) me.asyncDataWaitedCnt++;
          // TODO: If callback is defined, perform a SYNC request...
          d3.request(this.source.dirPath+tableDescr.name+"."+this.source.fileType)
            .get(function(error, data){ 
              Papa.parse(data.response,config);
              if(me.source.callback) me.asyncDataLoaded();
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
        if(me.source.callback) me.asyncDataWaitedCnt++;
        d3.request(this.source.dirPath+tableDescr.name+".json?dl=0")
          .get(function(error, data){ 
            try { 
              processJSONText(JSON.parse(data.response)); 
              if(me.source.callback) me.asyncDataLoaded();
            }
            catch (e) { alert("JSON Data could not be loaded/parsed correctly."); }
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
          this.source.callback.call(this,this);
        } else {
          this.loadCharts();
        }
      }
    },
    /** -- */
    asyncDataLoaded: function(){
      this.asyncDataLoadedCnt++;
      if(this.asyncDataWaitedCnt===this.asyncDataLoadedCnt){
        this.loadCharts();
      }
    },
    /** -- */
    loadCharts: function(){
      if(this.primaryTableName===undefined){
        alert("Cannot load keshif. Please define primaryTableName.");
        return;
      }
      this.records = kshf.dt[this.primaryTableName];
      
      if(this.recordName==="") {
        this.setRecordName(this.primaryTableName);
      }

      var me=this;
      this.panel_overlay.select("div.status_text .info").text(kshf.lang.cur.CreatingBrowser);
      this.panel_overlay.select("div.status_text .dynamic").text("");
      window.setTimeout(function(){ me._loadCharts(); }, 50);
    },
    /** -- */
    _loadCharts: function(){
      if(this.chartsLoaded) return;
      this.chartsLoaded = true;
        var me=this;

        if(typeof Helpin !== 'undefined'){
          this.helpin = new Helpin(this);
        }

        if(this.onLoad) this.onLoad.call(this);

        this.records.forEach(function(r){ this.allRecordsAggr.addRecord(r); },this);

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

          if( facetDescr.catLabel || 
              facetDescr.catTooltip || 
              facetDescr.catSplit ||
              facetDescr.catTableName || 
              facetDescr.catSortBy || 
              facetDescr.catMap || 
              facetDescr.catHeight)
          {
            facetDescr.type="categorical";
          } else 
          if( facetDescr.scaleType || 
              facetDescr.showPercentile || 
              facetDescr.unitName || 
              facetDescr.skipZero || 
              facetDescr.timeFormat )
          {
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

          summary.sourceDescr = facetDescr;

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
            if(facetDescr.catHeight){
              summary.setHeight_Category(facetDescr.catHeight);
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

            if(facetDescr.skipZero){
              summary.setSkipZero();
            }
          }
        },this);

        this.panels.left.updateWidth_MeasureLabel();
        this.panels.right.updateWidth_MeasureLabel();
        this.panels.middle.updateWidth_MeasureLabel();

        this.recordDisplay = new kshf.RecordDisplay(this,this.options.recordDisplay||{});

        if(this.options.measure) this.options.metric = this.options.measure;

        if(this.options.metric){
          var metric = this.options.metric;
          if(typeof metric === 'string'){
            this.setMeasureMetric("Sum", this.summaries_by_name[metric]);
          } else {
            this.setMeasureMetric(metric.type, this.summaries_by_name[metric.summary]);
          }
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
        this.panels.bottom.updateSummariesWidth();

        this.updateMiddlePanelWidth();

        this.refresh_filterClearAll();

        this.records.forEach(function(record){ record.updateWanted(); });
        this.update_Records_Wanted_Count();

        this.updateAfterFilter();

        this.updateLayout_Height();

        // hide overlay
        this.panel_overlay.attr("show","none");

        this.reorderNuggetList();

        if(this.recordDisplay.viewRecAs==='nodelink'){
          this.recordDisplay.nodelink_restart();
        }

        if(this.onReady) this.onReady();

        if(this.helpin) {
          this.DOM.showHelpIn.node().tipsy.show();
          setTimeout(function(){ me.DOM.showHelpIn.node().tipsy.hide(); }, 5000);
        }

        this.finalized = true;

        setTimeout(function(){ 
          if(me.options.enableAuthoring) me.enableAuthoring(true);
          if(me.recordDisplay.viewRecAs==='map'){
            setTimeout(function(){ me.recordDisplay.recMap_zoomToActive(); }, 1000);
          }
          me.setNoAnim(false);
        },1000);
    },
    /** -- */
    unregisterBodyCallbacks: function(){
      // TODO: Revert to previous handlers...
      d3.select("body")
        .on("mousemove",null)
        .on("mouseup",null)
        .on("keydown.layout",null);
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
      this.summaries = this.summaries.sort(this.thumbvizSortFunction);

      this.DOM.attributeList.selectAll(".nugget")
        .data(this.summaries, function(summary){return summary.summaryID;}).order();
    },
    /** -- */
    autoCreateBrowser: function(){
      this.summaries.forEach(function(summary,i){
        if(summary.uniqueCategories()) return;
        if(summary.type==="categorical" && summary._aggrs.length>1000) return;
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
        longName+=filter.getRichText();
      });

      var catId = summary._aggrs.length;
      var aggr = new kshf.Aggregate_Category(summary, { id: catId, name: longName},"id");
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
      summary._aggrs.push(aggr);

      if(summary._aggrs.length===1){
        summary.init_DOM_Cat();
      }

      summary.updateCats();
      summary.insertCategories();

      if(summary.catSortBy.length===0) summary.setSortingOptions();
      summary.catSortBy_Active.no_resort = false;

      summary.updateCatSorting(0,true,true);
      summary.refreshLabelWidth();
      summary.refreshViz_Nugget();

      summary.panel.updateWidth_MeasureLabel();
      summary.panel.refreshAdjustWidth();

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
    getGlobalActiveMeasure: function(){
      if(this.allRecordsAggr.recCnt.Active===0) return "No";
      var numStr = this.allRecordsAggr.measure('Active').toLocaleString();
      if(this.measureSummary) return this.measureSummary.printWithUnitName(numStr);
      return numStr;
    },
    /** -- */
    refresh_ActiveRecordCount: function(){
      this.DOM.activeRecordMeasure.html(this.getGlobalActiveMeasure());
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
      this.clearSelect_Compare('A');
      this.clearSelect_Compare('B');
      this.clearSelect_Compare('C');
      this.summaries.forEach(function(summary){ summary.updateAfterFilter(); });
      this.recordDisplay.updateAfterFilter();
      this.needToRefreshLayout = true;
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
      this.refreshMeasureLabels("Active");
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

      if(selAggregate===undefined) return;

      if(selAggregate.compared){
        var x=selAggregate.compared;
        this.clearSelect_Compare(selAggregate.compared);
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

      this.clearSelect_Highlight(true);

      this["crumb_"+compId].showCrumb(selAggregate.summary);

      if(this.helpin){
        this.helpin.topicHistory.push(_material._topics.T_SelectCompare);
      }

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
      if(now){
        me.crumb_Highlight.removeCrumb(now);
      } else {
        this.highlightCrumbTimeout_Hide = setTimeout(function(){ 
          this.highlightCrumbTimeout_Hide = undefined;
          me.crumb_Highlight.removeCrumb();
        },1000);
      }

      this.refreshMeasureLabels("Active");
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
      this.refreshMeasureLabels("Highlight");
    },
    /** -- */
    getMeasureFuncTypeText: function(){
      switch(this.measureFunc){
        case 'Count': return "";
        case 'Sum'  : return "Total "  +this.measureSummary.summaryName+" of ";
        case 'Avg'  : return "Average "+this.measureSummary.summaryName+" of ";
      }
    },
    /** -- */
    getMeasureFuncTypeText_Brief: function(){
      switch(this.measureFunc){
        case 'Count': return this.recordName;
        case 'Sum'  : return "Total "  +this.measureSummary.summaryName;
        case 'Avg'  : return "Average "+this.measureSummary.summaryName;
      }
    },
    /** metricType: "Sum" or "Avg" */
    setMeasureMetric: function(metricType, summary){
      if(summary===undefined || summary.type!=='interval' || summary.scaleType==='time'){
        // Clearing measure summary (defaulting to count)
        if(this.measureSummary===undefined) return; // No update
        this.measureSummary = undefined;
        this.records.forEach(function(record){ record.measure_Self = 1; });
        this.measureFunc = "Count";
      } else {
        if(this.measureSummary===summary && this.measureFunc===metricType) return; // No update
        this.measureSummary = summary;
        this.measureFunc = metricType;
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
    getHeight_PanelBasic: function(){
      return Math.max(parseInt(this.DOM.panel_Basic.style("height")),24)+6;
    },
    /** -- */
    updateLayout_Height: function(){
        var me=this;
        var divHeight_Total = parseInt(this.DOM.root.style("height"));

        divHeight_Total-=this.getHeight_PanelBasic();

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
            if(this.recordDisplay.collapsed){
              panelHeight -= this.recordDisplay.DOM.recordDisplayHeader.node().offsetHeight;
            } else {
              panelHeight -= 200; // give 200px for recordDisplay
            }
          } else {
            panelHeight -= this.recordDisplay.DOM.root.node().offsetHeight;
          }
          midPanelHeight = panelHeight - doLayout.call(this,panelHeight, this.panels.middle.summaries);
        }
        this.panels.middle.DOM.root.style("height",midPanelHeight+"px");

        // The part where summary DOM is updated
        this.summaries.forEach(function(summary){ if(summary.inBrowser()) summary.refreshHeight(); });

        if(this.recordDisplay && !this.recordDisplay.collapsed){
          // get height of header
          var listDisplayHeight = divHeight_Total
            - this.recordDisplay.DOM.recordDisplayHeader.node().offsetHeight 
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

      if(this.recordDisplay) this.recordDisplay.setWidth(widthMiddlePanel);
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
        _val = aggr.measure(this.measureLabelType);
        if(this.preview_not){
          _val = this.ratioModeActive ? (aggr.measure('Active')-_val) : (aggr.measure('Total')-_val);
        }
        if(this.percentModeActive){
          // Cannot be Avg-function
          if(aggr._measure.Active===0) return "";
          if(this.ratioModeActive){
            if(this.measureLabelType==="Active") return "";
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
        return this.measureSummary.printWithUnitName(
          kshf.Util.formatForItemCount(_val),
          (aggr.DOM && aggr.DOM.aggrGlyph.nodeName==="g")
        );
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

    this.missingValueAggr = new kshf.Aggregate_EmptyRecords(this);
    this.browser.allAggregates.push(this.missingValueAggr);

    this.DOM = { inited: false};

    if(kshf.Summary_Set && this instanceof kshf.Summary_Set) return;

    this.chartScale_Measure      = d3.scaleLinear().clamp(true);
    this.chartScale_Measure_prev = d3.scaleLinear().clamp(true);

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
    var dom = this.DOM.root.node();
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
      this._height_header = this.DOM.headerGroup.node().offsetHeight;
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
  /** returns the maximum active aggregate value per row in chart data */
  getMaxAggr: function(sType){
    if(this._aggrs===undefined || this.isEmpty()) return 0;
    return d3.max(this._aggrs, function(aggr){ if(aggr.usedAggr) return aggr.measure(sType); }) || 1;
  },
  /** returns the maximum active aggregate value per row in chart data */
  getMinAggr: function(sType){
    if(this._aggrs===undefined || this.isEmpty()) return 0;
    return d3.min(this._aggrs, function(aggr){ if(aggr.usedAggr) return aggr.measure(sType); });
  },
  /** -- */
  getMaxAggr_All: function(){
    var maxMeasureValue = this.getMaxAggr('Active');
    if(this.browser.measureFunc==="Avg"){
      // consider all selections
      ["Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(sType){
        if(!this.browser.vizActive[sType]) return;
        maxMeasureValue = Math.max(maxMeasureValue, this.getMaxAggr(sType));
      },this);
    }
    return maxMeasureValue;
  },
  /** -- */
  getMinAggr_All: function(){
    var minMeasureValue = this.getMinAggr('Active');
    if(this.browser.measureFunc==="Avg"){
      // consider all selections
      ["Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(sType){
        if(!this.browser.vizActive[sType]) return;
        minMeasureValue = Math.min(minMeasureValue, this.getMinAggr(sType));
      },this);
    }
    return minMeasureValue;
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
      var toRemove=this.panel.DOM.root.selectAll(".dropZone_between_wrapper")._groups[0][curIndex];
      toRemove.parentNode.removeChild(toRemove);
    }
    var beforeDOM = this.panel.DOM.root.selectAll(".dropZone_between_wrapper")._groups[0][index];
    if(this.DOM.root){
      this.DOM.root.style("display","");
      panel.DOM.root.node().insertBefore(this.DOM.root.node(),beforeDOM);
    } else {
      this.initDOM(beforeDOM);
    }
    panel.addSummary(this,index);
    this.panel.refreshDropZoneIndex();
    this.refreshThumbDisplay();

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
    this.refreshThumbDisplay();
  },
  /** -- */
  destroy: function(){
    this.browser.destroySummary(this);
    if(this.DOM.root){
      this.DOM.root.node().parentNode.removeChild(this.DOM.root.node());
    }
    if(this.DOM.nugget){
      this.DOM.nugget.node().parentNode.removeChild(this.DOM.nugget.node());
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
      .attr("aggr_initialized", this.aggr_initialized?true:null )
      .on("dblclick",function(){
        me.browser.autoAddSummary(me);
        me.browser.updateLayout();
      })
      .on("mousedown",function(){
        if(d3.event.which !== 1) return; // only respond to left-click

        var _this = this;
        me.attribMoved = false;
        d3.select("body")
          .on("keydown.layout", function(){
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
            var mousePos = d3.mouse(me.browser.DOM.root.node());
            me.browser.DOM.attribDragBox.style("transform",
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
        var summaryName_DOM = parentDOM.select(".summaryName").node();

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
      .on("keyup"   ,function(){ d3.event.stopPropagation(); })
      .on("keypress",function(){ d3.event.stopPropagation(); })
      .on("keydown",function(){
        if(d3.event.keyCode===13){ // ENTER
          this.parentNode.setAttribute("edittitle",false);
          this.setAttribute("contenteditable",false);
          me.browser.changeSummaryName(me.summaryName,this.textContent);
          d3.event.preventDefault();
        }
        d3.event.stopPropagation();
      });

    var X = this.DOM.nugget.append("div").attr("class","thumbIcons");

    X.append("div").attr("class","fa fa-code editCodeButton")
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

    X.append("div").attr("class","splitCatAttribute_Button fa fa-scissors")
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
      });

    X.append("div").attr("class","addFromAttribute_Button fa fa-plus-square")
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

    this.refreshThumbDisplay();
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
  refreshThumbDisplay: function(){
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
      .attr("summary_id",this.summaryID) // can be used to customize a specific summary using CSS
      .each(function(){ this.__data__ = me; });
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
          .on("keydown.layout", function(){
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
            var mousePos = d3.mouse(me.browser.DOM.root.node());
            me.browser.DOM.attribDragBox.style("transform",
              "translate("+(mousePos[0]-20)+"px,"+(mousePos[1]+5)+"px)");
            d3.event.stopPropagation();
            d3.event.preventDefault();
          })
          .on("mouseup", function(){
            d3.select("body").style('cursor',null);
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

    this.DOM.buttonSummaryRemove = header_display_control.append("span")
      .attr("class","buttonSummaryRemove fa fa-times-circle-o")
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

    this.DOM.buttonSummaryCollapse = header_display_control.append("span")
      .attr("class","buttonSummaryCollapse fa fa-compress")
      .each(function(){
        this.tipsy = new Tipsy(this, {
          gravity: function(){ return me.panelOrder!==0?'sw':'nw'; },
          title: kshf.lang.cur.MinimizeSummary
        });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide();
        if(me instanceof kshf.Summary_Set){
          me.setListSummary.setShowSetMatrix(false);
        } else {
          me.setCollapsedAndLayout(true);
        }
      });

    this.DOM.buttonSummaryOpen = header_display_control.append("span")
      .attr("class","buttonSummaryOpen fa fa-expand")
      .each(function(){
        this.tipsy = new Tipsy(this, {
          gravity: function(){ return me.panelOrder!==0?'sw':'nw'; },
          title: kshf.lang.cur.OpenSummary
        });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide();
        if(me instanceof kshf.Summary_Set){
          //me.setListSummary.setShowSetMatrix(false);
        } else {
          me.setCollapsedAndLayout(false);
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
          var v=parentDOM.select(".summaryName_text").node();
          v.setAttribute("contenteditable",true);
          v.focus();
        } else {
          this.parentNode.setAttribute("edittitle",false);
          var parentDOM = d3.select(this.parentNode);
          var v=parentDOM.select(".summaryName_text").node();
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
        var open = me.DOM.root.attr("showConfig")===null;
        if(open){
          if(me.browser.summaryWithOpenConfig){
            // Close the open summary
            me.browser.summaryWithOpenConfig.DOM.root.attr("showConfig",null);
          }
          me.browser.summaryWithOpenConfig = me;
        } else {
          me.browser.summaryWithOpenConfig = undefined;
        }
        me.DOM.root.attr("showConfig",open?true:null);
      });

    this.DOM.summaryIcons.append("span").attr("class", "setMatrixButton fa fa-tags")
      .each(function(d){
        this.tipsy = new Tipsy(this, { 
          gravity: 'ne', 
          title: function(){ return (!me.show_set_matrix?"Show":"Hide")+" pair-wise relations"; }
        });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide(); me.setShowSetMatrix(!me.show_set_matrix); });

    // These shouldn't be visible if there is not active record display.
    this.DOM.summaryIcons.selectAll(".encodeRecordButton").data(["sort","scatter","color"])
      .enter()
      .append("span")
      .attr("class", "encodeRecordButton fa")
      .attr("encodingType",function(t){ return t; })
      .each(function(t){
        this.tipsy = new Tipsy(this, {
          gravity: 'ne', title: function(){ return "Use to "+t+" "+me.browser.recordName; }
        });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(t){ this.tipsy.hide();
        var recDisplay = me.browser.recordDisplay;
        if(t==='scatter'){
          recDisplay.setScatterAttrib(me);
        } else {
          recDisplay.setSortAttrib(me);
          recDisplay.refreshSortingOptions();
        }
      });

    this.DOM.summaryIcons.append("span")
      .attr("class","summaryViewAs_Map fa fa-globe")
      .attr("viewAs",'map')
      .each(function(d){ 
        this.tipsy = new Tipsy(this, { gravity: 'ne', title: function(){ return "View as Map"; } });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide(); me.viewAs('map'); });

    this.DOM.summaryIcons.append("span")
      .attr("class","summaryViewAs_List fa fa-list-ul")
      .attr("viewAs",'map')
      .each(function(d){ 
        this.tipsy = new Tipsy(this, { gravity: 'ne', title: function(){ return "View as List"; } });
      })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide(); me.viewAs('list'); });

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
            return "Label as "+kshf.lang.cur[(me.browser.percentModeActive?'Absolute':'Percent')];
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
              return kshf.lang.cur[me.browser.ratioModeActive?'AbsoluteSize':'PartOfSize']+
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
  setCollapsedAndLayout: function(collapsed){
    this.setCollapsed(collapsed);
    this.browser.updateLayout_Height();
  },
  /** -- */
  setCollapsed: function(collapsed){
    this.collapsed = collapsed;
    if(this.DOM.root){
      this.DOM.root
        .attr("collapsed",this.collapsed?true:null)
        .attr("showConfig",null);
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
        me.browser.setSelect_Highlight(me.missingValueAggr);
      })
      .on("mouseout" ,function(){ 
        this.tipsy.hide();
        me.browser.clearSelect_Highlight();
      })
      .on("click", function(){
        if(d3.event.altKey){
          me.missingValueAggr.filtered = "out";
          me.summaryFilter.addFilter();
          return;
        }
        if(d3.event.shiftKey){
          me.browser.setSelect_Compare(true);
          return;
        }
        if(me.summaryFilter.isFiltered){
          if(me.missingValueAggr.filtered){
            me.summaryFilter.clearFilter();
          } else {
            me.summaryFilter.clearFilter();
            me.missingValueAggr.filtered = "in";
            me.summaryFilter.how = "All";
            me.summaryFilter.addFilter();
          }
        } else {
          me.missingValueAggr.filtered = "in";
          me.summaryFilter.how = "All";
          me.summaryFilter.addFilter();
        }
        d3.select(this).classed("filtered",me.missingValueAggr.filtered);
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
    if(this.scaleType_locked) config.intervalScale = this.scaleType_locked;
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
    if(this.heightCat!==kshf.catHeight){
      config.catHeight = this.heightCat;
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

    this.heightCat = kshf.catHeight;
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
  refreshViz_Nugget: function(force){
    if(this.DOM.nugget===undefined) return;
    if(force===undefined) force=false;
    var nuggetChart = this.DOM.nugget.select(".nuggetChart");

    this.DOM.nugget
      .attr("aggr_initialized",this.aggr_initialized?true:null)
      .attr("datatype",this.getDataType());

    if(!this.aggr_initialized && !force) return;

    if(this.uniqueCategories()){
      this.DOM.nugget.select(".nuggetInfo").html("<span class='fa fa-tag'></span><br>Unique");
      nuggetChart.style("display",'none');
      return;
    }

    nuggetChart.selectAll(".nuggetBar").data([]).exit().remove();

    var totalWidth= 25;
    var maxAggregate_Total = this.getMaxAggr('Total');
    nuggetChart.selectAll(".nuggetBar").data(this._aggrs).enter()
      .append("span").attr("class","nuggetBar")
        .style("width",function(cat){ return totalWidth*(cat.records.length/maxAggregate_Total)+"px"; });

    this.DOM.nugget.select(".nuggetInfo").html(
      "<span class='fa fa-tag"+(this.isMultiValued?"s":"")+"'></span><br>"+
      this._aggrs.length+"<br>rows<br>");
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
    return this.getHeight_WithoutCats() + this._aggrs.length*this.heightCat;
  },
  /** -- */
  getHeight_RangeMin: function(){
    if(this.isEmpty()) return this.getHeight_Header();
    return this.getHeight_WithoutCats() + Math.min(this.catCount_Visible,2)*this.heightCat;
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
    if(!this.areAllCatsInDisplay() || !this.panel.hideBarAxis || this._aggrs.length>4) return 18;
    return 0;
  },
  /** -- */
  getHeight_Content: function(){
    return this.categoriesHeight + this.getHeight_Config() + this.getHeight_Bottom();
  },
  /** -- */
  getHeight_VisibleAttrib: function(){
    return this.catCount_Visible*this.heightCat;
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
    if(this._aggrs && this._aggrs.length===0) return true;
    return this.summaryFunc===undefined;
  },
  /** -- */
  uniqueCategories: function(){
    if(this._aggrs===undefined) return true;
    if(this._aggrs.length===0) return true;
    return 1 === d3.max(this._aggrs, function(aggr){ return aggr.records.length; });
  },
  /** -- */
  scrollBarShown: function(){
    return this.categoriesHeight<this._aggrs.length*this.heightCat;
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
    if(opt.no_resort===undefined) opt.no_resort = (this._aggrs.length<=4);
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

    if(opts){
      this.refreshViz_Nugget(true);
    }
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
    this.DOM.optionSelect.selectAll(".sort_label").remove(); // remove all existing options

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
    if(typeof(this._aggrs[0].id())==="string")
        idCompareFunc = function(a,b){return b.id().localeCompare(a.id());};

    var theSortFunc;
    var sortV = this.catSortBy_Active.value;
    // sortV can only be function. Just having the check for sanity
    if(sortV && typeof sortV==="function"){
      // valueCompareFunc can be based on integer or string comparison
      var valueCompareFunc = function(a,b){return a-b;};
      if(typeof(sortV.call(this._aggrs[0].data, this._aggrs[0]))==="string")
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
        // usedAggr === false => on the bottom
        if(!a.usedAggr &&  b.usedAggr) return  1;
        if( a.usedAggr && !b.usedAggr) return -1;
        // Rest
        var x = b.measure('Active') - a.measure('Active');
        if(x===0) x = b.measure('Total') - a.measure('Total');
        if(x===0) x = idCompareFunc(a,b); // stable sorting. ID's would be string most probably.
        if(inverse) x=-x;
        return x;
      };
    }
    this._aggrs.sort(theSortFunc);

    var lastRank = 0;
    this._aggrs.forEach(function(_cat,i){
      if(_cat.recCnt.Active || _cat.isVisible) {
        _cat.orderIndex = lastRank++;
      } else {
        _cat.orderIndex = -lastRank-1;
      }
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
    if(this.DOM.catLabel)
      this.DOM.catLabel.html(function(cat){ return me.catLabel_Func.call(cat.data); });
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
      this._aggrs.forEach(function(aggr){ aggrs.splice(aggrs.indexOf(aggr),1); },this);
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
    this.summaryFilter = this.browser.createFilter('categorical',this);
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
        var aggr = new kshf.Aggregate_Category(this, record.data, record.idIndex);

        aggrTable_id[aggr.id()] = aggr;
        aggrTable.push(aggr);
        this.browser.allAggregates.push(aggr);
      },this);
    } else {
      mmmm = true;
    }

    this.catTable_id = aggrTable_id;
    this._aggrs = aggrTable;

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

      mapping.forEach(function(d,i){
        var v = mapping[i];
        if(v && typeof v === 'string') mapping[i] = v.trim();
      });

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
          aggr = new kshf.Aggregate_Category(this, {id:v}, 'id');
          aggrTable_id[v] = aggr;
          this._aggrs.push(aggr);
          this.browser.allAggregates.push(aggr);
        }
        record._valueCache[this.summaryID].push(v);
        aggr.addRecord(record);
      },this);

    }, this);

    if(mmmm && hasString){
      this._aggrs.forEach(function(aggr){ aggr.data.id = ""+aggr.data.id; });
    }

    this.isMultiValued = maxDegree>1;
    if(this.DOM.root) this.DOM.root.attr('isMultiValued',this.isMultiValued?true:null);

    this.updateCats();

    this.unselectAllCategories();

    this.refreshViz_EmptyRecords();
  },

  /** -- */
  printAggrSelection: function(aggr){
    return this.catLabel_Func.call(aggr.data);
  },

  // Modified internal dataMap function - Skip rows with 0 active item count
  setMinAggrValue: function(v){
    this.minAggrValue = Math.max(1,v);
    this._aggrs = this._aggrs.filter(function(cat){ return cat.records.length>=this.minAggrValue; },this);
    this.updateCats();
  },
  /** -- */
  updateCats: function(){
    // Few categories. Disable resorting after filtering
    if(this._aggrs.length<=4) {
      this.catSortBy.forEach(function(sortOpt){ sortOpt.no_resort=true; });
    }
    this.showTextSearch = this._aggrs.length>=20;
    this.updateCatCount_Active();
  },
  /** -- */
  updateCatCount_Active: function(){
    this.catCount_Visible = 0;
    this.catCount_NowVisible = 0;
    this.catCount_NowInvisible = 0;
    this._aggrs.forEach(function(cat){
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

    this.DOM.root.attrs({
      filtered_or: 0,
      filtered_and: 0,
      filtered_not: 0,
      isMultiValued: this.isMultiValued?true:null,
      summary_type: 'categorical',
      hasMap: this.catMap!==undefined,
      viewType: this.viewType
    });

    this.insertHeader();

    if(!this.isEmpty()) this.init_DOM_Cat();

    this.setCollapsed(this.collapsed);

    this.DOM.summaryConfig_CatHeight = this.DOM.summaryConfig.append("div")
      .attr("class","summaryConfig_CatHeight summaryConfig_Option");
    this.DOM.summaryConfig_CatHeight.append("span").html("<i class='fa fa-arrows-v'></i> Row Height: ");
    var x = this.DOM.summaryConfig_CatHeight.append("span").attr("class","optionGroup");
    x.selectAll(".configOption").data(
      [ 
        {l:"<i class='fa fa-minus'></i>", v: "minus"},
        {l:"Short",v:18}, 
        {l:"Long", v:35},
        {l:"<i class='fa fa-plus'></i>", v: "plus"},
      ])
      .enter()
      .append("span").attr("class",function(d){ return "configOption pos_"+d.v;})
      .attr("active",function(d){ return d.v===me.heightCat; })
      .html(function(d){ return d.l; })
      .on("click", function(d){ 
        if(d.v==="minus"){
          me.setHeight_Category(me.heightCat-1);
        } else if(d.v==="plus"){
          me.setHeight_Category(me.heightCat+1);
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
          me.scrollTop_cache = me.DOM.aggrGroup.node().scrollTop;

          me.DOM.scrollToTop.style("visibility", me.scrollTop_cache>0?"visible":"hidden");

          me.DOM.chartCatLabelResize.style("top",me.scrollTop_cache+"px");
          me.firstCatIndexInView = Math.floor(me.scrollTop_cache/me.heightCat);
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
          var mouseDown_x = d3.mouse(d3.select("body").node())[0];
          var initWidth = me.panel.width_catLabel;

          d3.select("body").on("mousemove", function() {
            var mouseDown_x_diff = d3.mouse(d3.select("body").node())[0]-mouseDown_x;
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
            me.DOM.aggrGroup, me.DOM.aggrGroup.node().scrollTop+me.heightCat);
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
        .on("keydown", function(){ d3.event.stopPropagation(); })
        .on("keypress",function(){ d3.event.stopPropagation(); })
        .on("keyup",   function(){ d3.event.stopPropagation(); })
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
              me._aggrs.forEach(function(_category){
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
        this.DOM.root.attrs({
          "filtered":     this.isFiltered()?"true":null,
          "filtered_or":  this.summaryFilter.selected_OR .length,
          "filtered_and": this.summaryFilter.selected_AND.length,
          "filtered_not": this.summaryFilter.selected_NOT.length,
        })
      }
    },
    /** -- */
    unselectAllCategories: function(){
      this._aggrs.forEach(function(aggr){
        if(aggr.f_selected() && aggr.DOM.aggrGlyph) aggr.DOM.aggrGlyph.removeAttribute("catselect");
        aggr.set_NONE();
      });
      // TODO: Check why this can cause a problem
      if(this.summaryFilter.selected_All_clear) this.summaryFilter.selected_All_clear();
      if(this.DOM.inited) this.DOM.missingValueAggr.classed("filtered",false);
    },
    /** -- */
    clearCatTextSearch: function(){
      if(!this.showTextSearch) return;
      if(this.skipTextSearchClear) return;
      this.DOM.catTextSearchControl.attr("showClear",false);
      this.DOM.catTextSearchInput.node().value = '';
    },
    /** -- */
    updateChartScale_Measure: function(){
      if(!this.aggr_initialized || this.isEmpty()) return; // nothing to do
      var maxMeasureValue = this.getMaxAggr_All();
      var minMeasureValue = 0;
      if(this.browser.measureFunc!=="Count" && this.browser.measureSummary.intervalRange.org.min<0){
        minMeasureValue = this.getMinAggr_All();
      }

      this.chartScale_Measure_prev
        .domain(this.chartScale_Measure.domain())
        .range (this.chartScale_Measure.range() )
        .nice(this.chartAxis_Measure_TickSkip() )
        .clamp(false);

      this.chartScale_Measure
        .domain([minMeasureValue, maxMeasureValue])
        .range([0, this.getWidth_CatChart()])
        .nice(this.chartAxis_Measure_TickSkip());
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
        return;
      }

      this.categoriesHeight = Math.min( newHeight, this.heightCat*this.catCount_Visible);
      if(this.onCatHeight && attribHeight_old!==this.categoriesHeight) this.onCatHeight(this);
    },

    /** -- */
    setHeight_Category: function(h){
      this.heightCat = Math.min(50, Math.max(10,h));
      if(!this.DOM.inited) return;
      if(this.viewType==='list') {
        this.refreshHeight_Category();
      } else {
        this.heightRow_category_dirty = true;
      }
    },
    /** -- */
    refreshHeight_Category_do: function(){
      this.DOM.aggrGlyphs.style("height",this.heightCat+"px")
      this.DOM.aggrGlyphs.selectAll(".catLabelGroup").style("padding-top",(this.heightCat/2-8)+"px");
      this.DOM.aggrGlyphs.selectAll(".measureLabel").style("padding-top",(this.heightCat/2-8)+"px");
      var fontSize = null;
      if(this.heightCat<15) fontSize = (this.heightCat-2)+"px";
      if(this.heightCat>25) fontSize = "15px";
      if(this.heightCat>30) fontSize = "17px";
      if(this.heightCat>35) fontSize = "19px";
      this.DOM.catLabel.style("font-size",fontSize);

      this.DOM.chartBackground.style("height",this.getHeight_VisibleAttrib()+"px");

      if(this.DOM.summaryConfig_CatHeight){
        this.DOM.summaryConfig_CatHeight.selectAll(".configOption").attr("active",false);
        this.DOM.summaryConfig_CatHeight.selectAll(".pos_"+this.heightCat).attr("active",true);
      }
    },
    /** -- */
    refreshHeight_Category: function(){
      var me=this;
      this.heightRow_category_dirty = false;
      this.browser.setNoAnim(true);

      this.browser.updateLayout();

      this.DOM.aggrGlyphs.style("transform",function(aggr){
        return "translate("+aggr.posX+"px,"+(me.heightCat*aggr.orderIndex)+"px)";
      });

      this.refreshHeight_Category_do();

      if(this.onCatHeight) this.onCatHeight(this);

      setTimeout(function(){ me.browser.setNoAnim(false); },100);
    },
    /** -- */
    updateAfterFilter: function(){
      if(this.isEmpty() || this.collapsed || !this.inBrowser()) return;
      var me=this;
      
      if(this.viewType==='map'){
        this.updateCatCount_Active();
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
      if(this.isEmpty() || this.collapsed || this.viewType==='map') return;
      var me = this;
      var width_Text = this.getWidth_TotalText();

      var maxWidth = this.chartScale_Measure.range()[1];
      var ratioMode = this.browser.ratioModeActive;
      var zeroPos = this.chartScale_Measure(0);

      this.DOM.measure_Total
        .style("opacity",ratioMode?0.5:null)
        .style("transform",function(_cat){
          var _h = ratioMode ? maxWidth : me.chartScale_Measure(_cat.measure('Total'));
          return "translateX("+(width_Text+zeroPos)+"px) "+"scaleX("+(_h-zeroPos)+")";
        });
      this.DOM.measureTotalTip
        .style("transform", "translateX("+(me.chartScale_Measure.range()[1]+width_Text)+"px)")
        .style("opacity",function(_cat){
          if(ratioMode) return 0;
          return (_cat.measure('Total')>me.chartScale_Measure.domain()[1])?1:0;
        });
    },
    /** -- */
    setShowSetMatrix: function(v){
      this.show_set_matrix = v;
      this.DOM.root.attr("show_set_matrix",this.show_set_matrix);

      if(this.show_set_matrix){
        if(this.setSummary===undefined){
          this.setSummary = new kshf.Summary_Set();
          this.setSummary.initialize(this.browser,this);
          this.browser.summaries.push(this.setSummary);
        } else {
          this.setSummary.prepareSetMatrixSorting();
        }
      } else {
        // remove sorting option
        this.catSortBy = this.catSortBy.filter(function(sortingOpt){
          return sortingOpt.name !== "Relatedness";
        });

        this.catSortBy_Active = this.catSortBy[0];
        this.refreshCatSortOptions();
        this.refreshSortButton();
        this.updateCatSorting(0,true);

        this.onCatSort = undefined;
      }
    },
    /** -- */
    refreshMapColorScaleBounds: function(boundMin, boundMax){
      if(boundMin===undefined && boundMax===undefined){
        var maxAggr_Active = this.getMaxAggr('Active');
        if(this.browser.ratioModeActive){
          boundMin = 0;
          boundMax = 100;
        } else if(this.browser.percentModeActive){
          boundMin = 0;
          boundMax = 100*maxAggr_Active/this.browser.allRecordsAggr.measure('Active');
        } else {
          boundMin = d3.min(this._aggrs, function(_cat){ return _cat.measure('Active'); }), 
          boundMax = maxAggr_Active;
        }
      }
      
      this.mapColorScale = d3.scaleLinear().range([0, 9]).domain([boundMin, boundMax]);

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
            return me.mapColorQuantize(vv); 
          })
          .attr("stroke", function(_cat){ 
            var v = _cat.measure('Active');
            if(me.browser.percentModeActive){
              v = 100*v/allRecordsAggr_measure_Active;
            }
            var vv = 9-me.mapColorScale(v);
            if(ratioMode) vv=8;
            return me.mapColorQuantize(vv); 
          });
        return;
      }
      
      var maxWidth = this.chartScale_Measure.range()[1];
      var zeroPos = this.chartScale_Measure(0);
      var width_Text = this.getWidth_TotalText();

      this.DOM.aggrGlyphs
        .attr("NoActiveRecords",function(aggr){ 
          return (aggr._measure.Active===0) ? "true" : null
        });

      this.DOM.measure_Active.style("transform",function(_cat){
        var scaleX = (ratioMode ? zeroPos: me.chartScale_Measure(_cat.measure('Active'))) ;
        if(_cat.recCnt.Active===0) scaleX = 0;
        scaleX-=zeroPos;
        return "translateX("+(width_Text+zeroPos)+"px) scaleX("+scaleX+")";
      });
      this.DOM.lockButton
        .style("left",function(_cat){
          return width_Text+(ratioMode?
            ((_cat.recCnt.Active===0)?0:maxWidth):
            Math.min((me.chartScale_Measure(_cat.measure('Active'))),maxWidth)
          )+"px";
        })
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
          if(this.viewType!=='map'){
            this.DOM.highlightedMeasureValue.styles({
              opacity: 1,
              transform: "translateX("+(this.browser.allRecordsAggr.ratioHighlightToTotal()*maxWidth)+"px)" });
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
            d3.min(this._aggrs, function(_cat){ 
              if(_cat.recCnt.Active===0 || _cat.recCnt.Highlight===0) return null;
              return 100*_cat.ratioHighlightToActive(); }) :
            1; //d3.min(this._aggrs, function(_cat){ return _cat.measure.Active; }), 
          var boundMax = ratioMode ? 
            d3.max(this._aggrs, function(_cat){ 
              return (_cat._measure.Active===0) ? null : 100*_cat.ratioHighlightToActive();
            }) : 
            d3.max(this._aggrs, function(_cat){ 
              if(_cat.usedAggr) return _cat.measure('Highlight');
            });

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
        var barHeight = (this.heightCat-8)/(totalC+1);

        var zeroPos = this.chartScale_Measure(0);

        this.DOM.measure_Highlight.style("transform",function(aggr){
          var p = aggr.measure('Highlight');
          if(me.browser.preview_not) p = aggr._measure.Active - aggr._measure.Highlight;
          var scaleX = (ratioMode ? ((p/aggr._measure.Active)*maxWidth ) : me.chartScale_Measure(p));
          return "translateX("+(width_Text+zeroPos)+"px) translateY(4px) scale("+(scaleX-zeroPos)+","+barHeight+")";
        });
      }
    },
    /** To initialize the positions of the compare blocks properly */
    refreshViz_Compare_Force: function(){
      this.refreshViz_Compare("A", 2, 2);
      this.refreshViz_Compare("B", 2, 3);
      this.refreshViz_Compare("C", 2, 4);
    },
    /** -- */
    refreshViz_Compare: function(cT, curGroup, totalGroups){
      if(this.isEmpty() || this.collapsed || !this.inBrowser() || this.viewType=='map') return;
      var me=this, ratioMode=this.browser.ratioModeActive, maxWidth = this.chartScale_Measure.range()[1];
      var width_Text = this.getWidth_TotalText();

      var zeroPos = this.chartScale_Measure(0);

      var _translateX = "translateX("+(width_Text+zeroPos)+"px) ";
      var barHeight = (this.heightCat-8)/totalGroups;
      var _translateY = "translateY("+(barHeight*(curGroup+1)+4)+"px)"; // 4pixel is the b=top gap
      var compId = "Compare_"+cT;

      this.DOM["measure_Compare_"+cT].style("transform",function(aggr){
        var sx = (me.browser.vizActive[compId])?
          ( ratioMode ? (aggr.ratioCompareToActive(cT)*maxWidth) : me.chartScale_Measure(aggr.measure(compId)) ) : 0;
        sx -= zeroPos;
        return _translateX+_translateY+"scale("+sx+","+barHeight+")";
      });
    },
    /** -- */
    refreshViz_Axis: function(){
      if(this.isEmpty() || this.collapsed) return;
      
      var me=this;
      var tickValues, posFunc, transformFunc;
      var chartWidth = this.getWidth_CatChart();

      var axis_Scale = d3.scaleLinear()
        .clamp(false)
        .domain(this.chartScale_Measure.domain())
        .range (this.chartScale_Measure.range() );

      function setCustomAxis(maxValue){
        axis_Scale = d3.scaleLinear()
          .rangeRound([0, chartWidth])
          .nice(me.chartAxis_Measure_TickSkip())
          .clamp(true)
          .domain([0,maxValue]);
      };

      if(this.browser.ratioModeActive) {
        setCustomAxis( 100 );
      } else if(this.browser.percentModeActive) {
        setCustomAxis( Math.round(100*me.getMaxAggr('Active')/me.browser.allRecordsAggr.measure('Active')) );
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
      tickDoms.exit().transition().style("opacity",0).transition().remove();
      
      // Add new ones
      var tickData_new=tickDoms.enter().append("span").attr("class","tick");

      tickData_new.append("span").attr("class","line longRefLine")
        .style("top","-"+(this.categoriesHeight+3)+"px")
        .style("height",(this.categoriesHeight-1)+"px");
      tickData_new.append("span").attr("class","text measureAxis_1");
      if(this.configRowCount>0){
        tickData_new.append("span").attr("class","text measureAxis_2").style("top",(-this.categoriesHeight-21)+"px");
        this.DOM.chartAxis_Measure.selectAll(".scaleModeControl.measureAxis_2").style("top",-(this.categoriesHeight+14)+"px");
      }

      // Place the doms at the zero-point, so their position can be animated.
      tickData_new.style("transform",function(d){
        return "translateX("+(me.chartScale_Measure_prev(d)-0.5)+"px)";
      });

      this.DOM.chartAxis_Measure_TickGroup.selectAll(".text")
        .html(function(d){ return me.browser.getTickLabel(d); });

      this.DOM.wrapper.attr("showMeasureAxis_2", me.configRowCount>0?"true":null);
      setTimeout(function(){
        me.DOM.chartAxis_Measure_TickGroup.selectAll("span.tick")
          .style("transform",function(d){ return "translateX("+(axis_Scale(d)-0.5)+"px)"; })
          .style("opacity",1);
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
      this.DOM.measureLabel.styles({
        left:  width_Label+"px",
        width: this.panel.width_catMeasureLabel+"px"
      });
      this.DOM.chartAxis_Measure.style("transform","translateX("+width_totalText+"px)");
      this.DOM.catSortButton.styles({
        left: width_Label+"px",
        width: this.panel.width_catMeasureLabel+"px"
      });
    },
    /** -- */
    refreshScrollDisplayMore: function(bottomItem){
      if(this._aggrs.length<=4) {
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
      var c = Math.floor(this.categoriesHeight / this.heightCat);
      var c = Math.floor(this.categoriesHeight / this.heightCat);
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
      this.DOM.chartAxis_Measure.selectAll(".text.measureAxis_2").style("top",(-h-21)+"px");
      this.DOM.chartAxis_Measure.selectAll(".scaleModeControl.measureAxis_2").style("top",(-h-14)+"px");

      if(this.viewType==='map'){
        this.DOM.catMap_Base.style("height",h+"px");
        if(this.leafletAttrMap) this.leafletAttrMap.invalidateSize();
      }
    },
    /** -- */
    isCatActive: function(category){
      if(!category.usedAggr) return false;
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
      if(this.missingValueAggr.filtered==="in"){
        this.summaryFilter.how = "All";
      }

      if(this.summaryFilter.selectedCount_Total()===0){
        this.summaryFilter.clearFilter();
        return;
      }
      this.clearCatTextSearch();
      if(this.missingValueAggr.filtered==="in"){
        this.missingValueAggr.filtered = false;
      }
      this.summaryFilter.addFilter();
    },


    /** -- */
    onCatClick: function(ctgry){
      if(!this.isCatSelectable(ctgry)) return;

      if(d3.event && d3.event.altKey){
        this.filterCategory(ctgry,"NOT");
        return;
      }

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
    onAggrHighlight: function(aggr){
      if(!this.isCatSelectable(aggr)) return;

      if(aggr.DOM.matrixRow) aggr.DOM.matrixRow.setAttribute("selection","selected");

      aggr.DOM.aggrGlyph.setAttribute("catselect","and");

      // Comes after setting select type of the category - visual feedback on selection...
      if(!this.isMultiValued && this.summaryFilter.selected_AND.length!==0) return;

      // Show the highlight (preview)
      if(aggr.is_NOT()) return;
      if(this.isMultiValued || this.summaryFilter.selected_AND.length===0){
        d3.select(aggr.DOM.aggrGlyph).classed("showlock",true);
        this.browser.setSelect_Highlight(aggr);
        if(!this.browser.ratioModeActive) {
          this.DOM.highlightedMeasureValue
            .style("opacity",1)
            .style("transform","translateX("+
                (this.viewType==='map' 
                  ? ((100*(this.mapColorScale(aggr.measure('Highlight'))/9))+"%")
                  : (this.chartScale_Measure(aggr.measure('Active'))+"px"))
                +")"
            );
        }
      }
    },
    /** -- */
    onAggrLeave: function(ctgry){
      ctgry.unselectAggregate();
      if(!this.isCatSelectable(ctgry)) return;
      this.browser.clearSelect_Highlight();
      if(this.viewType==='map') this.DOM.highlightedMeasureValue.style("opacity",0);
    },
    /** -- */
    onCatEnter_OR: function(ctgry){
      this.browser.clearSelect_Highlight();
      ctgry.DOM.aggrGlyph.setAttribute("catselect","or");
      if(this.summaryFilter.selected_OR.length>0){
        if(this.viewType==='map') this.DOM.highlightedMeasureValue.style("opacity",0);
      }
      if(d3.event){
        d3.event.stopPropagation();
      }
    },
    /** -- */
    onCatLeave_OR: function(ctgry){
      ctgry.DOM.aggrGlyph.setAttribute("catselect","and");
    },
    /** -- */
    onCatClick_OR: function(ctgry){
      this.filterCategory(ctgry,"OR");

      if(this.browser.helpin){
        this.browser.helpin.topicHistory.push(_material._topics.T_FilterOr);
      }
      if(d3.event){
        d3.event.stopPropagation();
        d3.event.preventDefault();
      }
    },
    /** -- */
    onCatEnter_NOT: function(ctgry){
      ctgry.DOM.aggrGlyph.setAttribute("catselect","not");
      this.browser.preview_not = true;
      this.browser.setSelect_Highlight(ctgry);
      this.browser.refreshMeasureLabels("Highlight"); 
      if(d3.event){
        d3.event.stopPropagation();
      }
    },
    /** -- */
    onCatLeave_NOT: function(ctgry){
      ctgry.DOM.aggrGlyph.setAttribute("catselect","and");
      this.browser.preview_not = false;
      this.browser.setSelect_Highlight(ctgry);
      if(this.viewType==='map') this.DOM.highlightedMeasureValue.style("opacity",0);
    },
    /** -- */
    onCatClick_NOT: function(ctgry){
      var me=this;
      this.browser.preview_not = true;
      this.filterCategory(ctgry,"NOT");
      setTimeout(function(){ me.browser.preview_not = false; }, 1000);

      if(this.browser.helpin){
        this.browser.helpin.topicHistory.push(_material._topics.T_FilterNot);
      }

      if(d3.event){
        d3.event.stopPropagation();
        d3.event.preventDefault();
      }
    },
    /** - */
    insertCategories: function(){
      var me = this;
      if(typeof this.DOM.aggrGroup === "undefined") return;

      var aggrGlyphSelection = this.DOM.aggrGroup.selectAll(".aggrGlyph")
        .data(this._aggrs, function(aggr){ return aggr.id(); });

      var DOM_cats_new = aggrGlyphSelection.enter()
        .append(this.viewType=='list' ? 'span' : 'g')
        .attr("class","aggrGlyph "+(this.viewType=='list'?'cat':'map')+"Glyph") // mapGlyph, catGlyph
        .attr("title",me.catTooltip ? function(_cat){ return me.catTooltip.call(_cat.data); } : null);

      this.updateCatIsVisible();

      if(this.viewType==='list'){
        DOM_cats_new
          .style("height",this.heightCat+"px")
          .style("transform","translateY(0px)")
          .on("mouseenter",function(_cat){
            this.setAttribute("mouseOver",true);
            if(me.browser.mouseSpeed<0.2) { 
              me.onAggrHighlight(_cat);
            } else {
              this.highlightTimeout = window.setTimeout( function(){ me.onAggrHighlight(_cat) }, me.browser.mouseSpeed*500);
            }
          })
          .on("mouseleave",function(_cat){ 
            this.removeAttribute("mouseOver");
            if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
            me.onAggrLeave(_cat);
          })
          .on("click", function(aggr){ me.onCatClick(aggr); });

        DOM_cats_new.append("span").attr("class","lockButton fa")
          .on("mouseenter",function(aggr){ 
            this.tipsy = new Tipsy(this, {
              gravity: me.panel.name==='right'?'se':'w',
              title: function(){ 
                var isLocked = me.browser.selectedAggr["Compare_A"]===aggr ||
                      me.browser.selectedAggr["Compare_B"]===aggr ||
                      me.browser.selectedAggr["Compare_C"]===aggr
                return kshf.lang.cur[ !isLocked ? 'LockToCompare' : 'Unlock']; 
              }
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

        var domAttrLabel = DOM_cats_new.append("span").attr("class", "catLabelGroup hasLabelWidth")
          .style("padding-top",(this.heightCat/2-8)+"px");

        var filterButtons = domAttrLabel.append("span").attr("class", "filterButtons");
        filterButtons.append("span").attr("class","AndOrNot_Or")
          .text(kshf.lang.cur.Or)
          .on("mouseover",function(_cat){ me.onCatEnter_OR(_cat); })
          .on("mouseout", function(_cat){ me.onCatLeave_OR(_cat); })
          .on("click",    function(_cat){ me.onCatClick_OR(_cat); });
        filterButtons.append("span").attr("class","AndOrNot_Not")
          .text(kshf.lang.cur.Not)
          .on("mouseover", function(_cat){ me.onCatEnter_NOT(_cat); })
          .on("mouseout",  function(_cat){ me.onCatLeave_NOT(_cat); })
          .on("click",     function(_cat){ me.onCatClick_NOT(_cat); });

        domAttrLabel.append("span").attr("class","catLabel")
          .html(function(aggr){ return me.catLabel_Func.call(aggr.data); });
        DOM_cats_new.append("span").attr("class","measureLabel");

        ["Total","Active","Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(m){
          DOM_cats_new.append("span").attr("class", "measure_"+m)
            .on("mouseenter" ,function(){ 
              if(m==="Compare_A" || m==="Compare_B" || m==="Compare_C"){
                // (if active)
                if(me.browser.vizActive[m]) me.browser.refreshMeasureLabels(m); 
              } else if(m==="Total" || m==="Active"){
                // nothing
              } else if(me.browser.measureLabelType==="Highlight"){
                // nothing
              } else {
                me.browser.refreshMeasureLabels(m);
              }
              d3.event.preventDefault();
              d3.event.stopPropagation();
            });
        });
        DOM_cats_new.append("span").attr("class", "total_tip");

      } else if(this.viewType==='map'){
        DOM_cats_new
          .each(function(_cat){
            this.tipsy = new Tipsy(this, {
              gravity: 'e',
              className: 'recordTip',
              title: function(){ 
                var str="";
                str += "<span class='mapItemName'>"+me.catLabel_Func.call(_cat.data)+"</span>";
                str += "<span style='font-weight: 300'>";
                str += me.browser.getMeasureLabel(_cat)+" "+me.browser.getMeasureFuncTypeText_Brief();
                if(me.browser.measureFunc!=="Count"){
                  str+="<br>in "+(_cat.recCnt.Active)+" "+me.browser.recordName;
                }
                str += "</span>";
                return str;
              }
            });
          })
          .on("mouseenter",function(_cat){
            if(this.tipsy) {
              this.tipsy.show();
              var left = (d3.event.pageX-this.tipsy.tipWidth-10);
              var top  = (d3.event.pageY-this.tipsy.tipHeight/2);

              var browserPos = kshf.browser.DOM.root.node().getBoundingClientRect();
              left = left - browserPos.left;
              top = top - browserPos.top;

              this.tipsy.jq_tip.node().style.left = left+"px";
              this.tipsy.jq_tip.node().style.top = top+"px";
            }
            if(me.browser.mouseSpeed<0.2) { 
              me.onAggrHighlight(_cat);
            } else {
              this.highlightTimeout = window.setTimeout( function(){ me.onAggrHighlight(_cat) }, me.browser.mouseSpeed*500);
            }
          })
          .on("mousemove", function(){
            var browserPos = kshf.browser.DOM.root.node().getBoundingClientRect();
            var left = (d3.event.pageX - browserPos.left - this.tipsy.tipWidth-10); // left - browserPos.left;
            var top = (d3.event.pageY - browserPos.top -this.tipsy.tipHeight/2); // top - browserPos.top;

            this.tipsy.jq_tip.node().style.left = left+"px";
            this.tipsy.jq_tip.node().style.top = top+"px";
          })
          .on("mouseleave",function(_cat){ 
            if(this.tipsy) this.tipsy.hide();
            if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
            me.onAggrLeave(_cat);
          });

        DOM_cats_new.append("path").attr("class","measure_Active")
          .on("click", function(aggr){ me.onCatClick(aggr); });
        DOM_cats_new.append("text").attr("class","measureLabel"); // label on top of (after) all the rest
      }
      this.refreshDOMcats();

      if(this.viewType==='list'){
        this.refreshViz_Compare_Force();
      }
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
        this.DOM.catLabel   = this.DOM.aggrGlyphs.selectAll(".catLabel");
        this.DOM.lockButton = this.DOM.aggrGlyphs.selectAll(".lockButton");

        this.refreshHeight_Category_do();
      }
    },
    /** -- */
    updateCatIsVisible: function(){
      if(this.viewType==='map'){
        this._aggrs.forEach(function(_cat){ _cat.isVisible = true; });
      } else if(this.viewType==='list'){
        var maxVisible = Math.ceil((this.scrollTop_cache+this.categoriesHeight)/this.heightCat);

        this._aggrs.forEach(function(_cat){
          _cat.isVisibleBefore = _cat.isVisible;
          _cat.isVisible = _cat.isActive &&
            (_cat.orderIndex>=this.firstCatIndexInView) && 
            (_cat.orderIndex<maxVisible);
        },this);
      }
    },
    /** -- */
    cullAttribs: function(){
      if(this.viewType==='map') return; // no culling on maps, for now.  
      this.DOM.aggrGlyphs.style("display", function(_cat){ if(!_cat.isVisible) return "none"; });
      if(this.onCatCull) this.onCatCull.call(this);
    },
    /** -- */
    updateCatSorting: function(sortDelay,force,noAnim){
      if(this.viewType==='map') return;
      if(this._aggrs===undefined) return;
      if(this._aggrs.length===0) return;
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
        this.DOM.aggrGlyphs.styles({
          opacity: 1,
          transform: function(_cat){
            _cat.posX = 0;
            _cat.posY = me.heightCat * _cat.orderIndex;
            return "translate("+_cat.posX+"px,"+_cat.posY+"px)";
          }
        });
        this.cullAttribs();
        return;
      }

      if(sortDelay===undefined) sortDelay = 1000;
      var perCatDelay = 30;

      this.DOM.aggrGlyphs
        .filter(function(_cat){ return !_cat.isActiveBefore && !_cat.isActive; })
        .style("display","none");

      // Disappear animation
      this.DOM.aggrGlyphs
        .filter(function(_cat){ return _cat.isActiveBefore && !_cat.isActive; })
        .transition()
          .duration(1)
          .delay(sortDelay)
          .on("end",function(_cat){
            this.style.opacity = 0;
            _cat.posX = xRemoveOffset;
            _cat.posY = _cat.posY;
            this.style.transform = "translate("+_cat.posX+"px,"+_cat.posY+"px)";
          })
          .transition().duration(1000)
            .on("end",function(_cat){
              this.style.display = "none";
            });

      // Appear animation (initial position)
      this.DOM.aggrGlyphs
        .filter(function(_cat){ return !_cat.isActiveBefore && _cat.isActive; })
        .transition()
          .duration(1)
          .delay(sortDelay)
          .on("end",function(_cat){
            this.style.opacity = 0;
            this.style.display = "block";
            _cat.posX = xRemoveOffset;
            _cat.posY = me.heightCat * _cat.orderIndex;
            this.style.transform = "translate("+_cat.posX+"px,"+_cat.posY+"px)";
          });

      // Sort animation
      this.DOM.aggrGlyphs
        .filter(function(_cat){ return _cat.isActive; })
        .style("display","block")
        .transition()
          .duration(1)
          .delay(function(_cat){
            if(_cat.isVisibleBefore && !_cat.isVisible) return sortDelay;
            var x = _cat.isActiveBefore ? 0:(me.catCount_InDisplay-5)*perCatDelay; // appear animation is further delayed
            return 100 + sortDelay + x + Math.min(_cat.orderIndex,me.catCount_InDisplay+2) * perCatDelay; 
          })
          .on("end",function(_cat){
            this.style.opacity = 1;
            _cat.posX = 0;
            _cat.posY = me.heightCat*_cat.orderIndex;
            this.style.transform = "translate("+_cat.posX+"px,"+_cat.posY+"px)";
          })
          .transition().duration(250)
            .on("end",function(_cat){
              if(!(_cat.isVisible || _cat.isVisibleBefore)){
                this.style.display = "none";
              }
            });
    },
    /** -- */
    chartAxis_Measure_TickSkip: function(){
      var width = this.chartScale_Measure.range()[1];
      var ticksSkip = width/25;
      if(this.getMaxAggr('Active')>100000){
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
      if(this.panel===undefined) return;
      // the following is temporary
      if(this.sourceDescr && this.sourceDescr.onMapProject) this.sourceDescr.onMapProject.call(this);
      //
      var me = this;
      this.DOM.measure_Active.attr("d", function(_cat){
        _cat._d_ = me.catMap.call(_cat.data,_cat);
        if(_cat._d_===undefined) {
          this.parentNode.style.display = "none";
          return;
        }
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
      this._aggrs.forEach(function(_cat){
        if(!_cat.isActive) return;
        var feature = me.catMap.call(_cat.data,_cat);
        if(typeof feature === 'undefined') return;
        var b = d3.geoBounds(feature);
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
    catMap_zoomToActive: function(){
      var me=this;
      if(this.asdsds===undefined){ // First time: just fit bounds
        this.asdsds = true;
        if(this.sourceDescr.mapInitView){
          this.leafletAttrMap.setView(
            L.latLng(this.sourceDescr.mapInitView[0],this.sourceDescr.mapInitView[1]) , 
            this.sourceDescr.mapInitView[2]);
          delete this.sourceDescr.mapInitView;
        } else {
          this.leafletAttrMap.fitBounds(this.mapBounds_Active);
          setTimeout(function(){ me.catMap_zoomToActive(); },1000); // need to call again to refresh. Hmmm. TODO
        }
        return;
      }

      this.leafletAttrMap.flyToBounds( this.mapBounds_Active, kshf.map.flyConfig );
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
        this.updateCatCount_Active();
        this.updateCatSorting(0,true,true);
        this.DOM.measureLabel.style("display",null);
        this.refreshViz_All();
        return;
      }
      
      // this.viewType => 'map'

      if(this.setSummary) this.setShowSetMatrix(false);
      // The map view is already initialized
      if(this.leafletAttrMap) {
        this.DOM.aggrGroup = this.DOM.summaryCategorical.select(".catMap_SVG > .aggrGroup");
        this.refreshDOMcats();

        this.map_refreshBounds_Active();
        this.catMap_zoomToActive();
        this.map_projectCategories();
        this.refreshViz_Active();
        this.refreshViz_All();
        return; 
      }

      // See http://leaflet-extras.github.io/leaflet-providers/preview/ for alternative layers
      this.leafletAttrMap = L.map(this.DOM.catMap_Base.node(), kshf.map.config )
        .addLayer( new L.TileLayer( kshf.map.tileTemplate, kshf.map.tileConfig ) )
        .on("viewreset",function(){ 
          me.map_projectCategories()
        })
        .on("movestart",function(){
          me.browser.DOM.root.attr("pointerEvents",false);
          this._zoomInit_ = this.getZoom();
          me.DOM.catMap_SVG.style("opacity",0.3);
        })
        .on("moveend",function(){
          me.browser.DOM.root.attr("pointerEvents",true);
          me.DOM.catMap_SVG.style("opacity",null);
          if(this._zoomInit_ !== this.getZoom()) me.map_projectCategories();
        });

      //var width = 500, height = 500;
      //var projection = d3.geo.albersUsa().scale(900).translate([width / 2, height / 2]);
      this.geoPath = d3.geoPath().projection( 
        d3.geoTransform({
          // Use Leaflet to implement a D3 geometric transformation.
          point: function(x, y) {
            if(x>kshf.map.wrapLongitude) x-=360;
            var point = me.leafletAttrMap.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
          }
        }) 
      );

      this.mapColorQuantize = d3.scaleQuantize()
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

      var X = this.DOM.summaryCategorical.append("div").attr("class","visViewControl");

      X.append("div")
        .attr("class","visViewControlButton fa fa-plus")
        .attr("title","Zoom in")
        .on("click",function(){ me.leafletAttrMap.zoomIn(); });
      X.append("div")
        .attr("class","visViewControlButton fa fa-minus")
        .attr("title","Zoom out")
        .on("click",function(){ me.leafletAttrMap.zoomOut(); });
      X.append("div")
        .attr("class","visViewControlButton viewFit fa fa-arrows-alt")
        .attr("title",kshf.lang.cur.ZoomToFit)
        .on("dblclick",function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
        })
        .on("click",function(){
          me.map_refreshBounds_Active();
          me.catMap_zoomToActive();
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
            return kshf.lang.cur[me.browser.ratioModeActive?'AbsoluteSize':'PartOfSize']; }
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
              return Math.round(_minValue)+" &mdash; "+Math.round(_maxValue);
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
      this.catMap_zoomToActive();
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
      this.width_measureAxisLabel = 28; // ..
      this.optimumTickWidth   = 45;

      this.hasFloat = false;
      this.timeTyped = { 
        base: false,
        maxDateRes: function(){
          //if(this.hour ) return "hour";
          if(this.day  ) return "Day";
          if(this.month) return "Month";
          if(this.year ) return "Year";
        },
        minDateRes: function(){
          if(this.year ) return "Year";
          if(this.month) return "Month";
          if(this.day  ) return "Day";
          //if(this.hour ) return "hour";
        }
      };

      this.unitName = undefined; // the text appended to the numeric value (TODO: should not apply to time)
      this.percentileChartVisible = false;
      this.zoomed = false;
      this.encodesRecordsBy = false;
      this.invertColorScale = false;

      this.highlightRangeLimits_Active = false;

      this._aggrs = [];
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

      this.timeAxis_XFunc = function(aggr){ 
        return (me.valueScale(aggr.minV) + me.valueScale(aggr.maxV))/2;
      };
    },
    /** -- */
    isEmpty: function(){
      return this._isEmpty;
    },
    /** -- */
    isWideChart: function(){
      return this.getWidth()>400;
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
        this.height_recEncoding+
        this.height_percentile;
    },
    /** -- */
    getHeight_RecordEncoding: function(){
      if(this.encodesRecordsBy && this.browser.recordDisplay) {
        if(this.browser.recordDisplay.viewRecAs==='map' || this.browser.recordDisplay.viewRecAs==='nodelink')
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
        ( this.isWideChart() ? this.width_measureAxisLabel : 11 );
    },
    /** -- */
    getWidth_OptimumTick: function(){
      if(!this.inBrowser()) return 10;
      var v = this.optimumTickWidth;
      if(this.unitName) v += 10*this.unitName.length;
      return v;
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
    setSkipZero: function(){
      if(!this.aggr_initialized) return;
      if(this.skipZero) return;
      if(this.timeTyped.base===true) return; // not time
      if(this.intervalRange.total.min>0) return;
      var me = this;

      this.skipZero = true;

      this.records.forEach(function(record){
        var v=record._valueCache[me.summaryID];
        if(v!==null && v<=0) {
          record._valueCache[this.summaryID] = null;
          this.missingValueAggr.addRecord(record);
        }
      },this);

      this.filteredRecords = this.records.filter(function(record){
        var v = me.getRecordValue(record);
        return (v!==undefined && v!==null);
      });

      this.updateIntervalRange_Total();

      this.refreshScaleType();
      this.resetFilterRangeToTotal();

      this.aggr_initialized = true;
      this.refreshViz_Nugget();
      this.refreshViz_EmptyRecords();
    },
    /** -- */
    initializeAggregates: function(){
      if(this.aggr_initialized) return;
      var me = this;

      // not part of the object, used by d3 min array calculation.
      this.getRecordValue = function(record){ return record._valueCache[me.summaryID]; };

      if(this.missingValueAggr.records.length>0){
        this.missingValueAggr.records = [];
        this.missingValueAggr.resetAggregateMeasures();
      }

      this.records.forEach(function(record){
        var v=this.summaryFunc.call(record.data,record);
        if(v===undefined) v=null;
        if(isNaN(v)) v=null;
        if(v===0 && me.skipZero) {
          v = null;
        }
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
        this.timeTyped.print = d3.utcFormat(f);
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

      this.refreshScaleType();
      this.resetFilterRangeToTotal();

      this.aggr_initialized = true;
      this.refreshViz_Nugget();
      this.refreshViz_EmptyRecords();
    },
    /** -- */
    setStepTicks: function(v){
      this.stepTicks = v;
      if(this.stepTicks && !this.zoomed){
        // Hmm, this was breaking filter setting after zoom in/out. TODO - Check in more detail
        this.checkFilterRange();
      }
    },
    /** -- */
    setTimeFormat: function(fmt){
      var timeFormatFunc = null;
      if(fmt==="%Y"){
        timeFormatFunc = function(v){ if(v && v!=="") return new Date(1*v,0); };
      } else if(fmt===undefined || fmt===null) {
        return;
      } else {
        timeFormatFunc = d3.timeParse(fmt);
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
    refreshScaleType: function(){
      if(this.isEmpty()) return;
      var me = this;
      this.stepTicks = false;

      if(this.isTimeStamp()) {
        this.setScaleType('time',true);
        return;
      }

      // decide scale type based on the filtered records
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
      this.summaryFilter = this.browser.createFilter('interval',this);
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
        return "<b>"+this.printWithUnitName(minValue)+"</b> &mdash; "+
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
        return "<b>min. "+this.printWithUnitName(minValue)+"</b>";
      } else {
        return "<b>max. "+this.printWithUnitName(printMax)+"</b>";
      }
    },
    /** -- */
    refreshViz_Nugget: function(){
      if(this.DOM.nugget===undefined) return;

      var nuggetChart = this.DOM.nugget.select(".nuggetChart");

      this.DOM.nugget
        .attr("aggr_initialized",this.aggr_initialized?true:null)
        .attr("datatype",this.getDataType());

      if(!this.aggr_initialized) return;

      if(this.uniqueCategories()){
        this.DOM.nugget.select(".nuggetInfo").html("<span class='fa fa-tag'></span><br>Unique");
        nuggetChart.style("display",'none');
        return;
      }

      var maxAggregate_Total = this.getMaxAggr('Total');

      if(this.intervalRange.org.min===this.intervalRange.org.max){
        this.DOM.nugget.select(".nuggetInfo").html("only<br>"+this.intervalRange.org.min);
        nuggetChart.style("display",'none');
        return;
      }

      var totalHeight = 17;
      nuggetChart.selectAll(".nuggetBar").data(this._aggrs).enter()
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
    checkFilterRange: function(fixTime){
      var filterActive = this.summaryFilter.active;
      if(filterActive===undefined) return;
      
      // swap min/max if necessary
      if(filterActive.min>filterActive.max){
        var _temp = filterActive.min;
        filterActive.min = filterActive.max;
        filterActive.max = _temp;
      }

      if(this.scaleType==='time'){
        if(fixTime){
          filterActive.min = this.getClosestTick(filterActive.min);
          filterActive.max = this.getClosestTick(filterActive.max);
        }
        return;
      }

      if(this.stepTicks || !this.hasFloat){
        filterActive.min=Math.floor(filterActive.min);
        filterActive.max=Math.ceil(filterActive.max);
      }

      // Make sure the range is within the visible limits:
      filterActive.min = Math.max(filterActive.min, this.intervalRange.active.min);
      filterActive.max = Math.min(filterActive.max, this.intervalRange.getActiveMax());
    },
    /** -- */
    setScaleType: function(t,force){
      var me=this;

      this.viewType = t==='time'?'line':'bar';
      if(this.DOM.inited) {
        this.DOM.root.attr("viewType",this.viewType);
      }

      if(force===false && this.scaleType_locked) return;

      if(this.scaleType===t) return;

      this.scaleType = t;
      if(force) {
        this.scaleType_locked = this.scaleType;
      }
      
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
      if(this.encodesRecordsBy && this.browser.recordDisplay){
        this.browser.recordDisplay.changeOfScale();
      }
    },
    /** -- */
    refreshPercentileChart: function(){
      this.DOM.percentileGroup
        .attr("percentileChartVisible",this.percentileChartVisible?true:null);
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
        .attr("encodesRecordsBy",this.encodesRecordsBy)
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
          .style("margin-left",(this.width_barGap/2)+"px");

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

      this.refreshScaleType();
      this.insertVizDOM();

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
      if(this.scaleType!=='time') this.refreshScaleType(); // linear vs log
      this.updateScaleAndBins();
    },
    /** -- */
    setUnitName: function(v){
      this.unitName = v;
      if(this.unitName && this.DOM.unitNameInput) this.DOM.unitNameInput.node().value = this.unitName;
      this.refreshValueTickLabels();
      if(this.encodesRecordsBy && this.browser.recordDisplay.recordViewSummary){
        this.browser.recordDisplay.refreshRecordSortLabels();
      }
    },
    /** -- */
    printWithUnitName: function(v,noDiv){
      if(v instanceof Date) return this.timeTyped.print(v);
      if(v === null) {
        v = "-";
      } else {
        v = v.toLocaleString();
      }
      if(this.unitName){
        var s = noDiv ? 
          this.unitName
          :
          ("<span class='unitName'>"+this.unitName+"</span>");
        if(this.unitName==='$' || this.unitName==='€'){
          s = s+v;
          // replace abbrevation G with B
          s = s.replace("G","B");
        } else {
          s = v+s;
        }
        return s;
      }
      return v;
    },
    /** -- */
    setEncodesRecordsBy: function(type){
      this.encodesRecordsBy = type;
      if(this.DOM.root) this.DOM.root.attr("encodesRecordsBy",this.encodesRecordsBy);
    },
    /** -- */
    clearEncodesRecordsBy: function(){
      this.encodesRecordsBy = false;
      if(this.DOM.root) this.DOM.root.attr("encodesRecordsBy",null);
    },
    /** -- */
    initDOM_IntervalConfig: function(){
      var me=this, x;

      this.DOM.summaryConfig_UnitName = this.DOM.summaryConfig.append("div")
        .attr("class","summaryConfig_UnitName summaryConfig_Option");
      this.DOM.summaryConfig_UnitName.append("span").text("Value Unit: ");
      this.DOM.unitNameInput = this.DOM.summaryConfig_UnitName.append("input").attr("type","text")
        .attr("class","unitNameInput")
        .attr("placeholder",kshf.unitName)
        .attr("maxlength",5)
        .on("input",function(){
          if(this.timer) clearTimeout(this.timer);
          var x = this;
          var qStr = x.value.toLowerCase();
          this.timer = setTimeout( function(){ me.setUnitName(qStr); }, 750);
        });;

      // Show the linear/log scale transformation only if...
      if(this.scaleType!=='time' && !this.stepTicks && this.intervalRange.org.min>0){
        this.DOM.summaryConfig_ScaleType = this.DOM.summaryConfig.append("div")
          .attr("class","summaryConfig_ScaleType summaryConfig_Option");
        this.DOM.summaryConfig_ScaleType.append("span").html("<i class='fa fa-arrows-h'></i> Bin Scale: ");
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

      this.DOM.summaryConfig_Percentile = this.DOM.summaryConfig.append("div")
        .attr("class","summaryConfig_Percentile summaryConfig_Option");
      this.DOM.summaryConfig_Percentile.append("span").text("Percentile Chart: ")
      this.DOM.summaryConfig_Percentile.append("span").attr("class","optionGroup")
        .selectAll(".configOption").data(
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

      function addPercentileDOM(distr){
        var parent = me.DOM.percentileGroup.append("div").attr("class","percentileChart_"+distr);

        parent.selectAll(".aggrGlyph").data([ 
          [10,20,1],[20,30,2],[30,40,3],[40,50,4],[50,60,4],[60,70,3],[70,80,2],[80,90,1] 
        ]).enter()
          .append("span")
            .attr("class",function(qb){ return "quantile aggrGlyph q_range qG"+qb[2]; })
            .each(function(qb){
              this.__data__.summary = me;
              this.tipsy = new Tipsy(this, {
                gravity: 's',
                title: function(){
                  return "<span style='font-weight:300; "+
                      "text-decoration: underline'><b>"+qb[0]+"</b>% - <b>"+qb[1]+"</b>% Percentile<br></span>"+
                    "<span style='font-weight:500'>"+me.intervalTickPrint(me.quantile_val[distr+qb[0]])+"</span> - "+
                    "<span style='font-weight:500'>"+me.intervalTickPrint(me.quantile_val[distr+qb[1]])+"</span>";
                }
              })
            })
            .on("mouseover",function(qb){ 
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
            .on("click", function(qb){
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
            });

        parent.selectAll(".q_pos").data([10,20,30,40,50,60,70,80,90]).enter()
          .append("span")
            .attr("class",function(q){ return "quantile q_pos q_"+q; })
            .each(function(q){
              this.tipsy = new Tipsy(this, {
                gravity: 's', title: function(){ return "<u>Median:</u><br> "+ me.quantile_val[distr+q]; }
              });
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout" ,function(){ this.tipsy.hide(); });
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
              'Second': 1000,
              'Minute': 1000*60,
              'Hour'  : 1000*60*60,
              'Day'   : 1000*60*60*24,
              'Month' : 1000*60*60*24*30,
              'Year'  : 1000*60*60*24*365,
            };

            var timeRes = [
              {
                type: 'Second',
                step: 1,
                format: '%S'
              },{
                type: 'Second',
                step: 5,
                format: '%S'
              },{
                type: 'Second',
                step: 15,
                format: '%S'
              },{
                type: 'Minute',
                step: 1,
                format: '%M'
              },{
                type: 'Minute',
                step: 5,
                format: '%M'
              },{
                type: 'Minute',
                step: 15,
                format: '%M'
              },{
                type: 'Hour',
                step: 1,
                format: '%H'
              },{
                type: 'Hour',
                step: 6,
                format: '%H'
              },{
                type: 'Day',
                step: 1,
                format: '%e'
              },{
                type: 'Day',
                step: 4,
                format: function(v){
                  var suffix = kshf.Util.ordinal_suffix_of(v.getUTCDate());
                  var first=d3.utcFormat("%-b")(v);
                  return suffix+"<br>"+first;
                },
                twoLine: true
              },{
                type: 'Month',
                step: 1,
                format: function(v){
                  var nextTick = timeInterval.offset(v, 1);
                  var first=d3.utcFormat("%-b")(v);
                  var s=first;
                  if(first==="Jan") s+="<br><span class='secondLayer'>"+(d3.utcFormat("%Y")(nextTick))+"</span>";
                  return s;
                },
                twoLine: true
              },{
                type: 'Month',
                step: 3,
                format: function(v){
                  var nextTick = timeInterval.offset(v, 3);
                  var first=d3.utcFormat("%-b")(v);
                  var s=first;
                  if(first==="Jan") s+="<br><span class='secondLayer'>"+(d3.utcFormat("%Y")(nextTick))+"</span>";
                  return s;
                },
                twoLine: true
              },{
                type: 'Month',
                step: 6,
                format: function(v){
                  var nextTick = timeInterval.offset(v, 6);
                  var first=d3.utcFormat("%-b")(v);
                  var s=first;
                  if(first==="Jan") s+="<br>"+(d3.utcFormat("%Y")(nextTick));
                  return s;
                },
                twoLine: true
              },{
                type: 'Year',
                step: 1,
                format: "%Y"
              },{
                type: 'Year',
                step: 2,
                format: "%Y"
              },{
                type: 'Year',
                step: 3,
                format: "%Y"
              },{
                type: 'Year',
                step: 5,
                format: "%Y"
              },{
                type: 'Year',
                step: 10,
                format: "%Y"
              },{
                type: 'Year',
                step: 25,
                format: "%Y"
              },{
                type: 'Year',
                step: 50,
                format: "%Y"
              },{
                type: 'Year',
                step: 100,
                format: "%Y"
              },{
                type: 'Year',
                step: 500,
                format: "%Y"
              }
            ];

            timeRes.every(function(tRes,i){
              var stopIteration = i===timeRes.length-1 || 
                timeRange_ms/(timeMult[tRes.type]*tRes.step) < optimalTickCount;
              if(stopIteration){
                if(tRes.type==="Day"   && this.timeTyped.maxDateRes()==="Month") stopIteration = false;
                if(tRes.type==="Day"   && this.timeTyped.maxDateRes()==="Year" ) stopIteration = false;
                if(tRes.type==="Month" && this.timeTyped.maxDateRes()==="Year" ) stopIteration = false;
                if(tRes.type==="Hour"  && this.timeTyped.maxDateRes()==="Day"  ) stopIteration = false;
              }
              if(stopIteration){
                // TODO: Fix D3
                timeInterval = d3['utc'+[tRes.type]];
                this.timeTyped.activeRes = tRes;
                if(typeof tRes.format === "string"){
                  this.intervalTickPrint = d3.utcFormat(tRes.format);
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

          var d3Formating = d3.format(floatNumTicks?".2f":".2s");
          this.intervalTickPrint = function(d){
            if(!me.hasFloat && d<10) return d;
            if(!me.hasFloat && Math.abs(ticks[1]-ticks[0])<1000) return d;
            return d3Formating(d);
          }

        } else {
          this.valueScale.nice(optimalTickCount);
          ticks = this.valueScale.ticks(optimalTickCount);

          if(!this.hasFloat) ticks = ticks.filter(function(tick){return tick===0||tick%1===0;});

          // Do ticks have a floating number?
          var floatNumTicks = ticks.some(function(tick){ return tick%1!==0; });

          var d3Formating = d3.format(floatNumTicks?".2f":".2s");
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
        case 'linear': this.valueScale = d3.scaleLinear();      break;
        case 'log':    this.valueScale = d3.scaleLog().base(2); break;
        case 'time':   this.valueScale = d3.scaleUtc();        break;
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

          minn = this.intervalRange.active.min;
          maxx = this.intervalRange.getActiveMax();

          this.valueScale
            .domain([minn, maxx])
            .range([0, _width_]);
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
        if(this._aggrs){
          var aggrs=this.browser.allAggregates;
          this._aggrs.forEach(function(aggr){ aggrs.splice(aggrs.indexOf(aggr),1); },this);
        }

        this._aggrs = [];
        // Create _aggrs as kshf.Aggregate
        this.intervalTicks.forEach(function(tick,i){
          var d = new kshf.Aggregate_Interval(this, tick, this.intervalTicks[i+1]);
          d.summary = this;
          this._aggrs.push(d);
          me.browser.allAggregates.push(d);
        }, this);
          
        this._aggrs.pop(); // remove last bin

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
          var bin = this._aggrs[ Math.min(binI, this._aggrs.length-1) ];

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

          if(bin) bin.addRecord(record);
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
        setTimeout(function(){
          me.refreshViz_Scale();
        }, 10);

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
        var zeroPos = this.chartScale_Measure(0);

        // delete existing DOM:
        // TODO: Find  a way to avoid this?
        this.DOM.timeSVG.selectAll('[class^="measure_"]').remove();

        this.DOM.measure_Total_Area = this.DOM.timeSVG
          .append("path")
            .attr("class","measure_Total_Area")
            .datum(this._aggrs)
            .attr("d", 
              d3.area()
                .curve(d3.curveMonotoneX)
                .x (this.timeAxis_XFunc)
                .y0(this.height_hist+2-zeroPos)
                .y1(this.height_hist+2-zeroPos)
              );;;
        this.DOM.measure_Active_Area = this.DOM.timeSVG
          .append("path")
            .attr("class","measure_Active_Area")
            .datum(this._aggrs)
            .attr("d", 
              d3.area()
                .curve(d3.curveMonotoneX)
                .x (this.timeAxis_XFunc)
                .y0(this.height_hist+2-zeroPos)
                .y1(this.height_hist+2-zeroPos)
              );;
        this.DOM.lineTrend_ActiveLine = this.DOM.timeSVG.selectAll(".measure_Active_Line")
          .data(this._aggrs, function(d,i){ return i; })
          .enter().append("line")
            .attr("class","measure_Active_Line")
            .attr("marker-end","url(#kshfLineChartTip_Active)")
            .attr("x1",this.timeAxis_XFunc)
            .attr("x2",this.timeAxis_XFunc)
            .attr("y1",this.height_hist+3-zeroPos)
            .attr("y2",this.height_hist+3-zeroPos);

        this.DOM.measure_Highlight_Area = this.DOM.timeSVG
          .append("path").attr("class","measure_Highlight_Area").datum(this._aggrs);
        this.DOM.measure_Highlight_Line = this.DOM.timeSVG.selectAll(".measure_Highlight_Line")
          .data(this._aggrs, function(d,i){ return i; })
          .enter().append("line").attr("class","measure_Highlight_Line").attr("marker-end","url(#kshfLineChartTip_Highlight)");

        this.DOM.measure_Compare_Area_A = this.DOM.timeSVG
          .append("path").attr("class","measure_Compare_Area_A measure_Compare_A").datum(this._aggrs);
        this.DOM.measure_Compare_Line_A = this.DOM.timeSVG.selectAll(".measure_Compare_Line_A")
          .data(this._aggrs, function(d,i){ return i; })
          .enter().append("line").attr("class","measure_Compare_Line_A measure_Compare_A").attr("marker-end","url(#kshfLineChartTip_Compare_A)");
        this.DOM.measure_Compare_Area_B = this.DOM.timeSVG
          .append("path").attr("class","measure_Compare_Area_B measure_Compare_B").datum(this._aggrs);
        this.DOM.measure_Compare_Line_B = this.DOM.timeSVG.selectAll(".measure_Compare_Line_B")
          .data(this._aggrs, function(d,i){ return i; })
          .enter().append("line").attr("class","measure_Compare_Line_B measure_Compare_B").attr("marker-end","url(#kshfLineChartTip_Compare_B)");
        this.DOM.measure_Compare_Area_C = this.DOM.timeSVG
          .append("path").attr("class","measure_Compare_Area_C measure_Compare_C").datum(this._aggrs);
        this.DOM.measure_Compare_Line_C = this.DOM.timeSVG.selectAll(".measure_Compare_Line_C")
          .data(this._aggrs, function(d,i){ return i; })
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
      this.DOM.valueTickGroup.style("left", (this.stepTicks ? (this.aggrWidth/2) : 0)+"px");
      this.DOM.valueTickGroup.selectAll(".valueTick")
        .style("left",function(d){ return me.valueScale(d.tickValue)+"px"; });
    },
    /** -- */
    updateValueTicks: function(){
      var me=this;

      // Insert middle-ticks to show that this is log-scale
      var ticks = [];
      if(this.scaleType==="log"){
        ticks = [{tickValue: this.intervalTicks[0], major:true}];
        for(var i=1 ; i < this.intervalTicks.length ; i++){
          var _min = me.valueScale(this.intervalTicks[i-1]);
          var _max = me.valueScale(this.intervalTicks[i]);
          [1,1,1,1].forEach(function(){
            var x = (_min+_max)/2;
            ticks.push( {tickValue: me.valueScale.invert(x), major:false } );
            _min = x;
          });
          ticks.push({tickValue: this.intervalTicks[i], major: true});
        }
      } else { 
        this.intervalTicks.forEach(function(p){ ticks.push({tickValue: p, major: true}); });
      }
      
      var ddd = this.DOM.valueTickGroup.selectAll(".valueTick").data(ticks,function(d){ return d.tickValue; });
      ddd.style("opacity",1).classed("major",function(d){ return d.major; });

      ddd.exit().style("opacity",0);

      var X = ddd.enter().append("span").attr("class","valueTick")
        .style("opacity",1).classed("major",function(d){ return d.major; });
      X.append("span").attr("class","line");
      X.append("span").attr("class","text");

      this.DOM.valueTickGroup.selectAll(".valueTick > .text")
        .each(function(d){
          this.bin = null;
          me._aggrs.every(function(bin){
            if(bin.minV===d.tickValue) {
              this.bin = bin;
              return false;
            }
            return true;
          },this);
        })
        .on("mouseover",function(d){
          if(this.bin) me.onAggrHighlight(this.bin);
        })
        .on("mouseleave",function(d){
          if(this.bin===null) return;
          me.onAggrLeave(this.bin);
        })
        .on("click",function(d){
          if(this.bin) me.onAggrClick(this.bin);
        });

      this.refreshValueTickLabels();
    },
    /** -- */
    refreshValueTickLabels: function(){
      var me=this;
      if(this.DOM.valueTickGroup===undefined) return;
      this.DOM.valueTickGroup.selectAll(".valueTick > .text").html(function(d){ 
        return me.printWithUnitName( me.intervalTickPrint(d.tickValue) ); 
      });
    },
    /** -- */
    onAggrHighlight: function(aggr){
      d3.select(aggr.DOM.aggrGlyph).classed("showlock",true);
      aggr.DOM.aggrGlyph.setAttribute("selection","selected");
      if(!this.browser.ratioModeActive){
        this.DOM.highlightedMeasureValue
          .style("transform","translateY("+(this.height_hist - this.chartScale_Measure(aggr.measure('Active')))+"px)")
          .style("opacity",1);
      }
      this.browser.setSelect_Highlight(aggr);
    },
    /** -- */
    onAggrLeave: function(aggr){
      aggr.unselectAggregate();
      this.browser.clearSelect_Highlight();
    },
    /** -- */
    onAggrClick: function(aggr){
      if(this.highlightRangeLimits_Active) return;
      if(d3.event && d3.event.shiftKey){
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

      var zeroPos = this.chartScale_Measure(0);
      var width=this.getWidth_Bin();
      var offset = (this.stepTicks)? this.width_barGap : 0;

      // just remove all aggrGlyphs that existed before.
      this.DOM.histogram_bins.selectAll(".aggrGlyph").data([]).exit().remove();

      var activeBins = this.DOM.histogram_bins.selectAll(".aggrGlyph").data(this._aggrs, function(d,i){return i;});

      var newBins=activeBins.enter().append("span").attr("class","aggrGlyph rangeGlyph")
        .each(function(aggr){
          aggr.isVisible = true;
          aggr.DOM.aggrGlyph = this;
        })
        .on("mouseenter",function(aggr){
          if(aggr.recCnt.Active===0) return;
          if(me.highlightRangeLimits_Active) return;
          // mouse is moving slow, just do it.
          if(me.browser.mouseSpeed<0.2) {
            me.onAggrHighlight(aggr);
            return;
          }
          // mouse is moving fast, should wait a while...
          this.highlightTimeout = window.setTimeout(
            function(){ me.onAggrHighlight(aggr) }, 
            me.browser.mouseSpeed*300);
        })
        .on("mouseleave",function(aggr){
          if(aggr.recCnt.Active===0) return;
          if(me.highlightRangeLimits_Active) return;
          if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
          me.onAggrLeave(aggr);
        })
        .on("click",function(aggr){ me.onAggrClick(aggr); });

      ["Total","Active","Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(m){
        var X = newBins.append("span").attr("class","measure_"+m)
          .style("transform","translateY("+(me.height_hist-zeroPos)+"px) scale("+width+",0)");
        if(m!=="Total" && m!=="Active" && m!=="Highlight"){
          X.on("mouseenter" ,function(){
            me.browser.refreshMeasureLabels(this.classList[0].substr(8));
          });
          X.on("mouseleave", function(){ 
            me.browser.refreshMeasureLabels("Active");
          });
        }
      },this);

      newBins.append("span").attr("class","total_tip");
      newBins.append("span").attr("class","lockButton fa")
        .each(function(aggr){
          this.tipsy = new Tipsy(this, {
            gravity: 's',
            title: function(){
              var isLocked = me.browser.selectedAggr["Compare_A"]===aggr ||
                    me.browser.selectedAggr["Compare_B"]===aggr ||
                    me.browser.selectedAggr["Compare_C"]===aggr
              return kshf.lang.cur[ !isLocked ? 'LockToCompare' : 'Unlock'];
            }
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

      newBins.append("span").attr("class","measureLabel");

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
    setRangeFilter: function(_min, _max, useTimer){
      this.summaryFilter.active.min = _min;
      this.summaryFilter.active.max = _max;

      this.refreshRangeFilter(useTimer);
    },
    /** -- */
    refreshRangeFilter: function(useTimer){
      if(useTimer===undefined) useTimer = false;
      this.checkFilterRange(useTimer);
      this.refreshIntervalSlider();

      var me=this;
      var doFilter = function(){
        if(me.isFiltered_min() || me.isFiltered_max()){
          me.summaryFilter.filteredBin = undefined;
          me.summaryFilter.addFilter();
        } else {
          me.summaryFilter.clearFilter();
        }
        delete me.rangeFilterTimer;
      }
      if(useTimer===undefined) {
        doFilter(this);
      } else {
        if(this.rangeFilterTimer) clearTimeout(this.rangeFilterTimer);
        this.rangeFilterTimer = setTimeout(doFilter,250);
      }
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
          me.browser.recordDisplay.recMap_refreshColorScaleBins();
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
                "<b>"+me.intervalTickPrint(this._maxValue)+"</b>"; }
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
    dragRange: function(initPos, curPos, initMin, initMax){
      if(this.scaleType==='log'){
        var targetDif = curPos-initPos;
        this.summaryFilter.active.min = this.valueScale.invert(this.valueScale(initMin)+targetDif);
        this.summaryFilter.active.max = this.valueScale.invert(this.valueScale(initMax)+targetDif);
      } else if(this.scaleType==='time'){
        return; // TODO
      } else if(this.scaleType==='linear'){
        var targetDif = this.valueScale.invert(curPos) - this.valueScale.invert(initPos);
        if(!this.hasFloat) targetDif = Math.round(targetDif);

        this.summaryFilter.active.min = initMin + targetDif;
        this.summaryFilter.active.max = initMax + targetDif;

        // Limit the active filter to expand beyond the current min/max of the view.
        if(this.summaryFilter.active.min<this.intervalRange.active.min){
          this.summaryFilter.active.min = this.intervalRange.active.min;
          this.summaryFilter.active.max = this.intervalRange.active.min + (initMax - initMin);
        }
        if(this.summaryFilter.active.max>this.intervalRange.getActiveMax()){
          this.summaryFilter.active.max = this.intervalRange.getActiveMax();
          this.summaryFilter.active.min = this.intervalRange.getActiveMax() - (initMax - initMin);
        }
      }
      this.refreshRangeFilter(true);
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
            me.setRangeFilter(d3.min([initPos,targetPos]) , d3.max([initPos,targetPos]));
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
          var initPos = d3.mouse(e)[0];

          d3.select("body").on("mousemove", function() {
            me.dragRange(initPos, d3.mouse(e)[0], initMin, initMax);
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
        .on("dblclick", function(d){
          if(typeof Pikaday === 'undefined') return;
          if(this.pikaday===undefined){
            this.pikaday = new Pikaday( {
              field: this,
              firstDay: 1,
              defaultDate: me.summaryFilter.active[d],
              setDefaultDate: true,
              minDate: me.intervalRange.total.min,
              maxDate: me.intervalRange.total.max,
              onSelect: function(date) {
                var selectedDate = this.getDate();
                if(d==='min' && selectedDate < me.summaryFilter.active.min){
                  if(me.zoomed) me.setZoomed(false);
                }
                if(d==='max' && selectedDate > me.summaryFilter.active.max){
                  if(me.zoomed) me.setZoomed(false);
                }
                me.summaryFilter.active[d] = this.getDate();
                me.refreshRangeFilter();
              }
            });
          } else {
            this.pikaday.setDate(me.summaryFilter.active[d]);
          }
          this.pikaday.show();
        })
        .on("mousedown", function(d,i){
          this.tipsy.hide();
          if(d3.event.which !== 1) return; // only respond to left-click

          me.browser.DOM.root.attr("adjustWidth",true).attr("pointerEvents",false);
          this.setAttribute("dragging",true);

          var mee = this;
          mee.dragging = true;
          var e=this.parentNode;
          d3.select("body").on("mousemove", function() {
            me.summaryFilter.active[d] = me.valueScale.invert(d3.mouse(e)[0]);
            // Swap is min > max
            if(me.summaryFilter.active.min>me.summaryFilter.active.max){
              var t=me.summaryFilter.active.min;
              me.summaryFilter.active.min = me.summaryFilter.active.max;
              me.summaryFilter.active.max = t;
              if(d==='min') d='max'; else d='min'; // swap
            }
            me.refreshRangeFilter(true);
          }).on("mouseup", function(){
            mee.dragging = false;
            mee.removeAttribute("dragging");
            me.browser.DOM.root.attr("adjustWidth",null).attr("pointerEvents",true);;
            d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
          });
          d3.event.stopPropagation();
        });

      this.DOM.recordValue = controlLine.append("div").attr("class","recordValue");
      this.DOM.recordValue.append("span").attr("class","recordValueScaleMark");
      this.DOM.recordValueText = this.DOM.recordValue
        .append("span").attr("class","recordValueText")
        .append("span").attr("class","recordValueText-v");

      this.DOM.valueTickGroup = this.DOM.intervalSlider.append("div").attr("class","valueTickGroup");
    },
    /** -- */
    updateBarScale2Active: function(){
      var maxMeasureValue = this.getMaxAggr_All();
      var minMeasureValue = 0;
      if(this.browser.measureFunc!=="Count" && this.browser.measureSummary.intervalRange.org.min<0){
        minMeasureValue = Math.min(0, this.getMinAggr_All());
      }
      this.getMinAggr_All();
      // store previous state
      this.chartScale_Measure_prev
        .domain(this.chartScale_Measure.domain())
        .range (this.chartScale_Measure.range() )
        .clamp(false);
      // store previous state
      this.chartScale_Measure
        .domain([minMeasureValue, maxMeasureValue])
        .range ([0, this.height_hist]);
    },
    /** -- */
    refreshBins_Translate: function(){
      var me=this;
      var offset = (this.stepTicks)? this.width_barGap : 0;
      if(this.scaleType==="time"){
        this.DOM.aggrGlyphs
          .style("width",function(aggr){ return (me.valueScale(aggr.maxV)-me.valueScale(aggr.minV))+"px"; })
          .style("transform",function(aggr){ return "translateX("+(me.valueScale(aggr.minV)+ 1)+"px)"; });
      } else {
        this.DOM.aggrGlyphs
          .style("width",this.getWidth_Bin()+"px")
          .style("transform",function(aggr){ 
            return "translateX("+(me.valueScale(aggr.minV)+offset)+"px)";
          });
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

      var ratioMode = this.browser.ratioModeActive;

      var zeroPos = this.chartScale_Measure(0);
      var heightTotal = function(aggr){
        if(aggr._measure.Total===0) return -zeroPos;
        if(me.browser.ratioModeActive) return me.height_hist-zeroPos;
        return me.chartScale_Measure(aggr.measure('Total'))-zeroPos;
      };

      if(this.scaleType==='time'){
        this.DOM.measure_Total_Area
          .style("opacity",ratioMode?0.5:null)
          .transition().duration(this.browser.noAnim?0:700).ease(d3.easeCubic)
          .attr("d", 
            d3.area()
              .curve(d3.curveMonotoneX)
              .x (this.timeAxis_XFunc)
              .y0(this.height_hist - zeroPos)
              .y1(function(aggr){ 
                return ((aggr._measure.Total===0) ? (me.height_hist-zeroPos) : (me.height_hist-heightTotal(aggr)))-zeroPos;
              }));
          ;
      } else {
        this.DOM.measure_Total
          .style("opacity",ratioMode?0.5:null)
          .style("transform",function(aggr){
            return "translateY("+(me.height_hist-zeroPos)+"px) scale("+width+","+heightTotal(aggr)+")";
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

      var zeroPos = this.chartScale_Measure(0);
      var heightActive = function(aggr){
        if(aggr._measure.Active===0) return -zeroPos;
        if(me.browser.ratioModeActive) return zeroPos; //me.height_hist-zeroPos;
        return me.chartScale_Measure(aggr.measure('Active'))-zeroPos;
      };

      this.DOM.aggrGlyphs
        .attr("NoActiveRecords",function(aggr){ 
          return (aggr._measure.Active===0) ? "true" : null
        });

      // Position the lock button
      this.DOM.lockButton
        .style("transform",function(aggr){
          var x = heightActive(aggr);
          var translateY = me.height_hist-x-10;
          if(x>0) translateY-=zeroPos; else translateY=zeroPos-8;
          return "translateY("+translateY+"px)";
        })
        .attr("inside",function(aggr){
          if(me.browser.ratioModeActive) return "";
          if(me.height_hist-heightActive(aggr)<6) return "";
        });

      // Time (line chart) update
      if(this.scaleType==='time'){
        var durationTime = this.browser.noAnim ? 0 : 700;
        var yFunc = function(aggr){
          return ((aggr._measure.Active===0) ? (me.height_hist-zeroPos) : (me.height_hist-heightActive(aggr)))-zeroPos;
        };
        this.DOM.measure_Active_Area
          .transition().duration(durationTime).ease(d3.easeCubic)
          .attr("d", 
            d3.area()
              .curve(d3.curveMonotoneX)
              .x (this.timeAxis_XFunc)
              .y0(this.height_hist - zeroPos)
              .y1(yFunc)
            );

        this.DOM.lineTrend_ActiveLine.transition().duration(durationTime)
          .attr("x1",this.timeAxis_XFunc)
          .attr("x2",this.timeAxis_XFunc)
          .attr("y1",this.height_hist-zeroPos)
          .attr("y2",yFunc);
      }

      if(!this.isFiltered() || this.scaleType==='time' || this.stepTicks){
        // No partial rendering
        this.DOM.measure_Active.style("transform",function(aggr){
          return "translateY("+(me.height_hist-zeroPos)+"px) scale("+width+","+(heightActive(aggr))+")";
        });
      } else {
        // Partial rendering
        // is filtered & not step scale
        var filter_min = this.summaryFilter.active.min;
        var filter_max = this.summaryFilter.active.max;
        var minPos = this.valueScale(filter_min);
        var maxPos = this.valueScale(filter_max);
        this.DOM.measure_Active.style("transform",function(aggr){
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
          return "translateY("+me.height_hist+"px) "+translateX+"scale("+width_self+","+heightActive(aggr)+")";
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

      // Percentile chart
      if(this.percentileChartVisible){
        if(this.browser.vizActive[compId]){
          this.DOM.percentileGroup.select(".compared_percentileChart").style("display","block");
          if(this.browser.vizActive[compId]) this.updatePercentiles("Compare_"+cT);
        } else {
          this.DOM.percentileGroup.select(".compared_percentileChart").style("display","none");
        }
      }

      var zeroPos = this.chartScale_Measure(0);
      var heightCompare = function(aggr){
        var _h = 0;
        if(aggr._measure[compId]!==0){
          _h = ratioModeActive ? aggr.ratioCompareToActive(cT)*me.height_hist
            : me.chartScale_Measure(aggr.measure(compId));
        }
        return _h - zeroPos;
      };

      // Time line update
      if(this.scaleType==='time'){
        var yFunc = function(aggr){
          return ((aggr._measure[compId]===0) ? (me.height_hist-zeroPos) : (me.height_hist-heightCompare(aggr)))-zeroPos;
        };

        var dTime = 200;
        this.DOM["measure_Compare_Area_"+cT]
          .transition().duration(dTime)
          .attr("d", d3.area()
            .curve(d3.curveMonotoneX)
            .x (this.timeAxis_XFunc)
            //.y(me.height_hist+2-zeroPos)
            .y(yFunc));

        this.DOM["measure_Compare_Line_"+cT].transition().duration(dTime)
          .attr("y1",me.height_hist+3-zeroPos )
          .attr("y2",yFunc)
          .attr("x1",this.timeAxis_XFunc)
          .attr("x2",this.timeAxis_XFunc);
        return;
      }

      var _translateY = "translateY("+(me.height_hist-zeroPos)+"px) ";
      var _translateX = "translateX("+((curGroup+1)*binWidth)+"px) ";

      if(!this.isFiltered() || this.scaleType==='time' || this.stepTicks){
        // No partial rendering
        this.DOM["measure_Compare_"+cT].style("transform",function(aggr){
          return _translateY+_translateX+"scale("+binWidth+","+heightCompare(aggr)+")";
        });
      } else {
        // partial rendering
        var filter_min = this.summaryFilter.active.min;
        var filter_max = this.summaryFilter.active.max;
        var minPos = this.valueScale(filter_min);
        var maxPos = this.valueScale(filter_max);
        this.DOM["measure_Compare_"+cT].style("transform",function(aggr){
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
          return _translateY+translateX+"scale("+(width_self/2)+","+heightCompare(aggr)+")";
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
          .style("transform","translateY("+( this.height_hist * (1-this.browser.allRecordsAggr.ratioHighlightToTotal() ))+"px)")
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

      var zeroPos = this.chartScale_Measure(0);
      var getAggrHeight_Preview = function(aggr){
        var p=aggr.measure('Highlight');
        if(me.browser.preview_not) p = aggr.measure('Active')-p;
        if(me.browser.ratioModeActive){
          if(aggr._measure.Active===0) return -zeroPos;
          return (p / aggr.measure('Active'))*me.height_hist - zeroPos;
        } else {
          return me.chartScale_Measure(p) - zeroPos;
        }
      };

      if(this.scaleType==='time'){
        var yFunc = function(aggr){
          return ((aggr._measure.Highlight===0) ? (me.height_hist-zeroPos) : (me.height_hist-getAggrHeight_Preview(aggr)))-zeroPos;
        };
        var dTime=250;
        var x = this.DOM.measure_Highlight_Area
          .style("opacity",1)
          .transition().duration(dTime).ease(d3.easeCubic)
          .attr("d", 
            d3.area()
              .curve(d3.curveMonotoneX)
              .x(this.timeAxis_XFunc)
              .y0(this.height_hist - zeroPos)
              .y1(yFunc));
        var y = this.DOM.measure_Highlight_Line.transition().duration(dTime)
          .style("opacity",1)
          .attr("y1",me.height_hist - zeroPos)
          .attr("y2",yFunc)
          .attr("x1",this.timeAxis_XFunc)
          .attr("x2",this.timeAxis_XFunc);
        if(!this.browser.vizActive.Highlight){
          x.transition().style("opacity",0);
          y.transition().style("opacity",0);
        }
      } else {
        if(!this.browser.vizActive.Highlight){
          this.DOM.measure_Highlight.style("transform",
            "translateY("+(this.height_hist-zeroPos)+"px) "+
            "scale("+(width / (totalC+1))+",0)");
          return;
        }

        var _translateY = "translateY("+(me.height_hist - zeroPos)+"px) ";

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

        this.DOM.measure_Highlight.style("transform",function(aggr){
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
          }
          var _scale = "scale("+barWidth+","+getAggrHeight_Preview(aggr)+")";
          return _translateY+_translateX+_scale;
        });

      }
    },
    /** -- */
    refreshViz_Axis: function(){
      if(this.isEmpty() || this.collapsed) return;
      
      var me = this;
      var tickValues, maxValue;
      var chartAxis_Measure_TickSkip = me.height_hist/17;
      var axis_Scale = d3.scaleLinear()
        .clamp(false)
        .domain(this.chartScale_Measure.domain())
        .range (this.chartScale_Measure.range() );

      if(this.browser.ratioModeActive || this.browser.percentModeActive) {
        maxValue = (this.browser.ratioModeActive) ? 100
          : Math.round(100*me.getMaxAggr('Active')/me.browser.allRecordsAggr.measure('Active'));
        axis_Scale = d3.scaleLinear()
          .rangeRound([0, this.height_hist])
          .domain([0,maxValue])
          .clamp(true);
      }

      // GET TICK VALUES ***********************************************************
      tickValues = axis_Scale.ticks(chartAxis_Measure_TickSkip);
      if(axis_Scale.domain()[0]>=0){ 
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
      tickDoms.exit().transition().style("opacity",0).transition().remove();
      
      // add new ones
      var tickData_new=tickDoms.enter().append("span").attr("class","tick").style("opacity",0);

      tickData_new.append("span").attr("class","line");
      tickData_new.append("span").attr("class","text measureAxis_1");
      tickData_new.append("span").attr("class","text measureAxis_2");

      tickData_new.style("transform",function(d){ 
        return "translateY("+(me.height_hist-me.chartScale_Measure_prev(d))+"px)";
      });

      this.DOM.chartAxis_Measure_TickGroup.selectAll(".text")
        .html(function(d){ return me.browser.getTickLabel(d); });

      this.browser.setNoAnim(false);

      var transformFunc;
      if(me.browser.ratioModeActive){
        transformFunc=function(d){
          return "translateY("+ (me.height_hist-d*me.height_hist/100)+"px)";
        };
      } else {
        if(me.browser.percentModeActive){
          transformFunc=function(d){
            return "translateY("+(me.height_hist-(d/maxValue)*me.height_hist)+"px)";
          };
        } else {
          transformFunc=function(d){
            return "translateY("+(me.height_hist - axis_Scale(d))+"px)";
          };
        }
      }

      setTimeout(function(){
        me.DOM.chartAxis_Measure_TickGroup.selectAll("span.tick")
          .style("opacity",1)
          .style("transform",transformFunc);
      });
    },
    /** -- */
    refreshIntervalSlider: function(){
      if(this.DOM.intervalSlider===undefined) return;
        
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
        .style("transform",function(d){ return "translateX("+((d==="min")?minPos:maxPos)+"px)"; });
    },
    /** -- */
    refreshHeight: function(){
      if(!this.DOM.inited) return;
      this.DOM.valueTickGroup.style("height",this.height_labels+"px");
      this.DOM.rangeHandle.styles({
        height: ( this.height_hist+23)+"px",
        top:    (-this.height_hist-13)+"px" });
      this.DOM.highlightRangeLimits.style("height",this.height_hist+"px");

      this.DOM.histogram.style("height",(this.height_hist+this.height_hist_topGap)+"px")
      this.DOM.wrapper.style("height",(this.collapsed?"0":this.getHeight_Content())+"px");
      this.DOM.root.style("max-height",(this.getHeight()+1)+"px");

      this.refreshBins_Translate();

      this.refreshViz_Scale();
      this.refreshViz_Highlight();
      this.refreshViz_Compare_All();
      this.refreshViz_Axis();
    },
    /** -- */
    refreshWidth: function(){
      this.refreshScaleType();
      this.updateScaleAndBins();
      if(this.DOM.inited===false) return;
      var wideChart = this.isWideChart();
      
      this.DOM.wrapper.attr("showMeasureAxis_2",wideChart?"true":null);

      this.DOM.summaryInterval.styles({
        'width'        : this.getWidth()+"px",
        'padding-left' : this.width_measureAxisLabel+"px",
        'padding-right': ( wideChart ? this.width_measureAxisLabel : 11)+"px" });
      
      this.DOM.summaryName.style("max-width",(this.getWidth()-40)+"px");
    },
    /** -- */
    setHeight: function(targetHeight){
      if(this._aggrs===undefined) return;
      var c = targetHeight - this.getHeight_Header() - this.getHeight_Extra();
      if(this.height_hist===c) return;
      this.height_hist = c;
      this.updateBarScale2Active();
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
        .style("transform","translateX("+(me.valueScale(v)+offset)+"px)")
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
        this.quantile_val[distr+q] = d3.quantile(values,q/100);
      },this);

      var percentileChart = this.DOM.percentileGroup.select(".percentileChart_"+distr);

      percentileChart.styles({opacity: 1, "margin-left": (this.stepTicks ? ((this.aggrWidth/2)+"px") : null) });
      percentileChart.selectAll(".q_pos")
        .style("transform",function(q){ return "translateX("+me.valueScale(me.quantile_val[distr+q])+"px)"; });
      percentileChart.selectAll(".quantile.aggrGlyph")
        .style("transform",function(qb){
          var pos_1 = me.valueScale(me.quantile_val[distr+qb[0]]);
          var pos_2 = me.valueScale(me.quantile_val[distr+qb[1]]);
          return "translateX("+pos_1+"px) scaleX("+(pos_2-pos_1)+")";
        });
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

    this.prepareSetMatrixSorting();

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
    this._sets = this.setListSummary._aggrs; // sorted already
    this._sets.forEach(function(set){ set.setPairs = []; });

    this.createSetPairs();

    // Inserts the DOM root under the setListSummary so that the matrix view is attached...
    this.DOM.root = this.setListSummary.DOM.root.insert("div",":first-child")
      .attr("class","kshfSummary setPairSummary")
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
        var mouseInit_x = d3.mouse(d3.select("body").node())[0];
        console.log("mouseInit_x: "+mouseInit_x);
        var initWidth = me.getWidth();
        var myHeight = me.getHeight();
        d3.select("body").on("mousemove", function() {
          var mouseDif = d3.mouse(d3.select("body").node())[0]-mouseInit_x;
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
        var scrollDom = me.setListSummary.DOM.aggrGroup.node();
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

          var maxHeight = me.setListSummary.heightCat*me.setListSummary._aggrs.length - h;

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
  prepareSetMatrixSorting: function(){
    var me=this;
    // Update sorting options of setListSummary (adding relatednesness metric...)
    this.setListSummary.catSortBy[0].name = "# "+this.browser.recordName;
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
    return this.setListSummary.heightCat;
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
    this.summaryWidth = this.getHeight()+80;
    this.checkWidth();
  },
  /** -- */
  updateSetPairScale: function(){
    this.setPairDiameter = this.setListSummary.heightCat;
    this.setPairRadius = this.setPairDiameter/2;
  },
  /** -- */
  updateMaxAggr_Active: function(){
    this._maxSetPairAggr_Active = d3.max(this._setPairs, function(aggr){ return aggr.measure('Active'); });
  },
  /** -- */
  checkWidth: function(){
    var minv=160;
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
        this.tipsy = new Tipsy(this, { 
          gravity: "n", 
          title: "Color <i class='fa fa-circle'></i> by pair-wise strength"
        });
      })
      .on("mouseover",function(){ if(this.dragging!==true) this.tipsy.show(); })
      .on("mouseout" ,function(){ this.tipsy.hide(); })
      .on("click",function(){ me.browser.setScaleMode(me.browser.ratioModeActive!==true); });

    // ******************* STRENGTH CONFIG
    this.DOM.strengthControl.append("span").attr("class","strengthLabel").text("Weak");
    this.DOM.strengthControl.append("span").attr("class","strengthText").text("Strength");
    this.DOM.strengthControl.append("span").attr("class","strengthLabel").text("Strong");

    this.DOM.scaleLegend_SVG = this.DOM.summaryControls
      .append("svg").attrs({class: "sizeLegend", xmlns:"http://www.w3.org/2000/svg",})

    this.DOM.legendHeader = this.DOM.scaleLegend_SVG.append("text").attr("class","legendHeader").text("#");
    this.DOM.legend_Group = this.DOM.scaleLegend_SVG.append("g");
  },
  /** -- */
  insertRows: function(){
    var me=this;

    var newRows = this.DOM.setMatrixSVG.select("g.rows").selectAll("g.row")
      .data(this._sets, function(_set){ return _set.id(); })
    .enter().append("g").attr("class","row")
      .each(function(_set){ _set.DOM.matrixRow = this; })
      .on("mouseenter",function(_set){ me.setListSummary.onAggrHighlight(_set); })
      .on("mouseleave",function(_set){ me.setListSummary.onAggrLeave(_set); });

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
    aggr.set_1.DOM.aggrGlyph.setAttribute("catselect","and");
    aggr.set_2.DOM.aggrGlyph.setAttribute("catselect","and");
    this.browser.setSelect_Highlight(aggr);
  },
  /** -- */
  onSetPairLeave: function(aggr){
    aggr.set_1.DOM.matrixRow.removeAttribute("selection");
    aggr.set_2.DOM.matrixRow.removeAttribute("selection");
    aggr.set_1.DOM.aggrGlyph.removeAttribute("catselect");
    aggr.set_2.DOM.aggrGlyph.removeAttribute("catselect");
    this.browser.clearSelect_Highlight();
    this.browser.refreshMeasureLabels("Active");
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
      aggr.currentPreviewAngle = -Math.PI/2; });
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
  initializeAggregates: function(){
    // aggregates are initialized when the set summary is initialized.
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
    var nodes = this.setListSummary._aggrs;

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
      .style("width",w+"px")
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
        targetClique = new kshf.Aggregate_Set(me.setListSummary, set_1, set_2);

        me.browser.allAggregates.push(targetClique);
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
    this.DOM.aggrGlyphs.style("transform",function(setPair){
      var i1 = setPair.set_1.orderIndex;
      var i2 = setPair.set_2.orderIndex;
      var left = (Math.min(i1,i2)+0.5)*me.setPairDiameter;
      if(me.popupSide==="left") left = w-left;
      var top  = (Math.max(i1,i2)+0.5)*me.setPairDiameter;
      return "translate("+left+"px,"+top+"px)";
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
        var sizeRatio=(me.browser.ratioModeActive)?1:me.getCliqueSizeRatio(aggr);
        return function(t) {
          var newAngle = angleInterp(t);
          aggr.currentPreviewAngle = newAngle;
          return me.getPiePath(newAngle,(aggr.subset!=='' && me.browser.ratioModeActive)?2:0, sizeRatio);
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
    this.DOM["measure_Compare_"+cT].attr("d",function(aggr){
      var sizeRatio = (me.browser.ratioModeActive)?1:me.getCliqueSizeRatio(aggr);
      this.style.display = aggr.measure("Compare_"+cT)===0 ? "none" : "block";
      this.style.strokeWidth = strokeWidth;
      return me.getPiePath( me.getAngleToActive_rad(aggr,"Compare_"+cT), curGroup*strokeWidth, sizeRatio);
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
  isFiltered: function(){
    return this.setListSummary.isFiltered();
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
