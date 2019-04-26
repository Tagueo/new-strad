exports.executeQuery = (pool, query, callback) => {

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            throw err;
        }
        connection.query(query,function(err,rows){
            connection.release();
            if(!err) {
                callback(null, rows);
            }
        });
        connection.on('error', function(err) {
            throw err;
            return;
        });
    });

};