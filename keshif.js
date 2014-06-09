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
var kshf = { };

var log2Console = function(s,chart){
    var d=Date.now();
    d = new Date(d);
    console.log(
        d.getFullYear()+"."+d.getMonth()+"."+d.getDate()+" "+
        d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()+
        " = "+s
       +(chart!==undefined?(" Chart:"+chart.options.facetTitle):"")
    );
}

kshf.surrogateCtor = function() {};

// http://stackoverflow.com/questions/4152931/javascript-inheritance-call-super-constructor-or-use-prototype-chain
kshf.extendClass = function(base, sub) {
  // Copy the prototype from the base to setup inheritance
  this.surrogateCtor.prototype = base.prototype;
  // Tricky huh?
  sub.prototype = new this.surrogateCtor();
  // Remember the constructor property was set wrong, let's fix it
  sub.prototype.constructor = sub;
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

// ***************************************************************************************************
// ITEM BASE OBJECT/PROPERTIES
// ***************************************************************************************************
kshf.Item = function(d, idIndex, primary){
    // the main data within item
    this.data = d;
    this.idIndex = idIndex; // TODO: Items don't need to have ID index, only one per table is enough!
	this.selected = true;
    // used by filters
	this.activeItems = 0;
    this.barValue = 0;
    this.barValueMax = 0;
	this.items = []; // set of assigned primary items
    if(primary){
        // 1 true value is added for global text search
        this.filters = [true];
        this.barCount = 1; // 1 by default
        this.mappedRows = [true];
        this.mappedData = [true];
        this.dots = [];
        this.cats = [];
    }
};
kshf.Item.prototype.id = function(){
    return this.data[this.idIndex];
};
kshf.Item.prototype.updateSelected = function(){
    var i,len,f=this.filters;
    var oldSelected = this.selected;
    var me=this;
    // checks if all filter results are true
    this.selected=true;
    this.filters.forEach(function(f){ me.selected=me.selected&&f; });
    
    if(this.selected===true && oldSelected===false){
        kshf.itemsSelectedCt++;
        this.mappedRows.forEach(function(chartMapping){
            if(chartMapping === undefined) return;
            if(chartMapping === true) return;
            chartMapping.forEach(function(m){
                m.activeItems++;
                m.barValue+=me.barCount;
                m.sortDirty=true;
            });
        });
        this.dots.forEach(function(d){d.setAttribute('display',"true");});
    } else if(this.selected===false && oldSelected===true){
        kshf.itemsSelectedCt--;
        this.mappedRows.forEach(function(chartMapping){
            if(chartMapping === undefined) return;
            if(chartMapping === true) return;
            chartMapping.forEach(function(m){
                m.activeItems--;
                m.barValue-=me.barCount;
                m.sortDirty=true;
            });
        });
        this.dots.forEach(function(d){d.setAttribute('display',"false");});
    }
    return this.selected;
};
kshf.Item.prototype.highlightDots = function(){
    this.dots.forEach(function(d){d.setAttribute('highlight',true);});
}
kshf.Item.prototype.highlightCategories = function(){
    this.cats.forEach(function(d){d.setAttribute('highlight',"true");});
}
kshf.Item.prototype.highlightOnList = function(){
    if(this.listItem!==undefined) this.listItem.setAttribute("highlight",true);
}
kshf.Item.prototype.highlightAttributes = function(){
    this.highlightDots();
    this.highlightCategories();
    this.highlightOnList();
}

kshf.Item.prototype.nohighlightDots = function(){
    this.dots.forEach(function(d){d.setAttribute('highlight',false);});
}
kshf.Item.prototype.nohighlightCategories = function(){
    this.cats.forEach(function(d){d.setAttribute('highlight',"false");});
}
kshf.Item.prototype.nohighlightOnList = function(){
    this.listItem.setAttribute("highlight",false);
}
kshf.Item.prototype.nohighlightAttributes = function(){
    this.nohighlightDots();
    this.nohighlightCategories();
    this.nohighlightOnList();
}

// ***************************************************************************************************
// DOCUMENT LOADING
// ***************************************************************************************************

// Loads all source sheets
// Once everything is loaded, kshf.createCharts() will be called
kshf.loadSource = function(){
    if(this.source.callback){
        this.source.callback();
        return;
    }
	for(var i=0; i<this.source.sheets.length; i++){
        var sheet = this.source.sheets[i];
        if(sheet.id===undefined){ sheet.id="id"; }
        if(i==0){
            sheet.primary = true;
            this.primaryTableName = sheet.name;
        }
        if(sheet.tableName===undefined){
            sheet.tableName = sheet.name;
        }
        if(this.source.gdocId){
            this.loadSheet_Google(sheet);
        } else if(this.source.dirPath){
            this.loadSheet_File(sheet);
        } else if (sheet.data) { // load data from memory - ATR
            this.loadSheet_Memory(sheet);
        }
	}
};

kshf.loadSheet_Google = function(sheet){
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
    if(sheet.query){
        googleQuery.setQuery(sheet.query);
    }

    googleQuery.send( function(response){
        if(response.isError()) {
            d3.select(".kshf.layout_infobox div.status_text span")
                .text("Cannot load data");
            d3.select(".kshf.layout_infobox img")
                .attr("src",me.dirRoot+"img/alert.png")
                .style("height","40px");
            d3.select(".kshf.layout_infobox div.status_text div")
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
        // create the data array
        arr.length = dataTable.getNumberOfRows(); // pre-allocate for speed
        for(r=0; r<dataTable.getNumberOfRows() ; r++){
            var c=[];
            c.length = numCols; // pre-allocate for speed
            for(i=0; i<numCols ; i++) { c[i] = dataTable.getValue(r,i); }
            // push unique id as the last column if necessary
            if(idIndex===numCols) c.push(itemId++);
            arr[r] = new kshf.Item(c,idIndex,sheet.primary);
        }

        kshf.createColumnNames(sheet.tableName);
        for(j=0; j<dataTable.getNumberOfColumns(); j++){
            kshf.insertColumnName(sheet.tableName,dataTable.getColumnLabel(j).trim(),j);
        }
        me.finishDataLoad(sheet,arr);
    });
};

// The only place where jquery - ajax load - is used!
kshf.loadSheet_File = function(sheet){
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
                c=kshf.unescapeCommas(c);
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
                    arr.push(new kshf.Item(c,idIndex,sheet.primary));
                }
            }
            me.finishDataLoad(sheet, arr);
        }
    });
};

// load data from memory - ATR
kshf.loadSheet_Memory = function(sheet){
    var i,j;
    var arr = [];
    var idIndex = -1;
    var itemId=0;
    this.createColumnNames(sheet.tableName);
    for(i=0; i<sheet.data.length; i++){
        var c = sheet.data[i];
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
            arr.push(new kshf.Item(c,idIndex,sheet.primary));
        }
    }
    this.finishDataLoad(sheet,arr);
};

kshf.createColumnNames = function(tableName){
    kshf.dt_ColNames    [tableName] = {};
    kshf.dt_ColNames_Arr[tableName] = [];
};
kshf.insertColumnName = function(tableName, colName, index){
    kshf.dt_ColNames    [tableName][colName] = index;
    kshf.dt_ColNames_Arr[tableName][index  ] = colName;
};

kshf.finishDataLoad = function(sheet,arr) {
    kshf.dt[sheet.tableName] = arr;
    if(sheet.primary){
        kshf.items = arr;
        kshf.itemsSelectedCt = arr.length;
    }
    var id_table = {};
    arr.forEach(function(r){id_table[r.id()] = r;});
    kshf.dt_id[sheet.tableName] = id_table;
    kshf.incrementLoadedTableCount();
};

kshf.incrementLoadedTableCount = function(){
    var me=this;
    this.source.loadedTableCount++;
    d3.select(".kshf.layout_infobox div.status_text div")
        .text("("+this.source.loadedTableCount+"/"+this.source.sheets.length+")");
        // finish loading
    if(this.source.loadedTableCount===this.source.sheets.length) {

        // update primary item stuff if necessary
        var mainTable = this.dt[this.getMainChartName()];
        var colId = this.dt_ColNames[this.getMainChartName()][this.primItemCatValue];

        if(typeof this.primItemCatValue =='string'){
            mainTable.forEach(function(d){d.barCount=d.data[colId];});
        }

        d3.select(".kshf.layout_infobox div.status_text span")
            .text("Creating Keshif browser");
        d3.select(".kshf.layout_infobox div.status_text div")
            .text("");
        window.setTimeout(function() {
            me.createCharts();
        }, 50);
    }
}


// Sends the spreadsheet query, retrieves the result in asynch mode, prepares the data and updates visualization when all data is loaded.
kshf.createTableFromTable = function(srcTableName, dstTableName, mapFunc){
    var i,uniqueID=0;
    kshf.dt_id[dstTableName] = {};
    kshf.dt[dstTableName] = [];
    var dstTable_Id = kshf.dt_id[dstTableName];
    var dstTable = kshf.dt[dstTableName];

    var srcData=srcTableName;
    for(i=0 ; i<srcData.length ; i++){
        var v = mapFunc(srcData[i]);
        if(v==="" || v===undefined || v===null) { continue; }
        if(v instanceof Array) {
            for(var j=0; j<v.length; j++){
                var v2 = v[j];
                if(v==="" || v===undefined || v===null) { continue; }
                if(!dstTable_Id[v2]){
                    var a = [uniqueID++,v2];
                    var item = new kshf.Item(a,1);
                    dstTable_Id[v2] = item;
                    dstTable.push(item);
                }   
            }
        } else {
            if(!dstTable_Id[v]){
                var a = [uniqueID++,v];
                var item = new kshf.Item(a,1);
                dstTable_Id[v] = item;
                dstTable.push(item);
            }   
        }
    }
};

// Given a list of columns which hold multiple IDs, breaks them into an array
kshf.cellToArray = function(dt, cols, splitExpr, convertInt){
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
};
// give it a list split by, it will reconstruct "... , ..." cases back
kshf.unescapeCommas = function(c){
    var k=0,j;
    var escaped=false;
    var cell;
    var a=[];
    for(j=0; j<c.length;j++){
        if(escaped){
            cell+=","+c[j];
            if(c[j][c[j].length-1]==="\""){
                escaped=false;
            } else {
                continue;
            }
        } else {
            if(c[j][0]==="\""){
                escaped = true;
                cell = c[j].slice(1,c[j].length-1);
                continue;
            }
            cell = c[j];
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
    }
    return a;
};


// ***********************************************************************************************************
// WHIZ LIST CHART
// ***********************************************************************************************************

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

kshf.getFilteringState = function(facetTitle, itemInfo) {
    var r={
        results : this.itemsSelectedCt,
        textSrch: this.root.select("input.bigTextSearch").value
    };

    // facet title parameters
    if(facetTitle !== null) r.facet = facetTitle;

    r.filtered="";
    r.selected="";

    r.itemInfo = itemInfo;

    var i;
    for(i=0; i<this.charts.length; i++){
        var c = this.charts[i];
        // include time range if time is filtered
        if(c.type==='scatterplot'){
            if(c.isFiltered_Time()) {
                r.timeFltr = 1;
            }
        }
        if(c.catCount_Selected!==0){
            if(r.filtered!=="") { r.filtered+="x"; r.selected+="x"; }
            r.filtered+=i;
            r.selected+=c.catCount_Selected;
        }
    }

    if(r.filtered==="") r.filtered=null;
    if(r.selected==="") r.selected=null;

    return r;
};

kshf.list = function(_kshf, config, root){
    var i=0;
    var me = this;
    this.parentKshf = _kshf;
    this.dragSrcEl = null;
    this.dom = {};
    
    // List sorting options
    this.sortOpts = config.sortOpts;
    this.sortOpts.forEach(function(sortOpt){
        if(sortOpt.value===undefined) sortOpt.value = me.parentKshf.columnAccessFunc(sortOpt.name);
        if(!sortOpt.label) sortOpt.label = sortOpt.value;
        sortOpt.valueType = me.sortValueType(sortOpt.value);;
    });
    this.sortOpt_Active = this.sortOpts[0];
    this.displayType = 'list';
    if(config.displayType==='grid') this.displayType = 'grid';

    this.sortColWidth = config.sortColWidth;

    if(config.textSearch!==undefined){
        if(config.textSearchFunc===undefined){
            config.textSearchFunc = _kshf.columnAccessFunc(config.textSearch);
        }
        if(config.textSearch[0]==="*")
            config.textSearch = config.textSearch.substring(1);
        // decapitalize
        config.textSearch= config.textSearch.charAt(0).toLowerCase() + config.textSearch.slice(1);
    }
    if(config.content!==undefined){
        config.contentFunc = _kshf.columnAccessFunc(config.content);
    }

    this.hideTextSearch = (config.textSearchFunc===undefined);

    this.contentFunc = config.contentFunc;

    this.detailsToggle = config.detailsToggle;
    if(this.detailsToggle === undefined) { this.detailsToggle = false; }
    this.detailsDefault = config.detailsDefault;
    if(this.detailsDefault === undefined) { this.detailsDefault = false; }

	this.listDiv = root.append("div").attr("class","listDiv");

    this.listDiv.attr('showAll',this.detailsDefault?'false':'true');
    
    var listHeader=this.listDiv.append("div").attr("class","listHeader");
    var listHeaderTopRow=listHeader.append("div").attr("class","topRow");
    var count_wrap = listHeaderTopRow.append("span").attr("class","listheader_count_wrap").style('width',me.sortColWidth+"px");;
    count_wrap.append("span").attr("class","listheader_count_bar");
    count_wrap.append("span").attr("class","listheader_count");
    listHeaderTopRow.append("span").attr("class","listheader_itemName").html(kshf.itemName);
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
                kshf.items.forEach(function(item){
                    var i=0
                    var f = true;
                    for(i=0 ; i<v.length; i++){
                        f = f && config.textSearchFunc(item).toLowerCase().indexOf(v[i])!==-1;
                        if(f===false) break;
                    }
                    item.filters[0] = f;
                    item.updateSelected();
                });
                kshf.update();
                x.timer = null;
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.MainTextSearch,kshf.getFilteringState());
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

                // No timeout necessary. Clear selection rightaway.
                // go over all the items in the list, search each keyword separately
                kshf.items.forEach(function(item){
                    item.filters[0] = true;
                    item.updateSelected();
                });
                kshf.update();
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.MainTextSearch,kshf.getFilteringState());
            });
    }

    var listColumnRow=listHeader.append("div").attr("class","listColumnRow");

    listColumnRow.append("select")
        .attr("class","listSortOptionSelect")
        .style("width",(this.sortColWidth)+"px")
        .on("change", function(){
            me.sortOpt_Active = me.sortOpts[this.selectedIndex];
            // trigger sorting reorder
            me.sortItems();
            // re-order dom
            me.reorderItems();
            // update sort column labels
            me.dom.listItems.selectAll(".listsortcolumn")
                .html(function(d){ return me.sortOpt_Active.label(d); });
            me.updateList();
        })
        .selectAll("input.list_sort_label")
            .data(this.sortOpts)
        .enter().append("option")
            .attr("class", "list_sort_label")
            .text(function(d){ return d.name; })
            ;

    // add collapse list feature
    if(this.detailsToggle===true){
       var x=listColumnRow.append("div")
            .attr("class","itemstoggledetails");
        x.append("span").attr("class","items_details_on").html("[+]")
            .attr("title","Show details")
            .on("click", function(d){
                me.dom.listItems.each(function(d){ d3.select(this).attr('details', true);});
                me.listDiv.attr('showAll','false');
            });
        x.append("span").attr("class","items_details_off").html("[-]")
            .attr("title","Hide details")
            .on("click", function(d){
                me.dom.listItems.each(function(d){ d3.select(this).attr('details', false); });
                me.listDiv.attr('showAll','true');
            });
    }

    this.dom_filterblocks = listColumnRow.append("span").attr("class","filter-blocks");

    this.listDiv.append("div").attr("class","listItemGroup");

    this.sortItems();
    this.insertItems();
};



Array.prototype.repeat= function(what, L){
    while(L) { this[--L]= what; }
    return this;
};

// after you re-sort the primary table or change item visibility, call this function
kshf.list.prototype.updateShowListGroupBorder = function(){
    var me = this;
    if(this.displayType==='list') {
        if(this.sortOpt_Active.noGroupBorder !== true){
            // go over item list
            var i=0,iPrev=-1;
            var sortValueFunc = this.sortOpt_Active.value;
            var sortValueType = this.sortOpt_Active.valueType;
            for(;i<kshf.items.length;i++){
                var item=kshf.items[i];
                // skip unselected items
                if(!item.selected) continue;
                // show all sort column labels by default 
                item.showListSortColumn = true;
                // first selected item
                if(iPrev===-1){ iPrev=i; continue; }
                var pPrev = kshf.items[iPrev];
                iPrev=i;

                var showBorder = (kshf.compareListItems(item,pPrev,sortValueFunc,sortValueType)!==0);
                item.listItem.style.borderTopWidth = showBorder?"4px":"0px";
            }
        } else {
            this.dom.listItems.style("border-top-width", "0px");
        }
    }
};

kshf.columnAccessFunc = function(columnName){
    var mainTableName = this.getMainChartName();
    var colId = this.dt_ColNames[mainTableName][columnName];
    return function(d){ return d.data[colId]; }
}

