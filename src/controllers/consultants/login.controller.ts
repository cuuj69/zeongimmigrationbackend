import aws from "aws-sdk";
import setResponse from "../../helpers/setResponse";
import {Route, Tags, Post, Body} from "tsoa";
import * as dotenv from "dotenv";
dotenv.config();

const region = `${process.env.REGION}`;
const cognito = new aws.CognitoIdentityServiceProvider({region: region});

type AuthParameters = {
  USERNAME: string;
  PASSWORD: string;
};
type logInInputType = {
  email: string;
  password: string;
};
interface login {
  AuthFlow: string;
  UserPoolId: string;
  ClientId: string;
  AuthParameters: AuthParameters;
}
interface getUserParams {
  AccessToken: string;
}

@Route("login")
@Tags("signin")
export default class UserLogin {
  email: string;
  password: string;
  cognitoUserPoolId: string;
  cognitoUserClientId: string;
  constructor(@Body() email: string, password: string) {
    this.email = email;
    this.password = password;
    this.cognitoUserPoolId = `${process.env.COGNITO_USER_POOL_ID}`;
    this.cognitoUserClientId = `${process.env.COGNITO_USER_CLIENT_ID}`;
  }

  @Post("/")
  async login() {
    const loginParams: login = {
      AuthFlow: `${process.env.AUTH_FLOW}`,
      UserPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
      ClientId: `${process.env.COGNITO_USER_CLIENT_ID}`,
      AuthParameters: {
        USERNAME: this.email,
        PASSWORD: this.password,
      },
    };
    try {
      const response = await cognito
        .adminInitiateAuth(loginParams)
        .promise();
      const accessToken = response.AuthenticationResult?.AccessToken;
      const getUserParams: any = {
        AccessToken: accessToken,
      };
      const userAttr = await cognito.getUser(getUserParams).promise();
      const attr = userAttr.$response.data?.UserAttributes;
      const role = attr?.map((role) => {
        if (role.Name == "custom:role") return role;
      });
      console.log(
        role?.filter((role) => {
          return role !== undefined;
        }),
      );
      const filteredRole = role?.filter((role) => {
        return role !== undefined;
      });
      const idToken = response.AuthenticationResult?.IdToken;
      return setResponse(200, {
        message: "Success",
        token: idToken,
        role: filteredRole,
      });
    } catch (err) {
      if (err) {
        return setResponse(err.statusCode, {
          message: err.message,
        });
      }
    }
  }
}
