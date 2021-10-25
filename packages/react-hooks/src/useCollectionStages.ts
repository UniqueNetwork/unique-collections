// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect} from 'react';
import { useMachine } from '@xstate/react';

import collectionStateMachine from './stateMachine';

interface CollectionStagesInterface {
  currentState: string;
}

export const useCollectionStages = (account: string): CollectionStagesInterface => {
  const [state, send] = useMachine(collectionStateMachine);

  const mainInformation = useCallback(() => {
    console.log('mainInformation');
  }, []);

  // on load - update token state
  useEffect(() => {
    switch (true) {
      case state.matches('loadingTokenInfo'):
        void mainInformation();
        break;
      default:
        break;
    }
  }, [mainInformation, state]);

  return {
    currentState: state.value as string
  };
};
