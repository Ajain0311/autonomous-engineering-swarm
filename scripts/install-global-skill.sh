#!/usr/bin/env bash
set -e

DEST_DIR="$HOME/.gemini/config/skills/autonomous-engineering-swarm"
CONFIG_FILE="$HOME/.gemini/config/skills.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(dirname "$SCRIPT_DIR")/.agents/skills/autonomous-engineering-swarm"

echo "Installing Autonomous Engineering Swarm global skill..."
mkdir -p "$DEST_DIR"
cp -r "$SOURCE_DIR/"* "$DEST_DIR/"

mkdir -p "$HOME/.gemini/config"
if [ ! -f "$CONFIG_FILE" ]; then
  cat <<EOF > "$CONFIG_FILE"
{
  "entries": [
    {
      "path": "skills"
    }
  ]
}
EOF
  echo "Created global skills.json manifest."
fi

echo "Autonomous Engineering Swarm global skill successfully installed!"
