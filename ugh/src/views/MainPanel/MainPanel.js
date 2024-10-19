import PropTypes from 'prop-types';
import Button from '@enact/sandstone/Button';
import Panel from '@enact/sandstone/Panels';
import React from 'react';
import './MainPanel.css';

const MainPanel = ({ onNavigate, ...rest }) => {
  return (
    <Panel {...rest}>
      <div>
        <div className="qrButtonContainer">
          <Button onClick={() => onNavigate(3)}>
            QR 코드 인식하기
          </Button>
        </div>
        <div className="controlButtonContainer">
          <Button onClick={() => onNavigate(1)}>
            제어 화면으로 이동
          </Button>
        </div>
      </div>
    </Panel>
  );
};

MainPanel.propTypes = {
  onNavigate: PropTypes.func.isRequired
};

export default MainPanel;
