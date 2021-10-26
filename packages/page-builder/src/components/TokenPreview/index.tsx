// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './style.scss';

import React from 'react';

function TokenPreview (): React.ReactElement {
  return (
    <div className='token-preview '>
      <div className='token-preview-header'>Token preview</div>
      <div className='token-preview-content'>
        <img />
        <div className='content-description'>
          <h3 className='content-header'>CryptoDuckies</h3>
          <p className='content-text'>CryptoDuckies text</p>
        </div>
      </div>
    </div>
  );
}

export default TokenPreview;
