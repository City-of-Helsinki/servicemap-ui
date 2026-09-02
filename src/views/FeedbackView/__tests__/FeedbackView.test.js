import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';

import rootReducer from '../../../redux/rootReducer';
import { getRenderWithProviders } from '../../../testUtils';

// RouterPrompt relies on useBlocker, which requires a data router. Since the
// test only uses a plain MemoryRouter, stub it out to a no-op blocker.
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useBlocker: () => ({ state: 'unblocked' }),
  };
});

const { default: FeedbackView } = await import('../index');

const mockState = rootReducer(undefined, { type: '@@INIT' });

const renderWithProviders = getRenderWithProviders(mockState);

describe('<FeedbackView />', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: true }))
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders the feedback form', () => {
    const { container } = renderWithProviders(<FeedbackView />);

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Send feedback' })
    ).toBeInTheDocument();
  });

  it('shows validation errors when trying to send an empty form', () => {
    renderWithProviders(<FeedbackView />);

    fireEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    expect(screen.getAllByText('Mandatory field').length).toBeGreaterThan(0);
  });

  it('sends the form when feedback is filled and valid', async () => {
    const { container } = renderWithProviders(<FeedbackView />);

    const feedbackField = container.querySelector(
      'textarea[maxlength="5000"]:not([aria-hidden])'
    );
    fireEvent.change(feedbackField, { target: { value: 'Some feedback' } });

    fireEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
