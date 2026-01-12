# 📚 Complete Setup Guide for Garage Config Dashboard

## 🎯 For Complete Beginners

This guide assumes you have **no coding experience**. Follow every step carefully!

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installing Node.js](#installing-nodejs)
3. [Setting Up the Project](#setting-up-the-project)
4. [Configuring Authentication (Clerk)](#configuring-authentication-clerk)
5. [Setting Up Database (MongoDB Atlas)](#setting-up-database-mongodb-atlas)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Prerequisites

You'll need:
- A computer (Windows, Mac, or Linux)
- Internet connection
- A web browser (Chrome, Firefox, etc.)
- About 30-60 minutes

---

## 2️⃣ Installing Node.js

Node.js is required to run this application.

### For Windows:

1. **Download Node.js**
   - Go to https://nodejs.org
   - Click the big green button that says "LTS" (Long Term Support)
   - This downloads a file named something like `node-v20.x.x-x64.msi`

2. **Install Node.js**
   - Find the downloaded file (usually in your Downloads folder)
   - Double-click it
   - Click "Next" through all the screens
   - Accept the license agreement
   - Keep clicking "Next" until it says "Install"
   - Click "Install" (you may need to click "Yes" to allow changes)
   - Wait for installation to complete
   - Click "Finish"

3. **Verify Installation**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter (this opens Command Prompt)
   - Type `node --version` and press Enter
   - You should see something like `v20.11.0`
   - Type `npm --version` and press Enter
   - You should see something like `10.2.4`

### For Mac:

1. **Download Node.js**
   - Go to https://nodejs.org
   - Click the big green button that says "LTS"
   - This downloads a `.pkg` file

2. **Install Node.js**
   - Find the downloaded file
   - Double-click it
   - Follow the installer instructions
   - Enter your password when asked

3. **Verify Installation**
   - Press `Command + Space`
   - Type `terminal` and press Enter
   - Type `node --version` and press Enter
   - You should see something like `v20.11.0`

---

## 3️⃣ Setting Up the Project

### Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Windows Key + R`
- Type `cmd` and press Enter

**Mac:**
- Press `Command + Space`
- Type `terminal` and press Enter

### Step 2: Navigate to the Project Folder

**IMPORTANT**: The project is already on your computer at `/home/user/EnsConf`

In your terminal, type:

```bash
cd /home/user/EnsConf
```

Press Enter.

### Step 3: Install Dependencies

This downloads all the code libraries the app needs. Type:

```bash
npm install
```

Press Enter and wait. This might take 5-10 minutes. You'll see lots of text scrolling. This is normal!

**What to expect:**
- You'll see progress bars
- Lines of text will appear
- Eventually, it will stop and show you a new prompt

---

## 4️⃣ Configuring Authentication (Clerk)

Clerk handles user login. You need to create a FREE account.

### Step 1: Create a Clerk Account

1. Go to https://clerk.com
2. Click "Start building for free"
3. Sign up with your email or Google account
4. Verify your email

### Step 2: Create a New Application

1. Once logged in, click "+ Create Application"
2. Name it: `Garage Dashboard`
3. Enable **Google** as a sign-in method
4. Click "Create Application"

### Step 3: Get Your API Keys

1. You'll see a screen with code
2. Look for two keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)
3. **Keep this page open!** You'll need these keys in the next step

### Step 4: Configure Environment Variables

1. In your terminal, make sure you're still in `/home/user/EnsConf`

2. Type this command to create your configuration file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Now you need to edit this file.

**On Windows:**
   ```bash
   notepad .env.local
   ```

**On Mac:**
   ```bash
   open -e .env.local
   ```

4. The file will open in a text editor. You'll see:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/garage-config?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
GITHUB_TOKEN=ghp_your_token_here
```

5. Replace the Clerk keys:
   - Copy your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from Clerk dashboard
   - Paste it after the `=` sign (replacing `pk_test_your_key_here`)
   - Do the same for `CLERK_SECRET_KEY`

6. **Important**: Don't change `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_SOCKET_URL` yet!

7. **Save the file** (`Ctrl+S` on Windows, `Command+S` on Mac)

8. **Close the text editor**

---

## 5️⃣ Setting Up Database (MongoDB Atlas)

MongoDB Atlas is a FREE cloud database.

### Step 1: Create MongoDB Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Fill in your details
4. Click "Create Account"

### Step 2: Create a Free Cluster

1. Choose **M0 FREE** tier
2. Cloud Provider: **AWS** (default is fine)
3. Region: Choose one closest to you
4. Cluster Name: `GarageCluster` (or leave default)
5. Click **"Create Cluster"** (bottom right)
6. Wait 1-3 minutes for cluster to be created

### Step 3: Create Database User

1. Click "Database Access" in left sidebar
2. Click "+ ADD NEW DATABASE USER"
3. Username: `garageuser`
4. Password: Click "Autogenerate Secure Password"
5. **COPY THIS PASSWORD!** Save it somewhere safe!
6. Scroll down and click "Add User"

### Step 4: Allow Network Access

1. Click "Network Access" in left sidebar
2. Click "+ ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE"
4. Click "Confirm"

### Step 5: Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Click "Drivers"
4. Copy the connection string (looks like `mongodb+srv://garageuser:<password>@...`)
5. **Important**: Replace `<password>` with the password you copied earlier

### Step 6: Add to .env.local

1. Open `.env.local` again:

   **Windows:**
   ```bash
   notepad .env.local
   ```

   **Mac:**
   ```bash
   open -e .env.local
   ```

2. Find the line:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster...
   ```

3. Replace it with your connection string from MongoDB

4. **Save and close**

---

## 6️⃣ Running the Application

### Step 1: Start Both Servers

You need to run TWO things at the same time:
1. The **frontend** (what you see in browser)
2. The **backend** (the server)

Luckily, we have one command that starts both!

In your terminal (still in `/home/user/EnsConf`), type:

```bash
npm run dev:all
```

Press Enter.

**What you'll see:**
- Lots of text will appear
- Look for these messages:
  ```
  🚀 Server running on port 3001
  ✓ Ready in 3.2s
  ```
- The terminal will stay open with text. **This is normal - don't close it!**

### Step 2: Open in Browser

1. Open your web browser (Chrome, Firefox, etc.)
2. Go to: **http://localhost:3000**
3. You should see the futuristic landing page!

### Step 3: Sign In

1. Click "Launch Dashboard"
2. Click "Sign in with Google" or create an account
3. You'll be redirected to the dashboard!

---

## 7️⃣ Using the Application

### Create Your First Garage:

1. Click the "New Garage" button
2. Fill in:
   - **Garage Name**: e.g., "Downtown Parking"
   - **Number of Levels**: Use slider (1-10)
   - **Spots per Level**: e.g., 50
   - **Entrances**: e.g., 2
   - **Exits**: e.g., 2
3. Click "Next"

### Build in 3D:

1. You'll see a 3D view of your garage
2. On the right panel:
   - Select "Camera" or "Sensor"
   - For cameras, enter IP address
   - Click "Add to Scene"
3. Use mouse to:
   - **Rotate**: Click and drag
   - **Zoom**: Scroll wheel
   - **Pan**: Right-click and drag
4. Click "Next" when done

### Review and Save:

1. Review your configuration
2. Click "Create Garage"
3. You'll be redirected to the dashboard
4. Your garage now appears as a card!

---

## 8️⃣ Stopping the Application

When you're done:

1. Go to the terminal window where the app is running
2. Press `Ctrl + C` (Windows/Mac/Linux)
3. Type `Y` if asked to confirm
4. The servers will stop
5. You can close the terminal

**To start again later:**
1. Open terminal
2. `cd /home/user/EnsConf`
3. `npm run dev:all`

---

## 🐛 Troubleshooting

### Problem: "command not found: npm"
**Solution:** Node.js isn't installed. Go back to Step 2.

### Problem: Port 3000 is already in use
**Solution:**
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Problem: "Cannot connect to MongoDB"
**Solution:**
- Check your MongoDB connection string in `.env.local`
- Make sure you replaced `<password>` with actual password
- The app will work without MongoDB (uses in-memory storage)

### Problem: White screen in browser
**Solution:**
1. Press `F12` in browser to open Developer Tools
2. Look at "Console" tab for errors
3. Try clearing cache: `Ctrl + Shift + Delete`

### Problem: Clerk authentication not working
**Solution:**
- Check that Clerk keys in `.env.local` are correct
- Make sure you copied the full keys (they're long!)
- Try creating a new application in Clerk dashboard

### Problem: 3D scene not loading
**Solution:**
- Wait 10-15 seconds, it takes time to load
- Refresh the page
- Try a different browser (Chrome works best)

---

## 🚀 Next Steps

Once running successfully:

1. **Explore Features:**
   - Create multiple garages
   - Edit configs with Monaco Editor
   - Export configs as YAML/JSON

2. **Deploy Online (Advanced):**
   - Deploy frontend to Vercel (free)
   - Deploy backend to Railway or Render (free tier)
   - Instructions: See DEPLOYMENT.md (coming soon)

3. **GitHub Integration:**
   - Create a GitHub personal access token
   - Add it to `.env.local`
   - Push configs directly to GitHub

---

## 📞 Getting Help

If you're stuck:

1. Read error messages carefully
2. Google the error message
3. Check that all steps were followed exactly
4. Make sure both servers are running
5. Try restarting everything

---

## 🎉 Congratulations!

You've successfully set up a modern, full-stack web application! This is a real achievement, especially if you're new to coding.

**What you've learned:**
- How to use the terminal/command prompt
- How to install Node.js
- How to work with environment variables
- How to set up cloud services (Clerk, MongoDB)
- How to run a web application

**You're now running:**
- A Next.js React application
- An Express.js server
- Real-time Socket.io connections
- 3D rendering with Three.js
- Cloud authentication
- Cloud database

That's pretty impressive! 🎊
