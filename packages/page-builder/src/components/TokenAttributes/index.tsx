// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { AttributeItemType, ProtobufAttributeType } from '@polkadot/react-components/util/protobufUtils';

import _maxBy from 'lodash/maxBy';
import React, { memo, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';

import { CollectionFormContext, defaultAttributesWithTokenIpfs } from '@polkadot/app-builder/CollectionFormContext';
import { useCollectionFees } from '@polkadot/app-builder/hooks';
import TransactionContext from '@polkadot/app-builder/TransactionContext/TransactionContext';
import { Checkbox, HelpTooltip, Input, UnqButton } from '@polkadot/react-components';
import { fillAttributes, fillProtobufJson } from '@polkadot/react-components/util/protobufUtils';
import { useCollection, useIsMountedRef } from '@polkadot/react-hooks';
import { CreateCollectionEx, NftCollectionInterface } from '@polkadot/react-hooks/useCollection';
import { str2vec } from '@polkadot/react-hooks/utils';

import expanderIcon from '../../images/expanderIcon.svg';
import plusIcon from '../../images/plusIcon.svg';
import AttributesRowEditable, { ArtificialAttributeItemType, ArtificialFieldRuleType, ArtificialFieldType } from '../TokenAttributes/AttributesRowEditable';
import WarningText from '../WarningText';
import AttributesRow from './AttributesRow';

interface TokenAttributes {
  account: string;
  collectionId?: string;
  collectionInfo?: NftCollectionInterface;
}

const stepTexts = [
  'Setting collection traits',
  'Setting image location'
];

const creatingCollectionText = 'Creating collection';
const maxTokenLimit = 4294967295;

function TokenAttributes ({ account, collectionId, collectionInfo }: TokenAttributes): ReactElement {
  const { createCollectionEx, getCollectionOnChainSchema, saveConstOnChainSchema, setSchemaVersion } = useCollection();
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<number[]>([]);
  const [emptyEnums, setEmptyEnums] = useState<number[]>([]);
  const [opened, setOpened] = useState(false);
  const history = useHistory();
  const { calculateFee, calculateFeeEx, fees } = useCollectionFees(account, collectionId);
  const isOwner = collectionInfo?.owner === account;
  const canSaveAttributes = isOwner || !collectionId;
  const { setTransactions } = useContext(TransactionContext);
  const { attributes, description, imgAddress, name, ownerCanDestroy, ownerCanTransfer, setAttributes, setOwnerCanDestroy, setTokenLimit, tokenLimit, tokenPrefix } = useContext(CollectionFormContext);
  const mountedRef = useIsMountedRef();

  const onAddItem = useCallback(() => {
    const newAttributes = [...attributes];
    const findNextId = (_maxBy(newAttributes, 'id') as AttributeItemType)?.id ?? 0;

    newAttributes.push({
      fieldType: 'string',
      id: findNextId + 1,
      name: `attribute${findNextId}`,
      rule: 'required',
      values: []
    });

    mountedRef.current && setAttributes(newAttributes);
  }, [attributes, mountedRef, setAttributes]);

  const closeSaveConfirmation = useCallback(() => {
    setIsSaveConfirmationOpen(false);
  }, []);

  const onSuccess = useCallback(() => {
    if (collectionId) {
      const transactions = [
        {
          state: 'finished',
          text: stepTexts[0]
        }
      ];

      if (collectionInfo?.schemaVersion !== 'Unique') {
        transactions.push({
          state: 'finished',
          text: stepTexts[1]
        });
      }

      mountedRef.current && setTransactions(transactions);
    } else {
      mountedRef.current && setTransactions([
        {
          state: 'finished',
          text: creatingCollectionText
        }
      ]);
    }

    setTimeout(() => {
      mountedRef.current && setTransactions([]);

      history.push('/builder');
    }, 3000);
  }, [collectionId, history, collectionInfo?.schemaVersion, mountedRef, setTransactions]);

  const setUniqueSchemaVersion = useCallback(() => {
    if (collectionInfo?.schemaVersion === 'Unique') {
      onSuccess();
    } else {
      if (collectionId) {
        mountedRef.current && setTransactions([
          {
            state: 'finished',
            text: stepTexts[0]
          },
          {
            state: 'active',
            text: stepTexts[1]
          }
        ]);

        mountedRef.current && setSchemaVersion({
          account,
          collectionId,
          errorCallback: setTransactions.bind(null, []),
          schemaVersion: 'Unique',
          successCallback: onSuccess
        });
      }
    }
  }, [account, collectionId, collectionInfo?.schemaVersion, mountedRef, onSuccess, setSchemaVersion, setTransactions]);

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

  const onSaveForm = useCallback(() => {
    setIsSaveConfirmationOpen(false);

    try {
      const converted: AttributeItemType[] = convertArtificialAttributesToProtobuf(attributes);
      const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);

      if (account) {
        if (collectionId) {
          const transactions = [
            {
              state: 'active',
              text: stepTexts[0]
            }
          ];

          if (collectionInfo?.schemaVersion !== 'Unique') {
            transactions.push({
              state: 'not-active',
              text: stepTexts[1]
            });
          }

          setTransactions(transactions);

          saveConstOnChainSchema({
            account,
            collectionId,
            errorCallback: setTransactions.bind(null, []),
            schema: JSON.stringify(protobufJson),
            successCallback: setUniqueSchemaVersion
          });
        } else {
          setTransactions([
            {
              state: 'active',
              text: creatingCollectionText
            }
          ]);

          const collectionData: CreateCollectionEx = {
            account,
            constOnChainSchema: JSON.stringify(protobufJson),
            description: str2vec(description),
            limits: {
              ownerCanDestroy,
              ownerCanTransfer,
              tokenLimit
            },
            mode: { nft: null },
            name: str2vec(name),
            schemaVersion: 'Unique',
            tokenPrefix: str2vec(tokenPrefix),
            variableOnChainSchema: JSON.stringify({
              collectionCover: imgAddress
            })
          };

          createCollectionEx({
            ...collectionData
          }, {
            onFailed: (result) => {
              console.log('Collection creation failed', result);

              setTransactions([]);
            },
            onSuccess
          });
        }
      }
    } catch (e) {
      console.log('save onChain schema error', e);
    }
  }, [convertArtificialAttributesToProtobuf, attributes, account, collectionId, collectionInfo?.schemaVersion, setTransactions, saveConstOnChainSchema, setUniqueSchemaVersion, description, ownerCanDestroy, ownerCanTransfer, tokenLimit, name, tokenPrefix, imgAddress, createCollectionEx, onSuccess]);

  const deleteAttribute = useCallback((id: number) => {
    setAttributes(attributes.filter((attribute: ArtificialAttributeItemType) => attribute.id !== id));
  }, [attributes, setAttributes]);

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
  }, [setAttributes]);

  const setAttributeName = useCallback((name: string, id: number) => {
    setAttributes((prevAttributes: ArtificialAttributeItemType[]) => prevAttributes.map((item) => item.id === id ? { ...item, name } : item));
  }, [setAttributes]);

  const setAttributeType = useCallback((type: ArtificialFieldType, id: number) => {
    setAttributes((prevAttributes: ArtificialAttributeItemType[]) => prevAttributes.map((item) => item.id === id ? { ...item, fieldType: type } : item));
  }, [setAttributes]);

  const setAttributeValues = useCallback((values: string[], id: number) => {
    setAttributes((prevAttributes: ArtificialAttributeItemType[]) => prevAttributes.map((item) => item.id === id ? { ...item, values: values } : item));
  }, [setAttributes]);

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
    } else {
      setAttributes([...defaultAttributesWithTokenIpfs]);
    }
  }, [collectionInfo, convertProtobufToArtificialAttributes, getCollectionOnChainSchema, setAttributes]);

  const toggleAdvanced = useCallback(() => {
    mountedRef.current && setOpened((prevOpen) => !prevOpen);
  }, [mountedRef]);

  const onLimitChange = useCallback((value: string) => {
    const numVal = Number(value);

    if (numVal > maxTokenLimit) {
      return;
    }

    setTokenLimit(numVal.toString());
  }, [setTokenLimit]);

  useEffect(() => {
    fillCollectionAttributes();
  }, [fillCollectionAttributes]);

  useEffect(() => {
    if (collectionId) {
      void calculateFee();
    } else {
      void calculateFeeEx();
    }
  }, [calculateFee, calculateFeeEx, collectionId]);

  // if we have no collection name filled, lets fill in in
  useEffect(() => {
    if (!collectionId && !name) {
      history.push('/builder/new-collection/main-information');
    }
  });

  return (
    <div className='token-attributes shadow-block'>
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
      { !canSaveAttributes && attributes.map((attribute: ArtificialAttributeItemType, index: number) => {
        if (attribute.name !== 'ipfsJson') {
          return (
            <AttributesRow
              attributeCountType={attribute.rule}
              attributeName={attribute.name}
              attributeType={attribute.fieldType}
              attributeValues={attribute.values}
              key={`${attribute.name}-${index}`}
            />
          );
        } else {
          return null;
        }
      })}
      { canSaveAttributes && attributes.map((attribute: ArtificialAttributeItemType) => {
        if (attribute.name !== 'ipfsJson') {
          return (
            <AttributesRowEditable
              attributeCountType={attribute.rule}
              attributeName={attribute.name}
              attributeType={attribute.fieldType}
              attributeValues={attribute.values}
              attributes={attributes}
              canSaveAttributes={canSaveAttributes}
              formErrors={formErrors}
              id={attribute.id}
              key={`${attribute.id}`}
              removeItem={deleteAttribute}
              setAttributeCountType={setAttributeCountType}
              setAttributeName={setAttributeName}
              setAttributeType={setAttributeType}
              setAttributeValues={setAttributeValues}
              setEmptyEnums={setEmptyEnums}
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

      { !collectionId && (
        <div className='custom-expander'>
          <div
            className='custom-expander--header'
            onClick={toggleAdvanced}
          >
            <span>Advanced settings</span>
            <img
              alt='expander'
              className={opened ? 'expanded' : ''}
              src={expanderIcon as string}
            >
            </img>
          </div>
          { opened && (
            <div className='custom-expander--inner'>
              <span>This functionality allows you to customize the token. You can define your NFT's traits in the fields below. For example, name, accessory, gender, background, face, body, tier etc.</span>
              <form>
                <div className='form-item'>
                  <div className='form-item--with-tooltip'>
                    <Checkbox
                      label='Owner can destroy collection'
                      onChange={setOwnerCanDestroy}
                      value={ownerCanDestroy}
                    />
                    <HelpTooltip
                      className={'help'}
                      content={
                        <span>
                    Should you decide to keep the right to destroy the collection, a marketplace could reject it depending on its policies as it gives the author the power to arbitrarily destroy a collection at any moment in the future
                        </span>
                      }
                    />
                  </div>
                </div>
                <div className='form-item'>
                  <div className='form-item--with-tooltip'>
                    Token limit
                    <HelpTooltip
                      className={'help'}
                      content={
                        <span>
                    The token limit (collection size) is a mandatory parameter if you want to list your collection on a marketplace.
                        </span>
                      }
                    />
                  </div>
                  <Input
                    className='isSmall'
                    max={maxTokenLimit}
                    min={1}
                    onChange={onLimitChange}
                    placeholder='Token limit'
                    type='number'
                    value={tokenLimit}
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      )}

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
          isDisabled={formErrors?.length > 0 || emptyEnums?.length > 0 || tokenLimit === '0'}
          isFilled
          onClick={onSaveAll}
          size='medium'
        />
      </div>
    </div>
  );
}

export default memo(TokenAttributes);
