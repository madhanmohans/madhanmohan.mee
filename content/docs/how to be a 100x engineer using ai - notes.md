
### todos
- [ ] create a PR creating agents workflow from github issues
- [ ] create claude.md for general code quality and rules

```markdown
1. architecture rules – how we structure code here
2. known mistakes – what the ai got wrong and how to fix it
3. constraints – security, performance, and cost limits

how will we verify this works?
how will we monitor this in production?
what metrics will tell us if this is failing?
```
ai code review tools: codium pr-agent/qodo, github copilot workspace, what-the-diff, grit.

let background agents to run async tasks - can integrate this with github issues and let them solve and I can review those PRs later whenever I am free. 

prompts should have who is the agent, what is needed, how to go about the conversation, constraints, input with existing architecture and output as planning document

## for pr agents (mention in github issues)

### rules
explicit constraints (don't touch x, must preserve y)
### tasks
linter warnings, test cases, migration, refactoring, strategies

### prompt for planning how to go about a feature
```markdown
who: act as a product-minded engineer who understands both technical and business constraints

what: we need to add real-time notifications to our dashboard. current polling is killing our database and users complain about 30-second delays.

how: first, analyze our current architecture and list integration points. then suggest 2-3 approaches (websockets, sse, polling optimization) with explicit tradeoffs on cost, complexity, and reliability.

input:
<current_architecture>
[paste relevant code/diagrams]
</current_architecture>

<constraints>
- max 500ms p95 latency
- current db can't handle more load
- budget: $200/month for new infrastructure
</constraints>

output: markdown table with columns: approach, implementation complexity (1-10), monthly cost estimate, latency impact, reliability concerns

focus on infra budgets, SLAs, latency requirements, rate limits, memory and compute constraints. 
```
## feature development prompts

use well tested apis - write comprehensive code - force the AI to run tests
## testing prompts

"list all edge cases that could break this function, then write property-based tests for them".

**sandbox branches with protection**

background agents never work directly on main or production branches.

they work in:

- dedicated feature branches with clear naming
- ephemeral preview environments with locked-down permissions
- isolated worktrees for parallel work

branch protection rules and ci gates must pass before any merge.