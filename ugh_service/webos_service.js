const pkgInfo = require('./package.json');
const Service = require('webos-service');
const luna = require("./luna_service");
const mqtt = require('./mqtt_connector');
const axios = require('axios');


const service = new Service(pkgInfo.name); 
require("dotenv").config();

let client;
let lastMessage = '';
const supIp = process.env.SUPER_HOST;

// 서비스 시작  
service.register("serviceStart", function(message) {
    console.log("[Init] ls2 initialize");
    luna.init(service); 

    console.log("[ Service Started data ]");
    //const data = JSON.parse(message.payload.data);

    client = mqtt.connect();


});
service.register("subscribeTopics", function(message) {
    console.log("[subscribeTopics] called");
    client.subscribe(['TEMP', 'JIG_ESP', 'PICTURE']);
    console.log("[subscribeTopics] message", message.payload);

    client.on("message", (topic, msg) => {
        broadcastToSubscribers(topic, msg);
    })
    console.log("[subscribeTopics] success");
});
// 알림
service.register("toast", function(message) {
    const payload = message.payload
    console.log("페이로드",payload);
    luna.toast(payload.alert);
    client.publish(payload.topic, payload.msg, { qos: 1 }); 
    console.log("Toast ", payload.msg);
    
    console.log("====================================[     테스트용 임시 pub    ]====================================");
    // client.publish('JIG_ESP', 'F', { qos: 1 });
    console.log("====================================[ 테스트용 임시 pub success]====================================");
        
    //payload.cd();
}); 

// qr 인증
service.register("qrValidate", async (message) => {
    const payload = message.payload;
    const data = payload.data;
    console.log("qrValidate ", data);
    axios.post(`${supIp}/validate`,
        {
            passcode: data.passcode,
            id: data.purchaseId,
        }
    ).catch((err) => {
        console.log(err);
    }).then((res) => {
        console.log(res.data);
        console.log("====================================[     테스트용 임시 pub    ]====================================");
        // client.publish('JIG_ESP', 'F', { qos: 1 });
        console.log("====================================[ 테스트용 임시 pub success]====================================");
        message.respond(res.data);
        client.publish('JIG', '1', { qos: 1 });
    });
});

const subscriptions = {};
const mqttSubscribeHandler = service.register("subscribeToMQTT");

function broadcastToSubscribers(topic, message) {
    Object.keys(subscriptions).forEach((token) => {
        console.log("구독자에게 메시지 전송:", token);
        subscriptions[token].respond({
            topic: topic,
            message: message.toString() // 문자열로 변환하여 전송
        });
    });
}
mqttSubscribeHandler.on("request", (message) => {
    console.log("MQTT 구독 요청 수신");
    // 초기 응답
    message.respond({ message: "MQTT 구독 요청 수신 및 처리 중..." });

    // 구독 요청인지 확인
    if (message.isSubscription) {
        // 구독 리스트에 메시지 저장
        subscriptions[message.uniqueToken] = message;

        console.log("구독자가 추가되었습니다. 현재 구독자 수:", Object.keys(subscriptions).length);
    }
});

// 구독 취소 요청 처리
mqttSubscribeHandler.on("cancel", (message) => {
    console.log(`구독 취소 요청: ${message.uniqueToken}`);
    
    // 구독 리스트에서 해당 구독자 제거
    delete subscriptions[message.uniqueToken];
    
    // 구독자 수 확인 후 필요 시 추가 처리
    if (Object.keys(subscriptions).length === 0) {
        console.log("모든 구독이 취소되었습니다.");
    }
});