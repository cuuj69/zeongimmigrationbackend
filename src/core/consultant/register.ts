import aws from "aws-sdk";
import setResponse from "../../helpers/setResponse";
import validateInput from "../../helpers/validateInput";
import * as dotenv from "dotenv";
dotenv.config();

console.log("ENVIRONMENT_VARIABLE", process.env.COGNITO_USER_POOL_ID);
const region = `${process.env.REGION}`;
const cognito = new aws.CognitoIdentityServiceProvider({
  region: region,
});

interface params {
  UserPoolId: string;
  Username: string;
  UserAttributes: Array<any>;
  MessageAction: string;
}
interface passParams {
  Password: string;
  UserPoolId: string;
  Username: string;
  Permanent: boolean;
}
export default class UserSignUp {
  email: string;
  password: string;
  UserPoolId: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.UserPoolId = `${process.env.COGNITO_USER_POOL_ID}`;
  }
  async register() {
    // check
    // console.log(this.email, this.password);
    const isValid = validateInput(this.email, this.password);
    if (!isValid) return setResponse(400, {message: "Invalid input"});
    // initiate params
    const params: params = {
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
      ],
      MessageAction: "SUPPRESS",
    };
    // create user
    const response = await cognito.adminCreateUser(params).promise();
    if (response.User) {
      const paramsForSetPass: passParams = {
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
  }
}
