var entitySelectDialog;
var selectedEntityNo = 0;
var lineStyleData = [] ;
var no_of_styles = 0;
var dataView;
var grid;

$(document).ready(function() {
	
	entitySelectDialog = $( "#entitySelect" ).dialog({
	      autoOpen: false,
	      height: 409,
	      width: 285,
	      modal: true,
	      buttons: {	
	    	"Add": function(){
	    		var selectedVal = $( "#singleEntitySlect" ).val();
	    		if(selectedEntityNo == 1){
	    			$("#entity1SingleValue").html(selectedVal);
	    		}
	    		else if(selectedEntityNo == 2){
	    			$("#entity2SingleValue").html(selectedVal);
	    		}
	    		else if(selectedEntityNo == 3){
	    			$("#entity3SingleValue").html(selectedVal);
	    		}
	    		
	    		entitySelectDialog.dialog( "close" );
	    	},
		close: function() {
			form[ 0 ].reset();
			entitySelectDialog.dialog( "close" );
  }
	      }
	      
	});
	
	$("#lineColourSelect").children().prop('disabled','disabled');
	$("#lineStrokeSelect").children().prop('disabled','disabled');
	
	
	
	$("#entity1Single").click(function(){
		var entity = $("#entity1Select").val();
		if(entity != ""){
			selectedEntityNo = 1;
			openSelectSingleDialog(entity, 1);
		}	
	});
	$("#entity2Single").click(function(){
		var entity = $("#entity2Select").val();
		if(entity != ""){
		selectedEntityNo = 2;
		openSelectSingleDialog(entity,2);
		}
	
	});
	$("#entity3Single").click(function(){
		var entity = $("#entity3Select").val();
		if(entity != ""){
		selectedEntityNo = 3;
		openSelectSingleDialog(entity,3);
		}

	});
	
	$("#entity1Select").change(function(){
		var entity = $("#entity1Select").val();
		if($("input:radio[name=entity1]:checked").val() != "All"){
			selectedEntityNo = 1;
			openSelectSingleDialog(entity,1);
		}
		if(entity == ""){
			$("#entity2Select").prop("disabled", true);
			$("input:radio[name=entity2]").prop("disabled", true);
		}
		else{
			$("input:radio[name=entity2]").removeAttr("disabled");
			$("#entity2Select").removeAttr("disabled");
			$("#entity2Select option").removeAttr('disabled');
			$("#entity2Select option[value=" + entity + "]").attr('disabled','disabled');
		}
		
	});
	
	$("#entity2Select").change(function(){
		var entity1 = $("#entity1Select").val();
		var entity2 = $("#entity2Select").val();
		
		if($("input:radio[name=entity2]:checked").val() != "All"){
			selectedEntityNo = 2;
			openSelectSingleDialog(entity2,2);
		}
		if(entity2 == ""){
			$("#entity3Select").prop("disabled", true);
			$("input:radio[name=entity3]").prop("disabled", true);
			$("#addLineStyle").prop("disabled", true);
		}
		else{
			$("#entity3Select").removeAttr("disabled");
			$("input:radio[name=entity3]").removeAttr("disabled");
			$("#entity3Select option").removeAttr('disabled');
			$("#addLineStyle").removeAttr('disabled');
			$("#entity3Select option[value=" + entity1 + "]").attr('disabled','disabled');
			$("#entity3Select option[value=" + entity2 + "]").attr('disabled','disabled');
		}
	});
	
	$("#entity3Select").change(function(){
		if($("input:radio[name=entity3]:checked").val() != "All"){
			var entity = $("#entity3Select").val();
			selectedEntityNo = 3;
			openSelectSingleDialog(entity,3);
		}
	});
	
	$("#addLineStyle").click(function(){
		  
		  var lineStyles = {};
		  lineStyles["id"] = ++no_of_styles + "" + new Date().getTime();
		  lineStyles["isOneSingle"] = false;
		  lineStyles["isTwoSingle"] = false;
		  lineStyles["isThreeSingle"] = false;
		  lineStyles["noOfSingle"] = 0;	
		  
		  var selectedEntity1;
		  var selectedEntity2;
		  var selectedEntity3;
		  
		  
		  if($("#entity1Select").val() != ""){
			  
			  selectedEntity1 = $("#entity1Select").val();
			  if($("input:radio[name=entity1]:checked").val() == "All"){
				  lineStyles["entityOne"] = $("#entity1Select").val();
			  }
			  else{
				  lineStyles["entityOne"] = $("#entity1Select").val();
				  lineStyles["isOneSingle"] = true;
				  lineStyles["singleOne"] = $("#entity1SingleValue").html();
				  lineStyles["noOfSingle"] = lineStyles["noOfSingle"] + 1;
			  }
		  }
		  if($("#entity2Select").val() != ""){
			  selectedEntity2 = $("#entity2Select").val();
			  
			  if($("input:radio[name=entity2]:checked").val() == "All"){
				  lineStyles["entityTwo"] = $("#entity2Select").val();
			  }
			  else{
				  lineStyles["entityTwo"] = $("#entity2Select").val();
				  lineStyles["isTwoSingle"] = true;
				  lineStyles["singleTwo"] = $("#entity2SingleValue").html();
				  lineStyles["noOfSingle"] = lineStyles["noOfSingle"] + 1;
			  }
			  
			  if(selectedEntity1 == "Miscellaneous"){
				  selectedEntity1 = "Misc";
			  }
			  if(selectedEntity1 == "Non-Entity"){
				  selectedEntity1 = "nonEntity";
			  }
			  if(selectedEntity2 == "Miscellaneous"){
				  selectedEntity2 = "Misc";
			  }
			  if(selectedEntity2 == "Non-Entity"){
				  selectedEntity2 = "nonEntity";
			  }
			  
			  lineStyles["combinationID1"] = entityCombinationArray[getEntityIdentifier(selectedEntity1)][getEntityIdentifier(selectedEntity2)];
		  }
		  if($("#entity3Select").val() != ""){
			  selectedEntity3 = $("#entity3Select").val();
			  if($("input:radio[name=entity3]:checked").val() == "All"){
				  lineStyles["entityThree"] = $("#entity3Select").val();
			  }
			  else{
				  lineStyles["entityThree"] = $("#entity3Select").val();
				  lineStyles["isThreeSingle"] = true;
				  lineStyles["singleThree"] = $("#entity3SingleValue").html();
				  lineStyles["noOfSingle"] = lineStyles["noOfSingle"] + 1;
			  }
			  
			  if(selectedEntity3 == "Miscellaneous"){
				  selectedEntity3 = "Misc";
			  }
			  if(selectedEntity3 == "Non-Entity"){
				  selectedEntity3 = "nonEntity";
			  }
			  lineStyles["combinationID2"] = entityCombinationArray[getEntityIdentifier(selectedEntity2)][getEntityIdentifier(selectedEntity3)];
		  }
		 
		  
		  //var color =  $("#colourSelect").val();
		  var color = $("#lineColourSelected").css( "background-color" );
		  var lineStyle ;
		  var lineStyleImage = $("#lineStorkeSelected").css( "background-image" );
		  
		  lineStyleImage = ((lineStyleImage.split("/")[5]).split("."))[0];
		  
		  if(lineStyleImage == "10"){
			  lineStyle = "1 0";
		  }
		  if(lineStyleImage == "22"){
			  lineStyle = "2 2";
		  }
			  
		   if(lineStyleImage == "63"){
			   lineStyle = "6 3";
		   }
			 
		  if(lineStyleImage == "8343"){
			  lineStyle = "8 3 4 3";
		  }
		   if(lineStyleImage == "6828"){
			  lineStyle = "6 8 2 8";
		   }
//		  else 
//			  lineStyle = "1 0";
		  
		  lineStyles["linecolor"] = color;
		  lineStyles["lineStyle"] = lineStyle;
		  lineStyles["lineStyleBgImage"] = lineStyleImage;
		  
		 // dataView.addItem(lineStyles);
		  
		  $.ajax({
				type: 'POST',
				dataType: 'application/x-www-form-url',
				data: {
						"analystID" : workerId,
						"style" : JSON.stringify(lineStyles)
				},
				url: '/users/addLineStyle',
				async: false,
				complete : function(data){
					loadLineStyleTable(workerId);
					getLinks(false);
					/*console.log("selects -- " + selects);
					if(!(selects == null || selects == undefined || selects == ""))
						getWorkersLinks(selects+","+workerId);*/
					}
			});
	  	$("#entity1Select").prop('selectedIndex',0);
	  	$("#entity2Select").prop('selectedIndex',0);
	  	$("#entity3Select").prop('selectedIndex',0);
	  	
	  	$("#entity2Select").attr('disabled','disabled');
	  	$("#entity3Select").attr('disabled','disabled');


	  	$("#entity1SingleValue").html("");
	  	$("#entity2SingleValue").html("");
	  	$("#entity3SingleValue").html("");
	  	
	  	$('input:radio[name=entity1]')[1].checked = true;
	  	$('input:radio[name=entity2]')[1].checked = true;
	  	$('input:radio[name=entity3]')[1].checked = true;
	  	
	  	
		  
	  });
	
	
	$("#lineColorSelectButton").click(function(){
		if($("#lineColorSelectOptions").hasClass("line-color-select-options-show")){
		    $("#lineColorSelectOptions").addClass("line-color-select-options-hide");
		    $("#lineColorSelectOptions").removeClass("line-color-select-options-show");
		}
		else{
			$("#lineColorSelectOptions").addClass("line-color-select-options-show");
		    $("#lineColorSelectOptions").removeClass("line-color-select-options-hide");
		}
		
	});
	$("#lineStrokeSelectButton").click(function(){
		if($("#lineStrokeSelectOptions").hasClass("line-stroke-select-options-show")){
		    $("#lineStrokeSelectOptions").addClass("line-stroke-select-options-hide");
		    $("#lineStrokeSelectOptions").removeClass("line-stroke-select-options-show");
		}
		else{
			$("#lineStrokeSelectOptions").addClass("line-stroke-select-options-show");
		    $("#lineStrokeSelectOptions").removeClass("line-stroke-select-options-hide");
		}
		
	});
	$("#lineColorBlue").click(function(){
		$("#lineColourSelected").css("background-color", "blue");
		$("#lineColorSelectOptions").addClass("line-color-select-options-hide");
	    $("#lineColorSelectOptions").removeClass("line-color-select-options-show");
	    
	});
	$("#lineColorGreen").click(function(){
		$("#lineColourSelected").css("background-color", "Green");
		$("#lineColorSelectOptions").addClass("line-color-select-options-hide");
	    $("#lineColorSelectOptions").removeClass("line-color-select-options-show");
	    
	});
	$("#lineColorBrown").click(function(){
		$("#lineColourSelected").css("background-color", "Brown");
		$("#lineColorSelectOptions").addClass("line-color-select-options-hide");
	    $("#lineColorSelectOptions").removeClass("line-color-select-options-show");
	    
	});
	$("#lineColorGold").click(function(){
		$("#lineColourSelected").css("background-color", "Gold");
		$("#lineColorSelectOptions").addClass("line-color-select-options-hide");
	    $("#lineColorSelectOptions").removeClass("line-color-select-options-show");
	    
	});
	$("#lineColorPurple").click(function(){
		$("#lineColourSelected").css("background-color", "Purple");
		$("#lineColorSelectOptions").addClass("line-color-select-options-hide");
	    $("#lineColorSelectOptions").removeClass("line-color-select-options-show");
	    
	});
	
	$("#lineColorRed").click(function(){
		$("#lineColourSelected").css("background-color", "Red");
		$("#lineColorSelectOptions").addClass("line-color-select-options-hide");
	    $("#lineColorSelectOptions").removeClass("line-color-select-options-show");
	    
	});
	
	$("#lineStroke10").click(function(){
		$("#lineStorkeSelected").css("background-image", "url(/img/lineStyle/10.jpg)");
		$("#lineStrokeSelectOptions").addClass("line-stroke-select-options-hide");
	    $("#lineStrokeSelectOptions").removeClass("line-stroke-select-options-show");
	    
	});
	
	$("#lineStroke22").click(function(){
		$("#lineStorkeSelected").css("background-image", "url(/img/lineStyle/22.jpg)");
		$("#lineStrokeSelectOptions").addClass("line-stroke-select-options-hide");
	    $("#lineStrokeSelectOptions").removeClass("line-stroke-select-options-show");
	    
	});
	$("#lineStroke63").click(function(){
		$("#lineStorkeSelected").css("background-image", "url(/img/lineStyle/63.jpg)");
		$("#lineStrokeSelectOptions").addClass("line-stroke-select-options-hide");
	    $("#lineStrokeSelectOptions").removeClass("line-stroke-select-options-show");
	    
	});
	
	$("#lineStroke8343").click(function(){
		$("#lineStorkeSelected").css("background-image", "url(/img/lineStyle/8343.jpg)");
		$("#lineStrokeSelectOptions").addClass("line-stroke-select-options-hide");
	    $("#lineStrokeSelectOptions").removeClass("line-stroke-select-options-show");
	    
	});
	$("#lineStroke6828").click(function(){
		$("#lineStorkeSelected").css("background-image", "url(/img/lineStyle/6828.jpg)");
		$("#lineStrokeSelectOptions").addClass("line-stroke-select-options-hide");
	    $("#lineStrokeSelectOptions").removeClass("line-stroke-select-options-show");
	    
	});
});

