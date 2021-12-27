// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { UserCollection } from '@polkadot/react-hooks/useGraphQlCollections';

import { useApolloClient } from '@apollo/client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Route, Switch } from 'react-router';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

import CollectionCard from '@polkadot/app-builder/components/CollectionCard';
import CreateCollectionOrSearch from '@polkadot/app-builder/components/CreateCollectionOrSearch';
import NoCollections from '@polkadot/app-builder/components/NoCollections';
import NoCollectionsFound from '@polkadot/app-builder/components/NoCollectionsFound';
import CollectionPage from '@polkadot/app-builder/containers/CollectionPage';
import { useGraphQlCollections, useIsMountedRef } from '@polkadot/react-hooks';

interface Props {
  account: string;
  basePath: string;
}

export type CollectionsListType = {
  [key: string]: UserCollection
};

const limit = 10;

function CollectionsList ({ account, basePath }: Props): React.ReactElement {
  const [searchString, setSearchString] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const { userCollections, userCollectionsLoading } = useGraphQlCollections(account, limit, (page - 1) * limit, searchString);
  const [collectionsLoaded, setCollectionsLoaded] = useState<CollectionsListType>({});
  const isHasMore = Object.keys(collectionsLoaded).length < userCollections?.collections_aggregate.aggregate.count;
  const mountedRef = useIsMountedRef();
  const client = useApolloClient();
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

  const onReRemoveCollection = useCallback(async (collectionId: string) => {
    await client.refetchQueries({
      include: ['Collections']
    });
    setCollectionsLoaded((prevCollections) => {
      const newCollections = { ...prevCollections };

      delete newCollections[collectionId];

      return newCollections;
    });
  }, [client]);

  const hasCollections = !!(Object.keys(collectionsLoaded).length || searchString.length || userCollectionsLoading);

  const refillCollections = useCallback(() => {
    if (currentAccount.current !== account) {
      setPage(1);
      setCollectionsLoaded({});
      currentAccount.current = account;
    }

    initializeCollections();
  }, [account, initializeCollections]);

  useEffect(() => {
    if (searchString) {
      setPage(1);
      setCollectionsLoaded({});
    }
  }, [searchString]);

  useEffect(() => {
    refillCollections();
  }, [refillCollections]);

  return (
    <div className='collections-list'>

      <Switch>
        <Route
          exact
          path={`${basePath}/collections`}
        >
          <Header as='h1'>My collections</Header>
          <CreateCollectionOrSearch
            hasCollections={hasCollections}
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
            { (!userCollections?.collections?.length && !Object.values(collectionsLoaded)?.length && !userCollectionsLoading && !searchString) && (
              <NoCollections />
            )}
            { (!userCollections?.collections?.length && !Object.values(collectionsLoaded)?.length && !userCollectionsLoading && searchString) && (
              <NoCollectionsFound />
            )}
            <InfiniteScroll
              hasMore={isHasMore}
              initialLoad={false}
              loadMore={fetchScrolledData}
              loader={(
                <Loader
                  active
                  className='load-more'
                  inline='centered'
                  key={'nft-collections'}
                />
              )}
              pageStart={1}
              threshold={200}
              useWindow={true}
            >
              <div className='market-pallet__item'>
                {Object.values(collectionsLoaded).length > 0 && Object.values(collectionsLoaded).map((collection: UserCollection) => (
                  <CollectionCard
                    account={account}
                    collectionId={collection.collection_id}
                    key={collection.collection_id}
                    onReRemoveCollection={onReRemoveCollection}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </Route>
        <Route path={`${basePath}/collections/:collectionId`}>
          <CollectionPage
            account={account}
            basePath={basePath}
          />
        </Route>
        <Route path={`${basePath}/collections/:collectionId`}>
          <CollectionPage
            account={account}
            basePath={basePath}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default React.memo(CollectionsList);
