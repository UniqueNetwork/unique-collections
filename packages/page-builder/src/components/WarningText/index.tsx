// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import BN from 'bn.js';
import React, { memo, ReactElement } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { formatStrBalance } from '@polkadot/react-hooks/utils';

import infoIcon from '../../images/infoIcon.svg';

interface WarningFeeProps {
  fee: BN | null;
}

function WarningFeeProps ({ fee }: WarningFeeProps): ReactElement {
  const { api } = useApi();
  const chainName = api?.registry.chainTokens[0];

  return (
    <div className='warning-text'>
      <img
        alt='info-icon'
        src={infoIcon as string}
      />
      { fee && (
        <p>A fee of ~ {formatStrBalance(new BN(10))}  <span className='unit'>{chainName}</span> can be applied to the transaction</p>
      )}
    </div>
  );
}

export default memo(WarningFeeProps);
