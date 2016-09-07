/**
 * @VE.UITECH
 * @author Srikanth Subramanian
 * 
 * Jquery plugin for replacing lengthy names with ellipsis.
 * Also includes a tooltip functionality which shows the entire text.
 * 
 * @date 26 September, 2012.
 * 
 * **/



define(function(require) {

	var $ = require('jquery');
	
(function($) {
	
    $.fn.ellipsis = function(charCount,mode) {
        return $(this).each(function() {
            var el = $(this);
            
            var originalText = el.html();
            var originalTextLength = originalText.length;
            
            var tempNode = $(this.cloneNode(true));
            
            var min = 0;
            var max = charCount;
            
            if(charCount < originalTextLength){
	            if (min<=max){
	            	var tooltipHTML = null;
	            	var trimLocation = (min + max);
	                var text = originalText.substr(0, trimLocation);
	                tempNode.html(text + "&hellip;");
	                tooltipHTML = '<div style="position:relative"><div class="theme-text-tooltip layout-tooltip tk-myriad-pro">'+originalText+'<span class="theme-text-tooltip-nub"></span></div></div>';
	                el.after(tooltipHTML);
	            } 
	            if (min > max) {
	            	//If we would be ending decrement the min and regenerate the text so we don't end with a
	            	//slightly larger text than there is space for
	            	console.log('character count has to be greater than 0.');
	            }
            }
            else {
            	return false;
            }
            el.html(tempNode.html());
            tempNode.remove();
            
            el.mouseenter(function(){
				el.parent().find('.theme-text-tooltip').fadeIn(500);
			});
			
			el.mouseleave(function(){
				el.parent().find('.theme-text-tooltip').fadeOut(500);
			});
        });
    };
})(jQuery); 

});
