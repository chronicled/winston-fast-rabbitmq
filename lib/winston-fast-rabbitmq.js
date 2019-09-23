'use strict';

const winston = require('winston');
const Transport = require('winston-transport');
const util = require('util');
const rabbitChatter = require('rabbit-chatter');


module.exports = class WinstonFastRabbitMq extends Transport {
  constructor(opts) {
    super(opts);

    this.name = 'winstonFastRabbitMq';

    if (!opts)
      opts = {};

    this.formatter = opts.formatter || function (options) {
      return JSON.stringify({
        level: options.level,
        meta: options.meta,
        message: options.message
      });
    };

    if (!opts.amqp)
      opts.amqp = {};

    const options = opts.amqp;
    const rabbitOptions = {
      appId: options.appId || options.applicationId || 'test',
      silent: options.silent,
      exchangeType: options.exchangeType,
      exchangeName: options.exchangeName || 'winston-log',
      durable: options.durable,
      protocol: options.protocol || 'amqp',
      username: options.username || 'guest',
      password: options.password || 'guest',
      host: options.host || 'localhost',
      virtualHost: options.virtualHost ? options.virtualHost : '',
      port: options.port || 5672,
      routingKey: options.routingKey || '',
      timeout: options.timeout || 1000,
      handleError: options.handleError,
    };

    this._rabbit = rabbitChatter.rabbit(rabbitOptions);
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const t = this;

    const output = {
      level: info.level,
      message: info.message,
      meta: info.meta,
    }

    var msg = t.formatter(output);

    // rabbit chat here
    t._rabbit.chat(msg);

    if (callback) {
      callback();
    }
  }
}