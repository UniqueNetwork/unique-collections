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

  window.ENV = window.ENV || {
    COMMISSION: defaults('${COMMISSION}', 10),
    CONTRACT_ADDRESS: defaults('${CONTRACT_ADDRESS}', '5GPbxrVzvjRHUSQUS9BNUFe2Q4KVfsYZtG1CTRaqe51rNSAX'),
    DECIMALS: defaults('${DECIMALS}', 6),
    DISCORD_CHANNEL: defaults('${DISCORD_CHANNEL}', 'https://discord.com/invite/8jghD8V9PU'),
    ESCROW_ADDRESS: defaults('${ESCROW_ADDRESS}', '5DACuDR8CXXmQS3tpGyrHZXoJ6ds7bjdRb4wVqqSt2CMfAoG'),
    FAVICON_PATH: defaults('${FAVICON_PATH}', 'favicons/marketplace'),
    GRAPH_QL_ADMIN_SECRET: defaults('${GRAPH_QL_ADMIN_SECRET}', 'hepM3wfsATBoI-ix2uhsAodr1j99MThPF5LBZJI2YtHAax7W9BIP9F8IWuzcNUC4'),
    GRAPH_QL_API: defaults('${GRAPH_QL_API}', 'https://dev-api-explorer.unique.network/v1/graphql'),
    IMAGE_SERVER_URL: defaults('${IMAGE_SERVER_URL}', 'https://dev-offchain-api.unique.network'),
    IPFS_GATEWAY: defaults('${IPFS_GATEWAY}', 'https://dev-ipfs.unique.network/ipfs'),
    KUSAMA_API: defaults('${KUSAMA_API}', 'wss://pub.elara.patract.io/kusama'),
    KUSAMA_BACKUP_API: defaults('${KUSAMA_BACKUP_API}', 'wss://polkadot.api.onfinality.io/public-ws'),
    KUSAMA_DECIMALS: defaults('${KUSAMA_DECIMALS}', 12),
    MAX_GAS: defaults('${MAX_GAS}', 1000000000000),
    MIN_PRICE: defaults('${MIN_PRICE}', 0.000001),
    MIN_TED_COLLECTION: defaults('${MIN_TED_COLLECTION}', 1),
    QUOTE_ID: defaults('${QUOTE_ID}', 2),
    UNIQUE_SUBSTRATE_API: defaults('${UNIQUE_SUBSTRATE_API}', 'wss://ws-opal.unique.network'),
    UNQ_TELEGRAM: defaults('${UNQ_TELEGRAM}', 'https://t.me/unique2faucetbot'),
    UNQ_WALLET: defaults('${UNQ_WALLET}', 'https://dev-wallet.unique.network/#/myStuff/nft?collectionId='),
    VALUE: defaults('${VALUE}', 0),
    WHITE_LABEL_URL: defaults('${WHITE_LABEL_URL}', 'https://whitelabel.unique.network')
  };

  // eslint-disable-next-line no-template-curly-in-string
  window.ENV.TAG = defaults('${TAG}', '');

  // eslint-disable-next-line no-template-curly-in-string
  window.ENV.PRODUCTION = defaults('${PRODUCTION}', false);
}(this));
