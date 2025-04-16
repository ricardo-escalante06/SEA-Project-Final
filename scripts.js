/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 */

const songsList = [];
const albumList = [];
let currentList = songsList;
const displayList = [];
let Showing = 8;
let isAlphabeticalOrder = false;
let isViewsOrder = false;
let mode = "Song";
let toAdd = false;



// When the page is first loaded, it will fill songsList[] from the CSV file
document.addEventListener("DOMContentLoaded", function () {
  fetch("./assets/MyYTMusicDataset.csv").then(response => response.text()).then(csvText => {
    const parsed = Papa.parse(csvText, {
      header: true,
    });

    parsed.data.forEach(row => {
      song = {
        name: row.name,
        artist: row.artist,
        thumbnailURL: row.thumbnailURL,
        album: row.album,
        link: row.link,
        length: row.length,
        views: row.views,
        date: row.date,
        albumYear: row.albumYear,
        albumThumbnail: row.albumThumbnail
      };

      songsList.push(song);
    });

    //Fills albumList[]
    fillAlbumList();
    showCards(songsList, Showing);
  })

  //Intial Button On
  let SongButton = document.getElementById('song-button');
  SongButton.classList.add('active');
  SongButton.classList.remove('deactive');
});


// This function adds cards the page to display the data in the array
function showCards(list, amount=list.length) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  const templateCard = document.querySelector(".card");
              
  for (let i = 0; i < amount; i++) {

    let songThumbnailUrl = list[i].thumbnailURL;
    let songName = list[i].name;
    let songArtist = list[i].artist;
    let songAlbum = list[i].album;
    let songViews = list[i].views;
    let songReleased = list[i].date;
    let songLink = list[i].link;
    let songTime = list[i].length;
    let albumThumbnailURL = list[i].albumThumbnail;
    let albumYear = list[i].albumYear;

    displayList[i] = list[i];

    const nextCard = templateCard.cloneNode(true); // Copy the template card
    nextCard.style.display = "block";
    editCardContentSongs(nextCard, songThumbnailUrl, songName, songArtist, songAlbum, songViews, songReleased, songLink, songTime, albumThumbnailURL, albumYear); // Edit title and image
    cardContainer.appendChild(nextCard); // Add new card to the container
  }
}

// Edits the cards
function editCardContentSongs(card, songThumbnailUrl, songName, songArtist, songAlbum, songViews, songReleased, songLink, songTime, albumThumbnail, albumYear) {
  card.style.display = "block";

  if (mode == "Song") {
    // Card Data for Song filter
    const cardImage = card.querySelector("img");
    cardImage.src = songThumbnailUrl;
    cardImage.alt = songName + "'s Thumbnail: " + songThumbnailUrl;

    const cardHeader = card.querySelector("h2");
    cardHeader.innerHTML = "";

    const cardLink = document.createElement("a");
    cardLink.href = songLink;
    cardLink.textContent = songName;
    cardLink.target = "_blank";
    cardLink.style.color = "white";

    cardHeader.appendChild(cardLink);
    cardHeader.innerHTML += " - " + songArtist;

    const cardAlbum = card.querySelector("h3");
    cardAlbum.textContent = "Album: " + songAlbum;

    const cardViews = card.querySelector("h4");
    cardViews.textContent = "Views: " + Intl.NumberFormat('en-US').format(songViews); //Adds , to the numbers

    const cardDate = card.querySelector("h5");
    cardDate.textContent = "Released: " + songReleased;

    const cardTime = card.querySelector("h6");
    cardTime.textContent = songTime;
  } else {
    // Card Data for Album filter
    const cardImage = card.querySelector("img");
    cardImage.src = albumThumbnail;
    cardImage.alt = songName + "'s Thumbnail: " + albumThumbnail;

    const cardAlbum = card.querySelector("h2");
    cardAlbum.textContent = "Album: " + songAlbum;

    const cardArtist = card.querySelector("h3");
    cardArtist.textContent = "Artist: " + songArtist;

    const cardYear = card.querySelector("h4");
    cardYear.textContent = "Year Released: " + albumYear;

    const cardDate = card.querySelector("h5");
    cardDate.innerHTML = ""; // Clear existing content

    const cardTime = card.querySelector("h6");
    cardTime.innerHTML = ""; // Clear existing content
  }
}

