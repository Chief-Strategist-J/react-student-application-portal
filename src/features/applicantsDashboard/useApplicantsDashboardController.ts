import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../shared/store/hooks';
import { applicantsActions } from './slice';
import { isEqualNormalized } from '../../shared/utils/normalizeKey';
import type { Applicant } from './types';
import {
  filterAndSortApplicants,
  computeApplicantStats,
  resolveErrorState,
} from './service';

export type SortColumn = 'name' | 'email' | 'company' | 'status';

export function useApplicantsDashboardController() {
  const [selectedApplicant, setSelectedApplicant] = React.useState<Applicant | null>(null);
  const dispatch = useAppDispatch();

  const rawItems = useAppSelector((s) => s.applicants.items);
  const status = useAppSelector((s) => s.applicants.status);
  const error = useAppSelector((s) => s.applicants.error);
  const searchQuery = useAppSelector((s) => s.applicants.searchQuery);
  const sortBy = useAppSelector((s) => s.applicants.sortBy);
  const sortOrder = useAppSelector((s) => s.applicants.sortOrder);

  const items: Applicant[] = Array.isArray(rawItems) ? (rawItems as Applicant[]) : [];

  const filteredItems = filterAndSortApplicants(items, searchQuery, sortBy, sortOrder);
  const stats = computeApplicantStats(items);
  const errorState = resolveErrorState(error);

  const fetch = useCallback(() => dispatch(applicantsActions.fetchRequest(undefined)), [dispatch]);

  useEffect(() => {
    if (isEqualNormalized(status, 'idle')) fetch();
  }, [status, fetch]);

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => dispatch(applicantsActions.setSearchQuery(e.target.value)),
    [dispatch],
  );

  const onSort = useCallback(
    (col: SortColumn) => dispatch(applicantsActions.setSort({ sortBy: col })),
    [dispatch],
  );

  return {
    selectedApplicant,
    setSelectedApplicant,
    status,
    error,
    errorState,
    searchQuery,
    filteredItems,
    totalCount: items.length,
    stats,
    fetch,
    onSearch,
    onSort,
  };
}
