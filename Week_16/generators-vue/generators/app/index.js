const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  async initPackages() {
    // 用户交互
    const answer = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your Project name',
        default: this.appname,
      },
    ])
    const pkgJson = {
      name: answer.name,
      version: '1.0.0',
      description: '',
      main: '.src/main.js',
      scripts: {
        build: 'webpack',
        dev: 'webpack-dev-server --open',
        test: 'echo "Error: no test specified" && exit 1',
      },
      devDependencies: {
        webpack: '^4.35.2',
        'webpack-cli': '^3.3.6',
        'webpack-dev-server': '^3.7.2',
      },
    }
    // 使用提供的部分对象参数，来扩展现有的的JSON 文件
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)

    //安装依赖
    this.yarnInstall(['vue'], { 'save-dev': false })
    this.yarnInstall(
      [
        'babel-loader',
        'style-loader',
        'css-loader',
        'vue-loader',
        '@babel/core',
        '@babel/preset-env',
        'vue-template-compiler',
        'html-webpack-plugin',
        'clean-webpack-plugin',
        'webpack',
      ],
      {
        'save-dev': true,
      },
    )

    // copy 模板
    this.fs.copyTpl(
      this.templatePath('Hello.vue'),
      this.destinationPath('src/Hello.vue'),
    )
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
    )
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
    )
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
    )
  }
}
