<?php
/**
 * Creating the Services class that contains all the public, built-in
 * and custom-made service handlers
 */
echo 'class Services { '.PHP_EOL;
import('services');
echo '    $public() {'.PHP_EOL;
echo '        return {'.PHP_EOL;
import('services/public',true);
echo '        }'.PHP_EOL;
echo '    }'.PHP_EOL;
echo '}';
