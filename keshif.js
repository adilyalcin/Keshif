/*********************************

keshif library

Copyright (c) 2013, Mehmet Adil Yalcin
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
    maxVisibleItems_default: 50, 
    dt: {},
    dt_id: {},
    dt_ColNames: {},
    dt_ColNames_Arr: {},
    createColumnNames: function(tableName){
        this.dt_ColNames    [tableName] = {};
        this.dt_ColNames_Arr[tableName] = [];
    },
    insertColumnName: function(tableName, colName, index){
        this.dt_ColNames    [tableName][colName] = index;
        this.dt_ColNames_Arr[tableName][index  ] = colName;
    },
};


kshf.Util = {
    dif_activeItems: function(a,b){
        return b.activeItems - a.activeItems;
    },
    sortFunc_ActiveCount_TotalCount: function(a,b){ 
        var dif=kshf.Util.dif_activeItems(a,b);
        if(dif===0) { return b.items.length-a.items.length; }
        return dif;
    },
    sortFunc_Column_Int_Incr: function(a,b){ 
        return a.data[1] - b.data[1]; 
    },
    sortFunc_Column_Int_Decr: function(a,b){ 
        return b.data[1] - a.data[1]; 
    },
    sortFunc_Column_ParseInt_Incr: function(a,b){ 
        return parseFloat(a.data[1],10) -parseFloat(b.data[1],10);
    },
    sortFunc_Column_ParseInt_Decr: function(a,b){ 
        return parseFloat(b.data[1],10) -parseFloat(a.data[1],10);
    },
    sortFunc_String_Decr: function(a,b){ 
        return b.data[1].localeCompare(a.data[1]);
    },
    sortFunc_String_Incr: function(a,b){ 
        return b.data[1].localeCompare(a.data[1]);
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
                if(typeof list==="number") return;
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
    /** -- ANY of the mappins is true */
    filter_multi_or: function(itemList) {
        var r=false;
        itemList.every(function(d){
            if(d.f_included()) r=true;
            return !r;
        });
        return r;
    },
    /** Returns true when all current selections appear in the itemList */
    filter_multi_and: function(itemList) {
        // ALL of the current selection is in item mappings
        // see how many items return true. If it matches current inserted count, then all selections are met for this item
        var t=0;
        itemList.forEach(function(m){
            if(m.f_included()) t++;
        })
        return (t===this.attribCount_Included);
    },
    filter_multi_removed: function(itemList){
        return ! itemList.every(function(d){
            return ! d.f_removed();
        })
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
        var l=str.toLowerCase();
        return l.charAt(0).toUpperCase() + l.slice(1);
    },
    insertSlider_do: function(root,options){
        var _isFiltered = function(){
            return options.filter.active.min!==options.range.min ||
                   options.filter.active.max!==options.range.max ;
        };
        root.append("span").attr("class","base total")
            .on("mousedown", function (d, i) {
                if(d3.event.which !== 1) return; // only respond to left-click
                options.root.attr("noanim",true);
                var e=this.parentNode;
                var initX = d3.mouse(e)[0];
                var initPos = options.range.min + 
                            (options.range.max-options.range.min)*(initX/(options.range.width*1.0));

                d3.select("body").style('cursor','ew-resize')
                    .on("mousemove", function() {
                        var mouseX = d3.mouse(e)[0];
                        var targetPos = options.range.min + 
                            (options.range.max - options.range.min)*(mouseX/(options.range.width*1.0));
                        options.filter.active.min=d3.min([initPos,targetPos]);
                        options.filter.active.max=d3.max([initPos,targetPos]);
                        if(_isFiltered())
                            options.filter.addFilter(true);
                        else
                            options.filter.clearFilter(true);
                    }).on("mouseup", function(){
                        options.root.attr("noanim",false);
                        d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
                    });
                d3.event.preventDefault();
            });;

        root.append("span")
            .attr("class","base active")
            .on("mousedown", function (d, i) {
                if(d3.event.which !== 1) return; // only respond to left-click
                if(!options.filter.isFiltered) return;
                options.root.attr("noanim",true);
                var e=this.parentNode;
                var initX = d3.mouse(e)[0];
                var initMin = options.filter.active.min;
                var initMax = options.filter.active.max;
                var initRange= initMax - initMin;
                var initPos = options.range.min + 
                            (options.range.max - options.range.min)*(initX/(options.range.width*1.0));

                d3.select("body").style('cursor','ew-resize')
                    .on("mousemove", function() {
                        var mouseX = d3.mouse(e)[0];
                        var targetPos = options.range.min + 
                            (options.range.max - options.range.min)*(mouseX/(options.range.width*1.0));
                        var targetDif = targetPos-initPos;
                        options.filter.active.min = initMin+targetDif;
                        options.filter.active.max = initMax+targetDif;
                        if(options.filter.active.min<options.range.min){
                            options.filter.active.min=options.range.min;
                            options.filter.active.max=options.range.min+initRange;
                        }
                        if(options.filter.active.max>options.range.max){
                            options.filter.active.max=options.range.max;
                            options.filter.active.min=options.range.max-initRange;
                        }
                        if(_isFiltered())
                            options.filter.addFilter(true);
                        else
                            options.filter.clearFilter(true);
                    }).on("mouseup", function(){
                        options.root.attr("noanim",false);
                        d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
                    });
                d3.event.preventDefault();
            });

        var handle_cb = function (d, i) {
            if(d3.event.which !== 1) return; // only respond to left-click
            options.root.attr("noanim",true);
            var e=this.parentNode;
            d3.select("body").style('cursor','ew-resize')
                .on("mousemove", function() {
                    var mouseX = d3.mouse(e)[0];
                    var range=mouseX/(options.range.width*1.0);
                    range=Math.min(1,Math.max(0,range));
                    var targetPos = options.range.min + 
                        (options.range.max - options.range.min)*range;
                    targetPos = Math.round(targetPos);
                    options.filter.active[d] = targetPos;
                    if(_isFiltered())
                        options.filter.addFilter(true);
                    else
                        options.filter.clearFilter(true);
                }).on("mouseup", function(){
                    options.root.attr("noanim",false);
                    d3.select("body").style('cursor','auto').on("mousemove",null).on("mouseup",null);
                });
            d3.event.preventDefault();
        };

        root.selectAll("span.handle").data(['min','max']).enter()
            .append("span").attr("class",function(d){ return "handle "+d; })
            .on("mousedown", handle_cb)
            .append("span").attr("class","invalidArea");

        root.append("div").attr("class","selectedItemValue").append("div").attr("class","circlee");
    },
};



var CATID = {
    FacetFilter   : 1,
    FacetSort     : 2,
    FacetScroll   : 3,
    FacetCollapse : 4,
    ItemBased     : 5,
    Configuration : 6,
    Other         : 7
};
                        // ## Send update at the end of interaction
var ACTID_FILTER = {
    CatValueAdd    : 1,
    CatValueRemove : 2,
    CatValueExact  : 3,
    Clear          : 4,
    ClearAll       : 6,
    TimeMinHandle  : 7, // ##
    TimeMaxHandle  : 8, // ##
    TimeDragRange  : 9, // ##
    TimeDot        : 10,
    CatTextSearch  : 11,
    MainTextSearch : 12,
    ClearAllEscape : 13
};
var ACTID_SORT = {
    ChangeSortFunc : 1,
    ResortButton   : 2
};
var ACTID_SCROLL = {
    DragScrollbar : 1, // ##
    MouseScroll   : 2, // ##
    ClickScrollbar: 3,
    ScrollToTop   : 4,
    ClickMore     : 5
};
var ACTID_COLLAPSE = {
    Collapse : 1,
    Show     : 2
};
var ACTID_ITEM = {
    Collapse  : 1,
    Show      : 2,
    FollowURL : 3,
    FollowPDF : 4
};
var ACTID_CONFIG= {
    WindowSize : 1,
    Browser : 2
};
var ACTID_OTHER = {
    DataSource : 1,
    InfoButton : 2,
    OpenPage   : 3, // load
    ClosePage  : 4,  // unload
    LeftPanelWidth: 5,
    Resize     : 6,
    ShowMoreResults: 7
};

// tipsy, facebook style tooltips for jquery
// Modified / simplified version for internal Keshif use
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

