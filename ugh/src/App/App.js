import React, { useState } from 'react';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Panels from '@enact/sandstone/Panels';

import MainPanel from '../views/MainPanel/MainPanel';
import JigPanel from '../views/jig/JigPanel';
import QrReader from '../components/QrReader';
import css from './App.module.less';
import EnvPanel from '../views/env/EnvPanel';
import Camera2  from '../views/camera/Camera2';
import Camera3  from '../views/camera/Camera3';

const App = (props) => {
  const [panelIndex, setPanelIndex] = useState(0);
  const [noAnimation, setNoAnimation] = useState(false);

  const handleNavigate = (index, disableAnimation = false) => {
    if (disableAnimation) {
      setNoAnimation(true);
      setPanelIndex(index);
      setTimeout(() => {
        setNoAnimation(false);
      }, 100);
    } else {
      setPanelIndex(index);
    }
  };

  return (
    <div {...props} className={css.app}>
      <Panels index={panelIndex} noCloseButton noAnimation={noAnimation}>
        <MainPanel onNavigate={(index) => handleNavigate(index)} />
        <JigPanel onNavigate={(index) => handleNavigate(index, true)} onBack={() => handleNavigate(0)} />
        <EnvPanel onNavigate={(index) => handleNavigate(index, true)} onBack={() => handleNavigate(0)} />
        <QrReader onNavigate={(index) => handleNavigate(index)} onBack={() => handleNavigate(0)} />
        <Camera2 onNavigate={(index) => handleNavigate(index)} />
        <Camera3 onNavigate={(index) => handleNavigate(index)} />
      </Panels>
    </div>
  );
};

export default ThemeDecorator(App);
