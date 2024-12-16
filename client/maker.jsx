const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleTeam = (e, onTeamAdded) => {
    e.preventDefault();

    helper.hideError();

    const name = e.target.querySelector('#teamName').value;
    const top = e.target.querySelector('#topChamp').value;
    const jungle = e.target.querySelector('#jungleChamp').value;
    const mid = e.target.querySelector('#midChamp').value;
    const bot = e.target.querySelector('#botChamp').value;
    const support = e.target.querySelector('#supportChamp').value;

    if(!name) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, top, jungle, mid, bot, support}, onTeamAdded);
    return false;
};

const ChampSelectList = (props) => {
    return (
        <div id='champSelectDiv'>
            <label htmlFor="champSelect" className='champSelectLabel'>Top:</label>
            <select name="champSelect" class="champSelect" id='topChamp'> 
                {props.champNodes}
            </select>
            <label htmlFor="champSelect" className='champSelectLabel'>Jungle: </label>
            <select name="champSelect" class="champSelect" id='jungleChamp'> 
                {props.champNodes}
            </select>
            <label htmlFor="champSelect" className='champSelectLabel'>Mid: </label>
            <select name="champSelect" class="champSelect" id='midChamp'> 
                {props.champNodes}
            </select>
            <label htmlFor="champSelect" className='champSelectLabel'>Bot: </label>
            <select name="champSelect" class="champSelect" id='botChamp'> 
                {props.champNodes}
            </select>
            <label htmlFor="champSelect" className='champSelectLabel'>Support: </label>
            <select name="champSelect" class="champSelect" id='supportChamp'> 
                {props.champNodes}
            </select>
        </div>
    );
}

const TeamCreationForm = (props) => {
    const [champs, setChamps] = useState(props.champs);

    useEffect(() => {
        const loadChampsFromAPI = async () => {
            const response = await fetch("/getChampionData");
            const data = await response.json();
            const champsArray = [];
            for (let i in data)
                champsArray.push(data[i]);
            setChamps(champsArray);
        };
        loadChampsFromAPI();
    }, [props.reloadChamps]);

    if(champs.length === 0) {
        return (undefined);
    }

    const champNodes = champs.map(champ => {
        return (
            <option value={champ.id} className="champSelectOption">{champ.name.toUpperCase()}</option>
        );
    });

    return(
        <form id="teamCreationForm"
            onSubmit={(e) => handleTeam(e, props.triggerReload)}
            name="teamCreationForm"
            action="/makeTeam"
            method="POST"
            className="teamCreationForm"
        >
            <label htmlFor="teamCreationForm">Team Comp Name: </label>
            <input id="teamName" type="test" name="name" placeholder='Team Name' />
            <ChampSelectList champNodes={champNodes}/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const TeamCompViewerNavigation = (props) => {
    return (
        <form id="teamCompViewerNav"
            //onSubmit={(e) => handleDeleteChamp(e, props.triggerReload)}
            name="teamCompViewerNav"
            action="/accountPage"
            method="GET"
            className="teamCompViewerNav"
        >
            <input className="teamCompViewerSubmit" type="submit" value="View Teams"/>
        </form>
    );
}

const App = () => {
    const [reloadTeams, setReloadTeams] = useState(false);
    const [reloadChamps, setReloadChamps] = useState(false);
    const [premium, setPremium] = useState(false);
    
    useEffect(() => {
        const checkPremium = async () => {
            const response = await fetch("/checkPremium");
            const data = await response.json();
            setPremium(data.premium);
        };
        checkPremium();
    });

    console.log(premium);

    if (premium === true)
    {
        console.log("prem");
        return (
            <div>
                <div id='divNav'>
                    <TeamCompViewerNavigation/>
                </div>
                <div id="makeTeam">
                    <TeamCreationForm champs={[]} reloadChamps={reloadChamps} triggerReload={() => { 
                        setReloadChamps(!reloadChamps);
                        setReloadTeams(!reloadTeams);}}/>
                </div>
            </div>
        );
    }
    else
    {
        console.log("no prem");
        return (
            <div>
                <div className='adSpace'>adadadadadadada</div>
                <div id='divNav'>
                    <TeamCompViewerNavigation/>
                </div>
                <div id="makeTeam">
                    <TeamCreationForm champs={[]} reloadChamps={reloadChamps} triggerReload={() => { 
                        setReloadChamps(!reloadChamps);
                        setReloadTeams(!reloadTeams);}}/>
                </div>
                <div className='adSpace'>adadadadadada</div>
            </div>
        );
    }
};

const init = () => {
    const root = createRoot(document.querySelector("#app"));
    root.render( <App />);
};

window.onload = init;