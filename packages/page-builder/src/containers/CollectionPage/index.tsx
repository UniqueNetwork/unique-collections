// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement, useCallback, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { useLocation, useParams } from 'react-router-dom';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';

import CollectionPreview from '@polkadot/app-builder/components/CollectionPreview';
import Cover from '@polkadot/app-builder/components/Cover';
import MainInformation from '@polkadot/app-builder/components/MainInformation';
import Stepper from '@polkadot/app-builder/components/Stepper';
import TokenAttributes from '@polkadot/app-builder/components/TokenAttributes';
import TokenPreview from '@polkadot/app-builder/components/TokenPreview';

interface CollectionPageProps {
  account: string;
  basePath: string;
}

/* @todo
 If the collection creation process was not completely ended, we save the information about collection
 and open the same page, where user interrupted the action.
 */

function CollectionPage ({ account, basePath }: CollectionPageProps): ReactElement {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [collectionName, setCollectionName] = useState<string>('');
  const [collectionDescription, setCollectionDescription] = useState<string>('');
  const [tokenPrefix, setTokenPrefix] = useState<string>('');
  const history = useHistory();
  const location = useLocation();
  const { collectionId }: { collectionId: string } = useParams();

  const handleOnBtnClick = useCallback(() => {
    setIsPreviewOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (location.pathname === '/builder/new-collection' || location.pathname === '/builder/new-collection/') {
      history.push('/builder/new-collection/main-information');
    }

    if (location.pathname === `/builder/collections/${collectionId}` || location.pathname === `/builder/collections/${collectionId}/main-information`) {
      history.push(`/builder/collections/${collectionId}/cover`);
    }
  }, [collectionId, history, location]);

  return (
    <div className='collection-page'>
      <Header
        as='h1'
        className={`${isPreviewOpen ? 'hidden' : ''}`}
      >Create Collection</Header>
      <div className='page-main '>
        <div className={`main-section ${isPreviewOpen ? 'hidden' : ''}`}>
          <Stepper />
          <Switch>
            <Route path={`${basePath}/new-collection/main-information`}>
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
            <Route path={`${basePath}/collections/${collectionId}/cover`}>
              <Cover
                account={account}
                collectionId={collectionId}
              />
            </Route>
            <Route path={`${basePath}/collections/${collectionId}/token-attributes`}>
              <TokenAttributes
                account={account}
                collectionId={collectionId}
              />
            </Route>
          </Switch>
        </div>
        <div className={`preview-cards ${!isPreviewOpen ? 'hidden' : ''}`}>
          <CollectionPreview
            collectionDescription={collectionDescription}
            collectionName={collectionName}
          />
          <TokenPreview
            collectionName={collectionName}
            tokenPrefix={tokenPrefix}
          />
        </div>
        <div className='preview-btn'>
          <button onClick={handleOnBtnClick}>{isPreviewOpen ? 'Back' : 'Preview'}</button>
        </div>
      </div>
    </div>
  );
}

export default memo(CollectionPage);
