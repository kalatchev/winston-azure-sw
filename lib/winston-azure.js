/*!
 * winston-azure
 * Copyright(c) 2014 Thomas Decaux <ebuildy@gmail.com>
 * Apache 2.0 Licensed
 */

var util = require('util'),
    azure = require('azure'),
    winston = require('winston')

var Skywriter = exports.Skywriter = function (options) {

    winston.Transport.call(this, options);

    options = options || {};

    this.name = 'skywriter';
    this.tableName = options.table || 'log';
    this.level = options.level || 'info';
    this.silent = options.silent || false;
    this.columns = options.columns || false;

    this.partition = options.partition || 'log';

    this.tableService = azure.createTableService(options.account, options.key);

    this.tableService.createTableIfNotExists(this.tableName, function(error)
    {
        if (error)
        {
            throw error;
        }
    });
};

util.inherits(Skywriter, winston.Transport);

winston.transports.Skywriter = Skywriter;

Skywriter.prototype.log = function (level, msg, meta, callback) {

    var self = this;

    if (this.silent) {
        return callback(null, true);
    }

    var data = {
        'level': level,
        'msg': msg,
    }

    if (meta) {

        if (this.columns) {
            for (var prop in meta) {
                if (typeof meta[prop] === 'object') {
                    data[prop] = JSON.stringify(meta[prop]);
                } else {
                    data[prop] = meta[prop];
                }
            }
        } else {
            data.meta = JSON.stringify(meta);
        }

    }

    data.PartitionKey = this.partition;
    data.RowKey = (new Date()).getTime() + '_' +  (new Date()).getMilliseconds();
    data.date = new Date();

    this.tableService.insertEntity(this.tableName, data, function(err) {

        if (err) {
            self.emit('error', err);
        }

        //self.emit('logged', rowKey);

        // callback(null,rowKey);

    });

    callback(null,true);

};
