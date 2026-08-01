#!/usr/bin/env bash

git submodule update --depth 1 --init --recursive

cd modules/server
git update-index --skip-worktree bun.lock
git update-index --skip-worktree biome.json 
rm biome.json
cd -

cd modules/terminal-trading-backend
git update-index --skip-worktree bun.lock
git update-index --skip-worktree biome.json 
rm biome.json
cd -

