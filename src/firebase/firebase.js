// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8zPhFS2DfkwzOP3pGVSlV9XNl1zjNN_A",
  authDomain: "atlas-dicom-reader.firebaseapp.com",
  projectId: "atlas-dicom-reader",
  storageBucket: "atlas-dicom-reader.appspot.com",
  messagingSenderId: "52802975342",
  appId: "1:52802975342:web:49200f647911c17d98987f",
  measurementId: "G-1T4QEKXYHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage(app);

//Upload ArrayBuffer
async function uploadArrayBuffer(arrayBuffer, nomeArquivo, nomePasta) {
    try {
       // Inicializa o Firestore e o Storage
       const db = getFirestore();
       const storage = getStorage();

       // Cria uma referência para o arquivo no Storage
       const storageRef = ref(storage, `${nomePasta}/${nomeArquivo}`);

       // Faz o upload do ArrayBuffer para o Storage
       const snapshot = await uploadBytes(storageRef, arrayBuffer);
       console.log("Upload do ArrayBuffer concluído:", snapshot);

       // Obter a URL de download do arquivo
       const downloadURL = await getDownloadURL(storageRef);

       // Cria um documento na coleção "archives" no Firestore
       const docRef = await addDoc(collection(db, 'archives'), {
           pasta: nomePasta, // Salva o nome da pasta
           arquivo: nomeArquivo, // Salva o nome do arquivo
           timestamp: new Date(), // Adiciona um timestamp para ordenação ou rastreamento
           storagePath: `${nomePasta}/${nomeArquivo}` // Salva o caminho do arquivo no Storage
       });

       console.log("Documento adicionado com ID:", docRef.id);

       return downloadURL;
    } catch (error) {
        console.error("Erro ao fazer upload:", error);
        return false;
    }
}

export { storage, uploadArrayBuffer };
