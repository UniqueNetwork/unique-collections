// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

interface UseBalancesInterface {
  freeBalance: BN | undefined;
}

export const useBalances = (account: string | undefined, getUserDeposit?: () => Promise<BN | null>): UseBalancesInterface => {
  const { api } = useApi();
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances?.all, [account]);
  const [freeBalance, setFreeBalance] = useState<BN>();

  useEffect(() => {
    // available balance used as free (transferable)
    if (balancesAll) {
      setFreeBalance(balancesAll.availableBalance);
    }
  }, [balancesAll]);

  useEffect(() => {
    getUserDeposit && getUserDeposit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeBalance]);

  return {
    freeBalance
  };
};
