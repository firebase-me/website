import { Octokit } from "@octokit/rest";
import { context } from "@actions/github";
import fs from 'fs';
import path from 'path';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

async function run() {
    try {
        const scriptVersion = "v1.0.1"; // Update this version string when you make changes
        console.log(`Running script version: ${scriptVersion}`);

        const issue = context.payload.issue;
        console.log(`Processing issue #${issue.number}`);

        if (issue.labels.some(label => label.name === 'new-article')) {
            console.log("New article detected");
            const [articleTitle, articleContent, articlePath] = parseNewArticleIssue(issue.body);
            console.log(`Parsed article title: ${articleTitle}`);
            console.log(`Parsed article path: ${articlePath}`);

            if (!articleTitle || !articlePath) {
                await updateIssueComment(issue.number, 'Invalid article title or path.');
                return;
            }

            const branchName = `issue-${issue.number}-new-article-${articleTitle.replace(/\s+/g, '_').toLowerCase()}`;
            await createBranch(branchName);

            // Add the new article
            await addNewArticle(issue.number, articleTitle, articleContent, articlePath, branchName);

            // Create or update the pull request
            await createOrUpdatePullRequest(issue.title, branchName, issue.number);
        }

        if (issue.labels.some(label => label.name === 'change-request')) {
            console.log("Change request detected");
            const [articleToChange, linesToChange, proposedChanges] = parseIssueBody(issue.body);
            console.log(`Parsed article to change: ${articleToChange}`);
            console.log(`Parsed lines to change: ${linesToChange}`);

            if (!articleToChange) {
                await updateIssueComment(issue.number, 'Invalid article path.');
                return;
            }

            const branchName = `issue-${issue.number}-change-request`;
            await createBranch(branchName);

            // Update the article
            await updateArticle(issue.number, articleToChange, linesToChange, proposedChanges, branchName);

            // Check if the issue is marked as ready for review
            if (issue.labels.some(label => label.name === 'ready-for-review')) {
                // Create or update the pull request
                await createOrUpdatePullRequest(issue.title, branchName, issue.number);
            }
        }

        console.log("Script completed successfully");
    } catch (err) {
        console.error("Error running script", err);
        process.exit(1);
    }
}

async function createBranch(branchName) {
    const mainRef = await octokit.git.getRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `heads/main`
    });

    await octokit.git.createRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `refs/heads/${branchName}`,
        sha: mainRef.data.object.sha
    });

    console.log(`Branch ${branchName} created`);
}

async function addNewArticle(issueNumber, articleTitle, articleContent, articlePath, branchName) {
    // Trim and normalize the path and title
    const cleanArticlePath = articlePath.trim().replace(/\s+/g, ' ');
    const cleanArticleTitle = articleTitle.trim().replace(/\s+/g, '_').toLowerCase();
    const filePath = path.join('pages', cleanArticlePath, `${cleanArticleTitle}.md`);
    const content = `# ${articleTitle}\n\n${articleContent}`;
    console.log(`Adding new article at ${filePath}`);

    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

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

async function updateArticle(issueNumber, articlePath, linesToChange, proposedChanges, branchName) {
    const cleanArticlePath = articlePath.trim().replace(/\s+/g, ' ');
    const filePath = path.join('pages', cleanArticlePath);
    
    if (!fs.existsSync(filePath)) {
        console.log(`File does not exist at path: ${filePath}. Creating a placeholder file.`);
        const placeholderContent = `# Placeholder\n\nThis is a placeholder file for ${cleanArticlePath}.`;
        
        // Create the directory if it doesn't exist
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(filePath, placeholderContent);

        await octokit.repos.createOrUpdateFileContents({
            owner: context.repo.owner,
            repo: context.repo.repo,
            path: filePath,
            message: `Create placeholder file from issue #${issueNumber}`,
            content: Buffer.from(placeholderContent).toString('base64'),
            branch: branchName
        });

        await updateIssueComment(issueNumber, `Placeholder file created at path: ${filePath}`);
        return;
    }
    
    console.log(`Updating article at ${filePath}`);
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
        state: 'open'
    });

    // Check if a PR already exists for the issue
    let pullRequest = pulls.data.find(pr => pr.head.ref === branchName);
    if (pullRequest) {
        await octokit.pulls.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pullRequest.number,
            body: `This PR addresses issue #${issueNumber}`
        });
        console.log(`Pull request updated for issue #${issueNumber}`);
    } else {
        pullRequest = await octokit.pulls.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            title: `${title} (#${issueNumber})`,
            head: branchName,
            base: 'main',
            body: `This PR addresses issue #${issueNumber}`
        });
        console.log(`Pull request created for issue #${issueNumber}`);
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
        console.log(`Updated bot comment on issue #${issueNumber}`);
    } else {
        // Create a new comment
        botComment = await octokit.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issueNumber,
            body: comment
        });
        console.log(`Created new bot comment on issue #${issueNumber}`);
    }
}

function parseNewArticleIssue(body) {
    const lines = body.split('\n').map(line => line.trim().replace(/\s+/g, ' '));
    const articleTitle = lines.find(line => line.startsWith('**Article Title**')).split(': ')[1];
    const articlePath = lines.find(line => line.startsWith('**Article Path**')).split(': ')[1];
    const proposedChangesIndex = lines.findIndex(line => line.startsWith('**Article Content**'));
    const articleContent = lines.slice(proposedChangesIndex + 1).join('\n').trim();
    return [articleTitle, articleContent, articlePath];
}

function parseIssueBody(body) {
    const lines = body.split('\n').map(line => line.trim().replace(/\s+/g, ' '));
    const articleToChange = lines.find(line.startsWith('**Article to Change**')).split(': ')[1];
    const linesToChange = lines.find(line.startsWith('**Line(s) to Change**')).split(': ')[1];
    const proposedChangesIndex = lines.findIndex(line.startsWith('**Proposed Changes**'));
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
    console.error("Error running script", err);
    process.exit(1);
});
