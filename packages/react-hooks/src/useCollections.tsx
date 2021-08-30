// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';
import type { ErrorType } from '@polkadot/react-hooks/useFetch';
import type { TokenDetailsInterface } from '@polkadot/react-hooks/useToken';

import BN from 'bn.js';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Filters } from '@polkadot/app-nft-market/containers/NftMarket';
import envConfig from '@polkadot/apps-config/envConfig';
import { useApi, useCollection, useFetch } from '@polkadot/react-hooks';
import { base64Decode, encodeAddress } from '@polkadot/util-crypto';

const { canAddCollections, uniqueApi, uniqueCollectionIds } = envConfig;

export type MetadataType = {
  metadata?: string;
}

export interface TokenInterface extends TokenDetailsInterface {
  collectionId: string;
  id: string;
}

export type OfferType = {
  collectionId: number;
  price: BN;
  seller: string;
  tokenId: string;
  metadata: any;
}

export type OffersResponseType = {
  items: OfferType[];
  itemsCount: number;
  page: number;
  pageSize: number;
}

export type HoldType = {
  collectionId: number;
  tokenId: string;
  owner: string;
}

export type HoldResponseType = {
  items: HoldType[];
  itemsCount: number;
  page: number;
  pageSize: number;
}

export type TradeType = {
  buyer?: string;
  collectionId: number;
  metadata: string
  price: string;
  quoteId: number;
  seller: string;
  tradeDate: string; // 2021-03-25T08:50:49.622992
  tokenId: number;
}

export type TradesResponseType = {
  items: TradeType[];
  itemsCount: number;
  page: number;
  pageSize: number;
}

export type CollectionWithTokensCount = { info: NftCollectionInterface, tokenCount: number };

