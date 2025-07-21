import { src, dest, watch, series } from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import browserSync from 'browser-sync'
import imagemin from "gulp-imagemin"

const sass = gulpSass(dartSass)

const server = browserSync.create()

export function js( done ) {
    src('src/js/app.js')
        .pipe( dest('build/js') ) 
    server.reload()
    done()
}

export function css( done ) {
    src('src/scss/app.scss', {sourcemaps: true})
        .pipe( sass().on('error', sass.logError) )
        .pipe( sass({outputStyle: 'compressed'}) )
        .pipe( dest('build/css', {sourcemaps: '.'}) )
    server.reload()
    done()
}

export function image( done ) {
    src('src/img/*.png')
		.pipe(imagemin())
		.pipe( dest(`build/img`) );
	done();
}

export function serve(done) {
    server.init({
        server: './'
    })
    done()
}

export function dev() {
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', js)
    watch('**/*.html').on('change', server.reload)
}

export default series( js, css, serve, dev )