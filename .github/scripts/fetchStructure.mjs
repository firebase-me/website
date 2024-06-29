import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Octokit } from "@octokit/rest";

const useLocalBypass = process.env.LOCAL_BYPASS === 'true';

let octokit;
if (!useLocalBypass) {
  octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
}

const repository = process.env.GITHUB_REPOSITORY || 'owner/repo';
const [owner, repo] = repository.split('/');

const pathToFolder = 'pages';  // Update the directory to 'pages'
const branch = 'main';  // Adjust the branch name if necessary


async function fetchFolderStructure() {
    function elevateItems(items) {
        const overviewIndex = items.findIndex(item => item.name.startsWith('overview'));
        if (overviewIndex !== -1) {
            const [overviewItem] = items.splice(overviewIndex, 1);
            items.unshift(overviewItem);
        }
        return items;
    }
  const result = [];
  const stack = [{ path: pathToFolder, parent: result }];

  while (stack.length) {
    let { path: currentPath, parent } = stack.pop();
    let contents;

    if (!useLocalBypass) {
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: currentPath
        });
        contents = data.map(item => ({
          name: item.name,
          path: item.path,
          type: item.type
        }));
      } catch (error) {
        console.error(`Failed to fetch contents from GitHub: ${error.message}`);
        process.exit(1);
      }
    } else {
      contents = fs.readdirSync(currentPath).map(name => {
        const fullPath = path.join(currentPath, name);
        return {
          name,
          path: fullPath,
          type: fs.statSync(fullPath).isDirectory() ? 'dir' : 'file'
        };
      });
    }

    // Check for the presence of map.yml
    const mapFile = contents.find(item => item.name === 'map.yml');
    let categoryOrder = {};
    let assignedItems = new Set();

    if (mapFile) {
      let mapContent;
      if (!useLocalBypass) {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: `${currentPath}/map.yml`
        });
        mapContent = Buffer.from(data.content, 'base64').toString('utf-8');
      } else {
        mapContent = fs.readFileSync(path.join(currentPath, 'map.yml'), 'utf-8');
      }
      categoryOrder = yaml.load(mapContent);
    }

    // Process items based on the order in map.yml
    for (const category in categoryOrder) {
      const categoryItems = categoryOrder[category];
      const categoryNode = {
        name: category,
        type: 'category',
        children: []
      };
      parent.push(categoryNode);

      categoryItems.forEach(name => {
        const item = contents.find(content => content.name === name);
        if (item && item.type === 'file' && item.name.endsWith('.md')) {
          const node = {
            name: item.name,
            path: item.path,
            type: item.type,
            children: []
          };
          categoryNode.children.push(node);
          assignedItems.add(item.name);
        } else if (item && item.type === 'dir') {
          const node = {
            name: item.name,
            path: item.path,
            type: item.type,
            children: []
          };
          categoryNode.children.push(node);
          assignedItems.add(item.name);
          stack.push({ path: item.path, parent: node.children });
        }
      });

      // Ensure 'overview.md' is first within this category
      categoryNode.children = elevateItems(categoryNode.children);
    }

    // Process remaining items
    const remainingItems = contents.filter(item => !assignedItems.has(item.name));
    remainingItems.sort((a, b) => a.name.localeCompare(b.name));

    remainingItems.forEach(item => {
      if (item.type === 'file' && item.name.endsWith('.md')) {
        const node = {
          name: item.name,
          path: item.path,
          type: item.type,
          children: []
        };
        parent.push(node);
      } else if (item.type === 'dir') {
        const node = {
          name: item.name,
          path: item.path,
          type: item.type,
          children: []
        };
        parent.push(node);
        stack.push({ path: item.path, parent: node.children });
      }
    });

    parent = elevateItems(parent);
  }

  const filePath = 'structure.json';
  // Write the new structure.json
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

  console.log('structure.json generated successfully');
  if (!useLocalBypass) {
    await commitFileToRepo(filePath);
  }
}

async function commitFileToRepo(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const message = 'Update structure.json';
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`
  });
  const latestCommitSha = refData.object.sha;

  const { data: commitData } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommitSha
  });

  const { data: blobData } = await octokit.git.createBlob({
    owner,
    repo,
    content: Buffer.from(content).toString('base64'),
    encoding: 'base64'
  });

  const { data: treeData } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: commitData.tree.sha,
    tree: [{
      path: filePath,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha
    }]
  });

  const { data: newCommitData } = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: treeData.sha,
    parents: [latestCommitSha]
  });

  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: newCommitData.sha
  });

  console.log('structure.json committed successfully');
}

fetchFolderStructure().catch(err => console.error(err));
