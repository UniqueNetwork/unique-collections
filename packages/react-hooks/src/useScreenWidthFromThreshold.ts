// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

// determines whether the screen width is less than the threshold
export const useScreenWidthFromThreshold = (threshold:number): [lessThanThreshold: boolean] => {

    const media = window.matchMedia(`(max-width: ${threshold}px)`);
    const [lessThanThreshold, setLessThanThreshold] = useState(media.matches);

    media.onchange = () => {
        setLessThanThreshold(media.matches);
    }

    return [lessThanThreshold];
}
