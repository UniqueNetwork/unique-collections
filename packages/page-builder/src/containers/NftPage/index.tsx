// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

import { AppProps as Props } from '@polkadot/react-components/types';

function NftPage ({ account, basePath }: Props): ReactElement {
  return (
    <div className='nft-page'>
      NftPage
    </div>
  );
}

export default memo(NftPage);
