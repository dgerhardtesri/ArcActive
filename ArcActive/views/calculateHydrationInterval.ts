// Define and export an interface for the input parameters
export interface HydrationInput {
    weight: number; // in pounds
    height: number; // in inches
    temperature: number; // in Fahrenheit
    distance: number; // in miles
    totalAscent: number; // in feet
    totalDescent: number; // in feet
}

// Define constants for heuristic values
const BASE_WATER_NEED_FACTOR: number = 0.5; // 0.5 ounces of water per pound of body weight per hour
const HEIGHT_ADJUSTMENT_FACTOR: number = 0.005; // 0.5% adjustment per inch over 67 inches (170 cm)
const HIGH_TEMP_THRESHOLD: number = 86; // 30°C in Fahrenheit
const HIGH_TEMP_FACTOR: number = 1.5; // Increase by 50% for temperatures over 86°F
const LOW_TEMP_THRESHOLD: number = 50; // 10°C in Fahrenheit
const LOW_TEMP_FACTOR: number = 0.9; // Decrease by 10% for temperatures below 50°F
const DISTANCE_FACTOR: number = 0.1; // 10% increase per mile
const ELEVATION_FACTOR: number = 0.001; // 0.1% increase per foot of ascent/descent
const DRINK_AMOUNT: number = 8.5; // 8.5 ounces per drink

/**
 * Calculate the recommended hydration interval in minutes based on various factors.
 *
 * @param {HydrationInput} input - The input parameters for the calculation.
 * @returns {number} - The recommended hydration interval in minutes.
 */
export function calculateHydrationInterval(input: HydrationInput): number {
    const { weight, height, temperature, distance, totalAscent, totalDescent } = input;

    // Base water needs in ounces per hour
    const baseWaterNeed: number = weight * BASE_WATER_NEED_FACTOR;

    // Adjust base need based on height (taller people may sweat more)
    const heightAdjustment: number = (height - 67) * HEIGHT_ADJUSTMENT_FACTOR;

    // Adjust need based on temperature
    let temperatureFactor: number = 1;
    if (temperature > HIGH_TEMP_THRESHOLD) {
        temperatureFactor = HIGH_TEMP_FACTOR;
    } else if (temperature < LOW_TEMP_THRESHOLD) {
        temperatureFactor = LOW_TEMP_FACTOR;
    }

    // Adjust need based on distance
    const distanceFactor: number = distance * DISTANCE_FACTOR;

    // Adjust need based on elevation changes
    const elevationFactor: number = (totalAscent + totalDescent) * ELEVATION_FACTOR;

    // Calculate the total water need per hour
    const totalWaterNeed: number = baseWaterNeed * (1 + heightAdjustment + distanceFactor + elevationFactor) * temperatureFactor;

    // Convert the total water need per hour to the recommended interval in minutes
    const recommendedInterval: number = DRINK_AMOUNT / totalWaterNeed * 60;

    return recommendedInterval;
}

// Example usage:
const interval: number = calculateHydrationInterval({
    weight: 154, // in pounds
    height: 69, // in inches
    temperature: 77, // in Fahrenheit
    distance: 6.2, // in miles
    totalAscent: 656, // in feet
    totalDescent: 656 // in feet
});
console.log(`Recommended hydration interval: ${interval.toFixed(2)} minutes`);
