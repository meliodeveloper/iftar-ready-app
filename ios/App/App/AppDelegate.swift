import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        NotificationCenter.default.addObserver(forName: NSNotification.Name("CAPNotificationName"), object: nil, queue: .main) { _ in }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            func findWebView(in view: UIView) -> WKWebView? {
                if let webView = view as? WKWebView { return webView }
                for subview in view.subviews {
                    if let found = findWebView(in: subview) { return found }
                }
                return nil
            }
            if let navController = self.window?.rootViewController as? UINavigationController {
                navController.interactivePopGestureRecognizer?.isEnabled = true
                navController.interactivePopGestureRecognizer?.delegate = nil
            }
            if let rootView = self.window?.rootViewController?.view,
               let webView = findWebView(in: rootView) {
                webView.scrollView.bounces = true
                webView.scrollView.alwaysBounceVertical = true
                webView.scrollView.showsVerticalScrollIndicator = false

                let isDarkMode = self.window?.traitCollection.userInterfaceStyle == .dark
                let bgColor = isDarkMode
                    ? UIColor(red: 0.039, green: 0.059, blue: 0.118, alpha: 1.0)
                    : UIColor(red: 0.980, green: 0.976, blue: 0.969, alpha: 1.0)
                webView.scrollView.backgroundColor = bgColor
                webView.backgroundColor = bgColor

                NotificationCenter.default.addObserver(forName: UIApplication.didBecomeActiveNotification, object: nil, queue: .main) { _ in
                    let isDark = self.window?.traitCollection.userInterfaceStyle == .dark
                    let color = isDark
                        ? UIColor(red: 0.039, green: 0.059, blue: 0.118, alpha: 1.0)
                        : UIColor(red: 0.980, green: 0.976, blue: 0.969, alpha: 1.0)
                    webView.scrollView.backgroundColor = color
                    webView.backgroundColor = color
                }
            }
        }
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
