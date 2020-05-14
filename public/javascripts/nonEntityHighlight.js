//Code to hightlight other things(other than entities)
$('#documentList').click(function(e) {
	alert("userlist clicked");
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
        var currentID = clicked.id || (clicked.parentElement.id);
		
		if(stop_words.indexOf(str) !== -1){
			alert("stop word");
		}
		else{
			
		$('#' + currentID).highlight(str, {className:'highlighted '+str});
		var str1= str;
		str = stemmer(str);
		var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
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
			console.log(queue[0])
			console.log(queue[1]);
			console.log("==========");

			}
		}
		
        $('.highlighted').click(function() {
			var elementPos = queue.map(function(x) {return x.selection; }).indexOf($(this).text());
			queue.splice(elementPos,1);
			console.log(queue[0]);
			$(this).parent().unhighlight({className:$(this).text()});
        });
    } 
    catch (e) {
    }
});