/* 
	*Author: Santhosh Nandhakumar
	*emailid: nsanthosh2409@gmail.com
*/

/***  Start of application level variables ***/

var isEntityDate = false;

/***  End of application level variables ***/

var workerId;
var selects;
var workerDocList = [];
var locationArray=[];
var workerIdSelectedArray = [];
var nodeLocationJson=[];
var lineStyleJson = [];
var arrow = false;
var repeat_count = 0;
var bookMarkDocs = [];

var visualizedKeywords =[];
var visualizedWorkerId = [];
var visualizedDocId = [];
var deletedKeywords = [];

var editData = [];
var editLinkArray = [];

var CRESENT = 1;
var VAST = 2;

var dataset = CRESENT;

var entityMap = new Object(); 
entityMap["Person"] = 0;
entityMap["Date"] = 1;
entityMap["Location"] = 2;
entityMap["Organization"] = 3;
entityMap["Money"] = 4;
entityMap["Phone"] = 5;
entityMap["Misc"] = 6;
entityMap["nonEntity"] = 7;

function getEntityIdentifier(entityName) {
    return entityMap[entityName];
}

var entityCombinationArray = [[0,1,2,3,4,5,6,28],
                              [1,7,8,9,10,11,12,29],
                              [2,8,13,14,15,16,17,30],
                              [3,9,14,18,19,20,21,31],
                              [4,10,15,19,22,23,24,32],
                              [5,11,16,20,23,25,26,33],
                              [6,12,17,21,24,26,27,34],
							  [28,29,30,31,32,33,34,35]];

var customTimeFormat = d3.time.format.multi([
                                             [" %Y %b %d %I %p", function(d) { return d.getHours(); }],
                                             ["%Y %b %d", function(d) { return d.getDate() != 1; }],
                                             [" %Y %B", function(d) { return d.getMonth(); }],
                                             ["%Y", function() { return true; }],
                                           ]);

var dialog, form;
var linkData={};

var link_no=0;
var docDate;

var timeSeriesChart = [];

var CompareContent;

var ListOfDoc = [];

var description = '';
var dial;

var startDate, endDate;
var hasId;

var timeSeries = [];
var timeIntervalNo = 0;

var locationArray = [];
var locationRouteArray = [];

var selectionWords  = "";

var linkCreationCount=0;
var totalLinkCount =0;
var items =[];
var flag=0;
var primaryDocID;

var timeSeriesTimeFormat = d3.time.format("%Y-%m-%d");


var Term;

var workerDocCount = 0;
var workerDocsIndex = [];
var distributedDocIndex = 0;

// End of application level variables

