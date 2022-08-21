export default {
  // 图片上传配置
  imageUpload: {
    uploadApiUrl: 'api/richTextEditor/upload/image', // 上传接口地址
    fieldName: 'file', // 图片文件字段名
    maxSize: 10, // 文件大小上限（单位：M）
    base64MaxSize: 0, // 小图片转base64的上限（单位：K），为0时表示不转换base64
    /* eslint-disable no-undef */
    urlBasePath: APP_INDEX_PATH + 'resources/image/' // 图片url基本路径（不含图片名称）
  }
}
