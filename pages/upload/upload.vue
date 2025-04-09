<template>
	<view class="container" :class="{ 'loaded': isLoaded }">
		<view class="wave-container">
			<image src="/static/wave.svg" mode="widthFix" class="wave-image"></image>
		</view>
		<view class="content-wrapper">
			<view class="header">
				<view class="back-button" @click="goBack">
					<u-icon name="arrow-left" color="#1b5e20" size="24"></u-icon>
				</view>
				<text class="page-title">文件上传</text>
			</view>

			<view class="upload-container">
				<view class="upload-item" v-for="(item, index) in uploadItems" :key="index">
					<view class="upload-card" @click="selectFile(index)">
						<view class="upload-icon">
							<u-icon :name="item.uploaded ? 'checkmark-circle' : 'plus-circle'" size="40"
								:color="item.uploaded ? '#43a047' : '#66bb6a'"></u-icon>
						</view>
						<view class="upload-info">
							<text class="upload-title">{{ item.title }}</text>
							<text class="upload-status" v-if="!item.uploading">{{ item.uploaded ? '已上传' : '点击上传'
							}}</text>
							<text v-if="item.fileName" class="file-name">{{ item.fileName }}</text>
							<view class="progress-container" v-if="item.uploading">
								<u-line-progress :percentage="item.progress" :show-text="false" height="4"
									active-color="#43a047"></u-line-progress>
								<text class="progress-text">{{ item.progress }}%</text>
							</view>
						</view>
					</view>

				</view>
			</view>

			<view class="button-container">
				<u-button text="提交资料" type="primary" size="large" @click="submitFiles" class="submit-button"
					:disabled="!allFilesUploaded" hover-class="button-hover"></u-button>
			</view>
			<u-button text="test" type="primary" size="large" @click="totest" class="submit-button"
				hover-class="button-hover"></u-button>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import uploadFile from '@/utils/uploadFile.js';
import { runWorkflow } from '@/utils/runWorkflow.js';

// 页面加载动画效果
const isLoaded = ref(false);
// 状态栏高度
const statusBarHeight = ref(0);

onMounted(() => {
	// 获取系统信息，包括状态栏高度
	try {
		const systemInfo = uni.getSystemInfoSync();
		statusBarHeight.value = systemInfo.statusBarHeight || 0;
		console.log('状态栏高度:', statusBarHeight.value);
	} catch (e) {
		console.error('获取系统信息失败:', e);
	}

	setTimeout(() => {
		isLoaded.value = true;
	}, 300);
});


const files = ref([
	{
		type: 'file',
		file_id: ''
	}, {
		type: 'file',
		file_id: ''
	}, {
		type: 'file',
		file_id: ''
	}
])


// 上传项目数据
const uploadItems = ref([
	{
		title: '学生资助申请表',
		uploaded: false,
		uploading: false,
		progress: 0,
		fileName: '',
		fileData: null
	},
	{
		title: '食堂消费数据',
		uploaded: false,
		uploading: false,
		progress: 0,
		fileName: '',
		fileData: null
	},
	{
		title: '志愿服务记录',
		uploaded: false,
		uploading: false,
		progress: 0,
		fileName: '',
		fileData: null
	}
]);

// 计算是否所有文件都已上传
const allFilesUploaded = computed(() => {
	return uploadItems.value.every(item => item.uploaded);
});

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 选择文件
const selectFile = (index) => {
	// 使用uploadFile.js中的chooseAndUploadFile方法
	const options = {
		count: 1, // 最多可以选择的文件数量
		type: 'file', // 选择文件而非图片
		extension: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'] // 根据实际需求设置可选择的文件类型
	};

	// 设置上传状态
	uploadItems.value[index].uploading = true;
	uploadItems.value[index].progress = 0;

	// 使用真实的上传API
	uploadFile.chooseAndUploadFile(options)
		.then(result => {
			console.log('文件上传成功:', result);

			// 更新文件信息
			uploadItems.value[index].fileName = result.fileName || '已上传文件';
			uploadItems.value[index].fileData = result;
			uploadItems.value[index].uploaded = true;
			uploadItems.value[index].uploading = false;
			uploadItems.value[index].progress = 100;

			uni.showToast({
				title: '上传成功',
				icon: 'success'
			});
			files.value[index].file_id = result.id;
		})
		.catch(err => {
			console.error('文件上传失败:', err);
			uploadItems.value[index].uploading = false;
			uploadItems.value[index].progress = 0;

			uni.showToast({
				title: err.errMsg || '上传失败',
				icon: 'none'
			});
		});
};

