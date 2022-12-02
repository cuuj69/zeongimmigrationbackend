This guide contains instructions to deploy the AWS cloud infrastructure that will back
the application.

Deployment Guide

Before deploying the Aws cloud infrastructure please make sure you
have servereless and Aws cli configured on your local machine. In order to
configure Aws cli follow the following steps.

1. Install Aws Cli on mac

   `brew install awscli`

2. Install Serverless globally

   `npm install -g serverless`

3. Configure Aws Cli [enter awsAccessKeyID and awsSecretKey]

   `Aws configure`

4. To deploy the infra run the following command in the
   root of the project

   `serverless deploy`

5. To destroy the infra run the following command

   `serverless remove`

Once you run the command `serverless deploy` the serverless cli looks for the `serverless.yaml`
file in the project root. This is the main script which defines all the resources to be deployed.
