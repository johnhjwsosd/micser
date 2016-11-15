exports.name = 'base';

exports.get = function(req, res, next) {
    handle(req, res, next, 'get');
}
exports.post = function(req, res, next) {
    handle(req, res, next, 'post');
}

function handle(req, res, next, type) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    var data = {
        state: -1,
        msg: 'none',
        data: []
    };
    data.data = [];

    var api = global.apilist[req.params.cmd];
    if (api) {
        if (type == api.Method) {
            var sql = getsql(sql, api);

            sql = precmd(sql, req.params);
            console.log(sql);
            global.db(sql, function(err, vals, fields) {
                if (err) {
                    console.log(err.message);
                    data.state = -1;
                    data.msg = err.message;
                } else {
                    data.state = 0;
                    if (vals) {
                        if (vals.protocol41) {
                            data.data = [];
                        } else if (vals.length > 0) {
                            if (vals[vals.length - 1].protocol41) {
                                data.data = vals.slice(0, vals.length - 1);
                            } else {
                                data.data = vals;
                            }
                        }
                        console.log(vals);
                    }
                    data.msg = 'Success';
                }
                res.send(data);
            });
        } else {
            data.state = -1;
            data.msg = 'Method not allowed';
            data.data = [];
            res.send(data);
        }

    } else {
        console.log('Invalid API');
        data.msg = 'Invalid API';
        res.send(data);

    }

    console.log('request:' + req.params.cmd);
}


function precmd(cmd, params) {
    Object.keys(params).forEach(function(key) {
            if (key != 'cmd') {
                var reg = new RegExp('@' + key, "g");
                var value = params[key];
                cmd = cmd.replace(reg, value);
            }
        })
        console.log(cmd); 
    return cmd;
}


function getsql(sql, api) {
    sql = sql ? sql : '';
    if (api.MultiCmd == 1) {
        var list = api.Cmd.split('|');
        list.forEach(function(element) {
            var apitmp = global.apilist[element];
            sql = getsql(sql, apitmp);
        }, this);

    } else {
        sql += api.Cmd + ';';
    }
    return sql;
}