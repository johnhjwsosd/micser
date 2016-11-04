var mysql = require("mysql");
var pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASENAME,
    port: process.env.DATABASE_PORT,
    connectionLimit: 5, //连接池最大连接数
    multipleStatements: true //允许执行多条语句
});
var execsql = function(sql, opts, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            console.log(err);
            callback(err, null, null);
        } else {
            if (typeof(opts) === 'function') {
                callback = opts;
                conn.query(sql, function(qerr, vals, fields) {
                    //释放连接  
                    //console.log(vals);
                    conn.release();
                    //console.log('连接已释放。');
                    //事件驱动回调  
                    callback(qerr, vals, fields);
                });
            } else {
                conn.query(sql, opts, function(qerr, vals, fields) {
                    //释放连接  
                    //console.log(vals);
                    conn.release();
                    //console.log('连接已释放。');
                    //事件驱动回调  
                    callback(qerr, vals, fields);
                });
            }

        }
    });
};

pool.on('connection', function(connection) {
    console.log('mysql-client connection......');
});

pool.on('enqueue', function() {
    console.log('Waiting for available connection slot');
});

module.exports = execsql;