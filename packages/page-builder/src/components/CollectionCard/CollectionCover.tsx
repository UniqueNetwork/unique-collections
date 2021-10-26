// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import React, { memo, useCallback, useEffect, useState } from 'react';

import { useMetadata } from '@polkadot/react-hooks';

import collectionEmptyImage from '../../images/collectionEmptyImage.svg';

interface CollectionCardProps {
  collectionId: string;
  collectionInfo: NftCollectionInterface | null;
}

function CollectionCover ({ collectionInfo }: CollectionCardProps): React.ReactElement {
  const [collectionCoverLoading, setCollectionCoverLoading] = useState<boolean>(false);
  const [collectionCover, setCollectionCover] = useState<string>(collectionEmptyImage as string);
  const { getTokenImageUrl } = useMetadata();

  const getCollectionCover = useCallback(async () => {
    if (collectionInfo) {
      setCollectionCoverLoading(true);
      const collectionImage = await getTokenImageUrl(collectionInfo, '1');

      console.log('collectionImage', collectionImage);

      const img = new Image();

      img.src = collectionImage;

      img.onload = function () {
        setCollectionCover(collectionImage);
        setCollectionCoverLoading(false);
      };

      img.onerror = function () {
        setCollectionCover(collectionEmptyImage as string);
        setCollectionCoverLoading(false);
      };
    }
  }, [collectionInfo, getTokenImageUrl]);

  useEffect(() => {
    void getCollectionCover();
  }, [getCollectionCover]);

  console.log('collectionCover', collectionCover, 'collectionCoverLoading', collectionCoverLoading);

  return (
    <div className='collection-card-img'>
      <img
        alt='collection-cover'
        src={collectionCover}
      />
    </div>
  );
}

export default memo(CollectionCover);
