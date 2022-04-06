// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

function Stepper ({ collectionId, disabled }: { collectionId?: string, disabled: boolean }): React.ReactElement {
  const location = useLocation();
  const history = useHistory();
  const firstStepClassName = collectionId ? 'step disabled' : 'step';
  const otherStepsClassName = disabled ? 'step disabled' : 'step';
  const mainInformationStepClassName = `${location.pathname.includes('/main-information') ? `${firstStepClassName} active-step` : firstStepClassName}`;
  const coverStepClassName = `${location.pathname.includes('/cover') ? `${otherStepsClassName} active-step` : otherStepsClassName}`;
  const attributesStepClassName = `${location.pathname.includes('/token-attributes') ? `${otherStepsClassName} active-step` : otherStepsClassName}`;

  const onStepClick = useCallback((step: number) => {
    switch (step) {
      case 1:
        if (!collectionId) {
          history.push('/builder/new-collection/main-information');
        }

        break;
      case 2:
        if (!collectionId) {
          if (disabled) {
            break;
          }

          history.push('/builder/new-collection/cover');
        } else {
          history.push(`/builder/collections/${collectionId}/cover`);
        }

        break;
      case 3:
        if (!collectionId) {
          if (disabled) {
            break;
          }

          history.push('/builder/new-collection/token-attributes');
        } else {
          history.push(`/builder/collections/${collectionId}/token-attributes`);
        }

        break;
    }
  }, [collectionId, history, disabled]);

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
          className={coverStepClassName}
          onClick={onStepClick.bind(null, 2)}
        >
          2
        </div>
        <div className='step-line' />
        <div
          className={attributesStepClassName}
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
