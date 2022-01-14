// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

// determines whether the screen width is less than the threshold
export const useScreenWidthFromThreshold = (threshold: number): [lessThanThreshold: boolean] => {
  const media = window.matchMedia(`(max-width: ${threshold}px)`);
  const [lessThanThreshold, setLessThanThreshold] = useState(media.matches);

  console.log('lessThanThreshold', lessThanThreshold);

  useEffect(() => {
    const listener = () => {
      console.log('media2', media);
      setLessThanThreshold(media.matches);
    };

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, []);

  return [lessThanThreshold];
};