kshf.list.prototype.sortValueType = function(sortValueFunc){
    // 0: string, 1: date, 2: others
    var sortValueType_, sortValueType_temp, same;
    
    // find appropriate sortvalue type
    for(var k=0, same=0; true ; k++){
        if(same===3 || k===this.parentKshf.items.length){
            sortValueType_ = sortValueType_temp;
            break;
        }
        var item = this.parentKshf.items[k];
        var f = sortValueFunc(item);
        var sortValueType_temp2;
        switch(typeof f){
        case 'string': sortValueType_temp2 = 0; break;
        case 'number': sortValueType_temp2 = 2; break;
        case 'object': 
            if(f instanceof Date) 
                sortValueType_temp2 = 1; 
            else 
                sortValueType_temp2=2;
            break;
        default: sortValueType_temp2 = 2; break;
        }

        if(sortValueType_temp2===sortValueType_temp){
            same++;
        } else {
            sortValueType_temp = sortValueType_temp2;
            same=0;
        }
    }
    return sortValueType_;
}

kshf.compareListItems = function(a, b, sortValueFunc, sortValueType){
    var dif;
    var f_a = sortValueFunc(a);
    var f_b = sortValueFunc(b);
    if(sortValueType===0) {
        dif = f_a.localeCompare(f_b);
    } else if(sortValueType===1) {
        if(f_a===null) return -1;
        if(f_b===null) return 1;
        dif = f_b.getTime() - f_a.getTime();
    } else {
        dif = f_b-f_a;
    }
    return dif;
}

kshf.list.prototype.sortItems = function(){
    var sortValueFunc = this.sortOpt_Active.value;
    var sortValueType = this.sortOpt_Active.valueType;
	this.parentKshf.items.sort(function(a,b){
        // do not need to process unselected items, their order does not matter
        if(!a.selected||!b.selected){ return 0; }
        var dif=kshf.compareListItems(a,b,sortValueFunc,sortValueType);
        if(dif!==0) { return dif; }
        return b.id()-a.id(); // use unique IDs to add sorting order as the last option
	});
};

kshf.list.prototype.insertItems = function(){
    var me = this;

    this.dom.listItems = this.listDiv.select(".listItemGroup").selectAll("div.listItem")
        // if content Func is not defined, provide an empty list
        .data((this.contentFunc===undefined?[]:kshf.items), function(d){ return d.id(); })
    .enter()
        .append("div")
        .attr("class","listItem")
        .attr("details",this.detailsDefault?"true":"false")
        .attr("itemID",function(d){return d.id();})
        // store the link to DOM in the data item
        .each(function(d){ d.listItem = this; })
        .on("mouseover",function(d,i){
            d3.select(this).attr("highlight","true");
            d.highlightAttributes();
        })
        .on("mouseout",function(d,i){
            d3.select(this).attr("highlight","false");
            // find all the things that  ....
            d.nohighlightAttributes();
        });

    if(this.displayType==='list'){
        this.dom.listItems
            .append("div")
            .attr("class","listcell listsortcolumn")
            .style("width",this.sortColWidth+"px")
            .html(function(d){ return me.sortOpt_Active.label(d); });
            ;
    }

    if(this.detailsToggle){
        var x= this.dom.listItems
            .append("div")
            .attr("class","listcell itemtoggledetails");
        x.append("span").attr("class","item_details_on").html("[+]")
            .attr("title","Show details")
            .on("click", kshf.listItemDetailToggleFunc);
        x.append("span").attr("class","item_details_off").html("[-]")
            .attr("title","Hide details")
            .on("click", kshf.listItemDetailToggleFunc);
    }

    this.dom.listItems_Content = this.dom.listItems
        .append("div")
        .attr("class","content")
        .html(function(d){ return me.contentFunc(d);});
};

kshf.listItemDetailToggleFunc = function(d){
    var nd = d3.select(this)[0][0], i=0;
    while(true){
        if(nd===undefined) return;
        var details = nd.getAttribute('details');
        if(details==="true"){
            if(sendLog) sendLog(CATID.ItemBased,ACTID_ITEM.Collapse,{itemID:d.id()});
            nd.setAttribute('details', false);
        }
        if(details==="false"){
            if(sendLog) sendLog(CATID.ItemBased,ACTID_ITEM.Show,{itemID:d.id()});
            nd.setAttribute('details', true);
        }
        nd = nd.parentNode;
    }
}
kshf.listItemDetailToggleFunc2 = function(t){
    var nd = d3.select(t)[0][0], i=0;
    while(true){
        if(nd===undefined) return;
        var details = nd.getAttribute('details');
        var _id = nd.getAttribute('itemID');
        if(details==="true"){
            if(sendLog) sendLog(CATID.ItemBased,ACTID_ITEM.Collapse,{itemID:_id});
            nd.setAttribute('details', false);
        }
        if(details==="false"){
            if(sendLog) sendLog(CATID.ItemBased,ACTID_ITEM.Show,{itemID:_id});
            nd.setAttribute('details', true);
        }
        nd = nd.parentNode;
    }
}

kshf.list.prototype.reorderItems = function(){
	this.listDiv.selectAll("div.listItem")
		.data(kshf.items, function(d){ return d.id(); })
		.order();
};
kshf.list.prototype.updateItemVisibility = function(){
    var showType=this.displayType==='list'?"block":"inline-block";
	this.dom.listItems.style("display",function(d){return (d.selected)?showType:"none"; });
};

kshf.list.prototype.updateList = function(){
    // evaluates column information for each item. TODO: cache
    this.updateShowListGroupBorder();
    d3.select(".listheader_count").text(function(){
        if(kshf.itemsSelectedCt===0) { return "No"; }
        return kshf.itemsSelectedCt;
    });
    d3.select(".listheader_count_bar").transition().style("width",function(){ 
        return (kshf.listDisplay.sortColWidth*kshf.itemsSelectedCt/kshf.items.length)+"px";
    });
};





// ***********************************************************************************************************
// WHIZ MAIN CLASS
// ***********************************************************************************************************


kshf.init = function (options) {
    var me = this;
    // BASIC OPTIONS
    this.chartTitle = options.chartTitle;
	this.queryURL_base = 'https://docs.google.com/spreadsheet/tq?key=';
	this.charts = [];
    this.dt = {};
    this.dt_id = {};
    this.dt_ColNames = {};
    this.dt_ColNames_Arr = {};
    this.num_of_charts = 0;
    this.maxFilterID = 1; // 1 is used for global search
    this.categoryTextWidth = options.categoryTextWidth;
    this.barMaxWidth = 0;
    if(this.categoryTextWidth===undefined){
        this.categoryTextWidth = 115;
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

    if(typeof options.barChartWidth === 'number'){
        this.barChartWidth = options.barChartWidth;
    }

    this.scrollPadding = 5;
    this.scrollWidth = 10;
    this.sepWidth = 10;
    if(options.listMaxColWidthMult){
        kshf.listMaxColWidthMult = options.listMaxColWidthMult;
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

    this.time_animation_barscale = 400;
    this.layout_animation = 500;
    
    this.skipFacet = {};
    if(options.columnsSkip){
        for(var i=0; i<options.columnsSkip.length; i++){
            this.skipFacet[options.columnsSkip[i]] = true;
        }
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
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearAllEscape,kshf.getFilteringState());
            }
            if(e.shiftKey || e.altKey || e.ctrlKey || e.ctrlKey){
                d3.select(this).attr("kb_modifier",true);
            }
        }).on("keyup",function(){
            var e = d3.event;
            if(e.shiftKey===false && e.altKey===false && e.ctrlKey===false && e.ctrlKey===false){
                d3.select(this).attr("kb_modifier",false);
            }
        })
        ;

    if(options.itemName!==undefined){
        this.itemName = options.itemName;
    } else {
        this.itemName = this.getMainChartName();
    }
    
    this.dirRoot = "./";
    if(options.dirRoot !== undefined){
        this.dirRoot = options.dirRoot;
    }
    this.showDataSource = true;
    if(options.showDataSource!==undefined){
        this.showDataSource = options.showDataSource;
    }
    this.forceHideBarAxis = false;
    if(options.forceHideBarAxis!==undefined){
        this.forceHideBarAxis = options.forceHideBarAxis;
    }

    var creditString="";
    creditString += "<div align=\"center\">";
    creditString += "Browser created by <span class=\"libName\">Keshif<\/span> library.";
    creditString += "<\/br>";
    creditString += " <div align=\"left\" class=\"boxinbox features\">";
    creditString += " <ul class=\"credits_features\">";
    creditString += "     <li>Left: categories. Top: time. All: in sync.<\/li>";
    creditString += "     <li>Mix and match your search. \"And\" selection across different filters, \"or\" inside same filter with multiple categories.<\/li>";
    creditString += "     <li>Text search: Look up all items in the collections, or filter categories.<\/li>";
    creditString += "     <li>Time filtering: Drag &amp; drop handles, set your range.<\/li>";
    creditString += " <\/ul>";
    creditString += " <\/div>";
    creditString += "<\/div>";
    creditString += "";
    creditString += "<div align=\"center\" class=\"boxinbox\" style=\"font-size:0.9em\">";
    creditString += "Get keshif source code from <a href=\"http:\/\/www.github.com\/adilyalcin\/Keshif\" target=\"_blank\"><img alt=\"github\" src=\""+this.dirRoot+"img\/gitHub.png\" height=\"20\" style=\"position:relative; top:5px\"><\/a> and use it on your own page.<\/br>";
    creditString += "<iframe src=\"http:\/\/ghbtns.com\/github-btn.html?user=adilyalcin&repo=Keshif&type=watch&count=true&size=large\" allowtransparency=\"true\" frameborder=\"0\" scrolling=\"0\" width=\"152px\" height=\"30px\"><\/iframe>";
    creditString += "<iframe src=\"http:\/\/ghbtns.com\/github-btn.html?user=adilyalcin&repo=Keshif&type=fork&count=true&size=large\" allowtransparency=\"true\" frameborder=\"0\" scrolling=\"0\" width=\"152px\" height=\"30px\"><\/iframe>";
    creditString += "<\/div>";
    creditString += "";
    creditString += "<div style=\"width: 450px;\" align=\"center\" class=\"boxinbox project_credits\">";
    creditString += " Developed by:<br\/>";
    creditString += " <a href=\"http:\/\/www.adilyalcin.me\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/credit-1_01.png\" style=\"height:50px\"><\/a>";
    creditString += " <img src=\""+this.dirRoot+"img\/credit-1_02.png\" style=\"height:50px; padding:0px 4px 0px 4px\">";
    creditString += " <a href=\"http:\/\/www.cs.umd.edu\/hcil\/\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/credit-1_03.png\" style=\"height:50px\"><\/a>";
    creditString += " <img src=\""+this.dirRoot+"img\/credit-1_04.png\" style=\"height:50px;padding:0px 4px 0px 4px\">";
    creditString += " <a href=\"http:\/\/www.umd.edu\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/credit-1_05.png\" style=\"height:50px\"><\/a>";
    creditString += "<\/div>";
    creditString += "";
    creditString += "<div align=\"center\" class=\"boxinbox project_3rdparty\">";
    creditString += " 3rd party libraries and APIs:<br\/>";
    creditString += " <a href=\"http:\/\/d3js.org\/\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/3rdparty_01.png\" style=\"width:70px; top:0px\"><\/a>";
    creditString += " <a href=\"http:\/\/jquery.com\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/3rdparty_02.png\" style=\"width:150px; top: -5px;\"><\/a>";
    creditString += " <a href=\"https:\/\/developers.google.com\/chart\/\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/3rdparty_03.png\" style=\"width:60px\"><\/a>";
    creditString += "<\/div><br\/>";
    creditString += "";
    creditString += "<div align=\"center\" class=\"project_fund\">";
    creditString += "<i>Keshif<\/i> (<a target=\"_blank\" href=\"http:\/\/translate.google.com\/#auto\/en\/ke%C5%9Fif\">keşif<\/a>) means discovery and exploration in Turkish.<br\/><br\/>";
    creditString += "Research made practical. Funded in part by <a href=\"http:\/\/www.huawei.com\">Huawei<\/a>. <\/div>";
    creditString += "";

    if(options.showResizeCorner === true){
        this.layout_resize = this.root.append("div").attr("class", "kshf layout_resize")
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
               });
               d3.select("body").on("mouseup", function(){
                   if(sendLog) sendLog(CATID.Other,ACTID_OTHER.Resize);
                   me.root.style('cursor','default');
                   // unregister mouse-move callbacks
                   d3.select("body").on("mousemove", null);
                   d3.select("body").on("mouseup", null);
               });
               d3.event.preventDefault();
           }) 
    }

    this.layout_infobox = this.root.append("div").attr("class", "kshf layout_infobox");
    this.layout_infobox.append("div")
        .attr("class","infobox_background")
        .on("click",function(){
            me.layout_infobox.style("display","none");
            me.layout_infobox.select("div.infobox_credit").style("display","none");
            me.layout_infobox.select("div.infobox_datasource").style("display","none");
        });
    var loadingBox = this.layout_infobox.append("div").attr("class","infobox_content infobox_loading");
    loadingBox.append("img")
        .attr("class","status")
        .attr("src",this.dirRoot+"img/loading.gif")
        ;
    var hmmm=loadingBox.append("div")
        .attr("class","status_text");
    hmmm.append("span")
        .text("Loading...");
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

    if(this.chartTitle!==undefined){
        this.insertChartHeader();
    }

    var subRoot = this.root.append("div").style("position","relative");

    this.layoutBackground = subRoot.append("div").attr("class","kshf layout_left_background");

    this.layoutTop = subRoot.append("div").attr("class", "kshf layout_top");

    this.layoutLeft  = subRoot.append("div").attr("class", "kshf layout_left");
    this.layoutRight = subRoot.append("div").attr("class", "kshf layout_right");
	
    this.loadSource();
};

kshf.getMainChartName = function() {
    return this.source.sheets[0].name;
}

kshf.createCharts = function(){
    var me=this;
    if(this.loadedCb!==undefined) { this.loadedCb(); }

    if(this.chartDefs===undefined){
        this.chartDefs = [];
        var colNames = this.dt_ColNames_Arr[this.getMainChartName()];
        colNames.forEach(function(colName){
            if(colName===me.source.sheets[0].id) return;
            if(me.skipFacet[colName]===true) return;
            if(colName[0]==="*") return;
            me.chartDefs.push({facetTitle: colName});
        });
    }
    // TODO: Find the first column that has a date value, set it the time component of first chart

    for(var i=0; i<this.chartDefs.length; i++){
        this.addBarChart(this.chartDefs[i]);
    }
    this.charts.forEach(function(chart){
        chart.init_DOM();
    });
    this.createListDisplay(this.listDef);
    this.loaded = true;
    this.updateLayout();
    this.update();
    // hide infobox
    d3.select(".kshf.layout_infobox").style("display","none");
    d3.select("div.infobox_loading").style("display","none");

    if(this.readyCb!==undefined) { this.readyCb(); }
}