// Alphabetic Sort Code

function alphabeticalOrder() {
  isAlphabeticalOrder = !isAlphabeticalOrder;
  const dropdownBtn = document.getElementById('sort-alpha');


  if (isAlphabeticalOrder == true) {
    if (isViewsOrder == true) {
      isViewsOrder = false;

      const ViewsdropdownBtn = document.getElementById('sort-views');
      ViewsdropdownBtn.classList.remove('active');
      ViewsdropdownBtn.classList.add('deactive');
    }
    
    const songsListAlphabetical = mergeSortName(displayList);
    currentList = songsListAlphabetical;
    showCards(songsListAlphabetical, Showing);

    dropdownBtn.classList.add('active');
    dropdownBtn.classList.remove('deactive');
  } else {
    if (mode == "Song") {
      showCards(songsList, Showing);
    } else {
      showCards(albumList, Showing);
    }

    dropdownBtn.classList.remove('active');
    dropdownBtn.classList.add('deactive');
  }
  
}

// MergeSort Strings

function mergeSortName(list) {
  if (list.length == 1) {
    return list;
  }

  const mid = Math.floor(list.length/2);

  const firstHalf = [];

    for (x = 0; x < mid; x++) {
      firstHalf.push(list[x]);
    }
  
  const left = mergeSortName(firstHalf);

  const secondHalf = [];

    for (let x = mid; x < list.length; x++) {
      secondHalf.push(list[x]);
    }

  const right = mergeSortName(secondHalf);


  return mergeName(left, right);
}

// MergeSort String Helper

function mergeName(left, right) {
  const result = [];

  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex].name.toLowerCase() > right[rightIndex].name.toLowerCase()) {
      result.push(right[rightIndex]);
      rightIndex++;
    } else {
      result.push(left[leftIndex]);
      leftIndex++;
    }
  }

  for (let x = leftIndex; x < left.length; x++) {
    result.push(left[x]);
  }

  for (let y = rightIndex; y < right.length; y++) {
    result.push(right[y]);
  }

  return result;
}

// Views Sort Code

function viewsOrder() {
  isViewsOrder = !isViewsOrder;
  const dropdownBtn = document.getElementById('sort-views');


  if (isViewsOrder == true) {
    if (isAlphabeticalOrder == true) {
      isAlphabeticalOrder = false;

      const ViewsdropdownBtn = document.getElementById('sort-alpha');
      ViewsdropdownBtn.classList.remove('active');
      ViewsdropdownBtn.classList.add('deactive');
    }
    
    const songsListViews = mergeSortViews(displayList);
    currentList = songsListViews;

    showCards(songsListViews, Showing);

    dropdownBtn.classList.add('active');
    dropdownBtn.classList.remove('deactive');
  } else {
    showCards(songsList, Showing);

    dropdownBtn.classList.remove('active');
    dropdownBtn.classList.add('deactive');
  }
  
}

// MergeSort Int

function mergeSortViews(list) {
  
  if (list.length == 1) {
    return list;
  }

  const mid = Math.floor(list.length/2);

  const firstHalf = [];

    for (x = 0; x < mid; x++) {
      firstHalf.push(list[x]);
    }
  
  const left = mergeSortViews(firstHalf);

  const secondHalf = [];

    for (let x = mid; x < list.length; x++) {
      secondHalf.push(list[x]);
    }

  const right = mergeSortViews(secondHalf);

  return mergeViews(left, right);
}

//MergeSort Int Helper

