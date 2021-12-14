// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { AttributeItemType, FieldRuleType, FieldType, ProtobufAttributeType } from '@polkadot/react-components/util/protobufUtils';

import BN from 'bn.js';
import React, { memo, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';

import { HelpTooltip, StatusContext, UnqButton } from '@polkadot/react-components';
import { fillAttributes, fillProtobufJson } from '@polkadot/react-components/util/protobufUtils';
import { useCollection } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import plusIcon from '../../images/plusIcon.svg';
import AttributesRowEditable from '../TokenAttributes/AttributesRowEditable';
import WarningText from '../WarningText';
import AttributesRow from './AttributesRow';

interface TokenAttributes {
  account: string;
  collectionId: string;
  collectionInfo?: NftCollectionInterface;
}

const defaultAttributesWithTokenIpfs: AttributeItemType[] = [
  {
    fieldType: 'string',
    id: 0,
    name: 'ipfsJson',
    rule: 'required',
    values: []
  }
];

function TokenAttributes ({ account, collectionId, collectionInfo }: TokenAttributes): ReactElement {
  const { calculateSetConstOnChainSchemaFees, getCollectionOnChainSchema, saveConstOnChainSchema } = useCollection();
  const [attributes, setAttributes] = useState<AttributeItemType[]>(defaultAttributesWithTokenIpfs);
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<number[]>([]);
  const [fees, setFees] = useState<BN | null>(null);
  const history = useHistory();
  const { queueAction } = useContext(StatusContext);
  const isOwner = collectionInfo?.owner === account;

  console.log('attributes', attributes, 'collectionId', collectionId);

  const onAddItem = useCallback(() => {
    const newAttributes = [...attributes];

    newAttributes.push({
      fieldType: 'string',
      id: attributes.length,
      name: `attribute${attributes.length}`,
      rule: 'required',
      values: []
    });

    setAttributes(newAttributes);
  }, [attributes]);

  const closeSaveConfirmation = useCallback(() => {
    setIsSaveConfirmationOpen(false);
  }, []);

  const onSuccess = useCallback(() => {
    history.push('/builder');
    queueAction({
      action: '',
      message: 'Collection successfully created',
      status: 'success'
    });
  }, [queueAction, history]);

  const calculateFees = useCallback(async () => {
    try {
      const protobufJson: ProtobufAttributeType = fillProtobufJson(attributes);

      if (account && collectionId) {
        const fees = await calculateSetConstOnChainSchemaFees({ account, collectionId, schema: JSON.stringify(protobufJson) });

        setFees(fees);
      }
    } catch (e) {
      console.log('save onChain schema error', e);
    }
  }, [account, attributes, calculateSetConstOnChainSchemaFees, collectionId]);

  const onSaveForm = useCallback(() => {
    try {
      const protobufJson: ProtobufAttributeType = fillProtobufJson(attributes);

      if (account && collectionId) {
        saveConstOnChainSchema({ account, collectionId, schema: JSON.stringify(protobufJson), successCallback: onSuccess });
      }
    } catch (e) {
      console.log('save onChain schema error', e);
    }
  }, [account, attributes, collectionId, onSuccess, saveConstOnChainSchema]);

  const deleteAttribute = useCallback((index) => {
    setAttributes([
      ...attributes.filter((attribute: AttributeItemType) => attribute.id !== index)
    ]);
  }, [attributes]);

  const onSaveAll = useCallback(() => {
    // user didn't fill attributes, we have only default ipfsJson attribute
    if (attributes.length === 1) {
      setIsSaveConfirmationOpen(true);
    } else {
      onSaveForm();
    }
  }, [attributes, onSaveForm]);

  const setAttributeCountType = useCallback((countType: FieldRuleType, index: number) => {
    setAttributes((prevAttributes: AttributeItemType[]) => {
      const newAttributes = [...prevAttributes];

      newAttributes[index].rule = countType;

      return newAttributes;
    });
  }, []);

  const setAttributeName = useCallback((name: string, index: number) => {
    setAttributes((prevAttributes: AttributeItemType[]) => {
      const newAttributes = [...prevAttributes];

      newAttributes[index].name = name;

      return newAttributes;
    });
  }, []);

  const setAttributeType = useCallback((type: FieldType, index: number) => {
    setAttributes((prevAttributes: AttributeItemType[]) => {
      const newAttributes = [...prevAttributes];

      newAttributes[index].fieldType = type;

      return newAttributes;
    });
  }, []);

  const setAttributeValues = useCallback((values: string[], index: number) => {
    setAttributes((prevAttributes: AttributeItemType[]) => {
      const newAttributes = [...prevAttributes];

      newAttributes[index].values = values;

      return newAttributes;
    });
  }, []);

  const fillCollectionAttributes = useCallback(() => {
    if (collectionInfo?.constOnChainSchema) {
      const onChainSchema = getCollectionOnChainSchema(collectionInfo);

      if (onChainSchema) {
        const { constSchema } = onChainSchema;

        if (constSchema) {
          const previosAttributes = fillAttributes(constSchema);

          if (previosAttributes.find((attr) => attr.name === 'ipfsJson')) {
            setAttributes([...fillAttributes(constSchema)]);
          } else {
            setAttributes([...fillAttributes(constSchema), ...defaultAttributesWithTokenIpfs]);
          }
        }
      }
    }
  }, [collectionInfo, getCollectionOnChainSchema]);

  useEffect(() => {
    fillCollectionAttributes();
  }, [fillCollectionAttributes]);

  useEffect(() => {
    void calculateFees();
  }, [calculateFees]);

  console.log('token attributes', attributes, 'owner', isOwner);

  return (
    <div className='token-attributes '>
      <div className='token-attributes-header'>
        <p className='header-title'>Token attributes</p>
        <p className='header-text'>This functionality allows you to customize the token. You can set any traits that will help you create unique NFT: name, accessory, gender, background, face, body, tier etc.</p>
      </div>
      <div className='attributes-title'>
        <div className='row-title'>
          <p>Attribute name</p>
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
      { !isOwner && attributes.map((attribute: AttributeItemType, index: number) => {
        if (attribute.name !== 'ipfsJson') {
          return (
            <AttributesRow
              attributeCountType={attribute.rule}
              attributeName={attribute.name}
              attributeType={attribute.fieldType}
              attributeValues={attribute.values}
              isOwner={isOwner}
              key={`${attribute.name}-${index}`}
            />
          );
        } else {
          return null;
        }
      })}
      { isOwner && attributes.map((attribute: AttributeItemType, index: number) => {
        if (attribute.name !== 'ipfsJson') {
          return (
            <AttributesRowEditable
              attributeCountType={attribute.rule}
              attributeName={attribute.name}
              attributeType={attribute.fieldType}
              attributeValues={attribute.values}
              attributes={attributes}
              formErrors={formErrors}
              index={index}
              isOwner={isOwner}
              key={`${attribute.name}-${index}`}
              removeItem={deleteAttribute}
              setAttributeCountType={setAttributeCountType}
              setAttributeName={setAttributeName}
              setAttributeType={setAttributeType}
              setAttributeValues={setAttributeValues}
              setFormErrors={setFormErrors}
            />
          );
        } else {
          return null;
        }
      })}
      <UnqButton
        className='add-field '
        onClick={onAddItem}
        size='medium'
      >
          Add field
        <img
          alt='plus'
          src={plusIcon as string}
        />
      </UnqButton>
      { fees && (
        <WarningText fee={fees} />
      )}
      <div className='attributes-button'>
        <Confirm
          cancelButton='No, return'
          className='unique-modal'
          confirmButton='Yes, I am sure'
          header='Are you sure that you want to save collection without attributes?'
          onCancel={closeSaveConfirmation}
          onConfirm={onSaveForm}
          open={isSaveConfirmationOpen}
        />
        <UnqButton
          content='Confirm'
          isDisabled={formErrors?.length > 0}
          isFilled
          onClick={onSaveAll}
          size='medium'
        />
      </div>
    </div>
  );
}

export default memo(TokenAttributes);
