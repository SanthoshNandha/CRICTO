/***
 * Contains basic SlickGrid formatters.
 * 
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 * 
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Formatters": {
        "PercentComplete": PercentCompleteFormatter,
        "PercentCompleteBar": PercentCompleteBarFormatter,
        "YesNo": YesNoFormatter,
        "Checkmark": CheckmarkFormatter,
        "Link": LinkFormatter,
        "bgColor":bgColorFormatter,
        "bgImage":bgImageFormatter
      }
    }
  });
  
  function LinkFormatter(row, cell, value, columnDef, dataContext) {
	   return "<span class='edit-view-delete'><i class='icon-remove'></i></span>";
	}
  
  function bgColorFormatter(row, cell, value, columnDef, dataContext){
	  if(value == null || value === ""){
		  return "<div style='background-color:white></div>";
	  }
	  else{
		  var color = value.replace(/\s+/g, '');
		  return "<div class = 'line-color-cell' style='background-color:" + color +"'></div>";
	  }
	  
  }
  function bgImageFormatter(row, cell, value, columnDef, dataContext){
	  if(value == null || value === ""){
		  return "<div style='background-color:white></div>";
	  }
	  else{
		  var image = value.replace(/\s+/g, '');
		  return "<div class = 'line-stroke-cell' style='background-image:url(/img/lineStyle/"+image+".jpg)'></div>";
	  }
  }

  function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "-";
    } else if (value < 50) {
      return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
    } else {
      return "<span style='color:green'>" + value + "%</span>";
    }
  }

  function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    }

    var color;

    if (value < 30) {
      color = "red";
    } else if (value < 70) {
      color = "silver";
    } else {
      color = "green";
    }

    return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
  }

  function YesNoFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "Yes" : "No";
  }

  function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "<img src='../images/tick.png'>" : "";
  }
})(jQuery);