export function useCollections () {
  const { api } = useApi();
  const { fetchData } = useFetch();
  const [error, setError] = useState<ErrorType>();
  const [offers, setOffers] = useState<{ [key: string]: OfferType }>({});
  const [myHold, setMyHold] = useState<{ [key: string]: HoldType[] }>({});
  const [offersLoading, setOffersLoading] = useState<boolean>(false);
  const [holdLoading, setHoldLoading] = useState<boolean>(false);
  const [offersCount, setOffersCount] = useState<number>();
  const [trades, setTrades] = useState<TradeType[]>();
  const [tradesLoading, setTradesLoading] = useState<boolean>(false);
  const [myTrades, setMyTrades] = useState<TradeType[]>();
  const cleanup = useRef<boolean>(false);
  const { getDetailedCollectionInfo } = useCollection();

  const getTokensOfCollection = useCallback(async (collectionId: string, ownerId: string) => {
    if (!api || !collectionId || !ownerId) {
      return [];
    }

    try {
      return await api.query.nft.addressTokens(collectionId, ownerId);
    } catch (e) {
      console.log('getTokensOfCollection error', e);
    }

    return [];
  }, [api]);

  /**
   * Return the list of token sale offers
   */
  const getOffers = useCallback((page: number, pageSize: number, filters?: Filters) => {
    try {
      let url = `${uniqueApi}/offers?page=${page}&pageSize=${pageSize}`;

      // reset offers before loading first page
      if (page === 1) {
        setOffers({});
      }

      if (filters) {
        Object.keys(filters).forEach((filterKey: string) => {
          const currentFilter: string | string[] | number = filters[filterKey];

          if (Array.isArray(currentFilter)) {
            if (filterKey === 'collectionIds') {
              if (!currentFilter?.length) {
                url = `${url}${envConfig.uniqueCollectionIds.map((item: string) => `&collectionId=${item}`).join('')}`;
              } else {
                url = `${url}${currentFilter.map((item: string) => `&collectionId=${item}`).join('')}`;
              }
            } else if (filterKey === 'traitsCount') {
              url = `${url}${currentFilter.map((item: string) => `&traitsCount=${item}`).join('')}`;
            }
          } else {
            url += `&${filterKey}=${currentFilter}`;
          }
        });
      }

      fetchData<OffersResponseType>(url).subscribe((result: OffersResponseType | ErrorType) => {
        if (cleanup.current) {
          setOffersLoading(false);

          return;
        }

        if ('error' in result) {
          setError(result);
        } else {
          if (result) {
            setOffersCount(result.itemsCount);

            if (result.itemsCount === 0) {
              setOffers({});
            } else if (result.items.length) {
              setOffers((prevState: {[key: string]: OfferType}) => {
                const newState = { ...prevState };

                result.items.forEach((offer: OfferType) => {
                  if (!newState[`${offer.collectionId}-${offer.tokenId}`]) {
                    newState[`${offer.collectionId}-${offer.tokenId}`] = { ...offer, seller: encodeAddress(base64Decode(offer.seller)) };
                  }
                });

                return newState;
              });
            }
          }
        }

        setOffersLoading(false);
      });
    } catch (e) {
      console.log('getOffers error', e);
      setOffersLoading(false);
    }
  }, [fetchData]);

  /**
   * Return the list of token were hold on the escrow
   */
  const getHoldByMe = useCallback((account: string, page: number, pageSize: number, collectionIds?: string[]) => {
    try {
      let url = `${uniqueApi}/OnHold/${account}?page=${page}&pageSize=${pageSize}`;

      if (!canAddCollections && collectionIds && collectionIds.length) {
        url = `${url}${collectionIds.map((item: string) => `&collectionId=${item}`).join('')}`;
      }

      setHoldLoading(true);
      fetchData<HoldResponseType>(url).subscribe((result: HoldResponseType | ErrorType) => {
        if (cleanup.current) {
          setHoldLoading(false);

          return;
        }

        if ('error' in result) {
          setError(result);
          setMyHold({});
        } else {
          if (result?.items.length) {
            const newState: { [key: string]: HoldType[] } = {};

            result.items.forEach((hold: HoldType) => {
              if (!newState[hold.collectionId]) {
                newState[hold.collectionId] = [];
              }

              if (!newState[hold.collectionId].find((holdItem) => holdItem.tokenId === hold.tokenId)) {
                newState[hold.collectionId].push(hold);
              }
            });

            setMyHold(newState);
          } else {
            setMyHold({});
          }
        }

        setHoldLoading(false);
      });
    } catch (e) {
      console.log('getOffers error', e);
      setHoldLoading(false);
    }
  }, [fetchData]);

  /**
   * Return the list of token trades
   */
  const getTrades = useCallback(({ account,
    collectionIds,
    page,
    pageSize }: { account?: string, collectionIds?: string[], page: number, pageSize: number }) => {
    try {
      let url = `${uniqueApi}/trades`;

      if (account && account.length) {
        url = `${url}/${account}`;
      }

      url = `${url}?page=${page}&pageSize=${pageSize}`;

      if (!canAddCollections && collectionIds && collectionIds.length) {
        url = `${url}${collectionIds.map((item: string) => `&collectionId=${item}`).join('')}`;
      }

      setTradesLoading(true);
      fetchData<TradesResponseType>(url).subscribe((result: TradesResponseType | ErrorType) => {
        if (cleanup.current) {
          setTradesLoading(false);

          return;
        }

        if ('error' in result) {
          setError(result);
        } else {
          if (!account || !account.length) {
            setTrades(result.items);
          } else {
            setMyTrades(result.items);
          }
        }

        setTradesLoading(false);
      });
    } catch (e) {
      console.log('getTrades error', e);
      setTradesLoading(false);
    }
  }, [fetchData]);

  const presetTokensCollections = useCallback(async (): Promise<NftCollectionInterface[]> => {
    if (!api) {
      return [];
    }

    try {
      const createdCollectionCount = (await api.query.nft.createdCollectionCount() as unknown as BN).toNumber();
      const destroyedCollectionCount = (await api.query.nft.destroyedCollectionCount() as unknown as BN).toNumber();
      const collectionsCount = createdCollectionCount - destroyedCollectionCount;
      const collections: Array<NftCollectionInterface> = [];

      for (let i = 1; i <= collectionsCount; i++) {
        const collectionInf = await getDetailedCollectionInfo(i.toString()) as unknown as NftCollectionInterface;

        if (cleanup.current) {
          return [];
        }

        if (collectionInf && collectionInf.Owner && collectionInf.Owner.toString() !== '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM') {
          collections.push({ ...collectionInf, id: i.toString() });
        }
      }

      return collections;
    } catch (e) {
      console.log('preset tokens collections error', e);

      return [];
    }
  }, [api, getDetailedCollectionInfo]);

  const getCollectionWithTokenCount = useCallback(async (collectionId: string): Promise<CollectionWithTokensCount> => {
    const info = (await getDetailedCollectionInfo(collectionId)) as unknown as NftCollectionInterface;
    const tokenCount = ((await api.query.nft.itemListIndex(collectionId)) as unknown as BN).toNumber();

    return {
      info,
      tokenCount
    };
  }, [api.query.nft, getDetailedCollectionInfo]);

  /* const getAllCollectionsWithTokenCount = useCallback(async () => {
    const createdCollectionCount = (await api.query.nft.createdCollectionCount() as unknown as BN).toNumber();
    const destroyedCollectionCount = (await api.query.nft.destroyedCollectionCount() as unknown as BN).toNumber();
    const collectionsCount = createdCollectionCount - destroyedCollectionCount;
    const collectionWithTokensCount: { [key: string]: CollectionWithTokensCount } = {};

    for (let i = 1; i <= collectionsCount; i++) {
      collectionWithTokensCount[i] = await getCollectionWithTokenCount(i.toString());
    }

    return collectionWithTokensCount;
  }, [api.query.nft, getCollectionWithTokenCount]); */

  const presetCollections = useCallback(async (): Promise<NftCollectionInterface[]> => {
    try {
      const collections: Array<NftCollectionInterface> = canAddCollections ? JSON.parse(localStorage.getItem('tokenCollections') || '[]') as NftCollectionInterface[] : [];

      if (uniqueCollectionIds && uniqueCollectionIds.length) {
        for (let i = 0; i < uniqueCollectionIds.length; i++) {
          const mintCollectionInfo = await getDetailedCollectionInfo(uniqueCollectionIds[i]) as unknown as NftCollectionInterface;

          if (cleanup.current) {
            return [];
          }

          if (mintCollectionInfo && mintCollectionInfo.Owner && mintCollectionInfo.Owner.toString() !== '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM' && !collections.find((collection) => collection.id === uniqueCollectionIds[i])) {
            collections.push({ ...mintCollectionInfo, id: uniqueCollectionIds[i] });
          }
        }

        localStorage.setItem('tokenCollections', JSON.stringify(collections));
      }

      return collections;
    } catch (e) {
      console.log('presetTokensCollections error', e);

      return [];
    }
  }, [getDetailedCollectionInfo]);

  useEffect(() => {
    return () => {
      cleanup.current = true;
    };
  }, []);

  return {
    error,
    getCollectionWithTokenCount,
    getDetailedCollectionInfo,
    getHoldByMe,
    getOffers,
    getTokensOfCollection,
    getTrades,
    holdLoading,
    myHold,
    myTrades,
    offers,
    offersCount,
    offersLoading,
    presetCollections,
    presetTokensCollections,
    trades,
    tradesLoading
  };
}
