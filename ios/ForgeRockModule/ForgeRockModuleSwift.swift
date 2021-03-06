//
//  ForgeRockModuleSwift.swift
//  Bookeep
//
//  Copyright (c) 2021 ForgeRock. All rights reserved.
//
//  This software may be modified and distributed under the terms
//  of the MIT license. See the LICENSE file for details.
//

import Foundation
import FRAuth
import FRCore
import UIKit

@objc(ForgeRockModuleSwift)
public class ForgeRockModuleSwift: NSObject {
  var currentNode: Node?
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc func frAuthStart() {
    // Set log level according to your needs
    FRLog.setLogLevel([.all])
    
    do {
      try FRAuth.start()
    }
    catch {
      FRLog.e(error.localizedDescription)
    }
  }
  
  @objc(loginWithoutUI:rejecter:)
  func loginWithoutUI(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    FRUser.login { (user, node, error) in
      self.handleNode(user, node, error, resolve: resolve, rejecter: reject)
    }
  }
  
  @objc(registerWithoutUI:rejecter:)
  func registerWithoutUI(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    FRUser.register { (user, node, error) in
      self.handleNode(user, node, error, resolve: resolve, rejecter: reject)
    }
  }
  
  @objc(loginWithBrowser:rejecter:)
  func loginWithBrowser(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let keyWindow = UIApplication.shared.windows.filter {$0.isKeyWindow}.first
      
      if var topController = keyWindow?.rootViewController {
        while let presentedViewController = topController.presentedViewController {
          topController = presentedViewController
        }
        FRUser.browser()?
          .set(presentingViewController: topController)
          .set(browserType: .authSession)
          .build().login { (user, error) in
            if let error = error {
              //Send the error back in the rejecter - nextStep.type === 'LoginFailure'
              reject("Error", "LoginFailure", error)
              return
            }
            //Transform the response for the nextStep.type === 'LoginSuccess'
            let encoder = JSONEncoder()
            encoder.outputFormatting = .prettyPrinted
            if let user = user, let token = user.token, let data = try? encoder.encode(token), let jsonAccessToken = String(data: data, encoding: .utf8) {
              resolve(["type": "LoginSuccess", "sessionToken": jsonAccessToken])
            } else {
              resolve(["type": "LoginSuccess", "sessionToken": ""])
            }
          }
      } else {
        reject("error", "Top Controller not found", nil)
      }
    }
  }
  
  @objc(getDeviceInformation:rejecter:)
  func getDeviceInformation(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let _ = FRDevice.currentDevice else {
      // If SDK is not initialized, then don't perform
      FRLog.e("FRDevice.currentDevice does not exist - SDK not initialized")
      reject("error", "FRDevice.currentDevice does not exist - SDK not initialized", nil)
      return
    }
    
    FRDeviceCollector.shared.collect { (result) in
      FRLog.i("\(result)")
      resolve([result])
    }
  }
  
  @objc func next(_ response: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let decoder = JSONDecoder()
    let jsonData = Data(response.utf8)
    if let node = self.currentNode {
      var responseObject: Response?
      do {
        responseObject = try decoder.decode(Response.self, from: jsonData)
      } catch  {
        print(String(describing: error))
        reject("Error", "UnkownError", error)
      }
      
      let callbacksArray = responseObject!.callbacks ?? []
      // If the array is empty there are no user inputs. This can happen in callbacks like the DeviceProfileCallback, that do not require user interaction.
      // Other callbacks like SingleValueCallback, will return the user inputs in an array of dictionaries [[String:String]] with the keys: identifier and text
      if callbacksArray.count == 0 {
        for nodeCallback in node.callbacks {
          if let thisCallback = nodeCallback as? DeviceProfileCallback {
            let semaphore = DispatchSemaphore(value: 1)
            semaphore.wait()
            thisCallback.execute { _ in
              semaphore.signal()
            }
          }
        }
      } else {
        for (outerIndex, nodeCallback) in node.callbacks.enumerated() {
          if let thisCallback = nodeCallback as? KbaCreateCallback {
            for (innerIndex, rawCallback) in callbacksArray.enumerated() {
              if let inputsArray = rawCallback.input, outerIndex == innerIndex {
                for input in inputsArray {
                  if let value = input.value!.value as? String {
                    if input.name.contains("question") {
                      thisCallback.setQuestion(value)
                    } else {
                      thisCallback.setAnswer(value)
                    }
                  }
                }
              }
            }
          }
          if let thisCallback = nodeCallback as? SingleValueCallback {
            for (innerIndex, rawCallback) in callbacksArray.enumerated() {
              if let inputsArray = rawCallback.input, outerIndex == innerIndex, let value = inputsArray.first?.value {
                switch value.originalType {
                case .String:
                  thisCallback.setValue(value.value as! String)
                case .Int:
                  thisCallback.setValue(value.value as! Int)
                case .Double:
                  thisCallback.setValue(value.value as! Double)
                case .Bool:
                  thisCallback.setValue(value.value as! Bool)
                default:
                  break
                }
                
              }
            }
          }
        }
      }
      
      //Call node.next
      node.next(completion: { (user: FRUser?, node, error) in
        if let node = node {
          //Handle node and return
          self.handleNode(user, node, error, resolve: resolve, rejecter: reject)
        } else {
          if let error = error {
            //Send the error back in the rejecter - nextStep.type === 'LoginFailure'
            reject("Error", "LoginFailure", error)
            return
          }
          //Transform the response for the nextStep.type === 'LoginSuccess'
          let encoder = JSONEncoder()
          encoder.outputFormatting = .prettyPrinted
          if let user = user, let token = user.token, let data = try? encoder.encode(token), let jsonAccessToken = String(data: data, encoding: .utf8) {
            resolve(["type": "LoginSuccess", "sessionToken": jsonAccessToken])
          } else {
            resolve(["type": "LoginSuccess", "sessionToken": ""])
          }
        }
      })
      
    } else {
      reject("Error", "UnkownError", nil)
    }
  }
  
  @objc func performUserLogout() {
    FRUser.currentUser?.logout()
  }
  
  @objc(getUserInfo:rejecter:)
  func getUserInfo(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    guard let user = FRUser.currentUser else {
      // If no currently authenticated user is found, log error
      FRLog.e("FRDevice.currentDevice does not exist - SDK not initialized")
      reject("error", "FRDevice.currentDevice does not exist - SDK not initialized", nil)
      return
    }
    
    // If FRUser.currentUser exists, perform getUserInfo
    user.getUserInfo { (userInfo, error) in
      if let error = error {
        FRLog.e(String(describing: error))
        reject("error", error.localizedDescription, error)
      }
      else if let userInfo = userInfo {
        FRLog.i(userInfo.debugDescription)
        resolve(userInfo.userInfo)
      }
      else {
        FRLog.e("Invalid state: UserInfo returns no result")
        reject("error", "Invalid state: UserInfo returns no result", nil)
      }
    }
  }
  
  @objc(getAccessToken:rejecter:)
  func getAccessToken(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    guard let user = FRUser.currentUser else {
      // If no currently authenticated user is found, log error
      FRLog.e("FRDevice.currentDevice does not exist - SDK not initialized")
      reject("error", "FRDevice.currentDevice does not exist - SDK not initialized", nil)
      return
    }
    
    // If FRUser.currentUser exists, perform getAccessToken
    user.getAccessToken { user, error in
      if let error = error {
        FRLog.e(String(describing: error))
        reject("error", error.localizedDescription, error)
      }
      else if let user = user, let accessToken = user.token {
        let encoder = JSONEncoder()
        do {
          let data = try encoder.encode(accessToken)
          let string = String(data: data, encoding: .utf8)
          FRLog.i(string ?? "Encoding of Token failed")
          resolve(string)
        } catch {
          reject("Error", "Serializing Node failed", nil)
        }
      }
      else {
        FRLog.e("Invalid state: UserInfo returns no result")
        reject("error", "Invalid state: UserInfo returns no result", nil)
      }
    }
  }
  
  private func handleNode(_ result: Any?, _ node: Node?, _ error: Error?, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if let node = node {
      self.currentNode = node
      let frNode = FRNode(node: node)
      let encoder = JSONEncoder()
      do {
        let data = try encoder.encode(frNode)
        let string = String(data: data, encoding: .utf8)
        resolve(string)
      } catch {
        reject("Error", "Serializing Node failed", nil)
      }
    } else {
      reject("Error", "No node present", nil)
    }
  }
}

