export default {
	
	 
	 //获取购物车商品数量
	  CartLength(state){
	    return state.shopCart.length
	  },
	  //获取购物车商品数据
	  CartListGetters(state){
	    return state.shopCart
	  },
	  
	  hasLogin(state){
	  		return state.hasLogin
	  }
} 