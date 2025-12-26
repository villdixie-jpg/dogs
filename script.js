// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resultsContainer = document.getElementById("results");
const resultsWrapper = document.getElementById("results-container");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");
const toggleDarkBtn = document.getElementById("toggle-dark");
const backBtn = document.getElementById("back-btn");

// 20 Dog's Facts
const sampleDogFacts = [
  { breed: "Akita", fact: "Akitas are large, powerful dogs originating from Japan and known for loyalty.", image: "https://cdn2.thedogapi.com/images/BFRYBufpm.jpg" },
  { breed: "Australian Shepherd", fact: "Australian Shepherds are highly energetic and excel at herding and agility.", image: "https://cdn2.thedogapi.com/images/r1f_ll5VX.jpg" },
  { breed: "Beagle", fact: "Beagles have one of the strongest sense of smell among dog breeds and are often used in airport security.", image: "https://cdn2.thedogapi.com/images/Syd4xxqEm.jpg" },
  { breed: "Boxer", fact: "Boxers are playful and patient, making them excellent companions for children.", image: "https://cdn2.thedogapi.com/images/ry1kWe5VQ.jpg" },
  { breed: "Corgi", fact: "Corgis were originally bred for herding cattle and are known for their short legs and big personalities.", image: "https://cdn2.thedogapi.com/images/BkE6Wg5E7.jpg" },
  { breed: "Dalmatian", fact: "Dalmatians are born completely white and develop their distinctive black spots as they grow older.", image: "https://cdn2.thedogapi.com/images/SkmRJl9VQ.jpg" },
  { breed: "French Bulldog", fact: "French Bulldogs are friendly, adaptable, and great apartment dogs.", image: "https://cdn2.thedogapi.com/images/B1svZg5Em.jpg" },
  { breed: "German Shepherd", fact: "German Shepherds are widely used in police and military work due to their intelligence.", image: "https://cdn2.thedogapi.com/images/SJyBfg5NX.jpg" },
  { breed: "Golden Retriever", fact: "Golden Retrievers have a 'soft mouth,' allowing them to carry eggs or game without breaking them.", image: "https://cdn2.thedogapi.com/images/H1dGlxqNQ.jpg" },
  { breed: "Labrador Retriever", fact: "Labradors are one of the most popular breeds worldwide due to their friendly nature and intelligence.", image: "https://cdn2.thedogapi.com/images/B1svZg5E7.jpg" },
  { breed: "Maltese", fact: "Maltese dogs were bred as companion dogs and are known for their long, silky white coats.", image: "https://cdn2.thedogapi.com/images/BkrJjgcV7.jpg" },
  { breed: "Pekingese", fact: "Pekingese were bred for Chinese royalty and were considered sacred dogs.", image: "https://cdn2.thedogapi.com/images/HkNS3gqEm.jpg" },
  { breed: "Pomeranian", fact: "Pomeranians are very small but often have the personality of much larger dogs.", image: "https://cdn2.thedogapi.com/images/HyWNfxc47.jpg" },
  { breed: "Poodle", fact: "Poodles were originally water retrievers; their curly coat helps keep them warm while swimming.", image: "https://cdn2.thedogapi.com/images/S1ZfMl5E7.jpg" },
  { breed: "Rottweiler", fact: "Rottweilers were originally used to herd livestock and pull carts.", image: "https://cdn2.thedogapi.com/images/1lFmrzECl.jpg" },
  { breed: "Saint Bernard", fact: "Saint Bernards were originally bred for mountain rescue in the Swiss Alps.", image: "https://cdn2.thedogapi.com/images/9BXwUe5E7.jpg" },
  { breed: "Samoyed", fact: "Samoyeds are known for their 'Sammy smile' and were used for herding and pulling sleds.", image: "https://cdn2.thedogapi.com/images/rkZ2MxqEm.jpg" },
  { breed: "Shih Tzu", fact: "Shih Tzus were bred to be companion dogs for Chinese royalty and are known as 'little lions'.", image: "https://cdn2.thedogapi.com/images/BkrJjgcV7.jpg" },
  { breed: "Siberian Husky", fact: "Siberian Huskies can run up to 28 miles per hour and were originally bred as sled dogs.", image: "https://cdn2.thedogapi.com/images/SJ5vzx5NX.jpg" },
  { breed: "Yorkshire Terrier", fact: "Yorkshire Terriers were originally bred to catch rats in clothing mills.", image: "https://cdn2.thedogapi.com/images/B1svZg5Nm.jpg" }
];

