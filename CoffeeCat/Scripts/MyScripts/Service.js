app.service("CoffeeCatService", function ($http) {

    this.UpsertUserService = function (userInfo) {
        return $http.post("/CoffeeCat/UpsertUsers", userInfo);
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

    this.GetAllOrdersService = function () {
        return $http.get("/CoffeeCat/GetAllOrders");
    };

    this.UpdateStatusService = function (orderId, action) {
        return $http.post("/CoffeeCat/UpdateOrderStatus", { order_id: orderId, action: action });
    };

    this.GetAllCustomersService = function () {
        return $http.get("/CoffeeCat/GetAllCustomers");
    };

    this.GetRevenueDataService = function () {
        return $http.get("/CoffeeCat/GetRevenueData");
    };
});