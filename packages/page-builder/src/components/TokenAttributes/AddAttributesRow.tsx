// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { memo, ReactElement } from 'react';

import triangle from '../../images/triangle.svg';

function AddAttributesRow (): ReactElement {
  return (
    <div className='add-field-row'>
      <div>
        <input placeholder='Attribute name' />
      </div>
      <div>
        <input placeholder='Type ' />
        <img src={triangle as string} />
      </div>
      <div>
        <input placeholder='Rule ' />
        <img src={triangle as string} />
      </div>
      <div>
        <input placeholder='Values'></input>
      </div>
    </div>
  );
}

export default memo(AddAttributesRow);
