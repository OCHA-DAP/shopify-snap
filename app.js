/**
 * Module dependencies.
 */
var config = require('config');
var express = require('express');
var RasterizerService = require('./lib/rasterizerService');
var FileCleanerService = require('./lib/fileCleanerService');

process.on('uncaughtException', function (err) {
  console.error("[uncaughtException]", err);
  process.exit(1);
});

process.on('SIGTERM', function () {
  process.exit(0);
});

process.on('SIGINT', function () {
  process.exit(0);
});

// web service
var app = express();
app.configure(function(){
  app.use(express.static(__dirname + '/public'))
  app.use(app.router);
  app.set('rasterizerService', new RasterizerService(config.rasterizer).startService());
  app.set('fileCleanerService', new FileCleanerService(config.cache.lifetime));
});
app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
require('./routes')(app, config.server.useCors);
var host = process.env.HOST || config.server.host || '127.0.0.1';
var port = process.env.PORT || config.server.port || 3000;
app.listen(port, host);
console.log('Express server listening on ' + host + ':' + port);