const totest = () => {
	uni.navigateTo({
		url: '/pages/result/result'
	});
}

// 监听上传进度（如果API支持）
uni.$on('uploadProgress', (data) => {
	if (data && data.index !== undefined && data.progress !== undefined) {
		uploadItems.value[data.index].progress = data.progress;
	}
});

// 提交所有文件
const submitFiles = () => {
	if (allFilesUploaded.value) {
		uni.showLoading({
			title: '提交中...'
		});

		const results = [];
		let completedCount = 0;

		files.value.forEach((item, index) => {
			let fileData = {
				workflow_id: '7491208390270746665',
				parameters: {
					input: item
				}
			}
			runWorkflow(fileData).then(res => {
				// 将结果按索引和文件名拼接
				results[index] = {
					index,
					fileName: uploadItems.value[index].fileName,
					data: res.data
				};
				completedCount++;

				// 所有文件处理完成
				if (completedCount === files.value.length) {
					uni.hideLoading();
					// 使用本地存储保存结果数据
					uni.setStorageSync('uploadResults', results);
					uni.navigateTo({
						url: '/pages/result/result'
					});
				}
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: '提交失败',
					icon: 'none'
				});
			})
		})

	} else {
		uni.showToast({
			title: '请上传所有必要文件',
			icon: 'none'
		});
	}
};

// 组件销毁时移除事件监听
onBeforeUnmount(() => {
	uni.$off('uploadProgress');
});
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
	padding-top: var(--status-bar-height);

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
	width: 100%;
	padding: 20px;
	z-index: 1;
	transform: translateY(20px);
	opacity: 0;
	transition: all 0.8s ease;
}

.header {
	width: 100%;
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	position: relative;
	/* 使用固定的安全区域高度加上额外的间距 */
	padding-top: calc(var(--status-bar-height) + 12px);
}

.back-button {
	position: absolute;
	left: 0;
	padding: 10px;
	z-index: 2;
}

.page-title {
	flex: 1;
	font-size: 20px;
	font-weight: bold;
	color: #1b5e20;
	text-align: center;
}

.upload-container {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-bottom: 30px;
}

.upload-item {
	width: 100%;
}

.upload-card {
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 12px;
	padding: 16px;
	display: flex;
	align-items: center;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	transition: transform 0.3s ease, box-shadow 0.3s ease;

	&:active {
		transform: scale(0.98);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	}
}

.upload-icon {
	margin-right: 16px;
}

.upload-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.upload-title {
	font-size: 16px;
	font-weight: bold;
	color: #1b5e20;
	margin-bottom: 4px;
}

.upload-status {
	font-size: 14px;
	color: #66bb6a;
}

.file-name {
	font-size: 12px;
	color: #757575;
	margin-top: 4px;
	word-break: break-word;
	writing-mode: horizontal-tb !important;
	text-orientation: mixed !important;
	white-space: normal;
	overflow-wrap: break-word;
	direction: ltr !important;
	text-align: left !important;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
	transform: none !important;
	rotate: none !important;
}

.progress-container {
	width: 100%;
	margin-top: 10px;
}

.progress-text {
	font-size: 12px;
	color: #43a047;
	text-align: right;
	margin-top: 4px;
}

.button-container {
	width: 80%;
	max-width: 300px;
	margin-top: 20px;
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

:deep(.u-button--disabled) {
	opacity: 0.6 !important;
	background: linear-gradient(to right, #a5d6a7, #c8e6c9) !important;
}

.button-hover {
	transform: translateY(3px);
	box-shadow: 0 4px 8px rgba(67, 160, 71, 0.2) !important;
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
	.upload-container {
		gap: 12px;
		margin-bottom: 20px;
	}

	.upload-card {
		padding: 12px;
	}

	.upload-title {
		font-size: 14px;
	}

	.upload-status {
		font-size: 12px;
	}
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
	transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}

.page-enter-from {
	opacity: 0;
	transform: translateX(30px);
}

.page-leave-to {
	opacity: 0;
	transform: translateX(-30px);
}
</style>