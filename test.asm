addi $10, $0, 10
sw $10, 20($1)
nop
lw $2, 20($1)
and $4, $2, $5
or $4, $4, $2
add $9, $4, $2
halt