public struct FRNode: Encodable {
  var callbacks: [FRCallback]
  
  var authId: String
  /// Unique UUID String value of initiated AuthService flow
  var authServiceId: String
  /// Stage attribute in Page Node
  var stage: String?
  /// Header attribute in Page Node
  var pageHeader: String?
  /// Description attribute in Page Node
  var pageDescription: String?
  
  init(node: Node) {
    authId = node.authId
    authServiceId = node.authServiceId
    stage = node.stage
    pageHeader = node.pageHeader
    pageDescription = node.pageDescription
    callbacks = [FRCallback]()
    for callback in node.callbacks {
      callbacks.append(FRCallback(callback: callback))
    }
  }
}

public struct FRCallback: Encodable {
  var type: String
  var prompt: String?
  var choices: [String]?
  var predefinedQuestions: [String]?
  var inputNames: [String]?
  
  /// Raw JSON response of Callback
  var response: String
  
  init(callback: Callback) {
    self.type = callback.type
    
    if let thisCallback = callback as? SingleValueCallback {
      self.prompt = thisCallback.prompt
      self.inputNames = [thisCallback.inputName!]
    }
    
    if let thisCallback = callback as? KbaCreateCallback {
      self.prompt = thisCallback.prompt
      self.predefinedQuestions = thisCallback.predefinedQuestions
      self.inputNames = thisCallback.inputNames
    }
    
    if let thisCallback = callback as? ChoiceCallback {
      self.choices = thisCallback.choices
      self.inputNames = [thisCallback.inputName!]
    }
    
    if let jsonData = try? JSONSerialization.data(withJSONObject: callback.response, options: .prettyPrinted), let jsonString = String(data: jsonData, encoding: .utf8) {
      self.response = jsonString
    } else {
      self.response = ""
    }
  }
}

