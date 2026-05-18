# cloc-rs

A Rust port of [cloc](https://github.com/AlDanial/cloc)'s line-counting logic,
designed to compile to WebAssembly for in-browser code stats.

The crate exposes language detection (`detect_language`), per-file counting
(`count_file` / `count_with_language`), and the directory-walk filters
(`is_ignored_path`, `is_not_code`) via `wasm-bindgen`.

## Status

Validated against `cloc 2.08` default (i.e. with deduplication, no
`--skip-uniqueness`) across 27 real-world repositories. **24/27 produce
identical totals** (files, blank, comment, code). The remaining 3 differ
only because cloc's Perl `call_regexp_common` filter hits its built-in
timeout on a handful of files and bails out — cloc emits

```
rm_comments(call_regexp_common): exceeded timeout for X--ignoring
```

and then reports `code=0, comment=total-blank` for those files. Re-running
`cloc --timeout=300` on the same inputs produces the same counts as cloc-rs.

| Repository | Match | Note |
|---|---|---|
| ansible, bitcoin, cpython, curl, elasticsearch, express, flask, hugo, jekyll, json, jupyter, neovim, ohmyzsh, pandoc, rails, react, redis, requests, ripgrep, sds, spring, terraform, tokio, wordpress | exact | — |
| go | 99.7% | 2 generated Unicode-table files trigger cloc's regex timeout |
| spark | 99.7% | 5 Scala test files trigger cloc's regex timeout |
| vscode | 99.8% | 5 TypeScript test files trigger cloc's regex timeout |

Cumulative diff across all 27 repos: **21,582 lines out of 24.1M = 0.089%**,
entirely attributable to cloc bailouts on those 12 files.

## What is faithfully ported

- Language detection by filename, prefix, extension (triple → double →
  single-dot probing in cloc's order), and shebang
- Content-based disambiguation: `.ts` (TypeScript / Qt Linguist), `.m`
  (MATLAB / Mathematica / Objective-C / MUMPS / Mercury), `.inc`
  (PHP / Pascal / Fortran / Pawn / BitBake), `.d` (D / init.d shell script),
  `.cs` (C# / Smalltalk), `.pl` (Perl / Prolog), `.fs` (F# / Forth), `.jl`
  (Julia / Lisp), `.tpl` (Smarty), `.ui` (Qt / Glade), `pom.xml` (Maven / XML)
- `Exclude_Dir` defaults (`.svn .cvs .hg .git .bzr .snapshot .config`)
- Perl `-B` binary detection: any NUL in the first 512 bytes → binary,
  otherwise odd-byte ratio
- Blank stripping (`rm_blanks`) including the X++ `^\s*#?\s*$` special case
  and per-language EOL-continuation handling
- Per-language filter pipelines: `remove_matches`, `remove_inline`,
  `remove_between_general`, `remove_between_regex`, `replace_regex`,
  `replace_between_regex`, `remove_html_comments`, `call_regexp_common`
  (C / C++ / HTML / Pascal / Shell), `remove_haskell_comments` (incl. the
  `{-# ... #-}` pragma exception), `remove_OCaml_comments`,
  `remove_f77_comments`, `remove_f90_comments`, `remove_jsp_comments`,
  `add_newlines`, `docstring_to_C`, `docstring_rm_comments`,
  `powershell_to_C`, `smarty_to_C`, `elixir_doc_to_C`, `Forth_paren_to_C`,
  `reduce_to_rmd_code_blocks`, `jupyter_nb`
- The shebang-as-code re-insertion for scripting languages
- The cloc duplicate-file detection: bucket by byte size, then by content
  hash, keep the file whose path sorts last byte-wise (matching Perl
  `sort` semantics, not Rust's component-wise `Path::cmp`)
- ASCII-only `\s` / `\w` / `\d` semantics (cloc doesn't `use utf8`),
  ported by rewriting char classes before handing the pattern to Rust's
  regex crate
- Octal escapes like `\47` in cloc filter patterns

## What is intentionally not ported

- `call_regexp_common` timeout bailout (see Status above)
- Diff mode (`--diff`)
- `--strip-comments` / `--strip-str-comments` post-processing
- Per-file CSV / JSON reporting (the WASM API returns counts; the caller
  formats output)

## Build

```sh
cargo test --release             # unit tests
cargo build --release --examples # validation harness binaries
```

For WebAssembly:

```sh
wasm-pack build --target web --release --out-dir pkg
```

## Validation harness

`examples/validate.rs` walks a directory, applies the full
classify → binary-check → dedup → count pipeline, and prints a cloc-style
report:

```sh
cargo run --release --example validate -- /path/to/repo
```

`examples/list_kept.rs` and `examples/list_kept_lang.rs` print the per-file
set that survives dedup (useful when diffing against `cloc --by-file --csv`).

## Regenerating language tables

`src/data.rs` is generated from cloc.pl. See `scripts/README.md`.

## License

MIT. See `LICENSE`. cloc itself is GPLv2 and not redistributed in this repo.
