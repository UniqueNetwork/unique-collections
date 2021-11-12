// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useContext } from 'react';

import envConfig from '@polkadot/apps-config/envConfig';
import { StatusContext } from '@polkadot/react-components';

const { imageServerUrl } = envConfig;

interface UseImageServiceInterface {
  getCollectionImg: () => Promise<string>;
  getTokenImg: () => Promise<string>;
  uploadCollectionImg: (collectionId: string, file: Blob | null) => Promise<string>;
}

interface UploadDataInterface {
  error: string,
  hash: string,
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

  const getCollectionImg = useCallback(async (): Promise<string> => {
    try {
      const urlResponse = await fetch(`${imageServerUrl}/images/{collection}/cover-image`);

      return urlResponse.url;
    } catch (e) {
      console.log(e);

      return '';
    }
  }, []);

  const getTokenImg = useCallback(async (): Promise<string> => {
    try {
      const urlResponse = await fetch(`${imageServerUrl}/images/{collection}/token/{token}'`);

      return urlResponse.url;
    } catch (e) {
      console.log(e);

      return '';
    }
  }, []);

  const uploadCollectionImg = useCallback(async (collectionId: string, file: Blob) => {
    const formData = new FormData();
    let hash = '';

    formData.append('file', file, 'testImage');
    formData.append('collection_id', collectionId);

    await fetch(`${imageServerUrl}/api/images/upload`, {
      body: formData,
      method: 'POST'
    }).then((response) => response.json())
      .then((data: UploadDataInterface) => {
        data.success && data.hash ? hash = data.hash : showError(data.error);
      }).catch((error) => {
        console.log('error ', error);
      });

    return hash;
  }, [showError]);

  return <UseImageServiceInterface>{
    getCollectionImg,
    getTokenImg,
    uploadCollectionImg
  };
};
