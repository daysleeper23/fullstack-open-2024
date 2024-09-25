interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const readArgugmentsToArray = (): number[] => {
  const argCount = process.argv.length
  // console.log("arg length", argCount)
  return process.argv.slice(3, argCount).map(Number)
}

const exerciseCalculator = (exerciseHours: number[], target: number): Result => {
  const periodLength = exerciseHours.length
  // console.log('p length', periodLength)
  if (periodLength === 0)
  {
    return {
      periodLength,
      trainingDays: 0,
      success: false,
      rating: 0,
      ratingDescription: "invalid data - zero training",
      target,
      average: 0
    }
  }

  const dataValidation = exerciseHours.filter(hour => hour < 0).length
  if (dataValidation > 0)
  {
    return {
      periodLength,
      trainingDays: 0,
      success: false,
      rating: 0,
      ratingDescription: "invalid data - negative hours",
      target,
      average: 0
    }
  }

  const trainingDays = exerciseHours.filter(hour => hour > 0).length
  const average = exerciseHours.reduce((acc, cur) => acc + cur) / periodLength
  const success = target > average ? false : true
  let rating = 0
  let ratingDescription = "not too bad but could be better"

  if (target > 0) {
    const performance = average / target * 100
    // console.log('performance', performance)
    switch (true) {
      case (performance < 75):
        rating = 1
        ratingDescription = "definitely need more effort"
        break
      case (performance < 98):
        rating = 2
        ratingDescription = "not too bad but could be better"
        break
      default:
        rating = 3
        ratingDescription = "keep up the good work"
        break
    }
  } else {
    console.log("invalid target")
    rating = 0
    ratingDescription = "invalid data - target"
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  }
}

console.log(exerciseCalculator(readArgugmentsToArray(), Number(process.argv[2])))