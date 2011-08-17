package org.encorelab.sail;

import android.os.Bundle;
import com.phonegap.*;

public class Sail extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();
        super.clearCache(); 
        
        // the homepage_url is defined in res/values/sail.xml
        super.loadUrl(getString(R.string.homepage_url));
        
        //super.loadUrl("file:///android_asset/www/index.html");
    }
}