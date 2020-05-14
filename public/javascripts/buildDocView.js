/* 
	*Author: Santhosh Nandhakumar
	*emailid: nsanthosh2409@gmail.com
*/




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
            
            
            /*if(currentID == ""){
            	currentID = "searchResult";
            }*/
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
function buildfrequencyView(){
	
	$("#getRelatedDocsButton").click(function(e){
		e.stopPropagation();
		document.getElementById('WorkerInstructions').innerHTML = '<b>Instruction: </b>The documents related to the links created are displayed below. Please create links from these documents by selecting two terms from them.<br>Click \'Next\' button to proceed to the next primary document.'
		$.ajax({
			type: 'post',
			dataType: 'application/x-www-form-url',
			data: {
					"wordList" : selectionWords
			},
			url: '/users/getfrequentDocs',
			complete : function(data){
				if(data == null || data.responseText == null || data.responseText == "" || data.responseText == []  ){
					$("#frequentList").html("<hr><h5>There are no related document found !!! <br> Click NEXT to get a new document </h5>");
				}
				else{
					buildDocView(JSON.parse(data.responseText),'frequentList',false,false,false);
				}
				
            }
			
		});
	});
	
	$("#getRelatedDocsButton").hide();
}

function buildBookmarkView(){
	$(".bookmarkButton").click(function(e){
		if(!($(this).children(".fa-bookmark").hasClass("bookmarked-doc"))){
			e.stopPropagation();
			$("#userList").removeClass("analyst-document-view-normal");
	        $("#userList").addClass("analyst-document-view-small");
	        $("#searchResult").removeClass("searchResult-normal-hide");
	        $("#searchResult").addClass("searchResult-normal-show");
	        var docId =  $(this).parent().parent().attr("id");
	        generateBookMarkDocs(docId,"searchResult");
	        bookMarkDocs.push(docId);
	       // $(this).hide();
	        $(this).children(".fa-bookmark").addClass("bookmarked-doc");
		}
		
	});
}
function buildGetDocLinks(){
	$(".get-doc-graphs").click(function(){
		var docId = $(this).parent().parent().attr("id");
		visualizedDocId.push(docId);
		getLinks(false);
		//getDocLinks(visualizedDocId);
	});
}

