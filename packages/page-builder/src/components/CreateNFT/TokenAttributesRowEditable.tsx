// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TokenAttribute } from '../../types';

import React, { memo, ReactElement, useCallback, useMemo } from 'react';

import { Dropdown, Input } from '@polkadot/react-components';
import { AttributeItemType } from '@polkadot/react-components/util/protobufUtils';

interface TokenAttributesRowEditableProps {
  collectionAttribute: AttributeItemType;
  maxLength: number;
  setAttributeValue: (attribute: AttributeItemType, value: string | number[]) => void;
  tokenConstAttributes: { [key: string]: TokenAttribute };
}

function TokenAttributesRowEditable (props: TokenAttributesRowEditableProps): ReactElement {
  const { collectionAttribute, maxLength, setAttributeValue, tokenConstAttributes } = props;

  const onSetAttributeValue = useCallback((value: string | number[]) => {
    setAttributeValue(collectionAttribute, value);
  }, [collectionAttribute, setAttributeValue]);

  const options = useMemo(() => {
    if (collectionAttribute.rule !== 'repeated' && collectionAttribute.rule !== 'required' && collectionAttribute.fieldType === 'enum') {
      return [{ text: 'None', value: null }, ...collectionAttribute.values.map((val: string, index: number) => ({ text: val, value: index }))];
    }

    return collectionAttribute.values.map((val: string, index: number) => ({ text: val, value: index }));
  }, [collectionAttribute]);

  return (
    <div className='attributes-input'>
      { collectionAttribute.fieldType === 'string' && (
        <>
          <h2>{collectionAttribute.name}{collectionAttribute.rule === 'required' && '*'}</h2>
          <Input
            className='isSmall'
            maxLength={maxLength}
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
            options={options}
            value={collectionAttribute.rule === 'repeated' ? tokenConstAttributes[collectionAttribute.name].values : tokenConstAttributes[collectionAttribute.name].value}
          />
        </>
      )}
    </div>
  );
}

export default memo(TokenAttributesRowEditable);
