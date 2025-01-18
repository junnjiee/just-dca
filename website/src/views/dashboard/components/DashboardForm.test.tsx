import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('Show relevant error messages for empty inputs', async () => {
    // NOTE: does not check if button triggered the submit function
    const user = userEvent.setup();
    render(
      <UserInputProvider>
        <DashboardForm />
      </UserInputProvider>,
    );

    user.clear(screen.getByLabelText('Ticker'));
    user.clear(screen.getByLabelText('Monthly Contribution'));
    user.clear(screen.getByLabelText('From'));
    user.clear(screen.getByLabelText('To'));
    user.click(screen.getByText('Generate'));

    expect(await screen.findByText('Enter a ticker')).toBeInTheDocument();
    expect(await screen.findByText('Enter a number')).toBeInTheDocument();
    expect(await screen.findAllByText('Invalid date')).toHaveLength(2);
  });

  it('Show error if end date greater than start date', async () => {
    const user = userEvent.setup();
    // NOTE: does not check if button triggered the submit function
    render(
      <UserInputProvider>
        <DashboardForm />
      </UserInputProvider>,
    );

    fireEvent.change(screen.getByLabelText('From'), {
      target: { value: '2026-01-01' },
    });
    fireEvent.change(screen.getByLabelText('To'), {
      target: { value: '2025-01-01' },
    });
    user.click(screen.getByText('Generate'));

    expect(
      await screen.findByText('End date must be later than start'),
    ).toBeInTheDocument();
  });

  it('Show error if contribution more than 2 decimal places', async () => {
    const user = userEvent.setup();
    // NOTE: does not check if button triggered the submit function
    render(
      <UserInputProvider>
        <DashboardForm />
      </UserInputProvider>,
    );

    user.clear(screen.getByLabelText('Monthly Contribution'));
    user.type(screen.getByLabelText('Monthly Contribution'), '1.111');
    user.click(screen.getByText('Generate'));

    expect(
      await screen.findByText('2 decimal places only (e.g. 0.01)'),
    ).toBeInTheDocument();
  });
});
