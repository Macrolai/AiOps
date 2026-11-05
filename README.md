# NEXOPS 智能运维平台产品页

一个可直接运行的响应式产品首页，围绕以下能力构建：

- 统一 CMDB：多云与私有化接入、资产关系拓扑、变更追踪
- Kubernetes：安装、纳管、扩缩容、升级与运行状态
- 中间件部署：Nginx、Redis、Nacos、MySQL、RocketMQ、Elasticsearch、Kibana
- 智能巡检：主机、K8s 集群与中间件巡检
- 自动处置：异常触发、AI 诊断、策略校验、自动修复与审计

## 运行

直接打开 `index.html` 即可，或启动本地静态服务：

```bash
cd outputs
python3 -m http.server 4173
```

访问 `http://127.0.0.1:4173/`。

## 文件

- `index.html`：页面结构与中文文案
- `styles.css`：视觉系统、驾驶舱、响应式布局与动效
- `app.js`：导航、滚动揭示、CMDB 标签、巡检模拟、自动处置演示与预约表单
- `preview-desktop.png`：桌面端首屏预览
- `preview-mobile.png`：移动端首屏预览

## 已实现交互

- 顶部滚动状态与移动端菜单
- CMDB「统一资产 / 关系拓扑 / 变更追踪」标签切换
- 智能巡检进度模拟
- 自动处置流程播放与完成状态
- 预约演示弹窗、表单校验与提交成功状态
- IntersectionObserver 滚动进入动效
- 响应式布局与 `prefers-reduced-motion` 适配

## 上线前替换

- 品牌名与 Logo 可按需替换为正式品牌
- 页脚及 CTA 中的 `hello@nexops.example` / `support@nexops.example` 为占位邮箱
- 预约表单当前为前端演示，需要接入实际表单 API 或 CRM
- 页面中的资产数量、巡检结果与处置数据均为演示数据
