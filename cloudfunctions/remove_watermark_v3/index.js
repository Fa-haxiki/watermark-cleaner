// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const _ = require('lodash')
const qs = require('qs')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  const { link_url } = event
  const link = _parseUrl(link_url)
  console.log('link', link)
  const isXhsLink = link.includes('xhslink.com');
  const options1 = {
    method: 'GET',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    params: { url: link },
    url: "https://tenapi.cn/video/",
    timeout: 10000,
  }
  const options2 = {
    ...options1,
    params: {
      uid: "1661769090",
      my: "bcfgjklnvxzEFMNW15",
      url: link,
    },
    url: 'https://api.ciyer.com/api/dsp/',
  };
  let options;
  if (isXhsLink) {
    options = options2;
  } else {
    options = options1;
  }
  const result = await axios(options)
  console.log("result", result)
  if (isXhsLink) {
    return {
      code: 200,
      url: result.data.data.url,
      music: result.data.data.mp3,
      title: result.data.data.title,
      cover: result.data.data.cover,
    };
  } else {
    return {
      code: result.data.code,
      url: result.data.url,
      title: result.data.title,
      cover: result.data.cover,
      music: result.data.music,
      content_type: "VIDEO",
    }
  }
}

/**
 * 解析 url
 * @param {*} text
 */
function _parseUrl(text) {
  const reg = /(https?|http):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
  let startIndex = text.lastIndexOf('http://')
  startIndex = startIndex === -1 ? text.lastIndexOf('https://') : startIndex
  if (startIndex === -1) {
    // console.log('请输入正确的视频链接')
    return
  }
  const result = text.match(reg)
  if (result.length) {
    return result[0]
  }
  return
}
