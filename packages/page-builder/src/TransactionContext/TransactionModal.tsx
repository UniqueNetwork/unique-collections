// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';
import styled from 'styled-components';
import check from '../images/check.svg';

export type TransactionType = {
  state: 'not-active' | 'active' | 'finished' | 'error';
  step: number;
  text: string;
}

interface Props {
  className?: string;
  closeModal: () => void;
  transactions: TransactionType[];
}

const defaultTransactions: TransactionType[] = [
  {
    state: 'finished',
    step: 1,
    text: 'Setting image location'
  },
  {
    state: 'active',
    step: 2,
    text: 'Setting collection trait'
  },
  {
    state: 'not-active',
    step: 3,
    text: 'Setting something else'
  }
]

function TransactionModal ({ className = '', closeModal, transactions = defaultTransactions }: Props): React.ReactElement<Props> {
  return (
    <Modal
      className={`${className} transition-modal unique-modal`}
      onClose={closeModal}
      open
      size='tiny'
    >
      <Modal.Header>
        <h2>Please wait</h2>
      </Modal.Header>
      <Modal.Content>
        { transactions.map((transaction) => {
          if (transaction.state === 'finished') {
            return (
              <div className='transition-modal-row with-icon'>
                <img
                  alt='check'
                  src={check as string}
                />
                <div>
                  {transaction.text}
                  <p>Step {transaction.step}</p>
                </div>
              </div>
            );
          }

          if (transaction.state === 'active') {
            return (
              <div className='transition-modal-row'>
                <Loader
                  active
                  className='load-transaction'
                >
                  {transaction.text}
                  <p>Step {transaction.step}</p>
                </Loader>
              </div>
            )
          }

          return (
            <div className='transition-modal-row with-icon'>
              <div />
                <div>
                  {transaction.text}
                  <p>Step {transaction.step}</p>
                </div>
            </div>
          )
        })}
      </Modal.Content>
    </Modal>
  );
}

export default React.memo(styled(TransactionModal)`
  background: #f2f2f2;

  &.transition-modal.unique-modal {

    .content {
      padding-bottom: calc((var(--gap) / 2) * 3) !important;
    }
  }

  .transition-modal-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;

    &.with-icon {
      font-size: 18px;
      line-height: 26px;
      display: grid;
      grid-template-columns: 24px 1fr;
      grid-column-gap: 16px;

      img {
        width: 24px;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    p {
      color: var(--input-placeholder-search-color);
      font-size: 14px;
      line-height: 22px;
      margin: 4px 0 0 0;
    }

    .load-transaction {
      &.ui.loader {
        color: var(--title-color);
        font-size: 18px;
        line-height: 26px;
        display: block;
        transform: translateX(0%) translateY(0%);
        left: 0;
        top: 0;

        &:after {
          border-color: var(--link-color) transparent transparent;
          border-width: 2px;
          left: 0;
        }

        &:before {
          border-color: var(--link-color);
          left: 0;
        }

        &.text {
          padding: 0 0 0 40px;
          text-align: left;
        }
      }
    }
  }
`);
