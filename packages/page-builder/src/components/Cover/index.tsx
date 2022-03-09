// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import BN from 'bn.js';
import React, { memo, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

import clearIcon from '@polkadot/app-builder/images/closeIcon.svg';
import { UnqButton } from '@polkadot/react-components';
import { useCollection, useImageService } from '@polkadot/react-hooks';

import uploadIcon from '../../images/uploadIcon.svg';
import WarningText from '../WarningText';

interface CoverProps {
  account: string;
  coverImg: File | null;
  collectionId: string;
  setCoverImg: (avatarImg: File | null) => void;
  setVariableSchema: (schema: string) => void;
}

function Cover ({ account, collectionId, coverImg, setCoverImg, setVariableSchema }: CoverProps): React.ReactElement {
  const [imgAddress, setImgAddress] = useState<string>();
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState<boolean>(false);
  const { uploadImg } = useImageService();
  const history = useHistory();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const setCollectionCover = useCallback(() => {
    if (imgAddress) {
      const varDataWithImage = {
        collectionCover: imgAddress
      };

      setVariableSchema(JSON.stringify(varDataWithImage));
    }
  }, [imgAddress, setVariableSchema]);

  const clearTokenImg = useCallback(() => {
    setCoverImg(null);

    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  }, [setCoverImg]);

  const uploadImage = useCallback(async (file: File): Promise<void> => {
    if (file) {
      setImageUploading(true);
      const address = await uploadImg(file);

      if (address) {
        setImgAddress(address);
      } else {
        clearTokenImg();
      }

      setImageUploading(false);
    }
  }, [clearTokenImg, uploadImg]);

  const uploadAvatar = useCallback((event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    setCoverImg(file);
    void uploadImage(file);
  }, [setCoverImg, uploadImage]);

  const closeSaveConfirmation = useCallback(() => {
    setIsSaveConfirmationOpen(false);
  }, []);

  const saveConfirm = useCallback(() => {
    if (!coverImg) {
      setIsSaveConfirmationOpen(true);
    } else {
      history.push('/builder/collections/new-collection/token-attributes');
    }
  }, [history, coverImg]);

  const onConfirm = useCallback(() => {
    history.push('/builder/collections/new-collection/token-attributes');
  }, [history]);

  const clearFileImage = useCallback(() => {
    if (!imgAddress && inputFileRef.current) {
      inputFileRef.current.value = '';
      setCoverImg(null);
      setImgAddress(undefined);
    }
  }, [imgAddress, setCoverImg]);

  useEffect(() => {
    clearFileImage();
  }, [clearFileImage]);

  useEffect(() => {
    setCollectionCover();
  }, [setCollectionCover]);

  return (
    <div className='cover shadow-block'>
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
            {coverImg
              ? (
                <img
                  alt='token-img'
                  className='token-img'
                  src={URL.createObjectURL(coverImg)}
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
            { coverImg && (
              <img
                alt='clear'
                src={clearIcon as string}
              />
            )}
          </div>
        </div>
      </div>
      { imageUploading && (
        <p>
          <Loader
            active
            className='simple-loader'
          >
            Please wait a few seconds
          </Loader>
        </p>
      )}
      {/* { (imgAddress && coverFees) && (
        <WarningText fee={coverFees} />
      )} */}
      <Confirm
        cancelButton='No, return'
        className='unique-modal'
        confirmButton='Yes, I am sure'
        content='You cannot return to editing the cover in this product version.'
        header='You have not entered the cover. Are you sure that you want to create the collection without it?'
        onCancel={closeSaveConfirmation}
        onConfirm={onConfirm}
        open={isSaveConfirmationOpen}
      />
      <UnqButton
        content='Confirm'
        isDisabled={imageUploading}
        isFilled
        onClick={saveConfirm}
        size='medium'
      />
    </div>
  );
}

export default memo(Cover);
