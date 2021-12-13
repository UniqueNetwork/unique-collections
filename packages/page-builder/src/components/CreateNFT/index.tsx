// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { TokenAttribute } from '../../types';

import BN from 'bn.js';
import React, { memo, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import { Checkbox, UnqButton } from '@polkadot/react-components';
import { AttributeItemType, ProtobufAttributeType, serializeNft } from '@polkadot/react-components/util/protobufUtils';
import { useImageService, useToken } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import clearIcon from '../../images/closeIcon.svg';
import uploadIcon from '../../images/uploadIcon.svg';
import WarningText from '../WarningText';
import TokenAttributesRowEditable from './TokenAttributesRowEditable';

interface CreateNFTProps {
  account: string;
  isOwner: boolean;
  collectionId: string;
  collectionInfo: NftCollectionInterface;
  constAttributes: AttributeItemType[];
  constOnChainSchema: ProtobufAttributeType | undefined;
  resetAttributes: () => void;
  setTokenConstAttributes: (attr: (prevAttributes: { [p: string]: TokenAttribute }) => { [p: string]: TokenAttribute }) => void | ((prevAttributes: { [p: string]: TokenAttribute }) => { [p: string]: TokenAttribute });
  setTokenImg: (image: File | null) => void;
  tokenConstAttributes: { [key: string]: TokenAttribute };
  tokenImg: File | null;
}

function CreateNFT ({ account, collectionId, collectionInfo, constAttributes, constOnChainSchema, isOwner, resetAttributes, setTokenConstAttributes, setTokenImg, tokenConstAttributes, tokenImg }: CreateNFTProps): React.ReactElement {
  const { calculateCreateItemFee, createNft } = useToken();
  const [createFees, setCreateFees] = useState<BN | null>(null);
  const history = useHistory();
  const { uploadImg } = useImageService();

  console.log('createFees', createFees?.toString());

  const [tokenImageAddress, setTokenImageAddress] = useState<string>();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [createAnother, setCreateAnother] = useState<boolean>(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const onLoadTokenImage = useCallback((event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    setTokenImg(file);
  }, [setTokenImg]);

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
  }, [resetAttributes, setTokenImg]);

  const clearTokenImg = useCallback(() => {
    setTokenImg(null);

    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  }, [setTokenImg]);

  const setAttributeValue = useCallback((attribute: AttributeItemType, value: string | number[]) => {
    setTokenConstAttributes((prevAttributes: { [key: string]: TokenAttribute }) => ({ ...prevAttributes,
      [attribute.name]: {
        name: prevAttributes[attribute.name].name,
        value: attribute.rule === 'repeated' ? prevAttributes[attribute.name].value : value as string,
        values: attribute.rule === 'repeated' ? value as number[] : prevAttributes[attribute.name].values
      } } as { [key: string]: TokenAttribute }));
  }, [setTokenConstAttributes]);

  const onCreateSuccess = useCallback(() => {
    if (createAnother) {
      resetData();
    } else {
      history.push('/builder');
    }
  }, [createAnother, history, resetData]);

  const buildAttributes = useCallback(() => {
    if (account) {
      const constAttributes: { [key: string]: string | number | number[] } = {};

      let constData = '';

      if (constOnChainSchema) {
        Object.keys(tokenConstAttributes).forEach((key: string) => {
          constAttributes[tokenConstAttributes[key].name] = tokenConstAttributes[key].values?.length ? (tokenConstAttributes[key].values as number[]) : (tokenConstAttributes[key].value as string);
        });
        const cData = serializeNft(constOnChainSchema, constAttributes);

        constData = '0x' + Buffer.from(cData).toString('hex');

        return constData;
      }
    }

    return '';
  }, [account, constOnChainSchema, tokenConstAttributes]);

  const calculateFee = useCallback(async () => {
    if (account) {
      const constData = buildAttributes();

      const fees = await calculateCreateItemFee({ account, collectionId, constData, owner: account, variableData: '' });

      setCreateFees(fees);
    }
  }, [account, buildAttributes, calculateCreateItemFee, collectionId]);

  const onCreateNft = useCallback(() => {
    if (account) {
      const constData = buildAttributes();

      createNft({ account, collectionId, constData, owner: account, successCallback: onCreateSuccess, variableData: '' });
    }
  }, [account, buildAttributes, createNft, collectionId, onCreateSuccess]);

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
    void calculateFee();
  }, [calculateFee]);

  if (collectionInfo && !isOwner) {
    return (
      <div className='create-nft'>
        <h2 className='header-text'>You are not the owner of this collection, you cannot create nft.</h2>
      </div>
    );
  }

  const checkAttributes = useMemo(() => constAttributes.filter((elem: {name: string}) => elem.name !== 'ipfsJson'), [constAttributes]);

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
          ref={inputFileRef}
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
      {!!checkAttributes.length &&
        (
          <form className='attributes'>
            <h1 className='header-text'>Attributes</h1>
            { Object.keys(tokenConstAttributes).length > 0 && checkAttributes.map((collectionAttribute: AttributeItemType, index) => (
              <TokenAttributesRowEditable
                collectionAttribute={collectionAttribute}
                key={`${collectionAttribute.name}-${index}`}
                setAttributeValue={setAttributeValue}
                tokenConstAttributes={tokenConstAttributes}
              />
            )
            )}
          </form>
        )}
      { createFees && (
        <WarningText fee={createFees} />
      )}
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
