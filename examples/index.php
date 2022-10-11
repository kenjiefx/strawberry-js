<?php 
$uri = $_SERVER['REQUEST_URI'];

if ($uri==='/strawberry.js') {
    header('Content-type: text/javascript');
    require ROOT.'/src/app.php';
    exit();
}

if(!file_exists(__dir__.$uri)) {
    echo 'File not found';
    exit();
}

require __dir__.$uri;