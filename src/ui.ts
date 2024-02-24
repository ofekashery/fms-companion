import express from 'express';
import ejs from 'ejs';
import scenes from './scenes';
import buttonsConfig from './buttons-config';

const PORT = 8081;

export const setupUiServer = () => {
  const app = express();
  app.engine('html', ejs.renderFile);
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    const values = buttonsConfig.getAll();
    return res.render('index.html', { scenes, values });
  });
  app.post('/', async (req, res) => {
    buttonsConfig.setAll(req.body);
    await buttonsConfig.save();
    return res.render('index.html', { scenes, values: req.body });
  });

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};
