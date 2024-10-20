const mqttConnector = require('./mqtt_connector');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

let lastMessage = null;  // 수신한 메시지를 저장

mqttConnector.connect()
  .then(() => {
    console.log('MQTT 연결 성공');

    // TEMP 및 JIG 토픽 수신
    mqttConnector.subscribe('TEMP', (message) => {
      if (message === '0') {
        console.log(`수신된 메시지 [TEMP]: ${message}`);
      }
    });

    mqttConnector.subscribe('JIG', (message) => {
      if (message === 'F') {
        console.log('특정 조건에 따라 동작 실행: F 메시지 수신');
        lastMessage = 'F'; // 'F' 메시지를 수신하면 저장
      }
    });
  })
  .catch(err => {
    console.error('MQTT 연결 실패:', err);
  });

// MQTT 메시지 발행 API
app.post('/publish', (req, res) => {
  const { topic, message } = req.body;

  mqttConnector.publish(topic, message, (err) => {
    if (err) {
      console.error('메시지 발행 실패:', err);
      res.status(500).send({ error: '메시지 발행 실패' });
    } else {
      console.log('메시지 발행 성공:', message);
      res.send({ status: '메시지 발행 성공' });
    }
  });
});

// 메시지 상태 확인 API
app.get('/check-message', (req, res) => {
  if (lastMessage) {
    res.send({ message: lastMessage });
    lastMessage = null; // 메시지를 전달한 후 초기화
  } else {
    res.send({ message: null });
  }
});

app.get('/dummy-data', (req, res) => {
    const filePath = path.join(__dirname, 'dummyData/QRTest.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('더미 데이터 읽기 실패:', err);
        res.status(500).send({ error: '더미 데이터를 읽을 수 없습니다.' });
      } else {
        res.send(JSON.parse(data)); // JSON 데이터를 클라이언트로 전송
      }
    });
  });

app.listen(4000, () => {
  console.log('MQTT 서비스가 포트 4000에서 실행 중');
});

module.exports = app;
