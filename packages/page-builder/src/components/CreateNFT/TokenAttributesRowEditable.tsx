// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TokenAttribute } from '../../types';

import React, { memo, ReactElement, useCallback } from 'react';

import { Dropdown, Input } from '@polkadot/react-components';
import { AttributeItemType } from '@polkadot/react-components/util/protobufUtils';

interface TokenAttributesRowEditableProps {
  collectionAttribute: AttributeItemType;
  setAttributeValue: (attribute: AttributeItemType, value: string | number[]) => void;
  tokenConstAttributes: { [key: string]: TokenAttribute };
}

function TokenAttributesRowEditable (props: TokenAttributesRowEditableProps): ReactElement {
  const { collectionAttribute, setAttributeValue, tokenConstAttributes } = props;

  const onSetAttributeValue = useCallback((value: string | number[]) => {
    setAttributeValue(collectionAttribute, value);
  }, [collectionAttribute, setAttributeValue]);

  return (
    <div className='attributes-input'>
      { collectionAttribute.fieldType === 'string' && (
        <>
          <h2>{collectionAttribute.name}{collectionAttribute.rule === 'required' && '*'}</h2>
          <Input
            className='isSmall'
            onChange={onSetAttributeValue}
            value={tokenConstAttributes[collectionAttribute.name].value as string}
          />
        </>
      )}
      { collectionAttribute.fieldType === 'enum' && (
        <>
          <h2>{collectionAttribute.name}{collectionAttribute.rule === 'required' && '*'}</h2>
          <Dropdown
            isMultiple={collectionAttribute.rule === 'repeated'}
            onChange={onSetAttributeValue}
            options={collectionAttribute.values.map((val: string, index: number) => ({ text: val, value: index }))}
            value={collectionAttribute.rule === 'repeated' ? tokenConstAttributes[collectionAttribute.name].values : tokenConstAttributes[collectionAttribute.name].value}
          />
        </>
      )}
    </div>
  );
}

export default memo(TokenAttributesRowEditable);
