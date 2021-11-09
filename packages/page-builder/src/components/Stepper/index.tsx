// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React from 'react';

function Stepper (): React.ReactElement {
  return (
    <div className='stepper-main'>
      <div className='steps'>
        <div className='step active-step'>1</div>
        <div className='step-line'></div>
        <div className='step'>2</div>
        <div className='step-line'></div>
        <div className='step'>3</div>
      </div>
      <div className='steps-text'>
        <p className='active-line'>Main information</p>
        <p>Cover</p>
        <p>Token attributes</p>
      </div>
    </div>
  );
}

export default Stepper;
