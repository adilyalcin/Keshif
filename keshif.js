/*jslint plusplus: true, vars: true, browser: true, white:true, nomen :true, sloppy:true, continue:true */
/*global d3, google */

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
    num_of_browsers: 0,
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
    }
};


kshf.Util = {
    dif_activeItems: function(a,b){
        return b.activeItems - a.activeItems;
    },
    dif_barValue: function(a,b){
        return b.barValue - a.barValue;
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
    cellToArray: function(dt, cols, splitExpr, convertInt){
        if(splitExpr===undefined){
            splitExpr = /\b\s+/;
        }
        var j;
        dt.forEach(function(p){
            p = p.data;
            cols.forEach(function(c){
                var list = p[c];
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
                p[c] = list;
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
    /** filter_multi_or : ANY of the mappins is true */
    filter_multi_or: function(idList,curDtId) {
        var r=false;
        idList.every(function(id){
            var d=curDtId[id];
            if(d!==undefined) {
                if(d.selected) r=true;
            }
            return !r;
        });
        return r;
    }
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
    ClearOnSummary : 4,
    ClearOnFacet   : 5,
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
    Resize     : 6
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
        delayIn: 0,
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
        this.jq_tip.data('tipsy-pointee', this.jq_element[0]);
        return this.jq_tip;
    },
};



/**
 * @constructor
 */
kshf.Item = function(d, idIndex, primary){
    // the main data within item
    this.data = d;
    this.idIndex = idIndex; // TODO: Items don't need to have ID index, only one per table is enough!
	this.selected = true;
    // used by filters
    this.items = []; // set of assigned primary items
	this.activeItems = 0; // If primary item, activeItems is the number of active linked items
    this.barValue = 0;
    this.barValueMax = 0;
    if(primary){
        // 1 value is added for global text search
        this.filters = [true];
        this.barCount = 1; // 1 by default
        this.wanted = true;
        this.mappedRows = [];
        this.mappedItems = [];
        this.mappedData = [true]; // caching the values this item was mapped to.
        this.mappedDots = [];
        this.mappedAttribs = [];
        this.dirtyFilter = true;
    }
};
kshf.Item.prototype = {
    /**
     * Returns unique ID of the item.
     */
    id: function(){
        return this.data[this.idIndex];
    },
    /** setFilter */
    setFilter: function(index,v){
        if(this.filters[index]===v) return;
        this.filters[index] = v;
        this.dirtyFilter = true;
    },
    /**
     * Updates wanted state, and notifies all related filter attributes of the change.
     */
    updateSelected: function(){
        if(!this.dirtyFilter) return;

        var me=this;
        var oldSelected = this.wanted;

        // checks if all filter results are true
        this.wanted=true;
        this.filters.every(function(f){
            me.wanted=me.wanted&&f;
            return me.wanted;
        });
        
        if(this.wanted===true && oldSelected===false){
            this.browser.itemsSelectedCt++;
            this.mappedRows.forEach(function(chartMapping){
                if(chartMapping === undefined) return;
                if(chartMapping === true) return;
                chartMapping.forEach(function(m){
                    m.activeItems++;
                    m.barValue+=me.barCount;
                    m.sortDirty=true;
                });
            });
            this.mappedItems.forEach(function(item){ item.activeItems++; })
            this.mappedDots.forEach(function(d){d.setAttribute('display',"true");});
        } else if(this.wanted===false && oldSelected===true){
            this.browser.itemsSelectedCt--;
            this.mappedRows.forEach(function(chartMapping){
                if(chartMapping === undefined) return;
                if(chartMapping === true) return;
                chartMapping.forEach(function(m){
                    m.activeItems--;
                    m.barValue-=me.barCount;
                    m.sortDirty=true;
                });
            });
            this.mappedItems.forEach(function(item){ item.activeItems--; })
            this.mappedDots.forEach(function(d){d.setAttribute('display',"false");});
        }
        this.dirtyFilter = false;
    },
    /** Highlights all the time components of this item */
    highlightTime: function(){
        this.mappedDots.forEach(function(d){d.setAttribute('highlight',true);});
    },
    /** Highlights all attributes of this item */
    highlightAttribs: function(){
        this.mappedAttribs.forEach(function(d){d.setAttribute('highlight',"true");});
    },
    /** Highlights the list item */
    highlightListItem: function(){
        if(this.listItem!==undefined) this.listItem.setAttribute("highlight",true);
    },
    /** Higlights all relevant UI parts to this UI item - Attributes, dots, and list */
    highlightAll: function(){
        this.highlightTime();
        this.highlightAttribs();
        this.highlightListItem();
    },
    /** Removes higlight from all the time components of this item */
    nohighlightTime: function(){
        this.mappedDots.forEach(function(d){d.setAttribute('highlight',false);});
    },
    /** Removes higlight from all attributes of this item */
    nohighlightAttribs: function(){
        this.mappedAttribs.forEach(function(d){d.setAttribute('highlight',"false");});
    },
    /** Removes higlight from the list item */
    nohighlightListItem: function(){
        this.listItem.setAttribute("highlight",false);
    },
    /** Removes higlight from all relevant UI parts to this UI item - Attributes, dots, and list */
    nohighlightAll: function(){
        this.nohighlightTime();
        this.nohighlightAttribs();
        this.nohighlightListItem();
    }
};

/**
 * The list UI
 * @constructor
 */
kshf.List = function(kshf_, config, root){
    var me = this;
    this.itemtoggledetailsWidth = 22;
    this.itemBarWidth_Max = 50;
    this.parentKshf = kshf_;
    this.dom = {};

    this.linkFilterWidth = 65;
    
    // Sorting options
    this.sortingOpts = config.sortingOpts;
    this.sortingOpts.forEach(function(sortOpt){
        if(sortOpt.value===undefined) sortOpt.value = kshf_.columnAccessFunc(sortOpt.name);
        if(!sortOpt.label) sortOpt.label = sortOpt.value;
        if(sortOpt.inverse===undefined) sortOpt.inverse = false;
        if(sortOpt.func===undefined) sortOpt.func = me.getSortFunc(sortOpt.value);
    });
    this.sortingOpt_Active = this.sortingOpts[0];

    this.displayType = 'list';
    if(config.displayType==='grid') this.displayType = 'grid';

    this.sortColWidth = config.sortColWidth;

    if(config.textSearch!==undefined){
        if(config.textSearchFunc===undefined){
            config.textSearchFunc = this.getKshf().columnAccessFunc(config.textSearch);
        }
        if(config.textSearch[0]==="*")
            config.textSearch = config.textSearch.substring(1);
        // decapitalize
        config.textSearch= config.textSearch.charAt(0).toLowerCase() + config.textSearch.slice(1);
    }
    if(config.content!==undefined){
        config.contentFunc = this.getKshf().columnAccessFunc(config.content);
    }

    this.hideTextSearch = (config.textSearchFunc===undefined);

    this.contentFunc = config.contentFunc;

    this.linkFilterID = 0;
    this.itemLink = config.itemLink;
    this.itemLinkFunc = config.itemLinkFunc;
    this.itemLinkText = config.itemLinkText;
    if(this.itemLinkFunc===undefined && this.itemLink!==undefined){
        this.itemLinkFunc = this.getKshf().columnAccessFunc(this.itemLink);
    }
    if(this.itemLink!==undefined){
        this.linkFilterID = this.getKshf().maxFilterID++;
    }

    this.detailsToggle = config.detailsToggle;
    if(this.detailsToggle === undefined) { this.detailsToggle = "Off"; }
    this.detailsDefault = config.detailsDefault;
    if(this.detailsDefault === undefined) { this.detailsDefault = false; }
    if(this.detailsToggle==="One") this.detailsDefault=false;

	this.listDiv = root.append("div").attr("class","listDiv")
        .attr('showAll',this.detailsDefault?'false':'true')
        .attr('detailsToggle',this.detailsToggle);
    
    var listHeader=this.listDiv.append("div").attr("class","listHeader");
    this.listDiv.append("div").attr("class","listItemGroup");

    var listHeaderTopRow=listHeader.append("div").attr("class","topRow");
    this.dom.listColumnRow=listHeader.append("div").attr("class","listColumnRow");

    var count_wrap = listHeaderTopRow.append("span").attr("class","listheader_count_wrap").style('width',me.sortColWidth+"px");;
        count_wrap.append("span").attr("class","listheader_count_bar");
        count_wrap.append("span").attr("class","listheader_count");
    listHeaderTopRow.append("span").attr("class","listheader_itemName").html(this.getKshf().itemName);
    if(this.hideTextSearch!==true){    
        var listHeaderTopRowTextSearch = listHeaderTopRow.append("span").attr("class","bigTextSearch_wrap");
        listHeaderTopRowTextSearch.append("svg")
            .attr("class","searchIcon")
            .attr("width","13")
            .attr("height","12")
            .attr("viewBox","0 0 491.237793 452.9882813")
            .attr("xmlns","http://www.w3.org/2000/svg")
            .html(
              '<g fill-rule="nonzero" clip-rule="nonzero" fill="#0F238C" stroke="#cb5454" stroke-miterlimit="4">'+
               '<g fill-rule="evenodd" clip-rule="evenodd">'+
                '<path fill="#cb5454" id="path3472" d="m328.087402,256.780273c-5.591797,8.171875 -13.280273,17.080078 -22.191406,25.296875c-9.685547,8.931641 -20.244141,16.550781 -27.433594,20.463867l163.125977,150.447266l49.649414,-45.783203l-163.150391,-150.424805z"/>'+
                '<path fill="#cb5454" id="path3474" d="m283.82959,45.058109c-65.175781,-60.07764 -169.791023,-60.07764 -234.966309,0c-65.150881,60.100582 -65.150881,156.570309 0,216.671383c65.175285,60.100586 169.790527,60.100586 234.966309,0c65.175781,-60.101074 65.175781,-156.570801 0,-216.671383zm-34.198242,31.535152c-46.204102,-42.606934 -120.390625,-42.606934 -166.570305,0c-46.204594,42.583496 -46.204594,110.994141 0,153.601074c46.17968,42.606445 120.366203,42.606445 166.570305,0c46.205078,-42.606934 46.205078,-111.017578 0,-153.601074z"/>'+
               '</g>'+
              '</g>')
            ;
        var bigTextSearch = listHeaderTopRowTextSearch.append("input").attr("class","bigTextSearch")
            .attr("placeholder","Search "+(config.textSearch?config.textSearch:"title"))
            .attr("autofocus","true");
        bigTextSearch.on("keydown",function(){
            if(this.timer){
                clearTimeout(this.timer);
                this.timer = null;
            }
            var x = this;
            this.timer = setTimeout( function(){
                var v=x.value.toLowerCase();
                listHeaderTopRowTextSearch.select("span").style('display',(v==='')?'none':'inline-block');
                var v=v.split(" ");

                // go over all the items in the list, search each keyword separately
                me.getKshfItems().forEach(function(item){
                    var f = true;
                    v.every(function(v_i){
                        f = f && config.textSearchFunc(item).toLowerCase().indexOf(v_i)!==-1;
                        return f;
                    });
                    item.setFilter(0,f);
                });
                me.getKshfItems().forEach(function(item){
                    item.updateSelected();
                });
                me.getKshf().update();
                x.timer = null;
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.MainTextSearch,me.getKshf().getFilteringState());
            }, 750);
        });
        listHeaderTopRowTextSearch.append("span")
            .html('<svg width="15" height="15" viewBox="0 0 48 48" class="clearText">'+
                  '<g>'+
                    '<path type="arc" style="fill-opacity:1;" cx="24" cy="24" rx="22" ry="22" d="M 46 24 A 22 22 0 1 1  2,24 A 22 22 0 1 1  46 24 z"/>'+
                    '<path nodetypes="cc" style="fill:none;fill-opacity:0.75;fill-rule:evenodd;stroke:#ffffff;stroke-width:6;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 16.221825,16.221825 L 31.778175,31.778175"/>'+
                    '<path nodetypes="cc" d="M 31.778175,16.221825 L 16.221825,31.778175" style="fill:none;fill-opacity:0.75;fill-rule:evenodd;stroke:#ffffff;stroke-width:6;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/>'+
                  '</g>'+
                '</svg>')
            .on("click",function() {
                d3.select(this).style('display','none');
                bigTextSearch[0][0].value = '';
                bigTextSearch[0][0].focus();

                me.getKshfItems().forEach(function(item){
                    item.setFilter(0,true);
                });
                me.getKshfItems().forEach(function(item){
                    item.updateSelected();
                });
                me.getKshf().update();
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.MainTextSearch,me.getKshf().getFilteringState());
            });
    }

    if(this.itemLink!==undefined){
        this.insertItemLinkBar_Header();
    }

    this.insertSortSelect();
    this.insertItemsToggleDetails();

    this.dom.filterblocks = this.dom.listColumnRow.append("span").attr("class","filter-blocks");

    // apply itemLinkFunc
    this.filteringItem = null;
    if(this.itemLink){
        var items = this.getKshfItems();
        var itemIDMap = kshf.dt_id[this.getKshf().primaryTableName];
        items.forEach(function(item){
            // TODO: Set filter value for the item (filtered or not)
            var toMap = this.itemLinkFunc(item);
            // toMap stores the itemss that this current item is linked to.
            if(toMap===undefined || toMap==="") { 
                toMap=null;
            } else if(toMap instanceof Array){
                // remove duplicate values in the array
                var found = {};
                toMap = toMap.filter(function(e){
                    if(found[e]===undefined){
                        found[e] = true;
                        return true;
                    }
                    return false;
                });
            }
            item.setFilter(this.linkFilterID,true);
            item.mappedData[this.linkFilterID] = toMap;
            // Push the current item in mappings for the target item.
            item.items = [];
            toMap.forEach(function(m){
                var targetItem = itemIDMap[m];
                if(targetItem===undefined) return;
                targetItem.items.push(item);
                targetItem.activeItems++;
                item.mappedItems.push(targetItem);
            });
            item.selected = false;
        },this);
    }

    this.sortItems();
    this.insertItems();
};
kshf.List.prototype = {
    /** get parent keshif */
    getKshf : function(){
        return this.parentKshf;
    },
    /** get parent keshif */
    getKshfItems : function(){
        return this.parentKshf.items;
    },
    /** Insert items into the UI, called once on load */
    insertItems: function(){
        var me = this;

        this.dom.listItems = this.listDiv.select(".listItemGroup").selectAll("div.listItem")
            // if content Func is not defined, provide an empty list
            .data((this.contentFunc===undefined?[]:this.getKshfItems()), function(d){ return d.id(); })
        .enter()
            .append("div")
            .attr("class","listItem")
            .attr("details",this.detailsDefault?"true":"false")
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
        
        if(this.itemLink!==undefined){
            this.insertItemLinkBar();
        }

        if(this.displayType==='list'){
            this.dom.listItems.append("div").attr("class","listcell listsortcolumn")
                .style("width",this.sortColWidth+"px")
                .html(function(d){ return me.sortingOpt_Active.label(d); });
                ;
        }

        if(this.detailsToggle!=="Off"){
            this.insertItemToggleDetails();
        }

        this.dom.listItems_Content = this.dom.listItems
            .append("div")
            .attr("class","content")
            .html(function(d){ return me.contentFunc(d);});
    },
    /** insertSortSelect */
    insertSortSelect: function(){
        var me=this;
        if(this.sortingOpts.length<2) {
            this.dom.listColumnRow.append("div").attr("class","listsortcolumn")
                .style("width",this.sortColWidth+"px")
                .text(this.sortingOpts[0].name);
            return;
        }
        this.dom.listColumnRow.append("select")
            .attr("class","listSortOptionSelect")
            .style("width",(this.sortColWidth+5)+"px") // 5 pixel is used for padding in the list part.
            .on("change", function(){
                me.sortingOpt_Active = me.sortingOpts[this.selectedIndex];
                me.sortItems();
                me.reorderItemsOnDOM();
                if(me.displayType==='list'){
                    // update sort column labels
                    me.dom.listItems.selectAll(".listsortcolumn")
                        .html(function(d){ return me.sortingOpt_Active.label(d); });
                }
                me.updateShowListGroupBorder();
            })
            .selectAll("input.list_sort_label")
                .data(this.sortingOpts)
            .enter().append("option")
                .attr("class", "list_sort_label")
                .text(function(d){ return d.name; })
                ;
    },
    /** insertItemToggleDetails */
    insertItemToggleDetails: function(){
        var kshf_ = this.getKshf();
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
            .attr("title","Show details")
            .on("click", function(d){ 
                kshf_.showListItemDetails(d);
            })
            .on("mouseover",function(d){
                this.parentNode.tipsy.options.title = function(){ return "Show details"; };
                this.parentNode.tipsy.show();
            })
            .on("mouseout",function(d){ this.parentNode.tipsy.hide(); })
            ;
        x.append("span").attr("class","item_details_off").html("[-]")
            .attr("title","Hide details")
            .on("click", function(d){ 
                kshf_.hideListItemDetails(d);
            })
            .on("mouseover",function(d){ 
                this.parentNode.tipsy.options.title = function(){ return "Hide details"; };
                this.parentNode.tipsy.show();
            })
            .on("mouseout",function(d){ this.parentNode.tipsy.hide(); })
            ;
    },
    /** insertItemsToggleDetails */
    insertItemsToggleDetails: function(){
        if(this.detailsToggle==="Off") return;
        var me=this;
        var x=this.dom.listColumnRow.append("div")
            .attr("class","itemtoggledetails");
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
    /** insertItemLinkBar_Header */
    insertItemLinkBar_Header: function(){
        this.dom.listColumnRow
            .append("div").attr("class","itemLinks")
            .style("width",this.linkFilterWidth+"px")
            .append("span").attr("class","header")
            .html(this.itemLink)
            ;
    },
    /** after you re-sort the primary table or change item visibility, call this function */
    updateShowListGroupBorder: function(){
        var me = this;
        var items = me.getKshfItems();
        if(this.displayType==='list') {
            if(this.sortingOpt_Active.noGroupBorder===true){
                this.dom.listItems.style("border-top-width", "0px");
            } else {
                // go over item list
                var pItem=null;
                var sortValueFunc = this.sortingOpt_Active.value;
                var sortFunc = this.sortingOpt_Active.func;
                items.forEach(function(item,i){
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
    /** Reorders items in the DOM */
    reorderItemsOnDOM: function(){
        this.dom.listItems
            .data(this.getKshfItems(), function(d){ return d.id(); })
            .order();
    },
    /** Sort all items fiven the active sort option */
    sortItems: function(){
        var me=this;
        var sortValueFunc = this.sortingOpt_Active.value;
        var sortFunc = this.sortingOpt_Active.func;
        var inverse = this.sortingOpt_Active.inverse;
        this.getKshfItems().sort(function(a,b){
            // do not need to process unwanted items, their order does not matter
            if(!a.wanted||!b.wanted){ return 0; }
            var dif=sortFunc(sortValueFunc(a),sortValueFunc(b));
            if(dif===0){ dif=b.id()-a.id(); }
            if(inverse) dif = -dif;
            return dif; // use unique IDs to add sorting order as the last option
        });
    },
    /** Returns the sort value type for fiven sort Value function */
    getSortFunc: function(sortValueFunc){
        // 0: string, 1: date, 2: others
        var sortValueType_, sortValueType_temp, same;
        
        // find appropriate sortvalue type
        for(var k=0, same=0; true ; k++){
            if(same===3 || k===this.getKshfItems().length){
                sortValueType_ = sortValueType_temp;
                break;
            }
            var item = this.parentKshf.items[k];
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
    updateItemVisibility: function(){
        var me=this;
        var showType=this.displayType==='list'?"block":"inline-block";
    	this.dom.listItems.style("display",function(attrib){return (attrib.wanted)?showType:"none"; });
        this.listDiv.select(".listheader_count").text(function(){
            if(me.getKshf().itemsSelectedCt===0) { return "No"; }
            return me.getKshf().itemsSelectedCt;
        });
        this.listDiv.select(".listheader_count_bar").transition().style("width",function(){ 
            return (me.getKshf().listDisplay.sortColWidth*me.getKshf().itemsSelectedCt/me.getKshfItems().length)+"px";
        });
    },
    /** updateContentWidth */
    updateContentWidth: function(contentWidth){
        if(this.detailsToggle!=="Off") contentWidth-=this.itemtoggledetailsWidth;
        contentWidth-=this.sortColWidth;
        if(this.itemLink!==undefined) contentWidth-=this.linkFilterWidth;
        contentWidth-=9; // works for now. TODO: check 
        this.dom.filterblocks.style("width",contentWidth+"px");
        if(this.displayType==='list'){
            this.dom.listItems_Content.style("width",contentWidth+"px");
        }
    },
    /** insertItemLinkBar */
    insertItemLinkBar: function(){
        var me=this;
        var x= this.dom.listItems.append("div").attr("class","listcell itemLinks")
            .style("width",this.linkFilterWidth+"px")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity:'s', fade:true, className:'details',
                    title: function(){ return "Add "+me.itemLink+" filter"; }
                });
            })
            .on("click",function(item){
                if(item.activeItems===0) return;
                me.filterLinks(item);
            })
            .on("mouseover",function(){
                this.tipsy.show();
            })
            .on("mouseout",function(d,i){
                this.tipsy.hide();
            })
            .append("span").attr("class","captureEvents")
            ;
        this.dom.listItems_itemLinks_captureEvents = x;
        this.dom.listItems_itemLinks_itemCount = x.append("span").attr("class","itemCount");
        this.dom.listItems_itemLinks_itemBar = x.append("span").attr("class","itemBar");
        this.updateItemLinks();
    },
    /** updateItemLinks */
    updateItemLinks: function(){
        var me = this;
        this.linkBarAxisScale = d3.scale.linear()
            .domain([0,this.getMaxBarValuePerItem()])
            .rangeRound([0, this.itemBarWidth_Max]);
        this.dom.listItems_itemLinks_captureEvents
            .attr("count",function(d){ return d.activeItems; });
        this.dom.listItems_itemLinks_itemCount
            .text(function(d){ return d.activeItems; });
        this.dom.listItems_itemLinks_itemBar
            .transition().duration(this.getKshf().anim_layout_duration)
            .style("width", function(d){ return me.linkBarAxisScale(d.activeItems)+"px"; })
    },
    /** returns the maximum number of items stored per row in chart data */
    getMaxBarValuePerItem: function(){
        var dataMapFunc = this.itemLinkFunc;
        return d3.max(this.getKshfItems(), function(d){ 
            if(dataMapFunc(d)===null) { return null; }
            return d.activeItems;
        });
    },
    /** updateAfterFiltering */
    updateAfterFiltering: function(){
        if(this.hideTextSearch!==true) {
            if(this.listDiv.select("input.bigTextSearch")[0][0].value!=="") filteredCount++;
        }
        this.updateItemVisibility();
        this.updateShowListGroupBorder();
        if(this.itemLink!==undefined){
            this.updateItemLinks();
        }
    },
    isFiltered_Link: function(){
        return this.filteringItem!==null;
    },
    filterLinks: function(item_src){
        item_src.selected = !item_src.selected;
        var filterId = this.linkFilterID;
        var curDtId = kshf.dt_id[this.getKshf().primaryTableName];
        if(this.filteringItem) this.filteringItem.selected = false;
        this.filteringItem = item_src;

        // if any of the linked items are selected, filtering will pass true
        this.getKshfItems().forEach(function(item){
            var m=item.mappedData[filterId];
            if(m===undefined || m===null || m===""){ 
                item.setFilter(filterId,false);
            } else {
                if(m instanceof Array){
                    item.setFilter(filterId,kshf.Util.filter_multi_or.call(this,m,curDtId));
                } else {
                    item.setFilter(filterId,curDtId[m].selected);
                }
            }
        },this);

        this.refreshFilterSummary();

        this.getKshfItems().forEach(function(item){
            item.updateSelected();
        });
        this.getKshf().update();
    },
    clearFilterLinks: function(){
        if(this.filteringItem===null) return;
        this.filteringItem.selected = false;
        this.filteringItem = null;
        this.getKshfItems().forEach(function(item){
            item.setFilter(this.linkFilterID,true);
            item.updateSelected();
        },this);
        this.refreshFilterSummary();
        this.getKshf().update();
    },
    insertFilterSummaryBlock: function(){
        var x;
        x = this.dom.filterblocks
            .append("span").attr("class","filter-block")
            .attr("title","Remove filter")
            ;
        x.append("span").attr("class","chartClearFilterButton summary").text("x")
            .each(function(d){
                this.tipsy = new Tipsy(this, {
                    gravity: 'n',
                    fade: true,
                    className: 'details',
                    opacity: 1,
                    title: function(){ return "Remove filter"; }
                })
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
    },
    removeFilterSummaryBlock: function(root){
        if(root===null || root===undefined) return;
        root.attr("ready",false);
        setTimeout(function(){ root[0][0].parentNode.removeChild(root[0][0]); }, 300);
    },
    /** refreshFilterSummary */
    refreshFilterSummary: function(){
        var me=this;
        if(!this.isFiltered_Link()){
            this.removeFilterSummaryBlock(this.filterSummaryBlock);
            this.filterSummaryBlock = null;
        } else {
            // insert DOM
            if(this.filterSummaryBlock===null || this.filterSummaryBlock===undefined){
                this.filterSummaryBlock = this.insertFilterSummaryBlock();
                this.filterSummaryBlock.select(".chartClearFilterButton")
                    .on("click",function(){ 
                        me.clearFilterLinks(); 
                        if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnSummary,
                            me.getKshf().getFilteringState(me.options.facetTitle));
                    });
                this.filterSummaryBlock.select(".txttt").text(this.itemLink+": ");
                this.filterSummaryBlock.select(".filter_item")
                    .html("<b>"+this.itemLinkText(this.filteringItem)+"</b>")
                    ;
            }
        }
    },

};

/**
 * @constructor
 */
kshf.Browser = function(options){
    var me = this;
    // BASIC OPTIONS
    this.chartTitle = options.chartTitle;
	this.charts = [];
    this.maxFilterID = 1; // 1 is used for global search
    this.barMaxWidth = 0;

    this.scrollPadding = 5;
    this.scrollWidth = 10;
    this.sepWidth = 10;

    this.anim_barscale_duration_default = 400;
    this.anim_layout_duration_default = 500;
    
    this.categoryTextWidth = options.categoryTextWidth;
    if(this.categoryTextWidth===undefined){
        this.categoryTextWidth = 115;
    }
    if(typeof options.barChartWidth === 'number'){
        this.barChartWidth = options.barChartWidth;
    }

/*    if(this.categoryTextWidth<115){
        this.categoryTextWidth = 115;
    }*/
    this.chartDefs = options.charts;
    this.listDef = options.list;

    this.primItemCatValue = null;
    if(typeof options.catValue === 'string'){
        this.primItemCatValue = options.catValue;
    }

    if(options.listMaxColWidthMult){
        this.listMaxColWidthMult = options.listMaxColWidthMult;
    } else {
        this.listMaxColWidthMult = 0.25;
    }
    this.line_height=options.line_height;
    if(this.line_height===undefined){
        this.line_height = 18; // default
    }

    this.domID = options.domID;
    this.source = options.source;
    this.source.loadedTableCount=0;
    this.loadedCb = options.loadedCb;
    this.readyCb = options.readyCb;
    this.updateCb = options.updateCb;
    this.dom = {}

    this.skipFacet = {};
    if(options.columnsSkip){
        options.columnsSkip.forEach(function(c){
            this.skipFacet[c] = true;
        },this);
    }

    // itemName
    if(options.itemName!==undefined){
        this.itemName = options.itemName;
    } else {
        this.itemName = this.source.sheets[0].name;
    }
    // dirRoot 
    this.dirRoot = options.dirRoot;
    if(this.dirRoot === undefined){
        this.dirRoot = "./";
    }
    // showDataSource
    this.showDataSource = true;
    if(options.showDataSource!==undefined){
        this.showDataSource = options.showDataSource;
    }
    // forceHideBarAxis
    this.forceHideBarAxis = false;
    if(options.forceHideBarAxis!==undefined){
        this.forceHideBarAxis = options.forceHideBarAxis;
    }

    this.root = d3.select(this.domID)
        .classed("kshfHost",true)
        .attr("tabindex","1")
        .style("position","relative")
        .style("overflow-y","hidden")
        .on("keydown",function(){
            var e = d3.event;
            if(e.keyCode===27){ // escchartRowLabelSearchape
                me.clearAllFilters();
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearAllEscape,this.getFilteringState());
            }
        })
        ;

    if(options.showResizeCorner === true){
        this.insertResize();
    }

    // insert gradient defs once into the document
    kshf.num_of_browsers++;
    if(kshf.num_of_browsers==1) this.insertGradients();

    this.insertInfobox();

    if(this.chartTitle!==undefined){
        this.insertBrowserHeader();
    }

    var subRoot = this.root.append("div").attr("class","subRoot");

    this.layoutBackground = subRoot.append("div").attr("class","kshf layout_left_background");
    this.layoutTop = subRoot.append("div").attr("class", "kshf layout_top");
    this.layoutLeft  = subRoot.append("div").attr("class", "kshf layout_left");
    this.layoutRight = subRoot.append("div").attr("class", "kshf layout_right");
	
    this.loadSource();
};

kshf.Browser.prototype = {
    insertResize: function(){
        var me=this;
        this.root.append("div").attr("class", "kshf layout_resize")
            .on("mousedown", function (d, i) {
                me.root.style('cursor','nwse-resize');
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
                    // unregister mouse-move callbacks
                    d3.select("body").on("mousemove", null).on("mouseup", null);
                });
               d3.event.preventDefault();
           });
    },
    insertGradients: function(){
        // add gradients
        var rowBackgroundColor = "#dadada";
        var otherGradientColor="gray";
        var gradient_svg = this.root.append("svg").attr("width",0).attr("height",0).append("defs");
        var dotBackgroundColor = "#616F7A";
        var dotBackgroundColor_Inactive = "#CCCCCC";

        var gradient =gradient_svg.append("linearGradient")
            .attr("id","gr_rowSelectBackground_Count")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","100%")
            .attr("y2","0%");
        gradient.append("stop")
            .attr("offset","0%")
            .style("stop-color",rowBackgroundColor)
            .style("stop-opacity",1);
        gradient.append("stop")
            .attr("offset","100%")
            .style("stop-color",rowBackgroundColor)
            .style("stop-opacity",0);
        
        gradient =gradient_svg.append("linearGradient")
            .attr("id","gr_rowSelectBackground_Label")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","100%")
            .attr("y2","0%");
        gradient.append("stop")
            .attr("offset","0%")
            .style("stop-color",rowBackgroundColor)
            .style("stop-opacity",0);
        gradient.append("stop")
            .attr("offset","20%")
            .style("stop-color",rowBackgroundColor)
            .style("stop-opacity",1);
        gradient.append("stop")
            .attr("offset","100%")
            .style("stop-color",rowBackgroundColor)
            .style("stop-opacity",1);
        
        gradient =gradient_svg.append("radialGradient")
            .attr("id","dotGradient50")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.4);
        gradient.append("stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.4);
        gradient.append("stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.3);

        gradient =gradient_svg.append("radialGradient")
            .attr("id","dotGradient75")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.6);
        gradient.append("stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.6);
        gradient.append("stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.5);

        gradient =gradient_svg.append("radialGradient")
            .attr("id","dotGradient25")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.25);
        gradient.append("stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.25);
        gradient.append("stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.2);

        gradient =gradient_svg.append("radialGradient")
            .attr("id","dotGradient100")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.85);
        gradient.append("stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.85);
        gradient.append("stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.7);

        gradient =gradient_svg.append("radialGradient")
            .attr("id","dotGradient_Inactive")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor_Inactive)
            .style("stop-opacity",1);
        gradient.append("stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor_Inactive)
            .style("stop-opacity",1);
        gradient.append("stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor_Inactive)
            .style("stop-opacity",0);
    },
    insertInfobox: function(){
        var me=this;
        var creditString="";
        creditString += "<div align='center'>";
        creditString += "<div class='header'>Browser created by <span class='libName'>Keshif</span> library</div>";

//        creditString += "<div align='center' class='boxinbox' style='font-size:0.9em'>";
//        creditString += "Get the code from <a href='http://www.github.com/adilyalcin/Keshif' target='_blank'><img alt='github' src='"+this.dirRoot+"img/gitHub.png' height='20' style='position:relative; top:5px'></a> <br/> and use it for your own data.</br>";
//        creditString += "</div>";

        creditString += "<div align='center' class='boxinbox project_credits'>";
        creditString += " Developed by:<br/>";
            creditString += "<div style='float:right;'>"
            creditString += "<iframe src='http://ghbtns.com/github-btn.html?user=adilyalcin&repo=Keshif&type=watch&count=true' allowtransparency='true' frameborder='0' scrolling='0' width='90px' height='20px'></iframe><br/>";
            creditString += "<iframe src='http://ghbtns.com/github-btn.html?user=adilyalcin&repo=Keshif&type=fork&count=true' allowtransparency='true' frameborder='0' scrolling='0' width='90px' height='20px'></iframe>";
            creditString += "</div>";
        creditString += " <a href='http://www.adilyalcin.me' target='_blank'><img src='"+this.dirRoot+"img/credit-1_01.png' style='height:50px'></a>";
        creditString += " <img src='"+this.dirRoot+"img/credit-1_02.png' style='height:50px; padding:0px 4px 0px 4px'>";
        creditString += " <a href='http://www.cs.umd.edu/hcil/' target='_blank'><img src='"+this.dirRoot+"img/credit-1_03.png' style='height:50px'></a>";
        creditString += " <img src='"+this.dirRoot+"img/credit-1_04.png' style='height:50px;padding:0px 4px 0px 4px'>";
        creditString += " <a href='http://www.umd.edu' target='_blank'><img src='"+this.dirRoot+"img/credit-1_05.png' style='height:50px'></a>";
        creditString += "</div>";
        creditString += "";
        creditString += "<div align='center' class='boxinbox project_credits'>";
        creditString += " 3rd party libraries and APIs used:<br/>";
        creditString += " <a href='http://d3js.org/' target='_blank'>D3</a> -";
        creditString += " <a href='http://jquery.com' target='_blank'>JQuery</a> -";
        creditString += " <a href='https://developers.google.com/chart/' target='_blank'>Google Charts</a>";
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
        this.dom.loadingBox.append("img").attr("class","status")
            .attr("src",this.dirRoot+"img/loading.gif")
            ;
        var hmmm=this.dom.loadingBox.append("div").attr("class","status_text");
        hmmm.append("span").text("Loading...");
        hmmm.append("div")
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
        if(this.showDataSource && this.source.gDocId===undefined){
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
    insertBrowserHeader: function(){
        var me = this;
        this.layoutHeader = this.root.append("div").attr("class", "kshf layout_header");

        var dom_filter_header=this.root.select(".layout_header").append("div")
                .attr("class","filter_header")
                .style("height",(this.line_height-3)+"px");

        dom_filter_header.append("span").attr("class","leftBlockAdjustSize")
            .attr("title","Drag to adjust panel width")
            .style("height",(this.line_height-4)+"px")
            .on("mousedown", function (d, i) {
                me.root.style('cursor','ew-resize');
                var mouseDown_x = d3.mouse(this.parentNode.parentNode)[0];
                var mouseDown_width = me.width_leftPanel_bar;
                me.root.on("mousemove", function() {
                    var mouseMove_x = d3.mouse(this)[0];
                    var mouseDif = mouseMove_x-mouseDown_x;
                    me.anim_barscale_duration = 0;
                    me.anim_layout_duration = 0;
                    me.setBarWidthLeftPanel(mouseDown_width+mouseDif);
                    me.updateLayout();
                    me.anim_layout_duration = me.anim_layout_duration_default;
                }).on("mouseup", function(){
                    if(sendLog) sendLog(CATID.Other,ACTID_OTHER.LeftPanelWidth,{panelWidth:me.width_leftPanel_bar});
                    me.root.style('cursor','default');
                    // unregister mouse-move callbacks
                    me.root.on("mousemove", null).on("mouseup", null);
                });
                d3.event.preventDefault();
            })
            .on("click",function(){
                d3.event.stopPropagation();
                d3.event.preventDefault();
            });    

        var left_align = dom_filter_header.append("span")
            .attr("class","left_align")
            .style("width",this.categoryTextWidth+"px");

        left_align.append("span").attr("class","filters_text").text("Filters:"); //↓
        // insert clear all option
        var s= left_align.append("span")
            .attr("class","filter-block-clear")
            .attr("filtered_row","false")
            .text("Remove all")
            .on("click",function(){ me.clearAllFilters(); })
            ;
        s.append("div")
            .attr("class","chartClearFilterButton allFilter")
            .attr("title","Remove all")
            .text("x")
            ;
        dom_filter_header.append("span")
            .attr("class","barChartMainInfo")
            .text(this.primItemCatValue===null?"⇒Item Count ":("⇒Total "+this.primItemCatValue))//⟾
            .append("span")
            .attr("class","refreshbarscales")
            .attr("width","13")
            .on("click",function(){
                me.clearAllFilters();
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearAll,me.getFilteringState());
            })
            .append("svg")
            .attr("viewBox","0 -256 1792 1792")
            .attr("width","13px")
            .attr("height","100%")
            .append("g")
                .attr("transform","matrix(1,0,0,-1,121.49153,1270.2373)")
                .append("path")
                    .style("fill","currentColor")
                    .attr("d",
                        "m 1511,480 q 0,-5 -1,-7 Q 1446,205 1242,38.5 1038,-128 764,-128 618,-128 481.5,-73 345,-18 238,84 L 109,-45 Q 90,-64 64,-64 38,-64 19,-45 0,-26 0,0 v 448 q 0,26 19,45 19,19 45,19 h 448 q 26,0 45,-19 19,-19 19,-45 0,-26 -19,-45 L 420,266 q 71,-66 161,-102 90,-36 187,-36 134,0 250,65 116,65 186,179 11,17 53,117 8,23 30,23 h 192 q 13,0 22.5,-9.5 9.5,-9.5 9.5,-22.5 z m 25,800 V 832 q 0,-26 -19,-45 -19,-19 -45,-19 h -448 q -26,0 -45,19 -19,19 -19,45 0,26 19,45 l 138,138 Q 969,1152 768,1152 634,1152 518,1087 402,1022 332,908 321,891 279,791 271,768 249,768 H 50 Q 37,768 27.5,777.5 18,787 18,800 v 7 q 65,268 270,434.5 205,166.5 480,166.5 146,0 284,-55.5 138,-55.5 245,-156.5 l 130,129 q 19,19 45,19 26,0 45,-19 19,-19 19,-45 z"
                        );

        // Info & Credits
        this.layoutHeader
            .append("div")
            .attr("title","Show Info & Credits")
            .attr("class","credits")
            .on("click",function(){
                me.showInfoBox();
            })
            .text("i");

        // TODO: implement popup for file-based resources
        if(this.showDataSource !== false){
            this.layoutHeader
              .append("div")
                  .style("float","right")
                  .style("margin","2px")
                .on("click",function(){
                    if(me.source.gdocId){
                        window.open("https://docs.google.com/spreadsheet/ccc?key="+me.source.gdocId,"_blank");
                    } else {
                        me.layout_infobox.style("display","block");
                        me.layout_infobox.style("display","block");
                    }
                    if(sendLog) sendLog(CATID.Other,ACTID_OTHER.DataSource);
                })
              .append("img").attr("class","datasource")
                .attr("title","Open Data Source")
                .attr("src",this.dirRoot+"img/datasource.png")
                ;
            }
        this.layoutHeader.append("span").attr("class","title").text(this.chartTitle);
    },
    showInfoBox: function(){
        if(sendLog) sendLog(CATID.Other,ACTID_OTHER.InfoButton);
        this.layout_infobox.style("display","block");
        this.layout_infobox.style("display","block");
    },
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
            if(this.source.gdocId){
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
            if(response.isError()) {
                this.layout_infobox.select("div.status_text span")
                    .text("Cannot load data");
                this.layout_infobox.select("img")
                    .attr("src",me.dirRoot+"img/alert.png")
                    .style("height","40px");
                this.layout_infobox.select("div.status_text div")
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
                arr[r] = new kshf.Item(c,idIndex,sheet.primary);
                arr[r].browser = me;
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
                        var item=new kshf.Item(c,idIndex,sheet.primary)
                        item.browser = me;
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
                arr.push(new kshf.Item(c,idIndex,sheet.primary));
            }
        });
        this.finishDataLoad(sheet,arr);
    },
    /** createTableFromTable */
    createTableFromTable: function(srcData, dstTableName, mapFunc){
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
                        var item = new kshf.Item([uniqueID++,v2],0);
                        item.browser = me;
                        dstTable_Id[v2] = item;
                        dstTable.push(item);
                    }   
                });
            } else {
                if(!dstTable_Id[v]){
                    var item = new kshf.Item([uniqueID++,v],0);
                    item.browser = me;
                    dstTable_Id[v] = item;
                    dstTable.push(item);
                }   
            }
        });
    },
    /** finishDataLoad */
    finishDataLoad: function(sheet,arr) {
        kshf.dt[sheet.tableName] = arr;
        if(sheet.primary){
            this.items = arr;
            this.itemsSelectedCt = arr.length;
        }
        var id_table = {};
        arr.forEach(function(r){id_table[r.id()] = r;});
        kshf.dt_id[sheet.tableName] = id_table;
        this.incrementLoadedSheetCount();
    },
    /** incrementLoadedSheetCount */
    incrementLoadedSheetCount: function(){
        var me=this;
        this.source.loadedTableCount++;
        this.layout_infobox.select("div.status_text div")
            .text("("+this.source.loadedTableCount+"/"+this.source.sheets.length+")");
            // finish loading
        if(this.source.loadedTableCount===this.source.sheets.length) {
            // update primary item stuff if necessary
            var mainTable = kshf.dt[this.primaryTableName];
            var colId = kshf.dt_ColNames[this.primaryTableName][this.primItemCatValue];

            if(typeof this.primItemCatValue =='string'){
                mainTable.forEach(function(d){d.barCount=d.data[colId];});
            }

            this.layout_infobox.select("div.status_text span")
                .text("Creating Keshif browser");
            this.layout_infobox.select("div.status_text div")
                .text("");
            window.setTimeout(function(){ me.loadCharts(); }, 50);
        }
    },
    /** loadCharts */
    loadCharts: function(){
        var me=this;
        if(this.loadedCb!==undefined) this.loadedCb();

        if(this.chartDefs===undefined){
            this.chartDefs = [];
            var colNames = kshf.dt_ColNames_Arr[this.primaryTableName];
            colNames.forEach(function(colName){
                if(colName===this.source.sheets[0].id) return;
                if(this.skipFacet[colName]===true) return;
                if(colName[0]==="*") return;
                this.chartDefs.push({facetTitle: colName});
            },this);
        }
        // TODO: Find the first column that has a date value, set it the time component of first chart
        this.chartDefs.forEach(function(param){ me.addBarChart(param); })
        this.charts.forEach(function(chart){ chart.init_DOM(); });
        this.listDisplay = new kshf.List(this,this.listDef,this.layoutRight);
        this.loaded = true;
        this.updateLayout();
        this.update();

        // hide infobox
        this.layout_infobox.style("display","none");
        this.dom.loadingBox.style("display","none");

        if(this.readyCb!==undefined) this.readyCb();
    },
    /** addBarChart */
    addBarChart: function(options){
        options.layout = (options.timeTitle!==undefined)?this.layoutTop:this.layoutLeft;
        if(options.catTableName===undefined){
            options.catTableName = this.primaryTableName;
            options.generateRows = true;
        }
        if(options.sortingOpts===undefined) options.sortingOpts = [{}];
        options.rowTextWidth = this.categoryTextWidth;
        this.charts.push(new kshf.BarChart(this,options));
    },
    /** columnAccessFunc */
    columnAccessFunc: function(columnName){
        var mainTableName = this.primaryTableName;
        var colId = kshf.dt_ColNames[mainTableName][columnName];
        return function(d){ return d.data[colId]; }
    },
    /** set x offset to display active number of items */
    getRowLabelOffset: function(){
        if(!this._labelXOffset){
            var maxTotalCount = d3.max(this.charts, function(chart){ 
                return chart.getMaxBarValueMaxPerAttrib();
            });
            this._labelXOffset = 12;
            var digits = 1;
            while(maxTotalCount>9){
                digits++
                maxTotalCount = Math.floor(maxTotalCount/10);
            }
            if(digits>4) digits = 4;
            this._labelXOffset += digits*6;
        }
        return this._labelXOffset;
    },
    /** includes label + number */
    getRowTotalTextWidth: function(){
        return this.categoryTextWidth + this.getRowLabelOffset();
    },
    /** domHeight */
    domHeight: function(){
        return parseInt(d3.select(this.domID).style("height"));
    },
    /** domWidth */
    domWidth: function(){
        return parseInt(d3.select(this.domID).style("width"));
    },
    /** filterFacetAttribute */
    filterFacetAttribute: function(chartId, itemId){
        var chart = this.charts[chartId];
        chart.filterAttrib(chart.getAttribs()[itemId]);
    },
    /** clearAllFilters */
    clearAllFilters: function(){
        this.charts.forEach(function(chart){chart.clearAllFilters();});
        this.update();
    },
    /** update */
    update: function () {
        var me=this;
        var filteredCount=0;

        // if running for the first time, do stuff
        if(this.firsttimeupdate === undefined){
            this.items.forEach(function(item){item.updateSelected();});
            this.firsttimeupdate = true; 
        }

        this.anim_barscale_duration = this.anim_barscale_duration_default;

        if(this.listDisplay){
            this.listDisplay.updateAfterFiltering();
            // TODO: update filteredCount....
            filteredCount = this.listDisplay.filteringItem!==null?1:0;
        }

        // update each widget within
        this.charts.forEach(function(chart){
            chart.refreshUI();
            filteredCount += chart.getFilteredCount();
        });

        setTimeout( function(){ me.updateLayout_Height(); }, 500);

        // "clear all" filter button : header
        this.root.select(".filter-block-clear").style("display",(filteredCount>0)?"inline-block":"none");
        // List thing...
        this.root.select("span.filter-blocks").style("display",(filteredCount>0)?"inline-block":"none");

        if(this.updateCb) this.updateCb();
    },
    /** updateLayout_Height */
    updateLayout_Height: function(){
        var chartHeaderHeight = 22;

        var divHeight = this.domHeight();
        if(this.chartTitle!==undefined){
            divHeight-=chartHeaderHeight;
        }

        this.layoutBackground.style("height",divHeight+"px");

        this.divWidth = this.domWidth();

        var divLineCount = Math.floor(divHeight/this.line_height);
        
        // number of barcharts, and initialize all charts as not processed yet
        var barChartCount = 0;
        var chartProcessed = [];
        var procBarCharts=0;
        var procBarChartsOld=-1;

        this.charts.forEach(function(chart){
            if(chart.type==='barChart'){ barChartCount++; }
            chartProcessed.push(false);
        })
        
        var divLineRem = divLineCount;
        var usedLines = 0;
        var remHeight = divHeight;

        // timeline first ******************
        var c2=this.charts[0];
        if(c2.type==='scatterplot'){
            // uncollapse scatterplot only if total chart height is more than 15 rows
            if(divLineRem>15){
                var targetScatterplotHeight = Math.ceil(divLineRem/4);
                c2.setRowCount_VisibleAttribs(targetScatterplotHeight-c2.rowCount_Header()-1);

                var splotHeight=c2.rowCount_Total_Right();
                divLineRem-= splotHeight;
                remHeight -= this.line_height*splotHeight;
                chartProcessed[0]=true;
            } else { 
                c2.collapsedTime = true;
                divLineRem--;
                remHeight -= this.line_height*1;
                // chartProcessed[0]=true; // categories are not processed
            }
        }

        // TODO: list item header is assumed to be 3 rows, but it may dynamically change!
        // get height of 
        var hhhh=parseInt(this.root.select(".listHeader").style("height"));

        this.root.select(".listItemGroup")
//            .transition().duration(this.anim_layout_duration)
            .style("height",(remHeight-hhhh-15)+"px")
            ;

        // *********************************************************************************
        // left panel ***********************************************************************
        divLineRem = divLineCount;
        this.charts.forEach(function(chart,i){
            if(chart.type==='scatterplot' && chartProcessed[i]===true){
                divLineRem-=chart.rowCount_Total();
            }
        });

        var finalPass = false;
        while(procBarCharts<barChartCount){
            procBarChartsOld = procBarCharts;
            var targetRowCount = Math.floor(divLineRem/(barChartCount-procBarCharts));
            this.charts.forEach(function(chart,i){
                if(chartProcessed[i]) return;
                if(divLineRem<chart.rowCount_MinTotal()){
                    chart.divRoot.style("display","none");
                    chartProcessed[i] = true;
                    procBarCharts++;
                    chart.hidden = true;
                    return;
                } 
                if(chart.collapsedTime){
                    ; //
                } else if(chart.options.catDispCountFix){
                    chart.setRowCount_VisibleAttribs(chart.options.catDispCountFix);
                } else if(chart.rowCount_MaxTotal()<=targetRowCount){
                    // you say you have 10 rows available, but I only needed 5. Thanks,
                    chart.setRowCount_VisibleAttribs(chart.attribCount_Active);
                } else if(finalPass){
                    chart.setRowCount_VisibleAttribs(targetRowCount-chart.rowCount_Header()-1);
                } else {
                    return;
                }
                if(chart.hidden===undefined || chart.hidden===true){
                    chart.hidden=false;
                    chart.divRoot.style("display","block");
                }
                divLineRem-=chart.rowCount_Total();
                chartProcessed[i] = true;
                procBarCharts++;
            });
            finalPass = procBarChartsOld===procBarCharts;
        }

        // there may be some empty lines remaining, try to give it back to the filters
        var allDone = false;
        while(divLineRem>0 && !allDone){
            allDone = true;
            this.charts.every(function(chart){
                if(chart.hidden) return true;
                if(chart.collapsed) return true;
                if(chart.allAttribsVisible()) return true;
                if(chart.options.catDispCountFix!==undefined) return true;
                if(chart.type==='scatterplot' && chart.collapsedTime===false) return true;
                var tmp=divLineRem;
                divLineRem+=chart.rowCount_Total();
                chart.setRowCount_VisibleAttribs(chart.rowCount_Visible+1);
                divLineRem-=chart.rowCount_Total();
                if(tmp!==divLineRem) allDone=false;
                return divLineRem>0;
            });
        }

        this.charts.forEach(function(chart){
            chart.refreshVisibleAttribs(false);
        });

        if(c2.type==='scatterplot'){
            // adjust layoutRight vertical position
            this.layoutRight
                .transition().duration(this.anim_layout_duration)
                .style("top", (c2.rowCount_Total_Right()*this.line_height)+"px");
        }

        this.layoutLeft
            .transition().duration(this.anim_layout_duration)
            .style("top",(c2.type==='scatterplot'?(c2.rowCount_Total()*this.line_height):0)+"px");
    },
    updateLayout: function(){
        if(this.loaded!==true) return;

        this.divWidth = this.domWidth();

        this.anim_barscale_duration = this.anim_barscale_duration_default;
        var initBarChartWidth = this.width_leftPanel_bar;
        if(this.width_leftPanel_bar===undefined){
            if(this.barChartWidth===undefined) {
                initBarChartWidth = Math.floor((this.divWidth-this.categoryTextWidth)/11);
            } else {
                initBarChartWidth= this.barChartWidth;
            }
        } else {
            if(this.barChartWidth!==undefined) {
                initBarChartWidth= this.barChartWidth;
            }
        }

        this.anim_layout_duration = 0;
        this.anim_barscale_duration = 0;

        this.setHideBarAxis(initBarChartWidth);

        // HEIGHT
        this.updateLayout_Height();

        // WIDTH
        this.setBarWidthLeftPanel(initBarChartWidth);
        this.updateAllTheWidth();

        this.anim_layout_duration = this.anim_layout_duration_default;
    },
    /** Not explicitly called, you can call this maunally to change the text width size after the browser is created */
    setCategoryTextWidth: function(w){
        this.categoryTextWidth = w;
        this.charts.forEach(function(chart){
            if(chart.type==='barChart' || chart.type==='scatterplot'){
                chart.options.rowTextWidth = w;
                chart.refreshTextWidth(w);
                chart.updateBarWidth();
            }
        });
        this.updateAllTheWidth();
    },
    setHideBarAxis: function(v){
        if(v>200) {
            this.hideBars = false;
            this.hideBarAxis = false;
        } else if(v>45){
            this.hideBars = false;
            this.hideBarAxis = false;
        } else if(v>10){
            this.hideBars = false;
            this.hideBarAxis = true;
        } else {
            this.hideBars = true;
            this.hideBarAxis = true;
            v = 0; 
        }
        if(this.forceHideBarAxis===true){
            this.hideBarAxis = true;
        }
        this.width_leftPanel_bar = v;

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
    },
    setBarWidthLeftPanel: function(v){
        this.setHideBarAxis(v);
        if(this.barMaxWidth===this.width_leftPanel_bar) return;
        this.barMaxWidth = this.width_leftPanel_bar;
        this.charts.forEach(function(chart){
            chart.updateBarAxisScale();
            chart.refreshWidth_Bars_Active();
            chart.refreshUIWidth();
        });
    },
    fullWidthResultSet: function(){
        return this.charts.length==1 && this.charts[0].type==='scatterplot';
    },
    updateAllTheWidth: function(v){
        this.width_leftPanel_total = this.getRowTotalTextWidth()+this.width_leftPanel_bar+this.scrollWidth+this.scrollPadding+2;
        var width_rightPanel_total = this.divWidth-this.width_leftPanel_total-this.scrollPadding-15; // 15 is padding

        this.layoutBackground.style("width",(this.width_leftPanel_total)+"px");
        this.root.select("div.filter_header").style("width",(this.width_leftPanel_total-8)+"px");

        this.layoutRight.style("left",(this.fullWidthResultSet()?0:this.width_leftPanel_total)+"px");

        this.charts.forEach(function(chart){
            if(chart.type==='scatterplot') chart.setTimeWidth(width_rightPanel_total);
        })

        // for some reason, on page load, this variable may be null. urgh.
        if(this.listDisplay){
            this.listDisplay.listDiv.style("width",
                ((this.fullWidthResultSet()==false)?width_rightPanel_total+9:this.divWidth-15)+"px");
            var contentWidth = (width_rightPanel_total-10);
            if(this.fullWidthResultSet()){
                contentWidth+=this.width_leftPanel_total;
            }
            this.listDisplay.updateContentWidth(contentWidth);
        }

        // update list
        this.maxTotalColWidth = width_rightPanel_total*this.listMaxColWidthMult;
    },
    /** getFilteringState */
    getFilteringState: function(facetTitle, itemInfo) {
        var r={
            results : this.itemsSelectedCt,
            textSrch: this.root.select("input.bigTextSearch").value
        };

        // facet title parameters
        if(facetTitle !== null) r.facet = facetTitle;

        r.filtered="";
        r.selected="";

        r.itemInfo = itemInfo;

        this.charts.forEach(function(chart,i){
            // include time range if time is filtered
            if(chart.type==='scatterplot'){
                if(chart.isFiltered_Time()) r.timeFltr = 1;
            }
            if(chart.attribCount_Selected!==0){
                if(r.filtered!=="") { r.filtered+="x"; r.selected+="x"; }
                r.filtered+=i;
                r.selected+=chart.attribCount_Selected;
            }
        });

        if(r.filtered==="") r.filtered=null;
        if(r.selected==="") r.selected=null;

        return r;
    },
    hideListItemDetails: function(item){
        if(sendLog) sendLog(CATID.ItemBased,ACTID_ITEM.Collapse,{itemID:item.id()});
        item.listItem.setAttribute('details', false);
        this.lastSelectedItem = undefined;
    },
    showListItemDetails: function(item){
        if(sendLog) sendLog(CATID.ItemBased,ACTID_ITEM.Show,{itemID:item.id()});
        item.listItem.setAttribute('details', true);
        if(this.listDisplay.detailsToggle==="One"){
            if(this.lastSelectedItem){
                this.lastSelectedItem.listItem.setAttribute("details",false);
            }
        }
        this.lastSelectedItem = item;
    }
};





// ***********************************************************************************************************
// BASE CHART
// ***********************************************************************************************************

/**
 * KESHIF BAR CHART
 * @constructor
 */
kshf.BarChart = function(kshf_, options){
    // Call the parent's constructor
    var me = this;
    this.id=++kshf.num_of_charts;
    this.parentKshf = kshf_;
    this.filterId = kshf_.maxFilterID++;
    this.options = options;

    this.selectType = "SelectOr";

    this.collapsed = false;
    if(options.collapsed===true) this.collapsed = true;

    this.scrollbar = {firstRow: 0};

    this.collapsedTime = false;
    if(options.collapsedTime===true) this.collapsedTime = true;
    this.sortDelay = 450; // ms
    var items = this.getKshfItems();

    options.sortingOpts.forEach(function(opt){
        // apply defaults
        if(opt.no_resort===undefined) {
            opt.no_resort=false;
        }
        if(opt.func===undefined){
            opt.func=kshf.Util.sortFunc_ActiveCount_TotalCount;
        }
        if(opt.inverse===undefined){
            opt.inverse=false;
        }
    });
    this.sortingOpt_Active = options.sortingOpts[0];
    this.showConfig = this.options.sortingOpts.length>1;

    if(!this.options.timeTitle){
        this.type = 'barChart';
        this.filterCount = 1;
    } else {
        this.type = 'scatterplot';
        this.filterCount = 2;
        this.getKshf().maxFilterID++;
    }

    this.init_shared(options);

    if(!this.options.timeTitle){
        this.options.display = {row_bar_line:false};
    } else {
        this.options.display = {row_bar_line:true};
        this.getKshfItems().forEach(function(item){
            item.timePos = me.options.timeItemMap(item);
        })
        this.timeData_dt = {
            min: d3.min(this.getKshfItems(), this.options.timeItemMap),
            max: d3.max(this.getKshfItems(), this.options.timeItemMap)};

        // calculate minYear and maxYear per cetegory, and use it for total.
        this.updateAttrib_TimeMinMax();
        this.getAttribs().forEach(function(attrib){
            attrib.xMin = attrib.xMin_Dyn;
            attrib.xMax = attrib.xMax_Dyn;
        });
        if(this.options.timeBarShow===undefined){
            this.options.timeBarShow = false;
        }
    }
};

kshf.BarChart.prototype = {
    /** getKshf */
    getKshf: function(){
        return this.parentKshf;
    },
    /** getKshfItems */
    getKshfItems: function(){
        return this.parentKshf.items;
    },
    /** rowCount_Header_Left */
    rowCount_Header_Left: function(){
        var r=1; // title
        if(this.showConfig) {r++;}
        if(this.showTextSearch){ r++;}
        return r;
    },
    /** rowCount_Header_Right */
    rowCount_Header_Right: function(){
        if(this.type==='scatterplot'){
            if(this.collapsedTime) return 1;
            return 2;
        }
        return 0;
    },
    /** rowCount_Header */
    rowCount_Header: function(){
        if(this.collapsed) return 1;
        return Math.max(this.rowCount_Header_Left(),this.rowCount_Header_Right());
    },
    /** rowCount_Total */
    rowCount_Total: function(){
        if(this.collapsed) return 1;
        // need 1 more row at the bottom is scrollbar is shown, or barInfoText is set
        var bottomRow=0;
        if(this.scrollbar.show || this.parentKshf.hideBarAxis===false) bottomRow=1;
        return this.rowCount_Header()+this.rowCount_Visible+bottomRow;
    },
    /** rowCount_Total_Right */
    rowCount_Total_Right: function(){
        if(this.type!=='scatterplot') return 0;
        if(this.collapsedTime===true || this.collapsed===true) return 1;
        return this.rowCount_Header_Right()+this.rowCount_Visible+2;
    },
    /** rowCount_MaxTotal */
    rowCount_MaxTotal: function(){
        return this.rowCount_Header()+this.attribCount_Active+1;
    },
    /** rowCount_MinTotal */
    rowCount_MinTotal: function(){
        return this.rowCount_Header()+Math.min(this.attribCount_Active,3)+1;
    },
    /** allAttribsVisble */
    allAttribsVisible: function(){
        return this.attribCount_Active===this.rowCount_Visible;
    },
    /** init_shared */
    init_shared: function(options){
    	// register
        var j,f;

        this.parentKshf.barMaxWidth = 0;
        this.options.timeMaxWidth=0;

        if(this.options.showNoneCat===undefined){
            this.options.showNoneCat = false;
        }
        if(this.options.removeInactiveAttrib===undefined){
            this.options.removeInactiveAttrib = true;
        }
        if(this.type==="scatterplot" && this.options.timeItemMap===undefined){
            this.options.timeItemMap = this.getKshf().columnAccessFunc(this.options.timeTitle);
        }
        if(this.options.catItemMap===undefined){
            this.options.catItemMap = this.getKshf().columnAccessFunc(this.options.facetTitle);
        } else if(typeof(this.options.catItemMap)==="string"){
            this.options.catItemMap = this.getKshf().columnAccessFunc(this.options.catItemMap);
        }

        // generate row table if necessary
        if(this.options.generateRows){
            this.catTableName = this.options.catTableName+"_h_"+this.id;
            this.getKshf().createTableFromTable(this.getKshfItems(),this.catTableName, this.options.catItemMap);
        } else {
            this.catTableName = this.options.catTableName;
        }

        if(this.options.catLabelText===undefined){
            // get the 2nd attribute as row text [1st is expected to be the id]
            options.catLabelText = function(typ){ return typ.data[1]; };
        }

        if(this.options.showNoneCat===true){
            // TODO: Check if a category named "None" exist in table
            var noneID = 1000;
            var newItem = new kshf.Item([noneID,"None"],0)
            newItem.browser = this.getKshf();
            kshf.dt[this.catTableName].push(newItem);
            kshf.dt_id[this.catTableName][noneID] = newItem;

            var _catLabelText = this.options.catLabelText;
            var _catTooltipText = this.options.catTooltipText;
            var _catItemMap = this.options.catItemMap;
            this.options.catLabelText = function(d){ 
                if(d.id()===noneID) return "None";
                return _catLabelText(d);
            };
            this.options.catTooltipText = function(d){ 
                if(d.id()===noneID) return "None";
                return _catTooltipText(d);
            };
            this.options.catItemMap = function(d){
                var r=_catItemMap(d);
                if(r===null) return noneID;
                if(r instanceof Array)
                    if(r.length===0) return noneID;
                return r;
            }
        }

        this.hasMultiValueItem = false;

        // BIG. Apply row map function
        var curDtId = this.getAttribs_wID();
        this.getKshfItems().forEach(function(item){
            // assume all filters pass
            for(j=0,f=this.filterId;j<this.filterCount;j++,f++){
                item.setFilter(f,true);
            }
            var toMap = this.options.catItemMap(item);
            if(toMap===undefined || toMap==="") { 
                toMap=null;
            } else if(toMap instanceof Array){
                // remove duplicate values in the array
                var found = {};
                toMap = toMap.filter(function(e){
                    if(found[e]===undefined){
                        found[e] = true;
                        return true;
                    }
                    return false;
                });
            }
            item.mappedData[this.filterId] = toMap;
            var itemList = [];
            if(toMap===null) { return; }
            if(toMap instanceof Array){
                this.hasMultiValueItem = true;
                toMap.forEach(function(a){
                    var m=curDtId[a];
                    if(m){
                        m.items.push(item);
                        m.activeItems++;
                        m.barValue+=item.barCount;
                        m.barValueMax+=item.barCount;
                        m.sortDirty = true;
                        itemList.push(m);
                    }
                });
            } else {
                var m=curDtId[toMap];
                m.items.push(item);
                m.activeItems++;
                m.barValue+=item.barCount;
                m.barValueMax+=item.barCount;
                m.sortDirty = true;
                itemList.push(curDtId[toMap]);
            }
            item.mappedRows.push(itemList);
        },this);

        // Modified internal dataMap function - Skip rows with0 active item count
        if(this.options.dataMap) {
            this._dataMap = function(d){
                if(d.items.length===0) return null; // auto remove empty attributes
                return options.dataMap(d);
            };
        } else {
            this._dataMap = function(d){
                if(d.items.length===0) return null; // auto remove empty attributes
                return d.id();
            };
        }

        this.updateAttribCount_Total();
        this.updateAttribCount_Active();
    	this.unselectAllAttribs();

        // text search is automatically enabled is num of rows is more than 20.
        // It is NOT dependent on number of displayed rows
        this.showTextSearch = (this.attribCount_Total>=20 && this.options.forceSearch!==false) ||
                               this.options.forceSearch===true;

        this.x_axis_active_filter = null;
    },
    /** updateAttribCount_Total */
    updateAttribCount_Total: function(){
        this.attribCount_Total = 0;
        this.getAttribs().forEach(function(d){
            if(this._dataMap(d)!==null) this.attribCount_Total++;
        },this);
    },
    /** updateAttribCount_Total */
    updateAttribCount_Active: function(){
        this.attribCount_Active = 0;
        this.getAttribs().forEach(function(d){
            if(this._dataMap(d)===null) return;
            if(this.isAttribVisible(d)===false) return;
            this.attribCount_Active++;
        },this);
    },
    /** getWidth_Total */
    getWidth_Total: function(){
        var kshf_ = this.getKshf();
        return this.getWidth_Left()+
            ((this.type==='scatterplot')?(
                this.options.timeMaxWidth+kshf_.sepWidth+
                  ((this.scrollbar.show)?(kshf_.scrollWidth+kshf_.scrollPadding):0)
                ):0);
    },
    /** getWidth_Left */
    getWidth_Left: function(){
        var kshf_ = this.getKshf();
        return kshf_.getRowTotalTextWidth() +
            kshf_.barMaxWidth +
            kshf_.scrollWidth + // assume scrollbar is on
            kshf_.scrollPadding
            +1;
    },
    /** refreshUIWidth */
    refreshUIWidth: function(){
        this.refreshScrollbarPos();

        var leftPanelWidth = this.getWidth_Left();
        var totalWidth = this.getWidth_Total();

        this.divRoot.style("width",totalWidth+"px");
        this.root.select("rect.chartBackground")
            .attr('width',totalWidth)
            ;
        this.divRoot.select("rect.clippingRect_2")
            .attr("x",leftPanelWidth+10)
            .attr("width",this.options.timeMaxWidth+7)
            ;
        this.divRoot.select(".headerGroup")
            .style('width',totalWidth+"px")
            ;
        this.root.select("rect.clippingRect")
            .attr("width",totalWidth)
            ;
        this.dom_headerGroup.select(".leftHeader")
//            .transition().duration(this.anim_barscale_duration)
            .style("width",leftPanelWidth+"px")
            ;
    },
    /** scrollItemCb */
    scrollItemCb: function(event){
        var delta = 0;
        if (!event) { event = window.event; }
        // normalize the delta
        if (event.wheelDelta) {
            // IE and Opera
            delta = event.wheelDelta / 60;
        } else if (event.detail) {
            // W3C
            delta = -event.detail / 2;
        }
        if(delta<-0.05) { 
            this.setScrollPosition(this.scrollbar.firstRow+1);
        }
        if(delta>0.05) { 
            this.setScrollPosition(this.scrollbar.firstRow-1);
        }
        if(event.preventDefault) { //disable default wheel action of scrolling page
            event.preventDefault();
        } else {
            return false;
        }
    },
    /** init_DOM */
    init_DOM: function(){
        var me = this;
        this.divRoot = this.options.layout
            .append("div").attr("class","kshfChart")
            .attr("removeInactiveAttrib",this.options.removeInactiveAttrib)
            .attr("filtered_row",false)
            ;

        this.dom_headerGroup = this.divRoot.append("div").attr("class","headerGroup");

    	this.root = this.divRoot
            .append("svg").attr("class","chart_root").attr("xmlns","http://www.w3.org/2000/svg");
        // to capture click/hover mouse events
        this.root.append("rect")
            .attr("class","chartBackground")
            .on("mousewheel",this.scrollItemCb.bind(this))
            .on("mousedown", function (d, i) { d3.event.preventDefault(); })
        ;

    	this.dom = {};
        
        if(this.type==="scatterplot"){
            if(this.options.timeDotConfig!==undefined){
                this.divRoot.attr("dotconfig",this.options.timeDotConfig);
            }
        }
        this.root.append("g").attr("class", "x_axis")
            .on("mousedown", function (d, i) { d3.event.preventDefault(); })
            ;
    	var barGroup_Top = this.root.append("g")
    		.attr("class","barGroup_Top")
    		.attr("clip-path","url(#kshf_chart_clippath_"+this.id+")")
            .attr("transform","translate(0,20)")
            ;
        if(this.type==='scatterplot') { 
            barGroup_Top.append("line")
                .attr("class","selectVertLine")
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("y1", -this.getKshf().line_height*1.5)
                ;
        }

    	var barGroup = barGroup_Top.append("g")
    		.attr("class","barGroup");
    	barGroup.selectAll("g.row")
            // removes attributes with no items
    		.data(this.getAttribs(), this._dataMap)
    	  .enter().append("g")
    		.attr("class", "row")
            .each(function(d){
                var mee=this;
                d.barChart = me;
                // Add this DOM to each item under cats
                d.items.forEach(function(dd){dd.mappedAttribs.push(mee);});
            })
    		;
        this.dom.g_row = this.root.selectAll('g.row');

        if(this.type==='scatterplot') { 
        	var timeAxisGroup = this.root.append("g").attr("class","timeAxisGroup")
        		.on("mousedown", function (d, i) { d3.event.preventDefault(); })
                ;
            timeAxisGroup.append("g").attr("class","tickGroup");
        }

        if(this.attribCount_Active===1){
            this.options.catBarScale = "scale_frequency";
        }

        this.insertHeader();

        this.insertScrollbar();

        this.insertAttribs();
        if(this.type==='scatterplot') { 
            this.insertTimeChartRows();
            this.insertTimeChartAxis_1();
        }
    },
    /** getAttribs */
    getAttribs: function(){
        return kshf.dt[this.catTableName];
    },
    /** getAttribs_wID */
    getAttribs_wID: function(){
        return kshf.dt_id[this.catTableName];
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
        var dataMapFunc = this._dataMap;
        return d3.max(this.getAttribs(), function(d){ 
            if(dataMapFunc(d)===null) { return null; }
            return d.barValue;
        });
    },
    /** returns the maximum number of maximum items stored per row in chart data */
    getMaxBarValueMaxPerAttrib: function(){
        var dataMapFunc = this._dataMap;
        return d3.max(this.getAttribs(), function(d){ 
            if(dataMapFunc(d)===null) { return null; }
            return d.barValueMax;
        });
    },
    /** refreshUI */
    refreshUI: function(){
        this.updateBarAxisScale();
    	this.refreshActiveItemCount();
        this.refreshBarHeight();
        if(this.type==="scatterplot"){
            this.refreshTimeChartTooltip();
            this.refreshTimeChartBarDisplay();
            this.refreshTimeChartDotConfig();
        }
        this.refreshWidth_Bars_Active();
        if(this.options.removeInactiveAttrib){
            this.updateAttribCount_Active();
        }
    	this.updateSorting();
    },
    /** updateAttrib_TimeMinMax */
    updateAttrib_TimeMinMax: function(){
        var specFunc = function(item){
            if(!item.wanted) return undefined; // unwanted items have no timePos
            return item.timePos;
        };
        this.getAttribs().forEach(function(row){
            if(row.sortDirty===false) return;
            row.xMin_Dyn = d3.min(row.items, specFunc);
            row.xMax_Dyn = d3.max(row.items, specFunc);
        });
    },
    /** refreshActiveItemCount */
    refreshActiveItemCount: function(){
        var me = this;
        this.dom.item_count.text(function(attrib){
            return "("+kshf.Util.formatForItemCount(attrib.barValue)+")"; 
        });
        this.dom.g_row.each(function(attrib){ 
            this.setAttribute("noitems",!me.isAttribSelectable(attrib));
        });
        this.dom.row_title.text(function(attrib){
            return (attrib.activeItems===0?"No":attrib.activeItems)+" selected "+me.getKshf().itemName+" "+
                (me.options.textFilter?me.options.textFilter:("- "+me.options.facetTitle+":"))+" "+
                ((me.options.catTooltipText)?me.options.catTooltipText(attrib):me.options.catLabelText(attrib));
        });
    },
    /** refreshBarHeight */
    refreshBarHeight: function(){
    	// Non-selected rows have shorted bar height.
    	this.dom.allRowBars
    		.attr("height", function(attrib){ return (attrib.activeItems>0)?12:6; })
    		.attr("y",function(attrib){ return (attrib.activeItems>0)?3:6; });
        if(this.dom.timeBar){
            this.dom.timeBar
        		.attr("height", function(attrib){ return (attrib.activeItems>0)?12:6; })
        		.attr("y",function(attrib){ return (attrib.activeItems>0)?3:6; });
        }
    	this.dom.bar_active
    		.attr("height", function(attrib){ return (attrib.activeItems>0)?10:4; })
    		.attr("y",function(attrib){ return (attrib.activeItems>0)?4:7; });
    },
    /** refreshWidth_Bars_Active */
    refreshWidth_Bars_Active: function(){
    	var me=this;
    	this.dom.bar_active
            .transition().duration(this.getKshf().anim_barscale_duration)
    		.attr("width", function(attrib){ return me.catBarAxisScale(attrib.barValue);})
            ;
    },
    /** Applies alternating color for bar helper lines */
    refreshBarLineHelper: function(){
    	this.dom.row_bar_line.attr("stroke", function(attrib,i) {
    		return (attrib.orderIndex%2===1)?"rgb(200,200,200)":"rgb(80,80,80)";
    	});
    },
    /** getFilteredCount */
    getFilteredCount: function(){
        var r=this.isFiltered_Attrib();
        if(this.type==="scatterplot") r+=this.isFiltered_Time();
        return r;
    },
    /** isFiltered_Attrib */
    isFiltered_Attrib: function(state){
        return this.attribCount_Selected!==0;
    },
    /** isFiltered_Time */
    isFiltered_Time: function(){
    	return this.timeFilter_ms.min!==this.timeRange_ms.min ||
    	       this.timeFilter_ms.max!==this.timeRange_ms.max ;
    },
    /** unselectAllAttribs */
    unselectAllAttribs: function(){
        this.getAttribs().forEach(function(attrib){ attrib.selected=false; });
    	this.attribCount_Selected = 0;
    },
    /** clearAllFilters */
    clearAllFilters: function(){
        this.clearAttribFilter(false);
        if(this.type==='scatterplot') this.clearTimeFilter(false);
    },
    /** clearAttribFilter */
    clearAttribFilter: function(toUpdate){
        if(this.attribCount_Selected===0) return;
    	this.unselectAllAttribs();
        this.updateSelected_SelectOnly();
        this.refreshAttribFilter();
        if(this.dom.showTextSearch) this.dom.showTextSearch[0][0].value="";
        if(toUpdate!==false) this.getKshf().update();
    },
    /** clearTimeFilter */
    clearTimeFilter: function(toUpdate){
        this.resetTimeFilter_ms();
        this.resetTimeZoom_ms();
        this.refreshTimechartLayout(toUpdate);
        this.yearSetXPos();
        this.updateItemFilterState_Time();
        if(toUpdate!==false) this.getKshf().update();
    },
    /** resetTimeFilter_ms */
    resetTimeFilter_ms: function(){
        this.timeFilter_ms= { min: this.timeRange_ms.min, max:this.timeRange_ms.max };
    },
    /** resetTimeZoom_ms */
    resetTimeZoom_ms: function(){
        this.timeZoom_ms = { min: this.timeRange_ms.min, max:this.timeRange_ms.max };
    },
    /** collapseAttribs */
    collapseAttribs: function(hide){
        this.collapsed = hide;
        if(sendLog) {
            if(hide===true) sendLog(CATID.FacetCollapse,ACTID_COLLAPSE.Collapse,{facet:this.options.facetTitle});
            else            sendLog(CATID.FacetCollapse,ACTID_COLLAPSE.Show,{facet:this.options.facetTitle});
        }
        this.refreshVisibleAttribs(true); // force update
        this.getKshf().updateLayout_Height();
    },
    /** collapseTime */
    collapseTime: function(hide){
        this.collapsedTime = hide;
        this.refreshVisibleAttribs(true); // force update
        this.getKshf().updateLayout_Height();
    },
    /** refreshTimeAxisPosition */
    refreshTimeAxisPosition: function(){
        var kshf_ = this.getKshf();
        var x = (this.parentKshf.barMaxWidth+kshf_.scrollPadding+kshf_.scrollWidth+kshf_.sepWidth+this.parentKshf.getRowTotalTextWidth());
        var y = (kshf_.line_height*this.rowCount_Visible+27);
        this.root.select("g.timeAxisGroup")
            .transition().duration(this.parentKshf.anim_layout_duration)
            .attr("transform","translate("+x+","+y+")");
    },
    /** insertHeader */
    insertHeader: function(){
    	var me = this;
        var rows_Left = this.rowCount_Header_Left();
        var rightHeader;

        if(this.type==="scatterplot"){
            rightHeader = this.dom_headerGroup.append("div").attr("class","rightHeader");
        }

        var leftHeader = this.dom_headerGroup.append("div").attr("class","leftHeader");
        leftHeader.append("div").attr("class","border_line");
        var topRow_background = leftHeader.append("div").attr("class","chartFirstLineBackground");
        leftHeader.append("div").attr("class","border_line");

        var topRow = topRow_background.append("div").attr("class","leftHeader_XX");

        topRow.append("span").attr("class", "header_label")
            .attr("title", this.attribCount_Total+" attributes")
            .html(this.options.facetTitle)
            .on("click",function(){ 
                if(me.collapsed) { me.collapseAttribs(false); }
            })
            ;
        topRow.append("span").attr("class","header_label_arrow")
            .attr("title","Show/Hide attributes").text("▼")
            .on("click",function(){ me.collapseAttribs(!me.collapsed); })
            ;
        topRow.append("svg").attr("class", "settingButton")
            .attr("version","1.1")
            .attr("height","12px")
            .attr("width","12px")
            .attr("title","Settings")
            .attr("xml:space","preserve")
            .attr("viewBox","0 0 24 24")
            .on("click",function(d){
                me.showConfig = !me.showConfig;
                me.refreshVisibleAttribs(true); // force update
                me.parentKshf.updateLayout();
            })
        .append("path")
            .attr("clip-rule","evenodd")
            .attr("d","M21.521,10.146c-0.41-0.059-0.846-0.428-0.973-0.82l-0.609-1.481  c-0.191-0.365-0.146-0.935,0.1-1.264l0.99-1.318c0.246-0.33,0.227-0.854-0.047-1.162l-1.084-1.086  c-0.309-0.272-0.832-0.293-1.164-0.045l-1.316,0.988c-0.33,0.248-0.898,0.293-1.264,0.101l-1.48-0.609  c-0.395-0.126-0.764-0.562-0.82-0.971l-0.234-1.629c-0.057-0.409-0.441-0.778-0.85-0.822c0,0-0.255-0.026-0.77-0.026  c-0.514,0-0.769,0.026-0.769,0.026c-0.41,0.044-0.794,0.413-0.852,0.822l-0.233,1.629c-0.058,0.409-0.427,0.845-0.82,0.971  l-1.48,0.609C7.48,4.25,6.912,4.206,6.582,3.958L5.264,2.969c-0.33-0.248-0.854-0.228-1.163,0.045L3.017,4.1  C2.745,4.409,2.723,4.932,2.971,5.262l0.988,1.318C4.208,6.91,4.252,7.479,4.061,7.844L3.45,9.326  c-0.125,0.393-0.562,0.762-0.971,0.82L0.85,10.377c-0.408,0.059-0.777,0.442-0.82,0.853c0,0-0.027,0.255-0.027,0.77  s0.027,0.77,0.027,0.77c0.043,0.411,0.412,0.793,0.82,0.852l1.629,0.232c0.408,0.059,0.846,0.428,0.971,0.82l0.611,1.48  c0.191,0.365,0.146,0.936-0.102,1.264l-0.988,1.318c-0.248,0.33-0.308,0.779-0.132,0.994c0.175,0.217,0.677,0.752,0.678,0.754  s0.171,0.156,0.375,0.344s1.042,0.449,1.372,0.203l1.317-0.99c0.33-0.246,0.898-0.293,1.264-0.1l1.48,0.609  c0.394,0.125,0.763,0.562,0.82,0.971l0.233,1.629c0.058,0.408,0.441,0.779,0.852,0.822c0,0,0.255,0.027,0.769,0.027  c0.515,0,0.77-0.027,0.77-0.027c0.409-0.043,0.793-0.414,0.85-0.822l0.234-1.629c0.057-0.408,0.426-0.846,0.82-0.971l1.48-0.611  c0.365-0.191,0.934-0.146,1.264,0.102l1.318,0.99c0.332,0.246,0.854,0.227,1.164-0.047l1.082-1.084  c0.273-0.311,0.293-0.834,0.047-1.164l-0.99-1.318c-0.246-0.328-0.291-0.898-0.1-1.264l0.609-1.48  c0.127-0.393,0.562-0.762,0.973-0.82l1.627-0.232c0.41-0.059,0.779-0.441,0.822-0.852c0,0,0.027-0.255,0.027-0.77  s-0.027-0.77-0.027-0.77c-0.043-0.41-0.412-0.794-0.822-0.853L21.521,10.146z M12,15C10.343,15,9,13.656,9,12  C9,10.343,10.343,9,12,9c1.657,0,3,1.344,3,3C15,13.656,13.656,15,12,15z")
            .attr("fill-rule","evenodd")
        .append("title").text("Settings");

        topRow.append("div")
            .attr("class","chartClearFilterButton rowFilter alone")
            .attr("title","Remove filter")
    		.on("click", function(d,i){
                me.clearAttribFilter();
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnFacet,
                    me.getKshf().getFilteringState(me.options.facetTitle));
            })
            .text('x');
        if(this.type==="scatterplot"){
            rightHeader.append("div").attr("class","border_line");

            var poff = rightHeader.append("div").attr("class","chartFirstLineBackground chartFirstLineBackgroundRight");

            poff.append("span").attr("class","header_label_arrow")
                .attr("title","Show/Hide categories").text("▼")
                .on("click",function(){ me.collapseTime(!me.collapsedTime); })
                ;
            poff.append("span")
                .attr("class", "header_label")
                .text(this.options.timeTitle)
                .on("click",function(){ if(me.collapsedTime) { me.collapseTime(false); } })
                ;
            poff.append("div")
                .attr("class","chartClearFilterButton timeFilter alone")
                .attr("title","Remove filter")
                .on("click", function(d,i){ 
                    me.clearTimeFilter();
                    if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnFacet, 
                        {facet:me.options.timeTitle,results:me.getKshf().itemsSelectedCt});
                })
                .text('x');

            rightHeader.append("div").attr("class","border_line");

            var config_zoom = rightHeader.append("div").attr("class","config_zoom");

            config_zoom.append("span")
                .attr("class","zoom_button zoom_in")
                .attr("disabled","true")
                .text("⇥ Zoom in ⇤")
                .on("mouseover",function(e){ d3.select(this.parentNode).attr("zoom","in");  })
                .on("mouseout",function(){  d3.select(this.parentNode).attr("zoom","none");  })
                .on("click",function(d){
                    me.timeZoom_ms.min = me.timeFilter_ms.min;
                    me.timeZoom_ms.max = me.timeFilter_ms.max;
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
                .on("mouseover",function(e){ d3.select(this.parentNode).attr("zoom","out");  })
                .on("mouseout",function(){  d3.select(this.parentNode).attr("zoom","none");  })
                .on("click",function(){
                    me.resetTimeZoom_ms();
                    me.useCurrentTimeMinMax = true;
                    me.refreshTimechartLayout(true);
                    me.useCurrentTimeMinMax = undefined;
                    me.divRoot.select(".zoom_out").attr("disabled","true");
                })
                ;
        }

        var header_belowFirstRow = leftHeader.append("div").attr("class","header_belowFirstRow");

        var xxx=leftHeader.append("svg")
            .attr("class", "resort_button")
            .attr("version","1.1")
            .attr("height","15px")
            .attr("width","15px")
            .attr("title","Settings")
            .attr("xml:space","preserve")
            .attr("viewBox","0 0 2000 1000")
            .style("left",(this.parentKshf.categoryTextWidth+5)+"px")
            .on("click",function(d){
                me.sortDelay = 0; 
                me.updateSorting();
                if(sendLog) sendLog(CATID.FacetSort,ACTID_SORT.ResortButton,{facet:me.options.facetTitle});
            })
            ;
        xxx.append("path")
            .attr("d",
                "M736 96q0 -12 -10 -24l-319 -319q-10 -9 -23 -9q-12 0 -23 9l-320 320q-15 16 -7 35q8 20 30 20h192v1376q0 14 9 23t23 9h192q14 0 23 -9t9 -23v-1376h192q14 0 23 -9t9 -23zM1792 -32v-192q0 -14 -9 -23t-23 -9h-832q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h832 q14 0 23 -9t9 -23zM1600 480v-192q0 -14 -9 -23t-23 -9h-640q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h640q14 0 23 -9t9 -23zM1408 992v-192q0 -14 -9 -23t-23 -9h-448q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h448q14 0 23 -9t9 -23zM1216 1504v-192q0 -14 -9 -23t-23 -9h-256 q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h256q14 0 23 -9t9 -23z")
            ;
        xxx.append("title").text("Move selected rows to top & re-order");

        // ************************************************************************************
        // ****** CONFIG LINE *****************************************************************

        if(this.showTextSearch){
            var textSearchRowDOM = header_belowFirstRow.append("div").attr("class","leftHeader_XX")
                .style("white-space","nowrap");
            this.dom.showTextSearch= textSearchRowDOM.append("input")
                .attr("type","text")
                .attr("class","chartRowLabelSearch")
                .attr("placeholder","Search: "+this.options.facetTitle.toLowerCase())
                .on("input",function(){
                    if(this.timer){
                        clearTimeout(this.timer);
                        this.timer = null;
                    }
                    var x = this;
                    this.timer = setTimeout( function(){
                        var v=x.value.toLowerCase();
                        if(v===""){
                            me.unselectAllAttribs();
                        } else {
                            var numSelected=0;
                            me.getAttribs().forEach(function(attrib){
                                if(me.options.catLabelText(attrib).toString().toLowerCase().indexOf(v)!==-1){
                                    attrib.selected = true;
                                } else {
                                    if(me.options.catTooltipText){
                                        attrib.selected = me.options.catTooltipText(attrib).toLowerCase().indexOf(v)!==-1;
                                    } else{
                                        attrib.selected = false;
                                    }
                                }
                                numSelected+=attrib.selected;
                            });
                            me.attribCount_Selected = numSelected;
                        }
                        // convert state to or selection
                        me.selectType = "SelectOr";
                        me.updateSelected_All();
                        me.refreshAttribFilter();

                        me.getKshf().update();

                        if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.CatTextSearch,me.getKshf().getFilteringState(me.options.facetTitle));
                    }, 750);
                })
                .on("blur",function(){
                    d3.event.stopPropagation();
                    d3.event.preventDefault();
                })
                ;
            textSearchRowDOM.append("svg")
                .attr("class","chartRowLabelSearch")
                .attr("width","13")
                .attr("height","12")
                .attr("viewBox","0 0 491.237793 452.9882813")
                .attr("xmlns","http://www.w3.org/2000/svg")
                .html(
                  '<g fill-rule="nonzero" clip-rule="nonzero" fill="#0F238C" stroke="#cb5454" stroke-miterlimit="4">'+
                   '<g fill-rule="evenodd" clip-rule="evenodd">'+
                    '<path fill="#cb5454" id="path3472" d="m328.087402,256.780273c-5.591797,8.171875 -13.280273,17.080078 -22.191406,25.296875c-9.685547,8.931641 -20.244141,16.550781 -27.433594,20.463867l163.125977,150.447266l49.649414,-45.783203l-163.150391,-150.424805z"/>'+
                    '<path fill="#cb5454" id="path3474" d="m283.82959,45.058109c-65.175781,-60.07764 -169.791023,-60.07764 -234.966309,0c-65.150881,60.100582 -65.150881,156.570309 0,216.671383c65.175285,60.100586 169.790527,60.100586 234.966309,0c65.175781,-60.101074 65.175781,-156.570801 0,-216.671383zm-34.198242,31.535152c-46.204102,-42.606934 -120.390625,-42.606934 -166.570305,0c-46.204594,42.583496 -46.204594,110.994141 0,153.601074c46.17968,42.606445 120.366203,42.606445 166.570305,0c46.205078,-42.606934 46.205078,-111.017578 0,-153.601074z"/>'+
                   '</g>'+
                  '</g>')
                ;
        }

        var configGroup = header_belowFirstRow.append("div")
            .attr("class","configGroup leftHeader_XX")
            .attr("shown","order")
            .style("height",this.parentKshf.line_height+"px")
            ;

        if(this.showConfig) {
            var sortGr = configGroup.append("span").attr("class","sortOptionSelectGroup");
            sortGr.append("select").attr("class","optionSelect")
                .on("change", function(){
                    if(sendLog) {
                        sendLog(CATID.FacetSort,ACTID_SORT.ChangeSortFunc,
                            {facet:me.options.facetTitle, funcID:this.selectedIndex});
                    }
                    me.sortingOpt_Active = me.options.sortingOpts[this.selectedIndex];
                    me.sortDelay = 0;
                    me.updateSorting.call(me);
                })
            .selectAll("input.sort_label")
                .data(this.options.sortingOpts)
              .enter().append("option")
                .attr("class", "sort_label")
                .text(function(d){ return d.name; })
                .attr(function(d){ return d.name; })
                ;
            sortGr.append("span").attr("class","optionSelect_Label").text("Order by");
        }



    },
    /** refreshTimechartLayout */
    refreshTimechartLayout: function(toUpdate){
        this.setTimeTicks();
        this.updateTimeChartBarsDots();
        this.refreshTimeChartBarDisplay();
        this.insertTimeTicks();
        this.insertTimeChartAxis();
        if(toUpdate===true) this.refreshTimeChartDotConfig();
    },
    /** setTimeWidth */
    setTimeWidth: function(w){
        this.options.timeMaxWidth = w;
        if(this.scrollbar.show===true){
            this.options.timeMaxWidth -= this.getKshf().scrollPadding + this.getKshf().scrollWidth;
        }

        this.refreshTimechartLayout(true);
        this.refreshUIWidth();
        this.dom_headerGroup.select(".rightHeader").style("width",(w)+"px");
        this.refreshTimeAxisPosition();
        this.updateRowBarLineWidth();
    },
    /** refreshTimeChartDotConfig */
    refreshTimeChartDotConfig: function(){
        if(this.type!=='scatterplot') return;
        if(this.options.timeDotConfig !== undefined) return;
        if(this.skipUpdateTimeChartDotConfig === true) return;
        var me = this;

        var totalActiveTime_pixLength = 0;

        this.dom.g_row.each(function(attrib) {
            if(me.attribCount_Selected!==0 && !attrib.selected) return;
            if(attrib.xMax_Dyn===undefined || attrib.xMin_Dyn===undefined) return;
            totalActiveTime_pixLength+=me.timeScale(attrib.xMax_Dyn) - me.timeScale(attrib.xMin_Dyn);
        });

        var timeFilterDiff = this.timeFilter_ms.max-this.timeFilter_ms.min;
        var timeZoomDiff = this.timeZoom_ms.max-this.timeZoom_ms.min;

        // how much width of time does each dot take?
        var dotPixelWidth = 12;
    //        var timeFilterWidth = this.options.timeMaxWidth*(totalActiveTimeRange_ms/timeZoomDiff);
    //        var maxDotsPerRow = timeFilterWidth/dotPixelWidth;
        var maxDots = totalActiveTime_pixLength/dotPixelWidth;
    //        var dotTimeWidth = (this.options.timeMaxWidth/10) dots can represent
    //        x*dotTimeWidth = this.options.timeMaxWidth;
        
        var numOfItems = this.parentKshf.itemsSelectedCt;

        // some metric on number of dots that can fit inside. The bigger, the more items an be shown without overlap
    //        var mmm = *(totalActiveTime_ms/timeZoomDiff)/10;

        if(maxDots>numOfItems*3 || totalActiveTime_pixLength===0){
            this.dom.timeDots.style("fill","#616F7A");
            this.dom.timeDots.style("stroke","#EEE");
        } else if(maxDots>numOfItems*1.5){
            this.dom.timeDots.style("fill","url(#dotGradient100)");
        } else if(maxDots>numOfItems*0.8){
            this.dom.timeDots.style("fill","url(#dotGradient75)");
        } else if(maxDots>numOfItems*0.3){
            this.dom.timeDots.style("fill","url(#dotGradient50)");
        } else {
            this.dom.timeDots.style("fill","url(#dotGradient25)");
        }
    },
    /** updateBarAxisScale */
    updateBarAxisScale: function(){
        if(this.options.catBarScale==="scale_frequency"){
            this.catBarAxisScale = d3.scale.linear()
                .domain([0,this.parentKshf.itemsSelectedCt])
                .rangeRound([0, this.parentKshf.barMaxWidth]);
        } else {
            this.catBarAxisScale = d3.scale.linear()
                .domain([0,this.getMaxBarValuePerAttrib()])
                .rangeRound([0, this.parentKshf.barMaxWidth]);
        }
        this.refreshWidth_Bars_Total();
        this.insertXAxisTicks();
    },
    /** updateBarWidth */
    updateBarWidth: function(w){
        this.updateBarAxisScale();
        this.refreshWidth_Bars_Active();
        this.updateRowBarLineWidth();
        this.refreshUIWidth();
    },
    /** updateRowBarLineWidth */
    updateRowBarLineWidth: function(){
        var kshf_ = this.getKshf();
        var x2=kshf_.barMaxWidth+kshf_.scrollPadding+kshf_.scrollWidth+kshf_.sepWidth+kshf_.getRowTotalTextWidth()
            +this.options.timeMaxWidth;
        this.dom.row_bar_line.attr("x2",x2);
    },
    /** refreshScrollbar */
    refreshScrollbar: function(animate){
        var me = this;
        var kshf_ = this.getKshf();
    	var firstRowHeight = kshf_.line_height*this.scrollbar.firstRow;
        var handleTopPos = firstRowHeight*(this.rowCount_Visible/this.attribCount_Active.toFixed());
        if(animate){
            var scrollHandleHeight=kshf_.line_height*this.rowCount_Visible*this.rowCount_Visible/this.attribCount_Active.toFixed();
            if(scrollHandleHeight<10) { scrollHandleHeight=10;}
            this.root.selectAll("g.scrollGroup rect.background_up")
                .transition().duration(kshf_.anim_layout_duration)
                .attr("height",(handleTopPos));
            this.root.selectAll("g.scrollGroup rect.background_down")
                .transition().duration(kshf_.anim_layout_duration)
                .attr("y",handleTopPos)
                .attr("height",kshf_.line_height*this.rowCount_Visible-handleTopPos)
            ;
            this.root.selectAll("g.scrollGroup rect.handle")
                .transition().duration(kshf_.anim_layout_duration)
                .attr("height",scrollHandleHeight)
                .attr("y",handleTopPos);
            this.root.select("g.barGroup")
                .transition().duration(kshf_.anim_layout_duration)
                .ease(d3.ease("cubic-out"))
                .attr("transform",function(){return "translate(0,-"+firstRowHeight+")";});
        } else {
            this.root.selectAll("g.scrollGroup rect.background_up")
                .attr("height",(handleTopPos+5));
            this.root.selectAll("g.scrollGroup rect.background_down")
                .attr("y",handleTopPos)
                .attr("height",kshf_.line_height*this.rowCount_Visible-handleTopPos)
            ;
            this.root.selectAll("g.scrollGroup rect.handle")
                .attr("y",handleTopPos);
            this.root.select("g.barGroup")
                .attr("transform",function(){return "translate(0,-"+firstRowHeight+")";});
        }
        this.root.selectAll("g.scrollGroup g.top_arrow").style("display",
            (this.scrollbar.firstRow!==0)?"inline":"none");
        this.root.select("text.scroll_display_more")
            .style("display",
                (this.scrollbar.firstRow!==this.getMaxVisibleFirstRow())?"inline":"none")
            .text( function(){
                if(me.scrollbar.firstRow===me.getMaxVisibleFirstRow()) return "";
                return (me.attribCount_Active-me.rowCount_Visible-me.scrollbar.firstRow)+" more...";
            });
        this.root.selectAll("g.scrollGroup text.first_row_number")
            .text(this.scrollbar.firstRow===0?"":this.scrollbar.firstRow)
            .attr("y",handleTopPos-1)
            ;
    },
    /** getMaxVisibleFirstRow */
    getMaxVisibleFirstRow: function(){
        return this.attribCount_Active-this.rowCount_Visible;
    },
    /** setRowCount_VisibleAttribs */
    setRowCount_VisibleAttribs: function(c){
        if(c<0) c=1;
        if(c>this.attribCount_Active) c=this.attribCount_Active;
        if(this.attribCount_Active<=2){ 
            c = this.attribCount_Active;
        } else {
            c = Math.max(c,2);
        }
        this.rowCount_Visible = c;
    },
    /** refreshVisibleAttribs */
    refreshVisibleAttribs: function(forced){
        var kshf_ = this.getKshf();
        var totalHeight      = kshf_.line_height*this.rowCount_Total();
        var visibleRowHeight = kshf_.line_height*this.rowCount_Visible;
        var headerHeight     = kshf_.line_height*this.rowCount_Header();

        this.scrollbar.show = this.rowCount_Visible!==this.attribCount_Active;

        this.divRoot
            .attr("collapsed",this.collapsed===false?"false":"true")
            .attr("showconfig",this.showConfig)
            .attr("collapsedTime",this.collapsedTime===false?"false":"true")
            .attr("showscrollbar",this.scrollbar.show)
            .attr("selectType",this.selectType)
            .attr("hasMultiValueItem",this.hasMultiValueItem)
            ;
        if(this.type!=='scatterplot'){
            this.divRoot
                .transition().duration(kshf_.anim_layout_duration)
                .style("height",totalHeight+"px")
                ;
        }

        this.root
            .transition().duration(kshf_.anim_layout_duration)
            .style("height",totalHeight+"px");

        // ******************************************************************************
        // Scrollbar stuff

        // scrollbar.firstRow cannot exceed getMaxVisibleFirstRow()
        this.scrollbar.firstRow = Math.min(this.scrollbar.firstRow,this.getMaxVisibleFirstRow());
        // how much is one row when mapped to the scroll bar?
        this.scrollbar.rowScrollHeight = visibleRowHeight/this.attribCount_Active;
        if(this.rowCount_Visible!==this.attribCount_Active){
            // update scrollbar height
            this.root.selectAll("g.scrollGroup rect.background")
                .transition().duration(kshf_.anim_layout_duration)
                .attr("height",visibleRowHeight+1)
                ;
            this.root.select("g.scrollGroup text.scroll_display_more")
                .transition().duration(kshf_.anim_layout_duration)
                .attr('y',visibleRowHeight+10)
                ;
            this.refreshScrollbarPos();
            this.refreshScrollbar(true);
        }

        this.root.select(".x_axis")
            .transition().duration(kshf_.anim_layout_duration)
            .attr("transform", "translate("+(kshf_.getRowTotalTextWidth())+",23)")
            ;

        this.root.select("rect.chartBackground")
            .attr('height',visibleRowHeight)
            .attr('y',headerHeight)
            ;
        this.root.selectAll(".barChartClipPath rect")
            .transition().duration(kshf_.anim_layout_duration)
    		.attr("height",visibleRowHeight)
            ;

        if(this.type==='scatterplot'){
            this.refreshTimeAxisPosition();
        }

        // update x axis items
    	this.root.selectAll("g.timeAxisGroup g.filter_handle line")
            .transition().duration(kshf_.anim_layout_duration)
            .attr("y1", -visibleRowHeight-8)
    		.attr("y2", -8)
            ;
    	this.root.selectAll("g.timeAxisGroup rect.filter_nonselected")
    //        .transition().duration(kshf_.anim_layout_duration)
            .attr("y",-visibleRowHeight-8)
    		.attr("height", visibleRowHeight)
            ;
        this.root.selectAll("line.selectVertLine")
            .attr("y2", kshf_.line_height*(this.rowCount_Visible+1.5))
            ;
        this.root.selectAll("g.x_axis g.tick line")
            .transition().duration(kshf_.anim_layout_duration)
            .attr("y2", visibleRowHeight)
            ;
        this.root.selectAll("g.x_axis g.tick text")
            .transition().duration(kshf_.anim_layout_duration)
            .attr("dy",visibleRowHeight+3);
    },
    /** setScrollPosition */
    setScrollPosition: function(pos) {
        // clamp
        if(pos<0) pos=0;
        if(pos>this.getMaxVisibleFirstRow()) pos=this.getMaxVisibleFirstRow();
        // if same, do no more
        if(this.scrollbar.firstRow===pos) return;
        this.scrollbar.firstRow = pos;
        this.refreshScrollbar();
    },
    /** stepScrollPosition */
    stepScrollPosition: function(stepSize) {
        if(this.scrollbar.firstRow===0 && stepSize<0){ return; }
        if(this.scrollbar.firstRow===this.getMaxVisibleFirstRow() && stepSize>0){ return; }
        if(!this.scrollBarUp_Active){ return; }
        this.scrollbar.firstRow+=stepSize;
        this.refreshScrollbar();
        this.scrollBarUp_TimeStep-=10;
        if(this.scrollBarUp_TimeStep<15){ this.scrollBarUp_TimeStep = 15; }
        window.setTimeout(this.stepScrollPosition.bind(this,stepSize), this.scrollBarUp_TimeStep);
    },
    /** insertScrollbar */
    insertScrollbar: function(){
        var me = this;

    	var scrollGroup = this.root.append("g").attr("class","scrollGroup")
            .attr("transform","translate(0,20)")
    		.on("mousedown", function () { d3.event.preventDefault(); })
    		;

        // left scroll
        this.dom.leftScroll = scrollGroup.append("g").attr("class","leftScroll");
        this.insertScrollbar_do(this.dom.leftScroll);
        // right scroll
        if(this.type==='scatterplot'){
            this.dom.rightScroll = scrollGroup.append("g").attr("class","rightScroll");
            this.insertScrollbar_do(this.dom.rightScroll);
        }

        // "more..." text
        scrollGroup.append("text").attr("class","scroll_display_more")
            .on("mousedown",function(){
                scrollGroup.selectAll("text.row_number").style("display","block");
                me.scrollBarUp_Active = true; 
                me.scrollBarUp_TimeStep = 200;
                me.stepScrollPosition(1);
                if(sendLog) {
                    sendLog(CATID.FacetScroll,ACTID_SCROLL.ClickMore, 
                        {facet:me.options.facetTitle,firstRow:me.scrollbar.firstRow});
                }
            })
            .on("mouseup",function(){ me.scrollBarUp_Active = false; })
            .on("mouseover",function(e){ 
                d3.select(this).attr("highlight",true); 
            })
            .on("mouseout",function(){ 
                d3.select(this).attr("highlight",false); 
                me.scrollBarUp_Active = false; 
                scrollGroup.selectAll("text.row_number").style("display","none");
            })
            ;
    },
    /** insertScrollbar_do */
    insertScrollbar_do: function(parentDom){
        var me = this;
        var kshf_ = this.getKshf();
        var mouseOutFunc = function(){ me.scrollBarUp_Active = false; };

    	// scroll to top
    	var xxx=parentDom.append("g").attr("class","top_arrow")
            .attr("transform","translate(1,-13)");
            xxx.append("title")
                .text("Top");
            xxx.append("rect")
                .attr("width",kshf_.scrollWidth)
                .attr("height",11)
                .on("click",function(){
                    me.scrollbar.firstRow=0;
                    me.refreshScrollbar(true);
                    if(sendLog) {
                        sendLog(CATID.FacetScroll,ACTID_SCROLL.ScrollToTop, 
                            {facet:me.options.facetTitle,firstRow:me.scrollbar.firstRow});
                    }
                });
            xxx.append("path").attr("class","top_arrow")
                .attr("d","M4 0 L0 3 L0 6 L4 3 L8  6 L8  3 Z M4 5 L0 8 L0 11 L4 8 L8 11 L8  8 Z")
                ;
    	// the background - static position/size
    	parentDom.append("rect").attr("class", "background")
    		.attr("width",kshf_.scrollWidth+1)
    		.attr("rx",4)
    		.attr("ry",4)
            .attr("x",-0.5)
            .attr("y",-0.5)
            ;
    	parentDom.append("rect").attr("class", "background_fill background_up")
    		.attr("width",kshf_.scrollWidth)
    		.attr("rx",4)
    		.attr("ry",4)
            .on("mousedown",function(){
                me.scrollBarUp_Active = true; 
                me.scrollBarUp_TimeStep = 200;
                me.stepScrollPosition(-1);
                if(sendLog) {
                    sendLog(CATID.FacetScroll,ACTID_SCROLL.ClickScrollbar,
                        {facet:me.options.facetTitle,firstRow:me.scrollbar.firstRow});
                }
            })
    		.on("mouseup",function(){
                me.scrollBarUp_Active = false; 
            })
    		.on("mouseout",mouseOutFunc);
    	parentDom.append("rect").attr("class", "background_fill background_down")
    		.attr("width",kshf_.scrollWidth)
    		.attr("rx",4)
    		.attr("ry",4)
            .on("mousedown",function(){
                me.scrollBarUp_Active = true; 
                me.scrollBarUp_TimeStep = 200;
                me.stepScrollPosition(1);
                if(sendLog) {
                    sendLog(CATID.FacetScroll,ACTID_SCROLL.ClickScrollbar, 
                        {facet:me.options.facetTitle,firstRow:me.scrollbar.firstRow});
                }
            })
    		.on("mouseup",function(){
                me.scrollBarUp_Active = false; 
            })
    		.on("mouseout",mouseOutFunc);
    	// the handle - very (very) dynamic
    	parentDom.append("rect")
    		.attr("class", "handle")
    		.attr("x",0)
    		.attr("y",0)
    		.attr("rx",4)
    		.attr("ry",4)
    		.attr("width",kshf_.scrollWidth)
    		.on("mouseout",mouseOutFunc)
    		.on("mousedown", function(d, i) {
    			me.scrollbar.active=true;
    			d3.select(this).attr("selected",true);
    			me.root.style( 'cursor', 'pointer' );
    			var mouseDown_y = d3.mouse(this.parentNode.parentNode.parentNode)[1];
    			var firstRow = me.scrollbar.firstRow;
                parentDom.selectAll("text.row_number").style("display","block");
    			me.root.on("mousemove", function() {
    				var mouseMove_y = d3.mouse(this)[1];
    				var mouseDif = mouseMove_y-mouseDown_y;
    				// update position if necessary
    				var lineDif = Math.round(mouseDif/me.scrollbar.rowScrollHeight);
    				if(lineDif!==0){
    					var hmm=firstRow + lineDif;
    					if(hmm<0) { hmm=0; }
    					if(hmm>me.getMaxVisibleFirstRow()) { hmm=me.getMaxVisibleFirstRow(); }
    					me.scrollbar.firstRow = hmm;
    					me.refreshScrollbar();
    				}
    			}).on("mouseup", function(){
    				me.root.style( 'cursor', 'default' );
    				me.scrollbar.active=false;
    				var btn=me.root.select("g.scrollGroup rect.handle");
    				btn.attr("selected",false);
    				// unregister mouse-move callbacks
                    parentDom.selectAll("text.row_number").style("display","");
    				me.root.on("mousemove", null).on("mouseup", null);
                    if(sendLog) sendLog(CATID.FacetScroll,ACTID_SCROLL.DragScrollbar,
                        {facet:me.options.facetTitle,firstRow:me.scrollbar.firstRow});
    			});
    		})
    		;
        // number display
    	parentDom.append("text")
            .attr("class","first_row_number row_number")
            .attr("x",kshf_.scrollWidth)
            ;
    	parentDom.append("text")
            .attr("class","last_row_number row_number")
            .attr("x",kshf_.scrollWidth)
            ;
    },
    /** refreshScrollbarPos */
    refreshScrollbarPos: function(){
        var kshf_ = this.getKshf();
    	this.dom.leftScroll
            .transition().duration(kshf_.anim_layout_duration)
    		.attr("transform","translate("+(kshf_.getRowTotalTextWidth()+kshf_.barMaxWidth+kshf_.scrollPadding)+",0)")
            ;
        if(this.type==='scatterplot'){
            this.dom.rightScroll
                .transition().duration(kshf_.anim_layout_duration)
                .attr("transform","translate("+(this.getWidth_Total()-kshf_.scrollWidth-3)+",0)");
        }
        this.root.select("text.scroll_display_more")
            .attr("x", kshf_.categoryTextWidth);
    },
    /** filter_multi_and */
    filter_multi_and: function(idList,curDtId) {
        // ALL of the current selection is in item mappings
        // see how many items return true. If it matches current selected count, then all selections are met for this item
        var t=0;
        idList.forEach(function(id){ if(curDtId[id].selected) t++; })
        return (t===this.attribCount_Selected);
    },
    /** update ItemFilterState_Attrib */
    updateItemFilterState_Attrib: function(){
        if(this.attribCount_Selected===0){
            this.getKshfItems().forEach(function(item){ 
                item.setFilter(this.filterId,true);
            },this);
            return;
        }

        var curDtId=this.getAttribs_wID();
        var filterId = this.filterId;

        if(this.selectType==="SelectAnd"){
            var filter_multi = this.filter_multi_and;
            this.getKshfItems().forEach(function(item){
                var m=item.mappedData[filterId];
                if(m===undefined || m===null || m===""){ 
                    item.setFilter(filterId,false);
                } else {
                    if(m instanceof Array){
                        item.setFilter(filterId,filter_multi.call(this,m,curDtId));
                    } else {
                        if(this.attribCount_Selected>1){
                            // more than 1 item is selected, and this item only has 1 mapping.
                            item.setFilter(filterId,false);
                        } else {
                            item.setFilter(filterId,curDtId[m].selected);
                        }
                    }
                }
            },this);
        } else {
            var filter_multi = kshf.Util.filter_multi_or;
            this.getKshfItems().forEach(function(item){
                var m=item.mappedData[filterId];
                if(m===undefined || m===null || m===""){ 
                    item.setFilter(filterId,false);
                } else {
                    if(m instanceof Array){
                        item.setFilter(filterId,filter_multi.call(this,m,curDtId));
                    } else {
                        item.setFilter(filterId,curDtId[m].selected);
                    }
                }
            },this);
        }
    },
    /** update ItemFilterState_Time */
    updateItemFilterState_Time: function(){
        var timeFilterId = this.filterId+1;
        this.getKshfItems().forEach(function(item){
            item.setFilter(timeFilterId,
                (item.timePos>=this.timeFilter_ms.min) && (item.timePos<=this.timeFilter_ms.max)
            );
            item.updateSelected();
        },this);
    },
    /** update Selected_AllItems */
    updateSelected_All: function(){
        this.updateItemFilterState_Attrib();
        this.getKshfItems().forEach(function(item){
            item.updateSelected();
        });
    }, 
    /** update Selected_UnSelectOnly */
    updateSelected_UnSelectOnly: function(){
        this.updateItemFilterState_Attrib();
        this.getKshfItems().forEach(function(item){
            if(item.wanted) item.updateSelected();
        });
    },
    /** update Selected_SelectOnly */
    updateSelected_SelectOnly: function(){
        this.updateItemFilterState_Attrib();
        this.getKshfItems().forEach(function(item){
            if(!item.wanted) item.updateSelected();
        });
    },
    /** -- */
    isAttribVisible: function(attrib){
        // Show selected attribute always
        if(attrib.selected) return true;
        // Show if number of active items is not zero
        if(attrib.activeItems!==0) return true;

        // facet is not filtered yet, cannot click on 0 items
        if(!this.isFiltered_Attrib()) return attrib.activeItems!==0;
        
        // Hide if multiple options are selected and selection is and
        if(this.selectType==="SelectAnd") return false;
        // TODO: Figuring out non-selected, zero-active-item attribs under "SelectOr" is tricky!

        return true;
    },
    /** -- */
    isAttribSelectable: function(attrib){
        // Show selected attribute always
        if(attrib.selected) return true;
        // Show if number of active items is not zero
        if(attrib.activeItems!==0) return true;

        // Show if multiple attributes are selected and the facet does not include multi value items
        if(this.isFiltered_Attrib() && !this.hasMultiValueItem) return true;

        // Hide
        return false;
    },
    /** When clicked on an attribute ... */
    filterAttrib: function(attrib, selectOr){
        attrib.selected = !attrib.selected;
        this.attribCount_Selected += attrib.selected?1:-1;
        if(attrib.selected){
            // attrib is added to filtering
            if(this.attribCount_Selected===1){ // only one attribute is selected
                this.selectType = "SelectOr";
                this.updateSelected_UnSelectOnly();
            } else {
                if(this.hasMultiValueItem){
                    if(this.attribCount_Selected===2){
                        this.selectType = (selectOr===undefined)?"SelectAnd":"SelectOr";
                    }
                    if(this.selectType==="SelectAnd"){
                        this.updateSelected_UnSelectOnly();
                    } else {
                        this.updateSelected_SelectOnly();
                    }
                } else {
                    // more than 1 attribute is selected now. Figure our what to do
                    if(selectOr===true){
                        this.updateSelected_SelectOnly();
                    } else {
                        // Removing previous filters
                        this.unselectAllAttribs();
                        attrib.selected=true;
                        this.attribCount_Selected = 1;
                        this.updateSelected_All();
                    }
                }
            }
        } else {
            // attrib is removed from filtering
            if(this.attribCount_Selected===0){
                this.selectType = "SelectOr";
                this.updateSelected_SelectOnly();
            } else {
                if(this.hasMultiValueItem){
                    if(this.selectType==="SelectAnd"){
                        this.updateSelected_SelectOnly();
                    } else {
                        this.updateSelected_UnSelectOnly();
                    }
                    if(this.attribCount_Selected===1){
                        this.selectType = "SelectOr";
                    }
                } else {
                    this.updateSelected_UnSelectOnly();
                }
            }
        }  
        this.refreshAttribFilter();

        if(this.sortingOpt_Active.no_resort!==true){
            this.divRoot.attr("canResort",this.attribCount_Selected!==this.attribCount_Active&&this.attribCount_Selected!==0);
        }

    	this.getKshf().update();
        if(this.dom.showTextSearch) this.dom.showTextSearch[0][0].value="";
    },
    /** refreshAttribFilter */
    refreshAttribFilter: function(){
        this.divRoot.attr("filtered_row",this.isFiltered_Attrib());
        this.dom.g_row.attr("selected",function(attrib){return attrib.selected;});
        this.refreshFilterSummary_Attib();
    },
    /** refreshFilterSummary_Attib */
    refreshFilterSummary_Attib: function(){
    	var me=this;
        if(!this.isFiltered_Attrib()){
            this.getKshf().listDisplay.removeFilterSummaryBlock(this.filterSummaryBlock_Row);
            this.filterSummaryBlock_Row = null;
        } else {
            // insert DOM
            if(this.filterSummaryBlock_Row===null || this.filterSummaryBlock_Row===undefined){
                this.filterSummaryBlock_Row = this.getKshf().listDisplay.insertFilterSummaryBlock();
                this.filterSummaryBlock_Row.select(".chartClearFilterButton")
                    .on("click",function(){ 
                        me.clearAttribFilter(); 
                        if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnSummary,
                            me.getKshf().getFilteringState(me.options.facetTitle));
                    });
                this.filterSummaryBlock_Row.select(".txttt")
                    .text(" "+(this.options.textFilter?this.options.textFilter:this.options.facetTitle)+": ")
                    ;
            }
            // go over all items and prepare the list
            var selectedItemsText="";
            var selectedItemsText_Sm="";
            var selectedItemsCount=0;
            var catLabelText = this.options.catLabelText;
            var catTooltipText = this.options.catTooltipText;
            this.root.selectAll("g.row").each( function(attrib){
                if(!attrib.selected) return; 
                if(selectedItemsCount!==0) {
                    if(me.selectType==="SelectAnd"){
                        selectedItemsText+=" and "; 
                        selectedItemsText_Sm+=" and "; 
                    } else{
                        selectedItemsText+=" or "; 
                        selectedItemsText_Sm+=" or "; 
                    }
                }
                var labelText = catLabelText(attrib);
                var titleText = labelText;
                if(catTooltipText) titleText = catTooltipText(attrib);

                selectedItemsText+="<b>"+labelText+"</b>";
                selectedItemsText_Sm+=titleText;
                selectedItemsCount++;
            });
            this.filterSummaryBlock_Row.select(".filter_item")
                .html(selectedItemsText)
                .attr("title",selectedItemsText_Sm)
                ;
        }
    },
    /** insertAttribs */
    insertAttribs: function(){
    	var me = this;
        var kshf_ = this.getKshf();

    	// create the clipping area
    	var clipPaths = this.root.select("g.barGroup_Top")
    		.on("mousedown", function (d, i) { d3.event.preventDefault(); })
            .on("mousewheel",this.scrollItemCb.bind(this))
    	.insert("g",":first-child")
            .attr("class","barChartClipPath");

        clipPaths.insert("clipPath")
    		.attr("id","kshf_chart_clippath_"+this.id)
    	.append("rect").attr("class","clippingRect")
    		.attr("x",0).attr("y",0)
    		;

        clipPaths.insert("clipPath")
            .attr("id","kshf_chart_clippathsm_"+this.id)
        .append("rect").attr("class","clippingRect_2")
            .attr("y",0)
            ;

    	this.dom.g_row
            .attr("highlight","false")
            .attr("selected","false")
    		.on("click", function(attrib){
                me.filterAttrib(attrib);
                this.tipsy_active.hide();

                if (this.timer) {
                    // double click
                    clearTimeout(this.timer);
                    this.timer = null;
                    me.unselectAllAttribs();
                    me.filterAttrib(attrib);
                    if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.CatValueExact,
                        kshf_.getFilteringState(me.options.facetTitle,attrib.data[1]));
                    return;
                } else if(sendLog){
                    if(sendLog) sendLog(CATID.FacetFilter,(attrib.selected)?ACTID_FILTER.CatValueAdd:ACTID_FILTER.CatValueRemove,
                        kshf_.getFilteringState(me.options.facetTitle,attrib.data[1]));
                }
                var x = this;
                this.timer = setTimeout(function() { x.timer = null; }, 500);
            })
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: 'w',
                    offset_y: 9,
                    offset_x: 2,
                    offset_x: me.parentKshf.getRowTotalTextWidth(),
                    fade: true,
                    title: function(){
                        var attrib=this.__data__;
                        var attribName=me.options.facetTitle;
                        var hasMultiValueItem=attrib.barChart.hasMultiValueItem;
                        if(attrib.selected) 
                            return "<span class='big'>-</span class='big'> <span class='action'>Remove</span> "+attribName+" Filter";
                        if(attrib.barChart.attribCount_Selected===0)
                            return "<span class='big'>+</span> <span class='action'>Add</span> "+attribName+" Filter";
                        if(hasMultiValueItem===false)
                            return "<span class='big'>&laquo;</span> <span class='action'>Change</span> "+attribName+" Filter";
                        else
                            return "<span class='big'>+</span> <span class='action'>Add</span> "+attribName+" (<b> ... and </b>)";
                    }
                });
            })
            .on("mouseover",function(attrib,i){
                if(!me.isAttribSelectable(attrib)) return;    
                this.setAttribute("highlight",true);
                attrib.items.forEach(function(item){if(item.wanted) item.highlightListItem();});
                this.tipsy_active = this.tipsy;
                if(attrib.selected===false & me.attribCount_Selected>1 && me.selectType==="SelectOr"
                    && me.hasMultiValueItem){
                    // prevent "...and" and show "...or" instead
                    this.tipsy_active = d3.select(this).select(".filter_add_more")[0][0].tipsy;
                }
                this.tipsy_active.show();
            })
            .on("mouseout",function(attrib,i){
                if(!me.isAttribSelectable(attrib)) return;
                this.setAttribute("highlight",false);
                attrib.items.forEach(function(item){if(item.wanted) item.nohighlightListItem();});
                this.tipsy_active.hide();
            })
            ;
        
        this.dom.row_title = this.dom.g_row.append("title").attr("class", "row_title");
        this.dom.add_more = this.dom.g_row.append("g").attr("class", "filter_add_more")
            .each(function(){
                this.tipsy = new Tipsy(this, {
                    gravity: 'sw',
                    offset_y: 5,
                    offset_x: 1,
                    fade: true,
                    title: function(){
                        var attrib = this.__data__;
                        if(attrib.selected)
                            return "<span class='big'>+</span> <span class='action'>Remove</span> "+me.options.facetTitle+" Filter";
                        return "<span class='big'>+</span> <span class='action'>Add</span> "+me.options.facetTitle+" (<b> ... or </b>)";
                    }
                });
            })
            .on("mouseover",function(attrib,i){
                if(attrib.selected) return;
                this.tipsy.show();
                this.parentNode.setAttribute("highlight",true);
                d3.event.stopPropagation();
            })
            .on("mouseout",function(attrib,i){
                if(attrib.selected) return;
                this.tipsy.hide();
                this.parentNode.setAttribute("highlight",false);
                d3.event.stopPropagation();
            })
            .on("click",function(attrib,i){
                if(attrib.selected) return;
                me.filterAttrib(attrib,true);
                this.tipsy.hide();
                d3.event.stopPropagation();
            })
            ;
        var x= this.dom.add_more.append("text").attr("class","filter_add_more add")
            .attr("dy",14).attr("dx",8).text("⊕")
            ;
