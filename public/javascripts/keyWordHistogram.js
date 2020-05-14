function drawKeywordHisto(){
	
	var dir = "/javascripts/data/";
	var path;
	
	if(dataset == CRESENT){
		path = dir + "cresentKeyword_freq.csv";
	}
	
	if(dataset == VAST){
		path = dir + "vastKeyword_freq.csv";
	}
	
	function toggleBarColor(bar){		
		if($(bar).hasClass("clicked")){
			$(bar).removeClass("clicked");
		}
		else{
			$(bar).addClass("clicked");
		}
	};	
	
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
	var svg = d3.select("#keywordHisto").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv(path, function(error, data) {
		  data.forEach(function(d) {
			  d.frequency = +d.frequency;
		  });

	x.domain(data.map(function(d) { return d.keyword; }));
	y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

	svg.append("g")
      .attr("class", "y histo-axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 4)
      .attr("dy", ".51em")
      .style("text-anchor", "end")
      .text("Frequency");

	svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", function(d){
    	  var keyWordArray = (d.keyword).split(" ");
    	  if(keyWordArray.length > 1)
    		  return "bar" + " " + keyWordArray[0].replace(/[^\w\s]/gi, '')+ keyWordArray[1].replace(/[^\w\s]/gi, '');
    	  else
    		  return "bar" + " " + keyWordArray[0].replace(/[^\w\s]/gi, '');
      })
      .attr("x", function(d) { return x(d.keyword); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); })
      .on("click", function(d){
    	  toggleBarColor(this);
    	  if($(this).hasClass("clicked")){
  				var index = $.inArray(d.keyword, visualizedKeywords);
	  			if(index == -1){
	  				visualizedKeywords.push(d.keyword);
	  			}
	  			index = $.inArray(d.keyword,deletedKeywords)
	  			if(index != -1){
	  				deletedKeywords.splice(index,1);
	  			}
	  			updateSearchBoxText(d.keyword);
  		  }
    	  else{
    		  var index = $.inArray(d.keyword, visualizedKeywords);
    		  if(index != -1){
    			  visualizedKeywords.splice(index,1);
    		  }
    		  index = $.inArray(d.keyword,deletedKeywords);
    		  if(index == -1){
    			  deletedKeywords.splice(index,deletedKeywords);
    		  }
    		  removeSearchBoxText(d.keyword);
    	  }
    	  getLinks(false);
      })
      .append("title")
      .text(function(d){
    	  return d.keyword + " : " + d.frequency;
      });

	d3.select(".sort-div").on("click", change);

	var sortTimeout = setTimeout(function() {
	    d3.select("input").property("checked", true).each(change);
	}, 2000);

	function change() {
	    clearTimeout(sortTimeout);

	    // Copy-on-write since tweens are evaluated after a delay.
	    var x0 = x.domain(data.sort(this.checked
	        ? function(a, b) { return b.frequency - a.frequency; }
	        : function(a, b) { return d3.ascending(a.keyword, b.keyword); })
	        .map(function(d) { return d.keyword; }))
	        .copy();

	    svg.selectAll(".bar")
	        .sort(function(a, b) { return x0(a.keyword) - x0(b.keyword); });

	    var transition = svg.transition().duration(750),
	        delay = function(d, i) { return i * 50; };

	    transition.selectAll(".bar")
	        .delay(delay)
	        .attr("x", function(d) { return x0(d.keyword); });

	    transition.select(".x.histo-axis")
	      .call(xAxis)
	      .selectAll("g")
	      .delay(delay);
	  }
	});
}