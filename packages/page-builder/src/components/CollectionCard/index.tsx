// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

import { UnqButton } from '@polkadot/react-components';
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
  const history = useHistory();
  // const [collectionImageUrl, setCollectionImageUrl] = useState<string>();
  const { collectionName16Decoder, hex2a } = useDecoder();
  // const { allMyTokens, allTokensCount, ownTokensCount, tokensOnPage } = useMyTokens(account, collection, currentPerPage);

  const getCollectionInfo = useCallback(async () => {
    setCollectionInfoLoading(true);
    const collection = await getDetailedCollectionInfo(collectionId);
    const collectionTokensCount = await getCollectionTokensCount(collectionId);

    setCollectionInfo(collection);
    setCollectionTokensCount(collectionTokensCount);
    setCollectionInfoLoading(false);
  }, [collectionId, getDetailedCollectionInfo, getCollectionTokensCount]);

  const onCreateNft = useCallback(() => {
    history.push('/builder/collections/new-nft');
  }, [history]);

  const onBurnNft = useCallback(() => {
    console.log('onBurnNft');
  }, []);

  useEffect(() => {
    if (!collectionInfo) {
      void getCollectionInfo();
    }
  }, [collectionInfo, getCollectionInfo]);

  console.log('collectionInfo', collectionInfo, 'collectionTokensCount', collectionTokensCount);

  return (
    <div className='collection-card'>
      { collectionInfoLoading && (
        <Loader
          active
          className='load-info'
          inline='centered'
        >
          Loading collection info...
        </Loader>
      )}
      { !!collectionInfo && !collectionInfoLoading && (
        <>
          <CollectionCover
            collectionId={collectionId}
            collectionInfo={collectionInfo}
          />
          <div className='collection-card-content'>
            <div className='collection-card-content-main'>
              <div className='content-description'>
                <p className='content-description-title'>
                  {collectionName16Decoder(collectionInfo.Name)}
                </p>
                <div className='content-description-text'>
                  {collectionName16Decoder(collectionInfo.Description)}
                </div>
              </div>
              <div className='content-buttons'>
                <UnqButton
                  content='Create NFT'
                  isFilled= {true}
                  onClick={onCreateNft}
                />
                <UnqButton
                  classname='burn'
                  content='Burn'
                  onClick={onBurnNft}
                >
                  <img src={burnIcon as string} />
                </UnqButton>
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
              <UnqButton content='Go to Block Explorer' />
              <UnqButton
                content='Go to my Wallet'
                isDisabled={true}
              />
            </div>
            {/* <div className='content-tokens'>
              <p>NFTs preview</p>
              <div className='content-tokens-list'>
                <img />
                <img />
                <img />
                <img />
                <img />
                <img />
              </div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
}

export default memo(CollectionCard);
