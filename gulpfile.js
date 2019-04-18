const { series, src, dest } = require('gulp');
const del = require('del');
const fs = require('fs');

function clean() {
    return del(['dist/'])
}

function copyNSSM() {
    return src('nssm/*.*')
        .pipe(dest('dist/nssm/'));
}

function copyScripts() {
    return src('scripts/bot/*.bat')
        .pipe(dest('dist/'));
}

function createFolders() {
    return src('*.*', { read: false })
    .pipe(dest('dist/temp'))
    .pipe(dest('dist/logs'))
}

exports.default = series(clean, copyNSSM, copyScripts, createFolders);