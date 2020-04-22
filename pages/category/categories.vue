<template>
	<view class="content">
		<scroll-view class="left-aside" scroll-y>
				<view class="left-aside-item" v-for="item in 15">
					家居生活
				</view>
				
		</scroll-view>
			
		<view class="right">
				
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	
	.content{
		height: 100%;
		.left-aside{
			height: 100%;
			width:200rpx;
			border-right: 1px solid #eee;
			.left-aside-item{
				text-align: center;
				height: 100rpx;
				line-height: 100rpx;
				width: 200rpx;
				border-top: 1px solid #eee;
			}
		}
	}
	
</style>
