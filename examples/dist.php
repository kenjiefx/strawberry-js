<?php 

ob_start();
include 'build.php';
$output = ob_get_contents();
ob_end_clean();

$reserved = ['ComponentRegistry','_registerComponent','_getComponentRegistry','_componentRegistry','ComponentLibrary',
'_registerComponentTemplate','_registerComponentHandler','_getComponentTemplate','_getComponentHandler','__createComponentInstance',
'_componentTemplateContent','_componentLibRegistry','_componentHandlerFn','_componentId','_componentName','_componentChildNames',
'_componentChildIds','_componentHandler','_scopeRefObject','_namedElementsRegistry','_componentHtmlTemplate','_namedElementState',
'_namedElementTemplate','_setComponentId','_setComponentName','_getComponentId','_getComponentName','_addChildName','_addChildId',
'StrawberryComponent',
'STRAWBERRY_ATTRIBUTE','SERVICE_OBJECT','FACTORY_OBJECT','COMPONENT_OBJECT','COMPONENT_ELEMENT_ATTR','REPEAT_ELEMENT_ATTR','IF_ELEMENT_ATTR',
'HIDE_ELEMENT_ATTR','SHOW_ELEMENT_ATTR','CHECK_ELEMENT_ATTR','STYLE_ELEMENT_ATTR','MODEL_ELEMENT_ATTR','DISABLE_ELEMENT_ATTR',
'ENABLE_ELEMENT_ATTR','CLICK_EVENT_ATTR','CHANGE_EVENT_ATTR','TOUCH_EVENT_ATTR','BLOCK_ELEMENT_ATTR','SCOPE_ARGUMENT_KEY','BLOCK_ARGUMENT_KEY',
'ENABLE_ARGUMENT_KEY','DISABLE_ARGUMENT_KEY','PARENT_ARGUMENT_KEY','PATCH_ARGUMENT_KEY','APP_ARGUMENT_KEY','STRAWBERRY_ID_ATTR','REPEAT_REFERENCE_TOKEN',
'LOCK_ID_ATTR_KEY','LOCK_ID_ATTR_VALUE','EVENT_ELEMENT_ATTR',
'blockHelpers','getAppInstances','bootComponentTemplates','bootCallbackParser','isServiceOrFactory','bootFactoryHandler','bootServiceHandler',
'bootComponentHandler','checkedHelper','disablersHelper','cleanChildComponents','createTemporaryElement','copyBindElement','scopeBindElement',
'disposeElement','lockElement','isElementLocked','isElementEventLocked','lockElementEvent','getLiveAppElement','selectElementsButNotChildOfComponent',
'getLiveComponentAsTemplate','enablersHelpers','eventsHelper','createComponentId','sortComponentIds','ifsConditionalHelper','modelsHelpers',
'placeholderHelper','renderHelper','dissectRepeatExpression','repeatHelper','_assignModelValue','_assignModelState','stylesHelper',
'AttributeHelper','makeComponentXAttr','makeXAttr','makeXAttrWithValue','getXValueFromElAttr','getElementByXId','getElementByXAttribute',
'getXidsOfChildComponentByName','strawberryAppReferenceService','blocksService','setDisabledElementState','disableService','enableService',
'parentReferenceService','renderPatchableChildComponent','patchEntityService','_getChildNames','_getChildIds','_getHandler','_setHandler',
'_setScopeObject','_getScopeObject','_registerNamedElement','_getNamedElementState','_getNamedElementTemplate','_setNamedElementState',
'_setHtmlTemplate','_getHtmlTemplate','FactoryLibrary','_registerFactoryHandler','_getFactoryHandler','_resolveExpression','_getResolveType',
'_invokeFunction','_evalObject','_getParentObjectExp','_getChildObjectExp','_getParentObjAsObject','_registerServiceHandler',
'_getServiceHandler','_registerService','_getService','_serviceRegistry','_serviceHandler','ServiceLibrary','ServiceRegistry',
'_afterBootCallbacks','AppPublicReference','StrawberryApp','DomImplementationWrapper',
'_appName','_appConfig','_appId','_domHtml','_appRegistry','_appPublicRef','_appLibrary','_appReadyStatus','_setAppConfig','_getAppConfig',
'_getAppName','_getAppId','_setAppHtmlBody','_getAppHtmlBody','_getAppRegistry','_getAppLibrary','_isAppReady','_setAppReadyStatus','_getAppPublicReference'
];

usort($reserved, function ($a, $b) {
    return strlen($b) - strlen($a);
});

$i = 1;
foreach ($reserved as $keyword) {
    $prefix = ['','x','a','e'];
    $pre = $prefix[rand(1,3)];
    $output = str_replace($keyword,'_'.$pre.$i,$output);
    $i++;
}
echo $output;