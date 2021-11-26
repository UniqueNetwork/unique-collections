// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import defaultIcon from '@polkadot/app-builder/images/defaultIcon.svg';
import { useCollection, useDecoder } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

interface CollectionPreviewProps {
  avatarImg: File| null
  collectionInfo?: NftCollectionInterface;
  collectionDescription: string
  collectionName: string;
}

function CollectionPreview ({ avatarImg, collectionDescription, collectionInfo, collectionName }: CollectionPreviewProps): React.ReactElement {
  const { getCreatedCollectionCount } = useCollection();
  const [predictableCollectionId, setPredictableCollectionId] = useState<number>(1);
  const { collectionId }: { collectionId: string } = useParams();
  const { collectionName16Decoder } = useDecoder();

  const getCollectionCount = useCallback(async () => {
    const collectionCount = await getCreatedCollectionCount();

    setPredictableCollectionId(collectionCount + 1);
  }, [getCreatedCollectionCount]);

  useEffect(() => {
    void getCollectionCount();
  }, [getCollectionCount]);

  return (
    <div className='collection-preview'>
      <div className='collection-preview-header'>Collection preview</div>
      <div className='collection-preview-content'>
        <div className='collection-img'>
          <img
            alt='collectionImage'
            className={avatarImg ? 'avatar-img' : ''}
            src={avatarImg ? URL.createObjectURL(avatarImg) : defaultIcon as string}
          />
        </div>
        <div className='content-description'>
          <h3 className='content-header'>{(collectionInfo && collectionInfo.name) ? collectionName16Decoder(collectionInfo.name) : 'Name'}</h3>
          <p className='content-text'>{(collectionInfo && collectionInfo.description) ? collectionName16Decoder(collectionInfo.description) : 'Description'}</p>
          {collectionId && <p className='content-info'><span>ID:</span> {collectionId}</p>}
        </div>
      </div>
    </div>
  );
}

export default memo(CollectionPreview);
