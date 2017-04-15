#!/bin/sh
ionic build --device --release
rm ./release/android-release-pending.apk
rm ./release/android-release-ready.apk
rm ./release/ios-release-ready.ipa
cp ./platforms/ios/build/device/Busca\ Ativa\ Escolar.ipa ./release/ios-release-ready.ipa
cp ./platforms/android/build/outputs/apk/android-release-unsigned.apk ./release/android-release-pending.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -tsa http://tsa.safecreative.org -keystore ~/Dropbox/SSH/google_play_keystore.jks ./release/android-release-pending.apk busca-ativa-escolar_2017
zipalign -v 4 ./release/android-release-pending.apk ./release/android-release-ready.apk
echo "Package generation done! Uploading iOS IPA to Itunes Connect..."
altool --upload-app -f ./platforms/ios/build/device/Busca\ Ativa\ Escolar.ipa -u buildbot@lqdi.net -p p8HDjI4jTWw5
echo "Done! Now you must upload the APK to Play Store and update the current used build for TestFlight/GA in Itunes Connect."
