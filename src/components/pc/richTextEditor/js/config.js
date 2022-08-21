// 插件
const plugins = ['advlist anchor autolink autosave code codesample directionality fullscreen hr image imagetools ' +
'insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker ' +
'tabfocus table template textpattern visualblocks visualchars wordcount emoticons']
// 未添加的插件: autoresize bbcode charmap fullpage help legacyoutput quickbars
// 内置到核心编辑器中不需要配置的插件： textcolor colorpicker contextmenu

// 工具
const toolbar =
  '| fullscreen' + // 全屏
  '| bold italic underline strikethrough ' + // 粗体、斜体、下划线、删除线
  '| fontsizeselect' + // 字号
  '| formatselect ' + // 基块（格式选择，可选择 h1 - h6、p、pre 元素）
  '| lineheight ' + // 行高
  '| alignleft aligncenter alignright ' + // 左对齐、中间对齐、右对齐
  '| outdent indent ' + // 减少缩进、增加缩进
  '| numlist bullist ' + // 编号列表、项目符号
  '| forecolor backcolor permanentpen removeformat ' + // 字体颜色、背景色、清除格式
  '| subscript superscript blockquote hr insertdatetime emoticons' + // 下标、上标、引文区块、水平分割线、插入日期/时间、表情
  '| table link codesample image media' + // 插入表格、插入/编辑链接、插入编辑代码、插入图片、插入视频
  '| searchreplace code' + // 查找和替换、、源代码
  '| undo redo ' // 撤销、重做

/* 未生效工具：
  checklist 清单(多选列表)
  casechange 大小写转换
  permanentpen 记号笔
  formatpainter 格式刷
  charmap 特殊字符
  insertfile 附件（依赖 tinydrive 插件，而此插件只有注册 Tiny Cloud 的用户可用）
  pageembed 页面嵌入
  a11ycheck 检查访问性
 */
/* 未使用工具：
  preview 预览
  fontselect 字体
  alignjustify 两端对齐
  save 保存
  print 打印
  pagebreak 分页符
  emoticons 表情
  template 插入模板
  anchor 锚点
  ltr 左到右
  rtl 从右到左
  newdocument 新文档
 */

export default {
  plugins,
  toolbar,
  // 图片上传配置
  imageUpload: {
    uploadApiUrl: 'api/richTextEditor/upload/image', // 上传接口地址
    fieldName: 'file', // 图片文件字段名
    maxSize: 10, // 文件大小上限（单位：M）
    /* eslint-disable no-undef */
    urlBasePath: APP_INDEX_PATH + 'resources/image/' // 图片url基本路径（不含图片名称）
  },
  // 媒体文件上传配置（即视频文件）
  mediaUpload: {
    uploadApiUrl: 'api/richTextEditor/upload/media', // 上传接口地址
    fieldName: 'file', // 图片文件字段名
    maxSize: 30, // 文件大小上限（单位：M）
    /* eslint-disable no-undef */
    urlBasePath: APP_INDEX_PATH + 'resources/media/', // 媒体文件url基本路径（不含图片名称）
    resource2: '', // 替代来源网址
    poster: APP_INDEX_PATH + 'static/img/media.png' // 封面图片地址
  },
  // 文件上传配置（即超链接文件）
  fileUpload: {
    uploadApiUrl: 'api/richTextEditor/upload/file', // 上传接口地址
    fieldName: 'file', // 图片文件字段名
    maxSize: 10, // 文件大小上限（单位：M）
    /* eslint-disable no-undef */
    urlBasePath: APP_INDEX_PATH + 'resources/file/'// 文件url基本路径（不含图片名称）
  }
}
