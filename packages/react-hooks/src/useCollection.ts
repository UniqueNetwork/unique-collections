// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@unique-nft/types/definitions';

import BN from 'bn.js';
import omit from 'lodash/omit';
import { useCallback, useContext } from 'react';

import { SubmittableResult } from '@polkadot/api';
import { StatusContext } from '@polkadot/react-components';
import { ProtobufAttributeType } from '@polkadot/react-components/util/protobufUtils';
import { useApi } from '@polkadot/react-hooks/useApi';
import { useDecoder } from '@polkadot/react-hooks/useDecoder';
import { strToUTF16 } from '@polkadot/react-hooks/utils';
import { formatBalance } from '@polkadot/util';

export type SchemaVersionTypes = 'Custom' | 'ImageURL' | 'TokenURI' | 'Unique';

// { key: '_old_offchainSchema', value: '' },
// { key: '_old_schemaVersion', value: 'Unique' },
// { key: '_old_variableOnChainSchema', value: '' },
// { key: '_old_constOnChainSchema', value: JSON.stringify(protobufJson) }
export interface CollectionProperty {
  key: string;
  value: string;
}
//  key: '_old_constData', permission: { collectionAdmin: true, mutable: false, tokenOwner: false }
export interface PropertyPermission {
  collectionAdmin: boolean;
  mutable: boolean;
  tokenOwner: boolean;
}

export interface CollectionPropertyPermission {
  key: string;
  permission: PropertyPermission;
}

export interface CollectionPermissions {
  access?: 'Normal' | 'WhiteList'
  mintMode?: boolean;
  nesting?: {
    owner: string | null,
  };
}

export interface NftCollectionBase {
  description: number[];
  mode: {
    nft?: null;
    fungible?: null;
    reFungible?: null;
    invalid?: null;
  };
  name: number[];
  tokenPrefix: number[];
  sponsorship?: {
    confirmed?: string;
    disabled?: string | null;
    unconfirmed?: string | null;
  };
  limits?: {
    accountTokenOwnershipLimit?: number;
    sponsoredDataSize?: number;
    sponsoredDataRateLimit?: number;
    sponsoredMintSize?: number;
    tokenLimit?: number;
    sponsorTimeout?: number;
    ownerCanTransfer?: boolean;
    ownerCanDestroy?: boolean;
  },
  permissions?: CollectionPermissions;
  properties: CollectionProperty[];
  tokenPropertyPermissions: CollectionPropertyPermission[];
}

export interface NftCollectionInterface extends NftCollectionBase {
  id: string;
  owner?: string;
}

interface TransactionCallBacks {
  onFailed?: (result: SubmittableResult | null) => void;
  onStart?: () => void;
  onSuccess?: (result: SubmittableResult) => void;
  onUpdate?: () => void;
}

export interface CreateCollectionEx extends NftCollectionBase {
  access?: string // AllowList
  account: string;
}

