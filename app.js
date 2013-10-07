"use strict";

var express = require('express'),
    Resource = require('express-resource');

module.exports = function (options) {
  options = options || {};
  options = {
    port: options.port || process.env.PORT || 5000
  };

  var app = express();

  app.configure('development', function () {
    app.use(express.logger('dev'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function () {
    app.use(express.logger());
    app.use(express.errorHandler({ showMessage: true, showStack: false }));
  });

  app.configure(function () {
    app.set('port', options.port);

    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
  });

  return app;
};
