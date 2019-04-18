// file system
var fs = require('fs');
var del = require('del');
var glob = require('glob');
var path = require('path');

// console colors
var colors = require('colors');

// qdt helper
var qdt_core = require("./qdt/qdt-helpers");
var qdt_verbose = require("./qdt/qdt-verbose");

// gulp itself
var gulp = require('gulp');

var params = qdt_core.getParams() || {};

var envFile = params['env-file'] ? (
    './qdt-env.' + params['env-file']
) : (fs.existsSync('./qdt-env.js') ? './qdt-env.js' : './qdt-env.json');

var configFile = fs.existsSync(
    './qdt-config.js'
) ? './qdt-config.js' : './qdt-config.json';

// check env existence
if (fs.existsSync(envFile)) {
    // environment
    var qdt_e = require(envFile);

    // configurations
    var qdt_c = qdt_core.compileConfig(require(configFile), qdt_e);

    // group platform by source
    var grouped_platforms = qdt_core.groupPlatforms(qdt_c.platforms);

    // plugins: pug, sass, autoprefixer, minify-css, rename, concat and other
    var plugins = require('gulp-load-plugins')();

    // stream combiner 
    var streamCombiner = require('stream-combiner');

    // browser syncronization
    var browserSync = {};
    var browserSyncReload = {};

    Object.keys(qdt_c.platforms).forEach(function(platform) {
        browserSync[platform] = require('browser-sync').create();
        browserSyncReload[platform] = browserSync[platform].reload;
    });

    // typescript required libs
    var browserify = require("browserify");
    var vinyl_source = require('vinyl-source-stream');
    var vinyl_buffer = require('vinyl-buffer');
    var tsify = require("tsify");

    var pluginSettings = {
        autoPrefixer: {
            browfsers: ['> 1%', 'IE >= 8'],
            cascade: false
        },
        browserSyncReload: {
            stream: true
        },
        pug: {
            pretty: true
        }
    };
}

// test required
if (typeof process.argv[2] == 'undefined' || process.argv[2] != 'init') {
    if (!qdt_core.isReady(envFile, true)) {
        process.exit(0);
    }
}

var sourceAddTask = function(nameParam) {
    if (params.length === 0 || typeof params[nameParam] == 'undefined') {
        return console.log(colors.red(qdt_verbose.source_add_unk_name));
    }

    fs.exists("./sources/" + params[nameParam], function(exists) {
        if (exists) {
            return console.log(colors.red(qdt_verbose.source_add_exists_name));
        }

        gulp.src('./sources/sample/**/**').pipe(
            gulp.dest('./sources/' + params[nameParam])
        );

        console.log(colors.green(qdt_verbose.source_add_done.replace('[name]', params[nameParam])));
    });
};

gulp.task('source:add', function(done) {
    sourceAddTask('name');
    done();
});

gulp.task('source:remove', function(done) {
    if (params.length === 0 || typeof params.name == 'undefined') {
        return console.log(colors.red(qdt_verbose.source_remove_unk_name));
    }

    if (params.name == 'sample') {
        return console.log(colors.red(qdt_verbose.source_remove_sample_name));
    }

    fs.exists("./sources/" + params.name, function(exists) {
        if (!exists) {
            var message = qdt_verbose.source_remove_not_found_name.replace(
                '[name]', params.name
            );

            return console.log(colors.red(message));
        }

        del("./sources/" + params.name, {
            force: true
        }).then(res => {
            console.log(colors.green(qdt_verbose.source_remove_done.replace('[name]', params.name)));
        });
    });

    done();
});

