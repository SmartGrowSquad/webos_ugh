var ls2 = undefined;
var handle = undefined;
var key = undefined;
var mediaId = undefined;
var check = undefined;
var check2 = undefined;
var check3 = undefined;

function init(service){
    ls2 = service;
    console.log("[Init] ls2 initialized:", ls2);
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

exports.init = init;
exports.toast = toast;
