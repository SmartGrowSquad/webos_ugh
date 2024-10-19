import React, { useState } from 'react';
import Panel from '@enact/sandstone/Panels';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EnvPanel.css';

const EnvPanel = ({ onNavigate, ...rest }) => {
    const dummyDegree = [{ degree: 28, humidity: 40 }];
    const [ledState, setLedState] = useState(1); // 기본 상태는 1

    const notify = (message) => toast(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
    });

    const feed = () => {
        console.log(`WATER command sent`);
        notify(`물을 줍니다.`);
    
        axios.post('http://localhost:4000/publish', {
          topic: 'WATER',
          message: '0'
        })
        .then(response => {
          console.log('Message sent successfully:', response.data);
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
      };
      
    const led = () => {
        const newLedState = ledState === 1 ? 0 : 1; // 현재 상태에 따라 0 또는 1로 토글
        setLedState(newLedState); // 상태 업데이트
        console.log(`LED command sent: ${newLedState}`);
        notify(`LED를 ${newLedState === 1 ? '킵니다' : '끕니다'}.`);
    
        axios.post('http://localhost:4000/publish', {
          topic: 'LED',
          message: newLedState.toString()
        })
        .then(response => {
          console.log('Message sent successfully:', response.data);
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
      };
    return (
        <Panel {...rest} className="env_control_panel">
        <div>
            <ToastContainer/>
            <div className="env_sidebar">
            <div className="env_back" onClick={() => onNavigate(0)}>돌아가기</div>
            <div className="env_menu_item active">환경제어</div>
            <div className="env_menu_item" onClick={() => onNavigate(1)}>설비제어</div>
            </div>

            <div className="env_main_content">
            {dummyDegree.map((dat) => (
                <React.Fragment key={dat.degree}>
                <h1 className="env_degree">
                    온도 : {dat.degree}°C
                    <br />
                    습도 : {dat.humidity}%
                </h1>
                <div className="env_card_container">
                    <button className="feed" onClick={() => feed()}>
                    물주기
                    </button>
                    <button className="led" onClick={() => led()}>
                    LED ON/OFF
                    </button>
                </div>
                </React.Fragment>
            ))}
            </div>
        </div>
        </Panel>
    );
};

EnvPanel.propTypes = {
  onNavigate: PropTypes.func.isRequired
};

export default EnvPanel;
