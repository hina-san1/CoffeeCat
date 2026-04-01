app.service("CoffeeCatService", function ($http) {

    this.UpsertUserService = function (userInfo) {
        var response = $http({
            url: "/CoffeeCat/UpsertUsers",
            method: "post",
            data: userInfo  
        });
        return response;
    }
});