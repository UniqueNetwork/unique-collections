// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringAddress } from '@polkadot/ui-keyring/types';

import React, { useCallback, useContext } from 'react';
import { useHistory } from 'react-router';

import { AddressSmall, CopyIcon, StatusContext } from '@polkadot/react-components';

interface Props {
  account: KeyringAddress;
  setAccount?: (account?: string) => void;
}

function AccountTableItem ({ account, setAccount }: Props): React.ReactElement<Props> | null {
  const history = useHistory();
  const { queueAction } = useContext(StatusContext);

  const copyAddress = useCallback(
    (account: string) => {
      void navigator.clipboard.writeText(account);

      return queueAction({
        account,
        action: 'clipboard',
        message: 'address copied',
        status: 'queued'
      });
    },
    [queueAction]
  );

  const onCopyAddress = useCallback(() => {
    copyAddress(account.address);
  }, [account, copyAddress]);

  const viewAllCollections = useCallback(() => {
    if (setAccount) {
      setAccount(account.address);
    }

    history.push('/builder/collections');
  }, [account.address, history, setAccount]);

  return (
    <div className='accounts-table-item '>
      <div className='item'>
        <AddressSmall value={account.address} />
        <div className='item--address'>
          <span>{account.address}</span>
          <a
            onClick={onCopyAddress}
          >
            <CopyIcon />
          </a>
        </div>
      </div>
      <a
        onClick={viewAllCollections}
      >
        View all collections
      </a>
    </div>
  );
}

export default React.memo(AccountTableItem);
