// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { gql, useApolloClient, useQuery } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';

// import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

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
  resetCollections: () => Promise<void>;
  userCollections: UserCollection[];
  userCollectionsError: any;
  userCollectionsLoading: boolean;
};

const USER_COLLECTIONS = gql`
  query Collections($limit: Int!, $offset: Int!, $owner: String!, $name: String!) {
    collections(limit: $limit, offset: $offset, order_by: {collection_id: desc}, where: { owner: { _eq: $owner }, name: { _ilike: $name } }) {
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

// const normalizeSubstrate = (account: string) => encodeAddress(decodeAddress(account));

export const useGraphQlCollections = (account: string, limit: number, offset: number, name: string): UseGraphQlInterface => {
  // can be useLazyQuery
  const { data, error: userCollectionsError, loading: userCollectionsLoading } = useQuery(USER_COLLECTIONS, {
    fetchPolicy: 'network-only', // Used for first execution
    nextFetchPolicy: 'cache-first',
    variables: { limit, name: name.length === 0 ? '%' : `%${name}%`, offset, owner: account }// normalizeSubstrate(account) }
  }) as unknown as { data: UserCollections, error: string, loading: boolean };
  const [userCollections, setUserCollections] = useState<UserCollection[]>([]);
  const [collectionsCount, setCollectionsCount] = useState<number>(0);
  const client = useApolloClient();
  const searchRef = useRef<string>();
  const currentAccount = useRef<string>();

  const collectionsToLocal = useCallback(() => {
    if (data?.collections) {
      setUserCollections((prevCollections) => [...prevCollections, ...data.collections]);
    }

    if (data?.collections_aggregate?.aggregate) {
      setCollectionsCount(data.collections_aggregate.aggregate.count);
    }
  }, [data]);

  const resetCollections = useCallback(async () => {
    setUserCollections([]);

    await client.refetchQueries({
      include: ['Collections']
    });
  }, [client]);

  useEffect(() => {
    collectionsToLocal();
  }, [collectionsToLocal]);

  useEffect(() => {
    if (searchRef.current !== name) {
      void resetCollections();
    }

    searchRef.current = name;
  }, [name, resetCollections]);

  useEffect(() => {
    if (currentAccount.current && currentAccount.current !== account) {
      void resetCollections();
    }

    currentAccount.current = account;
  }, [account, resetCollections]);

  return {
    collectionsCount,
    resetCollections,
    userCollections,
    userCollectionsError,
    userCollectionsLoading
  };
};

export default useGraphQlCollections;
