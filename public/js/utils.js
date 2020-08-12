// INDEX
// (When adding new functions, update the function list below )
//
// 10:    function copyText(text, success, failure) {...}

// Function to copy to clipboard
// Useful at : /register
// Source : https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
//          https://web.archive.org/web/20200725114220/https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyText(text, success, failure) {
    if (!navigator.clipboard) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            if (successful) {
                if (success) success();
            } else {
                if (failure) failure();
            }
        } catch (err) {
            if (failure) failure();
        }

        document.body.removeChild(textArea);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        if (success) success();
    }, function (err) {
        if (failure) failure();
    });
}