// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { useCallback } from 'react';

interface ButtonInterface{
  children?: React.ReactNode;
  classname?: string;
  size?: 'small' | 'medium' | 'large'| '';
  isDisabled?: boolean;
  isFilled?: boolean;
  content?: string;
  onClick?: () => any;
}

function UnqButton ({ children, classname = '', content, isDisabled = false, isFilled = false, onClick, size = '' }: ButtonInterface) {
  const handleOnClick = useCallback(() => {
    onClick && onClick();
  }, [onClick]);

  return (
    <button
      className={`unq-button${isFilled ? ' isFilled' : ''}${isDisabled ? ' isDisabled' : ''} ${classname} ${size}`}
      disabled={isDisabled}
      onClick={handleOnClick}
    >
      {children}
      {content}
    </button>
  );
}

export default React.memo(UnqButton);
