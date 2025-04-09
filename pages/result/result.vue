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
							<view class="action-button" @click="showProfile">
								<text class="button-text">四维画像</text>
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

const comprehensiveScore = ref(0);
const comprehensiveDescription = ref('');

// 初始化zishufangan为null
const zishufangan = ref(null);

// 添加弹窗控制变量
const showFundingPlanPopup = ref(false);

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

		// 使用zizhuData调用runWorkflow获取资助方案
		isFundingPlanLoading.value = true;
		runWorkflow(zizhuData.value).then(res => {
			console.log('资助方案数据:', res.data);
			// 将字符串解析为JSON对象
			zishufangan.value = JSON.parse(res.data);
		}).catch(err => {
			console.error('获取资助方案失败:', err);
			uni.showToast({
				title: '获取资助方案失败',
				icon: 'none'
			});
		}).finally(() => {
			isFundingPlanLoading.value = false;
		});
		
		// 在所有动画完成后显示按钮
		setTimeout(() => {
			showButtons.value = true;
		}, 500);
	}, 1000);
};

onMounted(() => {
	// 初始化zishufangan数据
	// zishufangan.value = {
	// 	fangan: '资助方式：\n1. 考虑申请国家励志奖学金，一次性奖励5000元。申请条件为具有中华人民共和国国籍；热爱祖国，拥护中国共产党的领导；遵守宪法和法律，遵守学校规章制度；诚实守信，道德品质优良；二年级及以上年级；学习成绩和综合考评成绩班级排名前50%（含50%）；家庭经济困难，生活简朴，上一学年已被广东省教育厅认定为家庭经济困难学生。\n2. 申请"合一理想助学成长计划"，初期资助名额为10 - 15人，每人6000元/年，3年累计15000元（第3年3000元/人，资助至6月底，时长为半年）。申请条件是学业成绩优异，品德优良，家境贫寒而有上进心，有志向，有抱负的广州番禺职业技术学院全日制大一学生。\n\n思政教育活动安排：\n1. 定期组织主题班会，围绕爱国主义、诚信、感恩等主题展开讨论，引导学生树立正确的价值观和人生观。\n2. 安排与优秀学长学姐的交流活动，分享学习经验和成长故事，激励学生积极进取。\n3. 鼓励学生继续参与志愿服务活动，并在活动后组织分享会，加深学生对社会责任的理解。\n\n预期效果：\n1. 经济上缓解学生家庭经济压力，使其能够更专注于学业。\n2. 思想上培养学生积极向上的价值观，增强社会责任感和感恩之心，促进全面发展。',
	// 	fanganimg: "https://static.shutu.cn/shutu/jpeg/open9e/2025/04/09/6ac8f1c041a6a61eb7f2061d22f08380.jpeg",
	// 	govs: [
	// 		{
	// 			output: '# 广州番禺职业技术学院学生资助政策简介(2023年6月)\r\n2023-06-05 09:40:02广州番禺职业技术学院学生资助政策简介（2023年6月）\r\n学生资助咨询电话：020-34832651\r\n\r\n|资助项目|资助金额|资助对象及主要申请条件|资助人数或比例|\r\n|---|---|---|---|\r\n|**国家资助**|**国家奖学金**|一次性奖励8000元|1. 具有中华人民共和国国籍；&lt;br&gt;2. 热爱祖国，拥护中国共产党的领导；&lt;br&gt;3. 遵守宪法和法律，遵守学校规章制度；&lt;br&gt;4. 诚实守信，道德品质优良；&lt;br&gt;5. 在校期间学习成绩优异，社会实践、创新能力、综合素质等方面特别突出；&lt;br&gt;6. 年级要求：二年级及以上年级；&lt;br&gt;7. 成绩要求：学习成绩和综合考评成绩专业排名前10%（含10%）。|根据省教育厅下达名额确定|\r\n| |**国家励志奖学金**|一次性奖励5000元|1. 具有中华人民共和国国籍；&lt;br&gt;2. 热爱祖国，拥护中国共产党的领导；&lt;br&gt;3. 遵守宪法和法律，遵守学校规章制度；&lt;br&gt;4. 诚实守信，道德品质优良；&lt;br&gt;5. 年级要求：二年级及以上年级；&lt;br&gt;6. 成绩要求：学习成绩和综合考评成绩班级排名前50%（含50%）；&lt;br&gt;7. 家庭经济困难，生活简朴，上一学年已被广东省教育厅认定为家庭经济困难学生。|根据省教育厅下达名额确定|\r'
	// 		},
	// 		{
	// 			output: '广州番禺职业技术学院家庭经济困难大学新生资助管理办法(试行）（番职院学〔2019〕10号）\r\n来源：学生资助管理中心 发布时间：2023-07-06 11:50:39&nbsp;\n\r\n\r\n第一章 总 则\r\n\r\n第一条 为贯彻落实精准资助和高等学校家庭经济困难大学新生资助政策，帮助我校家庭经济困难新生顺利入学、安心学习，发挥资助育人功效，根据《广东省家庭经济困难大学新生资助专项资金管理办法》（粤财教〔2014〕97号）文件精神，结合我校实际，制定本管理办法。\r\n\r\n第二章 资金来源\r\n\r\n第二条 学校计划财务处根据每年事业收入金额，计提事业收入的0.5%作为家庭经济困难大学新生资助资金，并进行专项管理。\r\n\r\n第三条 学校计提资金不足以支付当年家庭经济困难新生申请资助额度时，由学生处、计划财务处向上级申请专项资金补助。\r\n\r\n第三章 申请条件\r\n\r\n第四条 广东省生源考入我校的，由于家庭经济困难，本人及其家庭所能筹集到的资金不足以缴纳第一学年学费的全日制学生，具有以下条件之一者，可申请家庭经济困难大学新生资助：\r\n\r\n1.孤残学生。此类学生需提供儿童福利证、孤儿证明或残疾人证作为佐证材料。\r\n\r\n2.烈士子女。此类学生需提供烈士证明或优抚对象证明作为佐证材料。\r\n\r\n3.优抚家庭子女。此类学生需提供优抚对象证明或因公牺牲警察证明作为佐证材料。\r\n\r\n4.城乡低保家庭子女。此类学生需提供低保证作为佐证材料。\r\n\r\n5.城乡低收入家庭子女。此类学生需提供特困职工证、救助证或低收入证作为佐证材料。\r\n\r\n6.其他有特殊情况的家庭经济困难学生。此类学生以提供民政等部门相关证明及学院认定为准。\r\n\r\n第五条 获得新生资助的学生，在同一学年内，原则上不再享受"建档立卡学生补助"、"少数民族大学生资助"、"南粤扶残助学工程"等省财政设立的其他专项资助。\r\n\r\n第四章 资助标准\r\n\r'
	// 		},
	// 		{
	// 			output: '广州番禺职业技术学院【合一理想助学成长计划】管理办法\r\n来源： 发布时间：2024-08-04 20:51:15&nbsp;\n为激励每一位家庭经济困难学生，使其感受到学校的温暖、社会的关爱、人间的真情，将助学与育人相结合，把经济扶困和智力扶困相凝聚，以培养精英技术人才为目标，宁波市合一慈善基金会在我校建立"合一理想助学成长计划"，资助家庭经济困难学生实现人生理想、开创美好前程。\r\n\r\n一、项目名称：广州番禺职业技术学院【合一理想助学成长计划】。\r\n\r\n二、资助对象：广州番禺职业技术学院全日制优秀贫困生。\r\n\r\n三、申请助学条件：学业成绩优异，品德优良，家境贫寒而有上进心，有志向，有抱负的广州番禺职业技术学院全日制大一学生。\r\n\r\n初期资助名额为10-15人，每人6000元/年，3年累计15000元（第3年3000元/人，资助至6月底，时长为半年）。\r\n\r\n四、受助人的责任和义务：受助期间，保持品学兼优；愿与资助方（宁波市合一慈善基金会）建立良好联系与沟通，并分享成长经历（按要求向资助方提交周（日）报、心得；积极参与学院与资助方组织的座谈会等活动）。\r\n\r\n五、受助人如出现下列情形之一的，由校方与资助方讨论后终止资助：\r\n\r\n（一）自动退学或作退学处理的；\r\n\r\n（二）违反校规校纪受到处分的；\r\n\r\n（三）成绩未达到班级排名前2/5（含）的；\r\n\r\n（四）家庭经济情况好转，不属家庭贫困的；\r\n\r\n（五）享受其他社会形式结对助学的。\r\n\r\n(六) 未能履行本办法中约定的受助人所需尽的责任和义务，并经核实的。\r\n\r\n六、实施程序：\r\n\r\n（一）每年九月初由学校在校园内公示此《广州番禺职业技术学院【合一理想助学成长计划】条例办法》。\r\n\r\n（二）每年十月由申请人自愿报名；\r\n\r\n（三）各专业推荐符合助学条件的学生1-2名，审核无误后上报；\r\n\r'
	// 		}
	// 	]
	// };

	console.log('从本地存储读取的uploadResults:', results);
	// 使用nextTick确保在页面渲染后调用
	nextTick(() => {
		fetchData();
	});
});

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

// 修改showFundingPlan函数
const showFundingPlan = () => {
	console.log('显示资助方案');
	showFundingPlanPopup.value = true;
};

// 添加关闭弹窗函数
const closeFundingPlanPopup = () => {
	console.log('关闭资助方案');
	showFundingPlanPopup.value = false;
};

const showProfile = () => {

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
</style>