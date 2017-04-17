#!/bin/sh

echo "[ LQDI-BUILDBOT ] Scaffolding environment...";
mv src/env_api_root.ts src/env_api_root.bck.ts
cp src/env_api_root_release.ts src/env_api_root.ts

echo "[ LQDI-BUILDBOT ] Cleaning Cordova builds...";
cordova clean

echo "[ LQDI-BUILDBOT ] Building IOS...";
rm ./release/ios-release-ready.ipa
ionic build ios --device --release
cp ./platforms/ios/build/device/Busca\ Ativa\ Escolar.ipa ./release/ios-release-ready.ipa

echo "iOS Package generation done! Uploading iOS IPA to Itunes Connect..."
altool --upload-app -f ./platforms/ios/build/device/Busca\ Ativa\ Escolar.ipa -u buildbot@lqdi.net -p p8HDjI4jTWw5

echo "[ LQDI-BUILDBOT ] Building ANDROID...";
rm ./release/android-release-pending.apk
rm ./release/android-release-ready.apk
ionic build android --device --release

echo "[ LQDI-BUILDBOT ] Signing APK for ANDROID...";
cp ./platforms/android/build/outputs/apk/android-release-unsigned.apk ./release/android-release-pending.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -tsa https://freetsa.org/tsr -keystore ~/Dropbox/SSH/google_play_keystore.jks -storepass ":%_x3^1%._Q49%1m" -keypass "#eYYG%+ISH5w" ./release/android-release-pending.apk busca-ativa-escolar_2017
zipalign -v 4 ./release/android-release-pending.apk ./release/android-release-ready.apk

echo "[ LQDI-BUILDBOT ] De-scaffolding environment...";
rm src/env_api_root.ts
mv src/env_api_root.bck.ts src/env_api_root.ts

echo "[ LQDI-BUILDBOT ] Done! Now you must upload the APK to Play Store and update the current used build for TestFlight/GA in Itunes Connect."