var scss_compiler = function(platform, src, settings) {
    src = glob.sync(src);

    if (src.length == 0) {
        return;
    }

    if (!qdt_core.isPlatformTaskEnabled(platform, 'scss'))
        return;

    // notifiers
    var _doNotify = function(val) {
        qdt_core.doNotify('SCSS - Error', val);
    };

    var streams = [];

    // by default minify
    if (typeof settings.minify == 'undefined') {
        settings.minify = true;
    }

    streams.push(gulp.src(src));
    streams.push(plugins.sass({
        outputStyle: settings.minify ? "compressed" : "expanded",
        indentWidth: 4
    }))
    streams.push(plugins.autoprefixer(pluginSettings.autoPrefixer));
    streams.push(plugins.rename(settings.name));
    streams.push(gulp.dest(
        platform.paths.assets_root + '/css/' + settings.dest
    ));

    if (qdt_e.server.enabled && (qdt_e.server.watch_platforms == "all" ||
            qdt_e.server.watch_platforms.indexOf(platform.name) !== -1)) {
        streams.push(browserSync[platform.name].reload(
            pluginSettings.browserSyncReload
        ));
    }

    streamCombiner.apply(streamCombiner, streams).on('error', _doNotify);
};

var js_compiler = function(platform, src, _settings) {
    if (!qdt_core.isPlatformTaskEnabled(platform, 'js')) {
        return;
    }

    var dest = _settings.dest;
    var name = _settings.name;
    var sources = [];

    // notifiers
    var _doNotify = function(val) {
        qdt_core.doNotify('JavaScript - Error', val);
    };

    src.forEach(_src => {
        var result = glob.sync(_src);

        if (result.length > 0) {
            sources.push(result);
        }
    });

    sources = [].concat.apply([], sources);

    if (sources.length == 0) {
        return;
    }

    // return console.log(sources);
    for (var i = dest.length - 1; i >= 0; i--) {
        var stream = [];
        var hasTypeScript = sources.some(source => {
            return path.parse(source).ext == '.ts';
        });

        if (_settings.browserify) {
            // Browserify & Babelify
            var _browserify = browserify({
                basedir: '.',
                debug: true,
                entries: sources,
                cache: {},
                packageCache: {}
            });

            if (hasTypeScript || _settings.typeScript) {
                _browserify = _browserify.plugin(tsify);
            }

            stream.push(_browserify.transform('babelify', {
                presets: ["@babel/preset-env"],
                extensions: ['.js']
            }).bundle());

            // Required for Browserify & Babelify
            stream.push(vinyl_source(name));
            stream.push(vinyl_buffer());
        } else {
            if (hasTypeScript) {
                console.log(colors.red(
                    "\nWarning! \nTo compile TypeScript files, enable " +
                    "browserify option in your configuration file!\n"
                ));
            }

            stream.push(gulp.src(sources.reverse()));

            if (name) {
                stream.push(plugins.concat(name));
            }
        }

        // uglify output
        if (_settings.minify) {
            stream.push(plugins.uglify());
        }

        stream.push(plugins.insert.prepend(
            'let ENV = ' + JSON.stringify(platform.env_data) + ';'
        ));

        // sourcemap
        if (_settings.sourcemap) {
            stream.push(plugins.sourcemaps.init());
            stream.push(plugins.sourcemaps.write('./'));
        }

        stream.push(gulp.dest(platform.paths.assets_root + '/js/' + dest[i]));

        if (qdt_e.server.enabled && (qdt_e.server.watch_platforms == "all" ||
                qdt_e.server.watch_platforms.indexOf(platform.name) !== -1)) {
            stream.push(browserSync[platform.name].reload(
                pluginSettings.browserSyncReload
            ));
        }

        streamCombiner.apply(streamCombiner, stream).on('error', _doNotify);
    }
};

