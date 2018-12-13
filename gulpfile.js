'use strict';

var gulp = require('gulp');
var os = require('os');
var open = require('open');
var cssnext = require('cssnext');
var autoprefixer = require('autoprefixer');
var proxy = require('http-proxy-middleware');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var args = require('yargs').argv;

var COMMAND_PUB = 'pub';                        //  构建时的命令
var isPruduction = args._[0] === COMMAND_PUB;   //  是否是发布版本，是的话执行压缩、添加hash等操作
var target = args.target || 'pc';               //  命令行中指定构建的版本，可选 pc、mobile、bank
var postCssConfig = [cssnext, autoprefixer];
var htmlminOptions = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
};

//  定义项目路径
var srcPath = 'src/' + target + '/',
    // devPath = 'build/' + target + '/',
    devPath = 'build/',
    // distPath = 'dist/' + target + '/';
    distPath = 'dist/';

//  清除build、dist
gulp.task('clean', function () {
    return gulp.src([devPath, distPath])
        .pipe(plugins.clean({force: true}));
});

//  同步products/common/apis/过来项目中，和common合并成一个js文件
gulp.task('build:concatApi', function () {
    return gulp.src(['../common/apis/apisMain.js', '../common/apis/003_QDYH.js', srcPath + 'js/common.js'])
        .pipe(plugins.concat('common.js'))
        .pipe(gulp.dest(devPath + 'js'));
});

//  执行HTML压缩并输出
gulp.task('build:html', function () {
    return gulp.src(srcPath + 'app/**/*.html')
        .pipe(gulp.dest(devPath + 'app'))
        .pipe(plugins.connect.reload());
    // .pipe(plugins.if(isPruduction, plugins.htmlmin(htmlminOptions)))
    // .pipe(plugins.if(isPruduction, gulp.dest(distPath + 'app')));
});

//  执行LESS编译、添加浏览器前缀、压缩并输出
gulp.task('build:less', function () {
    return gulp.src([srcPath + 'less/**/*.less',
        '!' + srcPath + 'less/variable.less'])
        .pipe(plugins.less())
        .pipe(plugins.postcss(postCssConfig))
        .pipe(gulp.dest(devPath + 'css'))
        .pipe(plugins.connect.reload());
    // .pipe(plugins.if(isPruduction, plugins.cssmin()))
    // .pipe(plugins.if(isPruduction, gulp.dest(distPath + 'css')));
});

//  先输出到build后在合并覆盖common.js
gulp.task('build:js', function (callback) {
    runSequence(
        'build:_js',
        'build:concatApi',
        callback
    );
});

gulp.task('build:font', function () {
    return gulp.src(srcPath + 'fonts/*')
        .pipe(gulp.dest(devPath + 'fonts'))
        .pipe(plugins.connect.reload());
});

//  执行各页面JS压缩并输出
gulp.task('build:_js', function () {
    return gulp.src(srcPath + 'js/**/*.js')
        .pipe(gulp.dest(devPath + 'js'))
        .pipe(plugins.connect.reload());
    // .pipe(plugins.if(isPruduction, plugins.uglify()))
    // .pipe(plugins.if(isPruduction, gulp.dest(distPath + 'js')));
});

//  执行图片压缩并输出
gulp.task('build:image', function () {
    return gulp.src(srcPath + 'images/**/*')
        .pipe(gulp.dest(devPath + 'images'))
        .pipe(plugins.connect.reload());
    // .pipe(plugins.if(isPruduction, plugins.imagemin()))
    // .pipe(plugins.if(isPruduction, gulp.dest(distPath + 'images')));
});

//  执行依赖库的JS、CSS压缩并输出
gulp.task('build:lib', ['build:lib.js', 'build:lib.css', 'build:lib.font']);
gulp.task('build:lib.js', function () {
    return gulp.src(srcPath + 'libs/**/*.js')
        .pipe(gulp.dest(devPath + 'libs'))
        .pipe(plugins.connect.reload());
    // .pipe(plugins.if(isPruduction, plugins.uglify()))
    // .pipe(plugins.if(isPruduction, gulp.dest(distPath + 'libs')));
});
gulp.task('build:lib.font', function () {
    return gulp.src(srcPath + 'libs/fonts/*')
        .pipe(gulp.dest(devPath + 'libs/fonts'))
        .pipe(plugins.connect.reload());
    // .pipe(plugins.if(isPruduction, plugins.uglify()))
    // .pipe(plugins.if(isPruduction, gulp.dest(distPath + 'libs')));
});
gulp.task('build:lib.css', function () {
    return gulp.src(srcPath + 'libs/**/*.css')
        .pipe(gulp.dest(devPath + 'libs'))
        .pipe(plugins.postcss(postCssConfig))
        .pipe(plugins.connect.reload());
    // .pipe(plugins.if(isPruduction, plugins.cssmin()))
    // .pipe(plugins.if(isPruduction, gulp.dest(distPath + 'libs')));
});

//  构建未压缩混淆版本到build目录
gulp.task('build', function (callback) {
    runSequence(
        'clean',
        'build:html',
        'build:less',
        'build:js',
        'build:image',
        'build:lib',
        'build:font',
        callback
    );
});

