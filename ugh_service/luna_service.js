var ls2 = undefined;
var handle = undefined;
var key = undefined;
var mediaId = undefined;
var check = undefined;
var check2 = undefined;
var check3 = undefined;

function init(service){
    ls2 = service;
}

function toast(msg){
    let toast_url = "luna://com.webos.notification/createToast";
    let toast_params = {
        message: msg,
        persistent:true
    };
    let callback = (m) =>{
        console.log("[Toast] called : "+ msg);
    }
    ls2.call(toast_url, toast_params, callback);
}

function closeApp(app_id){
    let launchApp_url = "luna://com.webos.service.applicationmanager/close";
    let launchApp_params = {
        id: app_id
    };
    let callback = (m) =>{
        console.log("[close app] called : "+ app_id);
    }
    ls2.call(launchApp_url, launchApp_params, callback);
}

function launchApp(app_id){
    let launchApp_url = "luna://com.webos.service.applicationmanager/launch";
    let launchApp_params = {
        id: app_id
    };
    let callback = (m) =>{
        console.log("[launch app] called : "+ app_id);
    }
    ls2.call(launchApp_url, launchApp_params, callback);
}
function cameraOpen(device){
    return new Promise((resolve, reject) => {
        let cameraOpen_url = "luna://com.webos.service.camera2/open";
        let cameraOpen_params = {
            "id":device
        }
        ls2.call(cameraOpen_url, cameraOpen_params, (msg) => {
            if (msg.payload.returnValue) {
                console.log("[camera open] " + JSON.stringify(msg.payload));
                resolve(msg.payload.handle);
            } else {
                console.log("error!");
                reject("[camera open] " + JSON.stringify(msg.payload));
            }
        });
    });
}
