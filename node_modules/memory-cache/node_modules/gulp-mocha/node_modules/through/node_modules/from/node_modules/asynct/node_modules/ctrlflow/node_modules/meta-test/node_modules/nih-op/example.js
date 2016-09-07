var Nihop = require('nih-op')
  , inspect = require('sys').inspect
  , parser = 
  new Nihop ("node example [options]\n", "a banner that goes above the command\n")
    .option ("boolean","b",0)
    /*
      long,short,arity 
      
      (number of values associated)
        0: boolean
      ,-1: array untill next option or end of args
      , 1: string
      , n: fixed length array
    */
      .do(dumpOptionValue)
    /*
      do(function (value,option){...})
      value that user supplied.
      option is object which represents this value
        { long: longname
        , short: ...
        , do: function to be called as this arg is parsed.
        , describe: see .describe(), displayed my Nihop.usuage()
        , arg: representation of args to this option (if is not boolean)
        , length: arity of this option
        }      
      
     */ 
       .describe("an example boolean option")
     .option("primitive","p",1)
       .do(dumpOptionValue)
       .describe("an example valued option", "[value]")//
      /*
        description of option, second arg represents the 'variable name' of the option
      
        will be shown in usuage, or --help
        -p,--primitive [value]       an example valued option
      */
     .option("list","l",-1)     
       .do(dumpOptionValue)
       .describe("a list of values, space seperated", "[value ...]")
     .option("fixed","f",3)     
       .do(dumpOptionValue)
       .describe("a list 3 values, space seperated", "[value1 value2 value3]")
     .arg(function (value){
      //process an unoptioned arg as it is parsed.
      console.log("arg:" + value)
     })

function dumpOptionValue(value,option){
  console.log("value:" + inspect(value))
  console.log("option:" + inspect(option))
}

var d = parser.parse(process.argv.slice(2)) //cut away ['node' './example.js']

console.log("Parsed:")
console.log(inspect(d))
