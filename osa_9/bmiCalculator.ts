
const calculateBmi = (height: number, weight: number) : string => {
  const divider = (height/100) * (height/100)
  //console.log("divider", divider)
  const result = weight / divider
  //console.log("result", result)

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
      return "Should not go here"
  }
}

console.log(calculateBmi(180, 74))