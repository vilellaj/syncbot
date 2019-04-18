const axios = require('axios');
const fs = require('fs');
const AdmZip = require('adm-zip');
const del = require('del');
const execSync = require('child_process').execSync;


const backup = async (appPath, targetZip) => {
    return new Promise((resolve, reject) => {
        resolve();
    })
}

const downloadZip = async (url, dest, token) => {
    const writer = fs.createWriteStream(dest);

    const res = await axios({
        url,
        method: 'GET',
        headers: { Authorization: `token ${token}`},
        responseType: 'stream'
    });

    res.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    });
}

const stepsBefore = async (steps) => {
    steps.forEach((step) => {
        if (step.type == 'command') {
            execSync(step.cmd);
        }
    });
}

/**
 * Update app
 * @param {*} appConfig 
 * @param {*} zipPath 
 */
const update = async (appConfig, zipPath) => {
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    const ignoreFiles = appConfig.ignoreFiles;
    const appPath = appConfig.path;

    const ignoreGlobs = ignoreFiles.map((x) => {
        return `${appPath}/${x}`;
    });

    if (!appConfig.overwrite) {
        await del([`${appPath}/*.**`, ...ignoreGlobs], { force: true });
    }

    zipEntries.forEach((zipEntry) => {
        // The file can be extracted
        if (ignoreFiles.indexOf(zipEntry.entryName) == -1) {
            zip.extractEntryTo(zipEntry.entryName, appPath, false, appConfig.overwrite);
        }
    });

    console.log('Updating...');
}

const rollback = async (appPath, backupPath) => {
    await del([`${appPath}/*.**`], { force: true });
    const zip = new AdmZip(backupPath);
    zip.extractAllTo(appPath, false);
};

const stepsAfter = async (steps) => {
    steps.forEach((step) => {
        if (step.type == 'command') {
            execSync(step.cmd);
        }
    });
}

module.exports = {
    backup,
    downloadZip,
    update,
    stepsBefore,
    stepsAfter,
    rollback
}