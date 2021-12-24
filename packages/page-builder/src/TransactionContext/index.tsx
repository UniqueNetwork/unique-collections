// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import TransactionContext from './TransactionContext';
import TransactionModal from './TransactionModal';

interface Props {
  children: React.ReactNode;
}

function Transactions ({ children }: Props): React.ReactElement<Props> | null {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showModal, toggleModal] = useState<boolean>(true);

  const value = useMemo(() => ({
    setTransactions,
    transactions
  }), [transactions, setTransactions]);

  const closeModal = useCallback(() => {
    toggleModal(false);
  }, []);

  return (
    <TransactionContext.Provider value={value}>
      {children}
      <TransactionModal
        closeModal={closeModal}
      />
    </TransactionContext.Provider>
  );
}

export default React.memo(Transactions);
