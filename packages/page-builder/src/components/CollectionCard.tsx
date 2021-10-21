// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

function CollectionCard (): React.ReactElement {
  return (
    <div className='collection-card'>
      <div className='collection-card-img'>

      </div>
      <div className='collection-card-content'>
        <div className='content-description'>
          <p className='content-description-title'>CryptoDuckies оч классные, позитивные,выглядят звездец прикольно</p>
          <div className='content-description-text'>
          Adopt yourself a Duckie and join The Flock.Each Duck is a 1 of 1 programmatically generated with a completely unique combination of traits. No two are identical. In total there are 5000 Duckies. Stay up to date on drops by joining the Discord and following
          </div>
          <div className='collection-info'>
            <p>ID: 1234567</p>
            <p>Prefix: 1234567</p>
            <p>Items: 10 000</p>
          </div>
        </div>
        <div className='content-buttons'>
          <button>Create NFT</button>
          <button>Go Burn</button>
        </div>
      </div>

    </div>
  );
}

export default React.memo(CollectionCard);
