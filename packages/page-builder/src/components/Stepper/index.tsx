// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router';
import { useLocation, useParams } from 'react-router-dom';

function Stepper (): React.ReactElement {
  const location = useLocation();
  const history = useHistory();
  const { collectionId }: { collectionId: string } = useParams();

  const onCoverClick = useCallback(() => {
    if (!location.pathname.includes('/new-collection')) {
      history.push(`/builder/collections/${collectionId}/cover`);
    }
  }, [collectionId, history, location]);

  const onAttributesClick = useCallback(() => {
    if (!location.pathname.includes('/new-collection')) {
      history.push(`/builder/collections/${collectionId}/token-attributes`);
    }
  }, [collectionId, history, location]);

  return (
    <div className='stepper-main'>
      <div className='steps'>
        <div
          className={`${location.pathname.includes('/main-information') ? 'step active-step' : 'step'}`}
          style={{ cursor: 'not-allowed' }}
        >
          1
        </div>
        <div className='step-line' />
        <div
          className={`${location.pathname.includes('/cover') ? 'step active-step' : 'step'}`}
          onClick={onCoverClick}
          style={{ cursor: 'pointer' }}
        >
          2
        </div>
        <div className='step-line' />
        <div
          className={`${location.pathname.includes('/token-attributes') ? 'step active-step' : 'step'}`}
          onClick={onAttributesClick}
          style={{ cursor: 'pointer' }}
        >
          3
        </div>
      </div>
      <div className='steps-text'>
        <span className={`${location.pathname.includes('/main-information') ? 'active-line' : 'step'}`}>Main information</span>
        <span className={`${location.pathname.includes('/cover') ? 'active-line' : 'step'}`}>Cover</span>
        <span className={`${location.pathname.includes('/token-attributes') ? 'active-line' : 'step'}`}>Token attributes</span>
      </div>
    </div>
  );
}

export default memo(Stepper);
