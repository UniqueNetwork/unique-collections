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

interface UploadDataInterface {
  error: string,
  address: string,
  success: boolean
}

export const useImageService = (): UseImageServiceInterface => {
  const { queueAction } = useContext(StatusContext);

  const showError = useCallback(
    (text: string) => {
      return queueAction({
        action: 'clipboard',
        message: text,
        status: 'queued'
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
