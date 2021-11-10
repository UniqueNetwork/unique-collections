// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo } from 'react';

function Stepper (): React.ReactElement {
  return (
    <div className='stepper-main'>
      <div className='steps'>
        <div className='step active-step'>1</div>
        <div className='step-line' />
        <div className='step'>2</div>
        <div className='step-line' />
        <div className='step'>3</div>
      </div>
      <div className='steps-text'>
        <span className='active-line'>Main information</span>
        <span>Cover</span>
        <span>Token attributes</span>
      </div>
    </div>
  );
}

export default memo(Stepper);
