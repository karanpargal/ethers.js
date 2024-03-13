"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CovalentRPCProvider = void 0;
const index_js_1 = require("../utils/index.js");
const community_js_1 = require("./community.js");
const network_js_1 = require("./network.js");
const provider_jsonrpc_js_1 = require("./provider-jsonrpc.js");
const defaultToken = "cqt_rQBwgX9hXFkMFHY4kXrqKCjqghgK";
function getHost(name) {
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
    (0, index_js_1.assertArgument)(false, "unsupported network", "network", name);
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
class CovalentRPCProvider extends provider_jsonrpc_js_1.JsonRpcProvider {
    /**
     *  The API token.
     */
    token;
    /**
     *  Creates a new **CovalentRPCProvider**.
     */
    constructor(_network, token) {
        if (_network == null) {
            _network = "mainnet";
        }
        const network = network_js_1.Network.from(_network);
        if (token == null) {
            token = defaultToken;
        }
        const request = CovalentRPCProvider.getRequest(network, token);
        super(request, network, { staticNetwork: network });
        (0, index_js_1.defineProperties)(this, { token });
    }
    _getProvider(chainId) {
        try {
            return new CovalentRPCProvider(chainId, this.token);
        }
        catch (error) { }
        return super._getProvider(chainId);
    }
    isCommunityResource() {
        return this.token === defaultToken;
    }
    /**
     *  Returns a new request prepared for %%network%% and the
     *  %%token%%.
     */
    static getRequest(network, token) {
        if (token == null) {
            token = defaultToken;
        }
        const request = new index_js_1.FetchRequest(`https:/\/${getHost(network.name)}/events/?key=${token}`);
        request.allowGzip = true;
        if (token === defaultToken) {
            request.retryFunc = async (request, response, attempt) => {
                (0, community_js_1.showThrottleMessage)("CovalentRPCProvider");
                return true;
            };
        }
        return request;
    }
}
exports.CovalentRPCProvider = CovalentRPCProvider;
//# sourceMappingURL=provider-covalent.js.map