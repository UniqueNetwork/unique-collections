// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import React, { memo, useCallback, useEffect, useState } from 'react';

import { useCollection, useDecoder } from '@polkadot/react-hooks';

import burnIcon from '../../images/burnIcon.svg';
import CollectionCover from './CollectionCover';

interface CollectionCardProps {
  collectionId: string;
}

function CollectionCard ({ collectionId }: CollectionCardProps): React.ReactElement {
  const [collectionInfo, setCollectionInfo] = useState<NftCollectionInterface | null>(null);
  const [collectionTokensCount, setCollectionTokensCount] = useState<number>(0);
  const [collectionInfoLoading, setCollectionInfoLoading] = useState<boolean>(false);
  const { getCollectionTokensCount, getDetailedCollectionInfo } = useCollection();
  // const [collectionImageUrl, setCollectionImageUrl] = useState<string>();
  const { collectionName16Decoder, hex2a } = useDecoder();
  // const { allMyTokens, allTokensCount, ownTokensCount, tokensOnPage } = useMyTokens(account, collection, currentPerPage);

  const getCollectionInfo = useCallback(async () => {
    setCollectionInfoLoading(true);
    const collection = await getDetailedCollectionInfo(collectionId) as NftCollectionInterface | null;
    const collectionTokensCount = await getCollectionTokensCount(collectionId);

    setCollectionInfo(collection);
    setCollectionTokensCount(collectionTokensCount);
    setCollectionInfoLoading(false);
  }, [collectionId, getDetailedCollectionInfo, getCollectionTokensCount]);

  useEffect(() => {
    if (!collectionInfo) {
      void getCollectionInfo();
    }
  }, [collectionInfo, getCollectionInfo]);

  console.log('collectionInfo', collectionInfo, 'collectionTokensCount', collectionTokensCount);

  return (
    <div className='collection-card'>
      { !!collectionInfo && !collectionInfoLoading && (
        <>
          <CollectionCover
            collectionId={collectionId}
            collectionInfo={collectionInfo}
          />
          <div className='collection-card-content'>
            <div className='collection-card-content-main'>
              <div className='content-description'>
                <p className='content-description-title'>{collectionName16Decoder(collectionInfo.Name)}</p>
                <div className='content-description-text'>
                  {collectionName16Decoder(collectionInfo.Description)}
                </div>
              </div>
              <div className='content-buttons'>
                <button>Create NFT</button>
                <button>
                  <img src={burnIcon as string} /> Burn
                </button>
              </div>
            </div>
            <div className='collection-info'>
              <p><span>ID:</span> {collectionId}</p>
              <p><span>Prefix:</span> {hex2a(collectionInfo.TokenPrefix)}</p>
              { !!collectionTokensCount && (
                <p><span>Items</span> {collectionTokensCount}</p>
              )}
            </div>
            <div className='content-links'>
              <a href=''>Go to Block Explorer</a>
              <a href=''>Go to my Wallet</a>
            </div>
            <div className='content-tokens'>
              <p>NFTs preview</p>
              <div className='content-tokens-list'>
                <img />
                <img />
                <img />
                <img />
                <img />
                <img />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(CollectionCard);
