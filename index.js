const express = require('express');
const axios = require('axios');
const sharp = require('sharp');

const app = express();
const port = 3300;

const UNSPLASH_ACCESS_KEY = 'p0QXg3dE5ovYya3menT-grAK5w1AXoqNJQ5YLc9VGzY';

app.get('/api/images/random', async (req, res) => {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    console.log(response);
    const imageUrl = response.data.urls.regular;
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    const width = 500;  
    const height = 350; 

    const resizedImage = await sharp(imageResponse.data)
      .resize(width, height)
      .toBuffer();

    res.set('Content-Type', imageResponse.headers['content-type']);
    res.set('Content-Length', resizedImage.length);

    res.send(resizedImage);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error to fetch random image' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
