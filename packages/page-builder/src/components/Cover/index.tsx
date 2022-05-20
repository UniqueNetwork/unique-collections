// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, SyntheticEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

import CollectionFormContext from '@polkadot/app-builder/CollectionFormContext/CollectionFormContext';
import { useCollectionFees } from '@polkadot/app-builder/hooks';
import clearIcon from '@polkadot/app-builder/images/closeIcon.svg';
import { UnqButton } from '@polkadot/react-components';
import { useCollection, useImageService } from '@polkadot/react-hooks';

import uploadIcon from '../../images/uploadIcon.svg';
import TransactionContext from '../../TransactionContext/TransactionContext';
import WarningText from '../WarningText';

interface CoverProps {
  account: string;
  collectionId?: string;
}

const stepText = 'Uploading collection cover to IPFS';

function Cover ({ account, collectionId }: CoverProps): React.ReactElement {
  const { calculateCoverFee, calculateFeeEx, fees } = useCollectionFees(account);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState<boolean>(false);
  const { uploadImg } = useImageService();
  const history = useHistory();
  const { coverImg, imgAddress, name, setCoverImg, setImgAddress, setVariableSchema } = useContext(CollectionFormContext);
  const { setCollectionProperties } = useCollection();
  const { setTransactions, transactions } = useContext(TransactionContext);

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
    setImgAddress(undefined);

    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  }, [setCoverImg, setImgAddress]);

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
  }, [clearTokenImg, setImgAddress, uploadImg]);

  const uploadAvatar = useCallback((event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    setCoverImg(file);
    void uploadImage(file);
  }, [setCoverImg, uploadImage]);

  const onSuccess = useCallback(() => {
    if (collectionId) {
      setTransactions([
        {
          state: 'finished',
          text: stepText
        }
      ]);

      setTimeout(() => {
        setTransactions([]);
      }, 3000);

      history.push(`/builder/collections/${collectionId}/token-attributes`);
    }
  }, [collectionId, history, setTransactions]);

  const saveVariableSchema = useCallback(() => {
    if (!imgAddress) {
      onSuccess();
    } else if (account && collectionId && imgAddress) {
      setTransactions([
        {
          state: 'active',
          text: stepText
        }
      ]);

      setCollectionProperties({
        account,
        collectionId,
        errorCallback: setTransactions.bind(null, []),
        properties: [
          { coverImageURL: imgAddress }
        ],
        successCallback: onSuccess
      });
    }
  }, [account, collectionId, imgAddress, onSuccess, setCollectionProperties, setTransactions]);

  const closeSaveConfirmation = useCallback(() => {
    setIsSaveConfirmationOpen(false);
  }, []);

  const onConfirm = useCallback(() => {
    if (collectionId) {
      saveVariableSchema();
    } else {
      history.push('/builder/collections/new-collection/token-attributes');
    }
  }, [collectionId, history, saveVariableSchema]);

  const saveConfirm = useCallback(() => {
    if (!coverImg) {
      setIsSaveConfirmationOpen(true);
    } else {
      onConfirm();
    }
  }, [coverImg, onConfirm]);

  const clearFileImage = useCallback(() => {
    if (!imgAddress && inputFileRef.current) {
      inputFileRef.current.value = '';
      setCoverImg(null);
      setImgAddress(undefined);
    }
  }, [imgAddress, setCoverImg, setImgAddress]);

  useEffect(() => {
    clearFileImage();
  }, [clearFileImage]);

  useEffect(() => {
    setCollectionCover();
  }, [setCollectionCover]);

  useEffect(() => {
    if (collectionId) {
      void calculateCoverFee();
    } else {
      void calculateFeeEx();
    }
  }, [calculateCoverFee, calculateFeeEx, collectionId]);

  // if we have no collection name filled, lets fill in in
  useEffect(() => {
    if (!collectionId && !name) {
      history.push('/builder/new-collection/main-information');
    }
  });

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
        <div>
          <Loader
            active
            className='simple-loader'
          >
            Please wait a few seconds
          </Loader>
          <br />
        </div>
      )}
      { !!fees && (
        <WarningText fee={fees} />
      )}
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
        isDisabled={transactions?.length > 0 || imageUploading}
        isFilled
        onClick={saveConfirm}
        size='medium'
      />
    </div>
  );
}

export default memo(Cover);
