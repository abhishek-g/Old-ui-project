deepmerge = require 'deepmerge'

module.exports = ->

  @initConfig
    pkgFile: 'package.json'

    # JSHint
    jshint:
      node:
        # The node files you want to check
        src: ['bin/**/*.js']
        options: (deepmerge (require './common/jshint-node.json'),
          # Custom node files configuration (override the default node configuration file)
          strict: true
        )
      options: (deepmerge (require './common/jshint.json'),
        # Custom global configuration (override the default global configuration file)
          strict: true
      )

    # JSCS
    jscs:
      # The files you want to check
      all: ['bin/**/*.js']
      options:
        config: './common/jscs.json'
        # Custom configuration (override the default configuration file)
        disallowSpaceAfterKeywords: []

    # CoffeeLint
    coffeelint:
      # The files you want to check
      all: ['Gruntfile.coffee']
      options:
        configFile: './common/coffeelint.json'
        # Custom configuration (override the default configuration file)
        max_line_length:
          value: 100

  # Load tasks
  @loadNpmTasks 'grunt-contrib-jshint'
  @loadNpmTasks 'grunt-jscs-checker'
  @loadNpmTasks 'grunt-coffeelint'

  # Register tasks
  @registerTask 'lint', ['coffeelint', 'jshint', 'jscs']
  @registerTask 'default', ['lint']
