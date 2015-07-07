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

		// Update sorting options of setListSummary (adding relatednesness metric...)
		this.setListSummary.catSortBy[0].name = this.browser.itemName+" #";
		this.setListSummary.catSortBy.push(
			this.setListSummary.prepareSortingOption({
				name: "Relatedness",
				value: function(d){ return -d.MST.index; },
				prep: function(){ me.updatePerceptualOrder(); }
			})
		);
		this.setListSummary.refreshSortOptions();
		this.setListSummary.DOM.optionSelect.attr("dir","rtl"); // quick hack: right-align the sorting label

		// show cliques by default.
		this.setListSummary.DOM.root.attr("show_cliques",true);

		this.DOM = {};

		this.pausePanning=false;
		this.gridPan_x=0;

		this.browser.updateCb = function(){
			me.refreshViz_All();
		};
		this.browser.previewCb = function(cleared){
		    if(cleared){
		        me._cliques.forEach(function(d){ d.aggregate_Preview = 0; });
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
    		me.refreshClique_Strength();
		};

		this.setListSummary.cbFacetSort = function(){
			me.updateCliqueSimilarity();
			me.refreshClique_Containment();
			me.refreshClique_Strength();
			me.refreshWindowSize();
			me.refreshRow_Position();
			me.refreshRow_LineWidths();
			me.DOM.cliqueGroup.attr("animate_position",false);
			me.refreshClique_Position();
			setTimeout(function(){
				me.DOM.cliqueGroup.attr("animate_position",true);
			},1000);
			me.updateMaxAggr_Active();
			me.refreshViz_Active();
			me.refreshRow_CliqueCount();
		};
		this.setListSummary.cbCatCulled = function(){
			if(me.pausePanning) return;
			me.checkPan();
			me.refreshSVGViewBox();
		};
		this.setListSummary.cbSetHeight = function(){
			// update self
			me.updateWidthFromHeight();
			me.updateCliqueScale();
			
			// do not show number labels if the row height is small
			me.DOM.chartRoot.attr("showNumberLabels",me.getRowHeight()>=30);
			
			me.DOM.root.attr('noanim',true);
			me.DOM.cliqueGroup.attr("animate_position",false);
				me.refreshRow_LineWidths();
				me.refreshRow_Position();
				me.refreshClique_Background();
				me.refreshClique_Position();
				me.refreshViz_All();
				me.refreshViz_Axis();
				me.refreshWindowSize();
			setTimeout(function(){
				me.DOM.root.attr('noanim',false);
				me.DOM.cliqueGroup.attr("animate_position",true);
			},100);
		};
		this.setListSummary.cbSaveFilter = function(){
			// there's a new row-set
			me._sets.forEach(function(item){
				if(item.cliqueList===undefined){
					item.cliqueList = [];
					me.createCliques(item.items,item);
				}
			});
			me.updateMaxAggr_Total();
			me.updateMaxAggr_Active();
			me.updateCliqueSimilarity();

			me.updateSetAvgDegree();

			// update DOM
			me.insertRows();
			me.insertCliques();
		};

		this._cliques = [];
		this._cliques_id = {};
		this._sets = this.setListSummary._cats; // sorted already
		this._sets.forEach(function(set){ set.cliqueList = []; });

		this.createCliques(this.setListSummary.items);

		// Inserts the DOM root under the setListSummary so that the matrix view is attached...
		this.DOM.root = this.setListSummary.DOM.root.insert("div",":first-child")
			.attr("class","kshfChart cliqueChart")
	        .attr("filtered",false)
	        .style("position","absolute")
	        .style("top","0px")
	        ;

	    // Use keshif's standard header
		this.insertHeader();
		this.DOM.headerGroup.style("height",(this.setListSummary.getHeight_Header())+"px");

		this.DOM.summaryTitle_text.html("Relations in "+this.setListSummary.summaryTitle);

		this.DOM.wrapper = this.DOM.root.append("div").attr("class","wrapper");
		this.DOM.chartRoot = this.DOM.wrapper.append("span")
			.attr("class","Summary_Set noselect")
			.attr("highlight_cliques",this.getCliqeCount_Empty()>0)
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
			    me.DOM.cliqueGroup.attr("animate_position",false);
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
					me.refreshClique_Position();
			    }).on("mouseup", function(){
			        browser.DOM.root.style('cursor','default');
			        me.DOM.cliqueGroup.attr("animate_position",true);
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

		this.mappingID = this.browser.maxFilterID++;
		this.browser.items.forEach(function(item){ item.mappedDataCache[me.mappingID] = []; });

		this.DOM.cliqueSVG = this.DOM.chartRoot.append("svg").attr("xmlns","http://www.w3.org/2000/svg")
			.style("display","block")
			.style("border-right","dotted 1px lightgray");
		this.DOM.belowMatrix = this.DOM.chartRoot.append("div").attr("class","belowMatrix");

		this.DOM.belowMatrix.append("div").attr("class","border_line");

		this.DOM.pairCount = this.DOM.belowMatrix.append("span").attr("class","pairCount matrixInfo");
		this.DOM.pairCount.append("span").attr("class","circleeee");
		this.DOM.pairCount_Text = this.DOM.pairCount.append("span").attr("class","pairCount_Text")
			.text(""+this._cliques.length+" pairs"/*( "+
				Math.round(100*this._cliques.length/this.getCliqueCount_Total())+"%)"*/);

		this.DOM.subsetCount = this.DOM.belowMatrix.append("span").attr("class","subsetCount matrixInfo");
		this.DOM.subsetCount.append("span").attr("class","circleeee borrderr");
		this.DOM.subsetCount_Text = this.DOM.subsetCount.append("span").attr("class","subsetCount_Text");

		// invisible background
		this.DOM.cliqueChartBackground = this.DOM.cliqueSVG.append("rect")
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

				    var t = initT-difY;
				    t = Math.max(0,t);
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

		this.DOM.cliqueSVG.append("g").attr("class","rows");
		this.DOM.cliqueGroup = this.DOM.cliqueSVG.append("g").attr("class","cliqueGroup")
			.attr("animate_position",true);

		this.insertRows();
		this.insertCliques();

		this.updateWidthFromHeight();
		this.updateCliqueScale();

		this.refreshRow_Position();
		this.refreshRow_LineWidths();

		this.refreshClique_Background();
		this.refreshClique_Position();

		this.refreshViz_Axis();
		this.refreshClique_Containment();
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
	updateWidthFromHeight: function(){
		this.summaryWidth = this.getHeight()+25;
		this.checkWidth();
	},
	/** -- */
	getRowHeight: function(){
		return this.setListSummary.heightRow_category;
	},
	/** -- */
	updateCliqueScale: function(){
		this.cliqueDiameter = this.setListSummary.heightRow_category;
		this.cliqueRadius = this.cliqueDiameter/2;
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
	getCliqueCount_Total: function(){
		return this._sets.length*(this._sets.length-1)/2;
	},
	/** -- */
	getCliqeCount_Empty: function(){
		return this.getCliqueCount_Total()-this._cliques.length;
	},
	/** -- */
	insertControls: function(){
		var me=this;
		this.DOM.facetControls = this.DOM.chartRoot.append("div").attr("class","facetControls noselect")
			.style("height",(this.setListSummary.getHeight_Config())+"px"); // TODO: remove

		var buttonTop = (this.setListSummary.getHeight_Config()-18)/2;
		this.DOM.strengthControl = this.DOM.facetControls.append("span").attr("class","strengthControl")
			.on("click",function(){
				// flip the mode
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
			me.refreshClique_Strength();
			d3.event.stopPropagation();
		});
		sdad.append("span").attr("class","fa fa-minus").on("mousedown",function(){
			// TODO: Keep calling as long as the mouse is clicked - to a certain limit
			me.setListSummary.setHeightRow_attrib(me.getRowHeight()-1);
			me.DOM.chartRoot.attr("show_gridlines",(me.getRowHeight()>15));
			me.setListSummary.cbSetHeight();
			me.refreshClique_Strength();
			d3.event.stopPropagation();
		});
		sdad.append("span").attr("class","fa fa-arrows-alt").on("mousedown",function(){
			// TODO: Keep calling as long as the mouse is clicked - to a certain limit
			me.setListSummary.setHeightRow_attrib(10);
			me.DOM.chartRoot.attr("show_gridlines",false);
			me.setListSummary.cbSetHeight();
			me.refreshClique_Strength();
			d3.event.stopPropagation();
		});
	},
	/** -- */
	insertRows: function(){
		var me=this;

		var newRows = this.DOM.cliqueSVG.select("g.rows").selectAll("g.row")
			.data(this._sets, function(d,i){ return d.id(); })
		.enter().append("g").attr("class","row")
			.attr("highlight",false)
			.each(function(d){
				d.cliqueRow = this;
				this.setAttribute("cliqueCount",d.cliqueList.length)
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

		this.DOM.cliqueRows  = this.DOM.cliqueSVG.selectAll("g.rows > g.row");
		this.DOM.line_vert   = this.DOM.cliqueSVG.selectAll("g.rows > g.row > line.line_vert");
		this.DOM.line_horz   = this.DOM.cliqueSVG.selectAll("g.rows > g.row > line.line_horz");
		this.DOM.line_horz_label = this.DOM.cliqueSVG.selectAll("g.rows > g.row > text.label_horz");
		this.DOM.line_vert_label = this.DOM.cliqueSVG.selectAll("g.rows > g.row > text.label_vert");
	},
	/** -- */
	insertCliques: function(){
		var me=this;
		var newCliques = this.DOM.cliqueSVG.select("g.cliqueGroup").selectAll("g.clique")
			.data(this._cliques,function(d,i){ return i; })
		.enter().append("g").attr("class","clique")
			.each(function(d){
				d.items.forEach(function(item){ item.mappedDataCache[me.mappingID].push(d); });
			})
			.on("mouseenter",function(d){
				var set_1 = d.set_1;
				var set_2 = d.set_2;
				
				set_1.cliqueRow.setAttribute("highlight","selected");
				set_2.cliqueRow.setAttribute("highlight","selected");

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

				set_1.cliqueRow.setAttribute("highlight",false);
				set_2.cliqueRow.setAttribute("highlight",false);

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
	//			if(!set_1.is_AND())
					me.setListSummary.filterAttrib(set_1,"AND");
	//			if(!set_2.is_AND())
					me.setListSummary.filterAttrib(set_2,"AND");
			})
			;

		newCliques.append("rect").attr("class","cliqueBackground").attr("rx",3).attr("ry",3);
		newCliques.append("circle").attr("class","cliqueMark active").attr("cx",0).attr("cy",0).attr("r",0);
		newCliques.append("path").attr("class","cliqueMark preview")
			.each(function(d){d.currentPreviewAngle=-Math.PI/2;});
		newCliques.append("path").attr("class","cliqueMark-preview-compare");

		this.DOM.cliques = this.DOM.cliqueGroup.selectAll("g.clique");
		this.DOM.cliqueBackground   = this.DOM.cliqueGroup.selectAll("g.clique > rect.cliqueBackground");
		this.DOM.cliquesMarkActive  = this.DOM.cliqueGroup.selectAll("g.clique > circle.active");
		this.DOM.cliquesMarkPreview = this.DOM.cliqueGroup.selectAll("g.clique > path.preview");
		this.DOM.cliquesMarkCompare = this.DOM.cliqueGroup.selectAll("g.clique > path.cliqueMark-preview-compare");
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
			.attr("show",function(d){ return d.isCulled;})
			.attr("transform",function(d){
				var i=d.orderIndex;
				var x=totalWidth-((i+0.5)*me.cliqueDiameter)-2;
				var y=((me.setListSummary.catCount_Visible-i-1)*me.cliqueDiameter);
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
		
		// Edges are cliques with at least one element inside (based on the filtering state)
		var edges = this._cliques.filter(function(clique){ return clique.aggregate_Active>0; });
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
			set_1.cliqueList.forEach(function(clique_1){
				if(clique_1===edge) return;
				var set_other = (clique_1.set_1===set_1)?clique_1.set_2:clique_1.set_1;
				// find the clique of set_2 and set_other;
				var clique_2 = undefined;
				if(set_2.id()>set_other.id()){
					if(me._cliques_id[set_other.id()])
						clique_2 = me._cliques_id[set_other.id()][set_2.id()];
				} else {
					if(me._cliques_id[set_2.id()])
						clique_2 = me._cliques_id[set_2.id()][set_other.id()];
				}
				if(clique_2===undefined){ // the other intersection size is zero, there is no link
					edge.mst_distance+=clique_1.aggregate_Active;
					return;
				}
				edge.mst_distance += Math.abs(clique_1.aggregate_Active-clique_2.aggregate_Active);
			});
			// For every intersection of set_2
			set_2.cliqueList.forEach(function(clique_1){
				if(clique_1===edge) return;
				var set_other = (clique_1.set_1===set_2)?clique_1.set_2:clique_1.set_1;
				// find the clique of set_1 and set_other;
				var clique_2 = undefined;
				if(set_1.id()>set_other.id()){
					if(me._cliques_id[set_other.id()])
						clique_2 = me._cliques_id[set_other.id()][set_1.id()];
				} else {
					if(me._cliques_id[set_1.id()])
						clique_2 = me._cliques_id[set_1.id()][set_other.id()];
				}
				if(clique_2===undefined){ // the other intersection size is zero, there is no link
					edge.mst_distance+=clique_1.aggregate_Active;
					return;
				}
				// If ther is clique_2, it was already processed in the main loop above
			});
		});

		// Order the edges (cliques) by their distance (lower score is better)
		edges.sort(function(e1, e2){ return e1.mst_distance-e2.mst_distance; });

		// Run Kruskal's algorithm...
		edges.forEach(function(clique){
			var node_1 = clique.set_1;
			var node_2 = clique.set_2;
			// set_1 and set_2 are in the same tree
			if(node_1.MST.tree===node_2.MST.tree) return;
			// set_1 and set_2 are not in the same tree, connect set_2 under set_1
			var set_above, set_below;
			if(node_1.cliqueList.length<node_2.cliqueList.length){
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

		this.DOM.chartRoot.attr("highlight_cliques",this.browser.ratioModeActive===false);
		if(this.browser.ratioModeActive){
			this.DOM.scaleLegend_SVG.style("display","none");
			return;
		}
		this.DOM.scaleLegend_SVG.style("display","block");

		this.DOM.scaleLegend_SVG
			.attr("width",this.cliqueDiameter+50)
			.attr("height",this.cliqueDiameter+10)
			.attr("viewBox","0 0 "+(this.cliqueDiameter+50)+" "+(this.cliqueDiameter+10));

		this.DOM.legend_Group
			.attr("transform", "translate("+(this.cliqueRadius)+","+(this.cliqueRadius+18)+")");
		this.DOM.legendHeader
			.attr("transform", "translate("+(2*this.cliqueRadius+3)+",6)");

		var maxVal = this._maxCliqueAggr_Active;
		
		tickValues = [maxVal];
		if(this.cliqueRadius>8) tickValues.push(Math.round(maxVal/4));

		this.DOM.legend_Group.selectAll("g.legendMark").remove();

		var tickDoms = this.DOM.legend_Group.selectAll("g.legendMark")
			.data(tickValues,function(i){return i;});

		this.DOM.legendCircleMarks = tickDoms.enter().append("g").attr("class","legendMark");

		this.DOM.legendCircleMarks.append("circle").attr("class","legendCircle")
			.attr("cx",0).attr("cy",0)
			.attr("r",function(d,i){
				return me.cliqueRadius*Math.sqrt(d/maxVal);
			});
		this.DOM.legendCircleMarks.append("line").attr("class","legendLine")
			.each(function(d,i){
				var rx=me.cliqueRadius+3;
				var ry=me.cliqueRadius*Math.sqrt(d/maxVal);
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
		this.DOM.cliqueLegend_Text = this.DOM.legendCircleMarks
			.append("text").attr("class","legendLabel");

		this.DOM.cliqueLegend_Text.each(function(d,i){
			var rx=me.cliqueRadius+3;
			var ry=me.cliqueRadius*Math.sqrt(d/maxVal);
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

		this.DOM.cliqueLegend_Text.text(function(d){ return d3.format("s")(d); });
	},
	/** -- */
	refreshWindowSize: function(){
		var w=this.getWidth();
		var h=this.getHeight();
		this.DOM.wrapper.style("height",(
			this.setListSummary.getHeight()-this.setListSummary.getHeight_Header())+"px");
		this.DOM.cliqueChartBackground
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
		this.DOM.cliqueSVG
			.attr("viewBox",r+" "+t+" "+w+" "+h);
	},
	/** -- */
	refreshSVGViewBox: function(){
		var w=this.getWidth();
		var h=this.getHeight();
		var t=this.setListSummary.scrollTop_cache;
		var r=Math.min(-t-this.gridPan_x,0);  // r cannot be positive
		this.DOM.cliqueSVG
			.attr("width",w)
			.attr("height",h)
			.attr("viewBox",r+" "+t+" "+w+" "+h);

		this.refreshLabel_Vert_Show();
	},
	/** -- */
	refreshViz_All: function(){
		this.refreshViz_Active();
		this.refreshViz_Preview();
		this.refreshViz_Compare();
	},
	/** -- */
	refreshClique_Background: function(){
		this.DOM.cliqueBackground
			.attr("x",-this.cliqueRadius)
			.attr("y",-this.cliqueRadius)
			.attr("width",this.cliqueDiameter)
			.attr("height",this.cliqueDiameter);
	},
	/** -- */
	updateMaxAggr_Active: function(){
		this._maxCliqueAggr_Active = d3.max(this._cliques, function(d){ return d.aggregate_Active; });
	},
	/** -- */
	updateMaxAggr_Total: function(){
		this._maxCliqueAggr_Total = d3.max(this._cliques, function(d){ return d.aggregate_Total; });
	},
	/** Call when aggregate_Active is updated -> After filtering */
	updateCliqueSimilarity: function(){
		var me=this;
		this._cliques.forEach(function(clique){
			var size_A = clique.set_1.aggregate_Active;
			var size_B = clique.set_2.aggregate_Active;
			var size_and = clique.aggregate_Active;
			clique.Similarity = ((size_A===0&&size_B===0) || size_and===0) ? 0 :
				size_and/Math.min(size_A,size_B);
		});
		this._maxSimilarity = d3.max(this._cliques, function(d){ return d.Similarity; });
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
	/** For each element in the given list, checks the set membership and adds clique information */
	createCliques: function(elementList,mustSet){
		var me=this;
		var filterID = this.setListSummary.summaryFilter.id;

		var insertToClique = function(set_1,set_2,dataItem){
			// avoid self reference and adding the same data item twice, once for A-B, once for B-A
			// set_2.id() must be bigger than set1_.id()
			if(set_2.id()<=set_1.id()) return;
			// If only adding cliques for a specific set...
			if(mustSet){
				// one of the sets must be the given set
				if(mustSet.id()!==set_2.id() && mustSet.id()!==set_1.id()) return;
			}

			if(me._cliques_id[set_1.id()]===undefined){
				me._cliques_id[set_1.id()] = {};
			}
			var targetClique = me._cliques_id[set_1.id()][set_2.id()];

			if(targetClique===undefined){
				targetClique = new kshf.Item([me._cliques.length],0);
				targetClique.set_1 = set_1;
				targetClique.set_2 = set_2;
				set_1.cliqueList.push(targetClique);
				set_2.cliqueList.push(targetClique);

				me._cliques.push(targetClique);
				me._cliques_id[set_1.id()][set_2.id()] = targetClique;
			}
			targetClique.addItem(dataItem);
		};

		// AND
		elementList.forEach(function(dataItem){
			var setsOfItem = dataItem.mappedDataCache[filterID];
			if(setsOfItem===null || setsOfItem===undefined) return;
			setsOfItem.forEach(function(set_1){
				// make sure set_1 has an attrib on c display
				if(set_1.cliqueList===undefined) return;
				setsOfItem.forEach(function(set_2){
					if(set_2.cliqueList===undefined) return;
					insertToClique(set_1,set_2,dataItem);
				});
			});
		});

		this.updateMaxAggr_Total();
		this.updateMaxAggr_Active();
		this.updateCliqueSimilarity();
		this.updateSetAvgDegree();
	},
	/** -- */
	refreshRow_LineWidths: function(){
		var me=this;
		var cliqueDiameter=this.cliqueDiameter;
		var totalWidth=this.getWidth();
		var totalHeight = this.getHeight();
		// vertical
		this.DOM.line_vert.each(function(d){
			var i=d.orderIndex;
			var height=((me.setListSummary.catCount_Visible-i-1)*cliqueDiameter);
			var right=((i+0.5)*cliqueDiameter);
			this.setAttribute("x1",totalWidth-right);
			this.setAttribute("x2",totalWidth-right);
			this.setAttribute("y2",height);
		});
		// horizontal
		this.DOM.line_horz.attr("x2",totalWidth).attr("x1",function(d){
			return totalWidth-((d.orderIndex+0.5)*cliqueDiameter)
		});
		this.DOM.line_horz_label.attr("transform",function(d){
			return "translate("+(totalWidth-((d.orderIndex+0.5)*cliqueDiameter)-2)+" 0)";
		});
	},
	/** -- */
	refreshRow_CliqueCount: function(){
		this.DOM.cliqueRows
			.attr("cliqueCount",function(d){
				var i=0;
				d.cliqueList.forEach(function(clique){ i+=(clique.aggregate_Active>0); });
				return i;
			})
			.style("opacity",function(d){ return (d.aggregate_Active>0)?1:0.3; })
			;
	},
	/** -- */
	refreshRow_Position: function(){
		var rowHeight=this.cliqueDiameter;
		this.DOM.cliqueRows.attr("transform",function(set){ 
			return "translate(0,"+((set.orderIndex+0.5)*rowHeight)+")";
		});
	},
	/** -- */
	refreshClique_Position: function(){
		var me=this;
		var w=this.getWidth();
		this.DOM.cliques.each(function(clique){
			var i1 = clique.set_1.orderIndex;
			var i2 = clique.set_2.orderIndex;
			var left = w-(Math.min(i1,i2)+0.5)*me.cliqueDiameter;
			var top  = (Math.max(i1,i2)+0.5)*me.cliqueDiameter;
			kshf.Util.setTransform(this,"translate("+left+"px,"+top+"px)");
		});
	},
	/** -- */
	getCliqueSizeRatio: function(clique){
		return Math.sqrt(clique.aggregate_Active/this._maxCliqueAggr_Active);
	},
	// Given a clique, return the angle for preview
	getPreviewAngle_rad: function(clique){
		if(clique.aggregate_Active===0) return 0;
		var ratio=clique.aggregate_Preview/clique.aggregate_Active;
		if(this.browser.preview_not) ratio = 1-ratio;
		if(ratio===1) ratio=0.999;
		return ((360*ratio-90) * Math.PI) / 180;
	},
	/** -- */
	// http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
	// http://stackoverflow.com/questions/15591614/svg-radial-wipe-animation-using-css3-js
	// http://jsfiddle.net/Matt_Coughlin/j3Bhz/5/
	getPiePath: function(endAngleRad,sub,ratio){
		var r = ratio*this.cliqueRadius-sub;
		var endX = Math.cos(endAngleRad) * r;
		var endY = Math.sin(endAngleRad) * r;
		var largeArcFlag = (endAngleRad>Math.PI/2)?1:0;
		return "M 0,"+(-r)+" A "+r+","+r+" "+largeArcFlag+" "+largeArcFlag+" 1 "+endX+","+endY+" L0,0";
	},
	/** -- */
	refreshViz_Total: function(){
		// cliques do not have a total component
	},
	/** -- */
	refreshViz_Active: function(){
		var me=this;
		this.DOM.cliques.attr("activesize",function(clique){ return clique.aggregate_Active; });
		this.DOM.cliquesMarkActive.transition().duration(this.noanim?0:700)
			.attr("r",this.browser.ratioModeActive ?
				function(clique){
					if(clique.subset!=='') return me.cliqueRadius-1;
					return me.cliqueRadius;
				} :
				function(clique){
					return me.getCliqueSizeRatio(clique)*me.cliqueRadius;
				}
			);
	},
	/** -- */
	refreshViz_Preview: function(){
		var me=this;
		this.DOM.cliquesMarkPreview
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
	    	this.DOM.cliquesMarkCompare.each(function(d){
	    	    this.setAttribute("hidden",true);
	    	});
	    } else {
	    	this.DOM.cliquesMarkCompare
		    	.attr("d",function(clique){
		    		var ratio=(me.browser.ratioModeActive)?1:me.getCliqueSizeRatio(clique);
		    		this.setAttribute('hidden',clique.aggregate_Preview===0);
		    		return me.getPiePath(clique.currentPreviewAngle,1,ratio);
		    	});
	    }
	},
	/** -- */
	refreshClique_Containment: function(){
		var me=this;
		var numOfSubsets = 0;
		this.DOM.cliquesMarkActive
			.each(function(clique){
				var clique_itemCount = clique.aggregate_Active;
				var set_1_itemCount = clique.set_1.aggregate_Active;
				var set_2_itemCount = clique.set_2.aggregate_Active;
				if(clique_itemCount===set_1_itemCount || clique_itemCount===set_2_itemCount){
					numOfSubsets++;
					clique.subset = (set_1_itemCount===set_2_itemCount)?'equal':'proper';
				} else {
					clique.subset = '';
				}
			})
			.attr("subset",function(clique){
				return clique.subset!=='';
			});

		if(numOfSubsets===0){
			this.DOM.subsetCount.style("display","none");
		} else {
			this.DOM.subsetCount_Text.text(""+numOfSubsets+" Subsets ⊆ ");
		}

		this.refreshClique_Strength();
	},
	/** -- */
	refreshClique_Strength: function(){
		var me=this;
		
		this.DOM.chartRoot.attr("showStrength",this.browser.ratioModeActive);

		var strengthColor = d3.interpolateHsl(d3.rgb(230, 230, 247),d3.rgb(159, 159, 223));
		this.DOM.cliquesMarkActive.style("fill",function(clique){
			if(!me.browser.ratioModeActive) return null;
			return strengthColor(clique.Similarity/me._maxSimilarity);
		});

		if(this.browser.ratioModeActive){
			this.DOM.cliquesMarkActive.each(function(clique){
				// border
				if(clique.subset==='') return;
				if(clique.subset==='equal'){
					this.style.strokeDasharray = "";
					this.style.strokeDashoffset = "";
					return;
				}
				var halfCircle = (me.cliqueRadius-1)*Math.PI;
				this.style.strokeDasharray = halfCircle+"px";
				// rotate halfway 
				var i1 = clique.set_1.orderIndex;
				var i2 = clique.set_2.orderIndex;
				var c1 = clique.set_1.aggregate_Active;
				var c2 = clique.set_2.aggregate_Active;
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

