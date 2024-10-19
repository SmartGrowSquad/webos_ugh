const pkgInfo = require('./package.json');
const Service = require('webos-service');
const luna = require("./luna_service");
const mqttService = require('./mqtt_service'); // 추가
const service = new Service(pkgInfo.name); 
require("dotenv").config();

service.register("serviceStart", function(message) {
    luna.init(service);
    luna.cameraReady("camera1");
    console.log("camera on");

    mqttService;
});
