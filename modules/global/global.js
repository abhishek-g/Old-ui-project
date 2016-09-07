/**
 * Created by administrator on 1/10/14.
 */


var globalactions = require("./actions/global-actions");


module.exports = function (app) {

    app.get("/", globalactions.index);

    //logout is written here
    app.get("/logout", function (req, res) {
        if (req.session.user) {
            res.clearCookie('user');
            delete req.session.user;
            req.session.destroy(function (e) {
                res.redirect("/");
            });
            req.session = null

        }
    });

    app.get("/home", globalactions.home);

    app.get("/admin", globalactions.home);

    app.get("/users", globalactions.home);

    app.get("/dashboard", globalactions.home);

    app.get("/dashboardzone", globalactions.home);

    app.get("/singlesite",globalactions.home);

    app.get("/sitemap", globalactions.home);

    app.get("/alarms", globalactions.home);

    app.get("/tools", globalactions.home);

    app.get("/403", globalactions.forbidden);

    app.get("/404", globalactions.notfound);

};