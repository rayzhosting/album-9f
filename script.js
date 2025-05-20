
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7KzAhTbO2IfMcunIjxnunRFKKvzvWftU",
  authDomain: "album-9f.firebaseapp.com",
  projectId: "album-9f",
  storageBucket: "album-9f.appspot.com",
  messagingSenderId: "849462298633",
  appId: "1:849462298633:web:862334c0c18aa73be010d8",
  measurementId: "G-N1454S6EY5"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const uploadBtn = document.getElementById('uploadBtn');
const imageFile = document.getElementById('imageFile');
const caption = document.getElementById('caption');
const year = document.getElementById('year');
const gallery = document.getElementById('gallery');

uploadBtn.addEventListener('click', async () => {
  const file = imageFile.files[0];
  const captionVal = caption.value.trim();
  const yearVal = year.value.trim();

  if (!file || !captionVal || !yearVal) {
    alert('Lengkapi semua field!');
    return;
  }

  const storageRef = ref(storage, 'images/' + file.name);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'photos'), {
    url,
    caption: captionVal,
    year: yearVal,
    createdAt: new Date()
  });

  alert('Upload berhasil!');
  loadGallery();
});

async function loadGallery() {
  gallery.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, 'photos'));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const img = document.createElement('img');
    img.src = data.url;
    img.alt = data.caption;
    gallery.appendChild(img);
  });
}

window.addEventListener('load', loadGallery);
