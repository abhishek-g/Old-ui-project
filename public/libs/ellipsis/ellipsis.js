define(function(require) {
	
	var ellipsis = require('./js/ellipsis');
	var ellipsisCSS = require('css!./css/ellipsis.css');
	
	return {
		
		'ellipsis' : ellipsis,
		'ellipsisCSS' : ellipsisCSS
	};
});