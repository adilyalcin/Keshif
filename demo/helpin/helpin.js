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

var measureLabelModeInfo = function(){
  var _p = "percent (%) of the active records";
  var _a = "absolute (#) value"
  var mode       = this.browser.percentModeActive?_p:_a;
  var mode_other = this.browser.percentModeActive?_a:_p;
  var _total  = this.browser.allRecordsAggr.recCnt.Active;
  var _active = Math.round(_total*0.35); // fixed percentage. A good mid-range. Works just fine.
  var _filtered = this.browser.isFiltered()?" currently filtered ":"";
  return ""+
    "<p>Measurements are currently labeled as <span class='bolder'>"+mode+"</span>. "+
    "The alternative is labeling as <span class='bolder'>"+mode_other+"</span>.<p>"+
    "<p>Example: <span class='bolder'>"+_active+"</span> "+this.browser.recordName+" can be labeled as "+
      "<span class='bolder'>"+Math.round(100*_active/_total)+"%"+"</span>"+
        " of the <span class='bolder'>"+_total+"</span> "+_filtered+this.browser.recordName+".</p>"+
    "<p>All summaries share the same measure-label mode.</p>"+
    "<p>Percent values cannot be shown when average metric is used.</p>"+
    "";
}

var visualScaleModeInfo = function(){ 
  var _p = "part-of (%) active records";
  var _a = "absolute"
  var mode       = this.browser.percentModeActive?_p:_a;
  var mode_other = this.browser.percentModeActive?_a:_p;
  return ""+
    "<p>Measurements are visually scaled as <span class='bolder'>"+mode+"</span> value. "+
    "The alternative is <span class='bolder'>"+mode_other+"</span>.<p>"+
    "<p>Part-of scale reveals distribution information on "+
      "<span class='bolder'>highlight</span> and <span class='bolder'>lock</span> selections.</p>"+
    "<p>All summaries share the same visual scale mode.</p>"+
    "";
    ; 
}

var percentileInfo = "<p>Each bin shows a percentile range, such as 20%-30%. "+
  "Smaller ranges appear towards the middle and have darker color. "+
  "The median (%50) is shown as ❙.</p>"+
  "<p>Point to a percentile bin for more information.</p>"+
  "<p>Note: Measure-metric, measure-label, and visual scale modes <i>do not</i> affect this chart.</p>";

var measureMetricInfo = function(){
  var alternative = "";
  switch(this.browser.measureFunc){
    case 'Count': alternative = "<span class='bolder'>sum</span> or <span class='bolder'>average</span> of a numeric attribute"; break;
    case 'Sum':   alternative = "<span class='bolder'>count</span> of records, or <span class='bolder'>average</span> of a numeric attribute"; break;
    case 'Avg':   alternative = "<span class='bolder'>count</span> of records, or <span class='bolder'>sum</span> of a numeric attribute"; break;
  }
  var pof = this.browser.getMeasureFuncTypeText();
  if(pof==="") pof = "Count";
  // TODO: respons to filtering state
  return ""+
    "<p>The current measure-metric is <span class='bolder'>"+pof+" of "+this.browser.recordName+"</span>.</p>"+
    "<p>Other options are "+alternative+", such as "+this.browser.getMeasurableSummaries()[0].summaryName+".</p>"+
    "<p>All summaries (charts) show the same metric.</p>"+
    "";
}

var pickSelectedAggr = function(){
  var midP = this.records.length*0.5;
  var minV = midP*0.8, maxV = midP*1.2;
  var curMax = this.records;
  var hAggr;
  this.allAggregates.some(function(aggr){
    if(aggr.DOM.aggrGlyph===undefined) return false;
    if(aggr.compared) return false; // lock-compare selection
    if(aggr.summary && aggr.summary.collapsed) return false;
    // TODO: skip global aggregate, etc etc.
    // Only keep ones that are categories or interval bins
    if(aggr.records.length > minV && aggr.records.length < maxV){
      hAggr = aggr;
      return true;
    } else {
      var curDist = Math.abs(aggr.records.length-midP)
      if(curMax > curDist ){
        hAggr = aggr;
        curMax = curDist;
      }
    }
    return false;
  });
  return hAggr;
};

var pickExplainAggr = function(sT){
  var hAggr = null;
  var curMax = 1;
  this.allAggregates.some(function(aggr){
    if(aggr.DOM.aggrGlyph===undefined) return false;
    if(aggr.summary && aggr.summary.collapsed) return false;
    var _mActive = aggr._measure.Active;
    if(_mActive==0) return false; // no active records. do not describe
    // TODO: skip global aggregate, etc etc.
    // Only keep ones that are categories or interval bins
    var curDist = aggr._measure[sT] / aggr._measure.Active;
    if(curDist > 0.4 && aggr.records.length < 0.6){
      hAggr = aggr;
      return true;
    } else {
      if(curMax > Math.abs(curDist-0.5) ){
        hAggr = aggr;
        curMax = Math.abs(curDist-0.5);
      }
    }
    return false;
  });
  return hAggr;
}

var intervalSummaryInfoFunc = function(DOM){
  var summary = DOM.__data__;
  var summaryName = summary.summaryName;
  var recordName = summary.browser.recordName;
  var _min = summary.printWithUnitName(summary.intervalRange.org.min);
  var _max = summary.printWithUnitName(summary.intervalRange.org.max);
  var _scale = (summary.scaleType==='log') ? (
    "<p>The range groups for this summary are created on a <span class='bolder'>log-scale</span> "+
    "to reveal distribution of potentially skewed data.</p>") : "";

  var _measure;
  switch(this.browser.measureFunc){
    case 'Count': _measure = ""; break;
    default: _measure = this.browser.getMeasureFuncTypeText();
  }
  _measure = _measure.replace(" of ","").replace(" of","");

  var encoding = "<p><i class='fa fa-bar-chart'></i> "+
    "The chart shows the distribution of ";
  if(this.browser.ratioModeActive) encoding+= "selected percentage of ";
  encoding += "<span class='bolder'>"+(_measure===""?"Count":_measure)+"</span> of "+recordName;
  if(this.browser.ratioModeActive) encoding+= " among all "+recordName;
  encoding += " per each range bin.</p>";

  return ""+
    "<p>This summarizes the <span class='bolder'>"+summaryName+"</span> of "+recordName+".</p>"+
    "<p>The "+summaryName+" ranges from "+
    "<span class='bolder'>"+_min+"</span> to "+
    "<span class='bolder'>"+_max+"</span>.</p>"+
    encoding+_scale;
};

var printBreadcrumb = function(sType, summary, aggr){
  return "<span class='breadCrumb crumbMode_"+sType+"' ready='true'>"+
    "<span class='breadCrumbIcon fa'></span>"+
    "<span class='crumbText'>"+
      "<span class='bolder'>"+summary.summaryName+"</span>: "+
      summary.printAggrSelection(aggr)+"</span></span>";
}

var aggrDescription = function(aggr, encodingIcon){
  var summary = aggr.summary;

  var recordName = this.browser.recordName;
  var aggrLabel = "<span class='bolder'>"+summary.printAggrSelection(aggr)+"</span>";
  var globalActive = browser.allRecordsAggr._measure.Active;

  var _measure;
  switch(this.browser.measureFunc){
    case 'Count': _measure = ""; break;
    default: _measure = this.browser.getMeasureFuncTypeText();
  }
  _measure = _measure.replace(" of ","").replace(" of","");

  var str='';

  var _temp = this.browser.percentModeActive;

  if(this.browser.ratioModeActive && this.browser.percentModeActive){
    this.browser.percentModeActive = false;
  }

  var measureLabel = "<span class='bolder'>"+this.browser.getMeasureLabel(aggr,summary)+"</span>";
  if(this.browser.percentModeActive){
    // Percent labels
    str+="<p>"+measureLabel+"</span> of "+_measure;
    if(_measure!=="") str+=" in ";
    if(this.browser.isFiltered()) str+=globalActive+" filtered ";
    str+=recordName+" are in "+aggrLabel+" "+summary.summaryName+".</p>";
  } else {
    // Absolute labels
    str+="<p>There are "+measureLabel+" "+_measure;
    if(_measure!=="") str+=" in ";
    str+=recordName+" with ";
    str+=" "+aggrLabel+" "+summary.summaryName;
    if(this.browser.isFiltered()) str+=", among the "+globalActive+" filtered";
    str+=".</p>";
  }

  this.browser.percentModeActive = _temp;

  var encoding = "<p><i class='colorCoding fa "+encodingIcon+"'></i> "+
    "Block size shows the ";
  if(this.browser.ratioModeActive) encoding+= "selected percentage of ";
  encoding += "<span class='bolder'>"+(_measure===""?"Count":_measure)+"</span> of "+recordName;
  if(this.browser.ratioModeActive) encoding+= " among all "+recordName;
  encoding += " with "+ aggrLabel+" "+summary.summaryName+".";
  encoding += "</p>";

  _measure = _measure.trim();
  if(_measure!=="") _measure = " "+_measure;

  function addEncoding(sType,sWord){
    this.browser.measureLabelType = sType;
    encoding+="<div class='encodingInfo'><span class='colorCoding_"+sType+" fa "+encodingIcon+"'></span> "
      +" "+sWord+recordName+" : "+this.browser.getMeasureLabel(aggr,summary)+_measure+"</div>";
  };
  if(!this.browser.ratioModeActive){
    // Total and filtered only apply when part-of mode is not active.
    addEncoding.call(this,"Active",""+(this.browser.isFiltered()?"Filtered ":"All "));
    if(this.browser.isFiltered()){
      addEncoding.call(this,"Total","All ");
    }
  }
  addEncoding.call(this,"Highlight","Highlighted ");
  if(this.browser.selectedAggr.Compare_A){
    var compAggr = this.browser.selectedAggr["Compare_A"];
    addEncoding.call(this, "Compare_A", printBreadcrumb("Compare_A",compAggr.summary,compAggr));
  }
  if(this.browser.selectedAggr.Compare_B){
    var compAggr = this.browser.selectedAggr["Compare_B"];
    addEncoding.call(this, "Compare_B", printBreadcrumb("Compare_B",compAggr.summary,compAggr));
  }
  if(this.browser.selectedAggr.Compare_C){
    var compAggr = this.browser.selectedAggr["Compare_C"];
    addEncoding.call(this, "Compare_C", printBreadcrumb("Compare_C",compAggr.summary,compAggr));
  }
  encoding+="</p>";

  this.browser.measureLabelType = null;

  return str+encoding;
}



