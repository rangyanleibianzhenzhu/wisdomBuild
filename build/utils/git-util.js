/**
 * git 工具
 * 
 * @date 2021/6/18
 */
const execSync = require('child_process').execSync;
const chalk = require('chalk')
const ora = require('ora')
const timeUtil = require('./time-util.js')
/**
 * 构建前的git校验
 */
function gitCheck () {
  // 1. 检测是否有待提交的文件
  let toCommitFiles = execSync('git status -s').toString().trim()
  if (toCommitFiles) {
    console.log(chalk.rgb(255, 255, 255).bgRed.bold(' 本地有代码未提交，不允许打包！ '))
    console.log(chalk.red(toCommitFiles))
    return false
  }
  console.log(chalk.rgb(255, 255, 255).bgGreen.bold(' √ 代码已全部提交 '))

  // 2. 检测是否有提交未推送远端
  let toPushCommits = ''
  try{
    toPushCommits = execSync('git cherry -v').toString().trim()
  } catch (e) {
    let message = e.message
    if (message && message.includes('Could not find a tracked remote branch')) {
      let branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim() // 本地分支名称
      let existRemoteBranch = false // 是否存在同名的远程分支
      try {
        let branchs = execSync('git branch -r').toString().trim() // 获取所有远程分支
        if (new RegExp(`\\borigin\\/${branchName}\\b`).test(branchs)) { // 如果包含与同名的远程分支
          existRemoteBranch = true
        }
      } catch (e) {}

      if (existRemoteBranch) {
        console.log(chalk.rgb(255, 255, 255).bgRed.bold(' 本地分支未关联远程分支 '))
        console.log(chalk.red(`请执行 git branch --set-upstream-to=origin/${existRemoteBranch ? branchName: '[branch-name]'} 关联远程分支`))
      } else {
        console.log(chalk.rgb(255, 255, 255).bgRed.bold(' 本地分支未推送到远程服务器 '))
        console.log(chalk.red(`请执行 git push --set-upstream origin ${branchName} 推送到远程服务器`))
      }
    } else {
      console.log(chalk.rgb(255, 255, 255).bgRed.bold(' 检测本地提交是否已推送远程服务器失败！ '))
      console.log(chalk.red(message))
    }
    return false
  }

  if (toPushCommits) {
    console.log(chalk.rgb(255, 255, 255).bgRed.bold(' 本地有提交未推送远程分支，不允许打包！ 请执行 git push 命令推送本地提交'))
    console.log(chalk.red(toPushCommits))
    return false
  }
  console.log(chalk.rgb(255, 255, 255).bgGreen.bold(' √ 本地提交已推送远程服务器 '))

  // 3. 获取远程更新
  const fetchStartTime = new Date().getTime()
  const spinner = ora('正在执行 git fetch ...').start()
  execSync('git fetch')
  spinner.stop()
  const fetchEndTime = new Date().getTime()
  console.log('git fetch，共耗时：', (fetchEndTime - fetchStartTime), 'ms')

  // 4. 检测远程分支是否有更新未合并本地
  // 远程最后一次提交id
  let remoteCommitId = execSync('git rev-parse @{upstream}').toString().trim()
  // 本地最后一次提交id
  let localCommitId = execSync('git rev-parse HEAD').toString().trim()
  // 如果提交id不符说明有远程更新未合并本地
  if (remoteCommitId !== localCommitId) {
    console.log(chalk.rgb(255, 255, 255).bgRed.bold(' 远程分支有更新未合并本地，不允许打包！ 请执行 git pull 命令合并远程更新'))
    console.log(chalk.red(`远程最后一次commit: ${remoteCommitId}\n本地最后一次commit: ${localCommitId}`))
    return false
  }
  console.log(chalk.rgb(255, 255, 255).bgGreen.bold(' √ 本地分支与远程分支一致 '))
  return true
}

/**
 * 获取git信息
 */
function getGitInfo () {
  let time = timeUtil.formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss')
  let gitUrl = execSync('git config remote.origin.url').toString().trim()
  let project = gitUrl.match(/(?<=\/)[^\/]+(?=\.git)/) ? gitUrl.match(/(?<=\/)[^\/]+(?=\.git)/)[0] : ''
  let branch = execSync('git rev-parse --abbrev-ref @{upstream}').toString().trim()
  let commit = execSync('git rev-parse HEAD').toString().trim()
  let operator = execSync('git config user.name').toString().trim()
  return `time: ${time}\nproject: ${project}\nbranch: ${branch}\ncommit: ${commit}\noperator: ${operator}`
}

module.exports = {
  gitCheck,
  getGitInfo
}
