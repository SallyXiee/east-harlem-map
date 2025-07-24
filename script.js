const map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // vector tile basemap
    center: [-73.936, 40.799], // East Harlem
    zoom: 15
  });
  
  map.addControl(new maplibregl.NavigationControl(), 'top-right');
  
const infoPanel = document.getElementById('info-panel');
const infoContent = document.getElementById('info-content');
const closePanel = document.getElementById('close-panel');
closePanel.addEventListener('click', () => {
  infoPanel.classList.add('hidden');
});


map.on('load', async () => {
  // 加载sketch数据
  map.addSource('sketch', {
    type: 'geojson',
    data: 'sketch/sketch.geojson'
  });

  // 添加图层为圆点（近似正方形可调整）
  map.addLayer({
    id: 'sketch-layer',
    type: 'circle',
    source: 'sketch',
    paint: {
      'circle-radius': 6, // 圆点半径（看起来接近一个正方形）
      'circle-color': '#f1cd19ff', // 红色
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });


// 点击弹窗
map.on('click', 'sketch-layer', (e) => {
  const props = e.features[0].properties;
  const name = props.store_name || 'Unnamed Store';
  const culture = props.cultural_identity || 'a unique local culture';
  const products = props.products_sold || 'a range of interesting goods';
  const imageHTML = props.image ? `<img src="sketch/${props.image}" style="width:100%;margin-top:10px;">` : '';

const paragraph = `
  <h4>${name}</h4>
  <p>
    Nestled in the neighborhood, <strong>${name}</strong> represents <strong>${culture}</strong>.<br/>
    This store offers <strong>${products}</strong>, making it a delightful destination for those exploring local culture and commerce.
  </p>
  ${imageHTML}
`;



  infoContent.innerHTML = paragraph;
  infoPanel.classList.remove('hidden');
});


// toggle 开关
document.getElementById('sketch-toggle').addEventListener('change', (e) => {
  map.setLayoutProperty(
    'sketch-layer',
    'visibility',
    e.target.checked ? 'visible' : 'none'
  );
});


// 加载 Retail Food Stores 数据
map.addSource('retail-stores', {
  type: 'geojson',
  data: 'datasets/retail_food_stores.geojson' // 确保路径正确
});

map.addLayer({
  id: 'retail-stores-layer',
  type: 'circle',
  source: 'retail-stores',
  paint: {
    'circle-radius': 4,
    'circle-color': '#27AE60',
    'circle-stroke-width': 1,
    'circle-stroke-color': '#ffffff'
  }
});


map.on('click', 'retail-stores-layer', (e) => {
  const props = e.features[0].properties;

  const name = props.name || 'Unnamed Place';
  const vicinity = props.vicinity || '';
  const types = props.types ? (Array.isArray(props.types) ? props.types.join(', ') : props.types) : '';
  const rating = props.rating || '';
  const ratingTotal = props.user_ratings_total || '';
  const priceLevel = props.price_level ? '$'.repeat(props.price_level) : '';
  const status = props.business_status || '';
  const openNow = props.opening_hours && props.opening_hours.open_now !== undefined
    ? (props.opening_hours.open_now ? 'Yes' : 'No')
    : 'Unknown';

  const lat = e.lngLat.lat;
  const lng = e.lngLat.lng;

  // 商家照片（从 photo_reference 加载）
  const photoRef = props.photos ? JSON.parse(props.photos)[0]?.photo_reference : null;

  const placePhoto = photoRef
    ? `<img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=AIzaSyAaQEJf1rzTf1NJeK3SMj32IiBfQHV6jP4"
         alt="Place Photo" style="width:100%; margin-top:10px;" />`
    : '';

  // 交互式街景 iframe
  const streetViewIframe = `
    <div style="width:100%; height:300px; margin-top:10px;">
      <iframe
        width="100%"
        height="100%"
        frameborder="0"
        style="border:0"
        src="https://www.google.com/maps/embed/v1/streetview?location=${lat},${lng}&fov=80&heading=70&pitch=0&key=AIzaSyAaQEJf1rzTf1NJeK3SMj32IiBfQHV6jP4"
        allowfullscreen>
      </iframe>
    </div>
  `;

  infoContent.innerHTML = `
    <h4>${name}</h4>
    <p>
      ${vicinity ? `<strong>Address:</strong> ${vicinity}<br/>` : ''}
      ${types ? `<strong>Types:</strong> ${types}<br/>` : ''}
      ${rating ? `<strong>Rating:</strong> ${rating} / 5 (${ratingTotal} reviews)<br/>` : ''}
      ${priceLevel ? `<strong>Price Level:</strong> ${priceLevel}<br/>` : ''}
      ${status ? `<strong>Status:</strong> ${status}<br/>` : ''}
      <strong>Open Now:</strong> ${openNow}<br/>
    </p>
    ${streetViewIframe}
  `;
  infoPanel.classList.remove('hidden');
});






document.getElementById('retail-toggle').addEventListener('change', (e) => {
  map.setLayoutProperty(
    'retail-stores-layer',
    'visibility',
    e.target.checked ? 'visible' : 'none'
  );
});

// ---------- YES Stores ----------
map.addSource('stores-yes', {
  type: 'geojson',
  data: 'datasets/stores_yes_with_images_UPDATED.geojson' // 确保路径正确
});

map.addLayer({
  id: 'stores-yes-layer',
  type: 'circle',
  source: 'stores-yes',
  paint: {
    'circle-radius': 5,
    'circle-color': '#2E86AB',
    'circle-stroke-width': 1,
    'circle-stroke-color': '#ffffff'
  }
});


map.on('click', 'stores-yes-layer', (e) => {
  const props = e.features[0].properties;
  const name = props.Store_name || 'Unnamed Store';
  const imageFile = props.image_file || '';
  const storeType = props.Store_type || '';
  const culture = props.What_culture_is_this_tore_associated_with || '';
  const products = props.What_kind_of_things_can_you_bu || '';
  const languages = props.What_languages_do_the_store_ow || '';
  const neighborhood = props.How_would_you_descri_ith_the_neighborhood || '';
  const events = props.Does_this_store_regu_or_community_events || '';
  const size = props.Store_size || '';
  const status = props.Current_status_of_the_store || '';
  const surveyDate = props.Survey_date ? props.Survey_date.split("T")[0] : '';
  const notes = props.Additional_notes_or_rds_music_displays || '';
  const rating = props.How_would_you_rate_this_store || '';
  const specificItems = props.What_kind_of_culturally_specific_items || '';

  const imageHTML = imageFile ? `<img src="KoboImages/${imageFile}" style="width:100%; margin-top:10px;">` : '';

  infoContent.innerHTML = `
    <h4>${name}</h4>
    <p>
      ${storeType ? `<strong>Type:</strong> ${storeType}<br/>` : ''}
      ${culture ? `<strong>Culture:</strong> ${culture}<br/>` : ''}
      ${products ? `<strong>Products:</strong> ${products}<br/>` : ''}
      ${specificItems ? `<strong>Specific Cultural Items:</strong> ${specificItems}<br/>` : ''}
      ${languages ? `<strong>Languages Spoken:</strong> ${languages}<br/>` : ''}
      ${neighborhood ? `<strong>Community Role:</strong> ${neighborhood}<br/>` : ''}
      ${events ? `<strong>Events:</strong> ${events}<br/>` : ''}
      ${size ? `<strong>Store Size:</strong> ${size}<br/>` : ''}
      ${status ? `<strong>Status:</strong> ${status}<br/>` : ''}
      ${rating ? `<strong>Rating:</strong> ${rating} / 5<br/>` : ''}
      ${surveyDate ? `<strong>Surveyed:</strong> ${surveyDate}<br/>` : ''}
      ${notes ? `<strong>Notes:</strong> ${notes}<br/>` : ''}
    </p>
    ${imageHTML}
  `;
  infoPanel.classList.remove('hidden');
});



// ---------- NO Stores ----------
map.addSource('stores-no', {
  type: 'geojson',
  data: 'datasets/stores_no_with_images_UPDATED.geojson'
});

map.addLayer({
  id: 'stores-no-layer',
  type: 'circle',
  source: 'stores-no',
  paint: {
    'circle-radius': 5,
    'circle-color': '#D64550',
    'circle-stroke-width': 1,
    'circle-stroke-color': '#ffffff'
  }
});



map.on('click', 'stores-no-layer', (e) => {
  const props = e.features[0].properties;
  const name = props.Store_name || 'Unnamed Store';
  const imageFile = props.image_file || '';
  const storeType = props.Store_type || '';
  const culture = props.What_culture_is_this_tore_associated_with || '';
  const products = props.What_kind_of_things_can_you_bu || '';
  const specificItems = props.What_kind_of_culturally_specific_items || '';
  const languages = props.What_languages_do_the_store_ow || '';
  const neighborhood = props.How_would_you_descri_ith_the_neighborhood || '';
  const events = props.Does_this_store_regu_or_community_events || '';
  const size = props.Store_size || '';
  const status = props.Current_status_of_the_store || '';
  const surveyDate = props.Survey_date ? props.Survey_date.split("T")[0] : '';
  const notes = props.Additional_notes_or_rds_music_displays || '';
  const rating = props.How_would_you_rate_this_store || '';

  const imageHTML = imageFile ? `<img src="KoboImages/${imageFile}" style="width:100%; margin-top:10px;">` : '';

  infoContent.innerHTML = `
    <h4>${name}</h4>
    <p>
      ${storeType ? `<strong>Type:</strong> ${storeType}<br/>` : ''}
      ${culture ? `<strong>Culture:</strong> ${culture}<br/>` : ''}
      ${products ? `<strong>Products:</strong> ${products}<br/>` : ''}
      ${specificItems ? `<strong>Specific Cultural Items:</strong> ${specificItems}<br/>` : ''}
      ${languages ? `<strong>Languages Spoken:</strong> ${languages}<br/>` : ''}
      ${neighborhood ? `<strong>Community Role:</strong> ${neighborhood}<br/>` : ''}
      ${events ? `<strong>Events:</strong> ${events}<br/>` : ''}
      ${size ? `<strong>Store Size:</strong> ${size}<br/>` : ''}
      ${status ? `<strong>Status:</strong> ${status}<br/>` : ''}
      ${rating ? `<strong>Rating:</strong> ${rating} / 5<br/>` : ''}
      ${surveyDate ? `<strong>Surveyed:</strong> ${surveyDate}<br/>` : ''}
      ${notes ? `<strong>Notes:</strong> ${notes}<br/>` : ''}
    </p>
    ${imageHTML}
  `;
  infoPanel.classList.remove('hidden');
});




// ---------- Toggle Controls ----------
document.getElementById('yes-toggle').addEventListener('change', (e) => {
  map.setLayoutProperty(
    'stores-yes-layer',
    'visibility',
    e.target.checked ? 'visible' : 'none'
  );
});

document.getElementById('no-toggle').addEventListener('change', (e) => {
  map.setLayoutProperty(
    'stores-no-layer',
    'visibility',
    e.target.checked ? 'visible' : 'none'
  );
});

// -------- INTRO PAGE LOGIC --------
document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const current = btn.parentElement;
    const nextId = btn.dataset.next;
    const next = document.getElementById(`intro-page-${nextId}`);
    if (current && next) {
      current.classList.add('hidden');
      next.classList.remove('hidden');
    }
  });
});

