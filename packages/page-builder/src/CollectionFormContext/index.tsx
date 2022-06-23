// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';

import { ArtificialAttributeItemType } from '@polkadot/app-builder/components/TokenAttributes/AttributesRowEditable';

import CollectionFormContext from './CollectionFormContext';

interface Props {
  children: React.ReactNode;
}

export const defaultAttributesWithTokenIpfs: ArtificialAttributeItemType[] = [
  {
    fieldType: 'string',
    id: 0,
    name: 'ipfsJson',
    rule: 'required',
    values: []
  }
];

function CollectionForm ({ children }: Props): React.ReactElement<Props> | null {
  const [attributes, setAttributes] = useState<ArtificialAttributeItemType[]>(defaultAttributesWithTokenIpfs);
  const [avatarImg, setAvatarImg] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [imgAddress, setImgAddress] = useState<string>();
  const [name, setName] = useState<string>('');
  const [ownerCanTransfer, setOwnerCanTransfer] = useState<boolean>(false);
  const [ownerCanDestroy, setOwnerCanDestroy] = useState<boolean>(true);
  const [tokenPrefix, setTokenPrefix] = useState<string>('');
  const [tokenLimit, setTokenLimit] = useState<number | undefined>();
  const [variableSchema, setVariableSchema] = useState<string>('');
  const [tokenImg, setTokenImg] = useState<File | null>(null);

  const value = useMemo(() => ({
    attributes,
    avatarImg,
    coverImg,
    description,
    imgAddress,
    name,
    ownerCanDestroy,
    ownerCanTransfer,
    setAttributes,
    setAvatarImg,
    setCoverImg,
    setDescription,
    setImgAddress,
    setName,
    setOwnerCanDestroy,
    setOwnerCanTransfer,
    setTokenImg,
    setTokenLimit,
    setTokenPrefix,
    setVariableSchema,
    tokenImg,
    tokenLimit,
    tokenPrefix,
    variableSchema
  }), [attributes, avatarImg, coverImg, description, imgAddress, name, ownerCanDestroy, ownerCanTransfer, tokenImg, tokenLimit, tokenPrefix, variableSchema]);

  return (
    <CollectionFormContext.Provider value={value}>
      {children}
    </CollectionFormContext.Provider>
  );
}

export * from './CollectionFormContext';

export default React.memo(CollectionForm);
