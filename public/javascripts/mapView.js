/* 
	*Author: Santhosh Nandhakumar
	*emailid: nsanthosh2409@gmail.com
*/

function drawMap(data, nodeLocationJson){
	
	function getMapStroke(d, style){
		for(var i=0; i< lineStyleData.length; i++){
			if(lineStyleData[i].combinationID2 == undefined){
				if(lineStyleData[i].noOfSingle == 0){
					if(lineStyleData[i].combinationID1 == 2){
						return lineStyleData[i][style];
					}
				}
			}
		}
		for(var i=0; i< lineStyleData.length; i++){
			if(lineStyleData[i].combinationID2 == undefined){
				if(lineStyleData[i].combinationID1 == 2){
					if(lineStyleData[i].noOfSingle == 1){
						if(lineStyleData[i].isOneSingle){
							if(lineStyleData[i].entityOne == "Person"){
								if(lineStyleData[i].singleOne == d.node){
									return lineStyleData[i][style];
								}
							}
						}
						else if(lineStyleData[i].isTwoSingle){
							if(lineStyleData[i].entityTwo == "Person"){
								if(lineStyleData[i].singleTwo == d.node){
									return lineStyleData[i][style];
								}
							}
						}
					}
				}
			}
		}
		if(style == "linecolor")
			return "gray";	
		if(style == "lineStyle")
			return (1,0);
	}
	
	function drawCurve(node,lanlogArray){
		var returnValue;
		var dx = (map.latLngToLayerPoint(lanlogArray[0]).x - map.latLngToLayerPoint(lanlogArray[1]).x),
			dy = (map.latLngToLayerPoint(lanlogArray[0]).y - map.latLngToLayerPoint(lanlogArray[1]).y),
			dr = Math.sqrt(dx * dx + dy * dy);
		
		returnValue = "M" + map.latLngToLayerPoint(lanlogArray[0]).x + "," + map.latLngToLayerPoint(lanlogArray[0]).y + 
						"A" + dr + "," + dr + " 0 0,1 " + 
						map.latLngToLayerPoint(lanlogArray[1]).x + "," + map.latLngToLayerPoint(lanlogArray[1]).y;
		
		for(var i=2; i<lanlogArray.length; i++){
			var dx = (map.latLngToLayerPoint(lanlogArray[i-1]).x - map.latLngToLayerPoint(lanlogArray[i]).x),
				dy = (map.latLngToLayerPoint(lanlogArray[i-1]).y - map.latLngToLayerPoint(lanlogArray[i]).y),
				dr = Math.sqrt(dx * dx + dy * dy);
			
			var originCoordinates = "M" + map.latLngToLayerPoint(lanlogArray[i-1]).x + "," + map.latLngToLayerPoint(lanlogArray[i-1]).y;
			var newPath = "A" + dr + "," + dr + " 0 0,1 " +
			map.latLngToLayerPoint(lanlogArray[i]).x + "," + map.latLngToLayerPoint(lanlogArray[i]).y;
			returnValue = returnValue + newPath;
		}
		return returnValue;
	}
	
	function onMouseOverLinking(d){
		var className = ((d.target).replace(/[^\w\s]/gi, '')).split(' ').join('_');
   	 	var locationClassName  = ((d.locationName).replace(/[^\w\s]/gi, '')).split(' ').join('_');
   	 	
   	 	d3.select(".forceLink._" + className + "._"+locationClassName)
			.style("stroke-width",function(d){
				if(d.strokeSize == null){
					return 2;
				}
				else{
					return 2 + (d.strokeSize);
				}
				
			})
			.transition()
			.style("stroke-width",function(d){
				if(d.strokeSize == null){
					return 4;
				}
				else{
					return (2 + (d.strokeSize)) * 1.5 ;
				}
				
			});
   	 
	   	d3.selectAll(".forceNode._"+className)
			.attr("r", 11)
	    	.style("stroke-width",1.5)
			.transition()
			.attr("r", 16)
			.style("stroke-width",3);
	
	   	d3.selectAll(".forceNode._"+locationClassName)
			.attr("r", 11)
	    	.style("stroke-width",1.5)
			.transition()
			.attr("r", 16)
			.style("stroke-width",3);
	   	
	   	d3.selectAll(".instant.mainBand.item _" + className + "._"+locationClassName)
	   		.attr("height",6)
	   		.attr("width",6)
	   		.transition()
	   		.attr("height",10)
	   		.attr("width",10);
	   		
	   	d3.selectAll(".interval.mainBand.item _" + className + "._"+locationClassName)
	   		.attr("height", "9")	   		
		    .transition()
		    .attr("height", "13");	
	   	
	   	d3.selectAll(".mainBand.instants._"+ className + "._"+locationClassName)
	   		.attr("r", 3)
	   		//.style("stroke-width",0.5)
	   		//.style("stoke","none")
	   		.transition()
			.attr("r", 5)
			//.style("stroke-width",1);
	   		//.style("stoke","black");
	
		d3.selectAll(".mainBand.interval._"+ className + "._"+locationClassName)
		    .attr("height", "9")
		    //.style("stroke-width",0.5)
	   		//.style("stoke","none")
		    .transition()
		    .attr("height", "13")
		    //.style("stroke-width",1);
	   		//.style("stoke","black");
		
		d3.selectAll(".forceInstance._"+ className + "._"+locationClassName)
			.attr("r", 3)
			//.style("stroke-width",0.5)
			//.style("stoke","none")
			.transition()
			.attr("r", 5)
			//.style("stroke-width",1);
			//.style("stoke","black");

	}
	
	function onMouseOutLinking(d){	
		var className = ((d.target).replace(/[^\w\s]/gi, '')).split(' ').join('_');
   	 	var locationClassName  = ((d.locationName).replace(/[^\w\s]/gi, '')).split(' ').join('_');
   	 	
   	 	d3.select(".forceLink._" + className + "._"+locationClassName)
			.style("stroke-width",function(d){
			if(d.strokeSize == null){
				return 4;
			}
			else{
				return (2 + (d.strokeSize)) * 1.5 ;
			}
 		
 		})
 		.transition()
 		.style("stroke-width",function(d){
 			if(d.strokeSize == null){
 				return 2;
 			}
			else{
				return 2 + (d.strokeSize);
			}
 		
 		});
	    
	    d3.selectAll(".forceNode._"+className)
			.attr("r", 16)
			.style("stroke-width",3)
			.transition()
			.attr("r", 11)
			.style("stroke-width",1.5);
 
	    d3.selectAll(".forceNode._"+locationClassName)
			.attr("r", 16)
	    	.style("stroke-width",3)
			.transition()
			.attr("r", 11)
			.style("stroke-width",1.5);
	    
	    d3.selectAll(".instant.mainBand.item _" + className + "._"+locationClassName)
	   		.attr("height",10)
	   		.attr("width",10)
	   		.transition()
	   		.attr("height",6)
	   		.attr("width",6);
	    
	    d3.selectAll(".interval.mainBand.item _" + className + "._"+locationClassName)
	   		.attr("height", "13")
		    .transition()
		    .attr("height", "9");
	    
		d3.selectAll(".mainBand.instants._"+ className + "._"+locationClassName)
			.attr("r", 5)
			//.style("stroke-width",1)
	   		//.style("stoke","white","black")
	   		.transition()
			.attr("r", 3)
			//.style("stroke-width",0.5);
	   		//.style("stoke","none");
		
		d3.selectAll(".mainBand.interval._"+ className + "._"+locationClassName)
	        .attr("height", "13")
	       // .style("stroke-width",1)
	   		//.style("stoke","white","black")
	        .transition()
	        .attr("height", "9")
	        //.style("stroke-width",0.5);
	   		//.style("stoke","none");
		
		d3.selectAll(".forceInstance._"+ className + "._"+locationClassName)
			.attr("r", 5)
			//.style("stroke-width",1)
	   		//.style("stoke","white","black")
	   		.transition()
			.attr("r", 3)
			//.style("stroke-width",0.5);
	   		//.style("stoke","none");	
	}
	
	function toggleStroke(d,color,element){
		
    	currentColor = color;
    	
    	if(currentColor == "rgb(0, 0, 0)")
    		currentColor = "red";
    	else
    		currentColor = "none";
    	
    	var className = ((d.target).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	var locationClassName  = ((d.locationName).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	 
		d3.selectAll(".forceNode._"+className).style("stroke",function(d){
			d.currentStroke = currentColor == "none" ? "gray" : currentColor;
			return d.currentStroke;
		});

		d3.selectAll(".forceNode._"+locationClassName).style("stroke",function(d){
			d.currentStroke = currentColor == "none" ? "gray" : currentColor;
			return d.currentStroke;
		});
		
		d3.select(".forceLink._" + className + "._"+locationClassName).style("stroke",function(d){
			var stroke = currentColor == "none" ? getLinkStroke(d,"linecolor") : currentColor;
			d.currentStroke = stroke;
			return stroke;
			});
		
		d3.selectAll(".mainBand._"+className).style("stroke",function(d){
			return currentColor;
		});

		d3.selectAll(".mainBand._"+locationClassName).style("stroke",function(d){
			return currentColor;
		});
		
		d3.selectAll(".forceInstance._"+className).style("stroke",function(d){
			return currentColor;
		});
		
		d3.selectAll(".forceInstance._"+locationClassName).style("stroke",function(d){
			return currentColor;
		});
		
		d3.selectAll(".map-marker._"+className + " ._"+locationClassName).style("stroke",function(){
			var stroke = currentColor == "none" ? "black" : currentColor;
			return stroke;
		});
		
		d3.select(element).style("stroke",function(){
			var stroke = currentColor == "none" ? "black" : currentColor;
			return stroke;
		});
		
		$(window).trigger("mouseup");
    	
    };
	 	
	function sortByDateAscending(a, b) {
		return a.date - b.date;
	}
	
	var uniqueLocationArray = [];	
	var latLogArray = [];
	var outerArray = [];
	var textPathArray = [];
	
	var color = d3.scale.category20c();
	var map;	
	var strokeColor = null;
	var strokeArray = null;	
	
	var nodeColor = d3.scale.ordinal()
	.domain(["Person","Date","Location","Organization","Money","Phone","Misc","nonEntity"])
	.range(["#FFCC00","#CCFF00","#99CCFF","#FFCCFF","#CCFFCC","yellow","#66FFFF","#C69633"]);
	
	d3.select("#mapPlace").remove();
	d3.select("#mapContainer").insert("div").attr("id","mapPlace").attr("class","map-place");
	
	var mapToolTipDiv = d3.select("#mapContainer").append("div")	
	.attr("class", "d3-tip")				
	.style("opacity", 0);
	
	var w = $("#mapContainer").width();
	var h = $("#mapContainer").height();
	
	if(map){
		map.remove();
	}
	
	map = L.map('mapPlace').setView([0,0], 2);
    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
    		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    			attribution: '&copy; ' + mapLink + ' Contributors',
    			maxZoom: 18,
    }).addTo(map);
				
	map._initPathRoot()    

	$.each(data, function(key,value) {
		value.LatLng = new L.LatLng(Number(value.lat), Number(value.lon));
	});
	
	$.each(nodeLocationJson,function(k,v){
		   v.coordinates = v.coordinates.sort(sortByDateAscending);
		   latLogArray = [];
		   for(var i=0; i < v.coordinates.length; i++){
			   	var latLog = new L.LatLng(Number(v.coordinates[i].latitude),
				Number(v.coordinates[i].longitude));
			   	latLogArray.push(latLog);
		   }
		   outerArray.push({ "source": {"id": v.node}, "target":{"id" : v.location}, "node":v.node,"combinationId" : v.combinationId, "targetType":v.targetType, "latlon" : latLogArray});
	 });
	
	$.each(outerArray,function(k,v){
		for(var i=1; i<v.latlon.length; i++){
			var textPathJson = {"index":i , id: "v.node", "node":v.node, "combinationId" : v.combinationId, "targetType":v.targetType,"source":v.source,"target":v.target, "sourceLocation":v.latlon[i-1],"targetLocation":v.latlon[i]};
			textPathArray.push(textPathJson);
		}
	});
	 
	color.domain([0,outerArray.length]);
	
	d3.select("#arrowCheck").on("change", change);
	function change(){
		arrow = !arrow;
		update();
	}
	 
	var svg = d3.select("#mapPlace").select("svg");

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			if(d.targetType != "Location"){
				return "" + d.target +"";
			}
			else{
				return "" + d.locationName +"";
			}
		});
	
	svg.call(tip);
	
	g = svg.append("g"); 
	
	var feature = g.selectAll("circle")
			.data(data)
			.enter().append("circle")
			.attr("class",function(d){
				return "map-marker _" + ((d.target).replace(/[^\w\s]/gi, '')).split(' ').join('_') + " _" + 
				((d.locationName).replace(/[^\w\s]/gi, '')).split(' ').join('_');
			})
			.style("stroke", "black")  
			.style("stroke-width", 1)
			.style("opacity", .8) 
			.style("fill", function(d){
					return nodeColor(d.targetType);
			})
			.attr("r", 4)
			.on('mouseover', function(d){
				onMouseOverLinking(d);
				tip.show(d);
			})
			.on('mouseout', function(d){
				onMouseOutLinking(d);
				tip.hide(d);
			})
			.on("click",function(d){
        		toggleStroke(d,d3.select(this).style("stroke"),this);
        	});
		
	var line = g.selectAll(".curvedLine")
    	.data(outerArray)
    	.enter()
    	.append('path')
    	.attr("class","curvedLine")
    	.attr("stroke", function(d,i){
    		//return getMapStroke(d,"linecolor");
    		return getLinkStroke(d,"linecolor");
    	})
    	.style("stroke-dasharray",function(d){
    		//return getMapStroke(d,"lineStyle");
    		return getLinkStroke(d,"lineStyle");
    	})
    	/*.attr("display",function(d){
    		if(getLinkStroke(d,"linecolor") == "gray"){
    			return "none";
    		}
    		else{
    			return "inline";
    		}
    	})*/
	    .attr("stroke-width", 2)
	    .attr("fill", "none")
	    .on("mouseover",function(d){
	    	mapToolTipDiv.transition()		
	        .duration(200)		
	        .style("opacity", .9);	
		
	    	mapToolTipDiv.html(function() {
	    	    return d.node;
	    	  })
	        .style("left", function(){
	        	var w = $(".d3-tip").width();
	        	return "" + (d3.event.pageX) - (w/2) + "px";
	        })		
	        .style("top", function(){
	        	var h = $(".d3-tip").height();
	        	return ""+(d3.event.pageY) - (h + 10) + "px";
	        	});
		
	    })
	    .on("mouseout",function(d){
	    	mapToolTipDiv.transition()		
	        .duration(500)		
	        .style("opacity", 0);	
	    });
	
	
   var textpathDefs = g.selectAll(".curvedText")
    	.data(textPathArray)
    	.enter()
    	.append("defs")
    	.append('path')
    	.attr("class","curvedText")
    	.attr("fill","transparent")
    	.attr("id", function(d) { 
    		return d.index + "_" + d.node.split(" ").join("_"); 
    	});
   
   	/*textpathDefs.attr("d",function(d){			
		var returnValue;
		var dx = (map.latLngToLayerPoint(d.sourceLocation).x - map.latLngToLayerPoint(d.targetLocation).x),
			dy = (map.latLngToLayerPoint(d.sourceLocation).y - map.latLngToLayerPoint(d.targetLocation).y),
			dr = Math.sqrt(dx * dx + dy * dy);
		
		returnValue = "M" + map.latLngToLayerPoint(d.sourceLocation).x + "," + map.latLngToLayerPoint(d.sourceLocation).y + 
						"A" + dr + "," + dr + " 0 0,1 " + 
						map.latLngToLayerPoint(d.targetLocation).x + "," + map.latLngToLayerPoint(d.targetLocation).y;
		return returnValue;
	});
	
   	textpathDefs.each(function(d){
		d.pathLength = this.getTotalLength();
	});*/
    
    var curvedText = svg.selectAll(".textCurved")
    .data(textPathArray)
    .enter()
    .append("text")
    .attr("class",function(d) { return "textCurved"; } )
    .attr("id", function(d) { return d.index + "_" + d.node + "_text"; })
    
    
    var textPath = curvedText.append("textPath")
    .attr("startOffset", "50%")
    .attr("text-anchor", "middle")
    .attr("xlink:href", function(d) { return "#" + d.index + "_" + d.node.split(" ").join("_"); })
    .style("fill", "#000")
    .style("font-family", "Arial")
    .text(function(d){    	
    	return d.node;
    })
    .style("font-size", function(d){
			var zoomLevel = map.getZoom();
			if(zoomLevel < 1){
				return 5;
			}
			else{
				return zoomLevel * 5;
			}
	});
    
    update();	
	mapFilter();
	
	map.on("viewreset", update);	
	
	function update() {
		
		feature.attr("transform", 
		function(d,i) { 
				return "translate("+ 
				(map.latLngToLayerPoint(d.LatLng).x )  +","+ 
				(map.latLngToLayerPoint(d.LatLng).y  ) + ")";
		});

		line
		.attr("marker-end",function(d,i){
			svg.append("defs").append("marker")
		    .attr("id", "arrowhead"+i)
		    .attr("refX", 5) 
		    .attr("refY", 2)
		    .attr("markerWidth", 6)
		    .attr("markerHeight", 4)
		    .attr("orient", "auto")
		    .style("fill",function(){
		    	//return getMapStroke(d,"linecolor");
		    	return getLinkStroke(d,"linecolor");
		    })
		    .append("path")
		    .attr("d", "M 0,0 V 4 L6,2 Z");
    		if(arrow){
        		return "url(#arrowhead"+i+")";
    		}
    	})
	    .attr("d", function(d){
	    	if(d.latlon.length > 1){
	    		return drawCurve(d.node,d.latlon);
	    	}
	    	
	    });
		
		textpathDefs.attr("d",function(d){			
			var returnValue;
			var dx = (map.latLngToLayerPoint(d.sourceLocation).x - map.latLngToLayerPoint(d.targetLocation).x),
				dy = (map.latLngToLayerPoint(d.sourceLocation).y - map.latLngToLayerPoint(d.targetLocation).y),
				dr = Math.sqrt(dx * dx + dy * dy);
			
			returnValue = "M" + map.latLngToLayerPoint(d.sourceLocation).x + "," + map.latLngToLayerPoint(d.sourceLocation).y + 
							"A" + dr + "," + dr + " 0 0,1 " + 
							map.latLngToLayerPoint(d.targetLocation).x + "," + map.latLngToLayerPoint(d.targetLocation).y;
			return returnValue;
		});
		
		textpathDefs.each(function(d){
			d.pathLength = this.getTotalLength();
		});
		
		textPath.style("font-size", function(d){
			var zoomLevel = map.getZoom();
			if(zoomLevel < 1){
				return 5;
			}
			else{
				return zoomLevel * 5;
			}
		})

		textPath.style("display", function(d) {
			var zoomLevel = map.getZoom();
			var length = d.node.length;
			var textLength;
			if(zoomLevel != 0)
				textLength = (length) * 3 * zoomLevel;
			else{
				textLength = (length) * 3;
			}
			
			var flag;
			flag = (getLinkStroke(d,"linecolor") == "gray");
			flag = (filter_by_entity("Location")&&filter_by_entity(d.targetType)&&!flag&&(Number(d.pathLength) > textLength));
			return flag?"inline":"none";
		});

		uniqueLocationArray = [];		
	}
	
	function mapFilter(){
		feature.style("display", function(d) {
			var flag  = filter_by_entity("Location")&&filter_by_entity(d.targetType);
			return flag?"inline":"none";
		});
		 
		line.style("display", function(d) {
			var flag;
			flag = (getLinkStroke(d,"linecolor") == "gray");
			flag = filter_by_entity("Location")&&filter_by_entity(d.targetType)&&!flag;
			return flag?"inline":"none";
		});

		textPath.style("display", function(d) {
			var zoomLevel = map.getZoom();
			var length = d.node.length;
			var textLength;
			if(zoomLevel != 0)
				textLength = (length) * 3 * zoomLevel;
			else{
				textLength = (length) * 3;
			}
			
			var flag;
			flag = (getLinkStroke(d,"linecolor") == "gray");
			flag = (filter_by_entity("Location")&&filter_by_entity(d.targetType)&&!flag&&(Number(d.pathLength) > textLength));
			return flag?"inline":"none";
		});
	} 

	drawMap.mapFilter = mapFilter;	  	
}
