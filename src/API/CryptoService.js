import axios from 'axios'

export default class GameService {
	static async getData() {
		try {
			const response = await axios.get(
				'https://raw.githubusercontent.com/CryptoRStar/GasPriceTestTask/main/gas_price.json'
			)
			return response.data.ethereum.transactions
		} catch (e) {
			console.log(e)
		}
	}
}
