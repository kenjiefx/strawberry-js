<?php 

/**
 * Combines all script files and exports them into a single file. 
 * It also removes all the import and export statement, as well 
 * as wrapping the entire script into an IIFE or what we call an
 * immediately invoked function expression.
 */
function export(){
    function clear_ex_im_stmt(string $script){
        $rems = [];
        foreach (\explode("\n",$script) as $line) {
            if (\str_contains($line,'import')) {
                $tokens = [];
                $token  = '';
                foreach (\str_split($line) as $char) {
                    $token = $token.$char;
                    if (\in_array($char, [' ','{','}','"',"'"])) {
                        \array_push($tokens,$token);
                        $token = \trim($char);
                    }
                }
                (\trim($tokens[0])==='import') 
                    ? \array_push($rems,$line) : null;
            }
        }
        foreach ($rems as $rem) {
            $script = \str_replace($rem,'',$script);
        }
        $script = \str_replace('export ','',$script);
        return $script;
    }

    $script = '(()=>{'.PHP_EOL;
    $locations = [
        ROOT.'/export/services/',
        ROOT.'/export/helpers/',
        ROOT.'/export/models/',
        ROOT.'/export/app.js'
    ];

    \array_walk($locations, function($location) use (&$script) {
        if (!\is_dir($location)) return;
        foreach (\scandir($location) as $file) {
            if (\in_array($file,['.','..'])) continue;
            $path = $location.$file;
            $script .= clear_ex_im_stmt(file_get_contents($path));
        }
    });
    $script .= '})();'.PHP_EOL;
    return $script;
}