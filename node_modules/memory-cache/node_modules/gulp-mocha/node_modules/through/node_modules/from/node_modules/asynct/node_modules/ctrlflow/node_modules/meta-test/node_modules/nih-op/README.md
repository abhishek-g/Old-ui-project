#Not-Invented-Here Options Parser#

the options parser Dominic Tarr wrote

##finally, an options parser you can trust!##

+ make your options parse 
+ usuage generation 
+ error messages if syntax wrong
+ good test coverage

quick example:

    var Nihop = require('nih-op')
    , parser = 
    new Nihop ("node example [options]\n", "a banner that goes above the command\n")
      .option ("boolean","b",0)
        .do(function)//called after this option is parsed
        .describe("an example boolean option")//describe this option for usuage
      .arg(function)//called after a free argument is parsed


see nih-op/example.js for more depth.