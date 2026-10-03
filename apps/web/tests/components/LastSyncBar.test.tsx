import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

import { useGetLastSyncTime } from '@services';
import { LastSyncBar } from '../../src/components/display/LastSyncBar';

/**
 * "Last Sync" label under BC's permanent UTC-7 rule (Pacific time, "PCT", from 2026-11-01).
 *
 * The API returns `updated_date` in UTC; the component converts it to America/Vancouver clock
 * time and appends a hardcoded label. BC's official name for its year-round zone is "Pacific
 * time (PCT)", which replaces the seasonal PST/PDT labels, so the label is always "PCT". Winter
 * times only come out right (UTC-7, not UTC-8) on a runtime whose tzdata has the new BC rule.
 *
 * Expected values are literal strings on purpose.
 */

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@services', () => ({ useGetLastSyncTime: jest.fn() }));

const mockedUseRouter = useRouter as jest.Mock;
const mockedUseGetLastSyncTime = useGetLastSyncTime as jest.Mock;

// True when this runtime's tzdata has BC's permanent UTC-7 rule (tzdata 2026b or later).
const hasPermanentBcRule = (): boolean =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/Vancouver', timeZoneName: 'shortOffset' })
    .formatToParts(new Date('2026-12-15T12:00:00Z'))
    .find(part => part.type === 'timeZoneName')?.value === 'GMT-7';

// Tests that depend on the new rule only run where the runtime has it.
const itWithBcRule = hasPermanentBcRule() ? it : it.skip;

const renderWithLastSync = (updatedDate: string | undefined, pathname = '/') => {
  mockedUseRouter.mockReturnValue({ pathname });
  mockedUseGetLastSyncTime.mockReturnValue([{ updated_date: updatedDate }]);
  return render(<LastSyncBar />);
};

// Opens the "Last Sync" panel and returns the text it shows.
const openPanel = (): string => {
  fireEvent.click(screen.getByRole('button', { name: /last sync/i }));
  return screen.getByText(/N\/A|\d{4} \d{1,2}:\d{2} (AM|PM)/).textContent ?? '';
};

describe('LastSyncBar — last sync time label', () => {
  afterEach(() => jest.clearAllMocks());

  it('shows the sync time in BC time with the PCT label (2026-07-15T20:00Z → "Jul 15, 2026 1:00 PM PCT")', () => {
    renderWithLastSync('2026-07-15T20:00:00Z');

    const label = openPanel();

    expect(label).toBe('Jul 15, 2026 1:00 PM PCT');
    expect(label).not.toContain('PST');
  });

  it('shows "N/A" when there is no sync time', () => {
    renderWithLastSync(undefined);

    expect(openPanel()).toBe('N/A');
  });

  itWithBcRule(
    'keeps UTC-7 in winter with the PCT label (2026-12-15T20:00Z → "Dec 15, 2026 1:00 PM PCT")',
    () => {
      // Under the old rule this would be 12:00 PM (UTC-8); BC now stays on UTC-7 in winter.
      renderWithLastSync('2026-12-15T20:00:00Z');

      const label = openPanel();

      expect(label).toBe('Dec 15, 2026 1:00 PM PCT');
      expect(label).not.toContain('PST');
    },
  );

  it('renders nothing on the login page', () => {
    const { container } = renderWithLastSync('2026-07-15T20:00:00Z', '/login');

    expect(container).toBeEmptyDOMElement();
  });
});
