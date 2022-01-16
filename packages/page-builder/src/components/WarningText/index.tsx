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
        <>
          {`A fee of ~ ${formatStrBalance(fee)}  ${chainName} can be applied to the transaction`}
        </>
      )}
    </div>
  );
}

export default memo(WarningFeeProps);
