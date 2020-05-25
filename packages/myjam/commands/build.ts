import rimraf from "rimraf";
import buildPage from "../build/buildPage";
import { publicDir } from "../build/shared";

export default async function build(pagePath: string) {
  console.log("🛠️ Building");

  try {
    rimraf(publicDir, (err) => {
      if (err) throw err;
    });
    await buildPage({ pagePath });
  } catch (e) {
    console.error("🙀 Build failed");
    console.error(e);
    return;
  }

  console.log("🎉 Build successful!");
}
