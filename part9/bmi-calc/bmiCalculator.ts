const bmiCalculator = (height: number, weight: number): string => {
  if (height <= 0 || weight <= 0) {
    return "malformatted parameters";
  }
  const bmi = weight / Math.pow((height / 100), 2);

  switch (true) {
    case bmi < 16:
      return "Underweight (Severe thinness)";
    case bmi < 17:
      return "Underweight (Moderate thinness)";
    case bmi < 18.5:
      return "Underweight (Mild thinness)";
    case bmi < 25:
      return "Normal range";
    case bmi < 30:
      return "Overweight (Pre-obese)";
    case bmi < 35:
      return "Obese (Class I";
    case bmi < 40:
      return "Obese (Class II)";
    default:
      return "Obese (Class III)";
  }
};
// console.log(bmiCalculator(Number(process.argv[2]), Number(process.argv[3])))
export default bmiCalculator;