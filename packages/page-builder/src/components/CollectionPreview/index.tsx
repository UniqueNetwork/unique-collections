// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import defaultIcon from '@polkadot/app-builder/images/defaultIcon.svg';
import envConfig from '@polkadot/apps-config/envConfig';
import { useCollection } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

const { ipfsGateway } = envConfig;

interface CollectionPreviewProps {
  collectionInfo?: NftCollectionInterface;
  collectionDescription: string
  collectionName: string;
}

function CollectionPreview ({ collectionDescription, collectionInfo, collectionName }: CollectionPreviewProps): React.ReactElement {
  const [imgUrl, setImgUrl] = useState<string>();
  const { getCollectionOnChainSchema, getCreatedCollectionCount } = useCollection();
  const [predictableCollectionId, setPredictableCollectionId] = useState<number>(1);
  const { collectionId }: { collectionId: string } = useParams();

  const getCollectionCount = useCallback(async () => {
    const collectionCount = await getCreatedCollectionCount();

    setPredictableCollectionId(collectionCount + 1);
  }, [getCreatedCollectionCount]);

  const fillCollectionCover = useCallback(() => {
    if (collectionInfo?.variableOnChainSchema) {
      const onChainSchema = getCollectionOnChainSchema(collectionInfo);

      if (onChainSchema) {
        const { variableSchema } = onChainSchema;

        if (variableSchema?.collectionCover) {
          setImgUrl(`${ipfsGateway}/${variableSchema.collectionCover}`);
        } else {
          console.log('variableSchema is empty');
        }
      }
    } else {
      console.log('onChainSchema is empty');
    }
  }, [collectionInfo, getCollectionOnChainSchema]);

  useEffect(() => {
    fillCollectionCover();
  }, [fillCollectionCover]);

  useEffect(() => {
    void getCollectionCount();
  }, [getCollectionCount]);

  return (
    <div className='collection-preview '>
      <div className='collection-preview-header'>Collection preview</div>
      <div className='collection-preview-content'>
        <div className='collection-img'>
          <img
            alt='collectionImage'
            src={imgUrl || defaultIcon as string}
          />
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
