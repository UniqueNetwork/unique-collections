// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, ReactElement } from 'react';
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import TokenPreview from "@polkadot/app-builder/components/TokenPreview";
import CollectionPreview from "@polkadot/app-builder/components/CollectionPreview";
import Stepper from "@polkadot/app-builder/components/Stepper";
import MainInformation from "@polkadot/app-builder/components/MainInformation";

interface CollectionPageProps {
  account: string;
}

function CollectionPage ({ account }: CollectionPageProps): ReactElement {
  return (
    <div className='collection-page'>
      <Header as='h1'>Create Collection</Header>
      <div className='page-main '>
        <div className='main-section'>
          <Stepper />
          <MainInformation/>
          <div className='preview-btn'>
            <button>Preview</button>
          </div>
        </div>
        <div className='preview-cards'>
          <CollectionPreview />
          <TokenPreview />
        </div>
      </div>
    </div>
  );
}

export default memo(CollectionPage);
