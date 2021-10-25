// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import burnIcon from '../images/burnIcon.svg';

function CollectionCard (): React.ReactElement {
  return (
    <div className='collection-card'>
      <div className='collection-card-img'>

      </div>
      <div className='collection-card-content'>
        <div className='collection-card-content-main'>
          <div className='content-description'>
            <p className='content-description-title'>CryptoDuckies оч классные, позитивные,выглядят звездец прикольно</p>
            <div className='content-description-text'>
          Adopt yourself a Duckie and join The Flock.Each Duck is a 1 of 1 programmatically generated with a completely unique combination of traits. No two are identical. In total there are 5000 Duckies. Stay up to date on drops by joining the Discord and following
            </div>
          </div>
          <div className='content-buttons '>
            <button>Create NFT</button>
            <button><img src={burnIcon as string} /> Burn</button>
          </div>
        </div>
        <div className='collection-info'>
          <p><span>ID:</span> 1234567</p>
          <p><span>Prefix:</span> 1234567</p>
          <p><span>Items</span> 10 000</p>
        </div>
        <div className='content-links'>
          <a href=''>Go to Block Explorer</a>
          <a href=''>Go to my Wallet</a>
        </div>
        <div className='content-tokens'>
          <p>NFTs preview</p>
          <div className='content-tokens-list'>
            <img />
            <img />
            <img />
            <img />
            <img />
            <img />
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CollectionCard);
