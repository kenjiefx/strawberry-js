<?php 

# This is a very basic router based off on $_SERVER['REQUEST_URI'] value. 
$uri = $_SERVER['REQUEST_URI'];

if ($uri==='/strawberry.js') {
    header('Content-type:text/javascript');
    require 'build.php';
    exit();
}

if ($uri==='/strawberry.dist.js') {
    header('Content-type:text/javascript');
    require 'dist.php';
    exit();
}

if ($uri==='/') {
    header('Content-type:text/html');
    require 'index.html';
    exit();
}

if(!file_exists(__dir__.$uri)) {
    echo 'File not found';
    exit();
}

require __dir__.$uri;