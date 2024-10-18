import React, { useState } from 'react';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Panels from '@enact/sandstone/Panels';

import MainPanel from '../views/MainPanel/MainPanel';
import JigPanel from '../views/jig/JigPanel';

import css from './App.module.less';

const App = (props) => {
    const [panelIndex, setPanelIndex] = useState(0);
    const [noAnimation, setNoAnimation] = useState(false);

    // 화면 이동 시 애니메이션 여부 설정
    const handleNavigate = (index, disableAnimation = false) => {
        if (disableAnimation) {
            setNoAnimation(true); // 애니메이션 비활성화
            setPanelIndex(index);
            setTimeout(() => {
                setNoAnimation(false); // 이후 다시 애니메이션 활성화
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
            </Panels>
        </div>
    );
};

export default ThemeDecorator(App);