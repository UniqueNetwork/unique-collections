// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

import TransactionContext from '@polkadot/app-builder/TransactionContext/TransactionContext';
import envConfig from '@polkadot/apps-config/envConfig';
import { UnqButton } from '@polkadot/react-components';
import { useCollection, useDecoder } from '@polkadot/react-hooks';

import burnIcon from '../../images/burnIcon.svg';
import CollectionCover from './CollectionCover';

const { uniqueWallet } = envConfig;

interface CollectionCardProps {
  account: string;
  collectionId: string;
  resetCollections: (collectionId: string) => Promise<void>;
}

const stepText = 'Burning collection';

function CollectionCard ({ account, collectionId, resetCollections }: CollectionCardProps): React.ReactElement {
  const [collectionInfo, setCollectionInfo] = useState<NftCollectionInterface | null>(null);
  const [collectionTokensCount, setCollectionTokensCount] = useState<number>(0);
  const [collectionInfoLoading, setCollectionInfoLoading] = useState<boolean>(false);
  const [isBurnCollectionOpen, setIsBurnCollectionOpen] = useState<boolean>(false);
  const { destroyCollection, getCollectionTokensCount, getDetailedCollectionInfo } = useCollection();
  const history = useHistory();
  const { collectionName16Decoder, hex2a } = useDecoder();
  const { setTransactions } = useContext(TransactionContext);

  const fetchCollectionInfo = useCallback(async () => {
    if (collectionId) {
      const info: NftCollectionInterface | null = await getDetailedCollectionInfo(collectionId);
      const collectionTokensCount: number = await getCollectionTokensCount(collectionId);

      if (info) {
        setCollectionInfo(info);
        setCollectionTokensCount(collectionTokensCount);
        setCollectionInfoLoading(false);
      }
    }
  }, [collectionId, getDetailedCollectionInfo, getCollectionTokensCount]);

  const fetchCollectionList = useCallback(async () => {
    setTransactions([
      {
        state: 'finished',
        text: stepText
      }
    ]);

    setTimeout(() => {
      setTransactions([]);
    }, 3000);

    await resetCollections(collectionId);
  }, [collectionId, resetCollections, setTransactions]);

  const onCreateNft = useCallback(() => {
    history.push(`/builder/collections/${collectionId}/new-nft`);
  }, [collectionId, history]);

  const onBurnNft = useCallback(() => {
    setIsBurnCollectionOpen(true);
  }, []);

  const closeBurnModal = useCallback(() => {
    setIsBurnCollectionOpen(false);
  }, []);

  const onBurnCollection = useCallback(() => {
    setIsBurnCollectionOpen(false);
    setTransactions([
      {
        state: 'active',
        text: stepText
      }
    ]);

    destroyCollection({
      account,
      collectionId,
      errorCallback: setTransactions.bind(null, []),
      successCallback: fetchCollectionList
    });
  }, [account, collectionId, destroyCollection, fetchCollectionList, setTransactions]);

  const onWallet = useCallback(() => {
    window.open(`${uniqueWallet}${collectionId}`, '_blank', 'noopener, noreferrer');
  }, [collectionId]);

  useEffect(() => {
    void fetchCollectionInfo();
  }, [fetchCollectionInfo]);

  return (
    <div className='collection-card shadow-block'>
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
                  {collectionInfo.name && collectionName16Decoder(collectionInfo.name)}
                </p>
                {collectionInfo.description.length
                  ? (
                    <div className='content-description-text'>
                      {collectionInfo.description && collectionName16Decoder(collectionInfo.description)}
                    </div>
                  )
                  : ''}
              </div>
              <div className='content-buttons'>
                <UnqButton
                  content='Create NFT'
                  isFilled
                  onClick={onCreateNft}
                />
                <Confirm
                  cancelButton='No, return'
                  className='unique-modal'
                  confirmButton='Yes, I am sure'
                  header='Are you sure that you want to burn the collection? You will not be able to undo this action.'
                  onCancel={closeBurnModal}
                  onConfirm={onBurnCollection}
                  open={isBurnCollectionOpen}
                />
                <UnqButton
                  className='burn'
                  content='Burn'
                  onClick={onBurnNft}
                >
                  <img
                    alt='burnToken'
                    src={burnIcon as string}
                  />
                </UnqButton>
              </div>
            </div>
            <div className='collection-info'>
              <p><span>ID:</span> {collectionId}</p>
              <p><span>Symbol:</span> {collectionInfo.tokenPrefix && hex2a(collectionInfo.tokenPrefix)}</p>
              { !!collectionTokensCount && (
                <p><span>Items:</span> {collectionTokensCount}</p>
              )}
            </div>
            <div className='content-links'>
              <UnqButton
                content='Go to Block Explorer'
                isDisabled
              />
              <UnqButton
                content='Go to Wallet'
                onClick={onWallet}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(CollectionCard);