function Tipsy(element, options) {
    this.jq_element = $(element);
    this.options = $.extend({}, this.defaults, options);
};
Tipsy.prototype = {
    defaults: {
        className: null,
        delayOut: 0,
        fade: false,
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
    hide: function() {
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
    // 1:  selected for inclusion
    // -1: selected for removal
    // 0: not selected
	this.selected = 1;
    // used by attributes
    this.items = []; // items which are mapped/related to this item.
	this.activeItems = 0; // If primary item, activeItems is the number of active linked items
    this.highlightedItems=0;
    // An item can be loaded as non-primary first, but used as primary for another chart, so, always incldue this info
//    if(primary){
        this.filterCache = [];
        this.wanted = true;
        this.wantedOrder = 0; // some default. Used by listDisplay to adjust animations
        this.mappedItems = [];
        // accessed with filterID, the data that's used for mapping this item
        this.mappedData = []; // caching the values this item was mapped to
        // DOM elements of this primary item
        this.mappedDotDOMs = [];
        this.mappedDOMs = [];
        this.dirtyFilter = true;
        this.asdasdasd = false;
//    }
};
kshf.Item.prototype = {
    /**
     * Returns unique ID of the item.
     */
    id: function(){
        return this.data[this.idIndex];
    },
    /** -- */
    setFilter: function(index,v){
        if(this.filterCache[index]===v) return;
        this.filterCache[index] = v;
        this.dirtyFilter = true;
    },

    /** -- */
    f_selected: function(){ return this.selected !== 0; },
    f_included: function(){ return this.selected === 1; },
    f_removed:  function(){ return this.selected ===-1; },

    f_unselect: function(){ 
        this.selected = 0;
        if(this.facetDOM) this.facetDOM.setAttribute("selected",this.selected);
    },
    f_include: function(){
        this.selected = 1;
        if(this.facetDOM) this.facetDOM.setAttribute("selected",this.selected);
    },
    f_remove: function(){
        this.selected = -1;
        if(this.facetDOM) this.facetDOM.setAttribute("selected",this.selected);
    },

    /** -- */
    addItem: function(item){
        this.items.push(item);
        this.activeItems++;
        this.sortDirty = true;
        item.mappedItems.push(this);
    },
    /**
     * Updates wanted state, and notifies all related filter attributes of the change.
     */
    updateSelected: function(recursive){
        if(!this.dirtyFilter) return;

        var me=this;
        var oldWanted = this.wanted;

        // checks if all filter results are true
        // At first "false", breaks the loop
        this.wanted=true;
        this.filterCache.every(function(f){
            me.wanted=me.wanted&&f;
            return me.wanted;
        });
        
        if(this.wanted===true && oldWanted===false){
            this.mappedItems.forEach(function(attrib){
                attrib.activeItems++;
                if(attrib.activeItems===1 && attrib.barChart!==undefined){
                    if(recursive!==attrib.barChart && !attrib.barChart.isLinked){
                        // it is now selected, see other DOM items it has and increment their count too
                        attrib.mappedDOMs.forEach(function(dom){
                            dom.__data__.activeItems++;
                        });
                    }
                }
                attrib.sortDirty=true;
            });
            this.mappedDotDOMs.forEach(function(d){ d.setAttribute('display',"true"); });
        } else if(this.wanted===false && oldWanted===true){
            this.mappedItems.forEach(function(attrib){
                attrib.activeItems--;
                if(attrib.activeItems===0 && attrib.barChart!==undefined){
                    if(recursive!==attrib.barChart && !attrib.barChart.isLinked){
                        // it is now not selected, see other DOM items it has and increment their count too
                        attrib.mappedDOMs.forEach(function(dom){
                            dom.__data__.activeItems--;
                        });
                    }
                }
                attrib.sortDirty=true;
            });
            this.mappedDotDOMs.forEach(function(d){ d.setAttribute('display',"false"); });
        }
        this.dirtyFilter = false;
    },
    updateSelected_SelectOnly: function(recursive){
        if(!this.wanted) this.updateSelected(recursive);
    },
    updateSelected_UnSelectOnly: function(recursive){
        if(this.wanted) this.updateSelected(recursive);
    },
    /** Highlights the list item */
    highlightListItem: function(){
        if(this.listItem) this.listItem.setAttribute("highlight",true);
    },
    highlightAdvanced: function(noRecurse){
        if(this.highlightDone) return;
        this.highlightDone = true;
        this.highlightListItem();
        // if an item facet has a facetDOM, it is part of filtering
        if(this.facetDOM && this.activeItems>0){
            this.facetDOM.setAttribute("highlight",true);
            // Fixed: Also checking if this is the main item type. If so, don't iterate over!
            if(this.barChart && !this.barChart.isLinked){
                // see the main items stored under this one...
                this.items.forEach(function(item){
                    item.highlightAdvanced(noRecurse);
                });
            }
        }
        this.mappedData.forEach(function(m){
            if(m===null) return;
            if(m instanceof Array) {
                m.forEach(function(item){
                    item.highlightedItems++;
                    if(item.barChart && !item.barChart.isLinked){
                        if(item.highlightedItems===1 && item.barChart!==noRecurse){
                            // TODO: Don't go under the current one, if any
                            item.mappedDOMs.forEach(function(d){
                                d.__data__.highlightedItems++;
                            });
                        }
                    }
                });
            } else {
                if(m.highlightedItems!==undefined){
                    m.highlightedItems++;
                    if(m.barChart && !m.barChart.isLinked){
                        if(m.highlightedItems===1 && m.barChart!==noRecurse){
                            // TODO: Don't go under the current one, if any
                            m.mappedDOMs.forEach(function(d){
                                d.__data__.highlightedItems++;
                            });
                        }
                    }
                } else if(m.b) {// histogram bin
                    m.b.highlightedItems++;
                }
            }
        });
    },
    /** Higlights all relevant UI parts to this UI item - Attributes, dots, and list */
    highlightAll: function(){
        this.mappedDOMs.forEach(function(d){d.setAttribute('highlight',true);});
        this.mappedData.forEach(function(d){
            if(d===null || d.h===undefined) return;
            d.h.setSelectedPosition(d.v);
        })
        this.highlightListItem();
    },
    /** Removes higlight from the list item */
    nohighlightListItem: function(){
        if(this.listItem) this.listItem.setAttribute("highlight",false);
    },
    nohighlightAdvanced: function(noRecurse){
        if(this.highlightDone) return;
        this.highlightDone = true;
        this.nohighlightListItem();
        if(this.facetDOM && this.activeItems>0){
            this.facetDOM.setAttribute("highlight",false);
            // Fixed: Also checking if this is the main item type. If so, don't iterate over!
            if(this.barChart && !this.barChart.isLinked){
                // see the main items stored under this one...
                this.items.forEach(function(item){
                    item.nohighlightAdvanced(noRecurse);
                });
            }
        }
        this.mappedData.forEach(function(m){
            if(m===null) return;
            if(m instanceof Array) {
                m.forEach(function(item){
                    item.highlightedItems--;
                    if(item.barChart && !item.barChart.isLinked){
                        if(item.highlightedItems===0 && item.barChart!==noRecurse){
                            item.mappedDOMs.forEach(function(d){
                                d.__data__.highlightedItems--;
                            });
                        }
                    }
                });
            } else {
                if(m.highlightedItems!==undefined){
                    m.highlightedItems--;
                    if(m.barChart && !m.barChart.isLinked){
                        if(m.highlightedItems===0 && m.barChart!==noRecurse){
                            m.mappedDOMs.forEach(function(d){
                                d.__data__.highlightedItems--;
                            });
                        }
                    }
                } else if(m.b) {// histogram bin
                    m.b.highlightedItems--;
                }
            }
        });
    },
    /** Removes higlight from all relevant UI parts to this UI item - Attributes, dots, and list */
    nohighlightAll: function(){
        this.mappedDOMs.forEach(function(d){d.setAttribute('highlight',false);});
        this.mappedData.forEach(function(d){
            if(d===null || d.h===undefined) return;
            d.h.hideSelectedPosition();
        })
        this.nohighlightListItem();
    }
};

kshf.Filter = function(id, opts){
    this.isFiltered = false;
    this.filterSummaryBlock = null;

    this.name = opts.name
    this.browser = opts.browser;
    // filter needs to know about filteredItems because it auto clears, etc...
    this.filteredItems = opts.filteredItems;
    this.onClear = opts.onClear;
    this.onFilter = opts.onFilter;
    this.hideCrumb = opts.hideCrumb;
    this.text_header = opts.text_header;
    this.text_item = opts.text_item;
    if(opts.cb_this)
        this.cb_this = opts.cb_this;
    else
        this.cb_this = this;

    this.id = id;
    this.isFiltered = false;
    this.filteredItems.forEach(function(item){
        item.setFilter(this.id,true);
    },this);
};
kshf.Filter.prototype = {
    addFilter: function(forceUpdate,recursive){
        var itemsSelectedCt_ = this.browser.itemsSelectedCt;
        this.isFiltered = true;

        if(recursive===undefined) recursive=true;
        if(this.onFilter) this.onFilter.call(this.cb_this, this, recursive);

        // if this has a parent facet, link selection from this to the main table
        var hasParent = this.cb_this.parentFacet!==undefined;
        if(hasParent){
            var fct=this.cb_this.parentFacet;
            if(fct.hasAttribs()){
                fct.updateAttribCount_Wanted();
                fct.attribFilter.how = "All";
                // re-run the parents attribute filter...
                fct.attribFilter.addFilter(false,fct); // This filter will update the browser later if forceUpdate===true
            }
        }

        this.refreshFilterSummary();

        if(forceUpdate===true){
            this.browser.updateItemSelectedCt();
            this.browser.refreshFilterClearAll();
//            if(itemsSelectedCt_!==this.browser.itemsSelectedCt)
                this.browser.update(-1); // fewer results, probably!
        }
    },
    clearFilter: function(forceUpdate,recursive){
        if(!this.isFiltered) return;
        var itemsSelectedCt_ = this.browser.itemsSelectedCt;
        this.isFiltered = false;

        this.filteredItems.forEach(function(item){ item.setFilter(this.id,true); },this);

        if(recursive===undefined) recursive=true;
        this.onClear.call(this.cb_this,this);

        this.refreshFilterSummary();

        this.filteredItems.forEach(function(item){
            item.updateSelected_SelectOnly(recursive);
        });

        if(forceUpdate===true){
            if(this.cb_this.parentFacet){
                var fct=this.cb_this.parentFacet;
                if(fct.hasAttribs()){
                    fct.updateAttribCount_Wanted();
                    fct.attribFilter.how = "All";
                    if(fct.attribCount_Wanted===fct.attribCount_Total){
                        fct.attribFilter.clearFilter(false,fct); // force update
                    } else {
                        // re-run the parents attribute filter...
                        fct.attribFilter.addFilter(false,fct); // force update
                    }
                }
            }

            this.browser.updateItemSelectedCt();

            this.browser.refreshFilterClearAll();
//            if(itemsSelectedCt_!==this.browser.itemsSelectedCt)
                this.browser.update(1); // more results
        }
        if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.Clear,
            this.browser.getFilteringState(this.name));
    },

    /** Don't call this directly */
    refreshFilterSummary: function(){
        if(this.hideCrumb===undefined && this.browser.subBrowser!==true && this.browser.isSmallWidth()){
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
            }
            if(this.text_header!==undefined){
                var text = this.text_header;
                if(typeof text === 'function'){
                    text = text.call(this.cb_this, this);
                }
                if(this.browser.subBrowser===true){
                    text += " ("+this.browser.itemName+")";
                }
                this.filterSummaryBlock.select(".txttt").html(text+": ");
            }
            if(this.text_item!==undefined){
                var text = this.text_item;
                if(typeof text === 'function'){
                    text = text.call(this.cb_this, this);
                }
                this.filterSummaryBlock.select(".filter_item").html(text);
            }
        }
    },
    /** Inserts a summary block to the list breadcrumb DOM */
    /** Don't call this directly */
    insertFilterSummaryBlock: function(){
        var x;
        var me=this;
        x = this.browser.dom.filtercrumbs
            .append("span").attr("class","filter-block")
            ;
        x.append("span").attr("class","chartClearFilterButton summary").text("x")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n',
                    fade: true,
                    opacity: 1,
                    title: function(){ 
                        return "<span class='big'>x</span class='big'> <span class='action'>Remove</span> filter"; 
                    }
                })
            })
            .on("click",function(){
                this.tipsy.hide();
                me.clearFilter(true);
            })
            .on("mouseover",function(){
                this.tipsy.show();
            })
            .on("mouseout",function(d,i){
                this.tipsy.hide();
                d3.event.stopPropagation();
            })
            ;
        var y = x.append("span").attr("class","sdsdsds");
        y.append("span").attr("class","txttt");
        y.append("span").attr("class","filter_item");
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
    this.itemtoggledetailsWidth = 20;
    this.browser = kshf_;
    this.dom = {};

    this.scrollTop_cache=0;

    this.linkColumnWidth = 85;
    this.linkColumnWidth_ItemCount = 25;
    this.linkColumnWidth_BarMax = this.linkColumnWidth-this.linkColumnWidth_ItemCount-3;

    this.selectColumnWidth = 17;

    this.contentFunc = config.contentFunc;
    if(config.content!==undefined){
        this.contentFunc = this.browser.getColumnData(this.browser.primaryTableName,config.content);
    }

    this.maxVisibleItems = kshf.maxVisibleItems_default;
    if(config.maxVisibleItems_Default){
        this.maxVisibleItems = config.maxVisibleItems_Default;
    }

    this.hasLinkedItems = false
    if(config.hasLinkedItems!==undefined){
        this.hasLinkedItems = true;
    }
    
    // Sorting options
    this.sortingOpts = config.sortingOpts;
    this.sortingOpts.forEach(function(sortOpt){
        if(sortOpt.value===undefined) {
            sortOpt.value = this.browser.getColumnData(this.browser.primaryTableName,sortOpt.name);
        }
        if(!sortOpt.label) sortOpt.label = sortOpt.value;
        if(sortOpt.inverse===undefined) sortOpt.inverse = false;
        if(sortOpt.func===undefined) sortOpt.func = me.getSortFunc(sortOpt.value);
    },this);
    this.sortingOpt_Active = this.sortingOpts[0];

    this.displayType = 'list';
    if(config.displayType==='grid') this.displayType = 'grid';

    this.visibleCb = config.visibleCb;

    this.sortColWidth = config.sortColWidth;

    this.textSearch = config.textSearch;
    this.textSearchFunc = config.textSearchFunc;
    if(this.textSearch!==undefined){
        if(this.textSearchFunc===undefined){
            this.textSearchFunc = this.browser.getColumnData(this.browser.primaryTableName,this.textSearch);
        }
        if(this.textSearch[0]==="*")
            this.textSearch = this.textSearch.substring(1);
        // decapitalize
        this.textSearch = kshf.Util.toProperCase(this.textSearch);
    }
    this.hideTextSearch = (this.textSearchFunc===undefined);

    this.detailsToggle = config.detailsToggle;
    if(this.detailsToggle === undefined) { this.detailsToggle = "Off"; }
    this.detailsDefault = config.detailsDefault;
    if(this.detailsDefault === undefined) { this.detailsDefault = false; }
    if(this.detailsToggle==="One") this.detailsDefault=false;

	this.listDiv = root.append("div").attr("class", "kshf listDiv")
        .attr('showAll',this.detailsDefault?'false':'true')
        .attr('detailsToggle',this.detailsToggle);

    this.dom.listHeader=this.listDiv.append("div").attr("class","listHeader");

    this.dom.listHeader_TopRow = this.dom.listHeader.append("div").attr("class","topRow");
    this.dom.listHeader_BottomRow = this.dom.listHeader.append("div").attr("class","bottomRow");

    this.dom.listItemGroup=this.listDiv.append("div").attr("class","listItemGroup")
        .on("scroll",function(d){
            // showMore display
            if(this.scrollHeight-this.scrollTop-this.offsetHeight<10){
                me.dom.showMore.style("bottom","4px");
            } else{
                me.dom.showMore.style("bottom","-27px");
            }
            // scrollTop display
            me.dom.scrollToTop.style("visibility", this.scrollTop>0?"visible":"hidden");
        });

    // TODO: if sorting column is shown...
    this.sortFilters = [];
    if(this.displayType==='list'){
        this.sortingOpts.forEach(function(sortingOpt){
            this.sortFilters.push(
                kshf_.createFilter({
                    name: sortingOpt.name,
                    browser: this.browser,
                    filteredItems: this.browser.items,
                    cb_this: this,
                    onClear: function(filter){
                        filter.filterValue = "";
                    },
                    onFilter: function(filter, recursive){
                        // what is current sorting column?
                        var labelFunc=this.sortingOpt_Active.label;
                        // if any of the linked items are selected, filtering will pass true
                        // Note: items can only have one mapping (no list stuff here...)
                        filter.filteredItems.forEach(function(item){
                            item.setFilter(filter.id,(labelFunc(item)===filter.filterValue));
                            item.updateSelected(recursive);
                        });
                    },
                    text_header: sortingOpt.name,
                    text_item: function(filter){
                        return "<b>"+filter.filterValue+"</b>";
                    }
                })
                );
        },this);
    }
    this.sortFilter_Active = this.sortFilters[0];

    // **************************************************************************************************
    // Header stuff *************************************************************************************

    this.dom.scrollToTop = this.dom.listHeader_BottomRow.append("span").attr("class","scrollToTop")
        .html("⬆")
        .attr("title","Scroll To Top")
        .on("click",function(d){ kshf.Util.scrollToPos_do(me.dom.listItemGroup[0][0],0); });
    this.insertHeaderSortSelect();
    if(this.detailsToggle!=="Off") {
        this.insertHeaderToggleDetails();
    }
    if(this.hasLinkedItems){
        this.insertHeaderLinkedItems();
    }

    this.sortItems();
    this.insertItems();

    // insert "show more" thing...
    this.dom.showMore = this.listDiv.append("div").attr("class","showMore")
        .on("click",function(){
            me.maxVisibleItems *= 2;
            me.updateItemVisibility(true);
            this.style.bottom = "-25px";
            if(sendLog) sendLog(CATID.Other,ACTID_OTHER.ShowMoreResults);
        })
        .on("mouseenter",function(){
            d3.select(this).selectAll(".loading_dots").attr("anim",true);
        })
        .on("mouseleave",function(){
            d3.select(this).selectAll(".loading_dots").attr("anim",null);
        })
        ;
    this.dom.showMore.append("span").attr("class","MoreText").html("Show More");
    this.dom.showMore.append("span").attr("class","Count CountAbove");
    this.dom.showMore.append("span").attr("class","Count CountBelow");
    this.dom.showMore.append("span").attr("class","loading_dots loading_dots_1");
    this.dom.showMore.append("span").attr("class","loading_dots loading_dots_2");
    this.dom.showMore.append("span").attr("class","loading_dots loading_dots_3");
};
kshf.List.prototype = {
    /* -- */
    insertHeaderTextSearch: function(){
        var me=this;
        var listHeaderTopRowTextSearch;

        this.textFilter = this.browser.createFilter({
            name: "TextSearch",
            browser: this.browser,
            filteredItems: this.browser.items,
            cb_this: this,
            // no text_item function, filtering text is already shown
            onClear: function(filter){
                filter.filterStr = "";
                this.dom.mainTextSearch[0][0].value = "";
                listHeaderTopRowTextSearch.select(".clearText").style('display','none');
            },
            onFilter: function(filter,recursive){
                // split the search string, search for each item individually
                filter.filterStr=filter.filterStr.split(" ");
                listHeaderTopRowTextSearch.select(".clearText").style('display','inline-block');
                // go over all the items in the list, search each keyword separately
                filter.filteredItems.forEach(function(item){
                    var f = ! filter.filterStr.every(function(v_i){
                        return me.textSearchFunc(item).toLowerCase().indexOf(v_i)===-1;
                    });
                    item.setFilter(filter.id,f);
                    item.updateSelected(recursive);
                });
            },
            hideCrumb: true,
        });

        listHeaderTopRowTextSearch = this.dom.listHeader_TopRow.append("span").attr("class","mainTextSearch");
        listHeaderTopRowTextSearch.append("i").attr("class","fa fa-search searchIcon");;
        this.dom.mainTextSearch = listHeaderTopRowTextSearch.append("input")
            .attr("placeholder","Search "+(this.textSearch?this.textSearch:"title"))
            .attr("autofocus","true")
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
                        me.textFilter.clearFilter(true);
                    }
                    x.timer = null;
                    if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.MainTextSearch,me.browser.getFilteringState());
                }, 750);
            });
        listHeaderTopRowTextSearch.append("i").attr("class","fa fa-times-circle clearText")
            .on("click",function() {
                me.textFilter.clearFilter(true);
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.MainTextSearch,me.browser.getFilteringState());
            });
    },
    /** -- */
    insertHeaderSortSelect: function(){
        var me=this;
        var x = this.dom.listHeader_BottomRow.append("div").attr("class","listsortcolumn")
            .style("width",this.sortColWidth+"px")
            .style('white-space','nowrap');
        // just insert it as text
        if(me.displayType==='grid'){
            x.append("span").attr("class","sortBy").text("Sort by: ");
        }
        if(this.sortingOpts.length===1){
            x.append("span").text(this.sortingOpts[0].name);
            return;
        }
        x.append("select")
            .attr("class","listSortOptionSelect")
            .style("width",this.sortColWidth+"px")
            .on("change", function(){
                me.sortingOpt_Active = me.sortingOpts[this.selectedIndex];
                me.sortFilter_Active = me.sortFilters[this.selectedIndex];
                me.reorderItemsOnDOM();
                me.updateVisibleIndex();
                me.maxVisibleItems = kshf.maxVisibleItems_default;
                me.updateItemVisibility();
                if(me.displayType==='list'){
                    // update sort column labels
                    me.dom.listsortcolumn
                        .html(function(d){
                            return me.sortingOpt_Active.label(d);
                        })
                        .each(function(d){
                            this.columnValue = me.sortingOpt_Active.label(d);
                        });
                }
                // me.updateShowListGroupBorder();
            })
            .selectAll("input.list_sort_label").data(this.sortingOpts)
            .enter().append("option")
                .attr("class", "list_sort_label")
                .text(function(d){ return d.name; })
                ;
    },
    /** -- */
    insertHeaderToggleDetails: function(){
        var me=this;
        var x=this.dom.listHeader_BottomRow.append("div").attr("class","itemtoggledetails");
        x.append("span").attr("class","items_details_on").html("[+]")
            .attr("title","Show details")
            .on("click", function(d){
                me.dom.listItems.attr('details', true);
                me.listDiv.attr('showAll','false');
            });
        x.append("span").attr("class","items_details_off").html("[-]")
            .attr("title","Hide details")
            .on("click", function(d){
                me.dom.listItems.attr('details', false);
                me.listDiv.attr('showAll','true');
            });
    },
    insertHeaderLinkedItems: function(){
        var me=this;
        var xyz = this.dom.listHeader_BottomRow.append("span").attr("class","selectColumn");
        xyz.append("span").attr("class","selectSelect").text("Select:");
        xyz.append("i").attr("class","fa fa-square-o")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n',
                    fade: true,
                    opacity: 1,
                    title: function(){ return "<span class='big'>-</span class='big'> <span class='action'>Unselect</span> all results"; }
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("click",function(){
                me.browser.items.forEach(function(item){
                    if(!item.wanted) return;// no change
                    item.asdasdasd = false;
                    item.listItem.setAttribute("selectLinked",false);
                });
                me.browser.linkedFacets.forEach(function(f){
                    f.updateSorting(0);
                });
                me.browser.updateLayout_Height();
            });
        xyz.append("i").attr("class","fa fa-check-square-o")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n',
                    fade: true,
                    opacity: 1,
                    title: function(){ return "<span class='big'>+</span class='big'> <span class='action'>Select</span> all results"; }
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("click",function(){
                me.browser.items.forEach(function(item){
                    if(!item.wanted) return;// no change
                    item.asdasdasd = true;
                    item.listItem.setAttribute("selectLinked",true);
                });
                me.browser.linkedFacets.forEach(function(f){
                    f.updateSorting(0);
                });
                me.browser.updateLayout_Height();
            });
    },
    /** Insert items into the UI, called once on load */
    insertItems: function(){
        var me = this;

        this.dom.listItems = this.dom.listItemGroup.selectAll("div.listItem")
            // if content Func is not defined, provide an empty list
            .data(this.browser.items, function(d){ return d.id(); })
        .enter()
            .append("div")
            .attr("class","listItem")
            .attr("details",this.detailsDefault?"true":"false")
            .attr("highlight",false)
            .attr("animSt","visible")
            .attr("selectLinked","false")
            .attr("itemID",function(d){return d.id();})
            // store the link to DOM in the data item
            .each(function(d){ d.listItem = this; })
            .on("mouseover",function(d,i){
                d3.select(this).attr("highlight","true");
                d.highlightAll();
            })
            .on("mouseout",function(d,i){
                d3.select(this).attr("highlight","false");
                // find all the things that  ....
                d.nohighlightAll();
            });
        
        if(this.displayType==='list'){
            this.insertItemSortColumn();
        }
        if(this.detailsToggle!=="Off"){
            this.insertItemToggleDetails();
        }

        this.dom.listItems_Content = this.dom.listItems.append("div").attr("class","content")
            .html(function(d){ return me.contentFunc(d);});

        if(this.hasLinkedItems){
            var xyz = this.dom.listItems.append("span").attr("class","selectColumn")
                .style("width",this.selectColumnWidth+"px");
            xyz.append("i").attr("class","fa fa-square-o")
                .each(function(d){
                    this.tipsy = new Tipsy(this, {
                        gravity: 'n',
                        fade: true,
                        opacity: 1,
                        title: function(){ return "<span class='big'></span class='big'> <span class='action'>Select</span> item"; }
                    })
                })
                .on("mouseover",function(){ this.tipsy.show(); })
                .on("mouseout",function(d,i){ this.tipsy.hide(); })
                .on("click",function(d){
                    this.tipsy.hide();
                    d.asdasdasd = true;
                    this.parentNode.parentNode.setAttribute("selectLinked",true);
                    me.browser.linkedFacets.forEach(function(f){
                        f.updateSorting(0);
                    });
                    me.browser.updateLayout_Height();
                });

            xyz.append("i").attr("class","fa fa-check-square-o")
                .each(function(d){
                    this.tipsy = new Tipsy(this, {
                        gravity: 'n',
                        fade: true,
                        opacity: 1,
                        title: function(){ return "<span class='big'>-</span class='big'> <span class='action'>Unselect</span> item"; }
                    })
                })
                .on("mouseover",function(){ this.tipsy.show(); })
                .on("mouseout",function(d,i){ this.tipsy.hide(); })
                .on("click",function(d){
                    this.tipsy.hide();
                    d.asdasdasd = false;
                    this.parentNode.parentNode.setAttribute("selectLinked",false);
                    me.browser.linkedFacets.forEach(function(f){
                        f.updateSorting(0);
                    });
                    me.browser.updateLayout_Height();
                });
         }
    },
    /** Insert sort column into list items */
    insertItemSortColumn: function(){
        var me=this;
        this.dom.listsortcolumn = this.dom.listItems.append("div").attr("class","listcell listsortcolumn")
            .style("width",this.sortColWidth+"px")
            .html(function(d){ return me.sortingOpt_Active.label(d); })
            .each(function(d){ this.columnValue = me.sortingOpt_Active.label(d); })
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 's', fade: true, opacity: 1,
                    title: function(){
                        return "<span class='big'>+</span> <span class='action'>Add</span> <i>"+
                            me.sortingOpt_Active.name+"</i> Filter"; 
                    }
                })
            })
            .on("mouseover",function(){
                if(me.sortFilter_Active.isFiltered) return;
                this.tipsy.show();
            })
            .on("mouseout",function(d,i){
                this.tipsy.hide();
            })
            .on("click",function(d,i){
                if(me.sortFilter_Active.isFiltered) return;
                this.tipsy.hide();
                me.sortFilter_Active.filterValue = this.columnValue;
                me.sortFilter_Active.addFilter(true);
            })
            ;
    },
    /** -- */
    insertItemToggleDetails: function(){
        var me=this;
        var x= this.dom.listItems
            .append("div")
            .attr("class","listcell itemtoggledetails")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity:'s', fade:true, className:'details',
                    title: function(){ return "Show details"; }
                });
            })
            ;
        x.append("span").attr("class","item_details_on").html("[+]")
            .on("click", function(d){ 
                this.parentNode.tipsy.hide();
                me.showListItemDetails(d);
            })
            .on("mouseover",function(d){
                this.parentNode.tipsy.options.title = function(){ return "Show details"; };
                this.parentNode.tipsy.show();
            })
            .on("mouseout",function(d){ this.parentNode.tipsy.hide(); });
        x.append("span").attr("class","item_details_off").html("[-]")
            .on("click", function(d){ 
                me.hideListItemDetails(d);
            })
            .on("mouseover",function(d){ 
                this.parentNode.tipsy.options.title = function(){ return "Hide details"; };
                this.parentNode.tipsy.show();
            })
            .on("mouseout",function(d){ this.parentNode.tipsy.hide(); });
    },
    /** -- */
    hideListItemDetails: function(item){
        item.listItem.setAttribute('details', false);
        this.lastSelectedItem = undefined;
        if(sendLog) sendLog(CATID.ItemBased,ACTID_ITEM.Collapse,{itemID:item.id()});
    },
    /** -- */
    showListItemDetails: function(item){
        item.listItem.setAttribute('details', true);
        if(this.detailsToggle==="One"){
            if(this.lastSelectedItem){
                this.lastSelectedItem.listItem.setAttribute("details",false);
            }
        }
        this.lastSelectedItem = item;
        if(sendLog) sendLog(CATID.ItemBased,ACTID_ITEM.Show,{itemID:item.id()});
    },
    /** after you re-sort the primary table or change item visibility, call this function */
    updateShowListGroupBorder: function(){
        var me = this;
        if(this.displayType==='list') {
            if(this.sortingOpt_Active.noGroupBorder===true){
                this.dom.listItems.style("border-top-width", "0px");
            } else {
                // go over item list
                var pItem=null;
                var sortValueFunc = this.sortingOpt_Active.value;
                var sortFunc = this.sortingOpt_Active.func;
                this.browser.items.forEach(function(item,i){
                    if(!item.wanted) return;
                    if(pItem!==null){ 
                        if(item.listItem!==undefined)
                        item.listItem.style.borderTopWidth = 
                            sortFunc(sortValueFunc(item),sortValueFunc(pItem))!==0?"4px":"0px";
                    }
                    pItem = item;
                });
            }
        }
    },
    /** Reorders items in the DOM
     *  Only called after list is re-sorted (not called after filtering)
     */
    reorderItemsOnDOM: function(){
        this.sortItems();
        this.dom.listItems = this.dom.listItemGroup.selectAll("div.listItem")
            .data(this.browser.items, function(d){ return d.id(); })
            .order();
    },
    /** Sort all items fiven the active sort option 
     *  List items are only sorted on list init and when sorting options change.
     *  They are not resorted on filtering! In other words, filtering does not affect item sorting.
     */
    sortItems: function(){
        var me=this;
        var sortValueFunc = this.sortingOpt_Active.value;
        var sortFunc = this.sortingOpt_Active.func;
        var inverse = this.sortingOpt_Active.inverse;
        this.browser.items.sort(
            function(a,b){
                // Put unwanted data to later
                // Don't. Then, when you change result set, you'd need to re-order
                var dif=sortFunc(sortValueFunc(a),sortValueFunc(b));
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
    updateItemVisibility: function(showMoreOnly){
        var me = this;
        var showType=this.displayType==='list'?"block":"inline-block";
        var visibleItemCount=0;

        var isInViewNow = function(item){
            return ;
        };
        var isInViewBefore = function(item){
            return 
        };

        this.dom.listItems
            .each(function(item){
                var domItem = this;
                // adjust visibleItemCount
                var isVisible = (item.wantedOrder>=0 && item.wantedOrder<me.maxVisibleItems);
                if(isVisible) visibleItemCount++;

                if(isVisible) {
                    if(me.visibleCb) me.visibleCb.call(this,item);
                }

                if(showMoreOnly){
                    this.style.display = isVisible?showType:'none';
                    this.setAttribute("animSt","visible");
                    return;
                }

                var isInViewNow = item.wantedOrder>=0 && item.wantedOrder<50;
                var isInViewBefore = item.wantedOrder_pre>=0 && item.wantedOrder_pre<50;

                // NOTE: Max 100 items can be under animation (in view now, or before), so don't worry about performance!

                if(isInViewNow){
                    if(isInViewBefore){
                        // "in view" now, "in view" before
                        this.setAttribute("animSt","visible");
                        this.style.display = isVisible?showType:'none';
                    } else {
                        this.style.display = showType;
                        domItem.setAttribute("animSt","closed"); // start from closed state
                        // "in view" now, but not "in view" before
                        setTimeout(function(){ domItem.setAttribute("animSt","open") },500);
                        setTimeout(function(){ domItem.setAttribute("animSt","visible") },1100+item.wantedOrder*10);
                    }
                } else {
                    // item not in view now
                    if(isInViewBefore && isVisible===false){
                        // not in view now, but in view before
                        setTimeout(function(){ domItem.setAttribute("animSt","open") },-item.wantedOrder*10);
                        setTimeout(function(){ domItem.setAttribute("animSt","closed") },500);
                        setTimeout(function(){ domItem.style.display = 'none' },1000);
                    } else {
                        // not "in view" now or before
                        this.setAttribute("animSt","visible");
                        this.style.display = isVisible?showType:'none';
                    }
                }
            });

        var hiddenItemCount = this.browser.itemsSelectedCt-visibleItemCount;
        this.dom.showMore.style("display",(hiddenItemCount===0)?"none":"block");
        this.dom.showMore.select(".CountAbove").html("&#x25B2;"+visibleItemCount+" shown");
        this.dom.showMore.select(".CountBelow").html(hiddenItemCount+" below&#x25BC;");
    },
    /** -- */
    updateContentWidth: function(contentWidth){
        contentWidth-=4; // 2*2 border left&right
        contentWidth-=this.browser.scrollWidth; // assume scroll is displayed
        // ready for showmore...
        this.dom.showMore.style("width",(contentWidth-5)+"px");
        contentWidth-=this.sortColWidth;
        if(this.detailsToggle!=="Off") 
            contentWidth-=this.itemtoggledetailsWidth;
        if(this.hasLinkedItems) 
            contentWidth-=this.selectColumnWidth;
        if(this.displayType==='list'){
            this.dom.listItems_Content.style("width",(contentWidth)+"px");
        }
        if(this.hasLinkedItems){
            contentWidth-=75; // 75 pixels for Select all & checkboxes...
        }
        this.browser.dom.filtercrumbs.style("width",(contentWidth-15)+"px");
    },
    updateAfterFiltering_do:function(){
        this.updateVisibleIndex();
        this.maxVisibleItems = kshf.maxVisibleItems_default;
        this.updateItemVisibility(false);
        // this.updateShowListGroupBorder();
    },
    /** returns active filter count */
    updateAfterFiltering: function(){
        var me=this;
        if(this.scrollTop_cache===0 && false){
            me.updateAfterFiltering_do();
            return;
        }
        // scroll to top
        var startTime = null;
        var scrollDom = this.dom.listItemGroup[0][0];
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
            item.wantedOrder_pre = item.wantedOrder;
            if(item.wanted){
                item.wantedOrder = wantedCount;
                wantedCount++;
            } else {
                item.wantedOrder = -unwantedCount;
                unwantedCount++;
            }
        },this);
    }
};

/**
 * @constructor
 */
