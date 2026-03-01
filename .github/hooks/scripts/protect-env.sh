#!/bin/bash
# PreToolUse hook: block edits to .env* files
# Receives JSON on stdin with tool_name, tool_input
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

# Only check file-editing tools
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

# Check if the file is an .env file
BASENAME=$(basename "$FILE_PATH")
case "$BASENAME" in
  .env|.env.*)
    cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Editing .env files is blocked by project security policy. Environment files contain secrets and must be edited manually."
  }
}
EOF
    exit 0
    ;;
esac

echo '{}'
exit 0
