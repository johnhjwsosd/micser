global.apilist = [];
require('./connectmsd')
var restify = require('restify');
var api = require('./api');
var db = require('./lib/db');
var config = require('./config/config');
var server = restify.createServer({
    name: config.MicroService.Name,
    version: config.MicroService.Ver
});
global.conf = config;
global.db = db;




server.get('/:cmd', api.base.get);
server.post('/:cmd', api.base.post);


server.listen(config.Service.Port, function() {
    console.log('%s listening at %s', server.name, server.url);
});


process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});