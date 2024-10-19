import React, { useEffect } from 'react';
import './Camera2.css';
import PropTypes from 'prop-types';
import axios from 'axios';

const Camera2 = ({ onNavigate }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://localhost:4000/check-message')  // 메시지 수신 상태를 확인
        .then(async response => {
          if (response.data.message === 'F') {
            console.log('JIG 토픽에서 F 메시지 수신');            
            onNavigate(5); // Camera3로 이동
            clearInterval(interval);
          }
        })
        .catch(error => {
          console.log('메세지 대기중');
        });
    }, 1000); // 1초마다 메시지 수신 여부 확인

    return () => clearInterval(interval);
  }, [onNavigate]);

  return (
    <div className="camera2_container">
      <div className="loading_message">
        잠시만 기다려 주세요...
      </div>
    </div>
  );
};

Camera2.propTypes = {
  onNavigate: PropTypes.func.isRequired
};

export default Camera2;
