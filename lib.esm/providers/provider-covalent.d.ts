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
import { FetchRequest } from "../utils/index.js";
import { Network } from "./network.js";
import { JsonRpcProvider } from "./provider-jsonrpc.js";
import type { AbstractProvider } from "./abstract-provider.js";
import type { CommunityResourcable } from "./community.js";
import type { Networkish } from "./network.js";
/**
 *  The **CovalentRPCProvider** connects to the [[link-covalent]]
 *  JSON-RPC end-points.
 *
 *  By default, a highly-throttled API token is used, which is
 *  appropriate for quick prototypes and simple scripts. To
 *  gain access to an increased rate-limit, it is highly
 *  recommended to [sign up here](link-covalent).
 */
export declare class CovalentRPCProvider extends JsonRpcProvider implements CommunityResourcable {
    /**
     *  The API token.
     */
    readonly token: string;
    /**
     *  Creates a new **CovalentRPCProvider**.
     */
    constructor(_network?: Networkish, token?: null | string);
    _getProvider(chainId: number): AbstractProvider;
    isCommunityResource(): boolean;
    /**
     *  Returns a new request prepared for %%network%% and the
     *  %%token%%.
     */
    static getRequest(network: Network, token?: null | string): FetchRequest;
}
//# sourceMappingURL=provider-covalent.d.ts.map