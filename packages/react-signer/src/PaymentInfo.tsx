// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { Expander, MarkWarning } from '@polkadot/react-components';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

interface Props {
  accountId?: string | null;
  className?: string;
  extrinsic?: SubmittableExtrinsic | null;
  onChange?: (hasAvailable: boolean) => void;
  tip?: BN;
}

function PaymentInfo ({ accountId, className = '', extrinsic }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const [dispatchInfo, setDispatchInfo] = useState<RuntimeDispatchInfo | null>(null);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountId]);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    accountId && extrinsic && isFunction(extrinsic.paymentInfo) && isFunction(api.rpc.payment?.queryInfo) &&
      setTimeout((): void => {
        try {
          extrinsic
            .paymentInfo(accountId)
            .then((info) => mountedRef.current && setDispatchInfo(info))
            .catch(console.error);
        } catch (error) {
          console.error(error);
        }
      }, 0);
  }, [api, accountId, extrinsic, mountedRef]);

  if (!dispatchInfo || !extrinsic) {
    return null;
  }

  const isFeeError = api.consts.balances && !api.tx.balances?.transfer.is(extrinsic) && balances?.accountId.eq(accountId) && (
    balances.availableBalance.lte(dispatchInfo.partialFee) ||
    balances.freeBalance.sub(dispatchInfo.partialFee).lte(api.consts.balances.existentialDeposit)
  );

  return (
    <>
      <Expander
        className={className}
        summary={
          <Trans i18nKey='feesForSubmission'>
            Fees of <span className='highlight'>{
              dispatchInfo.partialFee.gt(new BN(1000000000)) ? (parseFloat(dispatchInfo.partialFee.toString()) / Math.pow(10, 15)).toString() : (parseFloat(dispatchInfo.partialFee.toString()) / Math.pow(10, 15)).toFixed(15)
            } testUNQ</span> will be applied to the submission
          </Trans>
        }
      />
      {isFeeError && (
        <MarkWarning content={'The account does not have enough free funds (excluding locked/bonded/reserved) available to cover the transaction fees without dropping the balance below the account existential amount.'} />
      )}
    </>
  );
}

export default React.memo(PaymentInfo);
