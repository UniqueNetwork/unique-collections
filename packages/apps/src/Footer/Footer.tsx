// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { memo, ReactElement, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { UnqButton } from '@polkadot/react-components';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import packageJson from '../../../../package.json';
import discord from '../../public/logos/discord.svg';
import github from '../../public/logos/github.svg';
import subsocial from '../../public/logos/subsocial.svg';
import telegram from '../../public/logos/telegram.svg';
import twitter from '../../public/logos/twitter.svg';

interface IFooterProps{
  isPreviewOpen: boolean;
  showPreview: (ev: boolean) => void;
  className: string;
}

function Footer (props: IFooterProps): ReactElement {
  const [isPreviewBtnShown, setIsPreviewBtnShown] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/builder/new-collection/main-information') {
      setIsPreviewBtnShown(true);
    } else {
      setIsPreviewBtnShown(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleOnBtnClick = useCallback(() => {
    props.showPreview(isPreviewBtnShown);
  }, [isPreviewBtnShown, props]);

  return (
    <div className={props.className}>
      <div className={`app-footer ${props.className || ''} ${isPreviewBtnShown ? 'app-footer-with-preview-btn' : ''}`}>
        <div className='app-footer--container'>
          <div className='app-footer__info'>
            <div className='app-footer__info__powered'>Powered by
              <a
                href='https://unique.network/'
                rel='noreferrer nooperer'
                target='_blank'
              >Unique Network</a> —
            the NFT chain build for Polkadot and Kusama.
            </div>
            <div className='app-footer__info__version'>Version {(packageJson as { version: string }).version}</div>
          </div>
          <div className='app-footer__social-links'>
            <a
              href='https://t.me/Uniquechain'
              rel='noreferrer nooperer'
              target='_blank'
            >
              <img
                alt='telegram'
                src={telegram as string}
              />
            </a>
            <a
              href='https://twitter.com/Unique_NFTchain'
              rel='noreferrer nooperer'
              target='_blank'
            >
              <img
                alt='twitter'
                src={twitter as string}
              />
            </a>
            <a
              href='https://discord.gg/jHVdZhsakC'
              rel='noreferrer nooperer'
              target='_blank'
            >
              <img
                alt='discord'
                src={discord as string}
              />
            </a>
            <a
              href='https://github.com/UniqueNetwork'
              rel='noreferrer nooperer'
              target='_blank'
            >
              <img
                alt='github'
                src={github as string}
              />
            </a>
            <a
              href='https://app.subsocial.network/@UniqueNetwork_NFT'
              rel='noreferrer nooperer'
              target='_blank'
            >
              <img
                alt='subsocial'
                src={subsocial as string}
              />
            </a>
          </div>
        </div>
        {isPreviewBtnShown &&
          <div className='app-footer-preview-btn'>
            <UnqButton
              content={props.isPreviewOpen ? 'Back' : 'Preview'}
              onClick={handleOnBtnClick}
              size='large'
            />
          </div>
        }
      </div>
    </div>
  );
}

export default memo(styled(Footer)`
  background: var(--card-background);
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  padding: 0 !important;

  .app-footer--container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gap);
  }

  .app-footer__info {
    color: var(--foter-text-color);
  }

  .app-footer__social-links {
    display: flex;
    grid-column-gap: calc(var(--gap)/2);
    padding-bottom: calc(var(--gap)/2);

    a {
      display: flex;
      justify-content: center;
    }
  }

  a {
    color: var(--link-color);
  }

  @media(max-width: 768px) {
    .app-footer-preview-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 16px;
      background-color: white;
      position: fixed;
      bottom: 0;
      width:100%;
      box-shadow: 0px -8px 12px rgba(0, 0, 0, 0.06);
    }

    .app-footer-with-preview-btn{
      position: relative;
      bottom: 50px;
      margin: 32px auto 0;
      display: block;
      padding-bottom:16px;
     }
  }

  @media (max-width: 1024px) {
    border-top: 1px solid var(--enum-input-border-disabled-color);
    padding: calc(var(--gap)/2);

    .app-footer--container {
      align-items: flex-start;
      flex-direction: column;
      grid-row-gap: calc(var(--gap)/2);
    }
  }

  @media (min-width: 1025px) {
    .app-footer-preview-btn{
      display:none;
     }
   }

  @media (max-width: 768px) {
    border-top: 1px solid var(--enum-input-border-disabled-color);
    padding: 24px;

    .app-footer--container {
      align-items: flex-start;
      flex-direction: column;
      grid-row-gap: calc(var(--gap)/2);
    }
  }

  @media (max-width: 320px) {
    border-top: 1px solid var(--enum-input-border-disabled-color);
    padding: var(--gap);

    .app-footer--container {
      align-items: flex-start;
      flex-direction: column;
      grid-row-gap: calc(var(--gap)/2);
    }
  }
`);
