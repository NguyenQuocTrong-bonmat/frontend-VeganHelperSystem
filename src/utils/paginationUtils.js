/**
 * Calculates the array of page numbers to display in pagination controls.
 * Guarantees that at most `maxVisible` page numbers are shown (default 5).
 *
 * @param {number} currentPage - The current active page (1-indexed)
 * @param {number} totalPages - The total number of pages
 * @param {number} [maxVisible=5] - Maximum number of page buttons to display
 * @returns {number[]} Array of sequential page numbers within [1, totalPages]
 */
export function getPaginationPages(currentPage, totalPages, maxVisible = 5) {
  const total = Number(totalPages);
  if (!total || total <= 0) return [];

  const limit = Math.max(1, Number(maxVisible) || 5);
  const current = Math.min(Math.max(1, Number(currentPage) || 1), total);

  if (total <= limit) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = Math.max(1, current - Math.floor(limit / 2));
  let end = start + limit - 1;

  if (end > total) {
    end = total;
    start = Math.max(1, end - limit + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}
