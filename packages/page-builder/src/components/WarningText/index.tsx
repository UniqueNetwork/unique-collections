// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

import infoIcon from '../../images/infoIcon.svg';

function WarningText (): ReactElement {
  return (
    <div className='warning-text'>
      <img src={infoIcon as string} />
      <p>A fee of ~ 0.000000000000052 testUNQ can be applied to the transaction unless the transaction is sponsored</p>
    </div>
  );
}

export default memo(WarningText);
