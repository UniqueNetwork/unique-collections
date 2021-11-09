// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';
import uploadIcon from '../../images/uploadIcon.svg'

import React from 'react';
import WarningText from "@polkadot/app-builder/components/WarningText";
import Button from "../Button";

function Cover (): React.ReactElement {
  return (
    <div className='cover'>
      <h1 className='header-text'>Cover</h1>
      <div className='info-block'>
        <h2>Upload image</h2>
        <p>Choose JPG, PNG, GIF (max 10 Mb)</p>
        <div className='upload-img'>
          <img src={uploadIcon as string} />
        </div>
      </div>
      <WarningText/>
      <Button
      text="Confirm"
      onClick={()=>console.log('Click on confirm')}
      disable={true}
      />
    </div>
  );
}

export default Cover;
