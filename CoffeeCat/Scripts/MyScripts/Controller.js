app.controller("CoffeeCatController", function ($scope, CoffeeCatService) {

    // --- Index Page Logic ---
    $scope.redirect = function (page) {
        window.location.href = "/CoffeeCat/" + page;
    }
    $scope.year = new Date().getFullYear();

    // --- Signup Page Logic ---
    $scope.userInfo = [];

    $scope.userData = {
        Email: $scope.email,
        Password: $scope.password
    }

    // --- Menu Page Logic ---

    $scope.selectedCategory = 'all';

    // Category Filter
    $scope.setCategory = function (category) {
        $scope.selectedCategory = category;
    };

    $scope.categoryFilter = function (item) {
        if ($scope.selectedCategory === 'all') return true;
        return item.category === $scope.selectedCategory;
    };

    $scope.cart = [];


    $scope.LoremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    $scope.menuItems = [
        { id: 1, name: 'Iced Americano', price: 110.00, category: 'iced', image: '/Content/assets/iced americano.png', description: $scope.LoremIpsum, selectedSize: null },
        { id: 2, name: 'Iced Cappuccino', price: 130.00, category: 'iced', image: '/Content/assets/iced cappuccino.png', description: $scope.LoremIpsum, selectedSize: null },
        { id: 3, name: 'Iced Caramel Macchiato', price: 150.00, category: 'iced', image: '/Content/assets/iced caramel macchiato.png', description: $scope.LoremIpsum, selectedSize: null },
        { id: 4, name: 'Iced Spanish Latte', price: 145.00, category: 'iced', image: '/Content/assets/iced spanish latte.png', description: $scope.LoremIpsum, selectedSize: null },
        { id: 5, name: 'Iced Vanilla Latte', price: 140.00, category: 'iced', image: '/Content/assets/iced vanilla latte.png', description: $scope.LoremIpsum, selectedSize: null },
        { id: 6, name: 'Hot Americano', price: 100.00, category: 'hot', image: '/Content/assets/hot americano.png', description: $scope.LoremIpsum, selectedSize: null },
        { id: 7, name: 'Hot Cappuccino', price: 125.00, category: 'hot', image: '/Content/assets/hot cappuccino.png', description: $scope.LoremIpsum, selectedSize: null },
        { id: 8, name: 'Hot Espresso', price: 110.00, category: 'hot', image: '/Content/assets/hot espresso.png', description: $scope.LoremIpsum, selectedSize: null },
        { id: 9, name: 'Matcha Latte', price: 150.00, category: 'matcha', image: '/Content/assets/matcha latte.png', description: $scope.LoremIpsum, selectedSize: null },
        { id: 10, name: 'Strawberry Matcha', price: 165.00, category: 'matcha', image: '/Content/assets/strawberry matcha.png', description: $scope.LoremIpsum, selectedSize: null }
    ];

    // 1. Function to pick size
    $scope.selectSize = function (item, size) {
        item.selectedSize = size;
    };

    // 2. Add to cart logic
    $scope.addToCart = function (item) {
        if (!item.selectedSize) return; 

        var existingItem = $scope.cart.find(function (c) {
            return c.name === item.name && c.size === item.selectedSize;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            $scope.cart.push({
                name: item.name,
                price: item.price,
                image: item.image,
                size: item.selectedSize,
                quantity: 1
            });
        }
    };

    // 3. Plus/Minus Buttons
    $scope.updateQuantity = function (cartItem, amount) {
        cartItem.quantity += amount;
        if (cartItem.quantity <= 0) {
            var index = $scope.cart.indexOf(cartItem);
            $scope.cart.splice(index, 1);
        }
    };

    // 4. Calculations 
    $scope.getSubtotal = function () {
        return $scope.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    $scope.getTax = function () {
        return $scope.getSubtotal() * 0.12; // Example 12%
    };

    $scope.getTotal = function () {
        return $scope.getSubtotal() + $scope.getTax();
    };
});