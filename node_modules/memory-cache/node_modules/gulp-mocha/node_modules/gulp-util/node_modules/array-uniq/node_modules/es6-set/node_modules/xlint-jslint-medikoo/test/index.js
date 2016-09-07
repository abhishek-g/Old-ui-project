'use strict';

module.exports = function (t, a) {
	var report = t('foo = \'raz\';');
	a(report.length, 2, "Report length");
	a.deep(report[0], { line: 1, character: 1,
		message: '\'foo\' was used before it was defined.' });
	a.deep(report[1], { line: 1, character: 12,
		message: 'Unexpected \'(end of file)\'.' });
};
