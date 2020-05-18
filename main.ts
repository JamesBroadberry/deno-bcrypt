import { dirname, join } from "https://deno.land/std/path/mod.ts";
import * as bcrypt from "./bcrypt/bcrypt.ts";

/**
 * Generate a hash for the plaintext password
 * Requires --allow-net, --allow-read and --unstable flags
 *
 * @export
 * @param {string} plaintext The password to hash
 * @param {(number | undefined)} [saltRounds=undefined] Number of salt rounds to use. Recommended to leave this undefined.
 * @returns {Promise<string>} The hashed password
 */
export async function hash(
  plaintext: string,
  saltRounds: number | undefined = undefined,
): Promise<string> {
  let worker = new Worker(
    join(dirname(import.meta.url), "worker.ts"),
    { type: "module", deno: true },
  );

  worker.postMessage({
    action: "hash",
    payload: {
      plaintext,
      saltRounds,
    },
  });

  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      resolve(event.data);
      worker.terminate();
    };
  });
}

/**
 * Generates a salt using a number of log rounds
 * Requires --allow-net, --allow-read and --unstable flags
 *
 * @export
 * @param {(number | undefined)} [log_rounds=undefined] Number of log rounds to use. Recommended to leave this undefined.
 * @returns {Promise<string>} The generated salt
 */
export async function genSalt(
  log_rounds: number | undefined = undefined,
): Promise<string> {
  let worker = new Worker(
    join(dirname(import.meta.url), "worker.ts"),
    { type: "module", deno: true },
  );

  worker.postMessage({
    action: "genSalt",
    payload: {
      log_rounds,
    },
  });

  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      resolve(event.data);
      worker.terminate();
    };
  });
}

/**
 * Check if a plaintext password matches a hash
 * Requires --allow-net, --allow-read and --unstable flags
 *
 * @export
 * @param {string} plaintext The plaintext password to check
 * @param {string} hash The hash to compare to
 * @returns {Promise<boolean>} Whether the password matches the hash
 */
export async function compare(
  plaintext: string,
  hash: string,
): Promise<boolean> {
  let worker = new Worker(
    join(dirname(import.meta.url), "worker.ts"),
    { type: "module", deno: true },
  );

  worker.postMessage({
    action: "compare",
    payload: {
      plaintext,
      hash,
    },
  });

  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      resolve(event.data);
      worker.terminate();
    };
  });
}

/**
 * Check if a plaintext password matches a hash
 * This function is blocking and computationally expensive but requires no additonal flags.
 * Using the async variant is highly recommended.
 *
 * @export
 * @param {string} plaintext The plaintext password to check
 * @param {string} hash The hash to compare to
 * @returns {boolean} Whether the password matches the hash
 */
export function compareSync(plaintext: string, hash: string): boolean {
  try {
    return bcrypt.checkpw(plaintext, hash);
  } catch {
    return false;
  }
}

/**
 * Generates a salt using a number of log rounds
 * This function is blocking and computationally expensive but requires no additonal flags.
 * Using the async variant is highly recommended.
 *
 * @export
 * @param {(number | undefined)} [rounds=undefined] Number of log rounds to use. Recommended to leave this undefined.
 * @returns {string} The generated salt
 */
export function genSaltSync(rounds: number | undefined = undefined): string {
  return bcrypt.gensalt(rounds);
}

/**
 * Generate a hash for the plaintext password
 * This function is blocking and computationally expensive but requires no additonal flags.
 * Using the async variant is highly recommended.
 *
 * @export
 * @param {string} plaintext The password to hash
 * @param {(string | undefined)} [salt=undefined] Number of salt rounds to use. Recommended to leave this undefined.
 * @returns {string} The hashed password
 */
export function hashSync(
  plaintext: string,
  salt: string | undefined = undefined,
): string {
  return bcrypt.hashpw(plaintext, salt);
}
