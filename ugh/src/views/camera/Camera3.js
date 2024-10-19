import React, { useState } from 'react';
import './Camera3.css';
import PropTypes from 'prop-types';

const Camera3 = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);

  const handleProceed = () => {
    setLoading(false);
  };

  return (
    <div className="camera3_container">
      {loading ? (
        <div className="loading_message">
          완료입니다
        </div>
      ) : (
        <div className="camera3_content">
          <button onClick={handleProceed}>다음 작업</button>
          <button onClick={() => onNavigate(0)}>돌아가기</button>
        </div>
      )}
    </div>
  );
};

Camera3.propTypes = {
  onNavigate: PropTypes.func.isRequired
};

export default Camera3;