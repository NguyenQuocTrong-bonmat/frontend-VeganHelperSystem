/**
 * BMI Nutrition & Daily Calorie Target Utilities (English)
 * Computes personalized daily calorie goals and macronutrient distribution
 * based on BMI category, biometric profile, and TDEE.
 */

export function calculateCalorieAndMacros(bmiResult, healthData) {
  const category = bmiResult?.category || 'Normal';
  const weight = Number(healthData?.weightKg) || 0;
  const height = Number(healthData?.heightCm) || 0;
  const sex = healthData?.biologicalSex || 'other';
  const activity = healthData?.activityLevel || 'moderate';

  // 1. Determine Maintenance TDEE
  let maintenance = bmiResult?.dailyCalorieRecommendation
    ? Number(bmiResult.dailyCalorieRecommendation)
    : null;

  if (!maintenance && weight >= 30 && height >= 100) {
    const age = 25;
    const sexOffset = sex === 'male' ? 5 : sex === 'female' ? -161 : -78;
    const bmr = 10 * weight + 6.25 * height - 5 * age + sexOffset;
    const factor = activity === 'sedentary' ? 1.2
      : activity === 'light' ? 1.375
      : activity === 'active' ? 1.725
      : activity === 'very_active' ? 1.9
      : 1.55;
    maintenance = Math.round(bmr * factor);
  }

  if (!maintenance) {
    return null;
  }

  // 2. Adjust target calories & macros according to BMI classification
  const catLower = String(category).toLowerCase();
  let targetCalories;
  let goalLabel;
  let proteinPercent;
  let carbsPercent;
  let fatPercent;

  if (catLower.includes('underweight')) {
    targetCalories = Math.round(maintenance + 400);
    goalLabel = 'Healthy Weight Gain Goal (+400 kcal/day)';
    proteinPercent = 20;
    carbsPercent = 55;
    fatPercent = 25;
  } else if (catLower.includes('overweight')) {
    targetCalories = Math.round(Math.max(1200, maintenance - 400));
    goalLabel = 'Sustainable Weight Loss Goal (-400 kcal/day)';
    proteinPercent = 25;
    carbsPercent = 50;
    fatPercent = 25;
  } else if (catLower.includes('obese')) {
    targetCalories = Math.round(Math.max(1200, maintenance - 500));
    goalLabel = 'Controlled Calorie Deficit Goal (-500 kcal/day)';
    proteinPercent = 30;
    carbsPercent = 45;
    fatPercent = 25;
  } else {
    // Normal / Balanced
    targetCalories = Math.round(maintenance);
    goalLabel = 'Maintain Current Weight';
    proteinPercent = 20;
    carbsPercent = 50;
    fatPercent = 30;
  }

  // 3. Compute macronutrient grams
  const proteinGrams = Math.round((targetCalories * (proteinPercent / 100)) / 4);
  const carbsGrams = Math.round((targetCalories * (carbsPercent / 100)) / 4);
  const fatGrams = Math.round((targetCalories * (fatPercent / 100)) / 9);

  return {
    targetCalories,
    maintenanceCalories: Math.round(maintenance),
    goalLabel,
    macros: {
      proteinPercent,
      carbsPercent,
      fatPercent,
      proteinGrams,
      carbsGrams,
      fatGrams,
    },
  };
}
