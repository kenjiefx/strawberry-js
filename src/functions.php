<?php
/**
 * Function import
 * Combines all the files in a certain directory into one file
 * @var string $dir - working directory
 * @var string $separator - used to add comma to the method declaration of objects
 */
function import($dir,$separator=null)
{
    $path = __DIR__.'/'.$dir.'/';
    $files = scandir($path);
    $i=0;
    foreach($files as $file) {
        if ($file=='.'||$file=='..') continue;
        if (is_dir($path.$file)) continue;
        if ($i>0 && $separator) echo ', '.PHP_EOL;
        echo file_get_contents($path.$file);
        $i++;
    }
}
