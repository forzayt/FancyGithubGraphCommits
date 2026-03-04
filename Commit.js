import jsonfile from "jsonfile";
import simpleGit from "simple-git";
import moment from "moment";

const path = "./data.json";
const git = simpleGit();

async function makeCommit() {
  const date = moment().format();

  const data = {
    date: date
  };

  console.log("Commit:", date);

  await jsonfile.writeFile(path, data);

  await git.add([path]);

  await git.commit(`commit ${date}`);

  await git.push();
}

async function start() {
  while (true) {
    try {
      await makeCommit();
    } catch (err) {
      console.log("Error:", err);
    }

    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second
  }
}

start();