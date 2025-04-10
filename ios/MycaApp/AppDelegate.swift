import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase

import UserNotifications
import RNCPushNotificationIOS

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "MycaApp"
    self.dependencyProvider = RCTAppDependencyProvider()
    // Initialize Firebase
    FirebaseApp.configure()  // ✅ Add this line

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    let center = UNUserNotificationCenter.current()
    center.delegate = self

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  // Called when successfully registered for remote notifications
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    RNCPushNotificationIOS.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
  }

  // Called when failed to register
  override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
   // RNCPushNotificationIOS.didFailToRegisterForRemoteNotifications(withError: error)
  }

  // Called when a remote notification is received
  override func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any],
                   fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    RNCPushNotificationIOS.didReceiveRemoteNotification(userInfo, fetchCompletionHandler: completionHandler)
  }

  // Called when a notification is tapped by the user
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
    RNCPushNotificationIOS.didReceive(response)
    completionHandler()
  }

  // Called when a notification is delivered to a foreground app
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.alert, .sound, .badge])
  }
}
