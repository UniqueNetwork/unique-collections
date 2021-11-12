// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

(function (window) {
  function defaults (variable, defaults) {
    if (/^\$\{(.*)\}$/.test(variable)) {
      if (/^\$\{(.*)\}$/.test(defaults)) {
        return undefined;
      }

      return defaults;
    }

    switch (typeof defaults) {
      case 'boolean':
        if (variable === true.toString()) {
          return true;
        } else if (variable === false.toString()) {
          return false;
        } else {
          return !!variable;
        }

      case 'number':
        return Number(variable);
    }

    return variable || defaults;
  }

  /*
      COMMISSION: number;
      CONTRACT_ADDRESS: string;
      DECIMALS: number;
      ENVIRONMENT: string;
      ESCROW_ADDRESS: string;
      FAVICON_PATH: string;
      KUSAMA_API: string;
      KUSAMA_BACKUP_API: string;
      KUSAMA_DECIMALS: number; // 12
      MAX_GAS: number; // 1000000000000
      MIN_PRICE: number;
      QUOTE_ID: number; // 2
      UNIQUE_API: string;
      UNIQUE_COLLECTION_IDS: string; // ['23']
      UNIQUE_SUBSTRATE_API: string;
      VALUE: number; // 0
      VERSION: string;
      WHITE_LABEL_URL: string;
   */

  window.ENV = window.ENV || {
    COMMISSION: defaults('${COMMISSION}', 10),
    CONTRACT_ADDRESS: defaults('${CONTRACT_ADDRESS}', '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'),
    DECIMALS: defaults('${DECIMALS}', 6),
    ESCROW_ADDRESS: defaults('${ESCROW_ADDRESS}', '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'),
    FAVICON_PATH: defaults('${FAVICON_PATH}', 'favicons/marketplace'),
    GRAPH_QL_ADMIN_SECRET: defaults('${GRAPH_QL_ADMIN_SECRET}', 'hepM3wfsATBoI-ix2uhsAodr1j99MThPF5LBZJI2YtHAax7W9BIP9F8IWuzcNUC4'),
    GRAPH_QL_API: defaults('${GRAPH_QL_API}', 'https://dev-api-explorer.unique.network/v1/graphql'),
    IMAGE_SERVER_URL: defaults('${IMAGE_SERVER_URL}', 'https://dev-offchain-api.unique.network'),
    KUSAMA_DECIMALS: defaults('${KUSAMA_DECIMALS}', 12),
    MAX_GAS: defaults('${MAX_GAS}', 1000000000000),
    MIN_PRICE: defaults('${MIN_PRICE}', 0.000001),
    MIN_TED_COLLECTION: defaults('${MIN_TED_COLLECTION}', 1),
    QUOTE_ID: defaults('${QUOTE_ID}', 2),
    VALUE: defaults('${VALUE}', 0),
    WHITE_LABEL_URL: defaults('${WHITE_LABEL_URL}', 'https://whitelabel.unique.network'),
    UNIQUE_API: defaults('${UNIQUE_API}', 'https://dev-api.unique.network'),
    UNIQUE_COLLECTION_IDS: defaults('${UNIQUE_COLLECTION_IDS}', [23, 25, 155].join(',')),
    UNIQUE_SUBSTRATE_API: defaults('${UNIQUE_SUBSTRATE_API}', 'wss://testnet2.uniquenetwork.io'),
    KUSAMA_API: defaults('${KUSAMA_API}', 'wss://kusama-rpc.polkadot.io'),
    KUSAMA_BACKUP_API: defaults('${KUSAMA_BACKUP_API}', 'wss://polkadot.api.onfinality.io/public-ws')
  };

  // eslint-disable-next-line no-template-curly-in-string
  window.ENV.TAG = defaults('${TAG}', '');

  // eslint-disable-next-line no-template-curly-in-string
  window.ENV.PRODUCTION = defaults('${PRODUCTION}', false);
}(this));
