/* 
	*Author: Santhosh Nandhakumar
	*emailid: nsanthosh2409@gmail.com
*/

var PersonType=true,DateType=true,LocationType=true,OrganizationType=true,MoneyType=true,
PhoneType=true,MiscType=true,nonEntityType=true,description=true,nodeText=true; pathLabel=true;

$(".analyst-legend-block").click(function(e){
	  e.stopPropagation();
	  	if($(this).hasClass("clicked")){
	  		$(this).removeClass("clicked");
	  	}
	  	else{
	  		$(this).addClass("clicked");
	  	}
	  	newFilter();
	  	createForceDirectedGraph.conceptFilter();
	  	startForceTimeLine.forceTimeLineFilter();
	  	drawMap.mapFilter();
	  	
	  	d3.selectAll(".part")
	  		.style("display",function(d){
	  			var flag  = filter_by_entity(d.sourceType)&&filter_by_entity(d.targetType);
			    return flag?"inline":"none";
	  	});
});

function newFilter(){
	  if($(".description").hasClass("clicked")){
		  description = true
	  }
	  else{
		  description = false;
	  }
	  if($(".toogleLabel").hasClass("clicked")){
		  pathLabel = true
	  }
	  else{
		  pathLabel = false;
	  }
	  if($(".node-Name").hasClass("clicked")){
		  nodeText = true
	  }
	  else{
		  nodeText = false;
	  }
	  
	   if($(".personblock").hasClass("clicked")){
		   PersonType = true;
	   }
	   else{
		   PersonType = false;
	   }
	   
	   if($(".dateblock").hasClass("clicked")){
		   DateType=true;
	   }
	   else{
		   DateType=false;
	   }
	   if($(".locationblock").hasClass("clicked")){
		   LocationType = true;
	   }
	   else{
		   LocationType = false;
	   }
	   if($(".organizationblock").hasClass("clicked")){
		   OrganizationType = true;
	   }
	   else{
		   OrganizationType = false;
	   }
	   if($(".moneyblock").hasClass("clicked")){
		   MoneyType = true;
	   }
	   else{
		   MoneyType = false;
	   }
	   if($(".phoneblock").hasClass("clicked")){
		   PhoneType = true;
	   }
	   else{
		   PhoneType = false;
	   }
	   if($(".miscblock").hasClass("clicked")){
		   MiscType = true;
	   }
	   else{
		   MiscType = false;
	   }
	   if($(".nonEntityblock").hasClass("clicked")){
		   nonEntityType = true;
	   }
	   else{
		   nonEntityType = false;
	   }

	if(!($(".entityblock").hasClass("clicked"))){
		  PersonType = true;
		  DateType = true;
		  LocationType = true;
		  OrganizationType = true;
		  MoneyType = true;
		  PhoneType = true;
		  MiscType = true;
		  nonEntityType = true;
		  
	}
}

function filter_by_entity(entityType){
	  switch(entityType){
	   case "Person" : return PersonType;
	   case "Date" : return DateType;
	   case "Location" : return LocationType;
	   case "Organization" : return OrganizationType;
	   case "Money" : return MoneyType;
	   case "Phone" : return PhoneType;
	   case "Misc" : return MiscType;
	   case "nonEntity" : return nonEntityType;
	   default: return true;
	  }
  }


//Function to generate force directed graph
var graphNodes=[];
var graphLinks=[];
var hasLink;

