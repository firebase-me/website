const { Octokit } = require("@octokit/rest");
const { context } = require("@actions/github");
const fs = require('fs');
const path = require('path');

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

async function run() {
    const issue = context.payload.issue;

    if (issue.labels.some(label => label.name === 'new-article')) {
        const [articleTitle, articleContent, articlePath] = parseNewArticleIssue(issue.body);
        if (!articleTitle || !articlePath) {
            await updateIssueComment(issue.number, 'Invalid article title or path.');
            return;
        }
        const branchName = `issue-${issue.number}-new-article-${articleTitle.replace(/\s+/g, '_').toLowerCase()}`;

        // Create or update the branch
        await createOrUpdateBranch(branchName);

        // Add the new article
        await addNewArticle(issue.number, branchName, articleTitle, articleContent, articlePath);

        // Create or update the pull request
        await createOrUpdatePullRequest(issue.title, branchName, issue.number);
    }

    if (issue.labels.some(label => label.name === 'change-request')) {
        const [articleToChange, linesToChange, proposedChanges] = parseIssueBody(issue.body);
        if (!articleToChange) {
            await updateIssueComment(issue.number, 'Invalid article path.');
            return;
        }
        const branchName = `issue-${issue.number}-change-request`;

        // Create or update the branch
        await createOrUpdateBranch(branchName);

        // Update the article
        await updateArticle(issue.number, branchName, articleToChange, linesToChange, proposedChanges);

        // Check if the issue is marked as ready for review
        if (issue.labels.some(label => label.name === 'ready-for-review')) {
            // Create or update the pull request
            await createOrUpdatePullRequest(issue.title, branchName, issue.number);
        }
    }
}

async function createOrUpdateBranch(branchName) {
    try {
        await octokit.git.getRef({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: `heads/${branchName}`
        });
    } catch {
        await octokit.git.createRef({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: `refs/heads/${branchName}`,
            sha: context.sha
        });
    }
}

async function addNewArticle(issueNumber, branchName, articleTitle, articleContent, articlePath) {
    const filePath = path.join('pages', articlePath, `${articleTitle.replace(/\s+/g, '_').toLowerCase()}.md`);
    const content = `# ${articleTitle}\n\n${articleContent}`;

    fs.writeFileSync(filePath, content);

    await octokit.repos.createOrUpdateFileContents({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: filePath,
        message: `Add new article from issue #${issueNumber}`,
        content: Buffer.from(content).toString('base64'),
        branch: branchName
    });

    await updateIssueComment(issueNumber, `New article created at path: ${filePath}`);
}

async function updateArticle(issueNumber, branchName, articlePath, linesToChange, proposedChanges) {
    const filePath = path.join('pages', articlePath);
    if (!fs.existsSync(filePath)) {
        await updateIssueComment(issueNumber, `File does not exist at path: ${filePath}`);
        return;
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const updatedContent = applyChanges(fileContent, linesToChange, proposedChanges);

    fs.writeFileSync(filePath, updatedContent);

    await octokit.repos.createOrUpdateFileContents({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: filePath,
        message: `Apply changes from issue #${issueNumber}`,
        content: Buffer.from(updatedContent).toString('base64'),
        branch: branchName
    });

    await updateIssueComment(issueNumber, `Article updated at path: ${filePath}`);
}

async function createOrUpdatePullRequest(title, branchName, issueNumber) {
    const pulls = await octokit.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        head: `${context.repo.owner}:${branchName}`
    });

    if (pulls.data.length === 0) {
        await octokit.pulls.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            title: title,
            head: branchName,
            base: 'main',
            body: `This PR addresses issue #${issueNumber}`
        });
    } else {
        const pull = pulls.data[0];
        await octokit.pulls.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pull.number,
            body: `This PR addresses issue #${issueNumber}`
        });
    }
}

async function updateIssueComment(issueNumber, comment) {
    // Get existing comments on the issue
    const { data: comments } = await octokit.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber
    });

    // Find the bot's comment
    let botComment = comments.find(comment => comment.user.login === 'github-actions[bot]');

    if (botComment) {
        // Update the existing comment
        await octokit.issues.updateComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: botComment.id,
            body: comment
        });
    } else {
        // Create a new comment
        botComment = await octokit.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issueNumber,
            body: comment
        });
    }

    // Pin the bot comment (requires admin permissions)
    await octokit.issues.pinIssueComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: botComment.id
    });
}

function parseNewArticleIssue(body) {
    const lines = body.split('\n').map(line => line.trim());
    const articleTitle = lines.find(line => line.startsWith('**Article Title**')).split(': ')[1];
    const articlePath = lines.find(line => line.startsWith('**Article Path**')).split(': ')[1];
    const proposedChangesIndex = lines.findIndex(line => line.startsWith('**Article Content**'));
    const articleContent = lines.slice(proposedChangesIndex + 1).join('\n').trim();
    return [articleTitle, articleContent, articlePath];
}

function parseIssueBody(body) {
    const lines = body.split('\n').map(line => line.trim());
    const articleToChange = lines.find(line => line.startsWith('**Article to Change**')).split(': ')[1];
    const linesToChange = lines.find(line => line.startsWith('**Line(s) to Change**')).split(': ')[1];
    const proposedChangesIndex = lines.findIndex(line => line.startsWith('**Proposed Changes**'));
    const proposedChanges = lines.slice(proposedChangesIndex + 1).join('\n').trim();
    return [articleToChange, linesToChange, proposedChanges];
}

function applyChanges(content, linesToChange, changes) {
    const contentLines = content.split('\n');
    const [start, end] = linesToChange.includes('-')
        ? linesToChange.split('-').map(Number)
        : [Number(linesToChange), Number(linesToChange)];
    const updatedLines = [
        ...contentLines.slice(0, start - 1),
        changes,
        ...contentLines.slice(end)
    ];
    return updatedLines.join('\n');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
