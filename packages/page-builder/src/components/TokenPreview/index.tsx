// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useState } from 'react';

import { AttributeItemType } from '@polkadot/react-components/util/protobufUtils';
import { useDecoder } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';
import { useTokenAttributes } from '@polkadot/react-hooks/useTokenAttributes';

import defaultIcon from '../../images/defaultIcon.svg';

interface TokenPreviewProps {
  collectionInfo?: NftCollectionInterface;
  collectionName: string;
  tokenPrefix?: string;
}

function TokenPreview ({ collectionInfo, collectionName, tokenPrefix }: TokenPreviewProps): React.ReactElement {
  const [imgUrl, setImgUrl] = useState<string>('');
  const { constAttributes, tokenConstAttributes } = useTokenAttributes(collectionInfo);
  const { collectionName16Decoder, hex2a } = useDecoder();

  console.log('tokenConstAttributes', tokenConstAttributes);

  return (
    <div className='token-preview'>
      <div className='token-preview-header'>Token preview</div>
      <div className='token-preview-content'>
        <div className='token-img'>
          <img src={imgUrl || defaultIcon as string} />
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