var assets_compiler = function(source) {
    // notifiers
    var _doNotify = function(val) {
        qdt_core.doNotify('Assets - Error', val);
    };

    var _grouped_platforms = grouped_platforms[source].filter(function(item) {
        if (typeof item.tasks.disabled.assets == 'object') {
            if (item.tasks.disabled.assets.indexOf('assets') != -1)
                return false;
        }

        return item;
    });

    if (_grouped_platforms.length === 0)
        return false;

    _grouped_platforms.map(function(item) {
        var list_assets = qdt_core.qdtBuidAssetPaths(item);

        for (var i = list_assets.length - 1; i >= 0; i--) {
            streamCombiner(
                gulp.src(list_assets[i].from),
                plugins.newer(list_assets[i].to),
                gulp.dest(list_assets[i].to)
            ).on('error', _doNotify);
        }
    });
};

var pug_compiler = function(source, platform, src, dest) {
    if (src.length == 0) {
        return;
    }

    if (!qdt_core.isPlatformTaskEnabled(platform, 'pug'))
        return;

    // notifiers
    var _doNotify = function(val) {
        qdt_core.doNotify('Pug - Error', val);
    };

    var streams = [];

    streams.push(gulp.src(src, {
            base: source
        }),
        plugins.pug(Object.assign(pluginSettings.pug, {
            data: {
                qdt_c: {
                    platform: platform
                }
            }
        })),
        gulp.dest(platform.paths.root + dest));

    if (qdt_e.server.enabled && (qdt_e.server.watch_platforms == "all" ||
            qdt_e.server.watch_platforms.indexOf(platform.name) !== -1))
        streams.push(browserSync[platform.name].reload(
            pluginSettings.browserSyncReload
        ));

    streamCombiner(streams).on('error', _doNotify);
};

let scssTask = (done) => {
    var _iif_scss = function(_k_scss, platform, group) {
        var _path = 'sources/' + _k_scss + '/scss/';

        scss_compiler(platform, _path + group.src, group);
    };

    // scss
    for (var k_scss in grouped_platforms) {
        for (var _a = grouped_platforms[k_scss].length - 1; _a >= 0; _a--) {
            var _scss_s = grouped_platforms[k_scss][_a].tasks.settings.scss;

            for (var _aa = _scss_s.length - 1; _aa >= 0; _aa--) {
                (_iif_scss)(k_scss, grouped_platforms[k_scss][_a],
                    grouped_platforms[k_scss][_a].tasks.settings.scss[_aa]);
            }
        }
    }

    done();
};

let jsTask = (done) => {
    var _iif_js = function(_k_js, platform, group) {
        var _path = 'sources/' + _k_js + '/js/';
        var _srv = [];
        var _settings = group;

        if (typeof group.src == "string") {
            group.src = [group.src];
        }

        for (var i = group.src.length - 1; i >= 0; i--) {
            _srv.push(_path + group.src[i]);
        }

        js_compiler(platform, _srv, _settings);
    };

    // js
    for (var k_js in grouped_platforms) {
        for (var _b = grouped_platforms[k_js].length - 1; _b >= 0; _b--) {
            var _js_s = grouped_platforms[k_js][_b].tasks.settings.js;

            for (var _ba = _js_s.length - 1; _ba >= 0; _ba--) {
                (_iif_js)(k_js, grouped_platforms[k_js][_b],
                    grouped_platforms[k_js][_b].tasks.settings.js[_ba]);
            }
        }
    }

    done();
};

let assetsTask = (done) => {
    for (var k in grouped_platforms) {
        assets_compiler(k);
    }

    done();
};

let pugTask = (done) => {
    var _iif = function(_k_pug, platform, group) {
        var _raw_src = [];
        var _path = 'sources/' + _k_pug + '/pug/';

        for (var i = group.src.length - 1; i >= 0; i--) {
            _raw_src.push(_path + group.src[i]);
        }

        pug_compiler(__dirname + '/' + _path + '/' + group.path, platform, _raw_src, group.dest);
    };

    // pug (ex. jade)
    for (var k_pug in grouped_platforms) {
        for (var i = grouped_platforms[k_pug].length - 1; i >= 0; i--) {
            var _pug_s = grouped_platforms[k_pug][i].tasks.settings.pug;

            for (var j = _pug_s.length - 1; j >= 0; j--) {
                (_iif)(k_pug, grouped_platforms[k_pug][i],
                    grouped_platforms[k_pug][i].tasks.settings.pug[j]);
            }
        }
    }

    done();
};