public struct Response: Codable {
  var authId: String?
  var callbacks: [RawCallback]?
  var status: Int?
}

public struct RawCallback: Codable {
  var type: String?
  var input: [RawInput]?
  var _id: Int?
}

public struct RawInput: Codable {
  var name: String
  var value: FlexibleType?
}

public struct FlexibleType: Codable {
  let value: Any
  let originalType: ResponseType
  
  enum ResponseType {
    case String
    case Int
    case Double
    case Bool
    case TypeMismatch
    case NotSet
  }
  
  init(_ value: String) {
    self.value = value
    self.originalType = .NotSet
  }
  
  public init(from decoder: Decoder) throws {
    let container = try decoder.singleValueContainer()
    // attempt to decode from all JSON primitives
    if let str = try? container.decode(String.self) {
      value = str
      originalType = .String
    } else if let int = try? container.decode(Int.self) {
      value = int
      originalType = .Int
    } else if let double = try? container.decode(Double.self) {
      value = double
      originalType = .Double
    } else if let bool = try? container.decode(Bool.self) {
      value = bool
      originalType = .Bool
    } else {
      originalType = .TypeMismatch
      throw DecodingError.typeMismatch(String.self, .init(codingPath: decoder.codingPath, debugDescription: ""))
    }
  }
  
  public func encode(to encoder: Encoder) throws {
    var container = encoder.singleValueContainer()
    switch originalType {
    case .String:
      try container.encode(value as! String)
    case .Int:
      try container.encode(value as! Int)
    case .Double:
      try container.encode(value as! Double)
    case .Bool:
      try container.encode(value as! Bool)
    default:
      throw EncodingError.invalidValue(value, EncodingError.Context(codingPath: [], debugDescription: "Invalid JSON value"))
    }
    
  }
}
