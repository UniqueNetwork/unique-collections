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
  const { calculateCreateCollectionExFee, calculateSetCollectionPropertiesFees } = useCollection();
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

  const calculatePropertiesFee = useCallback(async () => {
    if (account && collectionId) {
      let collectionPropertiesFee: BN = new BN(0);
      const converted: AttributeItemType[] = convertArtificialAttributesToProtobuf(attributes);
      const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);

      if (account && collectionId) {
        let variableOnChainSchema = '';

        if (imgAddress) {
          const varDataWithImage = {
            collectionCover: imgAddress
          };

          variableOnChainSchema = JSON.stringify(varDataWithImage);
        }

        const properties = [
          { key: '_old_offchainSchema', value: '' },
          { key: '_old_schemaVersion', value: 'Unique' },
          { key: '_old_variableOnChainSchema', value: variableOnChainSchema },
          { key: '_old_constOnChainSchema', value: JSON.stringify(protobufJson) }
        ];

        collectionPropertiesFee = (await calculateSetCollectionPropertiesFees({ account, collectionId, properties })) || new BN(0);
      }

      mountedRef.current && setFees(collectionPropertiesFee);
    }
  }, [account, attributes, calculateSetCollectionPropertiesFees, collectionId, convertArtificialAttributesToProtobuf, imgAddress, mountedRef]);

  const calculateFeeEx = useCallback(async () => {
    const converted: AttributeItemType[] = convertArtificialAttributesToProtobuf(attributes);
    const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);
    const varDataWithImage = {
      collectionCover: imgAddress
    };

    if (account) {
      const createCollectionFees = await calculateCreateCollectionExFee({
        account,
        description: str2vec(description),
        limits: {
          ownerCanDestroy,
          ownerCanTransfer,
          tokenLimit
        },
        mode: { nft: null },
        name: str2vec(name),
        permissions: {
          access: 'Normal',
          mintMode: false,
          nesting: {
            owner: null
          }
        },
        properties: [
          { key: '_old_offchainSchema', value: '' },
          { key: '_old_schemaVersion', value: 'Unique' },
          { key: '_old_variableOnChainSchema', value: JSON.stringify(varDataWithImage) },
          { key: '_old_constOnChainSchema', value: JSON.stringify(protobufJson) }
        ],
        tokenPrefix: str2vec(tokenPrefix),
        tokenPropertyPermissions: [
          {
            key: '_old_constData', permission: { collectionAdmin: true, mutable: false, tokenOwner: false }
          }
        ]
      }) || new BN(0);

      mountedRef.current && setFees(createCollectionFees);
    }
  }, [account, attributes, calculateCreateCollectionExFee, convertArtificialAttributesToProtobuf, description, imgAddress, mountedRef, name, ownerCanDestroy, ownerCanTransfer, tokenLimit, tokenPrefix]);

  return {
    calculateFeeEx,
    calculatePropertiesFee,
    fees
  };
};
