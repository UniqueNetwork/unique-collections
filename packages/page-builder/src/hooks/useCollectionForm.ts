// Copyright 2017-2022 @polkadot/UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react';

import { ArtificialAttributeItemType } from '@polkadot/app-builder/components/TokenAttributes/AttributesRowEditable';
import BN from "bn.js";
import {useCollection} from "@polkadot/react-hooks";

/*
createCollection(account, {
        description,
        modeprm: { nft: null },
        name,
        tokenPrefix
      }, {
        onFailed: setTransactions.bind(null, []),
        onSuccess: goToNextStep
      });
 */

export const useCollectionForm = (account) => {
  const [name, setName] = useState<string>('');
  const { calculateCreateCollectionFee } = useCollection();
  const [description, setDescription] = useState<string>('');
  const [tokenPrefix, setTokenPrefix] = useState<string>('');
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [attributes, setAttributes] = useState<ArtificialAttributeItemType[]>([]);
  const [createFees, setCreateFees] = useState<BN | null>(null);
  const [variableSchema, setVariableSchema] = useState<string>('');

  const calculateFee = useCallback(async () => {
    if (account) {
      const fees = await calculateCreateCollectionFee({ account, description, modeprm: { nft: null }, name, tokenPrefix });

      setCreateFees(fees);
    }
  }, [account, calculateCreateCollectionFee, description, name, tokenPrefix]);

  useEffect(() => {
    void calculateFee();
  }, [calculateFee]);

  return {
    attributes,
    coverImg,
    createFees,
    description,
    name,
    setAttributes,
    setCoverImg,
    setDescription,
    setName,
    setTokenPrefix,
    tokenPrefix
  };
};