function openSelectSingleDialog(entity, entityNo){
	var entityList=[];
	$.getJSON("/users/getAllLinks",function(data){
		$.each( data, function( key, val ) {
			if(val.link != undefined){
				for(var i=0;i<val.link.length;i++){
					if(val.link[i].sourceNode.entityType == entity){
						if(($.inArray( val.link[i].sourceNode.node, entityList )) == -1)
							entityList.push(val.link[i].sourceNode.node)
					}
					if(val.link[i].targetNode.entityType == entity){
						if(($.inArray( val.link[i].targetNode.node, entityList )) == -1)
							entityList.push(val.link[i].targetNode.node)
					}
					
				}
			}
		});
		
		$('#singleEntitySlect').empty();
		for(var i=0; i<entityList.length;i++){
			$('#singleEntitySlect').append($('<option>', { 
		        value:entityList[i],
		        text : entityList[i] 
		    }));
		}
		entitySelectDialog.dialog("open");
	});
}

function loadLineStyleTable(workerId){
	
	$.getJSON('/users/lineStyles/'+workerId, function(data) {
		processLineStyleData(data[0]);
		
	});
}

function processLineStyleData(data){
	if(data != undefined && data.styles != undefined && data.styles.length > 0 ){
		/*for(var i=0; i< data.styles.length; i++){
			if(no_of_styles <= data.styles[i].id )
				no_of_styles = data.styles[i].id;
		}*/
	//	no_of_styles = data.styles.length;
		lineStyleData = data.styles;
     	drawLineStyleTable(data.styles);
	}
}

