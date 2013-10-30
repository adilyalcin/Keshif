/*jslint plusplus: true, vars: true, browser: true, white:true, nomen :true, sloppy:true, continue:true */
/*global $, d3, google, alert */

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

// kshf namespace
var kshf = { };

var log2Console = function(s,chart){
    var d=Date.now();
    d = new Date(d);
    console.log(
        d.getUTCFullYear()+"."+d.getUTCMonth()+"."+d.getUTCDate()+" "+
        d.getUTCHours()+":"+d.getUTCMinutes()+":"+d.getUTCSeconds()+":"+d.getUTCMilliseconds()+
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

// ***************************************************************************************************
// ITEM BASE OBJECT/PROPERTIES
// ***************************************************************************************************
kshf.Item = function(d, idIndex){
	this.selected = true;
	this.activeItems = 0;
	this.items = []; // set of assigned primary items
    this.data = d;
    this.idIndex = idIndex; // TODO: Items don't need to have ID index, only one per table is enough!
};
kshf.Item.prototype.id = function(){
    return this.data[this.idIndex];
};
kshf.Item.prototype.updateSelected = function(){
    var i,len,f=this.filters;
    var oldSelected = this.selected;
    // checks if all filter results are true
    for(i=0, len = f.length; i<len && f[i]; i++){ }
    this.selected=(i===len);
    if(this.selected===true && oldSelected===false){
        kshf.itemsSelectedCt++;
        for(i=0; i< this.mappedRows.length; i++){
            var chartMapping=this.mappedRows[i];
            if(chartMapping === undefined) continue;
            for(var j=0; j<chartMapping.length; j++){
                chartMapping[j].activeItems++;
                chartMapping[j].sortDirty=true;
            }
        }
    } else if(this.selected===false && oldSelected===true){
        kshf.itemsSelectedCt--;
        for(i=0; i< this.mappedRows.length; i++){
            var chartMapping=this.mappedRows[i];
            if(chartMapping === undefined) continue;
            for(var j=0; j<chartMapping.length; j++){
                chartMapping[j].activeItems--;
                chartMapping[j].sortDirty=true;
            }
        }
    }
    var displaySetting = (this.selected)?"true":"false";
    for(i=0; i<this.dots.length; i++){
        this.dots[i].setAttribute('display',displaySetting);
    }
    return this.selected;
};
kshf.Item.prototype.highlightAttributes = function(){
    for(i=0; i<this.dots.length; i++){
        this.dots[i].setAttribute('highlight',true);
    }
    for(i=0; i<this.cats.length; i++){
        this.cats[i].setAttribute('itemhighlight',true);
    }
}
kshf.Item.prototype.nohighlightAttributes = function(){
    for(i=0; i<this.dots.length; i++){
        this.dots[i].setAttribute('highlight',false);
    }
    for(i=0; i<this.cats.length; i++){
        this.cats[i].setAttribute('itemhighlight',false);
    }
}

// ***************************************************************************************************
// GOOGLE CHART LOADING
// ***************************************************************************************************

// Gets google chart data and converts it to plain javascript array, for use with kshf
kshf.convertToArray = function(dataTable,sheetID,isPrimary){
    var r,c,arr = [];
    // find the index called "id"
    var idIndex = -1;
    var numCols = dataTable.getNumberOfColumns();
    for(c=0; c<numCols; c++){
        var colName=dataTable.getColumnLabel(c).trim();
        if(colName===sheetID) {
            idIndex = c;
            break;
        }
    }
    if(c===numCols){
        idIndex = c;
    }
    var itemId=0;

    arr.length = dataTable.getNumberOfRows(); // pre-allocate for speed
	for(r=0; r<dataTable.getNumberOfRows() ; r++){
		var a=[];
        a.length = numCols; // pre-allocate for speed
		for(c=0; c<numCols ; c++) { a[c] = dataTable.getValue(r,c); }
        if(idIndex===numCols){ // push unique id if necessary
            a.push(itemId++);
        }
		arr[r] = new kshf.Item(a,idIndex);
        if(isPrimary){
            arr[r].filters = [true];
            arr[r].mappedRows = [true];
            arr[r].mappedData = [true];
            arr[r].dots = [];
            arr[r].cats = [];
        }
	}
    return arr;
};
// Loads all source sheets
kshf.loadSource = function(){
    if(this.source.callback){
        this.source.callback();
        return;
    }
    var i;
	this.source.loadedTableCount=0;
	for(i=0; i<this.source.sheets.length; i++){
        var sheet = this.source.sheets[i];
        if(sheet.id===undefined){ sheet.id="id"; }
        if(i==0){
            sheet.primary = true;
            this.primaryTableName = sheet.name;
        }
        if(this.source.gdocId){
            this.loadSheet_Google(sheet);
        } else if(this.source.dirPath){
            this.loadSheet_File(sheet);
        } else if (sheet.data) { // load data from memory - ATR
            this.loadSheet_Data(sheet);
        }
	}
};

kshf.loadSheet_Google = function(sheet){
    var tName = sheet.name;
    var qString=kshf.queryURL_base+this.source.gdocId+'&headers=1&sheet='+tName;
    if(sheet.range){
        qString+="&range="+sheet.range;
    }
    var query=new google.visualization.Query(qString);
    if(sheet.query){
        query.setQuery(sheet.query);
    }
    this.sendTableQuery(this,query,sheet,this.source.sheets.length);
};

// give it alist split by, it will reconstruct "... , ..." cases back
var unescapeCommas = function(c){
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

kshf.loadSheet_File = function(sheet){
    var me=this;
    var fileName=this.source.dirPath+sheet.name+"."+this.source.fileType;
    var tableName = sheet.name;
    if(sheet.tableName) { tableName = sheet.tableName; }
    $.ajax( {
        url:fileName,
        type:"GET",
        contentType:"text/csv",
        success: function(data) {
            var i,j;
            var lines = data.split(/\r\n|\r|\n/g);
            if(lines.length<1) { return; }
            kshf.dt_ColNames[tableName] = {};
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
                c=unescapeCommas(c);
                if(i===0){ // header 
                    for(j=0; j<c.length;j++){
                        var colName = c[j];
                        kshf.dt_ColNames[tableName][colName] = j;
                        if(colName===sheet.id){ idIndex = j;}
                    }
                    if(idIndex===-1){ // id column not found, you need to create your own
                        kshf.dt_ColNames[tableName][sheet.id] = j;
                        idIndex = j;
                    }
                } else { // content
                    if(idIndex===c.length){// push unique id if necessary
                        c.push(itemId++);
                    }
                    var item = new kshf.Item(c,idIndex);
                    // 1 true item is added for global search
                    if(sheet.primary){ 
                        item.filters = [true];
                        item.mappedRows = [true];
                        item.mappedData = [true];
                        item.dots = [];
                        item.cats = [];
                    }
                    arr.push(item);
                }
            }
            kshf.dt[tableName] = arr;
            if(sheet.primary){
                kshf.items = arr;
                kshf.itemsSelectedCt = arr.length;
            }
            // find the id row, and create the indexed table
            var id_table = {};
            for(j=0; j<arr.length ;j++) {
                var r=arr[j];
                id_table[r.id()] = r; 
            }
            kshf.dt_id[tableName] = id_table;
            kshf.incrementLoadedTableCount();
        }
    });
};

// load data from memory - ATR
kshf.loadSheet_Data = function(sheet){
    var tableName = sheet.name;
    if(sheet.tableName) { tableName = sheet.tableName; }
    var i,j;
    kshf.dt_ColNames[tableName] = {};
    var arr = [];
    var idIndex = -1;
    var itemId=0;
    // for each line, split on , character
    for(i=0; i<sheet.data.length; i++){
        var c = sheet.data[i];
        if(i===0){ // header 
            for(j=0; j<c.length;j++){
                var colName = c[j];
                kshf.dt_ColNames[tableName][colName] = j;
                if(colName===sheet.id){ idIndex = j;}
            }
            if(idIndex===-1){ // id column not found, you need to create your own
                kshf.dt_ColNames[tableName][sheet.id] = j;
                idIndex = j;
            }
        } else { // content
            if(idIndex===c.length){// push unique id if necessary
                c.push(itemId++);
            }
            var item = new kshf.Item(c,idIndex);
            // 1 true item is added for global search
            if(sheet.primary){ 
                item.filters = [true];
                item.mappedRows = [true];
                item.mappedData = [true];
                item.dots = [];
                item.cats = [];
            }
            arr.push(item);
        }
    }   
    kshf.dt[tableName] = arr;
    if(sheet.primary){
        kshf.items = arr;
        kshf.itemsSelectedCt = arr.length;
    }
    // find the id row, and create the indexed table
    var id_table = {};
    for(j=0; j<arr.length ;j++) {
        var r=arr[j];
        id_table[r.id()] = r; 
    }
    kshf.dt_id[tableName] = id_table;
    kshf.incrementLoadedTableCount();
};


kshf.incrementLoadedTableCount = function(){
    var me=this;
    this.source.loadedTableCount++;
    d3.select(".kshf.layout_infobox div.status_text div")
        .text("("+this.source.loadedTableCount+"/"+this.source.sheets.length+")");
        // finish loading
    if(this.source.loadedTableCount===this.source.sheets.length) {
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
kshf.sendTableQuery = function(_kshf, q, sheet, tableCount){
    var me = this;
    var tableName = sheet.name;
    q.send( function(response){
        if(response.isError()) {
            d3.select(".kshf.layout_infobox div.status_text span")
                .text("Cannot load data");
            d3.select(".kshf.layout_infobox img")
                .attr("src",me.dirRoot+"img/alert.png")
                .style("height","40px");
            d3.select(".kshf.layout_infobox div.status_text div")
                .text("("+response.getMessage()+")");
            return;
        }/*
        if(response.hasWarning()) {
            alert("Cannot get data from spreadsheet: reason:"+response.getMessage());
            return;
        }*/
        var j;
        var google_datatable = response.getDataTable();
        var d3_table = _kshf.convertToArray(google_datatable,sheet.id,sheet.primary);
        _kshf.dt[tableName] = d3_table;
        _kshf.dt_ColNames[tableName] = {};
        for(j=0; j<google_datatable.getNumberOfColumns(); j++){
            var colName=google_datatable.getColumnLabel(j).trim();
            _kshf.dt_ColNames[tableName][colName] = j;
        }
        if(sheet.primary){
            kshf.items = d3_table;
            kshf.itemsSelectedCt = d3_table.length;
        }
        // find the id row, and create the indexed table
        var id_table = {};
        for(j=0; j<d3_table.length ;j++) {
            var r=d3_table[j];
            id_table[r.id()] = r; 
        }
        _kshf.dt_id[tableName] = id_table;
        kshf.incrementLoadedTableCount();
   });
};
kshf.createTableFromTable = function(srcTableName, dstTableName, mapFunc){
    var i,uniqueID=0;
    kshf.dt_id[dstTableName] = {};
    kshf.dt[dstTableName] = [];
    var dstTable_Id = kshf.dt_id[dstTableName];
    var dstTable = kshf.dt[dstTableName];

    var srcData=srcTableName;
    for(i=0 ; i<srcData.length ; i++){
        var v = mapFunc(srcData[i]);
        if(v==="") { continue; }
        if(Array.isArray(v)) {
            for(var j=0; j<v.length; j++){
                var v2 = v[j];
                if(v2==="") continue;
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
    var i,j,t;
    for(i=0; i<dt.length ;i++){
        var p = dt[i].data;
        for(t=0; t<cols.length ; t++){
            var list = p[cols[t]];
            if(list===null) continue;
            if(typeof list==="number") continue;
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
            p[cols[t]] = list;
        }
    }
};


// ***********************************************************************************************************
// WHIZ LIST CHART
// ***********************************************************************************************************

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

kshf.list = function(_kshf, config, root){
    var i;
    var me = this;
    this.parentKshf = _kshf;
    this.dragSrcEl = null;
    this.dom = {};
//	this.dragIcon = document.createElement('img');
//	this.dragIcon.src = 'http://twitter.com/api/users/profile_image/twitter';
    
    this.config = config.sortOpts;
    this.listSortOrder = [];
    for(i=0; i<this.config.length; i++){
        this.listSortOrder.push(i);
    }
    this.hideTextSearch = (config.textSearch===undefined);
    
    this.contentFunc = config.contentFunc;

	this.listDiv = root.append("div").attr("class","listDiv");
    
    var listHeader=this.listDiv.append("div").attr("class","listHeader");
    var listHeaderTopRow=listHeader.append("div").attr("class","topRow");
    var count_wrap = listHeaderTopRow.append("span").attr("class","listheader_count_wrap");
    count_wrap.append("span").attr("class","listheader_count_bar");
    count_wrap.append("span").attr("class","listheader_count");
    listHeaderTopRow.append("span").attr("class","listheader_itemName").style("margin-right","2px").html(kshf.itemName);
    if(this.hideTextSearch!==true){    
        var listHeaderTopRowTextSearch = listHeaderTopRow.append("span").attr("class","bigTextSearch_wrap");
        listHeaderTopRowTextSearch.append("img")
            .attr('src',this.parentKshf.dirRoot+"img/search-logo.svg")
            .attr("width","13")
            .style("margin-left","20px")
            ;
        listHeaderTopRowTextSearch.append("input").attr("class","bigTextSearch")
            .attr("placeholder","Search "+(config.textSearchTitle?config.textSearchTitle:"title"))
            .attr("autofocus","true");
        $("input.bigTextSearch").keydown(function(){
            if(this.timer){
                clearTimeout(this.timer);
                this.timer = null;
            }
            var x = this;
            this.timer = setTimeout( function(){
                var v=$(x).val().toLowerCase();
                $(x).parent().children("span").css('display',(v==='')?'none':'inline-block');
                var v=v.split(" ");

                // go over all the items in the list, search each keyword separately
                me.dom.listItems.each(function(item){
                    var i=0
                    var f = true;
                    for(i=0 ; i<v.length; i++){
                        f = f && config.textSearch(item).toLowerCase().indexOf(v[i])!==-1;
                        if(f===false) break;
                    }
                    item.filters[0] = f;
                    item.updateSelected();
                });
                kshf.update();
                x.timer = null;
            }, 750);
        });
        listHeaderTopRowTextSearch.append("span")
            .on("click",function() {
                $(this).prev('input').val('').focus().trigger("keyup");
                $(this).css('display','none');

                // No timeout necessary. Clear selection rightaway.
                // go over all the items in the list, search each keyword separately
                me.dom.listItems.each(function(item){
                    item.filters[0] = true;
                    item.updateSelected();
                });
                kshf.update();
            });
    }

    // Info & Credits
    var infoCred = listHeaderTopRow
        .append("div")
        .attr("title","Show Info & Credits")
        .attr("class","credits")
        .on("click",function(){
            me.parentKshf.root.select(".layout_infobox").style("display","block");
            me.parentKshf.root.select("div.infobox_credit").style("display","block");
        })
        .text("i");

    // TODO: implement popup for file-based resources
    if(_kshf.showDataSource !== false){
        listHeaderTopRow
          .append("div")
            .style("float","right")
            .on("click",function(){
                if(_kshf.source.gdocId){
                    window.open("https://docs.google.com/spreadsheet/ccc?key="+_kshf.source.gdocId,"_blank");
                } else {
                    me.parentKshf.root.select(".layout_infobox").style("display","block");
                    me.parentKshf.root.select("div.infobox_datasource").style("display","block");
                }
            })
          .append("img")
            .attr("class","datasource")
            .attr("title","Open Data Source")
            .attr("src",this.parentKshf.dirRoot+"img/datasource.png")
            ;
        }

    var listColumnRow=listHeader.append("div").attr("class","listColumnRow");

    listColumnRow.append("select")
        .attr("class","listSortOptionSelect")
        .style("width",(this.config[0].width+12)+"px")
        .on("change", function(){
            me.listSortOrder[0] = this.selectedIndex;;
            // trigger sorting reorder
            me.sortItems();
            me.reorderItems();
            me.updateList();
            kshf.updateCustomListStyleSheet();
        })
        .selectAll("input.list_sort_label")
            .data(this.config)
        .enter().append("option")
            .attr("class", "list_sort_label")
            .text(function(d){ return d.name; })
            .attr("dt-order",function(d,i){ return i; })
            ;
    for(i=0; i<this.config.length ; i++){
        if(!this.config[i].label) {
            this.config[i].label = this.config[i].value;
        }
    }
    listColumnRow.append("span").attr("class","filter-blocks").append("span").attr("class","filter-blocks-for-charts");
    this.listDiv.append("div").attr("class","listItemGroup");

    this.listDiv.select("span.filter-blocks");

    this.sortItems();
    this.insertItems();
    this.setColumnMoveHandlers();
};

kshf.list.prototype.handleDragStart = function(e) {
	this.dragSrcEl = e.target;
//	e.dataTransfer.setDragImage(this.dragIcon, -10, -10);
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', e.target.innerText);
    e.target.classList.add('drag_source');
};
kshf.list.prototype.handleDragOver = function(e) {
	// Necessary. Allows us to drop.
	if (e.preventDefault) { e.preventDefault(); }
	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
	return false;
};
kshf.list.prototype.handleDragEnter = function(e) {
    var source=this.dragSrcEl;
    var target=e.target;
	if (source !== target) {
        e.target.classList.add('drag_over');
    }
};
kshf.list.prototype.handleDragLeave = function(e) {
    e.target.classList.remove('drag_over');
};
kshf.list.prototype.handleDragEnd = function (e) {
	var cols = document.querySelectorAll('div.list-sort-option');
	[].forEach.call(cols, function (col) {
		col.classList.remove('drag_over');
        col.classList.remove('drag_source');
	});
};
kshf.list.prototype.handleDrop = function(e) {
	// this / e.target is current target element.
	// stops the browser from redirecting??
	if (e.stopPropagation) { e.stopPropagation();  }
    var source=this.dragSrcEl;
    var target=e.target;
	if (source !== target) {
		// Update column label
        var tempText = source.innerText;
		source.innerText = target.innerText;
		target.innerText = tempText;
        // update listSortOrder
		this.listSortOrder[source.dataset.sortid] = parseInt(target.dataset.sortfunc,10);
		this.listSortOrder[target.dataset.sortid] = parseInt(source.dataset.sortfunc,10);
        // update sort function stored in dom
		var swp = source.dataset.sortfunc;
		source.dataset.sortfunc = target.dataset.sortfunc;
		target.dataset.sortfunc = swp;
        // trigger sorting reorder
        this.sortItems();
        this.reorderItems();
        this.updateList();
        kshf.updateCustomListStyleSheet();
	}
	return false;
};
// adds event listeners for drag&drop on sort columns
kshf.list.prototype.setColumnMoveHandlers = function(){
    var this_ = this;
	var cols = document.querySelectorAll('div.listHeader div.list-sort-option');
	[].forEach.call(cols, function(col) {
		col.addEventListener('dragstart', function(e){ return this_.handleDragStart(e);}, false);
		col.addEventListener('dragenter', function(e){ return this_.handleDragEnter(e);}, false);
		col.addEventListener('dragover',  function(e){ return this_.handleDragOver(e);},  false);
		col.addEventListener('dragleave', function(e){ return this_.handleDragLeave(e);}, false);
		col.addEventListener('drop',      function(e){ return this_.handleDrop(e);},      false);
		col.addEventListener('dragend',   function(e){ return this_.handleDragEnd(e);},   false);
  });
};

Array.prototype.repeat= function(what, L){
    while(L) { this[--L]= what; }
    return this;
};

// after you re-sort the primary table or change item visibility, call this function
kshf.list.prototype.updateListColumnHeaders = function(){
    var i,j;
    var iPrev=-1;
    for(i=0;i<kshf.items.length;i++){
        var p=kshf.items[i];
        if(p.selected===false) { continue; }
        // show all sort column labels by default 
        p.listsortcolumn = [].repeat(true,this.listSortOrder.length);
        // first selected item
        if(iPrev===-1){ iPrev=i; continue; }
        var pPrev = kshf.items[iPrev];
        iPrev=i;
        for(j=0; j<this.listSortOrder.length ; j++){
            var f = this.config[this.listSortOrder[j]].value;
            if(f(p)!==f(pPrev)){ break; }
            p.listsortcolumn[j] = false;
        }
    }
};

kshf.list.prototype.sortItems = function(){
    var this_ = this;
	kshf.items.sort(function(a,b){
        if(a.selected===false || b.selected===false){ return 0; }
        var i,dif;
		for(i=0; i<1; i++){
            var c = this_.config[this_.listSortOrder[i]];
            var f = c.value;
            var f_a = f(a);
            var f_b = f(b);
            if(c.value_type==='string') {
                dif = f_a.localeCompare(f_b);
            } else if(c.value_type==='date') {
                dif = f_b.getTime() - f_a.getTime();
            } else {
                dif = f_b-f_a;
            }
			if(dif!==0) { return dif; }
		}
        if(dif!==0) { return dif; }
        return b.id()-a.id();
	});
};

kshf.list.prototype.updateSortColumnLabels=function(d,tada){
	var t = d3.select(tada);
    var kshf_ = this;
    var k,j;

    t.style("border-top", 
        function(d){ ;
            return ((d.listsortcolumn[0])?"double 4px gray":"duble 0px gray");
        });

    // now update the text
    for(k=0; k<1 ; k++){
        var sortColumn=this.listSortOrder[k];
        t.select(".listsortcolumn")
            .html(function(){ return kshf_.config[sortColumn].label(d); })
//            .style("opacity",d.listsortcolumn[k]?"1":"0.5")
            ;
    }
};

kshf.list.prototype.insertItems = function(){
    var this_ = this;
	this.dom.listItems = this.listDiv.select(".listItemGroup").selectAll("div.listItem")
		.data(kshf.items, function(d){ return d.id(); })
    .enter()
		.append("div")
		.attr("class","listItem")
		.html(function(d){
            var i,str="";
            // Sort column headers
            str+="<div class=\"listcell listsortcolumn\"";
            var titleFunc = this_.config[0].title;
            if(titleFunc) { str+=" title=\""+titleFunc(d)+"\""; }
            str+="\"></div>";
            // Content
            str+="<div class=\"content\">"+this_.contentFunc(d)+"</div>";
            return str;
        })
        .on("mouseover",function(d,i){
            d.highlightAttributes();
        })
        .on("mouseout",function(d,i){
            // find all the things that 
            d.nohighlightAttributes();
        })
    ;
};

kshf.list.prototype.reorderItems = function(){
	this.listDiv.selectAll("div.listItem")
		.data(kshf.items, function(d){ return d.id(); })
		.order();
};
kshf.list.prototype.updateItemVisibility = function(){
	this.dom.listItems
		.style("display",function(pub){ return (pub.selected)?"block":"none"; });
};

kshf.list.prototype.updateList = function(){
    // evaluates column information for each item. TODO: cache
    this.updateListColumnHeaders();
    var this_ = this;
	this.dom.listItems
		.each(function(d){
            if(!d.selected) { return; }
            return this_.updateSortColumnLabels(d,this); 
        });
        d3.select(".listheader_count").text( function(){ 
            if(kshf.itemsSelectedCt===0) { return "No"; }
            return kshf.itemsSelectedCt;
        });
    d3.select(".listheader_count").text( function(){ 
        if(kshf.itemsSelectedCt===0) { return "No"; }
        return kshf.itemsSelectedCt;
    });
    d3.select(".listheader_count_bar").transition().style("width",function(){ 
        return (kshf.listDisplay.config[0].width*kshf.itemsSelectedCt/kshf.items.length)+"px";
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
    this.num_of_charts = 0;
    this.maxFilterID = 1; // 1 is used for global search
    this.categoryTextWidth = options.categoryTextWidth;
    this.chartDefs = options.charts;
    this.listDef = options.list;
    
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
    this.loadedCb = options.loadedCb;

    this.time_animation_barscale = 400;
    this.layout_animation = 500;
    
    this.root = d3.select(this.domID)
        .attr("class","kshfHost")
        .attr("tabindex","1")
        .style("position","relative")
        .style("overflow-y","hidden")
        ;
    $(this.domID).keydown(function(e){
        if(e.which===27){ // escape
            me.clearAllFilters();
        }
    });

    if(options.itemName!==undefined){
        this.itemName = options.itemName;
    } else {
        this.itemName = this.source.sheets[0].name;
    }
    

    this.dirRoot = "./";
    if(options.dirRoot !== undefined){
        this.dirRoot = options.dirRoot;
    }
    this.showDataSource = true;
    if(options.showDataSource!==undefined){
        this.showDataSource = options.showDataSource;
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
    creditString += "<div align=\"center\" class=\"boxinbox project_3rdparty\">";
    creditString += " 3rd party libraries and APIs:<br\/>";
    creditString += " <a href=\"http:\/\/d3js.org\/\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/3rdparty_01.png\" style=\"width:110px; top:0px\"><\/a>";
    creditString += " <a href=\"http:\/\/jquery.com\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/3rdparty_02.png\" style=\"width:150px; top: -15px;\"><\/a>";
    creditString += " <a href=\"https:\/\/developers.google.com\/chart\/\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/3rdparty_03.png\" style=\"width:90px\"><\/a>";
    creditString += "<\/div>";
    creditString += "";
    creditString += "<div style=\"width: 450px;\" align=\"center\" class=\"boxinbox project_credits\">";
    creditString += " Developed by:<br\/>";
    creditString += " <a href=\"http:\/\/www.adilyalcin.me\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/credit-1_01.png\" style=\"height:50px\"><\/a>";
    creditString += " <img src=\""+this.dirRoot+"img\/credit-1_02.png\" style=\"height:50px; padding:0px 4px 0px 4px\">";
    creditString += " <a href=\"http:\/\/www.cs.umd.edu\/hcil\/\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/credit-1_03.png\" style=\"height:50px\"><\/a>";
    creditString += " <img src=\""+this.dirRoot+"img\/credit-1_04.png\" style=\"height:50px;padding:0px 4px 0px 4px\">";
    creditString += " <a href=\"http:\/\/www.umd.edu\" target=\"_blank\"><img src=\""+this.dirRoot+"img\/credit-1_05.png\" style=\"height:50px\"><\/a>";
    creditString += "<\/div><br\/>";
    creditString += "";
    creditString += "<div align=\"center\" class=\"project_fund\">";
    creditString += "<i>Keshif<\/i> (<a target=\"_blank\" href=\"http:\/\/translate.google.com\/#auto\/en\/ke%C5%9Fif\">keşif<\/a>) means discovery and exploration in Turkish.<br\/><br\/>";
    creditString += "Research made practical. Funded in part by <a href=\"http:\/\/www.huawei.com\">Huawei<\/a>. <\/div>";
    creditString += "";

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
    hmmm.append("div");
    
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


    this.layoutBackground = this.root.append("div").attr("class","kshf layout_left_background");
    var mm=this.root.append("div").attr("class","kshf layout_left_header").append("div").attr("class","filter_header");
    mm.style("top",(this.chartTitle?"23":"0")+"px")
        .style("height",(this.line_height-2)+"px");
    mm.append("span").attr("class","filters_text").text("Filters");
    // insert clear all option
    var s= mm.append("span")
        .attr("class","filter-block-clear")
        .attr("filtered_row","false")
        .text("Clear All")
        .on("click",function(){
            kshf.clearAllFilters();
        });
    s.append("div")
        .attr("class","chartClearFilterButton allFilter")
        .attr("title","Clear all")
        .text("x")
        .on("click",function(){
            kshf.clearAllFilters();
        });

    mm.append("div").attr("class","leftBlockAdjustSize")
        .attr("title","Drag to adjust panel width")
        .style("height",(kshf.line_height-3)+"px")
        .on("mousedown", function (d, i) {
            log2Console("CLICK -  adjust left panel width");
            me.root.style('cursor','ew-resize');
            var mouseDown_x = d3.mouse(this.parentNode.parentNode)[0];
            var mouseDown_width = me.width_leftPanel_bar;
            me.root.on("mousemove", function() {
                var mouseMove_x = d3.mouse(this)[0];
                var mouseDif = mouseMove_x-mouseDown_x;
                me.time_animation_barscale = 0;
                me.layout_animation = 0;
                me.setBarWidthLeftPanel(mouseDown_width+mouseDif);
                me.layout_animation = 500;
            });
            me.root.on("mouseup", function(){
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

    if(this.chartTitle!==undefined){
        this.insertChartHeader();
    }

    this.layoutTop = this.root.append("div").attr("class", "kshf layout_top");
    this.layoutTop.append("div")
        .attr("class","barChartMainInfo")
        .text("⟾Item count ")
        .append("img")
        .attr("class","refreshbarscales")
        .attr("width","13")
        .style("margin-bottom","-2px")
//        .text("[x]")
        .attr("src",this.dirRoot+"img/Refresh_font_awesome.svg")
        ;
    this.layoutLeft = this.root.append("div").attr("class", "kshf layout_left");
    this.layoutRight  = this.root.append("div").attr("class", "kshf layout_right");
	
    this.loadSource();
};

kshf.createCharts = function(){
    if(this.loadedCb!==undefined) { this.loadedCb(); }
    for(var i=0; i<this.chartDefs.length; i++){
        this.addBarChart(this.chartDefs[i]);
    }
    this.createListDisplay(this.listDef);
    this.loaded = true;
    this.updateLayout();
    this.update();
    // hide infobox
    d3.select(".kshf.layout_infobox").style("display","none");
    d3.select("div.infobox_loading").style("display","none");
}

kshf.insertChartHeader = function(){
    this.layoutHeader = this.root.append("div").attr("class", "kshf layout_header").text(this.chartTitle);
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
    if(options.catLabelText===undefined){
        // get the 2nd attribute as row text [1st is expected to be the id]
        options.catLabelText = function(typ){ return typ.data[1]; };
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
    var i, chart, filteredCount=0;

    // if running for the first time, do stuff
    if(this.firsttimeupdate === undefined){
        for(i=0 ; i<this.items.length ; i++){
            this.items[i].updateSelected();
        }
    }

    kshf.time_animation_barscale = 400;
    // since some items may no longer be visible, you need to update list column headers too
    if(this.listDisplay){
        if(this.listDisplay.hideTextSearch!==true) {
            if(this.listDisplay.listDiv.select("input.bigTextSearch")[0][0].value!=="") filteredCount++;
        }
        // d3 - for each item
        this.listDisplay.updateItemVisibility();
        // not optimal too
        this.listDisplay.updateList();
    }

    if(this.charts[0].type==='scatterplot'){
        this.charts[0].updateTimeChartDotConfig();
    }

	// update each widget within
	for (i=0; i<this.charts.length; ++i){
        chart = kshf.charts[i];
        if(chart.type!=="RangeChart")
            chart.updateXAxisScale();
            chart.updateSelf();
        filteredCount += chart.getFilteredCount();
	}
    // "clear all filters" button
    this.root.select("span.filter-block-clear")
        .style("display",(filteredCount>0)?"inline-block":"none");
};

kshf.dif_activeItems = function(a,b){
	return b.activeItems - a.activeItems;
};

kshf.sortFunc_ActiveCount_TotalCount = function(a,b){ 
    var dif=kshf.dif_activeItems(a,b);
    if(dif===0) { return b.items.length-a.items.length; }
    return dif;
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
    var i,chart;
    for (i = 0; i < this.charts.length; ++i){
        kshf.charts[i].clearAllFilters();
    }
    this.update();
};

kshf.updateLayout_Height = function(){
    var i;
    var divHeight = $(this.domID).height();
    if(this.chartTitle !== undefined){
        divHeight-=22;
    }
    this.divWidth = $(this.domID).width();

    var divLineCount = Math.floor(divHeight/this.line_height);
    
    // number of barcharts, and initialize all charts as not processed yet
    var barChartCount = 0;
    var chartProcessed = [];
    var procBarCharts=0;
    var procBarChartsOld=-1;

    for (i = 0; i < this.charts.length; ++i){
        if(kshf.charts[i].type==='barChart'){ barChartCount++; }
        chartProcessed.push(false);
    }
    
    var divLineRem = divLineCount;

    // right panel ******************
    divLineRem = divLineCount;
    var c2=kshf.charts[0];
    if(c2.type==='scatterplot'){
        if(divLineRem>15){
            var targetScatterplotHeight = Math.floor(divLineRem/4)+1;
            c2.setRowCount_VisibleItem(targetScatterplotHeight-c2.rowCount_Header()-1);
            divLineRem-=c2.rowCount_Total_Right();
            chartProcessed[0]=true;
        } else { 
            c2.collapsedTime = true;
            c2.adjustLeftHeaderPadding();
            divLineRem--;
        }
    }

    // TODO: list item header is assumed to be 3 rows, but it may dynamically change!
    this.root.selectAll("div.listItemGroup")
        .transition()
        .duration(this.layout_animation)
        .style("height",(kshf.line_height * (divLineRem-3))+"px")
        ;

    // *********************************************************************************
    // left panel ***********************************************************************
    divLineRem = divLineCount;
    for (i=0; i < this.charts.length; ++i) {
        var c2=kshf.charts[i];
        if(c2.type==='scatterplot' && chartProcessed[i]===true){
            divLineRem-=c2.rowCount_Total();
            break;
        }
    }

    // numeric range filters have a constant height (for now)
    for (i=0; i < this.charts.length; ++i) {
        var c=kshf.charts[i];
        if(c.type==='RangeChart' && chartProcessed[i]===false){ divLineRem-=c.getHeight_Rows(); }
    }

    var finalPass = false;
    while(procBarCharts<barChartCount){
        procBarChartsOld = procBarCharts;
        var targetSharedHeight = Math.floor(divLineRem/(barChartCount-procBarCharts));
        for (i=0; i<this.charts.length; ++i) {
            var c=kshf.charts[i];
            if((c.type==='barChart' || c.type==='scatterplot') && chartProcessed[i]===false){
                if(divLineRem<c.rowCount_MinTotal()){
                    c.divRoot.style("display","none");
                    chartProcessed[i] = true;
                    procBarCharts++;
                    c.hidden = true;
                    continue;
                } else if(c.collapsed){
                    c.setRowCount_VisibleItem(3); // some number, TODO: do not insert chart items if not visible
                } else if(c.options.catDispCountFix){
                    c.setRowCount_VisibleItem(c.options.catDispCountFix);
                } else if(c.rowCount_MaxTotal()<=targetSharedHeight){
                    // you say you have 10 rows available, but I only needed 5. Thanks,
                    c.setRowCount_VisibleItem(c.catCount_Total);
                } else if(finalPass){
                    c.setRowCount_VisibleItem(targetSharedHeight-c.rowCount_Header()-1);
                } else {
                    continue;
                }
                c.hidden=false;
                c.divRoot.style("display","block");
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
            if(c3.type==='barChart' && c3.catCount_Total!==c3.rowCount_VisibleItem && c3.hidden===false){
                var tmp=divLineRem;
                divLineRem+=c3.rowCount_Total();
                c3.setRowCount_VisibleItem(c3.rowCount_VisibleItem+1);
                divLineRem-=c3.rowCount_Total();
                if(tmp!==divLineRem) allDone=false;
            }
        }
    }

    // adjust layout_right vertical position
    c2=kshf.charts[0];
    var topOffset=0;
    if(c2.type==='scatterplot'){
        topOffset = c2.rowCount_Total()-c2.rowCount_Total_Right();
        if(topOffset>0) topOffset--;
    }

    this.root.selectAll("div.layout_right")
        .transition()
        .duration(this.layout_animation)
        .style("top", (-topOffset*kshf.line_height)+"px");
};


kshf.updateLayout = function(){
    if(kshf.loaded!==true){
        return;
    }

    this.updateLayout_Height();

    // WIDTH
    kshf.time_animation_barscale = 400;
    this.setBarWidthLeftPanel(Math.floor((this.divWidth-this.categoryTextWidth)/11));
}

kshf.setCategoryTextWidth = function(w){
    this.categoryTextWidth = w;
    for(i = 0; i < this.charts.length; ++i){
        if(kshf.charts[i].type==='barChart' || kshf.charts[i].type==='scatterplot'){
            kshf.charts[i].options.rowTextWidth = w;
            kshf.charts[i].updateWidth(w);
        }
    }
    this.updateAllTheWidth();
}

kshf.setBarWidthLeftPanel = function(v){
    if(v>200) {
//        v=200;
    } else if(v>55){
        this.root.attr("hideBars",false);
        this.root.attr("hideBarAxis",false);
    } else if(v>10){
        this.root.attr("hideBars",false);
        this.root.attr("hideBarAxis",true);
    } else { 
        this.root.attr("hideBars",true);
        this.root.attr("hideBarAxis",true);
        v = 0; 
    }
    this.width_leftPanel_bar = v;

    for(i = 0; i < this.charts.length; ++i){
        if(kshf.charts[i].type==='barChart' || kshf.charts[i].type==='scatterplot'){
            kshf.charts[i].setBarWidth(this.width_leftPanel_bar);
        }
    }
    this.updateAllTheWidth();
}

kshf.updateAllTheWidth = function(v){
    this.width_leftPanel_total = this.width_leftPanel_bar+this.categoryTextWidth+kshf.scrollWidth + kshf.scrollPadding +2;
    for (i = 0; i < this.charts.length; ++i){
        if(kshf.charts[i].type==='RangeChart'){
            kshf.charts[i].setWidth(this.width_leftPanel_total);
        }
    }

    var rowLabelOffset = this.charts[0].getRowLabelOffset();

    this.root.select("div.layout_left_background").style("width",(this.width_leftPanel_total)+"px");
    this.root.select("div.leftBlockAdjustSize").style("left",(this.width_leftPanel_total)+"px");
    this.root.select("div.filter_header").style("width",(this.width_leftPanel_total-8)+"px");

    var width_rightPanel_total = this.divWidth-this.width_leftPanel_total-kshf.scrollPadding-15; // 15 is padding
    for (i = 0; i < this.charts.length; ++i){
        if(kshf.charts[i].type==='scatterplot'){
            kshf.charts[i].setTimeWidth(width_rightPanel_total);
            break;
        }
    }
    // for some reason, on page load, this variable may be null. urgh.
    if(this.listDisplay){
        this.listDisplay.listDiv.style("width",width_rightPanel_total+"px");
    }

    // update list
    this.maxTotalColWidth = width_rightPanel_total*kshf.listMaxColWidthMult;
    this.width_rightPanel_total = width_rightPanel_total;

    kshf.updateCustomListStyleSheet();
}

kshf.updateCustomListStyleSheet = function(){
    var customSheet = document.createElement('style');
    customSheet.innerHTML = "";
    var totalColWidth=0;
    var columnPadding=5;//pixels per column
    for(i=0; i< 1; i++){
        var j=kshf.listDisplay.listSortOrder[i];
        var optionWidth=this.listDisplay.config[j].width;
        customSheet.innerHTML+=
            "div.listDiv div.listsortcolumn{ width: "+optionWidth+"px;}";
        totalColWidth+=optionWidth;
    }
    var contentWidth = (this.width_rightPanel_total-totalColWidth-30);
    customSheet.innerHTML += "div.listItem div.content{ width:"+contentWidth+"px; }";
    this.listDisplay.listDiv.select("span.listheader_count_wrap").style("width",totalColWidth+"px");
    this.listDisplay.listDiv.select("div.listHeader span.filter-blocks").style("padding-left",(totalColWidth+13)+"px");
//    this.listDisplay.dom.listItems.select(".content").style("width",contentWidth+"px");
    if(!this.specialStyle){
        this.specialStyle = document.body.appendChild(customSheet);
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
kshf.Chart.prototype.getRowLabelOffset = function(){
    if(!this._labelXOffset){
        var maxTotalCount = kshf.items.length;
        this._labelXOffset = 12;
        var digits = 1;
        while(maxTotalCount>9){
            digits++
            maxTotalCount = Math.floor(maxTotalCount/10);
        }
        this._labelXOffset += digits*6;
    }
    return this._labelXOffset;
};


// ***********************************************************************************************************
// WHIZ BAR CHART
// ***********************************************************************************************************

kshf.BarChart = function(_kshf, options){
    // Call the parent's constructor
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
        for(var i=0; i<kshf.items.length; i++){
            kshf.items[i].timePos = this.options.timeItemMap(kshf.items[i]);
        }
        this.data_minDate = d3.min(kshf.items, this.options.timeItemMap);
        this.data_maxDate = d3.max(kshf.items, this.options.timeItemMap);
        // calculate minYear and maxYear per cetegory
        this.updateData_TimeMinMax();
        var i;
        var d=this.getData();
        for(i=0; i<d.length; i++){
            d[i].xMin = d[i].xMin_Dyn;
            d[i].xMax = d[i].xMax_Dyn;
        }
    }
    this.init_shared2();
};
// Setup the prototype chain the right way
kshf.extendClass(kshf.Chart, kshf.BarChart);

kshf.BarChart.prototype.rowCount_Header_Left = function(){
    var r=1; // title
    if(this.options.sortingFuncs.length>1) {r++;}
    if(this.showTextSearch){ r++;}
    return r;
};
kshf.BarChart.prototype.rowCount_Header_Right = function(){
    if(this.type==='scatterplot'){
        if(this.collapsed || this.collapsedTime) return 1;
        return (this.options.timeTitle)?3:2;
    }
    return 0;
};
kshf.BarChart.prototype.rowCount_Header = function(){
    var h= Math.max(this.rowCount_Header_Left(),this.rowCount_Header_Right());
    if(this.id===0){
        if(this.rowCount_Header_Right()-this.rowCount_Header_Left()<1) h++;
    }
    return h;
};

kshf.BarChart.prototype.init_shared = function(options){
	// register
    var i,j,f;

    this.barMaxWidth = 0;

	//sorting options
    //assert(this.options.sorting);
    // select the first sorting function as default
    this.sortID=0;
    this.sortInverse=false;
    this.options.timeMaxWidth=0;
	// filter options - must be always specified

    if(this.options.catItemMap===undefined){
        var tableName = this.parentKshf.source.sheets[0].name;
        var colId = this.parentKshf.dt_ColNames[tableName][this.options.facetTitle];
        this.options.catItemMap = function(d){ 
            return d.data[colId];
        }
    }
    if(this.type==="scatterplot" && this.options.timeItemMap===undefined){
        var tableName2 = this.parentKshf.source.sheets[0].name;
        var colId2 = this.parentKshf.dt_ColNames[tableName2][this.options.timeTitle];
        this.options.timeItemMap = function(d){ 
            return d.data[colId2];
        }
    }

    // generate row table if necessary
    if(this.options.generateRows){
        this.catTableName = this.options.catTableName+"_h_"+this.id;
        kshf.createTableFromTable(kshf.items,this.catTableName, this.options.catItemMap);
    } else {
        this.catTableName = this.options.catTableName;
    }

    // BIG. Apply row map function
    var dt = kshf.items;
    var curDtId = this.getData_wID();
    for(i=0;i<dt.length;i++){
        var item = dt[i];
        // assume all filters pass
        for(j=0,f=this.filterId;j<this.filterCount;j++,f++){
            item.filters[f] = true;
        }
        var toMap = this.options.catItemMap(item);
        if(toMap===undefined || toMap==="") { 
            toMap=null;
        } else if(Array.isArray(toMap)){
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
        item.mappedRows[this.filterId] = [];
        if(toMap===null) { continue; }
        if(Array.isArray(toMap)){
            for(j=0;j<toMap.length;j++){
                var m=curDtId[toMap[j]];
                if(m){
                    m.items.push(item);
                    m.activeItems++;
                    m.sortDirty = true;
                    item.mappedRows[this.filterId].push(m);
                }
            }
        } else {
            curDtId[toMap].items.push(item);
            curDtId[toMap].activeItems++;
            curDtId[toMap].sortDirty = true;
            item.mappedRows[this.filterId].push(curDtId[toMap]);
        }
    }

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

    // scrollbar options - depends on _dataMap - this.catCount_Total
	this.scrollbar = { }; /*
    if(!this.rowCount_VisibleItem) {
        this.rowCount_VisibleItem = this.catCount_Total;
    }*/
    this.scrollbar.firstRow = 0;
    this.x_axis_active_filter = null;
};

kshf.BarChart.prototype.updateTotalItemCount = function(){
    var i,dt=this.getData();
    this.catCount_Total = 0;
    for(i=0; i<dt.length ; i++){
        if(this._dataMap(dt[i])!==null) { this.catCount_Total++; }
    }
};

kshf.BarChart.prototype.getWidth = function(){
    return this.options.rowTextWidth + 
        this.barMaxWidth +
        ((this.type==='scatterplot')?(this.options.timeMaxWidth+kshf.sepWidth):0) +
        kshf.scrollWidth + // assume scrollbar is on
        kshf.scrollPadding
        +2;
};

kshf.BarChart.prototype.rowCount_Total = function(){
    if(this.collapsed){
        if(this.id===0) return 2;
        return 1;
    }
    // need 1 more row at the bottom is scrollbar is shown, or barInfoText is set
    var bottomRow=1;
//    if(this.scrollbar.show || this.options.barInfoText!==undefined) bottomRow=1;
    return this.rowCount_VisibleItem+this.rowCount_Header()+bottomRow;
};
kshf.BarChart.prototype.rowCount_Total_Right = function(){
    if(this.type==='scatterplot' && this.collapsedTime===true){
        return 1;
    }
    return this.rowCount_Total();
};

kshf.BarChart.prototype.rowCount_MaxTotal = function(){
    return this.catCount_Total+this.rowCount_Header()+1;
};
kshf.BarChart.prototype.rowCount_MinTotal = function(){
    var _min =  (this.catCount_Total<3)?this.catCount_Total:3;
    return _min+this.rowCount_Header()+1;
};

kshf.BarChart.prototype.updateChartTotalWidth = function(){
    this.divRoot.style("width",this.getWidth()+"px");
    // to capture click/hover mouse events
    this.root.select("rect.chartBackground").attr('width',this.getWidth());
    this.root.select("g.headerGroup .headerHTML").attr('width',this.getWidth());
    this.root.select("rect.clippingRect")
        .attr("width",this.getWidth())
        ;

};

kshf.BarChart.prototype.init_shared2 = function(){
    var kshf_ = this;
    var me=this;
    
    this.divRoot = this.options.layout
        .append("div").attr("class","kshfChart");

	this.root = this.divRoot
        .append("svg")
            .attr("xmlns","http://www.w3.org/2000/svg")
            .style("width","100%")
            .style("height","100%");
    // to capture click/hover mouse events
    this.root.append("svg:rect")
        .attr("class","chartBackground")
        .style("opacity",0)
        .on("mousewheel",function(event){
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
            if(delta<-0.1) { 
                kshf_.setScrollPosition(kshf_.scrollbar.firstRow+1);
            }
            if(delta>0.1) { 
                kshf_.setScrollPosition(kshf_.scrollbar.firstRow-1);
            }

            if (event.preventDefault) {//disable default wheel action of scrolling page
                event.preventDefault();
            } else {
                return false;
            }
        })
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
            .style("stop-opacity",0.5);
        gradient.append("svg:stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.5);
        gradient.append("svg:stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0);

        gradient =this.root.append("svg:radialGradient")
            .attr("id","dotGradient75")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("svg:stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.75);
        gradient.append("svg:stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0.75);
        gradient.append("svg:stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0);

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
            .style("stop-opacity",0);

        gradient =this.root.append("svg:radialGradient")
            .attr("id","dotGradient100")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%");
        gradient.append("svg:stop")
            .attr("offset","0%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",1.00);
        gradient.append("svg:stop")
            .attr("offset","25%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",1.00);
        gradient.append("svg:stop")
            .attr("offset","100%")
            .style("stop-color",dotBackgroundColor)
            .style("stop-opacity",0);

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
        .attr("transform", function(d,i) {
            return "translate(0," + ((kshf.line_height*me.rowCount_Header())) + ")";
        })
        ;
	var barGroup = barGroup_Top.append("svg:g")
		.attr("class","barGroup");
	barGroup.selectAll("g.row")
		.data(this.getData(), this._dataMap)
	  .enter().append("svg:g")
		.attr("class", "row")
        .each(function(d){
            var items = d.items;
            for(var i=0; i<items.length; i++){
                items[i].cats.push(this);
            }
        })
		;
    this.dom.g_row = this.root.selectAll('g.row');
	this.root
        .append("svg:g")
		.attr("class", "timeAxisGroup")
		.on("mousedown", function (d, i) { d3.event.preventDefault(); })
      .append("svg:g").attr("class","tickGroup");

    this.insertHeader();
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
kshf.BarChart.prototype.getMaxSelectedItemsPerRow = function(){
    var dataMapFunc = this._dataMap;
    this._maxSelectedItemsPerRow = d3.max(this.getData(), function(d){ 
        if(dataMapFunc(d)===null) { return null; }
        return d.activeItems;
    });
    return this._maxSelectedItemsPerRow;
};

kshf.BarChart.prototype.updateSelf = function(){
	this.refreshActiveItemCount();
    this.refreshBarHeight();
    if(this.type==="scatterplot"){
        this.refreshTimeChartTooltip();
        this.refreshTimeChartBarDisplay();
    }
    this.refreshBarDisplay();
	this.updateSorting();
};

kshf.BarChart.prototype.updateData_TimeMinMax = function(){
    var kshf_ = this;
    var i;
    var specFunc = function(d){
        if(!d.selected) { return undefined; }
        return d.timePos;
    };
    var rows=this.getData();
	for(i=0; i<rows.length; i++){
		var rowData=rows[i];
        if(rowData.sortDirty===false) continue;
		rowData.xMin_Dyn = d3.min(rowData.items, specFunc);
		rowData.xMax_Dyn = d3.max(rowData.items, specFunc);
	}
};


kshf.BarChart.prototype.refreshActiveItemCount = function(){
    var me = this;
    this.dom.item_count.text(function(d) { return "("+d.activeItems+")";});
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
	if(this.dom.timeBar) this.dom.timeBar
		.attr("height", function(d,i){ return (d.activeItems>0)?12:6; })
		.attr("y",function(d,i){ return (d.activeItems>0)?3:6; });
	this.root.selectAll('g.barGroup g.row rect.active')
		.attr("height", function(d,i){ return (d.activeItems>0)?10:4; })
		.attr("y",function(d,i){ return (d.activeItems>0)?4:7; });
};
kshf.BarChart.prototype.refreshBarDisplay = function(){
	var kshf_=this;
	this.dom.bar_active
        .transition()
        .duration(kshf.time_animation_barscale)
		.attr("width", function(d){return kshf_.xAxisScale(d.activeItems);})
        ;
};
// Applies alternating color for bar helper lines
kshf.BarChart.prototype.refreshBarLineHelper = function(){
	if(this.options.display.row_bar_line===true){
		this.root.selectAll(".row_bar_line")
			.attr("stroke", function(d,i) {
				return (i%2===0)?"rgb(200,200,200)":"rgb(80,80,80)";
			});
	}
};
kshf.BarChart.prototype.getFilteredCount = function(){
    var r=this.isFiltered_Row();
    if(this.type==="scatterplot"){
        r+=this.isFiltered_Time();
    }
    return r;
}
kshf.BarChart.prototype.refreshFilterRowState = function(){
	var filtered = this.catCount_Selected!==0;
	this.divRoot.attr("filtered_row",filtered);
	this.root.selectAll("g.barGroup g.row")
		.attr("selected", function(d) { return d.selected; });
};

kshf.BarChart.prototype.isFiltered_Row = function(state){
    return this.catCount_Selected!==0;
};
kshf.BarChart.prototype.isFiltered_Time = function(){
	return this.timeFilter_ms.min!==this.chartX_min_ms ||
	       this.timeFilter_ms.max!==this.chartX_max_ms ;
};
//! Rows, not data!
kshf.BarChart.prototype.selectAllRows = function(state){
    var i;
    var rows=this.getData();
    for(i=0; i<rows.length ; i++){ rows[i].selected = state; }
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

kshf.BarChart.prototype.clearTimeFilter = function(toUpdate){
	this.timeFilter_ms.min = this.chartX_min_ms;
	this.timeFilter_ms.max = this.chartX_max_ms;
	this.yearSetXPos();
    this.filterTime();
    if(toUpdate!==false) { kshf.update(); }
};

kshf.BarChart.prototype.collapseCategories = function(hide){
    this.collapsed = hide;
    this.adjustLeftHeaderPadding();
    kshf.updateLayout_Height();
}

kshf.BarChart.prototype.collapseTime = function(hide){
    this.collapsedTime = hide;
    this.adjustLeftHeaderPadding();
    kshf.updateLayout_Height();
}

kshf.BarChart.prototype.adjustLeftHeaderPadding = function(hide){
    var me=this;
    var collapsedHeaderPadding=0;
    if(this.id===0){
        collapsedHeaderPadding = kshf.line_height;
    }

    this.leftHeaderPaddingTop = ((this.rowCount_Header() - this.rowCount_Header_Left())*kshf.line_height);

    this.headerhtml.select("span.leftHeader")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .style("padding-top",(this.collapsed?collapsedHeaderPadding:this.leftHeaderPaddingTop)+"px");

    this.root.select("g.barGroup_Top")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr("transform", function(d,i) {
            return "translate(0," + ((kshf.line_height*me.rowCount_Header())) + ")";
        })

    this.root.select("g.x_axis")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr("transform","translate("+this.options.rowTextWidth+","+(kshf.line_height*(this.rowCount_Header()))+")")

    this.root.select("g.timeAxisGroup")
        .attr("transform","translate("+
              (this.barMaxWidth+kshf.scrollPadding+kshf.scrollWidth+kshf.sepWidth+this.options.rowTextWidth)+","+
              (kshf.line_height*(this.rowCount_Header()-0.5)+2)+")");
}


kshf.BarChart.prototype.insertHeader = function(){
	var kshf_ = this;
    var rows_Left = this.rowCount_Header_Left();

    this.leftHeaderPaddingTop = ((this.rowCount_Header() - this.rowCount_Header_Left())*kshf.line_height);

	var headerGroup = this.root.append("svg:g").attr("class","headerGroup")
        .on("mouseclick", function (d, i) { d3.event.preventDefault(); });
    this.headerhtml=headerGroup.append("svg:foreignObject").attr("class","headerHTML")
        .attr("width",kshf_.options.rowTextWidth+200)
        .attr("height",this.rowCount_Header()*kshf.line_height+2)
        .attr("x",0)
        .attr("y",0);
    if(this.id!==0){
        this.headerhtml.append("xhtml:div").attr("class","chartAboveSeparator")
            .on("mousedown", function (d, i) {
                log2Console("CLICK -  adjust filter height",kshf_);
                kshf.root.style('cursor','ns-resize');
                d3.event.preventDefault();
                kshf.root.on("mouseup", function(){
                    kshf.root.style( 'cursor', 'default' );
                });
            })
            .on("click",function(){
                d3.event.stopPropagation();
                d3.event.preventDefault();
            });
            ;
        }
    var leftBlock = this.headerhtml.append("xhtml:span").attr("class","leftHeader")
        .style("width",(kshf_.options.rowTextWidth-this.getRowLabelOffset())+"px")
        .style("padding-top",this.leftHeaderPaddingTop+"px")
        ;
    var headerLabel = leftBlock.append("xhtml:span")
        .attr("class", "header_label")
        .attr("title", this.catCount_Total+" categories")
        .html(this.options.facetTitle)
        .on("click",function(){ 
            if(kshf_.collapsed) { kshf_.collapseCategories(false); }
        })
        ;
    leftBlock.append("xhtml:span").attr("class","header_label_arrow header_label_down")
        .attr("title","Show categories").text("▼")
        .on("click",function(){ kshf_.collapseCategories(false); })
        ;
    leftBlock.append("xhtml:span").attr("class","header_label_arrow header_label_up"  )
        .attr("title","Hide categories").text("▲")
        .on("click",function(){ kshf_.collapseCategories(true); })
        ;
    leftBlock.append("xhtml:div")
        .attr("class","chartClearFilterButton rowFilter")
        .attr("title","Clear filter")
		.on("click", function(d,i){ kshf_.clearRowFilter(); })
        .text('x');
    if(this.type==="scatterplot"){
        var rightBlock = this.headerhtml.append("xhtml:span").attr("class","rightHeader");
        rightBlock.append("xhtml:span")
            .attr("class", "header_label")
            .text(this.options.timeTitle)
            .on("click",function(){ if(kshf_.collapsedTime) { kshf_.collapseTime(false); } })
            ;
        rightBlock.append("xhtml:span").attr("class","header_label_arrow header_label_down")
            .attr("title","Show categories").text("▼")
            .on("click",function(){ kshf_.collapseTime(false); })
            ;
        rightBlock.append("xhtml:span").attr("class","header_label_arrow header_label_up"  )
            .attr("title","Hide categories").text("▲")
            .on("click",function(){ kshf_.collapseTime(true); })
            ;
        rightBlock.append("xhtml:div")
            .attr("class","chartClearFilterButton timeFilter")
            .attr("title","Clear filter")
            .on("click", function(d,i){ kshf_.clearTimeFilter(); })
            .text('x');
    }
	// line
    var line_y = kshf.line_height*this.rowCount_Header()-0.5;
    headerGroup.append("svg:text")
        .attr("class", "barInfo")
        .text( ((this.options.barInfoText!==undefined)?this.options.barInfoText:"") )
        ;
	var xxx=headerGroup.append("svg:g")
		.attr("transform","matrix(0.008,0,0,0.008,"+(this.options.rowTextWidth-this.getRowLabelOffset()+5)+","+(line_y-kshf.line_height+3)+")")
		.attr("class","resort_button")
		;
        xxx.append("svg:title").text("Move selected rows to top & re-order");
        xxx.append("svg:rect")
            .attr("x",0)
            .attr("y",0)
            .attr("width",1500)
            .attr("height",1500)
            .on("click",function(d){
                kshf_.sortDelay = 0; 
                kshf_.updateSorting(true);
            })
            ;
        xxx.append("svg:path")
            .attr("d",
                "M736 96q0 -12 -10 -24l-319 -319q-10 -9 -23 -9q-12 0 -23 9l-320 320q-15 16 -7 35q8 20 30 20h192v1376q0 14 9 23t23 9h192q14 0 23 -9t9 -23v-1376h192q14 0 23 -9t9 -23zM1792 -32v-192q0 -14 -9 -23t-23 -9h-832q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h832 q14 0 23 -9t9 -23zM1600 480v-192q0 -14 -9 -23t-23 -9h-640q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h640q14 0 23 -9t9 -23zM1408 992v-192q0 -14 -9 -23t-23 -9h-448q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h448q14 0 23 -9t9 -23zM1216 1504v-192q0 -14 -9 -23t-23 -9h-256 q-14 0 -23 9t-9 23v192q0 14 9 23t23 9h256q14 0 23 -9t9 -23z")
//            .attr("d","m 1511,480 q 0,-5 -1,-7 Q 1446,205 1242,38.5 1038,-128 764,-128 618,-128 481.5,-73 345,-18 238,84 L 109,-45 Q 90,-64 64,-64 38,-64 19,-45 0,-26 0,0 v 448 q 0,26 19,45 19,19 45,19 h 448 q 26,0 45,-19 19,-19 19,-45 0,-26 -19,-45 L 420,266 q 71,-66 161,-102 90,-36 187,-36 134,0 250,65 116,65 186,179 11,17 53,117 8,23 30,23 h 192 q 13,0 22.5,-9.5 9.5,-9.5 9.5,-22.5 z m 25,800 V 832 q 0,-26 -19,-45 -19,-19 -45,-19 h -448 q -26,0 -45,19 -19,19 -19,45 0,26 19,45 l 138,138 Q 969,1152 768,1152 634,1152 518,1087 402,1022 332,908 321,891 279,791 271,768 249,768 H 50 Q 37,768 27.5,777.5 18,787 18,800 v 7 q 65,268 270,434.5 205,166.5 480,166.5 146,0 284,-55.5 138,-55.5 245,-156.5 l 130,129 q 19,19 45,19 26,0 45,-19 19,-19 19,-45 z")
            .attr("class","unselected")
            ;
    if(this.showTextSearch){
        leftBlock.append("xhtml:img")
            .attr('src',this.parentKshf.dirRoot+"img/search-logo.svg")
            .attr("class","chartRowLabelSearch")
            .attr("width","13")
            ;
        this.dom.showTextSearch= leftBlock.append("xhtml:input")
            .attr("type","text")
            .attr("class","chartRowLabelSearch")
//            .style("margin-right",(this.getRowLabelOffset())+"px")
            .attr("placeholder","Search: "+this.options.facetTitle.toLowerCase())
            .on("input",function(){
                log2Console("INPUT - title text search");
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
                    kshf_.filter_all();
                    kshf_.refreshFilterRowState();
                    kshf.update();
                    kshf_.refreshFilterSummaryBlock();
                    d3.event.stopPropagation();
                    d3.event.preventDefault();
                }, 750);
            })
            .on("blur",function(){
                d3.event.stopPropagation();
                d3.event.preventDefault();
            })
            ;
    }
	if(this.options.sortingFuncs.length>1) {
        leftBlock.append("xhtml:select")
            .attr("class","sortOptionSelect")
			.on("change", function(){
                log2Console("CLICK - filter category sorting change",kshf_);
				kshf_.sortID = this.selectedIndex;
				kshf_.sortInverse = false;
                kshf_.sortDelay = 0;
                kshf_.sortSkip = false;
				kshf_.updateSorting.call(kshf_,true);
			})
        .selectAll("input.sort_label")
			.data(this.options.sortingFuncs)
		  .enter().append("xhtml:option")
			.attr("class", "sort_label")
			.text(function(d){ return d.name; })
			.attr(function(d){ return d.name; })
			;
        leftBlock.append("xhtml:span")
            .attr("class","sortOptionSelect_Label")
            .text("Sort by:")
    }

    kshf.layoutTop.select(".barChartMainInfo")
        .style("left",(kshf_.options.rowTextWidth-this.getRowLabelOffset()+9)+"px");

};

kshf.BarChart.prototype.setTimeWidth = function(w){
    this.options.timeMaxWidth = w;

    this.setTimeTicks();

    this.updateTimeChartBarsDots();
    this.refreshTimeChartBarDisplay();
    this.insertTimeTicks();
    this.insertTimeChartAxis();
    this.updateChartTotalWidth();
    this.updateScrollBarPos();
    
    this.root.select("g.headerGroup span.rightHeader")
        .style("width",(w)+"px");
    this.root.select("g.timeAxisGroup")
        .attr("transform","translate("+
              (this.barMaxWidth+kshf.scrollPadding+kshf.scrollWidth+kshf.sepWidth+this.options.rowTextWidth)+","+
              (kshf.line_height*(this.rowCount_Header()-0.5)+2)+")");
	if(this.options.display.row_bar_line){
        var x2=this.options.rowTextWidth+this.barMaxWidth+this.timeScale.range()[1]+kshf.scrollPadding+kshf.scrollWidth;
        this.root.selectAll("line.row_bar_line")
            .attr("x2",x2);
    }

    this.updateTimeChartDotConfig();
};

kshf.BarChart.prototype.updateTimeChartDotConfig = function(){
    var me = this;
    if(this.options.timeDotConfig === undefined && this.type==='scatterplot'){
        var mmm = this.options.timeMaxWidth/10;
        var timeRange = this.chartX_max_ms-this.chartX_min_ms;
        var spannedRange = 0;
        this.dom.timeBarActive
            .each(function(d) {
                if(me.catCount_Selected===0 || d.selected===true){
                    spannedRange += (d.xMax-d.xMin);
                }
            })
        var numOfItems = this.parentKshf.itemsSelectedCt;
        mmm = mmm*(spannedRange/timeRange);
        if(mmm>numOfItems*4){
            this.divRoot.attr("dotconfig","Solid");
        } else if(mmm>numOfItems*2){
            this.divRoot.attr("dotconfig","Gradient-100");
        } else if(mmm>numOfItems){
            this.divRoot.attr("dotconfig","Gradient-75");
        } else if(mmm>numOfItems*0.5){
            this.divRoot.attr("dotconfig","Gradient-50");
        } else {
            this.divRoot.attr("dotconfig","Gradient-25");
        }
    }
}

kshf.BarChart.prototype.updateXAxisScale = function(){
    this.xAxisScale = d3.scale.linear()
        .domain([0,this.getMaxSelectedItemsPerRow()])
        .rangeRound([0, this.barMaxWidth]);

    this.updateBarWidth();
    this.refreshBarDisplay();
    this.insertXAxisTicks();
}

kshf.BarChart.prototype.setBarWidth = function(w){
    if(this.barMaxWidth===w) { return; }
    this.barMaxWidth = w;
    this.updateAllWidth();
}
    
kshf.BarChart.prototype.updateAllWidth = function(w){
    this.updateXAxisScale();
    
    // update x axis items
    this.root.select("g.headerGroup div.chartAboveSeparator")
        .style("width",(this.options.rowTextWidth+this.barMaxWidth+kshf.scrollWidth+kshf.scrollPadding)+"px")
        ;
    
    this.updateScrollBarPos();
    
	if(this.options.display.row_bar_line){
        var x2=this.options.rowTextWidth+this.barMaxWidth+(this.timeScale?this.timeScale.range()[1]:0)+kshf.scrollPadding+kshf.scrollWidth;
        this.root.selectAll("line.row_bar_line")
            .attr("x2",x2);
    }
    
    this.updateChartTotalWidth();
};

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
//    if(c===this.rowCount_VisibleItem){ return; }
    if(c>this.catCount_Total){ c = this.catCount_Total; }
    if(c<0){ c=1; }
    if(this.catCount_Total<=3){ 
        c = this.catCount_Total;
    } else {
        c = Math.max(c,3);
    }
    if(this.rowCount_VisibleItem === c){
//        return;
    }
    this.rowCount_VisibleItem = c;
    // if current scrollbar first row is no longer possible
    this.scrollbar.firstRow = Math.min(this.scrollbar.firstRow,this.firstRowMax());
    
    // should we display scrollbar or not?
    if(this.rowCount_VisibleItem===this.catCount_Total){
        this.removeScrollBar();
    } else {
        if(this.scrollbar.show!==true){
            this.insertScrollbar();
        }
    }

    var totalHeight = kshf.line_height*this.rowCount_Total();
    var barsHeight  = kshf.line_height*this.rowCount_VisibleItem;

    var kshf_ = this;
    this.divRoot
        .attr("collapsed",this.collapsed===false?"false":"true")
        .attr("collapsedTime",this.collapsedTime===false?"false":"true")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .style("height",totalHeight+"px");
    this.root.select("rect.chartBackground").attr('height', kshf.line_height*this.rowCount_Total());
    
    // update clippath height
    this.root.select("#kshf_chart_clippath_"+this.id+" rect")
        .transition()
        .duration(this.parentKshf.layout_animation)
		.attr("height",barsHeight);
    
    this.root.select("g.headerGroup text.barInfo")
        .attr("y",totalHeight-8)
        .attr("x", this.options.rowTextWidth)
        ;
    
    // update scrollbar height
    this.root.selectAll("g.scrollGroup rect.background")
        .transition()
        .duration(this.parentKshf.layout_animation)
		.attr("height",barsHeight+1);
    this.root.selectAll("g.scrollGroup text.scroll_display_more")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr('y',(barsHeight+10));
    
    // update x axis items
	this.root.selectAll("g.timeAxisGroup g.filter_handle line")
        .transition()
        .duration(this.parentKshf.layout_animation)
		.attr("y2", barsHeight+kshf.line_height*1.5-4);
	this.root.selectAll("g.timeAxisGroup rect.filter_nonselected")
        .transition()
        .duration(this.parentKshf.layout_animation)
		.attr("height", barsHeight);
    this.root.selectAll("g.x_axis g.tick line")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr("y2", barsHeight);

    // how much is one row when mapped to the scroll bar?
	this.scrollbar.rowScrollHeight = kshf.line_height*this.rowCount_VisibleItem/this.catCount_Total;
	
    this.updateScrollBarPos();
    this.refreshScrollbar(true);
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
    // TODO: don't need this variable, use DOM information to see if scrollbar group exist
    this.scrollbar.show = true;
    var kshf_ = this;
    
    // *****************
	var scrollGroup = this.root.append("svg:g").attr("class","scrollGroup")
		.on("mousedown", function (d, i) { d3.event.preventDefault(); })
		;
    // left scroll
    this.dom.leftScroll = scrollGroup.append("svg:g").attr("class","leftScroll");
    this.insertScrollbar_do(this.dom.leftScroll);
    if(this.type==='scatterplot'){
        this.dom.rightScroll = scrollGroup.append("svg:g").attr("class","rightScroll");
        this.insertScrollbar_do(this.dom.rightScroll);
    }

    // more
    scrollGroup.append("svg:text").attr("class","scroll_display_more")
        .on("mousedown",function(){
            log2Console("CLICK: scroll - more",kshf_);
            scrollGroup.selectAll("text.row_number").style("display","block");
            kshf_.scrollBarUp_Active = true; 
            kshf_.scrollBarUp_TimeStep = 200;
            kshf_.stepScrollPosition(1);
        })
        .on("mouseup",function(){ kshf_.scrollBarUp_Active = false; })
        .on("mouseover",function(e){ 
            d3.select(this).attr("highlight",true); 
        })
        .on("mouseout",function(){ 
            d3.select(this).attr("highlight",false); 
            kshf_.scrollBarUp_Active = false; 
            scrollGroup.selectAll("text.row_number").style("display","");
        })
        ;
    
    this.updateScrollBarPos();
    this.refreshScrollbar();
    this.updateChartTotalWidth();
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
                log2Console("CLICK: scroll - go_top",kshf_);
                kshf_.scrollbar.firstRow=0;
                kshf_.refreshScrollbar(true);
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
            log2Console("CLICK: scroll - background_up");
            kshf_.scrollBarUp_Active = true; 
            kshf_.scrollBarUp_TimeStep = 200;
            kshf_.stepScrollPosition(-1);
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
            log2Console("CLICK: scroll - background_down",kshf_);
            kshf_.scrollBarUp_Active = true; 
            kshf_.scrollBarUp_TimeStep = 200;
            kshf_.stepScrollPosition(1);
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
            log2Console("CLICK: scroll - handle");
			kshf_.scrollbar.active=true;
			d3.select(this).attr("selected", "true");
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
				btn.attr("selected", "false");
				// unregister mouse-move callbacks
                parentDom.selectAll("text.row_number").style("display","");
				kshf_.root.on("mousemove", null);
				kshf_.root.on("mouseup", null);
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
kshf.BarChart.prototype.updateScrollBarPos = function(){
	var translate_left = this.options.rowTextWidth+this.barMaxWidth+kshf.scrollPadding;//+this.options.timeMaxWidth;
    this.root.select("g.scrollGroup")
        .transition()
        .duration(this.parentKshf.layout_animation)
        .attr("transform","translate(0,"+(kshf.line_height*this.rowCount_Header())+")");
	this.root.select("g.scrollGroup g.leftScroll")
        .transition()
        .duration(this.parentKshf.layout_animation)
		.attr("transform","translate("+
			translate_left+",0)");
    if(this.type==='scatterplot'){
        this.root.select("g.scrollGroup g.rightScroll")
            .transition()
            .duration(this.parentKshf.layout_animation)
            .attr("transform","translate("+(this.getWidth()-15)+",0)");
    }

    this.root.select("text.scroll_display_more")
        .attr("x", this.options.rowTextWidth-this.getRowLabelOffset());
};

kshf.BarChart.prototype.removeScrollBar = function(){
    this.scrollbar.show = false;	
    this.root.select("g.scrollGroup").remove();
    this.updateChartTotalWidth();
};

kshf.BarChart.prototype.filter_all = function(){
    var i,j;
    var items = kshf.items;
    var curDtId = this.getData_wID();
    var allSelected = this.catCount_Selected===0;
    for(i=0 ; i<items.length ; i++){
        var item = items[i];
        if(allSelected){
            item.filters[this.filterId] = true;
        } else {
            var m=item.mappedData[this.filterId];
            if(m===undefined || m===null || m===""){ 
                item.filters[this.filterId] = false;
            } else {
                if(Array.isArray(m)){
                    // if one of the mappings is true, then item is added
                    for(j=0;j<m.length;j++){
                       if(curDtId[m[j]].selected) {
                            item.filters[this.filterId] = true;
                            break;
                       }
                    }
                    if(j===m.length){
                        item.filters[this.filterId] = false;
                    }
                } else {
                    item.filters[this.filterId] = curDtId[m].selected;
                }
            }
        }
        item.updateSelected();
    }
};


kshf.BarChart.prototype.filter_removeItems = function(){
    var i, j, items=kshf.items, curDtId=this.getData_wID();
    for(i=0 ; i<items.length ; i++){
        var item = items[i];
        // update filter state
        var m=item.mappedData[this.filterId];
        if(m!==undefined && m!==null && m!==""){
            if(Array.isArray(m)){
                // all mappings should be false
                for(j=0;j<m.length;j++){
                   if(curDtId[m[j]].selected) { j=m.length; }
                }
                if(j===m.length){
                    item.filters[this.filterId] = false;
                }
            } else {
                item.filters[this.filterId] = curDtId[m].selected;
            }
        } else {
            item.filters[this.filterId] = false;
        }
        if(item.selected){
            item.updateSelected();
        }
    }
};

kshf.BarChart.prototype.filter_addItems = function(){
    var i,j;
    var items = kshf.items;
    var curDtId = this.getData_wID();
    var allRowsSelected = this.catCount_Selected===0;
    for(i=0 ; i<items.length ; i++){
        var item = items[i];
        if(allRowsSelected){
            item.filters[this.filterId] = true;
        } else {
            var m=item.mappedData[this.filterId];
            if(m!==undefined && m!==null && m!==""){
                if(Array.isArray(m)){
                    // if one of the mappings is true, then item is added
                    for(j=0;j<m.length;j++){
                       if(curDtId[m[j]].selected) {
                            item.filters[this.filterId] = true;
                            break;
                       }
                    }
                } else {
                    item.filters[this.filterId] = curDtId[m].selected;
                }
            }
        }
        if(!item.selected){
            item.updateSelected();
        }
    }
};

kshf.BarChart.prototype.noItemOnSelect = function(d){
    return d.selected!==false || this.catCount_Selected!==0 || d.activeItems!==0;
}

// When clicked on a row
kshf.BarChart.prototype.filterRow = function(d,forceAll){
    // if new selection would generate 0 items in result, don't change anything
	d.selected = !d.selected;
    if(this.options.singleSelect===true){
        if(d.selected===true){
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
        this.filter_removeItems();
    } else if(this.catCount_Selected===0){
        this.filter_addItems();
    } else {
        if(d.selected){
            this.filter_addItems();
        } else {
            this.filter_removeItems();
        }
    }
    if(this.options.sortingFuncs[this.sortID].no_resort!==true){
        this.root.select(".resort_button").style("display",
            (this.catCount_Selected===this.catCount_Total&&!this.showResortButton)?"none":"block");
    }
	kshf.update();
	this.refreshFilterSummaryBlock();
    if(this.dom.showTextSearch){
        this.dom.showTextSearch[0][0].value="";
    }
    this.refreshFilterRowState();

    return true;
};
kshf.BarChart.prototype.filterTime = function(){
    var i,j;
    var items = kshf.items;
    for(i=0 ; i<items.length ; i++){
        var item = items[i];
        var t = item.timePos;
        item.filters[this.filterId+1] = 
            (t>=this.timeFilter_ms.min) &&
            (t< this.timeFilter_ms.max);
        item.updateSelected();
    }
};

kshf.BarChart.prototype.refreshFilterSummaryBlock = function(){
	var kshf_=this;
    if(!this.isFiltered_Row()){
        if(this.filterSummaryBlock_Row){
            this.filterSummaryBlock_Row[0][0].parentNode.removeChild(this.filterSummaryBlock_Row[0][0]);
            this.filterSummaryBlock_Row = null;
        }
    } else {
        if(this.filterSummaryBlock_Row===null || this.filterSummaryBlock_Row===undefined){
            this.insertFilterSummaryBlock_Rows();
        }
        // go over all items and prepare the list
        var selectedItemsText="";
        var selectedItemsText_Sm="";
        var selectedItemsCount=0;
        this.root.selectAll("g.row").each( function(d){
            if(d.selected) {
                if(selectedItemsCount!==0) {
                    selectedItemsText+=" or ";
                    selectedItemsText_Sm+=", ";
                }
                var labelText = kshf_.options.catLabelText(d);
                var titleText = labelText;
                if(kshf_.options.catTooltipText){
                    titleText = kshf_.options.catTooltipText(d);
                }
                selectedItemsText+="<b>"+labelText+"</b>";
                selectedItemsText_Sm+=titleText;
                selectedItemsCount++;
            }
        });
        if(this.catCount_Selected>3){
            var bold=this.catCount_Selected;
            bold+=" "+(this.options.textGroup?this.options.textGroup:"categories");
            $(".filter_row_text_"+this.filterId+" .filter_item")
                .html("<b>"+bold+"</b>")
                .attr("title",selectedItemsText_Sm)
                ;
        } else {
            $(".filter_row_text_"+this.filterId+" .filter_item")
                .html(selectedItemsText)
                .attr("title",selectedItemsText_Sm)
                ;
        }
    }
};

kshf.BarChart.prototype.insertItemRows_shared = function(){
	var kshf_ = this;
	// create the clipping area
	this.root.select("g.barGroup_Top")
		.on("mousedown", function (d, i) { d3.event.preventDefault(); })
		.insert("svg:clipPath",":first-child")
		.attr("id","kshf_chart_clippath_"+this.id)
	  .append("svg:rect").attr("class","clippingRect")
		.attr("x",0)
		.attr("y",0)
		;
	var rows = this.root.selectAll("g.barGroup g.row")
		.on("click", function(d){ 
            log2Console("CLICK: select category",kshf_);
            if(!kshf_.noItemOnSelect(d)) return;
            kshf_.filterRow(d);
            if (this.timer) {
                log2Console("CLICK: select exact category",kshf_);
                clearTimeout(this.timer);
                this.timer = null;
                // clears all the selection when selected
                kshf_.selectAllRows(false);
                kshf_.filterRow(d,true);
                kshf_.sortDelay = 0;
                kshf_.updateSorting(true);
                return;
            }
            var x = this;
            this.timer = setTimeout(function() { 
                // if no item is selected, do not process click
//                if(d.activeItems===0) return;
//                clearTimeout(x.timer);
                x.timer = null;
/*                setTimeout(function(){
                    kshf_.sortDelay = 0; kshf_.updateSorting(true);
                    clearTimeout(x.timer);
                },2000);*/
            }, 500);
        })
        ;
    var rowsSub = rows.append("svg:g").attr("class","barRow")
		.on("mouseover", function(d){
            // if there are no active item, do not allow selection
//            if(e.activeItems===0) return;
            if(!kshf_.noItemOnSelect(d)) return;
            this.setAttribute("highlight",true);
        })
		.on("mouseout", function(d){ 
            this.setAttribute("highlight",false);
        })
        .attr("highlight","false")
        ;
    this.dom.row_title = rowsSub
        .append("svg:title")
        .attr("class", "row_title");
	this.dom.rowSelectBackground_Label = rowsSub // background 1
		.append("svg:rect")
		.attr("class", "rowSelectBackground rowSelectBackground_Label")
        .style("fill","url(#rowSelectBackground_Label"+this.id+")")
		.attr("x", 0)
		.attr("y", 0)
        .attr("height",kshf.line_height)
		;
	this.dom.rowSelectBackground_Count = rowsSub // background 2
		.append("svg:rect")
		.attr("class", "rowSelectBackground rowSelectBackground_Count")
        .style("fill","url(#rowSelectBackground_Count"+this.id+")")
        .attr("y", 0)
        .attr("width",this.getRowLabelOffset())
        .attr("height",kshf.line_height)
		;
    this.dom.rowSelectBackground_ClickArea = rowsSub // background 1
        .append("svg:rect")
        .attr("class", "rowSelectBackground_ClickArea")
        .attr("x", 0)
        .attr("y", 4)
        .attr("height",kshf.line_height-8)
        ;
	this.dom.item_count = rowsSub
		.append("svg:text")
		.attr("class", "item_count")
		.attr("dy", 13)
		;
	this.dom.cat_labels = rowsSub
		.append("svg:text")
		.attr("class", "row_label")
		.attr("dy", 14)
		.text(this.options.catLabelText);
	// Create helper line
	if(this.options.display.row_bar_line){
		this.dom.row_bar_line = rowsSub.append("svg:line")
			.attr("class", "row_bar_line")
			.attr("stroke-width","1")
			.attr("y1", kshf.line_height/2.0)
			.attr("y2", kshf.line_height/2.0);
	}
	this.dom.bar_active = rowsSub
		.append("svg:rect")
		.attr("class", function(d,i){ 
			return "rowBar " +(kshf_.options.barClassFunc?kshf_.options.barClassFunc(d,i):"")+" active";
		})
        .attr("x", this.options.rowTextWidth)
		.attr("rx",2).attr("ry",2); // skip mouse events to the underlying bigger bar
	this.dom.bar_total = rowsSub
		.append("svg:rect")
		.attr("class", function(d,i){ 
			return "rowBar "+(kshf_.options.barClassFunc?kshf_.options.barClassFunc(d,i):"")+" total";
		})
        .attr("x", this.options.rowTextWidth)
		.attr("rx",2).attr("ry",2)
		;
    this.dom.allRowBars = this.root.selectAll('g.barGroup g.row rect.rowBar');

    this.updateWidth();
};

kshf.BarChart.prototype.updateWidth = function(){
    kshf.time_animation_barscale = 400;

    var labelWidth = this.options.rowTextWidth-this.getRowLabelOffset();
    this.dom.cat_labels
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x", labelWidth);
    this.dom.cat_labels
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x", labelWidth);
    this.dom.rowSelectBackground_Label
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("width",labelWidth);
    this.dom.rowSelectBackground_Count
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x",labelWidth);
    this.dom.rowSelectBackground_ClickArea
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("width",this.options.rowTextWidth);
    this.dom.item_count
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x", labelWidth+3);
    this.xAxisScale = d3.scale.linear()
        .domain([0,this.getMaxSelectedItemsPerRow()])
        .rangeRound([0, this.barMaxWidth]);
    
    this.updateAllWidth();

    this.dom.allRowBars
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x", this.options.rowTextWidth);


    this.headerhtml.select("span.leftHeader")
        .transition()
        .duration(kshf.time_animation_barscale)
        .style("width",(this.options.rowTextWidth-this.getRowLabelOffset())+"px")
        ;

    this.root.select("g.x_axis")
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("transform","translate("+this.options.rowTextWidth+","+(kshf.line_height*(this.rowCount_Header()))+")")

    if(this.dom.showTextSearch !== undefined)
        this.dom.showTextSearch
            .style("width",(this.options.rowTextWidth-this.getRowLabelOffset()-20)+"px")

    if(this.dom.row_bar_line!==undefined)
        this.dom.row_bar_line
            .attr("x1", this.options.rowTextWidth+4);
    
    this.root.select("g.headerGroup text.barInfo")
        .attr("x", this.options.rowTextWidth)
        ;

}


kshf.BarChart.prototype.updateBarWidth = function(){
    var kshf_ = this;
    this.dom.bar_total
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("width", function(d){
            return Math.min(kshf_.xAxisScale(d.items.length),kshf_.barMaxWidth+7); 
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
    var justSortFunc = function(a,b){
        // call the sorting function
        var x=funcToCall(a,b);
        // use IDs if sorting function doesn't recide on ordering
        if(x===0) { x = b.id() - a.id(); }
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
		.attr("transform", function(d,i) { return "translate(0,"+((kshf.line_height*i))+")"; });
    
    if(this.type==='scatterplot'){
        this.refreshBarLineHelper();
    }
    this.root.select(".resort_button").style("display","none");
    this.sortDelay = 450;
};

kshf.BarChart.prototype.insertXAxisTicks = function(){
    var axisGroup = this.root.select("g.x_axis");

    var timeVal = this.barMaxWidth/25;

    var xAxis = d3.svg.axis()
        .tickSize(0, 0, 0)
		.orient('top')
		.ticks(timeVal) // TODO: make this configurable
		.tickFormat(d3.format("s"))
        .scale(this.xAxisScale);
	axisGroup.call(xAxis);
	
	axisGroup.selectAll("g.tick.major text").attr("dy","2");
	axisGroup.selectAll("g.tick line")
        .attr("y1","0")
        .attr("y2",kshf.line_height*this.rowCount_VisibleItem);
};
kshf.BarChart.prototype.removeXAxis = function(){
    this.root.select("g.x_axis").data([]).exit().remove();
};

kshf.BarChart.prototype.insertFilterSummaryBlock_Rows = function(){
	var kshf_=this;
	var a = d3.select("span.filter-blocks-for-charts");
	this.filterSummaryBlock_Row= a.append("html:span")
		.attr("class","filter-block filter_row_text_"+this.filterId)
		.text(" "+(this.options.textFilter?this.options.textFilter:this.options.facetTitle)+": ");
	this.filterSummaryBlock_Row.append("html:span")
		.attr("class","filter_item");
	this.filterSummaryBlock_Row.append("html:span")
		.attr("class","filter_reset")
		.attr("title","Clear filter")
		.text("x")
		.on("click",function(){ 
            log2Console("CLICK: clear category filter",kshf_);
            kshf_.clearRowFilter(); 
        });
};
kshf.BarChart.prototype.insertFilterSummaryBlock_Time = function(){
	var kshf_=this;
	var a = d3.select("span.filter-blocks-for-charts");
	this.filterSummaryBlock_Time= a.append("html:span").attr("class","filter-block filter_row_text_"+(this.filterId+1));
	this.filterSummaryBlock_Time.append("html:span").attr("class","filter_item");
	this.filterSummaryBlock_Time.append("html:span").attr("class","filter_reset")
		.attr("title","Clear filter")
		.text("x")
		.on("click",function(){ 
            log2Console("CLICK: clear time filter",kshf_);
            kshf_.clearTimeFilter(); 
        });
};

kshf.BarChart.prototype.refreshTimeChartBarDisplay = function(){
    // key dots are something else
    var kshf_ = this;
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
    
    for(r=0; r<rows.length; r++){
        var rowData=rows[r];
        if(rowData.sortDirty===true && this.type==="scatterplot"){
            rowData.items.sort(timeChartSortFunc);
            var g_row = this.root.selectAll("g.row");
            g_row.selectAll(".timeDot")
                .data(function(d) { return d.items; }, function(d){ return d.id(); })
                // calling order will make sure selected ones appear on top of unselected ones.
                .order()
                ;
            // TODO: call order only on this row
            // re-calculate min-max only on this row
            // etc...
        }/*
            .data(function(d) { return d.items; }, function(d){ return d.id(); })
            // calling order will make sure selected ones appear on top of unselected ones.
            .order()*/
    }

    this.dom.g_row.selectAll(".timeDot")
        .data(function(d) { return d.items; }, function(d){ return d.id(); })
        // calling order will make sure selected ones appear on top of unselected ones.
        .order()
        ;
    this.updateData_TimeMinMax();
    // update min-max extents
    this.dom.timeBarActive
        .transition()
        .duration(kshf.time_animation_barscale)
        .attr("x", function(d) {
            return kshf_.barMaxWidth+kshf.scrollWidth+kshf.sepWidth+kshf.scrollPadding+
                kshf_.options.rowTextWidth+kshf_.timeScale(d.xMin_Dyn===undefined?d.xMin:d.xMin_Dyn);
        })
        .attr("width", function (d) { 
            if(d.xMin_Dyn===undefined){ return 0; }
            return kshf_.timeScale(d.xMax_Dyn) - kshf_.timeScale(d.xMin_Dyn);
        })
        ;
    for(r=0; r<rows.length; r++){
        var rowData=rows[r];
        rowData.sortDirty=false;
    }
};

kshf.BarChart.prototype.insertTimeChartRows = function(){
	var kshf_ = this;

    var rows = this.root.selectAll("g.barGroup g.row");
    var rowsSub = this.root.selectAll("g.barGroup g.row g");
    rowsSub
        .append("svg:rect")
        .attr("class", "timeBar total")
        .attr("rx",2)
        .attr("ry",2)
        ;
    rowsSub
        .append("svg:rect")
        .attr("class", "timeBar active")
        .attr("rx",2)
        .attr("ry",2);
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
        })
        .on("mouseout",function(d,i){
            d.nohighlightAttributes();
        })
		.on("click", function(d,i,f) {
            log2Console("CLICK: time dot",kshf_);
            // clear all the selections
            kshf_.selectAllRows(false);

            var itemDate = d.timePos;
            var rangeMin = new Date(itemDate);
            var rangeMax = new Date(itemDate);

            if(kshf_.timeticks.range === d3.time.months){
                rangeMin.setUTCDate(rangeMin.getUTCDate()-15);
                rangeMax = new Date(rangeMin);
                rangeMax.setUTCMonth(rangeMin.getUTCMonth()+1);
            }
            if(kshf_.timeticks.range === d3.time.years){
                // if years range is wide, use 5-year step size
                var diff_Year =  kshf_.data_maxDate.getUTCFullYear() - kshf_.data_minDate.getUTCFullYear();
                if(kshf_.options.timeMaxWidth<diff_Year*10){
                    rangeMin.setUTCFullYear(rangeMin.getUTCFullYear()-5);
                    rangeMax.setUTCFullYear(rangeMax.getUTCFullYear()+5);
                } else {
                    rangeMin.setUTCMonth(rangeMin.getUTCMonth()-6);
                    rangeMax = new Date(rangeMin);
                    rangeMax.setUTCMonth(rangeMin.getUTCMonth()+12);
                }
            }

            kshf_.timeFilter_ms.min = Date.parse(rangeMin);
            kshf_.timeFilter_ms.max = Date.parse(rangeMax);
            kshf_.yearSetXPos();
            kshf_.filterTime();
            // kshf update is done by row-category click whcih is also auto-activated after dot click
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

    var utc_min = Date.parse(this.data_minDate);
    var utc_max = Date.parse(this.data_maxDate);

    var diff_Day = Math.ceil((utc_max - utc_min) / _MS_PER_DAY);
    var diff_Year =  this.data_maxDate.getUTCFullYear() - this.data_minDate.getUTCFullYear();
    var diff_Month = (this.data_maxDate.getUTCFullYear()*12+this.data_maxDate.getUTCMonth())-
                     (this.data_minDate.getUTCFullYear()*12+this.data_minDate.getUTCMonth());

    // this.options.timeMaxWidth is the width

    // choose range
    if(this.options.timeMaxWidth/70<=diff_Year/10){
        this.timeticks.range = d3.time.years;
        this.timeticks.format = d3.time.format("%Y");
        // Math.floor(diff_Year/this.timeticks.stepSize) <= this.options.timeMaxWidth/70
        this.timeticks.stepSize = Math.ceil(diff_Year/(this.options.timeMaxWidth/70));
    } else if(this.options.timeMaxWidth/70<=diff_Year){
        this.timeticks.range = d3.time.years;
        this.timeticks.format = d3.time.format("%Y");
        // Math.floor(diff_Year/this.timeticks.stepSize) <= this.options.timeMaxWidth/70
        this.timeticks.stepSize = Math.ceil(diff_Year/(this.options.timeMaxWidth/70));
    } else if(true){
        this.timeticks.range = d3.time.months;
        this.timeticks.format = d3.time.format("%b'%y");
        this.timeticks.stepSize = Math.ceil(diff_Month/(this.options.timeMaxWidth/70));
        // must be 1/2/3/4/60/12
        if(this.timeticks.stepSize>12) { this.timeticks.stepSize = 12;}
        else if(this.timeticks.stepSize>6){ this.timeticks.stepSize = 6;}
        else if(this.timeticks.stepSize>4) {this.timeticks.stepSize = 4;}
//        this.timeticks.stepSize = 4;
    }

    // update this.chartX_min_ms and this.chartX_max_ms
    var tempDate;
    if(this.timeticks.range===d3.time.years){
        this.chartX_min_ms = Date.parse(new Date(this.data_minDate.getUTCFullYear(),0));
        this.chartX_max_ms = Date.parse(new Date(this.data_maxDate.getUTCFullYear()+1,0));
//        var diffYear = (this.data_maxDate.getUTCFullYear()+1-this.data_minDate.getUTCFullYear())%this.timeticks.stepSize;
//        if(diffYear===0){ diffYear=this.timeticks.stepSize; }
//        tempDate = new Date(this.data_maxDate.getUTCFullYear()+1+(this.timeticks.stepSize-diffYear),0);
//        this.chartX_max_ms = Date.parse(new Date(tempDate.getUTCFullYear(),0));
    }    
    if(this.timeticks.range===d3.time.months){
        this.chartX_min_ms = Date.parse(new Date(this.data_minDate.getUTCFullYear(),(this.data_minDate.getUTCMonth())));
        this.chartX_max_ms = Date.parse(new Date(this.data_maxDate.getUTCFullYear(),(this.data_maxDate.getUTCMonth()+1)));
        // make sure the last ending month is step-size away from beginning
//        var startTime = this.data_minDate.getUTCFullYear()*12 + this.data_minDate.getUTCMonth();
//        var endTime = this.data_maxDate.getUTCFullYear()*12 + this.data_maxDate.getUTCMonth()+1;
//        var diffMonth = (endTime-startTime)%this.timeticks.stepSize;
//        if(diffMonth===0){ diffMonth=this.timeticks.stepSize; }
//        tempDate = new Date(this.data_maxDate.getUTCFullYear(), this.data_maxDate.getUTCMonth()+1+(this.timeticks.stepSize-diffMonth));
//        this.chartX_max_ms = Date.parse(new Date(tempDate.getUTCFullYear(),(tempDate.getUTCMonth())));
    }
    
    // reset filter state
    if(this.timeFilter_ms===undefined) {
        this.timeFilter_ms = {
            min: this.chartX_min_ms,
            max: this.chartX_max_ms
        };
    }

    // update the time scale with the new date domain
    this.timeScale = d3.time.scale.utc()
        .domain([new Date(this.chartX_min_ms), new Date(this.chartX_max_ms)])
        .rangeRound([0, this.options.timeMaxWidth-18])
        ;
};

kshf.BarChart.prototype.insertTimeTicks = function(){
    var axisGroup = this.root.select("g.timeAxisGroup g.tickGroup");
    axisGroup.attr("transform","translate(0,-1)")

    var numTicks = Math.floor(this.options.timeMaxWidth/70);

    var xAxis = d3.svg.axis()
        .scale(this.timeScale)
        .orient('top')
        .tickSize(8, 5, 2)
        .ticks(this.timeticks.range, this.timeticks.stepSize ) // d3.time.years, 2
        .tickFormat(this.timeticks.format ) // d3.time.format("%Y")
        .tickSubdivide(this.timeticks.stepSize-1)
        ;
    ;
    axisGroup.call(xAxis);

    axisGroup.selectAll(".tick.major text").style("text-anchor","middle");

};

kshf.BarChart.prototype.insertTimeChartAxis_1 = function(){
    var axisGroup = this.root.select("g.timeAxisGroup");
    var ggg = axisGroup.selectAll("g.sdsdsddsdd")
        .data([1])
        .enter()
        .append("svg:g").attr("class","sdsdsddsdd")
        ;
    ggg.append("svg:title").attr("class","xaxis_title");
    ggg.append("svg:rect")
        .attr("class", "selection_bar")
        .attr("y", -5.5)
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
        .attr("y",kshf.line_height*1.5-4)
        .on("click",function(){
            d3.event.stopPropagation();
        })
        .on("mousemove",function(){
            d3.event.stopPropagation();
        })
        ;

    var axisSubGroup=axisGroup.selectAll(".filter_handle");
    
    var axisSubSubGroup = axisSubGroup.append("svg:g");
    axisSubSubGroup.append("svg:title").attr("class","xaxis_title");
    axisSubSubGroup
        .append("svg:path")
        .attr("transform",function(d,i) { return "translate("+(i===0?"-3":"3")+",0)";})
        .attr("d", function(d,i) { 
            return (i===0)?"M0 6 L0 20 L12 13 Z":"M0 6 L0 20 L-12 13 Z";
        })
}
	
kshf.BarChart.prototype.insertTimeChartAxis = function(){
    var kshf_ = this;

    var axisGroup = this.root.select("g.timeAxisGroup");
    var msPerTick;
    switch(this.timeticks.range){
        case d3.time.years:
            msPerTick = 31557600000; break;
        case d3.time.months:
            msPerTick = 31557600000/12; break;
        default: break;
    }
    this.lengthPerTick = msPerTick*this.timeScale.range()[1]/
        (this.timeScale.domain()[1]-this.timeScale.domain()[0]);
	
	axisGroup.select("rect.selection_bar")
			.on("mousedown", function(d, i) {
                log2Console("CLICK: time selection bar",kshf_);
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
						if(timeFilter_ms.min<kshf_.timeScale.domain()[0].getTime()){
							timeFilter_ms.min=kshf_.timeScale.domain()[0].getTime();
						}
						timeFilter_ms.max=timeFilter_ms.min+(mousedown_filter.max-mousedown_filter.min);
					} else {
						timeFilter_ms.max = mousedown_filter.max+stepDif;
						if(timeFilter_ms.max>kshf_.timeScale.domain()[1].getTime()){
							timeFilter_ms.max=kshf_.timeScale.domain()[1].getTime();
						}
						timeFilter_ms.min=timeFilter_ms.max-(mousedown_filter.max-mousedown_filter.min);
					}
					// TODO: make sure you don't exceed the boundaries
					if(mousemove_filter.min!==timeFilter_ms.min){
						// update filter 
						kshf_.yearSetXPos();
                        kshf_.filterTime();
                        kshf_.sortSkip = true;
						kshf.update();
					}
				});
				kshf_.divRoot.on("mouseup", function(){
                    eeeeee.style.stroke= "";
                    kshf_.divRoot.style( 'cursor', 'default' );
                    kshf_.x_axis_active_filter = null;
                    // unregister mouse-move callbacks
                    kshf_.divRoot.on("mousemove", null);
                    kshf_.divRoot.on("mouseup", null);
				});
			});
	
	// Filter handles
	axisGroup.selectAll(".filter_handle g path")
		.on("mousedown", function(d, i) {
            log2Console("CLICK: time handle",kshf_);
            var eeeee = this;
			kshf_.x_axis_active_filter = (i===0)?'min':'max';
            this.style.stroke = 'orangered';
            kshf_.divRoot.style('cursor','pointer');
			var timeFilter_ms = kshf_.timeFilter_ms; // shorthand
			kshf_.divRoot.on("mousemove", function() {
				var mouseMove_x = d3.mouse(axisGroup[0][0])[0];

                // convert mouse position to date
                var time_ms = Math.floor(
                    kshf_.chartX_min_ms + (kshf_.chartX_max_ms-kshf_.chartX_min_ms)*(mouseMove_x / kshf_.timeScale.range()[1])
                    );

                var time_dt = new Date(time_ms);

                var time_ = null;
                if(kshf_.timeticks.range===d3.time.years){
                    if(time_dt.getUTCMonth()<7){
                        time_ = new Date(time_dt.getUTCFullYear(),0,0);
                    } else {
                        time_ = new Date(time_dt.getUTCFullYear()+1,0,0);
                    }
                } else if(kshf_.timeticks.range===d3.time.months){
                    if(time_dt.getUTCDate()<15){
                        time_ = new Date(time_dt.getUTCFullYear(),time_dt.getUTCMonth(),0);
                    } else {
                        time_ = new Date(time_dt.getUTCFullYear(),time_dt.getUTCMonth()+1,0);
                    }
                }

                // if it has the same value after mouse is moved, don't update any filter
                if(timeFilter_ms[kshf_.x_axis_active_filter] === time_.getTime()) return;
                timeFilter_ms[kshf_.x_axis_active_filter] = time_.getTime();
                
                if(timeFilter_ms.max<timeFilter_ms.min){
                    eeeee.style.stroke = "";
                    kshf_.x_axis_active_filter = (kshf_.x_axis_active_filter==='min'?'max':'min');
                    //swap
                    var tttt= timeFilter_ms.max;
                    timeFilter_ms.max = timeFilter_ms.min;
                    timeFilter_ms.min = tttt;
                }

                // make sure filters do not exceed domain range
                timeFilter_ms.min = Math.max(timeFilter_ms.min,kshf_.timeScale.domain()[0].getTime());
                timeFilter_ms.max = Math.min(timeFilter_ms.max,kshf_.timeScale.domain()[1].getTime());

                // make sure min-max order is preserved, and they are not closer than some limit to each other.
/*                if(kshf_.x_axis_active_filter==='min'){
                    timeFilter_ms.min=Math.min(timeFilter_ms.min,timeFilter_ms.max-msPerTick);
                } else if(kshf_.x_axis_active_filter==='max'){
                    timeFilter_ms.max=Math.max(timeFilter_ms.max,timeFilter_ms.min+msPerTick);
                }*/

                // update filter 
                kshf_.yearSetXPos();
                kshf_.filterTime();
                kshf_.sortSkip = true;
                if(kshf_.options.sortingFuncs[kshf_.sortID].no_resort!==true)
                    kshf_.root.select(".resort_button").style("display","block");
                kshf.update();
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
			});
            
		});
	
    this.yearSetXPos();
};

kshf.BarChart.prototype.updateTimeChartBarsDots = function(){
    var totalLeftWidth = this.barMaxWidth+kshf.scrollPadding+kshf.scrollWidth+kshf.sepWidth+this.options.rowTextWidth;
	var kshf_ = this;
    this.dom.timeBarTotal
        .attr("x",     function(d){ return totalLeftWidth+kshf_.timeScale(d.xMin); })
        .attr("width", function(d){ return kshf_.timeScale(d.xMax) - kshf_.timeScale(d.xMin); })
        ;
	// Update bar dot positions
	this.dom.timeDots
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
	var minX = this.timeScale(this.timeFilter_ms.min);
	var maxX = this.timeScale(this.timeFilter_ms.max);
	
	this.root.selectAll("g.filter_min")
		.attr("transform", function(d) { return "translate(" + minX + ","+(-15)+")"; });
	this.root.selectAll("g.filter_max")
		.attr("transform", function(d) { return "translate(" + maxX + ","+(-15)+")"; });
	this.root.selectAll("rect.selection_bar")
		.attr("x", minX)
		.attr("width", (maxX - minX));
	this.root.select("g.filter_min .filter_nonselected")
		.attr("x", -minX)
		.attr("width", minX);
	this.root.select("g.filter_max .filter_nonselected")
		.attr("x", 0)
		.attr("width", this.timeScale.range()[1] -maxX);
    this.root.select("g.filter_min")
        .attr("filtered",this.timeFilter_ms.min!==this.chartX_min_ms);
    this.root.select("g.filter_max")
        .attr("filtered",this.timeFilter_ms.max!==this.chartX_max_ms);
    this.refreshTimeChartFilterText();
    this.refreshTimeChartTooltip();
};

kshf.BarChart.prototype.refreshTimeChartFilterText = function(){
    this.divRoot.attr("filtered_time",this.isFiltered_Time()?"true":"false");
    if(this.isFiltered_Time()){
        if(this.filterSummaryBlock_Time===null || this.filterSummaryBlock_Time===undefined){
            this.insertFilterSummaryBlock_Time();
        }
        $(".filter_row_text_"+(this.filterId+1)+" .filter_item")
            .html("from <b>"+this.getFilterMinDateText()+"</b> to <b>"+this.getFilterMaxDateText()+"</b>")
        ;
    } else if(this.filterSummaryBlock_Time){
        this.filterSummaryBlock_Time[0][0].parentNode.removeChild(this.filterSummaryBlock_Time[0][0]);
        this.filterSummaryBlock_Time = null;
    }
};
kshf.BarChart.prototype.refreshTimeChartTooltip = function(){
	var kshf_ = this;
    var titleText = kshf.itemsSelectedCt+ " selected "+kshf.itemName+"from "+
                this.getFilterMinDateText()+" to "+this.getFilterMaxDateText();
	this.root.selectAll("title.xaxis_title")
		.text(titleText);
};


// ***********************************************************************************************************
// WHIZ RANGE CHART
// ***********************************************************************************************************

kshf.RangeChart = function(options){
    kshf.Chart.call(this,options);
    this.type = 'RangeChart';
    this.filterCount = 1;

    this.root = this.options.layout
        .append("div")
        .attr("class","kshfChart RangeChart")
        .attr("filtered","false")
        ;

    // set filter to true by default
    var dt = kshf.items;
    for(i=0;i<dt.length;i++){
        var item = dt[i];
        // assume all filters pass
        for(j=0,f=this.filterId;j<this.filterCount;j++,f++){
            item.filters[f] = true;
        }
    }

    this.insertHeader();
    this.insertRangeSlider();

    this.updateSelfLayout();
}
// Setup the prototype chain the right way
kshf.extendClass(kshf.Chart, kshf.RangeChart);

kshf.RangeChart.prototype.insertHeader = function(){
    var kshf_ = this;
    var headerGroup = this.root.append("div").attr("class","headerGroup")
        .on("mouseclick", function (d, i) { 
            d3.event.preventDefault(); 
        });

    headerGroup.append("xhtml:div").attr("class","chartAboveSeparator");

    var leftBlock = headerGroup.append("span").attr("class","leftHeader")
        .style("width",(this.options.rowTextWidth-this.getRowLabelOffset())+"px")
        ;

    leftBlock.append("span")
        .attr("class", "header_label")
        .style("float","right")
        .text(this.options.facetTitle)
        .on("click",function(){ if(kshf_.collapsed) { kshf_.collapseCategories(false); } })
        ;
    leftBlock.append("xhtml:span").attr("class","header_label_arrow header_label_down")
        .attr("title","Show categories").text("▼")
        .on("click",function(){ kshf_.collapseCategories(false); })
        ;
    leftBlock.append("xhtml:span").attr("class","header_label_arrow header_label_up"  )
        .attr("title","Hide categories").text("▲")
        .on("click",function(){ kshf_.collapseCategories(true); })
        ;
    leftBlock.append("xhtml:div")
        .attr("class","chartClearFilterButton rangeFilter")
        .attr("title","Clear filter")
        .on("click", function(d,i){ kshf_.clearRangeFilter(); })
        .text('x');
}

kshf.convertToReadable = function(num){
    if(num>1000000000){ return Math.floor(num/1000000000)+"B";}
    if(num>1000000){ return Math.floor(num/1000000)+"M";}
    if(num>1000   ){ return Math.floor(num/1000   )+"K";}
    return Math.floor(num);
}

kshf.RangeChart.prototype.insertRangeSlider = function(){
    var kshf_ = this;
    this.sliderDiv = this.root.append("div")
        .attr("class","sliderGroup")
        .style("width","90%")
//        .style("padding-top","54px")
        ;
    // find min and max of filter value
    this.data_min = d3.min(kshf.items, this.options.catItemMap);
    this.data_max = d3.max(kshf.items, this.options.catItemMap);

    // create a sorted array of data items
    this.sortedData = kshf.items.slice(0);

    this.sortedData.sort(function(a,b){
        var v_a = kshf_.options.catItemMap(a);
        var v_b = kshf_.options.catItemMap(b);

        if(v_a!==v_b) { return v_a-v_b;}
        return a.id() - b.id();
    });

    this.sortedData_Filtered = { min:0 , max: this.sortedData.length-1};

    var sliderStep = Math.floor((this.data_max-this.data_min)/10);

    this.sliderUI = $(this.sliderDiv.append("div")[0][0]).rangeSlider({
        bounds:{min: this.data_min, max: this.data_max},
        defaultValues:{min: this.data_min, max: this.data_max},
        arrows:false,
//        step: sliderStep,
        formatter: kshf.convertToReadable,
        scales: [
    // Primary scale
            {
                first: function(val){ return val; },
                next: function(val) { return val + sliderStep; },
                stop: function(val) { return false; },
                label: function(val){ return kshf.convertToReadable(val); }
/*                format: function(tickContainer, tickStart, tickEnd){ 
                    tickContainer.addClass("myCustomClass");
                } */
            }
        ]
//        valueLabels:"change",
//        delayOut: 4000
    })
    .bind("valuesChanging", function(e, data) {
        var sdf_min = kshf_.sortedData_Filtered.min;
        var sdf_max = kshf_.sortedData_Filtered.max;

        if(kshf_.sliderRange.min>data.values.min) {
            // more data is selected on the lower bounds
            while(true){
                sdf_min--;
                if(sdf_min<0) { sdf_min = 0; break; }
                // run filter
                var item = kshf_.sortedData[sdf_min];
                var itemV=kshf_.options.catItemMap(item);
                var selected = itemV>=data.values.min;
                item.filters[kshf_.filterId] = selected;
                item.updateSelected();
                if(!selected){ sdf_min++; break; }
            }
        } else if(kshf_.sliderRange.min<data.values.min) {
            // less data is selected on the lower bounds
            while(true){
                if(sdf_min>sdf_max) { sdf_min = sdf_max; break; }
                // run filter
                var item = kshf_.sortedData[sdf_min];
                var itemV=kshf_.options.catItemMap(item);
                var selected = itemV>=data.values.min;
                item.filters[kshf_.filterId] = selected;
                item.updateSelected();
                if(selected){ break; }
                sdf_min++;
            }
        } else if(kshf_.sliderRange.max<data.values.max) {
            // more data is selected on the upper bounds
            var maxVal = kshf_.sortedData.length-1;
            while(true){
                sdf_max++;
                if(sdf_max>maxVal) { sdf_max = maxVal; break; }
                // run filter
                var item = kshf_.sortedData[sdf_max];
                var itemV=kshf_.options.catItemMap(item);
                var selected = itemV<=data.values.max;
                item.filters[kshf_.filterId] = selected;
                item.updateSelected();
                if(!selected){ sdf_max--; break; }
            }
        } else if(kshf_.sliderRange.max>data.values.max) {
            // less data is selected on the lower bounds
            while(true){
                if(sdf_max<sdf_min) { sdf_max = sdf_min; break; }
                // run filter
                var item = kshf_.sortedData[sdf_max];
                var itemV=kshf_.options.catItemMap(item);
                var selected = itemV<=data.values.max;
                item.filters[kshf_.filterId] = selected;
                item.updateSelected();
                if(selected){ break; }
                sdf_max--;
            }
        }
        if(sdf_min !== kshf_.sortedData_Filtered.min ||
           sdf_max !== kshf_.sortedData_Filtered.max){
            kshf.update();
            kshf_.sortedData_Filtered.min = sdf_min;
            kshf_.sortedData_Filtered.max = sdf_max;
        }
    
        // cache the current value
        kshf_.sliderRange = {
            min: data.values.min,
            max: data.values.max
        };

        $(".filter_row_text_"+kshf_.filterId+" .filter_item")
            .html("<b>" + kshf.convertToReadable(kshf_.sliderRange.min) + 
                  "</b> to <b>" + kshf.convertToReadable(kshf_.sliderRange.max) + "</b>")
            ;

        kshf_.root.attr("filtered_range",kshf_.isFiltered_range());
        $(".filter_row_text_"+kshf_.filterId).attr("filtered",kshf_.isFiltered_range());
    });
 
    // if parent is hidden before, you need to call this manually to show range slider
    this.sliderUI.rangeSlider('resize');

    this.sliderRange = {
        min: this.data_min,
        max: this.data_max
    };
}


kshf.RangeChart.prototype.getHeight_Rows = function(){
    if(this.collapsed) return 1;
    return 3;
}

kshf.RangeChart.prototype.insertFilterSummaryBlock = function(){
    var kshf_=this;
    var a = d3.select("span.filter-blocks-for-charts");
    var s= a.append("html:span")
        .attr("class","filter-block filter_row_text_"+this.filterId)
        .attr("filtered","false")
        .text(this.options.facetTitle+" between ");
    s.append("html:span")
        .attr("class","filter_item");
//    if(this.options.filterText.unit){
//        s.append("html:span").text(" "+this.options.filterText.unit);
//    }
    s.append("html:span")
        .attr("class","filter_reset")
        .attr("title","Clear filter")
        .text("x")
        .on("click",function(){ kshf_.clearRangeFilter(); });
}
kshf.RangeChart.prototype.updateSelf = function(){
}
kshf.RangeChart.prototype.getFilteredCount = function(){
    return 0;
}

kshf.RangeChart.prototype.setWidth = function(w){
    this.root.style("width",w+"px");
}


kshf.RangeChart.prototype.collapseCategories = function(hide){
    this.collapsed = hide;

    this.sliderDiv.style("display",hide?"none":"block");
    this.updateSelfLayout();
    kshf.updateLayout();
}

kshf.RangeChart.prototype.updateSelfLayout = function(){
    this.root.attr("collapsed",(this.collapsed?"true":"false"));
    
    var chartHeight = kshf.line_height*this.getHeight_Rows();

    this.root.style("height",(chartHeight)+"px");
}

kshf.RangeChart.prototype.clearAllFilters = function(){
    this.clearRangeFilter();
}

kshf.RangeChart.prototype.isFiltered_range = function(){
    return this.sliderRange.min !== this.data_min || this.sliderRange.max !== this.data_max;
}

kshf.RangeChart.prototype.clearRangeFilter = function(){
    this.sliderRange = {
        min: this.data_min,
        max: this.data_max
    };

    this.sliderUI.rangeSlider('min',this.sliderRange.min);
    this.sliderUI.rangeSlider('max',this.sliderRange.max);
    this.root.attr("filtered_range",this.isFiltered_range());
    $(".filter_row_text_"+this.filterId).attr("filtered",this.isFiltered_range());

    this.sortedData_Filtered = { min:0 , max: this.sortedData.length-1};

    // set filter to true by default
    var dt = kshf.items;
//    kshf.filter_all=0;
    for(i=0;i<dt.length;i++){
        var item = dt[i];
        // assume all filters pass
        for(j=0,f=this.filterId;j<this.filterCount;j++,f++){
            item.filters[f] = true;
        }
//        kshf.itemsSelectedCt+=
        item.updateSelected();
    }

    kshf.update();
}


