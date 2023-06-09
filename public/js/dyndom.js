
/**
This function here binds for dynamic resolution
looks for all attributes data-bind="#id"


globalEvents is a variable that holds the Events registered to each id
- register event for each id as an object
*/
var globalEvents={}
var doDummyFunc=function(e){
    console.log(e)
}
var escapeHtml = function(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

var unescapeHtml=function (safe) {
    return safe
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
 }
$(function(){
    
    const triggerEvent=function(id,boundTrigger,e){
        // to trigger the function we need to get the 
        // <tag data-bind=id data-trigger=boundTrigger>
        console.clear()
        var ElementsToApplyTo=$('[data-bind="'+id+'"][data-trigger="'+boundTrigger+'"]')
        var ElementToWorkWith=$(id)
        ElementsToApplyTo.each(function(idx,elem){
            // with each element check if the data-type="text?html" defaults to text if null
            var dType=elem.getAttribute("data-type") || "text"
            if (dType=="text"){
                elem.innerText=ElementToWorkWith.val()
            }else if(dType=="html"){
                elem.innerHTML=ElementToWorkWith.val()
            }else if(dType=="func"){
                var dFunc=elem.getAttribute("data-func")|| "doDummyFunc"
                elem.innerText=window[dFunc](e) || ""
            }
        });
    }

    // bind data in a node to another 
    // data-bind="#id" <- binds the data to certain id as source when triggered 
    // data-trigger="keyup"  <- when the #id triggers this event, values are all event types in the dom element 
    // data-type="text" <- the type that shall be invoked when the certain type is invoked, available values are "text","html","func"
    // for data-type="func" => a function should be defined to the global window and thus its name is specified here.
    // the function takes one arguement (e) which is the element that triggered the event, in our case its the #id
    const ArrDataBind=$('[data-bind]');
    
    ArrDataBind.each(function(idx,elem){
        // get all elements bound to this id
        var id=elem.getAttribute('data-bind');
        var elements=$('[data-bind="'+id+'"]');
        var boundTo=$(id);
        // registering events for the ID 
        if (!globalEvents[id]) {
            globalEvents[id]={}
        }
        elements.each(function(eIdx,element){
            var boundTrigger=element.getAttribute('data-trigger')
            if (!globalEvents[id][boundTrigger]){
                globalEvents[id][boundTrigger]=[]
                boundTo.on(boundTrigger,function(e){
                    e.preventDefault();
                    triggerEvent(id,boundTrigger,e)
                });
            }
            globalEvents[id][boundTrigger].push()
            
        })                                                
    });

    // make sure when we load the dom the data is initially empty 
    // data-initial-empty="true"

    $('[data-initial-empty="true"]').each(function(ids,element){
        switch (element.nodeName) {
            case 'TEXTAREA':
                $(element).val("")
                break;
            case 'INPUT':
                if(["text"].indexOf(element.getAttribute('type').toLowerCase())!== -1){
                    $(element).val("")
                }
                break;
            default:
                $(element).val("")
                break;
        }
    });
    $('[data-display-type="html"]').each(function(ids,element){
        var currentData=$(element).html();
        $(element).html(unescapeHtml(currentData + " ")) ;
        $(element).on('blur',function(){
            var currentData=$(element).html();
            // alert(unescapeHtml(currentData))
            $(element).html(unescapeHtml(currentData + " ")) ;
        });
    })
   
    
});
                                    