'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var mustache = require('mustache');
var fs = require('fs');
var path = require('path');

//viewOrTemplate is either
//  a view object
//  a path to a view .json file (must end in .json, unless the options.isView flag is set)
//  a path to a template (can have any file ext. other than .json)
//options - object
//  extension - file extension for the output
//  tags - mustache tags, replaces ['{{', '}}'] with ['start-tag-here', 'end-tag-here']
//  isView - bool, if true, viewOrTemplate is interpreted as a path to a view regardless of file extension
//partials - refer to full gulp-mustache docs

module.exports = function (viewOrTemplate, options, partials) {
    options = options || {};
    partials = partials || {};

    if (options.tags) {
        mustache.tags = options.tags;
    }


    var view,
        template,
        viewError = null;

    //If the files which are piped in ( gulp.src('...') ) are mustache templates, this is true
    var inputStreamIsTemplate = true;

    if (typeof viewOrTemplate === 'object') {

        //viewOrTemplate is a raw view object
        view = viewOrTemplate;

    } else if (typeof viewOrTemplate === 'string' && (viewOrTemplate.endsWith('.json') || options.isView)) {

        //viewOrTemplate is a path to a JSON view file
        try {
            view = JSON.parse(fs.readFileSync(viewOrTemplate, 'utf8'));
        } catch (e) {
            viewError = e;
        }

    } else if (typeof viewOrTemplate === 'string') {

        //viewOrTemplate is a path to a template
        template = fs.readFileSync(viewOrTemplate, 'utf8');

        //Meaning that the input files must be treated as views
        inputStreamIsTemplate = false;

    }


    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit(
                'error',
                new gutil.PluginError('gulp-mustache', 'Streaming not supported')
            );
        }

        if (viewError) {
            this.emit(
                'error',
                new gutil.PluginError('gulp-mustache', viewError.toString())
            );
        }

        if (inputStreamIsTemplate) {
            template = file.contents.toString();
        } else {
            try {
                view = JSON.parse(file.contents.toString());
            } catch (e) {
                this.emit(
                    'error',
                    new gutil.PluginError('gulp-mustache', e.toString())
                );
            }
        }

        try {
            loadPartials.call(this, template, file.path);
        } catch (e) {
            this.emit(
                'error',
                new gutil.PluginError('gulp-mustache', e.message)
            );
        }

        try {
            file.contents = new Buffer(
                mustache.render(template, file.data || view, partials)
            );
        } catch (e) {
            if (!viewError)
                this.emit(
                    'error',
                    new gutil.PluginError('gulp-mustache', e.message)
                );
        }

        if (typeof options.extension === 'string') {
            file.path = gutil.replaceExtension(file.path, options.extension);
        } else if (inputStreamIsTemplate) {
            file.path = gutil.replaceExtension(file.path, '.html');
        }
        this.push(file);
        cb();
    });

    // find and load partials not already in partials list from disk, recursively
    function loadPartials(template, templatePath) {
        var templateDir = path.dirname(templatePath);

        var partialRegexp = new RegExp(
            mustache.tags[0] + '>\\s*(\\S+)\\s*' + mustache.tags[1], 'g'
        );

        var partialMatch;
        while (partialMatch = partialRegexp.exec(template)) {
            var partialName = partialMatch[1];

            if (!partials[partialName]) {
                try {
                    var partialPath = null;
                    var partial = null;

                    // ignore `partial` with file extension.
                    // e.g.
                    //   1, `{{> ./path/to/partial.html }}`
                    //   2, `{{> ./path/to/partial. }}`
                    if ( path.extname(partialName) != "" ) {
                        partialPath = path.resolve(templateDir, partialName);
                        partial = fs.readFileSync(partialPath, 'utf8');
                    }

                    else {
                        // ignore `partial` file is exists without file extension.
                        // e.g.
                        //   1, `{{> ./path/to/partial }}` is exists.
                        //   2, `{{> ./path/to/.partial }}` is exists.
                        partialPath = path.resolve(templateDir, partialName);

                        if ( fs.existsSync(partialPath) ) {
                            partial = fs.readFileSync(partialPath, 'utf8');
                        }

                        else {
                            // or check if `partial + options.extension` is exists.
                            // e.g.
                            //   if `options.extension` equals ".html":
                            //   the `{{> ./path/to/partial }}` will load
                            //   `./path/to/partial.html`.
                            if ( typeof options.extension == "string" ) {
                                partialPath = path.resolve(
                                    templateDir,
                                    partialName + options.extension
                                );

                                if ( fs.existsSync(partialPath) ) {
                                    partial = fs.readFileSync(partialPath, 'utf8');
                                }
                            }

                            // when `options.extension` is not a string or
                            // `partialName + options.extension` does not exists.
                            // try use `.mustache` extension to load `partial` file.
                            if ( partial === null ) {
                                partialPath = path.resolve(
                                    templateDir,
                                    partialName + ".mustache"
                                );

                                partial = fs.readFileSync(partialPath, 'utf8');
                            }
                        }
                    }

                    partials[partialName] = partial;
                    loadPartials.call(this, partial, partialPath);
                } catch (ex) {
                     this.emit(
                        'error',
                        new gutil.PluginError(
                            'gulp-mustache',
                            // use `ex.message` property instead of `partialPath`,
                            // because `this.emit()` seems not a sync method.
                            // also the `ex.message` property provide more details
                            // about error information.
                            'Unable to load partial file: ' + ex.message/*partialPath*/
                        )
                     );
                }
            }
        }
    }
};

module.exports.mustache = mustache;
