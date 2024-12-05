// src/hooks/useMilestones.ts

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { ApplicantStatusAuditRO } from '@ien/common';

interface UseMilestonesProps {
  milestones: ApplicantStatusAuditRO[];
  category: string;
  applicant: any;
}
const DEFAULT_TAB_PAGE_SIZE = 5;
export const useMilestones = ({ milestones, category, applicant }: UseMilestonesProps) => {
  const [filteredMilestones, setFilteredMilestones] = useState<ApplicantStatusAuditRO[]>([]);
  const [milestonesInPage, setMilestonesInPage] = useState<ApplicantStatusAuditRO[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TAB_PAGE_SIZE);
  const [editing, setEditing] = useState<ApplicantStatusAuditRO | null>(null);
  const [activeEdit, setActiveEdit] = useState(0);

  useEffect(() => {
    const audits =
      milestones
        ?.filter(audit => audit.status.category === category)
        .sort((b, a) => {
          if (a.start_date === b.start_date) {
            return dayjs(a.updated_date).diff(b.updated_date);
          }
          return dayjs(a.start_date).diff(b.start_date);
        }) || [];
    setFilteredMilestones(audits);
  }, [milestones, category, applicant]);

  useEffect(() => {
    if (!filteredMilestones || (pageIndex - 1) * pageSize > filteredMilestones.length) {
      setPageIndex(1);
    }
    const start = (pageIndex - 1) * pageSize;
    const end = pageIndex * pageSize;
    setMilestonesInPage(filteredMilestones?.slice(start, end) || []);
  }, [filteredMilestones, pageIndex, pageSize]);

  return {
    filteredMilestones,
    milestonesInPage,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    editing,
    setEditing,
    activeEdit,
    setActiveEdit,
  };
};
