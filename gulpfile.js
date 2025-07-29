import { src, dest, watch, series } from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import browserSync from 'browser-sync'
import imagemin from "gulp-imagemin"
import autoprefixer from 'gulp-autoprefixer'
import sourcemaps from 'gulp-sourcemaps'
import csso from 'gulp-csso';

const sass = gulpSass(dartSass)

const server = browserSync.create()

export function js( done ) {
    src('src/js/app.js')
        .pipe( dest('build/js') ) 
    server.reload()
    done()
}

export function css( done ) {
    src('src/scss/app.scss')
        .pipe( sourcemaps.init() )
        .pipe( sass().on('error', sass.logError) )
        .pipe( autoprefixer({
            cascade: false,
            overrideBrowserslist: ['last 2 versions', 'ie >= 10', 'iOS >= 9']
        }) )
        .pipe( csso() )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/css') )
        .pipe( server.stream() );
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