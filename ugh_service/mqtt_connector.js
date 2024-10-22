require("dotenv").config();
const mqtt = require('mqtt');
const host = process.env.MQTT_HOST || 'mqtt://localhost:1883';


const options = {
  clientId: 'mqtt_client_' + Math.random().toString(16).substr(2, 8),
  clean: true,
  username: 'user2',
  password: 'password',
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

let isConnected = false;

function connect() {
  if (isConnected) {
    console.log('이미 연결되어 있습니다.');
    return resolve();
  }

  const client = mqtt.connect(host, options);

  client.on('connect', () => {
    console.log('MQTT 연결 성공');
    isConnected = true;
  });

  client.on('error', (err) => {
    console.error('MQTT 연결 에러:', err);
    client.end();
    isConnected = false;
  });

  client.on('close', () => {
    console.log('MQTT 연결 종료');
    isConnected = false;
  });

  return client;
}

// MQTT 메시지 발행
function publish(topic, message, cb) {
  if (!isConnected) {
    console.error('MQTT 연결되지 않음. 연결을 먼저 수행해야 합니다.');
    return cb(new Error('MQTT 연결되지 않음.'));
  }

  client.publish(topic, message, { qos: 1 }, (err) => {
    if (err) {
      console.error(`메시지 발행 실패: ${message}`, err);
      return cb(err);
    } else {
      console.log(`발행 성공: ${topic}, 메시지: ${message}`);
      return cb(null);
    }
  });
}

// MQTT 메시지 구독
function subscribe(topic, messageHandler) {
  if (!isConnected) {
    console.error('MQTT 연결되지 않음. 연결을 먼저 수행해야 합니다.');
    return;
  }

  client.subscribe(topic, (err) => {
    if (err) {
      console.error(`구독 실패: ${topic}`, err);
    } else {
      console.log(`구독 성공: ${topic}`);
    }
  });

  client.on('message', (receivedTopic, message) => {
    if (receivedTopic === topic) {
      messageHandler(message.toString());
    }
  });
}

function disconnect() {
  if (client) {
    client.end(() => {
      console.log('MQTT 연결 종료');
    });
  }
}

exports.connect = connect;
exports.publish = publish;
exports.subscribe = subscribe;
exports.disconnect = disconnect;
