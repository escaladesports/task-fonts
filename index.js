'use strict'
const notify = require('task-notify')
const error = require('task-error-notify')
const gulp = require('gulp')
const fontgen = require('gulp-fontgen')
const concat = require('gulp-concat')
const vinylPaths = require('vinyl-paths')
const del = require('del')
const runSequence = require('run-sequence')


module.exports = (config, cb) => {
	// Generate webfonts and CSS
	gulp.task('fonts:generate', () => {
		return gulp.src(`${config.src}/${config.fonts}/**/*.{ttf,otf}`)
			.pipe(fontgen({
				dest: `${config.dist}/${config.fonts}`,
				collate: true,
				css_fontpath: `/${config.fonts}`
			}))
	})

	// Concatenate CSS to a single SCSS file
	gulp.task('fonts:move-css', () => {
		return gulp.src(`${config.dist}/${config.fonts}/**/*.css`)
			.pipe(concat('fonts.scss'))
			.pipe(gulp.dest(`${config.src}/${config.style}`))
	})

	// Delete unused CSS files in dist
	gulp.task('fonts:clean', () => {
		return gulp.src(`${config.dist}/${config.fonts}/**/*.css`)
			.pipe(vinylPaths(del))
	})


	gulp.task('fonts', cb => {
		runSequence(
			'fonts:generate',
			'fonts:move-css',
			'fonts:clean',
			cb
		)
	})

	gulp.tasks.fonts.fn(() => notify('Fonts processed'))
}