/*        var y= this.dom.add_more.append("text").attr("class","filter_add_more remove")
            .attr("dy",14).attr("dx",8).text("⊖")
            ;*/

    	this.dom.rowSelectBackground_Label = this.dom.g_row
    		.append("rect").attr("class", "rowSelectBackground rowSelectBackground_Label")
    		.attr("x", 0).attr("y", 0)
            .attr("fill","url(#gr_rowSelectBackground_Label)")
            .attr("height",kshf_.line_height)
    		;
    	this.dom.rowSelectBackground_Count = this.dom.g_row
    		.append("rect").attr("class", "rowSelectBackground rowSelectBackground_Count")
            .attr("y", 0)
            .attr("fill","url(#gr_rowSelectBackground_Count)")
            .attr("width",kshf_.getRowLabelOffset())
            .attr("height",kshf_.line_height)
    		;
        this.dom.rowSelectBackground_ClickArea = this.dom.g_row
            .append("rect").attr("class", "rowSelectBackground_ClickArea")
            .attr("x", 20).attr("y", 4)
            .attr("height",kshf_.line_height-8)
            ;
    	this.dom.item_count = this.dom.g_row
    		.append("text").attr("class", "item_count")
    		.attr("dy", 13)
    		;
    	this.dom.cat_labels = this.dom.g_row
    		.append("text").attr("class", "row_label")
    		.attr("dy", 14)
    		.text(this.options.catLabelText);
    	// Create helper line
    	if(this.options.display.row_bar_line){
    		this.dom.row_bar_line = this.dom.g_row.append("line")
    			.attr("class", "row_bar_line")
    			.attr("stroke-width","1")
    			.attr("y1", kshf_.line_height/2.0)
    			.attr("y2", kshf_.line_height/2.0);
    	} else{
            this.dom.row_bar_line = this.root.select(".row_bar_line"); // empty
        }
    	this.dom.bar_active = this.dom.g_row.append("rect")
            .attr("rx",2).attr("ry",2)
    		.attr("class", function(d,i){ 
    			return "rowBar " +(me.options.barClassFunc?me.options.barClassFunc(d,i):"")+" active";
    		});
    	this.dom.bar_total = this.dom.g_row.append("rect")
            .attr("rx",2).attr("ry",2)
    		.attr("class", function(d,i){ 
    			return "rowBar "+(me.options.barClassFunc?me.options.barClassFunc(d,i):"")+" total";
    		});
        this.dom.allRowBars = this.root.selectAll('g.barGroup g.row rect.rowBar')
            .attr("x", kshf_.getRowTotalTextWidth())
            ;

        this.refreshTextWidth();
    },
    /** refreshTextWidth */
    refreshTextWidth: function(){
        var kshf_ = this.getKshf();
        kshf_.anim_barscale_duration = kshf_.anim_barscale_duration_default;
        var dur=kshf_.anim_barscale_duration;

        this.dom.cat_labels
            .transition().duration(dur)
            .attr("x", this.options.rowTextWidth);
        this.dom.rowSelectBackground_Count
            .transition().duration(dur)
            .attr("x",this.options.rowTextWidth);
        this.dom.item_count
            .transition().duration(dur)
            .attr("x", this.options.rowTextWidth+3);
        this.dom.rowSelectBackground_Label
            .transition().duration(dur)
            .attr("width",this.options.rowTextWidth);
        this.dom.rowSelectBackground_ClickArea
            .transition().duration(dur)
            .attr("width",kshf_.getRowTotalTextWidth()-20);
        this.dom.allRowBars
            .transition().duration(dur)
            .attr("x", kshf_.getRowTotalTextWidth());
        this.dom_headerGroup.selectAll(".leftHeader_XX")
            .transition().duration(dur)
            .style("width",this.options.rowTextWidth+"px");
        this.root.select("g.x_axis")
            .transition().duration(dur)
            .attr("transform","translate("+
                (kshf_.getRowTotalTextWidth())+","+(kshf_.line_height*this.rowCount_Header()+3)+")")

        if(this.dom.showTextSearch)
            this.dom.showTextSearch.style("width",(this.options.rowTextWidth-20)+"px")

        this.dom.row_bar_line
            .attr("x1", kshf_.getRowTotalTextWidth()+2);
    },
    /** refreshWidth_Bars_Total */
    refreshWidth_Bars_Total: function(){
        var me = this;
        this.dom.bar_total
            .transition().duration(this.getKshf().anim_barscale_duration)
            .attr("width", function(attrib){
                return Math.min(me.catBarAxisScale(attrib.barValueMax),me.parentKshf.barMaxWidth+7); 
            });
    },
    /** sortAttribs */
    sortAttribs: function(){
        var me = this;
        var selectedOnTop = this.sortingOpt_Active.no_resort!==true;
        var inverse = this.sortingOpt_Active.inverse;
        var sortFunc = this.sortingOpt_Active.func;

        var idCompareFunc = function(a,b){return b-a;};
        if(typeof(this.getAttribs()[0].id())==="string") 
            idCompareFunc = function(a,b){return b.localeCompare(a);};

        var theSortFunc = function(a,b){
            if(selectedOnTop){
                if(!a.selected &&  b.selected) return  1;
                if( a.selected && !b.selected) return -1;
            }
            // put the items with zero active items to the end of list (may not be displayed / inactive)
            if(a.activeItems===0 && b.activeItems!==0) return  1;
            if(b.activeItems===0 && a.activeItems!==0) return -1;

            var x=sortFunc(a,b);
            if(x===0) 
                x=idCompareFunc(a.id(),b.id());
            if(inverse)
                x=-x;
            return x;
        };
        this.getAttribs().sort(theSortFunc);
        this.getAttribs().forEach(function(attrib,i){ attrib.orderIndex=i; });
    },
    /** updateSorting */
    updateSorting: function(){
        var kshf_ = this.getKshf();
        this.sortAttribs();
        // always scrolls to top row automatically when re-sorted
        if(this.scrollbar.firstRow!==0){
            this.scrollbar.firstRow=0;
            this.refreshScrollbar();
        }
        this.dom.g_row.data(this.getAttribs(), this._dataMap)
            .order().transition().delay(this.sortDelay)
            .attr("transform", function(attrib,i) { return "translate(0,"+((kshf_.line_height*i))+")"; })
            ;

        if(this.type==='scatterplot') this.refreshBarLineHelper();
        this.divRoot.attr("canResort",false);
        this.sortDelay = 450;
    },
    /** insertXAxisTicks */
    insertXAxisTicks: function(){
        var axisGroup = this.root.select("g.x_axis");

        var ticksSkip = this.parentKshf.barMaxWidth/25;
        if(this.getMaxBarValuePerAttrib()>100000){
            ticksSkip = this.parentKshf.barMaxWidth/30;
        }

        var xAxis = d3.svg.axis()
            .tickSize(0, 0, 0)
    		.orient('bottom')
    		.ticks(ticksSkip)
    		.tickFormat(d3.format("s"))
            .scale(this.catBarAxisScale);

    	axisGroup.call(xAxis);

        // no animation! by default it is inserted at 0, we need to update it without animation	
        this.root.selectAll("g.x_axis g.tick text")
            .attr("dy",3+this.rowCount_Visible*this.parentKshf.line_height);

    	axisGroup.selectAll("g.tick line")
            .attr("y1","0")
            .attr("y2",this.getKshf().line_height*this.rowCount_Visible);
    },
    /** removeXAxis */
    removeXAxis: function(){
        this.root.select("g.x_axis").data([]).exit().remove();
    },
    /** refreshTimeChartBarDisplay */
    refreshTimeChartBarDisplay: function(){
        // key dots are something else
        var me = this;
        var kshf_ = this.getKshf();
        var r,j;
        var rows = this.getAttribs();
        
        var timeChartSortFunc = function(a,b){
            if(a.selected&&!b.selected) { return  1; }
            if(b.selected&&!a.selected) { return -1; }
            // use left-to-right sorting
            var posA = a.timePos;
            var posB = b.timePos;
            if(posA===null || posB===null) { return 0; }
            return posA.getTime()-posB.getTime();
        };
        
        rows.forEach(function(attrib){
            if(!attrib.sortDirty || this.type!=="scatterplot") return;
            attrib.items.sort(timeChartSortFunc);
            this.root.selectAll("g.row").selectAll(".timeDot")
                .data(function(attrib) { return attrib.items; }, function(attrib){ return attrib.id(); })
                // calling order will make sure selected ones appear on top of unselected ones.
                .order()
                ;
            // TODO: call order only on this row
            // re-calculate min-max only on this row
            // etc...
        },this);

        // update min-max time extents ber timeBar
        this.updateAttrib_TimeMinMax();
        if(this.dom.timeBarActive){
            this.dom.timeBarActive
                .transition().duration(kshf_.anim_barscale_duration)
                .attr("x", function(d) {
                    return me.parentKshf.barMaxWidth+kshf_.scrollWidth+kshf_.sepWidth+kshf_.scrollPadding+
                        me.parentKshf.getRowTotalTextWidth()+me.timeScale(d.xMin_Dyn===undefined?d.xMin:d.xMin_Dyn);
                })
                .attr("width", function (d) { 
                    if(d.xMin_Dyn===undefined){ return 0; }
                    return me.timeScale(d.xMax_Dyn) - me.timeScale(d.xMin_Dyn);
                })
                ;
        }
        rows.forEach(function(row){row.sortDirty=false;});
    },
    /** insertTimeChartRows */
    insertTimeChartRows: function(){
    	var me = this;
        var kshf_ = this.getKshf();

        var rows = this.dom.g_row.append("g").attr("class","timeLineParts")
            .attr("clip-path","url(#kshf_chart_clippathsm_"+this.id+")")
            ;
        if(this.options.timeBarShow===true){
            rows.append("rect").attr("class", "timeBar total")
                .attr("rx",2).attr("ry",2);
            rows.append("rect").attr("class", "timeBar active")
                .attr("rx",2).attr("ry",2);
            }
    	// Create bar dots
    	rows.selectAll("g.timeDot")
    		.data(function(attrib){ return attrib.items; }, 
                  function(attrib){ return attrib.id(); })
    		.enter().append("circle")
    		.attr("class", function(attrib) {
                if(me.options.dotClassFunc){ return "timeDot " + me.options.dotClassFunc(attrib); }
                return "timeDot";
            })
            .attr("highlight","false")
            .attr("r", 5)
            .attr("cy", Math.floor(kshf_.line_height / 2 ))
            .each(function(attrib){ attrib.mappedDots.push(this); })
            .on("mouseover",function(attrib,i,f){
                attrib.highlightAll();
                // update the position of selectVertLine
                var tm = me.timeScale(me.options.timeItemMap(attrib));
                var totalLeftWidth = me.parentKshf.barMaxWidth+kshf_.scrollPadding+kshf_.scrollWidth+kshf_.sepWidth+me.parentKshf.getRowTotalTextWidth();
                me.root.select("line.selectVertLine")
                    .attr("x1",tm+totalLeftWidth)
                    .attr("x2",tm+totalLeftWidth)
                    .style("display","block");
                d3.event.stopPropagation();
            })
            .on("mouseout",function(attrib,i){
                attrib.nohighlightAll();
                me.root.select("line.selectVertLine").style("display","none");
                d3.event.stopPropagation();
            })
    		.on("click", function(attrib,i,f) {
                var itemDate = attrib.timePos;
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

                me.timeFilter_ms.min = Date.parse(rangeMin);
                me.timeFilter_ms.max = Date.parse(rangeMax);
                me.yearSetXPos();
                me.updateItemFilterState_Time();
                // update is done by row-category click whcih is also auto-activated after dot click

                // clear all the selections
                me.unselectAllAttribs();

                // filter for row too
                me.filterAttrib( d3.select(this.parentNode.parentNode).datum() );

                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.TimeDot,kshf_.getFilteringState());

                d3.event.stopPropagation();
    		})
            ;
        this.dom.timeBar       = this.root.selectAll('g.barGroup g.row rect.timeBar')
        this.dom.timeBarActive = this.root.selectAll("g.barGroup g.row rect.timeBar.active");
        this.dom.timeBarTotal  = this.root.selectAll("g.barGroup g.row rect.timeBar.total");
        this.dom.timeDots      = this.root.selectAll('g.barGroup g.row .timeDot');
    },
    /** setTimeTicks */
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

        // this.options.timeMaxWidth is the current timeline width
        var timeWidthSteps = this.options.timeMaxWidth/70;

        // choose range
        if(timeWidthSteps<=diff_Year){
            // YEAR
            this.timeticks.range = d3.time.years;
            this.timeticks.format = d3.time.format.utc("%Y");
            this.timeticks.stepSize = Math.ceil(diff_Year/(this.options.timeMaxWidth/30));
        } else if(timeWidthSteps<=diff_Month){
            // MONTH
            this.timeticks.range = d3.time.months;
            this.timeticks.format = d3.time.format.utc("%b '%y");
            this.timeticks.stepSize = Math.ceil(diff_Month/(this.options.timeMaxWidth/60));
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
                this.timeRange_ms = { 
                    min: Date.UTC(this.timeData_dt.min.getUTCFullYear(),0,1),
                    max: Date.UTC(this.timeData_dt.max.getUTCFullYear()+1,0,1)};
            } else if(this.timeticks.range===d3.time.months){
                this.timeRange_ms = {
                    min: Date.UTC(this.timeData_dt.min.getUTCFullYear(),this.timeData_dt.min.getUTCMonth(),1),
                    max: Date.UTC(this.timeData_dt.max.getUTCFullYear(),this.timeData_dt.max.getUTCMonth()+1,1)};
            } else if(this.timeticks.range===d3.time.days){
                this.timeRange_ms = {
                    min: Date.UTC(this.timeData_dt.min.getUTCFullYear(),this.timeData_dt.min.getUTCMonth(),this.timeData_dt.min.getUTCDate()-1),
                    max: Date.UTC(this.timeData_dt.max.getUTCFullYear(),this.timeData_dt.max.getUTCMonth(),this.timeData_dt.max.getUTCDate()+1)};
            }

            this.resetTimeZoom_ms();
            this.resetTimeFilter_ms();
        }
        // update the time scale with the new date domain
        this.updateTimeScale();
    },
    /** updateTimeScale */
    updateTimeScale: function(){
        this.timeScale = d3.time.scale.utc()
            .domain([new Date(this.timeZoom_ms.min), new Date(this.timeZoom_ms.max)])
            .rangeRound([0, this.options.timeMaxWidth])
            ;
    },
    /** insertTimeTicks */
    insertTimeTicks: function(){
        var me = this;
        var tickGroup = this.root.select("g.timeAxisGroup g.tickGroup");

        var numTicks = Math.floor(this.options.timeMaxWidth/70);

        var xAxis = d3.svg.axis()
            .scale(this.timeScale)
            .orient('bottom')
            .innerTickSize(8)
            .outerTickSize(3)
            .ticks(this.timeticks.range, this.timeticks.stepSize ) // d3.time.years, 2 , no tickValues
            .tickFormat(this.timeticks.format ) // d3.time.format("%Y")
            ;
        ;
        tickGroup.call(xAxis);

        this.insertTimeTicks_timeValues = [];

        tickGroup.selectAll("text")
            .each(function(d,i){
                me.insertTimeTicks_timeValues.push(d);
            })
            .on("click",function(d,i){
                var curTime  = me.insertTimeTicks_timeValues[i];
                var nextTime = me.insertTimeTicks_timeValues[i+1];
                if(nextTime === undefined){
                    nextTime = me.timeRange_ms.max;
    //                curTime = me.insertTimeTicks_timeValues[i-1];
                }
                me.timeFilter_ms.min = curTime;
                me.timeFilter_ms.max = nextTime;
                me.yearSetXPos();
                me.updateItemFilterState_Time();
                me.getKshf().update();
            })
            ;

        tickGroup.selectAll(".tick.major text").style("text-anchor","middle");
    },
    /** insertTimeChartAxis_1 */
    insertTimeChartAxis_1: function(){
        var axisGroup = this.root.select("g.timeAxisGroup");
        var ggg = axisGroup.append("g").attr("class","selection_bar")  ;
        ggg.append("title").attr("class","xaxis_title");
        ggg.append("rect")
            .attr("y", -2.5)
            .attr("height", 7)

        var axisSubGroup=axisGroup.selectAll(".filter_handle")
            .data([1,2])
            .enter()
            .append("g")
            .attr("class", function(d,i) { return "filter_handle "+((i===0)?"filter_min":"filter_max"); });
        axisSubGroup
            .append("line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", this.getKshf().line_height*1.5-4)
            ;
        axisSubGroup
            .append("rect")
            .attr("class", "filter_nonselected")
            .attr("y",0)
            .attr("height",0)
            .on("click",function(){
                d3.event.stopPropagation();
            })
            ;

        var axisSubGroup=axisGroup.selectAll(".filter_handle");
        
        var axisSubSubGroup = axisSubGroup.append("g");
        axisSubSubGroup.append("title").attr("class","xaxis_title");
        axisSubSubGroup
            .append("path")
            .attr("transform",function(d,i) { return "translate("+(i===0?"0":"0")+",-12)";})
            .attr("d", function(d,i) { 
                return (i===0)?"M0 6 L0 20 L12 13 Z":"M0 6 L0 20 L-12 13 Z";
            })
    },
	/** insertTimeChartAxis */
    insertTimeChartAxis: function(){
        var me=this;
        var kshf_ = this.getKshf();

        var axisGroup = this.root.select("g.timeAxisGroup");
        var msPerTick;
        switch(this.timeticks.range){
            case d3.time.years:
                msPerTick = 31557600000; break;
            case d3.time.months:
                msPerTick = 31557600000/12; break;
            case d3.time.days:
                msPerTick = 31557600000/(12*30); break;
            default: break;
        }
        this.lengthPerTick = msPerTick*this.timeScale.range()[1]/
            (this.timeZoom_ms.max-this.timeZoom_ms.min);
    	
    	axisGroup.select(".selection_bar rect")
    		.on("mousedown", function(d, i) {
                var eeeeee = this;
                this.style.stroke = "orangered";
                me.divRoot.style('cursor','pointer');
                var mouseDown_x = d3.mouse(axisGroup[0][0])[0];
                var mousedown_filter = {
                    min: me.timeFilter_ms.min,
                    max: me.timeFilter_ms.max
                };
    			var timeFilter_ms = me.timeFilter_ms;
                var olddif=null;
    			me.divRoot.on("mousemove", function() {
    				var mouseMove_x = d3.mouse(axisGroup[0][0])[0];
    				var mouseDif = mouseMove_x-mouseDown_x;
    				var mousemove_filter = timeFilter_ms.min;
    				var stepDif = Math.round(mouseDif/me.lengthPerTick)*msPerTick;
    				if(stepDif===olddif ) { return; }
                    olddif=stepDif;
    				if(stepDif<0){
    					timeFilter_ms.min = mousedown_filter.min+stepDif;
    					if(timeFilter_ms.min<me.timeZoom_ms.min){
    						timeFilter_ms.min=me.timeZoom_ms.min;
    					}
    					timeFilter_ms.max=timeFilter_ms.min+(mousedown_filter.max-mousedown_filter.min);
    				} else {
    					timeFilter_ms.max = mousedown_filter.max+stepDif;
    					if(timeFilter_ms.max>me.timeZoom_ms.max){
    						timeFilter_ms.max=me.timeZoom_ms.max;
    					}
    					timeFilter_ms.min=timeFilter_ms.max-(mousedown_filter.max-mousedown_filter.min);
    				}
    				// TODO: make sure you don't exceed the boundaries
    				if(mousemove_filter.min!==timeFilter_ms.min){
                        kshf_.anim_barscale_duration = 0;
    					// update filter 
    					me.yearSetXPos();
                        kshf_.anim_barscale_duration = kshf_.anim_barscale_duration_default;
                        me.updateItemFilterState_Time();
                        me.skipUpdateTimeChartDotConfig = true;
    					kshf_.update();
                        me.skipUpdateTimeChartDotConfig = false;
    				}
    			}).on("mouseup", function(){
                    eeeeee.style.stroke= "";
                    me.divRoot.style( 'cursor', 'default' );
                    me.x_axis_active_filter = null;
                    // unregister mouse-move callbacks
                    me.divRoot.on("mousemove", null).on("mouseup", null);
                    me.refreshTimeChartDotConfig();
                    if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.TimeDragRange,kshf_.getFilteringState());
    			});
    		});
    	
    	// Filter handles
    	axisGroup.selectAll(".filter_handle g path")
    		.on("mousedown", function(d, i) {
                var eeeee = this;
    			me.x_axis_active_filter = (i===0)?'min':'max';
                this.style.stroke = 'orangered';
                me.divRoot.style('cursor','pointer');
    			var timeFilter_ms = me.timeFilter_ms; // shorthand
    			me.divRoot.on("mousemove", function() {
    				var mouseMove_x = d3.mouse(axisGroup[0][0])[0];

                    // convert mouse position to date
                    var time_ms = Math.floor(
                        me.timeZoom_ms.min+ 
                        (me.timeZoom_ms.max-me.timeZoom_ms.min)*(mouseMove_x / me.options.timeMaxWidth)
                        );

                    var time_dt = new Date(time_ms);

                    var time_ = null;
                    if(me.timeticks.range===d3.time.years){
                        time_ = kshf.Util.nearestYear(time_dt);
                    } else if(me.timeticks.range===d3.time.months){
                        time_ = kshf.Util.nearestMonth(time_dt);
                    } else if(me.timeticks.range===d3.time.days){
                        time_ = kshf.Util.nearestDay(time_dt);
                    }

                    // if it has the same value after mouse is moved, don't update any filter
                    if(timeFilter_ms[me.x_axis_active_filter] === time_.getTime()) return;
                    // update timeFilter_ms
                    timeFilter_ms[me.x_axis_active_filter] = time_.getTime();
                    
                    // Check agains min/max order, sawp if necessary
                    if(timeFilter_ms.max<timeFilter_ms.min){
                        eeeee.style.stroke = "";
                        me.x_axis_active_filter = (me.x_axis_active_filter==='min'?'max':'min');
                        var tttt= timeFilter_ms.max;
                        timeFilter_ms.max = timeFilter_ms.min;
                        timeFilter_ms.min = tttt;
                    }

                    // update filter 
                    kshf_.anim_barscale_duration = 0;
                    me.yearSetXPos();
                    kshf_.anim_barscale_duration = kshf_.anim_barscale_duration_default;
                    me.updateItemFilterState_Time();
                    
                    if(me.sortingOpt_Active.no_resort!==true)
                        me.divRoot.attr("canResort",true);

                    me.skipUpdateTimeChartDotConfig = true;
                    kshf_.update();
                    me.skipUpdateTimeChartDotConfig = false;
    			}).on("mouseup", function(){
                    eeeee.style.stroke = "";
    				me.divRoot.style( 'cursor', 'default' );
    				me.x_axis_active_filter = null;
    				// unregister mouse-move callbacks
    				me.divRoot.on("mousemove", null).on("mouseup", null);

                    me.refreshTimeChartDotConfig();
                    if(sendLog) {
                        if(me.x_axis_active_filter==="min")
                            sendLog(CATID.FacetFilter,ACTID_FILTER.TimeMinHandle,kshf_.getFilteringState());
                        else
                            sendLog(CATID.FacetFilter,ACTID_FILTER.TimeMaxHandle,kshf_.getFilteringState());
                    }
    			});
    		});
        this.yearSetXPos();
    },
    /** updateTimeChartBarsDots */
    updateTimeChartBarsDots: function(){
        var kshf_ = this.getKshf();
        var totalLeftWidth = kshf_.barMaxWidth+kshf_.scrollPadding+
            kshf_.scrollWidth+kshf_.sepWidth+kshf_.getRowTotalTextWidth();
    	var me = this;
        this.dom.timeBarTotal
            .transition().duration(kshf_.anim_barscale_duration)
            .attr("x",     function(d){ return totalLeftWidth+me.timeScale(d.xMin); })
            .attr("width", function(d){ return me.timeScale(d.xMax) - me.timeScale(d.xMin); })
            ;
    	// Update bar dot positions
    	this.dom.timeDots
            .transition().duration(kshf_.anim_barscale_duration)
    		.attr("cx", function(d){ return totalLeftWidth+me.timeScale(d.timePos) ; });
    },
    /** -- */
    getFilterMinDateText: function(){
        var dt = new Date(this.timeFilter_ms.min);
        return this.timeticks.format(dt);
    },
    /** -- */
    getFilterMaxDateText: function(){
        var dt = new Date(this.timeFilter_ms.max);
        return this.timeticks.format(dt);
    },
    /** -- */
    yearSetXPos: function() {
        var kshf_ = this.getKshf();
        // make sure filters do not exceed domain range
        this.timeFilter_ms.min = Math.max(this.timeFilter_ms.min,this.timeZoom_ms.min);
        this.timeFilter_ms.max = Math.min(this.timeFilter_ms.max,this.timeZoom_ms.max);

    	var minX = this.timeScale(this.timeFilter_ms.min);
    	var maxX = this.timeScale(this.timeFilter_ms.max);

        if(this.options.timeMaxWidth-minX>190){
            this.divRoot.select(".config_zoom")
                .style("float","left")
                .style("margin-left",minX+"px");
        } else{
            this.divRoot.select(".config_zoom")
                .style("float","right")
                ;
        }
    	
    	this.root.selectAll("g.filter_min")
            .transition().duration(kshf_.anim_barscale_duration)
    		.attr("transform", "translate("+minX+",0)" );
    	this.root.selectAll("g.filter_max")
            .transition().duration(kshf_.anim_barscale_duration)
    		.attr("transform", "translate("+maxX+",0)" );
    	this.root.selectAll(".selection_bar rect")
            .transition().duration(kshf_.anim_barscale_duration)
    		.attr("x", minX)
    		.attr("width", (maxX - minX));
    	this.root.select("g.filter_min .filter_nonselected")
            .transition().duration(kshf_.anim_barscale_duration)
    		.attr("x", -minX)
    		.attr("width", minX);
    	this.root.select("g.filter_max .filter_nonselected")
            .transition().duration(kshf_.anim_barscale_duration)
    		.attr("x", 0)
    		.attr("width", this.options.timeMaxWidth-maxX);
        this.root.select("g.filter_min")
            .attr("filtered",this.timeFilter_ms.min!==this.timeRange_ms.min);
        this.root.select("g.filter_max")
            .attr("filtered",this.timeFilter_ms.max!==this.timeRange_ms.max);
        this.refreshTimeChartFilterText();
        this.refreshTimeChartTooltip();
    },
    /** -- */
    refreshTimeChartFilterText: function(){
        var me = this;
        this.divRoot.attr("filtered_time",this.isFiltered_Time()?"true":"false");
        if(this.isFiltered_Time()){
            this.divRoot.select(".zoom_in").attr("disabled","false");
            if(this.filterSummaryBlock_Time===null || this.filterSummaryBlock_Time===undefined){
                this.filterSummaryBlock_Time = this.getKshf().listDisplay.insertFilterSummaryBlock();
                this.filterSummaryBlock_Time.select(".chartClearFilterButton")
                    .on("click",function(){ 
                        me.clearTimeFilter(); 
                        if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnSummary,
                            me.getKshf().getFilteringState(me.options.facetTitle));
                    });
            }
            this.filterSummaryBlock_Time.select(".filter_item")
                .html("from <b>"+this.getFilterMinDateText()+"</b> to <b>"+this.getFilterMaxDateText()+"</b>")
            ;
        } else if(this.filterSummaryBlock_Time){
            this.divRoot.select(".zoom_in").attr("disabled","true");
            if(this.filterSummaryBlock_Time){
                this.filterSummaryBlock_Time.attr("ready",false);
                setTimeout(function(){
                    if(me.filterSummaryBlock_Time===null) return;
                    me.filterSummaryBlock_Time[0][0].parentNode.removeChild(me.filterSummaryBlock_Time[0][0]);
                    me.filterSummaryBlock_Time = null;
                }, 300);
            }
        }
    },
    /** refreshTimeChartTooltip */
    refreshTimeChartTooltip: function(){
        var titleText = this.getKshf().itemsSelectedCt+ " selected "+this.getKshf().itemName+"from "+
                    this.getFilterMinDateText()+" to "+this.getFilterMaxDateText();
    	this.root.selectAll("title.xaxis_title").text(titleText);
    }
};


