const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const {createRoot} = require('react-dom/client');

const handleChangePassword = (e) => {
    e.preventDefault();
    helper.hideError();

    const oldPassword = e.target.querySelector("#oldPass").value;
    const newPassword = e.target.querySelector("#newPass").value;
    const newPassword2 = e.target.querySelector("#newPass2").value;
    const username = e.target.querySelector("#username").value;

    if (oldPassword === undefined || newPassword === undefined || newPassword2 === undefined || username === undefined ||
        !oldPassword || !newPassword || !newPassword2 || !username)
    {
        helper.handleError('All fields are required!');
        return false;
    }

    if (newPassword !== newPassword2) 
    {
        helper.handleError('Passwords do not match!');
        return false;
    }
    
    helper.sendPut(e.target.action, {username, oldPassword, newPassword, newPassword2});

    return false;
};

const handlePremium = (e) => {
    e.preventDefault();
    helper.hideError();

    let premium = true;
    helper.sendPut(e.target.action, {premium})
}

const handleDeleteTeam = (e, onTeamDeleted) => {
    e.preventDefault();
    helper.hideError();

    helper.sendDelete(e.target.action, {}, onTeamDeleted);
    return false;
};

const TeamsList = (props) => {
    const [teams, setTeams] = useState(props.teams);

    useEffect(() => {
        const loadTeamsFromMongo = async () => {
        const response = await fetch("/getTeams");
            const data = await response.json();
            setTeams(data.teams);
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

    const teamNodes = teams.map(team => {
        return (
            <div key={team._id} className="team">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className='teamName'>Name: {team.name}</h3>
                <div className="teamRoles">
                    <span className="champRole">Top: {team.top}</span>
                    <span className="champRole">Jungle: {team.jungle}</span>
                    <span className="champRole">Mid: {team.mid}</span>
                    <span className="champRole">Bot: {team.bot}</span>
                    <span className="champRole">Support: {team.support}</span>
                </div>
                <form id="teamDeleteForm"
                    onSubmit={(e) => handleDeleteTeam(e, props.triggerReload)}
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

const PremiumSubscriptionWindow = (props) => {
    return (
        <form id="premiumForm"
            name="premiumForm"
            onSubmit={(e) => handlePremium(e)}
            action="/getPremium"
            method="GET"
            className="mainForm"
        >
            <h1 className='premiumTitle'>Get Premium Now!</h1>
            <p className='premiumBlurb'>Premium offers no ads! Cancel anytime!</p>
            <input className="formSubmit" type="submit" value="Get Premium"/>

        </form>
    );
};

const CancelPremiumSubscriptionWindow = (props) => {
    return (
        <form id="cancelPremiumForm"
            name="cancelPremiumForm"
            onSubmit={(e) => handlePremium(e)}
            action="/cancelPremium"
            method="GET"
            className="mainForm"
        >
            <h1 className='premiumTitle'>Already have premium?</h1>
            <p className='premiumBlurb'>Cancel subscription here. We hate to see you go! Those pesky ads will have to return from the void...</p>
            <input className="formSubmit" type="submit" value="Get Premium"/>

        </form>
    );
};

const ChangePasswordWindow = (props) => {
    return (
        <form id="changePasswordForm"
            name="changePasswordForm"
            onSubmit={(e) => handleChangePassword(e)}
            action="/changePassword"
            method="PUT"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="username" type="text" name="username" placeholder="username"/>
            <label htmlFor="oldPass">Old Password: </label>
            <input id="oldPass" type="password" name="oldPass" placeholder="old password"/>
            <label htmlFor="newPass">New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="new password"/>
            <label htmlFor="newPass2">Retype New Password: </label>
            <input id="newPass2" type="password" name="newPass2" placeholder="retype new password"/>
            <input className="formSubmit" type="submit" value="Change Password"/>

        </form>
    );
};

const TeamsViewer = () => {
    const [reloadTeams, setReloadTeams] = useState(false);

    return (
        <div>
            <TeamsList teams={[]} reloadTeams={reloadTeams} triggerReload={() => setReloadTeams(!reloadTeams)}/>
        </div>
    );
}

const PremiumViewer = () => {
    return (
        <div id='premiumSubscriptionWindow'>
            <PremiumSubscriptionWindow/>
            <CancelPremiumSubscriptionWindow/>
        </div>
    )
}

const init = () => {
    const root = createRoot(document.querySelector("#content"));

    const teamsButton = document.querySelector("#teamsButton");
    const premiumButton = document.querySelector("#premiumButton");
    const passwordChangeButton = document.querySelector("#passwordChangeButton");

    teamsButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<TeamsViewer/>);
        return false;
    });

    premiumButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<PremiumViewer/>);
        return false;
    });

    passwordChangeButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<ChangePasswordWindow/>);
        return false;
    })

    root.render(<TeamsViewer/>); 
};

window.onload = init;