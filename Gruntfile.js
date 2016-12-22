// Gruntfile.js
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    // Linting
    jshint: {
      all: ['public/scripts/**/*.js']
    },
    // Starting Mongo server locacally
    shell: {
      npm: {
        command: 'npm install',
        options: {
          stdout: true,
          stderr: true,
          failOnError: true,
        },
      },
      mongodb: {
        command: 'mongod --dbpath ./data/db',
        options: {
          async: true,
          stdout: false,
          stderr: true,
          failOnError: true,
          execOptions: {
            cwd: '.'
          }
        }
      },
      server: {
        command: 'node server.js',
        options: {
          failOnError: true,
        }
      }
    },
    // Start the server
    express: {
      options: {
        // Override defaults here
        script: './server.js'
      },
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'shell']);

};
