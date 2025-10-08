
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

# Authentication key
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
NEXTAUTH_SECRET=

# Redirection key
NEXTAUTH_URL=<redirection-url>

# Search keys
GOOGLE_API_KEY=<api-key>
GOOGLE_CX=<cx>
```


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
