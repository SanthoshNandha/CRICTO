/* 
	*Author: Santhosh Nandhakumar
	*emailid: nsanthosh2409@gmail.com
*/

function drawEditViewTable(rows){
	d3.select("#editView").remove();
	d3.select("#editViewContainer").insert("div").attr("id","editView").attr("class","edit-place");
	
	var dataView = new Slick.Data.DataView();
	
	dataView.setItems(rows);
	var grid;
	//  var data = [];
	  var columns = [
	    { id: "delete", name: "",cssClass: "cell-title", formatter: Slick.Formatters.Link, width: 10 },
	    {id: "sourceNode", name: "SourceName", field: "sourceNode", sortable: true, sortable: true, width: 200},
	    /* {id: "sourceType", name: "SourceType", field: "sourceType", sortable: true, sortable: true, width: 80}, */
	    {id: "description", name: "Description", field: "description", editor: Slick.Editors.Text, sortable: true, sortable: true, width: 250 },
	    {id: "targetNode", name: "TargetNode", field: "targetNode", sortable: true, sortable: true, width: 200 },
	   /*  {id: "targetType", name: "TargetType", field: "targetType", sortable: true, sortable: true, width: 80 }, */
	    {id: "startDate", name: "StartDate", field: "startDate", editor: Slick.Editors.Date, sortable: true, sortable: true, width: 80 },
	    {id: "endDate", name: "EndDate", field: "endDate", editor: Slick.Editors.Date, sortable: true, sortable: true, width: 80 },
	    /* {id: "workerId", name: "WorkerID", field: "workerId", sortable: true, width: 160},
	    {id: "linkNo", name: "LinkNo", field: "linkNo", sortable: true, width:50} */
	  ];
	  var options = {
	    editable: true,
	    enableAddRow: false,
	    enableCellNavigation: true,
	    asyncEditorLoading: false,
	    rowHeight: 30,
	    enableCellNavigation: true,
	    enableColumnReorder: false,
	    multiColumnSort: true
	  };
	  $(function () {
	    /*for (var i = 0; i < 100; i++) {
	      var d = (data[i] = {});
	      d["title"] = "Task " + i;
	      d["priority"] = "Medium";
	    }*/
	    grid = new Slick.Grid("#editView", dataView, columns, options);
	    
	   /* grid.onContextMenu.subscribe(function (e) {
	      e.preventDefault();
	      var cell = grid.getCellFromEvent(e);
	      $("#contextMenu")
	          .data("row", cell.row)
	          .css("top", e.pageY)
	          .css("left", e.pageX)
	          .show();
	      $("body").one("click", function () {
	        $("#contextMenu").hide();
	      });
	    });*/
	    
	    grid.onCellChange.subscribe(function (e, args) {
	    	var cell = args;
	    	console.log(cell);
	    	var item = args.item;
	    	
	    	if (grid.getColumns()[cell.cell].id == "description") {
	    		$.ajax({
					type: 'POST',
					dataType: 'application/x-www-form-url',
					data: {
							"workerId" : item.workerId,
							"linkNo" : Number(item.linkNo),
							"newDescpription" : item.description,
							"editedBy":workerId
					},
					url: '/users/updateDescription',
					complete : function(data){
						//getWorkersLinks(selects+","+workerId);
						getLinks(false);
					}
				});	
	    	}
	    	if (grid.getColumns()[cell.cell].id == "startDate") {
	    		$.ajax({
					type: 'POST',
					dataType: 'application/x-www-form-url',
					data: {
							"workerId" : item.workerId,
							"linkNo" : Number(item.linkNo),
							"newStartDate" : Number(+(new Date(item.startDate))),
							"editedBy":workerId
					},
					url: '/users/updateStartDate',
					complete : function(data){
						//getWorkersLinks(selects+","+workerId);
						getLinks(false);
					}
				});
	    		
	    	}
	    	
	    	if (grid.getColumns()[cell.cell].id == "endDate") {
	    		$.ajax({
					type: 'POST',
					dataType: 'application/x-www-form-url',
					data: {
							"workerId" : item.workerId,
							"linkNo" : Number(item.linkNo),
							"newEndDate" : Number(+(new Date(item.endDate))),
							"editedBy":workerId
					},
					url: '/users/updateEndDate',
					complete : function(data){
						//getWorkersLinks(selects+","+workerId);
						getLinks(false);
					}
				});
	    		
	    	}
	    });
	    
	   grid.onClick.subscribe(function (e) {
	      var cell = grid.getCellFromEvent(e);
	      
	      
	     if (grid.getColumns()[cell.cell].id == "delete") {
	        if (!grid.getEditorLock().commitCurrentEdit()) {
	          return;
	        }
	        var item = dataView.getItem(cell.row);//RowNum is the number of the row
	        
	        console.log(JSON.stringify(item));
	        var RowID = item.id
	        
	        $.ajax({
				type: 'POST',
				dataType: 'application/x-www-form-url',
				data: {
						"workerId" : item.workerId,
						"linkNo" : Number(item.linkNo),
				},
				url: '/users/deleteLink',
				async: false,
				complete : function(data){
					getWorkersLinks(selects+","+workerId);
				}
			});
	        
	        dataView.deleteItem(RowID);
	    	grid.invalidate();
	    	grid.render();
	        e.stopPropagation();
	      }
	    });
	   
	   grid.onSort.subscribe(function (e, args) {
		      var cols = args.sortCols;
		      dataView.sort(function (dataRow1, dataRow2) {
		        for (var i = 0, l = cols.length; i < l; i++) {
		          var field = cols[i].sortCol.field;
		          var sign = cols[i].sortAsc ? 1 : -1;
		          var value1 = dataRow1[field], value2 = dataRow2[field];
		          var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
		          if (result != 0) {
		            return result;
		          }
		        }
		        return 0;
		      });
		      grid.invalidate();
		      grid.render();
		    });
	  });
} 

