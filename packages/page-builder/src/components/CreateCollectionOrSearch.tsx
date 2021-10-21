// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import clearIcon from '@polkadot/app-accounts/Accounts/clearIcon.svg';
import searchIcon from '@polkadot/app-accounts/Accounts/searchIcon.svg';
import { Input } from '@polkadot/react-components';

interface Props {
  searchString: string;
  setSearchString: (searchString: string) => void;
}

function CreateCollectionOrSearch ({ searchString, setSearchString }: Props): React.ReactElement {
  const handleClearSearch = useCallback(() => {
    setSearchString('');
  }, [setSearchString]);

  return (
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
  );
}

export default React.memo(CreateCollectionOrSearch);
