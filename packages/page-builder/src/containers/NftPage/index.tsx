// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement, useCallback, useEffect, useState } from 'react';

import CreateNFT from '@polkadot/app-builder/components/CreateNFT';
import { useCollection } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

interface NftPageProps {
  account: string;
  basePath: string;
  collectionId: string;
}

function NftPage ({ account, collectionId }: NftPageProps): ReactElement {
  const { getDetailedCollectionInfo } = useCollection();
  const [collectionInfo, setCollectionInfo] = useState<NftCollectionInterface>();
  const isOwner = collectionInfo?.owner === account;

  const fetchCollectionInfo = useCallback(async () => {
    const info: NftCollectionInterface | null = await getDetailedCollectionInfo(collectionId);

    if (info) {
      setCollectionInfo(info);
    }
  }, [collectionId, getDetailedCollectionInfo]);

  useEffect(() => {
    void fetchCollectionInfo();
  }, [fetchCollectionInfo]);

  return (
    <div className='nft-page'>
      { collectionInfo && (
        <CreateNFT
          account={account}
          collectionId={collectionId}
          collectionInfo={collectionInfo}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}

export default memo(NftPage);
