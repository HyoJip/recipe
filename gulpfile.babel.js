import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import gws from "gulp-webserver";
import gimg from "gulp-image";
import gsass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages-with-updated-gift";

gsass.compiler = require("node-sass");

const routes = {
	pug: {
		src: "src/*.pug",
		dest: "build",
		watch: "src/**/*.pug",
	},
	img: {
		src: "src/img/*",
		dest: "build/img",
	},
	scss: {
		src: "src/scss/style.scss",
		dest: "build/css",
		watch: "src/scss/*.scss",
	},
	js: {
		src: "src/js/main.js",
		dest: "build/js",
		watch: "src/**/*.js",
	},
};

// FUNCTIONS
const clean = () => del(["build", ".publish"]);
const pug = () => gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));
const webServer = () => gulp.src("build").pipe(gws({ livereload: true, open: true }));
const img = () => gulp.src(routes.img.src).pipe(gulp.dest(routes.img.dest));
const scss = () =>
	gulp
		.src(routes.scss.src)
		.pipe(gsass().on("error", gsass.logError))
		.pipe(autoprefixer({ cascade: false }))
		.pipe(csso())
		.pipe(gulp.dest(routes.scss.dest));
const js = () =>
	gulp
		.src(routes.js.src)
		.pipe(
			bro({
				transform: [
					babelify.configure({
						presets: [["@babel/preset-env", { targets: { chrome: "55" } }]],
					}),
					["uglifyify", { global: true }],
				],
			})
		)
		.pipe(gulp.dest(routes.js.dest));
const watch = () => {
	gulp.watch(routes.pug.watch, pug);
	gulp.watch(routes.img.src, img);
	gulp.watch(routes.scss.watch, scss);
	gulp.watch(routes.js.watch, js);
};
const git = () => gulp.src("build/**/*").pipe(ghPages());

// TASKS
const clear = gulp.series([clean]);
const assets = gulp.series([pug, img, scss, js]);
const render = gulp.parallel([webServer, watch]);
const upload = gulp.series([git]);

// EXPORT
export const build = gulp.series([clear, assets]);
export const dev = gulp.series([build, render]);
export const deploy = gulp.series([build, upload]);
