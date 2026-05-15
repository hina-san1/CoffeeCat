app.controller("CoffeeCatController", function ($scope, CoffeeCatService) {

    /*** Get Footer Date ***/
    $scope.year = new Date().getFullYear();

    /*** Navigation Function ***/
    $scope.redirect = function (page) {
        if (page === 'Menu' && !$scope.isLoggedIn) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please register or login to your account to start ordering!',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#967259',
                confirmButtonText: 'Go to Login',
                cancelButtonText: 'Stay here'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/CoffeeCat/Login";
                }
            });
            return;
        }

        window.location.href = "/CoffeeCat/" + page;
    };

    /*** Sign Up Page Logic ***/
    $scope.upsertUserData = function () {
        if (!$scope.first_name || !$scope.last_name || !$scope.username || !$scope.email || !$scope.password) {
            Swal.fire({
                title: 'Incomplete Form',
                text: 'Please fill in all required fields',
                icon: 'warning',
                confirmButtonColor: '#d33'
            });
            return;
        }

        var userInfo = {
            "first_name": $scope.first_name,
            "last_name": $scope.last_name,
            "username": $scope.username,
            "email": $scope.email,
            "password": $scope.password,
            "contact": $scope.contact
        };

        CoffeeCatService.UpsertUserService(userInfo)
            .then(function (response) {
                if (response.data.success) {
                    Swal.fire({
                        title: 'Success!',
                        text: response.data.message,
                        icon: 'success',
                        confirmButtonColor: '#967259',
                        confirmButtonText: 'Login Now'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $scope.redirect("Login");
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Registration Failed',
                        text: response.data.message,
                        icon: 'error',
                        confirmButtonColor: '#d33'
                    });
                }
            })
            .catch(function (error) {
                Swal.fire({
                    title: 'Server Error',
                    text: 'Unable to reach the service. Please try again later.',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            });
    };

    /*** Log In Page Logic ***/
    $scope.loginUserData = function () {
        var loginInfo = {
            email: $scope.login_email,
            password: $scope.login_password
        };

        CoffeeCatService.LoginUserService(loginInfo)
            .then(function (response) {
                if (response.data.success) {
                    var userRole = (response.data.role || "").toLowerCase();

                    if (userRole === "admin") {
                        window.location.href = "/CoffeeCat/AdminDashboard";
                    } else {
                        window.location.href = "/CoffeeCat/Home";
                    }
                } else {
                    Swal.fire({
                        title: 'Login Failed',
                        text: response.data.message,
                        icon: 'error',
                        confirmButtonColor: '#d33'
                    });
                }
            })
            .catch(function (error) {
                Swal.fire({
                    title: 'Server Error',
                    text: 'Could not connect to the server.',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            });
    };

    $scope.currentUser = null;
    $scope.isLoggedIn = false;

    $scope.logout = function () {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will need to login again to access your account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#967259',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                CoffeeCatService.LogoutService().then(function () {
                    $scope.isLoggedIn = false;
                    $scope.currentUser = null;
                    $scope.redirect("Home");

                    Swal.fire(
                        'Logged Out!',
                        'You have been successfully logged out.',
                        'success'
                    );
                });
            }
        });
    };

    /*** Menu Page Logic ***/
    $scope.selectedCategory = 'all';
    $scope.cart = [];
    $scope.isCartOpen = false;

    $scope.openCart = function () {
        $scope.isCartOpen = true;
    };

    $scope.closeCart = function () {
        $scope.isCartOpen = false;
    };

    $scope.setCategory = function (category) {
        $scope.selectedCategory = category;
    };

    $scope.categoryFilter = function (item) {
        if ($scope.selectedCategory === 'all') return true;
        return item.category === $scope.selectedCategory;
    };

    $scope.addToCart = function (item) {
        var existingItem = $scope.cart.find(function (cartItem) {
            return cartItem.id === item.id;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            var newItem = angular.copy(item);
            newItem.quantity = 1;
            $scope.cart.push(newItem);
        }
    };

    $scope.updateQuantity = function (item, change) {
        item.quantity += change;
        if (item.quantity <= 0) {
            $scope.removeFromCart(item);
        }
    };

    $scope.removeFromCart = function (item) {
        var index = $scope.cart.indexOf(item);
        if (index > -1) {
            $scope.cart.splice(index, 1);
        }
    };

    $scope.getSubtotal = function () {
        var subtotal = 0;
        angular.forEach($scope.cart, function (item) {
            subtotal += (item.price * item.quantity);
        });
        return subtotal;
    };

    $scope.getTax = function () {
        return $scope.getSubtotal() * 0.12;
    };

    $scope.getTotal = function () {
        return $scope.getSubtotal() + $scope.getTax();
    };

    $scope.checkout = function () {
        if ($scope.cart.length === 0) return;

        var orderData = {
            "subtotal": $scope.getSubtotal(),
            "tax": $scope.getTax(),
            "total": $scope.getTotal(),
            "order_items": $scope.cart.map(function (item) {
                return {
                    "drink_id": item.id,
                    "quantity": item.quantity
                };
            })
        };

        CoffeeCatService.AddOrderService(orderData).then(function (response) {
            if (response.data.success) {
                $scope.isCartOpen = false;
                $scope.cart = [];
                Swal.fire({
                    title: 'Order Placed!',
                    text: 'Your caffeine is on the way!',
                    icon: 'success',
                    confirmButtonColor: '#967259'
                }).then(() => {
                    $scope.redirect('UserOrder');
                });
            } else {
                Swal.fire('Error', response.data.message, 'error');
            }
        });
    };

    /*** User Orders Logic ***/
    $scope.userOrders = [];

    $scope.loadOrders = function () {
        CoffeeCatService.GetUserOrdersService().then(function (response) {
            if (response.data.success) {
                $scope.userOrders = response.data.data;
            }
        });
    };

    // Menu items
    $scope.icedAmericano = "Our signature espresso shots poured over chilled water and ice for a crisp, clean, and bold awakening.";
    $scope.icedCappuccino = "A refreshing balance of intense espresso and chilled milk, topped with a velvety layer of cold milk foam.";
    $scope.icedCaramelMacchiato = "Freshly steamed milk stained with espresso and marked with a buttery, decadent drizzle of premium caramel.";
    $scope.icedSpanishLatte = "A creamy, sweetened delight featuring condensed milk and bold espresso, served perfectly chilled for a smooth finish.";
    $scope.icedVanillaLatte = "The timeless classic: rich espresso meets silky milk and the sweet, aromatic warmth of Madagascar vanilla.";
    $scope.hotAmericano = "Deep, complex espresso tempered with hot water to highlight the subtle floral and nutty notes of our house blend.";
    $scope.hotCappuccino = "A true barista classic—equal parts espresso, steamed milk, and a thick, luxurious pillow of micro-foam.";
    $scope.hotEspresso = "The pure essence of our craft. A concentrated, full-bodied shot with a golden crema and lingering cocoa finish.";
    $scope.matchaLatte = "Premium ceremonial-grade stone-ground green tea whisked with silky milk for a vibrant, earthy, and energizing sip.";
    $scope.strawberryMatcha = "The perfect duo of earthy matcha and sweet, tangy strawberry puree, layered beautifully for a fruity twist on a favorite.";

    $scope.menuItems = [
        { id: 1, name: 'Iced Americano', price: 110.00, category: 'iced', image: '/Content/assets/iced americano.png', description: $scope.icedAmericano },
        { id: 2, name: 'Iced Cappuccino', price: 130.00, category: 'iced', image: '/Content/assets/iced cappuccino.png', description: $scope.icedCappuccino },
        { id: 3, name: 'Iced Caramel Macchiato', price: 150.00, category: 'iced', image: '/Content/assets/iced caramel macchiato.png', description: $scope.icedCaramelMacchiato },
        { id: 4, name: 'Iced Spanish Latte', price: 145.00, category: 'iced', image: '/Content/assets/iced spanish latte.png', description: $scope.icedSpanishLatte },
        { id: 5, name: 'Iced Vanilla Latte', price: 140.00, category: 'iced', image: '/Content/assets/iced vanilla latte.png', description: $scope.icedVanillaLatte },
        { id: 6, name: 'Hot Americano', price: 100.00, category: 'hot', image: '/Content/assets/hot americano.png', description: $scope.hotAmericano },
        { id: 7, name: 'Hot Cappuccino', price: 125.00, category: 'hot', image: '/Content/assets/hot cappuccino.png', description: $scope.hotCappuccino },
        { id: 8, name: 'Hot Espresso', price: 110.00, category: 'hot', image: '/Content/assets/hot espresso.png', description: $scope.hotEspresso },
        { id: 9, name: 'Matcha Latte', price: 150.00, category: 'matcha', image: '/Content/assets/matcha latte.png', description: $scope.matchaLatte },
        { id: 10, name: 'Strawberry Matcha', price: 165.00, category: 'matcha', image: '/Content/assets/strawberry matcha.png', description: $scope.strawberryMatcha }
    ];

    /*** Admin Logic ***/

    // Session Check
    $scope.checkSession = function () {
        CoffeeCatService.GetSession().then(function (response) {
            if (response.data.loggedIn) {
                $scope.isLoggedIn = true;
                $scope.currentUser = response.data.username;

                var role = (response.data.role || "").toLowerCase();

                if (role === 'admin') {
                    $scope.loadAdminOrders();
                    $scope.loadCustomers();
                    $scope.getStats();
                    $scope.loadChartData();
                } else {
                    $scope.loadOrders();
                }
            } else {
                $scope.isLoggedIn = false;
                $scope.currentUser = null;
            }
        }).catch(function (error) {
            console.error("Session check failed:", error);
        });
    };

    $scope.checkSession();

    // Card Status
    $scope.dashboardStats = {};

    $scope.getStats = function () {
        CoffeeCatService.GetDashboardStatsService().then(function (response) {
            if (response.data.success) {
                $scope.dashboardStats = response.data.data;
            }
        });
    };

    // Bar Chart
    $scope.barLabels = [];
    $scope.barSeries = ['Revenue (₱)'];
    $scope.barData = [];

    // Pie Chart
    $scope.pieLabels = [];
    $scope.pieData = [];

    $scope.loadChartData = function () {
        CoffeeCatService.GetMonthlyRevenueService().then(function (response) {
            if (response.data.success) {
                $scope.barLabels = response.data.barLabels;
                $scope.barData = [response.data.barData];
            }
        });

        CoffeeCatService.GetPopularDrinksService().then(function (response) {
            if (response.data.success) {
                $scope.pieLabels = response.data.pieLabels;
                $scope.pieData = response.data.pieData;
            }
        });
    };

    /*** Admin Orders Logic ***/
    $scope.allOrders = [];

    $scope.loadAdminOrders = function () {
        CoffeeCatService.GetAllOrdersService().then(function (response) {
            if (response.data.success) {
                $scope.allOrders = response.data.data;
            }
        });
    };

    $scope.updateStatus = function (orderId, action) {
        CoffeeCatService.UpdateStatusService(orderId, action).then(function (response) {
            if (response.data.success) {
                Swal.fire('Updated!', 'Order is now ' + action + 'd', 'success');
                $scope.loadAdminOrders();
                $scope.getStats();
                $scope.loadChartData();
            }
        });
    };

    /*** Admin Users Logic ***/
    $scope.allCustomers = [];

    $scope.loadCustomers = function () {
        CoffeeCatService.GetAllCustomersService().then(function (response) {
            if (response.data.success) {
                $scope.allCustomers = response.data.data;
            }
        });
    };
});

app.directive('modalShow', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.modalShow, function (value) {
                if (value) {
                    element[0].showModal();
                } else {
                    element[0].close();
                }
            });

            element.on('close', function () {
                scope.$apply(function () {
                    scope[attrs.modalShow] = false;
                });
            });
        }
    };
});