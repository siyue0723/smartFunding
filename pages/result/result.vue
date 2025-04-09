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
				<text class="page-title">解析结果</text>
			</view>

			<!-- 四维画像展示 -->
			<view class="profile-section" :class="{ 'animate-in': isLoaded }" v-if="!isProfileLoading && profileItems.length > 0">
				<view class="profile-header" @click="toggleProfile">
					<view class="title-wrapper">
						<text class="profile-title">学生画像</text>
					</view>
					<view class="profile-icon">
						<u-icon :name="showProfile ? 'arrow-up' : 'arrow-down'" color="#66bb6a" size="16"></u-icon>
					</view>
				</view>
				<view class="profile-content" :class="{ 'profile-content-open': showProfile }">
					<view class="profile-grid">
						<view class="profile-card" v-for="(item, index) in profileItems" :key="index">
							<view class="card-header-row">
								<view class="card-icon">
									<u-icon :name="item.icon" color="#1b5e20" size="20"></u-icon> 
								</view>
								<text class="card-title">{{ item.title }}</text>
							</view>
							<view class="card-content-row">
								<text class="card-text">{{ item.content }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 综合资助指数 -->
			<view class="comprehensive-index" :class="{ 'animate-in': isLoaded }">
				<view class="index-header">
					<text class="index-title">综合资助指数</text>
				</view>
				<view class="index-content">
					<view class="loading-container" v-if="isDataLoading">
						<view class="loading-dots">
							<view class="dot"></view>
							<view class="dot"></view>
							<view class="dot"></view>
						</view>
						<text class="loading-text">正在计算综合指数...</text>
					</view>
					<template v-else>
						<view class="index-score-wrapper">
							<text class="index-score">{{ comprehensiveScore }}</text>
							<text class="index-unit">分</text>
						</view>
						<view class="index-progress">
							<view class="index-progress-fill" :style="{ width: `${comprehensiveScore}%` }"></view>
						</view>
						<text class="index-description typewriter">{{ comprehensiveDescription }}</text>

						<!-- 添加按钮组 -->
						<view class="action-buttons" :class="{ 'show-buttons': showButtons }">
							<view class="action-button" :class="{ 'loading': isFundingPlanLoading }" @click="!isFundingPlanLoading && showFundingPlan()">
								<view class="button-content">
									<view class="loading-dots" v-if="isFundingPlanLoading">
										<view class="dot"></view>
										<view class="dot"></view>
										<view class="dot"></view>
									</view>
									<text class="button-text">{{ isFundingPlanLoading ? '加载中...' : '智慧方案' }}</text>
								</view>
							</view>
						</view>
					</template>
				</view>
			</view>

			<!-- 相关搜索来源 -->
			<view class="sources-container animate-in">
				<view class="sources-summary" @click="toggleSources">
					<text class="sources-count">
						<template v-if="isDataLoading">正在搜索相关信息...</template>
						<template v-else>参考了 {{ displaySourceCount }} 个来源</template>
					</text>
					<u-icon :name="showSources ? 'arrow-up' : 'arrow-down'" color="#66bb6a" size="16"></u-icon>
				</view>
				<view class="search-results" v-show="showSources">
					<view class="loading-container" v-if="isDataLoading">
						<view class="loading-dots">
							<view class="dot"></view>
							<view class="dot"></view>
							<view class="dot"></view>
						</view>
						<text class="loading-text">正在搜索相关来源...</text>
					</view>
					<template v-else>
						<view v-for="(item, index) in dataObj?.output3" :key="index" class="search-item">
							<view class="search-item-content">
								<view class="search-info">
									<text class="search-title typewriter">{{ item.title }}</text>
									<text class="search-summary typewriter">{{ item.summary }}</text>
									<view class="search-meta">
										<text class="search-source">{{ item.sitename }}</text>
									</view>
								</view>
							</view>
						</view>
					</template>
				</view>
			</view>

			<view class="content">
				<!-- 贫困特征评分 -->
				<view class="section" :class="{ 'animate-in': isLoaded }">
					<view class="section-header" @click="togglePoverty">
						<view class="title-wrapper">
							<text class="section-title">贫困特征评分</text>
							<view class="score-container">
								<text class="score">{{ povertyScore }}</text>
								<text class="score-unit">分</text>
							</view>
						</view>
						<u-icon :name="showPoverty ? 'arrow-up' : 'arrow-down'" color="#66bb6a" size="16"></u-icon>
					</view>
					<view class="section-content" v-show="showPoverty">
						<view class="loading-container" v-if="isDataLoading">
							<view class="loading-dots">
								<view class="dot"></view>
								<view class="dot"></view>
								<view class="dot"></view>
							</view>
							<text class="loading-text">正在分析贫困特征...</text>
						</view>
						<template v-else>
							<text class="description typewriter">{{ povertyDescription }}</text>
							<view class="progress-bar">
								<view class="progress-fill" :style="{ width: `${povertyScore}%` }"></view>
							</view>
						</template>
					</view>
				</view>

				<!-- 思政行为评分 -->
				<view class="section" :class="{ 'animate-in': isLoaded }">
					<view class="section-header" @click="toggleBehavior">
						<view class="title-wrapper">
							<text class="section-title">思政行为评分</text>
							<view class="score-container">
								<text class="score">{{ behaviorScore }}</text>
								<text class="score-unit">分</text>
							</view>
						</view>
						<u-icon :name="showBehavior ? 'arrow-up' : 'arrow-down'" color="#66bb6a" size="16"></u-icon>
					</view>
					<view class="section-content" v-show="showBehavior">
						<view class="loading-container" v-if="isDataLoading">
							<view class="loading-dots">
								<view class="dot"></view>
								<view class="dot"></view>
								<view class="dot"></view>
							</view>
							<text class="loading-text">正在分析思政行为...</text>
						</view>
						<template v-else>
							<text class="description typewriter">{{ behaviorDescription }}</text>
							<view class="progress-bar">
								<view class="progress-fill" :style="{ width: `${behaviorScore}%` }"></view>
							</view>
						</template>
					</view>
				</view>
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

		<!-- 资助方案弹窗 -->
		<up-popup :show="showFundingPlanPopup" mode="center" @close="closeFundingPlanPopup" :round="10" :overlay="true"
			:closeOnClickOverlay="true" :safeAreaInsetBottom="true">
			<view class="funding-plan-popup">
				<view class="popup-header">
					<text class="popup-title">资助+思政方案</text>
					<view class="close-button" @click="closeFundingPlanPopup">
						<up-icon name="close" color="#1b5e20" size="20"></up-icon>
					</view>
				</view>
				<view class="popup-content">
					<view class="loading-container" v-if="isFundingPlanLoading">
						<view class="loading-dots">
							<view class="dot"></view>
							<view class="dot"></view>
							<view class="dot"></view>
						</view>
						<text class="loading-text">正在生成资助方案...</text>
					</view>
					<template v-else>
						<view class="plan-section">
							<text class="section-label">资助与思政方式</text>
							<view class="plan-text-wrapper">
								<text class="plan-text">{{ zishufangan?.fangan || '暂无资助方案' }}</text>
							</view>
						</view>
						<view class="plan-section" v-if="zishufangan?.fanganimg">
							<text class="section-label">方案导图</text>
							<image :src="zishufangan.fanganimg" mode="widthFix" class="plan-image"></image>
						</view>
						<view class="plan-section" v-if="zishufangan?.govs?.length">
							<text class="section-label">相关政策来源(截取)</text>
							<view v-for="(gov, index) in zishufangan.govs" :key="index" class="gov-item"
								@click="toggleGov(index)">
								<view class="gov-text-wrapper">
									<text class="gov-text">{{ expandedGovs[index] ? gov.output : getFirstLine(gov.output)
										}}</text>
								</view>
								<view class="expand-button">
									<up-icon :name="expandedGovs[index] ? 'arrow-up' : 'arrow-down'" color="#66bb6a"
										size="16"></up-icon>
								</view>
							</view>
						</view>
					</template>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { runWorkflow } from '@/utils/runWorkflow.js';

const results = uni.getStorageSync('uploadResults');
const dataObj = ref(null);
const isLoaded = ref(true);
const showSources = ref(false);
const showButtons = ref(false);

// 添加缓存相关的常量
const CACHE_KEY = 'analysis_result_cache';
const CACHE_EXPIRE_TIME = 24 * 60 * 60 * 1000; // 24小时的毫秒数

// 添加新的响应式变量
const povertyScore = ref(0);
const behaviorScore = ref(0);
const povertyDescription = ref('');
const behaviorDescription = ref('');
const displaySourceCount = ref(0);
const sourceCount = ref(0);
const isDataLoading = ref(true);
const isFundingPlanLoading = ref(false); // 添加资助方案加载状态

// 添加折叠状态控制
const showPoverty = ref(true);
const showBehavior = ref(true);
const showComprehensive = ref(true);
const showProfile = ref(true); // 添加学生画像折叠状态控制

const comprehensiveScore = ref(0);
const comprehensiveDescription = ref('');

// 初始化zishufangan为null
const zishufangan = ref(null);

// 添加弹窗控制变量
const showFundingPlanPopup = ref(false);
const showProfilePopup = ref(false);
const isProfileLoading = ref(false);
const profileData = ref({
	attribute: '暂无数据',
	Behavior: '暂无数据',
	Psychology: '暂无数据',
	tags: '暂无数据'
});

const profileItems = ref([]);

// 添加展开状态控制
const expandedGovs = ref({});

// 将zizhuData改为响应式变量
const zizhuData = ref({
	workflow_id: '7491272557266976819',
	parameters: {
		score: 0,
		shenqinshu: '',
		sizheng: '',
		shitang: ''
	}
});

const tagList = ref([]);

// 获取政策的第一行
const getFirstLine = (text) => {
	if (!text) return '';
	return text.split('\n')[0];
};

// 打字机效果函数
const typewriter = (text, target, baseDelay = 100) => {
	target.value = '';
	let index = 0;
	const typeNextChar = () => {
		if (index < text.length) {
			target.value += text[index];
			index++;
			// 计算下一个字符的延迟时间，随着文本长度增加而减少
			const nextDelay = Math.max(baseDelay - (index * 0.5), 20);
			setTimeout(typeNextChar, nextDelay);
		}
	};
	typeNextChar();
};

// 数字递增效果函数
const animateNumber = (target, end, duration = 1000) => {
	target.value = 0;
	const start = 0;
	const increment = end / (duration / 16);
	let current = start;

	const timer = setInterval(() => {
		current += increment;
		if (current >= end) {
			target.value = end;
			clearInterval(timer);
		} else {
			target.value = Math.floor(current);
		}
	}, 16);
};

// 计算综合资助指数
const calculateComprehensiveScore = () => {
	const score = Math.round(povertyScore.value * 0.6 + behaviorScore.value * 0.4);

	// 根据分数生成描述
	if (score >= 80) {
		comprehensiveDescription.value = '该学生综合表现优秀，建议给予重点资助。';
	} else if (score >= 60) {
		comprehensiveDescription.value = '该学生综合表现良好，建议给予适当资助。';
	} else if (score >= 40) {
		comprehensiveDescription.value = '该学生综合表现一般，建议给予基本资助。';
	} else {
		comprehensiveDescription.value = '该学生综合表现欠佳，建议给予基础资助。';
	}
};

// 获取数据函数
const fetchData = () => {
	isDataLoading.value = true;

	// 尝试从缓存获取数据
	// const cachedData = uni.getStorageSync(CACHE_KEY);
	const cachedData = null;
	if (cachedData) {
		const { data, timestamp } = JSON.parse(cachedData);
		// 检查缓存是否过期
		if (Date.now() - timestamp < CACHE_EXPIRE_TIME) {
			processData(data);
			isDataLoading.value = false;
			return;
		} else {
			// 缓存过期，删除缓存
			uni.removeStorageSync(CACHE_KEY);
		}
	}

	let thinkData = {
		workflow_id: '7491209530827636771',
		parameters: {
			input: results
		}
	}

	runWorkflow(thinkData).then(res => {
		let data = res.data;
		console.log(data);
		dataObj.value = JSON.parse(data);

		// 将数据存入缓存
		const cacheData = {
			data: data,
			timestamp: Date.now()
		};
		uni.setStorageSync(CACHE_KEY, JSON.stringify(cacheData));

		processData(data);
		isDataLoading.value = false;
	}).catch(err => {
		console.error('获取数据失败:', err);
		uni.showToast({
			title: '获取数据失败',
			icon: 'none'
		});
		isDataLoading.value = false;
	});
};

// 处理数据的函数
const processData = (data) => {
	dataObj.value = JSON.parse(data);
	sourceCount.value = dataObj.value?.output3?.length || 0;

	typewriter(dataObj.value?.output1?.贫困特征分析 || '', povertyDescription);
	typewriter(dataObj.value?.output2?.思政行为评估分析 || '', behaviorDescription);
	animateNumber(povertyScore, dataObj.value?.output1?.贫困评分 || 0);
	animateNumber(behaviorScore, dataObj.value?.output2?.思政评分 || 0);
	animateNumber(displaySourceCount, sourceCount.value);

	// 在分数动画完成后计算综合指数
	setTimeout(() => {
		calculateComprehensiveScore();
		// 添加综合指数的数字递增动画
		animateNumber(comprehensiveScore, Math.round(povertyScore.value * 0.6 + behaviorScore.value * 0.4));
		typewriter(comprehensiveDescription.value, comprehensiveDescription);
		
		// 更新zizhuData
		zizhuData.value.parameters.score = comprehensiveScore.value;
		zizhuData.value.parameters.shenqinshu = results[0].data;
		zizhuData.value.parameters.shitang = results[1].data;
		zizhuData.value.parameters.sizheng = results[2].data;

		// 在综合指数计算完成后自动请求资助方案数据
		fetchFundingPlan();
		
		// 在所有动画完成后显示按钮，按钮状态由isFundingPlanLoading控制
		setTimeout(() => {
			showButtons.value = true;
		}, 500);
	}, 1000);
};

onMounted(() => {
	console.log('从本地存储读取的uploadResults:', results);
	// 使用nextTick确保在页面渲染后调用
	nextTick(() => {
		// 并行调用，不相互依赖
		fetchData();
		fetchProfileData(); 
	});
});

const fetchProfileData = () => {
	isProfileLoading.value = true;
	console.log('fetchProfileData started, isProfileLoading:', isProfileLoading.value);
	
	const rprofileData = {
		workflow_id: '7491300817274830899',
		parameters: {
			input1: results[0].data,
			input2: results[1].data,
			input3: results[2].data
		}
	};

	runWorkflow(rprofileData).then(res => {
		console.log('画像原始数据:', res);
		// 处理画像数据
		let data = res.data;
		let profileContent;
		try {
			profileContent = JSON.parse(data);
			console.log('画像解析后数据:', profileContent);
		} catch (e) {
			console.error('解析画像数据失败:', e);
			uni.showToast({
				title: '解析画像数据格式错误',
				icon: 'none'
			});
			isProfileLoading.value = false; // 解析失败也要结束loading
			return; // 提前返回
		}
		
		// 更新基础数据
		profileData.value = {
			attribute: profileContent.attribute || '暂无数据',
			Behavior: profileContent.Behavior || '暂无数据',
			Psychology: profileContent.Psychology || '暂无数据',
			tags: profileContent.tags || '暂无数据'
		};

		// 更新profileItems
		profileItems.value = [
			{
				icon: 'account',
				title: '基础信息',
				content: profileData.value.attribute
			},
			{
				icon: 'star',
				title: '行为特征',
				content: profileData.value.Behavior
			},
			{
				icon: 'heart',
				title: '心理特征',
				content: profileData.value.Psychology
			},
			{
				icon: 'tags',
				title: '个人标签',
				content: profileData.value.tags
			}
		];
		console.log('profileItems 更新后:', profileItems.value, '长度:', profileItems.value.length);
		
		// 使用nextTick确保DOM更新后再显示动画
		nextTick(() => {
			isProfileLoading.value = false;
			console.log('nextTick 后, isProfileLoading:', isProfileLoading.value);
		});
		
	}).catch(err => {
		console.error('获取画像失败:', err);
		uni.showToast({
			title: '获取画像失败',
			icon: 'none'
		});
		isProfileLoading.value = false;
		console.log('catch 后, isProfileLoading:', isProfileLoading.value);
	});
};

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 切换来源列表显示状态
const toggleSources = () => {
	showSources.value = !showSources.value;
};

// 添加折叠切换函数
const togglePoverty = () => {
	showPoverty.value = !showPoverty.value;
};

const toggleBehavior = () => {
	showBehavior.value = !showBehavior.value;
};

const toggleComprehensive = () => {
	showComprehensive.value = !showComprehensive.value;
};

// 添加切换学生画像折叠状态的函数
const toggleProfile = () => {
	showProfile.value = !showProfile.value;
};

// 修改showFundingPlan函数
const showFundingPlan = () => {
	console.log('显示资助方案');
	// 直接显示弹窗，因为数据已经在综合指数计算后自动加载了
	showFundingPlanPopup.value = true;
};

// 保留fetchFundingPlan函数，但不在点击时调用
const fetchFundingPlan = () => {
	isFundingPlanLoading.value = true;
	runWorkflow(zizhuData.value).then(res => {
		console.log('资助方案数据:', res.data);
		try {
			// 将字符串解析为JSON对象
			zishufangan.value = JSON.parse(res.data);
		} catch (e) {
			console.error('解析资助方案数据失败:', e);
			uni.showToast({
				title: '解析资助方案数据失败',
				icon: 'none'
			});
		}
	}).catch(err => {
		console.error('获取资助方案失败:', err);
		uni.showToast({
			title: '获取资助方案失败',
			icon: 'none'
		});
	}).finally(() => {
		// 确保在完成后重置加载状态
		isFundingPlanLoading.value = false;
	});
};

// 添加关闭弹窗函数
const closeFundingPlanPopup = () => {
	console.log('关闭资助方案');
	showFundingPlanPopup.value = false;
};

// 重命名函数，避免与ref变量同名
const openProfilePopup = () => {
	showProfilePopup.value = true;
};

const closeProfilePopup = () => {
	showProfilePopup.value = false;
};

// 切换政策展开状态
const toggleGov = (index) => {
	expandedGovs.value[index] = !expandedGovs.value[index];
};
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	min-height: 100vh;
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
	max-width: 100%;
	box-sizing: border-box;
}

