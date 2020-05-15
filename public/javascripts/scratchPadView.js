/* 
	*Author: Santhosh Nandhakumar
	*emailid: nsanthosh2409@gmail.com
*/

function addScrap(){
	$("#addScrap").click(function(){
		var entity = $("#scrapbox").val();
		var entityType = $("#entityTypeSelect").val();
		
		
		var isError=false; 
		
		if(entity == null || entity == "" || entity.length == 0 ){
			$("#scrapbox").addClass("error").attr('title', 'Please Enter a word');
			isError=true;
		}
		else{
			if($("#scrapbox").hasClass("error")){
				$("#scrapbox").removeClass("error")
			}
		}
		
		if(entityType == null || entityType == "" || entityType.length == 0 ){
			$("#entityTypeSelect").addClass("error").attr('title', 'Please select a type');
			isError=true;
		}
		else{
			if($("#entityTypeSelect").hasClass("error")){
				$("#entityTypeSelect").removeClass("error")
			}
		}
		
		if(!isError){
			
        		var newdiv = document.createElement('div');
                newdiv.id = '' + entity.split(" ").join("") ;
                newdiv.className = "pull-left scrap-keyword scarp-keyword";                   
                newdiv.innerHTML = "<span class='scrap-keyword-delete scarp-keyword-remove'>" +
                		"<i class='icon-remove'></i></span>" + entity + "<span class='pull-right' style='width:10px'></span>";
                document.getElementById("scrapPaperDiv").appendChild(newdiv);
                
                $('#' + '' + entity.split(" ").join("")).highlight(entity, {className: entityType + " " + entityType +'_'+entity.split(" ").join("")});
                var doc = '' + entity ;
				$('.'+entityType +'_'+entity.split(" ").join("")).click(function(e){
						e.stopPropagation();
					    if (!$(this).hasClass('ent_highlighted')) {
							var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
							if(elementPos == -1){
							queue.push({
							selection : $(this).text(),
							classname : $(e.target).prop('class'),
							docID : doc,
							Type : entityType
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
                
                
                $(".scrap-keyword-delete").click(function(){
        			$(this).parent().remove();
        		});
                
			$("#scrapbox").val("");
        	$("#entityTypeSelect").val("");
		}
	});
};