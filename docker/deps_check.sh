echo "Tool versions:"
for tool; do
    echo "$tool tool: $(docker run -t --rm --entrypoint '' $REPO $tool version)"
done
