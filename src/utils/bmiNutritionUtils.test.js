import { describe, it, expect } from 'vitest';
import { calculateCalorieAndMacros } from './bmiNutritionUtils';

describe('calculateCalorieAndMacros', () => {
  it('calculates maintenance calories and macros for Normal BMI in English', () => {
    const healthData = {
      heightCm: 180,
      weightKg: 67,
      biologicalSex: 'male',
      activityLevel: 'moderate',
    };
    const bmiResult = {
      bmi: 20.7,
      category: 'Normal',
      dailyCalorieRecommendation: 2338,
    };

    const res = calculateCalorieAndMacros(bmiResult, healthData);
    expect(res).not.toBeNull();
    expect(res.targetCalories).toBe(2338);
    expect(res.maintenanceCalories).toBe(2338);
    expect(res.goalLabel).toBe('Maintain Current Weight');
    expect(res.macros.proteinPercent).toBe(20);
    expect(res.macros.proteinGrams).toBe(117);
    expect(res.macros.carbsPercent).toBe(50);
    expect(res.macros.carbsGrams).toBe(292);
    expect(res.macros.fatPercent).toBe(30);
    expect(res.macros.fatGrams).toBe(78);
  });

  it('calculates surplus calorie goal for Underweight BMI in English', () => {
    const healthData = {
      heightCm: 175,
      weightKg: 50,
      biologicalSex: 'female',
      activityLevel: 'light',
    };
    const bmiResult = {
      bmi: 16.3,
      category: 'Underweight',
      dailyCalorieRecommendation: 1800,
    };

    const res = calculateCalorieAndMacros(bmiResult, healthData);
    expect(res.targetCalories).toBe(2200); // 1800 + 400
    expect(res.goalLabel).toBe('Healthy Weight Gain Goal (+400 kcal/day)');
    expect(res.macros.carbsPercent).toBe(55);
  });

  it('calculates deficit calorie goal for Overweight BMI in English', () => {
    const healthData = {
      heightCm: 170,
      weightKg: 80,
      biologicalSex: 'male',
      activityLevel: 'sedentary',
    };
    const bmiResult = {
      bmi: 27.7,
      category: 'Overweight',
      dailyCalorieRecommendation: 2200,
    };

    const res = calculateCalorieAndMacros(bmiResult, healthData);
    expect(res.targetCalories).toBe(1800); // 2200 - 400
    expect(res.goalLabel).toBe('Sustainable Weight Loss Goal (-400 kcal/day)');
  });
});
