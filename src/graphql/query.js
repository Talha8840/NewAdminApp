import {gql} from '@apollo/client';

export const LIST_USERS = gql`
  query users {
    listUsers {
      items {
        name
        gender
        age
        phoneNumber
        socioCoins
        Xps
        awards
      }
    }
  }
`;

export const LIST_CATEGORY = gql`
  query category {
    listCategorys {
      items {
        id
        name
        color
      }
    }
  }
`;

export const LIST_TASKS = gql`
  query ListTask {
    listTasks {
      items {
        id
        name
        category {
          name
          color
        }
        taskType
        description
        startDate
        endDate
      }
    }
  }
`;

export const LIST_METAWORLD = gql`
  query ListMetaWorlds {
    listMetaWorlds {
      items {
        name
        url
        materialisationDate
        description
      }
    }
  }
`;
export const LIST_AWARDS = gql`
  query ListAwards {
    listAwards {
      items {
        id
        name
        url
        blurredImage {
          bucket
          key
          region
        }
        blurredImageUrl
      }
    }
  }
`;
export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      url
      taskUnlocked
      homeCopilot
      meditationCopilot
      createIntentionCopilot
      rateIntentionCopilot
      metaEntryCopilot
      metaMainCopilot
      profileCopilot
      tasks(filter: {materialisationDone: {ne: true}}) {
        items {
          id
          userId
          name
          categoryId
          createdAt
          updatedAt
          category {
            name
            color
          }
          startDate
          endDate
          taskType
          description
          materialisationDone
          metaWorldId
        }
        nextToken
      }
      socioCoins
      rankId
      rank {
        name
      }
      meditationDuration
      spentCoins
      awardsCount
      Xps
      levelId
      metaWorld {
        items {
          name
        }
      }
    }
  }
`;

export const GET_ESTIMATEDACTIONREWARDS = gql`
  query GetEstimatedActionRewards(
    $userId: ID!
    $userLevelId: ID!
    $userXps: Int!
    $userSocioCoins: Int!
    $actionId: ID!
  ) {
    getEstimatedActionRewards(
      userId: $userId
      userLevelId: $userLevelId
      userXps: $userXps
      userSocioCoins: $userSocioCoins
      actionId: $actionId
    ) {
      data {
        socioCoins
        xps
        levelup
        newlevel
        isNewAward
        newAwardId
        awardData {
          id
          name
          levelId
          url
          text1
          text2
        }
      }
    }
  }
`;

export const GET_AWARD = gql`
  query GetAward($id: ID!) {
    getAward(id: $id) {
      url
      name
      text1
      text2
    }
  }
`;

export const GET_METAWORLDBYUSERID = gql`
  query MetaWorldByUserId($userId: ID!) {
    metaWorldByUserId(userId: $userId) {
      items {
        id
        name
        url
        materialisationDate
        description
        materialised
      }
    }
  }
`;

export const GET_USERAWARDSBYUSERID = gql`
  query UserAwardByUserId($userId: ID!) {
    userAwardByUserId(userId: $userId) {
      items {
        id
        userId
        awardId
      }
    }
  }
`;

export const USER_ACTIVITY_BY_USERID = gql`
  query UserActivityByUserId(
    $userId: ID
    $createdAt: ModelStringKeyConditionInput
  ) {
    UserActivityByUserId(userId: $userId, createdAt: $createdAt) {
      items {
        id
        userId
        actionId
        socioCoins
        xps
        taskId
        value
        createdAt
      }
    }
  }
`;

export const GET_LEVELS = gql`
  query GetLevel($startLevelId: ID!, $endLevelId: ID!) {
    startLevel: getLevel(id: $startLevelId) {
      id
      name
      rankId
      xpsToReach
      multiplier
      createdAt
      maxTask
      userId
      updatedAt
    }
    endLevel: getLevel(id: $endLevelId) {
      id
      name
      rankId
      xpsToReach
      multiplier
      createdAt
      maxTask
      userId
      updatedAt
    }
  }
`;

export const GET_ACTION = gql`
  query GetAction($id: ID!) {
    getAction(id: $id) {
      id
      baseCoins
      xps
    }
  }
`;

export const GET_USER_FOR_EDIT_PAGE = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      taskUnlocked
      dob
      gender
      phoneNumber
      url
      file {
        key
        bucket
        region
      }
    }
  }
`;

export const GET_WORLD = gql`
  query GetMetaWorld($id: ID!) {
    getMetaWorld(id: $id) {
      id
      userId
      name
      categoryId
      materialisationDate
      category {
        id
        name
        color
        createdAt
        updatedAt
      }
      description
      createdAt
      url
      file {
        bucket
        key
        region
      }
      updatedAt
    }
  }
`;

export const GET_CONCENTRICCALCULATION = gql`
  query ConcentricCalculation($userLevelId: ID!, $taskLength: Int) {
    concentricCalculation(userLevelId: $userLevelId, taskLength: $taskLength) {
      socioCoins
      xps
    }
  }
`;

export const GET_LEVEL = gql`
  query GetLevel($id: ID!) {
    getLevel(id: $id) {
      id
      name
      rankId
      xpsToReach
      multiplier
      createdAt
      maxTask
      userId
      updatedAt
    }
  }
`;

export const GET_LEVELSBYRANKID = gql`
  query LevelsByRankId($rankId: ID!) {
    levelsByRankId(rankId: $rankId) {
      items {
        id
      }
    }
  }
`;

export const GET_USER_NAME = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      homeCopilot
      name
    }
  }
`;
