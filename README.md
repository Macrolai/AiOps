# AiOps 产品介绍页

`index.html` 是 AiOps 单文件产品介绍页，CSS、JavaScript 和 SVG 图标全部内联，没有外部字体、图片、接口或构建依赖。

## 直接打开

双击 `index.html`，或使用浏览器打开：

```text
file:///path/to/AiOps/docs/index.html
```

无需启动任何服务器。

## GitHub 代理访问

把文件推送到 GitHub 后，可以使用以下静态 HTML 代理：

### raw.githack

```text
https://raw.githack.com/<owner>/<repo>/<branch>/docs/index.html
```

例如使用 `main` 分支时，把 `<owner>`、`<repo>` 替换为仓库实际地址即可。

### HTMLPreview

```text
https://htmlpreview.github.io/?https://github.com/<owner>/<repo>/blob/<branch>/docs/index.html
```

## GitHub Pages

仓库设置中选择：

```text
Settings → Pages → Deploy from a branch → main / docs
```

启用后可直接访问：

```text
https://<owner>.github.io/<repo>/
```

## 页面内容

- 多云资源同步、私有化 Agent 与统一 CMDB 上下文
- 主机资源、Kubernetes 集群工作区与关联资源
- 主机 / Kubernetes 巡检、问题生命周期、SLA 与报告
- AI 评估、受控动作目录、人工审批与定向验证
- 公司 / 部门 / 项目 / 环境 / Namespace 资源级 RBAC
- 外部 CI/CD Webhook、知识库、办公工具与 AI 协作
- 自托管架构、当前能力边界和持续演进方向

## 交互与验收

- 桌面导航滚动定位与当前章节高亮
- Kubernetes 能力标签页，支持鼠标和方向键切换
- 移动端导航、Esc 关闭和减少动效偏好
- 已检查 1440px、1280px、1024px、768px 与 390px 宽度，无页面级横向溢出
- 页面不加载外部资源，不产生浏览器控制台错误

## 联系方式

产品咨询与部署方案：`macro_lai@163.com`
