import * as bcrypt from "./mod.ts";

{
  // Auto-generated salt
  const hash = bcrypt.hashpw("test");
  const result = bcrypt.checkpw("test", hash);

  console.log(hash);
  console.log(result);
}

{
  // Manually-generated salt
  const salt = bcrypt.gensalt(8);
  const hash = bcrypt.hashpw("test", salt);
  const result = bcrypt.checkpw("test", hash);

  console.log(hash);
  console.log(result);
}
