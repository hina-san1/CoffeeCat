app.controller("CoffeeCatController", function ($scope, CoffeeCatService) {

    $scope.redirect = function (page) {
        window.location.href = "/CoffeeCat/" + page;
    }

    // --- Signup Page Logic ---
    $scope.signup = function () {
        if ($scope.password !== $scope.confirmPassword) {
            Swal.fire({
                title: "Error",
                text: "Passwords do not match!",
                icon: "error"
            });
            return;
        }

        let userArray = JSON.parse(sessionStorage.getItem("userInfo")) || [];

        let emailExists = userArray.find(user => user.Email === $scope.email);

        if (emailExists) {
            Swal.fire({
                title: "Error",
                text: "This email is already registered. Please use a different one or Login.",
                icon: "error"
            });
            return;
        }

        let userData = {
            Email: $scope.email,
            Password: $scope.password
        };

        userArray.push(userData);
        sessionStorage.setItem("userInfo", JSON.stringify(userArray));

        Swal.fire({
            title: "Success",
            text: "Sign up successful!",
            icon: "success"
        }).then((result) => {
            $scope.$apply(() => {
                $scope.redirect('Login');
            });
        });
    };

    // --- Login Page Logic ---
    $scope.login = function () {
        let userList = JSON.parse(sessionStorage.getItem("userInfo")) || [];

        let foundUser = userList.find(userData =>
            userData.Email === $scope.checkEmail &&
            userData.Password === $scope.checkPassword
        );

        if (foundUser) {
            Swal.fire({
                title: "Success",
                text: "Login successful!",
                icon: "success"
            }).then((result) => {
                $scope.$apply(() => {
                    $scope.redirect('Home');
                });
            });
        } else {
            Swal.fire({
                title: "Error",
                text: "Invalid email or password!",
                icon: "error"
            });
            return;
        }
    };

    // --- Index Page Logic ---
    $scope.year = new Date().getFullYear();

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
        return $scope.getSubtotal() * 0.12;
    };

    $scope.getTotal = function () {
        return $scope.getSubtotal() + $scope.getTax();
    };

    // --- Admin Page Logic ---
    let getUsers = sessionStorage.getItem("UserInfo");
});


