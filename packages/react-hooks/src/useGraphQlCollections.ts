// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { gql, useQuery } from '@apollo/client';
import { useCallback, useState, useEffect } from 'react';

export type UserCollection = {
  'collection_id': string;
  description: string;
  name: string;
  'offchain_schema': string;
  owner: string;
  'token_limit': number;
}

export type CollectionsAggregate = {
  aggregate: {
    count: number
  }
}

export type UserCollections = {
  collections: UserCollection[];
  collections_aggregate: CollectionsAggregate;
}

export type UseGraphQlInterface = {
  collectionsCount: number;
  userCollections: UserCollection[];
  userCollectionsError: any;
  userCollectionsLoading: boolean;
};

const USER_COLLECTIONS = gql`
  query Collections($limit: Int!, $offset: Int!, $owner: String!, $name: String!) {
    collections(limit: $limit, offset: $offset, where: { owner: { _eq: $owner }, name: { _ilike: $name } }) {
      collection_id
      description
      name
      offchain_schema
      owner
      token_limit
      mode
    }
    collections_aggregate( where: { owner: { _eq: $owner }, name: { _ilike: $name } }) {
      aggregate {
        count
      }
    }
  }
`;

export const useGraphQlCollections = (account: string, limit: number, offset: number, name: string): UseGraphQlInterface => {
  // can be useLazyQuery
  const { data, error: userCollectionsError, loading: userCollectionsLoading } = useQuery(USER_COLLECTIONS, {
    fetchPolicy: 'network-only', // Used for first execution
    nextFetchPolicy: 'cache-first',
    variables: { limit, name: name.length === 0 ? '%' : `%${name}%`, offset, owner: account }
  }) as unknown as { data: UserCollections, error: string, loading: boolean };
  const [userCollections, setUserCollections] = useState<UserCollection[]>([]);
  const [collectionsCount, setCollectionsCount] = useState<number>(0);

  const collectionsToLocal = useCallback(() => {
    if (data?.collections) {
      setUserCollections(data.collections);
    }

    if (data?.collections_aggregate?.aggregate?.count) {
      setCollectionsCount(data.collections_aggregate.aggregate.count);
    }
  }, [data]);

  useEffect(() => {
    collectionsToLocal();
  }, [collectionsToLocal]);

  return {
    collectionsCount,
    userCollections,
    userCollectionsError,
    userCollectionsLoading
  };
};

export default useGraphQlCollections;
