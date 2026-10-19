import { describe, it, expect } from 'vitest';
import { getPaginationPages } from './paginationUtils';

describe('getPaginationPages', () => {
  it('returns all pages when totalPages <= 5', () => {
    expect(getPaginationPages(1, 1)).toEqual([1]);
    expect(getPaginationPages(1, 3)).toEqual([1, 2, 3]);
    expect(getPaginationPages(2, 4)).toEqual([1, 2, 3, 4]);
    expect(getPaginationPages(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('limits to 5 page numbers when totalPages > 5 at the beginning', () => {
    expect(getPaginationPages(1, 10)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationPages(2, 10)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationPages(3, 10)).toEqual([1, 2, 3, 4, 5]);
  });

  it('centers the current page when in the middle of totalPages', () => {
    expect(getPaginationPages(4, 10)).toEqual([2, 3, 4, 5, 6]);
    expect(getPaginationPages(5, 10)).toEqual([3, 4, 5, 6, 7]);
    expect(getPaginationPages(6, 10)).toEqual([4, 5, 6, 7, 8]);
    expect(getPaginationPages(7, 10)).toEqual([5, 6, 7, 8, 9]);
  });

  it('limits to 5 page numbers when totalPages > 5 near the end', () => {
    expect(getPaginationPages(8, 10)).toEqual([6, 7, 8, 9, 10]);
    expect(getPaginationPages(9, 10)).toEqual([6, 7, 8, 9, 10]);
    expect(getPaginationPages(10, 10)).toEqual([6, 7, 8, 9, 10]);
  });

  it('handles large totalPages without exceeding 5 items', () => {
    const pages = getPaginationPages(45, 100);
    expect(pages).toHaveLength(5);
    expect(pages).toEqual([43, 44, 45, 46, 47]);
  });

  it('handles edge cases gracefully', () => {
    expect(getPaginationPages(0, 0)).toEqual([]);
    expect(getPaginationPages(-5, -1)).toEqual([]);
    expect(getPaginationPages(15, 10)).toEqual([6, 7, 8, 9, 10]);
  });
});
