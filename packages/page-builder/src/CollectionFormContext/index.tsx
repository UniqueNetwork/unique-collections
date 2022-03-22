// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useMemo, useState } from 'react';

import { ArtificialAttributeItemType } from '@polkadot/app-builder/components/TokenAttributes/AttributesRowEditable';

import CollectionFormContext from './CollectionFormContext';

interface Props {
  children: React.ReactNode;
}

function CollectionForm ({ children }: Props): React.ReactElement<Props> | null {
  const [attributes, setAttributes] = useState<ArtificialAttributeItemType[]>([]);
  const [avatarImg, setAvatarImg] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [createFees, setCreateFees] = useState<BN | null>(null);
  const [imgAddress, setImgAddress] = useState<string>();
  const [name, setName] = useState<string>('');
  const [ownerCanTransfer, setOwnerCanTransfer] = useState<boolean>(false);
  const [onwerCanDestroy, setOnwerCanDestroy] = useState<boolean>(false);
  const [protobufJson, setProtobufJson] = useState<File | null>(null);
  const [tokenPrefix, setTokenPrefix] = useState<string>('');
  const [variableSchema, setVariableSchema] = useState<string>('');

  const value = useMemo(() => ({
    attributes,
    avatarImg,
    coverImg,
    createFees,
    description,
    imgAddress,
    name,
    onwerCanDestroy,
    ownerCanTransfer,
    setAttributes,
    setAvatarImg,
    setCoverImg,
    setDescription,
    setImgAddress,
    setName,
    setTokenPrefix,
    setVariableSchema,
    tokenPrefix,
    variableSchema
  }), [attributes, avatarImg, coverImg, createFees, description, imgAddress, name, onwerCanDestroy, ownerCanTransfer, tokenPrefix, variableSchema]);

  return (
    <CollectionFormContext.Provider value={value}>
      {children}
    </CollectionFormContext.Provider>
  );
}

export default React.memo(CollectionForm);
