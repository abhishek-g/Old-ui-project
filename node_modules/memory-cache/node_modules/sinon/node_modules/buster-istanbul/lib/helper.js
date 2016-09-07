buster.testRunner.onCreate(function(runner){
	runner.on("suite:end", function() {
		buster.emit('istanbul:report', window.__coverage__);
	});
});