import React, { useState, useEffect } from 'react';
import Panel from '@enact/sandstone/Panels';
import Button from '@enact/sandstone/Button';
import PropTypes from 'prop-types';
import LS2Request from "@enact/webos/LS2Request";
import { useSelector } from 'react-redux';
import './JigPanel.css';

const JigPanel = ({ onNavigate, ...rest }) => {
  const envData = useSelector(state => state.envData);
  const [buttonsEnabled, setButtonsEnabled] = useState(true); // 기본 상태는 데이터에 따라 활성화 결정
  const dummyData = [
    { id: 1, status: 'red' },
    { id: 2, status: 'red' },
    { id: 3, status: 'green' },
    { id: 4, status: 'green' }
  ];

  const dummyDegree = [
    { degree: 28, humidity: 40 }
  ];
  const bridge = new LS2Request();

  // MQTT 메시지 구독 후 버튼 활성화 처리
  useEffect(() => {
    const handleMqttMessage = (msg) => {
      console.log(`Received MQTT message: ${msg}`);
      if (msg === 'F') {
        setButtonsEnabled(true); // 'F' 메시지를 수신하면 버튼 활성화
      }
    };
    bridge.send(lsRequest);

    // Cleanup function
    return () => {
      bridge.cancel(lsRequest);
    };
  }, []); // 컴포넌트 마운트 후 1회만 실행

  // PUT 버튼 클릭 시 MQTT 서비스로 요청 후 버튼 비활성화
  const handlePut = (id) => {
    setButtonsEnabled(false); // PUT을 누르면 모든 버튼 비활성화
    const putMessage = id + 4;
    console.log(`PUT command sent: ${putMessage}`);

    var lsRequest = {
      service: "luna://com.ugh.app.service",
      method: "toast",
      parameters: {
        alert: `${id}번 지그에 넣습니다.`,
        topic: "JIG",
        msg: putMessage.toString(),
      },
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (err) => {
        console.log(err);
      },
    };
    bridge.send(lsRequest);
  };

  // GET 버튼 클릭 시 MQTT 서비스로 요청 후 버튼 비활성화
  const handleGet = (id) => {
    setButtonsEnabled(false); // GET을 누르면 모든 버튼 비활성화
    console.log(`GET command sent: ${id}`);

    var lsRequest = {
      service: "luna://com.ugh.app.service",
      method: "toast",
      parameters: {
        alert: `${id}번 지그를 빼는 중입니다.`,
        topic: "JIG",
        msg: id.toString(),
      },
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (err) => {
        console.log(err);
      },
    };
    bridge.send(lsRequest);
  };

  return (
    <Panel {...rest} className="jig_control_panel">
      <div>
        <div className="jig_sidebar">
          <div className="jig_back" onClick={() => onNavigate(0)}>돌아가기</div>
          <div className="jig_menu_item" onClick={() => onNavigate(2)}>환경제어</div>
          <div className="jig_menu_item active">설비제어</div>
        </div>

        <div className="jig_main_content">
          {dummyDegree.map((dat) => (
            <React.Fragment key={dat.degree}>
              <h1 className="jig_degree">
                온도 : {envData.temp}°C
                <br />
                습도 : {envData.humidity}%
              </h1>
              <div className="jig_card_container">
                {dummyData.map((data) => (
                  <div className="jig_card" key={data.id}>
                    <div className="jig_card_header">
                      <span>No.{data.id}</span>
                      <div className={`jig_status_indicator ${data.status}`}></div>
                    </div>
                    <div className="jig_card_body">
                      <Button
                        className="put"
                        disabled={!buttonsEnabled || data.status !== 'red'} // 데이터에 따라 버튼 활성화 여부 결정
                        onClick={() => handlePut(data.id)}
                      >
                        PUT
                      </Button>
                      <Button
                        className="get"
                        disabled={!buttonsEnabled || data.status !== 'green'} // 데이터에 따라 버튼 활성화 여부 결정
                        onClick={() => handleGet(data.id)}
                      >
                        GET
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </Panel>
  );
};

JigPanel.propTypes = {
  onNavigate: PropTypes.func
};

export default JigPanel;
