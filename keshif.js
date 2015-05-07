/*********************************

keshif library

Copyright (c) 2014-2015, University of Maryland
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
    queryURL_base: 'https://docs.google.com/spreadsheet/tq?key=',
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
    num_of_charts: 0,
    maxVisibleItems_Default: 100, 
    dt: {},
    dt_id: {},
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
};


kshf.Util = {
    dif_aggregate_Active: function(a,b){
        return b.aggregate_Active - a.aggregate_Active;
    },
    sortFunc_aggreage_Active_Total: function(a,b){ 
        var dif=kshf.Util.dif_aggregate_Active(a,b);
        if(dif===0) { return b.aggregate_Total-a.aggregate_Total; }
        return dif;
    },
    sortFunc_Column_Int_Incr: function(a,b){ 
        return a.data[0] - b.data[0]; 
    },
    sortFunc_Column_Int_Decr: function(a,b){ 
        return b.data[0] - a.data[0]; 
    },
    sortFunc_Column_ParseInt_Incr: function(a,b){ 
        return parseFloat(a.data[0],10) -parseFloat(b.data[0],10);
    },
    sortFunc_Column_ParseInt_Decr: function(a,b){ 
        return parseFloat(b.data[0],10) -parseFloat(a.data[0],10);
    },
    sortFunc_String_Decr: function(a,b){ 
        return b.data[0].localeCompare(a.data[0]);
    },
    sortFunc_String_Incr: function(a,b){ 
        return b.data[0].localeCompare(a.data[0]);
    },
    sortFunc_Time_Last: function(a, b){
        if(a.xMax_Dyn!==undefined && b.xMax_Dyn!==undefined){
            return b.xMax_Dyn - a.xMax_Dyn;
        }
        if(a.xMax_Dyn===undefined && b.xMax_Dyn===undefined){
            return b.xMax - a.xMax;
        }
        if(b.xMax_Dyn===undefined){ return -1; }
        return 1;
    },
    sortFunc_Time_First: function(a, b){
        if(a.xMax_Dyn!==undefined && b.xMax_Dyn!==undefined){
            return a.xMin_Dyn - b.xMin_Dyn;
        }
        if(a.xMax_Dyn===undefined && b.xMax_Dyn===undefined){
            return a.xMin - b.xMin;
        }
        if(b.xMin_Dyn===undefined){ return -1; }
        return 1;
    },
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
    cellToArray: function(dt, columns, splitExpr, convertInt){
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
                // convert to int - TODO: what if the IDs are string?
                if(convertInt!==false){
                    for(j=0; j<list.length; j++){
                        list[j] = parseInt(list[j],10);
                    }
                }
                p[column] = list;
            });
        });
    },
    unescapeCommas: function(c){
        var k=0,j;
        var escaped=false;
        var cell;
        var a=[];
        c.forEach(function(c_i){
            if(escaped){
                cell+=","+c_i;
                if(c_i[c_i.length-1]==="\""){
                    escaped=false;
                } else {
                    return;
                }
            } else {
                if(c_i[0]==="\""){
                    escaped = true;
                    cell = c_i.slice(1,c_i.length-1);
                    return;
                }
                cell = c_i;
            }
            // convert to num
            var n=+cell;
            if(!isNaN(n) && cell!==""){
                cell=n;
            } else {/*
                // convert to date
                var dt = Date.parse(cell);
                if(!isNaN(dt)){ cell = new Date(dt); } */
            }
            a.push(cell);
        });
        return a;
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
};

// tipsy, facebook style tooltips for jquery
// Modified / simplified version for internal Keshif use
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license
var activeTipsy = undefined;

function Tipsy(element, options) {
    this.jq_element = $(element);
    this.options = $.extend({}, this.defaults, options);
};
Tipsy.prototype = {
    defaults: {
        className: null,
        delayOut: 0,
        fade: true,
        fallback: '',
        gravity: 'n',
        offset: 0,
        offset_x: 0,
        offset_y: 0,
        opacity: 0.9
    },
    show: function() {
        var maybeCall = function(thing, ctx) {
            return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
        };
        if(activeTipsy) {
            activeTipsy.hide();
        }

        activeTipsy=this;

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
        
        if (this.options.fade) {
            jq_tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity},200);
        } else {
            jq_tip.css({visibility: 'visible', opacity: this.options.opacity});
        }
    },
    hide: function(){
        activeTipsy = undefined;
        if (this.options.fade) {
            this.tip().stop().fadeOut(200,function() { $(this).remove(); });
        } else {
            this.tip().remove();
        }
    },
    getTitle: function() {
        var title, jq_e = this.jq_element, o = this.options;
        var title, o = this.options;
        if (typeof o.title == 'string') {
            title = jq_e.attr(o.title == 'title' ? 'original-title' : o.title);
        } else if (typeof o.title == 'function') {
            title = o.title.call(jq_e[0]);
        }
        title = ('' + title).replace(/(^\s*|\s*$)/, "");
        return title || o.fallback;
    },
    tip: function() {
        if(this.jq_tip) return this.jq_tip;
        this.jq_tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
        this.jq_tip
            ;
        this.jq_tip.data('tipsy-pointee', this.jq_element[0]);
        return this.jq_tip;
    },
};



/**
 * @constructor
 */
kshf.Item = function(d, idIndex){
    // the main data within item
    this.data = d;
    this.idIndex = idIndex; // TODO: Items don't need to have ID index, only one per table is enough!
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
    // Active aggregate value
    this.aggregate_Active = 0;
    // Previewed aggregate value
    this.aggregate_Preview = 0;
    // Total aggregate value
    this.aggregate_Total = 0;

    // If true, filter/wanted state is dirty and needs to be updated.
    this._filterCacheIsDirty = true;
    // Cacheing filter state per eact facet in the system
    this.filterCache = [];
    // Wanted item / not filtered out
    this.isWanted = true;
    // Used by listDisplay to adjust animations. Only used by primary entity type for now.
    this.visibleOrder = 0;
    this.visibleOrder_pre = -1;
    // The data that's used for mapping this item, used as a cache.
    // This is accessed by filterID
    // Through this, you can also reach mapped DOM items
        // DOM elements that this item is mapped to
        // - If this is a paper, it can be paper type. If this is author, it can be author affiliation.
    this.mappedDataCache = []; // caching the values this item was mapped to
    // If true, item is currently selected to be included in link computation
    this.selectedForLink = false;

    this.DOM = {};
    // If item is primary type, this will be set
    this.DOM.result = undefined;
    // If item is used as a filter (can be primary if looking at links), this will be set
    this.DOM.facet  = undefined;
    // If true, updatePreview has propogated changes above
    this.updatePreview_Cache = false;
};
kshf.Item.prototype = {
    /**
     * Returns unique ID of the item.
     */
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
        this.selected = 0; this._setFacetDOM();
    },
    set_NOT: function(l){ 
        if(this.is_NOT()) return;
        this._insertToList(l);
        this.selected =-1; this._setFacetDOM(); 
    },
    set_AND: function(l){ 
        if(this.is_AND()) return;
        this._insertToList(l);
        this.selected = 1; this._setFacetDOM();
    },
    set_OR: function(l){ 
        if(this.is_OR()) return;
        this._insertToList(l);
        this.selected = 2; this._setFacetDOM();
    },

    _insertToList: function(l){
        if(this.inList!==undefined) {
            this.inList.splice(this.inList.indexOf(this),1);
        }
        this.inList = l;
        l.push(this);
    },

    _setFacetDOM: function(){
        if(this.DOM.facet) this.DOM.facet.setAttribute("selected",this.selected);
    },

    /** -- */
    addItem: function(item){
        this.items.push(item);
        this.aggregate_Total+=item.aggregate_Self;
        this.aggregate_Active+=item.aggregate_Self;
    },
    /**
     * Updates isWanted state, and notifies all related filter attributes of the change.
     * With recursive parameter, you avoid updating status under facet passed in as recursive
     */
    updateWanted: function(recursive){
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
                    m.forEach(function(attrib){
                        var oldVal = attrib.aggregate_Active;
                        attrib.aggregate_Active+=this.aggregate_Self;
                        if(oldVal===0 && attrib.facet){
                            if(attrib.facet!==recursive && !attrib.facet.isLinked){
                                // it is now selected, see other DOM items it has and increment their count too
                                attrib.mappedDataCache.forEach(function(m){
                                    if(m===null) return;
                                    if(m.h) { // interval
                                        if(m.b) m.b.aggregate_Active+=attrib.aggregate_Self;
                                    } else { // categorical
                                        m.forEach(function(item){ 
                                            item.aggregate_Active+=attrib.aggregate_Self;
                                        });
                                    }
                                });
                            }
                        }
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
                    m.forEach(function(attrib){
                        attrib.aggregate_Active-=this.aggregate_Self;
                        if(attrib.aggregate_Active===0 && attrib.facet){
                            if(attrib.facet!==recursive && !attrib.facet.isLinked){
                                // it is now not selected. see other DOM items it has and decrement their count too
                                attrib.mappedDataCache.forEach(function(m){
                                    if(m===null) return;
                                    if(m.h) { // interval
                                        if(m.b) m.b.aggregate_Active-=attrib.aggregate_Self;
                                    } else { // categorical
                                        m.forEach(function(item){ 
                                            item.aggregate_Active-=attrib.aggregate_Self;
                                        });
                                    }
                                });
                            }
                        }
                    },this);
                }
            },this);
        }

        this._filterCacheIsDirty = false;
        return this.isWanted !== oldWanted;
    },
    /** Only updates wanted state if it is currently not wanted (resulting in More wanted items) */
    updateWanted_More: function(recursive){
        if(this.isWanted) return false;
        return this.updateWanted(recursive);
    },
    /** Only updates wanted state if it is currently wanted (resulting in Less wanted items) */
    updateWanted_Less: function(recursive){
        if(!this.isWanted) return false;
        return this.updateWanted(recursive);
    },
    updatePreview: function(parentFacet){
        if(!this.isWanted) return;

        if(this.updatePreview_Cache===false){
            this.updatePreview_Cache = true;
        } else {
            return;
        }

        if(this.DOM.result) this.DOM.result.setAttribute("highlight",true);

        // This is where you pass highlight information to through parent facet (which is primary entity)
        // if this item appears in a facet, it means it's used as a filter itself, propogate above
        if(this.facet && this.facet===parentFacet){
            // If this is the main item type, don't!
            // If this has no active item count, don't!
            if(!this.facet.isLinked && this.aggregate_Active>0){
                // see the main items stored under this one...
                this.items.forEach(function(item){ item.updatePreview(this.facet); },this);
            }
        }

        if(parentFacet && this.facet && this.aggregate_Preview===0) return;
        this.mappedDataCache.forEach(function(m){
            if(m===null) return;
            if(m.h) {
                if(m.b && m.b.aggregate_Active>0) m.b.aggregate_Preview+=this.aggregate_Self;
            } else {
                // if you are a sub-filter, go over the l
                m.forEach(function(item){
                    item.aggregate_Preview+=this.aggregate_Self;
                    if(item.aggregate_Preview===1 && item.facet){
                        if(!item.facet.isLinked && item.facet!==parentFacet){
                            // TODO: Don't go under the current one, if any
                            item.updatePreview(parentFacet);
                        }
                    }
                },this);
            }
        },this);
    },
    /** 
     * Called on mouse-over on a primary item type, then recursively on all summaries and their sub-summaries
     * Higlights all relevant UI parts to this UI item
     */
    highlightAll: function(recurse){
        if(this.DOM.result) {
            this.DOM.result.setAttribute("highlight",recurse?"selected":true);
        }
        if(this.DOM.facet) {
            this.DOM.facet.setAttribute("highlight",recurse?"selected":true);
        }

        if(this.DOM.result && !recurse) return;
        this.mappedDataCache.forEach(function(d){
            if(d===null) return; // no mapping for this index
            if(d.h){ // interval facet
                d.h.setSelectedPosition(d.v);
            } else { // categorical facet
                d.forEach(function(item){
                    // skip going through main items that contain a link TO this item
                    if(this.DOM.result && item.DOM.result)
                        return;
                    item.highlightAll(false);
                },this);
            }
        },this);
    },
    /** Removes higlight from all relevant UI parts to this UI item */
    nohighlightAll: function(recurse){
        if(this.DOM.result) this.DOM.result.setAttribute("highlight",false);
        if(this.DOM.facet)  this.DOM.facet .setAttribute("highlight",false);

        if(this.DOM.result && !recurse) return;
        this.mappedDataCache.forEach(function(d,i){
            if(d===null) return; // no mapping for this index
            if(d.h){ // interval facet
                d.h.hideSelectedPosition(d.v);
            } else { // categorical facet
                d.forEach(function(item){
                    // skip going through main items that contain a link TO this item
                    if(this.DOM.result && item.DOM.result) return;
                    item.nohighlightAll(false);
                },this);
            }
        },this);
    },
    setSelectedForLink: function(v){
        this.selectedForLink = v;
        if(this.DOM.result){
            this.DOM.result.setAttribute("selectedForLink",v);
        }
        if(v===false){
            this.set_NONE();
        }
    }
};

kshf.Filter = function(id, opts){
    this.isFiltered = false;

    this.browser = opts.browser;
    this.parentSummary = opts.parentSummary;

    // filter needs to know about filteredItems because it auto clears, etc...
    this.filteredItems = opts.filteredItems;
    this.onClear = opts.onClear;
    this.onFilter = opts.onFilter;
    this.hideCrumb = opts.hideCrumb;
    this.filterView_Detail = opts.filterView_Detail; // must be a function
    this.filterHeader = opts.filterHeader;

    this.id = id;
    this.filteredItems.forEach(function(item){
        item.setFilterCache(this.id,true);
    },this);
    this.how = "All";
    this.filterSummaryBlock = null;
};
kshf.Filter.prototype = {
    addFilter: function(forceUpdate,recursive){
        var parentFacet=this.parentSummary.parentFacet;
        this.isFiltered = true;

        if(this.onFilter) this.onFilter.call(this.parentSummary, this);

        var stateChanged = false;
        if(recursive===undefined) recursive=true;

        var how=0;
        if(this.how==="LessResults") how = -1;
        if(this.how==="MoreResults") how = 1;

        this.filteredItems.forEach(function(item){
            // if you will show LESS results and item is not wanted, skip
            // if you will show MORE results and item is wanted, skip
            if(!(how<0 && !item.isWanted) && !(how>0 && item.isWanted)){
                var changed = item.updateWanted(recursive);
                stateChanged = stateChanged || changed;
            }
            if(parentFacet && parentFacet.hasAttribs()){
                if(item.isWanted)
                    item.set_OR(parentFacet.summaryFilter.selected_OR);
                else 
                    item.set_NONE();
            }
        },this);

        // if this has a parent facet (multi-level), link selection from this to the parent facet
        if(parentFacet && parentFacet.hasAttribs()){
            parentFacet.updateAttribCount_Wanted();
            parentFacet.summaryFilter.how = "All";
            // re-run the parents attribute filter...
            parentFacet.summaryFilter.linkFilterSummary = "";
            parentFacet.summaryFilter.addFilter(false,parentFacet); // This filter will update the browser later if forceUpdate===true
            parentFacet._update_Selected();
        }

        this._refreshFilterSummary();

        if(forceUpdate===true){
            this.browser.update_itemsWantedCount();
            this.browser.refresh_filterClearAll();
            if(stateChanged) this.browser.updateAfterFilter(-1);
            if(sendLog) sendLog(kshf.LOG.FILTER_ADD,this.browser.getFilterState());
        }
    },
    clearFilter: function(forceUpdate,recursive, updateWanted){
        if(!this.isFiltered) return;
        var parentFacet=this.parentSummary.parentFacet;
        var hasEntityParent = false;
        if(this.parentSummary.hasEntityParent)
            hasEntityParent = this.parentSummary.hasEntityParent();

        this.isFiltered = false;

        // clear filter cache - no other logic is necessary
        this.filteredItems.forEach(function(item){ item.setFilterCache(this.id,true); },this);

        if(this.onClear) this.onClear.call(this.parentSummary,this);

        if(recursive===undefined) recursive=true;

        if(updateWanted!==false){
            this.filteredItems.forEach(function(item){
                if(!item.isWanted){
                    item.updateWanted(recursive);
                }
                if(parentFacet && parentFacet.hasAttribs()){
                    if(item.isWanted)
                        item.set_OR(parentFacet.summaryFilter.selected_OR);
                    else 
                        item.set_NONE();
                }
            });
        }

        this._refreshFilterSummary();

        if(forceUpdate!==false){
            if(hasEntityParent){
                parentFacet.updateAttribCount_Wanted();
                parentFacet.summaryFilter.how = "All";
                if(parentFacet.catCount_Wanted===parentFacet.catCount_Total){
                    parentFacet.summaryFilter.clearFilter(false,parentFacet); // force update
                } else {
                    // re-run the parents attribute filter...
                    parentFacet.summaryFilter.linkFilterSummary = "";
                    parentFacet.summaryFilter.addFilter(false,parentFacet); // force update
                }
            }

            if(this.parentSummary.subFacets){
                this.parentSummary.subFacets.forEach(function(summary){
                    summary.summaryFilter.clearFilter(false,false,false);
                });
                // if this has sub-facets, it means this also maintains an isWanted state.
                // Sub facets are cleared, but the attribs isWanted state is NOT updated
                // Fix that, now.
                if(this.parentSummary.subFacets.length>0){
                    this.parentSummary._cats.forEach(function(item){
                        item.isWanted = true;
                        item._filterCacheIsDirty = false;
                    });
                }
            }

            this.browser.update_itemsWantedCount();
            this.browser.refresh_filterClearAll();
            this.browser.updateAfterFilter(1); // more results

            if(sendLog) {
                sendLog(kshf.LOG.FILTER_CLEAR,this.browser.getFilterState());
            }
        }
    },

    /** Don't call this directly */
    _refreshFilterSummary: function(){
        if(this.hideCrumb===undefined){
            this.hideCrumb = true;
        }
        if(this.hideCrumb===true) return;
        if(!this.isFiltered){
            var root = this.filterSummaryBlock;
            if(root===null || root===undefined) return;
            root.attr("ready",false);
            setTimeout(function(){ root[0][0].parentNode.removeChild(root[0][0]); }, 350);
            this.filterSummaryBlock = null;
        } else {
            // insert DOM
            if(this.filterSummaryBlock===null) {
                this.filterSummaryBlock = this.insertFilterSummaryBlock();
                if(this.filterSummaryBlock===false){
                    this.filterSummaryBlock=null;
                    return;
                }
            }
            if(this.parentSummary!==undefined)
                this.filterHeader = this.parentSummary.summaryName;
            this.filterSummaryBlock.select(".filterHeader").html(this.filterHeader);
            this.filterSummaryBlock.select(".filterDetails").html(this.filterView_Detail.call(this));
        }
    },
    /** Inserts a summary block to the list breadcrumb DOM */
    /** Don't call this directly */
    insertFilterSummaryBlock: function(){
        var x;
        var me=this;
        if(this.browser.DOM.filtercrumbs===undefined) return false;
        x = this.browser.DOM.filtercrumbs
            .append("span").attr("class","filter-block")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n',
                    title: function(){ 
                        return "<span class='action'><span class='fa fa-times'></span> Remove</span> filter"; 
                    }
                })
            })
            .on("mouseenter",function(){
                this.tipsy.show();
                d3.event.stopPropagation();
            })
            .on("mouseleave",function(d,i){
                this.tipsy.hide();
                d3.event.stopPropagation();
            })
            .on("click",function(){
                this.tipsy.hide();
                me.clearFilter();
                // delay layout height update
                setTimeout( function(){ me.browser.updateLayout_Height();}, 1000);
                if(sendLog) sendLog(kshf.LOG.FILTER_CLEAR_CRUMB, {id: this.id});
            })
            ;
        x.append("span").attr("class","chartClearFilterButton summary")
            .append("span").attr("class","fa fa-times")
            ;
        var y = x.append("span").attr("class","sdsdsds");
        y.append("span").attr("class","filterHeader");
        y.append("span").attr("class","filterDetails");
        // animate appear
        window.getComputedStyle(x[0][0]).opacity;
        x.attr("ready",true);
        return x;
    }
};

/**
 * The list UI
 * @constructor
 */
kshf.List = function(kshf_, config, root){
    var me = this;
    this.browser = kshf_;
    this.DOM = {};

    this.scrollTop_cache=0;

    this.linkColumnWidth = 85;
    this.linkColumnWidth_ItemCount = 25;
    this.linkColumnWidth_BarMax = this.linkColumnWidth-this.linkColumnWidth_ItemCount-3;
    this.selectColumnWidth = 17;

    this.config = config;

    if(config.recordView!==undefined){
        if(typeof config.recordView === 'string'){
            this.recordView = function(d){ return d.data[config.recordView];};
        }
        if(typeof config.recordView === 'function'){
            this.recordView = config.recordView;
        }
    }

    this.autoExpandMore = config.autoExpandMore || true;

    this.maxVisibleItems_Default = config.maxVisibleItems_Default || kshf.maxVisibleItems_Default;
    // The property below is the dynamic property
    this.maxVisibleItems = this.maxVisibleItems_Default;

    this.hasLinkedItems = config.hasLinkedItems || false;
    if(this.hasLinkedItems){
        this.selectColumnWidth += 30;
        this.showSelectBox = false;
        if(config.showSelectBox===true) this.showSelectBox = true;
        if(this.showSelectBox)
            this.selectColumnWidth+=17;
    }

    // Sorting options
    this.sortingOpts = config.sortingOpts;
    this.sortingOpts.forEach(function(sortOpt){
        if(sortOpt.value===undefined) {
            sortOpt.value = function(d){ return d.data[sortOpt.name]; };
        }
        if(!sortOpt.label) sortOpt.label = sortOpt.value;
        if(sortOpt.inverse===undefined) sortOpt.inverse = false;
        if(sortOpt.func===undefined) sortOpt.func = me.getSortFunc(sortOpt.value);
    },this);
    this.sortingOpt_Active = this.sortingOpts[0];

    // can be 'grid' or 'list'
    this.displayType = config.displayType || 'list';
    this.visibleCb = config.visibleCb;
    this.detailCb = config.detailCb;

    this.linkText = config.linkText || "Related To";

    this.showRank = config.showRank || false;

    this.textSearch = config.textSearch;
    this.textSearchFunc = config.textSearchFunc;
    if(this.textSearch!==undefined){
        if(this.textSearchFunc===undefined){
            this.textSearchFunc = function(d){ return d.data[this.textSearch]; };
        }
    }

    // "off", "one", "zoom"
    this.detailsToggle = config.detailsToggle || "off";

    this.listDiv = root.select("div.listDiv")
        .attr('detailsToggle',this.detailsToggle)
        .attr('displayType',this.displayType);

    this.DOM.listHeader=this.listDiv.append("div").attr("class","listHeader");

    this.DOM.listHeader_TopRow = this.DOM.listHeader.append("div").attr("class","topRow");
    this.insertTotalViz();
    this.DOM.listHeader_BottomRow = this.DOM.listHeader.append("div").attr("class","bottomRow");

    this.DOM.listItemGroup=this.listDiv.append("div").attr("class","listItemGroup")
        .on("scroll",function(d){
            // showMore display
            if(this.scrollHeight-this.scrollTop-this.offsetHeight<10){
                if(me.autoExpandMore===false){
                    me.DOM.showMore.style("bottom","4px");
                } else {
                    me.showMore();
                }
            } else{
                me.DOM.showMore.style("bottom","-27px");
            }
            me.DOM.scrollToTop.style("visibility", this.scrollTop>0?"visible":"hidden");
        });

    // **************************************************************************************************
    // Header stuff *************************************************************************************

    this.insertHeaderSortSelect();
    this.DOM.filtercrumbs = this.DOM.listHeader_BottomRow.append("span").attr("class","filtercrumbs");
    this.insertHeaderLinkedItems();
    this.DOM.scrollToTop = this.DOM.listHeader_BottomRow.append("div")
        .attr("class","scrollToTop fa fa-arrow-up")
        .on("click",function(d){ 
            kshf.Util.scrollToPos_do(me.DOM.listItemGroup[0][0],0);
            if(sendLog) sendLog(kshf.LOG.LIST_SCROLL_TOP);
        })
        .each(function(){
            this.tipsy = new Tipsy(this, {gravity: 'e', title: function(){ return "Scroll to top"; }});
        })
        .on("mouseover",function(){ this.tipsy.show(); })
        .on("mouseout",function(d,i){ this.tipsy.hide(); })
        ;

    this.sortItems();
    this.insertItems();

    this.DOM.showMore = this.listDiv.append("div").attr("class","showMore")
        .on("click",function(){
            me.showMore();
        })
        .on("mouseenter",function(){
            d3.select(this).selectAll(".loading_dots").attr("anim",true);
        })
        .on("mouseleave",function(){
            d3.select(this).selectAll(".loading_dots").attr("anim",null);
        })
        ;
    this.DOM.showMore.append("span").attr("class","MoreText").html("Show More");
    this.DOM.showMore.append("span").attr("class","Count CountAbove");
    this.DOM.showMore.append("span").attr("class","Count CountBelow");
    this.DOM.showMore.append("span").attr("class","loading_dots loading_dots_1");
    this.DOM.showMore.append("span").attr("class","loading_dots loading_dots_2");
    this.DOM.showMore.append("span").attr("class","loading_dots loading_dots_3");

    this.updateSortColumnWidth(config.sortColWidth || 50); // default: 50px;
};

