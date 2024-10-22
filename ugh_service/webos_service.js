const pkgInfo = require('./package.json');
const Service = require('webos-service');
const luna = require("./luna_service");
const mqtt = require('./mqtt_connector');
const axios = require('axios');
const service = new Service(pkgInfo.name); 
require("dotenv").config();

let client;
const supIp = process.env.SUP_IP;

// 서비스 시작  
service.register("serviceStart", function(message) {
    luna.init(service); 

    console.log("[ Service Started data ]", message);
    const data = JSON.parse(message.payload.data);

    client = mqtt.connect();

    client.subscribe('TEMP', (message) => {
        if (message === '0') {
            message.response(message);
        }
    });

    client.subscribe('JIG', (message) => {
        if (message === 'F') {
            console.log('특정 조건에 따라 동작 실행: F 메시지 수신');
            lastMessage = 'F'; // 'F' 메시지를 수신하면 저장
        }
    });

});
// 알림
service.register("toast", function(message) {
    const payload = message.payload
    luna.toast(payload.alert);
    client.publish(payload.topic, payload.msg, { qos: 1 }); 
    console.log("Toast ", message.payload.msg);
    payload.cd();
}); 

// qr 인증
service.register("qrValidate", async (message) => {
    const payload = message.payload;
    const data = JSON.parse(payload.data);
    
    axios.post(`${supIp}/validate`,
        {
            passcode: data.passcode,
            mId: data.mId,
            uId: data.uId,
        }
    ).catch((err) => {
        data.onQrFail();
        console.log(err);
    }).then(() => {
        // 성공했다면 콜백
        data.onQrSuccess();
    })
});

