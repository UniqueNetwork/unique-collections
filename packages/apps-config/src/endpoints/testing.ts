// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from './types';

import envConfig from '@polkadot/apps-config/envConfig';

import { expandEndpoints } from './util';

const { uniqueSubstrateApi } = envConfig;
/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

export function createTesting (t: TFunction, firstOnly: boolean, withSort: boolean): LinkOption[] {
  return expandEndpoints(t, [
    // alphabetical based on chain name, e.g. Amber, Arcadia, Beresheet, ...
    {
      info: 'opal',
      text: t('opal.unique.network', 'OPAL by UNIQUE', { ns: 'apps-config' }),
      providers: {
        Unique: uniqueSubstrateApi || 'wss://opal.unique.network'
      }
    },
    {
      info: 'unique',
      text: t('rpc.test.unique', 'Unique', { ns: 'apps-config' }),
      providers: {
        Unique: uniqueSubstrateApi || 'wss://testnet2.unique.network'
      }
    }
  ], firstOnly, withSort);
}
