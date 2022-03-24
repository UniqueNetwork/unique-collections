// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

function Stepper ({ collectionId }: { collectionId?: string }): React.ReactElement {
  const location = useLocation();
  const history = useHistory();
  const stepClassName = collectionId ? 'step disabled' : 'step';
  const mainInformationStepClassName = `${location.pathname.includes('/main-information') ? `${stepClassName} active-step` : stepClassName}`;

  const onStepClick = useCallback((step: number) => {
    switch (step) {
      case 1:
        if (!collectionId) {
          history.push('/builder/new-collection/main-information');
        }

        break;
      case 2:
        if (!collectionId) {
          history.push('/builder/new-collection/cover');
        } else {
          history.push(`/builder/collections/${collectionId}/cover`);
        }

        break;
      case 3:
        if (!collectionId) {
          history.push('/builder/new-collection/token-attributes');
        } else {
          history.push(`/builder/collections/${collectionId}/token-attributes`);
        }

        break;
    }
  }, [collectionId, history]);

  return (
    <div className='stepper-main shadow-block'>
      <div className='steps'>
        <div
          className={mainInformationStepClassName}
          onClick={onStepClick.bind(null, 1)}
        >
          1
        </div>
        <div className='step-line' />
        <div
          className={`${location.pathname.includes('/cover') ? 'step active-step' : 'step'}`}
          onClick={onStepClick.bind(null, 2)}
        >
          2
        </div>
        <div className='step-line' />
        <div
          className={`${location.pathname.includes('/token-attributes') ? 'step active-step' : 'step'}`}
          onClick={onStepClick.bind(null, 3)}
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
