This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



# How to run

1. install npm dependencies
```
npm i
```

3. rename /copy.env to /.env
  

4. initialize sqlite (sqlite with prisma)
```
npx prisma migrate dev --name init
```

5. run dev
```
npm run dev
```


6.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.




# Reflection Questions


### What did you choose to mock the API and why?
For api endpoint, I used nextjs api routes serving sqlite db. Im not very proficient with writing api's as I'm mainly worked on frontend side.

### If you used an AI tool, what parts did it help with?
AI tools used is chatgpt and vscode copilot. Chatgpt is used extensively as Im not very familiar with "polling". Vscode copilot for writing commit messages

### What tradeoffs or shortcuts did you take?
I skipped the "cancel" button feature. I used the tailwind classes provided by chatgpt.


### What would you improve or add with more time?
I would spend more time on the UI, add process/loading indicator.

### What was the trickiest part and how did you debug it?
Trickiest part would be understanding "polling". It's my first time using this technology, and still not sure if I did it correctly.
