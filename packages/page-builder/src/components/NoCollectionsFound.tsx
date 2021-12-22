// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import noCollectionsIcon from '../images/noCollections.svg';

function NoCollectionsFound (): React.ReactElement {
  return (
    <div className='no-collections'>
      <img src={noCollectionsIcon as string} />
      <p>No collections found</p>
    </div>
  );
}

export default React.memo(NoCollectionsFound);
