import React, { useState } from 'react';
import Panel from '@enact/sandstone/Panels';
import PropTypes from 'prop-types';
import LS2Request from "@enact/webos/LS2Request";
import './EnvPanel.css';
import { useSelector } from 'react-redux';

const EnvPanel = ({ onNavigate, ...rest }) => {
  const envData = useSelector(state => state.envData);
  const [ledState, setLedState] = useState(1); // 기본 상태는 1
  const bridge = new LS2Request();

  const feed = () => {
    console.log(`WATER command sent`);
    var lsRequest = {
      service: "luna://com.ugh.app.service",
      method: "toast",
      parameters: {
        alert: "물을 주고 있습니다.",
        topic: "WATER",
        msg: '0'
      },
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (err) => {
        console.log(err);
      },
    }
    bridge.send(lsRequest);
  };
  const led = () => {
    const newLedState = ledState === 1 ? 0 : 1; // 현재 상태에 따라 0 또는 1로 토글
    setLedState(newLedState); // 상태 업데이트
    console.log(`LED command sent`);
    var lsRequest = {
      service: "luna://com.ugh.app.service",
      method: "toast",
      parameters: {
        alert: `LED를 ${newLedState === 1 ? '켭니다' : '끕니다'}`,
        topic: "LED",
        msg: newLedState.toString(),
      },
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (err) => {
        console.log(err);
      },
    }
    bridge.send(lsRequest);
  };
  return (
      <Panel {...rest} className="env_control_panel">
      <div>
          <div className="env_sidebar">
          <div className="env_back" onClick={() => onNavigate(0)}>돌아가기</div>
          <div className="env_menu_item active">환경제어</div>
          <div className="env_menu_item" onClick={() => onNavigate(1)}>설비제어</div>
          </div>

          <div className="env_main_content">
            <h1 className="env_degree">
                온도 : {envData.temp}°C
                <br />
                습도 : {envData.humidity}%
            </h1>
            <div className="env_card_container">
                <button className="feed" onClick={() => feed()}>
                물주기
                </button>
                <button className="led" onClick={() => led()}>
                LED ON/OFF
                </button>
            </div>
          </div>
      </div>
      </Panel>
  );
};

EnvPanel.propTypes = {
  onNavigate: PropTypes.func.isRequired
};

export default EnvPanel;
