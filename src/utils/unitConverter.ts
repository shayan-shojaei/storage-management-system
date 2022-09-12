import { Unit } from '../ingredient/ingredient.model';

// Array of arrays containing convertible units
const CONVERTIBLE_UNITS: Unit[][] = [
  ['CM', 'M'],
  ['G', 'KG'],
  ['ML', 'L'],
];

/**
 * Converts value from one unit to another.\
 * @param {number} value The value to convert
 * @param {Unit} originalUnit The unit to convert from
 * @param {Unit} targetUnit The unit to convert to
 */
export const unitConverter = (
  value: number,
  originalUnit: Unit,
  targetUnit: Unit,
) => {
  // check if conversion is possible between units
  if (!isConvertible(originalUnit, targetUnit)) {
    throw new Error(`Cannot convert ${originalUnit} to ${targetUnit}`);
  }

  // CM - M
  if (originalUnit === 'CM' && targetUnit === 'M') {
    return value / 100;
  } else if (originalUnit === 'M' && targetUnit === 'CM') {
    return value * 100;
  }

  // G - KG
  if (originalUnit === 'G' && targetUnit === 'KG') {
    return value / 1000;
  } else if (originalUnit === 'KG' && targetUnit === 'G') {
    return value * 1000;
  }

  // ML - L
  if (originalUnit === 'ML' && targetUnit === 'L') {
    return value / 1000;
  } else if (originalUnit === 'L' && targetUnit === 'ML') {
    return value * 1000;
  }
  return value;
};

/**
 * Checks whether conversion is possible between units
 */
export const isConvertible = (unit1: Unit, unit2: Unit) => {
  for (const convertible of CONVERTIBLE_UNITS) {
    if (convertible.includes(unit1) && convertible.includes(unit2)) return true;
  }
  return false;
};
