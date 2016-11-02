var mysql = require("mysql");
var pool = mysql.createPool({
    host: 'rm-uf6905736q1il5e89o.mysql.rds.aliyuncs.com',
    user: 'ypt',
    password: 'ypt2861!',
    database: 'km',
    port: 3306,
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