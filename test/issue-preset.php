<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Preset Issue</title>
        <!--StrawberryJS Source Code-->
        <script type="text/javascript"><?php require '../src/app.php'?></script>
    </head>
    <body>
        <div xscope="test">
            {{test}}
        </div>
        <script type="text/javascript">
            strawberry.create('app');
            app.factory('presets',()=>{
                return {hello: 'world'}
            });
            app.scope('test',($scope)=>{
                $scope.test = 'testing';
            });
        </script>
    </body>
</html>
