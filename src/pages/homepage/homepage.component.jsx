import React from 'react';

import wtf from 'wtf_wikipedia';

import exampleText from '../../data/default-text';

import './homepage.styles.scss';

const HomePage = () => {
    const [text, setText] = React.useState(exampleText);
    const [mostFrequentWords, setMostFrequentWords] = React.useState([]);
    const [wordsLimit, setWordsLimit] = React.useState(20);
    const [wordsOffset, setWordsOffset] = React.useState(0);
    console.log(`cze­kam cze­kam wy­trwa­le
    tak lek­ko do­ty­ka­ją mnie dni
    moja tę­sk­no­ta jest tę­sk­no­tą pla­net
    zmar­z­łych tę­sk­nią­cych do słoń­ca
    jest zno­wu wie­czór
    na da­chach blask księżyca lśni
    wą­skie wie­że ko­ścio­łów na­kłu­wa­ją nie­bo
    i dni tak lek­ko bie­gną nie wia­do­mo gdzie `)

    const WORDS_LIMIT_MAX = 100;

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

    const handlePagination = async event => {
        let { name, value } = event.target;
        if (value < 0) return;
        if(name === 'wordOffset') {
            value = Math.min(value, WORDS_LIMIT_MAX);
            setWordsOffset(value)
        } else {
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

        // choose n biggest words

        // Create items array
        // let str = `# {{Příznaky|cs|zast.|nář.}} [[strýc]] [[z]] [[matčin]]y [[strana|strany]]&lt;ref name=&quot;ssjc6&quot;&gt;Československá akademie věd. Ústav pro jazyk český. ''Slovník spisovného jazyka českého.'' Díl VI. Š-U. Praha: Academia, 1989. Heslo „ujec“, s. 306.&lt;/ref&gt; # {{Příznaky|cs|řidč.}} [[manžel]] [[matčin]]y [[sestra|sestry]]&lt;ref name=&quot;priruc&quot;&gt;Ústav pro jazyk český Československé akademie věd. ''Příruční slovník jazyka českého.'' Díl VI. T-Vůzek. Praha: Státní nakladatelství, 1951-1953. Heslo „ujec“, s. 438, 439.&lt;/ref&gt; # {{Příznaky|cs|nář.}} [[venkovan]], [[soused]]&lt;ref name=&quot;ssjc6&quot;/&gt; # {{Příznaky|cs|nář.}} [[výr]]&lt;ref name=&quot;ssjc6&quot;/&gt; # {{Příznaky|cs|nář.}} [[druh]] [[tlačenka|tlačenky]]&lt;ref name=&quot;priruc&quot;/&gt; # {{Příznaky|cs|nář.}} [[poduška]], [[polštář]]&lt;ref name=&quot;priruc&quot;/&gt; `

        let items = await Promise.all(Object.keys(wordsDictionary).map(async function(key) {

            return [key, wordsDictionary[key]]
        }));

        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        items = items.slice(wordsOffset, wordsLimit + wordsOffset)
        console.log(items)

        items = await Promise.all(items.map(async function(item) {
            const fetchedText = await wtf.fetch(`https://cs.wiktionary.org/wiki/${item[0]}`);

            if(!fetchedText)
                return [item[0], item[1], 'brak definicji']

            let meaning = fetchedText.sections('čeština') ? fetchedText.sections('čeština').sections('význam') : fetchedText.sections('význam')
            meaning = meaning || 'brak definicji';
            let meaningText = await wtf(meaning.data.wiki).text();
            while(meaningText.indexOf('*') != -1) {
                meaningText = meaningText.replace('*', '\n');
            }
            return [item[0], item[1], meaningText ]// await getWordData(key)]
        }));
        

        await setMostFrequentWords(items)
        
        // Create a new array with only the first 5 items
        
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
                    How many words would you like to see? (max 100)
                    <input value={wordsLimit} name={wordsLimit} label="Words limit" type="number" min="0" onChange={handlePagination}></input>
                    Set offset
                    <input value={wordsOffset} name={wordsOffset} label="Words limit" type="number" onChange={handlePagination} min="0" max="100"></input>
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