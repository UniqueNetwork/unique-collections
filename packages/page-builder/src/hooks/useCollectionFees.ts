// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useCallback, useContext, useState } from 'react';

import CollectionFormContext from '@polkadot/app-builder/CollectionFormContext/CollectionFormContext';
import { ArtificialAttributeItemType } from '@polkadot/app-builder/components/TokenAttributes/AttributesRowEditable';
import { AttributeItemType, fillProtobufJson, ProtobufAttributeType } from '@polkadot/react-components/util/protobufUtils';
import { useCollection } from '@polkadot/react-hooks';

export const useCollectionFees = (account: string, collectionId?: string) => {
  const { attributes, description, imgAddress, name, ownerCanDestroy, ownerCanTransfer, tokenPrefix } = useContext(CollectionFormContext);
  const { calculateCreateCollectionExFee, calculateSetConstOnChainSchemaFees, calculateSetSchemaVersionFee } = useCollection();
  const [fees, setFees] = useState<BN | null>(null);

  const convertArtificialAttributesToProtobuf = useCallback((attributes: ArtificialAttributeItemType[]): AttributeItemType[] => {
    return attributes.map((attr: ArtificialAttributeItemType): AttributeItemType => {
      if (attr.fieldType === 'repeated') {
        return { ...attr, fieldType: 'enum', rule: 'repeated' };
      }

      return { ...attr } as AttributeItemType;
    });
  }, []);

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

      setFees(createCollectionFees);
    }
  }, [account, attributes, calculateSetConstOnChainSchemaFees, calculateSetSchemaVersionFee, collectionId, convertArtificialAttributesToProtobuf]);

  const calculateFeeEx = useCallback(async () => {
    const converted: AttributeItemType[] = convertArtificialAttributesToProtobuf(attributes);
    const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);
    const varDataWithImage = {
      collectionCover: imgAddress
    };
    const variableOnChainSchema = JSON.stringify(varDataWithImage);

    if (account) {
      const createCollectionFees = await calculateCreateCollectionExFee({
        account,
        constOnChainSchema: JSON.stringify(protobufJson),
        description,
        limits: {
          ownerCanDestroy,
          ownerCanTransfer
        },
        mode: { nft: null },
        name,
        schemaVersion: 'Unique',
        tokenPrefix,
        variableOnChainSchema
      }) || new BN(0);

      setFees(createCollectionFees);
    }
  }, [account, attributes, calculateCreateCollectionExFee, convertArtificialAttributesToProtobuf, description, imgAddress, name, ownerCanDestroy, ownerCanTransfer, tokenPrefix]);

  return {
    calculateFee,
    calculateFeeEx,
    fees
  };
};
