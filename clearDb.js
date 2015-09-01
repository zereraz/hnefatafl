require('leveldown').destroy('./databaseDirectory', function(err) {
    if(!err) console.log('databse empty');
})
require('leveldown').destroy('./socketsDb', function(err) {
    if(!err) console.log('sockets databse empty');
})
