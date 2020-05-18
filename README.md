# BCrypt

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/bcrypt/mod.ts)

This is a port from [jBCrypt](https://github.com/jeremyh/jBCrypt) to TypeScript for use in [Deno](https://deno.land/).

It has zero third-party dependencies.

Running in sync requires no permissions.
Running in async functionality requires --allow-net and --unstable

## Import

```ts
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
```

## Usage

### Async

The Async implementation requires WebWorkers which require --allow-net to import Deno standard modules from inside the Worker. Also, to [allow Crypto inside a WebWorker](https://github.com/denoland/deno/pull/5121), you'll need to use the --unstable flag too.

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

## Issues

For any bug reports or feature requests, please create an issue on [GitHub](https://github.com/JamesBroadberry/deno-bcrypt/issues).
