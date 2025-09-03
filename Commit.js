import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import readline from "readline";

const path = "./data.json";
const git = simpleGit();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askCommitCount = () => {
  rl.question("How many commits do you want to make? (Default: 100): ", async (input) => {
    const count = parseInt(input, 10) || 100;
    await makeCommits(count);
    rl.close();
  });
};

const makeCommits = async (totalCommits) => {
  // Start 1 year ago
  let date = moment().subtract(1, "year");

  while (date.isBefore(moment()) && totalCommits > 0) {
    // Decide how many commits to make this day
    const commitsToday = random.int(1, 5);

    for (let i = 0; i < commitsToday && totalCommits > 0; i++) {
      const commitDate = date
        .clone()
        .hour(random.int(9, 17)) // business hours
        .minute(random.int(0, 59))
        .second(i * 10)
        .format();

      const data = { date: commitDate };

      console.log(`📝 Commit #${totalCommits} on ${commitDate}`);

      await new Promise((res, rej) => {
        jsonfile.writeFile(path, data, async () => {
          try {
            await git.add([path]);
            await git.commit(`Commit on ${commitDate}`, undefined, {
              "--date": commitDate
            });
            res();
          } catch (err) {
            console.error("❌ Git error:", err);
            rej(err);
          }
        });
      });

      totalCommits--;
    }

    date.add(1, "day"); // move to next day
  }

  console.log("✅ All commits done. Pushing to GitHub...");
  await git.push();
};

askCommitCount();
