import AWSAppSyncClient from 'aws-appsync';
import {Auth} from 'aws-amplify';
export default () => {
  return new AWSAppSyncClient({
    url:
      'https://yyoghdmjwnhtlfkbj54x3ufaey.appsync-api.ap-south-1.amazonaws.com/graphql',
    region: 'ap-south-1',
    disableOffline: true,
    auth: {
      type: 'API_KEY',
      apiKey: 'da2-f6nf2myw5bhpplq7bc3iwkh4s4',
      jwtToken: async () =>
        (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    complexObjectsCredentials: () => Auth.currentCredentials(),
  });
};
