# **Litt - MobileApp**

Light-Weight React Native UI library to build modern Mobile apps.

![alt text](https://github.com/pipesort/native-components/blob/npm/assets/fonts/Images/banner1.png)

## Prerequisite

- Node version - v13.7.0
- React version - 16.11.0.
- Project set up through React Native CLI
- Package manager used - yarn
- Android studio

Please refer to https://reactnative.dev/docs/environment-setup and click on the React native CLI quickstart to set up the environment in your machine.

## Project setup

- Run the command

```javascript

yarn run

```

to install the dependant packages

### To run the app in the emulator

- Run

```javascript

yarn run

```

and 

```javascript

yarn run android

```


### To run the app in the your mobile

- Run

```javascript

yarn run

```

and 

```javascript

npx react-native run-android

```

### Please refer to https://reactnative.dev/docs/running-on-device to run your react native app on your mobile.


## Build

 - Navigate to android folder 

 ```javascript

cd android

```

and run the below command to generate a build

```javascript

./gradlew assembleRelease

```

## Possible issues:

- You may come across situation where the local server is not up by running the command yarn start
 
- in such situation you can run, 

 ```javascript

yarn start --reset-cache

```

and in parallel navigato to android folder by the command cd android and run


 ```javascript

.\gradlew clean

```

 - These two commands clears the cache and clean (empty) the build directory for you.