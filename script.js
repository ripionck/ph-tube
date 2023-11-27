document.addEventListener('DOMContentLoaded', function () {
  const categoryButtons = document.querySelectorAll('.category-button');
  const sortButton = document.getElementById('sort-button');
  const allCategoryButton = document.getElementById('category-all');
  const videosContainer = document.getElementById('videos-container');

  // Initial active category (All)
  let activeCategory = '1000';
  let sortByViewsDescending = false;

  const loadAllData = () => {
    fetch("https://openapi.programming-hero.com/api/videos/category/1000")
      .then((res) => res.json())
      .then((data) => displayData(data.data));
  };

  const loadCategoryData = (category) => {
    fetch(`https://openapi.programming-hero.com/api/videos/category/${category}`)
      .then((res) => res.json())
      .then((data) => displayData(data.data));
  };

  const displayData = (data) => {
    videosContainer.innerHTML = '';

    if (data.length > 0) {
      // Sort data by views in descending order
      // data.sort((a, b) => (sortByViewsDescending ? parseInt(b.others.views) - parseInt(a.others.views) : parseInt(a.others.views) - parseInt(b.others.views)));
      data.sort((a, b) => (sortByViewsDescending ? parseInt(b.others.views) - parseInt(a.others.views) : null));
      data.forEach((item) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        // Given duration in seconds
        const durationInSeconds = item.others.posted_date;

        // Convert seconds to hours and minutes
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);

        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        thumbnail.innerHTML = `
                                <img src="${item.thumbnail}" alt="${item.title}">
                                ${item.others.posted_date ? `<p class="duration">${hours}hrs ${minutes}min ago</p>` : ''}
                              `;

        const details = document.createElement('div');
        details.className = 'details';

        details.innerHTML = `
          <div class="author">
            <img src="${item.authors[0].profile_picture}" alt="${item.authors[0].profile_name}">
          </div>

          <div>
            <p class="title">${item.title}</p>
            <p class="profile-title">${item.authors[0].profile_name} 
              <span>${item.authors[0].verified ? '<i class="fa-solid fa-certificate profile-verified"></i>' : ''}</span>
            </p>
            <p class="views">${item.others.views} views</p>
          </div>`;

        videoCard.appendChild(thumbnail);
        videoCard.appendChild(details);

        // Append the card to the videos container
        videosContainer.appendChild(videoCard);
      });
    } else {
      // If no data found, display a "not found" image
      const notFound = document.createElement('div');
      notFound.className = 'not-found';
      notFound.innerHTML =  `
                             <div>
                              <img src="./Icon.png" alt="Not Found">
                              <p class="not-found-message">Opps!! Sorry, There is no content here</p>
                             </div>
                            `
      videosContainer.appendChild(notFound);
    }
  };

  const setActiveCategory = (category) => {
    activeCategory = category;
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    categoryButtons.forEach(btn => {
      if (btn.getAttribute('data-category') === category) {
        btn.classList.add('active');
      }
    });
  };

  // Toggle the sort order on each click
  const toggleSortOrder = () => {
    sortByViewsDescending = !sortByViewsDescending;
  };

  categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
      const selectedCategory = button.getAttribute('data-category');
      setActiveCategory(selectedCategory);

      if (selectedCategory === '1000') {
        loadAllData();
      } else {
        loadCategoryData(selectedCategory);
      }
    });
  });

  sortButton.addEventListener('click', function () {
     toggleSortOrder();

    // Load data based on the current active category and sort order
    if (activeCategory === '1000') {
      loadAllData();
    } else {
      loadCategoryData(activeCategory);
    }
  });

  allCategoryButton.addEventListener('click', function () {
    // toggleSortOrder();
    // Load data based on the current active category and sort order
    if (activeCategory === '1000') {
      loadAllData();
    } else {
      loadCategoryData(activeCategory);
    }
  });

  // Fetch and display all data initially
  loadAllData();
});
