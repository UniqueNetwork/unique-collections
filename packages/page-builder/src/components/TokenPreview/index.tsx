// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo } from 'react';

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

  console.log('tokenConstAttributes', tokenConstAttributes, 'constAttributes', constAttributes);

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
          { constAttributes?.length > 0 && (
            <div className='const-attributes'>
              <h4>Token attributes  </h4>
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
      </div>
    </div>
  );
}

export default memo(TokenPreview);
