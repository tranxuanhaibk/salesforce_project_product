({
    sendEmail: function (component, event, helper) {
        // Get information from the component
        var selectedRecipient = component.get("v.selectedRecipient");
        var subject = component.get("v.subject");
        var emailBody = component.get("v.emailBody");

        // Call the server-side controller method to send the email
        var action = component.get("c.sendEmailToRecipient");
        action.setParams({
            recipient: selectedRecipient,
            subject: subject,
            emailBody: emailBody
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Handle success
                console.log("Email sent successfully.");
            } else {
                // Handle errors
                console.log("Error: " + response.getError()[0].message);
            }
        });
        $A.enqueueAction(action);
    }
})
