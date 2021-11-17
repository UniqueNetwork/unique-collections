// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router';

import { Input, TextArea } from '@polkadot/react-components';
import { useCollection } from '@polkadot/react-hooks';

import Button from '../Button';
import WarningText from '../WarningText';

interface MainInformationProps {
  account: string;
  description: string;
  name: string;
  setDescription: (description: string) => void;
  setName: (name: string) => void;
  setTokenPrefix: (tokenPrefix: string) => void;
  tokenPrefix: string;
}

function MainInformation (props: MainInformationProps): React.ReactElement {
  const { account, description, name, setDescription, setName, setTokenPrefix, tokenPrefix } = props;
  const { createCollection, getCreatedCollectionCount } = useCollection();
  const history = useHistory();

  const goToNextStep = useCallback(async () => {
    const collectionCount = await getCreatedCollectionCount();

    history.push(`/builder/collections/${collectionCount}/cover`);
  }, [getCreatedCollectionCount, history]);

  const onCreateCollection = useCallback(() => {
    if (account && name && tokenPrefix) {
      createCollection(account, {
        description,
        modeprm: { nft: null },
        name,
        tokenPrefix
      }, {
        onSuccess: goToNextStep
      });
    }
  }, [account, createCollection, description, goToNextStep, name, tokenPrefix]);

  return (
    <div className='main-information'>
      <h1 className='header-text'>Main information</h1>
      <div className='info-block'>
        <h2>Name*</h2>
        <p>Required field (max 64 symbols)</p>
        <Input
          className='isSmall'
          onChange={setName}
          value={name}
        />
      </div>
      <div className='info-block'>
        <h2>Description</h2>
        <p>Max 256 symbols</p>
        <TextArea
          onChange={setDescription}
          seed={description}
        />
      </div>
      <div className='info-block'>
        <h2>Prefix*</h2>
        <p>Token name as displayed in Wallet (max 16 symbols)</p>
        <Input
          className='isSmall'
          isError={tokenPrefix?.length > 16}
          onChange={setTokenPrefix}
          value={tokenPrefix}
        />
      </div>
      <WarningText />
      <Button
        disable={!name || !tokenPrefix || tokenPrefix.length > 16}
        onClick={onCreateCollection}
        text='Confirm'
      />
    </div>
  );
}

export default memo(MainInformation);
