// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';

import { useCollection } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

export const useCollectionInfo = (collectionId?: string) => {
  const [collectionInfo, setCollectionInfo] = useState<NftCollectionInterface>();
  const { getDetailedCollectionInfo } = useCollection();

  const fetchCollectionInfo = useCallback(async () => {
    if (collectionId) {
      const info: NftCollectionInterface | null = await getDetailedCollectionInfo(collectionId);

      if (info) {
        setCollectionInfo(info);
      }
    }
  }, [collectionId, getDetailedCollectionInfo]);

  useEffect(() => {
    void fetchCollectionInfo();
  }, [fetchCollectionInfo]);

  return {
    collectionInfo
  };
};
