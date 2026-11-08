import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import MenuJourney, { estimateEnergy, savedMealAverages } from './MenuJourney';

let root, host;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});

const sampleMenu = {
  targetDailyCalories: 1950,
  dietType: 'vegan',
  allergies: ['peanuts'],
  energyProfile: {
    birthDate: '1995-05-15',
    biologicalSex: 'female',
    weightKg: 62,
    heightCm: 168,
    activityLevel: 'moderate',
    estimatedOn: '2026-10-15',
  },
  mealCalorieSplit: { breakfastPercent: 25, lunchPercent: 35, dinnerPercent: 40 },
  days: [
    {
      date: '2026-10-17',
      meals: [
        { mealTime: 'breakfast', name: 'Oatmeal with berries', calories: 480 },
        { mealTime: 'lunch', name: 'Tofu Quinoa Salad', calories: 680 },
        { mealTime: 'dinner', name: 'Lentil Curry with Rice', calories: 790 },
      ],
    },
    {
      date: '2026-10-18',
      meals: [
        { mealTime: 'breakfast', name: 'Green Smoothie Bowl', calories: 500 },
        { mealTime: 'lunch', name: 'Chickpea Wrap', calories: 700 },
        { mealTime: 'dinner', name: 'Tempeh Stir-Fry', calories: 750 },
      ],
    },
  ],
};

const samplePlan = {
  id: 10,
  startDate: '2026-10-17',
  endDate: '2026-10-23',
  menu: sampleMenu,
  routine: {
    mode: 'weight_goal',
    targetWeightKg: 58,
    targetDate: '2026-12-31',
  },
};

test('renders Nutrition & Calculation Insights with Mifflin-St Jeor equation and actual calorie split', async () => {
  await act(async () => root.render(<MenuJourney plan={samplePlan} menu={sampleMenu} />));

  expect(host.textContent).toContain('Nutrition & Calculation Insights');
  expect(host.textContent).toContain('How your weekly nutrition was calculated');
  expect(host.textContent).toContain('Saved result');
  expect(host.textContent).toContain('Energy Calculation');
  expect(host.textContent).toContain('Resting energy');
  expect(host.textContent).toContain('Activity factor');
  expect(host.textContent).toContain('Estimated TDEE');
  expect(host.textContent).toContain('1.55×');
  expect(host.textContent).toContain('Meal Distribution');
  expect(host.textContent).toContain('Actual dish calories across 3 meals');
  expect(host.textContent).toContain('Breakfast');
  expect(host.textContent).toContain('Lunch');
  expect(host.textContent).toContain('Dinner');
  // Does NOT contain the incorrect instruction "Open the calendar below"
  expect(host.textContent).not.toContain('Open the calendar below');
});

test('handles historical plan without energyProfile gracefully with fallback message without fabricating data', async () => {
  const historicalMenu = {
    targetDailyCalories: 2000,
    dietType: 'vegan',
    energyProfile: null,
    days: sampleMenu.days,
  };
  const historicalPlan = {
    id: 5,
    startDate: '2026-09-01',
    menu: historicalMenu,
  };

  await act(async () => root.render(<MenuJourney plan={historicalPlan} menu={historicalMenu} />));

  expect(host.textContent).toContain('This historical menu was saved without an energy profile snapshot.');
  expect(host.textContent).toContain('2,000 kcal');
  expect(host.textContent).toContain('Future menus record complete Mifflin–St Jeor TDEE estimates');
  expect(host.textContent).not.toContain('NaN');
});

test('displays actual calorie split percentages and meal calories', async () => {
  await act(async () => root.render(<MenuJourney plan={samplePlan} menu={sampleMenu} />));

  // Day 1: 480 + 680 + 790 = 1950
  // Day 2: 500 + 700 + 750 = 1950
  // Average Breakfast = 490 kcal (~25.1%)
  // Average Lunch = 690 kcal (~35.4%)
  // Average Dinner = 770 kcal (~39.5%)
  expect(host.textContent).toContain('490 kcal');
  expect(host.textContent).toContain('690 kcal');
  expect(host.textContent).toContain('770 kcal');
  expect(host.textContent).toContain('Configured target split: Breakfast 25%, Lunch 35%, Dinner 40%.');
});

test('renders evidence sources links with target="_blank" and rel="noreferrer"', async () => {
  await act(async () => root.render(<MenuJourney plan={samplePlan} menu={sampleMenu} />));

  const links = [...host.querySelectorAll('.wm-journey-sources a')];
  expect(links.length).toBe(3);
  expect(links[0].textContent).toContain('Mifflin et al.');
  expect(links[1].textContent).toContain('NIDDK');
  expect(links[2].textContent).toContain('WHO');

  links.forEach(link => {
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noreferrer');
  });
});

test('estimateEnergy calculates Mifflin-St Jeor formula accurately', () => {
  // Female, 62kg, 168cm, 31 years (estimated in 2026, born 1995-05-15)
  // resting = 10 * 62 + 6.25 * 168 - 5 * 31 - 161 = 620 + 1050 - 155 - 161 = 1354
  const profile = {
    weightKg: 62,
    heightCm: 168,
    biologicalSex: 'female',
    birthDate: '1995-05-15',
    activityLevel: 'moderate',
  };
  const result = estimateEnergy(profile, '2026-10-15');
  expect(result).not.toBeNull();
  expect(result.resting).toBe(1354);
  expect(result.factor).toBe(1.55);
  expect(result.tdee).toBeCloseTo(1354 * 1.55, 1);
});

test('savedMealAverages calculates averages and percentages across days', () => {
  const averages = savedMealAverages(sampleMenu);
  expect(averages.breakfast.calories).toBe(490);
  expect(averages.lunch.calories).toBe(690);
  expect(averages.dinner.calories).toBe(770);
  expect(averages.breakfast.percent + averages.lunch.percent + averages.dinner.percent).toBeCloseTo(100, 1);
});
