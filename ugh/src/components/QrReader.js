import styled from '@emotion/styled';
import QrScanner from 'qr-scanner';
import { useState, useEffect, useRef } from 'react';
import LS2Request from "@enact/webos/LS2Request";
import {useDispatch} from 'react-redux';
import { setIsWorking } from '../store/store';
export const QrOptions = {
  // 핸드폰의 경우, 외부 카메라인지 셀프카메라인지
  preferredCamera: 'environment',
  // 1초당 몇번의 스캔을 할 것인지? ex) 1초에 5번 QR 코드 감지한다.
  maxScansPerSecond: 5,
  // QR 스캔이 일어나는 부분을 표시해줄 지 (노란색 네모 테두리가 생긴다.)
  highlightScanRegion: true,
};

const QrReader = ({ onNavigate, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isFailed, setIsFailed] = useState(false);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const bridge = new LS2Request();
  const dispatch = useDispatch();

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

  const onQrSuccess = () => {
    dispatch(setIsWorking(true));
    console.log("QR Code Scanned");
    onNavigate(4); // 원하는 페이지로 이동
  }
  const onQrFail = () => {
    console.log("QR fail");
    setIsFailed(true);
    // 다시 시작
    qrScannerRef.current.start();
  }

  const handleScan = (result) => {
    if(result) {
      const data = JSON.parse(result.data);
      console.log(data);
      setData(data);
      // 스캔 완료 시 비디오 스트림 중지 및 다음 페이지로 이동
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }

      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
      console.log("QR Code Scanned: " + data);

      var lsRequest = {
        service: "luna://com.ugh.app.service",
        method: "qrValidate",
        parameters: {
          data: data,
        },
        onSuccess: (msg) => {
          console.log("QR Code valid");
          onQrSuccess();
        },
        onFailure: (err) => {
          onQrFail();
        },
      }
      bridge.send(lsRequest);
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
      <BackButton onClick={() => onNavigate(0)}>뒤로가기</BackButton>
      <QrScannerViewContainer>
        <QrScannerView ref={videoRef} autoPlay playsInline />
      </QrScannerViewContainer>
    </QrScannerContainer>
  );
}

const QrScannerContainer = styled.div`
  width: 100%;
  height: 100%; /* 화면 전체 높이를 차지 */
  background-color: #f5f5f5;
`;
const BackButton = styled.div`
  padding: 10px;
  font-size: 50px;
  color: #333;
  cursor: pointer;
`;
const QrScannerViewContainer = styled.div`
  flex: 1;
  height: 100%; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const QrScannerWrapper = styled.video`
  gap: 20px;
`;
const QrScannerMessageContainer = styled.div`
  color: red;
`;
const QrScannerView = styled.video`
  width: 720px;
  height: 480px;
`;

export default QrReader;
