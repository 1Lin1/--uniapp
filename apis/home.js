let API_URL= 'http://localhost:3000'
// let API_URL= 'http://hello.shenzhuo.vip:10202'
export function getHomeData() {
	 return new Promise(resolve => {
		uni.request({
		    url: `${API_URL}/data`, //仅为示例，并非真实接口地址。
		    data: {
		        text: 'uni.request'
		    },
		    success: (res) => {
		        resolve(res.data[0].data)
		    } 
		})
	})
}

export function getGoodsList(){
	return new Promise(resolve => {
		uni.request({
		    url: `${API_URL}/goodsList`, //仅为示例，并非真实接口地址。
		    data: {
		        text: 'uni.request'
		    },
		    success: (res) => {
				// let finaldata = res.data.filter(item => item.type === 'pop')
				resolve(res.data)
		    }
		})
	})
}