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

if(typeof sendLog !== 'function'){
    sendLog = null;
}

// kshf namespace
var kshf = {
    surrogateCtor: function() {},
    // http://stackoverflow.com/questions/4152931/javascript-inheritance-call-super-constructor-or-use-prototype-chain
    extendClass: function(base, sub) {
      // Copy the prototype from the base to setup inheritance
      this.surrogateCtor.prototype = base.prototype;
      // Tricky huh?
      sub.prototype = new this.surrogateCtor();
      // Remember the constructor property was set wrong, let's fix it
      sub.prototype.constructor = sub;
    },
    summaryCount: 0,
    maxVisibleItems_Default: 100,
    scrollWidth: 19,
    attribPanelWidth: 220,
    previewTimeoutMS: 250,
    browsers: [],
    dt: {},
    dt_id: {},
    lang: {
        en: {
            ModifyBrowser: "Modify browser",
            OpenDataSource: "Open data source",
            ShowInfoCredits: "Show info &amp; credits",
            ShowFullscreen: "Fullscreen",
            RemoveFilter: "Remove filter",
            RemoveAllFilters: "Remove all filters",
            MinimizeSummary: "Close summary",
            OpenSummary: "Open summary",
            MaximizeSummary: "Maximize summary",
            RemoveSummary: "Remove summary",
            ReverseOrder: "Reverse order",
            Reorder: "Reorder",
            ShowMoreInfo: "Show more info",
            Percentiles: "Percentiles",
            LockToCompare: "Lock to compare",
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
            Relative: "Relative",
            Width: "Length",
            DragToFilter: "Drag to filter",
            And: "And",
            Or: "Or",
            Not: "Not",
            EditTitle: "Edit",
            ResizeBrowser: "Resize Browser",
            RemoveRecords: "Remove Record View"
        },
        tr: {
            ModifyBrowser: "Tarayıcıyı düzenle",
            OpenDataSource: "Veri kaynağını aç",
            ShowInfoCredits: "Bilgi",
            ShowFullscreen: "Tam ekran",
            RemoveFilter: "Filtreyi kaldır",
            RemoveAllFilters: "Tüm filtreleri kaldır",
            MinimizeSummary: "Özeti ufalt",
            OpenSummary: "Özeti aç",
            MaximizeSummary: "Özeti büyüt",
            RemoveSummary: "Özeti kaldır",
            ReverseOrder: "Ters sırala",
            Reorder: "Yeniden sırala",
            ShowMoreInfo: "Daha fazla bilgi",
            Percentiles: "Yüzdeler",
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
            Relative: "Görece",
            Width: "Genişlik",
            DragToFilter: "Sürükle ve filtre",
            And: "Ve",
            Or: "Veya",
            Not: "Değil",
            EditTitle: "Değiştir",
            ResizeBrowser: "Boyutlandır",
            RemoveRecords: "Kayıtları kaldır"
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
            Relative: "Relative",
            Width: "Largeur",
            DragToFilter: "??",
            And: "??",
            Or: "??",
            Not: "??",
        },
        cur: null // Will be set to en if not defined before a browser is loaded
    },

    LOG: {
        // Note: id parameter is integer alwats, info is string
        CONFIG                 : 1,
        // Filtering state
        // param: resultCt, selected(selected # of attribs, sep by x), filtered(filtered filter ids)
        FILTER_ADD             : 10,
        FILTER_CLEAR           : 11,
        // Filtering extra information, send in addition to filtering state messages above
        FILTER_CLEAR_ALL       : 12, // param: -
        FILTER_ATTR_ADD_AND    : 13, // param: id (filterID), info (attribID)
        FILTER_ATTR_ADD_OR     : 14, // param: id (filterID), info (attribID)
        FILTER_ATTR_ADD_ONE    : 15,
        FILTER_ATTR_ADD_OR_ALL : 16, // param: id (filterID)
        FILTER_ATTR_ADD_NOT    : 17, // param: id (filterID), info (attribID)
        FILTER_ATTR_EXACT      : 18, // param: id (filterID), info (attribID)
        FILTER_ATTR_UNSELECT   : 19, // param: id (filterID), info (attribID)
        FILTER_TEXTSEARCH      : 20, // param: id (filterID), info (query text)
        FILTER_INTRVL_HANDLE   : 21, // param: id (filterID) (TODO: Include range)
        FILTER_INTRVL_BIN      : 22, // param: id (filterID)
        FILTER_CLEAR_X         : 23, // param: id (filterID)
        FILTER_CLEAR_CRUMB     : 24, // param: id (filterID)
        FILTER_PREVIEW         : 25, // param: id (filterID), info (attribID for cat, histogram range (AxB) for interval)
        // Facet specific non-filtering interactions
        FACET_COLLAPSE         : 40, // param: id (facetID)
        FACET_SHOW             : 41, // param: id (facetID)
        FACET_SORT             : 42, // param: id (facetID), info (sortID)
        FACET_SCROLL_TOP       : 43, // param: id (facetID)
        FACET_SCROLL_MORE      : 44, // param: id (facetID)
        // List specific interactions
        LIST_SORT              : 50, // param: info (sortID)
        LIST_SCROLL_TOP        : 51, // param: -
        LIST_SHOWMORE          : 52, // param: info (itemCount)
        LIST_SORT_INV          : 53, // param: -
        // Item specific interactions
        ITEM_DETAIL_ON         : 60, // param: info (itemID)
        ITEM_DETAIL_OFF        : 61, // param: info (itemID)
        // Generic interactions
        DATASOURCE             : 70, // param: -
        INFOBOX                : 71, // param: -
        CLOSEPAGE              : 72, // param: -
        BARCHARTWIDTH          : 73, // param: info (width)
        RESIZE                 : 74, // param: -
    },
    Util: {
        sortFunc_List_String: function(a, b){
            return a.localeCompare(b);
        },
        sortFunc_List_Date: function(a, b){
            if(a===null) return -1;
            if(b===null) return 1;
            return a.getTime() - b.getTime();
        },
        sortFunc_List_Number: function(a, b){
            return b - a;
        },
        /** Given a list of columns which hold multiple IDs, breaks them into an array */
        cellToArray: function(dt, columns, splitExpr){
            if(splitExpr===undefined){
                splitExpr = /\b\s+/;
            }
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
                    // remove empty "" items
                    for(j=0; j<list2.length; j++){
                        list2[j] = list2[j].trim();
                        if(list2[j]!=="") list.push(list2[j]);
                    }
                    p[column] = list;
                });
            });
        },
        /** You should only display at most 3 digits + k/m/etc */
        formatForItemCount: function(n){
            if(n<1000) {
                return n;
            }
            if(n<1000000) {
                // 1,000-999,999
                var thousands=n/1000;
                if(thousands<10){
                    return (Math.floor(n/100)/10)+"k";
                }
                return Math.floor(thousands)+"k";
            }
            if(n<1000000000) return Math.floor(n/1000000)+"m";
            return n;
        },
        nearestYear: function(d){
            var dr = new Date(Date.UTC(d.getUTCFullYear(),0,1));
            if(d.getUTCMonth()>6) dr.setUTCFullYear(dr.getUTCFullYear()+1);
            return dr;
        },
        nearestMonth: function(d){
            var dr = new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1));
            if(d.getUTCDate()>15) dr.setUTCMonth(dr.getUTCMonth()+1);
            return dr;
        },
        nearestDay: function(d){
            var dr = new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));
            if(d.getUTCHours()>12) dr.setUTCDate(dr.getUTCDate()+1);
            return dr;
        },
        nearestHour: function(d){
        },
        nearestMinute: function(d){
        },
        clearArray: function(arr){
            while (arr.length > 0) {
              arr.pop();
            }
        },
        ignoreScrollEvents: false,
        scrollToPos_do: function(scrollDom, targetPos){
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
            var j = i % 10,
                k = i % 100;
            if (j == 1 && k != 11) {
                return i + "st";
            }
            if (j == 2 && k != 12) {
                return i + "nd";
            }
            if (j == 3 && k != 13) {
                return i + "rd";
            }
            return i + "th";
        },
    },
    style: {
        color_chart_background_highlight: "rgb(194, 146, 124)"
    },
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
      this.browsers.forEach(function(browser){
        browser.updateLayout();
      });
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
    /** -- */
    gistPublic: true,
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

};

// tipsy, facebook style tooltips for jquery
// Modified / simplified version for internal Keshif use
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

function Tipsy(element, options) {
  this.jq_element = $(element);
  this.options = $.extend({}, 
    {
      className: null,
      delayOut: 0,
      gravity: 'n',
      offset: 0,
      offset_x: 0,
      offset_y: 0,
      opacity: 1
    },
    options
  );
};
Tipsy.prototype = {
  show: function() {
    var maybeCall = function(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    };
    // hide active Tipsy
    if(kshf.activeTipsy) kshf.activeTipsy.hide();

    kshf.activeTipsy = this;

    var title = this.getTitle();
    if(!title) return;
    var jq_tip = this.tip();

    jq_tip.find('.tipsy-inner')['html'](title);
    jq_tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
    jq_tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);

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
            tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
            break;
        case 's':
            tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
            break;
        case 'e':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
            break;
        case 'w':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
            break;
    }
    tp.top+=this.options.offset_y;
    tp.left+=this.options.offset_x;

    if (gravity.length == 2) {
      if (gravity.charAt(1) == 'w') {
        tp.left = pos.left + pos.width / 2 - 15;
      } else {
        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
      }
    }

    jq_tip.css(tp).addClass('tipsy-' + gravity);
    jq_tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
    if (this.options.className) {
      jq_tip.addClass(maybeCall(this.options.className, this.jq_element[0]));
    }

    jq_tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity},200);
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
kshf.Item = function(d, idIndex){
    // the main data within item
    this.data = d;
    this.idIndex = idIndex; // TODO: Items don't need to have ID index, only one per table is enough??
    // Selection state
    //  1: selected for inclusion (AND)
    //  2: selected for inclusion (OR)
    // -1: selected for removal (NOT query)
    //  0: not selected
    this.selected = 0;
    // Items which are mapped/related to this item
    this.items = [];

    // By default, each item is aggregated as 1
    // You can modify this with a non-negative value
    // Note that the aggregation currently works by summation only.
    this.aggregate_Self = 1;

    this.aggregate_Active = 0;  // Active aggregate value
    this.aggregate_Preview = 0; // Previewed aggregate value
    this.aggregate_Total = 0;   // Total aggregate value

    // If true, filter/wanted state is dirty and needs to be updated.
    this._filterCacheIsDirty = true;
    // Cacheing filter state per each summary
    this.filterCache = [];
    // Wanted item / not filtered out
    this.isWanted = true;
    // Used by recordDisplay to adjust animations. Only used by primary entity type for now.
    this.visibleOrder = 0;
    this.visibleOrder_pre = -1;
    // The data that's used for mapping this item, used as a cache.
    // This is accessed by filterID
    // Through this, you can also reach mapped DOM items
        // DOM elements that this item is mapped to
        // - If this is a paper, it can be paper type. If this is author, it can be author affiliation.
    this.mappedDataCache = []; // caching the values this item was mapped to

    this.DOM = {};
    // If item is primary type, this will be set
    this.DOM.record = undefined;
    // If item is used as a filter (can be primary if looking at links), this will be set
    this.DOM.aggrGlyph  = undefined;
    // If true, updatePreview has propogated changes above
    this.updatePreview_Cache = false;
};
kshf.Item.prototype = {
    /** Returns unique ID of the item. */
    id: function(){
        return this.data[this.idIndex];
    },
    /** -- */
    setFilterCache: function(index,v){
        if(this.filterCache[index]===v) return;
        this.filterCache[index] = v;
        this._filterCacheIsDirty = true;
    },

    /** -- */
    f_selected: function(){ return this.selected!==0; },
    f_included: function(){ return this.selected>0; },

    is_NONE:function(){ return this.selected===0; },
    is_NOT: function(){ return this.selected===-1; },
    is_AND: function(){ return this.selected===1; },
    is_OR : function(){ return this.selected===2; },

    set_NONE: function(){
      if(this.inList!==undefined) {
        this.inList.splice(this.inList.indexOf(this),1);
      }
      this.inList = undefined;
      this.selected = 0; this.refreshFacetDOMSelected();
    },
    set_NOT: function(l){
      if(this.is_NOT()) return;
      this._insertToList(l);
      this.selected =-1; this.refreshFacetDOMSelected();
    },
    set_AND: function(l){
      if(this.is_AND()) return;
      this._insertToList(l);
      this.selected = 1; this.refreshFacetDOMSelected();
    },
    set_OR: function(l){
      if(this.is_OR()) return;
      this._insertToList(l);
      this.selected = 2; this.refreshFacetDOMSelected();
    },

    _insertToList: function(l){
      if(this.inList!==undefined) {
        this.inList.splice(this.inList.indexOf(this),1);
      }
      this.inList = l;
      l.push(this);
    },

    refreshFacetDOMSelected: function(){
      if(this.DOM.aggrGlyph) this.DOM.aggrGlyph.setAttribute("selected",this.selected);
    },

    /** -- */
    addItem: function(item){
      this.items.push(item);
      this.aggregate_Total+=item.aggregate_Self;
      this.aggregate_Active+=item.aggregate_Self;
    },
    /**
     * Updates isWanted state, and notifies all related filter attributes of the change.
     */
    updateWanted: function(){
        if(!this._filterCacheIsDirty) return false;

        var me=this;
        var oldWanted = this.isWanted;

        // Checks if all filter results are true. At first "false", breaks the loop
        this.isWanted=true;
        this.filterCache.every(function(f){
            me.isWanted=me.isWanted&&f;
            return me.isWanted;
        });

        if(this.isWanted===true && oldWanted===false){
            // wanted now
            this.mappedDataCache.forEach(function(m){
                if(m===null) return;
                if(m.h){ // interval
                    if(m.b) m.b.aggregate_Active+=this.aggregate_Self;
                } else { // categorical
                    m.forEach(function(_cat){
                        var oldVal = _cat.aggregate_Active;
                        _cat.aggregate_Active+=this.aggregate_Self;
                    },this);
                }
            },this);
        } else if(this.isWanted===false && oldWanted===true){
            // unwanted now
            this.mappedDataCache.forEach(function(m){
                if(m===null) return;
                if(m.h){ // interval
                    if(m.b) m.b.aggregate_Active-=this.aggregate_Self;
                } else { // categorical
                    m.forEach(function(_cat){
                        _cat.aggregate_Active-=this.aggregate_Self;
                    },this);
                }
            },this);
        }

        this._filterCacheIsDirty = false;
        return this.isWanted !== oldWanted;
    },
    /** Only updates wanted state if it is currently not wanted (resulting in More wanted items) */
    updateWanted_More: function(){
        if(this.isWanted) return false;
        return this.updateWanted();
    },
    /** Only updates wanted state if it is currently wanted (resulting in Less wanted items) */
    updateWanted_Less: function(){
        if(!this.isWanted) return false;
        return this.updateWanted();
    },
    /** -- */
    updatePreview: function(){
      if(!this.isWanted) return;

      if(this.updatePreview_Cache===false){
        this.updatePreview_Cache = true; // Cannot updatePreview twice
      } else {
        return;
      }

      this.highlighted = true;
      if(this.DOM.record) this.DOM.record.setAttribute("highlight",true);

      this.mappedDataCache.forEach(function(m){
        if(m===null) return;
        if(m.h) {
          if(m.b && m.b.aggregate_Active>0) m.b.aggregate_Preview+=this.aggregate_Self;
        } else {
          m.forEach(function(item){ item.aggregate_Preview+=this.aggregate_Self; },this);
      }
      },this);
    },
    /** Called on mouse-over on a primary item type */
    highlightRecord: function(){
      if(this.DOM.record) { // record display
        this.DOM.record.setAttribute("highlight","selected");
      }
      // summaries that this item appears in
      this.mappedDataCache.forEach(function(d){
        if(d===null) return; // no mapping for this index
        if(d.h){ // interval summary
          d.h.setRecordValue(d.v);
        } else { // categorical summary
          d.forEach(function(item){ 
            if(item.DOM.aggrGlyph) { // basic summary aggregate
              item.DOM.aggrGlyph.setAttribute("highlight",true);
            }
            if(item.DOM.matrixRow) { // set matrix
              item.DOM.matrixRow.setAttribute("highlight","selected");
            }
          },this);
        }
      },this);
    },
    /** -- */
    nohighlightAggregate: function(){
      if(this.DOM.record) {
        this.highlighted = false;
        this.DOM.record.setAttribute("highlight",false);
      }
      if(this.DOM.aggrGlyph) this.DOM.aggrGlyph .setAttribute("highlight",false);
      if(this.DOM.matrixRow) this.DOM.matrixRow.setAttribute("highlight",false);
    },
    /** -- */
    nohighlightRecord: function(){
      if(this.DOM.record) {
        this.highlighted = false;
        this.DOM.record.setAttribute("highlight",false);
      }
      // summaries that this item appears in
      this.mappedDataCache.forEach(function(d){
        if(d===null) return; // no mapping for this index
        if(d.h){ // interval summary
          d.h.hideRecordValue();
        } else { // categorical summary
          d.forEach(function(item){ item.nohighlightAggregate(); },this);
        }
      },this);
    },
    /** -- */
    setRecordDetails: function(value){
      this.showDetails = value;
      if(this.DOM.record) this.DOM.record.setAttribute('details', this.showDetails);
    },
};

kshf.Filter = function(id, opts){
    this.isFiltered = false;

    this.browser = opts.browser;
    this.parentSummary = opts.parentSummary;

    this.onClear = opts.onClear;
    this.onFilter = opts.onFilter;
    this.hideCrumb = opts.hideCrumb || false;
    this.filterView_Detail = opts.filterView_Detail; // must be a function

    this.id = id;
    this.parentSummary.items.forEach(function(item){
        item.setFilterCache(this.id,true);
    },this);
    this.how = "All";
    this.filterCrumb = null;
};
kshf.Filter.prototype = {
    addFilter: function(forceUpdate){
        this.isFiltered = true;

        if(this.onFilter) this.onFilter.call(this,this.parentSummary);

        var stateChanged = false;

        var how=0;
        if(this.how==="LessResults") how = -1;
        if(this.how==="MoreResults") how = 1;

        this.parentSummary.items.forEach(function(item){
            // if you will show LESS results and item is not wanted, skip
            // if you will show MORE results and item is wanted, skip
            if(!(how<0 && !item.isWanted) && !(how>0 && item.isWanted)){
                var changed = item.updateWanted();
                stateChanged = stateChanged || changed;
            }
        },this);

        this._refreshFilterSummary();

        if(forceUpdate===true){
            this.browser.update_Records_Wanted_Count();
            this.browser.refresh_filterClearAll();
            this.browser.clearSelect_Highlight();
            if(stateChanged) this.browser.updateAfterFilter();
        }
    },
    /** -- */
    clearFilter: function(forceUpdate, updateWanted){
        if(!this.isFiltered) return;

        this.isFiltered = false;

        // clear filter cache - no other logic is necessary
        this.parentSummary.items.forEach(function(item){ item.setFilterCache(this.id,true); },this);

        if(updateWanted!==false){
            this.parentSummary.items.forEach(function(item){
                if(!item.isWanted) item.updateWanted();
            });
        }

        this._refreshFilterSummary();

        if(this.onClear) this.onClear.call(this,this.parentSummary);

        if(forceUpdate!==false){
            this.browser.update_Records_Wanted_Count();
            this.browser.refresh_filterClearAll();
            this.browser.updateAfterFilter();
        }
    },

    /** Don't call this directly */
    _refreshFilterSummary: function(){
        if(this.hideCrumb===true) return;
        if(!this.isFiltered){
            var root = this.filterCrumb;
            if(root===null || root===undefined) return;
            root.attr("ready",false);
            setTimeout(function(){ root[0][0].parentNode.removeChild(root[0][0]); }, 350);
            this.filterCrumb = null;
        } else {
            // insert DOM
            if(this.filterCrumb===null) {
                this.filterCrumb = this.browser.insertDOM_crumb("filter",this);
            }
            this.filterCrumb.select(".crumbHeader").html(this.parentSummary.summaryName);
            this.filterCrumb.select(".filterDetails").html(this.filterView_Detail.call(this, this.parentSummary));
        }
    },
};

/** -- */
kshf.RecordDisplay = function(kshf_, config, root){
    var me = this;
    this.browser = kshf_;
    this.DOM = {};

    this.config = config;

    this.autoExpandMore = true;
    if(config.autoExpandMore===false) this.autoExpandMore = false;

    this.maxVisibleItems_Default = config.maxVisibleItems_Default || kshf.maxVisibleItems_Default;
    this.maxVisibleItems = this.maxVisibleItems_Default; // This is the dynamic property

    this.showRank = config.showRank || false;

    this.displayType   = config.displayType   || 'list'; // 'grid', 'list'
    if(config.geo) this.displayType = 'map';
    this.detailsToggle = config.detailsToggle || 'zoom'; // 'one', 'zoom', 'off' (any other string counts as off practically)

    this.textSearchSummary = null; // no text search summary by default
    this.recordViewSummary = null;

    /***********
     * SORTING OPTIONS
     *************************************************************************/
    config.sortingOpts = config.sortBy; // depracated option (sortingOpts)

    this.sortingOpts = config.sortingOpts || [ {title:this.browser.items[0].idIndex} ]; // Sort by id by default
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
    this.setSortingOpt_Active(firstSortOpt || this.sortingOpts[0]);

    this.DOM.root = root.select(".recordDisplay")
        .attr('detailsToggle',this.detailsToggle)
        .attr('displayType',this.displayType)
        .attr('showRank',this.showRank)
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
    
    this.DOM.recordViewHeader = this.DOM.root.append("div").attr("class","recordDisplay--Header");
    this.initDOM_RecordViewHeader();

    if(this.displayType==="map"){
      this.DOM.recordMap_Base = this.DOM.root.append("div").attr("class","recordMap_Base");

      this.leafletMap = L.map(this.DOM.recordMap_Base[0][0], 
        {
          //maxBoundsViscosity: 1,
          //continuousWorld: true
        })
        // Using openstreetmap tiles
        .addLayer(new L.TileLayer(
          "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
          {
            //noWrap: true,
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>'
          }
          )) 
        .on("viewreset",function(){ 
          me.map_projectRecords()
        })
        .on("movestart",function(){
          me.DOM.recordGroup.style("display","none");
        })
        .on("move",function(){
          // console.log("MapZoom: "+me.leafletMap.getZoom());
          // me.map_projectRecords()
        })
        .on("moveend",function(){
          me.DOM.recordGroup.style("display","block");
          me.map_projectRecords()
        })
        ;

      //var width = 500, height = 500;
      //var projection = d3.geo.albersUsa().scale(900).translate([width / 2, height / 2]);
      this.geoPath = d3.geo.path().projection( 
        d3.geo.transform({
          // Use Leaflet to implement a D3 geometric transformation.
          point: function(x, y) {
            if(x>160) x-=360;
            var point = me.leafletMap.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
          }
        }) 
      );

      this.DOM.recordMap_SVG = d3.select(this.leafletMap.getPanes().overlayPane)
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

      this.DOM.recordGroup = this.DOM.recordMap_SVG.append("g")
          .attr("class", "leaflet-zoom-hide recordGroup");

      // Add custom controls
      var DOM_control = d3.select(this.leafletMap.getContainer()).select(".leaflet-control");

      DOM_control.append("a")
        .attr("class","leaflet-control-view-map").attr("title","Show/Hide Map")
        .attr("href","#")
        .html("<span class='viewMap fa fa-map-o'></span>")
        .on("dblclick",function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
          return true;
        })
        .on("click",function(){
          var x = me.leafletMap.getPanes().tilePane.style
          x.display = (x.display==="none")?"":"none";
          d3.select(this.childNodes[0]).attr("class","fa fa-map"+((x.display==="none")?"":"-o"));
          d3.event.preventDefault();
          d3.event.stopPropagation();
          return true;
        });

      DOM_control.append("a")
        .attr("class","leaflet-control-viewFit").attr("title","Fit View")
        .attr("href","#")
        .html("<span class='viewFit fa fa-dot-circle-o'></span>")
        .on("dblclick",function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
          return true;
        })
        .on("click",function(){
          me.map_zoomToWanted();
          d3.event.preventDefault();
          d3.event.stopPropagation();
          return true;
        });
    } else {
      // displayType is list or grid
      this.DOM.recordGroup = this.DOM.root.append("div").attr("class","recordGroup")
        .on("scroll",function(d){
          if(this.scrollHeight-this.scrollTop-this.offsetHeight<10){
            if(me.autoExpandMore===false){
              me.DOM.showMore.attr("showMoreVisible",true);
            } else {
              me.showMore(); // automatically add more records
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
          root.style('cursor','ew-resize');
          var _this = this;
          var mouseDown_x = d3.mouse(document.body)[0];
          var mouseDown_width = me.sortColWidth;

          me.browser.DOM.pointerBlock.attr("active","");

          root.on("mousemove", function() {
            _this.setAttribute("dragging","");
            me.setSortColumnWidth(mouseDown_width+(d3.mouse(document.body)[0]-mouseDown_x));
          }).on("mouseup", function(){
            root.style('cursor','default');
            me.browser.DOM.pointerBlock.attr("active",null);
            root.on("mousemove", null).on("mouseup", null);
            _this.removeAttribute("dragging");
          });
          d3.event.preventDefault();
        });

      this.DOM.showMore = this.DOM.root.append("div").attr("class","showMore")
        .attr("showMoreVisible",false)
        .on("mouseenter",function(){ d3.select(this).selectAll(".loading_dots").attr("anim",true); })
        .on("mouseleave",function(){ d3.select(this).selectAll(".loading_dots").attr("anim",null); })
        .on("click",function(){ me.showMore(); });
      this.DOM.showMore.append("span").attr("class","MoreText").html("Show More");
      this.DOM.showMore.append("span").attr("class","Count CountAbove");
      this.DOM.showMore.append("span").attr("class","Count CountBelow");
      this.DOM.showMore.append("span").attr("class","loading_dots loading_dots_1");
      this.DOM.showMore.append("span").attr("class","loading_dots loading_dots_2");
      this.DOM.showMore.append("span").attr("class","loading_dots loading_dots_3");
    }

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
          this.browser.createSummary('_RecordView_',config.recordView,'categorical')
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
                if(summary){
                    this.setTextSearchSummary(summary);
                } else {
                    if(typeof(value)==="function"){
                        this.setTextSearchSummary(browser.createSummary(name,value,'categorical'));
                    } else if(typeof(value)==="string"){
                        this.setTextSearchSummary(browser.changeSummaryName(value,name));
                    };
                }
            }
        }
    }
};

