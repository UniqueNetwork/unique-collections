// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import React, { memo } from 'react';

import { useCollectionCover } from '@polkadot/react-hooks';

import collectionEmptyImage from '../../images/collectionEmptyImage.svg';

interface CollectionCardProps {
  collectionId: string;
  collectionInfo: NftCollectionInterface | undefined;
}

function CollectionCover ({ collectionInfo }: CollectionCardProps): React.ReactElement {
  const imgUrl = useCollectionCover(collectionInfo);

  return (
    <div className='collection-card-img'>
      <img
        alt='collection-cover'
        src={imgUrl || collectionEmptyImage as string}
      />
    </div>
  );
}

export default memo(CollectionCover);
