# Welcome to Chainge

Change is a little app I built to make AI changelogs easily creatable as well as viewable to all no matter where you are in the world. Hence the name AI + Change, chAInge :)

## Getting Started
### Public
Simply visit this [link](https://www.chainge-mocha.vercel.app) and you can view the publicly deployed version of the app.

### Run it yourself!
If you would like to run it locally, clone the repo, install all dependencies with "npm i", and run it with "npm run dev", along with that you must create keys for github Oauth, next-auth, and mongodb to store in an env.

## Stack Choices
### Primary Languages
I decided to build with NextJS and deploy with vercel since it's great for a project such as this with a smaller "backend" that can be completed with next server api routes. The vercel deployment was great since Vercel love's its NextJS, and everything is already optimized for the build.

### Services
Github Oauth - making it very easy to use and fetch your personal repos for use in the program along with next-auth for very simple integration!
MongoDB - Very easy through the use of mongoose to setup a collection and database for both the changelogs and commits for the app.

### UI/UX and Technical Choices
I decided to follow through with a very simple and easy to navigate for the user design, with a beautiful landing page and interactive carousel pieces and glowing on hover titles! This general theme is followed through with the entire app, creating a great sense of consistency, and even beauty.

There are two views, the public view which grabs all current changelogs to any repository that has been created and displays them to the user for viewing, however the user is not allowed to create new changelogs or view the commit history, which is more for the developer side.

As for the developer side it is behind an auth wall, There is a button to generate changelogs as well as a very beautiful commit line that allows you to view all commits, ( which I was very proud of :) ), once signed in, you can view all of your personal repositories, and then select whatever repo you would like to investigate more! 

#### Interesting notes
For the LLM, I decided to use groq, which was inspired by their insanely fast inference time, which allows even GIANT prompts that are coming in such as all of the git diffs going from commit to commit, to be processed within 2-4 seconds, because what user or dev wants to wait.

As for AI tools used, I utilized Cursor to make burner templates and first drafts of pages and then built them up, I also used it to debug very fast and complete grunt work tasks to be as efficient as possible, build more and ship more!!


## Closing Notes
It was a really fun build, challenged myself to work with next, though I typically work with Python + React stacks, and I ended up loving it more than expected and am definetely ready to contribute to the NextJS stack, hope you enjoy it as much as I do and looking forward to hearing back!

