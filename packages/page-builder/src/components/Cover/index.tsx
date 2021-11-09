// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { useState } from 'react';

import clearIcon from '@polkadot/app-builder/images/closeIcon.svg';

import uploadIcon from '../../images/uploadIcon.svg';
import Button from '../Button';
import WarningText from '../WarningText';

function Cover (): React.ReactElement {
  const [avatarImg, setAvatarImg] = useState(null);

  const uploadAvatar = (e: any) => {
    setAvatarImg(e.target.files[0]);
  };

  const clearTokenImg = () => {
    setAvatarImg(null);
  };

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
        onClick={() => console.log('Click on confirm')}
        text='Confirm'
      />
    </div>
  );
}

export default Cover;
