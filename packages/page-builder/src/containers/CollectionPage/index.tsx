// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

interface CollectionPageProps {
  account: string;
}

function CollectionPage ({ account }: CollectionPageProps): ReactElement {
  return (
    <div className='collection-page'>
    </div>
  );
}

export default memo(CollectionPage);