$(document).ready(function() {

	/*** Click function of the sign in button starts ***/ 
	$("#analystproceedButton").click(function(){
		var userId = $("#analystUserID").val();

		if(userId == null || userId == "" || userId == " " ){
			$("#analystUserID").addClass("error").attr('title', 'Please Enter your ID');
		}
		else{
			// Check if the user exist
			sessionStorage.setItem('userId', userId);
			$.get("users/get/" + sessionStorage.getItem('userId') , function(data){
				showMainPage();
			})
			.fail(function(err){
				if(err.status == 404){
					$.post("users/add/" + sessionStorage.getItem('userId') , function(data){
						showMainPage();
					})
					.fail(function(err){
						console.log("Error! User not added");
					});
				}
			});
				
			// $.post("/users/addNewWorker", {"workerId": workerId }, function(res){
			// 	if(res.totalLinks){
			// 		link_no = Number(res.totalLinks)
			// 		$("#linkCountSpan").html("<b>Links Created :" + link_no +"<b>");
			// 		if(link_no > 0){
			// 			// Add the current logged in ID to the list of IDs 
			// 			visualizedWorkerId.push(workerId);
			// 			getLinks(false);
			// 		}
			// 	}
			// 	$("#loginDiv").addClass("analyst-login-div-hide");
			// 	$("#analystMainPage").removeClass("analys-main-page-hide");
			// 	window.open("/intstruction", "_blank", "toolbar=no, scrollbars=yes, resizable=yes, location=no, top=auto, left=auto, width=500, height=500");
			// });
		}

		//For general analysts view
		function showMainPage(){
			$("#loginDiv").addClass("analyst-login-div-hide");
			$("#analystMainPage").removeClass("analys-main-page-hide");
			populateAllDocs();
		}
	});
	/*** Click function of the sign in button Ends ***/ 

	/*** click function on generate button starts ***/
	$('#do').click(function() {
    	if((queue[0].Type == "Date") || (queue[0].Type == "Date")){
			isEntityDate = true;
			if(queue[0].Type == "Date"){
				Term=  queue[0].selection;
			}
			else{
				Term = queue[0].selection;
			}
			
		}
    	else{
			if((queue[1].Type == "Date") || (queue[1].Type == "Date")){
				isEntityDate = true;
				if(queue[1].Type == "Date"){
				Term = queue[1].selection;
				}
				else{
				Term = queue[1].selection;
					} 
			}
		}
    	
		if(isEntityDate){
	    	$("#endDate").hide();
	    	$("#endDatelable").hide();
	    	$("#isIntervalLable").hide();
	    	$("#isInteraval").hide();
	        $("#startDateLabel").show();
	        $("#startDate").show();
	        $("#startDate").datepicker( "setDate", (new Date(Term)));
	        $("#startDate").datepicker('disable');
			$("#useDocDate").hide();
			$("#useDocDatelable").hide();
		}
		else{
			$("#endDate").hide();
	    	$("#endDatelable").hide();
	    	$("#isIntervalLable").show();
	    	$("#isInteraval").show();
	        $("#startDateLabel").show();
	        $("#startDate").show();
			$("#useDocDate").show();
			$("#useDocDatelable").show();
			$("#isInteraval").show(); 
			$("#intervalText").show();
			$("#startDate").datepicker('enable');
		}
		
		link_no++;

    	var i = queue.length;
    	if(i>1){
    		dialog.dialog( "open" );
    	}
	});
	/*** click function on generate button Ends ***/

	/*** Defining the add link dialog box starts ***/
	dialog = $( "#dialog-form" ).dialog({
		autoOpen: false,
		height: 475,
		width: 463,
		modal: true,
		buttons: {	
		  	"Add": function(){
				var description = $("#description").val();
				var startDate = $("#startDate").val();
				var endDate = $("#endDate").val();
				var isError=false;
				if(description == null || description == "" || description == " " ){
					$("#description").addClass("error").attr('title', 'Description is required');
					isError=true;
				}
				else{
					if($("#description").hasClass("error")){
						$("#description").removeClass("error")
					}
				}
				if(!isError){
					if(endDate!= null){
						if(new Date(startDate) >= new Date(endDate) ){
							$("#startDate").addClass("error").attr('title', 'Start Date is greater than end date');
							isError=true;
						}
						else{
							if($("#startDate").hasClass("error")){
								$("#startDate").removeClass("error")
							}
						}
					}
				}
				if(!isError){
					if (!($("#useDocDate").is(":checked"))) {
						if(isEntityDate){
								startDate = +(new Date(Term));
						}
						if(startDate == null || startDate == "" || startDate.length == 0){
							$("#startDate").addClass("error").attr('title', 'Start Date can not be empty');
							isError=true;
						}
						else{
							if($("#startDate").hasClass("error")){
								$("#startDate").removeClass("error")
							}
						}
					}
				}
							  
				if(!isError){
					storeData();
				}
		  	},
			close: function() {
				form[ 0 ].reset();
				$("#description").val("");
				dialog.dialog( "close" );
			}
	  	}
  	});

	form = dialog.find( "form" ).on( "submit", function( event ) {
			
	});
  
	$("#isInteraval").click(function () {
		if ($(this).is(":checked")) {
			$("#endDate").show();
			$("#endDatelable").show();
		} else {
			$("#endDate").hide();
			$("#endDatelable").hide();
		}
	});
  
	$("#useDocDate").click(function () {
		if ($(this).is(":checked")) {
			$("#isIntervalLable").hide();
			$("#isInteraval").hide();
			$("#intervalText").hide();
			$("#startDateLabel").hide();
			$("#startDate").hide();
			$("#endDatelable").hide();
			$("#endDate").hide();
		} else {
			$("#isIntervalLable").show();
			$("#isInteraval").prop("checked", false);
			$("#isInteraval").show();

			$("#intervalText").show();
			$("#startDateLabel").show();
			$("#startDate").show();
		}
	});
	/*** Defining the add link dialog box Ends ***/

	
	/*** Function to store the selected links starts ***/
	function storeData(){

		if(isEntityDate){
			startDate = +(new Date(Term));
			linkCreationCount++;
		}
		
		try{
			docId= queue[0].docID;
			description = $( "#description" ).val();
			
			if ($("#useDocDate").is(':checked')) {
				$.ajax({
					type: 'get',
					dataType: 'application/x-www-form-url',		
					url: 'docs/docdate/'+docId,
					async:false,
					complete:function(data){
						if(data==null || data.responseText == null || data.responseText == undefined || data.responseText == "[]" ){
							startDate = +(new Date("2003 Apr 01"));
						}
						else{
							startDate = +(new Date(data.responseText));
						}
					}
				});
			}
			else{
				if(isEntityDate){
					// to-do 
				}
				else{
					startDate = +(new Date($( "#startDate" ).val()));
				}
			}
			endDate = +(new Date($( "#endDate" ).val()));
			isEntityDate = false;
			
			form[ 0 ].reset();
			dialog.dialog( "close" );
			
			selectionWords = selectionWords + " " + queue[0].selection + " " + queue[1].selection;
			
			for(var i=0; i<queue.length; i++){
				var nodeType;
				if(i==0){
					nodeType = "sourceNode";
				}
				else{
					nodeType = "targetNode";
				}
				linkData[nodeType]={};
				if(queue[i].Type == "nonEntity"){
					linkData[nodeType]["node"] = stemmer(queue[i].selection);
				}
				else{
					linkData[nodeType]["node"] = queue[i].selection;
				}
				linkData[nodeType]["docID"] = queue[i].docID;
				linkData[nodeType]["entityType"] = queue[i].Type;
				
				if(queue[i].Type == "Location" ){
					var cityName = queue[i].selection;
					var locationDetails;
					$.ajax({
						dataType: "json",
						url: "https://nominatim.openstreetmap.org/search?q="+cityName+"&format=json&limit=1",
						async: false,
						success: function(data){
							locationDetails = data;
						}
					});
					if(locationDetails.length > 0 ){
						linkData[nodeType]["lat"] = locationDetails[0].lat;
						linkData[nodeType]["lon"] = locationDetails[0].lon;
					}
				}
				
				linkData["description"] = description;
				linkData["startDate"] = startDate;
				linkData["endDate"] = endDate;
				linkData["combinationId"] = entityCombinationArray[getEntityIdentifier(queue[0].Type)][getEntityIdentifier(queue[1].Type)];
				linkData["linkNo"] = link_no;
			}

			$.ajax({
				type: 'POST',
				dataType: 'application/x-www-form-url',
				data: {
						"link" : JSON.stringify(linkData)
				},
				url: '/users/addlink/' + sessionStorage.getItem('userId'),
				async: false,
				complete : function(data){
					resetSelection();
					//getWorkersLinks(selects+","+workerId);
					//visualizedWorkerId.push(workerId);
					//getLinks(false);
				}
			});
		}
		catch(e){
			console.log(e);
			console.log("in catch-- " + e.message);
		}
	}
	/*** Function to store the selected links Ends ***/
  
	// Add the the scrap paper functionality
	addScrap();
	 
	var defaultStartDate = new Date();
	defaultStartDate.setFullYear(2003);
	defaultStartDate.setMonth(3);
	defaultStartDate.setDate(1);
	
	$( "#startDate" ).datepicker({
		defaultDate: defaultStartDate
	});
    $( "#endDate" ).datepicker({
    	defaultDate: defaultStartDate
    });
    
    $("#selectReset").click(function(){   	
    	resetSelection();
    }); 

});

