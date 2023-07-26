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

let totalSelections = 0;
let myChart = null; //had problems myChart being initialized

function getRandomIndex(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayThreeRandomProducts() {
  if (totalSelections >= 25) {
    viewResults();
    return;
  }

  const productSection = document.getElementById('productSection');
  productSection.innerHTML = '';

  const uniqueProductIndices = [];
  while (uniqueProductIndices.length < 3) {
    const randomIndex = getRandomIndex(0, products.length - 1);
    if (!uniqueProductIndices.includes(randomIndex)) {
      uniqueProductIndices.push(randomIndex);
      const product = products[randomIndex];
      product.timesShown++;
      const productElement = document.createElement('img');
      productElement.src = product.imagePath;
      productElement.alt = product.name;
      productElement.addEventListener('click', () => handleProductClick(product));

      productSection.appendChild(productElement);
    }
  }
}

function handleProductClick(product) {
  product.timesClicked++;
  totalSelections++;
  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('totalSelections', totalSelections);
  displayThreeRandomProducts();
  if (totalSelections >= 25) {
    viewResults();
  }
}

function loadDataFromLocalStorage() {
  const storedProducts = localStorage.getItem('products');
  const storedTotalSelections = localStorage.getItem('totalSelections');

  if (storedProducts) {
    const parsedProducts = JSON.parse(storedProducts);
    products.forEach((product, index) => {
      Object.assign(product, parsedProducts[index]);
    });

    if (storedTotalSelections) {
      totalSelections = parseInt(storedTotalSelections);
    }
    viewResults();
  }
}

loadDataFromLocalStorage();

function calculatePercentage(clicked, shown) {
  return ((clicked / shown) * 100).toFixed(2);
}

function resetVotes() {
  products.forEach(product => {
    product.timesShown = 0;
    product.timesClicked = 0;
  });
  totalSelections = 0;
  displayThreeRandomProducts();
  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('totalSelections', totalSelections);
  if (myChart) {
    myChart.destroy();
    myChart = null;
  }
  viewResults(); // call viewResults() here to update the chart after resetting the votes
}

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetVotes);

function viewResultsList() {
  const resultsList = document.getElementById('resultsList');
  resultsList.innerHTML = '';

  products.forEach(product => {
    const listItem = document.createElement('li');
    listItem.textContent = `${product.name} had ${product.timesClicked} votes, and was seen ${product.timesShown} times.`;
    resultsList.appendChild(listItem);
  });

  resultsList.style.display = 'block';
  const chartSection = document.getElementById('chartSection');
  chartSection.style.display = 'block';
}

function hideResultsList() {
  const resultsList = document.getElementById('resultsList');
  resultsList.style.display = 'none';
}

const viewResultsButton = document.getElementById('viewResults');
viewResultsButton.addEventListener('click', viewResultsList);

const resultsList = document.getElementById('resultsList');
resultsList.addEventListener('click', hideResultsList);

displayThreeRandomProducts();

function viewResults() {
  products.sort((a, b) => a.timesClicked - b.timesClicked);

  const productNames = [];
  const votesReceived = [];
  const timesSeen = [];
  const clickPercentage = [];

  products.forEach(product => {
    productNames.push(product.name);
    votesReceived.push(product.timesClicked);
    timesSeen.push(product.timesShown);
    clickPercentage.push(calculatePercentage(product.timesClicked, product.timesShown));
  });

  const chartCanvas = document.getElementById('chart');
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: productNames,
      datasets: [
        {
          label: 'Votes Received',
          data: votesReceived,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Times Seen',
          data: timesSeen,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        },
        {
          label: 'Click Percentage',
          data: clickPercentage,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      indexAxis: 'y', // display horizontally
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
