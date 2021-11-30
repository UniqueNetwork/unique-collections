// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import clearIcon from '@polkadot/app-builder/images/closeIcon.svg';
import { UnqButton } from '@polkadot/react-components';
import { useCollection, useImageService } from '@polkadot/react-hooks';

import uploadIcon from '../../images/uploadIcon.svg';
import WarningText from '../WarningText';

interface CoverProps {
  account: string;
  avatarImg: File | null;
  collectionId: string;
  setAvatarImg: (avatarImg: File | null) => void;
}

function Cover ({ account, avatarImg, collectionId, setAvatarImg }: CoverProps): React.ReactElement {
  const { saveVariableOnChainSchema } = useCollection();
  const [imgAddress, setImgAddress] = useState<string>();
  const { uploadImg } = useImageService();
  const history = useHistory();
  const inputFileRef = useRef<HTMLInputElement>(null);

  // saveConstOnChainSchema({ account, collectionId, schema: JSON.stringify(protobufJson), successCallback: onSuccess });

  const uploadAvatar = useCallback((event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    setAvatarImg(file);
  }, [setAvatarImg]);

  const clearTokenImg = useCallback(() => {
    setAvatarImg(null);

    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  }, [setAvatarImg]);

  const uploadImage = useCallback(async () => {
    if (avatarImg) {
      const address = await uploadImg(avatarImg);

      setImgAddress(address);
    }
  }, [avatarImg, uploadImg]);

  const onSuccess = useCallback(() => {
    history.push(`/builder/collections/${collectionId}/token-attributes`);
  }, [collectionId, history]);

  const saveVariableSchema = useCallback(() => {
    if (!imgAddress) {
      onSuccess();
    } else if (account && collectionId && imgAddress) {
      const varDataWithImage = {
        collectionCover: imgAddress
      };

      saveVariableOnChainSchema({ account, collectionId, schema: JSON.stringify(varDataWithImage), successCallback: onSuccess });
    }
  }, [account, collectionId, imgAddress, onSuccess, saveVariableOnChainSchema]);

  useEffect(() => {
    void uploadImage();
  }, [uploadImage]);

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
            ref={inputFileRef}
            style={{ display: 'none' }}
            type='file'
          />
          <label
            className='upload-img'
            htmlFor='avatar-file-input'
          >
            {avatarImg
              ? (
                <img
                  alt='token-img'
                  className='token-img'
                  src={URL.createObjectURL(avatarImg)}
                />
              )
              : (
                <img
                  alt='upload-icon'
                  src={uploadIcon as string}
                />
              )}
          </label>
          <div
            className='clear-btn'
            onClick={clearTokenImg}
          >
            { avatarImg && (
              <img
                alt='clear'
                src={clearIcon as string}
              />
            )}
          </div>
        </div>
      </div>
      <WarningText />
      <UnqButton
        content='Confirm'
        isFilled
        onClick={saveVariableSchema}
        size='medium'
      />
    </div>
  );
}

export default memo(Cover);
