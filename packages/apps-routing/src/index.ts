// Copyright 2017-2021 @polkadot/apps-routing, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Routes } from './types';

import accounts from './accounts';
import builder from './builder';
import faq from './faq';

export default function create (t: TFunction): Routes {
  return [
    faq(t),
    builder(t),
    accounts(t)
  ];
}
