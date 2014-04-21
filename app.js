var koa = require('koa');
var app = koa();
var config = require('./config');
var router = require('koa-router');
var views = require('koa-views');
var bodyParser = require('koa-body');
var serve = require('koa-static');
var less = require('koa-less');
var koaPg = require('./pg');
app.use(bodyParser());
app.use(views('./views', 'jade'));
app.use(koaPg(config.pg));
app.use(router(app));


// logger

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(serve('./public'));
app.use(serve('./bower_components'));

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
app.get('/test', function *() {
  console.log('pg', this.pg);
  var result = yield this.pg.copycat.client.query_('SELECT now()')
  this.body = result.rows[0].now.toISOString();
});
var port = process.env.PORT || config.port;
app.listen(port);
console.log('server listening on port ' + port);
