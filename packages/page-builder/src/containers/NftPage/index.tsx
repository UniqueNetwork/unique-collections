// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

interface NftPageProps {
  account: string;
}

function NftPage ({ account }: NftPageProps): ReactElement {
  return (
    <div className='nft-page'>
      NftPage
    </div>
  );
}

export default memo(NftPage);
