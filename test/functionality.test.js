'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');
const amqplib = require('amqplib');
const winston = require('winston');

const winstonFastRabbitMq = require('../lib/winston-fast-rabbitmq.js');

describe('Winston connection', () => {
  describe('Test if log is send to RabbitMQ', function() {
    this.timeout(30000);

    const transportOptions = {
      amqp: {
        protocol: 'amqp',
        username: 'guest',
        password: 'guest',
        host: 'localhost',
        port: 5672,
        silent: true,
        exchangeName: 'TEST',
        exchangeType: 'topic',
        durable: false
      }
    }

    const logger = winston.createLogger({
      level: 'info',
      defaultMeta: { service: 'user-service' }
    });

    logger.add(new winstonFastRabbitMq(transportOptions));

    it('should return the correct messages from queue',  (done) => {
      transportOptions.level = 'error';


      let connection;
      let connectionCloseTimerId;
      let msgCount = 0;

      setTimeout(() => {
        logger.error('TESTERROR');
      }, 500);

      amqplib.connect(transportOptions.amqp.protocol + '://' + transportOptions.amqp.host)
      .then((conn) => { connection = conn; return conn.createChannel(); })
      .then((channel) => {

        return channel.assertExchange(transportOptions.amqp.exchangeName, transportOptions.amqp.exchangeType, {durable: transportOptions.amqp.durable})
        .then((ok) => {

          return channel.assertQueue('', {exclusive: true})
          .then((q) => {

            return channel.bindQueue(q.queue, transportOptions.amqp.exchangeName, '')
            .then((queue) => {

              return channel.consume(q.queue, (msg) => {
                msgCount++;

                clearTimeout(connectionCloseTimerId);

                  connectionCloseTimerId = setTimeout(() => {
                    const jsonMessage = JSON.parse(msg.content.toString());
                    expect(jsonMessage.message).to.equal('TESTERROR');
                    expect(msgCount).to.equal(1);

                    connection.close();

                    done();
                  }, 500);

              }, {noAck: true})
              .then(()=>{
                console.log('waiting for message')
              });
            });
          });
        });
      })
      .catch((ex) => { throw ex; });
    });
  });
});