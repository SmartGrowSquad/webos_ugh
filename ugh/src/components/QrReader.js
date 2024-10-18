import styled from '@emotion/styled';
import QrScanner from 'qr-scanner';
import { useState, useEffect, useRef } from 'react';

export const QrOptions = {
  // 핸드폰의 경우, 외부 카메라인지 셀프카메라인지
  preferredCamera: 'environment',
  // 1초당 몇번의 스캔을 할 것인지? ex) 1초에 5번 QR 코드 감지한다.
  maxScansPerSecond: 5,
  // QR 스캔이 일어나는 부분을 표시해줄 지 (노란색 네모 테두리가 생긴다.)
  highlightScanRegion: true,
};

const QrReader = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  // const navigate = useNavigate();

  function detectBrowser() {
    const userAgent = window.navigator.userAgent;
  
    if (userAgent.includes("Chrome") && !userAgent.includes("Edge") && !userAgent.includes("OPR")) {
      return "Chrome";
    } else if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      return "Safari";
    } else if (userAgent.includes("Edge")) {
      return "Edge";
    } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
      return "Opera";
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
      return "Internet Explorer";
    } else {
      return "Unknown";
    }
  }

  const getWebcam = async () => {
    try {
      const constraints = {
        video: true
      };
      // getUserMedia 호출
      window.navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        console.log("getUserMedia success");
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
      console.log(result);
      setData(result);
      // 스캔 완료 시 비디오 스트림 중지 및 다음 페이지로 이동
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
      console.log("QR Code Scanned: " + result);
      // navigate('/next-page'); // 원하는 페이지로 이동
    }
  };

  useEffect(() => {
    console.log("Browser: " + detectBrowser());
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
    <QrScannerContainer>
      <QrScannerView ref={videoRef} autoPlay playsInline />
    </QrScannerContainer>
  );
}

const QrScannerContainer = styled.div`
  justify-content: center;
  align-items: center;
`;

const QrScannerView = styled.video`
  width: 720px;
  height: 480px;
`;

export default QrReader;
