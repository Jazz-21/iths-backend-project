import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express();
import hamsters from './routes/hamsters.js'

const PORT = process.env.PORT || 1999;
//const staticFolder = path.join(__dirname, 'public');
const picsFolder = path.join(__dirname, 'HamPics');
//Middleware
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
	console.log(`${req.method} ${req.url}`, req.params);
	next();
});

app.use( express.json() );
app.use( cors() );
//app.use( express.static(staticFolder) );
app.use('/HamPics', express.static(picsFolder) );



// api for hamsters
app.use('/hamsters', hamsters);



//Starting server
app.listen(PORT, () => {
	console.log('Server is listening on port ' + PORT)
})