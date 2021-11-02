// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { memo, ReactElement, useState } from 'react';

import { Dropdown } from '@polkadot/react-components';
import { SchemaVersionTypes } from '@polkadot/react-hooks/useCollection';

import questionIcon from '../../images/questionIcon.svg';
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
          <img src={questionIcon as string} />
        </div>
        <input placeholder='Attribute' />
      </div>
      <div className='row-section type'>
        <div className='attribute-label'>
          <p>Type</p>
          <img src={questionIcon as string} />
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
          <img src={questionIcon as string} />
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
          <img src={questionIcon as string} />
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
