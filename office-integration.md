# 办公工具接入

办公平台中的资源助手与 Web 控制台共用 `internal/ai.Service`，回答来自同一份 CMDB、最新指标、巡检结果和知识库。

## 配置

```yaml
office:
  enabled: true
  command_token: "replace-with-a-random-token"
  request_timeout_seconds: 20
  reply_timeout_seconds: 90
  dingtalk:
    enabled: true
    callback_token: "replace-with-a-random-token"
  feishu:
    enabled: true
    app_id: "cli_xxx"
    app_secret: "***"
    verification_token: "***"
    encrypt_key: ""
  wecom:
    enabled: true
    corp_id: "ww_xxx"
    agent_id: 1000002
    secret: "***"
    token: "***"
    encoding_aes_key: "43-character-key"
```

`server.public_url` 必须配置成办公平台能访问的地址。

## 钉钉

1. 在钉钉开放平台创建企业内部机器人。
2. 开启机器人消息接收。
3. 回调 URL：

```text
https://your-domain/api/v1/integrations/dingtalk?token=<office.dingtalk.callback_token>
```

4. 用户 @机器人 提问。
5. 平台从回调中提取 `text.content`，调用 AI Agent，并通过 `sessionWebhook` 异步回复。

`sessionWebhook` 只允许 `https://oapi.dingtalk.com` 域名，防止回调内容诱导服务端请求任意地址。

## 飞书

1. 创建企业自建应用。
2. 开启机器人能力。
3. 添加接收消息、发送消息相关权限。
4. 事件订阅 URL：

```text
https://your-domain/api/v1/integrations/feishu
```

5. 订阅 `im.message.receive_v1`。
6. 配置 `verification_token`。

如果开启事件加密，填写 `encrypt_key`。平台支持：

- `X-Lark-Signature` 校验
- AES-256-CBC 事件解密
- 使用 tenant access token 调用消息发送 API

## 企业微信

1. 创建企业应用。
2. 配置接收消息服务器。
3. URL：

```text
https://your-domain/api/v1/integrations/wecom
```

4. 填写 `Token` 和 `EncodingAESKey`，分别对应配置中的 `token`、`encoding_aes_key`。
5. 平台会：
   - 校验 SHA-1 签名
   - AES-CBC 解密回调
   - 校验 CorpID
   - 通过应用消息接口主动回复

## 通用 HTTP 查询

适合低代码流程、自建机器人、统一办公自动化：

```bash
curl https://your-domain/api/v1/integrations/query \
  -H 'X-Integration-Token: <office.command_token>' \
  -H 'Content-Type: application/json' \
  -d '{"message":"当前有哪些严重告警？","channel":"custom","user":"ops-user"}'
```

返回：

```json
{
  "reply": "最近一次巡检...",
  "suggestions": ["..."],
  "sources": ["内部知识库"],
  "model": "deepseek-v4.1-flash",
  "fallback": false
}
```

## 受控操作注意事项

办公工具可以生成操作单，但变更操作仍需在 Web 控制台“操作中心”人工审批。办公渠道不会绕过审批直接执行主机命令。

## 安全建议

- 所有回调必须走 HTTPS。
- `callback_token`、`command_token`、`app_secret`、`encoding_aes_key` 不要提交到 Git。
- 生产环境用环境变量覆盖敏感字段。
- 办公平台用户权限与 CMDB 数据权限的映射尚未实现；当前所有被允许触发机器人的用户都能查询平台纳管资源。
- 后续建议增加用户绑定、资源范围权限和危险问题拦截。
