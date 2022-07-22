var Step3Default = (function () {
    function Step3Default() {
        var _this = this;
        this.blockId = 'step3-default';
        this.secret = ko.observable('');
        this.updateProOptionsInProcess = ko.observable(false);
        this.updateProWidgetCode = function () {
            if (_this.secret() === '') {
                return;
            }
            if (_this.updateProOptionsInProcess()) {
                return;
            }
            _this.updateProOptionsInProcess(true);
            jsonHttpClient.post('/widget/update-pro-widget-code', {
                options: _this.widgetOptions,
                secret: _this.secret()
            }).always(function () {
                _this.updateProOptionsInProcess(false);
            });
        };
        this.widgetCode = ko.observable('');
        this.isWidgetCodeAvailable = ko.observable(false);
        this.email = ko.observable(null);
        this.subscribeUpdates = ko.observable(true);
        this.isShowEmailError = ko.observable(false);
        this.isShowDomainError = ko.observable(false);
        this.isShowWidgetOptionsError = ko.observable(false);
        ko.applyBindings(this, document.getElementById(this.blockId));
    }
    Step3Default.prototype.getControllerType = function () {
        return PageWidgetController.STEP_3_TYPE_DEFAULT;
    };
    Step3Default.prototype.setPageParams = function (ctrlParams) {
        this.ctrlParams = ctrlParams;
    };
    Step3Default.prototype.setWidgetOptions = function (widgetOptions) {
        this.widgetOptions = widgetOptions;
    };
    Step3Default.prototype.setWidgetCode = function (widgetCode) {
        this.widgetCode(widgetCode);
    };
    Step3Default.prototype.clearStepState = function () {
        this.isWidgetCodeAvailable(false);
    };
    Step3Default.prototype.setGetCodeCallback = function (callback) {
        this.getCodeCallback = callback;
    };
    Step3Default.prototype.setSecret = function (secret) {
        this.secret(secret);
    };
    Step3Default.prototype.setEmail = function (email) {
        this.email(email);
    };
    Step3Default.prototype.requestWidgetCode = function () {
        if (!this.validateWidgetOptions()) {
            this.isShowWidgetOptionsError(true);
            return;
        }
        this.isShowWidgetOptionsError(false);
        if (this.email() == null) {
            this.email('');
        }
        if (!this.validateEmail(this.email())) {
            this.isShowEmailError(true);
            return;
        }
        this.isShowEmailError(false);
        if (!this.validateDomain()) {
            this.isShowDomainError(true);
            return;
        }
        this.isShowDomainError(false);
        if (this.getCodeCallback) {
            this.getCodeCallback();
        }
        if (window['ga']) {
            window['ga']('send', 'event', 'widget', 'get_button_code');
        }
        var requestData = {
            email: this.email(),
            subscribeUpdates: this.subscribeUpdates(),
            href: window.location.href,
            options: this.widgetOptions,
            code: this.widgetCode()
        };
        if (this.secret() !== '') {
            requestData['secret'] = this.secret();
        }
        jsonHttpClient.post('/widget/requested', requestData);
        this.isWidgetCodeAvailable(true);
        if (!this.widgetOptions.hasOwnProperty('key')) {
            (new ClientStorage()).setInitParams(requestData);
        }
    };
    Step3Default.prototype.saveOptions = function (options) {
        var requestData = { options: options };
        if (this.secret() !== '') {
            requestData['secret'] = this.secret();
        }
        jsonHttpClient.post('/widget/update-pro-widget-code', requestData);
    };
    Step3Default.prototype.validateDomain = function () {
        if (this.widgetOptions
            && this.widgetOptions.hasOwnProperty('key')
            && this.widgetOptions.key) {
            return this.widgetOptions.hasOwnProperty('domain')
                && !!this.widgetOptions.domain;
        }
        return true;
    };
    Step3Default.prototype.validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    Step3Default.prototype.validateWidgetOptions = function () {
        if (this.widgetOptions &&
            (this.widgetOptions.hasOwnProperty('apple')
                || this.widgetOptions.hasOwnProperty('call')
                || this.widgetOptions.hasOwnProperty('contactform')
                || this.widgetOptions.hasOwnProperty('email')
                || this.widgetOptions.hasOwnProperty('facebook')
                || this.widgetOptions.hasOwnProperty('googlemap')
                || this.widgetOptions.hasOwnProperty('instagram')
                || this.widgetOptions.hasOwnProperty('line')
                || this.widgetOptions.hasOwnProperty('link')
                || this.widgetOptions.hasOwnProperty('linkedin')
                || this.widgetOptions.hasOwnProperty('skype')
                || this.widgetOptions.hasOwnProperty('slack')
                || this.widgetOptions.hasOwnProperty('sms')
                || this.widgetOptions.hasOwnProperty('snapchat')
                || this.widgetOptions.hasOwnProperty('telegram')
                || this.widgetOptions.hasOwnProperty('twitter')
                || this.widgetOptions.hasOwnProperty('tiktok')
                || this.widgetOptions.hasOwnProperty('viber')
                || this.widgetOptions.hasOwnProperty('vkontakte')
                || this.widgetOptions.hasOwnProperty('waze')
                || this.widgetOptions.hasOwnProperty('wechat')
                || this.widgetOptions.hasOwnProperty('whatsapp'))) {
            return true;
        }
        return false;
    };
    return Step3Default;
}());
