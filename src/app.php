<?php
    # PHP Bundler
    # Created for the the development of StrawberryJS

    require __DIR__.'/functions.php';
    echo '(()=>{';
    require __DIR__.'/domready.js';
    # Importing service handlers
    require __DIR__.'/services.php';
    # Importing helper classes
    import('helpers');
    require __DIR__.'/strawberry.main.js';
    echo '})();';
