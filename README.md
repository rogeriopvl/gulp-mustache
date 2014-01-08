# gulp-mustache [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> mustache plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

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

## API

### mustache(view)

#### options
Type: `hash`
Default: `undefined`

The view object, containing all template variables as keys.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-mustache
[npm-image]: https://badge.fury.io/js/gulp-mustache.png

[travis-url]: http://travis-ci.org/rogeriopvl/gulp-mustache
[travis-image]: https://secure.travis-ci.org/rogeriopvl/gulp-mustache.png?branch=master

[depstat-url]: https://david-dm.org/rogeriopvl/gulp-mustache
[depstat-image]: https://david-dm.org/rogeriopvl/gulp-mustache.png
