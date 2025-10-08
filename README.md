
<h1 align="left">
  <img src="./public/ap-bot.webp" alt="AP Bot Logo" width="40" />
  AP Bot
</h1>

_AP Bot_ is a full-stack AI chat application inspired by an obscure robot mascot from the rock band <a href="https://www.discogs.com/artist/309052-Abandoned-Pools" target="_blank" rel="noopener noreferrer">Abandoned Pools</a>. It delivers a seamless chat experience similar to ChatGPT, enhanced with integrated search functionality and dynamic image result rendering.


https://github.com/user-attachments/assets/ad28b186-a997-4640-bae9-c2228cefbf43


## Tech Stack
- **Programming language**: TypeScript
- **Fullstack framework**: React with Next.js
- **Authentication**: Google OAuth Single Sign-On
- **AI Integration**: OpenAI API using the `gpt-4` model
- **Search Integration**: Google search API with image results
- **Platform**: Deployed on Render

## Getting Started

1- Clone AP Bot
```
git clone https://github.com/SWEJaber/AB-Bot.git
```

2- Create the local env file

In the root folder of the project, run this command:
```
touch .env.local
```

3- Paste the environment variables in .env.local
```
# AI Key
OPENAI_API_KEY=<chatgpt-key>

# Authentication keys
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
NEXTAUTH_SECRET=<nextjs-secret>
NEXTAUTH_URL=<redirection-url>

# Search keys
GOOGLE_API_KEY=<api-key>
GOOGLE_CX=<cx>
```


To get `OPENAI_API_KEY`, 

   1. Visit the [OpenAPI api keys page](https://platform.openai.com/api-keys)
   2. Click "Create new secret key", this will open up a modal
   3. Name the key, then click "Create secret key"
   4. Click the copy icon, then paste the key in the `.env.local` file


To get the Google client ID and client secret:
   1. Visit the [Google cloud console authentication page](https://console.cloud.google.com/auth)
   2. Click "Create project"
   3. Write the project name and select organization
   4. Click "Create", this will take you back project overview page
   5. Click "Get started", this will take you to the project configuration:
        1. In App Information, fill the app name and email
        2. In Auidence, select "External"
        3. In Contact Information, provide your email
        4. Agree to the Google API Services: User Data Policy
        5. click "Create"
   6. Click "Create OAuth client"
        1. In Application type, select "Web application"
        2. Name the application
        3. Add `http://localhost:3000` to the Authorized JavaScript origins
        4. Add `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs
        5. Click "Create"
        6. Copy the Client ID and Client Secret from the modal and paste it into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` respectively in the env file
        7. Click Ok
        8. If the Client Secret does not appear in Step 6, then click on the project you created and you'll find the secret there
     
    




4- Run the development server
```
npm run dev
```




Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
