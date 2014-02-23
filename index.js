'use strict';

var es = require('event-stream');
var gutil = require('gulp-util');
var mustache = require('mustache');
var fs = require('fs');

module.exports = function (view, options) {
    options = options || {};
    options.extension = options.extension || '.html';
    var err = null;

    //If view is string, interpret as path to json filename
    if (typeof view === "string") {
	try {
	    view = JSON.parse(fs.readFileSync(view,'utf8'));
	} catch (e) {
	    err = e;
	}
    }

    function renderFile(file) {
	if (err) {
	    return this.emit('error', new Error(err.message));
	} else {
            file.contents = new Buffer(mustache.render(file.contents.toString(), view));
            file.path = gutil.replaceExtension(file.path, options.extension);
	    return this.emit('data',file);
	}

    }
    return es.through(renderFile);
}
