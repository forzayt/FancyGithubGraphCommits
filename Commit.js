import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

const makeCommits = async (n) => {
  if (n === 0) {
    console.log("Done committing, pushing...");
    await git.push();
    return;
  }

  const x = random.int(0, 54); // 0 to 54 weeks
  const y = random.int(0, 6);  // 0 to 6 days

  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = { date };

  console.log(`Commit #${101 - n} on ${date}`);

  jsonfile.writeFile(path, data, async () => {
    try {
      await git.add([path]);
      await git.commit(date, undefined, { "--date": date });
      makeCommits(n - 1);
    } catch (err) {
      console.error("Git error:", err);
    }
  });
};

makeCommits(100);
