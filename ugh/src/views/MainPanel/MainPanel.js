import PropTypes from 'prop-types';
import Button from '@enact/sandstone/Button';
import Panel from '@enact/sandstone/Panels';
import React from 'react';
import './MainPanel.css';

const MainPanel = ({ onNavigate, ...rest }) => {

  return (
    <Panel {...rest} className='container'>
      <div>
        <div>
          <div className="qrButtonContainer" onClick={() => onNavigate(3)}>
            Pick up!
          </div>
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
