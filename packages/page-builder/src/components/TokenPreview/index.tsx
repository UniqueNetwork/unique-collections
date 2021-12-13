// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback, useEffect, useState } from 'react';

import { TokenAttribute } from '@polkadot/app-builder/types';
import { AttributeItemType } from '@polkadot/react-components/util/protobufUtils';
import { useDecoder } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import defaultIcon from '../../images/defaultIcon.svg';

interface TokenPreviewProps {
  collectionInfo?: NftCollectionInterface;
  collectionName: string;
  constAttributes: AttributeItemType[];
  tokenConstAttributes: { [key: string]: TokenAttribute };
  tokenImg: File | null;
  tokenPrefix?: string;
}

function TokenPreview ({ collectionInfo, collectionName, constAttributes, tokenConstAttributes, tokenImg, tokenPrefix }: TokenPreviewProps): React.ReactElement {
  const { collectionName16Decoder, hex2a } = useDecoder();
  const [values, setValues] = useState<{ [key: string]: string | string[] | undefined }>({});

  console.log('tokenConstAttributes', tokenConstAttributes, 'constAttributes', constAttributes, 'values', values);

  /*
  setTokenConstAttributes((prevAttributes: { [key: string]: TokenAttribute }) => ({ ...prevAttributes,
      [attribute.name]: {
        name: prevAttributes[attribute.name].name,
        value: attribute.rule === 'repeated' ? prevAttributes[attribute.name].value : value as string,
        values: attribute.rule === 'repeated' ? value as number[] : prevAttributes[attribute.name].values
      } } as { [key: string]: TokenAttribute }));
   */

  const fillAttributesValues = useCallback(() => {
    if (constAttributes?.length) {
      const filledValues: { [key: string]: string | string[] | undefined } = {};

      constAttributes.forEach((item: AttributeItemType) => {
        filledValues[item.name] = item.rule === 'repeated' ? tokenConstAttributes[item.name]?.values?.map((val: number) => item.values[val]).join(', ') : item.values[tokenConstAttributes[item.name]?.value as number];
      });

      setValues(filledValues);
    }
  }, [constAttributes, tokenConstAttributes]);

  const checkAtributs: () => boolean = () => {
    let checker = false;

    constAttributes.forEach((elem) => {
      elem.name === 'ipfsJson' ? checker = false : checker = true;
    });

    return checker;
  };

  useEffect(() => {
    fillAttributesValues();
  }, [fillAttributesValues]);

  return (
    <div className='token-preview'>
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
            {collectionInfo ? hex2a(collectionInfo.tokenPrefix) : (tokenPrefix || 'Prefix')} #1
          </h3>
          <p className='content-text'>{ collectionInfo ? collectionName16Decoder(collectionInfo.name) : (collectionName || 'Collection name')}</p>
          { checkAtributs() && (
            <div className='const-attributes'>
              <h4>Token attributes</h4>
              { Object.keys(values).length > 0 && (
                <div className='const-attributes--block'>
                  { constAttributes?.map((collectionAttribute: AttributeItemType) => {
                    if (collectionAttribute.name !== 'ipfsJson') {
                      return (
                        <p
                          className='content-text'
                          key={collectionAttribute.name}
                        >
                          {collectionAttribute.name}: {values[collectionAttribute.name] || ''}
                        </p>
                      );
                    }

                    return null;
                  })}
                </div>
              )}
              { !Object.keys(values).length && (
                <div className='const-attributes--block'>
                  { constAttributes?.map((collectionAttribute: AttributeItemType) => {
                    if (collectionAttribute.name !== 'ipfsJson') {
                      return (
                        <p
                          className='content-text'
                          key={collectionAttribute.name}
                        >
                          {collectionAttribute.name}
                        </p>
                      );
                    }

                    return null;
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(TokenPreview);
