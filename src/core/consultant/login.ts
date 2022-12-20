import aws from "aws-sdk";
import setResponse from "../../helpers/setResponse";
import * as dotenv from "dotenv";
dotenv.config();

const region = `${process.env.REGION}`;
const cognito = new aws.CognitoIdentityServiceProvider({region: region});

type AuthParameters = {
  USERNAME: string;
  PASSWORD: string;
};
interface params {
  AuthFlow: string;
  UserPoolId: string;
  ClientId: string;
  AuthParameters: AuthParameters;
}

export default class UserLogin {
  email: string;
  password: string;
  cognitoUserPoolId: string;
  cognitoUserClientId: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.cognitoUserPoolId = `${process.env.COGNITO_USER_POOL_ID}`;
    this.cognitoUserClientId = `${process.env.COGNITO_USER_CLIENT_ID}`;
  }
  async login() {
    const params: params = {
      AuthFlow: `${process.env.AUTH_FLOW}`,
      UserPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
      ClientId: `${process.env.COGNITO_USER_CLIENT_ID}`,
      AuthParameters: {
        USERNAME: this.email,
        PASSWORD: this.password,
      },
    };
    const response = await cognito.adminInitiateAuth(params).promise();
    const token = response.AuthenticationResult?.IdToken;
    return setResponse(200, {
      message: "Success",
      token: token,
    });
  }
}
