const path = require('path');
const fs = require('fs');
const myFilesDirectoryPath = path.join(__dirname, 'myfiles');
const externalFilesDirectoryPath = path.join(__dirname, 'external');

const readListFiles = () => {
    // return new Promise((resolve, reject) => {
      fs.readdirSync(myFilesDirectoryPath, function (err, files) {
        if (err) {
            console.log('Erro ao ler os arquivos: ' + err);
            // reject(err)
        } 
        let filesNames = ''
        files.forEach(function (file) {
            filesNames = filesNames + file + ','
        });
        // resolve(filesNames)
        return filesNames
      });
    // })
}

const readFile = async (fileName) => {
    // return new Promise((resolve, reject) => {
      fs.readFileSync(myFilesDirectoryPath + '/' + fileName, function (err, file) {
        if (err) {
          // reject(err);
          console.log('Erro ao ler o arquivo: ' + err);
        }
        // resolve(file.toJSON().data);
        // resolve(file);
        return file
      });
    // });
}

const getFileSize = fileName => {
    const stats = fs.statSync(myFilesDirectoryPath + '/' + fileName);
    return  stats.size
}

const writeFile = (fileName, data, ipReceived) => {
  const directory = externalFilesDirectoryPath + '/' + ipReceived + '/' + fileName
  createDirectory(directory)
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
    fs.mkdirSync(directory)
  }
}

export { readListFiles, readFile, getFileSize, writeFile, checkIfFileExists }

