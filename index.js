module.exports = class ReactReporter {
  constructor(options) {
    console.log(111)
    console.log(options)
  }

  report(clones, statistic) {
    console.log(222)
    console.log(clones)
    console.log(statistic)
  }
}
