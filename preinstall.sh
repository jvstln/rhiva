#!usr/bin/env bash

echo "Expanding submodules..."
git submodule update --depth 1 --init --recursive

