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
<start> := (GRAMMAR <rule>+)

<rule> := (RULE <ATOMIC> <expr>)

<expr> := <ATOMIC>
        | (GROUP <expr>)
        | (ADD <expr>*)
        | (MUL <expr>*)
        | (STAR <expr>)
        | (ATOM <expr>)
```

The above grammar defines the syntax of Symbolmatch. To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one or more occurrences, `...*` for zero or more occurrences, `...?` for optional appearance, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the Symbolmatch grammar.

Atoms may be enclosed between a pair of `'` characters if we want to include special characters used in the grammar. Strings are enclosed between `"` characters. Multiline atoms and strings are enclosed between an odd number of `'` or `"` characters. 
 
In addition to the exposed grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments begin with `//` and span to the end of line. Multiline comments begin with `/*` and end with `*/`.

#### bootstrapping symbolmatch

Symbolmatch can define its own grammar using Symbolmatch syntax. This process is called bootstrapping. The following specification shows how the language describes itself:

```
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
```

### 2.2 informal semantics

Symbolmatch grammars are interpreted with PEG semantics. Each rule matches deterministically, and choice is ordered (the first matching branch wins). All the operators are interpreted with Kleene semantics. We have to be careful not to form direct or indirect left recursion as it leads to a parsing error.

The primitive combinators have the following meaning:

- `GROUP`: enforces grouping of an expression in S-expression list.  
- `MUL`: sequence; all subexpressions must match in order.  
- `ADD`: ordered choice; tries alternatives in order, takes the first match.  
- `STAR`: zero-or-more repetition of the expression.  
- `ATOM`: matches parameters, recognizing an atomic token.  
- `ONE`: always succeeds.  
- `ZERO`: always fails.  
- `ATOMIC`: matches any S-expression atom.  

Error reporting is structural: instead of a raw character index, Symbolmatch returns a **path of indexes into the S-expression tree** that led to the error. However, from this path, it is possible to get the actual line/column position of the error using the "S-expr" package that Symbolmatch is based on.  

## 3. examples

### Example 1: identifiers

Grammar:

```
(GRAMMAR
    (RULE <start> <expr>)
    (RULE <expr> (ADD ATOMIC (GROUP (MUL <expr> <expr>)))))
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
Error: missing list elements at path [1, 2]
```

This path identifies the location inside the nested expression where the parser expected a number.

## 4. conclusion

Symbolmatch demonstrates how a minimal set of S-expression-based parser combinators can define and parse complex grammars, including itself. Its design emphasizes:

- Self-hosting through bootstrapping  
- Minimal core combinators with clear semantics  
- Structural error reporting via index paths  

Future work may include optimization of parsing performance, richer error diagnostics (e.g. expected tokens), and tooling for visualizing parse trees.