//  起一个本地开发服务器
gulp.task('server', function () {
    var IP = new OperationSystem().getAddress();
    var config = {
        root: devPath,
        host: IP,
        port: 9001,
        livereload: true,
        middleware: function (connect, opt) {
            return [
                proxy('/CheckBill/', {
                    target: 'http://192.168.3.118:8082',
                    changeOrigin: true
                })
            ];
        }
    };
    plugins.connect.server(config);
    open('http://' + IP + ':' + config.port + '/app/login.html');

    gulp.watch(srcPath + 'app/**/*.html', ['build:html']);
    gulp.watch(srcPath + 'less/**/*.less', ['build:less']);
    gulp.watch(srcPath + 'js/**/*.js', ['build:js']);
    gulp.watch(srcPath + 'images/**/*', ['build:image']);
    gulp.watch(srcPath + 'libs/**/*.js', ['build:lib']);
    gulp.watch(srcPath + 'fonts/**/*', ['build:font']);
});

//  开发时命令
gulp.task('dev', function (callback) {
    runSequence(
        'build',
        'server',
        callback
    );
});

//  生成版本号清单
gulp.task('rev', function () {
    return gulp.src([devPath + '**/*.*'])
        .pipe(plugins.rev())
        .pipe(plugins.revFormat({
            prefix: '.', // 在版本号前增加字符
            suffix: '.cache', // 在版本号后增加字符
            lastExt: false
        }))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(devPath));
});

//  添加版本号
gulp.task('add-version', ['rev'], function () {
    var regExp = /(\.[a-z]+)\?v=[^\'\"\&]*/g;
    var manifest = gulp.src([devPath + 'rev-manifest.json']);

    //  添加版本号要排除libs下的文件，避免被正则替换到第三方库的代码并且逻辑上也不需要给lib下的文件加后缀
    var revFilter = plugins.filter(['**/*.*', '!**/libs/**/*.*', '!**/images/**/*.*', '!**/fonts/**/*.*'], {restore: true});
    //  替换require-config.js中的{{version}}为构建时的时间戳，解决requireJS引入文件的缓存问题
    var requireConfigFilter = plugins.filter('**/js/require-config.js', {restore: true});
    //  todo：百度查到artTemplate简洁语法会导致报错，标准语法<%  %>可能可以避免，暂未处理
    var htmlminFilter = plugins.filter(['**/*.html'], {restore: true});
    var cssminFilter = plugins.filter(['**/*.css'], {restore: true});
    var uglifyFilter = plugins.filter(['**/*.js', '!**/libs/**/*.min.js'], {restore: true});
    var imageminFilter = plugins.filter(['**/images/**.*.*'], {restore: true});

    function modifyUnreved(filename) {
        return filename;
    }

    function modifyReved(filename) {
        // filename是：admin.69cef10fff.cache.css的一个文件名
        // 在这里才发现刚才用gulp-rev-format的作用了吧？就是为了做正则匹配，
        if (filename.indexOf('.cache') > -1) {
            // 通过正则和relace得到版本号：69cef10fff
            const _version = filename.match(/\.[\w]*\.cache/)[0].replace(/(\.|cache)*/g, '');
            // 把版本号和gulp-rev-format生成的字符去掉，剩下的就是原文件名：admin.css
            const _filename = filename.replace(/\.[\w]*\.cache/, '');
            // 重新定义文件名和版本号：admin.css?v=69cef10fff
            filename = _filename + '?v=' + _version;
            // 返回由gulp-rev-replace替换文件名
            return filename;
        }
        return filename;
    }

    return gulp.src([devPath + '**/*.*', '!' + devPath + 'rev-manifest.json'])
    // 给引入的文件添加版本号
        .pipe(revFilter)
        .pipe(plugins.replace(regExp, '$1'))
        .pipe(plugins.revReplace({
            manifest: manifest,
            modifyUnreved: modifyUnreved,
            modifyReved: modifyReved
        }))
        .pipe(revFilter.restore)
        .pipe(requireConfigFilter)
        .pipe(plugins.replace('{{version}}', Date.now()))
        .pipe(requireConfigFilter.restore)
        //  replace之后会还原压缩，所以下面再执行压缩操作

        //  压缩html
        // .pipe(htmlFilter)
        // .pipe(plugins.htmlmin(htmlminOptions))
        // .pipe(htmlFilter.restore)
        //  压缩css
        .pipe(cssminFilter)
        .pipe(plugins.cssmin())
        .pipe(cssminFilter.restore)
        //  压缩js
        .pipe(uglifyFilter)
        .pipe(plugins.uglify())
        .pipe(uglifyFilter.restore)
        // 压缩图片
        .pipe(imageminFilter)
        .pipe(plugins.imagemin())
        .pipe(imageminFilter.restore)
        .pipe(gulp.dest(distPath));
});

//  构建时命令
gulp.task(COMMAND_PUB, function (callback) {
    runSequence(
        'build',
        'add-version',
        callback
    );
});

//  默认执行开发命令
gulp.task('default', ['dev']);

//  获取本机系统IP地址
function OperationSystem() {
    this.IP = '127.0.0.1';
    this.INTERFACES = os.networkInterfaces();
}

OperationSystem.prototype.getAddress = function () {
    for (var key in this.INTERFACES) {
        for (var i = 0; i < this.INTERFACES[key].length; i++) {
            var alias = this.INTERFACES[key][i];
            if (alias['family'] === 'IPv4'
                && alias['address'] !== '127.0.0.1'
                && !alias['internal']) {
                this.IP = alias['address'];
                return this.IP;
            }
        }
    }
    return this.IP;
};