// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';
import React from "react";

interface Props {
  text:string;
  disable:boolean;
  onClick:any;
}

function Button ({text, disable, onClick}: Props): React.ReactElement {

  return (
    <button
      onClick={onClick}
      disabled={disable}
      className={disable ? 'disable': ''}>{text}</button>
  );
}

export default Button;
