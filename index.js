"use strict";

var fs   = require('fs');
var path = require('path');

var mkdirpSync = function (dirpath) {
  var parts = dirpath.split(path.sep);
  for( var i = 1; i <= parts.length; i++ ) {
    var dir = path.join.apply(null, parts.slice(0, i));
    if (!fs.existsSync( dir )) fs.mkdirSync( dir );
  }
}

module.exports = function(confpath) {
	var _path = path.resolve(confpath || __dirname, 'conf');
	//mkdirpSync(_path);
	_path = path.resolve(_path, process.env.NODE_ENV || 'production');
	mkdirpSync(_path);

	return {
		path: _path,
		get: function(name, def) {
			var fn = path.resolve(this.path, name + '.json');
			def = def || null;
			if (!fs.existsSync(fn)) {
				return def;
			}
			var data = fs.readFileSync(fn);
			try {
				return JSON.parse(data);
			}
			catch(e) {
				return null;
			}
		},
		set: function(name, value) {
			var fn = path.resolve(this.path, name + '.json');
			fs.writeFileSync(fn, JSON.stringify(value));
		}
	}
	
};