// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import envConfig from '@polkadot/apps-config/envConfig';
import { AppProps as Props } from '@polkadot/react-components/types';

import CollectionsList from './containers/CollectionsList';

const { graphQlAdminSecret, graphQlApi } = envConfig;

const client = new ApolloClient({
  cache: new InMemoryCache(),
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret': graphQlAdminSecret
  },
  uri: graphQlApi
});

function Builder ({ account, basePath }: Props): React.ReactElement {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.pathname === '/builder') {
      history.push('/builder/collections');
    }
  }, [history, location]);

  return (
    <main className='builder-page'>
      <Switch>
        <Route path={`${basePath}/collections`}>
          <ApolloProvider client={client}>
            <CollectionsList
              account={account}
            />
          </ApolloProvider>
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(Builder);
