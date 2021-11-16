// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo } from 'react';

interface Props {
  text: string;
  disable: boolean;
  onClick: () => void;
}

// @todo move this to react-components, name this UnqButton and add more props
function Button ({ disable, onClick, text }: Props): React.ReactElement {
  return (
    <button
      className={disable ? 'disable' : ''}
      disabled={disable}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default memo(Button);
