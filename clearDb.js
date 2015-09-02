require('leveldown').destroy('./databaseDirectory', function(err) {
    if(!err) console.log('database empty');
})
require('leveldown').destroy('./socketsDb', function(err) {
    if(!err) console.log('sockets databse empty');
})
