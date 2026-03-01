#!/bin/bash
# PostToolUse hook: auto-format edited files with Prettier
# Receives JSON on stdin with tool_name, tool_input, tool_response
# Uses Node.js for JSON parsing (always available in this project)

set -euo pipefail

INPUT=$(cat)

# Parse tool_name and file path using Node.js
READ=$(node -e '
  const d = JSON.parse(process.argv[1]);
  const name = d.tool_name || "";
  const i = d.tool_input || {};
  const fp = i.filePath || i.file_path
    || (Array.isArray(i.files) && i.files[0])
    || (Array.isArray(i.replacements) && i.replacements[0] && i.replacements[0].filePath)
    || "";
  console.log(name + "\n" + fp);
' "$INPUT" 2>/dev/null) || { echo '{}'; exit 0; }

TOOL_NAME=$(echo "$READ" | head -1)
FILE_PATH=$(echo "$READ" | tail -1)

# Only run after file edit/create tools
case "$TOOL_NAME" in
  editFiles|createFile|replace_string_in_file|create_file|multi_replace_string_in_file)
    ;;
  *)
    echo '{}'
    exit 0
    ;;
esac

if [ -z "$FILE_PATH" ] || [ "$FILE_PATH" = "null" ]; then
  echo '{}'
  exit 0
fi

# Only format files Prettier can handle
case "$FILE_PATH" in
  *.js|*.jsx|*.ts|*.tsx|*.css|*.json|*.md|*.html)
    ;;
  *)
    echo '{}'
    exit 0
    ;;
esac

# Run Prettier (silently)
if command -v npx &>/dev/null && [ -f "$FILE_PATH" ]; then
  npx prettier --write "$FILE_PATH" &>/dev/null || true
fi

echo '{}'
exit 0