kshf.RecordDisplay.prototype = {
    /** -- */
    setHeight: function(v){
      if(this.recordViewSummary===null) return;
      if(this.displayType==="map"){
        this.DOM.recordMap_Base.style("height",v+"px");
        if(this.DOM.recordMap_SVG) this.DOM.recordMap_SVG.style("height",v+"px");
        if(this.leafletMap) this.leafletMap.invalidateSize();
      } else {
        this.DOM.recordGroup.style("height",v+"px");
      }
    },
    /** -- */
    map_refreshColorScale: function(){
      var me = this;
      this.DOM.mapColorScaleBins
        .style("background-color", function(d){
          if(me.sortingOpt_Active.invertColorScale) d = 8-d;
          return kshf.colorScale[me.browser.mapColorTheme][d];
        });
    },
    /** --  */
    map_projectRecords: function(){
      var me = this;
      var _geo_ = this.config.geo;
      this.DOM.kshfRecords.attr("d", function(record){ return me.geoPath(record.data[_geo_]); });
    },
    /** --  */
    map_projectFeatures_2: function(){
      // TODO: This should just move the SVG element (translate / scale, and do not re-compute the paths)
    },
    /** -- */
    map_zoomToWanted: function(){
      // Insert the bounds for each record path into the bs
      var bs = [];
      var _geo_ = this.config.geo;
      this.browser.items.forEach(function(d){
        if(!d.isWanted) return;
        var feature = d.data[_geo_];
        if(feature===undefined) return;
        var b = d3.geo.bounds(feature);
        // Change wrapping (US World wrap issue)
        if(b[0][0]>170) b[0][0]-=360;
        if(b[1][0]>170) b[1][0]-=360;
        bs.push(L.latLng(b[0][1], b[0][0]));
        bs.push(L.latLng(b[1][1], b[1][0]));
      });

      if(this.asdsds===undefined){ // First time: just fit bounds
        this.asdsds = true;
        this.leafletMap.fitBounds(
          new L.LatLngBounds(bs),
          { padding: [0,0], 
            pan: {animate: true, duration: 1.2}, 
            zoom: {animate: true} 
          } );
        return;
      }
      this.leafletMap.flyToBounds(
        new L.LatLngBounds(bs),
        { padding: [0,0], 
          pan: {animate: true, duration: 1.2}, 
          zoom: {animate: true} 
        } );
    },
    /** -- */
    initDOM_RecordViewHeader: function(){
      var me=this;

      this.DOM.mapColorScaleBins =  this.DOM.recordViewHeader.append("div").attr("class","mapColorScale")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'e', title: "Change color scale"}); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout" ,function(){ this.tipsy.hide(); })
        .on("click",function(){
          if(me.browser.mapColorTheme==="converge"){
            me.browser.mapColorTheme = "diverge";
          } else {
            me.browser.mapColorTheme = "converge";
          }
          me.map_updateRecordColor();
          me.map_refreshColorScale();
          me.sortingOpt_Active.map_refreshColorScale();
        })
        .selectAll(".mapColorScaleBin").data([0,1,2,3,4,5,6,7,8])
          .enter().append("div").attr("class","mapColorScaleBin");
      
      this.map_refreshColorScale();

      this.DOM.recordViewHeader.append("div").attr("class","itemRank_control fa")
        .each(function(){
          this.tipsy = new Tipsy(this, {gravity: 'n', title: function(){ return (me.showRank?"Hide":"Show")+" ranking"; }});
        })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout" ,function(){ this.tipsy.hide(); })
        .on("click",function(){
          me.setShowRank(!me.showRank);
          d3.event.preventDefault();
          d3.event.stopPropagation();
      });

      this.initDOM_SortSelect();
      this.initDOM_GlobalTextSearch();

      this.DOM.recordViewHeader.append("div").attr("class","buttonRecordViewRemove fa fa-times")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'ne', title: kshf.lang.cur.RemoveRecords }); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .on("click",    function(){ me.removeRecordViewSummary(); });

      this.DOM.scrollToTop = this.DOM.recordViewHeader.append("div").attr("class","scrollToTop fa fa-arrow-up")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'e', title: kshf.lang.cur.ScrollToTop }); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout", function(){ this.tipsy.hide(); })
        .on("click",function(d){ kshf.Util.scrollToPos_do(me.DOM.recordGroup[0][0],0); });
    },
    /* -- */
    initDOM_GlobalTextSearch: function(){
      var me=this;

      this.textFilter = this.browser.createFilter({
        parentSummary: this.browser, 
        hideCrumb: true,
        onClear: function(){
          me.DOM.recordTextSearch.select(".clearSearchText").style('display','none');
          me.DOM.recordTextSearch.selectAll(".textSearchMode").style("display","none"); 
          me.DOM.recordTextSearch.select("input")[0][0].value = "";
        },
        onFilter: function(){
          me.DOM.recordTextSearch.select(".clearSearchText").style('display','inline-block');

          var query = [];

          // split the input by " character
          var processed = this.filterStr.split('"');
          processed.forEach(function(block,i){
              if(i%2===0) {
                  block.split(/\s+/).forEach(function(q){ query.push(q)});
              } else {
                  query.push(block);
              }
          });

          // Remove the empty strings
          query = query.filter(function(v){ return v!==""});

          me.DOM.recordTextSearch.selectAll(".textSearchMode").style("display",query.length>1?"inline-block":"none"); 

          // go over all the items in the list, search each keyword separately
          // If some search matches, return true (any function)
          var summaryFunc = me.textSearchSummary.summaryFunc;
          me.browser.items.forEach(function(item){
            var f;
            if(me.textFilter.multiMode==='or') 
              f = ! query.every(function(v_i){
                var v = summaryFunc.call(item.data,item);
                if(v===null || v===undefined) return true;
                return (""+v).toLowerCase().indexOf(v_i)===-1;
              });
            if(me.textFilter.multiMode==='and')
              f = query.every(function(v_i){
                var v = summaryFunc.call(item.data,item);
                return (""+v).toLowerCase().indexOf(v_i)!==-1;
              });
            item.setFilterCache(this.id,f);
          },this);
        },
      });
      this.textFilter.multiMode = 'and';

      this.DOM.recordTextSearch = this.DOM.recordViewHeader.append("span").attr("class","recordTextSearch");

      var x= this.DOM.recordTextSearch.append("div").attr("class","dropZone_textSearch")
        .on("mouseenter",function(){ this.style.backgroundColor = "rgb(255, 188, 163)"; })
        .on("mouseleave",function(){ this.style.backgroundColor = ""; })
        .on("mouseup"   ,function(){ me.setTextSearchSummary(me.movedSummary); });
      x.append("div").attr("class","dropZone_textSearch_text").text("Text search");

      this.DOM.recordTextSearch.append("i").attr("class","fa fa-search searchIcon");
      this.DOM.recordTextSearch.append("input").attr("class","mainTextSearch_input")
        .on("keydown",function(){
          var x = this;
          if(this.timer) clearTimeout(this.timer);
          this.timer = setTimeout( function(){
            me.textFilter.filterStr = x.value.toLowerCase();
            if(me.textFilter.filterStr!=="") {
              me.textFilter.addFilter(true);
            } else {
              me.textFilter.clearFilter();
            }
            x.timer = null;
          }, 750);
        });
      this.DOM.recordTextSearch.append("span").attr("class","fa fa-times-circle clearSearchText")
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'ne', title: kshf.lang.cur.RemoveFilter }); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout",function(){ this.tipsy.hide(); })
        .on("click",function() { me.textFilter.clearFilter(); });
      
      this.DOM.textSearchMode_And = this.DOM.recordTextSearch.append("span")
        .attr("class","textSearchMode").attr("mode","and").attr("active",true)
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'ne', title: "All words<br> must appear." }); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout",function(){ this.tipsy.hide(); })
        .on("click",function() { 
          me.DOM.textSearchMode_Or.attr("active",false);
          me.DOM.textSearchMode_And.attr("active",true);
          me.textFilter.multiMode = "and";
          me.textFilter.addFilter(true);
        })
        ;
      this.DOM.textSearchMode_Or = this.DOM.recordTextSearch.append("span")
        .attr("class","textSearchMode").attr("mode","or").attr("active",false)
        .each(function(){ this.tipsy = new Tipsy(this, {gravity: 'ne', title: "At least one word<br> must appear." }); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout",function(){ this.tipsy.hide(); })
        .on("click",function() { 
          me.DOM.textSearchMode_Or.attr("active",true);
          me.DOM.textSearchMode_And.attr("active",false);
          me.textFilter.multiMode = "or";
          me.textFilter.addFilter(true);
        })
        ;
    },
    /** -- */
    setRecordViewSummary: function(summary){
      if(summary===undefined || summary===null) return;
      if(this.recordViewSummary===summary) return;
      if(this.recordViewSummary) this.removeRecordViewSummary();

      this.DOM.root.attr('hasRecordView',true);
      this.recordViewSummary = summary;
      this.recordViewSummary.isRecordView = true;
      this.recordViewSummary.refreshNuggetDisplay();

      this.sortRecords();
      this.updateVisibleIndex();
      this.refreshRecordDOM();
      this.setSortColumnWidth(this.config.sortColWidth || 50); // default: 50px;

      this.browser.DOM.root.attr("record_display",this.displayType);
    },
    /** -- */
    removeRecordViewSummary: function(){
      if(this.recordViewSummary===null) return;
      this.DOM.root.attr("hasRecordView",false);
      this.recordViewSummary.isRecordView = false;
      this.recordViewSummary.refreshNuggetDisplay();
      this.recordViewSummary = null;
      this.browser.DOM.root.attr("record_display","none");
    },
    /** -- */
    setTextSearchSummary: function(summary){
      if(summary===undefined || summary===null) return;
      //if(this.textSearchSummary===summary) return;
      this.textSearchSummary = summary;
      this.textSearchSummary.isTextSearch = true;
      this.DOM.recordTextSearch
        .attr("isActive",true)
        .select("input").attr("placeholder", kshf.lang.cur.Search+": "+summary.summaryName);
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

        this.DOM.header_listSortColumn = this.DOM.recordViewHeader.append("div")
            .attr("class","header_listSortColumn");
        var x=this.DOM.header_listSortColumn.append("div").attr("class","dropZone_resultSort")
            .on("mouseenter",function(){ this.style.backgroundColor = "rgb(255, 188, 163)"; })
            .on("mouseleave",function(){ this.style.backgroundColor = ""; })
            .on("mouseup",function(event){
                me.addSortingOption(me.browser.movedSummary);
                me.setSortingOpt_Active(me.sortingOpts.length-1);
                me.DOM.listSortOptionSelect[0][0].selectedIndex = me.sortingOpts.length-1;
            })
            ;
        x.append("span").attr("class","dropZone_resultSort_text");

        this.DOM.listSortOptionSelect = this.DOM.header_listSortColumn.append("select")
            .attr("class","listSortOptionSelect")
            .on("change", function(){
                me.setSortingOpt_Active(this.selectedIndex);
            });

        this.refreshSortingOptions();

        this.DOM.removeSortOption = this.DOM.recordViewHeader
            .append("span").attr("class","removeSortOption_wrapper")
            .append("span").attr("class","removeSortOption fa")
            .each(function(){
                this.tipsy = new Tipsy(this, {gravity: 'n', title: "Remove current sorting option" });
            })
            .style("display",(this.sortingOpts.length<2)?"none":"inline-block")
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("click",function(){
                var index=-1;
                me.sortingOpts.forEach(function(o,i){ if(o===me.sortingOpt_Active) index=i; })
                if(index!==-1){
                    me.sortingOpts.splice(index,1);
                    if(index===me.sortingOpts.length) index--;
                    me.prepSortingOpts();
                    me.setSortingOpt_Active(index);
                    me.refreshSortingOptions();
                    me.DOM.listSortOptionSelect[0][0].selectedIndex = index;
                }
            })

        this.DOM.recordViewHeader.append("span").attr("class","sortColumn sortButton fa")
            .on("click",function(d){
                me.sortingOpt_Active.inverse = me.sortingOpt_Active.inverse?false:true;
                this.setAttribute("inverse",me.sortingOpt_Active.inverse);
                me.browser.items.reverse();

                me.updateVisibleIndex();
                me.refreshRecordDOM();
                me.refreshRecordRanks(me.DOM.recordRanks);

                me.DOM.kshfRecords = me.DOM.recordGroup.selectAll(".kshfRecord")
                    .data(me.browser.items, function(record){ return record.id(); })
                    .order();
                kshf.Util.scrollToPos_do(me.DOM.recordGroup[0][0],0);
            })
            .each(function(){
                this.tipsy = new Tipsy(this, { gravity: 'w', title: kshf.lang.cur.ReverseOrder });
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(){ this.tipsy.hide(); });
    },
    /** -- */
    refreshRecordRanks: function(d3_selection){
      if(!this.showRank) return; // Do not refresh if not shown...
      d3_selection.text(function(d){ return (d.visibleOrder<0)?"":d.visibleOrder+1; });
    },
    /** -- */
    setSortColumnWidth: function(v){
      if(this.displayType!=='list') return;
      this.sortColWidth = Math.max(Math.min(v,110),30); // between 30 and 110 pixels
      this.DOM.recordsSortCol.style("width",this.sortColWidth+"px");
      this.refreshAdjustSortColumnWidth();
    },
    /** -- */
    refreshRecordSortLabels: function(d3_selection){
      if(this.displayType!=="list") return; // Only list-view allows sorting
      var labelFunc=this.sortingOpt_Active.sortLabel;
      var unitName =this.sortingOpt_Active.unitName;
      var sortColformat = d3.format(".s");
      if(this.sortingOpt_Active.hasTime){
        sortColformat = d3.time.format("%Y");
      }
      d3_selection.html(function(d){
        var s=labelFunc.call(d.data);
        if(s===null || s===undefined) return "";
        this.setAttribute("title",s);
        if(typeof s!=="string") s = sortColformat(s);
        if(unitName) s+="<span class='unitName'>"+unitName+"</span>";
        return s;
      });
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
          me.DOM.listSortOptionSelect[0][0].selectedIndex = i;
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
            if(sortOpt.title){
                sortOpt.name = sortOpt.title;
            }

            var summary = this.browser.summaries_by_name[sortOpt.name];
            if(summary===undefined){
                if(typeof(sortOpt.value)==="string"){
                    summary = this.browser.changeSummaryName(sortOpt.value,sortOpt.name);
                } else{
                    summary = this.browser.createSummary(sortOpt.name,sortOpt.value, "interval");
                    if(sortOpt.unitName){
                        summary.setUnitName(sortOpt.unitName);
                    }
                }
            }

            summary.sortingSummary  = true;
            summary.sortLabel   = sortOpt.label || summary.summaryFunc;
            summary.sortInverse = sortOpt.inverse  || false;
            summary.sortFunc    = sortOpt.sortFunc || this.getSortFunc(summary.summaryFunc);

            this.sortingOpts[i] = summary;
        },this);

        // Sort sorting options alphabetically
        this.sortingOpts.sort(function(s1,s2){ 
            return s1.summaryName.localeCompare(s2.summaryName, { sensitivity: 'base' });});

        if(this.DOM.removeSortOption)
            this.DOM.removeSortOption.style("display",(this.sortingOpts.length<2)?"none":"inline-block");
    },
    /** -- */
    setSortingOpt_Active: function(index){
      if(this.sortingOpt_Active){
        if(this.sortingOpt_Active.DOM.root)
          this.sortingOpt_Active.DOM.root.attr("usedForSorting","false");
        this.sortingOpt_Active.usedForSorting = false;
      }
      
      if(typeof index === "number"){
        if(index<0 || index>=this.sortingOpts.length) return;
        this.sortingOpt_Active = this.sortingOpts[index];
      } else if(index instanceof kshf.Summary_Base){
        this.sortingOpt_Active = index;
      }

      this.sortingOpt_Active.usedForSorting = true;

      if(this.sortingOpt_Active.DOM.root)
        this.sortingOpt_Active.DOM.root.attr("usedForSorting","true");

      if(this.DOM.root===undefined) return;
      if(this.displayType==="map"){
        this.map_updateRecordColor();
      } else {
        this.sortRecords();
        this.updateVisibleIndex();
        this.refreshRecordDOM();
        this.refreshRecordRanks(this.DOM.recordRanks);
        kshf.Util.scrollToPos_do(this.DOM.recordGroup[0][0],0);

        this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord")
          .data(this.browser.items, function(record){ return record.id(); })
          .order();

        this.refreshRecordSortLabels(this.DOM.recordsSortCol);
      }
    },
    /** -- */
    refreshAdjustSortColumnWidth: function(){
      if(this.displayType!=="list") return;
      this.DOM.adjustSortColumnWidth.style("left", (this.sortColWidth-2)+(this.showRank?15:0)+"px")
    },
    /** -- */
    setShowRank: function(v){
      this.showRank = v;
      this.DOM.root.attr('showRank',this.showRank);
      this.refreshRecordRanks(this.DOM.recordRanks);
      this.refreshAdjustSortColumnWidth();
    },
    /** 
      Currently only called if displayType is map
      */
    map_updateRecordColor: function(){
      var me=this;
      var s_id = this.sortingOpt_Active.summaryFilter.id;
      var s_f  = this.sortingOpt_Active.summaryFunc;
      var s_log;

      this.colorQuantize = d3.scale.quantize()
        .domain([0,9])
        .range(kshf.colorScale[me.browser.mapColorTheme]);

      if(this.sortingOpt_Active.scaleType==='log'){
        this.mapColorScale = d3.scale.log();
        s_log = true;
      } else {
        this.mapColorScale = d3.scale.linear();
        s_log = false;
      }
      var min_v = this.sortingOpt_Active.intervalRange.min;
      var max_v = this.sortingOpt_Active.intervalRange.max;
      if(min_v===undefined) min_v = d3.min(this.browser.items, function(d){ return s_f.call(d.data); });
      if(max_v===undefined) max_v = d3.max(this.browser.items, function(d){ return s_f.call(d.data); });
      this.mapColorScale
        .range([0, 9])
        //.range([d3.rgb("rgb(247,251,255)"), d3.rgb("rgb(8,48,107)")])
//            .interpolate(d3.interpolateHcl)
        .domain( [min_v, max_v] );

      this.DOM.kshfRecords.attr("fill", function(d){ 
        //var v = d.mappedDataCache[s_id];
        var v = s_f.call(d.data);
        if(s_log && v<=0) v=undefined;
        if(v===undefined) return "url(#diagonalHatch)";
        var vv = me.mapColorScale(v);
        if(me.sortingOpt_Active.invertColorScale) vv = 9 - vv;
        return me.colorQuantize(vv); 
      });
    },
    /** Insert items into the UI, called once on load */
    refreshRecordDOM: function(){
      var me=this, x;
      var records = (this.displayType==="map")?
        this.browser.items :
        this.browser.items.filter(function(record){
          if(!record.isWanted) return false;
          return record.visibleOrder<me.maxVisibleItems;
        });

      var newRecords = this.DOM.recordGroup.selectAll(".kshfRecord")
        .data(records, function(record){ return record.id(); }).enter();

      // Shared structure per record view
      newRecords = newRecords
        .append( this.displayType==='map' ? 'path' : 'div' )
        .attr('class','kshfRecord')
        .attr('details',false)
        .attr('highlight',false)
        .attr("id",function(d){ return d.id(); }) // can be used to apply custom CSS
        .each(function(d){ 
          d.DOM.record = this;
          if(me.displayType==="map"){
            this.tipsy = new Tipsy(this, {
              gravity: 'e',
              title: function(){ 
                var s="";
                if(me.sortingOpt_Active.unitName) 
                  s = "<span class='unitName'>"+me.sortingOpt_Active.unitName+"</span>";
                return ""+
                  "<span class='mapItemName'>"+me.recordViewSummary.summaryFunc.call(d.data,d)+"</span>"+
                  "<span class='mapTooltipLabel'>"+me.sortingOpt_Active.summaryName+"</span>: "+
                  "<span class='mapTooltipValue'>"+me.sortingOpt_Active.summaryFunc.call(d.data,d)+"</span>"+
                  s;
              }
            });
          }
        })
        .on("mouseenter",function(d){
          if(this.tipsy) {
            this.tipsy.show();
            this.tipsy.jq_tip[0].style.left = (d3.event.pageX-this.tipsy.tipWidth-10)+"px";
            this.tipsy.jq_tip[0].style.top = (d3.event.pageY-this.tipsy.tipHeight/2)+"px";
          }
          if(me.browser.mouseSpeed<0.2) {
            d.highlightRecord(); return;
          }
          // mouse is moving fast, should wait a while...
          this.highlightTimeout = window.setTimeout(
            function(){ d.highlightRecord(); }, 
            me.browser.mouseSpeed*300);
        })
        .on("mouseleave",function(d){
          if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
          if(this.tipsy) this.tipsy.hide();
          this.setAttribute("highlight","false");
          d.nohighlightRecord();
        })
        .on("mousedown", function(d){
          this._mousemove = false;
        })
        .on("mousemove", function(d){
          this._mousemove = true;
          if(this.tipsy){
            this.tipsy.jq_tip[0].style.left = (d3.event.pageX-this.tipsy.tipWidth-10)+"px";
            this.tipsy.jq_tip[0].style.top = (d3.event.pageY-this.tipsy.tipHeight/2)+"px";
          }
        })
        .on("click",function(d){
          // Do not show the detail view if the mouse was used to drag the map
          if(this._mousemove) return;
          if(me.displayType==="map"){
            me.browser.updateItemZoomText(d);
          }
        });
      
      if(this.displayType!=="map"){
        x = newRecords.append("span").attr("class","recordRank")
          .each(function(d){
            this.tipsy = new Tipsy(this, {
              gravity: 'e',
              title: function(){ return kshf.Util.ordinal_suffix_of((d.visibleOrder+1)); }
            });
          })
          .on("mouseenter",function(){ this.tipsy.show(); })
          .on("mouseout"  ,function(){ this.tipsy.hide(); });
        this.refreshRecordRanks(x);

        if(this.displayType==='list'){
          x = newRecords.append("div").attr("class","recordSortCol").style("width",this.sortColWidth+"px");
          this.refreshRecordSortLabels(x);
        }

        newRecords.append("div").attr("class","recordToggleDetail")
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
          .on("mouseover",function(){ this.tipsy.show(); })
          .on("mouseout" ,function(){ this.tipsy.hide(); })
          .append("span").attr("class","item_details_toggle fa")
            .on("click", function(d){
              this.parentNode.tipsy.hide();
              if(me.detailsToggle==="one" && me.displayType==='list'){
                d.setRecordDetails(!d.showDetails);
              }
              if(me.detailsToggle==="zoom"){
                me.browser.updateItemZoomText(d);
              }
            });

        // Insert the custom content!
        // Note: the value was already evaluated and stored in the record object
        var recordViewID = this.recordViewSummary.id;
        newRecords.append("div").attr("class","content")
          //.html(function(record){ return record.mappedDataCache[recordViewID][0].data.id; })
          .html(function(record){ 
            return me.recordViewSummary.summaryFunc.call(record.data, record);
          })
      }

      // Call the domCb function for all the records that have been inserted to the page
      if(this.config.domCb) {
        newRecords.each(function(record){ me.config.domCb.call(record.data,record); });
      }

      this.DOM.kshfRecords = this.DOM.recordGroup.selectAll(".kshfRecord");

      if(this.displayType==="map") {
        this.map_zoomToWanted();
        this.map_projectRecords();
        this.map_updateRecordColor();
      } else {
        this.DOM.recordsSortCol = this.DOM.recordGroup.selectAll(".recordSortCol");
        this.DOM.recordRanks    = this.DOM.recordGroup.selectAll(".recordRank");
      }

      this.updateItemVisibility();
    },
    /** -- */
    unhighlightRecords: function(){
      if(this.DOM.kshfRecords) this.DOM.kshfRecords.attr("highlight",false);
    },
    /** -- */
    showMore: function(){
      if(this.displayType==="map") return;
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
      this.browser.items.sort(
        function(a,b){
          // Put filtered/remove data to later position
          // !! Don't do above!! Then, when you filter set, you'd need to re-order
          // Now, you don't need to re-order after filtering, which is a nice property to have.
          var v_a = sortValueFunc.call(a.data,a);
          var v_b = sortValueFunc.call(b.data,b);

          if(isNaN(v_a)) v_a = undefined;
          if(isNaN(v_b)) v_b = undefined;
          if(v_a===null) v_a = undefined;
          if(v_b===null) v_b = undefined;

          if(v_a===undefined && v_b!==undefined) return  1;
          if(v_b===undefined && v_a!==undefined) return -1;
          if(v_b===undefined && v_a===undefined) return 0;

          var dif=sortFunc(v_a,v_b);
          if(dif===0) dif=b.id()-a.id();
          if(inverse) return -dif;
          return dif; // use unique IDs to add sorting order as the last option
        }
      );
    },
    /** Returns the sort value type for given sort Value function */
    getSortFunc: function(sortValueFunc){
      // 0: string, 1: date, 2: others
      var sortValueFunction, same;

      // find appropriate sortvalue type
      for(var k=0, same=0; true ; k++){
        if(same===3 || k===this.browser.items.length) break;
        var item = this.browser.items[k];
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
    /** Updates visibility of list items */
    updateItemVisibility: function(){
      var me = this;
      var visibleItemCount=0;

      if(this.DOM.kshfRecords===undefined) return;

      this.DOM.kshfRecords.each(function(record){
        if(me.displayType==="map"){
          this.style.opacity = record.isWanted?0.9:0.2;
          this.style.pointerEvents = record.isWanted?"":"none";
          return;
        }

        var isVisible = (record.visibleOrder>=0) && (record.visibleOrder<me.maxVisibleItems);
        if(isVisible) visibleItemCount++;
        this.style.display = isVisible?null:'none';
      });

      if(this.displayType!=="map") {
        var hiddenItemCount = this.browser.recordsWantedCount-visibleItemCount;
        this.DOM.showMore.select(".CountAbove").html("&#x25B2;"+visibleItemCount+" shown");
        this.DOM.showMore.select(".CountBelow").html(hiddenItemCount+" below&#x25BC;");
      }
    },
    /** -- */
    updateAfterFilter: function(){
      if(this.recordViewSummary===null) return;
      if(this.displayType==="map") {
        this.updateItemVisibility(false);
        this.map_zoomToWanted();
        return;
      }
      var me=this;
      var startTime = null;
      var scrollDom = this.DOM.recordGroup[0][0];
      var scrollInit = scrollDom.scrollTop;
      var easeFunc = d3.ease('cubic-in-out');
      var scrollTime = 1000;
      var animateToTop = function(timestamp){
        var progress;
        if(startTime===null) startTime = timestamp;
        // complete animation in 500 ms
        progress = (timestamp - startTime)/scrollTime;
        scrollDom.scrollTop = (1-easeFunc(progress))*scrollInit;
        if(scrollDom.scrollTop!==0){
          window.requestAnimationFrame(animateToTop);
          return;
        }
        me.updateVisibleIndex();
        me.refreshRecordDOM();
        me.refreshRecordRanks(me.DOM.recordRanks);
      };
      window.requestAnimationFrame(animateToTop);
    },
    /** -- */
    updateVisibleIndex: function(){
      var wantedCount = 0;
      var unwantedCount = 1;
      this.browser.items.forEach(function(item){
        item.visibleOrder_pre = item.visibleOrder;
        if(item.isWanted){
          item.visibleOrder = wantedCount;
          wantedCount++;
        } else {
          item.visibleOrder = -unwantedCount;
          unwantedCount++;
        }
      });
      this.maxVisibleItems = this.maxVisibleItems_Default;
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
    },
    /** -- */
    refresh_Compare: function(){
      if(this.recordViewSummary===null) return;
      this.DOM.kshfRecords.attr("compared",function(record){
        return ;
      });
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
            ((options.name==="left"||options.name==="right")?" panel_side":""))
        ;
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
            this.updateWidth_QueryPreview();
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
            this.DOM.root//.attr("hasSummaries",false);
                .attr("hasSummaries",false);
        } else {
            this.updateWidth_QueryPreview();
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
            })
            ;
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
            })
            ;
    },
    /** -- */
    refreshAdjustWidth: function(){
        if(this.name==='middle' || this.name==='bottom') return; // cannot have adjust handles for now
        this.DOM.panelAdjustWidth.style("opacity",(this.summaries.length>0)?1:0);
    },
    /** -- */
    setTotalWidth: function(_w_){
        this.width_catBars = _w_-this.width_catLabel-this.width_catMeasureLabel-kshf.scrollWidth;
    },
    /** -- */
    getNumOfOpenSummaries: function(){
        return this.summaries.reduce(function(prev,cur){return prev+!cur.collapsed;},0);
    },
    /** -- */
    collapseAllSummaries: function(){
        this.summaries.forEach(function(summary){ summary.setCollapsed(true); });
    },
    /** -- */
    setWidthCatLabel: function(_w_){
        console.log(_w_);
        _w_ = Math.max(90,_w_); // use at least 90 pixels for the category label.
        if(_w_===this.width_catLabel) return;
        var widthDif = this.width_catLabel-_w_;
        this.width_catLabel = _w_;
        this.summaries.forEach(function(summary){
            if(summary.refreshLabelWidth!==undefined){
                summary.refreshLabelWidth();
            }
        });
        this.setWidthCatBars(this.width_catBars+widthDif);
    },
    /** -- */
    setWidthCatBars: function(_w_){
        _w_ = Math.max(_w_,0);
        this.hideBars = _w_<=5;
        this.hideBarAxis = _w_<=20;

        if(this.hideBars===false){
            this.DOM.root.attr("hidebars",false);
        } else {
            this.DOM.root.attr("hidebars",true);
        }
        if(this.hideBarAxis===false){
            this.DOM.root.attr("hideBarAxis",false);
        } else {
            this.DOM.root.attr("hideBarAxis",true);
        }

        this.width_catBars = _w_;

        this.updateSummariesWidth();
        if(this.name!=="middle")
            this.browser.updateMiddlePanelWidth();
    },
    /** --- */
    updateSummariesWidth: function(){
      this.summaries.forEach(function(summary){
        if(summary.type==='categorical'){
          summary.updateBarPreviewScale2Active();
        }
        summary.refreshWidth();
      });
    },
    /** --- */
    updateWidth_QueryPreview: function(){
        var maxTotalCount = d3.max(this.summaries, function(summary){
            if(summary.getMaxAggr_Total===undefined) return 0;
            return summary.getMaxAggr_Total();
        });

        var oldPreviewWidth = this.width_catMeasureLabel;

        this.width_catMeasureLabel = 13;
        var digits = 1;
        while(maxTotalCount>9){
            digits++;
            maxTotalCount = Math.floor(maxTotalCount/10);
        }
        if(digits>3) {
            digits = 2;
            this.width_catMeasureLabel+=4; // "." character is used to split. It takes some space
        }
        this.width_catMeasureLabel += digits*6;

        if(oldPreviewWidth!==this.width_catMeasureLabel){
            this.summaries.forEach(function(summary){
                if(summary.refreshLabelWidth) summary.refreshLabelWidth();
            });
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
    this.summaries = [];
    this.summaries_by_name = {};
    this.panels = {};

    this.maxFilterID = 0;

    this.filters = [];

    this.authoringMode = false;

    this.pauseResultPreview = false;
    this.vizPreviewActive = false;
    this.vizCompareActive = false;
    this.ratioModeActive = false;
    this.percentModeActive = false;
    this.isFullscreen = false;

    this.highlightSelectedSummary = null;

    this.comparedAggregate = undefined;
    this.highlightedAggregate = undefined;

    this.highlightCrumbTimeout_Hide = undefined;
    this.highlightCrumbTimeout_Show = undefined;

    this.compareSelectCrumb = null;
    this.highlightSelectCrumb = null;

    this.showDropZones = false;

    this.mapColorTheme = "converge";

    this.mouseSpeed = 0; // includes touch-screens...

    this.noAnim = false;

    this.domID = options.domID;

    // Callbacks
    this.newSummaryCb = options.newSummaryCb;
    this.readyCb = options.readyCb;
    this.updateCb = options.updateCb;
    this.previewCb = options.previewCb;
    this.previewCompareCb = options.previewCompareCb;
    this.preview_not = false;
    this.ratioModeCb = options.ratioModeCb;

    this.itemName = options.itemName || "";
    if(options.itemDisplay) options.recordDisplay = options.itemDisplay;

    this.DOM = {};
    this.DOM.root = d3.select(this.domID)
      .classed("kshf",true)
      .attr("percentview",false)
      .attr("noanim",true)
      .attr("ratiomode",false)
      .attr("authoringMode",false)
      .attr("showdropzone",false)
      .attr("previewcompare",false)
      .attr("resultpreview",false)
      .attr("record_display","none")
      .style("position","relative")
      //.style("overflow-y","hidden")
      .on("mousemove",function(d,e){
        // Action logging...
        if(typeof logIf === "object"){ logIf.setSessionID(); }

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

    var me = this;

    this.DOM.root.selectAll(".panel").on("mouseleave",function(){
      setTimeout( function(){ me.updateLayout_Height(); }, 1500); // update layout after 1.5 seconds
    });

    kshf.loadFont();

    if(options.source){
        window.setTimeout(function() { me.loadSource(options.source); }, 10);
    } else {
        this.panel_infobox.attr("show","source");
    }
    
    kshf.browsers.push(this);
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
    removeSummary: function(summary){
        var indexFrom = -1;
        this.summaries.forEach(function(s,i){
            if(s===summary) indexFrom = i;
        });
        if(indexFrom===-1) return; // given summary is not within this panel
        this.summaries.splice(indexFrom,1);

        summary.removeFromPanel();
    },
    /** -- */
    getAttribTypeFromFunc: function(attribFunc){
        var type = null;
        this.items.some(function(item,i){
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
        console.log("createSummary: The summary name["+name+"] is already used. It must be unique. Try again");
        return;
      }
      if(typeof(func)==="string"){
        var x=func;
        func = function(){ return this[x]; }
      }

      var attribFunc=func || function(d){ return d.data[name]; }
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
      }
      if(type==='interval'){
        summary = new kshf.Summary_Interval();
      }

      summary.initialize(this,name,func);

      this.summaries.push(summary);
      this.summaries_by_name[name] = summary;

      if(this.newSummaryCb) this.newSummaryCb.call(this,summary);
      return summary;
    },
    /** -- */
    changeSummaryName: function(curName,newName){
        if(curName===newName) return;
        var summary = this.summaries_by_name[curName];
        if(summary===undefined){
            console.log("The given summary name is not there. Try again");
            return;
        }
        if(this.summaries_by_name[newName]!==undefined){
            if(newName!==this.summaries_by_name[newName].summaryColumn){
                console.log("The new summary name is already used. It must be unique. Try again");
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
    getWidth_Total: function(){
        return this.divWidth;
    },
    /** -- */
    domHeight: function(){
        return parseInt(this.DOM.root.style("height"));
    },
    /** -- */
    domWidth: function(){
        return parseInt(this.DOM.root.style("width"));
    },
    // TODO: If names are the same and config options are different, what do you do?
    createFilter: function(opts){
        opts.browser = this;
        // see if it has been created before TODO
        var newFilter = new kshf.Filter(this.maxFilterID,opts);
        ++this.maxFilterID;
        this.filters.push(newFilter);
        return newFilter;
    },
    /* -- */
    insertDOM_WarningBox: function(){
        this.panel_warningBox = this.DOM.root.append("div").attr("class", "warningBox_wrapper").attr("shown",false)
        var x = this.panel_warningBox.append("span").attr("class","warningBox");
        this.DOM.warningText = x.append("span").attr("class","warningText");
        x.append("span").attr("class","dismiss").html("<i class='fa fa-times-circle' style='font-size: 1.3em;'></i>")
          .on("click",function(){
            this.parentNode.parentNode.setAttribute("shown",false);
          });
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
    insertDOM_PanelBasic: function(){
        var me=this;

        this.DOM.panel_Basic = this.DOM.panel_Wrapper.append("div").attr("class","panel_Basic");

        var recordInfo = this.DOM.panel_Basic.append("span")
            .attr("class","recordInfo editableTextContainer")
            .attr("edittitle",false);

        this.DOM.activeRecordCount = recordInfo.append("span").attr("class","activeRecordCount");

        this.DOM.recordName = recordInfo.append("span").attr("class","recordName editableText")
            .attr("contenteditable",false)
            .on("mousedown", function(){ d3.event.stopPropagation(); })
            .on("blur",function(){
                this.parentNode.setAttribute("edittitle",false);
                this.setAttribute("contenteditable", false);
                me.itemName = this.textContent;
            })
            .on("keydown",function(){
                if(event.keyCode===13){ // ENTER
                    this.parentNode.setAttribute("edittitle",false);
                    this.setAttribute("contenteditable", false);
                    me.itemName = this.textContent;
                }
            });

        recordInfo.append("span")
            .attr("class","editTextButton fa")
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: 'w', title: function(){
                        var curState=this.parentNode.getAttribute("edittitle");
                        if(curState===null || curState==="false"){
                            return kshf.lang.cur.EditTitle;
                        } else {
                            return "OK";
                        }
                    }
                })
            })
            .on("mouseenter",function(){ this.tipsy.show(); })
            .on("mouseleave",function(){ this.tipsy.hide(); })
            .on("mousedown", function(){
                d3.event.stopPropagation();
                d3.event.preventDefault();
            })
            .on("click",function(){
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
                    me.itemName = this.textContent;
                }
            });

        this.DOM.breadcrumbs = this.DOM.panel_Basic.append("span").attr("class","breadcrumbs");

        this.initDOM_ClearAllFilters();

        var rightBoxes = this.DOM.panel_Basic.append("span").attr("class","rightBoxes");
        // Attribute panel
        if (typeof saveAs !== 'undefined') { // FileSaver.js is included
          rightBoxes.append("i").attr("class","saveBrowserConfig fa fa-download")
            .each(function(d){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: "Download Browser Configuration" }); })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout", function(){ this.tipsy.hide(); })
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
              if (d3.event.shiftKey) {
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

        rightBoxes.append("i").attr("class","showConfigButton fa fa-cog")
            .each(function(d){
                this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.ModifyBrowser });
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout", function(){ this.tipsy.hide(); })
            .on("click",function(){ me.enableAuthoring(); })
            ;
        // Datasource
        this.DOM.datasource = rightBoxes.append("a").attr("class","fa fa-table datasource")
            .attr("target","_blank")
            .each(function(d){
                this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.OpenDataSource });
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            ;
        // Info & Credits
        rightBoxes.append("i").attr("class","fa fa-info-circle credits")
            .each(function(d){
                this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.ShowInfoCredits });
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("click",function(){ me.showInfoBox();})
            ;
        // Info & Credits
        rightBoxes.append("i").attr("class","fa fa-arrows-alt fullscreen")
            .each(function(d){
                this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.ShowFullscreen });
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("click",function(){ me.showFullscreen();})
            ;

        var adsdasda = this.DOM.panel_Basic.append("div").attr("class","totalViz aggrGlyph");
        this.DOM.totalViz_total = adsdasda.append("span").attr("class","aggr total");
        this.DOM.totalViz_active = adsdasda.append("span").attr("class","aggr active");
        this.DOM.totalViz_preview = adsdasda.append("span").attr("class","aggr preview");
    },
    /** Inserts a summary block to the list breadcrumb DOM */
    /** Don't call this directly */
    insertDOM_crumb: function(_className, _filter){
      var x;
      var me=this;
      // breadcrumbs must be always visible (as the basic panel)
      x = this.DOM.breadcrumbs.append("span")
        .attr("class","crumb crumbMode_"+_className)
        .each(function(){
          if(_className==="compare" || _className==='filter'){
            // Move the node to a sibling before
            var l=this.parentNode.childNodes.length;
            if(l>1){
              var n=this.parentNode.childNodes[l-2];
              this.parentNode.insertBefore(this,n);
            }
          }
          this.tipsy = new Tipsy(this, {
            gravity: 'n',
            title: function(){ 
              if(_className==="filter") return kshf.lang.cur.RemoveFilter;
              if(_className==="compare") return kshf.lang.cur.Unlock;
              if(_className==="highlight") return "Remove Highligh";
            }
          })
        })
        .on("mouseenter",function(){
          if(_className!=='highlight') this.tipsy.show();
        })
        .on("mouseleave",function(){
          this.tipsy.hide();
        })
        .on("click",function(){
          this.tipsy.hide();
          if(_className==="filter") {
            _filter.clearFilter();
            // delay layout height update
            setTimeout( function(){ me.updateLayout_Height();}, 1000);
          }
          if(_className==="highlight") {
            me.clearSelect_Highlight();
            me.clearSelect_Highlight_Crumb();
          }
          if(_className==="compare") {
            me.clearSelect_Compare();
            me.clearSelect_Compare_Crumb();
          }
        });
      x.append("span").attr("class","clearCrumbButton inCrumb").append("span").attr("class","fa");
      var y = x.append("span").attr("class","crumbText");
      y.append("span").attr("class","crumbHeader");
      y.append("span").attr("class","filterDetails");
      // animate appear
      window.getComputedStyle(x[0][0]).opacity; // force redraw
      x.attr("ready",true);
      return x;
    },
    /** -- */
    refreshTotalViz: function(){
        this.DOM.totalViz_active .style("width",
            (100*this.recordsWanted_Aggr_Total/this.itemsTotal_Aggregrate_Total)+"%");
        this.DOM.totalViz_preview.style("width",
            (100*this.itemCount_Previewed/this.itemsTotal_Aggregrate_Total)+"%");
    },
    /** --- */
    initDOM_ClearAllFilters: function(){
        var me=this;
        this.DOM.filterClearAll = this.DOM.panel_Basic.append("span").attr("class","filterClearAll")
            .each(function(d){
                this.tipsy = new Tipsy(this, { gravity: 'n', title: kshf.lang.cur.RemoveAllFilters });
            })
            .on("mouseenter",function(){ this.tipsy.show(); })
            .on("mouseleave",function(){ this.tipsy.hide(); })
            .on("click",function(){
                this.tipsy.hide();
                me.clearFilters_All();
            })
            ;
        this.DOM.filterClearAll.append("span").attr("class","title").text(kshf.lang.cur.ShowAll);
        this.DOM.filterClearAll.append("div").attr("class","clearFilterButton allFilter")
            .append("span").attr("class","fa fa-times")
            ;
    },
    /* -- */
    insertDOM_Infobox: function(){
        var me=this;
        var creditString="";
        creditString += "<div align='center'>";
        creditString += "<div class='header'>Data made explorable by <span class='libName'>Keshif</span>.</div>";
        creditString += "<div align='center' class='boxinbox project_credits'>";
        creditString += "<div>Developed by</div>";
        creditString += " <a href='http://www.cs.umd.edu/hcil/' target='_blank'><img src='https://wiki.umiacs.umd.edu/hcil/images/1/10/HCIL_logo_small_no_border.gif' style='height:50px'></a>";
        creditString += " <a class='myName' href='http://www.adilyalcin.me' target='_blank'>M. Adil Yalçın</a>";
        creditString += " <a href='http://www.umd.edu' target='_blank'><img src='http://www.trademarks.umd.edu/marks/gr/informal.gif' style='height:50px'></a>";
        creditString += "</div>";
        creditString += "";
        creditString += "<div align='center' class='boxinbox project_credits'>";
            creditString += "<div style='float:right; text-align: right'>"
            creditString += "<iframe src='http://ghbtns.com/github-btn.html?user=adilyalcin&repo=Keshif&type=watch&count=true' allowtransparency='true' frameborder='0' scrolling='0' width='90px' height='20px'></iframe><br/>";
            creditString += "</div>";
            creditString += "<div style='float:left; padding-left: 10px'>"
            creditString += "<iframe src='http://ghbtns.com/github-btn.html?user=adilyalcin&repo=Keshif&type=fork&count=true' allowtransparency='true' frameborder='0' scrolling='0' width='90px' height='20px'></iframe>";
            creditString += "</div>";
        creditString += " 3rd party libraries used<br/>";
        creditString += " <a href='http://d3js.org/' target='_blank'>D3</a> -";
        creditString += " <a href='http://jquery.com' target='_blank'>JQuery</a> -";
        creditString += " <a href='https://developers.google.com/chart/' target='_blank'>GoogleDocs</a>";
        creditString += "</div><br/>";
        creditString += "";
        creditString += "<div align='center' class='project_fund'>";
        creditString += "Keshif (<i>keşif</i>) means discovery / exploration in Turkish.<br/>";
        creditString += "";

        this.panel_infobox = this.DOM.root.append("div").attr("class", "panel panel_infobox");
        this.panel_infobox.append("div").attr("class","background")
            .on("click",function(){
                var activePanel = this.parentNode.getAttribute("show");
                if(activePanel==="credit" || activePanel==="itemZoom"){
                    me.panel_infobox.attr("show","none");
                }
            })
            ;
        this.DOM.loadingBox = this.panel_infobox.append("div").attr("class","infobox_content infobox_loading");
//        this.DOM.loadingBox.append("span").attr("class","fa fa-spinner fa-spin");
        var ssdsd = this.DOM.loadingBox.append("span").attr("class","spinner");
        ssdsd.append("span").attr("class","spinner_x spinner_1");
        ssdsd.append("span").attr("class","spinner_x spinner_2");
        ssdsd.append("span").attr("class","spinner_x spinner_3");
        ssdsd.append("span").attr("class","spinner_x spinner_4");
        ssdsd.append("span").attr("class","spinner_x spinner_5");

        var hmmm=this.DOM.loadingBox.append("div").attr("class","status_text");
        hmmm.append("span").attr("class","status_text_sub info").text(kshf.lang.cur.LoadingData);
        this.DOM.status_text_sub_dynamic = hmmm.append("span").attr("class","status_text_sub dynamic");

        var infobox_credit = this.panel_infobox.append("div").attr("class","infobox_content infobox_credit");
        infobox_credit.append("div").attr("class","infobox_close_button")
            .on("click",function(){
                me.panel_infobox.attr("show","none");
            })
            .append("span").attr("class","fa fa-times");
        infobox_credit.append("div").attr("class","all-the-credits").html(creditString);

        this.insertSourceBox();


        this.DOM.infobox_itemZoom = this.panel_infobox.append("span").attr("class","infobox_content infobox_itemZoom");

        this.DOM.infobox_itemZoom.append("div").attr("class","infobox_close_button")
            .on("click",function(){
                me.panel_infobox.attr("show","none");
            })
            .append("span").attr("class","fa fa-times");

        this.DOM.infobox_itemZoom_content = this.DOM.infobox_itemZoom.append("span").attr("class","content");
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

        this.DOM.infobox_source = this.panel_infobox.append("div").attr("class","infobox_content infobox_source")
            .attr("selected_source_type",source_type);

        this.DOM.infobox_source.append("div").attr("class","sourceHeader").text("Where's your data?");

        var source_wrapper = this.DOM.infobox_source.append("div").attr("class","source_wrapper");

        x = source_wrapper.append("div").attr("class","sourceOptions");

        x.append("span").attr("class","sourceOption").html(
          "<img src='https://lh3.ggpht.com/e3oZddUHSC6EcnxC80rl_6HbY94sM63dn6KrEXJ-C4GIUN-t1XM0uYA_WUwyhbIHmVMH=w300-rw' "+
          " style='height: 12px;'> Google Sheet").attr("source_type","GoogleSheet");
        x.append("span").attr("class","sourceOption").html(
          "<img src='https://developers.google.com/drive/images/drive_icon.png' style='height:12px; position: relative; top: 2px'> "+
          "Google Drive Folder")
          .attr("source_type","GoogleDrive");
        x.append("span").attr("class","sourceOption").html(
          "<i class='fa fa-dropbox'></i> Dropbox Folder").attr("source_type","Dropbox");
        x.append("span").attr("class","sourceOption")
          .html("<i class='fa fa-file'></i> Local File").attr("source_type","LocalFile");

        x.selectAll(".sourceOption").on("click",function(){
          source_type=this.getAttribute("source_type");
          me.DOM.infobox_source.attr("selected_source_type",source_type);
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
                if(source_type==="GoogleSheet")
                  return "The link to your Google Sheet";
                if(source_type==="GoogleDrive")
                  return "The link to *hosted* Google Drive folder";
                if(source_type==="Dropbox")
                  return "The link to your *Public* Dropbox folder";
                if(source_type==="LocalFile")
                  return "Select your CSV/TSV/JSON file or drag-and-drop here.";
              }
            });
          })
          .on("mouseenter",function(){ this.tipsy.show(); })
          .on("mouseleave",function(){ this.tipsy.hide(); });

        var gdocLink_ready = x.append("span").attr("class","gdocLink_ready fa").attr("ready",false);

        var sheetInfo = this.DOM.infobox_source.append("div").attr("class","sheetInfo");

        x = sheetInfo.append("div").attr("class","sheet_wrapper")
            x.append("div").attr("class","subheading tableHeader")
            ;

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
                            v+="<br>Also describes what each data row represents"
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

        x = sheetInfo.append("div").attr("class","sheet_wrapper sheetColumn_ID_wrapper")
            x.append("span").attr("class","subheading").text("ID column");
            x.append("span").attr("class","fa fa-info-circle")
              .each(function(summary){
                this.tipsy = new Tipsy(this, {
                  gravity: 's', title: function(){ return "The column that uniquely identifies each item.<br><br>If no such column, skip."; }
                });
              })
              .on("mouseenter",function(){ this.tipsy.show(); })
              .on("mouseleave",function(){ this.tipsy.hide(); });
        this.DOM.sheetColumn_ID = x.append("input").attr("class","sheetColumn_ID").attr("type","text").attr("placeholder","id");

        var actionButton = this.DOM.infobox_source.append("div").attr("class","actionButton")
          .text("Explore it with Keshif")
          .attr("disabled",true)
          .on("click",function(){
            if(!readyToLoad()){
              alert("Please input your data source link and sheet name.");
              return;
            }
            me.options.enableAuthoring = true; // Enable authoring on data load
            var sheetID = me.DOM.sheetColumn_ID[0][0].value;
            if(sheetID==="") sheetID = "id";
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
    },
    /** -- */
    insertDOM_AttributePanel: function(){
      var me=this;

      this.DOM.attributePanel = this.DOM.root.append("div").attr("class","attributePanel");
      
      var xx= this.DOM.attributePanel.append("div").attr("class","attributePanelHeader");
      xx.append("span").text("Available Attributes");
      xx.append("span").attr("class","addAttrib fa fa-plus")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: "e", title: "Add new" }); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout" ,function(){ this.tipsy.hide(); })
        .on("click",function(){
          summary = me.createSummary("[New]",function(){ return this.Name;}, 'categorical');
        });
      xx.append("span").attr("class","hidePanel fa fa-times")
        .each(function(){ this.tipsy = new Tipsy(this, { gravity: "w", title: "Close panel" }); })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout" ,function(){ this.tipsy.hide(); })
        .on("click",function(){
          me.enableAuthoring();
        });

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
      this.DOM.attribTextSearchInput = this.DOM.attribTextSearch.append("input")
        .attr("class","textSearchInput")
        .attr("type","text")
        .attr("placeholder",kshf.lang.cur.Search)
        .on("input",function(){
          if(this.timer) clearTimeout(this.timer);
          var x = this;
          var queryString = x.value.toLowerCase();
          if(queryString===""){
            me.DOM.attribTextSearchControl.attr("showClear",true);
          } else {
            me.DOM.attribTextSearchControl.attr("showClear",true);
          }
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
          .on("mouseover",function(){ this.tipsy.show(); })
          .on("mouseout" ,function(){ this.tipsy.hide(); })
          .on("click",function(){ me.autoCreateBrowser(); });

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
        .each(function(){
          this.tipsy = new Tipsy(this, { gravity: 'n', title: 'Add new attribute' });
        })
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
            console.log("Eval error:");
            console.log(e.message);
            console.log(e.name);
            console.log(e.fileName);
            console.log(e.lineNumber);
            console.log(e.columnNumber);
            console.log(e.stack);
          }
          if(typeof safeFunc !== "function"){
            alert("You did not specify a function with correct format. Cannot specify new attribute.");
            return;
          }
          me.createSummary(name,safeFunc);
        });
    },
    /** -- */
    updateItemZoomText: function(item){
        var str="";
        for(var column in item.data){
            var v=item.data[column];
            if(v===undefined || v===null) continue;
            str+="<b>"+column+":</b> "+ v.toString()+"<br>";
        }
        this.DOM.infobox_itemZoom_content.html(str);
        this.panel_infobox.attr("show","itemZoom");
//        this.DOM.infobox_itemZoom_content.html(item.data.toString());
    },
    /** -- deprecated */
    showAttributes: function(v){
      return this.enableAuthoring();
    },
    /** -- */
    enableAuthoring: function(v){
      if(v===undefined) v = !this.authoringMode; // if undefined, invert
      this.authoringMode = v;
      this.DOM.root.attr("authoringMode",this.authoringMode);

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
        var elem = browser.DOM.root[0][0];
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
    showInfoBox: function(){
      this.panel_infobox.attr("show","credit");
    },
    /** -- */
    loadSource: function(v){
      this.source = v;
      this.panel_infobox.attr("show","loading");
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
          this.source.url = this.source.url || ("https://docs.google.com/spreadsheet/ccc?key="+this.source.gdocId);
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
              case "json": 
                this.loadTable_JSON(tableDescr); break;
              case "csv":
              case "tsv":  
                this.loadTable_CSV(tableDescr); break;
            }
          }
        },this);
      } else {
        if(this.source.callback) this.source.callback(this);
      }
    },
    loadTable_Google: function(sheet){
        var me=this;
        var headers=1;
        if(sheet.headers){
            headers = sheet.headers;
        }
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
            if(kshf.dt[sheet.name]!==undefined){
                me.incrementLoadedTableCount();
                return;
            }
            if(response.isError()) {
                me.panel_infobox.select("div.status_text .info")
                    .text("Cannot load data");
                me.panel_infobox.select("span.spinner").selectAll("span").remove();
                me.panel_infobox.select("span.spinner").append('i').attr("class","fa fa-warning");
                me.panel_infobox.select("div.status_text .dynamic")
                    .text("("+response.getMessage()+")");
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
                arr[r] = new kshf.Item(c,sheet.id);
            }

            me.finishDataLoad(sheet,arr);
        });
    },
    /** -- */
    loadTable_CSV: function(tableDescr){
        var me=this;

        function processCSVText(data){
            // if data is already loaded, nothing else to do...
            if(kshf.dt[tableDescr.name]!==undefined){
                me.incrementLoadedTableCount();
                return;
            }
            var arr = [];
            var idColumn = tableDescr.id;

            var config = {};
            config.dynamicTyping = true;
            config.header = true; // header setting can be turned off
            if(tableDescr.header===false) config.header = false;
            if(tableDescr.preview!==undefined) config.preview = tableDescr.preview;
            if(tableDescr.fastMode!==undefined) config.fastMode = tableDescr.fastMode;
            if(tableDescr.dynamicTyping!==undefined) config.dynamicTyping = tableDescr.dynamicTyping;

            var parsedData = Papa.parse(data, config);

            parsedData.data.forEach(function(row,i){
                if(row[idColumn]===undefined) row[idColumn] = i;
                arr.push(new kshf.Item(row,idColumn));
            })

            me.finishDataLoad(tableDescr, arr);
        }

        if(tableDescr instanceof File){
            // Load using FileReader
            var reader = new FileReader();
            reader.onload = function(e) { processCSVText(e.target.result); };
            reader.readAsText(tableDescr);
        } else {
            // Load using URL
            var fileName=this.source.dirPath+tableDescr.name+"."+this.source.fileType;
            $.ajax({
                url: fileName,
                type: "GET",
                async: (this.source.callback===undefined)?true:false,
                contentType: "text/csv",
                success: processCSVText
            });
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
            arr.push(new kshf.Item(dataItem, idColumn));
          });

          me.finishDataLoad(tableDescr, arr);
        };
        if(tableDescr instanceof File){
            // Load using FileReader
            var reader = new FileReader();
            reader.onload = function(e) { processJSONText( JSON.parse(e.target.result)); };
            reader.readAsText(tableDescr);
        } else {
            var fileName = this.source.dirPath+tableDescr.name+".json";
            $.ajax({
                url: fileName+"?dl=0",
                type: "GET",
                async: (this.source.callback===undefined)?true:false,
                dataType: "json",
                success: processJSONText
            });
        }
    },
    /** -- */
    createTableFromTable: function(srcItems, dstTableName, summaryFunc){
        var i;
        var me=this;
        kshf.dt_id[dstTableName] = {};
        kshf.dt[dstTableName] = [];
        var dstTable_Id = kshf.dt_id[dstTableName];
        var dstTable = kshf.dt[dstTableName];

        var hasString = false;

        srcItems.forEach(function(srcData_i){
            var mapping = summaryFunc.call(srcData_i.data,srcData_i);
            if(mapping==="" || mapping===undefined || mapping===null) return;
            if(mapping instanceof Array) {
                mapping.forEach(function(v2){
                    if(v2==="" || v2===undefined || v2===null) return;
                    if(!dstTable_Id[v2]){
                        if(typeof(v2)==="string") hasString=true;
                        var itemData = {id: v2};
                        var item = new kshf.Item(itemData,'id');
                        dstTable_Id[v2] = item;
                        dstTable.push(item);
                    }
                });
            } else {
                if(!dstTable_Id[mapping]){
                    if(typeof(mapping)==="string") hasString=true;
                    var itemData = {id: mapping};
                    var item = new kshf.Item(itemData,'id');
                    dstTable_Id[mapping] = item;
                    dstTable.push(item);
                }
            }
        });

        // Make sure all id's are strings...
        if(hasString){
            dstTable.forEach(function(item){
                item.data.id = ""+item.data.id;
            })
        }
    },
    /** -- */
    finishDataLoad: function(table,arr) {
        kshf.dt[table.name] = arr;
        var id_table = {};
        arr.forEach(function(r){id_table[r.id()] = r;});
        kshf.dt_id[table.name] = id_table;
        this.incrementLoadedTableCount();
    },
    /** -- */
    incrementLoadedTableCount: function(){
        var me=this;
        this.source.loadedTableCount++;
        this.panel_infobox.select("div.status_text .dynamic")
            .text("("+this.source.loadedTableCount+"/"+this.source.tables.length+")");
            // finish loading
        if(this.source.loadedTableCount===this.source.tables.length) {
            if(this.source.callback===undefined){
                this.loadCharts();
            } else {
                this.source.callback(this);
            }
        }
    },
    /** -- */
    loadCharts: function(){
        if(this.primaryTableName===undefined){
            alert("Cannot load keshif. Please define browser.primaryTableName.");
            return;
        }
        this.items = kshf.dt[this.primaryTableName];
        if(this.itemName==="") {
            this.itemName = this.primaryTableName;
        }

        var me=this;
        this.panel_infobox.select("div.status_text .info").text(kshf.lang.cur.CreatingBrowser);
        this.panel_infobox.select("div.status_text .dynamic").text("");
        window.setTimeout(function(){ me._loadCharts(); }, 50);
    },
    /** -- */
    _loadCharts: function(){
        var me=this;

        if(this.options.loadedCb){
          if(typeof this.options.loadedCb === "string" && this.options.loadedCb.substr(0,8)==="function"){
            // Evaluate string to a function!!
            eval("\"use strict\"; this.options.loadedCb = "+this.options.loadedCb);
          }
          if(typeof this.options.loadedCb === "function") {
            this.options.loadedCb.call(this);
          }
        }

        // Total
        this.itemsTotal_Aggregrate_Total = 0;
        this.items.forEach(function(item){
            this.itemsTotal_Aggregrate_Total+=item.aggregate_Self;
        },this);

        // Create a summary for each existing column in the data
        for(var column in this.items[0].data){
            if(typeof(column)==="string") this.createSummary(column);
        }

        // Should do this here, because bottom panel width calls for browser width, and this reads the browser width...
        this.divWidth = this.domWidth();

        if(this.options.summaries) this.options.facets = this.options.summaries;
        this.options.facets = this.options.facets || [];

        this.options.facets.forEach(function(facetDescr){
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
          if(facetDescr.attribMap){
            facetDescr.value = facetDescr.attribMap;
          }

          if(typeof(facetDescr.value)==="string"){
            // it may be a function definition if so, evaluate
            if(facetDescr.value.substr(0,8)==="function"){
              // Evaluate string to a function!!
              eval("\"use strict\"; facetDescr.value = "+facetDescr.value);
            }
          }

          // String -> resolve to name
          if(typeof facetDescr==="string"){
            facetDescr = {name: facetDescr};
          }

          if(facetDescr.catLabel||facetDescr.catTooltip||facetDescr.catTableName||facetDescr.catSortBy||facetDescr.catMap){
            facetDescr.type="categorical";
          } else if(facetDescr.scaleType || facetDescr.showPercentile || facetDescr.unitName ){
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
              // Requesting a new summarywith the same name.
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
          }

          if(summary.type==='interval'){
            summary.unitName = facetDescr.unitName || summary.unitName;
            if(facetDescr.showPercentile) {
              summary.showPercentileChart(true);
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

        this.panels.left.updateWidth_QueryPreview();
        this.panels.right.updateWidth_QueryPreview();
        this.panels.middle.updateWidth_QueryPreview();

        this.recordDisplay = new kshf.RecordDisplay(this,this.options.recordDisplay||{}, this.DOM.root);

        this.DOM.recordName.html(this.itemName);

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

        this.items.forEach(function(item){item.updateWanted();});
        this.update_Records_Wanted_Count();

        this.updateAfterFilter();

        this.updateLayout_Height();

        // hide infobox
        this.panel_infobox.attr("show","none");

        this.reorderNuggetList();

        if(this.recordDisplay.displayType==="map") {
          this.recordDisplay.map_zoomToWanted();
        }

        if(typeof this.readyCb === "string" && this.readyCb.substr(0,8)==="function"){
          eval("\"use strict\"; this.readyCb = "+this.readyCb);
        }
        if(typeof this.readyCb === "function") {
          this.readyCb(this);
        }
        this.finalized = true;

        setTimeout(function(){ 
          if(this.options.enableAuthoring) me.enableAuthoring(true);
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
      this.DOM.attribDragBox.style("display","block").text(summary.summaryName);
    },
    /** -- */
    clearDropZones: function(){
      this.showDropZones = false;
      this.unregisterBodyCallbacks();
      this.DOM.root.attr("showdropzone",false);
      this.DOM.attribDragBox.style("display","none");
      if(this.movedSummary && !this.movedSummary.uniqueCategories()){
          // ?
      }
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

      var x=this.DOM.attributeList;
      x.selectAll(".nugget").data(this.summaries, function(d,i){return d.id;}).order();
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
      // If tithis, add to bottom panel
      var target_panel;
      if(summary.hasTime!==undefined && summary.hasTime===true) {
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
    clearFilters_All: function(force){
      var me=this;
      if(this.skipSortingFacet){
        // you can now sort the last filtered summary, attention is no longer there.
        this.skipSortingFacet.dirtySort = false;
        this.skipSortingFacet.DOM.catSortButton.attr("resort",false);
      }
      // clear all registered filters
      this.filters.forEach(function(filter){ filter.clearFilter(false,false); })
      if(force!==false){
        this.items.forEach(function(item){ item.updateWanted_More(true); });
        this.update_Records_Wanted_Count();
        this.refresh_filterClearAll();
        this.updateAfterFilter(); // more results
      }
      setTimeout( function(){ me.updateLayout_Height(); }, 1000); // update layout after 1.75 seconds
    },
    /** -- */
    refresh_ActiveRecordCount: function(){
      var noneSelected = (this.recordsWanted_Aggr_Total===0);
      var numStr = this.recordsWanted_Aggr_Total.toLocaleString();
      this.DOM.activeRecordCount
        .text(noneSelected?"No":numStr)
        .style("width",(noneSelected?"30":(numStr.length*11+5))+"px");
    },
    /** -- */
    update_Records_Wanted_Count: function(){
      this.recordsWantedCount = 0;
      this.recordsWanted_Aggr_Total = 0;
      this.items.forEach(function(record){
        if(record.isWanted){
          this.recordsWantedCount++;
          this.recordsWanted_Aggr_Total+=record.aggregate_Self;
        }
      },this);

      this.refreshTotalViz();
      this.refresh_ActiveRecordCount();
    },
    /** -- */
    updateAfterFilter: function () {
      this.clearSelect_Compare();
      this.clearSelect_Compare_Crumb();
      // basically, propogate call under every summary and recordDisplay
      this.summaries.forEach(function(summary){
        if(summary.inBrowser()) summary.updateAfterFilter();
      });
      this.recordDisplay.updateAfterFilter();

      if(this.updateCb) this.updateCb(this);
    },
    /** -- */
    refresh_filterClearAll: function(){
      this.DOM.filterClearAll.attr("active", this.filters.some(function(filter){ return filter.isFiltered; }) );
    },
    /** Ratio mode is when glyphs scale to their max */
    setRatioMode: function(how){
      this.ratioModeActive = how;
      this.DOM.root.attr("ratiomode",how);
      this.setPercentMode(how);
      this.summaries.forEach(function(summary){
        if(!summary.inBrowser()) return;
        summary.refreshViz_All();
        summary.refreshMeasureLabel();
      });
      if(this.ratioModeCb) this.ratioModeCb.call(this,!how);
    },
    /** -- */
    setPercentMode: function(how){
      this.percentModeActive = how;
      this.DOM.root.attr("percentview",how);
      this.summaries.forEach(function(summary){
        if(!summary.inBrowser()) return;
        summary.refreshMeasureLabel();
        if(summary.viewType==='map'){
          summary.temp_refreshMapColorScale();
        }
        summary.refreshViz_Axis();
      });
    },
    /** -- */
    clearSelect_Compare_Crumb: function(){
      var root = this.compareSelectCrumb;
      if(root===null || root===undefined) return;
      root.attr("ready",false);
      setTimeout(function(){ root[0][0].parentNode.removeChild(root[0][0]); }, 350);
      this.compareSelectCrumb = null;
    },
    /** -- */
    clearSelect_Highlight_Crumb: function(){
      clearTimeout(this.highlightCrumbTimeout_Hide);
        this.highlightCrumbTimeout_Hide = undefined;
      clearTimeout(this.highlightCrumbTimeout_Show);
        this.highlightCrumbTimeout_Show = undefined;
      var root = this.highlightSelectCrumb;
      if(root===null || root===undefined) return;
      root.attr("ready",false);
      setTimeout(function(){ root[0][0].parentNode.removeChild(root[0][0]); }, 350);
      this.highlightSelectCrumb = null;
    },
    /** -- */
    clearSelect_Compare: function(){
      this.vizCompareActive = false;
      this.DOM.root.attr("previewcompare",false);
      this.summaries.forEach(function(summary){
        if(summary.inBrowser()) summary.refreshViz_Compare();
      });
      if(this.comparedAggregate){
        this.comparedAggregate.DOM.aggrGlyph.setAttribute("compare",false);
        this.comparedAggregate.items.forEach(function(record){
          if(record.DOM.record===undefined) return;
          record.DOM.record.setAttribute("recCompared","false");
        });
        this.comparedAggregate = null;
      }
      if(this.previewCompareCb) this.previewCompareCb.call(this,true);
    },
    /** -- */
    setSelect_Compare: function(selSummary,selAggregate){
      if(this.vizCompareActive){
        var reclick = selAggregate===this.comparedAggregate;
        this.clearSelect_Compare(); // unset compare selection in aggregates
        if(reclick) {
          this.clearSelect_Compare_Crumb(); // remove selection compare selection fully
          return;
        }
      }

      this.comparedAggregate = selAggregate;
      this.vizCompareActive = true;
      selAggregate.DOM.aggrGlyph.setAttribute("compare",true);
      this.DOM.root.attr("previewcompare",true);
      this.summaries.forEach(function(summary){
        if(!summary.inBrowser()) return;
        summary.cachePreviewValue();
        summary.refreshViz_Compare();
      });

      selAggregate.items.forEach(function(record){
        if(record.DOM.record===undefined) return;
        record.DOM.record.setAttribute("recCompared","true");
      });

      this.recordDisplay.refresh_Compare();

      // **************************
      // CRUMB
      if(this.compareSelectCrumb===null){
        this.compareSelectCrumb = this.insertDOM_crumb("compare");
      }
      this.compareSelectCrumb.select(".crumbHeader").html(selSummary.summaryName);
      var valText = "";
      if(selSummary.type==="categorical"){
        valText = selSummary.catLabel_Func.call(selAggregate.data);
      }
      if(selSummary.type==="interval"){
        var unitName = "<span class='unitName'>"+(selSummary.unitName||"")+"</span>";
        valText = selAggregate.x+unitName+' to '+(selAggregate.x+selAggregate.dx)+unitName;
      }
      this.compareSelectCrumb.select(".filterDetails").html(valText);
      // **************************

      if(this.previewCompareCb) this.previewCompareCb.call(this,false);
    },
    /** -- */
    clearSelect_Highlight: function(){
      var me = this;
      this.vizPreviewActive = false;
      this.highlightSelectedSummary = null;
      this.highlightedAggregate = undefined;
      this.DOM.root.attr("resultpreview",false);

      if(this.highlightCrumbTimeout_Show) {
        // if the crumb is not yet shown, nothing to show...
        clearTimeout(this.highlightCrumbTimeout_Show);
        this.highlightCrumbTimeout_Show = undefined;
      } else {
        if(this.highlightCrumbTimeout_Hide) {
          clearTimeout(this.highlightCrumbTimeout_Hide);
        }
        // if the crumb is shown, start the hide timeout
        this.highlightCrumbTimeout_Hide = setTimeout(function(){
          me.clearSelect_Highlight_Crumb();
        },1000);
      }

      // unhighlight items in the record display
      if(this.recordDisplay) this.recordDisplay.unhighlightRecords();

      this.items.forEach(function(item){ item.updatePreview_Cache = false; });

      this.itemCount_Previewed = 0;
      // Clear highlight visualization in all summaries within the browser
      this.summaries.forEach(function(summary){ if(summary.inBrowser()) summary.clearViz_Highlight(); });

      this.refreshTotalViz();
      if(this.previewCb) this.previewCb.call(this,true);
    },
    /** -- */
    setSelect_Highlight: function(selSummary,selAggregate){
      var me=this;
      this.vizPreviewActive = true;
      this.highlightedAggregate = selAggregate;
      this.highlightSelectedSummary = selSummary;
      this.DOM.root.attr("resultpreview",true);

      // Refresh highligh visualization in all summaries within the browser
      this.summaries.forEach(function(summary){ if(summary.inBrowser()) summary.refreshViz_Highlight(); });

      this.refreshTotalViz();

      function showHighlightCrumb(){
        clearTimeout(me.highlightCrumbTimeout_Show);
          me.highlightCrumbTimeout_Show = undefined;
        clearTimeout(me.highlightCrumbTimeout_Hide);
          me.highlightCrumbTimeout_Hide = undefined;
        if(me.highlightSelectCrumb===null){
          me.highlightSelectCrumb = me.insertDOM_crumb("highlight");
        }
        me.highlightSelectCrumb.select(".crumbHeader").html(selSummary.summaryName);
        var valText = "";
        if(typeof selAggregate === "string"){
          valText = selAggregate;
        } else if(selSummary.type==="categorical"){
          valText = selSummary.catLabel_Func.call(selAggregate.data);
        } else if(selSummary.type==="interval"){
          var unitName = "<span class='unitName'>"+(selSummary.unitName||"")+"</span>";
          valText = selAggregate.x+unitName+' to '+(selAggregate.x+selAggregate.dx)+unitName;
        }
        me.highlightSelectCrumb.select(".filterDetails").html(valText);
      };

      if(this.highlightCrumbTimeout_Hide){
        showHighlightCrumb();
      } else {
        this.highlightCrumbTimeout_Show = setTimeout(function(){
          showHighlightCrumb();
        },1000)
      }

      if(this.previewCb) this.previewCb.call(this,false);
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
      this.divWidth = this.domWidth();
      this.updateLayout_Height();
      this.updateMiddlePanelWidth();
    },
    /** -- */
    updateLayout_Height: function(){
        var me=this;
        var divHeight_Total = this.domHeight();

        var panel_Basic_height = Math.max(parseInt(this.DOM.panel_Basic.style("height")),24)+6;

        divHeight_Total-=panel_Basic_height;

        // initialize all summaries as not yet processed.
        this.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.heightProcessed = false;
        });

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

        // The part where summary DOM is updated
        this.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.refreshHeight();
        });

        if(this.recordDisplay){
            var listDivTop = 0;
            // get height of header
            var listHeaderHeight = this.recordDisplay.DOM.recordViewHeader[0][0].offsetHeight;
            var listDisplayHeight = divHeight_Total - listDivTop - listHeaderHeight - midPanelHeight - bottomPanelHeight;
            if(this.showDropZones && this.panels.middle.summaries.length===0) listDisplayHeight*=0.5;
            this.recordDisplay.setHeight(listDisplayHeight);
        }
    },
    /** -- */
    updateMiddlePanelWidth: function(){
      // for some reason, on page load, this variable may be null. urgh.
      var widthMiddlePanel = this.divWidth;
      if(this.authoringMode) widthMiddlePanel-=kshf.attribPanelWidth;
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
    },
    /** -- */
    getMeasureLabel: function(aggr){
      if(!aggr.isVisible) return;
      var _val = this.vizPreviewActive?
        (this.preview_not?
          aggr.aggregate_Active - aggr.aggregate_Preview :
          aggr.aggregate_Preview
          ):
        aggr.aggregate_Active;

      if(this.percentModeActive){
        if(aggr.aggregate_Active===0) return "";
        if(this.ratioModeActive){
          if(!this.vizPreviewActive) return "";
          _val = 100*_val/aggr.aggregate_Active;
        } else {
          _val = 100*_val/this.recordsWanted_Aggr_Total;
        }
        if(_val<0) _val=0; //TODO? How's this case possible? Why di I insert that check?
        return _val.toFixed(0)+"%";
      }
      if(_val<0) _val=0; // TODO? There is it, again... Just sanity I guess
      return kshf.Util.formatForItemCount(_val);
    },
    /** -- */
    exportConfig: function(){
      var config = {};
      config.domID = this.domID;
      config.itemName = this.itemName;
      config.source = this.source;
      delete config.source.loadedTableCount;
      config.summaries = [];
      config.leftPanelLabelWidth = this.panels.left.width_catLabel;
      config.rightPanelLabelWidth = this.panels.right.width_catLabel;
      config.middlePanelLabelWidth = this.panels.middle.width_catLabel;

      if(typeof this.options.loadedCb === "function"){
        config.loadedCb = this.options.loadedCb.toString();
      }

      if(typeof this.readyCb === "function"){
        config.readyCb = this.readyCb.toString();
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
      this.id = ++kshf.summaryCount;
      this.browser = browser;

      this.summaryName   = name;
      this.summaryColumn = attribFunc?null:name;
      this.summaryFunc   = attribFunc || function(){ return this[name]; };

      this.chartScale_Measure = d3.scale.linear().clamp(true);

      this.DOM = {};
      this.DOM.inited = false;

      this.items = this.browser.items;
      if(this.items===undefined||this.items===null||this.items.length===0){
        alert("Error: Browser.items is not defined...");
        return;
      }

      this.isRecordView = false;

      // Only used when summary is inserted into browser
      this.collapsed_pre = false;
      this.collapsed = false;

      this.aggr_initialized = false;

      this.createSummaryFilter();

      this.insertNugget();
    },
    /** -- */
    setSummaryName: function(name){
        this.summaryName = name;
        if(this.DOM.summaryName_text){
            this.DOM.summaryName_text.text(this.summaryName);
        }
        this.summaryFilter._refreshFilterSummary();
        // This summary may be used for sorting options. Refresh the list
        if(this.browser.recordDisplay){
            if(this.sortingSummary) this.browser.recordDisplay.refreshSortingOptions();
        }
        if(this.isTextSearch){
            this.browser.recordDisplay.DOM.recordTextSearch.select("input")
                .attr("placeholder",kshf.lang.cur.Search+": "+this.summaryName);
        }
        if(this.sortFunc){
            this.browser.recordDisplay.refreshSortingOptions();
        }
        if(this.DOM.nugget){
            this.DOM.nugget.select(".summaryName").text(this.summaryName);
            this.DOM.nugget.attr("state",function(summary){
                if(summary.summaryColumn===null) return "custom"; // calculated
                if(summary.summaryName===summary.summaryColumn) return "exact";
                return "edited";
            });
        }
    },
    /** -- */
    setShowSetMatrix: function(v){
        this.show_set_matrix = v;
        this.DOM.root.attr("show_set_matrix",this.show_set_matrix);
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
            if(this.hasTime) return "interval time";
            return "interval numeric";
            //
            if(this.hasFloat) return "floating";
            return "integer";
        }
        return "?";
    },
    /** -- */
    destroy_full: function(){
      this.destroy();
      // TODO: Properly destroy this using nugget handlers...
      var nuggetDOM = this.DOM.nugget[0][0];
      if(nuggetDOM && nuggetDOM.parentNode) nuggetDOM.parentNode.removeChild(nuggetDOM);
    },
    /** -- */
    destroy: function(){
      delete this.browser.summaries_by_name[this.summaryName];
      if(this.summaryColumn)
        delete this.browser.summaries_by_name[this.summaryColumn];
      this.browser.removeSummary(this);
      if(this.DOM.root){
        this.DOM.root[0][0].parentNode.removeChild(this.DOM.root[0][0]);
      }
      if(this.DOM.nugget){
        this.DOM.nugget[0][0].parentNode.removeChild(this.DOM.nugget[0][0]);
      }
    },
    /** -- */
    inBrowser: function(){
      return this.panel!==undefined;
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
      if(this.isEmpty() || this.collapsed) return this.getHeight_Header();
      return this.getHeight_Header() + this.getHeight_Content();
    },
    /** -- */
    getHeight_Header: function(){
      if(this._height_header==undefined) {
        this._height_header = this.DOM.headerGroup[0][0].offsetHeight;
      }
      return this._height_header;
    },
    /** -- */
    uniqueCategories: function(){
      if(this.browser && this.browser.items[0].idIndex===this.summaryName) return true;
      return false;
    },
    /** -- */
    isFiltered: function(){
        return this.summaryFilter.isFiltered;
    },
    /** -- */
    isEmpty: function(){
      alert("Nope"); // should not be executed
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
        this.updateBarPreviewScale2Active();
      }
      if(this.type==='interval'){
        if(this.browser.recordDisplay)
          this.browser.recordDisplay.addSortingOption(this);
      }
      this.refreshWidth();
    },
    /** -- */
    insertNugget: function(){
      var me=this;
      if(this.DOM.nugget) return;
      this.attribMoved = false;

      this.DOM.nugget = this.browser.DOM.attributeList
        .append("div").attr("class","nugget editableTextContainer")
        .each(function(){
          this.__data__ = me;
        })
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
            gravity: 'e', title: function(){
              return  (!me.aggr_initialized) ? "Click to initialize" : me.getDataType();
            }
          })
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
        .text(function(){ return me.summaryName; })
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

      this.DOM.nugget.append("div").attr("class","fa editTextButton")
        .each(function(){
          this.tipsy = new Tipsy(this, {
            gravity: 'w', title: function(){
              var curState=this.parentNode.getAttribute("edittitle");
              return (curState===null || curState==="false") ? kshf.lang.cur.EditTitle : "OK";
            }
          });
        })
        .on("mouseenter",function(){ this.tipsy.show(); })
        .on("mouseleave",function(){ this.tipsy.hide(); })
        .on("mousedown",function(){
          d3.event.stopPropagation();
          d3.event.preventDefault();
        })
        .on("click",function(){
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
            this.parentNode.setAttribute("edittitle",false);
            summaryName_DOM.setAttribute("contenteditable",false);
            me.browser.changeSummaryName(me.summaryName,summaryName_DOM.textContent);
          }
          // stop dragging event start
          d3.event.stopPropagation();
          d3.event.preventDefault();
        });

      this.DOM.nugget.append("div").attr("class","fa fa-code editCodeButton")
        .each(function(){
          this.tipsy = new Tipsy(this, { gravity: 'w', title: function(){ return "Edit Function"; } });
        })
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

      this.refreshNuggetDisplay();
      if(this.aggr_initialized) this.refreshViz_Nugget();
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
    removeFromPanel: function(){
      if(this.panel===undefined) return;
      this.panel.removeSummary(this);
      this.refreshNuggetDisplay();
    },
    /** -- */
    insertRoot: function(beforeDOM){
      this.DOM.root = this.panel.DOM.root.insert("div", function(){ return beforeDOM; });
      this.DOM.root
        .attr("class","kshfSummary")
        .attr("summary_id",this.id)
        .attr("collapsed",this.collapsed)
        .attr("filtered",false)
        .attr("showConfig",false);
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
            })
            ;

        var header_display_control = this.DOM.headerGroup.append("span").attr("class","header_display_control");

        header_display_control.append("span").attr("class","buttonSummaryCollapse fa fa-collapse")
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: function(){ return me.panelOrder!==0?'sw':'nw'; },
                    title: function(){ return me.collapsed?kshf.lang.cur.OpenSummary:kshf.lang.cur.MinimizeSummary; }
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout" ,function(){ this.tipsy.hide(); })
            .on("mousedown", function(){
                d3.event.preventDefault();
                d3.event.stopPropagation();
            })
            .on("click",function(){
                this.tipsy.hide();
                me.setCollapsedAndLayout(!me.collapsed); // flip
            })
            ;
        header_display_control.append("span").attr("class","buttonSummaryExpand fa fa-arrows-alt")
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: function(){ return me.panelOrder!==0?'sw':'nw'; },
                    title: kshf.lang.cur.MaximizeSummary
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout" ,function(){ this.tipsy.hide(); })
            .on("mousedown", function(){
                d3.event.preventDefault();
                d3.event.stopPropagation();
            })
            .on("click",function(){
                me.panel.collapseAllSummaries();
                me.setCollapsedAndLayout(false); // uncollapse this one
            })
            ;
        header_display_control.append("span").attr("class","buttonSummaryRemove fa fa-remove")
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: function(){ return me.panelOrder!==0?'sw':'nw'; },
                    title: kshf.lang.cur.RemoveSummary
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout" ,function(){ this.tipsy.hide(); })
            .on("mousedown", function(){
                d3.event.preventDefault();
                d3.event.stopPropagation();
            })
            .on("click",function(){
                this.tipsy.hide();
                me.removeFromPanel();
                me.clearDOM();
                me.browser.updateLayout();
            })
            ;

        this.DOM.summaryName = this.DOM.headerGroup.append("span")
            .attr("class","summaryName editableTextContainer")
            .attr("edittitle",false)
            .on("click",function(){ if(me.collapsed) me.setCollapsedAndLayout(false); })
            ;

        this.DOM.summaryName.append("span").attr("class","chartFilterButtonParent").append("div")
            .attr("class","clearFilterButton rowFilter inSummary")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: function(){ return me.panelOrder!==0?'s':'n'; },
                    title: kshf.lang.cur.RemoveFilter
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout" ,function(){ this.tipsy.hide(); })
            .on("mousedown", function(){
                d3.event.preventDefault();
                d3.event.stopPropagation();
            })
            .on("click", function(d,i){
                this.tipsy.hide();
                me.summaryFilter.clearFilter();
            })
            .append("span").attr("class","fa fa-times")
            ;

        this.DOM.summaryName_text = this.DOM.summaryName.append("span").attr("class","summaryName_text editableText")
            .attr("contenteditable",false)
            .on("mousedown", function(){
                // stop dragging event start
                d3.event.stopPropagation();
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

        this.DOM.summaryName.append("span")
            .attr("class","editTextButton fa")
            .each(function(summary){
                this.tipsy = new Tipsy(this, {
                    gravity: 'w', title: function(){
                        var curState=this.parentNode.getAttribute("edittitle");
                        if(curState===null || curState==="false"){
                            return kshf.lang.cur.EditTitle;
                        } else {
                            return "OK";
                        }
                    }
                })
            })
            .on("mouseenter",function(){ this.tipsy.show(); })
            .on("mouseleave",function(){ this.tipsy.hide(); })
            .on("mousedown", function(){
                // stop dragging event start
                d3.event.stopPropagation();
                d3.event.preventDefault();
            })
            .on("click",function(){
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
            });

      this.DOM.summaryIcons = this.DOM.headerGroup.append("span").attr("class","summaryIcons");

      this.DOM.summaryIcons.append("span").attr("class", "hasMultiMappings fa fa-tags")
        .each(function(d){
          this.tipsy = new Tipsy(this, {
            gravity: 'ne', title: function(){
              return "Multiple "+me.summaryName+" possible.<br>Click to show relations.";
            }
          });
        })
        .on("mouseover",function(d){ this.tipsy.show(); })
        .on("mouseout" ,function(d){ this.tipsy.hide(); })
        .on("click",function(d){
          me.setShowSetMatrix(!me.show_set_matrix);
        });

      this.DOM.summaryForRecordDisplay = this.DOM.summaryIcons.append("span")
        .attr("class", "useForRecordDisplay fa")
        .each(function(d){
          this.tipsy = new Tipsy(this, {
            gravity: 'ne', title: function(){
              return "Use to "+
                ((me.browser.recordDisplay.displayType==="map")?"color":"sort")+" "+me.browser.itemName;
            }
          });
        })
        .on("mouseover",function(d){ this.tipsy.show(); })
        .on("mouseout" ,function(d){ this.tipsy.hide(); })
        .on("click",function(d){
          if(me.browser.recordDisplay.recordViewSummary){
            me.browser.recordDisplay.setSortingOpt_Active(me);
            me.browser.recordDisplay.refreshSortingOptions();
          }
        });

      this.DOM.summaryViewAs = this.DOM.summaryIcons.append("span")
        .attr("class","summaryViewAs fa")
        .attr("viewAs","map")
        .each(function(d){ 
          this.tipsy = new Tipsy(this, { gravity: 'ne', 
            title: function(){ return "View as "+(me.viewType==='list'?'Map':'List'); }
          });
        })
        .on("mouseover",function(d){ this.tipsy.show(); })
        .on("mouseout" ,function(d){ this.tipsy.hide(); })
        .on("click",function(d){
          this.tipsy.hide();
          this.setAttribute("viewAs",me.viewType);
          me.viewAs( (me.viewType==='list') ? 'map' : 'list' );
        });

      this.DOM.summaryDescription = this.DOM.summaryIcons.append("span")
        .attr("class","summaryDescription fa fa-info-circle")
        .each(function(d){  this.tipsy = new Tipsy(this, { gravity:'ne', title:function(){return me.description;} }); })
        .on("mouseover",function(d){ this.tipsy.show(); })
        .on("mouseout" ,function(d){ this.tipsy.hide(); });

      this.setDescription(this.description);

      this.DOM.summaryConfigControl = this.DOM.summaryIcons.append("span")
        .attr("class","summaryConfigControl fa fa-gear")
        .each(function(d){  this.tipsy = new Tipsy(this, { gravity:'ne', title: "Configure" }); })
        .on("mouseover",function(d){ this.tipsy.show(); })
        .on("mouseout" ,function(d){ this.tipsy.hide(); })
        .on("click",function(d){
          this.tipsy.hide();
          me.DOM.root.attr("showConfig",me.DOM.root.attr("showConfig")==="false");
        });

      this.DOM.summaryConfig = this.DOM.root.append("div").attr("class","summaryConfig");

      this.DOM.wrapper = this.DOM.root.append("div").attr("class","wrapper");
    },
    /** -- */
    setDescription: function(description){
        this.description = description;
        if(this.DOM.summaryDescription===undefined) return;
        this.DOM.summaryDescription.style("display",this.description===undefined?null:"inline");
    },
    /** -- */
    insertChartAxis_Measure: function(dom, pos1, pos2){
      var me=this;
      this.DOM.chartAxis_Measure = dom.append("div").attr("class","chartAxis_Measure");
      this.DOM.chartAxis_Measure.append("span").attr("class","measurePercentControl")
        .each(function(){
          this.tipsy = new Tipsy(this, {
            gravity: pos1, title: function(){
              return "<span class='fa fa-eye'></span> "+kshf.lang.cur[(me.browser.percentModeActive?'Absolute':'Percent')];
            },
          })
        })
        .on("click",function(){
          this.tipsy.hide();
          me.browser.setPercentMode(!me.browser.percentModeActive);
        })
        .on("mouseover",function(){
          me.browser.DOM.root.selectAll(".measurePercentControl").attr("highlight",true);
          this.tipsy.show();
        })
        .on("mouseout",function(){
          me.browser.DOM.root.selectAll(".measurePercentControl").attr("highlight",false);
          this.tipsy.hide();
        });

      // Two controls, one for each side of the scale
      this.DOM.chartAxis_Measure.selectAll(".relativeModeControl").data([1,2])
        .enter().append("span")
          .attr("class",function(d){ return "relativeModeControl relativeModeControl_"+d; })
          .each(function(){
            this.tipsy = new Tipsy(this, {
              gravity: pos2, title: function(){
                return (me.browser.ratioModeActive?kshf.lang.cur.Absolute:kshf.lang.cur.Relative)+" "+
                    kshf.lang.cur.Width+
                    " <span class='fa fa-arrows-h'></span>";
              },
            });
          })
          .on("click",function(){ 
            this.tipsy.hide();
            me.browser.setRatioMode(!me.browser.ratioModeActive);
          })
          .on("mouseover",function(){
            me.browser.DOM.root.selectAll(".relativeModeControl").attr("highlight",true);
            this.tipsy.show();
          })
          .on("mouseout",function(){
            me.browser.DOM.root.selectAll(".relativeModeControl").attr("highlight",false);
            this.tipsy.hide();
          });

      this.DOM.highlightedAggrValue = this.DOM.chartAxis_Measure.append("div").attr("class","highlightedAggrValue longRefLine");
    },
    /** -- */
    setCollapsedAndLayout: function(hide){
        this.setCollapsed(hide);
        this.browser.updateLayout_Height();
    },
    /** -- */
    setCollapsed: function(v){
      this.collapsed_pre = this.collapsed;
      this.collapsed = v;
      if(this.DOM.root){
        this.DOM.root
          .attr("collapsed",this.collapsed)
          .attr("showConfig",false);
        if(!this.collapsed) {
          this.clearViz_Highlight();
          this.refreshViz_All();
          this.refreshMeasureLabel();
        } else {
          this.DOM.headerGroup.select(".buttonSummaryExpand").style("display","none");
        }
      }
    },
    /** -- */
    refreshViz_All: function(){
      if(this.isEmpty() || this.collapsed) return;
      var me=this;
      this.refreshViz_Total();
      this.refreshViz_Active();
      this.refreshViz_Compare();
      this.refreshViz_Axis();

      this.DOM.aggr_Preview.attr("fast",null); // take it slow for result preview animations
      this.refreshViz_Highlight();
      setTimeout(function(){ me.DOM.aggr_Preview.attr("fast",true); },800);
    },
    /** Gets the active previewed value, and stores it in the cache */
    cachePreviewValue: function(){
      if(this.isEmpty() || this.collapsed) return;
      var preview_not=this.browser.preview_not;
      this.DOM.aggrGlyphs.each(function(aggr){
        aggr.aggregate_Compare = aggr.aggregate_Preview;
        if(preview_not) aggr.aggregate_Compare = aggr.aggregate_Active-aggr.aggregate_Preview;
      });
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
      if(this.percentileChartVisible) config.showPercentile = true;
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
      return config;
    }
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

    if(this.items.length<=1000) this.initializeAggregates();
  },
  /** -- */
  initializeAggregates: function(){
    if(this.aggr_initialized) return;
    if(this.catTableName===undefined){
      // Create new table
      this.catTableName = this.summaryName+"_h_"+this.id;
      this.browser.createTableFromTable(this.items, this.catTableName, this.summaryFunc);
    }
    if(kshf.dt[this.catTableName]===undefined){
      return false; // Cannot initialize, table not defined.
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

    var totalWidth= 25;
    var maxAggregate_Total = this.getMaxAggr_Total();
    nuggetChart.selectAll(".nuggetBar").data(this._cats).enter()
      .append("span").attr("class","nuggetBar")
        .style("width",function(cat){ return totalWidth*(cat.items.length/maxAggregate_Total)+"px"; });

    this.DOM.nugget.select(".nuggetInfo").html(
      "<span class='fa fa-tag"+(this.isMultiValued?"s":"")+"'></span><br>"+
      this._cats.length+"<br>rows<br>");
  },

  /***********************************
   * SIZE (HEIGH/WIDTH) QUERY FUNCTIONS
   *************************************/
  /** -- */
  getHeight_RangeMax: function(){
    if(this.viewType==="map") {
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
  /** -- */
  getWidth_CatChart: function(){
    // This will make the bar width extend over to the scroll area.
    // Doesn't look better, the amount of space saved makes chart harder to read and breaks the regularly spaced flow.
    /*if(!this.scrollBarShown()){
        return this.panel.width_catBars+kshf.scrollWidth-5;
    }*/
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
  hasCategories: function(){
    if(this._cats && this._cats.length===0) return false;
    return this.summaryFunc!==undefined;
  },
  /** -- */
  uniqueCategories: function(){
    return this.getMaxAggr_Total()===1;
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
    this.refreshSortOptions();
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
  refreshSortOptions: function(){
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
        var x = b.aggregate_Active - a.aggregate_Active;
        if(x===0) x = b.aggregate_Total - a.aggregate_Total;
        if(x===0) x = idCompareFunc(a,b); // stable sorting. ID's would be string most probably.
        if(inverse) x=-x;
        return x;
      };
    }
    this._cats.sort(theSortFunc);
    this._cats.forEach(function(cat,i){ cat.orderIndex=i; });
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
    createSummaryFilter: function(){
        var me=this;
        this.summaryFilter = this.browser.createFilter({
            parentSummary: this,
            onClear: function(summary){
                summary.clearCatTextSearch();
                summary.unselectAllCategories();
                summary._update_Selected();
            },
            onFilter: function(summary){
                // at least one category is selected in some modality (and/ or/ not)
                summary._update_Selected();

                var filterId = this.id;

                summary.items.forEach(function(item){
                    var recordVal_s=item.mappedDataCache[filterId];

                    if(this.unmapped===true){
                        item.setFilterCache(filterId, recordVal_s===null);
                        return;
                    }

                    if(recordVal_s===null){
                        // survives if AND and OR is not selected
                        item.setFilterCache(filterId, this.selected_AND.length===0 && this.selected_OR.length===0 );
                        return;
                    }

                    // Check NOT selections - If any mapped item is NOT, return false
                    // Note: no other filtering depends on NOT state.
                    // This is for ,multi-level filtering using not query
        /*            if(this.selected_NOT.length>0){
                        if(!recordVal_s.every(function(item){
                            return !item.is_NOT() && item.isWanted;
                        })){
                            item.setFilterCache(filterId,false); return;
                        }
                    }*/

                    // If any of the record values are selected with NOT, the item will be removed
                    if(this.selected_NOT.length>0){
                        if(!recordVal_s.every(function(val){ return !val.is_NOT(); })){
                            item.setFilterCache(filterId,false); return;
                        }
                    }
                    // All AND selections must be among the record values
                    if(this.selected_AND.length>0){
                        // Compute the number of record values selected with AND.
                        var t=0;
                        recordVal_s.forEach(function(m){ if(m.is_AND()) t++; })
                        if(t!==this.selected_AND.length){
                            item.setFilterCache(filterId,false); return;
                        }
                    }
                    // One of the OR selections must be among the item values
                    // Check OR selections - If any mapped item is OR, return true
                    if(this.selected_OR.length>0){
                        item.setFilterCache(filterId, recordVal_s.some(function(d){return (d.is_OR());}) );
                        return;
                    }
                    // only NOT selection
                    item.setFilterCache(filterId,true);
                }, this);
            },
            filterView_Detail: function(){
                if(this.unmapped===true){
                    return "(no data)";
                }
                // 'this' is the Filter
                // go over all items and prepare the list
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
        var filterId = this.summaryFilter.id, me=this;
        this.unmappedRecords = [];

        var targetTable_id = {};
        var targetTable = [];
        kshf.dt[this.catTableName].forEach(function(srcI){
            var i = new kshf.Item(srcI.data,srcI.idIndex);
            targetTable_id[i.id()] = i;
            targetTable.push(i);
        });
        this.catTable = targetTable;
        this._cats = this.catTable;
        var maxDegree = 0;
        this.items.forEach(function(item){
            item.mappedDataCache[filterId] = null; // default mapping to null

            var mapping = this.summaryFunc.call(item.data,item);
            if(mapping===undefined || mapping==="" || mapping===null){
                this.unmappedRecords.push(item);
                return;
            }
            if(mapping instanceof Array){
                var found = {};
                mapping = mapping.filter(function(e){
                    if(e===undefined || e==="" || e===null) return false; // remove invalid values
                    if(found[e]===undefined){ found[e] = true;  return true; } // remove duplicate values
                    return false;
                });
                if(mapping.length===0) { // empty array - checked after removing invalid/duplicates
                    this.unmappedRecords.push(item);
                    return; 
                }
            } else {
                mapping = [mapping];
            }
            maxDegree = Math.max(maxDegree, mapping.length);

            item.mappedDataCache[filterId] = [];
            mapping.forEach(function(a){
                var m=targetTable_id[a];
                if(m==undefined) return;
                item.mappedDataCache[filterId].push(m);
                m.addItem(item);
            });
        }, this);

        this.isMultiValued = maxDegree>1;

        // TODO: Fix!!!!
        // add degree filter if attrib has multi-value items and set-vis is enabled
        if(this.isMultiValued && this.enableSetVis){
            var fscale;
            if(maxDegree>100) fscale = 'log';
            else if(maxDegree>10) fscale = 'linear';
            else fscale = 'step';
            var facetDescr = {
                name:"<i class='fa fa-hand-o-up'></i> # of "+this.summaryName,
                value: function(d){
                    var arr=d.mappedDataCache[filterId];
                    return (arr==null) ? 0 : arr.length;
                },
                collapsed: true,
                type: 'interval',
                scaleType: fscale,
                panel: this.panel
            };
            this.browser.addFacet(facetDescr,this.browser.primaryTableName);
        }

        this.updateCats();

        this.unselectAllCategories();

        if(this.unmappedRecords.length>0 && this.DOM.unmapped_records){
            this.DOM.unmapped_records.style("display","block");
        }
    },

  // Modified internal dataMap function - Skip rows with 0 active item count
  setMinAggrValue: function(v){
    this.minAggrValue = Math.max(1,v);
    this._cats = this.catTable.filter(function(cat){ return cat.items.length>=this.minAggrValue; },this);
    this.updateCats();
  },
  /** -- */
  updateCats: function(){
    // Few categories. Disable resorting after filtering
    if(this._cats.length<=4) {
      this.catSortBy.forEach(function(opt){ opt.no_resort=true; });
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

    if(this.DOM.inited===true) return;

    this.insertRoot(beforeDOM);

    this.DOM.root
      .attr("filtered_or",0)
      .attr("filtered_and",0)
      .attr("filtered_not",0)
      .attr("filtered_total",0)
      .attr("isMultiValued",this.isMultiValued)
      .attr("summary_type","categorical")
      .attr("hasMap",this.catMap!==undefined)
      ;

    this.insertHeader();

    if(!this.isEmpty()) this.init_DOM_Cat();

    this.setCollapsed(this.collapsed);

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
            .each(function(){
                this.tipsy = new Tipsy(this, {gravity: 'e', title: kshf.lang.cur.ScrollToTop });
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout" ,function(){ this.tipsy.hide(); })
            .on("click",function(d){
                this.tipsy.hide();
                kshf.Util.scrollToPos_do(me.DOM.aggrGroup[0][0],0);
            })
            ;

        this.DOM.aggrGroup = this.DOM.summaryCategorical.append("div").attr("class","aggrGroup")
            .on("mousedown",function(){
                d3.event.stopPropagation();
                d3.event.preventDefault();
            })
            .on("scroll",function(d){
                if(kshf.Util.ignoreScrollEvents===true) return;
                me.scrollTop_cache = me.DOM.aggrGroup[0][0].scrollTop;

                me.DOM.scrollToTop.style("visibility", me.scrollTop_cache>0?"visible":"hidden");

                me.firstCatIndexInView = Math.floor(me.scrollTop_cache/me.heightRow_category);
                me.refreshScrollDisplayMore(me.firstCatIndexInView+me.catCount_InDisplay);
                me.updateCatIsInView();
                me.cullAttribs();
                me.refreshMeasureLabel();

                me.browser.pauseResultPreview = true;
                if(this.pauseTimer) clearTimeout(this.pauseTimer);
                this.pauseTimer = setTimeout(function(){me.browser.pauseResultPreview=false;}, 200);
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

        this.DOM.unmapped_records = this.DOM.belowCatChart.append("span").attr("class","unmapped_records fa fa-ban")
          .style("display",this.unmappedRecords.length>0?"block":"none")
          .each(function(){
            this.tipsy = new Tipsy(this, {gravity: 'w', title: function(){ 
              return "<b>"+me.unmappedRecords.length+"</b> "+me.browser.itemName+" without data"; 
            }});
          })
          .on("mouseover",function(){
            this.tipsy.show();

            if(!me.isMultiValued && me.summaryFilter.selected_AND.length!==0) return;
            if(!me.browser.pauseResultPreview &&
              (me.isMultiValued || me.summaryFilter.selected_AND.length===0)){
                // calculate the preview
                me.unmappedRecords.forEach(function(record){record.updatePreview();});
                me.browser.itemCount_Previewed = me.unmappedRecords.length;
                me.browser.setSelect_Highlight(me,"(no data)");
            }
          })
          .on("mouseout" ,function(){ 
            this.tipsy.hide();
            me.browser.clearSelect_Highlight();
          })
          .on("click", function(){
            if(me.summaryFilter.unmapped===true){
              me.summaryFilter.unmapped = false;
              this.setAttribute("filtered",false);
              me.summaryFilter.clearFilter();
              return;
            }
            // filter
            me.summaryFilter.how = "All";
            this.setAttribute("filtered",true);
            me.summaryFilter.clearFilter();
            me.summaryFilter.unmapped = true; // filter to unmapped items only
            me.summaryFilter.addFilter(true);
          })
          ;

        this.DOM.scroll_display_more = this.DOM.belowCatChart.append("div")
          .attr("class","hasLabelWidth scroll_display_more")
          .on("click",function(){
            kshf.Util.scrollToPos_do(
              me.DOM.aggrGroup[0][0],me.DOM.aggrGroup[0][0].scrollTop+me.heightRow_category);
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
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout" ,function(){ this.tipsy.hide(); });
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

      this.refreshSortOptions();
    },
    /** -- */
    initDOM_CatTextSearch: function(){
        var me=this;
        this.DOM.catTextSearch = this.DOM.summaryControls.append("div").attr("class","textSearchBox catTextSearch hasLabelWidth");
        this.DOM.catTextSearchControl = this.DOM.catTextSearch.append("span")
            .attr("class","textSearchControl fa")
            .on("click",function() { 
                me.DOM.catTextSearchControl.attr("showClear",false);
                me.summaryFilter.clearFilter();
            });
        this.DOM.catTextSearchInput = this.DOM.catTextSearch.append("input")
            .attr("class","textSearchInput")
            .attr("type","text")
            .attr("placeholder",kshf.lang.cur.Search)
//            .on("mousedown",function(){alert('sdsdd');})
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
                            me.summaryFilter.unmapped = false;
                            me.summaryFilter.addFilter(true);
                        }
                    }
                }, 750);
            })
            ;
    },

    /** returns the maximum active aggregate value per row in chart data */
    getMaxAggr_Active: function(){
      return d3.max(this._cats, function(cat){ return cat.aggregate_Active; });
    },
    /** returns the maximum total aggregate value stored per row in chart data */
    getMaxAggr_Total: function(){
      if(this._cats===undefined) return 0;
      if(this.isEmpty()) return 0;
      if(this._maxBarValueMaxPerAttrib) return this._maxBarValueMaxPerAttrib;
      this._maxBarValueMaxPerAttrib = d3.max(this._cats, function(d){ return d.aggregate_Total; });
      return this._maxBarValueMaxPerAttrib;
    },
    /** -- */
    _update_Selected: function(){
        if(this.DOM.root) {
            this.DOM.root
                .attr("filtered",this.isFiltered())
                .attr("filtered_or",this.summaryFilter.selected_OR.length)
                .attr("filtered_and",this.summaryFilter.selected_AND.length)
                .attr("filtered_not",this.summaryFilter.selected_NOT.length)
                .attr("filtered_total",this.summaryFilter.selectedCount_Total())
                ;
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
      this._cats.forEach(function(cat){
        if(cat.f_selected() && cat.DOM.aggrGlyph) cat.DOM.aggrGlyph.setAttribute("highlight",false);
        cat.set_NONE();
      });
      this.summaryFilter.selected_All_clear();
      if(this.DOM.inited) this.DOM.unmapped_records.attr("filtered",false);
    },
    /** -- */
    clearCatTextSearch: function(){
      if(!this.showTextSearch) return;
      if(this.skipTextSearchClear) return;
      this.DOM.catTextSearchControl.attr("showClear",false);
      this.DOM.catTextSearchInput[0][0].value = '';
    },
    /** -- */
    scrollBarShown: function(){
      return this.categoriesHeight<this._cats.length*this.heightRow_category;
    },
    /** -- */
    updateBarPreviewScale2Active: function(){
      if(this.isEmpty()) return; // nothing to do
      var maxAggr_Active = this.getMaxAggr_Active();

      this.chartScale_Measure
        .rangeRound([0, this.getWidth_CatChart()])
        .nice(this.chartAxis_Measure_TickSkip())
        .domain([ 0,(maxAggr_Active===0)?1:maxAggr_Active ]);

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
      if(this.cbSetHeight && attribHeight_old!==this.categoriesHeight) this.cbSetHeight(this);
    },
    /** -- */
    updateAfterFilter: function(){
      if(this.isEmpty() || this.collapsed) return;
      var me=this;
      
      if(this.viewType==='map'){
        this.updateCatCount_Active();
        this.map_refreshBounds_Active();
        setTimeout(function(){ me.map_zoomToActive(); }, 1000);
        this.refreshMeasureLabel();
        this.refreshViz_Active();
        return;
      }
      
      this.refreshMeasureLabel();
      this.updateBarPreviewScale2Active();

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
      this.DOM.summaryCategorical.style("width",this.getWidth()+"px");
      this.DOM.summaryName.style("max-width",(this.getWidth()-40)+"px");
      this.DOM.chartAxis_Measure.selectAll(".relativeModeControl")
        .style("width",(this.getWidth()-this.panel.width_catMeasureLabel-this.getWidth_Label()-kshf.scrollWidth)+"px");
      this.refreshViz_Axis();
    },
    /** -- */
    refreshMeasureLabel: function(){
      if(this.isEmpty() || this.collapsed) return;
      //if(this.viewType!=='list') return;
      if(this.browser.highlightSelectedSummary===this && !this.isMultiValued) return;
      var me=this;
      this.DOM.aggrGlyphs.attr("noitems",function(aggr){ return !me.isCatSelectable(aggr); });
      this.DOM.measureLabel.text(function(aggr){ return me.browser.getMeasureLabel(aggr); });
    },
    /** -- */
    refreshViz_Total: function(){
      if(this.isEmpty() || this.collapsed) return;
      var me = this;
      var width_Text = this.getWidth_Label()+this.panel.width_catMeasureLabel;

      // Do not need to update total. Total value is invisible. Percent view is based on active count.
      if(this.browser.ratioModeActive){
        this.DOM.aggr_TotalTip.style("opacity",0);
      } else {
        this.DOM.aggr_Total.each(function(_cat){
          kshf.Util.setTransform(this,
            "translateX("+width_Text+"px) scaleX("+me.chartScale_Measure(_cat.aggregate_Total)+")");
        });
        this.DOM.aggr_TotalTip
          .each(function(_cat){
            kshf.Util.setTransform(this,
              "translateX("+(me.chartScale_Measure(_cat.aggregate_Total)+width_Text)+"px)");
          })
          .style("opacity",function(_cat){
            return (_cat.aggregate_Total>me.chartScale_Measure.domain()[1])?1:0;
          });
      }
    },
    /** -- */
    temp_refreshMapColorScale: function(){
      var boundMin = this.browser.percentModeActive?
        0 :
        1; //d3.min(this._cats, function(_cat){ return _cat.aggregate_Active; }), 
      var maxAggr_Active = this.getMaxAggr_Active();
      var boundMax = this.browser.percentModeActive?
        100*maxAggr_Active/this.browser.recordsWanted_Aggr_Total :
        maxAggr_Active
        ;
      
      this.mapColorScale = d3.scale.linear()
        .range([0, 9])
        .domain( [boundMin, boundMax]);

      this.DOM.catMapColorScale.select(".boundMin").text(Math.round(boundMin));
      this.DOM.catMapColorScale.select(".boundMax").text(Math.round(boundMax));
    },
    /** -- */
    refreshViz_Active: function(){
      if(this.isEmpty() || this.collapsed) return;
      var me=this;
      var ratioMode = this.browser.ratioModeActive;

      if(this.viewType==='map') {
        var boundMin = this.browser.percentModeActive?
          0 :
          1; //d3.min(this._cats, function(_cat){ return _cat.aggregate_Active; }), 
        var maxAggr_Active = this.getMaxAggr_Active();
        var boundMax = this.browser.percentModeActive?
          100*maxAggr_Active/this.browser.recordsWanted_Aggr_Total :
          maxAggr_Active
          ;
        
        this.mapColorScale = d3.scale.linear()
          .range([0, 9])
          .domain( [boundMin, boundMax]);

        this.DOM.catMapColorScale.select(".boundMin").text(boundMin);
        this.DOM.catMapColorScale.select(".boundMax").text(boundMax);

        this.DOM.aggr_Active
          .attr("fill", function(_cat){ 
            var v = _cat.aggregate_Active;
            if(v<=0 || v===undefined ) return "url(#diagonalHatch)";
            var vv = me.mapColorScale(v);
            if(ratioMode) vv=0;
            //if(me.sortingOpt_Active.invertColorScale) vv = 9 - vv;
            return me.mapColorQuantize(vv); 
          })
          .attr("stroke", function(_cat){ 
            var v = _cat.aggregate_Active;
            var vv = 9-me.mapColorScale(v);
            if(ratioMode) vv=8;
            //if(me.sortingOpt_Active.invertColorScale) vv = 9 - vv;
            return me.mapColorQuantize(vv); 
          });
        return;
      }
      
      var maxWidth = this.chartScale_Measure.range()[1];
      var width_Text = this.getWidth_Label()+this.panel.width_catMeasureLabel;

      this.DOM.aggr_Active.each(function(_cat){
        kshf.Util.setTransform(this,"translateX("+width_Text+"px) scaleX("+(ratioMode?
          ((_cat.aggregate_Active===0)?0:maxWidth):
          me.chartScale_Measure(_cat.aggregate_Active)
        )+")");
      });
      var func_clickAreaScale = function(_cat){
        return width_Text+(ratioMode?
          ((_cat.aggregate_Active===0)?0:maxWidth):
          me.chartScale_Measure(_cat.aggregate_Active)
        )+"px";
      };
      this.DOM.attribClickArea.style("width",func_clickAreaScale);
      this.DOM.lockButton
        .style("left",func_clickAreaScale)
        .attr("inside",function(_cat){
          if(ratioMode) return "";
          if(maxWidth-me.chartScale_Measure(_cat.aggregate_Active)<10) return "";
        });
    },
    /** -- */
    refreshViz_Highlight: function(){
      if(this.isEmpty() || this.collapsed || !this.browser.vizPreviewActive) return;
      var me = this;
      var ratioMode = this.browser.ratioModeActive;
      var isThisIt = this===this.browser.highlightSelectedSummary;

      this.refreshMeasureLabel();

      if(this.viewType=='map'){

        if(!isThisIt) {
          var boundMin = ratioMode ? 
            d3.min(this._cats, function(_cat){ 
              if(_cat.aggregate_Active===0 || _cat.aggregate_Preview===0) return null;
              return 100*_cat.aggregate_Preview/_cat.aggregate_Active; }) :
            1; //d3.min(this._cats, function(_cat){ return _cat.aggregate_Active; }), 
          var boundMax = ratioMode ? 
            d3.max(this._cats, function(_cat){ 
              if(_cat.aggregate_Active===0) return null;
              return 100*_cat.aggregate_Preview/_cat.aggregate_Active; }) : 
            d3.max(this._cats, function(_cat){ return _cat.aggregate_Preview; });
          
          this.DOM.catMapColorScale.select(".boundMin").text(Math.round(boundMin));
          this.DOM.catMapColorScale.select(".boundMax").text(Math.round(boundMax));

          this.mapColorScale = d3.scale.linear()
            .range([0, 9])
            .domain( [boundMin,boundMax]);
        }


        this.DOM.aggr_Preview
          .attr("fill", function(_cat){ 
            if(isThisIt) {
              if(_cat === me.browser.highlightedAggregate) return me.mapColorQuantize(9); 
              return "rgba(0,0,0,0)";
            }
            var _v = _cat.aggregate_Active;
            if(_v<=0 || _v===undefined ) return "url(#diagonalHatch)";
            v = _cat.aggregate_Preview;
            if(v<=0 || v===undefined ) return "url(#diagonalHatch)";
            if(ratioMode) {
              v = 100*v/_cat.aggregate_Active;
            }
            return me.mapColorQuantize(me.mapColorScale(v)); 
          })
          .attr("stroke", function(_cat){ 
            var v = _cat.aggregate_Preview;
            if(v!==0) return "orangered";
            return null;
          });
        return;
      }

      var maxWidth = this.chartScale_Measure.range()[1];
      var width_Text = this.getWidth_Label()+this.panel.width_catMeasureLabel;
      
      this.DOM.aggr_Preview.each(function(_cat){
        var p=_cat.aggregate_Preview;
        if(me.browser.preview_not) p = _cat.aggregate_Active-p;
        kshf.Util.setTransform(this,"translateX("+width_Text+"px) scaleX("+(
            ratioMode ? ((p/_cat.aggregate_Active)*maxWidth ) : me.chartScale_Measure(p)
        )+")");
      });
    },
    /** -- */
    refreshViz_Compare: function(){
      if(this.isEmpty() || this.collapsed || !this.browser.vizCompareActive) return;
      var me=this, ratioMode=this.browser.ratioModeActive, maxWidth = this.chartScale_Measure.range()[1];
      var width_Text = this.getWidth_Label()+this.panel.width_catMeasureLabel;
      if(this.browser.vizCompareActive){
        this.DOM.aggr_Compare.each(function(_cat){
          kshf.Util.setTransform(this,"translateX("+width_Text+"px) scaleX("+(
            ratioMode ? ((_cat.aggregate_Compare/_cat.aggregate_Active)*maxWidth) : me.chartScale_Measure(_cat.aggregate_Compare)
          )+")");
        });
      } else {
        this.DOM.aggr_Compare.each(function(){
          kshf.Util.setTransform(this,"translateX("+width_Text+"px) scaleX(0)");
        });
      }
    },
    /** -- */
    clearViz_Highlight: function(){
      if(this.isEmpty()) return;
      this._cats.forEach(function(_cat){ 
        _cat.updatePreview_Cache = false;
        _cat.aggregate_Preview=0;
      });
      if(this.collapsed) return;

      this.DOM.highlightedAggrValue.style("opacity",0);
      this.refreshMeasureLabel();

      if(this.viewType==='map'){
        this.temp_refreshMapColorScale();
        return;
      }
      if(this.viewType==='list'){
        var width_Text = this.getWidth_Label()+this.panel.width_catMeasureLabel;
        this.DOM.aggr_Preview.each(function(_cat){
            kshf.Util.setTransform(this,"translateX("+width_Text+"px) scaleX(0)");
        });
      }
    },
    /** -- */
    refreshViz_Axis: function(){
        if(this.isEmpty()) return;
        var me=this;

        var tickValues;
        var transformFunc;

        var maxValue;

        var chartWidth = this.getWidth_CatChart();

        if(this.browser.ratioModeActive) {
            maxValue = 100;
            tickValues = d3.scale.linear()
                .rangeRound([0, chartWidth])
                .nice(this.chartAxis_Measure_TickSkip())
                .clamp(true)
                .domain([0,100])
                .ticks(this.chartAxis_Measure_TickSkip());
        } else {
            if(this.browser.percentModeActive) {
                maxValue = Math.round(100*me.getMaxAggr_Active()/me.browser.recordsWanted_Aggr_Total);
                tickValues = d3.scale.linear()
                    .rangeRound([0, chartWidth])
                    .nice(this.chartAxis_Measure_TickSkip())
                    .clamp(true)
                    .domain([0,maxValue])
                    .ticks(this.chartAxis_Measure_TickSkip());
            } else {
                tickValues = this.chartScale_Measure.ticks(this.chartAxis_Measure_TickSkip())
            }
        }

        // remove non-integer values & 0...
        tickValues = tickValues.filter(function(d){return d%1===0&&d!==0;});

        var tickDoms = this.DOM.chartAxis_Measure.selectAll("span.tick").data(tickValues,function(i){return i;});

        if(this.browser.ratioModeActive){
            transformFunc=function(d){
                kshf.Util.setTransform(this,"translateX("+(d*chartWidth/100-0.5)+"px)");
            };
        } else {
            if(this.browser.percentModeActive) {
                transformFunc=function(d){
                    kshf.Util.setTransform(this,"translateX("+((d/maxValue)*chartWidth-0.5)+"px)");
                };
            } else {
                transformFunc=function(d){
                    kshf.Util.setTransform(this,"translateX("+(me.chartScale_Measure(d)-0.5)+"px)");
                };
            }
        }

        var x=this.browser.noAnim;

        if(x===false) this.browser.setNoAnim(true);
        var tickData_new=tickDoms.enter().append("span").attr("class","tick").each(transformFunc);
        if(x===false) this.browser.setNoAnim(false);

        // translate the ticks horizontally on scale
        tickData_new.append("span").attr("class","line longRefLine")
            .style("top","-"+(this.categoriesHeight+3)+"px")
            .style("height",(this.categoriesHeight-1)+"px");

        if(this.browser.ratioModeActive){
            tickData_new.append("span").attr("class","text").text(function(d){return d;});
        } else {
            tickData_new.append("span").attr("class","text").text(function(d){return d3.format("s")(d);});
        }
        if(this.configRowCount>0){
            var h=this.categoriesHeight;
            var hm=tickData_new.append("span").attr("class","text text_upper").style("top",(-h-21)+"px");
            if(this.browser.ratioModeActive){
                hm.text(function(d){return d;});
            } else {
                hm.text(function(d){return d3.format("s")(d);});
            }
            this.DOM.chartAxis_Measure.select(".chartAxis_Measure_background_2").style("display","block");
        }

        setTimeout(function(){
            me.DOM.chartAxis_Measure.selectAll("span.tick").style("opacity",1).each(transformFunc);
        });

        tickDoms.exit().remove();
    },
    /** -- */
    refreshLabelWidth: function(){
      if(this.isEmpty()) return;
      if(this.DOM.summaryCategorical===undefined) return;
      
      var labelWidth = this.getWidth_Label();
      var barChartMinX = labelWidth + this.panel.width_catMeasureLabel;

      this.DOM.chartCatLabelResize.style("left",(labelWidth+1)+"px");
      this.DOM.summaryCategorical.selectAll(".hasLabelWidth").style("width",labelWidth+"px");
      this.DOM.measureLabel
        .style("left",labelWidth+"px")
        .style("width",this.panel.width_catMeasureLabel+"px");
      this.DOM.chartAxis_Measure.each(function(){
        kshf.Util.setTransform(this,"translateX("+barChartMinX+"px)");
      });
      this.DOM.catSortButton
        .style("left",labelWidth+"px")
        .style("width",this.panel.width_catMeasureLabel+"px");
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

      this.updateCatIsInView();
      this.cullAttribs();

      this.DOM.headerGroup.select(".buttonSummaryExpand").style("display",
        (this.panel.getNumOfOpenSummaries()<=1||this.areAllCatsInDisplay())?
            "none":
            "inline-block"
      );

      this.updateBarPreviewScale2Active();

      var h=this.categoriesHeight;
      this.DOM.wrapper.style("height",(this.collapsed?"0":this.getHeight_Content())+"px");
      this.DOM.aggrGroup.style("height",h+"px");
      this.DOM.root.style("max-height",(this.getHeight()+1)+"px");

      this.DOM.chartAxis_Measure.selectAll(".longRefLine").style("top",(-h+1)+"px").style("height",(h-2)+"px");
      this.DOM.chartAxis_Measure.selectAll(".text_upper").style("top",(-h-21)+"px");
      this.DOM.chartAxis_Measure.selectAll(".chartAxis_Measure_background_2").style("top",(-h-12)+"px");

      if(this.viewType==='map'){
        this.DOM.catMap_Base.style("height",h+"px");
        if(this.DOM.catMap_SVG) this.DOM.catMap_SVG.style("height",h+"px");
        if(this.leafletMap) this.leafletMap.invalidateSize();
      }
    },
    /** -- */
    isCatActive: function(category){
      if(category.f_selected()) return true;
      if(category.aggregate_Active!==0) return true;
      // summary is not filtered yet, don't show categories with no items
      if(!this.isFiltered()) return category.aggregate_Active!==0;
      if(this.viewType==='map') return category.aggregate_Active!==0;
      // Hide if multiple options are selected and selection is and
//        if(this.summaryFilter.selecttype==="SelectAnd") return false;
      // TODO: Figuring out non-selected, zero-active-item attribs under "SelectOr" is tricky!
      return true;
    },
    /** -- */
    isCatSelectable: function(category){
      if(category.f_selected()) return true;
      if(category.aggregate_Active!==0) return true;
      // Show if multiple attributes are selected and the summary does not include multi value items
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
                if(ctgry.aggregate_Active===this.browser.recordsWanted_Aggr_Total){
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
        if(this.summaryFilter.unmapped===true){
            this.summaryFilter.how = "All";
        }

        if(this.summaryFilter.selectedCount_Total()===0){
            this.summaryFilter.clearFilter();
            return;
        }
        this.clearCatTextSearch();
        this.summaryFilter.unmapped = false;
        this.summaryFilter.addFilter(true);
    },


    /** -- */
    onCatClick: function(ctgry){
      if(!this.isCatSelectable(ctgry)) return;

      if(this.dblClickTimer){ // double click
        if(!this.isMultiValued) return;
        this.unselectAllCategories();
        this.filterCategory("AND","All");
        return;
      } else {
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
      }
      if(this.isMultiValued){
        var x = this;
        this.dblClickTimer = setTimeout(function() { x.dblClickTimer = null; }, 500);
      }
    },
    /** -- */
    onCatEnter: function(aggr){
      if(!this.isCatSelectable(aggr)) return;

      if(aggr.DOM.matrixRow) aggr.DOM.matrixRow.setAttribute("highlight","selected");

      aggr.DOM.aggrGlyph.setAttribute("selecttype","and");
      aggr.DOM.aggrGlyph.setAttribute("highlight","selected");

      // Comes after setting select type of the category - visual feedback on selection...
      if(!this.isMultiValued && this.summaryFilter.selected_AND.length!==0) return;

      // Show the highlight (preview)
      if(this.browser.pauseResultPreview) return;
      if(aggr.is_NOT()) return;
      if(this.isMultiValued || this.summaryFilter.selected_AND.length===0){
        aggr.items.forEach(function(item){item.updatePreview();});
        this.browser.itemCount_Previewed = aggr.aggregate_Preview;
        aggr.DOM.aggrGlyph.setAttribute("showlock",true);
        this.browser.setSelect_Highlight(this,aggr);
        // 
        if(this.viewType==="map"){
          var v = aggr.aggregate_Preview;
          if(this.browser.ratioMode) {
            v = 100*v/aggr.aggregate_Active;
          }
          this.DOM.highlightedAggrValue
            .style("left",(100*(this.mapColorScale(v)/9))+"%")
            .style("opacity",1);
        } else {
          this.DOM.highlightedAggrValue
            .style("left",this.chartScale_Measure(aggr.aggregate_Active)+"px")
            .style("opacity",1);
        }
      }
    },
    /** -- */
    onCatLeave: function(ctgry){
      if(ctgry.DOM.matrixRow) ctgry.DOM.matrixRow.setAttribute("highlight",false);

      if(!this.isCatSelectable(ctgry)) return;
      ctgry.nohighlightAggregate();

      if(!this.browser.pauseResultPreview){
        ctgry.DOM.aggrGlyph.setAttribute("showlock",false);
        this.browser.clearSelect_Highlight();
        if(this.viewType==='map') this.DOM.highlightedAggrValue.style("opacity",0);
      }
    },
    /** -- */
    onCatEnter_OR: function(ctgry){
      this.browser.clearSelect_Highlight();
      ctgry.DOM.aggrGlyph.setAttribute("selecttype","or");
      if(this.summaryFilter.selected_OR.length>0){
        this.browser.clearSelect_Highlight();
        if(this.viewType==='map') this.DOM.highlightedAggrValue.style("opacity",0);
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
      this.browser.preview_not = true;
      this.browser.setSelect_Highlight(this,ctgry);
      d3.event.stopPropagation();
    },
    /** -- */
    onCatLeave_NOT: function(ctgry){
      ctgry.DOM.aggrGlyph.setAttribute("selecttype","and");
      this.browser.preview_not = false;
      this.browser.clearSelect_Highlight();
      if(this.viewType==='map') this.DOM.highlightedAggrValue.style("opacity",0);
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

      var DOM_cats_new = this.DOM.aggrGroup.selectAll(".aggrGlyph")
        .data(this._cats, function(category){ return category.id(); })
      .enter()
        .append(this.viewType=='list' ? 'span' : 'g')
        .attr("class","aggrGlyph "+(this.viewType=='list'?'cat':'map')+"Glyph")
        .attr("highlight",false)
        .attr("showlock" ,false)
        .attr("selected",0)
        .each(function(_cat){
          if(me.viewType==='map'){
            this.tipsy = new Tipsy(this, {
              gravity: 'e',
              title: function(){ 
                return "<span class='mapItemName'>"+me.catLabel_Func.call(_cat.data)+"</span>"+
                  me.browser.getMeasureLabel(_cat)+" "+me.browser.itemName;
              }
            });
          } else {
            kshf.Util.setTransform(this,"translateY(0px)");
          }
        })
        .on("mouseover",function(_cat){
          if(this.tipsy) {
            this.tipsy.show();
            this.tipsy.jq_tip[0].style.left = (d3.event.pageX-this.tipsy.tipWidth-10)+"px";
            this.tipsy.jq_tip[0].style.top = (d3.event.pageY-this.tipsy.tipHeight/2)+"px";
          }
          // mouse is moving slow, just do it.
          if(me.browser.mouseSpeed<0.2) {
            me.onCatEnter(_cat);
            return;
          }
          // mouse is moving fast, should wait a while...
          this.highlightTimeout = window.setTimeout(
            function(){ me.onCatEnter(_cat) }, 
            me.browser.mouseSpeed*500);
        })
        .on("mouseleave",function(_cat){ 
          if(this.tipsy) this.tipsy.hide();
          if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
          me.onCatLeave(_cat);
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
        .attr("title",me.catTooltip?function(_cat){ return me.catTooltip.call(_cat.data); }:null);

      this.updateCatIsInView();

      if(this.viewType==='list'){
        var domAttrLabel = DOM_cats_new.append("span").attr("class", "categoryLabel hasLabelWidth");

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

        this.DOM.theLabel = domAttrLabel.append("span").attr("class","theLabel").html(function(_cat){
          return me.catLabel_Func.call(_cat.data);
        });
        DOM_cats_new.append("span").attr("class", "measureLabel");

        DOM_cats_new.append("span").attr("class", "aggr total");
        DOM_cats_new.append("span").attr("class", "aggr total_tip");
        DOM_cats_new.append("span").attr("class", "aggr active");
        DOM_cats_new.append("span").attr("class", "aggr preview").attr("fast",true);
        DOM_cats_new.append("span").attr("class", "aggr compare").attr("hidden",true);

        DOM_cats_new.append("span").attr("class", "clickArea")
          .on("click", function(d){ me.onCatClick(d); });

        DOM_cats_new.append("span").attr("class","lockButton fa")
          .each(function(category){
            this.tipsy = new Tipsy(this, {
              gravity: 'w',
              title: function(){
                return (me.browser.comparedAggregate!==category)? kshf.lang.cur.LockToCompare:kshf.lang.cur.Unlock;
              }
            });
          })
          .on("mouseenter",function(){ this.tipsy.show(); })
          .on("mouseleave",function(){ this.tipsy.hide(); })
          .on("click",function(_cat){
            this.tipsy.hide();
            me.browser.setSelect_Compare(me,_cat);
            d3.event.stopPropagation();
          });

      } else {
        DOM_cats_new.append("path").attr("class", "aggr total");
        DOM_cats_new.append("path").attr("class", "aggr total_tip");
        DOM_cats_new.append("path").attr("class", "aggr active")
          .on("click", function(d){ me.onCatClick(d); });
        DOM_cats_new.append("path").attr("class", "aggr preview").attr("fast",true);
        DOM_cats_new.append("path").attr("class", "aggr compare").attr("hidden",true);
        DOM_cats_new.append("text").attr("class", "measureLabel") // label on top of (after) all the rest
          .text("Hi!");

      }
      this.refreshDOMcats();
    },
    /** -- */
    refreshDOMcats: function(){
      this.DOM.aggrGlyphs = this.DOM.aggrGroup.selectAll(".aggrGlyph");

      this.DOM.aggrGlyphs.each(function(_cat){
        _cat.DOM.aggrGlyph = this;
      });

      if(this.viewType==='list'){
        this.DOM.attribClickArea = this.DOM.aggrGlyphs.selectAll(".clickArea");
        this.DOM.lockButton      = this.DOM.aggrGlyphs.selectAll(".lockButton");
      }

      this.DOM.measureLabel  = this.DOM.aggrGlyphs.selectAll(".measureLabel");
      this.DOM.aggr_Total    = this.DOM.aggrGlyphs.selectAll(".aggr.total");
      this.DOM.aggr_TotalTip = this.DOM.aggrGlyphs.selectAll(".aggr.total_tip");
      this.DOM.aggr_Active   = this.DOM.aggrGlyphs.selectAll(".aggr.active");
      this.DOM.aggr_Preview  = this.DOM.aggrGlyphs.selectAll(".aggr.preview");
      this.DOM.aggr_Compare  = this.DOM.aggrGlyphs.selectAll(".aggr.compare");
    },
    /** -- */
    updateCatIsInView: function(){
      var me=this;
      if(this.viewType==='map'){
        this._cats.forEach(function(_cat){
          _cat.isVisible = true;
        });
        return;
      }
      this._cats.forEach(function(_cat){
        _cat.isVisibleBefore = _cat.isVisible;
        if(!_cat.isActive){
          _cat.isVisible = false;
        } else if(_cat.orderIndex<me.firstCatIndexInView) {
          _cat.isVisible = false;
        } else if(_cat.orderIndex>me.firstCatIndexInView+me.catCount_InDisplay) {
          _cat.isVisible = false;
        } else {
          _cat.isVisible = true;
        }
      });
    },
    /** -- */
    cullAttribs: function(){
      if(this.viewType==='map') return; // no culling on maps, for now.  
      this.DOM.aggrGlyphs
        .style("visibility",function(_cat){ return _cat.isVisible?"visible":"hidden"; })
        .style("display",function(_cat){ return _cat.isVisible?"block":"none"; });
      if(this.onCategoryCull) this.onCategoryCull.call(this);
    },
    /** -- */
    updateCatSorting: function(sortDelay,force,noAnim){
      if(this.viewType==='map') return;
      if(this._cats===undefined) return;
      if(this._cats.length===0) return;
      if(this.uniqueCategories()) return; // Nothing to sort...
      if(this.catSortBy_Active.no_resort===true && force!==true) return;
      if(sortDelay===undefined) sortDelay = 1000;

      var me = this;

      this.updateCatCount_Active();
      this.sortCategories();

      if(this.panel===undefined) return; 
      // The rest deals with updating UI
      if(this.DOM.aggrGlyphs===undefined) return;

      this.updateCatIsInView();

      var xRemoveOffset = (this.panel.name==='right')?-1:-100; // disappear direction, depends on the panel location
      if(this.cbFacetSort) this.cbFacetSort.call(this);

      // Items outside the view are not visible, chartBackground expand the box and makes the scroll bar visible if necessary.
      this.DOM.chartBackground.style("height",this.getHeight_VisibleAttrib()+"px");

      var attribGroupScroll = me.DOM.aggrGroup[0][0];
      // always scrolls to top row automatically when re-sorted
      if(this.scrollTop_cache!==0) kshf.Util.scrollToPos_do(attribGroupScroll,0);
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
        return;
      }

      setTimeout(function(){
          // 1. Make items disappear
          // Note: do not cull with number of items made visible.
          // We are applying visible and block to ALL attributes as we animate the change
          me.DOM.aggrGlyphs.each(function(ctgry){
              if(ctgry.isActiveBefore && !ctgry.isActive){
                  // disappear into left panel...
                  this.style.opacity = 0;
                  ctgry.posX = xRemoveOffset;
                  ctgry.posY = ctgry.posY;
                  kshf.Util.setTransform(this,"translate("+ctgry.posX+"px,"+ctgry.posY+"px)");
              }
              if(!ctgry.isActiveBefore && ctgry.isActive){
                  // will be made visible...
                  ctgry.posY = me.heightRow_category*ctgry.orderIndex;
                  kshf.Util.setTransform(this,"translate("+xRemoveOffset+"px,"+ctgry.posY+"px)");
              }
              if(ctgry.isActive || ctgry.isActiveBefore){
                  this.style.opacity = 0;
                  this.style.visibility = "visible";
                  this.style.display = "block";
              }
          });

          // 2. Re-sort
          setTimeout(function(){
              me.DOM.aggrGlyphs.each(function(ctgry){
                  if(ctgry.isActive && ctgry.isActiveBefore){
                      this.style.opacity = 1;
                      ctgry.posX = 0;
                      ctgry.posY = me.heightRow_category*ctgry.orderIndex;
                      kshf.Util.setTransform(this,"translate("+ctgry.posX+"px,"+ctgry.posY+"px)");
                  }
              });

              // 3. Make items appear
              setTimeout(function(){
                  me.DOM.aggrGlyphs.each(function(ctgry){
                      if(!ctgry.isActiveBefore && ctgry.isActive){
                          this.style.opacity = 1;
                          ctgry.posX = 0;
                          ctgry.posY = me.heightRow_category*ctgry.orderIndex;
                          kshf.Util.setTransform(this,
                              "translate("+ctgry.posX+"px,"+ctgry.posY+"px)");
                      }
                  });
                  // 4. Apply culling
                  setTimeout(function(){ me.cullAttribs();} , 700);
              },(me.catCount_NowVisible>0)?300:0);

          },(me.catCount_NowInvisible>0)?300:0);

      },sortDelay);
    },
    /** -- */
    chartAxis_Measure_TickSkip: function(){
      var width = this.chartScale_Measure.range()[1];
      var ticksSkip = width/25;
      if(this.getMaxAggr_Active()>100000){
        ticksSkip = width/30;
      }
      if(this.browser.percentModeActive){
        ticksSkip /= 1.1;
      }
      return ticksSkip;
    },

    /** --  */
    map_projectCategories: function(){
      var me = this;
      this.DOM.aggr_Active.attr("d", function(_cat){
        _cat._d_ = me.catMap.call(_cat.data,_cat);
        if(_cat._d_===undefined) return;
        return me.geoPath(_cat._d_);
      });
      this.DOM.aggr_Preview.attr("d", function(_cat){
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
        if(feature===undefined) return;
        var b = d3.geo.bounds(feature);
        // Change wrapping
        if(b[0][0]>170) b[0][0]-=360;
        if(b[1][0]>170) b[1][0]-=360;
        bs.push(L.latLng(b[0][1], b[0][0]));
        bs.push(L.latLng(b[1][1], b[1][0]));
      });

      this.mapBounds_Active = new L.latLngBounds(bs);
    },
    /** --  */
    map_zoomToActive: function(){
      if(this.asdsds===undefined){ // First time: just fit bounds
        this.asdsds = true;
        this.leafletMap.fitBounds(this.mapBounds_Active);
        return;
      }

      this.leafletMap.flyToBounds(
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

        this.refreshDOMcats();
        this.updateCatSorting(0,true,true);
        return;
      }
      // 'map'
      // The map view is already initialized
      if(this.leafletMap) {
        this.DOM.aggrGroup = this.DOM.summaryCategorical.select(".catMap_SVG > .aggrGroup");
        this.refreshDOMcats();

        this.map_refreshBounds_Active();
        this.map_zoomToActive();
        this.map_projectCategories();
        this.refreshViz_Active();
        return; 
      }

      this.leafletMap = L.map(this.DOM.catMap_Base[0][0], 
        {
          maxBoundsViscosity: 1,
          //continuousWorld: true,
          //crs: L.CRS.EPSG3857
        })
        // Using openstreetmap tiles
        .addLayer(new L.TileLayer(
          "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>'
          }
          ))
        .on("viewreset",function(){ 
          me.map_projectCategories()
        })
        .on("movestart",function(){
          me.DOM.aggrGlyphs.style("display","none");
        })
        .on("move",function(){
          // console.log("MapZoom: "+me.leafletMap.getZoom());
          // me.map_projectCategories()
        })
        .on("moveend",function(){
          me.DOM.aggrGlyphs.style("display","block");
          me.map_projectCategories()
        })
        ;

      //var width = 500, height = 500;
      //var projection = d3.geo.albersUsa().scale(900).translate([width / 2, height / 2]);
      this.geoPath = d3.geo.path().projection( 
        d3.geo.transform({
          // Use Leaflet to implement a D3 geometric transformation.
          point: function(x, y) {
            if(x>160) x-=360;
            var point = me.leafletMap.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
          }
        }) 
      );

      this.mapColorQuantize = d3.scale.quantize()
        .domain([0,9])
        .range(kshf.colorScale.converge);

      this.DOM.catMap_SVG = d3.select(this.leafletMap.getPanes().overlayPane)
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
      var DOM_control = d3.select(this.leafletMap.getContainer()).select(".leaflet-control");

      DOM_control.append("a")
        .attr("class","leaflet-control-viewFit").attr("title","Fit View")
        .attr("href","#")
        .html("<span class='viewFit fa fa-dot-circle-o'></span>")
        .on("dblclick",function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
          return true;
        })
        .on("click",function(){
          me.map_refreshBounds_Active();
          me.map_zoomToActive();
          d3.event.preventDefault();
          d3.event.stopPropagation();
          return true;
        });

      this.DOM.aggrGroup = this.DOM.catMap_SVG.append("g")
          .attr("class", "leaflet-zoom-hide aggrGroup");

      // Now this will insert map svg component
      this.insertCategories();
  
      this.DOM.catMapColorScale = this.DOM.belowCatChart.append("div").attr("class","catMapColorScale");

      this.DOM.catMapColorScale.append("span").attr("class","scaleBound boundMin");
      this.DOM.catMapColorScale.append("span").attr("class","scaleBound boundMax");

      this.DOM.catMapColorScale.append("span")
        .attr("class","relativeModeControl fa fa-arrows-h")
        .each(function(){
          this.tipsy = new Tipsy(this, {
            gravity: 'e', title: function(){
              return (me.browser.ratioModeActive?kshf.lang.cur.Absolute:kshf.lang.cur.Relative)+" "+
                  kshf.lang.cur.Width;
            },
          });
        })
        .on("click",function(){ 
          this.tipsy.hide();
          me.browser.setRatioMode(!me.browser.ratioModeActive);
        })
        .on("mouseover",function(){
          me.browser.DOM.root.selectAll(".relativeModeControl").attr("highlight",true);
          this.tipsy.show();
        })
        .on("mouseout",function(){
          me.browser.DOM.root.selectAll(".relativeModeControl").attr("highlight",false);
          this.tipsy.hide();
        });

      this.DOM.catMapColorScale.append("span").attr("class","measurePercentControl")
        .each(function(){
          this.tipsy = new Tipsy(this, {
            gravity: 'w', title: function(){
              return "<span class='fa fa-eye'></span> "+kshf.lang.cur[(me.browser.percentModeActive?'Absolute':'Percent')];
            },
          })
        })
        .on("click",function(){
          this.tipsy.hide();
          me.browser.setPercentMode(!me.browser.percentModeActive);
        })
        .on("mouseover",function(){
          me.browser.DOM.root.selectAll(".measurePercentControl").attr("highlight",true);
          this.tipsy.show();
        })
        .on("mouseout",function(){
          me.browser.DOM.root.selectAll(".measurePercentControl").attr("highlight",false);
          this.tipsy.hide();
        });

      this.DOM.highlightedAggrValue = this.DOM.catMapColorScale.append("span")
        .attr("class","highlightedAggrValue");

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
      if(this.leafletMap) this.leafletMap.invalidateSize();
      this.DOM.aggrGroup.style("height",h+"px");
      
      this.map_refreshColorScale();
      this.map_refreshBounds_Active();
      this.map_zoomToActive();
      this.map_projectCategories();
      this.refreshMeasureLabel();
      this.refreshViz_Active();
    },
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
      this.height_hist = 1; // Initial width (will be updated later...)
      this.height_hist_min = 15; // Minimum possible histogram height
      this.height_hist_max = 100; // Maximim possible histogram height
      this.height_slider = 12; // Slider height
      this.height_labels = 13; // Height for labels
      this.height_percentile = 16; // Height for percentile chart
      this.height_hist_topGap = 12; // Height for histogram gap on top.

      this.width_barGap = 2; // The width between neighboring histgoram bars
      this.width_histMargin = 17; // ..
      this.width_vertAxisLabel = 23; // ..

      this.optimumTickWidth = 45;

      this.hasFloat = false;
      this.hasTime  = false;

      this.unitName = undefined; // the text appended to the numeric value (TODO: should not apply to time)
      this.percentileChartVisible = false; // Percentile chart is a 1-line chart which shows %10-%20-%30-%40-%50 percentiles
      this.zoomed = false;
      this.usedForSorting = false;
      this.invertColorScale = false;

      this.histBins = [];
      this.intervalTicks = [];
      this.intervalRange = {};
      this.intervalTickFormat = function(v){
          if(!me.hasFloat) return d3.format("s")(v);
          return d3.format(".2f")(v);
      };

      if(this.items.length<=1000) this.initializeAggregates();
    },
    /** -- */
    initializeAggregates: function(){
        if(this.aggr_initialized) return;
        var me = this;
        var filterId = this.summaryFilter.id;
        this.itemV = function(item){ return item.mappedDataCache[filterId].v; };

        this.unmappedRecords = [];

        this.items.forEach(function(item){
            var v=this.summaryFunc.call(item.data,item);
            if(isNaN(v)) v=null;
            if(v===undefined) v=null;
            if(v!==null){
                if(v instanceof Date){
                    this.hasTime = true;
                } else {
                    if(typeof v!=='number'){
                        v = null;
                    } else{
                        this.hasFloat = this.hasFloat || v%1!==0;
                    }
                }
            } else {
                this.unmappedRecords.push(item);
            }
            item.mappedDataCache[filterId] = {
                v: v,
                h: this,
            };
        },this);

        // remove items that map to null / undefined
        this.filteredItems = this.items.filter(function(item){
            var v = me.itemV(item);
            return (v!==undefined && v!==null);
        });

        // Sort the items by their attribute value
        var sortValue = this.hasTime?
            function(a){ return me.itemV(a).getTime(); }:
            function(a){ return me.itemV(a); };
        this.filteredItems.sort(function(a,b){ return sortValue(a)-sortValue(b);});

        this.updateIntervalRangeMinMax();

        this.detectScaleType();

        this.aggr_initialized = true;
        this.refreshViz_Nugget();
    },
    /** -- */
    isEmpty: function(){
      return this._isEmpty;
    },
    /** -- */
    detectScaleType: function(){
      if(this.isEmpty()) return;
      var me = this;

      // TIME SCALE
      if(this.hasTime) {
        this.setScaleType('time',true);
        return;
      }

      var filterId = this.summaryFilter.id;

      // decide scale type based on the filtered records
      var activeItemV = function(item){
        var v = item.mappedDataCache[filterId].v;
        if(v>=me.intervalRange.active.min && v <= me.intervalRange.active.max) return v; // value is within filtered range
      };
      var deviation   = d3.deviation(this.filteredItems, activeItemV);
      var activeRange = this.intervalRange.active.max-this.intervalRange.active.min;

      var _width_ = this.getWidth_Chart();
      var stepRange = (this.intervalRange.active.max-this.intervalRange.active.min)+1;

      // Apply step range before you check for log - it has higher precedence
      if(!this.hasFloat){
        if( (_width_ / this.getWidth_Tick()) >= stepRange){
          this.setScaleType('step',false);
          return;
        }  
      }

      // LOG SCALE
      if(deviation/activeRange<0.12 && this.intervalRange.active.min>=0){
        this.setScaleType('log',false);
        return;
      }

      // The scale can be linear or step after this stage

      // STEP SCALE if number are floating
      if(this.hasFloat){
        this.setScaleType('linear',false);
        return;
      }
      if( (_width_ / this.getWidth_Tick()) >= stepRange){
        this.setScaleType('step',false);
      } else {
        this.setScaleType('linear',false);
      }
    },
    /** -- */
    createSummaryFilter: function(){
        var me=this;
        this.summaryFilter = this.browser.createFilter({
            parentSummary: this,
            onClear: function(summary){
                if(this.filteredBin){
                    this.filteredBin.setAttribute("filtered",false);
                    this.filteredBin = undefined;
                }
                summary.DOM.root.attr("filtered",false);
                if(summary.zoomed){
                    summary.setZoomed(false);
                }
                summary.resetIntervalFilterActive();
                summary.refreshIntervalSlider();
                if(me.DOM.inited) me.DOM.unmapped_records.attr("filtered",false);
            },
            onFilter: function(summary){
                summary.DOM.root.attr("filtered",true);
                var filterId = this.id;

                if(this.unmapped===true){
                    summary.items.forEach(function(item){
                        item.setFilterCache(filterId, item.mappedDataCache[filterId].v===null);
                    },this);
                    return;
                }

                var i_min = this.active.min;
                var i_max = this.active.max;

                var isFilteredCb;
                if(summary.isFiltered_min() && summary.isFiltered_max()){
                    if(this.max_inclusive)
                        isFilteredCb = function(v){ return v>=i_min && v<=i_max; };
                    else
                        isFilteredCb = function(v){ return v>=i_min && v<i_max; };
                } else if(summary.isFiltered_min()){
                    isFilteredCb = function(v){ return v>=i_min; };
                } else {
                    if(this.max_inclusive)
                        isFilteredCb = function(v){ return v<=i_max; };
                    else
                        isFilteredCb = function(v){ return v<i_max; };
                }
                if(summary.scaleType==='step'){
                    if(i_min===i_max){
                        isFilteredCb = function(v){ return v===i_max; };
                    }
                }

                // TODO: Optimize: Check if the interval scale is extending/shrinking or completely updated...
                summary.items.forEach(function(item){
                    var v = item.mappedDataCache[this.id].v;
                    item.setFilterCache(this.id, (v!==null)?isFilteredCb(v):false);
                },this);

                if(summary.scaleType==="step"){
                    if(summary.zoomed) summary.DOM.zoomControl.attr("sign", "minus");
                } else {
                    summary.DOM.zoomControl.attr("sign", "plus");
                }

                summary.refreshIntervalSlider();
            },
            filterView_Detail: function(summary){
                if(this.unmapped===true){
                    return "(not defined)";
                }

                var minValue = this.active.min;
                var maxValue = this.active.max;
                var unitNameStr = "";
                if(me.unitName) unitNameStr = "<span class='unitName'>"+me.unitName+"</span>";
                if(summary.scaleType==='step'){
                    if(minValue===maxValue) return "<b>"+minValue+unitNameStr+"</b>";
                }
                if(summary.scaleType==='time'){
                    return "<b>"+summary.intervalTickFormat(this.active.min)+
                        "</b> to <b>"+summary.intervalTickFormat(this.active.max)+"</b>";
                }
                if(summary.hasFloat){
                    minValue = minValue.toFixed(2);
                    maxValue = maxValue.toFixed(2);
                }
                if(summary.isFiltered_min() && summary.isFiltered_max()){
                    return ""+minValue+unitNameStr+" to "+maxValue+unitNameStr+"";
                } else if(summary.isFiltered_min()){
                    return "<b>at least "+minValue+unitNameStr+"</b>";
                } else {
                    return "<b>at most "+maxValue+unitNameStr+"</b>";
                }
            },
        });
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

      if(this.intervalRange.min===this.intervalRange.max){
        this.DOM.nugget.select(".nuggetInfo").html("only<br>"+this.intervalRange.min);
        nuggetChart.style("display",'none');
        return;
      }

      var totalHeight = 17;
      nuggetChart.selectAll(".nuggetBar").data(this.histBins).enter()
        .append("span").attr("class","nuggetBar")
        .style("height",function(aggr){
            return totalHeight*(aggr.length/maxAggregate_Total)+"px";
        });

      this.DOM.nugget.select(".nuggetInfo").html(
        "<span class='num_left'>"+this.intervalTickFormat(this.intervalRange.min)+"</span>"+
        "<span class='num_right'>"+this.intervalTickFormat(this.intervalRange.max)+"</span>");
    },
    /** -- */
    updateIntervalRangeMinMax: function(){
      this.intervalRange.min = d3.min(this.filteredItems,this.itemV);
      this.intervalRange.max = d3.max(this.filteredItems,this.itemV);
      this.intervalRange.active = {
        min: this.intervalRange.min,
        max: this.intervalRange.max
      };
      this.resetIntervalFilterActive();

      this._isEmpty = this.intervalRange.min===undefined;
      if(this._isEmpty) this.setCollapsed(true);
    },
    /** -- */
    resetIntervalFilterActive: function(){
      this.summaryFilter.active = {
        min: this.intervalRange.min,
        max: this.intervalRange.max
      };
    },
    /** -- */
    setScaleType: function(t,force){
      if(this.scaleType===t) return;

      this.viewType = t==='time'?'line':'bar';
      if(this.DOM.inited) {
        this.DOM.root.attr("viewType",this.viewType);
      }

      if(force===false && this.scaleType_forced) return;

      this.scaleType = t;
      if(force) this.scaleType_forced = this.scaleType;
      
      if(this.DOM.summaryConfig){
        this.DOM.summaryConfig.selectAll(".summaryConfig_ScaleType .configOption").attr("active",false);
        this.DOM.summaryConfig.selectAll(".summaryConfig_ScaleType .pos_"+this.scaleType).attr("active",true);
      }

      if(this.DOM.summaryInterval) this.DOM.summaryInterval.attr("scaleType",this.scaleType);

      if(this.filteredItems === undefined) return;

      // remove items with value:0 (because log(0) is invalid)
      if(this.scaleType==='log' && (this.intervalRange.min<=0)) {
        var x=this.filteredItems.length;
        this.filteredItems = this.filteredItems.filter(function(item){ 
          var v=this.itemV(item)!==0;
          if(v===false) this.unmappedRecords.push(item); // Add to unmapped records
          return v;
        },this);
        if(x!==this.filteredItems.length){ // Some items are filtered bc they are 0.
          this.updateIntervalRangeMinMax();
        }
      }
      this.updateScaleAndBins(true);
    },
    /** -- */
    getHeight_MapColor: function(){
      if(this.usedForSorting===false) return 0;
      if(this.browser.recordDisplay.displayType!=="map") return 0; 
      return 20;
    },
    /** -- */
    getHeight_Content: function(){
      return this.height_hist+this.getHeight_Extra()+this.getHeight_MapColor();
    },
    /** -- */
    getHeight_Extra: function(){
      return 7+this.height_hist_topGap+this.height_labels+this.height_slider+
          (this.percentileChartVisible?this.height_percentile:0);
    },
    /** -- */
    getHeight_RangeMax: function(){
      return this.getHeight_Header()+this.height_hist_max+this.getHeight_Extra();
    },
    /** -- */
    getHeight_RangeMin: function(){
      return this.getHeight_Header()+this.height_hist_min+this.getHeight_Extra();
    },
    /** -- */
    getWidth_Chart: function(){
      if(this.panel===undefined) return 30;
      return this.getWidth()-this.width_histMargin-this.width_vertAxisLabel;
    },
    /** -- */
    getWidth_Tick: function(){
      if(this.panel===undefined) return 10;
      return this.optimumTickWidth;
    },
    /** -- */
    getWidth_Bar: function(){
      return this.aggrWidth - this.width_barGap*2;
    },
    /** -- */
    isFiltered_min: function(){
      // the active min is different from intervalRange min.
      if(this.summaryFilter.active.min!==this.intervalRange.min) return true;
      // if using log scale, assume min is also filtered when max is filtered.
      if(this.scaleType==='log') return this.isFiltered_max();
      return false;
    },
    /** -- */
    isFiltered_max: function(){
      return this.summaryFilter.active.max!==this.intervalRange.max;
    },
    /** -- */
    getMaxAggr_Total: function(){
      return d3.max(this.histBins,function(aggr){ return aggr.length; });
    },
    /** -- */
    getMaxAggr_Active: function(){
      return d3.max(this.histBins,function(aggr){ return aggr.aggregate_Active; });
    },
    /** -- */
    showPercentileChart: function(v){
      this.percentileChartVisible = v;
      if(this.DOM.inited){
        this.DOM.percentileChart.style("display",this.percentileChartVisible?"block":"none");

        this.DOM.summaryConfig.selectAll(".summaryConfig_Percentile .configOption").attr("active",false);
        this.DOM.summaryConfig.selectAll(".summaryConfig_Percentile .pos_"+this.percentileChartVisible).attr("active",true);

        if(this.percentileChartVisible){
          this.updatePercentiles();
        }
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
          .style("margin-left",(this.width_vertAxisLabel)+"px");

      this.DOM.unmapped_records = this.DOM.summaryInterval.append("span").attr("class","unmapped_records fa fa-ban")
          .style("display",this.unmappedRecords.length>0?"block":"none")
          .each(function(){
              this.tipsy = new Tipsy(this, {gravity: 'w', title: function(){ 
                  var x = me.unmappedRecords.length;
                  // TODO: Number should depend on filtering state, and also reflect percentage-mode
                  return "<b>"+x+"</b> "+me.browser.itemName+" without data"; 
              }});
          })
          .on("mouseover",function(){
              this.tipsy.show();

              me.unmappedRecords.forEach(function(record){record.updatePreview();});
              me.browser.itemCount_Previewed = me.unmappedRecords.length;
              me.browser.setSelect_Highlight(me,"(no data)");
          })
          .on("mouseout" ,function(){ 
              this.tipsy.hide();
              me.browser.clearSelect_Highlight();
          })
          .on("click", function(){
              if(me.summaryFilter.unmapped===true){
                  me.summaryFilter.unmapped = false;
                  this.setAttribute("filtered",false);
                  me.summaryFilter.clearFilter();
                  return;
              }
              // filter
              me.summaryFilter.how = "All";
              this.setAttribute("filtered",true);
              me.summaryFilter.clearFilter();
              me.summaryFilter.unmapped = true; // filter to unmapped items only
              me.summaryFilter.addFilter(true);
          })
          ;

      if(this.scaleType==='time'){
          this.DOM.timeSVG = this.DOM.histogram.append("svg").attr("class","timeSVG")
              .attr("xmlns","http://www.w3.org/2000/svg")
              .style("margin-left",(this.width_vertAxisLabel+this.width_barGap)+"px");
      }

      this.insertChartAxis_Measure(this.DOM.histogram, 'w', 'nw');
      this.DOM.chartAxis_Measure.style("margin-left",(this.width_vertAxisLabel-2)+"px")

      this.initDOM_Slider();

      this.initDOM_MapColor();

      this.initDOM_Percentile();

      this.updateScaleAndBins();

      this.setCollapsed(this.collapsed);
      this.setUnitName(this.unitName);

      this.DOM.inited=true;
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
        this.intervalRange.active.min = this.intervalRange.min;
        this.intervalRange.active.max = this.intervalRange.max;
        this.DOM.zoomControl.attr("sign","plus");
      }
      this.detectScaleType();
      this.updateScaleAndBins();
    },
    /** -- */
    setUnitName: function(v){
      this.unitName = v;
      if(this.unitName)
        this.DOM.unitNameInput[0][0].value = this.unitName;
      this.refreshTickLabels();
    },
    /** -- */
    printUnitName: function(){
      return this.unitName ? ("<span class='unitName'>"+this.unitName+"</span>") : "";
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

      var summaryConfig_ScaleType = this.DOM.summaryConfig.append("div")
        .attr("class","summaryConfig_ScaleType summaryConfig_Option");
      summaryConfig_ScaleType.append("span").text("Scale: ");
      x = summaryConfig_ScaleType.append("span").attr("class","optionGroup");
      x.selectAll(".configOption").data(["Linear","Log"]).enter()
        .append("span").attr("class",function(d){ return "configOption pos_"+d.toLowerCase();})
        .attr("active",function(d){ return d.toLowerCase()===me.scaleType; })
        .text(function(d){ return d; })
        .on("click", function(d){ me.setScaleType(d.toLowerCase(),true); })

      var summaryConfig_Percentile = this.DOM.summaryConfig.append("div")
        .attr("class","summaryConfig_Percentile summaryConfig_Option");
      summaryConfig_Percentile.append("span").text("Percentiles: ")
      x = summaryConfig_Percentile.append("span").attr("class","optionGroup");
      x.selectAll(".configOption").data([{l:"Show",v:true},{l:"Hide",v:false}]).enter()
        .append("span").attr("class",function(d){ return "configOption pos_"+d.v;})
        .attr("active",function(d){ return d.v===me.percentileChartVisible; })
        .text(function(d){ return d.l; })
        .on("click", function(d){ me.showPercentileChart(d.v); });
    },
    /** -- */
    initDOM_Percentile: function(){
      var me=this;
      if(this.DOM.summaryInterval===undefined) return;
      this.DOM.percentileChart = this.DOM.summaryInterval.append("div").attr("class","percentileChart")
        .style('margin-left',this.width_vertAxisLabel+"px")
        .style("display",this.percentileChartVisible?"block":"none");
      this.DOM.percentileChart.append("span").attr("class","percentileTitle").html(kshf.lang.cur.Percentiles);

      this.DOM.quantile = {};

      [[10,90],[20,80],[30,70],[40,60]].forEach(function(qb){
        this.DOM.quantile[""+qb[0]+"_"+qb[1]] = this.DOM.percentileChart.append("span")
          .attr("class","quantile q_range q_"+qb[0]+"_"+qb[1])
          .each(function(){
            this.tipsy = new Tipsy(this, {
              gravity: 's',
              title: function(){
                return "<span style='font-weight:300'>%"+qb[0]+" - %"+qb[1]+" Percentile: <span style='font-weight:500'>"+
                    me.quantile_val[qb[0]]+" - "+me.quantile_val[qb[1]]+"</span></span>";
              }
            })
          })
          .on("mouseover",function(){ this.tipsy.show(); })
          .on("mouseout" ,function(){ this.tipsy.hide(); });
      },this);

      [10,20,30,40,50,60,70,80,90].forEach(function(q){
        this.DOM.quantile[q] = this.DOM.percentileChart.append("span")
          .attr("class","quantile q_pos q_"+q)
          .each(function(){
            this.tipsy = new Tipsy(this, {
                gravity: 's',
                title: function(){ return "Median: "+ me.quantile_val[q]; }
            });
          })
          .on("mouseover",function(){ this.tipsy.show(); })
          .on("mouseout" ,function(){ this.tipsy.hide(); });
      },this);
    },
    /** --
        Uses
        - this.scaleType
        - this.intervalRange min & max
        Updates
        - this.intervalTickFormat
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
            var timeRange_ms = this.intervalRange.active.max-this.intervalRange.active.min; // in milliseconds
            var timeInterval;
            var timeIntervalStep = 1;
            if((timeRange_ms/1000) < optimalTickCount){
                timeInterval = d3.time.second.utc;
                this.intervalTickFormat = d3.time.format.utc("%S");
            } else if((timeRange_ms/(1000*5)) < optimalTickCount){
                timeInterval = d3.time.second.utc;
                timeIntervalStep = 5;
                this.intervalTickFormat = d3.time.format.utc("%-S");
            } else if((timeRange_ms/(1000*15)) < optimalTickCount){
                timeInterval = d3.time.second.utc;
                timeIntervalStep = 15;
                this.intervalTickFormat = d3.time.format.utc("%-S");
            } else if((timeRange_ms/(1000*60)) < optimalTickCount){
                timeInterval = d3.time.minute.utc;
                timeIntervalStep = 1;
                this.intervalTickFormat = d3.time.format.utc("%-M");
            } else if((timeRange_ms/(1000*60*5)) < optimalTickCount){
                timeInterval = d3.time.minute.utc;
                timeIntervalStep = 5;
                this.intervalTickFormat = d3.time.format.utc("%-M");
            } else if((timeRange_ms/(1000*60*15)) < optimalTickCount){
                timeInterval = d3.time.minute.utc;
                timeIntervalStep = 15;
                this.intervalTickFormat = d3.time.format.utc("%-M");
            } else if((timeRange_ms/(1000*60*60)) < optimalTickCount){
                timeInterval = d3.time.hour.utc;
                timeIntervalStep = 1;
                this.intervalTickFormat = d3.time.format.utc("%-H");
            } else if((timeRange_ms/(1000*60*60*6)) < optimalTickCount){
                timeInterval = d3.time.hour.utc;
                timeIntervalStep = 6;
                this.intervalTickFormat = d3.time.format.utc("%-H");
            } else if((timeRange_ms/(1000*60*60*24)) < optimalTickCount){
                timeInterval = d3.time.day.utc;
                timeIntervalStep = 1;
                this.intervalTickFormat = d3.time.format.utc("%-e");
                // TODO: kshf.Util.ordinal_suffix_of();
            } else if((timeRange_ms/(1000*60*60*24*7)) < optimalTickCount){
                timeInterval = d3.time.week.utc;
                timeIntervalStep = 1;
                this.intervalTickFormat = function(v){
                    var suffix = kshf.Util.ordinal_suffix_of(v.getUTCDate());
                    var first=d3.time.format.utc("%-b")(v);
                    return suffix+"<br>"+first;
                };
                this.height_labels = 28;
            } else if((timeRange_ms/(1000*60*60*24*30)) < optimalTickCount){
                timeInterval = d3.time.month.utc;
                timeIntervalStep = 1;
                this.intervalTickFormat = function(v){
                    var threeMonthsLater = timeInterval.offset(v, 3);
                    var first=d3.time.format.utc("%-b")(v);
                    var s=first;
                    if(first==="Jan") s+="<br>"+(d3.time.format("%Y")(threeMonthsLater));
                    return s;
                };
                this.height_labels = 28;
            } else if((timeRange_ms/(1000*60*60*24*30*3)) < optimalTickCount){
                timeInterval = d3.time.month.utc;
                timeIntervalStep = 3;
                this.intervalTickFormat = function(v){
                    var threeMonthsLater = timeInterval.offset(v, 3);
                    var first=d3.time.format.utc("%-b")(v);
                    var s=first;
                    if(first==="Jan") s+="<br>"+(d3.time.format("%Y")(threeMonthsLater));
                    return s;
                };
                this.height_labels = 28;
            } else if((timeRange_ms/(1000*60*60*24*30*6)) < optimalTickCount){
                timeInterval = d3.time.month.utc;
                timeIntervalStep = 6;
                this.intervalTickFormat = function(v){
                    var threeMonthsLater = timeInterval.offset(v, 6);
                    var first=d3.time.format.utc("%-b")(v);
                    var s=first;
                    if(first==="Jan") s+="<br>"+(d3.time.format("%Y")(threeMonthsLater));
                    return s;
                };
                this.height_labels = 28;
            } else if((timeRange_ms/(1000*60*60*24*365)) < optimalTickCount){
                timeInterval = d3.time.year.utc;
                timeIntervalStep = 1;
                this.intervalTickFormat = d3.time.format.utc("%Y");
            } else if((timeRange_ms/(1000*60*60*24*365*2)) < optimalTickCount){
                timeInterval = d3.time.year.utc;
                timeIntervalStep = 2;
                this.intervalTickFormat = d3.time.format.utc("%Y");
            } else if((timeRange_ms/(1000*60*60*24*365*3)) < optimalTickCount){
                timeInterval = d3.time.year.utc;
                timeIntervalStep = 3;
                this.intervalTickFormat = d3.time.format.utc("%Y");
            } else if((timeRange_ms/(1000*60*60*24*365*4)) < optimalTickCount){
                timeInterval = d3.time.year.utc;
                timeIntervalStep = 4;
                this.intervalTickFormat = d3.time.format.utc("%Y");
            } else if((timeRange_ms/(1000*60*60*24*365*5)) < optimalTickCount){
                timeInterval = d3.time.year.utc;
                timeIntervalStep = 5;
                this.intervalTickFormat = function(v){
                    var later = timeInterval.offset(v, 4);
                    return d3.time.format.utc("%Y")(v);
                };
                this.height_labels = 28;
            } else if((timeRange_ms/(1000*60*60*24*365*25)) < optimalTickCount){
                timeInterval = d3.time.year.utc;
                timeIntervalStep = 25;
                this.intervalTickFormat = d3.time.format.utc("%Y");
            } else if((timeRange_ms/(1000*60*60*24*365*100)) < optimalTickCount){
                timeInterval = d3.time.year.utc;
                timeIntervalStep = 100;
                this.intervalTickFormat = d3.time.format.utc("%Y");
            } else {
                timeInterval = d3.time.year.utc;
                timeIntervalStep = 500;
                this.intervalTickFormat = d3.time.format.utc("%Y");
            }

            this.valueScale.nice(timeInterval, timeIntervalStep);
            ticks = this.valueScale.ticks(timeInterval, timeIntervalStep);
        } else if(this.scaleType==='step'){
            ticks = [];
            for(var i=this.intervalRange.active.min ; i<=this.intervalRange.active.max; i++){
                ticks.push(i);
            }
            this.intervalTickFormat = d3.format("d");
        } else if(this.scaleType==='log'){
            this.valueScale.nice();
            // Generate ticks
            ticks = this.valueScale.ticks(); // ticks cannot be customized directly
            while(ticks.length > optimalTickCount*1.6){
                ticks = ticks.filter(function(d,i){return i%2===0;});
            }
            if(!this.hasFloat)
                ticks = ticks.filter(function(d){return d%1===0;});
            this.intervalTickFormat = d3.format(".1s");
        } else {
            this.valueScale.nice(optimalTickCount);
            this.valueScale.nice(optimalTickCount);
            ticks = this.valueScale.ticks(optimalTickCount);
            this.valueScale.nice(optimalTickCount);
            ticks = this.valueScale.ticks(optimalTickCount);

            if(!this.hasFloat) ticks = ticks.filter(function(d){return d===0||d%1===0;});

            var d3Formating = d3.format(this.hasFloat?".2f":".2s");
            this.intervalTickFormat = function(d){
                if(!me.hasFloat && d<10) return d;
                if(!me.hasFloat && Math.abs(ticks[1]-ticks[0])<1000) return d;
                var x= d3Formating(d);
                if(x.indexOf(".00")!==-1) x = x.replace(".00","");
                if(x.indexOf(".0")!==-1) x = x.replace(".0","");
                return x;
            }
        }

        // Make sure the non-extreme ticks are between intervalRange.active.min and intervalRange.active.max
        for(var tickNo=1; tickNo<ticks.length-1; ){
            var tick = ticks[tickNo];
            if(tick<this.intervalRange.active.min){
                ticks.splice(tickNo-1,1); // remove the tick
            } else if(tick > this.intervalRange.active.max){
                ticks.splice(tickNo+1,1); // remove the tick
            } else {
                tickNo++
            }
        }
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
      - intervalTickFormat
      */
    updateScaleAndBins: function(force){
        if(this.isEmpty()) return;

        var me=this;

        var _width_ = this.getWidth_Chart();
        var optimalTickCount = _width_ / this.getWidth_Tick();

        var stepRange=(this.intervalRange.active.max-this.intervalRange.active.min)+1;
        var stepWidth=_width_/stepRange;

        switch(this.scaleType){
            case 'linear': case 'step':
                this.valueScale = d3.scale.linear();      break;
            case 'log':
                this.valueScale = d3.scale.log().base(2); break;
            case 'time':
                this.valueScale = d3.time.scale.utc();    break;
        }

        this.valueScale
            .domain([this.intervalRange.active.min, this.intervalRange.active.max])
            .range( (this.scaleType==='step') ? 
                [stepWidth/2, _width_-stepWidth/2] :
                [0, _width_]
            );

        var ticks = this.getValueTicks(optimalTickCount);

        // Sometimes, the number of bins generated is larger than the optimal
        // In some cases, the ticks become suitable for step-scale. Detect it here.
        /*if(!this.hasFloat && this.scaleType==='linear'){
            if(ticks.length===stepRange){
                this.setScaleType('step');
                this.valueScale.range([stepWidth/2, _width_-stepWidth/2]);
            }
        }*/

        if(this.scaleType!=='step'){
            this.aggrWidth = this.valueScale(ticks[1])-this.valueScale(ticks[0]);
        } else {
            this.aggrWidth = _width_/stepRange;
        }

        var ticksChanged = (this.intervalTicks.length!==ticks.length) ||
            this.intervalTicks[0]!==ticks[0] ||
            this.intervalTicks[this.intervalTicks.length-1] !== ticks[ticks.length-1]
            ;

        if(ticksChanged || force){
            this.intervalTicks = ticks;
            var filterId = this.summaryFilter.id;

            var itemV = function(item){
                // if(item.isWanted)  // Include all items - Aggregate also shows the "total" viz
                    return item.mappedDataCache[filterId].v;
            };
            if(this.zoomed===false){
                itemV = this.itemV;
            }
            if(this.scaleType!=='step'){
                this.histBins = d3.layout.histogram().bins(this.intervalTicks).value(itemV)(this.filteredItems);
            } else {
                // I'll do the bins myself
                this.histBins = [];
                for(var bin=this.intervalRange.active.min; bin<=this.intervalRange.active.max; bin++){
                    var d = [];
                    d.x = bin;
                    d.y = 0;
                    d.dx = 0;
                    this.histBins.push(d);
                }
                this.filteredItems.forEach(function(item){
                    var v = itemV(item);
                    if(v===null || v===undefined) return;
                    if(v<this.intervalRange.active.min) return;
                    if(v>this.intervalRange.active.max) return;
                    var bin = this.histBins[v-this.intervalRange.active.min];
                    bin.push(item);
                    bin.y++;
                },this);
            }

            this.updateAggregate_Active();
            this.updateBarScale2Active();

            if(this.DOM.root){
                this.insertVizDOM();
            }

            if(this.percentileChartVisible) this.updatePercentiles();
        }
        if(this.DOM.root){
            if(this.DOM.aggrGlyphs===undefined){
                this.insertVizDOM();
            }
            this.refreshBins_Translate();
            this.refreshViz_Scale();

            this.DOM.labelGroup.selectAll(".tick").style("left",function(d){
                return (me.valueScale(d))+"px";
            });
            this.refreshIntervalSlider();
        }
    },
    /** -- */
    insertVizDOM: function(){
        if(this.scaleType==='time' && this.DOM.root) {
            // delete existing DOM:
            // TODO: Find  a way to avoid this?
            this.DOM.timeSVG.select(".lineTrend.total").remove();
            this.DOM.timeSVG.select(".lineTrend.active").remove();
            this.DOM.timeSVG.select(".lineTrend.preview").remove();
            this.DOM.timeSVG.select(".lineTrend.compare").remove();
            this.DOM.timeSVG.selectAll("line.activeLine").remove();
            this.DOM.timeSVG.selectAll("line.previewLine").remove();
            this.DOM.timeSVG.selectAll("line.compareLine").remove();

            this.DOM.lineTrend_Total = this.DOM.timeSVG.append("path").attr("class","lineTrend total")
                .datum(this.histBins);
            this.DOM.lineTrend_Active = this.DOM.timeSVG.append("path").attr("class","lineTrend active")
                .datum(this.histBins);
            this.DOM.lineTrend_ActiveLine = this.DOM.timeSVG.selectAll("line.activeLine")
                .data(this.histBins, function(d,i){ return i; })
                .enter().append("line").attr("class","lineTrend activeLine");
            this.DOM.lineTrend_Preview = this.DOM.timeSVG.append("path").attr("class","lineTrend preview")
                .datum(this.histBins);
            this.DOM.lineTrend_PreviewLine = this.DOM.timeSVG.selectAll("line.previewLine")
                .data(this.histBins, function(d,i){ return i; })
                .enter().append("line").attr("class","lineTrend previewLine");
            this.DOM.lineTrend_Compare = this.DOM.timeSVG.append("path").attr("class","lineTrend compare")
                .datum(this.histBins);
            this.DOM.lineTrend_CompareLine = this.DOM.timeSVG.selectAll("line.compareLine")
                .data(this.histBins, function(d,i){ return i; })
                .enter().append("line").attr("class","lineTrend compareLine");
        }

        this.insertBins();
        this.refreshViz_Axis();
        //this.refreshViz_Highlight();
        this.refreshMeasureLabel();
        this.updateTicks();
    },
    /** -- */
    updateTicks: function(){
        this.DOM.labelGroup.selectAll(".tick").data([]).exit().remove(); // remove all existing ticks
        var ddd = this.DOM.labelGroup.selectAll(".tick").data(this.intervalTicks);
        var ddd_enter = ddd.enter().append("span").attr("class","tick");
            ddd_enter.append("span").attr("class","line");
            ddd_enter.append("span").attr("class","text");
        this.refreshTickLabels();
    },
    /** -- */
    refreshTickLabels: function(){
      var me=this;
      if(this.DOM.labelGroup===undefined) return;
      this.DOM.labelGroup.selectAll(".tick .text").html(function(d){
        if(me.scaleType==='time'){
           return me.intervalTickFormat(d);
        }
        if(d<1 && d!==0) 
          return d.toFixed(1) + me.printUnitName();
        else 
          return me.intervalTickFormat(d) + me.printUnitName();
      });
    },
    /** -- */
    onBinMouseOver: function(aggr){
      if(this.browser.pauseResultPreview) return;
      aggr.forEach(function(record){record.updatePreview();});
      this.browser.itemCount_Previewed = aggr.aggregate_Preview;
      aggr.DOM.aggrGlyph.setAttribute("highlight","selected");
      aggr.DOM.aggrGlyph.setAttribute("showlock",true);
      this.DOM.highlightedAggrValue
        .style("top",(this.height_hist - this.chartScale_Measure(aggr.aggregate_Active))+"px")
        .style("opacity",1);
      this.browser.setSelect_Highlight(this,aggr);
    },
    /** -- */
    insertBins: function(){
        var me=this;

        var filterId = this.summaryFilter.id;

        // just remove everything that was in the histogram_bins befoe
        this.DOM.histogram_bins.selectAll(".aggrGlyph").data([]).exit().remove();

        var activeBins = this.DOM.histogram_bins.selectAll(".aggrGlyph").data(this.histBins, function(d,i){return i;});

        var newBins=activeBins.enter().append("span").attr("class","aggrGlyph rangeGlyph")
            .each(function(aggr){
              aggr.items = aggr;
              aggr.isVisible = true;
              aggr.aggregate_Preview=0;
              aggr.forEach(function(record){ record.mappedDataCache[filterId].b = aggr; },this);
              aggr.DOM = {}
              aggr.DOM.aggrGlyph = this;
            })
            .on("mouseenter",function(aggr){
              var thiss=this;
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
              if(this.highlightTimeout) window.clearTimeout(this.highlightTimeout);
              this.setAttribute("highlight",false);
              this.setAttribute("showlock",false);
              me.browser.clearSelect_Highlight();
            })
            .on("click",function(aggr){
                if(me.summaryFilter.filteredBin===this){
                    me.summaryFilter.clearFilter();
                    return;
                }
                this.setAttribute("filtered","true");

                // store histogram state
                if(me.scaleType==='step'){
                  me.summaryFilter.active = {
                      min: aggr.x,
                      max: aggr.x
                  };
                } else if(me.scaleType!=='time'){
                    me.summaryFilter.active = {
                        min: aggr.x,
                        max: aggr.x+aggr.dx
                    };
                } else {
                    me.summaryFilter.active = {
                        min: aggr.x,
                        max: new Date(aggr.x.getTime()+aggr.dx)
                    };
                }
                // if we are filtering the last aggr, make max_score inclusive
                me.summaryFilter.max_inclusive = (aggr.x+aggr.dx)===me.intervalRange.active.max;
                if(me.scaleType==='step'){
                    me.summaryFilter.max_inclusive = true;
                }

                me.summaryFilter.filteredBin=this;
                me.summaryFilter.addFilter(true);
            });

        newBins.append("span").attr("class","aggr total");
        newBins.append("span").attr("class","aggr total_tip");
        newBins.append("span").attr("class","aggr active");
        newBins.append("span").attr("class","aggr preview").attr("fast",true);
        newBins.append("span").attr("class","aggr compare").attr("hidden",true);

        newBins.append("span").attr("class","lockButton fa")
            .each(function(aggr){
                this.tipsy = new Tipsy(this, {
                    gravity: 's',
                    title: function(){
                        return (me.browser.comparedAggregate!==aggr)?
                            kshf.lang.cur.LockToCompare:kshf.lang.cur.Unlock;
                    }
                });
            })
            .on("click",function(aggr){
                this.tipsy.hide();
                me.browser.setSelect_Compare(me,aggr);
                d3.event.stopPropagation();
            })
            .on("mouseenter",function(aggr){
                this.tipsy.options.className = "tipsyFilterLock";
                this.tipsy.hide();
                this.tipsy.show();
                d3.event.stopPropagation();
            })
            .on("mouseleave",function(aggr){
                this.tipsy_title = undefined;
                this.tipsy.hide();
                d3.event.stopPropagation();
            })
            ;

        newBins.append("span").attr("class","measureLabel").each(function(bar){
            kshf.Util.setTransform(this,"translateY("+me.height_hist+"px)");
        });

        this.DOM.aggrGlyphs    = this.DOM.histogram_bins.selectAll(".aggrGlyph");
        this.DOM.aggr_Total    = this.DOM.aggrGlyphs.selectAll(".total");
        this.DOM.aggr_TotalTip = this.DOM.aggrGlyphs.selectAll(".total_tip");
        this.DOM.aggr_Active   = this.DOM.aggrGlyphs.selectAll(".active");
        this.DOM.aggr_Preview  = this.DOM.aggrGlyphs.selectAll(".preview");
        this.DOM.aggr_Compare  = this.DOM.aggrGlyphs.selectAll(".compare");

        this.DOM.lockButton = this.DOM.aggrGlyphs.selectAll(".lockButton");
        this.DOM.measureLabel  = this.DOM.aggrGlyphs.selectAll(".measureLabel");
    },
    /** --- */
    roundFilterRange: function(){
      if(this.scaleType==='time'){
        // TODO: Round to meaningful dates
        return;
      }
      // Make sure the range is within the visible limits:
      this.summaryFilter.active.min = Math.max(
        this.intervalTicks[0], this.summaryFilter.active.min);
      this.summaryFilter.active.max = Math.min(
        this.intervalTicks[this.intervalTicks.length-1], this.summaryFilter.active.max);

      if(this.scaleType==='log' || this.scaleType==='step' || (!this.hasFloat) ){
        this.summaryFilter.active.min=Math.round(this.summaryFilter.active.min);
        this.summaryFilter.active.max=Math.round(this.summaryFilter.active.max);
      }
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
    initDOM_MapColor: function(){
        var me=this;

        this.DOM.mapColorBar = this.DOM.summaryInterval.append("div").attr("class","mapColorBar")
            .style('margin-left',(this.width_vertAxisLabel)+"px");

        this.DOM.mapColorBar.append("span").attr("class","invertColorScale fa fa-adjust")
            .each(function(d){
                this.tipsy = new Tipsy(this, { gravity: 'sw', title: "Invert Color Scale" });
            })
            .on("mouseenter",function(){ this.tipsy.show(); })
            .on("mouseleave",function(){ this.tipsy.hide(); })
            .on("click", function(){
                me.invertColorScale = !me.invertColorScale;
                me.browser.recordDisplay.map_updateRecordColor();
                me.browser.recordDisplay.map_refreshColorScale();
                me.map_refreshColorScale();
            });

        this.DOM.mapColorBlocks = this.DOM.mapColorBar.selectAll("mapColorBlock")
          .data([0,1,2,3,4,5,6,7,8]).enter()
          .append("div").attr("class","mapColorBlock")
          .each(function(d){
            var r = me.valueScale.range()[1]/9;
            this._minValue = me.valueScale.invert(d*r);
            this._maxValue = me.valueScale.invert((d+1)*r);
            this.tipsy = new Tipsy(this, {
              gravity: 's', title: function(){
                return Math.round(this._minValue)+" to "+Math.round(this._maxValue);
              }
            });
          })
          .on("mouseenter",function(){ 
            // TODO: Preview items that fall under this range
            // TODO: Currently, the color blocks do not aggregate records. Hmmmm....
            this.tipsy.show();
          })
          .on("mouseleave",function(){ 
            this.tipsy.hide();
          })
          .on("click",function(){
            me.summaryFilter.active = {
                min: this._minValue,
                max: this._maxValue
            };
            me.summaryFilter.addFilter(true);
          });
        this.map_refreshColorScale();
    },
    /** -- */
    initDOM_Slider: function(){
        var me=this;

        this.DOM.intervalSlider = this.DOM.summaryInterval.append("div").attr("class","intervalSlider")
            .style('margin-left',(this.width_vertAxisLabel)+"px");

        this.DOM.zoomControl = this.DOM.intervalSlider.append("span").attr("class","zoomControl fa")
            .attr("sign","plus")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'w', title: function(){
                        return (this.getAttribute("sign")==="plus")?"Zoom into range":"Zoom out";
                    }
                });
            })
            .on("mouseenter",function(){ this.tipsy.show(); })
            .on("mouseleave",function(){ this.tipsy.hide(); })
            .on("click",function(){
                this.tipsy.hide();
                me.setZoomed(this.getAttribute("sign")==="plus");
            })
            ;

        var controlLine = this.DOM.intervalSlider.append("div").attr("class","controlLine")
            .on("mousedown", function(){
                if(d3.event.which !== 1) return; // only respond to left-click
                me.browser.setNoAnim(true);
                var e=this.parentNode;
                var initPos = me.valueScale.invert(d3.mouse(e)[0]);
                d3.select("body").style('cursor','ew-resize')
                    .on("mousemove", function() {
                        var targetPos = me.valueScale.invert(d3.mouse(e)[0]);
                        me.summaryFilter.active.min=d3.min([initPos,targetPos]);
                        me.summaryFilter.active.max=d3.max([initPos,targetPos]);
                        me.roundFilterRange();
                        me.refreshIntervalSlider();
                        // wait half second to update
                        if(this.timer) clearTimeout(this.timer);
                        me.summaryFilter.filteredBin=this;
                        this.timer = setTimeout(function(){
                            if(me.isFiltered_min() || me.isFiltered_max()){
                                me.summaryFilter.addFilter(true);
                            } else {
                                me.summaryFilter.clearFilter();
                            }
                        },250);
                    }).on("mouseup", function(){
                        me.browser.setNoAnim(false);
                        d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
                    });
                d3.event.preventDefault();
            });

        controlLine.append("span").attr("class","base total");
        controlLine.append("span").attr("class","base active")
            .each(function(){
                this.tipsy = new Tipsy(this, { gravity: "s", title: kshf.lang.cur.DragToFilter });
            })
            // TODO: The problem is, the x-position (left-right) of the tooltip is not correctly calculated
            // because the size of the bar is set by scaling, not through width....
            //.on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout" ,function(){ this.tipsy.hide(); })
            .on("mousedown", function(){
                this.tipsy.hide();
                if(d3.event.which !== 1) return; // only respond to left-click
                if(me.scaleType==='time') return; // time is not supported for now.
                me.browser.setNoAnim(true);
                var e=this.parentNode;
                var initMin = me.summaryFilter.active.min;
                var initMax = me.summaryFilter.active.max;
                var initRange= initMax - initMin;
                var initPos = d3.mouse(e)[0];

                d3.select("body").style('cursor','ew-resize')
                    .on("mousemove", function() {
                        if(me.scaleType==='log'){
                            var targetDif = d3.mouse(e)[0]-initPos;
                            me.summaryFilter.active.min =
                                me.valueScale.invert(me.valueScale(initMin)+targetDif);
                            me.summaryFilter.active.max =
                                me.valueScale.invert(me.valueScale(initMax)+targetDif);

                        } else if(me.scaleType==='time'){
                            // TODO
                            return;
                        } else {
                            var targetPos = me.valueScale.invert(d3.mouse(e)[0]);
                            var targetDif = targetPos-me.valueScale.invert(initPos);

                            me.summaryFilter.active.min = initMin+targetDif;
                            me.summaryFilter.active.max = initMax+targetDif;
                            if(me.summaryFilter.active.min<me.intervalRange.active.min){
                                me.summaryFilter.active.min=me.intervalRange.active.min;
                                me.summaryFilter.active.max=me.intervalRange.active.min+initRange;
                            }
                            if(me.summaryFilter.active.max>me.intervalRange.active.max){
                                me.summaryFilter.active.max=me.intervalRange.active.max;
                                me.summaryFilter.active.min=me.intervalRange.active.max-initRange;
                            }
                        }

                        me.roundFilterRange();
                        me.refreshIntervalSlider();

                        // wait half second to update
                        if(this.timer) clearTimeout(this.timer);
                        me.summaryFilter.filteredBin = this;
                        this.timer = setTimeout(function(){
                            if(me.isFiltered_min() || me.isFiltered_max()){
                                me.summaryFilter.addFilter(true);
                            } else{
                                me.summaryFilter.clearFilter();
                            }
                        },200);
                    }).on("mouseup", function(){
                        me.browser.setNoAnim(false);
                        d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
                    });
                d3.event.preventDefault();
                d3.event.stopPropagation();
            });

        controlLine.selectAll(".handle").data(['min','max']).enter()
            .append("span").attr("class",function(d){ return "handle "+d; })
            .each(function(d,i){
                this.tipsy = new Tipsy(this, { gravity: i==0?"w":"e", title: kshf.lang.cur.DragToFilter });
            })
            .on("mouseover",function(){ if(this.dragging!==true) this.tipsy.show(); })
            .on("mouseout" ,function(){ this.tipsy.hide(); })
            .on("mousedown", function(d,i){
                this.tipsy.hide();
                if(d3.event.which !== 1) return; // only respond to left-click

                var mee = this;
                me.browser.setNoAnim(true);
                var e=this.parentNode;
                d3.select("body").style('cursor','ew-resize')
                    .on("mousemove", function() {
                        mee.dragging = true;
                        me.browser.pauseResultPreview = true;
                        var targetPos = me.valueScale.invert(d3.mouse(e)[0]);
                        me.summaryFilter.active[d] = targetPos;
                        // Swap is min > max
                        if(me.summaryFilter.active.min>me.summaryFilter.active.max){
                            var t=me.summaryFilter.active.min;
                            me.summaryFilter.active.min = me.summaryFilter.active.max;
                            me.summaryFilter.active.max = t;
                            if(d==='min') d='max'; else d='min';
                        }
                        me.roundFilterRange();
                        me.refreshIntervalSlider();
                        // wait half second to update
                        if(this.timer) clearTimeout(this.timer);
                        me.summaryFilter.filteredBin=this;
                        this.timer = setTimeout( function(){
                            if(me.isFiltered_min() || me.isFiltered_max()){
                                me.summaryFilter.addFilter(true);
                            } else {
                                me.summaryFilter.clearFilter();
                            }
                        },200);
                    }).on("mouseup", function(){
                        mee.dragging = false;
                        me.browser.pauseResultPreview = false;
                        me.browser.setNoAnim(false);
                        d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
                    });
                d3.event.preventDefault();
                d3.event.stopPropagation();
            })
            .append("span").attr("class","rangeLimitOnChart");

        this.DOM.recordValue = controlLine.append("div").attr("class","recordValue");
        this.DOM.recordValue.append("span").attr("class","circlee");
        this.DOM.selectedItemValueText = this.DOM.recordValue
            .append("span").attr("class","selected-item-value-text")
            .append("span").attr("class","selected-item-value-text-v");

        this.DOM.labelGroup = this.DOM.intervalSlider.append("div").attr("class","labelGroup");
    },
    /** -- */
    updateBarScale2Active: function(){
      this.chartScale_Measure
        .domain([0, this.getMaxAggr_Active() || 1])
        .range ([0, this.height_hist]);
    },
    /** -- */
    updateAggregate_Active: function(){
      this.histBins.forEach(function(aggr){ 
        aggr.aggregate_Active = 0;
        aggr.forEach(function(record){ 
          if(record.isWanted) aggr.aggregate_Active+=record.aggregate_Self; 
        });
      });
    },
    /** -- */
    refreshBins_Translate: function(){
      var me=this;
      var offset = 0;
      if(this.scaleType==='step') offset = this.width_barGap-this.aggrWidth/2;
      if(this.scaleType==='time') offset = this.width_barGap;
      this.DOM.aggrGlyphs
        .style("width",this.getWidth_Bar()+"px")
        .each(function(aggr){
          kshf.Util.setTransform(this,"translateX("+(me.valueScale(aggr.x)+offset)+"px)");
        });
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
        var width=this.getWidth_Bar();

        var heightTotal = function(aggr){
            if(aggr.length===0) return 0;
            if(me.browser.ratioModeActive) return me.height_hist;
            return me.chartScale_Measure(aggr.length);
        };

        if(this.scaleType==='time'){
            var durationTime=this.browser.noAnim?0:700;
            this.timeSVGLine = d3.svg.area()
                .x(function(aggr){
                    return me.valueScale(aggr.x)+width/2;
                })
                .y0(me.height_hist)
                .y1(function(aggr){
                    if(aggr.aggregate_Total===0) return me.height_hist+3;
                    return me.height_hist-heightTotal(aggr);
                });
            this.DOM.lineTrend_Total
                .transition().duration(durationTime)
                .attr("d", this.timeSVGLine);
        } else {
            this.DOM.aggr_Total.each(function(aggr){
                kshf.Util.setTransform(this,
                    "translateY("+me.height_hist+"px) scale("+width+","+heightTotal(aggr)+")");
            });
            if(!this.browser.ratioModeActive){
                this.DOM.aggr_TotalTip
                    .style("opacity",function(aggr){
                        return (aggr.length>me.chartScale_Measure.domain()[1])?1:0;
                    })
                    .style("width",width+"px");
            } else {
                this.DOM.aggr_TotalTip.style("opacity",0);
            }
        }
    },
    /** -- */
    refreshViz_Active: function(){
        if(this.isEmpty() || this.collapsed) return;
        var me=this;
        var width = this.getWidth_Bar();

        var heightActive = function(aggr){
            if(aggr.aggregate_Active===0) return 0;
            if(me.browser.ratioModeActive) return me.height_hist;
            return me.chartScale_Measure(aggr.aggregate_Active);
        };

        if(!this.isFiltered() || this.scaleType==='step'){
            this.DOM.aggr_Active.each(function(aggr){
                kshf.Util.setTransform(this,
                    "translateY("+me.height_hist+"px) scale("+width+","+heightActive(aggr)+")");
            });
        } else {
            // is filtered & not step scale
            var filter_min = this.summaryFilter.active.min;
            var filter_max = this.summaryFilter.active.max;
            var minPos = this.valueScale(filter_min);
            var maxPos = this.valueScale(filter_max);
            this.DOM.aggr_Active.each(function(aggr){
                var translateX = "";
                var width_self=width;
                var aggr_min = aggr.x;
                var aggr_max = aggr.x + aggr.dx;
                if(aggr.aggregate_Active>0){
                    // it is within the filtered range
                    if(aggr_min<filter_min){
                        var lostWidth = minPos-me.valueScale(aggr_min);
                        translateX = "translateX("+lostWidth+"px) ";
                        width_self -= lostWidth;
                    }
                    if(aggr_max>filter_max){
                        var lostWidth = me.valueScale(aggr_max)-maxPos-me.width_barGap*2;
                        //translateX = " translateX("+lostWidth+"px)";
                        width_self -= lostWidth;
                    }
                }
                kshf.Util.setTransform(this,
                    "translateY("+me.height_hist+"px) "+translateX+"scale("+width_self+","+heightActive(aggr)+")");
            });
        }

        this.DOM.lockButton
            .each(function(aggr){
                kshf.Util.setTransform(this,"translateY("+(me.height_hist-heightActive(aggr)-9)+"px)");
            })
            .attr("inside",function(aggr){
                if(me.browser.ratioModeActive) return "";
                if(me.height_hist-heightActive(aggr)<6) return "";
            });

        if(this.scaleType==='time'){
            var durationTime=this.browser.noAnim?0:700;
            this.timeSVGLine = d3.svg.area()
                .x(function(aggr){
                    return me.valueScale(aggr.x)+width/2;
                })
                .y0(me.height_hist+2)
                .y1(function(aggr){
                    if(aggr.aggregate_Active===0) return me.height_hist+3;
                    return me.height_hist-heightActive(aggr);
                });

            this.DOM.lineTrend_Active
              .transition().duration(durationTime)
              .attr("d", this.timeSVGLine);

            this.DOM.lineTrend_ActiveLine.transition().duration(durationTime)
                .attr("y1",function(aggr){ return me.height_hist+3; })
                .attr("y2",function(aggr){
                    if(aggr.aggregate_Active===0) return me.height_hist+3;
                    return me.height_hist-heightActive(aggr);
                })
                .attr("x1",function(aggr){
                    return me.valueScale(aggr.x)+width/2;
                })
                .attr("x2",function(aggr){ return me.valueScale(aggr.x)+width/2; });
        }
    },
    /** -- */
    refreshViz_Compare: function(){
        if(this.isEmpty() || this.collapsed || !this.browser.vizCompareActive) return;
        if(!this.browser.vizCompareActive) return;

        var me=this;
        var width = this.getWidth_Bar();

        var heightCompare = function(aggr){
            if(aggr.aggregate_Compare===0) return 0;
            if(me.browser.ratioModeActive)
                return (aggr.aggregate_Compare/aggr.aggregate_Active)*me.height_hist;
            return me.chartScale_Measure(aggr.aggregate_Compare);
        };

        if(!this.isFiltered() || this.scaleType==='step'){
            this.DOM.aggr_Compare.each(function(aggr){
                kshf.Util.setTransform(this,
                    "translateY("+me.height_hist+"px) scale("+(width/2)+","+heightCompare(aggr)+")");
            });
        } else {
            // is filtered & not step scale
            var filter_min = this.summaryFilter.active.min;
            var filter_max = this.summaryFilter.active.max;
            var minPos = this.valueScale(filter_min);
            var maxPos = this.valueScale(filter_max);
            this.DOM.aggr_Compare.each(function(aggr){
                var translateX = "";
                var width_self=width;
                var aggr_min = aggr.x;
                var aggr_max = aggr.x + aggr.dx;
                if(aggr.aggregate_Active>0){
                    // it is within the filtered range
                    if(aggr_min<filter_min){
                        var lostWidth = minPos-me.valueScale(aggr_min);
                        translateX = "translateX("+lostWidth+"px) ";
                        width_self -= lostWidth;
                    }
                    if(aggr_max>filter_max){
                        var lostWidth = me.valueScale(aggr_max)-maxPos-me.width_barGap*2;
                        //translateX = " translateX("+lostWidth+"px)";
                        width_self -= lostWidth;
                    }
                }
                kshf.Util.setTransform(this,
                    "translateY("+me.height_hist+"px) "+translateX+"scale("+(width_self/2)+","+heightCompare(aggr)+")");
            });
        }

        if(this.scaleType==='time'){
            this.timeSVGLine = d3.svg.line()
                .x(function(aggr){  return me.valueScale(aggr.x)+width/2; })
                .y(function(aggr){
                    if(aggr.aggregate_Compare===0) return me.height_hist+3;
                    return me.height_hist-heightCompare(aggr);
                });

            var durationTime=0;
            if(this.browser.vizCompareActive){
                durationTime=200;
            }

            this.DOM.lineTrend_Compare
                .transition()
                .duration(durationTime)
                .attr("d", this.timeSVGLine);

            this.DOM.lineTrend_CompareLine.transition().duration(durationTime)
                .attr("y1",function(aggr){ return me.height_hist+3; })
                .attr("y2",function(aggr){
                    if(aggr.aggregate_Compare===0) return me.height_hist+3;
                    return me.height_hist-heightCompare(aggr);
                })
                .attr("x1",function(aggr){
                    return me.valueScale(aggr.x)+width/2+1;
                })
                .attr("x2",function(aggr){ return me.valueScale(aggr.x)+width/2+1; });
        }
    },
    /** -- */
    refreshViz_Highlight: function(){
        if(this.isEmpty() || this.collapsed || !this.browser.vizPreviewActive) return;
        var me=this;
        var width = this.getWidth_Bar();

        var getAggrHeight_Preview = function(aggr){
            var p=aggr.aggregate_Preview;
            if(me.browser.preview_not) p = aggr.aggregate_Active-aggr.aggregate_Preview;
            if(me.browser.ratioModeActive){
                if(aggr.aggregate_Active===0) return 0;
                return (p / aggr.aggregate_Active)*me.height_hist;
            } else {
                return me.chartScale_Measure(p);
            }
        };

        if(!this.isFiltered() || this.scaleType==='step'){
            this.DOM.aggr_Preview.each(function(aggr){
                kshf.Util.setTransform(this,
                    "translateY("+me.height_hist+"px) scale("+width+","+getAggrHeight_Preview(aggr)+")");
            });
        } else {
            // is filtered & not step scale
            var filter_min = this.summaryFilter.active.min;
            var filter_max = this.summaryFilter.active.max;
            var minPos = this.valueScale(filter_min);
            var maxPos = this.valueScale(filter_max);
            this.DOM.aggr_Preview.each(function(aggr){
                var translateX = "";
                var width_self=width;
                var aggr_min = aggr.x;
                var aggr_max = aggr.x + aggr.dx;
                if(aggr.aggregate_Active>0){
                    // it is within the filtered range
                    if(aggr_min<filter_min){
                        var lostWidth = minPos-me.valueScale(aggr_min);
                        translateX = "translateX("+lostWidth+"px) ";
                        width_self -= lostWidth;
                    }
                    if(aggr_max>filter_max){
                        var lostWidth = me.valueScale(aggr_max)-maxPos-me.width_barGap*2;
                        //translateX = " translateX("+lostWidth+"px)";
                        width_self -= lostWidth;
                    }
                }
                kshf.Util.setTransform(this,
                    "translateY("+me.height_hist+"px) "+translateX+"scale("+width_self+","+getAggrHeight_Preview(aggr)+")");
            });
        }

        this.refreshMeasureLabel();

        if(this.scaleType==='time'){
            var durationTime=200;
            this.timeSVGLine = d3.svg.area()
                .x(function(aggr){
                    return me.valueScale(aggr.x)+width/2;
                })
                .y0(me.height_hist+2)
                .y1(function(aggr){
                    if(aggr.aggregate_Preview===0) return me.height_hist+3;
                    return me.height_hist-getAggrHeight_Preview(aggr);
                });

            this.DOM.lineTrend_Preview
                .transition().duration(durationTime)
                .attr("d", this.timeSVGLine);

            this.DOM.lineTrend_PreviewLine.transition().duration(durationTime)
                .attr("y1",function(aggr){ return me.height_hist+3; })
                .attr("y2",function(aggr){
                    if(aggr.aggregate_Preview===0) return me.height_hist+3;
                    return me.height_hist-getAggrHeight_Preview(aggr);
                })
                .attr("x1",function(aggr){
                    return me.valueScale(aggr.x)+width/2-1;
                })
                .attr("x2",function(aggr){ return me.valueScale(aggr.x)+width/2-1; });
        }
    },
    /** -- */
    clearViz_Highlight: function(){
        if(this.isEmpty() || this.collapsed) return;
        if(this.DOM.aggr_Preview===undefined) return;
        var me=this;
        var width = this.getWidth_Bar();
        var transform="translateY("+this.height_hist+"px) "+"scale("+this.getWidth_Bar()+",0)";
        this.DOM.aggr_Preview.each(function(bar){
            bar.aggregate_Preview=0;
            kshf.Util.setTransform(this,transform);
        });
        this.refreshMeasureLabel();
        this.DOM.highlightedAggrValue.style("opacity",0);

        if(this.scaleType==='time'){
            var durationTime=200;
            this.timeSVGLine = d3.svg.line()
                .x(function(aggr){
                    return me.valueScale(aggr.x)+width/2;
                })
                .y(function(aggr){
                    return me.height_hist;
                });

            this.DOM.lineTrend_Preview
                .transition().duration(durationTime)
                .attr("d", this.timeSVGLine);
        }
    },
    /** -- */
    refreshViz_Axis: function(){
        if(this.isEmpty() || this.collapsed) return;
        var me = this, tickValues, maxValue;

        var chartAxis_Measure_TickSkip = me.height_hist/17;

        if(this.browser.ratioModeActive) {
            maxValue = 100;
            tickValues = d3.scale.linear()
                .rangeRound([0, this.height_hist])
                .domain([0,100])
                .ticks(chartAxis_Measure_TickSkip)
                .filter(function(d){return d!==0;});
        } else {
            if(this.browser.percentModeActive) {
                maxValue = Math.round(100*me.getMaxAggr_Active()/me.browser.recordsWanted_Aggr_Total);
                tickValues = d3.scale.linear()
                    .rangeRound([0, this.height_hist])
                    .nice(chartAxis_Measure_TickSkip)
                    .clamp(true)
                    .domain([0,maxValue])
                    .ticks(chartAxis_Measure_TickSkip);
            } else {
                tickValues = this.chartScale_Measure.ticks(chartAxis_Measure_TickSkip);
            }
        }

        // remove non-integer values & 0...
        tickValues = tickValues.filter(function(d){return d%1===0&&d!==0;});

        var tickDoms = this.DOM.chartAxis_Measure.selectAll("span.tick")
            .data(tickValues,function(i){return i;});
        tickDoms.exit().remove();
        var tickData_new=tickDoms.enter().append("span").attr("class","tick");

        // translate the ticks horizontally on scale
        tickData_new.append("span").attr("class","line");

        // Place the doms at the bottom of the histogram, so their animation is in the right direction
        tickData_new.each(function(){
            kshf.Util.setTransform(this,"translateY("+me.height_hist+"px)");
        });

        if(this.browser.ratioModeActive){
            tickData_new.append("span").attr("class","text").text(function(d){return d;});
        } else {
            tickData_new.append("span").attr("class","text").text(function(d){return d3.format("s")(d);});
        }

        setTimeout(function(){
            var transformFunc;
            if(me.browser.ratioModeActive){
                transformFunc=function(d){
                    kshf.Util.setTransform(this,"translateY("+
                        (me.height_hist-d*me.height_hist/100)+"px)");
                };
            } else {
                if(me.browser.percentModeActive){
                    transformFunc=function(d){
                        kshf.Util.setTransform(this,"translateY("+
                            (me.height_hist-(d/maxValue)*me.height_hist)+"px)");
                    };
                } else {
                    transformFunc=function(d){
                        kshf.Util.setTransform(this,"translateY("+
                            (me.height_hist-me.chartScale_Measure(d))+"px)");
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
    refreshMeasureLabel: function(){
      var me=this;
      if(this.isEmpty() || this.collapsed) return;
      if(this.browser.highlightSelectedSummary===this) return;

      this.DOM.aggrGlyphs.attr("noitems",function(aggr){ return aggr.aggregate_Active===0; });
      this.DOM.measureLabel.text(function(aggr){ return me.browser.getMeasureLabel(aggr); });
    },
    /** -- */
    refreshIntervalSlider: function(){
      var minPos = this.valueScale(this.summaryFilter.active.min);
      var maxPos = this.valueScale(this.summaryFilter.active.max);
      // Adjusting min/max position is important because if it is not adjusted, the
      // tips of the filtering range may not appear at the bar limits, which looks distracting.
      if(this.summaryFilter.active.min===this.intervalRange.min){
        minPos = this.valueScale.range()[0];
      }
      if(this.summaryFilter.active.max===this.intervalRange.max){
        maxPos = this.valueScale.range()[1];
      }
      if(this.scaleType==='step'){
        minPos-=this.aggrWidth/2;
        maxPos+=this.aggrWidth/2;
      }

      this.DOM.intervalSlider.select(".base.active")
        .attr("filtered",this.isFiltered())
        .each(function(d){
          this.style.left = minPos+"px";
          this.style.width = (maxPos-minPos)+"px";
          //kshf.Util.setTransform(this,"translateX("+minPos+"px) scaleX("+(maxPos-minPos)+")");
        });
      this.DOM.intervalSlider.selectAll(".handle")
        .each(function(d){
          kshf.Util.setTransform(this,"translateX("+((d==="min")?minPos:maxPos)+"px)");
        });
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
      var chartWidth = this.getWidth()-this.width_histMargin-this.width_vertAxisLabel;
      this.DOM.summaryInterval.style("width",this.getWidth()+"px");
      this.DOM.summaryName.style("max-width",(this.getWidth()-40)+"px");
      if(this.DOM.timeSVG)
          this.DOM.timeSVG.style("width",(chartWidth+2)+"px")
    },
    /** -- */
    setHeight: function(targetHeight){
      if(this.histBins===undefined) return;
      var c = targetHeight-this.getHeight_Header()-this.getHeight_Extra();
      c = Math.min(c,100);
      if(this.height_hist===c) return;
      this.height_hist = c;
      this.updateBarScale2Active();
      this.refreshBins_Translate();

      this.refreshViz_Scale();
      this.refreshViz_Highlight();
      this.refreshViz_Compare();
      this.refreshViz_Axis();
      this.refreshHeight();

      this.DOM.labelGroup.style("height",this.height_labels+"px");
      this.DOM.intervalSlider.selectAll(".rangeLimitOnChart")
        .style("height",this.height_hist+"px")
        .style("top",(-this.height_hist-13)+"px")
    },
    /** -- */
    updateAfterFilter: function(){
      if(this.isEmpty() || this.collapsed) return;
      this.updateAggregate_Active();
      this.refreshMeasureLabel();
      this.updateBarPreviewScale2Active();
      if(this.percentileChartVisible) this.updatePercentiles();
    },
    /** -- */
    updateBarPreviewScale2Active: function(){
      var me=this;
      this.updateBarScale2Active();
      this.refreshBins_Translate();
      this.refreshViz_Scale();
      this.refreshViz_Compare();

      this.DOM.aggr_Preview.attr("fast",null); // take it slow for result preview animations
      this.refreshViz_Highlight();
      this.refreshViz_Axis();

      setTimeout(function(){ me.DOM.aggr_Preview.attr("fast",true); },800);
    },
    /** -- */
    setRecordValue: function(v){
      if(!this.inBrowser()) return;
      if(this.DOM.inited===false) return;
      if(v===null) return;
      if(this.valueScale===undefined) return;
      if(this.scaleType==='log' && v<=0) return; // do not map zero/negative values

      var me=this;

      this.DOM.recordValue
        .each(function(){ kshf.Util.setTransform(this,"translateX("+(me.valueScale(v))+"px)"); })
        .style("display","block");

      this.DOM.selectedItemValueText.html( this.intervalTickFormat(v)+this.printUnitName() );
    },
    /** -- */
    hideRecordValue: function(){
      if(this.DOM.recordValue)
        this.DOM.recordValue.style("display",null);
    },
    /** -- */
    updatePercentiles: function(){
      var me=this;
      // get active values into an array
      // the items are already sorted by their numeric value, it's just a linear pass.
      var values = [];
      this.filteredItems.forEach(function(record){
        if(record.isWanted) values.push(me.itemV(record));
      });

      this.quantile_val = {};
      this.quantile_pos = {};
      [10,20,30,40,50,60,70,80,90].forEach(function(q){
        this.quantile_val[q] = d3.quantile(values,q/100);
        this.quantile_pos[q] = this.valueScale(this.quantile_val[q]);
        kshf.Util.setTransform(this.DOM.quantile[q][0][0],"translateX("+this.quantile_pos[q]+"px)");
      },this);

      [[10,90],[20,80],[30,70],[40,60]].forEach(function(qb){
        kshf.Util.setTransform(this.DOM.quantile[""+qb[0]+"_"+qb[1]][0][0],
          "translateX("+(this.quantile_pos[qb[0]])+"px) "+
          "scaleX("+(this.quantile_pos[qb[1]]-this.quantile_pos[qb[0]])+") ");
      },this);
    },
};

for(var index in Summary_Interval_functions){
    kshf.Summary_Interval.prototype[index] = Summary_Interval_functions[index];
}
