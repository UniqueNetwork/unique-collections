// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Checkbox, UnqButton } from '@polkadot/react-components';
import { TokenAttribute } from '@polkadot/react-components/ManageCollection/ManageTokenAttributes';
import { AttributeItemType, fillAttributes, ProtobufAttributeType, serializeNft } from '@polkadot/react-components/util/protobufUtils';
import {useImageService, useToken} from '@polkadot/react-hooks';
import { NftCollectionInterface, useCollection } from '@polkadot/react-hooks/useCollection';

import clearIcon from '../../images/closeIcon.svg';
import uploadIcon from '../../images/uploadIcon.svg';
import WarningText from '../WarningText';
import TokenAttributesRowEditable from './TokenAttributesRowEditable';

interface CreateNFTProps {
  account: string;
  isOwner: boolean;
  collectionId: string;
  collectionInfo: NftCollectionInterface
}

function CreateNFT ({ account, collectionId, collectionInfo, isOwner }: CreateNFTProps): React.ReactElement {
  const { getCollectionOnChainSchema } = useCollection();
  const { createNft } = useToken();
  const history = useHistory();
  const { uploadImg } = useImageService();
  const [tokenImg, setTokenImg] = useState<File | null>(null);
  const [tokenImageAddress, setTokenImageAddress] = useState<string>();
  const [tokenConstAttributes, setTokenConstAttributes] = useState<{ [key: string]: TokenAttribute }>({});
  const [constAttributes, setConstAttributes] = useState<AttributeItemType[]>([]);
  const [constOnChainSchema, setConstOnChainSchema] = useState<ProtobufAttributeType>();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [createAnother, setCreateAnother] = useState<boolean>(false);

  const onLoadTokenImage = useCallback((event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    setTokenImg(file);
  }, []);

  const uploadTokenImage = useCallback(async () => {
    if (tokenImg) {
      const address: string = await uploadImg(tokenImg);

      setTokenImageAddress(address);
    }
  }, [tokenImg, uploadImg]);

  const presetAttributesFromArray = useCallback((attributes: AttributeItemType[]) => {
    try {
      const tokenAttributes: { [key: string]: TokenAttribute } = {};

      attributes?.forEach((attribute) => {
        tokenAttributes[attribute.name] = {
          name: attribute.name,
          value: '',
          values: []
        };
      });

      setTokenConstAttributes(tokenAttributes);
    } catch (e) {
      console.log('presetAttributesFromArray error', e);
    }
  }, []);

  const resetData = useCallback(() => {
    presetAttributesFromArray(constAttributes);
    setTokenImg(null);
    setFormErrors([]);
    setCreateAnother(false);
  }, [constAttributes, presetAttributesFromArray]);

  const clearTokenImg = useCallback(() => {
    setTokenImg(null);
  }, []);

  const setAttributeValue = useCallback((attribute: AttributeItemType, value: string | number[]) => {
    setTokenConstAttributes((prevAttributes: { [key: string]: TokenAttribute }) =>
      ({ ...prevAttributes,
        [attribute.name]: {
          name: prevAttributes[attribute.name].name,
          value: attribute.rule === 'repeated' ? prevAttributes[attribute.name].value : value as string,
          values: attribute.rule === 'repeated' ? value as number[] : prevAttributes[attribute.name].values
        } }));
  }, []);

  const presetCollectionForm = useCallback(() => {
    if (collectionInfo?.constOnChainSchema) {
      const onChainSchema = getCollectionOnChainSchema(collectionInfo);

      if (onChainSchema) {
        const { constSchema } = onChainSchema;

        if (constSchema) {
          setConstOnChainSchema(constSchema);
          setConstAttributes(fillAttributes(constSchema));
        }
      }
    } else {
      setConstAttributes([]);
    }
  }, [collectionInfo, getCollectionOnChainSchema]);

  const onCreateSuccess = useCallback(() => {
    if (createAnother) {
      resetData();
    } else {
      history.push('/builder');
    }
  }, [createAnother, history, resetData]);

  const onCreateNft = useCallback(() => {
    if (account) {
      const constAttributes: { [key: string]: string | number | number[] } = {};
      let constData = '';

      if (constOnChainSchema) {
        Object.keys(tokenConstAttributes).forEach((key: string) => {
          constAttributes[tokenConstAttributes[key].name] = tokenConstAttributes[key].values?.length ? (tokenConstAttributes[key].values as number[]) : (tokenConstAttributes[key].value as string);
        });
        const cData = serializeNft(constOnChainSchema, constAttributes);

        constData = '0x' + Buffer.from(cData).toString('hex');
      }

      createNft({ account, collectionId, constData, owner: account, successCallback: onCreateSuccess, variableData: '' });
    }
  }, [account, createNft, collectionId, constOnChainSchema, onCreateSuccess, tokenConstAttributes]);

  useEffect(() => {
    if (tokenImageAddress) {
      setAttributeValue({
        fieldType: 'string',
        id: 1,
        name: 'ipfsJson',
        rule: 'required',
        values: []
      }, JSON.stringify({ ipfs: tokenImageAddress, type: 'image' }));
    }
  }, [setAttributeValue, tokenImageAddress]);

  useEffect(() => {
    void uploadTokenImage();
  }, [uploadTokenImage]);

  useEffect(() => {
    if (constAttributes && constAttributes.length) {
      presetAttributesFromArray(constAttributes);
    }
  }, [constAttributes, presetAttributesFromArray]);

  useEffect(() => {
    presetCollectionForm();
  }, [presetCollectionForm]);

  console.log('constAttributes', constAttributes, 'tokenConstAttributes', tokenConstAttributes);

  if (collectionInfo && !isOwner) {
    return (
      <div className='create-nft'>
        <h2 className='header-text'>You are not the owner of this collection, you cannot create nft.</h2>
      </div>
    );
  }

  return (
    <div className='create-nft'>
      <h1 className='header-text'>Image</h1>
      <h2>Upload image*</h2>
      <p>Choose JPG, PNG, GIF (max 10 Mb)</p>
      <div className='avatar'>
        <input
          accept='image/*'
          id='avatar-file-input'
          onChange={onLoadTokenImage}
          style={{ display: 'none' }}
          type='file'
        />
        <label
          className='avatar-img'
          htmlFor='avatar-file-input'
        >
          { tokenImg
            ? (
              <img
                alt='token-img'
                className='token-img'
                src={URL.createObjectURL(tokenImg)}
              />
            )
            : (
              <img
                alt='uploadIcon'
                src={uploadIcon as string}
              />
            )}
        </label>
        <div
          className='clear-btn'
          onClick={clearTokenImg}
        >
          { tokenImg && (
            <img
              alt='clear'
              src={clearIcon as string}
            />
          )}
        </div>
      </div>
      <h1 className='header-text'>Attributes</h1>
      <div className='attributes'>
        { Object.keys(tokenConstAttributes).length > 0 && constAttributes?.map((collectionAttribute: AttributeItemType, index) => {
          if (collectionAttribute.name !== 'ipfsJson') {
            return (
              <TokenAttributesRowEditable
                collectionAttribute={collectionAttribute}
                key={`${collectionAttribute.name}-${index}`}
                setAttributeValue={setAttributeValue}
                tokenConstAttributes={tokenConstAttributes}
              />
            );
          } else {
            return null;
          }
        })}
      </div>

      <WarningText />
      <div className='footer-buttons'>
        <UnqButton
          content='Confirm'
          isDisabled={formErrors.length > 0}
          isFilled
          onClick={onCreateNft}
          size={'medium'}
        />
        <Checkbox
          label='Create another'
          onChange={setCreateAnother}
          value={createAnother}
        />
      </div>
    </div>
  );
}

export default memo(CreateNFT);
