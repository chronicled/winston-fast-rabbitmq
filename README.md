# winston-fast-rabbitmq

A RabbitMQ transport for Winston 3.0.

Forked from [https://github.com/TBear79/winston-fast-rabbitmq](https://github.com/TBear79/winston-fast-rabbitmq)

It closes the connection after every message, but keeps the connection open as long as new messages arrive within a short timespan.

* Easy to use and fast to implement
* Build using [amqplib](https://www.npmjs.com/package/amqplib)
* Non-blocking as it uses [rabbit-chatter](https://www.npmjs.com/package/rabbit-chatter)

# Usage

Use [npm](https://www.npmjs.com/) to install the module:

```
	npm install winston-fast-rabbitmq
```

Then use `require()` to load it in your code:

```javascript
	var winstonFastRabbitMq = require('winston-fast-rabbitmq');
```

Setup the transport in winston:

```javascript
    var options = {
        amqp: {
            // rabbit-chatter options
        },
        // winston options
    }
	winston.add(winston.transports.WinstonFastRabbitMq(options));
```

Now you are ready to send some logs to RabbitMq!

## Options

Most options are passed on directly to [rabbit-chatter](https://www.npmjs.com/package/rabbit-chatter). So have a look at that module to see the rest of the option list.

### level

String

Default: 'info'

Sets the minimum required level for sending the log to RabbitMQ. You can find the levels [here](https://www.npmjs.com/package/winston#logging-levels).

### formatter

function

Default: See below

Sets the standard formatter for the message. If no function is passed in this option, it will use the default-formatter which looks like this:

For versions: `<=1.2.4`
```javascript
function(level, meta, message)
{
    return JSON.stringify({ level: level, meta: meta, message: message  });
};
```

For versions: `>1.2.4`
```javascript
function(options)
{
    return JSON.stringify({ level: options.level, meta: options.meta, message: options.message  });
};
```
Thanks to Thomas from ebuildy for this contribution :-)


# Tests

To run tests on this module, make sure that the modules for the tests are installed

```
	npm install winston-fast-rabbitmq --dev
```

Then run:

```
	npm test
```

NOTICE: The test is not only a unit test but also a functionality test. So RabbitMQ is required to be installed locally in order to run the test.

# Futher reading

Further documentation the topics according to this module:

* [Winston](https://www.npmjs.com/package/winston)
* [RabbitMQ](https://www.rabbitmq.com/documentation.html) [Tutorial](https://www.rabbitmq.com/getstarted.html)
* [amqplib](https://www.npmjs.com/package/amqplib)
* [rabbit-chatter](https://www.npmjs.com/package/rabbit-chatter)

# Release notes

* 2.2.0 - Updated dependencies, including rabbit-chatter v2 that fixes an issue that left open connections.
* 2.1.0 - Ability to pass timeout to rabbit-chatter
* 2.0.2 - IMPORTANT! Renamed transport property from `WinstonInstanceRabbitMq` to `WinstonFastRabbitMq` in types.
* 2.0.0 - BREAKING! Renamed exported class to `WinstonFastRabbitMq`. Added types definitions.
* 1.3.0 - Refactor to comply with `winston` formatter function signature. Thanks to JimiC.
* 1.2.4 - Added name to be able to identify transport in `winston`. Provided `routingKey` to `rabbit-chatter`. Both updates with thanks to JimiC.
* 1.2.2 - Updated dependencies.
* 1.2.1 - Removed forward slash provided to `rabbit-chatter`.

# Keywords

* winston
* rabbitmq
* amqp
* amqplib
* logging
* winston transport
* transport
* error
* error handling
* error handler

# License

The MIT License (MIT)

Copyright (c) 2016 Thorbjørn Gliese Jelgren (The Right Foot, www.therightfoot.dk)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

