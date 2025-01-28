/**
 * Format EVR amount from sats to EVR with proper decimal places
 * @param amount Amount in sats (string)
 * @returns Formatted amount in EVR
 */
export const formatEvrAmount = (amount: string): string => {
  return Number(amount).toFixed(8);
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