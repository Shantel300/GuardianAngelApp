# GuardianAngelApp — Team Collaboration Guide

**Project:** A secure, AI-powered mobile support system  
**Repository:** https://github.com/Shantel300/GuardianAngelApp  
**Team Lead:** Anesu Mupesa (anesumupesa@gmail.com)

## Getting Started

### Setup
```bash
cd GuardianAngelApp
git clone https://github.com/Shantel300/GuardianAngelApp.git
cd GuardianAngelApp
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Persistent GitHub Access
GitHub credentials are cached via Git Credential Manager (Windows) — credentials persist across sessions automatically.

## Collaboration Workflow

### Branch Strategy
- **main** — Production-ready code (protect this branch)
- **develop** — Integration branch for features
- **feature/\*** — Individual feature branches
  - Format: `feature/description-of-feature`
  - Branch from: `develop`
  - Merge back via: Pull Request

### Pull Requests
1. Create feature branch from `develop`
2. Make changes and commit with clear messages
3. Push to GitHub
4. Open PR with description of changes
5. Wait for code review from team member
6. Merge to `develop` when approved
7. Delete feature branch after merge

### Commit Messages
```
[TYPE] Brief description (under 50 chars)

Longer explanation of changes if needed.
- Bullet point 1
- Bullet point 2
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

### Code Review Checklist
- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] No breaking changes without documentation
- [ ] Commits are logical and well-described

## Project Structure
```
GuardianAngelApp/
├── .claude/          # Claude Code configuration
├── .git/             # Git repository
├── TeamPlan.md       # Team planning document
└── [project files]   # App source code
```

## GitHub Permissions
- ✅ Git commands (push, pull, branch operations)
- ✅ GitHub CLI (gh) for PR/issue management
- ✅ Bash shell for automation

## Quick Commands

```bash
# Check status
git status

# Pull latest changes from team
git pull origin develop

# Create and switch to feature branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "[feat] Description of change"

# Push feature branch
git push origin feature/my-feature

# Create PR (if gh CLI installed)
gh pr create --base develop --title "Feature: Description"

# Switch branches
git checkout develop
git pull origin develop
```

## Troubleshooting

**"Permission denied" on push?**
- Check GitHub credentials via: `git config --global credential.helper`
- On Windows, Git Credential Manager should be auto-configured
- If needed, re-authenticate with `git config --global --unset credential.helper` then try push again

**Merge conflicts?**
- Pull latest from main branch: `git pull origin develop`
- Resolve conflicts in your editor
- Commit and push resolved changes

**Accidentally committed to main?**
- Create feature branch: `git checkout -b feature/name`
- Revert main to previous commit: `git checkout main && git reset --hard origin/main`

## Contact
For questions or issues with the workflow, reach out to Anesu (anesumupesa@gmail.com).
