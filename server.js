"use strict";

var makeApp = require('./app'),
    http = require('http'),
    usableCpus = require('os').cpus().length - 1,
    argv = parseOpts();


process.on('uncaughtException', function (err) {
  var msg = err instanceof Error ? err.stack : err.toString();
  msg = "Caught uncaughtException, app exiting: " + msg;
  console.log(msg, null, function () {
    process.exit(1);
  });
});

if (argv.w === 0) {
  startSingleton();
} else {
  startCluster(usableCpus > argv.w ? argv.w : usableCpus);
}


function startSingleton() {
  var options = {
        port: argv.p
      },
      app = makeApp(options);

  http.createServer(app).listen(app.get('port'), function () {
    console.log('Suck server listening on port ' + app.get('port') +
                ' in ' + app.settings.env + ' mode');
  });
}

function startCluster(serverCount) {
  var cluster = require('cluster');

  if (cluster.isMaster) {
    for (var i = 0; i < serverCount; i++) {
      cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {
      console.log('Worker ' + worker.id + ' died, starting a new one...');
      cluster.fork();
    });
  } else {
    startSingleton();
  }
}

function parseOpts() {
  return require('optimist')
      .usage('Usage: $0 [-p num]')

      .default('p', process.env.PORT || 5000)
      .alias('p', 'port')
      .describe('p', 'Server port')

      .default('w', process.env.MAX_CPUS && parseInt(process.env.MAX_CPUS, 10) || usableCpus)
      .describe('w', 'Number of workers to spawn (set to 0 to disable clustering)')
      .alias('w', 'workers')

      .argv;
}