kshf.insertChartHeader = function(){
    var me = this;
    this.layoutHeader = this.root.append("div").attr("class", "kshf layout_header");

    var dom_filter_header=this.root.select(".layout_header").append("div")
            .attr("class","filter_header")
            .style("height",(this.line_height-3)+"px");

    dom_filter_header.append("span").attr("class","leftBlockAdjustSize")
        .attr("title","Drag to adjust panel width")
        .style("height",(kshf.line_height-4)+"px")
        .on("mousedown", function (d, i) {
            me.root.style('cursor','ew-resize');
            var mouseDown_x = d3.mouse(this.parentNode.parentNode)[0];
            var mouseDown_width = me.width_leftPanel_bar;
            me.root.on("mousemove", function() {
                var mouseMove_x = d3.mouse(this)[0];
                var mouseDif = mouseMove_x-mouseDown_x;
                me.time_animation_barscale = 0;
                me.layout_animation = 0;
                me.setBarWidthLeftPanel(mouseDown_width+mouseDif);
                me.updateAllTheWidth();
                me.layout_animation = 500;
            });
            me.root.on("mouseup", function(){
                if(sendLog) sendLog(CATID.Other,ACTID_OTHER.LeftPanelWidth,{panelWidth:me.width_leftPanel_bar});
                me.root.style('cursor','default');
                // unregister mouse-move callbacks
                me.root.on("mousemove", null);
                me.root.on("mouseup", null);
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

    left_align.append("span").attr("class","filters_text").text("Filters"); //↓
    // insert clear all option
    var s= left_align.append("span")
        .attr("class","filter-block-clear")
        .attr("filtered_row","false")
        .text("Clear all")
        .on("click",function(){ kshf.clearAllFilters(); })
        ;
    s.append("div")
        .attr("class","chartClearFilterButton allFilter")
        .attr("title","Clear all")
        .text("x")
        ;
    dom_filter_header.append("span")
        .attr("class","barChartMainInfo")
        .text(this.primItemCatValue===null?"⇒Item Count ":("⇒Total "+this.primItemCatValue))//⟾
        .append("span")
        .attr("class","refreshbarscales")
        .attr("width","13")
        .style("margin-bottom","-2px")
        .style("display","none")
        .on("click",function(){
            kshf.clearAllFilters();
            if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearAll,kshf.getFilteringState());
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
            if(sendLog) sendLog(CATID.Other,ACTID_OTHER.InfoButton);
            me.root.select(".layout_infobox").style("display","block");
            me.root.select("div.infobox_credit").style("display","block");
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
                    me.root.select(".layout_infobox").style("display","block");
                    me.root.select("div.infobox_datasource").style("display","block");
                }
                if(sendLog) sendLog(CATID.Other,ACTID_OTHER.DataSource);
            })
//          .text("Source")
          .append("img")
            .attr("class","datasource")
            .attr("title","Open Data Source")
            .attr("src",this.dirRoot+"img/datasource.png")
            ;
        }


    this.layoutHeader.append("span")
        .attr("class","title")
        .text(this.chartTitle);
}

kshf.addBarChart = function(options){
    options.layout = (options.timeTitle!==undefined)?this.layoutTop:this.layoutLeft;
    if(options.catTableName===undefined){
        options.catTableName = kshf.primaryTableName;
        options.generateRows = true;
    }
    if(options.sortingFuncs===undefined){
        options.sortingFuncs = [{ func:kshf.sortFunc_ActiveCount_TotalCount }];
    }
    options.rowTextWidth = this.categoryTextWidth;
    this.charts.push(new kshf.BarChart(this,options));
};

kshf.addRangeChart = function(options){
    options.layout = this.layoutLeft;
    this.charts.push(
        new kshf.RangeChart(options)
    );
}

kshf.update = function () {
    var filteredCount=0;

    // if running for the first time, do stuff
    if(this.firsttimeupdate === undefined){
        this.items.forEach(function(item){item.updateSelected();});
        this.firsttimeupdate = true; 
    }

    kshf.time_animation_barscale = 400;

    // since some items may no longer be visible, you need to update list column headers too
    if(this.listDisplay){
        if(this.listDisplay.hideTextSearch!==true) {
            if(this.listDisplay.listDiv.select("input.bigTextSearch")[0][0].value!=="") filteredCount++;
        }
        this.listDisplay.updateItemVisibility();
        // not optimal too
        this.listDisplay.updateList();
    }

	// update each widget within
    this.charts.forEach(function(chart){
        chart.updateBarAxisScale();
        chart.updateSelf();
        filteredCount += chart.getFilteredCount();
    });

    // "clear all" filter button
    this.root.select(".filter-block-clear")
        .style("display",(filteredCount>0)?"inline-block":"none");

    if(this.updateCb){
        this.updateCb();
    }
};

kshf.filterFacetAttribute = function(chartId, itemId){
    var chart = this.charts[chartId];
    chart.filterRow(chart.getData()[itemId]);
}

kshf.dif_activeItems = function(a,b){
	return b.activeItems - a.activeItems;
};
kshf.dif_barValue = function(a,b){
    return b.barValue - a.barValue;
};

kshf.sortFunc_ActiveCount_TotalCount = function(a,b){ 
    var dif=kshf.dif_activeItems(a,b);
    if(dif===0) { return b.items.length-a.items.length; }
    return dif;
};
kshf.sortFunc_BarValue = function(a,b){ 
    return kshf.dif_barValue(a,b);
};
kshf.sortFunc_Column_Int_Incr = function(a,b){ 
    return a.data[1] - b.data[1]; 
}
kshf.sortFunc_Column_Int_Decr = function(a,b){ 
    return b.data[1] - a.data[1]; 
}
kshf.sortFunc_Column_ParseInt_Incr = function(a,b){ 
    return parseFloat(a.data[1],10) -parseFloat(b.data[1],10);
}
kshf.sortFunc_Column_ParseInt_Decr = function(a,b){ 
    return parseFloat(b.data[1],10) -parseFloat(a.data[1],10);
}
kshf.sortFunc_String_Decr = function(a,b){ 
    return b.data[1].localeCompare(a.data[1]);
}
kshf.sortFunc_String_Incr = function(a,b){ 
    return b.data[1].localeCompare(a.data[1]);
}

kshf.sortFunc_Time_Last = function(a, b){
    if(a.xMax_Dyn!==undefined && b.xMax_Dyn!==undefined){
        return b.xMax_Dyn - a.xMax_Dyn;
    }
    if(a.xMax_Dyn===undefined && b.xMax_Dyn===undefined){
        return b.xMax - a.xMax;
    }
    if(b.xMax_Dyn===undefined){ return -1; }
    return 1;
}

kshf.sortFunc_Time_First = function(a, b){
    if(a.xMax_Dyn!==undefined && b.xMax_Dyn!==undefined){
        return a.xMin_Dyn - b.xMin_Dyn;
    }
    if(a.xMax_Dyn===undefined && b.xMax_Dyn===undefined){
        return a.xMin - b.xMin;
    }
    if(b.xMin_Dyn===undefined){ return -1; }
    return 1;
}


kshf.createListDisplay = function(listOptions){
    this.listDisplay = new kshf.list(this,listOptions,this.layoutRight);
};


kshf.clearAllFilters = function(){
    this.charts.forEach(function(chart){chart.clearAllFilters();});
    this.update();
};

kshf.domHeight = function(){
    return parseInt(d3.select(this.domID).style("height"));
};
kshf.domWidth = function(){
    return parseInt(d3.select(this.domID).style("width"));
};

kshf.updateLayout_Height = function(){
    var i;
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
    var c2=kshf.charts[0];
    if(c2.type==='scatterplot'){
        // uncollapse scatterplot only if total chart height is more than 15 rows
        if(divLineRem>15){
            var targetScatterplotHeight = Math.ceil(divLineRem/4);
            c2.setRowCount_VisibleItem(targetScatterplotHeight-c2.rowCount_Header()-1);

            var splotHeight=c2.rowCount_Total_Right();
            divLineRem-= splotHeight;
            remHeight -= kshf.line_height*splotHeight;
            chartProcessed[0]=true;
        } else { 
            c2.collapsedTime = true;
            divLineRem--;
            remHeight -= kshf.line_height*1;
            // chartProcessed[0]=true; // categories are not processed
        }
    }

    // TODO: list item header is assumed to be 3 rows, but it may dynamically change!
    this.root.select("div.listItemGroup")
        .transition()
        .duration(this.layout_animation)
        .style("height",(remHeight-60)+"px")
        ;

    // *********************************************************************************
    // left panel ***********************************************************************
    divLineRem = divLineCount;
    for(i=0; i<this.charts.length; ++i) {
        var c3=kshf.charts[i];
        if(c3.type==='scatterplot' && chartProcessed[i]===true){
            divLineRem-=c3.rowCount_Total();
            break;
        }
    }

    var finalPass = false;
    while(procBarCharts<barChartCount){
        procBarChartsOld = procBarCharts;
        var targetRowCount = Math.floor(divLineRem/(barChartCount-procBarCharts));
        for (i=0; i<this.charts.length; ++i) {
            var c=kshf.charts[i];
            if((c.type==='barChart' || c.type==='scatterplot') && chartProcessed[i]===false){
                if(divLineRem<c.rowCount_MinTotal()){
                    c.divRoot.style("display","none");
                    chartProcessed[i] = true;
                    procBarCharts++;
                    c.hidden = true;
                    continue;
                } 
                if(c.collapsedTime){
                    ; //
                } else if(c.options.catDispCountFix){
                    c.setRowCount_VisibleItem(c.options.catDispCountFix);
                } else if(c.rowCount_MaxTotal()<=targetRowCount){
                    // you say you have 10 rows available, but I only needed 5. Thanks,
                    c.setRowCount_VisibleItem(c.catCount_Total);
                } else if(finalPass){
                    c.setRowCount_VisibleItem(targetRowCount-c.rowCount_Header()-1);
                } else {
                    continue;
                }
                if(c.hidden===undefined || c.hidden===true){
                    c.hidden=false;
                    c.divRoot.style("display","block");
                }
                divLineRem-=c.rowCount_Total();
                chartProcessed[i] = true;
                procBarCharts++;
            }
        }
        finalPass = procBarChartsOld===procBarCharts;
    }

    // there may be some empty lines remaining, try to give it back to the filters
    var allDone = false;
    while(divLineRem>0 && !allDone){
        allDone = true;
        for (i=0; i < this.charts.length && divLineRem>0; ++i) {
            var c3=kshf.charts[i];
            if(c3.hidden===true) continue;
            if(c3.collapsed===true) continue;
            if(c3.catCount_Total===c3.rowCount_VisibleItem) continue;
            if(c3.options.catDispCountFix!==undefined) continue;
            if(c3.type==='scatterplot' && c3.collapsedTime===false) continue;
            var tmp=divLineRem;
            divLineRem+=c3.rowCount_Total();
            c3.setRowCount_VisibleItem(c3.rowCount_VisibleItem+1);
            divLineRem-=c3.rowCount_Total();
            if(tmp!==divLineRem) allDone=false;
        }
    }

    this.charts.forEach(function(chart){
        chart.update_VisibleItem(false);
    });

    // adjust layoutRight vertical position
    if(c2.type==='scatterplot'){
        this.layoutRight
            .transition().duration(this.layout_animation)
            .style("top", (c2.rowCount_Total_Right()*kshf.line_height)+"px");
    }

    this.root.select("div.layout_left")
        .transition().duration(this.layout_animation)
        .style("top",(c2.type==='scatterplot'?(c2.rowCount_Total()*kshf.line_height):0)+"px");
};


kshf.updateLayout = function(){
    if(kshf.loaded!==true) return;

    this.divWidth = this.domWidth();

    kshf.time_animation_barscale = 400;
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

    this.layout_animation = 0;
    this.time_animation_barscale = 0;

    this.setHideBarAxis(initBarChartWidth);

    // HEIGHT
    this.updateLayout_Height();

    // WIDTH
    this.setBarWidthLeftPanel(initBarChartWidth);
    this.updateAllTheWidth();

    this.layout_animation = 500;
}

// Not explicitly called, you can call this maunally to change the text width size after the browser is created
kshf.setCategoryTextWidth = function(w){
    this.categoryTextWidth = w;
    this.charts.forEach(function(chart){
        if(chart.type==='barChart' || chart.type==='scatterplot'){
            chart.options.rowTextWidth = w;
            chart.updateTextWidth(w);
            chart.updateBarWidth();
        }
    });
    this.updateAllTheWidth();
}

kshf.setHideBarAxis = function(v){
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
}

kshf.setBarWidthLeftPanel = function(v){
    this.setHideBarAxis(v);
    if(this.barMaxWidth===this.width_leftPanel_bar) return;
    this.barMaxWidth = this.width_leftPanel_bar;
    this.charts.forEach(function(chart){
        chart.updateBarAxisScale();
        chart.updateWidth_Bars_Active();
        chart.updateChartTotalWidth();
    });
}

kshf.fullWidthResultSet = function(){
    return this.charts.length==1 && this.charts[0].type==='scatterplot';
}

kshf.updateAllTheWidth = function(v){
    this.width_leftPanel_total = this.getRowTotalTextWidth()+this.width_leftPanel_bar+kshf.scrollWidth+kshf.scrollPadding+2;

    var rowLabelOffset = this.getRowLabelOffset();

    this.layoutBackground.style("width",(this.width_leftPanel_total)+"px");
    this.root.select("div.filter_header").style("width",(this.width_leftPanel_total-8)+"px");

    this.layoutRight.style("left",(this.fullWidthResultSet()?0:this.width_leftPanel_total)+"px");

    var width_rightPanel_total = this.divWidth-this.width_leftPanel_total-kshf.scrollPadding-15; // 15 is padding
    for (i = 0; i < this.charts.length; ++i){
        if(kshf.charts[i].type==='scatterplot'){
            kshf.charts[i].setTimeWidth(width_rightPanel_total);
            break;
        }
    }

    // for some reason, on page load, this variable may be null. urgh.
    if(this.listDisplay){
        this.listDisplay.listDiv.style("width",
            ((this.fullWidthResultSet()==false)?width_rightPanel_total+9:this.divWidth-15)+"px");
    }

    // update list
    this.maxTotalColWidth = width_rightPanel_total*kshf.listMaxColWidthMult;
    this.width_rightPanel_total = width_rightPanel_total;

    kshf.updateCustomListStyleSheet();
}

kshf.updateCustomListStyleSheet = function(){
    var contentWidth = (this.width_rightPanel_total-10);
    if(this.fullWidthResultSet()){
        contentWidth+=this.width_leftPanel_total;
    }
    // 22 is for itemtoggledetails
    if(this.listDisplay.detailsToggle){ contentWidth-=22; }
    contentWidth-=this.listDisplay.sortColWidth;
    contentWidth-=9; // works for now. TODO: check 
    this.root.select("span.filter-blocks").style("width",contentWidth+"px");
    if(this.listDisplay.displayType==='list'){
        this.listDisplay.dom.listItems_Content.style("width",contentWidth+"px");
    }
};


// ***********************************************************************************************************
// BASE CHART
// ***********************************************************************************************************

kshf.Chart = function(options){
    this.id=kshf.num_of_charts;
    kshf.num_of_charts++;
    this.filterId = kshf.maxFilterID++;
    this.options = options;

    this.collapsed = false;
    if(options.collapsed===true) this.collapsed = true;

    this.collapsedTime = false;
    if(options.collapsedTime===true) this.collapsedTime = true;
};

// set x offset to display active number of items
kshf.getRowLabelOffset = function(){
    if(!this._labelXOffset){
        var maxTotalCount = d3.max(this.charts, function(chart){ 
            return chart.getMaxBarValueMaxPerRow();
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
};

// includes label + number
kshf.getRowTotalTextWidth = function(){
    return this.categoryTextWidth + this.getRowLabelOffset();
}


// ***********************************************************************************************************
// WHIZ BAR CHART
// ***********************************************************************************************************

kshf.BarChart = function(_kshf, options){
    // Call the parent's constructor
    var me = this;
    kshf.Chart.call(this, options);
    this.sortDelay = 450; // ms
    this.parentKshf = _kshf;

    if(!this.options.timeTitle){
        this.type = 'barChart';
        this.filterCount = 1;
    } else {
        this.type = 'scatterplot';
        this.filterCount = 2;
        kshf.maxFilterID++;
    }

    this.init_shared(options);

    if(!this.options.timeTitle){
        this.options.display = {row_bar_line:false};
    } else {
        this.options.display = {row_bar_line:true};
        kshf.items.forEach(function(item){
            item.timePos = me.options.timeItemMap(item);
        })
        this.timeData_dt = {
            min: d3.min(kshf.items, this.options.timeItemMap),
            max: d3.max(kshf.items, this.options.timeItemMap)};

        // calculate minYear and maxYear per cetegory, and use it for total.
        this.updateData_TimeMinMax();
        var i;
        var d=this.getData();
        for(i=0; i<d.length; i++){
            d[i].xMin = d[i].xMin_Dyn;
            d[i].xMax = d[i].xMax_Dyn;
        }
        if(this.options.timeBarShow===undefined){
            this.options.timeBarShow = false;
        }
    }
};
// Setup the prototype chain the right way
kshf.extendClass(kshf.Chart, kshf.BarChart);

kshf.BarChart.prototype.rowCount_Header_Left = function(){
    var r=1; // title
    if(this.showConfig) {r++;}
    if(this.showTextSearch){ r++;}
    return r;
};
kshf.BarChart.prototype.rowCount_Header_Right = function(){
    if(this.type==='scatterplot'){
        if(this.collapsed || this.collapsedTime) return 1;
        return 2;
    }
    return 0;
};
kshf.BarChart.prototype.rowCount_Header = function(){
    if(this.collapsed) return 1;
    return Math.max(this.rowCount_Header_Left(),this.rowCount_Header_Right());
};

kshf.BarChart.prototype.init_shared = function(options){
	// register
    var j,f, me=this;

    this.parentKshf.barMaxWidth = 0;

	//sorting options
    //assert(this.options.sorting);
    // select the first sorting function as default
    this.sortID=0;
    this.sortInverse=false;
    this.options.timeMaxWidth=0;

	// filter options - must be always specified

    if(this.options.showNoneCat===undefined){
        this.options.showNoneCat = false;
    }

    if(this.type==="scatterplot" && this.options.timeItemMap===undefined){
        this.options.timeItemMap = this.parentKshf.columnAccessFunc(this.options.timeTitle);
    }

    if(this.options.catItemMap===undefined){
        this.options.catItemMap = this.parentKshf.columnAccessFunc(this.options.facetTitle);
    } else if(typeof(this.options.catItemMap)==="string"){
        this.options.catItemMap = kshf.columnAccessFunc(this.options.catItemMap);
    }

    // generate row table if necessary
    if(this.options.generateRows){
        this.catTableName = this.options.catTableName+"_h_"+this.id;
        kshf.createTableFromTable(kshf.items,this.catTableName, this.options.catItemMap);
    } else {
        this.catTableName = this.options.catTableName;
    }

    var noneID = null;
    if(this.options.showNoneCat===true){
        // TODO: Check if a category named "None" exist in table
        noneID = 1000;
        var newItem = new kshf.Item([noneID,"None"],0)
        kshf.dt[this.catTableName].push(newItem);
        kshf.dt_id[this.catTableName][noneID] = newItem;
    }

    if(this.options.catLabelText===undefined){
        // get the 2nd attribute as row text [1st is expected to be the id]
        options.catLabelText = function(typ){ return typ.data[1]; };
    }
    if(this.options.showNoneCat===true){
        var _catLabelText = this.options.catLabelText;
        var _catTooltipText = this.options.catTooltipText;
        options.catLabelText = function(d){ 
            if(d.id()===noneID) return "None";
            return _catLabelText(d);
        };
        options.catTooltipText = function(d){ 
            if(d.id()===noneID) return "None";
            return _catTooltipText(d);
        };
    }

    if(this.options.showNoneCat===true){
        var _catItemMap = this.options.catItemMap;
        this.options.catItemMap = function(d){
            var r=_catItemMap(d);
            if(r===null) return noneID;
            if(r instanceof Array)
                if(r.length===0) {
                    return noneID;
                }
            return r;
        }
    }

    var optimalSelectOption = "Single";
    this.hasMultiValueItem = false;

    // BIG. Apply row map function
    var curDtId = this.getData_wID();
    kshf.items.forEach(function(item){
        // assume all filters pass
        for(j=0,f=me.filterId;j<me.filterCount;j++,f++){
            item.filters[f] = true;
        }
        var toMap = me.options.catItemMap(item);
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
        item.mappedData[me.filterId] = toMap;
        item.mappedRows[me.filterId] = [];
        if(toMap===null) { return; }
        if(toMap instanceof Array){
            optimalSelectOption = "MultipleAnd";
            me.hasMultiValueItem = true;
            toMap.forEach(function(a){
                var m=curDtId[a];
                if(m){
                    m.items.push(item);
                    m.activeItems++;
                    m.barValue+=item.barCount;
                    m.barValueMax+=item.barCount;
                    m.sortDirty = true;
                    item.mappedRows[me.filterId].push(m);
                }
            });
        } else {
            var m=curDtId[toMap];
            m.items.push(item);
            m.activeItems++;
            m.barValue+=item.barCount;
            m.barValueMax+=item.barCount;
            m.sortDirty = true;
            item.mappedRows[me.filterId].push(curDtId[toMap]);
        }
    });

    if(this.options.selectType===undefined){
        this.options.selectType = optimalSelectOption;
    } else {
        if(this.options.selectType!=="MultipleOr"&&this.options.selectType!=="Single"){
            this.options.selectType = optimalSelectOption;
        }
    }

    this.showConfig = this.options.sortingFuncs.length>1;

    // Modified internal dataMap function - Skip rows with0 active item count
    if(this.options.dataMap) {
        this._dataMap = function(d){
            if(d.items.length===0) { return null; }
            return options.dataMap(d);
        };
    } else {
        this._dataMap = function(d){
            if(d.items.length===0) { return null; }
            return d.id();
        };
    }

    // Linear pass over data to see which ones are not skipped.
    // Note: Cannot do it when generating chart, each function gets called twice by d3???
    this.updateTotalItemCount();
	this.selectAllRows(false);
    // text search is automatically enabled is num of rows is more than 20.
    // It is NOT dependent on number of displayed rows
    this.showTextSearch = 
        (this.catCount_Total>=20 && this.options.forceSearch!==false)||this.options.forceSearch===true
        ;

    // scrollbar options
	this.scrollbar = { };
    this.scrollbar.firstRow = 0;
    this.x_axis_active_filter = null;
};

kshf.BarChart.prototype.updateTotalItemCount = function(){
    var me = this;
    this.catCount_Total = 0;
    this.getData().forEach(function(d){
        if(me._dataMap(d)!==null) { me.catCount_Total++; }
    });
};

kshf.BarChart.prototype.getWidth = function(){
    return this.getWidth_Left()+
        ((this.type==='scatterplot')?(
            this.options.timeMaxWidth+kshf.sepWidth+
              ((this.scrollbar.show)?(kshf.scrollWidth+kshf.scrollPadding):0)
            ):0);
};
kshf.BarChart.prototype.getWidth_Left = function(){
    return this.parentKshf.getRowTotalTextWidth() +
        this.parentKshf.barMaxWidth +
        kshf.scrollWidth + // assume scrollbar is on
        kshf.scrollPadding
        +1;
};

kshf.BarChart.prototype.rowCount_Total = function(){
    if(this.collapsed) return 1;
    // need 1 more row at the bottom is scrollbar is shown, or barInfoText is set
    var bottomRow=0;
    if(this.scrollbar.show || this.parentKshf.hideBarAxis===false) bottomRow=1;
    return this.rowCount_VisibleItem+this.rowCount_Header()+bottomRow;
};
kshf.BarChart.prototype.rowCount_Total_Right = function(){
    if(this.type==='scatterplot' && this.collapsedTime===true){
        return 1;
    }
    return this.rowCount_Total()+1;
};

kshf.BarChart.prototype.rowCount_MaxTotal = function(){
    return this.catCount_Total+this.rowCount_Header()+1;
};
kshf.BarChart.prototype.rowCount_MinTotal = function(){
    return this.rowCount_Header()+Math.min(this.catCount_Total,3)+1;
};

kshf.BarChart.prototype.updateChartTotalWidth = function(){
    this.updateScrollGroupPos();

    var leftPanelWidth = this.getWidth_Left();
    var totalWidth = this.getWidth();

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
    this.dom_headerGroup.select("span.leftHeader")
        .transition()
        .duration(kshf.time_animation_barscale)
        .style("width",leftPanelWidth+"px")
        ;
};

kshf.BarChart.prototype.scrollItems = function(event){
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
};

kshf.BarChart.prototype.init_DOM = function(){
    var kshf_ = this;
    var me=this;
    
    this.divRoot = this.options.layout
        .append("div").attr("class","kshfChart");

    this.dom_headerGroup = this.divRoot.append("span").attr("class","headerGroup");

	this.root = this.divRoot
        .append("svg")
            .attr("xmlns","http://www.w3.org/2000/svg")
            .style("width","100%")
            .style("height","100%");
    // to capture click/hover mouse events
    this.root.append("svg:rect")
        .attr("class","chartBackground")
        .style("opacity",0)
        .on("mousewheel",this.scrollItems.bind(this))
        .on("mousedown", function (d, i) { d3.event.preventDefault(); })
    ;

	this.dom = {};
    var rowBackgroundColor = "#dadada";
    var otherGradientColor="gray";
    
    var gradient =this.root.append("svg:linearGradient")
        .attr("id","rowSelectBackground_Count"+this.id)
        .attr("x1","0%")
        .attr("y1","0%")
        .attr("x2","100%")
        .attr("y2","0%");
    gradient.append("svg:stop")
        .attr("offset","0%")
        .style("stop-color",rowBackgroundColor)
        .style("stop-opacity",1);
    gradient.append("svg:stop")
        .attr("offset","100%")
        .style("stop-color",rowBackgroundColor)
        .style("stop-opacity",0);
    
    gradient =this.root.append("svg:linearGradient")
        .attr("id","rowSelectBackground_Label"+this.id)
        .attr("x1","0%")
        .attr("y1","0%")
        .attr("x2","100%")
        .attr("y2","0%");
    gradient.append("svg:stop")
        .attr("offset","0%")
        .style("stop-color",rowBackgroundColor)
        .style("stop-opacity",0);
    gradient.append("svg:stop")
        .attr("offset","20%")
        .style("stop-color",rowBackgroundColor)
        .style("stop-opacity",1);
    gradient.append("svg:stop")
        .attr("offset","100%")
        .style("stop-color",rowBackgroundColor)
        .style("stop-opacity",1);
    
    
    gradient =this.root.append("svg:linearGradient")
        .attr("id","timeselectbar_"+this.id)
        .attr("x1","100%")
        .attr("y1","0%")
        .attr("x2","0%")
        .attr("y2","0%");
    gradient.append("svg:stop")
        .attr("offset","0%")
        .style("stop-color",otherGradientColor)
        .style("stop-opacity",0);
    gradient.append("svg:stop")
        .attr("offset","5%")
        .style("stop-color",otherGradientColor)
        .style("stop-opacity",1);
    gradient.append("svg:stop")
        .attr("offset","60%")
        .style("stop-color",otherGradientColor)
        .style("stop-opacity",1);
    gradient.append("svg:stop")
        .attr("offset","100%")
        .style("stop-color",otherGradientColor)
        .style("stop-opacity",0);

    if(this.type==="scatterplot"){
        var dotBackgroundColor = "#616F7A";
        var dotBackgroundColor_Inactive = "#CCCCCC";

        var gradient =this.root.append("svg:radialGradient")
            .attr("id","dotGradient50")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("svg:stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.4);
        gradient.append("svg:stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.4);
        gradient.append("svg:stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.3);

        gradient =this.root.append("svg:radialGradient")
            .attr("id","dotGradient75")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("svg:stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.6);
        gradient.append("svg:stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.6);
        gradient.append("svg:stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.5);

        gradient =this.root.append("svg:radialGradient")
            .attr("id","dotGradient25")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("svg:stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.25);
        gradient.append("svg:stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.25);
        gradient.append("svg:stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.2);

        gradient =this.root.append("svg:radialGradient")
            .attr("id","dotGradient100")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("svg:stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.85);
        gradient.append("svg:stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.85);
        gradient.append("svg:stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.7);

        gradient =this.root.append("svg:radialGradient")
            .attr("id","dotGradient_Inactive")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("svg:stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor_Inactive)
            .style("stop-opacity",1);
        gradient.append("svg:stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor_Inactive)
            .style("stop-opacity",1);
        gradient.append("svg:stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor_Inactive)
            .style("stop-opacity",0);

        if(this.options.timeDotConfig!==undefined){
            this.divRoot.attr("dotconfig",this.options.timeDotConfig);
        }
    }
    this.root
        .append("svg:g")
        .attr("class", "x_axis")
        .on("mousedown", function (d, i) { d3.event.preventDefault(); })
        ;
	var barGroup_Top = this.root.append("svg:g")
		.attr("class","barGroup_Top")
		.attr("clip-path","url(#kshf_chart_clippath_"+this.id+")")
        ;
    if(this.type==='scatterplot') { 
        barGroup_Top.append("svg:line")
            .attr("class","selectVertLine")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", -kshf.line_height*1.5)
            ;
    }

	var barGroup = barGroup_Top.append("svg:g")
		.attr("class","barGroup");
	barGroup.selectAll("g.row")
		.data(this.getData(), this._dataMap)
	  .enter().append("svg:g")
		.attr("class", "row")
        .each(function(d){
            var mee=this;
            d.items.forEach(function(dd){dd.cats.push(mee);});
        })
		;
    this.dom.g_row = this.root.selectAll('g.row');

    if(this.type==='scatterplot') { 
    	var timeAxisGroup = this.root
            .append("svg:g")
    		.attr("class", "timeAxisGroup")
    		.on("mousedown", function (d, i) { d3.event.preventDefault(); })
            ;
        timeAxisGroup.append("svg:g").attr("class","tickGroup");
        timeAxisGroup.append("svg:g").attr("class","tickGroup2");
    }

    if(this.catCount_Total===1){
        this.options.catBarScale = "scale_frequency";
    }

    this.insertHeader();

    this.insertScrollbar();

    this.insertItemRows_shared();
    if(this.type==='scatterplot') { 
        this.insertTimeChartRows();
        this.insertTimeChartAxis_1();
    }
    this.updateSorting(true);
};

kshf.BarChart.prototype.getData = function(){
    return kshf.dt[this.catTableName];
};
kshf.BarChart.prototype.getData_wID = function(){
    return kshf.dt_id[this.catTableName];
};

// returns the maximum number of total items stored per row in chart data
kshf.BarChart.prototype.getMaxTotalItemsPerRow = function(){
    if(!this._maxTotalItemsPerRow){
        var dataMapFunc = this._dataMap;
        this._maxTotalItemsPerRow = d3.max(this.getData(), function(d){ 
            if(dataMapFunc(d)===null) { return null; }
            return d.items.length;
        });
    }
    return this._maxTotalItemsPerRow;
};

// returns the maximum number of selected items stored per row in chart data
kshf.BarChart.prototype.getMaxBarValuePerRow = function(){
    var dataMapFunc = this._dataMap;
    return d3.max(this.getData(), function(d){ 
        if(dataMapFunc(d)===null) { return null; }
        return d.barValue;
    });
};
kshf.BarChart.prototype.getMaxBarValueMaxPerRow = function(){
    var dataMapFunc = this._dataMap;
    return d3.max(this.getData(), function(d){ 
        if(dataMapFunc(d)===null) { return null; }
        return d.barValueMax;
    });
};


kshf.BarChart.prototype.updateSelf = function(){
	this.refreshActiveItemCount();
    this.refreshBarHeight();
    if(this.type==="scatterplot"){
        this.refreshTimeChartTooltip();
        this.refreshTimeChartBarDisplay();
        this.updateTimeChartDotConfig();
    }
    this.updateWidth_Bars_Active();
	this.updateSorting();
};

kshf.BarChart.prototype.updateData_TimeMinMax = function(){
    var kshf_ = this;
    var specFunc = function(d){
        if(!d.selected) return undefined; // unselected items have no timePos
        return d.timePos;
    };
    this.getData().forEach(function(row){
        if(row.sortDirty===false) return;
        row.xMin_Dyn = d3.min(row.items, specFunc);
        row.xMax_Dyn = d3.max(row.items, specFunc);
    });
};

// You should only display at most 3 digits + k/m/etc
kshf.formatForItemCount = function(n){
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
}

kshf.BarChart.prototype.refreshActiveItemCount = function(){
    var me = this;
    this.dom.item_count.text(function(d) { return "("+kshf.formatForItemCount(d.barValue)+")";});
    this.dom.rows.each(function(d){ 
        this.setAttribute("noitems",!me.noItemOnSelect(d));
    });
    this.dom.row_title.text(function(d){
        return (d.activeItems===0?"No":d.activeItems)+" selected "+kshf.itemName+" "+
            (me.options.textFilter?me.options.textFilter:("- "+me.options.facetTitle+":"))+" "+
            ((me.options.catTooltipText)?me.options.catTooltipText(d):me.options.catLabelText(d));
    });
};
kshf.BarChart.prototype.refreshBarHeight = function(){
	// Non-selected rows have shorted bar height.
	this.dom.allRowBars
		.attr("height", function(d,i){ return (d.activeItems>0)?12:6; })
		.attr("y",function(d,i){ return (d.activeItems>0)?3:6; });
    if(this.dom.timeBar){
        this.dom.timeBar
    		.attr("height", function(d,i){ return (d.activeItems>0)?12:6; })
    		.attr("y",function(d,i){ return (d.activeItems>0)?3:6; });
    }
	this.root.selectAll('g.barGroup g.row rect.active')
		.attr("height", function(d,i){ return (d.activeItems>0)?10:4; })
		.attr("y",function(d,i){ return (d.activeItems>0)?4:7; });
};
kshf.BarChart.prototype.updateWidth_Bars_Active = function(){
	var me=this;
	this.dom.bar_active
        .transition()
        .duration(kshf.time_animation_barscale)
		.attr("width", function(d){ return me.catBarAxisScale(d.barValue);})
        ;
};
// Applies alternating color for bar helper lines
kshf.BarChart.prototype.refreshBarLineHelper = function(){
	this.dom.row_bar_line.attr("stroke", function(d,i) {
		return (d.orderIndex%2===1)?"rgb(200,200,200)":"rgb(80,80,80)";
	});
};
kshf.BarChart.prototype.getFilteredCount = function(){
    var r=this.isFiltered_Row();
    if(this.type==="scatterplot"){
        r+=this.isFiltered_Time();
    }
    return r;
}
kshf.BarChart.prototype.refreshFilterRowState = function(){
	this.divRoot.attr("filtered_row",this.isFiltered_Row());
	this.root.selectAll("g.barGroup g.row").attr("selected",function(d){return d.selected;});
};

kshf.BarChart.prototype.isFiltered_Row = function(state){
    return this.catCount_Selected!==0;
};
kshf.BarChart.prototype.isFiltered_Time = function(){
	return this.timeFilter_ms.min!==this.timeRange_ms.min ||
	       this.timeFilter_ms.max!==this.timeRange_ms.max ;
};
//! Rows, not data!
kshf.BarChart.prototype.selectAllRows = function(state){
    this.getData().forEach(function(r){r.selected=state;});
	this.catCount_Selected = (state)?this.catCount_Total:0;
};

kshf.BarChart.prototype.clearAllFilters = function(){
    this.clearRowFilter(false);
    if(this.type==='scatterplot') this.clearTimeFilter(false);
}
kshf.BarChart.prototype.clearRowFilter = function(toUpdate){
    if(this.catCount_Selected===0) return;
	this.selectAllRows(false);
    this.filter_addItems();
    this.refreshFilterRowState();
	this.refreshFilterSummaryBlock();
    if(this.dom.showTextSearch){
        this.dom.showTextSearch[0][0].value="";
    }
    if(toUpdate!==false) { kshf.update(); }
};

kshf.BarChart.prototype.clearTimeFilter_ms = function(){
    this.timeFilter_ms= { min: this.timeRange_ms.min, max:this.timeRange_ms.max };
}
kshf.BarChart.prototype.clearTimeZoom_ms = function(){
    this.timeZoom_ms = { min: this.timeRange_ms.min, max:this.timeRange_ms.max };
}

kshf.BarChart.prototype.clearTimeFilter = function(toUpdate){
    this.clearTimeFilter_ms();
    this.clearTimeZoom_ms();
    this.updateTimelineLayut(toUpdate);
    this.yearSetXPos();
    this.filterTime();
    if(toUpdate!==false) { kshf.update(); }
};

kshf.BarChart.prototype.collapseCategories = function(hide){
    this.collapsed = hide;
    if(sendLog) {
        if(hide===true) sendLog(CATID.FacetCollapse,ACTID_COLLAPSE.Collapse,{facet:this.options.facetTitle});
        else            sendLog(CATID.FacetCollapse,ACTID_COLLAPSE.Show,{facet:this.options.facetTitle});
    }
    this.update_VisibleItem(true); // force update
    this.parentKshf.updateLayout_Height();
}

kshf.BarChart.prototype.collapseTime = function(hide){
    this.collapsedTime = hide;
    this.update_VisibleItem(true); // force update
    this.parentKshf.updateLayout_Height();
}

kshf.BarChart.prototype.updateTimeAxisGroupTransform = function(){
    var x = (this.parentKshf.barMaxWidth+kshf.scrollPadding+kshf.scrollWidth+kshf.sepWidth+this.parentKshf.getRowTotalTextWidth());
    var y = (kshf.line_height*(this.rowCount_Total())-10);
    this.root.select("g.timeAxisGroup")
        .attr("transform","translate("+x+","+y+")");
}

kshf.BarChart.prototype.insertHeader = function(){
	var kshf_ = this;
    var me = this;
    var rows_Left = this.rowCount_Header_Left();

    var leftBlock = this.dom_headerGroup.append("span").attr("class","leftHeader");

    leftBlock.append("div").attr("class","border_line").style("top","0px");

    var topRow_background = leftBlock.append("div").attr("class","chartFirstLineBackground");

    leftBlock.append("div").attr("class","border_line");

    var topRow = topRow_background.append("div")
        .style("height",kshf.line_height+"px")
        .attr("class","leftHeader_XX");

    var headerLabel = topRow.append("span")
        .attr("class", "header_label")
        .attr("title", this.catCount_Total+" categories")
        .html(this.options.facetTitle)
        .on("click",function(){ 
            if(kshf_.collapsed) { kshf_.collapseCategories(false); }
        })
        ;
    
    topRow.append("span").attr("class","header_label_arrow")
        .attr("title","Show/Hide categories").text("▼")
        .on("click",function(){ kshf_.collapseCategories(!kshf_.collapsed); })
        ;

    topRow.append("svg")
        .attr("class", "settingButton")
        .attr("version","1.1")
        .attr("height","12px")
        .attr("width","12px")
        .attr("title","Settings")
        .attr("xml:space","preserve")
        .attr("viewBox","0 0 24 24")
        .on("click",function(d){
            me.showConfig = !me.showConfig;
            me.update_VisibleItem(true); // force update
            me.parentKshf.updateLayout();
        })
    .append("svg:path")
        .attr("clip-rule","evenodd")
        .attr("d","M21.521,10.146c-0.41-0.059-0.846-0.428-0.973-0.82l-0.609-1.481  c-0.191-0.365-0.146-0.935,0.1-1.264l0.99-1.318c0.246-0.33,0.227-0.854-0.047-1.162l-1.084-1.086  c-0.309-0.272-0.832-0.293-1.164-0.045l-1.316,0.988c-0.33,0.248-0.898,0.293-1.264,0.101l-1.48-0.609  c-0.395-0.126-0.764-0.562-0.82-0.971l-0.234-1.629c-0.057-0.409-0.441-0.778-0.85-0.822c0,0-0.255-0.026-0.77-0.026  c-0.514,0-0.769,0.026-0.769,0.026c-0.41,0.044-0.794,0.413-0.852,0.822l-0.233,1.629c-0.058,0.409-0.427,0.845-0.82,0.971  l-1.48,0.609C7.48,4.25,6.912,4.206,6.582,3.958L5.264,2.969c-0.33-0.248-0.854-0.228-1.163,0.045L3.017,4.1  C2.745,4.409,2.723,4.932,2.971,5.262l0.988,1.318C4.208,6.91,4.252,7.479,4.061,7.844L3.45,9.326  c-0.125,0.393-0.562,0.762-0.971,0.82L0.85,10.377c-0.408,0.059-0.777,0.442-0.82,0.853c0,0-0.027,0.255-0.027,0.77  s0.027,0.77,0.027,0.77c0.043,0.411,0.412,0.793,0.82,0.852l1.629,0.232c0.408,0.059,0.846,0.428,0.971,0.82l0.611,1.48  c0.191,0.365,0.146,0.936-0.102,1.264l-0.988,1.318c-0.248,0.33-0.308,0.779-0.132,0.994c0.175,0.217,0.677,0.752,0.678,0.754  s0.171,0.156,0.375,0.344s1.042,0.449,1.372,0.203l1.317-0.99c0.33-0.246,0.898-0.293,1.264-0.1l1.48,0.609  c0.394,0.125,0.763,0.562,0.82,0.971l0.233,1.629c0.058,0.408,0.441,0.779,0.852,0.822c0,0,0.255,0.027,0.769,0.027  c0.515,0,0.77-0.027,0.77-0.027c0.409-0.043,0.793-0.414,0.85-0.822l0.234-1.629c0.057-0.408,0.426-0.846,0.82-0.971l1.48-0.611  c0.365-0.191,0.934-0.146,1.264,0.102l1.318,0.99c0.332,0.246,0.854,0.227,1.164-0.047l1.082-1.084  c0.273-0.311,0.293-0.834,0.047-1.164l-0.99-1.318c-0.246-0.328-0.291-0.898-0.1-1.264l0.609-1.48  c0.127-0.393,0.562-0.762,0.973-0.82l1.627-0.232c0.41-0.059,0.779-0.441,0.822-0.852c0,0,0.027-0.255,0.027-0.77  s-0.027-0.77-0.027-0.77c-0.043-0.41-0.412-0.794-0.822-0.853L21.521,10.146z M12,15C10.343,15,9,13.656,9,12  C9,10.343,10.343,9,12,9c1.657,0,3,1.344,3,3C15,13.656,13.656,15,12,15z")
        .attr("fill-rule","evenodd")
    .append("svg:title").text("Settings");
        ;


    topRow.append("div")
        .attr("class","chartClearFilterButton rowFilter")
        .attr("title","Clear filter")
		.on("click", function(d,i){
            kshf_.clearRowFilter();
            if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnFacet,kshf.getFilteringState(kshf_.options.facetTitle));
        })
        .text('x');
    if(this.type==="scatterplot"){
        var rightBlock = this.dom_headerGroup.append("span").attr("class","rightHeader").style("height","20px");

        rightBlock.append("div").attr("class","border_line");

        var poff = rightBlock.append("div").attr("class","chartFirstLineBackground chartFirstLineBackgroundRight").style("height","18px");

        poff.append("span").attr("class","header_label_arrow")
            .attr("title","Show/Hide categories").text("▼")
            .on("click",function(){ kshf_.collapseTime(!kshf_.collapsedTime); })
            ;
        poff.append("span")
            .attr("class", "header_label")
            .text(this.options.timeTitle)
            .on("click",function(){ if(kshf_.collapsedTime) { kshf_.collapseTime(false); } })
            ;
        poff.append("div")
            .attr("class","chartClearFilterButton timeFilter")
            .attr("title","Clear filter")
            .on("click", function(d,i){ 
                kshf_.clearTimeFilter();
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnFacet, 
                    {facet:kshf_.options.timeTitle,results:kshf.itemsSelectedCt});
            })
            .text('x');

        rightBlock.append("div").attr("class","border_line");

        var config_zoom = rightBlock.append("div").attr("class","config_zoom");

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
                me.updateTimelineLayut(true);
                me.useCurrentTimeMinMax = undefined;
                me.divRoot.select(".zoom_out").attr("disabled","false");
                me.divRoot.select(".zoom_in").attr("disabled","true");
            });

        // **********************************
        // ZOOM SVG

        var zoom_svg = config_zoom.append("svg")
            .attr("version","1.1")
            .attr("xmlns","http://www.w3.org/2000/svg")
            .attr("x","0px")
            .attr("y","0px")
            .attr("width","15px")
            .attr("height","20px")
            .attr("viewBox","0 0 404.999 722.387")
            .attr("enable-background","new 0 0 404.999 722.387")
            .attr("xml:space","preserve")
            ;

        var gradient_1=zoom_svg.append("svg:linearGradient")
            .attr("id","SVGID_1_")
            .attr("gradientUnits","userSpaceOnUse")
            .attr("x1","202.4995")
            .attr("y1","719.8745")
            .attr("x2","202.4995")
            .attr("y2","4.9341")
        gradient_1.append("svg:stop").attr("offset","0.2").attr("style","stop-color:#FFFFFF");
        gradient_1.append("svg:stop").attr("offset","1").attr("style","stop-color:#939598");

        var gradient_2=zoom_svg.append("svg:linearGradient")
            .attr("id","SVGID_2_")
            .attr("gradientUnits","userSpaceOnUse")
            .attr("x1","202.4995")
            .attr("y1","719.8745")
            .attr("x2","202.4995")
            .attr("y2","4.9341")
        gradient_2.append("svg:stop").attr("offset","0").attr("style","stop-color:#939598");
        gradient_2.append("svg:stop").attr("offset","0.8").attr("style","stop-color:#FFFFFF");

        zoom_svg.append("svg:path")
            .attr("d","M202.499,3.723L394.31,110.316"+
        "c-134.189,0-127.738,227.969-127.738,509.696l-64.072,98.652l-64.073-98.652c0-281.727-1.306-509.696-128.737-509.696"+
        "C9.689,110.316,202.499,3.722,202.499,3.723z")
            ;
        
        zoom_svg.append("svg:rect")
            .attr("class","block_bottom")
            .attr("x","108.12")
            .attr("y","617.797")
            .attr("display","inline")
            .attr("fill","#FFFFFF")
            .attr("width","180")
            .attr("height","112")
            ;

        zoom_svg.append("svg:rect")
            .attr("class","block_top")
            .attr("x","-37.88")
            .attr("y","-27.203")
            .attr("display","inline")
            .attr("fill","#FFFFFF")
            .attr("width","496")
            .attr("height","142")
            ;

        config_zoom.append("span")
            .attr("class","zoom_button zoom_out")
            .attr("disabled","true")
            .text("⇤ Zoom out ⇥")
            .on("mouseover",function(e){ d3.select(this.parentNode).attr("zoom","out");  })
            .on("mouseout",function(){  d3.select(this.parentNode).attr("zoom","none");  })
            .on("click",function(){
                me.clearTimeZoom_ms();
                me.useCurrentTimeMinMax = true;
                me.updateTimelineLayut(true);
                me.useCurrentTimeMinMax = undefined;
                me.divRoot.select(".zoom_out").attr("disabled","true");
            })
            ;

    }

    var header_belowFirstRow = leftBlock.append("div").attr("class","header_belowFirstRow");

    var xxx=leftBlock.append("svg")
        .attr("class", "resort_button")
        .attr("version","1.1")
        .attr("height","15px")
        .attr("width","15px")
        .attr("title","Settings")
        .attr("xml:space","preserve")
        .attr("viewBox","0 0 2000 1000")
        .style("left",(this.parentKshf.categoryTextWidth+5)+"px")
        .on("click",function(d){
            kshf_.sortDelay = 0; 
            kshf_.updateSorting(true);
            if(sendLog) sendLog(CATID.FacetSort,ACTID_SORT.ResortButton,{facet:kshf_.options.facetTitle});
        })
        ;
    xxx.append("svg:path")
        .attr("d",
            "M736 96q0 -12 -10 -24l-319 -319q-10 -9 -23 -9q-12 0 -23 9l-320 320q-15 16 -7 35q8 20 30 20h192v1376q0 14 9 23t23 9h192q14 0 23 -9t9 -23v-1376h192q14 0 23 -9t9 -23zM1792 -32v-192q0 -14 -9 -23t-23 -9h-832q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h832 q14 0 23 -9t9 -23zM1600 480v-192q0 -14 -9 -23t-23 -9h-640q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h640q14 0 23 -9t9 -23zM1408 992v-192q0 -14 -9 -23t-23 -9h-448q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h448q14 0 23 -9t9 -23zM1216 1504v-192q0 -14 -9 -23t-23 -9h-256 q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h256q14 0 23 -9t9 -23z")
        ;
    xxx.append("svg:title").text("Move selected rows to top & re-order");

    // ************************************************************************************
    // ****** CONFIG LINE *****************************************************************

    var filterOptions = ["One","Any"];
    if(this.hasMultiValueItem===true){
        filterOptions.push("All");
    }
    var configOptions = ["filter","order"]

    var configGroup = 
        header_belowFirstRow.append("div")
            .attr("class","configGroup leftHeader_XX")
            .attr("shown","filter")
            .style("height",this.parentKshf.line_height+"px")
            ;

    var chooseConfig = configGroup.append("span").attr("class","chooseConfigGroup");

    var filterGr = configGroup.append("span").attr("class","filterOptionSelectGroup");
    filterGr.append("select")
        .attr("class","optionSelect")
        .on("change", function(d){
            switch(this.selectedOptions[0].text){
            case "One":
                me.options.selectType = "Single";
                // TODO: make sure only 1 item is selected at max. Unselect others..
                break;
            case "All":
                me.options.selectType = "MultipleAnd";
                break;
            case "Any":
                me.options.selectType = "MultipleOr";
                break;
            }
            // update filtering
            if(me.options.selectType === "Single" && me.catCount_Selected>1){
                kshf_.selectAllRows(false);
            }
            me.filter_all();
            me.sortSkip = true;
            kshf.update();
            me.refreshFilterRowState();
            me.refreshFilterSummaryBlock();
        })
    .selectAll("input.sort_label")
        .data(filterOptions)
      .enter().append("option")
        .attr("class", "filter_label")
        .text(function(d){ return d; })
        .each(function(d){
            if( (d==="One" && me.options.selectType==="Single") ||
                (d==="All" && me.options.selectType==="MultipleAnd") ||
                (d==="Any" && me.options.selectType==="MultipleOr")
                )
                d3.select(this).attr("selected","selected");
        })
        ;
    filterGr.append("span")
        .attr("class","optionSelect_Label")
        .text("Select by")
        ;

    if(this.showConfig) {
        var sortGr = configGroup.append("span").attr("class","sortOptionSelectGroup");
        sortGr.append("select")
            .attr("class","optionSelect")
            .on("change", function(){
                if(sendLog) {
                    sendLog(CATID.FacetSort,ACTID_SORT.ChangeSortFunc,
                        {facet:kshf_.options.facetTitle, funcID:this.selectedIndex});
                }
                kshf_.sortID = this.selectedIndex;
                kshf_.sortInverse = false;
                kshf_.sortDelay = 0;
                kshf_.sortSkip = false;
                kshf_.updateSorting.call(kshf_,true);
            })
        .selectAll("input.sort_label")
            .data(this.options.sortingFuncs)
          .enter().append("option")
            .attr("class", "sort_label")
            .text(function(d){ return d.name; })
            .attr(function(d){ return d.name; })
            ;
        sortGr.append("span")
            .attr("class","optionSelect_Label")
            .text("Order by")
            ;

        configGroup.attr("shown","order");

        chooseConfig.selectAll("svg")
            .data(configOptions)
        .enter().append("svg")
            .attr("version","1.1")
            .attr("height","10px")
            .attr("width" ,"10px")
            .attr("xml:space","preserve")
            .attr("viewBox","0 0 10 10")
            .on("click",function(d){
                d3.select(this.parentNode.parentNode).attr("shown",d)
            })
        .append("svg:circle")
            .attr("class",function(d){ return d;})
            .attr("r","4")
            .attr("cx","5")
            .attr("cy","5")
            ;
    }

    if(this.showTextSearch){
        var textSearchRowDOM = header_belowFirstRow.append("div").attr("class","leftHeader_XX").style("padding-top","1px");
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
                        kshf_.selectAllRows(false);
                    } else {
                        var daat=kshf_.getData(),i,numSelected=0;
                        for(i=0; i<daat.length ; i++){
                            var d=daat[i];
                            if(kshf_.options.catLabelText(d).toString().toLowerCase().indexOf(v)!==-1){
                                d.selected = true;
                            } else {
                                if(kshf_.options.catTooltipText){
                                    d.selected = kshf_.options.catTooltipText(d).toLowerCase().indexOf(v)!==-1;
                                } else{
                                    d.selected = false;
                                }
                            }
                            numSelected+=d.selected;
                        }
                        kshf_.catCount_Selected = numSelected;
                    }
                    // convert state to multiple-or selection
                    var tmpSelectType = kshf_.options.selectType;
                    kshf_.options.selectType = "MultipleOr";
                    
                    kshf_.filter_all();
                    kshf.update();
                    kshf_.refreshFilterRowState();
                    kshf_.refreshFilterSummaryBlock();

                    kshf_.options.selectType = tmpSelectType;

                    if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.CatTextSearch,kshf.getFilteringState(kshf_.options.facetTitle));
                }, 750);
            })
            .on("blur",function(){
                d3.event.stopPropagation();
                d3.event.preventDefault();
            })
            ;
    }
};

kshf.BarChart.prototype.updateTimelineLayut = function(toUpdate){
    this.setTimeTicks();
    this.updateTimeChartBarsDots();
    this.refreshTimeChartBarDisplay();
    this.insertTimeTicks();
    this.insertTimeChartAxis();
    if(toUpdate===true) this.updateTimeChartDotConfig();
}

kshf.BarChart.prototype.setTimeWidth = function(w){
    this.options.timeMaxWidth = w;
    if(this.scrollbar.show===true){
        this.options.timeMaxWidth -= kshf.scrollPadding + kshf.scrollWidth;
    }

    this.updateTimelineLayut(true);

    this.updateChartTotalWidth();
    
    this.dom_headerGroup.select("span.rightHeader")
        .style("width",(w)+"px");
    this.updateTimeAxisGroupTransform();
    this.updateRowBarLineWidth();
};

kshf.BarChart.prototype.updateTimeChartDotConfig = function(){
    if(this.type!=='scatterplot') return;
    if(this.options.timeDotConfig !== undefined) return;
    if(this.skipUpdateTimeChartDotConfig === true) return;
    var me = this;

    var totalActiveTime_pixLength = 0;

    this.dom.g_row.each(function(d) {
        if(me.catCount_Selected!==0 && !d.selected) return;
        if(d.xMax_Dyn===undefined || d.xMin_Dyn===undefined) return;
        totalActiveTime_pixLength+=me.timeScale(d.xMax_Dyn) - me.timeScale(d.xMin_Dyn);
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
        this.divRoot.attr("dotconfig","Solid");
    } else if(maxDots>numOfItems*1.5){
        this.divRoot.attr("dotconfig","Gradient-100");
    } else if(maxDots>numOfItems*0.8){
        this.divRoot.attr("dotconfig","Gradient-75");
    } else if(maxDots>numOfItems*0.3){
        this.divRoot.attr("dotconfig","Gradient-50");
    } else {
        this.divRoot.attr("dotconfig","Gradient-25");
    }
}

kshf.BarChart.prototype.updateBarAxisScale = function(){
    if(this.options.catBarScale==="scale_frequency"){
        this.catBarAxisScale = d3.scale.linear()
            .domain([0,this.parentKshf.itemsSelectedCt])
            .rangeRound([0, this.parentKshf.barMaxWidth]);
    } else {
        this.catBarAxisScale = d3.scale.linear()
            .domain([0,this.getMaxBarValuePerRow()])
            .rangeRound([0, this.parentKshf.barMaxWidth]);
        }
    this.updateWidth_Bars_Total();
    this.insertXAxisTicks();
}

    
kshf.BarChart.prototype.updateBarWidth = function(w){
    this.updateBarAxisScale();
    this.updateWidth_Bars_Active();
    this.updateRowBarLineWidth();
    this.updateChartTotalWidth();
};

kshf.BarChart.prototype.updateRowBarLineWidth = function(){
    var x2=this.parentKshf.barMaxWidth+kshf.scrollPadding+kshf.scrollWidth+kshf.sepWidth+this.parentKshf.getRowTotalTextWidth()
        +this.options.timeMaxWidth;
    this.dom.row_bar_line.attr("x2",x2);
}

kshf.BarChart.prototype.refreshScrollbar = function(animate){
    var me = this;
	var firstRowHeight = kshf.line_height*this.scrollbar.firstRow;
    var handleTopPos = firstRowHeight*(this.rowCount_VisibleItem/this.catCount_Total.toFixed());
    if(animate){
        var scrollHandleHeight=kshf.line_height*this.rowCount_VisibleItem*this.rowCount_VisibleItem/this.catCount_Total.toFixed();
        if(scrollHandleHeight<10) { scrollHandleHeight=10;}
        this.root.selectAll("g.scrollGroup rect.background_up")
            .transition()
            .duration(this.parentKshf.layout_animation)
            .attr("height",(handleTopPos));
        this.root.selectAll("g.scrollGroup rect.background_down")
            .transition()
            .duration(this.parentKshf.layout_animation)
            .attr("y",handleTopPos)
            .attr("height",kshf.line_height*this.rowCount_VisibleItem-handleTopPos)
        ;
        this.root.selectAll("g.scrollGroup rect.handle")
            .transition()
            .duration(this.parentKshf.layout_animation)
        this.root.selectAll("g.scrollGroup rect.handle")
            .transition()
            .duration(this.parentKshf.layout_animation)
            .attr("height",scrollHandleHeight)
            .attr("y",handleTopPos);
        this.root.select("g.barGroup")
            .transition()
            .duration(200)
            .ease(d3.ease("cubic-out"))
            .attr("transform",function(){return "translate(0,-"+firstRowHeight+")";});
    } else {
        this.root.selectAll("g.scrollGroup rect.background_up")
            .attr("height",(handleTopPos+5));
        this.root.selectAll("g.scrollGroup rect.background_down")
            .attr("y",handleTopPos)
            .attr("height",kshf.line_height*this.rowCount_VisibleItem-handleTopPos)
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
            (this.scrollbar.firstRow!==this.firstRowMax())?"inline":"none")
        .text( function(){
            if(me.scrollbar.firstRow===me.firstRowMax()) return "";
            return (me.catCount_Total-me.rowCount_VisibleItem-me.scrollbar.firstRow)+" more...";
        });
    this.root.selectAll("g.scrollGroup text.first_row_number")
        .text(this.scrollbar.firstRow===0?"":this.scrollbar.firstRow)
        .attr("y",handleTopPos-1)
        ;
};

kshf.BarChart.prototype.firstRowMax = function(){
    return this.catCount_Total-this.rowCount_VisibleItem;
};

kshf.BarChart.prototype.setRowCount_VisibleItem = function(c){
    if(c>this.catCount_Total){ c = this.catCount_Total; }
    if(c<0){ c=1; }
    if(this.catCount_Total<=2){ 
        c = this.catCount_Total;
    } else {
        c = Math.max(c,2);
    }
    this.rowCount_VisibleItem = c;
}
kshf.BarChart.prototype.update_VisibleItem = function(forced){
    if(this.visibleItemRow===undefined){
        this.visibleItemRow = this.rowCount_VisibleItem;
    } else {
        if(this.visibleItemRow===this.rowCount_VisibleItem && forced===false) return;
        this.visibleItemRow = this.rowCount_VisibleItem;
    }
    var totalHeight      = kshf.line_height*this.rowCount_Total();
    var visibleRowHeight = kshf.line_height*this.rowCount_VisibleItem;
    var headerHeight     = kshf.line_height*this.rowCount_Header();

    this.scrollbar.show = this.rowCount_VisibleItem!==this.catCount_Total;

    this.divRoot
        .attr("collapsed",this.collapsed===false?"false":"true")
        .attr("showconfig",this.showConfig)
        .attr("collapsedTime",this.collapsedTime===false?"false":"true")
        .attr("showscrollbar",this.scrollbar.show)
        .transition()
        .duration(this.parentKshf.layout_animation)
        .style("height",(this.type!=="scatterplot")?(totalHeight+"px"):"100%");
        ;

    // ******************************************************************************
    // Scrollbar stuff

    // scrollbar.firstRow cannot exceed firstRowMax()
    this.scrollbar.firstRow = Math.min(this.scrollbar.firstRow,this.firstRowMax());
    // how much is one row when mapped to the scroll bar?
    this.scrollbar.rowScrollHeight = visibleRowHeight/this.catCount_Total;
    if(this.rowCount_VisibleItem!==this.catCount_Total){
        // update scrollbar height
        this.root.selectAll("g.scrollGroup rect.background")
            .transition()
            .duration(this.parentKshf.layout_animation)
            .attr("height",visibleRowHeight+1)
            ;
        this.root.select("g.scrollGroup text.scroll_display_more")
            .transition()
            .duration(this.parentKshf.layout_animation)
            .attr('y',(visibleRowHeight+10))
            ;
        this.updateScrollGroupPos();
        this.refreshScrollbar(true);
    }

    this.root.select(".barGroup_Top")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr("transform", "translate(0,"+headerHeight+")")
        ;
    this.root.select(".x_axis")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr("transform", "translate("+(this.parentKshf.getRowTotalTextWidth())+","+(headerHeight+3)+")")
        ;
    this.dom_headerGroup
        .transition()
        .duration(this.parentKshf.layout_animation)
        .style("height",(headerHeight+2)+"px")
        ;

    this.root.select("rect.chartBackground")
        .attr('height',visibleRowHeight)
        .attr('y',headerHeight)
        ;
    this.root.selectAll(".barChartClipPath rect")
        .transition()
        .duration(this.parentKshf.layout_animation)
		.attr("height",visibleRowHeight)
        ;

    // update x axis items
	this.root.selectAll("g.timeAxisGroup g.filter_handle line")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr("y1", -visibleRowHeight-8)
		.attr("y2", -8)
        ;
	this.root.selectAll("g.timeAxisGroup rect.filter_nonselected")
//        .transition()
//        .duration(this.parentKshf.layout_animation)
        .attr("y",-visibleRowHeight-8)
		.attr("height", visibleRowHeight)
        ;
    this.root.selectAll("line.selectVertLine")
        .attr("y2", kshf.line_height*(this.rowCount_VisibleItem+1.5))
        ;
    this.root.selectAll("g.x_axis g.tick line")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr("y2", visibleRowHeight)
        ;
    this.root.selectAll("g.x_axis g.tick text")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr("dy",visibleRowHeight+3);
};


kshf.BarChart.prototype.setScrollPosition = function(pos) {
    if(pos<0) { pos = 0;}
    if(pos>this.firstRowMax()){ pos=this.firstRowMax(); }
    if(this.scrollbar.firstRow===pos) { return;}
    this.scrollbar.firstRow = pos;
    this.refreshScrollbar();
};
    
kshf.BarChart.prototype.stepScrollPosition = function(stepSize) {
    if(this.scrollbar.firstRow===0 && stepSize<0){ return; }
    if(this.scrollbar.firstRow===this.firstRowMax() && stepSize>0){ return; }
    if(!this.scrollBarUp_Active){ return; }
    this.scrollbar.firstRow+=stepSize;
    this.refreshScrollbar();
    this.scrollBarUp_TimeStep-=10;
    if(this.scrollBarUp_TimeStep<15){ this.scrollBarUp_TimeStep = 15; }
    window.setTimeout(this.stepScrollPosition.bind(this,stepSize), this.scrollBarUp_TimeStep);
};

kshf.BarChart.prototype.insertScrollbar = function(){
    var me = this;

    // *****************
	var scrollGroup = this.root.append("svg:g")
        .attr("class","scrollGroup")
		.on("mousedown", function (d, i) { d3.event.preventDefault(); })
		;

    // left scroll
    this.dom.leftScroll = scrollGroup.append("svg:g").attr("class","leftScroll");
    this.insertScrollbar_do(this.dom.leftScroll);
    // right scroll
    if(this.type==='scatterplot'){
        this.dom.rightScroll = scrollGroup.append("svg:g").attr("class","rightScroll");
        this.insertScrollbar_do(this.dom.rightScroll);
    }

    // "more..." text
    scrollGroup.append("svg:text").attr("class","scroll_display_more")
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
            scrollGroup.selectAll("text.row_number").style("display","");
        })
        ;
};

kshf.BarChart.prototype.insertScrollbar_do = function(parentDom){
    var kshf_ = this;
    var mouseOutFunc = function(){
        kshf_.scrollBarUp_Active = false;
    };

	// scroll to top
	var xxx=parentDom.append("g").attr("class","top_arrow")
        .attr("transform","translate(1,-13)");
        xxx.append("svg:title")
            .text("Top");
        xxx.append("svg:rect")
            .attr("width",kshf.scrollWidth)
            .attr("height",11)
            .on("click",function(){
                kshf_.scrollbar.firstRow=0;
                kshf_.refreshScrollbar(true);
                if(sendLog) {
                    sendLog(CATID.FacetScroll,ACTID_SCROLL.ScrollToTop, 
                        {facet:kshf_.options.facetTitle,firstRow:kshf_.scrollbar.firstRow});
                }
            });
        xxx.append("svg:path").attr("class","top_arrow")
            .attr("d","M4 0 L0 3 L0 6 L4 3 L8  6 L8  3 Z M4 5 L0 8 L0 11 L4 8 L8 11 L8  8 Z")
            ;
	// the background - static position/size
	parentDom.append("svg:rect").attr("class", "background")
		.attr("width",kshf.scrollWidth+1)
		.attr("rx",4)
		.attr("ry",4)
        .attr("x",-0.5)
        .attr("y",-0.5)
        ;
	parentDom.append("svg:rect").attr("class", "background_fill background_up")
		.attr("width",kshf.scrollWidth)
		.attr("rx",4)
		.attr("ry",4)
        .on("mousedown",function(){
            kshf_.scrollBarUp_Active = true; 
            kshf_.scrollBarUp_TimeStep = 200;
            kshf_.stepScrollPosition(-1);
            if(sendLog) {
                sendLog(CATID.FacetScroll,ACTID_SCROLL.ClickScrollbar,
                    {facet:kshf_.options.facetTitle,firstRow:kshf_.scrollbar.firstRow});
            }
        })
		.on("mouseup",function(){
            kshf_.scrollBarUp_Active = false; 
        })
		.on("mouseout",mouseOutFunc);
	parentDom.append("svg:rect").attr("class", "background_fill background_down")
		.attr("width",kshf.scrollWidth)
		.attr("rx",4)
		.attr("ry",4)
        .on("mousedown",function(){
            kshf_.scrollBarUp_Active = true; 
            kshf_.scrollBarUp_TimeStep = 200;
            kshf_.stepScrollPosition(1);
            if(sendLog) {
                sendLog(CATID.FacetScroll,ACTID_SCROLL.ClickScrollbar, 
                    {facet:kshf_.options.facetTitle,firstRow:kshf_.scrollbar.firstRow});
            }
        })
		.on("mouseup",function(){
            kshf_.scrollBarUp_Active = false; 
        })
		.on("mouseout",mouseOutFunc);
	// the handle - very (very) dynamic
	parentDom.append("svg:rect")
		.attr("class", "handle")
		.attr("x",0)
		.attr("y",0)
		.attr("rx",4)
		.attr("ry",4)
		.attr("width",kshf.scrollWidth)
		.on("mouseout",mouseOutFunc)
		.on("mousedown", function(d, i) {
			kshf_.scrollbar.active=true;
			d3.select(this).attr("selected",true);
			kshf_.root.style( 'cursor', 'pointer' );
			var mouseDown_y = d3.mouse(this.parentNode.parentNode.parentNode)[1];
			var firstRow = kshf_.scrollbar.firstRow;
            parentDom.selectAll("text.row_number").style("display","block");
			kshf_.root.on("mousemove", function() {
				var mouseMove_y = d3.mouse(this)[1];
				var mouseDif = mouseMove_y-mouseDown_y;
				// update position if necessary
				var lineDif = Math.round(mouseDif/kshf_.scrollbar.rowScrollHeight);
				if(lineDif!==0){
					var hmm=firstRow + lineDif;
					if(hmm<0) { hmm=0; }
					if(hmm>kshf_.firstRowMax()) { hmm=kshf_.firstRowMax(); }
					kshf_.scrollbar.firstRow = hmm;
					kshf_.refreshScrollbar();
				}
			});
			kshf_.root.on("mouseup", function(){
				kshf_.root.style( 'cursor', 'default' );
				kshf_.scrollbar.active=false;
				var btn=kshf_.root.select("g.scrollGroup rect.handle");
				btn.attr("selected",false);
				// unregister mouse-move callbacks
                parentDom.selectAll("text.row_number").style("display","");
				kshf_.root.on("mousemove", null);
				kshf_.root.on("mouseup", null);
                if(sendLog) sendLog(CATID.FacetScroll,ACTID_SCROLL.DragScrollbar,
                    {facet:kshf_.options.facetTitle,firstRow:kshf_.scrollbar.firstRow});
			});
		})
		;
    // number display
	parentDom.append("svg:text")
        .attr("class","first_row_number row_number")
        .attr("x",kshf.scrollWidth)
        ;
	parentDom.append("svg:text")
        .attr("class","last_row_number row_number")
        .attr("x",kshf.scrollWidth)
        ;
};
kshf.BarChart.prototype.updateScrollGroupPos = function(){
    this.root.select("g.scrollGroup")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr("transform","translate(0,"+(kshf.line_height*this.rowCount_Header())+")")
        ;
	this.dom.leftScroll
        .transition()
        .duration(this.parentKshf.layout_animation)
		.attr("transform","translate("+(this.parentKshf.getRowTotalTextWidth()+this.parentKshf.barMaxWidth+kshf.scrollPadding)+",0)")
        ;
    if(this.type==='scatterplot'){
        this.dom.rightScroll
            .transition()
            .duration(this.parentKshf.layout_animation)
            .attr("transform","translate("+(this.getWidth()-kshf.scrollWidth-3)+",0)");
    }

    this.root.select("text.scroll_display_more")
        .attr("x", this.parentKshf.categoryTextWidth);
};

kshf.BarChart.prototype.filter_multi = function(item,m,curDtId) {
    if(this.options.selectType!=="MultipleAnd"){
        // ANY of the item mappins is true
        for(j=0;true;j++){
            if(j===m.length)           { item.filters[this.filterId] = false; break; }
            if(curDtId[m[j]].selected) { item.filters[this.filterId] = true;  break; }
        }
    } else {
        // ALL of the current selection is in item mappings
        // see how many items return true. If it matches current selected count, then all selections are met for this item
        var t=0;
        for(j=0;j<m.length;j++) { if(curDtId[m[j]].selected) t++; }
        item.filters[this.filterId] = (t===this.catCount_Selected);
    }
}

kshf.BarChart.prototype.filter_all = function(){
    var curDtId=this.getData_wID(), me=this, allSelected = this.catCount_Selected===0;
    kshf.items.forEach(function(item){
        if(allSelected){
            item.filters[me.filterId] = true;
        } else {
            var m=item.mappedData[me.filterId];
            if(m===undefined || m===null || m===""){ 
                item.filters[me.filterId] = false;
            } else {
                if(m instanceof Array){
                    me.filter_multi(item,m,curDtId);
                } else {
                    item.filters[me.filterId] = curDtId[m].selected;
                }
            }
        }
        item.updateSelected();
    });
};


kshf.BarChart.prototype.filter_removeItems = function(){
    var curDtId=this.getData_wID(), me=this;
    kshf.items.forEach(function(item){
        var m=item.mappedData[me.filterId];
        if(m!==undefined && m!==null && m!==""){
            if(m instanceof Array){
                me.filter_multi(item,m,curDtId);
            } else {
                item.filters[me.filterId] = curDtId[m].selected;
            }
        } else {
            item.filters[me.filterId] = false;
        }
        // you are only "removing" items
        if(item.selected) item.updateSelected();
    });
};

kshf.BarChart.prototype.filter_addItems = function(){
    var curDtId=this.getData_wID(), me=this, allRowsSelected = this.catCount_Selected===0;
    kshf.items.forEach(function(item){
        if(allRowsSelected){
            item.filters[me.filterId] = true;
        } else {
            var m=item.mappedData[me.filterId];
            if(m!==undefined && m!==null && m!==""){
                if(m instanceof Array){
                    me.filter_multi(item,m,curDtId);
                } else {
                    item.filters[me.filterId] = curDtId[m].selected;
                }
            }
        }
        // you are only adding items
        if(!item.selected) item.updateSelected();
    });
};

// if returns false, item is not selected!
// to return false, all components should be false.
// or, if one of the components return true, item can be selected
kshf.BarChart.prototype.noItemOnSelect = function(d){
    var r = d.selected; // you can (un)select a selected item
    // if item is unselected, you can select if no item is currently selected
    r = r || (this.catCount_Selected!==0 && this.options.selectType!=="MultipleAnd");
    r = r || (d.activeItems!==0);
    return r;
}

// When clicked on a row
kshf.BarChart.prototype.filterRow = function(d,forceAll){
    // Flip selection state
	d.selected = !d.selected;
    // If selectType is Single, deselect other selections
    if(this.options.selectType==="Single"){
        if(d.selected){
            this.selectAllRows(false);
            d.selected=true;
            forceAll=true;
        }
    }
	this.catCount_Selected += (d.selected)?1:-1;
	if(this.catCount_Selected===0){ 
        this.showResortButton=true;
    } else {
        this.showResortButton=false;
    }
    this.sortSkip = true;

    if(forceAll){
        this.filter_all();
    } else if(this.catCount_Selected===1){
        if(this.options.selectType==="MultipleOr"){
            this.filter_removeItems();
        } else if(this.options.selectType==="MultipleAnd"){
            if(d.selected)
                this.filter_removeItems();
            else
                this.filter_addItems();
        }
    } else if(this.catCount_Selected===0){
        this.filter_addItems();
    } else {
        if(this.options.selectType==="MultipleOr"){
            if(d.selected){
                this.filter_addItems();
            } else {
                this.filter_removeItems();
            }
        } else if(this.options.selectType==="MultipleAnd"){
            if(d.selected){
                this.filter_removeItems();
            } else {
                this.filter_addItems();
            }
        }
    }
    if(this.options.sortingFuncs[this.sortID].no_resort!==true){
        this.divRoot.select(".resort_button").style("display",
            (this.catCount_Selected===this.catCount_Total&&!this.showResortButton)?"none":"block");
    }

	kshf.update();
    this.refreshFilterRowState();
    this.refreshFilterSummaryBlock();
    if(this.dom.showTextSearch){
        this.dom.showTextSearch[0][0].value="";
    }

    return true;
};
kshf.BarChart.prototype.filterTime = function(){
    var timeFilterId = this.filterId+1, me=this;
    kshf.items.forEach(function(item){
        item.filters[timeFilterId] = 
            (item.timePos>=me.timeFilter_ms.min) &&
            (item.timePos< me.timeFilter_ms.max);
        item.updateSelected();
    });
};

kshf.BarChart.prototype.refreshFilterSummaryBlock = function(){
	var kshf_=this;
    if(!this.isFiltered_Row()){
        // remove DOM
        if(this.filterSummaryBlock_Row){
            this.filterSummaryBlock_Row[0][0].parentNode.removeChild(this.filterSummaryBlock_Row[0][0]);
            this.filterSummaryBlock_Row = null;
        }
    } else {
        // insert DOM
        if(this.filterSummaryBlock_Row===null || this.filterSummaryBlock_Row===undefined){
            this.insertFilterSummaryBlock_Rows();
        }
        // go over all items and prepare the list
        var selectedItemsText="";
        var selectedItemsText_Sm="";
        var selectedItemsCount=0;
        var catLabelText = this.options.catLabelText;
        var catTooltipText = this.options.catTooltipText;
        this.root.selectAll("g.row").each( function(d){
            if(!d.selected) return; 
            if(selectedItemsCount!==0) {
                if(kshf_.options.selectType==="MultipleAnd"){
                    selectedItemsText+=" and "; 
                    selectedItemsText_Sm+=" and "; 
                } else{
                    selectedItemsText+=" or "; 
                    selectedItemsText_Sm+=" or "; 
                }
            }
            var labelText = catLabelText(d);
            var titleText = labelText;
            if(catTooltipText) titleText = catTooltipText(d);

            selectedItemsText+="<b>"+labelText+"</b>";
            selectedItemsText_Sm+=titleText;
            selectedItemsCount++;
        });
        if(this.catCount_Selected>3){
            var bold=this.catCount_Selected;
            bold+=" "+(this.options.textGroup?this.options.textGroup:"categories");
            this.parentKshf.root.select(".filter_row_text_"+this.filterId+" .filter_item")
                .html("<b>"+bold+"</b>")
                .attr("title",selectedItemsText_Sm)
                ;
        } else {
            this.parentKshf.root.select(".filter_row_text_"+this.filterId+" .filter_item")
                .html(selectedItemsText)
                .attr("title",selectedItemsText_Sm)
                ;
        }
    }
};

kshf.BarChart.prototype.insertItemRows_shared = function(){
	var kshf_ = this;
	// create the clipping area
	var clipPaths = this.root.select("g.barGroup_Top")
		.on("mousedown", function (d, i) { d3.event.preventDefault(); })
        .on("mousewheel",this.scrollItems.bind(this))
	.insert("svg:g",":first-child")
        .attr("class","barChartClipPath");

    clipPaths.insert("svg:clipPath")
		.attr("id","kshf_chart_clippath_"+this.id)
	.append("svg:rect").attr("class","clippingRect")
		.attr("x",0)
		.attr("y",0)
		;

    clipPaths.insert("svg:clipPath")
        .attr("id","kshf_chart_clippathsm_"+this.id)
    .append("svg:rect").attr("class","clippingRect_2")
        .attr("y",0)
        ;

	this.dom.rows = this.root.selectAll("g.barGroup g.row")
		.on("click", function(d){
            if(d3.event.shiftKey || d3.event.altKey || d3.event.ctrlKey || d3.event.ctrlKey){
                kshf_.options.selectType = "MultipleOr";
            }
            if(!kshf_.noItemOnSelect(d)) {
                kshf_.options.selectType = tmpSelectType;
                return;
            }
            // TODO: If new select type is different, show the config option on display!

            kshf_.filterRow(d);

            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
                // clears all the selection when selected
                kshf_.selectAllRows(false);
                kshf_.filterRow(d,true);
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.CatValueExact,
                    kshf.getFilteringState(kshf_.options.facetTitle,d.data[1]));
                return;
            } else if(sendLog){
                if(sendLog) sendLog(CATID.FacetFilter,(d.selected)?ACTID_FILTER.CatValueAdd:ACTID_FILTER.CatValueRemove,
                    kshf.getFilteringState(kshf_.options.facetTitle,d.data[1]));
            }
            var x = this;
            this.timer = setTimeout(function() { x.timer = null; }, 500);
        })
        .attr("highlight","false")
        .on("mouseover",function(d,i){
            this.setAttribute("highlight",true);
            d.items.forEach(function(dd){if(dd.selected) dd.highlightOnList();});
        })
        .on("mouseout",function(d,i){
            this.setAttribute("highlight",false);
            d.items.forEach(function(dd){if(dd.selected) dd.nohighlightOnList();});
        })
        ;
    this.dom.row_title = this.dom.rows
        .append("svg:title")
        .attr("class", "row_title");
	this.dom.rowSelectBackground_Label = this.dom.rows // background 1
		.append("svg:rect")
		.attr("class", "rowSelectBackground rowSelectBackground_Label")
        .style("fill","url(#rowSelectBackground_Label"+this.id+")")
		.attr("x", 0)
		.attr("y", 0)
        .attr("height",kshf.line_height)
		;
	this.dom.rowSelectBackground_Count = this.dom.rows // background 2
		.append("svg:rect")
		.attr("class", "rowSelectBackground rowSelectBackground_Count")
        .style("fill","url(#rowSelectBackground_Count"+this.id+")")
        .attr("y", 0)
        .attr("width",this.parentKshf.getRowLabelOffset())
        .attr("height",kshf.line_height)
		;
    this.dom.rowSelectBackground_ClickArea = this.dom.rows // background 1
        .append("svg:rect")
        .attr("class", "rowSelectBackground_ClickArea")
        .attr("x", 0)
        .attr("y", 4)
        .attr("height",kshf.line_height-8)
        ;
	this.dom.item_count = this.dom.rows
		.append("svg:text")
		.attr("class", "item_count")
		.attr("dy", 13)
		;
	this.dom.cat_labels = this.dom.rows
		.append("svg:text")
		.attr("class", "row_label")
		.attr("dy", 14)
		.text(this.options.catLabelText);
	// Create helper line
	if(this.options.display.row_bar_line){
		this.dom.row_bar_line = this.dom.rows.append("svg:line")
			.attr("class", "row_bar_line")
			.attr("stroke-width","1")
			.attr("y1", kshf.line_height/2.0)
			.attr("y2", kshf.line_height/2.0);
	} else{
        this.dom.row_bar_line = this.root.select(".row_bar_line"); // empty
    }
	this.dom.bar_active = this.dom.rows
		.append("svg:rect")
		.attr("class", function(d,i){ 
			return "rowBar " +(kshf_.options.barClassFunc?kshf_.options.barClassFunc(d,i):"")+" active";
		})
		.attr("rx",2).attr("ry",2); // skip mouse events to the underlying bigger bar
	this.dom.bar_total = this.dom.rows
		.append("svg:rect")
		.attr("class", function(d,i){ 
			return "rowBar "+(kshf_.options.barClassFunc?kshf_.options.barClassFunc(d,i):"")+" total";
		})
		.attr("rx",2).attr("ry",2)
		;
    this.dom.allRowBars = this.root.selectAll('g.barGroup g.row rect.rowBar')
        .attr("x", this.parentKshf.getRowTotalTextWidth())
        ;

    this.updateTextWidth();
};

kshf.BarChart.prototype.updateTextWidth = function(){
    kshf.time_animation_barscale = 400;

    this.dom.cat_labels
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x", this.options.rowTextWidth);
    this.dom.cat_labels
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x", this.options.rowTextWidth);
    this.dom.rowSelectBackground_Label
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("width",this.options.rowTextWidth);
    this.dom.rowSelectBackground_Count
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x",this.options.rowTextWidth);
    this.dom.rowSelectBackground_ClickArea
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("width",this.options.rowTextWidth);
    this.dom.item_count
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x", this.options.rowTextWidth+3);
    
    this.dom.allRowBars
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x", this.parentKshf.getRowTotalTextWidth())
        ;
    this.dom_headerGroup.selectAll(".leftHeader_XX")
        .transition()
        .duration(kshf.time_animation_barscale)
        .style("width",(this.options.rowTextWidth)+"px")
        ;
    this.root.select("g.x_axis")
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("transform","translate("+(this.parentKshf.getRowTotalTextWidth())+","+(kshf.line_height*this.rowCount_Header()+3)+")")

    if(this.dom.showTextSearch !== undefined)
        this.dom.showTextSearch
            .style("width",(this.options.rowTextWidth-20)+"px")

    this.dom.row_bar_line
        .attr("x1", this.parentKshf.getRowTotalTextWidth()+2);
}


kshf.BarChart.prototype.updateWidth_Bars_Total = function(){
    var kshf_ = this;
    this.dom.bar_total
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("width", function(d){
            return Math.min(kshf_.catBarAxisScale(d.barValueMax),kshf_.parentKshf.barMaxWidth+7); 
        })
        ;
};

kshf.BarChart.prototype.updateSorting = function(force){
    var kshf_ = this;
    var no_resort = this.options.sortingFuncs[this.sortID].no_resort;
    if(no_resort === true && force!==true){
        return;
    }
	if(this.sortSkip===true){
        this.sortSkip=false;
		return;
	}
    if(this.scrollbar.firstRow!==0){ // always scrolls to top row automatically when re-sorted
        this.scrollbar.firstRow=0;
        this.refreshScrollbar();
    }
	// sort the data
    var funcToCall = this.options.sortingFuncs[this.sortID].func;
    if(funcToCall===undefined){
        funcToCall = kshf.sortFunc_ActiveCount_TotalCount;
    }
    var compareFunc_Num = function(a,b){
        return b - a;
    };
    var compareFunc_Str = function(a,b){
        return b.localeCompare(a);
    };
    var compareFuncc = compareFunc_Num;
    if(typeof(this.getData()[0].id())==="string") compareFuncc = compareFunc_Str;

    var justSortFunc = function(a,b){
        // call the sorting function
        var x=funcToCall(a,b);
        // use IDs if sorting function doesn't recide on ordering
        if(x===0) { 
            x = compareFuncc(a.id(),b.id());
        }
        // reverse ordering
        if(kshf_.sortInverse) { x*=-1; }
        return x;
    };
    var sortSelectedOnTop = function(a,b){
        // automatically apply selected-top ordering to ALL sorting functions
        if(b.selected && !a.selected) { return (kshf_.sortInverse)?-1:1; }
        if(a.selected && !b.selected) { return (kshf_.sortInverse)?1:-1; }
        return justSortFunc(a,b);
    };
    if(no_resort === true)
	    this.getData().sort(justSortFunc);
    else
        this.getData().sort(sortSelectedOnTop);
	this.dom.g_row
		.data(this.getData(), this._dataMap)
		.order()
		.transition()
        .delay(this.sortDelay)
		.attr("transform", function(d,i) { return "translate(0,"+((kshf.line_height*i))+")"; })
        .each(function(d,i){d.orderIndex = i;})
        ;
    
    if(this.type==='scatterplot'){
        this.refreshBarLineHelper();
    }
    this.divRoot.select(".resort_button").style("display","none");
    this.sortDelay = 450;
};

kshf.BarChart.prototype.insertXAxisTicks = function(){
    var axisGroup = this.root.select("g.x_axis");

    var ticksSkip = this.parentKshf.barMaxWidth/25;
    if(this.getMaxBarValuePerRow()>100000){
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
        .attr("dy",3+this.rowCount_VisibleItem*this.parentKshf.line_height);

	axisGroup.selectAll("g.tick line")
        .attr("y1","0")
        .attr("y2",kshf.line_height*this.rowCount_VisibleItem);
};
kshf.BarChart.prototype.removeXAxis = function(){
    this.root.select("g.x_axis").data([]).exit().remove();
};

kshf.BarChart.prototype.insertFilterSummaryBlock_Rows = function(){
	var kshf_=this;
	var a = d3.select("span.filter-blocks");
	this.filterSummaryBlock_Row= a.append("span").attr("class","filter-block filter_row_text_"+this.filterId)
		.text(" "+(this.options.textFilter?this.options.textFilter:this.options.facetTitle)+": ");
    this.filterSummaryBlock_Row.append("span").attr("class","filter_reset")
        .attr("title","Clear filter")
        .text("x")
        .on("click",function(){ 
            kshf_.clearRowFilter(); 
            if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnSummary,kshf.getFilteringState(kshf_.options.facetTitle));
        });
	this.filterSummaryBlock_Row.append("span").attr("class","filter_item");
};
kshf.BarChart.prototype.insertFilterSummaryBlock_Time = function(){
	var kshf_=this;
	var a = d3.select("span.filter-blocks");
	this.filterSummaryBlock_Time=a.append("span").attr("class","filter-block filter_row_text_"+(this.filterId+1));
    this.filterSummaryBlock_Time.append("span").attr("class","filter_reset")
        .attr("title","Clear filter")
        .text("x")
        .on("click",function(){ 
            kshf_.clearTimeFilter(); 
            if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.ClearOnSummary,kshf.getFilteringState(kshf_.options.timeTitle));
        });
	this.filterSummaryBlock_Time.append("span").attr("class","filter_item");
};

kshf.BarChart.prototype.refreshTimeChartBarDisplay = function(){
    // key dots are something else
    var me = this;
    var r,j;
    var rows = this.getData();
    
    var timeChartSortFunc = function(a,b){
        if(a.selected&&!b.selected) { return  1; }
        if(b.selected&&!a.selected) { return -1; }
        // use left-to-right sorting
        var posA = a.timePos;
        var posB = b.timePos;
        if(posA===null || posB===null) { return 0; }
        return posA.getTime()-posB.getTime();
    };
    
    rows.forEach(function(row){
        if(!row.sortDirty || me.type!=="scatterplot") return;
        row.items.sort(timeChartSortFunc);
        me.root.selectAll("g.row").selectAll(".timeDot")
            .data(function(d) { return d.items; }, function(d){ return d.id(); })
            // calling order will make sure selected ones appear on top of unselected ones.
            .order()
            ;
        // TODO: call order only on this row
        // re-calculate min-max only on this row
        // etc...
    });

    // update min-max time extents ber timeBar
    this.updateData_TimeMinMax();
    if(this.dom.timeBarActive){
        this.dom.timeBarActive
            .transition()
            .duration(kshf.time_animation_barscale)
            .attr("x", function(d) {
                return me.parentKshf.barMaxWidth+kshf.scrollWidth+kshf.sepWidth+kshf.scrollPadding+
                    me.parentKshf.getRowTotalTextWidth()+me.timeScale(d.xMin_Dyn===undefined?d.xMin:d.xMin_Dyn);
            })
            .attr("width", function (d) { 
                if(d.xMin_Dyn===undefined){ return 0; }
                return me.timeScale(d.xMax_Dyn) - me.timeScale(d.xMin_Dyn);
            })
            ;
    }
    rows.forEach(function(row){row.sortDirty=false;});
};

kshf.BarChart.prototype.insertTimeChartRows = function(){
	var kshf_ = this;

    var rows = this.root.selectAll("g.barGroup g.row").append("g")
        .attr("class","timeLineParts")
        .attr("clip-path","url(#kshf_chart_clippathsm_"+this.id+")")
        ;
    if(this.options.timeBarShow===true){
        rows
            .append("svg:rect")
            .attr("class", "timeBar total")
            .attr("rx",2)
            .attr("ry",2)
            ;
        rows
            .append("svg:rect")
            .attr("class", "timeBar active")
            .attr("rx",2)
            .attr("ry",2);
        }
	// Create bar dots
	rows.selectAll("g.timeDot")
		.data(function(d){ 
                return d.items; }, 
              function(d){ 
                return d.id(); })
		.enter().append("svg:circle")
        .each(function(d){
            d.dots.push(this);
        })
		.attr("class", function(d) {
            if(kshf_.options.dotClassFunc){ return "timeDot " + kshf_.options.dotClassFunc(d); }
            return "timeDot";
        })
        .attr("r", 5)
        .attr("cy", Math.floor(kshf.line_height / 2 ))
        .on("mouseover",function(d,i,f){
            d.highlightAttributes();
            // update the position of selectVertLine
            var tm = kshf_.timeScale(kshf_.options.timeItemMap(d));
            var totalLeftWidth = kshf_.parentKshf.barMaxWidth+kshf.scrollPadding+kshf.scrollWidth+kshf.sepWidth+kshf_.parentKshf.getRowTotalTextWidth();
            kshf_.root.select("line.selectVertLine")
                .attr("x1",tm+totalLeftWidth)
                .attr("x2",tm+totalLeftWidth)
                .style("display","block");
            d3.event.stopPropagation();
        })
        .on("mouseout",function(d,i){
            d.nohighlightAttributes();
            kshf_.root.select("line.selectVertLine")
                .style("display","none");
            d3.event.stopPropagation();
        })
		.on("click", function(d,i,f) {

            var itemDate = d.timePos;
            var rangeMin = new Date(itemDate);
            var rangeMax = new Date(itemDate);

            if(kshf_.timeticks.range === d3.time.months){
                rangeMin.setDate(rangeMin.getDate()-15);
                rangeMax = new Date(rangeMin);
                rangeMax.setMonth(rangeMin.getMonth()+1);
            }
            if(kshf_.timeticks.range === d3.time.years){
                // if zoomed years range is wide, use 5-year step size
                var diff_Year =  new Date(kshf_.timeZoom_ms.max).getFullYear() - new Date(kshf_.timeZoom_ms.min).getFullYear();
                if(kshf_.options.timeMaxWidth<diff_Year*10){
                    rangeMin.setFullYear(rangeMin.getFullYear()-5);
                    rangeMax.setFullYear(rangeMax.getFullYear()+5);
                } else {
                    rangeMin.setMonth(rangeMin.getMonth()-6);
                    rangeMax = new Date(rangeMin);
                    rangeMax.setMonth(rangeMin.getMonth()+12);
                }
            }
            if(kshf_.timeticks.range === d3.time.days){
                rangeMin.setDate(rangeMin.getDate()-1);
                rangeMax.setDate(rangeMin.getDate()-1);
            }

            kshf_.timeFilter_ms.min = Date.parse(rangeMin);
            kshf_.timeFilter_ms.max = Date.parse(rangeMax);
            kshf_.yearSetXPos();
            kshf_.filterTime();
            // kshf update is done by row-category click whcih is also auto-activated after dot click

            // clear all the selections
            kshf_.selectAllRows(false);

            // filter for row too
            kshf_.filterRow(d3.select(this.parentNode.parentNode).datum());

            if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.TimeDot,kshf.getFilteringState());

            d3.event.stopPropagation();
		})
        ;
    this.dom.timeBar       = this.root.selectAll('g.barGroup g.row rect.timeBar')
    this.dom.timeBarActive = this.root.selectAll("g.barGroup g.row rect.timeBar.active");
    this.dom.timeBarTotal  = this.root.selectAll("g.barGroup g.row rect.timeBar.total");
    this.dom.timeDots      = this.root.selectAll('g.barGroup g.row .timeDot');
};


kshf.BarChart.prototype.setTimeTicks = function(){
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

        this.clearTimeZoom_ms();
        this.clearTimeFilter_ms();
    }
    // update the time scale with the new date domain
    this.updateTimeScale();
};

kshf.BarChart.prototype.updateTimeScale = function(){
    this.timeScale = d3.time.scale.utc()
        .domain([new Date(this.timeZoom_ms.min), new Date(this.timeZoom_ms.max)])
        .rangeRound([0, this.options.timeMaxWidth])
        ;
}

kshf.BarChart.prototype.insertTimeTicks = function(){
    var kshf_ = this;
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
            kshf_.insertTimeTicks_timeValues.push(d);
        })
        .on("click",function(d,i){
            var curTime  = kshf_.insertTimeTicks_timeValues[i];
            var nextTime = kshf_.insertTimeTicks_timeValues[i+1];
            if(nextTime === undefined){
                nextTime = kshf_.timeRange_ms.max;
//                curTime = kshf_.insertTimeTicks_timeValues[i-1];
            }
            kshf_.timeFilter_ms.min = curTime;
            kshf_.timeFilter_ms.max = nextTime;
            kshf_.yearSetXPos();
            kshf_.filterTime();

            kshf_.sortSkip = true;
            kshf.update();
        })
        ;

    var text=xAxis.tickValues();

    tickGroup.selectAll(".tick.major text").style("text-anchor","middle");
};

kshf.BarChart.prototype.insertTimeChartAxis_1 = function(){
    var axisGroup = this.root.select("g.timeAxisGroup");
    var ggg = axisGroup.append("svg:g").attr("class","selection_bar")  ;
    ggg.append("svg:title").attr("class","xaxis_title");
    ggg.append("svg:rect")
        .attr("y", -2.5)
        .attr("height", 7)

    var axisSubGroup=axisGroup.selectAll(".filter_handle")
        .data([1,2])
        .enter()
        .append("svg:g")
        .attr("class", function(d,i) { return "filter_handle "+((i===0)?"filter_min":"filter_max"); });
    axisSubGroup
        .append("svg:line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", kshf.line_height*1.5-4)
        ;
    axisSubGroup
        .append("svg:rect")
        .attr("class", "filter_nonselected")
        .attr("y",0)
        .attr("height",0)
        .on("click",function(){
            d3.event.stopPropagation();
        })
        ;

    var axisSubGroup=axisGroup.selectAll(".filter_handle");
    
    var axisSubSubGroup = axisSubGroup.append("svg:g");
    axisSubSubGroup.append("svg:title").attr("class","xaxis_title");
    axisSubSubGroup
        .append("svg:path")
        .attr("transform",function(d,i) { return "translate("+(i===0?"0":"0")+",-12)";})
        .attr("d", function(d,i) { 
            return (i===0)?"M0 6 L0 20 L12 13 Z":"M0 6 L0 20 L-12 13 Z";
        })
}
	
kshf.BarChart.prototype.insertTimeChartAxis = function(){
    var kshf_ = this;
    var me=this;

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
            this.selected = true;
            this.style.stroke = "orangered";
            kshf_.divRoot.style('cursor','pointer');
            var mouseDown_x = d3.mouse(axisGroup[0][0])[0];
            var mousedown_filter = {
                min: kshf_.timeFilter_ms.min,
                max: kshf_.timeFilter_ms.max
            };
			var timeFilter_ms = kshf_.timeFilter_ms;
            var olddif=null;
			kshf_.divRoot.on("mousemove", function() {
				var mouseMove_x = d3.mouse(axisGroup[0][0])[0];
				var mouseDif = mouseMove_x-mouseDown_x;
				var mousemove_filter = timeFilter_ms.min;
				var stepDif = Math.round(mouseDif/kshf_.lengthPerTick)*msPerTick;
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
                    kshf.time_animation_barscale = 0;
					// update filter 
					kshf_.yearSetXPos();
                    kshf.time_animation_barscale = 400;
                    kshf_.filterTime();
                    kshf_.sortSkip = true;
                    kshf_.skipUpdateTimeChartDotConfig = true;
					kshf.update();
                    kshf_.skipUpdateTimeChartDotConfig = false;
				}
			});
			kshf_.divRoot.on("mouseup", function(){
                eeeeee.style.stroke= "";
                kshf_.divRoot.style( 'cursor', 'default' );
                kshf_.x_axis_active_filter = null;
                // unregister mouse-move callbacks
                kshf_.divRoot.on("mousemove", null);
                kshf_.divRoot.on("mouseup", null);
                this.updateTimeChartDotConfig();
                if(sendLog) sendLog(CATID.FacetFilter,ACTID_FILTER.TimeDragRange,kshf.getFilteringState());
			});
		});
	
	// Filter handles
	axisGroup.selectAll(".filter_handle g path")
		.on("mousedown", function(d, i) {
            var eeeee = this;
			kshf_.x_axis_active_filter = (i===0)?'min':'max';
            this.style.stroke = 'orangered';
            kshf_.divRoot.style('cursor','pointer');
			var timeFilter_ms = kshf_.timeFilter_ms; // shorthand
			kshf_.divRoot.on("mousemove", function() {
				var mouseMove_x = d3.mouse(axisGroup[0][0])[0];

                // convert mouse position to date
                var time_ms = Math.floor(
                    kshf_.timeZoom_ms.min+ 
                    (kshf_.timeZoom_ms.max-kshf_.timeZoom_ms.min)*(mouseMove_x / kshf_.options.timeMaxWidth)
                    );

                var time_dt = new Date(time_ms);

                var time_ = null;
                if(kshf_.timeticks.range===d3.time.years){
                    time_ = kshf.nearestYear(time_dt);
                } else if(kshf_.timeticks.range===d3.time.months){
                    time_ = kshf.nearestMonth(time_dt);
                } else if(kshf_.timeticks.range===d3.time.days){
                    time_ = kshf.nearestDay(time_dt);
                }

                // if it has the same value after mouse is moved, don't update any filter
                if(timeFilter_ms[kshf_.x_axis_active_filter] === time_.getTime()) return;
                // update timeFilter_ms
                timeFilter_ms[kshf_.x_axis_active_filter] = time_.getTime();
                
                // Check agains min/max order, sawp if necessary
                if(timeFilter_ms.max<timeFilter_ms.min){
                    eeeee.style.stroke = "";
                    kshf_.x_axis_active_filter = (kshf_.x_axis_active_filter==='min'?'max':'min');
                    var tttt= timeFilter_ms.max;
                    timeFilter_ms.max = timeFilter_ms.min;
                    timeFilter_ms.min = tttt;
                }

                // update filter 
                kshf.time_animation_barscale = 0;
                kshf_.yearSetXPos();
                kshf.time_animation_barscale = 400;
                kshf_.filterTime();
                kshf_.sortSkip = true;

                if(kshf_.options.sortingFuncs[kshf_.sortID].no_resort!==true)
                    kshf_.divRoot.select(".resort_button").style("display","block");
                
                kshf_.skipUpdateTimeChartDotConfig = true;
                kshf.update();
                kshf_.skipUpdateTimeChartDotConfig = false;
			});
			kshf_.divRoot.on("mouseup", function(){
                eeeee.style.stroke = "";
				kshf_.divRoot.style( 'cursor', 'default' );
				kshf_.x_axis_active_filter = null;
				var btn=d3.selectAll(".filter_"+kshf_.x_axis_active_filter);
				btn.attr("selected", "false");
				// unregister mouse-move callbacks
				kshf_.divRoot.on("mousemove", null);
				kshf_.divRoot.on("mouseup", null);

                kshf_.updateTimeChartDotConfig();
                if(sendLog) {
                    if(kshf_.x_axis_active_filter==="min")
                        sendLog(CATID.FacetFilter,ACTID_FILTER.TimeMinHandle,kshf.getFilteringState());
                    else
                        sendLog(CATID.FacetFilter,ACTID_FILTER.TimeMaxHandle,kshf.getFilteringState());
                }
			});
		});
    this.yearSetXPos();
};