let serverTask = () => {
    if (typeof qdt_e.server.platform.pop == 'undefined')
        var platforms = [qdt_e.server.platform];
    else
        var platforms = qdt_e.server.platform;

    platforms.forEach(function(platform) {
        if (typeof qdt_c.platforms[platform] == 'undefined') {
            return console.log(colors.red(qdt_verbose.serv_plat_unknown));
        }

        if (!qdt_c.platforms[platform].server) {
            return console.log(colors.red(qdt_verbose.serv_path_unknown));
        }

        var _platform = qdt_c.platforms[platform];
        var path = _platform.paths.root + _platform.server.path;

        var server = {
            server: path,
            notify: true,
            open: false,
            port: _platform.server.port || 3000,
            ui: {
                port: (_platform.server.port || 3000) + 1,
            }
        };

        browserSync[platform].init(server);
    });
};

let watchTask = () => {
    var _iif_scss = function(_k_scss, platform, group) {
        var _watch_src = [];
        var _path = 'sources/' + _k_scss + '/scss/';

        group.src = _path + group.src;

        if (typeof group.watch == "string")
            group.watch = [group.watch];

        for (var j = group.watch.length - 1; j >= 0; j--)
            _watch_src.push(_path + group.watch[j]);

        gulp.watch(group.src).on('change', () => {
            scss_compiler(platform, group.src, group);
        });

        gulp.watch(_watch_src).on('change', () => {
            scss_compiler(platform, group.src, group);
        });
    };

    var _iif_assets = function(_k_assets) {
        gulp.watch('./sources/' + _k_assets + '/assets/**/*.*', function(cb) {
            assets_compiler(_k_assets);
        });
    };

    var _iif_js = function(_k_js, platform, group) {
        var _path = 'sources/' + _k_js + '/js/';
        var _raw_src = [];
        var _watch_src = [];
        var _settings = group;
        var _watch_src = [];

        if (typeof group.src == "string") {
            group.src = [group.src];
        }

        if (typeof group.watch == "string") {
            group.watch = [group.watch];
        }

        for (var i = group.src.length - 1; i >= 0; i--) {
            _raw_src.push(_path + group.src[i]);
        }

        if (typeof group.watch == "string") {
            group.watch = [group.watch];
        }

        for (var j = (group.watch || []).length - 1; j >= 0; j--) {
            _watch_src.push(_path + group.watch[j]);
        }

        gulp.watch(_raw_src).on('change', () => {
            js_compiler(platform, _raw_src, _settings);
        });

        gulp.watch(_watch_src).on('change', () => {
            js_compiler(platform, _raw_src, _settings);
        });
    };

    var _iif_pug = function(_k_pug, platform, group) {
        var _raw_src = [];
        var _watch_src = [];

        var _path = 'sources/' + _k_pug + '/pug/';

        if (typeof group.src == "string") {
            group.src = [group.src];
        }

        for (var i = group.src.length - 1; i >= 0; i--) {
            _raw_src.push(_path + group.src[i]);
        }

        if (typeof group.watch == "string") {
            group.watch = [group.watch];
        }

        for (var j = group.watch.length - 1; j >= 0; j--) {
            _watch_src.push(_path + group.watch[j]);
        }

        gulp.watch(_raw_src).on('change', (path) => {
            pug_compiler(__dirname + '/' + _path + '/' + group.path, platform, path, group.dest);
        });

        gulp.watch(_watch_src).on('change', () => {
            pug_compiler(__dirname + '/' + _path + '/' + group.path, platform, _raw_src, group.dest);
        });
    }

    // scss
    for (var k_scss in grouped_platforms) {
        for (var _a = grouped_platforms[k_scss].length - 1; _a >= 0; _a--) {
            var _scss_s = grouped_platforms[k_scss][_a].tasks.settings.scss;

            for (var _aa = _scss_s.length - 1; _aa >= 0; _aa--) {
                (_iif_scss)(k_scss, grouped_platforms[k_scss][_a],
                    grouped_platforms[k_scss][_a].tasks.settings.scss[_aa]);
            }
        }
    }

    // js
    for (var k_js in grouped_platforms) {
        for (var _b = grouped_platforms[k_js].length - 1; _b >= 0; _b--) {
            var _js_s = grouped_platforms[k_js][_b].tasks.settings.js;

            for (var _ba = _js_s.length - 1; _ba >= 0; _ba--) {
                (_iif_js)(k_js, grouped_platforms[k_js][_b],
                    grouped_platforms[k_js][_b].tasks.settings.js[_ba]);
            }
        }
    }

    // assets
    for (var k_assets in grouped_platforms)
        (_iif_assets)(k_assets);

    // pug (ex. jade)
    for (var k_pug in grouped_platforms) {
        for (var i = grouped_platforms[k_pug].length - 1; i >= 0; i--) {
            var _pug_s = grouped_platforms[k_pug][i].tasks.settings.pug;

            for (var j = _pug_s.length - 1; j >= 0; j--) {
                (_iif_pug)(k_pug, grouped_platforms[k_pug][i],
                    grouped_platforms[k_pug][i].tasks.settings.pug[j]);
            }
        }
    }
};

