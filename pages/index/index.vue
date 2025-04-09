<template>
	<view class="container" :class="{ 'loaded': isLoaded }">
		<view class="wave-container">
			<image src="/static/wave.svg" mode="widthFix" class="wave-image"></image>
		</view>
		<view class="content-wrapper">
			<view class="logo-container">
				<view class="logo-circle">
					<text class="logo-text">智</text>
				</view>
			</view>
			<view class="title-container">
				<text class="title">智能资助思政助手</text>
				<text class="subtitle">您的学习成长好帮手</text>
			</view>
			<view class="button-container">
				<u-button text="立即开始" type="primary" size="large" @click="startApp" class="start-button" hover-class="button-hover"></u-button>
			</view>
		</view>
		<view class="floating-dots">
			<view class="dot dot-1"></view>
			<view class="dot dot-2"></view>
			<view class="dot dot-3"></view>
			<view class="dot dot-4"></view>
			<view class="dot dot-5"></view>
		</view>
		<view class="footer">
			<text class="footer-text">© 2025 智能资助思政助手</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 页面加载动画效果
const isLoaded = ref(false);

onMounted(() => {
	setTimeout(() => {
		isLoaded.value = true;
	}, 300);
});

const startApp = () => {
	console.log('开始使用应用');
	// 导航到上传文件页面
	uni.navigateTo({
		url: '/pages/upload/upload',
		animationType: 'slide-in-right', // 添加滑动动画
		animationDuration: 300 // 设置动画持续时间
	});
};
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
	position: relative;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: -10%;
		left: -10%;
		width: 120%;
		height: 120%;
		background: radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0) 70%);
		z-index: 0;
	}

	&.loaded .content-wrapper {
		transform: translateY(0);
		opacity: 1;
	}

	&.loaded .dot {
		opacity: 0.7;
		transform: translateY(0);
	}
}

.content-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 20px;
	z-index: 1;
	transform: translateY(20px);
	opacity: 0;
	transition: all 0.8s ease;
}

.logo-container {
	margin-bottom: 40px;
}

.logo-circle {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	background: linear-gradient(145deg, #43a047, #66bb6a);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), inset 0 -5px 10px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease, box-shadow 0.3s ease;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15), inset 0 -5px 10px rgba(0, 0, 0, 0.1);
	}
}

.logo-text {
	font-size: 48px;
	font-weight: bold;
	color: white;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.title-container {
	margin-bottom: 60px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.title {
	font-size: 32px;
	font-weight: bold;
	color: #1b5e20;
	text-align: center;
	margin-bottom: 10px;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	letter-spacing: 1px;
}

.subtitle {
	font-size: 18px;
	color: #388e3c;
	text-align: center;
	opacity: 0.8;
}

.button-container {
	width: 80%;
	max-width: 300px;
}

/* 覆盖u-button的默认样式 */
:deep(.u-button) {
	background: linear-gradient(to right, #43a047, #66bb6a) !important;
	height: 55px;
	font-size: 18px;
	border-radius: 30px !important;
	box-shadow: 0 8px 15px rgba(67, 160, 71, 0.3);
	transition: all 0.3s ease;
	border: none !important;
	letter-spacing: 1px;

	&:active {
		transform: translateY(3px);
		box-shadow: 0 4px 8px rgba(67, 160, 71, 0.2);
	}
}

.button-hover {
	transform: translateY(3px);
	box-shadow: 0 4px 8px rgba(67, 160, 71, 0.2) !important;
}

:deep(.u-button--plain) {
	color: #43a047 !important;
	border-color: #43a047 !important;
	background: transparent !important;
	box-shadow: none;
}

.wave-container {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	z-index: 0;
	overflow: hidden;
}

.wave-image {
	width: 100%;
	transform: translateY(50%);
}

.floating-dots {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 0;
}

.dot {
	position: absolute;
	border-radius: 50%;
	background-color: #4caf50;
	opacity: 0;
	transform: translateY(20px);
	transition: opacity 0.8s ease, transform 0.8s ease;
}

.dot-1 {
	top: 15%;
	left: 10%;
	width: 12px;
	height: 12px;
	animation: float 6s ease-in-out infinite;
}

.dot-2 {
	top: 25%;
	right: 15%;
	width: 18px;
	height: 18px;
	animation: float 7s ease-in-out infinite 1s;
}

.dot-3 {
	bottom: 30%;
	left: 20%;
	width: 15px;
	height: 15px;
	animation: float 5s ease-in-out infinite 0.5s;
}

.dot-4 {
	top: 40%;
	right: 25%;
	width: 10px;
	height: 10px;
	animation: float 8s ease-in-out infinite 2s;
}

.dot-5 {
	bottom: 40%;
	right: 10%;
	width: 14px;
	height: 14px;
	animation: float 6s ease-in-out infinite 1.5s;
}

@keyframes float {
	0% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-20px);
	}
	100% {
		transform: translateY(0);
	}
}

.footer {
	width: 100%;
	padding: 15px 0;
	text-align: center;
	z-index: 1;
}

.footer-text {
	font-size: 12px;
	color: #388e3c;
	opacity: 0.7;
}

/* 添加响应式设计 */
@media screen and (max-height: 600px) {
	.logo-circle {
		width: 80px;
		height: 80px;
	}
	
	.logo-text {
		font-size: 36px;
	}
	
	.title {
		font-size: 28px;
	}
	
	.subtitle {
		font-size: 16px;
	}
	
	.title-container {
		margin-bottom: 40px;
	}
	
	.logo-container {
		margin-bottom: 30px;
	}
}
</style>