const path = require('path');
const fs = require('fs');
const myFilesDirectoryPath = path.join(__dirname, 'myfiles');
const externalFilesDirectoryPath = path.join(__dirname, 'external');

const readListFiles = () => {
    return new Promise((resolve, reject) => {
      fs.readdir(myFilesDirectoryPath, function (err, files) {
        if (err) {
            console.log('Erro ao ler os arquivos: ' + err);
            reject(err)
        } 
        let filesNames = ''
        files.forEach(function (file) {
            filesNames = filesNames + file + ','
        });
        resolve(filesNames)
      });
    })
}

const readFile = async (fileName) => {
    return new Promise((resolve, reject) => {
      fs.readFile(myFilesDirectoryPath + '/' + fileName, function (err, file) {
        if (err) {
          reject(err);
        }
        // resolve(file.toJSON().data);
        resolve(file);
      });
    });
}

const getFileSize = fileName => {
    const stats = fs.statSync(myFilesDirectoryPath + '/' + fileName);
    return  stats.size
}

const getMethod = (message) => {
    return message.split(';')[0]
}

const getFileName = (message, number = 1) => {
  return message.split(';')[number];
}

const getListFiles = (message) => {
  return message.split(';')[1]
}

const getDataFromFile = (message) => {
  return message.split(';')[3]
}

const writeFile = (fileName, data) => {
  fs.writeFile(externalFilesDirectoryPath + '/' + fileName, data, function (err) {
    if (err) throw err;
    console.log('Arquivo salvo!');
  });
}

const checkIfFileExists = (fileName) => {
  return fs.existsSync(externalFilesDirectoryPath + '/' + fileName)
}

export { readListFiles, getMethod, getFileName, readFile, getFileSize, getListFiles, getDataFromFile, 
  writeFile, checkIfFileExists }

