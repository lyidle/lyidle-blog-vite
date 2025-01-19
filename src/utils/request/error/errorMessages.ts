const errorMessages: Record<string, string> = {
  ERR_NETWORK: "网络出现问题,请检查您的网络连接~",
  ECONNABORTED: "请求超时，请稍后重试~",
  ENOTFOUND: "服务器地址未找到，请检查域名是否正确~",
  ECONNREFUSED: "服务器拒绝了连接，请检查服务是否正常运行~",
  EHOSTUNREACH: "服务器不可达，请检查网络配置~",
  ECONNRESET: "连接被重置，请稍后再试~",
  ETIMEDOUT: "请求超时，服务器响应过慢~",
  ERR_BAD_REQUEST: "客户端请求无效，请检查参数~",
  ERR_BAD_RESPONSE: "服务器响应无效，请联系技术支持~",
  ERR_CANCELED: "请求已被取消~",
  ERR_FR_MAX_BODY_LENGTH_EXCEEDED: "请求数据超出限制，请检查请求内容~",
  ERR_FR_MAX_HEADERS_COUNT_EXCEEDED: "请求头数量超出限制，请优化请求头~",
}

export default errorMessages
