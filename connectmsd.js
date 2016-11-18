var net = require("net");
function connectMicroDiscover() {

    let MS_HOST = process.env.MS_HOST;
    let MS_NAME = process.env.MS_NAME;
    let MS_UUID = process.env.MS_UUID;
    let APP_ID = process.env.APP_ID;
    let APP_KEY = process.env.APP_KEY;
    let transmissionDataJson = {
        "MS_UUID": MS_UUID,//MS_UUID,
        "MS_NAME": MS_NAME,//MS_NAME,
        "MS_HOST": MS_HOST ,//MS_HOST,
        "APP_ID": APP_ID,
        "APP_KEY": APP_KEY
    }

    let transmissionData = '!@#' + JSON.stringify(transmissionDataJson) + '%^&*';

    /* 判断端口  */
    let MSD_IP = process.env.NODE_MSD_IP;
    let MSD_PORT = process.env.NODE_MSD_PORT;
    if (parseInt(MSD_PORT) < 0 || parseInt(MSD_PORT) > 65535) {
        console.log('please check port should 0-65535');
        return;
    }
    var client = net.connect({ port: MSD_PORT, host: MSD_IP }, function () {
        console.log('client connected');
        var buffer = new Buffer(transmissionData);
        console.log(buffer);
        client.write(buffer);
    });
    client.on('data', function (data) {
        var resultData = convertReceiveData(data);
        console.log(resultData);
        if (typeof resultData == "object") {
            addApiList(resultData)
        }
        console.log(global.apilist);
        //client.end();
    })

    client.on('end', function () {
        console.log('client disconnected');
        setTimeout(function () {
            connectMicroDiscover();
        }, 1000);
    });
    client.on('close', function () {
        console.log(`I'm levea`);
    })
}
connectMicroDiscover();


function convertReceiveData(data) {
    try {
        var convertData = data.toString("utf-8");
    } catch (err) {
        return false;
    }
    try {
        var jsonData = JSON.parse(convertData);
        return jsonData;
    } catch (err) {
        return convertData;
    }

}

function addApiList(resultData) {
    for (var i = 0; i < resultData.length; i++) {
        var api = {};
        api.Cmd = resultData[i].Cmd;
        api.Method = resultData[i].Method;
        api.MultiCmd = resultData[i].MultiCmd;
        global.apilist[resultData[i].Name] = api;
    }
}
