// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { useState } from 'react';

import clearIcon from '../../images/closeIcon.svg';
import uploadIcon from '../../images/uploadIcon.svg';
import Button from '../Button';
import WarningText from '../WarningText';

function CreateNFT (): React.ReactElement {
  const [avatarImg, setAvatarImg] = useState(null);

  const uploadAvatar = (e: any) => {
    console.log('upload');
    setAvatarImg(e.target.files[0]);
  };

  const clearTokenImg = () => {
    console.log('aaaaaaaa');
    setAvatarImg(null);
  };

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
          <img
            alt='clear'
            src={ clearIcon as string }
          />
        </div>
      </div>
      <h1 className='header-text'>Attributes</h1>
      <div className='attributes'>
        <div className='attributes-input'>
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
        </div>
      </div>

      <WarningText />
      <Button
        disable={true}
        onClick={() => console.log('Click on confirm')}
        text='Confirm'
      />
    </div>
  );
}

export default CreateNFT;
