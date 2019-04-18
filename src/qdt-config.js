module.exports = {
    platforms: {
        "*": {
            "source": "base",
            "libs": {
                // please disable libraries you don't need
                "jquery": true,
                "bootstrap_3": false,
                "angular": true,
                "angular_2": false,
                "underscore": true,
                "underscore.string": true,
                "mdi": true
            },
            "libs_data": {},
            // overwrite this paths in your platform
            "paths": {
                "root": false,
                "assets_root": false,
                "clean_paths": false
            },
            // add here libraries from node_modules
            "assets": [{
                "from": "resources/assets/**/*",
                "to": "assets"
            }, {
                "from": "../../node_modules/showdown/dist/showdown.min.js",
                "to": "assets/dist/showdown",
            }, {
                "from": "../../node_modules/angular-sanitize/angular-sanitize.min.js",
                "to": "assets/dist/angular-sanitize",
            }, {
                "from": "../../node_modules/angular-markdown-directive/markdown.js",
                "to": "assets/dist/angular-markdown-directive",
            }],
            // browsersync configurations (ex: ip, port and path)
            "server": false,
            // tasks configs
            "tasks": {
                // disable tasks
                "disabled": {
                    "pug": false,
                    "js": false,
                    "assets": false
                },
                // tasks details, ex: source, destination, minify and etc. 
                "settings": {
                    "js": [{
                        "src": [
                            "app.js"
                        ],
                        "watch": [
                            "angular-1/**/**.js",
                            "angular-1/**/**.json",
                        ],
                        "dest": "/",
                        "name": "app.js",
                        "minify": false,
                        "sourcemap": true,
                        "browserify": true
                    }, {
                        "src": [
                            // "raw/**/*.js"
                        ],
                        "dest": "/raw",
                        "path": "/raw",
                        "minify": true,
                        "sourcemap": false,
                        "browserify": false
                    }],
                    "scss": [{
                        "src": "style.scss",
                        "watch": "includes/**/*.scss",
                        "path": "/",
                        "name": "style.min.css",
                        "minify": true
                    }],
                    "pug": [{
                        "path": "/",
                        "src": ["*.pug"],
                        "watch": ["layout/**/*.pug"],
                        "path": "/"
                    }, {
                        "path": "/tpl",
                        "src": ["tpl/**/*.pug"],
                        "dest": "/assets/tpl"
                    }]
                }
            }
        },
        "docs": {
            "source": "docs",
            "paths": {
                "root": "../dist/docs",
                "assets_root": "../dist/docs/assets",
                "clean_paths": [
                    "../dist/docs"
                ]
            },
            "server": {
                "path": "/",
                "port": 2000
            }
        }
    }
};