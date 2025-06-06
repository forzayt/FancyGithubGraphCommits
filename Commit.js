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
    console.log("Done committing, pushing...");
    await git.push();
    return;
  }

  const x = random.int(0, 54); // weeks
  const y = random.int(0, 6);  // days

  const baseDate = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d");

  const commitsToday = random.int(1, 5); // Do 1 to 5 commits per day

  for (let i = 0; i < commitsToday && totalCommits > 0; i++) {
    const date = baseDate.clone().add(i, 's').format(); // Add a few seconds to each
    const data = { date };

    console.log(`Commit #${totalCommits} on ${date}`);

    await new Promise((res, rej) => {
      jsonfile.writeFile(path, data, async () => {
        try {
          await git.add([path]);
          await git.commit(date, undefined, { "--date": date });
          res();
        } catch (err) {
          console.error("Git error:", err);
          rej(err);
        }
      });
    });

    totalCommits--;
  }

  // Recursively continue for the next day
  await makeCommits(totalCommits);
};

askCommitCount();