kshf.Browser = function(options){
    var me = this;
    // BASIC OPTIONS
	this.facets = [];
    this.facetsLeft = [];
    this.facetsRight = [];
    this.linkedFacets = [];
    this.maxFilterID = 0;
    this.barChartWidth = 0;

    this.scrollWidth = 21;
    this.sepWidth = 10;
    this.line_height = 18;
    this.filterList = [];

    this.columnsSkip = options.columnsSkip;

    this.categoryTextWidth = options.categoryTextWidth;
    if(this.categoryTextWidth===undefined) this.categoryTextWidth = 115;

    if(typeof options.barChartWidth === 'number'){
        this.barChartWidthInit = options.barChartWidth;
    }

    this.subBrowser = options.subBrowser;
    this.facetDefs = options.facets;
    if(options.charts) this.facetDefs = options.charts;
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

    this.dom = {};

    // itemName
    if(options.itemName!==undefined){
        this.itemName = options.itemName;
    } else {
        this.itemName = this.source.sheets[0].name;
    }
    // primItemCatValue
    this.primItemCatValue = null;
    if(typeof options.catValue === 'string'){ this.primItemCatValue = options.catValue; }
    // showDataSource
    this.showDataSource = true;
    if(options.showDataSource!==undefined) this.showDataSource = options.showDataSource;
    // forceHideBarAxis
    this.forceHideBarAxis = false;
    if(options.forceHideBarAxis!==undefined) this.forceHideBarAxis = options.forceHideBarAxis;

    this.TopRoot = d3.select(this.domID)
        .classed("kshfHost",true)
//        .attr("tabindex","1")
        .style("position","relative")
        .style("overflow-y","hidden")
        .on("keydown",function(){
            // escape key
            if(d3.event.keyCode===27){
                me.clearFilters_All();
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearAllEscape,this.getFilteringState());
            }
        })
        ;

    // remove any DOM elements under this domID, kshf takes complete control over what's inside
    var rootDomNode = this.TopRoot[0][0];
    while (rootDomNode.hasChildNodes()) rootDomNode.removeChild(rootDomNode.lastChild);

    this.root = this.TopRoot.attr("noanim",false);

    if(options.showResizeCorner === true) this.insertResize();
    this.insertInfobox();
    this.insertBrowserHeader();

    this.dom.subRoot = this.root.append("div").attr("class","subRoot");

    this.facetBackground = this.dom.subRoot.append("div").attr("class","kshf layout_left_background");
    this.dom.leftBlockAdjustSize = this.facetBackground.append("div")
        .style("position","relative")
        .style("height","100%")
    .append("span").attr("class","leftBlockAdjustSize")
        .attr("title","Drag to adjust panel width")
        .on("mousedown", function (d, i) {
            if(d3.event.which !== 1) return; // only respond to left-click
            me.root.style('cursor','ew-resize');
            me.root.attr('noanim',true);
            var mouseDown_x = d3.mouse(this.parentNode.parentNode)[0];
            var mouseDown_width = me.barChartWidth;
            me.root.on("mousemove", function() {
                var mouseMove_x = d3.mouse(this)[0];
                var mouseDif = mouseMove_x-mouseDown_x;
                var oldhideBarAxis = me.hideBarAxis;
                me.setBarWidthLeftPanel(mouseDown_width+mouseDif);
                if(me.hideBarAxis!==oldhideBarAxis){
                    me.updateLayout_Height();
                }
            }).on("mouseup", function(){
                me.root.style('cursor','default');
                me.root.attr('noanim',false);
                // unregister mouse-move callbacks
                me.root.on("mousemove", null).on("mouseup", null);
                if(sendLog) sendLog(CATID.Other,ACTID_OTHER.LeftPanelWidth,{panelWidth:me.barChartWidth});
            });
            d3.event.preventDefault();
        })
        .on("click",function(){
            d3.event.stopPropagation();
            d3.event.preventDefault();
        });    

    this.layoutTop = this.dom.subRoot.append("div").attr("class", "kshf layout_top");
    this.layoutLeft  = this.dom.subRoot.append("div").attr("class", "kshf layout_left");
    this.layoutRight  = this.dom.subRoot.append("div").attr("class", "kshf layout_right");
	
    this.loadSource();
};

kshf.Browser.prototype = {
    /** includes label + number */
    getRowTotalTextWidth: function(){
        return this.categoryTextWidth + this.getRowLabelOffset();
    },
    getWidth_LeftPanel: function(){
        return this.getRowTotalTextWidth()+this.barChartWidth+this.scrollWidth;
    },
    getWidth_Total: function(){
        return this.divWidth;
    },
    /** -- */
    domHeight: function(){
        return parseInt(this.TopRoot.style("height"));
    },
    /** -- */
    domWidth: function(){
        return parseInt(this.TopRoot.style("width"));
    },
    // TODO: Not used yet. If names are the same and config options are different, what do you do?
    createFilter: function(opts){
        // see if it has been created before TODO
        var newFilter = new kshf.Filter(this.maxFilterID,opts);
        ++this.maxFilterID;
        this.filterList.push(newFilter);
        return newFilter;
    },/*
    passChanges: function(){
        this.facets.forEach(function(facet){
            if(!facet.hasAttribs() || !facet.hasFacets()) return;
            fct.updateAttribCount_Wanted();
            fct.attribFilter.how = "All";
            // re-run the parents attribute filter...
            fct.attribFilter.addFilter(false,false); // This filter will update the browser later if forceUpdate===true
            this.hasAttribs();
        });
    },*/
    /** -- */
    insertResize: function(){
        var me=this;
        this.root.append("div").attr("class", "kshf layout_resize")
            .on("mousedown", function (d, i) {
                me.root.style('cursor','nwse-resize');
                me.root.attr("noanim",true);
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
                    if(sendLog) sendLog(CATID.Other,ACTID_OTHER.Resize);
                    me.root.style('cursor','default');
                    me.root.attr("noanim",false);
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
        creditString += "<div class='header'>This data browser is created by <span class='libName'>Keshif</span>.</div>";
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

        this.layout_infobox = this.root.append("div").attr("class", "kshf layout_infobox");
        this.layout_infobox.append("div")
            .attr("class","infobox_background")
            .on("click",function(){
                me.layout_infobox.style("display","none");
                me.layout_infobox.select("div.infobox_credit").style("display","none");
                me.layout_infobox.select("div.infobox_datasource").style("display","none");
            });
        this.dom.loadingBox = this.layout_infobox.append("div").attr("class","infobox_content infobox_loading");
//        this.dom.loadingBox.append("span").attr("class","fa fa-spinner fa-spin");
        var ssdsd = this.dom.loadingBox.append("span").attr("class","loadinggg");
        ssdsd.append("span").attr("class","loading_dots loading_dots_1").attr("anim",true);
        ssdsd.append("span").attr("class","loading_dots loading_dots_2").attr("anim",true);
        ssdsd.append("span").attr("class","loading_dots loading_dots_3").attr("anim",true);

        var hmmm=this.dom.loadingBox.append("div").attr("class","status_text");
        hmmm.append("span").attr("class","info").text("Loading data sources...");
        hmmm.append("span").attr("class","dynamic")
            .text(
                (this.source.sheets!==undefined)?
                "("+this.source.loadedTableCount+"/"+this.source.sheets.length+")":
                ""
                );

        var infobox_credit = this.layout_infobox.append("div").attr("class","infobox_content infobox_credit")
        infobox_credit.append("div").attr("class","infobox_close_button").text("x")
            .on("click",function(){
                me.layout_infobox.style("display","none");
                me.layout_infobox.select("div.infobox_credit").style("display","none");
                me.layout_infobox.select("div.infobox_datasource").style("display","none");
            });
        infobox_credit.append("div").attr("class","all-the-credits").html(creditString);

        var infobox_datasource = this.layout_infobox.append("div").attr("class","infobox_content infobox_datasource").text("Datasource files:");
        infobox_datasource.append("div").attr("class","infobox_close_button").text("x")
            .on("click",function(){
                me.layout_infobox.style("display","none");
                me.layout_infobox.select("div.infobox_credit").style("display","none");
                me.layout_infobox.select("div.infobox_datasource").style("display","none");
            });
        var infobox_datasource_ul = infobox_datasource.append("ul");
        if(this.showDataSource && this.source.gDocId===undefined && this.source.callback===undefined){
            infobox_datasource_ul.selectAll("li")
                .data(this.source.sheets, this._dataMap)
              .enter().append("li")
                .append("a")
                .attr("target","_blank")
                .attr("href",function(i){ return me.source.dirPath+i.name+"."+me.source.fileType;})
                .text(function(i){ return i.name+"."+me.source.fileType;})
                ;
        }
    },
    /** --- */
    insertClearAll: function(){
        var me=this;
        // insert clear all option
        if(this.listDisplay===undefined) {
            // none
            this.dom.filterClearAll = this.root.select(".ffffffff");
            return;
        }
        this.dom.filterClearAll = this.listDisplay.dom.listHeader_TopRow.append("span").attr("class","filterClearAll")
            .text("Show all");
        this.dom.filterClearAll.append("div").attr("class","chartClearFilterButton allFilter")
            .text("x")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n',
                    fade: true,
                    opacity: 1,
                    title: function(){ 
                        return "<span class='big'>x</span class='big'> <span class='action'>Remove</span> all filtering"; 
                    }
                })
            })
            .on("mouseover",function(){
                this.tipsy.show();
            })
            .on("mouseout",function(d,i){
                this.tipsy.hide();
                d3.event.stopPropagation();
            })
            .on("click",function(){ 
                this.tipsy.hide();
                me.clearFilters_All();
            })
            ;
    },
    /** --- */
    insertBrowserHeader: function(){
        var me = this;
    },
    /** -- */
    showInfoBox: function(){
        if(sendLog) sendLog(CATID.Other,ACTID_OTHER.InfoButton);
        this.layout_infobox.style("display","block");
        this.layout_infobox.select(".infobox_credit").style("display","block");
    },
    /** -- */
    loadSource: function(){
        if(this.source.callback){
            this.source.callback(this);
            return;
        }
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
                this.source.url = "https://docs.google.com/spreadsheet/ccc?key="+this.source.gdocId;
                this.loadSheet_Google(sheet);
            } else if(this.source.dirPath){
                this.loadSheet_File(sheet);
            } else if (sheet.data) { // load data from memory - ATR
                this.loadSheet_Memory(sheet);
            }
        },this);
    },
    loadSheet_Google: function(sheet){
        var me=this;
        var qString=kshf.queryURL_base+this.source.gdocId+'&headers=1'
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

            // create the item array
            arr.length = dataTable.getNumberOfRows(); // pre-allocate for speed
            for(r=0; r<dataTable.getNumberOfRows() ; r++){
                var c=[];
                c.length = numCols; // pre-allocate for speed
                for(i=0; i<numCols ; i++) { c[i] = dataTable.getValue(r,i); }
                // push unique id as the last column if necessary
                if(idIndex===numCols) c.push(itemId++);
                arr[r] = new kshf.Item(c,idIndex);
            }

            kshf.createColumnNames(sheet.tableName);
            for(j=0; j<dataTable.getNumberOfColumns(); j++){
                kshf.insertColumnName(sheet.tableName,dataTable.getColumnLabel(j).trim(),j);
            }
            me.finishDataLoad(sheet,arr);
        });
    },
    /** The only place where jquery ajax load is used! */
    loadSheet_File: function(sheet){
        var me=this;
        var fileName=this.source.dirPath+sheet.name+"."+this.source.fileType;
        $.ajax( {
            url:fileName,
            type:"GET",
            contentType:"text/csv",
            success: function(data) {
                if(kshf.dt[sheet.tableName]!==undefined){
                    me.incrementLoadedSheetCount();
                    return;
                }
                var i,j;
                var lines = data.split(/\r\n|\r|\n/g);
                if(lines.length<2) { return; } // csv file doens't have data
                kshf.createColumnNames(sheet.tableName);
                var arr = [];
                var idIndex = -1;
                var itemId=0;
                // for each line, split on , character
                for(i=0; i<lines.length; i++){
                    var c;
                    if(me.source.fileType==='csv')
                        c=lines[i].split(",");
                    else if(me.source.fileType==='tsv')
                        c=lines[i].split("\t");
                    c=kshf.Util.unescapeCommas(c);
                    if(i===0){ // header 
                        for(j=0; j<c.length;j++){
                            var colName = c[j];
                            kshf.insertColumnName(sheet.tableName,colName,j);
                            if(colName===sheet.id){ idIndex = j;}
                        }
                        if(idIndex===-1){ // id column not found, you need to create your own
                            kshf.insertColumnName(sheet.tableName,sheet.id,j);
                            idIndex = j;
                        }
                    } else { // content
                        // push unique id as the last column if necessary
                        if(idIndex===c.length) c.push(itemId++);
                        var item=new kshf.Item(c,idIndex)
                        arr.push(item);
                    }
                }
                me.finishDataLoad(sheet, arr);
            }
        });
    },
    /** load data from memory - ATR - Anne Rose */
    loadSheet_Memory: function(sheet){
        var j;
        var arr = [];
        var idIndex = -1;
        var itemId=0;
        if(kshf.dt[sheet.tableName]!==undefined){
            this.incrementLoadedSheetCount();
            return;
        }
        this.createColumnNames(sheet.tableName);
        sheet.data.forEach(function(c,i){
            if(i===0){ // header 
                c.forEach(function(colName,j){
                    kshf.insertColumnName(sheet.tableName,colName,j);
                    if(colName===sheet.id){ idIndex = j;}
                });
                if(idIndex===-1){ // id column not found, you need to create your own
                    kshf.insertColumnName(sheet.tableName,sheet.id,j);
                    idIndex = j;
                }
            } else { // content
                // push unique id as the last column if necessary
                if(idIndex===c.length) c.push(itemId++);
                arr.push(new kshf.Item(c,idIndex));
            }
        });
        this.finishDataLoad(sheet,arr);
    },
    /** -- */
    createTableFromTable: function(srcData, dstTableName, mapFunc, labelFunc){
        var i,uniqueID=0;
        var me=this;
        kshf.dt_id[dstTableName] = {};
        kshf.dt[dstTableName] = [];
        var dstTable_Id = kshf.dt_id[dstTableName];
        var dstTable = kshf.dt[dstTableName];

        srcData.forEach(function(srcData_i){
            var v = mapFunc(srcData_i);
            if(v==="" || v===undefined || v===null) return;
            if(v instanceof Array) {
                v.forEach(function(v2){
                    if(v2==="" || v2===undefined || v2===null) return;
                    if(!dstTable_Id[v2]){
                        var itemData = [uniqueID++,v2];
                        if(labelFunc){
                            itemData.push(labelFunc(v2));
                        }
                        var item = new kshf.Item(itemData,0);
                        dstTable_Id[v2] = item;
                        dstTable.push(item);
                    }   
                });
            } else {
                if(!dstTable_Id[v]){
                    var itemData = [uniqueID++,v];
                    if(labelFunc){
                        itemData.push(labelFunc(v2));
                    }
                    var item = new kshf.Item(itemData,0);
                    dstTable_Id[v] = item;
                    dstTable.push(item);
                }   
            }
        });
    },
    /** -- */
    finishDataLoad: function(sheet,arr) {
        kshf.dt[sheet.tableName] = arr;
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
            this.source.sheets.forEach(function(sheet){
                if(sheet.primary){
                    this.items = kshf.dt[sheet.tableName];
                    this.itemsSelectedCt = this.items.length;
                }
            },this);

            this.layout_infobox.select("div.status_text .info").text("Creating browser...");
            this.layout_infobox.select("div.status_text .dynamic").text("");
            window.setTimeout(function(){ me.loadCharts(); }, 50);
        }
    },
    /** -- */
    loadCharts: function(){
        var me=this;
        if(this.loadedCb!==undefined) this.loadedCb.call(this);

        // Use all the columns in the data, insert to view in order...
        if(this.facetDefs===undefined){
            this.facetDefs = [];

            var skipFacet = {};
            if(this.columnsSkip){
                this.columnsSkip.forEach(function(c){ skipFacet[c] = true; },this);
            }

            var colNames = kshf.dt_ColNames_Arr[this.primaryTableName];
            colNames.forEach(function(colName){
                if(colName===this.source.sheets[0].id) return;
                if(skipFacet[colName]===true) return;
                if(colName[0]==="*") return;
                this.facetDefs.push({facetTitle: colName});
            },this);
        }

        // TODO: Find the first column that has a date value, set it the time component of first chart
        this.facetDefs.forEach(function(facetDescr){ 
            me.addFacet(facetDescr,this.primaryTableName);
        },this);

        // Init facet DOMs after all facets are added / data mappings are completed
        this.facets.forEach(function(facet){ facet.init_DOM(); });

        if(this.listDef!==undefined){
            this.listDisplay = new kshf.List(this,this.listDef, this.dom.subRoot);

            var resultInfo = this.listDisplay.dom.listHeader_TopRow.append("span").attr("class","resultInfo");
            var listheader_count_width = (this.listDisplay.sortColWidth+5);
            if(this.listDisplay.detailsToggle!=="Off") listheader_count_width+=15;
            this.dom.listheader_count = resultInfo.append("span").attr("class","listheader_count")
                .style("width",listheader_count_width+"px");
            resultInfo.append("span").attr("class","listheader_itemName").html(this.itemName);

            if(this.listDisplay.hideTextSearch!==true){
                this.listDisplay.insertHeaderTextSearch();
            }

            this.dom.filtercrumbs = this.listDisplay.dom.listHeader_BottomRow.append("span").attr("class","filtercrumbs");

            var rightSpan = this.listDisplay.dom.listHeader_TopRow.append("span").attr("class","rightBoxes");
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
                    .attr("title","Show data source")
                    .on("click",function(){
                        if(me.source.dirPath){
                            me.layout_infobox.style("display","block");
                        }
                        if(sendLog) sendLog(CATID.Other,ACTID_OTHER.DataSource);
                    })
                  ;
            }
            // Info & Credits
            rightSpan.append("i").attr("class","fa fa-info-circle credits")
                .attr("title","Show Info & Credits")
                .on("click",function(){ me.showInfoBox();});
        }
        this.insertClearAll();

        this.loaded = true;
        this.initBarChartWidth();
        this.refreshFilterClearAll();
        this.update(0,true);
        this.updateLayout_Height();

        // hide infobox
        this.layout_infobox.style("display","none");
        this.dom.loadingBox.style("display","none");

        if(this.readyCb!==undefined) this.readyCb(this);
    },
    /** -- */
    addFacet: function(options, primTableName){
        // if catTableName is the main table name, this is a self-referencing widget. Adjust listDef
        if(options.catTableName===this.primaryTableName){
            this.listDef.hasLinkedItems = true;
        }

        // How do you get the value from items...
        if(options.catItemMap===undefined){
            // if we have a column name mapping, use that
            if(kshf.dt_ColNames[primTableName]!==undefined) {
                var ID = this.getColumnID(primTableName,options.facetTitle);
                if(ID!==undefined)
                    options.catItemMap = function(d){ return d.data[ID]; };
            } else {
                // see if items have the given facet title as a data property
                if(kshf.dt[primTableName][0].data[options.facetTitle]){
                    options.catItemMap = function(d){ return d.data[options.facetTitle]; };
                }
            }
        } else if(typeof(options.catItemMap)==="string"){
            options.catItemMap = this.getColumnData(primTableName,options.catItemMap);
        }
        if(options.timeTitle){
            // How do you access time attribute of item?
            if(options.timeItemMap===undefined){
                options.timeItemMap = this.getColumnData(primTableName,options.timeTitle);
            } else if(typeof(options.timeItemMap)==="string"){
                options.timeItemMap = this.getColumnData(primTableName,options.timeItemMap);
            }
        }


        if(options.items===undefined){
            options.items = this.items;
        }

        if(options.type) {
            options.type = options.type.toLowerCase();
        } else {
            // If certain options are defined, load categorical
            if(options.catLabelText || options.timeTitle || options.catTableName ){
                options.type="categorical";
            } else if(options.catItemMap!==undefined && typeof(options.catItemMap(kshf.dt[primTableName][0]))==="number"){
                options.type="interval";
            } else {
                // undefined catItemMap means it's a hierarchical facet (most probably)
                options.type="categorical";
            }
        }

        var fct;
        if(options.type==="categorical"){
            fct = this.addFacet_Categorical(options);
        } else if(options.type==="interval"){
            fct = this.addFacet_Interval(options);
        }
        if(options.layout==="left"){
            this.facetsLeft.push(fct);
        } if(options.layout==="right"){
            this.facetsRight.push(fct);
        }
        return fct;
    },
    addFacet_Categorical: function(options){
        if(options.layout===undefined){
            options.layout = (options.timeTitle!==undefined)?"top":"left";
        }
        if(options.sortingOpts===undefined) options.sortingOpts = [{}];

        var fct=new kshf.Facet_Categorical(this,options);
        this.facets.push(fct);
        if(fct.isLinked) this.linkedFacets.push(fct);
        return fct;
    },
    addFacet_Interval: function(options){
        if(options.layout===undefined){
            options.layout = "left";
        }
        var fct=new kshf.Facet_Interval(this,options);
        this.facets.push(fct);
        return fct;
    },
    getColumnID: function(tableName, columnName){
        if(kshf.dt_ColNames[tableName]===undefined) return undefined;
        return kshf.dt_ColNames[tableName][columnName];
    },
    getColumnData: function(tableName, columnName){
        var ID = this.getColumnID(tableName, columnName);
        if(ID===undefined) {
            return function(d){ return d.data[columnName]; };
        }
        return function(d){ return d.data[ID]; };
    },
    /** For each primary item
     *  - Run the mapFunc
     *  - If result is array, remove duplicates
     *  - Store result in mappedData[filterId]
     *  - For each result, add the primary item under that item.
     */
    mapItemData: function(items, mapFunc, targetTable, filterId){
        items.forEach(function(item){
            var toMap = mapFunc(item);
            item.mappedData[filterId] = null;
            if(toMap===undefined || toMap==="" || toMap===null) { 
                return;
            } else if(toMap instanceof Array){
                // remove duplicate / invalid values in the array
                var found = {};
                toMap = toMap.filter(function(e){
                    if(e===undefined || e==="" || e===null) return false;
                    if(found[e]===undefined){
                        found[e] = true;
                        return true;
                    }
                    return false;
                });
                if(toMap.length===0) {
                    return;
                }
                if(toMap.length===1) {
                    toMap = toMap[0]; // array to single item
                } else {
                    item.mappedData[filterId] = [];
                    toMap.forEach(function(a){
                        var m=targetTable[a];
                        if(m==undefined) return;
                        item.mappedData[filterId].push(m);
                        m.addItem(item);
                    });
                    return;
                }
            }
            var m=targetTable[toMap];
            if(m==undefined) return;
            item.mappedData[filterId] = m;
            m.addItem(item);
        });
    },
    /** set x offset to display active number of items */
    getRowLabelOffset: function(){
        if(this._labelXOffset) return this._labelXOffset
        var maxTotalCount = d3.max(this.facets, function(facet){ 
            return facet.getMaxBarValueMaxPerAttrib();
        });
        this._labelXOffset = 13;
        var digits = 1;
        while(maxTotalCount>9){
            digits++;
            maxTotalCount = Math.floor(maxTotalCount/10);
        }
        if(digits>4) digits = 4;
        this._labelXOffset += digits*6;
        return this._labelXOffset;
    },
    /** External method - used by demos to auto-select certain features on load -- */
    filterFacetAttribute: function(facetID, itemId){
        this.facets[facetID].filterAttrib(this.facets[facetID].getAttribs()[itemId]);
    },
    /** -- */
    clearFilters_All: function(force){
        var me=this;
        // clear all registered filters
        this.filterList.forEach(function(filter){ filter.clearFilter(false); })
        if(force!==false){
            this.items.forEach(function(item){ item.updateSelected_SelectOnly(true); });
            this.refreshFilterClearAll();
            this.update(1); // more results
        }
        setTimeout( function(){ me.browser.updateLayout_Height(); }, 1000); // update layout after 1.75 seconds
    },
    updateItemSelectedCt: function(){
        this.itemsSelectedCt = 0;
        this.items.forEach(function(item){
            if(item.wanted) this.itemsSelectedCt++;
        },this);
    },
    /** @arg resultChange: 
     * - If positive, more results are shown
     * - If negative, fewer results are shown
     * - Else, no info is available. */
    update: function (resultChange, noWait) {
        var me=this;

        // if running for the first time, do stuff
        if(this.firsttimeupdate === undefined){
            this.items.forEach(function(item){item.updateSelected(true);});
            this.firsttimeupdate = true; 
        }

        this.dom.listheader_count.text((this.itemsSelectedCt!==0)?this.itemsSelectedCt:"No");

        this.facets.forEach(function(facet){
            facet.refreshAfterFilter(resultChange);
        });

        if(this.listDisplay) this.listDisplay.updateAfterFiltering();

        if(this.updateCb) this.updateCb(this);
    },
    refreshFilterClearAll: function(){
        var filteredCount=0;
        this.filterList.forEach(function(filter){ filteredCount+=filter.isFiltered?1:0; })
        this.dom.filterClearAll.style("display",(filteredCount>0)?"inline-block":"none");
    },
    refreshWidth_Bars_Highlight: function(){
        this.facets.forEach(function(facet){ facet.refreshResultPreview(); });
    },
    /** -- */
    updateLayout: function(){
        if(this.loaded!==true) return;
        this.divWidth = this.domWidth();
        this.updateLayout_Height();
        this.setBarWidthLeftPanel(this.barChartWidth);
    },
    /** -- */
    updateLayout_Height: function(){
        var me=this;
        var chartHeaderHeight = 0; //parseInt(this.layoutHeader.style("height"))+3; // 3 is padding-margin on css
        var divHeight_Total = this.domHeight()-chartHeaderHeight;
        var divHeight = divHeight_Total;

        // number of barcharts, and initialize all ` as not processed yet
        this.facets.forEach(function(facet){ facet.heightProcessed = false; })
        
        // timeline first ******************
        var firstFacet=this.facets[0];
        if(firstFacet.type==='scatterplot'){
            // uncollapse scatterplot only if total chart height is more than 15 rows
            if(divHeight<270){ // 15 * line_height
                firstFacet.collapsedTime = true;
            } else {
                firstFacet.setHeight(divHeight/4);
                firstFacet.heightProcessed=true;
                divHeight-=firstFacet.getHeight_Total();
            }
        }

        var doLayout = function(divHeight,facets){
            var finalPass = false;
            var processedFacets=0;
            var lastRound = false;
            while(true){
                var remainingFacetCount = facets.length-processedFacets;
                if(remainingFacetCount===0 && divHeight<10) {
                    break;
                }
                var processedFacets_pre = processedFacets;
                facets.forEach(function(facet){
                    // in last round, if you have more attribs than visible, you may increase your height!
                    if(lastRound===true && !facet.collapsed && facet.attribCount_Total!==undefined){
                        if(facet.attribCount_InDisplay<facet.attribCount_Total){
                            divHeight+=facet.getHeight_Total();
                            facet.setHeight(divHeight);
                            return;
                        }
                    }
                    if(facet.heightProcessed) return;
                    if(remainingFacetCount===0) return;
                    // auto-collapse facet if you do not have enough space
                    var targetHeight = Math.floor(divHeight/remainingFacetCount);
                    if(finalPass && targetHeight<facet.getHeight_RangeMin()){
                        facet.setCollapsed(true);
                    }
                    if(!facet.collapsed){
                        if(facet.options.catDispCountFix){
                            // if you have more space than what's requested, you can skip this
                            var newTarget = facet.getHeight_Header()+(facet.options.catDispCountFix+1)*me.line_height;
                            if(finalPass) {
                                newTarget = Math.max(newTarget,targetHeight);
                                facet.setHeight(newTarget);
                            } else {
                                return;
                            }
                        } else if(facet.getHeight_RangeMax()<=targetHeight){
                            // You have 10 rows available, but I need max 5. Thanks,
                            facet.setHeight(facet.getHeight_RangeMax());
                        } else if(finalPass){
                            facet.setHeight(targetHeight);
                        } else if(lastRound){
                        } else {
                            return;
                        }
                    }
                    divHeight-=facet.getHeight_Total();
                    facet.heightProcessed = true;
                    processedFacets++;
                    remainingFacetCount--;
                },this);
                finalPass = processedFacets_pre===processedFacets;
                if(lastRound===true) break;
                if(remainingFacetCount===0) lastRound = true;
            }
            return divHeight;
        };

        var leftHeightRemaining = doLayout(divHeight,this.facetsLeft);
        var rightHeightRemaining = doLayout(divHeight,this.facetsRight);

        var facetsHeight = divHeight_Total-leftHeightRemaining;

        this.facetBackground.style("height",(
            (this.fullWidthResultSet()?facetsHeight:divHeight_Total)-1)+"px");

        // The part where facet DOM is updated
        this.facets.forEach(function(facet){ facet.refreshHeight(); });
 
        if(this.listDisplay) {
            var listDivTop;
            if(this.fullWidthResultSet()){
                listDivTop = facetsHeight;
            } else {
                if(firstFacet.type==='scatterplot'){
                    listDivTop = firstFacet.getHeight_Right();
                } else {
                    listDivTop = 0;
                }
            }
            // get height of header
            var listHeaderHeight=this.listDisplay.dom.listHeader[0][0].offsetHeight;
            var targetHeight = divHeight_Total-listDivTop-listHeaderHeight; // 2 is bottom padding
            if(firstFacet.type==='scatterplot'){
                if(firstFacet.collapsedTime){
                    var difff = firstFacet.getHeight_Total()-listDivTop;
                    this.listDisplay.listDiv.style("margin-top",(-difff+3)+"px");
                    targetHeight-=3;
                } else {
                    this.listDisplay.listDiv.style("margin-top","3px");
                    targetHeight-=3;
                }
            }
            this.listDisplay.dom.listItemGroup.style("height",targetHeight+"px");
        }
    },
    initBarChartWidth: function(){
        this.divWidth = this.domWidth();

        var barChartWidth;
        if(this.fullWidthResultSet() && this.isSmallWidth()){
            barChartWidth = this.divWidth-this.getRowTotalTextWidth()-this.scrollWidth;
        } else {
            // first time
            barChartWidth = this.barChartWidthInit;
            if(barChartWidth===undefined){
                // set it to a reasonable width
                barChartWidth = Math.floor((this.divWidth-this.categoryTextWidth)/11);
            }
        }
        this.setBarWidthLeftPanel(barChartWidth);
    },

    /** Called by initBarChartWidth and left panel width adjust 
     *  @param barChartWidth_ The new bar chart width*/
    setBarWidthLeftPanel: function(barChartWidth_){
        if(barChartWidth_>200) {
            this.hideBars = false;
            this.hideBarAxis = false;
        } else if(barChartWidth_>45){
            this.hideBars = false;
            this.hideBarAxis = false;
        } else if(barChartWidth_>10){
            this.hideBars = false;
            this.hideBarAxis = true;
        } else {
            this.hideBars = true;
            this.hideBarAxis = true;
            barChartWidth_ = 0; // collapse to 0
        }
        if(this.forceHideBarAxis===true){
            this.hideBarAxis = true;
        }
        if(this.hideBars===false){
            this.root.attr("hidebars",false);
        } else {
            this.root.attr("hidebars",true);
        }
        if(this.hideBarAxis===false){
            this.root.attr("hideBarAxis",false);
        } else {
            this.root.attr("hideBarAxis",true);
        }

        this.barChartWidth = barChartWidth_;

        this.facetBackground.style("width",this.getWidth_LeftPanel()+"px");

        this.facets.forEach(function(facet){
            if(facet.hasAttribs()){
                facet.updateBarAxisScale();
                facet.refreshBarGroupWidth();
                if(facet.type==='scatterplot') facet.updateTimeWidth();
            }
            facet.refreshWidth();
        },this);

        // for some reason, on page load, this variable may be null. urgh.
        if(this.listDisplay){
            // 5 pixel space from div width
            var widthListDisplay = this.divWidth;
            var marginLeft = 0;
            var marginRight = 0;
            if(!this.fullWidthResultSet()) {
                if(this.facetsLeft.length>0){
                    marginLeft=2;
                    widthListDisplay-=this.getWidth_LeftPanel()+2;
                }
                if(this.facetsRight.length>0){
                    marginRight=2;
                    widthListDisplay-=this.getWidth_LeftPanel()+2;
                }
            }
            this.listDisplay.updateContentWidth(widthListDisplay);

            this.listDisplay.listDiv.style("width",widthListDisplay+"px");
            this.listDisplay.listDiv.style("margin-left",marginLeft+"px")  
            this.listDisplay.listDiv.style("margin-right",marginRight+"px")  
        }
    },
    /** -- */
    isSmallWidth: function(){
        return (this.categoryTextWidth + 260 > this.divWidth);
    },
    /** -- */
    fullWidthResultSet: function(){
        if(this.facetsLeft.length==0 && this.facetsRight.length==0) return true;
        if(this.isSmallWidth()) return true;
        return false;
    },
    /** -- */
    getFilteringState: function(facetTitle, itemInfo) {
        var r={
            results : this.itemsSelectedCt,
            textSrch: ""
        };

        if(this.listDisplay.dom.mainTextSearch)
            r.textSrch = this.listDisplay.dom.mainTextSearch[0][0].value;

        // facet title parameters
        if(facetTitle !== null) r.facet = facetTitle;

        r.filtered="";
        r.selected="";

        r.itemInfo = itemInfo;

        this.facets.forEach(function(facet,i){
            // include time range if time is filtered
            if(facet.isFiltered_Time)
                if(facet.isFiltered_Time()) r.timeFltr = 1;
            if(facet.isFiltered()){
                if(r.filtered!=="") { r.filtered+="x"; r.selected+="x"; }
                r.filtered+=i;
                r.selected+=facet.attribCount_Selected;
            }
        });

        if(r.filtered==="") r.filtered=null;
        if(r.selected==="") r.selected=null;

        return r;
    },
};



