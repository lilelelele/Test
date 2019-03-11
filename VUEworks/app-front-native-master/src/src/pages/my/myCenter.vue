<template>
	<div class="my-center">
		<div class="user-layout">
			<img class="face-img" src="../../assets/face.jpg" @click="$router.push('/my/myPhoto')"/>
			<div class="user-info">
				<span>{{user.nickname}}</span>
				<span>{{user.username}}</span>
			</div>
		</div>

		<group v-auth="'app::clockinBtn'">
			<cell title="打卡签到" @click.native="signIn" />
		</group>

		<group>
			<cell title="设置" is-link :link="{path:'/my/myVideo'}" />
		</group>

		<group>
			<x-button type="warn" @click.native="exitLogin()">退出登录</x-button>
		</group>

		<!-- <div class="content-wrap"> -->
		<!-- <div class="person"><img class="face-img" src="../../assets/face.jpg"/><div>{{getCurUserName()}}</div></div> -->

		<!-- <group>
			<cell title="设置" is-link :link="{path:'/my/mySet'}">
				<img slot="icon" width="20" style="display:block;margin-right:5px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=">
			</cell>

		</group> -->
		
	</div>
</template>

<script>
	import { Confirm, Divider ,XInput, Card, Cell, CellBox, Group, XButton } from 'vux'
	import { logout, ifLogin } from "../../api/login";
	import { requestSignIn } from "../../api/sys";

	export default {
		components: { Card, Cell, CellBox, Group, XInput, XButton, Divider, Confirm },

		data:function(){
			return{
				user: {},

				longitude: 39.939042,//经度

				latitude: 116.430588,//纬度

				earth_radius: 6378.137,//地球半径
			}
		},

		created (){
			ifLogin();
			this.user = JSON.parse(localStorage.getItem("userJsonStr"))
		},

		methods: {
			// 退出登录
			exitLogin() {
				logout().then(res=>{
					// 清除jpush别名
					this.$jpush.setAlias(1, '');
				});
				localStorage.removeItem("userJsonStr")
				localStorage.removeItem("userFormJsonStr")
				this.$router.replace({path:'/login'});
			},

			//进行经纬度转换为距离的计算
			rad(d) {
				return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
			},

			//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
    		getDistance(lat1,lng1,lat2,lng2) {
				let [radLat1, radLat2] = [this.rad(lat1), this.rad(lat2)];
				let [a, b] = [radLat1 - radLat2, this.rad(lng1) - this.rad(lng2)];
				let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
				s = s * this.earth_radius ;// EARTH_RADIUS;
				s = Math.round(s * 10000) / 10000; //输出为公里
				//s=s.toFixed(4);
				return s;
			},

			// 签到
			signIn (){

				console.log('signIn');

				// if ('baidumap_location' in window) {
				// 	console.log(baidumap_location);
				// 	alert(JSON.stringify(baidumap_location));
				// 	baidumap_location.getCurrentPosition(function (result) {
				// 		alert(JSON.stringify(result));
				// 	}, function (error) {
				// 		alert(JSON.stringify(error));
				// 	});
				// } else {
				// 	console.error('baidumap_location is undefined');
				// 	alert('baidumap_location is undefined')
				// };

				// return false;

				navigator.geolocation.getCurrentPosition(position => {
					// let res = this.getDistance(position.coords.latitude, position.coords.longitude, this.latitude, this.longitude);
					// alert('距离公司：'+res+'--'+(res / 1000)+'米');

					let coor = position.coords.latitude + ',' + position.coords.longitude;
					requestSignIn(coor).then(res => {
						console.log('request sign in');
						console.log(coor);
						console.log(JSON.stringify(res));
						alert(res.data.msg);
					});
				}, error => {
					console.log(error);
				},{maximumAge: 10000, timeout: 10000, enableHighAccuracy: true});
			}
		}
	}
</script>

<style lang="scss">
	.my-center {
		width: 100vw;
		height: 100vh;
		background: #F2F2F2;
		position: fixed;

		.user-layout{
			width: 100vw;
			height: 130px;
			padding: 40px 30px 30px;
			box-sizing: border-box;
			background: #fff;

			.face-img {
				width: 60px;
				height: 60px;
				float: left;
			}

			.user-info{
				width: calc(100vw - 120px);
				height: 100%;
				display: block;
				float: right;
				position: relative;

				span{
					display: inline-block;
					position: absolute;
					left: 20px;

					&:nth-child(1){
						top: 5px;
						color: #000;
						font-size: 20px;
						font-weight: bold;
					}

					&:nth-child(2){
						bottom: 5px;
						color: #8D8D8D;
						font-size: 16px;
					}
				}
			}
		}

		

		.person {
			display: flex;
			margin: 0 0 0 20px;
		}

		.person > div {
			line-height: 60px;
			margin: 0 0 0 30px;
			font-size: 18px;
		}
	}
</style>


