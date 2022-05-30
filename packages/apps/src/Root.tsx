// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';

import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import envConfig from '@polkadot/apps-config/envConfig';
import { Api } from '@polkadot/react-api';
import Queue from '@polkadot/react-components/Status/Queue';
import { BlockAuthors, Events } from '@polkadot/react-query';
import { settings } from '@polkadot/ui-settings';

import AppProvider from './AppContext';
import Apps from './Apps';
import { Themes, uniqueTheme } from './themes';
import WindowDimensions from './WindowDimensions';

const { uniqueSubstrateApi } = envConfig;

function createTheme ({ uiTheme }: { uiTheme: string }): ThemeDef {
  const validTheme = Themes.find((themeElem) => {
    return (themeElem.domain && window.location.href.includes(themeElem.domain)) || (themeElem.ip && window.location.href.includes(themeElem.ip));
  });

  document && document.documentElement &&
    document.documentElement.setAttribute('data-theme', validTheme ? validTheme.theme : 'Unique');

  return validTheme || uniqueTheme;
}

function Root (): React.ReactElement {
  const [theme, setTheme] = useState(() => createTheme(settings));

  useEffect((): void => {
    settings.on('change', (settings) => setTheme(createTheme(settings)));
  }, []);

  return (
    <Suspense fallback='...'>
      <ThemeProvider theme={theme}>
        <Queue>
          <Api
            url={uniqueSubstrateApi}
          >
            <BlockAuthors>
              <Events>
                <HashRouter>
                  <WindowDimensions>
                    <AppProvider>
                      <Apps />
                    </AppProvider>
                  </WindowDimensions>
                </HashRouter>
              </Events>
            </BlockAuthors>
          </Api>
        </Queue>
      </ThemeProvider>
    </Suspense>
  );
}

export default React.memo(Root);