function getLinkStroke(d,style){
	
	var styleValue;
	
	if(style == "linecolor")
		styleValue =  "gray";	
	if(style == "lineStyle")
		styleValue =  (1,0);
	
	for(var i=0; i< lineStyleData.length; i++){
		if(lineStyleData[i].combinationID2 == undefined){
			if(lineStyleData[i].noOfSingle == 0){
				if(d.combinationId == lineStyleData[i].combinationID1){
					styleValue = lineStyleData[i][style];
				}
			}
		}
	}
	
	for(var i=0; i< lineStyleData.length; i++){
		if(lineStyleData[i].combinationID2 == undefined){
			if(d.combinationId == lineStyleData[i].combinationID1){
				if(lineStyleData[i].noOfSingle == 1){
					if(lineStyleData[i].isOneSingle){
						if(d.source.id === lineStyleData[i].singleOne || d.target.id === lineStyleData[i].singleOne){
							styleValue = lineStyleData[i][style];
						}
					}
					else if(lineStyleData[i].isTwoSingle){
						if(d.source.id === lineStyleData[i].singleTwo || d.target.id === lineStyleData[i].singleTwo){
							styleValue = lineStyleData[i][style];
						}
					}
				}
			}
		}
	}
	for(var i=0; i< lineStyleData.length; i++){
		if(lineStyleData[i].combinationID2 == undefined){
			if(d.combinationId == lineStyleData[i].combinationID1){
				if(lineStyleData[i].noOfSingle == 2){
					if((d.source.id === lineStyleData[i].singleOne && d.target.id === lineStyleData[i].singleTwo)
							||(d.source.id === lineStyleData[i].singleTwo && d.target.id === lineStyleData[i].singleOne)){
						styleValue = lineStyleData[i][style];
					}
				}
			}
		}
	}	
	for(var i=0; i< lineStyleData.length; i++){
		if(lineStyleData[i].noOfSingle == 0 && lineStyleData[i].combinationID2 != undefined ){
			if(d.combinationId === lineStyleData[i].combinationID1){
    			if($.inArray(lineStyleData[i].combinationID2,d.source.combinationArray) !=-1
    					|| $.inArray(lineStyleData[i].combinationID2,d.target.combinationArray) != -1){
    				styleValue = lineStyleData[i][style];
    			}
    		}
    		if(d.combinationId === lineStyleData[i].combinationID2){
    			if($.inArray(lineStyleData[i].combinationID1,d.source.combinationArray) !=-1
    					|| $.inArray(lineStyleData[i].combinationID1,d.target.combinationArray) != -1){
    				styleValue = lineStyleData[i][style];
    			}
    		}
		}
		
		
	}
	for(var i=0; i< lineStyleData.length; i++){
		if(lineStyleData[i].noOfSingle == 1){
			if(lineStyleData[i].isOneSingle){
				if(d.source.id == lineStyleData[i].singleOne && d.combinationId === lineStyleData[i].combinationID1 ){
					if($.inArray(lineStyleData[i].combinationID2,d.target.combinationArray) != -1){
						styleValue =  lineStyleData[i][style];
        			}
				}
				else if(d.target.id == lineStyleData[i].singleOne && d.combinationId === lineStyleData[i].combinationID1 ){
					if($.inArray(lineStyleData[i].combinationID2,d.source.combinationArray) !=-1){
						styleValue =  lineStyleData[i][style];
        			}
				}
				else if(d.combinationId == lineStyleData[i].combinationID2 ){
					if($.inArray(lineStyleData[i].singleOne, d.source.targetArray) != -1 || $.inArray(lineStyleData[i].singleOne, d.target.targetArray) != -1){
						styleValue =  lineStyleData[i][style];
					} 
				}
			}
			if(lineStyleData[i].isTwoSingle){
				if(d.source.id == lineStyleData[i].singleTwo && d.combinationId === lineStyleData[i].combinationID1 ){
					if($.inArray(lineStyleData[i].combinationID2,d.source.combinationArray) != -1){
						styleValue =  lineStyleData[i][style];
        			}
				}
				else if(d.target.id == lineStyleData[i].singleTwo && d.combinationId === lineStyleData[i].combinationID1 ){
					if($.inArray(lineStyleData[i].combinationID2,d.target.combinationArray) != -1){
						styleValue =  lineStyleData[i][style];
        			}
				}
				else if(d.source.id == lineStyleData[i].singleTwo && d.combinationId === lineStyleData[i].combinationID2 ){
					if($.inArray(lineStyleData[i].combinationID1,d.source.combinationArray) != -1){
						styleValue =  lineStyleData[i][style];
        			}
				}
				else if(d.target.id == lineStyleData[i].singleTwo && d.combinationId === lineStyleData[i].combinationID2 ){
					if($.inArray(lineStyleData[i].combinationID1,d.target.combinationArray) != -1){
						styleValue =  lineStyleData[i][style];
        			}
				}
			}
			if(lineStyleData[i].isThreeSingle){
				if(d.source.id == lineStyleData[i].singleThree && d.combinationId === lineStyleData[i].combinationID2 ){
					if($.inArray(lineStyleData[i].combinationID1,d.target.combinationArray) != -1){
						styleValue =  lineStyleData[i][style];
        			}
				}
				else if(d.target.id == lineStyleData[i].singleThree && d.combinationId === lineStyleData[i].combinationID2 ){
					if($.inArray(lineStyleData[i].combinationID1,d.source.combinationArray) !=-1){
						styleValue =  lineStyleData[i][style];
        			}
				}
				else if(d.combinationId == lineStyleData[i].combinationID1 ){
					if($.inArray(lineStyleData[i].singleThree, d.source.targetArray) != -1 || $.inArray(lineStyleData[i].singleThree, d.target.targetArray) != -1){
						styleValue =  lineStyleData[i][style];
					} 
				}
			}
		}
	}
	for(var i=0; i< lineStyleData.length; i++){
		if(lineStyleData[i].noOfSingle == 2){
			if(lineStyleData[i].isOneSingle && lineStyleData[i].isTwoSingle ){
				if(d.source.id == lineStyleData[i].singleOne && d.target.id == lineStyleData[i].singleTwo){
					if($.inArray(lineStyleData[i].combinationID2,d.target.combinationArray) != -1){
						styleValue =  lineStyleData[i][style];
	    			}
				}
				else if(d.target.id == lineStyleData[i].singleOne && d.source.id == lineStyleData[i].singleTwo){
					if($.inArray(lineStyleData[i].combinationID2,d.source.combinationArray) != -1){
						styleValue =  lineStyleData[i][style];
	    			}
				}
				else if(d.combinationId === lineStyleData[i].combinationID2){
					if(d.source.id == lineStyleData[i].singleTwo && ($.inArray(lineStyleData[i].singleOne,d.source.targetArray) != -1)){
						styleValue =  lineStyleData[i][style];
					}
					else if(d.target.id == lineStyleData[i].singleTwo && ($.inArray(lineStyleData[i].singleOne,d.target.targetArray) != -1) ){
						styleValue =  lineStyleData[i][style];
					}
				}
			}
			if(lineStyleData[i].isTwoSingle && lineStyleData[i].isThreeSingle){
				if(d.source.id == lineStyleData[i].singleTwo && d.target.id == lineStyleData[i].singleThree){
					if($.inArray(lineStyleData[i].combinationID1,d.source.combinationArray) != -1){
						styleValue =  lineStyleData[i].linecolor;
	    			}
				}
				else if(d.target.id == lineStyleData[i].singleTwo && d.source.id == lineStyleData[i].singleThree){
					if($.inArray(lineStyleData[i].combinationID1,d.target.combinationArray) != -1){
						styleValue =  lineStyleData[i].linecolor;
	    			}
				}
				else if(d.combinationId === lineStyleData[i].combinationID1){
					if(d.source.id == lineStyleData[i].singleTwo && ($.inArray(lineStyleData[i].singleThree,d.source.targetArray) != -1)){
						styleValue =  lineStyleData[i].linecolor;
					}
					else if(d.target.id == lineStyleData[i].singleTwo && ($.inArray(lineStyleData[i].singleThree,d.target.f) != -1) ){
						styleValue =  lineStyleData[i].linecolor;
					}
				}
				
			}
			if(lineStyleData[i].isOneSingle && lineStyleData[i].isThreeSingle){	
				if(d.combinationId == lineStyleData[i].combinationID1 ){
					if(d.source.id == lineStyleData[i].singleOne && ($.inArray(lineStyleData[i].singleThree,d.target.targetArray) != -1) ){
						styleValue =  lineStyleData[i][style];
					}
					else if(d.target.id == lineStyleData[i].singleOne && ($.inArray(lineStyleData[i].singleThree,d.source.targetArray) != -1) ){
						styleValue =  lineStyleData[i][style];
					}
				}
				else if(d.combinationId == lineStyleData[i].combinationID2 ){
					if(d.source.id == lineStyleData[i].singleThree && ($.inArray(lineStyleData[i].singleOne,d.target.targetArray) != -1) ){
						styleValue =  lineStyleData[i][style];
					}
					else if(d.target.id == lineStyleData[i].singleThree && ($.inArray(lineStyleData[i].singleOne,d.source.targetArray) != -1) ){
						styleValue =  lineStyleData[i][style];
					}
				}
			}
		}
	}
	for(var i=0; i< lineStyleData.length; i++){
		if(lineStyleData[i].noOfSingle == 3){
			if(d.source.id == lineStyleData[i].singleOne && d.target.id == lineStyleData[i].singleTwo){
				if($.inArray(lineStyleData[i].singleThree,d.target.targetArray) != -1){
					styleValue =  lineStyleData[i][style];
			}
			}
				
			else if(d.target.id == lineStyleData[i].singleOne && d.source.id == lineStyleData[i].singleTwo){
				if($.inArray(lineStyleData[i].singleThree,d.source.targetArray) != -1){
					styleValue =  lineStyleData[i][style];
				}
			}
					
			
			if(d.source.id == lineStyleData[i].singleTwo && d.target.id == lineStyleData[i].singleThree
					&& ($.inArray(lineStyleData[i].singleOne,d.source.targetArray) != -1)){
				styleValue =  lineStyleData[i][style];
			}
			else if(d.target.id == lineStyleData[i].singleTwo && d.source.id == lineStyleData[i].singleThree
				&& ($.inArray(lineStyleData[i].singleOne,d.target.targetArray) != -1)){
				styleValue =  lineStyleData[i][style];
			}
		}
	}
	
	
	return styleValue;

}

