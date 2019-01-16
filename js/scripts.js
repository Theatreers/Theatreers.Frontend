// Empty JS for your own code to be here

var applicationConfig = {
    clientID: '74568295-9e88-47db-bd81-e99a23fdcee8',
    authority: "https://theatreers.b2clogin.com/theatreers.onmicrosoft.com/B2C_1_SiUpIn",
    b2cScopes: ["openid", "https://theatreers.onmicrosoft.com/devshows/shows_read"]
    }; 

var clientApplication = new Msal.UserAgentApplication(applicationConfig.clientID, applicationConfig.authority, function (errorDesc, token, error, tokenType) {
    // Called after loginRedirect or acquireTokenPopup
        document.getElementById("username").innerHTML = "Logged in as :" + clientApplication.getUser().name
}); 

function login() {

    clientApplication.loginPopup(applicationConfig.b2cScopes).then(function (idToken) {
    
    clientApplication.acquireTokenSilent(applicationConfig.b2cScopes).then(
    function (accessToken) {
    
    document.getElementById("username").innerHTML = clientApplication.getUser().name;
    //document.getElementById("apptitlebanner").innerHTML = "AppFrame: " + Msal.Utils.extractIdToken(accessToken).extension_AF_Tenant
    
    }, function (error) {
    
    clientApplication.acquireTokenPopup(applicationConfig.b2cScopes).then(function (accessToken) {
    }, function (error) {
    logMessage("Error acquiring the popup:\n" + error);
    });
    })
    }, function (error) {
    logMessage("Error during login:\n" + error);
    });
} 

function logout() {
    // Removes all sessions, need to call AAD endpoint to do full logout
    clientApplication.logout();
}

function callApi() {
    clientApplication.acquireTokenSilent(applicationConfig.b2cScopes).then(function (accessToken) {
        callApiWithAccessToken(accessToken);
    }, function (error) {
        clientApplication.acquireTokenPopup(applicationConfig.b2cScopes).then(function (accessToken) {
            callApiWithAccessToken(accessToken);
        }, function (error) {
            logMessage("Error acquiring the access token to call the Web api:\n" + error);
        });
    })
}

function callApiWithAccessToken(accessToken) {
    // Call the Web API with the AccessToken
    $.ajax({
        type: "GET",
        url: "https://api.dev.theatreers.com/shows",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
    }).done(function (data) {
        logMessage("Web APi returned:\n" + JSON.stringify(data));
    })
        .fail(function (jqXHR, textStatus) {
            logMessage("Error calling the Web api:\n" + textStatus);
        })
}