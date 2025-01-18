import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UserInputProvider } from '@/contexts/user-input';
import { DashboardForm } from './DashboardForm';

describe('DashboardForm', () => {
  it('Ensure component rendered properly', () => {
    render(
      <UserInputProvider>
        <DashboardForm />
      </UserInputProvider>,
    );
    expect(screen.getByLabelText('Ticker')).toBeInTheDocument();
    expect(screen.getByLabelText('Monthly Contribution')).toBeInTheDocument();
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
    expect(screen.getByText('Generate')).toBeInTheDocument();
  });

  it('Show error instead of submitting when inputs are empty', async () => {
    const user = userEvent.setup();
    render(
      <UserInputProvider>
        <DashboardForm />
      </UserInputProvider>,
    );

    user.clear(screen.getByLabelText('Ticker'));
    user.clear(screen.getByLabelText('Monthly Contribution'));
    user.click(screen.getByText('Generate'));

    expect(await screen.findByText('Enter a ticker')).toBeInTheDocument();
    expect(await screen.findByText('Enter a number')).toBeInTheDocument();
  });
});
