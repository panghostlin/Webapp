#!/bin/bash

if $IS_DEV; then
  npm run dev
else
  npm run buildAndStart
fi
