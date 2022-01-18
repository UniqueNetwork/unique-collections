// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FieldRuleType } from '@polkadot/react-components/util/protobufUtils';

import React, { memo, ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import { Dropdown, HelpTooltip, Input } from '@polkadot/react-components';
import EnumsInput from '@polkadot/react-components/EnumsInput';

import trashIcon from '../../images/trashIcon.svg';

export type ArtificialFieldType = 'string' | 'enum' | 'repeated';
export type ArtificialFieldRuleType = 'optional' | 'required';

// export type FieldType = 'string' | 'enum';
// export type FieldRuleType = 'optional' | 'required' | 'repeated';

export type ArtificialAttributeItemType = {
  id: number,
  fieldType: ArtificialFieldType;
  name: string;
  rule: ArtificialFieldRuleType;
  values: string[];
}

export type TypeOption = {
  text: string;
  value: ArtificialFieldType;
}

export type CountOption = {
  text: string;
  value: FieldRuleType;
}

export const TypeOptions: TypeOption[] = [
  {
    text: 'Text',
    value: 'string'
  },
  {
    text: 'Select',
    value: 'enum'
  },
  {
    text: 'Multiselect',
    value: 'repeated'
  }
];

export const CountOptions: CountOption[] = [
  {
    text: 'Optional',
    value: 'optional'
  },
  {
    text: 'Required',
    value: 'required'
  }
];

interface AttributesRowEditableProps {
  attributeName: string;
  attributeType: ArtificialFieldType;
  attributeCountType: ArtificialFieldRuleType;
  attributeValues: string[];
  id: number;
  isOwner: boolean;
  removeItem: (index: number) => void;
  setEmptyEnums: (prevErrors: number[]) => void;
  setFormErrors: (arr: (prevErrors: number[]) => number[]) => void;
  setAttributeCountType: (attributeCountType: ArtificialFieldRuleType, index: number) => void;
  setAttributeName: (attributeName: string, index: number) => void;
  setAttributeType: (attributeType: ArtificialFieldType, index: number) => void;
  setAttributeValues: (attributeValues: string[], index: number) => void;
  attributes: ArtificialAttributeItemType[]
  formErrors: number[]
}

function AttributesRowEditable (props: AttributesRowEditableProps): ReactElement {
  const { attributeCountType, attributeName, attributeType, attributeValues, attributes, formErrors, id, isOwner, removeItem, setAttributeCountType, setAttributeName, setAttributeType, setAttributeValues, setEmptyEnums, setFormErrors } = props;
  const [currentAttributeName, setCurrentAttributeName] = useState<string>(attributeName);
  const [isAttributeNameError, setIsAttributeNameError] = useState<boolean>(false);
  const attrName = useRef<string>();

  const onRemoveItem = useCallback(() => {
    removeItem(id);
  }, [id, removeItem]);

  const onSetAttributeName = useCallback(() => {
    setAttributeName(currentAttributeName, id);
  }, [currentAttributeName, id, setAttributeName]);

  const checkFieldsOnErrors = useCallback(() => {
    for (let i = 0; i < attributes.length; i++) {
      // check if name of the attribute does not exist
      const isNameNotUniq: boolean = attributes[i].id !== id && attributes[i].name === currentAttributeName;
      // check if name of the attribute is not empty
      const isNameEmpty = !currentAttributeName.trim().length;

      if (isNameNotUniq || isNameEmpty) {
        setIsAttributeNameError(true);

        // check if we already have current error
        if (!formErrors.includes(id)) {
          setFormErrors((prevErrors) => [...prevErrors, id]);
        }

        return;
        // remove from errors if everything is ok
      } else if (formErrors.includes(id)) {
        setFormErrors((prevErrors) => prevErrors.filter((item) => item !== id));
        setIsAttributeNameError(false);
      }
    }
  }, [attributes, currentAttributeName, formErrors, id, setFormErrors]);

  const onSetAttributeType = useCallback((type: ArtificialFieldType) => {
    setAttributeType(type, id);

    if (type === 'repeated') {
      setAttributeCountType('optional', id);
    }
  }, [id, setAttributeType, setAttributeCountType]);

  const onSetAttributeCountType = useCallback((countType: ArtificialFieldRuleType) => {
    setAttributeCountType(countType, id);
  }, [id, setAttributeCountType]);

  const onSetAttributeValues = useCallback((values: string[]) => {
    setAttributeValues(values, id);
  }, [id, setAttributeValues]);

  const checkEmptyValues = useCallback(() => {
    const enumAttributesErrors = attributes
      .filter((attribute) => (attribute.fieldType === 'enum' || attribute.fieldType === 'repeated') && !attribute.values.length && attribute.name !== 'ipfsJson')
      .map((item) => item.id);

    setEmptyEnums(enumAttributesErrors);
  }, [attributes]);

  useEffect(() => {
    checkEmptyValues();
  }, [checkEmptyValues]);

  useEffect(() => {
    if (attrName.current !== currentAttributeName) {
      onSetAttributeName();
    }

    attrName.current = currentAttributeName;
  }, [currentAttributeName, onSetAttributeName]);

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
        <Input
          className='isSmall'
          isError={isAttributeNameError}
          onBlur={checkFieldsOnErrors}
          onChange={setCurrentAttributeName}
          placeholder='Attribute name'
          value={currentAttributeName}
        />
        { isAttributeNameError && <p className='input-error'>Type the unique name!</p> }
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
            onChange={onSetAttributeType}
            options={TypeOptions}
            placeholder='Type'
            value={attributeType}
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
            isDisabled={attributeType === 'repeated'}
            onChange={onSetAttributeCountType}
            options={CountOptions}
            placeholder='Rule'
            value={attributeCountType}
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
          <EnumsInput
            isDisabled={attributeType === 'string'}
            maxSymbols={40}
            setValues={onSetAttributeValues}
            values={attributeValues}
          />
        </div>
      </div>
      <div className='row-section actions'>
        <img
          alt='deleteIcon'
          className='deleteIcon'
          onClick={onRemoveItem}
          src={trashIcon as string}
          style={{ cursor: isOwner ? 'pointer' : 'not-allowed' }}
        />

      </div>
    </div>
  );
}

export default memo(AttributesRowEditable);
