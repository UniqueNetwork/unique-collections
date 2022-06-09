// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useCallback, useContext } from 'react';

import { StatusContext } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks/useApi';

export interface TokenDetailsInterface {
  owner?: { Ethereum?: string, Substrate?: string };
  properties: [
    { key: '_old_constData', value: string }
  ]
}

interface UseTokenInterface {
  calculateCreateItemFee: (obj: { account: string, collectionId: string, constData: string, variableData: string, owner: string }) => Promise<BN | null>;
  createNft: (obj: { account: string, collectionId: string, constData: string, variableData: string, successCallback?: () => void, errorCallback?: () => void, owner: string }) => void;
  getDetailedTokenInfo: (collectionId: string, tokenId: string) => Promise<TokenDetailsInterface | null>;
}

export function useToken (): UseTokenInterface {
  const { api } = useApi();
  const { queueAction, queueExtrinsic } = useContext(StatusContext);

  const calculateCreateItemFee = useCallback(async ({ account, collectionId, constData, owner }: { account: string, collectionId: string, constData: string, owner: string }): Promise<BN | null> => {
    try {
      const fee = await api.tx.unique.createItem(collectionId, { Substrate: owner }, {
        nft: {
          properties: [{ key: '_old_constData', value: constData }]
        }
      }).paymentInfo(account) as { partialFee: BN };

      return fee.partialFee;
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  }, [api]);

  const createNft = useCallback((
    { account, collectionId, constData, errorCallback, owner, successCallback }:
    { account: string, collectionId: string, constData: string, successCallback?: () => void, errorCallback?: () => void, owner: string }) => {
    const transaction = api.tx.unique.createItem(collectionId, { Substrate: owner }, { nft: { properties: [{ key: '_old_constData', value: constData }] } });

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('create nft fail'); errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('create nft start');
      },
      txSuccessCb: () => {
        successCallback && successCallback();

        queueAction({
          action: 'Custom. Create NFT',
          message: 'NFT successfully created',
          status: 'success'
        });
      },
      txUpdateCb: () => {
        console.log('create nft update');
      }
    });
  }, [api, queueAction, queueExtrinsic]);

  const getDetailedTokenInfo = useCallback(async (collectionId: string, tokenId: string): Promise<TokenDetailsInterface | null> => {
    if (!api) {
      return null;
    }

    try {
      const tokenInfo = (await api.rpc.unique.tokenData(collectionId, tokenId)).toHuman() as TokenDetailsInterface;

      console.log('tokenInfo', tokenInfo);

      return tokenInfo;
    } catch (e) {
      console.log('getDetailedTokenInfo error', e);

      return null;
    }
  }, [api]);

  return {
    calculateCreateItemFee,
    createNft,
    getDetailedTokenInfo
  };
}
