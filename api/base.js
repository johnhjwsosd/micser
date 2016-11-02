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