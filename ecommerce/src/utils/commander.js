const { Command } = require('commander') 

const program = new Command()   

program 
    .option('--mode <mode>', 'especificación de entorno', 'development') 
    .parse()


module.exports = { program }