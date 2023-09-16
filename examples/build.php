<?php

$extraFileNames = ['.','..'];
class BuildPaths {
    public static string $SERVICES = ROOT.'/build/services/';
    public static string $HELPERS = ROOT.'/build/helpers/';
    public static string $MODELS = ROOT.'/build/models/';
    public static string $APP = ROOT.'/build/app.js';
}

function clearExIm (string $scriptContent){
    $removables = [];
    $scriptLines = explode("\n",$scriptContent);
    foreach ($scriptLines as $line) {
        if (str_contains($line,'import')) {
            $chars  = str_split($line);
            $tokens = [];
            $token  = '';
            foreach ($chars as $char) {
                $token = $token.$char;
                if ($char===' ') {
                    array_push($tokens,$token);
                    $token = '';
                    continue;
                }
                if ($char==='{') {
                    array_push($tokens,$token);
                    $token = '{';
                    continue;
                }
                if ($char==='}') {
                    array_push($tokens,$token);
                    $token = '';
                    continue;
                }
                if ($char==='"') {
                    array_push($tokens,$token);
                    $token = '"';
                    continue;
                }
                if ($char==="'") {
                    array_push($tokens,$token);
                    $token = "'";
                    continue;
                }
            }
            if (trim($tokens[0])==='import') {
                array_push($removables,$line);
            }
        }
    }
    foreach ($removables as $removable) {
        $scriptContent = str_replace($removable,'',$scriptContent);
    }
    $scriptContent = str_replace('export ','',$scriptContent);
    return $scriptContent;
}


echo '(()=>{'.PHP_EOL;
    $buildDirQueue = [
        BuildPaths::$SERVICES,
        BuildPaths::$HELPERS,
        BuildPaths::$MODELS
    ];
    array_walk($buildDirQueue,function($buildDirPath) use ($extraFileNames){
        $filesToWorkOn = scandir($buildDirPath);
        foreach ($filesToWorkOn as $fileToWorkOn) {
            if (in_array($fileToWorkOn,$extraFileNames)) continue;
            $filePath = $buildDirPath.$fileToWorkOn;
            echo clearExIm(file_get_contents($filePath));
        }
    });
    echo clearExIm(file_get_contents(BuildPaths::$APP));
echo '})();'.PHP_EOL;