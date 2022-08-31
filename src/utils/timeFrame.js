export const filterTimeFrame = (response, startDate, endDate, discreteness) => {
	let result = response.filter(item => {
		return (
			item.time.substr(0, 8) >= startDate && item.time.substr(0, 8) <= endDate
		)
	})

	const arrOfDates = []
	const arrOfSum = []
	let sum = 0
	let index = 0

	if (discreteness == 'h') {
		return [result, arrOfSum]
	}

	result = result.filter(item => {
		let isDateIncludes = false
		if (!arrOfDates.includes(item.time.substr(0, 8))) {
			index = 0
			sum = 0
			isDateIncludes = true
			arrOfDates.push(item.time.substr(0, 8))
		}
		sum += +item.medianGasPrice
		index++
		if (index === 24) {
			arrOfSum.push(sum / 24)
		}

		return isDateIncludes
	})

	if (discreteness == 'd') {
		return [result, arrOfSum]
	}

	index = 0
	sum = 0
	const arrOfWeekSum = []
	result = result.filter((item, i)=> {		
		sum += arrOfSum[index]
		if (i == 0 || index % 7 == 0) {
			arrOfWeekSum.push(i == 0 ? sum : sum / 7)
			sum = 0
			index++
			return true
		}		
		if(i == result.length - 1){
			arrOfWeekSum.push(sum / (index % 7))
			return true
		}		
		index++
	})

	console.log(arrOfWeekSum)

	return [result, arrOfWeekSum]
}
