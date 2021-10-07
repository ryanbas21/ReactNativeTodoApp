/*
 * Copyright (c) 2019 - 2021 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

package com.reactnativetodosampleapp;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.gson.Gson;

import org.forgerock.android.auth.AccessToken;
import org.forgerock.android.auth.FRAuth;
import org.forgerock.android.auth.FRDevice;
import org.forgerock.android.auth.FRListener;
import org.forgerock.android.auth.FRSession;
import org.forgerock.android.auth.FRUser;
import org.forgerock.android.auth.Logger;
import org.forgerock.android.auth.Node;
import org.forgerock.android.auth.NodeListener;
import org.forgerock.android.auth.UserInfo;
import org.forgerock.android.auth.callback.AbstractPromptCallback;
import org.forgerock.android.auth.callback.ChoiceCallback;
import org.forgerock.android.auth.callback.DeviceProfileCallback;
import org.forgerock.android.auth.callback.KbaCreateCallback;
import org.forgerock.android.auth.callback.NameCallback;
import org.forgerock.android.auth.callback.PasswordCallback;
import org.forgerock.android.auth.exception.AuthenticationRequiredException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;
import java.sql.Struct;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.concurrent.Semaphore;


public class ForgeRockModule extends ReactContextBaseJavaModule {
    ReactApplicationContext context;
    Node currentNode;
    NodeListener listener;
    Callback reactNativeCallback;
    Promise reactNativePromise;

    ForgeRockModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @Override
    public String getName() {
        return "ForgeRockModule";
    }


    @ReactMethod
    public void frAuthStart() {
        Logger.set(Logger.Level.DEBUG);
        FRAuth.start(this.context);
    }

    @ReactMethod
    public void performUserLogout() {
        FRUser user = FRUser.getCurrentUser();
        if (user != null) {
            user.logout();
        }
    }

    @ReactMethod
    public void loginWithoutUI(Promise promise) {
        try{
            customLogin(promise);
        }catch (Exception e){
            promise.reject("error", e.toString(), e);
        }
    }

    @ReactMethod
    public void authenticateWithTree(String tree, Callback cb) {
        try{
            reactNativeCallback = cb;
            treeLogin(tree);
        }catch (Exception e){
            cb.invoke(e.toString(), null);
        }
    }

    @ReactMethod
    public void loginWithBrowser(Promise promise) {
        launchBrowser(promise);
    }

    @ReactMethod
    public void getDeviceInformation(Promise promise) {
        FRDevice.getInstance().getProfile(new FRListener<JSONObject>() {
            @Override
            public void onSuccess(JSONObject result) {
                WritableMap productMap = null;
                try {
                    Gson gson = new Gson();
                    String jsonStr = gson.toJson(result);
                    productMap = convertJsonToMap(new
                            JSONObject(jsonStr));
                    promise.resolve(productMap);
                } catch (JSONException e) {
                    Logger.error("error", e, "getDeviceInformation Failed");
                    promise.reject("error", e.getMessage(), e);
                }
            }

            @Override
            public void onException(Exception e) {
                Logger.warn("getDeviceInformation", e, "Failed to retrieve device profile");
                promise.reject("error", e.getMessage(), e);
            }
        });
    }

    @ReactMethod
    public void getAccessToken(Promise promise) {
        this.reactNativePromise = promise;
        if (FRUser.getCurrentUser() != null) {
            FRUser.getCurrentUser().getAccessToken(new FRListener<AccessToken>() {
                @Override
                public void onSuccess(AccessToken result) {
                    Gson gson = new Gson();
                    String accessTokenJson = gson.toJson(result);
                    reactNativePromise.resolve(accessTokenJson);
                }

                @Override
                public void onException(Exception e) {
                    reactNativePromise.reject("error", e.getMessage(), e);
                }
            });
        } else {
            Logger.error("error", "Current user is null. Not logged in or SDK not initialized yet");
            reactNativePromise.reject("error", "Current user is null. Not logged in or SDK not initialized yet");
        }
    }

    @ReactMethod
    public void getUserInfo(Promise promise) {
        if (FRUser.getCurrentUser() != null) {
            FRUser.getCurrentUser().getUserInfo(new FRListener<UserInfo>() {
                @Override
                public void onSuccess(final UserInfo result) {
                    WritableMap productMap = null;
                    JSONObject jsonResult = result.getRaw();
                    try {
                        productMap = convertJsonToMap(jsonResult);
                        promise.resolve(productMap);
                    } catch (JSONException e) {
                        Logger.error("error", e, "getUserInfo Failed");
                        promise.reject("error", e.getMessage(), e);
                    }
                }

                @Override
                public void onException(final Exception e) {
                    Logger.error("error", e, "getUserInfo Failed");
                    promise.reject("error", e.getMessage(), e);
                }
            });
        } else {
            Logger.error("error", "Current user is null. Not logged in or SDK not initialized yet");
            promise.reject("error", "Current user is null. Not logged in or SDK not initialized yet");
        }
    }

    @ReactMethod
    public void next(String response, Promise promise) throws InterruptedException {
        this.reactNativePromise = promise;
        Gson gson= new Gson();
        Response responseObj = gson.fromJson(response,Response.class);
        if (responseObj != null) {
            if (responseObj.callbacks.isEmpty()) {
                for (org.forgerock.android.auth.callback.Callback callback : currentNode.getCallbacks()) {
                    String currentCallbackType = callback.getType();
                    if (currentCallbackType.equals("DeviceProfileCallback")) {
                        final Semaphore available = new Semaphore(1, true);
                        available.acquire();
                        currentNode.getCallback(DeviceProfileCallback.class).execute(context, new FRListener<Void>() {
                            @Override
                            public void onSuccess(Void result) {
                                Logger.warn("DeviceProfileCallback", "Device Profile Collection Succeeded");
                                available.release();
                            }

                            @Override
                            public void onException(Exception e) {
                                Logger.warn("DeviceProfileCallback", e, "Device Profile Collection Failed");
                                available.release();
                            }
                        });
                    }
                }
            } else {
                for (Object nodeCallback : currentNode.getCallbacks()) {
                    if (nodeCallback instanceof AbstractPromptCallback) {
                        for (RawCallback callback : responseObj.callbacks) {
                            String currentCallbackType = callback.type;
                            RawInput input = callback.input.get(0);
                            if ((currentCallbackType.equals("NameCallback"))) {
                                currentNode.getCallback(NameCallback.class).setName((String) input.value);
                            }
                            if ((currentCallbackType.equals("PasswordCallback"))) {
                                String password = (String) input.value;
                                currentNode.getCallback(PasswordCallback.class).setPassword(password.toCharArray());
                            }
                            if ((currentCallbackType.equals("ChoiceCallback"))) {
                                currentNode.getCallback(ChoiceCallback.class).setSelectedIndex((Integer) input.value);
                            }
                        }
                    }
                }

            }
        } else {
            promise.reject("error", "parsing response failed");
        }

        currentNode.next(this.context, listener);
    }

    public void customLogin(Promise promise) {
        this.reactNativePromise = promise;
        NodeListener<FRUser> nodeListenerFuture = new NodeListener<FRUser>() {
            @Override
            public void onSuccess(FRUser user) {
                final AccessToken accessToken;
                WritableMap map = Arguments.createMap();
                try {
                    accessToken = FRUser.getCurrentUser().getAccessToken();
                    Gson gson = new Gson();
                    String accessTokenJson = gson.toJson(accessToken);
                    map.putString("type", "LoginSuccess");
                    map.putString("sessionToken", accessTokenJson);
                    reactNativePromise.resolve(map);
                } catch (AuthenticationRequiredException e) {
                    Logger.warn("customLogin", e, "Login Failed");
                    reactNativePromise.reject("error", e.getLocalizedMessage(), e);
                }
            }

            @Override
            public void onException(Exception e) {
                // Handle Exception
                Logger.warn("customLogin", e, "Login Failed");
                reactNativePromise.reject("error", e.getLocalizedMessage(), e);
            }

            @Override
            public void onCallbackReceived(Node node) {
                listener = this;
                currentNode = node;
                FRNode frNode = new FRNode(node);
                Gson gson = new Gson();
                String json = gson.toJson(frNode);
                reactNativePromise.resolve(json);
            }
        };

        FRUser.login(this.context, nodeListenerFuture);
    }

    public void launchBrowser(Promise promise) {
        MainActivity activity = (MainActivity) getCurrentActivity();
        activity.reactNativePromise = promise;
        activity.centralizedLogin();
    }

    public void treeLogin(String tree) {
        NodeListener<FRSession> nodeListenerFuture = new NodeListener<FRSession>() {
            @Override
            public void onSuccess(FRSession token) {
                final AccessToken accessToken;
                WritableMap map = Arguments.createMap();
                try {
                    accessToken = FRUser.getCurrentUser().getAccessToken();
                    Gson gson = new Gson();
                    String json = gson.toJson(accessToken);
                    map.putString("accessToken", json);
                    reactNativeCallback.invoke(map);
                } catch (AuthenticationRequiredException e) {
                    Logger.warn("treeLogin", e, "Login Failed");
                    map.putString("error", e.getLocalizedMessage());
                    reactNativeCallback.invoke(map);
                }
            }

            @Override
            public void onException(Exception e) {
                // Handle Exception
                Logger.warn("treeLogin", e, "Login Failed");
                WritableMap map = Arguments.createMap();
                map.putString("error", e.getLocalizedMessage());
                reactNativeCallback.invoke(map);
            }

            @Override
            public void onCallbackReceived(Node node) {
                listener = this;
                currentNode = node;
                WritableMap callbacksMap = Arguments.createMap();
                LinkedHashMap<String, WritableMap> linkedMap = new LinkedHashMap<String, WritableMap>();
                for (org.forgerock.android.auth.callback.Callback callback : node.getCallbacks()) {
                    WritableMap map = Arguments.createMap();
                    switch (callback.getType()) {
                        case "NameCallback":
                            NameCallback nameCallback = node.getCallback(NameCallback.class);
                            map.putString("prompt",nameCallback.prompt);
                            map.putString("type",nameCallback.getType());
                            linkedMap.put("NameCallback", map);
                            break;
                        case "PasswordCallback":
                            PasswordCallback passwordCallback = node.getCallback(PasswordCallback.class);
                            map.putString("prompt",passwordCallback.prompt);
                            map.putString("type",passwordCallback.getType());
                            linkedMap.put("PasswordCallback", map);
                            break;
                        case "ChoiceCallback":
                            ChoiceCallback choiceCallback = node.getCallback(ChoiceCallback.class);
                            map.putString("prompt",choiceCallback.prompt);
                            map.putString("type",choiceCallback.getType());
                            String[] choices = choiceCallback.getChoices().toArray(new String[0]);
                            WritableArray array = Arguments.fromArray(choices);
                            map.putArray("choices", array);
                            linkedMap.put("ChoiceCallback", map);
                            break;
                        case "DeviceProfileCallback":
                            DeviceProfileCallback deviceCallback = node.getCallback(DeviceProfileCallback.class);
                            map.putString("type",deviceCallback.getType());
                            linkedMap.put("DeviceProfileCallback", map);
                            break;
                    }
                }
                String[] keys = linkedMap.keySet().toArray(new String[linkedMap.size()]);
                for (int i = keys.length - 1; i >= 0; i--) {
                    callbacksMap.putMap(keys[i], linkedMap.get(keys[i]));
                }
                reactNativeCallback.invoke(callbacksMap);

            }
        };

        FRSession.authenticate(context, tree, nodeListenerFuture);
    }

    private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof  Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof  Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String)  {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    private static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
        WritableArray array = new WritableNativeArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof JSONObject) {
                array.pushMap(convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof  Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof  Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String)  {
                array.pushString((String) value);
            } else {
                array.pushString(value.toString());
            }
        }
        return array;
    }

    private static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMapToJson(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArrayToJson(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }

    private static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray array = new JSONArray();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    array.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    array.put(readableArray.getDouble(i));
                    break;
                case String:
                    array.put(readableArray.getString(i));
                    break;
                case Map:
                    array.put(convertMapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    array.put(convertArrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return array;
    }
}

class FRNode {
    List<FRCallback> callbacks;

    private String authId;
    /// Unique UUID String value of initiated AuthService flow
    private String authServiceId;
    /// Stage attribute in Page Node
    private String stage;
    /// Header attribute in Page Node
    private String pageHeader;
    /// Description attribute in Page Node
    private String pageDescription;

    public FRNode(Node node) {
        this.authId = node.getAuthId();
        this.authServiceId = node.getAuthServiceId();
        this.stage = node.getStage();
        this.pageHeader = node.getHeader();
        this.pageDescription = node.getDescription();
        this.callbacks = new ArrayList<FRCallback>();
        for (org.forgerock.android.auth.callback.Callback callback: node.getCallbacks()) {
            this.callbacks.add(new FRCallback(callback));
        }
    }

    public List<FRCallback> getCallbacks() {
        return callbacks;
    }

    public void setCallbacks(List<FRCallback> callbacks) {
        this.callbacks = callbacks;
    }

    public String getAuthId() {
        return authId;
    }

    public void setAuthId(String authId) {
        this.authId = authId;
    }

    public String getAuthServiceId() {
        return authServiceId;
    }

    public void setAuthServiceId(String authServiceId) {
        this.authServiceId = authServiceId;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getPageHeader() {
        return pageHeader;
    }

    public void setPageHeader(String pageHeader) {
        this.pageHeader = pageHeader;
    }

    public String getPageDescription() {
        return pageDescription;
    }

    public void setPageDescription(String pageDescription) {
        this.pageDescription = pageDescription;
    }

}

class FRCallback {
    private String type;
    private String prompt;
    private List<String> choices;
    private List<String> predefinedQuestions;
    private List<String> inputNames;

    /// Raw JSON response of Callback
    private String response;

    public FRCallback(org.forgerock.android.auth.callback.Callback callback) {
        this.type = callback.getType();
        this.inputNames = new ArrayList<String>();

        if (callback instanceof AbstractPromptCallback) {
            AbstractPromptCallback abstractPromptCallback = (AbstractPromptCallback) callback;
            this.prompt = abstractPromptCallback.prompt;
        }

        if (callback instanceof KbaCreateCallback) {
            KbaCreateCallback kbaCreateCallback = (KbaCreateCallback) callback;
            this.prompt = kbaCreateCallback.getPrompt();
            this.predefinedQuestions = kbaCreateCallback.getPredefinedQuestions();
        }

        if (callback instanceof ChoiceCallback) {
            ChoiceCallback choiceCallback = (ChoiceCallback) callback;
            this.prompt = choiceCallback.getPrompt();
            this.choices = choiceCallback.getChoices();
        }

        this.response = callback.getContent();
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public List<String> getChoices() {
        return choices;
    }

    public void setChoices(List<String> choices) {
        this.choices = choices;
    }

    public List<String> getPredefinedQuestions() {
        return predefinedQuestions;
    }

    public void setPredefinedQuestions(List<String> predefinedQuestions) {
        this.predefinedQuestions = predefinedQuestions;
    }

    public List<String> getInputNames() {
        return inputNames;
    }

    public void setInputNames(List<String> inputNames) {
        this.inputNames = inputNames;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}

class Response {
    String authId;
    List<RawCallback> callbacks;
    Integer status;
}

class RawCallback {
    String type;
    List<RawInput> input;
    Integer _id;
}

class RawInput {
    String name;
    Object value;
}