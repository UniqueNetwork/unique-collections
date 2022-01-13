// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

// определяет необходимость превью-режима в зависимости от ширины экрана
export const usePreviewMode = (): [previewMode: boolean] => {

    const x = window.matchMedia("(max-width: 1023px)");
    const [previewMode, setPreviewMode] = useState(x.matches);

    x.onchange = () => {
        setPreviewMode(x.matches);
    }

    return [previewMode];
}
