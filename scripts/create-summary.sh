#!/bin/bash
DATE=$(date +%d.%m)
SUMMARY_FILE="to-do-summaries/${DATE}_summaries.md"
echo "## Daily Summary - $DATE" > "$SUMMARY_FILE"
echo "- Add your summary content here." >> "$SUMMARY_FILE"