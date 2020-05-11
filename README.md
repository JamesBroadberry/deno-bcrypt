# BCrypt

This is a port from [jBCrypt](https://github.com/jeremyh/jBCrypt) to TypeScript for use in [Deno](https://deno.land/).

It has zero third-party dependencies and requires no permissions.

## Import

```ts
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
```

## Usage

To hash a password (with auto-generated salt):

```ts
const hash = bcrypt.hashpw("test");
```

To check a password:

```ts
const result = bcrypt.checkpw("test", hash);
```

To hash a password with a manually generated salt:

```ts
const salt = bcrypt.gensalt(8);
const hash = bcrypt.hashpw("test", salt);
```

## Issues

For any bug reports or feature requests, please create an issue on [GitHub](https://github.com/JamesBroadberry/deno-bcrypt/issues).
