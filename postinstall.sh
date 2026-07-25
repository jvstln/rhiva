#!/usr/bin/env bash

git submodule update --init --recursive
cd modules/server
git update-index --skip-worktree bun.lock
git update-index --skip-worktree turbo.json
git update-index --skip-worktree biome.json

if [ -f "turbo.json" ]; then
  rm turbo.json
fi
if [ -f "biome.json" ]; then
  rm biome.json
fi

cd modules/zap
git update-index --skip-worktree biome.json

if [ -f "biome.json" ]; then
  rm biome.json
fi 
cd ../../..

cd terminal-trading-backend
git update-index --skip-worktree biome.json
if [ -f "biome.json" ]; then
  rm biome.json
fi 
cd ../..

bun run build
