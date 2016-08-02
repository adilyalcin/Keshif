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

var _contextFeatures = {
  True: {
    name: "Always true",
    v: function(){ return true; },
    weight: 0
  },
  SummaryInBrowser: {
    name: "Browser includes at least one summary.",
    v: { summaries: function(summary){ return summary.inBrowser(); } },
    weight: 10,
    fixBy: 34, // Add summary into browser
  },
  CollapsedSummary: {
    name: "Summary is collapsable.",
    v: { summaries: function(summary){ return summary.collapsed; } },
    weight: 35,
    fixBy: 29, // collapse summary
  },
  OpenSummary: {
    name: "Summary is open.",
    v: { summaries: function(summary){ return !summary.collapsed; } },
    weight: 33,
    fixBy: 28, // Open summary
  },
  CategoricalSummary: {
    name: "Summary is categorical.",
    v: { summaries: function(summary){ return summary.type==="categorical"; } },
    weight: 20
  },
  IntervalSummary: {
    name: "Summary is interval (numeric or time).",
    v: { summaries: function(summary){ return summary.type==="interval"; } },
    weight: 25
  },
  NumberSummary: {
    name: "Summary is numeric.",
    v: { summaries: function(summary){ return summary.type==="interval" && summary.scaleType!=="time"; } },
    weight: 30
  },
  PositiveNumberSummary: {
    name: "Numeric summary has only positive values (minimum>0).",
    v: { summaries: function(summary){ 
      return summary.type==="interval" && summary.scaleType!=="time" && summary.intervalRange.org.min>0;
    } },
    weight: 30
  },
  TimeSummary: {
    name: "The summary shows time.",
    v: { summaries: function(summary){ return summary.type==="interval" && summary.scaleType==="time"; } },
    weight: 33
  },
  CategoricalMapSummary: {
    name: "Summary includes map regions per category.",
    v: { summaries: function(summary){ return summary.catMap; } },
    weight: 40
  },
  CategoricalMapVieweight: {
    name: "Summary is viewed as a categorical map.",
    v: { summaries: function(summary){ return summary.viewAs==='map'; } },
    weight: 45
  },
  MultiValuedSummary: {
    name: "Categorical summary includes multiple values per record.",
    v: { summaries: function(summary){ return summary.isMultiValued; } },
    weight: 40
  },
  FilteredSummary: {
    name: "Summary is filtered.",
    fixBy: 1, // Filter-select to focus
    v: { summaries: function(summary){ return summary.isFiltered(); } },
    weight: 50
  },
  CategoricalSummaryWithTextSearch: {
    name: "Summary includes more than 20 categories.",
    v: { summaries: function(summary){ return summary.showTextSearch; } },
    weight: 30
  },
  SummaryWithMissingValues: {
    name: "Summary has at least one invalid/missing record value.",
    v: { summaries: function(summary){ return summary.missingValueAggr.records.length>0; } },
    weight: 47
  },
  ExpandableSummary: {
    name: "Summary includes more categories than currently visible.",
    v: { summaries: function(summary){ return !summary.areAllCatsInDisplay(); } },
    weight: 20
  },
  SortableSummary: {
    name: "Summary has more than 20 categories.",
    v: { summaries: function(summary){ return summary.configRowCount>0 && !summary.catSortBy_Active.no_resort; } },
    weight: 22
  },
  SummaryWithDescription: {
    name: "Summary has a description.",
    v: { summaries: function(summary){ return summary.description !== undefined; } },
    weight: 4
  },
  SummaryOpenConfig: {
    name: "Summary configuration is open.",
    v: { summaries: function(summary){ return summary.DOM.root.attr("showConfig")==="true"; } },
    weight: 50,
    fixBy: 31 // show summary
  },

  NotAverageMeasure: {
    name: "Measure function is not average.",
    v: function(){ return this.browser.measureFunc!=="Avg"; },
    weight: 10,
    fixBy: 12, // change aggregate measure function
  },
  ActiveCompareSelection: {
    name: "There is an active compared <i class='fa fa-lock'></i> selection.",
    v: function(){
      if(this.browser.selectedAggr.Compare_A) return true;
      if(this.browser.selectedAggr.Compare_B) return true;
      if(this.browser.selectedAggr.Compare_C) return true;
      return false;
    },
    weight: 55,
    fixBy: 2, // Lock-select to compare
  },

  RecordDisplay: {
    name: "Browser includes record panel.",
    v: function(){ return this.recordDisplay.recordViewSummary !== null; },
    weight: 30,
    fixBy: 51, // Add record panel
  },
  RecordTextSearch: {
    name: "There needs to be an active record text search summary.",
    v: function(){ return this.recordDisplay.textSearchSummary !== null; },
    weight: 35
  },
  RecordsWithDetailToggle: {
    name: "Record panel has detail toggle enabled.",
    v: function(){ return this.recordDisplay.detailsToggle !== "off"; },
    weight: 25
  },
  RecordDisplayAsMap: {
    name: "Records need to have a geographical region.",
    v: function(){ return this.recordDisplay.config.geo; },
    weight: 55
  },
  RecordDisplayAsNetwork: {
    name: "Records need to have a linking attribute.",
    v: function(){ return this.recordDisplay.config.linkBy.length>0; },
    weight: 55
  },
  RecordDisplayAsList: {
    name: "Record panel shows records as a list.",
    v: function(){
      var x = this.recordDisplay.displayType;
      return x==='list' || x==="grid";
    },
    weight: 15
  },

  AnyFiltered: {
    name: "Data needs to be filtered.",
    v: function(){ return this.browser.isFiltered(); },
    weight: 40
  },

  AuthoringMode: {
    name: "Authoring mode is enabled.",
    v: function(){ return this.browser.authoringMode; },
    weight: 10,
    fixBy: 32, // Enable authoring
  },
  LoggedIn : {
    name: "You need to be logged in.",
    v: function(){ return kshf.gistLogin; },
    weight: 44,
    fixBy: 48, // login...
  }
};

