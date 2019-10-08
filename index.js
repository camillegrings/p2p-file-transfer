import dgram from 'dgram'
import { chooseMethod, askForListOfFiles } from './messageManager'
import { getMethod } from './utils'
import IPS from './external-ips'

// Atribuir o ip da máquina local, que está setada no environment, para a variável ip
if(!process.env.IP)
  throw Error("Variável de ambiente IP não informada");
const ip = process.env.IP;

// Criação do server e do cliente
const server = dgram.createSocket('udp4')
const client = dgram.createSocket('udp4')

// process.stdin.on('data', data => {
//   askForListOfFiles(IPS[0])
// })

let time = 0

// Inicializar server
server.on('listening', function () {
  const address = server.address()
  console.log('Servidor escutando em ' + address.address + ":" + address.port)
});

// Criação do evento message do server - Qualquer mensagem que o server receber irá cair aqui
server.on('message', function (message, remote) {
  time = new Date().getMilliseconds()
  const method = getMethod(message.toString())
  console.log('Mensagem recebida: ' + remote.address + ' - ' + method)
  chooseMethod(method, remote, message)
})

// Criação do método de envio de mensagem pelo clients
const sendMessage = (message, ipToSend) => {
  const endTime = time - new Date().getMilliseconds()
  time = 0
  client.send(message, 0, message.length, 29000, ipToSend, function(err) {
    if (err) throw err;
    console.log('Mensagem enviada para:' + ipToSend + 'em ' + endTime + 'milisegundos')
  });
}

// Bind do client e do server com o ip da variável de ambiente
server.bind(29000, ip)
client.bind(ip)


// Enviar PTA de 5 em 5 segundos para os Ips salvos
let ipToAsk = 0
setInterval(function(){ 
  askForListOfFiles(IPS[ipToAsk])
  ipToAsk++
  if(ipToAsk === IPS.length) ipToAsk = 0
}, 5000)

export { sendMessage }