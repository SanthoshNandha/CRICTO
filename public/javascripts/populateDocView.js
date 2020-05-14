/* 
	*Author: Santhosh Nandhakumar
	*emailid: nsanthosh2409@gmail.com
*/

// Application level variable

var queue = [];

function populateAllDocs(){
	$.getJSON("/docs/alldocs",function(data){
		buildDocView(data, 'userList', false, false, true, false);
	})
	.fail(function(err){
		console.log("Error in fetching all documents. Status: " + err.status);
	});
}

/**
 * This function get the documents and their enties and populate the docs in the doc view.
 * Used to populate docs in doc view and bookmarked column
 * @param {array} data - Array of document objects
 * @param {String} divName - The id of the div in which docs are need to be populated
 * @param {boolean} isPrimary - True If building the primary document for the workers else False
 * @param {boolean} isScrap - True If building the scrap section else False
 * @param {boolean} isAnalyst - True If building the documents for analysts else False
 * @param {boolean} isBookMark - True if building the bookmark section of the document view else False 
 */

function buildDocView(data, divName, isPrimary,isScrap,isAnalyst,isBookMark){
	
	// Check if build request from bookmark section
	if(!isBookMark){
		$("#"+divName).empty();
	}
		
	if(!(isPrimary) && !(isScrap) && !(isAnalyst) && !(isBookMark)){
		if(data.length == 1 || data == null|| data == undefined){
			$("#"+divName).html("<hr><h5>There are no related document found !!! <br> Click NEXT to get a new document </h5>");
			return false;
		}
	} 
		
	$.each(data, function() {

		var Dat  = []; 
		var Money = '';
		var Misc = '';
		var Person = '';
		var Organization = '';
		var Location = '';
		var Phone = '';
            
		if (this.Organization != undefined) {
			Organization += this.Organization;
		}
		if (this.Location != undefined) {
			Location += this.Location;
		}
		if (this.Person != undefined) {
			Person += this.Person;
		}
		if (this.Money != undefined) {
			Money += this.Money+' ';
		}
		if (this.Misc != undefined) {
			Misc += this.Misc;
		}
		if (this.Phone != undefined) {
			Phone += this.Phone;
		}
		if (this.Date != undefined) {
			if((this.Date).constructor === Array){
				var d = this.Date;
				$.each(d , function(){
					Dat.push(this);
				})
			}
			else{
				Dat.push(this.Date);
			}
		}
			
		var newdiv = document.createElement('div');
		newdiv.id = '' + this.docID + '';
		newdiv.className = '' + "docs-div" + '';
            
		if(isPrimary){
			primaryDocID = newdiv.id;
			newdiv.innerHTML = "<span style=\"float:right\"><button id = 'getRelatedDocsButton'class = 'btn btn-default btn-xs relatedDocsButton'> Get Related Documents </button></span><b> " + this.docID + " :</b> " + this.docText + " <br>";
		}
		else if(isScrap){
			for (var i = 0 ; i < this.keywords.length ; i++) {
				var keyword = this.keywords[i];
				var newdiv = document.createElement('div');
				newdiv.id = '' + this.keywords[i].entity + i;
				newdiv.className = "pull-left";                    
				newdiv.innerHTML = "<span class='btn btn-default btn-xs scrap-keyword-delete'><i class='icon-remove'></i></span><span>" + keyword.entity + "</span> ";
				document.getElementById(divName).appendChild(newdiv);
				nonEntityHiglight('' + this.keywords[i].entity + i,false);
			}
				
		}
		else if(isAnalyst){
			newdiv.innerHTML = "<span style=\"float:right\"><span id = 'getDocLinks' class = 'get-doc-graphs'> <i class='icon-chevron-right'></i> </span></span>" + 
					"<span><span class = 'bookmarkButton btn btn-default btn-xs'><i class='icon-bookmark'></i></button></span>" +
					"<para> <b> " + this.docID + ":</b> " + this.docText + " <br>";
		}
		else if(isBookMark){
			newdiv.innerHTML = "<span style=\"float:right\"><span class = 'bookmarkClearButton'> <i class='icon-remove'></i> </span></span>" + "<para> <b> " + this.docID + " : </b>  " + this.docText + " <br>";
			newdiv.setAttribute("original-div-id",this.docID );
			this.docID = this.docID + "_bookmarked";
			newdiv.id = '' + this.docID + '';
		}
		else{
				newdiv.innerHTML = "<span style=\"float:right\"></span><hr><b> " + this.docID + " </b><br> " + this.docText + " <br>";
		}
            
		if(!(isPrimary)){
			if(newdiv.id === primaryDocID){
				return false;
			}
		} 
            	
        document.getElementById(divName).appendChild(newdiv);
		if(isAnalyst){
			if($.inArray( this.docID, bookMarkDocs ) != -1){
				$("#"+this.docID+" .bookmarkButton").children(".fa-bookmark").addClass("bookmarked-doc");
			} 
		}
            	
        nonEntityHiglight('' + this.docID + '',false);
            	
		if(isScrap){
			$(".scrap-keyword-delete").click(function(){
				$(this).parent().remove();
			});
			
		}
            	
		var Loc = Location.split(',');
		var Per = Person.split(',');
		var Org = Organization.split(',');
		var Mon = Money.split(' ');
		var Mis = Misc.split(',');
		var Pho = Phone.split(",");
		var id = this.docID;
    			
		//Code to highllight entities and jQuery function to highlight(Same code repreated for different entities)
		for (var i = 0; i < Per.length; i++) {
			$('#' + this.docID + "").highlight(Per[i], {className: 'Person Person_'+this.docID+'_'+i+' drag' + ' ' + Per[i].split(" ").join("")});
			var doc = this.docID;
			$('.'+'Person_'+this.docID+'_'+i).click(function(e){
				e.stopPropagation();
				if (!$(this).hasClass('ent_highlighted')) {
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					if(elementPos == -1){
						queue.push({
							selection : $(this).text(),
							classname : $(e.target).prop('class'),
							docID : doc,
							Type : "Person"
						});
						$(this).addClass('ent_highlighted');
					}
					
					if(queue.length >= 3){
						var temp = queue.shift();
						var cls = temp.classname.split(" ");
						if($('#'+temp.docID).find('.'+cls[1]).hasClass('ent_highlighted')){
							$('#'+temp.docID).find('.'+cls[1]).removeClass('ent_highlighted');
						}
						else{
						$('#'+temp.docID).unhighlight({className : cls[1]});
						}			
					}
					
				}
				else {
					//remove highlight
					$(this).removeClass('ent_highlighted');
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					queue.splice(elementPos,1);
				}
			});
		}
    				
		for (var i = 0; i < Org.length; i++) {
			$('#' + this.docID + '').highlight(Org[i], {className :'Organization Organization_'+this.docID+'_'+i+' drag'+ ' ' + Org[i].split(" ").join("")});
			$('.'+'Organization_'+this.docID+'_'+i).click(function(e){
				e.stopPropagation();
				if (!$(this).hasClass('ent_highlighted')) {
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					if(elementPos == -1){
						queue.push({
							selection : $(this).text(),
							classname : $(e.target).prop('class'),
							docID : doc,
							Type : "Organization"
						});
					$(this).addClass('ent_highlighted');
					}
					else{}
					if(queue.length >= 3){
						var temp = queue.shift();
						var cls = temp.classname;
						cls = cls.split(" ");
						if($('#'+temp.docID).find('.'+cls[1]).hasClass('ent_highlighted')){
							$('#'+temp.docID).find('.'+cls[1]).removeClass('ent_highlighted');
						}
						else{
						$('#'+temp.docID).unhighlight({className : cls[1]});
						}
					}
					
				}
				else {
					//remove highlight
					$(this).removeClass('ent_highlighted');
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					queue.splice(elementPos,1);
				}
			});
		}
    				
		for (var i = 0; i < Dat.length; i++) {
			$('#' + this.docID + "").highlight(Dat[i], {className: 'Date Date_'+this.docID+'_'+i+' drag'+ ' ' + Dat[i].split(" ").join("")});
			$('.'+'Date_'+this.docID+'_'+i).click(function(e){
				e.stopPropagation();
				if (!$(this).hasClass('ent_highlighted')) {
					isEntityDate = true;
					queue.push({
						selection : $(this).text(),
						classname : $(e.target).prop('class'),
						docID : doc,
						Type : "Date"
					});
					
					if(queue.length >= 3){
						isEntityDate = false;
						var temp = queue.shift();
						var cls = temp.classname.split(" ");
						if($('#'+temp.docID).find('.'+cls[1]).hasClass('ent_highlighted')){
							$('#'+temp.docID).find('.'+cls[1]).removeClass('ent_highlighted');
						}
						else{
							$('#'+temp.docID).unhighlight({className : cls[1]});
						}			
					}
					$(this).addClass('ent_highlighted');
				}
				else {
					isEntityDate = false;
					//remove highlight
					$(this).removeClass('ent_highlighted');
				}
			});
		}
    				
		for (var i = 0; i < Pho.length; i++) {
			$('#' + this.docID + "").highlight(Pho[i], {className: 'Phone Phone_'+this.docID+'_'+i+' drag'+ ' ' + Pho[i].split(" ").join("")});
			var doc = this.docID;
			$('.'+'Phone_'+this.docID+'_'+i).click(function(e){
				e.stopPropagation();
				if (!$(this).hasClass('ent_highlighted')) {
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					if(elementPos == -1){
						queue.push({
							selection : $(this).text(),
							classname : $(e.target).prop('class'),
							docID : doc,
							Type : "Phone"
						});
						$(this).addClass('ent_highlighted');
					}
					else{}
					if(queue.length >= 3){
						var temp = queue.shift();
						var cls = temp.classname.split(" ");
						if($('#'+temp.docID).find('.'+cls[1]).hasClass('ent_highlighted')){
							$('#'+temp.docID).find('.'+cls[1]).removeClass('ent_highlighted');
						}
						else{
							$('#'+temp.docID).unhighlight({className : cls[1]});
						}			
					}
						
				}
				else {
					//remove highlight
					$(this).removeClass('ent_highlighted');
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					queue.splice(elementPos,1);
				}
			});
		}

		for (var i = 0; i < Loc.length; i++) {
			$('#' + this.docID + '').highlight(Loc[i], {className :'Location Location_'+this.docID+'_'+i+' drag'+ ' ' + Loc[i].split(" ").join("")});
			$('.'+'Location_'+this.docID+'_'+i).click(function(e){
				e.stopPropagation();
				if (!$(this).hasClass('ent_highlighted')) {
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					if(elementPos == -1){
						queue.push({
							selection : $(this).text(),
							classname : $(e.target).prop('class'),
							docID : doc,
							Type : "Location"
						});
						$(this).addClass('ent_highlighted');
					}
					else{}
					if(queue.length >= 3){
						var temp = queue.shift();
						var cls = temp.classname;
						cls = cls.split(" ");
						if($('#'+temp.docID).find('.'+cls[1]).hasClass('ent_highlighted')){
							$('#'+temp.docID).find('.'+cls[1]).removeClass('ent_highlighted');
						}
						else{
							$('#'+temp.docID).unhighlight({className : cls[1]});
						}
					}
				}
				else {
					$(this).removeClass('ent_highlighted');
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					queue.splice(elementPos,1);
				}
			});
		}

		for(var i=0;i<Mon.length;i++){
		$('#'+this.docID+'').highlight(Mon[i], {className :'Money Money_'+this.docID+'_'+i+' drag'+ ' ' + Mon[i].split(" ").join("")});
		$('.'+'Money_'+this.docID+'_'+i).click(function(e){
			e.stopPropagation();
				if (!$(this).hasClass('ent_highlighted')) {
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					if(elementPos == -1){
						queue.push({
							selection : $(this).text(),
							classname : $(e.target).prop('class'),
							docID : doc,
							Type : "Money"
						});
						$(this).addClass('ent_highlighted');
					}
					else{}
					if(queue.length >= 3){
						var temp = queue.shift();
						var cls = temp.classname;
						cls = cls.split(" ");
						if($('#'+temp.docID).find('.'+cls[1]).hasClass('ent_highlighted')){
							$('#'+temp.docID).find('.'+cls[1]).removeClass('ent_highlighted');
						}
						else{
						$('#'+temp.docID).unhighlight({className : cls[1]});
						}
					}
				}
				else {
					$(this).removeClass('ent_highlighted');
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					queue.splice(elementPos,1);
				}
			});
		}
    				
		for(var i=0;i<Mis.length;i++){
		$('#'+this.docID+'').highlight(Mis[i], {className :'Misc Misc_'+this.docID+'_'+i+' drag'+ ' ' + Mis[i].split(" ").join("")});
		$('.'+'Misc_'+this.docID+'_'+i).click(function(e){
			e.stopPropagation();
				if (!$(this).hasClass('ent_highlighted')) {
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					if(elementPos == -1){
						queue.push({
							selection : $(this).text(),
							classname : $(e.target).prop('class'),
							docID : doc,
							Type : "Misc"
						});
						$(this).addClass('ent_highlighted');
					}
					else{}
					if(queue.length >= 3){
						var temp = queue.shift();
						var cls = temp.classname;
						cls = cls.split(" ");
						if($('#'+temp.docID).find('.'+cls[1]).hasClass('ent_highlighted')){
							$('#'+temp.docID).find('.'+cls[1]).removeClass('ent_highlighted');
						}
						else{
						$('#'+temp.docID).unhighlight({className : cls[1]});
						}
					}
				}
				else {
					$(this).removeClass('ent_highlighted');
					var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
					queue.splice(elementPos,1);
				}
			});
		}
    				
		// For worker view
		/* if(isPrimary){
			buildfrequencyView();
		} */
            
		$(function() {
			$( ".drag" ).draggable({
				addClasses: false,
				helper: "clone"
			});
		});
	});

	if(isAnalyst){
		buildGetDocLinks();
		buildBookmarkView();
	}

	if(isBookMark){
			$(".bookmarkClearButton").click(function(e){
				e.stopPropagation();
				var parentId = $(this).parent().parent().attr("original-div-id")
				$("#"+$(this).parent().parent().attr("original-div-id")+ " span .bookmarkButton").children(".fa-bookmark").removeClass("bookmarked-doc");
				$(this).parent().parent().remove();
				bookMarkDocs = $.grep(bookMarkDocs, function(value) {
					return value != parentId;
				});

				if($("#searchResult").children().length == 0){            		
					$("#userList").removeClass("analyst-document-view-small");
					$("#userList").addClass("analyst-document-view-normal");                	
					$("#searchResult").removeClass("searchResult-normal-show");
					$("#searchResult").addClass("searchResult-normal-hide");
					$("#userList").find(".bookmarkButton").each(function(index){
						$(this).children(".fa-bookmark").removeClass("bookmarked-doc");
					});
				}
			});
			nonEntityHiglight("searchResult",true);
	}
}

