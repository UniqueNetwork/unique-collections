// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, SyntheticEvent, useCallback, useState } from 'react';

import clearIcon from '@polkadot/app-builder/images/closeIcon.svg';
import { useImageService } from '@polkadot/react-hooks';

import uploadIcon from '../../images/uploadIcon.svg';
import Button from '../Button';
import WarningText from '../WarningText';

function Cover (): React.ReactElement {
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
      <Button
        disable={false}
        onClick={handleConfirm}
        text='Confirm'
      />
    </div>
  );
}

export default memo(Cover);
