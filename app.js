var koa = require('koa');
var app = koa();
var config = require('./config');
var router = require('koa-router');
var views = require('koa-views');
var bodyParser = require('koa-body');

app.use(bodyParser());
app.use(views('./views', 'jade'));
app.use(router(app));

// logger

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

var routes = {
  index: function *() {
    yield this.render('index');
  }

, upload: function *() {
    yield this.render('copy', {
      url: this.request.body.url
    });
  }
};

app.get('/', routes.index);
app.post('/copy', routes.upload);

var port = process.env.PORT || config.port;
app.listen(port);
console.log('server listening on port ' + port);
