import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

import * as bcrypt from "../mod.ts";

Deno.test({
  name: "hashing password then checking returns true",
  fn(): void {
    const passwordToTest = "thisisapassword";

    const hashedPassword = bcrypt.hashSync(passwordToTest);

    const passwordVerified = bcrypt.compareSync(passwordToTest, hashedPassword);

    assertEquals(passwordVerified, true);
  },
});

Deno.test({
  name: "hashing password async then checking async returns true",
  async fn(): Promise<void> {
    const passwordToTest = "thisisapassword";

    const hashedPassword = await bcrypt.hash(passwordToTest);

    const passwordVerified = await bcrypt.compare(
      passwordToTest,
      hashedPassword,
    );

    assertEquals(passwordVerified, true);
  },
});

Deno.test({
  name: "hashing password with a custom salt then checking returns true",
  fn(): void {
    const salt = bcrypt.genSaltSync(8);
    const passwordToTest = "thisisapassword";

    const hashedPassword = bcrypt.hashSync(passwordToTest, salt);

    const passwordVerified = bcrypt.compareSync(passwordToTest, hashedPassword);

    assertEquals(passwordVerified, true);
  },
});

Deno.test({
  name:
    "hashing password with a custom salt async then checking async returns true",
  async fn(): Promise<void> {
    const salt = await bcrypt.genSalt(8);
    const passwordToTest = "thisisapassword";

    const hashedPassword = await bcrypt.hash(passwordToTest, salt);

    const passwordVerified = await bcrypt.compare(
      passwordToTest,
      hashedPassword,
    );

    assertEquals(passwordVerified, true);
  },
});

Deno.test({
  name: "generating a hash with more than 30 rounds fails",
  fn(): void {
    assertThrows(() => {
      bcrypt.genSaltSync(31);
    });
  },
});

Deno.test({
  name: "checking a previously generated hash from deno bcrypt succeeds",
  async fn(): Promise<void> {
    const previousHash =
      "$2a$10$27xCvRE5eHcyjeyO6iZujeWUDl0HCTFbwF9tw6hd1sKMjV3TlRw2O";
    const previousPlaintext = "test";

    const plaintextVerified = await bcrypt.compare(
      previousPlaintext,
      previousHash,
    );

    assertEquals(plaintextVerified, true);
  },
});

Deno.test({
  name: "checking a previously generated hash from php succeeds",
  async fn(): Promise<void> {
    // Generated using "password_hash" function in PHP
    const previousHash =
      "$2y$10$YCW2KSGtFxODsDj5SzCvpussZrfsQb7S3Qtyb7meIumNtyr9ptWoK";
    const previousPlaintext = "test";

    const plaintextVerified = await bcrypt.compare(
      previousPlaintext,
      previousHash,
    );

    assertEquals(plaintextVerified, true);
  },
});

Deno.test({
  name: "checking a previously generated hash from nodejs succeeds",
  async fn(): Promise<void> {
    // Generated using "hash" function in "bcryptjs" npm package
    const previousHash =
      "$2a$10$nnXyDPxy/eA9oHV.bhAqKeD9xZ55wAxwKwNSoBcM9z8GeBMB1GmI2";
    const previousPlaintext = "test";

    const plaintextVerified = await bcrypt.compare(
      previousPlaintext,
      previousHash,
    );

    assertEquals(plaintextVerified, true);
  },
});

Deno.test({
  name:
    "hashing password with non-standard characters then checking is successful",
  async fn(): Promise<void> {
    const passwordToTest = "👍🏿😁😊😂恐龙🎉✔💯💯デノ🐱‍🐉";

    const hashedPassword = await bcrypt.hash(passwordToTest);

    const passwordVerified = await bcrypt.compare(
      passwordToTest,
      hashedPassword,
    );

    assertEquals(passwordVerified, true);
  },
});

Deno.test({
  name:
    "hashing password then checking with a different hashed password is unsuccessful",
  async fn(): Promise<void> {
    const plaintextToCheck = "plaintext";
    const hashToVerify = await bcrypt.hash("hashed");

    const passwordVerified = await bcrypt.compare(
      plaintextToCheck,
      hashToVerify,
    );

    assertEquals(passwordVerified, false);
  },
});

Deno.test({
  name: "hashing password then verifying using an external service works",
  async fn(): Promise<void> {
    const passwordToTest = "ThisIsAPassword1234";
    const hashedPassword = bcrypt.hashSync(passwordToTest);

    const res = await fetch("https://bcrypt.online/verify", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      "body": `plain_text=${passwordToTest}&hash=${hashedPassword}`,
      "method": "POST",
    });

    const data = await res.json();

    assertEquals(data.is_verified, true);
  },
});

Deno.test({
  name:
    "hashing password using an external service works then verifying locally works",
  async fn(): Promise<void> {
    const passwordToTest = "ThisIsAPassword1234";

    const res = await fetch("https://bcrypt.online/calculate", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      "body": `plain_text=${passwordToTest}&cost_factor=10`,
      "method": "POST",
    });

    const data = await res.json();
    const hashedPassword = data.hash;

    const passwordVerified = await bcrypt.compare(
      passwordToTest,
      hashedPassword,
    );

    assertEquals(passwordVerified, true);
  },
});

Deno.test({
  name:
    "comparing wrong plaintext with hash from another plaintext returns false",
  async fn(): Promise<void> {
    const hash = await bcrypt.hash("replicate");
    const result = await bcrypt.compare("replicate", hash);
    assertEquals(result, true);
    const resultKo = await bcrypt.compare("wrongpassword", hash);
    assertEquals(resultKo, false);
  },
});

Deno.test({
  name:
    "hash generated with older Deno and bcrypt version is still recognized as valid by newer versions of Deno and bcrypt",
  async fn(): Promise<void> {
    assertEquals(
      await bcrypt.compare(
        "password123",
        "$2a$10$i7yVylH68UTYSoa./.BWxO0NTXjvPRMzT6F0CgKItqKUqwQwj3y0W",
      ),
      true,
    );
  },
});