var _material = {
  _contextFeatures: {
    True: {
      descr: "Always true",
      v: function(){ return true; },
      weight: 0
    },
    SummaryInBrowser: {
      descr: "Browser includes at least one summary.",
      v: { summaries: function(summary){ return summary.inBrowser(); } },
      weight: 10,
      fixBy: 'T_AddSummary',
    },
    CollapsedSummary: {
      descr: "Summary is collapsed.",
      v: { summaries: function(summary){ return summary.collapsed; } },
      weight: 15,
      fixBy: 'T_CollapseSummary',
      multiplier: 1.2
    },
    OpenSummary: {
      descr: "Summary is open.",
      v: { summaries: function(summary){ return !summary.collapsed; } },
      weight: 9,
      fixBy: 'T_OpenSummary',
    },
    CategoricalSummary: {
      descr: "Summary attribute is categorical.",
      v: { summaries: function(summary){ return summary.type==="categorical"; } },
      weight: 20,
      multiplier: 1.2
    },
    CategoricalMultiValSummary: {
      descr: "Summary attribute has multiple categorical values.",
      v: { summaries: function(summary){ return summary.type==="categorical" && summary.isMultiValued; } },
      weight: 40
    },
    IntervalSummary: {
      descr: "Summary is interval (numeric or time).",
      v: { summaries: function(summary){ return summary.type==="interval"; } },
      weight: 25
    },
    NumberSummary: {
      descr: "Summary attribute is numeric.",
      v: { summaries: function(summary){ return summary.type==="interval" && summary.scaleType!=="time"; } },
      weight: 30
    },
    PositiveNumberSummary: {
      descr: "Numeric summary has only positive values (minimum>0).",
      v: { summaries: function(summary){ 
        return summary.type==="interval" && summary.scaleType!=="time" && summary.intervalRange.org.min>0;
      } },
      weight: 30
    },
    TimeSummary: {
      descr: "The summary attribute shows time.",
      v: { summaries: function(summary){ return summary.type==="interval" && summary.scaleType==="time"; } },
      weight: 33
    },
    CategoricalMapSummary: {
      descr: "Summary includes map regions per category.",
      v: { summaries: function(summary){ return summary.catMap; } },
      weight: 40
    },
    CategoricalMapVieweight: {
      descr: "Summary is viewed as a categorical map.",
      v: { summaries: function(summary){ return summary.viewAs==='map'; } },
      weight: 45
    },
    MultiValuedSummary: {
      descr: "Categorical summary includes multiple values per record.",
      v: { summaries: function(summary){ return summary.isMultiValued; } },
      weight: 40
    },
    FilteredSummary: {
      descr: "Summary is filtered.",
      v: { summaries: function(summary){ return summary.isFiltered(); } },
      weight: 50,
      fixBy: 'T_SelectFilter',
    },
    CategoricalSummaryWithTextSearch: {
      descr: "Summary includes more than 20 categories.",
      v: { summaries: function(summary){ return summary.showTextSearch; } },
      weight: 30
    },
    SummaryWithMissingValues: {
      descr: "Summary has at least one invalid/missing record value.",
      v: { summaries: function(summary){ return summary.missingValueAggr.records.length>0; } },
      weight: 47
    },
    ExpandableSummary: {
      descr: "Summary includes more categories than currently visible.",
      v: { summaries: function(summary){ return !summary.areAllCatsInDisplay(); } },
      weight: 20
    },
    SortableSummary: {
      descr: "Summary has more than 20 categories.",
      v: { summaries: function(summary){ return summary.configRowCount>0 && !summary.catSortBy_Active.no_resort; } },
      weight: 22
    },
    SummaryWithDescription: {
      descr: "Summary has a description.",
      v: { summaries: function(summary){ return summary.description !== undefined; } },
      weight: 4
    },
    SummaryOpenConfig: {
      descr: "Summary configuration is open.",
      v: { summaries: function(summary){ return summary.DOM.root.attr("showConfig")==="true"; } },
      weight: 50,
      fixBy: 'T_ConfigSummary' // show summary
    },

    NotAverageMeasure: {
      descr: "Measure-metric is not average.",
      v: function(){ return this.browser.measureFunc!=="Avg"; },
      weight: 10,
      fixBy: 'T_ChangeMetric', // change aggregate measure-metric
    },
    ActiveCompareSelection: {
      descr: "There is an active <i class='fa fa-lock'></i> lock-selection.",
      v: function(){
        if(this.browser.selectedAggr.Compare_A) return true;
        if(this.browser.selectedAggr.Compare_B) return true;
        if(this.browser.selectedAggr.Compare_C) return true;
        return false;
      },
      weight: 55,
      fixBy: 'T_SelectCompare', // Lock-select to compare
    },

    RecordDisplay: {
      descr: "Browser includes record panel.",
      v: function(){ return this.recordDisplay.recordViewSummary !== null; },
      weight: 30,
      fixBy: 'T_AddRecordPanel', // Add record panel
    },
    RecordTextSearch: {
      descr: "There needs to be an active record text search summary.",
      v: function(){ return this.recordDisplay.textSearchSummary !== null; },
      weight: 35
    },
    RecordsWithDetailToggle: {
      descr: "Record panel has detail toggle enabled.",
      v: function(){ return this.recordDisplay.detailsToggle !== "off"; },
      weight: 25
    },
    RecordDisplayAsMap: {
      descr: "Records need to have a geographical region.",
      v: function(){ return this.recordDisplay.config.geo; },
      weight: 55
    },
    RecordDisplayAsNetwork: {
      descr: "Records need to have a linking attribute.",
      v: function(){ return this.recordDisplay.config.linkBy.length>0; },
      weight: 55
    },
    RecordDisplayAsList: {
      descr: "Record panel shows records as a list.",
      v: function(){
        var x = this.recordDisplay.displayType;
        return x==='list' || x==="grid";
      },
      weight: 15
    },

    AnyFiltered: {
      descr: "Data needs to be filtered.",
      v: function(){ return this.browser.isFiltered(); },
      weight: 40
    },

    AuthoringMode: {
      descr: "Authoring mode is enabled.",
      v: function(){ return this.browser.authoringMode; },
      weight: 10,
      fixBy: 'T_EnableAuth',
    },
    LoggedIn : {
      descr: "You need to be logged in.",
      v: function(){ return kshf.gistLogin; },
      weight: 44,
      fixBy: 48, // login...
    }
  },

  _components: {
    "Summary" : { 
      matches: '.kshfSummary'
    },
    "Number Summary" : {
      matches: '.kshfSummary[summary_type="interval"][viewtype="bar"][collapsed="false"]', 
      info: intervalSummaryInfoFunc,
      pos: "s"
    },
    "Time Summary" : {
      matches: '.kshfSummary[summary_type="interval"][viewtype="line"][collapsed="false"]', 
      info: intervalSummaryInfoFunc,
      pos: "s"
    },
    "Categorical Summary": {
      matches: '.kshfSummary[summary_type="categorical"][collapsed="false"]', 
      info: function(DOM){
        var summary = DOM.__data__;
        var recordName = this.browser.recordName;

        var _measure;
        switch(this.browser.measureFunc){
          case 'Count': _measure = ""; break;
          default: _measure = this.browser.getMeasureFuncTypeText();
        }
        _measure = _measure.replace(" of ","").replace(" of","");

        var encoding = "<p><i class='fa fa-bar-chart fa-histogram-flip'></i> "+
          "The chart shows the distribution of ";
        if(this.browser.ratioModeActive) encoding+= "selected percentage of ";
        encoding += "<span class='bolder'>"+(_measure===""?"Count":_measure)+"</span> of "+recordName;
        if(this.browser.ratioModeActive) encoding+= " among all "+recordName;
        encoding += " per each category.</p>";

        return ""+
          "<p>This summarizes the <span class='bolder'>"+summary.summaryName+"</span> of "+summary.browser.recordName+".</p>"+
          "<p>It includes <span class='bolder'>"+summary._aggrs.length+"</span> categories.</p>"+
          encoding;
      },
      pos: "s"
    },
    "Set Summary": {
      matches: '.kshfSummary.setPairSummary', 
      info: function(DOM){
        return "Shows intersections and stuff."
      }    
    },
    "Record": {
      matches: '.kshfRecord', 
      info: function(DOM){ 
        var r = DOM.__data__;
        var summary = this.browser.recordDisplay.sortingOpt_Active;
        var sortingSummaryName = summary.summaryName;
        var v = summary.getRecordValue(r);
        // TODO: if the record is highlighted (color), show why it is highlighted.
        var intro   = "<p>This is a single record among "+this.browser.recordName+".</p>";
        var ranking = "<p>It is ranked at <span class='bolder'>#"+(r.recordRank+1)+"</span> with its "+
          "<span class='bolder'>"+sortingSummaryName+"</span>: "+this.browser.recordDisplay.getSortingLabel(r)+".</p>";
        var encoding = "";
        if(r.selectCompared_str){
          encoding = "<p>";
          encoding+= "The background color shows this record appears in selection ";
          r.selectCompared_str.replace(" ","").split('').forEach(function(_char){
            var comparedAggr = this.browser.selectedAggr["Compare_"+_char];
            encoding += printBreadcrumb("Compare_"+_char,comparedAggr.summary,comparedAggr);
          });
          encoding +="<p>";
        }
        return intro+ranking+encoding;
      },
      onLock: function(DOM){
        var record = DOM.__data__;
        record.highlightRecord();

        // categories
        this.context.HighlightedDOM = this.browser.DOM.root.selectAll('[cSelection="onRecord"] > .catLabelGroup')[0];
        this.fHighlightBox("All categorical values of<br> this record are highlighted","s");

        // numbers / time
        this.context.HighlightedDOM = browser.DOM.root.selectAll(".recordValueText-v")[0];
        this.fHighlightBox("All numerical/temporal values of<br> this record are highlighted","s");

        this.createStencils();
      },
      onUnlock: function(DOM){
        var record = DOM.__data__;
        record.unhighlightRecord();
      }
    },
    "Summary Name": { 
      matches: '.summaryName_text'
    },
    "Percentile Chart Config": {
      matches: ".summaryConfig_Percentile",
      info: function(DOM){
        return "TODO: Describe percentile chart";
      }
    },
    "Bin Scale Type": {
      matches: ".summaryConfig_ScaleType"
    },
    "Aggregate": {
      matches: '.kshfSummary[collapsed="false"] .aggrGlyph'
    },
    "Category": { 
      matches: '.kshfSummary[collapsed="false"] .catGlyph', 
      pos:"se",
      info: function(DOM){
        return aggrDescription.call(this,DOM.__data__, "fa-long-arrow-right");
      },
    },
    "Bin": { 
      matches: '.kshfSummary[collapsed="false"] .rangeGlyph', 
      pos: "e",
      info: function(DOM){
        return aggrDescription.call(this,DOM.__data__, "fa-long-arrow-up");
      }
    },
    "Percentile Chart": {
      matches: '.percentileGroup', 
      pos: "s",
      info: function(DOM){
        var summary = DOM.__data__;
        var summaryName = "<span class='bolder'>"+summary.summaryName+"</span>";
        var recordName = this.browser.recordName;
        return ""+
          "<p>This chart shows the distribution of "+
            summaryName+" of "+recordName+" using percentiles.</p>"+
          percentileInfo;
      },
    },
    "Percentile Range": { 
      matches: '.kshfSummary[collapsed="false"] .aggrGlyph.quantile', 
      pos: "e",
      info: function(DOM){
        var recordName = this.browser.recordName;
        var perct_num = DOM.__data__;
        var summary = DOM.__data__.summary;
        var summaryName = summary.summaryName;
        var sType = DOM.parentNode.className.substr(16); // "Active", "Highlight", "Compare_A", etc...
        var minV = summary.quantile_val[sType+perct_num[0]];
        var maxV = summary.quantile_val[sType+perct_num[1]];

        var numRecords = 0;
        summary.filteredRecords.forEach(function(record){ 
          var v = summary.getRecordValue(record);
          if(v>=minV && v<=maxV) numRecords++;
        });

        minV = "<span class='bolder'>"+summary.printWithUnitName(minV)+"</span>";
        maxV = "<span class='bolder'>"+summary.printWithUnitName(maxV)+"</span>"

        var str = '';
        str+="<p>Among "+this.browser.allRecordsAggr._measure.Active+" ";
        str+=this.browser.isFiltered()?"filtered ":"all ";
        var sType = DOM.parentNode.className.substr(16); // "Active", "Highlight", "Compare_A", etc...
        if(sType==="Compare_A" || sType==="Compare_B" || sType==="Compare_C"){
          var comparedAggr = this.browser.selectedAggr[sType];
          str += printBreadcrumb(sType,comparedAggr.summary,comparedAggr);
          //str+= // Select Compare_A aggregate, etc
        }
        str+=recordName+": </p>";

        str+="<p><span class='bolder'>"+perct_num[0]+"%</span> have "+summaryName+" < " + minV+" , and <br>";
        str+="<span class='bolder'>"+perct_num[1]+"%</span> have "+summaryName+" < " + maxV+".</p>";
        str+="<p>This bin aggregates the <span class='bolder'>10%</span> ("+numRecords+") "+recordName+" in between.</p>";
        return str;
      }
    },
    "Median": { 
      matches: ".quantile.q_pos.q_50",
      pos: "w",
    },
    "Record Text Search": { 
      matches: ".recordTextSearch"
    },
    "Measure-Label Mode": { 
      matches: '.measurePercentControl', 
      info: measureLabelModeInfo},
    "Missing Records": { 
      matches: '.missingValueAggr', 
      info: function(DOM){
        return "<i class='fa fa-ban'></i> shows the records with missing values in the summary."
      },
      pos: "w"
    },
    "Help Button": { 
      matches: '.showHelpIn',
      info: function(DOM){
        return "<p>Click <i class='fa fa-question-circle'></i> to get help for exploring data with Keshif.</p>"+
          "<p>"+
            "<i class='fa fa-hand-pointer-o'></i> <span class='bolder'>Point &amp; Learn</span> informs about the region you point.<br>"+
            "<i class='fa fa-book'></i> <span class='bolder'>Topic Listing</span> lets you see and filter all help topics.<br>"+
            "<i class='fa fa-location-arrow'></i> <span class='bolder'>Guided Tour</span> presents help information step-by-step.<br>"+
            "<i class='fa fa-bell'></i> <span class='bolder'>Notifications</span> suggests help based on your actions.<br>"+
          "</p>"
      }
    },
    "Global Measurement": { 
      matches: ".recordInfo",
      pos: "nw",
      info: function(DOM){
        var measureLabel = "<span class='bolder'>"+this.browser.getGlobalActiveMeasure()+"</span>";
        var measureFunc  = this.browser.getMeasureFuncTypeText().replace(" of ","");
        var str = '';
        str+="<p>This section shows the global measurement, "+
          "reflecting any selected filtering and measure-metric.</p>";
        if(measureFunc===''){
          str += "There are "+"<span class='bolder'>"+measureLabel+"</span> "+measureFunc;
          str +=" "+this.browser.recordName+" in the";
          if(this.browser.isFiltered()) str += " <i>filtered</i> ";
          str += " dataset.";
          return str;
        }
        str += this.browser.recordName+" have ";
        str += measureLabel+" "+"<span class='bolder'>"+measureFunc+"</span> in the";
        if(this.browser.isFiltered()) str += " <i>filtered</i> ";
        str += " dataset.";
        return str;
      }
    },
    "Measure-Metric": { 
      matches: ".measureFuncSelect",
      pos: "nw",
      info: function(){
        return "<p>The <span class='bolder'>measure-metric</span> is set by clicking here.<p>"+measureMetricInfo();
      },

    },
    "Global Summary": { 
      matches: '.totalGlyph',
      info: function(){
        return "<p>The bars in this section visualize the measurements for the complete datasets along "+
          "<i class='fa fa-long-arrow-right'></i>.</p>";
      }
    },
    "Visual Scale Mode": { 
      matches: '.scaleModeControl', 
      info: visualScaleModeInfo
    },
    "Record Panel": { 
      matches: '.recordDisplay', 
      pos: "sw",
      info: function(DOM){ 
        var summary = this.browser.recordDisplay.sortingOpt_Active;
        return ""+
          "<p>This panel displays each record individually.</p>"+
          "<p>Records are currently sorted by <span class='bolder'>"+summary.summaryName+"</span>.</p>"+
          "<p>You can sort record by any number or time summary in the browser.</p>"; 
      }
    },
    "Breadcrumbs": { 
      matches: '.breadcrumbs', 
      info: function(DOM){ 
        var totalSel = this.browser.DOM.breadcrumbs.selectAll(".breadCrumb")[0].length;
        var filterSel = this.browser.DOM.breadcrumbs.selectAll(".crumbMode_Filter")[0].length;
        var compareSel = this.browser.DOM.breadcrumbs.selectAll('[class*="crumbMode_Compare_"]')[0].length;
        if(filterSel===0) filterSel = "none";
        if(compareSel===0) compareSel = "none";
        return ""+
        "<p>This section shows the active selections.<br> Selection type is coded by color and icons. </p>"+
        "<p>"+
          "<i class='helpin-breadcrumb fa fa-filter'></i> = Filtered "+
            "<span style='font-weight:100')>(currently "+filterSel+")</span><br>"+
          "<i class='helpin-breadcrumb fa fa-mouse-pointer'></i> = Highlighted "+
            "<span style='font-weight:100')>(currently none)</span><br>"+
          "<i class='helpin-breadcrumb fa fa-lock'></i> = Compared "+
            "<span style='font-weight:100')>(currently "+compareSel+")</span><br>"+
        "</p>"
        ; 
      },
    },
    "Breadcrumb": {
      matches: '.breadcrumbs > .breadCrumb',
      info: function(DOM){ 
        var x;
        switch(DOM.classList[1]){
          case "crumbMode_Compare_A": x="<i class='fa fa-lock'></i> compare"; break;
          case "crumbMode_Compare_B": x="<i class='fa fa-lock'></i> compare"; break;
          case "crumbMode_Compare_C": x="<i class='fa fa-lock'></i> compare"; break;
          case "crumbMode_Filter":    x="<i class='fa fa-filter'></i> filter";  break;
          default: x = "<i class='fa fa-mouse-pointer'></i> highlight"; break;
        };
        return "<p>This breadcrumb shows an active "+x+" selection.</p>";
      }
    },
    //{ matches: '.buttonSummaryCollapse', component: "Summary" },
    "Sort Records By...": { 
      matches: '.useForRecordDisplay',
      pos: "ne"
    },
    "Summary Description": { 
      matches: '.summaryDescription',
      pos: "ne"
    },
    "Authoring Mode": { 
      matches: '.authorButton' 
    },
    "Clear Filtering": { 
      matches: '.filterClearAll' 
    },
    "Unit Name": { 
      matches: '.unitName' 
    },
    "Reverse Record Sorting": { 
      matches: '.recordSortButton' 
    },
    "Filter range limit": { 
      matches: '.controlLine > .rangeHandle' 
    },
    "Record Sorting":{ 
      matches: '.listSortOptionSelect'
    },
    "Data Source": { 
      matches: '.datasource'
    },
    "Record Details": { 
      matches: '.recordToggleDetail'
    },
    "Measure-Label": { 
      matches: '.measureLabel'
    },
    "Total Measure": { 
      matches: '.measure_Total'
    },
    "Active Measure": { 
      matches: '.measure_Active'
    },
    "Highlighted Measure": { 
      matches: '.measure_Highlight'
    },
    "Compared Measure": { 
      matches: '[class^="measure_Compare_"]'
    },
    "Lock Button": { 
      matches: '.lockButton'
    },
    "Lock-Selection": {
      matches: '.breadcrumbs > [class*="crumbMode_Compare_"]'
    },
    "Filter Selection": { 
      matches: '.breadcrumbs > .crumbMode_Filter'
    },
    "Save Filter Selection": { 
      matches: '.saveSelection'
    },
    "Fullscreen Button": { 
      matches: '.viewFullscreen',
    },
    "Clear-Filter Button": {
      matches: '.clearFilterButton'
    }

      // { matches: '.panel',  component: "Summary Panel" }, // Adds too big of a highlighted area. Messes up with some text.

  /*  { matches: '.panel',
      component: "Panel" },
    { matces: '.panel_Wrapper',
      component: "Data Browser"}*/
  },

  _guideSteps: [
    { component: 'Record' },
    { component: 'Categorical Summary' },
    { component: 'Category' },
    { component: 'Time Summary' },
    { component: 'Number Summary' },
    { component: 'Bin' },
    { topic:     'T_SelectHighlight' },
    { topic:     'T_SelectFilter' },
    { topic:     'T_SelectCompare' },        
    { component: 'Global Measurement' },
    { component: 'Measure-Metric' },
    { component: 'Breadcrumbs' },
    { topic:     'T_ChangeVisualScale' },
    { topic:     'T_ChangeMeasureLabel' },
    { topic:     'T_RecSortChange' },
    { topic:     'T_ExploreMissingVal' },
    { component: 'Help Button' },
  ],

_topics: {
  T_SelectHighlight: {
    q: function(){
      return "<i class='helpin-breadcrumb fa fa-mouse-pointer'></i> Highlight-select to preview "+this.browser.recordName+"";
    },
    actions: "Explore+Select",
    topics: "Aggregate",
    context: ["SummaryInBrowser", "OpenSummary"],
    note: function(){
      return ""+
      "<p>You can highligh record aggregates as categories, number/time ranges, or invalid values. "+
        "One aggregate is highlight-selected as an example. </p>"+
      "<p>"+printBreadcrumb("Highlight",this.context.highlightedSummary, this.context.highlightedAggregate)
        +"breadcrumb on the top section shows the highlight-selection.</p>"+
      "<p>All <span class='bolder'>"+this.browser.allRecordsAggr._measure.Highlight+"</span> "
        +" records in this highlight-selection are shown in <span style='color: orangered; font-weight: 500;'>orange</span>.</p>"+
      "<p>You can observe distribution of highlighted records in all other summaries, as well as individual records.</p>"+
      "";
    },
    similarTopics: ['T_SelectFilter','T_SelectCompare'],
    tAnswer: "<i class='fa fa-mouse-pointer'></i> Mouse-over an aggregate",
    activate: function(){
      var me=this;

      var hAggr = pickSelectedAggr.call(this.browser);
      this.context.highlightedAggregate = hAggr;
      this.context.highlightedSummary = hAggr.summary;
      
      // ********************************************************************************
      // Highlight the selected aggregate
      // ********************************************************************************
      this.context.HighlightedDOM = [this.context.highlightedAggregate.DOM.aggrGlyph];
      this.fHighlightBox("<i class='fa fa-mouse-pointer'></i> Mouse-over an aggregate","n","tipsy-primary2");
      this.context.highlightedSummary.onAggrHighlight(hAggr);

      setTimeout(function(){
        // ********************************************************************************
        // Show the other (explain) aggregate
        // ********************************************************************************
        var _aggr = pickExplainAggr.call(this.browser,'Highlight');
        me.context.HighlightedDOM = [_aggr.DOM.aggrGlyph];
        // TODO: make the tooltip context dependent. - visual scale, measure metric, label
        me.fHighlightBox(
          "Selected records are shown in orange<br>in all aggregates.<br>"+
          "Here, there are "+_aggr._measure.Highlight+" highlighted records."
          ,"n");

        // ********************************************************************************
        // Show highlighted records
        // ********************************************************************************
        me.context.HighlightedDOM = [];
        var minY = me.browser.recordDisplay.DOM.recordGroup[0][0].scrollTop;
        var maxY = minY + me.browser.recordDisplay.DOM.recordGroup[0][0].offsetHeight;
        me.browser.selectedAggr.Highlight.records.some(function(record){
          if(!record.isWanted) return false;
          var DOM = record.DOM.record;
          if( DOM.offsetTop < minY) return false;
          if( DOM.offsetTop+DOM.offsetHeight > maxY) return false;
          this.context.HighlightedDOM.push(record.DOM.record);
          return true;
        },me);
        me.fHighlightBox(
          "The records within the selection<br>"+
          printBreadcrumb("Highlight",me.context.highlightedSummary, me.context.highlightedAggregate)+
          " are also highlighted.","n");

        // ********************************************************************************
        // Show breadcrumb
        // ********************************************************************************
        me.context.HighlightedDOM = [ me.browser.crumb_Highlight.DOM[0][0] ];
        me.fHighlightBox("This breadcrumb describes<br> the highlight-selection.","n");

        me.createStencils();
        me.repositionHelpMenu();
      },1000);
    },
    deactivate: function(){
      this.context.highlightedSummary.onAggrLeave(this.context.highlightedAggregate);
      this.context.highlightedSummary   = undefined;
      this.context.highlightedAggregate = undefined;
    },
  },
  T_SelectFilter: {
    q: function(){
      return "<i class='helpin-breadcrumb fa fa-filter'></i> Filter-select to focus on selected "+this.browser.recordName;
    },
    actions: "Explore+Filter+Select",
    topics: "Aggregate",
    context: "SummaryInBrowser",
    similarTopics: ['T_SelectHighlight','T_SelectCompare','T_FilterAnd'],
    note: function(){
      return "<p>Use filtering sparingly to explore"+this.browser.recordName+" using multiple summaries.</p>"+
      "<p>Filtering on multiple summaries is merged with  <span class='AndOrNot_And'>And</span>.</p>"
    },
    tAnswer: {
      sequence: [
        "<i class='fa fa-mouse-pointer'></i> Mouse-over an aggregate",
        "Click on the (highlighted) aggregate"
      ]
    },
    activate: function(){
      var me=this;

      var hAggr = pickSelectedAggr.call(this.browser);
      this.context.highlightedAggregate = hAggr;
      this.context.highlightedSummary = hAggr.summary;
      
      // ********************************************************************************
      // Highlight the selected aggregate
      // ********************************************************************************
      this.context.HighlightedDOM = [this.context.highlightedAggregate.DOM.aggrGlyph];
      this.fHighlightBox("<i class='fa fa-mouse-pointer'></i> Mouse-over an aggregate","n","tipsy-primary2");
      this.context.highlightedSummary.onAggrHighlight(hAggr);

      setTimeout(function(){
        me.context.HighlightedDOM = [ me.context.highlightedAggregate.DOM.aggrGlyph ];
        me.fHighlightBox("Click on the highlighted aggregate","s","tipsy-primary2");
      },1200);
    },
    deactivate: function(){
      this.context.highlightedSummary.onAggrLeave(this.context.highlightedAggregate);
    },
  },
  T_SelectCompare: {
    q: function(){
      return "<i class='helpin-breadcrumb fa fa-lock'></i> Lock-select to compare groups of "+this.browser.recordName; 
    },
    actions: "Explore+Compare+Select",
    topics: "Aggregate",
    context: "SummaryInBrowser",
    similarTopics: ['T_SelectFilter','T_UnlockSelection'],
    note: 
      "<p>By moving the mouse, you can compare <br>"+
        "<span class='bolder'>locked</span> and <span class='bolder'>highlighted</span> selections.</p>"+
      "<p>At most <span class='bolder'>3</span> locked selections are possible: "+
        "<span class='colorCoding_Compare_A fa fa-lock'></span> "+
        "<span class='colorCoding_Compare_B fa fa-lock'></span> "+
        "<span class='colorCoding_Compare_C fa fa-lock'></span><br>"+
      "Each locked selection has a different color.</p>"+
      "<p>Changing filtering will clear locked selections.</p>",
    tAnswer: {
      sequence: [
        "<i class='fa fa-mouse-pointer'></i> Mouse-over an aggregate",
        "<i class='fa fa-lock'></i> Click the lock icon <br> Or<br> Shift+Click"
      ]
    },
    activate: function(){
      var me=this;

      var hAggr = pickSelectedAggr.call(this.browser);
      this.context.highlightedAggregate = hAggr;
      this.context.highlightedSummary = hAggr.summary;
      
      // ********************************************************************************
      // Highlight the selected aggregate
      // ********************************************************************************
      this.context.HighlightedDOM = [this.context.highlightedAggregate.DOM.aggrGlyph];
      this.fHighlightBox("<i class='fa fa-mouse-pointer'></i> Mouse-over an aggregate","n","tipsy-primary2");
      this.context.highlightedSummary.onAggrHighlight(hAggr);

      var cT;
      setTimeout(function(){
        me.context.HighlightedDOM = [
          d3.select(me.context.highlightedAggregate.DOM.aggrGlyph).select(".lockButton")[0][0]];
        me.fHighlightBox("<i class='fa fa-lock'></i> Click the lock icon <br> Or<br> Shift+Click on the aggregate","s","tipsy-primary2");
        cT = me.browser.setSelect_Compare(true);
        me.context.fakeCompare = cT;
      },1200);

      setTimeout(function(){
        me.context.highlightedSummary.onAggrLeave(me.context.highlightedAggregate);
      },2000);

      setTimeout(function(){
        // ********************************************************************************
        // Show the other (explain) aggregate
        // ********************************************************************************
        me.context.HighlightedDOM = [pickExplainAggr.call(this.browser,'Compare_'+cT).DOM.aggrGlyph];
        // TODO: make the tooltip context dependent. - visual scale, measure metric, label
        me.fHighlightBox(
          me.browser.allRecordsAggr._measure['Compare_'+cT]+
          " locked records are shown<br>in all other aggregations","n");

        // ********************************************************************************
        // Show highlighted records
        // ********************************************************************************
        me.context.HighlightedDOM = [];
        var minY = me.browser.recordDisplay.DOM.recordGroup[0][0].scrollTop;
        var maxY = minY + me.browser.recordDisplay.DOM.recordGroup[0][0].offsetHeight;
        me.browser.selectedAggr['Compare_'+cT].records.some(function(record){
          if(!record.selectCompared[cT]) return false;
          var DOM = record.DOM.record;
          if( DOM.offsetTop < minY) return false;
          if( DOM.offsetTop+DOM.offsetHeight > maxY) return false;
          this.context.HighlightedDOM.push(record.DOM.record);
          return true;
        },me);
        me.fHighlightBox(
          "The records within the locked selection<br>"+
          printBreadcrumb("Compare_"+cT,me.context.highlightedSummary, me.context.highlightedAggregate)+
          " change their color.","n");

        // ********************************************************************************
        // Show breadcrumb
        // ********************************************************************************
        me.context.HighlightedDOM = [ me.browser['crumb_Compare_'+cT].DOM[0][0] ];
        me.fHighlightBox("This breadcrumb describes<br> the locked-selection.","n");

        me.createStencils();
        me.repositionHelpMenu();
      },3300);
    },
    deactivate: function(){
      this.browser.clearSelect_Compare(this.context.fakeCompare);
    },
  },
  T_UnlockSelection: {
    q: "Unlock a locked selection <i class='fa fa-lock'></i>",
    actions: "Explore+Select",
    topics: "Aggregate+Compared Measure+Compare Selection",
    context: ["SummaryInBrowser", "ActiveCompareSelection"],
    note: "Filtering also unlocks (removes) all compared selections.",
    similarTopics: ['T_SelectCompare'],
    tAnswer: [
      { matches: '[class*="crumbMode_Compare_"]',
        cElement: "browser",
        text: "Click <i class='fa fa-lock'></i> breadcrumb",
        pos: "n" },
      { matches: '.aggrGlyph[compare="true"] .lockButton',
        cElement: "browser",
        text: "Click <i class='fa fa-lock'></i>",
        pos: "n" }
    ]
  },
  T_FilterAnd: {
    q: "Filter categories in a summary using <span class='AndOrNot_And'>And</span>",
    actions: "Explore+Filter+Select",
    topics: "Categorical Summary",
    context: ["SummaryInBrowser", "CategoricalSummary", "OpenSummary", 
      "CategoricalMultiValSummary", "FilteredSummary"],
    note: "<p>And-selection is possible <i>only if</i> records have multiple categorical values.</p>"+
      "<p>Only categories which have some records can be clicked to avoid zero-results.</p>",
    similarTopics: ['T_SelectFilter','T_RemoveCatFilter'],
    tAnswer: {
      matches: '.kshfSummary[isMultiValued="true"][filtered] .catGlyph:not([NoActiveRecords])',
      cElement: "summaries",
      text: "Click on a non-empty category",
      pos: "n",
      filter: function(){
        this.context.HighlightedDOM = this.context.HighlightedDOM.slice(0,1);
      }
    }
  },
  T_FilterOr: {
    q: "Filter categories in a summary using <span class='AndOrNot_Or'>Or</span>",
    actions: "Explore+Filter+Select",
    topics: "Categorical Summary",
    context: ["SummaryInBrowser", "CategoricalSummary", "OpenSummary", "FilteredSummary"],
    note: "<p>Or-selection is possible if at least onecategory has been filtered.</p>",
    similarTopics: ['T_SelectFilter','T_RemoveCatFilter'],
    tAnswer: {
      matches: '.catGlyph:not([cfiltered])',
      cElement: "summaries",
      text: "Mouse-over a category<br>and click <span class='AndOrNot_Or'>Or</span>",
      pos: "n",
      filter: function(){
        // take only one
        this.context.HighlightedDOM = this.context.HighlightedDOM.slice(0,1);
      },
      activate: function(){ this.context.HighlightedDOM[0].setAttribute("mouseOver",true); },
      deactivate: function(){ this.context.HighlightedDOM[0].removeAttribute("mouseOver"); },
    }
  },
  T_FilterNot: {
    q: "Filter-out a category with <span class='AndOrNot_Not'>Not</span>",
    actions: "Explore+Filter+Select",
    topics: "Categorical Summary",
    context: ["SummaryInBrowser", "CategoricalSummary", "OpenSummary"],
    similarTopics: ['T_SelectFilter','T_RemoveCatFilter'],
    tAnswer: {
      sequence: [
        "<i class='fa fa-mouse-pointer'></i> Mouse-over an aggregate",
        "Click on <span class='AndOrNot_Not'>Not</span>"
      ]
    },
    activate: function(){ 
      var me = this;
      var hAggr = pickSelectedAggr.call(this.browser);
      this.context.highlightedAggregate = hAggr;
      this.context.highlightedSummary = hAggr.summary;
      
      // ********************************************************************************
      // Highlight the selected aggregate
      // ********************************************************************************
      this.context.HighlightedDOM = [this.context.highlightedAggregate.DOM.aggrGlyph];
      this.fHighlightBox("<i class='fa fa-mouse-pointer'></i> Mouse-over an aggregate","n","tipsy-primary2");
      this.context.highlightedSummary.onAggrHighlight(hAggr);

      setTimeout(function(){
        me.context.HighlightedDOM = [
          d3.select(me.context.highlightedAggregate.DOM.aggrGlyph).select(".AndOrNot_Not")[0][0]];
        me.fHighlightBox("Click on <span class='AndOrNot_Not'>Not</span>","s","tipsy-primary2");
        me.context.highlightedSummary.onCatEnter_NOT(me.context.highlightedAggregate);
      },1200);

      this.context.HighlightedDOM[0].setAttribute("mouseOver",true);
    },
    deactivate: function(){ 
      this.context.highlightedSummary.onCatLeave_NOT(this.context.highlightedAggregate);
      this.context.highlightedAggregate.DOM.aggrGlyph.removeAttribute("mouseOver");
      this.context.highlightedSummary.onAggrLeave(this.context.highlightedAggregate);
    },
  },
  T_AdjustFilterRange: {
    q: "Adjust filtered range selection",
    actions: "Explore+Select",
    topics: "Time Summary+Number Summary",
    context: ["SummaryInBrowser", "IntervalSummary", "FilteredSummary"],
    similarTopics: ['T_ZoomInOutRange'],
    tAnswer: [
      { class: "activeBaseRange", 
        cElement: "summaries", 
        text: "Click & drag the range<br> to move it forward/backward", 
        pos: "n" },
      { class: "rangeHandle", 
        cElement: "summaries", 
        text: "Click & drag the end-points<br> to adjust the limits",
        pos: "s" }
    ]
  },
  T_SaveFiltering: {
    q: function(){
      return "Save filtered "+this.browser.recordName+
        " <i class='helpin-breadcrumb fa fa-filter'></i> as a new aggregate";
    },
    actions: "Explore+Save+Filter",
    topics: "Filter Selection",
    context: ["SummaryInBrowser", "FilteredSummary"],
    note: "<p>Saved selections will be added to Saved Selections summary as new category.</p>"+
      "<p>Save the filtering to revisit the same selections later, and to create richer selection queries, such as "+
        "to define multiple ranges on numeric intervals, or to mix differen summaries with OR selection in between.</p>",
    tAnswer: {
      class: "saveSelection",
      cElement: "browser",
      text: "Click <i class='fa fa-floppy-o'></i>"
    }
  },
  T_CategoryTextSearch: {
    q: "Search and filter categories by text",
    actions: "Explore+Select",
    text: "Categorical Summary",
    context: ["SummaryInBrowser", "CategoricalSummary", "CategoricalSummaryWithTextSearch"],
    note: "The categories that match will be used to filter records.",
    similarTopics: ['T_RecordTextSearch'],
    tAnswer: {
      class: "catTextSearch",
      cElement: "summaries",
      text: "Type your search in<br> category text search box."
    }
  },
  T_RecordTextSearch: {
    q: function(){ return "Select "+this.browser.recordName+" by text search";},
    actions: "Explore+Select",
    topics: "Record Panel+Record Text Search+Record",
    context: ["RecordDisplay", "RecordTextSearch"],
    note: "If you type multiple words, you can specify if <b>all</b> or <b>some</b> words need to match in a record.",
    similarTopics: ['T_CategoryTextSearch'],
    tAnswer: {
      class: "recordTextSearch",
      cElement: "recordDisplay",
      text: "<b>Type your record text search here.</b><br><br>"+
        "As you type, matching records will be highlighted.<br><br>"+
        "<b>Enter</b> to filter records.<br>"+
        "<b>Shift+Enter</b> to lock records for comparison.", 
      pos: "n"
    }
  },
  T_ExploreMissingVal: {
    q: function(){ return "Explore "+this.browser.recordName+" with missing/invalid values"; },
    actions: "Explore+Select",
    topics: "Aggregate",
    context: ["SummaryInBrowser", "OpenSummary", "SummaryWithMissingValues"],
    note: "<i class='fa fa-ban'></i> appears only when some records have missing/invalid values in related summary.<br>"+
      "Darker icon color means more records.",
    tAnswer: {
      class: "missingValueAggr",
      cElement: "summaries",
      text: "Use <i class='fa fa-ban'></i><br>"+
        "<i class='fa fa-mouse-pointer'></i> <b>Mouse-over</b> to highlight<br>"+
        "<i class='fa fa-filter'></i> <b>Click</b> to filter<br>"+
        "<i class='fa fa-lock'></i> <b>Shift+click</b> to compare"
    }
  },
  T_ChangeMeasureLabel: {
    q: function(){
      var text = this.browser.percentModeActive?"absolute (#)":"percent (%)";
      return "View measure-labels as <b>"+text+"</b> values";
    },
    actions: "Explore+View",
    topics: "Measurement+Measure-Label",
    context: ["SummaryInBrowser", "NotAverageMeasure", "OpenSummary"],
    note: measureLabelModeInfo,
    similarTopics: ['T_ChangeMetric', 'T_ChangeVisualScale'],
    tAnswer: {
      class: "measurePercentControl",
      cElement: "summaries",
      text: function(){ 
        return "Click <i class='fa fa-"+(this.browser.percentModeActive?"percent":"hashtag")+"'></i>";
      }
    }
  },
  T_ChangeMetric: {
    q: "Measure by <b>Count</b>, <b>Sum</b>, or <b>Average</b> metric",
    actions: "Explore",
    topics: "Measurement+Measure-Metric",
    context: ["SummaryInBrowser", "NumberSummary"],
    similarTopics: ['T_ChangeMeasureLabel', 'T_ChangeVisualScale'],
    note: measureMetricInfo,
    tAnswer: {
      sequence: [
      {
        class: "measureFuncSelect", 
        cElement: "browser",
        text: "Click <i class='fa fa-cubes'></i>",
        pos: "nw"
      },
      {
        matches: ".measureFunctionType", 
        cElement: "browser",
        text: "Choose a metrics:<br> Count, Sum, Average",
        pos: "w"
      }
      ]
    }
  },
  T_ChangeVisualScale: {
    q: function(){ 
      return "Visually scale measurements as <b>"+(this.browser.ratioModeActive?"absolute":"part-of-active")+"</b>";
    },
    actions: "Explore+View",
    topics: "Measurement+Visual Scale Mode",
    context: ["SummaryInBrowser","OpenSummary"],
    note: visualScaleModeInfo,
    similarTopics: ['T_ChangeMeasureLabel', 'T_ChangeMetric'],
    tAnswer: {
      class: "scaleModeControl",
      cElement: "summaries",
      text: "Click axis of<br> measurement",
      pos: "e"
    },
    activate: function(){
      this.browser.showScaleModeControls(true);
    },
    deactivate: function(){
      this.browser.showScaleModeControls(false);
    }
  },
  T_CatViewAs: {
    q: "View categories as map or list",
    actions: "Explore+View",
    topics: "Categorical Summary+Map",
    context: ["SummaryInBrowser", "CategoricalMapSummary"],
    // TODO: Related actions: reveal compare-highlight selections.
    tAnswer: {
      class: "summaryViewAs",
      cElement: "summaries",
      text: "Click TODO (HERE)", 
      pos: "e"
    }
  },
  T_RetrieveRecordDetails: {
    q: "View record details",
    actions: "Explore+View+Select",
    topics: "Record",
    context: ["RecordDisplay", "RecordsWithDetailToggle"],
    note: "Record details (all attributes) are shown in a popup panel.",
    tAnswer: {
      class: "recordToggleDetail",
      cElement: "recordDisplay",
      text: "Click <i class='fa fa-info-circle'></i>",
      pos: "w",
      // only show tooltip for elements that are within view...
      filter: function(){
        var minY = this.browser.recordDisplay.DOM.recordGroup[0][0].scrollTop;
        var maxY = minY + this.browser.recordDisplay.DOM.recordGroup[0][0].offsetHeight;
        this.context.HighlightedDOM = this.context.HighlightedDOM.filter(function(d){
          var record = d.__data__;
          if(!record.isWanted) return false;
          var DOM = record.DOM.record;
          if( DOM.offsetTop < minY) return false;
          if( DOM.offsetTop+DOM.offsetHeight > maxY) return false;
          return true;
        });
      }
    }
  },
  T_ViewRecRank: {
    q: "View record ranks",
    actions: "View+Sort",
    topics: "Record Panel+Record",
    context: ["AuthoringMode", "RecordDisplay"],
    similarTopics: ['T_RecSortRev','T_CatSortRev'],
    tAnswer: {
      class: "itemRank_control",
      cElement: "recordDisplay",
      text: "Click <i class='fa fa-angle-double-up'></i>",
      pos: "n"
    }
  },
  T_RemSummaryFilter: {
    q: "Remove filtering on a summary",
    actions: "Explore+Add/Remove+Filter",
    topics: "Summary+Filter Selection",
    context: ["SummaryInBrowser", "FilteredSummary"],
    similarTopics: ['T_RemoveCatFilter','T_ClearFilters'],
    tAnswer: [
      {
        class: "clearFilterButton",
        cElement: "summaries",
        text: "Click <i class='fa fa-filter'></i>", 
        pos: "e"
      }, {
        matches: '[class*="crumbMode_Filter"]',
        cElement: "browser",
        text: "Click <i class='fa fa-filter'></i> breadcrumb",
        pos: "n"
      }
    ]
  },
  T_RemoveCatFilter: {
    q: "Remove filtering on a specific category",
    actions: "Explore+Add/Remove+Filter",
    topics: "Categorical Summary",
    context: ["SummaryInBrowser", "OpenSummary", "CategoricalSummary", "FilteredSummary"],
    similarTopics: ['T_RemSummaryFilter','T_ClearFilters'],
    tAnswer: {
      matches: '.catGlyph[cfiltered]',
      cElement: "summaries",
      text: "Click on filtered category", 
      pos: "n"
    }
  },
  T_ClearFilters: {
    q: "Clear all filters / Show all Records",
    actions: "Explore+Filter",
    topics: "Filter Selection",
    context: "AnyFiltered",
    similarTopics: ['T_RemSummaryFilter','T_RemoveCatFilter'],
    tAnswer: {
      class: "filterClearAll",
      cElement: "browser", 
      text: "Click here", 
      pos: "n"
    }
  },
  T_RecSortRev: {
    q: function(){ return "Sort "+this.browser.recordName+" in reverse";} ,
    actions: "Explore+Sort",
    topics: "Record Panel",
    context: ["RecordDisplay", "RecordDisplayAsList"],
    note: "<i class='fa fa-sort-amount-desc'></i> appears when you mouse-over the record panel.",
    similarTopics: ['T_CatSortRev', 'T_RecSortChange'],
    tAnswer: {
      class: "recordSortButton", 
      cElement: "recordDisplay", 
      text: "Click <i class='fa fa-sort-amount-desc'></i>", 
      pos: "n"
    }
  },
  T_CatSortRev: {
    q: "Sort categories in reverse",
    actions: "Explore+Sort",
    topics: "Categorical Summary",
    context: ["SummaryInBrowser", "OpenSummary", "CategoricalSummary", "SortableSummary"],
    note: "<i class='fa fa-sort-amount-desc'></i> appears when you mouse-over the summary"+
      " and if categories can be sorted in reverse.",
    similarTopics: ['T_RecSortRev'],
    tAnswer: {
      class: "catSortButton",
      cElement: "summaries", 
      text: "Click <i class='fa fa-sort-amount-desc'></i>", 
      pos: "n"
    }
  },
  T_RecSortChange: {
    q: function(){ return "Change sorting criteria of "+this.browser.recordName; },
    actions: "Explore+Sort",
    topics: "Record Panel",
    context: ["RecordDisplay", "RecordDisplayAsList", "SummaryInBrowser", "IntervalSummary"], // TODO: More than one sorting option available.
    note: "Records can be sorted using number or time summaries.<br><br>"+
      "<i class='fa fa-sort'></i> appears when you mouse-over the summary.<br> "+
      "Active sorting summary always shows <i class='fa fa-sort'></i> for quick overview.",
    similarTopics: ['T_RecSortRev'],
    tAnswer: [
      { 
        class: "listSortOptionSelect",
        cElement: "recordDisplay", 
        text: "Click the dropdown to see sorting options<br> and select one.",
        pos: "n"
      }, {
        class: "useForRecordDisplay",
        cElement: "summaries",
        text: "Click <i class='fa fa-sort'></i>", 
        pos: "ne"
      }
    ]
    // TODO: Sorting is actually color in maps or networks...
  },
  T_ZoomInOutRange: {
    q: "Zoom in / out of active range filter",
    actions: "Navigate",
    topics: "Time Summary+Number Summary",
    context: ["SummaryInBrowser", "OpenSummary", "IntervalSummary", "FilteredSummary"],
    note: "<i class='fa fa-search-plus'></i> / <i class='fa fa-search-minus'></i> appears when you mouse-over an open summary.",
      // TODO: You cannot zoom beyond maximum resolution of time data.
      // TODO: You cannot zoom beyond step-scale.
    similarTopics: ['T_AdjustFilterRange'],
    tAnswer: {
      class: "zoomControl",
      cElement: "summaries",
      text: "Click <i class='fa fa-search-plus'></i> / <i class='fa fa-search-minus'></i>", 
      pos: "sw"
    }
  },
  T_SetMatrix: {
    q: "Explore pairwise relations / Show pair matrix",
    actions: "Explore+Show/Hide",
    topics: "Set Summary+Categorical Summary",
    context: ["SummaryInBrowser","CategoricalSummary","MultiValuedSummary"],
    note: "Pair-matrix is only available for summaries which include records with multiple categories.",
    tAnswer: {
      class: "setMatrixButton", 
      cElement: "summaries",
      text: "Click <i class='fa fa-tags'></i>", 
      pos: "n"
    }
  },
  T_Percentiles: {
    q: "Show/hide percentiles &amp; median",
    actions: "Explore+Show/Hide+Configure",
    topics: "Number Summary+Percentile Chart",
    context: ["SummaryInBrowser","OpenSummary","IntervalSummary","NumberSummary","SummaryOpenConfig"],
//    note: percentileInfo, // This info doesn't make much sense when the percentile chart is not visible.
    tAnswer: {
/*      sequence: [
        {
          class: "summaryConfigControl",
          cElement: "summaries",
          text: "Click <i class='fa fa-gear'></i>", 
          pos: "ne"
        },{ */
          matches: "[showConfig=\"true\"] .summaryConfig_Percentile",
          cElement: "summaries",
          text: "Select show / hide percentiles<br> in summary configuration", 
          pos: "ne"
/*        }
      ]*/
    },
  },
  T_OpenSummary: {
    q: "Open a summary",
    actions: "Layout",
    topics: "Summary",
    context: ["SummaryInBrowser","CollapsedSummary"],
    similarTopics: ['T_CollapseSummary', 'T_MaxSummary', 'T_AddSummary'],
    tAnswer: {
      class: "buttonSummaryOpen",
      cElement: "summaries",
      text: "Click <i class='fa fa-expand'></i>", 
      pos: "nw"
    }
  },
  T_CollapseSummary: {
    q: "Minimize a summary",
    actions: "Layout",
    topics: "Summary",
    context: ["SummaryInBrowser","OpenSummary"],
    note: "<i class='fa fa-compress'></i> appears when you mouse-over an open summary.",
    similarTopics: ['T_OpenSummary', 'T_MaxSummary', 'T_RemSummary'],
    tAnswer: {
      class: "buttonSummaryCollapse", 
      cElement: "summaries",
      text: "Click <i class='fa fa-compress'></i>", 
      pos: "nw"
    }
  },
  T_MaxSummary: {
    q: "Maximize a summary",
    actions: "Layout",
    topics: "Summary",
    context: ["SummaryInBrowser", "CategoricalSummary", "OpenSummary", "ExpandableSummary"],
    note: "<i class='fa fa-arrows-alt'></i> appears when you mouse-over a summary that can be maximized.",
    similarTopics: ['T_OpenSummary', 'T_CollapseSummary'],
    tAnswer: {
      class: "buttonSummaryExpand",
      cElement: "summaries", 
      text: "Click <i class='fa fa-arrows-alt'></i>", 
      pos: "nw"
    }
  },
  T_ConfigSummary: {
    q: "Show/hide configuration of a summary",
    actions: "Show/Hide",
    topics: "Summary",
    context: ["SummaryInBrowser","OpenSummary"],
    note: "Configuration options depend on the summary data type.<br><br>"+
      "<i class='fa fa-gear'></i> appears when you mouse-over the summary.",
    similarTopics: ['T_EnableAuth'],
    tAnswer: {
      class: "summaryConfigControl", 
      cElement: "summaries", 
      text: "Click <i class='fa fa-gear'></i>", 
      pos: "ne"
    }
  },

  T_EnableAuth: {
    q: "Enable authoring / Show available attributes",
    actions: "Configure",
    topics: "Browser",
    similarTopics: ['T_ConfigSummary'],
    tAnswer: {
      class: "authorButton",
      cElement: "browser", 
      text: "Click <i class='fa fa-cog'></i>", 
      pos: "n"
    },
    weight: 60
  },
  T_RemSummary: {
    q: "Remove a summary from browser",
    actions: "Layout+Add/Remove",
    topics: "Summary+Browser",
    context: ["AuthoringMode", "SummaryInBrowser"],
    note: "<i class='fa fa-times'></i> appears when you mouse-over a summary.",
    similarTopics: ['T_AddSummary'],
    tAnswer: {
      class: "buttonSummaryRemove", 
      cElement: "summaries", 
      text: "Click <i class='fa fa-times'></i>", 
      pos: "nw"
    }
  },
  T_ResizePanel: {
    q: "Resize panel width",
    actions: "Layout",
    topics: "Panel",
    context: ["AuthoringMode", "SummaryInBrowser"],
    similarTopics: ['T_ResizeCatWidth'],
    tAnswer: {
      class: "panelAdjustWidth",
      cElement: "browser",
      text: "Click &amp; drag panel border"
    }
  },
  T_ResizeCatWidth: {
    q: "Resize category labels width",
    actions: "Layout",
    topics: "Categorical Summary+Panel",
    context: ["AuthoringMode", "SummaryInBrowser", "CategoricalSummary", "OpenSummary"],
    similarTopics: ['T_ResizePanel'],
    tAnswer: {
      class: "chartCatLabelResize", 
      cElement: "summaries",
      text: "Click &amp; drag category width line"
    }
  },
  T_UnitName: {
    q: "Set unit name of a numeric attribute",
    actions: "Change",
    topics: "Number Summary+Unit Name",
    context: ["AuthoringMode","SummaryInBrowser","OpenSummary","IntervalSummary","NumberSummary","SummaryOpenConfig"],
    tAnswer: {
/*      sequence: [
        {
          class: "summaryConfigControl", 
          cElement: "summaries", 
          text: "Click <i class='fa fa-gear'></i>", 
          pos: "ne"
        },{*/
          matches: "[showConfig=\"true\"] .summaryConfig_UnitName",
          cElement: "summaries",
          text: "Type in the unit name<br> in summary configuration", 
          pos: "ne"
/*        }
      ]*/
    }
  },
  T_RenameSummary: {
    q: "Rename summary",
    actions: "Change",
    topics: "Summary",
    context: ["AuthoringMode", "SummaryInBrowser"],
    // TODO: Can rename it by clicking on the available attribute list too.
    tAnswer: {
      class: "summaryName_text",
      cElement: "summaries", 
      text: "Click on the summary name",
      pos: "n"
    }
  },
  T_BinScale: {
    q: "Change histogram binning scale (<b>log</b> / <b>linear</b>)",
    actions: "Change",
    topics: "Number Summary+Bin Scale Type",
    context: ["SummaryInBrowser","IntervalSummary","NumberSummary","PositiveNumberSummary","SummaryOpenConfig"],
    note: "Log-scale can be used in summaries with <i>only</i> positive values.",
    // TODO: There are a few other constraints: Not-step scale.. (depends on filtering state too)
    tAnswer: {
/*      sequence :[
        { class: "summaryConfigControl", 
          cElement: "summaries", 
          text: "Click <i class='fa fa-gear'></i>", 
          pos: "ne"
        },{*/
          matches: "[showConfig=\"true\"] .summaryConfig_ScaleType",
          cElement: "summaries",
          text: "Select linear / log scale<b> in summary configuration", 
          pos: "ne"
/*        }
      ]*/
    },
  },
  T_LabelLockedSel: {
    q: "View measure-labels of a locked <i class='fa fa-lock'></i> selection",
    actions: "Compare+View",
    topics: "Aggregate+Measurement+Compare Selection+Compared Measure",
    context: ["SummaryInBrowser","ActiveCompareSelection"],
    note: "The aggregate measure-label (text) color reflects the selection it displays.",
    // TODO: Show a tooltip for the color? how... activate?
    tAnswer: [
      {
        matches: '[class*="crumbMode_Compare_"]',
        cElement: "browser",
        text:  "Mouse-over <i class='fa fa-lock'></i> breadcrumb",
        pos: "n"
      },
      {
        class: 'measureLabel',
        cElement: "summaries",
        text: ""
      }
    ],
    activate: function(){
      this.browser.refreshMeasureLabels("Compare_A");
    },
    deactivate: function(){
      this.browser.refreshMeasureLabels();
    }
  },
  T_RemRecPanel: {
    q: "Remove record panel",
    actions: "Layout+Add/Remove",
    topics: "Record Panel+Browser",
    context: ["AuthoringMode", "RecordDisplay"], // TODO: At least summary not within browser / available attribute.
    similarTopics: ['T_AddRecordPanel'],
    tAnswer: {
      class: "buttonRecordViewRemove", 
      cElement: "recordDisplay", 
      text: "Click <i class='fa fa-times'></i>", 
      pos: "n"
    }
  },
  T_SumDescr: {
    q: "Read summary description",
    actions: "View",
    topics: "Summary",
    context: ["SummaryInBrowser","SummaryWithDescription"],
    tAnswer: {
      class: "summaryDescription", 
      cElement: "summaries", 
      text: "Mouse-over <i class='fa fa-info-circle'></i>", 
      pos: "ne"
    }
  },
  T_Help: {
    q: "Get help",
    actions: "",
    topics: "",
    tAnswer: {
      class: "showHelpIn",
      cElement: "browser",
      text: "Click <i class='fa fa-question-circle'></i>",
      pos: "ne"
    }
  },
  T_Fullscreen: {
    q: "View the data browser in fullscreen",
    actions: "View",
    topics: "Browser",
    tAnswer: {
      class: "viewFullscreen",
      cElement: "browser",
      text: "Click <i class='fa fa-arrows-alt'></i>",
      pos: "ne"
    }
  }
  /*
  5: {
    q: "Select Map Regions",
    actions: "Explore+Select+Select",
    topics: "Map",
    context: ["SummaryInBrowser", "CategoricalSummary", "CategoricalMapSummary"],
    // TODO
  },
  22: {
    q: "View records as a map",
    action: "Explore+Change+View",
    topics: "Record Panel+Map",
    context: ["RecordDisplay", "RecordDisplayAsMap"],
  },
  50: {
    q: "View records as a network",
    action: "Explore+Change+View",
    topics: "Record Panel",
    context: ["RecordDisplay", "RecordDisplayAsNetwork"],
  },
  25: {
    q: "Navigate (pan and zoom) in maps",
    actions: "View+Navigate",
    topics: "Map",
    context: ["SummaryInBrowser","CategoricalSummary", "CategoricalMapSummary"],
      // DODO: Also should appear when record panel is map mode. IMPORTANT.
  },
  33: {
    q: "Move a summary",
    actions: "Layout",
    topics: "Summary+Browser",
    context: ["AuthoringMode", "SummaryInBrowser"],
  },
  T_AddSummary: {
    q: "Add a summary into browser",
    actions: "Layout+Add/Remove",
    topics: "Summary+Browser",
    context: ["AuthoringMode"], // TODO: At least summary not within browser / available attribute.
    similarTopics: ['T_RemSummary']
  },
  38: {
    q: "Add / create new custom attribute",
    actions: "Explore+Add/Remove+Transform Data",
    topics: "Summary+Custom Attribute",
    context: "AuthoringMode",
  },
  39: {
    q: "Edit custom attribute",
    actions: "Explore+Transform Data",
    topics: "Summary+Custom Attribute",
    context: "AuthoringMode",
  },
  40: {
    q: "Split text to multiple categories",
    actions: "Explore+Transform Data",
    topics: "Categorical Summary",
    context: ["AuthoringMode","CategoricalSummary"],
  },
  41: {
    q: "Parse time from text",
    actions: "Explore+Transform Data",
    topics: "Time Summary+Categorical Summary",
    context: ["AuthoringMode","CategoricalSummary"],
  },
  43: {
    q: "Extract time component (month, day, hour...)",
    actions: "Explore+Transform Data",
    topics: "Time Summary",
    context: ["AuthoringMode", "IntervalSummary", "TimeSummary"],
  },
  47: {
    q: "Save browser configuration",
    actions: 'Save',
    context: "AuthoringMode",
  },
  48: {
    q: "Login to Github",
    actions: "Login/Logout",
    topics: "",
    context: "AuthoringMode",
  },
  49: {
    q: "Change Gist upload mode to private or public",
    context: "LoggedIn",
  },
  T_AddRecordPanel: {
    q: "Add record panel",
    actions: "Layout+Add/Remove",
    topics: "Record Panel+Browser",
    context: ["AuthoringMode"], // TODO: At least summary not within browser / available attribute.
    similarTopics: ['T_RemRecPanel'],
  },
  {
    q: "Clear text search",
    actions: "Explore+Clear+Remove+Select",
    topics: "Record Panel+Categorical Summary"
  },
  {
    q: "Load Browser Configuration",
  },
  {
    q: "Import Dataset",
    actions: "Import"
  },*/
},
  _icons: {
    explore: 'compass',
    compare: 'exchange',
    missing_values: 'ban',
    search: 'search',
    sort: 'sort',
    browser: 'columns',
    lock: 'lock',
    remove: 'times',
    save: 'save',
    create: 'plus-square',
    edit: 'pencil', // or edit
    zoom: 'search-plus',
    login_logout: 'sign-in',
    github: 'github',
    rank: 'angle-double-up',
    category: 'tag',
    move: "arrows",
    adjust_width: "arrows-h", // doesn't fit all
    map_region: "globe",
    split: "scissors",
    open: "expand",
    close: "compress",
    resize: "arrows-alt",
    time_summary: "line-chart", // or clock-o
    number_summary: "bar-chart",
    categorical_summary: "bar-chart fa-histogram-flip",
    map_summary: "globe",
    measurement: "hashtag",
    configure: "cog",
    view: "eye",
    scale_Mode: "arrows-h",
    aggregate: "cubes",
    configure: 'gear',
    transform_data: 'clone',
    map: 'globe',
    filter: 'filter',
  }
};

