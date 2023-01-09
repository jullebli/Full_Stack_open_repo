interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription:
    | "you can do better"
    | "not too bad but could be better"
    | "well done!";
  target: number;
  average: number;
}

interface ExerciseValues {
  array: number[];
  target: number;
}

const validateExerciseArguments = (args: Array<string>): ExerciseValues => {
  //last argument is the target value
  if (args.length < 4) {
    throw new Error("Not enough arguments");
  }

  // take away the "run" and "calculateExercises"
  args = args.slice(2);
  const numberArray = args.map(Number);

  if (numberArray.find((value) => Number.isNaN(value)) !== undefined) {
    throw new Error("All provided values were not numbers!");
  }

  const target = Number(numberArray.pop());

  return {
    array: numberArray,
    target: target,
  };
};

type ThreeResults = [
  1 | 2 | 3,
  "you can do better" | "not too bad but could be better" | "well done!",
  number
];

const calculateExercises = (args: Array<number>, target: number): Result => {
  const trainingDays = args.filter((value) => value > 0).length;

  const success = () => {
    const foundValue = args.find((value) => value < target);

    if (foundValue === undefined) {
      return true;
    } else {
      return false;
    }
  };

  const calculatedRating = (): ThreeResults => {
    if (args.length === 0) {
      return [1, "you can do better", 0];
    }
    const sum = args.reduce((sum, value) => sum + value, 0);

    const average = sum / args.length;
    if (average > target) {
      return [3, "well done!", average];
    } else if (average > target / 2) {
      return [2, "not too bad but could be better", average];
    } else {
      return [1, "you can do better", average];
    }
  };

  const ratingResuts = calculatedRating();

  const result: Result = {
    periodLength: args.length,
    trainingDays: trainingDays,
    success: success(),
    rating: ratingResuts[0],
    ratingDescription: ratingResuts[1],
    target: target,
    average: ratingResuts[2],
  };
  return result;
};

try {
  const { array, target } = validateExerciseArguments(process.argv);
  console.log(calculateExercises(array, target));
} catch (error: unknown) {
  let errorMessage = "There is an error";
  if (error instanceof Error) {
    errorMessage += ": " + error.message;
  }
  console.log(errorMessage);
}