kshf.nearestYear = function(d){
    var dr = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    if(d.getUTCMonth()>6) dr.setUTCFullYear(dr.getUTCFullYear()+1);
    return dr;
}
kshf.nearestMonth = function(d){
    var dr = new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1));
    if(d.getUTCDate()>15) dr.setUTCMonth(dr.getUTCMonth()+1);
    return dr;
}
kshf.nearestDay = function(d){
    var dr = new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));
    if(d.getUTCHours()>12) dr.setUTCDate(dr.getUTCDate()+1);
    return dr;
}
kshf.nearestHour = function(d){
    
}
kshf.nearestMinute = function(d){
    
}

kshf.BarChart.prototype.updateTimeChartBarsDots = function(){
    var totalLeftWidth = this.parentKshf.barMaxWidth+kshf.scrollPadding+kshf.scrollWidth+kshf.sepWidth+this.parentKshf.getRowTotalTextWidth();
	var kshf_ = this;
    this.dom.timeBarTotal
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x",     function(d){ return totalLeftWidth+kshf_.timeScale(d.xMin); })
        .attr("width", function(d){ return kshf_.timeScale(d.xMax) - kshf_.timeScale(d.xMin); })
        ;
	// Update bar dot positions
	this.dom.timeDots
        .transition()
        .duration(kshf.time_animation_barscale)
		.attr("cx", function(d){ return totalLeftWidth+kshf_.timeScale(d.timePos) ; });
};
kshf.BarChart.prototype.getFilterMinDateText = function(){
    var dt = new Date(this.timeFilter_ms.min);
    return this.timeticks.format(dt);
};
kshf.BarChart.prototype.getFilterMaxDateText = function(){
    var dt = new Date(this.timeFilter_ms.max);
    return this.timeticks.format(dt);
};

