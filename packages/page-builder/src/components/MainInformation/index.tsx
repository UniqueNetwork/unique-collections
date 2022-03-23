// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import BN from 'bn.js';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { SubmittableResult } from '@polkadot/api';
import TransactionContext from '@polkadot/app-builder/TransactionContext/TransactionContext';
import { Input, TextArea, UnqButton, Checkbox } from '@polkadot/react-components';
import { useCollection } from '@polkadot/react-hooks';

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

const stepText = 'Creating collection and saving it to blockchain';

function MainInformation (props: MainInformationProps): React.ReactElement {
  const { account, description, name, setDescription, setName, setTokenPrefix, tokenPrefix } = props;
  const { calculateCreateCollectionFee, createCollection } = useCollection();
  const [createFees, setCreateFees] = useState<BN | null>(null);
  const [minfest, setMinfest] = useState<boolean>(false);
  const history = useHistory();
  const { setTransactions } = useContext(TransactionContext);

  const calculateFee = useCallback(async () => {
    if (account) {
      const fees = await calculateCreateCollectionFee({ account, description, modeprm: { nft: null }, name, tokenPrefix });

      setCreateFees(fees);
    }
  }, [account, calculateCreateCollectionFee, description, name, tokenPrefix]);

  const goToNextStep = useCallback((result: SubmittableResult) => {
    const { events } = result;

    let collectionId = 0;

    events.forEach(({ event: { data, method, section } }) => {
      if ((section === 'common') && (method === 'CollectionCreated')) {
        collectionId = parseInt(data[0].toString(), 10);
      }
    });

    setTransactions([
      {
        state: 'finished',
        text: stepText
      }
    ]);

    setTimeout(() => {
      setTransactions([]);
    }, 3000);

    if (collectionId) {
      history.push(`/builder/collections/${collectionId}/cover`);
    }
  }, [setTransactions, history]);

  const onCreateCollection = useCallback(() => {
    if (account && name && tokenPrefix) {
      setTransactions([
        {
          state: 'active',
          text: stepText
        }
      ]);

      createCollection(account, {
        description,
        modeprm: { nft: null },
        name,
        tokenPrefix
      }, {
        onFailed: setTransactions.bind(null, []),
        onSuccess: goToNextStep
      });
    }
  }, [account, createCollection, description, goToNextStep, name, setTransactions, tokenPrefix]);

  const handleTokenPrefix = useCallback((value: string) => {
    const replaceValue = value.replace(/[^a-zA-Z0-9]+/, '');

    setTokenPrefix(replaceValue);
  }, [setTokenPrefix]);

  const handleBlurName = useCallback(() => {
    setName(name.trim());
  }, [setName, name]);

  const handleBlurDescription = useCallback(() => {
    setDescription(description.trim());
  }, [setDescription, description]);

  const handleBlurSymbol = useCallback(() => {
    setTokenPrefix(tokenPrefix.trim());
  }, [setTokenPrefix, tokenPrefix]);

  useEffect(() => {
    void calculateFee();
  }, [calculateFee]);

  return (
    <div className='main-information shadow-block'>
      <h1 className='header-text'>Main information</h1>
      <div className='info-block'>
        <h2>Name*</h2>
        <p>Required field (max 64 symbols)</p>
        <Input
          className='isSmall'
          maxLength={64}
          onBlur={handleBlurName}
          onChange={setName}
          value={name}
        />
      </div>
      <div className='info-block'>
        <h2>Description</h2>
        <p>Max 256 symbols</p>
        <TextArea
          maxLength={256}
          onBlur={handleBlurDescription}
          onChange={setDescription}
          seed={description}
        />
      </div>
      <div className='info-block'>
        <h2>Symbol*</h2>
        <p>Token name as displayed in Wallet (max 4 symbols)</p>
        <Input
          className='isSmall'
          maxLength={4}
          onBlur={handleBlurSymbol}
          onChange={handleTokenPrefix}
          value={tokenPrefix}
        />
      </div>
      <div className='info-block'>
        <Checkbox
          label={<> By participating in the MintFest you are agreeing to the <a
            href='https://unique.network/terms/mintfest/'
            rel='noreferrer nooperer'
            target='_blank'>Terms and Service</a> of the contest</>}
          onChange={setMinfest}
          value={minfest}
        />
      </div>
      { createFees && (
        <WarningText fee={createFees} />
      )}
      <UnqButton
        content='Confirm'
        isDisabled={!name || !tokenPrefix || !minfest}
        isFilled
        onClick={onCreateCollection}
        size='medium'
      />
    </div>
  );
}

export default memo(MainInformation);
