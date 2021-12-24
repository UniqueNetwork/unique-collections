// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import styled from 'styled-components';

interface Props {
  closeModal: () => void;
}

function TransactionModal ({ closeModal }: Props): React.ReactElement<Props> {
  return (
    <Modal
      className='unique-modal'
      onClose={closeModal}
      open
      size='tiny'
    >
      <Modal.Header>
        <h2>Please wait</h2>
      </Modal.Header>
      <Modal.Content>
        Transaction Modal
      </Modal.Content>
    </Modal>
  );
}

export default React.memo(styled(TransactionModal)`
  background: #f2f2f2;
`);
