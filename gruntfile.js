module.exports = function(grunt)
{
	/**
     *  Variables
     **/
    var path = {
        tmp:            'web/tmp',
        src:            'web/src',
        html:           'web/src/html',
        css:			'web/src/css',
        js:             'web/src/js',
        res:            'web/src/res',
        modules:        'node_modules',
		build: {
			debug:    'web/build/debug',
	        release:  'web/build/release'
		}
    };


    grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			debug: {
				options: {
					sourceMap: true
				},
                files: [{
                    src: [
                        path.js + '/**/*.js'
    				],
    				dest: path.build.debug + '/js/app.js'
                }]
			}
        },

		uglify: {
			options: {
				sourceMap: false,
				compress: {
					drop_console: false
				}
			},
			release: {
				files: [{
                    src: [
                        path.js + '/**/*.js'
    				],
    				dest: path.build.release + '/js/app.js'
                }]
			}
		},

		postcss: {
			debug: {
				options: {
					map: {
						inline: false
					},
					processors: [
						require("postcss-import")(),
						require("postcss-cssnext")({
							warnForDuplicates: false
						}),
						require('cssnano')(),
						require('pixrem')(),
						require('autoprefixer')({
							browsers: 'last 2 versions'
						})
					]
				},
				files: [{
					src: path.css + '/app.css',
					dest: path.build.debug + '/css/app.css'
				}]
			},
			release: {
				options: {
					map: false,
					processors: [
						require("postcss-import")(),
						require("postcss-cssnext")({
							warnForDuplicates: false
						}),
						require('cssnano')(),
						require('pixrem')(),
						require('autoprefixer')({
							browsers: 'last 2 versions'
						})
					]
				},
				files: [{
					src: path.css + '/app.css',
					dest: path.build.release + '/css/app.css'
				}]
			}
		},

		replace: {
            debug: {
                src: [
    				path.build.debug + '/**/*.html',
    				path.build.debug + '/**/*.json',
    				path.build.debug + '/**/*.js'
    			],
                overwrite: true,
				replacements: [
                    {
    					from: 	'{{ version }}',
    					to: 	'<%= pkg.version %>'
    				},
                    {
    					from: 	'{{ name }}',
    					to: 	'<%= pkg.name %>'
    				},
                    {
    					from: 	'{{ author }}',
    					to: 	'<%= pkg.author %>'
    				},
                    {
    					from: 	'{{ author_mail }}',
    					to: 	'<%= pkg.author_mail %>'
    				},
                    {
    					from: 	'{{ description }}',
    					to: 	'<%= pkg.description %>'
    				},
                    {
                        from:   '{{ timestamp }}',
                        to:     new Date().getTime()
                    }
                ]
            },
            release: {
                src: [
    				path.build.release + '/**/*.html',
    				path.build.release + '/**/*.json',
    				path.build.release + '/**/*.js'
    			],
                overwrite: true,
				replacements: [
                    {
    					from: 	'{{ version }}',
    					to: 	'<%= pkg.version %>'
    				},
                    {
    					from: 	'{{ name }}',
    					to: 	'<%= pkg.name %>'
    				},
                    {
    					from: 	'{{ author }}',
    					to: 	'<%= pkg.author %>'
    				},
                    {
    					from: 	'{{ author_mail }}',
    					to: 	'<%= pkg.author_mail %>'
    				},
                    {
    					from: 	'{{ description }}',
    					to: 	'<%= pkg.description %>'
    				},
                    {
                        from:   '{{ timestamp }}',
                        to:     new Date().getTime()
                    }
                ]
            }
		},

		copy: {
            debug: {
                files: [{
                    src: '**/*',
					dest: path.build.debug,
                    cwd: path.res,
                    expand: true
                }]
            },
            release: {
                files: [{
                    src: '**/*',
					dest: path.build.release,
                    cwd: path.res,
                    expand: true
                }]
            }
		},

		includereplace: {
			options: {
				prefix: '<',
				suffix: '>',
				includesDir: path.html
			},
            debug: {
				expand: true,
                src: [
                    '**/*.html',
                    '!widget/**/*.html',
                    '!layout/**/*.html',
                    '!program/**/*.html',
					'!module/**/*.html',
					'!block/**/*.html'
                ],
                dest: path.build.debug + '/',
                cwd: path.html
            },
			release: {
				expand: true,
                src: [
                    '**/*.html',
                    '!widget/**/*.html',
                    '!layout/**/*.html',
                    '!program/**/*.html',
					'!module/**/*.html',
					'!block/**/*.html'
                ],
                dest: path.build.release + '/',
                cwd: path.html
			}
        },

		watch: {
			options: {
				spawn: false,
				livereload: true,
				dateFormat: function(time)
                {
					grunt.log.subhead('>> Waiting for more changes...');
				}
			},
            html: {
                files: path.html + '/**/*.html',
                tasks: [
                    'includereplace:debug',
					'replace:debug'
                ]
            },
			css: {
				files: path.css + '/**/*.css',
				tasks: [
					'postcss:debug'
				]
			},
			js: {
				files: path.js + '/**/*.js',
				tasks: [
					'concat:debug'
				]
			},
			gruntcopy: {
				files: 'gruntcopy.json',
				tasks: [
					'copy:debug',
                    'replace:debug'
				]
			},
            res: {
                files: path.res + '/**/*',
                tasks: [
                    'copy:debug',
                    'replace:debug'
                ]
            }
		}
    });






	//////////////////////
	//////// TASK ////////
	//////////////////////

	require('load-grunt-tasks')(grunt);

	// Debug
	grunt.registerTask('default', [
		'includereplace:debug',
		'postcss:debug',
		'concat:debug',
        'copy:debug',
        'replace:debug',
        'watch'
	]);

	// Release
	grunt.registerTask('release', [
		'includereplace:release',
		'postcss:release',
		'uglify:release',
		'copy:release',
		'replace:release',
		'uglify:release'
	]);
};
