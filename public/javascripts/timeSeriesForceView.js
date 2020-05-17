/* 
	*Author: Santhosh Nandhakumar
	*emailid: nsanthosh2409@gmail.com
*/

var minDate;
var maxDate;

function parseDate(dateString) {

	var format = d3.time.format("%Y-%m-%d"),
		date,
		year;
	date = format.parse(dateString);
	if (date !== null) return date;

	// BC yearStrings are not numbers!
	if (isNaN(dateString)) { // Handle BC year
		// Remove non-digits, convert to negative number
		year = -(dateString.replace(/[^0-9]/g, ""));
	} else { // Handle AD year
		// Convert to positive number
		year = +dateString;
	}
	if (year < 0 || year > 99) { // 'Normal' dates
		date = new Date(year, 6, 1);
	} else if (year == 0) { // Year 0 is '1 BC'
		date = new Date (-1, 6, 1);
	} else { // Create arbitrary year and then set the correct year
		// For full years, I chose to set the date to mid year (1st of July).
		date = new Date(year, 6, 1);
		date.setUTCFullYear(("0000" + year).slice(-4));
	}

	
	// Finally create the date
	return date;
}

function startForceTimeLine(data){
	
	d3.select("#forcetimeline").remove();
	
	d3.select("#forceTimeSeries").insert("div").attr("id","forcetimeline").attr("class","analyst-force-timeline-place scrollable");
	
	function toggleStroke(d,color,element){
	    currentColor = color;
	
		if(currentColor == "none")
			currentColor = "red";
		else
			currentColor = "none";
	
		var sourceClassName = (((d.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_'));
		var targetClassName = (((d.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_'));
		
		d3.select(".forceLink._" + sourceClassName + "._"+targetClassName).style("stroke",function(d){
			var stroke = currentColor == "none" ? getLinkStroke(d,"linecolor") : currentColor;
			d.currentStroke = stroke;
			return stroke;
		});

		d3.selectAll(".forceNode._"+sourceClassName).style("stroke",function(d){
			d.currentStroke = currentColor == "none" ? "gray" : currentColor;
			return d.currentStroke;
		});

		d3.selectAll(".forceNode._"+targetClassName).style("stroke",function(d){
			d.currentStroke = currentColor == "none" ? "gray" : currentColor;
			return d.currentStroke;
		});
	
		d3.selectAll(".map-marker._"+sourceClassName+"._"+targetClassName).style("stroke",function(){
			var stroke = currentColor == "none" ? "black" : currentColor;
			return stroke;
		});
		
		d3.select(element).style("stroke",currentColor);
		
		d3.selectAll(".mainBand._"+ sourceClassName+"._" + targetClassName).style("stroke",currentColor);
		
		$(window).trigger("mouseup");
	};
	    
	function onMouseOverLinking(d){
		
		var sourceClassName = (((d.data.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_'));
		var targetClassName = (((d.data.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_'));
		
		d3.select(".forceLink._" + sourceClassName + "._"+targetClassName)
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
			
		d3.selectAll(".forceNode._"+sourceClassName)
			.attr("r", 11)
			.style("stroke-width",1.5)
			.transition()
			.attr("r", 16)
			.style("stroke-width",3);
		
		d3.selectAll(".forceNode._"+targetClassName)
			.attr("r", 11)
			.style("stroke-width",1.5)
			.transition()
			.attr("r", 16)
			.style("stroke-width",3);
		
		d3.select(".map-marker._"+sourceClassName+"._"+targetClassName)
			.attr("r", 4)
			.style("stroke-width", 1)
			.transition()
			.attr("r", 7)
			.style("stroke-width", 2);

	}
	    
	function onMouseOutLinking(d){
		var sourceClassName = (((d.data.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_'));
		var targetClassName = (((d.data.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_'));
		
		d3.select(".forceLink._" + sourceClassName + "._"+targetClassName)
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
		
		d3.selectAll(".forceNode._"+sourceClassName)
		.attr("r", 16)
		.style("stroke-width",3)
		.transition()
		.attr("r", 11)
		.style("stroke-width",1.5);
	
		d3.selectAll(".forceNode._"+targetClassName)
		.attr("r", 16)
		.style("stroke-width",3)
		.transition()
		.attr("r", 11)
		.style("stroke-width",1.5);
		
		d3.select(".map-marker._"+sourceClassName+"._"+targetClassName)
			.attr("r", 7)
			.style("stroke-width", 2)
			.transition()
			.attr("r", 4)
			.style("stroke-width", 1);
	}
	
	var customTimeFormat = d3.time.format.multi([
                                                 [" %y %b %d %I %p", function(d) { return d.getHours(); }],
                                                 ["%y %b %d", function(d) { return d.getDate() != 1; }],
                                                 [" %y %b", function(d) { return d.getMonth(); }],
                                                 ["%Y", function() { return true; }],
	                                           ]);
	
	var margin = {top: 40, right: 5, bottom: 0, left: 10};
	
	var eleWidth = $("#forcetimeline").width();
	var eleHeight = $("#forcetimeline").height();
	
	var width = eleWidth - margin.left - margin.right;
	var height = eleHeight - margin.top - margin.bottom;	
	
	var tip = d3.tip()
	  	.attr('class', 'd3-tip')
	  	.offset([-10, 0])
	  	.html(function(d) {
		  	if (!(d.instant)) {
	        	return d.data.sourceNode + " - " + d.data.targetNode + "<br>" + d.data.label + "<br>" + customTimeFormat(d.data.start) /*toYear(d.start)*/ + " to " + customTimeFormat(d.data.end);
	    	} else {
	        	return d.data.sourceNode + " - " + d.data.targetNode + "<br>" +d.data.label + "<br>" + customTimeFormat(d.data.start);
	    	}
	  	});
	
	var svg = d3.select("#forcetimeline")
				.append("svg")
				.attr("width", width)
				.attr("height", height + margin.top )
				.call(tip);
	
	/*var minDate =d3.time.month.offset( d3.min(data, function (d) { return d.start; }), -12);
    var maxDate = d3.time.month.offset( d3.max(data, function (d) { return d.end; }), 12);*/
	/*var minDate =d3.min(data, function (d) { return d.start; });
    var maxDate = d3.max(data, function (d) { return d.end; });*/
    
	var brushScale = d3.time.scale()
			.domain([minDate, maxDate])
			.range([0, width]);
    
    var xScale = d3.time.scale()
			.domain([minDate, maxDate])
			.range([0, width]);
	
	var axis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickSize(3, 0)
		//.ticks(5)
		.tickFormat(customTimeFormat);
	
	var brush = d3.svg.brush()
		.x(brushScale)
		.on("brush", brushed);
	
	var brushBox = svg.append("g")
		.attr("class", "x brush")
		.call(brush)
		.selectAll("rect")
		.attr("y", 0)
		.attr("height",  margin.top);
	
	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var xAxis = g.append("g")
		.attr("class", "axis axis--x")
		.call(axis);
	
	var simulation = d3.forceSimulation(data)
		.force("x", d3.forceX(function(d) { 
				return xScale(d.start); })
		.strength(1))
		.force("y", d3.forceY(height/2))
		.force("collide", d3.forceCollide(3.5))
		.stop();
	
	for (var i = 0; i < 120; i++){
		simulation.tick();
	}
	
	var voronoiData = d3.voronoi()
			.extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; })
			.polygons(data);
	
	var cell = g.append("g")
    .attr("class", "cells")
    .selectAll("g").data(voronoiData)
    .enter()
	.append("circle")
	.attr("class",function(d){
    		return "forceInstance _" + ((d.data.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_') + " _" + ((d.data.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_');
    	})
    .attr("r", 3)
    .attr("cx", function(d) { return d.data.x; })
    .attr("cy", function(d) { return d.data.y; })
    .style("opacity", .8)
    .style("stroke-width","1")
    .on("click",function(d){
    		toggleStroke(d.data,d3.select(this).style("stroke"),this);
    })
    .on("mouseover",function(d){ 
    	onMouseOverLinking(d);
    	tip.show(d);	
    })
    .on("mouseout",function(d){ 
    	onMouseOutLinking(d);
    	tip.hide(d);
    });
	forceTimeLineFilter();
	
	function brushed() {
		 var domain = brush.empty()? brushScale.domain(): brush.extent();
		 xScale.domain(brush.empty()? brushScale.domain(): brush.extent());
		 svg.select(".axis.axis--x").call(axis);
		 updateGraph();
	}

	function updateGraph(){			
			
		var simulation = d3.forceSimulation(data)
		.force("x", d3.forceX(function(d) { 
				return xScale(d.start); })
		.strength(1))
		.force("y", d3.forceY(height/2))
		.force("collide", d3.forceCollide(3.5))
		.stop();
		
		for (var i = 0; i < 120; i++){
			simulation.tick();
		}
		
		d3.voronoi()
			.extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; })
			.polygons(data);
		
		cell
		.attr("cx", function(d,i) { 
			return d.data.x; })
		.attr("cy", function(d,i) { 
			return d.data.y; });
		
		forceTimeLineFilter();
	}
	
	function forceTimeLineFilter(){
		cell.style("display", function(d) {
		var flag  = filter_by_entity(d.data.sourceType)&&filter_by_entity(d.data.targetType);
			return flag?"inline":"none";
		});
	} 
	
	startForceTimeLine.forceTimeLineFilter = forceTimeLineFilter;	  
}