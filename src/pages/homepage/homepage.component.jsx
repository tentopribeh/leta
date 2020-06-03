import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from 'react';

import wtf from 'wtf_wikipedia';

import exampleText from '../../data/default-text';
import { ReactComponent as Logo} from '../../data/loader.svg';

import './homepage.styles.scss';

const HomePage = () => {
    const [text, setText] = React.useState(exampleText);
    const [mostFrequentWords, setMostFrequentWords] = React.useState([]);
    const [wordsLimit, setWordsLimit] = React.useState(20);
    const [wordsOffset, setWordsOffset] = React.useState(0);
    const [loadingStarted, setLoadingStarted] = React.useState(false)
    console.clear();
    console.log(`cze­kam cze­kam wy­trwa­le
    tak lek­ko do­ty­ka­ją mnie dni
    moja tę­sk­no­ta jest tę­sk­no­tą pla­net
    zmar­z­łych tę­sk­nią­cych do słoń­ca
    jest zno­wu wie­czór
    po dachach ślizga się blask księżyca
    wą­skie wie­że ko­ścio­łów na­kłu­wa­ją nie­bo
    i dni tak lek­ko bie­gną nie wia­do­mo gdzie `)
    console.log(`<3`)
    console.log('%c ', 'font-size:1px; padding: 100px 150px; background:url(https://66.media.tumblr.com/36584c3bb4ad641e9060ced5756c85d2/tumblr_pi2opgP0Tw1u8pg83o1_640.png) no-repeat; background-size: contain;');

    const WORDS_LIMIT_MAX = 100;
    const WORDS_OFFSET_MAX = 1000000;

    const handleChange = async event => {
        const { value } = event.target;
        await setText(value);
    } 

    const handleSubmit = async event => {
        event.preventDefault();
        await setLoadingStarted(true);
        await setMostFrequentWords([]);
        await chooseWords(text);
    }

    const handleClean = async event => {
        event.preventDefault();
        setText('');
    }

    const handleRandom = async event => {
        event.preventDefault();
        setText(exampleText);
    }

    const handlePagination = async event => {
        let { name, value } = event.target;
        if (value < 0) return;
        if(name === 'wordsOffset') {
            value = Math.min(value, WORDS_OFFSET_MAX);
            setWordsOffset(value)
        } else {
            value = Math.min(value, WORDS_LIMIT_MAX);
            setWordsLimit(value) 
        }       
    }

    const chooseWords = async textToEdit => {
        textToEdit = textToEdit.toLowerCase();
        textToEdit = textToEdit.replace(/[&/\\#,+=()$~%.'0-9":;*_?<>{}\n]/g, ' ');

        let wordsList = textToEdit.split(" ");

        // filter out not wanted words
        wordsList = wordsList.filter(word=> !['-', '–', ' ', ''].includes(word))
        // count words
        const wordsDictionary = {};

        for(const word of wordsList) {
            if(word in wordsDictionary){
                wordsDictionary[word]++;
            } else {
                wordsDictionary[word] = 1;
            }
        }

        let items = await Promise.all(Object.keys(wordsDictionary).map(async function(key) {

            return [key, wordsDictionary[key]]
        }));

        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        items = items.slice(wordsOffset, wordsLimit + wordsOffset)

        items = await Promise.all(items.map(async function(item) {
            const fetchedText = await wtf.fetch(`https://cs.wiktionary.org/wiki/${item[0]}`);

            if(!fetchedText)
                return [item[0], item[1], 'brak definicji']

            let meaning = fetchedText.sections('čeština') ? fetchedText.sections('čeština').sections('význam') : fetchedText.sections('význam')
            meaning = meaning || 'brak definicji';
            let meaningText = await wtf(meaning.data.wiki).text();
            while(meaningText.indexOf('*') !== -1) {
                meaningText = meaningText.replace('*', '\n');
                meaningText = meaningText.replace(/[0-9]\)/, ' \n ')
            }
            return [item[0], item[1], meaningText ]// await getWordData(key)]
        }));
        

        await setMostFrequentWords(items)
        
        // Create a new array with only the first 5 items
        
        return wordsDictionary;
    }

    const colors = ['pink', 'peach', 'millenial', 'yellow', 'mint', 'beige', 'blue', 'blue2' ];
    
    return(
        <div className='home-page'>

            <div className='words-list-box'>
                {(mostFrequentWords.length === 0 && loadingStarted) &&  <Logo className="loader" /> }
                {(mostFrequentWords.length === 0 && !loadingStarted) &&  <div>
                    <div className='blank-info'>Click generate to create a dictionary</div>
                    </div> }
                <div className='words-list'>
                    {mostFrequentWords.map(word => {
                        const index =  parseInt(Math.random() * colors.length, 10)
                        const additionalStyle = colors[index];
                        return(
                        <div className='word-box' key={word[0]}>
                            <div className='word-icon'><FontAwesomeIcon className={`${additionalStyle}`} icon={['fas', 'circle']} /></div>
                            <div className='word'>{word[0]}</div>
                            <div className='word-number'>&nbsp;&nbsp;{word[1]}</div>
                            <div className='word-meaning'>, {word[2].slice(0,60)}...</div></div>)
                        })}
                </div>
            </div>
            <div className='text-input-box'>
                <div className='title'>Tento zpusob</div>
                <div className='explanation'>Paste text below and change it into book specific dictionary</div>
                <form onSubmit={handleSubmit}>
                    <div className="text-buttons">
                        <button className="button" onClick={handleClean}>Clean</button>
                        <button className="button" onClick={handleRandom}>Put random text</button>
                    </div>
                    <textarea className='text-input' placeholder="Paste here your text" value = {text} onChange = {handleChange}></textarea>
                    <br/>
                    <span className="button-description-down">How many translations would you like to generate? (max 100): </span>
                    <input className="input-number" value={wordsLimit} name="wordsLimit" label="Words limit" type="number" min="0"  max="100" onChange={handlePagination}></input>
                    <br/>
                    <span className="button-description-down">Set offset: </span>
                    <input className="input-number" value={wordsOffset} name="wordsOffset" label="Words offset" type="number" onChange={handlePagination} min="0" max="1000000"></input>
                    <br/>
                    <button className="button">Generate</button>
                </form>
            </div>
        </div>
    )
}

export default HomePage;