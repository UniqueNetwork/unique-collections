// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { useCallback } from 'react';

interface ButtonInterface{
  children?: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large'| '';
  isDisabled?: boolean;
  isFilled?: boolean;
  content?: string;
  onClick?: () => any;
}

function UnqButton ({ children, className = '', content, isDisabled = false, isFilled = false, onClick, size = '' }: ButtonInterface) {
  const handleOnClick = useCallback(() => {
    onClick && onClick();
  }, [onClick]);

  const getClasses = useCallback(() => {
    let buttonClasses = 'unq-button';

    isDisabled && (buttonClasses += ' isDisabled');
    isFilled && (buttonClasses += ' isFilled');
    className && (buttonClasses += ' ' + className);
    size && (buttonClasses += ' ' + size);

    return buttonClasses;
  }, [className, isDisabled, isFilled, size]);

  return (
    <button
      className={getClasses()}
      disabled={isDisabled}
      onClick={handleOnClick}
    >
      {children}
      {content}
    </button>
  );
}

export default React.memo(UnqButton);
