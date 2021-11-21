import pkg from 'gulp';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify-es';
import autoprefixer from 'gulp-autoprefixer';
import cleancss from 'gulp-clean-css';
import imagecomp from 'compress-images';
import del from 'del';
import htmlmin from 'gulp-htmlmin';

const { src, dest, parallel, series, watch } = pkg;


function browsersync() {
	browserSync.create().init({ 
		server: { baseDir: 'dist/' }, 
    ghostMode: { clicks: false },
		notify: false, 
		online: true 
	})
}

function scripts() {
	return src([ 
		'src/assets/js/**/*.js', 
		])
	.pipe(uglify.default()) 
	.pipe(dest('dist/assets/js/')) 
	.pipe(browserSync.stream()) 
}

function styles() {
	return src('src/assets/style/*.css') 
	.pipe(autoprefixer({ grid: true })) 
	.pipe(cleancss( { level: { 1: { specialComments: 0 } } } )) 
	.pipe(dest('dist/assets/style/')) 
	.pipe(browserSync.stream()) 
}

async function images() {
	imagecomp(
		"src/assets/img/**/*", 
		"dist/assets/img/", 
		{ compress_force: false, statistic: true, autoupdate: true }, false, 
		{ jpg: { engine: "mozjpeg", command: ["-quality", "90"] } }, 
		{ png: { engine: "optipng", command: false } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{ gif: { engine: "giflossy", command: ['--lossy=10'] } },
		function (err, completed) { 
			if (completed === true) {
				browserSync.reload()
			}
		}
	)
}

function cleanimg() {
	return del('dist/assets/img/**/*', { force: true }) 
}

function html() {
  return src('src/*.html')
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(dest('dist/'))
	.pipe(browserSync.stream())
}

function buildcopy() {
	return src([ 
		'src/assets/js/**/*.json',
		], { base: 'src' }) 
	.pipe(dest('dist')) 
}
 
function cleandist() {
	return del('dist/**/*', { force: true }) 
}

function startwatch() {
 
	
	watch('src/assets/js/**/*.js', scripts);
	
	
	watch('src/assets/style/**/*', styles);
 
	
	watch('src/**/*.html', html);
 

	watch('src/assets/img/**/*', images);
 
}

 
export { scripts, styles, images, cleandist, cleanimg, buildcopy, html }
 
export let assets = series(scripts, styles, images ,buildcopy)
export let build = series(cleandist, images, scripts, styles, buildcopy, html)
export default series( scripts, styles, buildcopy, html, parallel(browsersync, startwatch))