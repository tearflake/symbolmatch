# Symbolmatch

Symbolmatch is a parser combinator framework that operates on **S-expressions**. It defines grammars in the same notation that it parses, making it **self-describing and bootstrappable**.  

## Features

- **Self-hosting grammar**: Symbolmatch defines its own grammar using Symbolmatch itself.  
- **Minimal combinators**: `GROUP`, `ADD`, `MUL`, `STAR`, `ATOM` provide expressive power with simplicity.  
- **PEG semantics**: deterministic ordered choice, Kleene repetition, and sequence operators.  
- **Structural error reporting**: instead of character offsets, Symbolmatch reports errors as index paths into the S-expression tree.  
- **Examples included**: arithmetic parsing, identifiers, and error handling.

## Getting Started

1. Review the [Symbolmatch Specification](https://tearflake.github.io/symbolmatch/docs/symbolmatch) for details of the grammar and semantics.  
2. Review the examples in [Symbolmatch Playground](https://tearflake.github.io/symbolmatch/playground/) as a guide to build your own grammars.  
3. Clone the repository.  
4. Refer to `symbolmatch.js` in your javascript project  

## Javascript API  

```
let rules = Parser.parseRules ('(GRAMMAR (RULE <start> "Hello!"))');
if (!rules.err) {
    let output = Parser.parse (rules, "Hello!");
    if (!output.err) {
        console.log (output);
    }
}
```

## Example

### Grammar

```
(GRAMMAR
    (RULE <start> <calc>)    
    (RULE
        <calc>
        (ADD
            (GROUP (MUL "add" <calc> (STAR <calc>)))
            (GROUP (MUL "mul" <calc> (STAR <calc>)))
            ATOMIC)))
```

### Input

```
(mul (add 2 3) 4)
```

### Output

```
["mul" ["add" "2", "3"] "4"]
```

## License

MIT License. See [LICENSE](LICENSE) for details.

