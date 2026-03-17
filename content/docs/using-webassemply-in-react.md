# WebAssembly Modules

This directory contains WebAssembly source code and build outputs for the project.
## Directory Structure
```

public/wasm/
├── README.md # This file
├── math_operations.c # C source code for mathematical operations
├── image_processing.rs # Rust source code for image processing
├── Cargo.toml # Rust project configuration
└── build/ # Generated WebAssembly files
├── math_operations.js # Generated from C code
├── math_operations.wasm
├── rust/ # Generated from Rust code
│ ├── image_processing.js
│ ├── image_processing.wasm
│ └── image_processing_bg.wasm
└── rust-optimized/ # Optimized Rust build

```
## Quick Start
### 1. Install Dependencies

**For C/C++ (Emscripten):**
```bash

# Install Emscripten SDK

git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

**For Rust:**

```bash

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

```
### 2. Build WebAssembly Modules
```bash

# Build C/C++ modules
npm run build:wasm

# Build Rust modules
npm run build:wasm:rust

# Build everything
npm run build:all

```
### 3. Use in Your Code

**C/C++ Module:**

```javascript

import createModule from '/wasm/build/math_operations.js';

const wasmModule = await createModule();

const result = wasmModule.ccall('add', 'number', ['number', 'number'], [5, 3]);

```

**Rust Module:**

```javascript

import init, { greet, fibonacci_rust } from '/wasm/build/rust/image_processing.js';

await init();

const greeting = greet("World");

const fib = fibonacci_rust(40);

```
## Available Functions
### C/C++ Module (math_operations.c)

| Function | Description | Parameters | Return |

|----------|-------------|------------|--------|

| `add` | Add two integers | `(int a, int b)` | `int` |

| `multiply` | Multiply two integers | `(int a, int b)` | `int` |

| `power` | Raise base to exponent | `(double base, double exp)` | `double` |

| `factorial` | Calculate factorial | `(int n)` | `int` |

| `fibonacci` | Fibonacci (recursive) | `(int n)` | `int` |

| `fibonacci_fast` | Fibonacci (iterative) | `(int n)` | `int` |

| `is_prime` | Check if number is prime | `(int n)` | `int` (0/1) |

| `count_primes` | Count primes up to n | `(int n)` | `int` |

| `matrix_multiply` | Matrix multiplication | `(double* a, double* b, double* result, int size)` | `void` |

### Rust Module (image_processing.rs)

| Function | Description | Parameters | Return |

|----------|-------------|------------|--------|

| `greet` | Simple greeting | `(name: &str)` | `String` |

| `get_version` | Get Rust version | `()` | `String` |

| `rgb_to_grayscale` | Convert RGB to grayscale | `(data: &mut [u8])` | `void` |

| `apply_sepia` | Apply sepia filter | `(data: &mut [u8])` | `void` |

| `adjust_brightness` | Adjust image brightness | `(data: &mut [u8], factor: f32)` | `void` |

| `box_blur` | Apply box blur | `(data: &[u8], output: &mut [u8], width: u32, height: u32, radius: u32)` | `void` |

| `fibonacci_rust` | Fibonacci sequence | `(n: u32)` | `u64` |

| `is_prime_rust` | Check if prime | `(n: u32)` | `bool` |

| `count_primes_rust` | Count primes | `(n: u32)` | `u32` |

| `matrix_multiply_rust` | Matrix multiplication | `(a: &[f64], b: &[f64], size: usize)` | `Vec<f64>` |

| `mandelbrot_iteration` | Mandelbrot iteration | `(cx: f64, cy: f64, max_iter: u32)` | `u32` |

| `generate_mandelbrot` | Generate Mandelbrot set | `(width: u32, height: u32, zoom: f64, center_x: f64, center_y: f64, max_iter: u32)` | `Vec<u32>` |

## Performance Comparison

Based on typical benchmarks:

| Operation | JavaScript | WebAssembly | Speedup |

|-----------|------------|-------------|---------|

| Fibonacci(40) | ~100ms | ~30-60ms | 1.5-3x |

| Count primes to 10,000 | ~50ms | ~10-25ms | 2-5x |

| Matrix multiplication (100x100) | ~80ms | ~8-25ms | 3-10x |

| Image processing filters | ~200ms | ~10-40ms | 5-20x |

*Results may vary based on browser, hardware, and specific implementation.*

## Development Tips
### Debugging WebAssembly

1. **Check if module loaded:**

```javascript
console.log('WASM module:', wasmModule);
console.log('Exported functions:', Object.keys(wasmModule));
```

2. **Monitor memory usage:**
```javascript

if (wasmModule.exports.memory) {

console.log('Memory size:', wasmModule.exports.memory.buffer.byteLength);

}

```

3. **Use browser developer tools:**
- Chrome DevTools has WebAssembly debugging support
- Firefox has WASM source map support

### Common Gotchas
1. **Function name mangling:**
- C functions are prefixed with `_`
- Use `__attribute__((visibility("default")))` to export C functions
- Rust functions use `#[wasm_bindgen]` attribute

1. **Memory management:**
- Always free allocated memory in C/C++
- Rust handles memory automatically with wasm-bindgen

3. **Data type compatibility:**
- Use appropriate numeric types
- Be careful with pointer/reference passing
### Adding New Functions

**C/C++:**
1. Add function to `math_operations.c`
2. Add to EXPORTED_FUNCTIONS in build script
3. Rebuild with `npm run build:wasm`

**Rust:**
1. Add function to `image_processing.rs` with `#[wasm_bindgen]`
2. Rebuild with `npm run build:wasm:rust`
## Troubleshooting
### Build Issues

**Emscripten not found:**
```bash

# Make sure emsdk is activated
source path/to/emsdk/emsdk_env.sh

```

**wasm-pack not found:**
```bash

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

**Permission denied on scripts:**
```bash

chmod +x scripts/build-wasm.sh
chmod +x scripts/build-rust-wasm.sh

```
### Runtime Issues

**Module not loading:**
- Check browser console for CORS errors
- Verify file paths are correct
- Ensure files are served with correct MIME types

**Function not found:**
- Check function is exported in build script
- Verify function name (C functions have `_` prefix)
- Use `wasm-objdump -x file.wasm | grep export` to list exports
### Browser Compatibility

WebAssembly is supported in:
- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+

For older browsers, provide JavaScript fallbacks.
## Further Reading
- [Project WebAssembly Guide](../docs/WEBASSEMBLY_GUIDE.md)
- [WebAssembly Official Docs](https://webassembly.org/)
- [Emscripten Documentation](https://emscripten.org/docs/)
- [Rust and WebAssembly Book](https://rustwasm.github.io/docs/book/)