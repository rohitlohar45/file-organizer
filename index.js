#!/usr/bin/env node

let inputArr = process.argv.slice(2); //to get commands given in command prompt
const { dir } = require("console");
let fs = require("fs");

let path = require("path");

let types = {
    media: ["mp4", "mkv"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ["docx", "doc", "pdf", "xlsx", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "ps", "tex"],
    app: ["exe", "dmg", "pkg", "deb"],
    code: ["js", "md"],
};

//console.log(inputArr)
/*
    Example commands
    node index.js tree "directoryPath"
    node index.js oraganize "directoryPath"
    node index.js help 
 */

let command = inputArr[0];

switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please Input right Command");
        break;
}

function treeFn(dirPath) {
    if (dirPath == undefined) {
        treeHelper(process.cwd(),"");
        return;
    } else {
        let doesExsits = fs.existsSync(dirPath);
        if (doesExsits) {
            treeHelper(dirPath, "");
        } else {
            console.log("Enter correct path");
            return;
        }
    }
}

function treeHelper(dirPath, indent) {
    // is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();

    if (isFile) {
        let fileName = path.basename(dirPath);
        console.log(indent + "|---" + fileName);
    } else {
        let dirName = path.basename(dirPath);
        console.log(indent + "|---" + dirName);
        let childrens = fs.readdirSync(dirPath);

        for (let i = 0; i < childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }
}

function organizeFn(dirPath) {
    //console.log("Organize command implemented",dirPath);
    /**
     * Pseudo Code
     * 1. Input -> directory path given
     * 2. create -> organized_files -> directory
     * 3. Identify categories of all the files present in that input directory
     * 4. copy/cut files to that organized directory of any of categoryu folder
     */
    let destPath;
    if (dirPath == undefined) {
        destPath = process.cwd();
        return;
    } else {
        let doesExsits = fs.existsSync(dirPath);
        if (doesExsits) {
            //2. create -> organized_files -> directory
            destPath = path.join(dirPath, "organized_files");

            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
        } else {
            console.log("Enter correct path");
            return;
        }
    }
    organizeHelper(dirPath, destPath);
}

function organizeHelper(src, dest) {
    let childNames = fs.readdirSync(src);

    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        //console.log(childAddress);
        let isFile = fs.lstatSync(childAddress).isFile();

        if (isFile) {
            //console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            //4. copy/cut files to that organized directory of any of categoryu folder
            //console.log(dest);
            sendFiles(childAddress, dest, category);
        }
    }
}

function getCategory(name) {
    let ext = path.extname(name);
    //console.log(ext);
    ext = ext.slice(1);

    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                //console.log(ext);
                return type;
            }
        }
    }
    return "others";
}

function sendFiles(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    //console.log(dest + " " + category + " " + categoryPath);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    //console.log(srcFilePath);
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    //console.log(fileName + " "  + destFilePath);
    fs.copyFileSync(srcFilePath, destFilePath);
    fs.unlinkSync(srcFilePath);
}

function helpFn() {
    console.log(
        `
        List of All the commands:
            node index.js tree "directoryPath"
            node index.js oraganize "directoryPath"
            node index.js help 
        `
    );
}
