#!/usr/bin/env node

const fs = require('fs');
const aglob = require('aglob');
const path = require('path');
const mkdirp = require('mkdirp');

let [src, dest] = process.argv.slice(2)

async function exists(src) {
  return new Promise((resolve, reject) =>{
    fs.exists(src, (exists) => {
      resolve(exists)
    })
  })
}

async function mkdir(src) {
  return new Promise((resolve, reject) =>{
    mkdirp(src,(r) => {
      resolve()
    })
  })
}

async function copyFile (src, des) {
  let files = await aglob(src)

  for (const file of files) {
    const srcFilename = path.resolve(file)
    const destFilename = path.join(dest, file.replace('src', ''))

    if(!(await exists(path.dirname(destFilename)))) {
      await mkdir(path.dirname(destFilename))
    }

    await fs.writeFileSync(destFilename, fs.readFileSync(srcFilename))
  }
}

copyFile(src, dest);
