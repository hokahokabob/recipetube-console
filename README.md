<p align="center" width="100%">
  <img src="https://github.com/hokahokabob/recipetube-console/assets/56472172/ee6a3e9b-5c4e-471b-ac0c-f937e7bd62ff" width="30%"/>
</p>

## RecipeTube Console
- Administrator application for RecipeTube.
- Served as...
  - Notifications management
- Next.js application, hosted on AWS Amplify
- From frontend, server side process will be called via next api -> Web API with FastAPI on ECS
- Crosstalks with RecipeTube DB(RDS Aurora Serverless V2)

### Frontend: Next.js & AWS Amplify
- `/typescript`
  - next.js code for the admin console.
- `/amplify`
  - environment variables
    - `NEXTAUTH_URL`: Base URL for next-auth. Same value as Amplify domain is fine.
    - `API_URL`: URL of web api to fetch/write data
  - Parameter Store in AWS Systems Manager
    - `/amplify/d15ozdq2jl125i/main/API_KEY`: `X-API-Key` header value for Web API
    - `/amplify/d15ozdq2jl125i/main/GOOGLE_CLIENT_ID`: For Google authentication
    - `/amplify/d15ozdq2jl125i/main/GOOGLE_CLIENT_SECRET`: For Google authentication
    - `/amplify/d15ozdq2jl125i/main/NEXTAUTH_SECRET`: Digest parameter for next-auth. For detail, see the official doc.
    - `RecipeTubeAdminPassword`: admin password

### :warning: [Deprecated]Backend: API Gateway & Lambda
- :warning: Lambda is replaced to FastAPI on ECS.
  - https://bitbucket.org/onokeitaro/serverside_fastapi/pull-requests/23
- `/lambda`
  - For reference about how to upload code to Lambda, see [this tutorial](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-lambda-tutorial.html)

### URL
dev: https://main.d15ozdq2jl125i.amplifyapp.com/
