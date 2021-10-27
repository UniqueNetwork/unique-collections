// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

function AttributesRow (): ReactElement {
  return (
    <div className='text-field-row'>
      <p>Name</p>
      <p>Text</p>
      <p>Required</p>
      <p>Male, Female</p>
    </div>
  );
}

export default memo(AttributesRow);
