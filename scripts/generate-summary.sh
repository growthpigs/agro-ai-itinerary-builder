#!/bin/bash

# Get current date
DATE=$(date +%d.%m)
SUMMARY_FILE="to-do-summaries/${DATE}_summaries.md"

# Get git information
BRANCH=$(git branch --show-current)
COMMIT_COUNT=$(git log --oneline --since="24 hours ago" | wc -l | tr -d ' ')
LAST_COMMIT=$(git log -1 --pretty=format:"%h - %s")

# Check if summary file already exists
if [ -f "$SUMMARY_FILE" ]; then
    echo "" >> "$SUMMARY_FILE"
    echo "---" >> "$SUMMARY_FILE"
    echo "" >> "$SUMMARY_FILE"
    echo "### Update - $(date +%H:%M)" >> "$SUMMARY_FILE"
else
    echo "## Daily Summary - $DATE" > "$SUMMARY_FILE"
    echo "" >> "$SUMMARY_FILE"
    echo "**Generated**: $(date '+%Y-%m-%d %H:%M:%S')" >> "$SUMMARY_FILE"
    echo "**Branch**: $BRANCH" >> "$SUMMARY_FILE"
    echo "" >> "$SUMMARY_FILE"
fi

# Add commit information
echo "" >> "$SUMMARY_FILE"
echo "### Recent Commits" >> "$SUMMARY_FILE"
echo "- Commits in last 24h: $COMMIT_COUNT" >> "$SUMMARY_FILE"
echo "- Latest: $LAST_COMMIT" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"

# Add changed files summary
echo "### Files Changed Today" >> "$SUMMARY_FILE"
git diff --name-status HEAD~${COMMIT_COUNT:-1} 2>/dev/null | head -10 >> "$SUMMARY_FILE" || echo "No changes detected" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"

# Add current todos if TodoWrite was used
echo "### Active TODOs" >> "$SUMMARY_FILE"
echo "- Check application logs for current task status" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"

echo "Summary generated at: $SUMMARY_FILE"