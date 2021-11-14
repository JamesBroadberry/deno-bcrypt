# BCrypt

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/bcrypt/mod.ts)
[![release](https://img.shields.io/github/v/release/jamesbroadberry/deno-bcrypt.svg?color=green&label=latest)](https://github.com/JamesBroadberry/deno-bcrypt/releases)
[![ci](https://github.com/JamesBroadberry/deno-bcrypt/workflows/ci/badge.svg)](https://github.com/JamesBroadberry/deno-bcrypt/actions)

This is a port from [jBCrypt](https://github.com/jeremyh/jBCrypt) to TypeScript for use in [Deno](https://deno.land/).

It has zero third-party dependencies.

Running in sync requires no permissions.
Running in async functionality requires --allow-net

## Import

If you don't want to specify a specific version and are happy to work with breaking changes, you can import this module like so:

```ts
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
```

To ensure that you've got a specific version, it's recommend to import this module specifying a [specific release](https://github.com/JamesBroadberry/deno-bcrypt/releases) like so:

```ts
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
```

## Usage

### Async

The Async implementation requires WebWorkers which require --allow-net to import Deno standard modules from inside the Worker.

```ts
const hash = await bcrypt.hash("test");
```

To check a password:

```ts
const result = await bcrypt.compare("test", hash);
```

To hash a password with a manually generated salt:

```ts
const salt = await bcrypt.genSalt(8);
const hash = await bcrypt.hash("test", salt);
```

### Sync/Blocking

It is not recommended to use this unless you're running a quick script since the BCrypt algorithm is computationally quite expensive. For example, if you're running a server and make multiple calls to it, other requests will be blocked. Using the Async methods are recommended.

To hash a password (with auto-generated salt):

```ts
const hash = bcrypt.hashSync("test");
```

To check a password:

```ts
const result = bcrypt.compareSync("test", hash);
```

To hash a password with a manually generated salt:

```ts
const salt = bcrypt.genSaltSync(8);
const hash = bcrypt.hashSync("test", salt);
```

### Older versions of Deno and/or BCrypt

Older versions of Deno will require an older version of this library (specifically < 0.3.0) because of the introduction of `TextEncoder`.
However, older version of this library require the `--unstable` flag when running.

## Issues

For any bug reports or feature requests, please create an issue on [GitHub](https://github.com/JamesBroadberry/deno-bcrypt/issues).
