app.service("CoffeeCatService", function ($http) {

    this.UpsertUserService = function (userInfo) {
        var response = $http({
            url: "/CoffeeCat/UpsertUsers",
            method: "POST",
            data: userInfo
        });
        return response;
    }

    this.LoginUserService = function (loginInfo) {
        return $http.post("/CoffeeCat/LoginUser", loginInfo);
    };

    this.getUserService = function () {
        return $http.get("CoffeeCat/GetUsers");
    }

    this.getSession = function () {
        return $http.get("/CoffeeCat/GetSession");
    };

    this.logoutService = function () {
        return $http.post("/CoffeeCat/LogoutUser");
    };

    this.AddOrderService = function (orderInfo) {
        return $http.post("/CoffeeCat/AddOrder", orderInfo);
    };

    this.GetUserOrdersService = function () {
        return $http.get("/CoffeeCat/GetUserOrders");
    };

    this.GetDashboardStatsService = function () {
        return $http.get("/CoffeeCat/GetDashboardStats");
    };
});