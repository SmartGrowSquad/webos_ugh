import React from 'react';
import Panel from '@enact/sandstone/Panels';
import Button from '@enact/sandstone/Button';
import PropTypes from 'prop-types';
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

  return (
    <Panel {...rest} className="jig_control_panel">
      <div>
        {/* 사이드바 */}
        <div className="jig_sidebar">
          <div className="jig_back" onClick={() => onNavigate(0)}>돌아가기</div>
          <div className="jig_menu_item active">설비제어</div>
        </div>

        {/* 메인 컨텐츠 */}
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
                      >
                        PUT
                      </Button>
                      <Button
                        className="get"
                        disabled={data.status !== 'green'}
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
