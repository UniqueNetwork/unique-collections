// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { TokenAttribute } from '../../types';

import React, { memo, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Checkbox, UnqButton } from '@polkadot/react-components';
import { AttributeItemType, serializeNft } from '@polkadot/react-components/util/protobufUtils';
import { useImageService, useToken, useTokenAttributes } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

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
  const { createNft } = useToken();
  const history = useHistory();
  const { uploadImg } = useImageService();
  const [tokenImg, setTokenImg] = useState<File | null>(null);
  const [tokenImageAddress, setTokenImageAddress] = useState<string>();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [createAnother, setCreateAnother] = useState<boolean>(false);
  const { constAttributes, constOnChainSchema, resetAttributes, setTokenConstAttributes, tokenConstAttributes } = useTokenAttributes(collectionInfo);

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

  const resetData = useCallback(() => {
    resetAttributes();
    setTokenImg(null);
    setFormErrors([]);
    setCreateAnother(false);
  }, [resetAttributes]);

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
  }, [setTokenConstAttributes]);

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
