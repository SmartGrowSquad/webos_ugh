import kind from '@enact/core/kind';
import Panel from '@enact/sandstone/Panels';
import Button from '@enact/sandstone/Button';
import React from 'react';
import PropTypes from 'prop-types';
import './EnvPanel.css';

const EnvPanel = kind({
  name: 'EnvPanel',
  propTypes: {
    onNavigate: PropTypes.func.isRequired
  },
  render: ({ onNavigate, ...rest }) => {
    const dummyDegree = [{ degree: 28, humidity: 40 }];

    return (
      <Panel {...rest} className="env_control_panel">
        <div>
          <div className="env_sidebar">
            <div className="env_back" onClick={() => onNavigate(0)}>돌아가기</div>
            <div className="env_menu_item active">환경제어</div>
            <div className="env_menu_item" onClick={() => onNavigate(1)}>설비제어</div>
          </div>

          <div className="env_main_content">
            {dummyDegree.map((dat) => (
              <React.Fragment key={dat.degree}>
                <h1 className="env_degree">온도 : {dat.degree}°C
                  <br/>
                  습도 : {dat.humidity}%
                </h1>
                <div className="env_card_container">
                  <button className="feed" onClick={() => console.log('물주기 클릭됨')}>
                    물주기
                  </button>
                  <button className="led" onClick={() => console.log('LED ON/OFF 클릭됨')}>
                    LED ON/OFF
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </Panel>
    );
  }
});

export default EnvPanel;