function drawLineStyleTable(data){
	$("#lineStyleViewContainer").addClass("active");
	var dataView = new Slick.Data.DataView()	
	dataView.setItems(data);
	
	var grid;
	
	var columns = [
		            {id: "styleDelete", name: "", width: 40, cssClass: "cell-title", formatter: Slick.Formatters.Link, width: 20 },
		       	    {id: "entity1", name: "Entity Type 1", field: "entityOne", width: 130},
		       	    {id: "single1", name: "Entity 1", field: "singleOne", width: 130},
		       	    {id: "entity2", name: "Entity Type 2", field: "entityTwo", width: 130 },
		       	    {id: "single2", name: "Entity 2", field: "singleTwo", width: 130},
		       	    {id: "entity3", name: "Entity Type 3", field: "entityThree", width: 130},
		       	    {id: "single3", name: "Entity 3", field: "singleThree", width: 130},
		       	    {id: "lineColorcol", name: "Color", field: "linecolor", width: 110, formatter:Slick.Formatters.bgColor},
		       	    {id: "lineStyleCol", name: "Style", field: "lineStyleBgImage", width: 110, formatter:Slick.Formatters.bgImage}
		       	  ];
	var options = {
		    		rowHeight: 30,
		  		  };
	
	 $(function () {
		 grid = new Slick.Grid("#lineStylePlace", dataView, columns, options);
		 
		 grid.invalidate();
	     grid.render();
	     grid.resizeCanvas();
	     
		 grid.onClick.subscribe(function (e) {
		 var cell = grid.getCellFromEvent(e);
		      
		      
		     if (grid.getColumns()[cell.cell].id == "styleDelete") {
		        if (!grid.getEditorLock().commitCurrentEdit()) {
		          return;
		        }
		        var item = dataView.getItem(cell.row);//RowNum is the number of the row
		        
		        var RowID = item.id;
		        
		        $.ajax({
					type: 'POST',
					dataType: 'application/x-www-form-url',
					data: {
							"workerId" : workerId,
							"id" : Number(item.id),
					},
					url: '/users/deleteLineStyle',
					async: false,
					complete : function(data){
						getLinks(false);
						/*if(!(selects == null || selects == "" || selects == undefined)){
							getWorkersLinks(selects+","+workerId);
						}*/							
					}
				});
		        
		        dataView.deleteItem(RowID);
		    	grid.invalidate();
		    	grid.render();
		    	grid.resizeCanvas();
		        e.stopPropagation();
		      }
		    });
	 });
	 
	 grid.invalidate();
     grid.render();
     grid.resizeCanvas();

		if($("#graphContainer").hasClass("active")){
			$("#lineStyleViewContainer").removeClass("active");
		}
}
	
