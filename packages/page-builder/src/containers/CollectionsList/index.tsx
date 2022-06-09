// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { UserCollection } from '@polkadot/react-hooks/useGraphQlCollections';

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
import { useCollection, useGraphQlCollections } from '@polkadot/react-hooks';

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
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const { collectionsCount, userCollections, userCollectionsLoading } = useGraphQlCollections(account, limit, (page - 1) * limit, searchString.trim());
  const hasMore = userCollections.length < collectionsCount;
  const currentAccount = useRef<string>();
  const countRef = useRef<number>();

  const fetchScrolledData = useCallback(() => {
    if (!userCollectionsLoading && hasMore) {
      setPage((prevPage: number) => prevPage + 1);
    }
  }, [hasMore, userCollectionsLoading]);

  const resetBySearchString = useCallback(() => {
    if (searchString) {
      setPage(1);
    }
  }, [searchString]);

  const reFetchCollections = useCallback((collectionId: string) => {
    if (!removedIds.includes(collectionId)) {
      countRef.current = collectionsCount - 1;
      setRemovedIds((prev) => [...prev, collectionId]);
    }
  }, [collectionsCount, removedIds]);

  const actualizeRemoved = useCallback(() => {
    setRemovedIds((prevRemoved) => prevRemoved.filter((id) => userCollections.find((collection) => collection.collection_id === id)));
  }, [userCollections]);

  useEffect(() => {
    resetBySearchString();
  }, [resetBySearchString]);

  useEffect(() => {
    if (!countRef.current && collectionsCount && !searchString) {
      countRef.current = collectionsCount;
    }
  }, [collectionsCount, searchString]);

  useEffect(() => {
    if (currentAccount.current && currentAccount.current !== account) {
      countRef.current = 0;
      setPage(1);
    }

    currentAccount.current = account;
  }, [account]);

  useEffect(() => {
    actualizeRemoved();
  }, [actualizeRemoved]);

  return (
    <div className='collections-list'>
      <Switch>
        <Route
          exact
          path={`${basePath}/collections`}
        >
          <Header as='h1'>My collections</Header>
          <CreateCollectionOrSearch
            hasCollections={true}
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <div className='collections-list--collections'>
            { (!countRef.current && !(collectionsCount - removedIds.length) && !userCollectionsLoading && !searchString) && (
              <NoCollections />
            )}
            { !!(!(collectionsCount - removedIds.length) && countRef.current && !userCollectionsLoading && searchString) && (
              <NoCollectionsFound />
            )}
            <InfiniteScroll
              hasMore={hasMore}
              initialLoad={false}
              loadMore={fetchScrolledData}
              pageStart={1}
              threshold={200}
              useWindow={true}
            >
              <div className='market-pallet__item'>
                { userCollections?.filter((collection) => !removedIds.includes(collection.collection_id)).map((collection: UserCollection) => (
                  <CollectionCard
                    account={account}
                    collectionId={collection.collection_id}
                    key={collection.collection_id}
                    resetCollections={reFetchCollections}
                  />
                ))}
              </div>
            </InfiniteScroll>
            { userCollectionsLoading && (
              <Loader
                active
                className='load-info'
                inline='centered'
              >
                Loading collections...
              </Loader>
            )}
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
