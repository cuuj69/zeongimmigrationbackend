import aws from "aws-sdk";
import {Route, Tags, Post, Body} from "tsoa";
import setResponse from "../../helpers/setResponse";
import validateInput from "../../helpers/validateInput";
import * as dotenv from "dotenv";
dotenv.config();

const region = `${process.env.REGION}`;
const cognito = new aws.CognitoIdentityServiceProvider({
  region: region,
});
type signUpInputType = {
  email: string;
  password: string;
};

interface createUser {
  UserPoolId: string;
  Username: string;
  UserAttributes: Array<any>;
  MessageAction: string;
}

interface createPassword {
  Password: string;
  UserPoolId: string;
  Username: string;
  Permanent: boolean;
}

@Route("register")
@Tags("signup")
export default class UserSignUp {
  email: string;
  password: string;
  UserPoolId: string;
  constructor(@Body() email: string, password: string) {
    this.email = email;
    this.password = password;
    this.UserPoolId = `${process.env.COGNITO_USER_POOL_ID}`;
  }

  @Post("/")
  async register() {
    // check
    // console.log(this.email, this.password);
    const isValid = validateInput(this.email, this.password);
    if (!isValid)
      return setResponse(400, {
        message:
          "email or password is invalid, password should be greater than 6 characters",
      });
    // initiate params
    const params: createUser = {
      UserPoolId: this.UserPoolId,
      Username: this.email,
      UserAttributes: [
        {
          Name: "email",
          Value: this.email,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
        {
          Name: "custom:role",
          Value: "studentConsultant",
        },
      ],
      MessageAction: "SUPPRESS",
    };
    // create user
    try {
      const response = await cognito.adminCreateUser(params).promise();
      if (response.User) {
        const paramsForSetPass: createPassword = {
          Password: this.password,
          UserPoolId: this.UserPoolId,
          Username: this.email,
          Permanent: true,
        };
        await cognito.adminSetUserPassword(paramsForSetPass).promise();
        return setResponse(200, {
          message: "User registration successful",
        });
      }
    } catch (err) {
      if (err) {
        return setResponse(err.statusCode, {
          message: err.message,
        });
      }
    }
  }
}