.header {
	width: 100%;
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	position: relative;
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

.content {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
	max-width: 92%;
	margin: 0 auto;
}

.section {
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 20px;
	padding: 20px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
	transform: translateY(30px);
	opacity: 0;
	transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	border: 1px solid rgba(102, 187, 106, 0.1);
	backdrop-filter: blur(10px);

	&.animate-in {
		transform: translateY(0);
		opacity: 1;
	}

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
	}
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0;
	cursor: pointer;
	transition: all 0.3s ease;
	padding: 8px;
	border-radius: 12px;

	&:active {
		background-color: rgba(102, 187, 106, 0.05);
	}
}

.title-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex: 1;
	gap: 12px;
}

.section-title {
	font-size: 16px;
	font-weight: 600;
	color: #1b5e20;
	letter-spacing: 0.5px;
	position: relative;
	padding-left: 12px;

	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 14px;
		background: linear-gradient(to bottom, #43a047, #66bb6a);
		border-radius: 2px;
	}
}

.score-container {
	display: flex;
	align-items: baseline;
	background: linear-gradient(135deg, rgba(102, 187, 106, 0.1), rgba(76, 175, 80, 0.1));
	padding: 4px 12px;
	border-radius: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.score {
	font-size: 24px;
	font-weight: 700;
	background: linear-gradient(135deg, #43a047, #66bb6a);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	transition: all 0.5s ease;
}

.score-unit {
	font-size: 12px;
	color: #66bb6a;
	margin-left: 2px;
	font-weight: 500;
}

.section-content {
	height: auto;
	padding: 0 4px;
	overflow: hidden;
	transition: all 0.3s ease;
}

.section-content[v-show="false"] {
	height: 0;
	padding-top: 0;
	padding-bottom: 0;
	margin: 0;
	opacity: 0;
}

.section-content[v-show="true"] {
	height: auto;
	margin-top: 16px;
	opacity: 1;
}

.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px 0;
	min-height: 100px;
}

.loading-dots {
	display: flex;
	gap: 8px;
	margin-bottom: 12px;
}

.loading-dots .dot {
	width: 8px;
	height: 8px;
	background-color: #66bb6a;
	border-radius: 50%;
	animation: bounce 1.4s infinite ease-in-out;
	opacity: 0.3;

	&:nth-child(1) {
		animation-delay: -0.32s;
	}

	&:nth-child(2) {
		animation-delay: -0.16s;
	}
}

.loading-text {
	font-size: 14px;
	color: #66bb6a;
	opacity: 0.8;
}

@keyframes bounce {

	0%,
	80%,
	100% {
		transform: scale(0);
	}

	40% {
		transform: scale(1);
		opacity: 1;
	}
}

.description {
	font-size: 15px;
	color: #424242;
	line-height: 1.8;
	letter-spacing: 0.3px;
}

.progress-bar {
	height: 8px;
	background-color: rgba(102, 187, 106, 0.1);
	border-radius: 4px;
	margin-top: 20px;
	overflow: hidden;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-fill {
	height: 100%;
	background: linear-gradient(to right, #43a047, #66bb6a);
	border-radius: 4px;
	width: 0;
	transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.typewriter {
	overflow: hidden;
	white-space: pre-wrap;
	word-break: break-word;
}

.sources-container {
	width: 92%;
	margin: 0 auto;
	transform: translateY(30px);
	opacity: 0;
	transition: all 0.5s ease;
	margin-bottom: 20px;

	&.animate-in {
		transform: translateY(0);
		opacity: 1;
	}
}

.sources-summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: rgba(102, 187, 106, 0.1);
	padding: 12px 16px;
	border-radius: 10px;
	margin: 0;
	cursor: pointer;
	transition: all 0.3s ease;

	&:active {
		background-color: rgba(102, 187, 106, 0.2);
	}
}

.sources-count {
	font-size: 14px;
	color: #43a047;
	font-weight: 500;
	position: relative;
	display: inline-block;
}

.fade-transition {
	transition: opacity 0.3s ease;

	&.v-enter-from,
	&.v-leave-to {
		opacity: 0;
	}

	&.v-enter-to,
	&.v-leave-from {
		opacity: 1;
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.sources-count {
	animation: fadeIn 0.3s ease forwards;
}

.search-results {
	padding: 0;
	width: 100%;
}

.search-item {
	background-color: rgba(102, 187, 106, 0.05);
	border-radius: 10px;
	padding: 16px;
	transform: translateY(20px);
	opacity: 0;
	animation: fadeInUp 0.5s forwards;
}

@keyframes fadeInUp {
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

.search-item-content {
	display: flex;
	gap: 12px;
}

.search-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.search-title {
	font-size: 15px;
	font-weight: 500;
	color: #2e7d32;
	line-height: 1.4;
}

.search-summary {
	font-size: 13px;
	color: #555;
	line-height: 1.4;
}

.search-meta {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 4px;
}

.search-source {
	font-size: 12px;
	color: #66bb6a;
	background-color: rgba(102, 187, 106, 0.1);
	padding: 2px 8px;
	border-radius: 10px;
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
	.section {
		padding: 16px;
	}

	.section-title {
		font-size: 16px;
	}

	.score {
		font-size: 24px;
	}

	.description {
		font-size: 13px;
	}

	.sources-summary {
		padding: 10px 14px;
	}
}

.comprehensive-index {
	width: 92%;
	margin: 20px auto;
	padding: 24px;
	background: linear-gradient(135deg, #1b5e20, #2e7d32);
	border-radius: 24px;
	box-shadow: 0 10px 30px rgba(27, 94, 32, 0.2);
	transform: translateY(30px);
	opacity: 0;
	transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	max-width: 92%;
	box-sizing: border-box;

	&.animate-in {
		transform: translateY(0);
		opacity: 1;
	}
}

.index-header {
	text-align: center;
	margin-bottom: 20px;
}

.index-title {
	font-size: 20px;
	font-weight: 600;
	color: #ffffff;
	letter-spacing: 1px;
}

.index-content {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.index-score-wrapper {
	display: flex;
	align-items: baseline;
	justify-content: center;
	margin-bottom: 16px;
}

.index-score {
	font-size: 48px;
	font-weight: 700;
	color: #ffffff;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.index-unit {
	font-size: 20px;
	color: rgba(255, 255, 255, 0.9);
	margin-left: 4px;
}

.index-progress {
	width: 100%;
	height: 12px;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 6px;
	margin: 16px 0;
	overflow: hidden;
}

.index-progress-fill {
	height: 100%;
	background: linear-gradient(to right, #81c784, #a5d6a7);
	border-radius: 6px;
	transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.index-description {
	font-size: 16px;
	color: rgba(255, 255, 255, 0.9);
	text-align: center;
	line-height: 1.6;
	margin-top: 16px;
	padding: 0 20px;
}

.action-buttons {
	display: flex;
	justify-content: center;
	gap: 16px;
	margin-top: 24px;
	opacity: 0;
	transform: translateY(-20px);
	transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	pointer-events: none;

	&.show-buttons {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}
}

.action-button {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	padding: 12px 24px;
	border-radius: 12px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	transition: all 0.3s ease;
	
	&.loading {
		opacity: 0.7;
		pointer-events: none;
	}
	
	&:active:not(.loading) {
		transform: scale(0.98);
		background: rgba(255, 255, 255, 0.25);
	}
}

.button-text {
	color: #ffffff;
	font-size: 16px;
	font-weight: 500;
	letter-spacing: 1px;
}

.button-content {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
}

.loading-dots {
	display: flex;
	gap: 4px;
}

.loading-dots .dot {
	width: 6px;
	height: 6px;
	background-color: #ffffff;
	border-radius: 50%;
	animation: bounce 1.4s infinite ease-in-out;
	opacity: 0.3;

	&:nth-child(1) {
		animation-delay: -0.32s;
	}

	&:nth-child(2) {
		animation-delay: -0.16s;
	}
}

/* 资助方案弹窗样式 */
.funding-plan-popup {
	width: 90vw;
	max-width: 600px;
	max-height: 80vh;
	background-color: #ffffff;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
}

.popup-header {
	flex-shrink: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	background-color: #ffffff;
	position: relative;

	&::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(to right,
				rgba(102, 187, 106, 0.5),
				rgba(102, 187, 106, 0.2),
				transparent);
	}
}

.popup-content {
	flex: 1;
	overflow-y: auto;
	padding: 12px;
}

.plan-section {
	margin-bottom: 20px;

	&:last-child {
		margin-bottom: 0;
	}
}

.plan-text-wrapper {
	background-color: rgba(102, 187, 106, 0.05);
	border-radius: 8px;
	padding: 12px;
	border: 1px solid rgba(102, 187, 106, 0.1);
}

.plan-text {
	font-size: 14px;
	color: #333;
	line-height: 1.6;
	white-space: pre-line;
}

.plan-image {
	width: 100%;
	border-radius: 10px;
	margin: 12px 0;
}

.gov-item {
	background-color: rgba(102, 187, 106, 0.1);
	border-radius: 8px;
	margin-bottom: 8px;
	position: relative;
	cursor: pointer;

	&:last-child {
		margin-bottom: 0;
	}

	&:active {
		background-color: rgba(102, 187, 106, 0.2);
	}
}

.gov-text-wrapper {
	padding: 12px;
	padding-right: 32px;
}

.gov-text {
	font-size: 14px;
	color: #333;
	line-height: 1.6;
	white-space: pre-line;
}

.expand-button {
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
}

/* 修改滚动条样式 */
:deep(.popup-content::-webkit-scrollbar) {
	width: 4px;
}

:deep(.popup-content::-webkit-scrollbar-thumb) {
	background-color: rgba(102, 187, 106, 0.3);
	border-radius: 2px;
}

:deep(.popup-content::-webkit-scrollbar-track) {
	background-color: transparent;
}

.section-label {
	font-size: 16px;
	font-weight: 600;
	color: #1b5e20;
	margin-bottom: 12px;
	display: flex;
	align-items: center;
	position: relative;
	padding-left: 12px;

	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 16px;
		background: linear-gradient(to bottom, #43a047, #66bb6a);
		border-radius: 1.5px;
	}

	&::after {
		content: '';
		flex: 1;
		height: 1px;
		background: linear-gradient(to right, rgba(102, 187, 106, 0.2), transparent);
		margin-left: 12px;
	}
}

.popup-title {
	font-size: 18px;
	font-weight: 600;
	color: #1b5e20;
	position: relative;
	padding-left: 16px;

	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 4px;
		height: 18px;
		background: linear-gradient(to bottom, #43a047, #66bb6a);
		border-radius: 2px;
	}
}

.close-button {
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 16px;
	transition: background-color 0.3s;

	&:active {
		background-color: rgba(102, 187, 106, 0.1);
	}
}

/* 新的学生画像折叠样式 */
.profile-section {
	width: 92%;
	margin: 20px auto;
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 20px;
	padding: 16px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
	border: 1px solid rgba(102, 187, 106, 0.1);
	backdrop-filter: blur(10px);
	transform: translateY(30px);
	opacity: 0;
	transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	
	&.animate-in {
		transform: translateY(0);
		opacity: 1;
	}
	
	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
	}
}

.profile-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	cursor: pointer;
	transition: all 0.3s ease;
	padding: 5px 8px;
	border-radius: 8px;
	
	&:active {
		background-color: rgba(102, 187, 106, 0.05);
	}
}

.profile-title {
	font-size: 16px;
	font-weight: 600;
	color: #1b5e20;
	position: relative;
	display: inline-block;
	
	&::after {
		content: '';
		position: absolute;
		bottom: -3px;
		left: 50%;
		transform: translateX(-50%);
		width: 30px;
		height: 2px;
		background: linear-gradient(to right, #43a047, #66bb6a);
		border-radius: 1px;
	}
}

.profile-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 16px;
	transition: background-color 0.3s;
	
	&:active {
		background-color: rgba(102, 187, 106, 0.1);
	}
}

.card-header-row {
	display: flex;
	align-items: center;
	gap: 10px;
}

.card-icon {
	width: 36px;
	height: 36px;
	background-color: rgba(102, 187, 106, 0.1);
	border-radius: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-top: 2px;
}

.card-title {
	font-size: 14px;
	font-weight: 600;
	color: #1b5e20;
	line-height: 1.3;
}

.card-content-row {
	flex: 1;
}

.card-text {
	font-size: 12px;
	color: #424242;
	line-height: 1.5;
	white-space: normal;
	overflow: visible;
	word-break: break-word;
}

.profile-content {
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.5s ease-out;
	opacity: 0;
}

.profile-content-open {
	max-height: 2000px; /* 设置一个足够大的高度以适应内容 */
	opacity: 1;
	transition: max-height 0.5s ease-in, opacity 0.3s ease;
}

.profile-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
	margin-top: 16px;
	padding-bottom: 10px;
}

@media screen and (max-width: 375px) {
	.profile-grid {
		grid-template-columns: 1fr;
	}
}

.profile-card {
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 16px;
	padding: 14px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	opacity: 0;
	transform: translateY(20px);
	animation: card-appear 0.4s forwards;
	animation-play-state: paused;
	
	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
	}
}

.profile-content-open .profile-card {
	animation-play-state: running;
}

.profile-card:nth-child(1) { animation-delay: 0.1s; }
.profile-card:nth-child(2) { animation-delay: 0.2s; }
.profile-card:nth-child(3) { animation-delay: 0.3s; }
.profile-card:nth-child(4) { animation-delay: 0.4s; }

@keyframes card-appear {
	0% {
		opacity: 0;
		transform: translateY(20px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>