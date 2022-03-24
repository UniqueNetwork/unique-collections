// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { ArtificialAttributeItemType } from '@polkadot/app-builder/components/TokenAttributes/AttributesRowEditable';

export type AttributesCallBackType = (prevAttributes: ArtificialAttributeItemType[]) => ArtificialAttributeItemType[]

export interface CollectionFormProps {
  attributes: ArtificialAttributeItemType[];
  avatarImg: File | null;
  coverImg: File | null;
  description: string;
  imgAddress?: string;
  name: string;
  ownerCanDestroy: boolean;
  ownerCanTransfer: boolean;
  setAttributes: (attributes: ArtificialAttributeItemType[] | AttributesCallBackType) => void;
  setAvatarImg: (avatarImg: File | null) => void;
  setCoverImg: (coverImg: File | null) => void;
  setDescription: (description: string) => void;
  setImgAddress: (imgAddress?: string) => void;
  setName: (name: string) => void;
  setOwnerCanDestroy: (ownerCanDestroy: boolean) => void;
  setOwnerCanTransfer: (ownerCanTransfer: boolean) => void;
  setTokenImg: (tokenImg: File | null) => void;
  setTokenLimit: (tokenLimit: number) => void;
  setTokenPrefix: (tokenPrefix: string) => void;
  setVariableSchema: (variableSchema: string) => void;
  tokenImg: File | null;
  tokenLimit: number;
  tokenPrefix: string;
  variableSchema: string;
}

const CollectionFormContext: React.Context<CollectionFormProps> = React.createContext({} as unknown as CollectionFormProps);
const CollectionFormConsumer: React.Consumer<CollectionFormProps> = CollectionFormContext.Consumer;
const CollectionFormProvider: React.Provider<CollectionFormProps> = CollectionFormContext.Provider;

export default CollectionFormContext;

export {
  CollectionFormConsumer,
  CollectionFormProvider
};
