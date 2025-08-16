# Twitter-Clone — Local Setup Guide

This project is a full-stack Twitter-like app:

# React + Redux Toolkit

# Server: Node.js (Express), MongoDB (Mongoose), JWT in HttpOnly cookie

# 1) Prerequisites

Node.js: use LTS v20 (recommended).

Using very new Node versions (e.g., v24) can break native modules like bcrypt.

MongoDB: local instance running on mongodb://127.0.0.1:27017

# 2) Install dependencies/Start App
   
# Server
npm install
npm start

macOS / Apple Silicon note (bcrypt):
If you see native build errors for bcrypt, the quick fix is to use the JS version:

npm uninstall bcrypt
npm install bcryptjs

Then change imports:

- import bcrypt from "bcrypt";
+ import bcrypt from "bcryptjs";

Make sure the uploads folder exists:

mkdir -p uploads

# Client
npm install
npm start

If you hit cross-env: Permission denied on macOS:

cd client
sudo chown -R $(whoami) node_modules
chmod +x node_modules/.bin/*


# 3) Verify the Application

# Backend
curl http://localhost:5000/
-> "Twitter clone 🥳"

# Frontend
-> http://localhost:3000

