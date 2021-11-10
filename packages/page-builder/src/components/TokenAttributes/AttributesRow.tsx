// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

import { HelpTooltip } from '@polkadot/react-components';

import trashIcon from '../../images/trashIcon.svg';

function AttributesRow (): ReactElement {
  return (
    <div className='text-field-row '>
      <div className='text-section'>
        <div className='attribute-label'>
          <p>Attribute</p>
          <HelpTooltip
            className={'help'}
            content={<span>Textual traits that show up on Token</span>}
            mobilePosition={'bottom left'}
          />
        </div>
        <div className='text-content'>
          Name
        </div>
      </div>
      <div className='text-section type'>
        <div className='attribute-label'>
          <p>Type</p>
          <HelpTooltip
            className={'help'}
            content={<span>Textual traits that show up on Token</span>}
            mobilePosition={'bottom left'}
          />
        </div>
        <div className='text-content'>
          Select
        </div>
      </div>
      <div className='text-section rule'>
        <div className='attribute-label'>
          <p>Rule</p>
          <HelpTooltip
            className={'help'}
            content={<span>Set a rule for your attribute</span>}
            mobilePosition={'bottom center'}
          />
        </div>
        <div className='text-content'>
          Required
        </div>
      </div>
      <div className='text-section'>
        <div className='attribute-label'>
          <p>Possible value</p>
          <HelpTooltip
            className={'help'}
            content={<span>Write down all the options you have </span>}
            mobilePosition={'bottom center'}
          />
        </div>
        <div className='last-section'>
          <div className='text-content'>
            Black Lipstick, Red Lipstick, Smile, Teeth Smile,
            Purple Lipstick, Nose Ring, Asian Eyes, Sunglasses,
            Red Glasses, Round Eyes, Left Earring, Right Earring, Two Earrings, Brown Beard, Mustache Beard,
          </div>
          <img src={trashIcon as string} />
        </div>
      </div>
    </div>
  );
}

export default memo(AttributesRow);
