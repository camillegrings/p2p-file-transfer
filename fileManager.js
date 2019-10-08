const path = require('path');
const fs = require('fs');
const myFilesDirectoryPath = path.join(__dirname, 'myfiles');
const externalFilesDirectoryPath = path.join(__dirname, 'external');

const readListFiles = () => {
    // return new Promise((resolve, reject) => {
    //   fs.readdir(myFilesDirectoryPath, function (err, files) {
    //     if (err) {
    //         console.log('Erro ao ler os arquivos: ' + err);
    //         reject(err)
    //     } 
    //     let filesNames = ''
    //     files.forEach(function (file) {
    //         filesNames = filesNames + file + ','
    //     });
    //     resolve(filesNames)
    //   });
    // })
    const files = fs.readdirSync(myFilesDirectoryPath)
    let filesNames = ''
    files.forEach(function (file) {
        filesNames = filesNames + file + ','
    });
    return filesNames
}

const readListFilesFromIp = (ipReceived) => {
  // return new Promise((resolve, reject) => {
  //   fs.readdir(externalFilesDirectoryPath + '/' + ipReceived, function (err, files) {
  //     if (err) {
  //         console.log('Erro ao ler os arquivos: ' + err);
  //         reject(err)
  //     } 
  //     resolve(files)
  //   });
  // })
  return fs.readdirSync(externalFilesDirectoryPath + '/' + ipReceived)
}


const readFile = async (fileName) => {
    // return new Promise((resolve, reject) => {
    //   fs.readFile(myFilesDirectoryPath + '/' + fileName, function (err, file) {
    //     if (err) {
    //       reject(err);
    //       console.log('Erro ao ler o arquivo: ' + err);
    //     }
    //     resolve(file)
    //   });
    // });
    return fs.readFileSync(myFilesDirectoryPath + '/' + fileName)
}

const getFileSize = fileName => {
    const stats = fs.statSync(myFilesDirectoryPath + '/' + fileName);
    return  stats.size
}

const writeFile = async (fileName, data, ipReceived) => {
  const directory = externalFilesDirectoryPath + '/' + ipReceived
  await createDirectory(directory)
  fs.writeFile(directory + '/' + fileName, data, function (err) {
    if (err) console.log('Erro ao escrever o arquivo: ' + err)
    console.log('Arquivo salvo!');
  });
}

const checkIfFileExists = (fileName, ipReceived) => {
  return fs.existsSync(externalFilesDirectoryPath + '/' + ipReceived + '/' + fileName)
}

const checkIfDirectoryExists = (ipReceived) => {
  return fs.existsSync(externalFilesDirectoryPath + '/' + ipReceived)
}

const createDirectory = (directory) => {
  if(!fs.existsSync(directory)) {
    // return new Promise((resolve, reject) => {
    //   fs.mkdir(directory, function (err) {
    //     if(err && err.code !== 'EXIST') 
    //       reject(err) 
    //     resolve()
    //   })
    // })
    return fs.mkdirSync(directory)
  }
}

const removeFile = (fileName, ipReceived) => {
  const directory = externalFilesDirectoryPath + '/' + ipReceived + '/' + fileName
  // return new Promise((resolve, reject) => {
  //   fs.unlink(directory, (err) => {
  //     if (err) {
  //       console.error('Ocorreu um erro ao deletar o arquivo:', err)
  //       reject(err)
  //     }
  //     resolve()
  //   })
  // })
  return fs.unlink(directory)
}

export { readListFiles, readFile, getFileSize, writeFile, checkIfFileExists, readListFilesFromIp, 
  removeFile, checkIfDirectoryExists }

