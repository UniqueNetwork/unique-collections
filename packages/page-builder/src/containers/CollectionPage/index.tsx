// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { useLocation, useParams } from 'react-router-dom';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';

import CollectionPreview from '@polkadot/app-builder/components/CollectionPreview';
import Cover from '@polkadot/app-builder/components/Cover';
import MainInformation from '@polkadot/app-builder/components/MainInformation';
import Stepper from '@polkadot/app-builder/components/Stepper';
import TokenAttributes from '@polkadot/app-builder/components/TokenAttributes';
import { ArtificialAttributeItemType } from '@polkadot/app-builder/components/TokenAttributes/AttributesRowEditable';
import TokenPreview from '@polkadot/app-builder/components/TokenPreview';
import NftPage from '@polkadot/app-builder/containers/NftPage';
import { AppCtx } from '@polkadot/apps/AppContext';
import { UnqButton } from '@polkadot/react-components';
import { useScreenWidthFromThreshold, useTokenAttributes } from '@polkadot/react-hooks';
import { NftCollectionInterface, useCollection } from '@polkadot/react-hooks/useCollection';


interface CollectionPageProps {
  account: string;
  basePath: string;
  isPreviewOpen?: boolean;
}

/* @todo
 If the collection creation process was not completely ended, we save the information about collection
 and open the same page, where user interrupted the action.
 */

function CollectionPage({ account, basePath }: CollectionPageProps): ReactElement {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [lessThanThreshold] = useScreenWidthFromThreshold(1023);
  const [collectionName, setCollectionName] = useState<string>('');
  const [avatarImg, setAvatarImg] = useState<File | null>(null);
  const [tokenImg, setTokenImg] = useState<File | null>(null);
  const [collectionDescription, setCollectionDescription] = useState<string>('');
  const [attributes, setAttributes] = useState<ArtificialAttributeItemType[]>([]);
  const [tokenPrefix, setTokenPrefix] = useState<string>('');
  const history = useHistory();
  const location = useLocation();
  const { collectionId }: { collectionId: string } = useParams();
  const { getDetailedCollectionInfo } = useCollection();
  const [collectionInfo, setCollectionInfo] = useState<NftCollectionInterface>();
  const { constAttributes, constOnChainSchema, resetAttributes, setTokenConstAttributes, tokenConstAttributes } = useTokenAttributes(collectionInfo);
  const { setPreviewButtonDisplayed } = useContext(AppCtx);
  const previewMode = lessThanThreshold;

  const handleOnBtnClick = useCallback(() => {
    setIsPreviewOpen((prev) => !prev);
  }, []);

  const fetchCollectionInfo = useCallback(async () => {
    if (collectionId) {
      const info: NftCollectionInterface | null = await getDetailedCollectionInfo(collectionId);

      if (info) {
        setCollectionInfo(info);
      }
    }
  }, [collectionId, getDetailedCollectionInfo]);

  // set previewButtonDisplayed to AppContext
  useEffect(() => {
    setPreviewButtonDisplayed(previewMode);

    return () => { setPreviewButtonDisplayed(false); };
  }, [previewMode, setPreviewButtonDisplayed]);

  useEffect(() => {
    if (location.pathname === '/builder/new-collection' || location.pathname === '/builder/new-collection/') {
      history.push('/builder/new-collection/main-information');
    }

    if (location.pathname === `/builder/collections/${collectionId}/` || location.pathname === `/builder/collections/${collectionId}`) {
      history.push(`/builder/collections/${collectionId}/cover`);
    }

    // if we have collectionId, we cannot edit main information
    if (location.pathname === `/builder/collections/${collectionId}/main-information`) {
      history.push(`/builder/collections/${collectionId}/cover`);
    }
  }, [collectionId, history, location]);

  useEffect(() => {
    void fetchCollectionInfo();
  }, [fetchCollectionInfo]);

  return (
    <div className='collection-page'>
      {location.pathname !== `/builder/collections/${collectionId}/new-nft` && (
        <Header
          as='h1'
          className={`${isPreviewOpen ? 'hidden' : ''}`}
        >
          Create collection
        </Header>
      )}
      {location.pathname === `/builder/collections/${collectionId}/new-nft` && (
        <Header
          as='h1'
          className={`${isPreviewOpen ? 'hidden' : ''}`}
        >
          Create NFT
        </Header>
      )}
      <div className='page-main'>
        <div className={`main-section ${isPreviewOpen ? 'hidden' : ''}`}>
          {location.pathname !== `/builder/collections/${collectionId}/new-nft` && (
            <Stepper />
          )}
          <Switch>
            <Route
              exact
              path={`${basePath}/new-collection/main-information`}
            >
              <MainInformation
                account={account}
                description={collectionDescription}
                name={collectionName}
                setDescription={setCollectionDescription}
                setName={setCollectionName}
                setTokenPrefix={setTokenPrefix}
                tokenPrefix={tokenPrefix}
              />
            </Route>
            <Route
              path={`${basePath}/collections/:collectionId`}
            >
              <Switch>
                <Route path={`${basePath}/collections/${collectionId}/cover`}>
                  <Cover
                    account={account}
                    avatarImg={avatarImg}
                    collectionId={collectionId}
                    setAvatarImg={setAvatarImg}
                  />
                </Route>
                <Route path={`${basePath}/collections/${collectionId}/token-attributes`}>
                  <TokenAttributes
                    account={account}
                    attributes={attributes}
                    collectionId={collectionId}
                    collectionInfo={collectionInfo}
                    setAttributes={setAttributes}
                  />
                </Route>
                <Route path={`${basePath}/collections/${collectionId}/new-nft`}>
                  <NftPage
                    account={account}
                    basePath={basePath}
                    collectionId={collectionId}
                    constAttributes={constAttributes}
                    constOnChainSchema={constOnChainSchema}
                    resetAttributes={resetAttributes}
                    setTokenConstAttributes={setTokenConstAttributes}
                    setTokenImg={setTokenImg}
                    tokenConstAttributes={tokenConstAttributes}
                    tokenImg={tokenImg}
                  />
                </Route>
              </Switch>
            </Route>
          </Switch>
        </div>
        <div className={`preview-cards ${!isPreviewOpen ? 'hidden' : ''}`}>
          <CollectionPreview
            avatarImg={avatarImg}
            collectionDescription={collectionDescription}
            collectionInfo={collectionInfo}
            collectionName={collectionName}
          />
          <TokenPreview
            attributes={attributes}
            collectionInfo={collectionInfo}
            collectionName={collectionName}
            constAttributes={constAttributes}
            tokenConstAttributes={tokenConstAttributes}
            tokenImg={tokenImg}
            tokenPrefix={tokenPrefix}
          />
        </div>
        {previewMode && (
          <div className='preview-btn'>
            <UnqButton
              content={isPreviewOpen ? 'Back' : 'Preview'}
              onClick={handleOnBtnClick}
              size='large'
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(CollectionPage);
