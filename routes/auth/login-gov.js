var loginGov = require('../../login-gov');

var loginGovRoutes = {};

var logoutPath = '/auth/login-gov/logout';

loginGovRoutes.configure = function(app, passport) {

    //
    // LOGIN
    // ... app.get('/auth/login-gov/login', passport.authenticate('oidc'))
    //

    app.get('/auth/login-gov/login/loa-1', passport.authenticate('oidc-loa-1'));
    app.get('/auth/login-gov/login/loa-3', passport.authenticate('oidc-loa-3'));

    //
    // CALLBACK
    // ... app.get('/auth/login-gov/callback', passport.authenticate('oidc', {successRedirect:'/profile', failureRedirect:'/'}) )
    //

    app.get('/auth/login-gov/callback/loa-1', passport.authenticate('oidc-loa-1', {successRedirect:'/profile', failureRedirect:'/'}) );
    app.get('/auth/login-gov/callback/loa-3', passport.authenticate('oidc-loa-3', {successRedirect:'/profile', failureRedirect:'/'}) );

    //
    // LOGOUT
    //

    // Logout from this application, but not from login.gov
    app.get(logoutPath, function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // Logout from this application and from login.gov
    // ... using RP-Initiated Logout
    // ... adapted from https://github.com/18F/fs-permit-platform/blob/6f3681a5861d96db76c279f726c23971f3e037c7/server/src/auth/passport-config.es6#L41-L56
    app.get('/auth/login-gov/oidc-logout', function(req, res) {
        if (loginGov.issuer && req.user) {
          var postLogoutRedirectUrl = `http://localhost:9393${logoutPath}`; // redirect to the logout path to sign the user out of this app after the response comes back, or else the user will still be signed in!
          var requestUrl = `${loginGov.issuer.end_session_endpoint}?id_token_hint=${req.user.token}&post_logout_redirect_uri=${postLogoutRedirectUrl}&state=${req.user.state}`;
          return res.redirect(requestUrl);
        } else { // safeguard if user manually navigates to this route, avoids "Cannot read property 'token' of undefined"
          req.logout();
          res.redirect('/');
        };
    });

};

module.exports = loginGovRoutes;
