app.service("CoffeeCatService", function ($http) {

    this.UpsertService = function () {
        var response = $http({
            url: "/CoffeeCat/UpsertUsers",
            method: "post"
        });
        return response;
    }
});