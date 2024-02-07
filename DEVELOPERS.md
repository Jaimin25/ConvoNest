# Local development

1. Fork the repo

2. Clone your GitHub forked repo:

   ```sh
   git clone https://github.com/<github_username>/ConvoNest.git
   ```

3. Go to the ConvoNest directory:

   ```sh
   cd ConvoNest
   ```

4. Install dependencies

   ```sh
   npm install
   ```

5. Create a .env file in the root folder, refer to .env.example file.

6. Next, you will need to setup a backend server for socket.io which will enable realtime in the application.
   Follow the steps from [here](https://github.com/Jaimin25/convonest-backend) to locally setup a backend server for the same.

7. After setting up backend server. Run the app with the following:

   ```sh
   npm run dev
   ```