let initTask = (done) => {
    (new Promise(function(resolve) {
        resolve(fs.existsSync(envFile));
    })).then(function(exists) {
        return new Promise(function(resolve) {
            // environment configs not exists
            if (!exists) return resolve(null);

            // ask to override
            qdt_core
                .ask(qdt_verbose.task_init_env_exists, true)
                .then(resolve);
        });
    }).then(function(resp) {
        if (resp === false) {
            return console.log(qdt_verbose.task_init_keep_env) && done();
        }

        if (resp === null) {
            console.log(qdt_verbose.task_init_gen_env);
        }

        if (resp === true) {
            console.log(qdt_verbose.task_init_override_env);
        }

        var sampleEnvFile = './qdt-env.sample.js';

        if (!fs.existsSync(sampleEnvFile)) {
            sampleEnvFile = './qdt-env.sample.json';
        }

        // create env config file
        fs.FileReadStream(sampleEnvFile).pipe(fs.FileWriteStream(
            './qdt-env.js'
        ));

        if (params != 'undefined' && typeof params['source'] != 'undefined')
            sourceAddTask('source');
    });

    done();
};

let clearTask = (done) => {
    let paths = Object.values(qdt_c.platforms).map((platform) => {
        if (qdt_e.platforms.enabled.indexOf(platform.name) === -1) {
            return [];
        }

        if (!platform.paths.clean_paths) {
            return [];
        }

        if (typeof platform.paths.clean_paths == 'string') {
            return [platform.paths.clean_paths];
        }

        return platform.paths.clean_paths;
    }).reduce((arr, value) => {
        return arr.concat(value);
    }, []);

    del(paths, {
        force: true
    }).then(() => done());
};

// cleaner
gulp.task('clean', clearTask);

// cleaner alias
gulp.task('clear', clearTask);

// scss task
gulp.task('scss', scssTask);

// javascript task
gulp.task('js', jsTask);

// assets task
gulp.task('assets', assetsTask);

// pug task
gulp.task('pug', pugTask);

// warch processing
gulp.task('watch', gulp.parallel([serverTask, watchTask]));

// serve processing
gulp.task('server', serverTask);

// initialize qdt on fresh install
gulp.task('init', initTask);

// warch processing
gulp.task('compile', gulp.series([scssTask, pugTask, jsTask, assetsTask]), done => done());

// default task
gulp.task('default', gulp.series(['compile', 'watch']), done => done());