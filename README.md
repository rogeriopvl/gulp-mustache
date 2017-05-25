# gulp-mustache [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

[![Greenkeeper badge](https://badges.greenkeeper.io/rogeriopvl/gulp-mustache.svg)](https://greenkeeper.io/)

> mustache plugin for [gulp](https://github.com/wearefractal/gulp)

# Usage

First, install `gulp-mustache` as a development dependency:

```shell
npm install --save-dev gulp-mustache
```

Then, add it to your `gulpfile.js`:

```javascript
var mustache = require("gulp-mustache");

gulp.src("./templates/*.mustache")
	.pipe(mustache({
		msg: "Hello Gulp!"
	}))
	.pipe(gulp.dest("./dist"));
```

You may also pass in an object representing mustache partials and their contents
as a third argument to the call to `mustache()` like so:

With key/value pairs:

```javascript
gulp.src("./templates/*.mustache")
	.pipe(mustache({
		msg: "Hello Gulp!",
		nested_value: "I am nested.",
		another_value: "1 2 3"
	},{},{
		some_inner_partial: "<p>{{nested_value}}</p>",
		another_partial: "<div>{{another_value}}</div>"
	})).pipe(gulp.dest("./dist"));
```
With a json file:

```javascript
gulp.src("./templates/*.mustache")
	.pipe(mustache('your_json_file.json',{},{}))
	.pipe(gulp.dest("./dist"));
```

# Partials loaded from disk

[Mustache partials](https://mustache.github.io/mustache.5.html#Partials) not given in the `partials` argument will be loaded from disk, relative from the file currently being processed:

```
{{> ../partials/head }}
```

This will find a `head.mustache` in the partials directory next to the current file's directory. Partials loading is recursive.

# API

## mustache(viewOrTeplate, options, partials)

### viewOrTemplate
Type: `object` or `string`
Default: `undefined`

If you pass a path to a `.json` file, it will be interpreted as the view object. If you pass a literal object, it will be intepreted as the view object.

If, however, you pass it a path to a file with any extension other than `.json` it will be interpreted as a template file. (Unless you set options.isView to true.) There is an example of this inverse behaviour below.

As of `v1.0.1`, `file.data` is supported as a way of passing data into mustache. See [this](https://github.com/colynb/gulp-data#note-to-gulp-plugin-authors).

### options
Type: `object`
Default: `{ }`

The options object to configure the plugin.

#### options.extension
Type: `string`
Default: the extension of the current file

#### options.tags
Type `Array`
Default `undefined`

Pass custom mustache delimiters. This must be an Array of strings where the first item is the opening tag and the second the closing tag.

Be careful though, as the tags are treated as regular expressions, so `['..', '..']` would match `ab dotMeansAnyCharacter cd` and `hj stuffHere kl`. If you want to use a literal dot `.` make sure to escape it (ie `['\.\.', '\.\.']`)

Example:

```javascript
['[[custom--', '-custom]]']
```
And then:
```html
<h1>[[custom-- usingFancyNewDelimiters -custom]]
```

#### options.isView
Type `bool`
Default `false`

If true, `viewOrTemplate` will be treated as a path to a JSON view regardless of file extension. If false, any file extension other than `.json` passed like `.pipe(mustache('thing.unusual-file-extension')` will be interpreted as a mustache template.

### partials
Type: `object`
Default: `{ }`

An optional object of mustache partial strings. See [mustache.js](https://github.com/janl/mustache.js/) for details on partials in mustache.

## Examples

`example.mustache`:
```html
<h1>{{title}}</h1>
<p>{{content}}</p>
```

### Literal view object (passing a view directly)
```js
gulp.task('literal-view-object', function() {
	return gulp.src('./*.mustache')
		.pipe(mustache({
			title: 'Example',
			content: 'For every .mustache file in this directory, this will output a mirroring .html file using this view object.'
		}, {extension: '.html'}))
		.pipe(gulp.dest('./'));
});
```

### Path to JSON view
This does the same as above, but the view is stored in a JSON file instead of in a literal object
```js
gulp.task('view-json-path', function() {
	return gulp.src('example.mustache')
		.pipe(mustache('view.json', {extension: '.html'}))
		.pipe(gulp.dest('./'));
});
```

### Inverted behaviour
This example takes each `.json` file in the current directory, and uses the same template for each. This is useful for, say, building a series of full blog post HTML pages from compiled markdown HTML post content and an HTML template; ie the same template for multiple blog posts/views.

Also note that if you pass a `.json` file to `.pipe(mustache(...))` it will be interpreted as JSON, but if you pass a file with any other file extension it will be interpreted as a mustache template. To avoid that look at `options.isView`.
```js
gulp.task('template-path', function() {
	return gulp.src('./*.json')
		.pipe(mustache('example.mustache', {extension: '.html'}))
		.pipe(gulp.dest('./'));
});
```
## Development
To run tests, use either `npm test` or `mocha` after running `npm install`, assuming mocha is installed.

# License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-mustache
[npm-image]: https://badge.fury.io/js/gulp-mustache.png

[travis-url]: http://travis-ci.org/rogeriopvl/gulp-mustache
[travis-image]: https://secure.travis-ci.org/rogeriopvl/gulp-mustache.png?branch=master

[depstat-url]: https://david-dm.org/rogeriopvl/gulp-mustache
[depstat-image]: https://david-dm.org/rogeriopvl/gulp-mustache.png