//Function to clear the keyword selections
function resetSelection(){
	$(".document-list, #scrapPaperDiv, .scrap-keyword").find("span").each(function( index ){
		if($(this).hasClass('ent_highlighted')){
			$(this).removeClass('ent_highlighted');
		}
		
		if($(this).hasClass('highlighted')){
			$(this).parent().unhighlight({className:$(this).text().split(" ")[0]});		
		}
	});
	queue = [];
};

function getLinks(updateDocs){
	var currentWorker = null;
	var workersIds =  visualizedWorkerId.join(",");
	var docId = visualizedDocId.join(",");
	var keyWords = visualizedKeywords.join(",");
	var removedWords = deletedKeywords.join(",");
	
	if(workerId != undefined || workerId != null ){
		currentWorker = workerId;
	}
	
	if(workersIds.length == 0){
		workersIds = ["null"];
	}
	if(docId.length == 0){
		docId = ["null"];
	}
	if(keyWords.length == 0){
		keyWords = ["null"];
	}
	if(removedWords.length == 0){
		removedWords = ["null"];
	}
	
	$.getJSON("/users/getLinks/"+workersIds+"/"+docId+"/"+keyWords+"/"+removedWords,function(data){
		drawNewGraphs(data,updateDocs);		
	});
	deletedKeywords = [];
}

