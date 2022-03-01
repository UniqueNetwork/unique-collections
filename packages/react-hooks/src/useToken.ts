// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useCallback, useContext } from 'react';

import { StatusContext } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks/useApi';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import { normalizeAccountId } from './utils';

export interface TokenDetailsInterface {
  owner?: { Ethereum?: string, Substrate?: string };
  constData?: string;
  variableData?: string;
}

interface UseTokenInterface {
  calculateCreateItemFee: (obj: { account: string, collectionId: string, constData: string, variableData: string, owner: string }) => Promise<BN | null>;
  createNft: (obj: { account: string, collectionId: string, constData: string, variableData: string, successCallback?: () => void, errorCallback?: () => void, owner: string }) => void;
  getDetailedReFungibleTokenInfo: (collectionId: string, tokenId: string) => Promise<TokenDetailsInterface>;
  getDetailedTokenInfo: (collectionId: string, tokenId: string) => Promise<TokenDetailsInterface>
  getTokenInfo: (collectionInfo: NftCollectionInterface, tokenId: string) => Promise<TokenDetailsInterface>;
  setVariableMetadata: (obj: { account: string, collectionId: string, variableData: string, successCallback?: () => void, errorCallback?: () => void, tokenId: string }) => void;
}

export function useToken (): UseTokenInterface {
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);

  const calculateCreateItemFee = useCallback(async ({ account, collectionId, constData, owner, variableData }: { account: string, collectionId: string, constData: string, owner: string, variableData: string }): Promise<BN | null> => {
    try {
      const fee = await api.tx.unique.createItem(collectionId, { Substrate: owner }, {
        nft: {
          const_data: constData,
          variable_data: variableData
        }
      }).paymentInfo(account) as { partialFee: BN };

      return fee.partialFee;
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  }, [api]);

  const createNft = useCallback((
    { account, collectionId, constData, errorCallback, owner, successCallback, variableData }:
    { account: string, collectionId: string, constData: string, variableData: string, successCallback?: () => void, errorCallback?: () => void, owner: string }) => {
    const transaction = api.tx.unique.createItem(collectionId, { Substrate: owner }, { nft: { const_data: constData, variable_data: variableData } });

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => { console.log('create nft fail'); errorCallback && errorCallback(); },
      txStartCb: () => { console.log('create nft start'); },
      txSuccessCb: () => { console.log('create nft success'); successCallback && successCallback(); },
      txUpdateCb: () => { console.log('create nft update'); }
    });
  }, [api, queueExtrinsic]);

  const setVariableMetadata = useCallback((
    { account, collectionId, errorCallback, successCallback, tokenId, variableData }:
    { account: string, collectionId: string, variableData: string, successCallback?: () => void, errorCallback?: () => void, tokenId: string }) => {
    const transaction = api.tx.unique.setVariableMetaData(collectionId, tokenId, variableData);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => { console.log('set variable metadata fail'); errorCallback && errorCallback(); },
      txStartCb: () => { console.log('set variable metadata start'); },
      txSuccessCb: () => { console.log('set variable metadata success'); successCallback && successCallback(); },
      txUpdateCb: () => { console.log('set variable metadata update'); }
    });
  }, [api, queueExtrinsic]);

  const getDetailedTokenInfo = useCallback(async (collectionId: string, tokenId: string): Promise<TokenDetailsInterface> => {
    if (!api) {
      return {};
    }

    try {
      let tokenInfo: TokenDetailsInterface = {};

      const variableData = (await api.rpc.unique.variableMetadata(collectionId, tokenId)).toJSON() as string;
      const constData: string = (await api.rpc.unique.constMetadata(collectionId, tokenId)).toString() as string;
      const crossAccount = normalizeAccountId((await api.rpc.unique.tokenOwner(collectionId, tokenId)).toJSON() as string) as { Substrate: string };

      tokenInfo = {
        constData,
        owner: crossAccount,
        variableData
      };

      console.log('tokenInfo.toJSON()', tokenInfo);

      return tokenInfo;
    } catch (e) {
      console.log('getDetailedTokenInfo error', e);

      return {};
    }
  }, [api]);

  const getDetailedReFungibleTokenInfo = useCallback(async (collectionId: string, tokenId: string): Promise<TokenDetailsInterface> => {
    if (!api) {
      return {};
    }

    try {
      // in old version reFungibleItemList
      return (await api.query.unique.nftItemList(collectionId, tokenId) as unknown as TokenDetailsInterface);
    } catch (e) {
      console.log('getDetailedReFungibleTokenInfo error', e);

      return {};
    }
  }, [api]);

  const getTokenInfo = useCallback(async (collectionInfo: NftCollectionInterface, tokenId: string): Promise<TokenDetailsInterface> => {
    let tokenDetailsData: TokenDetailsInterface = {};

    if (tokenId && collectionInfo) {
      tokenDetailsData = await getDetailedTokenInfo(collectionInfo.id, tokenId);
    }

    return tokenDetailsData;
  }, [getDetailedTokenInfo]);

  return {
    calculateCreateItemFee,
    createNft,
    getDetailedReFungibleTokenInfo,
    getDetailedTokenInfo,
    getTokenInfo,
    setVariableMetadata
  };
}
