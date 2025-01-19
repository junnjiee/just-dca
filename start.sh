#!/bin/bash

commands=(
    "cd website; pnpm run dev"
    "cd backend; echo 'Starting FastAPI server'; hypercorn app.main:app --reload --bind :::8000"
)

for cmd in "${commands[@]}"; do
    # Replace 'gnome-terminal' with your terminal emulator if different
    gnome-terminal -- bash -c "$cmd; exec bash"
done