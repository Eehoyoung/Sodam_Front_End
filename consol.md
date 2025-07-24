1. npm react-native run-android

-"C:\Program Files\nodejs\node.exe" C:
\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules\@react-native-community\cli\build\bin.js start
error Failed to load configuration of your project.
Error [ERR_INTERNAL_ASSERTION]: Unexpected module status 5. Cannot require() ES Module C:
\Users\LeeHoYoung\Desktop\Sodam_Front_End\react-native.config.js because it is not yet fully loaded. This may be caused
by a race condition if the module is simultaneously dynamically import()-ed via Promise.all(). Try await-ing the
import() sequentially in a loop instead. (from C:
\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules\cosmiconfig\dist\loaders.js)
This is caused by either a bug in Node.js or incorrect usage of Node.js internals.
Please open an issue with this stack trace at https://github.com/nodejs/node/issues

    at Function.fail (node:internal/assert:17:9)
    at ModuleLoader.importSyncForRequire (node:internal/modules/esm/loader:404:16)
    at loadESMFromCJS (node:internal/modules/cjs/loader:1561:24)
    at Module._compile (node:internal/modules/cjs/loader:1712:5)
    at Object..js (node:internal/modules/cjs/loader:1895:10)
    at Module.load (node:internal/modules/cjs/loader:1465:32)
    at Function._load (node:internal/modules/cjs/loader:1282:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
    at Module.require (node:internal/modules/cjs/loader:1487:12)

2. gradle build

> Task :gradle-plugin:settings-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :gradle-plugin:shared:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :gradle-plugin:settings-plugin:pluginDescriptors UP-TO-DATE
> Task :gradle-plugin:settings-plugin:processResources UP-TO-DATE
> Task :gradle-plugin:shared:compileKotlin UP-TO-DATE
> Task :gradle-plugin:shared:compileJava NO-SOURCE
> Task :gradle-plugin:shared:processResources NO-SOURCE
> Task :gradle-plugin:shared:classes UP-TO-DATE
> Task :gradle-plugin:shared:jar UP-TO-DATE
> Task :gradle-plugin:settings-plugin:compileKotlin UP-TO-DATE
> Task :gradle-plugin:settings-plugin:compileJava NO-SOURCE
> Task :gradle-plugin:settings-plugin:classes UP-TO-DATE
> Task :gradle-plugin:settings-plugin:jar UP-TO-DATE
> Task :gradle-plugin:react-native-gradle-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :gradle-plugin:react-native-gradle-plugin:compileKotlin UP-TO-DATE
> Task :gradle-plugin:react-native-gradle-plugin:compileJava NO-SOURCE
> Task :gradle-plugin:react-native-gradle-plugin:pluginDescriptors UP-TO-DATE
> Task :gradle-plugin:react-native-gradle-plugin:processResources UP-TO-DATE
> Task :gradle-plugin:react-native-gradle-plugin:classes UP-TO-DATE
> Task :gradle-plugin:react-native-gradle-plugin:jar UP-TO-DATE

> Configure project :react-native-reanimated
> Android gradle plugin: 8.9.2
> Gradle: 8.14.1

> Configure project :react-native-vision-camera
[VisionCamera] Thank you for using VisionCamera ❤️
[VisionCamera] If you enjoy using VisionCamera, please consider sponsoring this
> project: https://github.com/sponsors/mrousavy
[VisionCamera] node_modules found at C:\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules
[VisionCamera] VisionCamera_enableFrameProcessors is set to true!
[VisionCamera] react-native-worklets-core found, Frame Processors are enabled!
[VisionCamera] VisionCamera_enableCodeScanner is set to true!

> Task :prepareKotlinBuildScriptModel UP-TO-DATE
> C/C++: VisionCamera: Frame Processors: ON!
> C/C++: VisionCamera: Linking react-native-worklets...
> C/C++: CMake Error at CMakeLists.txt:83 (find_package):
> C/C++:   Could not find a package configuration file provided by
> C/C++:   "react-native-worklets-core" with any of the following names:
> C/C++:     react-native-worklets-coreConfig.cmake
> C/C++:     react-native-worklets-core-config.cmake
> C/C++:   Add the installation prefix of "react-native-worklets-core" to
> C/C++:   CMAKE_PREFIX_PATH or set "react-native-worklets-core_DIR" to a directory
> C/C++:   containing one of the above files. If "react-native-worklets-core"
> C/C++:   provides a separate development package or SDK, be sure it has been
> C/C++:   installed.
[CXX1429] error when building with cmake using C:
> \Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules\react-native-vision-camera\android\CMakeLists.txt: -- The C
> compiler identification is Clang 18.0.1
> -- The CXX compiler identification is Clang 18.0.1
> -- Detecting C compiler ABI info
> -- Detecting C compiler ABI info - done
> -- Check for working C compiler: C:
> /Users/LeeHoYoung/AppData/Local/Android/Sdk/ndk/27.0.12077973/toolchains/llvm/prebuilt/windows-x86_64/bin/clang.exe -
> skipped
> -- Detecting C compile features
> -- Detecting C compile features - done
> -- Detecting CXX compiler ABI info
> -- Detecting CXX compiler ABI info - done
> -- Check for working CXX compiler: C:
>
/Users/LeeHoYoung/AppData/Local/Android/Sdk/ndk/27.0.12077973/toolchains/llvm/prebuilt/windows-x86_64/bin/clang++.exe -
> skipped
> -- Detecting CXX compile features
> -- Detecting CXX compile features - done
> -- Configuring incomplete, errors occurred!
> See also "C:
>
/Users/LeeHoYoung/Desktop/Sodam_Front_End/node_modules/react-native-vision-camera/android/.cxx/Debug/345o5j4r/x86/CMakeFiles/CMakeOutput.log".

C++ build system [configure] failed while executing:
@echo off
"C:\\Users\\LeeHoYoung\\AppData\\Local\\Android\\Sdk\\cmake\\3.22.1\\bin\\cmake.exe" ^
"-HC:\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules\\react-native-vision-camera\\android" ^
"-DCMAKE_SYSTEM_NAME=Android" ^
"-DCMAKE_EXPORT_COMPILE_COMMANDS=ON" ^
"-DCMAKE_SYSTEM_VERSION=24" ^
"-DANDROID_PLATFORM=android-24" ^
"-DANDROID_ABI=x86" ^
"-DCMAKE_ANDROID_ARCH_ABI=x86" ^
"-DANDROID_NDK=C:\\Users\\LeeHoYoung\\AppData\\Local\\Android\\Sdk\\ndk\\27.0.12077973" ^
"-DCMAKE_ANDROID_NDK=C:\\Users\\LeeHoYoung\\AppData\\Local\\Android\\Sdk\\ndk\\27.0.12077973" ^
"-DCMAKE_TOOLCHAIN_FILE=C:
\\Users\\LeeHoYoung\\AppData\\Local\\Android\\Sdk\\ndk\\27.0.12077973\\build\\cmake\\android.toolchain.cmake" ^
"-DCMAKE_MAKE_PROGRAM=C:\\Users\\LeeHoYoung\\AppData\\Local\\Android\\Sdk\\cmake\\3.22.1\\bin\\ninja.exe" ^
"-DCMAKE_CXX_FLAGS=-O2 -frtti -fexceptions -Wall -Wno-unused-variable -fstack-protector-all" ^
"-DCMAKE_LIBRARY_OUTPUT_DIRECTORY=C:
\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules\\react-native-vision-camera\\android\\build\\intermediates\\cxx\\Debug\\345o5j4r\\obj\\x86" ^
"-DCMAKE_RUNTIME_OUTPUT_DIRECTORY=C:
\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules\\react-native-vision-camera\\android\\build\\intermediates\\cxx\\Debug\\345o5j4r\\obj\\x86" ^
"-DCMAKE_BUILD_TYPE=Debug" ^
"-DCMAKE_FIND_ROOT_PATH=C:
\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules\\react-native-vision-camera\\android\\.cxx\\Debug\\345o5j4r\\prefab\\x86\\prefab" ^
"-BC:
\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules\\react-native-vision-camera\\android\\.cxx\\Debug\\345o5j4r\\x86" ^
-GNinja ^
"-DANDROID_STL=c++_shared" ^
"-DNODE_MODULES_DIR=C:\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules" ^
"-DENABLE_FRAME_PROCESSORS=ON" ^
"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON"
from C:\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules\react-native-vision-camera\android
VisionCamera: Frame Processors: ON!
VisionCamera: Linking react-native-worklets...
CMake Error at CMakeLists.txt:83 (find_package):
Could not find a package configuration file provided by
"react-native-worklets-core" with any of the following names:

    react-native-worklets-coreConfig.cmake
    react-native-worklets-core-config.cmake

Add the installation prefix of "react-native-worklets-core" to
CMAKE_PREFIX_PATH or set "react-native-worklets-core_DIR" to a directory
containing one of the above files. If "react-native-worklets-core"
provides a separate development package or SDK, be sure it has been
installed. : com.android.ide.common.process.ProcessException: -- The C compiler identification is Clang 18.0.1
-- The CXX compiler identification is Clang 18.0.1
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Check for working C compiler: C:
/Users/LeeHoYoung/AppData/Local/Android/Sdk/ndk/27.0.12077973/toolchains/llvm/prebuilt/windows-x86_64/bin/clang.exe -
skipped
-- Detecting C compile features
-- Detecting C compile features - done
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: C:
/Users/LeeHoYoung/AppData/Local/Android/Sdk/ndk/27.0.12077973/toolchains/llvm/prebuilt/windows-x86_64/bin/clang++.exe -
skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Configuring incomplete, errors occurred!
See also "C:
/Users/LeeHoYoung/Desktop/Sodam_Front_End/node_modules/react-native-vision-camera/android/.cxx/Debug/345o5j4r/x86/CMakeFiles/CMakeOutput.log".

C++ build system [configure] failed while executing:
@echo off
"C:\\Users\\LeeHoYoung\\AppData\\Local\\Android\\Sdk\\cmake\\3.22.1\\bin\\cmake.exe" ^
"-HC:\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules\\react-native-vision-camera\\android" ^
"-DCMAKE_SYSTEM_NAME=Android" ^
"-DCMAKE_EXPORT_COMPILE_COMMANDS=ON" ^
"-DCMAKE_SYSTEM_VERSION=24" ^
"-DANDROID_PLATFORM=android-24" ^
"-DANDROID_ABI=x86" ^
"-DCMAKE_ANDROID_ARCH_ABI=x86" ^
"-DANDROID_NDK=C:\\Users\\LeeHoYoung\\AppData\\Local\\Android\\Sdk\\ndk\\27.0.12077973" ^
"-DCMAKE_ANDROID_NDK=C:\\Users\\LeeHoYoung\\AppData\\Local\\Android\\Sdk\\ndk\\27.0.12077973" ^
"-DCMAKE_TOOLCHAIN_FILE=C:
\\Users\\LeeHoYoung\\AppData\\Local\\Android\\Sdk\\ndk\\27.0.12077973\\build\\cmake\\android.toolchain.cmake" ^
"-DCMAKE_MAKE_PROGRAM=C:\\Users\\LeeHoYoung\\AppData\\Local\\Android\\Sdk\\cmake\\3.22.1\\bin\\ninja.exe" ^
"-DCMAKE_CXX_FLAGS=-O2 -frtti -fexceptions -Wall -Wno-unused-variable -fstack-protector-all" ^
"-DCMAKE_LIBRARY_OUTPUT_DIRECTORY=C:
\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules\\react-native-vision-camera\\android\\build\\intermediates\\cxx\\Debug\\345o5j4r\\obj\\x86" ^
"-DCMAKE_RUNTIME_OUTPUT_DIRECTORY=C:
\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules\\react-native-vision-camera\\android\\build\\intermediates\\cxx\\Debug\\345o5j4r\\obj\\x86" ^
"-DCMAKE_BUILD_TYPE=Debug" ^
"-DCMAKE_FIND_ROOT_PATH=C:
\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules\\react-native-vision-camera\\android\\.cxx\\Debug\\345o5j4r\\prefab\\x86\\prefab" ^
"-BC:
\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules\\react-native-vision-camera\\android\\.cxx\\Debug\\345o5j4r\\x86" ^
-GNinja ^
"-DANDROID_STL=c++_shared" ^
"-DNODE_MODULES_DIR=C:\\Users\\LeeHoYoung\\Desktop\\Sodam_Front_End\\node_modules" ^
"-DENABLE_FRAME_PROCESSORS=ON" ^
"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON"
from C:\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules\react-native-vision-camera\android
VisionCamera: Frame Processors: ON!
VisionCamera: Linking react-native-worklets...
CMake Error at CMakeLists.txt:83 (find_package):
Could not find a package configuration file provided by
"react-native-worklets-core" with any of the following names:

    react-native-worklets-coreConfig.cmake
    react-native-worklets-core-config.cmake

Add the installation prefix of "react-native-worklets-core" to
CMAKE_PREFIX_PATH or set "react-native-worklets-core_DIR" to a directory
containing one of the above files. If "react-native-worklets-core"
provides a separate development package or SDK, be sure it has been
installed.
at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt.execute(ExecuteProcess.kt:288)
at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt$executeProcess$1.invoke(ExecuteProcess.kt:108)
at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt$executeProcess$1.invoke(ExecuteProcess.kt:106)
at com.android.build.gradle.internal.cxx.timing.TimingEnvironmentKt.time(TimingEnvironment.kt:32)
at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt.executeProcess(ExecuteProcess.kt:106)
at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt.executeProcess$default(ExecuteProcess.kt:85)
at com.android.build.gradle.tasks.CmakeQueryMetadataGenerator.executeProcess(CmakeFileApiMetadataGenerator.kt:59)
at com.android.build.gradle.tasks.ExternalNativeJsonGenerator$configureOneAbi$1$
1$3.invoke(ExternalNativeJsonGenerator.kt:247)
at com.android.build.gradle.tasks.ExternalNativeJsonGenerator$configureOneAbi$1$
1$3.invoke(ExternalNativeJsonGenerator.kt:247)
at com.android.build.gradle.internal.cxx.timing.TimingEnvironmentKt.time(TimingEnvironment.kt:32)
at com.android.build.gradle.tasks.ExternalNativeJsonGenerator.configureOneAbi(ExternalNativeJsonGenerator.kt:247)
at com.android.build.gradle.tasks.ExternalNativeJsonGenerator.configure(ExternalNativeJsonGenerator.kt:113)
at com.android.build.gradle.internal.ide.v2.NativeModelBuilder.generateBuildFilesAndCompileCommandsJson(NativeModelBuilder.kt:204)
at com.android.build.gradle.internal.ide.v2.NativeModelBuilder.buildAll(NativeModelBuilder.kt:169)
at com.android.build.gradle.internal.ide.v2.NativeModelBuilder.buildAll(NativeModelBuilder.kt:56)
at org.gradle.tooling.provider.model.internal.DefaultToolingModelBuilderRegistry$BuilderWithParameter.build(
DefaultToolingModelBuilderRegistry.java:293)
at org.gradle.tooling.provider.model.internal.DefaultToolingModelBuilderRegistry$UserCodeAssigningBuilder.lambda$
build$0(DefaultToolingModelBuilderRegistry.java:378)
at org.gradle.internal.code.DefaultUserCodeApplicationContext$CurrentApplication.reapply(
DefaultUserCodeApplicationContext.java:110)
at
org.gradle.tooling.provider.model.internal.DefaultToolingModelBuilderRegistry$UserCodeAssigningBuilder.build(DefaultToolingModelBuilderRegistry.java:378)
at org.gradle.tooling.provider.model.internal.DefaultToolingModelBuilderRegistry$LockSingleProjectBuilder.lambda$build$
0(DefaultToolingModelBuilderRegistry.java:308)
at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.lambda$
fromMutableState$2(DefaultProjectStateRegistry.java:458)
at org.gradle.internal.work.DefaultWorkerLeaseService.withReplacedLocks(DefaultWorkerLeaseService.java:359)
at org.gradle.api.internal.project.DefaultProjectStateRegistry$ProjectStateImpl.fromMutableState(
DefaultProjectStateRegistry.java:458)
at
org.gradle.tooling.provider.model.internal.DefaultToolingModelBuilderRegistry$LockSingleProjectBuilder.build(DefaultToolingModelBuilderRegistry.java:308)
at org.gradle.tooling.provider.model.internal.DefaultToolingModelBuilderRegistry$
BuildOperationWrappingBuilder$1.call(DefaultToolingModelBuilderRegistry.java:341)
at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(
DefaultBuildOperationRunner.java:210)
at
org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:205)
at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:67)
at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:60)
at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:167)
at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:60)
at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:54)
at org.gradle.tooling.provider.model.internal.DefaultToolingModelBuilderRegistry$BuildOperationWrappingBuilder.build(
DefaultToolingModelBuilderRegistry.java:338)
at
org.gradle.internal.build.DefaultBuildToolingModelController$AbstractToolingScope.getModel(DefaultBuildToolingModelController.java:87)
at org.gradle.internal.buildtree.DefaultBuildTreeModelCreator$DefaultBuildTreeModelController.getModelForScope(
DefaultBuildTreeModelCreator.java:148)
at org.gradle.internal.buildtree.DefaultBuildTreeModelCreator$DefaultBuildTreeModelController.access$300(
DefaultBuildTreeModelCreator.java:70)
at org.gradle.internal.buildtree.DefaultBuildTreeModelCreator$DefaultBuildTreeModelController$1.call(
DefaultBuildTreeModelCreator.java:86)
at
org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:210)
at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(
DefaultBuildOperationRunner.java:205)
at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:67)
at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:60)
at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:167)
at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:60)
at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:54)
at
org.gradle.internal.buildtree.DefaultBuildTreeModelCreator$DefaultBuildTreeModelController.getModel(DefaultBuildTreeModelCreator.java:81)
at org.gradle.tooling.internal.provider.runner.DefaultBuildController.getModel(DefaultBuildController.java:104)
at org.gradle.tooling.internal.consumer.connection.ParameterAwareBuildControllerAdapter.getModel(ParameterAwareBuildControllerAdapter.java:40)
at org.gradle.tooling.internal.consumer.connection.UnparameterizedBuildController.getModel(UnparameterizedBuildController.java:116)
at org.gradle.tooling.internal.consumer.connection.NestedActionAwareBuildControllerAdapter.getModel(NestedActionAwareBuildControllerAdapter.java:32)
at org.gradle.tooling.internal.consumer.connection.UnparameterizedBuildController.findModel(UnparameterizedBuildController.java:100)
at org.gradle.tooling.internal.consumer.connection.NestedActionAwareBuildControllerAdapter.findModel(NestedActionAwareBuildControllerAdapter.java:32)
at com.android.tools.idea.gradle.project.sync.SyncActionRunnerKt$toMeasuringController$1.findModel$
lambda$7(SyncActionRunner.kt:295)
at com.android.tools.idea.projectsystem.gradle.sync.Counter.invoke(PerformanceMeasurementUtil.kt:108)
at com.android.tools.idea.gradle.project.sync.SyncActionRunnerKt.measure(SyncActionRunner.kt:340)
at com.android.tools.idea.gradle.project.sync.SyncActionRunnerKt.access$measure(SyncActionRunner.kt:1)
at com.android.tools.idea.gradle.project.sync.SyncActionRunnerKt$toMeasuringController$1.findModel(SyncActionRunner.kt:

295)