kshf.List.prototype = {
    /* -- */
    insertTotalViz: function(){
        var adsdasda=this.DOM.listHeader.append("div").attr("class","totalViz");
        this.DOM.totalViz_total = adsdasda.append("span").attr("class","aggr total");
        this.DOM.totalViz_active = adsdasda.append("span").attr("class","aggr active");
        this.DOM.totalViz_preview = adsdasda.append("span").attr("class","aggr preview");
        this.DOM.totalViz_compare = adsdasda.append("span").attr("class","aggr compare");
    },
    /* -- */
    refreshTotalViz: function(){
        this.DOM.totalViz_active.style("width",(100*this.browser.itemsWantedCount/this.browser.items.length)+"%");
        this.DOM.totalViz_preview.style("width",(100*this.browser.itemCount_Previewed/this.browser.items.length)+"%");
    },
    /* -- */
    insertGlobalTextSearch: function(){
        var me=this;

        this.textFilter = this.browser.createFilter({
            browser: this.browser,
            filteredItems: this.browser.items,
            parentSummary: this,
            // no filterView_Detail function, filtering text is already shown as part of input/filter
            onClear: function(filter){
                this.DOM.mainTextSearch.select(".clearText").style('display','none');
                this.DOM.mainTextSearch[0][0].value = "";
                filter.filterStr = "";
            },
            onFilter: function(filter){
                this.DOM.mainTextSearch.select(".clearText").style('display','inline-block');
                // split the search string, search for each item individually
                filter.filterStr=filter.filterStr.split(" ");
                // go over all the items in the list, search each keyword separately
                // If some search matches, return true (any function)
                filter.filteredItems.forEach(function(item){
                    var f = ! filter.filterStr.every(function(v_i){
                        var v=me.textSearchFunc(item);
                        if(v===null || v===undefined) return true;
                        return v.toLowerCase().indexOf(v_i)===-1;
                    });
                    item.setFilterCache(filter.id,f);
                });
            },
            hideCrumb: true,
        });

        this.DOM.mainTextSearch = this.DOM.listHeader_TopRow.append("span").attr("class","mainTextSearch");

        if(this.textSearchFunc===undefined) return;

        this.DOM.mainTextSearch.append("i").attr("class","fa fa-search searchIcon");
        this.DOM.mainTextSearch = this.DOM.mainTextSearch.append("input")
            .attr("placeholder","Search "+(this.textSearch?this.textSearch:""))
            //.attr("autofocus","true")
            .on("keydown",function(){
                var x = this;
                if(this.timer){
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.timer = setTimeout( function(){
                    me.textFilter.filterStr = x.value.toLowerCase();
                    if(me.textFilter.filterStr!=="") {
                        me.textFilter.addFilter(true);
                    } else {
                        me.textFilter.clearFilter();
                    }
                    if(sendLog) sendLog(kshf.LOG.FILTER_TEXTSEARCH, {id: me.textFilter.id, info: me.textFilter.filterStr});
                    x.timer = null;
                }, 750);
            });
        this.DOM.mainTextSearch.append("i").attr("class","fa fa-times-circle clearText")
            .on("click",function() { me.textFilter.clearFilter(); });
    },
    /** -- */
    updateSortColumnWidth: function(v){
        if(this.displayType==='list'){
            this.sortColWidth = v;
            this.DOM.header_listSortColumn.style("min-width",this.sortColWidth+"px");
            this.DOM.listsortcolumn.style("width",this.sortColWidth+"px")
        }
    },
    /** -- */
    insertHeaderSortSelect: function(){
        var me=this;
        this.DOM.header_listSortColumn = this.DOM.listHeader_BottomRow.append("div")
            .attr("class","header_listSortColumn");
        // just insert it as text
        if(this.sortingOpts.length===1){
            this.DOM.header_listSortColumn.append("span").attr("class","sortColumnName")
                .html(this.sortingOpts[0].name);
        } else {
            this.DOM.header_listSortColumn.append("select")
                .attr("class","listSortOptionSelect")
                .on("change", function(){
                    me.sortingOpt_Active = me.sortingOpts[this.selectedIndex];
                    me.reorderItemsOnDOM();
                    me.updateVisibleIndex();
                    me.maxVisibleItems = me.maxVisibleItems_Default;
                    me.updateItemVisibility();
                    if(me.displayType==='list'){
                        // update sort column labels
                        me.DOM.listsortcolumn_label
                            .html(function(d){
                                return me.sortingOpt_Active.label(d);
                            })
                            .each(function(d){
                                this.columnValue = me.sortingOpt_Active.label(d);
                            });
                    }
                    kshf.Util.scrollToPos_do(me.DOM.listItemGroup[0][0],0);
                    if(sendLog) sendLog(kshf.LOG.LIST_SORT, {info: this.selectedIndex});
                })
                .selectAll("input.list_sort_label").data(this.sortingOpts)
                .enter().append("option")
                    .attr("class", "list_sort_label")
                    .html(function(d){ return d.name; })
                    ;
        }

        this.DOM.listHeader_BottomRow.append("span").attr("class","sortColumn")
            .append("span").attr("class","sortButton fa")
            .on("click",function(d){
                me.sortingOpt_Active.inverse = me.sortingOpt_Active.inverse?false:true;
                this.setAttribute("inverse",me.sortingOpt_Active.inverse);
                me.browser.items.reverse();
                me.DOM.listItems = me.DOM.listItemGroup.selectAll("div.listItem")
                    .data(me.browser.items, function(d){ return d.id(); })
                    .order();
                me.updateVisibleIndex();
                me.maxVisibleItems = me.maxVisibleItems_Default;
                me.updateItemVisibility(false,true);
                kshf.Util.scrollToPos_do(me.DOM.listItemGroup[0][0],0);
                if(sendLog) sendLog(kshf.LOG.LIST_SORT_INV);
            })
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: 'w', title: function(){ return "Reverse order"; }
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(){ this.tipsy.hide(); });
    },
    insertHeaderLinkedItems: function(){
        var me=this;
        if(this.hasLinkedItems){
            var x = this.DOM.listHeader_BottomRow.append("span").attr("class","headerLinkStateColumn")
            x.append("span").attr("class","linkTitleText").text(this.linkText);
            var y =x.append("span").attr("class","linkAll")
                .each(function(d){
                    this.tipsy = new Tipsy(this, {
                        gravity: 'n',
                        title: function(){ return "<span class='action'><span class='fa fa-link'></span> Show</span> <br>"
                            +me.linkText+"<br> all results"; }
                    })
                })
                .on("mouseover",function(){ this.tipsy.show(); })
                .on("mouseout",function(d,i){ this.tipsy.hide(); })
                .on("click",function(){
                    var linkedFacet = me.browser.linkedFacets[0];
                    linkedFacet.summaryFilter.linkFilterSummary = me.browser.getFilterSummary();

                    me.browser.clearFilters_All(false);

                    var filter = linkedFacet.summaryFilter.selected_OR;
                    me.browser.items.forEach(function(item){
                        if(item.isWanted) {
                            item.setSelectedForLink(true);
                            item.set_OR(filter);
                        } else {
                            item.set_NONE();
                        }
                    });
                    linkedFacet.updateSorting(0);
                    linkedFacet._update_Selected();
                    linkedFacet.summaryFilter.how="All";
                    linkedFacet.summaryFilter.addFilter(true);

                    // delay layout height update
                    setTimeout( function(){ me.browser.updateLayout_Height();}, 1000);
                });

            y.append("span").attr("class","fa fa-link");
            y.append("span").attr("class","headerLinkColumnAllResults").html(" All <i class='fa fa-hand-o-down'></i>");
        }
    },
    /** Insert items into the UI, called once on load */
    insertItems: function(){
        var me = this;

        this.DOM.listItems = this.DOM.listItemGroup.selectAll("div.listItem")
            .data(this.browser.items, function(d){ return d.id(); })
        .enter()
            .append("div")
            .attr("class","listItem")
            .attr("details","false")
            .attr("highlight",false)
            .attr("animSt","visible")
            .attr("itemID",function(d){return d.id();}) // can be used to apply custom CSS
            // store the link to DOM in the data item
            .each(function(d){ d.DOM.result = this; })
            .on("mouseenter",function(d,i){
                d.highlightAll(true);
                
                d.items.forEach(function(item){
                    item.highlightAll(false);
                });
                
                if(me.hasLinkedItems){
                    d.DOM.result.setAttribute("selectedForLink",true);
                    // update result previews
                    d.items.forEach(function(item){item.updatePreview();});
                    me.browser.itemCount_Previewed = d.items.length;
                    me.browser.refreshResultPreviews();
                }
            })
            .on("mouseleave",function(d,i){
                d3.select(this).attr("highlight","false");
                // find all the things that  ....
                d.nohighlightAll(true);
                d.items.forEach(function(item){
                    item.nohighlightAll(false);
                })
                // update result previews
                if(me.hasLinkedItems){
                    d.DOM.result.setAttribute("selectedForLink",false);
                    me.browser.clearResultPreviews();
                }
            });            

        if(this.hasLinkedItems){
            this.DOM.listItems.attr("selectedForLink","false")
        }
        if(this.displayType==='list'){
            this.insertItemSortColumn();
        }
        if(this.detailsToggle!=="off"){
            this.insertItemToggleDetails();
        }
        this.DOM.listItems_Content = this.DOM.listItems.append("div").attr("class","content")
            .html(me.recordView);

        if(this.hasLinkedItems){
            this.DOM.itemLinkStateColumn = this.DOM.listItems.append("span").attr("class","itemLinkStateColumn")
                    .style("width",this.selectColumnWidth+"px");
            this.DOM.itemLinkStateColumn.append("span").attr("class","itemLinkIcon fa fa-link")
                .each(function(d){
                    this.tipsy = new Tipsy(this, {
                        gravity: 'n',
                        title: function(){ return "<span class='action'>Show</span> "+me.linkText +" <i class='fa fa-hand-o-left'></i> this"; }
                    })
                })
                .on("mouseenter",function(){ this.tipsy.show(); })
                .on("mouseout",function(d,i){ this.tipsy.hide(); })
                .on("click",function(d){
                    this.tipsy.hide();
                    // unselect all other items
                    me.browser.items.forEach(function(item){
                        item.setSelectedForLink(false);
                    });
                    d.setSelectedForLink(true);
                    me.browser.clearFilters_All(false);
                    me.browser.linkedFacets.forEach(function(f){
                        f.selectAllAttribsButton();
                        f.updateSorting(0);
                    });
                    // delay layout height update
                    setTimeout( function(){ me.browser.updateLayout_Height();}, 1000);
                });

            this.DOM.itemLinkStateColumn_Count = this.DOM.itemLinkStateColumn.append("span")
                .attr("class","measureLabel").text(function(d){return d.aggregate_Active;});

            if(this.showSelectBox){
                this.DOM.itemLinkStateColumn.append("i").attr("class","itemSelectCheckbox")
                    .each(function(d){
                        this.tipsy = new Tipsy(this, {
                            gravity: 'n',
                            title: function(){ return "<span class='action'>Select</span> item"; }
                        })
                    })
                    .on("mouseenter",function(){ this.tipsy.show(); })
                    .on("mouseout",function(d,i){ this.tipsy.hide(); })
                    .on("click",function(d){
                        this.tipsy.hide();
                        d.setSelectedForLink(!d.selectedForLink);
                        me.browser.linkedFacets.forEach(function(f){
                            f.updateSorting(0);
                        });
                        me.browser.updateLayout_Height();
                    });
            }
        }
    },
    /** Insert sort column into list items */
    insertItemSortColumn: function(){
        var me=this;
        this.DOM.listsortcolumn = this.DOM.listItems.append("div").attr("class","listsortcolumn")
            .each(function(d){ this.columnValue = me.sortingOpt_Active.label(d); })
            ;
        this.DOM.listsortcolumn_label = this.DOM.listsortcolumn.append("span").attr("class","columnLabel")
            .html(function(d){ return me.sortingOpt_Active.label(d); })
            ;
        if(this.showRank){
            this.DOM.ranks = this.DOM.listsortcolumn.append("span").attr("class","itemRank");
        }
    },
    /** -- */
    insertItemToggleDetails: function(){
        var me=this;
        if(this.detailsToggle==="one" && this.displayType==='list'){
            this.DOM.listItems.append("div")
                .attr("class","itemToggleDetails")
                .each(function(d){
                    this.tipsy = new Tipsy(this, {
                        gravity:'s',
                        title: function(){ return d.showDetails===true?"Show less":"Show more"; }
                    });
                })
            .append("span").attr("class","item_details_toggle fa fa-chevron-down")
                .on("click", function(d){ 
                    if(d.showDetails===true){
                        me.hideListItemDetails(d);
                    } else {
                        me.showListItemDetails(d);
                    }
                    this.parentNode.tipsy.hide();
                })
                .on("mouseover",function(d){ this.parentNode.tipsy.show(); })
                .on("mouseout",function(d){ this.parentNode.tipsy.hide(); });
        }
        if(this.detailsToggle==="zoom"){
            this.DOM.listItems.append("div")
                .attr("class","itemToggleDetails")
                .each(function(d){
                    this.tipsy = new Tipsy(this, {
                        gravity:'s',
                        title: function(){ return "Get more info"; }
                    });
                })
            .append("span").attr("class","item_details_toggle fa fa-bullseye")
                .on("click", function(d){
                    this.parentNode.tipsy.hide();
                    me.browser.updateItemZoomText(d);
/*
                    var mousePos = d3.mouse(me.browser.DOM.root[0][0]);
//                    mousePos[0] = me.browser.DOM.root[0][0].offsetWidth - mousePos[0];
                    var origin=mousePos[0]+"px "+mousePos[1]+"px";
                    var dom=me.browser.DOM.infobox_itemZoom[0][0];
                    dom.style.webkitTransformOrigin = origin;
                    dom.style.MozTransformOrigin = origin;
                    dom.style.msTransformOrigin = origin;
                    dom.style.OTransformOrigin = origin;
                    dom.style.transformOrigin = origin;
*/
                    me.browser.layout_infobox.attr("show","itemZoom");
                })
                .on("mouseover",function(d){ this.parentNode.tipsy.show(); })
                .on("mouseout",function(d){ this.parentNode.tipsy.hide(); });
        }
    },
    /** -- */
    hideListItemDetails: function(item){
        item.DOM.result.setAttribute('details', false);
        item.showDetails=false;
        if(sendLog) sendLog(kshf.LOG.ITEM_DETAIL_OFF, {info:item.id()});
    },
    /** -- */
    showListItemDetails: function(item){
        item.DOM.result.setAttribute('details', true);
        item.showDetails=true;
        if(this.detailCb) this.detailCb.call(this, item);
        if(sendLog) sendLog(kshf.LOG.ITEM_DETAIL_ON,{info:item.id()});
    },
    /** --- */
    insertFilterClearAll: function(){
        var me=this;
        this.DOM.filterClearAll = this.DOM.listHeader_TopRow.append("span").attr("class","filterClearAll")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n',
                    title: function(){ 
                        return "<span class='action'>Remove</span> all filters";
                    }
                })
            })
            .on("mouseenter",function(){
                this.tipsy.show();
                d3.event.stopPropagation();
            })
            .on("mouseleave",function(d,i){
                this.tipsy.hide();
                d3.event.stopPropagation();
            })
            .on("click",function(){ 
                this.tipsy.hide();
                me.browser.clearFilters_All();
            })
            ;
        this.DOM.filterClearAll.append("span").attr("class","title").text("Clear");
        this.DOM.filterClearAll.append("div").attr("class","chartClearFilterButton allFilter")
            .append("span").attr("class","fa fa-times")
            ;
    },
    /** -- */
    showMore: function(){
        this.maxVisibleItems *= 2;
        this.updateItemVisibility(true);
        this.DOM.showMore.style("bottom","-27px"); // hide panel
        if(sendLog) sendLog(kshf.LOG.LIST_SHOWMORE,{info: this.maxVisibleItems});
    },
    /** Reorders items in the DOM
     *  Only called after list is re-sorted (not called after filtering)
     */
    reorderItemsOnDOM: function(){
        this.sortItems();
        this.DOM.listItems = this.DOM.listItemGroup.selectAll("div.listItem")
            .data(this.browser.items, function(d){ return d.id(); })
            .order();
    },
    /** Sort all items given the active sort option 
     *  List items are only sorted on list init and when sorting options change.
     *  They are not resorted on filtering! In other words, filtering does not affect item sorting.
     */
    sortItems: function(){
        var sortValueFunc = this.sortingOpt_Active.value;
        var sortFunc = this.sortingOpt_Active.func;
        var inverse = this.sortingOpt_Active.inverse;
        this.browser.items.sort(
            function(a,b){
                // Put unwanted data to later
                // Don't. Then, when you change result set, you'd need to re-order
                var v_a = sortValueFunc(a);
                var v_b = sortValueFunc(b);
                
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
        var sortValueType_, sortValueType_temp, same;
        
        // find appropriate sortvalue type
        for(var k=0, same=0; true ; k++){
            if(same===3 || k===this.browser.items.length){
                sortValueType_ = sortValueType_temp;
                break;
            }
            var item = this.browser.items[k];
            var f = sortValueFunc(item);
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

            if(sortValueType_temp2===sortValueType_temp){
                same++;
            } else {
                sortValueType_temp = sortValueType_temp2;
                same=0;
            }
        }
        return sortValueType_;
    },
    /** Updates visibility of list items */
    updateItemVisibility: function(showMoreOnly, noAnimation){
        var me = this;
        var visibleItemCount=0;

        this.DOM.listItems.each(function(item){
            var domItem = this;

            var isVisible     = (item.visibleOrder>=0) && (item.visibleOrder<me.maxVisibleItems);
            var isVisible_pre = (item.visibleOrder_pre>=0) && (item.visibleOrder_pre<me.maxVisibleItems);
            if(isVisible) {
                visibleItemCount++;
                if(me.visibleCb) me.visibleCb.call(this,item);
            }

            if(showMoreOnly){
                domItem.style.display = isVisible?'':'none';
                domItem.setAttribute("animSt","visible");
                return;
            }

            if(noAnimation){
                if(isVisible && !isVisible_pre){
                    domItem.style.display = '';
                    domItem.setAttribute("animSt","visible");
                }
                if(!isVisible && isVisible_pre){
                    domItem.setAttribute("animSt","closed");
                    domItem.style.display = 'none';
                }
                return;
            }

            // NOTE: Max 100 items can be under animation (visibility change), so don't worry about performance!

            if(isVisible && !isVisible_pre){
                domItem.setAttribute("animSt","closed"); // start from closed state
                setTimeout(function(){ 
                    domItem.style.display = '';
                    domItem.setAttribute("animSt","open");
                },500);
                setTimeout(function(){ 
                    domItem.setAttribute("animSt","visible");
                },1100+item.visibleOrder*10);
            }
            if(!isVisible && isVisible_pre){
                // not in view now, but in view before
                setTimeout(function(){ 
                    domItem.setAttribute("animSt","open");
                },-item.visibleOrder*10);
                setTimeout(function(){ 
                    domItem.setAttribute("animSt","closed");
                },500);
                setTimeout(function(){
                    domItem.style.display = 'none';
                },1000);
            }
        });

        var hiddenItemCount = this.browser.itemsWantedCount-visibleItemCount;
        this.DOM.showMore.style("display",(hiddenItemCount===0)?"none":"block");
        this.DOM.showMore.select(".CountAbove").html("&#x25B2;"+visibleItemCount+" shown");
        this.DOM.showMore.select(".CountBelow").html(hiddenItemCount+" below&#x25BC;");
    },
    /** -- */
    updateContentWidth: function(contentWidth){
        contentWidth-=4; // 2*2 border left&right
        contentWidth-=this.browser.scrollWidth; // assume scroll is displayed
        this.DOM.showMore.style("width",(contentWidth-5)+"px");
    },
    updateAfterFiltering_do:function(){
        this.updateVisibleIndex();
        this.maxVisibleItems = this.maxVisibleItems_Default;
        this.updateItemVisibility(false);
    },
    /** -- */
    updateAfterFilter: function(){
        var me=this;
        if(this.scrollTop_cache===0 && false){
            me.updateAfterFiltering_do();
            return;
        }
        // scroll to top
        var startTime = null;
        var scrollDom = this.DOM.listItemGroup[0][0];
        var scrollInit = scrollDom.scrollTop;
        var easeFunc = d3.ease('cubic-in-out');
        var scrollTime = 1000;
        var animateToTop = function(timestamp){
            var progress;
            if(startTime===null) startTime = timestamp;
            // complete animation in 500 ms
            progress = (timestamp - startTime)/scrollTime;
            scrollDom.scrollTop = (1-easeFunc(progress))*scrollInit;
            if(scrollDom.scrollTop===0){
                me.updateAfterFiltering_do();
            } else {
                window.requestAnimationFrame(animateToTop);
            }
        };
        window.requestAnimationFrame(animateToTop);
    },
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
        },this);

        if(this.showRank){
            this.DOM.ranks.text(function(d){ return "#"+(d.visibleOrder+1);});
        }
    }
};

kshf.Panel = function(options){
    this.browser = options.browser;
    this.DOM = {};
    this.DOM.root = options.parentDOM.append("div").attr("class", "layout_block layout_"+options.name);
    this.name = options.name;
    this.width={};
    this.width.catLabel = options.widthCatLabel;
    this.width.catChart = 0;
    this.width.catQueryPreview = 1;
    this.summaries = [];
    this.insertDropZone();
};

kshf.Panel.prototype = {
    /** -- */
    getWidth_Total: function(){
        if(this.name==="bottom") return this.browser.getWidth_Total();
        return this.width.catLabel + this.width.catQueryPreview + this.width.catChart + this.browser.scrollWidth;
    },
    /** -- */
    addSummary: function(summary){
        this.summaries.push(summary);
        this.DOM.dropZone.attr("asblock",true).style("background-color","");
        this.updateWidth_QueryPreview();
        this.setupAdjustWidth();
    },
    /** -- */
    removeSummary: function(summary){
        var indexFrom = -1;
        this.summaries.forEach(function(s,i){
            if(s===summary) indexFrom = i;
        });
        if(indexFrom===-1) return; // given summary is not within this panel
        this.summaries.splice(indexFrom,1);
        if(this.summaries.length===0) this.DOM.dropZone.attr("asblock",false);
        this.updateWidth_QueryPreview();
        summary.panel = undefined;
        this.setupAdjustWidth();
    },
    /** -- */
    insertDropZone: function(dom){
        var me=this;
        this.DOM.dropZone = this.DOM.root.append("div").attr("class","dropZone")
            .attr("draggable",true);

        this.DOM.dropZone.append("div").attr("class","dropIcon fa fa-toggle-down")

        this.DOM.dropZone[0][0].addEventListener("dragenter", function( event ) {
            this.style.backgroundColor = "rgba(255, 69, 0, 0.3)";;
            event.preventDefault();
        });
        this.DOM.dropZone[0][0].addEventListener("dragleave", function( event ) {
            this.style.backgroundColor = "";
            event.preventDefault();
        });
        this.DOM.dropZone[0][0].addEventListener("dragover", function( event ) {
            event.preventDefault();
        });
        this.DOM.dropZone[0][0].addEventListener("drop", function( event ) {
            this.style.backgroundColor = "";
            var info=event.dataTransfer.getData("text/info");
            if(info==="new_summary"){
                var attributeName = event.dataTransfer.getData("text/plain");

                var summary = me.browser.summaries_by_name[attributeName];
                summary.addToPanel(me);

                if(summary.DOM.root===undefined) summary.initDOM();
                if(summary.type==='categorical'){
                    summary.updateBarPreviewScale2Active();
                }
                summary.refreshWidth();
                me.browser.updateLayout();
            }
            if(info==="xfer_summary"){
                var movedSummary = draggedTarget.__data__;
                movedSummary.addToPanel(me);

                if(movedSummary.type=="categorical"){
                    movedSummary.refreshLabelWidth();
                    movedSummary.updateBarPreviewScale2Active();
                }
                movedSummary.refreshWidth();

                me.browser.updateLayout();
            }
            event.preventDefault();
        });
    },
    /** -- */
    setupAdjustWidth: function(){
        var me=this;
        var root = this.browser.DOM.root;
        if(this.name==='middle' || this.name==='bottom') return; // cannot have adjust handles for now
        if(this.summaries.length===0){
            if(this.DOM.panelAdjustWidth){
                this.DOM.root[0][0].removeChild(this.DOM.panelAdjustWidth[0][0]);
                this.DOM.panelAdjustWidth = undefined;
            }
        } else {
            if(this.DOM.panelAdjustWidth) return;
            this.DOM.panelAdjustWidth = this.DOM.root.append("span")
                .attr("class","panelAdjustWidth")
                .attr("title","Drag to adjust panel width")
                .on("mousedown", function (d, i) {
                    if(d3.event.which !== 1) return; // only respond to left-click
                    root.style('cursor','ew-resize');
                    me.browser.setNoAnim(true);
                    var mouseDown_x = d3.mouse(document.body)[0];
                    var mouseDown_width = me.width.catChart;
                    root.on("mousemove", function() {
                        var mouseMove_x = d3.mouse(document.body)[0];
                        var mouseDif = mouseMove_x-mouseDown_x;
                        if(me.name==='right') mouseDif *= -1;
                        var oldhideBarAxis = me.hideBarAxis;
                        me.setWidthCatChart(mouseDown_width+mouseDif);
                        if(me.hideBarAxis!==oldhideBarAxis){
                            me.browser.updateLayout_Height();
                        }
                        // TODO: Adjust other panel widths
                    }).on("mouseup", function(){
                        root.style('cursor','default');
                        me.browser.setNoAnim(false);
                        // unregister mouse-move callbacks
                        root.on("mousemove", null).on("mouseup", null);
                    });
                    d3.event.preventDefault();
                })
                .on("click",function(){
                    d3.event.stopPropagation();
                    d3.event.preventDefault();
                });
        }
    },
    /** -- */
    setTotalWidth: function(_w_){
        this.width.catChart = _w_-this.width.catLabel-this.width.catQueryPreview-this.browser.scrollWidth;
    },
    /** -- */
    setWidthCatChart: function(_w_){
        if(_w_>200) {
            this.hideBars = false;
            this.hideBarAxis = false;
        } else if(_w_>45){
            this.hideBars = false;
            this.hideBarAxis = false;
        } else if(_w_>10){
            this.hideBars = false;
            this.hideBarAxis = true;
        } else {
            this.hideBars = true;
            this.hideBarAxis = true;
            _w_ = 0; // collapse to 0
        }
        if(this.forceHideBarAxis===true){
            this.hideBarAxis = true;
        }
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

        this.width.catChart = _w_;

        this.updateSummariesWidth();
        if(this.name!=="middle")
            this.browser.updateMiddlePanelWidth();
    },
    /** --- */
    updateSummariesWidth: function(){
        this.summaries.forEach(function(summary){
            if(summary.hasAttribs && summary.hasAttribs()){
                summary.updateBarPreviewScale2Active();
            }
            summary.refreshWidth();
        },this);
    },
    /** --- */
    updateWidth_QueryPreview: function(){
        var maxTotalCount = d3.max(this.summaries, function(summary){
            if(summary.getMaxAggregate_Total===undefined) return 0;
            return summary.getMaxAggregate_Total();
        });

        var oldPreviewWidth = this.width.catQueryPreview;

        this.width.catQueryPreview = 13;
        var digits = 1;
        while(maxTotalCount>9){
            digits++;
            maxTotalCount = Math.floor(maxTotalCount/10);
        }
        if(digits>3) {
            digits = 3;
            this.width.catQueryPreview+=4; // "." character is used to split. It takes some space
        }
        this.width.catQueryPreview += digits*6;

        if(oldPreviewWidth!==this.width.catQueryPreview){
            this.summaries.forEach(function(summary){
                if(summary.refreshLabelWidth){
                    summary.refreshLabelWidth();
                }
            });
        }
    }
};

/**
 * @constructor
 */
