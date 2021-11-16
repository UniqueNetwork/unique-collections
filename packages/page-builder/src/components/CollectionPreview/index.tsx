// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import defaultIcon from '@polkadot/app-builder/images/defaultIcon.svg';
import { useCollection, useImageService } from '@polkadot/react-hooks';

interface CollectionPreviewProps {
  collectionDescription: string
  collectionName: string;
}

function CollectionPreview ({ collectionDescription, collectionName }: CollectionPreviewProps): React.ReactElement {
  const [imgUrl, setImgUrl] = useState<string>('');
  const { getCollectionImg } = useImageService();
  const { getCreatedCollectionCount } = useCollection();
  const [predictableCollectionId, setPredictableCollectionId] = useState<number>(1);
  const { collectionId }: { collectionId: string } = useParams();

  const getCollectionCount = useCallback(async () => {
    const collectionCount = await getCreatedCollectionCount();

    setPredictableCollectionId(collectionCount);
  }, [getCreatedCollectionCount]);

  const getPreviewCollectionImg = useCallback(async () => {
    const image = await getCollectionImg('QmTqZhR6f7jzdhLgPArDPnsbZpvvgxzCZycXK7ywkLxSyU');

    setImgUrl(image);
  }, [getCollectionImg]);

  useEffect(() => {
    void getPreviewCollectionImg();
  }, [getPreviewCollectionImg]);

  useEffect(() => {
    void getCollectionCount();
  }, [getCollectionCount]);

  return (
    <div className='collection-preview '>
      <div className='collection-preview-header'>Collection preview</div>
      <div className='collection-preview-content'>
        <div className='collection-img'>
          <img src={imgUrl || defaultIcon as string} />
        </div>
        <div className='content-description'>
          <h3 className='content-header'>{collectionName || 'Name'}</h3>
          <p className='content-text'>{collectionDescription || 'Description'}</p>
          <p className='content-info'><span>ID:</span> {collectionId || predictableCollectionId}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(CollectionPreview);
