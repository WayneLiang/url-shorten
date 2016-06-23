/**
 * Created by wayne on 16/6/23.
 */
module.exports = function (config) {
    var self = {};
    self.opts = config || {};
    self.opts['redis-host'] = self.opts['redis-host'] || 'localhost';
    self.opts['redis-port'] = self.opts['redis-port'] || 6379;
    self.opts['redis-pass'] = self.opts['redis-pass'] || false;
    self.opts['redis-db']   = self.opts['redis-db']   || 0;
    self.getModel = function (callback) {
        var RedisModel = require('./model'),
            config = {
                host: self.opts['redis-host'],
                port: self.opts['redis-port'],
                pass: self.opts['redis-pass'],
                db  : self.opts['redis-db']
            };
        callback(null, new RedisModel(config));
    };
    self.checkUrl = function (s) {
        var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            , valid = true;

        if (regexp.test(s) !== true) {
            valid = false;
        }

        return valid;
    };
    self.shorten = function (long_url, callback) {
        if (this.checkUrl(long_url, true)) {
            this.getModel(function (err, model) {
                if (err) {
                    callback(500);
                } else {
                    model.set(long_url, callback);
                }
            });
        } else {
            callback(400);
        }
    };

    self.expand = function (short_url, callback, click) {
        if (this.checkUrl(short_url)) {
            short_url = short_url.split('/').pop();
        }

        if (short_url && /^[\w=]+$/.test(short_url)) {
            this.getModel(function (err, model) {
                if (err) {
                    callback(500);
                } else {
                    model.get(short_url, callback, click);
                }
            });
        } else {
            callback(400);
        }
    };

    return self;
};
