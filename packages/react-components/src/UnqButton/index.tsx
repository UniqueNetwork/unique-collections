// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { useCallback, useMemo } from 'react';

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

  const buttonClasses = useMemo(() => {
    let value = 'unq-button';

    isDisabled && (value += ' isDisabled');
    isFilled && (value += ' isFilled');
    className && (value += ' ' + className);
    size && (value += ' ' + size);

    return value;
  }, [className, isDisabled, isFilled, size]);

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      onClick={handleOnClick}
    >
      {children}
      {content}
    </button>
  );
}

export default React.memo(UnqButton);
