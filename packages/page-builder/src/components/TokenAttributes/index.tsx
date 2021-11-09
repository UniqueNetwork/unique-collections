// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

import { HelpTooltip } from '@polkadot/react-components';

import plusIcon from '../../images/plusIcon.svg';
import Button from '../Button';
import AddAttributesRow from '../TokenAttributes/AddAttributesRow';
import WarningText from '../WarningText';
import AttributesRow from './AttributesRow';

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
          <HelpTooltip
            className={'help attributes'}
            content={<span>Textual traits that show up on Token</span>}
            defaultPosition={'bottom left'}
          />
        </div>
        <div className='row-title'>
          <p>Type</p>
          <HelpTooltip
            className={'help attributes'}
            content={<span>Select type of information you want to create</span>}
            defaultPosition={'bottom left'}
          />
        </div>
        <div className='row-title'>
          <p>Rule</p>
          <HelpTooltip
            className={'help attributes'}
            content={<span>Set a rule for your attribute</span>}
            defaultPosition={'bottom left'}
          />
        </div>
        <div className='row-title'>
          <p>Possible values</p>
          <HelpTooltip
            className={'help attributes'}
            content={<span>Write down all the options you have </span>}
            defaultPosition={'bottom left'}
          />
        </div>
      </div>
      <AttributesRow />
      <AddAttributesRow />
      <div className='add-field'>Add field <img src={plusIcon as string} /></div>
      <WarningText />
      <div className='attributes-button'>
        <Button
          disable={true}
          onClick={() => console.log('Click on confirm')}
          text='Confirm'
        />
      </div>
    </div>
  );
}

export default memo(TokenAttributes);
