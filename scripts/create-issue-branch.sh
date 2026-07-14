#!/bin/bash

##
# Create Issue-Linked Branch
# 
# Usage: ./scripts/create-issue-branch.sh
#
# Prompts for issue number and title, then creates a branch following:
# feature/issue-{NUMBER}-{description-slug}
#

set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Create Issue-Linked Branch ===${NC}\n"

# Prompt for issue number
read -p "$(echo -e ${YELLOW}Enter issue number (e.g., 42):${NC} )" ISSUE_NUMBER

if [[ ! "$ISSUE_NUMBER" =~ ^[0-9]+$ ]]; then
  echo -e "${RED}Error: Issue number must be a positive integer${NC}"
  exit 1
fi

# Prompt for issue title
read -p "$(echo -e ${YELLOW}Enter issue title:${NC} )" ISSUE_TITLE

if [[ -z "$ISSUE_TITLE" ]]; then
  echo -e "${RED}Error: Issue title cannot be empty${NC}"
  exit 1
fi

# Convert title to kebab-case slug (matches create-branch-on-issue.yml exactly,
# so branch names are identical regardless of whether the Action or this script
# creates them):
# 1. Convert to lowercase
# 2. Remove special characters (keep only alphanumeric and spaces)
# 3. Trim leading/trailing whitespace
# 4. Replace spaces with hyphens
# 5. Collapse multiple hyphens into one
# 6. Truncate to 40 chars, THEN strip a trailing hyphen left by truncation
SLUG=$(echo "$ISSUE_TITLE" | \
  tr '[:upper:]' '[:lower:]' | \
  sed 's/[^a-z0-9 ]//g' | \
  sed 's/^ *//;s/ *$//' | \
  sed 's/ \+/-/g' | \
  sed 's/-\+/-/g')

SLUG=$(echo "$SLUG" | cut -c1-40 | sed 's/-$//')

BRANCH_NAME="feature/issue-${ISSUE_NUMBER}-${SLUG}"

# Check if branch already exists
if git rev-parse --verify "$BRANCH_NAME" >/dev/null 2>&1; then
  echo -e "${YELLOW}Branch already exists: $BRANCH_NAME${NC}"
  read -p "Check out existing branch? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git checkout "$BRANCH_NAME"
    echo -e "${GREEN}Checked out existing branch: $BRANCH_NAME${NC}"
  fi
  exit 0
fi

# Create and checkout the branch
echo -e "\n${BLUE}Creating branch: ${GREEN}${BRANCH_NAME}${NC}"
git checkout -b "$BRANCH_NAME"

echo -e "${GREEN}✓ Branch created and checked out${NC}"
echo -e "\nBranch name: ${BLUE}${BRANCH_NAME}${NC}"
echo -e "\nNext steps:"
echo -e "  1. Make your changes"
echo -e "  2. Commit: ${YELLOW}git commit -m \"Feature: your commit message (fixes #${ISSUE_NUMBER})\"${NC}"
echo -e "  3. Push: ${YELLOW}git push origin ${BRANCH_NAME}${NC}"
echo -e "  4. Create PR on GitHub\n"
