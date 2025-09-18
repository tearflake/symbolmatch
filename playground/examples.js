examples = {
"arith":
`
(GRAMMAR
    (RULE <start> <calc>)
    
    (RULE
        <calc>
        (ADD
            (GROUP (MUL "add" <calc> (STAR <calc>)))
            (GROUP (MUL "mul" <calc> (STAR <calc>)))
            (ATOM <number>)))
            
    (RULE <number> (MUL <digit> (STAR <digit>)))
    (RULE <digit> (ADD "1" "2" "3" "4" "5" "6" "7" "8" "9" "0")))
`,
"arith-input":
`
(mul (add 1 2 3) 4 5)
`,

"bootstrap": `
/*
    Symbolmatch bootstrapped
*/

(GRAMMAR
    (RULE
        <start>
        (GROUP (MUL "GRAMMAR" <rule> (STAR <rule>))))

    (RULE
        <rule>
        (GROUP (MUL "RULE" ATOMIC <expr>)))

    (RULE
        <expr>
        (ADD
            (GROUP (MUL "GROUP" <expr>))
            (GROUP (MUL "ADD" (STAR <expr>)))
            (GROUP (MUL "MUL" (STAR <expr>)))
            (GROUP (MUL "STAR" <expr>))
            (GROUP (MUL "ATOM" <expr>))
            ATOMIC)))
`,
"bootstrap-input": `
(GRAMMAR
    (RULE <start> <calc>)
    
    (RULE
        <calc>
        (ADD
            (GROUP (MUL "add" <calc> (STAR <calc>)))
            (GROUP (MUL "mul" <calc> (STAR <calc>)))
            (ATOM <number>)))
            
    (RULE <number> (MUL <digit> (STAR <digit>)))
    (RULE <digit> (ADD "1" "2" "3" "4" "5" "6" "7" "8" "9" "0")))
`,

"prose":
`
/*
    symbolprose
*/

(
    GRAMMAR
    (RULE <start> <graph>)

    (RULE
        <graph>
        (GROUP (MUL "GRAPH" <element> (STAR <element>))))

    (RULE
        <element>
        (ADD
            (
                GROUP
                (MUL
                    "EDGE"
                    (GROUP (MUL "SOURCE" ATOMIC))
                    (ADD
                        (GROUP (MUL "INSTR" <instruction> (STAR <instruction>)))
                        ONE)
                    (GROUP (MUL "TARGET" ATOMIC))))
            (GROUP (MUL "COMPUTE" ATOMIC <graph>))))

    (RULE
        <instruction>
        (ADD
            (GROUP (MUL "TEST" ANY ANY))
            (GROUP (MUL "ASGN" ATOMIC ANY)))))
`,
"prose-input":
`
(GRAPH
    (EDGE
        (SOURCE BEGIN)
        (INSTR (ASGN RESULT "Hello world!"))
        (TARGET END)))
`,

"verse":
`
/*
    symbolverse
*/

(
    GRAMMAR
    (RULE <start> <ruleset>)

    (RULE <ruleset>
        (GROUP (MUL "REWRITE" <element> (STAR <element>))))

    (RULE <element>
        (ADD
            (GROUP (MUL "RULE" (GROUP (MUL "READ" ANY)) (GROUP (MUL "WRITE" ANY))))
            (GROUP (MUL "COMPUTE" ATOMIC <ruleset>)))))
`,
"verse-input":
`
(REWRITE
    (RULE (READ "Hello computer!") (WRITE "Hello world!")))
`
}

