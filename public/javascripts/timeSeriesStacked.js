/* 
	*Author: Santhosh Nandhakumar
	*emailid: nsanthosh2409@gmail.com
*/

function startTimeLine(timeSeriesChart){

	d3.select("#naviBand").remove();
	d3.select("#mainBand").remove();
	
	d3.select("#timeline").insert("div").attr("id","naviBand").attr("class","navi-Band");
	d3.select("#timeline").insert("div").attr("id","mainBand").attr("class","main-Band scrollable");
	
	var dataset = timeSeriesChart;
    var naviDomElement = "#naviBand";
    var mainDomElement = "#mainBand";

    timeline()
        .data(dataset)
        .band("mainBand",mainDomElement,true)
        .band("naviBand", naviDomElement,false)
        .xAxis("naviBand")
        .tooltips("mainBand")
        .brush("naviBand", ["mainBand"])
        .redraw();

}

function timeline() {
	
	 var customTimeFormat = d3.time.format.multi([
	                                                 [" %y %b %d %I %p", function(d) { return d.getHours(); }],
	                                                 ["%y %b %d", function(d) { return d.getDate() != 1; }],
	                                                 [" %y %b", function(d) { return d.getMonth(); }],
	                                                 ["%Y", function() { return true; }],
		                                           ]);
	
    // global timeline variables
    var timeline = {},   // The timeline
        data = {},       // Container for the data
        components = [], // All the components of the timeline for redrawing
        bandGap = 10,    // Arbitray gap between to consecutive bands
        bands = {},      // Registry for all the bands in the timeline
        bandY = 0,       // Y-Position of the next band
        bandNum = 0;     // Count of bands for ids
   
    var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
		  if (!(d.instant)) {
              return d.sourceNode + " - " + d.targetNode + "<br>" + d.label + "<br>" + customTimeFormat(d.start) /*toYear(d.start)*/ + " to " + customTimeFormat(d.end);
          } else {
              return d.sourceNode + " - " + d.targetNode + "<br>" +d.label + "<br>" + customTimeFormat(d.start);
          }
	  });
	
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
    	
    	var sourceClassName = (((d.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_'));
	    var targetClassName = (((d.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_'));
	    
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
    	var sourceClassName = (((d.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_'));
	    var targetClassName = (((d.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_'));
	    
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
    
    var tooltip = d3.select(".container")
    .append("div")
    .attr("class", "d3-tip")
    .style("visibility", "hidden");
    
    timeline.data = function(items) {

        var today = new Date(),
            tracks = [],
            tracksInfo = [];
            yearMillis = 31622400000,
            instantOffset = 2 * yearMillis;

        data.items = items;

        function compareDescending(item1, item2) {
            // Every item must have two fields: 'start' and 'end'.
            var result = item1.start - item2.start;
            // later first
            if (result < 0) { return 1; }
            if (result > 0) { return -1; }
            // shorter first
            result = item2.end - item1.end;
            if (result < 0) { return 1; }
            if (result > 0) { return -1; }
            return 0;
        }
        
        function calculateTracks(items, sortOrder, timeOrder) {
            var i, track;

            sortOrder = sortOrder || "descending"; // "ascending", "descending"
            timeOrder = timeOrder || "backward";   // "forward", "backward"
            
            function selectTrack(){
            	items.forEach(function(item){
            		outerloop:
            		for(i = 0; i < tracksInfo.length; i++){
            			innerloop:
            			for(var j=0; j < tracksInfo[i].length; j++){
            				
                        		if(item.start >= tracksInfo[i][j].start && item.end <= tracksInfo[i][j].end){
                        			continue outerloop ;
                        		}
                        		if(item.start <= tracksInfo[i][j].start && item.end >= tracksInfo[i][j].start){
                        			continue outerloop ;
                        		}
                        		if(item.start <= tracksInfo[i][j].end && item.end >= tracksInfo[i][j].start){
                        			continue outerloop ;
                        		}
                        		if(item.start <= tracksInfo[i][j].start && item.end >= tracksInfo[i][j].start){
                        			continue outerloop ;
                        		}
                        		if(item.start <= tracksInfo[i][j].end && item.end >= tracksInfo[i][j].end){
                        			continue outerloop ;
                        		}
            					/*if(item.graphStart >= tracksInfo[i][j].start && item.graphStart <= tracksInfo[i][j].end ){
                        			continue outerloop ;
                        		}
                        		else if(item.graphEnd >= tracksInfo[i][j].start && item.graphEnd <= tracksInfo[i][j].end){
                        			continue outerloop ;
                        		}
                        		else if(item.graphStart <= tracksInfo[i][j].start && item.graphEnd >= tracksInfo[i][j].end){
                        			continue outerloop;
                        		}*/
            			} 
            			break outerloop;
            		}
            		item.track = i;
            		if(tracksInfo[i] == undefined)
            			tracksInfo[i] = [{"start": item.graphStart, "end" : item.graphEnd}];
            		else
            			tracksInfo[i].push({"start": item.graphStart, "end" : item.graphEnd});
            	});
            }

            function sortBackward() {
                // older items end deeper
                items.forEach(function (item) {
                    for (i = 0, track = 0; i < tracks.length; i++, track++) {
                        if (item.end < tracks[i]) { 
                        break; 
                        }
                    }
                    item.track = track;
                    tracks[track] = item.start;
                });
            }

                data.items.sort(compareDescending);
                selectTrack();
              // sortBackward();
        }

        // Convert yearStrings into dates
        data.items.forEach(function (item){
            item.start = parseDate1(item.start);
            item.graphStart = d3.time.month.offset(item.start, -1)
            if (item.end == "") {
                item.end = d3.time.month.offset(item.start, 5)//new Date(item.start.getTime() + instantOffset);
                item.graphEnd = d3.time.month.offset(item.end, 1)
                item.instant = true;
            } else {
                item.end = parseDate1(item.end);
                item.graphEnd = d3.time.month.offset(item.end, 1)
                item.instant = false;
            }
            
        });
        
//      d3.time.month.offset(d3.min(data.items, function (d) { return d.start; }), -6);
//      d3.time.month.offset(d3.min(data.items, function (d) { return d.end; }), +6);

        calculateTracks(data.items, "descending", "backward");
        data.nTracks = tracksInfo.length;
        
        data.minDate = d3.time.month.offset(d3.min(data.items, function (d) { return d.start; }), -6);
        data.maxDate = d3.time.month.offset(d3.max(data.items, function (d) { return d.end; }), +6);
        
        minDate = d3.time.month.offset(d3.min(data.items, function (d) { return d.start; }), -6);
        maxDate = d3.time.month.offset(d3.max(data.items, function (d) { return d.end; }), +6);
        
        return timeline;
    };

    timeline.band = function (bandName, domElement, isMain) {
    	
    	var bandWidth = $(domElement).width();
    	var bandHeight = $(domElement).height();
        var margin = {top: 3, right: 5, bottom: 8, left: 10},
            outerWidth = bandWidth,
            outerHeight = bandHeight,
            width = outerWidth - margin.left - margin.right,
            height = outerHeight - margin.top - margin.bottom;
        
        var band = {};
        band.id = "band" + bandNum;
        band.x = 0;
        band.y = bandY;
        band.w = width;
		band.h = height  
		
		if(isMain){
			band.trackOffset = 1;
			band.trackHeight = 9;
			band.itemHeight = band.trackHeight * 0.9,
			band.h = (band.trackHeight + band.trackOffset) * data.nTracks;
			band.circleRadius = 3;
		}
		else{
			band.trackOffset = 0.9;
			band.trackHeight = Math.min((band.h - band.trackOffset) / data.nTracks, 4) < 1.5 ? 1.5 : Math.min((band.h - band.trackOffset) / data.nTracks, 4);
			band.itemHeight = band.trackHeight * 1;
			band.circleRadius = band.trackHeight/2;
		}
		
        band.parts = [],
        band.instantWidth = 100; // arbitray value

        band.xScale = d3.time.scale()
            .domain([data.minDate, data.maxDate])
            .range([0, band.w]);

        band.yScale = function (track) {
           return band.trackOffset + track * band.trackHeight;
        };

        
        band.svg = d3.select(domElement).append("svg")
        	.attr("class", "svg")
	        .attr("id", bandName)
	        .attr("width", band.w);	
	    
        if(isMain){
        	band.svg.attr("height", band.h);
        	band.svg.call(tip);
        }
        else{
        	band.svg.attr("height", outerHeight);
        }
        
        //band.svg.call(tip);
        
        band.svg.append("g")
        	.attr("transform", "translate(" + margin.left + "," + margin.top +  ")");
        
        band.svg.append("clipPath")
        .attr("id", "chart-area")
        .append("rect")
        .attr("width", band.w)
        .attr("height",  band.h);
        
        band.chart = band.svg.append("g")
        	.attr("class", "chart")
        	.attr("clip-path", "url(#chart-area)" );
        
        band.g = band.chart.append("g")
        	.attr("id", band.id)
        	.attr("transform", "translate(" + margin.left + "," + band.y +  ")");

        band.g.append("rect")
            .attr("class", "band")
            .attr("width", band.w)
            .attr("height", band.h);

        // Items
       var items = band.g.selectAll("g")
            .data(data.items)
            .enter().append("svg")
            .attr("height", function(d){
            	return band.itemHeight;
            })
            .attr("class", function (d) { 
            	if(d.instant){
            		return "part instant " + bandName + " item _" + ((d.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_') + " _" + ((d.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_');
            	}
            	else{
            		return "part interval " + bandName + " item _" + ((d.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_') + " _" + ((d.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_');
            	}
//            	return d.instant ? "part instant "  : "part interval";
             });
            // .style("display","none");
       
        band.items = items;

        var intervals = d3.select("#band" + bandNum).selectAll(".interval");
      
        intervals.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("class",function(d){
        		return bandName + " interval _" + ((d.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_') + " _" + ((d.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_');
        	})
        	.style("stroke","white")
        	.style("opacity", .8)
        	.on("click",function(d){
        		toggleStroke(d,d3.select(this).style("stroke"));
        	});
     
        var instants = d3.select("#band" + bandNum).selectAll(".instant");
        
        if(isMain){
            instants.append("circle")
            .attr("class",function(d){
                return bandName + " instants _" + ((d.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_') + " _" + ((d.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_');
            })
            .attr("cx", band.itemHeight / 2)
            .attr("cy", band.itemHeight / 2)
            .attr("r", band.circleRadius)
            .style("opacity", .8)
            .style("stroke-width","1")
            .on("click",function(d){
                toggleStroke(d,d3.select(this).style("stroke"),this);
            });
        }
        else{
            instants.append("circle")
            .attr("class",function(d){
                return bandName + " instants _" + ((d.sourceNode).replace(/[^\w\s]/gi, '')).split(' ').join('_') + " _" + ((d.targetNode).replace(/[^\w\s]/gi, '')).split(' ').join('_');
            })
            .attr("cx", band.itemHeight / 2)
            .attr("cy", band.itemHeight / 2)
            .attr("r", band.circleRadius)
            .style("opacity", .8)
            .style("stroke-width","1")
            .on("click",function(d){
                toggleStroke(d,d3.select(this).style("stroke"),this);
            });
        }
     
        band.addActions = function(actions) {
            actions.forEach(function (action) {
                items.on(action[0], action[1]);
            })
        };

        band.redraw = function () {
            var tracksInfo =[];
            
            if(isMain){
                items.data().forEach(function(item) {
                    if(item != undefined){
                        item.start = item.start;
                        var startDateX = band.xScale(item.start);
                        item.graphStart = band.xScale.invert(startDateX - 5);
                        
                        if (item.instant) {
                            item.end = band.xScale.invert(startDateX + 10);
                            item.graphEnd = band.xScale.invert(startDateX + 2);
                        }
                        else {
                            item.end = item.end;
                            var endDateX = band.xScale(item.end);
                            item.graphEnd = band.xScale.invert(endDateX + 1);
                        }
                    };
                });
                    
                items.data().forEach(function(item){
                    outerloop:
                    for(i = 0; i < tracksInfo.length; i++){
                        innerloop:
                        for(var j=0; j < tracksInfo[i].length; j++){
                                if(item.graphStart >= tracksInfo[i][j].start && item.graphStart <= tracksInfo[i][j].end ){
                                    continue outerloop ;
                                }
                                else if(item.graphEnd >= tracksInfo[i][j].start && item.graphEnd <= tracksInfo[i][j].end){
                                    continue outerloop ;
                                }
                                else if(item.graphStart <= tracksInfo[i][j].start && item.graphEnd >= tracksInfo[i][j].end){
                                    continue outerloop;
                                }
                        }
                        break outerloop;
                    }
                    item.track = i;
                    if(tracksInfo[i] == undefined)
                        tracksInfo[i] = [{"start": item.graphStart, "end" : item.graphEnd}];
                    else
                        tracksInfo[i].push({"start": item.graphStart, "end" : item.graphEnd});
                });
            }
            
            items
            .attr("x", function (d) { 
                return band.xScale(d.start);
            })
            .attr("y", function (d) { 
                return band.yScale(d.track); 
            })
            .attr("width", function (d) {
                return ((band.xScale(d.end) - band.xScale(d.start)) < 4) ? 4 : band.xScale(d.end) - band.xScale(d.start); 
            });
            
            band.parts.forEach(function(part) { 
                part.redraw(); 
            })
        };

        bands[bandName] = band;
        components.push(band);
        //Adjust values for next band
        //bandY += band.h + bandGap;
        bandNum += 1;

        return timeline;
    };

    timeline.tooltips = function (bandName) {

        var band = bands[bandName];

        band.addActions([
            // trigger, function
            ["mouseover", showTooltip],
            ["mouseout", hideTooltip]
        ]);

        function getHtml(element, d) {
            var html;
            if (element.attr("class") == "part interval") {
                html = d.sourceNode + " - " + d.targetNode + "<br>" + d.label + "<br>" + customTimeFormat(d.start) /*toYear(d.start)*/ + " to " + customTimeFormat(d.end);
            } else {
                html = d.sourceNode + " - " + d.targetNode + "<br>" +d.label + "<br>" + customTimeFormat(d.start);
            }
            return html;
        }

        function showTooltip (d) {
        	
        	onMouseOverLinking(d);
        	tip.show(d);
        	/*var x = event.pageX < band.x + band.w / 2
                    ? event.pageX + 10
                    : event.pageX + 11,
                y = event.pageY < band.y + band.h / 2
                    ? event.pageY + 30
                    : event.pageY + 30;
            

            tooltip
            	.html(getHtml(d3.select(this), d))
                .style("top", y + "px")
                .style("left", x + "px")
                .style("visibility", "visible");*/
        }

        function hideTooltip (d) {
        	
        	onMouseOutLinking(d);
        	tip.hide(d);
           // tooltip.style("visibility", "hidden");
        }

        return timeline;
    };


    timeline.xAxis = function (bandName, orientation) {

        var mainband = bands["mainBand"];
        var naviBand = bands["naviBand"];
        var axis = d3.svg.axis()
            .scale(mainband.xScale)
            .orient(orientation || "bottom")
            .tickSize(3, 0)
            //.ticks(5)
            //.ticks(d3.time.months,1);
            .tickFormat(customTimeFormat);

        var xAxis = naviBand.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 10 + "," + naviBand.h  + ")");

        xAxis.redraw = function () {
            xAxis.call(axis);
        };

        naviBand.axis = xAxis;
        naviBand.parts.push(xAxis); // for brush.redraw
        components.push(xAxis); // for timeline.redraw
  
        return timeline;
    };

    //----------------------------------------------------------------------
    //
    // brush
    //

    timeline.brush = function (bandName, targetNames) {

        var band = bands[bandName];

        var brush = d3.svg.brush()
            .x(band.xScale.range([0, band.w]))
            .on("brush", function() {
                var domain = brush.empty()
                    ? band.xScale.domain()
                    : brush.extent();
                targetNames.forEach(function(d) {
                    bands[d].xScale.domain(domain);
                    bands[d].redraw();
                   // band.xScale.domain(domain);
                   // band.axis.redraw();
                    band.redraw();
                });
            });

        var xBrush = band.g.append("svg")
            .attr("class", "x brush")
            .call(brush);

        xBrush.selectAll("rect")
            .attr("y", 0.5)
            .attr("height", band.h);

        return timeline;
    };

    //----------------------------------------------------------------------
    //
    // redraw
    //

    timeline.redraw = function () {
        components.forEach(function (component) {
            component.redraw();
        })
    };
    
   /* timeline.filter = function(){
    	var mainBand = bands[mainBand];
    	console.log(mainBand.items);
    };*/

    //--------------------------------------------------------------------------
    //
    // Utility functions
    //
    

    function parseDate1(dateString) {
        // 'dateString' must either conform to the ISO date format YYYY-MM-DD
        // or be a full year without month and day.
        // AD years may not contain letters, only digits '0'-'9'!
        // Invalid AD years: '10 AD', '1234 AD', '500 CE', '300 n.Chr.'
        // Valid AD years: '1', '99', '2013'
        // BC years must contain letters or negative numbers!
        // Valid BC years: '1 BC', '-1', '12 BCE', '10 v.Chr.', '-384'
        // A dateString of '0' will be converted to '1 BC'.
        // Because JavaScript can't define AD years between 0..99,
        // these years require a special treatment.

        var format = d3.time.format("%Y-%m-%d"),
            date,
            year;
        date = format.parse(dateString);
        //console.log(date);
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

    function toYear(date, bcString) {
        // bcString is the prefix or postfix for BC dates.
        // If bcString starts with '-' (minus),
        // if will be placed in front of the year.
        bcString = bcString || " BC" // With blank!
        var year = date.getUTCFullYear();
        if (year > 0) return year.toString();
        if (bcString[0] == '-') return bcString + (-year);
        return (-year) + bcString;
    }

    return timeline;
}
