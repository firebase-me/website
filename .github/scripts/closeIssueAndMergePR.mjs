import { Octokit } from "@octokit/rest";
import { context } from "@actions/github";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

async function run() {
    try {
        const pullRequest = context.payload.pull_request;
        const { number: prNumber, merged, state, labels, head: { ref: branchName } } = pullRequest;

        if (state === 'closed' && !merged) {
            console.log(`Pull request #${prNumber} is closed but not merged.`);

            const rejectionLabels = ['wontfix', 'dcma', 'article-fault'];
            const hasRejectionLabel = labels.some(label => rejectionLabels.includes(label.name));

            if (hasRejectionLabel) {
                console.log(`Pull request #${prNumber} has one of the rejection labels: ${rejectionLabels.join(', ')}`);

                // Delete the branch
                await octokit.git.deleteRef({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    ref: `heads/${branchName}`
                });
                console.log(`Branch ${branchName} deleted.`);

                // Add a comment to the PR indicating it was closed due to rejection label
                await octokit.issues.createComment({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    issue_number: prNumber,
                    body: `Pull request closed automatically due to rejection labels: ${rejectionLabels.join(', ')}.`
                });

                return; // Exit the script since deletion is prioritized
            } else {
                console.log(`Pull request #${prNumber} does not have rejection labels.`);
            }
        }

        if (merged) {
            console.log(`Pull request #${prNumber} is merged.`);

            const approvedLabel = labels.find(label => label.name === 'article-merge-approved');
            if (approvedLabel) {
                console.log(`Pull request #${prNumber} has the 'article-merge-approved' label.`);

                // Get the issue number from the PR body
                const issueNumber = extractIssueNumberFromPR(pullRequest.body);
                if (issueNumber && await isValidArticleTemplate(issueNumber)) {
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
                    console.error("Issue number could not be extracted from the PR body or is not a valid article template.");
                }
            } else {
                console.log(`Pull request #${prNumber} does not have the 'article-merge-approved' label.`);
            }
        } else {
            console.log(`Pull request #${prNumber} is not merged and does not have rejection labels.`);
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

async function isValidArticleTemplate(issueNumber) {
    const { data: issue } = await octokit.issues.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber
    });

    const articleTemplateKeywords = [
        '**Article Title**',
        '**Article Content**',
        '**Article Path**'
    ];

    return articleTemplateKeywords.every(keyword => issue.body.includes(keyword));
}

run().catch(err => {
    console.error("Error running script", err);
    process.exit(1);
});
