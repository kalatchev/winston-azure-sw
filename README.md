# winston-azure

[![NPM version](https://badge.fury.io/js/winston-azure-sw@2x.png)](http://badge.fury.io/js/winston-azure-sw)

Table storage transport for [winston][1] with latest (January 2017) [Microsoft azure][2] SDK. Fork of original [winston-azure][0] project.

## Installation

``` bash
  $ npm install winston
  $ npm install winston-azure
```

## Usage
Here is the use of account/key pair.
``` js
  var winston = require('winston');
  require('winston-azure-sw');
  
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
  
  logger.warn('Hello toto!');
```
And here is the use of host/sas pair, created with Access Policies and SAS (See [Storage Explorer][4] fro details)
``` js
  var winston = require('winston');
  require('winston-azure-sw');
  
  var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Azure)({
            host: "somestorage.table.core.windows.net", 
            sas: "The long Azure SAS", // something like '?sv=2015-12-11&si=Folder1-A123&tn=folder1&sig=BLA-BLA'
            table: "Folder1", //SAS usssualy also contains it
            partition: require('os').hostname(),
            level: 'warn',
            metaAsColumns: true
        })
    ]
  });
  
  logger.warn('Hello toto!');
```

The Azure transport accepts the following options:

* __level:__ Level of messages that this transport should log (defaults to `info`).
* __account:__ The name of the Windows Azure storage account to use
* __key:__ The access key used to authenticate into this storage account
* __host:__ The name of the Windows Azure storage host
* __sas:__ The SAS used to authenticate and associated with given Access Policy
* __table:__ The name of the table to log to (defaults to 'log').  Must already exist.
* __partition:__ The value to use for the PartitionKey in each row (defaults to 'log').
* __metaAsColumns:__ If `true`, the transport will store the metadata key/value pairs in individual columns (this can be helpful when querying table storage for log entries with specific metadata values).  The default is to store the entire `meta` value as a single JSON string in a 'meta' column.
* __rowKeyBuilder:__ A function to build the primary key, default is:
``` js
    function()
    {
        return (new Date()).getTime() + '_' + (new Date()).getMilliseconds();
    }
```

[0]: https://github.com/ebuildy/winston-azure
[1]: https://github.com/flatiron/winston
[2]: https://github.com/Azure/azure-storage-node
[3]: https://github.com/pofallon/winston-skywriter/
[4]: http://storageexplorer.com/
