'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');
const istanbul = require('gulp-istanbul');
const apidoc = require('gulp-apidoc');



// Paths
const files =  {
    server: ['server.js'],
    mochaTests: ['./tests/**/*.js'],
    appSrc: ['./app/**/*.js']
};

const allJSFiles = files.appSrc
    .concat(files.mochaTests)
    .concat(files.server);

// Set Test environment
gulp.task('setTestEnv', function () {
    process.env.NODE_ENV = 'test';
});

// JSHint linting
gulp.task('lint', () => {

    return gulp.src(allJSFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Mocha tests with coverage
gulp.task('istanbul', () => {

    let instFiles = files.appSrc
        .concat(files.server);

    gulp.src(instFiles)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', () => {
            gulp.src(files.mochaTests)
                .pipe(mocha({ timeout: 10000 }))
                .pipe(istanbul.writeReports({
                    reporters: [ 'lcov', 'json', 'text', 'text-summary']
                })) // Creating the reports after tests
                .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })) // Enforce a coverage of at least 90%
                .once('error', function () {
                    process.exit(1);
                })
                .once('end', function () {
                    process.exit();
                });
        });
});

gulp.task('test', ['setTestEnv', 'lint', 'istanbul']);

gulp.task('apidoc', function(done){
    apidoc({
        src: "app/",
        dest: "public/docs/manual-api/"
    }, done);
});

gulp.task('postinstall', ['apidoc']);