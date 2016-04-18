var _getR = function(a,f){
  var v;
  var x = a.some(function(i){
    if(f.call(a,i)){
      v=i;
      return true;
    }
  },this);
  if(x) return v;
  return false;
};

var questions = [
  {
    q: "Highlight-select to preview",
    actions: "Explore+Highlight+Select",
    topics: "Aggregate+Selection",
    relevance: "At least one summary in browser",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel; });
    }
  },
  {
    q: "Filter-select to focus",
    actions: "Explore+Filter+Select",
    topics: "Aggregate+Selection",
    relevance: "At least one summary in browser",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel; });
    }
  },
  {
    q: "Lock-select to compare",
    actions: "Explore+Compare+Lock+Select",
    relevance: "At least one summary in browser",
    topics: "Aggregate+Selection",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel; });
    }
  },
  {
    q: "Unlock a locked (compared) selection",
    actions: "Explore+Lock+Select",
    topics: "Aggregate+Selection",
    relevance: "An active locked (compared) selection",
    isRelevant: function(){
      if(this.selectedAggr.Compared_A) return this.selectedAggr.Compared_A;
      if(this.selectedAggr.Compared_B) return this.selectedAggr.Compared_B;
      if(this.selectedAggr.Compared_C) return this.selectedAggr.Compared_C;
      return false;
    },
    activate: function(){
      var DOM_breadcrumbs = this.DOM.breadcrumbs.selectAll('[class*="crumbMode_Compared_"]');
      if(DOM_breadcrumbs[0].length>0){
        helpin.highlightBox(DOM_breadcrumbs,"Click the <b>breadcrumb</b>.","n");
        var compare_X =  DOM_breadcrumbs[0][0].classList[1].substr(10)
        var DOM_icon = d3.select(this.selectedAggr[compare_X].DOM.aggrGlyph).select(".lockButton");
        kshf.activeTipsy = null;
        helpin.highlightBox(DOM_icon, 
          "Or, click the <i class='fa fa-unlock-alt'></i> icon.","n");
      }
    }
    // TODO: Filtering also unlocks all active selections.
  },
  {
    q: "Filter on multiple categories using and - or - not",
    actions: "Explore+Filter+Select",
    topics: "Category",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel && summary.type==="categorical"; });
    },
    activate: function(){
      var DOM_breadcrumbs = this.DOM.breadcrumbs.selectAll('[class*="crumbMode_Compared_"]');
      if(DOM_breadcrumbs[0].length>0){
        helpin.highlightBox(DOM_breadcrumbs,"Click the <b>breadcrumb</b>.","n");
        var compare_X =  DOM_breadcrumbs[0][0].classList[1].substr(10)
        var DOM_icon = d3.select(this.selectedAggr[compare_X].DOM.aggrGlyph).select(".lockButton");
        kshf.activeTipsy = null;
        helpin.highlightBox(DOM_icon, 
          "Or, click the <i class='fa fa-unlock-alt'></i> icon.","n");
      }
    }
  },
  {
    q: "Select Map Regions",
    actions: "Explore+Select+Select",
    topics: "Map",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel && summary.catMap; });
    }
  },
  {
    q: "Adjust Range Selection",
    actions: "Explore+Adjust",
    topics: "Time Summary+Number Summary",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ 
        return summary.panel && summary.type==="interval" && summary.isFiltered(); 
      });
    }
  },
  {
    q: "Set or Edit Unit Name of Numeric Attribute",
    actions: "Set+Edit",
    topics: "Number Summary+Attribute",
    isRelevant: function(){
      return this.authoringMode && _getR(this.summaries,function(summary){ 
        return summary.panel && summary.type==="interval" && !summary.isTimeStamp();
      });
    },
  },
  {
    q: "Save Filtering",
    actions: "Explore+Save+Store+Filter",
    topics: "Selection",
    isRelevant: function(){ 
      return this.filters.forEach(function(filter){ return filter.isFiltered; });
    },
    // TODO!
  },
  {
    q: "Search (filter) by text within categories",
    actions: "Explore+Text Search+Select+Filter",
    text: "Categorical Summary",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel && summary.showTextSearch; });
    },
    activate: function(q){
      var r = q.isRelevant.call(this);
      if(r){
        helpin.highlightBox(
          r.DOM.catTextSearch,
          "Type your categorical text search here.<br><br>"+
          "The categories that match will be selected <br>and filter the data.");
      }
    }
  },
  {
    q: "Search (filter) by text within records",
    actions: "Explore+Filter+Text Search+Select",
    topics: "Record Display",
    posBottom: true,
    isRelevant: function(){
      return this.recordDisplay.recordViewSummary && this.recordDisplay.textSearchSummary
    },
    activate: function(q){
      var r = q.isRelevant.call(this);
      if(r){
        helpin.highlightBox(
          browser.recordDisplay.DOM.recordTextSearch,
          "<b>Type your text seach here.</b><br><br>"+
          "The records will be filtered based on your query.<br>"+
          "If you type multiple words, you can specify <br>"+
          "if <b>all</b> or <b>some</b> words need to match with a record.","n");
      }
    }
  },
  {
    q: "Explore missing attribute values",
    actions: "Explore+Select",
    topics: "Attribute+Missing Value",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){
        return summary.panel && summary.missingValueAggr.records.length>0;
      });
    },
    activate: function(q){
      var DOM = [[]];
      this.summaries.forEach(function(summary){
        if(summary.panel && summary.missingValueAggr.records.length>0){
          DOM[0] = DOM[0].concat(summary.DOM.missingValueAggr[0]);
        }
      });
      helpin.highlightBox(
        DOM,
        "A summary has <i class='fa fa-ban'></i> icon if there are some records with no/invalid value.<br>"+
        "Darker color means there are more records.<br>"+
        "Mouse-over to highlight these records, <br>click to filter, or shift+click to compare.");
    }
  },
  {
    q: "Change measure labels across absolute # & percentage % values",
    actions: "Explore+Change",
    topics: "Measure Label+Measurement",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel; });
    },
    activate: function(q){
      var r = q.isRelevant.call(this);
      if(r){
        helpin.highlightBox(
          this.DOM.root.selectAll(".measurePercentControl"),
          "Click this icon (# %).<br><br>"+
          "Note: Only absolute values are applicable<br> in 'average' aggregate measure."
          );
      }
    }
  },
  {
    q: "Change measure function (count vs. sum/total vs. average)",
    actions: "Explore+Change",
    topics: "Measure Function+Measurement"
  },
  {
    q: "Change scale mode across absolute vs. part-of",
    actions: "Explore+Change+View",
    topics: "Scale Mode+Measurement",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel; });
    },
    activate: function(q){
      var r = q.isRelevant.call(this);
      if(r){
        this.showScaleModeControls(true);
        helpin.highlightBox(
          this.DOM.root.selectAll(".scaleModeControl"),
          "Click chart axis area.<br><br>"+
          "Part-of scale is designed for highlight and compare selections."
          );
      }
    },
    deactivate: function(){
      this.showScaleModeControls(false);
    }
  },
  {
    q: "Change the Summary View Mode",
    actions: "Explore+Change+View",
    topics: "Summary View+Categorical Summary+Map",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel & summary.catMap; });
    }
  },
  {
    q: "Get record details",
    actions: "Explore+Get Details+Select",
    topics: "Record+Record Display",
    posBottom: true,
    isRelevant: function(){
      // TODO: details are shown on map and network views by clicking on the record.
      return this.recordDisplay.recordViewSummary !== null && this.recordDisplay.detailsToggle !== "off"
    },
    activate: function(q){
      var r = _getR(browser.records, function(record){ return record.isWanted; });
      if(r){
        helpin.highlightBox(
          d3.select(r.DOM.record).select(".recordToggleDetail"),
          "Click this icon to open a popup panel<br> that shows all record attributes.","n");
      }
    }
    // TODO: Details are also shown on mouse-over.
  },
  {
    q: "Get record ranks",
    actions: "Explore+Rank",
    topics: "Record+Record Display",
    other: "Results",
    isRelevant: function(){
      return this.authoringMode && this.recordDisplay.recordViewSummary
    }
  },
  {
    q: "Remove a filter selection on a summary.",
    actions: "Explore+Remove+Filter",
    topics: "Selection",
    other: "Clear",// use in text search?
    isRelevant: function(){ 
      return _getR(this.filters, function(filter){ return filter.isFiltered; });
    },
    activate: function(){
      helpin.highlightBox(
        this.DOM.root.selectAll(".kshf .kshfSummary[filtered=true] > .headerGroup .clearFilterButton"),
        "Click here"
        );
    }
  },
  {
    q: "Remove a Category Selection",
    actions: "Explore+Remove+Filter",
    topics: "Selection+Category+Categorical Summary",
    other: "Clear",
    isRelevant: function(){ 
      return _getR(this.summaries, function(summary){ 
        return summary.panel && summary.isFiltered() && summary.type==="categorical";
      });
    }
  },
  {
    q: "Clear All Filtering / Show all Records",
    actions: "Explore+Remove+Filter",
    topics: "Browser",
    posBottom: true,
    isRelevant: function(){ 
      return _getR(this.filters, function(filter){ return filter.isFiltered; });
    },
    activate: function(){
      helpin.highlightBox(
        this.DOM.filterClearAll,
        "Click here to clear all filtering selections.","n");
    }
  },
  {
    q: "Sort records in reverse",
    actions: "Explore+Sort",
    topics: "Record Display",
    posBottom: true,
    isRelevant: function(){
      // TODO: details are shown on map and network views by clicking on the record.
      return this.recordDisplay.recordViewSummary !== null;
    },
    activate: function(q){
      var DOM = this.recordDisplay.DOM.root.select(".sortColumn.sortButton");
      DOM.style("opacity",1);
      helpin.highlightBox( DOM,
        "Click this icon.<br><br>"+
        "It appears when you mouse-over this area.","n");
    },
    deactivate: function(){
      this.recordDisplay.DOM.root.select(".sortColumn.sortButton").style("opacity",null);
    }
  },
  {
    q: "Sort categories in reverse",
    actions: "Explore+Sort",
    topics: "Categorical Summary+Category",
    isRelevant: function(){
      return this.summaries.some(function(summary){ return summary.panel && summary.showTextSearch; });
    }
  },
  {
    q: "Change record sorting",
    actions: "Explore+Sort+Change",
    topics: "Record Display",
    posBottom: true,
    isRelevant: function(){
      return this.recordDisplay.recordViewSummary !== null;
    },
    activate: function(q){
      helpin.highlightBox(
        this.recordDisplay.DOM.root.select(".listSortOptionSelect"),
        "Click here.<br><br>"+
        "Sorting options include numeric or time attributes only.",
        "n");
      // Also highlight the 
      kshf.activeTipsy = null;
      var DOM = this.DOM.root.selectAll(".kshfSummary[summary_type='interval'] .useForRecordDisplay");
      DOM.style("display","inline-block");
      helpin.highlightBox(
        DOM,
        "Or, click <i class='fa fa-sort'></i> in summary header.</i><br><br>"+
        "This icon is shown when you mouse-over the summary.",
        "ne");
    },
    deactivate: function(){
      var DOM = this.DOM.root.selectAll(".kshfSummary[summary_type='interval'] .useForRecordDisplay");
      DOM.style("display",null);
    }
    // TODO: Sorting is actually color in maps or networks...
  },
  {
    q: "Zoom in Interval Range Selection",
    actions: "Zoom+Navigate",
    topics: "Time Summary+Number Summary",
    isRelevant: function(){
      return _getR(this.summaries, 
        function(summary){ 
          return summary.panel && summary.type==="interval" &&
            summary.isFiltered(); 
        }) ;
    }
  },
  {
    q: "Navigate / Pan / Zoom in Maps",
    actions: "View+Navigate+Pan+Zoom",
    topics: "Map+Record Display",
    isRelevant: function(){
      var r = _getR(this.summaries, function(summary){ return summary.panel && summary.catMap; });
      if(r) return r;
      return this.recordDisplay.displayType === "map";
    }
  },
  {
    q: "Show / Hide Set Summary",
    actions: "Explore+Show+Hide",
    topics: "Set Summary",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel && summary.isMultiValued; }); 
    }
  },
  {
    q: "Show / hide percentiles",
    actions: "Explore+Show+Hide",
    topics: "Percentile Chart+Number Summary",
    isRelevant: function(){ 
      return _getR(this.summaries, 
        function(summary){ 
          return summary.panel && summary.type==="interval" && !summary.isTimeStamp();
        });
    }
  },
  {
    q: "Open a summary",
    actions: "Layout+Open",
    topics: "Summary+Time Summary",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel && summary.collapsed; });
    },
    activate: function(q){
      helpin.highlightBox(
        this.DOM.root.selectAll(".kshfSummary[collapsed=true] .buttonSummaryCollapse"),
        "Click this icon.");
    }
  },
  {
    q: "Close a summary",
    actions: "Layout+Close",
    topics: "Summary+Time Summary",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel && !summary.collapsed; });
    },
    activate: function(q){
      var DOM = this.DOM.root.selectAll(".kshfSummary[collapsed=false] .buttonSummaryCollapse");
      DOM.style("opacity",1);
      helpin.highlightBox(
        DOM,
        "Click this icon.<br><br>"+
        "The icon is shown when you move mouse over an open summary.");
    }
  },
  {
    q: "Maximize a summary",
    actions: "Layout+Maximize",
    topics: "Summary+Categorical Summary",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ 
        return summary.panel && summary.type==="categorical" && 
          summary.collapsed===false && !summary.areAllCatsInDisplay();
      });
    },
    activate: function(q){
      var DOM = this.DOM.root.selectAll(
        '.kshfSummary[collapsed=false] > .headerGroup[allCatsInDisplay="false"] .buttonSummaryExpand'
        );
      DOM.style("opacity",1);
      helpin.highlightBox(DOM,
        "Click here.<br><br>"+
        "The icon is shown when you mouse-over an open summary<br> with some categories that did not fit in the view."
        );
    },
    deactivate: function(){
      this.DOM.root.selectAll(
        '.kshfSummary[collapsed=false] > .headerGroup[allCatsInDisplay="false"] .buttonSummaryExpand'
      ).style("opacity",null);
    }
  },
  {
    q: "Show summary configuration",
    actions: "Configure",
    topics: "Summary",
    isRelevant: function(){
      return _getR(this.summaries, function(summary){ return summary.panel; });
    },
    activate: function(q){
      var DOM =this.DOM.root.selectAll(".summaryConfigControl");
      DOM.style("display","inline-block");
      helpin.highlightBox(
        DOM,
        "Click this icon.<br><br>"+
        "Note: Summary must be open before you configure it.","n");
    },
    deactivate: function(){
      var DOM =this.DOM.root.selectAll(".summaryConfigControl");
      DOM.style("display",null);
    }
  },

  // AUTHORING MODE
  {
    q: "Enable authoring / Show available attributes",
    actions: "Author+Available Attributes+Configure",
    topics: "Browser+Panel",
    isRelevant: function(){ return this.authoringMode===false; },
    posBottom: true,
    activate: function(q){
      helpin.highlightBox(
        this.DOM.panel_Basic.select(".showConfigButton"),
        "Click here.","n");
    }
  },
  {
    q: "Move a summary",
    actions: "Layout+Move",
    topics: "Summary+Browser",
    other: "Reposition",
    isRelevant: function(){
      return this.summaries.some(function(summary){ return summary.panel });
    },
    isRelevant: function(){
      return this.authoringMode;
    }
  },
  {
    q: "Add a summary into browser",
    actions: "Layout+Add+Insert",
    topics: "Summary+Browser",
    isRelevant: function(){
      return this.authoringMode;
    }
  },
  {
    q: "Remove a summary from browser",
    actions: "Layout+Remove",
    topics: "Summary+Browser",
    isRelevant: function(){
      return this.authoringMode && this.summaries.some(function(summary){ return summary.panel });
    },
  },
  {
    q: "Adjust panel width",
    actions: "Layout+Adjust Width+Resize",
    topics: "Panel+Browser",
    isRelevant: function(){
      return this.authoringMode;
    }
  },
  {
    q: "Adjust category label width",
    actions: "Layout+Adjust Width+Resize",
    topics: "Category+Panel",
    isRelevant: function(){
      return this.authoringMode &&
        _getR(this.summaries, function(summary){ return summary.panel && summary.type==="categorical"; });
    }
  },
  {
    q: "Create custom attribute",
    actions: "Explore+Author+Create+Customize",
    topics: "Attribute+Custom Attribute",
    isRelevant: function(){
      return this.authoringMode;
    }
  },
  {
    q: "Edit custom attribute",
    actions: "Explore+Author+Edit+Customize",
    topics: "Attribute+Custom Attribute",
    isRelevant: function(){
      return this.authoringMode;
    }
  },
  {
    q: "Split categories by separator",
    actions: "Explore+Author+Split+Edit",
    topics: "Category",
    isRelevant: function(){
      return this.authoringMode;
    }
  },
  {
    q: "Parse time from text",
    actions: "Explore+Author+Parse+Edit",
    topics: "Time Summary+Category+Time Format",
    isRelevant: function(){
      return this.authoringMode;
    }
  },
  {
    q: "Extract time component (month, day, hour...)",
    actions: "Explore+Author+Parse+Edit+Extract",
    topics: "Time Summary",
    isRelevant: function(){ 
      return _getR(this.summaries, function(summary){ 
        return summary.panel && summary.type==="interval" && summary.isTimeStamp();
      });
    }
  },
  {
    q: "Edit attribute name",
    actions: "Layout+Rename+Edit",
    topics: "Attribute+Summary",
    other: 'Change',
    isRelevant: function(){
      return this.authoringMode;
    }
  },
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
  {
    q: "Save Browser Configuration",
    actions: 'save',
    isRelevant: function(){
      return this.authoringMode;
    }
  },
  {
    q: "Login to Github",
    actions: "Login",
    topics: "Github",
    isRelevant: function(){
      return this.authoringMode;
    }
  },
  {
    q: "Save as Public/Private",
    isRelevant: function(){
      return kshf.gistLogin;
    }
  },
];

