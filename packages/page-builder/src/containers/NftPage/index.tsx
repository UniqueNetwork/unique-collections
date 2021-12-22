// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement, useCallback, useEffect, useState } from 'react';

import CreateNFT from '@polkadot/app-builder/components/CreateNFT';
import { TokenAttribute } from '@polkadot/app-builder/types';
import { AttributeItemType, ProtobufAttributeType } from '@polkadot/react-components/util/protobufUtils';
import { useCollection } from '@polkadot/react-hooks';
import { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

interface NftPageProps {
  account: string;
  basePath: string;
  collectionId: string;
  constAttributes: AttributeItemType[];
  constOnChainSchema: ProtobufAttributeType | undefined;
  resetAttributes: () => void;
  setTokenConstAttributes: (attr: (prevAttributes: { [p: string]: TokenAttribute }) => { [p: string]: TokenAttribute }) => void | ((prevAttributes: { [p: string]: TokenAttribute }) => { [p: string]: TokenAttribute });
  setTokenImg: (image: File | null) => void;
  tokenConstAttributes: { [key: string]: TokenAttribute };
  tokenImg: File | null;
}

function NftPage ({ account, collectionId, constAttributes, constOnChainSchema, resetAttributes, setTokenConstAttributes, setTokenImg, tokenConstAttributes, tokenImg }: NftPageProps): ReactElement {
  const { getDetailedCollectionInfo } = useCollection();
  const [collectionInfo, setCollectionInfo] = useState<NftCollectionInterface>();
  const isOwner = collectionInfo?.owner === account;

  const fetchCollectionInfo = useCallback(async () => {
    const info: NftCollectionInterface | null = await getDetailedCollectionInfo(collectionId);

    if (info) {
      setCollectionInfo(info);
    }
  }, [collectionId, getDetailedCollectionInfo]);

  useEffect(() => {
    void fetchCollectionInfo();
  }, [fetchCollectionInfo]);

  return (
    <div className='nft-page'>
      { collectionInfo && (
        <CreateNFT
          account={account}
          collectionId={collectionId}
          collectionInfo={collectionInfo}
          constAttributes={constAttributes}
          constOnChainSchema={constOnChainSchema}
          isOwner={isOwner}
          resetAttributes={resetAttributes}
          setTokenConstAttributes={setTokenConstAttributes}
          setTokenImg={setTokenImg}
          tokenConstAttributes={tokenConstAttributes}
          tokenImg={tokenImg}
        />
      )}
    </div>
  );
}

export default memo(NftPage);
