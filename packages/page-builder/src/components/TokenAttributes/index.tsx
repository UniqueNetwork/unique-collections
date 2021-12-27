// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { AttributeItemType, ProtobufAttributeType } from '@polkadot/react-components/util/protobufUtils';

import BN from 'bn.js';
import React, { memo, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';

import TransactionContext from '@polkadot/app-builder/TransactionContext/TransactionContext';
import { HelpTooltip, StatusContext, UnqButton } from '@polkadot/react-components';
import { fillAttributes, fillProtobufJson } from '@polkadot/react-components/util/protobufUtils';
import { useCollection } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import plusIcon from '../../images/plusIcon.svg';
import AttributesRowEditable, { ArtificialAttributeItemType, ArtificialFieldRuleType, ArtificialFieldType } from '../TokenAttributes/AttributesRowEditable';
import WarningText from '../WarningText';
import AttributesRow from './AttributesRow';

interface TokenAttributes {
  account: string;
  collectionId: string;
  collectionInfo?: NftCollectionInterface;
}

const defaultAttributesWithTokenIpfs: ArtificialAttributeItemType[] = [
  {
    fieldType: 'string',
    id: 0,
    name: 'ipfsJson',
    rule: 'required',
    values: []
  }
];

function TokenAttributes ({ account, collectionId, collectionInfo }: TokenAttributes): ReactElement {
  const { calculateSetConstOnChainSchemaFees, getCollectionOnChainSchema, saveConstOnChainSchema, setSchemaVersion } = useCollection();
  const [attributes, setAttributes] = useState<ArtificialAttributeItemType[]>([]);
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<number[]>([]);
  const [fees, setFees] = useState<BN | null>(null);
  const history = useHistory();
  const { queueAction } = useContext(StatusContext);
  const isOwner = collectionInfo?.owner === account;
  const schemaVersion = collectionInfo?.schemaVersion;
  const { setTransactions } = useContext(TransactionContext);

  console.log('schemaVersion', schemaVersion);

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
    setTransactions([
      {
        state: 'finished',
        step: 1,
        text: 'Setting token attributes'
      },
      {
        state: 'finished',
        step: 2,
        text: 'Setting token image location'
      }
    ]);
    setTimeout(() => {
      setTransactions([]);
    }, 3000);

    queueAction({
      action: '',
      message: 'Collection successfully created',
      status: 'success'
    });
    history.push('/builder');
  }, [setTransactions, queueAction, history]);

  const setUniqueSchemaVersion = useCallback(() => {
    if (collectionInfo?.schemaVersion === 'Unique') {
      onSuccess();
    } else {
      setTransactions([
        {
          state: 'finished',
          step: 1,
          text: 'Setting token attributes'
        },
        {
          state: 'active',
          step: 2,
          text: 'Setting token image location'
        }
      ]);
      setSchemaVersion({
        account,
        collectionId,
        errorCallback: setTransactions.bind(null, []),
        schemaVersion: 'Unique',
        successCallback: onSuccess
      });
    }
  }, [account, collectionId, collectionInfo?.schemaVersion, onSuccess, setSchemaVersion, setTransactions]);

  const convertArtificialAttributesToProtobuf = useCallback((attributes: ArtificialAttributeItemType[]): AttributeItemType[] => {
    return attributes.map((attr: ArtificialAttributeItemType): AttributeItemType => {
      if (attr.fieldType === 'repeated') {
        return { ...attr, fieldType: 'enum', rule: 'repeated' };
      }

      return { ...attr } as AttributeItemType;
    });
  }, []);

  const convertProtobufToArtificialAttributes = useCallback((attributes: AttributeItemType[]): ArtificialAttributeItemType[] => {
    return attributes.map((attr: AttributeItemType): ArtificialAttributeItemType => {
      /*
      type: 'string' | 'enum' -> 'string' | 'enum' | 'repeated';
      rule: 'optional' | 'required' | 'repeated' -> 'optional' | 'required';
       */
      if (attr.rule === 'repeated') {
        return { ...attr, fieldType: 'repeated', rule: 'optional' };
      }

      return attr as ArtificialAttributeItemType;
    });
  }, []);

  const calculateFees = useCallback(async () => {
    try {
      const converted: AttributeItemType[] = convertArtificialAttributesToProtobuf(attributes);
      const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);

      if (account && collectionId) {
        const fees = await calculateSetConstOnChainSchemaFees({ account, collectionId, schema: JSON.stringify(protobufJson) });

        setFees(fees);
      }
    } catch (e) {
      console.log('save onChain schema error', e);
    }
  }, [account, attributes, calculateSetConstOnChainSchemaFees, collectionId, convertArtificialAttributesToProtobuf]);

  const onSaveForm = useCallback(() => {
    try {
      const converted: AttributeItemType[] = convertArtificialAttributesToProtobuf(attributes);
      const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);

      setTransactions([
        {
          state: 'active',
          step: 1,
          text: 'Setting token attributes'
        },
        {
          state: 'not-active',
          step: 2,
          text: 'Setting token image location'
        }
      ]);

      if (account && collectionId) {
        saveConstOnChainSchema({
          account,
          collectionId,
          errorCallback: setTransactions.bind(null, []),
          schema: JSON.stringify(protobufJson),
          successCallback: setUniqueSchemaVersion
        });
      }
    } catch (e) {
      console.log('save onChain schema error', e);
    }
  }, [convertArtificialAttributesToProtobuf, attributes, setTransactions, account, collectionId, saveConstOnChainSchema, setUniqueSchemaVersion]);

  const deleteAttribute = useCallback((index) => {
    setAttributes(attributes.filter((attribute: ArtificialAttributeItemType) => attribute.id !== index));
  }, [attributes]);

  const onSaveAll = useCallback(() => {
    // user didn't fill attributes, we have only default ipfsJson attribute
    if (attributes.length === 1) {
      setIsSaveConfirmationOpen(true);
    } else {
      onSaveForm();
    }
  }, [attributes, onSaveForm]);

  const setAttributeCountType = useCallback((countType: ArtificialFieldRuleType, id: number) => {
    setAttributes((prevAttributes: ArtificialAttributeItemType[]) => prevAttributes.map((item) => item.id === id ? { ...item, rule: countType } : item));
  }, []);

  const setAttributeName = useCallback((name: string, index: number) => {
    setAttributes((prevAttributes: ArtificialAttributeItemType[]) => {
      const newAttributes = [...prevAttributes];

      newAttributes[index].name = name;

      return newAttributes;
    });
  }, []);

  const setAttributeType = useCallback((type: ArtificialFieldType, id: number) => {
    setAttributes((prevAttributes: ArtificialAttributeItemType[]) => prevAttributes.map((item) => item.id === id ? { ...item, fieldType: type } : item));
  }, []);

  const setAttributeValues = useCallback((values: string[], id: number) => {
    setAttributes((prevAttributes: ArtificialAttributeItemType[]) => prevAttributes.map((item) => item.id === id ? { ...item, values: values } : item));
  }, []);

  const fillCollectionAttributes = useCallback(() => {
    if (collectionInfo?.constOnChainSchema) {
      const onChainSchema = getCollectionOnChainSchema(collectionInfo);
      let previousAttributes: AttributeItemType[] = [];
      let converted: ArtificialAttributeItemType[] = [];

      if (onChainSchema) {
        const { constSchema } = onChainSchema;

        if (constSchema) {
          previousAttributes = fillAttributes(constSchema);
        }
      }

      if (previousAttributes.find((attr) => attr.name === 'ipfsJson')) {
        converted = convertProtobufToArtificialAttributes(previousAttributes);
        setAttributes(converted);
      } else {
        setAttributes([...converted, ...defaultAttributesWithTokenIpfs]);
      }
    }
  }, [collectionInfo, convertProtobufToArtificialAttributes, getCollectionOnChainSchema]);

  useEffect(() => {
    fillCollectionAttributes();
  }, [fillCollectionAttributes]);

  useEffect(() => {
    void calculateFees();
  }, [calculateFees]);

  return (
    <div className='token-attributes '>
      <div className='token-attributes-header'>
        <p className='header-title'>Token attributes</p>
        <p className='header-text'>This functionality allows you to customize the token. You can set any traits that will help you create unique NFT: name, accessory, gender, background, face, body, tier etc.</p>
      </div>
      <div className='attributes-title'>
        <div className='row-title'>
          <p>Attribute</p>
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
      { !isOwner && attributes.map((attribute: ArtificialAttributeItemType, index: number) => {
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
      { isOwner && attributes.map((attribute: ArtificialAttributeItemType, index: number) => {
        if (attribute.name !== 'ipfsJson') {
          return (
            <AttributesRowEditable
              attributeCountType={attribute.rule}
              attributeName={attribute.name}
              attributeType={attribute.fieldType}
              attributeValues={attribute.values}
              attributes={attributes}
              formErrors={formErrors}
              id={attribute.id}
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
          content='You cannot return to editing the attributes in this product version.'
          header='You have not entered attributes. Are you sure that you want to create the collection without them?'
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
