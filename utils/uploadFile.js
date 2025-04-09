/**
 * uploadFile.js
 * 封装文件上传功能，支持H5和微信小程序环境
 */

import request from './request.js';

// 上传文件API地址
const UPLOAD_URL = 'https://api.coze.cn/v1/files/upload';
// 从request.js中获取的TOKEN常量
const TOKEN = 'pat_RHaWUG7hVWOpH5iVBFuJ3LTm40BL7Bpjy3Qi2y9cwOuZY0KfTIXHyp3pwNBNSqq5';

/**
 * 检测当前运行环境
 * @returns {Object} 包含环境信息的对象
 */
const getEnv = () => {
  // 运行环境
  const platform = uni.getSystemInfoSync().platform;
  // 是否微信小程序
  const isWechat = process.env.VUE_APP_PLATFORM === 'mp-weixin' || uni.getSystemInfoSync().appName === 'WeChat';
  // 是否H5环境
  const isH5 = process.env.VUE_APP_PLATFORM === 'h5' || platform === 'web';
  
  return {
    platform,
    isWechat,
    isH5
  };
};

/**
 * 上传文件到扣子平台
 * @param {File|Object|String} file - 要上传的文件对象或路径
 * @param {Object} options - 额外的配置选项
 * @returns {Promise} - 返回Promise对象，成功时返回文件信息
 */
