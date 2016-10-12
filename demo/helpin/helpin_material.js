
// The help material based for HelpIn with Keshif

var getMetricText = function(){
  switch(this.measureFunc){
    case 'Count': return "Number of " + this.recordName;
    case 'Sum'  : return "Total " + this.measureSummary.summaryName + " of " + this.recordName;
    case 'Avg'  : return "Average " + this.measureSummary.summaryName + " of " + this.recordName;
  }
}

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
    
    "<p><u>Example:</u> In absolute: <span class='bolder'>"+_active+"</span> "+this.browser.recordName+" "+
      "In percent: <span class='bolder'>"+Math.round(100*_active/_total)+"%"+"</span>"+
        " of the <span class='bolder'>"+_total+"</span> "+_filtered+this.browser.recordName+".</p>"+

    "<p>All summaries have the same measurement-label mode.</p>"+
    
    "<p>Percent values cannot be shown with "+
      "<span class='topicLink' topicName='T_ChangeMetric'>Average metric</span>.</p>"+

    "";
};

var visualScaleModeInfo = function(){ 
  var _p = "relative (%) active";
  var _a = "absolute"
  var mode       = this.browser.percentModeActive?_p:_a;
  var mode_other = this.browser.percentModeActive?_a:_p;
  return ""+
    "<p>Measurements are scaled visually as <span class='bolder'>"+mode+"</span> value. "+
    "The alternative is scaling as <span class='bolder'>"+mode_other+"</span> value.<p>"+
    "<p>Relative scale reveals trends on "+
      "<span class='bolder topicLink' topicName='T_SelectHighlight'>highlight</span> and "+
      "<span class='bolder topicLink' topicName='T_SelectCompare'>lock</span> selections.</p>"+
    "<p>All summaries have the same visual scale mode.</p>"+
    "";
};

var percentileInfo = "<p>Each block shows a percentile range, such as 20%-30%. "+
  "The median (%50) is shown using <b>|</b>.<br>"+
  "The percentile ranges towards the median are darker. "+
  "</p>"+
//  "<p>Point to a percentile block for more information.</p>"+
  "<p>This chart is not affected by "+
    "<span class='topicLink' topicName='T_ChangeMetric'>metric</span>, "+
    "<span class='topicLink' topicName='T_ChangeMeasureLabel'>measurement-label mode</span>, and "+
    "<span class='topicLink' topicName='T_ChangeVisualScale'>visual scale mode</span> settings.</p>";

var measureMetricInfo = function(){
  var alternative = "";
  switch(this.browser.measureFunc){
    case 'Count': alternative = "Sum or Average of a numeric attribute"; break;
    case 'Sum':   alternative = "Number of "+this.browser.recordName+", or Average of a numeric attribute"; break;
    case 'Avg':   alternative = "Number of "+this.browser.recordName+", or Sum of a numeric attribute"; break;
  }
  // TODO: respons to filtering state
  return ""+
    "<p>The charts and measurement labels show the selected metric for each category/range,"+
      " which is currently the <span class='bolder'>"+getMetricText.call(this.browser)+"</span>.</p>"+
    "<p>Other options are "+alternative+". "+
      "For example, you can see distributions of "+
        "<span class='bolder'>Average "+this.browser.getMeasurableSummaries()[0].summaryName+"</span> "+
        "across all the charts instead.</p>"+
    "<p>All summaries and charts show the same metric.</p>"+
    "";
};

