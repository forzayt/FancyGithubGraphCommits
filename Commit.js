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
  const startDate = moment().subtract(1, "year");
  const endDate = moment();
  const totalDays = endDate.diff(startDate, "days");
  
  // Calculate average commits per day (to distribute evenly)
  const avgCommitsPerDay = Math.max(1, Math.floor(totalCommits / totalDays));

  let remainingCommits = totalCommits;

  while (startDate.isBefore(endDate)) {
    // Randomize commits a bit for natural variation
    const commitsToday = random.int(0, avgCommitsPerDay * 2);

    for (let i = 0; i < commitsToday && remainingCommits > 0; i++) {
      const commitDate = startDate.clone()
        .hour(random.int(9, 17))
        .minute(random.int(0, 59))
        .second(random.int(0, 59))
        .format();

      const data = { date: commitDate };

      console.log(`📝 Commit #${remainingCommits} on ${commitDate}`);

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

      remainingCommits--;
    }

    startDate.add(1, "day");
  }

  console.log("✅ All commits done. Pushing to GitHub...");
  await git.push();
};

askCommitCount();
