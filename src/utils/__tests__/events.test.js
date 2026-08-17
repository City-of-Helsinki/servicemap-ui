import formatEventDate from '../events';

const intl = {
  formatMessage: vi.fn(() => 'at'),
  formatDate: vi.fn((date, options) => {
    if (options.weekday) return 'Mon';
    return `1/${date.getUTCDate()}`;
  }),
  formatTime: vi.fn(() => '12:00'),
  formatRelativeTime: vi.fn(() => 'today'),
};

describe('formatEventDate', () => {
  it('returns an empty string when event times are missing', () => {
    expect(formatEventDate({}, intl)).toBe('');
  });

  it('formats an event occurring on one day', () => {
    expect(
      formatEventDate(
        {
          start_time: '2026-01-01T12:00:00Z',
          end_time: '2026-01-01T13:00:00Z',
        },
        intl
      )
    ).toContain('today');
  });

  it('formats an event spanning multiple days', () => {
    expect(
      formatEventDate(
        {
          start_time: '2026-01-01T12:00:00Z',
          end_time: '2026-01-02T13:00:00Z',
        },
        intl
      )
    ).toBe('1/1–1/2');
  });
});