at com.android.tools.idea.gradle.project.sync.ActionToRun$toSafeController$1.findModel(SyncActionRunner.kt:164)
at com.android.tools.idea.gradle.project.sync.ModelFetchersKt.findNativeVariantAbiModel(ModelFetchers.kt:151)
at com.android.tools.idea.gradle.project.sync.VariantDiscovery.toFetchVariantDependenciesAction$lambda$38$lambda$36(
VariantDiscovery.kt:221)
at com.android.tools.idea.gradle.project.sync.ModelResult$Companion.create(ModelResult.kt:32)
at com.android.tools.idea.gradle.project.sync.VariantDiscovery.toFetchVariantDependenciesAction$
lambda$38(VariantDiscovery.kt:210)
at com.android.tools.idea.gradle.project.sync.ActionToRun.map$lambda$0(SyncActionRunner.kt:68)
at com.android.tools.idea.gradle.project.sync.ActionToRun.run$intellij_android_projectSystem_gradle_sync(
SyncActionRunner.kt:79)
at com.android.tools.idea.gradle.project.sync.SyncActionRunner$runActions$executionResults$1$1.execute(
SyncActionRunner.kt:240)
at
org.gradle.tooling.internal.consumer.connection.NestedActionAwareBuildControllerAdapter$1.get(NestedActionAwareBuildControllerAdapter.java:52)
at org.gradle.internal.buildtree.IntermediateBuildActionRunner$NestedAction.run(IntermediateBuildActionRunner.java:118)
at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:67)
at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:60)
at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:167)
at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:60)
at
org.gradle.internal.operations.DefaultBuildOperationExecutor$QueueWorker.execute(DefaultBuildOperationExecutor.java:161)
at org.gradle.internal.operations.DefaultBuildOperationQueue$WorkerRunnable.runOperation(
DefaultBuildOperationQueue.java:272)
at
org.gradle.internal.operations.DefaultBuildOperationQueue$WorkerRunnable.doRunBatch(DefaultBuildOperationQueue.java:253)
at org.gradle.internal.operations.DefaultBuildOperationQueue$WorkerRunnable.lambda$runBatch$1(
DefaultBuildOperationQueue.java:226)
at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:263)
at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:127)
at
org.gradle.internal.operations.DefaultBuildOperationQueue$WorkerRunnable.runBatch(DefaultBuildOperationQueue.java:224)
at org.gradle.internal.operations.DefaultBuildOperationQueue$WorkerRunnable.run(DefaultBuildOperationQueue.java:192)
at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)
at org.gradle.internal.concurrent.AbstractManagedExecutor$1.run(AbstractManagedExecutor.java:48)
at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)
at java.base/java.lang.Thread.run(Thread.java:833)
Caused by: com.android.ide.common.process.ProcessException: Error while executing process C:\Users\LeeHoYoung\AppData\Local\Android\Sdk\cmake\3.22.1\bin\cmake.exe with arguments {-HC:\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules\react-native-vision-camera\android -DCMAKE_SYSTEM_NAME=Android -DCMAKE_EXPORT_COMPILE_COMMANDS=ON -DCMAKE_SYSTEM_VERSION=24 -DANDROID_PLATFORM=android-24 -DANDROID_ABI=x86 -DCMAKE_ANDROID_ARCH_ABI=x86 -DANDROID_NDK=C:\Users\LeeHoYoung\AppData\Local\Android\Sdk\ndk\27.0.12077973 -DCMAKE_ANDROID_NDK=C:\Users\LeeHoYoung\AppData\Local\Android\Sdk\ndk\27.0.12077973 -DCMAKE_TOOLCHAIN_FILE=C:\Users\LeeHoYoung\AppData\Local\Android\Sdk\ndk\27.0.12077973\build\cmake\android.toolchain.cmake -DCMAKE_MAKE_PROGRAM=C:\Users\LeeHoYoung\AppData\Local\Android\Sdk\cmake\3.22.1\bin\ninja.exe -DCMAKE_CXX_FLAGS=-O2 -frtti -fexceptions -Wall -Wno-unused-variable -fstack-protector-all -DCMAKE_LIBRARY_OUTPUT_DIRECTORY=C:\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules\react-native-vision-camera\android\build\intermediates\cxx\Debug\345o5j4r\obj\x86 -DCMAKE_RUNTIME_OUTPUT_DIRECTORY=C:\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules\react-native-vision-camera\android\build\intermediates\cxx\Debug\345o5j4r\obj\x86 -DCMAKE_BUILD_TYPE=Debug -DCMAKE_FIND_ROOT_PATH=C:\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules\react-native-vision-camera\android\.cxx\Debug\345o5j4r\prefab\x86\prefab -BC:\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules\react-native-vision-camera\android\.cxx\Debug\345o5j4r\x86 -GNinja -DANDROID_STL=c++_shared -DNODE_MODULES_DIR=C:\Users\LeeHoYoung\Desktop\Sodam_Front_End\node_modules -DENABLE_FRAME_PROCESSORS=ON -DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON}
at com.android.build.gradle.internal.process.GradleProcessResult.buildProcessException(GradleProcessResult.java:73)
at com.android.build.gradle.internal.process.GradleProcessResult.assertNormalExitValue(GradleProcessResult.java:48)
at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt.execute(ExecuteProcess.kt:277)
... 82 more
Caused by: org.gradle.process.internal.ExecException: Process 'command 'C:\Users\LeeHoYoung\AppData\Local\Android\Sdk\cmake\3.22.1\bin\cmake.exe'' finished with non-zero exit value 1
at org.gradle.process.internal.DefaultExecHandle$ExecResultImpl.assertNormalExitValue(DefaultExecHandle.java:442)
at com.android.build.gradle.internal.process.GradleProcessResult.assertNormalExitValue(GradleProcessResult.java:46)
... 83 more

[Incubating] Problems report is available at: file:///C:
/Users/LeeHoYoung/Desktop/Sodam_Front_End/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own
scripts or plugins.

For more on this, please refer
to https://docs.gradle.org/8.14.1/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle
documentation.

BUILD SUCCESSFUL in 6s
10 actionable tasks: 10 up-to-date
