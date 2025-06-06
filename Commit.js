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
  if (totalCommits <= 0) {
    console.log("✅ Done committing. Pushing to GitHub...");
    await git.push();
    return;
  }

  const x = random.int(0, 52); // weeks ago (within the last 1 year)
  const y = random.int(0, 6);  // extra days

  const baseDate = moment()
    .subtract(x, "weeks")
    .subtract(y, "days");

  const commitsToday = random.int(1, 5); // 1 to 5 commits today

  for (let i = 0; i < commitsToday && totalCommits > 0; i++) {
    const date = baseDate
      .clone()
      .hour(random.int(9, 17)) // Between 9am and 5pm
      .minute(random.int(0, 59))
      .second(i * 10)
      .format();

    const data = { date };

    console.log(`📝 Commit #${totalCommits} on ${date}`);

    await new Promise((res, rej) => {
      jsonfile.writeFile(path, data, async () => {
        try {
          await git.add([path]);
          await git.commit(`Commit on ${date}`, undefined, { "--date": date });
          res();
        } catch (err) {
          console.error("❌ Git error:", err);
          rej(err);
        }
      });
    });

    totalCommits--;
  }

  // Recurse for next batch
  await makeCommits(totalCommits);
};

askCommitCount();