kshf.BarChart.prototype.yearSetXPos = function() {
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
        .transition()
        .duration(kshf.time_animation_barscale)
		.attr("transform", function(d) { return "translate(" + minX + ",0)"; });
	this.root.selectAll("g.filter_max")
        .transition()
        .duration(kshf.time_animation_barscale)
		.attr("transform", function(d) { return "translate(" + maxX + ",0)"; });
	this.root.selectAll(".selection_bar rect")
        .transition()
        .duration(kshf.time_animation_barscale)
		.attr("x", minX)
		.attr("width", (maxX - minX));
	this.root.select("g.filter_min .filter_nonselected")
        .transition()
        .duration(kshf.time_animation_barscale)
		.attr("x", -minX)
		.attr("width", minX);
	this.root.select("g.filter_max .filter_nonselected")
        .transition()
        .duration(kshf.time_animation_barscale)
		.attr("x", 0)
		.attr("width", this.options.timeMaxWidth -maxX);
    this.root.select("g.filter_min")
        .attr("filtered",this.timeFilter_ms.min!==this.timeRange_ms.min);
    this.root.select("g.filter_max")
        .attr("filtered",this.timeFilter_ms.max!==this.timeRange_ms.max);
    this.refreshTimeChartFilterText();
    this.refreshTimeChartTooltip();
};

