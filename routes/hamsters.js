import express from 'express'
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../database.js'

const colRef = collection(db, 'Hams')
const router = express.Router()

// GET all hamsters
router.get('/', async (req, res) => {
    let allHamsters = [];
  const snapshot = await getDocs(colRef);
  snapshot.docs.forEach((doc) => {
    allHamsters.push({ ...doc.data(), id: doc.id });
  });
  res.status(200).send(allHamsters);
});


// GET random hamster
router.get('/random', async (req, res) => {
	let randomHamsters = [];
	const snapshot = await getDocs(colRef);
	snapshot.docs.forEach((doc) => {
	  randomHamsters.push({ ...doc.data(), id: doc.id });
	});
	let randomNumber = Math.floor(Math.random() * randomHamsters.length);
	console.log(randomHamsters[randomNumber]);
	res.status(200).send(randomHamsters[randomNumber]);
  });


//GET hamster with id
router.get('/:id', async (req, res) => {
		const docRef = doc(colRef, req.params.id)
		const snapshot = await getDoc(docRef)
		const data = snapshot.data()
		if (snapshot.exists()) {
		  res.status(200).send(data)
		  return
		}
		res.sendStatus(404)
	  })


// POST hamster        
router.post('/', async (req, res) => {
		if (
		  req.body.loves.length === 0 ||
		  req.body.games.length === 0 ||
		  req.body.imgName.length === 0 ||
		  req.body.name.length === 0 ||
		  req.body.wins.length === 0 ||
		  req.body.favFood.length === 0 ||
		  req.body.age.length === 0 ||
		  req.body.defeats.length === 0
		) {
		  res.sendStatus(400)
		  return
		} else {
		  const newHamster = {
			loves: req.body.loves,
			games: Number(req.body.games),
			imgName: req.body.imgName,
			name: req.body.name,
			wins: Number(req.body.wins),
			favFood: req.body.favFood,
			age: Number(req.body.age),
			defeats: Number(req.body.defeats),
		  }
		  const addedHamster = await addDoc(colRef, newHamster)
		  res.status(200).send({ id: addedHamster.id })
		}
	  })


// PUT hamster        
router.put('/:id', async (req, res) => {
	if (Object.keys(req.body).length === 0) {
	  res.sendStatus(400)
	  return
	}
  
	const docRef = doc(colRef, req.params.id)
	const newData = req.body
	const snapshot = await getDoc(docRef)
  
	if (snapshot.exists()) {
	  await updateDoc(docRef, newData)
	  res.sendStatus(200)
	  return
	}
	res.sendStatus(404)
  })

// DELETE hamster    
router.delete('/:id', async (req, res) => {
	const docRef = doc(colRef, req.params.id)
	const snapshot = await getDoc(docRef)
  
	if (snapshot.exists()) {
	  await deleteDoc(docRef)
	  res.sendStatus(200)
	  return
	} else {
	  res.sendStatus(404)
	}
  });

export default router