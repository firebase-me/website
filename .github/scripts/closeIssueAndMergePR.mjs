import { Octokit } from "@octokit/rest";
import { context } from "@actions/github";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

async function run() {
    try {
        const pullRequest = context.payload.pull_request;
        const { number: prNumber, merged } = pullRequest;

        if (merged) {
            console.log(`Pull request #${prNumber} is merged. Closing the corresponding issue.`);

            // Get the issue number from the PR body
            const issueNumber = extractIssueNumberFromPR(pullRequest.body);
            if (issueNumber) {
                await octokit.issues.update({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    issue_number: issueNumber,
                    state: 'closed'
                });
                console.log(`Issue #${issueNumber} closed.`);

                // Add a comment to the issue indicating it was closed due to PR merge
                await octokit.issues.createComment({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    issue_number: issueNumber,
                    body: `Issue closed automatically because the pull request #${prNumber} was merged.`
                });
            } else {
                console.error("Issue number could not be extracted from the PR body.");
            }
        } else {
            console.log(`Pull request #${prNumber} is not merged.`);
        }

        console.log("Script completed successfully");
    } catch (err) {
        console.error("Error running script", err);
        process.exit(1);
    }
}

function extractIssueNumberFromPR(body) {
    const issueMatch = body.match(/#(\d+)/);
    return issueMatch ? parseInt(issueMatch[1], 10) : null;
}

run().catch(err => {
    console.error("Error running script", err);
    process.exit(1);
});