document.querySelectorAll('.prev-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const prevPageId = 'intro-page-' + btn.getAttribute('data-prev');
    document.querySelectorAll('.intro-page').forEach(p => p.classList.add('hidden'));
    document.getElementById(prevPageId).classList.remove('hidden');
  });
});


document.getElementById('enter-btn').addEventListener('click', () => {
  document.getElementById('intro-screen').style.display = 'none';
});

document.getElementById('back-to-intro-btn').addEventListener('click', () => {
  document.getElementById('intro-screen').style.display = 'flex';

  // 确保只显示第一页
  document.querySelectorAll('.intro-page').forEach(p => p.classList.add('hidden'));
  document.getElementById('intro-page-1').classList.remove('hidden');
});

document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('data-next');
    document.querySelectorAll('.intro-page').forEach(page => page.classList.add('hidden'));
    document.getElementById(`intro-page-${next}`).classList.remove('hidden');
  });
});

document.querySelectorAll('.prev-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const prev = btn.getAttribute('data-prev');
    document.querySelectorAll('.intro-page').forEach(page => page.classList.add('hidden'));
    document.getElementById(`intro-page-${prev}`).classList.remove('hidden');
  });
});

document.getElementById('enter-btn').addEventListener('click', () => {
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('map').style.display = 'block';
  document.getElementById('back-to-intro-btn').classList.remove('hidden');
});

document.getElementById('contribute-btn').addEventListener('click', () => {
  window.open('form.html', '_blank');
});

document.getElementById('mindmap-btn').addEventListener('click', () => {
  window.open('mindmap.html', '_blank');
});

});
  