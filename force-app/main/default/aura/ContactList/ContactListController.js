({
    doInit : function(component, event, helper) {
        var action = component.get('c.getContactList');

        action.setParam({

        });

        action.setCallback(this, function(response){
            var responseValue = response.getReturnValue();
            console.log('responseValue', responseValue);
            component.set('v.contactList', responseValue);
        }, 'SUCCESS');

        $A.enqueueAction(action, false);
    }
})
