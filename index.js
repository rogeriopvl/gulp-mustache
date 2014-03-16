'use strict';

var es = require('event-stream');
var gutil = require('gulp-util');
var mustache = require('mustache');
var fs = require('fs');

module.exports = function (view, options, partials) {
    options = options || {};
    options.extension = options.extension || '.html';
    partials = partials || {};

    var viewError = null;

    // if view is string, interpret as path to json filename
    if (typeof view === 'string') {
        try {
            view = JSON.parse(fs.readFileSync(view, 'utf8'));
        } catch (e) {
            viewError = e;
        }
    }

    return es.map(function (file, cb) {
        if (viewError) {
            return cb(new Error(viewError));
        }
        file.contents = new Buffer(mustache.render(file.contents.toString(), view, partials));
        file.path = gutil.replaceExtension(file.path, options.extension);
        cb(null, file);
    });
};
