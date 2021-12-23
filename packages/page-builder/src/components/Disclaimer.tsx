// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';

import envConfig from '@polkadot/apps-config/envConfig';
import { UnqButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

function Disclaimer (): React.ReactElement {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { api } = useApi();
  const tokensName = api.registry.chainTokens?.join('');

  console.log('tokensName', tokensName);

  const handleOnCheck = useCallback(() => {
    setIsChecked((prev) => !prev);
  }, []);

  const onAcceptDisclaimer = useCallback(() => {
    localStorage.setItem('BUILDER_DISCLAIMER', 'accepted');
  }, []);

  return (
    <div className='disclaimer'>
      <Header as='h1'>Disclaimer</Header>
      <div className='disclaimer-content'>
        <ol>
          <li>Make sure you have <span>120 {tokensName},</span> otherwise you won`t be able to create a collection. To get some {tokensName} for free go to special Telegram bot <a href={envConfig?.uniqueTelegram || ''}>@unique2faucetbot</a></li>
          <li>Check carefully that the entered data is correct. Once confirmed, it will not be possible to return and make changes.</li>
          <li>Collections created in Opal will not transfer into the MainNet. If you need to transfer the collection, contact the administrator in <a href={envConfig?.discordChannel || ''}>our Discord channel</a>.</li>
        </ol>
        <div className='custom-checkbox'>
          <div className='checkbox-input'>
            <input
              checked={isChecked}
              onChange={handleOnCheck}
              type='checkbox'
            />
          </div>
          <div className='checkbox-title'>I have read and understood this disclaimer</div>
        </div>
        <div className='disclaimer-btn'>
          <UnqButton
            className='create-btn'
            content='Start Creating'
            isDisabled={!isChecked}
            isFilled
            onClick={onAcceptDisclaimer}
            size='medium'
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(Disclaimer);