// ***********************************************************************************************************
//
// ***********************************************************************************************************

/**
 * KESHIF FACET - Categorical
 * @constructor
 */
kshf.Facet_Categorical = function(kshf_, options){
    // Call the parent's constructor
    var me = this;
    this.id = ++kshf.num_of_charts;
    this.browser = kshf_;
    this.filteredItems = options.items;

    this.options = options;
    this.layoutStr = options.layout;

    this.sortingOpts = options.sortingOpts.slice();
    this.parentFacet = options.parentFacet;

    this.dom = {};

    if(!this.options.timeTitle){
        this.type = 'barChart';
    } else {
        this.type = 'scatterplot';
    }

    this.scrollTop_cache=0;
    this.configRowCount=0;

    // COLLAPSED
    this.collapsed = false;
    if(options.collapsed===true) this.collapsed = true;

    // Does this facet have attributes?

    this.skipSorting = false;

    if(this.hasAttribs()){
        this.initAttribs(options);
    }
};

kshf.Facet_Categorical.prototype = {
    /** -- */
    getAttribs: function(){
        return kshf.dt[this.catTableName];
    },
    /** -- */
    getAttribs_wID: function(){
        return kshf.dt_id[this.catTableName];
    },
    /** -- */
    getWidth_Left: function(){
        return this.browser.getWidth_LeftPanel()-this.getWidth_LeftOffset();
    },
    /** -- */
    getHeight_Header: function(){
        if(this._height_header==undefined) {
            this._height_header = this.dom.headerGroup[0][0].offsetHeight;
        }
        return this._height_header;
    },
    /** -- */
    getHeight_Right: function(){
        if(!this.hasAttribs()) return this.getHeight_Header();
        if(this.type!=='scatterplot') return this.getHeight_Header();
        if(this.collapsedTime===true || this.collapsed===true) return 1*this.browser.line_height;
        return this.getHeight_Total();
    },
    /** -- */
    getHeight_RangeMax: function(){
        if(!this.hasAttribs()) return this.browser.line_height;
        return this.getHeight_Header()+(this.configRowCount+this.attribCount_Active+1)*this.browser.line_height;
    },
    /** -- */
    getHeight_RangeMin: function(){
        if(!this.hasAttribs()) return this.browser.line_height;
        return this.getHeight_Header()+(this.configRowCount+Math.min(this.attribCount_Active,3)+1)*this.browser.line_height;
    },
    /** -- */
    getHeight_Total: function(){
        if(!this.hasAttribs()) return this.getHeight_Header();
        if(this.collapsed) return this.getHeight_Header();
        // need 1 more row at the bottom is scrollbar is shown, or barInfoText is set
        return this.getHeight_Header() + this.getHeight_Content();
    },
    getHeight_Content: function(){
        var bottomRow=0;
        if(!this.allAttribsVisible() || this.browser.hideBarAxis===false ||
            (this.type==="scatterplot"&&this.collapsedTime===false)) bottomRow=1;
        return this.attribHeight + (this.configRowCount+bottomRow)*this.browser.line_height+
            (this.type==="scatterplot"?5:0); // add 5 more pixels for scatterplot
    },
    getWidth_LeftOffset: function(){
        var offset=0;
        if(this.parentFacet){
            offset+=17;
        }
        return offset;
    },
    /** -- */
    getFilteredCount: function(){
        return this.isFiltered()+this.isFiltered_Time();
    },
    /** -- */
    isFiltered: function(state){
        return this.attribCount_Selected !== 0 || 
               this.attribCount_Wanted !== this.attribCount_Total;
    },
    /** -- */
    rowCount_Header_Right: function(){
        if(this.type!=='scatterplot') return 0;
        if(this.collapsedTime) return 1;
        return 2;
    },
    /** -- */
    allAttribsVisible: function(){
        return this.attribCount_Active===this.attribCount_InDisplay;
    },
    /** Use this method to update selectType value */
    setSelectType: function(t){
        this.attribFilter.selectType = t;
        this.divRoot.attr("selectType",this.attribFilter.selectType);
    },
    hasFacets: function(){
        return this.subFacets!==undefined;
    },
    hasAttribs: function(){
        return this.options.catItemMap!==undefined;
    },
    initAttribs: function(options){
        // ATTRIBUTE SORTING OPTIONS
        this.sortingOpts.forEach(function(opt){
            // apply defaults
            if(opt.no_resort===undefined) opt.no_resort=false;
            if(opt.func===undefined) opt.func=kshf.Util.sortFunc_ActiveCount_TotalCount;
            if(opt.inverse===undefined)  opt.inverse=false;
        });
        this.sortingOpt_Active = this.sortingOpts[0];

        // ATTRIBUTE MAPPING / FILTERING SETTINGS
        if(this.options.showNoneCat===undefined) this.options.showNoneCat = false;
        if(this.options.removeInactiveAttrib===undefined) this.options.removeInactiveAttrib = true;
        if(this.options.catLabelText===undefined){
            // get the 2nd attribute as row text [1st is expected to be the id]
            this.options.catLabelText = function(d){ return d.data[1]; };
        }

        // generate row table if necessary
        if(this.options.catTableName===undefined){
            this.catTableName = this.options.facetTitle+"_h_"+this.id;
            this.browser.createTableFromTable(this.filteredItems,this.catTableName, this.options.catItemMap,
                this.options.attribNameFunc);
        } else {
            if(this.options.catTableName===this.browser.primaryTableName){
                this.isLinked=true;
                this.options.catTableName = this.options.facetTitle+"_h_"+this.id;
                kshf.dt_id[this.options.catTableName] = kshf.dt_id[this.browser.primaryTableName];
                kshf.dt[this.options.catTableName] = this.filteredItems.slice();
            }
            this.catTableName = this.options.catTableName;
        }
        if(this.isLinked===undefined){
            this.isLinked = false;
        }
        // Add "none" category if it is requested
        if(this.options.showNoneCat===true){
            // TODO: Check if a category named "None" exist in table
            var noneID = 10000;
            
            var newItem = new kshf.Item([noneID,"None"],0)
            kshf.dt[this.catTableName].push(newItem);
            kshf.dt_id[this.catTableName][noneID] = newItem;

            var _catItemMap = this.options.catItemMap;
            this.options.catItemMap = function(d){
                var r=_catItemMap(d);
                if(r===null) return noneID;
                return r;
            }
            var _catLabelText = this.options.catLabelText;
            this.options.catLabelText = function(d){ 
                return (d.id()===noneID)?"None":_catLabelText(d);
            };
            var _catTooltipText = this.options.catTooltipText;
            this.options.catTooltipText = function(d){ 
                return (d.id()===noneID)?"None":_catTooltipText(d);
            };
        }

        this.attribFilter = this.browser.createFilter({
            name: this.options.facetTitle,
            browser: this.browser,
            filteredItems: this.filteredItems,
            cb_this: this,
            onClear: function(filter){
                // if text search is shown, clear that one
                if(this.showTextSearch){
                    this.dom.clearTextSearch.style("display","none");
                    this.dom.attribTextSearch[0][0].value = '';
                }
                this.unselectAllAttribs();
            },
            onFilter: function(filter,recursive){
                this.updateItemFilterState_Attrib();
                switch(filter.how){
                    case "All":
                        filter.filteredItems.forEach(function(item){ item.updateSelected(recursive); }); break;
                    case "UnSelectOnly":
                        filter.filteredItems.forEach(function(item){ item.updateSelected_UnSelectOnly(recursive); }); break;
                    case "SelectOnly":
                        filter.filteredItems.forEach(function(item){ item.updateSelected_SelectOnly(recursive); }); break;
                }
            },
            text_header: (this.options.textFilter?this.options.textFilter:this.options.facetTitle),
            text_item: this.text_item_Attrib,
        });
        this.attribFilter.selectType = "SelectOr";

        // accesses attribFilter
        this.mapAttribs(options);

        if(this.type === 'scatterplot'){
            // COLLAPSED TIME
            this.collapsedTime = false;
            if(options.collapsedTime===true) this.collapsedTime = true;
            if(this.options.timeBarShow===undefined) this.options.timeBarShow = false;

            this.timeRange ={min:0, max:0, width:0}

            this.timeFilter = this.browser.createFilter({
                name: this.options.timeTitle,
                browser: this.browser,
                filteredItems: this.filteredItems,
                cb_this: this,
                onClear: function(filter){
                    this.dom.timeSlider.attr("filtered",false);
                    this.divRoot.attr("filtered_time",false);
                    this.resetTimeFilterActive();
                    this.resetTimeZoom_ms();
                    this.refreshTimechartLayout(true);
                    this.refreshTimeChart();
                },
                onFilter: function(filter,recursive){
                    this.dom.timeSlider.attr("filtered",true);
                    this.divRoot.attr("filtered_time",true);
                    this.refreshTimeChart();
                    filter.filteredItems.forEach(function(item){
                        var timePos = item.mappedData[filter.id];
                        item.setFilter(filter.id,
                            (timePos>=this.timeFilter.active.min) && (timePos<=this.timeFilter.active.max)
                        );
                        item.updateSelected(recursive);
                    },this);
                },
                text_item: function(){
                    return "from <b>"+this.getFilterMinDateText()+"</b> to <b>"+this.getFilterMaxDateText()+"</b>";
                },
            });

            this.filteredItems.forEach(function(item){
                item.mappedData[this.timeFilter.id] = this.options.timeItemMap(item);
            },this)

            this.x_axis_active_filter = null;
            this.timeData_dt = {
                min: d3.min(this.filteredItems, this.options.timeItemMap),
                max: d3.max(this.filteredItems, this.options.timeItemMap)};

            // calculate minYear and maxYear per cetegory, and use it for total.
            this.updateAttrib_TimeMinMax();
            this.getAttribs().forEach(function(attrib){
                attrib.xMin = attrib.xMin_Dyn;
                attrib.xMax = attrib.xMax_Dyn;
            });
        }
    },
    insertSubFacets: function(){
        this.subFacets = [];
        this.dom.subFacets=this.divRoot.append("div").attr("class","subFacets");

        this.dom.subFacets.append("span").attr("class","wigdhdyt").append("span").text("["+this.options.facetTitle+"]");

        if(!this.hasAttribs()){
            this.options.facets.forEach(function(facetDescr){
                facetDescr.parentFacet = this;
                facetDescr.layout = this.layoutStr;
                var fct=this.browser.addFacet(facetDescr,this.browser.primaryTableName);
                this.subFacets.push(fct);
            },this);
        } else {
            this.options.facets.forEach(function(facetDescr){
                facetDescr.parentFacet = this;
                facetDescr.layout = this.layoutStr;
                facetDescr.items = this.getAttribs();
                var fct=this.browser.addFacet(facetDescr,this.catTableName);
                this.subFacets.push(fct);
            },this);
        }

        // Init facet DOMs after all facets are added / data mappings are completed
        this.subFacets.forEach(function(facet){ facet.init_DOM(); });
    },
    /** -- */
    mapAttribs: function(options){
        var filterId = this.attribFilter.id;
        this.browser.mapItemData(this.filteredItems,this.options.catItemMap, this.getAttribs_wID(), filterId);

        // Check if some item is mapped to multiple values
        this.hasMultiValueItem = false;
        this.filteredItems.forEach(function(item){
            var toMap = item.mappedData[filterId];
            if(toMap===null) return;
            if(toMap instanceof Array) this.hasMultiValueItem = true;
        },this);

        // Modified internal dataMap function - Skip rows with 0 active item count
        if(this.options.dataMap) {
            if(!this.isLinked){
                this._dataMap = function(d){
                    if(d.items.length===0) return null; 
                    return options.dataMap(d);
                };
            } else {
                this._dataMap = function(d){
                    return options.dataMap(d);
                };
            }
        } else {
            if(!this.isLinked){
                this._dataMap = function(d){
                    if(d.items.length===0) return null;
                    return d.id();
                };
            } else {
                this._dataMap = function(d){
                    return d.id();
                };
            }
        }

        this.updateAttribCount_Total();
        this.updateAttribCount_Active();
        if(this.attribCount_Active===1){
            this.options.catBarScale = "scale_frequency";
        }

    	this.unselectAllAttribs();
    },
    /** -- */
    updateAttribCount_Total: function(){
        this.attribCount_Total = 0;
        this.getAttribs().forEach(function(attrib){
            if(this._dataMap(attrib)!==null) this.attribCount_Total++;
        },this);
        this.attribCount_Wanted = this.attribCount_Total;
        // text search is automatically enabled if num of rows is more than 20. NOT dependent on number of displayed rows
        this.showTextSearch = this.options.forceSearch || (this.options.forceSearch!==false && this.attribCount_Total>=20);
    },
    updateAttribCount_Wanted: function(){
        this.attribCount_Wanted = 0;
        this.getAttribs().forEach(function(attrib){
            if(attrib.items.length===0) {
                return;
            }
            if(attrib.wanted) this.attribCount_Wanted++;
        },this);
    },
    /** -- */
    updateAttribCount_Active: function(){
        this.attribCount_Active = 0;
        this.getAttribs().forEach(function(attrib){
            if(this._dataMap(attrib)===null) return;
            if(this.isAttribVisible(attrib)===false) return;
            this.attribCount_Active++;
        },this);
    },
    /** -- */
    init_DOM: function(){
        var me = this;
        var root;
        if(this.parentFacet){
            root = this.parentFacet.dom.subFacets;
        } else {
            if(this.options.layout==="left"){
                root = this.browser.layoutLeft;
            } else if(this.options.layout==="right"){
                root = this.browser.layoutRight;
            } else if(this.options.layout==="top"){
                root = this.browser.layoutTop;
            }
        }
        this.divRoot = root
            .append("div").attr("class","kshfChart")
            .attr("removeInactiveAttrib",this.options.removeInactiveAttrib)
            .attr("filtered",false)
            .attr("inserted_attrib",false)
            .attr("collapsed",this.collapsed===false?"false":"true")
            .attr("hasMultiValueItem",this.hasMultiValueItem)
            .on("mouseleave",function(){
                if(me.skipSorting && me.hasAttribs()){
                    me.skipSorting = false;
                    me.updateBarAxisScale();
                    setTimeout( function(){ me.updateSorting(0); }, 750);
                }
                setTimeout( function(){ me.browser.updateLayout_Height(); }, 1500); // update layout after 1.75 seconds
            })
            ;

        this.dom.headerGroup = this.divRoot.append("div").attr("class","headerGroup");
        this.insertHeader();
        if(this.type==="scatterplot"){
            this.insertRightHeader();
        }

        if(this.hasAttribs()){
            this.init_DOM_Attrib();
        }

        if(this.options.facets){
            this.divRoot.attr("hasFacets",true);
            this.insertSubFacets();
            // no-attrib facets (hierarchy parents) still need to adjust their header position
            this.refreshLabelWidth();
        }
    },
    init_DOM_Attrib: function(){
        var me=this;
        this.dom.wrapper = this.divRoot.append("div").attr("class","wrapper");
        this.dom.facetCategorical = this.dom.wrapper.append("div").attr("class","facetCategorical");

        this.dom.facetControls = this.dom.facetCategorical.append("div").attr("class","facetControls");

        this.dom.leftControls = this.dom.facetControls.append("span").attr("class","leftControls");
        if(this.sortingOpts.length>1) {
            this.insertSortingOpts();
            this.configRowCount++;
        }
        // update header components
        if(this.showTextSearch){
            this.insertLabelTextSearch();
            this.configRowCount++;
        }
        if(this.type==="scatterplot"){
            if(this.configRowCount===0) this.configRowCount=1;
            this.dom.rightControls = this.dom.facetControls.append("span").attr("class","rightControls");
            var config_zoom = this.dom.rightControls.append("span").attr("class","config_zoom");

            config_zoom.append("span")
                .attr("class","zoom_button zoom_in")
                .attr("disabled","true")
                .text("⇥ Zoom in ⇤")
                .on("click",function(d){
                    me.timeZoom_ms = { min: me.timeFilter.active.min, max: me.timeFilter.active.max };
                    me.useCurrentTimeMinMax = true;
                    me.refreshTimechartLayout(true);
                    me.useCurrentTimeMinMax = undefined;
                    me.divRoot.select(".zoom_out").attr("disabled","false");
                    me.divRoot.select(".zoom_in").attr("disabled","true");
                });
            config_zoom.append("span")
                .attr("class","zoom_button zoom_out")
                .attr("disabled","true")
                .text("⇤ Zoom out ⇥")
                .on("click",function(){
                    me.resetTimeZoom_ms();
                    me.useCurrentTimeMinMax = true;
                    me.refreshTimechartLayout(true);
                    me.useCurrentTimeMinMax = undefined;
                    me.divRoot.select(".zoom_out").attr("disabled","true");
                })
                ;
        }
        if(this.configRowCount>0){
            this.dom.facetControls.style("display","block");
        }

        this.dom.facetCategorical.append("span").attr("class","scrollToTop").html("⬆")
            .attr("title","Scroll To Top")
            .on("click",function(d){ kshf.Util.scrollToPos_do(me.dom.attribGroup[0][0],0); });

        this.dom.scrollToTop = this.dom.facetCategorical.selectAll(".scrollToTop");

        if(this.type==='scatterplot'){
            this.dom.middleScrollbar = this.dom.facetCategorical.append("span").attr("class","middleScrollbar")
                .on("scroll",function(d){
                    // sync scroll position
                    me.dom.attribGroup[0][0].scrollTop = this.scrollTop;
                });
            this.dom.middleScrollbar.append("div").attr("class","filler");
            this.dom.selectVertLine = this.dom.facetCategorical.append("span").attr('class',"selectVertLine");
        }

        this.dom.attribGroup = this.dom.facetCategorical.append("div").attr("class","attribGroup")
            .on("scroll",function(d){
                if(kshf.Util.ignoreScrollEvents===true) return;
                var xx=this;
                me.dom.scrollToTop.style("visibility", this.scrollTop>0?"visible":"hidden");

                if(me.type==="scatterplot"){
                    me.dom.middleScrollbar.select(".filler").style("height",this.scrollHeight+"px");
                    me.dom.middleScrollbar[0][0].scrollTop = this.scrollTop;
                }

                me.scrollTop_cache = this.scrollTop;
                me.refreshScrollDisplayMore(Math.round(this.scrollTop / 18.0)+me.attribCount_InDisplay);
            })
            ;

        this.dom.belowAttribs = this.dom.facetCategorical.append("div").attr("class","belowAttribs");
        this.dom.belowAttribs.append("div").attr("class", "border_line");
        this.dom.attribChartAxis = this.dom.belowAttribs.append("div").attr("class", "attribChartAxis");

        this.dom.attribs = this.dom.attribGroup.selectAll("div.attib")
            // removes attributes with no items
            .data(this.getAttribs(), function(attrib){ return attrib.id(); })
          .enter().append("div").attr("class", "attrib")
            .each(function(d){
                var mee=this;
                d.barChart = me;
                // Add this DOM to each item under cats
                d.items.forEach(function(dd){dd.mappedDOMs.push(mee);});
                d.facetDOM = this;
            });

        if(this.type==='scatterplot') { 
            this.divRoot.attr("filtered_time",false)
            if(this.options.timeDotConfig!==undefined){
                this.divRoot.attr("dotconfig",this.options.timeDotConfig);
            }
            this.dom.timeChartAxis = this.dom.belowAttribs.append("div").attr("class","timeChartAxis");
        }

        var mmm=this.dom.belowAttribs.append("div").attr("class","hasLabelWidth");
        this.dom.scroll_display_more = mmm.append("span").attr("class","scroll_display_more")
            .on("mousedown",function(){
                kshf.Util.scrollToPos_do(me.dom.attribGroup[0][0],me.dom.attribGroup[0][0].scrollTop+18);
                if(sendLog) {
                    sendLog(CATID.FacetScroll,ACTID_SCROLL.ClickMore, {facet:me.options.facetTitle});
                }
            });
        if(this.isLinked){
            mmm.append("span").attr('class','selectAllAttribs')
                .on('click',function(){
                    me.selectAllAttribs();
                    me.setSelectType("SelectOr");
                    me.attribFilter.how="All";
                    me.attribFilter.addFilter(true);
                });
        }

        this.insertAttribs();

        if(this.type==='scatterplot') { 
            this.dom.facetCategorical.append("span").attr("class","scrollToTop scrollToTop2")
                .html("⬆")
                .attr("title","Scroll To Top")
                .on("click",function(d){ kshf.Util.scrollToPos_do(me.dom.attribGroup[0][0],0); });

            this.dom.timeSlider = this.dom.timeChartAxis.append("div").attr("class","timeSlider rangeSlider").attr("filtered",false);
            kshf.Util.insertSlider_do(this.dom.timeSlider,{
                'range': this.timeRange,
                'scale': this.timeScale,
                'filter': this.timeFilter,
                'root': this.browser.root
            });
            this.dom.timeLabelGroup = this.dom.timeChartAxis.append("div").attr("class","timeLabelGroup labelGroup");

            this.insertTimeChartRows();
        }
    },
    /** returns the maximum number of total items stored per row in chart data */
    getMaxTotalItemsPerRow: function(){
        if(!this._maxTotalItemsPerRow){
            var dataMapFunc = this._dataMap;
            this._maxTotalItemsPerRow = d3.max(this.getAttribs(), function(d){ 
                if(dataMapFunc(d)===null) { return null; }
                return d.items.length;
            });
        }
        return this._maxTotalItemsPerRow;
    },
    /** returns the maximum number of items stored per row in chart data */
    getMaxBarValuePerAttrib: function(){
        return d3.max(this.getAttribs(), function(d){ 
            return d.activeItems;
        });
    },
    /** returns the maximum number of maximum items stored per row in chart data */
    getMaxBarValueMaxPerAttrib: function(){
        if(this._maxBarValueMaxPerAttrib) return this._maxBarValueMaxPerAttrib;
        if(!this.hasAttribs()) return 0;
        this._maxBarValueMaxPerAttrib = d3.max(this.getAttribs(), function(d){ 
            return d.items.length;
        });
        return this._maxBarValueMaxPerAttrib;
    },
    attrib_UnselectAll: function(){
        this.attribCount_Included = 0;
        this.attribCount_Removed  = 0;
        if(this.divRoot) this.divRoot.attr("inserted_attrib",false);
        this._update_Selected();
    },
    attrib_Include: function(v){
        this.attribCount_Included+=v;
        if(this.divRoot) this.divRoot.attr("inserted_attrib",this.attribCount_Included>0);
        this._update_Selected();
    },
    attrib_Remove: function(v){
        this.attribCount_Removed+=v;
        this._update_Selected();
    },
    attrib_setIncluded: function(i){
        this.attribCount_Included=i;
        if(this.divRoot) this.divRoot.attr("inserted_attrib",this.attribCount_Included>0);
        this._update_Selected();
    },
    _update_Selected: function(){
        this.attribCount_Selected=this.attribCount_Included+this.attribCount_Removed;
        if(this.divRoot) this.divRoot.attr("filtered",this.attribCount_Selected>0);
    },
    /** -- */
    selectAllAttribs: function(){
        if(!this.isLinked) return;
        this.attribCount_Included = 0;
        this.attribCount_Removed  = 0;
        this.getAttribs().forEach(function(attrib){ 
            if(!attrib.asdasdasd) return
            attrib.f_include();
            this.attribCount_Included++;
        },this);
        if(this.divRoot) this.divRoot.attr("inserted_attrib",this.attribCount_Included>0);
        this._update_Selected();
    },
    /** -- */
    unselectAllAttribs: function(){
        this.getAttribs().forEach(function(attrib){ attrib.f_unselect(); });
        this.attrib_UnselectAll();
    },
    setCollapsed: function(v){
        this.collapsed = v;
        this.divRoot.attr("collapsed",this.collapsed===false?"false":"true");
        if(this.subFacets){
            this.subFacets.forEach(function(f){ f.setCollapsed(v); });
        }
    },
    /** -- */
    collapseFacet: function(hide){
        this.setCollapsed(hide);
        this.browser.updateLayout_Height();
        if(sendLog) {
            if(hide===true) sendLog(CATID.FacetCollapse,ACTID_COLLAPSE.Collapse,{facet:this.options.facetTitle});
            else            sendLog(CATID.FacetCollapse,ACTID_COLLAPSE.Show,{facet:this.options.facetTitle});
        }
    },
    /** -- */
    insertHeader: function(){
    	var me = this;

        this.dom.leftHeader = this.dom.headerGroup.append("span").attr("class","leftHeader").style("width","0px");

        var topRow_background = this.dom.leftHeader.append("div").attr("class","chartFirstLineBackground");
        this.dom.leftHeader.append("div").attr("class","border_line");

        var topRow = topRow_background.append("div").attr("class","hasLabelWidth")
            .style("position","relative").style("display","inline-block");
        topRow_background.append("span").attr("class","header_label_arrow")
            .attr("title","Show/Hide attributes").text("▼")
            .on("click",function(){ me.collapseFacet(!me.collapsed); })
            ;
        topRow.append("span").attr("class","chartFilterButtonParent").append("div")
            .attr("class","chartClearFilterButton rowFilter alone")
            .style("top","calc(40% - 7px)")
            .text('x').attr("title","Remove filter")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n',
                    fade: true,
                    opacity: 1,
                    title: function(){ 
                        return "<span class='big'>x</span class='big'> <span class='action'>Remove</span> filter"; 
                    }
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
    		.on("click", function(d,i){
                this.tipsy.hide();
                me.attribFilter.clearFilter(true);
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnFacet,
                    me.browser.getFilteringState(me.options.facetTitle));
            });

        var headerLabel=this.options.facetTitle;
        if(this.parentFacet) {
            if(this.parentFacet.hasAttribs())
                headerLabel = this.parentFacet.options.facetTitle+" <i class='fa fa-chevron-right'></i> "+headerLabel;
        }
        topRow.append("span").attr("class", "header_label")
            .attr("title", this.attribCount_Total+" attributes")
            .html(headerLabel)
            .on("click",function(){ if(me.collapsed) me.collapseFacet(false); });
        var facetIcons = topRow_background.append("span").attr("class","facetIcons");
        if(this.options.description){
            facetIcons.append("span").attr("class","facetDescription fa fa-info-circle")
                .each(function(d){
                    this.tipsy = new Tipsy(this, {
                        gravity: 'nw',
                        fade: true,
                        title: function(){ return me.options.description; }
                    });
                })
                .on("mouseover",function(d){ this.tipsy.show(); })
                .on("mouseout" ,function(d){ this.tipsy.hide(); });
        }
        if(this.isLinked) {
            facetIcons.append("span").attr("class", "isLinkedMark fa fa-check-square-o");
        } else {
            if(this.parentFacet){
                facetIcons.append("span").attr("class", "isLinkedMark fa fa-level-up");
            }
        }
    },
    insertLabelTextSearch: function(){
        var me=this;
        var textSearchRowDOM = this.dom.leftControls.append("div").attr("class","attribTextSearch hasLabelWidth");
        this.dom.attribTextSearch=textSearchRowDOM.append("input")
            .attr("type","text")
            .attr("placeholder","Search")// " in ...+kshf.Util.toProperCase(this.options.facetTitle))
            .on("input",function(){
                if(this.timer){
                    clearTimeout(this.timer);
                }
                var x = this;
                this.timer = setTimeout( function(){
                    var v=x.value.toLowerCase();
                    if(v===""){
                        me.attribFilter.clearFilter(true);
                    } else {
                        textSearchRowDOM.select("i.fa").style("display","block");                     
                        me.attrib_UnselectAll();
                        me.getAttribs().forEach(function(attrib){
                            if(me.options.catLabelText(attrib).toString().toLowerCase().indexOf(v)!==-1){
                                attrib.f_include();
                            } else {
                                // search in tooltiptext
                                if(me.options.catTooltipText && 
                                    me.options.catTooltipText(attrib).toLowerCase().indexOf(v)!==-1) {
                                        attrib.f_include();
                                } else{
                                    attrib.f_unselect();
                                }
                            }
                            if(attrib.f_included()) me.attrib_Include(1);
                        });
                        if(!me.isFiltered()){
                            me.attribFilter.clearFilter(true);                            
                        } else {
                            me.setSelectType("SelectOr");
                            me.attribFilter.how = "All";
                            me.attribFilter.addFilter(true);
                        }
                    }

                    if(sendLog)
                        sendLog(CATID.FacetFilter,
                            ACTID_FILTER.CatTextSearch,
                            me.browser.getFilteringState(me.options.facetTitle));
                }, 750);
            })
            .on("blur",function(){
                d3.event.stopPropagation();
                d3.event.preventDefault();
            })
            ;
        textSearchRowDOM.append("i").attr("class","fa fa-search searchIcon");
        this.dom.clearTextSearch=textSearchRowDOM.append("i").attr("class","fa fa-times-circle clearText")
            .on("click",function() { me.attribFilter.clearFilter(true); });
    },
    insertSortingOpts: function(){
        var me=this;
        var sortGr = this.dom.leftControls.append("span").attr("class","sortOptionSelectGroup hasLabelWidth");
        sortGr.append("span").attr("class","optionSelect_Label").text("Order by");
        sortGr.append("select").attr("class","optionSelect")
            .on("change", function(){
                me.sortingOpt_Active = me.sortingOpts[this.selectedIndex];
                me.updateSorting_do.call(me, 0);
                if(sendLog) {
                    sendLog(CATID.FacetSort,ACTID_SORT.ChangeSortFunc,
                        {facet:me.options.facetTitle, funcID:this.selectedIndex});
                }
            })
        .selectAll("input.sort_label").data(this.sortingOpts)
          .enter().append("option").attr("class", "sort_label")
            .text(function(d){ return d.name; })
            ;
    },
    updateBarAxisScale: function(){
        if(!this.hasAttribs()) return; // nothing else to do
        var me=this;
        if(this.options.catBarScale==="scale_frequency"){
            this.catBarAxisScale = d3.scale.linear()
                .domain([0,this.browser.itemsSelectedCt])
                .rangeRound([0, this.browser.barChartWidth])
                .clamp(true);
        } else {
            this.catBarAxisScale = d3.scale.linear()
                .domain([0,this.getMaxBarValuePerAttrib()])
                .rangeRound([0, this.browser.barChartWidth])
                .clamp(true);
        }
        this.catBarAxisScale.nice(this.getTicksSkip());
        this.refreshWidth_Bars_Active();
        this.refreshWidth_Bars_Total();

        this.dom.bar_highlight.attr("fast",null); // take it slow for result preview animations
        this.refreshResultPreview();
        setTimeout(function(){ me.dom.bar_highlight.attr("fast",true); },700);

        this.refresh_Bars_Ticks();
    },
    /** -- */
    setHeight: function(cc){
        if(!this.hasAttribs()) return;
        var c = cc-this.getHeight_Header()-(1+this.configRowCount)*this.browser.line_height;
        this.attribHeight = Math.min(c,this.browser.line_height*this.attribCount_Active)+1; // 1 is for upper border
        c = Math.floor(c / this.browser.line_height);
        if(c<0) c=1;
        if(c>this.attribCount_Active) c=this.attribCount_Active;
        if(this.attribCount_Active<=2){ 
            c = this.attribCount_Active;
        } else {
            c = Math.max(c,2);
        }
        this.attribCount_InDisplay = c;
        this.refreshScrollDisplayMore(this.attribCount_InDisplay);
    },
    /** -- */
    refreshAfterFilter: function(resultChange){
        if(!this.hasAttribs()) return;
        var me=this;
        // arbitrary change
        this.refreshActiveItemCount();
        if(!this.skipSorting) {
            this.updateBarAxisScale();
            this.updateSorting();
        } else {
            this.refreshWidth_Bars_Active();
        }
        if(this.type==="scatterplot"){
            this.refreshTimeChartBarDisplay();
            this.refreshTimeChartDotConfig();
        }
    },
    /** -- */
    refreshWidth: function(){
        var kshf_ = this.browser;
        var leftWidth = this.getWidth_Left();
        var totalWidth = this.browser.getWidth_Total();

        this.dom.leftHeader.style("width",leftWidth+"px");
        if(this.hasAttribs())
            this.dom.leftControls.style("width",leftWidth+"px");

        if(this.type==="scatterplot"){
            this.dom.rightHeader.style("width",(totalWidth-leftWidth)+"px");
            this.dom.rightControls.style("width",(totalWidth-leftWidth)+"px");
            this.dom.middleScrollbar.style('left',(leftWidth-kshf_.scrollWidth+1)+'px');
            this.dom.facetCategorical.select(".scrollToTop2").style('left',(leftWidth-15)+'px');
            this.dom.timeChartAxis
                .style("width",this.timeRange.width+"px")
                .style("left",(leftWidth+kshf_.sepWidth)+"px");
            if(this.collapsedTime){
                this.dom.attribGroup.style("width",leftWidth+"px");
            } else {
                this.dom.attribGroup.style("width","auto");
            }
        }
    },
    /** -- */
    refreshActiveItemCount: function(){
        var me = this;
        var formatFunc = kshf.Util.formatForItemCount;
        this.dom.item_count.text(function(d){ return formatFunc(d.activeItems);  });
        this.dom.attribs
            .attr("noitems",function(d){ return !me.isAttribSelectable(d); })
            .attr("activeItems",function(d){ return d.activeItems; })
            ;
    },
    refreshBarGroupWidth: function(){
        // total width of bar group...
        this.dom.barGroup.style("width",this.browser.barChartWidth+"px");
    },
    /** -- */
    refreshWidth_Bars_Active: function(){
        var me=this;
        // active bar width
        this.dom.bar_active.each(function(attrib){
            var transform="scaleX("+me.catBarAxisScale(attrib.activeItems)+")";
            this.style.webkitTransform = transform;
            this.style.MozTransform = transform;
            this.style.msTransform = transform;
            this.style.OTransform = transform;
            this.style.transform = transform;
        });
    },
    /** -- */
    refreshWidth_Bars_Total: function(){
        var me = this;
        this.dom.bar_total
            .each(function(attrib){
                var transform="scaleX("+me.catBarAxisScale(attrib.items.length)+")";
                this.style.webkitTransform = transform;
                this.style.MozTransform = transform;
                this.style.msTransform = transform;
                this.style.OTransform = transform;
                this.style.transform = transform;
            });
    },
    /** -- */
    refreshResultPreview: function(){
        if(!this.hasAttribs()) return;
        var me = this;
        this.dom.bar_highlight
            .each(function(attrib){
                var transform="scaleX("+me.catBarAxisScale(attrib.highlightedItems)+")";
                this.style.webkitTransform = transform;
                this.style.MozTransform = transform;
                this.style.msTransform = transform;
                this.style.OTransform = transform;
                this.style.transform = transform;
            });
    },
    /** -- */
    refreshLabelWidth: function(w){
        var me=this;
        var kshf_ = this.browser;
        var rowTextWidth = this.browser.categoryTextWidth;
        var offset=this.getWidth_LeftOffset();

        rowTextWidth-=offset;

        if(this.hasAttribs()){
            this.dom.headerGroup.selectAll(".hasLabelWidth").style("width",rowTextWidth+"px");
            this.dom.facetCategorical.selectAll(".hasLabelWidth").style("width",rowTextWidth+"px");
            this.dom.attribChartAxis.each(function(d){
                var x=(kshf_.getRowTotalTextWidth()-offset);
//                if(me.layoutStr==="left") x = -x;
                var transform="translateX("+x+"px)";
                this.style.webkitTransform = transform;
                this.style.MozTransform = transform;
                this.style.msTransform = transform;
                this.style.OTransform = transform;
                this.style.transform = transform;
            });
        } else {
            this.dom.headerGroup.selectAll(".hasLabelWidth").style("width",rowTextWidth+"px");
        }
    },
    /** -- */
    refreshScrollDisplayMore: function(bottomItem){
        var txt = this.attribCount_Active+" total";
        var more = this.attribCount_Active-bottomItem;
        if(more>0) txt+=" / "+(more)+" more...";
        this.dom.scroll_display_more.text(txt);
    },
    /** -- */
    refreshHeight: function(){
        // Note: if this has attributes, the total height is computed from height of the children by html layout engine.
        // So far, should be pretty nice.
        if(this.hasAttribs()){
            this.dom.wrapper.style("height",(this.collapsed?"0":this.getHeight_Content())+"px");
            if(this.type==="scatterplot"){
                this.dom.scroll_display_more.style("height","22px");
            }
            this.dom.attribGroup.style("height",this.attribHeight+"px"); // 1 is for borders...

            this.dom.attribChartAxis.selectAll("span.line")
                .style("top","-"+(this.attribHeight-8)+"px")
                .style("height",(this.attribHeight-8)+"px");

            if(this.type==='scatterplot'){
                this.refreshTimeAxisHeight();
            }
        }
    },
    /** update ItemFilterState_Attrib */
    updateItemFilterState_Attrib: function(){
        if(!this.isFiltered()){
            return;
        }

        var filter_multi_removed = kshf.Util.filter_multi_removed;

        var filterId = this.attribFilter.id;
        if(this.attribFilter.selectType==="SelectAnd"){
            var filter_multi = kshf.Util.filter_multi_and;
            this.filteredItems.forEach(function(item){
                var attribItem=item.mappedData[filterId];
                var f = false;
                if(attribItem!==null){ 
                    if(attribItem instanceof Array){
                        if(this.attribCount_Removed>0 && filter_multi_removed.call(this,attribItem)){
                            f = false;
                        } else {
                            if(this.attribCount_Included>0)
                                f = filter_multi.call(this,attribItem);
                            else
                                f = true;
                        }
                    } else {
                        // one mapped value only
                        // more than 1 item is selected, and this item only has 1 mapping.
                        f = false;
                    }
                } else{
                    // item is mapped to none. If you don't have anything for insertion, go ahead
                    if(this.attribCount_Included===0){
                        f=true;
                    }
                }
                item.setFilter(filterId,f);
            },this);
        } else {
            // selectType is "SelectOr"
            var filter_multi = kshf.Util.filter_multi_or;
            this.filteredItems.forEach(function(item){
                var attribItem=item.mappedData[filterId];
                var f = false;
                if(attribItem!==null){ 
                    if(attribItem instanceof Array){
                        if(this.attribCount_Removed>0 && filter_multi_removed.call(this,attribItem)){
                            f = false;
                        } else {
                            if(this.attribCount_Included>0) {
                                f = filter_multi.call(this,attribItem);
                            } else {
                                if(this.attribCount_Wanted<this.attribCount_Total){
                                    // say OK if any is wanted...
                                    f = !attribItem.every(function(f){ return !f.wanted; })
                                } else {
                                    f = true;
                                }
                            }
                        }
                    } else {
                        // one mapped value only
                        if(attribItem.f_removed()){
                            //f = false;
                        } else {
                            if(this.attribCount_Included===0){
                                if(this.attribCount_Wanted<this.attribCount_Total){
                                    f = attribItem.wanted;
                                } else {
                                    f = true;
                                }
                            } else {
                                f = attribItem.f_included();
                            }
                        }
                    }
                } else{
                    // item is mapped to none. If you don't have anything for insertion, go ahead
                    if(this.attribCount_Included===0){
                        f=true;
                    }
                }
                item.setFilter(filterId,f);
            },this);
        }
    },
    /** -- */
    isAttribVisible: function(attrib){
        if(this.isLinked){
            if(attrib.asdasdasd===false) return false;
            return true;
        }
        // Show selected attribute always
        if(attrib.f_selected()) return true;
        // Show if number of active items is not zero
        if(attrib.activeItems!==0) return true;
        // Show if item has been "wanted" by some active sub-filtering
        if(this.attribCount_Wanted < this.attribCount_Total && !attrib.wanted) return false;
        // if inactive attributes are not removed, well, don't remove them...
        if(this.options.removeInactiveAttrib===false) return true;
        // facet is not filtered yet, cannot click on 0 items
        if(!this.isFiltered()) return attrib.activeItems!==0;
        // Hide if multiple options are selected and selection is and
        if(this.attribFilter.selectType==="SelectAnd") return false;
        // TODO: Figuring out non-selected, zero-active-item attribs under "SelectOr" is tricky!

        if(attrib.wanted===false) return false;
        return true;
    },
    /** -- */
    isAttribSelectable: function(attrib){
        // Show selected attribute always
        if(attrib.f_selected()) return true;
        // Show if number of active items is not zero
        if(attrib.activeItems!==0) return true;
        // Show if multiple attributes are selected and the facet does not include multi value items
        if(this.isFiltered() && !this.hasMultiValueItem) return true;
        // Hide
        return false;
    },
    removeAttrib: function(attrib){
        this.skipSorting = true;
        if(attrib.f_removed()){
            attrib.f_unselect();
        } else {
            // if number of items in this attrib equals to current result count, do nothing!
            if(attrib.activeItems===this.browser.itemsSelectedCt){
                alert("Removing this attribute would make an empty result set, so it is not allowed.");
                return;
            }
            attrib.f_remove();
        }
        this.attrib_Remove(attrib.f_removed()?1:-1);

        if(!this.isFiltered()){
            this.attribFilter.clearFilter(true);
            return;
        }

        if(attrib.f_removed()){
            this.attribFilter.how = "UnSelectOnly";
        } else {
            this.attribFilter.how = "SelectOnly";
        }

        if(this.dom.attribTextSearch) this.dom.attribTextSearch[0][0].value="";
        this.attribFilter.addFilter(true);
    },
    /** When clicked on an attribute ... */
    filterAttrib: function(attrib, selectOr){
        this.skipSorting = true;
        if(attrib.f_included()){
            attrib.f_unselect();
        } else if(attrib.f_removed()){
            this.removeAttrib(attrib);
            return;
        } else {
            attrib.f_include();
        }
        this.attrib_Include(attrib.f_included()?1:-1);

        if(!this.isFiltered()){
            this.attribFilter.clearFilter(true);
            return;
        } 

        if(attrib.f_included()){
            // attrib is added to filtering
            if(this.attribCount_Included===1){
                this.setSelectType("SelectOr");
                this.attribFilter.how = "UnSelectOnly";
            } else {
                // this.attribCount_Included > 1
                if(this.hasMultiValueItem){
                    if(this.attribCount_Included===2){
                        this.setSelectType((selectOr===undefined)?"SelectAnd":"SelectOr");
                    }
                    if(this.attribFilter.selectType==="SelectAnd"){
                        this.attribFilter.how = "UnSelectOnly";
                    } else {
                        this.attribFilter.how = "SelectOnly";
                    }
                } else {
                    // NO MultiValueItem
                    if(selectOr===true){
                        // or selection with multiple items
                        this.attribFilter.how = "SelectOnly";
                    } else {
                        attrib.skipMouseOut = true;
                        // Removing previously selected attributes
                        this.unselectAllAttribs();
                        attrib.f_include();
                        this.attrib_setIncluded(1);
                        this.attribFilter.how = "All";
                    }
                }
            }
        } else {
            // attrib is removed from filtering, and there are still some items...
            if(this.hasMultiValueItem){
                if(this.attribFilter.selectType==="SelectAnd"){
                    this.attribFilter.how = "SelectOnly";
                } else {
                    this.attribFilter.how = "UnSelectOnly";
                }
                if(this.attribCount_Included===1){
                    this.setSelectType("SelectOr");
                }
            } else {
                this.attribFilter.how = "UnSelectOnly";
            }
        }
        if(this.dom.attribTextSearch) this.dom.attribTextSearch[0][0].value="";
        this.attribFilter.addFilter(true);
    },
    /** -- */
    text_item_Attrib: function(){
        if(this.isLinked){
            return "<b>"+this.attribCount_Included+"</b>";
        }
        // go over all items and prepare the list
        var selectedItemsText="";
        var selectedItemsCount=0;
        var catLabelText = this.options.catLabelText;
        var catTooltipText = this.options.catTooltipText;
        this.getAttribs().forEach( function(attrib){
            if(!attrib.f_selected()) return; 
            if(selectedItemsCount!==0) {
                if(this.attribFilter.selectType==="SelectAnd" || attrib.f_removed()){
                    selectedItemsText+=" and "; 
                } else{
                    selectedItemsText+=" or "; 
                }
            }
            var labelText = catLabelText(attrib);
            if(attrib.f_removed()) labelText = "not " + labelText;
            var titleText = labelText;
            if(catTooltipText) titleText = catTooltipText(attrib);

            selectedItemsText+="<b>"+labelText+"</b>";
            selectedItemsCount++;
        },this);
        return selectedItemsText;
    },
    /** - */
    insertAttribs: function(){
    	var me = this;
        var kshf_ = this.browser;

        var onFilterAttrib = function(attrib){
            if(attrib.facetDOM.tipsy_active)
                attrib.facetDOM.tipsy_active.hide();

            me.filterAttrib(attrib);
            // get label
            var attribLabel = me.options.catLabelText(attrib);

            if (this.timer) {
                // double click
                clearTimeout(this.timer);
                this.timer = null;
                me.unselectAllAttribs();
                me.filterAttrib(attrib);
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.CatValueExact,
                    kshf_.getFilteringState(me.options.facetTitle,attribLabel));
                return;
            } else if(sendLog){
                if(sendLog) sendLog(CATID.FacetFilter,(attrib.selected)?ACTID_FILTER.CatValueAdd:ACTID_FILTER.CatValueRemove,
                    kshf_.getFilteringState(me.options.facetTitle,attribLabel));
            }
            var x = this;
            this.timer = setTimeout(function() { x.timer = null; }, 500);
        };

        var onMouseOver = function(attrib,i){
            if(!me.isAttribSelectable(attrib)) return;
            attrib.facetDOM.setAttribute("highlight",true);
            
            me.browser.items.forEach(function(item){ item.highlightDone = false; })
            attrib.items.forEach(function(item){ item.highlightDone = false; })

            attrib.items.forEach(function(item){
                if(item.wanted) item.highlightAdvanced(me.parentFacet);
            });
            // this part highlights subfacet categories...
            attrib.mappedDOMs.forEach(function(d){ d.setAttribute("highlight",true); });

            me.browser.refreshWidth_Bars_Highlight();
            
            attrib.facetDOM.tipsy_active = attrib.facetDOM.tipsy;
            if(!attrib.f_selected() & me.attribCount_Included>1 && me.attribFilter.selectType==="SelectOr"
                && me.hasMultiValueItem){
                // prevent "...and" and show "...or" instead
                attrib.facetDOM.tipsy_active = d3.select(attrib.facetDOM).select(".filter_add_more .add")[0][0].tipsy;
            }
            // calculate the offset...
            var sadsds = me.catBarAxisScale(attrib.activeItems);
            sadsds = me.catBarAxisScale.range()[1] - sadsds;
            if(me.type==="scatterplot") sadsds += me.timeRange.width + me.browser.scrollWidth;
            attrib.facetDOM.tipsy_active.options.offset_x = (me.browser.hideBars)?0:-sadsds;
            attrib.facetDOM.tipsy_active.show()
        };
        var onMouseOut = function(attrib,i){
            if(attrib.skipMouseOut !==undefined && attrib.skipMouseOut===true){
                attrib.skipMouseOut = false;
                return;
            }
            if(!me.isAttribSelectable(attrib)) return;
            attrib.facetDOM.setAttribute("highlight",false);

            me.browser.items.forEach(function(item){ item.highlightDone = false; })
            attrib.items.forEach(function(item){ item.highlightDone = false; })

            attrib.items.forEach(function(item){
                if(item.wanted) item.nohighlightAdvanced(me.parentFacet);
            });
            attrib.mappedDOMs.forEach(function(d){ d.setAttribute("highlight",false); });

            me.browser.refreshWidth_Bars_Highlight();

            if(attrib.facetDOM.tipsy_active) attrib.facetDOM.tipsy_active.hide();
        };

    	this.dom.attribs
            .attr("highlight","false")
            .attr("selected","0")
            .each(function(attrib,i){
                var transform="translateY(0px)";
                this.style.webkitTransform = transform;
                this.style.MozTransform = transform;
                this.style.msTransform = transform;
                this.style.OTransform = transform;
                this.style.transform = transform;
            })
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: 'w',
                    offset_x: 2,
                    offset_y: -1,
                    fade: true,
                    title: function(){
                        var attrib=this.__data__;
                        var attribName=me.options.facetTitle;
                        var hasMultiValueItem=attrib.barChart.hasMultiValueItem;
                        if(attrib.f_included() || attrib.f_removed())
                            return "<span class='fa fa-minus'></span> <span class='action'>Remove</span> from filter";
                        if(attrib.barChart.attribCount_Included===0)
                            return "<span class='fa fa-plus'></span> <span class='action'>Add</span> <i> filter";
                        if(hasMultiValueItem===false)
                            return "<span class='big'>&laquo;</span> <span class='action'>Change</span> filter";
                        else
                            return "<span class='fa fa-plus'></span> <span class='action'>Add</span> <i>"+
                                attribName+"</i> (<b> ... and </b>)";
                    }
                });
            })
            ;
        
        this.dom.attribs.append("span").attr("class", "clickArea")
            .style("width",(kshf_.getRowTotalTextWidth()-20)+"px") // 20 is margin-left
            .on("click", onFilterAttrib)
            .on("mouseover",onMouseOver)
            .on("mouseout",onMouseOut)
            ;

    	this.dom.attrLabel = this.dom.attribs.append("span").attr("class", "attribLabel hasLabelWidth");

        this.dom.add_more = this.dom.attrLabel.append("span").attr("class", "filter_add_more");
            this.dom.add_more.append("span").attr("class","add").text("⊕")
                .each(function(){
                    this.tipsy = new Tipsy(this, {
                        gravity: 'sw',
                        offset_y: 6,
                        // offset_x: 0, // computed when item is to be shown
                        fade: true,
                        title: function(){
                            var attrib = this.__data__;
                            return "<span class='big'>+</span> <span class='action'>Add</span> <i>"+
                                    me.options.facetTitle+"</i> (<b> ... or </b>)";
                        }
                    });
                })
                .on("mouseover",function(attrib,i){
                    this.tipsy.show();
                    this.parentNode.parentNode.parentNode.setAttribute("highlight",true);
                    d3.event.stopPropagation();
                })
                .on("mouseout",function(attrib,i){
                    this.tipsy.hide();
                    this.parentNode.parentNode.parentNode.setAttribute("highlight",false);
                    d3.event.stopPropagation();
                })
                .on("click",function(attrib,i){
                    me.filterAttrib(attrib,true);
                    this.tipsy.hide();
                    d3.event.stopPropagation();
                });

            this.dom.add_more.append("span").attr("class","remove").text("⊖")
                .each(function(){
                    this.tipsy = new Tipsy(this, {
                        gravity: 'sw',
                        offset_y: 5,
                        offset_x: 1,
                        fade: true,
                        title: function(){
                            var attrib = this.__data__;
                            return "<span class='big'>+</span> <span class='action'>Remove</span> <i>"+
                                me.options.facetTitle+"</i>";
                        }
                    });
                })
                .on("mouseover",function(attrib,i){
                    this.tipsy.show();
                    this.parentNode.parentNode.parentNode.setAttribute("highlight",true);
                    d3.event.stopPropagation();
                })
                .on("mouseout",function(attrib,i){
                    this.tipsy.hide();
                    this.parentNode.parentNode.parentNode.setAttribute("highlight",false);
                    d3.event.stopPropagation();
                })
                .on("click",function(attrib,i){
                    me.removeAttrib(attrib);
                    this.tipsy.hide();
                    d3.event.stopPropagation();
                });
        this.dom.attrLabel.append("span").attr("class","theLabel").html(this.options.catLabelText);

        this.dom.item_count_wrapper = this.dom.attribs.append("span").attr("class", "item_count_wrapper")
            .style("width",(this.browser.getRowLabelOffset())+"px") // 3 is padding
        ;
        this.dom.item_count = this.dom.item_count_wrapper.append("span").attr("class", "item_count");
        this.dom.barGroup = this.dom.attribs.append("span").attr("class","barGroup");
    	this.dom.bar_active = this.dom.barGroup.append("span")
    		.attr("class", function(d,i){ 
    			return "bar active "+(me.options.barClassFunc?me.options.barClassFunc(d,i):"");
    		})
            .on("click", onFilterAttrib)
            .on("mouseover",onMouseOver)
            .on("mouseout",onMouseOut)
            ;
    	this.dom.bar_total = this.dom.barGroup.append("span")
    		.attr("class", function(d,i){ 
    			return "bar total "+(me.options.barClassFunc?me.options.barClassFunc(d,i):"");
    		});
        this.dom.bar_highlight = this.dom.barGroup.append("span")
            .attr("class", "bar hover").attr("fast",true);
        this.dom.allRowBars = this.dom.attribs.selectAll('span.bar');

        if(this.type==="scatterplot"){
            // Create helper line
            this.dom.row_bar_line = this.dom.barGroup.insert("span",":first-child").attr("class", "row_bar_line");
        }

        this.refreshLabelWidth();

        this.updateSorting();
    },

    /** -- */
    sortAttribs: function(){
        var me = this;
        if(this.sortingOpt_Active===undefined){
            this.sortingOpt_Active = this.sortingOpts[0];
        }
        var selectedOnTop = this.sortingOpt_Active.no_resort!==true;
        var inverse = this.sortingOpt_Active.inverse;
        var sortFunc = this.sortingOpt_Active.func;

        var idCompareFunc = function(a,b){return b-a;};
        if(typeof(this.getAttribs()[0].id())==="string") 
            idCompareFunc = function(a,b){return b.localeCompare(a);};

        var theSortFunc = function(a,b){
            // linked items...
            if(a.asdasdasd && !b.asdasdasd) return -1;
            if(b.asdasdasd && !a.asdasdasd) return 1;

            if(selectedOnTop){
                if(!a.f_selected() &&  b.f_selected()) return  1;
                if( a.f_selected() && !b.f_selected()) return -1;
            }
            // put the items with zero active items to the end of list (may not be displayed / inactive)
            if(a.activeItems===0 && b.activeItems!==0) return  1;
            if(b.activeItems===0 && a.activeItems!==0) return -1;

            if(!a.wanted && b.wanted) return  1;
            if( a.wanted &&!b.wanted) return -1;

            var x=sortFunc(a,b);
            if(x===0) x=idCompareFunc(a.id(),b.id());
            if(inverse) x=-x;
            return x;
        };
        this.getAttribs().sort(theSortFunc);
        this.getAttribs().forEach(function(attrib,i){
            attrib.orderIndex=i;
        });
    },
    /** -- */
    updateSorting: function(sortDelay){
        if(this.options.removeInactiveAttrib){
            this.updateAttribCount_Active();
        }
        this.refreshScrollDisplayMore(this.attribCount_InDisplay);
        this.updateSorting_do(sortDelay);
    },
    /** -- */
    updateSorting_do: function(sortDelay){
        var line_height = this.browser.line_height;
        var me = this;
        if(sortDelay===undefined) sortDelay = 1000;
        this.sortAttribs();

        setTimeout(function(){
            me.dom.attribs
                .each(function(attrib){
                    var isVisible = me.isAttribVisible(attrib);
                    this.style.display = isVisible?"block":"none";

                    if(!isVisible) return;

                    var i = attrib.orderIndex;
                    var transform="translateY("+(line_height*i)+"px)";

                    this.style.webkitTransform = transform;
                    this.style.MozTransform = transform;
                    this.style.msTransform = transform;
                    this.style.OTransform = transform;
                    this.style.transform = transform;

    //                var transition = "all 700ms ease-in-out "+Math.min(sortDelay+i*20,700)+"ms";
    //                this.style.setProperty("-webkit-transition", transition);
    //                this.style.setProperty("-moz-transition", transition);
    //                this.style.setProperty("-o-transition", transition);
    //                this.style.setProperty("transition", transition);
                });
        },sortDelay);
 
        var attribGroupScroll = me.dom.attribGroup[0][0];
        // always scrolls to top row automatically when re-sorted
        if(this.scrollTop_cache!==0)
            kshf.Util.scrollToPos_do(attribGroupScroll,0);
        if(me.type==="scatterplot"){
            me.refreshBarLineColor();
            setTimeout(function(){
                me.dom.middleScrollbar.select(".filler").style("height",attribGroupScroll.scrollHeight+"px");
            },1500);
            me.dom.middleScrollbar[0][0].scrollTop = attribGroupScroll.scrollTop;
        }
//      me.divRoot.attr("canResort",false);
    },
    getTicksSkip: function(){
        var ticksSkip = this.browser.barChartWidth/25;
        if(this.getMaxBarValuePerAttrib()>100000){
            ticksSkip = this.browser.barChartWidth/30;
        }
        return ticksSkip;
    },
    /** -- */
    refresh_Bars_Ticks: function(){
        var me=this;

        var visibleRowHeight = this.attribHeight;
        var tickValues = this.catBarAxisScale.ticks(this.getTicksSkip());

        // remove non-integer values!
        tickValues = tickValues.filter(function(d){return d % 1 === 0;});

        var tickData = this.dom.attribChartAxis.selectAll("span.tick")
            .data(tickValues,function(i){ return i; });

        var noanim=this.browser.root.attr("noanim");

        if(noanim!=="true") this.browser.root.attr("noanim",true);
        var transformFunc=function(d){
            var x=me.catBarAxisScale(d);
//            if(me.layoutStr==="left") x = -x;
            var transform="translateX("+x+"px)";
            this.style.webkitTransform = transform;
            this.style.MozTransform = transform;
            this.style.msTransform = transform;
            this.style.OTransform = transform;
            this.style.transform = transform;
        };

        var tickData_new=tickData.enter().append("span").attr("class","tick")
            .each(transformFunc);
        if(noanim!=="true") this.browser.root.attr("noanim",false);

        tickData_new.append("span").attr("class","line")
            .style("top","-"+visibleRowHeight+"px")
            .style("height",visibleRowHeight+"px");
        tickData_new.append("span").attr("class","text").text(function(d){return d3.format("s")(d);});

        // translate the ticks horizontally on scale.
        setTimeout(function(){
            me.dom.attribChartAxis.selectAll("span.tick").style("opacity",1).each(transformFunc);
        });

        tickData.exit().remove();
    },


    /** TIMELINE RELATED STUFF *******************************************************
     *                                                                               *
     *********************************************************************************/

    /** -- */
    insertRightHeader: function(){
        var me=this;
        this.divRoot.attr("collapsedTime",this.collapsedTime===false?"false":"true")

        this.dom.rightHeader = this.dom.headerGroup.append("span").attr("class","rightHeader");

        var firstLine = this.dom.rightHeader.append("div").attr("class","chartFirstLineBackground chartFirstLineBackgroundRight");
            firstLine.append("span").attr("class","header_label_arrow")
                .attr("title","Show/Hide categories").text("▼")
                .on("click",function(){ me.collapseTime(!me.collapsedTime); })
                ;
            firstLine.append("span")
                .attr("class", "header_label")
                .html(this.options.timeTitle)
                .on("click",function(){ if(me.collapsedTime) { me.collapseTime(false); } })
                ;
            firstLine.append("div")
                .attr("class","chartClearFilterButton timeFilter alone")
                .attr("title","Remove filter")
                .on("click", function(d,i){ 
                    me.timeFilter.clearFilter(true);
                    if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnFacet, 
                        {facet:me.options.timeTitle,results:me.browser.itemsSelectedCt});
                })
                .text('x');

        this.dom.rightHeader.append("div").attr("class","border_line");
    },
    /** -- */
    collapseTime: function(hide){
        this.collapsedTime = hide;
        this.browser.updateLayout_Height();
        this.divRoot.attr("collapsedTime",this.collapsedTime===false?"false":"true");
        this.refreshWidth();
    },
    /** -- */
    isFiltered_Time: function(){
        if(this.type!=="scatterplot") return false;
        return this.timeFilter.active.min!==this.timeRange.min ||
               this.timeFilter.active.max!==this.timeRange.max ;
    },
    resetTimeFilterActive: function(){
        this.timeFilter.active = { 
            min: this.timeRange.min,
            max: this.timeRange.max
        };
    },
    /** -- */
    resetTimeZoom_ms: function(){
        this.timeZoom_ms = { min: this.timeRange.min, max:this.timeRange.max };
    },
    /** -- */
    updateTimeWidth: function(){
        var kshf_ = this.browser;
        this.timeRange.width = kshf_.divWidth-kshf_.getWidth_LeftPanel()-2*kshf_.sepWidth-20;

        this.refreshTimechartLayout(true);
        this.updateRowBarLineWidth();

        this.dom.timeChartAxis.style("width",this.timeRange.width+"px");
        this.dom.timeLineParts.style("width",this.timeRange.width+"px")
    },
    /** Applies alternating color for bar helper lines */
    refreshBarLineColor: function(){
        this.dom.row_bar_line.style("border-top-color", function(attrib,i) {
            return (attrib.orderIndex%2===1)?"gray":"lightgray";
        });
    },
    /** -- */
    updateRowBarLineWidth: function(){
        var kshf_ = this.browser;
        this.dom.row_bar_line.style("width",
            (kshf_.barChartWidth+kshf_.scrollWidth+this.timeRange.width+kshf_.sepWidth)+"px");
    },
    /** -- */
    updateAttrib_TimeMinMax: function(){
        var timeFilterId = this.timeFilter.id;
        var specFunc = function(item){
            if(!item.wanted) return undefined; // unwanted items have no time position
            return item.mappedData[timeFilterId];
        };
        this.getAttribs().forEach(function(row){
            if(row.sortDirty===false) return;
            row.xMin_Dyn = d3.min(row.items, specFunc);
            row.xMax_Dyn = d3.max(row.items, specFunc);
        });
    },
    /** -- */
    refreshTimechartLayout: function(toUpdate){
        this.setTimeTicks();
        this.updateTimeChartBarsDots();
        this.refreshTimeChartBarDisplay();
        this.insertTimeTicks();
        this.insertTimeChartAxis();
        if(toUpdate===true) this.refreshTimeChartDotConfig();
    },
    /** -- */
    refreshTimeChartDotConfig: function(){
        if(this.type!=='scatterplot') return;
        if(this.options.timeDotConfig !== undefined) return;
        if(this.skipUpdateTimeChartDotConfig === true) return;
        var me = this;

        var totalActiveTime_pixLength = 0;

        this.dom.attribs.each(function(attrib) {
            if(me.isFiltered() && !attrib.f_selected()) return;
            if(attrib.xMax_Dyn===undefined || attrib.xMin_Dyn===undefined) return;
            totalActiveTime_pixLength+=me.timeScale(attrib.xMax_Dyn) - me.timeScale(attrib.xMin_Dyn);
        });

        var timeFilterDiff = this.timeFilter.active.max-this.timeFilter.active.min;
        var timeZoomDiff = this.timeZoom_ms.max-this.timeZoom_ms.min;

        // how much width of time does each dot take?
        var dotPixelWidth = 12;
        var maxDots = totalActiveTime_pixLength/dotPixelWidth;
        
        var numOfItems = this.browser.itemsSelectedCt;

        if(maxDots>numOfItems*3 || totalActiveTime_pixLength===0){
            this.dom.timeDots.attr("fill","default");
        } else {
            this.dom.timeDots.attr("fill","gradient100");
            if(maxDots>numOfItems*1.5){
                this.dom.timeDots.attr("fill","gradient100");
            } else if(maxDots>numOfItems*0.8){
                this.dom.timeDots.attr("fill","gradient75");
            } else if(maxDots>numOfItems*0.3){
                this.dom.timeDots.attr("fill","gradient50");
            } else {
                this.dom.timeDots.attr("fill","gradient25");
            }
        }
    },
    /** -- */
    refreshTimeChartBarDisplay: function(){
        // key dots are something else
        var me = this;
        var kshf_ = this.browser;
        var r;
        var rows = this.getAttribs();
        var timeFilterId = this.timeFilter.id;
        
        var timeChartSortFunc = function(a,b){
            if(a.f_selected()&&!b.f_selected()) { return  1; }
            if(b.f_selected()&&!a.f_selected()) { return -1; }
            // use left-to-right sorting
            var posA = a.mappedData[timeFilterId];
            var posB = b.mappedData[timeFilterId];
            if(posA===null || posB===null) { return 0; }
            return posA.getTime()-posB.getTime();
        };
        
        rows.forEach(function(attrib){
            if(!attrib.sortDirty || this.type!=="scatterplot") return;
            attrib.items.sort(timeChartSortFunc);
            this.dom.attribs.selectAll(".timeDot")
                .data(function(attrib) { return attrib.items; }, function(attrib){ return attrib.id(); })
                // calling order will make sure selected ones appear on top of unselected ones.
                .order()
                ;
            // TODO: call order only on this row
            // re-calculate min-max only on this row
            // etc...
        },this);

        // update min-max time extents
        this.updateAttrib_TimeMinMax();
        if(this.dom.timeBarActive){
            this.dom.timeBarActive
                .each(function(d){
                    var transform="translateX("+me.timeScale(d.xMin_Dyn)+"px)";
                    this.style.webkitTransform = transform;
                    this.style.MozTransform = transform;
                    this.style.msTransform = transform;
                    this.style.OTransform = transform;
                    this.style.transform = transform;
                })
                .style("width", function (d) { 
                    if(d.xMin_Dyn===undefined){ return "0px"; }
                    return (me.timeScale(d.xMax_Dyn) - me.timeScale(d.xMin_Dyn))+"px";
                })
                ;
        }
        rows.forEach(function(row){row.sortDirty=false;});
    },
    /** -- */
    insertTimeChartRows: function(){
    	var me = this;
        var kshf_ = this.browser;

        this.dom.attribs.append("span").attr("class","scrollbarFiller").style("width",this.browser.scrollWidth+"px")

        this.dom.timeLineParts = this.dom.attribs.append("span").attr("class","timeLineParts_Overflow")
            .append("span").attr("class","timeLineParts");
        if(this.options.timeBarShow===true){
            this.dom.timeLineParts.append("span").attr("class","bar total" );
            this.dom.timeLineParts.append("span").attr("class","bar active");
        }
    	// Create bar dots
    	this.dom.timeLineParts.selectAll("span.timeDot")
    		.data(function(attrib){ return attrib.items; }, 
                  function(item){ return item.id(); })
    		.enter().append("span")
    		.attr("class", function(item) {
                if(me.options.dotClassFunc){ return "timeDot " + me.options.dotClassFunc(item); }
                return "timeDot";
            })
            .attr("highlight","false")
            .each(function(item){ 
                item.mappedDOMs.push(this);
                item.mappedDotDOMs.push(this);
            })
            .on("mouseover",function(item,i,f){
                item.highlightAll();
                // update the position of selectVertLine
                me.dom.selectVertLine
                    .style("left",( me.getWidth_Left()+me.timeScale(me.options.timeItemMap(item))+7)+"px")
                    .style("display","block");
                d3.event.stopPropagation();
            })
            .on("mouseout",function(item,i){
                item.nohighlightAll();
                me.dom.selectVertLine.style("display","none");
                d3.event.stopPropagation();
            })
    		.on("click", function(item,i,f) {
                var itemDate = item.mappedData[me.timeFilter.id];
                var rangeMin = new Date(itemDate);
                var rangeMax = new Date(itemDate);

                if(me.timeticks.range === d3.time.months){
                    rangeMin.setDate(rangeMin.getDate()-15);
                    rangeMax = new Date(rangeMin);
                    rangeMax.setMonth(rangeMin.getMonth()+1);
                }
                if(me.timeticks.range === d3.time.years){
                    // if zoomed years range is wide, use 5-year step size
                    var diff_Year =  new Date(me.timeZoom_ms.max).getFullYear() - new Date(me.timeZoom_ms.min).getFullYear();
                    if(me.options.timeMaxWidth<diff_Year*10){
                        rangeMin.setFullYear(rangeMin.getFullYear()-5);
                        rangeMax.setFullYear(rangeMax.getFullYear()+5);
                    } else {
                        rangeMin.setMonth(rangeMin.getMonth()-6);
                        rangeMax = new Date(rangeMin);
                        rangeMax.setMonth(rangeMin.getMonth()+12);
                    }
                }
                if(me.timeticks.range === d3.time.days){
                    rangeMin.setDate(rangeMin.getDate()-1);
                    rangeMax.setDate(rangeMin.getDate()+1);
                }

                me.timeFilter.active.min = Date.parse(rangeMin);
                me.timeFilter.active.max = Date.parse(rangeMax);
                me.checkTimeFilterLimits();

                if(me.isFiltered_Time()){
                    me.timeFilter.addFilter(false);
                } else {
                    me.timeFilter.clearFilter(false);
                }
                // kshf_.update is done by attribute filtering called below.

                // filter for selected attribute
                me.unselectAllAttribs();
                me.filterAttrib( d3.select(this.parentNode.parentNode).datum() );

                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.TimeDot,kshf_.getFilteringState());

                d3.event.stopPropagation();
    		})
            ;
        this.dom.timeBarActive = this.dom.timeLineParts.selectAll("span.bar.active");
        this.dom.timeBarTotal  = this.dom.timeLineParts.selectAll("span.bar.total");
        this.dom.timeDots      = this.dom.timeLineParts.selectAll('span.timeDot');
    },
    /** -- */
    setTimeTicks: function(){
        this.timeticks = {};

        // http://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript/15289883#15289883
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        var _MS_PER_MONTH = _MS_PER_DAY * 30.4; // assuming 30.4 days per month - 365/12
        var _MS_PER_YEAR = _MS_PER_DAY * 365;

        var timeZoom_msDiff;
        if(this.timeZoom_ms!==undefined) {
            timeZoom_msDiff= this.timeZoom_ms.max - this.timeZoom_ms.min;
        } else {
            timeZoom_msDiff = this.timeData_dt.max.getTime() - this.timeData_dt.min.getTime();
        }

        var diff_Day = Math.floor(timeZoom_msDiff / _MS_PER_DAY);
        var diff_Month =  Math.floor(timeZoom_msDiff / _MS_PER_MONTH );
        var diff_Year= Math.floor(timeZoom_msDiff / _MS_PER_YEAR );

        // this.timeRange.width is the current timeline width
        var timeWidthSteps = this.timeRange.width/70;

        // choose range
        if(timeWidthSteps<=diff_Year){
            // YEAR
            this.timeticks.range = d3.time.years;
            this.timeticks.format = d3.time.format.utc("%Y");
            this.timeticks.stepSize = Math.ceil(diff_Year/(this.timeRange.width/30));
        } else if(timeWidthSteps<=diff_Month){
            // MONTH
            this.timeticks.range = d3.time.months;
            this.timeticks.format = d3.time.format.utc("%b '%y");
            this.timeticks.stepSize = Math.ceil(diff_Month/(this.timeRange.width/60));
            // must be 1/2/3/4/6/12
            if(this.timeticks.stepSize>12) { this.timeticks.stepSize = 12;}
            else if(this.timeticks.stepSize>6){ this.timeticks.stepSize = 6;}
            else if(this.timeticks.stepSize>4) {this.timeticks.stepSize = 4;}
        } else if(true){
            // DAY
            this.timeticks.range = d3.time.days;
            this.timeticks.format = d3.time.format.utc("%e %b"); // 17Feb
            this.timeticks.stepSize = Math.ceil(diff_Day/timeWidthSteps/2);
            // 16/11/8/7/5.5/5
            if(this.timeticks.stepSize>16) { this.timeticks.stepSize = 32;}
            else if(this.timeticks.stepSize>10){ this.timeticks.stepSize = 15;}
            else if(this.timeticks.stepSize>5) {this.timeticks.stepSize = 10;}
            this.timeticks.stepSize++;
        }

        if(this.useCurrentTimeMinMax===undefined){
            var tempDate;
            if(this.timeticks.range===d3.time.years){
                this.timeRange.min = Date.UTC(this.timeData_dt.min.getUTCFullYear(),0,1);
                this.timeRange.max = Date.UTC(this.timeData_dt.max.getUTCFullYear()+1,0,1);
            } else if(this.timeticks.range===d3.time.months){
                this.timeRange.min = Date.UTC(this.timeData_dt.min.getUTCFullYear(),this.timeData_dt.min.getUTCMonth(),1);
                this.timeRange.max = Date.UTC(this.timeData_dt.max.getUTCFullYear(),this.timeData_dt.max.getUTCMonth()+1,1);
            } else if(this.timeticks.range===d3.time.days){
                this.timeRange.min = Date.UTC(this.timeData_dt.min.getUTCFullYear(),this.timeData_dt.min.getUTCMonth(),this.timeData_dt.min.getUTCDate()-1);
                this.timeRange.max = Date.UTC(this.timeData_dt.max.getUTCFullYear(),this.timeData_dt.max.getUTCMonth(),this.timeData_dt.max.getUTCDate()+1);
            }

            this.resetTimeZoom_ms();
            this.resetTimeFilterActive();
        }
        // update the time scale with the new date domain
        this.updateTimeScale();
    },
    /** -- */
    updateTimeScale: function(){
        this.timeScale = d3.time.scale.utc()
            .domain([new Date(this.timeZoom_ms.min), new Date(this.timeZoom_ms.max)])
            .rangeRound([0, this.timeRange.width])
            ;
    },
    /** -- */
    insertTimeTicks: function(){
        var me=this;

        var timeTicks = this.timeScale.ticks(this.timeticks.range, this.timeticks.stepSize);

        var ddd = this.dom.timeLabelGroup.selectAll("span.tick").data(timeTicks);

        var ddd_enter = ddd.enter().append("span").attr("class","tick");
        ddd.exit().remove();

        ddd_enter.append("span").attr("class","line");
        ddd_enter.append("span").attr("class","text");

        this.dom.labelTicks = this.dom.timeLabelGroup.selectAll("span.tick");

        this.dom.labelTicks.selectAll("span.text").text(function(d){return me.timeticks.format(d);});
        this.dom.labelTicks.style("left",function(d){ return (me.timeScale(d))+"px"; })

        this.insertTimeTicks_timeValues = [];

        this.dom.timeLabelGroup.selectAll(".text")
            .each(function(d,i){
                me.insertTimeTicks_timeValues.push(d);
            })
            .on("click",function(d,i){
                var curTime  = me.insertTimeTicks_timeValues[i];
                var nextTime = me.insertTimeTicks_timeValues[i+1];
                if(nextTime === undefined){
                    nextTime = me.timeRange.max;
                }
                me.timeFilter.active = {min: curTime, max: nextTime};
                me.checkTimeFilterLimits();
                if(me.isFiltered_Time()){
                    me.timeFilter.addFilter(false);
                } else {
                    me.timeFilter.clearFilter(false);
                }
            })
            ;
    },
    /** -- */
    refreshTimeAxisHeight: function(){
        var kshf_ = this.browser;
        
        this.dom.selectVertLine.style("height", this.attribHeight+"px");
        this.dom.middleScrollbar.style("height",this.attribHeight+"px");
        this.dom.timeChartAxis.selectAll("span.invalidArea")
            .style("margin-top",(-this.attribHeight)+"px")
            .style("height",this.attribHeight+"px")
    },
	/** -- */
    insertTimeChartAxis: function(){
        this.refreshTimeChart();
    },
    /** -- */
    updateTimeChartBarsDots: function(){
        var kshf_ = this.browser;
        var totalLeftWidth = kshf_.getWidth_LeftPanel()+kshf_.sepWidth;
    	var me = this;
        var timeFilterId = this.timeFilter.id;
        this.dom.timeBarTotal
            .each(function(d){
                var transform="translateX("+me.timeScale(d.xMin)+"px)";
                this.style.webkitTransform = transform;
                this.style.MozTransform = transform;
                this.style.msTransform = transform;
                this.style.OTransform = transform;
                this.style.transform = transform;
            })
            .style("width", function(d){ return (me.timeScale(d.xMax) - me.timeScale(d.xMin))+"px"; })
            ;
    	this.dom.timeDots
            .each(function(item){
                var transform="translateX("+(me.timeScale(item.mappedData[timeFilterId])-5)+"px)";
                this.style.webkitTransform = transform;
                this.style.MozTransform = transform;
                this.style.msTransform = transform;
                this.style.OTransform = transform;
                this.style.transform = transform;
            });
    },
    /** -- */
    getFilterMinDateText: function(){
        var dt = new Date(this.timeFilter.active.min);
        return this.timeticks.format(dt);
    },
    /** -- */
    getFilterMaxDateText: function(){
        var dt = new Date(this.timeFilter.active.max);
        return this.timeticks.format(dt);
    },
    refreshTimeSlider: function(){
        var me=this;
        var _min = this.timeScale(this.timeFilter.active.min);
        var _max = this.timeScale(this.timeFilter.active.max);
        this.dom.timeSlider.select(".base.total")
            .style("width",this.timeScale.range()[1]+"px");
        this.dom.timeSlider.select(".base.active")
            .attr("filtered",this.isFiltered_Time())
            .each(function(d){
                var transform="translate("+_min+"px,0) scale("+(_max-_min)+",1)";
                this.style.webkitTransform = transform;
                this.style.MozTransform = transform;
                this.style.msTransform = transform;
                this.style.OTransform = transform;
                this.style.transform = transform;
            })
            ;
        this.dom.timeSlider.selectAll(".handle")
            .style("left",function(d){
                if(d==="min") return (_min-7)+"px";
                return _max+"px";
            }).selectAll("span")
                .style("margin-left",function(d){
                    if(d==="min") return (-(_min-4))+"px";
                    return "-1px";
                })
                .style("width",function(d){
                    if(d==="min") return _min+"px";
                    return ((me.timeScale.range()[1])-_max)+"px";
                })
                ;
    },
    refreshTimeChart: function(){
            var minX = this.timeScale(this.timeFilter.active.min);
            var maxX = this.timeScale(this.timeFilter.active.max);

            if(this.timeRange.width-minX>190){
                this.divRoot.select(".config_zoom").style("float","left")
                    .style("margin-left",(minX+this.browser.sepWidth)+"px");
            } else{
                this.divRoot.select(".config_zoom").style("float","right");
            }

            this.refreshTimeSlider();

            this.divRoot.select(".zoom_in").attr("disabled",this.isFiltered_Time()?"false":"true");
    },
    checkTimeFilterLimits: function(){
        // make sure filtered range do not exceed current zoom range
        this.timeFilter.active.min = Math.max(this.timeFilter.active.min,this.timeZoom_ms.min);
        this.timeFilter.active.max = Math.min(this.timeFilter.active.max,this.timeZoom_ms.max);

        if(this.timeFilter.active.min>this.timeFilter.active.max){
            var tmp = this.timeFilter.active.min;
            this.timeFilter.active = {
                min: this.timeFilter.active.max,
                max: tmp};
        }
    }
};























