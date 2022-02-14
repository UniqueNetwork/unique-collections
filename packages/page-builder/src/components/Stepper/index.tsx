// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';

function Stepper (): React.ReactElement {
  const location = useLocation();

  return (
    <div className='stepper-main shadow-block'>
      <div className='steps'>
        <div
          className={`${location.pathname.includes('/main-information') ? 'step active-step' : 'step'}`}
        >
          1
        </div>
        <div className='step-line' />
        <div
          className={`${location.pathname.includes('/cover') ? 'step active-step' : 'step'}`}
        >
          2
        </div>
        <div className='step-line' />
        <div
          className={`${location.pathname.includes('/token-attributes') ? 'step active-step' : 'step'}`}
        >
          3
        </div>
      </div>
      <div className='steps-text'>
        <span className={`${location.pathname.includes('/main-information') ? 'active-line' : 'step'}`}>Main information</span>
        <span className={`${location.pathname.includes('/cover') ? 'active-line' : 'step'}`}>Cover</span>
        <span className={`${location.pathname.includes('/token-attributes') ? 'active-line' : 'step'}`}>Token attributes</span>
      </div>
    </div>
  );
}

export default memo(Stepper);