kshf.Browser = function(options){
    var me = this;
    this.options = options;

    // BASIC OPTIONS
    this.summaries = [];
    this.summaries_by_name = {};
    this.panels = {};

    this.linkedFacets = [];
    this.maxFilterID = 0;

    this.scrollWidth = 21;
    this.filterList = [];
    this.pauseResultPreview = false;

    this.resultPreviewActive = false;

    this._previewCompare_Active = false;

    this.ratioModeActive = false;
    this.percentModeActive = false;
//    this._percentView_Timeout_Set = null;
//    this._percentView_Timeout_Clear = null;

    this.listDef = options.itemDisplay;
    if(options.list) this.listDef = options.list;

    if(options.listMaxColWidthMult){
        this.listMaxColWidthMult = options.listMaxColWidthMult;
    } else {
        this.listMaxColWidthMult = 0.25;
    }

    this.domID = options.domID;
    this.source = options.source;
    this.source.loadedTableCount=0;
    this.loadedCb = options.loadedCb;
    this.readyCb = options.readyCb;
    this.updateCb = options.updateCb;
    this.previewCb = options.previewCb;
    this.previewCompareCb = options.previewCompareCb;
    this.ratioModeCb = options.ratioModeCb;

    this.DOM = {};

    this.itemName = options.itemName || "";

    // primItemCatValue
    this.primItemCatValue = null;
    if(typeof options.catValue === 'string'){ this.primItemCatValue = options.catValue; }
    // showDataSource
    this.showDataSource = true;
    if(options.showDataSource!==undefined) this.showDataSource = options.showDataSource;
    // forceHideBarAxis
    this.forceHideBarAxis = false;
    if(options.forceHideBarAxis!==undefined) this.forceHideBarAxis = options.forceHideBarAxis;

    this.DOM.root = d3.select(this.domID)
        .classed("kshf",true)
        .attr("percentview",false)
        .attr("noanim",false)
        .attr("ratiomode",false)
        .attr("showdropzone",false)
        .attr("previewcompare",false)
        .attr("resultpreview",false)
        .style("position","relative")
        //.style("overflow-y","hidden")
        .on("mousemove",function(d){
            if(typeof logIf === "object"){
                logIf.setSessionID();
            }
        })
        ;
    this.noAnim=false;

    // remove any DOM elements under this domID, kshf takes complete control over what's inside
    var rootDomNode = this.DOM.root[0][0];
    while (rootDomNode.hasChildNodes()) rootDomNode.removeChild(rootDomNode.lastChild);

    if(options.showResizeCorner === true) this.insertResize();
    this.insertInfobox();

    this.DOM.panelsTop=this.DOM.root.append("div").attr("class","panels_Above");


    this.panels.left = new kshf.Panel({
        widthCatLabel : options.leftPanelLabelWidth  || options.categoryTextWidth || 115,
        browser: this,
        name: 'left',
        parentDOM: this.DOM.panelsTop
    });

    var asdasds=this.DOM.panelsTop.append("div").attr("class","middleStuff");

    this.layoutList = asdasds.append("div").attr("class", "layout_block listDiv")

    this.panels.middle = new kshf.Panel({
        widthCatLabel : options.middlePanelLabelWidth  || options.categoryTextWidth || 115,
        browser: this,
        name: 'middle',
        parentDOM: asdasds
    });
    this.panels.right = new kshf.Panel({
        widthCatLabel : options.rightPanelLabelWidth  || options.categoryTextWidth || 115,
        browser: this,
        name: 'right',
        parentDOM: this.DOM.panelsTop
    });
    this.panels.bottom = new kshf.Panel({
        widthCatLabel : options.categoryTextWidth || 115,
        browser: this,
        name: 'bottom',
        parentDOM: this.DOM.root
    });

    this.DOM.attributeList = this.DOM.root.append("div").attr("class","attributeList");
    this.DOM.attributeList.append("div").attr("class","attributeListHeader").text("Available attributes");

    this.DOM.root.selectAll(".layout_block").on("mouseleave",function(){
        setTimeout( function(){ me.updateLayout_Height(); }, 1500); // update layout after 1.75 seconds
    });

    window.setTimeout(function() { me.loadSource(); }, 50);
};

kshf.Browser.prototype = {
    /** -- */
    setNoAnim: function(v){
        if(v===this.noAnim) return;
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
    },
    /** -- */
    getPrimaryItems: function(){
        return kshf.dt[this.primaryTableName];
    },
    getTypeFromAttribFunc: function(attribFunc){
        var type = null;
        this.getPrimaryItems().some(function(item,i){
            var item=attribFunc(item);
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
            func = function(d){ return d.data[x]; }
        }
        // Check type before you instantiate the summary!
        var attribFunc=func || function(d){ return d.data[name]; }
        
        if(type===undefined){
            type = this.getTypeFromAttribFunc(attribFunc);
        }
        if(type===null){
            console.log("Summary data type could not be detected for name:"+name);
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
        return summary;
    },
    /** -- */
    changeSummaryName: function(curName,newName){
        if(curName===newName) return;
        var summary = this.summaries_by_name[curName];
        if(summary===undefined){
            alert("The given summary name is not there. Try again");
            return;
        }
        if(this.summaries_by_name[newName]!==undefined){
            if(newName!==this.summaries_by_name[newName].summaryColumn){
                alert("The new summary name is already used. It must be unique. Try again");
                return;
            }
        }
        // remove the indexing using oldName IFF the old name was not original column name
        if(curName!==summary.summaryColumn){
            delete this.summaries_by_name[curName];
        }
        this.summaries_by_name[newName] = summary;
        summary.summaryName = newName;
        if(summary.DOM.summaryTitle_text)
            summary.DOM.summaryTitle_text.text(summary.summaryName);
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
        // see if it has been created before TODO
        var newFilter = new kshf.Filter(this.maxFilterID,opts);
        ++this.maxFilterID;
        this.filterList.push(newFilter);
        return newFilter;
    },
    /** -- */
    insertResize: function(){
        var me=this;
        this.DOM.root.append("div").attr("class", "layout_block layout_resize")
            .on("mousedown", function (d, i) {
                me.DOM.root.style('cursor','nwse-resize');
                me.setNoAnim(true);
                var mouseDown_x = d3.mouse(d3.select("body")[0][0])[0];
                var mouseDown_y = d3.mouse(d3.select("body")[0][0])[1];
                var mouseDown_width  = parseInt(d3.select(this.parentNode).style("width"));
                var mouseDown_height = parseInt(d3.select(this.parentNode).style("height"));
                d3.select("body").on("mousemove", function() {
                    var mouseDown_x_diff = d3.mouse(d3.select("body")[0][0])[0]-mouseDown_x;
                    var mouseDown_y_diff = d3.mouse(d3.select("body")[0][0])[1]-mouseDown_y;
                    d3.select(me.domID).style("height",(mouseDown_height+mouseDown_y_diff)+"px");
                    d3.select(me.domID).style("width" ,(mouseDown_width +mouseDown_x_diff)+"px");
                    me.updateLayout();
                }).on("mouseup", function(){
                    if(sendLog) sendLog(kshf.LOG.RESIZE);
                    me.DOM.root.style('cursor','default');
                    me.setNoAnim(false);
                    // unregister mouse-move callbacks
                    d3.select("body").on("mousemove", null).on("mouseup", null);
                });
               d3.event.preventDefault();
           });
    },
    /* -- */
    insertInfobox: function(){
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
        creditString += " 3rd party libraries and APIs:<br/>";
        creditString += " <a href='http://d3js.org/' target='_blank'>D3</a> -";
        creditString += " <a href='http://jquery.com' target='_blank'>JQuery</a> -";
        creditString += " <a href='https://developers.google.com/chart/' target='_blank'>GoogleDocs</a>";
        creditString += "</div><br/>";
        creditString += "";
        creditString += "<div align='center' class='project_fund'>";
        creditString += "Keshif (<a target='_blank' href='http://translate.google.com/#auto/en/ke%C5%9Fif'><i>keşif</i></a>) means discovery / exploration in Turkish.<br/>";
        creditString += "Funded in part by <a href='http://www.huawei.com'>Huawei</a>. </div>";
        creditString += "";

        this.layout_infobox = this.DOM.root.append("div").attr("class", "layout_block layout_infobox").attr("show","loading");
        this.layout_infobox.append("div").attr("class","background")
            .on("click",function(){
                me.layout_infobox.attr("show","none");
            })
            ;
        this.DOM.loadingBox = this.layout_infobox.append("div").attr("class","infobox_content infobox_loading");
//        this.DOM.loadingBox.append("span").attr("class","fa fa-spinner fa-spin");
        var ssdsd = this.DOM.loadingBox.append("span").attr("class","loadinggg");
        ssdsd.append("span").attr("class","loading_dots loading_dots_1").attr("anim",true);
        ssdsd.append("span").attr("class","loading_dots loading_dots_2").attr("anim",true);
        ssdsd.append("span").attr("class","loading_dots loading_dots_3").attr("anim",true);

        var hmmm=this.DOM.loadingBox.append("div").attr("class","status_text");
        hmmm.append("span").attr("class","status_text_sub info").text("Loading data sources...");
        hmmm.append("span").attr("class","status_text_sub dynamic")
            .text(
                (this.source.sheets!==undefined)?
                "("+this.source.loadedTableCount+"/"+this.source.sheets.length+")":""
                );

        var infobox_credit = this.layout_infobox.append("div").attr("class","infobox_content infobox_credit");
        infobox_credit.append("div").attr("class","infobox_close_button")
            .on("click",function(){
                me.layout_infobox.attr("show","none");
            })
            .append("span").attr("class","fa fa-times");
        infobox_credit.append("div").attr("class","all-the-credits").html(creditString);

        this.DOM.infobox_itemZoom = this.layout_infobox.append("span").attr("class","infobox_content infobox_itemZoom");

        this.DOM.infobox_itemZoom.append("div").attr("class","infobox_close_button")
            .on("click",function(){
                me.layout_infobox.attr("show","none");
            })
            .append("span").attr("class","fa fa-times");

        this.DOM.infobox_itemZoom_content = this.DOM.infobox_itemZoom.append("span").attr("class","content");
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
//        this.DOM.infobox_itemZoom_content.html(item.data.toString());
    },
    /** -- */
    showAttributes: function(){
        if(this.attribsShown){
            this.DOM.root.style("left","0px");
            this.DOM.attributeList.style("display","none");
            this.attribsShown = false;
            return;
        }
        this.attribsShown = true;
        this.DOM.root.style("left","120px").style("position","relative");
        this.DOM.attributeList.style("display","block");
    },
    /** -- */
    showInfoBox: function(){
        this.layout_infobox.attr("show","credit");
        if(sendLog) sendLog(kshf.LOG.INFOBOX);
    },
    /** -- */
    loadSource: function(){
        if(this.source.sheets){
            this.source.sheets[0].primary = true;
            this.primaryTableName = this.source.sheets[0].name;
            this.source.sheets.forEach(function(sheet){
                if(sheet.id===undefined) sheet.id="id"; // set id column
                if(sheet.tableName===undefined) sheet.tableName = sheet.name; // set table name
                // if this table name has been loaded, skip this one
                if(kshf.dt[sheet.tableName]!==undefined){
                    this.incrementLoadedSheetCount();
                    return;
                }
                if(this.source.gdocId){
                    if(this.source.url===undefined)
                        this.source.url = "https://docs.google.com/spreadsheet/ccc?key="+this.source.gdocId;
                    this.loadSheet_Google(sheet);
                } else if(this.source.dirPath){
                    this.loadSheet_File(sheet);
                }
            },this);
        } else {
            if(this.source.callback){
                this.source.callback(this);
            }
        }
    },
    loadSheet_Google: function(sheet){
        var me=this;
        var headers=1;
        if(sheet.headers){
            headers = sheet.headers;
        }
        var qString=kshf.queryURL_base+this.source.gdocId+'&headers='+headers;
        if(sheet.sheetID){
            qString+='&gid='+sheet.sheetID;
        } else {
            qString+='&sheet='+sheet.name;
        }
        if(sheet.range){
            qString+="&range="+sheet.range;
        }

        var googleQuery=new google.visualization.Query(qString);
        if(sheet.query) googleQuery.setQuery(sheet.query);

        googleQuery.send( function(response){
            if(kshf.dt[sheet.tableName]!==undefined){
                me.incrementLoadedSheetCount();
                return;
            }
            if(response.isError()) {
                me.layout_infobox.select("div.status_text .info")
                    .text("Cannot load data");
                me.layout_infobox.select("span.loadinggg").selectAll("span").remove();
                me.layout_infobox.select("span.loadinggg").append('i').attr("class","fa fa-warning");
                me.layout_infobox.select("div.status_text .dynamic")
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
    /** The only place where jquery ajax load is used! */
    loadSheet_File: function(sheet){
        var me=this;
        var fileName=this.source.dirPath+sheet.name+"."+this.source.fileType;
        $.ajax({
            url: fileName,
            type: "GET",
            async: (me.source.callback===undefined)?true:false,
            contentType: "text/csv",
            success: function(data) {
                // if data is already loaded, nothing else to do...
                if(kshf.dt[sheet.tableName]!==undefined){
                    me.incrementLoadedSheetCount();
                    return;
                }
                var arr = [];
                var idColumn = sheet.id;

                var config = {};
                config.dynamicTyping = true;
                config.header = true; // header setting can be turned off
                if(sheet.header===false) config.header = false;
                if(sheet.preview!==undefined) config.preview = sheet.preview;
                if(sheet.fastMode!==undefined) config.fastMode = sheet.fastMode;
                if(sheet.dynamicTyping!==undefined) config.dynamicTyping = sheet.dynamicTyping;

                var parsedData = Papa.parse(data, config);

                parsedData.data.forEach(function(row,i){
                    if(row[idColumn]===undefined) row[idColumn] = i;
                    arr.push(new kshf.Item(row,idColumn));
                })

                me.finishDataLoad(sheet, arr);
            }
        });
    },
    /** -- */
    createTableFromTable: function(srcItems, dstTableName, summaryFunc, labelFunc){
        var i;
        var me=this;
        kshf.dt_id[dstTableName] = {};
        kshf.dt[dstTableName] = [];
        var dstTable_Id = kshf.dt_id[dstTableName];
        var dstTable = kshf.dt[dstTableName];

        var hasString = false;

        srcItems.forEach(function(srcData_i){
            var mapping = summaryFunc(srcData_i);
            if(mapping==="" || mapping===undefined || mapping===null) return;
            if(mapping instanceof Array) {
                mapping.forEach(function(v2){
                    if(v2==="" || v2===undefined || v2===null) return;
                    if(!dstTable_Id[v2]){
                        if(typeof(v2)==="string") hasString=true;
                        var itemData = [v2];
                        var item = new kshf.Item(itemData,0);
                        if(labelFunc){
                            itemData.push(labelFunc(item));
                        }
                        dstTable_Id[v2] = item;
                        dstTable.push(item);
                    }   
                });
            } else {
                if(!dstTable_Id[mapping]){
                    if(typeof(mapping)==="string") hasString=true;
                    var itemData = [mapping];
                    var item = new kshf.Item(itemData,0);
                    if(labelFunc){
                        itemData.push(labelFunc(item));
                    }
                    dstTable_Id[mapping] = item;
                    dstTable.push(item);
                }   
            }
        });

        // If any of the table values are string, convert all to string
        if(hasString){
            dstTable.forEach(function(item){
                item.data[0] = ""+item.data[0];
            })
        }
    },
    /** -- */
    finishDataLoad: function(sheet,arr) {
        kshf.dt[sheet.name] = arr;
        var id_table = {};
        arr.forEach(function(r){id_table[r.id()] = r;});
        kshf.dt_id[sheet.tableName] = id_table;
        this.incrementLoadedSheetCount();
    },
    /** -- */
    incrementLoadedSheetCount: function(){
        var me=this;
        this.source.loadedTableCount++;
        this.layout_infobox.select("div.status_text .dynamic")
            .text("("+this.source.loadedTableCount+"/"+this.source.sheets.length+")");
            // finish loading
        if(this.source.loadedTableCount===this.source.sheets.length) {
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
            this.itemName=this.primaryTableName;
        }

        var me=this;
        this.layout_infobox.select("div.status_text .info").text("Creating browser...");
        this.layout_infobox.select("div.status_text .dynamic").text("");
        window.setTimeout(function(){ me._loadCharts(); }, 100);
    },
    /** -- */
    _loadCharts: function(){
        var me=this;

        if(this.loadedCb!==undefined) this.loadedCb.call(this);

        for(var column in this.getPrimaryItems()[0].data){
            if(typeof(column)==="string") this.createSummary(column);
        }

        if(this.options.summaries) this.options.facets = this.options.summaries;

        this.options.facets.forEach(function(facetDescr){
            if(facetDescr.catLabelText||facetDescr.catTooltipText||facetDescr.catTableName||facetDescr.sortingOpts){
                facetDescr.type="categorical";
            } else if(facetDescr.intervalScale || facetDescr.showPercentile || facetDescr.unitName ){
                facetDescr.type="interval";
            }

            var summary = this.summaries_by_name[facetDescr.title];
            if(summary===undefined){
                if(typeof(facetDescr.attribMap)==="string"){
                    var summary = this.summaries_by_name[facetDescr.attribMap];
                    if(summary===undefined){
                        summary = this.createSummary(facetDescr.attribMap);
                    }
                    summary = this.changeSummaryName(facetDescr.attribMap,facetDescr.title);
                } else if(typeof(facetDescr.attribMap)==="function"){
                    summary = this.createSummary(facetDescr.title,facetDescr.attribMap,facetDescr.type);
                } else{
                    var asddsad='23232';
                    return;
                }
            } else {
                if(facetDescr.attribMap){
                    // Requesting a new summarywith the same name. Boo!
                    summary.destroy();
                    summary = this.createSummary(facetDescr.title,facetDescr.attribMap,facetDescr.type);
                }
            }

            if(facetDescr.type){
                facetDescr.type = facetDescr.type.toLowerCase();
                if(facetDescr.type!==summary.type){
                    summary.destroy();
                    if(facetDescr.attribMap===undefined){
                        facetDescr.attribMap = facetDescr.title;
                    }
                    if(typeof(facetDescr.attribMap)==="string"){
                        summary = this.createSummary(facetDescr.attribMap,null,facetDescr.type);
                        if(facetDescr.attribMap!==facetDescr.title)
                            this.changeSummaryName(facetDescr.attribMap,facetDescr.title);
                    } else if(typeof(facetDescr.attribMap)==="function"){
                        summary = this.createSummary(facetDescr.title,facetDescr.attribMap,facetDescr.type);
                    }
                    // TODO!
                    // summary.updateSummaryDataType();
                }
            }
            if(summary===undefined){
                return;
            }

            // Common settings
            if(facetDescr.collapsed){
                summary.setCollapsed(true);
            }
            if(facetDescr.description) summary.summaryDescription = facetDescr.description;

            if(summary.type==='categorical'){
                // THESE AFFECT HOW CATEGORICAL VALUES ARE MAPPED 
                // catTableName
                // catDispCountFix
                // Affects visual
                summary.catLabelText = facetDescr.catLabelText || summary.catLabelText;
                summary.catTooltipText = facetDescr.catTooltipText || summary.catTooltipText;
                summary.catBarScale = facetDescr.catBarScale || summary.catBarScale;
                if(facetDescr.minAggrValue) summary.updateMinAggrValue(facetDescr.minAggrValue);
                if(facetDescr.sortingOpts!==undefined) summary.setSortingOpts(facetDescr.sortingOpts);
            }

            if(summary.type==='interval'){
                if(facetDescr.intervalScale) summary.setScaleType(facetDescr.intervalScale);
                // tickIntegerOnly
                // intervalRange
                // intervalTickFormat
                summary.unitName = facetDescr.unitName || summary.unitName;
                summary.showPercentile = facetDescr.showPercentile || summary.showPercentile;
                summary.optimumTickWidth = facetDescr.optimumTickWidth || summary.optimumTickWidth;
            }

            // if catTableName is the main table name, this is a self-referencing widget. Adjust listDef
            if(facetDescr.catTableName===this.primaryTableName){
                this.listDef.hasLinkedItems = true;
            }

            if(facetDescr.items){
                summary.items = facetDescr.items;
            }

            facetDescr.layout = facetDescr.layout || 'left';
            summary.addToPanel(this.panels[facetDescr.layout]);

            if(summary.isLinked) this.linkedFacets.push(fct);
        },this);

        this.panels.left.updateWidth_QueryPreview();
        this.panels.right.updateWidth_QueryPreview();
        this.panels.middle.updateWidth_QueryPreview();

        // Init summary DOMs after all summaries are added / data mappings are completed
        this.panels.left.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.initDOM();
        });
        this.panels.right.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.initDOM();
        });
        this.panels.middle.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.initDOM();
        });
        this.panels.bottom.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.initDOM();
        });

        this.panels.left.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.initDOM();
        });
        this.panels.right.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.initDOM();
        });
        this.panels.middle.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.initDOM();
        });

        if(this.listDef!==undefined){
            this.listDisplay = new kshf.List(this,this.listDef, this.DOM.root);

            var resultInfo = this.listDisplay.DOM.listHeader_TopRow.append("span").attr("class","resultInfo");
            this.DOM.listHeader_count = resultInfo.append("span").attr("class","listHeader_count");
            this.DOM.listHeader_itemName = resultInfo.append("span").attr("class","listHeader_itemName");
            this.setItemName();

            this.listDisplay.insertGlobalTextSearch();

            this.DOM.filtercrumbs = this.listDisplay.DOM.filtercrumbs;

            this.listDisplay.insertFilterClearAll();

            var rightSpan = this.listDisplay.DOM.listHeader_TopRow.append("span").attr("class","rightBoxes");
            if(this.listDef.enableSave){
                rightSpan.append("i").attr("class","fa fa-save ")
                    .each(function(d){
                        this.tipsy = new Tipsy(this, {
                            gravity: 'n',
                            title: function(){ return "Save results to Results facet"; }
                        })
                    })
                    .on("mouseover",function(){ this.tipsy.show(); })
                    .on("mouseout",function(d,i){ this.tipsy.hide(); })
                    .on("click",function(){
                        if(sendLog) sendLog(kshf.LOG.DATASOURCE);
                    })
            }

            // Attribute panel
            rightSpan.append("i").attr("class","fa fa-cog")
                .each(function(d){
                    this.tipsy = new Tipsy(this, {
                        gravity: 'n',
                        title: function(){ return "Show available attributes"; }
                    })
                })
                .on("mouseover",function(){ this.tipsy.show(); })
                .on("mouseout",function(d,i){ this.tipsy.hide(); })
                .on("click",function(){ 
                    me.showAttributes();
                });
            // TODO: implement popup for file-based resources
            if(this.showDataSource !== false){
                var datasource = null;
                if(this.source.url){
                    datasource = rightSpan.append("a").attr("class","fa fa-table datasource")
                        .attr("href",this.source.url).attr("target","_blank");
                } else if(this.source.dirPath){
                    datasource = rightSpan.append("i").attr("class","fa fa-table datasource");    
                }
                if(datasource) datasource
                    .each(function(d){
                        this.tipsy = new Tipsy(this, {
                            gravity: 'n',
                            title: function(){ return "Open Data Source"; }
                        })
                    })
                    .on("mouseover",function(){ this.tipsy.show(); })
                    .on("mouseout",function(d,i){ this.tipsy.hide(); })
                    .on("click",function(){
                        if(sendLog) sendLog(kshf.LOG.DATASOURCE);
                    })
                  ;
            }
            // Info & Credits
            rightSpan.append("i").attr("class","fa fa-info-circle credits")
                .each(function(d){
                    this.tipsy = new Tipsy(this, {
                        gravity: 'n',
                        title: function(){ return "Show Info & Credits"; }
                    })
                })
                .on("mouseover",function(){ this.tipsy.show(); })
                .on("mouseout",function(d,i){ this.tipsy.hide(); })
                .on("click",function(){ me.showInfoBox();});
        } else {
            this.layoutList.style("display","none");
        }

        this.loaded = true;
        this.divWidth = this.domWidth();

        var x = function(){
            var totalWidth = this.divWidth;
            var colCount = 0;
            if(this.panels.left.summaries.length>0){
                totalWidth-=this.panels.left.width.catLabel+this.scrollWidth+this.panels.left.width.catQueryPreview;
                colCount++;
            }
            if(this.panels.right.summaries.length>0){
                totalWidth-=this.panels.right.width.catLabel+this.scrollWidth+this.panels.right.width.catQueryPreview;
                colCount++;
            }
            if(this.panels.middle.summaries.length>0){
                totalWidth-=this.panels.middle.width.catLabel+this.scrollWidth+this.panels.middle.width.catQueryPreview;
                colCount++;
            }
            if(this.listDisplay===undefined) return totalWidth/colCount;
            return Math.floor((totalWidth)/8);
        };
        var defaultBarChartWidth = x.call(this);

        this.panels.left.setWidthCatChart(this.options.barChartWidth || defaultBarChartWidth);
        this.panels.right.setWidthCatChart(this.options.barChartWidth || defaultBarChartWidth);
        this.panels.middle.setWidthCatChart(this.options.barChartWidth || defaultBarChartWidth);
        this.panels.bottom.updateSummariesWidth(this.options.barChartWidth || defaultBarChartWidth);

        this.updateMiddlePanelWidth();

        this.refresh_filterClearAll();

        this.items.forEach(function(item){item.updateWanted();});
        this.update_itemsWantedCount();

        this.updateAfterFilter();

        this.updateLayout_Height();

        // hide infobox
        this.layout_infobox.attr("show","none");

        this.insertAttributeList();

        this.summaries.forEach( function(summary){
            summary.refreshNuggetViz();
        });

        if(this.readyCb!==undefined) this.readyCb(this);
    },
    addAttribDragListeners: function(dom){
        var me=this;
        dom.addEventListener("dragstart",function(event){
            browser.DOM.root.attr("showdropzone",true);
            event.dataTransfer.setData("text/plain",dom.__data__.summaryName); // use the d3 bound value
            event.dataTransfer.setData("text/info","new_summary");
        });
        dom.addEventListener("dragend",function(event){
            browser.DOM.root.attr("showdropzone",false);
            //alert(event.dataTransfer.dropEffect);
            if(event.dataTransfer.dropEffect==="copy"){
                me.refreshAttributeList();
            }
        });
    },
    /** -- */
    setItemName: function(){
        this.DOM.listHeader_itemName.html(this.itemName);
    },
    /** -- */
    insertAttributeList: function(){
        var me=this;
        var tableName = this.primaryTableName;

        var newAttributes = this.DOM.attributeList.selectAll("div.attributeName")
            .data(this.summaries).enter();

        var newNames = newAttributes
            .append("div").attr("class","attributeName")
            .attr("draggable",true)
            .each(function(summary){
                summary.DOM.nugget = d3.select(this);
                me.addAttribDragListeners(this);
            })
            .attr("title",function(summary){ 
                if(summary.summaryColumn!==undefined) return summary.summaryColumn;
            })
            ;

        var adadasd = newNames.append("span").attr("class","attribNugget")
            .each(function(summary){
                this.tipsy = new Tipsy(this, {
                    gravity: 'e', title: function(){
                        var t=summary.getDataType();
                        return t+"<br>summary";
                    }
                })
            })
            .on("mouseenter",function(){ this.tipsy.show(); })
            .on("mouseleave",function(d,i){ this.tipsy.hide(); });

        adadasd.append("span").attr("class","dataTypeIcon fa");
        adadasd.append("span").attr("class","nuggetViz");

        newNames.append("input").attr("class","summaryTitleEdit")
            .on("keydown",function(summary){
                if(event.keyCode===13){ // ENTER
                    var parentDOM = d3.select(this.parentNode);
                    var newTitle = parentDOM.select(".summaryTitleEdit")[0][0].value;
                    parentDOM.select(".summaryTitle").text(newTitle);
                    this.parentNode.setAttribute("edittitle",false);
                    me.changeSummaryName(summary.summaryName,newTitle);
                    me.refreshAttributeList();
                }
            })
            ;
        newNames.append("span").attr("class","summaryTitle");
        newNames.append("div").attr("class","fa fa-pencil editTitleButton")
            .on("click",function(summary){
                if(summary.summaryColumn===null){
                    // custom
                    return;
                }
                var curState=this.parentNode.getAttribute("edittitle");
                if(curState===null || curState==="false"){
                    this.parentNode.setAttribute("edittitle",true);
                    var parentDOM = d3.select(this.parentNode);
                    var currentTitle = parentDOM.select(".summaryTitle")[0][0].textContent;
                    parentDOM.select(".summaryTitleEdit")[0][0].value = currentTitle;
                    parentDOM.select(".summaryTitleEdit")[0][0].focus();
                } else {
                    var parentDOM = d3.select(this.parentNode);
                    var newTitle = parentDOM.select(".summaryTitleEdit")[0][0].value;
                    parentDOM.select(".summaryTitle").text(newTitle);
                    this.parentNode.setAttribute("edittitle",false);
                    me.changeSummaryName(summary.summaryName,newTitle);
                    me.refreshAttributeList();
                }
            });

        this.refreshAttributeList();
    },
    /** -- */
    refreshAttributeList: function(){
        var me=this;
        var tableName = this.primaryTableName;
        this.DOM.attributeList.selectAll(".attributeName")
            .style("display",function(summary){
                // remove the unique key
                if(summary.summaryName===kshf.dt[tableName][0].idIndex) return "none";
                // remove those already in the view
                if(summary.panel!==undefined) return "none";
                return "block";
            })
            .attr("state",function(summary){
                if(summary.summaryName===summary.summaryColumn) return "exact";
                if(summary.summaryColumn===null) return "custom";
                return "edited";
            })
            .attr("datatype",function(summary){ return summary.getDataType(); })
            ;
        this.DOM.attributeList.selectAll(".summaryTitle")
            .text(function(summary){ return summary.summaryName; })
            ;
    },
    /** External method - used by demos to auto-select certain features on load -- */
    filterFacetAttribute: function(facetID, itemId){
        this.summaries[facetID].filterAttrib(this.summaries[facetID]._cats[itemId],"OR");
    },
    /** -- */
    clearFilters_All: function(force){
        var me=this;
        // clear all registered filters
        this.filterList.forEach(function(filter){
            filter.clearFilter(false,false,false);
        })
        if(force!==false){
            this.items.forEach(function(item){ item.updateWanted_More(true); });
            this.update_itemsWantedCount();
            this.refresh_filterClearAll();
            this.updateAfterFilter(1); // more results
            if(sendLog){
                sendLog(kshf.LOG.FILTER_CLEAR_ALL);
            }
        }
        setTimeout( function(){ me.updateLayout_Height(); }, 1000); // update layout after 1.75 seconds
    },
    /** -- */
    update_itemsWantedCount: function(){
        this.itemsWantedCount = 0;
        this.items.forEach(function(item){
            if(item.isWanted) this.itemsWantedCount++;
        },this);

        if(this.DOM.listHeader_count){
            this.DOM.listHeader_count
                .text((this.itemsWantedCount!==0)?this.itemsWantedCount:"No")
                .style("width",(this.items.length.toString().length*16)+"px")
                ;
        }
        if(this.listDisplay){
            this.listDisplay.refreshTotalViz();
        }
    },
    /** @arg resultChange: 
     * - If positive, more results are shown
     * - If negative, fewer results are shown
     * - Else, no info is available. */
    updateAfterFilter: function (resultChange) {
        this.clearPreviewCompare();
        // basically, propogate call under every facet and listDisplay
        this.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.updateAfterFilter(resultChange);
        });
        if(this.listDisplay) this.listDisplay.updateAfterFilter();

        if(this.updateCb) this.updateCb(this);
    },
    /** -- */
    refresh_filterClearAll: function(){
        var filteredCount=0;
        this.filterList.forEach(function(filter){ filteredCount+=filter.isFiltered?1:0; })
        this.DOM.root.attr("isfiltered",filteredCount>0);
    },
    /** Ratio mode is when glyphs scale to their max */
    setRatioMode: function(how){
        this.ratioModeActive = how;
        this.DOM.root.attr("ratiomode",how);
        this.setPercentMode(how);
        this.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.refreshViz_All();
        });
        if(this.ratioModeCb) this.ratioModeCb.call(this,!how);
    },
    /** -- */
    setPercentMode: function(how){
        this.percentModeActive = how;
        this.DOM.root.attr("percentview",how);
        this.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.refreshMeasureLabel();
        });
        this.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.refreshViz_Axis();
        });
    },
    /** -- */
    clearPreviewCompare: function(){
        this._previewCompare_Active = false;
        this.DOM.root.attr("previewcompare",false);
        this.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.refreshViz_Compare();
        });
        if(this.comparedAggregate){
            this.comparedAggregate.DOM.facet.setAttribute("compare",false);
            this.comparedAggregate = null;
        }
        if(this.previewCompareCb) this.previewCompareCb.call(this,true);
    },
    /** -- */
    setPreviewCompare: function(aggregate){
        if(this.comparedAggregate){
            var a=aggregate===this.comparedAggregate;
            this.clearPreviewCompare();
            if(a) return;
        }
        aggregate.DOM.facet.setAttribute("compare",true);
        this.comparedAggregate = aggregate;
        this._previewCompare_Active = true;
        this.DOM.root.attr("previewcompare",true);
        this.summaries.forEach(function(summary){ 
            if(summary.inBrowser()) summary.refreshViz_Compare();
        });
        if(this.previewCompareCb) this.previewCompareCb.call(this,false);
    },
    /** -- */
    clearResultPreviews: function(){
        this.resultPreviewActive = false;
        this.DOM.root.attr("resultpreview",false);
        this.items.forEach(function(item){
            item.updatePreview_Cache = false;
        });
        this.itemCount_Previewed = 0;
        this.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.clearViz_Preview();
        });
        if(this.listDisplay){
            this.listDisplay.refreshTotalViz();
        }
        if(this.previewCb) this.previewCb.call(this,true);
    },
    /** -- */
    refreshResultPreviews: function(){
        var me=this;
        this.resultPreviewActive = true;
        this.DOM.root.attr("resultpreview",true);
        this.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.refreshViz_Preview();
        });
        if(this.listDisplay){
            this.listDisplay.refreshTotalViz();
        }
        if(this.previewCb) this.previewCb.call(this,false);
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

        // initialize all summaries as not yet processed.
        this.summaries.forEach(function(summary){
            if(summary.inBrowser()) summary.heightProcessed = false;
        })

        var bottomFacetsHeight=0;
        // process bottom summary too
        if(this.panels.bottom.summaries.length>0){
            var targetHeight=divHeight_Total/3;
            var maxHeight=0;
            // they all share the same target height
            this.panels.bottom.summaries.forEach(function(summary){
                summary.setHeight(targetHeight);
                summary.heightProcessed = true;
                bottomFacetsHeight += summary.getHeight();
            });
        }

        var doLayout = function(sectionHeight,summaries){
            var finalPass = false;
            var processedFacets=0;
            var lastRound = false;

            summaries.forEach(function(summary){
                // if it's already processed, log it
                if(summary.heightProcessed) processedFacets++;
            });

            while(true){
                var remainingFacetCount = summaries.length-processedFacets;
                if(remainingFacetCount===0) {
                    break;
                }
                var processedFacets_pre = processedFacets;
                summaries.forEach(function(summary){
                    // in last round, if you have more attribs than visible, you may increase your height!
                    if(lastRound===true && sectionHeight>5/*px*/ && !summary.collapsed && summary.catCount_Total!==undefined){
                        if(summary.catCount_InDisplay<summary.catCount_Total){
                            sectionHeight+=summary.getHeight();
                            summary.setHeight(sectionHeight);
                            sectionHeight-=summary.getHeight();
                            return;
                        }
                    }
                    if(summary.heightProcessed) return;
                    if(remainingFacetCount===0) return;
                    // auto-collapse summary if you do not have enough space
                    var targetHeight = Math.floor(sectionHeight/remainingFacetCount);
                    if(finalPass && targetHeight<summary.getHeight_RangeMin()){
                        summary.setCollapsed(true);
                    }
                    if(!summary.collapsed){
                        if(summary.catDispCountFix){
                            // if you have more space than what's requested, you can skip this
                            if(finalPass) {
                                var newTarget = summary.getHeight_Header()+(summary.catDispCountFix+1)*summary.heightRow_attrib;
                                var newTarget = summary.getHeight_Header()+(summary.catDispCountFix+1)*summary.heightRow_attrib;
                                newTarget = Math.max(newTarget,targetHeight);
                                summary.setHeight(newTarget);
                            } else {
                                return;
                            }
                        } else if(summary.getHeight_RangeMax()<=targetHeight){
                            // You have 10 rows available, but I need max 5. Thanks,
                            summary.setHeight(summary.getHeight_RangeMax());
                        } else if(finalPass){
                            summary.setHeight(targetHeight);
                        } else if(lastRound){
                        } else {
                            return;
                        }
                    }
                    sectionHeight-=summary.getHeight();
                    summary.heightProcessed = true;
                    processedFacets++;
                    remainingFacetCount--;
                },this);
                finalPass = processedFacets_pre===processedFacets;
                if(lastRound===true) break;
                if(remainingFacetCount===0) lastRound = true;
            }
            return sectionHeight;
        };

        var topPanelsHeight = divHeight_Total;
        if(this.panels.bottom.summaries.length>0) topPanelsHeight-=bottomFacetsHeight;

        this.DOM.panelsTop.style("height",topPanelsHeight+"px");

        // Left Panel
        if(this.panels.left.summaries.length>0){
            doLayout.call(this,topPanelsHeight,this.panels.left.summaries);
        }
        // Right Panel
        if(this.panels.right.summaries.length>0){
            doLayout.call(this,topPanelsHeight,this.panels.right.summaries);
        }
        // Middle Panel
        var midPanelHeight = 0;
        if(this.panels.middle.summaries.length>0){
            var panelHeight = divHeight_Total;
            if(this.panels.bottom.summaries.length>0) panelHeight-=bottomFacetsHeight;
            if(this.listDisplay) panelHeight -= 200; // give 100px fo the list display
            midPanelHeight = panelHeight - doLayout.call(this,panelHeight, this.panels.middle.summaries);
        }

        // The part where summary DOM is updated
        this.summaries.forEach(function(summary){ 
            if(summary.inBrowser()) summary.refreshHeight();
        });
 
        if(this.listDisplay) {
            var listDivTop = 0;
            // get height of header
            var listHeaderHeight=this.listDisplay.DOM.listHeader[0][0].offsetHeight;
            var listDisplayHeight = divHeight_Total-listDivTop-listHeaderHeight; // 2 is bottom padding
            if(this.panels.bottom.summaries.length>0){
                listDisplayHeight-=bottomFacetsHeight;
            }
            listDisplayHeight-=midPanelHeight;
            this.listDisplay.DOM.listItemGroup.style("height",listDisplayHeight+"px");
        }
    },
    /** -- */
    updateMiddlePanelWidth: function(){
        // for some reason, on page load, this variable may be null. urgh.
        var widthMiddlePanel = this.divWidth;
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
        if(this.listDisplay){
            this.listDisplay.updateContentWidth(widthMiddlePanel);
            this.layoutList.style("width",widthMiddlePanel+"px");
            this.panels.left.DOM.root.style("margin-right",marginLeft+"px")  
            this.panels.right.DOM.root.style("margin-left",marginRight+"px")  
        }
        this.panels.middle.DOM.root
            .style("width",widthMiddlePanel+"px")
            .style("display",this.panels.middle.summaries.length>0?"inline-block":"none")
            ;
        this.panels.middle.setTotalWidth(widthMiddlePanel);
        this.panels.middle.updateSummariesWidth();
        this.panels.bottom.updateSummariesWidth();
    },
    /** -- */
    getFilterState: function() {
        var r={
            resultCt : this.itemsWantedCount,
        };

        r.filtered="";
        r.selected="";
        this.filterList.forEach(function(filter){
            if(filter.isFiltered){
                // set filtered to true for this summary ID
                if(r.filtered!=="") r.filtered+="x";
                r.filtered+=filter.id;
                // include filteing state of summary
                if(r.selected!=="") r.selected+="x";
            }
        },this);
        if(r.filtered==="") r.filtered=undefined;
        if(r.selected==="") r.selected=undefined;

        return r;
    },
    /** -- */
    getFilterSummary: function(){
        var str="";
        this.filterList.forEach(function(filter,i){
            if(!filter.isFiltered) return;
            if(filter.filterView_Detail){
                if(i!=0) str+=" & ";
//                if(filter.summary_header) str+= filter.summary_header+": ";
                str+=filter.filterView_Detail();
            }
        },this);
        return str;
    }
};



