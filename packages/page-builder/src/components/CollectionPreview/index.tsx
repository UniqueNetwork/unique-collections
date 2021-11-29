// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo } from 'react';
import { useParams } from 'react-router-dom';

import defaultIcon from '@polkadot/app-builder/images/defaultIcon.svg';
import { useCollectionCover, useDecoder } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

interface CollectionPreviewProps {
  avatarImg: File | null;
  collectionInfo?: NftCollectionInterface;
  collectionDescription: string
  collectionName: string;
}

function CollectionPreview ({ avatarImg, collectionDescription, collectionInfo, collectionName }: CollectionPreviewProps): React.ReactElement {
  const { imgUrl } = useCollectionCover(collectionInfo);
  const { collectionId }: { collectionId: string } = useParams();
  const { collectionName16Decoder } = useDecoder();

  return (
    <div className='collection-preview '>
      <div className='collection-preview-header'>Collection preview</div>
      <div className='collection-preview-content'>
        <div className='collection-img'>
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
                alt='collectionImage'
                src={imgUrl || defaultIcon as string}
              />
            )
          }
        </div>
        <div className='content-description'>
          <h3 className='content-header'>{collectionInfo ? collectionName16Decoder(collectionInfo.name) : (collectionName || 'Name')}</h3>
          <p className='content-text'>{collectionDescription || 'Description'}</p>
          { collectionId && (
            <p className='content-info'><span>ID:</span> {collectionId}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(CollectionPreview);
