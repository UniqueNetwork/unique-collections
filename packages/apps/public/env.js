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
    DECIMALS: defaults('${DECIMALS}', 6),
    DISCORD_CHANNEL: defaults('${DISCORD_CHANNEL}', 'https://discord.com/invite/8jghD8V9PU'),
    FAVICON_PATH: defaults('${FAVICON_PATH}', 'favicons/marketplace'),
    GRAPH_QL_ADMIN_SECRET: defaults('${GRAPH_QL_ADMIN_SECRET}', 'hepM3wfsATBoI-ix2uhsAodr1j99MThPF5LBZJI2YtHAax7W9BIP9F8IWuzcNUC4'),
    GRAPH_QL_API: defaults('${GRAPH_QL_API}', 'https://dev-api-explorer.unique.network/v1/graphql'),
    IMAGE_SERVER_URL: defaults('${IMAGE_SERVER_URL}', 'https://dev-offchain-api.unique.network'),
    MIN_PRICE: defaults('${MIN_PRICE}', 0.000001),
    UNIQUE_SUBSTRATE_API: defaults('${UNIQUE_SUBSTRATE_API}', 'wss://ws-opal.unique.network'),
    UNQ_TELEGRAM: defaults('${UNQ_TELEGRAM}', 'https://t.me/unique2faucet_opal_bot'),
    UNQ_WALLET: defaults('${UNQ_WALLET}', 'https://wallet-opal.unique.network/#/myStuff/nft?collectionId='),
    WHITE_LABEL_URL: defaults('${WHITE_LABEL_URL}', 'https://whitelabel.unique.network')
  };

  // eslint-disable-next-line no-template-curly-in-string
  window.ENV.TAG = defaults('${TAG}', '');

  // eslint-disable-next-line no-template-curly-in-string
  window.ENV.PRODUCTION = defaults('${PRODUCTION}', false);
}(this));