// ***********************************************************************************************************
// ***********************************************************************************************************

kshf.Summary_Base = function(){},
kshf.Summary_Base.prototype = {
    initialize: function(browser,name,func){
        this.id = ++kshf.num_of_charts;
        this.browser = browser;
//        this.parentFacet = options.parentFacet;

        this.summaryName   = name;
        this.summaryColumn = func?null:name;
        this.summaryFunc   = func || function(d){ return d.data[name]; };

        this.chartScale_Measure = d3.scale.linear();

        this.DOM = {};
        this.DOM.inited = false;

        this.items = this.browser.getPrimaryItems();
        if(this.items===undefined||this.items===null||this.items.length===0){
            alert("Fck");
        }

        this.subFacets = [];

        // Only used when summary is inserted into browser
        this.collapsed = false;
    },
    getDataType: function(){
        if(this.type==='categorical') return "categorical";
        if(this.type==='interval') {
            if(this.hasTime) return "time";
            return "numeric";
            // 
            if(this.hasFloat) return "floating";
            return "integer";
        }
        return "?";
    },
    /** -- */
    destroy: function(){
        delete this.browser.summaries_by_name[this.summaryName];
        if(this.summaryColumn)
            delete this.browser.summaries_by_name[this.summaryColumn];
        if(this.panel){
            this.panel.removeSummary(this);
        }
        this.browser.removeSummary(this);
        if(this.DOM.root){
            this.DOM.root[0][0].parentNode.removeChild(this.DOM.root[0][0]);
        }
    },
    /** -- */
    hasEntityParent: function(){
        if(this.parentFacet===undefined) return false; 
        return this.parentFacet.hasAttribs();
    },
    /** -- */
    hasSubFacets: function(){
        return this.subFacets.length>0;
    },
    /** -- */
    clearDOM: function(){
        var dom = this.DOM.root[0][0];
        dom.parentNode.removeChild(dom);
    },
    /** -- */
    getWidth: function(){
        return this.panel.getWidth_Total()-this.getWidth_LeftOffset();
    },
    /** -- */
    getWidth_LeftOffset: function(){
        return (this.parentFacet)?17:0;
    },
    /** -- */
    isFiltered: function(){
        if(this.summaryFilter===undefined) return false;
        return this.summaryFilter.isFiltered;
    },
    /** -- */
    addToPanel: function(panel){
        if(this.panel && this.panel!==panel){
            this.panel.removeSummary(this);
            this.panel = panel;
            panel.addSummary(this); 
        }
        if(this.panel===undefined){
            this.panel = panel;
            panel.addSummary(this); 
        }
        if(this.DOM.root){
            this.DOM.root.style("display","");
            panel.DOM.root[0][0].insertBefore(this.DOM.root[0][0],panel.DOM.dropZone[0][0]);
        }
    },
    /** -- */
    inBrowser: function(){
        return this.panel!==undefined;
    },
    /** -- */
    insertHeader: function(){
        var me = this;

        draggedSummary = null;
        draggedTarget = null;
        this.DOM.headerGroup = this.DOM.root.append("div").attr("class","headerGroup")
            .attr("draggable",true)
            .each(function(d){
                this.__data__ = me;
                this.addEventListener("dragstart", function( event ) {
                    event.dataTransfer.setData("text/info","xfer_summary");
                    // store a ref. on the dragged elem
                    draggedSummary = me;
                    draggedTarget = event.target;
                    me.DOM.root
                        .style("opacity",0.5)
                    me.browser.DOM.root.attr("showdropzone",true);
                }, false);
                this.addEventListener("dragend", function( event ) {
                    me.browser.DOM.root.attr("showdropzone",false);
                    me.DOM.root
                        .style("opacity","")
                }, false);
                this.addEventListener("dragover", function( event ) {
                    // prevent default to allow drop
                    event.preventDefault();
                }, false);
                this.addEventListener("dragenter", function( event ) {
                    if(draggedTarget===null) return;
                    // highlight potential drop target when the draggable element enters it
                    if(draggedTarget !== event.target && draggedTarget.className===event.target.className){
                        event.target.style.background = "rgba(0,0,150,0.5)";
                    }
                }, false);
                this.addEventListener("dragleave", function( event ) {
                    if(draggedTarget===null) return;
                    // reset background of potential drop target when the draggable element leaves it
                    if(draggedTarget !== event.target && draggedTarget.className===event.target.className){
                        event.target.style.background = "";
                    }
                }, false);
                this.addEventListener("drop", function( event ) {
                    if(draggedTarget===null) return;
                    if(draggedTarget !== event.target && draggedTarget.className===event.target.className){
                        event.target.style.background = "";
                    }
                    // prevent default action (open as link for some elements)
                    event.preventDefault();
                    // move dragged elem to the selected drop target
                    if ( event.target.className == "headerGroup" ) {
                        var summaryFrom = draggedTarget.__data__;
                        var summaryTo = event.target.__data__;
                        
                        var indexFrom = -1, indexTo = -1;
                        var panelFrom = summaryFrom.panel;
                        var panelTo = summaryTo.panel;
                        
                        panelTo.summaries.forEach(function(summary,i){
                            if(summary===summaryTo) indexTo = i;
                        });
                        panelFrom.summaries.forEach(function(summary,i){
                            if(summary===summaryFrom) indexFrom = i;
                        });
                        panelFrom.summaries[indexFrom] = summaryTo;
                        panelTo.summaries[indexTo] = summaryFrom;

                        var domTo        = summaryTo.DOM.root[0][0];
                        var domAfterTo   = domTo.nextSibling;
                        var domFrom      = summaryFrom.DOM.root[0][0];
                        var domAfterFrom = domFrom.nextSibling;

                        panelFrom.DOM.root[0][0].insertBefore(domTo,domAfterFrom);
                        panelTo.DOM.root[0][0].insertBefore(domFrom,domAfterTo);

                        summaryFrom.panel = summaryTo.panel;
                        summaryTo.panel = panelFrom;

                        if(summaryFrom.type=="categorical"){
                            summaryFrom.refreshLabelWidth();
                            summaryFrom.updateBarPreviewScale2Active();
                        }
                        if(summaryTo.type=="categorical"){
                            summaryTo.refreshLabelWidth();
                            summaryTo.updateBarPreviewScale2Active();
                        }

                        summaryFrom.refreshWidth();
                        summaryTo.refreshWidth();

                        me.browser.updateLayout();
                        me.browser.updateLayout();
                    }
                }, false);
            });

        this.DOM.headerGroup.append("div").attr("class","border_line");

        var header_display_control = this.DOM.headerGroup.append("span").attr("class","header_display_control");

        if(this.collapsed!==undefined){
            header_display_control.append("span").attr("class","fa fa-collapse")
                .each(function(){
                    this.tipsy = new Tipsy(this, {
                        gravity: 'sw',
                        title: function(){ return me.collapsed?"Open summary":"Minimize summary"; }
                    })
                })
                .on("mouseover",function(){ this.tipsy.show(); })
                .on("mouseout",function(d,i){ this.tipsy.hide(); })
                .on("click",function(){
                    this.tipsy.hide();
                    me.collapseFacet(!me.collapsed);
                })
                ;
        }
        // Clique
        header_display_control.append("span").attr("class","fa fa-remove")
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: 'sw',
                    title: function(){ return "Remove summary"; }
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("click",function(){
                // Clique control
                if(false){
                    me.parentFacet.show_cliques = !me.parentFacet.show_cliques;
                    me.parentFacet.DOM.root.attr("show_cliques",me.parentFacet.show_cliques);
                } else {
                    // REMOVE SUMMARY
                    var summaryIndex = -1;
                    me.browser.summaries.forEach(function(summary,i){
                        if(summary===me) summaryIndex = i;
                    });
                    // remove it from the list
                    me.panel.removeSummary(me);
                    me.clearDOM();

                    // add the facet title back
                    me.browser.refreshAttributeList();

                    me.browser.updateLayout();
                }
            })
            ;

        var topRow = this.DOM.headerGroup.append("span").style('position','relative');

        this.DOM.summaryTitle = topRow.append("span").attr("class","summaryTitle")
            .attr("edittitle",false)
            .on("click",function(){ if(me.collapsed) me.collapseFacet(false); })
            ;

        this.DOM.summaryTitle.append("span").attr("class","chartFilterButtonParent").append("div")
            .attr("class","chartClearFilterButton rowFilter alone")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n', title: function(){ 
                        return "<span class='action'><span class='fa fa-times'></span> Remove</span> filter";
                    }
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("click", function(d,i){
                this.tipsy.hide();
                me.summaryFilter.clearFilter();
                if(sendLog) sendLog(kshf.LOG.FILTER_CLEAR_X, {id:me.summaryFilter.id});
            })
            .append("span").attr("class","fa fa-times")
            ;

        this.DOM.summaryTitle_text = this.DOM.summaryTitle.append("span").attr("class","summaryTitle_text")
            .html((this.parentFacet && this.parentFacet.hasAttribs())?
                ("<i class='fa fa-hand-o-up'></i> <span style='font-weight:500'>"+
                    this.parentFacet.summaryName+":</span> "+"  "+this.summaryName):
                this.summaryName
            );

        this.DOM.summaryTitle_edit = this.DOM.summaryTitle.append("input").attr("class","summaryTitle_edit")
            .on("keydown",function(){
                if(event.keyCode===13){ // ENTER
                    var newTitle = this.value;
                    this.parentNode.setAttribute("edittitle",false);
                    d3.select(this.parentNode).select(".summaryTitle_text").text(newTitle);
                    me.browser.changeSummaryName(me.summaryName,newTitle);
                }
            })
            .html((this.parentFacet && this.parentFacet.hasAttribs())?
                ("<i class='fa fa-hand-o-up'></i> <span style='font-weight:500'>"+
                    this.parentFacet.summaryName+":</span> "+"  "+this.summaryName):
                this.summaryName
            );

        this.DOM.summaryTitle_editButton = this.DOM.summaryTitle.append("span")
            .attr("class","summaryTitle_editButton fa")
            .on("click",function(d){
                var curState=this.parentNode.getAttribute("edittitle");
                if(curState===null || curState==="false"){
                    this.parentNode.setAttribute("edittitle",true);
                    var parentDOM = d3.select(this.parentNode);
                    var currentTitle = parentDOM.select(".summaryTitle_text")[0][0].textContent;
                    parentDOM.select(".summaryTitle_edit")[0][0].value = currentTitle;
                    parentDOM.select(".summaryTitle_edit")[0][0].focus();
                } else {
                    var parentDOM = d3.select(this.parentNode);
                    var newTitle = parentDOM.select(".summaryTitle_edit")[0][0].value;
                    me.browser.changeSummaryName(me.browser.primaryTableName,d.name,newTitle);
                    parentDOM.select(".summaryTitle_text").text(newTitle);
                    this.parentNode.setAttribute("edittitle",false);
                }
            });

        topRow.append("span").attr("class","save_filter_as_set fa fa-save")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n', title: function(){ return "Save filtering as new row"; }
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("click", function(d,i){
                this.tipsy.hide();
                me.summaryFilter.saveFilter();
                if(sendLog) sendLog(kshf.LOG.FILTER_CLEAR_X, {id:me.summaryFilter.id});
            });

        this.DOM.facetIcons = this.DOM.headerGroup.append("span").attr("class","facetIcons");
        this.DOM.facetIcons.append("span").attr("class", "hasMultiMappings fa fa-tags")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'ne',
                    title: function(){ return "Multiple "+me.summaryName+" possible.<br>Click to show relations within.";}
                });
            })
            .on("mouseover",function(d){
                this.tipsy.show();
                this.setAttribute("class","hasMultiMappings fa fa-th");
            })
            .on("mouseout" ,function(d){
                this.tipsy.hide();
                this.setAttribute("class","hasMultiMappings fa fa-tags");
            })
            .on("click",function(d){
                me.show_cliques = !me.show_cliques;
                me.DOM.root.attr("show_cliques",me.show_cliques);
            })
            ;
        if(this.isLinked) {
            this.DOM.facetIcons.append("span").attr("class", "isLinkedMark fa fa-check-square-o");
        } else {
//            if(this.parentFacet && this.parentFacet.hasAttribs()){
//                this.DOM.facetIcons.append("span").attr("class", "isLinkedMark fa fa-level-up");
//            }
        }
        this.DOM.headerGroup.append("div").attr("class","border_line border_line_bottom");

        this.setSummaryDescription(this.summaryDescription);
    },
    /** -- */
    setSummaryDescription: function(description){
        if(this.DOM.facetIcons===undefined) return;
        if(description===undefined) return;
        if(description===null) return;
        this.DOM.facetIcons.append("span").attr("class","facetDescription fa fa-info-circle")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'ne',
                    title: function(){ return description;}
                });
            })
            .on("mouseover",function(d){ this.tipsy.show(); })
            .on("mouseout" ,function(d){ this.tipsy.hide(); });
    },
    /** -- */
    insertChartAxis_Measure: function(dom, pos1, pos2){
        var me=this;
        this.DOM.chartAxis_Measure = dom.append("div").attr("class","chartAxis_Measure");
        this.DOM.chartAxis_Measure.append("span").attr("class","percentSign")
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: pos1, title: function(){
                        return "Show "+(me.browser.percentModeActive?"absolute":"percent")+" values";
                    },
                })
            })
            .on("click",function(){ me.browser.setPercentMode(!me.browser.percentModeActive); })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(){ this.tipsy.hide(); });
        this.DOM.chartAxis_Measure.append("span").attr("class","background")
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: pos2, title: function(){ 
                        return "Explore "+(me.browser.ratioModeActive?"absolute":"relative")+" values";
                    },
                })
            })
            .on("click",function(){ me.browser.setRatioMode(!me.browser.ratioModeActive); })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(){ this.tipsy.hide(); });
    },
    /** -- */
    collapseFacet: function(hide){
        this.setCollapsed(hide);
        this.browser.updateLayout_Height();
        if(sendLog) {
            sendLog( (hide===true?kshf.LOG.FACET_COLLAPSE:kshf.LOG.FACET_SHOW), {id:this.id} );
        }
    },
};


