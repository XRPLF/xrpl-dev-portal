module.exports = function ( grunt ) {

   /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */

   grunt.loadNpmTasks('grunt-contrib-less');
   grunt.loadNpmTasks('grunt-contrib-watch');

	var taskConfig = {

		less: {
			compile: {
				files: {
					"www/css/main.css": "www/less/main.less"
				}
			}
		},

		delta: {

	      options: {
	        livereload: true
	      },

	      /**
	       * When the LESS files change, we need to compile and minify them.
	       */
	      less: {
	        files: [ 'www/**/*.less' ],
	        tasks: [ 'less:compile' ],
	      },

	    }
	}

	grunt.config.init(taskConfig);

	grunt.renameTask( 'watch', 'delta' );
  	grunt.registerTask( 'watch', [ 'less:compile', 'delta' ] );


	grunt.registerTask('default', ['less:compile']);

}