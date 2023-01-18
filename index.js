const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { deflateRaw } = require('pako')
const { name, version } = require('./package')

const deflateData = data => {
  return deflateRaw(JSON.stringify(data || {}).toString())
}

const getFileContent = fileName => {
  return readFileSync(resolve(__dirname, fileName)).toString()
}

class ReactReporter {
  constructor(options) {
    this.options = options
  }

  report(clones, statistic) {
    const { output = 'JscpdReporter.html' } = this.options
    const cwd = process.cwd()
    const StatsData = { statistic, clones }

    writeFileSync(
      resolve(cwd, output),
      getFileContent('./index.html')
        .replace('dist/index.css', `https://unpkg.com/${name}@${version}/dist/index.css`)
        .replace('dist/index.js', `https://unpkg.com/${name}@${version}/dist/index.js`)
        .replace('<script src="docs/StatsData.js">', `<script>window.StatsData = '${deflateData(outputs)}'`)
    )
  }
}

module.exports = {
  default: ReactReporter
}
