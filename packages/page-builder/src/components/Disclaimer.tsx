// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';

function Disclaimer (): React.ReactElement {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleOnCheck = useCallback(() => {
    setIsChecked((prev) => !prev);
  }, []);

  return (
    <div className='disclaimer'>
      <Header as='h1'>Disclaimer</Header>
      <div className='disclaimer-content'>
        <ol>
          <li>Make sure you have <span>120 UNQ,</span> otherwise you won&#39;t be able to create a collection.</li>
          <li>Check carefully that the entered data is correct. Once confirmed, it will not be possible to return and make changes.</li>
          <li>Collections created in TestNet will not transfer into the MainNet. If you need to transfer the collection, contact the administrator.</li>
        </ol>
        <div className='custom-checkbox'>
          <div className='checkbox-input'>
            <input
              checked={isChecked}
              onChange={handleOnCheck}
              type='checkbox'
            />
          </div>
          <div className='checkbox-title'>I have read and understood this disclaimer</div>
        </div>
        <div className='disclaimer-btn'>
          <button
            className='create-btn'
            disabled
          >Start creating</button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Disclaimer);
