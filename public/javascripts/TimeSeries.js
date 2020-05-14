function generateTime(){
	
	d3.select("#timeline").remove();
	var extent, scale,
    scheme = ["rgb(247,252,253)","rgb(224,236,244)","rgb(191,211,230)","rgb(158,188,218)","rgb(140,150,198)","rgb(140,107,177)","rgb(136,65,157)","rgb(129,15,124)","rgb(77,0,75)"]
	
    var chart = timeseries_chart(scheme)
            .x(get_time).xLabel("Time")
            .y(get_interval).yLabel("Y Axis")
            .startTime(getStart_Time)
            .endTime(getEnd_Time);
    
    d3.select("#timeSeriesGraph").insert("div").attr("id","timeline");
    d3.select("#timeline").datum(visualData[0].link).call(chart);

	function get_time(d) {
	    return d3.time.format.iso.parse(d);
	}
	
	function get_height(d){
	    return 100 - (d * 20);
	}
	
	function get_interval(d){
		return d.linkNo;
	}
	
	function getStart_Time(d){
		return d3.time.month.offset(d3.time.format.iso.parse(d.startDate), -2);
	}
	
	function getEnd_Time(d){
		if(d.endDate)
			return d3.time.month.offset(d3.time.format.iso.parse(d.endDate), 2);
		else
			return d3.time.month.offset(d3.time.format.iso.parse(d.startDate), 2);
	}

}
function timeseries_chart(color) {
	
	var timeSeriesViewWidth = $("#timeSeriesGraph").width();
	var timeSeriesViewHeight = $("#timeSeriesGraph").height();	
	
    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
        width =  timeSeriesViewWidth - margin.left - margin.right,
        height = timeSeriesViewHeight - margin.top - margin.bottom ; 
    
    var customTimeFormat = d3.time.format.multi([
                                                 [" %Y %b %d %I %p", function(d) { return d.getHours(); }],
                                                 ["%Y %b %d", function(d) { return d.getDate() != 1; }],
                                                 [" %Y %B", function(d) { return d.getMonth(); }],
                                                 ["%Y", function() { return true; }],
	                                           ]);

    var x = d3.time.scale(),
        y = d3.scale.linear(),
        colorScale =  d3.scale.category20().domain([0,35]);
        x_label = "X", y_label = "Y",
        brush = d3.svg.brush().x(x).on("brush", _brushmove),
    
    x.range([0, width]);
    y.range([height, 0]);
    
    var padding = 1;
    var radius = 6;
    
    var graphGroup;
    var zoomBox;
    var zoom;
    var series;
    var xAxis;
    var yAxis;
    var startCircles;
    var endCircles;
    var link;
    var node;
    var size;
    var get_x = no_op,
        get_y = no_op;
        get_startTime = no_op;
        get_endTime = no_op;
        get_interval_No =no_op; 
        
        var toggleStartNodeColor = (function(){
        	   var currentColor = "pink";
        	    
        	    return function(d){
        	        currentColor = currentColor == "pink" ? "red" : "pink";
        	        d3.select("timeNode " + d.sourceNode.node).style("fill", currentColor);
        	        d3.select("circle.node."+ d.sourceNode.node).style("fill", currentColor);
        	    }
        	})();
        
        var toggleEndNodeColor = (function(){
     	   var currentColor = "pink";
   	    
   	    return function(d){
   	        currentColor = currentColor == "pink" ? "red" : "pink";
   	        d3.select("timeNode " + d.targetNode.node).style("fill", currentColor);
   	        d3.select("circle.node."+ d.targetNode.node).style("fill", currentColor);
   	    }
   	})();
    
    function timeseries(selection) {
    	
    	var nodes = [];
    	var links = [];
    	
        selection.each(function (d) {        	
        	
        	x.domain([d3.min(d,get_startTime), d3.max(d,get_endTime)]);
            y.domain([d3.min(d,get_y) - 1, d3.max(d,get_y) + 1]);
            
            var halfYAxis = (d3.max(d,get_y) + 1)/2;
            
            xAxis = d3.svg.axis()
			.scale(x).orient("bottom")
			.tickFormat(customTimeFormat);

            yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
            
            zoom = d3.behavior.zoom()
    		.x(x)
    		.y(y)
    		.scaleExtent([0.1, 7])
    		.on("zoom", zoomed);
            
            size = d3.scale.pow().exponent(1)
        	.domain([1,100])
        	.range([8,24]);
            
            series = d3.select(this).append("svg").attr("id", "link-timeseries")
                    .style("width", width + margin.left + margin.right)
                    .style("height", height + margin.top + margin.bottom)
                    //.append("g").attr("id", "date-brush")                    
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                   //series.call(zoom);
            
            series.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .style("width", width)
            .style("height", height);
            
          /*  zoomBox = series.append("g")
            .attr("class", "zoom-box")
            .selectAll("rect")
            .style("height", height)
            .style("width", width)
            .style("fill", null)
            .attr("opacity", 0.4);*/
            
            var x_axis = series.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
            
            graphGroup = series.append("g")
        	.attr("clip-path", "url(#clip)")
        	.append("g").attr("class", "timeseries");
            /*.selectAll("circle")
            .data(d).enter()
            .append("g");*/
            
            var zoomBox = graphGroup.append("g")
            .attr("class", "zoom-box")
            .selectAll("rect")
            .style("height", height)
            .style("width", width)
            .style("fill", null)
            .attr("opacity", 0.4);
            
           

            /*var y_axis = series.append("g")
            .attr("class", "y axis")
            .call(yAxis);*/
            
           /* d.forEach(function(d) {
                d.x = x(get_x(d.startDate));
                d.y = y(1);
                d.color = color[color.length - 1];
                d.radius = radius;
              });*/
            
            var yScale = y(1);
            d.forEach(function(d){
            	nodeArraylength = nodes.length;
            	if(!d.endDate){
            		d.sourceNode.x = x(get_x(d.startDate));
            		d.sourceNode.y = y(halfYAxis);
            		d.sourceNode.radius = radius;
            		d.sourceNode.date = d.startDate;
            		nodes.push(d.sourceNode);
            	}
            	else{
            		d.sourceNode.x = x(get_x(d.startDate));
            		d.sourceNode.y = y(halfYAxis);
            		d.sourceNode.radius = radius;
            		d.sourceNode.date = d.startDate
            		d.sourceNode.arrayPosition = nodeArraylength;
            		d.sourceNode.arrayLinkPosition = nodeArraylength + 1;
            		d.targetNode.x = x(get_x(d.endDate));
            		d.targetNode.y = y(halfYAxis);
            		d.targetNode.radius = radius;
            		d.targetNode.date = d.endDate;
            		d.targetNode.arrayPosition = nodeArraylength+1;
            		d.targetNode.arrayLinkPosition = nodeArraylength;
            		d.targetNode.x1 = x(get_x(d.endDate)) - x(get_x(d.startDate)) + radius + padding;
            		d.targetNode.y1 = y(halfYAxis) + radius + padding;
            		
            		nodes.push(d.sourceNode);
            		nodes.push(d.targetNode);
            		
            		links.push({
            			source : d.sourceNode,
            			target : d.targetNode,
            			description : d.description,
            			startDate : d.startDate,
            			endDate : d.endDate,
            			combinationId : d.combinationId,
            			linkNo : d.linkNo
            		});
            	}
            	
            });
            
            var force = d3.layout.force()
            .nodes(nodes)
            .links(links)
            .size([width, height])
            .on("tick", tick)
            .linkDistance(function(d,i){
            	return d.target.x - d.source.x;
            })
            .charge(-1)
            .gravity(0)
            .chargeDistance(20);
            
            force.start(); 
            
            link = graphGroup.selectAll(".force-link")
            .data(links)
            .enter().append("line")
            .attr("class", "force-link")
            .style("stroke-width",2)
            .style("stroke","black")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
            
            node = graphGroup.selectAll(".force-circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "force-circle")
            .attr("r", radius)
            .style("fill", function(d) { return "#08c"; })
            .attr("cx", function(d) { return x(get_x(d.startDate)); })
            .attr("cy", function(d) { return y(halfYAxis); });
            
            series.call(zoom);

            function tick(e) {
            	
            	node.each(moveTowardDataPosition(e.alpha));
            	node.each(collide(e.alpha));    
            	
                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
                
                link.attr("x1", function(d) { return d.source.x; })
    			.attr("y1", function(d) { return d.source.y; })
    			.attr("x2", function(d) { return d.target.x; })
    			.attr("y2", function(d) { return d.target.y; });
              };
              
              function collide(alpha) {
                  var quadtree = d3.geom.quadtree(nodes);
                  return function(d) {
                    var r = d.radius + radius + padding,
                        nx1 = d.x - r,
                        nx2 = d.x + r,
                        ny1 = d.y - r,
                        ny2 = d.y + r;
                    quadtree.visit(function(quad, x1, y1, x2, y2) {
                      if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius * padding;
                        if (l < r) {
                          l = (l - r) / l * alpha;
                          d.y -= y *= l;
                          if(d.arrayPosition){
                        	  nodes[d.arrayLinkPosition].y = d.y;
                          }
                        	   
                          quad.point.y += y;
                        }
                      }
                      return y1 > ny2 || y2 < ny1;
                    });
                  };
                };
                
              function moveTowardDataPosition(alpha) {
            	    return function(d) {
            	      d.x += (x(get_x(d.date)) - d.x) * 0.1 * alpha;
            	      d.y += (y(halfYAxis) - d.y) * 0.1 * alpha;
            	    };
            	  }
              
            
        });
    }

    
    timeseries.startTime = function (accessor){
        if (!arguments.length) return get_startTime;
        get_startTime = accessor;
        return timeseries;
    }
    
    timeseries.endTime = function (accessor){
        if (!arguments.length) return get_endTime;
        get_endTime = accessor;
        return timeseries;
    }
    
    timeseries.x = function (accessor) {
        if (!arguments.length) return get_x;
        get_x = accessor;
        return timeseries;
    };

    timeseries.y = function (accessor) {
        if (!arguments.length) return get_y;
        get_y = accessor;
        return timeseries;
    };

    timeseries.xLabel = function (label) {
        if (!arguments.length) return x_label;
        x_label = label;
        return timeseries;
    }

    timeseries.yLabel = function (label) {
        if (!arguments.length) return y_label;
        y_label = label;
        return timeseries;
    }

    timeseries.brushmove = function (cb) {
        if (!arguments.length) return brushmove;
        brushmove = cb;
        return timeseries;
    };

    function _brushmove() {
    	var s = brush.extent();
    	d3.selectAll("circle.nodeCircle")
    	.style("stroke", function(d){
    		var bool = false;
    		for(var index=0; index < d.startDates.length; index++){
    			if(d3.time.format.iso.parse(d.startDates[index]) >= s[0]){
    				bool = true;
    				break;
    			}
    				
    		}
    		if(bool){
    			for(var index=0; index < d.endDates.length; index++){
    				if(d3.time.format.iso.parse(d.endDates[index]) <= s[1]){
    					return "black";
    				}
    			}
    			
    		}
    		return "#fff";
    	});
    	
    	d3.selectAll("path.mapNode")
    	.style("stroke", function(d){
    		var bool = false;
    		if(d3.time.format.iso.parse(d.startDate) >= s[0]){
    				bool = true;
    			}
    		
    		if(bool){
    			if(d3.time.format.iso.parse(d.endDate) <= s[1]){
    					return "black";
    			}
    		}
    		return "#fff";
    	})
    	.style("stroke-width", function(d){
    		var bool = false;
    		if(d3.time.format.iso.parse(d.startDate) >= s[0]){
    				bool = true;
    			}
    		
    		if(bool){
    			if(d3.time.format.iso.parse(d.endDate) <= s[1]){
    					return 5;
    			}
    		}
    		return 1;
    	});
    	
    }
    function zoomed() {
    	series.select(".x.axis").call(xAxis);
    	//series.select(".y.axis").call(yAxis); 	

    	var nominal_stroke = 1.5;
    	var max_stroke = 16;
        var max_base_node_size = 36;
        var min_zoom = 0.1;
        var max_zoom = 7;
        var nominal_base_node_size = 8;
        
		var stroke = nominal_stroke;
		
		if (nominal_stroke*zoom.scale()>max_stroke) 
			stroke = max_stroke/zoom.scale();
		
		link.style("stroke-width",function(d){
			
		});
		node.style("stroke-width",stroke);
   
		var base_radius = nominal_base_node_size;
		
		if (nominal_base_node_size*zoom.scale()>max_base_node_size)
			base_radius = max_base_node_size/zoom.scale();
		
		node.attr("d", d3.svg.symbol()
			.size(function(d) { return Math.PI*Math.pow(size(d.size)*base_radius/nominal_base_node_size||base_radius,2); })
			.type(function(d) { return d.type; }))
	
		/*if (!text_center) text.attr("dx", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); });*/

		/*var text_size = nominal_text_size;
		if (nominal_text_size*zoom.scale()>max_text_size) text_size = max_text_size/zoom.scale();
		text.style("font-size",text_size + "px");*/

		node.attr("transform", "translate(" + d3.event.translate + ")");
		link.attr("transform", "translate(" + d3.event.translate + ")");
	
    	}
    
    function no_op() {
    }

    return timeseries;
    
}