kshf.Summary_Categorical = function(){};
kshf.Summary_Categorical.prototype = new kshf.Summary_Base();
var Summary_Categorical_functions = {
    /** -- */ 
    initialize: function(kshf_,name,func){
        kshf.Summary_Base.prototype.initialize.call(this,kshf_,name,func);
        this.type='categorical';

        this.setSortingOpts();

        this.heightRow_attrib = 18;
        this.heightRow_config = 16;

        this.show_cliques = false;

        this.scrollTop_cache=0;
        this.attrib_InDisplay_First = 0;
        this.configRowCount=0;

        // These affect the categories
        this.minAggrValue=0;
        this.removeInactiveCats = true;

        this.isLinked = false; // TODO: document / update

        this.initCategories();
    },
    /** -- */
    refreshNuggetViz: function(){
        if(this.DOM.nugget===undefined){
            console.log("refreshNuggetViz - nugget DOM was not available...");
            return;
        }
        var nuggetViz = this.DOM.nugget.select(".nuggetViz");

        var maxAggregate_Total = this.getMaxAggregate_Total();
        if(maxAggregate_Total===1){
            this.DOM.nugget.select(".dataTypeIcon").html("<span class='fa fa-tag'></span><br>Unique");
            nuggetViz.style("display",'none');
            return;
        }

        var totalWidth= 25;
        nuggetViz.selectAll(".nuggetBar").data(this._cats).enter()
                .append("span").attr("class","nuggetBar")
                .style("width",function(cat){
                    return totalWidth*(cat.items.length/maxAggregate_Total)+"px";
                })
            ;
        
        this.DOM.nugget.select(".dataTypeIcon").html(
            "<span class='fa fa-tag"+(this.hasMultiValueItem?"s":"")+"'></span><br>"+
            this._cats.length+"<br>rows<br>");
    },
    /** -- */
    getCategoryTable: function(){
        return kshf.dt[this.catTableName];
    },
    /** -- */
    getAttribs_wID: function(){
        return kshf.dt_id[this.catTableName];
    },
    /** -- */
    getHeight: function(){
        if(!this.hasAttribs()) return this.getHeight_Header();
        if(this.collapsed) return this.getHeight_Header();
        // Note: I don't know why I need -2 to match real dom height.
        return this.getHeight_Header() + this.getHeight_Content()-2;
    },
    /** -- */
    getWidth_Label: function(){
        return this.panel.width.catLabel-this.getWidth_LeftOffset();
    },
    /** -- */
    getWidth_Text: function(){
        return this.getWidth_Label()+this.panel.width.catQueryPreview;
    },
    /** -- */
    getHeight_Header: function(){
        if(this._height_header==undefined) {
            this._height_header = this.DOM.headerGroup[0][0].offsetHeight;
            if(this.hasSubFacets()){
                // add some padding below
                this._height_header+=2;
            }
        }
        return this._height_header;
    },
    /** -- */
    getHeight_RangeMax: function(){
        if(!this.hasAttribs()) return this.heightRow_attrib;
        return this.getHeight_Header()+(this.configRowCount+this.catCount_Visible+1)*this.heightRow_attrib-1;
    },
    /** -- */
    getHeight_RangeMin: function(){
        if(!this.hasAttribs()) return this.heightRow_attrib;
        return this.getHeight_Header()+(this.configRowCount+Math.min(this.catCount_Visible,3)+1)*this.heightRow_attrib;
    },
    /** -- */
    getHeight_Config: function(){
        var r=0;
        if(this.configRowCount!=0) r+=1; // bottom border : 1 px
        if(this.showTextSearch) r+=15;
        if(this.sortingOpts.length>1) r+=16;
        return r;
    },
    /** -- */
    getHeight_Bottom: function(){
        return 18;
    },
    /** -- */
    getHeight_Content: function(){
        var h = this.attribHeight + this.getHeight_Config();
        if(!this.areAllAttribsInDisplay() || !this.panel.hideBarAxis || this.catCount_Total>4)
            h+=this.getHeight_Bottom();
        return h;
    },
    /** -- */
    areAllAttribsInDisplay: function(){
        return this.catCount_Visible===this.catCount_InDisplay;
    },
    /** -- */
    hasAttribs: function(){
        if(this._cats){
            if(this._cats.length===0) return false;
        }
        return this.summaryFunc!==undefined;
    },
    /** -- */
    setSortingOpts: function(opts){
        this.sortingOpts = opts || [{}];
        // ATTRIBUTE SORTING OPTIONS
        this.sortingOpts.forEach(function(opt){
            // apply defaults
            if(opt.no_resort===undefined) opt.no_resort=false;
            if(opt.func===undefined) {
                opt.func=kshf.Util.sortFunc_aggreage_Active_Total;
            } else {
                opt.custom = true;
                if(opt.no_resort===undefined) opt.no_resort=true;
            }
            if(opt.inverse===undefined)  opt.inverse=false;
        },this);
        this.sortingOpt_Active = this.sortingOpts[0];
    },
    /** -- */
    initCategories: function(){
        var me=this;

        this.setSortingOpts();

        if(this.catLabelText===undefined){
            this.catLabelText = function(cat){ return cat.data[0]; };
        } else {
            var tt=this.catLabelText;
            this.catLabelText = function(cat){ 
                if(cat.savedAttrib) return cat.data[0];
                return tt(cat);
            };
        }

        // generate row table if necessary
        if(this.catTableName===undefined){
            this.catTableName = this.summaryName+"_h_"+this.id;
            this.browser.createTableFromTable(this.items,this.catTableName, this.summaryFunc,
                this.catLabelText);
        } else {
            if(this.catTableName===this.browser.primaryTableName){
                this.isLinked=true;
                this.catTableName = this.summaryName+"_h_"+this.id;
                kshf.dt_id[this.catTableName] = kshf.dt_id[this.browser.primaryTableName];
                kshf.dt[this.catTableName] = this.items.slice();
            }
        }

        // Add "none" category if it is requested
        if(this.showNoneCat===true){
            // TODO: Check if a category named "None" exist in table
            var noneID = "None";
            
            var newItem = new kshf.Item([noneID,noneID],0)
            this.getCategoryTable().push(newItem);
            this.getAttribs_wID()[noneID] = newItem;

            var _attribAccess = this.summaryFunc;
            this.summaryFunc = function(d){
                var r=_attribAccess(d);
                if(r===null) return noneID;
                if(r===undefined) return noneID;
                if(r instanceof Array && r.length===0) return noneID;
                return r;
            }
            var _catLabelText = this.catLabelText;
            this.catLabelText = function(d){ 
                return (d.id()===noneID)?"None":_catLabelText(d);
            };
            if(this.catTooltipText){            
                var _catTooltipText = this.catTooltipText;
                this.catTooltipText = function(d){ 
                    return (d.id()===noneID)?"None":_catTooltipText(d);
                };
            }
        }
        this.createSummaryFilter();

        this.mapAttribs();

        // If the categories are not unique, sort them
        if(this.getMaxAggregate_Total()!=1 && this._cats.length>1)
            this.sortCats();
    },
    /*8 -- */
    createSummaryFilter: function(){
        var me=this;
        this.summaryFilter = this.browser.createFilter({
            browser: this.browser,
            filteredItems: this.items,
            parentSummary: this,
            hideCrumb: false,
            onClear: function(filter){
                this.clearLabelTextSearch();
                this.unselectAllAttribs();
                this._update_Selected();
            },
            onFilter: function(filter){
                this._update_Selected();

                var filterId = filter.id;

                this.items.forEach(function(item){
                    var recordVal_s=item.mappedDataCache[filterId];

                    if(recordVal_s===null){
                        if(filter.selected_AND.length>0 || filter.selected_OR.length>0){
                            item.setFilterCache(filterId,false); return;
                        }
                        item.setFilterCache(filterId,true); return;
                    }

                    // Check NOT selections - If any mapped item is NOT, return false
                    // Note: no other filtering depends on NOT state.
        /*            if(filter.selected_NOT.length>0){
                        if(!recordVal_s.every(function(item){ 
                            return !item.is_NOT() && item.isWanted;
                        })){
                            item.setFilterCache(filterId,false); return;
                        }
                    }*/ // THIS THING ABOVE IS FOR MULTI_LEVEL FILTERING AND NOT QUERY
                    
                    // If any of the record values are selected with NOT, the item will be removed
                    if(filter.selected_NOT.length>0){
                        if(!recordVal_s.every(function(val){ return !val.is_NOT(); })){
                            item.setFilterCache(filterId,false); return;
                        }
                    }
                    // All AND selections must be among the record values
                    if(filter.selected_AND.length>0){
                        // Compute the number of record values selected with AND.
                        var t=0;
                        recordVal_s.forEach(function(m){ if(m.is_AND()) t++; })
                        if(t!==filter.selected_AND.length){
                            item.setFilterCache(filterId,false); return;
                        }
                    }
                    // One of the OR selections must be among the item values
                    // Check OR selections - If any mapped item is OR, return true
                    if(filter.selected_OR.length>0){
                        if(recordVal_s.some(function(d){ return (d.is_OR()); })){
                            item.setFilterCache(filterId,true); return;
                        } else {
                            item.setFilterCache(filterId,false); return;
                        }
                    }
                    // only NOT selection
                    item.setFilterCache(filterId,true);
                },this);
            },
            filterView_Detail: function(){
                // 'this' is the Filter
                // go over all items and prepare the list
                var selectedItemsText="";
                var catLabelText = me.catLabelText;
                var catTooltipText = me.catTooltipText;

                var totalSelectionCount = this.selectedCount_Total();

                if(this.parentSummary.subFacets.some(function(summary){ return summary.isFiltered();})){
                    return " <i class='fa fa-hand-o-right'></i>";;
                }

                var query_and = " <span class='AndOrNot AndOrNot_And'>And</span> ";
                var query_or = " <span class='AndOrNot AndOrNot_Or'>Or</span> ";
                var query_not = " <span class='AndOrNot AndOrNot_Not'>Not</span> ";

                if(totalSelectionCount>4 || this.linkFilterSummary){
                    selectedItemsText = "<b>"+totalSelectionCount+"</b> selected";
                    // Note: Using selected because selections can include not, or,and etc (a variety of things)
                } else {
                    var selectedItemsCount=0;

                    // OR selections
                    if(this.selected_OR.length>0){
                        var useBracket_or = this.selected_AND.length>0 || this.selected_NOT.length>0;
                        if(useBracket_or) selectedItemsText+="[";
                        // X or Y or ....
                        this.selected_OR.forEach(function(attrib,i){
                            selectedItemsText+=((i!==0 || selectedItemsCount>0)?query_or:"")+"<span class='attribName'>"+catLabelText(attrib)+"</span>";
                            selectedItemsCount++;
                        });
                        if(useBracket_or) selectedItemsText+="]";
                    }
                    // AND selections
                    this.selected_AND.forEach(function(attrib,i){
                        selectedItemsText+=((selectedItemsText!=="")?query_and:"")
                            +"<span class='attribName'>"+catLabelText(attrib)+"</span>";
                        selectedItemsCount++;
                    });
                    // NOT selections
                    this.selected_NOT.forEach(function(attrib,i){
                        selectedItemsText+=query_not+"<span class='attribName'>"+catLabelText(attrib)+"</span>";
                        selectedItemsCount++;
                    });
                }
                if(this.linkFilterSummary){
                    selectedItemsText+= "<i class='fa fa-hand-o-left'></i><br> ["+this.linkFilterSummary+"]";
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
        this.summaryFilter.saveFilter = function(){
            // create new item in the attrib list
            // TODO: check inserted id when using a data table lookup...
            var randID=me._cats.length+10;
            while(me.getAttribs_wID()[randID]!==undefined) {
                randID = Math.random();
            }
            var newAttrib = new kshf.Item(
                [randID,this.filterView_Detail()],
                0 // id row (first row by default) TODO: check when using a data table..
            );
            newAttrib.savedAttrib = true;
            this.filteredItems.forEach(function(item){
                if(item.isWanted) {
                    newAttrib.addItem(item);
                    item.mappedDataCache[this.id].push(newAttrib);
                }
            },this);
            if(newAttrib.items.length>0){
                me._cats.push(newAttrib);
                me.insertAttribs();
                me.updateCatCount_Total();
                me.refreshLabelWidth();
                me.updateSorting(0, true);
            }
            this.clearFilter();
            if(me.cbSaveFilter) me.cbSaveFilter.call(this);
        };
    },
    /** -- */
    insertSubFacets: function(){
        this.DOM.subFacets=this.DOM.root.append("div").attr("class","subFacets");

        this.DOM.subFacets.append("span").attr("class","facetGroupBar").append("span").attr("class","facetGroupBarSub");

        if(!this.hasAttribs()){
            this.options.facets.forEach(function(facetDescr){
                facetDescr.parentFacet = this;
                facetDescr.panel = this.panel;
                var fct=this.browser.addFacet(facetDescr,this.browser.primaryTableName);
                this.subFacets.push(fct);
            },this);
        } else {
            this.options.facets.forEach(function(facetDescr){
                facetDescr.parentFacet = this;
                facetDescr.panel = this.panel;
                facetDescr.items = this._cats;
                var fct=this.browser.addFacet(facetDescr,this.catTableName);
                this.subFacets.push(fct);
            },this);
        }

        // Init facet DOMs after all facets are added / data mappings are completed
        this.subFacets.forEach(function(summary){ summary.initDOM(); });
    },

    /** -- 
     * Note: accesses summaryFilter, summaryFunc
     */
    mapAttribs: function(){
        var filterId = this.summaryFilter.id, me=this;

        var targetTable = this.getAttribs_wID();
        var maxDegree = 0
        this.items.forEach(function(item){
            item.mappedDataCache[filterId] = null; // default mapping to null

            var mapping = this.summaryFunc(item);
            if(mapping===undefined || mapping==="" || mapping===null)
                return;
            if(mapping instanceof Array){
                var found = {};
                mapping = mapping.filter(function(e){
                    if(e===undefined || e==="" || e===null) return false; // remove invalid values
                    if(found[e]===undefined){ found[e] = true;  return true; } // remove duplicate values
                    return false;
                });
                if(mapping.length===0) return; // empty array - checked after removing invalid/duplicates
            } else {
                mapping = [mapping];
            }
            maxDegree = Math.max(maxDegree, mapping.length);
            
            item.mappedDataCache[filterId] = [];
            mapping.forEach(function(a){
                var m=targetTable[a];
                if(m==undefined) return;
                item.mappedDataCache[filterId].push(m);
                m.addItem(item);
            });
        }, this);

        this.hasMultiValueItem = maxDegree>1;

        // TODO: Fix set visualization!
        // add degree filter if attrib has multi-value items and set-vis is enabled
        if(this.hasMultiValueItem && this.enableSetVis){
            var fscale;
            if(maxDegree>100) fscale = 'log';
            else if(maxDegree>10) fscale = 'linear';
            else fscale = 'step';
            // TODO: FIX!!!
            var facetDescr = {
                title:"<i class='fa fa-hand-o-up'></i> # of "+this.summaryName,
                attribMap: function(d){
                    var arr=d.mappedDataCache[filterId];
                    if(arr==null) return 0;
                    return arr.length;
                },
                parentFacet: this.parentFacet,
                collapsed: true,
                type: 'interval',
                intervalScale: fscale,
                layout: this.panel
            };
            this.browser.addFacet(facetDescr,this.browser.primaryTableName);
        }

        this._cats = this.getCategoryTable();

        this.updateCatCount_Total();
        this.updateCatCount_Visible();

        this.unselectAllAttribs();
    },
    // TODO: Check how isLinked and dataMap (old variable) affected this calculations...
    // Modified internal dataMap function - Skip rows with 0 active item count
    updateMinAggrValue: function(v){
        this.minAggrValue = v;
        if(this.minAggrValue>0){
            // remove attributes that have no items inside
            this._cats = this.getCategoryTable().filter(function(cat){
                return cat.items.length>=this.minAggrValue;
            },this);
        }
        this.updateCatCount_Total();
        this.updateCatCount_Visible();
    },
    /** -- */
    updateCatCount_Total: function(){
        this.catCount_Total = this._cats.length;
        this.catCount_Wanted = this.catCount_Total;
        if(this.catCount_Total===1){
            this.catBarScale = "scale_frequency";
        }
        if(this.catCount_Total<=4) {
            this.sortingOpts.forEach(function(opt){
                opt.no_resort=true;
            });
        }
        this.showTextSearch = this.catCount_Total>=20;
    },
    /** -- */
    updateAttribCount_Wanted: function(){
        this.catCount_Wanted = 0;
        this._cats.forEach(function(cat){
            if(cat.isWanted) this.catCount_Wanted++;
        },this);
    },
    /** -- */
    updateCatCount_Visible: function(){
        this.catCount_Visible = 0;
        this.catCount_NowVisible = 0;
        this.catCount_NowInvisible = 0;
        this._cats.forEach(function(cat){
            v = this.isAttribVisible(cat);
            cat.isVisible_before = cat.isVisible;
            cat.isVisible = v;
            if(!cat.isVisible && cat.isVisible_before) this.catCount_NowInvisible++;
            if(cat.isVisible && !cat.isVisible_before) this.catCount_NowVisible++;
            if(cat.isVisible) this.catCount_Visible++;
        },this);
    },
    /** -- */
    initDOM: function(){
        if(this.DOM.inited===true) return;
        var me = this;

        var root,before;
        if(this.parentFacet){
            root = this.parentFacet.DOM.subFacets;
            this.DOM.root = root.append("div")
        } else {
            root = this.panel.DOM.root;
            this.DOM.root = root.insert("div",function(){ return me.panel.DOM.dropZone[0][0];})
        }
        this.DOM.root
            .attr("class","kshfChart")
            .attr("collapsed",this.collapsed===false?"false":"true")
            .attr("filtered",false)
            .attr("filtered_or",0)
            .attr("filtered_and",0)
            .attr("filtered_not",0)
            .attr("filtered_total",0)
            .attr("hasMultiValueItem",this.hasMultiValueItem)
            .attr("refreshSorting",false)
            .attr("chart_id",this.id)
            ;

        this.insertHeader.call(this);

        if(this.hasAttribs()){
            this.init_DOM_Attrib();
        }

        // TODO: Insert subfacets here
        if(this.facets){
            this.DOM.root.attr("hasFacets",true);
            this.insertSubFacets();
            // no-attrib facets (hierarchy parents) still need to adjust their header position
            this.refreshLabelWidth();
        }

        this.setCollapsed(this.collapsed);

        this.DOM.inited = true;
    },
    /** -- */
    init_DOM_Attrib: function(){
        var me=this;
        this.DOM.wrapper = this.DOM.root.append("div").attr("class","wrapper");

        this.DOM.facetCategorical = this.DOM.wrapper.append("div").attr("class","facetCategorical");

        // create config row(s) if needed
        if(this.showTextSearch || this.sortingOpts.length>1) {
            this.DOM.facetControls = this.DOM.facetCategorical.append("div").attr("class","facetControls");
            if(this.showTextSearch){
                this.initDOM_TextSearch();
                this.configRowCount++;
                if(this.sortingOpts.length<=1){
                    this.initDOM_insertSortButton(this.DOM.facetControls.select(".attribTextSearch"));
                }
            }
            if(this.sortingOpts.length>1) {
                this.initDOM_SortingOpts();
                this.configRowCount++;
            }
        }

        this.DOM.scrollToTop = this.DOM.facetCategorical.append("div")
            .attr("class","scrollToTop fa fa-arrow-up")
            .on("click",function(d){ 
                kshf.Util.scrollToPos_do(me.DOM.attribGroup[0][0],0);
                this.tipsy.hide();
                if(sendLog) sendLog(kshf.LOG.FACET_SCROLL_TOP, {id:me.id} );
            })
            .each(function(){
                this.tipsy = new Tipsy(this, {gravity: 'e', title: function(){ return "Scroll to top"; }});
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            ;

        this.DOM.attribGroup = this.DOM.facetCategorical.append("div").attr("class","attribGroup")
            .on("scroll",function(d){
                if(kshf.Util.ignoreScrollEvents===true) return;
                me.scrollTop_cache = me.DOM.attribGroup[0][0].scrollTop;

                me.DOM.scrollToTop.style("visibility", me.scrollTop_cache>0?"visible":"hidden");

                me.attrib_InDisplay_First = Math.floor( me.scrollTop_cache/me.heightRow_attrib);
                me.refreshScrollDisplayMore(me.attrib_InDisplay_First+me.catCount_InDisplay);
                me.updateAttribCull();
                me.cullAttribs();
                me.refreshMeasureLabel();

                me.browser.pauseResultPreview = true;
                if(this.pauseTimer) clearTimeout(this.pauseTimer);
                this.pauseTimer = setTimeout(function(){me.browser.pauseResultPreview=false;}, 200);
            })
            ;

        this.DOM.belowAttribs = this.DOM.facetCategorical.append("div").attr("class","belowAttribs");
        this.DOM.belowAttribs.append("div").attr("class", "border_line");
        
        this.insertChartAxis_Measure.call(this,this.DOM.belowAttribs,'e','e');

        // this helps us makes sure that the div height is correctly set to visible number of rows
        this.DOM.chartBackground = this.DOM.attribGroup.append("span").attr("class","chartBackground");

        var mmm=this.DOM.belowAttribs.append("div").attr("class","hasLabelWidth");
        this.DOM.scroll_display_more = mmm.append("span").attr("class","scroll_display_more")
            .on("click",function(){
                kshf.Util.scrollToPos_do(
                    me.DOM.attribGroup[0][0],me.DOM.attribGroup[0][0].scrollTop+me.heightRow_attrib);
                if(sendLog) sendLog(kshf.LOG.FACET_SCROLL_MORE, {id:me.id});
            });

        this.insertAttribs();

        this.refreshLabelWidth();

        this.updateSorting(0, true);
    },
    initDOM_insertSortButton: function(targetDom){
        var me=this;
        this.DOM.sortButton = targetDom.append("span").attr("class","sortButton fa")
            .on("click",function(d){
                if(me.dirtySort){
                    me.dirtySort=false;
                    me.DOM.root.attr("refreshSorting",false);
                    me.updateSorting(0,true); // no delay
                    return;
                }
                me.sortingOpt_Active.inverse = me.sortingOpt_Active.inverse?false:true;
                this.setAttribute("inverse",me.sortingOpt_Active.inverse);
                me.updateSorting(0,true);
            })
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: 'w', title: function(){
                        return me.dirtySort?"Reorder":"Reverse order";
                    }
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); });

        this.DOM.sortButton.style("display",(this.sortingOpt_Active.no_resort?"none":"inline-block"));
    },
    /** -- */
    initDOM_SortingOpts: function(){
        var me=this;
        var sortGr = this.DOM.facetControls.append("span").attr("class","sortOptionSelectGroup hasLabelWidth");

        sortGr.append("select").attr("class","optionSelect").attr("dir","rtl")
            .on("change", function(){
                me.sortingOpt_Active = me.sortingOpts[this.selectedIndex];
                me.DOM.sortButton.style("display",(me.sortingOpt_Active.no_resort?"none":"inline-block"));
                
                me.DOM.sortButton.attr("inverse",me.sortingOpt_Active.inverse);
                me.updateSorting.call(me,0,true);
                if(sendLog) sendLog(kshf.LOG.FACET_SORT, {id:me.id, info:this.selectedIndex});
            })
            .selectAll("input.sort_label").data(this.sortingOpts)
              .enter().append("option").attr("class", "sort_label")
                .text(function(d){ return d.name; })
                ;

        this.initDOM_insertSortButton(sortGr);
    },
    /** -- */
    initDOM_TextSearch: function(){
        var me=this;
        var textSearchRowDOM = this.DOM.facetControls.append("div").attr("class","attribTextSearch hasLabelWidth");
        this.DOM.attribTextSearch=textSearchRowDOM.append("input")
            .attr("class","attribTextSearchInput")
            .attr("type","text")
            .attr("placeholder","Search")
            .on("input",function(){
                if(this.timer){
                    clearTimeout(this.timer);
                }
                var x = this;
                this.timer = setTimeout( function(){
                    var v=x.value.toLowerCase();
                    if(v===""){
                        me.summaryFilter.clearFilter();
                    } else {
                        me.DOM.attribTextSearchControl.attr("showClear",true);
                        me.summaryFilter.selected_All_clear();
                        me._cats.forEach(function(attrib){
                            if(me.catLabelText(attrib).toString().toLowerCase().indexOf(v)!==-1){
                                attrib.set_OR(me.summaryFilter.selected_OR);
                            } else {
                                // search in tooltiptext
                                if(me.catTooltipText && 
                                    me.catTooltipText(attrib).toLowerCase().indexOf(v)!==-1) {
                                        attrib.set_OR(me.summaryFilter.selected_OR);
                                } else{
                                    attrib.set_NONE();
                                }
                            }
                        });
                        if(me.summaryFilter.selectedCount_Total()===0){
                            me.summaryFilter.clearFilter();                            
                        } else {
                            me.summaryFilter.how = "All";
                            me.summaryFilter.addFilter(true);
                            me.summaryFilter.linkFilterSummary = "";
                            if(sendLog) sendLog(kshf.LOG.FILTER_TEXTSEARCH, {id:me.summaryFilter.id, info:v});
                        }
                    }
                }, 750);
            })
            .on("blur",function(){
                d3.event.stopPropagation();
                d3.event.preventDefault();
            })
            ;
        this.DOM.attribTextSearchControl = textSearchRowDOM.append("span")
            .attr("class","attribTextSearchControl fa")
            .on("click",function() { me.summaryFilter.clearFilter(); });
    },
    /** returns the maximum active aggregate value per row in chart data */
    getMaxAggregate_Active: function(){
        return d3.max(this._cats, function(d){ return d.aggregate_Active; });
    },
    /** returns the maximum total aggregate value stored per row in chart data */
    getMaxAggregate_Total: function(){
        var subMax=0;
        // recurse
        if(this.subFacets.length>0){
            subMax = d3.max(this.subFacets, function(f){ return f.getMaxAggregate_Total(v); });
        }
        if(!this.hasAttribs()) return subMax;;
        if(this._maxBarValueMaxPerAttrib) return this._maxBarValueMaxPerAttrib;
        this._maxBarValueMaxPerAttrib = d3.max(this._cats, function(d){ return d.aggregate_Total;});
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
        this.summaryFilter.selected_OR.forEach(function(attrib){
            attrib.DOM.facet.setAttribute("show-box",show_box);
        },this);
        this.summaryFilter.selected_AND.forEach(function(attrib){
            attrib.DOM.facet.setAttribute("show-box",show_box);
        },this);
        this.summaryFilter.selected_NOT.forEach(function(attrib){
            attrib.DOM.facet.setAttribute("show-box","true");
        },this);
    },
    /** -- */
    unselectAllAttribs: function(){
        this._cats.forEach(function(cat){ 
            if(cat.f_selected() && cat.DOM.facet)
                cat.DOM.facet.setAttribute("highlight",false);
            cat.set_NONE();
        });
        this.summaryFilter.selected_All_clear();
    },
    /** -- */
    selectAllAttribsButton: function(){
        this._cats.forEach(function(attrib){ 
            if(!attrib.selectedForLink) return;
            attrib.set_OR(this.summaryFilter.selected_OR);
        },this);
        this._update_Selected();
        this.summaryFilter.how="All";
        this.summaryFilter.addFilter(true);
        if(sendLog) sendLog(kshf.LOG.FILTER_ATTR_ADD_OR_ALL, {id: this.summaryFilter.id} );
    },
    /** -- */
    setCollapsed: function(v){
        var oldV = this.collapsed;
        this.collapsed = v;
        if(this.DOM.root){
            if(oldV===true&v===false){
                this.refreshViz_All();
            }
            this.DOM.root.attr("collapsed",this.collapsed===false?"false":"true");
        }
        // collapse children only if this is a hierarchy, not sub-filtering
        if(this.hasSubFacets() && !this.hasAttribs()){
            this.subFacets.forEach(function(f){ f.setCollapsed(v); });
        }
    },
    /** -- */
    clearLabelTextSearch: function(){
        if(!this.showTextSearch) return;
        this.DOM.attribTextSearchControl.attr("showClear",false);
        this.DOM.attribTextSearch[0][0].value = '';
    },
    /** -- */
    updateBarPreviewScale2Active: function(){
        if(!this.hasAttribs()) return; // nothing to do
        var me=this;
        this.chartScale_Measure
            .rangeRound([0, this.panel.width.catChart])
            .nice(this.chartAxis_Measure_TickSkip())
            .clamp(true)
            .domain([
                0,
                (this.catBarScale==="scale_frequency")?
                    this.browser.itemsWantedCount:
                    this.getMaxAggregate_Active()
            ])
            ;

        this.refreshViz_Active();
        this.refreshViz_Total();
        this.refreshViz_Compare();
        this.refreshViz_Axis();

        this.DOM.aggr_Preview.attr("fast",null); // take it slow for result preview animations
        this.refreshViz_Preview();
        setTimeout(function(){ me.DOM.aggr_Preview.attr("fast",true); },700);
    },
    /** -- */
    setHeight: function(newHeight){
        if(!this.hasAttribs()) return;
        var attribHeight_old = this.attribHeight;
        var attribHeight_new = Math.min(
            newHeight-this.getHeight_Header()-this.getHeight_Config()-this.getHeight_Bottom()+2,
            this.heightRow_attrib*this.catCount_Visible);

//        if(this.attribHeight===attribHeight_new) return;
        this.attribHeight = attribHeight_new;

        // update catCount_InDisplay
        var c = Math.floor(this.attribHeight / this.heightRow_attrib);
        var c = Math.floor(this.attribHeight / this.heightRow_attrib);
        if(c<0) c=1;
        if(c>this.catCount_Visible) c=this.catCount_Visible;
        if(this.catCount_Visible<=2){ 
            c = this.catCount_Visible;
        } else {
            c = Math.max(c,2);
        }
        this.catCount_InDisplay = c+1;
        this.catCount_InDisplay = Math.min(this.catCount_InDisplay,this.catCount_Total);

        this.refreshScrollDisplayMore(this.catCount_InDisplay);

        this.updateAttribCull();
        this.cullAttribs();

        if(this.cbSetHeight && attribHeight_old!==attribHeight_new) this.cbSetHeight(this);
    },
    /** -- */
    updateAfterFilter: function(resultChange){
        if(!this.hasAttribs()) return;
        this.refreshMeasureLabel();
        this.updateBarPreviewScale2Active();

        if(this.show_cliques) {
            this.dirtySort = true;
            this.DOM.root.attr("refreshSorting",true);
        }

        if(!this.dirtySort) {
            this.updateSorting();
        } else {
            this.refreshViz_All();
            this.refreshViz_Active();
        }
    },
    /** -- */
    refreshWidth: function(){
        if(this.DOM.facetCategorical){
            this.DOM.facetCategorical.style("width",this.getWidth()+"px");
            this.DOM.summaryTitle.style("max-width",(this.getWidth()-40)+"px");
            this.DOM.summaryTitle_edit.style("width",(this.getWidth()-80)+"px");
            this.DOM.chartAxis_Measure.select(".background")
                .style("width",this.chartScale_Measure.range()[1]+"px");
        }
    },
    /** -- */
    refreshMeasureLabel: function(){
        if(!this.hasAttribs()) return;
        var me=this;

        this.DOM.attribs.attr("noitems",function(aggr){ return !me.isAttribSelectable(aggr); });

        this.DOM.measureLabel.each(function(attrib){
            if(attrib.isCulled) return;
            var p=attrib.aggregate_Preview;
            if(me.browser.resultPreviewActive){
                if(me.browser.preview_not)
                    p = attrib.aggregate_Active-attrib.aggregate_Preview;
                else
                    p = attrib.aggregate_Preview;
            } else {
                p = attrib.aggregate_Active;
            }
            if(me.browser.percentModeActive){
                if(attrib.aggregate_Active===0){
                    this.textContent = "";
                } else {
                    if(me.browser.ratioModeActive){
                        if(!me.browser.resultPreviewActive){
                            this.textContent = "";
                            return;
                        }
                        p = 100*p/attrib.aggregate_Active;
                    } else {
                        p = 100*p/me.browser.itemsWantedCount;
                    }
                    this.textContent = p.toFixed(0)+"%";
                }
            } else {
                this.textContent = kshf.Util.formatForItemCount(p);
            }
        });
    },
    /** -- */
    refreshViz_All: function(){
        if(!this.hasAttribs()) return;
        var me=this;
        this.refreshViz_Total();
        this.refreshViz_Active();

        this.DOM.aggr_Preview.attr("fast",null); // take it slow for result preview animations
        this.refreshViz_Preview();
        setTimeout(function(){ me.DOM.aggr_Preview.attr("fast",true); },700);

        this.refreshViz_Compare();
        this.refreshMeasureLabel();
        this.refreshViz_Axis();
    },
    /** -- */
    refreshViz_Active: function(){
        if(!this.hasAttribs() || this.collapsed) return;
        var me=this;
        var width_Text = this.getWidth_Text();
        var width_vizFull = this.chartScale_Measure.range()[1];
        var func_barScale, func_clickAreaScale;
        if(this.browser.ratioModeActive){
            func_barScale = function(attrib){
                kshf.Util.setTransform(this,
                    "scaleX("+((attrib.aggregate_Active===0)?0:width_vizFull)+")");
            };
            func_clickAreaScale = function(attrib){
                return (width_Text+((attrib.aggregate_Active===0)?0:width_vizFull))+"px";
            };
        } else {
            func_barScale = function(attrib){
                kshf.Util.setTransform(this,
                    "scaleX("+me.chartScale_Measure(attrib.aggregate_Active)+")");
            };
            func_clickAreaScale = function(attrib){
                return (width_Text+me.chartScale_Measure(attrib.aggregate_Active))+"px";
            };
        }
        this.DOM.aggr_Active.each(func_barScale);
        this.DOM.attribClickArea.style("width",func_clickAreaScale);
        this.DOM.compareButton.style("left",func_clickAreaScale);
    },
    /** -- */
    refreshViz_Total: function(){
        if(!this.hasAttribs() || this.collapsed) return;
        var me = this;
        // Do not need to update total. Total value is invisible. Percent view is based on active count.
        if(!this.browser.ratioModeActive){
            this.DOM.aggr_Total.each(function(attrib){
                kshf.Util.setTransform(this,
                    "scaleX("+me.chartScale_Measure(attrib.aggregate_Total)+")");
            });
            this.DOM.aggr_TotalTip.each(function(attrib){
                kshf.Util.setTransform(this,
                    "translateX("+me.chartScale_Measure(attrib.aggregate_Total)+"px)");
            }).style("opacity",function(attrib){
                return (attrib.aggregate_Total>me.chartScale_Measure.domain()[1])?1:0;
            });
        } else {
            this.DOM.aggr_TotalTip.style("opacity",0);
        }
    },
    /** -- */
    refreshViz_Compare: function(){
        if(!this.hasAttribs() || this.collapsed) return;
        var me=this;
        if(this.browser._previewCompare_Active){
            this.getCategoryTable().forEach(function(attrib){
                if(attrib.cache_compare===undefined){
                    attrib.cache_compare=attrib.cache_preview;
                }
            });
            if(this.browser.ratioModeActive){
                this.DOM.aggr_Compare.each(function(attrib){
                    var w=(attrib.cache_compare/attrib.aggregate_Active)*me.chartScale_Measure.range()[1];
                    kshf.Util.setTransform(this,"scaleX("+(w)+")");
                });
            } else {
                this.DOM.aggr_Compare.each(function(attrib){
                    kshf.Util.setTransform(this,"scaleX("+
                        (me.chartScale_Measure(attrib.cache_compare))+")");
                });
            }
        } else {
            this.getCategoryTable().forEach(function(attrib){
                delete attrib.cache_compare;
            });
        }
    },
    /** -- */
    refreshViz_Preview: function(){
        if(!this.hasAttribs() || this.collapsed) return;
        var me=this;
        if(this.browser.ratioModeActive){
            this.DOM.aggr_Preview.each(function(attrib){
                var p=attrib.aggregate_Preview;
                if(me.browser.preview_not) p = attrib.aggregate_Active-p;
                attrib.cache_preview = p;
                var w= (p / attrib.aggregate_Active)*me.chartScale_Measure.range()[1];
                kshf.Util.setTransform(this,"scaleX("+w+")");
            });
        } else {
            this.DOM.aggr_Preview.each(function(attrib){
                var p=attrib.aggregate_Preview;
                if(me.browser.preview_not) p = attrib.aggregate_Active-p;
                attrib.cache_preview = p;
                kshf.Util.setTransform(this,"scaleX("+me.chartScale_Measure(p)+")");
            });
        }
        this.refreshMeasureLabel();
    },
    /** -- */
    clearViz_Preview: function(){
        var me=this;
        if(!this.hasAttribs()) return;
        this._cats.forEach(function(attrib){
            attrib.updatePreview_Cache = false;
        });
        if(this.collapsed) return;
        var me = this;
        this.DOM.aggr_Preview.each(function(attrib){
            attrib.aggregate_Preview=0;
            if(attrib.cache_preview===0) return;
            kshf.Util.setTransform(this,"scaleX(0)");
        });
        this.refreshMeasureLabel();
    },
    /** -- */
    refreshViz_Axis: function(){
        if(!this.hasAttribs()) return;
        var me=this;

        var tickValues;
        var transformFunc;

        var maxValue;

        var chartWidth = this.panel.width.catChart;

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
                maxValue = Math.round(100*me.getMaxAggregate_Active()/me.browser.itemsWantedCount);
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
        tickData_new.append("span").attr("class","line")
            .style("top","-"+(this.attribHeight+2)+"px")
            .style("height",this.attribHeight+"px");

        if(this.browser.ratioModeActive){
            tickData_new.append("span").attr("class","text").text(function(d){return d;});
        } else {
            tickData_new.append("span").attr("class","text").text(function(d){return d3.format("s")(d);});
        }
        if(this.configRowCount>0){
            var h=this.attribHeight;
            var hm=tickData_new.append("span").attr("class","text text_upper").style("top",(-h-19)+"px");
            if(this.browser.ratioModeActive){
                hm.text(function(d){return d;});
            } else {
                hm.text(function(d){return d3.format("s")(d);});
            }
        }

        setTimeout(function(){
            me.DOM.chartAxis_Measure.selectAll("span.tick").style("opacity",1).each(transformFunc);
        });

        tickDoms.exit().remove();
    },
    /** -- */
    refreshLabelWidth: function(w){
        if(!this.hasAttribs()) return;
        if(this.DOM.facetCategorical===undefined) return;
        var labelWidth = this.getWidth_Label();
        var barChartMinX = labelWidth + this.panel.width.catQueryPreview;

        this.DOM.facetCategorical.selectAll(".hasLabelWidth").style("width",labelWidth+"px");
        this.DOM.item_count_wrapper
            .style("width",(this.panel.width.catQueryPreview)+"px")
            .style("left",labelWidth+"px")
            ;
        this.DOM.chartAxis_Measure.each(function(d){
            kshf.Util.setTransform(this,"translateX("+barChartMinX+"px)");
        });
        this.DOM.aggr_Group.style("left",barChartMinX+"px");
        this.DOM.chartBackground.style("margin-left",barChartMinX+"px");
        if(this.DOM.sortButton)
            this.DOM.sortButton.style("width",this.panel.width.catQueryPreview+"px");
    },
    /** -- */
    refreshScrollDisplayMore: function(bottomItem){
        if(this.catCount_Total<=4) {
            this.DOM.scroll_display_more.style("display","none");
            return;
        }
        var moreTxt = ""+this.catCount_Visible+" Row";
        if(this.catCount_Visible>1) moreTxt+="s";
        var below = this.catCount_Visible-bottomItem-1;
        if(below>0) moreTxt+=", <span class='fa fa-angle-down'></span> "+below+" more ";
        this.DOM.scroll_display_more.html(moreTxt);
    },
    /** -- */
    refreshHeight: function(){
        // Note: if this has attributes, the total height is computed from height of the children by html layout engine.
        // So far, should be pretty nice.
        if(!this.hasAttribs()) return;

        this.DOM.wrapper.style("height",(this.collapsed?"0":this.getHeight_Content()-2)+"px");
        this.DOM.attribGroup.style("height",this.attribHeight+"px"); // 1 is for borders...

        var h=this.attribHeight;
        this.DOM.chartAxis_Measure.selectAll(".line").style("top",(-h-1)+"px").style("height",h+"px");
        this.DOM.chartAxis_Measure.selectAll(".text_upper").style("top",(-h-19)+"px");
    },
    /** -- */
    setHeightRow_attrib: function(h){
        var me=this;
        if(this.heightRow_attrib===h) return;
        this.heightRow_attrib = h;

        this.browser.setNoAnim(true);
        
        this.browser.updateLayout();
        
        this.DOM.attribs.each(function(attrib){
            var yPos = me.heightRow_attrib*attrib.orderIndex;
            kshf.Util.setTransform(this,"translate("+attrib.posX+"px,"+yPos+"px)");
            // padding!
            var marginTop = 0;
            //if(me.heightRow_attrib>19){
                marginTop = (me.heightRow_attrib-18)/2;
            //}
            this.style.marginTop = marginTop+"px";
        });
        this.DOM.chartBackground.style("height",(this.getTotalAttribHeight())+"px");

        setTimeout(function(){
            me.browser.setNoAnim(false);
        },100);
    },
    /** -- */
    isAttribVisible: function(attrib){
        if(this.isLinked){
            if(attrib.selectedForLink===false) return false;
            return true;
        }

        // Show selected attribute always
        if(attrib.f_selected()) return true;
        // Show if number of active items is not zero
        if(attrib.aggregate_Active!==0) return true;
        // Show if item has been "isWanted" by some active sub-filtering
        if(this.catCount_Wanted < this.catCount_Total && attrib.isWanted) return true;
        // if inactive attributes are not removed, well, don't remove them...
        if(this.removeInactiveCats===false) return true;
        // summary is not filtered yet, cannot click on 0 items
        if(!this.isFiltered()) return attrib.aggregate_Active!==0;
        // Hide if multiple options are selected and selection is and
//        if(this.summaryFilter.selecttype==="SelectAnd") return false;
        // TODO: Figuring out non-selected, zero-active-item attribs under "SelectOr" is tricky!

//        if(attrib.orderIndex===this.catCount_Total) return true;

        if(attrib.isWanted===false) return false;
        return true;
    },
    /** -- */
    isAttribSelectable: function(attrib){
        // Show selected attribute always
        if(attrib.f_selected()) return true;
        // Show if number of active items is not zero
        if(attrib.aggregate_Active!==0) return true;
        // Show if multiple attributes are selected and the summary does not include multi value items
        if(this.isFiltered() && !this.hasMultiValueItem) return true;
        // Hide
        return false;
    },
    /** When clicked on an attribute ... */
    /* what: AND / OR / NOT */
    filterAttrib: function(attrib, what, how){
        if(this.browser.skipSortingFacet){
            // you can now sort the last filtered summary, attention is no longer there.
            this.browser.skipSortingFacet.dirtySort = false;
            this.browser.skipSortingFacet.DOM.root.attr("refreshSorting",false);
        }
        this.browser.skipSortingFacet=this;
        this.browser.skipSortingFacet.dirtySort = true;
        this.browser.skipSortingFacet.DOM.root.attr("refreshSorting",true);

        var i=0;

        var preTest = (this.summaryFilter.selected_OR.length>0 && (this.summaryFilter.selected_AND.length>0 ||
                this.summaryFilter.selected_NOT.length>0));

        // if selection is in same mode, "undo" to NONE.
        if(what==="NOT" && attrib.is_NOT()) what = "NONE";
        if(what==="AND" && attrib.is_AND()) what = "NONE";
        if(what==="OR"  && attrib.is_OR() ) what = "NONE";

        if(what==="NONE"){
            if(attrib.is_AND() || attrib.is_NOT()){
                this.summaryFilter.how = "MoreResults";
            }
            if(attrib.is_OR()){
                this.summaryFilter.how = this.summaryFilter.selected_OR.length===0?"MoreResults":"LessResults";
            }
            attrib.set_NONE();
            if(this.summaryFilter.selected_OR.length===1 && this.summaryFilter.selected_AND.length===0){
                this.summaryFilter.selected_OR.forEach(function(a){ 
                    a.set_NONE();
                    a.set_AND(this.summaryFilter.selected_AND);
                },this);
            }
            if(!this.summaryFilter.selected_Any()){
                this.dirtySort = false;
                this.DOM.root.attr("refreshSorting",false);
            }
            if(sendLog) sendLog(kshf.LOG.FILTER_ATTR_UNSELECT, {id:this.summaryFilter.id, info:attrib.id()});
        }
        if(what==="NOT"){
            if(attrib.is_NONE()){
                if(attrib.aggregate_Active===this.browser.itemsWantedCount){
                    alert("Removing this category will create an empty result list, so it is not allowed.");
                    return;
                }
                this.summaryFilter.how = "LessResults";
            } else {
                this.summaryFilter.how = "All";
            }
            attrib.set_NOT(this.summaryFilter.selected_NOT);
            if(sendLog) sendLog(kshf.LOG.FILTER_ATTR_ADD_NOT, {id:this.summaryFilter.id, info:attrib.id()});
        }
        if(what==="AND"){
            attrib.set_AND(this.summaryFilter.selected_AND);
            this.summaryFilter.how = "LessResults";
            if(sendLog) sendLog(kshf.LOG.FILTER_ATTR_ADD_AND, {id:this.summaryFilter.id, info:attrib.id()});
        }
        if(what==="OR"){
            if(!this.hasMultiValueItem && this.summaryFilter.selected_NOT.length>0){
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
            attrib.set_OR(this.summaryFilter.selected_OR);
            this.summaryFilter.how = "MoreResults";
            if(sendLog) sendLog(kshf.LOG.FILTER_ATTR_ADD_OR, {id:this.summaryFilter.id, info:attrib.id()});
        }
        if(how) this.summaryFilter.how = how;

        if(preTest){
            this.summaryFilter.how = "All";
        }
        if(this.summaryFilter.selected_OR.length>0 && (this.summaryFilter.selected_AND.length>0 ||
                this.summaryFilter.selected_NOT.length>0)){
            this.summaryFilter.how = "All";
        }

        if(this.summaryFilter.selectedCount_Total()===0){
            this.summaryFilter.clearFilter();
            return;
        }
        this.clearLabelTextSearch();
        this.summaryFilter.linkFilterSummary = "";
        this.summaryFilter.addFilter(true);
    },
    /** -- */
    cbAttribEnter: function(attrib){
        var me=this;
        if(this.isAttribSelectable(attrib)) {
            attrib.DOM.facet.setAttribute("selecttype","and");
            attrib.DOM.facet.setAttribute("highlight","selected");
            if(!this.hasMultiValueItem && this.summaryFilter.selected_AND.length!==0) {
                return;
            }
            attrib.highlightAll(true);
            var timeoutTime = 400;
            if(this.browser._previewCompare_Active) timeoutTime = 0;
            this.resultPreviewShowTimeout = setTimeout(function(){
                if(!me.browser.pauseResultPreview && 
                  (me.hasMultiValueItem || me.summaryFilter.selected_OR.length===0) &&
                  (!attrib.is_NOT()) ){
                    // calculate the preview
                    attrib.items.forEach(function(item){item.updatePreview(me.parentFacet);},me);
                    me.browser.itemCount_Previewed = attrib.items.length;
                    attrib.DOM.facet.setAttribute("showlock",true);
                    me.browser.refreshResultPreviews(attrib);
                    if(sendLog) {
                        if(me.resultPreviewLogTimeout) clearTimeout(me.resultPreviewLogTimeout);
                        me.resultPreviewLogTimeout = setTimeout(function(){
                            sendLog(kshf.LOG.FILTER_PREVIEW, {id:me.summaryFilter.id, info: attrib.id()});
                        }, 1000); // wait 1 second to see the update fully
                    }
                }
            },timeoutTime);
        } else {
            if(this.tipsy_title===undefined) return;
        }

//        this.cbAttribEnter_Tipsy(attrib);
    },
    cbAttribEnter_Tipsy: function(attrib){
        if(attrib.cliqueRow)
            attrib.cliqueRow.setAttribute("highlight","selected");

        var attribTipsy = attrib.DOM.facet.tipsy;
        attribTipsy.options.className = "tipsyFilterAnd";
        attribTipsy.hide();

        attrib.DOM.facet.tipsy_active = attribTipsy;
        this.tipsy_active = attribTipsy;

        var offset=0;
        if(!this.panel.hideBars){
            if(this.browser.ratioModeActive){
                offset+=this.chartScale_Measure.range()[1];
            } else {
                offset+=this.chartScale_Measure(attrib.aggregate_Active)
            }
        }
        offset+=this.getWidth_Text();
        offset+=9; // lock icon
        attrib.DOM.facet.tipsy_active.options.offset_x = offset;
        //attrib.DOM.facet.tipsy_active.options.offset_y = 8;//+(this.heightRow_attrib-18)/2;
        attrib.DOM.facet.tipsy_active.show();
    },
    /** -- */
    cbAttribLeave: function(attrib){
        if(attrib.skipMouseOut !==undefined && attrib.skipMouseOut===true){
            attrib.skipMouseOut = false;
            return;
        }

        if(attrib.cliqueRow)
            attrib.cliqueRow.setAttribute("highlight",false);

        if(!this.isAttribSelectable(attrib)) return;
        attrib.nohighlightAll(true);

        if(this.resultPreviewLogTimeout){
            clearTimeout(this.resultPreviewLogTimeout);
        }
        this.browser.items.forEach(function(item){
            if(item.DOM.result) item.DOM.result.setAttribute("highlight",false);
        },this);

        if(!this.browser.pauseResultPreview){
            attrib.DOM.facet.setAttribute("showlock",false);
            this.browser.clearResultPreviews();
        }

        if(this.resultPreviewShowTimeout){
            clearTimeout(this.resultPreviewShowTimeout);
            this.resultPreviewShowTimeout = null;
        }
    },
    /** - */
    insertAttribs: function(){
        var me = this;
        this.resultPreviewLogTimeout = null;

        var domAttribs_new = this.DOM.attribGroup.selectAll(".attrib")
            .data(this._cats, function(attrib){ 
                return attrib.id();
            })
        .enter().append("span")
            .attr("class","attrib")
            .on("mouseenter",function(attrib){ me.cbAttribEnter(attrib);})
            .on("mouseleave",function(attrib){ me.cbAttribLeave(attrib);})
            .attr("highlight",false)
            .attr("showlock" ,false)
            .attr("selected",0)
            .each(function(attrib,i){
                attrib.facet = me;
                attrib.DOM.facet = this;
                attrib.isVisible = true;
                this.isLinked = me.isLinked;

                attrib.pos_y = 0;
                kshf.Util.setTransform(this,"translateY(0px)");
                this.tipsy = new Tipsy(this, {
                    gravity: 'w',
                    title: function(){
                        if(this.tipsy_title) return this.tipsy_title;
                        var hasMultiValueItem=attrib.facet.hasMultiValueItem;
                        if(attrib.is_AND() || attrib.is_OR() || attrib.is_NOT())
                            return "<span class='action'><span class='fa fa-times'></span> Remove</span> from filter";
                        if(!me.summaryFilter.selected_Any())
                            return "<span class='action'><span class='fa fa-plus'></span> And</span>";
                        if(hasMultiValueItem===false)
                            return "<span class='action'><span class='fa fa-angle-double-left'></span> Change</span> filter";
                        else
                            return "<span class='action'><span class='fa fa-plus'></span> And<span>";
                    }
                });
            })
            ;
        this.updateAttribCull();

        if(this.catTooltipText){
            domAttribs_new.attr("title",function(attrib){
                return me.catTooltipText.call(this,attrib);
            });
        }

        var cbAttribClick = function(attrib){
            if(!me.isAttribSelectable(attrib)) return;

///            if(attrib.DOM.facet.tipsy_active) attrib.DOM.facet.tipsy_active.hide();

            if(this.timer){
                // double click
                // Only meaningul & active if facet has multi value items
                me.unselectAllAttribs();
                me.filterAttrib("AND","All");
                if(sendLog) sendLog(kshf.LOG.FILTER_ATTR_EXACT,{id: me.summaryFilter.id, info: attrib.id()});
                return;
            } else {
                if(attrib.is_NOT()){
                    me.filterAttrib(attrib,"NOT");
                } else if(attrib.is_AND()){
                    me.filterAttrib(attrib,"AND");
                } else if(attrib.is_OR()){
                    me.filterAttrib(attrib,"OR");
                } else {
                    // remove the single selection if it is defined with OR
                    if(!me.hasMultiValueItem && me.summaryFilter.selected_Any()){
                        if(me.summaryFilter.selected_OR.indexOf(attrib)<0){
                            var temp = [];
                            me.summaryFilter.selected_OR.forEach(function(a){ temp.push(a); });
                            temp.forEach(function(a){ a.set_NONE(); });
                        }
                        if(me.summaryFilter.selected_AND.indexOf(attrib)<0){
                            var temp = [];
                            me.summaryFilter.selected_AND.forEach(function(a){ temp.push(a); });
                            temp.forEach(function(a){ a.set_NONE(); });
                        }
                        if(me.summaryFilter.selected_NOT.indexOf(attrib)<0){
                            var temp = [];
                            me.summaryFilter.selected_NOT.forEach(function(a){ temp.push(a); });
                            temp.forEach(function(a){ a.set_NONE(); });
                        }
                        me.filterAttrib(attrib,"AND","All");
                    } else {
                        me.filterAttrib(attrib,"AND");
                    }
                }
            }
            if(me.hasMultiValueItem){
                var x = this;
                this.timer = setTimeout(function() { x.timer = null; }, 500);
            }
        };

        var dragged;
        var draggedAttrib = null;
        var attribDrag = function(d){
            this.addEventListener("dragstart", function( event ) {
                // store a ref. on the dragged elem
                dragged = event.target;
                draggedAttrib = d;
                // make it half transparent
                event.target.style.opacity = .5;
            }, false);
            this.addEventListener("dragend", function( event ) {
                // reset the transparency
                event.target.style.opacity = "";
                draggedAttrib = null;
            }, false);
            this.addEventListener("dragover", function( event ) {
                // prevent default to allow drop
                event.preventDefault();
            }, false);
            this.addEventListener("dragenter", function( event ) {
                // highlight potential drop target when the draggable element enters it
                if(draggedAttrib) {
                    event.target.style.background = "rgba(0,0,150,0.5)";
                }
            }, false);
            this.addEventListener("dragleave", function( event ) {
                // reset background of potential drop target when the draggable element leaves it
                if(draggedAttrib) {
                    event.target.style.background = "";
                }
            }, false);
            this.addEventListener("drop", function( event ) {
                // prevent default action (open as link for some elements)
                event.preventDefault();
                // move dragged elem to the selected drop target
                if ( event.target.className == "clickArea" ) {
                    event.target.style.background = "";
                    var item1 = dragged.__data__;
                    var item2 = event.target.__data__;
                    me._cats[item2.orderIndex] = item1;
                    me._cats[item1.orderIndex] = item2;
                    var tmp = item2.orderIndex
                    item2.orderIndex = item1.orderIndex;
                    item1.orderIndex = tmp;

                    item1.DOM.facet.tipsy.hide();
                    item2.DOM.facet.tipsy.hide();
                    item2.DOM.facet.setAttribute("highlight",false);
                    item2.DOM.facet.setAttribute("highlight",false);

                    me.DOM.attribs.each(function(attrib){
                        if(attrib.isVisible){
                            attrib.posX = 0;
                            attrib.posY = me.heightRow_attrib*attrib.orderIndex;
                            attrib.posY = me.heightRow_attrib*attrib.orderIndex;
                            kshf.Util.setTransform(this,"translate("+attrib.posX+"px,"+attrib.posY+"px)");
                        }
                    });

                    if(me.cbFacetSort) me.cbFacetSort.call(me);
                }
            }, false);
        };

        var cbOrEnter = function(attrib,i){
            me.browser.clearResultPreviews();
            attrib.DOM.facet.setAttribute("selecttype","or");
            if(me.summaryFilter.selected_OR.length>0)
                me.browser.clearResultPreviews();

            var DOM_facet = attrib.DOM.facet;
            DOM_facet.tipsy.hide();

            d3.event.stopPropagation();
        };
        var cbOrLeave = function(attrib,i){
            attrib.DOM.facet.setAttribute("selecttype","and");
            d3.event.stopPropagation();
        };
        var cbOrClick = function(attrib,i){
            me.filterAttrib(attrib,"OR");
            this.__data__.DOM.facet.tipsy.hide();
            d3.event.stopPropagation();
        };

        var cbNotEnter = function(attrib,i){
            // update the tooltip
            var DOM_facet = attrib.DOM.facet;
            DOM_facet.tipsy.hide();
            attrib.DOM.facet.setAttribute("selecttype","not");
            me.browser.DOM.root.attr("preview-not",true);
            me.browser.preview_not = true;
            me.browser.refreshResultPreviews(attrib);
            
            d3.event.stopPropagation();
        };
        var cbNotLeave = function(attrib,i){
            attrib.DOM.facet.setAttribute("selecttype","and");
            setTimeout(function(){me.browser.DOM.root.attr("preview-not",null);}, 0);
            me.browser.preview_not = false;
            me.browser.clearResultPreviews();
            d3.event.stopPropagation();
        };
        var cbNotClick = function(attrib,i){
            me.browser.preview_not = true;
            me.filterAttrib(attrib,"NOT");
            setTimeout(function(){
                me.browser.DOM.root.attr("preview-not",null);
                me.browser.preview_not = false;
            }, 1000);
            d3.event.stopPropagation();
        };

        var domAttrLabel = domAttribs_new.append("span").attr("class", "attribLabel hasLabelWidth");

        // These are "invisible"...
        var domLabelFilterButtons = domAttrLabel.append("span").attr("class", "filterButtons");
            domLabelFilterButtons.append("span").attr("class","notButton fa fa-minus-square")
                .on("mouseenter",cbNotEnter)
                .on("mouseleave",cbNotLeave)
                .on("click",cbNotClick);
            domLabelFilterButtons.append("span").attr("class","orButton") //  fa fa-plus-square
                .on("mouseenter",cbOrEnter)
                .on("mouseleave",cbOrLeave)
                .on("click",cbOrClick);

        var domTheLabel = domAttrLabel.append("span").attr("class","theLabel").html(this.catLabelText);

        domAttribs_new.append("span").attr("class", "item_count_wrapper")
            .append("span").attr("class","measureLabel");
        
        var domBarGroup = domAttribs_new.append("span").attr("class","aggr_Group");
        domBarGroup.append("span").attr("class", "aggr total");
        domBarGroup.append("span").attr("class", "aggr total_tip");
        domBarGroup.append("span").attr("class", "aggr active");
        domBarGroup.append("span").attr("class", "aggr preview").attr("fast",true);
        domBarGroup.append("span").attr("class", "aggr compare").attr("hidden",true);

        domAttribs_new.append("span").attr("class", "clickArea")
            .on("click", cbAttribClick)
            // drag & drop control
            .attr("draggable",true)
            .each(attribDrag)
            ;
    
        domAttribs_new.append("span").attr("class","compareButton fa")
            .on("click",function(attrib){
                me.browser.setPreviewCompare(attrib);
                this.__data__.DOM.facet.tipsy.hide();
                d3.event.stopPropagation();
            })
            .on("mouseenter",function(attrib){
                me.cbAttribEnter_Tipsy(attrib);
                var DOM_facet = attrib.DOM.facet;
                DOM_facet.tipsy.options.className = "tipsyFilterLock";
                DOM_facet.tipsy_title = (me.browser.comparedAggregate!==attrib)?"Lock to compare":"Unlock";
                DOM_facet.tipsy.hide();
                DOM_facet.tipsy.show();
                DOM_facet.tipsy_active = DOM_facet.tipsy;
                me.tipsy_active = DOM_facet.tipsy;
                DOM_facet.tipsy.show();
                d3.event.stopPropagation();
            })
            .on("mouseleave",function(attrib){
                var DOM_facet = attrib.DOM.facet;
                DOM_facet.tipsy.hide();
                attrib.DOM.facet.setAttribute("selecttype","and");
                d3.event.stopPropagation();
            })
            ;

        this.DOM.attribs = this.DOM.attribGroup.selectAll(".attrib")
        this.DOM.attribClickArea = this.DOM.attribs.selectAll(".clickArea");
        this.DOM.compareButton = this.DOM.attribs.selectAll(".compareButton");
        this.DOM.item_count_wrapper = this.DOM.attribs.selectAll(".item_count_wrapper");
        this.DOM.measureLabel = this.DOM.attribs.selectAll(".item_count_wrapper > .measureLabel");

        this.DOM.aggr_Group    = this.DOM.attribs.selectAll(".aggr_Group");
        this.DOM.aggr_Total    = this.DOM.aggr_Group.selectAll(".total");
        this.DOM.aggr_TotalTip = this.DOM.aggr_Group.selectAll(".total_tip");
        this.DOM.aggr_Active   = this.DOM.aggr_Group.selectAll(".active");
        this.DOM.aggr_Preview  = this.DOM.aggr_Group.selectAll(".preview");
        this.DOM.aggr_Compare  = this.DOM.aggr_Group.selectAll(".compare");
    },

    /** -- */
    sortCats: function(){
        var me = this;
        var selectedOnTop = this.sortingOpt_Active.no_resort!==true;
        var inverse = this.sortingOpt_Active.inverse;
        var sortFunc = this.sortingOpt_Active.func;
        var prepSort = this.sortingOpt_Active.prep;
        if(prepSort) prepSort.call(this);

        var idCompareFunc = function(a,b){return b-a;};
        if(typeof(this._cats[0].id())==="string") 
            idCompareFunc = function(a,b){
                return b.localeCompare(a);
            };

        var theSortFunc = function(a,b){
            // linked items...
            if(a.selectedForLink && !b.selectedForLink) return -1;
            if(b.selectedForLink && !a.selectedForLink) return 1;

            if(selectedOnTop){
                if(!a.f_selected() &&  b.f_selected()) return  1;
                if( a.f_selected() && !b.f_selected()) return -1;
            }
            // put the items with zero active items to the end of list (may not be displayed / inactive)
            if(a.aggregate_Active===0 && b.aggregate_Active!==0) return  1;
            if(b.aggregate_Active===0 && a.aggregate_Active!==0) return -1;

            var x=sortFunc(a,b);
            if(x===0) x=idCompareFunc(a.id(),b.id());
            if(inverse) x=-x;
            return x;
        };
        this._cats.sort(theSortFunc);
        this._cats.forEach(function(cat,i){ cat.orderIndex=i; });
    },
    updateAttribCull: function(){
        var me=this;
        this._cats.forEach(function(attrib,i){
            attrib.isCulled_before = attrib.isCulled;
            // not visible if it is not within visible range...
            if(attrib.orderIndex<me.attrib_InDisplay_First) { 
                attrib.isCulled=true;
            }
            else if(attrib.orderIndex>me.attrib_InDisplay_First+me.catCount_InDisplay) {
                attrib.isCulled=true;
            } else {            
                attrib.isCulled=false;
            }
        });
    },
    /** -- */
    updateSorting: function(sortDelay,force){
        if(this.sortingOpt_Active.no_resort===true && force!==true) return;
        if(this.sortingOpt_Active.custom===true&&force!==true) return;
        if(this.removeInactiveCats){
            this.updateCatCount_Visible();
        }
        
        var me = this;
        if(sortDelay===undefined) sortDelay = 1000;
        this.sortCats();
        this.updateAttribCull();

        var xRemoveOffset = -100;
        if(this.panel.name==='right') xRemoveOffset *= -1;
        if(this.cbFacetSort) this.cbFacetSort.call(this);

        setTimeout(function(){
            // 1. Make items disappear
            // Note: do not cull with number of items made visible.
            // We are applying visible and block to ALL attributes as we animate the change
            me.DOM.attribs.each(function(attrib){
                if(!attrib.isVisible && attrib.isVisible_before){
                    // disappear into left panel...
                    this.style.opacity = 0;
                    var x=xRemoveOffset;
                    var y=attrib.posY;
                    attrib.posX = x;
                    attrib.posY = y;
                    kshf.Util.setTransform(this,"translate("+x+"px,"+y+"px)");
                }
                // if item is to appear, move it to the correct y position
                if(attrib.isVisible && !attrib.isVisible_before){
                    var y = me.heightRow_attrib*attrib.orderIndex;
                    kshf.Util.setTransform(this,"translate("+xRemoveOffset+"px,"+y+"px)");
                }
                if(attrib.isVisible || attrib.isVisible_before){
                    this.style.visibility = "visible";
                    this.style.display = "block";
                }
            });
            // 2. Re-sort
            setTimeout(function(){
                me.DOM.attribs.each(function(attrib){
                    if(attrib.isVisible && attrib.isVisible_before){
                        var x = 0;
                        var y = me.heightRow_attrib*attrib.orderIndex;
                        attrib.posX = x;
                        attrib.posY = y;
                        kshf.Util.setTransform(this,"translate("+x+"px,"+y+"px)");
                    }
                });

                // 3. Make items appear
                setTimeout(function(){
                    if(me.catCount_NowVisible>=0){
                        me.DOM.attribs.each(function(attrib){
                            if(attrib.isVisible && !attrib.isVisible_before){
                                this.style.opacity = 1;
                                var x = 0;
                                var y = me.heightRow_attrib*attrib.orderIndex;
                                attrib.posX = x;
                                attrib.posY = y;
                                kshf.Util.setTransform(this,"translate("+x+"px,"+y+"px)");
                            }
                        });
                    }
                    // 4. Apply culling
                    setTimeout(function(){ me.cullAttribs();} , 700);
                },(me.catCount_NowVisible>0)?300:0);

            },(me.catCount_NowInvisible>0)?300:0);

        },sortDelay);

        // filler is used to insert the scroll bar. 
        // Items outside the view are not visible, something needs to expand the box
        this.DOM.chartBackground.style("height",(this.getTotalAttribHeight())+"px");
        
        var attribGroupScroll = me.DOM.attribGroup[0][0];
        // always scrolls to top row automatically when re-sorted
        if(this.scrollTop_cache!==0)
            kshf.Util.scrollToPos_do(attribGroupScroll,0);
        this.refreshScrollDisplayMore(this.catCount_InDisplay);

    },
    getTotalAttribHeight: function(){
        return this.catCount_Visible*this.heightRow_attrib;
    },
    cullAttribs: function(){
        var me=this;
        this.DOM.attribs
        .style("visibility",function(attrib){
            return (attrib.isCulled || !attrib.isVisible)?"hidden":"visible";
        }).style("display",function(attrib){
            return (attrib.isCulled || !attrib.isVisible)?"none":"block";
        });

        if(me.cbCatCulled) me.cbCatCulled.call(this);
    },
    chartAxis_Measure_TickSkip: function(){
        var width = this.chartScale_Measure.range()[1];
        var ticksSkip = width/25;
        if(this.getMaxAggregate_Active()>100000){
            ticksSkip = width/30;
        }
        if(this.browser.percentModeActive){
            ticksSkip /= 1.1;
        }
        return ticksSkip;
    },
};

for(var index in Summary_Categorical_functions){
    kshf.Summary_Categorical.prototype[index] = Summary_Categorical_functions[index];
}



/**
 * KESHIF FACET - Categorical
 * @constructor
 */
kshf.Summary_Interval = function(){};
kshf.Summary_Interval.prototype = new kshf.Summary_Base();
var Summary_Interval_functions = {
    initialize: function(kshf_,name,func){
        kshf.Summary_Base.prototype.initialize.call(this,kshf_,name,func);
        this.type='interval';

        // Call the parent's constructor
        var me = this;

        this.filteredItems = this.items;

        // pixel width settings...
        
        this.height_hist = 1; // Initial width (will be updated later...)
        this.height_hist_min = 30; // Minimum possible histogram height
        this.height_hist_max = 100; // Maximim possible histogram height
        this.height_slider = 12; // Slider height
        this.height_labels = 13; // Height for labels
        this.height_percentile = 16; // Height for percentile chart
        this.height_hist_topGap = 12; // Height for histogram gap on top.

        this.width_barGap = 2; // The width between neighboring histgoram bars
        this.width_histMargin = 17; // The width between neighboring histgoram bars
        this.width_vertAxisLabel = 23; // ..

        this.optimumTickWidth = 50;

        this.scaleType = 'linear';
        this.tickIntegerOnly = false;

        this.unitName = undefined;
        this.showPercentile=false;

        this.histBins = [];
        this.intervalTicks = [];

        this.intervalTickFormat = function(v){
            if(me.tickIntegerOnly) return d3.format("s")(v);
            return d3.format(".2f")(v);
        };

        this.summaryFilter = kshf_.createFilter({
            browser: this.browser,
            filteredItems: this.filteredItems,
            parentSummary: this,
            hideCrumb: false,
            onClear: function(){
                if(this.summaryFilter.filteredBin){
                    this.summaryFilter.filteredBin.setAttribute("filtered",false);
                    this.summaryFilter.filteredBin=undefined;
                }
                this.DOM.root.attr("filtered",false);
                this.resetIntervalFilterActive();
                this.refreshIntervalSlider();
            },
            onFilter: function(filter){
                this.DOM.root.attr("filtered",true);

                var i_min = filter.active.min;
                var i_max = filter.active.max;

                var isFiltered;
                if(me.isFiltered_min() && me.isFiltered_max()){
                    if(filter.max_inclusive)
                        isFiltered = function(v){ return v>=i_min && v<=i_max; };
                    else
                        isFiltered = function(v){ return v>=i_min && v<i_max; };
                } else if(me.isFiltered_min()){
                    isFiltered = function(v){ return v>=i_min; };
                } else {
                    if(filter.max_inclusive)
                        isFiltered = function(v){ return v<=i_max; };
                    else
                        isFiltered = function(v){ return v<i_max; };
                }
                if(me.scaleType==='step'){
                    if(i_min===i_max){
                        isFiltered = function(v){ return v===i_max; };
                    }
                }

                filter.filteredItems.forEach(function(item){
                    var v = item.mappedDataCache[filter.id].v;
                    item.setFilterCache(filter.id, (v!==null)?isFiltered(v):false);
                    // TODO: Check if the interval scale is extending/shrinking or completely updated...
                }, this);

                this.refreshIntervalSlider();
            },
            filterView_Detail: function(){
                if(me.scaleType==='step'){
                    if(this.active.min===this.active.max) return "<b>"+this.active.min+"</b>";
                }
                if(me.scaleType==='time'){
                    return "<b>"+me.intervalTickFormat(this.active.min)+
                        "</b> to <b>"+me.intervalTickFormat(this.active.max)+"</b>";
                }
                if(me.isFiltered_min() && me.isFiltered_max()){
                    return "<b>"+this.active.min+"</b> to <b>"+this.active.max+"</b>";
                } else if(me.isFiltered_min()){
                    return "<b>at least "+this.active.min+"</b>";
                } else {
                    return "<b>at most "+this.active.max+"</b>";
                }
            },
        });

        var filterId = this.summaryFilter.id;
        
        this.hasFloat = false;
        this.hasTime  = false;

        this.filteredItems.forEach(function(item){
            var v=this.summaryFunc(item);
            if(isNaN(v)) v=null;
            if(v===undefined) v=null;
            if(v!==null){
                if(v instanceof Date){
                    this.hasTime = true;
                } else {
                    if(typeof v!=='number'){
                        v = null;
                    } else{
                        if(!this.hasFloat)
                            this.hasFloat = this.hasFloat || v%1!==0;
                    }
                }
            }
            item.mappedDataCache[filterId] = { 
                v: v,
                h: this,
            };
        },this);

        if(!this.hasFloat) this.tickIntegerOnly=true;
        if(this.hasTime) this.setScaleType('time');

        var accessor = function(item){ return item.mappedDataCache[filterId].v; };

        // remove items that map to null
        this.filteredItems = this.filteredItems.filter(function(item){
            var v = accessor(item);
            return (v!==undefined && v!==null);
        });

        // sort items in increasing order
        if(!this.hasTime){
            this.filteredItems.sort(function(a,b){
                return accessor(a)-accessor(b);
            });
        } else {
            this.filteredItems.sort(function(a,b){
                return accessor(a).getTime()-accessor(b).getTime();
            });
        }

        // this value is static once the histogram is created
        this.intervalRange = {};
        this.updateIntervalRangeMinMax();

        var range= this.intervalRange.max-this.intervalRange.min;
        var deviation = d3.deviation(this.filteredItems, accessor);
        if(deviation/range<0.12 && this.intervalRange.min>=0){
            this.setScaleType('log');
        }
        console.log("Summary Name:"+this.summaryName);
        console.log("IntervalRange min:"+this.intervalRange.min+' max:'+this.intervalRange.max);
        console.log("Deviation:"+deviation+" testScore:"+(deviation/range));

        this.updateScaleAndBins(30,10,false);
    },
    /** -- */
    refreshNuggetViz: function(){
        if(this.DOM.nugget===undefined){
            console.log("refreshNuggetViz - nugget DOM was not available...");
            return;
        }
        var nuggetViz = this.DOM.nugget.select(".nuggetViz");
        
        var maxAggregate_Total = this.getMaxBinTotalItems();

        if(this.intervalRange.min===this.intervalRange.max){
            this.DOM.nugget.select(".dataTypeIcon").html("only<br>"+this.intervalRange.min);
            nuggetViz.style("display",'none');
            return;
        }

        var totalHeight = 17;
        nuggetViz.selectAll(".nuggetBar").data(this.histBins).enter()
                .append("span").attr("class","nuggetBar")
                .style("height",function(aggr){
                    return totalHeight*(aggr.length/maxAggregate_Total)+"px";
                })
            ;
        
        this.DOM.nugget.select(".dataTypeIcon").html(
            "<span class='num_left'>"+this.intervalTickFormat(this.intervalRange.min)+"</span>"+
            "<span class='num_right'>"+this.intervalTickFormat(this.intervalRange.max)+"</span>");
    },
    /** -- */
    updateIntervalRangeMinMax: function(){
        var filterId = this.summaryFilter.id;
        var accessor = function(item){ return item.mappedDataCache[filterId].v; };

        this.intervalRange.min= d3.min(this.filteredItems,accessor);
        this.intervalRange.max= d3.max(this.filteredItems,accessor);
        this.isEmpty = this.intervalRange.min===undefined;
        this.resetIntervalFilterActive();
    },
    /** -- */
    setScaleType: function(t){
        if(this.scaleType===t) return;
        this.scaleType=t;

        if(this.DOM.facetInterval)
            this.DOM.facetInterval.attr("istime",this.scaleType==='time');

        if(this.scaleType==='log'){
            var filterId = this.summaryFilter.id;
            var accessor = function(item){ return item.mappedDataCache[filterId].v; };
            // remove items with 0 value (log(0) is invalid)
            this.filteredItems = this.filteredItems.filter(function(item){
                return accessor(item)!==0;
            });
            this.updateIntervalRangeMinMax();
        }
    },
    /** -- */
    getHeight: function(){
        if(this.collapsed) return this.getHeight_Header();
        // Note: I don't know why I need -2 to match real dom height.
        return this.getHeight_Header()+this.getHeight_Wrapper();
    },
    /** -- */
    getHeight_Wrapper: function(){
        return this.height_hist+this.getHeight_Extra();
    },
    /** -- */
    getHeight_Header: function(){
        if(this._height_header==undefined) {
            this._height_header = this.DOM.headerGroup[0][0].offsetHeight;
        }
        return this._height_header;
    },
    /** -- */
    getHeight_Extra: function(){
        return 7+this.height_hist_topGap+this.height_labels+this.height_slider+
            (this.showPercentile?this.height_percentile:0);
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
    isFiltered_min: function(){
        // the active min is differnt from intervalRange min.
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
    resetIntervalFilterActive: function(){
        this.summaryFilter.active = {
            min: this.intervalRange.min,
            max: this.intervalRange.max
        };
    },
    /** -- */
    getMaxBinTotalItems: function(){
        return d3.max(this.histBins,function(aggr){ return aggr.length; });
    },
    /** -- */
    getMaxBinActiveItems: function(){
        return d3.max(this.histBins,function(aggr){ return aggr.aggregate_Active; });
    },
    /** -- */
    initDOM: function(){
        if(this.isEmpty) return;
        if(this.DOM.inited===true) return;
        var me = this;
        
        var root;
        if(this.parentFacet){
            root = this.parentFacet.DOM.subFacets;
            this.DOM.root = root.append("div");
        } else {
            root = this.panel.DOM.root;
            this.DOM.root = root.insert("div",function(){ return me.panel.DOM.dropZone[0][0];});
        }

        this.DOM.root
            .attr("class","kshfChart")
            .attr("collapsed",false)
            .attr("filtered",false)
            .attr("chart_id",this.id)
            ;

        this.insertHeader.call(this);
        this.DOM.wrapper = this.DOM.root.append("div").attr("class","wrapper");
        this.DOM.facetInterval = this.DOM.wrapper.append("div").attr("class","facetInterval")
            .attr("istime",this.scaleType==='time');

        this.DOM.histogram = this.DOM.facetInterval.append("div").attr("class","histogram");
        this.DOM.histogram_bins = this.DOM.histogram.append("div").attr("class","bins")
            .style("margin-left",(this.width_vertAxisLabel)+"px")
            ;

        if(this.scaleType==='time'){
            this.DOM.timeSVG = this.DOM.histogram.append("svg")
                .style("margin-left",(this.width_vertAxisLabel+this.width_barGap)+"px")
                .attr("class","timeSVG")
                .attr("xmlns","http://www.w3.org/2000/svg");
        }

        this.insertChartAxis_Measure.call(this, this.DOM.histogram, 'w', 'nw');
        this.DOM.chartAxis_Measure.style("padding-left",(this.width_vertAxisLabel-2)+"px")

        this.initDOM_Slider();

        if(this.showPercentile===true){
            this.initDOM_Percentile();
        }

        // collapse if the mapping is empty
        // TODO: This shoudl be elsewhere, not here...
        if(this.intervalRange.min===0 && this.intervalRange.max===0){
            this.setCollapsed(true);
        }

        this.setCollapsed(this.collapsed);
        this.setUnitName(this.unitName);

        var _width_ = this.getWidth()-this.width_histMargin-this.width_vertAxisLabel;
        this.updateScaleAndBins( _width_, Math.ceil(_width_/this.optimumTickWidth), true );

        this.DOM.inited=true;
    },
    /** -- */
    setUnitName: function(v){
        this.unitName = v;
        this.updateTickLabels();
    },
    /** -- */
    initDOM_Percentile: function(){
        var me=this;
        this.DOM.percentileGroup = this.DOM.facetInterval.append("div").attr("class","percentileGroup")
            .style('margin-left',this.width_vertAxisLabel+"px");;
        this.DOM.percentileGroup.append("span").attr("class","percentileTitle").html("Percentiles");

        this.DOM.quantile = {};

        [[10,90],[20,80],[30,70],[40,60]].forEach(function(qb){
            this.DOM.quantile[""+qb[0]+"_"+qb[1]] = this.DOM.percentileGroup.append("span")
                .attr("class","quantile q_range q_"+qb[0]+"_"+qb[1])
                .each(function(){
                    this.tipsy = new Tipsy(this, {
                        gravity: 's',
                        title: function(){ 
                            return "<span style='font-weight:300'>%"+qb[0]+" - %"+qb[1]+" Percentile: <span style='font-weight:500'>"+
                                me.quantile_val[qb[0]]+" - "+me.quantile_val[qb[1]]+"</span></span>"
                            ;
                        }
                    })
                })
                .on("mouseover",function(){ this.tipsy.show(); })
                .on("mouseout",function(d,i){ this.tipsy.hide(); })
                ;
        },this);
        
        [10,20,30,40,50,60,70,80,90].forEach(function(q){
            this.DOM.quantile[q] = this.DOM.percentileGroup.append("span")
                .attr("class","quantile q_pos q_"+q)
                .each(function(){
                    this.tipsy = new Tipsy(this, {
                        gravity: 's',
                        title: function(){ 
                            return "Median: "+ me.quantile_val[q];
                        }
                    })
                })
                .on("mouseover",function(){ this.tipsy.show(); })
                .on("mouseout",function(d,i){ this.tipsy.hide(); })
                ;
        },this);
    },
    /** -- */
    updateDOMwidth: function(){
        if(this.DOM.inited===false) return;
        var chartWidth = this.getWidth()-this.width_histMargin-this.width_vertAxisLabel;
        this.DOM.facetInterval.style("width",this.getWidth()+"px");
        this.DOM.summaryTitle.style("max-width",(this.getWidth()-40)+"px");
        this.DOM.summaryTitle_edit.style("width",(this.getWidth()-80)+"px");
        if(this.DOM.timeSVG)
            this.DOM.timeSVG.style("width",(chartWidth+2)+"px")
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
        var ticks;

        // HANDLE TIME CAREFULLY
        if(this.scaleType==='time') {
            // 1. Find the appropriate aggregation interval (day, month, etc)
            var timeRange_ms = this.intervalRange.max-this.intervalRange.min; // in milliseconds
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
            } else if((timeRange_ms/(1000*60*60*24*365*5)) < optimalTickCount){
                timeInterval = d3.time.year.utc;
                timeIntervalStep = 5;
                this.intervalTickFormat = function(v){
                    var later = timeInterval.offset(v, 4);
                    var first=d3.time.format.utc("%Y")(v);
                    var s=first;
                    s+="<br>"+d3.time.format.utc("%Y")(later);
                    return s;
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
            for(var i=this.intervalRange.min ; i<=this.intervalRange.max; i++){
                ticks.push(i);
            }
            this.intervalTickFormat = d3.format("d");
        } else if(this.scaleType==='log'){
            this.valueScale.nice(optimalTickCount);
            // Generate ticks
            ticks = this.valueScale.ticks(optimalTickCount);
            while(ticks.length > optimalTickCount*2){
                ticks = ticks.filter(function(d,i){return i%2===0;});
            }
            if(this.tickIntegerOnly)
                ticks = ticks.filter(function(d){return d%1===0;});
            this.intervalTickFormat = d3.format(".1s");
        } else {
            this.valueScale.nice(optimalTickCount);
            this.valueScale.nice(optimalTickCount);
            ticks = this.valueScale.ticks(optimalTickCount);
            this.valueScale.nice(optimalTickCount);
            ticks = this.valueScale.ticks(optimalTickCount);
//            if(this.tickIntegerOnly) ticks = ticks.filter(function(d){return d%1===0;});
            this.intervalTickFormat = d3.format(this.tickIntegerOnly?".2s":".2f");
        }

        return ticks;
    },
    /** 
      Uses
      - optimumTickWidth
      - this.intervalRang
      Updates:
      - scaleType (if steps is more appropriate)
      - valueScale
      - intervalTickFormat
      */
    updateScaleAndBins: function(_width_,optimalTickCount,force){
        if(this.isEmpty) return;
        var me=this;

        // Check if you can use a ste-scale instead
        var stepRange=(this.intervalRange.max-this.intervalRange.min)+1;
        var stepWidth=_width_/stepRange;
        if(!this.hasFloat && this.scaleType!=='step' && optimalTickCount>=stepRange){
            this.setScaleType('step');
        }

        // UPDATE intervalScale
        switch(this.scaleType){
            case 'linear': case 'step':
                this.valueScale = d3.scale.linear();      break;
            case 'log':
                this.valueScale = d3.scale.log().base(2); break;
            case 'time':
                this.valueScale = d3.time.scale.utc();    break;
        }

        this.valueScale
            .domain([this.intervalRange.min, this.intervalRange.max])
            .range([0, _width_]);

        if(this.scaleType==='step'){
            this.valueScale.range([stepWidth/2, _width_-stepWidth/2]);
        }

        var ticks = this.getValueTicks(optimalTickCount);

        if(this.scaleType!=='step'){
            this.barWidth = this.valueScale(ticks[1])-this.valueScale(ticks[0]);
        } else {
            this.barWidth = _width_/stepRange;
        }
        
        // If the number of bins is updated, re-compute stuff
        if(this.intervalTicks.length!==ticks.length || force){
            this.intervalTicks = ticks;

            var filterId = this.summaryFilter.id;
            var accessor = function(item){ return item.mappedDataCache[filterId].v; };

            // this calculates aggregation based on the intervalTicks, the filtered item list and the accessor function
            if(this.scaleType!=='step'){
                this.histBins = d3.layout.histogram().bins(this.intervalTicks)
                    .value(accessor)(this.filteredItems);
            } else {
                // I'll do the bins myself, d3 just messes everything up when you want to use a simple step scale!
                this.histBins = [];
                for(var bin=this.intervalRange.min; bin<=this.intervalRange.max; bin++){
                    var d=[];
                    d.x = bin;
                    d.y = 0;
                    d.dx = 0;
                    this.histBins.push(d);
                }
                this.filteredItems.forEach(function(item){
                    var v = accessor(item);
                    var bin=this.histBins[v-this.intervalRange.min];
                    bin.push(item);
                    bin.y++;
                },this);
            }
            
            this.updateActiveItems();

            this.updateBarScale2Active();

            if(this.DOM.inited || force){
                this.insertVizDOM();
            }
        }

        if(this.DOM.inited || force){
            this.refreshBins_Translate();
            this.refreshViz_Scale();

            this.DOM.labelGroup.selectAll(".tick").style("left",function(d){
                return (me.valueScale(d)+me.getAggreg_Width_Offset())+"px";
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
        // remove all existing ticks
        this.DOM.labelGroup.selectAll(".tick").data([]).exit().remove();
        // Update text labels
        var ddd = this.DOM.labelGroup.selectAll(".tick").data(this.intervalTicks);
        var ddd_enter = ddd.enter().append("span").attr("class","tick");
        ddd_enter.append("span").attr("class","line");
        ddd_enter.append("span").attr("class","text");
        this.updateTickLabels();
    },
    /** -- */
    getBarWidth_Real: function(){
        return this.barWidth-this.width_barGap*2;
    },
    /** -- */
    updateTickLabels: function(){
        var me=this;
        this.DOM.labelGroup.selectAll(".tick .text").html(function(d){
            var v;
            if(me.scaleType!=='time'){
                if(d<1) v=d.toFixed(1);
                else v=me.intervalTickFormat(d);
            } else {
                v=me.intervalTickFormat(d);
            }
            if(me.unitName) v+="<span class='unitName'>"+me.unitName+"</span>";
            return v;
        });
    },
    /** -- */
    getAggreg_Width_Offset: function(){
        if(this.scaleType==='time') return this.barWidth/2;
        return 0;
    },
    /** -- */
    insertBins: function(){
        var me=this;
        var resultPreviewLogTimeout = null;

        var filterId = this.summaryFilter.id;

        // just remove everything that was in the histogram_bins befoe
        this.DOM.histogram_bins
            .selectAll(".aggr_Group").data([]).exit().remove();

        var activeBins = this.DOM.histogram_bins
            .selectAll(".aggr_Group").data(this.histBins, function(d,i){ return i; });

        var newBins=activeBins.enter().append("span").attr("class","aggr_Group")
            .each(function(aggr){
                aggr.aggregate_Preview=0;
                aggr.forEach(function(item){
                    item.mappedDataCache[filterId].b = aggr;
                },this);
                aggr.DOM = {}
                aggr.DOM.facet = this;
                this.tipsy = new Tipsy(this, {
                    gravity: 's',
                    offset_y: 3,
                    title: function(){
                        if(this.tipsy_title) return this.tipsy_title;
                        if(this.getAttribute("filtered")==="true"){
                            return "<span class='action'><span class='fa fa-times'></span> Remove</span> filter"
                        }
                        return "<span class='action'><span class='fa fa-plus'></span> And</span>"
                    }
                });
            })
            .on("mouseenter",function(aggr){
                var thiss= this;
                // Show tipsy
                this.tipsy.options.offset_x = 0;
                this.tipsy.options.offset_y = me.browser.percentModeActive?
                    (-9):(me.height_hist-me.chartScale_Measure(aggr.aggregate_Active)-9);
                this.tipsy.options.className = "tipsyFilterAnd";
//                this.tipsy.show();

                if(!me.browser.pauseResultPreview){
                    var timeoutTime = 400;
                    if(me.browser._previewCompare_Active) timeoutTime = 0;
                    this.resultPreviewShowTimeout = setTimeout(function(){
                        aggr.forEach(function(item){item.updatePreview(me.parentFacet);});
                        me.browser.itemCount_Previewed = aggr.length;
                        // Histograms cannot have sub-facets, so don't iterate over mappedDOMs...
                        thiss.setAttribute("highlight","selected");
                        thiss.setAttribute("showlock",true);
                        me.browser.refreshResultPreviews();
                        if(sendLog) {
                            if(resultPreviewLogTimeout){
                                clearTimeout(resultPreviewLogTimeout);
                            }
                            resultPreviewLogTimeout = setTimeout(function(){
                                sendLog(kshf.LOG.FILTER_PREVIEW, {id:me.summaryFilter.id, info: aggr.x+"x"+aggr.dx});
                            }, 1000); // wait 1 second to see the update fully
                        }
                    },timeoutTime);
                }
            })
            .on("mouseleave",function(aggr){
                // this.tipsy.hide();
                if(resultPreviewLogTimeout){
                    clearTimeout(resultPreviewLogTimeout);
                }
                if(this.resultPreviewShowTimeout){
                    clearTimeout(this.resultPreviewShowTimeout);
                    this.resultPreviewShowTimeout = null;
                }
                if(!me.browser.pauseResultPreview){
                    this.setAttribute("highlight",false);
                    this.setAttribute("showlock",false);

                    me.browser.items.forEach(function(item){
                        if(item.DOM.result) item.DOM.result.setAttribute("highlight",false);
                    })
                    me.browser.clearResultPreviews();
                }
            })
            .on("click",function(aggr){
                this.tipsy.hide();

                if(me.summaryFilter.filteredBin===this){
                    me.summaryFilter.clearFilter();
                    return;
                }
                this.setAttribute("filtered","true");

                // store histogram state
                me.summaryFilter.dom_HistogramBar = this;
                if(me.scaleType!=='time'){
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
                me.summaryFilter.max_inclusive = (aggr.x+aggr.dx)===me.intervalRange.max;
                if(me.scaleType==='step'){
                    me.summaryFilter.max_inclusive = true;
                }

                me.summaryFilter.filteredBin=this;
                me.summaryFilter.addFilter(true);
                if(sendLog) sendLog(kshf.LOG.FILTER_INTRVL_BIN, 
                    {id:me.summaryFilter.id, info:me.summaryFilter.active.min+"x"+me.summaryFilter.active.max} );
            });

        newBins.append("span").attr("class","aggr total");
        newBins.append("span").attr("class","aggr total_tip");
        newBins.append("span").attr("class","aggr active");
        newBins.append("span").attr("class","aggr preview").attr("fast",true);
        newBins.append("span").attr("class","aggr compare").attr("hidden",true);

        newBins.append("span").attr("class","compareButton fa")
            .on("click",function(aggr){
                me.browser.setPreviewCompare(aggr);
                this.parentNode.tipsy.hide();
                d3.event.stopPropagation();
            })
            .on("mouseenter",function(aggr){
                this.parentNode.tipsy.options.className = "tipsyFilterLock";
                this.parentNode.tipsy_title = (me.browser.comparedAggregate!==aggr)?"Lock to compare":"Unlock";
                this.parentNode.tipsy.hide();
                this.parentNode.tipsy.show();
                d3.event.stopPropagation();
            })
            .on("mouseleave",function(aggr){
                this.parentNode.tipsy_title = undefined;
                this.parentNode.tipsy.hide();
                d3.event.stopPropagation();
            })
            ;

        newBins.append("span").attr("class","measureLabel").each(function(bar){
            kshf.Util.setTransform(this,"translateY("+me.height_hist+"px)");
        });

        this.DOM.aggr_Group    = this.DOM.histogram_bins.selectAll(".aggr_Group");
        this.DOM.aggr_Total    = this.DOM.aggr_Group.selectAll(".total");
        this.DOM.aggr_TotalTip = this.DOM.aggr_Group.selectAll(".total_tip");
        this.DOM.aggr_Active   = this.DOM.aggr_Group.selectAll(".active");
        this.DOM.aggr_Preview  = this.DOM.aggr_Group.selectAll(".preview");
        this.DOM.aggr_Compare  = this.DOM.aggr_Group.selectAll(".compare");

        this.DOM.compareButton = this.DOM.aggr_Group.selectAll(".compareButton");
        this.DOM.measureLabel  = this.DOM.aggr_Group.selectAll(".measureLabel");

        this.refreshViz_Preview();
        this.refreshMeasureLabel();
    },
    fixIntervalFilterRange: function(){
        if(this.scaleType==='log' || this.scaleType==='step'){
            this.summaryFilter.active.min=Math.round(this.summaryFilter.active.min);
            this.summaryFilter.active.max=Math.round(this.summaryFilter.active.max);
        } else if(this.scaleType==='time'){
            // TODO
        } else {
            if(!this.hasFloat){
                this.summaryFilter.active.min=Math.round(this.summaryFilter.active.min);
                this.summaryFilter.active.max=Math.round(this.summaryFilter.active.max);
            }
        }
    },
    initDOM_Slider: function(){
        var me=this;

        this.DOM.intervalSlider = this.DOM.facetInterval.append("div").attr("class","intervalSlider")
            .attr("anim",true)
            .style('margin-left',(this.width_vertAxisLabel)+"px");

        var controlLine = this.DOM.intervalSlider.append("div").attr("class","controlLine")
        controlLine.append("span").attr("class","base total")
            .on("mousedown", function (d, i) {
                if(d3.event.which !== 1) return; // only respond to left-click
                me.DOM.intervalSlider.attr("anim",false);
                var e=this.parentNode;
                var initPos = me.valueScale.invert(d3.mouse(e)[0]);
                d3.select("body").style('cursor','ew-resize')
                    .on("mousemove", function() {
                        var targetPos = me.valueScale.invert(d3.mouse(e)[0]);
                        me.summaryFilter.active.min=d3.min([initPos,targetPos]);
                        me.summaryFilter.active.max=d3.max([initPos,targetPos]);
                        me.fixIntervalFilterRange();
                        me.refreshIntervalSlider();
                        // wait half second to update
                        if(this.timer){
                            clearTimeout(this.timer);
                            this.timer = null;
                        }
                        me.summaryFilter.filteredBin=this;
                        this.timer = setTimeout(function(){
                            if(me.isFiltered_min() || me.isFiltered_max()){
                                me.summaryFilter.addFilter(true);
                                if(sendLog) sendLog(kshf.LOG.FILTER_INTRVL_HANDLE, 
                                    { id: me.summaryFilter.id, 
                                      info: me.summaryFilter.active.min+"x"+me.summaryFilter.active.m});
                            } else {
                                me.summaryFilter.clearFilter();
                            }
                        },250);
                    }).on("mouseup", function(){
                        me.DOM.intervalSlider.attr("anim",true);
                        d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
                    });
                d3.event.preventDefault();
            });;

        controlLine.append("span")
            .attr("class","base active")
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: 's',
                    title: function(){ return "Drag to filter" }
                })
            })
//            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("mousedown", function (d, i) {
                this.tipsy.hide();
                if(d3.event.which !== 1) return; // only respond to left-click
                if(me.scaleType==='time') return; // time is not supported for now.
                me.DOM.intervalSlider.attr("anim",false);
                var e=this.parentNode;
                var initMin = me.summaryFilter.active.min;
                var initMax = me.summaryFilter.active.max;
                var initRange= initMax - initMin;
                var initPos = me.valueScale.invert(d3.mouse(e)[0]);

                d3.select("body").style('cursor','ew-resize')
                    .on("mousemove", function() {
                        var targetPos = me.valueScale.invert(d3.mouse(e)[0]);
                        var targetDif = targetPos-initPos;
                        me.summaryFilter.active.min = initMin+targetDif;
                        me.summaryFilter.active.max = initMax+targetDif;
                        if(me.summaryFilter.active.min<me.intervalRange.min){
                            me.summaryFilter.active.min=me.intervalRange.min;
                            me.summaryFilter.active.max=me.intervalRange.min+initRange;
                        }
                        if(me.summaryFilter.active.max>me.intervalRange.max){
                            me.summaryFilter.active.max=me.intervalRange.max;
                            me.summaryFilter.active.min=me.intervalRange.max-initRange;
                        }
                        me.fixIntervalFilterRange();
                        me.refreshIntervalSlider();
                        // wait half second to update
                        if(this.timer){
                            clearTimeout(this.timer);
                            this.timer = null;
                        }
                        me.summaryFilter.filteredBin=this;
                        this.timer = setTimeout(function(){
                            if(me.isFiltered_min() || me.isFiltered_max()){
                                me.summaryFilter.addFilter(true);
                                if(sendLog) sendLog(kshf.LOG.FILTER_INTRVL_HANDLE, 
                                    { id: me.summaryFilter.id,
                                      info: me.summaryFilter.active.min+"x"+me.summaryFilter.active.max});
                            } else{
                                me.summaryFilter.clearFilter();
                            }
                        },200);
                    }).on("mouseup", function(){
                        me.DOM.intervalSlider.attr("anim",true);
                        d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
                    });
                d3.event.preventDefault();
            });

        var handle_cb = function (d, i) {
            var mee = this;
            if(d3.event.which !== 1) return; // only respond to left-click
            me.DOM.intervalSlider.attr("anim",false);
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
                    me.fixIntervalFilterRange();
                    me.refreshIntervalSlider();
                    // wait half second to update
                    if(this.timer){
                        clearTimeout(this.timer);
                        this.timer = null;
                    }
                    me.summaryFilter.filteredBin=this;
                    this.timer = setTimeout( function(){
                        if(me.isFiltered_min() || me.isFiltered_max()){
                            if(sendLog) sendLog(kshf.LOG.FILTER_INTRVL_HANDLE, 
                                { id: me.summaryFilter.id,
                                  info: me.summaryFilter.active.min+"x"+me.summaryFilter.active.max });
                            me.summaryFilter.addFilter(true);
                        } else {
                            me.summaryFilter.clearFilter();
                        }
                    },200);
                }).on("mouseup", function(){
                    mee.dragging = false;
                    me.browser.pauseResultPreview = false;
                    me.DOM.intervalSlider.attr("anim",true);
                    d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
                });
            d3.event.preventDefault();
        };

        controlLine.selectAll(".handle").data(['min','max']).enter()
            .append("span").attr("class",function(d){ return "handle "+d; })
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: 's',
                    title: function(){ return "<span class='action fa fa-arrows-h' style='font-weight: 900;'></span> Drag to filter" }
                })
            })
            .on("mouseover",function(){ if(this.dragging!==true) this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("mousedown", function(d,i){
                this.tipsy.hide();
                handle_cb.call(this,d,i);
            })
            .append("span").attr("class","invalidArea");

        this.DOM.selectedItemValue = controlLine.append("div").attr("class","selectedItemValue");
        this.DOM.selectedItemValue.append("span").attr("class","circlee");
        this.DOM.selectedItemValueText = this.DOM.selectedItemValue
            .append("span").attr("class","selected-item-value-text")
            .append("span").attr("class","selected-item-value-text-v");


        this.DOM.labelGroup = this.DOM.intervalSlider.append("div").attr("class","labelGroup");
    },
    /** -- */
    updateBarScale2Total: function(){
        this.chartScale_Measure
            .domain([0, this.getMaxBinTotalItems()])
            .range ([0, this.height_hist]);
    },
    /** -- */
    updateBarScale2Active: function(){
        this.chartScale_Measure
            .domain([0, this.getMaxBinActiveItems()])
            .range ([0, this.height_hist]);
    },
    /** -- */
    updateActiveItems: function(){
        // indexed items are either primary or secondary
        if(this.parentFacet && this.parentFacet.hasAttribs()){
            this.histBins.forEach(function(aggr){
                aggr.aggregate_Active = 0;
                aggr.forEach(function(item){
                    if(item.aggregate_Active>0) aggr.aggregate_Active+=item.aggregate_Self;
                });
            });
        } else {
            this.histBins.forEach(function(aggr){
                aggr.aggregate_Active = 0;
                aggr.forEach(function(item){
                    if(item.isWanted) aggr.aggregate_Active+=item.aggregate_Self;
                });
            });
        }
    },
    /** -- */
    refreshBins_Translate: function(){
        var me=this;
        var offset = 0;
        if(this.scaleType==='step') offset=this.width_barGap-this.barWidth/2;
        if(this.scaleType==='time') offset=this.width_barGap;
        this.DOM.aggr_Group
            .style("width",this.getBarWidth_Real()+"px")
            .each(function(aggr){
                kshf.Util.setTransform(this,"translateX("+(me.valueScale(aggr.x)+offset)+"px)");
            });
    },
    /** -- Note: Same as the function used for categorical facet */
    refreshViz_All: function(){
        if(this.isEmpty) return;
        var me=this;
        this.refreshViz_Total();
        this.refreshViz_Active();

        this.DOM.aggr_Preview.attr("fast",null); // take it slow for result preview animations
        this.refreshViz_Preview();
        setTimeout(function(){ me.DOM.aggr_Preview.attr("fast",true); },700);

        this.refreshViz_Compare();
        this.refreshMeasureLabel();
        this.refreshViz_Axis();
    },
    /** -- */
    refreshViz_Scale: function(){
        this.refreshViz_Total();
        this.refreshViz_Active();
    },
    /** -- */
    refreshViz_Total: function(){
        var me=this;
        var width=this.getBarWidth_Real();
        
        var getAggrHeight_Total = function(aggr){
            if(aggr.length===0) return 0;
            if(me.browser.ratioModeActive) return me.height_hist;
            return Math.min(me.chartScale_Measure(aggr.length),me.height_hist);
        };

        if(this.scaleType==='time'){
            var durationTime=this.browser.noAnim?0:700;
            this.timeSVGLine = d3.svg.area()
                .x(function(aggr){ return me.valueScale(aggr.x)+width/2; })
                .y0(me.height_hist)
                .y1(function(aggr){ return me.height_hist-getAggrHeight_Total(aggr); });
            this.DOM.lineTrend_Total
                .transition().duration(durationTime)
                .attr("d", this.timeSVGLine);
        } else {
            this.DOM.aggr_Total.each(function(aggr){
                kshf.Util.setTransform(this,
                    "translateY("+me.height_hist+"px) scale("+width+","+getAggrHeight_Total(aggr)+")");
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
        var me=this;
        var width = this.getBarWidth_Real();

        var getAggrHeight_Active = function(aggr){
            if(me.browser.ratioModeActive) return (aggr.aggregate_Active!==0)?me.height_hist:0;
            return me.chartScale_Measure(aggr.aggregate_Active);
        };

        this.DOM.aggr_Active.each(function(aggr){
            kshf.Util.setTransform(this,
                "translateY("+me.height_hist+"px) scale("+width+","+getAggrHeight_Active(aggr)+")");
        });
        this.DOM.compareButton.each(function(aggr){
            var height = me.height_hist-getAggrHeight_Active(aggr)-9;
            kshf.Util.setTransform(this,"translateY("+height+"px)");
        });

        if(this.scaleType==='time'){
            var durationTime=this.browser.noAnim?0:700;
            this.timeSVGLine = d3.svg.area()
                .x(function(aggr){ 
                    return me.valueScale(aggr.x)+width/2;
                })
                .y0(me.height_hist+2)
                .y1(function(aggr){
                    return me.height_hist-getAggrHeight_Active(aggr);
                });
            
            this.DOM.lineTrend_Active
              .transition().duration(durationTime)
              .attr("d", this.timeSVGLine);

            this.DOM.lineTrend_ActiveLine.transition().duration(durationTime)
                .attr("y1",function(aggr){ return me.height_hist+3; })
                .attr("y2",function(aggr){ 
                    if(aggr.aggregate_Active===0) return me.height_hist+3;
                    return me.height_hist-getAggrHeight_Active(aggr);
                })
                .attr("x1",function(aggr){ return me.valueScale(aggr.x)+width/2; })
                .attr("x2",function(aggr){ return me.valueScale(aggr.x)+width/2; });
        }
    },
    /** -- */
    refreshViz_Compare: function(){
        var me=this;
        if(this.isEmpty) return;
        if(this.collapsed) return;

        var getAggrHeight_Compare = function(aggr){
            if(me.browser.ratioModeActive) 
                return (aggr.aggregate_Compare/aggr.aggregate_Active)*me.height_hist;
            return me.chartScale_Measure(aggr.aggregate_Compare);
        };

        var width = this.getBarWidth_Real();
        var width_half = this.getBarWidth_Real()/2;
        // update aggregate_Compare value in each aggregate
        this.histBins.forEach(function(aggr){
            aggr.aggregate_Compare = aggr.aggregate_Preview;
            if(me.browser.preview_not) {
                aggr.aggregate_Compare = aggr.aggregate_Active-aggr.aggregate_Preview;
            }
        });
        // update chart
        this.DOM.aggr_Compare.each(function(aggr){
            kshf.Util.setTransform(this,
                "translateY("+me.height_hist+"px) scale("+width_half+","+getAggrHeight_Compare(aggr)+")");
        });

        if(this.scaleType==='time'){
            this.timeSVGLine = d3.svg.line()
                .x(function(aggr){  return me.valueScale(aggr.x)+width/2; })
                .y(function(aggr){
                    if(aggr.aggregate_Compare===0) return me.height_hist+3;
                    return me.height_hist-getAggrHeight_Compare(aggr);
                });

            var durationTime=0;
            if(this.browser._previewCompare_Active){
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
                    return me.height_hist-getAggrHeight_Compare(aggr);
                })
                .attr("x1",function(aggr){ return me.valueScale(aggr.x)+width/2+1; })
                .attr("x2",function(aggr){ return me.valueScale(aggr.x)+width/2+1; });
        }
    },
    /** -- */
    refreshViz_Preview: function(){
        if(this.isEmpty) return;
        if(this.collapsed) return;
        var me=this;
        var width = this.getBarWidth_Real();

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

        this.DOM.aggr_Preview.each(function(aggr){
            kshf.Util.setTransform(this,
                "translateY("+me.height_hist+"px) scale("+
                    me.getBarWidth_Real()+","+getAggrHeight_Preview(aggr)+")");
        });
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
                .attr("x1",function(aggr){ return me.valueScale(aggr.x)+width/2-1; })
                .attr("x2",function(aggr){ return me.valueScale(aggr.x)+width/2-1; });
        }
    },
    /** -- */
    clearViz_Preview: function(){
        if(this.isEmpty) return;
        if(this.collapsed) return;
        // The DOM is not initialized in initDOM, but in adjusting to the facet width. I know, weird.
        if(this.DOM.aggr_Preview===undefined) return;
        var me=this;
        var width = this.getBarWidth_Real();
        var transform="translateY("+this.height_hist+"px) "+"scale("+this.getBarWidth_Real()+",0)";
        this.DOM.aggr_Preview.each(function(bar){
            bar.aggregate_Preview=0;
            kshf.Util.setTransform(this,transform);
        });
        this.refreshMeasureLabel();

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
                maxValue = Math.round(100*me.getMaxBinActiveItems()/me.browser.itemsWantedCount);
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
            var x = this.browser.noAnim;
            if(x===false) me.browser.setNoAnim(true);
            me.DOM.chartAxis_Measure.selectAll(".tick").style("opacity",1).each(transformFunc);
            if(x===false) me.browser.setNoAnim(false);
        });
    },
    /** -- */
    refreshMeasureLabel: function(){
        var me=this;

        this.DOM.aggr_Group.attr("noitems",function(aggr){ return aggr.aggregate_Active===0; });
        
        this.DOM.measureLabel.each(function(aggr){
            var p=aggr.aggregate_Preview;
            if(me.browser.resultPreviewActive){
                if(me.browser.preview_not)
                    p = aggr.aggregate_Active-aggr.aggregate_Preview;
                else
                    p = aggr.aggregate_Preview;
            } else {
                p = aggr.aggregate_Active;
            }
            if(me.browser.percentModeActive){
                if(me.browser.ratioModeActive){
                    p = 100*p/aggr.aggregate_Active;
                    if(!me.browser.resultPreviewActive){
                        this.textContent = "";
                        return;
                    }
                } else {
                    p = 100*p/me.browser.itemsWantedCount;
                }
                this.textContent = p.toFixed(0)+"%";
            } else {
                this.textContent = kshf.Util.formatForItemCount(p);
            }
        });
    },
    /** -- */
    refreshIntervalSlider: function(){
        var minPos = this.valueScale(this.summaryFilter.active.min);
        var maxPos = this.valueScale(this.summaryFilter.active.max);
        if(this.summaryFilter.active.min===this.intervalRange.min){
            minPos = this.valueScale.range()[0];
        }
        if(this.summaryFilter.active.max===this.intervalRange.max){
            maxPos = this.valueScale.range()[1];
        }
        if(this.scaleType==='step'){
            minPos-=this.barWidth/2;
            maxPos+=this.barWidth/2;
        }

        this.DOM.intervalSlider.select(".base.active")
            .attr("filtered",this.isFiltered())
            .each(function(d){
                kshf.Util.setTransform(this,"translateX("+minPos+"px) scaleX("+(maxPos-minPos)+")");
            });
        this.DOM.intervalSlider.selectAll(".handle")
            .each(function(d){
                kshf.Util.setTransform(this,"translateX("+((d==="min")?minPos:maxPos)+"px)");
            });
    },
    /** -- */
    refreshHeight: function(){
        this.DOM.histogram.style("height",(this.height_hist+this.height_hist_topGap)+"px")
        this.DOM.wrapper.style("height",(this.collapsed?"0":this.getHeight_Wrapper())+"px");
        var labelTranslate ="translateY("+this.height_hist+"px)";
        if(this.DOM.measureLabel)
            this.DOM.measureLabel.each(function(bar){ kshf.Util.setTransform(this,labelTranslate); });
        if(this.DOM.timeSVG)
            this.DOM.timeSVG.style("height",(this.height_hist+2)+"px");
    },
    /** -- */
    refreshWidth: function(){
        var _width_ = this.getWidth()-this.width_histMargin-this.width_vertAxisLabel;
        this.updateScaleAndBins( _width_, Math.ceil(_width_/this.optimumTickWidth), false );
        this.updateDOMwidth();
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
        this.refreshViz_Preview();
        this.refreshHeight();
        this.refreshViz_Axis();
        this.DOM.labelGroup.style("height",this.height_labels+"px");
    },
    /** -- */
    setCollapsed: function(v){
        this.collapsed = v;
        if(this.DOM.root){
            this.DOM.root.attr("collapsed",this.collapsed===false?"false":"true");
            if(v===false){
                this.clearViz_Preview();
            }
        }
    },
    /** -- */
    updateAfterFilter: function(resultChange){
        if(this.isEmpty) return;
        this.updateActiveItems();
        this.refreshMeasureLabel();
        this.updateBarPreviewScale2Active();
        if(this.showPercentile){
            this.updateQuantiles();
        }
    },
    /** -- */
    updateBarPreviewScale2Active: function(){
        var me=this;
        this.updateBarScale2Active();
        this.refreshBins_Translate();
        this.refreshViz_Scale();
        this.refreshViz_Compare();

        this.DOM.aggr_Preview.attr("fast",null); // take it slow for result preview animations
        this.refreshViz_Preview();
        this.refreshViz_Axis();

        setTimeout(function(){ me.DOM.aggr_Preview.attr("fast",true); },700);
    },
    /** -- */
    setSelectedPosition: function(v){
        if(this.DOM.inited===false) return;
        if(v===null) return;
        if(this.valueScale===undefined) return;
        if(this.panel===undefined) return;
        var t="translateX("+(this.valueScale(v))+"px)";
        this.DOM.selectedItemValue
            .each(function(){ kshf.Util.setTransform(this,t); })
            .style("display","block");

        var dateFormat = d3.time.format("%b %-e,'%y");
        this.DOM.selectedItemValueText.html(
            this.intervalTickFormat(v)+(this.unitName?("<span class='unitName'>"+this.unitName+"</span>"):"")
        );
    },
    /** -- */
    hideSelectedPosition: function(){
        if(this.inBrowser())
            this.DOM.selectedItemValue.style("display",null);
    },
    /** -- */
    updateQuantiles: function(){
        // get active values into an array
        // the items are already sorted by their numeric value, it's just a linear pass.
        var values = [];
        var filterId = this.summaryFilter.id;
        var accessor = function(item){ return item.mappedDataCache[filterId].v; };
        if(!this.hasEntityParent()){
            this.filteredItems.forEach(function(item){
                if(item.isWanted) values.push(accessor(item));
            });
        } else {
            this.filteredItems.forEach(function(item){
                if(item.aggregate_Active>0) values.push(accessor(item));
            });
        }

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