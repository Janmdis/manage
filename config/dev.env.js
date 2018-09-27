'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseUrl: '"https://www.qk365.com/qkkx"',  //测试环境
  // baseUrl: '"http://192.168.1.213:8080/qkkx"',  //测试环境
  // baseUrl: '"http://192.168.102.96:8084/qkkx"', //后台电脑环境
  appId:'"1580387213331704"',
  aesKey:'"S9u978Q31NGPGc5H"',
  ivKey:'"X83yESM9iShLxfwS"',
  appKey:'"Sd6qkHm9o4LaVluYRX5pUFyNuiu2a8oi"',
})
