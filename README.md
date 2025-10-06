# Symbolmatch 0.5.0

Symbolmatch is a parser combinator framework that operates on **S-expressions**. It defines grammars in the same notation that it parses, making it **self-describing and bootstrappable**.  

## Features

- **Self-hosting grammar**: Symbolmatch defines its own grammar using Symbolmatch itself.  
- **PEG semantics**: Write rules in CFG-like environment having PEG semantics. Choose between flat rules, normalized rules, or subatomic rules.
- **Structural error reporting**: along with raw character offsets, Symbolmatch reports errors as index paths into the S-expression tree.  

## Example

### Grammar

```
(RULES
    (FLAT <start> <calc>)
    
    (NORM <calc> ("add" <elems>))
    (NORM <calc> ("mul" <elems>))
    (NORM <calc> ATOMIC)
    
    (NORM <elems> (<calc> <elems>))
    (NORM <elems> ())
)
```

### Input

```
(mul (add 2 3 4) 5)
```

### Output

```
["mul" ["add" "2", "3" "4"] "5"]
```

## Getting Started

1. Review the [Symbolmatch Specification](https://tearflake.github.io/symbolmatch/docs/symbolmatch) for details of the grammar and semantics.  
2. Review the examples in [Symbolmatch Playground](https://tearflake.github.io/symbolmatch/playground/) as a guide to build your own grammars.  
3. Clone the repository.  
4. Refer to `./symbolmatch.js` in your javascript project  

## Javascript API  

```
let rules = Parser.parseGrammar ('(GRAMMAR (RULE <start> "Hello!"))');
if (!rules.err) {
    let output = Parser.parse (rules, "Hello!");
    if (!output.err) {
        console.log (output);
    }
}
```

## License

MIT License. See [LICENSE](LICENSE) for details.

