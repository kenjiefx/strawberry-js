<?php

require __DIR__.'/functions.php';

echo '(function(){';
require __DIR__.'/domready.js';

# Importing service handlers
require __DIR__.'/services.php';

# Importing helper classes
import('helpers');

# Adding main Strawberry JS script
require __DIR__.'/strawberry.main.js';

echo '})();';
