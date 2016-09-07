var testutil = require('testutil')
  , path = require('path-extra')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf');


endsWith = function(s, suffix) {
  var l;
  l = s.length - suffix.length;
  return l >= 0 && s.indexOf(suffix, l) === l;
};

describe('testutil', function() {
  describe('+ createBuffer()', function() {
    it('should create a buffer of size N with random data', function() {
      var buf;
      buf = testutil.createBuffer(10);
      T(buf.length === 10);
    })
  })

  describe('+ createFileWithData()', function() {
    it('should create a file specified at by file path filled with random data of size N', function() {
      var buf, filePath;
      filePath = path.join(path.tempdir(), Date.now() + '');
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      testutil.createFileWithData(filePath, 10);
      T(fs.existsSync(filePath));
      buf = fs.readFileSync(filePath);
      T(buf.length === 10);
    })
    
    it('+ should return the file path of the file created()', function() {
      var filePath, filePath2;
      filePath = path.join(path.tempdir(), Date.now() + '');
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      filePath2 = testutil.createFileWithData(filePath, 10);
      return T(filePath2 === filePath);
    })
  })

  describe('+ fetchTestFiles()', function() {
    it('should return the test files in the specified directory', function(done) {
      testutil.fetchTestFiles('./', function(files) {
        EQ (files.length, 2)
        done();
      })
    })
  })

  describe('+ createTestDir()', function() {
    describe('> when it doesnt exist', function() {
      it('should create a test dir', function() {
        var dir;
        dir = path.join(path.tempdir(), 'test-myapp');
        if (fs.existsSync(dir)) {
          rimraf.sync(dir);
        }
        F(fs.existsSync(dir));
        testutil.createTestDir('myapp');
        T(fs.existsSync(dir));
      })
    })

    describe('> when it exists', function() {
      it('should delete the dir and create it', function() {
        var dir = path.join(path.tempdir(), 'test-myapp');
        rimraf.sync(dir);
        mkdirp.sync(dir);
        
        fs.writeFileSync(path.join(dir, 'blah'), 'afafaf');
        T (fs.existsSync(dir));
        
        testutil.createTestDir('myapp');
        T (fs.existsSync(dir));
        T (fs.readdirSync(dir).length === 0);
      })
    })
  })

  describe('+ md5', function() {
    it('should compute the md5 of the data', function() {
      T (testutil.md5('some data') === '1e50210a0202497fb79bc38b6ade6c34')
    })
  })

  describe('+ shell', function() {
    it('should exist', function() {
      T (testutil.shell)
    })
  })
})


