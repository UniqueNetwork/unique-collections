// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import BN from 'bn.js';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Input, TextArea, UnqButton } from '@polkadot/react-components';
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

function MainInformation (props: MainInformationProps): React.ReactElement {
  const { account, description, name, setDescription, setName, setTokenPrefix, tokenPrefix } = props;
  const { calculateCreateCollectionFee, createCollection, getCreatedCollectionCount } = useCollection();
  const [createFees, setCreateFees] = useState<BN | null>(null);
  const history = useHistory();

  const calculateFee = useCallback(async () => {
    if (account) {
      const fees = await calculateCreateCollectionFee({ account, description, modeprm: { nft: null }, name, tokenPrefix });

      setCreateFees(fees);
    }
  }, [account, calculateCreateCollectionFee, description, name, tokenPrefix]);

  // @todo - get latest index if account is owner
  /*
    export function getCreateCollectionResult(events: EventRecord[]): CreateCollectionResult {
     let success = false;
     let collectionId = 0;
     events.forEach(({event: {data, method, section}}) => {
      // console.log(`  ${phase}: ${section}.${method}:: ${data}`);
      if (method == 'ExtrinsicSuccess') {
       success = true;
      } else if ((section == 'common') && (method == 'CollectionCreated')) {
       collectionId = parseInt(data[0].toString(), 10);
      }
     });
     const result: CreateCollectionResult = {
      success,
      collectionId,
     };
     return result;
    }
   */
  const goToNextStep = useCallback(async () => {
    const collectionCount = await getCreatedCollectionCount();

    history.push(`/builder/collections/${collectionCount}/cover`);
  }, [history, getCreatedCollectionCount]);

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

  const handleBlur = useCallback(() => {
    setName(name.trim());
    setTokenPrefix(tokenPrefix.trim());
    setDescription(description.trim());
  }, [setName, name, setTokenPrefix, tokenPrefix, setDescription, description]);

  useEffect(() => {
    void calculateFee();
  }, [calculateFee]);

  return (
    <div className='main-information'>
      <h1 className='header-text'>Main information</h1>
      <div className='info-block'>
        <h2>Name*</h2>
        <p>Required field (max 64 symbols)</p>
        <Input
          className='isSmall'
          maxLength={64}
          onBlur={handleBlur}
          onChange={setName}
          value={name}
        />
      </div>
      <div className='info-block'>
        <h2>Description</h2>
        <p>Max 256 symbols</p>
        <TextArea
          maxLength={256}
          onBlur={handleBlur}
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
          onBlur={handleBlur}
          onChange={setTokenPrefix}
          value={tokenPrefix}
        />
      </div>
      { createFees && (
        <WarningText fee={createFees} />
      )}
      <UnqButton
        content='Confirm'
        isDisabled={!name || !tokenPrefix}
        isFilled
        onClick={onCreateCollection}
        size='medium'
      />
    </div>
  );
}

export default memo(MainInformation);
