// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';

import { HelpTooltip } from '@polkadot/react-components';

import { ArtificialFieldRuleType, ArtificialFieldType } from './AttributesRowEditable';

interface AttributesRowProps {
  attributeName: string;
  attributeType: ArtificialFieldType;
  attributeCountType: ArtificialFieldRuleType;
  attributeValues: string[];
  isOwner: boolean;
}

function AttributesRow (props: AttributesRowProps): ReactElement {
  const { attributeCountType, attributeName, attributeType, attributeValues } = props;

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
          {attributeName}
        </div>
      </div>
      <div className='text-section type'>
        <div className='attribute-label'>
          <p></p>
          <HelpTooltip
            className={'help'}
            content={<span>Textual traits that show up on Token</span>}
            mobilePosition={'bottom left'}
          />
        </div>
        <div className='text-content'>
          {attributeCountType}
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
          {attributeType}
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
            {attributeValues.join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AttributesRow);
