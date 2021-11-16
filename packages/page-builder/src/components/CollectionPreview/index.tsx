// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback, useEffect, useState } from 'react';

import defaultIcon from '@polkadot/app-builder/images/defaultIcon.svg';
import { useImageService } from '@polkadot/react-hooks';

function CollectionPreview (): React.ReactElement {
  const [imgUrl, setImgUrl] = useState<string>('');
  const { getCollectionImg } = useImageService();

  const getPreviewCollectionImg = useCallback(async () => {
    const image = await getCollectionImg('QmTqZhR6f7jzdhLgPArDPnsbZpvvgxzCZycXK7ywkLxSyU');

    setImgUrl(image);
  }, [getCollectionImg]);

  useEffect(() => {
    void getPreviewCollectionImg();
  }, [getPreviewCollectionImg]);

  return (
    <div className='collection-preview '>
      <div className='collection-preview-header'>Collection preview</div>
      <div className='collection-preview-content'>
        <div className='collection-img'>
          <img src={imgUrl || defaultIcon as string} />
        </div>
        <div className='content-description'>
          <h3 className='content-header'>CryptoDuckies</h3>
          <p className='content-text'>Adopt yourself a Duckie and join The Flock. Each Duck is a 1 of 1 programmatically generated with a completely unique combination of traits. No two are identical. In total, there are 5000 Duckies. Stay up to date on drops by joining the Discord and following</p>
          <p className='content-info'><span>ID:</span> 123456</p>
        </div>
      </div>
    </div>
  );
}

export default memo(CollectionPreview);
