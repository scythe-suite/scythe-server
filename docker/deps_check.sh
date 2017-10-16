echo "Tool versions:"
for tool; do
    echo "$tool tool: $(docker run -t --rm $REPO $tool version)"
done
