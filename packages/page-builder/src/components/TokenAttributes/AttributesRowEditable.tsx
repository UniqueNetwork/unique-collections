// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FieldRuleType, FieldType } from '@polkadot/react-components/util/protobufUtils';

import React, { memo, ReactElement, useCallback, useEffect, useState } from 'react';

import { Dropdown, HelpTooltip, Input } from '@polkadot/react-components';
import EnumsInput from '@polkadot/react-components/EnumsInput';
import { AttributeItemType } from '@polkadot/react-components/util/protobufUtils';

import editIcon from '../../images/editIcon.svg';
import trashIcon from '../../images/trashIcon.svg';

export type TypeOption = {
  text: string;
  value: FieldType;
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
  },
  {
    text: 'Repeated',
    value: 'repeated'
  }
];

interface AttributesRowEditableProps {
  attributeName: string;
  attributeType: FieldType;
  attributeCountType: FieldRuleType;
  attributeValues: string[];
  index: number;
  isOwner: boolean;
  removeItem: (index: number) => void;
  setFormErrors: (arr: (prevErrors: number[]) => number[]) => void;
  setAttributeCountType: (attributeCountType: FieldRuleType, index: number) => void;
  setAttributeName: (attributeName: string, index: number) => void;
  setAttributeType: (attributeType: FieldType, index: number) => void;
  setAttributeValues: (attributeValues: string[], index: number) => void;
  attributes: AttributeItemType[]
  formErrors: number[]
}

function AttributesRowEditable (props: AttributesRowEditableProps): ReactElement {
  const { attributeCountType, attributeName, attributeType, attributeValues, attributes, formErrors, index, isOwner, removeItem, setAttributeCountType, setAttributeName, setAttributeType, setAttributeValues, setFormErrors } = props;
  const [currentAttributeName, setCurrentAttributeName] = useState<string>(attributeName);
  const [isAttributeNameError, setIsAttributeNameError] = useState<boolean>(false);

  const removeError = useCallback(() => {
    if (isAttributeNameError && formErrors.includes(index)) {
      setFormErrors((prev) => {
        prev.splice(prev.indexOf(index), 1);

        return prev;
      });
    }
  }, [formErrors, index, isAttributeNameError, setFormErrors]);

  useEffect(() => {
    removeError();
  }, [removeError]);

  const onRemoveItem = useCallback(() => {
    removeItem(index);
  }, [index, removeItem]);

  const onSetAttributeName = useCallback(() => {
    const newAttributes = [...attributes];

    for (let i = 0; i < newAttributes.length; i++) {
      // check if name of the attribute does not exist
      const isNameUniq: boolean = newAttributes[i].id !== index && newAttributes[i].name === currentAttributeName;
      // check if name of the attribute is not empty
      const isNameEmpty = !currentAttributeName.trim().length;

      if (isNameUniq || isNameEmpty) {
        setIsAttributeNameError(true);

        // check if we already have current error
        if (!formErrors.includes(index)) {
          setFormErrors((prevErrors) => [...prevErrors, index]);
        }

        return;
      }
    }

    setAttributeName(currentAttributeName, index);
  }, [attributes, currentAttributeName, formErrors, index, setAttributeName, setFormErrors]);

  const onSetAttributeType = useCallback((type: FieldType) => {
    setAttributeType(type, index);
  }, [index, setAttributeType]);

  const onSetAttributeCountType = useCallback((countType: FieldRuleType) => {
    setAttributeCountType(countType, index);
  }, [index, setAttributeCountType]);

  const onSetAttributeValues = useCallback((values: string[]) => {
    setAttributeValues(values, index);
  }, [index, setAttributeValues]);

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
          onBlur={onSetAttributeName}
          onChange={setCurrentAttributeName}
          placeholder='Attribute name'
          value={currentAttributeName}
        />
        { isAttributeNameError && <p className='input-error'>Type the unique name !</p> }
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
          { attributeType !== 'string' && (
            <EnumsInput
              setValues={onSetAttributeValues}
              values={attributeValues}
            />
          )}
        </div>
      </div>
      <div className='row-section actions'>
        <img
          alt='editIcon'
          className='editIcon'
          src={editIcon as string}
          style={{ cursor: isOwner ? 'pointer' : 'not-allowed' }}
        />
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
