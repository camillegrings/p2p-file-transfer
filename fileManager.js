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
          console.log('Erro ao ler o arquivo: ' + err);
        }
        resolve(file)
      });
    });
}

const getFileSize = fileName => {
    const stats = fs.statSync(myFilesDirectoryPath + '/' + fileName);
    return  stats.size
}

const writeFile = async (fileName, data, ipReceived) => {
  const directory = externalFilesDirectoryPath + '/' + ipReceived + '/' + fileName
  console.log(directory)
  await createDirectory(directory)
  fs.writeFile(directory, data, function (err) {
    if (err) throw err;
    console.log('Arquivo salvo!');
  });
}

const checkIfFileExists = (fileName, ipReceived) => {
  return fs.existsSync(externalFilesDirectoryPath + '/' + ipReceived + '/' + fileName)
}

const createDirectory = (directory) => {
  if(!fs.existsSync(directory)) {
    return new Promise((resolve, reject) => {
      fs.mkdir(directory, function (err, file) {
        if(err && err.code !== 'EEXIST') 
          reject(err) 
        
        resolve()
      })
    })
  }
}

export { readListFiles, readFile, getFileSize, writeFile, checkIfFileExists }

