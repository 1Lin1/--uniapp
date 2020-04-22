<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
				
				
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view
						class="cart-item" 
						:class="{'b-b': index!==cartList.length-1}"
					>
						<view class="image-wrapper">
							<image :src="item.image" 
								:class="[item.loaded]"
								mode="aspectFill" 
								lazy-load 
								@load="onImageLoad('cartList', index)" 
								@error="onImageError('cartList', index)"
							></image>
							<view 
								class="yticon icon-xuanzhong2 checkbox"
								:class="{checked: item.checked}"
								@click="check('item', index)"
							></view>
						</view>
						<view class="item-right">
							<text class="clamp title" @click="toCurrentProd(`${item.pid}`)">{{item.pid}}{{item.title}}</text>
							<text class="attr">{{item.attr_val}}</text>
							<text class="price">{{item.newPrice | filterPrice}}</text>
							<text class="old-price">{{item.oldPrice | filterPrice}}</text>
							<uni-number-box 
								:key="item.number"
								class="step"
								:min="1" 
								:max="2000"
								:value="item.number ===0 ?1:item.number"
								:isMax="item.number>=2000?true:false"
								:isMin="item.number===1"
								:index="index"
								@eventChange="numberChange"
							></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			
			
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{total}}</text>
					<text class="coupon">
						已优惠
						<text>{{total - oldTotal | filterPrice}}</text>
						元
					</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				oldTotal:0,//优惠前总价格
				total: 0, //总价格
				currentVal:0,//当前数量
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
			};
		},
		
		onShow() {
			this.loadData();
		},
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed:{
			...mapGetters(['hasLogin','CartListGetters'])
		},
		methods: {
			
			
			//请求数据
			 loadData(){
				
				uni.showLoading({
				    title: '加载中'
				})
				 
				// let list = await this.$api.json('cartList'); 
				// let cartList = list.map(item=>{
				// 	item.checked = true;
				// 	return item;
				// });
				// 如果有cookie数据 直接赋值 数量
				
				let list = this.CartListGetters;
					//将所有的商品数量全部重置为1 不给以直接在input上修改 有bug
				let newCartList = list.map(item => {
					item.number = 1;
					return item
				})
					
				this.cartList = newCartList; 
				
			
				
				this.calcTotal();  //计算总价 
				
				uni.hideLoading();
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			 //选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			
			numberChange(data){
				this.cartList[data.index].number = data.number;
				this.calcTotal();
			},
			//删除
			deleteCartItem(index){
				let list = this.cartList;
				let row = list[index];
				let pid = row.pid;

				this.cartList.splice(index, 1);
				
				//删除相对应的商品cookie
				//删除相对应商品的vuex数据
				this.$store.dispatch('removeShop',pid).then(res =>{
				    uni.setStorage({
				    	key:'shopCartStorage',
				    	data:this.cartList
				    })
				})
				
				
				this.calcTotal();
				uni.hideLoading();
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							this.cartList.forEach(item => {
								this.$store.dispatch('removeShop',item.pid).then(res =>{
								         this.cartList = [];
										 uni.setStorage({
										 	key:'shopCartStorage',
										 	data:this.cartList
										 })
								     })
							})
							
							
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				let list = this.cartList;
				if(list.length === 0){
					this.empty = true;
					return;
				}
				let total = 0;
				let oldTotal = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						total += item.newPrice * item.number;
						oldTotal += item.oldPrice * item.number;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
				this.oldTotal = Number(oldTotal.toFixed(2))
			},
			//创建订单
			createOrder(){
				let list = this.cartList;
				let goodsData = [];
				let isSelect = list.filter(item => item.checked === true)
				console.log(isSelect)
				if(isSelect.length !== 0){
					list.forEach(item=>{
						if(item.checked){
							goodsData.push({
								title:item.title,
								image:item.image,
								attr_val: item.attr_val,
								number: item.number,
								newPrice:item.newPrice,
								oldPrice:item.oldPrice,
								shopName:item.shopName,
								pid:item.pid
							})
						}
					})
					
					uni.navigateTo({
						url: `/pages/order/createOrder?data=${JSON.stringify({
							goodsData: goodsData
						})}`
					})
				}else{
					this.$api.msg('请至少勾选一项商品 进行结算')
				}
			},
			
			//回跳到原商品页面
			toCurrentProd(pid){
				uni.navigateTo({
					url: `/pages/product/product?id=${pid}`
				})
			}
				 
		},
		filters: {
			filterPrice(price) {
				return '￥' + Number(price).toFixed(2)
			}
		}
	}
</script>

<style lang='scss'>
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:30upx 40upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 60upx;
				line-height:60upx;
				color: red;
			}
			.old-price{
				font-size: 24upx;
				height: 60upx;
				line-height:60upx;
				text-decoration: line-through;
				color: $font-color-light;
				
				position: relative;
				bottom: 60upx;
				left: 160upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
</style>
