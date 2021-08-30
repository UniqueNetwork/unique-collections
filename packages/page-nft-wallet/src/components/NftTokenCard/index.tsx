// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import type { NftCollectionInterface } from '@polkadot/react-hooks/useCollection';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import Item from 'semantic-ui-react/dist/commonjs/views/Item';

import envConfig from '@polkadot/apps-config/envConfig';
import pencil from '@polkadot/react-components/ManageCollection/pencil.svg';
import transfer from '@polkadot/react-components/ManageCollection/transfer.svg';
import Tooltip from '@polkadot/react-components/Tooltip';
import { useSchema } from '@polkadot/react-hooks';
import { HoldType } from '@polkadot/react-hooks/useCollections';

const { canEditToken } = envConfig;

interface Props {
  account: string;
  canTransferTokens: boolean;
  collection: NftCollectionInterface;
  onHold: HoldType[];
  openTransferModal: (collection: NftCollectionInterface, tokenId: string, balance: number) => void;
  token: string;
  tokensSelling: string[];
}

function NftTokenCard ({ account, canTransferTokens, collection, onHold, openTransferModal, token, tokensSelling }: Props): React.ReactElement<Props> {
  const { attributes, reFungibleBalance, tokenUrl } = useSchema(account, collection.id, token);
  const [tokenState, setTokenState] = useState<'none' | 'selling' | 'onHold'>('none');
  const history = useHistory();

  const openDetailedInformationModal = useCallback((collectionId: string | number, tokenId: string) => {
    history.push(`/wallet/token-details?collectionId=${collectionId}&tokenId=${tokenId}`);
  }, [history]);

  const editToken = useCallback((collectionId: string, tokenId: string) => {
    history.push(`/wallet/manage-token?collectionId=${collectionId}&tokenId=${tokenId}`);
  }, [history]);

  const attrebutesToShow = useMemo(() => {
    if (attributes) {
      return [...Object.keys(attributes).map((attr: string) => {
        if (attr.toLowerCase().includes('hash')) {
          return `${attr}: ${(attributes[attr] as string).substring(0, 8)}...`;
        }

        if (Array.isArray(attributes[attr])) {
          return `${attr}: ${((attributes[attr] as string[]).join(', '))}`;
        }

        return `${attr}: ${(attributes[attr] as string)}`;
      })].join(', ');
    }

    return '';
  }, [attributes]);

  const updateTokenState = useCallback(() => {
    let tState: 'none' | 'selling' | 'onHold' = 'none';

    if (tokensSelling.indexOf(token) !== -1) {
      tState = 'selling';
    } else if (onHold.find((item) => item.tokenId === token)) {
      tState = 'onHold';
    }

    setTokenState(tState);
  }, [onHold, token, tokensSelling]);

  useEffect(() => {
    updateTokenState();
  }, [updateTokenState]);

  if (!reFungibleBalance && collection?.Mode?.reFungible) {
    return <></>;
  }

  return (
    <div
      className='token-row'
      key={token}
    >
      <div
        className='token-image'
        onClick={openDetailedInformationModal.bind(null, collection.id, token)}
      >
        { tokenUrl && (
          <Item.Image
            size='mini'
            src={tokenUrl}
          />
        )}
      </div>
      <div
        className='token-info-attributes'
        onClick={openDetailedInformationModal.bind(null, collection.id, token)}
      >
        <div className='token-name'>
          #{token.toString()}
        </div>
        <div className='token-balance'>
          { collection && Object.prototype.hasOwnProperty.call(collection.Mode, 'reFungible') && <span>Balance: {reFungibleBalance}</span> }
        </div>
        <div className='token-attributes'>
          { attributes && Object.values(attributes).length > 0 && (
            <span>
              <strong>Attributes: </strong>{attrebutesToShow}
            </span>
          )}
        </div>
      </div>
      <div className='token-actions'>
        { canEditToken && tokenState === 'none' && (
          <>
            <img
              alt={'add'}
              data-for='Edit nft'
              data-tip='Edit nft'
              onClick={editToken.bind(null, collection.id, token)}
              src={pencil as string}
              title='add'
            />
            <Tooltip
              arrowColor={'transparent'}
              backgroundColor={'var(--border-color)'}
              place='bottom'
              text={'Edit nft'}
              textColor={'var(--sub-header-text-transform)'}
              trigger={'Edit nft'}
            />
          </>
        )}
        { canTransferTokens && tokenState === 'none' && (
          <>
            <img
              alt={'add'}
              data-for='Transfer nft'
              data-tip='Transfer nft'
              onClick={openTransferModal.bind(null, collection, token, reFungibleBalance)}
              src={transfer as string}
              title='add'
            />
            <Tooltip
              arrowColor={'transparent'}
              backgroundColor={'var(--border-color)'}
              place='bottom'
              text={'Transfer nft'}
              textColor={'var(--sub-header-text-transform)'}
              trigger={'Transfer nft'}
            />
          </>
        )}
        { tokenState === 'selling' && (
          <span className='token-state'>
            Selling
          </span>
        )}
        { tokenState === 'onHold' && (
          <span className='token-state'>
            On hold
          </span>
        )}
      </div>
    </div>
  );
}

export default React.memo(NftTokenCard);