var Helpin = function(browser){
  var me = this;
  this.browser = browser;

  this.DOM = {
    root: browser.DOM.root.select(".overlay_help"),
    overlay_answer  : browser.panel_overlay.append("span").attr("class","overlay_answer"),
    overlay_control : browser.panel_overlay.append("span").attr("class","overlay_help_control"),
  };

  // Tracking actions in the main app
  this.actionHistory = [];
  this.topicHistory = [];
  browser.DOM.root.on("click.helpin",function(){
    // skip clicks on the help or other overlay panels
    var DOM = d3.event.target;
    if(DOM.matches(".panel_overlay *")) return;
    if(DOM.matches(".showHelpIn")) return; // skip click on help button
    me.actionHistory = [DOM].concat(me.actionHistory.slice(0,19));
    // add to topicHistory
    me.topicsList.forEach(function(topic){
      topic.tAnswer.forEach(function(answer){
        var selector = answer.matches;
        if(selector===undefined) return;
        if(DOM.matches(".kshf "+selector)){
          me.topicHistory = [topic].concat(me.topicHistory.slice(0,19));
        }
      },this);
    })
  });

  this.topicsList = [];

  this.actionsList = [];
  this.keywordsList = [];
  this.keywordsIndexed = {};
  this.tooltips = [];
  this.topicsByDOMSelector = {};

  this.context = {};

  this.qFilters = {
    actions: [],
    topics: [],
    textSearch: "",
    relevant: true
  };

  this.selectedTopic = null;
  this.GuidedTourStep = 0;

  // Sample notify action - 3 second delay
  setTimeout(function(){
    me.notifyAction = {topic: _material._topics['T_ChangeMetric']};
    me.browser.DOM.notifyButton.style("display","inline-block");
  },3000);

  this.initData();
};

