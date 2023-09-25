export class SyncApplicantsResultDTO {
  /**
   * start date
   * @example "2021-01-01"
   */
  from!: string;

  /**
   * end date
   * @example "2021-01-01"
   */
  to!: string;

  /**
   * number of applicants fetched from ATS
   */
  result!: {
    applicants: {
      total: number;
      processed: number;
    };
    milestones: {
      total: number;
      created: number;
      updated: number;
      dropped: number;
      removed: number;
    };
  };
}
