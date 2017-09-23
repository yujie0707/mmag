<template>
	<div style="font-size: .3rem;">
		<p v-if="type == 1">
			未在青岛区的用户没有参加此活动的资格
		</p>
		<p v-if="type == 2">
			获取位置失败，请 <a @click="other()">重试</a>
		</p>
		<p v-if="type == 3">
			未给予获取位置权限，没有参与资格
		</p>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				type:1
			}
		},
		activated(){
			this.type = this.$route.params.type;
		},
		methods:{
			other(){
				this.$router.push("/bargain");
			}
		}
	}
</script>

<style>
</style>