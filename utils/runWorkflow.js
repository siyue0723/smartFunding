/**
 * runWorkflow.js
 * 封装执行工作流API接口
 */

import request from './request.js';

// 执行工作流API地址
const RUN_WORKFLOW_URL = 'https://api.coze.cn/v1/workflow/run';
// 执行工作流（流式响应）API地址
const STREAM_RUN_WORKFLOW_URL = 'https://api.coze.cn/v1/workflow/stream_run';

/**
 * 执行工作流
 * @param {Object} params - 请求参数
 * @param {String} params.workflow_id - 待执行的Workflow ID，此工作流应已发布
 * @param {Object} [params.parameters] - 工作流开始节点的输入参数及取值
 * @param {String} [params.bot_id] - 需要关联的Bot ID
 * @param {Object} [params.ext] - 用于指定一些额外的字段，以Map[String][String]格式传入
 * @param {Boolean} [params.is_async] - 是否异步运行，true表示异步运行，false表示同步运行
 * @param {String} [params.app_id] - 引用workflow的应用ID
 * @returns {Promise} - 返回Promise对象，成功时返回工作流执行结果
 */
const runWorkflow = (params) => {
  // 参数校验
  if (!params || !params.workflow_id) {
    return Promise.reject(new Error('工作流ID不能为空'));
  }
  
  // 构建请求参数
  const requestData = {
    workflow_id: params.workflow_id,
    parameters: params.parameters || {},
    is_async: params.is_async || false
  };
  
  // 添加可选参数
  if (params.bot_id) {
    requestData.bot_id = params.bot_id;
  }
  
  if (params.ext) {
    requestData.ext = params.ext;
  }
  
  if (params.app_id) {
    requestData.app_id = params.app_id;
  }
  
  // 发起请求
  return request.post(RUN_WORKFLOW_URL, requestData, {
    header: {
      'Content-Type': 'application/json'
    },
    timeout: 120000 // 设置超时时间为120秒
  }).then(response => {
    // 处理响应
    if (response.code === 0) {
      // 请求成功
      return {
        success: true,
        data: response.data,
        execute_id: response.execute_id,
        debug_url: response.debug_url,
        is_async: params.is_async || false
      };
    } else {
      // 请求失败
      return Promise.reject({
        success: false,
        code: response.code,
        message: response.msg || '执行工作流失败'
      });
    }
  }).catch(error => {
    // 处理异常
    return Promise.reject({
      success: false,
      message: error.errMsg || '网络请求异常',
      error
    });
  });
};

/**
 * 执行工作流（流式响应）
 * @param {Object} params - 请求参数
 * @param {String} params.workflow_id - 待执行的Workflow ID，此工作流应已发布
 * @param {Object} [params.parameters] - 工作流开始节点的输入参数及取值
 * @param {String} [params.bot_id] - 需要关联的Bot ID
 * @param {Object} [params.ext] - 用于指定一些额外的字段，以Map[String][String]格式传入
 * @param {String} [params.app_id] - 引用workflow的应用ID
 * @returns {Promise} - 返回Promise对象，成功时返回工作流执行结果
 */
const streamRunWorkflow = (params) => {
  // 参数校验
  if (!params || !params.workflow_id) {
    return Promise.reject(new Error('工作流ID不能为空'));
  }
  
  // 构建请求参数
  const requestData = {
    workflow_id: params.workflow_id,
    parameters: params.parameters || {}
  };
  
  // 添加可选参数
  if (params.bot_id) {
    requestData.bot_id = params.bot_id;
  }
  
  if (params.ext) {
    requestData.ext = params.ext;
  }
  
  if (params.app_id) {
    requestData.app_id = params.app_id;
  }
  
  // 发起请求
  return request.post(STREAM_RUN_WORKFLOW_URL, requestData, {
    header: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    // 处理响应
    if (response.code === 0) {
      // 请求成功
      return {
        success: true,
        data: response.data,
        debug_url: response.debug_url
      };
    } else {
      // 请求失败
      return Promise.reject({
        success: false,
        code: response.code,
        message: response.msg || '执行工作流（流式响应）失败'
      });
    }
  }).catch(error => {
    // 处理异常
    return Promise.reject({
      success: false,
      message: error.errMsg || '网络请求异常',
      error
    });
  });
};

// 导出函数
export {
  runWorkflow,
  streamRunWorkflow
};

export default runWorkflow;