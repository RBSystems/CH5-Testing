registerNativeFunctions();

function registerNativeFunctions() {
    window['bridgeReceiveIntegerFromNative'] = CrComLib.bridgeReceiveIntegerFromNative;
    window['bridgeReceiveBooleanFromNative'] = CrComLib.bridgeReceiveBooleanFromNative;
    window['bridgeReceiveStringFromNative'] = CrComLib.bridgeReceiveStringFromNative;
    window['bridgeReceiveObjectFromNative'] = CrComLib.bridgeReceiveObjectFromNative;
}
