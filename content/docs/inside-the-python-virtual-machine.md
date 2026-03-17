
source file (actual content) -> tokens `python -m tokenize index.py` -> syntax tree -> Byte code (`python -m dis index.py`)

Tokenizer to Tokens and Parsing to Bytecode

tokens + semantics (through parsing) = syntax tree

C compiler -> Clang 

configure script to create makefile 
makefile to run the code with `make` command

Definition of Nodes -> python.asdl

add things to compile.c to make the compiler understand what to do with the changed syntax (from syntax tree to Bytecode)


`bytecodes.c` -> Domain Specific Language (DSL)
- macro
- inst
- unused
-  /--
 
Stack effect
- Python statements - 0
- Expressions - 1
- Function Calls - negative stack effect

