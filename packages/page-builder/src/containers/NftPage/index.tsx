// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';
import CreateNFT from '@polkadot/app-builder/components/CreateNFT';

interface NftPageProps {
  account: string;
}

function NftPage ({ account }: NftPageProps): ReactElement {
  return (
    <div className='nft-page'>
      <CreateNFT />
    </div>
  );
}

export default memo(NftPage);
