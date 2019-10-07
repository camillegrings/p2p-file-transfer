import { readListFiles, readFile, getFileSize, writeFile, 
    checkIfFileExists, readListFilesFromIp, removeFile, checkIfDirectoryExists } from './fileManager'
import { getFileName, getListFiles, getDataFromFile } from './utils'
import { sendMessage } from './index'

const chooseMethod = (method, remote, message) => {
    switch (method) {
      case 'PTA':
        sendListOfFiles(remote.address)
        break;
      case 'PAE':
        const fileName = getFileName(message.toString())
        sendFile(fileName, remote.address)
        break;
      case 'ETA':
        const list = getListFiles(message.toString())
        askForFilesOrRemoveFiles(list, remote.address)
        break;
      case 'EAE':
        const fileNameToSave = getFileName(message.toString(), 2)
        const dataFromFile = getDataFromFile(message.toString())
        writeFile(fileNameToSave, dataFromFile, remote.address)
        break;
      default:
        break;
    }
}

const askForListOfFiles = (ipToSend) => {
    const message = 'PTA;'
    sendMessage(message, ipToSend)
}

const sendListOfFiles = async (ipToSend) => {
  const filesNames = await readListFiles()
  const message = 'ETA;' + filesNames + ';'
  sendMessage(message, ipToSend)
}

const askForFile = (fileName, ipToSend) => {
  const message = 'PAE;' + fileName + ';'
  sendMessage(message, ipToSend)
}

const sendFile = async (fileName, ipToSend) => {
  const file = await readFile(fileName)
  const fileSize = getFileSize(fileName)
  const message = 'EAE;' + fileSize + ';' + fileName + ';' + file + ';'
  sendMessage(message, ipToSend)
}

const askForFilesOrRemoveFiles = async (list, ipToSend) => {
  // Separa os arquivos em um array
  const arrayOfFiles = list.split(',')

  // Pega os arquivos existentes na pasta do ip
  let filesSaved = []
  if(checkIfDirectoryExists(ipToSend)) {
    filesSaved = await readListFilesFromIp(ipToSend)
  }

  if(filesSaved.length) {
    // Filtra pelos arquivos que estão salvos mas que não estão na lista recebida
    const differentFiles = filesSaved.filter(function(e) {
      return arrayOfFiles.indexOf(e) === -1;
    })

    // Exclui os arquivos
    differentFiles.forEach(element => {
      if(checkIfFileExists(element, ipToSend)) {
        removeFile(element, ipToSend)
      } 
    })
  }

  // Os arquivos que eu não tenho na pasta local, gera um PAE para cada um
  arrayOfFiles.forEach(element => {
    if(!checkIfFileExists(element, ipToSend)) {
      askForFile(element, ipToSend)
    } 
  });
}

export { chooseMethod, askForListOfFiles }