var _topics = {
  0: {
    q: "<i class='helpin-breadcrumb fa fa-mouse-pointer'></i> Highlight-select to preview records",
    actions: "Explore+Select",
    topics: "Aggregate",
    context: ["SummaryInBrowser", "OpenSummary"],
    note: ""+
      "<p>All highlighted records are shown in <span style='color: orangered; font-weight: 500;'>orange</span>.</p>"+
      "<p>You can observe distribution of highlighted records in all other summaries, as well as the record panel. "+
        "The highlight-selection is named in the breadcrumb as well.</p>"+
      "<p>You can highligh records in categories, numeric ranges, time ranges, or invalid values. "+
        "Move the mouse to change this selection.</p>",
    similarTopics: [1,2],
    activate: function(){
      // TODO: Find the summary with a category that selects about 50% of the data
      // TODO: Maybe go over all aggregates and pick the one that's most appropriate, can be in any type of summary
      // TODO: Make sure the picked category is also visible on the screen...
      var s = this.context.summaries[0];

      this.context.highlightedSummary   = s;
      // TODO: FIX: Summary is not always a categorical summary, _cats may be undefined
      if(s.type==='categorical'){
        this.context.highlightedAggregate = s._cats[0];
      } else {
        this.context.highlightedAggregate = s.histBins[0];
      }
      s.onCatEnter(s._cats[0]);

      this.context.summaries.forEach(function(summary){
        if(summary.type==="categorical"){
          this.context.HighlightedDOM.push(summary._cats[0].DOM.aggrGlyph);
        }
        if(summary.type==="interval"){
          // TODO: select bin with largest value
          this.context.HighlightedDOM.push(summary.histBins[0].DOM.aggrGlyph);
        }
      }, this);

      this.fHighlightBox("Mouse-over the record aggregate","n");
      // TODO: Allow seeing other highlighting examples

      // TODO: Show that the record is highlighted with orange background
      // TODO: Show how to read another aggregate selection.
    },
    deactivate: function(){
      this.context.highlightedSummary.onCatLeave(this.context.highlightedAggregate);
      this.context.highlightedSummary   = undefined;
      this.context.highlightedAggregate = undefined;
    },
  },
  1: {
    q: "<i class='helpin-breadcrumb fa fa-filter'></i> Filter-select to focus on records",
    actions: "Explore+Filter+Select",
    topics: "Aggregate",
    context: "SummaryInBrowser",
    similarTopics: [1,2,4],
    note: "Use filtering sparingly when you want to zoom into the data from multiple summaries."
  },
  2: {
    q: "<i class='helpin-breadcrumb fa fa-lock'></i> Lock-select to compare record groups",
    actions: "Explore+Compare+Select",
    topics: "Aggregate",
    context: "SummaryInBrowser",
    similarTopics: [1,3],
    note: "<i class='fa fa-keyboard-o'></i> Shift+click also locks the selection.</i>"
    // Alternative: Shift-click
    // Show how it affects other parts of the screen
    // By moving the mouse, you can compare distribution of locked and highlighted selections
    //  Help them read the relation
  },
  3: {
    q: "Unlock a locked selection <i class='fa fa-lock'></i>",
    actions: "Explore+Select",
    topics: "Aggregate+Compared Measure+Compare Selection",
    context: ["SummaryInBrowser", "ActiveCompareSelection"],
    note: "Filtering also unlocks (removes) all compared selections.",
    similarTopics: [2],
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
  4: {
    q: "Filter multiple categories using And - Or - Not",
    actions: "Explore+Filter+Select",
    topics: "Categorical Summary",
    context: ["SummaryInBrowser", "CategoricalSummary", "OpenSummary"],
    note: "And-selection is possible <i>only if</i> records have multiple categorical values.",
    similarTopics: [1]
  },
  5: {
    q: "Select Map Regions",
    actions: "Explore+Select+Select",
    topics: "Map",
    context: ["SummaryInBrowser", "CategoricalSummary", "CategoricalMapSummary"],
  },
  6: {
    q: "Adjust filtered range selection",
    actions: "Explore+Select",
    topics: "Time Summary+Number Summary",
    context: ["SummaryInBrowser", "IntervalSummary", "FilteredSummary"],
    similarTopics: [24],
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
  7: {
    q: "Save filtered records <i class='helpin-breadcrumb fa fa-filter'></i> as a new aggregate",
    actions: "Explore+Save+Filter",
    topics: "Filter Selection",
    context: ["SummaryInBrowser", "FilteredSummary"],
    note: "Saved selections will be added to Saved Selections summary as new category.",
    tAnswer: {
      class: "saveSelection",
      cElement: "browser",
      text: "Click <i class='fa fa-floppy-o'></i>"
    }
  },
  8: {
    q: "Search and filter categories by text",
    actions: "Explore+Select",
    text: "Categorical Summary",
    context: ["SummaryInBrowser", "CategoricalSummary", "CategoricalSummaryWithTextSearch"],
    note: "The categories that match will be used to filter records.",
    similarTopics: [9],
    tAnswer: {
      class: "catTextSearch",
      cElement: "summaries",
      text: "Type your search in<br> category text search box."
    }
  },
  9: {
    q: "Select records by text search",
    actions: "Explore+Select",
    topics: "Record Panel+Record Text Search+Record",
    context: ["RecordDisplay", "RecordTextSearch"],
    note: "If you type multiple words, you can specify if <b>all</b> or <b>some</b> words need to match in a record.",
    similarTopics: [8],
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
  10: {
    q: "Explore records with missing/invalid values",
    actions: "Explore+Select",
    topics: "Aggregate",
    context: ["SummaryInBrowser", "OpenSummary", "SummaryWithMissingValues"],
    note: "<i class='fa fa-ban'></i> appears only when some records have missing/invalid values in related summary. "+
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
  11: {
    q: function(){
      var text = this.browser.percentModeActive?"absolute (#)":"percent (%)";
      return "View measure labels as <b>"+text+"</b> values";
    },
    actions: "Explore+View",
    topics: "Measurement+Measurement Label",
    context: ["SummaryInBrowser", "NotAverageMeasure", "OpenSummary"],
    note: "Percent values cannot be shown when average-values are measured per record aggregate.",
    similarTopics: [12, 13],
    tAnswer: {
      class: "measurePercentControl",
      cElement: "summaries",
      text: function(){ 
        return "Click <i class='fa fa-"+(this.browser.percentModeActive?"percent":"hashtag")+"'></i>";
      }
    }
  },
  12: {
    q: "Measure aggregates by <b style='display:inline-block'>Count - Sum (Total) - Average</b> function",
    actions: "Explore",
    topics: "Measurement",
    context: ["SummaryInBrowser", "NumberSummary"],
    similarTopics: [11, 13],
    tAnswer: {
      sequence: [
      {
        class: "recordInfo", 
        cElement: "browser",
        text: "Click here",
        pos: "n"
      }
      ,
      {
        matches: ".measureFunctionType", 
        cElement: "browser",
        text: "Choose among the options",
        pos: "w"
      }
      ]
    }
    // TODO - multiple steps
  },
  13: {
    q: function(){ 
      return "Visually scale measurements as <b>"+(this.browser.ratioModeActive?"absolute":"part-of-whole")+"</b>";
    },
    actions: "Explore+View",
    topics: "Measurement",
    context: ["SummaryInBrowser","OpenSummary"],
    note: "Part-of-whole scale is designed to reveal information on highlight and compare selections.",
    similarTopics: [11, 12],
    tAnswer: {
      class: "scaleModeControl",
      cElement: "summaries",
      text: "Click axis of<br>measurement values",
      pos: "e"
    },
    activate: function(){
      this.browser.showScaleModeControls(true);
    },
    deactivate: function(){
      this.browser.showScaleModeControls(false);
    }
  },
  14: {
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
  15: {
    q: "Retrieve record details",
    actions: "Explore+Retrieve+Select",
    topics: "Record",
    context: ["RecordDisplay", "RecordsWithDetailToggle"],
    note: "Record details are shown in a popup panel.",
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
  16: {
    q: "View record ranks",
    actions: "View+Sort",
    topics: "Record Panel+Record",
    context: ["AuthoringMode", "RecordDisplay"],
    similarTopics: [20,21],
    tAnswer: {
      class: "itemRank_control",
      cElement: "recordDisplay",
      text: "Click <i class='fa fa-angle-double-up'></i>",
      pos: "n"
    }
  },
  17: {
    q: "Remove filtering on a summary",
    actions: "Explore+Add/Remove+Filter",
    topics: "Summary+Filter Selection",
    context: ["SummaryInBrowser", "FilteredSummary"],
    similarTopics: [18,19],
    tAnswer: [
      {
        class: "clearFilterButton",
        cElement: "summaries",
        text: "Click <i class='fa fa-filter'></i>", 
        pos: "e"
      },
      {
        matches: '[class*="crumbMode_Filter"]',
        cElement: "browser",
        text: "Click <i class='fa fa-filter'></i> breadcrumb",
        pos: "n"
      }
    ]
  },
  18: {
    q: "Remove filtering on a category",
    actions: "Explore+Add/Remove+Filter",
    topics: "Categorical Summary",
    context: ["SummaryInBrowser", "OpenSummary", "CategoricalSummary", "FilteredSummary"],
    similarTopics: [17,19],
    tAnswer: {
      matches: '.catGlyph:not([selected="0"])',
      cElement: "summaries",
      text: "Click on filtered category", 
      pos: "n"
    }
  },
  19: {
    q: "Clear all filters / Show all Records",
    actions: "Explore+Filter",
    topics: "Filter Selection",
    context: "AnyFiltered",
    similarTopics: [17,18],
    tAnswer: {
      class: "filterClearAll",
      cElement: "browser", 
      text: "Click here", 
      pos: "n"
    }
  },
  20: {
    q: "Sort records in reverse",
    actions: "Explore+Sort",
    topics: "Record Panel",
    context: ["RecordDisplay", "RecordDisplayAsList"],
    note: "<i class='fa fa-sort-amount-desc'></i> appears when you mouse-over the record panel.",
    similarTopics: [21, 23],
    tAnswer: {
      class: "recordSortButton", 
      cElement: "recordDisplay", 
      text: "Click <i class='fa fa-sort-amount-desc'></i>", 
      pos: "n"
    }
  },
  21: {
    q: "Sort categories in reverse",
    actions: "Explore+Sort",
    topics: "Categorical Summary",
    context: ["SummaryInBrowser", "OpenSummary", "CategoricalSummary", "SortableSummary"],
    note: "<i class='fa fa-sort-amount-desc'></i> appears when you mouse-over the summary"+
      " and if categories can be sorted in reverse.",
    similarTopics: [20],
    tAnswer: {
      class: "catSortButton",
      cElement: "summaries", 
      text: "Click <i class='fa fa-sort-amount-desc'></i>", 
      pos: "n"
    }
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
  23: {
    q: "Change record sorting",
    actions: "Explore+Sort",
    topics: "Record Panel",
    context: ["RecordDisplay", "RecordDisplayAsList", "SummaryInBrowser", "IntervalSummary"], // TODO: More than one sorting option available.
    note: "Records can be sorted using number or time summaries.<br><br>"+
      "<i class='fa fa-sort'></i> appears when you mouse-over the summary. "+
      "Active sorting summary always displays <i class='fa fa-sort'></i> for quick overview.",
    similarTopics: [20],
    tAnswer: [
      {
        class: "listSortOptionSelect",
        cElement: "recordDisplay", 
        text: "Click the dropdown to see sorting options<br> and select one.",
        pos: "n" },
      {
        class: "useForRecordDisplay",
        cElement: "summaries",
        text: "Click <i class='fa fa-sort'></i>", 
        pos: "ne" }
    ]
    // TODO: Sorting is actually color in maps or networks...
  },
  24: {
    q: "Zoom in / out of active range filter",
    actions: "Navigate",
    topics: "Time Summary+Number Summary",
    context: ["SummaryInBrowser", "OpenSummary", "IntervalSummary", "FilteredSummary"],
    note: "<i class='fa fa-search-plus'></i> / <i class='fa fa-search-minus'></i> appears when you mouse-over an open summary.",
      // TODO: You cannot zoom beyond maximum resolution of time data.
      // TODO: You cannot zoom beyond step-scale.
    similarTopics: [6],
    tAnswer: {
      class: "zoomControl",
      cElement: "summaries",
      text: "Click <i class='fa fa-search-plus'></i> / <i class='fa fa-search-minus'></i>", 
      pos: "sw"
    }
  },
  25: {
    q: "Navigate (pan and zoom) in maps",
    actions: "View+Navigate",
    topics: "Map",
    context: ["SummaryInBrowser","CategoricalSummary", "CategoricalMapSummary"],
      // DODO: Also should appear when record panel is map mode. IMPORTANT.
  },
  26: {
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
  27: {
    q: "Show/hide percentiles &amp; median of number summary",
    actions: "Explore+Show/Hide+Configure",
    topics: "Number Summary",
    context: ["SummaryInBrowser","OpenSummary","IntervalSummary","NumberSummary","SummaryOpenConfig"],
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
  28: {
    q: "Open a summary",
    actions: "Layout",
    topics: "Summary",
    context: ["SummaryInBrowser","CollapsedSummary"],
    similarTopics: [29, 30, 34],
    tAnswer: {
      class: "buttonSummaryCollapse",
      cElement: "summaries",
      text: "Click <i class='fa fa-expand'></i>", 
      pos: "nw"
    }
  },
  29: {
    q: "Minimize a summary",
    actions: "Layout",
    topics: "Summary",
    context: ["SummaryInBrowser","OpenSummary"],
    note: "<i class='fa fa-compress'></i> appears when you mouse-over an open summary.",
    similarTopics: [28, 30, 35],
    tAnswer: {
      class: "buttonSummaryCollapse", 
      cElement: "summaries",
      text: "Click <i class='fa fa-compress'></i>", 
      pos: "nw"
    }
  },
  30: {
    q: "Maximize a summary",
    actions: "Layout",
    topics: "Summary",
    context: ["SummaryInBrowser", "CategoricalSummary", "OpenSummary", "ExpandableSummary"],
    note: "<i class='fa fa-arrows-alt'></i> appears when you mouse-over a summary that can be maximized.",
    similarTopics: [28, 29],
    tAnswer: {
      class: "buttonSummaryExpand",
      cElement: "summaries", 
      text: "Click <i class='fa fa-arrows-alt'></i>", 
      pos: "nw"
    }
  },
  31: {
    q: "Show/hide summary configuration",
    actions: "Show/Hide",
    topics: "Summary",
    context: ["SummaryInBrowser","OpenSummary"],
    note: "Configuration options depend on the summary data type.<br><br>"+
      "<i class='fa fa-gear'></i> appears when you mouse-over the summary.",
    similarTopics: [32],
    tAnswer: {
      class: "summaryConfigControl", 
      cElement: "summaries", 
      text: "Click <i class='fa fa-gear'></i>", 
      pos: "ne"
    }
  },

  // AUTHORING MODE
  32: {
    q: "Enable authoring / Show available attributes",
    actions: "Configure",
    topics: "Browser",
    similarTopics: [31],
    tAnswer: {
      class: "authorButton",
      cElement: "browser", 
      text: "Click <i class='fa fa-cog'></i>", 
      pos: "n"
    }
  },
  33: {
    q: "Move a summary",
    actions: "Layout",
    topics: "Summary+Browser",
    context: ["AuthoringMode", "SummaryInBrowser"],
  },
  34: {
    q: "Add a summary into browser",
    actions: "Layout+Add/Remove",
    topics: "Summary+Browser",
    context: ["AuthoringMode"], // TODO: At least summary not within browser / available attribute.
    similarTopics: [35]
  },
  35: {
    q: "Remove a summary from browser",
    actions: "Layout+Add/Remove",
    topics: "Summary+Browser",
    context: ["AuthoringMode", "SummaryInBrowser"],
    note: "<i class='fa fa-times'></i> appears when you mouse-over a summary.",
    similarTopics: [34],
    tAnswer: {
      class: "buttonSummaryRemove", 
      cElement: "summaries", 
      text: "Click <i class='fa fa-times'></i>", 
      pos: "nw"
    }
  },
  36: {
    q: "Resize panel width",
    actions: "Layout",
    topics: "Panel",
    context: ["AuthoringMode", "SummaryInBrowser"],
    similarTopics: [37],
    tAnswer: {
      class: "panelAdjustWidth",
      cElement: "browser",
      text: "Click &amp; drag panel border"
    }
  },
  37: {
    q: "Resize category labels width",
    actions: "Layout",
    topics: "Categorical Summary+Panel",
    context: ["AuthoringMode", "SummaryInBrowser", "CategoricalSummary", "OpenSummary"],
    similarTopics: [36],
    tAnswer: {
      class: "chartCatLabelResize", 
      cElement: "summaries",
      text: "Click &amp; drag category width line"
    }
  },
/*  38: {
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
  },*/
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
  42: {
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
    // TODO: Multiple step...
  },
  43: {
    q: "Extract time component (month, day, hour...)",
    actions: "Explore+Transform Data",
    topics: "Time Summary",
    context: ["AuthoringMode", "IntervalSummary", "TimeSummary"],
  },
  44: {
    q: "Rename summary",
    actions: "Change",
    topics: "Summary",
    context: ["AuthoringMode", "SummaryInBrowser"],
    // TODO: Can rename it by clicking on the avalibale attribute list too.
    tAnswer: {
      class: "summaryName_text",
      cElement: "summaries", 
      text: "Click on the summary name",
      pos: "n"
    }
  },
  45: {
    q: "Change histogram binning scale (<b>log</b> / <b>linear</b>)",
    actions: "Change",
    topics: "Number Summary+Range Scale Type",
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
  46: {
    q: "View measurement labels of a locked <i class='fa fa-lock'></i> selection",
    actions: "Compare+View",
    topics: "Aggregate+Measurement+Compare Selection+Compared Measure",
    context: ["SummaryInBrowser","ActiveCompareSelection"],
    note: "The aggregate measure label (text) color reflects the selection it displays.",
    // TODO: Show a tooltip for the color? how... activate?
    tAnswer: {
      matches: '[class*="crumbMode_Compare_"]',
      cElement: "browser",
      text:  "Mouse-over <i class='fa fa-lock'></i> breadcrumb",
      pos: "n"
    }
  },
  51: {
    q: "Add record panel",
    actions: "Layout+Add/Remove",
    topics: "Record Panel+Browser",
    context: ["AuthoringMode"], // TODO: At least summary not within browser / available attribute.
    similarTopics: [52],
  },
  52: {
    q: "Remove record panel",
    actions: "Layout+Add/Remove",
    topics: "Record Panel+Browser",
    context: ["AuthoringMode", "RecordDisplay"], // TODO: At least summary not within browser / available attribute.
    similarTopics: [51],
    tAnswer: {
      class: "buttonRecordViewRemove", 
      cElement: "recordDisplay", 
      text: "Click <i class='fa fa-times'></i>", 
      pos: "n"
    }
  },
  /*
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
  },*/
  /*  {
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
  53: {
    q: "Read summary description",
    actions: "Retrieve+View",
    topics: "Summary",
    context: ["SummaryInBrowser","SummaryWithDescription"],
    tAnswer: {
      class: "summaryDescription", 
      cElement: "summaries", 
      text: "Mouse-over <i class='fa fa-info-circle'></i>", 
      pos: "ne"
    }
  },
  54: {
    q: "Get help",
    actions: "",
    topics: "",
    context: [],
    tAnswer: {
      class: "showHelpIn",
      cElement: "browser",
      text: "Click <i class='fa fa-question-circle'></i>",
      pos: "ne"
    }
  }
};

var DOMtoName = [
  { matches: '.kshfSummary', 
    component: "Summary", },
  { matches: '.kshfSummary[summary_type="interval"]', 
    info: function(DOM){
      var summary = DOM.__data__;
      var _min = summary.printWithUnitName(summary.intervalRange.org.min);
      var _max = summary.printWithUnitName(summary.intervalRange.org.max);
      var _scale = (summary.scaleType==='log') ? (
        "<p>The range groups for this summary are created on a <span class='bolderInfo'>log-scale</span> "+
        "to reveal distribution of potentially skewed data.</p>") : "";
      return ""+
        "<p>This summarizes the <span class='bolderInfo'>"+summary.summaryName+"</span> of "+summary.browser.recordName+".</p>"+
        "<p>The values range between "+
        "<span class='bolderInfo'>"+_min+"</span> to "+
        "<span class='bolderInfo'>"+_max+"</span>.</p>"+
        _scale;
    }
    }, // TODO: Differentiate number/time 
  { matches: '.kshfSummary[summary_type="interval"][viewtype="bar"]', 
    component: "Number Summary", },
  { matches: '.kshfSummary[summary_type="interval"][viewtype="line"]', 
    component: "Time Summary", },
  { matches: '.kshfSummary[summary_type="categorical"]', 
    component: "Categorical Summary",
    info: function(DOM){
      var summary = DOM.__data__;
      return ""+
        "<p>This summarizes the <span class='bolderInfo'>"+summary.summaryName+"</span> of "+summary.browser.recordName+".</p>"+
        "<p>It includes <span class='bolderInfo'>"+summary._cats.length+"</span> categories.</p>";
    },
    },

  { matches: '.kshfRecord', 
    component: "Record",
    info: function(DOM){ 
      var r = DOM.__data__;
      var summary = this.browser.recordDisplay.sortingOpt_Active;
      var sortingSummaryName = summary.summaryName;
      var v = summary.getRecordValue(r);
      // TODO: if the record is highlighted (color), show why it is highlighted.
      var intro   = "<p>This is a single record among "+this.browser.recordName+".</p>";
      var ranking = "<p>It is ranked at <span class='bolderInfo'>#"+r.recordRank+"</span> based on its "+
        "<span class='bolderInfo'>"+sortingSummaryName+"</span>: "+this.browser.recordDisplay.getSortingLabel(r)+".</p>";
      var encoding = "";
      if(r.selectCompared_str){
        encoding = "<p>";
        encoding+= "The background color shows it is in ";
        r.selectCompared_str.replace(" ","").split('').forEach(function(_char){
          var comparedAggr = this.browser.selectedAggr["Compare_"+_char];
          var comparedSummary = comparedAggr.summary;
          encoding += "<span class='breadCrumb crumbMode_Compare_"+_char+"' ready='true'>"+
            "<span class='breadCrumbIcon fa'></span>"+
            "<span class='crumbText'>"+
              "<span class='bolderInfo'>"+comparedSummary.summaryName+"</span>: "+
              comparedSummary.printAggrSelection(comparedAggr)+"</span></span>";
        });
        encoding +="<p>";
      }
      return intro+ranking+encoding;
    },
    },
  { matches: '.summaryName_text', 
    component: "Summary Name",
    },
  { matches: '.percentileGroup', 
    component: "Percentile Chart",
    info: function(DOM){
      var summary = DOM.__data__;
      return ""+
        "<p>This shows the distribution of "+summary.summaryName+" values in percentiles.</p>"+
        "<p>Percentile groups are shown in [10-90%], [20-80%], [30-70%], [40-60%] ranges.<br>"+
        "Smaller ranges, towards the middle, have darker color.<br>"+
        "The median (%50) is also shown as <b>|</b>.</p>"
    },
    },
  { matches: ".summaryConfig_Percentile", component: "Percentile Chart" },
  { matches: ".summaryConfig_ScaleType", component: "Range Scale Type" },
  { matches: '.aggrGlyph',
    component: "Aggregate"
    },
  { matches: '.catGlyph', 
    component: "Category",
    info: function(DOM){
      var aggr = DOM.__data__;
      var summary = aggr.summary;
      var aggrLabel = summary.catLabel_Func.call(aggr.data);
      // TODO: Show if it is filtered or compared
      // If browser is filtered, say it is unde filtered setting.
      var str="<p>There are <span class='bolderInfo'>"+aggr._measure.Active+"</span> "+ this.browser.recordName+" in "+
        "<span class='bolderInfo'>"+aggrLabel+"</span> category";
      if(browser.isFiltered()){
        str+=", among the active (filtered) data.</p>";
        str+="<p>This category includes <span class='bolderInfo'>"+aggr._measure.Total+"</span> "+this.browser.recordName+" in total";
      }
      var _measure;
      switch(this.browser.measureFunc){
        case 'Count': _measure = "Count"; break;
        case 'Sum':   _measure = "Sum"; break;
        case 'Avg':   _measure = "Average"; break;
      }

      var encoding = "<p>Measurements are visualized using bar length <i class='fa fa-long-arrow-right'></i>.<br>";
      encoding += "<span class='fa fa-long-arrow-right colorCoding colorCoding-filtered'></span> "+_measure+" of active (filtered) records.<br>";
      encoding += "<span class='fa fa-long-arrow-right colorCoding colorCoding-highlighted'></span> "+_measure+" of highlighted <i class='fa fa-mouse-pointer'></i> records.<br>";

      if(this.browser.isFiltered()){
        encoding+="<span class='fa fa-long-arrow-right colorCoding colorCoding-total'></span> "+_measure+" of all records.<br>";
      }
      if(this.browser.selectedAggr.Compare_A){
        encoding+="<span class='fa fa-long-arrow-right colorCoding colorCoding-compare_A'></span> "+_measure+" of locked <i class='fa fa-lock'></i> records.<br>";
      }
      if(this.browser.selectedAggr.Compare_B){
        encoding+="<span class='fa fa-long-arrow-right colorCoding colorCoding-compare_B'></span> "+_measure+" of locked <i class='fa fa-lock'></i> records.<br>";
      }
      if(this.browser.selectedAggr.Compare_C){
        encoding+="<span class='fa fa-long-arrow-right colorCoding colorCoding-compare_C'></span> "+_measure+" of locked <i class='fa fa-lock'></i> records.<br>";
      }
      encoding+="</p>";

      return str+=".</p>"+encoding;
    },
    },
  { matches: '.rangeGlyph', 
    component: "Range",
    info: function(DOM){
      var aggr = DOM.__data__;
      var summary = aggr.summary;
      var _min = summary.printWithUnitName(aggr.minV);
      var _max = summary.printWithUnitName(aggr.maxV);

      var _measure;
      switch(this.browser.measureFunc){
        case 'Count': _measure = "Count"; break;
        case 'Sum':   _measure = "Sum"; break;
        case 'Avg':   _measure = "Average"; break;
      }

      var encoding = "<p>Measurements are visualized using bar height <i class='fa fa-long-arrow-up'></i>.<br>";
      encoding += "<span class='fa fa-long-arrow-up colorCoding colorCoding-filtered'></span> "+_measure+" of active (filtered) records.<br>";
      encoding += "<span class='fa fa-long-arrow-up colorCoding colorCoding-highlighted'></span> "+_measure+" of highlighted <i class='fa fa-mouse-pointer'></i> records.<br>";

      if(this.browser.isFiltered()){
        encoding+="<span class='fa fa-long-arrow-up colorCoding colorCoding-total'></span> "+_measure+" of all records.<br>";
      }
      if(this.browser.selectedAggr.Compare_A){
        encoding+="<span class='fa fa-long-arrow-up colorCoding colorCoding-compare_A'></span> "+_measure+" of locked <i class='fa fa-lock'></i> records.<br>";
      }
      if(this.browser.selectedAggr.Compare_B){
        encoding+="<span class='fa fa-long-arrow-up colorCoding colorCoding-compare_B'></span> "+_measure+" of locked <i class='fa fa-lock'></i> records.<br>";
      }
      if(this.browser.selectedAggr.Compare_C){
        encoding+="<span class='fa fa-long-arrow-up colorCoding colorCoding-compare_C'></span> "+_measure+" of locked <i class='fa fa-lock'></i> records.<br>";
      }
      encoding+="</p>";

      return ""+
        "<p>There are "+
          "<span class='bolderInfo'>"+aggr._measure.Active+"</span> "+ this.browser.recordName+" between "+
          "<span class='bolderInfo'>"+_min+"</span> to "+
          "<span class='bolderInfo'>"+_max+"</span> "+
          "<span class='bolderInfo'>"+aggr.summary.summaryName+"</span>.</p>"+
          encoding;
    }
    },
  { matches: ".quantile.q_pos.q_50", component: "Median" },
  { matches: ".recordTextSearch", component: "Record Text Search" },
  { matches: '.measurePercentControl', 
    component: "Measure Label Mode",
    info: function(DOM){
      var _p = "percent (%) of the filtered records";
      var _a = "absolute (#) value"
      var mode       = this.browser.percentModeActive?_p:_a;
      var mode_other = this.browser.percentModeActive?_a:_p;
      var summary = DOM.__data__;
      var aggr;
      if(summary.type==='categorical'){
        aggr = summary._cats[0]; // TODO: What if it is an interval summary?
      } else {
        aggr = summary.histBins[0];
      }
      var _active = aggr._measure.Active;
      var _total  = this.browser.allRecordsAggr.recCnt.Active;
      var _filtered = this.browser.isFiltered()?" currently filtered ":"";
      return ""+
        "<p>Measurements are labeled as <span class='bolderInfo'>"+mode+"</span>. "+
        "The alternative is labeling as <span class='bolderInfo'>"+mode_other+"</span>.<p>"+
        "<p>For example, <span class='bolderInfo'>"+_active+"</span> "+this.browser.recordName+" can be labeled as "+
          "<span class='bolderInfo'>"+Math.round(100*_active/_total)+"%"+"</span>"+
            " of the <span class='bolderInfo'>"+_total+"</span> "+_filtered+this.browser.recordName+".</p>"+
        "<p>All summaries share the same measure label mode.</p>"+
        "";
    }},
  { matches: '.missingValueAggr', 
    component: "Missing records",
    info: function(DOM){
      return "<i class='fa fa-ban'></i> shows the records with missing values in the summary."
    }
    },
  { matches: '.showHelpIn',
    component: "Help Button",
    info: function(DOM){
      return "<p>Click <i class='fa fa-question-circle'></i> to get help for exploring data with Keshif.</p>"+
        "<p>"+
          "<span class='bolderInfo'>Point &amp; Learn</span> informs about the region you point.<br>"+
          "<span class='bolderInfo'>Browse Topics</span> lets you see and filter all help topics.<br>"+
          "<span class='bolderInfo'>Guided Tour</span> presents help information step-by-step.<br>"+
        "</p>"
    }},
  { matches: ".recordInfo",
    component: "Global measurement &amp; Measure function",
    info: function(DOM){
      var alternative = "";
      switch(this.browser.measureFunc){
        case 'Count': alternative = "<span class='bolderInfo'>sum</span> or <span class='bolderInfo'>average</span> of a numeric attribute"; break;
        case 'Sum':   alternative = "<span class='bolderInfo'>count</span> of records, or <span class='bolderInfo'>average</span> of a numeric attribute"; break;
        case 'Avg':   alternative = "<span class='bolderInfo'>count</span> of records, or <span class='bolderInfo'>sum</span> of a numeric attribute"; break;
      }
      // TODO: respons to filtering state
      return ""+
        "<p>This shows the number of records in the dataset.</p>"+
        "<p>The <span class='bolderInfo'>measure function</span> is set by clicking here."+
        "Other options are "+alternative+".</p>"+
        "<p>All summaries share the same measure function.</p>"+
        "";
    } },
  { matches: '.totalGlyph',
    component: "Global Summary",
    info: function(){
      return "<p>The bars in this section visualize the measurements for the complete datasets along "+
        "<i class='fa fa-long-arrow-right'></i>.</p>";
    }
    },
  { matches: '.scaleModeControl', 
    component: "Visual Scale Mode",
    info: function(DOM){ 
      var _p = "part-of filtered records";
      var _a = "absolute"
      var mode       = this.browser.percentModeActive?_p:_a;
      var mode_other = this.browser.percentModeActive?_a:_p;
      return ""+
        "<p>Measurements are visually scaled as <span class='bolderInfo'>"+mode+"</span> value. "+
        "The alternative is <span class='bolderInfo'>"+mode_other+"</span>.<p>"+
        "<p>Part-of scale reveals distribution information on highlight and compare selections.</p>"+
        "<p>All summaries share the same visual scale mode.</p>"+
        "";
        ; 
    }},
  { matches: '.recordDisplay', 
    component: "Record Panel",
    info: function(DOM){ 
      var summary = this.browser.recordDisplay.sortingOpt_Active;
      return ""+
        "<p>This panel displays each record individually.</p>"+
        "<p>Records are currently sorted by <span class='bolderInfo'>"+summary.summaryName+"</span>.</p>"+
        "<p>You can sort record by any number or time summary.</p>"; 
    }},
  // { matches: '.panel',  component: "Summary Panel" }, // Adds too big of a highlighted area. Messes up with some text.
  { matches: '.breadcrumbs', 
    component: "Breadcrumbs",
    info: function(DOM){ 
      var totalSel = this.browser.DOM.breadcrumbs.selectAll(".breadCrumb")[0].length;
      var filterSel = this.browser.DOM.breadcrumbs.selectAll(".crumbMode_Filter")[0].length;
      var compareSel = this.browser.DOM.breadcrumbs.selectAll('[class*="crumbMode_Compare_"]')[0].length;
      if(filterSel===0) filterSel = "none";
      if(compareSel===0) compareSel = "none";
      return ""+
      "<p>This section shows the active selections. </p>"+
      "<p>"+
        "<i class='helpin-breadcrumb fa fa-filter'></i> = Filtered selection "+
          "<span style='font-weight:100')>(currently "+filterSel+")</span><br>"+
        "<i class='helpin-breadcrumb fa fa-mouse-pointer'></i> = Highlighted selection "+
          "<span style='font-weight:100')>(currently none)</span><br>"+
        "<i class='helpin-breadcrumb fa fa-lock'></i> = Compared selection "+
          "<span style='font-weight:100')>(currently "+compareSel+")</span><br>"+
      "</p>"
      ; 
    },
    },
  { matches: '.breadcrumbs > .breadCrumb',
    component: "Breadcrumb",
    info: function(DOM){ 
      var x;
      switch(DOM.classList[1]){
        case "crumbMode_Compare_A": x="<i class='fa fa-lock'></i> compare"; break;
        case "crumbMode_Compare_B": x="<i class='fa fa-lock'></i> compare"; break;
        case "crumbMode_Compare_C": x="<i class='fa fa-lock'></i> compare"; break;
        case "crumbMode_Filter":    x="<i class='fa fa-filter'></i> filter";  break;
        default: x = "<i class='fa fa-mouse-pointer'></i> highlight"; break;
      };
      return "<p>Breadcrumbs show an active selection state.</p>"+
        "<p>This breadcrumb shows a "+x+" selection.</p>";
    } 
    },
  //{ matches: '.buttonSummaryCollapse', component: "Summary" },
  { matches: '.useForRecordDisplay', 
    component: "Sort Records By..." },
  { matches: '.summaryDescription', 
    component: "Summary Description" },
  { matches: '.authorButton',
    component: 'Authoring Mode' },
  { matches: '.filterClearAll',
    component: "Clear filtering" },
  { matches: '.unitName', 
    component: "Unit Name" },
  { matches: '.recordSortButton', 
    component: "Reverse sort records" },
  { matches: '.controlLine > .rangeHandle',
    component: "Filter range limit" },
  { matches: '.listSortOptionSelect', 
    component: "Sort records by..." },
  { matches: '.datasource', 
    component: "Data Source" },
  { matches: '.recordToggleDetail', 
    component: "Record Details" },
  { matches: '.measureLabel',  
    component: "Measurement Label" },
  { matches: '.measure_Total', 
    component: "Total Measure" },
  { matches: '.measure_Active', 
    component: "Active Measure" },
  { matches: '.measure_Highlight', 
    component: "Highlighted Measure" },
  { matches: '[class^="measure_Compare_"]', 
    component: "Compared Measure" },
  { matches: '.lockButton', 
    component: "Lock Button" },
  { matches: '.breadcrumbs > [class*="crumbMode_Compare_"]',
    component: "Compare Selection" },
  { matches: '.breadcrumbs > .crumbMode_Filter',
    component: "Filter Selection" },
  { matches: '.saveSelection',
    component: "Save Filter Selection" },
];

var Helpin = function(browser){
  var me = this;
  this.browser = browser;

  this.DOM = {
    root: browser.DOM.root.select(".overlay_help"),
    overlay_answer: browser.DOM.root.select(".overlay_answer")
  };

  this.DOM.overlay_answer_background = this.DOM.overlay_answer.append("div")
    .attr("class","overlay_answer_background")
    .on("click", function(){
      me.browser.panel_overlay.attr("attention",true);
      setTimeout(function(){ me.browser.panel_overlay.attr("attention",null); }, 1200);
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

  this.selectedQuestion = null;
  this.GuidedTourStep = 0;

  this.icons = {
    explore: 'compass',
    //filter: 'filter helpin-breadcrumb',
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
    transform_data: 'clone'
  };

};

Helpin.prototype = {
  /** -- */
  evaluateContext: function(topic, in_summary){
    // Initialize context elements
    // Need to do it for every topic, since these arrays can be filtered in evaluation process.
    this.context.summaries     = this.browser.summaries;
    this.context.browser       = this.browser;
    this.context.recordDisplay = this.browser.recordDisplay;

    // Checking across a single summary
    if(in_summary) this.context.summaries = [in_summary];

    topic.relevanceWeight = 0;
    topic.isRelevant = true;
    
    topic.context.forEach(function(c){
      var topicContext = c.topicContext;
      var isRelevant = false;
      if(typeof topicContext.v==="object"){
        if(topicContext.v.summaries){
          this.context.summaries = this.context.summaries.filter(topicContext.v.summaries);
          isRelevant = this.context.summaries.length>0;
        }
      } else if(typeof topicContext.v==="function"){
        isRelevant = topicContext.v.call(this.context);
        if(isRelevant===undefined || isRelevant===null || isRelevant===[]) isRelevant = false;
      }
      if(isRelevant || topicContext.fixBy){ // relevant, or can be made relevant with another action
        topic.relevanceWeight += topicContext.weight;
      }

      c.isRelevant = isRelevant;

      topic.isRelevant = topic.isRelevant && isRelevant;
    },this);

    return topic.isRelevant;
  },
  /** -- */
  context_highlight: function(answer){
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

    if(answer.filter) answer.filter.call(this);

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
    if(typeof topic.q === "string")   return topic.q;
    if(typeof topic.q === "function") return topic.q.call(this,topic);
  },
  /** -- */
  getIcon: function(word, prefix){
    var v=word.replace(" ","_").replace("/","_").toLowerCase();
    if(this.icons[v]) return prefix+" fa fa-"+this.icons[v]; 
    return "";
  },
  /** -- */
  initData: function(){
    var actions_by_name = {};
    var topics_by_name = {};

    for(var i in _topics){
      _topics[i].id = i;
      this.topicsList.push(_topics[i]);
    }

    this.topicsList.forEach(function(q){
      q.displayed = true;

      if(q.context===undefined) q.context = "True";
      if(!Array.isArray(q.context)) q.context = [q.context];
      q.context.forEach(function(c,i){
        q.context[i] = {
          isRelevant: true,
          topicContext: _contextFeatures[c]
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
      q.tAnswer.forEach(function(answer){
        if(answer.sequence){
          answer.sequence.forEach(function(a){ addByDOMSelector.call(this,a); },this);
        } else {
          addByDOMSelector.call(this,answer);
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

    if(this.selectedQuestion) this.closeQuestion();

    this.closePointNLearn();

    this.browser.panel_overlay.attr("show","help-browse");
    this.DOM.root.style({left: null, right: null, top: null, bottom: null});
    this.DOM.root.attr("hideRelatedTopics",null);

    this.DOM.helpin_Header.selectAll('span[class^="helpInMode_"]').attr("active",null);
    this.DOM.helpin_Header.select(".helpInMode_BrowseTopics").attr("active",true);

    this.DOM.TopicBlock.style("font-size",null);

    this.DOM.TopicsList[0][0].scrollTop = 0;

    // Clear all filtering. :: TODO: Check / incomplete
    
    // Show only relevant by default
    //this.DOM.hideNonRelevant.attr("hide",true);
    //this.qFilters.relevant = true;

    while(true){
      if(this.qFilters.topics.length===0) break;
      this.unselectKeyword(this.qFilters.topics[0]);
    }
    this.DOM.SearchTextBox[0][0].focus();

    this.filterTopics();

    // Need to eval topic text again bc it might be context-dependant
    this.DOM.TopicText.html(function(topic){ return me.getTopicText(topic); } );
  },
  /** -- */
  initDOM: function(){
    var me=this;

    if(this.DOM.SearchBlock) {
      if(this.selectedQuestion) this.closeQuestion();
      this.showPointNLearn();
      return;
    }

    this.initData();

    this.initDOM_Header();
    this.initDOM_ClosePanel();

    this.initDOM_GuidedTour();

    var X = this.DOM.root.append("div").attr("class","PointNClick_Info");
    X.append("div").attr("class","DescriptionToFreeze")
      .html("<i class='fa fa-hand-pointer-o'></i> Point to your interest. "+
        "<i class='fa fa-bullseye'></i><b> Click to freeze selection.</b>");
    X.append("div").attr("class","DescriptionToUnFreeze")
      .html("<i class='fa fa-bullseye'></i><b> Click to un-freeze selection.</b>")
      .on("click",function(){
        if(me.lockedBox) {
          me.lockedBox.removeAttribute("locked");
          me.lockedBox = false;
        }
        me.DOM.root.attr("hideRelatedTopics",true).attr("lockedPointNLearn",null);
      });


    this.DOM.SelectedThing = this.DOM.root.append("div").attr("class","SelectedThing");
    this.DOM.SelectedThing_Header  = this.DOM.SelectedThing.append("div").attr("class","SelectedThing_Header");
    this.DOM.SelectedThing_Content = this.DOM.SelectedThing.append("div").attr("class","SelectedThing_Content");
    this.DOM.SelectedThing_Content_More = this.DOM.SelectedThing.append("div").attr("class","SelectedThing_Content_More");

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
    this.DOM.RelatedTopics.append("div").attr("class","TopicInfoShowHide")
      .on("click",function(){
        // TODO Show/hide related topics...
      });

    this.DOM.heyooo = this.DOM.root.append("div").attr("class","heyooo");

    this.DOM.browseTopicBlock = this.DOM.heyooo.append("div").attr("class","browseTopicBlock");
    this.DOM.SearchBlock = this.DOM.browseTopicBlock.append("div").attr("class","SearchBlock");
    this.initDOM_TextSearch();
    this.initDOM_FilterTypes();

    this.initDOM_Questions();
    this.initDOM_MoreDocumentation();

    this.showPointNLearn();
  },
  /** -- */
  initDOM_Header: function(){
    var me=this;

    this.DOM.helpin_Header = this.DOM.root.append("div").attr("class","helpin_Header")
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

    this.DOM.helpin_Header.append("span").attr("class",'BackButton fa fa-chevron-circle-left')
      .on("click",function(){ me.showBrowseTopics(); });

    this.DOM.helpin_Header.append("span").attr("class","helpInMode_PointNLearn")
      .html("<i class='fa fa-hand-pointer-o'></i> Point & Learn")
      .on("click",function(){ me.showPointNLearn(); });
    this.DOM.helpin_Header.append("span").attr("class","helpInMode_BrowseTopics")
      .html("<i class='fa fa-search'></i> Browse Topics")
      .on("click",function(){ me.showBrowseTopics(); });
    this.DOM.helpin_Header.append("span").attr("class","helpInMode_GuidedTour")
      .html("<i class='fa fa-location-arrow'></i> Guided Tour")
      .on("click",function(){ me.showGuidedTour(); });
  },
  /** -- */
  initDOM_ClosePanel: function(){
    var me=this;
    this.DOM.root.append("div").attr("class","overlay_Close fa fa-times-circle")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'e', title: kshf.lang.cur.Close }); })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide(); me.closePanel(); });
  },
  /** -- */
  initDOM_GuidedTour: function(){
    var me=this;
    this.DOM.GuidedTour = this.DOM.root.append("div").attr("class","GuidedTour");

    this.DOM.GuidedTour.append("span").attr("class","TourStep PreviousStep")
      .html("<i class='fa fa-arrow-left' style:'font-size: 0.8em;'></i> Previous")
      .on("click",function(){
        if(me.GuidedTourStep===0) return;
        --me.GuidedTourStep;
        me.pointedTourCheck();
        me.learnAboutPointed(me.GuidedTourDOMs[me.GuidedTourStep], false);
      });

    this.DOM.GuidedTour.append("span").attr("class","TourStep NextStep")
      .html("Next <i class='fa fa-arrow-circle-right'></i>")
      .on("click",function(){
        if(me.GuidedTourStep===me.GuidedTourDOMs.length-1) return;
        ++me.GuidedTourStep;
        me.pointedTourCheck();
        me.learnAboutPointed(me.GuidedTourDOMs[me.GuidedTourStep], false);
      });

    this.DOM.GuidedTour.append("span").attr("class","GuidedTourHead")
      .html("<i class='fa fa-location-arrow'></i> Guided Tour");
  },
  /** -- */
  initDOM_TextSearch: function(){
    var me=this;
    var browser = this.browser;
    this.DOM.TextSearchBlock = this.DOM.SearchBlock.append("div").attr("class","TextSearchBlock");
    this.DOM.TextSearchBlock.append("span").attr("class","HowDoI").html("How do I ?");
    this.DOM.SearchTextBox = this.DOM.TextSearchBlock.append("input").attr("class","SearchTextBox")
      .attr("type","text")
      .attr("placeholder","explore")
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
    if(this.selectedQuestion===q) {
      return;
    } else if(this.selectedQuestion){
      this.closeQuestion();
    }

    this.answerSequencePos = 0;

    this.closePointNLearn();

    this.DOM.helpin_Header.selectAll('span[class^="helpInMode_"]').attr("active",null);

    this.selectedQuestion = q;
    this.evaluateContext(q);

    this.browser.panel_overlay.attr("show","answer");
    this.DOM.root.style({left: null, right: null, top: null, bottom: null});

    this.DOM.overlay_answer.selectAll(".answerBox").remove();

    // Show topic note
    this.DOM.SelectedThing_Content_More.html(q.note);

    this.DOM.SelectedThing_Header.html(this.getTopicText(q));

    // SHOW RELEVANT WHEN...

    // 1) Sort 
    q.context = q.context.sort(function(a,b){ return b.isRelevant - a.isRelevant; });
    // 2) Show
    this.DOM.ContextContent.selectAll(".ContextItem").data([]).exit().remove();
    var X = this.DOM.ContextContent.selectAll(".ContextItem").data(q.context, function(c){ return c.topicContext.name; })
      .enter().append("div").attr("class","ContextItem")
      .attr("isRelevant", function(c){ return c.isRelevant; });
    X.append("i").attr("class",function(c){ return "RelevantIcon fa fa-"+(c.isRelevant?"check-circle":"times-circle"); });
    X.append("span").html(function(c){ return c.topicContext.name });
    X.filter(function(c){ return !c.isRelevant && c.topicContext.fixBy; })
      .append("span").attr("class","MakeRelevantTopic").text("How?")
        .on("click", function(c){ me.selectTopic(_topics[c.topicContext.fixBy]); });

    this.DOM.TopicRelWhenBlock.attr("showBlockContent",!q.isRelevant);

    me.DOM.TopicBlock.style("display","none");
    q.similarTopics.forEach(function(c){ _topics[c].DOM.style("display","block"); });

/*
    this.DOM.SimilarTopicsContent.selectAll(".SimilarTopicItem").data([]).exit().remove();
    X = this.DOM.SimilarTopicsContent.selectAll(".SimilarTopicItem").data(q.similarTopics, function(c){ return c; })
      .enter().append("div").attr("class","SimilarTopicItem");
    X.append("span").attr("class","SimilarTopicItemText")
      .html(function(c){ return me.getTopicText(_topics[c]); })
      .on("click", function(c){ me.selectTopic(_topics[c]); });
      */

    // put the answer in the help box (not on the element)
    me.DOM.SelectedThing_Content.html("");
    q.tAnswer.forEach(function(answer){
      var t="";
      if(answer.sequence){
        answer.sequence.forEach(function(a){
          var x=a.text;
          if(typeof x=== "function") x = x.call(me);
          t+="<span class='subAnswer'>"+x+"</span> ";
        });
      } else {
        t = answer.text;
        if(typeof t=== "function") t = t.call(me);
      }
      t = t.replace(/\<br\>/gi,' ');
      me.DOM.SelectedThing_Content.append("div").attr("class","answerTooltip").html(t);
    });

    if(q.isRelevant){
      this.context.HighlightedDOM = [];
      this.context.HighlightedDOM_All = []; // can be multiple calls...
      if(q.activate || q.tAnswer.length>0) {
        setTimeout(function(){
          q.tAnswer.forEach(function(answer){
            if(answer.sequence){
              me.context_highlight(answer.sequence[me.answerSequencePos]); // first step
            } else {
              me.context_highlight(answer);
            }
          });

          if(q.activate) q.activate.call(me,q);

          me.createStencils();
        }, 500);
      }
    }
  },
  /** -- */
  createStencils: function(){
    // Create transparent window in the dark overlay on the interface
    var total_width  = parseInt(this.browser.DOM.root.style("width"));
    var total_height = parseInt(this.browser.DOM.root.style("height"));
    var dPath = "M 0 0 h "+total_width+" v "+total_height+" h -"+total_width+" Z ";
    this.DOM.overlay_answer.selectAll(".highlightBox").each(function(d,i){
      dPath += "M "+this.left+" "+this.top+" h "+this.width+" v "+this.height+" h -"+this.width+" Z ";
    });
    this.DOM.overlay_answer_background.style("-webkit-mask-image",
      "url(\"data:image/svg+xml;utf8,"+
      "<svg xmlns='http://www.w3.org/2000/svg' width='"+total_width+"' height='"+total_height+"'>"+
        "<path d='"+dPath+"' fill-rule='evenodd' fill='black' />"+
      "</svg>\")"
      );
  },
  /** -- */
  initDOM_Questions: function(){
    var me=this;

    this.DOM.TopicsList = this.DOM.heyooo.append("div").attr("class","TopicsList");
    this.DOM.TopicBlock = this.DOM.TopicsList
      .selectAll(".TopicBlock").data(this.topicsList, function(topic){ return topic.id; }).enter()
        .append("div").attr("class","TopicBlock")
        .each(function(topic){ topic.DOM = d3.select(this); })
        .on("click", function(topic){ me.selectTopic(topic); });

    this.DOM.TopicBlock.append("div").attr("class","TopicIcons")
      .selectAll(".icon").data(function(d){ return d.actions.concat(d.topics); })
        .enter().append("span")
          .attr("class",function(d){ return me.getIcon(d, "icon"); })
          .attr("title",function(d){ return d; });

    this.DOM.TopicBlock.append("div").attr("class","notInContext fa fa-exclamation-circle")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'nw', title: "Not applicable" }); })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); });

    this.DOM.TopicText = this.DOM.TopicBlock.append("div").attr("class","TopicText")
      .html(function(topic){ return me.getTopicText(topic); } );
  },
  /** -- */
  initDOM_MoreDocumentation: function(){
    this.DOM.root.append("div").attr("class","MoreDocumentation")
      .html("For more info (including the API), visit the "+
        "<a href='http://github.com/adilyalcin/Keshif/wiki' target='_blank' class='MoreDocumentationLink'>Keshif wiki</a>");
  },
  /** -- */
  fHighlightBox: function(text,pos){
    var me=this;
    var bounds_browser = this.browser.DOM.root[0][0].getBoundingClientRect();

    kshf.activeTipsy = null;

    if(pos===undefined) pos = "w";
    if(typeof text === "function") text = text.call(this.context);

    var X = this.DOM.overlay_answer.selectAll(".highlightBox_nomatch")
      .data(this.context.HighlightedDOM, function(d,i){ return i; })
      .enter().append("div").attr("class","highlightBox answerBox")
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
        this.tipsy = new Tipsy(this, { gravity: pos, title: text, className: "tipsy-helpin" }); 
        me.tooltips.push(this.tipsy);
        this.tipsy.show();
      })
      // TODO: event might not be click, might be a custom handler / function call, or other type of DOM event
      .on("click.close",function(boxDOM){
        boxDOM.dispatchEvent(new MouseEvent('click', { 'view': window, 'bubbles': true, 'cancelable': true }));
        var seq = me.selectedQuestion.tAnswer[0].sequence
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
  showPanel: function(){
    var me=this;
    document.onkeyup=function(e) {
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

    this.closeQuestion();
    this.browser.panel_overlay.attr("show","none");
    this.DOM.overlay_answer.on("mousemove.helpin",null).on("click.helpin",null);
    this.DOM.overlay_answer.selectAll(".answerBox").remove();
  },
  /** -- */
  removeTooltips: function(){
    this.browser.DOM.root.selectAll(".tipsy").remove();
    kshf.activeTipsy = null;
    this.DOM.overlay_answer.selectAll(".answerBox").remove();
    if(this.context.HighlightedDOM_All.length>0){
      this.context.HighlightedDOM_All.forEach(function(DOM){ DOM.removeAttribute("helpin"); })
    }
    if(this.selectedQuestion.deactivate) {
      this.selectedQuestion.deactivate.call(this, this.selectedQuestion);
    }
    this.tooltips.forEach(function(t){ t.hide(); });
  },
  /** -- */
  closeQuestion: function(){
    if(this.selectedQuestion===null) return;
    this.DOM.overlay_answer_background.style("-webkit-mask-image",null);

    this.DOM.SelectedThing_Content.selectAll("div").data([]).exit().remove();

    if(this.selectedQuestion.isRelevant) this.removeTooltips();

    this.selectedQuestion = null;
  },
  /** -- */
  sortTopicsByRelevance: function(){
    // sort by relevance
    this.topicsList = this.topicsList.sort(function(a,b){ 
      if(a.isRelevant && !b.isRelevant) return -1;
      if(b.isRelevant && !a.isRelevant) return 1;
      var x = b.relevanceWeight - a.relevanceWeight; 
      if(x) return x;
      return b.id - a.id; // same weight, make sure sort is stable
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
  pointedTourCheck: function(){
    this.DOM.root.select(".TourStep.PreviousStep")
      .style("display", (this.GuidedTourStep===0)?"none":null);
  },
  /** -- */
  learnAboutPointed: function(pointedDOM, traverse){
    var me=this;
    if(traverse===undefined) traverse = true;

    this.DOM.TopicBlock.style("display","none");

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
      return DOMtoName.some(function(x){ return dom.matches(x.matches); });
    });

    pointedDOMTree = pointedDOMTree.slice(0,2);

    // process each matching components to detect related topics and print title / description.
    pointedDOMTree.forEach(function(dom, i){
      DOMtoName.forEach(function(x){
        if(!dom.matches(x.matches)) return;
        dom.__temp__ = x.component;

        var keyword = me.keywordsIndexed[x.component];
        if(keyword){
          keyword.questions.forEach(function(topic){
            if(dom.__data__ instanceof kshf.Summary_Base){
              me.evaluateContext(topic, dom.__data__); // pass the summary object for focused evaluation
            }
            topic.mostSpecific = topic.mostSpecific || i===0;
            topic.relevanceWeight += 1000*(pointedDOMTree.length-i);
            topic.DOM.style("display","block");
          });
        }

        // Print title and description
        if(x.component && !titlePrinted){
          me.DOM.SelectedThing_Header.html("<i class='fa fa-hand-pointer-o'></i> "+x.component+"</div>");
        }
        if(x.info && !infoPrinted) {
          if(x.component){
            me.DOM.SelectedThing_Header.html("<i class='fa fa-hand-pointer-o'></i> "+x.component+"</div>");
            titlePrinted = true;
          }
          me.DOM.SelectedThing_Content.html(x.info.call(me, dom));
          infoPrinted = true;
        }
      });
    });

    this.sortTopicsByRelevance();
    this.refreshTopicsOutOfContext();
    this.DOM.TopicBlock.style("font-size",function(d){
      if(d.mostSpecific) return "0.9em";
    });

    // ADD DOM TREE BOXES

    pointedDOMTree.reverse();
    var bounds_browser = this.browser.DOM.root[0][0].getBoundingClientRect();

    this.DOM.overlay_answer.selectAll(".answerBox").remove();
    var X = this.DOM.overlay_answer.selectAll(".domTreeBox")
      .data(pointedDOMTree, function(d,i){ return i; })
      .enter().append("div").attr("class","domTreeBox answerBox")
        .each(function(d){ 
          this.bounds = d.getBoundingClientRect();
          this.left   = this.bounds.left-bounds_browser.left-2;
          this.width  = this.bounds.width+4;
          this.top    = this.bounds.top-bounds_browser.top-2;
          this.height = this.bounds.height+4;
        })
        .style("left",  function(){ return this.left  +"px"; })
        .style("width", function(){ return this.width +"px"; })
        .style("top",   function(){ return this.top   +"px"; })
        .style("height",function(){ return this.height+"px"; });
    X.append("div").attr("class","domName")
      .attr("primary", function(d,i){ return (i===pointedDOMTree.length-1)?"true":null; })
      .html(function(d){ return d.__temp__; });

    if(pointedDOMTree.length>0){
      // CREATE WINDOW / STENCIL ON THE SEMI-TRANSPARENT OVERLAY
      var total_width  = parseInt(this.browser.DOM.root.style("width"));
      var total_height = parseInt(this.browser.DOM.root.style("height"));
      var dPath = "M 0 0 h "+total_width+" v "+total_height+" h -"+total_width+" Z ";
      X.filter(function(d,i){ return i===0;}).each(function(d,i){
        dPath += "M "+this.left+" "+this.top+" h "+this.width+" v "+this.height+" h -"+this.width+" Z ";
      });
      this.DOM.overlay_answer_background.style("-webkit-mask-image",
        "url(\"data:image/svg+xml;utf8,"+
        "<svg xmlns='http://www.w3.org/2000/svg' width='"+total_width+"' height='"+total_height+"'>"+
          "<path d='"+dPath+"' fill-rule='evenodd' fill='black' />"+
        "</svg>\")"
        );
    }

    setTimeout(function(){ me.repositionHelpMenu(); }, 1000);    
  },
  /** -- */
  showPointNLearn: function(){
    var me=this;
    this.showPanel();

    if(this.browser.panel_overlay.attr("show")==="help-pointnlearn") return;
    if(this.selectedQuestion) this.closeQuestion();

    this.browser.panel_overlay.attr("show","help-pointnlearn");

    this.DOM.helpin_Header.selectAll('span[class^="helpInMode_"]').attr("active",null);
    this.DOM.helpin_Header.select(".helpInMode_PointNLearn").attr("active",true);

    this.DOM.root.style({left: null, right: null, top: null, bottom: null});
    this.DOM.root.attr("hideRelatedTopics",true).attr("lockedPointNLearn",null);
    this.DOM.TopicBlock.style("display","none");

    this.lockedBox = false;

    this.DOM.overlay_answer
      .on("click.helpin",function(){
        if(me.lockedBox){
          me.lockedBox.removeAttribute("locked");
          me.DOM.root.attr("hideRelatedTopics",true).attr("lockedPointNLearn",null);
          me.lockedBox = false;
        } else {
          d3.event.target.setAttribute("locked",true);
          me.DOM.root.attr("hideRelatedTopics",null).attr("lockedPointNLearn",true);
          me.checkBoxBoundaries();
          me.lockedBox = d3.event.target;
        }
        d3.event.stopPropagation();
        d3.event.preventDefault();
      })
      .on("mousemove.helpin",function(){
        if(me.lockedBox || me.movingBox) return;
        d3.event.stopPropagation();
        d3.event.preventDefault();

        this.style.pointerEvents = "none";
        this.parentNode.style.pointerEvents = "none";

        me.learnAboutPointed(document.elementFromPoint(d3.event.clientX, d3.event.clientY));

        // unroll pointer-event pass style - end of mousemove event
        this.style.pointerEvents = null;
        this.parentNode.style.pointerEvents = null;
      });
  },
  /** -- */
  closePointNLearn: function(){
    this.DOM.overlay_answer.on("mousemove.helpin",null).on("mousemove.click",null);
    this.DOM.overlay_answer.selectAll(".answerBox").remove();
    this.DOM.overlay_answer_background.style("-webkit-mask-image",null);
  },
  /** -- */
  showGuidedTour: function(){
    var me=this;

    this.showPanel();

    if(this.selectedQuestion) this.closeQuestion();

    this.browser.panel_overlay.attr("show","help-guidedtour");

    this.DOM.helpin_Header.selectAll('span[class^="helpInMode_"]').attr("active",null);
    this.DOM.helpin_Header.select(".helpInMode_GuidedTour").attr("active",true);

    this.DOM.root.style({left: null, right: null, top: null, bottom: null});
    this.DOM.root.attr("hideRelatedTopics",true);
    this.DOM.TopicBlock.style("display","none");

    this.GuidedTourDOMs = [];

    this.GuidedTourDOMs.push(this.browser.records[3].DOM.record); // individual record
    this.GuidedTourDOMs.push(this.browser.summaries[0].DOM.root[0][0]); // categorical summary
    this.GuidedTourDOMs.push(this.browser.summaries[0]._cats[0].DOM.aggrGlyph); // category

    // TODO: Selections... - highlight, compare, filter, 
    
    this.GuidedTourDOMs.push(this.browser.DOM.recordInfo[0][0]); // global summary
    this.GuidedTourDOMs.push(this.browser.DOM.breadcrumbs[0][0]); // breadcrumb
    
    this.GuidedTourDOMs.push(this.browser.summaries[0].DOM.scaleModeControl[0][0]); // scale mode control
    this.GuidedTourDOMs.push(this.browser.summaries[0].DOM.measurePercentControl[0][0]); // measure label control
    
    this.GuidedTourDOMs.push(this.browser.recordDisplay.DOM.listSortOptionSelect[0][0]); // change record sorting dropbox

    // TODO: minimize/maximize summary

    this.GuidedTourDOMs.push(this.browser.DOM.showHelpIn[0][0]); // get help
    
    this.pointedTourCheck();
    this.learnAboutPointed(this.GuidedTourDOMs[this.GuidedTourStep], false);
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
    this.DOM.overlay_answer.selectAll(".answerBox").each(function(){
      boxes.push({left: this.left, top: this.top, right: this.left+this.width, bottom: this.top+this.height});
    });
    browser.DOM.root.selectAll(".tipsy").each(function(){

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
  }
};



