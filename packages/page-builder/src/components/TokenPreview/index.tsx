// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo } from 'react';

import defaultIcon from '../../images/defaultIcon.svg';

function TokenPreview (): React.ReactElement {
  const attributes = ['Name:', 'Gender:', 'Traits:'];

  return (
    <div className='token-preview'>
      <div className='token-preview-header'>Token preview</div>
      <div className='token-preview-content'>
        <div className='token-img'>
          <img src={defaultIcon as string} />
        </div>
        <div className='content-description'>
          <h3 className='content-header'>CryptoDuckies</h3>
          <p className='content-text'>CryptoDuckies text</p>
          <div className='token-attributes'>
            <h4>Token attributes  </h4>
            {attributes.map((item) => <p
              className='content-text'
              key={item}
            >{item}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TokenPreview);
