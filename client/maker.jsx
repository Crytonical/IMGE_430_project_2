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

const handleDeleteTeam = (e, onTeamDeleted) => {
    e.preventDefault();
    helper.hideError();

    helper.sendDelete(e.target.action, {}, onTeamDeleted);
    return false;
};

const TeamsList = (props) => {
    const [teams, setTeams] = useState(props.teams);
    console.log("TEAMS START");

    useEffect(() => {
        const loadTeamsFromMongo = async () => {
        const response = await fetch("/getTeams", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }});
            const data = await response.json();
            const teamsArray = [];
            for (let i in data)
                teamsArray.push(data[i]);
            console.log("Teams" + teamsArray);
            setTeams(teamsArray);
        };
        loadTeamsFromMongo();
    }, [props.reloadTeams]);

    if(teams.length === 0) {
        return (
            <div className="teamList">
                <h3 className="emptyTeam">No teams created</h3>
            </div>
        );
    }

    console.log(" teams"+teams);

    const teamNodes = teams.map(team => {
        return (
            <div key={team.id} className="team">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className='teamName'>Name: {team.name}</h3>
                <form id="teamDeleteForm"
                    onSubmit={(e) => handleDeleteChamp(e, props.triggerReload)}
                    name="teamDeleteForm"
                    action="/deleteTeam"
                    method="DELETE"
                    className="teamDeleteForm"
                >
                    <input className="deleteTeamSubmit" type="submit" value="Delete Team"/>
                </form>
            </div>
        );
    });

    return (
        <div className="teamList">
            {teamNodes}
        </div>
    );
};

const ChampSelectList = (props) => {
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

    return (
        <select name="champSelect" class="champSelect">
            {champNodes}
        </select>
    );
}

const TeamCreationForm = (props) => {
    let reloadChamps = props.reloadChamps;
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
            <label htmlFor="champSelect" className='champSelectLabel'>Top:</label>
            <select name="champSelect" class="champSelect" id='topChamp'> 
                {champNodes}
            </select>
            <label htmlFor="champSelect" className='champSelectLabel'>Jungle: </label>
            <select name="champSelect" class="champSelect" id='jungleChamp'> 
                {champNodes}
            </select>
            <label htmlFor="champSelect" className='champSelectLabel'>Mid: </label>
            <select name="champSelect" class="champSelect" id='midChamp'> 
                {champNodes}
            </select>
            <label htmlFor="champSelect" className='champSelectLabel'>Bot: </label>
            <select name="champSelect" class="champSelect" id='botChamp'> 
                {champNodes}
            </select>
            <label htmlFor="champSelect" className='champSelectLabel'>Support: </label>
            <select name="champSelect" class="champSelect" id='supportChamp'> 
                {champNodes}
            </select>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const ChampList = (props) => {
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
        return (
            <div className="champList">
                <h3 className="emptyChamp">FAILED</h3>
            </div>
        );
    }

    const champNodes = champs.map(champ => {
        return (
            <div key={champ.id} className="champ">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className='champName'>Name: {champ.name.toUpperCase()}</h3>
                <h3 className='champTitle'>Title: {champ.title.toUpperCase()}</h3>
                <form id="champDeleteForm"
                    onSubmit={(e) => handleDeleteChamp(e, props.triggerReload)}
                    name="champDeleteForm"
                    action="/deleteChamp"
                    method="DELETE"
                    className="champDeleteForm"
                >
                    <input className="deleteChampSubmit" type="submit" value="Delete Champ"/>
                </form>
            </div>
        );
    });

    return (
        <div className="champList">
            {champNodes}
        </div>
    );
};

const App = () => {
    const [reloadTeams, setReloadTeams] = useState(false);
    const [reloadChamps, setReloadChamps] = useState(false);

    return (
        <div>
            <div id="makeTeam">
                <TeamCreationForm champs={[]} reloadChamps={reloadChamps} triggerReload={() => { 
                    setReloadChamps(!reloadChamps);
                    setReloadTeams(!reloadTeams);}}/>
            </div>
            <div id="teams">
                <TeamsList teams={[]} reloadTeams={reloadTeams} triggerReload={() => setReloadTeams(!reloadTeams)}/>
            </div>
            {/* <div id="champs">
                <ChampList champs={[]} reloadChamps={reloadChamps} triggerReload={() => setReloadChamps(!reloadChamps)}/>
            </div> */}
        </div>
    );
};

const init = () => {
    const root = createRoot(document.querySelector("#app"));
    root.render( <App />);
};

window.onload = init;