module.exports = {

    // Paranoid mode makes the Fluvicast instance to full privacy proitection
    // mode, at the cost of some non-critical features. Under this mode,
    // Fluvicast will not contact any third party (such as Geobytes, for the
    // IP-to-region service) to avoid revealing potentially sensitive
    // information to other services.
    paranoid: false,

    // ###########################
    // ###  KEYS AND PASSWORDS ###
    // ###########################

    // Secret used by the cookie-parser middleware to sign cookies
    cookieSecret: "abcdefg",
}