import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import CryptoService from '../API/CryptoService'
import { useFetching } from '../hooks/useFetching'
import { Chart as ChartJS } from 'chart.js/auto'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { filterTimeFrame } from '../utils/timeFrame'
import '../styles/timeline.css'

const Timeline = () => {
	const [fullGasData, setFullGasData] = useState([])
	const [gas, setGas] = useState([])
	const [timeFrame, setTimeFrame] = useState('month')
	const [timeFramesSum, setTimeFramesSum] = useState([])
	const [discreteness, setDiscreteness] = useState('d')

	const filterTimeFrameAndDiscreteness = data => {
		const [filteredTimeFrame, sum] = filterTimeFrame(
			data,
			timeFrame === 'month' ? '22-07-05' : '22-01-01',
			'22-08-05',
			discreteness
		)

		setTimeFramesSum(sum)
		setGas(filteredTimeFrame)
	}

	const [fetchData, dataError] = useFetching(async () => {
		const response = await CryptoService.getData()
		setFullGasData(response)

		filterTimeFrameAndDiscreteness(response)
	})

	useEffect(() => {
		fetchData()
	}, [])

	useEffect(() => {
		filterTimeFrameAndDiscreteness(fullGasData)
	}, [timeFrame, discreteness])

	if (dataError) {
		console.log('Error: ' + dataError)

		return (
			<div>
				<p>Error: loading error</p>
			</div>
		)
	}

	return (
		<div className='timelineBody' style={{}}>
			<div className='nav'>
				<span>Time frame: </span>
				<select
					value={timeFrame}
					className='navSelect'
					onChange={e => setTimeFrame(e.target.value)}
				>
					<option value='month'>Last month</option>
					<option value='all'>All</option>
				</select>
				<span> Discreteness: </span>
				<select
					value={discreteness}
					className='navSelect'
					onChange={e => setDiscreteness(e.target.value)}
				>
					<option value='h'>Hours</option>
					<option value='d'>Days</option>
					<option value='w'>Weeks</option>
				</select>
			</div>

			<Line
				data={{
					labels: gas.map(obj =>
						discreteness == 'h'
							? obj.time.replaceAll('-', '.')
							: obj.time.substr(0, 8).replaceAll('-', '.')
					),
					datasets: [
						{
							data:
								discreteness == 'h'
									? gas.map(obj => obj.medianGasPrice)
									: timeFramesSum.map(val => val),
							label: 'Median Gas Price',
							borderColor: '#EEBC1D',
						},
					],
				}}
			/>
		</div>
	)
}

export default Timeline
