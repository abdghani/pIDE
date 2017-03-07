var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');

var ngfiles = [
    "public/ngfiles/main.js",
	"public/ngfiles/routerConfig.js",
	"public/ngfiles/fac.js",
	"public/ngfiles/ctrl/sideNav.js",
	"public/ngfiles/ctrl/codeSave.js",
	"public/ngfiles/ctrl/home.js",
	"public/ngfiles/ctrl/savedCode.js",
	"public/ngfiles/ctrl/packages.js",
	"public/ngfiles/ctrl/codeUpload.js",
];

var angularFiles = [
    "bower_components/angular/angular.min.js",
	"bower_components/angular-resource/angular-resource.min.js",
	"bower_components/angular-sanitize/angular-sanitize.min.js",
	"bower_components/angular/angular.min.js",
	"bower_components/angular-animate/angular-animate.min.js",
	"bower_components/angular-aria/angular-aria.min.js",
	"bower_components/angular-material/angular-material.min.js",
	"bower_components/angular-messages/angular-messages.js",
	"bower_components/angular-modal-service/dst/angular-modal-service.min.js",
	"bower_components/jquery/dist/jquery.min.js",
	"bower_components/angular-ui-router/release/angular-ui-router.min.js",
	"bower_components/angular-file-upload/dist/angular-file-upload.min.js",
    "bower_components/ng-copy.js",
    "bower_components/angular-ui-codemirror/ui-codemirror.min.js",
    "public/lib/codemirror.js",
    "bower_components/codemirror/mode/python/python.js",
    "public/display/closebrackets.js",
    "public/display/fullscreen.js",
    "public/display/anyword-hint.js",
    "public/display/simplescrollbars.js",
    "public/display/show-hint.js",
    "bower_components/filepicker-js/filepicker.js",
    "bower_components/angular-filepicker/dist/angular_filepicker.js",
    "public/mainjs.js"
];

gulp.task('bundle-js',function(){

        gulp.src(ngfiles)
        .pipe(concat('mainjs.js'))
        .pipe(gulp.dest('./public/'));

        gulp.src(angularFiles)
        .pipe(concat('angularjs.js'))
        .pipe(gulp.dest('./public/'));
});

gulp.task('watch',function(){
    gulp.watch('public/**/*.js',['bundle-js']);
    gulp.watch('bower_components/**/*.js',['bundle-js']);
});

gulp.task('default', ['bundle-js','watch']);