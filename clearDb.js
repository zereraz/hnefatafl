require('leveldown').destroy('./databaseDirectory', function(err) {
    if(!err) console.log('databse empty');
})
