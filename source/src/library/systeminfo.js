let SystemInfo = {};

(function () {

    /**
     * 获取操作系统名称
     * @returns osname or null
     */
    SystemInfo.getOSName = function () {

        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('windows nt 10.0') != -1) {
            return 'Windows 10';
        }
        if (ua.indexOf('windows nt 6.1') != -1 || ua.indexOf('windows 7') != -1) {
            return 'Windows 7';
        }
        if (ua.indexOf('windows nt 6.2') != -1 || ua.indexOf('windows 8') != -1) {
            return 'Windows 8';
        }
        if (ua.indexOf('windows') != -1) {
            return 'Windows';
        }
        return null;
    };

    SystemInfo.getBrowserName = function () {

        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('opera') != -1) {
            return 'Opera';
        }
        if (ua.indexOf('edge') != -1) {
            return 'Edge';
        }
        if (ua.indexOf('firefox') != -1) {
            return 'Firefox';
        }
        if (ua.indexOf('chrome') != -1) {
            return 'Chrome';
        }
        return null;
    };
})();

export default SystemInfo;