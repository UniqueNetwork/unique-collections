// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React from 'react';

import Button from '../Button';
import WarningText from '../WarningText';

function MainInformation (): React.ReactElement {
  return (
    <div className='main-information'>
      <h1 className='header-text'>Main information</h1>
      <div className='info-block'>
        <h2>Name*</h2>
        <p>Required field (max 64 symbols)</p>
        <input />
      </div>
      <div className='info-block'>
        <h2>Description</h2>
        <p>Max 256 symbols</p>
        <textarea />
      </div>
      <div className='info-block'>
        <h2>Prefix*</h2>
        <p>Token name as displayed in Wallet (max 16 symbols)</p>
        <input />
      </div>
      <WarningText />
      <Button
        disable={false}
        onClick={() => console.log('Click on confirm')}
        text='Confirm'
      />
    </div>
  );
}

export default MainInformation;
