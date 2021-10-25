// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { gql, useQuery } from '@apollo/client';

export type UserCollection = {
  'collection_id': string;
  description: string;
  name: string;
  'offchain_schema': string;
  owner: string;
  'token_limit': number;
}

export type UserCollections = {
  collections: UserCollection[];
}

export type UseGraphQlInterface = {
  userCollections: UserCollections;
  userCollectionsError: any;
  userCollectionsLoading: boolean;
};

const USER_COLLECTIONS = gql`
  query Collections($limit: Int!, $offset: Int!, $owner: String!) {
    collections(limit: $limit, offset: $offset, where: { owner: { _eq: $owner } }) {
      collection_id
      description
      name
      offchain_schema
      owner
      token_limit
    }
  }
`;

export const useGraphQlCollections = (account: string, limit: number, offset: number): UseGraphQlInterface => {
  // can be useLazyQuery
  const { data: userCollections, error: userCollectionsError, loading: userCollectionsLoading } = useQuery(USER_COLLECTIONS, {
    fetchPolicy: 'network-only', // Used for first execution
    nextFetchPolicy: 'cache-first',
    variables: { limit, offset, owner: account }
  }) as unknown as { data: UserCollections, error: string, loading: boolean };

  return {
    userCollections,
    userCollectionsError,
    userCollectionsLoading
  };
};

export default useGraphQlCollections;
