/*
nihop.js 

Not-Invented-Here Options Parser

"the options parser dominic tarr wrote."

*/

//.option(long,short,numberOfArgs).do(function).usuage("line in usuage")

//which would return 

//{name: [args] or return value of function

var log = console.log

module.exports = Nihop

function Nihop(command,banner){
  if(!(this instanceof Nihop)) return new Nihop(command,banner)
  this.options = {}
  this.funx = {}
  this.doc = {}
  this.length = {}
  this.command = command
  this.banner = banner
  this.option('help','h').do(function (){
    console.log(this.usuage())
  }).describe('display this help message')
}

function isOption(arg,long,short){
  return new RegExp("^-+(" + long + "|" + short+")$").exec(arg)
}

Nihop.prototype = {
  option: function (long,short,length){
    var self = this
    this.newOption = long

    this.length[long] = length

    this.options[long] = {
      length: length || 0
    , long: long
    , short: short
    , parse: function (args){

      if(!isOption(args[0],long,short))
          return false;

        var option = args.shift() //option name

        if(!length)
          return true
        else if (length == 1){
          var a =  args.shift()
          return self.assertNotOption(a,"ERROR:\nexpected a value for option " + option + " not '" + a + "'\n")
        }
        else if( length > 0){
          var r = []
          for(var i = 0; i < length; i ++){
            var a = args.shift()
            self.assertNotOption(a, 
                "ERROR:\nexpected " + length + " values for " + option 
              + " got: " + r.join(' ') + " then unexpected option: '" + a + "'\n")
            r.push(a)
          }
          return r
        } else {
          var r = []
          //stop if it's end of args list, or a new option is starting
          while(args.length && args[0][0] != '-'){
            r.push(args.shift())
          }
          return r
        }
      }

    }

    return this
  },

  parse: function (args){
    var parsed = {args: []}
    var self = this
    
      //setup default values
    for(var name in self.options){
      if(self.options[name].default)
        parsed[name] = self.options[name].default
    }
    
      
      function find (args){
        for(var name in self.options){
          var option = self.options[name]
          var r = option.parse (args)

          if(r){
            parsed[name] = r
            option.value = r

            if(option.do)
              option.do.call(self,r,option)
          
            return true
          }
        }
      }
      
      while(args.length){
        if(!find(args)){
          var arg = args.shift()

          this.assertNotOption(arg,"ERROR:'" + arg + "' is not a known option.")

          parsed.args.push(arg) 
          if(this.doArg)
            this.doArg(arg)
        }
      }
    return parsed
  },
  do: function (func){
    this.options[this.newOption].do = func

    return this
  },
  arg: function (func){
    this.doArg = func
    return this
  },
  describe: function (desc,args){
    this.options[this.newOption].describe = desc
    this.options[this.newOption].args = args
    
    return this
  },
  usuage: function (){
    var u = ''
    if(this.banner)
    u += this.banner + '\n'
    if(this.command)
    u += this.command + '\n'

    var max = 0
      , self = this
    u +=
    Object.keys(this.options).map(function (name){
      var option = self.options[name]
    
      cmd = option.long == option.short ?  '-' + option.long  : '-' + option.short + ',--' + option.long
    
      var doc = 
      { cmd: '  ' + cmd + ' ' + (option.args || '')
      , desc: option.describe }
      max = max > doc.cmd.length ? max : doc.cmd.length      
      return doc
    }).map(function (doc){
      return pad(doc.cmd,max + 5) + doc.desc
    }).join('\n')
    
    return u
  },
  assertNotOption: function (arg, message){
    if(arg[0] == '-'){
      throw (message || "did not expect option '" + arg + "' at this point") + this.usuage()
    }
    return arg
  },
  default: function (value){
    this.options[this.newOption].default = value
    return this
  }
}

function pad(string,length){
  while(string.length < length)
    string += ' '
  return string
}