// Utility Functions
function showError(msg){ errorDiv.textContent = msg; }
function clearError(){ errorDiv.textContent = ""; }
function showLoading(){ loadingDiv.classList.remove("hidden"); searchBtn.disabled = true; }
function hideLoading(){ loadingDiv.classList.add("hidden"); searchBtn.disabled = false; }

// API Functions
async function searchBreed(query){
  showLoading(); clearError();
  query = query.toLowerCase().trim();
  try {
    const res = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(query)}`);
    if(!res.ok) throw new Error("API search failed");
    const data = await res.json();
    // If API returns empty, fallback to local
    if(!data.length){
      return sampleDogFacts.filter(d => d.breed.toLowerCase().includes(query));
    }
    return data;
  } catch {
    return sampleDogFacts.filter(d => d.breed.toLowerCase().includes(query));
  } finally { hideLoading(); }
}

async function fetchDogImages(limit=1, breed_id=""){
  let url = `https://api.thedogapi.com/v1/images/search?limit=${limit}`;
  if(breed_id) url += `&breed_id=${breed_id}`;
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error("Failed to load images");
    return await res.json();
  }catch{ return []; }
}

async function fetchDogFact(){
  try{
    const res = await fetch('https://dog-api.kinduff.com/api/facts?number=1');
    if(!res.ok) throw new Error("Failed to load dog fact");
    const data = await res.json();
    return data.facts[0];
  }catch{ return null; }
}

// DOM Rendering
async function displaySampleBreeds(){
  resultsContainer.innerHTML = "";
  backBtn.classList.add("hidden");
  for(const breedObj of sampleDogFacts){
    let imageUrl = "";
    try{
      const res = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(breedObj.breed)}`);
      const data = await res.json();
      if(data[0]){
        const imgRes = await fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${data[0].id}&limit=1`);
        const imgData = await imgRes.json();
        imageUrl = imgData[0]?.url || "";
      }
    }catch{}
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      ${imageUrl?`<img src="${imageUrl}" alt="${breedObj.breed}">`:""}
      <h3>${breedObj.breed}</h3>
      <p><strong>Fun Fact:</strong> ${breedObj.fact}</p>
    `;
    resultsContainer.appendChild(card);
  }
}

async function displayBreeds(breeds){
  resultsContainer.innerHTML = "";
  backBtn.classList.remove("hidden");

  if(!breeds.length){
    const factsToShow = [];
    while(factsToShow.length<3){
      const rand = sampleDogFacts[Math.floor(Math.random()*sampleDogFacts.length)];
      if(!factsToShow.includes(rand)) factsToShow.push(rand);
    }
    factsToShow.forEach(f=>{
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `<p><strong>${f.breed}:</strong> ${f.fact}</p>`;
      resultsContainer.appendChild(card);
    });
    return;
  }

  for(const breed of breeds){
    let imageUrl = "";
    let breedName = breed.name || breed.breed;
    let temperament = breed.temperament || ""; 
    let life_span = breed.life_span || "";
    let weight = breed.weight?.metric || "";
    let height = breed.height?.metric || "";
    let fact = breed.fact || await fetchDogFact();

    if(breed.id){
      const imgs = await fetchDogImages(1, breed.id);
      imageUrl = imgs[0]?.url||"";
    }

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      ${imageUrl?`<img src="${imageUrl}" alt="${breedName}">`:""}
      <h3>${breedName}</h3>
      ${temperament?`<p><strong>Temperament:</strong> ${temperament}</p>`:""}
      ${life_span?`<p><strong>Life Span:</strong> ${life_span}</p>`:""}
      ${weight?`<p><strong>Weight:</strong> ${weight} kg</p>`:""}
      ${height?`<p><strong>Height:</strong> ${height} cm</p>`:""}
      ${fact?`<p><strong>Fun Fact:</strong> ${fact}</p>`:""}
    `;
    resultsContainer.appendChild(card);
  }
}

// Event Listeners
searchBtn.addEventListener("click", async()=>{
  const query = searchInput.value.trim();
  if(!query){ showError("Input cannot be empty"); return; }
  const breeds = await searchBreed(query);
  displayBreeds(breeds);
});

searchInput.addEventListener("keypress", e=>{
  if(e.key==="Enter") searchBtn.click();
});

backBtn.addEventListener("click", displaySampleBreeds);

toggleDarkBtn.addEventListener("click", ()=>{
  document.body.classList.toggle("dark-mode");
});

// Initial Display
window.addEventListener("DOMContentLoaded", displaySampleBreeds);
