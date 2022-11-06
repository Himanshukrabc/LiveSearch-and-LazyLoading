import React, { useState, useEffect ,useRef ,useCallback} from 'react';
import './App.css';
import Tile from './components/Tile/Tile.jsx';
import axios from 'axios'
import KMP from './KMP'
import useSearch from './useSearch';

function App(){
  const [keyword,setKeyword]=useState("");
  const [pokemonList,setPokemonList]=useState([]);
  const [suggestions,setSuggestions]=useState([]);
  const [searchList,setSearchList]=useState([]);
  const [page,setPage]=useState(1);
  const [pageNumber,setPageNumber]=useState(1);
  
  // Used to get the list of all pokemon available and the links to query their data
  useEffect(() => {
    const fetchPokemonList = async()=>{
      const list = await (await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0")).data.results;
      setPokemonList(list);
      setSearchList(list);
    };
    fetchPokemonList();
  }, []);

  // Custom Hook
  const {displayList,loading,error,hasMore}=useSearch(searchList,page);

  
  // Called when search is made.
  const searchHandler=(event)=>{
    if(event.type=="keydown"&&event.key==="Enter"&&event.target.value) {
      event.preventDefault();
      const val=event.target.value;
      event.target.value="";
      setSuggestions([]);
      setPage(1);
      setSearchList(pokemonList.filter((item)=>{return KMP(item.name,val)}));
    }
    else if(event.type=="click"){
      event.preventDefault();
      const val=event.target.innerText;
      event.target.value="";
      setSuggestions([]);
      setPage(1);
      setSearchList(pokemonList.filter((item)=>{return KMP(item.name,val)}));
    }
  }

  // Used to display suggestions for live search
  const optionsHandler=(e)=>{
    setKeyword(e.target.value);
    setPage(1);
    console.log(keyword,e.target.value);
    if(keyword===""){
      setSuggestions([]);
    } 
    else setSuggestions(pokemonList.filter((val)=>{return KMP(val.name,keyword)}).slice(0,5));
  }
    

  const observer = useRef();
  const pageObserver = useRef();
  const lastTileRef = useCallback((node)=>{
    if(loading)return;
    // Disconnectiong observer to last connected node
    if(observer.current) observer.current.disconnect();

    // Checking if the current element is the last element or not
    // if it is increase page to page +1 and load the next datapacket
    observer.current = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting&&(hasMore)){
        setPage(page+1);
      }
    });

    // checking the current node to find the page number.
    pageObserver.current = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting){
        let num=parseInt(entries[0].target.id);
        // console.log("YY");
        setPageNumber(num/8);
      }
    });

    // connect the observer to current node
    if(node)pageObserver.current.observe(node);
    if(node)observer.current.observe(node);
  },[loading,hasMore]);

  
  
  return (
    <>
    <div className="App">

      <div className="header">
        <div className="header-left" onClick={()=>{setSearchList(pokemonList);}}>
           Pokedex
        </div>
        <div className="header-right">
            <input type="text" placeholder='Search Pokemon' id='searchbar' value={keyword} onChange={optionsHandler} onKeyDown={searchHandler}/>
            {suggestions.map((val)=>{return(<div className='options' onClick={searchHandler}>{val.name}</div>)})}
        </div>
      </div>
    
      <div className="tile-list">
      {
        displayList.map((val,ind)=>{
          if(displayList.length===ind+1)return <Tile name={val.name} Fref={lastTileRef} img={val.img} idNum={ind+1}/>
          else return <Tile name={val.name} img={val.img} idNum={ind+1} Fref={null}/>
      })}
      </div>
    
      <div>{loading&&"Loading..."}</div>
    
      <div className="pagination">
        <a href={'#'}>&laquo;</a>
        <a href={`#`}>{(pageNumber<=1)?" ":pageNumber-1}</a>
        <a className="active" href={`#`}>{pageNumber}</a>
        <a href={`#`}>{pageNumber+1}</a>
        <a href={`#`}>{pageNumber+2}</a>
        <a href={'#'}>&raquo;</a>
      </div>
    
    </div>
    </>
  );
}

export default App
