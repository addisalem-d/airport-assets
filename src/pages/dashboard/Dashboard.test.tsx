import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './Dashboard';
import { dashboardService } from '../../services/dashboardService';
import { mockDashboardSummary } from '../../data/mockDashboardSummary';

jest.mock('../../services/dashboardService', () => ({
  __esModule: true,
  dashboardService: { getSummary: jest.fn() },
}));

const queryClient = new QueryClient();

describe('Dashboard', () => {
  beforeEach(() => {
    (dashboardService.getSummary as jest.Mock).mockResolvedValue(mockDashboardSummary);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard summary correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    await waitFor(() => expect(dashboardService.getSummary).toHaveBeenCalled());
    expect(screen.getByText(/Total Assets/i)).toBeInTheDocument();
  });
});