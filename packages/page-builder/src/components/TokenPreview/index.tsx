// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback, useEffect, useState } from 'react';

import { useImageService } from '@polkadot/react-hooks';

import defaultIcon from '../../images/defaultIcon.svg';
import {NftCollectionInterface} from "@polkadot/react-hooks/useCollection";

interface TokenPreviewProps {
  collectionInfo?: NftCollectionInterface;
  collectionName: string;
  tokenPrefix: string;
}

function TokenPreview ({ collectionName, tokenPrefix }: TokenPreviewProps): React.ReactElement {
  const attributes = ['Name:', 'Gender:', 'Traits:'];
  const [imgUrl, setImgUrl] = useState<string>('');
  const { getTokenImg } = useImageService();

  /* const getPreviewTokenImg = useCallback(async () => {
    const image = await getTokenImg('QmTqZhR6f7jzdhLgPArDPnsbZpvvgxzCZycXK7ywkLxSyU');

    setImgUrl(image);
  }, [getTokenImg]);

  useEffect(() => {
    void getPreviewTokenImg();
  }, [getPreviewTokenImg]); */

  return (
    <div className='token-preview'>
      <div className='token-preview-header'>Token preview</div>
      <div className='token-preview-content'>
        <div className='token-img'>
          <img src={imgUrl || defaultIcon as string} />
        </div>
        <div className='content-description'>
          <h3 className='content-header'>{tokenPrefix || 'Prefix'}</h3>
          <p className='content-text'>{collectionName || 'Collection name'}</p>
          <div className='token-attributes'>
            <h4>Token attributes  </h4>
            {attributes.map((item) => <p
              className='content-text'
              key={item}
            >{item}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TokenPreview);
