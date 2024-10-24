import React, { useEffect } from 'react';
import './Camera2.css';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Camera2 = ({ onNavigate }) => {
  const isWorking = useSelector(state => state.isWorking);
  useEffect(() => {
    if(!isWorking) {
      onNavigate(5);
    }
  }, [isWorking]) 
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