/**
 * KESHIF FACET - Categorical
 * @constructor
 */
kshf.Facet_Interval = function(kshf_, options){
    // Call the parent's constructor
    var me = this;
    this.id = ++kshf.num_of_charts;
    this.browser = kshf_;
    this.filteredItems = options.items;

    this.options = options;
    this.layoutStr = options.layout;
    this.parentFacet = options.parentFacet;

    this.height_slider = 10;
    this.height_labels = 16;
    this.height_hist_min = 50;
    this.height_hist_max = 100;
    this.height_bin_top = 14; // space for text...

    this.barGap = 2;
    this.histogramMargin = 12;

    this.dom = {};
    this.type='interval';

    // COLLAPSED
    this.collapsed = false;
    if(options.collapsed===true) this.collapsed = true;

    if(this.options.intervalScale===undefined)
        this.options.intervalScale='linear';

    this.barScale = d3.scale.linear();

    this.intervalFilter = kshf_.createFilter({
        name: this.options.facetTitle,
        browser: this.browser,
        filteredItems: this.filteredItems,
        cb_this: this,
        onClear: function(){
            this.divRoot.attr("filtered",false);
            this.resetIntervalFilterActive();
            this.refreshIntervalSlider();
        },
        onFilter: function(filter, recursive){
            this.divRoot.attr("filtered",true);
            var i_min = filter.active.min;
            var i_max = filter.active.max;
            if(!filter.max_inclusive) i_max-=0.01;

            filter.filteredItems.forEach(function(item){
                var v = item.mappedData[filter.id].v;
                if(v===null)
                    item.setFilter(filter.id, false);
                else
                    item.setFilter(filter.id, (v>=i_min) && (v<=i_max) );
                item.updateSelected(recursive);
            },this);

            console.log(filter.active);

            // update handles
            this.refreshIntervalSlider();
        },
        text_header: this.options.facetTitle,
        text_item: function(filter){
            return "between <b>"+filter.active.min+"</b> to <b>"+filter.active.max+"</b>";
        },
    });

    var filterId = this.intervalFilter.id;
    this.hasFloat = false;
    this.filteredItems.forEach(function(item){
        var v=this.options.catItemMap(item);
        // if not a number, skip
        if(v!==null){
            if(typeof v!=='number'){
                v = null;
            } else{
                if(!this.hasFloat) this.hasFloat = this.hasFloat || v%1!==0;
            }
        }
        item.mappedData[filterId] = { 
            'v': v,
            'h': this,
        };
    },this);
    // remove itms that map to null
    this.filteredItems = this.filteredItems.filter(function(d){
        return d.mappedData[filterId].v!==null;
    })

    var accessor = function(item){ return item.mappedData[filterId].v; };
    this.intervalRange = {
        min: d3.min(this.filteredItems,accessor),
        max: d3.max(this.filteredItems,accessor)
    };

    this.hist_height=65;

    if(this.intervalRange.min===undefined){
        this.isEmpty = true;
        return;
    } else {
        this.isEmpty = false;
    }

    this.resetIntervalFilterActive();
};

