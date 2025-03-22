export function adjustWeightBasedOnRPE(currentWeight: number, rpe: number, targetRPE: number): number {
  if (rpe === targetRPE) {
    return currentWeight;
  } else if (rpe === targetRPE - 1) {
    return currentWeight * 1.025;
  } else if (rpe <= targetRPE - 2) {
    return currentWeight * 1.05;
  } else if (rpe === targetRPE + 1) {
    return currentWeight * 0.975;
  } else if (rpe >= targetRPE + 2) {
    return currentWeight * 0.95;
  }
  return currentWeight;
}

export function createPeriodizationBlock(weeks: number): { weekNumber: number; deload: boolean }[] {
  const block: { weekNumber: number; deload: boolean }[] = [];
  for (let i = 1; i <= weeks; i++) {
    block.push({
      weekNumber: i,
      deload: i % 4 === 0,
    });
  }
  return block;
}