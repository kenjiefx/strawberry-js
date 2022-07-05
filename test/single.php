<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Strawberry JS Development - v1.3</title>
        <!--StrawberryJS Source Code-->
        <script type="text/javascript"><?php require '../src/app.php'?></script>
    </head>
    <body>
        <!--
            You can use this template for Quick Testing!
        -->
        <app xscope="testScope">
            {{message}}
        </app>
        <script type="text/javascript">


            // Create a new Strawberry app instance
            strawberry.create('app');

            app.service('ServiceA',(ServiceChild)=>{
                ServiceChild.update(78);
                ServiceChild.test();
                return {};
            });

            app.service('ServiceB',(ServiceChild)=>{
                ServiceChild.test();
                return {};
            });

            app.service('ServiceChild',()=>{
                let val = 54;
                return {
                    test:()=>{
                        console.log(val);
                    },
                    update:(num)=>{
                        val = num;
                    }
                }
            });

            // Create a new scope
            app.scope('testScope',($scope,ServiceA,ServiceB)=>{
                $scope.message = 'Hello World!';
            });





        </script>
    </body>
</html>
