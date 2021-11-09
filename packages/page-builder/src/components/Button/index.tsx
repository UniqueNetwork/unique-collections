// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React from 'react';

interface Props {
  text: string;
  disable: boolean;
  onClick: any;
}

function Button ({ disable, onClick, text }: Props): React.ReactElement {
  return (
    <button
      className={disable ? 'disable' : ''}
      disabled={disable}
      onClick={onClick}
    >{text}</button>
  );
}

export default Button;
