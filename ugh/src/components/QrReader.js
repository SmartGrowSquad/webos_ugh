import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import '../views/camera/QrReader.css';

export const QrOptions = {
  preferredCamera: 'environment',
  maxScansPerSecond: 5,
  highlightScanRegion: true, // 스캔 영역을 하이라이트
};

const QrReader = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true); // 스캔 상태 제어

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

  const handleScan = (result) => {
    if(result) {
      setData(result);
      setIsScanning(false);  // 스캔 중단

      // 스캔 완료 시 비디오 스트림 중지 및 Camera2로 이동
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
      console.log("QR Code Scanned: " + result);
      onNavigate(4);
    }
  };

  useEffect(() => {
    getWebcam();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();

      const qrScanner = new QrScanner(videoRef.current, (result) => handleScan(result), QrOptions);
      qrScannerRef.current = qrScanner;
      qrScanner.start();

      return () => qrScanner.destroy();
    }
  }, [loading]);

  return (
    <div className="qr-scanner-container">
      <video className="qr-scanner-view" ref={videoRef} autoPlay playsInline />
      {isScanning ? (
        <div className="scan-status">QR 코드를 스캔 중입니다...</div>
      ) : (
        <div className="scan-success">스캔 완료!</div>
      )}
      {/* QR 인식 영역 강조 표시 */}
      <div className="qr-scan-area"></div>
    </div>
  );
}

export default QrReader;