function Product(name, imagePath) {
    this.name = name;
    this.imagePath = imagePath;
    this.timesShown = 0;
    this.timesClicked = 0;
  }
  
  const products = [
    new Product("BAG", "img/bag.jpg"),
    new Product("BANANA", "img/banana.jpg"),
    new Product("BATHROOM", "img/bathroom.jpg"),
    new Product("BOOTS", "img/boots.jpg"),
    new Product("BREAKFAST", "img/breakfast.jpg"),
    new Product("BUBBLEGUM", "img/bubblegum.jpg"),
    new Product("CHAIR", "img/chair.jpg"),
    new Product("CTHULHU", "img/cthulhu.jpg"),
    new Product("DOG-DUCK", "img/dog-duck.jpg"),
    new Product("DRAGON", "img/dragon.jpg"),
    new Product("PEN", "img/pen.jpg"),
    new Product("PET SWEEP", "img/pet-sweep.jpg"),
    new Product("SCISSORS", "img/scissors.jpg"),
    new Product("SHARK", "img/shark.jpg"),
    new Product("SWEEP", "img/sweep.png"),
    new Product("TAUNTAUN", "img/tauntaun.jpg"),
    new Product("UNIFORN", "img/unicorn.jpg"),
    new Product("WATER CAN", "img/water-can.jpg"),
    new Product("WINE GLASS", "img/wine-glass.jpg"),
  ];
  
  const maxRounds = 25;
  let totalVotes = 0;
  
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  
  function displayProducts() {
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "";
  
    const selectedProducts = [];
    while (selectedProducts.length < 3) {
      const randomIndex = getRandomNumber(0, products.length);
      if (!selectedProducts.includes(randomIndex)) {
        selectedProducts.push(randomIndex);
        products[randomIndex].timesShown++;
      }
    }
  
    selectedProducts.forEach((index) => {
      const product = products[index];
      const imgElement = document.createElement("img");
      imgElement.src = product.imagePath;
      imgElement.alt = product.name;
      imgElement.addEventListener("click", () => {
        product.timesClicked++;
        if (totalVotes < maxRounds) {
            product.timesClicked++;
            totalVotes++;
            console.log(`${product.name} - Times Seen: ${product.timesShown}, Times Clicked: ${product.timesClicked}`);
            if (totalVotes === maxRounds) {
              const viewResultsBtn = document.getElementById("view-results-btn");
              viewResultsBtn.style.display = "block";
              alert("You have completed all 25 rounds of voting!");
              disableClickListeners();
              displayTopThreeProducts();
            }
            displayProducts();
          } else {
            alert("You cannot vote anymore. Voting is done!");
          }
        });
        productsContainer.appendChild(imgElement);
      });
    }

    function disableClickListeners() {
        const imgElements = document.querySelectorAll("#products-container img");
        imgElements.forEach((img) => {
          img.removeEventListener("click", () => {});
        });
      }

    function displayTopThreeProducts() {
        const topThreeProducts = [...products].sort((a, b) => b.timesClicked - a.timesClicked).slice(0, 3);
        const topThreeContainer = document.getElementById("top-three-container");
        topThreeContainer.innerHTML = "";
      
        topThreeProducts.forEach((product) => {
          const productElement = document.createElement("p");
          productElement.textContent = `${product.name} - Votes: ${product.timesClicked}`;
          topThreeContainer.appendChild(productElement);
        });
    }
    
    const viewResultsBtn = document.getElementById("view-results-btn");
    viewResultsBtn.addEventListener("click", () => {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "";

    products.forEach((product) => {
      const resultText = document.createElement("p");
      resultText.textContent = `${product.name} had ${product.timesClicked} votes`;
      resultsContainer.appendChild(resultText);
    });

    const totalVotesElement = document.createElement("p");
    totalVotesElement.textContent = `Total Votes: ${totalVotes}`;
    resultsContainer.appendChild(totalVotesElement);
  
    const productsContainer = document.getElementById("products-container");
    productsContainer.style.display = "none";
    viewResultsBtn.style.display = "none";
    resultsContainer.style.display = "block";
  });

  displayProducts();
  