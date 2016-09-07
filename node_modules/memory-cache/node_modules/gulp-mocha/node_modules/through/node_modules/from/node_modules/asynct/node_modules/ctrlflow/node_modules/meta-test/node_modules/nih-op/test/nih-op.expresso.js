var Nihop = require('nih-op')
  , assert = require('assert')

exports ['single boolean option'] = function (){


  var parser = Nihop("test").option('test','t',0)
  
  assert.deepEqual(parser.parse(['--test']), {test: true, args: []})
  assert.deepEqual(parser.parse(['-t']), {test: true, args: []})
  assert.deepEqual(parser.parse(['-t', 123]), {test: true, args: [123]})
}

exports ['options with single arg'] = function (){

  var parser = Nihop("test").option('x','x',1).option('y','y',1)

  assert.deepEqual
    ( parser.parse(['--x', 'hello'])
    , {x: 'hello', args: []})

  assert.deepEqual
    ( parser.parse(['--x', 'hello', '-y', 'goodbye'])
    , {x: 'hello', y: 'goodbye', args: []})
}

exports ['options with fixed args'] = function (){

  var parser = Nihop("test").option('x','x',2).option('y','y',3)

  assert.deepEqual
    ( parser.parse(['--x', 'hello', 'john'])
    , {x: ['hello','john'] , args: []})

  assert.deepEqual
    ( parser.parse(['--x', 'hello', 'there', '-y', 1,2,3])
    , {x: ['hello', 'there'], y: [1,2,3], args: []})
}

exports ['options with vairable args'] = function (){

  var parser = Nihop("test").option('x','x',-1).option('y','y',-1)

  assert.deepEqual
    ( parser.parse(['--x', 'hello', 'john'])
    , {x: ['hello','john'] , args: []})

  assert.deepEqual
    ( parser.parse 
      ( [ '--x', 'hello', 'there'
        , '-y', 1,2,3 ] )
    , { x: ['hello', 'there']
      , y: [1,2,3], args: [] } )
}

exports ['call a function with args'] = function (){
  var isCalled1 = false
    , isCalled2 = false
    , isCalled3 = false

  var parser = Nihop("test")

  parser
    .option('true','t').do(function (bool,option){
      assert.ok(bool)
      assert.equal(option.long,'true')
      assert.equal(this,parser)
      isCalled1 = true
    })
    .option('false','f').do(function (bool,option){
      assert.ok(bool)
      assert.equal(option.long,'false')
      assert.equal(this,parser)
      isCalled2 = true
    })
    .option('value','v',1).do(function (value,option){
      assert.equal(value,10)
      assert.equal(option.long,'value')
      assert.equal(this,parser)
      isCalled3 = true
    })
    
    parser.parse(['--true', '-f','-v', 10])
    
    assert.ok(isCalled1)
    assert.ok(isCalled2)
    assert.ok(isCalled3)
}

exports ['call .arg function when no matching option'] = function (){
  var parser = Nihop("test")
    , isCalled = 0
  parser
    .option ('x','x')
    .option ('y','y')
    .option ('z','z')
    .arg(function (value){
      assert.equal(this,parser)
      isCalled ++
      switch (value){
        case 1:
          assert.equal(this.newOption,'x')
        case 2:
          assert.equal(this.newOption,'y')
        case 3:
          assert.equal(this.newOption,'z')
      }
   })
   
 parser.parse("-x x -y y -z z".split(' '))
 
 assert.equal(isCalled,3)
}

exports ['generate usuage'] = function (){

  var parser = Nihop("test [options] [args]\n", "#############BANNER############\nexample for nih-op\nnot-invented-here options parser\n")
    .option('array','a',-1)
      .describe("list of values", "[list ...]")
    .option('boolean','b')
      .describe("include if true")
    .option('value','v')
      .describe("set value to x", '[x]')
      
  var u = parser.usuage()
  console.log(u)
  assert.ok(~u.indexOf("array"))
  assert.ok(~u.indexOf("boolean"))
  assert.ok(~u.indexOf("value"))
  assert.ok(~u.indexOf("list of values"))
  assert.ok(~u.indexOf("include if true"))
  assert.ok(~u.indexOf("set value to x"))
//  parser.parse(['--help'])
}

exports ['forgives long/short mismatch'] = function (){
  
  
  var parser = Nihop("test").option('exe','x').option('why','y')

  assert.deepEqual
    ( parser.parse(['--x', '--y'])
    , {exe: true, why: true, args: []})

  assert.deepEqual
    ( parser.parse(['-exe', '-why'])
    , {exe: true, why: true, args: []})

}

exports ['throws on unexpected option'] = function (){
  
  var parser = Nihop("test").option('exe','x').option('why','y', 1).option('now','n', 3)

  assert.throws(function(){
    parser.parse(['--zed', '--y'])
  })

  assert.throws(function(){
    parser.parse(['-y', '-x']) //expects value of y, not another option '-x'
  })

  assert.throws(function(){
    parser.parse(['-n','a','b','--x']) //expects value of y, not another option '-x'
  })

}

exports ['default values'] = function (){
  
 var parser = Nihop("test").option('exe','x').default(1234)
 
  assert.deepEqual
    ( parser.parse(["hello"])
    , {exe: 1234, args: ["hello"]})

}