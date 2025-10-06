# symbolmatch

## table of contents

- [1. introduction](#1-introduction)  
- [2. theoretical background](#2-theoretical-background)  
    - [2.1. formal syntax](#21-formal-syntax)  
    - [2.2. informal semantics](#22-informal-semantics)  
- [3. examples](#3-examples)  
- [4. conclusion](#4-conclusion)  

## 1. introduction

Symbolmatch is a parser combinator framework that operates on S-expressions. It defines grammars in the same notation that it parses, making it self-describing and bootstrappable. Symbolmatch is designed to be minimal, deterministic, and easy to reason about.  

## 2. theoretical background

Symbolmatch combines elements of S-expression syntax, Parsing Expression Grammars (PEGs), and Kleene semantics. It defines a small set of primitive combinators from which grammars can be built.  

### 2.1. formal syntax

In computer science, the syntax of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language. Symbolmatch language itself resembles a kind of S-expression. S-expressions consist of lists of atoms or other S-expressions where lists are surrounded by parenthesis. In Symbolmatch, the first list element to the left determines a type of a list. There are a few predefined list types used for data transformation depicted by the following relaxed kind of Backus-Naur form syntax rules:

```
<start> := (RULES <rule>+)

<rule> := (FLAT <IDENTIFIER> <S-EXPRESSION>)
        | (NORM <IDENTIFIER> <S-EXPRESSION>)
        | (ATOM <IDENTIFIER> <S-EXPRESSION>)
```

The above grammar defines the syntax of Symbolmatch. To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one or more occurrences, `...*` for zero or more occurrences, `...?` for optional appearance, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the Symbolmatch grammar.

Atoms may be enclosed between a pair of `'` characters if we want to include special characters used in the grammar. Strings are enclosed between a pair of `"` characters. Multiline atoms and strings are enclosed between an odd number of `'` or `"` characters.
 
In addition to the exposed grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments begin with `//` and span to the end of line. Multiline comments begin with `/*` and end with `*/`.

#### bootstrapping symbolmatch

Symbolmatch can define its own grammar using Symbolmatch syntax. This process is called bootstrapping. The following specification shows how the language describes itself:

```
/*
    Symbolmatch bootstrapped
*/

(RULES
    (NORM <start> ("RULES" <rules>))

    (NORM <rules> (<rule> <rules>))
    (NORM <rules> (<rule> ()))

    (FLAT <rule> ("FLAT" IDENTIFIER ANY))
    (FLAT <rule> ("NORM" IDENTIFIER ANY))
    (FLAT <rule> ("ATOM" IDENTIFIER ANY))
)
```

### 2.2 informal semantics

Symbolmatch grammars are interpreted with PEG semantics. Each rule matches deterministically, and choice is ordered (the first matching branch wins). We have to be careful not to form direct or indirect left recursion as it leads to a parsing error.

There are three rule types: `FLAT`, `NORM`, and `ATOM`. Before the algorithm starts parsing, the input expression is normalized. `FLAT` rules normalize the rule body before matching. `NORM` rules are taken as-are, and they expect an already normalized rule body. `ATOM` rules are used for sub-atomic parsing. When the first `ATOM` rule in a sequence is encountered, the input atom is split into characters and normalized. Such expression is suitable for further rule matching. Finally, when all the parsing is done, the parser returns either input expression, or an error.

Terminals may be constants enclosed within a pair of `"` characters, or built-in constants:

- `IDENTIFIER`: matches an atom without double-quotes.  
- `STRING`: matches an atom within double-quotes.  
- `ATOMIC`: matches any S-expression atom.  
- `ANY`: matches any S-expression.  

Error reporting is structural: along with a raw character index, Symbolmatch also returns the **furthest path of indexes into the S-expression tree** that led to the error.

## 3. examples

### Example 1: identifiers

Grammar:

```
(RULES
    (FLAT <start> <expressions>)
   
    (NORM <expressions> (<expression> <expressions>))
    (NORM <expressions> (<expression> ()))
   
    (FLAT <expression> IDENTIFIER))
```

Input S-expression:

```
(foo bar)
```

Result:

```
["foo", "bar"]
```

### Example 2: arithmetic expressions

Grammar:

```
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
    (ATOM <digit> "0")
)
```

Input S-expression:

```
(mul (add 2 3) 4)
```

Result:

```
["mul", ["add", "2", "3"], "4"]
```

### Example 3: error reporting

Input S-expression:

```
(mul (add 2 (mul)) 4)
```

This fails because the numbers are missing. The error report returns:

```
Error: {missing list elements} at path [1, 2]
```

This path identifies the location inside the nested expression where the parser expectes a number.

## 4. conclusion

Symbolmatch demonstrates how a minimal set of S-expression-based rules can define and parse complex grammars, including itself. Its design emphasizes:

- Self-hosting through bootstrapping  
- Minimal core rule types with clear semantics  
- Structural error reporting via index paths  

Future work may include optimization of parsing performance, richer error diagnostics (e.g. expected tokens), and tooling for visualizing parse trees.
