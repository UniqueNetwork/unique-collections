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

  return (
    <main className='faq-page'>
      <Header as='h1'>FAQ</Header>
      <div className='faq shadow-block'>
        <Header as='h4'>Q: How can I connect my wallet?</Header>
        <p>A: You can use either <a
          href='https://polkadot.js.org/extension/'
          rel='noreferrer'
          target='_blank'
        >Polkadot&#123;.js&#125; extension</a> or the market <a onClick={openManageAccout}>Manage Account</a> page. Restore your wallet through the seed phrase, JSON file+password or QR code.</p>
        <p>Make sure that using Chrome or Firefox desktop with the Polkadot.js browser extension you’ve set your wallet account setting to `allow use on any chain`.</p>
        <p>Note that this option is not available to Ledger or TrustWallet users, their support will be added later. Rest assured your NFT is still safe in your wallet!</p>
        <Header as='h4'>Q: How can I create a wallet?</Header>
        <p>A: You can use either <a
          href='https://polkadot.js.org/extension/'
          rel='noreferrer'
          target='_blank'
        >Polkadot&#123;.js&#125; extension</a> or <a onClick={openManageAccout}>the Manage Account</a> page.Follow the instructions.</p>
        <p>Keep your wallet seed phrase safe! Write it down on paper or export the JSON key with a password you would never forget.</p>
        <Header as='h4'>Q: How can I get testUNQ to my account?</Header>
        <p>A: You can get testUNQ from the Unique Faucet Telegram Bot: <a
          href={envConfig?.uniqueTelegram || 'https://web.telegram.org/'}
          rel='noreferrer'
          target='_blank'
        >@unique2faucet_opal_bot@.</a></p>
        <Header as='h4'>Q: How much does it cost to create a collection?</Header>
        <p>A: You need 120 testUNQ to create and customize the collection: </p>
        <ol>
          <li>100 testUNQ to create a collection</li>
          <li>20 testUNQ to create token attributes and set a collection cover.</li>
        </ol>
        <p>To get some testUNQ for free, go to the Unique Faucet Telegram Bot: <a
          href={envConfig?.uniqueTelegram || 'https://web.telegram.org/'}
          rel='noreferrer'
          target='_blank'
        >@unique2faucet_opal_bot.</a></p>
        <Header as='h4'>Q: How many tokens can I create?</Header>
        <p>A: You can create an unlimited number of collections and tokens. The current functionality does not allow you to create collections with a limited number of tokens, but we will add this feature later.</p>
      </div>
    </main>
  );
}

export default React.memo(Faq);
