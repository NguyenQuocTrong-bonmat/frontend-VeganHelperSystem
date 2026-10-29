import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import HealthAndWellness from './HealthAndWellness';

vi.mock('../../components/layout/HeaderMember', () => ({ default: () => null }));
vi.mock('../../components/layout/Footer', () => ({ default: () => null }));
vi.mock('../../components/chat/AIChatbot', () => ({ default: () => null }));

vi.mock('../../services/profileService', () => ({
  getHealthProfile: vi.fn().mockResolvedValue({
    heightCm: 180,
    weightKg: 67,
    biologicalSex: 'male',
    birthDate: '2006-10-11',
    dietType: 'vegan',
    activityLevel: 'light',
    allergies: [{ ingredientId: 1, name: 'Peanut', isCustom: false }],
    customAllergies: []
  }),
  updateHealthProfile: vi.fn().mockResolvedValue({}),
  updateAllergies: vi.fn().mockResolvedValue({})
}));

vi.mock('../../services/bmiService', () => ({
  getBmiData: vi.fn().mockResolvedValue({
    bmi: 20.7,
    category: 'Normal',
    idealWeightRange: { minKg: 59.9, maxKg: 80.7 }
  }),
  getBmiHistory: vi.fn().mockResolvedValue({
    history: [
      { timestamp: '2026-10-09T00:00:00Z', weightKg: 60, bmi: 20.8 }
    ]
  })
}));

vi.mock('../../services/ingredientService', () => ({
  searchIngredients: vi.fn().mockResolvedValue([])
}));

let container, root;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

describe('HealthAndWellness Layout Balance', () => {
  it('renders the 4 main sections inside a balanced 2-column grid layout', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <HealthAndWellness isComponent={true} />
        </MemoryRouter>
      );
    });

    // Wait a tick for async state updates to resolve
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // Verify main balanced grid exists
    const grid = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2.gap-8.items-stretch');
    expect(grid).toBeTruthy();

    // Verify all 4 sections are direct children of the balanced grid
    const sections = grid.querySelectorAll('section');
    expect(sections.length).toBe(4);

    // Section 1: Health Profile (Row 1 Left)
    expect(sections[0].textContent).toContain('Health Profile');
    // Section 2: Current BMI (Row 1 Right)
    expect(sections[1].textContent).toContain('Current BMI');
    // Section 3: Food Allergies (Row 2 Left)
    expect(sections[2].textContent).toContain('Food Allergies');
    // Section 4: BMI History (Row 2 Right)
    expect(sections[3].textContent).toContain('BMI History');
  });
});
