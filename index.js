document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");
    let filterOn = false;
  
    // Fetch all dogs from the server
    fetch("http://localhost:3000/pups")
      .then((response) => response.json())
      .then((dogs) => {
        // Display dogs in the dog bar
        displayDogs(dogs);
  
        // Add event listener to dog bar
        dogBar.addEventListener("click", (event) => {
          if (event.target.tagName === "SPAN") {
            const dogId = event.target.dataset.id;
            const selectedDog = dogs.find((dog) => dog.id === parseInt(dogId));
            displayDogInfo(selectedDog);
          }
        });
      });
  
    // Function to display dogs in the dog bar
    function displayDogs(dogs) {
      dogBar.innerHTML = "";
      dogs.forEach((dog) => {
        const span = document.createElement("span");
        span.innerText = dog.name;
        span.dataset.id = dog.id;
        dogBar.appendChild(span);
      });
    }
  
    // Function to display dog info
    function displayDogInfo(dog) {
      dogInfo.innerHTML = `
        <img src="${dog.image}">
        <h2>${dog.name}</h2>
        <button>${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
      `;
      const button = dogInfo.querySelector("button");
      button.addEventListener("click", () => {
        toggleGoodDog(dog);
        button.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
      });
    }
  
    // Function to toggle good dog status
    function toggleGoodDog(dog) {
      const updatedDog = { ...dog, isGoodDog: !dog.isGoodDog };
      fetch(`http://localhost:3000/pups/${dog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDog),
      })
        .then((response) => response.json())
        .then(() => {
          if (filterOn) {
            fetchGoodDogs();
          }
        });
    }
  
    // Function to fetch good dogs
    function fetchGoodDogs() {
      fetch("http://localhost:3000/pups?isGoodDog=true")
        .then((response) => response.json())
        .then((dogs) => {
          displayDogs(dogs);
        });
    }
  
    // Add event listener to filter button
    filterButton.addEventListener("click", () => {
      filterOn = !filterOn;
      filterButton.innerText = filterOn ? "Filter good dogs: ON" : "Filter good dogs: OFF";
      if (filterOn) {
        fetchGoodDogs();
      } else {
        fetch("http://localhost:3000/pups")
          .then((response) => response.json())
          .then((dogs) => {
            displayDogs(dogs);
          });
      }
    });
  });
  