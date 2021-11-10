// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { memo, ReactElement, useState } from 'react';

import { Dropdown, HelpTooltip } from '@polkadot/react-components';
import { SchemaVersionTypes } from '@polkadot/react-hooks/useCollection';

import trashIcon from '../../images/trashIcon.svg';

const SchemaOptions = [
  {
    text: 'ImageUrl',
    value: 'ImageURL'
  },
  {
    text: 'Unique',
    value: 'Unique'
  }
];

function AddAttributesRow (): ReactElement {
  const [currentSchemaVersion, setCurrentSchemaVersion] = useState<SchemaVersionTypes>();

  return (
    <div className='create-attributes'>
      <div className='row-section'>
        <div className='attribute-label'>
          <p>Attribute</p>
          <HelpTooltip
            className={'help'}
            content={<span>Textual traits that show up on Token</span>}
            mobilePosition={'bottom left'}
          />
        </div>
        <input placeholder='Attribute' />
      </div>
      <div className='row-section type'>
        <div className='attribute-label'>
          <p>Type</p>
          <HelpTooltip
            className={'help'}
            content={<span>Textual traits that show up on Token</span>}
            mobilePosition={'bottom left'}
          />
        </div>
        <div className='dropdown-container'>
          <Dropdown
            defaultValue={currentSchemaVersion}
            onChange={setCurrentSchemaVersion}
            options={SchemaOptions}
            placeholder='Type'
            value={currentSchemaVersion}
          />
        </div>
      </div>
      <div className='row-section rule'>
        <div className='attribute-label'>
          <p>Rule</p>
          <HelpTooltip
            className={'help'}
            content={<span>Set a rule for your attribute</span>}
            mobilePosition={'bottom center'}
          />
        </div>
        <div className='dropdown-container'>
          <Dropdown
            defaultValue={currentSchemaVersion}
            onChange={setCurrentSchemaVersion}
            options={SchemaOptions}
            placeholder='Rule'
            value={currentSchemaVersion}
          />
        </div>
      </div>
      <div className='row-section'>
        <div className='attribute-label'>
          <p>Possible values</p>
          <HelpTooltip
            className={'help'}
            content={<span>Write down all the options you have </span>}
            mobilePosition={'bottom center'}
          />
        </div>
        <div className='last-section'>
          <input placeholder='Values' />
          <img src={trashIcon as string} />
        </div>
      </div>
    </div>
  );
}

export default memo(AddAttributesRow);