kshf.BarChart.prototype.refreshTimeChartFilterText = function(){
    this.divRoot.attr("filtered_time",this.isFiltered_Time()?"true":"false");
    if(this.isFiltered_Time()){
        this.divRoot.select(".config_zoom").style("display","block");
        this.divRoot.select(".zoom_in").attr("disabled","false");
        if(this.filterSummaryBlock_Time===null || this.filterSummaryBlock_Time===undefined){
            this.insertFilterSummaryBlock_Time();
        }
        this.parentKshf.root.select(".filter_row_text_"+(this.filterId+1)+" .filter_item")
            .html("from <b>"+this.getFilterMinDateText()+"</b> to <b>"+this.getFilterMaxDateText()+"</b>")
        ;
    } else if(this.filterSummaryBlock_Time){
        this.divRoot.select(".config_zoom").style("display","none");
        this.divRoot.select(".zoom_in").attr("disabled","true");
        this.filterSummaryBlock_Time[0][0].parentNode.removeChild(this.filterSummaryBlock_Time[0][0]);
        this.filterSummaryBlock_Time = null;
    }
};
kshf.BarChart.prototype.refreshTimeChartTooltip = function(){
    var titleText = kshf.itemsSelectedCt+ " selected "+kshf.itemName+"from "+
                this.getFilterMinDateText()+" to "+this.getFilterMaxDateText();
	this.root.selectAll("title.xaxis_title").text(titleText);
};

