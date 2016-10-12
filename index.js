"use strict";

var fs   = require('fs');
var path = require('path');

var mkdirpSync = function (dirpath) {
    var parts = dirpath.split(path.sep);
    for( var i = 1; i <= parts.length; i++ ) {
        var dir = (process.platform == 'win32' ? '' : path.sep) 
					+ path.join.apply(null, parts.slice(0, i));
        if (!fs.existsSync( dir )) {
            fs.mkdirSync( dir );
        }
    }
}
// TODO runtime cache values
// TODO change events
module.exports = function(confpath) {
	var _path = path.resolve(confpath || __dirname, 'conf');
	//mkdirpSync(_path);
	_path = path.resolve(_path, process.env.NODE_ENV || 'production');
	mkdirpSync(_path);

	return {
		path: _path,
		get: function(name, def) {
			def = def || null;
			if (!this.exists(name)) {
				return def;
			}
			var fn = path.resolve(this.path, name + '.json');
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
		},
		unset: function(name) {
		    var fn = path.resolve(this.path, name + '.json');
		    fs.unlinkSync(fn);
		},
		exists: function(name){
		    var fn = path.resolve(this.path, name + '.json');
		    try {
		        fs.statSync(fn);
		        return true;
		    }
		    catch(e) {
		        return false;
		    }
		},
		list: function() {
		    var list = fs.readdirSync(this.path);
		    return list
		        .filter(function(file){
		            return path.extname(file) == '.json';
		        })
		        .map(function(file){
		            return path.basename(file, '.json');
		        });
		}
	}
	
};