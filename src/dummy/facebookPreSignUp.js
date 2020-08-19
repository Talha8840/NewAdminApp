const AWS = require('aws-sdk');
AWS.config.region = 'ap-south-1';

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});

const documentClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-10-08',
});

const linkProviderToUser = async (
  username,
  userPoolId,
  providerName,
  providerUserId,
) => {

console.log('linkProviderToUser' , username , userPoolId , providerName , providerUserId );


  const params = {
    DestinationUser: {
      ProviderAttributeValue: username,
      ProviderName: 'Cognito',
    },
    SourceUser: {
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: providerUserId,
      ProviderName: 'Facebook',
      //the provider name from cognito is facebook and it throws an error saying source provider name not configured. so hardcoded it
    },
    UserPoolId: userPoolId,
  };

  cognitoidentityserviceprovider.adminLinkProviderForUser(
    params,
    (err, data) => {
      if (err) {
        console.log(err, 'err');;
        return;;
      }
      console.log(data, 'data');;
    }

};

const getUserByEmail = async (userPoolId, email) => {
  const params = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  };;
  return cognitoidentityserviceprovider.listUsers(params).promise();;
};

const userTable = 'User-y2ujsznearaslgmgbmbjdwkrd4-prod';
const userActivityTable = 'UserActivity-y2ujsznearaslgmgbmbjdwkrd4-prod';

module.exports.handler = async (event, context, callback) => {

    console.log(event, 'event');


    if (event.request.userAttributes["custom:skip"]){
    console.log(
      event.request.userAttributes['custom:skip'],
      'event.request.userAttributes.skip',
    );
    callback(null, event);;
    return event;;
  }

  const users = await getUserByEmail(
    event.userPoolId,
    event.request.userAttributes.email)


  const [providerName, providerUserId] = event.userName.split('_');; // event userName example: "Facebook_12324325436"

  if (users && users.Users.length > 0) {
    console.log(users.Users,'users.Users');
    console.log(providerName,'providerName');

    console.log(event.userPoolId,'event.request.userAttributes.email');
    console.log(
      event.request.userAttributes.email,
      'event.request.userAttributes.email',
    );;
    if  (providerUserId) {
      await linkProviderToUser(
        users.Users[0].Username,
        event.userPoolId,
        providerName,
        providerUserId,
      );;
      callback(null, event);;
    } else  {
      callback(null, event);;
    }


   } else {

    if (!providerUserId){
      callback(null, event);;
    } else {

    console.log(providerName,'providerName');
      console.log(event.userPoolId, 'event.request.userAttributes.email');;
      console.log(
        event.request.userAttributes.email,
        'event.request.userAttributes.email',
      );;
      console.log('user not found, skip.');;

    const userpoolParams = {
        ClientId: '3m46nrq8k24055jo9ajq01l6g1',
        //   Username: event.request.userAttributes.email,
        Username: '+91735836627',
        Password: 'Litt@123',
        UserAttributes: [
          {
            Name: 'email',
            Value: event.request.userAttributes.email,
          },
          {
            Name: 'name',
            Value: event.request.userAttributes.name,
          },
          {
            Name: 'custom:skip',
            Value: 'true',
          },
        ],
      };

      const result = await new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.signUp(userpoolParams, (err, data) => {
          if (err) {
            console.log(err, 'error');;
            reject(err);;
          }
          console.log(data, 'data from create user');;
          resolve(data);;
   });;
      });
;
    const confirmSignUpParams = {
        UserPoolId: 'ap-south-1_SUnj12pWl',
        Username: result.UserSub,,
      };;

  const confirmSignUpresult = await (new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.adminConfirmSignUp(
          confirmSignUpParams,
          (err, data) => {
            if (err) {
              console.log(err, 'error');;
              reject(err);;
            }
            console.log(data, 'data from create user');;
            resolve(data);;
     },
        );
      });

  console.log(confirmSignUpresult,'confirmSignUpresult');
    await linkProviderToUser(
        result.UserSub,
        event.userPoolId,
        providerName,
        providerUserId,
     );

      callback(null, event);
  }

};
