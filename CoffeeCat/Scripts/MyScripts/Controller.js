app.controller("CoffeeCatController", function ($scope, CoffeeCatService) {

    // Get Footer Date
    $scope.year = new Date().getFullYear();
    
    // Navigation Function
    $scope.redirect = function (page) {
        window.location.href = "/CoffeeCat/" + page;
    };

    /*** Menu Page Logic ***/
    $scope.selectedCategory = 'all';
    $scope.cart = [];
    $scope.isCartOpen = false; 

    // Modal Control Functions
    $scope.openCart = function () {
        $scope.isCartOpen = true;
    };

    $scope.closeCart = function () {
        $scope.isCartOpen = false;
    };

    // Category Logic
    $scope.setCategory = function (category) {
        $scope.selectedCategory = category;
    };

    $scope.categoryFilter = function (item) {
        if ($scope.selectedCategory === 'all') return true;
        return item.category === $scope.selectedCategory;
    };

    // Cart Functions
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

    // Calculations
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

    // Checkout Logic
    $scope.checkout = function () {
        if ($scope.cart.length === 0) return;

        $scope.isCartOpen = false;

        Swal.fire({
            title: 'Checkout Completed!',
            text: 'Thank you for ordering at Coffee Cat!',
            icon: 'success',
            confirmButtonColor: '#6F4E37',
            confirmButtonText: 'Great!'
        }).then(() => {
            $scope.cart = [];
            $scope.$apply(); 
        });
    };

    // Menu Data
    $scope.LoremIpsum = "Experience the rich, smooth blend of our premium beans, crafted to perfection for your daily caffeine fix.";
    $scope.menuItems = [
        { id: 1, name: 'Iced Americano', price: 110.00, category: 'iced', image: '/Content/assets/iced americano.png', description: $scope.LoremIpsum },
        { id: 2, name: 'Iced Cappuccino', price: 130.00, category: 'iced', image: '/Content/assets/iced cappuccino.png', description: $scope.LoremIpsum },
        { id: 3, name: 'Iced Caramel Macchiato', price: 150.00, category: 'iced', image: '/Content/assets/iced caramel macchiato.png', description: $scope.LoremIpsum, },
        { id: 4, name: 'Iced Spanish Latte', price: 145.00, category: 'iced', image: '/Content/assets/iced spanish latte.png', description: $scope.LoremIpsum, },
        { id: 5, name: 'Iced Vanilla Latte', price: 140.00, category: 'iced', image: '/Content/assets/iced vanilla latte.png', description: $scope.LoremIpsum, },
        { id: 6, name: 'Hot Americano', price: 100.00, category: 'hot', image: '/Content/assets/hot americano.png', description: $scope.LoremIpsum },
        { id: 7, name: 'Hot Cappuccino', price: 125.00, category: 'hot', image: '/Content/assets/hot cappuccino.png', description: $scope.LoremIpsum },
        { id: 8, name: 'Hot Espresso', price: 110.00, category: 'hot', image: '/Content/assets/hot espresso.png', description: $scope.LoremIpsum },
        { id: 9, name: 'Matcha Latte', price: 150.00, category: 'matcha', image: '/Content/assets/matcha latte.png', description: $scope.LoremIpsum, },
        { id: 10, name: 'Strawberry Matcha', price: 165.00, category: 'matcha', image: '/Content/assets/strawberry matcha.png', description: $scope.LoremIpsum }
    ];
});

// The Bridge Directive (Add this to your app module)
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

            // Sync state if user clicks outside or presses ESC
            element.on('close', function () {
                scope.$apply(function () {
                    scope[attrs.modalShow] = false;
                });
            });
        }
    };

    $scope.Upsert = function () {
        var upsertData = CoffeeCatService.UpsertService();
        upsertData.then(function (returnedData) {
            alert(returnedData.data);
        });
    }
});