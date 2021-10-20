// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { useCallback, useState } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';

import Disclaimer from '@polkadot/app-builder/components/Disclaimer';
import clearIcon from '@polkadot/app-nft-wallet/components/CollectionSearch/clearIcon.svg';
import searchIcon from '@polkadot/app-nft-wallet/components/CollectionSearch/searchIcon.svg';
import { Input } from '@polkadot/react-components';

function Builder (): React.ReactElement {
  const [searchString, setSearchString] = useState<string>('');

  const handleClearSearch = useCallback(() => {
    setSearchString('');
  }, []);

  return (
    <main className='builder-page'>
      <Header as='h1'>My Collections</Header>
      <div className='create-and-search'>
        <button className='create-btn'>Create new</button>
        <Input
          className='isSmall'
          icon={
            <img
              alt='search'
              className='search-icon'
              src={searchIcon as string}
            />
          }
          onChange={setSearchString}
          placeholder='Search'
          value={searchString}
          withLabel
        >
          { searchString?.length > 0 && (
            <img
              alt='clear'
              className='clear-icon'
              onClick={handleClearSearch}
              src={clearIcon as string}
            />
          )}
        </Input>
      </div>
      <Disclaimer />
    </main>
  );
}

export default React.memo(Builder);
