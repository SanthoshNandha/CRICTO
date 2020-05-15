jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);
    
    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);
    
    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};

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