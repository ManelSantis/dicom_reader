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
    apiKey: "AIzaSyDQEN8QsepWZYb8eKV6ilWOTwVlUYe39n4",
    authDomain: "atlas-radiografico-reader.firebaseapp.com",
    projectId: "atlas-radiografico-reader",
    storageBucket: "atlas-radiografico-reader.appspot.com",
    messagingSenderId: "837550839679",
    appId: "1:837550839679:web:44257a233311ec8f742c4a"
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
