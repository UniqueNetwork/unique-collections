// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { memo, useCallback } from 'react';

import closeIcon from './closeIcon.svg';

interface Props {
  deleteItem: (enumItem: string) => void;
  enumItem: string;
}

function EnumInputItem ({ deleteItem, enumItem }: Props): React.ReactElement {
  const onDeleteItem = useCallback(() => {
    deleteItem(enumItem);
  }, [deleteItem, enumItem]);

  return (
    <div className='enum-input--item'>
      {enumItem}
      <img
        alt='delete item'
        onClick={onDeleteItem}
        src={closeIcon as string}
      />
    </div>
  );
}

export default memo(EnumInputItem);