var pickSelectedAggr = function(){
  var midP = this.records.length*0.5;
  var minV = midP*0.8, maxV = midP*1.2;
  var curMax = this.records.length;
  var hAggr;
  this.allAggregates.some(function(aggr){
    if(aggr.emptyRecordsAggregate) return false;
    if((typeof aggr.isVisible)!=="undefined" && !aggr.isVisible ) return false;
    if(aggr.DOM.aggrGlyph===undefined) return false;
    if(aggr.DOM.aggrGlyph.style.display === "none") return false;
    if(aggr.compared) return false; // lock-compare selection
    if(aggr.summary && aggr.summary.collapsed) return false;
    if(aggr.summary.isFiltered()) return false;
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
    if(aggr.emptyRecordsAggregate) return false;
    if((typeof aggr.isVisible)!=="undefined" && !aggr.isVisible ) return false;
    if(aggr.DOM.aggrGlyph===undefined) return false;
    if(aggr.DOM.aggrGlyph.style.display === "none") return false;
    if(aggr.summary && aggr.summary.collapsed) return false;
    if(aggr.summary.skipExplain) return false;
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
};

var intervalSummaryInfoFunc = function(DOM){
  var summary = DOM.__data__;
  var summaryName = summary.summaryName;
  var recordName = summary.browser.recordName;
  var _min = summary.printWithUnitName(summary.intervalRange.org.min);
  var _max = summary.printWithUnitName(summary.intervalRange.org.max);

  var str="";
  str+="<p>This summarizes the "+summaryName+" of "+recordName+".</p>";
  //str+="<p>The "+summaryName+" ranges from <span class='bolder'>"+_min+"</span> to <span class='bolder'>"+_max+"</span>.</p>";

  var encoding = "<p>";
  encoding += "<i class='fa fa-"+(summary.scaleType==='time'?'line':'bar')+"-chart'></i> ";
  encoding += "This "+(summary.scaleType==='time'?"line":"histogram")+" chart shows the ";
  if(this.browser.ratioModeActive) encoding+= "selected percentage of the ";
  encoding += getMetricText.call(this.browser);
  if(this.browser.ratioModeActive) encoding+= " among all "+recordName;
  encoding += " per "+summary.summaryName+" range.</p>";

  return str+encoding+
    ( summary.scaleType==='log' ? (
      "<p>The range bins are created using <span class='topicLink' topicName='T_BinScale'>log-scale</span> "+
        "which may be better fit for skewed data.</p>") : "")+
    ( summary.percentileChartVisible ? (
      "<p>The horizontal chart below shows the percentile-based distribution of "+summaryName+" of "+recordName+".</p>"
      ) : "")+
    "";
};

var printBreadcrumb = function(sType, summary, aggr){
  return "<span class='breadCrumb crumbMode_"+sType+"' ready='true'>"+
    "<span class='breadCrumbIcon fa'></span>"+
    "<span class='crumbText'>"+
      "<span class='bolder'>"+summary.summaryName+"</span>: "+
      summary.printAggrSelection(aggr)+"</span></span>";
};

var printBreadcrumb_Dummy = function(sType, _name, _value){
  return "<span class='breadCrumb crumbMode_"+sType+"' ready='true'>"+
    "<span class='breadCrumbIcon fa'></span>"+
    "<span class='crumbText'>"+
      "<span class='bolder'>"+_name+"</span>: "+_value+"</span></span>";
};

var aggrDescription = function(aggr, encodingIcon){
  var summary = aggr.summary;

  var recordName = this.browser.recordName;
  var aggrLabel = summary.printAggrSelection(aggr);
  var globalActive = browser.allRecordsAggr.recCnt.Active.toLocaleString();

  var _metric = getMetricText.call(this.browser);

  var str='';

  var _temp = this.browser.percentModeActive;

  if(this.browser.ratioModeActive && this.browser.percentModeActive){
    this.browser.percentModeActive = false;
  }

  var measureLabel = this.browser.getMeasureLabel(aggr,summary);

  str += "<p>";
  if(this.browser.percentModeActive){
    // Percent labels
    str += measureLabel + " of " + _metric + " in ";
    if(this.browser.isFiltered()) str += globalActive + " filtered ";
    str += recordName + " are in " + aggrLabel + " " + summary.summaryName;
  } else {
    // Absolute labels
    str += "There are <span class='bolder'>"+measureLabel+" "+_metric + "</span> in ";
    str += " <i>" + aggrLabel + " " + summary.summaryName + "</i>";
    if(this.browser.isFiltered()) str += ", among the " + globalActive + " filtered "+ recordName;
  };
  str += ".</p>";

  this.browser.percentModeActive = _temp;

  var encoding = "<p>"+
    "Block "+(encodingIcon==="fa-arrows-h"?"width":"height")+" shows the ";
  if(this.browser.ratioModeActive) encoding+= "selected percentage of ";
  encoding += _metric;
  if(this.browser.ratioModeActive) encoding+= " among all "+recordName;
  encoding += " with <i>"+ aggrLabel+" "+summary.summaryName+"</i>.";
  encoding += "</p>";

  var simpleMeasure = "";
  switch(this.measureFunc){
    case 'Sum'  : simpleMeasure =  "Total " + this.measureSummary.summaryName; break;
    case 'Avg'  : simpleMeasure =  "Average " + this.measureSummary.summaryName; break;
  }

  function addEncoding(sType,sWord){
    this.browser.measureLabelType = sType;
    var measureLabel = this.browser.getMeasureLabel(aggr,summary);
    encoding+="<div class='encodingInfo'><span class='colorCoding_"+sType+"'></span> "
      +" "+sWord+recordName+" : <span class='bolder'>"+measureLabel+"</span> "+simpleMeasure+"</div>";
  };

  encoding += "<p>Measurements are color coded by selection type.</p>";

  if(!this.browser.ratioModeActive){
    // Total and filtered only apply when part-of mode is not active.
    addEncoding.call(this,"Active",""+(this.browser.isFiltered()?"Filtered ":"All "));
    if(this.browser.isFiltered()) addEncoding.call(this,"Total","All ");
  }

  ["Highlight","Compare_A","Compare_B","Compare_C"].forEach(function(sType){
    if(this.browser.selectedAggr[sType]){
      var _aggr = this.browser.selectedAggr[sType];
      addEncoding.call(this, sType, printBreadcrumb(sType,_aggr.summary,_aggr));
    } else {
      //var m = (sType==="Highlight") ? "Highlighted" : "Compared";
      //encoding+="<div class='encodingInfo'><span class='colorCoding_"+sType+"'></span> "+m+" "+recordName+" : - </div>";
      }
  },this);

  this.browser.measureLabelType = null;

  return str + encoding;
};

var _material = {
  _contextFeatures: {
    True: {
      descr: "Always true",
      v: function(){ return true; },
      weight: 0
    },
    False: {
      descr: "Always false",
      v: function(){ return false; },
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
      fixBy: 'T_ChangeMetric', // change metric
    },
    ActiveCompareSelection: {
      descr: "There is an active <i class='fa fa-lock'></i> locked-selection.",
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
      weight: 40,
      fixBy: 'T_SelectFilter'
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
      matches: '.kshfSummary[summary_type="interval"][viewtype="bar"]:not([collapsed])', 
      info: intervalSummaryInfoFunc,
      pos: "s"
    },
    "Time Summary" : {
      matches: '.kshfSummary[summary_type="interval"][viewtype="line"]:not([collapsed])', 
      info: intervalSummaryInfoFunc,
      pos: "s"
    },
    "Categorical Summary": {
      matches: '.kshfSummary[summary_type="categorical"]:not([collapsed])', 
      info: function(DOM){
        var summary    = DOM.__data__;
        var recordName = this.browser.recordName;
        return ""+
          "<p>This summarizes the "+summary.summaryName+" of "+recordName+".</p>"+
          "<p>It includes <span class='bolder'>"+summary._aggrs.length+"</span> categories.</p>"+
          "<p>"+
            "<i class='fa fa-bar-chart fa-histogram-flip'></i> "+
            "This chart shows the "+
            (this.browser.ratioModeActive ? "selected percentage of the " : "" )+
            getMetricText.call(this.browser)+" "+
            (this.browser.ratioModeActive ? ("among all "+recordName) : "" )+
            " for each " + (summary.isMultiValued?"of the":"") + " " + summary.summaryName + ".</p>";
      },
      pos: "s"
    },
    "Set Summary": {
      matches: '.kshfSummary.setPairSummary', 
      info: function(DOM){
        return "This charts shows the intersections across all categories."
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
          "<i>"+sortingSummaryName+"</i> (active sorting option): "+this.browser.recordDisplay.getSortingLabel(r)+".</p>";
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
        return intro+ranking+encoding+
          "<p>When you mouse over one of the "+this.browser.recordName+", its values are highlighted.</p>"
          "";
      },
      onLock: function(DOM){
        var record = DOM.__data__;
        record.highlightRecord();

        // categories
        this.context.HighlightedDOM = this.browser.DOM.root
          .selectAll('[catselect="onRecord"] > .catLabelGroup, .recordValueText-v').nodes();
        this.fHighlightBox("All values of<br> the selected record<br> are highlighted<br> on mouse over",
            "s","",false,"deEmph");

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
    "Range Scale Type": {
      matches: ".summaryConfig_ScaleType"
    },
    "Aggregate": {
      matches: '.kshfSummary:not([collapsed]) .aggrGlyph'
    },
    "Category": { 
      matches: '.kshfSummary:not([collapsed]) .catGlyph', 
      pos:"se",
      info: function(DOM){
        return aggrDescription.call(this,DOM.__data__, "fa-arrows-h");
      },
    },
    "Range": { 
      matches: '.kshfSummary:not([collapsed]) .rangeGlyph', 
      pos: "e",
      info: function(DOM){
        return aggrDescription.call(this,DOM.__data__, "fa-arrows-v");
      }
    },
    "Numeric Range": { 
      matches: '.kshfSummary:not([collapsed])[viewtype="bar"] .rangeGlyph', 
      pos: "e",
      info: function(DOM){
        return aggrDescription.call(this,DOM.__data__, "fa-arrows-v");
      }
    },
    "Time Range": { 
      matches: '.kshfSummary:not([collapsed])[viewtype="line"] .rangeGlyph', 
      pos: "e",
      info: function(DOM){
        return aggrDescription.call(this,DOM.__data__, "fa-arrows-v");
      }
    },
    "Percentile Chart": {
      matches: '.kshfSummary:not([collapsed]) .percentileGroup:not([percentileChartVisible="false"])', 
      pos: "s",
      info: function(DOM){
        var summary = DOM.__data__;
        var summaryName = "<span class='bolder'>"+summary.summaryName+"</span>";
        var recordName = this.browser.recordName;
        return ""+
          "<p>This chart shows the percentile distribution of "+summaryName+" of "+recordName+".</p>"+
          percentileInfo;
      },
    },
    "Percentile Range": { 
      matches: '.kshfSummary:not([collapsed]) .aggrGlyph.quantile', 
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
        str+=this.browser.isFiltered()?"<i>filtered</i> ":"";
        var sType = DOM.parentNode.className.substr(16); // "Active", "Highlight", "Compare_A", etc...
        if(sType==="Compare_A" || sType==="Compare_B" || sType==="Compare_C"){
          var comparedAggr = this.browser.selectedAggr[sType];
          str += printBreadcrumb(sType,comparedAggr.summary,comparedAggr);
          //str+= // Select Compare_A aggregate, etc
        }
        str+=recordName+": </p>";

        str+="<p><span class='bolder'>"+perct_num[0]+"%</span> have "+summaryName+" < " + minV+" , and <br>";
        str+="<span class='bolder'>"+perct_num[1]+"%</span> have "+summaryName+" < " + maxV+".</p>";
        str+="<p>This range groups the <span class='bolder'>10%</span> ("+numRecords+") "+recordName+" in between.</p>";
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

        var filterSel = this.browser.DOM.breadcrumbs.selectAll(".crumbMode_Filter").nodes().length;
        if(filterSel===0) filterSel = "none";

        var str = '';

        str += "<p>";
        str += "In this " + (this.browser.isFiltered()?"<i>filtered</i>":"")+ " dataset, ";
        if(this.browser.measureFunc==='Count'){
          str += "there are " + measureLabel + " " + this.browser.recordName;
        } else {
          str += this.browser.recordName+" have " + measureLabel + " ";
          if(this.browser.measureFunc==="Sum") str += "Total"; else str += "Average";
          str += " "+ this.browser.measureSummary.summaryName + " ";
        }
        str += ".</p>";

        str+="<p>This section shows the global measurement of "+this.browser.recordName+", reflecting the "+
          "<span class='topicLink' topicName='T_ChangeMetric'>selected metric</span> "+
          "<span style='color:gray'>(the "+getMetricText.call(this.browser)+")</span> and "+
          "filters <span style='color:gray'>(currently "+filterSel+")</span>.</p>";

        return str;
      }
    },
    "Metric": { 
      matches: ".measureFuncSelect",
      pos: "nw",
      info: function(){
        return measureMetricInfo()+
          "<p>You can change the metric by clicking on <i class='fa fa-cubes'></i> and then choosing another option.<p>";
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
        var totalSel = this.browser.DOM.breadcrumbs.selectAll(".breadCrumb").nodes().length;
        var filterSel = this.browser.DOM.breadcrumbs.selectAll(".crumbMode_Filter").nodes().length;
        var compareSel = this.browser.DOM.breadcrumbs.selectAll('[class*="crumbMode_Compare_"]').nodes().length;
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
          case "crumbMode_Compare_A": x="<i class='fa fa-lock'></i> locked-"; break;
          case "crumbMode_Compare_B": x="<i class='fa fa-lock'></i> locked-"; break;
          case "crumbMode_Compare_C": x="<i class='fa fa-lock'></i> locked-"; break;
          case "crumbMode_Filter":    x="<i class='fa fa-filter'></i> filtered-";  break;
          default: x = "<i class='fa fa-mouse-pointer'></i> highlighted-"; break;
        };
        return "<p>This breadcrumb shows an active "+x+"selection.</p>";
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
    "Record Rank Label":{
      matches: '.kshfRecord > .recordSortCol'
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
    { component: 'Global Measurement' },
    { component: 'Categorical Summary' },
    { component: 'Category' },
    { component: 'Time Summary' },
    { component: 'Number Summary' },
    { component: 'Numeric Range' },
    { component: 'Percentile Chart' },
    { topic:     'T_SelectHighlight' },
    { topic:     'T_SelectFilter' },
    { topic:     'T_SelectCompare' },        
    { component: 'Metric' },
    { topic:     'T_ChangeVisualScale' },
    { topic:     'T_ChangeMeasureLabel' },
    { topic:     'T_RecSortChange' },
    //{ component: 'Breadcrumbs' },
    //{ topic:     'T_ExploreMissingVal' },
    //{ component: 'Help Button' },
  ],

_topics: {
  T_SelectHighlight: {
    q: function(){
      return "Highlight-select to preview "+this.browser.recordName+"";
    },
    actions: "Explore+Select",
    topics: "Aggregate",
    context: ["SummaryInBrowser", "OpenSummary"],
    weight: 3,
    media: "T_SelectHighlight.gif",
    note: function(){
      var str="";
      str += "<p>You can highlight "+this.browser.recordName+" in categories or number/time ranges. ";
      if(!exp_basis) str+="As an example, one aggregate is highlighted.";
      str += "</p>"

      var breadcrumb;
      if(exp_basis){
        breadcrumb = printBreadcrumb_Dummy("Highlight","Summary Name","Value");
      } else {
        breadcrumb = printBreadcrumb("Highlight",this.context.highlightedSummary, this.context.highlightedAggregate);
      }
      
      str+="<p>"+breadcrumb+"breadcrumb on the top section shows the highlighted-selection. "+
      "Highlighted "+this.browser.recordName+" are shown in "+
        "<span style='color: orangered; font-weight: 500;'>orange</span> across all summaries.</p>"+
      "<p>You can observe highlighted records in groups in other summaries, as well as individually.</p>"+
      "";
      return str;
    },
    similarTopics: ['T_SelectFilter','T_SelectCompare'],
    tAnswer: "Mouse over an aggregate",
    activate: function(){
      var hAggr = pickSelectedAggr.call(this.browser);
      this.context.highlightedAggregate = hAggr;
      this.context.highlightedSummary = hAggr.summary;
      
      // Highlight the selected aggregate ***********************************************
      this.context.HighlightedDOM = [this.context.highlightedAggregate.DOM.aggrGlyph];
      this.fHighlightBox("Mouse over an aggregate","n","tipsy-primary2");
    },
    animate: {
      // Highlight aggregate ************************************************************
      1: function(){
        this.context.HighlightedDOM[0].stencilBox.append("div")
          .attr("class","pointerAction").append("span").attr("class","fa fa-mouse-pointer").style("font-size","0.7em");
        this.context.highlightedSummary.onAggrHighlight(this.context.highlightedAggregate);
        this.repositionHelpMenu();
      },
      // Show breadcrumb *****************************************************************
      3: function(){
        this.context.HighlightedDOM = [ this.browser.crumb_Highlight.DOM.node() ];
        this.fHighlightBox("This breadcrumb shows the highlighted-selection.","n","",false,"deEmph");
      },
      // Show the other (explain) aggregate *********************************************
      4.5: function(){
        var _aggr = pickExplainAggr.call(this.browser,'Highlight');
        this.context.HighlightedDOM = [_aggr.DOM.aggrGlyph];
        // TODO: make the tooltip responsive to visual scale, metric, label
        this.fHighlightBox(
          "Highlighted "+this.browser.recordName+"</span> are shown<br> in "+
            "<span style='color: orangered; font-weight: 500;'>orange</span> across all summaries."
          +"<br>"
          +"<div style='margin-top: 6px'>For example, "+_aggr.summary.printAggrSelection(_aggr)+" has <br>"+
            "<span class='bolder'>"+_aggr._measure.Highlight+"</span> "+
              printBreadcrumb("Highlight", this.context.highlightedSummary, this.context.highlightedAggregate)+
              this.browser.recordName+".</div>"
          ,"n","",false,"deEmph");
      },
      // Show highlighted records *******************************************************
      6: function(){
        if(this.browser.recordDisplay.recordViewSummary===null) return;
        this.context.HighlightedDOM = [];
        var minY = this.browser.recordDisplay.DOM.recordGroup.node().scrollTop;
        var maxY = minY + this.browser.recordDisplay.DOM.recordGroup.node().offsetHeight;
        this.browser.selectedAggr.Highlight.records.some(function(record){
          if(!record.isWanted) return false;
          var DOM = record.DOM.record;
          if( typeof DOM === 'undefined' ) return false;
          if( DOM.style.display === "none") return false;
          if( DOM.offsetTop < minY) return false;
          if( DOM.offsetTop+DOM.offsetHeight > maxY) return false;
          this.context.HighlightedDOM.push(record.DOM.record);
          return true;
        },this);
        this.fHighlightBox(
          "Highlighted "+
          printBreadcrumb("Highlight", this.context.highlightedSummary, this.context.highlightedAggregate) +
          this.browser.recordName+" <br> change their background color.","n","",false,"deEmph");
      }
    },
    deactivate: function(){
      this.context.highlightedSummary.onAggrLeave(this.context.highlightedAggregate);
      this.context.highlightedSummary   = undefined;
      this.context.highlightedAggregate = undefined;
    },
  },
  T_SelectFilter: {
    q: function(){
      return "Filter-select to focus on selected "+
        this.browser.recordName;
    },
    actions: "Explore+Filter+Select",
    topics: "Aggregate",
    context: ["SummaryInBrowser", "OpenSummary"],
    weight: 4,
    similarTopics: ['T_SelectHighlight','T_SelectCompare','T_FilterAnd'],
    media: "T_SelectFilter.gif",
    note: function(){
      var str = "";

      str += "<p>You can filter "+this.browser.recordName+" in categories or number/time ranges.</p>";

      if(!exp_basis) str += "<p>As an example, one aggregate is filtered. ";
      
      var breadcrumb;
      if(exp_basis){
        breadcrumb = printBreadcrumb_Dummy("Filter","Summary Name","Value");
      } else {
        breadcrumb = printBreadcrumb("Filter",this.context.highlightedSummary, this.context.highlightedAggregate);
      }
      
      str += ""+breadcrumb+"breadcrumb on the top section shows the filtered-selection.</p>"+ 

        "<p>"+this.browser.recordName+" that don't satisfy the selection are removed from the data browser.</p>"+
        //"<p>Use filtering to explore "+this.browser.recordName+" using multiple summaries.</p>"+
        "<p>Filtering on multiple summaries is merged with  <span class='AndOrNot_And'>And</span>.</p>"+
        "";
      return str;
    },
    tAnswer: {
      sequence: [
        "Mouse over an aggregate",
        "Click on the highlighted aggregate"
      ]
    },
    activate: function(){
      var hAggr = pickSelectedAggr.call(this.browser);
      this.context.highlightedAggregate = hAggr;
      this.context.highlightedSummary = hAggr.summary;
      
      // Highlight the selected aggregate ***********************************************
      this.context.HighlightedDOM = [this.context.highlightedAggregate.DOM.aggrGlyph];
      this.fHighlightBox("1) Mouse over an aggregate to highlight","n","tipsy-primary2");
    },
    animate: {
      0.5: function(){
        this.context.HighlightedDOM[0].stencilBox.append("div")
          .attr("class","pointerAction").append("span").attr("class","fa fa-mouse-pointer");
        this.context.highlightedSummary.onAggrHighlight(this.context.highlightedAggregate);
      },
      // Show the action ****************************************************************
      2.5: function(){
        this.context.HighlightedDOM[0].stencilBox.append("div")
          .attr("class","pointerAction").append("span").attr("class","fa fa-bullseye");
        this.fHighlightBox("2) Click on the highlighted aggregate","s","tipsy-primary2",true);
//        this.context.highlightedSummary.onAggrLeave(this.context.highlightedAggregate);
        this.context.highlightedAggregate.DOM.aggrGlyph.dispatchEvent(new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        }));
      },
      // Show breadcrumb ****************************************************************
      5: function(){
        this.context.HighlightedDOM = [ this.context.highlightedSummary.summaryFilter.filterCrumb.DOM.node() ];
        this.fHighlightBox("This breadcrumb shows the filtered-selection.","n","",false,"deEmph");
      },
      // Show the other (explain) aggregate **************************************
      6.5: function(){
        var _aggr = pickExplainAggr.call(this.browser,'Active');
        this.context.HighlightedDOM = [_aggr.DOM.aggrGlyph];
        // TODO: make the tooltip context dependent. - visual scale, metric, label
        this.fHighlightBox(
          "Remaining "+this.browser.recordName+" are shown<br> across all summaries.<br>"+
          "<div style='margin-top: 6px'>For example, "+_aggr.summary.printAggrSelection(_aggr)+ " has <br>"+
          "<span class='bolder'>"+_aggr._measure.Active+"</span> remaining "+this.browser.recordName+".</div>"
          ,"n","",false,"deEmph");
      },
      7.5: function(){
        if(this.browser.recordDisplay.recordViewSummary===null) return;
        this.context.HighlightedDOM = [];
        var minY = this.browser.recordDisplay.DOM.recordGroup.node().scrollTop;
        var maxY = minY + this.browser.recordDisplay.DOM.recordGroup.node().offsetHeight;
        var selRecord = null;
        this.browser.records.some(function(record){
          if(!record.isWanted) return false;
          var DOM = record.DOM.record;
          if( typeof DOM === 'undefined' ) return false;
          if( DOM.style.display === "none") return false;
          if( DOM.offsetTop < minY) return false;
          if( DOM.offsetTop+DOM.offsetHeight > maxY) return false;
          selRecord = record;
          this.context.HighlightedDOM.push(record.DOM.record);
          return true;
        },this);

        this.fHighlightBox(
          "All remaining "+this.browser.recordName+" satisfy the new filtering selection."
//          "For example, "+this.browser.recordDisplay.recordViewSummary.summaryFunc.call(selRecord.data, selRecord)+
//            " satisfies ",
          ,"n","",false,"deEmph");
      }
    },
    deactivate: function(){
      this.context.highlightedSummary.summaryFilter.clearFilter();
      this.context.highlightedSummary.onAggrLeave(this.context.highlightedAggregate);
    },
  },
  T_SelectCompare: {
    q: function(){
      return "Lock-select to compare groups of "+this.browser.recordName; 
    },
    actions: "Explore+Compare+Select",
    topics: "Aggregate",
    context: ["SummaryInBrowser", "OpenSummary"],
    weight: 5,
    similarTopics: ['T_SelectFilter','T_UnlockSelection'],
    media: "T_SelectCompare.gif",
    note: function(){
      var str = "";

      str += "<p>You can lock "+this.browser.recordName+" in categories or number/time ranges. "+
        "At most <span class='bolder'>3</span> color-coded locked-selections are possible ("+
        "<span class='colorCoding_Compare_A fa fa-lock'></span> "+
        "<span class='colorCoding_Compare_B fa fa-lock'></span> "+
        "<span class='colorCoding_Compare_C fa fa-lock'></span>)."+
        "</p>";
      
      if(!exp_basis) str+="<p>As an example, one aggregate is locked. ";
      
      var breadcrumb;
      if(exp_basis){
        breadcrumb = printBreadcrumb_Dummy("Compare_A","Summary Name","Value");
      } else {
        breadcrumb = printBreadcrumb("Compare_A", this.context.highlightedSummary, this.context.highlightedAggregate);
      }
      
      str += ""+breadcrumb+"breadcrumb on the top section shows the locked-selection.</p>"+

      "<p>Locked "+this.browser.recordName+" are shown across all summaries. "+
        "You can quickly compare "+this.browser.recordName+" in "+
        "<span class='bolder'>locked</span> and <span class='bolder'>highlighted</span> selections"+
        " by moving the mouse.</p>"+

      "<p>Changing filtering will clear locked selections.</p>"+
      
      "";
      return str;
    },
    tAnswer: {
      sequence: [
        "Mouse over an aggregate",
        " Click the lock (<i class='fa fa-lock'></i>) icon <br> Or<br> Shift+Click the aggregate"
      ]
    },
    activate: function(){
      var hAggr = pickSelectedAggr.call(this.browser);
      this.context.highlightedAggregate = hAggr;
      this.context.highlightedSummary = hAggr.summary;

      // Highlight the selected aggregate ***********************************************
      this.context.HighlightedDOM = [this.context.highlightedAggregate.DOM.aggrGlyph];
      this.fHighlightBox("1) Mouse over an aggregate to highlight","n","tipsy-primary2");
    },
    animate: {
      0.5: function(){
        this.context.HighlightedDOM[0].stencilBox.append("div")
          .attr("class","pointerAction").append("span").attr("class","fa fa-mouse-pointer").style("font-size","0.7em");
        this.context.highlightedSummary.onAggrHighlight(this.context.highlightedAggregate);
      },
      2.5: function(){
        this.context.HighlightedDOM = [
          d3.select(this.context.highlightedAggregate.DOM.aggrGlyph).select(".lockButton").node()];
        this.fHighlightBox("2) Click the lock icon <br>Or Shift+Click the aggregate","s","tipsy-primary2",true);

        this.context.HighlightedDOM[0].stencilBox.append("div")
          .attr("class","pointerAction").append("span").attr("class","fa fa-bullseye").style("font-size","0.7em");

        this.context.fakeCompare = this.browser.setSelect_Compare(true);
        this.context.highlightedSummary.onAggrLeave(this.context.highlightedAggregate);
      },
      // Show breadcrumb ****************************************************************
      4.5: function(){
        this.context.HighlightedDOM = [ this.browser['crumb_Compare_'+this.context.fakeCompare].DOM.node() ];
        this.fHighlightBox("This breadcrumb shows the locked-selection.","n","",false,"deEmph");
      },
      // Show the other (explain) aggregate *********************************************
      6: function(){
        var cT = this.context.fakeCompare;
        var _aggr = pickExplainAggr.call(this.browser,'Compare_'+cT);
        this.context.HighlightedDOM = [_aggr.DOM.aggrGlyph];
        // TODO: make the tooltip context dependent. - visual scale, metric, label
        this.fHighlightBox(
          "Locked "+this.browser.recordName+" are shown<br> in "+
            "<span class='colorText_Compare_"+cT+"' style='font-weight: 700;'>color</span> across all summaries."+
          "<br>"+
          "<div style='margin-top: 6px'>For example, "+_aggr.summary.printAggrSelection(_aggr)+ " has <br>"+
          "<span class='bolder'>"+_aggr._measure['Compare_'+cT]+"</span> "+
            printBreadcrumb("Compare_"+cT, this.context.highlightedSummary, this.context.highlightedAggregate) +
            this.browser.recordName+"."
          ,"n","",false,"deEmph");
      },
      // 
      7.5: function(){
        if(this.browser.recordDisplay.recordViewSummary===null) return;
        var cT = this.context.fakeCompare;
        this.context.HighlightedDOM = [];
        var minY = this.browser.recordDisplay.DOM.recordGroup.node().scrollTop;
        var maxY = minY + this.browser.recordDisplay.DOM.recordGroup.node().offsetHeight;
        this.browser.selectedAggr['Compare_'+cT].records.some(function(record){
          if(!record.isWanted) return false;
          if(!record.selectCompared[cT]) return false;
          var DOM = record.DOM.record;
          if( typeof DOM === 'undefined' ) return false;
          if( DOM.style.display === "none") return false;
          if( DOM.offsetTop < minY) return false;
          if( DOM.offsetTop+DOM.offsetHeight > maxY) return false;
          this.context.HighlightedDOM.push(record.DOM.record);
          return true;
        },this);
        this.fHighlightBox("Locked "+
          printBreadcrumb("Compare_"+cT, this.context.highlightedSummary, this.context.highlightedAggregate) +
          this.browser.recordName+" <br> change their background color.","n","",false,"deEmph");
      },
      //
      9: function(){
        // pick a new aggregate
        var _aggr = pickSelectedAggr.call(this.browser);
        this.context.tempAggr = _aggr;
        _aggr.summary.onAggrHighlight(_aggr);

        this.context.HighlightedDOM = [ _aggr.DOM.aggrGlyph ];
        this.fHighlightBox("Select other aggregates<br> to compare with locked "+this.browser.recordName,
          "n","",false,"deEmph");
      },
    },
    deactivate: function(){
      if(this.context.tempAggr) {
        this.context.tempAggr.summary.onAggrLeave(this.context.tempAggr);
        this.context.tempAggr = undefined;
      }
      this.context.highlightedSummary.onAggrLeave(this.context.highlightedAggregate);
      this.browser.clearSelect_Compare(this.context.fakeCompare);
    },
  },
  T_UnlockSelection: {
    q: "Unlock a locked-selection <i class='fa fa-lock'></i>",
    actions: "Explore+Select",
    topics: "Aggregate+Compared Measure+Compare Selection",
    context: ["SummaryInBrowser", "ActiveCompareSelection"],
    similarTopics: ['T_SelectCompare'],
    media: "T_UnlockSelection.gif",
    note: "Changing filtering also removes all locked-selections.",
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
    media: "T_FilterAnd.gif",
    note: ""+
      "<p>And-selection is possible <i>only if</i> records have multiple categorical values.</p>"+
      "<p>Only categories which have some active records can be clicked.</p>",
    similarTopics: ['T_SelectFilter','T_RemoveCatFilter'],
    tAnswer: {
      matches: '.kshfSummary[isMultiValued="true"][filtered] .catGlyph:not([NoActiveRecords])',
      cElement: "summaries",
      text: "Click on a category",
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
    media: "T_FilterOr.gif",
    note: function(){
      return "<p>You can filter "+this.browser.recordName+" based on multiple alternative categories.</p> "+
        "<p>After a category is filtered, mouse over a second category and click <span class='AndOrNot_Or'>Or</span>.";
    },
    similarTopics: ['T_SelectFilter','T_RemoveCatFilter'],
    tAnswer: {
      matches: '.catGlyph:not([cfiltered])',
      cElement: "summaries",
      text: "Mouse over a category<br>and click <span class='AndOrNot_Or'>Or</span>",
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
    media: "T_FilterNot.gif",
    tAnswer: {
      sequence: [
        "Mouse over an aggregate",
        "Click on <span class='AndOrNot_Not'>Not</span>"
      ]
    },
    activate: function(){ 
      var hAggr = pickSelectedAggr.call(this.browser);
      this.context.highlightedAggregate = hAggr;
      this.context.highlightedSummary = hAggr.summary;
      
      // Highlight the selected aggregate ***********************************************
      this.context.HighlightedDOM = [this.context.highlightedAggregate.DOM.aggrGlyph];
      this.fHighlightBox("1) Mouse over an aggregate","n","tipsy-primary2");
      
      this.context.HighlightedDOM[0].setAttribute("mouseOver",true);
    },
    animate: {
      1: function(){
        this.context.highlightedSummary.onAggrHighlight(this.context.highlightedAggregate);
      },
      2: function(){
        this.context.HighlightedDOM[0].stencilBox.append("div")
          .attr("class","pointerAction").append("span").attr("class","fa fa-bullseye");
      },
      2.5: function(){
        this.context.HighlightedDOM = [
          d3.select(this.context.highlightedAggregate.DOM.aggrGlyph).select(".AndOrNot_Not").node()];
        this.fHighlightBox("2) Click on <span class='AndOrNot_Not'>Not</span>","s","tipsy-primary2",true);
      },
      3.5: function(){
        this.context.highlightedSummary.onCatEnter_NOT(this.context.highlightedAggregate);
      }
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
    media: "T_AdjustFilterRange.gif",
    tAnswer: [
      { matches: ".controlLine > .base.active", 
        cElement: "summaries", 
        text: "Click & drag the range<br> to move it forward/backward", 
        pos: "n" },
      { class: "rangeHandle", 
        cElement: "summaries", 
        text: "Click & drag the end-points<br> to adjust the limits",
        pos: "s" }
    ],
  },
  T_SaveFiltering: {
    q: function(){
      return "Save filtered "+this.browser.recordName+" <i class='fa fa-filter'></i> as a new aggregate";
    },
    actions: "Explore+Save+Filter",
    topics: "Filter Selection",
    context: ["SummaryInBrowser", "FilteredSummary"],
    media: "T_SaveFiltering.png",
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
    similarTopics: ['T_RecordTextSearch'],
    media: "T_CategoryTextSearch.gif",
    note: "The categories that match will be used to filter records.",
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
    similarTopics: ['T_CategoryTextSearch'],
    media: "T_RecordTextSearch.gif",
    note: "If you type multiple words, you can specify if <b>all</b> or <b>some</b> words need to match a record.",
    tAnswer: {
      class: "recordTextSearch",
      cElement: "recordDisplay",
      text: function(){
        return "<b>Type your text search above "+this.browser.recordName+".</b><br><br>"+
          "Matching records will be highlighted as you type.<br><br>"+
          "<b>Enter</b> to filter.<br>"+
          "<b>Shift+Enter</b> to compare.";
      },
      pos: "n"
    }
  },
  T_ExploreMissingVal: {
    q: function(){ return "Explore "+this.browser.recordName+" with missing/invalid values"; },
    actions: "Explore+Select",
    topics: "Aggregate",
    context: ["SummaryInBrowser", "OpenSummary", "SummaryWithMissingValues"],
    media: "T_ExploreMissingVal.gif",
    note: "<p><i class='fa fa-ban'></i> icon appears on summary left-bottom corner"+
      " only when some records have missing/invalid values in related summary.</p>"+
      "<p>Darker icon color means more records with missing/invalid values.</p>",
    tAnswer: {
      class: "missingValueAggr",
      cElement: "summaries",
      text: "Use <i class='fa fa-ban'></i> icon . <br>"+
        "<b>Mouse over</b> to highlight<br>"+
        "<b>Click</b> to filter<br>"+
        "<b>Shift+click</b> to compare"
    }
  },
  T_ChangeMeasureLabel: {
    q: function(){
      var text = this.browser.percentModeActive?"absolute (#)":"percent (%)";
      return "View measurement-labels as <b>"+text+"</b> values";
    },
    actions: "Explore+View",
    topics: "Measurement+Measure-Label",
    context: ["SummaryInBrowser", "NotAverageMeasure", "OpenSummary"],
    similarTopics: ['T_ChangeMetric', 'T_ChangeVisualScale'],
    media: "T_ChangeMeasureLabel.gif",
    note: measureLabelModeInfo,
    tAnswer: {
      class: "measurePercentControl",
      cElement: "summaries",
      text: function(){ 
        return "Click <i class='fa fa-"+(this.browser.percentModeActive?"percent":"hashtag")+"'></i>";
      }
    },
    activate: function(){
    },
    animate: {
      1: function(){
        this.context.HighlightedDOM[0].stencilBox.append("div")
          .attr("class","pointerAction").style("left","-30px").append("span").attr("class","fa fa-bullseye");
        this.browser.setPercentLabelMode(!this.browser.percentModeActive);
      }, 
      4: function(){
        this.context.HighlightedDOM[0].stencilBox.append("div")
          .attr("class","pointerAction").style("left","-30px").append("span").attr("class","fa fa-bullseye");
        this.browser.setPercentLabelMode(!this.browser.percentModeActive);
      }
    }
  },
  T_ChangeMetric: {
    q: "Measure by <b>Number</b>, <b>Sum</b>, or <b>Average</b> metric",
    actions: "Explore",
    topics: "Measurement+Metric",
    context: ["SummaryInBrowser", "NumberSummary"],
    similarTopics: ['T_ChangeMeasureLabel', 'T_ChangeVisualScale'],
    media: "T_ChangeMetric.gif",
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
        text: "Choose a metric:<br> Number, Sum, or Average",
        pos: "w"
      }
      ]
    }
  },
  T_ChangeVisualScale: {
    q: function(){ 
      return "Visually scale measurements as <b>"+(this.browser.ratioModeActive?"absolute":"relative")+"</b>";
    },
    actions: "Explore+View",
    topics: "Measurement+Visual Scale Mode",
    context: ["SummaryInBrowser","OpenSummary"],
    similarTopics: ['T_ChangeMeasureLabel', 'T_ChangeMetric'],
    media: "T_ChangeVisualScale.gif",
    note: visualScaleModeInfo,
    tAnswer: {
      class: "scaleModeControl",
      cElement: "summaries",
      text: "Click axis of<br> measurement",
      pos: "e"
    },
    activate: function(){
      this.browser.showScaleModeControls(true);

      var hAggr = pickSelectedAggr.call(this.browser);
      this.context.highlightedAggregate = hAggr;
      this.context.highlightedSummary = hAggr.summary;
    },
    animate: {
      1: function(){
        var s = this.context.HighlightedDOM[0].parentNode.__data__;
        s.skipExplain = true;

        this.context.lalalala = this.context.HighlightedDOM[0].stencilBox;
        this.context.lalalala.append("div")
          .attr("class","pointerAction").append("span").attr("class","fa fa-bullseye");
        this.browser.setScaleMode(!this.browser.ratioModeActive);
      },
      2.5: function(){
        this.context.highlightedSummary.onAggrHighlight(this.context.highlightedAggregate);
      },
      3.5: function(){
        this.context.HighlightedDOM = [ this.browser.crumb_Highlight.DOM.node() ];
        this.fHighlightBox("This breadcrumb shows <br> an example highlighted-selection.","n","",false,"deEmph");
      },
      5: function(){
        var _temp = pickExplainAggr.call(this.browser, 'Highlight');
        this.context.HighlightedDOM = [ _temp.DOM.aggrGlyph ];
        var aggrName = _temp.summary.printAggrSelection(_temp) + " " + _temp.summary.summaryName;
        var _active = _temp.recCnt.Active;
        var _highlight = _temp.recCnt.Highlight;
        this.fHighlightBox(
          this.browser.recordName + " in "+ 
            printBreadcrumb("Highlight",this.context.highlightedSummary, this.context.highlightedAggregate)+"<br>"+
          "<u>Relative</u>: "+ Math.round(100*(_highlight/_active))+"% of "+_active+" "+ aggrName + "<br>"+
          "<u>Absolute</u>: "+_highlight+" of " + aggrName
          ,
          "n","",false,"deEmph");
      },
      8: function(){
        this.context.lalalala.append("div")
          .attr("class","pointerAction").append("span").attr("class","fa fa-bullseye");
        this.browser.setScaleMode(!this.browser.ratioModeActive);
      },
      10: function(){
      },
    },
    deactivate: function(){
      this.browser.showScaleModeControls(false);
      if(this.context.highlightedSummary){
        this.context.highlightedSummary.skipExplain = false;
        this.context.highlightedSummary.onAggrLeave(this.context.highlightedAggregate);
      }
      this.context.highlightedSummary   = undefined;
      this.context.highlightedAggregate = undefined;
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
  T_GetRecordDetails: {
    q: "View record details",
    actions: "Explore+View+Select",
    topics: "Record",
    context: ["RecordDisplay", "RecordsWithDetailToggle"],
    media: "T_GetRecordDetails.gif",
    note: "The details of the associated record are shown in a popup panel.",
    tAnswer: {
      class: "recordToggleDetail",
      cElement: "recordDisplay",
      text: "Click <i class='fa fa-info-circle'></i>",
      pos: "w",
      // only show tooltip for elements that are within view...
      filter: function(){
        var minY = this.browser.recordDisplay.DOM.recordGroup.node().scrollTop;
        var maxY = minY + this.browser.recordDisplay.DOM.recordGroup.node().offsetHeight;
        this.context.HighlightedDOM = this.context.HighlightedDOM.filter(function(d){
          var record = d.__data__;
          if(!record.isWanted) return false;
          var DOM = record.DOM.record;
          if( typeof DOM === 'undefined' ) return false;
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
    media: [ "T_RemSummaryFilter.gif", "T_RemSummaryFilter_2.gif"],
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
    media: "T_RemoveCatFilter.gif",
    tAnswer: {
      matches: '.catGlyph[cfiltered]',
      cElement: "summaries",
      text: "Click on filtered category", 
      pos: "n"
    }
  },
  T_ClearFilters: {
    q: function(){ return "Clear all filters / Show all "+this.browser.recordName; },
    actions: "Explore+Filter",
    topics: "Filter Selection",
    context: "AnyFiltered",
    similarTopics: ['T_RemSummaryFilter','T_RemoveCatFilter'],
    tAnswer: {
      class: "filterClearAll",
      cElement: "browser", 
      text: "Click <span class='filterClearAll' active='true'></span>", 
      pos: "n"
    }
  },
  T_RecSortRev: {
    q: function(){ return "Sort "+this.browser.recordName+" in reverse";} ,
    actions: "Explore+Sort",
    topics: "Record Panel",
    context: ["RecordDisplay", "RecordDisplayAsList"],
    similarTopics: ['T_CatSortRev', 'T_RecSortChange'],
    media: "T_RecSortRev",
    note: "<i class='fa fa-sort-amount-desc'></i> appears when you move the mouse over the record panel.",
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
    similarTopics: ['T_RecSortRev'],
    media: "T_CatSortRev",
    note: "<i class='fa fa-sort-amount-desc'></i> appears when you move the mouse over the summary, if categories can be sorted in reverse.",
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
    // TODO: More than one sorting option available.
    context: ["RecordDisplay", "RecordDisplayAsList", "SummaryInBrowser", "IntervalSummary"], 
    media: "T_RecSortChange.gif",
    note: function(){
      return "<p>Records can be sorted using a number/time attribute.</p>"+
        "<p><i class='fa fa-sort'></i> appears when you move the mouse over a number/time summary.</p>"+
        "<p><i class='fa fa-sort'></i> is always visible for the active sorting summary (currently "+
          "<i>"+this.browser.recordDisplay.sortingOpt_Active.summaryName+"</i>).</p>";
    },
    similarTopics: ['T_RecSortRev'],
    tAnswer: [
      { 
        class: "listSortOptionSelect",
        cElement: "recordDisplay", 
        text: "Click the dropdown to see options<br> and select one",
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
    media: "T_ZoomInOutRange.gif",
    note: "<i class='fa fa-search-plus'></i> / <i class='fa fa-search-minus'></i> "+
      "appears when you move the mouse over an open filtered summary.",
      // TODO: You cannot zoom beyond maximum resolution of time data.
      // TODO: You cannot zoom beyond step-scale.
    similarTopics: ['T_AdjustFilterRange'],
    tAnswer: {
      class: "zoomControl",
      cElement: "summaries",
      text: "Click<br><i class='fa fa-search-plus'></i> / <i class='fa fa-search-minus'></i>", 
      pos: "sw"
    },
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
    media: "T_Percentiles.gif",
//    note: percentileInfo, // This info doesn't make much sense when the percentile chart is not visible.
    tAnswer: {
      sequence: [
        {
          class: "summaryConfigControl",
          cElement: "summaries",
          text: "Click <i class='fa fa-gear'></i>", 
          pos: "ne"
        },{ 
          matches: "[showConfig=\"true\"] .summaryConfig_Percentile",
          cElement: "summaries",
          text: "Select show / hide percentiles<br> in summary configuration", 
          pos: "ne"
        }
      ]
    },
  },
  T_OpenSummary: {
    q: "Open a summary",
    actions: "Layout",
    topics: "Summary",
    context: ["SummaryInBrowser","CollapsedSummary"],
    media: "T_OpenSummary.png",
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
    media: "T_CollapseSummary.png",
    note: "<i class='fa fa-compress'></i> appears when you move the mouse over an open summary.",
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
    media: "T_MaxSummary.png",
    note: "<i class='fa fa-arrows-alt'></i> appears when you move the mouse over a summary that can be maximized.",
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
    media: "T_ConfigSummary.gif",
    note: "<p><i class='fa fa-gear'></i> appears when you move the mouse over the summary.</p>"+
      "<p>Configuration options depend on the summary type.</p>",
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
    weight: 20
  },
  T_RemSummary: {
    q: "Remove a summary from browser",
    actions: "Layout+Add/Remove",
    topics: "Summary+Browser",
    context: ["AuthoringMode", "SummaryInBrowser"],
    note: "<i class='fa fa-times'></i> appears when you move the mouse over a summary.",
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
    q: "Change histogram range binning scale (<b>log/linear</b>)",
    actions: "Change",
    topics: "Number Summary+Bin Scale Type",
    context: ["SummaryInBrowser","IntervalSummary","NumberSummary","PositiveNumberSummary"],
    media: "T_BinScale.gif",
    note: ""+
      "<p>Log-scale creates values range bins based on logarithmic distribution. "+
        "In other words, while all range bins have same width visually, "+
          "the value ranges each bin covers is double the previos one, such as 1,2,4,8,16,32...</p>"+
      "<p>Log-scale may better fit skewed distributions, where many values that are on the small or large end.</p>"+
      "<p>Log-scale can be used in summaries with <i>only</i> positive values.</p>",
    // TODO: There are a few other constraints: Not-step scale.. (depends on filtering state too)
    tAnswer: {
      sequence :[
        { class: "summaryConfigControl", 
          cElement: "summaries", 
          text: "Click <i class='fa fa-gear'></i>", 
          pos: "ne"
        },{
          matches: "[showConfig=\"true\"] .summaryConfig_ScaleType",
          cElement: "summaries",
          text: "Select <span class='bolder'>linear / log scale</span>", 
          pos: "ne"
        }
      ]
    },
  },
  T_LabelLockedSel: {
    q: "View measurement-labels of a locked <i class='fa fa-lock'></i> selection",
    actions: "Compare+View",
    topics: "Aggregate+Measurement+Compare Selection+Compared Measure",
    context: ["SummaryInBrowser","ActiveCompareSelection"],
    media: "T_LabelLockedSel.gif",
    note: "The label color reflects the selection it displays.",
    // TODO: Show a tooltip for the color? how... activate?
    tAnswer: [
      {
        matches: '[class*="crumbMode_Compare_"]',
        cElement: "browser",
        text:  "Mouse over <i class='fa fa-lock'></i> breadcrumb",
        pos: "n"
      }
    ],
    activate: function(){
      // TODO: may be Compare_B or Compare_C . Choose the appropriate one.
      this.browser.refreshMeasureLabels("Compare_A");
    },
    animate: {
      0.5: function(){
        this.context.HighlightedDOM[0].stencilBox.append("div")
          .attr("class","pointerAction").append("span").attr("class","fa fa-mouse-pointer").style("font-size","0.7em");
      }
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
    media: "T_SumDescr.png",
    tAnswer: {
      class: "summaryDescription", 
      cElement: "summaries", 
      text: "Mouse over <i class='fa fa-info'></i>", 
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

// The rest is for the experiment ONLY
if(location.search==="?exp=basis" || location.search==="?exp=helpin" || location.search==="?exp=train"){
  delete _material._topics.T_CatViewAs;
  delete _material._topics.T_ViewRecRank;
  delete _material._topics.T_EnableAuth;
  delete _material._topics.T_RemSummary;
  delete _material._topics.T_ResizePanel;
  delete _material._topics.T_ResizeCatWidth;
  delete _material._topics.T_UnitName;
  delete _material._topics.T_RenameSummary;
  delete _material._topics.T_RemRecPanel;
  delete _material._topics.T_SetMatrix;
  delete _material._topics.T_Fullscreen;

  // Alert for reload / navigate away
  window.onbeforeunload = function (e) {
    var message="Please do not reload this page.";
    e = e || window.event;
    if (e) e.returnValue = message; // For IE and Firefox prior to version 4
    return message;
  };

  var isTraining = window.location.href !== "http://localhost/keshif/demo/helpin_dc_homicides.html?exp=train";

  var timeLimit = isTraining ? (60*2.5 + 10) : (60*8 + 20);

  setTimeout(function(){
    d3.select("body")
      .append("div")
        .attr("class","exp_timer")
        .styles({
          position: 'absolute',
          'font-family': 'Roboto, Helvetica, Arial, sans-serif',
          color: 'gray',
          'font-size': '1.1em',
          right: '5px',
          bottom: '5px'
        })
        .text("-")
        ;

    var timeCounter = 0;
    var timerInterval = 0;

    function pad(num, size){ return ('000000000' + num).substr(-size); }

    window.onblur = function(){
      if(timerInterval) clearInterval(timerInterval);
    };

    window.onfocus = function(){
      if(timerInterval) clearInterval(timerInterval);
      timeCounter = 0;
      timerInterval = setInterval(function(){
        timeCounter++;
        d3.select(".exp_timer").text(""+pad(Math.floor(timeCounter/60),2)+":"+pad(timeCounter%60,2));
        if(timeCounter>=timeLimit){
          alert("Task time is up.");
          clearInterval(timerInterval);
        }
      }, 1000);
    };

  },5000);

}

