# MentraOS-Cloud-Example-App

### Install MentraOS on your phone

MentraOS install links: [mentra.glass/install](https://mentra.glass/install)

### (Easiest way to get started) Set up ngrok

1. `brew install ngrok`

2. Make an ngrok account

3. [Use ngrok to make a static address/URL](https://dashboard.ngrok.com/)

### Register your App with MentraOS

1. Navigate to [console.mentra.glass](https://console.mentra.glass/)

2. Click "Sign In", and log in with the same account you're using for MentraOS

3. Click "Create App"

4. Set a unique package name like `com.yourName.yourAppName`

5. For "Public URL", enter your Ngrok's static URL

6. In the edit app screen, add the microphone permission

### Get your App running!

1. [Install bun](https://bun.sh/docs/installation)

2. Create a new repo from this template using the `Use this template` dropdown in the upper right or the following command: `gh repo create --template Mentra-Community/MentraOS-Cloud-Example-App`

    ![Create repo from template](https://github.com/user-attachments/assets/c10e14e8-2dc5-4dfa-adac-dd334c1b73a5)

3. Clone your new repo locally: `git clone <your-repo-url>`

4. cd into your repo, then type `bun install`

5. Set up your environment variables:
   * Create a `.env` file in the root directory by copying the example: `cp .env.example .env`
   * Edit the `.env` file with your app details:
     ```
     PORT=3000
     PACKAGE_NAME=com.yourName.yourAppName
     MENTRAOS_API_KEY=your_api_key_from_console
     ```
   * Make sure the `PACKAGE_NAME` matches what you registered in the MentraOS Console
   * Get your `API_KEY` from the MentraOS Developer Console

6. Run your app with `bun run dev`

7. To expose your app to the internet (and thus MentraOS) with ngrok, run: `ngrok http --url=<YOUR_NGROK_URL_HERE> 3000`
    * `3000` is the port. It must match what is in the app config. For example, if you entered `port: 8080`, use `8080` for ngrok instead.


### Next Steps

Check out the full documentation at [docs.mentra.glass](https://docs.mentra.glass/core-concepts)

#### Subscribing to events

You can listen for transcriptions, translations, and other events within the onSession function.
