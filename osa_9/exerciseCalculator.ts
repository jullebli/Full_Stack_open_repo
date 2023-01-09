interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: 1 | 2 | 3,
  ratingDescription: 'you can do better'|'not too bad but could be better'| 'well done!'
  target: number,
  average: number
}

type ThreeResults = [ 1 | 2 | 3,
            'you can do better'|'not too bad but could be better'| 'well done!',
            number]

const calculateExercises = (args: Array<number>, target: number): Result => {

const trainingDays = args.filter(value => value > 0).length

const success = () => {
  const foundValue = args.find(value => value < target)

  if (!foundValue) {
    return false
  } else {
    return true
  }
}
const calculatedRating = (): ThreeResults => {
  if (args.length === 0) {
    return [1, 'you can do better', 0];
  }
  const sum = args.reduce( (sum, value) => sum + value, 0 )
  
  const average = sum / args.length
  if (average > target) {
    return [3, 'well done!', average];
  } else if (average > target / 2) {
    return [2, 'not too bad but could be better', average];
  } else {
    return [1, 'you can do better', average];
  }
}

const ratingResuts = calculatedRating() 

const result: Result =
{ periodLength: args.length,
  trainingDays: trainingDays,
  success: success(),
  rating: ratingResuts[0],
  ratingDescription: ratingResuts[1],
  target: target,
  average: ratingResuts[2]
}

  return result
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))