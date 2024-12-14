const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const apiKey = "RGAPI-a826d76f-295f-41b1-9313-687d89640cbb";

const handleTeam = (e, onTeamAdded) => {
    e.preventDefault();

    helper.hideError();

    const name = e.target.querySelector('#teamName').value;

    if(!name) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name}, onTeamAdded);
    return false;
};

const handleDeleteTeam = (e, onTeamDeleted) => {
    e.preventDefault();
    helper.hideError();

    helper.sendDelete(e.target.action, {}, onTeamDeleted);
    return false;
};

const TeamForm = (props) => {
    // Need to purge this and create team making form lol
    return(
        <form id="domoForm"
            onSubmit={(e) => handleTeam(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="domoName">Name: </label>
            <input id="domoName" type="test" name="name" placeholder='Domo Name' />
            <label htmlFor="domoAge">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" placeholder='Domo Age' />
            <label htmlFor="domoArchetype">Archetype: </label>
            <input id="domoArchetype" type="test" name="archetype" placeholder='Domo Archetype' />
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};
const TeamsList = (props) => {
    const [teams, setTeams] = useState(props.teams);

    useEffect(() => {
        const loadChampsFromAPI = async () => {
        const response = await fetch("https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=" + apiKey, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }});
            const data = await response.json();
            setTeams(data.data);
        };
        //loadChampsFromAPI();
    }, [props.reloadTeams]);

    if(teams.length === 0) {
        return (
            <div className="teamList">
                <h3 className="emptyTeam">No teams created</h3>
            </div>
        );
    }

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
        <div className="champList">
            {champNodes}
        </div>
    );
};

const ChampList = (props) => {
    const [champs, setChamps] = useState(props.champs);

    useEffect(() => {
        const loadChampsFromAPI = async () => {
        const response = await fetch("https://bpb4402-proxy-server-ca817033a3e7.herokuapp.com/https://ddragon.leagueoflegends.com/cdn/14.24.1/data/en_US/champion.json?api_key=" + apiKey, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }});
            const data = await response.json();
            setChamps(data.data);
            console.log(data);
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
                <h3 className='champName'>Name: {champ.name}</h3>
                <h3 className='champTitle'>Title: {champ.title}</h3>
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
                <TeamForm triggerReload={() => setReloadTeams(!reloadTeams)}/>
            </div>
            {/* <div id="teams">
                <TeamsList teams={[]} reloadTeams={reloadTeams} triggerReload={() => setReloadTeams(!reloadTeams)}/>
            </div> */}
            <div id="champs">
                <ChampList champs={[]} reloadChamps={reloadChamps} triggerReload={() => setReloadChamps(!reloadChamps)}/>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.querySelector("#app"));
    root.render( <App />);
};

window.onload = init;