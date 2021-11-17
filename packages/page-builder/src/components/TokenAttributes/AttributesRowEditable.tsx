// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FieldRuleType, FieldType } from '@polkadot/react-components/util/protobufUtils';

import React, { memo, ReactElement, useCallback, useEffect, useState } from 'react';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';

import { Dropdown, HelpTooltip, Input } from '@polkadot/react-components';
import EnumsInput from '@polkadot/react-components/EnumsInput';
import { CountOptions, TypeOptions } from '@polkadot/react-components/ManageCollection/types';
import { AttributeItemType } from '@polkadot/react-components/util/protobufUtils';

import trashIcon from '../../images/trashIcon.svg';

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
  const [isRemoveConfirmationOpen, setIsRemoveConfirmationOpen] = useState<boolean>(false);
  const [currentAttributeName, setCurrentAttributeName] = useState<string>(attributeName);
  const [isAttributeNameError, setIsAttributeNameError] = useState<boolean>(false);

  useEffect(() => {
    if (isAttributeNameError && formErrors.includes(index)) {
      setFormErrors((prev) => {
        prev.splice(prev.indexOf(index), 1);

        return prev;
      });
    }
  }, [formErrors, index, isAttributeNameError, setFormErrors]);

  const closeRemoveConfirmation = useCallback(() => {
    setIsRemoveConfirmationOpen(false);
  }, []);

  const openRemoveConfirmation = useCallback(() => {
    if (isOwner) {
      setIsRemoveConfirmationOpen(true);
    }
  }, [isOwner]);

  const onRemoveItem = useCallback(() => {
    setIsRemoveConfirmationOpen(false);
    removeItem(index);
  }, [index, removeItem]);

  const onSetAttributeName = useCallback(() => {
    const newAttributes = [...attributes];

    for (let i = 0; i < newAttributes.length; i++) {
      if ((newAttributes[i].id !== index && newAttributes[i].name === currentAttributeName) || !currentAttributeName.trim().length) {
        setIsAttributeNameError(true);
        !formErrors.includes(index) && setFormErrors((prevErrors) => [...prevErrors, index]);

        return;
      }
    }

    setAttributeName(currentAttributeName, index);
  }, [attributes, currentAttributeName, formErrors, index, setAttributeName, setFormErrors]);

  const onSetAttributeType = useCallback((type: FieldType) => {
    console.log('onSetAttributeType', type);

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
          isError={!!isAttributeNameError}
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
        <Confirm
          className='unique-modal'
          header={`Deleting the attribute ${attributeName}`}
          onCancel={closeRemoveConfirmation}
          onConfirm={onRemoveItem}
          open={isRemoveConfirmationOpen}
        />
        <img
          alt='deleteIcon'
          onClick={openRemoveConfirmation}
          src={trashIcon as string}
          style={{ cursor: isOwner ? 'pointer' : 'not-allowed' }}
        />
      </div>
    </div>
  );
}

export default memo(AttributesRowEditable);
