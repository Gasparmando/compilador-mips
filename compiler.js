var fs = require('fs');
// const readline = require('readline');

var fileName = 'test.asm';
var programa = '';

fs.readFile(fileName, function (err, f) {
    if (err) throw err;
    programa = f.toString();
    // console.log( programa );
    var lineas = programa.split('\n');
    console.log('Lineas: ' + lineas.length);


    for (var j = 0; j < lineas.length; j++) {
        // console.log(lineas[i])
        // console.log(j)
        var comandos = lineas[j].split(' ');
        // console.log(comandos[1]);
       
        for(var i=0;i<comandos.length;i++){
            comandos[i]= comandos[i].replace('$', '').replace(',','');
        }

           var instruccion =  INSTRUCCIONES.filter( x => x.instr== comandos[0])[0];
     

             if (instruccion.tipo == 'I1'){
                 var binario = '';
                 binario = binario.concat(instruccion.opcode, toBinary(parseInt(comandos[2]),5) , toBinary(parseInt(comandos[1]),5),  toBinary(parseInt(comandos[3]),16));
                 console.log( binario) 

             }



    }



});



const INSTRUCCIONES = [
    {instr:'addi', tipo: 'I1', opcode: '001000', func: '' },
    {instr:'andi', tipo: 'I1', opcode: '001100', func: '' },
    {instr:'ori', tipo: 'I1', opcode: '001101', func: '' },
    {instr:'slti', tipo: 'I1', opcode: '001010', func: '' },
    {instr:'xori', tipo: 'I1', opcode: '001110', func: '' },
    //----------------------------------------------------------
    {instr:'lb', tipo: 'I2', opcode: '100000', func: '' },
    {instr:'lbu', tipo: 'I2', opcode: '100100', func: '' },
    {instr:'lh', tipo: 'I2', opcode: '100001', func: '' },
    {instr:'lhu', tipo: 'I2', opcode: '100101', func: '' },
    {instr:'lw', tipo: 'I2', opcode: '100011', func: '' },
    {instr:'lwu', tipo: 'I2', opcode: '100111', func: '' },
    {instr:'sb', tipo: 'I2', opcode: '101000', func: '' },
    {instr:'sh', tipo: 'I2', opcode: '101001', func: '' },
    {instr:'sw', tipo: 'I2', opcode: '101011', func: '' },
    //----------------------------------------------------------
    {instr:'beq', tipo: 'I3', opcode: '000100', func: '' },
    {instr:'bne', tipo: 'I3', opcode: '000101', func: '' },
    //----------------------------------------------------------
    {instr:'lui', tipo: 'I4', opcode: '001111', func: '' },
    //----------------------------------------------------------
    {instr: 'nop', tipo: 'R', opcode: '111111', func: '000000' },
    {instr:'halt', tipo: 'R', opcode: '111111', func: '111111' }
]


function toBinary(integer, withPaddingLength) {
    let str = integer.toString(2);
    return str.padStart(withPaddingLength, "0");
  }
