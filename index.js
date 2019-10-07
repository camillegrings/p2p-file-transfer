import { readListFiles, readFile, getFileSize, writeFile, 
  checkIfFileExists, readListFilesFromIp, removeFile } from './fileManager'
import { getMethod, getFileName, getListFiles, getDataFromFile } from './utils'
import IPS from './external-ips'

if(!process.env.IP)
  throw Error("Variável de ambiente PORT não informada");

const ip = process.env.IP;

const dgram = require('dgram');

const server = dgram.createSocket('udp4');
const client = dgram.createSocket('udp4');

process.stdin.on('data', data => {
  askForListOfFiles(IPS[0])
})

server.on('listening', function () {
  var address = server.address();
  console.log('Servidor escutando em ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
  console.log(remote)
  console.log('---- Mensagem recebida de: ' + remote.address + ' - ' + message + '----');
  const method = getMethod(message.toString())
  console.log(method)
  switch (method) {
    case 'PTA':
      sendListOfFiles(remote.address)
      
      break;
    case 'PAE':
      const fileName = getFileName(message.toString())
      console.log(fileName)
      sendFile(fileName, remote.address)
      break;
    case 'ETA':
      const list = getListFiles(message.toString())
      readMessageAndAskForFiles(list, remote.address)
      break;
    case 'EAE':
      const fileNameToSave = getFileName(message.toString(), 2)
      const dataFromFile = getDataFromFile(message.toString())
      writeFile(fileNameToSave, dataFromFile, remote.address)
      break;
    default:
      break;
  }
})

const sendMessage = (message, ipToSend) => {
  // esperoResposta = true
  console.log("sendMessage", ipToSend)
  client.send(message, 0, message.length, 29000, ipToSend, function(err, bytes) {
    if (err) throw err;
    console.log('***** Mensagem enviada para:'+ ipToSend + '*****');  
  });
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
  console.log("sendFile", ipToSend)
  const fileSize = getFileSize(fileName)
  const message = 'EAE;' + fileSize + ';' + fileName + ';' + file + ';'
  sendMessage(message, ipToSend)
}

const readMessageAndAskForFiles = async (list, ipToSend) => {
  const arrayOfFiles = list.split(',')
  const filesSaved = await readListFilesFromIp(ipToSend)
  var differentFiles = filesSaved.filter(function(e) {
    return arrayOfFiles.indexOf(e) === -1;
  });
  differentFiles.forEach(element => {
    if(checkIfFileExists(element, ipToSend)) {
      removeFile(element, ipToSend)
    } 
  });
  arrayOfFiles.forEach(element => {
    if(!checkIfFileExists(element, ipToSend)) {
      askForFile(element, ipToSend)
    } 
  });
}

server.bind(29000, ip)
client.bind(ip)

// setInterval(function(){ 
//   IPS.forEach(element => {
//     askForListOfFiles(element)
//   });
// }, 5000)