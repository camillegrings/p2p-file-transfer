const getMethod = (message) => {
   if(message.includes(';')) {
       return message.split(';')[0]
   }
   return message
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

export { getMethod, getFileName, getListFiles, getDataFromFile }