/*var PersonType=true,DateType=true,LocationType=true,OrganizationType=true,MoneyType=true,
PhoneType=true,MiscType=true,nonEntityType=true,description=true,nodeText=true; pathLabel=true;

$(".analyst-legend-block").click(function(e){
	  e.stopPropagation();
	  	if($(this).hasClass("clicked")){
	  		$(this).removeClass("clicked");
	  	}
	  	else{
	  		$(this).addClass("clicked");
	  	}
	  	createForceDirectedGraph.newFilter();
	});*/

hasId = function(newId) {
    var i = null;
    for (i = 0; graphNodes.length > i; i += 1) {
        if (graphNodes[i].id === newId) {
        	var result = { "result" : true,
        			"index" : i
    		};
            return result;
            }
        }
	var result = { "result" : false,
					"index" : graphNodes.length
				};
    return result;
};

hasLink = function(sourceID, targetID) {
    for (var i = 0; graphLinks.length > i; i ++) {
        if ((graphLinks[i].source.id == sourceID && graphLinks[i].target.id == targetID) || (graphLinks[i].source.id == targetID && graphLinks[i].target.id == sourceID)) {
            return i;
        }
    }
    return -1;
};


function createForceDirectedGraph(){	
	
	var nodes = graphNodes;
	var links = graphLinks;
	
	var menu = [
				{
					title: 'Expand',
					action: function(elm, d, i) {
						visualizedKeywords.push(d.id);
						var index = deletedKeywords.indexOf(d.id);
						if(index != -1){
							deletedKeywords.splice(index,1);
						}
						getLinks(false);
					}
				},
				{
					title: 'Remove',
					action: function(elm, d, i) {
						var index = visualizedKeywords.indexOf(d.id);
						if(index != -1){
							visualizedKeywords.splice(index,1);
						}
						deletedKeywords.push(d.id);
						getLinks(false);
					}
				},
				{
					title: function(d){
						if(d.fixed){
							return "Release";
						}
						else{
							return "Fix"
						}
						
					},
					action: function(elm, d, i) {
						d3.select(elm).classed("fixed", d.fixed =  !d.fixed);
					}
				}
			]
	
	d3.select("#graph").remove();
	
	d3.select("#graphContainer").insert("div").attr("id","graph").attr("class","graph-place");	
	
	var w = $("#graphContainer").width();
	var h = $("#graphContainer").height();	
	  
	  
	  var newWidth  = $("#newgraphContainer").width();
	  var newHeight  = $("#newgraphContainer").height();

	var focus_node = null, highlight_node = null;

	var text_center = false;
	var outline = false;

	var min_score = 0;
	var max_score = 1;

	var nodeColor = d3.scale.ordinal()
	.domain(["Person","Date","Location","Organization","Money","Phone","Misc","nonEntity"])
	.range(["#FFCC00","#CCFF00","#99CCFF","#FFCCFF","#CCFFCC","yellow","#66FFFF","#C69633"]);
	
	var forceColorScale =  d3.scale.category20().domain([0,35]);

	var highlight_color = "red";
	var highlight_trans = 0.1;
  
	var size = d3.scale.pow().exponent(1)
		.domain([1,100])
		.range([8,24]);
	
	var force = d3.layout.force()
		.linkDistance(80)
		.charge(-400)
		.size([w,h]);
	
	
	var toolTipDiv = d3.select("#graph").append("div")	
    	.attr("class", "d3-tip")				
    	.style("opacity", 0);
	
	function onMouseOverLinkLinking(d){
		var sourceClassName = ((d.source.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	var targetClassName = ((d.target.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	
    	d3.selectAll(".map-marker._"+sourceClassName + "._"+targetClassName)
	    	.attr("r", 4)
			.style("stroke-width", 1)
			.transition()
			.attr("r", 7)
			.style("stroke-width", 2);
    	
    	d3.selectAll(".instant.mainBand.item _" + sourceClassName + "._"+targetClassName)
   		.attr("height",6)
   		.attr("width",6)
   		.transition()
   		.attr("height",10)
   		.attr("width",10);
	    
	    d3.selectAll(".interval.mainBand.item _" + sourceClassName + "._"+targetClassName)
   		.attr("height", "9")
	    .transition()
	    .attr("height", "13");
    	
    	d3.selectAll(".mainBand.instants._"+ sourceClassName + "._"+targetClassName)
   		.attr("r", 3)
   		.transition()
		.attr("r", 5);
    	
    	d3.selectAll(".forceInstance._"+ sourceClassName + "._"+targetClassName)
   		.attr("r", 3)
   		.transition()
		.attr("r", 5);
    	
    	d3.selectAll(".mainBand.interval._"+ sourceClassName + "._"+targetClassName)
        .attr("height", "9")
        .transition()
        .attr("height", "13");
	}
	
	function onMouseOutLinkLinking(d){
		var sourceClassName = ((d.source.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	var targetClassName = ((d.target.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	
    	d3.selectAll(".map-marker._"+sourceClassName + "._"+targetClassName)
	    	.attr("r", 7)
	    	.style("stroke-width", 2)
			.transition()
			.attr("r", 4)
			.style("stroke-width", 1);
    	
    	d3.selectAll(".instant.mainBand.item _" + sourceClassName + "._"+targetClassName)
   		.attr("height",10)
   		.attr("width",10)
   		.transition()
   		.attr("height",6)
   		.attr("width",6);
	    
	    d3.selectAll(".interval.mainBand.item _" + sourceClassName + "._"+targetClassName)
   		.attr("height", "13")
	    .transition()
	    .attr("height", "9");
    	
    	
    	d3.selectAll(".mainBand.instants._"+ sourceClassName + "._"+targetClassName)
   		.attr("r", 5)
   		.transition()
		.attr("r", 3);
    	
    	d3.selectAll(".forceInstance._"+ sourceClassName + "._"+targetClassName)
   		.attr("r", 5)
   		.transition()
		.attr("r", 3);
    	
    	d3.selectAll(".mainBand.interval._"+ sourceClassName + "._"+targetClassName)
        .attr("height", "13")
        .transition()
        .attr("height", "9");
	}
	
	function toggleLinkStroke(d,element){
		currentColor = d.currentStroke;
		
    	if(currentColor == "rgb(255, 0, 0)")
    		currentColor = "none";
    	else
    		currentColor = "red";
    	
    	d.currentStroke = currentColor;
    	
    	var sourceClassName = ((d.source.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	var targetClassName = ((d.target.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	
    	d3.selectAll(".forceNode._"+sourceClassName).style("stroke",function(d){

    		d.currentStroke = currentColor == "none" ? "gray" : currentColor;
			return currentColor;
		});
		d3.selectAll(".forceNode._"+targetClassName).style("stroke",function(d){
			d.currentStroke = currentColor == "none" ? "gray" : currentColor;
			return currentColor;
		});
    	
    	d3.selectAll(".mainBand._"+sourceClassName + "._"+targetClassName).style("stroke",currentColor);
    	d3.selectAll(".forceInstance._"+sourceClassName + "._"+targetClassName).style("stroke",currentColor);
    	
    	d3.selectAll(".map-marker._"+sourceClassName + "._"+targetClassName).style("stroke",function(){
			var stroke = currentColor == "none" ? "black" : currentColor;
			return stroke;
		});
    	
    	d3.select(".forceLink._" + sourceClassName + "._"+targetClassName).style("stroke",function(d){
    		var stroke = currentColor == "none" ? getLinkStroke(d,"linecolor") : currentColor;
    		d.currentStroke = stroke;
    		return stroke;
    	});
    	
    	$(window).trigger("mouseup");
	}
	 
	 function toggleStroke(d,element){
	    	currentColor = d.currentStroke;
	    	
	    	if(currentColor == "rgb(128, 128, 128)")
	    		currentColor = "red";
	    	else
	    		currentColor = "none";
	    	
	    	var className = ((d.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
	    	
	    	d.currentStroke = currentColor == "none" ? "gray" : currentColor;
		      
				d3.selectAll(".mainBand._"+className).style("stroke",currentColor);
				d3.selectAll(".forceInstance._"+className).style("stroke",currentColor);
		    
				d3.selectAll(".map-marker._"+className).style("stroke",function(){
					var stroke = currentColor == "none" ? "black" : currentColor;
					return stroke;
				});
				
				d3.select(element).style("stroke",currentColor == "none" ? "gray" : currentColor);
	    	
	    };
	    
	    function onMouseOverNodeLinking(d){
	    	var className = ((d.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
	    	
	    	d3.selectAll(".map-marker._"+className)
	    		.attr("r", 4)
				.style("stroke-width", 1)
				.transition()
				.attr("r", 7)
				.style("stroke-width", 2);
	    	
	    	d3.selectAll(".instant.mainBand.item _" + className)
	   		.attr("height",6)
	   		.attr("width",6)
	   		.transition()
	   		.attr("height",10)
	   		.attr("width",10);
		    
		    d3.selectAll(".interval.mainBand.item _" + className)
	   		.attr("height", "9")
		    .transition()
		    .attr("height", "13");
	    	
	    	d3.selectAll(".mainBand.instants._"+ className)
	   		.attr("r", 3)
	   		.transition()
			.attr("r", 5);
	    	
	    	d3.selectAll(".forceInstance._"+ className)
	   		.attr("r", 3)
	   		.transition()
			.attr("r", 5);
	    	
	    	d3.selectAll(".mainBand.interval._"+ className)
			//.attr("width", "75%")
	        .attr("height", "9")
	        .transition()
	        //.attr("width", "100%")
	        .attr("height", "13");
	    }
	    
	    function onMouseOutNodeLinking(d){
	    	var className = ((d.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
	    	d3.selectAll(".map-marker._"+className)
	    		.attr("r", 7)
		    	.style("stroke-width", 2)
				.transition()
				.attr("r", 4)
				.style("stroke-width", 1);	
	    	
	    	d3.selectAll(".instant.mainBand.item _" + className)
	   		.attr("height",10)
	   		.attr("width",10)
	   		.transition()
	   		.attr("height",6)
	   		.attr("width",6);
		    
		    d3.selectAll(".interval.mainBand.item _" + className)
	   		.attr("height", "13")
		    .transition()
		    .attr("height", "9");
	    	
	    	d3.selectAll(".mainBand.instants._"+ className)
	   		.attr("r", 5)
	   		.transition()
			.attr("r", 3);
	    	
	    	d3.selectAll(".forceInstance._"+ className)
	   		.attr("r", 5)
	   		.transition()
			.attr("r", 3);
	    	
	    	d3.selectAll(".mainBand.interval._"+ className)
	        .attr("height", "13")
	        .transition()
	        .attr("height", "9");
	    	
	    }
	
	var default_node_color = "#ccc";
	var default_link_color = "#888";
    var nominal_base_node_size = 8;
    var nominal_text_size = 14;
    var label_text_size = 12;
    var max_text_size = 24;
    var max_label_size = 22;
    var nominal_stroke = 1.5;
    var max_stroke = 16;
    var max_base_node_size = 36;
    var min_zoom = 0.1;
    var max_zoom = 7;
    var svg = d3.select("#graph").append("svg").style("height",h).style("width",w).style("z-index","500");
    var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom]);
    var g = svg.append("g");
    
    svg.style("cursor","move");
    
    svg.append("svg:defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
    .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

    var linkedByIndex = {};
    var linkedByID = {};
    
    links.forEach(function(d) {
    	linkedByIndex[d.source + "," + d.target] = true;
    });
    
    links.forEach(function(d) {
    	linkedByID[d.source.id + "," + d.target.id] = true;
    });
    
    for(var i = 0; i < nodes.length; i++){
    	nodes[i].degree = 0;
    	for(var j = 0; j < nodes.length; j++){
    		if(linkedByID[nodes[i].id + "," + nodes[j].id] || linkedByID[nodes[j].id + "," + nodes[i].id]){
    			nodes[i].degree = nodes[i].degree + 1;
    		}
    	}
    }
    
    d3.select("#degreeSlect").on("change", change);
    
    function change(){
    	var freq = $("#degreeSlect").val();
    	filterNodebyFreq(freq);
    }
    
	function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

	function hasConnections(a) {
		for (var property in linkedByIndex) {
				s = property.split(",");
				if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property]) 					
					return true;
		}
	return false;
	}
	
	$.each(links, function(key,value) {
		if(value.source.combinationArray == undefined){
			value.source.combinationArray = [value.combinationId];
		}
		else{
			value.source.combinationArray.push(value.combinationId);
		}
		if(value.source.targetArray == undefined){
			value.source.targetArray = [value.target.id];
		}
		else{
			value.source.targetArray.push(value.target.id);
		}
		if(value.target.combinationArray == undefined){
			value.target.combinationArray = [value.combinationId];
		}
		else{
			value.target.combinationArray.push(value.combinationId);
		}
		if(value.target.targetArray == undefined){
			value.target.targetArray = [value.source.id]	;	
		}
		else{
			value.target.targetArray.push(value.source.id);
		}
	});
	
	
  force
    .nodes(nodes)
    .links(links)
    .start();

  var link = g.selectAll(".link")
    .data(links)
    .enter()
    //.append("line")
    .append("path")
    .attr("class", function(d){
    	return "link forceLink _" + ((d.source.id).replace(/[^\w\s]/gi, '')).split(' ').join('_') + " _"+ ((d.target.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    })
//    .attr("id",function(d){
//        		return d.source.id.split(' ').join('_') + " " + d.target.id.split(' ').join('_');
//        	})
    .attr("id", function(d) { return d.source.index + "_" + d.target.index; })
	.style("stroke-width",function(d){
    	if(d.strokeSize == null){
    		return 2;
    	}
    	else{
    		return 2 + (d.strokeSize);
    	}
    })
    .style("stroke", function(d){
    	return getLinkStroke(d,"linecolor");
    })   
    .style("stroke-dasharray",function(d){
    	return getLinkStroke(d,"lineStyle");
     })
    .on('mouseover',function(d){
    	onMouseOverLinkLinking(d);
    	 if(!description && !pathLabel){

			toolTipDiv.transition()		
             .duration(200)		
             .style("opacity", .9);	
			
				toolTipDiv.html(function() {
         		var labelArray = d.label.split("/");
         		var htmllabels = "";
               	for(var i = 0; i < labelArray.length; i++ ){
               		htmllabels = htmllabels + "&bull; &nbsp;" + labelArray[i] + "<br>";
               	}
         	    return htmllabels;
         	  })	
             .style("left", function(){
             	var w = $(".d3-tip").width();
             	return "" + ((d3.event.pageX) - w + 1)  + "px";
             })		
             .style("top", function(){
             	var h = $(".d3-tip").height();
             	return ""+((d3.event.pageY) - h + 10) + "px";
             	})
			
    	 }
    })
    .on('mouseout', function(d) {	
    		onMouseOutLinkLinking(d)
					toolTipDiv.transition()		
		            .duration(500)		
		            .style("opacity", 0);	
    })
    .on("click", function(d){
    	var currentColor = d3.select(this).style("stroke");
		d.currentStroke = currentColor;
    	 toggleLinkStroke(d,this);
    })
   
  
  var node = g.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    	.attr("class",function(d){
    		d.currentStroke == "none";
    		return "_" + ((d.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	})
    .call(force.drag);
  
  node.style("stroke","gray");
  node.on('mouseover',function(d){
	 onMouseOverNodeLinking(d);
 	 if(!nodeText){
			toolTipDiv.transition()		
          .duration(200)		
          .style("opacity", .9);	
			
		toolTipDiv
			.html(function() {return d.id;})	
			.style("left", function(){
				var w = $(".d3-tip").width();
				return "" + ((d3.event.pageX) - w + 1)  + "px";
			})		
			.style("top", function(){
				var h = $(".d3-tip").height();
				return ""+((d3.event.pageY) - h + 10) + "px";
          	})
 	 }
 })
 .on('mouseout', function(d) {
	 onMouseOutNodeLinking(d);
					toolTipDiv.transition()		
		            .duration(500)		
		            .style("opacity", 0);	
 });
//.on("click",toggleNodeColor);
	
	/*node.on("dblclick.zoom", function(d) { 
		d3.event.stopPropagation();
		var dcx = (w/2-d.x*zoom.scale());
		var dcy = (h/2-d.y*zoom.scale());
		zoom.translate([dcx,dcy]);
		g.attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");
	});*/
  
	var tocolor = "fill";
	var towhite = "stroke";
	if (outline) {
		tocolor = "stroke"
		towhite = "fill"
	}
	
	var circle = node.append("circle")
    	.attr("class",function(d){
    		d.currentStroke == "gray";
    		return "forceNode _" + ((d.id).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	})
    	.attr("r", 11)
    	.style(tocolor, function(d) {
    		return nodeColor(d.entityType);
    		})
    	.style("stroke-width", nominal_stroke)
    	.style("stroke","black")
    	.style(towhite, function(d) { 
    		return "gray";
    		//return nodeColor(d.entityType)
		});
	
		node.append("image")
			.attr("xlink:href", function(d){				
				return "/img/entities/" + d.entityType + ".png";
			})
			.attr("x", -7)
			.attr("y", -7)
			.attr("width", 14)
			.attr("height", 14);   
				
	var text = g.selectAll(".text")
    	.data(nodes)
    	.enter().append("text")
    	.attr("dy", ".35em")
    	.style("font-size", nominal_text_size + "px");
	
	var flatLinkText = g.selectAll(".flatLinkText")
			.data(links)
			.enter()
			.append("text")
			.attr("startOffset", "50%")
			.attr("text-anchor", "middle")
			.attr("dy", ".35em")
			.style("font-size",label_text_size + "px")
			.style("font-family","calibri")
			.style("display", function(d) {
				return (!pathLabel)?"inline":"none";
			})
			.text(function(d) { 
    		if(!d.toolTip)
    			return d.label;
    		else
    			return "...";
    	})
    	.on('mouseover',function(d){
			if(d.toolTip){
				toolTipDiv.transition()		
                .duration(200)		
                .style("opacity", .9);	
			
				toolTipDiv.html(function() {
            		var labelArray = d.label.split("/");
            		var htmllabels = "";
                  	for(var i = 0; i < labelArray.length; i++ ){
                  		htmllabels = htmllabels + "&bull; &nbsp;" + labelArray[i] + "<br>";
                  	}
            	    return htmllabels;
            	  })	
                .style("left", function(){
                	var w = $(".d3-tip").width();
                	return "" + (d3.event.pageX) - (w/2) - 5 + "px";
                })		
                .style("top", function(){
                	var h = $(".d3-tip").height();
                	return ""+(d3.event.pageY) - (h + 5 + (d.strokeSize))  + "px";
                	})
			}
				
		})
                	
				.on('mouseout', function(d) {		
					toolTipDiv.transition()		
		            .duration(500)		
		            .style("opacity", 0);	
    });
	
	var label = g.selectAll(".path_label")
		.data(links)
		.enter()
		.append("text")
		.attr("class","path_label")
		.append("textPath")
		.attr("startOffset", "50%")
		.attr("text-anchor", "middle")
		.attr("xlink:href", function(d) { return "#" + d.source.index + "_" + d.target.index; })
		.attr("dy", ".35em")
    	.style("font-size",label_text_size + "px")
    	.style("font-family","calibri")
    	.text(function(d) { 
    		if(!d.toolTip)
    			return d.label;
    		else
    			return "...";
    	})
		//.style("text-anchor", "middle")
		.on('mouseover',function(d){
			if(d.toolTip){
				toolTipDiv.transition()		
                .duration(200)		
                .style("opacity", .9);	
			
				toolTipDiv.html(function() {
            		var labelArray = d.label.split("/");
            		var htmllabels = "";
                  	for(var i = 0; i < labelArray.length; i++ ){
                  		htmllabels = htmllabels + "&bull; &nbsp;" + labelArray[i] + "<br>";
                  	}
            	    return htmllabels;
            	  })	
                .style("left", function(){
                	var w = $(".d3-tip").width();
                	return "" + (d3.event.pageX) - (w/2) - 5 + "px";
                })		
                .style("top", function(){
                	var h = $(".d3-tip").height();
                	return ""+(d3.event.pageY) - (h + 5 + (d.strokeSize))  + "px";
                	})
			}
				
		})
                	
				.on('mouseout', function(d) {		
					toolTipDiv.transition()		
		            .duration(500)		
		            .style("opacity", 0);	
    });
	
	if (text_center)
		text.text(function(d) { return d.id; })
			.style("text-anchor", "middle");
	else 
		text.attr("dx", function(d) {return (size(d.size)||nominal_base_node_size);})
			.text(function(d) { return '\u2002'+d.id; });

	node.on("mousedown", function(d) { 
			d3.event.stopPropagation();  	
			focus_node = d;
			set_focus(d)
			var currentColor = d3.select(this).style("stroke");
			d.currentStroke = currentColor;
			
			if (highlight_node === null) set_highlight(d)
			//d3.select(this).classed("fixed", d.fixed = true);
	
		})
		.on("mouseup", function(d) {
			exit_highlight(d);
			toggleStroke(d,this);
		})
		.on('contextmenu', d3.contextMenu(menu));

		d3.select(window).on("mouseup",  
		function() {
			
		if (focus_node!==null)
		{
			focus_node = null;
			if (highlight_trans<1)
			{
				circle.style("opacity", 1);
				text.style("opacity", 1);
				link.style("opacity", 1);
			}
		}
		if (highlight_node === null){

			exit_highlight();
		
		}
		});

		function exit_highlight(d)
		{
			highlight_node = null;
			if (focus_node===null)
			{
				svg.style("cursor","move");
				if (highlight_color!="white")
				{
					
					circle.style("stroke", function(d){
						if(d.currentStroke == undefined || d.currentStroke == "gray"){
							return "gray";
						}
						else{
							return d.currentStroke;
						}
					});
					text.style("font-weight", "normal");
					link.style("stroke", function(d) {
						if(d.currentStroke == undefined || d.currentStroke == "none"){
							return getLinkStroke(d,"linecolor");
						}
						else{
							return d.currentStroke;
						}
						
				    
					});
				}
			
			}
		}

		function set_focus(d)
		{	
			if (highlight_trans<1)  {
				circle.style("opacity", function(o) {
					return isConnected(d, o) ? 1 : highlight_trans;
				});
				text.style("opacity", function(o) {
					return isConnected(d, o) ? 1 : highlight_trans;
				});
			
				link.style("opacity", function(o) {
					return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
				});		
			}
		}

		function set_highlight(d)
		{
			svg.style("cursor","pointer");
			if (focus_node!==null) d = focus_node;
				highlight_node = d;

			if (highlight_color!="white")
			{
				circle.style(towhite, function(o) {
					return isConnected(d, o) ? highlight_color : "gray";});
				text.style("font-weight", function(o) {
					return isConnected(d, o) ? "bold" : "normal";});
				link.style("stroke", function(o) {
					return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score>=0)?color(o.score):default_link_color);
				});
			}
		}
 	
		zoom.on("zoom", function() {
			
			var stroke = nominal_stroke;
			if (nominal_stroke*zoom.scale()>max_stroke) stroke = max_stroke/zoom.scale();
			link.style("stroke-width",function(d){
				if(d.strokeSize == null){
	    		return stroke;
				}
				else{
					return stroke + (d.strokeSize);
				}
			});
			circle.style("stroke-width",stroke);
	   
			var base_radius = nominal_base_node_size;
			if (nominal_base_node_size*zoom.scale()>max_base_node_size) base_radius = max_base_node_size/zoom.scale();
			circle.attr("d", d3.svg.symbol()
				.size(function(d) { return Math.PI*Math.pow(size(d.size)*base_radius/nominal_base_node_size||base_radius,2); })
				.type(function(d) { return d.type; }))
		
			if (!text_center) text.attr("dx", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); });
	
			var text_size = nominal_text_size;
			var label_size = label_text_size;
			if (nominal_text_size*zoom.scale()>max_text_size) text_size = max_text_size/zoom.scale();
			text.style("font-size",text_size + "px");
				
			if (label_text_size*zoom.scale()>max_label_size) label_size = max_label_size/zoom.scale();
			label.style("font-size",label_size + "px");
				
			g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
			
		});
	 
	svg.call(zoom);	  
	
	resize();
	conceptFilter();  
	force.on("tick", function() {
  	
		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
		/*link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });*/
		
		link.attr("d",function(d){
			return "M" + d.source.x + "," + d.source.y + " L" + d.target.x + "," + d.target.y;
		})
		
		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
		
		label.attr("transform",function(d){
			return "translate(" + (d.source.x + d.target.x)/2 + "," + (d.source.y + d.target.y)/2 + ")";
		});
		
		flatLinkText
			.attr("x", function(d) { return (d.source.x + (d.target.x - d.source.x) * 0.5); })
			.attr("y", function(d) { return (d.source.y + (d.target.y - d.source.y) * 0.5); });
	});
	
	
	function dblclick(d) {
		d3.select(this).classed("fixed", d.fixed = false);
	}

	function dragstart(d) {
		d3.select(this).classed("fixed", d.fixed = true);
	}
  
  function resize() {
	  var width = $("#graphContainer").width(), height = $("#graphContainer").height();
	  svg.attr("width", width).attr("height", height);
    
	  force.size([force.size()[0]+(width-w)/zoom.scale(),force.size()[1]+(height-h)/zoom.scale()]).resume();
	  w = width;
	  h = height;
  }
	

  function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
  }	
  function conceptFilter(){
	  /*if($(".description").hasClass("clicked")){
		  description = true
	  }
	  else{
		  description = false;
	  }
	  if($(".toogleLabel").hasClass("clicked")){
		  pathLabel = true
	  }
	  else{
		  pathLabel = false;
	  }
	  if($(".node-Name").hasClass("clicked")){
		  nodeText = true
	  }
	  else{
		  nodeText = false;
	  }
	  
	   if($(".personblock").hasClass("clicked")){
		   PersonType = true;
	   }
	   else{
		   PersonType = false;
	   }
	   
	   if($(".dateblock").hasClass("clicked")){
		   DateType=true;
	   }
	   else{
		   DateType=false;
	   }
	   if($(".locationblock").hasClass("clicked")){
		   LocationType = true;
	   }
	   else{
		   LocationType = false;
	   }
	   if($(".organizationblock").hasClass("clicked")){
		   OrganizationType = true;
	   }
	   else{
		   OrganizationType = false;
	   }
	   if($(".moneyblock").hasClass("clicked")){
		   MoneyType = true;
	   }
	   else{
		   MoneyType = false;
	   }
	   if($(".phoneblock").hasClass("clicked")){
		   PhoneType = true;
	   }
	   else{
		   PhoneType = false;
	   }
	   if($(".miscblock").hasClass("clicked")){
		   MiscType = true;
	   }
	   else{
		   MiscType = false;
	   }
	   if($(".nonEntityblock").hasClass("clicked")){
		   nonEntityType = true;
	   }
	   else{
		   nonEntityType = false;
	   }
 
 if(!($(".entityblock").hasClass("clicked"))){
	  PersonType = true;
	  DateType = true;
	  LocationType = true;
	  OrganizationType = true;
	  MoneyType = true;
	  PhoneType = true;
	  MiscType = true;
	  nonEntityType = true;
	  
  }*/
 
 
 link.style("display", function(d) {
	var flag  = filter_by_entity(d.source.entityType)&&filter_by_entity(d.target.entityType);
    return flag?"inline":"none";
  });
  node.style("display", function(d) {
	var flag  = filter_by_entity(d.entityType);
    return flag?"inline":"none";
  });
  
  text.style("display", function(d) {
	var flag  = filter_by_entity(d.entityType);
    return (flag && nodeText) ?"inline":"none";
  });
  
  label.style("display", function(d) {
	var flag  = filter_by_entity(d.source.entityType)&&filter_by_entity(d.target.entityType);
    return (flag && description && pathLabel)?"inline":"none";
  });
  
  flatLinkText.style("display", function(d) {
		var flag  = filter_by_entity(d.source.entityType)&&filter_by_entity(d.target.entityType);
	    return (flag && description && !pathLabel)?"inline":"none";
  });
  
  
 }
  createForceDirectedGraph.conceptFilter = conceptFilter;
  
  
  
  function filterNodebyFreq(freq){
	  var validNodes = [];		  
	  node.forEach(function(d){
		  if(d.degree >= freq){
			  validNodes.push(d);
		  }
	  });
	  
	  node.style("display", function(d) {
		  if(d.degree >= freq){
			  validNodes.push(d);
		  }
		 return "inline"; 
	  });
	  
	  node.style("display", function(d) {
		  if(validNodes.length == 0){
			  return "none";
		  }
		  else{
			  for(var i=0; i < validNodes.length; i++ ){
				  if(linkedByID[d.id + "," + validNodes[i].id] || linkedByID[validNodes[i].id + "," + d.id]
				  || ($.inArray(d,validNodes) != -1)){
					  return "inline"
				  }
				  else{
					  return "none";
				  }
			  } 
		  }
	  });
  }
}