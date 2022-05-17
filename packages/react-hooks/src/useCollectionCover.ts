// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';

import envConfig from '@polkadot/apps-config/envConfig';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

const { ipfsGateway } = envConfig;

export function useCollectionCover (collectionInfo: NftCollectionInterface | undefined): { imgUrl: string | undefined } {
  const [imgUrl, setImgUrl] = useState<string>();

  const fillCollectionCover = useCallback(() => {
    if (collectionInfo?.properties?.coverImageURL) {
      setImgUrl(`${ipfsGateway}/${collectionInfo.properties.coverImageURL}`);
    } else {
      console.log('onChainSchema is empty');
    }
  }, [collectionInfo]);

  useEffect(() => {
    fillCollectionCover();
  }, [fillCollectionCover]);

  return {
    imgUrl
  };
}
