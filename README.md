## 本仓库是WebStack-Hugo的分支仓库，是作者自用的，添加了作者的导航链接，增加了edgeone自动构建的配置
## 本仓库修改了很多内容 请使用原版仓库
## 一个基于 Hugo 的静态响应式网址导航主题 

本项目是基于**纯静态**的网址导航网站 [webstack.cc](https://github.com/WebStackPage/WebStackPage.github.io) 制作的 [Hugo](https://gohugo.io/) 主题，是一个基于 Hugo 的静态响应式网址导航主题。<br/>

### 主题开源地址

[**GitHub**](https://github.com/shenweiyan/WebStack-Hugo) | [**Gitee**](https://gitee.com/shenweiyan/WebStack-Hugo) | [**GitCode**](https://gitcode.com/shenweiyan/WebStack-Hugo)

### 主题演示地址

<https://webstack-demo.weiyan.cc/>

### 特色功能

这是 Hugo 版 WebStack 主题。可以借助下面的平台直接托管部署，无需服务器。
- [Webify](https://webify.cloudbase.net/) | [Netlify](https://app.netlify.com/) | [Cloudflare Pages](https://pages.cloudflare.com) | [Vercel](https://vercel.com) | [Github Pages](https://pages.github.com/)

总体说一下特点：

- 采用了一直以来最喜欢的 Hugo 部署方式，方便高效。
- 主要的配置信息都集成到了 `config.toml`，一键完成各种自定义的配置。
- 导航的各个信息都集成在 `data/webstack.yml` 文件中，方便后续增删改动。
```
- taxonomy: 科研办公
  icon: fas fa-flask fa-lg
  list:
    - term: 生物信息
      links:
        - title: NCBI
          logo: ncbi.jpg
          url: https://www.ncbi.nlm.nih.gov/
          description: National Center for Biotechnology Information.
        - title: Bioconda
          logo: bioconda.jpg
          url: https://anaconda.org/bioconda/
          description: "Bioconda :: Anaconda.org."
    - term: 云服务器
      links:
        - title: 阿里云
          logo: 阿里云.jpg
          url: https://www.aliyun.com/
          description: 上云就上阿里云。
        - title: 腾讯云
          logo: 腾讯云.jpg
          url: https://cloud.tencent.com/
          description: 产业智变，云启未来。
```
- 做了手机电脑自适应以及夜间模式。
- 增加了搜索功能，以及下拉的热词选项（基于百度 API）。
- 增加了一言、和风天气的 API。

### 使用说明

这是一个开源的公益项目，你可以拿来制作自己的网址导航，也可以做与导航无关的网站。

WebStack 有非常多的魔改版本，这是其中一个。如果你对本主题进行了一些个性化调整，欢迎在本项目留下你的 [分享](https://github.com/shenweiyan/WebStack-Hugo/issues/10)！


### 安装说明

关于 Windows/Linux 下详细的安装与使用说明，请参考文档《WebStack-Hugo | 一个静态响应式导航主题》。

- [链接1](https://weiyan.cc/tech/discussions-10/) | [链接2](https://github.com/shenweiyan/Digital-Garden/discussions/10)

### EdgeOne Pages 自动部署

本分支仓库已适配 EdgeOne Pages，完成一次性配置后，每次向默认分支推送代码都会自动构建并发布。

- 构建命令: `hugo`
- 构建输出目录: `public`
- 可选环境变量: `HUGO_VERSION`（例如 `0.125.0`）、`HUGO_ENV=production`

快速配置步骤：

1. 在 EdgeOne Pages 新建站点并关联本仓库。
2. Framework/框架选择 Hugo，构建命令填写 `hugo`，输出目录填写 `public`。
3. 如需指定 Hugo 版本，添加环境变量 `HUGO_VERSION`；生产环境可设置 `HUGO_ENV=production`。
4. 保存后，每次向仓库默认分支推送都会自动触发构建与部署。
5. 自定义域名：在 EdgeOne Pages 绑定域名后，将 Hugo 配置中的 `baseURL` 设置为你的域名（可在 `config.toml` 或 `exampleSite/config.toml` 中修改）。

提示：若你选择在本地先行构建，也可以将生成的 `public/` 目录直接作为静态资源部署。