Helpin.prototype = {
  /** -- */
  evaluateContext: function(topic, in_summary){
    // Initialize context elements
    // Need to do it for every topic, since these arrays can be filtered in evaluation process.
    this.context.summaries     = (in_summary) ? [in_summary] : this.browser.summaries;
    this.context.browser       = this.browser;
    this.context.recordDisplay = this.browser.recordDisplay;

    topic.isRelevant = true;
    topic.relevanceWeight = topic.weight ? topic.weight : 0;
    
    topic.context.forEach(function(c){
      var isRelevant = false;
      var multiplier = 1;
      if(typeof c.topicContext.v==="object"){
        if(c.topicContext.v.summaries){
          this.context.summaries = this.context.summaries.filter(c.topicContext.v.summaries);
          isRelevant = this.context.summaries.length>0;
          multiplier = 1+(this.context.summaries.length*0.01);
        }
      } else if(typeof c.topicContext.v==="function"){
        isRelevant = c.topicContext.v.call(this.context);
        if(isRelevant===undefined || isRelevant===null || isRelevant===[]) isRelevant = false;
      }

      var weight = 0;
      if(isRelevant){ // relevant, or can be made relevant with another action
        weight = c.topicContext.weight;
      } else if(c.topicContext.fixBy){
        weight = c.topicContext.weight/2;
      }
      weight = Math.pow(weight,multiplier);

      topic.relevanceWeight += weight;

      c.isRelevant = isRelevant;

      topic.isRelevant = topic.isRelevant && isRelevant;
    },this);

    topic.usedPos = -1;
    this.topicHistory.some(function(histTopic,i){ 
      if(histTopic===topic){
        topic.usedPos = i;
        return true;
      }
      return false;
    });

    // rank by user actions
    if(topic.usedPos!==-1 && (this.rankByUnusued() || this.rankByMostRecent())){
      if(this.rankByUnusued()){
        // penalty for most recently used items
        topic.relevanceWeight -= (21-topic.usedPos)*200;
      } else if(this.rankByMostRecent()){
        // bonus for most recently used items
        topic.relevanceWeight += (21-topic.usedPos)*200;
      }
    }
  },
  /** -- */
  context_highlight: function(answer){
    if(answer.cElement===undefined) return;

    var context_group = answer.cElement;
    var DOM_class = answer.class;
    var matches = answer.matches;

    kshf.activeTipsy = null;

    // Traverse the elements, extract related stuff
    this.context.HighlightedDOM = [];

    var extractHighlightedDOMs = function(CCC){
      var DOMs;
      if(matches){
        DOMs = CCC.DOM.root.selectAll(matches)[0];
      } else {
        if(typeof DOM_class === "function"){
          DOMs = DOM_class.call(CCC)[0];
        } if(typeof DOM_class === "string"){
          DOMs = CCC.DOM[DOM_class][0];
        }
      }
      if(Array.isArray(DOMs)){
        this.context.HighlightedDOM = this.context.HighlightedDOM.concat( DOMs );
      } else {
        this.context.HighlightedDOM.push( DOMs );
      }
    };

    if(Array.isArray(this.context[context_group])){
      this.context[context_group].forEach(extractHighlightedDOMs,this);
    } else {
      extractHighlightedDOMs.call(this, this.context[context_group]);
    }

    if(answer.filter)   answer.filter.call(this);
    if(answer.activate) answer.activate.call(this);

    // inject CSS style and track all the highlighted DOM's
    this.context.HighlightedDOM.forEach(function(DOM){
      this.context.HighlightedDOM_All.push(DOM);
      DOM.setAttribute("helpin",true);
    },this);

    // Highlight with given text
    this.fHighlightBox(answer.text, answer.pos);
  },
  /** -- */
  getTopicText: function(topic){ 
    var str = "<span class='topicWeight'> ("+Math.round(topic.relevanceWeight)+") </span>";
    if(typeof topic.q === "string")   return topic.q + str;
    if(typeof topic.q === "function") return topic.q.call(this,topic) + str;
  },
  /** -- */
  getIcon: function(word, prefix){
    var v=word.replace(" ","_").replace("/","_").toLowerCase();
    if(_material._icons[v]) return prefix+" fa fa-"+_material._icons[v]; 
    return "";
  },
  /** -- */
  initData: function(){
    var actions_by_name = {};
    var topics_by_name = {};

    for(var i in _material._topics){
      _material._topics[i].id = i;
      this.topicsList.push(_material._topics[i]);
    }

    this.topicsList.forEach(function(q){
      q.displayed = true;

      if(q.context===undefined) q.context = "True";
      if(!Array.isArray(q.context)) q.context = [q.context];
      q.context.forEach(function(c,i){
        q.context[i] = {
          isRelevant: true,
          topicContext: _material._contextFeatures[c]
        };
      });

      // Answer
      if(q.tAnswer===undefined) q.tAnswer = [];
      if(!Array.isArray(q.tAnswer)) q.tAnswer = [q.tAnswer];

      function addByDOMSelector(answer){
        var selector;
        if(answer.class){
          selector = "."+answer.class;
        } else if(answer.matches){
          selector = answer.matches;
        } else {
          return; // TODO: See if any answers falls through this.
        }
        if(this.topicsByDOMSelector[selector]===undefined) this.topicsByDOMSelector[selector] = [];
        this.topicsByDOMSelector[selector].push(q);
      };
      q.tAnswer.forEach(function(answer,i){
        if(typeof answer === 'string') {
          q.tAnswer[i] = {text: answer};
          return;
        }
        if(answer.sequence){
          answer.sequence.forEach(function(a,j){ 
            if(typeof a==='string') {
              answer.sequence[j] = {text: a};
              return;
            }
            addByDOMSelector.call(this,a);
          },this);
        } else {
          addByDOMSelector.call(this,answer);
        }
        if(answer.class && answer.matches===undefined){
          answer.matches = "."+answer.class;
        }
      },this);

      if(q.similarTopics===undefined) q.similarTopics = [];

      // Split Actions    
      if(q.actions===undefined) q.actions = "";
      q.actions = q.actions.split("+");
      if(q.actions[0]==="") q.actions = [];
      q.actions.forEach(function(actionName){ 
        if(actions_by_name[actionName]) actions_by_name[actionName].push(q); else actions_by_name[actionName] = [q]; 
      });

      // Split Topics
      if(q.topics===undefined) q.topics = "";
      q.topics = q.topics.split("+");
      if(q.topics[0]==="") q.topics = [];
      q.topics.forEach(function(topicName){ 
        if(topics_by_name[topicName]) topics_by_name[topicName].push(q); else topics_by_name[topicName] = [q]; 
      });
    }, this);

    for(var v in actions_by_name){
      this.actionsList.push({name: v, questions: actions_by_name[v], selected: false});
    }
    for(var v in topics_by_name){
      var TT = {name: v, questions: topics_by_name[v], selected: false};
      this.keywordsList.push(TT);
      this.keywordsIndexed[v] = TT;
    }
  },
  /** -- */
  showBrowseTopics: function(){
    var me=this;

    this.showPanel();
    this.removeTooltips();

    if(this.selectedTopic) this.closeTopic();

    this.closePointNLearn();

    this.browser.panel_overlay.attr("show","help-browse");
    this.DOM.root
      .style({left: null, right: null, top: null, bottom: null})
      .attr("hideRelatedTopics",null);

    this.DOM.overlay_control.selectAll('[class^="helpInMode_"]').attr("active",null);
    this.DOM.overlay_control.select(".helpInMode_BrowseTopics").attr("active",true);

    this.DOM.TopicBlock.style("font-size",null);

    this.DOM.TopicsList[0][0].scrollTop = 0;

    // Clear all filtering. :: TODO: Check / incomplete
    while(true){
      if(this.qFilters.topics.length===0) break;
      this.unselectKeyword(this.qFilters.topics[0]);
    }
    this.DOM.SearchTextBox[0][0].focus();

    this.filterTopics();
  },
  /** -- */
  initDOM: function(){
    var me=this;

    if(this.DOM.SearchBlock) {
      if(this.selectedTopic) this.closeTopic();
      this.showPointNLearn();
      return;
    }

    this.initDOM_ControlPanel();

    this.DOM.SelectedThing_Header  = this.DOM.root.append("div").attr("class","SelectedThing_Header")
      // click & drag the panel
      .on("mousedown", function (d, i) {
        me.movingBox = true;
        me.browser.DOM.root.attr("drag_cursor",'grabbing');

        me.DOM.root.style("box-shadow","0px 0px 40px #111");
        
        me.DOM.root.style("transition","none");
        // MOVE HELPIN BOX
        var initPos = d3.mouse(d3.select("body")[0][0]);
        var DOM = me.DOM.root[0][0];
        var initLeft  = DOM.offsetLeft; // position relative to parent
        var initTop   = DOM.offsetTop; // position relative to parent
        var boxWidth  = DOM.getBoundingClientRect().width;
        var boxHeight = DOM.getBoundingClientRect().height;
        var maxLeft   = me.browser.DOM.root[0][0].getBoundingClientRect().width  - boxWidth;
        var maxTop    = me.browser.DOM.root[0][0].getBoundingClientRect().height - boxHeight;
        me.browser.DOM.root.on("mousemove", function() {
          var newPos = d3.mouse(d3.select("body")[0][0]);
          DOM.style.left   = Math.min(maxLeft, Math.max(0, initLeft-initPos[0]+newPos[0] ))+"px";
          DOM.style.top    = Math.min(maxTop,  Math.max(0, initTop -initPos[1]+newPos[1] ))+"px";
        }).on("mouseup", function(){
          me.movingBox = false;
          me.DOM.root.style("transition",null);
          me.DOM.root.style("box-shadow",null);
          me.browser.DOM.root.attr("drag_cursor",null).on("mousemove", null).on("mouseup", null);
        });
      });
    this.DOM.SelectedThing_Header.append("span").attr("class","hContent");
    this.DOM.SelectedThing_Header.append("span").attr("class","backButton fa fa-arrow-left")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'w', title: "Go back" }); })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",function(){
        this.tipsy.hide();
        switch(me.browser.panel_overlay.attr("show")){
          case 'helppointnlearn': me.showPointNLearn(); break;
          case 'help-browse':     me.showBrowseTopics(); break;
        }
      });

    this.initDOM_GuidedTour();

    this.DOM.SelectedThing_Content      = this.DOM.root.append("div").attr("class","SelectedThing_Content");
    this.DOM.SelectedThing_Content_More = this.DOM.root.append("div").attr("class","SelectedThing_Content_More");

    // RELEVANT WHEN... BLOCK
    this.DOM.TopicRelWhenBlock = this.DOM.root.append("div").attr("class","TopicInfoBlock TopicRelWhenBlock");
    this.DOM.TopicRelWhenBlock.append("div").attr("class","TopicInfoHeader").text("Relevant when ...");
    this.DOM.TopicRelWhenBlock.append("div").attr("class","TopicInfoShowHide")
      .on("click",function(){
        me.DOM.TopicRelWhenBlock.attr("showBlockContent", me.DOM.TopicRelWhenBlock.attr("showBlockContent")==="false");
      });
    this.DOM.ContextContent  = this.DOM.TopicRelWhenBlock.append("div").attr("class","TopicInfoBlockContent ContextContent");

    this.DOM.RelatedTopics = this.DOM.root.append("div").attr("class","RelatedTopics")
      .html("Related Topics")
      .on("click",function(){
        if(me.DOM.root.attr("hideRelatedTopics")==="true"){
          me.DOM.root.attr("hideRelatedTopics",null);
          me.checkBoxBoundaries();
        } else {
          me.DOM.root.attr("hideRelatedTopics",true);
        }
      });
    this.DOM.RelatedTopics.append("div").attr("class","TopicInfoShowHide");

    this.DOM.heyooo = this.DOM.root.append("div").attr("class","heyooo");

    this.DOM.browseTopicBlock = this.DOM.heyooo.append("div").attr("class","browseTopicBlock");
    this.DOM.SearchBlock = this.DOM.browseTopicBlock.append("div").attr("class","SearchBlock");

    this.initDOM_TextSearch();
    this.initDOM_FilterTypes();
    this.initDOM_TopicList();
    this.initDOM_PointNClickInfo();

    this.showPointNLearn(); // default mode on initialization
  },
  /** -- */
  initDOM_PointNClickInfo: function(){
    var me=this;
    var X = this.DOM.root.append("div").attr("class","PointNClick_Info");
    X.append("div").attr("class","DescriptionToFreeze")
      .html("<i class='fa fa-bullseye'></i> <b>Click to freeze selection</b>");
    X.append("div").attr("class","DescriptionToUnFreeze")
      .html("<i class='fa fa-bullseye'></i> <b>Click to un-freeze selection</b>")
      .on("click",function(){
        if(me.lockedBox) {
          me.lockedBox.removeAttribute("locked");
          me.lockedBox.tipsy.jq_tip.attr("locked",null);
          me.lockedBox = false;
        }
        me.DOM.root.attr("hideRelatedTopics",true);
        me.browser.panel_overlay.attr("lockedPointNLearn",null);
      });
  },
  /** -- */
  initDOM_ControlPanel: function(){
    var me=this;

    this.DOM.overlay_control.append("div").attr("class","overlay_Close fa fa-times-circle")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'e', title: "Close Help (Escape)" }); })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide(); me.closePanel(); });

    this.DOM.overlay_control.append("span").attr("class","GetHelpHeader").text("Get Help");

    this.DOM.overlay_control.append("span").attr("class","helpInMode_PointNLearn")
      .html("<i class='fa fa-hand-pointer-o'></i> Point &amp; Learn")
      .on("click",function(){ me.showPointNLearn(); });
    this.DOM.overlay_control.append("span").attr("class","helpInMode_BrowseTopics")
      .html("<i class='fa fa-book'></i> Topic Listing")
      .on("click",function(){ me.showBrowseTopics(); });
    this.DOM.overlay_control.append("span").attr("class","helpInMode_GuidedTour")
      .html("<i class='fa fa-location-arrow'></i> Guided Tour")
      .on("click",function(){ me.showGuidedTour(); });
    
    this.DOM.overlay_control.append("a").attr("class","helpInMode_Video").attr("target","_blank")
      .html("<i class='fa fa-youtube-play'></i> Video Tutorial")
      .attr("href","http://www.youtube.com/watch?v=3Hmvms-1grU");
    this.DOM.overlay_control.append("a").attr("class","helpInMode_Wiki").attr("target","_blank")
      .html("<i class='fa fa-code'></i> API &amp; More")
      .attr("href","http://www.github.com/adilyalcin/Keshif/wiki");
  },
  /** -- */
  initDOM_GuidedTour: function(){
    var me=this;
    this.DOM.GuidedTour = this.DOM.root.append("div").attr("class","GuidedTour");

    this.DOM.GuidedTour.append("span").attr("class","GuidedTourHead")
      .html("<i class='fa fa-location-arrow'></i> Guided Tour");

    this.DOM.GuidedTour.append("span").attr("class","TourStep PreviousStep")
      .html("<i class='fa fa-arrow-left' style='color: gray;'></i> Previous")
      .on("click",function(){ me.showTourStep_Prev(); });
    this.DOM.GuidedTour.append("span").attr("class","TourStep NextStep")
      .html("Next <i class='fa fa-arrow-circle-right'></i>")
      .on("click",function(){ me.showTourStep_Next(); });

    this.DOM.GuidedTourProgressBar = this.DOM.GuidedTour.append("div").attr("class","GuidedTourProgressBar");

    this.DOM.GuidedTourCurrentStep = this.DOM.GuidedTourProgressBar.append("span")
      .attr("class","GuidedTourStep GuidedTourCurrentStep");
  },
  /** -- */
  initDOM_TextSearch: function(){
    var me=this;
    var browser = this.browser;
    this.DOM.TextSearchBlock = this.DOM.SearchBlock.append("div").attr("class","TextSearchBlock");
    this.DOM.TextSearchBlock.append("span").attr("class","HowDoI").html("How do I ?");
    this.DOM.SearchTextBox = this.DOM.TextSearchBlock.append("input").attr("class","SearchTextBox")
      .attr("type","text")
      .attr("placeholder","explore data")
      .on("keyup", function(){
        me.qFilters.textSearch = this.value.toLowerCase();
        if(me.qFilters.textSearch!==""){
          var pattern = new RegExp("("+me.qFilters.textSearch+")",'gi');
          var replaceWith = "<span class='textSearch_highlight'>$1</span>";
          me.DOM.TopicText.html(function(topic){ return me.getTopicText(topic).replace(pattern,replaceWith); });
        } else {
          me.DOM.TopicText.html(function(topic){ return me.getTopicText(topic); });
        }
        me.filterTopics();
      });
  },
  /** -- */
  initDOM_FilterTypes: function(){
    var me=this;

    // INSERT ACTIONS INTO DOM
    this.DOM.ActionTypes = this.DOM.browseTopicBlock.append("div").attr("class","QuestionTypes ActionTypes");
    this.DOM.ActionTypes.append("span").attr("class","TypeLabel");
    this.DOM.ActionSelect = this.DOM.ActionTypes
      .append("span").attr("class","TypeGroup")
      .selectAll(".QuestionTypeSelect")
      .data(this.actionsList, function(action){ return action.name; } )
      .enter()
        .append("div")
        .attr("class","QuestionTypeSelect")
        .attr("selected",false)
        .each(function(action){ action.DOM = this; })
        .on("click",function(action){
          action.selected = !action.selected;
          this.setAttribute("selected", action.selected);
          if(action.selected) {
            me.qFilters.actions.push(action);
          } else {
            me.qFilters.actions.splice( me.qFilters.actions.indexOf(action), 1); // remove
          }
          me.filterTopics();
        });
    this.DOM.ActionSelect.append("span").attr("class","label").html(function(tag){ return tag.name;});
    this.DOM.ActionSelect.append("span").attr("class","num");
    this.DOM.ActionSelect.append("span").attr("class",function(tag){ 
      var x=me.getIcon(tag.name, "topicInfoMark");
      if(x!=="") this.parentNode.setAttribute("hasIcon",true);
      return x;
    });

    // INSERT TOPICS INTO DOM
    this.DOM.TopicTypes = this.DOM.browseTopicBlock.append("div").attr("class","QuestionTypes TopicTypes");
    this.DOM.TopicTypes.append("span").attr("class","TypeLabel");
    this.DOM.TopicSelect = this.DOM.TopicTypes
      .append("span").attr("class","TypeGroup")
      .selectAll(".QuestionTypeSelect")
      .data(this.keywordsList, function(topic){ return topic.name; } )
      .enter()
        .append("div")
        .attr("class","QuestionTypeSelect")
        .attr("selected",false)
        .each(function(keyword){ keyword.DOM = this; })
        .on("click",function(keyword){
          me.swapselectKeyword(keyword);
          me.filterTopics();
        })
        .attr("title", function(tag){ return tag.name; });
    this.DOM.TopicSelect.append("span").attr("class", "label").html(function(tag){ return tag.name;});
    this.DOM.TopicSelect.append("span").attr("class", "num");
    this.DOM.TopicSelect.append("span").attr("class", function(tag){ 
      var x=me.getIcon(tag.name, "topicInfoMark");
      if(x!=="") this.parentNode.setAttribute("hasIcon",true);
      return x; 
    });

    this.DOM.BrowseOptions = this.DOM.browseTopicBlock.append("div").attr("class","BrowseOptions");

    var x;

    x = this.DOM.BrowseOptions.append("div").attr("class","checkBoxArea")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 's', title: "Topics that do not<br> match current settings." }); })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); });;
    this.DOM.checkboxRelevant = x.append("input").attr("type","checkbox").attr("id","checkboxRelevant")
      .attr("checked",true)
      .on("change",function(){ me.filterTopics(); });
    x = x.append("label").attr("for","checkboxRelevant")
    x.append("span").attr("class","ShowHide");
    x.append("span").html(" non-relevant topics");

    x = this.DOM.BrowseOptions.append("div").attr("class","checkBoxArea")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 's', title: "Prioritize features that<br> you haven't used yet." }); })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); });;
    this.DOM.checkboxPrioritize =x.append("input").attr("type","checkbox").attr("id","checkboxPrioritize")
      .on("change",function(){
        if(me.DOM.checkboxPrioritize[0][0].checked){
          me.DOM.checkboxPrioritizeRecent[0][0].checked = false;
        } 
        me.filterTopics();
      });
    x.append("label").attr("for","checkboxPrioritize").html("Prioritize unused");    

    x = this.DOM.BrowseOptions.append("div").attr("class","checkBoxArea")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 's', title: "Prioritize features that<br> you have recently used." }); })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); });;
    this.DOM.checkboxPrioritizeRecent =x.append("input").attr("type","checkbox").attr("id","checkboxPrioritizeRecent")
      .on("change",function(){ 
        if(me.DOM.checkboxPrioritizeRecent[0][0].checked){
          me.DOM.checkboxPrioritize[0][0].checked = false;
        } 
        me.filterTopics();
      });
    x.append("label").attr("for","checkboxPrioritizeRecent").html("Prioritize recently used");    
  },
  /** -- */
  filterRelevantOnly: function(){
    return !this.DOM.checkboxRelevant[0][0].checked;
  },
  rankByUnusued: function(){
    return this.DOM.checkboxPrioritize[0][0].checked;
  },
  rankByMostRecent: function(){
    return this.DOM.checkboxPrioritizeRecent[0][0].checked;
  },
  /** -- */
  swapselectKeyword: function(keyword){
    if(keyword.selected) 
      this.unselectKeyword(keyword); 
    else 
      this.selectKeyword(keyword);
  },
  /** -- */
  selectKeyword: function(keyword){
    if(keyword.selected) return;
    keyword.selected = true;
    keyword.DOM.setAttribute("selected",true);
    this.qFilters.topics.push(keyword);
  },
  /** -- */
  unselectKeyword: function(keyword){
    if(!keyword.selected) return;
    keyword.selected = false;
    keyword.DOM.setAttribute("selected",false);
    this.qFilters.topics.splice( this.qFilters.topics.indexOf(keyword), 1);
  },
  /* -- */
  selectTopic: function(q){
    var me=this;
    if(this.selectedTopic===q) {
      return;
    } else if(this.selectedTopic){
      this.closeTopic();
    }

    this.answerSequencePos = 0;

    this.closePointNLearn();

    this.selectedTopic = q;
    this.evaluateContext(q);

    this.browser.panel_overlay.attr("topicAnswer","true");

    this.DOM.overlay_answer.style("display","block");
    this.DOM.root.style({left: null, right: null, top: null, bottom: null});

    this.DOM.overlay_answer.selectAll(".stencilBox").remove();

    this.DOM.SelectedThing_Header.select(".hContent").html(this.getTopicText(q));

    // Context sort
    q.context = q.context.sort(function(a,b){ return b.isRelevant - a.isRelevant; });

    // Context show
    this.DOM.ContextContent.selectAll(".ContextItem").data([]).exit().remove();
    var X = this.DOM.ContextContent.selectAll(".ContextItem").data(q.context, function(c){ return c.topicContext.descr; })
      .enter().append("div").attr("class","ContextItem")
      .attr("isRelevant", function(c){ return c.isRelevant; });
    X.append("i").attr("class",function(c){ return "RelevantIcon fa fa-"+(c.isRelevant?"check-circle":"times-circle"); });
    X.append("span").html(function(c){ return c.topicContext.descr });
    X.filter(function(c){ return !c.isRelevant && c.topicContext.fixBy; })
      .append("span").attr("class","MakeRelevantTopic").text("How?")
        .on("click", function(c){ me.selectTopic(_material._topics[c.topicContext.fixBy]); });

    this.DOM.TopicRelWhenBlock.attr("showBlockContent",!q.isRelevant);

    this.DOM.TopicBlock.style("display","none");
    q.similarTopics.forEach(function(c){ _material._topics[c].DOM.style("display","block"); });

    // put the answer in the help box (not on the element)
    me.DOM.SelectedThing_Content.html("");
    q.tAnswer.forEach(function(answer){
      var t="";
      if(answer.sequence){
        answer.sequence.forEach(function(a){
          var x=a.text;
          if(typeof x=== "function") x = x.call(this);
          t+="<span class='subAnswer'>"+x+"</span> ";
        });
      } else {
        t = answer.text;
        if(typeof t=== "function") t = t.call(this);
      }
      t = t.replace(/\<br\>/gi,' ');
      if(t.length>0) this.DOM.SelectedThing_Content.append("div").attr("class","answerTooltip").html(t);
    },this);

    if(q.isRelevant){
      this.context.HighlightedDOM = [];
      this.context.HighlightedDOM_All = []; // can be multiple calls...
      if(q.activate) q.activate.call(me,q);
      if(q.tAnswer.length>0) {
        //setTimeout(function(){
          q.tAnswer.forEach(function(answer){
            if(answer.sequence){
              me.context_highlight(answer.sequence[me.answerSequencePos]);
            } else {
              me.context_highlight(answer);
            }
          });
          me.createStencils();
        //}, 500);
      }
    }

    // Show topic note
    if(q.note){
      this.DOM.SelectedThing_Content_More.html(
        ((typeof q.note)==="function")?q.note.call(this):q.note
      ).style("display","block");
    } else {
      this.DOM.SelectedThing_Content_More.html("").style("display","none");
    }
  },
  /** -- */
  createStencils: function(){
    // Create transparent window in the dark overlay on the interface
    var total_width  = parseInt(this.browser.DOM.root.style("width"));
    var total_height = parseInt(this.browser.DOM.root.style("height"));
    var dPath = "M 0 0 h "+total_width+" v "+total_height+" h -"+total_width+" Z ";
    this.DOM.overlay_answer.selectAll(".stencilBox").each(function(d,i){
      if(this.skipStencil) return;
      dPath += "M "+this.left+" "+this.top+" h "+this.width+" v "+this.height+" h -"+this.width+" Z ";
    });
    this.browser.DOM.kshfBackground.style("-webkit-mask-image", 
      "url(\"data:image/svg+xml;utf8,"+
      "<svg xmlns='http://www.w3.org/2000/svg' width='"+total_width+"' height='"+total_height+"'>"+
        "<path d='"+dPath+"' fill-rule='evenodd' fill='black' /></svg>\")");
    // TODO: Check SVG validity. Firefox doesn't suport mask-image yet (it's slow as hell anyway.)
  },

  /** -- */
  initDOM_TopicList: function(){
    var me=this;

    this.DOM.TopicsList = this.DOM.heyooo.append("div").attr("class","TopicsList");
    this.DOM.TopicBlock = this.DOM.TopicsList
      .selectAll(".TopicBlock").data(this.topicsList, function(topic){ return topic.id; }).enter()
        .append("div").attr("class","TopicBlock")
        .each(function(topic){ topic.DOM = d3.select(this); })
        .on("click", function(topic){ me.selectTopic(topic); });

    this.DOM.TopicBlock.append("span").attr("class","recentlyUsedIcon fa fa-history")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: "Recently used" }); })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); });

    this.DOM.TopicBlock.append("div").attr("class","TopicIcons")
      .selectAll(".icon").data(function(d){ return d.actions.concat(d.topics); })
        .enter().append("span")
          .attr("class",function(d){ return me.getIcon(d, "icon"); })
          .attr("title",function(d){ return d; });

    this.DOM.TopicBlock.append("div").attr("class","notInContext fa fa-exclamation-circle")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'nw', title: "Not applicable" }); })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); });

    this.DOM.TopicText = this.DOM.TopicBlock.append("div").attr("class","TopicText");
  },
  /** -- */
  fHighlightBox: function(text,pos, className){
    var me=this;
    var bounds_browser = this.browser.DOM.root[0][0].getBoundingClientRect();

    if(className===undefined) 
      className = "tipsy-helpin";
    else
      className = "tipsy-helpin " + className;


    kshf.activeTipsy = null;

    if(pos===undefined) pos = "w";
    if(typeof text === "function") text = text.call(this.context);

    var X = this.DOM.overlay_answer.selectAll(".highlightBox_nomatch")
      .data(this.context.HighlightedDOM, function(d,i){ return i; })
      .enter().append("div").attr("class","stencilBox")
      .each(function(d){ 
        this.bounds = d.getBoundingClientRect();
        this.left  = this.bounds.left-bounds_browser.left-3;
        this.width = this.bounds.width+6;
        this.top   = this.bounds.top-bounds_browser.top-3;
        this.height= this.bounds.height+6;
      })
      .style("left",  function(){ return this.left  +"px"; })
      .style("width", function(){ return this.width +"px"; })
      .style("top",   function(){ return this.top   +"px"; })
      .style("height",function(){ return this.height+"px"; })
      .each(function(d,i){ 
        if(i!==0) return; // show tip only for the first one
        // TODO: Pick up based on screen location (avoid edges) or other relevant metrics.
        this.tipsy = new Tipsy(this, { gravity: pos, title: text, className: className}); 
        me.tooltips.push(this.tipsy);
        this.tipsy.show();
      })
      // TODO: event might not be click, might be a custom handler / function call, or other type of DOM event
      .on("click.close",function(boxDOM){
        boxDOM.dispatchEvent(new MouseEvent('click', { 'view': window, 'bubbles': true, 'cancelable': true }));
        var seq = me.selectedTopic.tAnswer[0].sequence;
        if(seq && seq.length > me.answerSequencePos+1){
          me.removeTooltips();
          // the click event may trigger animation. wait a while
          setTimeout(function(){
            me.context_highlight(seq[++me.answerSequencePos]);
            me.createStencils();
          }, 700);
          return;
        }
        me.closePanel();
      });

    this.repositionHelpMenu();

    /* Can have unintended consqeuences: Tooltips on mouse-over on regular browser, etc
    ['click','mouseover','mouseout','mouseenter','mouseleave'].forEach(function(eType){
      X.on(eType,function(boxDOM){
        boxDOM.dispatchEvent(new MouseEvent(eType, { 'view': window, 'bubbles': true, 'cancelable': true }));
      })
    });
    */
  },
  /** -- */
  showPanel: function(){
    var me=this;
    document.onkeyup=function(e) {
      switch(event.keyCode){
        case 27: me.closePanel(); break; // escape
        case 37: if(me.browser.panel_overlay.attr("show")==="help-guidedtour") me.showTourStep_Prev(); break; // left
        case 39: if(me.browser.panel_overlay.attr("show")==="help-guidedtour") me.showTourStep_Next(); break; // right
      }
      if(event.keyCode===27){
        // escape key
        me.closePanel();
      }
    }
  },
  /** -- */
  closePanel: function(){
    var me = this;

    document.onkeyup=null; // remove keyup handler

    this.removeTooltips();
    this.closeTopic();
    this.browser.panel_overlay.attr("show","none");
    this.DOM.overlay_answer.on("mousemove.helpin",null).on("click.helpin",null);
    this.DOM.overlay_answer.selectAll(".stencilBox").remove();
    this.browser.DOM.kshfBackground.style("-webkit-mask-image",null);
  },
  /** -- */
  removeTooltips: function(){
    this.browser.DOM.root.selectAll(".tipsy").remove();
    kshf.activeTipsy = null;
    this.tooltips.forEach(function(t){ t.hide(); });
  },
  /** -- */
  closeTopic: function(){
    if(this.selectedTopic===null) return;

    this.browser.panel_overlay.attr("topicAnswer",null);
    this.browser.DOM.kshfBackground.style("-webkit-mask-image",null);

    this.DOM.SelectedThing_Content.selectAll("div").data([]).exit().remove();

    if(this.selectedTopic.isRelevant) {
      this.removeTooltips();
      this.DOM.overlay_answer.selectAll(".stencilBox").remove();
      if(this.context.HighlightedDOM_All.length>0){
        this.context.HighlightedDOM_All.forEach(function(DOM){ DOM.removeAttribute("helpin"); })
      }
      if(this.selectedTopic.deactivate) {
        this.selectedTopic.deactivate.call(this, this.selectedTopic);
      }
      this.selectedTopic.tAnswer.forEach(function(answer){
        if(answer.deactivate) answer.deactivate.call(this);
      },this);
    }

    this.selectedTopic = null;
  },
  /** -- */
  sortTopicsByRelevance: function(){
    // sort by relevance
    this.topicsList = this.topicsList.sort(function(a,b){ 
      if(a.isRelevant && !b.isRelevant) return -1;
      if(b.isRelevant && !a.isRelevant) return 1;
      var x = b.relevanceWeight - a.relevanceWeight; 
      if(x) return x;
      return b.id.localeCompare(a.id); // same weight, make sure sort is stable
    });
    // reorder topics list dom
    this.DOM.TopicBlock.data(this.topicsList, function(d){ return d.id; }).order();
  },
  /** -- */
  refreshTopicsOutOfContext: function(){
    this.topicsList.forEach(function(topic){
      topic.DOM.attr("outOfContext", topic.isRelevant?null:"true");
    });
  },
  /** -- */
  filterTopics: function(){
    var me=this;

    // evaluate context
    this.topicsList.forEach(function(topic){ this.evaluateContext(topic); },this);

    this.DOM.TopicText.html(function(topic){ return me.getTopicText(topic); } );

    this.DOM.TopicBlock.selectAll(".recentlyUsedIcon")
      .style("display",function(topic){ 
        return topic.usedPos===-1?"none":"block";
      })
      .style("opacity",function(topic){
        var l=me.topicHistory.length*1.0;
        return 0.2 + 0.8*(l-topic.usedPos)*(1/l);
      })
      ;

    this.sortTopicsByRelevance();
    this.refreshTopicsOutOfContext();
    
    var me=this;

    this.topicsList.forEach(function(topic){
      topic.displayed = true;
      // No answer defined yet
      if(topic.activate===undefined && topic.tAnswer.length===0){
        topic.DOM.style("color", "gray");
      }
      // Filter on relevance to the active interface
      if(topic.displayed){
//        topic.displayed = topic.isRelevant === this.qFilters.relevant;
        topic.DOM.attr("outOfContext", topic.isRelevant?null:"true");
        //if(!topic.isRelevant) d3.select(topic.DOM[0][0].parentNode.appendChild(topic.DOM[0][0]));
      }
      // Filter for selected actions
      if(topic.displayed && this.qFilters.actions.length>0){
        topic.displayed = this.qFilters.actions.every(function(selected){
          return topic.actions.some(function(actionName){ return actionName === selected.name; });
        });
      }
      // Filter for selected topics
      if(topic.displayed && this.qFilters.topics.length>0){
        topic.displayed = this.qFilters.topics.every(function(selected){
          return topic.topics.some(function(topicName){ return topicName === selected.name; });
        });
      }
      // Filter on text search
      if(topic.displayed && this.qFilters.textSearch!==""){
        topic.displayed = this.getTopicText(topic).toLowerCase().indexOf(this.qFilters.textSearch)!==-1;
      }
      if(this.filterRelevantOnly() && !topic.isRelevant){
        topic.displayed = false;
      }
      // Done
      topic.DOM.style("display", topic.displayed ? null : "none");
    },this);

    // Sort questions based on context relevance.

    this.updateQuestionTypes();
  },
  updateQuestionTypes: function(){
    this.actionsList.forEach(function(action){
      action.activeQ = 0;
      action.questions.forEach(function(q){ action.activeQ+=q.displayed; });
    });

    this.actionsList = this.actionsList.sort(function(action1,action2){ 
      if(action2.selected) return 1;
      if(action1.selected) return -1;
      var x = action2.activeQ - action1.activeQ;
      if(x) return x;
      return action2.name.localeCompare(action1.name);
    });

    this.DOM.ActionSelect.data(this.actionsList, function(action){ return action.name;} ).order()
      .style("display",function(action){ return action.activeQ>0 ? null : "none"; });
    this.DOM.ActionSelect.selectAll(".num").html(function(action){ return action.activeQ; });

    this.keywordsList.forEach(function(topic){
      topic.activeQ = 0;
      topic.questions.forEach(function(q){ topic.activeQ+=q.displayed; });
    });
    this.keywordsList = this.keywordsList.sort(function(topic1,topic2){ 
      if(topic2.selected) return  1;
      if(topic1.selected) return -1;
      var x = topic2.activeQ - topic1.activeQ;
      if(x) return x;
      return topic2.name.localeCompare(topic1.name);
    });
    this.DOM.TopicSelect.data(this.keywordsList, function(topic){ return topic.name;} ).order()
      .style("display",function(topic){ return topic.activeQ>0 ? null : "none"; });
    this.DOM.TopicSelect.selectAll(".num").html(function(topic){ return topic.activeQ; });
  },
  /** -- */
  getKshfDOMTree: function(pointedElement){
    var pointedDOMTree = [pointedElement];
    while(true){
      if(pointedElement.parentNode===undefined) break;
      if(pointedElement.parentNode.matches===undefined) break;
      if(pointedElement.parentNode.matches(".kshf")) break;
      pointedDOMTree.push(pointedElement.parentNode);
      pointedElement = pointedElement.parentNode;
    };
    return pointedDOMTree;
  },
  /** -- */
  learnAboutPointed: function(pointedDOM, traverse){
    var me=this;
    if(traverse===undefined) traverse = true;

    if(this.selectedTopic) this.closeTopic();

    this.DOM.TopicBlock.style("display","none");

    this.DOM.SelectedThing_Content_More.style("display","none");

    // EXTRACT POINTED FULL DOM TREE
    var pointedDOMTree = traverse ? this.getKshfDOMTree(pointedDOM) : [pointedDOM];

    // evaluate context to reset relevanceWeight
    this.topicsList.forEach(function(topic){ 
      topic.mostSpecific = false;
      this.evaluateContext(topic);
    },this);

    // Display related topics using topicsByDOMSelector on the complete DOM tree
    pointedDOMTree.forEach(function(dom,i){
      for(var selector in this.topicsByDOMSelector){
        if(dom.matches(".kshf "+selector)){
          this.topicsByDOMSelector[selector].forEach(function(topic){ 
            topic.DOM.style("display","block");
            topic.relevanceWeight += 1000*(pointedDOMTree.length-i);
            topic.mostSpecific = true;
          });
        }
      }
    },this);

    // Filter DOM tree before you show the overlays. (to relevant ones)
    var infoPrinted = false;
    var titlePrinted = false;
    this.DOM.SelectedThing_Content.html("");
    // Filter out DOM elements that do not match any component.

    pointedDOMTree = pointedDOMTree.filter(function(dom, i){
      for(var component in _material._components){
        if(dom.matches(_material._components[component].matches)) return true;
      }
      return false;
    });

    pointedDOMTree = pointedDOMTree.slice(0,2);

    if(pointedDOMTree.length===0){
      this.DOM.SelectedThing_Header.select(".hContent")
        .html("<i class='fa fa-hand-pointer-o'></i> Point to your area of interest</div>");
      this.DOM.SelectedThing_Content.html("No component matches the pointed area");
      return;
    }

    this.theComponent = null;
    this.theComponent_DOM = null;

    // process each matching components to detect related topics and print title / description.
    pointedDOMTree.forEach(function(dom, i){
      for(var componentName in _material._components){
        var x = _material._components[componentName];
        if(!dom.matches(x.matches)) continue;
        dom.__temp__ = componentName;
        dom.tooltipPos = "n";
        if(x.pos) dom.tooltipPos = x.pos;

        var keyword = this.keywordsIndexed[componentName];
        if(keyword){
          keyword.questions.forEach(function(topic){
            if(dom.__data__ instanceof kshf.Summary_Base){
              this.evaluateContext(topic, dom.__data__); // pass the summary object for focused evaluation
            }
            topic.mostSpecific = topic.mostSpecific || i===0;
            // prioritize topics about more specific components first.
            topic.relevanceWeight += 1000*(pointedDOMTree.length-i);
            topic.DOM.style("display","block");
          },this);
        }

        // Print title and description
        if(componentName && !titlePrinted){
          this.DOM.SelectedThing_Header
            .select(".hContent").html("<i class='fa fa-hand-pointer-o'></i> "+componentName+"</div>");
          this.theComponent = x;
          this.theComponent_DOM = dom;
        }
        if(x.info && !infoPrinted) {
          if(componentName){
            this.DOM.SelectedThing_Header
              .select(".hContent").html("<i class='fa fa-hand-pointer-o'></i> "+componentName+"</div>");
            titlePrinted = true;
          }
          this.DOM.SelectedThing_Content.html(x.info.call(this, dom));
          infoPrinted = true;
        }
      };
    },this);

    this.DOM.TopicText.html(function(topic){ return me.getTopicText(topic); } );


    this.sortTopicsByRelevance();
    this.refreshTopicsOutOfContext();
    this.DOM.TopicBlock.style("font-size",function(d){
      if(d.mostSpecific) return "0.9em";
    });

    // ADD DOM TREE BOXES

    pointedDOMTree.reverse();
    var bounds_browser = this.browser.DOM.root[0][0].getBoundingClientRect();

    var X = this.DOM.overlay_answer.selectAll(".stencilBox")
      .data(pointedDOMTree, function(d,i){ return i; });

    X.enter().append("div").attr("class","stencilBox");

    X.exit().each(function(){
      if(this.tipsy) this.tipsy.hide();
      // TODO: remove from tooltips
    }).remove();

    X.each(function(d){ 
      this.bounds = d.getBoundingClientRect();
      this.left   = this.bounds.left-bounds_browser.left-2;
      this.width  = this.bounds.width+4;
      this.top    = this.bounds.top-bounds_browser.top-2;
      this.height = this.bounds.height+4;
    })
    .style("left",  function(){ return this.left  +"px"; })
    .style("width", function(){ return this.width +"px"; })
    .style("top",   function(){ return this.top   +"px"; })
    .style("height",function(){ return this.height+"px"; })
    .each(function(d,i){
      this.skipStencil = (i!==0);
      // TODO: Pick up based on screen location (avoid edges) or other relevant metrics.
      var tipsyClass = "tipsy-helpin";
      if(i===pointedDOMTree.length-1) tipsyClass+=" tipsy-primary";
      if(this.tipsy===undefined){
        this.tipsy = new Tipsy(this, { gravity: d.tooltipPos, title: d.__temp__, className: tipsyClass}); 
        this.tipsy.pointedDOM = d;
        me.tooltips.push(this.tipsy);
        kshf.activeTipsy = null;
        this.tipsy.show();
      } else {
        //recycle existing tipsy
        if(this.tipsy.pointedDOM !== d){
          this.tipsy.options.title = d.__temp__;
          this.tipsy.options.className = tipsyClass;
          this.tipsy.options.gravity = d.tooltipPos;
          this.tipsy.jq_element = this;
          this.tipsy.pointedDOM = d;
          kshf.activeTipsy = null;
          this.tipsy.show();
        } else {
          this.tipsy.jq_tip.classed("tipsy-primary", (i===pointedDOMTree.length-1) ? "true" : null);
        }
      }

      this.tipsy.jq_tip.attr("locked",null);
      this.removeAttribute("locked");
    });

    this.createStencils();

    setTimeout(function(){ me.repositionHelpMenu(); }, 1000);    
  },
  /** -- */
  dynamicPointed: function(){
    this.DOM.overlay_answer.style("pointer-events","none");
    this.browser.panel_overlay.style("pointer-events","none");
    this.browser.DOM.kshfBackground.style("pointer-events","none");

    this.learnAboutPointed(document.elementFromPoint(d3.event.clientX, d3.event.clientY));

    // unroll pointer-event pass style - end of mousemove event
    this.DOM.overlay_answer.style("pointer-events",null);
    this.browser.panel_overlay.style("pointer-events",null);
    this.browser.DOM.kshfBackground.style("pointer-events",null);
  },
  /** -- */
  showPointNLearn: function(){
    var me=this;
    this.showPanel();

    if(this.selectedTopic) this.closeTopic();

    this.browser.panel_overlay.attr("show","helppointnlearn").attr("lockedPointNLearn",null);

    this.DOM.overlay_control.selectAll('[class^="helpInMode_"]').attr("active",null);
    this.DOM.overlay_control.select(".helpInMode_PointNLearn").attr("active",true);

    this.DOM.root
      .style({left: null, right: null, top: null, bottom: null})
      .attr("hideRelatedTopics",true);
    this.DOM.TopicBlock.style("display","none");

    this.lockedBox = false;

    this.DOM.SelectedThing_Header
      .select(".hContent").html("<i class='fa fa-hand-pointer-o'></i> Point to your area of interest</div>");
    this.DOM.SelectedThing_Content.html("");

    this.DOM.overlay_answer
      .on("click.helpin",function(){
        if(me.lockedBox){
          me.lockedBox.removeAttribute("locked");
          if(me.lockedBox.tipsy) me.lockedBox.tipsy.jq_tip.attr("locked",null);
          me.DOM.root.attr("hideRelatedTopics",true);
          me.browser.panel_overlay.attr("lockedPointNLearn",null);

          var component = _material._components[me.lockedBox.__data__.__temp__];
          if(component.onUnlock) {
            component.onUnlock.call(me,me.lockedBox.__data__);
            me.createStencils();
          }
          me.lockedBox = false;

          me.dynamicPointed();
        } else {
          me.lockedBox = d3.event.target;
          me.lockedBox.setAttribute("locked",true);
          if(me.lockedBox.tipsy) me.lockedBox.tipsy.jq_tip.attr("locked",true);
          me.DOM.root.attr("hideRelatedTopics",null)
          me.browser.panel_overlay.attr("lockedPointNLearn",true);

          if(me.theComponent.onLock) me.theComponent.onLock.call(me,me.lockedBox.__data__);
          me.checkBoxBoundaries();
        }
        d3.event.stopPropagation();
        d3.event.preventDefault();
      })
      .on("mousemove.helpin",function(){
        if(me.lockedBox || me.movingBox) return;
        d3.event.stopPropagation();
        d3.event.preventDefault();
        me.dynamicPointed();
      });
  },
  /** -- */
  closePointNLearn: function(){
    this.removeTooltips();
    this.DOM.overlay_answer.on("mousemove.helpin",null).on("mousemove.click",null);
    this.DOM.overlay_answer.selectAll(".stencilBox").remove();
    this.browser.DOM.kshfBackground.style("-webkit-mask-image",null);
  },
  /** -- */
  prepareGuidedTourSeq: function(){
    this.GuidedTourSeq = [];

    // if a guide is topic, do not need to define context, topic defines its own context

    this.GuidedTourSeq = [];
    _material._guideSteps.forEach(function(g){
      if(g.component){
        var x = _material._components[g.component];
        var m = this.browser.DOM.root.select(x.matches);
        if(m[0][0]!==null){
          this.GuidedTourSeq.push({dom: m[0][0]});
        }
      } else if(g.topic!==undefined){
        var _t = _material._topics[g.topic];
        this.evaluateContext(_t);
        // evaluate on context
        if(_t.isRelevant) {
          this.GuidedTourSeq.push({topic: _t});
        }
      }
    },this);
  },
  /** -- */
  showGuidedTour: function(){
    var me=this;

    this.showPanel();

    if(this.selectedTopic) this.closeTopic();

    this.browser.panel_overlay.attr("show","help-guidedtour");

    this.DOM.overlay_control.selectAll('[class^="helpInMode_"]').attr("active",null);
    this.DOM.overlay_control.select(".helpInMode_GuidedTour").attr("active",true);

    this.DOM.root.style({left: null, right: null, top: null, bottom: null});
    this.DOM.root.attr("hideRelatedTopics",true);
    this.DOM.TopicBlock.style("display","none");

    this.prepareGuidedTourSeq();

    this.DOM.GuidedTourProgressBar.selectAll(".GuidedTourOneStep")
      .data(new Array(this.GuidedTourSeq.length))
      .enter()
        .append("span").attr("class","GuidedTourStep GuidedTourOneStep")
        .style("width",function(d,i){ return i*(100/(me.GuidedTourSeq.length-1))+"%"; })
        .on("click",function(d,i){
          me.GuidedTourStep = i;
          me.showTourStep();
          return;
        })

    this.showTourStep();
  },
  /** -- */
  showResponse: function(response){
    if(this.theComponent){
      if(this.theComponent.onUnlock){
        this.theComponent.onUnlock.call(this,this.theComponent_DOM);
      }
    }
    if(response.dom){
      this.learnAboutPointed(response.dom,false/*don't traverse dom*/);
      if(this.theComponent.onLock){
        this.theComponent.onLock.call(this,response.dom);
      }
    } else if(response.topic){
      this.selectTopic(response.topic);
    }
  },
  /** -- */
  showTourStep: function(){
    this.showResponse(this.GuidedTourSeq[this.GuidedTourStep]);

    this.DOM.root.select(".TourStep.PreviousStep").style("display", (this.GuidedTourStep===0)?"none":null);
    this.DOM.GuidedTourCurrentStep.style("width",(this.GuidedTourStep/(this.GuidedTourSeq.length-1))*100+"%");
  },
  /** -- */
  showTourStep_Prev: function(){
    if(this.GuidedTourStep===0) return;
    --this.GuidedTourStep;
    this.showTourStep();
  },
  /** -- */
  showTourStep_Next: function(){
    if(this.GuidedTourStep===this.GuidedTourSeq.length-1) return;
    ++this.GuidedTourStep;
    this.showTourStep();
  },
  /** -- */
  repositionHelpMenu: function(){
    var margin = 40;
    var bounds_browser = this.browser.DOM.root[0][0].getBoundingClientRect();

    var initLeft  = this.DOM.root[0][0].offsetLeft; // position relative to parent
    var initTop   = this.DOM.root[0][0].offsetTop; // position relative to parent
    var boxWidth  = this.DOM.root[0][0].getBoundingClientRect().width;
    var boxHeight = this.DOM.root[0][0].getBoundingClientRect().height;
    var browserWidth  = bounds_browser.width;
    var browserHeight = bounds_browser.height;
    var maxLeft   = browserWidth  - margin - boxWidth;
    var maxTop    = browserHeight - margin - boxHeight;

    var x=this.DOM.root[0][0].getBoundingClientRect();
    var helpBox = {
      left:   x.left  - bounds_browser.left,
      right:  x.right - bounds_browser.left,
      top:    x.top   - bounds_browser.top,
      bottom: x.bottom   - bounds_browser.top,
    };

    var bestPos = null;
    var bestIntSize = browserHeight*browserWidth;

    var boxes = [];
    // add stencil boxes to avoid
    this.DOM.overlay_answer.selectAll(".stencilBox").each(function(){
      boxes.push({left: this.left, top: this.top, right: this.left+this.width, bottom: this.top+this.height});
    });
    // add tooltip boxes to avoid
    browser.DOM.root.selectAll(".tipsy").each(function(){
      var bounds = this.getBoundingClientRect();
      var left   = bounds.left-bounds_browser.left-2;
      var width  = bounds.width+4;
      var top    = bounds.top-bounds_browser.top-2;
      var height = bounds.height+4;
      boxes.push({left: left, top: top, right: left+width, bottom: top+height});
    });

    [ // Current position
      { left: initLeft, top: initTop },
      // Middle top
      { left: (browserWidth-boxWidth)/2, top: 60},
      // top right corner
      { left: maxLeft, top: margin},
      // bottom right corner
      { left: maxLeft, top: maxTop},
      // bottom left corner
      { left: margin, top: maxTop},
      // top left corner
      { left: margin, top: margin}
    ].some(function(pos, i){
      
      pos.right = pos.left + boxWidth;
      pos.bottom = pos.top + boxHeight;
      // Compute the total intersection size of the help box with highlight boxes
      var curIntSize = 0;
      
      // TODO
      boxes.forEach(function(box){
        var x_overlap = Math.max(0, Math.min(pos.right, box.right)  - Math.max(pos.left,box.left))
        var y_overlap = Math.max(0, Math.min(pos.bottom,box.bottom) - Math.max(pos.top ,box.top));
        curIntSize += x_overlap*y_overlap;
      },this);

      // if this new position intersects less, use this position
      if(curIntSize < bestIntSize) {
        bestPos = pos;
        bestIntSize = curIntSize;
      }
      return curIntSize===0; // stop traversal if we reached 0-intersection
    });

    // use the best position
    this.DOM.root[0][0].style.left = Math.min(maxLeft, Math.max(0, bestPos.left))+"px";
    this.DOM.root[0][0].style.top  = Math.min(maxTop, Math.max(0, bestPos.top))+"px";
  },
  /** --*/
  checkBoxBoundaries: function(){
    var margin = 10;
    var bounds_browser = this.browser.DOM.root[0][0].getBoundingClientRect();

    var initLeft  = this.DOM.root[0][0].offsetLeft; // position relative to parent
    var initTop   = this.DOM.root[0][0].offsetTop; // position relative to parent
    var boxWidth  = this.DOM.root[0][0].getBoundingClientRect().width;
    var boxHeight = this.DOM.root[0][0].getBoundingClientRect().height;
    var browserWidth  = bounds_browser.width;
    var browserHeight = bounds_browser.height;
    var maxLeft   = browserWidth  - margin - boxWidth;
    var maxTop    = browserHeight - margin - boxHeight;

    // use the best position
    this.DOM.root[0][0].style.left = Math.min(maxLeft, Math.max(0, initLeft))+"px";
    this.DOM.root[0][0].style.top  = Math.min(maxTop, Math.max(0, initTop))+"px";
  },
  /** -- */
  showNotification: function(){
    this.initDOM();
    // apply
    this.showResponse(this.notifyAction);
    this.clearNotification();
  }
  /** -- */
  clearNotification: function(){
    this.browser.DOM.notifyButton.style("display","none");
  }
};

