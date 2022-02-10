// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';

import envConfig from '@polkadot/apps-config/envConfig';
import { UnqButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  checkDisclaimer: () => void;
}

function Disclaimer ({ checkDisclaimer }: Props): React.ReactElement<Props> {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { api } = useApi();
  const tokensName = api.registry.chainTokens?.join('');

  const handleOnCheck = useCallback(() => {
    setIsChecked((prev) => !prev);
  }, []);

  const onAcceptDisclaimer = useCallback(() => {
    localStorage.setItem('BUILDER_DISCLAIMER', 'accepted');
    checkDisclaimer();
  }, [checkDisclaimer]);

  return (
    <div className='disclaimer'>
      <Header as='h1'>Disclaimer</Header>
      <div className='disclaimer-content'>
        <ul>
          <li>1. Make sure you have <span>105 {tokensName}.</span> Otherwise you won`t be able to create a collection. To get some {tokensName} for free go to special Telegram bot <a
            href={envConfig?.uniqueTelegram || ''}
            rel='noopener noreferrer'
            target='_blank'
          >@unique2faucet_opal_bot</a></li>
          <li>2. Check carefully that the entered data is correct. Once confirmed, it will not be possible to return and make changes.</li>
          <li>3. Collections created in Opal will not be transferred into the Quartz. If you need to transfer the collection, contact the administrator in <a href={envConfig?.discordChannel || ''}>our Discord channel</a>.</li>
        </ul>
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
            content='Start creating'
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
