import {gql} from '@apollo/client';

export const CREATE_TASK = gql`
  mutation Task($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
    }
  }
`;

export const CREATE_METAWORLD = gql`
  mutation CreateMetaWorld($input: CreateMetaWorldInput!) {
    createMetaWorld(input: $input) {
      name
    }
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation Task($input: CreateUserActivityInput!) {
    createUserActivity(input: $input) {
      userId
      actionId
    }
  }
`;

export const createNewUser = gql`
  mutation CreateNewUser($name: String, $email: String, $phoneNumber: String) {
    createNewUser(name: $name, email: $email, phoneNumber: $phoneNumber) {
      data
      error
    }
  }
`;

export const UPDATE_USERATTRIBUTES = gql`
  mutation UpdateUserAttributes(
    $name: String
    $email: String
    $phoneNumber: String
    $userId: String
  ) {
    updateUserAttributes(
      name: $name
      email: $email
      phoneNumber: $phoneNumber
      userId: $userId
    ) {
      data
      error
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
      id
      endDate
      startDate
      name
      description
    }
  }
`;

export const GET_ESTIMATEDACTIONREWARDS = gql`
  mutation GetEstimatedActionRewards(
    $userLevelId: ID!
    $userXps: Int!
    $actionId: ID!
  ) {
    getEstimatedActionRewards(
      userLevelId: $userLevelId
      userXps: $userXps
      actionId: $actionId
    ) {
      data
      error
    }
  }
`;

export const CREATE_FACEBOOKUSER = gql`
  mutation AddFacebookUser($name: String, $email: String) {
    addFacebookUser(name: $name, email: $email) {
      userId
      email
      error
      newUser
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      homeCopilot
      meditationCopilot
      createIntentionCopilot
      rateIntentionCopilot
      metaEntryCopilot
      metaMainCopilot
      profileCopilot
    }
  }
`;

export const UPDATE_META_WORLD = gql`
  mutation UpdateMetaWorld(
    $input: UpdateMetaWorldInput!
    $condition: ModelMetaWorldConditionInput
  ) {
    updateMetaWorld(input: $input, condition: $condition) {
      id
      categoryId
      materialised
      description
    }
  }
`;

export const UPDATE_PHONE_NUMBER = gql`
  mutation UpdatePhoneNumber($userId: String, $phoneNumber: String) {
    updatePhoneNumber(userId: $userId, phoneNumber: $phoneNumber) {
      data
      error
    }
  }
`;

export const SCHEDULED_PUSH_NOTIFICATIONS = gql`
  mutation ScheduledPushNotification {
    scheduledPushNotification {
      date
      title
      message
    }
  }
`;
