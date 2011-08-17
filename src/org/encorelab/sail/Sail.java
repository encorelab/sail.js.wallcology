package org.encorelab.sail;

import android.os.Bundle;
import com.phonegap.*;

public class Sail extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //super.loadUrl("file:///android_asset/www/index.html");
        super.init();
        super.clearCache(); 
        super.loadUrl("http://10.0.1.17:8000/index.html");
    }
}