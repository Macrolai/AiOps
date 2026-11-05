# NEXOPS 产品介绍页

`index.html` 是单文件产品介绍页，CSS、JavaScript、SVG 图标全部内联，没有外部字体、图片、接口或构建依赖。

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

- 多云与私有化 CMDB
- Kubernetes 安装与集群管理
- Nginx、Redis、Nacos、MySQL、RocketMQ、Elasticsearch、Kibana
- CI/CD：Jenkins、GitLab CI、GitHub Actions、通用 Webhook
- 主机、Kubernetes、中间件智能巡检
- 简单问题自动处理
- 平台架构与私有化部署能力
