app.service("CoffeeCatService", function ($http) {

    this.UpsertUserService = function (userInfo) {
        return $http.post("/CoffeeCat/UpsertUsers", userInfo);
    }

    this.LoginUserService = function (loginInfo) {
        return $http.post("/CoffeeCat/LoginUser", loginInfo);
    };

    this.GetUserService = function () {
        return $http.get("CoffeeCat/GetUsers");
    }

    this.GetSession = function () {
        return $http.get("/CoffeeCat/GetSession");
    };

    this.LogoutService = function () {
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

    this.GetMonthlyRevenueService = function () {
        return $http.get("/CoffeeCat/GetMonthlyRevenue");
    };

    this.GetPopularDrinksService = function () {
        return $http.get("/CoffeeCat/GetPopularDrinks");
    };
});