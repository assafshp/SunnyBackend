package com.sunnyapp.backend.utils;

import com.sunnyapp.backend.bootstrap.AppLoader;
import org.apache.log4j.Logger;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created by yarink on 18/05/2017.
 */
public class Utils {

    private Logger log = Logger.getLogger(AppLoader.class);


    public static String storagePathBuilder(String... pathToAppend) {
        StringBuilder stringBuilder = new StringBuilder();
        for (String path : pathToAppend) {
            stringBuilder.append(path);
            stringBuilder.append("/");
        }
        return stringBuilder.deleteCharAt(stringBuilder.length() - 1).toString();
    }



}
