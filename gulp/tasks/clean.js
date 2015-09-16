import gulp from 'gulp';
import del from 'del';
import paths from '../paths';

// Clean output directory
gulp.task('clean', cb => del([paths.tmp, paths.output + '*', '!' + paths.output + '.git', '!CNAME'], {dot: true}, cb));