function drawNewGraphs(data,updateDocs){

	resetSelection();
	var activePanel;
	var activeTimeLine;


	if(!$("#graphContainer").hasClass("active")){
	activePanel = "#editViewContainer";
	$("#graphContainer").addClass("active");
	}
	if(!$("#editViewContainer").hasClass("active")){
	activePanel = "#graphContainer";
	$("#editViewContainer").addClass("active");
	}

	timeSeriesChart=[];
	locationArray=[];
	graphNodes=[];
	graphLinks=[];
	editData = [];
	editLinkArray = [];
	nodeLocationJson = [];

	$.each( data, function( key, val ) {
	var workerId = val.workerId;
	if(val.link != undefined){
		for(var i=0;i<val.link.length;i++){
				var linkCombination = val.link[i].combinationId;
				var linkDescription = val.link[i].description;
				var startDate = val.link[i].startDate;
				var endDate = val.link[i].endDate;
				var sval = val.link[i].sourceNode.node;
				var tval = val.link[i].targetNode.node;
				var sEntityType = val.link[i].sourceNode.entityType;
				var tEntityType = val.link[i].targetNode.entityType;
				var linkNo = val.link[i].linkNo;
				
				var locationJson={};
				var rowJson={};
				
				rowJson["id"]=workerId + i + Date.now();
				rowJson["sourceNode"]=sval;
				rowJson["sourceType"]=sEntityType;
				rowJson["description"] = linkDescription;
				rowJson["targetNode"] = tval;
				rowJson["targetType"] = tEntityType;
				rowJson["startDate"] = customTimeFormat(new Date(startDate));
				if(endDate != null){
					rowJson["endDate"] = customTimeFormat(new Date(endDate));
				}
				else{
					rowJson["endDate"] ="";
				}
				
				rowJson["workerId"] = workerId;
				rowJson["linkNo"] = linkNo;
				
				editLinkArray.push(rowJson);
				
				if(sEntityType == "Location" && val.link[i].sourceNode.lat != undefined && val.link[i].sourceNode.lon != undefined ){
				// var oldLocationPos = hasLocation(val.link[i].sourceNode.lat, val.link[i].sourceNode.lon );
					//if(Number(oldLocationPos) == -1){
					var flag=true;
					var lat = Number(val.link[i].sourceNode.lat) + (Math.random()/2);
					var lon = Number(val.link[i].sourceNode.lon) + (Math.random()/2);
						locationJson["locationName"]=sval;
						locationJson["target"]=tval;
						locationJson["targetType"]=tEntityType;
						locationJson["lat"] = lat;
						locationJson["lon"] = lon;
						locationJson["toolTip"] = true;
						
						for(var loopIndex=0; loopIndex<locationArray.length; loopIndex++){
							if(locationArray[loopIndex].locationName == sval && locationArray[loopIndex].target == tval){
								flag = false;
							}
						}
						if(flag){
							locationArray.push(locationJson);
							appendtoNodeLocationnew(sval,tval,lat, lon,startDate,linkCombination,tEntityType);
							/*if(tEntityType == "Person" || tEntityType == "Organization"){
								appendtoNodeLocationnew(sval,tval,lat, lon,startDate,linkCombination,tEntityType);
							}*/
						}
			}
				
			if(tEntityType == "Location" && val.link[i].targetNode.lat != undefined && val.link[i].targetNode.lon != undefined && sEntityType != "Location"){
				var flag=true;
				var lat = Number(val.link[i].targetNode.lat) + (Math.random()/2);
				var lon = Number(val.link[i].targetNode.lon) + (Math.random()/2);
						locationJson["locationName"]=tval;
						locationJson["target"]=sval;
						locationJson["targetType"]=sEntityType;
						locationJson["lat"] = lat;
						locationJson["lon"] = lon;
						
						locationJson["toolTip"] = true;
						
						for(var loopIndex=0; loopIndex<locationArray.length; loopIndex++){
							if(locationArray[loopIndex].locationName == sval && locationArray[loopIndex].target == tval){
								flag = false;
							}
						}
						if(flag){
							locationArray.push(locationJson);
							appendtoNodeLocationnew(tval,sval,lat,lon,startDate,linkCombination,sEntityType);
							/*if(sEntityType == "Person" || sEntityType == "Organization"){
								appendtoNodeLocationnew(sval,sval,lat,lon,startDate,linkCombination,sEntityType);
							}*/ 
						}
			}
				
				var startDateobj = timeSeriesTimeFormat(new Date(startDate));
				var endDateObj="";
				if(endDate != null){
					endDateObj = timeSeriesTimeFormat(new Date(endDate));
				}
				
				var editDate = [sval,linkDescription,tval,startDateobj,endDateObj,workerId,linkNo];
				
				var timeData = {		            
						// instant:true,
						sourceNode:sval,
						targetNode:tval,
						sourceType:sEntityType,
						targetType:tEntityType,
						label:linkDescription,
						start:startDateobj,
						end:endDateObj,
						// track:i
					};
					
				timeSeriesChart.push(timeData);

				var sObj = {
					id: sval,
					entityType:sEntityType
				};
				var tObj = {
					id: tval,
					entityType:tEntityType
				};
				var s = hasId(sval);
				if (s.result == false){
					sObj["nodeId"] = s.index;
					sObj["startDates"] = [];
					sObj["endDates"] = [];
					sObj["startDates"].push(startDate);
					sObj["endDates"].push(endDate);
					graphNodes.push(sObj);
					val.link[i].sourceNode["nodeId"] = s.index;
				}
				else{
					graphNodes[s.index].startDates.push(startDate);
					graphNodes[s.index].endDates.push(endDate);
					sObj = graphNodes[s.index];
				}
				
				var t = hasId(tval);

				if (t.result == false){
					tObj["nodeId"] = t.index;
					tObj["startDates"] = [];
					tObj["endDates"] = [];
					tObj["startDates"].push(startDate);
					tObj["endDates"].push(endDate);
					graphNodes.push(tObj);
					val.link[i].targetNode["nodeId"] = t.index;
				}
					
				else{
					graphNodes[t.index].startDates.push(startDate);
					graphNodes[t.index].endDates.push(endDate);
					tObj = graphNodes[t.index];
				}
				
				var oldLinkNo = hasLink(sval, tval);
				
				if (oldLinkNo == -1){
					graphLinks.push({
						source: sObj,
						target: tObj,
						label: linkDescription,
						combinationId:linkCombination
					});
				}
				else{
					if(graphLinks[oldLinkNo].strokeSize == null){
						repeat_count++;
						graphLinks[oldLinkNo].strokeSize = 2;
					}
					else{
						graphLinks[oldLinkNo].strokeSize = graphLinks[oldLinkNo].strokeSize + 2;
					}
					graphLinks[oldLinkNo].label = graphLinks[oldLinkNo].label + "/" + linkDescription ;
					graphLinks[oldLinkNo].toolTip = true ;
				}
				
				var sourceDocId =  val.link[i].sourceNode.docID;
				var targetDocId =  val.link[i].targetNode.docID;
				
				if($.inArray( sourceDocId, workerDocList ) == -1){
					workerDocList.push(sourceDocId);
				}
				
				if($.inArray( targetDocId, workerDocList ) == -1){
					workerDocList.push(targetDocId);
				}
			}
		}
	});

	if(updateDocs){
	generateWorkerDocs(workerDocList.join(","),"userList");
	workerDocList = [];
	}

	if(!$("#timeSeriesGraph").hasClass("active")){
	activeTimeLine = "#forceTimeSeries";
	$("#timeSeriesGraph").addClass("active");
	}
	if(!$("#forceTimeSeries").hasClass("active")){
	activeTimeLine = "#timeSeriesGraph";
	$("#forceTimeSeries").addClass("active");
	}

	drawEditViewTable(editLinkArray);
	createForceDirectedGraph();
	drawMap(locationArray, nodeLocationJson);		
	startTimeLine(timeSeriesChart);
	startForceTimeLine(timeSeriesChart);

	if(activePanel =="#graphContainer"){
	$("#editViewContainer").removeClass("active");
	}

	if(activePanel =="#editViewContainer"){
	$("#graphContainer").removeClass("active");
	}

	if(activeTimeLine =="#timeSeriesGraph"){
	$("#forceTimeSeries").removeClass("active");

	}

	if(activeTimeLine =="#forceTimeSeries"){
	$("#timeSeriesGraph").removeClass("active");
	}
};

