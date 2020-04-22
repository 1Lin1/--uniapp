import {ADD_CONUTER,ADD_SHOPCART,PROD_CONUTER} from "./mutations-type.js";

export default {
	login(state, provider) {
		state.hasLogin = true;
		console.log(provider)
		state.userInfo = provider;
		uni.setStorage({ //缓存用户登陆状态
			key: 'userInfo',
			data: provider
		})
		// console.log(state.userInfo);
	},
	logout(state) {
		state.hasLogin = false;
		state.userInfo = {};
		uni.removeStorage({
			key: 'userInfo'
		})
	},
	
	//添加购物车
	
	//增加相同商品的数量
	 [ADD_CONUTER](state,payload){
	    payload.number ++;
	  },
	
	//减少相同商品的数量
	  [PROD_CONUTER](state,payload){
	    payload.number --;
	  },
	
	//添加新商品到购物车
	  [ADD_SHOPCART](state,payload){
	    payload.checked = true;
	    state.shopCart.push(payload);
	  },
	
	  ADD_CFav(state, payload) {
	    payload.cfav ++ ;
	  },
	
	  REMOVE_SHOP(state,pid){
	    // Vue.delete(state.shopCart,payload);
	    state.shopCart.forEach((item,index) =>{
	      if(item.pid === pid){
	        state.shopCart.splice(index,1);
	      }
	    })
	    console.log('delete' + pid);
	  },
	
	  setPwd_Token(state,payload){
	    state.pass_token = payload;
	  },
	  setUserName_Token(state,payload){
	    state.userName_token = payload;
	  },
	
	
	  // 处理登录状态
	  setUserLoadStatus(state,value){
	    state.isUserLoad = value;
	  },
	
	
	  //改变余额
	  setCurrentMoney(state,value){
	    state.currentMoney = value;
	  }

	
}
