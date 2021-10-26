// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

function CollectionPreview (): React.ReactElement {
  return (
    <div style={{ height: '300px', width: '40%' }}>
      <div className='collection-preview'>
        <div className='collection-preview-header'>Collection preview</div>
        <div className='collection-preview-content'>
          <img />
          <div className='content-description'>
            <h3 className='content-header'>CryptoDuckies</h3>
            <p className='content-text'>Adopt yourself a Duckie and join The Flock. Each Duck is a 1 of 1 programmatically generated with a completely unique combination of traits. No two are identical. In total, there are 5000 Duckies. Stay up to date on drops by joining the Discord and following</p>
            <p className='content-info'><span>ID:</span> 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectionPreview;
