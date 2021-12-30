# nanojpeg-wasm

[![CI](https://github.com/zckevin/nanojpeg-wasm/actions/workflows/test.yml/badge.svg)](https://github.com/zckevin/nanojpeg-wasm/actions/workflows/test.yml)

Nanojpeg compiled WebAssembly for ServiceWorker, 10KiB size uncompressed.

## nanojpeg

http://svn.emphy.de/nanojpeg

## install

```bash
npm i --save nanojpeg-wasm
```

## API

```TypeScript
interface Result {
  isGrey: boolean
  width: number,
  height: number,
  data: Uint8Array,
}

declare function Decode(image: ArrayBuffer): Result;
```

## build.sh

Dependency:
- Clang LLVM
- [Bynaryen](https://github.com/WebAssembly/binaryen)
- [Emscripten SDK](https://github.com/emscripten-core/emsdk)

https://github.com/harfbuzz/harfbuzzjs/blob/main/nanojpeg/build.sh
