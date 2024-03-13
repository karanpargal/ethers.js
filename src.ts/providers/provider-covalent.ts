/**
 *  [[link-covalent]] provides a third-party service for connecting to
 *  various blockchains over JSON-RPC.
 *
 *  **Supported Networks**
 *
 *  - Ethereum Mainnet (``eth-mainnet``)
 *
 *  @_subsection: api/providers/thirdparty:Covalent  [providers-covalent]
 */

import {
  defineProperties,
  FetchRequest,
  assertArgument,
} from "../utils/index.js";

import { showThrottleMessage } from "./community.js";
import { Network } from "./network.js";
import { JsonRpcProvider } from "./provider-jsonrpc.js";

import type { AbstractProvider } from "./abstract-provider.js";
import type { CommunityResourcable } from "./community.js";
import type { Networkish } from "./network.js";

const defaultToken = "cqt_rQBwgX9hXFkMFHY4kXrqKCjqghgK";

function getHost(name: string): string {
  switch (name) {
    case "mainnet":
      return "api.covalenthq.com/v1/eth-mainnet";
    case "goerli":
      return "api.covalenthq.com/v1/eth-goerli";
    case "sepolia":
      return "api.covalenthq.com/v1/eth-sepolia";
    case "holesky":
      return "api.covalenthq.com/v1/eth-holesky";
    case "arbitrum":
      return "api.covalenthq.com/v1/arbitrum-mainnet";
    case "arbitrum-goerli":
      return "api.covalenthq.com/v1/arbitrum-goerli";
    case "arbitrum-sepolia":
      return "api.covalenthq.com/v1/arbitrum-sepolia";
    case "base":
      return "api.covalenthq.com/v1/base-mainnet";
    case "base-goerli":
      return "api.covalenthq.com/v1/base-testnet";
    case "base-spolia":
      return "api.covalenthq.com/v1/base-sepolia-testnet";
    case "bnb":
      return "api.covalenthq.com/v1/bsc-mainnet";
    case "bnbt":
      return "api.covalenthq.com/v1/bsc-testnet";
    case "matic":
      return "api.covalenthq.com/v1/matic-mainnet";
    case "matic-mumbai":
      return "api.covalenthq.com/v1/matic-mumbai";
    case "optimism":
      return "api.covalenthq.com/v1/optimism-mainnet";
    case "optimism-goerli":
      return "api.covalenthq.com/v1/optimism-goerli";
    case "optimism-sepolia":
      return "api.covalenthq.com/v1/optimism-sepolia";
  }

  assertArgument(false, "unsupported network", "network", name);
}

/**
 *  The **CovalentRPCProvider** connects to the [[link-covalent]]
 *  JSON-RPC end-points.
 *
 *  By default, a highly-throttled API token is used, which is
 *  appropriate for quick prototypes and simple scripts. To
 *  gain access to an increased rate-limit, it is highly
 *  recommended to [sign up here](link-covalent).
 */
export class CovalentRPCProvider
  extends JsonRpcProvider
  implements CommunityResourcable
{
  /**
   *  The API token.
   */
  readonly token!: string;

  /**
   *  Creates a new **CovalentRPCProvider**.
   */
  constructor(_network?: Networkish, token?: null | string) {
    if (_network == null) {
      _network = "mainnet";
    }
    const network = Network.from(_network);
    if (token == null) {
      token = defaultToken;
    }

    const request = CovalentRPCProvider.getRequest(network, token);
    super(request, network, { staticNetwork: network });

    defineProperties<CovalentRPCProvider>(this, { token });
  }

  _getProvider(chainId: number): AbstractProvider {
    try {
      return new CovalentRPCProvider(chainId, this.token);
    } catch (error) {}
    return super._getProvider(chainId);
  }

  isCommunityResource(): boolean {
    return this.token === defaultToken;
  }

  /**
   *  Returns a new request prepared for %%network%% and the
   *  %%token%%.
   */
  static getRequest(network: Network, token?: null | string): FetchRequest {
    if (token == null) {
      token = defaultToken;
    }

    const request = new FetchRequest(
      `https:/\/${getHost(network.name)}/events/?key=${token}`
    );
    request.allowGzip = true;

    if (token === defaultToken) {
      request.retryFunc = async (request, response, attempt) => {
        showThrottleMessage("CovalentRPCProvider");
        return true;
      };
    }

    return request;
  }
}