function nonEntityHiglight(divName,isBookmark){
	$("#"+divName).click(function(e) {
		e.stopPropagation();
        try {
            s = window.getSelection();
            var range = s.getRangeAt(0);
            var node = s.anchorNode;
            while (range.toString().indexOf(' ') != 0 && range.toString().indexOf('[') != 0) {
                range.setStart(node, (range.startOffset - 1));
            }
            range.setStart(node, range.startOffset + 1);
            do {
                if (range.toString().indexOf(',') != -1) {
                    range.setEnd(node, range.endOffset - 1);
                    break;
                }
                if (range.toString().indexOf(':') != -1) {
                    range.setEnd(node, range.endOffset - 1);
                    break;
                }
                if (range.toString().indexOf("'") != -1) {
                    range.setEnd(node, range.endOffset - 1);
                    break;
                }
                if (range.toString().indexOf('.') != -1) {
                    range.setEnd(node, range.endOffset - 1);
                    break;
                }
                if (range.toString().indexOf(';') != -1) {
                    range.setEnd(node, range.endOffset - 1);
                    break;
                }
                if (range.toString().indexOf(']') != -1) {
                    range.setEnd(node, range.endOffset - 1);
                    break;
                }
                if (range.toString().indexOf('/') != -1) {
                    range.setEnd(node, range.endOffset - 1);
                    break;
                }
                if (range.toString().indexOf(' ') != -1) {
                    range.setEnd(node, range.endOffset - 2);
                    break;
                }
                range.setEnd(node, range.endOffset + 1);
            } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
            var str = range.toString().trim();
            str = str.replace(/\b[-.,()&#!\[\]{}"']+\B|\B[-.,()&#!\[\]{}"']+\b/g, '');
            
            var clicked = e.target;
            var currentID = clicked.id || (clicked.parentElement.id) || (clicked.parentElement.parentElement.id) ;
            
    		if(stop_words.indexOf(str) !== -1){
    			alert("stop word");
    		}
    		else{
    		
    		$("#"+divName).highlight(str, {className:'highlighted '+str});
    		
    		var elementPos = queue.map(function(x) {return x.selection; }).indexOf(str);
    		
    		if(elementPos == -1){
    		queue.push({
    			selection : str,
    			classname : 'highlighted '+str,
    			docID : currentID,
    			Type : "nonEntity"
    				});
    		}
    		
    		if(queue.length >= 3){
    			var temp = queue.shift();
    			var cls = temp.classname;
    			cls = cls.split(" ");
    			if($('#'+temp.docID).find('.'+cls[1]).hasClass('ent_highlighted')){
						$('#'+temp.docID).find('.'+cls[1]).removeClass('ent_highlighted');
					
    			}
    			else{
    				$('#'+temp.docID).unhighlight({className : cls[1]});
    			}
    			}
    		}
    		
            $('.highlighted').click(function(e) {
            	e.stopPropagation();
    			var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
    			queue.splice(elementPos,1);
    			$("#"+divName).unhighlight({className:$(this).text().split(" ")[0]});
            });
        } 
        catch (e) {
        }
    });
}


/******* End of File *************/


var docCount = 0;

var Dat = [];
var Money = '';
var Misc = '';
var Person = '';
var Organization = '';
var Location = '';
var Phone = '';
var Dat1 = [];

var count = 0;
var currentCursor = 0;
var inputCursor= 0;





function populateAnalystSearch(){
	$.getJSON('/users/sample3/'+CompareContent, function(data) {
		buildDocView(data, 'userList', false, false, true);
		$('.document-list').highlight(CompareContent, {className :'searchHighlight'});
	});
}



function populateNewWorkerView(docIndex){
	/* $.getJSON("/users/getAllDocsForKeys",function(data){
		buildDocView([data[workerDocCount]], 'userList', false, false, true);
	}); */

	/* $.getJSON("/users/getDocbyIndex/" + docIndex,function(data){
		workerDocsIndex.push(docIndex);
		buildDocView([data[0]], 'userList', false, false, true);
	});
 */
	$.getJSON("/users/getAllDocForWorker",function(data){
		// console.log("data", data);
		// workerDocsIndex.push(docIndex);
		// console.log("workerDocsIndex", workerDocsIndex);
		// populateNewWorkerView
		buildDocView(data, 'userList', false, false, true);
	});

	workerDocCount++;
}

/* function populateTable() {
	document.getElementById('WorkerInstructions').innerHTML = '<b>Instruction: </b>Select two terms and click \'Generate\' to create a link';
    //document.getElementById('userList').empty();
    
    var Loc ;
    var Per ;
    var Org;
    var Mon;
    var Mis;
	var Pho ;
	var id ;
	
	$.getJSON('/users/assignment',function(data){	
	
    	$.each(data,function(data){
			currentCursor = this.Index;
			inputCursor = this.Index;
			if(currentCursor >= 39){
				currentCursor = 1;
			}
			else{
				currentCursor += 3;
			}
			Update();
			Fill();
		});
    });
}; */

/* $("#nextButton").click(function(){
	if(count<=2){
	if(confirm("Are you sure you want to proceed to the next primary document?\nYou will not be able to retutn to this document again.")){
		$("#frequentList").empty();
		linkCreationCount=0;
			
			Fill();
			document.getElementById('WorkerInstructions').innerHTML = '<b>Instruction: </b>Select two terms and click \'Generate\' to create a link';
	}
	}
	
	else{
		alert("Document limit reached!!!");
		document.getElementById("WorkerInstructions").innerHTML = "Please click 'FINISH' button located in the top right corner of the page to submit your work and receive unique code."
		$("#nextButton").hide();
	}
	selectionWords="";
});
 */
/* function Fill() {
	
	count++;
	$.getJSON( "/users/getDocByIndex/"+inputCursor, function( data ) {
		buildDocView(data,'userList',true,false);
	});
	
	inputCursor++;
	if(inputCursor >= 41){
	inputCursor = 1;
	}
}; */

/* function Update(){
	$.ajax({
					type: 'POST',
					dataType: 'application/x-www-form-url',
					data: {
						"CurrentIndex" : inputCursor,
						"Index": currentCursor
					},
					url: '/users/updateCursor',
					});
}; */