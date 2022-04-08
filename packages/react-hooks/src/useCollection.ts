// Copyright 2017-2022 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useCallback, useContext } from 'react';

import { SubmittableResult } from '@polkadot/api';
import { StatusContext } from '@polkadot/react-components';
import { ProtobufAttributeType } from '@polkadot/react-components/util/protobufUtils';
import { useApi } from '@polkadot/react-hooks/useApi';
import { useDecoder } from '@polkadot/react-hooks/useDecoder';
import { strToUTF16 } from '@polkadot/react-hooks/utils';
import { formatBalance } from '@polkadot/util';

export type SchemaVersionTypes = 'Custom' | 'ImageURL' | 'TokenURI' | 'Unique';

export interface NftCollectionInterface {
  access?: 'Normal' | 'WhiteList'
  id: string;
  decimalPoints: BN | number;
  description: number[];
  tokenPrefix: string;
  mintMode?: boolean;
  mode: {
    nft: null;
    fungible: null;
    reFungible: null;
    invalid: null;
  };
  name: number[];
  offchainSchema: string;
  owner?: string;
  schemaVersion: SchemaVersionTypes;
  sponsorship: {
    confirmed?: string;
    disabled?: string | null;
    unconfirmed?: string | null;
  };
  limits?: {
    accountTokenOwnershipLimit: string;
    sponsoredDataSize: string;
    sponsoredDataRateLimit: string;
    sponsoredMintSize: string;
    tokenLimit: string;
    sponsorTimeout: string;
    ownerCanTransfer: boolean;
    ownerCanDestroy: boolean;
  },
  variableOnChainSchema: string;
  constOnChainSchema: string;
}

interface TransactionCallBacks {
  onFailed?: (result: SubmittableResult | null) => void;
  onStart?: () => void;
  onSuccess?: (result: SubmittableResult) => void;
  onUpdate?: () => void;
}

export interface CreateCollectionEx {
  access?: string // AllowList
  account: string;
  description: number[];
  mode: { Fungible: 8 } | { nft: null };
  name: number[];
  tokenPrefix: number[];
  offchainSchema?: string;
  schemaVersion: SchemaVersionTypes;
  pendingSponsor?: string;
  limits: {
    ownerCanTransfer?: boolean;
    ownerCanDestroy?: boolean;
    tokenLimit?: string;
  },
  variableOnChainSchema?: string;
  constOnChainSchema: string;
  metaUpdatePermission?: string; // 'Admin'
}

