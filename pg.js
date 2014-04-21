var pg = require('co-pg')(require('pg'));

module.exports = function(opts) {
  'use strict'

  if (typeof opts === 'string') {
    opts = { conStr: opts };
  }
  
  opts.name = opts.name || 'db';

  return function *koaPg(next) {

    this.pg = this.pg || {};
    console.log('lol', pg);
    var connect = yield pg.connect_(opts.conStr);
    this.pg[opts.name] = {
      client: connect[0],
      done: connect[1]
    }

    try {
      yield next
    }
    catch (e) {
      this.pg[opts.name].done(e);
      delete this.pg[opts.name];
      throw e;
    }

    this.pg[opts.name].done();
    delete this.pg[opts.name];
  }
}
