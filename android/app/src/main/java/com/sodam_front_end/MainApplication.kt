package com.sodam_front_end

import android.app.Application
import com.facebook.react.*
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader


class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost: ReactNativeHost? by lazy {
        if (!BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            object : DefaultReactNativeHost(this) {
                override fun getPackages(): List<ReactPackage> =
                    PackageList(this).packages

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
                    override fun getPackages(): List<ReactPackage> =
                        PackageList(this).packages

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
