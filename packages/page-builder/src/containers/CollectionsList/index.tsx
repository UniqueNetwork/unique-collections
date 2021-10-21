// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { useState } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';

import { useGraphQlCollections } from '@polkadot/react-hooks';

import CreateCollectionOrSearch from '../../components/CreateCollectionOrSearch';
import Disclaimer from '../../components/Disclaimer';

interface Props {
  account: string;
}

function CollectionsList ({ account }: Props): React.ReactElement {
  const [searchString, setSearchString] = useState<string>('');
  const { userCollections, userCollectionsLoading } = useGraphQlCollections(account, 100, 0);

  console.log('userCollections', userCollections);
  console.log('userCollectionsLoading', userCollectionsLoading);

  return (
    <div className='collections-list'>
      <Header as='h1'>My Collections</Header>
      <CreateCollectionOrSearch
        searchString={searchString}
        setSearchString={setSearchString}
      />
      <Disclaimer />
    </div>
  );
}

export default React.memo(CollectionsList);
