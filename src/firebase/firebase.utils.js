import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyBviR-O2tD0P3pHlVjxeMhoxM-dY5x0ahw",
    authDomain: "knihodivocak.firebaseapp.com",
    databaseURL: "https://knihodivocak.firebaseio.com",
    projectId: "knihodivocak",
    storageBucket: "knihodivocak.appspot.com",
    messagingSenderId: "50327403666",
    appId: "1:50327403666:web:6ebe9af855b3fcd649fa4b"
};

firebase.initializeApp(config);

const firestore = firebase.firestore();

export const getWordData = async word => {
    const wordsRef = firestore.collection('words');
    let wordData = await wordsRef.where('word', "==", word).get();
    let wordDataMeaning = 'brak definicji';
    wordData = wordData.forEach(
        doc => {console.log(doc.data().meaning);
            wordDataMeaning = doc.data().meaning;}
    )
    return wordDataMeaning;
}


export default firebase;