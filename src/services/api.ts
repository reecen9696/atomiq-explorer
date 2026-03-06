import type {
  StatsResponse,
  PaginatedBets,
  BetRecord,
  BetResponse,
  FlipRequest,
  BetRequest,
} from "../types/api";

// Anti-debugging protection with toggle flag
const ENABLE_ANTI_DEBUG = import.meta.env.VITE_ENABLE_ANTI_DEBUG !== "false";

if (import.meta.env.PROD && ENABLE_ANTI_DEBUG) {
  (function () {
    let devtools = { open: false, orientation: null };

    setInterval(function () {
      if (
        window.outerHeight - window.innerHeight > 200 ||
        window.outerWidth - window.innerWidth > 200
      ) {
        if (!devtools.open) {
          devtools.open = true;
          // Force debugger pause
          debugger;
          // Additional protection
          console.clear();
          console.log(
            "%cDeveloper tools detected!",
            "color: red; font-size: 30px; font-weight: bold;"
          );
          // Infinite debugger loop
          while (true) {
            debugger;
          }
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  })();
}

// Configuration
const getApiBaseUrl = () => {
  // Check if environment variable is set
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Default URLs based on environment
  if (import.meta.env.PROD) {
    return "https://api.atomiq.network";
  } else {
    return "http://localhost:8080";
  }
};

const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

class BlockchainCasinoApi {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic request handler with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 429) {
        throw new ApiError(
          "Too many requests. Please slow down and try again.",
          429,
          "RATE_LIMIT"
        );
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.text();
          if (errorData) {
            errorMessage = errorData;
          }
        } catch {
          // Ignore JSON parse errors for error messages
        }

        throw new ApiError(errorMessage, response.status);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new ApiError(
          "Network error: Unable to connect to the API server",
          0,
          "NETWORK_ERROR"
        );
      }

      throw new ApiError(
        error instanceof Error ? error.message : "An unknown error occurred",
        0,
        "UNKNOWN_ERROR"
      );
    }
  }

  /**
   * Check if the API server is healthy
   */
  async healthCheck(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.text();
  }

  /**
   * Get casino statistics (combines /api/casino/stats + /status for current block)
   */
  async getStats(): Promise<StatsResponse> {
    const [statsResult, statusResult] = await Promise.allSettled([
      this.request<{
        total_wagered: number;
        gross_rtp: number;
        bet_count: number;
        bankroll: number;
        wins_24h: number;
        wagered_24h: number;
      }>("/api/casino/stats"),
      this.request<{
        sync_info: { latest_block_height: number };
      }>("/status"),
    ]);

    const stats = statsResult.status === "fulfilled" ? statsResult.value : null;
    const status = statusResult.status === "fulfilled" ? statusResult.value : null;

    if (!stats && statsResult.status === "rejected") {
      throw statsResult.reason;
    }

    return {
      current_block: status?.sync_info?.latest_block_height ?? 0,
      total_bets: stats?.bet_count ?? 0,
      total_wagered: stats?.total_wagered ?? 0,
      total_won: 0,
      gross_rtp: stats?.gross_rtp ?? 0,
      house_edge: 0,
    };
  }

  /**
   * Get paginated bet history from /api/games/recent
   */
  async getBets(
    limit: number = 20,
    _offset: number = 0,
    _wallet?: string
  ): Promise<PaginatedBets> {
    const response = await this.request<{
      games: Array<{
        game_id: string;
        tx_id: number;
        player_id: string;
        game_type: string;
        token: string;
        bet_amount: number;
        payout: number;
        outcome: string;
        coin_result: string;
        player_choice: unknown;
        vrf_proof: string;
        vrf_output: string;
        timestamp: number;
        block_height: number;
        processed: boolean;
      }>;
      next_cursor?: string;
    }>(`/api/games/recent?limit=${limit}`);

    const bets: BetRecord[] = (response.games ?? []).map((game) => ({
      tx_hash: game.game_id,
      block: game.block_height,
      amount_wagered: game.bet_amount,
      won: game.outcome === "win",
      result: game.outcome,
      payout: game.payout,
      timestamp: game.timestamp,
      game_type: String(game.game_type),
      vrf_proof: game.vrf_proof ?? "",
      vrf_output: game.vrf_output ?? "",
    }));

    return {
      bets,
      total_count: bets.length,
      has_more: response.next_cursor != null,
      page: 1,
      per_page: limit,
    };
  }

  /**
   * Make a coin flip bet (legacy endpoint)
   */
  async flipCoin(request: FlipRequest): Promise<BetResponse> {
    return this.request<BetResponse>("/v1/flip", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Make a multi-game bet
   */
  async placeBet(request: BetRequest): Promise<BetResponse> {
    return this.request<BetResponse>("/v1/bet", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Helper method to make a coin flip bet using the universal bet endpoint
   */
  async flipCoinUniversal(
    wallet: string,
    amount: number,
    nonce: number,
    choice: "heads" | "tails"
  ): Promise<BetResponse> {
    return this.placeBet({
      wallet,
      amount,
      nonce,
      game_type: "coin_flip",
      choice,
    });
  }

  /**
   * Helper method to play slots
   */
  async playSlots(
    wallet: string,
    amount: number,
    nonce: number,
    lines: number = 1
  ): Promise<BetResponse> {
    return this.placeBet({
      wallet,
      amount,
      nonce,
      game_type: "slots",
      lines,
    });
  }

  /**
   * Generate a random wallet address for demo purposes
   */
  generateDemoWallet(): string {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  }

  /**
   * Generate a random nonce for transactions
   */
  generateNonce(): number {
    return Math.floor(Math.random() * 1000000) + Date.now();
  }
}

// Create and export a singleton instance
export const api = new BlockchainCasinoApi();
export default BlockchainCasinoApi;
