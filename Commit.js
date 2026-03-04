import jsonfile from "jsonfile";
import simpleGit from "simple-git";

const git = simpleGit();
const path = "./data.json";

async function makeCommit() {
  const data = {
    date: new Date().toISOString()
  };

  await jsonfile.writeFile(path, data);

  await git.add([path]);

  await git.commit(`commit ${new Date().toISOString()}`);

  console.log("Commit created");
}

async function start() {

  // create 5 commits per workflow run
  for (let i = 0; i < 5; i++) {

    await makeCommit();

    // wait 10 seconds between commits
    await new Promise(r => setTimeout(r, 10000));

  }

}

start();