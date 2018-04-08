# Crebits Nativescript

App screenshots @ [Google Play App Details](https://play.google.com/store/apps/details?id=com.ananapps.crebits&hl=en)

Crebits is a Personal Finance app for Android.\
It has been designed to really simplify our daily lives by anticipating monthly expenses.\
Categorize your expenses and export the synthesis by email at the end of the month!\
This application does not require any connection. Data is stored locally on the phone.

Please, report any bug in order to make the application better.

## Requirements

All dependencies are described in the `package.json` file

- Nativescript 3.3.1
- Android emulator (Android Studio)

## Debug

### Clean workspace

```
cd src
npm cache clean --force
tns platform remove android
npm install
tns platform add android
```

### Build & Run

```
cd src
tns run android
```

## Release

### Clean workspace

```
cd src
npm cache clean --force
tns platform remove android
npm install
tns platform add android
```

### Build & Run

```
cd src
npm run start-android-bundle
```

### Build Release APK

```
cd src
npm run build-android-bundle --uglify --snapshot -- --release --key-store-path F:\Dev\GITHUB\crebits-nativescript\src\crebits.jks --key-store-password <PASSWORD> --key-store-alias Crebits --key-store-alias-password <PASSWORD>
```

APK in **F:\Dev\GITHUB\crebits-nativescript\src\platforms\android\build\outputs\apk**

## Tips

### Install TNS 3.3.1

```
cd src
npm install -g nativescript@3.3.1
tns platform remove android
tns platform add android
npm install tns-core-modules@3.3.0 --save
```

### Android SDK > Accept licenses

```
C:\Android\sdk\tools\bin\sdkmanager --licenses
```

### Error "Cannot resolve ./vendor"

```
cd src
tns install nativescript-dev-webpack
```
