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
            <div data-appkey="{{appKey}}" xblock="@testBlocks" class="">1st Div Block</div>
            <button @button xclick="testTouch()">Test Selecting Block</button>

            <div xpatch="@loadPatch">
                <div xif="hasLoaded==false">
                    Loaded is false!
                </div>
                <div xif="hasLoaded==true">
                    Congratulations!
                </div>
            </div>
        </app>
        <script type="text/javascript">

            // Create a new Strawberry app instance
            strawberry.create('app');

            // Create a new scope
            app.scope('testScope',($scope,$block)=>{

                $scope.appKey = '1234abc';
                $scope.hasLoaded = false;

                $scope.testTouch=function(){
                    $block('testBlocks',function(element){
                        console.log(element.data('appkey'));
                    });
                }
            });

        </script>
    </body>
</html>
