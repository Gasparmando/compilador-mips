//########################################################################################################################################################################################################################
var fs = require('fs');
var fileName = 'test.asm';
var programa = '';
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
fs.readFile(fileName, function (err, f) {
    if (err) throw err;
    programa = f.toString();
    var lineas = programa.split('\n');
    var fallo = false;
    var output = '';

    var n = lineas.length;
    // output = n.toString();
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    for (var j = 0; j < lineas.length; j++) {

        var comandos = lineas[j].split(' ');
        comandos = comandos.map(comando => comando.replace('$', '').replace(',', ''));

        var instruccion = INSTRUCCIONES.filter(x => x.instr === comandos[0].trim())[0];

        if (!instruccion) {
            console.error("Instruccion indefinida: " + comandos[0]);
            fallo = true;
        } else {

            var binario = '';
            var rs, rt, rd, offset, base, inm, index;
            var opcode = instruccion.opcode;
            var func = instruccion.func;

            switch (instruccion.tipo) {
                case 'I1':

                    rd = toBinary(parseInt(comandos[1]), 5);
                    rs = toBinary(parseInt(comandos[2]), 5);
                    inm = toBinary(parseInt(comandos[3]), 16);
                    binario = binario.concat(opcode, rs, rd, inm);
                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        
                case 'I2':
                    var opers = comandos[2].split('(');
                    offset = toBinary(parseInt(opers[0]), 16);
                    base = toBinary(parseInt(opers[1].replace(')', '')), 5);
                    rt = toBinary(parseInt(comandos[1]), 5);

                    binario = binario.concat(opcode, base, rt, offset);
                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        
                case 'I3':
                    rs = toBinary(parseInt(comandos[1]), 5);
                    rt = toBinary(parseInt(comandos[2]), 5);
                    offset = toBinary(parseInt(comandos[3]), 16);

                    binario = binario.concat(opcode, rs, rt, offset);
                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        
                case 'I4':
                    rt = toBinary(parseInt(comandos[1]), 5);
                    inm = toBinary(parseInt(comandos[2]), 16);

                    binario = binario.concat(opcode, '00000', rt, inm);
                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        
                case 'R1':
                    rd = toBinary(parseInt(comandos[1]), 5);
                    rs = toBinary(parseInt(comandos[2]), 5);
                    rt = toBinary(parseInt(comandos[3]), 5);

                    binario = binario.concat(opcode, rs, rt, rd, '00000', func);
                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       
                case 'R2':
                    rd = toBinary(parseInt(comandos[1]), 5);
                    rs = toBinary(parseInt(comandos[2]), 5);
                    sa = toBinary(parseInt(comandos[3]), 5);
                    binario = binario.concat(opcode, rs, '00000', rd, sa, func);
                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        
                case 'J1':
                    index = toBinary(parseInt(comandos[1]), 26);

                    binario = binario.concat(opcode, index);
                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        
                case 'J2':

                    rs = toBinary(parseInt(comandos[1]), 5);

                    binario = binario.concat(opcode, rs, '00000', '11111', '00000', func);

                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        
                case 'J3':

                    rs = toBinary(parseInt(comandos[1]), 5);

                    binario = binario.concat(opcode, rs, '000000000000000', func);
                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        
                case 'NOP':

                    binario = binario.concat(opcode, toBinary(0, 26));
                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        
                case 'HLT':

                    binario = binario.concat(opcode, toBinary((2 ** 26) - 1, 26));
                    break;
                //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        

            }

            output = output.concat( binario + '\n');
            console.log(binario);

        }
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
    }

    if (fallo) {
        console.error('FALLO')
    } else {
        fs.writeFile('../data_file.bin', output, function (err) {
            if (err) throw err;
            console.log('Archivo binario generado: output.bin!');
        });
    }




});
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const INSTRUCCIONES = [
    { instr: 'addi', tipo: 'I1', opcode: '001000', func: '' },
    { instr: 'andi', tipo: 'I1', opcode: '001100', func: '' },
    { instr: 'ori', tipo: 'I1', opcode: '001101', func: '' },
    { instr: 'slti', tipo: 'I1', opcode: '001010', func: '' },
    { instr: 'xori', tipo: 'I1', opcode: '001110', func: '' },
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    { instr: 'lb', tipo: 'I2', opcode: '100000', func: '' },
    { instr: 'lbu', tipo: 'I2', opcode: '100100', func: '' },
    { instr: 'lh', tipo: 'I2', opcode: '100001', func: '' },
    { instr: 'lhu', tipo: 'I2', opcode: '100101', func: '' },
    { instr: 'lw', tipo: 'I2', opcode: '100011', func: '' },
    { instr: 'lwu', tipo: 'I2', opcode: '100111', func: '' },
    { instr: 'sb', tipo: 'I2', opcode: '101000', func: '' },
    { instr: 'sh', tipo: 'I2', opcode: '101001', func: '' },
    { instr: 'sw', tipo: 'I2', opcode: '101011', func: '' },
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    { instr: 'beq', tipo: 'I3', opcode: '000100', func: '' },
    { instr: 'bne', tipo: 'I3', opcode: '000101', func: '' },
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    { instr: 'lui', tipo: 'I4', opcode: '001111', func: '' },
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    { instr: 'nop', tipo: 'NOP', opcode: '111111', func: '000000' },
    { instr: 'halt', tipo: 'HLT', opcode: '010101', func: '111111' },
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    { instr: 'add', tipo: 'R1', opcode: '000000', func: '100000' },
    { instr: 'addu', tipo: 'R1', opcode: '000000', func: '100001' },
    { instr: 'and', tipo: 'R1', opcode: '000000', func: '100100' },
    { instr: 'nor', tipo: 'R1', opcode: '000000', func: '100111' },
    { instr: 'or', tipo: 'R1', opcode: '000000', func: '100101' },
    { instr: 'sllv', tipo: 'R1', opcode: '000000', func: '000100' },
    { instr: 'srlv', tipo: 'R1', opcode: '000000', func: '000110' },
    { instr: 'srav', tipo: 'R1', opcode: '000000', func: '000111' },
    { instr: 'slt', tipo: 'R1', opcode: '000000', func: '101010' },
    { instr: 'sub', tipo: 'R1', opcode: '000000', func: '100010' },
    { instr: 'subu', tipo: 'R1', opcode: '000000', func: '100011' },
    { instr: 'xor', tipo: 'R1', opcode: '000000', func: '100110' },
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
    { instr: 'sll', tipo: 'R2', opcode: '000000', func: '000000' },
    { instr: 'srl', tipo: 'R2', opcode: '000000', func: '000010' },
    { instr: 'sra', tipo: 'R2', opcode: '000000', func: '000011' },
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    { instr: 'j', tipo: 'J1', opcode: '000010', func: '' },
    { instr: 'jal', tipo: 'J1', opcode: '000011', func: '' },
    { instr: 'jalr', tipo: 'J2', opcode: '000000', func: '001001' },
    { instr: 'jr', tipo: 'J3', opcode: '000000', func: '001000' },
]
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
function toBinary(integer, withPaddingLength) {
    let str = integer.toString(2);
    return str.padStart(withPaddingLength, "0");
}
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------