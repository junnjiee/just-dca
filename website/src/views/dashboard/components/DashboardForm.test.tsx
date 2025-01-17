import { render, screen } from '@testing-library/react';

import { UserInputProvider } from '@/contexts/user-input';
import { DashboardForm } from './DashboardForm';

describe('DashboardForm', () => {
  it('Ensure Dashboard Form rendered properly', () => {
    render(
      <UserInputProvider>
        <DashboardForm />
      </UserInputProvider>,
    );
    expect(screen.getByLabelText('Ticker'));
    expect(screen.getByLabelText('Monthly Contribution'));
    expect(screen.getByLabelText('From'));
    expect(screen.getByLabelText('To'));
  });
});
