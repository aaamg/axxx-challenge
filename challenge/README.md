Hi there! I work mainly on frontends (90% of my time) and rarely do much backend work so keep that in mind.

*Read this before starting please*
Running program on UNIX/MAC: 
Had to get this running on my home windows pc (we use windows at my current job, exuse this) so I updated the "build:server" script & tried using the latest rimraf package. 
rm -rf is a UNIX command so will not work on windows. Made a fix that works for me for now.

If I had more time I would add a "start:unix" script to go off of "build:server:unix" since my current implementation is windows only. 
I have a mac to test this but not enough time. 

# Overview
People Directory server app.

**KNOWN ISSUES**
Add UNIX start script.

Fastify / helmet / CORS version mismatch (no time to fix) -- left commented code in as this should be finished. 

index.ts ts related import error. Edit tsconfig.json file 

**IMPROVEMENTS MADE**

Started implementation of helmet for secure headers and to add protection against known vulnerabilities such as XSS. CORS for cross origin requests if needed.

Improved the overall routing logic: 
- Perform data fetching inside the req NOT at server startup. 
- Add error handling to prevent server crashes.
- Provide better feedback on failed requests.

Pulled landing page text out of the server and into a seperate file. The server file should be only server related code. The easier to read/navigate, the better! 

**TODO**
So, I have not used fastify before so I didnt have time to learn specifics but I would have liked to have added some improved logging, rate limiting, using ENV vars via 'dotenv' so we dont hardcode ports & other future sensetive data, add a server health check, fully set up helmet/cors. 

Finish caching-fetch-library functionality.



