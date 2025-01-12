#!/bin/bash

commands=(
    "cd website; pnpm run dev"
    "echo 'Starting FastAPI server'; uvicorn api.index:app --port 8000 --reload"
)

for cmd in "${commands[@]}"; do
    # Replace 'gnome-terminal' with your terminal emulator if different
    gnome-terminal -- bash -c "$cmd; exec bash"
done