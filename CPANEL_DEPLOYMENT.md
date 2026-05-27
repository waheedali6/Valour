# cPanel Deployment Guide - Next.js App

This guide explains how to deploy your Next.js application to cPanel.

## Prerequisites

- cPanel hosting account with Node.js support
- SSH access or File Manager access to cPanel
- FTP/SFTP client (FileZilla, WinSCP, etc.) or cPanel File Manager
- Build files already created (`.next` folder)

## Deployment Steps

### Step 1: Prepare Your Project

Your project directory includes:
- `.next/` - Production build (required)
- `node_modules/` - Dependencies (optional - can be reinstalled on server)
- `package.json` - Project dependencies configuration
- `public/` - Static assets
- `src/` - Source code

### Step 2: Upload to cPanel

#### Option A: Using cPanel File Manager (Recommended for beginners)

1. **Log in to cPanel**
   - Go to your hosting provider's cPanel login page
   - Enter your credentials

2. **Navigate to File Manager**
   - Click "File Manager" from the main cPanel dashboard
   - Open the `public_html` folder (default) or create a subfolder for your app

3. **Upload the Build**
   - Extract the `my-app-enhanced-build.zip` file on your local machine
   - Upload the following folders/files to your cPanel:
     - `.next/` (REQUIRED - your production build)
     - `node_modules/` (if included in zip)
     - `package.json` (REQUIRED)
     - `public/` (if you have static assets)
     - `.env.local` (if needed - create in cPanel)

4. **Upload Structure in cPanel**
   ```
   public_html/
   ├── .next/
   ├── node_modules/
   ├── public/
   ├── package.json
   └── .env.local (optional)
   ```

#### Option B: Using FTP/SFTP

1. **Connect via FTP/SFTP Client**
   - Open your FTP client (FileZilla, WinSCP, etc.)
   - Host: Your domain or FTP server address
   - Username: Your cPanel FTP username
   - Password: Your FTP password
   - Port: 21 (FTP) or 22 (SFTP)

2. **Navigate to `public_html` folder**

3. **Upload the same files as Option A**

### Step 3: Install Dependencies (if not uploaded)

1. **Access Terminal in cPanel**
   - Log in to cPanel
   - Click "Terminal" (under "Advanced" or search for it)

2. **Navigate to your project folder**
   ```bash
   cd ~/public_html
   # or if in a subdirectory:
   cd ~/public_html/your-app-folder
   ```

3. **Install production dependencies**
   ```bash
   npm install --production
   ```
   
   This installs only the packages needed to run the app, not development dependencies.

### Step 4: Create Environment Variables

1. **In cPanel Terminal, create `.env.local` file:**
   ```bash
   nano .env.local
   ```

2. **Add your environment variables:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```

3. **Save the file:**
   - Press `Ctrl + X`
   - Press `Y` to confirm
   - Press `Enter` to save

### Step 5: Configure Node.js App in cPanel

1. **Go to cPanel Dashboard**

2. **Find and click "Node.js Manager"** or **"Node.js App"**
   - Different cPanel versions have different names
   - Look under "Software" or "Developer" section

3. **Create a New Node.js Application**
   - **Document Root:** Select your project folder
   - **Application Root:** Same folder
   - **Application URL:** Your domain
   - **Node Version:** Choose 18.x or higher
   - **Application Startup File:** `next-server.js` or create one

4. **Create Startup File** (if needed)
   
   If `next-server.js` doesn't exist, create it in your project root:
   
   ```bash
   nano next-server.js
   ```
   
   Add this content:
   ```javascript
   const { spawn } = require('child_process');
   const server = spawn('npm', ['start'], {
     cwd: __dirname,
     stdio: 'inherit'
   });
   ```
   
   Save with `Ctrl + X` → `Y` → `Enter`

### Step 6: Set Up SSL Certificate

1. **In cPanel, find "AutoSSL" or "SSL Certificates"**
2. **Enable HTTPS for your domain**
3. **Wait for certificate activation** (usually automatic)

### Step 7: Configure npm start Script

Ensure your `package.json` has:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

The `start` script should already be configured in your project.

### Step 8: Start Your Application

1. **In cPanel Node.js Manager:**
   - Find your application
   - Click the **Start** or **Run** button

2. **Or via Terminal:**
   ```bash
   npm start
   ```

3. **Verify it's running:**
   ```bash
   curl http://localhost:3000
   # or
   wget http://localhost:3000
   ```

### Step 9: Configure Reverse Proxy (Important!)

For the app to be accessible through your domain:

1. **In cPanel, go to "Proxy" or ask your hosting provider for help**
2. **Set up a reverse proxy:**
   - Route traffic from `example.com` → `localhost:3000`

OR

3. **Use Apache configuration (if you have access to .htaccess):**
   
   Create `.htaccess` in your project root:
   ```
   <IfModule mod_proxy.c>
     ProxyPreserveHost On
     ProxyPass / http://localhost:3000/
     ProxyPassReverse / http://localhost:3000/
   </IfModule>
   ```

## Troubleshooting

### Application won't start
- Check Node.js version compatibility (needs v16+)
- Review error logs in cPanel Node.js Manager
- Ensure `.env.local` file exists with required variables

### Port 3000 is already in use
- Change the port in your startup configuration
- Or use `pkill -f "node"` to kill existing processes (use with caution)

### Cannot access the app at your domain
- Verify reverse proxy is configured
- Check that Node.js app status is "Running"
- Clear browser cache
- Check DNS propagation (may take 24 hours)

### 502 Bad Gateway error
- Restart the Node.js application
- Check if the Node.js process is running
- Review error logs in cPanel

### High resource usage
- Monitor through cPanel Resource Monitor
- Optimize your Next.js app code
- Consider upgrading hosting plan

## Helpful Commands (in cPanel Terminal)

```bash
# Navigate to your app
cd ~/public_html

# Check Node.js version
node --version

# Check npm version
npm --version

# Reinstall dependencies
npm install --production

# View running Node processes
ps aux | grep node

# Stop a Node.js app
pkill -f "node"

# Check disk space
df -h

# View recent logs
tail -f logs/next-build-id.log
```

## Important Notes

- Always use `npm install --production` on the server to save space
- Keep `.next` folder up to date with latest builds
- Monitor resource usage as Node.js apps can be resource-intensive
- Set up automated backups for your database and files
- Consider using PM2 for process management (check with your host)

## Next Steps

After successful deployment:

1. Test your application thoroughly
2. Set up monitoring and error logging
3. Configure automated backups
4. Set up a CDN for static assets (optional)
5. Monitor performance and optimize as needed

## Support

If you encounter issues:
1. Check cPanel Error Logs
2. Contact your hosting provider's support
3. Refer to Next.js documentation: https://nextjs.org/docs

---

**Build Date:** May 27, 2026
**Next.js Version:** 16.2.6
**Node.js Required:** v16 or higher
