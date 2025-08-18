package com.sodam_front_end

import android.app.Application
import android.util.Log
import com.facebook.react.*
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

    private fun tryAddGestureHandler(packages: MutableList<ReactPackage>, archLabel: String) {
        val already = packages.any { it.javaClass.simpleName == "RNGestureHandlerPackage" }
        if (already) return
        try {
            val clazz = Class.forName("com.swmansion.gesturehandler.RNGestureHandlerPackage")
            val instance = clazz.getDeclaredConstructor().newInstance()
            if (instance is ReactPackage) {
                packages.add(instance)
                Log.d("RECOVERY", "Force-added RNGestureHandlerPackage ($archLabel)")
            }
        } catch (t: Throwable) {
            Log.w("RECOVERY", "Gesture handler package not available to add ($archLabel): ${t.message}")
        }
    }

    private fun tryAddScreensPackage(packages: MutableList<ReactPackage>, archLabel: String) {
        val already = packages.any { it.javaClass.simpleName == "RNScreensPackage" }
        if (already) return
        try {
            val clazz = Class.forName("com.swmansion.rnscreens.RNScreensPackage")
            val instance = clazz.getDeclaredConstructor().newInstance()
            if (instance is ReactPackage) {
                packages.add(instance)
                Log.d("RECOVERY", "Force-added RNScreensPackage ($archLabel)")
            }
        } catch (t: Throwable) {
            Log.w("RECOVERY", "Screens package not available to add ($archLabel): ${t.message}")
        }
    }

    private val mReactNativeHost: ReactNativeHost? by lazy {
        if (!BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            object : DefaultReactNativeHost(this) {
                override fun getPackages(): List<ReactPackage> {
                    val packages = PackageList(this).packages.toMutableList()
                    tryAddGestureHandler(packages, "old arch")
                    tryAddScreensPackage(packages, "old arch")
                    return packages
                }

                override fun getJSMainModuleName(): String = "index"

                override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

                override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            }
        } else {
            null
        }
    }

    override val reactNativeHost: ReactNativeHost
        get() = mReactNativeHost ?: throw IllegalStateException(
            "ReactNativeHost should not be used with New Architecture enabled. Use ReactHost instead."
        )

    override val reactHost: ReactHost
        get() = getDefaultReactHost(
            applicationContext,
            if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
                object : DefaultReactNativeHost(this) {
                    override fun getPackages(): List<ReactPackage> {
                        val packages = PackageList(this).packages.toMutableList()
                        tryAddGestureHandler(packages, "new arch")
                        tryAddScreensPackage(packages, "new arch")
                        return packages
                    }

                    override fun getJSMainModuleName(): String = "index"

                    override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

                    override val isNewArchEnabled: Boolean = true
                }
            } else {
                mReactNativeHost!!
            }
        )

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, OpenSourceMergedSoMapping)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            load()
        }
    }
}
