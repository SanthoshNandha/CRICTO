
function toggleBarColorWithClass(className, checked){
		if(checked){
			$(".bar."+className+"").addClass("clicked");
		}
		else{
			$(".bar."+className+"").removeClass("clicked");
		}
};
	
function drawuserHisto(){
	
	function toggleBarColor(bar){
		//console.log(bar);
		//console.log($(bar).hasClass("clicked"));
		
		if($(bar).hasClass("clicked")){
			$(bar).removeClass("clicked");
		}
		else{
			//console.log("inside else");
			$(bar).addClass("clicked");
		}
		/*var currentColor = "brown";	    
		    return function(d){
		        currentColor = currentColor == "brown" ? "steelblue" : "brown";
		        d3.select(bar).style("fill", currentColor);
		    };*/
	};
	
	var dir = "/javascripts/data/";
	var path;
	
	if(dataset == CRESENT){
		path = dir + "cresentWorkerLinks.csv";
	}
	
	if(dataset == VAST){
		path = dir + "vastWorkerLinks.csv";
	}
	
	function toggleBarColor(bar){		
		if($(bar).hasClass("clicked")){
			$(bar).removeClass("clicked");
		}
		else{
			$(bar).addClass("clicked");
		}
	};	
	
	/*= (function(bar){
  	   var currentColor = "brown";	    
	    return function(d){
	        currentColor = currentColor == "brown" ? "steelblue" : "brown";
	        d3.select(bar).style("fill", currentColor);
	    }
	})();*/
	
	var margin = {top: 0, right: 0, bottom: 5, left: 18},
    width = 734 - margin.left - margin.right,
    height = 86 - margin.top - margin.bottom;
	
	var formatPercent = d3.format("d");

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1, 0);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(formatPercent);

	var svg = d3.select("#userHisto").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv(path, function(error, data) {

	  data.forEach(function(d) {
		  d.numberOfLinks = +d.numberOfLinks;
	  });

	  x.domain(data.map(function(d) { return d.workerId; }));
	  y.domain([0, d3.max(data, function(d) { return d.numberOfLinks; })]);

	  /*svg.append("g")
	      .attr("class", "x histo-axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);*/

	  svg.append("g")
	      .attr("class", "y histo-axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 4)
	      .attr("dy", ".51em")
	      .style("text-anchor", "end")
	      .text("No. of Links");

	  svg.selectAll(".bar")
	      .data(data)
	      .enter().append("rect")
	      .attr("class", function(d){
	    	  return "bar "+d.workerId;
	      })
	      .attr("x", function(d) { return x(d.workerId); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.numberOfLinks); })
	      .attr("height", function(d) { return height - y(d.numberOfLinks); })
	      .on("click", function(d){
	    	  toggleBarColor(this);
	    	  addWorkertoSelect(d.workerId);
	      })
	       .append("title")
	      .text(function(d){
	    	  return d.workerId + " : " + d.numberOfLinks;
	      });

	  d3.select(".sort-div").on("click", change);
	  
	  var sortTimeout = setTimeout(function() {
	    d3.select("input").property("checked", true).each(change);
	  }, 2000);

	  function change() {
	    clearTimeout(sortTimeout);

	    // Copy-on-write since tweens are evaluated after a delay.
	    var x0 = x.domain(data.sort(this.checked
	        ? function(a, b) { return b.numberOfLinks - a.numberOfLinks; }
	        : function(a, b) { return d3.ascending(a.workerId, b.workerId); })
	        .map(function(d) { return d.workerId; }))
	        .copy();

	    svg.selectAll(".bar")
	        .sort(function(a, b) { return x0(a.workerId) - x0(b.workerId); });

	    var transition = svg.transition().duration(750),
	        delay = function(d, i) { return i * 50; };

	    transition.selectAll(".bar")
	        .delay(delay)
	        .attr("x", function(d) { return x0(d.workerId); });

	    transition.select(".x.histo-axis")
	        .call(xAxis)
	      .selectAll("g")
	        .delay(delay);
	  }
	});
}