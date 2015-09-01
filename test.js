var level = require('levelup');
var sockDb = level('./socketsDb', { valueEncoding: 'json' });

