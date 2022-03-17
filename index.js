import fs from "fs/promises";

const addresses = [
  "C:Users/Lenovo/Desktop/Learning", //collection of projects
  "C://Users/LENOVO/Desktop/Upwork Sample Projects", //single project
];

async function detectNodeModules(dirAddr, files, project) {
  const url = `${dirAddr}/${project}/`;
  for (const file of files) {
    if (file === "node_modules") {
      console.log(`Removing: ${url}/${file}`);
      await fs.rm(url + file, { recursive: true, force: true });
      console.log(`Removed: ${url}/${file}`);
    } else {
      let pjFiles = await fs.readdir(url + file, { withFileTypes: true });
      pjFiles = pjFiles
        .filter((file) => file.isDirectory() && !file.name.includes("."))
        .map((file) => file.name);
      if (pjFiles.length) {
        await detectNodeModules(dirAddr, pjFiles, project + "/" + file);
      }
    }
  }
}

async function getNodeModulesInDirectory(dirAddr) {
  let projects = await fs.readdir(dirAddr);
  projects = projects.filter((name) => !name.includes("."));
  for (const project of projects) {
    //check of the directory iteslf a projects or not
    if (project !== "node_modules") {
      let files = await fs.readdir(`${dirAddr}/${project}`, {
        withFileTypes: true,
      });
      files = files
        .filter((file) => file.isDirectory() && !file.name.includes("."))
        .map((file) => file.name);
      await detectNodeModules(dirAddr, files, project);
    } else {
      console.log(`Removing: ${dirAddr}/${project}`);
      await fs.rm(dirAddr + "/" + project, { recursive: true, force: true });
      console.log(`Removed: ${dirAddr}/${project}`);
    }
  }
}

for (const addr of addresses) {
  await getNodeModulesInDirectory(addr);
}
