
exports.getUser = function (req) {

        var cookies = req.headers.cookie;
        if (!cookies) return null;

        cookies = cookies.split("; ");

        var sessionToken = undefined;

        cookies.forEach((o) => {
            if (o.startsWith("session=")) {
                sessionToken = o.substr(8);
            }
        })

        if (typeof(sessionToken) != "string") {
            return null;
        }
        return sessionToken;
    }
