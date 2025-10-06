examples = {
"arith":
`
/*
    arithmetic grammar
*/

(RULES
    (FLAT <start> <calc>)
    
    (NORM <calc> ("add" <elems>))
    (NORM <calc> ("mul" <elems>))
    (NORM <calc> <digits>)
    
    (NORM <elems> (<calc> <elems>))
    (NORM <elems> ())
    
    (ATOM <digits> (<digit> <digits>))
    (ATOM <digits> (<digit> ()))
    
    (ATOM <digit> "1")
    (ATOM <digit> "2")
    (ATOM <digit> "3")
    (ATOM <digit> "4")
    (ATOM <digit> "5")
    (ATOM <digit> "6")
    (ATOM <digit> "7")
    (ATOM <digit> "8")
    (ATOM <digit> "9")
    (ATOM <digit> "0"))
`,
"arith-input":
`
(mul (add 1 2 3) 4 5)
`,

"bootstrap": `
/*
    symbolmatch bootstrapped
*/

(RULES
    (NORM <start> ("RULES" <rules>))

    (NORM <rules> (<rule> <rules>))
    (NORM <rules> (<rule> ()))

    (FLAT <rule> ("FLAT" IDENTIFIER ANY))
    (FLAT <rule> ("NORM" IDENTIFIER ANY))
    (FLAT <rule> ("ATOM" IDENTIFIER ANY)))
`,
"bootstrap-input": `
/*
    arithmetic grammar
*/

(RULES
    (FLAT <start> <calc>)
    
    (NORM <calc> ("add" <elems>))
    (NORM <calc> ("mul" <elems>))
    (NORM <calc> <digits>)
            
    (NORM <elems> (<calc> <elems>))
    (NORM <elems> ())

    (ATOM <digits> (<digit> <digits>))
    (ATOM <digits> (<digit> ()))
    
    (ATOM <digit> "1")
    (ATOM <digit> "2")
    (ATOM <digit> "3")
    (ATOM <digit> "4")
    (ATOM <digit> "5")
    (ATOM <digit> "6")
    (ATOM <digit> "7")
    (ATOM <digit> "8")
    (ATOM <digit> "9")
    (ATOM <digit> "0"))
`,

"prose":
`
/*
    symbolprose
*/

(RULES
    (FLAT <start> <graph>)

    (NORM <graph> ("GRAPH" <elements>))
    
    (NORM <elements> (<element> <elements>))
    (NORM <elements> (<element> ()))
    
    (FLAT <element> ("EDGE" ("SOURCE" IDENTIFIER) <instr> ("TARGET" IDENTIFIER)))
    (FLAT <element> ("COMPUTE" ("NAME" IDENTIFIER) <graph>))
    
    (NORM <instr> ("INSTR" <instructions>))
    
    (NORM <instructions> (<instructions> <instruction>))
    (NORM <instructions> (<instruction> ()))
    
    (FLAT <instruction> ("TEST" ANY ANY))
    (FLAT <instruction> ("ASGN" IDENTIFIER ANY)))
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

(RULES
    (FLAT <start> <ruleset>)

    (NORM <ruleset> ("REWRITE" <elements>))

    (NORM <elements> (<elements> <element>))
    (NORM <elements> (<element> ()))

    (FLAT <element> ("RULE" ("READ" ANY) ("WRITE" ANY)))
    (FLAT <element> ("COMPUTE" IDENTIFIER <ruleset>)))
`,
"verse-input":
`
(REWRITE
    (RULE (READ "Hello computer!") (WRITE "Hello world!")))
`,

"symbol":
`
/*
    symp
*/

(RULES
    (FLAT <start> <expr>)

    (FLAT <expr> <apply>)
    (FLAT <expr> ("SEXPR" ANY))

    (FLAT <apply> ("APPLY" <frame> <expr>))

    (FLAT <frame> "symbolmatch")
    (FLAT <frame> "symbolverse")
    (FLAT <frame> "symbolprose")
    (FLAT <frame> ("FRAME" ("SYNTAX" <apply>) ("SEMANTICS" <apply>))))
`,
"symbol-input":
`
(APPLY
    (FRAME
        (SYNTAX
            (APPLY
                symbolmatch
                (SEXPR
                    (RULES (FLAT <start> ATOMIC)))))
                
        (SEMANTICS
            (APPLY
                symbolverse
                (SEXPR
                    (REWRITE (RULE (READ "Hello computer!") (WRITE "Hello world!")))))))
                
    (SEXPR "Hello computer!"))
`
}

