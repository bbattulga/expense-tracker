
const {exec} = require('child_process');

let json = `{
    "scripts": {
      "start": "react-native start",
      "android": "react-native run-android",
      "ios": "react-native run-ios",
      "web": "expo start --web"
    },
    "dependencies": {
      "expo": "~38.0.8",
      "expo-splash-screen": "^0.5.0",
      "expo-status-bar": "^1.0.2",
      "expo-updates": "~0.2.10",
      "react": "~16.11.0",
      "react-dom": "~16.11.0",
      "react-native": "~0.62.2",
      "react-native-gesture-handler": "~1.6.0",
      "react-native-reanimated": "~1.9.0",
      "react-native-screens": "~2.9.0",
      "react-native-unimodules": "~0.10.1",
      "react-native-web": "~0.11.7",
      "@react-native-community/async-storage": "~1.11.0",
      "@react-native-community/masked-view": "0.1.10",
      "@react-navigation/bottom-tabs": "^5.8.0",
      "@react-navigation/drawer": "^5.9.0",
      "@react-navigation/native": "^5.7.3",
      "@react-navigation/stack": "^5.9.0",
      "babel-plugin-inline-dotenv": "^1.6.0",
      "bcrypt": "^5.0.0",
      "expo-crypto": "~8.2.1",
      "expo-font": "~8.2.1",
      "expo-localization": "~8.2.1",
      "expo-sqlite": "~8.2.1",
      "faker": "^5.1.0",
      "fiction-expo-restart": "^1.0.4",
      "i18n-js": "^3.7.1",
      "moment": "^2.27.0",
      "native-base": "^2.13.14",
      "native-base-shoutem-theme": "^0.3.1",
      "react-native-chart-kit": "^6.6.1",
      "react-native-restart": "^0.0.17",
      "react-native-safe-area-context": "~3.0.7",
      "react-native-svg": "12.1.0",
      "react-native-vector-icons": "^7.0.0"
    },
    "devDependencies": {
      "@babel/core": "^7.8.6",
      "babel-jest": "~25.2.6",
      "jest": "~25.2.6",
      "react-test-renderer": "~16.11.0",
      "babel-preset-expo": "~8.1.0"
    },
    "private": true,
    "name": "expense-tracker",
    "version": "1.0.0"
  }`;

function exec_cmd(command){
    exec(command, (error, stdout, stderr) => {
        if (error){
            console.log(error.message);
            return;
        }

        if (stderr){
            console.log(stderr);
            return;
        }

        console.log(stdout);
    });
}
var package = JSON.parse(json);

var dep = [];
for (let pkg in package['dependencies']){
    dep.push(pkg);
}
var ddep = [];
for (let pkg in package['devDependencies']){
    ddep.push(pkg);
}

for (let pkg of dep){
  let comd = `npm install --save ${pkg}`;
  exec_cmd(comd);
}
for (let pkg of ddep){
  let comd = `npm install --save-dev ${pkg}`;
  exec_cmd(comd);
}