const uploadFile = (file, options = {}) => {
  const env = getEnv();
  
  return new Promise((resolve, reject) => {
    // 微信小程序环境使用wx.uploadFile
    if (env.isWechat) {
      uni.uploadFile({
        url: UPLOAD_URL,
        filePath: typeof file === 'string' ? file : (file.path || file.tempFilePath),
        name: 'file',
        header: {
          'Authorization': `Bearer ${TOKEN}`
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // 解析返回的JSON数据
            let data;
            try {
              data = JSON.parse(res.data);
            } catch (e) {
              data = res.data;
            }
            
            // 检查返回的状态码
            if (data.code === 0) {
              resolve(data.data);
            } else {
              reject({
                statusCode: res.statusCode,
                errMsg: data.msg || '上传失败',
                data: data
              });
            }
          } else {
            reject({
              statusCode: res.statusCode,
              errMsg: res.errMsg || '上传失败',
              data: res.data
            });
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    } 
    // H5环境使用FormData
    else if (env.isH5) {
      // 创建FormData对象
      const formData = new FormData();
      
      // 处理不同类型的文件参数
      if (typeof file === 'string') {
        // 如果是文件路径，尝试转换为File对象
        const fileName = file.split('/').pop();
        fetch(file)
          .then(response => response.blob())
          .then(blob => {
            const fileObj = new File([blob], fileName);
            formData.append('file', fileObj);
            sendFormRequest(formData);
          })
          .catch(err => reject(err));
      } else {
        // 直接添加File对象
        formData.append('file', file);
        sendFormRequest(formData);
      }
      
      // 发送FormData请求
      function sendFormRequest(formData) {
        uni.request({
          url: UPLOAD_URL,
          method: 'POST',
          header: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'multipart/form-data'
          },
          data: formData,
          success: (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              if (res.data.code === 0) {
                resolve(res.data.data);
              } else {
                reject({
                  statusCode: res.statusCode,
                  errMsg: res.data.msg || '上传失败',
                  data: res.data
                });
              }
            } else {
              reject({
                statusCode: res.statusCode,
                errMsg: res.errMsg || '上传失败',
                data: res.data
              });
            }
          },
          fail: (err) => {
            reject(err);
          }
        });
      }
    }
    // 其他环境
    else {
      // 默认使用uni.uploadFile
      uni.uploadFile({
        url: UPLOAD_URL,
        filePath: typeof file === 'string' ? file : (file.path || file),
        name: 'file',
        header: {
          'Authorization': `Bearer ${TOKEN}`
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // 解析返回的JSON数据
            let data;
            try {
              data = JSON.parse(res.data);
            } catch (e) {
              data = res.data;
            }
            
            // 检查返回的状态码
            if (data.code === 0) {
              resolve(data.data);
            } else {
              reject({
                statusCode: res.statusCode,
                errMsg: data.msg || '上传失败',
                data: data
              });
            }
          } else {
            reject({
              statusCode: res.statusCode,
              errMsg: res.errMsg || '上传失败',
              data: res.data
            });
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    }
  });
};

/**
 * 上传本地图片
 * @param {Object} options - 选择图片的配置
 * @returns {Promise} - 返回Promise对象，成功时返回文件信息
 */
uploadFile.chooseAndUploadImage = (options = {}) => {
  const defaultOptions = {
    count: 1, // 默认选择一张图片
    sizeType: ['original', 'compressed'], // 可选择原图或压缩图
    sourceType: ['album', 'camera'] // 可选择相册或相机
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      ...mergedOptions,
      success: async (res) => {
        try {
          // 如果选择了多张图片，则上传第一张
          const filePath = res.tempFilePaths[0];
          const result = await uploadFile(filePath);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 上传本地文件
 * @param {Object} options - 选择文件的配置
 * @returns {Promise} - 返回Promise对象，成功时返回文件信息
 */
uploadFile.chooseAndUploadFile = (options = {}) => {
  const env = getEnv();
  const defaultOptions = {
    count: 1, // 默认选择一个文件
    type: 'file', // 选择文件类型
    extension: [] // 文件扩展名，默认不限制
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return new Promise((resolve, reject) => {
    // 微信小程序环境
    if (env.isWechat) {
      // 微信小程序使用wx.chooseMessageFile API
      uni.chooseMessageFile({
        ...mergedOptions,
        success: async (res) => {
          try {
            if (res.tempFiles && res.tempFiles.length > 0) {
              // 如果选择了多个文件，则上传第一个
              const fileInfo = res.tempFiles[0];
              const fileName = fileInfo.name || '未命名文件';
              const filePath = fileInfo.path || fileInfo.tempFilePath;
              
              // 上传文件并返回结果
              const result = await uploadFile(filePath);
              // 添加文件名到结果中
              result.fileName = fileName;
              resolve(result);
            } else {
              reject({
                errMsg: '未选择文件'
              });
            }
          } catch (err) {
            reject(err);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    }
    // H5环境
    else if (env.isH5) {
      // 创建文件选择器
      const input = document.createElement('input');
      input.type = 'file';
      
      // 设置文件类型限制
      if (mergedOptions.extension && mergedOptions.extension.length > 0) {
        input.accept = mergedOptions.extension.join(',');
      }
      
      // 文件选择事件
      input.onchange = async (e) => {
        try {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const result = await uploadFile(file);
            // 添加文件名到结果中
            result.fileName = file.name;
            resolve(result);
          } else {
            reject({
              errMsg: '未选择文件'
            });
          }
        } catch (err) {
          reject(err);
        }
      };
      
      // 触发文件选择器
      input.click();
    }
    // 其他环境
    else {
      // 尝试使用uni.chooseFile，如果支持的话
      if (typeof uni.chooseFile === 'function') {
        uni.chooseFile({
          ...mergedOptions,
          success: async (res) => {
            try {
              if (res.tempFiles && res.tempFiles.length > 0) {
                const fileInfo = res.tempFiles[0];
                const fileName = fileInfo.name || '未命名文件';
                const filePath = fileInfo.path || fileInfo.tempFilePath;
                
                const result = await uploadFile(filePath);
                result.fileName = fileName;
                resolve(result);
              } else {
                reject({
                  errMsg: '未选择文件'
                });
              }
            } catch (err) {
              reject(err);
            }
          },
          fail: (err) => {
            reject(err);
          }
        });
      } else {
        // 降级到chooseMessageFile
        uni.chooseMessageFile({
          ...mergedOptions,
          success: async (res) => {
            try {
              if (res.tempFiles && res.tempFiles.length > 0) {
                const fileInfo = res.tempFiles[0];
                const fileName = fileInfo.name || '未命名文件';
                const filePath = fileInfo.path || fileInfo.tempFilePath;
                
                const result = await uploadFile(filePath);
                result.fileName = fileName;
                resolve(result);
              } else {
                reject({
                  errMsg: '未选择文件'
                });
              }
            } catch (err) {
              reject(err);
            }
          },
          fail: (err) => {
            reject(err);
          }
        });
      }
    }
  });
};

export default uploadFile;