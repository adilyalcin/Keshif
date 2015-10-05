/*********************************

AggreSet

Copyright (c) 2015, University of Maryland
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

kshf.Summary_Set = function(){};
kshf.Summary_Set.prototype = new kshf.Summary_Base();
var Summary_Clique_functions = {
  initialize: function(browser,setListSummary){
    var me = this;
    this.browser = browser;
    this.setListSummary = setListSummary;

    this.DOM = {};

    this.pausePanning=false;
    this.gridPan_x=0;

    // Update sorting options of setListSummary (adding relatednesness metric...)
    this.setListSummary.catSortBy[0].name = this.browser.itemName+" #";
    this.setListSummary.insertSortingOption({
      name: "Relatedness",
      value: function(category){ return -category.MST.index; },
      prep: function(){ me.updatePerceptualOrder(); }
    });
    this.setListSummary.refreshSortOptions();
    this.setListSummary.DOM.optionSelect.attr("dir","rtl"); // quick hack: right-align the sorting label

    this.browser.updateCb = function(){
      me.refreshViz_All();
    };
    this.browser.previewCb = function(cleared){
      if(cleared){
        me._setPairs.forEach(function(d){ d.aggregate_Preview = 0; });
      }
      me.refreshViz_Preview();
    };
    this.browser.previewCompareCb = function(browser){
      me.refreshViz_Compare();
    };
    this.browser.ratioModeCb = function(cleared){
      me.show_subsets = this.ratioModeActive;
      me.refreshViz_All();
      me.refreshViz_Axis();
      me.refreshSetPair_Strength();
    };

    this.setListSummary.cbFacetSort = function(){
      me.updateSetPairSimilarity();
      me.refreshSetPair_Containment();
      me.refreshSetPair_Strength();
      me.refreshWindowSize();
      me.refreshRow_Position();
      me.refreshRow_LineWidths();
      me.DOM.setPairGroup.attr("animate_position",false);
      me.refreshSetPair_Position();
      setTimeout(function(){
        me.DOM.setPairGroup.attr("animate_position",true);
      },1000);
      me.updateMaxAggr_Active();
      me.refreshViz_Active();
      me.refreshRow_SetPairCount();
    };
    this.setListSummary.cbCatCulled = function(){
      if(me.pausePanning) return;
      me.checkPan();
      me.refreshSVGViewBox();
    };
    this.setListSummary.cbSetHeight = function(){
      // update self
      me.updateWidthFromHeight();
      me.updateSetPairScale();
      
      // do not show number labels if the row height is small
      me.DOM.chartRoot.attr("showNumberLabels",me.getRowHeight()>=30);
      
      me.DOM.root.attr('noanim',true);
      me.DOM.setPairGroup.attr("animate_position",false);
        me.refreshRow_LineWidths();
        me.refreshRow_Position();
        me.refreshSetPair_Background();
        me.refreshSetPair_Position();
        me.refreshViz_All();
        me.refreshViz_Axis();
        me.refreshWindowSize();
      setTimeout(function(){
        me.DOM.root.attr('noanim',false);
        me.DOM.setPairGroup.attr("animate_position",true);
      },100);
    };

    this._setPairs = [];
    this._setPairs_ID = {};
    this._sets = this.setListSummary._cats; // sorted already
    this._sets.forEach(function(set){ set.setPairs = []; });

    this.createSetPairs(this.setListSummary.items);

    // Inserts the DOM root under the setListSummary so that the matrix view is attached...
    this.DOM.root = this.setListSummary.DOM.root.insert("div",":first-child")
      .attr("class","kshfChart setPairSummary")
      .attr("filtered",false);

    // Use keshif's standard header
    this.insertHeader();
    this.DOM.headerGroup.style("height",(this.setListSummary.getHeight_Header())+"px");

    this.DOM.summaryTitle_text.html("Relations in "+this.setListSummary.summaryTitle);

    this.DOM.wrapper = this.DOM.root.append("div").attr("class","wrapper");
    this.DOM.chartRoot = this.DOM.wrapper.append("span")
      .attr("class","Summary_Set noselect")
      .attr("noanim",false)
      .attr("show_gridlines",true)
      ;

    var body=d3.select("body");
    this.DOM.chartRoot.append("span").attr("class","widthAdjust")
      .attr("title","Drag to adjust panel width")
      .on("mousedown", function (d, i) {
        if(d3.event.which !== 1) return; // only respond to left-click
        browser.DOM.root.style('cursor','ew-resize');
        me.DOM.root.attr('noanim',true);
        me.DOM.setPairGroup.attr("animate_position",false);
        var mouseInit_x = d3.mouse(body[0][0])[0];
        console.log("mouseInit_x: "+mouseInit_x);
        var initWidth = me.getWidth();
        var myHeight = me.getHeight();
        body.on("mousemove", function() {
          var mouseDif = d3.mouse(body[0][0])[0]-mouseInit_x;
          console.log("mouseNew_x: "+d3.mouse(body[0][0])[0]);
        var targetWidth = initWidth-mouseDif;
        var targetAngle_Rad = Math.atan(myHeight/targetWidth);
        var targetAngle_Deg = 90-(targetAngle_Rad*180)/Math.PI;
        targetAngle_Deg = Math.min(Math.max(targetAngle_Deg,30),60);
        me.noanim = true;
        me.summaryWidth = initWidth-mouseDif;
        me.checkWidth();
        me.refreshWindowSize();
        me.refreshRow_LineWidths();
        me.refreshSetPair_Position();
        }).on("mouseup", function(){
          browser.DOM.root.style('cursor','default');
          me.DOM.setPairGroup.attr("animate_position",true);
          me.DOM.root.attr('noanim',false);
          me.noanim = false;
          // unregister mouse-move callbacks
          body.on("mousemove", null).on("mouseup", null);
        });
        d3.event.preventDefault();
      })
      .on("click",function(){
          d3.event.stopPropagation();
          d3.event.preventDefault();
      });

    this.insertControls();

    this.setMappingID = this.browser.maxFilterID++;
    this.browser.items.forEach(function(item){ item.mappedDataCache[me.setMappingID] = []; });

    this.DOM.setMatrixSVG = this.DOM.chartRoot.append("svg").attr("xmlns","http://www.w3.org/2000/svg").attr("class","setMatrix");

    /** BELOW THE MATRIX **/
    this.DOM.belowMatrix = this.DOM.chartRoot.append("div").attr("class","belowMatrix");
    this.DOM.belowMatrix.append("div").attr("class","border_line");

    this.DOM.pairCount = this.DOM.belowMatrix.append("span").attr("class","pairCount matrixInfo");
    this.DOM.pairCount.append("span").attr("class","circleeee");
    this.DOM.pairCount_Text = this.DOM.pairCount.append("span").attr("class","pairCount_Text")
      .text(""+this._setPairs.length+" pairs( "+Math.round(100*this._setPairs.length/this.getSetPairCount_Total())+"%)");

    this.DOM.subsetCount = this.DOM.belowMatrix.append("span").attr("class","subsetCount matrixInfo");
    this.DOM.subsetCount.append("span").attr("class","circleeee borrderr");
    this.DOM.subsetCount_Text = this.DOM.subsetCount.append("span").attr("class","subsetCount_Text");

    // invisible background - Used for panning
    this.DOM.setMatrixBackground = this.DOM.setMatrixSVG.append("rect")
      .attr("x",0).attr("y",0)
      .style("fill-opacity","0")
      .on("mousedown",function(){
        var background_dom = this.parentNode.parentNode.parentNode.parentNode;

        background_dom.style.cursor = "all-scroll";
        me.browser.DOM.pointerBlock.attr("active","");

        var mouseInitPos = d3.mouse(background_dom);
        var gridPan_x_init = me.gridPan_x;

        // scroll the setlist summary too...
        var scrollDom = me.setListSummary.DOM.attribGroup[0][0];
        var initScrollPos = scrollDom.scrollTop;
        var w=me.getWidth();
        var h=me.getHeight();
        var initT = me.setListSummary.scrollTop_cache;
        var initR = Math.min(-initT-me.gridPan_x,0);

        me.pausePanning = true;

        me.browser.DOM.root.on("mousemove", function() {
            var mouseMovePos = d3.mouse(background_dom);
            var difX = mouseMovePos[0]-mouseInitPos[0];
            var difY = mouseMovePos[1]-mouseInitPos[1];

            me.gridPan_x = Math.min(0,gridPan_x_init+difX+difY);
            me.checkPan();

            var maxHeight = me.setListSummary.heightRow_category*me.setListSummary._cats.length - h;

            var t = initT-difY;
            t = Math.min(maxHeight,Math.max(0,t));
            var r = initR-difX;
            r = Math.min(0,Math.max(r,-t));

            me.panSVGViewBox(w,h,t,r);

            scrollDom.scrollTop = Math.max(0,initScrollPos-difY);

          d3.event.preventDefault();
          d3.event.stopPropagation();
        }).on("mouseup", function(){
          me.pausePanning = false;
          background_dom.style.cursor = "default";
            me.browser.DOM.root.on("mousemove", null).on("mouseup", null);
            me.browser.DOM.pointerBlock.attr("active",null);
            me.refreshLabel_Vert_Show();
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });
        d3.event.preventDefault();
        d3.event.stopPropagation();
      })
      ;

    this.DOM.setMatrixSVG.append("g").attr("class","rows");
    this.DOM.setPairGroup = this.DOM.setMatrixSVG.append("g").attr("class","setPairGroup").attr("animate_position",true);

    this.insertRows();
    this.insertSetPairs();

    this.updateWidthFromHeight();
    this.updateSetPairScale();

    this.refreshRow_Position();
    this.refreshRow_LineWidths();

    this.refreshSetPair_Background();
    this.refreshSetPair_Position();

    this.refreshViz_Axis();
    this.refreshSetPair_Containment();
    this.refreshViz_Active();

    this.refreshWindowSize();
  },
  /** -- */
  getHeight: function(){
    return this.setListSummary.attribHeight;
  },
  /** -- */
  getWidth: function(){
    return this.summaryWidth;
  },
  /** -- */
  getRowHeight: function(){
    return this.setListSummary.heightRow_category;
  },
  /** -- */
  getSetPairCount_Total: function(){
    return this._sets.length*(this._sets.length-1)/2;
  },
  /** -- */
  getSetPairCount_Empty: function(){
    return this.getSetPairCount_Total()-this._setPairs.length;
  },
  /** -- */
  updateWidthFromHeight: function(){
    this.summaryWidth = this.getHeight()+25;
    this.checkWidth();
  },
  /** -- */
  updateSetPairScale: function(){
    this.setPairDiameter = this.setListSummary.heightRow_category;
    this.setPairRadius = this.setPairDiameter/2;
  },
  /** -- */
  updateMaxAggr_Active: function(){
    this._maxSetPairAggr_Active = d3.max(this._setPairs, function(d){ return d.aggregate_Active; });
  },
  /** -- */
  checkWidth: function(){
    var minv=210;
    var maxv=Math.max(minv,this.getHeight())+40;
    this.summaryWidth = Math.min(maxv,Math.max(minv,this.summaryWidth));
  },
  /** -- */
  checkPan: function(){
    var maxv = 0;
    var minv = -this.setListSummary.scrollTop_cache;
    this.gridPan_x = Math.round(Math.min(maxv,Math.max(minv,this.gridPan_x)));
  },
  /** -- */
  insertControls: function(){
    var me=this;
    this.DOM.facetControls = this.DOM.chartRoot.append("div").attr("class","facetControls noselect")
      .style("height",(this.setListSummary.getHeight_Config())+"px"); // TODO: remove

    var buttonTop = (this.setListSummary.getHeight_Config()-18)/2;
    this.DOM.strengthControl = this.DOM.facetControls.append("span").attr("class","strengthControl")
      .on("click",function(){
        me.browser.setRatioMode(me.browser.ratioModeActive!==true);
      })
      .style("margin-top",buttonTop+"px")
      ;

    this.DOM.strengthControl.append("span").attr("class","strengthLabel").text("Weak")
      .style("text-align","left");
    this.DOM.strengthControl.append("span").text("Strength").style("padding","0px 2px");
    this.DOM.strengthControl.append("span").attr("class","strengthLabel").text("Strong")
      .style("text-align","right");

    var dom_xxxx=this.DOM.facetControls.append("span").attr("class","heyooo");
    
    this.DOM.scaleLegend_SVG = this.DOM.facetControls.append("svg").attr("xmlns","http://www.w3.org/2000/svg")
      .attr("class","sizeLegend noselect");

    this.DOM.legendHeader = this.DOM.scaleLegend_SVG.append("text").attr("class","legendHeader").text("#");
    this.DOM.legend_Group = this.DOM.scaleLegend_SVG.append("g");

    // ******************* ROW HEIGHT
    var domRowHeightControl = dom_xxxx.append("span").attr("class","configRowHeight configOpt");
    var sdad = domRowHeightControl.append("span").attr("class","configOpt_label")
    domRowHeightControl.append("span").attr("class","configOpt_icon")
      .append("span").attr("class","fa fa-search-plus");
    sdad.append("span").attr("class","sdsdssds").text("Zoom");
    sdad.append("span").attr("class","fa fa-plus").on("mousedown",function(){
      // TODO: Keep calling as long as the mouse is clicked - to a certain limit
      me.setListSummary.setHeightRow_attrib(me.getRowHeight()+1);
      me.DOM.chartRoot.attr("show_gridlines",(me.getRowHeight()>15));
      me.setListSummary.cbSetHeight();
      me.refreshSetPair_Strength();
      d3.event.stopPropagation();
    });
    sdad.append("span").attr("class","fa fa-minus").on("mousedown",function(){
      // TODO: Keep calling as long as the mouse is clicked - to a certain limit
      me.setListSummary.setHeightRow_attrib(me.getRowHeight()-1);
      me.DOM.chartRoot.attr("show_gridlines",(me.getRowHeight()>15));
      me.setListSummary.cbSetHeight();
      me.refreshSetPair_Strength();
      d3.event.stopPropagation();
    });
    sdad.append("span").attr("class","fa fa-arrows-alt").on("mousedown",function(){
      // TODO: Keep calling as long as the mouse is clicked - to a certain limit
      me.setListSummary.setHeightRow_attrib(10);
      me.DOM.chartRoot.attr("show_gridlines",false);
      me.setListSummary.cbSetHeight();
      me.refreshSetPair_Strength();
      d3.event.stopPropagation();
    });
  },
  /** -- */
  insertRows: function(){
    var me=this;

    var newRows = this.DOM.setMatrixSVG.select("g.rows").selectAll("g.row")
      .data(this._sets, function(d,i){ return d.id(); })
    .enter().append("g").attr("class","row")
      .attr("highlight",false)
      .each(function(d){
        d.setRow = this;
        this.setAttribute("setPairCount",d.setPairs.length)
      })
      .on("mouseenter",function(d,i){
        this.setAttribute("highlight","selected");
        me.setListSummary.cbAttribEnter(d,true);
      })
      .on("mouseleave",function(d,i){
        this.setAttribute("highlight",false);
        me.setListSummary.cbAttribLeave(d);
      })
      ;

    // tmp is used to parse html text. TODO: delete the temporary DOM
    var tmp = document.createElement("div");
    newRows.append("line").attr("class","line line_vert")
      .attr("x1",0).attr("y1",0).attr("y1",0).attr("y2",0);
    newRows.append("text").attr("class","label label_horz")
      .text(function(d){
        tmp.innerHTML = me.setListSummary.catLabel.call(d.data);
        return tmp.textContent || tmp.innerText || "";
      });
    newRows.append("line").attr("class","line line_horz")
      .attr("x1",0).attr("y1",0).attr("y2",0);
    newRows.append("text").attr("class","label label_vert")
      .text(function(d){
        tmp.innerHTML = me.setListSummary.catLabel.call(d.data);
        return tmp.textContent || tmp.innerText || "";
      })
      .attr("y",-4);

    this.DOM.setRows         = this.DOM.setMatrixSVG.selectAll("g.rows > g.row");
    this.DOM.line_vert       = this.DOM.setMatrixSVG.selectAll("g.rows > g.row > line.line_vert");
    this.DOM.line_horz       = this.DOM.setMatrixSVG.selectAll("g.rows > g.row > line.line_horz");
    this.DOM.line_horz_label = this.DOM.setMatrixSVG.selectAll("g.rows > g.row > text.label_horz");
    this.DOM.line_vert_label = this.DOM.setMatrixSVG.selectAll("g.rows > g.row > text.label_vert");
  },
  /** -- */
  insertSetPairs: function(){
    var me=this;
    var newCliques = this.DOM.setMatrixSVG.select("g.setPairGroup").selectAll("g.setPairMark")
      .data(this._setPairs,function(d,i){ return i; })
    .enter().append("g").attr("class","setPairMark")
      .each(function(d){
        d.DOM.setPairMark = this;
        d.items.forEach(function(item){ item.mappedDataCache[me.setMappingID].push(d); });
      })
      .on("mouseenter",function(d){
        var set_1 = d.set_1;
        var set_2 = d.set_2;
        
        set_1.setRow.setAttribute("highlight","selected");
        set_2.setRow.setAttribute("highlight","selected");

        set_1.DOM.facet.setAttribute("selectType","and");
        set_2.DOM.facet.setAttribute("selectType","and");

        // modify the attribute so that the and/or blocks are not shown per set name
        set_1.DOM.facet.setAttribute("highlight","selected-2");
        set_2.DOM.facet.setAttribute("highlight","selected-2");

        var timeoutTime = 500;
        if(me.browser.vizCompareActive) timeoutTime = 0;
        this.resultPreviewShowTimeout = setTimeout(function(){
          d.items.forEach(function(item){item.updatePreview();});
          me.browser.refreshResultPreviews();
        },timeoutTime);
      })
      .on("mouseleave",function(d){
        if(this.resultPreviewShowTimeout){
            clearTimeout(this.resultPreviewShowTimeout);
            this.resultPreviewShowTimeout = null;
        }

        var set_1 = d.set_1;
        var set_2 = d.set_2;

        set_1.setRow.setAttribute("highlight",false);
        set_2.setRow.setAttribute("highlight",false);

        set_1.DOM.facet.setAttribute("highlight",false);
        set_2.DOM.facet.setAttribute("highlight",false);

        me.browser.items.forEach(function(item){
          if(item.DOM.result) item.DOM.result.setAttribute("highlight",false);
        })

        me.browser.clearResultPreviews();
      })
      .on("click",function(d){
        var set_1 = d.set_1;
        var set_2 = d.set_2;

        if(set_1.DOM.facet.tipsy_active) set_1.DOM.facet.tipsy_active.hide();
        if(set_2.DOM.facet.tipsy_active) set_2.DOM.facet.tipsy_active.hide();
          me.setListSummary.filterAttrib(set_1,"AND");
          me.setListSummary.filterAttrib(set_2,"AND");
      })
      ;

    newCliques.append("rect").attr("class","setPairBackground").attr("rx",3).attr("ry",3);
    newCliques.append("circle").attr("class","setPairMark active").attr("cx",0).attr("cy",0).attr("r",0);
    newCliques.append("path").attr("class","setPairMark preview")
      .each(function(d){d.currentPreviewAngle=-Math.PI/2;});
    newCliques.append("path").attr("class","setPairMark_Compare");

    this.DOM.setPairMark          = this.DOM.setPairGroup.selectAll("g.setPairMark");
    this.DOM.setPairBackground    = this.DOM.setPairGroup.selectAll("g.setPairMark > rect.setPairBackground");
    this.DOM.setPairGlyph_Active  = this.DOM.setPairGroup.selectAll("g.setPairMark > circle.active");
    this.DOM.setPairGlyph_Preview = this.DOM.setPairGroup.selectAll("g.setPairMark > path.preview");
    this.DOM.setPairGlyph_Compare = this.DOM.setPairGroup.selectAll("g.setPairMark > path.setPairMark_Compare");
  },
  /** -- */
  refreshLabel_Vert_Show: function(){
    var me=this;
    var setListSummary=this.setListSummary;
    var totalWidth=this.getWidth();
    var totalHeight = this.getHeight();
    var w=this.getWidth();
    var h=this.getHeight();
    var t=this.setListSummary.scrollTop_cache;
    var r=(t)*-1;
    this.DOM.line_vert_label // points up/right
      .attr("show",function(d){ return d.isCulled; })
      .attr("transform",function(d){
        var i=d.orderIndex;
        var x=totalWidth-((i+0.5)*me.setPairDiameter)-2;
        var y=((me.setListSummary.catCount_Visible-i-1)*me.setPairDiameter);
        y-=setListSummary.getTotalAttribHeight()-setListSummary.scrollTop_cache-totalHeight;
        return "translate("+x+" "+y+") rotate(-90)";//" rotate(45) ";
      });
  },
  /** 
   * Notes:
   * - We can have multiple trees (there can be sub-groups disconnected from each other) 
   */
  updatePerceptualOrder: function(){
    var me=this;
    
    // Edges are set-pairs with at least one element inside (based on the filtering state)
    var edges = this._setPairs.filter(function(setPair){ return setPair.aggregate_Active>0; });
    // Notes are the set-categories
    var nodes = this.setListSummary._cats;

    // Initialize per-node (per-set) data structures
    nodes.forEach(function(node){
      node.MST = {
        tree: new Object(), // Some unqiue identifier, to check if two nodes are in the same tree.
        childNodes: [],
        parentNode: null
      };
    });

    // Compute the perceptual similarity metric (mst_distance)
    edges.forEach(function(edge){
      var set_1 = edge.set_1;
      var set_2 = edge.set_2;
      edge.mst_distance = 0;
      // For every intersection of set_1
      set_1.setPairs.forEach(function(setPair_1){
        if(setPair_1===edge) return;
        var set_other = (setPair_1.set_1===set_1)?setPair_1.set_2:setPair_1.set_1;
        // find the set-pair of set_2 and set_other;
        var setPair_2 = undefined;
        if(set_2.id()>set_other.id()){
          if(me._setPairs_ID[set_other.id()])
            setPair_2 = me._setPairs_ID[set_other.id()][set_2.id()];
        } else {
          if(me._setPairs_ID[set_2.id()])
            setPair_2 = me._setPairs_ID[set_2.id()][set_other.id()];
        }
        if(setPair_2===undefined){ // the other intersection size is zero, there is no link
          edge.mst_distance+=setPair_1.aggregate_Active;
          return;
        }
        edge.mst_distance += Math.abs(setPair_1.aggregate_Active-setPair_2.aggregate_Active);
      });
      // For every intersection of set_2
      set_2.setPairs.forEach(function(setPair_1){
        if(setPair_1===edge) return;
        var set_other = (setPair_1.set_1===set_2)?setPair_1.set_2:setPair_1.set_1;
        // find the set-pair of set_1 and set_other;
        var setPair_2 = undefined;
        if(set_1.id()>set_other.id()){
          if(me._setPairs_ID[set_other.id()])
            setPair_2 = me._setPairs_ID[set_other.id()][set_1.id()];
        } else {
          if(me._setPairs_ID[set_1.id()])
            setPair_2 = me._setPairs_ID[set_1.id()][set_other.id()];
        }
        if(setPair_2===undefined){ // the other intersection size is zero, there is no link
          edge.mst_distance+=setPair_1.aggregate_Active;
          return;
        }
        // If ther is setPair_2, it was already processed in the main loop above
      });
    });

    // Order the edges (setPairs) by their distance (lower score is better)
    edges.sort(function(e1, e2){ return e1.mst_distance-e2.mst_distance; });

    // Run Kruskal's algorithm...
    edges.forEach(function(setPair){
      var node_1 = setPair.set_1;
      var node_2 = setPair.set_2;
      // set_1 and set_2 are in the same tree
      if(node_1.MST.tree===node_2.MST.tree) return;
      // set_1 and set_2 are not in the same tree, connect set_2 under set_1
      var set_above, set_below;
      if(node_1.setPairs.length<node_2.setPairs.length){
        set_above = node_1;
        set_below = node_2;
      } else {
        set_above = node_2;
        set_below = node_1;
      }
      set_below.MST.tree = set_above.MST.tree;
      set_below.MST.parentNode = set_above;
      set_above.MST.childNodes.push(set_below);
    });

    // Identify the root-nodes of resulting MSTs
    var treeRootNodes = nodes.filter(function(node){ return node.MST.parentNode===null; });

    // Update tree size recursively by starting at the root nodes
    var updateTreeSize = function(node){
      node.MST.treeSize=1;
      node.MST.childNodes.forEach(function(childNode){ node.MST.treeSize+=updateTreeSize(childNode); });
      return node.MST.treeSize;
    };
    treeRootNodes.forEach(function(rootNode){ updateTreeSize(rootNode); });

    // Sort the root nodes by largest tree first
    treeRootNodes.sort(function(node1, node2){ return node1.MST.treeSize - node2.MST.treeSize; });
    
    // For each MST, traverse the nodes and add the MST (perceptual) node index incrementally
    var mst_index = 0;
    var updateNodeIndex = function(node){
      node.MST.childNodes.forEach(function(chileNode){ chileNode.MST.index = mst_index++; });
      node.MST.childNodes.forEach(function(chileNode){ updateNodeIndex(chileNode); });
    };
    treeRootNodes.forEach(function(node){
      node.MST.index = mst_index++;
      updateNodeIndex(node);
    });
  },
  /** -- */
  refreshViz_Axis: function(){
    var me=this;

    if(this.browser.ratioModeActive){
      this.DOM.scaleLegend_SVG.style("display","none");
      return;
    }
    this.DOM.scaleLegend_SVG.style("display","block");

    this.DOM.scaleLegend_SVG
      .attr("width",this.setPairDiameter+50)
      .attr("height",this.setPairDiameter+10)
      .attr("viewBox","0 0 "+(this.setPairDiameter+50)+" "+(this.setPairDiameter+10));

    this.DOM.legend_Group
      .attr("transform", "translate("+(this.setPairRadius)+","+(this.setPairRadius+18)+")");
    this.DOM.legendHeader
      .attr("transform", "translate("+(2*this.setPairRadius+3)+",6)");

    var maxVal = this._maxSetPairAggr_Active;
    
    tickValues = [maxVal];
    if(this.setPairRadius>8) tickValues.push(Math.round(maxVal/4));

    this.DOM.legend_Group.selectAll("g.legendMark").remove();

    var tickDoms = this.DOM.legend_Group.selectAll("g.legendMark")
      .data(tickValues,function(i){return i;});

    this.DOM.legendCircleMarks = tickDoms.enter().append("g").attr("class","legendMark");

    this.DOM.legendCircleMarks.append("circle").attr("class","legendCircle")
      .attr("cx",0).attr("cy",0)
      .attr("r",function(d,i){
        return me.setPairRadius*Math.sqrt(d/maxVal);
      });
    this.DOM.legendCircleMarks.append("line").attr("class","legendLine")
      .each(function(d,i){
        var rx=me.setPairRadius+3;
        var ry=me.setPairRadius*Math.sqrt(d/maxVal);
        var x2,y1;
        switch(i%4){
          case 0:
            x2 = rx;
            y1 = -ry;
            break;
          case 1:
            x2 = rx; // -rx;
            y1 = ry; // -ry;
            break;
          case 2:
            x2 = rx;
            y1 = ry;
            break;
          case 3:
            x2 = -rx;
            y1 = ry;
            break;
        }
        this.setAttribute("x1",0);
        this.setAttribute("x2",x2);
        this.setAttribute("y1",y1);
        this.setAttribute("y2",y1);
      });
    this.DOM.legendText = this.DOM.legendCircleMarks
      .append("text").attr("class","legendLabel");

    this.DOM.legendText.each(function(d,i){
      var rx=me.setPairRadius+3;
      var ry=me.setPairRadius*Math.sqrt(d/maxVal);
      var x2,y1;
      switch(i%4){
        case 0:
          x2 = rx;
          y1 = -ry;
          break;
        case 1:
          x2 = rx; // -rx;
          y1 = ry; // -ry;
          break;
        case 2:
          x2 = rx;
          y1 = ry;
          break;
        case 3:
          x2 = -rx;
          y1 = ry;
          break;
      }
      this.setAttribute("transform","translate("+x2+","+y1+")");
      this.style.textAnchor = (i%2===0||true)?"start":"end";
    });

    this.DOM.legendText.text(function(d){ return d3.format("s")(d); });
  },
  /** -- */
  refreshWindowSize: function(){
    var w=this.getWidth();
    var h=this.getHeight();
    this.DOM.wrapper.style("height",(
      this.setListSummary.getHeight()-this.setListSummary.getHeight_Header())+"px");
    this.DOM.setMatrixBackground
      .attr("x",-w*24)
      .attr("y",-h*24)
      .attr("width",w*50)
      .attr("height",h*50);
    this.DOM.root
      .style("left",(-w)+"px")

    if(!this.pausePanning) this.refreshSVGViewBox();
  },
  /** -- */
  panSVGViewBox: function(w,h,t,r){
    this.DOM.setMatrixSVG.attr("viewBox",r+" "+t+" "+w+" "+h);
  },
  /** -- */
  refreshSVGViewBox: function(){
    var w=this.getWidth();
    var h=this.getHeight();
    var t=this.setListSummary.scrollTop_cache;
    var r=Math.min(-t-this.gridPan_x,0);  // r cannot be positive
    this.DOM.setMatrixSVG
      .attr("width",w)
      .attr("height",h)
      .attr("viewBox",r+" "+t+" "+w+" "+h);

    this.refreshLabel_Vert_Show();
  },
  /** -- */
  refreshViz_All: function(){
    this.updateMaxAggr_Active();
    this.refreshViz_Active();
    this.refreshViz_Preview();
    this.refreshViz_Compare();
  },
  /** -- */
  refreshSetPair_Background: function(){
    this.DOM.setPairBackground
      .attr("x",-this.setPairRadius)
      .attr("y",-this.setPairRadius)
      .attr("width",this.setPairDiameter)
      .attr("height",this.setPairDiameter);
  },
  /** Call when aggregate_Active is updated -> After filtering */
  updateSetPairSimilarity: function(){
    var me=this;
    this._setPairs.forEach(function(setPair){
      var size_A = setPair.set_1.aggregate_Active;
      var size_B = setPair.set_2.aggregate_Active;
      var size_and = setPair.aggregate_Active;
      setPair.Similarity = (size_and===0 || (size_A===0&&size_B===0)) ? 0 : size_and/Math.min(size_A,size_B);
    });
    this._maxSimilarity = d3.max(this._setPairs, function(d){ return d.Similarity; });
  },
  /** -- */
  updateSetAvgDegree: function(){
    var filterID = this.setListSummary.summaryFilter.id;
    this._sets.forEach(function(set){
      var totalDegree = 0;
      set.items.forEach(function(item){
        var setsOfItem=item.mappedDataCache[filterID];
        if(setsOfItem) totalDegree+=setsOfItem.length;
      });
      set.avgDegree = totalDegree/set.items.length;
    });
  },
  /** For each element in the given list, checks the set membership and adds setPairs */
  createSetPairs: function(elementList,mustSet){
    var me=this;
    var filterID = this.setListSummary.summaryFilter.id;

    var insertToClique = function(set_1,set_2,dataItem){
      // avoid self reference and adding the same data item twice, once for A-B, once for B-A
      // set_2.id() must be bigger than set1_.id()
      if(set_2.id()<=set_1.id()) return;
      // If only adding set-Pairs for a specific set...
      if(mustSet){
        // one of the sets must be the given set
        if(mustSet.id()!==set_2.id() && mustSet.id()!==set_1.id()) return;
      }

      if(me._setPairs_ID[set_1.id()]===undefined){
        me._setPairs_ID[set_1.id()] = {};
      }
      var targetClique = me._setPairs_ID[set_1.id()][set_2.id()];

      if(targetClique===undefined){
        targetClique = new kshf.Item([me._setPairs.length],0);
        targetClique.set_1 = set_1;
        targetClique.set_2 = set_2;
        set_1.setPairs.push(targetClique);
        set_2.setPairs.push(targetClique);

        me._setPairs.push(targetClique);
        me._setPairs_ID[set_1.id()][set_2.id()] = targetClique;
      }
      targetClique.addItem(dataItem);
    };

    // AND
    elementList.forEach(function(dataItem){
      var setsOfItem = dataItem.mappedDataCache[filterID];
      if(setsOfItem===null || setsOfItem===undefined) return;
      setsOfItem.forEach(function(set_1){
        // make sure set_1 has an attrib on c display
        if(set_1.setPairs===undefined) return;
        setsOfItem.forEach(function(set_2){
          if(set_2.setPairs===undefined) return;
          insertToClique(set_1,set_2,dataItem);
        });
      });
    });

    this.updateMaxAggr_Active();
    this.updateSetPairSimilarity();
    this.updateSetAvgDegree();
  },
  /** -- */
  refreshRow_LineWidths: function(){
    var me=this;
    var setPairDiameter=this.setPairDiameter;
    var totalWidth=this.getWidth();
    var totalHeight = this.getHeight();
    // vertical
    this.DOM.line_vert.each(function(d){
      var i=d.orderIndex;
      var height=((me.setListSummary.catCount_Visible-i-1)*setPairDiameter);
      var right=((i+0.5)*setPairDiameter);
      this.setAttribute("x1",totalWidth-right);
      this.setAttribute("x2",totalWidth-right);
      this.setAttribute("y2",height);
    });
    // horizontal
    this.DOM.line_horz.attr("x2",totalWidth).attr("x1",function(d){
      return totalWidth-((d.orderIndex+0.5)*setPairDiameter)
    });
    this.DOM.line_horz_label.attr("transform",function(d){
      return "translate("+(totalWidth-((d.orderIndex+0.5)*setPairDiameter)-2)+" 0)";
    });
  },
  /** -- */
  refreshRow_SetPairCount: function(){
    this.DOM.setRows
      .attr("setPairCount",function(d){
        var i=0;
        d.setPairs.forEach(function(setPair){ i+=(setPair.aggregate_Active>0); });
        return i;
      })
      .style("opacity",function(d){ return (d.aggregate_Active>0)?1:0.3; })
      ;
  },
  /** -- */
  refreshRow_Position: function(){
    var rowHeight=this.setPairDiameter;
    this.DOM.setRows.attr("transform",function(set){ return "translate(0,"+((set.orderIndex+0.5)*rowHeight)+")"; });
  },
  /** -- */
  refreshSetPair_Position: function(){
    var me=this;
    var w=this.getWidth();
    this.DOM.setPairMark.each(function(setPair){
      var i1 = setPair.set_1.orderIndex;
      var i2 = setPair.set_2.orderIndex;
      var left = w-(Math.min(i1,i2)+0.5)*me.setPairDiameter;
      var top  = (Math.max(i1,i2)+0.5)*me.setPairDiameter;
      kshf.Util.setTransform(this,"translate("+left+"px,"+top+"px)");
    });
  },
  /** -- */
  getCliqueSizeRatio: function(setPair){
    return Math.sqrt(setPair.aggregate_Active/this._maxSetPairAggr_Active);
  },
  // Given a setPair, return the angle for preview
  getPreviewAngle_rad: function(setPair){
    if(setPair.aggregate_Active===0) return 0;
    var ratio=setPair.aggregate_Preview/setPair.aggregate_Active;
    if(this.browser.preview_not) ratio = 1-ratio;
    if(ratio===1) ratio=0.999;
    return ((360*ratio-90) * Math.PI) / 180;
  },
  /** -- */
  // http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
  // http://stackoverflow.com/questions/15591614/svg-radial-wipe-animation-using-css3-js
  // http://jsfiddle.net/Matt_Coughlin/j3Bhz/5/
  getPiePath: function(endAngleRad,sub,ratio){
    var r = ratio*this.setPairRadius-sub;
    var endX = Math.cos(endAngleRad) * r;
    var endY = Math.sin(endAngleRad) * r;
    var largeArcFlag = (endAngleRad>Math.PI/2)?1:0;
    return "M 0,"+(-r)+" A "+r+","+r+" "+largeArcFlag+" "+largeArcFlag+" 1 "+endX+","+endY+" L0,0";
  },
  /** -- */
  refreshViz_Total: function(){
    // setPairMark do not have a total component
  },
  /** -- */
  refreshViz_Active: function(){
    var me=this;
    this.DOM.setPairMark.attr("activesize",function(setPair){ return setPair.aggregate_Active; });
    this.DOM.setPairGlyph_Active.transition().duration(this.noanim?0:700)
      .attr("r",this.browser.ratioModeActive ?
        function(setPair){ return (setPair.subset!=='') ? me.setPairRadius-1 : me.setPairRadius; } :
        function(setPair){ return me.getCliqueSizeRatio(setPair)*me.setPairRadius; }
      );
  },
  /** -- */
  refreshViz_Preview: function(){
    var me=this;
    this.DOM.setPairGlyph_Preview
      .transition().duration(500).attrTween("d",function(d) {
        var angleInterp = d3.interpolate(d.currentPreviewAngle, me.getPreviewAngle_rad(d));
        var ratio=(me.browser.ratioModeActive)?1:me.getCliqueSizeRatio(d);
        return function(t) {
          var newAngle=angleInterp(t);
          d.currentPreviewAngle = newAngle;
          return me.getPiePath(newAngle,(d.subset!=='' && me.browser.ratioModeActive)?2:0,ratio);
        };
      })
      .each(function(d){
        this.parentNode.setAttribute("highlight",d.aggregate_Preview>0);
      })
    ;
  },
  /** -- */
  refreshViz_Compare: function(){
    var me=this;
      if(this.browser.vizCompareActive===false){
        this.DOM.setPairGlyph_Compare.attr("hidden",true);
      } else {
        this.DOM.setPairGlyph_Compare
          .attr("d",function(setPair){
            var ratio=(me.browser.ratioModeActive)?1:me.getCliqueSizeRatio(setPair);
            this.setAttribute('hidden',setPair.aggregate_Preview===0);
            return me.getPiePath(setPair.currentPreviewAngle,1,ratio);
          });
      }
  },
  /** -- */
  refreshSetPair_Containment: function(){
    var me=this;
    var numOfSubsets = 0;
    this.DOM.setPairGlyph_Active
      .each(function(setPair){
        var setPair_itemCount = setPair.aggregate_Active;
        var set_1_itemCount   = setPair.set_1.aggregate_Active;
        var set_2_itemCount   = setPair.set_2.aggregate_Active;
        if(setPair_itemCount===set_1_itemCount || setPair_itemCount===set_2_itemCount){
          numOfSubsets++;
          setPair.subset = (set_1_itemCount===set_2_itemCount)?'equal':'proper';
        } else {
          setPair.subset = '';
        }
      })
      .attr("subset",function(setPair){ return setPair.subset!==''; });

    this.DOM.subsetCount.style("display",(numOfSubsets===0)?"none":null);
    this.DOM.subsetCount_Text.text(numOfSubsets);

    this.refreshSetPair_Strength();
  },
  /** -- */
  refreshSetPair_Strength: function(){
    var me=this;
    
    this.DOM.chartRoot.attr("showStrength",this.browser.ratioModeActive);

    var strengthColor = d3.interpolateHsl(d3.rgb(230, 230, 247),d3.rgb(159, 159, 223));
    this.DOM.setPairGlyph_Active.style("fill",function(setPair){
      if(!me.browser.ratioModeActive) return null;
      return strengthColor(setPair.Similarity/me._maxSimilarity);
    });

    if(this.browser.ratioModeActive){
      this.DOM.setPairGlyph_Active.each(function(setPair){
        // border
        if(setPair.subset==='') return;
        if(setPair.subset==='equal'){
          this.style.strokeDasharray = "";
          this.style.strokeDashoffset = "";
          return;
        }
        var halfCircle = (me.setPairRadius-1)*Math.PI;
        this.style.strokeDasharray = halfCircle+"px";
        // rotate halfway 
        var i1 = setPair.set_1.orderIndex;
        var i2 = setPair.set_2.orderIndex;
        var c1 = setPair.set_1.aggregate_Active;
        var c2 = setPair.set_2.aggregate_Active;
        if((i1<i2 && c1<c2) || (i1>i2 && c1>c2)) {
          halfCircle = halfCircle/2;
        }
        this.style.strokeDashoffset = halfCircle+"px";
      });
    }
  },
};

for(var index in Summary_Clique_functions){
    kshf.Summary_Set.prototype[index] = Summary_Clique_functions[index];
}
