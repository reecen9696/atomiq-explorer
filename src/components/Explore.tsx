import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStats, useBets } from "../hooks/useApi";
import {
  formatNumber,
  formatAmount,
  formatPercentage,
  transformBetRecord,
  createLoadingSkeleton,
  formatNumberWithCommas,
  formatSolAmount,
  copyToClipboard,
} from "../utils/dataTransforms";

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 20;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query.length > 0) {
      navigate(`/verify/${query}`);
    }
  };

  // Fetch stats and bets from API
  const { data: stats, loading: statsLoading } = useStats();
  const { data: betsData, totalPages } = useBets(currentPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Copy handler with toast feedback
  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopyFeedback(`${type} copied!`);
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  // Navigate to verification page
  const handleBetClick = (txHash: string) => {
    navigate(`/verify/${txHash}`);
  };

  // Transform bet data for display
  const displayBets =
    betsData?.bets?.map(transformBetRecord) ||
    createLoadingSkeleton(itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold font-aeonik text-white mb-2">
          Explore
        </h1>
        <p className="text-base font-aeonik text-white opacity-70">
          Review protocol stats and activity. Click any bet to verify its VRF proof.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Current Block */}
        <div className="bg-casino-card border border-casino-border rounded-lg px-4 py-2 flex flex-col justify-center text-center min-h-[80px] space-y-1">
          <div className="flex items-center justify-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 119 119"
              fill="none"
              className="flex-shrink-0"
            >
              <path
                d="M90.7029 21.2861L85.3181 26.6709L79.9334 21.2861C79.4733 20.8253 78.9269 20.4597 78.3253 20.2102C77.7238 19.9607 77.079 19.8323 76.4278 19.8323C75.7766 19.8323 75.1318 19.9607 74.5303 20.2102C73.9288 20.4597 73.3824 20.8253 72.9223 21.2861L66.7293 27.4791C62.0395 25.7106 57.0698 24.8002 52.0576 24.7917C28.8229 24.7917 9.91675 43.6978 9.91675 66.9375C9.91675 90.1772 28.8229 109.083 52.0576 109.083C75.2924 109.083 94.2035 90.1772 94.2035 66.9375C94.2006 62.4649 93.4791 58.0218 92.0664 53.7781L98.7403 47.1042C99.2012 46.6441 99.5668 46.0977 99.8163 45.4961C100.066 44.8946 100.194 44.2498 100.194 43.5986C100.194 42.9474 100.066 42.3026 99.8163 41.7011C99.5668 41.0996 99.2012 40.5532 98.7403 40.0931L92.3292 33.682L97.7338 28.2774C98.8692 27.1419 101.924 24.7917 104.125 24.7917H109.083V14.875H104.125C97.1834 14.875 91.3127 20.6614 90.7029 21.2861ZM52.0576 49.5833C47.4216 49.5833 43.0682 51.3882 39.7857 54.6656C38.1708 56.2744 36.8906 58.1872 36.0191 60.2935C35.1477 62.3999 34.7022 64.658 34.7084 66.9375H24.7917C24.7917 59.6587 27.623 52.8112 32.7697 47.6595C35.2962 45.1177 38.302 43.1025 41.6128 41.7305C44.9236 40.3585 48.4738 39.657 52.0576 39.6667V49.5833Z"
                fill="white"
              />
              <path
                d="M68 60.5C68 72.6503 58.1503 82.5 46 82.5C33.8497 82.5 24 72.6503 24 60.5C24 48.3497 33.8497 38.5 46 38.5C58.1503 38.5 68 48.3497 68 60.5Z"
                fill="white"
              />
            </svg>
            <p className="text-lg font-medium font-aeonik text-white">
              {statsLoading
                ? "Loading..."
                : formatNumberWithCommas(stats?.current_block || 0)}
            </p>
          </div>
          <h3 className="text-sm font-aeonik text-gray-400">Current Block</h3>
        </div>

        {/* Number of Bets */}
        <div className="bg-casino-card border border-casino-border rounded-lg px-4 py-2 flex flex-col justify-center text-center min-h-[80px] space-y-1">
          <div className="flex items-center justify-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 119 119"
              fill="none"
              className="flex-shrink-0"
            >
              <path
                d="M90.7029 21.2861L85.3181 26.6709L79.9334 21.2861C79.4733 20.8253 78.9269 20.4597 78.3253 20.2102C77.7238 19.9607 77.079 19.8323 76.4278 19.8323C75.7766 19.8323 75.1318 19.9607 74.5303 20.2102C73.9288 20.4597 73.3824 20.8253 72.9223 21.2861L66.7293 27.4791C62.0395 25.7106 57.0698 24.8002 52.0576 24.7917C28.8229 24.7917 9.91675 43.6978 9.91675 66.9375C9.91675 90.1772 28.8229 109.083 52.0576 109.083C75.2924 109.083 94.2035 90.1772 94.2035 66.9375C94.2006 62.4649 93.4791 58.0218 92.0664 53.7781L98.7403 47.1042C99.2012 46.6441 99.5668 46.0977 99.8163 45.4961C100.066 44.8946 100.194 44.2498 100.194 43.5986C100.194 42.9474 100.066 42.3026 99.8163 41.7011C99.5668 41.0996 99.2012 40.5532 98.7403 40.0931L92.3292 33.682L97.7338 28.2774C98.8692 27.1419 101.924 24.7917 104.125 24.7917H109.083V14.875H104.125C97.1834 14.875 91.3127 20.6614 90.7029 21.2861ZM52.0576 49.5833C47.4216 49.5833 43.0682 51.3882 39.7857 54.6656C38.1708 56.2744 36.8906 58.1872 36.0191 60.2935C35.1477 62.3999 34.7022 64.658 34.7084 66.9375H24.7917C24.7917 59.6587 27.623 52.8112 32.7697 47.6595C35.2962 45.1177 38.302 43.1025 41.6128 41.7305C44.9236 40.3585 48.4738 39.657 52.0576 39.6667V49.5833Z"
                fill="white"
              />
              <path
                d="M68 60.5C68 72.6503 58.1503 82.5 46 82.5C33.8497 82.5 24 72.6503 24 60.5C24 48.3497 33.8497 38.5 46 38.5C58.1503 38.5 68 48.3497 68 60.5Z"
                fill="white"
              />
            </svg>
            <p className="text-lg font-medium font-aeonik text-white">
              {statsLoading
                ? "Loading..."
                : formatNumber(stats?.total_bets || 0)}
            </p>
          </div>
          <h3 className="text-sm font-aeonik text-gray-400">Number of Bets</h3>
        </div>

        {/* Gross RTP */}
        <div className="bg-casino-card border border-casino-border rounded-lg px-4 py-2 flex flex-col justify-center text-center min-h-[80px] space-y-1">
          <p className="text-lg font-medium font-aeonik text-white">
            {statsLoading
              ? "Loading..."
              : formatPercentage(stats?.gross_rtp || 0)}
          </p>
          <h3 className="text-sm font-aeonik text-gray-400">Gross RTP</h3>
        </div>

        {/* Total Wagered */}
        <div className="bg-casino-card border border-casino-border rounded-lg px-4 py-2 flex flex-col justify-center text-center min-h-[80px] space-y-1">
          <div className="flex items-center justify-center space-x-2">
            {/* Solana Icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M15.9566 8.00028C15.9566 12.3953 12.3938 15.9582 7.99886 15.9582C3.60384 15.9582 0.0410156 12.3953 0.0410156 8.00028C0.0410156 3.60531 3.60384 0.0424805 7.99886 0.0424805C12.3938 0.0424805 15.9566 3.60531 15.9566 8.00028"
                fill="url(#paint0_linear_explore_wagered)"
              />
              <path
                d="M4.96221 9.88335C5.01652 9.82904 5.09119 9.79736 5.17039 9.79736H12.3525C12.4837 9.79736 12.5493 9.95576 12.4566 10.0485L11.0378 11.4673C10.9835 11.5216 10.9088 11.5533 10.8296 11.5533H3.64754C3.5163 11.5533 3.45067 11.3949 3.54345 11.3021L4.96221 9.88335Z"
                fill="black"
              />
              <path
                d="M4.96221 4.58599C5.01878 4.53168 5.09346 4.5 5.17039 4.5H12.3525C12.4837 4.5 12.5493 4.65839 12.4566 4.75117L11.0378 6.16993C10.9835 6.22424 10.9088 6.25592 10.8296 6.25592H3.64754C3.5163 6.25592 3.45067 6.09752 3.54345 6.00475L4.96221 4.58599Z"
                fill="black"
              />
              <path
                d="M11.0378 7.21733C10.9835 7.16303 10.9088 7.13135 10.8296 7.13135H3.64754C3.5163 7.13135 3.45067 7.28974 3.54345 7.38252L4.96221 8.80128C5.01652 8.85559 5.09119 8.88727 5.17039 8.88727H12.3525C12.4837 8.88727 12.5493 8.72887 12.4566 8.6361L11.0378 7.21733Z"
                fill="black"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_explore_wagered"
                  x1="7.99882"
                  y1="0.0424805"
                  x2="7.99882"
                  y2="15.9582"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0DF2A9" />
                  <stop offset="1" stopColor="#D725FD" />
                </linearGradient>
              </defs>
            </svg>
            <p className="text-lg font-medium font-aeonik text-white">
              {statsLoading
                ? "Loading..."
                : formatAmount(stats?.total_wagered || 0)}
            </p>
          </div>
          <h3 className="text-sm font-aeonik text-gray-400">Total Wagered</h3>
        </div>
      </div>

      {/* Bets Section */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold font-aeonik text-white text-left">
            Bets
          </h2>
          <form onSubmit={handleSearch} className="relative w-full sm:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Transaction ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-casino-card border border-casino-border rounded-lg text-sm font-aeonik text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>

        {/* Bets Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-4 px-4 text-sm font-aeonik text-white opacity-70 font-medium w-1/8">
                  Block
                </th>
                <th className="text-left py-4 px-4 text-sm font-aeonik text-white opacity-70 font-medium w-1/8">
                  Transaction
                </th>
                <th className="text-left py-4 px-4 text-sm font-aeonik text-white opacity-70 font-medium w-1/8">
                  VRF
                </th>
                <th className="text-left py-4 px-4 text-sm font-aeonik text-white opacity-70 font-medium w-1/8">
                  Token
                </th>
                <th className="text-left py-4 px-4 text-sm font-aeonik text-white opacity-70 font-medium w-1/8">
                  Wagered
                </th>
                <th className="text-left py-4 px-4 text-sm font-aeonik text-white opacity-70 font-medium w-1/8">
                  Won
                </th>
                <th className="text-left py-4 px-4 text-sm font-aeonik text-white opacity-70 font-medium w-1/8">
                  Net
                </th>
                <th className="text-right py-4 px-4 text-sm font-aeonik text-white opacity-70 font-medium w-1/8">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {displayBets.map((bet) => {
                // Handle loading skeleton
                if (bet.loading) {
                  return (
                    <tr key={bet.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-base font-aeonik text-white w-1/7">
                        <div className="animate-pulse bg-gray-600 h-4 rounded w-20"></div>
                      </td>
                      <td className="py-4 px-4 text-base font-aeonik text-white w-1/7">
                        <div className="animate-pulse bg-gray-600 h-4 rounded w-16"></div>
                      </td>
                      <td className="py-4 px-4 text-base font-aeonik text-white w-1/7">
                        <div className="animate-pulse bg-gray-600 h-4 rounded w-12"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="animate-pulse bg-gray-600 h-4 rounded w-16"></div>
                      </td>
                      <td className="py-4 px-4 w-1/7">
                        <div className="animate-pulse bg-gray-600 h-4 rounded w-16"></div>
                      </td>
                      <td className="py-4 px-4 w-1/7">
                        <div className="animate-pulse bg-gray-600 h-4 rounded w-16"></div>
                      </td>
                      <td className="py-4 px-4 text-base font-aeonik text-white text-right w-1/7">
                        <div className="animate-pulse bg-gray-600 h-4 rounded w-12"></div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr 
                    key={bet.id}
                    onClick={() => handleBetClick(bet.id)}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    title="Click to verify this bet"
                  >
                    <td className="py-4 px-4 text-base font-aeonik text-white w-1/8">
                      {bet.block}
                    </td>
                    <td className="py-4 px-4 text-base font-aeonik text-white w-1/8">
                      <div className="flex items-center gap-2">
                        <span>{bet.hash}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleCopy(bet.id, "Transaction");
                          }}
                          className="opacity-100 hover:opacity-60 transition-opacity cursor-pointer"
                          title="Copy full transaction hash"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_46_1538)">
                              <path
                                d="M13.4449 3.38477H5.44005C4.30495 3.38477 3.38477 4.30495 3.38477 5.44005V13.4449C3.38477 14.58 4.30495 15.5001 5.44005 15.5001H13.4449C14.58 15.5001 15.5001 14.58 15.5001 13.4449V5.44005C15.5001 4.30495 14.58 3.38477 13.4449 3.38477Z"
                                stroke="currentColor"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12.5974 3.38462L12.6154 2.51923C12.6139 1.98417 12.4006 1.47145 12.0223 1.0931C11.6439 0.714751 11.1312 0.501522 10.5962 0.5H2.80769C2.19621 0.501807 1.61029 0.745519 1.1779 1.1779C0.745519 1.61029 0.501807 2.19621 0.5 2.80769V10.5962C0.501522 11.1312 0.714751 11.6439 1.0931 12.0223C1.47145 12.4006 1.98417 12.6139 2.51923 12.6154H3.38462"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_46_1538">
                                <rect width="16" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-base font-aeonik text-white w-1/8">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-sm text-gray-300"
                          title={bet.vrf_output || ""}
                        >
                          {bet.vrf_hash || "N/A"}
                        </span>
                        {bet.vrf_output && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              handleCopy(bet.vrf_output || "", "VRF");
                            }}
                            className="opacity-100 hover:opacity-60 transition-opacity cursor-pointer"
                            title="Copy full VRF output"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_46_1538_vrf)">
                                <path
                                  d="M13.4449 3.38477H5.44005C4.30495 3.38477 3.38477 4.30495 3.38477 5.44005V13.4449C3.38477 14.58 4.30495 15.5001 5.44005 15.5001H13.4449C14.58 15.5001 15.5001 14.58 15.5001 13.4449V5.44005C15.5001 4.30495 14.58 3.38477 13.4449 3.38477Z"
                                  stroke="currentColor"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12.5974 3.38462L12.6154 2.51923C12.6139 1.98417 12.4006 1.47145 12.0223 1.0931C11.6439 0.714751 11.1312 0.501522 10.5962 0.5H2.80769C2.19621 0.501807 1.61029 0.745519 1.1779 1.1779C0.745519 1.61029 0.501807 2.19621 0.5 2.80769V10.5962C0.501522 11.1312 0.714751 11.6439 1.0931 12.0223C1.47145 12.4006 1.98417 12.6139 2.51923 12.6154H3.38462"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_46_1538_vrf">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-base font-aeonik text-white w-1/8">
                      {bet.token}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0"
                        >
                          <path
                            d="M15.9566 8.00028C15.9566 12.3953 12.3938 15.9582 7.99886 15.9582C3.60384 15.9582 0.0410156 12.3953 0.0410156 8.00028C0.0410156 3.60531 3.60384 0.0424805 7.99886 0.0424805C12.3938 0.0424805 15.9566 3.60531 15.9566 8.00028"
                            fill="url(#paint0_linear_wagered)"
                          />
                          <path
                            d="M4.96221 9.88335C5.01652 9.82904 5.09119 9.79736 5.17039 9.79736H12.3525C12.4837 9.79736 12.5493 9.95576 12.4566 10.0485L11.0378 11.4673C10.9835 11.5216 10.9088 11.5533 10.8296 11.5533H3.64754C3.5163 11.5533 3.45067 11.3949 3.54345 11.3021L4.96221 9.88335Z"
                            fill="black"
                          />
                          <path
                            d="M4.96221 4.58599C5.01878 4.53168 5.09346 4.5 5.17039 4.5H12.3525C12.4837 4.5 12.5493 4.65839 12.4566 4.75117L11.0378 6.16993C10.9835 6.22424 10.9088 6.25592 10.8296 6.25592H3.64754C3.5163 6.25592 3.45067 6.09752 3.54345 6.00475L4.96221 4.58599Z"
                            fill="black"
                          />
                          <path
                            d="M11.0378 7.21733C10.9835 7.16303 10.9088 7.13135 10.8296 7.13135H3.64754C3.5163 7.13135 3.45067 7.28974 3.54345 7.38252L4.96221 8.80128C5.01652 8.85559 5.09119 8.88727 5.17039 8.88727H12.3525C12.4837 8.88727 12.5493 8.72887 12.4566 8.6361L11.0378 7.21733Z"
                            fill="black"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_wagered"
                              x1="7.99882"
                              y1="0.0424805"
                              x2="7.99882"
                              y2="15.9582"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#0DF2A9" />
                              <stop offset="1" stopColor="#D725FD" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="text-base font-aeonik text-white">
                          {formatAmount(bet.wagered)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 w-1/7">
                      <div className="flex items-center space-x-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0"
                        >
                          <path
                            d="M15.9566 8.00028C15.9566 12.3953 12.3938 15.9582 7.99886 15.9582C3.60384 15.9582 0.0410156 12.3953 0.0410156 8.00028C0.0410156 3.60531 3.60384 0.0424805 7.99886 0.0424805C12.3938 0.0424805 15.9566 3.60531 15.9566 8.00028"
                            fill="url(#paint0_linear_won)"
                          />
                          <path
                            d="M4.96221 9.88335C5.01652 9.82904 5.09119 9.79736 5.17039 9.79736H12.3525C12.4837 9.79736 12.5493 9.95576 12.4566 10.0485L11.0378 11.4673C10.9835 11.5216 10.9088 11.5533 10.8296 11.5533H3.64754C3.5163 11.5533 3.45067 11.3949 3.54345 11.3021L4.96221 9.88335Z"
                            fill="black"
                          />
                          <path
                            d="M4.96221 4.58599C5.01878 4.53168 5.09346 4.5 5.17039 4.5H12.3525C12.4837 4.5 12.5493 4.65839 12.4566 4.75117L11.0378 6.16993C10.9835 6.22424 10.9088 6.25592 10.8296 6.25592H3.64754C3.5163 6.25592 3.45067 6.09752 3.54345 6.00475L4.96221 4.58599Z"
                            fill="black"
                          />
                          <path
                            d="M11.0378 7.21733C10.9835 7.16303 10.9088 7.13135 10.8296 7.13135H3.64754C3.5163 7.13135 3.45067 7.28974 3.54345 7.38252L4.96221 8.80128C5.01652 8.85559 5.09119 8.88727 5.17039 8.88727H12.3525C12.4837 8.88727 12.5493 8.72887 12.4566 8.6361L11.0378 7.21733Z"
                            fill="black"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_won"
                              x1="7.99882"
                              y1="0.0424805"
                              x2="7.99882"
                              y2="15.9582"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#0DF2A9" />
                              <stop offset="1" stopColor="#D725FD" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="text-base font-aeonik text-white">
                          {formatAmount(bet.won)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 w-1/7">
                      <div className="flex items-center space-x-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0"
                        >
                          <path
                            d="M15.9566 8.00028C15.9566 12.3953 12.3938 15.9582 7.99886 15.9582C3.60384 15.9582 0.0410156 12.3953 0.0410156 8.00028C0.0410156 3.60531 3.60384 0.0424805 7.99886 0.0424805C12.3938 0.0424805 15.9566 3.60531 15.9566 8.00028"
                            fill="url(#paint0_linear_net)"
                          />
                          <path
                            d="M4.96221 9.88335C5.01652 9.82904 5.09119 9.79736 5.17039 9.79736H12.3525C12.4837 9.79736 12.5493 9.95576 12.4566 10.0485L11.0378 11.4673C10.9835 11.5216 10.9088 11.5533 10.8296 11.5533H3.64754C3.5163 11.5533 3.45067 11.3949 3.54345 11.3021L4.96221 9.88335Z"
                            fill="black"
                          />
                          <path
                            d="M4.96221 4.58599C5.01878 4.53168 5.09346 4.5 5.17039 4.5H12.3525C12.4837 4.5 12.5493 4.65839 12.4566 4.75117L11.0378 6.16993C10.9835 6.22424 10.9088 6.25592 10.8296 6.25592H3.64754C3.5163 6.25592 3.45067 6.09752 3.54345 6.00475L4.96221 4.58599Z"
                            fill="black"
                          />
                          <path
                            d="M11.0378 7.21733C10.9835 7.16303 10.9088 7.13135 10.8296 7.13135H3.64754C3.5163 7.13135 3.45067 7.28974 3.54345 7.38252L4.96221 8.80128C5.01652 8.85559 5.09119 8.88727 5.17039 8.88727H12.3525C12.4837 8.88727 12.5493 8.72887 12.4566 8.6361L11.0378 7.21733Z"
                            fill="black"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_net"
                              x1="7.99882"
                              y1="0.0424805"
                              x2="7.99882"
                              y2="15.9582"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#0DF2A9" />
                              <stop offset="1" stopColor="#D725FD" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span
                          className={`text-base font-aeonik ${
                            bet.isPositive ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {bet.isPositive ? "+" : "-"}
                          {formatAmount(bet.net)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-base font-aeonik text-white text-right w-1/8">
                      {bet.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-end mt-6">
          <div className="flex items-center space-x-2">
            {/* Previous Button - always visible but conditionally enabled */}
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-white hover:bg-casino-border"
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>

            {/* Next Button - always visible but conditionally enabled */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-white hover:bg-casino-border"
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Copy Feedback Toast */}
      {copyFeedback && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {copyFeedback}
        </div>
      )}
    </div>
  );
};

export default Explore;
