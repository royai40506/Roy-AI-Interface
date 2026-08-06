package com.roy.ai.plugins;

import android.Manifest;

import android.content.Intent;
import android.provider.Settings;
import android.net.Uri;
import android.hardware.camera2.CameraManager;
import android.content.Context;

import android.content.ActivityNotFoundException;
import android.os.Build;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.JSObject;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "RoyDevice",
    permissions = {
        @Permission(
            alias = "camera",
            strings = { Manifest.permission.CAMERA }
        )
    }
)
public class RoyDevicePlugin extends Plugin {

    @PluginMethod
    public void ping(PluginCall call) {
        call.resolve();
    }

    @PluginMethod
    public void openCamera(PluginCall call) {

        if (getPermissionState("camera") != PermissionState.GRANTED) {
            requestPermissionForAlias("camera", call, "cameraPermissionCallback");
            return;
        }
        Intent intent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        getActivity().startActivity(intent);

        JSObject ret = new JSObject();
        ret.put("success", true);
        ret.put("action", "open_camera");
        call.resolve(ret);
    }

    @PluginMethod
    public void openSettings(PluginCall call) {
        Intent intent = new Intent(Settings.ACTION_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        getActivity().startActivity(intent);

        JSObject ret = new JSObject();
        ret.put("success", true);
        ret.put("action", "open_settings");
        call.resolve(ret);
    }

    @PluginMethod
    public void openWhatsApp(PluginCall call) {
        Intent intent = getContext().getPackageManager().getLaunchIntentForPackage("com.whatsapp");

        if (intent != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(intent);
        }

        JSObject ret = new JSObject();
        ret.put("success", intent != null);
        ret.put("action", "open_whatsapp");
        call.resolve(ret);
    }

    @PluginMethod
    public void flashlightOn(PluginCall call) {

        if (getPermissionState("camera") != PermissionState.GRANTED) {
            requestPermissionForAlias("camera", call, "flashlightPermissionCallback");
            return;
        }
        JSObject ret = new JSObject();

        try {
            CameraManager manager =
                (CameraManager)getContext().getSystemService(Context.CAMERA_SERVICE);

            String cameraId = manager.getCameraIdList()[0];
            manager.setTorchMode(cameraId, true);

            ret.put("success", true);
        } catch (Exception e) {
            ret.put("success", false);
            ret.put("error", e.getMessage());
        }

        ret.put("action", "flashlight_on");
        call.resolve(ret);
    }

    @PluginMethod
    public void callContact(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_DIAL);
        intent.setData(Uri.parse("tel:"));

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getActivity().startActivity(intent);

        JSObject ret = new JSObject();
        ret.put("success", true);
        ret.put("action", "call_contact");
        call.resolve(ret);
    }


    
    @PluginMethod
    public void startUpdate(PluginCall call) {
        String url = call.getString("url", "");

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(intent);

            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("action", "start_update");
            call.resolve(ret);

        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

@PermissionCallback
    private void cameraPermissionCallback(PluginCall call) {
        if (getPermissionState("camera") == PermissionState.GRANTED) {
            openCamera(call);
        } else {
            call.reject("Camera permission denied.");
        }
    }

    
    @PermissionCallback
    private void flashlightPermissionCallback(PluginCall call) {
        if (getPermissionState("camera") == PermissionState.GRANTED) {
            flashlightOn(call);
        } else {
            call.reject("Camera permission denied.");
        }
    }

}