function drawGraphs(){
	
	var activePanel;
	if(!$("#graphContainer").hasClass("active")){
		activePanel = "#editViewContainer";
		$("#graphContainer").addClass("active");
	}
	if(!$("#editViewContainer").hasClass("active")){
		activePanel = "#graphContainer";
		$("#editViewContainer").addClass("active");
	}
	
	
	
	graphNodes=[];
	graphLinks=[];
	timeSeriesChart=[];
	 
	 $.getJSON('/users/links/'+workerId, function(data) {
		 
		 visualData=data;
		 for(var i=0; i<visualData[0].link.length; i++){
			 var linkCombination = visualData[0].link[i].combinationId;
			 var linkDescription = visualData[0].link[i].description;
			 var startDate = visualData[0].link[i].startDate;
			 var endDate = visualData[0].link[i].endDate;
			 var sval = visualData[0].link[i].sourceNode.node;
		     var tval = visualData[0].link[i].targetNode.node;
		     var sEntityType = visualData[0].link[i].sourceNode.entityType;
		     var tEntityType = visualData[0].link[i].targetNode.entityType;
		     
		     
		     var startDateobj = timeSeriesTimeFormat(new Date(startDate));
		     var endDateObj="";
		     if(endDate != null){
		    	 endDateObj = timeSeriesTimeFormat(new Date(endDate));
		     }
		     
		     
		     var timeData = {		            
			            instant:false,
			            sourceNode:sval,
			            targetNode:tval,
			            label:linkDescription,
			            start:startDateobj,
			            end:endDateObj,
			            track:i
			        };
			        
			 timeSeriesChart.push(timeData);
		     
		     
		     
		     
		     var sObj = {
		            id: sval,
		            entityType:sEntityType
		        };
		        var tObj = {
		            id: tval,
		            entityType:tEntityType
		        };
		        var s = hasId(sval);
		        if (s.result == false){
		        	sObj["nodeId"] = s.index;
		        	sObj["startDates"] = [];
		        	sObj["endDates"] = [];
		        	sObj["startDates"].push(startDate);
		        	sObj["endDates"].push(endDate);
		        	graphNodes.push(sObj);
		        	visualData[0].link[i].sourceNode["nodeId"] = s.index;
		        }
		        else{
		        	graphNodes[s.index].startDates.push(startDate);
		        	graphNodes[s.index].endDates.push(endDate);
		        	sObj = graphNodes[s.index];
		        }
		        
		        var t = hasId(tval);

		        if (t.result == false){
		        	tObj["nodeId"] = t.index;
		        	tObj["startDates"] = [];
		        	tObj["endDates"] = [];
		        	tObj["startDates"].push(startDate);
		        	tObj["endDates"].push(endDate);
		        	graphNodes.push(tObj);
		            visualData[0].link[i].targetNode["nodeId"] = t.index;
		        }
		        	
		        else{
		        	graphNodes[t.index].startDates.push(startDate);
		        	graphNodes[t.index].endDates.push(endDate);
		        	tObj = graphNodes[t.index];
		        }
		            
		        
		        var oldLinkNo = hasLink(sval, tval);
		        
		        if (oldLinkNo == -1){
		            graphLinks.push({
		                source: sObj,
		                target: tObj,
		                label: linkDescription,
		                combinationId:linkCombination
		            });
				}
		        else{
		        	
		        	if(graphLinks[oldLinkNo].strokeSize == null){
		        		graphLinks[oldLinkNo].strokeSize = 2;
		        	}
		        	else{
		        		graphLinks[oldLinkNo].strokeSize = graphLinks[oldLinkNo].strokeSize + 2;
		        	}
		        	graphLinks[oldLinkNo].label = graphLinks[oldLinkNo].label + "/" + linkDescription ;
		        	graphLinks[oldLinkNo].toolTip = true ;
		        }
		        
		 }
		 
		 totalLinkCount = visualData[0].link.length;
		 
		// startTimeLine(timeSeriesChart);
		
		createForceDirectedGraph();
		//generateTime();
		//mapVisualization(visualData[0].link);
		//drawEditLinks(visualData);
		
		if(activePanel =="#graphContainer"){
			$("#editViewContainer").removeClass("active");
			
		}
		
		if(activePanel =="#editViewContainer"){
			$("#graphContainer").removeClass("active");
			
		}
		if(activePanel =="#graphContainer"){
			$("#editViewContainer").removeClass("active");
			
		}
		
		if(activePanel =="#editViewContainer"){
			$("#graphContainer").removeClass("active");
			
		}
		
		resetSelection();
		
		$("#getRelatedDocsButton").show();
	 });
}

hasLocation = function(lat, lon) {
    for (var i = 0; i < locationArray.length ; i ++) {
        if ((locationArray[i].lat == lat) && (locationArray[i].lon == lon)) {
            return i;
        }
    }
    return -1;
};


function appendtoNodeLocationnew(location, newnode, latitude, longitude,startDate,combinationId,targetType){
	
	if(nodeLocationJson.length == 0){
		nodeLocationJson.push({"location":location,"combinationId" : combinationId, "node": newnode, "targetType":targetType, "coordinates":[{"latitude":latitude, "longitude":longitude, "date":startDate }] });
		
	}
	else{
		var flag = false;
		for (var index = 0; index < nodeLocationJson.length; index++) {
			if(nodeLocationJson[index].node == newnode && nodeLocationJson[index].targetType == targetType ){
				nodeLocationJson[index].coordinates.push({"latitude":latitude, "longitude":longitude, "date":startDate});
				flag = true;
				break;
			}
		}
		if(!flag){
			nodeLocationJson.push({"location":location,"combinationId" : combinationId, "node": newnode, "targetType":targetType, "coordinates":[{"latitude":latitude, "longitude":longitude, "date":startDate }] });
		}
	}
};