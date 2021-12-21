// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { useHistory } from 'react-router';

import clearIcon from '@polkadot/app-accounts/Accounts/clearIcon.svg';
import searchIcon from '@polkadot/app-accounts/Accounts/searchIcon.svg';
import { Input, UnqButton } from '@polkadot/react-components';

import { CollectionsListType } from '../containers/CollectionsList';

interface Props {
  searchString: string;
  setSearchString: (searchString: string) => void;
  collectionsLoaded: CollectionsListType;
}

function CreateCollectionOrSearch ({ collectionsLoaded, searchString, setSearchString }: Props): React.ReactElement {
  const history = useHistory();

  const handleClearSearch = useCallback(() => {
    setSearchString('');
  }, [setSearchString]);

  const onCreateCollection = useCallback(() => {
    history.push('/builder/new-collection');
  }, [history]);

  return (
    <div className='create-and-search'>
      <UnqButton
        className='create-btn'
        content='Create new'
        isFilled
        onClick={onCreateCollection}
        size='medium'
      />
      {Object.values(collectionsLoaded)?.length
        ? (<Input
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
        </Input>)
        : null}
    </div>
  );
}

export default React.memo(CreateCollectionOrSearch);
