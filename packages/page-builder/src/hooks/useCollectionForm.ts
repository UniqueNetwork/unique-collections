// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useCallback, useEffect, useState } from 'react';

import { ArtificialAttributeItemType } from '@polkadot/app-builder/components/TokenAttributes/AttributesRowEditable';
import { useCollection } from '@polkadot/react-hooks';
import {
  AttributeItemType,
  fillProtobufJson,
  ProtobufAttributeType
} from "@polkadot/react-components/util/protobufUtils";

export const useCollectionForm = (account: string) => {
  const [avatarImg, setAvatarImg] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const { calculateCreateCollectionExFee, calculateCreateCollectionFee } = useCollection();
  const [description, setDescription] = useState<string>('');
  const [tokenPrefix, setTokenPrefix] = useState<string>('');
  const [ownerCanTransfer, setOwnerCanTransfer] = useState<boolean>(false);
  const [onwerCanDestroy, setOnwerCanDestroy] = useState<boolean>(false);
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [imgAddress, setImgAddress] = useState<string>();
  const [protobufJson, setProtobufJson] = useState<File | null>(null);
  const [attributes, setAttributes] = useState<ArtificialAttributeItemType[]>([]);
  const [createFees, setCreateFees] = useState<BN | null>(null);
  const [variableSchema, setVariableSchema] = useState<string>('');

  const convertArtificialAttributesToProtobuf = useCallback((attributes: ArtificialAttributeItemType[]): AttributeItemType[] => {
    return attributes.map((attr: ArtificialAttributeItemType): AttributeItemType => {
      if (attr.fieldType === 'repeated') {
        return { ...attr, fieldType: 'enum', rule: 'repeated' };
      }

      return { ...attr } as AttributeItemType;
    });
  }, []);

  // { access, account, constOnChainSchema, description, limits, metaUpdatePermission, mode, name, offchainSchema, pendingSponsor, schemaVersion, tokenPrefix, variableOnChainSchema
  const calculateFeeEx = useCallback(async () => {
    const converted: AttributeItemType[] = convertArtificialAttributesToProtobuf(attributes);
    const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);
    const varDataWithImage = {
      collectionCover: imgAddress
    };
    const variableOnChainSchema = JSON.stringify(varDataWithImage);

    if (account) {
      const fees = await calculateCreateCollectionExFee({
        account,
        constOnChainSchema: JSON.stringify(protobufJson),
        description,
        limits: {
          onwerCanDestroy,
          ownerCanTransfer
        },
        mode: { nft: null },
        name,
        schemaVersion: 'Unique',
        tokenPrefix,
        variableOnChainSchema,
      }) || new BN(0);
    }
  }, [account, attributes, calculateCreateCollectionExFee, convertArtificialAttributesToProtobuf, description, imgAddress, name, onwerCanDestroy, ownerCanTransfer, tokenPrefix]);

  useEffect(() => {
    void calculateFeeEx();
  }, [calculateFeeEx]);

  return {
    attributes,
    avatarImg,
    coverImg,
    createFees,
    description,
    name,
    setAttributes,
    setAvatarImg,
    setCoverImg,
    setDescription,
    setName,
    setTokenPrefix,
    setVariableSchema,
    tokenPrefix,
    variableSchema
  };
};
