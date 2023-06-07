
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
                window[dFunc](e)
            }
        });
    }

    // 
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
});
                                    