kshf.Facet_Interval.prototype = {
    /** -- */
    getWidth: function(){
        return this.browser.getWidth_LeftPanel() - this.getWidth_Offset();
    },
    getWidth_Offset: function(){
        var offset=0;
        if(this.parentFacet){
            offset+=17;
        }
        return offset;
    },
    getHeight_Header: function(){
        if(this._height_header==undefined) {
            this._height_header = this.dom.headerGroup[0][0].offsetHeight;
        }
        return this._height_header;
    },
    getHeight_Total: function(){
        if(this.collapsed) return this.getHeight_Header();
        return this.getHeight_Header()+this.hist_height+this.height_bin_top+this.height_labels+this.height_slider;
    },
    /** -- */
    getFilteredCount: function(){
        return this.isFiltered();
    },
    /** -- */
    isFiltered: function(state){
        return this.intervalFilter.active.min!==this.intervalRange.min ||
               this.intervalFilter.active.max!==this.intervalRange.max ;
    },
    /** -- */
    getHeight_RangeMax: function(){
        return this.getHeight_Header()+this.height_hist_max+this.height_bin_top+this.height_labels+this.height_slider;
    },
    /** -- */
    getHeight_RangeMin: function(){
        return this.getHeight_Header()+this.height_hist_min+this.height_bin_top+this.height_labels+this.height_slider;
    },
    resetIntervalFilterActive: function(){
        this.intervalFilter.active = {
            min: this.intervalRange.min,
            max: this.intervalRange.max
        };
    },
    getMaxBinTotalItems: function(){
        return d3.max(this.histBins,function(bin){ return bin.length; });
    },
    getMaxBinActiveItems: function(){
        return d3.max(this.histBins,function(bin){ return bin.activeItems; });
    },
    getMinBinActiveItems: function(){
        return d3.min(this.histBins,function(bin){ return bin.activeItems; });
    },
    /** -- */
    init_DOM: function(){
        var me = this;
        var kshf_ = this.browser;
        var root;
        if(this.parentFacet){
            root = this.parentFacet.dom.subFacets;
        } else {
            if(this.options.layout==="left"){
                root = this.browser.layoutLeft;
            } else if(this.options.layout==="right"){
                root = this.browser.layoutRight;
            } else if(this.options.layout==="top"){
                root = this.browser.layoutTop;
            }
        }
        this.divRoot = root.append("div").attr("class","kshfChart")
            .attr("collapsed",this.collapsed===false?"false":"true")
            .attr("filtered",false)
            ;

        this.insertHeader();
        this.dom.wrapper = this.divRoot.append("div").attr("class","wrapper");
        this.dom.facetInterval = this.dom.wrapper.append("div").attr("class","facetInterval");

        this.dom.histogram = this.dom.facetInterval.append("div").attr("class","histogram");
        this.dom.histogram_bins = this.dom.histogram.append("div").attr("class","bins");

        this.dom.intervalSlider = this.dom.facetInterval.append("div").attr("class","intervalSlider rangeSlider");
        kshf.Util.insertSlider_do(this.dom.intervalSlider,{
            'range': this.intervalRange,
            'scale': this.intervalScale,
            'filter': this.intervalFilter,
            'root': kshf_.root
        });
        this.dom.selectedItemValue = this.dom.intervalSlider.select(".selectedItemValue");

        this.dom.labelGroup = this.dom.facetInterval.append("div").attr("class","labelGroup");
    },
    updateIntervalWidth: function(w){
        if(this.intervalRange.width!==undefined && this.intervalRange.width===w) return;
        this.intervalRange.width=w;

        this.optimalTickCount = Math.floor(this.intervalRange.width/25);

        if(this.options.intervalScale==='linear')
            this.intervalScale = d3.scale.linear()
                .domain([this.intervalRange.min, this.intervalRange.max])
                .range([0, this.intervalRange.width])
                .clamp(true)
                .nice(this.optimalTickCount)
                ;
        else
            this.intervalScale = d3.scale.log()
                .base(2)
                .domain([this.intervalRange.min, this.intervalRange.max])
                .range([0, this.intervalRange.width])
                .clamp(true)
                .nice(this.optimalTickCount)
                ;


        var ticks = this.intervalScale.ticks(this.optimalTickCount);
        ticks = ticks.filter(function(d){return d % 1 === 0;});;

        if(this.intervalTicks===undefined || this.intervalTicks.length !== ticks.length){
            this.updateTicks(ticks);
        } else{
            this.barWidth = this.intervalRange.width/((ticks.length-1)*1.0);
            this.refreshBins_Translate();
            this.refreshBars_Active_Scale();
            this.refreshBars_Total_Scale();
            this.refreshAxisLabels();
        }
        this.refreshIntervalSlider();
    },
    updateTicks: function(ticks){
        // make sure ticks are integer values..
        this.intervalTicks = ticks;
        var filterId = this.intervalFilter.id;
        var accessor = function(item){ return item.mappedData[filterId].v; };

        this.histBins = d3.layout.histogram().bins(this.intervalTicks)
            .value(accessor)(this.filteredItems);

        this.barWidth = this.intervalRange.width/((ticks.length-1)*1.0);

        this.updateActiveItems();

        this.updateBarScale2Active();

        this.insertBins();
        this.insertAxisLabels();
    },
    hasAttribs: function(){
        return false;
    },
    insertBins: function(){
        var me=this;

        var filterId = this.intervalFilter.id;
        // *************************************************************************************
        // Active Bins *************************************************************************
        var activeBins = this.dom.histogram_bins
            .selectAll("span.bar").data(this.histBins, function(d,i){ return i; });
        activeBins.exit()
            .each(function(bar){
                bar.forEach(function(item){
                    var index = item.mappedDOMs.indexOf(this);
                    if(index>-1) item.mappedDOMs.splice(index, 1);
                },this);
            })
            .remove();

        var xxxx=activeBins.enter().append("span").attr("class","bin")
            .each(function(bar){
                bar.highlightedItems=0;
                bar.forEach(function(item){
                    item.mappedData[filterId].b = bar;
                    // TODO: remove old mapping!
                    item.mappedDOMs.push(this);
                },this);
            });

        var onMouseOver = function(bar){
            this.parentNode.setAttribute("highlight",true);

            bar.forEach(function(item){ item.highlightDone = false; })
            bar.forEach(function(item){
                if(item.wanted) item.highlightAdvanced(false);
            });

            me.browser.refreshWidth_Bars_Highlight();
        };
        var onMouseOut = function(bar){
            this.parentNode.setAttribute("highlight",false);

            bar.forEach(function(item){ item.highlightDone = false; })
            bar.forEach(function(item){
                if(item.wanted) item.nohighlightAdvanced(false);
            });

            me.browser.refreshWidth_Bars_Highlight();
        };
        var onClick = function(bar){
            if(this.parentNode.getAttribute("filtered")==="true"){
                this.parentNode.setAttribute("filtered",false);
                me.intervalFilter.clearFilter(true);
                return;
            }
            this.parentNode.setAttribute("filtered","true");

            // store histogram state
            me.intervalFilter.dom_HistogramBar = this;
            me.intervalFilter.active = {
                min: bar.x,
                max: bar.x+bar.dx
            };
            // if we are filtering the last bar, make max_score inclusive
            me.intervalFilter.max_inclusive = (bar.x+bar.dx)===me.intervalRange.max;

            me.intervalFilter.addFilter(true);
        };

        xxxx.append("span").attr("class","bar active")
            .on("mouseover",onMouseOver)
            .on("mouseout",onMouseOut)
            .on("click",onClick);
        
        xxxx.append("span").attr("class","bar total");
        xxxx.append("span").attr("class","bar hover").attr("fast",true);
        xxxx.append("span").attr("class","item_count")
            .on("mouseover",onMouseOver)
            .on("mouseout",onMouseOut)
            .on("click",onClick);

        this.dom.histogram_bin = this.dom.histogram_bins.selectAll("span.bin");
        this.dom.bars_active = this.dom.histogram_bin.selectAll(".bar.active");
        this.dom.bars_total = this.dom.histogram_bin.selectAll(".bar.total");
        this.dom.bars_highlight = this.dom.histogram_bin.selectAll(".bar.hover");

        this.dom.bars_item_count = this.dom.histogram_bin.selectAll(".item_count");

        this.refreshBins_Translate();

        this.refreshBars_Total_Scale();
        this.refreshBars_Active_Scale();
        this.refreshResultPreview();
        this.refreshBars_Item_Count();

        this.refreshLabelWidth();
    },
    updateBarScale2Total: function(){
        this.barScale = this.barScale
            .domain([0, this.getMaxBinTotalItems()])
            .range([0, this.hist_height]);
    },
    updateBarScale2Active: function(){
        this.barScale = this.barScale
            .domain([0, this.getMaxBinActiveItems()])
            .range([0, this.hist_height]);
    },
    updateActiveItems: function(){
        this.histBins.forEach(function(bin){
            bin.activeItems = 0;
            bin.forEach(function(item){ if(item.wanted) bin.activeItems++; });
        });
    },
    insertAxisLabels: function(){
        var me=this;
        var ddd = this.dom.labelGroup.selectAll("span.tick").data(this.intervalTicks);
        var ddd_enter = ddd.enter().append("span").attr("class","tick");
        ddd.exit().remove();
        ddd_enter.append("span").attr("class","line");
        ddd_enter.append("span").attr("class","text");

        this.dom.labelTicks = this.dom.labelGroup.selectAll("span.tick");

        this.dom.labelTicks.selectAll("span.text").text(function(d){return d3.format("s")(d);});
        this.refreshAxisLabels();
    },
    refreshAxisLabels: function(){
        var me=this;
        this.dom.labelTicks.style("left",function(d){ return (me.intervalScale(d))+"px"; })
    },
    refreshBins_Translate: function(){
        var me=this;
        this.dom.histogram_bin.each(function(bar){
            var transform="translate("+me.intervalScale(bar.x)+"px,"+me.barScale.range()[1]+"px)";
            this.style.webkitTransform = transform;
            this.style.MozTransform = transform;
            this.style.msTransform = transform;
            this.style.OTransform = transform;
            this.style.transform = transform;
        });
    },
    refreshBars_Total_Scale: function(){
        var me=this;
        this.dom.bars_total.each(function(bar){
            var transform="scale("+(me.barWidth-me.barGap*2)+","+me.barScale(bar.y)+")";
            this.style.webkitTransform = transform;
            this.style.MozTransform = transform;
            this.style.msTransform = transform;
            this.style.OTransform = transform;
            this.style.transform = transform;
        });
    },
    refreshBars_Active_Scale: function(){
        var me=this;
        this.dom.bars_active.each(function(bar){
            var transform="scale("+(me.barWidth-me.barGap*2)+","+me.barScale(bar.activeItems)+")";
            this.style.webkitTransform = transform;
            this.style.MozTransform = transform;
            this.style.msTransform = transform;
            this.style.OTransform = transform;
            this.style.transform = transform;
        });
        this.dom.bars_item_count.each(function(bar){
            var transform="translate("+(me.barWidth/2)+"px,"+(-me.barScale(bar.activeItems))+"px)";
            this.style.webkitTransform = transform;
            this.style.MozTransform = transform;
            this.style.msTransform = transform;
            this.style.OTransform = transform;
            this.style.transform = transform;
        });
    },
    refreshResultPreview: function(){
        if(this.isEmpty) return;
        var me=this;
        this.dom.bars_highlight.each(function(bar){
            var transform="scale("+(me.barWidth-me.barGap*2)+","+me.barScale(bar.highlightedItems)+")";
            this.style.webkitTransform = transform;
            this.style.MozTransform = transform;
            this.style.msTransform = transform;
            this.style.OTransform = transform;
            this.style.transform = transform;
        });
    },
    refreshBars_Item_Count: function(){
        this.dom.histogram_bin.attr("noitem",function(bar){ return bar.activeItems===0; });
        var formatFunc = kshf.Util.formatForItemCount;
        this.dom.bars_item_count.text(function(bar){ return formatFunc(bar.activeItems);  });
    },
    refreshIntervalSlider: function(){
        var me=this;
        var _min = this.intervalScale(this.intervalFilter.active.min);
        var _max = this.intervalScale(this.intervalFilter.active.max);
        this.dom.intervalSlider.select(".base.total")
            .style("width",this.intervalScale.range()[1]+"px");
        this.dom.intervalSlider.select(".base.active")
            .attr("filtered",this.isFiltered())
            .each(function(d){
                var transform="translate("+_min+"px,0) scale("+(_max-_min)+",1)";
                this.style.webkitTransform = transform;
                this.style.MozTransform = transform;
                this.style.msTransform = transform;
                this.style.OTransform = transform;
                this.style.transform = transform;
            });
        this.dom.intervalSlider.selectAll(".handle")
            .each(function(d){
                if(me.intervalFilter.active.min===me.intervalRange.min){
                    _min = me.intervalScale.range()[0];
                }
                if(me.intervalFilter.active.max===me.intervalRange.max){
                    _max = me.intervalScale.range()[1];
                }
                var transform="translate("+((d==="min")?_min:_max)+"px,0)";
                this.style.webkitTransform = transform;
                this.style.MozTransform = transform;
                this.style.msTransform = transform;
                this.style.OTransform = transform;
                this.style.transform = transform;
            });
    },
    /** -- */
    refreshWidth: function(){
        // TODO;
        var totalWidth = this.getWidth();

        this.dom.leftHeader.style("width",totalWidth+"px");
        // No longer subtracting padding width, since we are using border-box-model.
        this.dom.facetInterval.style("width",totalWidth+"px");

        if(this.isEmpty) return;
        var wwwww=totalWidth-2*this.histogramMargin;
        this.updateIntervalWidth(wwwww);
    },
    /** returns the maximum number of total items stored per row in chart data */
    getMaxTotalItemsPerRow: function(){
        if(!this._maxTotalItemsPerRow){
            var dataMapFunc = this._dataMap;
            this._maxTotalItemsPerRow = d3.max(this.getAttribs(), function(d){ 
                if(dataMapFunc(d)===null) { return null; }
                return d.items.length;
            });
        }
        return this._maxTotalItemsPerRow;
    },
    /** -- TODO: Inherited from categorical facet. Boo. */
    getMaxBarValueMaxPerAttrib: function(){
        return 0;
    },
    /** -- TODO: Inherited from categorical facet. Boo. */
    setHeight: function(targetHeight){
        var c = targetHeight-this.getHeight_Header()-this.height_slider-this.height_labels-this.height_bin_top;
        this.hist_height = c;
        this.updateBarScale2Active();
        this.refreshBins_Translate();
        this.refreshBars_Active_Scale();
        this.refreshBars_Total_Scale();
        this.refreshResultPreview();
        this.refreshHeight();
    },
    /** -- TODO: Inherited from categorical facet. Boo. */
    allAttribsVisible: function(){

    },
    /** -- TODO: Inherited from categorical facet. Boo. */
    refreshHeight: function(){
        this.dom.histogram.style("height",(this.hist_height+15)+"px")
        this.dom.wrapper.style("height",(this.collapsed?"0":(this.hist_height+40))+"px");
    },
    setCollapsed: function(v){
        this.collapsed = v;
        this.divRoot.attr("collapsed",this.collapsed===false?"false":"true");
    },
    /** -- */
    collapseFacet: function(hide){
        this.setCollapsed(hide);
        this.browser.updateLayout_Height();
        if(sendLog) {
            if(hide===true) sendLog(CATID.FacetCollapse,ACTID_COLLAPSE.Collapse,{facet:this.options.facetTitle});
            else            sendLog(CATID.FacetCollapse,ACTID_COLLAPSE.Show,{facet:this.options.facetTitle});
        }
    },
    /** -- */
    insertHeader: function(){
        var me = this;
        this.dom.headerGroup = this.divRoot.append("div").attr("class","headerGroup");

        this.dom.leftHeader = this.dom.headerGroup.append("span").attr("class","leftHeader");

        var topRow_background = this.dom.leftHeader.append("div").attr("class","chartFirstLineBackground");
        this.dom.leftHeader.append("div").attr("class","border_line");

        var topRow = topRow_background.append("div").attr("class","hasLabelWidth")
            .style("position","relative");
        topRow.append("span").attr("class","chartFilterButtonParent").append("div")
            .attr("class","chartClearFilterButton rowFilter alone")
            .text('x').attr("title","Remove filter")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n',
                    fade: true,
                    opacity: 1,
                    title: function(){ 
                        return "<span class='big'>x</span class='big'> <span class='action'>Remove</span> filter"; 
                    }
                })
            })
            .on("mouseover",function(){ this.tipsy.show(); })
            .on("mouseout",function(d,i){ this.tipsy.hide(); })
            .on("click", function(d,i){
                this.tipsy.hide();
                me.intervalFilter.clearFilter(true);
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnFacet,
                    me.browser.getFilteringState(me.options.facetTitle));
            });
        topRow.append("span").attr("class", "header_label")
            .attr("title", this.attribCount_Total+" attributes")
            .html(this.options.facetTitle)
            .on("click",function(){ if(me.collapsed) me.collapseFacet(false); });

        topRow_background.append("span").attr("class","header_label_arrow")
            .attr("title","Show/Hide attributes").text("▼")
            .on("click",function(){ me.collapseFacet(!me.collapsed); })
            ;

    },
    /** -- */
    refreshAfterFilter: function(resultChange){
        var me = this;
        if(this.isEmpty) return;
        if(resultChange<0 && false){
            this.updateActiveItems();
            this.refreshBars_Item_Count();
            // first scale using the existing scale
            this.refreshBins_Translate();
            this.refreshBars_Active_Scale();
            setTimeout(function(){
                me.animateBarScale2Active();
            },1000)
        } else{
            this.updateActiveItems();
            this.refreshBars_Item_Count();
            me.animateBarScale2Active();
        }
    },
    animateBarScale2Active: function(){
        this.updateBarScale2Active();
        this.refreshBins_Translate();
        this.refreshBars_Active_Scale();
        this.refreshBars_Total_Scale();
    },
    /** -- */
    refreshHistogram: function(){
        // 
    },
    refreshLabelWidth: function(w){
        this.dom.headerGroup.selectAll(".hasLabelWidth").style("width",this.browser.categoryTextWidth+"px");
    },
    /** - */
    insertHistogram: function(){
        // TODO
    },
    /** -- */
    insertTicks: function(){
        // TODO
    },
    setSelectedPosition: function(v){
        this.dom.selectedItemValue
            .style("left",(this.intervalScale(v))+"px")
            .style("display","block");
    },
    hideSelectedPosition: function(){
         this.dom.selectedItemValue.style("display",null);
    },
};


