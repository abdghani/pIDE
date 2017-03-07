app.config(function($stateProvider, $urlRouterProvider,filepickerProvider) {

    $urlRouterProvider.otherwise('/home/');

    $stateProvider
        .state('home', {
            url: '/home/:codeId',
            templateUrl: '/partials/home.html',
            controller:'homeCtrl'
        })
        .state('new', {
            url: '/new',
            templateUrl: '/partials/home.html',
            controller:'homeCtrl'
        })
        .state('upload', {
            url: '/upload',
            templateUrl: '/partials/codeupload.html',
            controller:'uploadCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: '/partials/about.html'
        })
        .state('packages', {
            url: '/packages',
            templateUrl: '/partials/packages.html',
            controller:'packagesCtrl'
        })
        .state('save', {
            url: '/save',
            templateUrl: '/partials/savedCode.html',
            controller:'savedCtrl'
        })
        .state('api', {
            url: '/api',
            templateUrl: '/partials/api.html'
        });
        filepickerProvider.setKey('AynkfxksOQNSa83fviAQKz');
});