export function useCollection () {
  const { api } = useApi();
  const { queueAction, queueExtrinsic } = useContext(StatusContext);
  const { hex2a } = useDecoder();

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
      return (await api.rpc.unique.collectionStats()).created.toNumber();
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

  const calculateSetSchemaVersionFee = useCallback(async ({ account, collectionId, schemaVersion }: { account: string, schemaVersion: SchemaVersionTypes, collectionId: string }): Promise<BN | null> => {
    try {
      const fee = await api.tx.unique.setSchemaVersion(collectionId, schemaVersion).paymentInfo(account) as { partialFee: BN };

      return fee.partialFee;
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  }, [api]);

  const setSchemaVersion = useCallback(({ account, collectionId, errorCallback, schemaVersion, successCallback }: { account: string, schemaVersion: SchemaVersionTypes, collectionId: string, successCallback?: () => void, errorCallback?: () => void }) => {
    const transaction = api.tx.unique.setSchemaVersion(collectionId, schemaVersion);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('set schema version fail'); errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('set schema version  start');
      },
      txSuccessCb: () => {
        console.log('set schema version  success'); successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('set schema version  update');
      }
    });
  }, [api, queueExtrinsic]);

  const setOffChainSchema = useCallback(({ account, collectionId, errorCallback, schema, successCallback }: { account: string, schema: string, collectionId: string, successCallback?: () => void, errorCallback?: () => void }) => {
    const transaction = api.tx.unique.setOffchainSchema(collectionId, schema);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('set offChain schema fail'); errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('set offChain schema start');
      },
      txSuccessCb: () => {
        console.log('set offChain schema success'); successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('set offChain schema update');
      }
    });
  }, [api, queueExtrinsic]);

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

  const calculateSetVariableOnChainSchemaFee = useCallback(async ({ account, collectionId, schema }: { account: string, schema: string, collectionId: string }): Promise<BN | null> => {
    try {
      const fee = await api.tx.unique.setVariableOnChainSchema(collectionId, schema).paymentInfo(account) as { partialFee: BN };

      return fee.partialFee;
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  }, [api]);

  const saveVariableOnChainSchema = useCallback(({ account, collectionId, errorCallback, schema, successCallback }: { account: string, collectionId: string, schema: string, successCallback?: () => void, errorCallback?: () => void }) => {
    const transaction = api.tx.unique.setVariableOnChainSchema(collectionId, schema);

    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => {
        console.log('set collection varOnChain fail');

        queueAction({
          action: 'Custom. Cover image',
          message: 'Setting cover image failed',
          status: 'error'
        });

        errorCallback && errorCallback();
      },
      txStartCb: () => {
        console.log('set collection varOnChain start');
      },
      txSuccessCb: () => {
        console.log('set collection varOnChain success');

        queueAction({
          action: 'Custom. Cover image',
          message: 'Cover image successfully set',
          status: 'success'
        });

        successCallback && successCallback();
      },
      txUpdateCb: () => {
        console.log('set collection varOnChain update');
      }
    });
  }, [api.tx.unique, queueAction, queueExtrinsic]);

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
      const collectionInfo = (await api.rpc.unique.collectionById(collectionId)).toJSON() as unknown as NftCollectionInterface | null;

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

  const getCollectionOnChainSchema = useCallback((collectionInfo: NftCollectionInterface): { constSchema: ProtobufAttributeType | undefined, variableSchema: { collectionCover: string } | undefined } => {
    const result: {
      constSchema: ProtobufAttributeType | undefined,
      variableSchema: { collectionCover: string } | undefined
    } = {
      constSchema: undefined,
      variableSchema: undefined
    };

    try {
      const constSchema = hex2a(collectionInfo.constOnChainSchema);
      const varSchema = hex2a(collectionInfo.variableOnChainSchema);

      if (constSchema && constSchema.length) {
        result.constSchema = JSON.parse(constSchema) as ProtobufAttributeType;
      }

      if (varSchema && varSchema.length) {
        result.variableSchema = JSON.parse(varSchema) as { collectionCover: string } | undefined;
      }

      return result;
    } catch (e) {
      console.log('getCollectionOnChainSchema error');
    }

    return result;
  }, [hex2a]);

  const getTokensOfCollection = useCallback(async (collectionId: string, ownerId: string) => {
    if (!api || !collectionId || !ownerId) {
      return [];
    }

    try {
      return await api.query.unique.accountTokens(collectionId, { Substrate: ownerId });
    } catch (e) {
      console.log('getTokensOfCollection error', e);
    }

    return [];
  }, [api]);

  const calculateCreateCollectionExFee = useCallback(async ({ access, account, constOnChainSchema, description, limits, metaUpdatePermission, mode, name, offchainSchema, pendingSponsor, schemaVersion, tokenPrefix, variableOnChainSchema }: CreateCollectionEx): Promise<BN | null> => {
    if (!limits.tokenLimit) {
      delete limits.tokenLimit;
    }

    try {
      const extrinsic = api.tx.unique.createCollectionEx({
        access,
        constOnChainSchema,
        description,
        limits,
        metaUpdatePermission,
        mode,
        name,
        offchainSchema,
        pendingSponsor,
        schemaVersion,
        tokenPrefix,
        variableOnChainSchema
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

  const createCollectionEx = useCallback(({ access, account, constOnChainSchema, description, limits, metaUpdatePermission, mode, name, offchainSchema, pendingSponsor, schemaVersion, tokenPrefix, variableOnChainSchema }: CreateCollectionEx, callBacks?: TransactionCallBacks) => {
    if (!limits.tokenLimit) {
      delete limits.tokenLimit;
    }

    const extrinsic = api.tx.unique.createCollectionEx({
      access,
      constOnChainSchema,
      description,
      limits,
      metaUpdatePermission,
      mode,
      name,
      offchainSchema,
      pendingSponsor,
      schemaVersion,
      tokenPrefix,
      variableOnChainSchema
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

        console.log('create collection success');
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
    calculateSetConstOnChainSchemaFees,
    calculateSetSchemaVersionFee,
    calculateSetVariableOnChainSchemaFee,
    confirmSponsorship,
    createCollection,
    createCollectionEx,
    destroyCollection,
    getCollectionAdminList,
    getCollectionOnChainSchema,
    getCollectionTokensCount,
    getCreatedCollectionCount,
    getDetailedCollectionInfo,
    getTokensOfCollection,
    removeCollectionAdmin,
    removeCollectionSponsor,
    saveConstOnChainSchema,
    saveVariableOnChainSchema,
    setCollectionSponsor,
    setOffChainSchema,
    setSchemaVersion
  };
}
