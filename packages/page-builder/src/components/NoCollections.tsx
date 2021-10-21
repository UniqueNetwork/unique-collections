// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import noCollectionsIcon from '../images/noCollections.svg';

function NoCollections (): React.ReactElement {
  return (
    <div className='no-collections'>
      <img src={noCollectionsIcon as string} />
      <p>You have no collections</p>
    </div>
  );
}

export default React.memo(NoCollections);
