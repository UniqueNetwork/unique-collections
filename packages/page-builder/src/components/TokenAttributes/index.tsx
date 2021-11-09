// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

import AddAttributesRow from '../TokenAttributes/AddAttributesRow';

import plusIcon from '../../images/plusIcon.svg';
import questionIcon from '../../images/questionIcon.svg';
import AttributesRow from './AttributesRow';
import WarningText from "../WarningText";
import Button from "../Button";

function TokenAttributes (): ReactElement {
  return (
    <div className='token-attributes '>
      <div className='token-attributes-header'>
        <p className='header-title'>Token attributes</p>
        <p className='header-text'>This functionality allows you to customize the token. You can set any traits that will help you create unique NFT: name, accessory, gender, background, face, body, tier etc.</p>
      </div>
      <div className='attributes-title'>
        <div className='row-title'>
          <p>Attribute type</p>
          <img src={questionIcon as string} />
        </div>
        <div className='row-title'>
          <p>Type</p>
          <img src={questionIcon as string} />
        </div>
        <div className='row-title'>
          <p>Rule</p>
          <img src={questionIcon as string} />
        </div>
        <div className='row-title'>
          <p>Possible values</p>
          <img src={questionIcon as string} />
        </div>
      </div>
      <AttributesRow />
      <AddAttributesRow />
      <div className='add-field'>Add field <img src={plusIcon as string} /></div>
      <WarningText />
      <div className='attributes-button'>
        <Button
          text="Confirm"
          onClick={()=>console.log('Click on confirm')}
          disable={true}
        />
      </div>
    </div>
  );
}

export default memo(TokenAttributes);
