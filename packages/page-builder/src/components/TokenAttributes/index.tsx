// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

import AddAttributesRow from '@polkadot/app-builder/components/TokenAttributes/AddAttributesRow';
import AttributesRow from '@polkadot/app-builder/components/TokenAttributes/AttributesRow';

import infoIcon from '../../images/infoIcon.svg';
import plusIcon from '../../images/plusIcon.svg';
import questionIcon from '../../images/questionIcon.svg';

function TokenAttributes (): ReactElement {
  return (
    <div className='token-attributes '>
      <div className='token-attributes-header'>
        <p className='header-title'>Token attributes</p>
        <p className='header-text'>This functionality allows you to customize the token. You can set any traits that will help you create unique NFT: name, accessory, gender, background, face, body, tier etc.</p>
      </div>
      <div className='section'>
        <div className='row-title'>
          <div><p>Attribute</p><img src={questionIcon as string} /></div>
          <div><p>Type</p><img src={questionIcon as string} /></div>
          <div><p>Rule</p><img src={questionIcon as string} /></div>
          <div><p>Possible values</p><img src={questionIcon as string} /></div>
        </div>
        <AddAttributesRow />
        <AttributesRow />
      </div>
      <div className='add-field'>Add field <img src={plusIcon as string} /></div>
      <div className='warning-text'>
        <img src={infoIcon as string} />
        <p>A fee of ~ 0.000000000000052 testUNQ can be applied to the transaction unless the transaction is sponsored</p>
      </div>
      <div className='attributes-button'>
        <div className='confirm-button'>Confirm</div>
      </div>
    </div>
  );
}

export default memo(TokenAttributes);
