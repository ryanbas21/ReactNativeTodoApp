//
//  ForgeRockModuleSwift.m
//  Bookeep
//
//  Copyright (c) 2021 ForgeRock. All rights reserved.
//
//  This software may be modified and distributed under the terms
//  of the MIT license. See the LICENSE file for details.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_REMAP_MODULE(ForgeRockModule, ForgeRockModuleSwift, NSObject)

//Used in the ReactNative Sample
RCT_EXTERN_METHOD(frAuthStart)
RCT_EXTERN_METHOD(loginWithoutUI: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(next: (NSString *)response resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(performUserLogout)
RCT_EXTERN_METHOD(getUserInfo: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getAccessToken: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

//Not used in the ReactNative Sample
RCT_EXTERN_METHOD(loginWithBrowser: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getDeviceInformation: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end

