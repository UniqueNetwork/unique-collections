// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback, useState } from 'react';

import EnumInputItem from './EnumInputItem';

interface Props {
  isDisabled?: boolean;
  maxSymbols?: number;
  setValues: (values: string[]) => void;
  values: string[];
}

function EnumInput ({ isDisabled, maxSymbols, setValues, values }: Props): React.ReactElement {
  // const [allEnums, setAllEnums] = useState<string[]>(values);
  const [currentEnum, setCurrentEnum] = useState<string>('');

  const addItem = useCallback(() => {
    if (!currentEnum) {
      return;
    }

    if (currentEnum.length && !values.find((item: string) => item.toLowerCase() === currentEnum.toLowerCase())) {
      setValues([
        ...values,
        currentEnum
      ]);
      setCurrentEnum('');
    } else {
      alert('Warning. You are trying to add already existed item');
      setCurrentEnum('');
    }
  }, [currentEnum, setValues, values]);

  const deleteItem = useCallback((enumItem: string) => {
    if (isDisabled) {
      return;
    }

    setValues(values.filter((item: string) => item.toLowerCase() !== enumItem.toLowerCase()));
  }, [isDisabled, setValues, values]);

  const changeCurrentEnum = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (maxSymbols && val?.length > maxSymbols) {
      return;
    }

    setCurrentEnum(e.target.value);
  }, [maxSymbols]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addItem();
    }
  }, [addItem]);

  return (
    <div className={`${isDisabled ? 'enum-input disabled' : 'enum-input'}`}>
      <div className='enum-input--content'>
        <div className='enum-input--content--elements'>
          { values.map((enumItem: string) => (
            <EnumInputItem
              deleteItem={deleteItem}
              enumItem={enumItem}
              key={enumItem}
            />
          ))}
        </div>
        <input
          className='enum-input--input'
          disabled={isDisabled}
          onBlur={addItem}
          onChange={changeCurrentEnum}
          onKeyDown={onKeyDown}
          placeholder={isDisabled ? 'Values' : ''}
          type='text'
          value={currentEnum}
        />
      </div>
    </div>
  );
}

export default memo(EnumInput);
