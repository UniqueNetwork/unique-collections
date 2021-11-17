// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { AttributeItemType, FieldRuleType, FieldType, ProtobufAttributeType } from '@polkadot/react-components/util/protobufUtils';

import React, { memo, ReactElement, useCallback, useEffect, useState } from 'react';

import { HelpTooltip } from '@polkadot/react-components';
import { fillAttributes, fillProtobufJson } from '@polkadot/react-components/util/protobufUtils';
import { useCollection } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import plusIcon from '../../images/plusIcon.svg';
import Button from '../Button';
import AttributesRowEditable from '../TokenAttributes/AttributesRowEditable';
import WarningText from '../WarningText';
import AttributesRow from './AttributesRow';

interface TokenAttributes {
  account: string;
  collectionId: string;
}

function TokenAttributes ({ account, collectionId }: TokenAttributes): ReactElement {
  const { getCollectionOnChainSchema, getDetailedCollectionInfo, saveConstOnChainSchema } = useCollection();
  const [collectionInfo, setCollectionInfo] = useState<NftCollectionInterface>();
  const [attributes, setAttributes] = useState<AttributeItemType[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const isOwner = collectionInfo?.Owner === account;

  console.log('attributes', attributes, 'collectionId', collectionId);

  const onAddItem = useCallback(() => {
    /*
      queueAction({
        action: 'action',
        message: 'You already have attribute with same name!',
        status: 'error'
      });
     */
    const newAttributes = [...attributes];

    newAttributes.push({
      fieldType: 'string',
      id: attributes.length,
      name: `attribute${attributes.length + 1}`,
      rule: 'required',
      values: []
    });

    setAttributes(newAttributes);
  }, [attributes]);

  const onSuccess = useCallback(() => {
    console.log('onSuccess');
  }, []);

  const deleteAttribute = useCallback((index) => {
    setAttributes([
      ...attributes.filter((attribute: AttributeItemType) => attribute.id !== index)
    ]);
  }, [attributes]);

  const fetchCollectionInfo = useCallback(async () => {
    const info: NftCollectionInterface | null = await getDetailedCollectionInfo(collectionId);

    if (info) {
      setCollectionInfo(info);
    }
  }, [collectionId, getDetailedCollectionInfo]);

  const onSaveAll = useCallback(() => {
    try {
      const protobufJson: ProtobufAttributeType = fillProtobufJson(attributes);

      if (account && collectionId) {
        saveConstOnChainSchema({ account, collectionId, schema: JSON.stringify(protobufJson), successCallback: onSuccess });
      }
    } catch (e) {
      console.log('save onChain schema error', e);
    }
  }, [account, attributes, collectionId, onSuccess, saveConstOnChainSchema]);

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
    if (collectionInfo?.ConstOnChainSchema) {
      const onChainSchema = getCollectionOnChainSchema(collectionInfo);

      if (onChainSchema) {
        const { constSchema } = onChainSchema;

        if (constSchema) {
          setAttributes(fillAttributes(constSchema));
        }
      }
    } else {
      setAttributes([]);
    }
  }, [collectionInfo, getCollectionOnChainSchema]);

  useEffect(() => {
    void fetchCollectionInfo();
  }, [fetchCollectionInfo]);

  useEffect(() => {
    fillCollectionAttributes();
  }, [fillCollectionAttributes]);

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
      { !isOwner && attributes.map((attribute: AttributeItemType, index) => (
        <AttributesRow
          attributeCountType={attribute.rule}
          attributeName={attribute.name}
          attributeType={attribute.fieldType}
          attributeValues={attribute.values}
          isOwner={isOwner}
          key={`${attribute.name}-${index}`}
        />
      ))}
      { isOwner && attributes.map((attribute: AttributeItemType, index) => (
        <AttributesRowEditable
          attributeCountType={attribute.rule}
          attributeName={attribute.name}
          attributeNameError={undefined}
          attributeType={attribute.fieldType}
          attributeValues={attribute.values}
          index={index}
          isOwner={isOwner}
          key={`${attribute.name}-${index}`}
          removeItem={deleteAttribute}
          setAttributeCountType={setAttributeCountType}
          setAttributeName={setAttributeName}
          setAttributeType={setAttributeType}
          setAttributeValues={setAttributeValues}
        />
      ))}
      <div
        className='add-field'
        onClick={onAddItem}
      >
        Add field
        <img
          alt='plus'
          src={plusIcon as string}
        />
      </div>
      <WarningText />
      <div className='attributes-button'>
        <Button
          disable={formErrors?.length > 0}
          onClick={onSaveAll}
          text='Confirm'
        />
      </div>
    </div>
  );
}

export default memo(TokenAttributes);
