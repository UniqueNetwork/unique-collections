// Copyright 2017-2021 @polkadot/apps , UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import envConfig from '@polkadot/apps-config/envConfig';
import { AppProps as Props } from '@polkadot/react-components/types';

import CollectionPage from './containers/CollectionPage';
import CollectionsList from './containers/CollectionsList';

const { graphQlAdminSecret, graphQlApi } = envConfig;

const graphQlUrl = process.env.NODE_ENV === 'production' ? graphQlApi : '/v1/graphql/';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret': graphQlAdminSecret
  },
  uri: graphQlUrl
});

function Builder (props: Props): React.ReactElement {
  const { account, basePath } = props;
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.pathname === '/builder' || location.pathname === '/builder/') {
      history.push('/builder/collections');
    }
  }, [history, location]);

  return (
    <Switch>
      <Route path={`${basePath}/collections`}>
        <ApolloProvider client={client}>
          <CollectionsList
            account={account}
            basePath={basePath}
          />
        </ApolloProvider>
      </Route>
      <Route path={`${basePath}/new-collection`}>
        <CollectionPage
          account={account}
          basePath={basePath}
          isPreviewOpen={props.isPreviewOpen}
        />
      </Route>
    </Switch>
  );
}

export default React.memo(Builder);
