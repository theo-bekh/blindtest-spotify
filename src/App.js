/*global swal*/

import React, { useEffect } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';
import { useState } from 'react';

const apiToken = "BQCLF28OHcKylqm4WE4EKbDq3XyQQngpRiM-KfDBFOUdGBb8TI9pcIuCY_NT9T4VWjeGOb2YFzmi_-uiwaLljGDgL5PFvEcIB9Fp8SzG9UTlUCwaZrTKRLujmzqYe5myjwkxCpOOQ8w0U2qOP06Jmg5Uagw1DP9LvMnIwNiisWVdqaqSrY9F2iYDplgPwf1gFbsv6Qka6gle7AfnfonyvVikrm3Qm0tH2P6qbdMDNMZZ0HGVO3559j67_5m9Vnk-MkkZXijz9U_ViHchocJpd8oV";

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

/* Display the album cover */
const AlbumCover = (props) =>  {
  const src = props.track.album.images[0].url;
  return (
      <img src={src} style={{ width: 400, height: 400 }} />
  );
}

const App = () => {

  const [songsLoaded, isLoaded] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [userReady, userIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [timeout,setTimeOut] = useState(null);

  useEffect(()=> {
    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
       Authorization: 'Bearer ' + apiToken,
      },
    })
      .then(response => response.json())
      .then((data) => {
        setTracks(data.items);
        isLoaded(true);
        setCurrentTrack(data.items[getRandomNumber(20)].track);
        console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data);
      })
  },[])

  useEffect(()=>{
    //setTimeOut(setTimeout(displayResult,30000));
  },[])

  function checkAnswer(id){
    //clearTimeout(timeout);
    if (id === currentTrack.id){
      swal('Bravo', 'C\'était bien le bon titre', 'success').then(nextPlay);
    }else{
      swal('Raté', 'C\'était '+currentTrack.name+' de '+currentTrack.artists[0].name, 'error').then(nextPlay);
    }
  }

  function displayResult(){
    //swal('Trop long', 'C\'était '+tr.name+' de '+tr.artists[0].name, 'error').then(nextPlay);
    swal('Trop long', 'Essaye encore', 'error').then(nextPlay);
  }

  function nextPlay(){
    setCurrentTrack(tracks[getRandomNumber(20)].track);
  }

  if (!songsLoaded){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        </header>
        <div className="App-images">
          <p>Blindtest est en cours de chargement</p>
        </div>
        <div className="App-buttons">
        </div>
      </div>
    );
  }
  if (!userReady){
    return(
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        </header>
        <div className="App-images">
          <p>Blindtest est en cours de chargement</p>
        </div>
        <div className="App-buttons">
        <Button onClick={() => userIsReady(true)}>Commencer le blindtest</Button>
        </div>
      </div>
    );
  }
  let choosenTracks = [];
  choosenTracks.push(currentTrack);
  choosenTracks.push(tracks[getRandomNumber(20)].track);
  choosenTracks.push(tracks[getRandomNumber(20)].track);
  choosenTracks = shuffleArray(choosenTracks);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h1 className="App-title">Bienvenue sur le Blindtest</h1>
      </header>
      <Sound url={currentTrack.preview_url} playStatus={Sound.status.PLAYING}/>
      <div className="App-images">
        {choosenTracks.map(trackChoose => 
          <AlbumCover track={trackChoose} />
          )}
      </div>
      <div className="App-buttons">
      {choosenTracks.map(track=>
        <Button onClick={()=> checkAnswer(track.id)}>
        {track.name} <br /> {track.artists[0].name}</Button>
        )}
      </div>
    </div>
  );
}

export default App;
