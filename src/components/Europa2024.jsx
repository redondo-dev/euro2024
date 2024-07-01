import React, { useState, useEffect } from "react";
import axios from "axios";

const WorldCup2022 = () => {
  const [groups, setGroups] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_KEY = "6de3bfaeb3e64da8a3347409e4bf4e6b";
        const baseURL = "https://api.football-data.org/v4/competitions/2000";

        // Appels API
        const [
          groupsResponse,
          standingsResponse,
          teamsResponse,
          matchesResponse,
        ] = await Promise.all([
          axios.get(`${baseURL}/groups`, {
            headers: { "X-Auth-Token": API_KEY },
          }),
          axios.get(`${baseURL}/standings`, {
            headers: { "X-Auth-Token": API_KEY },
          }),
          axios.get(`${baseURL}/teams`, {
            headers: { "X-Auth-Token": API_KEY },
          }),
          axios.get(`${baseURL}/matches`, {
            headers: { "X-Auth-Token": API_KEY },
          }),
        ]);

        console.log("Groups Response:", groupsResponse.data);
        console.log("Standings Response:", standingsResponse.data);
        console.log("Teams Response:", teamsResponse.data);
        console.log("Matches Response:", matchesResponse.data);

        // Mise à jour des groupes avec les classements
        const updatedGroups = groupsResponse.data.groups.map((group) => {
          const groupStandings = standingsResponse.data.standings.find(
            (standing) => standing.group === group.id
          );
          return {
            ...group,
            standings: groupStandings ? groupStandings.table : [],
          };
        });

        setGroups(updatedGroups);
        setTeams(teamsResponse.data.teams || []);
        setMatches(
          matchesResponse.data.matches.filter(
            (match) => match.stage === "GROUP_STAGE"
          ) || []
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        if (error.response) {
          console.error("Data:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
          setError(
            `Erreur lors de la récupération des données: ${
              error.response.data.message || error.message
            }`
          );
        } else if (error.request) {
          console.error("Request:", error.request);
          setError(
            "Erreur lors de la récupération des données: Aucun réponse reçue du serveur"
          );
        } else {
          console.error("Error", error.message);
          setError(
            `Erreur lors de la récupération des données: ${error.message}`
          );
        }
      }
    };

    fetchData();
  }, []); // Le tableau vide [] en useEffect signifie que ce hook s'exécute une seule fois après le montage initial

  return (
    <div>
      <h1>Coupe du Monde 2022 - Groupes, Équipes et Résultats</h1>
      {error && <p>{error}</p>}

      <h2>Groupes</h2>
      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.id}>
            <h3>{group.name}</h3>
            <h4>Classement</h4>
            <table>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Équipe</th>
                  <th>Points</th>
                  <th>Différence de buts</th>
                </tr>
              </thead>
              <tbody>
                {group.standings.map((teamStanding, index) => (
                  <tr key={teamStanding.team.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={teamStanding.team.crestUrl}
                        alt={`${teamStanding.team.name} écusson`}
                        width="20"
                        height="20"
                      />{" "}
                      {teamStanding.team.name} ({teamStanding.team.tla})
                    </td>
                    <td>{teamStanding.points}</td>
                    <td>{teamStanding.goalDifference}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Équipes</h4>
            <ul>
              {group.teams.map((team) => (
                <li key={team.id}>
                  <img
                    src={team.crestUrl}
                    alt={`${team.name} écusson`}
                    width="20"
                    height="20"
                  />{" "}
                  {team.name} ({team.tla})
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Aucun groupe trouvé.</p>
      )}

      <h2>Équipes</h2>
      <ul>
        {teams.length > 0 ? (
          teams.map((team) => (
            <li key={team.id}>
              <img
                src={team.crestUrl}
                alt={`${team.name} écusson`}
                width="20"
                height="20"
              />{" "}
              {team.name} ({team.tla})
            </li>
          ))
        ) : (
          <p>Aucune équipe trouvée.</p>
        )}
      </ul>

      <h2>Résultats des Matches</h2>
      <ul>
        {matches.length > 0 ? (
          matches.map((match) => (
            <li key={match.id}>
              {match.homeTeam.name} {match.score.fullTime.homeTeam} -{" "}
              {match.awayTeam.name} {match.score.fullTime.awayTeam}
            </li>
          ))
        ) : (
          <p>Aucun match trouvé.</p>
        )}
      </ul>
    </div>
  );
};

export default WorldCup2022;
