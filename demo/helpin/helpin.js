var contextElements = {
  True: {
    q: "Always true",
    v: function(){ return true; },
    w: 0
  },
  SummaryInBrowser: {
    d: "Browser includes at least one summary.",
    r: 34, // Add summary into browser
    v: { summaries: function(summary){ return summary.inBrowser(); } },
    w: 10
  },
  CollapsedSummary: {
    d: "Summary is collapsable.",
    r: 29, // collapse summary
    v: { summaries: function(summary){ return summary.collapsed; } },
    w: 35
  },
  OpenSummary: {
    d: "Summary is open.",
    r: 28, // Open summary
    v: { summaries: function(summary){ return !summary.collapsed; } },
    w: 33
  },
  CategoricalSummary: {
    d: "Summary is categorical.",
    v: { summaries: function(summary){ return summary.type==="categorical"; } },
    w: 20
  },
  IntervalSummary: {
    d: "Summary is interval (numeric or time).",
    v: { summaries: function(summary){ return summary.type==="interval"; } },
    w: 25
  },
  NumberSummary: {
    d: "Summary is numeric.",
    v: { summaries: function(summary){ return summary.type==="interval" && summary.scaleType!=="time"; } },
    w: 30
  },
  PositiveNumberSummary: {
    d: "Numeric summary has all-positive values (minimum>0).",
    v: { summaries: function(summary){ 
      return summary.type==="interval" && summary.scaleType!=="time" && summary.intervalRange.org.min>0;
    } },
    w: 30
  },
  TimeSummary: {
    d: "The summary shows time.",
    v: { summaries: function(summary){ return summary.type==="interval" && summary.scaleType==="time"; } },
    w: 33
  },
  CategoricalMapSummary: {
    d: "Summary includes map regions per category.",
    v: { summaries: function(summary){ return summary.catMap; } },
    w: 40
  },
  CategoricalMapView: {
    d: "Summary is viewed as a categorical map.",
    v: { summaries: function(summary){ return summary.viewAs==='map'; } },
    w: 45
  },
  MultiValuedSummary: {
    d: "Categorical summary includes multiple values per record.",
    v: { summaries: function(summary){ return summary.isMultiValued; } },
    w: 40
  },
  FilteredSummary: {
    d: "Summary is filtered.",
    r: 1, // Filter-select to focus
    v: { summaries: function(summary){ return summary.isFiltered(); } },
    w: 50
  },
  CategoricalSummaryWithTextSearch: {
    d: "Summary includes more than 20 categories.",
    v: { summaries: function(summary){ return summary.showTextSearch; } },
    w: 30
  },
  SummaryWithMissingValues: {
    d: "Summary has at least one invalid/missing record value.",
    v: { summaries: function(summary){ return summary.missingValueAggr.records.length>0; } },
    w: 47
  },
  ExpandableSummary: {
    d: "Summary includes more categories than currently visible.",
    v: { summaries: function(summary){ return !summary.areAllCatsInDisplay(); } },
    w: 20
  },
  SortableSummary: {
    d: "Summary supports sorting its categories.",
    v: { summaries: function(summary){ return summary.configRowCount>0 && !summary.catSortBy_Active.no_resort; } },
    w: 22
  },
  NotAverageMeasure: {
    d: "Measure function is not average.",
    r: 12,
    v: function(){ return this.measureFunc!=="Avg"; },
    w: 10
  },

  ActiveCompareSelection: {
    d: "There is an active compared <i class='fa fa-lock'><i> selection.",
    r: 2, // Lock-select to compare
    v: function(){
      if(this.selectedAggr.Compare_A) return true;
      if(this.selectedAggr.Compare_B) return true;
      if(this.selectedAggr.Compare_C) return true;
      return false;
    },
    w: 55
  },

  RecordDisplay: {
    d: "Browser includes record display.",
    r: 51, // Add record display
    v: function(){ return this.recordDisplay.recordViewSummary; },
    w: 30
  },
  RecordTextSearch: {
    d: "There needs to be an active record text search summary.",
    v: function(){ return this.recordDisplay.textSearchSummary; },
    w: 35
  },
  RecordsWithDetailToggle: {
    d: "Record display has detail toggle enabled.",
    v: function(){ return this.recordDisplay.detailsToggle !== "off"; },
    w: 25
  },
  RecordDisplayAsMap: {
    d: "Records need to have a geographical region.",
    v: function(){ return this.recordDisplay.config.geo; },
    w: 55
  },
  RecordDisplayAsNetwork: {
    d: "Records need to have a linking attribute.",
    v: function(){ return this.recordDisplay.config.linkBy.length>0; },
    w: 55
  },
  RecordDisplayAsList: {
    d: "Record display shows records as a list.",
    v: function(){
      var x = this.recordDisplay.displayType;
      return x==='list' || x==="grid";
    },
    w: 15
  },

  AnyFiltered: {
    d: "Data needs to be filtered by some summary.",
    v: { filters: function(filter){ return filter.isFiltered; } },
    w: 40
  },

  AuthoringMode: {
    d: "Authoring mode is enabled.",
    r: 32, // Enable authoring
    v: function(){ return this.authoringMode; },
    w: 40
  },
  LoggedIn : {
    d: "You need to be logged in.",
    r: 48, // login...
    v: function(){ return kshf.gistLogin; },
    w: 44
  }
};

