var username = 'okadbadmloc';
var password = 'DatabaseLoc';
var jwtSecret = 'JWTIncr3di';
var host = 'http://api.daltonicchameleon.com';
var port = '3000';
var keypath = './.config/key.pem';
var certpath = './.config/cert.pem';

module.exports = {

	'mongoConnection': 'mongodb://' + username + ':' + password + '@127.0.0.1:27017/incredifolio-loc',
	'jwtSecret': jwtSecret,
	'host': host,
	'port': port,
	'keypath': keypath,
	'certpath': certpath

}