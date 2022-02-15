// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

// external imports
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';

// local imports and components
import envConfig from '@polkadot/apps-config/envConfig';
import { AppProps as Props } from '@polkadot/react-components/types';

function Faq (): React.ReactElement<Props> {
  const history = useHistory();

  const openManageAccout = useCallback(() => {
    history.push('/accounts');
  }, [history]);

  const uniqueTelegram = envConfig?.uniqueTelegram;

  return (
    <main className='faq-page'>
      <Header as='h1'>FAQ</Header>
      <div className='faq shadow-block'>
        <Header as='h4'>Q: How can I connect my wallet?</Header>
        <p>A: You can use either <a
          href='https://polkadot.js.org/extension/'
          rel='noopener noreferrer'
          target='_blank'
        >Polkadot&#123;.js&#125; extension</a> or the <a onClick={openManageAccout}>Manage accounts</a> page. Restore your wallet through the seed phrase, JSON file+password or QR code.</p>
        <p>Make sure that using Chrome or Firefox desktop with the Polkadot.js browser extension, your wallet account is set to `allow use on any chain`.</p>
        <p>Note that this option is not available to Ledger or TrustWallet users. Their support will be added later. Rest assured your NFT is still safe in your wallet!</p>
        <Header as='h4'>Q: How can I create a wallet?</Header>
        <p>A: You can use either <a
          href='https://polkadot.js.org/extension/'
          rel='noopener noreferrer'
          target='_blank'
        >Polkadot&#123;.js&#125; extension</a> or <a onClick={openManageAccout}>the Manage accounts</a> page. Follow the instructions.</p>
        <p>Keep your wallet seed phrase safe! Please write it down on paper or export the JSON key with a password you will never forget.</p>
        <Header as='h4'>Q: How much does it cost to create a collection?</Header>
        { uniqueTelegram ? (<>
            <p>A: You need about 105 testUNQ to create and customize the collection. </p>
            <p>To get some OPL for free go to special Telegram Bot: <a
              href={uniqueTelegram || 'https://web.telegram.org/'}
              rel='noopener noreferrer'
              target='_blank'
            >@unique2faucet_opal_bot.</a></p>
          </>) : (<>
          <p>A: You need about 105 QTZ to create and customize the collection.</p>
          <p>To get some QTZ go to MEXC Exchange: <a href="https://www.mexc.com/" target="_blank">https://www.mexc.com/</a></p>
        </>)}

        <Header as='h4'>Q: How many tokens can I create?</Header>
        <p>A: You can create an unlimited number of collections and tokens. The current functionality does not allow you to create collections with a limited number of tokens, but we will add this feature later.</p>
      </div>
    </main>
  );
}

export default React.memo(Faq);
