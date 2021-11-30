// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

import { useApi } from '@polkadot/react-hooks';

import infoIcon from '../../images/infoIcon.svg';

function WarningText (): ReactElement {
  const { api } = useApi();

  const tokens = api.registry.chainTokens;

  return (
    <div className='warning-text'>
      <img src={infoIcon as string} />
      <p>A fee of ~ 0.000000000000052 {tokens[0]} can be applied to the transaction</p>
    </div>
  );
}

export default memo(WarningText);
