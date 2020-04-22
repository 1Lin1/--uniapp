const BASE_URL = 'http://localhost:3000'
export const myRequest = (options) => {
	return new Promise((reslove,reject) => {
		uni.request({
			url:`${BASE_URL}${options.url}` || '',
			data:options.data || '',
			success: (res) => {
			    resolve(res)
			}
		})
	})
}