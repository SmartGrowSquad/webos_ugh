import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import axios from 'axios';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../views/camera/QrReader.css';

export const QrOptions = {
  preferredCamera: 'environment',
  maxScansPerSecond: 5,
  highlightScanRegion: true, // 스캔 영역을 하이라이트
};

const QrReader = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [dummyData, setDummyData] = useState([]); // 더미 데이터 상태
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true); // 스캔 상태 제어
  const [canScan, setCanScan] = useState(true); // 인식할 수 있는 상태 여부
  const timerRef = useRef(null);  // 타이머를 관리하는 참조

  const notify = (message) => toast(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Flip
  });

  const sendMQTT = (id) => {
    axios.post('http://localhost:4000/publish', {
      topic: 'JIG',
      message: id
    })
    .then(response => {
      console.log('MQTT message sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending MQTT message:', error.response ? error.response.data : error.message);
      notify('MQTT 메시지 전송 중 오류 발생');  // 메시지 전송 오류 시 알림 표시
    });
  };

  const handleScan = (result) => {
    if (!canScan) return;  // 스캔 제한 중일 때는 인식 중단
  
    // QR 코드 인식 결과가 객체인지 확인하고 필요한 값 추출
    const resultText = typeof result === 'object' ? result.data : result;  // 객체일 경우 result.data 사용
  
    if (resultText) {
      const trimmedResult = resultText.trim();  // 공백 제거 없이 대소문자 그대로 사용
      setData(trimmedResult);
      setIsScanning(false);  // 스캔 중단
  
      console.log("QR 코드 인식 결과:", trimmedResult);  // QR 코드 결과 로그 출력
      console.log("더미 데이터와 비교 중...");
  
      // QR 코드와 일치하는 더미 데이터 확인
      const matchedItem = dummyData.find(item => item.text === trimmedResult);  // 정확하게 대소문자, 공백 포함해서 비교
  
      if (matchedItem) {
        // 일치하는 데이터가 있으면 MQTT 메시지 전송 및 Camera2로 이동
        console.log("QR Code matched: " + matchedItem.text);
        sendMQTT(matchedItem.id);
  
        // 비디오 스트림은 유지하고, QR 스캐너 즉시 중지
        if (qrScannerRef.current) {
          qrScannerRef.current.stop();  // 스캐너 중지
        }
  
        // Camera2로 이동
        onNavigate(4);
      } else {
        // **비교 실패 시, 인식된 값과 더미 데이터의 값 출력**
        dummyData.forEach(item => console.log(`비교: 더미 데이터: ${item.text} / 인식된 값: ${trimmedResult}`));
        console.log("No match found for QR code.");
        notify("QR을 다시 찍어주세요");
  
        // 스캔 상태 일시 중단 (2초 후 다시 활성화)
        setCanScan(false);
        setTimeout(() => {
          setCanScan(true);
          console.log("스캔이 다시 활성화되었습니다.");
          if (qrScannerRef.current) {
            qrScannerRef.current.start();  // QR 스캐너 재시작
          }
        }, 2000);  // 2초 후 다시 스캔 가능
      }
    }
  };
  

  const getWebcam = async () => {
    try {
      const constraints = {
        video: true
      };
      window.navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
      }).catch((err) => {
        console.log("getUserMedia error: " + err);
      });
    } catch (err) {
      console.log(err);
      return undefined;
    }
  };

  // Express 서버에서 JSON 파일을 불러오는 함수
  const fetchDummyData = async () => {
    try {
      const response = await fetch('http://localhost:4000/dummy-data');  // 서버에서 제공하는 경로
      const data = await response.json();
      setDummyData(data);
      console.log("더미 데이터 불러오기 성공:", data.map(item => item.text));  // 더미 데이터 로그 출력
    } catch (error) {
      console.error('Error fetching dummy data:', error);
    }
  };

  // 스캔을 일시 중단하고 재개하는 로직 추가
  useEffect(() => {
    if (canScan && videoRef.current) {
      videoRef.current.load();
      const qrScanner = new QrScanner(videoRef.current, (result) => handleScan(result), QrOptions);
      qrScannerRef.current = qrScanner;
      qrScanner.start();

      return () => qrScanner.stop();  // 컴포넌트 언마운트 시 스캐너 중지
    }
  }, [canScan]);  // canScan 상태가 true일 때만 스캔을 재개

  useEffect(() => {
    getWebcam();
    fetchDummyData(); // 컴포넌트가 마운트될 때 더미 데이터 불러오기
  }, []);

  return (
    <div className="qr-scanner-container">
      <ToastContainer />
      <video className="qr-scanner-view" ref={videoRef} autoPlay playsInline />
      <div className="scan-status">QR 코드를 스캔 중입니다...</div> {/* 스캔 중일 때만 표시 */}
      {/* QR 인식 영역 강조 표시 */}
      <div className="qr-scan-area"></div>
    </div>
  );
}

export default QrReader;
