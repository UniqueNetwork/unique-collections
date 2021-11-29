// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';

import { TokenAttribute } from '@polkadot/app-builder/types';
import { AttributeItemType, fillAttributes, ProtobufAttributeType } from '@polkadot/react-components/util/protobufUtils';
import { NftCollectionInterface, useCollection } from '@polkadot/react-hooks/useCollection';

export interface useTokenAttributesInterface {
  constAttributes: AttributeItemType[];
  constOnChainSchema: ProtobufAttributeType | undefined;
  resetAttributes: () => void;
  setTokenConstAttributes: (attr: { [key: string]: TokenAttribute }) => void | ((prevAttributes: { [key: string]: TokenAttribute }) => { [x: string]: TokenAttribute });
  tokenConstAttributes: { [key: string]: TokenAttribute };
}

export function useTokenAttributes (collectionInfo: NftCollectionInterface | undefined): useTokenAttributesInterface {
  const { getCollectionOnChainSchema } = useCollection();
  const [constOnChainSchema, setConstOnChainSchema] = useState<ProtobufAttributeType>();
  const [constAttributes, setConstAttributes] = useState<AttributeItemType[]>([]);
  const [tokenConstAttributes, setTokenConstAttributes] = useState<{ [key: string]: TokenAttribute }>({});

  const presetCollectionForm = useCallback(() => {
    if (collectionInfo?.constOnChainSchema) {
      const onChainSchema = getCollectionOnChainSchema(collectionInfo);

      if (onChainSchema) {
        const { constSchema } = onChainSchema;

        if (constSchema) {
          setConstOnChainSchema(constSchema);
          setConstAttributes(fillAttributes(constSchema));
        }
      }
    } else {
      setConstAttributes([]);
    }
  }, [collectionInfo, getCollectionOnChainSchema]);

  const presetAttributesFromArray = useCallback((attributes: AttributeItemType[]) => {
    try {
      const tokenAttributes: { [key: string]: TokenAttribute } = {};

      attributes?.forEach((attribute) => {
        tokenAttributes[attribute.name] = {
          name: attribute.name,
          value: '',
          values: []
        };
      });

      setTokenConstAttributes(tokenAttributes);
    } catch (e) {
      console.log('presetAttributesFromArray error', e);
    }
  }, []);

  const resetAttributes = useCallback(() => {
    presetAttributesFromArray(constAttributes);
  }, [constAttributes, presetAttributesFromArray]);

  useEffect(() => {
    if (constAttributes && constAttributes.length) {
      presetAttributesFromArray(constAttributes);
    }
  }, [constAttributes, presetAttributesFromArray]);

  useEffect(() => {
    presetCollectionForm();
  }, [presetCollectionForm]);

  return {
    constAttributes,
    constOnChainSchema,
    resetAttributes,
    setTokenConstAttributes,
    tokenConstAttributes
  };
}