var questions_List = [];
var questions = { // using key-value to assign id's easily
  0: {
    q: "Highlight-select to preview group of records",
    actions: "Explore+Highlight+Select",
    topics: "Aggregate",
    context: ["SummaryInBrowser", "OpenSummary"],
    note: "Record groups can be categories, numeric ranges, time ranges, or invalid values.<br><br>"+
      "You can observe highlighted relations of the selected records in all other summaries.",
    similarTopics: [1,2],
    activate: function(){
      // TODO: Find the summary with a category that selects about 50% of the data
      // TODO: Maybe go over all aggregates and pick the one that's most appropriate, can be in any type of summary
      // TODO: Make sure the picked category is also visible on the screen...
      var s = this.context.summaries[0];

      this.context.highlightedSummary   = s;
      // TODO: FIX: Summary is not always a categorical summary, _cats may be undefined
      this.context.highlightedAggregate = s._cats[0];
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

      this.highlightBox(this.context.HighlightedDOM, "Mouse-over the record group","n");
      // TODO: Allow seeing other highlighting examples
    },
    deactivate: function(){
      this.context.highlightedSummary.onCatLeave(this.context.highlightedAggregate);
      this.context.highlightedSummary   = undefined;
      this.context.highlightedAggregate = undefined;
    },
  },
  1: {
    q: "Filter-select to focus on group of records",
    actions: "Explore+Filter+Select",
    topics: "Aggregate",
    context: "SummaryInBrowser",
    similarTopics: [1,2,4],
  },
  2: {
    q: "Lock-select to compare groups of records",
    actions: "Explore+Compare+Select+Lock",
    topics: "Aggregate",
    context: "SummaryInBrowser",
    similarTopics: [1,3],
    // Alternative: Shift-click
  },
  3: {
    q: "Unlock a compared <i class='fa fa-lock'></i> selection",
    actions: "Explore+Lock+Select",
    topics: "Aggregate+Breadcrumb",
    context: ["SummaryInBrowser", "ActiveCompareSelection"],
    note: "Filtering also unlocks (removes) all compared selections.",
    similarTopics: [2],
    activate: function(){
      this.highlightBox(
        this.browser.DOM.breadcrumbs.selectAll('[class*="crumbMode_Compare_"]')[0],
        "Click <i class='fa fa-lock'></i> breadcrumb","n");

      this.highlightBox(
        this.browser.DOM.root.selectAll('.aggrGlyph[compare="true"] .lockButton')[0], 
        "Click <i class='fa fa-lock'></i>", "n");
    }
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
    q: "Adjust range selection",
    actions: "Explore+Select+Pan",
    topics: "Time Summary+Number Summary+Range Selection",
    context: ["SummaryInBrowser", "IntervalSummary", "FilteredSummary"],
    similarTopics: [24],
    activate: function(){
      this.context_highlight("summaries", "activeBaseRange", "Click & drag the range<br> to move it forward/backward", "n");
      this.context_highlight("summaries", "rangeLimitOnChart", "Click & drag the end-points<br> to adjust the limits", "s");
    }
  },
  7: {
    q: "Save filtered records as a new aggregate",
    actions: "Explore+Save+Filter",
    topics: "Selection",
    context: ["SummaryInBrowser", "FilteredSummary"],
    activate: function(){
      this.highlightBox(this.browser.DOM.saveSelection[0], "Click <i class='fa fa-floppy-o'></i>" );
    }
  },
  8: {
    q: "Search and filter categories by text",
    actions: "Explore+Select",
    text: "Categorical Summary",
    context: ["SummaryInBrowser", "CategoricalSummary", "CategoricalSummaryWithTextSearch"],
    note: "The categories that match will be used to filter records.",
    similarTopics: [9],
    activate: function(){
      this.context_highlight("summaries", "catTextSearch", "Type your text search for categories.");
    }
  },
  9: {
    q: "Select records by text",
    actions: "Explore+Select",
    topics: "Record",
    context: ["RecordDisplay", "RecordTextSearch"],
    note: "If you type multiple words, you can specify if <b>all</b> or <b>some</b> words need to match in a record.",
    similarTopics: [8],
    activate: function(){
      this.highlightBox(this.browser.recordDisplay.DOM.recordTextSearch[0],
        "<b>Type your record text search here.</b><br><br>"+
        "As you type, matching records will be highlighted.<br><br>"+
        "<b>Enter</b> to filter records.<br>"+
        "<b>Shift+Enter</b> to lock records for comparison.","n" );
    }
  },
  10: {
    q: "Explore records with missing/invalid values",
    actions: "Explore+Select",
    topics: "Missing Values",
    context: ["SummaryInBrowser", "OpenSummary", "SummaryWithMissingValues"],
    note: "<i class='fa fa-ban'></i> appears when some records have missing/invalid values for that summary. "+
      "Darker icon color means more records with missing values.",
    activate: function(){
      this.context_highlight("summaries", "missingValueAggr",
        "<i class='fa fa-mouse-pointer'></i> <b>Mouse-over</b> to highlight<br>"+
        "<i class='fa fa-filter'></i> <b>Click</b> to filter<br>"+
        "<i class='fa fa-lock'></i> <b>Shift+click</b> to compare" );
    }
  },
  11: {
    q: function(){ 
      return "View measure labels as <b>"+(!this.browser.percentModeActive?"percentage (%)":"absolute (#)")+"</b> values";
    },
    actions: "Explore+View",
    topics: "Measure Label+Measurement",
    context: ["SummaryInBrowser", "NotAverageMeasure", "OpenSummary"],
    note: "Relative values are not applicable when <b>average measure</b> is active in the browser.",
    similarTopics: [12, 13],
    activate: function(){
      this.context_highlight("summaries", "measurePercentControl", "Click "+(this.browser.percentModeActive?"%":"#") );
    }
  },
  12: {
    q: "Explore by measure function <b style='display:inline-block'>Count - Sum (Total) - Average</b>",
    actions: "Explore",
    topics: "Measure Function+Measurement",
    context: ["SummaryInBrowser", "NumberSummary"],
    similarTopics: [11, 13],
    activate: function(){
      this.highlightBox(this.browser.DOM.recordInfo[0], "Click here","n" );
    }
    // TODO - multiple steps
  },
  13: {
    q: function(){ 
      return "View visual scale of measurements as <b>"+(this.browser.ratioModeActive?"absolute":"part-of-whole")+"</b>";
    },
    actions: "Explore+View",
    topics: "Scale Mode+Measurement",
    context: ["SummaryInBrowser","OpenSummary"],
    note: "Part-of-whole scale is designed for highlight and compare selections.",
    similarTopics: [11, 12],
    activate: function(){
      this.context_highlight("summaries", "scaleModeControl", "Click axis of<br>measurement values", "e");
      this.browser.showScaleModeControls(true);
    },
    deactivate: function(){
      this.browser.showScaleModeControls(false);
    }
  },
  14: {
    q: "View categories as map or list",
    actions: "Explore+View",
    topics: "Summary View+Categorical Summary+Map",
    context: ["SummaryInBrowser", "CategoricalMapSummary"],
    // TODO: Related actions: reveal compare-highlight selectins.
    activate: function(){
      this.context_highlight("summaries", "summaryViewAs", "Click TODO (HERE)", "e" );
    }
  },
  15: {
    q: "Retrieve record details information",
    actions: "Explore+Retrieve+Select",
    topics: "Record",
    context: ["RecordDisplay", "RecordsWithDetailToggle"],
    note: "Details are shown in a popup panel that lists all record information.",
    activate: function(){
      // TODO...
      var minY = this.browser.recordDisplay.DOM.recordGroup[0][0].scrollTop;
      var maxY = minY + this.browser.recordDisplay.DOM.recordGroup[0][0].offsetHeight;
      this.browser.records.forEach(function(record){
        if(!record.isWanted) return;
        var DOM = record.DOM.record;
        if( DOM.offsetTop < minY) return;
        if( DOM.offsetTop+DOM.offsetHeight > maxY) return;
        this.context.HighlightedDOM.push(DOM.childNodes[2]);
      },this);

      this.highlightBox(this.context.HighlightedDOM, "Click <i class='fa fa-info-circle'></i>","w");
    }
    // TODO: pick a record that is within the view.
  },
  16: {
    q: "View record ranks",
    actions: "Explore+View+Rank",
    topics: "Record",
    context: ["AuthoringMode", "RecordDisplay"],
    similarTopics: [20,21],
    activate: function(){
      this.context.HighlightedDOM.push( this.browser.recordDisplay.DOM.itemRank_control[0][0] );
      this.highlightBox(this.context.HighlightedDOM, "Click <i class='fa fa-angle-double-up'></i>", "n");
    }
  },
  17: {
    q: "Remove filter on a summary",
    actions: "Explore+Add/Remove+Filter",
    topics: "Selection+Breadcrumb",
    context: ["SummaryInBrowser", "FilteredSummary"],
    similarTopics: [18,19],
    activate: function(){
      this.context_highlight("summaries", "clearFilterButton", "Click <i class='fa fa-filter'></i>", "e");

      this.highlightBox(this.browser.DOM.breadcrumbs.selectAll('[class*="crumbMode_Filter"]')[0],
        "Click <i class='fa fa-filter'></i> breadcrumb", "n");
    }
  },
  18: {
    q: "Remove filter on a specific category",
    actions: "Explore+Add/Remove+Filter",
    topics: "Selection+Categorical Summary",
    context: ["SummaryInBrowser", "OpenSummary", "CategoricalSummary", "FilteredSummary"],
    similarTopics: [17,19],
    activate: function(){
      this.context_highlight(
        "summaries", function(){ return this.DOM.root.selectAll('.catGlyph:not([selected="0"])'); },
        "Click on a filtered category.", "n");
    }
  },
  19: {
    q: "Clear all filters / Show all Records",
    actions: "Explore+Filter",
    topics: "Browser+Breadcrumb",
    context: "AnyFiltered",
    similarTopics: [17,18],
    activate: function(){
      this.highlightBox(this.browser.DOM.filterClearAll[0], "Click here", "n");
    }
  },
  20: {
    q: "Sort records in reverse",
    actions: "Explore+Sort",
    topics: "Record",
    context: ["RecordDisplay", "RecordDisplayAsList"],
    note: "<i class='fa fa-sort-amount-desc'></i> appears when you mouse-over the record display panel.",
    similarTopics: [21, 23],
    activate: function(){
      var DOM = this.context.recordDisplay.DOM.root.select(".sortColumn.sortButton");
      DOM.style("opacity",1);
      this.highlightBox( DOM[0], "Click <i class='fa fa-sort-amount-desc'></i>","n");
    },
    deactivate: function(){
      this.context.recordDisplay.DOM.root.select(".sortColumn.sortButton").style("opacity",null);
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
    activate: function(){
      this.context_highlight("summaries", "catSortButton", "Click <i class='fa fa-sort-amount-desc'></i>", "n");
    },
  },
  22: {
    q: "View records as a map",
    action: "Explore+Change+View",
    topics: "Record+Map",
    context: ["RecordDisplay", "RecordDisplayAsMap"],
  },
  50: {
    q: "View records as a network",
    action: "Explore+Change+View",
    topics: "Record",
    context: ["RecordDisplay", "RecordDisplayAsNetwork"],
  },
  23: {
    q: "Change record sorting",
    actions: "Explore+Sort",
    topics: "Record",
    context: ["RecordDisplay", "RecordDisplayAsList", "SummaryInBrowser", "IntervalSummary"], // TODO: More than one sorting option available.
    note: "Records can be sorted using number or time summaries.<br><br>"+
      "<i class='fa fa-sort'></i> appears when you mouse-over the summary. "+
      "Active sorting summary always displays <i class='fa fa-sort'></i> for quick overview.",
    similarTopics: [20],
    activate: function(){
      this.highlightBox( this.context.recordDisplay.DOM.root.select(".listSortOptionSelect")[0],
        "Click here to see sorting options.<br>Then, select one.","n");

      this.context_highlight("summaries", "useForRecordDisplay", "Click <i class='fa fa-sort'></i>", "ne");
    },
    // TODO: Sorting is actually color in maps or networks...
  },
  24: {
    q: "Zoom in / out of active range filter",
    actions: "Zoom+Navigate",
    topics: "Time Summary+Number Summary",
    context: ["SummaryInBrowser", "OpenSummary", "IntervalSummary", "FilteredSummary"],
    note: "<i class='fa fa-search-plus'></i> / <i class='fa fa-search-minus'></i> appears when you mouse-over an open summary.",
      // TODO: You cannot zoom beyond maximum resolution of time data.
      // TODO: You cannot zoom beyond step-scale.
    similarTopics: [6],
    activate: function(){
      this.context_highlight("summaries", "zoomControl",
        "Click <i class='fa fa-search-plus'></i> / <i class='fa fa-search-minus'></i>", "s");
    },
  },
  25: {
    q: "Navigate (pan and zoom) in maps",
    actions: "View+Navigate+Pan+Zoom",
    topics: "Map",
    context: ["SummaryInBrowser","CategoricalSummary", "CategoricalMapSummary", "CategoricalMapView"],
      // DODO: Also should appear when record display is map mode. IMPORTANT.
  },
  26: {
    q: "Explore pairwise relations / Show pair matrix",
    actions: "Explore+Show/Hide",
    topics: "Set Summary+Categorical Summary",
    context: ["SummaryInBrowser","CategoricalSummary","MultiValuedSummary"],
    note: "Pair-matrix is only available for summaries which include records with multiple categories.",
    activate: function(){
      this.context_highlight("summaries", "setMatrixButton", "Click <i class='fa fa-tags'></i>", "n");
    },
  },
  27: {
    q: "Show/hide percentile ranges in number summaries",
    actions: "Explore+Show/Hide",
    topics: "Percentile Chart+Number Summary",
    context: ["SummaryInBrowser","OpenSummary","IntervalSummary","NumberSummary"],
    activate: function(){
      this.context_highlight("summaries", "summaryConfigControl", "Click <i class='fa fa-gear'></i>", "ne");
    },
    // TODO: Multiple step...
  },
  28: {
    q: "Open a summary",
    actions: "Layout",
    topics: "Summary",
    context: ["SummaryInBrowser","CollapsedSummary"],
    similarTopics: [29, 30],
    activate: function(){
      this.context_highlight("summaries", "buttonSummaryCollapse", "Click <i class='fa fa-expand'></i>", "nw");
    },
  },
  29: {
    q: "Minimize a summary",
    actions: "Layout",
    topics: "Summary",
    context: ["SummaryInBrowser","OpenSummary"],
    note: "<i class='fa fa-compress'></i> appears when you mouse-over an open summary.",
    similarTopics: [28, 30],
    activate: function(){
      this.context_highlight("summaries", "buttonSummaryCollapse", "Click <i class='fa fa-compress'></i>", "nw");
    },
  },
  30: {
    q: "Maximize a summary",
    actions: "Layout",
    topics: "Summary",
    context: ["SummaryInBrowser", "CategoricalSummary", "OpenSummary", "ExpandableSummary"],
    note: "<i class='fa fa-arrows-alt'></i> appears when you mouse-over a summary that can be maximized.",
    similarTopics: [28, 29],
    activate: function(){
      this.context_highlight("summaries", "buttonSummaryExpand", "Click <i class='fa fa-arrows-alt'></i>", "nw");
    },
  },
  31: {
    q: "Show/hide summary configuration",
    actions: "Show/Hide",
    topics: "Summary",
    context: ["SummaryInBrowser","OpenSummary"],
    note: "Configuration options depend on the summary data type.<br><br>"+
      "<i class='fa fa-gear'></i> appears when you mouse-over the summary.",
    similarTopics: [32],
    activate: function(){
      this.context_highlight("summaries", "summaryConfigControl", "Click <i class='fa fa-gear'></i>", "ne");
    },
  },

  // AUTHORING MODE
  32: {
    q: "Enable authoring / Show available attributes",
    actions: "Author",
    topics: "Browser+Available Attributes",
    similarTopics: [31],
    activate: function(){
      this.highlightBox( this.browser.DOM.authorButton[0], "Click <i class='fa fa-cog'></i>", "n");
    }
  },
  33: {
    q: "Move a summary",
    actions: "Layout+Move",
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
    activate: function(){
      this.context_highlight("summaries", "buttonSummaryRemove", "Click <i class='fa fa-times'></i>", "nw");
    },
  },
  36: {
    q: "Resize panel width",
    actions: "Layout",
    topics: "Panel+Browser",
    context: ["AuthoringMode", "SummaryInBrowser"],
    similarTopics: [37],
    activate: function(){
      var x = this.browser.DOM.root.selectAll(".panelAdjustWidth");
      x.style("display","block");
      this.highlightBox(x[0],"Click &amp; drag a panel border line.");
    },
    deactivate: function(){
      this.browser.DOM.root.selectAll(".panelAdjustWidth").style("display",null);
    }
  },
  37: {
    q: "Resize category label width",
    actions: "Layout",
    topics: "Category+Panel",
    context: ["AuthoringMode", "SummaryInBrowser", "CategoricalSummary", "OpenSummary"],
    similarTopics: [36],
    activate: function(){
      this.context_highlight("summaries", "chartCatLabelResize", "Click &amp; drag category width line");
    },
  },
/*  38: {
    q: "Add / create new custom attribute",
    actions: "Explore+Author+Add/Remove",
    topics: "Attribute+Custom Attribute",
    context: "AuthoringMode",
  },
  39: {
    q: "Edit custom attribute",
    actions: "Explore+Author+Transform",
    topics: "Attribute+Custom Attribute",
    context: "AuthoringMode",
  },*/
  40: {
    q: "Split text to multiple categories",
    actions: "Explore+Author+Transform",
    topics: "Category",
    context: ["AuthoringMode","CategoricalSummary"],
  },
  41: {
    q: "Parse time from text",
    actions: "Explore+Author+Transform",
    topics: "Time Summary+Category+Time Format",
    context: ["AuthoringMode","CategoricalSummary"],
  },
  42: {
    q: "Set unit name of a numeric attribute",
    actions: "Change",
    topics: "Number Summary+Attribute",
    context: ["AuthoringMode","SummaryInBrowser","OpenSummary","IntervalSummary","NumberSummary"],
    activate: function(){
      this.context_highlight("summaries", "summaryConfigControl", "Click <i class='fa fa-gear'></i>", "ne");
    },
    // TODO: Multiple step...
  },
  43: {
    q: "Extract time component (month, day, hour...)",
    actions: "Explore+Author+Transform",
    topics: "Time Summary",
    context: ["AuthoringMode","IntervalSummary","TimeSummary"],
  },
  44: {
    q: "Rename summary",
    actions: "Change",
    topics: "Attribute+Summary",
    context: ["AuthoringMode", "SummaryInBrowser"],
    // TODO: Can rename it by clicking on the avalibale attribute list too.
    activate: function(){
      this.context_highlight("summaries", "summaryName_text", "Click on the summary name.","n");
    },
  },
  45: {
    q: "Change histogram binning scale (<b>log</b> / <b>linear</b>)",
    actions: "Change",
    topics: "Number Summary",
    context: ["AuthoringMode","SummaryInBrowser","IntervalSummary","NumberSummary","PositiveNumberSummary"],
    note: "The summary needs to have only positive values to support log-scale.",
    // TODO: There are a few other constraints: Not-step scale.. (depends on filtering state too)
    activate: function(){
      this.context_highlight("summaries", "summaryConfigControl", "Click <i class='fa fa-gear'></i>", "ne");
    },
    // TODO: Multiple step...
  },
  46: {
    q: "View measurement values of a compared <i class='fa fa-lock'></i> selection",
    actions: "Compare+View",
    topics: "Aggregate+Measurement+Breadcrumb",
    context: ["SummaryInBrowser","ActiveCompareSelection"],
    note: "The aggregate measure label (text) color reflects the selection it displays.",
    // TODO: Show a tooltip for the color? how... activate?
    activate: function(){
      this.highlightBox(
        this.browser.DOM.breadcrumbs.selectAll('[class*="crumbMode_Compare_"]')[0],
        "Mouse-over <i class='fa fa-lock'></i> breadcrumb","n");
    }
  },
  51: {
    q: "Add record panel",
    actions: "Layout+Add/Remove",
    topics: "Record+Browser",
    context: ["AuthoringMode"], // TODO: At least summary not within browser / available attribute.
    similarTopics: [52],
  },
  52: {
    q: "Remove record panel",
    actions: "Layout+Add/Remove",
    topics: "Record+Browser",
    context: ["AuthoringMode", "RecordDisplay"], // TODO: At least summary not within browser / available attribute.
    similarTopics: [51],
    activate: function(){
      this.browser.recordDisplay.DOM.buttonRecordViewRemove.style("display","inline-block");
      this.highlightBox(
        this.browser.recordDisplay.DOM.buttonRecordViewRemove[0],
        "Click <i class='fa fa-times'></i>","n");
    },
    deactivate: function(){
      this.browser.recordDisplay.DOM.buttonRecordViewRemove.style("display",null);
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
      topics: "Record Display+Categorical Summary"
    },
    {
      q: "Load Browser Configuration",
    },
    {
      q: "Import Dataset",
      actions: "Import"
    },*/

};

var Helpin = function(browser){
  this.DOM = { 
    root: browser.DOM.root.select(".overlay_help"),
    answers: browser.DOM.root.select(".overlay_answer")
  };
  this.browser = browser;

  this.actionsList = [];
  this.topicsList = [];
  this.tooltips = [];

  this.context = {};

  this.qFilters = {
    actions: [],
    topics: [],
    textSearch: "",
    relevant: true
  };

  this.selectedQuestion = null;

  this.icons = {
    explore: 'compass',
    filter: 'filter',
    compare: 'exchange',
    highlight: 'mouse-pointer',
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
    aggregate: "cubes"
  };

};

Helpin.prototype = {
  
  evaluateContext: function(topic){
    // Initialize context elements
    this.context.summaries     = this.browser.summaries;
    this.context.filters       = this.browser.filters;
    this.context.selectedAggr  = this.browser.selectedAggr;
    this.context.recordDisplay = this.browser.recordDisplay;
    this.context.measureFunc   = this.browser.measureFunc;
    this.context.authoringMode = this.browser.authoringMode;

    topic.relevantWeight = 0;
    topic.isRelevant = true;
    
    topic.context.forEach(function(c){
      var topicContext = c.topicContext;
      var isRelevant = false;
      if(topicContext===undefined) alert("whahasasasa");
      if(typeof topicContext.v==="object"){
        if(topicContext.v.summaries){
          this.context.summaries = this.context.summaries.filter(topicContext.v.summaries);
          isRelevant = this.context.summaries.length>0;
        }
        if(topicContext.v.filters){
          this.context.filters = this.context.filters.filter(topicContext.v.filters);
          isRelevant = this.context.filters.length>0;
        }
      } else if(typeof topicContext.v==="function"){
        isRelevant = topicContext.v.call(this.context);
        if(isRelevant===undefined || isRelevant===null || isRelevant===[]) isRelevant = false;
      }

      if(isRelevant){
        topic.relevantWeight += topicContext.w;
      } else {
        if(topicContext.r) topic.relevantWeight += topicContext.w; // there is a relevant step that can be taken.
      }

      c.isRelevant = isRelevant;

      topic.isRelevant = topic.isRelevant && isRelevant;
    },this);

    return topic.isRelevant;
  },
  /** -- */
  context_highlight: function(context_group, DOM_access, text, pos){
    kshf.activeTipsy = null;

    // Traverse the elements, extract related stuff
    this.context.HighlightedDOM = [];
    this.context[context_group].forEach(function(CCC){
      var DOMs;
      if(typeof DOM_access === "function"){
        DOMs = DOM_access.call(CCC)[0];
      } if(typeof DOM_access === "string"){
        DOMs = CCC.DOM[DOM_access][0];
      }
      if(Array.isArray(DOMs)){
        this.context.HighlightedDOM = this.context.HighlightedDOM.concat( DOMs );
      } else {
        this.context.HighlightedDOM.push( DOMs );
      }
    },this);

    // inject CSS style and track all the highlighted DOM's
    this.context.HighlightedDOM.forEach(function(DOM){
      this.context.HighlightedDOM_All.push(DOM);
      DOM.setAttribute("helpin",true);
    },this);

    this.highlightBox(this.context.HighlightedDOM, text, pos);
  },
  /** -- */
  getQuestionText: function(question){ 
    if(typeof question.q === "string")   return question.q;
    if(typeof question.q === "function") return question.q.call(this,question);
  },

  initData: function(){
    var actions_by_name = {};
    var topics_by_name = {};

    for(var i in questions){
      questions[i].id = i;
      questions_List.push(questions[i]);
    }

    questions_List.forEach(function(q){
      q.displayed = true;

      if(q.context===undefined) q.context = "True";
      if(!Array.isArray(q.context)) q.context = [q.context];
      q.context.forEach(function(c,i){
        q.context[i] = {
          isRelevant: true,
          topicContext: contextElements[c]
        };
      });

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
    });

    for(var v in actions_by_name){
      this.actionsList.push({name: v, questions: actions_by_name[v], selected: false});
    }
    for(var v in topics_by_name){
      this.topicsList .push({name: v, questions: topics_by_name[v], selected: false});
    }
  },
  initDOM: function(){
    var me=this;

    this.browser.DOM.kshfBackground.on("mousemove",function(){
      var e = d3.event;
//      console.log(e.path);
      e.stopPropagation();
      e.preventDefault();

      this.style.pointerEvents = "none";
      me.browser.panel_overlay.style('pointer-events','none');
      //var parent = this.parentNode; parent.removeChild(this);

      var elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
      console.log(elementMouseIsOver);

      //parent.appendChild(this);
      this.style.pointerEvents = "all";
      me.browser.panel_overlay.style('pointer-events','all');
    })

    if(this.DOM.SearchBlock) {
      if(this.selectedQuestion){
        this.DOM.root.attr("question",false);
        this.selectedQuestion.DOM.attr("selected",null);
        this.selectedQuestion = null;
      }
      this.DOM.hideNonRelevant.attr("hide",true);

      this.DOM.TextSearchBlock.select(".SearchTextBox")[0][0].focus();

      // TODO: clear all filtering
      this.qFilters.relevant = true; // show relevant by default
      while(true){
        if(this.qFilters.topics.length===0) break;
        this.unselectKeyword(this.qFilters.topics[0]);
      }
      this.filterQuestions();

      // Initialize question text - based on context
      this.DOM.questions.selectAll(".QuestionText").html( function(question){ 
        return me.getQuestionText(question);
      } );

      return;
    }

    this.initData();
    this.DOM.SearchBlock = this.DOM.root.append("div").attr("class","SearchBlock");

    var me=this;
    this.DOM.root.append("div").attr("class","answer_box answer_ok")
      .html("Ok thanks! <i class='fa fa-check-circle'></i>")
      .on("click",function(){ me.closePanel(); });
    this.DOM.root.append("div").attr("class","answer_box answer_back")
      .html("<i class='fa fa-question-circle'></i> Ask another")
      .on("click",function(){ 
        me.closeQuestion(); 
        me.DOM.root.attr("question",false);
        me.browser.panel_overlay.attr("show","help");
      });

    this.initDOM_ClosePanel();
    this.initDOM_Relevance();
    this.initDOM_TextSearch();
    this.initDOM_Types();
    this.initDOM_Questions();
    
    // MORE INFO
    this.DOM.TopicMoreInfo = this.DOM.root.append("div").attr("class","TopicMoreInfo");
    this.DOM.TopicMoreInfo.append("div").attr("class","TopicMoreInfoHeader").text("More Info");
    this.DOM.TopicMoreInfoContent = this.DOM.TopicMoreInfo.append("div").attr("class","TopicMoreInfoContent");

    // RELEVANT WHEN... BLOCK
    this.DOM.TopicRelWhenBlock = this.DOM.root.append("div").attr("class","TopicInfoBlock TopicRelWhenBlock");
    this.DOM.TopicRelWhenBlock.append("div").attr("class","TopicInfoHeader").text("Relevant when ...");
    this.DOM.TopicRelWhenBlock.append("div").attr("class","TopicInfoShowHide")
      .on("click",function(){
        me.DOM.TopicRelWhenBlock.attr("showBlockContent", me.DOM.TopicRelWhenBlock.attr("showBlockContent")==="false");
      });
    this.DOM.ContextContent  = this.DOM.TopicRelWhenBlock.append("div").attr("class","TopicInfoBlockContent ContextContent");

    // SIMILAR TOPICS BLOCK
    this.DOM.SimilarTopicsBlock = this.DOM.root.append("div").attr("class","TopicInfoBlock SimilarTopicsBlock");
    this.DOM.SimilarTopicsBlock.append("div").attr("class","TopicInfoHeader").text("Similar Topics");
    this.DOM.SimilarTopicsBlock.append("div").attr("class","TopicInfoShowHide")
      .on("click",function(){
        me.DOM.SimilarTopicsBlock.attr("showBlockContent", me.DOM.SimilarTopicsBlock.attr("showBlockContent")==="false");
      });
    this.DOM.SimilarTopicsContent = this.DOM.SimilarTopicsBlock.append("div").attr("class","SimilarTopicsContent");

    this.initDOM_MoreDocumentation();

    this.filterQuestions();
    this.DOM.questions.selectAll(".QuestionText").html(function(question){ return me.getQuestionText(question); } );
  },
  initDOM_ClosePanel: function(){
    var me=this;
    this.DOM.root.append("div").attr("class","overlay_Close fa fa-times-circle")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'e', title: kshf.lang.cur.Close }); })
      .on("mouseenter", function(){ this.tipsy.show(); })
      .on("mouseleave", function(){ this.tipsy.hide(); })
      .on("click",      function(){ this.tipsy.hide(); me.closePanel(); });
  },
  initDOM_Relevance: function(){
    var me=this;
    this.DOM.hideNonRelevant = this.DOM.SearchBlock.append("div").attr("class","hideNonRelevant")
      .attr("hide",true)
      .on("click", function(){
        me.qFilters.relevant = !me.qFilters.relevant; // switch
        this.setAttribute("hide", me.qFilters.relevant);
        me.filterQuestions();
      });
    this.DOM.hideNonRelevant.append("span").attr("class","fa");
  },
  initDOM_TextSearch: function(){
    var me=this;
    var browser = this.browser;
    this.DOM.TextSearchBlock = this.DOM.SearchBlock.append("div").attr("class","TextSearchBlock")
      .on("mousedown", function (d, i) {
        var initPos = d3.mouse(d3.select("body")[0][0]);
        var DOM = me.DOM.root[0][0];
        me.DOM.root.style("transition","none");
        var initX = parseInt(DOM.style.right);
        var initY = parseInt(DOM.style.top);
        var boxWidth  = DOM.getBoundingClientRect().width;
        var boxHeight = DOM.getBoundingClientRect().height;
        var maxWidth  = browser.DOM.root[0][0].getBoundingClientRect().width  - boxWidth;
        var maxHeight = browser.DOM.root[0][0].getBoundingClientRect().height - boxHeight;
        browser.DOM.root.attr("drag_cursor","mbing")
        .on("mousemove", function() {
          var newPos = d3.mouse(d3.select("body")[0][0]);
          DOM.style.right = Math.min(maxWidth,  Math.max(0, initX+initPos[0]-newPos[0] ))+"px";
          DOM.style.top   = Math.min(maxHeight, Math.max(0, initY-initPos[1]+newPos[1] ))+"px";
        }).on("mouseup", function(){
          me.DOM.root.style("transition",null);
          browser.DOM.root
            .attr("drag_cursor",null)
            .on("mousemove", null).on("mouseup", null);
        });
       d3.event.preventDefault();
      });
    this.DOM.TextSearchBlock.append("span").html("How do I ");
    this.DOM.TextSearchBlock.append("input")
      .attr("type","text")
      .attr("class","SearchTextBox")
      .on("keyup", function(){
        me.qFilters.textSearch = this.value.toLowerCase();
        var pattern = new RegExp("("+me.qFilters.textSearch+")",'gi');
        var replaceWith = "<span class='textSearch_highlight'>$1</span>";
        me.DOM.questions.selectAll(".QuestionText").html(function(question){ 
          return me.getQuestionText(question).replace(pattern,replaceWith);
        });
        me.filterQuestions();
      });
    this.DOM.TextSearchBlock.append("span").text("?");

    this.DOM.TextSearchBlock.select(".SearchTextBox")[0][0].focus();
  },
  initDOM_Types: function(){
    var me=this;

    // INSERT ACTIONS INTO DOM
    this.DOM.ActionTypes = this.DOM.SearchBlock.append("div").attr("class","QuestionTypes ActionTypes");
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
          me.filterQuestions();
        });
    this.DOM.ActionSelect.append("span").attr("class","label").html(function(action){ return action.name;});
    this.DOM.ActionSelect.append("span").attr("class","num");
    this.DOM.ActionSelect.append("span")
      .attr("class",function(action){ 
        var v = action.name.replace(" ","_").replace("/","_").toLowerCase();
        if(me.icons[v]) return "topicInfoMark fa fa-" + me.icons[v]; 
        return "";
        return "topicInfoMark fa fa-" + (me.icons[v] ? me.icons[v] : "question-circle"); 
      });

    // INSERT TOPICS INTO DOM
    this.DOM.TopicTypes = this.DOM.SearchBlock.append("div").attr("class","QuestionTypes TopicTypes");
    this.DOM.TopicTypes.append("span").attr("class","TypeLabel");
    this.DOM.TopicSelect = this.DOM.TopicTypes
      .append("span").attr("class","TypeGroup")
      .selectAll(".QuestionTypeSelect")
      .data(this.topicsList, function(topic){ return topic.name; } )
      .enter()
        .append("div")
        .attr("class","QuestionTypeSelect")
        .attr("selected",false)
        .each(function(keyword){ keyword.DOM = this; })
        .on("click",function(keyword){
          me.swapselectKeyword(keyword);
          me.filterQuestions();
        });
    this.DOM.TopicSelect.append("span").attr("class","label").html(function(keyword){ return keyword.name;});
    this.DOM.TopicSelect.append("span").attr("class","num");
    this.DOM.TopicSelect.append("span")
      .attr("class",function(keyword){ 
        var v = keyword.name.replace(" ","_").replace("/","_").toLowerCase();
        if(me.icons[v]) return "topicInfoMark fa fa-" + me.icons[v]; 
        return "";
        return "topicInfoMark fa fa-" + (me.icons[v] ? me.icons[v] : "question-circle"); 
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
  selectQuestion: function(q){
    var me=this;
    if(this.selectedQuestion===q) return;
    this.selectedQuestion = q;
    this.evaluateContext(q);

    q.DOM.attr("selected",true);
    this.browser.panel_overlay.attr("show","answer");

    this.DOM.root.attr("question",true);

    // Show topic note
    this.DOM.TopicMoreInfo.style("display",q.note===undefined?"none":"block");
    this.DOM.TopicMoreInfoContent.html(q.note);

    // SHOW RELEVANT WHEN...

    // 1) Sort 
    q.context = q.context.sort(function(a,b){
      return b.isRelevant - a.isRelevant;
    });
    // 2) Show
    this.DOM.ContextContent.selectAll(".ContextItem").data([]).exit().remove();
    var X = this.DOM.ContextContent.selectAll(".ContextItem").data(q.context, function(c){ return c.topicContext.d; })
      .enter().append("div").attr("class","ContextItem")
      .attr("isRelevant", function(c){ return c.isRelevant; });
    X.append("i").attr("class",function(c){ return "RelevantIcon fa fa-"+(c.isRelevant?"check-circle":"times-circle"); });
    X.append("span").html(function(c){ return c.topicContext.d });
    X.filter(function(c){ return !c.isRelevant && c.topicContext.r; })
      .append("span").attr("class","MakeRelevantTopic").text("How?")
        .on("click", function(c){
          me.closeQuestion();
          me.selectQuestion(questions[c.topicContext.r]);
        });

    this.DOM.TopicRelWhenBlock.attr("showBlockContent",!q.isRelevant);

    this.DOM.SimilarTopicsBlock
      .style("display",(q.similarTopics.length>0)?"block":"none")
      .attr("showBlockContent",q.similarTopics.length>0);
    this.DOM.SimilarTopicsContent.selectAll(".SimilarTopicItem").data([]).exit().remove();
    X = this.DOM.SimilarTopicsContent.selectAll(".SimilarTopicItem").data(q.similarTopics, function(c){ return c; })
      .enter().append("div").attr("class","SimilarTopicItem");
    X.append("span").attr("class","SimilarTopicItemText")
      .html(function(c){ return questions[c].q; })
      .on("click", function(c){
        me.closeQuestion();
        me.selectQuestion(questions[c]);
      });

    if(q.isRelevant){
      this.context.HighlightedDOM = [];
      this.context.HighlightedDOM_All = []; // can be multiple calls...
      if(q.activate) {
        setTimeout(function(){
          q.activate.call(me,q);

          var total_width  = parseInt(me.browser.DOM.root.style("width"));
          var total_height = parseInt(me.browser.DOM.root.style("height"));
          var dPath = "M 0 0 h "+total_width+" v "+total_height+" h -"+total_width+" Z ";
          me.DOM.answers.selectAll(".highlightBox").each(function(d,i){
            dPath += "M "+this.left+" "+this.top+" h "+this.width+" v "+this.height+" h -"+this.width+" Z ";
          });
          me.browser.DOM.kshfBackground.style("-webkit-mask-image",
            "url(\"data:image/svg+xml;utf8,"+
            "<svg xmlns='http://www.w3.org/2000/svg' width='"+total_width+"' height='"+total_height+"'>"+
            "<path d='"+dPath+"' fill-rule='evenodd' fill='black' />"+
            "</svg>\")"
            );
        }, 500);
      } else {
        alert("Help action not yet implemented.\nCheck back soon!");
      }
    }
  },
  initDOM_Questions: function(){
    var me=this;

    questions_List.forEach(function(topic){
      this.evaluateContext(topic);
    },this);

    // sort questions by relevancy value
    questions_List = questions_List.sort(function(a,b){
      return b.relevantWeight - a.relevantWeight;
    });

    this.DOM.questions = this.DOM.root.append("div").attr("class","Questions")
      .selectAll(".QuestionBlock").data(questions_List, function(d){ return d.id; }).enter()
        .append("div").attr("class","QuestionBlock")
        .each(function(question){ question.DOM = d3.select(this); })
        .on("click", function(q){ me.selectQuestion(q); });

    this.DOM.questions.order();

    this.DOM.questions.append("div").attr("class","QuestionIcons")
      .selectAll(".icon").data(function(d){ return d.actions.concat(d.topics); })
        .enter().append("span")
          .attr("title",function(d){ return d; })
          .attr("class",function(d){ 
            var v=d.replace(" ","_").replace("/","_").toLowerCase();
            if(me.icons[v]) return "icon fa fa-"+me.icons[v]; 
          });

    this.DOM.questions.append("div").attr("class","notInContext fa fa-exclamation-circle")
      .each(function(d){ 
        this.tipsy = new Tipsy(this, { gravity: 'nw', 
          title: "Not relevant"
        });
      })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); });

    this.DOM.questions.append("div").attr("class","QuestionText");
  },
  initDOM_MoreDocumentation: function(){
    this.DOM.root
      .append("div").attr("class","MoreDocumentation")
      .html("For more info (including the API), visit the "+
        "<a href='http://github.com/adilyalcin/Keshif/wiki' target='_blank' class='MoreDocumentationLink'>Keshif wiki</a>.");
  },
  highlightBox: function(DOM,text,pos){
    var bounds_main = this.browser.DOM.root[0][0].getBoundingClientRect();
    if(pos===undefined) pos = "w";
    var me=this;
    kshf.activeTipsy = null;

    this.DOM.answers.selectAll(".highlightBox_nope").data(DOM, function(d,i){ return i; })
      .enter().append("div").attr("class","highlightBox")
      .each(function(d){ 
        this.bounds = d.getBoundingClientRect();
        this.left  = this.bounds.left-bounds_main.left-3;
        this.width = this.bounds.width+6;
        this.top   = this.bounds.top-bounds_main.top-3;
        this.height= this.bounds.height+6;
      })
      .style("left",  function(){ return this.left  +"px"; })
      .style("width", function(){ return this.width +"px"; })
      .style("top",   function(){ return this.top   +"px"; })
      .style("height",function(){ return this.height+"px"; })
      .each(function(d,i){ 
        if(i!==0) return;
        this.tipsy = new Tipsy(this, { gravity: pos, title: text, className: "tipsy-helpin" }); 
        me.tooltips.push(this.tipsy);
        this.tipsy.show();
      })
      .on("click",function(boxDOM){
        me.closePanel();
        // TODO: event might not be click, might be a custom handler / function call, or other type of DOM event
        var event = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        boxDOM.dispatchEvent(event);
      })
      ;
  },
  closePanel: function(){
    var me = this;

    this.closeQuestion();
    this.browser.panel_overlay.attr("show","none");
    setTimeout(function(){ me.DOM.root.attr("question",false); }, 1000);
  },
  closeQuestion: function(){
    if(this.selectedQuestion===null) return;
    this.browser.DOM.kshfBackground.style("-webkit-mask-image",null);
    this.selectedQuestion.DOM.attr("selected",null);
    this.DOM.TopicMoreInfo.style("display","none");
    this.DOM.SimilarTopicsBlock.style("display","none");

    if(this.selectedQuestion.isRelevant){
      if(kshf.activeTipsy) kshf.activeTipsy.hide();
      this.DOM.answers.selectAll(".highlightBox").remove();
      if(this.context.HighlightedDOM_All.length>0){
        this.context.HighlightedDOM_All.forEach(function(DOM){ DOM.removeAttribute("helpin"); })
      }
      if(this.selectedQuestion.deactivate) {
        this.selectedQuestion.deactivate.call(this, this.selectedQuestion);
      }
      this.tooltips.forEach(function(t){ t.hide(); });
    }

    this.selectedQuestion = null;
  },
  filterQuestions: function(){
    var me=this;

    questions_List.forEach(function(topic){
      this.evaluateContext(topic);
    },this);

    questions_List = questions_List.sort(function(a,b){
      return b.relevantWeight - a.relevantWeight;
    });

    this.DOM.questions.data(questions_List, function(d){ return d.id; }).order();

    var me=this;
    questions_List.forEach(function(question){
      question.displayed = true;
      if(question.activate===undefined){
        question.DOM.style("color", "gray");
      }
      // Filter on relevance to the active interface
      if(question.displayed){
        var isInContext = question.isRelevant;
        question.displayed = isInContext === this.qFilters.relevant;
        question.DOM.attr("outOfContext", isInContext?null:"true");
        //if(!isInContext) d3.select(question.DOM[0][0].parentNode.appendChild(question.DOM[0][0]));
      }
      // Filter for selected actions
      if(question.displayed && this.qFilters.actions.length>0){
        question.displayed = this.qFilters.actions.every(function(selected){
          return question.actions.some(function(actionName){ return actionName === selected.name; });
        });
      }
      // Filter for selected topics
      if(question.displayed && this.qFilters.topics.length>0){
        question.displayed = this.qFilters.topics.every(function(selected){
          return question.topics.some(function(topicName){ return topicName === selected.name; });
        });
      }
      // Filter on text search
      if(question.displayed && this.qFilters.textSearch!==""){
        question.displayed = this.getQuestionText(question).toLowerCase().indexOf(this.qFilters.textSearch)!==-1;
      }
      // Done
      question.DOM.style("display", question.displayed ? null : "none");
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

    this.topicsList.forEach(function(topic){
      topic.activeQ = 0;
      topic.questions.forEach(function(q){ topic.activeQ+=q.displayed; });
    });
    this.topicsList = this.topicsList.sort(function(topic1,topic2){ 
      if(topic2.selected) return  1;
      if(topic1.selected) return -1;
      var x = topic2.activeQ - topic1.activeQ;
      if(x) return x;
      return topic2.name.localeCompare(topic1.name);
    });
    this.DOM.TopicSelect.data(this.topicsList, function(topic){ return topic.name;} ).order()
      .style("display",function(topic){ return topic.activeQ>0 ? null : "none"; });
    this.DOM.TopicSelect.selectAll(".num").html(function(topic){ return topic.activeQ; });
  },
};

