({
    searchRecipients: function (component, event, helper) {
        // Implement the search logic here and update the results in the component
        var searchTerm = component.find("lookupInput").get("v.value");
        console.log('searchTerm',searchTerm);
        var action = component.get("c.searchLeadsAndContacts");
        // call database
        action.setParams({
            searchTerm: searchTerm
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.searchResults", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },

    selectRecipient: function (component, event, helper) {
        var selectedRecipientId = event.target.dataset.recordId;
        var selectedRecipient = component.get("v.searchResults").find(result => result.Id === selectedRecipientId);
        component.set("v.selectedRecipient", selectedRecipient);
        component.set("v.searchTerm", ""); // Clear the search term
        component.set("v.searchResults", []); // Clear the results
    }
})

