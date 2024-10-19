import React from 'react';
import Panel from '@enact/sandstone/Panels';
import Button from '@enact/sandstone/Button';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './JigPanel.css';

const JigPanel = ({ onNavigate, ...rest }) => {
  const dummyData = [
    { id: 1, status: 'red' },
    { id: 2, status: 'red' },
    { id: 3, status: 'green' },
    { id: 4, status: 'green' }
  ];

  const dummyDegree = [
    { degree: 28, humidity: 40 }
  ];

  // Toast notification을 위한 함수
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

  // PUT 버튼 클릭 시 MQTT 서비스로 요청
  const handlePut = (id) => {
    const putMessage = id + 4;
    console.log(`PUT command sent: ${putMessage}`);
    notify(`${id}번 지그를 넣습니다.`);

    axios.post('http://localhost:4000/publish', {
      topic: 'JIG',
      message: putMessage.toString()
    })
    .then(response => {
      console.log('Message sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
  };

  // GET 버튼 클릭 시 MQTT 서비스로 요청
  const handleGet = (id) => {
    console.log(`GET command sent: ${id}`);
    notify(`${id}번 지그를 가져옵니다.`);

    axios.post('http://localhost:4000/publish', {
      topic: 'JIG',
      message: id.toString()
    })
    .then(response => {
      console.log('Message sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
  };

  return (
    <Panel {...rest} className="jig_control_panel">
      
      <div>
        <ToastContainer/>
        <div className="jig_sidebar">
          <div className="jig_back" onClick={() => onNavigate(0)}>돌아가기</div>
          <div className="jig_menu_item" onClick={() => onNavigate(2)}>환경제어</div>
          <div className="jig_menu_item active">설비제어</div>
        </div>

        <div className="jig_main_content">
          {dummyDegree.map((dat) => (
            <React.Fragment key={dat.degree}>
              <h1 className="jig_degree">온도 : {dat.degree}°C
                <br />
                습도 : {dat.humidity}%
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
                        disabled={data.status !== 'red'}
                        onClick={() => handlePut(data.id)}
                      >
                        PUT
                      </Button>
                      <Button
                        className="get"
                        disabled={data.status !== 'green'}
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
