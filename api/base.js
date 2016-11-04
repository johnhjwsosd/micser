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

    console.log(api);
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