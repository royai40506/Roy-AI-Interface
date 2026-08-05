package com.roy.ai;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.roy.ai.plugins.RoyDevicePlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(RoyDevicePlugin.class);
    }
}
