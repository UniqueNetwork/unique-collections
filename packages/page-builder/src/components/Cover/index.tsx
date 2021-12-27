// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import BN from 'bn.js';
import React, { memo, SyntheticEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';

import clearIcon from '@polkadot/app-builder/images/closeIcon.svg';
import TransactionContext from '@polkadot/app-builder/TransactionContext/TransactionContext';
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

const stepTexts = ['Uploading collection cover to IPFS', 'Saving cover img url to blockchain'];

function Cover ({ account, avatarImg, collectionId, setAvatarImg }: CoverProps): React.ReactElement {
  const { calculateSetSchemaVersionFee, calculateSetVariableOnChainSchemaFee, saveVariableOnChainSchema } = useCollection();
  const [coverFees, setCoverFees] = useState<BN | null>(null);
  const [imgAddress, setImgAddress] = useState<string>();
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState<boolean>(false);
  const { uploadImg } = useImageService();
  const history = useHistory();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { setTransactions, transactions } = useContext(TransactionContext);

  const calculateFee = useCallback(async () => {
    if (account) {
      const setSchemaVersionFee = (await calculateSetSchemaVersionFee({ account, collectionId, schemaVersion: 'Unique' })) || new BN(0);
      let setVariableOnChainSchemaFee: BN = new BN(0);

      if (account && collectionId && imgAddress) {
        const varDataWithImage = {
          collectionCover: imgAddress
        };

        setVariableOnChainSchemaFee = (await calculateSetVariableOnChainSchemaFee({ account, collectionId, schema: JSON.stringify(varDataWithImage) })) || new BN(0);
      }

      setCoverFees(setSchemaVersionFee.add(setVariableOnChainSchemaFee));
    }
  }, [account, calculateSetSchemaVersionFee, calculateSetVariableOnChainSchemaFee, collectionId, imgAddress]);

  const uploadImage = useCallback(async (file: File): Promise<void> => {
    if (file) {
      setTransactions([
        {
          state: 'active',
          text: stepTexts[0]
        }
      ]);
      const address = await uploadImg(file);

      setTransactions([
        {
          state: 'finished',
          text: stepTexts[0]
        }
      ]);
      setTimeout(() => {
        setTransactions([]);
      }, 3000);

      setImgAddress(address);
    }
  }, [setTransactions, uploadImg]);

  const uploadAvatar = useCallback((event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    setAvatarImg(file);
    void uploadImage(file);
  }, [setAvatarImg, uploadImage]);

  const clearTokenImg = useCallback(() => {
    setAvatarImg(null);

    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  }, [setAvatarImg]);

  const onSuccess = useCallback(() => {
    setTransactions([
      {
        state: 'finished',
        text: stepTexts[1]
      }
    ]);
    setTimeout(() => {
      setTransactions([]);
    }, 3000);
    history.push(`/builder/collections/${collectionId}/token-attributes`);
  }, [collectionId, history, setTransactions]);

  const saveVariableSchema = useCallback(() => {
    if (!imgAddress) {
      onSuccess();
    } else if (account && collectionId && imgAddress) {
      setTransactions([
        {
          state: 'active',
          text: stepTexts[1]
        }
      ]);
      const varDataWithImage = {
        collectionCover: imgAddress
      };

      saveVariableOnChainSchema({
        account,
        collectionId,
        errorCallback: setTransactions.bind(null, []),
        schema: JSON.stringify(varDataWithImage),
        successCallback: onSuccess
      });
    }
  }, [account, collectionId, imgAddress, onSuccess, saveVariableOnChainSchema, setTransactions]);

  const closeSaveConfirmation = useCallback(() => {
    setIsSaveConfirmationOpen(false);
  }, []);

  const saveConfirm = useCallback(() => {
    if (!avatarImg) {
      setIsSaveConfirmationOpen(true);
    } else {
      saveVariableSchema();
    }
  }, [saveVariableSchema, avatarImg]);

  const clearFileImage = useCallback(() => {
    if (!imgAddress && inputFileRef.current) {
      inputFileRef.current.value = '';
      setAvatarImg(null);
    }
  }, [imgAddress, setAvatarImg]);

  useEffect(() => {
    clearFileImage();
  }, [clearFileImage]);

  useEffect(() => {
    void calculateFee();
  }, [calculateFee]);

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
      { coverFees && (
        <WarningText fee={coverFees} />
      )}
      <Confirm
        cancelButton='No, return'
        className='unique-modal'
        confirmButton='Yes, I am sure'
        content='You cannot return to editing the cover in this product version.'
        header='You have not entered the cover. Are you sure that you want to create the collection without it?'
        onCancel={closeSaveConfirmation}
        onConfirm={saveVariableSchema}
        open={isSaveConfirmationOpen}
      />
      <UnqButton
        content='Confirm'
        isDisabled={transactions?.length > 0}
        isFilled
        onClick={saveConfirm}
        size='medium'
      />
    </div>
  );
}

export default memo(Cover);
