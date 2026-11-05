# kubeadm-ha 集成

接入项目：[TimeBye/kubeadm-ha](https://github.com/TimeBye/kubeadm-ha)

## 设计

kubeadm-ha 使用独立生命周期模块，不复用通用操作单：

```text
容器集群
  ↓
集群配置 + 节点清单
  ↓
生成 inventory.ini / variables.yaml
  ↓
异步执行 ansible-playbook
  ↓
任务状态 + 输出日志 + 审计
```

后端按分支缓存仓库：

```yaml
kubeadm:
  enabled: true
  repo_url: "https://github.com/TimeBye/kubeadm-ha.git"
  repo_root: "../data/kubeadm-ha"
  work_root: "../data/kubeadm-runs"
  default_ref: "release-1.33"
  ansible_bin: "ansible-playbook"
  git_bin: "git"
  timeout_minutes: 60
  output_limit_bytes: 1048576
```

## 前置依赖

运行后端的 Linux 主机需要：

- `git`
- `ansible-playbook >= 2.8`
- `sshpass`
- `python3-netaddr`
- 到目标节点的 SSH root 权限

可使用 kubeadm-ha 自带安装脚本：

```bash
sudo /path/to/kubeadm-ha/ansible/install.sh
```

也可以由企业镜像源自行安装。当前系统会在生命周期页面明确显示 Ansible 是否可用。

## 支持的动作

安装与更新：

- 安装集群：`90-init-cluster.yml`
- 更新配置：`90-init-cluster.yml`

扩容：

- 扩容 Worker：`81-add-worker.yml`
- 扩容 Master：`82-add-master.yml`
- 扩容 Etcd：`83-add-etcd.yml`

缩容/删除：

- 移除 Worker 角色：`84-remove-worker.yml`
- 移除 Master 角色：`85-remove-master.yml`
- 移除 Etcd 角色：`86-remove-etcd.yml`
- 删除节点：`87-remove-node.yml`

升级与证书：

- 升级 Kubernetes：`91-upgrade-cluster.yml`
- 轮换证书：`92-certificates-renew.yml`

备份恢复：

- 备份集群：`93-backup-cluster.yml`
- 恢复集群：`94-restore-cluster.yml`
- 重置集群：`99-reset-cluster.yml`

分步安装：

- 内核升级：`00-kernel.yml`
- 基础环境：`01-base.yml`
- 容器运行时：`02-container-engine.yml`
- Kubernetes 组件：`03-kubernetes-component.yml`
- 时间同步：`04-chrony.yml`
- 负载均衡：`05-load-balancer.yml`
- Etcd：`06-etcd.yml`
- 证书：`07-kubernetes-certificates.yml`
- Master：`08-kubernetes-master.yml`
- Worker：`09-kubernetes-worker.yml`
- 节点标记：`10-post.yml`
- 网络插件：`21-network-plugin.yml`
- Ingress：`22-ingress-controller.yml`
- Metrics Server：`23-metrics-server.yml`

运行时切换：

- Docker 切换为 containerd：`31-docker-to-containerd.yml`

## inventory 生成规则

节点角色：

- `master` → `[kube-master]`
- `worker` → `[kube-worker]`
- `etcd` → `[etcd]`
- `lb` → `[lb]`

待扩容节点：

- `state=new`
- Worker → `[new-worker]`
- Master → `[new-master]`
- Etcd → `[new-etcd]`

删除角色时，所选节点会进入对应的 `[del-worker]`、`[del-master]`、`[del-etcd]`、`[del-node]` 组。

## 凭据与风险

- SSH 密码使用 AES-256-GCM 加密存储。
- inventory 和 variables 写入权限为 `0600` 的临时任务目录。
- UI 不返回 SSH 密码。
- 高危和极高危动作会显示风险提示。
- 备份默认生成到仓库目录下的 `cluster-backup`，恢复动作会从同一目录读取。
- 升级、恢复、重置前应先执行备份。
