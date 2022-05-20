// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';

import envConfig from '@polkadot/apps-config/envConfig';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

const { ipfsGateway } = envConfig;

export function useCollectionCover (collectionInfo: NftCollectionInterface | undefined): { imgUrl: string | undefined } {
  const [imgUrl, setImgUrl] = useState<string>();

  const fillCollectionCover = useCallback(() => {
    const coverImg = collectionInfo?.properties?.find((prop) => prop.coverImageURL)?.coverImageURL;

    if (coverImg) {
      setImgUrl(`${ipfsGateway}/${coverImg}`);
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