var Helpin = function(browser){
  this.DOM = { 
    root: browser.DOM.root.select(".overlay_help"),
    answers: browser.DOM.root.select(".overlay_answer")
  };
  this.browser = browser;

  this.actionsList = [];
  this.topicsList = [];
  this.tooltips = [];

  this.qFilters = {
    actions: [],
    topics: [],
    textSearch: "",
    relevant: true
  };

  this.selectedQuestion = null;

  this.icons = {
    filter: 'filter',
    highlight: 'mouse-pointer',
    missing_value: 'ban',
    search: 'search',
    sort: 'sort',
    lock: 'lock',
    get_details: 'bullseye',
    remove: 'times',
    save: 'save',
    create: 'plus-square',
    edit: 'pencil', // or edit
    zoom: 'search-plus',
    login: 'sign-in',
    github: 'github',
    rank: 'angle-double-up',
    category: 'tag',
    move: "arrows",
    adjust_width: "arrows-h", // doesn't fit all
    map_region: "globe",
    split: "scissors",
    open: "expand",
    close: "compress",
    maximize: "arrows-alt",
    time_summary: "clock-o", // or line-chart
    map_summary: "globe",
    measurement: "hashtag",
    configure: "cog"
  };

};

Helpin.prototype = {
  initData: function(){
    var actions_by_name = {};
    var topics_by_name = {};

    questions.forEach(function(q){
      q.displayed = true;

      if(q.isRelevant===undefined) q.isRelevant = function(){ return true; }; // always relevant
      if(q.actions===undefined) q.actions = "";
      if(q.topics===undefined) q.topics = "";

      // Split Actions    
      q.actions = q.actions.split("+");
      if(q.actions[0]==="") q.actions = [];
      q.actions.forEach(function(actionName){ 
        if(actions_by_name[actionName]) actions_by_name[actionName].push(q); else actions_by_name[actionName] = [q]; 
      });

      // Split Topics
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
    if(this.DOM.SearchBlock) {
      if(this.selectedQuestion){
        this.DOM.root.attr("question",false);
        this.selectedQuestion.DOM.attr("selected",null);
        this.selectedQuestion = null;
      }
      this.DOM.TextSearchBlock.select(".SearchTextBox")[0][0].focus();
      // TODO: clear all filtering
      this.filterQuestions();
      return;
    }

    this.initData();
    this.DOM.SearchBlock = this.DOM.root.append("div").attr("class","SearchBlock");

    var me=this;
    this.DOM.root.append("div").attr("class","answer_box answer_ok")
      .html("Ok, thanks! <i class='fa fa-check-circle'></i>")
      .on("click",function(){ 
        me.closeQuestion(); 
        me.browser.panel_overlay.attr("show","none");
        setTimeout(function(){ me.DOM.root.attr("question",false); }, 1000);
      });
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
    this.initDOM_MoreInfo();

    this.filterQuestions();
  },
  initDOM_ClosePanel: function(){
    this.DOM.root.append("div").attr("class","overlay_Close fa fa-times-circle")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'ne', title: kshf.lang.cur.Close }); })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); })
      .on("click",function(){ 
        this.tipsy.hide();
        browser.panel_overlay.attr("show","none");
      });
  },
  initDOM_Relevance: function(){
    var me=this;
    this.DOM.SearchBlock.append("div").attr("class","hideNonRelevant").attr("hide",true)
      .on("click", function(){
        me.qFilters.relevant = !me.qFilters.relevant;
        this.setAttribute("hide", me.qFilters.relevant);
        me.filterQuestions();
      }).append("span").attr("class","fa");
  },
  initDOM_TextSearch: function(){
    var me=this;
    this.DOM.TextSearchBlock = this.DOM.SearchBlock.append("div").attr("class","TextSearchBlock");
    this.DOM.TextSearchBlock.append("span").html("How do I ");
    this.DOM.TextSearchBlock.append("input")
      .attr("type","text")
      .attr("class","SearchTextBox")
      .on("keyup", function(){
        me.qFilters.textSearch = this.value.toLowerCase();
        var pattern = new RegExp("("+me.qFilters.textSearch+")",'gi');
        var replaceWith = "<span class='textSearch_highlight'>$1</span>";
        me.DOM.questions.selectAll(".QuestionText").html(function(q){ return q.q.replace(pattern,replaceWith); });
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
    this.DOM.ActionSelect.append("span").attr("class","label").text(function(action){ return action.name;});
    this.DOM.ActionSelect.append("span").attr("class","num");

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
        .each(function(topic){ topic.DOM = this; })
        .on("click",function(topic){
          topic.selected = !topic.selected;
          this.setAttribute("selected",topic.selected);
          if(topic.selected) {
            me.qFilters.topics.push(topic);
          } else {
            //remove
            me.qFilters.topics.splice( me.qFilters.topics.indexOf(topic), 1);
          }
          me.filterQuestions();
        });
    this.DOM.TopicSelect.append("span").attr("class","label").text(function(topic){ return topic.name;});
    this.DOM.TopicSelect.append("span").attr("class","num");
    this.DOM.TopicSelect.append("span").attr("class","fa fa-question-circle topicInfoMark")
      .on("click",function(thingObj){
        alert(thingObj.thing);
        // TODO: Show what it is... 
        d3.event.stopPropagation();
        d3.event.preventDefault();
      })
  },
  initDOM_Questions: function(){
    var me=this;
    this.DOM.questions = this.DOM.root
      .append("div").attr("class","Questions")
      .selectAll(".QuestionBlock").data(questions).enter()
        .append("div").attr("class","QuestionBlock")
        .each(function(question){ question.DOM = d3.select(this); })
        .on("click", function(q){
          var isRelevant = q.isRelevant.call(me.browser);
          if(isRelevant===undefined || isRelevant===null || isRelevant === false){
            alert("The questions is not relevant for your data or view, because: \n"+q.relevance);
            return;
          }
          if(q.activate) {
            me.selectedQuestion = q;
            me.DOM.root.attr("question",true);
            me.DOM.root.attr("pos",q.posBottom?"bottom":"top");
            this.setAttribute("selected",true);
            me.browser.panel_overlay.attr("show","answer");
            q.activate.call(me.browser, q);
          } else {
            alert("Help action not yet implemented.\nCheck back soon!");
          }
        });

    this.DOM.questions.append("div").attr("class","QuestionIcons")
      .selectAll(".icon").data(function(d){ return d.actions.concat(d.topics); })
        .enter().append("span")
          //.attr("class",function(d){ return "icon fa type_"+d.replace(" ","_").toLowerCase(); }); 
          .attr("class",function(d){ 
            var v=d.replace(" ","_").toLowerCase();
            if(me.icons[v]) return "icon fa fa-"+me.icons[v]; 
          })
          .attr("title",function(d){ return d; });

    this.DOM.questions.append("div").attr("class","notInContext fa fa-exclamation-circle")
      .each(function(){ this.tipsy = new Tipsy(this, { gravity: 'nw', title: "Not relevant" }); })
      .on("mouseenter",function(){ this.tipsy.show(); })
      .on("mouseleave",function(){ this.tipsy.hide(); });

    this.DOM.questions.append("div").attr("class","QuestionText").html( function(d){ return d.q; } );
  },
  initDOM_MoreInfo: function(){
    this.DOM.root
      .append("div").attr("class","MoreInfo")
      .html("For more info (including the API), visit the "+
        "<a href='http://github.com/adilyalcin/Keshif/wiki' target='_blank' class='MoreInfoLink'>Keshif wiki</a>.");
  },
  highlightBox: function(DOM,text,pos){
    var bounds_main = this.browser.DOM.root[0][0].getBoundingClientRect();
    if(pos===undefined) pos = "w";
    var me=this;

    this.DOM.answers.selectAll(".highlightBox_nope").data(DOM[0], function(d,i){ return i; })
      .enter().append("div").attr("class","highlightBox")
      .each(function(d){  this.bounds = d.getBoundingClientRect(); })
      .style("left",  function(){ return (this.bounds.left-bounds_main.left-2)+"px"; })
      .style("width", function(){ return (this.bounds.width+4)+"px"; })
      .style("top",   function(){ return (this.bounds.top-bounds_main.top-2)+"px"; })
      .style("height",function(){ return (this.bounds.height+5)+"px"; })
      .each(function(d,i){ 
        if(i!==0) return;
        this.tipsy = new Tipsy(this, { gravity: pos, title: text }); 
        me.tooltips.push(this.tipsy);
        this.tipsy.show();
      });
  },
  closeQuestion: function(){
    if(this.selectedQuestion===null) return;
    this.DOM.answers.selectAll(".highlightBox").remove();
    if(kshf.activeTipsy) kshf.activeTipsy.hide();
    this.selectedQuestion.DOM.attr("selected",null);
    if(this.selectedQuestion.deactivate) this.selectedQuestion.deactivate.call(this.browser, this.selectedQuestion);
    this.tooltips.forEach(function(t){ t.hide(); });
    this.selectedQuestion = null;
  },
  filterQuestions: function(){
    questions.forEach(function(question){
      question.displayed = true;
      if(question.activate===undefined){
        question.DOM.style("color", "gray");
      }
      // Filter on relevance to the active interface
      if(question.displayed){
        var v = question.isRelevant.call(this.browser);
        var isInContext = v!==undefined && v!==null && v !== false;
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
        question.displayed = question.q.toLowerCase().indexOf(this.qFilters.textSearch)!==-1;
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
    this.DOM.ActionSelect.selectAll(".num").text(function(action){ return action.activeQ; });

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
    this.DOM.TopicSelect.selectAll(".num").text(function(topic){ return topic.activeQ; });
  },
};

