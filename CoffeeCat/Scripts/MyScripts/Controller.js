app.controller("CoffeeCatController", function ($scope, CoffeeCatService) {

    $scope.redirect = function (page) {
        window.location.href = "/CoffeeCat/" + page;
    }

    $scope.year = new Date().getFullYear();
    $scope.selectedCategory = 'all';
    $scope.cart = [];

    // Size configuration
    $scope.sizes = [
        { name: 'Small', extra: 0 },
        { name: 'Medium', extra: 15 },
        { name: 'Large', extra: 30 }
    ];

    $scope.setCategory = function (category) {
        $scope.selectedCategory = category;
    };

    $scope.categoryFilter = function (item) {
        if ($scope.selectedCategory === 'all') return true;
        return item.category === $scope.selectedCategory;
    };

    $scope.LoremIpsum = "Experience the rich, smooth blend of our premium beans, crafted to perfection for your daily caffeine fix.";

    $scope.menuItems = [
        { id: 1, name: 'Iced Americano', price: 110.00, category: 'iced', image: '/Content/assets/iced americano.png', description: $scope.LoremIpsum, selectedSize: 'S' },
        { id: 2, name: 'Iced Cappuccino', price: 130.00, category: 'iced', image: '/Content/assets/iced cappuccino.png', description: $scope.LoremIpsum, selectedSize: 'S' },
        { id: 3, name: 'Iced Caramel Macchiato', price: 150.00, category: 'iced', image: '/Content/assets/iced caramel macchiato.png', description: $scope.LoremIpsum, selectedSize: 'S' },
        { id: 4, name: 'Iced Spanish Latte', price: 145.00, category: 'iced', image: '/Content/assets/iced spanish latte.png', description: $scope.LoremIpsum, selectedSize: 'S' },
        { id: 5, name: 'Iced Vanilla Latte', price: 140.00, category: 'iced', image: '/Content/assets/iced vanilla latte.png', description: $scope.LoremIpsum, selectedSize: 'S' },
        { id: 6, name: 'Hot Americano', price: 100.00, category: 'hot', image: '/Content/assets/hot americano.png', description: $scope.LoremIpsum, selectedSize: 'S' },
        { id: 7, name: 'Hot Cappuccino', price: 125.00, category: 'hot', image: '/Content/assets/hot cappuccino.png', description: $scope.LoremIpsum, selectedSize: 'S' },
        { id: 8, name: 'Hot Espresso', price: 110.00, category: 'hot', image: '/Content/assets/hot espresso.png', description: $scope.LoremIpsum, selectedSize: 'S' },
        { id: 9, name: 'Matcha Latte', price: 150.00, category: 'matcha', image: '/Content/assets/matcha latte.png', description: $scope.LoremIpsum, selectedSize: 'S' },
        { id: 10, name: 'Strawberry Matcha', price: 165.00, category: 'matcha', image: '/Content/assets/strawberry matcha.png', description: $scope.LoremIpsum, selectedSize: 'S' }
    ];

    $scope.selectSize = function (item, sizeLabel) {
        item.selectedSize = sizeLabel;
    };

    $scope.getItemDisplayPrice = function (item) {
        const sizeInfo = $scope.sizes.find(s => s.label === item.selectedSize);
        return item.price + (sizeInfo ? sizeInfo.extra : 0);
    };

    $scope.addToCart = function (item) {
        const sizeInfo = $scope.sizes.find(s => s.label === item.selectedSize);
        const finalPrice = item.price + sizeInfo.extra;

        var existingItem = $scope.cart.find(function (c) {
            return c.name === item.name && c.size === item.selectedSize;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            $scope.cart.push({
                name: item.name,
                basePrice: item.price,
                totalPrice: finalPrice,
                image: item.image,
                size: item.selectedSize,
                quantity: 1
            });
        }
    };

    $scope.updateQuantity = function (cartItem, amount) {
        cartItem.quantity += amount;
        if (cartItem.quantity <= 0) {
            var index = $scope.cart.indexOf(cartItem);
            $scope.cart.splice(index, 1);
        }
    };

    $scope.getSubtotal = function () {
        return $scope.cart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    };

    $scope.getTax = function () {
        return $scope.getSubtotal() * 0.12;
    };

    $scope.getTotal = function () {
        return $scope.getSubtotal() + $scope.getTax();
    };
});