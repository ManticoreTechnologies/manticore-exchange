/**
 * Format EVR amount to the most appropriate unit (EVR, mEVR, or µEVR)
 * with K, M, B suffixes for large numbers
 * @param amount Amount in EVR decimal format (string)
 * @returns Formatted amount with appropriate unit and suffix
 */
export const formatEvrAmount = (amount: string): string => {
  const evr = Number(amount);
  
  // Handle large numbers
  if (evr >= 1000000000) {
    // Billions
    return `${(evr / 1000000000).toFixed(2).replace(/\.?0+$/, '')} GEVR`;
  } else if (evr >= 1000000) {
    // Millions
    return `${(evr / 1000000).toFixed(2).replace(/\.?0+$/, '')} MEVR`;
  } else if (evr >= 1000) {
    // Thousands
    return `${(evr / 1000).toFixed(2).replace(/\.?0+$/, '')} KEVR`;
  } else if (evr >= 0.01) {
    // If amount is >= 0.01 EVR, show in EVR
    return `${evr.toFixed(8).replace(/\.?0+$/, '')} EVR`;
  } else if (evr >= 0.00001) {
    // If amount is >= 0.00001 EVR (10 µEVR), show in mEVR
    const mevr = evr * 1000;
    return `${mevr.toFixed(5).replace(/\.?0+$/, '')} mEVR`;
  } else {
    // For very small amounts, show in µEVR
    const uevr = evr * 1000000;
    return `${uevr.toFixed(2).replace(/\.?0+$/, '')} µEVR`;
  }
};

/**
 * Truncate an address to show only the first and last few characters
 * @param address Full address string
 * @param startChars Number of characters to show at start (default: 6)
 * @param endChars Number of characters to show at end (default: 4)
 * @returns Truncated address with ellipsis
 */
export const truncateAddress = (
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}; 