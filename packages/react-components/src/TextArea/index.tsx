// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { useCallback } from 'react';

import Labelled from '../Labelled';

interface Props {
  children?: React.ReactNode;
  className?: string;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isReadOnly?: boolean;
  label?: React.ReactNode;
  maxLength?: number;
  onChange?: (arg: string) => void;
  onBlur?: (arg: string) => void;
  placeholder?: string;
  seed?: string;
  withLabel?: boolean;
}

function Index ({ children, className, help, isDisabled, isError, isReadOnly, label, maxLength, onBlur, onChange, placeholder, seed, withLabel }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>): void => {
      if (!maxLength || value.length <= maxLength) {
        onChange && onChange(value);
      }
    },
    [maxLength, onChange]
  );

  const _onBlur = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>): void => {
      if (value) {
        onBlur && onBlur(value);
      }
    },
    [onBlur]
  );

  return (
    <Labelled
      className={className}
      help={help}
      label={label}
      withLabel={withLabel}
    >
      <div className='TextAreaWithDropdown'>
        <textarea
          autoCapitalize='off'
          autoCorrect='off'
          autoFocus={false}
          className={isError ? 'ui-textArea-withError' : ''}
          disabled={isDisabled}
          onBlur={_onBlur}
          onChange={_onChange}
          placeholder={placeholder}
          readOnly={isReadOnly}
          spellCheck={false}
          value={seed}
        />
        {children}
      </div>
    </Labelled>
  );
}

export default React.memo(Index);
