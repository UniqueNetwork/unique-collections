// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, SyntheticEvent, useCallback, useState } from 'react';

import clearIcon from '@polkadot/app-builder/images/closeIcon.svg';
import { UnqButton } from '@polkadot/react-components';
import { fillAttributes } from '@polkadot/react-components/util/protobufUtils';
import { useCollection, useImageService } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import uploadIcon from '../../images/uploadIcon.svg';
import WarningText from '../WarningText';

interface CoverProps {
  account: string;
  collectionId: string;
}

function Cover ({ collectionId }: CoverProps): React.ReactElement {
  const { getCollectionOnChainSchema, getDetailedCollectionInfo, saveConstOnChainSchema } = useCollection();
  const [collectionInfo, setCollectionInfo] = useState<NftCollectionInterface>();
  const [avatarImg, setAvatarImg] = useState<File | null>(null);
  const [imgAddress, setImgAddress] = useState<string>();
  const { uploadCollectionImg } = useImageService();

  const uploadAvatar = useCallback((event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    setAvatarImg(file);
  }, []);

  const clearTokenImg = useCallback(() => {
    setAvatarImg(null);
  }, []);

  console.log('imgAddress', imgAddress);

  const handleConfirm = useCallback(async () => {
    const address = await uploadCollectionImg(avatarImg);

    setImgAddress(address);
  }, [avatarImg, uploadCollectionImg]);

  const fillCollectionCover = useCallback(() => {
    if (collectionInfo?.ConstOnChainSchema) {
      const onChainSchema = getCollectionOnChainSchema(collectionInfo);

      if (onChainSchema) {
        const { variableSchema } = onChainSchema;

        console.log('variableSchema', variableSchema);

        if (variableSchema) {

        }
      }
    } else {
    }
  }, [collectionInfo, getCollectionOnChainSchema]);

  const fetchCollectionInfo = useCallback(async () => {
    const info: NftCollectionInterface | null = await getDetailedCollectionInfo(collectionId);

    if (info) {
      setCollectionInfo(info);
    }
  }, [collectionId, getDetailedCollectionInfo]);

  return (
    <div className='cover'>
      <h1 className='header-text'>Cover</h1>
      <div className='info-block'>
        <h2>Upload image</h2>
        <p>Choose JPG, PNG, GIF (max 10 Mb)</p>
        <div className='upload-block'>
          <input
            accept='image/*'
            id='avatar-file-input'
            onChange={uploadAvatar}
            style={{ display: 'none' }}
            type='file'
          />
          <label
            className='upload-img'
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
      </div>
      <WarningText />
      <UnqButton
        content='Confirm'
        isDisabled
        isFilled
        onClick={handleConfirm}
        size='medium'
      />
    </div>
  );
}

export default memo(Cover);
