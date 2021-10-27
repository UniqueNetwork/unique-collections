// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { UserCollection } from '@polkadot/react-hooks/useGraphQlCollections';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

import CollectionCard from '@polkadot/app-builder/components/CollectionCard';
import { useGraphQlCollections, useIsMountedRef } from '@polkadot/react-hooks';

import CreateCollectionOrSearch from '../../components/CreateCollectionOrSearch';
import NoCollections from '../../components/NoCollections';

interface Props {
  account: string;
}

export type CollectionsListType = {
  [key: string]: UserCollection
};

const limit = 10;

function CollectionsList ({ account }: Props): React.ReactElement {
  const [searchString, setSearchString] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const { userCollections, userCollectionsLoading } = useGraphQlCollections(account, limit, (page - 1) * limit);
  const [collectionsLoaded, setCollectionsLoaded] = useState<CollectionsListType>({});
  const hasMore = (userCollections?.collections && Object.keys(collectionsLoaded).length < userCollections.collections?.length);
  const mountedRef = useIsMountedRef();
  const currentAccount = useRef<string>();

  const fetchScrolledData = useCallback(() => {
    !userCollectionsLoading && setPage((prevPage: number) => prevPage + 1);
  }, [userCollectionsLoading]);

  const initializeCollections = useCallback(() => {
    if (account && !userCollectionsLoading && userCollections?.collections) {
      mountedRef.current && setCollectionsLoaded((prevState: CollectionsListType) => {
        const collectionsList: CollectionsListType = { ...prevState };

        for (let j = 0; j < userCollections.collections.length; j++) {
          collectionsList[`${userCollections.collections[j].collection_id}`] = userCollections.collections[j];
        }

        return collectionsList;
      });
    }
  }, [account, mountedRef, userCollections, userCollectionsLoading]);

  const refillCollections = useCallback(() => {
    if (currentAccount.current !== account) {
      setPage(1);
      setCollectionsLoaded({});
      currentAccount.current = account;
    }

    initializeCollections();
  }, [account, initializeCollections]);

  useEffect(() => {
    refillCollections();
  }, [refillCollections]);

  return (
    <div className='collections-list'>
      <Header as='h1'>My Collections</Header>
      <CreateCollectionOrSearch
        searchString={searchString}
        setSearchString={setSearchString}
      />
      <div className='collections-list'>
        { (userCollectionsLoading && Object.keys(collectionsLoaded).length === 0) && (
          <Loader
            active
            className='load-info'
            inline='centered'
          >
            Loading collections...
          </Loader>
        )}
        { (!userCollections?.collections?.length && !Object.values(collectionsLoaded)?.length && !userCollectionsLoading) && (
          <NoCollections />
        )}
        <InfiniteScroll
          hasMore={hasMore}
          initialLoad={false}
          loadMore={fetchScrolledData}
          loader={<Loader
            active
            className='load-more'
            inline='centered'
            key={'nft-collections'}
          />}
          pageStart={1}
          threshold={200}
          useWindow={true}
        >
          <div className='market-pallet__item'>
            {Object.values(collectionsLoaded).map((collection: UserCollection) => (
              <CollectionCard
                collectionId={collection.collection_id}
                key={collection.collection_id}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default React.memo(CollectionsList);
