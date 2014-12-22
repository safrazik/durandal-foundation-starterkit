var gulp = require('gulp');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
  sass('./scss', {
    loadPath: ['./bower_components/foundation-apps/scss'],
    style: 'nested',
    bundleExec: true
  })
  .pipe(autoprefixer({
    browsers: ['last 2 versions', 'ie 10']
  }))
  .pipe(gulp.dest('assets/css/'));
});

gulp.task('watch', function() {
  
  var server = livereload.listen(35729);
  
  gulp.watch('scss/**/*.scss', ['sass']);

  gulp.watch('assets/css/**/*.css').on('change', function(file) {
      livereload.changed(file);
  });

  gulp.watch(['app/**/*.js', 'app/**/*.html']).on('change', function(file){
    livereload.changed(file);
  });
  
});

gulp.task('serve', function() {
  connect.server({
    root: [__dirname],
    port: 8000,
    livereload: true
  });
});

gulp.task('default', ['sass', 'serve', 'watch']);