function mergeViews(left, right) {
  const result = [];

  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (parseInt(left[leftIndex].views) < parseInt(right[rightIndex].views)) {
      result.push(right[rightIndex]);
      rightIndex++;
    } else {
      result.push(left[leftIndex]);
      leftIndex++;
    }
  }

  for (let x = leftIndex; x < left.length; x++) {
    result.push(left[x]);
  }

  for (let y = rightIndex; y < right.length; y++) {
    result.push(right[y]);
  }

  return result;
}

// Shows songs based on toAdd

function show() {
  console.log(toAdd)
  if (mode == "Song" && toAdd == true) {
      if (isAlphabeticalOrder == true) {
        let alphaList = mergeSortName(songsList);
        currentList = alphaList;
        showCards(alphaList, Showing);
      } else if (isViewsOrder == true) {
        let viewsList = mergeSortViews(songsList);
        currentList = viewsList;
        showCards(viewsList, Showing);
      } else {
        showCards(songsList, Showing);
      }

      toAdd=false;
  } else if (mode == "Album" && toAdd == true) {
    if (isAlphabeticalOrder == true) {
      let alphaList = mergeSortName(albumList);
      currentList = alphaList;
      showCards(alphaList, Showing);
    } else if (isViewsOrder == true) {
      let viewsList = mergeSortViews(albumList);
      currentList = viewsList;
      showCards(viewsList, Showing);
    } else {
      showCards(albumList, Showing);
    }

    toAdd=false;
  }  
}

// Add button code

function addButton() {
  addButton = document.getElementById("add-More");
  addButton.remove();
  if (mode == "Song") {
    Showing = songsList.length;
  } else 
  {
    Showing = albumList.length;
  }
  toAdd = true;
  show();
}

// Song button code

function songButton() {

  if (mode == "Album") {
    let albumButton = document.getElementById('album-button');
    albumButton.classList.remove('active');
    albumButton.classList.add('deactive');
  }
  mode = "Song";
  viewsButton = document.getElementById("sort-views");
  viewsButton.style.display = "grid";

  let songButton = document.getElementById('song-button');
  songButton.classList.add('active');
  songButton.classList.remove('deactive');
  
  if (isAlphabeticalOrder == false && isViewsOrder == false) {
    currentList = songsList;
  }
  
  showCards(currentList, Showing);
  show();
  
}

// Album button code

function albumButton() {
  if (mode == "Song") {
    let songButton = document.getElementById('song-button');
    songButton.classList.remove('active');
    songButton.classList.add('deactive');
  }
  viewsButton = document.getElementById("sort-views");
  viewsButton.style.display = "none";

  mode = "Album";
  let albumButton = document.getElementById('album-button');
  albumButton.classList.add('active');
  albumButton.classList.remove('deactive');

  if (isAlphabeticalOrder == false && isViewsOrder == false) {
    currentList = albumList;
  }

  showCards(currentList, Showing);
  show();
}

// Fills AlbumList[] (filters out repeating albums)

function fillAlbumList() {
  for (let x = 0; x < songsList.length; x++) {
    let albumAlreadyExists = false;

    for (let y = 0; y < albumList.length; y++) {
      if (songsList[x].album === albumList[y].album) {
        albumAlreadyExists = true;
        break;
      }
    }

    if (!albumAlreadyExists) {
      albumList.push(songsList[x]);
    }
  }
  console.log(albumList);
}

// Search bar code

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-Input");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredSongs;

    if (mode == "Song") {
      filteredSongs = songsList.filter(song =>
        song.name.toLowerCase().includes(searchTerm)
      );
    } else {
      filteredSongs = albumList.filter(song =>
        song.album.toLowerCase().includes(searchTerm)
      );
    }

    console.log(searchTerm);
    showCards(filteredSongs);
    if (searchTerm == "") {
      console.log("Empty");
      showCards(currentList);
    }
  });
});
