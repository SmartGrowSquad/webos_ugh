import React, { useState, useEffect } from 'react';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Panels from '@enact/sandstone/Panels';
import axios from 'axios';
import MainPanel from '../views/MainPanel/MainPanel';
import JigPanel from '../views/jig/JigPanel';
import QrReader from '../components/QrReader';
import css from './App.module.less';
import EnvPanel from '../views/env/EnvPanel';
import Camera2  from '../views/camera/Camera2';
import Camera3  from '../views/camera/Camera3';
import LS2Request from "@enact/webos/LS2Request";
import { useDispatch, useSelector } from 'react-redux';
import { setEnvData, setIsWorking } from '../store/store';

const supIp = process.env.SUPER_HOST;

const App = (props) => {
  const [panelIndex, setPanelIndex] = useState(0);
  const [noAnimation, setNoAnimation] = useState(false);
  const envData = useSelector(state => state.envData);
  const dispatch = useDispatch();
  const bridge = new LS2Request();

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
  const startService = () => {
    var params = {}
    var lsRequest = {
      service: "luna://com.ugh.app.service",
      method: "serviceStart",
      parameters: params,
      onSuccess: (msg) => {
        console.log("[ serviceStart ] success ", msg);
      },
      onFailure: (err) => {
        console.log("[ serviceStart ] faile ", err);
      },
    };
    bridge.send(lsRequest);
  }

  const startSubscribe = () => {
    var params = {}
    var lsRequest = {
      service: "luna://com.ugh.app.service",
      method: "subscribeTopics",
      parameters: params,
      subscribe: true,
      onSuccess: (msg) => {
      },
      onFailure: (err) => {
        console.log("[ serviceStart ] faile ", err);
      },
    };
    bridge.send(lsRequest);
  }
  const heartBeatSubscribe = () => {
    var params = {}
    var lsRequest = {
      service: "luna://com.ugh.app.service",
      method: "subscribeToMQTT",
      parameters: {
        subscribe: true
      },
      onSuccess: (msg) => {
        if(msg.topic === 'TEMP') {
          // 환경 데이터인 경우
          console.log("[ heartBeatSubscribe TEMP ]", msg.msg);
          if(msg) dispatch(setEnvData(msg.msg));
        } else if(msg.topic === 'JIG_ESP') {
          // JIG 데이터인 경우
          console.log("[ heartBeatSubscribe JIG_ESP ]", msg.message);
  
          if(msg.message === 'F') dispatch(setIsWorking(false));
        } else if(msg.topic === 'PICTURE') {
          // 사진 데이터인 경우
          console.log("[ heartBeatSubscribe PICTURE ]", msg.message);
          axios.post(`${supIp}/save`, {
            jignum: 1,
            uId: 1,
            temperature: envData.temp,
            humidity: envData.humidity,
            plantArea: 80,
            date: new Date()
          })
        }
      },
      onFailure: (err) => {
        console.log("[ serviceStart ] faile ", err);
      },
    };
    bridge.send(lsRequest);
  }
  useEffect(() => {
    startService();
    startSubscribe();
    heartBeatSubscribe();
    
  }, []);
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