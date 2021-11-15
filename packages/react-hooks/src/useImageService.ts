// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useContext } from 'react';

import envConfig from '@polkadot/apps-config/envConfig';
import { StatusContext } from '@polkadot/react-components';

const { imageServerUrl, ipfsGateway } = envConfig;

interface UseImageServiceInterface {
  getCollectionImg: (address: string) => Promise<string>;
  getTokenImg: (address: string) => Promise<string>;
  uploadCollectionImg: (file: Blob | null) => Promise<string>;
}
type ErrorType='ERR_INTERNAL_ERROR' | 'ERR_INVALID_FILE_TYPE' | 'ERR_INVALID_PAYLOAD'

interface UploadDataInterface {
  error: ErrorType,
  address: string,
  success: boolean
}

const errorMessages = {
  ERR_INTERNAL_ERROR: 'No file chosen',
  ERR_INVALID_FILE_TYPE: 'Wrong image file type',
  ERR_INVALID_PAYLOAD: 'Server error'
};

export const useImageService = (): UseImageServiceInterface => {
  const { queueAction } = useContext(StatusContext);

  const showError = useCallback(
    (message: ErrorType) => {
      return queueAction({
        action: 'clipboard',
        message: errorMessages[message] || 'Error',
        status: 'error'
      });
    },
    [queueAction]
  );

  const getCollectionImg = useCallback(async (address: string): Promise<string> => {
    try {
      const urlResponse = await fetch(`${ipfsGateway}/ipfs/${address}`);

      return urlResponse.url;
    } catch (e) {
      console.log(e);

      return '';
    }
  }, []);

  const getTokenImg = useCallback(async (address: string): Promise<string> => {
    try {
      const urlResponse = await fetch(`${ipfsGateway}/ipfs/${address}`);

      return urlResponse.url;
    } catch (e) {
      console.log(e);

      return '';
    }
  }, []);

  const uploadCollectionImg = useCallback(async (file: Blob) => {
    const formData = new FormData();
    let address = '';

    formData.append('file', file, 'testImage');

    await fetch(`${imageServerUrl}/api/images/upload`, {
      body: formData,
      method: 'POST'
    }).then((response) => response.json())
      .then((data: UploadDataInterface) => {
        data.success && data.address ? address = data.address : showError(data.error);
      }).catch((error) => {
        console.log('error ', error);
      });

    return address;
  }, [showError]);

  return <UseImageServiceInterface>{
    getCollectionImg,
    getTokenImg,
    uploadCollectionImg
  };
};
