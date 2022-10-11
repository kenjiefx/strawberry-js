<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World!</title>
    <script src="/strawberry.js" type="text/javascript"></script>
</head>
<body>

    <section xstrawberry="app">
        <section xcomponent="@MyComponent">
            {{message}}
        </section>
    </section>

    <script type="text/javascript">
        const app = strawberry.create('app');
        app.component('MyComponent',function($scope){
            $scope.message = 'Hello World!';
        });
    </script>
</body>
</html>