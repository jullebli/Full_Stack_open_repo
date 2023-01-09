
interface CalculationValues {
  height: number;
  weight: number;
}

const validateArguments = (args: Array<string>): CalculationValues => {
  if (args.length < 4) {
    throw new Error("Not enough arguments");
  }
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    if ((Number(args[2]) <= 0 || Number(args[3]) <= 0)) {
      throw new Error("Provided values must be greater than 0");
    }
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    }
  } else {
    throw new Error("Provided values were not numbers!");
  }
}

const calculateBmi = (height: number, weight: number) : string => {
  const divider = (height/100) * (height/100);
  const result = weight / divider;

  switch (true) {
    case result >= 20 && result < 25:
      return "Normal (healthy weight)";
    case result >= 25 && result < 30:
      return "Overweight (unhealthy weight)";
    case result >= 30:
      return "Obese (unhealthy weight)";
    case result < 20:
      return "Underweight (unhealthy weight)";
    default:
      return "Should not go here";
  }
}

try {
  const { height, weight } = validateArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "There is an error";
  if (error instanceof Error) {
    errorMessage += ": " + error.message;
  }
  console.log(errorMessage)
}
