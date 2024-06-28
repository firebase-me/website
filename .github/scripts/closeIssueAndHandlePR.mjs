import { Octokit } from "@octokit/rest";
import { context } from "@actions/github";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

async function run() {
    try {
        const issue = context.payload.issue;
        const { number: issueNumber, labels } = issue;

        const isApproved = labels.some(label => label.name === 'article-approved');
        const isRejected = labels.some(label => ['wontfix', 'dcma', 'article-fault'].includes(label.name));

        if (isApproved) {
            console.log(`Issue #${issueNumber} is approved.`);
            await mergePRForIssue(issueNumber);
        }

        if (isRejected) {
            console.log(`Issue #${issueNumber} is rejected.`);
            await closeAndDeleteBranchForIssue(issueNumber);
        }

        console.log("Script completed successfully");
    } catch (err) {
        console.error("Error running script", err);
        process.exit(1);
    }
}

async function mergePRForIssue(issueNumber) {
    const pulls = await octokit.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: 'open'
    });

    const pullRequest = pulls.data.find(pr => {
        return pr.body.includes(`This PR addresses issue #${issueNumber}`);
    });

    if (pullRequest) {
        await octokit.pulls.merge({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pullRequest.number
        });

        console.log(`Merged PR #${pullRequest.number} for issue #${issueNumber}`);
    } else {
        console.log(`No open PR found for issue #${issueNumber}`);
    }
}

async function closeAndDeleteBranchForIssue(issueNumber) {
    const pulls = await octokit.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: 'open'
    });

    const pullRequest = pulls.data.find(pr => {
        return pr.body.includes(`This PR addresses issue #${issueNumber}`);
    });

    if (pullRequest) {
        const branchName = pullRequest.head.ref;

        await octokit.pulls.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pullRequest.number,
            state: 'closed'
        });

        await octokit.git.deleteRef({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: `heads/${branchName}`
        });

        console.log(`Closed PR #${pullRequest.number} and deleted branch ${branchName} for issue #${issueNumber}`);
    } else {
        console.log(`No open PR found for issue #${issueNumber}`);
    }
}

run().catch(err => {
    console.error("Error running script", err);
    process.exit(1);
});
