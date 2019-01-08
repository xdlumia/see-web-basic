#!/usr/bin/env node

const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const packageJSON = require(path.resolve('package.json'));
const spawn = require('./spawn')

const [betaFlag] = process.argv.slice(2)

var isRelease = betaFlag !== 'beta'
var currentVersion = packageJSON.version
var versionReg = /^(\d+)\.(\d+)\.(\d+)(?:-beta(\d*))?$/
var versions;
var newVersion;

if (!(versions = currentVersion.match(versionReg))) {
  throw new Error("the version in package.json must like 1.1.1 or 1.1.1-beta1");
}

var isCurrentBeta = versions[4] !== undefined;
if (!isCurrentBeta) {
  versions[3]++
}

if (isRelease) {
  // beta 版本去掉标记，否则版本号+1
  newVersion = versions.slice(1, 4).join('.')
} else {
  versions[4] = parseInt(versions[4] || 0) + 1
  newVersion = versions.slice(1, 4).join('.') + '-beta' + versions[4]
}

async function publish() {
  if (isRelease) {
    await spawn('sh', [__dirname + '/sh/pre-release.sh'])
  }

  var confirm = readlineSync.question(`Current version is "${currentVersion}", Releasing will be "${newVersion}".\n\
   -- are you sure? (y/n${isRelease ? '/u' : ''})`)


  if (confirm) {y
    // 可以选择升级版本
    if (confirm.toLowerCase() === 'u' || confirm.toLowerCase() === 'uu') {
      if (confirm.toLowerCase() === 'u') {
        versions[2]++
      } else {
        versions[1]++
        versions[2] = 0
      }

      versions[3] = 0;
      newVersion = versions.slice(1, 4).join('.')

      confirm = readlineSync.question(`Current version is "${currentVersion}", Releasing will be upgrade to "${newVersion}".\n\
   -- are you sure? (y/n)`)
    }

    if (confirm.toLowerCase() === 'y') {
      packageJSON.version = newVersion;

      fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2), async function (err) {
        if (err) {
          throw err
        }

        console.log(`version in package.json changed to ${newVersion}`)
        await spawn('sh', [__dirname + '/sh/release.sh', newVersion, isRelease])
      });
    }
  }
}

publish()
