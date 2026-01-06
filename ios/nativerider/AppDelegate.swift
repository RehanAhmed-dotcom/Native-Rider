import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import UserNotifications
import FBSDKCoreKit
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

 // Configure Firebase
    FirebaseApp.configure()


  // ✅ Facebook SDK setup
    ApplicationDelegate.shared.application(
      application,
      didFinishLaunchingWithOptions: launchOptions
    )

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "nativerider",
      in: window,
      launchOptions: launchOptions
    )
    // Register for Push Notifications
  registerForPushNotifications(application)

    return true
  }

   // ✅ Handle Facebook login redirect (Required)
  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    return ApplicationDelegate.shared.application(
      app,
      open: url,
      options: options
    )
  }

 // MARK: - Push Notification Methods
  
  func registerForPushNotifications(_ application: UIApplication) {
    let options: UNAuthorizationOptions = [.alert, .sound, .badge]
    UNUserNotificationCenter.current().requestAuthorization(options: options) { granted, error in
      print("Push notification permission granted: \(granted)")
      
      if granted {
        DispatchQueue.main.async {
          application.registerForRemoteNotifications()
        }
      }
      
      if let error = error {
        print("Push notification authorization error: \(error.localizedDescription)")
      }
    }
  }
  
  // Called when APNs has assigned the device a unique token
  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    // Convert token to string
    let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    print("Device Token: \(token)")
    
    // Send to React Native via notification
    NotificationCenter.default.post(
      name: Notification.Name("RCTRemoteNotificationsRegistered"), 
      object: nil, 
      userInfo: ["deviceToken": token]
    )
    
    // If using Firebase for push notifications, register the token with Firebase
    Messaging.messaging().apnsToken = deviceToken
  }
  
  // Called when APNs failed to register the device for push notifications
  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register for remote notifications: \(error.localizedDescription)")
    NotificationCenter.default.post(
      name: Notification.Name("RCTRemoteNotificationRegistrationFailed"), 
      object: nil, 
      userInfo: ["error": error.localizedDescription]
    )
  }
  
  // Handle notification when app is in foreground
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    let userInfo = notification.request.content.userInfo
    print("Received notification in foreground: \(userInfo)")
    
    // Show in foreground
    completionHandler([.banner, .badge, .sound])
  }
  
  // Handle user's response to notification
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    let userInfo = response.notification.request.content.userInfo
    print("User interacted with notification: \(userInfo)")
    
    // Forward to React Native
    NotificationCenter.default.post(
      name: Notification.Name("RCTRemoteNotificationReceived"),
      object: nil,
      userInfo: userInfo
    )
    
    completionHandler()
  }
  
  // Handle silent notifications
  func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    print("Received remote notification: \(userInfo)")
    
    // Forward to React Native
    NotificationCenter.default.post(
      name: Notification.Name("RCTRemoteNotificationReceived"),
      object: nil,
      userInfo: userInfo
    )
    
    completionHandler(.newData)
  }

}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
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
}
