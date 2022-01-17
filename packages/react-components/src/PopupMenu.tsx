// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { memo, useCallback } from 'react';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';

interface Props {
  isPopupActive?: boolean
  setIsPopupActive: (active: boolean) => void;
}

const PopupMenu = (props: Props) => {
  const { isPopupActive, setIsPopupActive } = props;

  const goToWallet = useCallback(() => {
    window.open('https://wallet-opal.unique.network/', '_blank', 'noopener,noreferrer');
    setIsPopupActive(false);
  }, [setIsPopupActive]);

  return (
    <div className={`manage-balances ${isPopupActive ? 'popup active' : 'popup'}`}>
      <div className='popup-link'>
        <Menu.Item
          className=''
          name='View tokens'
          onClick={goToWallet}
        />
      </div>
    </div>
  );
};

export default memo(PopupMenu);
