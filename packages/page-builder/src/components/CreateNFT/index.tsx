// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, {memo, useCallback, useEffect, useState} from 'react';

import {Checkbox, Dropdown, Input} from '@polkadot/react-components';

import clearIcon from '../../images/closeIcon.svg';
import uploadIcon from '../../images/uploadIcon.svg';
import Button from '../Button';
import WarningText from '../WarningText';
import {AttributeItemType, fillAttributes} from "@polkadot/react-components/util/protobufUtils";
import {TokenAttribute} from "@polkadot/react-components/ManageCollection/ManageTokenAttributes";
import {NftCollectionInterface, useCollection} from "@polkadot/react-hooks/useCollection";
import TokenAttributesRowEditable from './TokenAttributesRowEditable';

interface CreateNFTProps {
  collectionInfo: NftCollectionInterface
}

function CreateNFT ({ collectionInfo }: CreateNFTProps): React.ReactElement {
  const { getCollectionOnChainSchema } = useCollection();
  const [tokenConstAttributes, setTokenConstAttributes] = useState<{ [key: string]: TokenAttribute }>({});
  const [constAttributes, setConstAttributes] = useState<AttributeItemType[]>([]);
  const [avatarImg, setAvatarImg] = useState(null);

  console.log('constAttributes', constAttributes);

  const uploadAvatar = (e: any) => {
    setAvatarImg(e.target.files[0]);
  };

  const clearTokenImg = () => {
    setAvatarImg(null);
  };

  const setAttributeValue = useCallback((attribute: AttributeItemType, value: string | number[]) => {
    setTokenConstAttributes((prevAttributes: { [key: string]: TokenAttribute }) =>
      ({ ...prevAttributes,
        [attribute.name]: {
          name: prevAttributes[attribute.name].name,
          value: attribute.rule === 'repeated' ? prevAttributes[attribute.name].value : value as string,
          values: attribute.rule === 'repeated' ? value as number[] : prevAttributes[attribute.name].values
        } }));
  }, []);

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

  const presetTokenAttributes = useCallback(() => {
    if (collectionInfo?.ConstOnChainSchema) {
      const onChainSchema = getCollectionOnChainSchema(collectionInfo);

      if (onChainSchema) {
        const { constSchema } = onChainSchema;

        if (constSchema) {
          setConstAttributes(fillAttributes(constSchema));
        }
      }
    } else {
      setConstAttributes([]);
    }
  }, [collectionInfo, getCollectionOnChainSchema]);

  useEffect(() => {
    if (constAttributes && constAttributes.length) {
      presetAttributesFromArray(constAttributes);
    }
  }, [constAttributes, presetAttributesFromArray]);

  useEffect(() => {
    presetTokenAttributes();
  }, [presetTokenAttributes]);

  return (
    <div className='create-nft'>
      <h1 className='header-text'>Image</h1>
      <h2>Upload image*</h2>
      <p>Choose JPG, PNG, GIF (max 10 Mb)</p>
      <div className='avatar'>
        <input
          accept='image/*'
          id='avatar-file-input'
          onChange={uploadAvatar}
          style={{ display: 'none' }}
          type='file'
        />
        <label
          className='avatar-img'
          htmlFor='avatar-file-input'
        >
          {avatarImg
            ? <img
              className='token-img'
              src={URL.createObjectURL(avatarImg)}
            />
            : <img src={uploadIcon as string} />}
        </label>
        <div
          className='clear-btn'
          onClick={clearTokenImg}
        >
          { avatarImg && <img
            alt='clear'
            src={clearIcon as string}
          />}
        </div>
      </div>
      <h1 className='header-text'>Attributes</h1>
      <div className='attributes'>
        { Object.keys(tokenConstAttributes).length > 0 && constAttributes?.map((collectionAttribute: AttributeItemType, index) => (
          <TokenAttributesRowEditable
            collectionAttribute={collectionAttribute}
            key={`${collectionAttribute.name}-${index}`}
            setAttributeValue={setAttributeValue}
            tokenConstAttributes={tokenConstAttributes}
          />
        ))}
        {/* <div className='attributes-input'>
          <h2>Name*</h2>
          <input />
        </div>
        <div className='attributes-input'>
          <h2>Gender</h2>
          <input />
        </div>
        <div className='attributes-input'>
          <h2>Traits</h2>
          <input />
        </div> */}
      </div>

      <WarningText />
      <div className='footer-buttons'>
        <Button
          disable={false}
          onClick={() => console.log('Click on confirm')}
          text='Confirm'
        />
        <Checkbox
          label={<>{'Create another'}</>}
          value={false}
        />
      </div>
    </div>
  );
}

export default memo(CreateNFT);
