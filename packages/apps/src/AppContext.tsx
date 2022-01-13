// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { Dispatch, SetStateAction, useState } from 'react';

interface IAppContext {
  previewButtonDisplayed: boolean;
  setPreviewButtonDisplayed: Dispatch<SetStateAction<boolean>>;
}

interface Props {
  children: React.ReactNode;
}

const AppCtx = React.createContext<IAppContext>({ previewButtonDisplayed: false, setPreviewButtonDisplayed: () => { } });

function AppProvider({ children }: Props): React.ReactElement<Props> {
  const [previewButtonDisplayed, setPreviewButtonDisplayed] = useState(false);


  return (
    <AppCtx.Provider value={{ previewButtonDisplayed, setPreviewButtonDisplayed }}>
      {children}
    </AppCtx.Provider>
  );
}

export default React.memo(AppProvider);

export { AppCtx };
