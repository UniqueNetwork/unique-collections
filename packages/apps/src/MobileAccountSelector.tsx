// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OpenPanelType } from '@polkadot/apps-routing/types';

import React, { memo, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import IdentityIcon from '@polkadot/react-components/IdentityIcon';

import menuArrow from './images/menu-arrow.svg';
import userIcon from './images/userIcon.svg';

interface MobileAccountSelectorProps {
  address?: string;
  openPanel: OpenPanelType;
  setOpenPanel: (openPanel: OpenPanelType) => void;
}

const MobileAccountSelector = (props: MobileAccountSelectorProps): React.ReactElement<MobileAccountSelectorProps> => {
  const { address, openPanel, setOpenPanel } = props;

  const onClick = useCallback(() => {
    if (openPanel !== 'accounts') {
      setOpenPanel('accounts');
    } else {
      setOpenPanel('tokens');
    }
  }, [openPanel, setOpenPanel]);

  return (
    <div
      className={`mobile-account-selector ${!address ? 'create-button-wrapper' : ''}`}
    >
      { (address && (
        <>
          <IdentityIcon
            canNotCopy
            className='identity-icon'
            onClick={onClick}
            value={address}
          />

          <img
            alt='menu-arrow'
            className='menu-arrow'
            onClick={onClick}
            src={menuArrow as string}
          />
          <img
            alt='user-icon'
            className='user-icon'
            onClick={onClick}
            src={userIcon as string}
          />
        </>)) ||
          <Menu className='create-account'>
            <Menu.Item
              active={location.pathname === '/accounts'}
              as={NavLink}
              className='create-account-btn'
              name='Create or connect account'
              to='/accounts'
            />
          </Menu>}
    </div>
  );
};

export default memo(MobileAccountSelector);
