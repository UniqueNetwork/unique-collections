// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { TokenAttribute } from '@polkadot/app-builder/types';
import { AttributeItemType } from '@polkadot/react-components/util/protobufUtils';
import { useDecoder } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import defaultIcon from '../../images/defaultIcon.svg';
import { ArtificialAttributeItemType } from '../TokenAttributes/AttributesRowEditable';

interface TokenPreviewProps {
  attributes: ArtificialAttributeItemType[];
  collectionInfo?: NftCollectionInterface;
  collectionName: string;
  constAttributes: AttributeItemType[];
  tokenConstAttributes: { [key: string]: TokenAttribute };
  tokenImg: File | null;
  tokenPrefix?: string;
}

function TokenPreview ({ attributes, collectionInfo, collectionName, constAttributes, tokenConstAttributes, tokenImg, tokenPrefix }: TokenPreviewProps): React.ReactElement {
  const { collectionName16Decoder, hex2a } = useDecoder();
  const [values, setValues] = useState<{ [key: string]: string | string[] | number | undefined }>({});
  const location = useLocation();

  const fillAttributesValues = useCallback(() => {
    if (constAttributes?.length) {
      const filledValues: { [key: string]: string | string[] | undefined | number } = {};

      constAttributes.forEach((item: AttributeItemType) => {
        if (item.fieldType === 'enum') {
          if (item.rule === 'repeated') {
            filledValues[item.name] = tokenConstAttributes[item.name]?.values?.map((val: number) => item.values[val]).join(', ');
          } else {
            filledValues[item.name] = item.values[tokenConstAttributes[item.name]?.value as number];
          }
        } else if (item.fieldType === 'string') {
          filledValues[item.name] = tokenConstAttributes[item.name]?.value;
        }
      });

      setValues(filledValues);
    }
  }, [constAttributes, tokenConstAttributes]);

  const tokenAttributes = useMemo(() => {
    const isCollectionPage = location.pathname.includes('/token-attributes');
    let arrToFilter: AttributeItemType[] | ArtificialAttributeItemType[] = constAttributes;

    if (isCollectionPage) {
      arrToFilter = attributes;
    }

    return (arrToFilter as []).filter((elem: { name: string }) => elem.name !== 'ipfsJson');
  }, [attributes, constAttributes, location]);

  useEffect(() => {
    fillAttributesValues();
  }, [fillAttributesValues]);

  return (
    <div className='token-preview shadow-block'>
      <div className='token-preview-header'>Token preview</div>
      <div className='token-preview-content'>
        <div className='token-img'>
          <img
            alt='token-img'
            src={tokenImg ? URL.createObjectURL(tokenImg) : defaultIcon as string}
          />
        </div>
        <div className='content-description'>
          <h3 className='content-header'>
            {collectionInfo ? hex2a(collectionInfo.tokenPrefix) : (tokenPrefix || 'Symbol')} #1
          </h3>
          <p className='content-text'>{ collectionInfo ? collectionName16Decoder(collectionInfo.name) : (collectionName || 'Collection name')}</p>
          { !!tokenAttributes.length && (
            <div className='const-attributes'>
              <h4>Token attributes</h4>
              { Object.keys(values).length > 0 && (
                <div className='const-attributes--block'>
                  { tokenAttributes.map((collectionAttribute: AttributeItemType | ArtificialAttributeItemType) => (
                    <p
                      className='content-text'
                      key={collectionAttribute.name}
                    >
                      {collectionAttribute.name}: {values[collectionAttribute.name] || ''}
                    </p>
                  )
                  )}
                </div>
              )}

            </div>
          )}
          {/* on the token attributes page */}
          {/* { collectionAttributes?.length > 0 && (
            <div className='const-attributes'>
              <h4>Token attributes</h4>
              { collectionAttributes.map((collectionAttribute) => {
                if (collectionAttribute.name !== 'ipfsJson') {
                  return (
                    <p
                      className='content-text'
                      key={collectionAttribute.name}
                    >
                      {collectionAttribute.name}:
                    </p>
                  );
                }

                return null;
              })}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default memo(TokenPreview);
