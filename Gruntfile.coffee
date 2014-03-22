module.exports = (grunt) ->
  grunt.initConfig(
    pkg: grunt.file.readJSON("package.json")
    srcDir: "./src"
    srcDirScss: "<%= srcDir %>/scss"
    srcDirCoffee: "<%= srcDir %>/coffee"
    outputDir: "./game"
    cssOutput: "<%= outputDir %>/css"
    jsOutput: "<%= outputDir %>/js"
    cssRequestPath: "/css"
    jsRequestPath: "/js"

    compass:
      dist:
        options:
          sassDir: "<%= srcDirScss %>"
          cssDir: "<%= cssOutput %>"

    coffee:
      development:
        expand: true
        cwd: "<%= srcDirCoffee %>"
        src: ["**/*.coffee"]
        dest: "<%= jsOutput %>"
        ext: ".js"
      production:
        expand:true
        cwd: "<%= srcDirCoffee %>"
        src: ["**/*.coffee"]
        dest: "<%= jsOutput %>"
        ext: ".js"

    haml:
      development:
        expand: true
        cwd: "<%= srcDir %>"
        src: ["**/*.haml"]
        dest: "<%= outputDir %>"
        ext: ".html"

    watch:
      coffee:
        files: "<%= srcDirCoffee %>/**/*.coffee"
        tasks: ["coffee:development"]
      css:
        files: "<%= srcDirScss %>/**/*.scss"
        tasks: ["compass:dist"]
      haml:
        files: "<%= srcDir %>/**/*.haml"
        tasks: ["haml:development"]

    clean: ["<%= cssOutput %>","<%= jsOutput %>"]
  )

  grunt.loadNpmTasks('grunt-contrib-haml')
  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-contrib-coffee')
#  grunt.loadNpmTasks('grunt-contrib-requirejs')
#  grunt.loadNpmTasks('grunt-contrib-clean')

  grunt.registerTask('default', ['haml:development', 'coffee:development','compass:dist'])
  grunt.registerTask('production',['haml:development', 'compass:dist','coffee:production'])