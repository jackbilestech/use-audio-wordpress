
var ncp = require('ncp').ncp;
 
ncp.limit = 16;
 
ncp('./src/wp', './wp-dist', function (err) {
 if (err) {
   return console.error(err);
 }
 console.log('done copying files!');
});

ncp('./dist', './wp-dist/libs', function (err) {
    if (err) {
      return console.error(err);
    }
    zipFolder('./wp-dist', `./dist/${pkg.name}.zip`, function(err) {
        if(err) {
            console.log('oh no!', err);
        } else {
            console.log('wordPress Plugin Zipped');
        }
    });
   });

var pkg = require('./package.json')


var zipFolder = require('zip-folder');
 
