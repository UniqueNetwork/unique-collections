// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement, useCallback, useState } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';

import CollectionPreview from '@polkadot/app-builder/components/CollectionPreview';
import Cover from '@polkadot/app-builder/components/Cover';
import Stepper from '@polkadot/app-builder/components/Stepper';
import TokenPreview from '@polkadot/app-builder/components/TokenPreview';
import { UnqButton } from '@polkadot/react-components';

interface CollectionPageProps {
  account: string;
}

function CollectionPage ({ account }: CollectionPageProps): ReactElement {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const handleOnBtnClick = useCallback(() => {
    setIsPreviewOpen((prev) => !prev);
  }, []);

  return (
    <div className='collection-page'>
      <Header
        as='h1'
        className={`${isPreviewOpen ? 'hidden' : ''}`}
      >Create Collection</Header>
      <div className='page-main '>
        <div className={`main-section ${isPreviewOpen ? 'hidden' : ''}`}>
          <Stepper />
          <Cover />
        </div>
        <div className={`preview-cards ${!isPreviewOpen ? 'hidden' : ''}`}>
          <CollectionPreview />
          <TokenPreview />
        </div>
        <div className='preview-btn'>
          <UnqButton
            content={isPreviewOpen ? 'Back' : 'Preview'}
            onClick={handleOnBtnClick}
            size='large'
          />
        </div>
      </div>
    </div>
  );
}

export default memo(CollectionPage);
