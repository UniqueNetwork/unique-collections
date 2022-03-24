// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import CollectionFormContext from '@polkadot/app-builder/CollectionFormContext/CollectionFormContext';
import { useCollectionFees } from '@polkadot/app-builder/hooks';
import { Checkbox, Input, TextArea, UnqButton } from '@polkadot/react-components';

import WarningText from '../WarningText';

interface MainInformationProps {
  account: string;
}

function MainInformation ({ account }: MainInformationProps): React.ReactElement {
  const { description, name, setDescription, setName, setTokenPrefix, tokenPrefix } = useContext(CollectionFormContext);
  const { calculateFeeEx, fees } = useCollectionFees(account);
  const [minfest, setMinfest] = useState<boolean>(false);
  const history = useHistory();

  const goToNextStep = useCallback(() => {
    history.push('/builder/collections/new-collection/cover');
  }, [history]);

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
    void calculateFeeEx();
  }, [calculateFeeEx]);

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
            target='_blank'
          >Terms and Service</a> of the contest</>}
          onChange={setMinfest}
          value={minfest}
        />
      </div>
      { fees && (
        <WarningText fee={fees} />
      )}
      <UnqButton
        content='Confirm'
        isDisabled={!name || !tokenPrefix || !minfest}
        isFilled
        onClick={goToNextStep}
        size='medium'
      />
    </div>
  );
}

export default memo(MainInformation);
