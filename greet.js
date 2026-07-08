#!/usr/bin/env node
// Minimal greeting script used to verify the development environment runs code.
// Suggested by TASKS.md ("Add a simple script that prints a greeting").

const name = process.argv[2] || "world";
console.log(`Hello, ${name}! The cursor-agent-playground environment is working.`);