export function useCollection () {
  const { api } = useApi();
  const { queueAction, queueExtrinsic } = useContext(StatusContext);

  const getCollectionTokensCount = useCallback(async (collectionId: string): Promise<number> => {
    if (!api || !collectionId) {
      return 0;
    }

    try {
      return (await api.rpc.unique.lastTokenId(collectionId)).toJSON() as number;
    } catch (e) {
      console.log('getCollectionTokensCount error', e);
    }

    return 0;
  }, [api]);

  const getCreatedCollectionCount = useCallback(async (): Promise<number> => {
    try {
      return (await api.rpc.unique.collectionStats()).created.toNumber() as number;
    } catch (e) {
      console.log('getCreatedCollectionCount error', e);
    }

    return 0;
  }, [api]);

  const calculateCreateCollectionFee = useCallback(async ({ account, description, modeprm, name, tokenPrefix }: { account: string, name: string, description: string, tokenPrefix: string, modeprm: { nft?: null, fungible?: null, refungible?: null, invalid?: null }}): Promise<BN | null> => {
    try {
      const fee = (await api.tx.unique.createCollection(strToUTF16(name), strToUTF16(description), strToUTF16(tokenPrefix), modeprm).paymentInfo(account) as { partialFee: BN }).partialFee;
      const collectionCreationPrice = api.consts.common.collectionCreationPrice as unknown as BN;
      const createCollectionChainFee = collectionCreationPrice || new BN(100).mul(new BN(10).pow(new BN(formatBalance.getDefaults().decimals)));

      return fee.add(createCollectionChainFee);
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  }, [api]);

  const createCollection = useCallback((account: string, { description, modeprm, name, tokenPrefix }: { name: string, description: string, tokenPrefix: string, modeprm: { nft?: null, fungible?: null, refungible?: null, invalid?: null }}, callBacks?: TransactionCallBacks) => {
    const transaction = api.tx.unique.createCollection(strToUTF16(name), strToUTF16(description), strToUTF16(tokenPrefix), modeprm);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: (res) => {
        callBacks?.onFailed && callBacks.onFailed(res);

        queueAction({
          action: 'Custom. Create collection',
          message: 'Collection creation failed',
          status: 'error'
        });

        console.log('create collection failed');
      },
      txStartCb: () => {
        callBacks?.onStart && callBacks.onStart();
      },
      txSuccessCb: (result: SubmittableResult) => {
        callBacks?.onSuccess && callBacks.onSuccess(result);

        queueAction({
          action: 'Custom. Create collection',
          message: 'Collection successfully created',
          status: 'success'
        });

        console.log('create collection success');
      },
      txUpdateCb: () => {
        callBacks?.onUpdate && callBacks.onUpdate();

        console.log('create collection update');
      }
    });
  }, [api, queueAction, queueExtrinsic]);

  const setCollectionSponsor = useCallback(({ account, collectionId, errorCallback, newSponsor, successCallback }: { account: string, collectionId: string, newSponsor: string, successCallback?: () => void, errorCallback?: () => void }) => {
    const transaction = api.tx.unique.setCollectionSponsor(collectionId, newSponsor);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('set collection sponsor fail'); errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('set collection sponsor start');
      },
      txSuccessCb: () => {
        console.log('set collection sponsor success'); successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('set collection sponsor update');
      }
    });
  }, [api, queueExtrinsic]);

  const removeCollectionSponsor = useCallback(({ account, collectionId, errorCallback, successCallback }: { account: string, collectionId: string, successCallback?: () => void, errorCallback?: () => void }) => {
    const transaction = api.tx.unique.removeCollectionSponsor(collectionId);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('remove collection sponsor fail'); errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('remove collection sponsor start');
      },
      txSuccessCb: () => {
        console.log('remove collection sponsor success'); successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('remove collection sponsor update');
      }
    });
  }, [api, queueExtrinsic]);

  const confirmSponsorship = useCallback(({ account, collectionId, errorCallback, successCallback }: { account: string, collectionId: string, successCallback?: () => void, errorCallback?: () => void }) => {
    const transaction = api.tx.unique.confirmSponsorship(collectionId);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('confirm sponsorship fail'); errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('confirm sponsorship start');
      },
      txSuccessCb: () => {
        console.log('confirm sponsorship success'); successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('confirm sponsorship update');
      }
    });
  }, [api, queueExtrinsic]);

  const getCollectionAdminList = useCallback(async (collectionId: string): Promise<string[]> => {
    if (!api || !collectionId) {
      return [];
    }

    try {
      return (await api.rpc.unique.adminlist(collectionId)).toHuman() as string[];
    } catch (e) {
      console.log('getCollectionAdminList error', e);
    }

    return [];
  }, [api]);

  const addCollectionAdmin = useCallback(({ account, collectionId, errorCallback, newAdminAddress, successCallback }: { account: string, collectionId: string, newAdminAddress: string, successCallback?: () => void, errorCallback?: () => void }) => {
    const transaction = api.tx.unique.addCollectionAdmin(collectionId, newAdminAddress);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('add collection admin fail'); errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('add collection admin start');
      },
      txSuccessCb: () => {
        console.log('add collection admin success'); successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('add collection admin update');
      }
    });
  }, [api, queueExtrinsic]);

  const removeCollectionAdmin = useCallback(({ account, adminAddress, collectionId, errorCallback, successCallback }: { account: string, collectionId: string, adminAddress: string, successCallback?: () => void, errorCallback?: () => void }) => {
    const transaction = api.tx.unique.removeCollectionAdmin(collectionId, adminAddress);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('remove collection admin fail'); errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('remove collection admin start');
      },
      txSuccessCb: () => {
        console.log('remove collection admin success'); successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('remove collection admin update');
      }
    });
  }, [api, queueExtrinsic]);

  const calculateSetConstOnChainSchemaFees = useCallback(async ({ account, collectionId, schema }: { account: string, schema: string, collectionId: string }): Promise<BN | null> => {
    try {
      const fee = await api.tx.unique.setConstOnChainSchema(collectionId, schema).paymentInfo(account) as { partialFee: BN };

      return fee.partialFee;
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  }, [api]);

  const saveConstOnChainSchema = useCallback(({ account, collectionId, errorCallback, schema, successCallback }: { account: string, collectionId: string, schema: string, successCallback?: () => void, errorCallback?: () => void }) => {
    const transaction = api.tx.unique.setConstOnChainSchema(collectionId, schema);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('set collection constOnChain fail');

        queueAction({
          action: 'Custom. Attributes',
          message: 'Setting attributes failed',
          status: 'error'
        });

        errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('set collection constOnChain start');
      },
      txSuccessCb: () => {
        console.log('set collection constOnChain success');

        queueAction({
          action: 'Custom. Attributes',
          message: 'Attributes successfully set',
          status: 'success'
        });

        successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('set collection constOnChain update');
      }
    });
  }, [api.tx.unique, queueAction, queueExtrinsic]);

  const calculateSetCollectionPropertiesFees = useCallback(async ({ account, collectionId, properties }: { account: string, properties: CollectionProperty[], collectionId: string }): Promise<BN | null> => {
    try {
      const fee = await api?.tx.unique.setCollectionProperties(collectionId, properties).paymentInfo(account) as { partialFee: BN };

      return fee.partialFee;
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  }, [api]);

  const setCollectionProperties = useCallback(({ account, collectionId, errorCallback, properties, successCallback }: { account: string, collectionId: string, properties: CollectionProperty[], successCallback?: () => void, errorCallback?: () => void }) => {
    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: api?.tx.unique.setCollectionProperties(collectionId, properties),
      isUnsigned: false,
      txFailedCb: () => {
        console.log('set collection properties fail');

        queueAction({
          action: 'Custom. Cover image',
          message: 'Setting cover image failed',
          status: 'error'
        });

        errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('set collection properties start');
      },
      txSuccessCb: () => {
        console.log('set collection properties success');

        queueAction({
          action: 'Custom. Cover image',
          message: 'Cover image successfully set',
          status: 'success'
        });

        successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('set collection properties update');
      }
    });
  }, [api, queueAction, queueExtrinsic]);

  const destroyCollection = useCallback(({ account, collectionId, errorCallback, successCallback }: { account: string, collectionId: string, successCallback?: () => void, errorCallback?: () => void }) => {
    const transaction = api.tx.unique.destroyCollection(collectionId);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('set collection varOnChain fail'); errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('set collection varOnChain start');
      },
      txSuccessCb: () => {
        console.log('set collection varOnChain success'); successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('set collection varOnChain update');
      }
    });
  }, [api, queueExtrinsic]);

  const getDetailedCollectionInfo = useCallback(async (collectionId: string): Promise<NftCollectionInterface | null> => {
    if (!api) {
      return null;
    }

    try {
      const collectionInfo = (await api.rpc.unique.collectionById(collectionId)).toHuman() as unknown as NftCollectionInterface | null;

      if (collectionInfo) {
        return {
          ...collectionInfo,
          id: collectionId
        };
      }

      return null;
    } catch (e) {
      console.log('getDetailedCollectionInfo error', e);
    }

    return null;
  }, [api]);

  const getCollectionPropertyValueByKey = useCallback((collectionInfo: NftCollectionInterface, key: string) => {
    return collectionInfo?.properties.find((property) => property.key === key)?.value;
  }, []);

  const getCollectionOnChainSchema = useCallback((collectionInfo: NftCollectionInterface): { constSchema: ProtobufAttributeType | undefined, variableSchema: { collectionCover: string } | undefined } => {
    const result: {
      constSchema: ProtobufAttributeType | undefined,
      variableSchema: { collectionCover: string } | undefined
    } = {
      constSchema: undefined,
      variableSchema: undefined
    };

    try {
      const constSchema = getCollectionPropertyValueByKey(collectionInfo, '_old_constOnChainSchema');
      const varSchema = getCollectionPropertyValueByKey(collectionInfo, '_old_variableOnChainSchema');

      if (constSchema && constSchema.length) {
        result.constSchema = JSON.parse(constSchema) as ProtobufAttributeType;
      }

      if (varSchema && varSchema.length) {
        result.variableSchema = JSON.parse(varSchema) as { collectionCover: string } | undefined;
      }

      console.log('result', result);

      return result;
    } catch (e) {
      console.log('getCollectionOnChainSchema error');
    }

    return result;
  }, [getCollectionPropertyValueByKey]);

  const calculateCreateCollectionExFee = useCallback(async ({ account, description, limits, mode, name, permissions, properties, tokenPrefix, tokenPropertyPermissions }: CreateCollectionEx): Promise<BN | null> => {
    const newTokenLimits = !limits?.tokenLimit ? omit(limits, 'tokenLimit') : { ...limits };

    try {
      const extrinsic = api?.tx.unique.createCollectionEx({
        description,
        limits: newTokenLimits,
        mode,
        name,
        permissions,
        properties,
        tokenPrefix,
        tokenPropertyPermissions
      });
      const fee = (await extrinsic.paymentInfo(account) as { partialFee: BN }).partialFee;
      const collectionCreationPrice = api.consts.common.collectionCreationPrice as unknown as BN;
      const createCollectionChainFee = collectionCreationPrice || new BN(100).mul(new BN(10).pow(new BN(formatBalance.getDefaults().decimals)));

      return fee.add(createCollectionChainFee);
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  }, [api]);

  const createCollectionEx = useCallback(({ account, description, limits, mode, name, permissions, properties, tokenPrefix, tokenPropertyPermissions }: CreateCollectionEx, callBacks?: TransactionCallBacks) => {
    const newTokenLimits = !limits?.tokenLimit ? omit(limits, 'tokenLimit') : { ...limits };

    const extrinsic = api.tx.unique.createCollectionEx({
      description,
      limits: newTokenLimits,
      mode,
      name,
      permissions,
      properties,
      tokenPrefix,
      tokenPropertyPermissions
    });

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: extrinsic,
      isUnsigned: false,
      txFailedCb: (result: SubmittableResult | null) => {
        callBacks?.onFailed && callBacks.onFailed(result);

        queueAction({
          action: 'Custom. Create collection',
          message: 'Collection creation failed',
          status: 'error'
        });

        console.log('create collection failed');
      },
      txStartCb: () => {
        callBacks?.onStart && callBacks.onStart();
      },
      txSuccessCb: (result: SubmittableResult) => {
        callBacks?.onSuccess && callBacks.onSuccess(result);

        queueAction({
          action: 'Custom. Create collection',
          message: 'Collection successfully created',
          status: 'success'
        });

        console.log('create collection success', result);
      },
      txUpdateCb: () => {
        callBacks?.onUpdate && callBacks.onUpdate();

        console.log('create collection update');
      }
    });
  }, [api, queueAction, queueExtrinsic]);

  return {
    addCollectionAdmin,
    calculateCreateCollectionExFee,
    calculateCreateCollectionFee,
    calculateSetCollectionPropertiesFees,
    calculateSetConstOnChainSchemaFees,
    confirmSponsorship,
    createCollection,
    createCollectionEx,
    destroyCollection,
    getCollectionAdminList,
    getCollectionOnChainSchema,
    getCollectionPropertyValueByKey,
    getCollectionTokensCount,
    getCreatedCollectionCount,
    getDetailedCollectionInfo,
    removeCollectionAdmin,
    removeCollectionSponsor,
    saveConstOnChainSchema,
    setCollectionProperties,
    setCollectionSponsor
  };
}
