# sourcemap-reverser

A command-line tool to reconstruct original source files from minified code and source maps.

## Installation

To install `sourcemap-reverser` globally, run:

```bash
npm install -g sourcemap-reverser
```

## Usage

```bash
sourcemap-reverser --minified <minified_code_path> --sourcemap <source_map_path> --output <output_directory>
```

### Options

- `-m, --minified <path>`: Path to the minified code (required)
- `-s, --sourcemap <path>`: Path to the source map (default: `<minified_code_path>.map`)
- `-o, --output <path>`: Path to the output directory where the reconstructed source files will be saved (required)

### Example

```bash
sourcemap-reverser --minified assets/minified.js --sourcemap assets/minified.js.map --output results/sources
```

This command will read the minified code from `assets/minified.js` and the source map from `assets/minified.js.map`, then reconstruct the original source files and save them to the `results/sources` directory.

## License

MIT
