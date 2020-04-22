//跳转到详情页对应的商品接口
let API_URL= 'http://localhost:3000'
// let API_URL= 'http://hello.shenzhuo.vip:10202'
export function getProductData(pid) {
  return new Promise(resolve => {
	  uni.request({
	      url: `${API_URL}/details`, //仅为示例，并非真实接口地址。
	      data: {
	          pid:pid
	      },
	      success: (res) => {
	          resolve(res.data)
	      }
	  });
  })
}

export class Goods{
	 constructor(itemInfo) {
	    this.pid =  itemInfo.pid;
	    this.title = itemInfo.title;
	    this.newPrice = itemInfo.newPrice;
	    this.oldPrice = itemInfo.oldPrice;
	    this.descmessage = itemInfo.descmessage;
	    this.cfav = itemInfo.cfav;
	    this.saleMan = itemInfo.saleMan;
	    this.company = itemInfo.company;
	    this.saleManPhone = itemInfo.saleManPhone;
	    this.shopName = itemInfo.shopName;
	  }
}