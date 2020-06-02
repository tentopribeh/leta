import React from 'react';
import wtf from 'wtf_wikipedia';

import './homepage.styles.scss';

import exampleText from '../../data/default-text';
import {getWordData} from '../../firebase/firebase.utils';

const HomePage = () => {
    const [text, setText] = React.useState(exampleText);
    const [mostFrequentWords, setMostFrequentWords] = React.useState([]);

    const handleChange = async event => {
        const { value } = event.target;
        await setText(value);
    } 

    const handleSubmit = async event => {
        event.preventDefault();
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

    const chooseWords = async textToEdit => {
        textToEdit = textToEdit.toLowerCase();
        textToEdit = textToEdit.replace(/[&\/\\#,+=()$~%.'0-9":;*_?<>{}\n]/g, ' ');

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

        // choose n biggest words
        const wordsLimit = 20;

        // Create items array
        // let str = `# {{Příznaky|cs|zast.|nář.}} [[strýc]] [[z]] [[matčin]]y [[strana|strany]]&lt;ref name=&quot;ssjc6&quot;&gt;Československá akademie věd. Ústav pro jazyk český. ''Slovník spisovného jazyka českého.'' Díl VI. Š-U. Praha: Academia, 1989. Heslo „ujec“, s. 306.&lt;/ref&gt; # {{Příznaky|cs|řidč.}} [[manžel]] [[matčin]]y [[sestra|sestry]]&lt;ref name=&quot;priruc&quot;&gt;Ústav pro jazyk český Československé akademie věd. ''Příruční slovník jazyka českého.'' Díl VI. T-Vůzek. Praha: Státní nakladatelství, 1951-1953. Heslo „ujec“, s. 438, 439.&lt;/ref&gt; # {{Příznaky|cs|nář.}} [[venkovan]], [[soused]]&lt;ref name=&quot;ssjc6&quot;/&gt; # {{Příznaky|cs|nář.}} [[výr]]&lt;ref name=&quot;ssjc6&quot;/&gt; # {{Příznaky|cs|nář.}} [[druh]] [[tlačenka|tlačenky]]&lt;ref name=&quot;priruc&quot;/&gt; # {{Příznaky|cs|nář.}} [[poduška]], [[polštář]]&lt;ref name=&quot;priruc&quot;/&gt; `
        let str = ``;
        console.log(wtf(str))

        let doc = await wtf.fetch('https://cs.wiktionary.org/wiki/l%C3%A1ska')
        console.log(wtf(doc.sections('význam').data.wiki).text())
        console.log(doc.text())
        console.log(doc.text())
        console.log(doc.text())
        console.log(doc.text())

        const items = await Promise.all(Object.keys(wordsDictionary).map(async function(key) {
            const fetchedText = await wtf.fetch(`https://cs.wiktionary.org/wiki/${key}`);

            if(!fetchedText)
                return [key, wordsDictionary[key], 'brak definicji']

            const meaning = fetchedText.sections('čeština') ? fetchedText.sections('čeština').sections('význam') : fetchedText.sections('význam')

            return [key, wordsDictionary[key], wtf(meaning.data.wiki).text()]// await getWordData(key)]
        }));
        
        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        console.log('items')
        console.log(items)

        await setMostFrequentWords(items.slice(0, wordsLimit))
        
        // Create a new array with only the first 5 items
        console.log(items.slice(0, wordsLimit));

        console.log("PPPPPP", wtf(str));
        
        return wordsDictionary;
    }
    
    return(
        <div className='home-page'>
            <div className='text-input-box'>
                <div>Put text to generate words dictionary.</div>
                <form onSubmit={handleSubmit}>
                    <button onClick={handleClean}>Clean</button>
                    <button onClick={handleRandom}>Put random text</button>
                    <textarea className='text-input' value = {text} onChange = {handleChange}></textarea>
                    <button>Generate</button>
                </form>
            </div>
            <div className='words-list-box'>
                <div className='words-list'>
                    {mostFrequentWords.map(word => <div className='word-box' key={word[0]}><div className='word'>{word[0]}</div><div className='word-meaning'>{word[2]}</div></div>)}
                </div>
            </div>
        </div>
    )
}

export default HomePage;