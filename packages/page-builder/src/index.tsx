// Copyright 2017-2022 @polkadot/apps , UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { useCallback, useEffect, useState } from 'react';

import envConfig from '@polkadot/apps-config/envConfig';
import { AppProps as Props } from '@polkadot/react-components/types';

import Disclaimer from './components/Disclaimer';
import Builder from './Builder';
import CollectionForm from './CollectionFormContext';
import Transactions from './TransactionContext';

function CollectionBuilder (props: Props): React.ReactElement {
  // const { allAccounts } = useAccounts();
  // account selector on the top of the window must select an account if the user has at least one
  const { account } = props;
  /*
   - user has account
   - user is on builder page
   - user has not yet agreed with the disclaimer
   */
  const [showDisclaimer, toggleDisclaimer] = useState<boolean>(false);

  const uniqueTelegram = envConfig?.uniqueTelegram;

  const checkDisclaimer = useCallback(() => {
    if (!uniqueTelegram) {
      toggleDisclaimer(false);

      return;
    }

    const builderDisclaimer = localStorage.getItem('BUILDER_DISCLAIMER');

    toggleDisclaimer(!account || builderDisclaimer !== 'accepted');
  }, [account, uniqueTelegram]);

  useEffect(() => {
    checkDisclaimer();
  }, [checkDisclaimer]);

  if (showDisclaimer) {
    return (
      <main className='builder-page'>
        <Disclaimer
          checkDisclaimer={checkDisclaimer}
        />
      </main>
    );
  }

  return (
    <main className='builder-page'>
      <Transactions>
        <CollectionForm>
          <Builder
            {...props}
          />
        </CollectionForm>

      </Transactions>
    </main>
  );
}

export default React.memo(CollectionBuilder);
