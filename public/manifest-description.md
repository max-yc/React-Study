# Chrome 扩展 Manifest.json 配置说明文档

## 基础配置（必需）

### manifest_version

- 类型：`number`
- 必需：是
- 说明：清单文件的版本号，目前必须为 3
- 示例：`"manifest_version": 3`

### name

- 类型：`string`
- 必需：是
- 说明：扩展的名称，将显示在 Chrome 扩展管理页面和商店中
- 示例：

```json
"name": "我的扩展"
```

### version

- 类型：`string`
- 必需：是
- 说明：扩展的版本号，格式为 x.x.x
- 示例：

```json
"version": "1.0"
```

### description

- 类型：`string`
- 必需：否
- 说明：扩展的详细描述，显示在商店和扩展管理页面
- 示例：

```json
"description": "这是一个示例扩展"
```

## 图标配置

### icons

- 类型：`object`
- 必需：否
- 说明：定义扩展在不同场景下使用的图标
- 属性：
  - 16：工具栏图标
  - 32：Windows 通知图标
  - 48：扩展管理页面图标
  - 128：Chrome 网上应用店图标
- 示例：
  ```json
  "icons": {
    "16": "images/plugins.png",
    "32": "images/plugins.png",
    "48": "images/plugins.png",
    "128": "images/plugins.png"
  }
  ```

## 权限与安全配置

### permissions

- 类型：`array`
- 必需：否
- 说明：声明扩展需要的权限列表
- 常用权限：
  - `storage`: 使用存储 API
  - `tabs`: 访问标签页
  - `activeTab`: 访问当前活动标签页
  - `notifications`: 发送通知
  - `contextMenus`: 添加右键菜单
- 示例：

```json
"permissions": [
  "storage",
  "tabs",
  "notifications"
]
```

### host_permissions

- 类型：`array`
- 必需：否
- 说明：声明扩展需要访问的网址匹配模式
- 示例：

```json
"host_permissions": [
  "http://*/*",
  "https://*/*"
]
```

## 功能性配置

### action

- 类型：`object`
- 必需：否
- 说明：配置扩展的工具栏图标行为
- 示例：

```json
"action": {
  "default_icon": {
    "16": "images/icon16.png",
    "32": "images/icon32.png"
  },
  "default_title": "点击打开扩展",
  "default_popup": "popup.html"
}
```

### background

- 类型：`object`
- 必需：否
- 说明：配置扩展的后台脚本
- 示例：

```json
"background": {
  "service_worker": "background.js",
  "type": "module"
}
```

### content_scripts

- 类型：`array`
- 必需：否
- 说明：配置需要注入到网页中的脚本
- 示例：

```json
"content_scripts": [{
  "matches": ["http://*/*", "https://*/*"],
  "js": ["content.js"],
  "css": ["styles.css"],
  "run_at": "document_end"
}]
```

### web_accessible_resources

- 类型：`array`
- 必需：否
- 说明：声明可以被网页访问的扩展资源
- 示例：

```json
"web_accessible_resources": [{
  "resources": ["images/*"],
  "matches": ["<all_urls>"]
}]
```

### chrome_url_overrides

- 类型：`object`
- 必需：否
- 说明：用自定义页面替换 Chrome 默认页面
- 示例：

```json
"chrome_url_overrides": {
  "newtab": "newtab.html"
}
```

### options_page

- 类型：`string`
- 必需：否
- 说明：扩展的选项页面
- 示例：

```json
"options_page": "options.html"
```

### default_locale

- 类型：`string`
- 必需：否（如果有 \_locales 目录则必需）
- 说明：扩展的默认语言
- 示例：

```json
"default_locale": "zh_CN"
```

## 其他配置

### minimum_chrome_version

- 类型：`string`
- 必需：否
- 说明：扩展支持的最低 Chrome 版本
- 示例：

```json
"minimum_chrome_version": "88"
```

### offline_enabled

- 类型：`boolean`
- 必需：否
- 说明：扩展是否支持离线使用
- 示例：

```json
"offline_enabled": true
```

### incognito

- 类型：`string`
- 必需：否
- 说明：扩展在隐身模式下的行为
- 可选值：
  - `spanning`: 在普通和隐身模式下共享实例（默认）
  - `split`: 在隐身模式下创建独立实例
  - `not_allowed`: 在隐身模式下禁用
- 示例：

```json
"incognito": "spanning"
```
