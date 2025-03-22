/**
 * Calculates the recommended weight for an exercise based on user parameters.
 *
 * @param bodyweight - The user's bodyweight in kilograms.
 * @param gender - The user's gender ('male' or 'female').
 * @param age - The user's age in years.
 * @param experience - The user's experience level ('beginner', 'intermediate', or 'advanced').
 * @param goal - The user's training goal ('lose weight', 'build muscle', or 'gain strength').
 * @returns The calculated weight as a number, or 0 if any parameter is undefined.
 */
const calculateWeight = (
  bodyweight: number,
  gender: string,
  age: number,
  experience: string,
  goal: string
): number => {
  if (!bodyweight || !gender || !age || !experience || !goal)
  {
    return 0;
  }

  let baseWeightPercentage: number;
  switch (experience) {
    case "beginner":
      baseWeightPercentage = 0.2;
      break;
    case "intermediate":
      baseWeightPercentage = 0.4;
      break;
    case "advanced":
      baseWeightPercentage = 0.6;
      break;
    default:
      baseWeightPercentage = 0.2; // Default to beginner if experience is invalid
  }

  let baseWeight = bodyweight * baseWeightPercentage;

  if (gender === "female") {
    baseWeight *= 0.85; // Reduce by 15% for females
  }

  if (age > 40) {
    baseWeight *= 0.95; // Reduce by 5% for users over 40
  }

  if (goal === "lose weight") {
    baseWeight *= 0.9; // Reduce by 10% for weight loss
  } else if (goal === "gain strength") {
    baseWeight *= 1.1; // Increase by 10% for strength gain
  }

  return Math.round(baseWeight);
}