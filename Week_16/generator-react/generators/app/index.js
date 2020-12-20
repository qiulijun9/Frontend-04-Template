const Generator = require('yeoman-generator')
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  method1() {
    this.log('method 1 just ran')
  }

  async initPackages() {
    // 获取用户的设置
    const answer = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname,
      },
      {
        type: 'input',
        name: 'version',
        message: 'Your project version',
        default: '1.0.0',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your project description',
      },
    ])

    const pkgJson = {
      name: answer.name,
      version: answer.version,
      description: answer.description,
      main: 'generators/app/index.js',
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
      },
      author: '',
      license: 'ISC',
      devDependencies: {},
      dependencies: {
        react: '^17.0.1',
        'react-dom': '^17.0.1',
        'react-scripts': '4.0.1',
      },
    }
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)

    this.yarnInstall(['react', 'react-dom', 'react-scripts'], {
      'save-dev': false,
    })

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
    )

    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath('src/index.js'),
    )

    this.fs.copyTpl(
      this.templatePath('App.js'),
      this.destinationPath('src/App.js'),
    )
    this.fs.copyTpl(
      this.templatePath('App.css'),
      this.destinationPath('src/App.css'),
    )
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
    )
  }
}
