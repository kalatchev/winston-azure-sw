# winston-azure

[![NPM version](https://badge.fury.io/js/winston-azure@2x.png)](http://badge.fury.io/js/winston-azure)

Yet another [Windows Azure][0] table storage transport for [winston][1], utilizing the latest (octobre 2014) [Microsoft azure][2] SDK.

> Inspired by [winston skywriter][3] transport, but compatible with latest Microsoft Azure SDK for NodeJS.

## Installation

``` bash
  $ npm install winston
  $ npm install winston-azure
```

## Usage
``` js
  var winston = require('winston');
  require('winston-azure');
  
  var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Azure)({
            account: "Azure storage account sub domain ([A-Za-z0-9])",
            key: "The long Azure storage secret key",
            table: "The name of the table (why not just 'log'?)",
            partition: require('os').hostname(),
            level: 'warn',
            metaAsColumns: true
        })
    ]
});
```

The Azure transport accepts the following options:

* __level:__ Level of messages that this transport should log (defaults to `info`).
* __account:__ The name of the Windows Azure storage account to use
* __key:__ The access key used to authenticate into this storage account
* __table:__ The name of the table to log to (defaults to 'log').  Must already exist.
* __partition:__ The value to use for the PartitionKey in each row (defaults to 'log').  The RowKey is an auto-generated GUID.
* __columns:__ If `true`, the transport will store the metadata key/value pairs in individual columns (this can be helpful when querying table storage for log entries with specific metadata values).  The default is to store the entire `meta` value as a single JSON string in a 'meta' column.

### Helpful hint

When running multiple node instances across multiple hosts, a good value for 'partition' is:  
``` js
partition: require('os').hostname() + ':' + process.pid
```

[0]: http://www.windowsazure.com/en-us/develop/nodejs/
[1]: https://github.com/flatiron/winston
[2]: https://github.com/Azure/azure-storage-node
[3]: https://github.com/pofallon/winston-skywriter/
