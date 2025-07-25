package com.sodam_front_end

// Manual imports for packages with disabled autolinking
import android.app.Application
import android.content.res.Configuration
import com.agontuk.RNFusedLocation.RNFusedLocationPackage
import com.facebook.react.*
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.mrousavy.camera.react.CameraPackage
import com.oblador.vectoricons.VectorIconsPackage
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage
import com.swmansion.gesturehandler.RNGestureHandlerPackage
import com.swmansion.reanimated.ReanimatedPackage
import com.swmansion.rnscreens.RNScreensPackage
import com.th3rdwave.safeareacontext.SafeAreaContextPackage
import com.worklets.WorkletsPackage
import com.zoontek.rnpermissions.RNPermissionsPackage

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
                // Manually add packages with disabled autolinking
                add(SafeAreaContextPackage())
                add(ReanimatedPackage())
                add(AsyncStoragePackage())
                add(RNDateTimePickerPackage())
                add(RNFusedLocationPackage())
                add(RNGestureHandlerPackage())
                add(RNPermissionsPackage())
                add(RNScreensPackage())
                add(VectorIconsPackage())
                add(CameraPackage())
                add(WorkletsPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
    }
}
