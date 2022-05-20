// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useCallback, useContext, useState } from 'react';

import CollectionFormContext from '@polkadot/app-builder/CollectionFormContext/CollectionFormContext';
import { ArtificialAttributeItemType } from '@polkadot/app-builder/components/TokenAttributes/AttributesRowEditable';
import { AttributeItemType, fillProtobufJson, ProtobufAttributeType } from '@polkadot/react-components/util/protobufUtils';
import { useCollection, useIsMountedRef } from '@polkadot/react-hooks';
import { str2vec } from '@polkadot/react-hooks/utils';

export const useCollectionFees = (account: string, collectionId?: string) => {
  const { attributes, description, imgAddress, name, ownerCanDestroy, ownerCanTransfer, tokenLimit, tokenPrefix } = useContext(CollectionFormContext);
  const { calculateCreateCollectionExFee, calculateSetCollectionPropertiesFees, calculateSetConstOnChainSchemaFees, calculateSetSchemaVersionFee } = useCollection();
  const [fees, setFees] = useState<BN | null>(null);
  const mountedRef = useIsMountedRef();

  const convertArtificialAttributesToProtobuf = useCallback((attributes: ArtificialAttributeItemType[]): AttributeItemType[] => {
    return attributes.map((attr: ArtificialAttributeItemType): AttributeItemType => {
      if (attr.fieldType === 'repeated') {
        return { ...attr, fieldType: 'enum', rule: 'repeated' };
      }

      return { ...attr } as AttributeItemType;
    });
  }, []);

  const calculateCoverFee = useCallback(async () => {
    if (account && collectionId) {
      let setCollectionPropertiesFee: BN = new BN(0);

      if (account && collectionId && imgAddress) {
        const varDataWithImage = {
          coverImageURL: imgAddress
        };

        setCollectionPropertiesFee = (await calculateSetCollectionPropertiesFees({ account, collectionId, properties: [varDataWithImage] })) || new BN(0);
      }

      mountedRef.current && setFees(setCollectionPropertiesFee);
    }
  }, [account, calculateSetCollectionPropertiesFees, collectionId, imgAddress, mountedRef]);

  const calculateFee = useCallback(async () => {
    if (account && collectionId) {
      const converted: AttributeItemType[] = convertArtificialAttributesToProtobuf(attributes);
      const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);

      const constOnChainSchemaFees = await calculateSetConstOnChainSchemaFees({
        account,
        collectionId,
        schema: JSON.stringify(protobufJson)
      }) || new BN(0);

      const schemaVersionFee = await calculateSetSchemaVersionFee({
        account,
        collectionId,
        schemaVersion: 'Unique'
      }) || new BN(0);

      const createCollectionFees = constOnChainSchemaFees.add(schemaVersionFee);

      mountedRef.current && setFees(createCollectionFees);
    }
  }, [account, attributes, calculateSetConstOnChainSchemaFees, calculateSetSchemaVersionFee, collectionId, convertArtificialAttributesToProtobuf, mountedRef]);

  const calculateFeeEx = useCallback(async () => {
    const converted: AttributeItemType[] = convertArtificialAttributesToProtobuf(attributes);
    const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);
    const varDataWithImage = {
      coverImageURL: imgAddress ?? null
    };

    if (account) {
      const createCollectionFees = await calculateCreateCollectionExFee({
        account,
        constOnChainSchema: JSON.stringify(protobufJson),
        description: str2vec(description),
        limits: {
          ownerCanDestroy,
          ownerCanTransfer,
          tokenLimit
        },
        mode: { nft: null },
        name: str2vec(name),
        properties: [varDataWithImage],
        schemaVersion: 'Unique',
        tokenPrefix: str2vec(tokenPrefix)
      }) || new BN(0);

      mountedRef.current && setFees(createCollectionFees);
    }
  }, [account, attributes, calculateCreateCollectionExFee, convertArtificialAttributesToProtobuf, description, imgAddress, mountedRef, name, ownerCanDestroy, ownerCanTransfer, tokenLimit, tokenPrefix]);

  return {
    calculateCoverFee,
    calculateFee,
    calculateFeeEx,
    fees
  };
};
