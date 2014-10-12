/*!
 * winston-azure
 * Copyright(c) 2014 Thomas Decaux <ebuildy@gmail.com>
 * Apache 2.0 Licensed
 */

var should = require('should');

var fs = require('fs');
var testCredentials = JSON.parse(fs.readFileSync('./test/credentials.json','utf8'));
var table = require('azure-storage').createTableService(testCredentials.account, testCredentials.key);

var winston = require('winston');

require('../lib/winston-azure');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Azure)({
            account: testCredentials.account,
            key: testCredentials.key,
            table: testCredentials.table,
            partition: require('os').hostname() + ':' + process.pid,
            level: 'warn'
        })
    ]
});

describe('winston-azure:', function() {

  before(function() {
  });

  describe('a logger', function() {

    it('should log to Azure', function(done) {

        logger.warn('Warning, you are logging to Azure',
            {uno: 1, dos: 'two', tres: true},
            function (err, level, msg, meta) {
              should.not.exist(err);
              level.should.equal('warn');
              msg.should.equal('Warning, you are logging to Azure');
              setTimeout(function() {
                done();
              }, 75);
            }
      );

    });

  });

});
